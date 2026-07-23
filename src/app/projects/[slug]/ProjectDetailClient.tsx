'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import {
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  Code2,
  Zap,
  ChevronLeft,
  ChevronRight,
  ExternalLink,
  Calendar,
  Tag,
} from 'lucide-react';
import { AnimatedContainer } from '@/components/shared/AnimatedContainer';
import { Button } from '@/components/ui/button';
import { projects, type Project } from '@/lib/mock-data';

interface ProjectDetailClientProps {
  project: Project;
}

const gradientToEmoji: Record<string, string> = {
  sensai: '🤖',
  'easy-farm-hub': '🌾',
  'sankalp-library': '📚',
  'ahmedabad-builders': '🏗️',
  quickchat: '💬',
  'smart-irrigation': '💧',
  'adventure-sports-club': '🏊',
  'crunchy-coffee': '☕',
};

// Placeholder screenshot card
function ScreenshotPlaceholder({
  alt,
  emoji,
  gradient,
  index,
}: {
  alt: string;
  emoji: string;
  gradient: string;
  index: number;
}) {
  return (
    <div
      className={`w-full aspect-video rounded-2xl bg-gradient-to-br ${gradient} flex flex-col items-center justify-center gap-3 select-none`}
    >
      <span className="text-6xl">{emoji}</span>
      <span className="text-white/80 text-sm font-medium px-6 text-center">{alt}</span>
      <span className="text-white/50 text-xs">Screenshot {index + 1}</span>
    </div>
  );
}

