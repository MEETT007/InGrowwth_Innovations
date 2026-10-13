import { NextRequest, NextResponse } from 'next/server';
import { promises as fs } from 'fs';
import path from 'path';
import { logger } from '@/lib/logger';
import { rateLimit } from '@/lib/rate-limit';
import { getClientIp, requireSameOrigin } from '@/lib/request-security';

// Allowed mime types for quote attachments (RFPs, specifications, decks, wireframes)
const ALLOWED_MIME_TYPES = [
  'application/pdf',
  'application/msword',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  'application/vnd.ms-excel',
  'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  'text/plain',
  'text/markdown',
  'image/jpeg',
  'image/png',
  'image/webp',
];

// Max file size: 10MB
const MAX_FILE_SIZE = 10 * 1024 * 1024;
const MAX_MULTIPART_REQUEST_SIZE = MAX_FILE_SIZE + 64 * 1024;

export async function POST(request: NextRequest) {
  // 1. Same-origin protection
  const sameOriginError = requireSameOrigin(request);
  if (sameOriginError) return sameOriginError;

  // 2. Rate limiting: 10 uploads per 10 minutes per IP
  const ip = getClientIp(request);
  const rateLimitResult = await rateLimit(ip, 10, 600000, 'quote_upload');
  if (!rateLimitResult.success) {
    return NextResponse.json(
      {
        success: false,
        message: 'Upload limit reached. Please wait before uploading another file.',
      },
      { status: 429 }
    );
  }

  const contentLength = Number(request.headers.get('content-length'));
  if (
    !Number.isFinite(contentLength) ||
    contentLength <= 0 ||
    contentLength > MAX_MULTIPART_REQUEST_SIZE
  ) {
    return NextResponse.json(
      { success: false, message: 'Upload file exceeds the 10MB limit.' },
      { status: 413 }
    );
  }

  try {
    const formData = await request.formData();
    const file = formData.get('file') as File | null;

    if (!file) {
      return NextResponse.json({ success: false, message: 'No file provided.' }, { status: 400 });
    }

    if (file.size > MAX_FILE_SIZE) {
      return NextResponse.json(
        { success: false, message: 'File size exceeds the 10MB limit.' },
        { status: 400 }
      );
    }

    if (!ALLOWED_MIME_TYPES.includes(file.type)) {
      return NextResponse.json(
        {
          success: false,
          message:
            'Invalid file format. Please upload a PDF, Word document, spreadsheet, or image.',
        },
        { status: 400 }
      );
    }

    const folder = 'quotes';
    const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
    const sanitizedName = file.name.replace(/[^a-zA-Z0-9.-]/g, '_');
    const filename = `${uniqueSuffix}-${sanitizedName}`;

    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    // Save directly to public/uploads/quotes/ folder
    const uploadDir = path.join(process.cwd(), 'public', 'uploads', folder);
    await fs.mkdir(uploadDir, { recursive: true });

    const filePath = path.join(uploadDir, filename);
    await fs.writeFile(filePath, buffer);

    const localUrl = `/uploads/${folder}/${filename}`;
    logger.info(`[Quote Upload] Requirements file stored in folder: ${localUrl}`);

    return NextResponse.json({
      success: true,
      message: 'Requirements document uploaded successfully.',
      url: localUrl,
      filename: file.name,
      size: file.size,
    });
  } catch (error) {
    logger.error('[Quote Upload] Error processing upload:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to upload document. Please try again.' },
      { status: 500 }
    );
  }
}
