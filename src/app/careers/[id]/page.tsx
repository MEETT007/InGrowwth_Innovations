import { notFound } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, MapPin, Briefcase, CheckCircle2 } from 'lucide-react';
import { mockJobs } from '@/lib/mock-data';
import { ApplyModal } from './apply-modal';

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function JobDetailPage({ params }: PageProps) {
  const { id } = await params;

  const job = mockJobs.find((j) => j.id === id);

  if (!job) {
    notFound();
  }

  return (
    <div className="min-h-screen pt-24 pb-12">
      <div className="container mx-auto px-4 max-w-4xl">
        <div className="mb-8">
          <Link
            href="/careers"
            className="inline-flex items-center text-muted-foreground hover:text-primary transition-colors text-sm font-medium"
          >
            <ArrowLeft className="mr-2 h-4 w-4" /> Back to open roles
          </Link>
        </div>

        {/* Job Header */}
        <div className="bg-card border rounded-2xl p-8 md:p-12 mb-12 shadow-sm">
          <div className="mb-4">
            <span className="bg-primary/10 text-primary px-3 py-1 rounded-full text-sm font-semibold inline-block">
              {job.department}
            </span>
          </div>
          <h1 className="text-3xl md:text-5xl font-bold mb-6">{job.title}</h1>
          <div className="flex flex-wrap items-center gap-6 text-muted-foreground mb-10">
            <span className="flex items-center gap-2 text-lg">
              <MapPin className="h-5 w-5" /> {job.location}
            </span>
            <span className="flex items-center gap-2 text-lg">
              <Briefcase className="h-5 w-5" /> {job.type}
            </span>
          </div>

          <ApplyModal jobTitle={job.title} />
        </div>

        {/* Job Details */}
        <div className="prose prose-lg dark:prose-invert max-w-none">
          <div className="mb-12">
            <h2 className="text-2xl font-bold mb-4">About the Role</h2>
            <p className="text-muted-foreground">{job.description}</p>
          </div>

          <div className="mb-12">
            <h2 className="text-2xl font-bold mb-6">What You Will Do</h2>
            <ul className="space-y-3 list-none pl-0">
              {job.responsibilities.map((req, index) => (
                <li key={index} className="flex items-start gap-3 text-muted-foreground">
                  <CheckCircle2 className="h-6 w-6 text-primary shrink-0 mt-0.5" />
                  <span>{req}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="mb-12">
            <h2 className="text-2xl font-bold mb-6">Requirements</h2>
            <ul className="space-y-3 list-none pl-0">
              {job.requirements.map((req, index) => (
                <li key={index} className="flex items-start gap-3 text-muted-foreground">
                  <div className="h-2 w-2 rounded-full bg-primary shrink-0 mt-2.5 ml-2 mr-3" />
                  <span>{req}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom Apply Section */}
        <div className="mt-16 pt-12 border-t text-center">
          <h3 className="text-2xl font-bold mb-6">Ready to make an impact?</h3>
          <ApplyModal jobTitle={job.title} />
        </div>
      </div>
    </div>
  );
}
