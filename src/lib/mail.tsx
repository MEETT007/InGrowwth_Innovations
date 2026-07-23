import * as React from 'react';
import { Resend } from 'resend';
import { Lead } from '@/generated/prisma/client';
import { AdminNotificationEmail } from '@/components/emails/admin-notification';
import { UserAutoResponderEmail } from '@/components/emails/user-auto-responder';

// Initialize Resend with the API key from environment variables
const resendApiKey = process.env.RESEND_API_KEY;
const resend = resendApiKey ? new Resend(resendApiKey) : null;

const MAIL_FROM = process.env.MAIL_FROM;
const MAIL_TO_ADMIN = process.env.MAIL_TO_ADMIN;

// Subject configurations mapping for different lead types
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

/**
 * Helper to send the Admin Notification email.
 */
async function sendAdminEmail(lead: Lead, client: Resend): Promise<void> {
  const { type: leadType, name, email, subject, message, id } = lead;

  if (!MAIL_TO_ADMIN || !MAIL_FROM) return;

  const config = EMAIL_CONFIGS[leadType] || EMAIL_CONFIGS.CONTACT;
  const adminSubject = config.adminSubject(name || email);

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
      console.error('[Mail Utility] Resend error sending Admin Notification email:', result.error);
    } else {
      console.info('[Mail Utility] Admin Notification email sent successfully:', result.data?.id);
    }
  } catch (error) {
    console.error('[Mail Utility] Unhandled error sending Admin Notification email:', error);
  }
}

/**
 * Helper to send the User Auto-Responder email.
 */
async function sendUserEmail(lead: Lead, client: Resend): Promise<void> {
  const { type: leadType, name, email } = lead;

  if (!MAIL_FROM) return;

  const config = EMAIL_CONFIGS[leadType] || EMAIL_CONFIGS.CONTACT;
  const userSubject = config.userSubject;

  try {
    const result = await client.emails.send({
      from: MAIL_FROM,
      to: email,
      subject: userSubject,
      react: <UserAutoResponderEmail leadType={leadType} name={name} />,
    });

    if (result.error) {
      console.error('[Mail Utility] Resend error sending User Auto-Responder email:', result.error);
    } else {
      console.info('[Mail Utility] User Auto-Responder email sent successfully:', result.data?.id);
    }
  } catch (error) {
    console.error('[Mail Utility] Unhandled error sending User Auto-Responder email:', error);
  }
}

/**
 * Sends both the Admin Notification and the User Auto-Responder emails in the background.
 * This function fails gracefully and does not throw errors.
 *
 * @param lead The Lead object saved to the database.
 */
export async function sendLeadEmails(lead: Lead): Promise<void> {
  try {
    if (!resend) {
      console.warn(
        '[Mail Utility] RESEND_API_KEY is not defined. Email notifications are skipped.'
      );
      return;
    }

    if (!MAIL_FROM || !MAIL_TO_ADMIN) {
      console.warn(
        '[Mail Utility] MAIL_FROM or MAIL_TO_ADMIN environment variables are not configured. Email notifications are skipped.'
      );
      return;
    }

    console.info(`[Mail Utility] Queueing emails for Lead ID: ${lead.id} (${lead.type})`);

    // Trigger both emails in parallel
    await Promise.allSettled([sendAdminEmail(lead, resend), sendUserEmail(lead, resend)]);
  } catch (error) {
    console.error('[Mail Utility] Failed to complete sendLeadEmails operation:', error);
  }
}
