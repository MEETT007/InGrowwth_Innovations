import { Lead } from '@prisma/client';
import { Resend } from 'resend';
import { ContactTemplate } from '@/components/emails/ContactTemplate';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function sendLeadEmails(lead: Lead) {
  try {
    if (!process.env.RESEND_API_KEY) {
      console.warn('RESEND_API_KEY is not set. Email not sent.');
      return;
    }

    const {
      type,
      email,
      name,
      subject,
      message,
      phone,
      service,
      budget,
      timeline,
      projectDetails,
    } = lead;

    // Send notification to the admin/team
    await resend.emails.send({
      from: 'InGrowwth Innovations <onboarding@resend.dev>', // resend.dev for testing, use real domain in prod
      to: ['hello@ingrowwth.com'], // In prod, this should be the company email
      subject: `New Lead: ${type} from ${name || email}`,
      react: ContactTemplate({
        name,
        email,
        type,
        subject,
        message,
        phone,
        service,
        budget,
        timeline,
        projectDetails,
      }),
    });

    // Optionally: Send auto-reply to the user
    if (type !== 'NEWSLETTER') {
      await resend.emails.send({
        from: 'InGrowwth Team <onboarding@resend.dev>',
        to: [email],
        subject: 'We received your inquiry - InGrowwth Innovations',
        html: `<p>Hi ${name || 'there'},</p><p>Thank you for reaching out to InGrowwth Innovations. Our engineering team has received your inquiry and will be in touch shortly!</p><p>Best,<br/>The InGrowwth Team</p>`,
      });
    }
  } catch (error) {
    console.error('Failed to send lead email via Resend:', error);
  }
}
