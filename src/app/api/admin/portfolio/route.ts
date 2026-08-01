import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { requireAuthAndRole, requireAdminRole } from '@/lib/auth';
import { readJsonBody } from '@/lib/request-security';

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
    const {
      title,
      client,
      category,
      websiteUrl,
      description,
      gallery,
      coverImage,
      industry,
      servicesUsed,
      technologiesUsed,
      teamMembers,
      duration,
      projectStatus,
      projectOverview,
      challenges,
      solution,
      features,
      results,
      metrics,
      testimonial,
      cta,
      seoTitle,
      seoDescription,
    } = body;

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
        coverImage,
        industry,
        servicesUsed,
        technologiesUsed,
        teamMembers,
        duration,
        projectStatus,
        projectOverview,
        challenges,
        solution,
        features,
        results,
        metrics,
        testimonial,
        cta,
        seoTitle,
        seoDescription,
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
