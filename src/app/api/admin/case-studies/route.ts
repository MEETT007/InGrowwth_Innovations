import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { requireAuthAndRole, requireAdminRole } from '@/lib/auth';

export async function GET() {
  const authCheck = await requireAuthAndRole(['admin', 'editor']);
  if (!authCheck.authorized) {
    return NextResponse.json(
      { success: false, message: authCheck.error },
      { status: authCheck.status || 401 }
    );
  }

  try {
    const caseStudies = await db.caseStudy.findMany({
      orderBy: { createdAt: 'desc' },
    });
    return NextResponse.json({ success: true, data: caseStudies });
  } catch (error) {
    console.error('Error fetching case studies:', error);
    return NextResponse.json(
      { success: false, message: 'Database error fetching case studies.' },
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
    const body = await request.json();
    const { 
      title, slug, heroBanner, coverImage, clientName, industry,
      problemStatement, businessChallenges, objectives, research, strategy,
      solution, architecture, designProcess, developmentJourney, technologies,
      beforeVsAfter, kpis, charts, roi, results, clientTestimonial, media,
      downloadPdfUrl, cta, seoTitle, seoDescription, status
    } = body;

    if (!title || !slug) {
      return NextResponse.json(
        { success: false, message: 'Title and Slug are required.' },
        { status: 400 }
      );
    }

    const caseStudy = await db.caseStudy.create({
      data: {
        title, slug, heroBanner, coverImage, clientName, industry,
        problemStatement, businessChallenges, objectives, research, strategy,
        solution, architecture, designProcess, developmentJourney, technologies,
        beforeVsAfter, kpis, charts, roi, results, clientTestimonial, media,
        downloadPdfUrl, cta, seoTitle, seoDescription, status: status || 'DRAFT'
      },
    });

    return NextResponse.json(
      { success: true, message: 'Case study created successfully.', data: caseStudy },
      { status: 201 }
    );
  } catch (error) {
    console.error('Error creating case study:', error);
    return NextResponse.json(
      { success: false, message: 'Database error creating case study.' },
      { status: 500 }
    );
  }
}
