import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { requireAuthAndRole, requireAdminRole } from '@/lib/auth';

// GET /api/admin/portfolio - Fetch all portfolio projects
export async function GET() {
  const authCheck = await requireAuthAndRole(['admin', 'editor']);
  if (!authCheck.authorized) {
    return NextResponse.json(
      { success: false, message: authCheck.error },
      { status: authCheck.status || 401 }
    );
  }

  try {
    const portfolio = await db.portfolioProject.findMany({
      orderBy: { createdAt: 'desc' },
    });
    return NextResponse.json({ success: true, data: portfolio });
  } catch (error) {
    console.error('Error fetching portfolio:', error);
    return NextResponse.json(
      { success: false, message: 'Database error fetching portfolio.' },
      { status: 500 }
    );
  }
}

// POST /api/admin/portfolio - Create portfolio project (Admin only)
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
    const { title, client, category, websiteUrl, description, gallery } = body;

    if (!title || !client || !category || !description) {
      return NextResponse.json(
        { success: false, message: 'Missing required fields.' },
        { status: 400 }
      );
    }

    const project = await db.portfolioProject.create({
      data: {
        title,
        client,
        category,
        websiteUrl: websiteUrl || null,
        description,
        gallery: gallery || null,
      },
    });

    return NextResponse.json(
      { success: true, message: 'Portfolio project created successfully.', data: project },
      { status: 201 }
    );
  } catch (error) {
    console.error('Error creating portfolio project:', error);
    return NextResponse.json(
      { success: false, message: 'Database error creating portfolio project.' },
      { status: 500 }
    );
  }
}
