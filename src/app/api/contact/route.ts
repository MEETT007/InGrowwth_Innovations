import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { rateLimit } from '@/lib/rate-limit';
import { ContactSchema } from '@/schemas/lead';
import { sendLeadEmails } from '@/lib/mail';

export async function POST(request: NextRequest) {
  // Extract client IP address for rate limiting
  const forwardedFor = request.headers.get('x-forwarded-for');
  const ip = forwardedFor ? forwardedFor.split(',')[0].trim() : '127.0.0.1';

  // 1. Rate Limiting: Max 5 submissions per minute per IP
  const rateLimitResult = await rateLimit(ip, 5, 60000);
  if (!rateLimitResult.success) {
    return NextResponse.json(
      {
        success: false,
        message: 'Too many contact requests from your IP. Please wait a minute and try again.',
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
  const validationResult = ContactSchema.safeParse(body);
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

  const { name, email, subject, message } = validationResult.data;

  try {
    // 3. Deduplication: check for identical submissions within the last 5 minutes
    const cutoff = new Date(Date.now() - 5 * 60 * 1000);
    const existing = await db.lead.findFirst({
      where: {
        email,
        subject,
        type: 'CONTACT',
        createdAt: { gte: cutoff },
      },
    });

    if (existing) {
      return NextResponse.json(
        {
          success: false,
          message:
            'You have already submitted a similar inquiry recently. Please wait a few minutes.',
        },
        { status: 409 }
      );
    }

    // 4. Database Insertion
    const lead = await db.lead.create({
      data: {
        type: 'CONTACT',
        status: 'NEW',
        name,
        email,
        subject,
        message,
      },
    });

    // Trigger Resend email notification in the background (non-blocking, errors handled gracefully)
    void sendLeadEmails(lead);

    return NextResponse.json(
      {
        success: true,
        message: 'Your inquiry has been submitted successfully! We will contact you soon.',
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('Error creating contact lead:', error);
    return NextResponse.json(
      {
        success: false,
        message: 'An unexpected database error occurred. Please try again later.',
      },
      { status: 500 }
    );
  }
}
