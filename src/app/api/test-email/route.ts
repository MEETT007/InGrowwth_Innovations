import { NextResponse } from 'next/server';
import { dispatchEmail, getActiveEmailProvider } from '@/lib/mail';
import { env } from '@/lib/env';

export async function GET() {
  try {
    const provider = getActiveEmailProvider();
    const recipient = env.MAIL_TO_ADMIN || 'sauravpankajkumarpatel@gmail.com';

    const result = await dispatchEmail({
      to: recipient,
      subject: `✅ Email Test (${provider.toUpperCase()}) - InGrowwth Innovations`,
      html: `
        <div style="font-family: sans-serif; padding: 24px; max-width: 600px; margin: 0 auto; border: 1px solid #e2e8f0; border-radius: 8px;">
          <h2 style="color: #4f46e5;">Email System Verified! 🎉</h2>
          <p>This email was dispatched via <strong>${provider.toUpperCase()}</strong>.</p>
          <hr style="border: 0; border-top: 1px solid #e2e8f0; margin: 16px 0;" />
          <p><strong>Environment:</strong> ${env.APP_ENV}</p>
          <p><strong>Recipient:</strong> ${recipient}</p>
          <p><strong>Provider:</strong> ${provider}</p>
          ${
            provider === 'ethereal'
              ? '<p style="color: #64748b; font-size: 0.9em;">(Using Ethereal for zero-config local testing. No domain verification required!)</p>'
              : ''
          }
          ${
            provider === 'smtp'
              ? '<p style="color: #16a34a; font-size: 0.9em;">(Using SMTP to deliver real emails to actual inboxes without a custom domain!)</p>'
              : ''
          }
        </div>
      `,
    });

    if (!result.success) {
      return NextResponse.json({
        success: false,
        provider: result.provider,
        error: result.error,
        help:
          provider === 'resend'
            ? 'Without a custom verified domain, Resend only permits sending to your registered account email. To test locally without restrictions, switch to SMTP or Ethereal.'
            : 'Check server logs for error details.',
      });
    }

    return NextResponse.json({
      success: true,
      provider: result.provider,
      messageId: result.messageId,
      previewUrl: result.previewUrl || null,
      message:
        result.provider === 'ethereal'
          ? `Email captured in Ethereal test inbox! Open the previewUrl link to view the rendered email.`
          : `Email successfully dispatched via ${result.provider} to ${recipient}!`,
    });
  } catch (error) {
    return NextResponse.json({ success: false, error: String(error) });
  }
}
