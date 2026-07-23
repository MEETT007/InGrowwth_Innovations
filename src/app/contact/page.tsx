import { Suspense } from 'react';
import ContactClient from './ContactClient';

export const metadata = {
  title: 'Contact Us | InGrowwth Innovations',
  description:
    'Get in touch with InGrowwth Innovations for custom software engineering, cloud solutions, and IT consulting services.',
};

export default function ContactPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex flex-col items-center justify-center bg-background text-foreground">
          <div className="flex items-center gap-2 text-sm text-muted-foreground animate-pulse">
            <div className="h-4 w-4 rounded-full border-2 border-primary border-t-transparent animate-spin" />
            <span>Loading Contact Form...</span>
          </div>
        </div>
      }
    >
      <ContactClient />
    </Suspense>
  );
}
