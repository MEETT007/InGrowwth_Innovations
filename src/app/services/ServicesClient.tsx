'use client';

import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowRight, Sparkles } from 'lucide-react';
import { AnimatedContainer } from '@/components/shared/AnimatedContainer';
import { SectionHeader } from '@/components/shared/SectionHeader';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { services } from '@/lib/mock-data';

export default function ServicesClient() {
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
            description="Six specialized service pillars designed to cover every dimension of your digital transformation journey."
          />
        </AnimatedContainer>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {services.map((service, idx) => (
            <AnimatedContainer key={service.slug} direction="up" delay={0.15 + idx * 0.08}>
              <Link href={`/services/${service.slug}`} className="block h-full group/card">
                <Card className="h-full border-border/50 bg-card/60 backdrop-blur-sm relative overflow-hidden flex flex-col cursor-pointer transition-all duration-300 hover:shadow-xl hover:shadow-indigo-500/10 hover:-translate-y-1">
                  {/* Hover gradient overlay */}
                  <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/5 to-pink-500/5 opacity-0 group-hover/card:opacity-100 transition-opacity duration-500 pointer-events-none" />

                  {/* Top accent line */}
                  <div
                    className={`absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r ${service.gradient} opacity-0 group-hover/card:opacity-100 transition-opacity duration-300`}
                  />

                  <CardHeader className="pb-3">
                    <div
                      className={`p-3 w-fit rounded-xl ${service.colorClass} mb-3 group-hover/card:scale-110 transition-transform duration-300`}
                    >
                      {service.icon}
                    </div>
                    <CardTitle className="text-xl font-bold tracking-tight">
                      {service.title}
                    </CardTitle>
                  </CardHeader>

                  <CardContent className="flex flex-col flex-grow gap-4">
                    <CardDescription className="text-sm text-muted-foreground leading-relaxed flex-grow">
                      {service.shortDesc}
                    </CardDescription>

                    {/* Tech tags */}
                    <div className="flex flex-wrap gap-1.5">
                      {service.tech.slice(0, 4).map((t) => (
                        <span
                          key={t}
                          className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-muted/60 border border-border/40 text-muted-foreground"
                        >
                          {t}
                        </span>
                      ))}
                    </div>

                    {/* Learn More CTA — revealed on hover */}
                    <div className="flex items-center gap-1.5 text-sm font-semibold text-indigo-500 opacity-0 group-hover/card:opacity-100 transition-all duration-300 -translate-y-1 group-hover/card:translate-y-0">
                      Learn More
                      <ArrowRight className="h-4 w-4 transition-transform group-hover/card:translate-x-1" />
                    </div>
                  </CardContent>
                </Card>
              </Link>
            </AnimatedContainer>
          ))}
        </div>
      </section>

      {/* CTA Banner */}
      <section className="relative z-10 max-w-7xl mx-auto px-6 py-20 w-full border-t border-border/40">
        <AnimatedContainer direction="up" delay={0.1}>
          <div className="relative rounded-2xl bg-gradient-to-br from-indigo-900/40 via-purple-950/40 to-pink-900/40 border border-indigo-500/20 p-10 text-center overflow-hidden">
            {/* Grid pattern */}
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
