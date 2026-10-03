import type { Metadata } from 'next';
import { notFound, redirect } from 'next/navigation';
import { db } from '@/lib/db';
import { findServiceBySlugOrId, sanitizeSlug } from '@/lib/service-lookup';
import ServiceDetailClient from './ServiceDetailClient';

interface Props {
  params: Promise<{ slug: string }>;
}

export const dynamic = 'force-dynamic';

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const service = await findServiceBySlugOrId(slug);

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
  const service = await findServiceBySlugOrId(slug);

  if (!service) {
    notFound();
  }

  // Determine canonical clean slug
  const canonicalSlug = sanitizeSlug(service.slug || service.title);

  // Auto-heal slug in database if it was null or dirty (e.g. contained '&' or special chars)
  if (!service.slug || service.slug !== canonicalSlug) {
    try {
      await db.service.update({
        where: { id: service.id },
        data: { slug: canonicalSlug },
      });
      service.slug = canonicalSlug;
    } catch {
      // Ignore if collision or concurrently updated
    }
  }

  // If accessed via ID, legacy URL with special characters, or alias, redirect to canonical slug
  if (service.slug && slug !== service.slug) {
    redirect(`/services/${service.slug}`);
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return <ServiceDetailClient service={service as any} />;
}
