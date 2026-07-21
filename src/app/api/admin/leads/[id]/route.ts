import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { requireAuthAndRole, requireAdminRole } from '@/lib/auth';
import { LeadStatus } from '@/generated/prisma/client';

interface RouteContext {
  params: Promise<{ id: string }>;
}

/**
 * GET /api/admin/leads/[id]
 * Fetch single lead details (Admin & Editor access)
 */
export async function GET(request: NextRequest, context: RouteContext) {
  const authCheck = await requireAuthAndRole(['admin', 'editor']);
  if (!authCheck.authorized) {
    return NextResponse.json(
      { success: false, message: authCheck.error },
      { status: authCheck.status || 401 }
    );
  }

  const { id } = await context.params;

  try {
    const lead = await db.lead.findUnique({ where: { id } });
    if (!lead) {
      return NextResponse.json({ success: false, message: 'Lead not found.' }, { status: 404 });
    }

    return NextResponse.json({ success: true, data: lead });
  } catch (error) {
    console.error(`Error fetching lead ID ${id}:`, error);
    return NextResponse.json(
      { success: false, message: 'Error retrieving lead record.' },
      { status: 500 }
    );
  }
}

/**
 * PUT /api/admin/leads/[id]
 * Update lead status or details (Restricted to Admin only)
 */
export async function PUT(request: NextRequest, context: RouteContext) {
  // Enforce RBAC: Admin role required for PUT write operations
  const authCheck = await requireAdminRole();
  if (!authCheck.authorized) {
    return NextResponse.json(
      { success: false, message: authCheck.error },
      { status: authCheck.status || 403 }
    );
  }

  const { id } = await context.params;

  let body: {
    status?: LeadStatus;
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
    body = await request.json();
  } catch {
    return NextResponse.json(
      { success: false, message: 'Malformed JSON payload.' },
      { status: 400 }
    );
  }

  try {
    const existing = await db.lead.findUnique({ where: { id } });
    if (!existing) {
      return NextResponse.json({ success: false, message: 'Lead not found.' }, { status: 404 });
    }

    const updatedLead = await db.lead.update({
      where: { id },
      data: {
        ...(body.status && { status: body.status }),
        ...(body.name !== undefined && { name: body.name }),
        ...(body.phone !== undefined && { phone: body.phone }),
        ...(body.subject !== undefined && { subject: body.subject }),
        ...(body.message !== undefined && { message: body.message }),
        ...(body.budget !== undefined && { budget: body.budget }),
        ...(body.timeline !== undefined && { timeline: body.timeline }),
        ...(body.service !== undefined && { service: body.service }),
        ...(body.projectDetails !== undefined && { projectDetails: body.projectDetails }),
      },
    });

    return NextResponse.json({
      success: true,
      message: 'Lead updated successfully.',
      data: updatedLead,
    });
  } catch (error) {
    console.error(`Error updating lead ID ${id}:`, error);
    return NextResponse.json(
      { success: false, message: 'Database error updating lead.' },
      { status: 500 }
    );
  }
}

/**
 * DELETE /api/admin/leads/[id]
 * Delete lead record (Restricted to Admin only)
 */
export async function DELETE(request: NextRequest, context: RouteContext) {
  // Enforce RBAC: Admin role required for DELETE write operations
  const authCheck = await requireAdminRole();
  if (!authCheck.authorized) {
    return NextResponse.json(
      { success: false, message: authCheck.error },
      { status: authCheck.status || 403 }
    );
  }

  const { id } = await context.params;

  try {
    const existing = await db.lead.findUnique({ where: { id } });
    if (!existing) {
      return NextResponse.json({ success: false, message: 'Lead not found.' }, { status: 404 });
    }

    await db.lead.delete({ where: { id } });

    return NextResponse.json({
      success: true,
      message: 'Lead deleted successfully.',
    });
  } catch (error) {
    console.error(`Error deleting lead ID ${id}:`, error);
    return NextResponse.json(
      { success: false, message: 'Database error deleting lead.' },
      { status: 500 }
    );
  }
}
