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
  Sparkles
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
    <aside className="w-64 border-r border-border/40 bg-card/60 backdrop-blur-sm hidden md:flex flex-col h-full shrink-0">
      <div className="h-16 flex items-center px-6 border-b border-border/40 shrink-0">
        <Link href="/admin" className="flex items-center gap-2 font-bold text-lg tracking-tight">
          <Sparkles className="h-5 w-5 text-indigo-500" />
          <span>InGrowwth</span>
        </Link>
      </div>
      <nav className="flex-1 overflow-y-auto py-4 px-3 space-y-1">
        {sidebarLinks.map((link) => {
          const isActive = pathname === link.href || (pathname.startsWith(link.href) && link.href !== '/admin');
          return (
            <Link
              key={link.href}
              href={link.href}
              className={cn(
                "flex items-center gap-3 px-3 py-2.5 rounded-md text-sm font-medium transition-colors",
                isActive 
                  ? "bg-indigo-500/10 text-indigo-600 dark:text-indigo-400" 
                  : "text-muted-foreground hover:text-foreground hover:bg-muted"
              )}
            >
              {link.icon}
              {link.label}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}
