import type { Metadata } from 'next';
import ProjectsClient from './ProjectsClient';
import { db } from '@/lib/db';

export const metadata: Metadata = {
  title: 'Our Projects | InGrowwth Innovations',
  description:
    'Explore case studies & projects from InGrowwth Innovations — web, mobile, AI and cloud solutions delivered to real clients across industries.',
  openGraph: {
    title: 'Our Projects | InGrowwth Innovations',
    description:
      'Selected projects showcasing our work in web, mobile, AI/ML, IoT and cloud solutions.',
    url: 'https://ingrowwthinnovations.com/projects',
  },
};

export const revalidate = 0;
export const dynamic = 'force-dynamic';
export default async function ProjectsPage() {
  const dbProjects = await db.portfolioProject.findMany({
    orderBy: { createdAt: 'desc' },
  });

  return <ProjectsClient initialProjects={dbProjects} />;
}
