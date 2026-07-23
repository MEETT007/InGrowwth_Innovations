import React from 'react';
import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { MOCK_POSTS } from '@/lib/mock-data';
import BlogDetailClient from './BlogDetailClient';

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  return MOCK_POSTS.map((post) => ({ slug: post.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const resolvedParams = await params;
  const post = MOCK_POSTS.find((p) => p.slug === resolvedParams.slug);

  if (!post) {
    return {
      title: 'Article Not Found | InGrowwth Innovations',
    };
  }

  return {
    title: `${post.title} | InGrowwth Innovations Blog`,
    description: post.excerpt,
    openGraph: {
      title: post.title,
      description: post.excerpt,
      type: 'article',
      url: `https://ingrowwthinnovations.com/blog/${post.slug}`,
      publishedTime: new Date(post.date).toISOString(),
      images: [
        {
          url: post.thumbnail,
          width: 1200,
          height: 630,
          alt: post.title,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: post.title,
      description: post.excerpt,
      images: [post.thumbnail],
    },
  };
}

export default async function BlogPostPage({ params }: Props) {
  const resolvedParams = await params;
  const post = MOCK_POSTS.find((p) => p.slug === resolvedParams.slug);

  if (!post) {
    notFound();
  }

  // Create JSON-LD schema for BlogPosting
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: post.title,
    description: post.excerpt,
    image: post.thumbnail,
    datePublished: new Date(post.date).toISOString(),
    author: {
      '@type': 'Person',
      name: post.author.name,
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
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <BlogDetailClient post={post} />
    </>
  );
}
