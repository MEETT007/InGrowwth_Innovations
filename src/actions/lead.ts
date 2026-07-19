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
import { headers } from 'next/headers';

// Helper to extract client IP address
async function getClientIp(): Promise<string> {
  try {
    const headersList = await headers();
    const forwardedFor = headersList.get('x-forwarded-for');
    if (forwardedFor) {
      return forwardedFor.split(',')[0].trim();
    }
  } catch (error) {
    console.error('Error fetching client headers:', error);
  }
  return '127.0.0.1';
}

/**
 * Server action to submit a contact inquiry form
 */
export async function submitContactAction(rawInput: ContactInput) {
  const ip = await getClientIp();

  // Rate Limiting: Max 5 submissions per minute per IP
  const rateLimitResult = await rateLimit(ip, 5, 60000);
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

  const { name, email, subject, message } = validationResult.data;

  try {
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

    // TODO: Issue 15 Integration - Trigger Resend email notification
    console.log(`[Notification Placeholder] Email notification for Contact Lead ID: ${lead.id}`);

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
export async function submitQuoteAction(rawInput: QuoteInput) {
  const ip = await getClientIp();

  // Rate Limiting: Max 5 submissions per minute per IP
  const rateLimitResult = await rateLimit(ip, 5, 60000);
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

  const { name, email, phone, service, budget, timeline, projectDetails, fileUrl } =
    validationResult.data;

  try {
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

    // TODO: Issue 15 Integration - Trigger Resend email notification
    console.log(`[Notification Placeholder] Email notification for Quote Lead ID: ${lead.id}`);

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
export async function subscribeNewsletterAction(rawInput: NewsletterInput) {
  const ip = await getClientIp();

  // Rate Limiting: Max 10 subscription attempts per minute per IP
  const rateLimitResult = await rateLimit(ip, 10, 60000);
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

  const { email } = validationResult.data;

  try {
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

    // TODO: Issue 15 Integration - Trigger Resend email notification
    console.log(`[Notification Placeholder] Email notification for Newsletter Lead ID: ${lead.id}`);

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
