import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Blog | InGrowwth Innovations',
  description:
    'Insights on product development, software engineering, and design from the InGrowwth team.',
  openGraph: {
    title: 'Blog | InGrowwth Innovations',
    description: 'Insights on product development, software engineering, and design.',
    url: 'https://ingrowwthinnovations.com/blog',
  },
};

export default function BlogLayout({ children }: { children: React.ReactNode }) {
  return children;
}
