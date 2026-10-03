import React from 'react';
import { notFound } from 'next/navigation';
import { Metadata } from 'next';
import { db } from '@/lib/db';
import CaseStudyDetailClient from './CaseStudyDetailClient';

interface Props {
  params: Promise<{ slug: string }>;
}

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const resolvedParams = await params;
  let study = await db.caseStudy.findUnique({
    where: { slug: resolvedParams.slug },
  });
  if (!study) {
    study = await db.caseStudy.findUnique({
      where: { id: resolvedParams.slug },
    });
  }

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

export default async function CaseStudyDetailPage({ params }: Props) {
  const resolvedParams = await params;
  let study = await db.caseStudy.findUnique({
    where: { slug: resolvedParams.slug },
  });

  if (!study) {
    study = await db.caseStudy.findUnique({
      where: { id: resolvedParams.slug },
    });
  }

  if (!study) {
    notFound();
  }

  return <CaseStudyDetailClient data={study} />;
}
