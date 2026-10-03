import * as React from 'react';
import { Resend } from 'resend';
import { Lead } from '@/generated/prisma/client';
import { AdminNotificationEmail } from '@/components/emails/admin-notification';
import { UserAutoResponderEmail } from '@/components/emails/user-auto-responder';
import { NewsletterCampaignEmail } from '@/components/emails/newsletter-campaign';
import { env } from '@/lib/env';
import { logger } from '@/lib/logger';

const resendApiKey = env.RESEND_API_KEY;
const resend = resendApiKey ? new Resend(resendApiKey) : null;

const MAIL_FROM = env.MAIL_FROM;
const MAIL_TO_ADMIN = env.MAIL_TO_ADMIN;

const EMAIL_CONFIGS = {
  QUOTE: {
    adminSubject: (nameOrEmail: string) => `New Quote Request from ${nameOrEmail}`,
    userSubject: 'Thank you for contacting InGrowwth Innovations - Quote Request Received',
  },
  NEWSLETTER: {
    adminSubject: (nameOrEmail: string) => `New Newsletter Subscription: ${nameOrEmail}`,
    userSubject: 'Welcome to the InGrowwth Innovations Newsletter!',
  },
  CONTACT: {
    adminSubject: (nameOrEmail: string) => `New Lead / Quote request from ${nameOrEmail}`,
    userSubject: 'Thank you for contacting InGrowwth Innovations',
  },
} as const;

function getSubject(baseSubject: string) {
  return env.isProduction ? baseSubject : `[DEV] ${baseSubject}`;
}

async function sendAdminEmail(lead: Lead, client: Resend): Promise<void> {
  const { type: leadType, name, email, subject, message, id } = lead;

  if (!MAIL_TO_ADMIN || !MAIL_FROM) return;

  const config = EMAIL_CONFIGS[leadType] || EMAIL_CONFIGS.CONTACT;
  const adminSubject = getSubject(config.adminSubject(name || email));

  try {
    const result = await client.emails.send({
      from: MAIL_FROM,
      to: MAIL_TO_ADMIN,
      subject: adminSubject,
      react: (
        <AdminNotificationEmail
          leadType={leadType}
          leadId={id}
          name={name}
          email={email}
          phone={lead.phone}
          subject={subject}
          message={message}
          service={lead.service}
          budget={lead.budget}
          timeline={lead.timeline}
          projectDetails={lead.projectDetails}
          fileUrl={lead.fileUrl}
          createdAt={lead.createdAt?.toISOString()}
        />
      ),
    });

    if (result.error) {
      logger.error('[Mail Utility] Resend error sending Admin Notification email:', result.error);
    } else {
      logger.info('[Mail Utility] Admin Notification email sent successfully:', result.data?.id);
    }
  } catch (error) {
    logger.error('[Mail Utility] Unhandled error sending Admin Notification email:', error);
  }
}

async function sendUserEmail(lead: Lead, client: Resend): Promise<void> {
  const { type: leadType, name, email } = lead;

  if (!MAIL_FROM) return;

  const config = EMAIL_CONFIGS[leadType] || EMAIL_CONFIGS.CONTACT;
  const userSubject = getSubject(config.userSubject);
  
  const recipient = email;

  try {
    const result = await client.emails.send({
      from: MAIL_FROM,
      to: recipient,
      subject: userSubject,
      react: <UserAutoResponderEmail leadType={leadType} name={name} />,
    });

    if (result.error) {
      logger.error('[Mail Utility] Resend error sending User Auto-Responder email:', result.error);
    } else {
      logger.info('[Mail Utility] User Auto-Responder email sent successfully:', result.data?.id);
    }
  } catch (error) {
    logger.error('[Mail Utility] Unhandled error sending User Auto-Responder email:', error);
  }
}

export async function sendLeadEmails(lead: Lead): Promise<void> {
  try {
    if (!resend) {
      logger.warn('[Mail Utility] RESEND_API_KEY is not defined. Email notifications are skipped.');
      return;
    }

    if (!MAIL_FROM || !MAIL_TO_ADMIN) {
      logger.warn(
        '[Mail Utility] MAIL_FROM or MAIL_TO_ADMIN environment variables are not configured. Email notifications are skipped.'
      );
      return;
    }

    logger.info(`[Mail Utility] Queueing emails for Lead ID: ${lead.id} (${lead.type})`);

    await Promise.allSettled([sendAdminEmail(lead, resend), sendUserEmail(lead, resend)]);
  } catch (error) {
    logger.error('[Mail Utility] Failed to complete sendLeadEmails operation:', error);
  }
}

export async function sendNewsletterWelcomeEmail(email: string): Promise<void> {
  try {
    if (!resend || !MAIL_FROM) return;

    const subject = getSubject('Welcome to the InGrowwth Innovations Newsletter!');
    const recipient = email;

    const result = await resend.emails.send({
      from: MAIL_FROM,
      to: recipient,
      subject,
      react: <UserAutoResponderEmail leadType="NEWSLETTER" />,
    });

    if (result.error) {
      logger.error('[Mail Utility] Error sending newsletter welcome email:', result.error);
    } else {
      logger.info('[Mail Utility] Newsletter welcome email sent successfully');
    }
  } catch (error) {
    logger.error('[Mail Utility] Failed to send newsletter welcome email:', error);
  }
}

export async function sendNewsletterCampaignEmail(
  email: string,
  subject: string,
  content: string,
  campaignLink?: string
): Promise<void> {
  try {
    if (!resend || !MAIL_FROM) return;

    const finalSubject = getSubject(subject);
    const recipient = email;

    const result = await resend.emails.send({
      from: MAIL_FROM,
      to: recipient,
      subject: finalSubject,
      react: <NewsletterCampaignEmail subject={subject} content={content} subscriberEmail={email} campaignLink={campaignLink} />,
    });

    if (result.error) {
      logger.error(`[Mail Utility] Error sending campaign email to ${email}:`, result.error);
    }
  } catch (error) {
    logger.error(`[Mail Utility] Failed to send campaign email to ${email}:`, error);
  }
}

