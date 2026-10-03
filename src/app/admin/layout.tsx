'use client';

import React from 'react';
import { usePathname } from 'next/navigation';
import { useAuth } from '@clerk/nextjs';

import { Sidebar } from '@/components/admin/Sidebar';
import { AdminHeader } from '@/components/admin/AdminHeader';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { isSignedIn, isLoaded } = useAuth();

  const isAuthPage = pathname.includes('/sign-in') || pathname.includes('/sign-up');

  if (isAuthPage) {
    return <div className="h-full w-full overflow-y-auto bg-background">{children}</div>;
  }

  return (
    <div className="h-full w-full flex overflow-hidden bg-background">
      {isLoaded && isSignedIn ? (
        <>
          <Sidebar />

          <div className="flex-1 flex flex-col min-w-0 h-full overflow-hidden">
            <AdminHeader />

            <main className="flex-1 overflow-y-auto p-4 sm:p-6 md:p-8 w-full max-w-7xl mx-auto pb-32">
              {children}
            </main>
          </div>
        </>
      ) : (
        <div className="h-full w-full overflow-y-auto bg-background">{children}</div>
      )}
    </div>
  );
}
