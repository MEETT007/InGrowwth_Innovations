import { Metadata } from 'next';
import AboutClient from './AboutClient';
import { db } from '@/lib/db';

export const metadata: Metadata = {
  title: 'About Us | InGrowwth Innovations',
  description:
    'Learn about our history, mission, core values, and the leadership team driving enterprise-grade digital growth.',
  openGraph: {
    title: 'About Us | InGrowwth Innovations',
    description:
      'Learn about our history, mission, core values, and the leadership team driving enterprise-grade digital growth.',
    url: 'https://ingrowwthinnovations.com/about',
    type: 'website',
  },
};

export const revalidate = 60; // Revalidate every 60 seconds

export default async function AboutPage() {
  const team = await db.teamMember.findMany({
    orderBy: { createdAt: 'asc' },
  });

  return <AboutClient initialTeam={team} />;
}
