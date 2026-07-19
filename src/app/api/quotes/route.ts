import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { rateLimit } from '@/lib/rate-limit';
import { QuoteSchema } from '@/schemas/lead';

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
        message: 'Too many quote requests from your IP. Please wait a minute and try again.',
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
  const validationResult = QuoteSchema.safeParse(body);
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

    // TODO: Issue 15 Integration - Trigger Resend email notification
    console.log(`[Notification Placeholder] Email notification for Quote Lead ID: ${lead.id}`);

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
