'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';

export default function LeadsLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  const tabs = [
    { name: 'Contact Submissions', href: '/admin/leads/contact' },
    { name: 'Quote Requests', href: '/admin/leads/quotes' },
    { name: 'Newsletter', href: '/admin/leads/newsletter' },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Lead Management</h2>
        <p className="text-muted-foreground mt-1">
          Manage all incoming requests, contacts, and subscribers.
        </p>
      </div>

      <div className="border-b border-border/40">
        <nav className="-mb-px flex space-x-6 md:space-x-8 overflow-x-auto">
          {tabs.map((tab) => {
            const isActive = pathname === tab.href;
            return (
              <Link
                key={tab.name}
                href={tab.href}
                className={cn(
                  'whitespace-nowrap border-b-2 py-3 px-1 text-sm font-medium transition-colors',
                  isActive
                    ? 'border-primary text-primary'
                    : 'border-transparent text-muted-foreground hover:border-border hover:text-foreground'
                )}
              >
                {tab.name}
              </Link>
            );
          })}
        </nav>
      </div>
      <div className="pt-2">{children}</div>
    </div>
  );
}
