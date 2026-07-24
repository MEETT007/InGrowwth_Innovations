'use client';

import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowRight, Sparkles, Code } from 'lucide-react';
import * as LucideIcons from 'lucide-react';
import { AnimatedContainer } from '@/components/shared/AnimatedContainer';
import { SectionHeader } from '@/components/shared/SectionHeader';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

interface DBService {
  id: string;
  title: string;
  description: string;
  icon: string;
  body: string;
}

const GRADIENTS = [
  'from-blue-500 to-cyan-400',
  'from-purple-500 to-indigo-500',
  'from-pink-500 to-rose-400',
  'from-orange-500 to-amber-400',
  'from-green-500 to-emerald-400',
  'from-red-500 to-pink-500',
];
const COLOR_CLASSES = [
  'bg-blue-500/10 text-blue-500',
  'bg-purple-500/10 text-purple-500',
  'bg-pink-500/10 text-pink-500',
  'bg-orange-500/10 text-orange-500',
  'bg-green-500/10 text-green-500',
  'bg-red-500/10 text-red-500',
];
const DEFAULT_TECH = [
  ['React', 'Next.js', 'Node.js', 'Tailwind'],
  ['Swift', 'Kotlin', 'React Native', 'Flutter'],
  ['AWS', 'Docker', 'Kubernetes', 'CI/CD'],
  ['Python', 'TensorFlow', 'PyTorch', 'OpenAI'],
  ['Figma', 'Framer', 'UI/UX', 'Prototyping'],
  ['PostgreSQL', 'MongoDB', 'Redis', 'GraphQL'],
];

// Helper to render dynamic lucide icons
const IconComponent = ({ name }: { name: string }) => {
  // @ts-ignore
  const Icon = LucideIcons[name] || Code;
  return <Icon className="w-8 h-8" />;
};

export default function ServicesClient({ initialServices }: { initialServices: DBService[] }) {
  return (
    <div className="flex flex-col min-h-screen relative overflow-hidden bg-background py-12">
      {/* Background glow effects */}
      <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] rounded-full bg-indigo-500/10 blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] rounded-full bg-pink-500/10 blur-[120px] pointer-events-none" />
      <div className="absolute top-[40%] right-[5%] w-[30%] h-[30%] rounded-full bg-purple-500/5 blur-[150px] pointer-events-none" />

      {/* Hero / Header */}
      <section className="relative z-10 max-w-7xl mx-auto px-6 pt-16 pb-8 w-full text-center">
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-600 dark:text-indigo-400 text-xs font-semibold uppercase tracking-wider mb-6"
        >
          <Sparkles className="h-3.5 w-3.5" />
          What We Build
        </motion.div>
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="text-4xl sm:text-5xl font-extrabold tracking-tight text-foreground mb-6"
        >
          Enterprise-Grade{' '}
          <span className="bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 bg-clip-text text-transparent">
            IT Services
          </span>
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="text-base sm:text-lg text-muted-foreground max-w-3xl mx-auto leading-relaxed"
        >
          From pixel-perfect web applications to hardened cloud infrastructure — we deliver
          end-to-end technology solutions that power modern businesses.
        </motion.p>
      </section>

      {/* Services Grid */}
      <section className="relative z-10 max-w-7xl mx-auto px-6 py-16 w-full">
        <AnimatedContainer direction="up" delay={0.1}>
          <SectionHeader
            title="Our Core Services"
            subtitle="Full-Spectrum IT"
            description="Specialized service pillars designed to cover every dimension of your digital transformation journey."
          />
        </AnimatedContainer>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {initialServices.map((service, idx) => {
            const gradient = GRADIENTS[idx % GRADIENTS.length];
            const colorClass = COLOR_CLASSES[idx % COLOR_CLASSES.length];
            const tech = DEFAULT_TECH[idx % DEFAULT_TECH.length];

            return (
              <AnimatedContainer key={service.id} direction="up" delay={0.15 + idx * 0.08}>
                <Link href={`/services/${service.id}`} className="block h-full group/card">
                  <Card className="h-full border-border/50 bg-card/60 backdrop-blur-sm relative overflow-hidden flex flex-col cursor-pointer transition-all duration-300 hover:shadow-xl hover:shadow-indigo-500/10 hover:-translate-y-1">
                    {/* Hover gradient overlay */}
                    <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/5 to-pink-500/5 opacity-0 group-hover/card:opacity-100 transition-opacity duration-500 pointer-events-none" />

                    {/* Top accent line */}
                    <div
                      className={`absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r ${gradient} opacity-0 group-hover/card:opacity-100 transition-opacity duration-300`}
                    />

                    <CardHeader className="pb-3">
                      <div
                        className={`p-3 w-fit rounded-xl ${colorClass} mb-3 group-hover/card:scale-110 transition-transform duration-300`}
                      >
                        <IconComponent name={service.icon} />
                      </div>
                      <CardTitle className="text-xl font-bold tracking-tight">
                        {service.title}
                      </CardTitle>
                    </CardHeader>

                    <CardContent className="flex flex-col flex-grow gap-4">
                      <CardDescription className="text-sm text-muted-foreground leading-relaxed flex-grow">
                        {service.description}
                      </CardDescription>

                      {/* Tech tags */}
                      <div className="flex flex-wrap gap-1.5">
                        {tech.map((t) => (
                          <span
                            key={t}
                            className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-muted/60 border border-border/40 text-muted-foreground"
                          >
                            {t}
                          </span>
                        ))}
                      </div>

                      {/* Learn More CTA */}
                      <div className="flex items-center gap-1.5 text-sm font-semibold text-indigo-500 opacity-0 group-hover/card:opacity-100 transition-all duration-300 -translate-y-1 group-hover/card:translate-y-0">
                        Learn More
                        <ArrowRight className="h-4 w-4 transition-transform group-hover/card:translate-x-1" />
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              </AnimatedContainer>
            );
          })}
        </div>
      </section>

      {/* CTA Banner */}
      <section className="relative z-10 max-w-7xl mx-auto px-6 py-20 w-full border-t border-border/40">
        <AnimatedContainer direction="up" delay={0.1}>
          <div className="relative rounded-2xl bg-gradient-to-br from-indigo-900/40 via-purple-950/40 to-pink-900/40 border border-indigo-500/20 p-10 text-center overflow-hidden">
            <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)]" />
            <div className="absolute top-1/4 left-1/4 w-32 h-32 rounded-full bg-indigo-500/10 blur-2xl" />
            <div className="absolute bottom-1/4 right-1/4 w-32 h-32 rounded-full bg-pink-500/10 blur-2xl" />

            <div className="relative z-10">
              <h2 className="text-2xl sm:text-3xl font-extrabold text-white mb-4">
                Ready to build something{' '}
                <span className="bg-gradient-to-r from-indigo-400 to-pink-400 bg-clip-text text-transparent">
                  extraordinary?
                </span>
              </h2>
              <p className="text-slate-300 mb-8 max-w-xl mx-auto leading-relaxed">
                Let&apos;s discuss your project and tailor a solution that fits your goals,
                timeline, and budget.
              </p>
              <Button
                render={<Link href="/contact?type=quote" />}
                nativeButton={false}
                size="lg"
                variant="gradient"
                className="cursor-pointer flex items-center gap-2 group mx-auto"
              >
                Get a Free Quote
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Button>
            </div>
          </div>
        </AnimatedContainer>
      </section>
    </div>
  );
}
