import { NextRequest, NextResponse } from 'next/server';
import { put } from '@vercel/blob';
import { requireAuthAndRole } from '@/lib/auth';
import { logger } from '@/lib/logger';

// Allowed mime types
const ALLOWED_MIME_TYPES = ['image/jpeg', 'image/png', 'image/webp'];

// Allowed target folders for upload organization
const ALLOWED_FOLDERS = [
  'blogs',
  'casestudies',
  'newsletter',
  'portfolio',
  'team',
  'general',
] as const;

type AllowedFolder = (typeof ALLOWED_FOLDERS)[number];

// Leave room for multipart overhead below Vercel's 4.4MB request limit.
const MAX_FILE_SIZE = 4 * 1024 * 1024;
const MAX_MULTIPART_REQUEST_SIZE = MAX_FILE_SIZE + 64 * 1024;

function hasExpectedFileSignature(file: File, buffer: Buffer): boolean {
  if (file.type === 'image/jpeg') {
    return buffer.subarray(0, 3).equals(Buffer.from([0xff, 0xd8, 0xff]));
  }
  if (file.type === 'image/png') {
    return buffer
      .subarray(0, 8)
      .equals(Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]));
  }
  if (file.type === 'image/webp') {
    return (
      buffer.subarray(0, 4).equals(Buffer.from('RIFF')) &&
      buffer.subarray(8, 12).equals(Buffer.from('WEBP'))
    );
  }
  return false;
}

export async function POST(request: NextRequest) {
  // 1. Enforce Authentication & Role (Access restricted to admin/editor)
  const authCheck = await requireAuthAndRole(['admin', 'editor']);
  if (!authCheck.authorized) {
    return NextResponse.json(
      { success: false, message: authCheck.error },
      { status: authCheck.status || 401 }
    );
  }

  const contentLength = Number(request.headers.get('content-length'));
  if (
    !Number.isFinite(contentLength) ||
    contentLength <= 0 ||
    contentLength > MAX_MULTIPART_REQUEST_SIZE
  ) {
    return NextResponse.json(
      { success: false, message: 'Upload request exceeds the 4MB limit.' },
      { status: 413 }
    );
  }

  try {
    // 2. Parse Multipart Form Data
    const formData = await request.formData();
    const file = formData.get('file');

    if (!(file instanceof File) || file.size === 0) {
      return NextResponse.json({ success: false, message: 'No file provided.' }, { status: 400 });
    }

    // 3. Validate File Size
    if (file.size > MAX_FILE_SIZE) {
      return NextResponse.json(
        { success: false, message: 'File size exceeds the 4MB limit.' },
        { status: 400 }
      );
    }

    // 4. Validate File Type
    if (!ALLOWED_MIME_TYPES.includes(file.type)) {
      return NextResponse.json(
        {
          success: false,
          message: 'Invalid file type. Only JPEG, PNG, and WEBP are allowed.',
        },
        { status: 400 }
      );
    }

    // 5. Parse folder query parameter and categorize
    const { searchParams } = new URL(request.url);
    const folderParam = searchParams.get('folder')?.toLowerCase() || '';
    const folder: AllowedFolder = ALLOWED_FOLDERS.includes(folderParam as AllowedFolder)
      ? (folderParam as AllowedFolder)
      : 'general';

    // Generate sanitized unique filename
    const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
    const sanitizedName = file.name.replace(/[^a-zA-Z0-9.-]/g, '_');
    const filename = `${uniqueSuffix}-${sanitizedName}`;

    // Read file contents to Buffer
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    if (!hasExpectedFileSignature(file, buffer)) {
      return NextResponse.json(
        { success: false, message: 'The file contents do not match the declared file type.' },
        { status: 400 }
      );
    }

    // Public editorial images must survive server restarts and redeployments.
    const blob = await put(`uploads/${folder}/${filename}`, buffer, {
      access: 'public',
      contentType: file.type,
      addRandomSuffix: true,
    });
    const fileUrl = blob.url;
    logger.info('[Upload API] Image saved to persistent storage.');

    return NextResponse.json({
      success: true,
      message: 'File uploaded successfully.',
      url: fileUrl,
      filename,
    });
  } catch (error) {
    logger.error('[Upload API] Error processing file upload:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to upload file due to an internal server error.' },
      { status: 500 }
    );
  }
}
