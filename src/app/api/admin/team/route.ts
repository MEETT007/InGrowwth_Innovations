import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { requireAuthAndRole, requireAdminRole } from '@/lib/auth';
import { readJsonBody } from '@/lib/request-security';

// GET /api/admin/team - Fetch all team members
export async function GET() {
  const authCheck = await requireAuthAndRole(['admin', 'editor']);
  if (!authCheck.authorized) {
    return NextResponse.json(
      { success: false, message: authCheck.error },
      { status: authCheck.status || 401 }
    );
  }

  try {
    const team = await db.teamMember.findMany({
      orderBy: { createdAt: 'desc' },
    });
    return NextResponse.json({ success: true, data: team });
  } catch (error) {
    console.error('Error fetching team members:', error);
    return NextResponse.json(
      { success: false, message: 'Database error fetching team members.' },
      { status: 500 }
    );
  }
}

// POST /api/admin/team - Create team member (Admin only)
export async function POST(request: NextRequest) {
  const authCheck = await requireAdminRole();
  if (!authCheck.authorized) {
    return NextResponse.json(
      { success: false, message: authCheck.error },
      { status: authCheck.status || 403 }
    );
  }

  try {
    const parsedBody = await readJsonBody(request);
    if (!parsedBody.ok) return parsedBody.response;

    const // eslint-disable-next-line @typescript-eslint/no-explicit-any
      body = parsedBody.data as any;
    const { name, role, email, bio, linkedin, twitter, github, photo } = body;

    if (!name || !role) {
      return NextResponse.json(
        { success: false, message: 'Missing required fields (name, role).' },
        { status: 400 }
      );
    }

    const member = await db.teamMember.create({
      data: {
        name,
        role,
        email: email || null,
        bio: bio || null,
        linkedin: linkedin || null,
        twitter: twitter || null,
        github: github || null,
        photo: photo || null,
      },
    });

    return NextResponse.json(
      { success: true, message: 'Team member created successfully.', data: member },
      { status: 201 }
    );
  } catch (error) {
    console.error('Error creating team member:', error);
    return NextResponse.json(
      { success: false, message: 'Database error creating team member.' },
      { status: 500 }
    );
  }
}
