import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { requireAdminRole, requireAuthAndRole } from '@/lib/auth';

export async function GET() {
  try {
    const authCheck = await requireAuthAndRole(['admin', 'editor']);
    if (!authCheck.authorized) {
      return NextResponse.json(
        { success: false, message: authCheck.error },
        { status: authCheck.status }
      );
    }

    const jobs = await db.job.findMany({
      orderBy: { createdAt: 'desc' },
    });

    return NextResponse.json({ success: true, data: jobs });
  } catch (error) {
    console.error('Error fetching jobs:', error);
    return NextResponse.json({ success: false, message: 'Internal Server Error' }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const authCheck = await requireAdminRole();
    if (!authCheck.authorized) {
      return NextResponse.json(
        { success: false, message: authCheck.error },
        { status: authCheck.status }
      );
    }

    const body = await req.json();
    const job = await db.job.create({
      data: {
        title: body.title,
        department: body.department,
        location: body.location,
        type: body.type,
        description: body.description,
        requirements: body.requirements,
        status: body.status || 'OPEN',
      },
    });

    return NextResponse.json({ success: true, data: job, message: 'Job created successfully.' });
  } catch (error) {
    console.error('Error creating job:', error);
    return NextResponse.json({ success: false, message: 'Failed to create job.' }, { status: 500 });
  }
}
