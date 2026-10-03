import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { requireAuthAndRole, requireAdminRole } from '@/lib/auth';
import { readJsonBody } from '@/lib/request-security';
import { logger } from '@/lib/logger';
import { parseArrayField, parseProcessField } from '@/lib/data-helpers';

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
    logger.error('Error fetching services:', error);
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
    const parsedBody = await readJsonBody(request);
    if (!parsedBody.ok) return parsedBody.response;

    const // eslint-disable-next-line @typescript-eslint/no-explicit-any
      body = parsedBody.data as any;
    const { title, description, icon, content, features, process: serviceProcess, techStack, slug: customSlug } = body;

    if (!title || !description || !icon || !content) {
      return NextResponse.json(
        { success: false, message: 'Missing required fields.' },
        { status: 400 }
      );
    }
    
    // Generate clean URL-safe slug from customSlug or title
    const rawSlugCandidate = customSlug || title;
    let baseSlug = String(rawSlugCandidate)
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)+/g, '');
    if (!baseSlug) baseSlug = 'service';

    let uniqueSlug = baseSlug;
    let counter = 1;
    while (await db.service.findUnique({ where: { slug: uniqueSlug } })) {
      uniqueSlug = `${baseSlug}-${counter}`;
      counter++;
    }

    const normalizedFeatures = parseArrayField(features);
    const normalizedProcess = parseProcessField(serviceProcess);
    const normalizedTechStack = parseArrayField(techStack);

    const service = await db.service.create({
      data: { 
        title, 
        description, 
        icon, 
        content,
        features: normalizedFeatures,
        process: normalizedProcess,
        techStack: normalizedTechStack,
        slug: uniqueSlug,
      },
    });

    return NextResponse.json(
      { success: true, message: 'Service created successfully.', data: service },
      { status: 201 }
    );
  } catch (error) {
    logger.error('Error creating service:', error);
    return NextResponse.json(
      { success: false, message: 'Database error creating service.' },
      { status: 500 }
    );
  }
}
