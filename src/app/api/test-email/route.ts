import { NextResponse } from 'next/server';
import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function GET() {
  try {
    const data = await resend.emails.send({
      from: 'InGrowwth Innovations <onboarding@resend.dev>',
      to: 'sauravpankajkumarpatel@gmail.com',
      subject: '✅ Success! Your Email System is Working',
      html: `
        <div style="font-family: sans-serif; padding: 20px;">
          <h2>Congratulations!</h2>
          <p>If you are reading this, your Resend API integration is <strong>100% perfectly configured</strong>.</p>
          <p>Your backend code successfully connected to Resend and dispatched this email.</p>
          <br/>
          <h3>What's next?</h3>
          <p>Because you are in Development Mode, Resend only allows you to send emails to this specific inbox (the one you registered with).</p>
          <p>Once you purchase your domain (ingrowwth.com) and verify it in the Resend dashboard, this exact same code will automatically allow you to send emails to ANY address in the world!</p>
        </div>
      `,
    });

    if (data.error) {
      return NextResponse.json({ success: false, error: data.error });
    }

    return NextResponse.json({ 
      success: true, 
      message: 'Check your Gmail Inbox (sauravpankajkumarpatel@gmail.com)! The email was successfully sent.',
      resend_id: data.data?.id 
    });
  } catch (error) {
    return NextResponse.json({ success: false, error: String(error) });
  }
}
