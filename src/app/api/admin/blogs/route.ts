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
    const blogs = await db.blogPost.findMany({
      orderBy: { createdAt: 'desc' },
    });
    return NextResponse.json({ success: true, data: blogs });
  } catch (error) {
    console.error('Error fetching blog posts:', error);
    return NextResponse.json(
      { success: false, message: 'Database error fetching blog posts.' },
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
      publishDate,
    } = body;

    if (!title || !category || !status || !tags || !content) {
      return NextResponse.json(
        { success: false, message: 'Missing required fields.' },
        { status: 400 }
      );
    }

    const blog = await db.blogPost.create({
      data: {
        title,
        slug: slug || undefined, // Prisma will use uuid default if undefined
        shortDescription,
        category,
        status,
        tags,
        thumbnail: thumbnail || null,
        content,
        seoTitle,
        seoDescription,
        readTime: readTime ? parseInt(readTime) : null,
        authorName,
        publishDate: publishDate ? new Date(publishDate) : null,
      },
    });

    return NextResponse.json(
      { success: true, message: 'Blog post created successfully.', data: blog },
      { status: 201 }
    );
  } catch (error) {
    console.error('Error creating blog post:', error);
    return NextResponse.json(
      { success: false, message: 'Database error creating blog post.' },
      { status: 500 }
    );
  }
}
