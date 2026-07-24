import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { SectionHeader } from '@/components/shared/SectionHeader';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ArrowRight, MapPin, Clock, Users, Zap, Heart, Coffee } from 'lucide-react';

export const MOCK_JOBS = [
  {
    id: 'frontend-engineer-react',
    title: 'Senior Frontend Engineer (React)',
    department: 'Engineering',
    location: 'Remote',
    type: 'Full-time',
    description:
      'We are looking for a Senior Frontend Engineer to lead the development of our core web applications using React, Next.js, and Tailwind CSS.',
    requirements: [
      '5+ years of experience with React and modern web technologies.',
      'Strong understanding of Next.js App Router and Server Components.',
      'Experience with state management and performance optimization.',
      'A keen eye for design and UI/UX best practices.',
    ],
  },
  {
    id: 'backend-engineer-node',
    title: 'Backend Engineer (Node.js)',
    department: 'Engineering',
    location: 'New York, NY / Hybrid',
    type: 'Full-time',
    description:
      'Join our backend team to build scalable APIs and microservices using Node.js, Express, and PostgreSQL.',
    requirements: [
      '3+ years of backend development experience.',
      'Proficiency in Node.js and TypeScript.',
      'Experience with SQL databases, particularly PostgreSQL and Prisma ORM.',
      'Familiarity with AWS or cloud deployment architectures.',
    ],
  },
  {
    id: 'product-designer',
    title: 'Senior Product Designer',
    department: 'Design',
    location: 'Remote',
    type: 'Full-time',
    description:
      'Shape the future of our product interfaces. We need a visionary designer who can translate complex requirements into beautiful, intuitive experiences.',
    requirements: [
      'Portfolio demonstrating exceptional UI/UX design skills.',
      'Experience with Figma and design systems.',
      'Ability to prototype and communicate interaction design.',
      'Understanding of frontend capabilities and constraints.',
    ],
  },
  {
    id: 'growth-marketing-manager',
    title: 'Growth Marketing Manager',
    department: 'Marketing',
    location: 'London, UK / Remote',
    type: 'Full-time',
    description:
      'Lead our growth initiatives across multiple channels to drive acquisition, activation, and retention.',
    requirements: [
      'Proven track record in B2B SaaS growth marketing.',
      'Data-driven approach to experiments and A/B testing.',
      'Experience with SEO, SEM, and content strategy.',
      'Strong analytical skills using tools like Google Analytics or Mixpanel.',
    ],
  },
];

const PERKS = [
  {
    icon: <MapPin className="w-6 h-6 text-indigo-500" />,
    title: 'Work Anywhere',
    desc: 'Remote-first culture with co-working stipends.',
  },
  {
    icon: <Heart className="w-6 h-6 text-pink-500" />,
    title: 'Health & Wellness',
    desc: 'Comprehensive health, dental, and vision insurance.',
  },
  {
    icon: <Zap className="w-6 h-6 text-yellow-500" />,
    title: 'Latest Tech',
    desc: 'M3 MacBooks and a generous home office budget.',
  },
  {
    icon: <Coffee className="w-6 h-6 text-orange-500" />,
    title: 'Unlimited PTO',
    desc: 'Take the time you need to recharge and avoid burnout.',
  },
];

