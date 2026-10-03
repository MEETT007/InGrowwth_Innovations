import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { rateLimit } from '@/lib/rate-limit';
import { NewsletterSchema } from '@/schemas/lead';
import { sendNewsletterWelcomeEmail } from '@/lib/mail';
import {
  getClientIp,
  getIdempotencyKey,
  readJsonBody,
  requireSameOrigin,
} from '@/lib/request-security';
import { claimIdempotencyKey } from '@/lib/replay-protection';
import { logger } from '@/lib/logger';

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

  // 1. Rate Limiting: Max 10 subscription attempts per minute per IP
  const rateLimitResult = await rateLimit(ip, 10, 60000, 'newsletter');
  if (!rateLimitResult.success) {
    return NextResponse.json(
      {
        success: false,
        message: 'Too many subscription attempts from your IP. Please try again later.',
      },
      { status: 429 }
    );
  }

  // Parse request body safely
  const parsedBody = await readJsonBody(request);
  if (!parsedBody.ok) return parsedBody.response;

  // 2. Zod Validation
  const validationResult = NewsletterSchema.safeParse(parsedBody.data);
  if (!validationResult.success) {
    return NextResponse.json(
      {
        success: false,
        message: 'Invalid email address.',
      },
      { status: 400 }
    );
  }

  const { email } = validationResult.data;

  try {
    if (!(await claimIdempotencyKey('newsletter', idempotencyKey))) {
      return NextResponse.json(
        { success: false, message: 'This submission has already been processed.' },
        { status: 409 }
      );
    }

    // 3. Check if already subscribed
    const existing = await db.newsletterSubscriber.findUnique({
      where: {
        email,
      },
    });

    if (existing) {
      if (existing.status !== 'ACTIVE') {
        // Reactivate subscription if it was unsubscribed
        await db.newsletterSubscriber.update({
          where: { email },
          data: { status: 'ACTIVE' },
        });
        void sendNewsletterWelcomeEmail(email);
        return NextResponse.json(
          {
            success: true,
            message: 'Welcome back! You have re-subscribed to our newsletter.',
          },
          { status: 200 }
        );
      }
      return NextResponse.json(
        {
          success: true,
          message: 'You are already subscribed to our newsletter!',
        },
        { status: 200 }
      );
    }

    // 4. Database Insertion
    await db.newsletterSubscriber.create({
      data: {
        email,
        status: 'ACTIVE',
      },
    });

    // Trigger Resend email notification in the background
    void sendNewsletterWelcomeEmail(email);

    return NextResponse.json(
      {
        success: true,
        message: 'Thank you for subscribing to our newsletter!',
      },
      { status: 201 }
    );
  } catch (error) {
    logger.error('Error creating newsletter subscription:', error);
    return NextResponse.json(
      {
        success: false,
        message: 'An unexpected database error occurred. Please try again later.',
      },
      { status: 500 }
    );
  }
}
