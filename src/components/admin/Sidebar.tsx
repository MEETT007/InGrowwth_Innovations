'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  Briefcase,
  FileText,
  Image as ImageIcon,
  Users,
  Users2,
  Settings,
  Sparkles,
  ArrowLeft,
} from 'lucide-react';
import { cn } from '@/lib/utils';

export const sidebarLinks = [
  { href: '/admin', label: 'Dashboard', icon: <LayoutDashboard className="w-5 h-5" /> },
  { href: '/admin/services', label: 'Services', icon: <Briefcase className="w-5 h-5" /> },
  { href: '/admin/blogs', label: 'Blogs', icon: <FileText className="w-5 h-5" /> },
  { href: '/admin/portfolio', label: 'Portfolio', icon: <ImageIcon className="w-5 h-5" /> },
  { href: '/admin/team', label: 'Team', icon: <Users className="w-5 h-5" /> },
  { href: '/admin/leads', label: 'Leads', icon: <Users2 className="w-5 h-5" /> },
  { href: '/admin/settings', label: 'Settings', icon: <Settings className="w-5 h-5" /> },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-64 border-r border-border/20 bg-background/40 backdrop-blur-2xl hidden md:flex flex-col h-full shrink-0 shadow-[4px_0_24px_rgba(0,0,0,0.02)] relative z-20">
      <div className="h-16 flex items-center px-6 border-b border-border/20 shrink-0">
        <Link href="/admin" className="flex items-center gap-3 font-black text-base tracking-tight group">
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
            pathname === link.href || (pathname.startsWith(link.href) && link.href !== '/admin');
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
      <div className="p-4 border-t border-border/20 shrink-0">
        <Link
          href="/"
          className="flex items-center gap-2 text-xs text-muted-foreground hover:text-foreground transition-colors px-3 py-2"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          <span>Public Website</span>
        </Link>
      </div>
    </aside>
  );
}
