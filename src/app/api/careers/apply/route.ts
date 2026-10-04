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

// PDF MIME types and maximum file size (10 MB)
const ALLOWED_PDF_MIME_TYPES = [
  'application/pdf',
  'application/x-pdf',
  'application/acrobat',
  'applications/vnd.pdf',
  'text/pdf',
  'text/x-pdf',
];
const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB

export async function POST(request: NextRequest) {
  const sameOriginError = requireSameOrigin(request);
  if (sameOriginError) return sameOriginError;

  const idempotencyKey = getIdempotencyKey(request) || `app-${Date.now()}-${Math.random().toString(36).substring(2, 15)}`;

  const ip = getClientIp(request);

  // Rate Limiting: 10/min in development, 3/min in production
  const maxAttempts = env.isDevelopment ? 10 : 3;
  const rateLimitResult = await rateLimit(ip, maxAttempts, 60000, 'careers_apply');
  if (!rateLimitResult.success) {
    return NextResponse.json(
      { success: false, message: 'Too many application attempts. Please wait a minute before trying again.' },
      { status: 429 }
    );
  }

  try {
    const formData = await request.formData();

    const candidateName = (formData.get('candidateName') as string)?.trim();
    const email = (formData.get('email') as string)?.trim().toLowerCase();
    const phone = (formData.get('phone') as string)?.trim() || null;
    const roleAppliedFor = (formData.get('roleAppliedFor') as string)?.trim();
    
    // Professional profiles
    const linkedInUrl = (formData.get('linkedInUrl') as string)?.trim();
    const githubUrl = (formData.get('githubUrl') as string)?.trim() || null;
    const portfolioUrl = (formData.get('portfolioUrl') as string)?.trim() || null;

    // Experience & Candidate details
    const currentLocation = (formData.get('currentLocation') as string)?.trim() || null;
    const experienceYears = (formData.get('experienceYears') as string)?.trim() || null;
    const noticePeriod = (formData.get('noticePeriod') as string)?.trim() || null;
    const currentCompany = (formData.get('currentCompany') as string)?.trim() || null;
    const expectedSalary = (formData.get('expectedSalary') as string)?.trim() || null;
    const userCoverLetter = (formData.get('coverLetter') as string)?.trim() || null;

    const file = formData.get('resume') as File | null;

    // 1. Validate required candidate details
    if (!candidateName || candidateName.length < 2) {
      return NextResponse.json(
        { success: false, message: 'Please provide your full legal name.' },
        { status: 400 }
      );
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email || !emailRegex.test(email)) {
      return NextResponse.json(
        { success: false, message: 'Please provide a valid email address.' },
        { status: 400 }
      );
    }

    if (!phone || phone.length < 6) {
      return NextResponse.json(
        { success: false, message: 'Please provide a valid phone number with country code.' },
        { status: 400 }
      );
    }

    if (!roleAppliedFor) {
      return NextResponse.json(
        { success: false, message: 'Role applied for is required.' },
        { status: 400 }
      );
    }

    // 2. Validate LinkedIn profile URL (MANDATORY per MNC standard)
    if (!linkedInUrl) {
      return NextResponse.json(
        { success: false, message: 'LinkedIn profile URL is required.' },
        { status: 400 }
      );
    }

    if (!linkedInUrl.toLowerCase().includes('linkedin.com')) {
      return NextResponse.json(
        { success: false, message: 'Please provide a valid LinkedIn profile URL (e.g., https://linkedin.com/in/yourname).' },
        { status: 400 }
      );
    }

    // 3. Mandatory Resume in PDF format validation
    if (!file || !(file instanceof File) || file.size === 0) {
      return NextResponse.json(
        { success: false, message: 'Please upload your resume in PDF format (.pdf).' },
        { status: 400 }
      );
    }

    if (file.size > MAX_FILE_SIZE) {
      return NextResponse.json(
        { success: false, message: 'Resume file size exceeds the 10MB limit.' },
        { status: 400 }
      );
    }

    const hasPdfExtension = file.name.toLowerCase().endsWith('.pdf');
    const hasPdfMime = ALLOWED_PDF_MIME_TYPES.includes(file.type.toLowerCase()) || file.type === '';

    if (!hasPdfExtension && !hasPdfMime) {
      return NextResponse.json(
        { success: false, message: 'Invalid file format. Please upload your resume strictly as a PDF (.pdf).' },
        { status: 400 }
      );
    }

    // 4. Construct Structured Candidate Dossier
    const dossierSections = [
      `=== CANDIDATE DOSSIER ===`,
      `• LinkedIn: ${linkedInUrl}`,
      githubUrl ? `• GitHub: ${githubUrl}` : null,
      portfolioUrl ? `• Portfolio: ${portfolioUrl}` : null,
      currentLocation ? `• Location: ${currentLocation}` : null,
      experienceYears ? `• Experience Level: ${experienceYears}` : null,
      noticePeriod ? `• Notice Period: ${noticePeriod}` : null,
      currentCompany ? `• Current / Prev Org: ${currentCompany}` : null,
      expectedSalary ? `• Expected CTC: ${expectedSalary}` : null,
      '',
      userCoverLetter ? `=== COVER LETTER / NOTE ===\n${userCoverLetter}` : null,
    ].filter(Boolean).join('\n');

    // Replay / Idempotency protection
    if (!(await claimIdempotencyKey('careers_apply', idempotencyKey))) {
      return NextResponse.json(
        { success: false, message: 'This application has already been processed.' },
        { status: 409 }
      );
    }

    let resumeUrl: string | null = null;

    // 5. Process Resume Upload
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
          ContentType: 'application/pdf',
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

    // 6. Save Application in Database
    const application = await db.jobApplication.create({
      data: {
        candidateName,
        email,
        phone,
        roleAppliedFor,
        coverLetter: dossierSections,
        resumeUrl,
        status: 'NEW',
      },
    });

    logger.info(`[Careers API] Created JobApplication ID: ${application.id} for ${roleAppliedFor}`);

    // 7. Trigger notifications asynchronously
    void (async () => {
      try {
        await Promise.allSettled([
          sendApplicationAdminEmail(application, linkedInUrl),
          sendApplicationConfirmationEmail(application),
        ]);
      } catch (mailError) {
        logger.error('[Careers API] Error sending application notification emails:', mailError);
      }
    })();

    return NextResponse.json(
      {
        success: true,
        message: 'Your application has been submitted successfully!',
        data: {
          id: application.id,
          roleAppliedFor: application.roleAppliedFor,
          candidateName: application.candidateName,
        },
      },
      { status: 201 }
    );
  } catch (error) {
    logger.error('Error submitting job application:', error);
    return NextResponse.json(
      { success: false, message: 'An unexpected error occurred while processing your application. Please try again.' },
      { status: 500 }
    );
  }
}
