import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { db } from '@/lib/db';
import ServiceDetailClient from './ServiceDetailClient';

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  const services = await db.service.findMany({ select: { slug: true } });
  return services.filter(s => s.slug).map((service) => ({ slug: service.slug as string }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const service = await db.service.findUnique({ where: { slug } });

  if (!service) {
    return {
      title: 'Service Not Found | InGrowwth Innovations',
    };
  }

  return {
    title: `${service.title} | InGrowwth Innovations`,
    description: service.description,
  };
}

export default async function ServiceDetailPage({ params }: Props) {
  const { slug } = await params;
  const service = await db.service.findUnique({ where: { slug } });

  if (!service) {
    notFound();
  }

  return <ServiceDetailClient service={service} />;
}
