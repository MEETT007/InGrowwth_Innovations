'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Menu, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { sidebarLinks } from './Sidebar';
import { UserButton, useUser } from '@clerk/nextjs';
import { cn } from '@/lib/utils';

export function AdminHeader() {
  const pathname = usePathname();
  const { user } = useUser();

  return (
    <header className="h-16 border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 flex items-center justify-between px-4 md:px-6 shrink-0 z-10 sticky top-0">
      <div className="flex items-center gap-4">
        <Sheet>
          <SheetTrigger render={<Button variant="ghost" size="icon" className="md:hidden" />}>
            <Menu className="h-5 w-5" />
            <span className="sr-only">Toggle Sidebar</span>
          </SheetTrigger>
          <SheetContent side="left" className="w-64 p-0">
            <div className="h-16 flex items-center px-6 border-b border-border/40 shrink-0">
              <Link
                href="/admin"
                className="flex items-center gap-2 font-bold text-lg tracking-tight"
              >
                <Sparkles className="h-5 w-5 text-indigo-500" />
                <span>InGrowwth</span>
              </Link>
            </div>
            <nav className="flex-1 overflow-y-auto py-4 px-3 space-y-1">
              {sidebarLinks.map((link) => {
                const isActive =
                  pathname === link.href ||
                  (pathname.startsWith(link.href) && link.href !== '/admin');
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    className={cn(
                      'flex items-center gap-3 px-3 py-2.5 rounded-md text-sm font-medium transition-colors',
                      isActive
                        ? 'bg-indigo-500/10 text-indigo-600 dark:text-indigo-400'
                        : 'text-muted-foreground hover:text-foreground hover:bg-muted'
                    )}
                  >
                    {link.icon}
                    {link.label}
                  </Link>
                );
              })}
            </nav>
          </SheetContent>
        </Sheet>
      </div>

      <div className="flex items-center gap-4">
        <div className="text-right hidden sm:block">
          <p className="text-sm font-medium text-foreground">
            {user?.fullName || user?.primaryEmailAddress?.emailAddress}
          </p>
          <p className="text-xs text-muted-foreground">{user?.primaryEmailAddress?.emailAddress}</p>
        </div>
        <UserButton
          appearance={{
            elements: {
              avatarBox: 'h-9 w-9 border border-primary/20 hover:scale-105 transition-transform',
            },
          }}
        />
      </div>
    </header>
  );
}
