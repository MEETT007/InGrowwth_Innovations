'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import {
  MapPin,
  Heart,
  Zap,
  Coffee,
  Users,
  ArrowRight,
  Briefcase,
  ChevronDown,
  Clock,
} from 'lucide-react';
import { SectionHeader } from '@/components/shared/SectionHeader';
import { Job } from '@/generated/prisma/client';
import { cn } from '@/lib/utils';

const PERKS = [
  {
    icon: <MapPin className="w-6 h-6 text-indigo-500 dark:text-indigo-400" />,
    title: 'Work Anywhere',
    desc: 'Remote-first culture with co-working stipends.',
  },
  {
    icon: <Heart className="w-6 h-6 text-pink-500 dark:text-pink-400" />,
    title: 'Health & Wellness',
    desc: 'Comprehensive health, dental, and vision insurance.',
  },
  {
    icon: <Zap className="w-6 h-6 text-yellow-500 dark:text-yellow-400" />,
    title: 'Latest Tech',
    desc: 'M3 MacBooks and a generous home office budget.',
  },
  {
    icon: <Coffee className="w-6 h-6 text-orange-500 dark:text-orange-400" />,
    title: 'Unlimited PTO',
    desc: 'Take the time you need to recharge and avoid burnout.',
  },
];

interface CareersClientProps {
  groupedJobs: Record<string, Job[]>;
}

