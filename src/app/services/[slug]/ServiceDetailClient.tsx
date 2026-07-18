'use client';

import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowLeft, ArrowRight, CheckCircle2 } from 'lucide-react';
import { AnimatedContainer } from '@/components/shared/AnimatedContainer';
import { Button } from '@/components/ui/button';
import type { Service } from '@/lib/mock-data';

interface ServiceDetailClientProps {
  service: Service;
}

export default function ServiceDetailClient({ service }: ServiceDetailClientProps) {
  return (
    <div className="flex flex-col min-h-screen relative overflow-hidden bg-background py-12">
      {/* Background glow effects */}
      <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] rounded-full bg-indigo-500/10 blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] rounded-full bg-pink-500/10 blur-[120px] pointer-events-none" />

      {/* Back Button */}
      <div className="relative z-10 max-w-7xl mx-auto px-6 pt-10 w-full">
        <Link
          href="/services"
          className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors font-medium group"
        >
          <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-1" />
          Back to Services
        </Link>
      </div>

      {/* Hero Section */}
      <section className="relative z-10 max-w-7xl mx-auto px-6 pt-10 pb-16 w-full">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="flex flex-col gap-6 max-w-4xl"
        >
          {/* Icon badge */}
          <div className={`p-4 w-fit rounded-2xl ${service.colorClass} shadow-lg`}>
            {service.icon}
          </div>

          {/* Title */}
          <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight text-foreground">
            <span className={`bg-gradient-to-r ${service.gradient} bg-clip-text text-transparent`}>
              {service.title}
            </span>
          </h1>

          {/* Short description */}
          <p className="text-base sm:text-lg text-muted-foreground leading-relaxed max-w-2xl">
            {service.shortDesc}
          </p>

          {/* CTA */}
          <div className="flex flex-col sm:flex-row gap-4">
            <Button
              render={<Link href={`/contact?type=quote&service=${service.slug}`} />}
              nativeButton={false}
              size="lg"
              variant="gradient"
              className="cursor-pointer flex items-center gap-2 group w-fit"
            >
              Request a Quote
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Button>
            <Button
              render={<Link href="/contact" />}
              nativeButton={false}
              variant="outline"
              size="lg"
              className="cursor-pointer border-border hover:bg-muted/50 w-fit"
            >
              Talk to an Expert
            </Button>
          </div>
        </motion.div>
      </section>

      {/* Detail Content */}
      <section className="relative z-10 max-w-7xl mx-auto px-6 py-16 w-full border-t border-border/40 grid grid-cols-1 lg:grid-cols-2 gap-16">
        {/* Long description */}
        <AnimatedContainer direction="left" className="flex flex-col gap-6">
          <h2 className="text-2xl sm:text-3xl font-bold text-foreground">About This Service</h2>
          <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">
            {service.longDesc}
          </p>
        </AnimatedContainer>

        {/* What We Offer — feature list */}
        <AnimatedContainer direction="right" className="flex flex-col gap-6">
          <h2 className="text-2xl sm:text-3xl font-bold text-foreground">What We Offer</h2>
          <ul className="flex flex-col gap-3">
            {service.features.map((feature) => (
              <li key={feature} className="flex items-start gap-3 group/feature">
                <CheckCircle2 className="h-5 w-5 text-indigo-500 mt-0.5 shrink-0 group-hover/feature:scale-110 transition-transform duration-200" />
                <span className="text-sm text-muted-foreground leading-relaxed">{feature}</span>
              </li>
            ))}
          </ul>
        </AnimatedContainer>
      </section>

      {/* Tech Stack */}
      <section className="relative z-10 max-w-7xl mx-auto px-6 py-16 w-full border-t border-border/40">
        <AnimatedContainer direction="up" delay={0.1}>
          <h2 className="text-2xl sm:text-3xl font-bold text-foreground mb-8">Tech Stack</h2>
          <div className="flex flex-wrap gap-3">
            {service.tech.map((t, idx) => (
              <motion.span
                key={t}
                initial={{ opacity: 0, scale: 0.85 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: 0.05 * idx, duration: 0.35 }}
                className={`px-4 py-2 rounded-xl text-sm font-semibold border ${service.colorClass} border-current/20 hover:scale-105 transition-transform duration-200 cursor-default`}
              >
                {t}
              </motion.span>
            ))}
          </div>
        </AnimatedContainer>
      </section>

      {/* Other Services */}
      <section className="relative z-10 max-w-7xl mx-auto px-6 py-16 w-full border-t border-border/40">
        <AnimatedContainer direction="up" delay={0.1}>
          <div className="flex items-center justify-between mb-2">
            <h2 className="text-2xl sm:text-3xl font-bold text-foreground">
              Explore Other Services
            </h2>
            <Link
              href="/services"
              className="text-sm text-indigo-500 hover:text-indigo-400 font-semibold flex items-center gap-1 group"
            >
              View All
              <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1" />
            </Link>
          </div>
        </AnimatedContainer>
      </section>

      {/* CTA Banner */}
      <section className="relative z-10 max-w-7xl mx-auto px-6 pb-20 w-full">
        <AnimatedContainer direction="up" delay={0.1}>
          <div className="relative rounded-2xl bg-gradient-to-br from-indigo-900/40 via-purple-950/40 to-pink-900/40 border border-indigo-500/20 p-10 text-center overflow-hidden">
            <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)]" />
            <div className="absolute top-1/4 left-1/4 w-32 h-32 rounded-full bg-indigo-500/10 blur-2xl" />
            <div className="absolute bottom-1/4 right-1/4 w-32 h-32 rounded-full bg-pink-500/10 blur-2xl" />
            <div className="relative z-10">
              <h2 className="text-2xl sm:text-3xl font-extrabold text-foreground mb-4">
                Ready to get started with{' '}
                <span
                  className={`bg-gradient-to-r ${service.gradient} bg-clip-text text-transparent`}
                >
                  {service.title}
                </span>
                ?
              </h2>
              <p className="text-muted-foreground mb-8 max-w-xl mx-auto leading-relaxed">
                Our team is ready to scope your project and deliver a tailored solution that exceeds
                expectations.
              </p>
              <Button
                render={<Link href={`/contact?type=quote&service=${service.slug}`} />}
                nativeButton={false}
                size="lg"
                variant="gradient"
                className="cursor-pointer flex items-center gap-2 group mx-auto"
              >
                Start Your Project
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Button>
            </div>
          </div>
        </AnimatedContainer>
      </section>
    </div>
  );
}
