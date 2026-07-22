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
    return <div className="min-h-screen bg-background">{children}</div>;
  }

  return (
    <div className="min-h-screen flex flex-col bg-background">
      {isLoaded && isSignedIn ? (
        <div className="flex flex-1">
          <Sidebar />

          <div className="flex-grow flex flex-col min-w-0">
            <AdminHeader />

            <main className="flex-grow p-6 md:p-8 max-w-7xl w-full mx-auto">{children}</main>
          </div>
        </div>
      ) : (
        <div className="min-h-screen bg-background">{children}</div>
      )}
    </div>
  );
}
