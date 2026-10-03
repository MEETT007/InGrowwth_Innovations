import * as React from 'react';
import { Resend } from 'resend';
import { Lead, JobApplication } from '@/generated/prisma/client';
import { AdminNotificationEmail } from '@/components/emails/admin-notification';
import { UserAutoResponderEmail } from '@/components/emails/user-auto-responder';
import { NewsletterCampaignEmail } from '@/components/emails/newsletter-campaign';
import { CareerApplicationAdminEmail } from '@/components/emails/CareerApplicationAdminEmail';
import { CareerApplicationConfirmationEmail } from '@/components/emails/CareerApplicationConfirmationEmail';
import { LeadReplyEmail } from '@/components/emails/LeadReplyEmail';
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
      reply_to: email,
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

export async function sendNewsletterAdminEmail(email: string): Promise<void> {
  try {
    if (!resend || !MAIL_FROM || !MAIL_TO_ADMIN) return;

    const subject = getSubject(`New Newsletter Subscription: ${email}`);

    const result = await resend.emails.send({
      from: MAIL_FROM,
      to: MAIL_TO_ADMIN,
      reply_to: email,
      subject,
      html: `
        <div style="font-family: sans-serif; padding: 20px;">
          <h2>New Newsletter Subscriber!</h2>
          <p>A new user has subscribed to the InGrowwth Innovations newsletter.</p>
          <p><strong>Email:</strong> ${email}</p>
        </div>
      `,
    });

    if (result.error) {
      logger.error('[Mail Utility] Error sending newsletter admin email:', result.error);
    } else {
      logger.info('[Mail Utility] Newsletter admin email sent successfully');
    }
  } catch (error) {
    logger.error('[Mail Utility] Failed to send newsletter admin email:', error);
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

export async function sendApplicationAdminEmail(application: JobApplication): Promise<void> {
  try {
    if (!resend || !MAIL_FROM || !MAIL_TO_ADMIN) return;

    const adminSubject = getSubject(`New Job Application: ${application.candidateName} for ${application.roleAppliedFor}`);

    const result = await resend.emails.send({
      from: MAIL_FROM,
      to: MAIL_TO_ADMIN,
      reply_to: application.email,
      subject: adminSubject,
      react: (
        <CareerApplicationAdminEmail
          applicationId={application.id}
          candidateName={application.candidateName}
          email={application.email}
          phone={application.phone}
          roleAppliedFor={application.roleAppliedFor}
          coverLetter={application.coverLetter}
          resumeUrl={application.resumeUrl}
          createdAt={application.createdAt?.toISOString() || new Date().toISOString()}
        />
      ),
    });

    if (result.error) {
      logger.error('[Mail Utility] Resend error sending App Admin email:', result.error);
    } else {
      logger.info('[Mail Utility] App Admin email sent successfully');
    }
  } catch (error) {
    logger.error('[Mail Utility] Unhandled error sending App Admin email:', error);
  }
}

export async function sendApplicationConfirmationEmail(application: JobApplication): Promise<void> {
  try {
    if (!resend || !MAIL_FROM) return;

    const subject = getSubject(`Application Received: ${application.roleAppliedFor} at InGrowwth Innovations`);

    const result = await resend.emails.send({
      from: MAIL_FROM,
      to: application.email,
      subject,
      react: (
        <CareerApplicationConfirmationEmail
          candidateName={application.candidateName}
          roleAppliedFor={application.roleAppliedFor}
        />
      ),
    });

    if (result.error) {
      logger.error('[Mail Utility] Resend error sending App Confirmation email:', result.error);
    } else {
      logger.info('[Mail Utility] App Confirmation email sent successfully');
    }
  } catch (error) {
    logger.error('[Mail Utility] Unhandled error sending App Confirmation email:', error);
  }
}

export async function sendAdminReplyEmail(
  recipientEmail: string,
  subject: string,
  message: string
): Promise<void> {
  try {
    if (!resend || !MAIL_FROM) return;

    const result = await resend.emails.send({
      from: MAIL_FROM,
      to: recipientEmail,
      subject: subject,
      react: <LeadReplyEmail subject={subject} message={message} />,
    });

    if (result.error) {
      logger.error('[Mail Utility] Resend error sending Admin Reply email:', result.error);
      throw new Error(result.error.message);
    } else {
      logger.info('[Mail Utility] Admin Reply email sent successfully');
    }
  } catch (error) {
    logger.error('[Mail Utility] Unhandled error sending Admin Reply email:', error);
    throw error;
  }
}
