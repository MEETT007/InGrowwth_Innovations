import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { requireAdminRole, requireAuthAndRole } from '@/lib/auth';

export async function GET(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const authCheck = await requireAuthAndRole(['admin', 'editor']);
    if (!authCheck.authorized) {
      return NextResponse.json(
        { success: false, message: authCheck.error },
        { status: authCheck.status }
      );
    }

    const { id } = await params;
    const job = await db.job.findUnique({
      where: { id },
    });

    if (!job) {
      return NextResponse.json({ success: false, message: 'Job not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true, data: job });
  } catch (error) {
    console.error('Error fetching job:', error);
    return NextResponse.json({ success: false, message: 'Internal Server Error' }, { status: 500 });
  }
}

export async function PUT(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const authCheck = await requireAuthAndRole(['admin', 'editor']);
    if (!authCheck.authorized) {
      return NextResponse.json(
        { success: false, message: authCheck.error },
        { status: authCheck.status }
      );
    }

    const body = await req.json();
    const { id } = await params;

    const job = await db.job.update({
      where: { id },
      data: {
        title: body.title,
        department: body.department,
        location: body.location,
        type: body.type,
        description: body.description,
        requirements: body.requirements,
        status: body.status,
      },
    });

    return NextResponse.json({ success: true, data: job, message: 'Job updated successfully.' });
  } catch (error) {
    console.error('Error updating job:', error);
    return NextResponse.json({ success: false, message: 'Failed to update job.' }, { status: 500 });
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
    await db.job.delete({
      where: { id },
    });

    return NextResponse.json({ success: true, message: 'Job deleted successfully.' });
  } catch (error) {
    console.error('Error deleting job:', error);
    return NextResponse.json({ success: false, message: 'Failed to delete job.' }, { status: 500 });
  }
}
