import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { logger } from '@/lib/logger';

interface RouteParams {
  params: Promise<{ slug: string }>;
}

// GET /api/blog/[slug] - Fetch a single published blog post by slug
export async function GET(request: NextRequest, { params }: RouteParams) {
  const { slug } = await params;
  try {
    const blog = await db.blogPost.findFirst({
      where: {
        OR: [{ slug }, { id: slug }],
        status: 'Published',
      },
    });

    if (!blog) {
      return NextResponse.json(
        { success: false, message: 'Blog post not found.' },
        { status: 404 }
      );
    }
    
    return NextResponse.json({ success: true, data: blog });
  } catch (error) {
    logger.error('Error fetching blog post:', error);
    return NextResponse.json(
      { success: false, message: 'Database error fetching blog post.' },
      { status: 500 }
    );
  }
}
