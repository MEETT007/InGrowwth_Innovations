import React from 'react';
import { Metadata } from 'next';
import { db } from '@/lib/db';
import PortfolioClient from '../portfolio/PortfolioClient';

export const metadata: Metadata = {
  title: 'Portfolio & Case Studies | InGrowwth Innovations',
  description:
    'Explore how InGrowwth Innovations engineers mission-critical digital systems, scalable cloud platforms, and AI architectures for enterprise industry leaders.',
  openGraph: {
    title: 'Portfolio & Case Studies | InGrowwth Innovations',
    description:
      'Explore how InGrowwth Innovations engineers mission-critical digital systems, scalable cloud platforms, and AI architectures for enterprise industry leaders.',
    url: 'https://ingrowwthinnovations.com/portfolio',
    type: 'website',
  },
};

export const revalidate = 0;
export const dynamic = 'force-dynamic';

export default async function CaseStudiesPage() {
  const [dbProjects, dbCaseStudies] = await Promise.all([
    db.portfolioProject.findMany({
      orderBy: { createdAt: 'desc' },
    }),
    db.caseStudy.findMany({
      where: { status: 'PUBLISHED' },
      orderBy: { createdAt: 'desc' },
    }),
  ]);

  return (
    <PortfolioClient
      initialProjects={dbProjects}
      initialCaseStudies={dbCaseStudies}
      defaultTab="Case Studies"
    />
  );
}

