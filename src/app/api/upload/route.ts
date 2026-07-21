import { NextRequest, NextResponse } from 'next/server';
import { promises as fs } from 'fs';
import path from 'path';
import { PutObjectCommand } from '@aws-sdk/client-s3';
import { requireAuthAndRole } from '@/lib/auth';
import { s3Client, BUCKET_NAME, isS3Configured } from '@/lib/s3';

// Allowed mime types
const ALLOWED_MIME_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'application/pdf'];

// Max file size: 5MB
const MAX_FILE_SIZE = 5 * 1024 * 1024;

export async function POST(request: NextRequest) {
  // 1. Enforce Authentication & Role (Access restricted to admin/editor)
  const authCheck = await requireAuthAndRole(['admin', 'editor']);
  if (!authCheck.authorized) {
    return NextResponse.json(
      { success: false, message: authCheck.error },
      { status: authCheck.status || 401 }
    );
  }

  try {
    // 2. Parse Multipart Form Data
    const formData = await request.formData();
    const file = formData.get('file') as File | null;

    if (!file) {
      return NextResponse.json({ success: false, message: 'No file provided.' }, { status: 400 });
    }

    // 3. Validate File Size
    if (file.size > MAX_FILE_SIZE) {
      return NextResponse.json(
        { success: false, message: 'File size exceeds the 5MB limit.' },
        { status: 400 }
      );
    }

    // 4. Validate File Type
    if (!ALLOWED_MIME_TYPES.includes(file.type)) {
      return NextResponse.json(
        {
          success: false,
          message: 'Invalid file type. Only JPEG, PNG, WEBP, and PDF are allowed.',
        },
        { status: 400 }
      );
    }

    // 5. Parse folder query parameter and validate
    const { searchParams } = new URL(request.url);
    const folderParam = searchParams.get('folder') || '';
    const folder = ['blogs', 'portfolio', 'team', 'resumes'].includes(folderParam)
      ? folderParam
      : 'general';

    // Generate sanitized unique filename
    const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
    const sanitizedName = file.name.replace(/[^a-zA-Z0-9.-]/g, '_');
    const filename = `${uniqueSuffix}-${sanitizedName}`;
    const key = `${folder}/${filename}`;

    // Read file contents to Buffer
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    // 6. Handle S3 Upload or Local Fallback
    if (isS3Configured() && s3Client) {
      console.info(`[Upload API] Uploading ${key} to S3 bucket ${BUCKET_NAME}`);

      const region = process.env.AWS_REGION || 'us-east-1';
      await s3Client.send(
        new PutObjectCommand({
          Bucket: BUCKET_NAME,
          Key: key,
          Body: buffer,
          ContentType: file.type,
          // AWS recommends avoiding ACLs ('public-read') and using Bucket Policies instead
        })
      );

      const s3Url = `https://${BUCKET_NAME}.s3.${region}.amazonaws.com/${key}`;

      return NextResponse.json({
        success: true,
        message: 'File uploaded successfully to S3.',
        url: s3Url,
        filename,
      });
    } else {
      console.warn(
        `[Upload API] S3 is not configured. Falling back to local storage inside folder: ${folder}`
      );

      const uploadDir = path.join(process.cwd(), 'public', 'uploads', folder);

      // Ensure the directory exists
      await fs.mkdir(uploadDir, { recursive: true });

      const filePath = path.join(uploadDir, filename);
      await fs.writeFile(filePath, buffer);

      const localUrl = `/uploads/${folder}/${filename}`;

      return NextResponse.json({
        success: true,
        message: 'File saved locally (fallback mode).',
        url: localUrl,
        filename,
      });
    }
  } catch (error) {
    console.error('[Upload API] Error processing file upload:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to upload file due to an internal server error.' },
      { status: 500 }
    );
  }
}
