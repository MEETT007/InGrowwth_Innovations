import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { requireAuthAndRole, requireAdminRole } from '@/lib/auth';

interface RouteParams {
  params: Promise<{ id: string }>;
}

// PUT /api/admin/portfolio/[id] - Update portfolio project (Admin & Editor)
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
    const { title, client, category, websiteUrl, description, gallery } = body;

    const existing = await db.portfolioProject.findUnique({ where: { id } });
    if (!existing) {
      return NextResponse.json(
        { success: false, message: 'Portfolio project not found.' },
        { status: 404 }
      );
    }

    const updated = await db.portfolioProject.update({
      where: { id },
      data: {
        ...(title !== undefined && { title }),
        ...(client !== undefined && { client }),
        ...(category !== undefined && { category }),
        ...(websiteUrl !== undefined && { websiteUrl: websiteUrl || null }),
        ...(description !== undefined && { description }),
        ...(gallery !== undefined && { gallery: gallery || null }),
      },
    });

    return NextResponse.json({
      success: true,
      message: 'Portfolio project updated successfully.',
      data: updated,
    });
  } catch (error) {
    console.error('Error updating portfolio project:', error);
    return NextResponse.json(
      { success: false, message: 'Database error updating portfolio project.' },
      { status: 500 }
    );
  }
}

// DELETE /api/admin/portfolio/[id] - Delete portfolio project (Admin only)
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
    const existing = await db.portfolioProject.findUnique({ where: { id } });
    if (!existing) {
      return NextResponse.json(
        { success: false, message: 'Portfolio project not found.' },
        { status: 404 }
      );
    }

    await db.portfolioProject.delete({ where: { id } });
    return NextResponse.json({ success: true, message: 'Portfolio project deleted successfully.' });
  } catch (error) {
    console.error('Error deleting portfolio project:', error);
    return NextResponse.json(
      { success: false, message: 'Database error deleting portfolio project.' },
      { status: 500 }
    );
  }
}
