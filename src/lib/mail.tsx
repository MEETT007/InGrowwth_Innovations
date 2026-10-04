import * as React from 'react';
import { Resend } from 'resend';
import nodemailer, { type Transporter } from 'nodemailer';
import { render } from '@react-email/components';
import { Lead, JobApplication } from '@/generated/prisma/client';
import { AdminNotificationEmail } from '@/components/emails/admin-notification';
import { UserAutoResponderEmail } from '@/components/emails/user-auto-responder';
import { NewsletterCampaignEmail } from '@/components/emails/newsletter-campaign';
import { CareerApplicationAdminEmail } from '@/components/emails/CareerApplicationAdminEmail';
import { CareerApplicationConfirmationEmail } from '@/components/emails/CareerApplicationConfirmationEmail';
import { LeadReplyEmail } from '@/components/emails/LeadReplyEmail';
import { env } from '@/lib/env';
import { logger } from '@/lib/logger';

export type EmailProviderType = 'resend' | 'smtp' | 'ethereal';

const resendApiKey = env.RESEND_API_KEY;
const resend = resendApiKey ? new Resend(resendApiKey) : null;

const MAIL_FROM = env.MAIL_FROM;
const MAIL_TO_ADMIN = env.MAIL_TO_ADMIN || 'admin@ingrowwth.com';

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

export function getActiveEmailProvider(): EmailProviderType {
  if (env.EMAIL_PROVIDER) {
    return env.EMAIL_PROVIDER;
  }
  if (env.SMTP_USER && env.SMTP_PASS) {
    return 'smtp';
  }
  if (env.isProduction && env.RESEND_API_KEY) {
    return 'resend';
  }
  // In development, default to ethereal for instant zero-configuration testing
  return 'ethereal';
}

let smtpTransporter: Transporter | null = null;
let etherealTransporter: Transporter | null = null;

async function getTransporter(provider: 'smtp' | 'ethereal'): Promise<{
  transporter: Transporter;
  isEthereal: boolean;
}> {
  if (provider === 'smtp') {
    if (!smtpTransporter) {
      const port = env.SMTP_PORT || (env.SMTP_SECURE ? 465 : 587);
      smtpTransporter = nodemailer.createTransport({
        host: env.SMTP_HOST || 'smtp.gmail.com',
        port,
        secure: env.SMTP_SECURE ?? (port === 465),
        auth: {
          user: env.SMTP_USER,
          pass: env.SMTP_PASS,
        },
      });
    }
    return { transporter: smtpTransporter, isEthereal: false };
  }

  // Ethereal test provider
  if (!etherealTransporter) {
    const testAccount = await nodemailer.createTestAccount();
    etherealTransporter = nodemailer.createTransport({
      host: testAccount.smtp.host,
      port: testAccount.smtp.port,
      secure: testAccount.smtp.secure,
      auth: {
        user: testAccount.user,
        pass: testAccount.pass,
      },
    });
    logger.info(`[Mail Utility] Created Ethereal test inbox: ${testAccount.user}`);
  }

  return { transporter: etherealTransporter, isEthereal: true };
}

export interface DispatchEmailOptions {
  from?: string;
  to: string | string[];
  replyTo?: string;
  subject: string;
  react?: React.ReactElement;
  html?: string;
}

export interface DispatchEmailResult {
  success: boolean;
  provider: EmailProviderType;
  messageId?: string;
  previewUrl?: string | false;
  error?: unknown;
}

/**
 * Universal email dispatcher: routes to Resend, SMTP (e.g. Gmail), or Ethereal (dev preview).
 */
