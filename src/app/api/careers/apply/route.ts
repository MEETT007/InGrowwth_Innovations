import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { rateLimit } from '@/lib/rate-limit';
import { sendApplicationAdminEmail, sendApplicationConfirmationEmail } from '@/lib/mail';
import {
  getClientIp,
  getIdempotencyKey,
  requireSameOrigin,
} from '@/lib/request-security';
import { claimIdempotencyKey } from '@/lib/replay-protection';
import { logger } from '@/lib/logger';
import { promises as fs } from 'fs';
import path from 'path';
import { PutObjectCommand } from '@aws-sdk/client-s3';
import { s3Client, BUCKET_NAME, isS3Configured, getS3KeyPrefix } from '@/lib/s3';
import { env } from '@/lib/env';

// Allowed mime types
const ALLOWED_MIME_TYPES = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
const MAX_FILE_SIZE = 5 * 1024 * 1024;

export async function POST(request: NextRequest) {
  const sameOriginError = requireSameOrigin(request);
  if (sameOriginError) return sameOriginError;

  const idempotencyKey = getIdempotencyKey(request);
  if (!idempotencyKey) {
    return NextResponse.json(
      { success: false, message: 'A valid Idempotency-Key header is required.' },
      { status: 400 }
    );
  }

  const ip = getClientIp(request);

  // Rate Limiting: Max 3 submissions per minute per IP
  const rateLimitResult = await rateLimit(ip, 3, 60000, 'careers_apply');
  if (!rateLimitResult.success) {
    return NextResponse.json(
      { success: false, message: 'Too many application requests. Please wait.' },
      { status: 429 }
    );
  }

  try {
    const formData = await request.formData();
    
    const candidateName = formData.get('candidateName') as string;
    const email = formData.get('email') as string;
    const phone = formData.get('phone') as string;
    const roleAppliedFor = formData.get('roleAppliedFor') as string;
    const coverLetter = formData.get('coverLetter') as string;
    const file = formData.get('resume') as File | null;

    if (!candidateName || !email || !roleAppliedFor) {
      return NextResponse.json(
        { success: false, message: 'Missing required fields.' },
        { status: 400 }
      );
    }

    if (!(await claimIdempotencyKey('careers_apply', idempotencyKey))) {
      return NextResponse.json(
        { success: false, message: 'This application has already been processed.' },
        { status: 409 }
      );
    }

    let resumeUrl = null;

    // File Upload handling
    if (file) {
      if (file.size > MAX_FILE_SIZE) {
        return NextResponse.json({ success: false, message: 'Resume exceeds 5MB.' }, { status: 400 });
      }

      if (!ALLOWED_MIME_TYPES.includes(file.type)) {
        return NextResponse.json({ success: false, message: 'Invalid resume type. Only PDF and Word docs are allowed.' }, { status: 400 });
      }

      const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
      const sanitizedName = file.name.replace(/[^a-zA-Z0-9.-]/g, '_');
      const filename = `${uniqueSuffix}-${sanitizedName}`;
      const prefix = getS3KeyPrefix();
      const key = `${prefix}resumes/${filename}`;

      const arrayBuffer = await file.arrayBuffer();
      const buffer = Buffer.from(arrayBuffer);

      if (isS3Configured() && s3Client) {
        const region = env.AWS_REGION;
        await s3Client.send(
          new PutObjectCommand({
            Bucket: BUCKET_NAME,
            Key: key,
            Body: buffer,
            ContentType: file.type,
          })
        );
        resumeUrl = `https://${BUCKET_NAME}.s3.${region}.amazonaws.com/${key}`;
      } else {
        const uploadDir = path.join(process.cwd(), 'public', 'uploads', 'resumes');
        await fs.mkdir(uploadDir, { recursive: true });
        const filePath = path.join(uploadDir, filename);
        await fs.writeFile(filePath, buffer);
        resumeUrl = `/uploads/resumes/${filename}`;
      }
    }

    // Database Insertion
    const application = await db.jobApplication.create({
      data: {
        candidateName,
        email,
        phone,
        roleAppliedFor,
        coverLetter,
        resumeUrl,
        status: 'NEW',
      },
    });

    // Trigger emails in background
    void (async () => {
      await sendApplicationAdminEmail(application);
      await sendApplicationConfirmationEmail(application);
    })();

    return NextResponse.json(
      { success: true, message: 'Your application has been submitted successfully!' },
      { status: 201 }
    );
  } catch (error) {
    logger.error('Error submitting job application:', error);
    return NextResponse.json(
      { success: false, message: 'An unexpected error occurred. Please try again later.' },
      { status: 500 }
    );
  }
}
