import type { Metadata } from 'next';
import { notFound, redirect } from 'next/navigation';
import { db } from '@/lib/db';
import ServiceDetailClient from './ServiceDetailClient';

interface Props {
  params: Promise<{ slug: string }>;
}

export const dynamic = 'force-dynamic';

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  let service = await db.service.findUnique({ where: { slug } });

  if (!service) {
    service = await db.service.findUnique({ where: { id: slug } });
  }

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
  let service = await db.service.findUnique({ where: { slug } });

  if (!service) {
    service = await db.service.findUnique({ where: { id: slug } });

    if (service) {
      const generatedSlug = service.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
      if (generatedSlug && generatedSlug !== service.slug) {
        try {
          await db.service.update({
            where: { id: service.id },
            data: { slug: generatedSlug }
          });
          redirect(`/services/${generatedSlug}`);
        } catch (e) {
          // Ignore error if slug exists
        }
      }
    }
  }

  if (!service) {
    notFound();
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return <ServiceDetailClient service={service as any} />;
}