export async function dispatchEmail(options: DispatchEmailOptions): Promise<DispatchEmailResult> {
  const provider = getActiveEmailProvider();
  const defaultSender =
    MAIL_FROM ||
    (provider === 'smtp' && env.SMTP_USER
      ? `InGrowwth Innovations <${env.SMTP_USER}>`
      : 'InGrowwth Innovations <onboarding@resend.dev>');
  const from = options.from || defaultSender;

  // 1. Resend API
  if (provider === 'resend') {
    if (!resend) {
      logger.warn('[Mail Utility] Resend client not initialized (missing RESEND_API_KEY). Email skipped.');
      return { success: false, provider, error: new Error('Missing RESEND_API_KEY') };
    }

    try {
      const result = options.react
        ? await resend.emails.send({
            from,
            to: options.to,
            replyTo: options.replyTo,
            subject: options.subject,
            react: options.react,
          })
        : await resend.emails.send({
            from,
            to: options.to,
            replyTo: options.replyTo,
            subject: options.subject,
            html: options.html || '',
          });

      if (result.error) {
        logger.error('[Mail Utility] Resend error:', result.error);
        return { success: false, provider, error: result.error };
      }

      logger.info('[Mail Utility] Resend email dispatched successfully:', result.data?.id);
      return { success: true, provider, messageId: result.data?.id };
    } catch (err) {
      logger.error('[Mail Utility] Resend exception:', err);
      return { success: false, provider, error: err };
    }
  }

  // 2. Nodemailer (SMTP / Ethereal)
  try {
    const { transporter, isEthereal } = await getTransporter(provider);

    let html = options.html;
    if (!html && options.react) {
      html = await render(options.react);
    }

    const sender = isEthereal
      ? 'InGrowwth Innovations (Dev) <preview@ethereal.email>'
      : from;

    const info = await transporter.sendMail({
      from: sender,
      to: options.to,
      replyTo: options.replyTo,
      subject: options.subject,
      html: html || '',
    });

    let previewUrl: string | false = false;
    if (isEthereal) {
      previewUrl = nodemailer.getTestMessageUrl(info);
      console.log('\n================== [DEVELOPMENT EMAIL DISPATCHED] ==================');
      console.log(`📬 Provider : Ethereal (Zero-Config Dev Inbox)`);
      console.log(`📨 To       : ${Array.isArray(options.to) ? options.to.join(', ') : options.to}`);
      console.log(`📝 Subject  : ${options.subject}`);
      if (previewUrl) {
        console.log(`🔗 PREVIEW  : ${previewUrl}`);
      }
      console.log('====================================================================\n');
      logger.info(`[Mail Utility] Ethereal preview available at: ${previewUrl}`);
    } else {
      logger.info(`[Mail Utility] SMTP email sent successfully! MessageId: ${info.messageId}`);
    }

    return {
      success: true,
      provider,
      messageId: info.messageId,
      previewUrl,
    };
  } catch (error) {
    logger.error(`[Mail Utility] Error dispatching email via ${provider}:`, error);
    return { success: false, provider, error };
  }
}

