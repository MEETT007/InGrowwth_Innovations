import Link from 'next/link';
import { Briefcase, MapPin, Laptop, Heart, Zap, Globe, ArrowRight } from 'lucide-react';
import { mockJobs } from '@/lib/mock-data';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';

export default function CareersPage() {
  // Group jobs by department
  const jobsByDept = mockJobs.reduce(
    (acc, job) => {
      if (!acc[job.department]) {
        acc[job.department] = [];
      }
      acc[job.department].push(job);
      return acc;
    },
    {} as Record<string, typeof mockJobs>
  );

  const perks = [
    {
      title: 'Remote-First Culture',
      description: 'Work from anywhere in the world. We value outcomes over hours.',
      icon: <Laptop className="h-6 w-6 text-primary" />,
    },
    {
      title: 'Health & Wellness',
      description: 'Comprehensive health, dental, and vision coverage for you and your family.',
      icon: <Heart className="h-6 w-6 text-primary" />,
    },
    {
      title: 'Fast-Paced Growth',
      description: 'Stipends for continuous learning, courses, and conferences.',
      icon: <Zap className="h-6 w-6 text-primary" />,
    },
    {
      title: 'Global Team',
      description: 'Collaborate with diverse, talented people across different time zones.',
      icon: <Globe className="h-6 w-6 text-primary" />,
    },
  ];

  return (
    <div className="min-h-screen pt-24 pb-12">
      {/* Hero Section */}
      <section className="container mx-auto px-4 max-w-5xl text-center mb-24">
        <h1 className="text-4xl md:text-6xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-primary to-primary/60">
          Join Our Mission
        </h1>
        <p className="text-xl text-muted-foreground max-w-3xl mx-auto mb-10">
          We are always looking for passionate, driven individuals to help us build the future.
          Discover your next career opportunity with us.
        </p>
        <div className="flex justify-center gap-4">
          <a
            href="#open-roles"
            className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground hover:bg-primary/90 h-11 px-8"
          >
            View Open Roles
          </a>
        </div>
      </section>

      {/* Perks and Culture */}
      <section className="bg-muted/30 py-20 mb-24">
        <div className="container mx-auto px-4 max-w-6xl">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold mb-4">Why Work With Us?</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              We believe in taking care of our team so they can focus on doing their best work.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {perks.map((perk, index) => (
              <Card
                key={index}
                className="border-none bg-background shadow-sm hover:shadow-md transition-shadow"
              >
                <CardHeader>
                  <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                    {perk.icon}
                  </div>
                  <CardTitle className="text-xl">{perk.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">{perk.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Open Roles */}
      <section id="open-roles" className="container mx-auto px-4 max-w-4xl">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold mb-4">Open Roles</h2>
          <p className="text-muted-foreground">
            Find the perfect fit for your skills and experience.
          </p>
        </div>

        <div className="space-y-12">
          {Object.entries(jobsByDept).map(([department, jobs]) => (
            <div key={department} className="mb-10">
              <h3 className="text-2xl font-semibold mb-6 flex items-center gap-2 border-b pb-2">
                {department}
              </h3>
              <div className="grid gap-4">
                {jobs.map((job) => (
                  <Link key={job.id} href={`/careers/${job.id}`}>
                    <Card className="group cursor-pointer hover:border-primary/50 transition-colors">
                      <CardContent className="p-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
                        <div>
                          <h4 className="text-xl font-medium mb-2 group-hover:text-primary transition-colors">
                            {job.title}
                          </h4>
                          <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
                            <span className="flex items-center gap-1">
                              <MapPin className="h-4 w-4" /> {job.location}
                            </span>
                            <span className="flex items-center gap-1">
                              <Briefcase className="h-4 w-4" /> {job.type}
                            </span>
                          </div>
                        </div>
                        <div className="shrink-0 flex items-center text-primary font-medium opacity-0 group-hover:opacity-100 transition-opacity -translate-x-4 group-hover:translate-x-0 transform duration-300">
                          View details <ArrowRight className="ml-2 h-4 w-4" />
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
    </div>
  );
}
