import React from 'react';
import { getAuthUserRole } from '@/lib/auth';
import AiOpsNav from '@/components/admin/AiOpsNav';

export default async function AiOpsLayout({ children }: { children: React.ReactNode }) {
  const { role } = await getAuthUserRole();

  if (role !== 'admin') {
    return (
      <div className="flex h-[50vh] items-center justify-center">
        <div className="p-8 rounded-3xl border border-red-500/20 bg-red-950/20 text-center max-w-md">
          <h2 className="text-lg font-bold text-red-400 mb-2">
            Restricted Admin Privilege Required
          </h2>
          <p className="text-xs text-slate-400 leading-relaxed">
            AI Operations and telemetry dashboards require administrative authorization to view pipeline traces and knowledge vectors.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col w-full animate-in fade-in duration-500">
      <AiOpsNav />
      <main className="w-full">{children}</main>
    </div>
  );
}
