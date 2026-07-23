import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { requireAuthAndRole, requireAdminRole } from '@/lib/auth';

interface RouteParams {
  params: Promise<{ id: string }>;
}

// PUT /api/admin/team/[id] - Update team member (Admin & Editor)
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
    const { name, role, email, bio, linkedin, twitter, github, photo } = body;

    const existing = await db.teamMember.findUnique({ where: { id } });
    if (!existing) {
      return NextResponse.json(
        { success: false, message: 'Team member not found.' },
        { status: 404 }
      );
    }

    const updated = await db.teamMember.update({
      where: { id },
      data: {
        ...(name !== undefined && { name }),
        ...(role !== undefined && { role }),
        ...(email !== undefined && { email: email || null }),
        ...(bio !== undefined && { bio: bio || null }),
        ...(linkedin !== undefined && { linkedin: linkedin || null }),
        ...(twitter !== undefined && { twitter: twitter || null }),
        ...(github !== undefined && { github: github || null }),
        ...(photo !== undefined && { photo: photo || null }),
      },
    });

    return NextResponse.json({
      success: true,
      message: 'Team member updated successfully.',
      data: updated,
    });
  } catch (error) {
    console.error('Error updating team member:', error);
    return NextResponse.json(
      { success: false, message: 'Database error updating team member.' },
      { status: 500 }
    );
  }
}

// DELETE /api/admin/team/[id] - Delete team member (Admin only)
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
    const existing = await db.teamMember.findUnique({ where: { id } });
    if (!existing) {
      return NextResponse.json(
        { success: false, message: 'Team member not found.' },
        { status: 404 }
      );
    }

    await db.teamMember.delete({ where: { id } });
    return NextResponse.json({ success: true, message: 'Team member deleted successfully.' });
  } catch (error) {
    console.error('Error deleting team member:', error);
    return NextResponse.json(
      { success: false, message: 'Database error deleting team member.' },
      { status: 500 }
    );
  }
}
