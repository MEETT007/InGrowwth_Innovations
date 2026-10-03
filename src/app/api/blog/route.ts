import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { logger } from '@/lib/logger';

// GET /api/blog - Fetch all published blog posts
export async function GET() {
  try {
    const blogs = await db.blogPost.findMany({
      where: {
        status: 'Published',
      },
      orderBy: { createdAt: 'desc' },
    });
    return NextResponse.json({ success: true, data: blogs });
  } catch (error) {
    logger.error('Error fetching blog posts:', error);
    return NextResponse.json(
      { success: false, message: 'Database error fetching blog posts.' },
      { status: 500 }
    );
  }
}
