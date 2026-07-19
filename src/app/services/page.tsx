import type { Metadata } from 'next';
import ServicesClient from './ServicesClient';

export const metadata: Metadata = {
  title: 'Services | InGrowwth Innovations — Full-Stack, Cloud & AI Solutions',
  description:
    "Explore InGrowwth Innovations' full suite of IT services: Web Development, Mobile Apps, Cloud & DevOps, AI/ML, Cybersecurity, and ERP solutions built for enterprise scale.",
};

export default function ServicesPage() {
  return <ServicesClient />;
}
