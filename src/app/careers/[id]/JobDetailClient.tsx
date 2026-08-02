'use client';

import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowLeft, MapPin, Clock, Building, CheckCircle2 } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Job } from '@/generated/prisma/client';
import { cn } from '@/lib/utils';

interface JobDetailClientProps {
  job: Job;
  parsedRequirements: string[];
}

export default function JobDetailClient({ job, parsedRequirements }: JobDetailClientProps) {
  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.1 },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    show: {
      opacity: 1,
      y: 0,
      transition: { type: 'spring' as const, stiffness: 300, damping: 24 },
    },
  };

  return (
    <main className="min-h-screen pt-24 pb-20 px-6 max-w-5xl mx-auto flex flex-col gap-12 relative overflow-hidden">
      {/* Background glow effects */}
      <div className="fixed top-[-10%] left-[-10%] w-[50%] h-[50%] rounded-full bg-indigo-500/10 dark:bg-indigo-500/20 blur-[120px] pointer-events-none -z-10" />
      <div className="fixed bottom-[-10%] right-[-10%] w-[50%] h-[50%] rounded-full bg-pink-500/10 dark:bg-pink-500/20 blur-[120px] pointer-events-none -z-10" />

      {/* Header / Nav */}
      <motion.div
        initial="hidden"
        animate="show"
        variants={containerVariants}
        className="flex flex-col gap-8"
      >
        <motion.div variants={itemVariants}>
          <Link
            href="/careers"
            className="inline-flex items-center text-sm font-medium text-muted-foreground hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors group"
          >
            <ArrowLeft className="mr-2 h-4 w-4 transition-transform group-hover:-translate-x-1" />
            Back to all roles
          </Link>
        </motion.div>

        <motion.div variants={itemVariants} className="flex flex-col gap-6 relative">
          <Badge className="w-fit bg-indigo-100 text-indigo-700 dark:bg-indigo-900/50 dark:text-indigo-300 hover:bg-indigo-200 dark:hover:bg-indigo-900/70 transition-colors px-4 py-1 text-sm border border-indigo-200 dark:border-indigo-700/50">
            {job.department}
          </Badge>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tight bg-gradient-to-br from-foreground to-foreground/70 bg-clip-text text-transparent">
            {job.title}
          </h1>
          <div className="flex flex-wrap items-center gap-4 mt-2">
            <div className="flex items-center gap-2 bg-white/50 dark:bg-zinc-900/50 backdrop-blur-md px-4 py-2 rounded-full border border-border/50 shadow-sm">
              <MapPin className="h-4 w-4 text-indigo-500" />
              <span className="text-sm font-medium text-muted-foreground">{job.location}</span>
            </div>
            <div className="flex items-center gap-2 bg-white/50 dark:bg-zinc-900/50 backdrop-blur-md px-4 py-2 rounded-full border border-border/50 shadow-sm">
              <Clock className="h-4 w-4 text-pink-500" />
              <span className="text-sm font-medium text-muted-foreground">{job.type}</span>
            </div>
            <div className="flex items-center gap-2 bg-white/50 dark:bg-zinc-900/50 backdrop-blur-md px-4 py-2 rounded-full border border-border/50 shadow-sm">
              <Building className="h-4 w-4 text-yellow-500" />
              <span className="text-sm font-medium text-muted-foreground">
                InGrowwth Innovations
              </span>
            </div>
          </div>
        </motion.div>
      </motion.div>

      <motion.hr
        initial={{ scaleX: 0, opacity: 0 }}
        animate={{ scaleX: 1, opacity: 1 }}
        transition={{ duration: 0.8, delay: 0.3 }}
        className="border-border/40 origin-left"
      />

      {/* Content */}
      <div className="grid lg:grid-cols-3 gap-12 lg:gap-16">
        <motion.div
          initial="hidden"
          animate="show"
          variants={containerVariants}
          className="lg:col-span-2 flex flex-col gap-12"
        >
          <motion.section
            variants={itemVariants}
            className="prose prose-lg dark:prose-invert max-w-none"
          >
            <h2 className="text-2xl font-bold mb-4 text-foreground flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-indigo-100 dark:bg-indigo-900/50 flex items-center justify-center">
                <span className="w-2.5 h-2.5 rounded-full bg-indigo-500" />
              </div>
              About the Role
            </h2>
            <p className="text-muted-foreground leading-relaxed text-lg">{job.description}</p>
          </motion.section>

          <motion.section variants={itemVariants}>
            <h2 className="text-2xl font-bold mb-6 text-foreground flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-pink-100 dark:bg-pink-900/50 flex items-center justify-center">
                <span className="w-2.5 h-2.5 rounded-full bg-pink-500" />
              </div>
              Requirements
            </h2>
            <ul className="space-y-4">
              {parsedRequirements.map((req, i) => (
                <li key={i} className="flex gap-4 items-start">
                  <CheckCircle2 className="w-6 h-6 text-indigo-500 shrink-0 mt-0.5" />
                  <span className="text-muted-foreground text-lg leading-relaxed">{req}</span>
                </li>
              ))}
            </ul>
          </motion.section>

          <motion.section variants={itemVariants}>
            <h2 className="text-2xl font-bold mb-6 text-foreground flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-yellow-100 dark:bg-yellow-900/50 flex items-center justify-center">
                <span className="w-2.5 h-2.5 rounded-full bg-yellow-500" />
              </div>
              Benefits & Perks
            </h2>
            <ul className="space-y-4">
              {[
                'Competitive salary and equity options.',
                'Fully remote work policy with flexible hours.',
                'Comprehensive health, dental, and vision coverage.',
                'Annual learning and development stipend.',
                'M3 MacBook Pro and home office setup budget.',
              ].map((benefit, i) => (
                <li key={i} className="flex gap-4 items-start">
                  <CheckCircle2 className="w-6 h-6 text-pink-500 shrink-0 mt-0.5" />
                  <span className="text-muted-foreground text-lg leading-relaxed">{benefit}</span>
                </li>
              ))}
            </ul>
          </motion.section>
        </motion.div>

        {/* Sidebar / Apply */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="flex flex-col gap-6"
        >
          <div className="bg-white/60 dark:bg-zinc-900/60 backdrop-blur-xl p-8 rounded-[2rem] border border-border/50 shadow-2xl sticky top-28 flex flex-col gap-6 relative group overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/10 to-pink-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

            <div className="relative z-10 flex flex-col gap-2">
              <h3 className="text-2xl font-bold bg-gradient-to-br from-foreground to-foreground/80 bg-clip-text text-transparent">
                Interested in this role?
              </h3>
              <p className="text-muted-foreground leading-relaxed">
                Submit your application today. We typically respond within 48 hours.
              </p>
            </div>

            <div className="relative z-10">
              <Dialog>
                <DialogTrigger
                  render={
                    <Button
                      className="w-full text-base font-semibold shadow-lg hover:shadow-xl transition-all duration-300 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl py-6 cursor-pointer"
                      size="lg"
                    >
                      Apply Now
                    </Button>
                  }
                />
                <DialogContent className="sm:max-w-[500px] bg-white/95 dark:bg-zinc-950/95 backdrop-blur-xl border-border/50 rounded-3xl p-8">
                  <DialogHeader className="mb-4">
                    <DialogTitle className="text-3xl font-bold bg-gradient-to-r from-indigo-500 to-purple-500 bg-clip-text text-transparent">
                      Apply for {job.title}
                    </DialogTitle>
                    <DialogDescription className="text-base text-muted-foreground mt-2">
                      Fill out the form below to submit your application.
                    </DialogDescription>
                  </DialogHeader>

                  <form className="flex flex-col gap-5">
                    <div className="grid grid-cols-2 gap-5">
                      <div className="flex flex-col gap-2">
                        <Label htmlFor="first-name" className="text-sm font-medium">
                          First Name
                        </Label>
                        <Input
                          id="first-name"
                          placeholder="Jane"
                          required
                          className="bg-background/50 rounded-xl"
                        />
                      </div>
                      <div className="flex flex-col gap-2">
                        <Label htmlFor="last-name" className="text-sm font-medium">
                          Last Name
                        </Label>
                        <Input
                          id="last-name"
                          placeholder="Doe"
                          required
                          className="bg-background/50 rounded-xl"
                        />
                      </div>
                    </div>

                    <div className="flex flex-col gap-2">
                      <Label htmlFor="email" className="text-sm font-medium">
                        Email Address
                      </Label>
                      <Input
                        id="email"
                        type="email"
                        placeholder="jane@example.com"
                        required
                        className="bg-background/50 rounded-xl"
                      />
                    </div>

                    <div className="flex flex-col gap-2">
                      <Label htmlFor="portfolio" className="text-sm font-medium">
                        LinkedIn / Portfolio URL
                      </Label>
                      <Input
                        id="portfolio"
                        type="url"
                        placeholder="https://linkedin.com/in/jane"
                        required
                        className="bg-background/50 rounded-xl"
                      />
                    </div>

                    <div className="flex flex-col gap-2">
                      <Label htmlFor="cover-letter" className="text-sm font-medium">
                        Cover Letter / Note (Optional)
                      </Label>
                      <Textarea
                        id="cover-letter"
                        placeholder="Tell us why you're a great fit..."
                        className="min-h-[120px] bg-background/50 rounded-xl resize-none"
                      />
                    </div>

                    <Button
                      type="submit"
                      className="w-full mt-4 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl py-6 font-semibold"
                    >
                      Submit Application
                    </Button>
                  </form>
                </DialogContent>
              </Dialog>
            </div>
          </div>
        </motion.div>
      </div>
    </main>
  );
}
