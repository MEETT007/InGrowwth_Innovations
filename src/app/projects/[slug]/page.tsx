import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { db } from '@/lib/db';
import ProjectDetailClient from './ProjectDetailClient';

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;

  const portfolio = await db.portfolioProject.findUnique({ where: { slug } });

  if (!portfolio) return {};

  return {
    title: `${portfolio.title} | Projects | InGrowwth Innovations`,
    description: portfolio.description,
    openGraph: {
      title: `${portfolio.title} | InGrowwth Innovations`,
      description: portfolio.description,
      url: `https://ingrowwthinnovations.com/projects/${slug}`,
    },
  };
}

export default async function ProjectDetailPage({ params }: Props) {
  const { slug } = await params;

  const portfolio = await db.portfolioProject.findUnique({ where: { slug } });
  if (portfolio) {
    return <ProjectDetailClient data={portfolio} />;
  }

  // Fallback for backwards compatibility with UUIDs in the URL
  const portfolioById = await db.portfolioProject.findUnique({ where: { id: slug } });
  if (portfolioById) {
    return <ProjectDetailClient data={portfolioById} />;
  }

  notFound();
}
