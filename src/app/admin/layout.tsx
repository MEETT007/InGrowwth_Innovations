'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { UserButton, useUser, useAuth } from '@clerk/nextjs';
import { LayoutDashboard, Users, User, ShieldCheck, ArrowLeft, Layers } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { user } = useUser();
  const { isSignedIn, isLoaded } = useAuth();

  const isAuthPage = pathname.includes('/sign-in') || pathname.includes('/sign-up');

  const navItems = [
    { label: 'Dashboard', href: '/admin', icon: LayoutDashboard },
    { label: 'Leads Management', href: '/admin/leads', icon: Users },
    { label: 'My Profile', href: '/admin/profile', icon: User },
  ];

  // User role badge helper
  const role = (user?.publicMetadata?.role as string) || 'Admin';

  if (isAuthPage) {
    return <div className="min-h-screen bg-background">{children}</div>;
  }

  return (
    <div className="min-h-screen flex flex-col bg-background">
      {isLoaded && isSignedIn ? (
        <div className="flex flex-1">
          {/* Admin Sidebar */}
          <aside className="w-64 border-r border-border bg-card/50 backdrop-blur-md hidden md:flex flex-col justify-between p-4 min-h-[calc(100vh-4rem)]">
            <div className="space-y-6">
              <div className="flex items-center space-x-3 px-2 py-3 border-b border-border/60">
                <div className="p-2 bg-primary/10 text-primary rounded-lg">
                  <ShieldCheck className="h-6 w-6" />
                </div>
                <div>
                  <h3 className="font-bold text-foreground text-sm tracking-wide">CMS Console</h3>
                  <span className="inline-flex items-center text-[10px] font-semibold px-2 py-0.5 rounded-full bg-primary/15 text-primary">
                    Role: {role.toUpperCase()}
                  </span>
                </div>
              </div>

              <nav className="space-y-1">
                {navItems.map((item) => {
                  const Icon = item.icon;
                  const isActive = pathname === item.href;
                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      className={`flex items-center space-x-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                        isActive
                          ? 'bg-primary text-primary-foreground shadow-sm'
                          : 'text-muted-foreground hover:bg-muted hover:text-foreground'
                      }`}
                    >
                      <Icon className="h-4 w-4" />
                      <span>{item.label}</span>
                    </Link>
                  );
                })}
              </nav>
            </div>

            <div className="pt-4 border-t border-border/60 space-y-2">
              <Link
                href="/"
                className="flex items-center space-x-2 text-xs text-muted-foreground hover:text-foreground transition-colors px-2 py-1.5"
              >
                <ArrowLeft className="h-3.5 w-3.5" />
                <span>Return to Public Website</span>
              </Link>
            </div>
          </aside>

          {/* Main Content Area */}
          <div className="flex-1 flex flex-col min-w-0">
            {/* Admin Header */}
            <header className="h-16 border-b border-border bg-card/40 backdrop-blur-md px-6 flex items-center justify-between sticky top-0 z-30">
              <div className="flex items-center space-x-4">
                <div className="md:hidden flex items-center space-x-2">
                  <Layers className="h-5 w-5 text-primary" />
                  <span className="font-bold text-sm">Admin CMS</span>
                </div>
                <h2 className="hidden md:block font-semibold text-foreground text-lg">
                  {navItems.find((n) => n.href === pathname)?.label || 'Admin Portal'}
                </h2>
              </div>

              <div className="flex items-center space-x-4">
                <div className="text-right hidden sm:block">
                  <p className="text-sm font-medium text-foreground">
                    {user?.fullName || user?.primaryEmailAddress?.emailAddress}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {user?.primaryEmailAddress?.emailAddress}
                  </p>
                </div>
                <UserButton
                  appearance={{
                    elements: {
                      avatarBox:
                        'h-9 w-9 border border-primary/20 hover:scale-105 transition-transform',
                    },
                  }}
                />
              </div>
            </header>

            {/* Mobile Navigation Header Bar */}
            <div className="md:hidden border-b border-border bg-muted/30 px-4 py-2 flex space-x-2 overflow-x-auto">
              {navItems.map((item) => {
                const Icon = item.icon;
                const isActive = pathname === item.href;
                return (
                  <Link key={item.href} href={item.href}>
                    <Button
                      variant={isActive ? 'default' : 'ghost'}
                      size="sm"
                      className="text-xs flex items-center space-x-1.5 whitespace-nowrap"
                    >
                      <Icon className="h-3.5 w-3.5" />
                      <span>{item.label}</span>
                    </Button>
                  </Link>
                );
              })}
            </div>

            <main className="flex-1 p-6 md:p-8 max-w-7xl w-full mx-auto">{children}</main>
          </div>
        </div>
      ) : (
        <div className="min-h-screen bg-background">{children}</div>
      )}
    </div>
  );
}
