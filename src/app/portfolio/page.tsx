import type { Metadata } from 'next';
import PortfolioClient from './PortfolioClient';
import { db } from '@/lib/db';

export const metadata: Metadata = {
  title: 'Portfolio & Case Studies | InGrowwth Innovations',
  description:
    'Explore our comprehensive portfolio and enterprise case studies. Proven software engineering, AI/ML architectures, and digital transformations delivered for global clients.',
  openGraph: {
    title: 'Portfolio & Case Studies | InGrowwth Innovations',
    description:
      'Explore our comprehensive portfolio and enterprise case studies spanning Cloud, AI/ML, Full-Stack Web, and Mobile solutions.',
    url: 'https://ingrowwthinnovations.com/portfolio',
  },
};

export const revalidate = 0;
export const dynamic = 'force-dynamic';

export default async function PortfolioPage() {
  const [dbProjects, dbCaseStudies] = await Promise.all([
    db.portfolioProject.findMany({
      orderBy: { createdAt: 'desc' },
    }),
    db.caseStudy.findMany({
      where: { status: 'PUBLISHED' },
      orderBy: { createdAt: 'desc' },
    }),
  ]);

  return <PortfolioClient initialProjects={dbProjects} initialCaseStudies={dbCaseStudies} />;
}
