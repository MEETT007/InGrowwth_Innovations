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
    return <div className="flex-1 w-full h-screen overflow-hidden flex flex-col">{children}</div>;
  }

  return (
    <SmoothScroller>
      <Header />
      <main className="flex-grow">{children}</main>
      <Footer />
    </SmoothScroller>
  );
}
