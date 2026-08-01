import React from 'react';
import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { headers } from 'next/headers';
import { db } from '@/lib/db';
import BlogDetailClient from './BlogDetailClient';

export const revalidate = 0;

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const resolvedParams = await params;
  const post = await db.blogPost.findUnique({
    where: { slug: resolvedParams.slug },
  });

  if (!post) {
    return {
      title: 'Article Not Found | InGrowwth Innovations',
    };
  }

  return {
    title: `${post.seoTitle || post.title} | InGrowwth Innovations Blog`,
    description: post.seoDescription || post.shortDescription || '',
    openGraph: {
      title: post.title,
      description: post.shortDescription || '',
      type: 'article',
      url: `https://ingrowwthinnovations.com/blog/${post.slug}`,
      publishedTime: new Date(post.publishDate || post.createdAt).toISOString(),
      images: post.thumbnail
        ? [
            {
              url: post.thumbnail,
              width: 1200,
              height: 630,
              alt: post.title,
            },
          ]
        : [],
    },
    twitter: {
      card: 'summary_large_image',
      title: post.title,
      description: post.shortDescription || '',
      images: post.thumbnail ? [post.thumbnail] : [],
    },
  };
}

export default async function BlogPostPage({ params }: Props) {
  const resolvedParams = await params;
  const nonce = (await headers()).get('x-nonce') || undefined;

  const post = await db.blogPost.findUnique({
    where: { slug: resolvedParams.slug },
  });

  if (!post) {
    notFound();
  }

  const serializedPost = {
    ...post,
    createdAt: post.createdAt.toISOString(),
    updatedAt: post.updatedAt.toISOString(),
    publishDate: post.publishDate ? post.publishDate.toISOString() : null,
  };

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: post.title,
    description: post.shortDescription,
    image: post.thumbnail,
    datePublished: new Date(post.publishDate || post.createdAt).toISOString(),
    author: {
      '@type': 'Person',
      name: post.authorName || 'InGrowwth Team',
    },
    publisher: {
      '@type': 'Organization',
      name: 'InGrowwth Innovations',
      logo: {
        '@type': 'ImageObject',
        url: 'https://ingrowwthinnovations.com/logo.png',
      },
    },
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': `https://ingrowwthinnovations.com/blog/${post.slug}`,
    },
  };

  return (
    <>
      <script
        nonce={nonce}
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(jsonLd)
            .replace(/</g, '\\u003c')
            .replace(/>/g, '\\u003e')
            .replace(/&/g, '\\u0026'),
        }}
      />
      {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
      <BlogDetailClient post={serializedPost as any} />
    </>
  );
}