export default function CareersPage() {
  // Group jobs by department
  const groupedJobs = MOCK_JOBS.reduce(
    (acc, job) => {
      if (!acc[job.department]) acc[job.department] = [];
      acc[job.department].push(job);
      return acc;
    },
    {} as Record<string, typeof MOCK_JOBS>
  );

  return (
    <main className="min-h-screen pt-24 pb-20 px-6 max-w-7xl mx-auto flex flex-col gap-24">
      {/* Hero Section */}
      <section className="flex flex-col gap-12 mt-8">
        <SectionHeader
          title="Join Our Mission"
          subtitle="Careers"
          description="We're building the next generation of digital experiences. Come help us shape the future of technology."
        />

        {/* Culture / Image Grid */}
        <div className="grid md:grid-cols-2 gap-6 mt-4">
          <div className="h-64 md:h-[400px] w-full rounded-3xl overflow-hidden glass-card p-2 relative">
            <div className="relative w-full h-full">
              <Image
                src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?q=80&w=1200&auto=format&fit=crop"
                alt="Team collaboration"
                fill
                className="object-cover rounded-2xl"
                sizes="(max-width: 768px) 100vw, 50vw"
              />
            </div>
          </div>
          <div className="flex flex-col gap-6">
            <div className="h-48 md:h-[188px] w-full rounded-3xl overflow-hidden glass-card p-2 relative">
              <div className="relative w-full h-full">
                <Image
                  src="https://images.unsplash.com/photo-1573164713988-8665fc963095?q=80&w=800&auto=format&fit=crop"
                  alt="Working remotely"
                  fill
                  className="object-cover rounded-2xl"
                  sizes="(max-width: 768px) 100vw, 50vw"
                />
              </div>
            </div>
            <div className="h-48 md:h-[188px] w-full rounded-3xl overflow-hidden glass-card p-2 bg-indigo-500/10 flex items-center justify-center p-8 text-center">
              <h3 className="text-2xl font-bold bg-gradient-to-r from-indigo-500 to-purple-500 bg-clip-text text-transparent">
                &quot;We don&apos;t just build software, we build teams that build the future.&quot;
              </h3>
            </div>
          </div>
        </div>
      </section>

      {/* Perks Section */}
      <section>
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-4">Why InGrowwth?</h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            We invest in our people so they can invest in their work. Here is what you get when you
            join our team.
          </p>
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {PERKS.map((perk, i) => (
            <Card
              key={i}
              className="glass-card border-none bg-muted/20 text-center hover:-translate-y-1 transition-transform"
            >
              <CardHeader className="items-center pb-2">
                <div className="p-3 w-fit bg-background rounded-2xl shadow-sm mb-4 mx-auto flex items-center justify-center">
                  {perk.icon}
                </div>
                <CardTitle className="text-xl">{perk.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground text-sm">{perk.desc}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* Open Positions */}
      <section>
        <div className="mb-12">
          <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-4">Open Positions</h2>
          <p className="text-muted-foreground text-lg max-w-2xl">
            Find a role where you can do your best work.
          </p>
        </div>

        <div className="flex flex-col gap-12">
          {Object.entries(groupedJobs).map(([department, jobs]) => (
            <div key={department} className="flex flex-col gap-6">
              <h3 className="text-2xl font-semibold border-b border-border/40 pb-2 flex items-center gap-2">
                <Users className="h-5 w-5 text-indigo-500" />
                {department}
              </h3>
              <div className="grid gap-4">
                {jobs.map((job) => (
                  <Link key={job.id} href={`/careers/${job.id}`}>
                    <Card className="glass-card hover:border-indigo-500/40 cursor-pointer group transition-all hover:shadow-lg">
                      <CardContent className="p-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
                        <div className="flex flex-col gap-2">
                          <h4 className="text-xl font-bold group-hover:text-indigo-500 transition-colors">
                            {job.title}
                          </h4>
                          <div className="flex flex-wrap items-center gap-3 text-sm text-muted-foreground">
                            <span className="flex items-center gap-1">
                              <MapPin className="h-3 w-3" /> {job.location}
                            </span>
                            <span className="flex items-center gap-1">
                              <Clock className="h-3 w-3" /> {job.type}
                            </span>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <Badge
                            variant="secondary"
                            className="opacity-0 group-hover:opacity-100 transition-opacity hidden md:inline-flex"
                          >
                            View Details
                          </Badge>
                          <div className="h-10 w-10 rounded-full bg-muted flex items-center justify-center group-hover:bg-indigo-500 group-hover:text-white transition-colors">
                            <ArrowRight className="h-5 w-5" />
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </Link>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}