async function sendAdminEmail(lead: Lead): Promise<void> {
  const { type: leadType, name, email, subject, message, id } = lead;

  const config = EMAIL_CONFIGS[leadType] || EMAIL_CONFIGS.CONTACT;
  const adminSubject = getSubject(config.adminSubject(name || email));

  await dispatchEmail({
    to: MAIL_TO_ADMIN,
    replyTo: email,
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
}

async function sendUserEmail(lead: Lead): Promise<void> {
  const { type: leadType, name, email } = lead;
  const config = EMAIL_CONFIGS[leadType] || EMAIL_CONFIGS.CONTACT;
  const userSubject = getSubject(config.userSubject);

  await dispatchEmail({
    to: email,
    subject: userSubject,
    react: <UserAutoResponderEmail leadType={leadType} name={name} />,
  });
}

export async function sendLeadEmails(lead: Lead): Promise<void> {
  try {
    logger.info(`[Mail Utility] Queueing emails for Lead ID: ${lead.id} (${lead.type})`);
    await Promise.allSettled([sendAdminEmail(lead), sendUserEmail(lead)]);
  } catch (error) {
    logger.error('[Mail Utility] Failed to complete sendLeadEmails operation:', error);
  }
}

export async function sendNewsletterWelcomeEmail(email: string): Promise<void> {
  try {
    const subject = getSubject('Welcome to the InGrowwth Innovations Newsletter!');
    await dispatchEmail({
      to: email,
      subject,
      react: <UserAutoResponderEmail leadType="NEWSLETTER" />,
    });
  } catch (error) {
    logger.error('[Mail Utility] Failed to send newsletter welcome email:', error);
  }
}

export async function sendNewsletterAdminEmail(email: string): Promise<void> {
  try {
    const subject = getSubject(`New Newsletter Subscription: ${email}`);
    await dispatchEmail({
      to: MAIL_TO_ADMIN,
      replyTo: email,
      subject,
      html: `
        <div style="font-family: sans-serif; padding: 20px;">
          <h2>New Newsletter Subscriber!</h2>
          <p>A new user has subscribed to the InGrowwth Innovations newsletter.</p>
          <p><strong>Email:</strong> ${email}</p>
        </div>
      `,
    });
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
    const finalSubject = getSubject(subject);
    await dispatchEmail({
      to: email,
      subject: finalSubject,
      react: (
        <NewsletterCampaignEmail
          subject={subject}
          content={content}
          subscriberEmail={email}
          campaignLink={campaignLink}
        />
      ),
    });
  } catch (error) {
    logger.error(`[Mail Utility] Failed to send campaign email to ${email}:`, error);
  }
}

export async function sendApplicationAdminEmail(
  application: JobApplication,
  linkedInUrl?: string | null
): Promise<void> {
  try {
    const adminSubject = getSubject(
      `New Job Application: ${application.candidateName} for ${application.roleAppliedFor}`
    );

    const baseUrl = (env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000').replace(/\/$/, '');
    const absoluteResumeUrl = application.resumeUrl
      ? application.resumeUrl.startsWith('http')
        ? application.resumeUrl
        : `${baseUrl}${application.resumeUrl}`
      : null;

    // If linkedInUrl was not passed directly, try extracting it from coverLetter
    let resolvedLinkedIn = linkedInUrl;
    if (!resolvedLinkedIn && application.coverLetter) {
      const match = application.coverLetter.match(/LinkedIn:\s*([^\s\n]+)/i);
      if (match && match[1]) {
        resolvedLinkedIn = match[1];
      }
    }

    await dispatchEmail({
      to: MAIL_TO_ADMIN,
      replyTo: application.email,
      subject: adminSubject,
      react: (
        <CareerApplicationAdminEmail
          applicationId={application.id}
          candidateName={application.candidateName}
          email={application.email}
          phone={application.phone}
          roleAppliedFor={application.roleAppliedFor}
          linkedInUrl={resolvedLinkedIn}
          coverLetter={application.coverLetter}
          resumeUrl={absoluteResumeUrl}
          createdAt={application.createdAt?.toISOString() || new Date().toISOString()}
        />
      ),
    });
  } catch (error) {
    logger.error('[Mail Utility] Unhandled error sending App Admin email:', error);
  }
}

export async function sendApplicationConfirmationEmail(application: JobApplication): Promise<void> {
  try {
    const subject = getSubject(
      `Application Received: ${application.roleAppliedFor} at InGrowwth Innovations`
    );

    await dispatchEmail({
      to: application.email,
      subject,
      react: (
        <CareerApplicationConfirmationEmail
          candidateName={application.candidateName}
          roleAppliedFor={application.roleAppliedFor}
        />
      ),
    });
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
    const result = await dispatchEmail({
      to: recipientEmail,
      subject,
      react: <LeadReplyEmail subject={subject} message={message} />,
    });

    if (!result.success) {
      throw new Error(String(result.error || 'Failed to dispatch email'));
    }
  } catch (error) {
    logger.error('[Mail Utility] Unhandled error sending Admin Reply email:', error);
    throw error;
  }
}