export default function CareersClient({ groupedJobs }: CareersClientProps) {
  const [activeAccordion, setActiveAccordion] = useState<string | null>(
    Object.keys(groupedJobs)[0] || null
  );

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
    <main className="min-h-screen pt-24 pb-20 px-6 max-w-7xl mx-auto flex flex-col gap-24 overflow-hidden relative">
      {/* Background glow effects */}
      <div className="fixed top-[0%] left-[-10%] w-[60%] h-[60%] rounded-full bg-indigo-500/10 dark:bg-indigo-500/20 blur-[120px] pointer-events-none -z-10" />
      <div className="fixed bottom-[-10%] right-[-10%] w-[50%] h-[50%] rounded-full bg-pink-500/10 dark:bg-pink-500/20 blur-[120px] pointer-events-none -z-10" />

      {/* Hero Section */}
      <motion.section
        className="flex flex-col gap-16 mt-8 relative"
        initial="hidden"
        animate="show"
        variants={containerVariants}
      >
        <motion.div variants={itemVariants} className="flex flex-col items-center text-center">
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.2, type: 'spring' }}
            className="px-4 py-2 rounded-full bg-indigo-100 dark:bg-indigo-900/40 text-indigo-700 dark:text-indigo-300 font-semibold text-sm mb-6 flex items-center gap-2 border border-indigo-200 dark:border-indigo-800/50"
          >
            <span className="relative flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-indigo-500"></span>
            </span>
            We are hiring!
          </motion.div>
          <SectionHeader
            title="Join Our Mission"
            subtitle="Careers"
            description="We're building the next generation of digital experiences. Come help us shape the future of technology."
          />
        </motion.div>

        {/* Culture / Bento Gallery */}
        <motion.div
          variants={containerVariants}
          className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-4"
        >
          <motion.div
            variants={itemVariants}
            whileHover={{ scale: 1.02 }}
            className="md:col-span-2 h-[300px] md:h-[450px] w-full rounded-[2rem] overflow-hidden bg-white/50 dark:bg-black/40 border border-border/50 backdrop-blur-xl p-2 relative group shadow-xl dark:shadow-2xl"
          >
            <div className="relative w-full h-full rounded-[1.5rem] overflow-hidden">
              <Image
                src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?q=80&w=1200&auto=format&fit=crop"
                alt="Team collaboration"
                fill
                className="object-cover transition-transform duration-700 group-hover:scale-105"
                sizes="(max-width: 768px) 100vw, 66vw"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            </div>
          </motion.div>

          <div className="flex flex-col gap-6 h-[300px] md:h-[450px]">
            <motion.div
              variants={itemVariants}
              whileHover={{ scale: 1.05 }}
              className="flex-1 w-full rounded-[2rem] overflow-hidden bg-white/50 dark:bg-black/40 border border-border/50 backdrop-blur-xl p-2 relative group shadow-xl dark:shadow-2xl"
            >
              <div className="relative w-full h-full rounded-[1.5rem] overflow-hidden">
                <Image
                  src="https://images.unsplash.com/photo-1573164713988-8665fc963095?q=80&w=800&auto=format&fit=crop"
                  alt="Working remotely"
                  fill
                  className="object-cover transition-transform duration-700 group-hover:scale-110"
                  sizes="(max-width: 768px) 100vw, 33vw"
                />
              </div>
            </motion.div>

            <motion.div
              variants={itemVariants}
              whileHover={{ scale: 1.05 }}
              className="flex-1 w-full rounded-[2rem] overflow-hidden bg-gradient-to-br from-indigo-500/10 to-purple-500/10 dark:from-indigo-500/20 dark:to-purple-500/20 border border-indigo-500/20 backdrop-blur-xl p-6 flex flex-col justify-center items-center text-center relative group shadow-xl dark:shadow-2xl"
            >
              <QuoteIcon className="w-8 h-8 text-indigo-500/50 absolute top-4 left-4" />
              <h3 className="text-xl md:text-2xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 dark:from-indigo-400 dark:to-purple-400 bg-clip-text text-transparent z-10 leading-snug">
                &quot;We don&apos;t just build software, we build teams that build the future.&quot;
              </h3>
            </motion.div>
          </div>
        </motion.div>
      </motion.section>

      {/* Perks Section (3D Glass Cards) */}
      <section className="relative z-10">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-extrabold tracking-tight mb-4">
            Why InGrowwth?
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            We invest in our people so they can invest in their work. Here is what you get when you
            join our team.
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {PERKS.map((perk, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-100px' }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              whileHover={{ y: -10 }}
              className="group relative"
            >
              <div className="absolute inset-0 bg-gradient-to-b from-indigo-500/20 to-purple-500/20 rounded-3xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              <div className="relative h-full bg-white/60 dark:bg-zinc-900/60 backdrop-blur-xl border border-border/50 rounded-3xl p-8 shadow-lg hover:shadow-2xl transition-all duration-300 flex flex-col items-center text-center">
                <div className="p-4 bg-indigo-50 dark:bg-indigo-950/50 rounded-2xl mb-6 shadow-inner relative overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-br from-white/40 to-transparent dark:from-white/5" />
                  {perk.icon}
                </div>
                <h3 className="text-xl font-bold mb-3">{perk.title}</h3>
                <p className="text-muted-foreground text-sm leading-relaxed">{perk.desc}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Open Positions (Sleek Accordion) */}
      <section className="relative z-10">
        <div className="mb-16 text-center md:text-left flex flex-col md:flex-row justify-between items-center gap-6">
          <div>
            <h2 className="text-4xl md:text-5xl font-extrabold tracking-tight mb-4">
              Open Positions
            </h2>
            <p className="text-muted-foreground text-lg max-w-2xl">
              Find a role where you can do your best work.
            </p>
          </div>
          <div className="hidden md:flex items-center gap-2 px-4 py-2 bg-white/50 dark:bg-zinc-900/50 rounded-full text-sm font-medium border border-border/50 shadow-sm backdrop-blur-md">
            <Briefcase className="w-4 h-4 text-indigo-500" />
            {Object.values(groupedJobs).flat().length} Roles Available
          </div>
        </div>

        <div className="flex flex-col gap-6">
          {Object.entries(groupedJobs).map(([department, jobs]) => {
            const isActive = activeAccordion === department;

            return (
              <motion.div
                key={department}
                initial={false}
                animate={{ backgroundColor: isActive ? 'var(--background)' : 'transparent' }}
                className={cn(
                  'border border-border/50 rounded-3xl overflow-hidden transition-all duration-300',
                  isActive
                    ? 'shadow-2xl dark:shadow-indigo-500/10 bg-white dark:bg-zinc-950'
                    : 'bg-white/40 dark:bg-zinc-900/40 hover:bg-white/60 dark:hover:bg-zinc-900/60 backdrop-blur-md'
                )}
              >
                <button
                  onClick={() => setActiveAccordion(isActive ? null : department)}
                  className="w-full flex items-center justify-between p-6 md:p-8 text-left focus:outline-none"
                >
                  <div className="flex items-center gap-4">
                    <div
                      className={cn(
                        'p-3 rounded-2xl transition-colors duration-300',
                        isActive
                          ? 'bg-indigo-100 dark:bg-indigo-900/50 text-indigo-600 dark:text-indigo-400'
                          : 'bg-muted text-muted-foreground'
                      )}
                    >
                      <Users className="h-6 w-6" />
                    </div>
                    <div>
                      <h3 className="text-2xl font-bold">{department}</h3>
                      <p className="text-sm text-muted-foreground mt-1">
                        {jobs.length} open {jobs.length === 1 ? 'role' : 'roles'}
                      </p>
                    </div>
                  </div>
                  <motion.div
                    animate={{ rotate: isActive ? 180 : 0 }}
                    transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                  >
                    <ChevronDown className="w-6 h-6 text-muted-foreground" />
                  </motion.div>
                </button>

                <AnimatePresence initial={false}>
                  {isActive && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3, ease: 'easeInOut' }}
                    >
                      <div className="p-6 pt-0 md:p-8 md:pt-0 flex flex-col gap-4">
                        {jobs.map((job, idx) => (
                          <motion.div
                            key={job.id}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: idx * 0.1 }}
                          >
                            <Link href={`/careers/${job.id}`}>
                              <div className="group relative bg-muted/30 hover:bg-indigo-50 dark:hover:bg-indigo-500/10 border border-border/50 hover:border-indigo-500/30 rounded-2xl p-6 flex flex-col md:flex-row md:items-center justify-between gap-4 transition-all duration-300 shadow-sm hover:shadow-md">
                                <div className="flex flex-col gap-2">
                                  <h4 className="text-xl font-bold text-foreground group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                                    {job.title}
                                  </h4>
                                  <div className="flex flex-wrap items-center gap-3 text-sm text-muted-foreground font-medium">
                                    <span className="flex items-center gap-1.5 bg-background/50 px-3 py-1 rounded-full border border-border/50 shadow-sm">
                                      <MapPin className="h-3.5 w-3.5" />
                                      {job.location}
                                    </span>
                                    <span className="flex items-center gap-1.5 bg-background/50 px-3 py-1 rounded-full border border-border/50 shadow-sm">
                                      <Clock className="h-3.5 w-3.5" />
                                      {job.type}
                                    </span>
                                  </div>
                                </div>
                                <div className="flex items-center gap-4 mt-2 md:mt-0">
                                  <span className="text-indigo-600 dark:text-indigo-400 font-semibold text-sm opacity-0 group-hover:opacity-100 transition-opacity -translate-x-4 group-hover:translate-x-0 duration-300">
                                    View Details
                                  </span>
                                  <div className="h-10 w-10 rounded-full bg-indigo-100 dark:bg-indigo-900/50 flex items-center justify-center group-hover:bg-indigo-600 group-hover:text-white dark:group-hover:bg-indigo-500 transition-colors shadow-sm">
                                    <ArrowRight className="h-5 w-5 text-indigo-600 dark:text-indigo-400 group-hover:text-white transition-colors" />
                                  </div>
                                </div>
                              </div>
                            </Link>
                          </motion.div>
                        ))}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            );
          })}
        </div>
      </section>
    </main>
  );
}

function QuoteIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="currentColor"
    >
      <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z" />
    </svg>
  );
}
