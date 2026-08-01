'use server';

import { db } from '@/lib/db';
import { rateLimit } from '@/lib/rate-limit';
import {
  ContactSchema,
  QuoteSchema,
  NewsletterSchema,
  ContactInput,
  QuoteInput,
  NewsletterInput,
} from '@/schemas/lead';
import { sendLeadEmails } from '@/lib/mail';
import { headers } from 'next/headers';
import { isValidIdempotencyKey } from '@/lib/request-security';
import { claimIdempotencyKey } from '@/lib/replay-protection';

async function getClientIp(): Promise<string> {
  const headersList = await headers();
  const candidate = headersList.get('x-forwarded-for')?.split(',', 1)[0]?.trim() || 'unknown';
  return /^[0-9a-fA-F:.]{3,45}$/.test(candidate) ? candidate : 'unknown';
}

/**
 * Server action to submit a contact inquiry form
 */
export async function submitContactAction(rawInput: ContactInput, idempotencyKey: string) {
  const ip = await getClientIp();

  // Rate Limiting: Max 5 submissions per minute per IP
  const rateLimitResult = await rateLimit(ip, 5, 60000, 'contact');
  if (!rateLimitResult.success) {
    return {
      success: false,
      message: 'Too many contact requests from your IP. Please wait a minute and try again.',
    };
  }

  // Zod Validation
  const validationResult = ContactSchema.safeParse(rawInput);
  if (!validationResult.success) {
    return {
      success: false,
      message: 'Validation failed.',
      errors: validationResult.error.flatten().fieldErrors,
    };
  }

  if (!isValidIdempotencyKey(idempotencyKey)) {
    return { success: false, message: 'Invalid submission identifier. Please try again.' };
  }

  const { name, email, subject, message } = validationResult.data;

  try {
    if (!(await claimIdempotencyKey('contact', idempotencyKey))) {
      return { success: false, message: 'This submission has already been processed.' };
    }

    // Deduplication: check for identical submissions within the last 5 minutes
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
      return {
        success: false,
        message:
          'You have already submitted a similar inquiry recently. Please wait a few minutes.',
      };
    }

    // Database Insertion
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

    return {
      success: true,
      message: 'Your inquiry has been submitted successfully! We will contact you soon.',
    };
  } catch (error) {
    console.error('Error creating contact lead:', error);
    return {
      success: false,
      message: 'An unexpected database error occurred. Please try again later.',
    };
  }
}

/**
 * Server action to submit a quote request form
 */
export async function submitQuoteAction(rawInput: QuoteInput, idempotencyKey: string) {
  const ip = await getClientIp();

  // Rate Limiting: Max 5 submissions per minute per IP
  const rateLimitResult = await rateLimit(ip, 5, 60000, 'quote');
  if (!rateLimitResult.success) {
    return {
      success: false,
      message: 'Too many quote requests from your IP. Please wait a minute and try again.',
    };
  }

  // Zod Validation
  const validationResult = QuoteSchema.safeParse(rawInput);
  if (!validationResult.success) {
    return {
      success: false,
      message: 'Validation failed.',
      errors: validationResult.error.flatten().fieldErrors,
    };
  }

  if (!isValidIdempotencyKey(idempotencyKey)) {
    return { success: false, message: 'Invalid submission identifier. Please try again.' };
  }

  const { name, email, phone, service, budget, timeline, projectDetails, fileUrl } =
    validationResult.data;

  try {
    if (!(await claimIdempotencyKey('quote', idempotencyKey))) {
      return { success: false, message: 'This submission has already been processed.' };
    }

    // Deduplication: check for duplicate quote request for the same service in last 5 minutes
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
      return {
        success: false,
        message:
          'You have already submitted a quote request for this service recently. Please wait a few minutes.',
      };
    }

    // Database Insertion
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

    return {
      success: true,
      message: 'Your quote request has been submitted successfully! Our team is reviewing it.',
    };
  } catch (error) {
    console.error('Error creating quote lead:', error);
    return {
      success: false,
      message: 'An unexpected database error occurred. Please try again later.',
    };
  }
}

/**
 * Server action to subscribe to the newsletter
 */
export async function subscribeNewsletterAction(rawInput: NewsletterInput, idempotencyKey: string) {
  const ip = await getClientIp();

  // Rate Limiting: Max 10 subscription attempts per minute per IP
  const rateLimitResult = await rateLimit(ip, 10, 60000, 'newsletter');
  if (!rateLimitResult.success) {
    return {
      success: false,
      message: 'Too many subscription attempts from your IP. Please try again later.',
    };
  }

  // Zod Validation
  const validationResult = NewsletterSchema.safeParse(rawInput);
  if (!validationResult.success) {
    return {
      success: false,
      message: 'Invalid email address.',
    };
  }

  if (!isValidIdempotencyKey(idempotencyKey)) {
    return { success: false, message: 'Invalid submission identifier. Please try again.' };
  }

  const { email } = validationResult.data;

  try {
    if (!(await claimIdempotencyKey('newsletter', idempotencyKey))) {
      return { success: false, message: 'This submission has already been processed.' };
    }

    // Check if already subscribed
    const existing = await db.lead.findFirst({
      where: {
        email,
        type: 'NEWSLETTER',
      },
    });

    if (existing) {
      return {
        success: true,
        message: 'You are already subscribed to our newsletter!',
      };
    }

    // Database Insertion
    const lead = await db.lead.create({
      data: {
        type: 'NEWSLETTER',
        status: 'NEW',
        email,
      },
    });

    // Trigger Resend email notification in the background (non-blocking, errors handled gracefully)
    void sendLeadEmails(lead);

    return {
      success: true,
      message: 'Thank you for subscribing to our newsletter!',
    };
  } catch (error) {
    console.error('Error creating newsletter subscription:', error);
    return {
      success: false,
      message: 'An unexpected database error occurred. Please try again later.',
    };
  }
}
