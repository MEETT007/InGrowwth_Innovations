import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import './globals.css';
import { ThemeProvider } from '@/components/theme-provider';
import { GlobalLayoutWrapper } from '@/components/shared/global-layout-wrapper';
import { ClerkProvider } from '@clerk/nextjs';
import { env } from '@/lib/env';
import { db } from '@/lib/db';
import { logger } from '@/lib/logger';

// A request-specific CSP nonce is generated in proxy.ts, so pages must render per request.
export const dynamic = 'force-dynamic';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: 'InGrowwth Innovations | Premium Software Engineering & IT Services',
  description:
    'Enterprise-grade software development, mobile application design, ERP, cloud solutions, and UI/UX design built to scale your startup or business.',
  metadataBase: new URL('https://ingrowwthinnovations.com'),
  openGraph: {
    title: 'InGrowwth Innovations | Premium Software Engineering',
    description:
      'Enterprise-grade software engineering and IT consulting services designed to scale.',
    url: 'https://ingrowwthinnovations.com',
    siteName: 'InGrowwth Innovations',
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'InGrowwth Innovations',
    description: 'Enterprise-grade software engineering and IT consulting.',
  },
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  let initialServices: Array<{ id: string; href: string; label: string }> = [];
  try {
    const services = await db.service.findMany({
      select: {
        id: true,
        title: true,
        slug: true,
      },
      orderBy: { createdAt: 'desc' },
      take: 6,
    });
    initialServices = services.map((s) => ({
      id: s.id,
      label: s.title,
      href: `/services/${s.slug || s.id}`,
    }));
  } catch (error) {
    logger.error('Error prefetching services in RootLayout:', error);
  }

  return (
    <ClerkProvider>
      <html
        lang="en"
        suppressHydrationWarning
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <body
          suppressHydrationWarning
          className="flex flex-col min-h-screen bg-background text-foreground transition-colors duration-300"
        >
          <ThemeProvider
            attribute="class"
            defaultTheme="dark"
            enableSystem={false}
            disableTransitionOnChange
          >
            {!env.isProduction && (
              <div className="fixed bottom-4 right-4 z-50 bg-red-600 text-white px-3 py-1 text-xs font-bold rounded shadow-lg pointer-events-none opacity-80 uppercase tracking-widest">
                DEV ENVIRONMENT
              </div>
            )}
            <GlobalLayoutWrapper initialServices={initialServices}>{children}</GlobalLayoutWrapper>
          </ThemeProvider>
        </body>
      </html>
    </ClerkProvider>
  );
}
