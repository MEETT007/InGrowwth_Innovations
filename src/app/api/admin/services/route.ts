import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { requireAuthAndRole, requireAdminRole } from '@/lib/auth';

// GET /api/admin/services - Fetch all services
export async function GET() {
  const authCheck = await requireAuthAndRole(['admin', 'editor']);
  if (!authCheck.authorized) {
    return NextResponse.json(
      { success: false, message: authCheck.error },
      { status: authCheck.status || 401 }
    );
  }

  try {
    const services = await db.service.findMany({
      orderBy: { createdAt: 'desc' },
    });
    return NextResponse.json({ success: true, data: services });
  } catch (error) {
    console.error('Error fetching services:', error);
    return NextResponse.json(
      { success: false, message: 'Database error fetching services.' },
      { status: 500 }
    );
  }
}

// POST /api/admin/services - Create service (Admin only)
export async function POST(request: NextRequest) {
  const authCheck = await requireAdminRole();
  if (!authCheck.authorized) {
    return NextResponse.json(
      { success: false, message: authCheck.error },
      { status: authCheck.status || 403 }
    );
  }

  try {
    const body = await request.json();
    const { title, description, icon, body: serviceBody } = body;

    if (!title || !description || !icon || !serviceBody) {
      return NextResponse.json(
        { success: false, message: 'Missing required fields.' },
        { status: 400 }
      );
    }

    const service = await db.service.create({
      data: { title, description, icon, body: serviceBody },
    });

    return NextResponse.json(
      { success: true, message: 'Service created successfully.', data: service },
      { status: 201 }
    );
  } catch (error) {
    console.error('Error creating service:', error);
    return NextResponse.json(
      { success: false, message: 'Database error creating service.' },
      { status: 500 }
    );
  }
}
