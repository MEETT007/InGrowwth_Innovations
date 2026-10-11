import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { logger } from '@/lib/logger';

export const dynamic = 'force-dynamic';

// GET /api/services - Fetch all services for public consumers (footer, home core expertise, sitemaps, etc.)
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const expertiseOnly = searchParams.get('expertise') === 'true';

    const services = await db.service.findMany({
      where: expertiseOnly ? { isExpertise: true } : undefined,
      select: {
        id: true,
        title: true,
        slug: true,
        description: true,
        icon: true,
        isExpertise: true,
      },
      orderBy: { createdAt: 'desc' },
    });

    const formattedServices = services.map((s) => ({
      id: s.id,
      title: s.title,
      label: s.title,
      description: s.description,
      icon: s.icon,
      isExpertise: s.isExpertise,
      href: `/services/${s.slug || s.id}`,
    }));

    return NextResponse.json({ success: true, data: formattedServices });
  } catch (error) {
    logger.error('Error fetching public services:', error);
    return NextResponse.json(
      { success: false, message: 'Database error fetching services.', data: [] },
      { status: 500 }
    );
  }
}
