import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { projects } from '@/lib/mock-data';
import ProjectDetailClient from './ProjectDetailClient';

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  return projects.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const project = projects.find((p) => p.slug === slug);
  if (!project) return {};
  return {
    title: `${project.title} | Projects | InGrowwth Innovations`,
    description: project.description,
    openGraph: {
      title: `${project.title} | InGrowwth Innovations`,
      description: project.description,
      url: `https://ingrowwthinnovations.com/projects/${project.slug}`,
    },
  };
}

export default async function ProjectDetailPage({ params }: Props) {
  const { slug } = await params;
  const project = projects.find((p) => p.slug === slug);
  if (!project) notFound();
  return <ProjectDetailClient project={project} />;
}
