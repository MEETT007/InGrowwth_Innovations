import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { requireAuthAndRole, requireAdminRole } from '@/lib/auth';
import { LeadType, LeadStatus } from '@/generated/prisma/client';
import { readJsonBody } from '@/lib/request-security';

/**
 * GET /api/admin/leads
 * Protected endpoint: Returns leads list (Accessible to admin and editor)
 */
export async function GET(request: NextRequest) {
  // Enforce RBAC
  const authCheck = await requireAuthAndRole(['admin', 'editor']);
  if (!authCheck.authorized) {
    return NextResponse.json(
      { success: false, message: authCheck.error },
      { status: authCheck.status || 401 }
    );
  }

  const { searchParams } = new URL(request.url);
  const typeFilter = searchParams.get('type') as LeadType | null;
  const statusFilter = searchParams.get('status') as LeadStatus | null;
  const searchQuery = searchParams.get('q');

  try {
    const whereClause: Record<string, unknown> = {};

    if (typeFilter) {
      whereClause.type = typeFilter;
    }
    if (statusFilter) {
      whereClause.status = statusFilter;
    }
    if (searchQuery) {
      whereClause.OR = [
        { email: { contains: searchQuery, mode: 'insensitive' } },
        { name: { contains: searchQuery, mode: 'insensitive' } },
        { subject: { contains: searchQuery, mode: 'insensitive' } },
      ];
    }

    const leads = await db.lead.findMany({
      where: whereClause,
      orderBy: { createdAt: 'desc' },
    });

    return NextResponse.json({
      success: true,
      data: leads,
      total: leads.length,
    });
  } catch (error) {
    console.error('Error fetching admin leads:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to retrieve leads database records.' },
      { status: 500 }
    );
  }
}

/**
 * POST /api/admin/leads
 * Protected endpoint: Manually create a lead (Restricted to Admin only)
 */
export async function POST(request: NextRequest) {
  // Enforce RBAC: Admin role required for POST write operations
  const authCheck = await requireAdminRole();
  if (!authCheck.authorized) {
    return NextResponse.json(
      { success: false, message: authCheck.error },
      { status: authCheck.status || 403 }
    );
  }

  let body: {
    type?: LeadType;
    status?: LeadStatus;
    email?: string;
    name?: string;
    phone?: string;
    subject?: string;
    message?: string;
    budget?: string;
    timeline?: string;
    service?: string;
    projectDetails?: string;
  };

  try {
    const parsedBody = await readJsonBody(request);
    if (!parsedBody.ok) return parsedBody.response;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    body = parsedBody.data as any;
  } catch {
    return NextResponse.json(
      { success: false, message: 'Malformed JSON payload.' },
      { status: 400 }
    );
  }

  if (!body.email || !body.type) {
    return NextResponse.json(
      { success: false, message: 'Missing required fields: email and type are mandatory.' },
      { status: 400 }
    );
  }

  try {
    const newLead = await db.lead.create({
      data: {
        type: body.type,
        status: body.status || 'NEW',
        email: body.email,
        name: body.name || null,
        phone: body.phone || null,
        subject: body.subject || null,
        message: body.message || null,
        budget: body.budget || null,
        timeline: body.timeline || null,
        service: body.service || null,
        projectDetails: body.projectDetails || null,
      },
    });

    return NextResponse.json(
      {
        success: true,
        message: 'Lead created successfully.',
        data: newLead,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('Error creating lead manually:', error);
    return NextResponse.json(
      { success: false, message: 'Database error creating lead.' },
      { status: 500 }
    );
  }
}
