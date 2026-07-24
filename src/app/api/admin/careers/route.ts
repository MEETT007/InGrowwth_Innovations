import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { auth } from '@clerk/nextjs/server';

export async function GET() {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 });
    }

    const applications = await db.jobApplication.findMany({
      orderBy: { createdAt: 'desc' },
    });

    return NextResponse.json({ success: true, data: applications });
  } catch (error) {
    console.error('Error fetching job applications:', error);
    return NextResponse.json(
      { success: false, message: 'Internal Server Error' },
      { status: 500 }
    );
  }
}

// Mock POST for testing the UI if needed
export async function POST(req: Request) {
  try {
    const body = await req.json();
    const application = await db.jobApplication.create({
      data: {
        candidateName: body.candidateName,
        email: body.email,
        phone: body.phone,
        roleAppliedFor: body.roleAppliedFor,
        resumeUrl: body.resumeUrl,
        coverLetter: body.coverLetter,
        status: body.status || 'NEW',
      },
    });

    return NextResponse.json({ success: true, data: application, message: 'Application submitted successfully.' });
  } catch (error) {
    console.error('Error creating job application:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to submit application.' },
      { status: 500 }
    );
  }
}
