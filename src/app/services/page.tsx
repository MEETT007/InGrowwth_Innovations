import type { Metadata } from 'next';
import ServicesClient from './ServicesClient';
import { db } from '@/lib/db';

export const metadata: Metadata = {
  title: 'Services | InGrowwth Innovations — Full-Stack, Cloud & AI Solutions',
  description:
    "Explore InGrowwth Innovations' full suite of IT services: Web Development, Mobile Apps, Cloud & DevOps, AI/ML, Cybersecurity, and ERP solutions built for enterprise scale.",
};

export const dynamic = 'force-dynamic';
export const revalidate = 0; // Ensure data is always fresh

export default async function ServicesPage() {
  const dbServices = await db.service.findMany({
    orderBy: { createdAt: 'desc' },
  });

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return <ServicesClient initialServices={dbServices as any} />;
}
