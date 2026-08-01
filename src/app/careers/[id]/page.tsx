import React from 'react';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { db } from '@/lib/db';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { ArrowLeft, MapPin, Clock, Briefcase, Building } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
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

  return (
    <main className="min-h-screen pt-24 pb-20 px-6 max-w-4xl mx-auto flex flex-col gap-12">
      {/* Header / Nav */}
      <div className="flex flex-col gap-8">
        <div>
          <Link
            href="/careers"
            className="inline-flex items-center text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to all roles
          </Link>
        </div>

        <div className="flex flex-col gap-4">
          <Badge className="w-fit">{job.department}</Badge>
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight">{job.title}</h1>
          <div className="flex flex-wrap items-center gap-4 text-muted-foreground mt-2">
            <span className="flex items-center gap-2">
              <MapPin className="h-4 w-4" /> {job.location}
            </span>
            <span className="flex items-center gap-2">
              <Clock className="h-4 w-4" /> {job.type}
            </span>
            <span className="flex items-center gap-2">
              <Building className="h-4 w-4" /> InGrowwth Innovations
            </span>
          </div>
        </div>
      </div>

      <hr className="border-border/40" />

      {/* Content */}
      <div className="grid md:grid-cols-3 gap-12">
        <div className="md:col-span-2 flex flex-col gap-8 prose prose-lg dark:prose-invert">
          <section>
            <h2 className="text-2xl font-bold mb-4 text-foreground">About the Role</h2>
            <p className="text-muted-foreground">{job.description}</p>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-4 text-foreground">Requirements</h2>
            <ul className="list-disc pl-5 text-muted-foreground space-y-2">
              {parsedRequirements.map((req, i) => (
                <li key={i}>{req}</li>
              ))}
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-4 text-foreground">Benefits & Perks</h2>
            <ul className="list-disc pl-5 text-muted-foreground space-y-2">
              <li>Competitive salary and equity options.</li>
              <li>Fully remote work policy with flexible hours.</li>
              <li>Comprehensive health, dental, and vision coverage.</li>
              <li>Annual learning and development stipend.</li>
              <li>M3 MacBook Pro and home office setup budget.</li>
            </ul>
          </section>
        </div>

        {/* Sidebar / Apply */}
        <div className="flex flex-col gap-6">
          <div className="glass-card p-6 rounded-2xl sticky top-24 flex flex-col gap-6">
            <h3 className="text-xl font-semibold">Interested in this role?</h3>
            <p className="text-sm text-muted-foreground">
              Submit your application today. We typically respond within 48 hours.
            </p>

            <Dialog>
              <DialogTrigger
                render={
                  <Button className="w-full cursor-pointer" variant="gradient" size="lg">
                    Apply Now
                  </Button>
                }
              />
              <DialogContent className="sm:max-w-[500px] glass-card">
                <DialogHeader>
                  <DialogTitle className="text-2xl">Apply for {job.title}</DialogTitle>
                  <DialogDescription>
                    Fill out the form below to submit your application.
                  </DialogDescription>
                </DialogHeader>

                <form className="flex flex-col gap-4 mt-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="flex flex-col gap-2">
                      <Label htmlFor="first-name">First Name</Label>
                      <Input id="first-name" placeholder="Jane" required />
                    </div>
                    <div className="flex flex-col gap-2">
                      <Label htmlFor="last-name">Last Name</Label>
                      <Input id="last-name" placeholder="Doe" required />
                    </div>
                  </div>

                  <div className="flex flex-col gap-2">
                    <Label htmlFor="email">Email Address</Label>
                    <Input id="email" type="email" placeholder="jane@example.com" required />
                  </div>

                  <div className="flex flex-col gap-2">
                    <Label htmlFor="portfolio">LinkedIn Profile / Portfolio URL</Label>
                    <Input
                      id="portfolio"
                      type="url"
                      placeholder="https://linkedin.com/in/jane"
                      required
                    />
                  </div>

                  <div className="flex flex-col gap-2">
                    <Label htmlFor="cover">Cover Letter (Optional)</Label>
                    <Textarea
                      id="cover"
                      placeholder="Tell us why you are a great fit..."
                      rows={4}
                    />
                  </div>

                  <div className="flex flex-col gap-2">
                    <Label htmlFor="resume">Resume (PDF)</Label>
                    <Input
                      id="resume"
                      type="file"
                      accept=".pdf"
                      className="cursor-pointer"
                      required
                    />
                  </div>

                  <Button type="submit" className="mt-4" variant="gradient">
                    Submit Application
                  </Button>
                </form>
              </DialogContent>
            </Dialog>

            <div className="border-t border-border/40 pt-4 mt-2 flex items-center justify-between text-sm text-muted-foreground">
              <span className="flex items-center gap-2">
                <Briefcase className="h-4 w-4" /> Full-time
              </span>
              <span>Posted 2 days ago</span>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
