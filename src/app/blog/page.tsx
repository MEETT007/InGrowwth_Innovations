import type { Metadata } from 'next';
import BlogClient from './BlogClient';
import { db } from '@/lib/db';

export const metadata: Metadata = {
  title: 'Blog & Insights | InGrowwth Innovations',
  description:
    'Thoughts, strategies, and updates on product development, engineering, and digital transformation.',
  openGraph: {
    title: 'Blog & Insights | InGrowwth Innovations',
    description:
      'Thoughts, strategies, and updates on product development, engineering, and digital transformation.',
    url: 'https://ingrowwthinnovations.com/blog',
  },
};

export const revalidate = 0;

export default async function BlogPage() {
  const posts = await db.blogPost.findMany({
    where: {
      status: 'Published',
    },
    orderBy: {
      createdAt: 'desc',
    },
  });

  return <BlogClient initialPosts={posts} />;
}
