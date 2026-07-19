import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { rateLimit } from '@/lib/rate-limit';
import { NewsletterSchema } from '@/schemas/lead';

export async function POST(request: NextRequest) {
  // Extract client IP address for rate limiting
  const forwardedFor = request.headers.get('x-forwarded-for');
  const ip = forwardedFor ? forwardedFor.split(',')[0].trim() : '127.0.0.1';

  // 1. Rate Limiting: Max 10 subscription attempts per minute per IP
  const rateLimitResult = await rateLimit(ip, 10, 60000);
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
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json(
      { success: false, message: 'Malformed JSON payload.' },
      { status: 400 }
    );
  }

  // 2. Zod Validation
  const validationResult = NewsletterSchema.safeParse(body);
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
    // 3. Check if already subscribed
    const existing = await db.lead.findFirst({
      where: {
        email,
        type: 'NEWSLETTER',
      },
    });

    if (existing) {
      return NextResponse.json(
        {
          success: true,
          message: 'You are already subscribed to our newsletter!',
        },
        { status: 200 }
      );
    }

    // 4. Database Insertion
    const lead = await db.lead.create({
      data: {
        type: 'NEWSLETTER',
        status: 'NEW',
        email,
      },
    });

    // TODO: Issue 15 Integration - Trigger Resend email notification
    console.log(`[Notification Placeholder] Email notification for Newsletter Lead ID: ${lead.id}`);

    return NextResponse.json(
      {
        success: true,
        message: 'Thank you for subscribing to our newsletter!',
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('Error creating newsletter subscription:', error);
    return NextResponse.json(
      {
        success: false,
        message: 'An unexpected database error occurred. Please try again later.',
      },
      { status: 500 }
    );
  }
}
