import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { requireAuthAndRole, requireAdminRole } from '@/lib/auth';

interface RouteParams {
  params: Promise<{ id: string }>;
}

export async function PUT(request: NextRequest, { params }: RouteParams) {
  const { id } = await params;
  const authCheck = await requireAuthAndRole(['admin', 'editor']);
  if (!authCheck.authorized) {
    return NextResponse.json({ success: false, message: authCheck.error }, { status: 401 });
  }

  try {
    const body = await request.json();
    const existing = await db.newsletterCampaign.findUnique({ where: { id } });
    if (!existing) {
      return NextResponse.json({ success: false, message: 'Campaign not found.' }, { status: 404 });
    }

    const updated = await db.newsletterCampaign.update({
      where: { id },
      data: {
        ...(body.subject !== undefined && { subject: body.subject }),
        ...(body.bannerImage !== undefined && { bannerImage: body.bannerImage }),
        ...(body.content !== undefined && { content: body.content }),
        ...(body.status !== undefined && { status: body.status }),
        ...(body.scheduledFor !== undefined && { scheduledFor: body.scheduledFor ? new Date(body.scheduledFor) : null }),
      },
    });

    return NextResponse.json({ success: true, message: 'Campaign updated successfully.', data: updated });
  } catch (error) {
    console.error('Error updating campaign:', error);
    return NextResponse.json({ success: false, message: 'Database error updating campaign.' }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest, { params }: RouteParams) {
  const { id } = await params;
  const authCheck = await requireAdminRole();
  if (!authCheck.authorized) {
    return NextResponse.json({ success: false, message: authCheck.error }, { status: 403 });
  }

  try {
    const existing = await db.newsletterCampaign.findUnique({ where: { id } });
    if (!existing) {
      return NextResponse.json({ success: false, message: 'Campaign not found.' }, { status: 404 });
    }

    await db.newsletterCampaign.delete({ where: { id } });
    return NextResponse.json({ success: true, message: 'Campaign deleted successfully.' });
  } catch (error) {
    console.error('Error deleting campaign:', error);
    return NextResponse.json({ success: false, message: 'Database error deleting campaign.' }, { status: 500 });
  }
}
