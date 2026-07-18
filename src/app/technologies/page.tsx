import type { Metadata } from 'next';
import TechnologiesClient from './TechnologiesClient';

export const metadata: Metadata = {
  title: 'Technologies | InGrowwth Innovations — Our Tech Stack',
  description:
    'Explore the modern technologies InGrowwth Innovations uses across Frontend, Backend, Database, DevOps & Cloud, and Mobile development.',
};

export default function TechnologiesPage() {
  return <TechnologiesClient />;
}
