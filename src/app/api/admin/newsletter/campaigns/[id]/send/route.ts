import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { requireAuthAndRole } from '@/lib/auth';
import { logger } from '@/lib/logger';
import { sendNewsletterCampaignEmail } from '@/lib/mail';
import { env } from '@/lib/env';

interface RouteParams {
  params: Promise<{ id: string }>;
}

export async function POST(request: NextRequest, { params }: RouteParams) {
  const { id } = await params;
  const authCheck = await requireAuthAndRole(['admin', 'editor']);
  if (!authCheck.authorized) {
    return NextResponse.json({ success: false, message: authCheck.error }, { status: 401 });
  }

  try {
    const campaign = await db.newsletterCampaign.findUnique({ where: { id } });
    if (!campaign) {
      return NextResponse.json({ success: false, message: 'Campaign not found.' }, { status: 404 });
    }

    if (campaign.status === 'SENT') {
      return NextResponse.json({ success: false, message: 'Campaign has already been sent.' }, { status: 400 });
    }

    // Fetch all active subscribers
    const subscribers = await db.newsletterSubscriber.findMany({
      where: { status: 'ACTIVE' }
    });

    if (subscribers.length === 0) {
      return NextResponse.json({ success: false, message: 'No active subscribers found.' }, { status: 400 });
    }

    const campaignLink = env.NEXT_PUBLIC_APP_URL ? `${env.NEXT_PUBLIC_APP_URL}/newsletter/${id}` : undefined;

    logger.info(`Sending campaign ID: ${id} to ${subscribers.length} subscribers`);

    // Send emails in parallel but limit concurrency in a real app.
    // For this mock/MVP, we'll just Promise.all them if not too many, or run them sequentially.
    let delivered = 0;
    let failed = 0;

    for (const subscriber of subscribers) {
      try {
        await sendNewsletterCampaignEmail(subscriber.email, campaign.subject, campaign.content, campaignLink);
        delivered++;
      } catch (e) {
        logger.error(`Failed to send to ${subscriber.email}`, e);
        failed++;
      }
    }

    // Update campaign status
    const updated = await db.newsletterCampaign.update({
      where: { id },
      data: {
        status: 'SENT',
        sentAt: new Date(),
        stats: JSON.stringify({
          totalSent: subscribers.length,
          delivered,
          failed,
          opens: 0,
          clicks: 0
        })
      },
    });

    return NextResponse.json({ success: true, message: 'Campaign sent successfully.', data: updated });
  } catch (error) {
    logger.error('Error sending campaign:', error);
    return NextResponse.json({ success: false, message: 'Database error sending campaign.' }, { status: 500 });
  }
}

