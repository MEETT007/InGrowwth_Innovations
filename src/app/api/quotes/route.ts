import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { rateLimit } from '@/lib/rate-limit';
import { QuoteSchema } from '@/schemas/lead';
import { sendLeadEmails } from '@/lib/mail';
import {
  getClientIp,
  getIdempotencyKey,
  readJsonBody,
  requireSameOrigin,
} from '@/lib/request-security';
import { claimIdempotencyKey } from '@/lib/replay-protection';

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

  // 1. Rate Limiting: Max 5 submissions per minute per IP
  const rateLimitResult = await rateLimit(ip, 5, 60000, 'quote');
  if (!rateLimitResult.success) {
    return NextResponse.json(
      {
        success: false,
        message: 'Too many quote requests from your IP. Please wait a minute and try again.',
      },
      { status: 429 }
    );
  }

  // Parse request body safely
  const parsedBody = await readJsonBody(request);
  if (!parsedBody.ok) return parsedBody.response;

  // 2. Zod Validation
  const validationResult = QuoteSchema.safeParse(parsedBody.data);
  if (!validationResult.success) {
    return NextResponse.json(
      {
        success: false,
        message: 'Validation failed.',
        errors: validationResult.error.flatten().fieldErrors,
      },
      { status: 400 }
    );
  }

  const { name, email, phone, service, budget, timeline, projectDetails, fileUrl } =
    validationResult.data;

  try {
    if (!(await claimIdempotencyKey('quote', idempotencyKey))) {
      return NextResponse.json(
        { success: false, message: 'This submission has already been processed.' },
        { status: 409 }
      );
    }

    // 3. Deduplication: check for duplicate quote request for the same service in last 5 minutes
    const cutoff = new Date(Date.now() - 5 * 60 * 1000);
    const existing = await db.lead.findFirst({
      where: {
        email,
        type: 'QUOTE',
        service,
        createdAt: { gte: cutoff },
      },
    });

    if (existing) {
      return NextResponse.json(
        {
          success: false,
          message:
            'You have already submitted a quote request for this service recently. Please wait a few minutes.',
        },
        { status: 409 }
      );
    }

    // 4. Database Insertion
    const lead = await db.lead.create({
      data: {
        type: 'QUOTE',
        status: 'NEW',
        name,
        email,
        phone: phone || null,
        service,
        budget,
        timeline,
        projectDetails,
        fileUrl: fileUrl || null,
      },
    });

    // Trigger Resend email notification in the background (non-blocking, errors handled gracefully)
    void sendLeadEmails(lead);

    return NextResponse.json(
      {
        success: true,
        message: 'Your quote request has been submitted successfully! Our team is reviewing it.',
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('Error creating quote lead:', error);
    return NextResponse.json(
      {
        success: false,
        message: 'An unexpected database error occurred. Please try again later.',
      },
      { status: 500 }
    );
  }
}
