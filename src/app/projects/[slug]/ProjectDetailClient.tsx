'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import {
  ArrowLeft,
  ExternalLink,
  Tag,
  CheckCircle2,
  LayoutGrid,
  Cpu,
  Sparkles,
  TrendingUp,
  Quote,
  Star,
  Layers,
  Users,
  Calendar,
  Building2,
  ShieldAlert,
  Lightbulb,
  ArrowRight,
} from 'lucide-react';
import { AnimatedContainer } from '@/components/shared/AnimatedContainer';
import {
  parseArrayField,
  parseMetricsField,
  parseTestimonialField,
} from '@/lib/data-helpers';

interface ProjectDetailClientProps {
  data: {
    title: string;
    client: string;
    category: string;
    description: string;
    projectOverview?: string | null;
    websiteUrl?: string | null;
    features?: string | null;
    technologiesUsed?: string | null;
    gallery?: string | null;
    challenges?: string | null;
    solution?: string | null;
    results?: string | null;
    metrics?: string | null;
    testimonial?: string | null;
    servicesUsed?: string | null;
    teamMembers?: string | null;
    industry?: string | null;
    duration?: string | null;
    [key: string]: unknown;
  };
}

export default function ProjectDetailClient({ data }: ProjectDetailClientProps) {
  const {
    title,
    client,
    category,
    description,
    projectOverview,
    websiteUrl,
    features,
    technologiesUsed,
    challenges,
    solution,
    results,
    metrics,
    testimonial,
    servicesUsed,
    teamMembers,
    industry,
    duration,
  } = data;

  const galleryArray = data.gallery
    ? data.gallery.split(',').map((s) => s.trim()).filter(Boolean)
    : [];
  const coverImage = galleryArray.length > 0 ? galleryArray[0] : null;
  const gradient = 'from-indigo-500 via-purple-500 to-pink-500';

  const parsedFeatures = parseArrayField(features);
  const parsedTech = parseArrayField(technologiesUsed);
  const parsedServices = parseArrayField(servicesUsed);
  const parsedTeam = parseArrayField(teamMembers);
  const parsedMetrics = parseMetricsField(metrics);
  const parsedTestimonial = parseTestimonialField(testimonial);

  return (
    <div className="flex flex-col min-h-screen relative overflow-hidden bg-background py-12">
      {/* Dynamic ambient backdrop glows */}
      <div className="absolute top-[-10%] left-[-10%] w-[55%] h-[55%] rounded-full bg-indigo-500/10 blur-[130px] pointer-events-none" />
      <div className="absolute top-[35%] right-[-10%] w-[45%] h-[45%] rounded-full bg-purple-500/10 blur-[130px] pointer-events-none" />
      <div className="absolute bottom-[-10%] left-[20%] w-[50%] h-[50%] rounded-full bg-pink-500/10 blur-[140px] pointer-events-none" />

      {/* Floating Back Button - Magnetic effect */}
      <div className="fixed top-24 left-6 md:left-12 z-50">
        <Link href="/projects">
          <motion.div
            whileHover={{ scale: 1.05, x: -5 }}
            whileTap={{ scale: 0.95 }}
            className="flex items-center gap-2 bg-background/80 backdrop-blur-md border border-border/60 shadow-lg px-4 py-2.5 rounded-full text-sm font-semibold text-foreground transition-colors hover:bg-muted/80"
          >
            <ArrowLeft className="h-4 w-4 text-indigo-500" />
            Back to Portfolio
          </motion.div>
        </Link>
      </div>

      {/* Hero Section */}
      <section className="relative z-10 max-w-7xl mx-auto px-6 pt-24 pb-12 w-full">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Left: Text & Meta */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="flex flex-col gap-6"
          >
            {/* Badges row */}
            <div className="flex flex-wrap items-center gap-2.5">
              <span className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-bold text-indigo-500 bg-indigo-500/10 border border-indigo-500/20">
                <Tag className="h-3.5 w-3.5" />
                {category || 'Web Application'}
              </span>
              {industry && (
                <span className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-semibold text-muted-foreground bg-secondary/60 border border-border/60">
                  <Building2 className="h-3.5 w-3.5 text-purple-400" />
                  {industry}
                </span>
              )}
              {duration && (
                <span className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-semibold text-muted-foreground bg-secondary/60 border border-border/60">
                  <Calendar className="h-3.5 w-3.5 text-emerald-400" />
                  {duration}
                </span>
              )}
            </div>

            <div>
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-foreground leading-[1.15]">
                <span className={`bg-gradient-to-r ${gradient} bg-clip-text text-transparent`}>
                  {title}
                </span>
              </h1>
              <p className="text-lg text-muted-foreground mt-4 font-medium flex items-center gap-2">
                <span className="w-8 h-[1px] bg-border/80 block"></span>
                Client: <span className="text-foreground font-semibold">{client || 'Confidential Enterprise'}</span>
              </p>
            </div>

            <p className="text-base sm:text-lg text-muted-foreground leading-relaxed">
              {description}
            </p>

            {websiteUrl && (
              <div className="pt-2 flex flex-wrap gap-4">
                <a
                  href={websiteUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2.5 bg-foreground text-background px-7 py-3 rounded-full font-semibold transition-all hover:scale-105 active:scale-95 shadow-xl shadow-black/10 group"
                >
                  Visit Live Product
                  <ExternalLink className="h-4 w-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                </a>
              </div>
            )}
          </motion.div>

          {/* Right: Main Image with Floating Layer */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="relative"
          >
            <div className="relative rounded-[2rem] overflow-hidden border border-border/60 bg-card/40 backdrop-blur-sm shadow-2xl p-2.5 aspect-[4/3] flex items-center justify-center transform lg:rotate-1 hover:rotate-0 transition-transform duration-500">
              {coverImage ? (
                <div className="relative w-full h-full rounded-[1.5rem] overflow-hidden shadow-inner">
                  <Image
                    src={coverImage}
                    alt={title}
                    fill
                    className="object-cover object-top"
                    priority
                  />
                </div>
              ) : (
                <div
                  className={`w-full h-full rounded-[1.5rem] bg-gradient-to-br ${gradient} opacity-20`}
                />
              )}
            </div>
          </motion.div>
        </div>
      </section>

      {/* KPI Metrics Highlight Ribbon (If metrics present) */}
      {parsedMetrics.length > 0 && (
        <section className="relative z-10 max-w-7xl mx-auto px-6 py-6 w-full">
          <AnimatedContainer direction="up" delay={0.1}>
            <div className="rounded-3xl border border-indigo-500/20 bg-gradient-to-r from-indigo-950/40 via-card/70 to-purple-950/40 backdrop-blur-xl p-8 shadow-2xl">
              <div className="flex items-center gap-2.5 mb-6">
                <TrendingUp className="w-5 h-5 text-indigo-400" />
                <span className="text-xs font-bold uppercase tracking-wider text-indigo-400">
                  Measurable Impact & Enterprise ROI
                </span>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                {parsedMetrics.map((item, idx) => (
                  <div
                    key={idx}
                    className="flex flex-col p-4 rounded-2xl bg-background/50 border border-border/40 backdrop-blur-sm"
                  >
                    <span className="text-3xl sm:text-4xl font-extrabold bg-gradient-to-r from-indigo-400 via-purple-300 to-pink-400 bg-clip-text text-transparent">
                      {item.value}
                    </span>
                    <span className="text-xs sm:text-sm font-medium text-muted-foreground mt-1">
                      {item.label}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </AnimatedContainer>
        </section>
      )}

      {/* Main Content & Sidebar Grid */}
      <section className="relative z-10 max-w-7xl mx-auto px-6 py-12 w-full grid grid-cols-1 lg:grid-cols-3 gap-12">
        {/* Main Content Column (2 Cols) */}
        <div className="lg:col-span-2 space-y-16">
          {/* Project Overview */}
          <AnimatedContainer direction="up" delay={0.2}>
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-full bg-indigo-500/10 flex items-center justify-center">
                <LayoutGrid className="w-5 h-5 text-indigo-500" />
              </div>
              <h2 className="text-3xl font-bold text-foreground">Project Overview</h2>
            </div>
            <div className="prose prose-invert max-w-none text-muted-foreground whitespace-pre-wrap text-lg leading-relaxed">
              {projectOverview || description || 'Detailed information is currently being updated.'}
            </div>
          </AnimatedContainer>

          {/* Comparative Challenge vs Solution Cards */}
          {(challenges || solution) && (
            <AnimatedContainer direction="up" delay={0.25}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {challenges && (
                  <div className="rounded-2xl border border-red-500/20 bg-red-950/10 p-6 backdrop-blur-sm">
                    <div className="flex items-center gap-2.5 mb-3">
                      <div className="w-8 h-8 rounded-lg bg-red-500/10 flex items-center justify-center text-red-400">
                        <ShieldAlert className="w-4 h-4" />
                      </div>
                      <h3 className="text-lg font-bold text-red-200">The Challenge</h3>
                    </div>
                    <p className="text-sm sm:text-base text-muted-foreground leading-relaxed whitespace-pre-line">
                      {challenges}
                    </p>
                  </div>
                )}
                {solution && (
                  <div className="rounded-2xl border border-emerald-500/20 bg-emerald-950/10 p-6 backdrop-blur-sm">
                    <div className="flex items-center gap-2.5 mb-3">
                      <div className="w-8 h-8 rounded-lg bg-emerald-500/10 flex items-center justify-center text-emerald-400">
                        <Lightbulb className="w-4 h-4" />
                      </div>
                      <h3 className="text-lg font-bold text-emerald-200">Our Solution</h3>
                    </div>
                    <p className="text-sm sm:text-base text-muted-foreground leading-relaxed whitespace-pre-line">
                      {solution}
                    </p>
                  </div>
                )}
              </div>
            </AnimatedContainer>
          )}

          {/* Key Functionality & Features */}
          {parsedFeatures.length > 0 && (
            <AnimatedContainer direction="up" delay={0.3}>
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-full bg-purple-500/10 flex items-center justify-center">
                  <Sparkles className="w-5 h-5 text-purple-500" />
                </div>
                <h2 className="text-3xl font-bold text-foreground">Key Capabilities & Features</h2>
              </div>
              <ul className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {parsedFeatures.map((feature: string, idx: number) => (
                  <li
                    key={idx}
                    className="flex items-start gap-3 bg-card/50 border border-border/50 p-4 rounded-xl backdrop-blur-sm hover:border-border transition-colors"
                  >
                    <CheckCircle2 className="w-5 h-5 text-indigo-400 shrink-0 mt-0.5" />
                    <span className="text-foreground/90 text-sm leading-relaxed">{feature}</span>
                  </li>
                ))}
              </ul>
            </AnimatedContainer>
          )}

          {/* Results & Business Outcomes */}
          {results && (
            <AnimatedContainer direction="up" delay={0.35}>
              <div className="rounded-2xl border border-border/60 bg-card/40 p-8 backdrop-blur-sm">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-9 h-9 rounded-full bg-emerald-500/10 flex items-center justify-center">
                    <TrendingUp className="w-5 h-5 text-emerald-400" />
                  </div>
                  <h3 className="text-2xl font-bold text-foreground">Measurable Results</h3>
                </div>
                <div className="prose prose-invert max-w-none text-muted-foreground whitespace-pre-line leading-relaxed text-base">
                  {results}
                </div>
              </div>
            </AnimatedContainer>
          )}

          {/* Executive Client Testimonial */}
          {parsedTestimonial && (
            <AnimatedContainer direction="up" delay={0.4}>
              <div className="relative rounded-3xl border border-indigo-500/30 bg-gradient-to-br from-indigo-950/20 via-card/50 to-background p-8 md:p-10 backdrop-blur-xl overflow-hidden shadow-2xl">
                <Quote className="absolute right-6 top-6 w-20 h-20 text-indigo-500/10 -scale-x-100 pointer-events-none" />
                <div className="flex gap-1 mb-4 text-amber-400">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />
                  ))}
                </div>
                <blockquote className="text-lg md:text-xl font-medium text-foreground/90 italic leading-relaxed mb-6">
                  &ldquo;{parsedTestimonial.quote}&rdquo;
                </blockquote>
                <div className="flex items-center gap-3">
                  <div className="w-11 h-11 rounded-full bg-gradient-to-tr from-indigo-500 to-purple-600 flex items-center justify-center font-bold text-white shadow-md">
                    {(parsedTestimonial.author || client || 'C')[0]}
                  </div>
                  <div>
                    <div className="font-bold text-foreground">
                      {parsedTestimonial.author || `${client} Executive`}
                    </div>
                    <div className="text-xs sm:text-sm text-muted-foreground">
                      {[parsedTestimonial.role, parsedTestimonial.company || client]
                        .filter(Boolean)
                        .join(' • ')}
                    </div>
                  </div>
                </div>
              </div>
            </AnimatedContainer>
          )}

          {/* Screenshots Gallery */}
          {galleryArray.length > 1 && (
            <AnimatedContainer direction="up" delay={0.45}>
              <h2 className="text-3xl font-bold text-foreground mb-8">Visual Gallery</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {galleryArray.map((img: string, i: number) => (
                  <motion.div
                    whileHover={{ scale: 1.02 }}
                    key={i}
                    className="relative aspect-video rounded-2xl overflow-hidden border border-border/50 shadow-lg group"
                  >
                    <Image
                      src={img}
                      alt={`${title} screenshot ${i + 1}`}
                      fill
                      className="object-cover object-top transition-transform duration-700 group-hover:scale-105"
                    />
                  </motion.div>
                ))}
              </div>
            </AnimatedContainer>
          )}
        </div>

        {/* Sidebar Column */}
        <div className="space-y-8">
          <AnimatedContainer direction="left" delay={0.3}>
            <div className="sticky top-24 space-y-6">
              {/* Tech Stack & Metadata Card */}
              <div className="rounded-3xl border border-border/60 bg-card/60 backdrop-blur-xl p-7 shadow-2xl">
                <h3 className="text-lg font-bold text-foreground mb-4 flex items-center gap-2">
                  <Cpu className="w-5 h-5 text-indigo-500" /> Technology Stack
                </h3>

                {parsedTech.length > 0 ? (
                  <div className="flex flex-wrap gap-2 mb-6">
                    {parsedTech.map((tech: string, i: number) => (
                      <span
                        key={i}
                        className="px-3 py-1 bg-background/80 border border-border/60 rounded-lg text-xs font-semibold text-foreground shadow-sm"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>
                ) : (
                  <p className="text-muted-foreground text-xs mb-6">Technology stack details on file.</p>
                )}

                {/* Services Provided Badges */}
                {parsedServices.length > 0 && (
                  <>
                    <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-2.5 flex items-center gap-1.5">
                      <Layers className="w-3.5 h-3.5 text-purple-400" /> Services Delivered
                    </h4>
                    <div className="flex flex-wrap gap-1.5 mb-6">
                      {parsedServices.map((srv: string, i: number) => (
                        <span
                          key={i}
                          className="px-2.5 py-1 bg-purple-500/10 border border-purple-500/20 text-purple-300 rounded-md text-xs font-medium"
                        >
                          {srv}
                        </span>
                      ))}
                    </div>
                  </>
                )}

                {/* Team Contributors */}
                {parsedTeam.length > 0 && (
                  <>
                    <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-2.5 flex items-center gap-1.5">
                      <Users className="w-3.5 h-3.5 text-indigo-400" /> Project Team
                    </h4>
                    <div className="flex flex-wrap gap-1.5 mb-6">
                      {parsedTeam.map((member: string, i: number) => (
                        <span
                          key={i}
                          className="px-2.5 py-1 bg-indigo-500/10 border border-indigo-500/20 text-indigo-300 rounded-md text-xs font-medium"
                        >
                          {member}
                        </span>
                      ))}
                    </div>
                  </>
                )}

                <hr className="border-border/60 my-5" />

                {/* Meta details list */}
                <ul className="space-y-4 text-sm">
                  <li className="flex justify-between items-center">
                    <span className="text-muted-foreground">Client</span>
                    <span className="font-semibold text-foreground text-right">{client || 'Confidential'}</span>
                  </li>
                  <li className="flex justify-between items-center">
                    <span className="text-muted-foreground">Category</span>
                    <span className="font-semibold text-foreground text-right">{category || 'Engineering'}</span>
                  </li>
                  {industry && (
                    <li className="flex justify-between items-center">
                      <span className="text-muted-foreground">Industry</span>
                      <span className="font-semibold text-foreground text-right">{industry}</span>
                    </li>
                  )}
                  {duration && (
                    <li className="flex justify-between items-center">
                      <span className="text-muted-foreground">Timeline</span>
                      <span className="font-semibold text-foreground text-right">{duration}</span>
                    </li>
                  )}
                </ul>
              </div>

              {/* Consultation / Call to Action Card */}
              <div className="rounded-3xl border border-indigo-500/30 bg-gradient-to-br from-indigo-950/40 via-card/70 to-background p-7 backdrop-blur-xl shadow-xl">
                <h4 className="text-base font-bold text-foreground mb-2">Have a similar project?</h4>
                <p className="text-xs text-muted-foreground mb-5 leading-relaxed">
                  Let&apos;s build an enterprise-grade digital experience together. Schedule a strategy session with our technical leads.
                </p>
                <Link
                  href="/contact"
                  className="w-full inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-full bg-primary text-primary-foreground font-semibold text-sm transition-all hover:opacity-90 shadow-lg shadow-primary/20"
                >
                  Start Your Project
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>
          </AnimatedContainer>
        </div>
      </section>
    </div>
  );
}
