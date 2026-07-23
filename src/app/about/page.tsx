import { Metadata } from 'next';
import AboutClient from './AboutClient';

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

export default function AboutPage() {
  return <AboutClient />;
}
