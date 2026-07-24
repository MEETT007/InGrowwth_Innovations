import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { requireAuthAndRole } from '@/lib/auth';

export async function GET(request: NextRequest) {
  const authCheck = await requireAuthAndRole(['admin', 'editor']);
  if (!authCheck.authorized) {
    return NextResponse.json({ success: false, message: authCheck.error }, { status: 401 });
  }

  try {
    const subscribers = await db.newsletterSubscriber.findMany({
      orderBy: { subscribedAt: 'desc' },
    });
    return NextResponse.json({ success: true, data: subscribers });
  } catch (error) {
    console.error('Error fetching subscribers:', error);
    return NextResponse.json({ success: false, message: 'Database error fetching subscribers.' }, { status: 500 });
  }
}
