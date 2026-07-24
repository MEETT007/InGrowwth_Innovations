import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { auth } from '@clerk/nextjs/server';

export async function PUT(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 });
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
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 });
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
