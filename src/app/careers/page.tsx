import React from 'react';
import { db } from '@/lib/db';
import { Job } from '@/generated/prisma/client';
import CareersClient from './CareersClient';

export const dynamic = 'force-dynamic';
export const revalidate = 60; // Revalidate every 60 seconds

export default async function CareersPage() {
  const jobs = await db.job.findMany({
    where: { status: 'OPEN' },
    orderBy: { createdAt: 'desc' },
  });

  // Group jobs by department
  const groupedJobs = jobs.reduce(
    (acc, job) => {
      if (!acc[job.department]) acc[job.department] = [];
      acc[job.department].push(job);
      return acc;
    },
    {} as Record<string, Job[]>
  );

  return <CareersClient groupedJobs={groupedJobs} />;
}
