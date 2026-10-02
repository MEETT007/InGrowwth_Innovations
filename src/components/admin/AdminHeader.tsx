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
    <header className="h-16 flex items-center justify-between px-4 md:px-6 shrink-0 z-[60] sticky top-0 glass-header">
      <div className="flex items-center gap-4">
        <Sheet>
          <SheetTrigger render={<Button variant="ghost" size="icon" className="md:hidden" />}>
            <Menu className="h-5 w-5" />
            <span className="sr-only">Toggle Sidebar</span>
          </SheetTrigger>
          <SheetContent side="left" className="w-64 p-0">
            <div className="h-16 flex items-center px-6 border-b border-border/20 shrink-0">
              <Link
                href="/admin"
                className="flex items-center gap-3 font-black text-base tracking-tight group"
              >
                <div className="w-10 h-10 rounded-lg bg-gradient-to-tr from-indigo-500 via-purple-500 to-pink-500 p-[2px] shadow-md shadow-indigo-500/20 group-hover:scale-105 transition-transform shrink-0">
                  <div className="w-full h-full bg-background rounded-md flex items-center justify-center">
                    <Sparkles className="w-5 h-5 text-indigo-500 dark:text-indigo-400" />
                  </div>
                </div>
                <span className="bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 bg-clip-text text-transparent whitespace-nowrap">
                  InGrowwth Innovation
                </span>
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
                      'flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-300',
                      isActive
                        ? 'bg-gradient-to-r from-indigo-500/10 via-purple-500/5 to-pink-500/10 text-indigo-600 dark:text-indigo-400 border border-indigo-500/20 shadow-sm'
                        : 'text-muted-foreground hover:text-foreground hover:bg-muted/60'
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
            {user?.fullName || user?.firstName || 'User'}
          </p>
          <p className="text-xs text-muted-foreground">{user?.primaryEmailAddress?.emailAddress || 'Admin'}</p>
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
