import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { requireAuthAndRole } from '@/lib/auth';

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

    // Mock sending logic here
    console.log(`[MOCK EMAIL SERVICE] Sending campaign ID: ${id} - Subject: ${campaign.subject}`);

    // Update campaign status
    const updated = await db.newsletterCampaign.update({
      where: { id },
      data: {
        status: 'SENT',
        sentAt: new Date(),
        stats: JSON.stringify({
          totalSent: 1500, // mock stats
          delivered: 1480,
          failed: 20,
          opens: 0,
          clicks: 0
        })
      },
    });

    return NextResponse.json({ success: true, message: 'Campaign sent successfully.', data: updated });
  } catch (error) {
    console.error('Error sending campaign:', error);
    return NextResponse.json({ success: false, message: 'Database error sending campaign.' }, { status: 500 });
  }
}
