import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { requireAdminRole, requireAuthAndRole } from '@/lib/auth';

export async function PUT(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const authCheck = await requireAuthAndRole(['admin', 'editor']);
    if (!authCheck.authorized) {
      return NextResponse.json(
        { success: false, message: authCheck.error },
        { status: authCheck.status }
      );
    }

    const { id } = await params;
    const body = await req.json();

    const application = await db.jobApplication.update({
      where: { id },
      data: {
        status: body.status,
      },
    });

    return NextResponse.json({ success: true, data: application, message: 'Status updated.' });
  } catch (error) {
    console.error('Error updating job application:', error);
    return NextResponse.json({ success: false, message: 'Internal Server Error' }, { status: 500 });
  }
}

export async function DELETE(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const authCheck = await requireAdminRole();
    if (!authCheck.authorized) {
      return NextResponse.json(
        { success: false, message: authCheck.error },
        { status: authCheck.status }
      );
    }

    const { id } = await params;

    await db.jobApplication.delete({
      where: { id },
    });

    return NextResponse.json({ success: true, message: 'Application deleted.' });
  } catch (error) {
    console.error('Error deleting job application:', error);
    return NextResponse.json({ success: false, message: 'Internal Server Error' }, { status: 500 });
  }
}
