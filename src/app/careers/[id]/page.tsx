import React from 'react';
import { notFound } from 'next/navigation';
import { db } from '@/lib/db';
import JobDetailClient from './JobDetailClient';

export const dynamic = 'force-dynamic';

export default async function JobDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = await params;
  const job = await db.job.findUnique({ where: { id: resolvedParams.id } });

  if (!job) {
    notFound();
  }

  let parsedRequirements: string[] = [];
  if (job.requirements) {
    try {
      parsedRequirements = JSON.parse(job.requirements);
    } catch {
      parsedRequirements = job.requirements.split('\n').filter(Boolean);
    }
  }

  return <JobDetailClient job={job} parsedRequirements={parsedRequirements} />;
}
