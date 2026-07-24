import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { requireAuthAndRole, requireAdminRole } from '@/lib/auth';

interface RouteParams {
  params: Promise<{ id: string }>;
}

// PUT /api/admin/blogs/[id] - Update blog post (Admin & Editor)
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
    const { 
      title, 
      slug,
      shortDescription,
      category, 
      status, 
      tags, 
      thumbnail, 
      content,
      seoTitle,
      seoDescription,
      readTime,
      authorName,
      publishDate 
    } = body;

    const existing = await db.blogPost.findUnique({ where: { id } });
    if (!existing) {
      return NextResponse.json(
        { success: false, message: 'Blog post not found.' },
        { status: 404 }
      );
    }

    const updated = await db.blogPost.update({
      where: { id },
      data: {
        ...(title !== undefined && { title }),
        ...(slug !== undefined && { slug: slug || undefined }),
        ...(shortDescription !== undefined && { shortDescription }),
        ...(category !== undefined && { category }),
        ...(status !== undefined && { status }),
        ...(tags !== undefined && { tags }),
        ...(thumbnail !== undefined && { thumbnail: thumbnail || null }),
        ...(content !== undefined && { content }),
        ...(seoTitle !== undefined && { seoTitle }),
        ...(seoDescription !== undefined && { seoDescription }),
        ...(readTime !== undefined && { readTime: readTime ? parseInt(readTime) : null }),
        ...(authorName !== undefined && { authorName }),
        ...(publishDate !== undefined && { publishDate: publishDate ? new Date(publishDate) : null }),
      },
    });

    return NextResponse.json({
      success: true,
      message: 'Blog post updated successfully.',
      data: updated,
    });
  } catch (error) {
    console.error('Error updating blog post:', error);
    return NextResponse.json(
      { success: false, message: 'Database error updating blog post.' },
      { status: 500 }
    );
  }
}

// DELETE /api/admin/blogs/[id] - Delete blog post (Admin only)
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
    const existing = await db.blogPost.findUnique({ where: { id } });
    if (!existing) {
      return NextResponse.json(
        { success: false, message: 'Blog post not found.' },
        { status: 404 }
      );
    }

    await db.blogPost.delete({ where: { id } });
    return NextResponse.json({ success: true, message: 'Blog post deleted successfully.' });
  } catch (error) {
    console.error('Error deleting blog post:', error);
    return NextResponse.json(
      { success: false, message: 'Database error deleting blog post.' },
      { status: 500 }
    );
  }
}
