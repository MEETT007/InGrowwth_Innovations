import type { Metadata } from 'next';
import { notFound, redirect } from 'next/navigation';
import { db } from '@/lib/db';
import ProjectDetailClient from './ProjectDetailClient';

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;

  let title = '';
  let description = '';

  let portfolio = await db.portfolioProject.findUnique({ where: { slug } });
  if (!portfolio) {
    portfolio = await db.portfolioProject.findUnique({ where: { id: slug } });
  }

  if (portfolio) {
    title = portfolio.title;
    description = portfolio.description;
  } else {
    let caseStudy = await db.caseStudy.findUnique({ where: { slug } });
    if (!caseStudy) {
      caseStudy = await db.caseStudy.findUnique({ where: { id: slug } });
    }

    if (caseStudy) {
      title = caseStudy.title;
      description = caseStudy.seoDescription || caseStudy.problemStatement || '';
    } else {
      return {};
    }
  }

  return {
    title: `${title} | Projects | InGrowwth Innovations`,
    description: description,
    openGraph: {
      title: `${title} | InGrowwth Innovations`,
      description: description,
      url: `https://ingrowwthinnovations.com/projects/${slug}`,
    },
  };
}

function mapCaseStudyToProject(caseStudy: any) {
  return {
    title: caseStudy.title,
    client: caseStudy.clientName || 'Confidential',
    category: caseStudy.industry || 'Case Study',
    description: caseStudy.problemStatement || '',
    projectOverview: caseStudy.solution || '',
    websiteUrl: null,
    features: null,
    technologiesUsed: caseStudy.technologies,
    gallery: [caseStudy.heroBanner, caseStudy.coverImage].filter(Boolean).join(',') || null,
  };
}

export default async function ProjectDetailPage({ params }: Props) {
  const { slug } = await params;

  const portfolio = await db.portfolioProject.findUnique({ where: { slug } });
  if (portfolio) {
    return <ProjectDetailClient data={portfolio} />;
  }

  const caseStudy = await db.caseStudy.findUnique({ where: { slug } });
  if (caseStudy) {
    return <ProjectDetailClient data={mapCaseStudyToProject(caseStudy)} />;
  }

  // Fallback for backwards compatibility with UUIDs in the URL
  const portfolioById = await db.portfolioProject.findUnique({ where: { id: slug } });
  if (portfolioById) {
    const generatedSlug = portfolioById.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
    if (generatedSlug && generatedSlug !== portfolioById.slug) {
      try {
        await db.portfolioProject.update({
          where: { id: portfolioById.id },
          data: { slug: generatedSlug }
        });
        redirect(`/projects/${generatedSlug}`);
      } catch (e) {
        // Ignore error if slug already exists, just render
      }
    }
    return <ProjectDetailClient data={portfolioById} />;
  }

  const caseStudyById = await db.caseStudy.findUnique({ where: { id: slug } });
  if (caseStudyById) {
    const generatedSlug = caseStudyById.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
    if (generatedSlug && generatedSlug !== caseStudyById.slug) {
      try {
        await db.caseStudy.update({
          where: { id: caseStudyById.id },
          data: { slug: generatedSlug }
        });
        redirect(`/projects/${generatedSlug}`);
      } catch (e) {
        // Ignore error
      }
    }
    return <ProjectDetailClient data={mapCaseStudyToProject(caseStudyById)} />;
  }

  notFound();
}
