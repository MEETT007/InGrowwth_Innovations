import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { requireAuthAndRole, requireAdminRole } from '@/lib/auth';
import { readJsonBody } from '@/lib/request-security';

interface RouteParams {
  params: Promise<{ id: string }>;
}

// PUT /api/admin/services/[id] - Update service (Admin & Editor)
export async function PUT(request: NextRequest, { params }: RouteParams) {
  const { id } = await params;
  const authCheck = await requireAuthAndRole(['admin', 'editor']);
  if (!authCheck.authorized) {
    return NextResponse.json(
      { success: false, message: authCheck.error },
      { status: authCheck.status || 401 }
    );
  }

  try {
    const parsedBody = await readJsonBody(request);
    if (!parsedBody.ok) return parsedBody.response;

    const // eslint-disable-next-line @typescript-eslint/no-explicit-any
      body = parsedBody.data as any;
    const { title, description, icon, body: serviceBody } = body;

    const existing = await db.service.findUnique({ where: { id } });
    if (!existing) {
      return NextResponse.json({ success: false, message: 'Service not found.' }, { status: 404 });
    }

    const updated = await db.service.update({
      where: { id },
      data: {
        ...(title !== undefined && { title }),
        ...(description !== undefined && { description }),
        ...(icon !== undefined && { icon }),
        ...(serviceBody !== undefined && { body: serviceBody }),
      },
    });

    return NextResponse.json({
      success: true,
      message: 'Service updated successfully.',
      data: updated,
    });
  } catch (error) {
    console.error('Error updating service:', error);
    return NextResponse.json(
      { success: false, message: 'Database error updating service.' },
      { status: 500 }
    );
  }
}

// DELETE /api/admin/services/[id] - Delete service (Admin only)
export async function DELETE(request: NextRequest, { params }: RouteParams) {
  const { id } = await params;
  const authCheck = await requireAdminRole();
  if (!authCheck.authorized) {
    return NextResponse.json(
      { success: false, message: authCheck.error },
      { status: authCheck.status || 403 }
    );
  }

  try {
    const existing = await db.service.findUnique({ where: { id } });
    if (!existing) {
      return NextResponse.json({ success: false, message: 'Service not found.' }, { status: 404 });
    }

    await db.service.delete({ where: { id } });
    return NextResponse.json({ success: true, message: 'Service deleted successfully.' });
  } catch (error) {
    console.error('Error deleting service:', error);
    return NextResponse.json(
      { success: false, message: 'Database error deleting service.' },
      { status: 500 }
    );
  }
}
