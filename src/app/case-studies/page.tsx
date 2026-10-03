import React from 'react';
import { Metadata } from 'next';
import { db } from '@/lib/db';
import CaseStudiesClient from './CaseStudiesClient';

export const metadata: Metadata = {
  title: 'Enterprise Case Studies | InGrowwth Innovations',
  description:
    'Explore how InGrowwth Innovations engineers mission-critical digital systems, scalable cloud platforms, and AI architectures for enterprise industry leaders.',
  openGraph: {
    title: 'Enterprise Case Studies | InGrowwth Innovations',
    description:
      'Explore how InGrowwth Innovations engineers mission-critical digital systems, scalable cloud platforms, and AI architectures for enterprise industry leaders.',
    url: 'https://ingrowwthinnovations.com/case-studies',
    type: 'website',
  },
};

export const revalidate = 60; // 60s ISR

export default async function CaseStudiesPage() {
  const caseStudies = await db.caseStudy.findMany({
    where: { status: 'PUBLISHED' },
    orderBy: { createdAt: 'desc' },
  });

  return <CaseStudiesClient initialCaseStudies={caseStudies} />;
}
