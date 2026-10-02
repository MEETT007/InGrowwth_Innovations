'use client';

import * as React from 'react';
import { ThemeProvider as NextThemesProvider } from 'next-themes';

// Filter out React 19 warnings and benign Clerk development debug network errors that trigger Next.js error overlays
if (typeof window !== 'undefined' && process.env.NODE_ENV === 'development') {
  const orig = console.error;
  console.error = (...args: unknown[]) => {
    const msg = typeof args[0] === 'string' ? args[0] : '';
    if (
      msg.includes('Encountered a script tag') ||
      msg.includes('[Clerk Debug]') ||
      msg.includes('fapiClient') ||
      msg.includes('clerk.accounts.dev')
    ) {
      console.warn('[Clerk Suppressed]', ...args);
      return;
    }
    orig.apply(console, args);
  };
}

export function ThemeProvider({
  children,
  ...props
}: React.ComponentProps<typeof NextThemesProvider>) {
  return <NextThemesProvider {...props}>{children}</NextThemesProvider>;
}
