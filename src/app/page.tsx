import type { Metadata } from 'next';
import { db } from '@/lib/db';
import { logger } from '@/lib/logger';
import HomeClient, { type ExpertiseService } from './HomeClient';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'InGrowwth Innovations | Full-Stack, Cloud & AI Solutions',
  description:
    'InGrowwth Innovations delivers modern full-stack web applications, dynamic user interfaces, and cloud architectures optimized for long-term scalability and business growth.',
};

export default async function HomePage() {
  let expertiseServices: ExpertiseService[] = [];

  try {
    // 1. First priority: services explicitly flagged as isExpertise
    const featuredServices = await db.service.findMany({
      where: { isExpertise: true },
      select: {
        id: true,
        slug: true,
        title: true,
        description: true,
        icon: true,
      },
      orderBy: { createdAt: 'desc' },
      take: 3,
    });

    if (featuredServices.length > 0) {
      expertiseServices = featuredServices.map((s) => ({
        id: s.id,
        title: s.title,
        desc: s.description,
        icon: s.icon,
        href: `/services/${s.slug || s.id}`,
      }));
    } else {
      // 2. Fallback: pick the top 3 services from database if available
      const generalServices = await db.service.findMany({
        select: {
          id: true,
          slug: true,
          title: true,
          description: true,
          icon: true,
        },
        orderBy: { createdAt: 'desc' },
        take: 3,
      });

      if (generalServices.length > 0) {
        expertiseServices = generalServices.map((s) => ({
          id: s.id,
          title: s.title,
          desc: s.description,
          icon: s.icon,
          href: `/services/${s.slug || s.id}`,
        }));
      }
    }
  } catch (error) {
    logger.error('Error prefetching expertise services for homepage:', error);
  }

  return <HomeClient initialExpertiseServices={expertiseServices} />;
}
