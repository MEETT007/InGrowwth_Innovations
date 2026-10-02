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
    return NextResponse.json(
      { success: false, message: authCheck.error },
      { status: authCheck.status || 401 }
    );
  }

  try {
    const body = await request.json();
    const existing = await db.caseStudy.findUnique({ where: { id } });
    if (!existing) {
      return NextResponse.json(
        { success: false, message: 'Case study not found.' },
        { status: 404 }
      );
    }

    const updated = await db.caseStudy.update({
      where: { id },
      data: { ...body }, // We can just pass the body for an update if fields match
    });

    return NextResponse.json({
      success: true,
      message: 'Case study updated successfully.',
      data: updated,
    });
  } catch (error) {
    console.error('Error updating case study:', error);
    return NextResponse.json(
      { success: false, message: 'Database error updating case study.' },
      { status: 500 }
    );
  }
}

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
    const existing = await db.caseStudy.findUnique({ where: { id } });
    if (!existing) {
      return NextResponse.json(
        { success: false, message: 'Case study not found.' },
        { status: 404 }
      );
    }

    await db.caseStudy.delete({ where: { id } });
    return NextResponse.json({ success: true, message: 'Case study deleted successfully.' });
  } catch (error) {
    console.error('Error deleting case study:', error);
    return NextResponse.json(
      { success: false, message: 'Database error deleting case study.' },
      { status: 500 }
    );
  }
}
