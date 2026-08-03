'use client';

import { usePathname } from 'next/navigation';
import { Header } from './header';
import { Footer } from './footer';
import { SmoothScroller } from '../smooth-scroller';

export function GlobalLayoutWrapper({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  // Hide global Header and Footer on /chat to give it a full-screen app experience
  const isAppRoute = pathname?.startsWith('/chat') || pathname?.startsWith('/admin');

  if (isAppRoute) {
    return <main className="flex-grow w-full h-screen overflow-hidden">{children}</main>;
  }

  return (
    <SmoothScroller>
      <Header />
      <main className="flex-grow">{children}</main>
      <Footer />
    </SmoothScroller>
  );
}
