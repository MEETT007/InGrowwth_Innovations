import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import './globals.css';
import { ThemeProvider } from '@/components/theme-provider';
import { GlobalLayoutWrapper } from '@/components/shared/global-layout-wrapper';
import { ClerkProvider } from '@clerk/nextjs';

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

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider dynamic>
      <html
        lang="en"
        suppressHydrationWarning
        className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
      >
        <body
          suppressHydrationWarning
          className="min-h-full flex flex-col bg-background text-foreground transition-colors duration-300"
        >
          <ThemeProvider
            attribute="class"
            defaultTheme="dark"
            enableSystem={false}
            disableTransitionOnChange
          >
            <GlobalLayoutWrapper>{children}</GlobalLayoutWrapper>
          </ThemeProvider>
        </body>
      </html>
    </ClerkProvider>
  );
}
