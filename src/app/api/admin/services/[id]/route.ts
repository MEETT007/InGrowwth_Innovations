import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { requireAuthAndRole, requireAdminRole } from '@/lib/auth';
import { readJsonBody } from '@/lib/request-security';
import { logger } from '@/lib/logger';
import { parseArrayField, parseProcessField } from '@/lib/data-helpers';

interface RouteParams {
  params: Promise<{ id: string }>;
}

// PUT /api/admin/services/[id] - Update service (Admin & Editor)
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
    const parsedBody = await readJsonBody(request);
    if (!parsedBody.ok) return parsedBody.response;

    const // eslint-disable-next-line @typescript-eslint/no-explicit-any
      body = parsedBody.data as any;
    const { title, description, icon, content, features, process: serviceProcess, techStack, slug: customSlug } = body;

    const existing = await db.service.findUnique({ where: { id } });
    if (!existing) {
      return NextResponse.json({ success: false, message: 'Service not found.' }, { status: 404 });
    }

    let updatedSlug: string | undefined = undefined;
    if (customSlug !== undefined || title !== undefined) {
      const candidate = customSlug !== undefined ? customSlug : title;
      let baseSlug = String(candidate)
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)+/g, '');

      if (!baseSlug && existing.slug) {
        baseSlug = existing.slug;
      } else if (!baseSlug) {
        baseSlug = 'service';
      }

      if (baseSlug !== existing.slug) {
        let uniqueSlug = baseSlug;
        let counter = 1;
        while (true) {
          const conflict = await db.service.findUnique({ where: { slug: uniqueSlug } });
          if (!conflict || conflict.id === id) break;
          uniqueSlug = `${baseSlug}-${counter}`;
          counter++;
        }
        updatedSlug = uniqueSlug;
      }
    }

    const updated = await db.service.update({
      where: { id },
      data: {
        ...(title !== undefined && { title }),
        ...(description !== undefined && { description }),
        ...(icon !== undefined && { icon }),
        ...(content !== undefined && { content }),
        ...(features !== undefined && { features: parseArrayField(features) }),
        ...(serviceProcess !== undefined && { process: parseProcessField(serviceProcess) }),
        ...(techStack !== undefined && { techStack: parseArrayField(techStack) }),
        ...(updatedSlug !== undefined && { slug: updatedSlug }),
      },
    });

    return NextResponse.json({
      success: true,
      message: 'Service updated successfully.',
      data: updated,
    });
  } catch (error) {
    logger.error('Error updating service:', error);
    return NextResponse.json(
      { success: false, message: 'Database error updating service.' },
      { status: 500 }
    );
  }
}

// DELETE /api/admin/services/[id] - Delete service (Admin only)
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
    const existing = await db.service.findUnique({ where: { id } });
    if (!existing) {
      return NextResponse.json({ success: false, message: 'Service not found.' }, { status: 404 });
    }

    await db.service.delete({ where: { id } });
    return NextResponse.json({ success: true, message: 'Service deleted successfully.' });
  } catch (error) {
    logger.error('Error deleting service:', error);
    return NextResponse.json(
      { success: false, message: 'Database error deleting service.' },
      { status: 500 }
    );
  }
}