export default function ProjectDetailClient({ project }: ProjectDetailClientProps) {
  const [activeSlide, setActiveSlide] = useState(0);

  const totalSlides = project.screenshots.length;
  const nextSlide = () => setActiveSlide((prev) => (prev + 1) % totalSlides);
  const prevSlide = () => setActiveSlide((prev) => (prev - 1 + totalSlides) % totalSlides);

  const emoji = gradientToEmoji[project.slug] ?? '💡';

  const otherProjects = projects.filter((p) => p.slug !== project.slug).slice(0, 3);

  return (
    <div className="flex flex-col min-h-screen relative overflow-hidden bg-background py-12">
      {/* Background glows */}
      <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] rounded-full bg-indigo-500/10 blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] rounded-full bg-pink-500/10 blur-[120px] pointer-events-none" />

      {/* Back Button */}
      <div className="relative z-10 max-w-7xl mx-auto px-6 pt-10 w-full">
        <Link
          href="/projects"
          className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors font-medium group"
        >
          <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-1" />
          Back to Projects
        </Link>
      </div>

      {/* Hero Section */}
      <section className="relative z-10 max-w-7xl mx-auto px-6 pt-10 pb-8 w-full">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Left: Text */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="flex flex-col gap-6"
          >
            {/* Category badge */}
            <div className="flex items-center gap-3">
              <span
                className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold ${project.colorClass} border border-current/20`}
              >
                <Tag className="h-3 w-3" />
                {project.category}
              </span>
              <span className="flex items-center gap-1 text-xs text-muted-foreground font-medium">
                <Calendar className="h-3 w-3" />
                {project.year}
              </span>
            </div>

            <div>
              <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight text-foreground">
                <span
                  className={`bg-gradient-to-r ${project.gradient} bg-clip-text text-transparent`}
                >
                  {project.title}
                </span>
              </h1>
              <p className="text-lg text-muted-foreground mt-2 font-medium">{project.tagline}</p>
            </div>

            <p className="text-base text-muted-foreground leading-relaxed">{project.description}</p>

            {/* Tags */}
            <div className="flex flex-wrap gap-2">
              {project.tags.map((tag) => (
                <span
                  key={tag}
                  className="text-xs font-semibold px-3 py-1 rounded-full bg-muted/60 border border-border/40 text-muted-foreground"
                >
                  {tag}
                </span>
              ))}
            </div>

            {/* CTAs */}
            <div className="flex flex-col sm:flex-row gap-4">
              <Button
                render={<Link href={`/contact?type=quote&project=${project.slug}`} />}
                nativeButton={false}
                size="lg"
                variant="gradient"
                className="cursor-pointer flex items-center gap-2 group w-fit"
              >
                Request Similar Project
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Button>
              <Button
                render={<Link href="/contact" />}
                nativeButton={false}
                variant="outline"
                size="lg"
                className="cursor-pointer border-border hover:bg-muted/50 w-fit flex items-center gap-2"
              >
                <ExternalLink className="h-4 w-4" />
                Talk to an Expert
              </Button>
            </div>
          </motion.div>

          {/* Right: Hero visual */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.15 }}
            className="flex justify-center"
          >
            <div
              className={`w-full max-w-lg aspect-square rounded-3xl bg-gradient-to-br ${project.gradient} flex items-center justify-center shadow-2xl relative overflow-hidden`}
            >
              <div className="absolute inset-0 bg-black/10" />
              {/* Grid pattern overlay */}
              <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff08_1px,transparent_1px),linear-gradient(to_bottom,#ffffff08_1px,transparent_1px)] bg-[size:32px_32px]" />
              <div className="relative flex flex-col items-center gap-4">
                <span className="text-[120px] leading-none">{emoji}</span>
                <div className="flex flex-wrap gap-2 justify-center px-8">
                  {project.tech.slice(0, 4).map((t) => (
                    <span
                      key={t}
                      className="text-xs font-semibold px-2.5 py-1 rounded-full bg-white/20 text-white border border-white/30"
                    >
                      {t}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Screenshot Gallery */}
      <section className="relative z-10 max-w-7xl mx-auto px-6 py-16 w-full border-t border-border/40">
        <AnimatedContainer direction="up" delay={0.1}>
          <h2 className="text-2xl sm:text-3xl font-bold text-foreground mb-8 text-center">
            Project Screenshots
          </h2>
        </AnimatedContainer>

        <AnimatedContainer direction="up" delay={0.2}>
          {/* Carousel */}
          <div className="relative">
            {/* Main display */}
            <div className="relative aspect-video max-w-4xl mx-auto rounded-2xl overflow-hidden border border-border/50 bg-card shadow-2xl">
              <motion.div
                key={activeSlide}
                initial={{ opacity: 0, x: 40 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -40 }}
                transition={{ duration: 0.35 }}
                className="w-full h-full"
              >
                <ScreenshotPlaceholder
                  alt={project.screenshots[activeSlide].alt}
                  emoji={emoji}
                  gradient={project.gradient}
                  index={activeSlide}
                />
              </motion.div>

              {/* Navigation arrows */}
              {totalSlides > 1 && (
                <>
                  <button
                    id="screenshot-prev"
                    onClick={prevSlide}
                    className="absolute left-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-background/80 backdrop-blur-sm border border-border/50 shadow-lg flex items-center justify-center hover:bg-background transition-colors cursor-pointer"
                    aria-label="Previous screenshot"
                  >
                    <ChevronLeft className="h-5 w-5 text-foreground" />
                  </button>
                  <button
                    id="screenshot-next"
                    onClick={nextSlide}
                    className="absolute right-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-background/80 backdrop-blur-sm border border-border/50 shadow-lg flex items-center justify-center hover:bg-background transition-colors cursor-pointer"
                    aria-label="Next screenshot"
                  >
                    <ChevronRight className="h-5 w-5 text-foreground" />
                  </button>
                </>
              )}

              {/* Slide counter */}
              <div className="absolute bottom-3 left-1/2 -translate-x-1/2 bg-black/40 backdrop-blur-sm text-white text-xs font-semibold px-3 py-1 rounded-full">
                {activeSlide + 1} / {totalSlides}
              </div>
            </div>

            {/* Thumbnail row */}
            {totalSlides > 1 && (
              <div className="flex gap-3 mt-4 justify-center flex-wrap">
                {project.screenshots.map((_, i) => (
                  <button
                    key={i}
                    id={`screenshot-thumb-${i}`}
                    onClick={() => setActiveSlide(i)}
                    className={`w-14 h-10 rounded-lg overflow-hidden border-2 transition-all duration-200 cursor-pointer ${
                      i === activeSlide
                        ? 'border-indigo-500 scale-110 shadow-md'
                        : 'border-border/40 opacity-60 hover:opacity-100'
                    }`}
                  >
                    <div
                      className={`w-full h-full bg-gradient-to-br ${project.gradient} flex items-center justify-center`}
                    >
                      <span className="text-lg">{emoji}</span>
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>
        </AnimatedContainer>
      </section>

      {/* Project Highlights: Functionality + Tech */}
      <section className="relative z-10 max-w-7xl mx-auto px-6 py-16 w-full border-t border-border/40 grid grid-cols-1 lg:grid-cols-2 gap-12">
        {/* Functionality */}
        <AnimatedContainer direction="left" className="flex flex-col gap-6">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-indigo-500/10 border border-indigo-500/20">
              <Zap className="h-5 w-5 text-indigo-500" />
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold text-foreground">Functionality</h2>
          </div>
          <p className="text-sm text-muted-foreground leading-relaxed">
            Key features and capabilities delivered in this project — built for real users and real
            needs.
          </p>
          <ul className="flex flex-col gap-3">
            {project.functionality.map((item) => (
              <li key={item} className="flex items-start gap-3 group/feature">
                <CheckCircle2 className="h-5 w-5 text-indigo-500 mt-0.5 shrink-0 group-hover/feature:scale-110 transition-transform duration-200" />
                <span className="text-sm text-muted-foreground leading-relaxed">{item}</span>
              </li>
            ))}
          </ul>
          {/* Tags */}
          <div className="flex flex-wrap gap-2 mt-2">
            {project.tags.map((tag) => (
              <span
                key={tag}
                className={`text-xs font-semibold px-3 py-1 rounded-full ${project.colorClass} border border-current/20`}
              >
                {tag}
              </span>
            ))}
          </div>
        </AnimatedContainer>

        {/* Technology Stack */}
        <AnimatedContainer direction="right" className="flex flex-col gap-6">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-purple-500/10 border border-purple-500/20">
              <Code2 className="h-5 w-5 text-purple-500" />
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold text-foreground">Technology Stack</h2>
          </div>
          <p className="text-sm text-muted-foreground leading-relaxed">
            The tools, frameworks, and services powering this solution under the hood.
          </p>
          <ul className="flex flex-col gap-3">
            {project.technologyStack.map((item) => (
              <li key={item} className="flex items-start gap-3 group/tech">
                <CheckCircle2 className="h-5 w-5 text-purple-500 mt-0.5 shrink-0 group-hover/tech:scale-110 transition-transform duration-200" />
                <span className="text-sm text-muted-foreground leading-relaxed">{item}</span>
              </li>
            ))}
          </ul>
        </AnimatedContainer>
      </section>

      {/* Tech Pills */}
      <section className="relative z-10 max-w-7xl mx-auto px-6 py-16 w-full border-t border-border/40">
        <AnimatedContainer direction="up" delay={0.1}>
          <h2 className="text-2xl sm:text-3xl font-bold text-foreground mb-8">Technologies Used</h2>
          <div className="flex flex-wrap gap-3">
            {project.tech.map((t, idx) => (
              <motion.span
                key={t}
                initial={{ opacity: 0, scale: 0.85 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: 0.05 * idx, duration: 0.35 }}
                className={`px-4 py-2 rounded-xl text-sm font-semibold border ${project.colorClass} border-current/20 hover:scale-105 transition-transform duration-200 cursor-default`}
              >
                {t}
              </motion.span>
            ))}
          </div>
        </AnimatedContainer>
      </section>

      {/* Other Projects */}
      <section className="relative z-10 max-w-7xl mx-auto px-6 py-16 w-full border-t border-border/40">
        <AnimatedContainer direction="up" delay={0.1}>
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-2xl sm:text-3xl font-bold text-foreground">More Projects</h2>
            <Link
              href="/projects"
              className="text-sm text-indigo-500 hover:text-indigo-400 font-semibold flex items-center gap-1 group"
            >
              View All
              <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1" />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            {otherProjects.map((p, idx) => (
              <AnimatedContainer key={p.slug} direction="up" delay={0.1 + idx * 0.1}>
                <Link href={`/projects/${p.slug}`} className="block group h-full">
                  <div className="relative rounded-2xl overflow-hidden border border-border/50 bg-card/60 backdrop-blur-sm h-full flex flex-col hover:shadow-xl hover:shadow-indigo-500/10 hover:-translate-y-1 transition-all duration-300 cursor-pointer">
                    <div
                      className={`bg-gradient-to-br ${p.gradient} h-32 flex items-center justify-center relative`}
                    >
                      <div className="absolute inset-0 bg-black/10" />
                      <span className="relative text-5xl">{gradientToEmoji[p.slug]}</span>
                    </div>
                    <div className="p-5 flex flex-col gap-2">
                      <p className="text-[10px] font-bold uppercase tracking-widest text-indigo-500">
                        {p.category}
                      </p>
                      <h3 className="text-sm font-bold text-foreground group-hover:text-indigo-500 transition-colors">
                        {p.title}
                      </h3>
                      <p className="text-xs text-muted-foreground line-clamp-2">{p.description}</p>
                      <div className="flex items-center gap-1 text-xs font-semibold text-indigo-500 opacity-0 group-hover:opacity-100 transition-all duration-300 mt-1">
                        View Project
                        <ArrowRight className="h-3 w-3 transition-transform group-hover:translate-x-1" />
                      </div>
                    </div>
                  </div>
                </Link>
              </AnimatedContainer>
            ))}
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
              <h2 className="text-2xl sm:text-3xl font-extrabold text-white mb-4">
                Love what you see?{' '}
                <span
                  className={`bg-gradient-to-r ${project.gradient} bg-clip-text text-transparent`}
                >
                  Let&apos;s build yours.
                </span>
              </h2>
              <p className="text-slate-300 mb-8 max-w-xl mx-auto leading-relaxed">
                Our team is ready to scope your project and deliver a tailored solution that exceeds
                expectations.
              </p>
              <Button
                render={<Link href={`/contact?type=quote&inspiration=${project.slug}`} />}
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
