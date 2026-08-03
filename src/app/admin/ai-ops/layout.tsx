import React from 'react';
import Link from 'next/link';
import { getAuthUserRole } from '@/lib/auth';
import { Activity, Brain, Database, LineChart, MessageSquare, Terminal } from 'lucide-react';

export default async function AiOpsLayout({ children }: { children: React.ReactNode }) {
  const { role } = await getAuthUserRole();

  if (role !== 'admin') {
    return (
      <div className="flex h-[50vh] items-center justify-center">
        <h2 className="text-xl font-bold text-red-500">
          Unauthorized. Admin access required for AI Operations.
        </h2>
      </div>
    );
  }

  const navItems = [
    { name: 'Dashboard', href: '/admin/ai-ops', icon: Activity },
    { name: 'Traces & RCO', href: '/admin/ai-ops/traces', icon: Terminal },
    { name: 'Prompts', href: '/admin/ai-ops/prompts', icon: MessageSquare },
    { name: 'Knowledge', href: '/admin/ai-ops/knowledge', icon: Database },
    { name: 'Evals', href: '/admin/ai-ops/evals', icon: LineChart },
  ];

  return (
    <div className="flex flex-col gap-6 w-full animate-in fade-in slide-in-from-bottom-4 duration-700">
      {/* Top Navigation for AI Ops */}
      <div className="w-full overflow-x-auto pb-2">
        <div className="flex items-center gap-2 border-b border-white/10 pb-4">
          <div className="flex items-center gap-3 mr-8">
            <Brain className="w-6 h-6 text-indigo-400" />
            <h1 className="text-2xl font-bold tracking-tight text-white">AI Ops</h1>
          </div>

          <nav className="flex items-center gap-2">
            {navItems.map((item) => {
              const Icon = item.icon;
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-colors bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white border border-transparent hover:border-white/10"
                >
                  <Icon className="w-4 h-4" />
                  {item.name}
                </Link>
              );
            })}
          </nav>
        </div>
      </div>

      {/* Main Content Area */}
      <main className="w-full">{children}</main>
    </div>
  );
}
