import React from 'react';
import { notFound } from 'next/navigation';
import { Metadata } from 'next';
import { db } from '@/lib/db';
import CaseStudyDetailClient from './CaseStudyDetailClient';

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const resolvedParams = await params;
  const study = await db.caseStudy.findUnique({
    where: { slug: resolvedParams.slug },
  });

  if (!study) {
    return {
      title: 'Case Study Not Found | InGrowwth Innovations',
    };
  }

  return {
    title: study.seoTitle || `${study.title} | Case Study`,
    description:
      study.seoDescription ||
      study.problemStatement ||
      'Discover how InGrowwth Innovations architected this enterprise transformation.',
    openGraph: {
      title: study.seoTitle || `${study.title} | Case Study`,
      description:
        study.seoDescription ||
        study.problemStatement ||
        'Discover how InGrowwth Innovations architected this enterprise transformation.',
      images: study.coverImage ? [study.coverImage] : undefined,
    },
  };
}

export const revalidate = 60;

export default async function CaseStudyDetailPage({ params }: Props) {
  const resolvedParams = await params;
  const study = await db.caseStudy.findUnique({
    where: { slug: resolvedParams.slug },
  });

  if (!study || study.status !== 'PUBLISHED') {
    notFound();
  }

  return <CaseStudyDetailClient data={study} />;
}
