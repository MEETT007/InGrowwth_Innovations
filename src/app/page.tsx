'use client';

import Link from 'next/link';
import { ArrowRight, Sparkles, Code, Layout, Database } from 'lucide-react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';

const features = [
  {
    icon: <Layout className="h-6 w-6 text-indigo-500" />,
    title: 'Premium UI/UX Design',
    desc: 'Modern layouts designed with user delight and conversions in mind.',
  },
  {
    icon: <Code className="h-6 w-6 text-purple-500" />,
    title: 'Robust Engineering',
    desc: 'Next.js 15 apps built with speed, SEO best practices, and clean code.',
  },
  {
    icon: <Database className="h-6 w-6 text-pink-500" />,
    title: 'Prisma & PostgreSQL',
    desc: 'Scalable data architecture connecting to reliable Cloud databases.',
  },
];

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen justify-center relative overflow-hidden bg-background">
      {/* Background glow effects */}
      <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] rounded-full bg-indigo-500/10 blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] rounded-full bg-pink-500/10 blur-[120px] pointer-events-none" />

      {/* Hero Section */}
      <section className="max-w-7xl mx-auto px-6 pt-24 pb-20 md:pt-32 md:pb-28 flex flex-col items-center text-center relative z-10">
        {/* Sub-header badge */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-600 dark:text-indigo-400 text-xs font-semibold uppercase tracking-wider mb-8"
        >
          <Sparkles className="h-3.5 w-3.5" />
          Enterprise-Grade Next.js Development
        </motion.div>

        {/* Headline */}
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="text-4xl sm:text-6xl font-extrabold tracking-tight text-foreground max-w-4xl leading-[1.15]"
        >
          We Build Products That Inspire{' '}
          <span className="bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 bg-clip-text text-transparent">
            Digital Growth
          </span>
        </motion.h1>

        {/* Sub-headline */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="mt-6 text-lg sm:text-xl text-muted-foreground max-w-2xl leading-relaxed"
        >
          InGrowwth Innovations delivers modern full-stack web applications, dynamic user
          interfaces, and cloud architectures optimized for long-term scalability.
        </motion.p>

        {/* CTAs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="mt-10 flex flex-col sm:flex-row gap-4 items-center justify-center w-full max-w-md"
        >
          <Button
            render={<Link href="/contact" />}
            nativeButton={false}
            size="lg"
            className="w-full sm:w-auto bg-primary text-primary-foreground group cursor-pointer shadow-md flex items-center justify-center gap-2"
          >
            Start Project
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
          </Button>
          <Button
            render={<Link href="/services" />}
            nativeButton={false}
            variant="outline"
            size="lg"
            className="w-full sm:w-auto cursor-pointer border-border hover:bg-muted/50"
          >
            View Services
          </Button>
        </motion.div>
      </section>

      {/* Feature Highlights */}
      <section className="max-w-7xl mx-auto px-6 py-20 w-full relative z-10 border-t border-border/40">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {features.map((feature, idx) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-100px' }}
              transition={{ duration: 0.5, delay: idx * 0.1 }}
              className="flex flex-col gap-3 p-6 rounded-2xl bg-card border border-border/50 shadow-sm"
            >
              <div className="p-3 w-fit rounded-xl bg-muted/60 mb-2">{feature.icon}</div>
              <h3 className="text-lg font-semibold text-foreground">{feature.title}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">{feature.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>
    </div>
  );
}
