import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { requireAuthAndRole, requireAdminRole } from '@/lib/auth';

export async function GET() {
  const authCheck = await requireAuthAndRole(['admin', 'editor']);
  if (!authCheck.authorized) {
    return NextResponse.json({ success: false, message: authCheck.error }, { status: 401 });
  }

  try {
    const campaigns = await db.newsletterCampaign.findMany({
      orderBy: { createdAt: 'desc' },
    });
    return NextResponse.json({ success: true, data: campaigns });
  } catch (error) {
    console.error('Error fetching campaigns:', error);
    return NextResponse.json({ success: false, message: 'Database error fetching campaigns.' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  const authCheck = await requireAdminRole();
  if (!authCheck.authorized) {
    return NextResponse.json({ success: false, message: authCheck.error }, { status: 403 });
  }

  try {
    const body = await request.json();
    const { subject, bannerImage, content, status, scheduledFor } = body;

    if (!subject || !content) {
      return NextResponse.json({ success: false, message: 'Subject and Content are required.' }, { status: 400 });
    }

    const campaign = await db.newsletterCampaign.create({
      data: {
        subject,
        bannerImage: bannerImage || null,
        content,
        status: status || 'DRAFT',
        scheduledFor: scheduledFor ? new Date(scheduledFor) : null,
      },
    });

    return NextResponse.json({ success: true, message: 'Campaign created successfully.', data: campaign }, { status: 201 });
  } catch (error) {
    console.error('Error creating campaign:', error);
    return NextResponse.json({ success: false, message: 'Database error creating campaign.' }, { status: 500 });
  }
}
