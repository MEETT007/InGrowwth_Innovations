'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import {
  ArrowLeft,
  Download,
  Building2,
  Cpu,
  TrendingUp,
  Target,
  Sparkles,
  Quote,
  Star,
  CheckCircle2,
  ShieldAlert,
  ArrowRight,
  Layers,
  ArrowRightLeft,
  FileText,
} from 'lucide-react';
import { CaseStudy } from '@/generated/prisma/client';
import { AnimatedContainer } from '@/components/shared/AnimatedContainer';
import {
  parseArrayField,
  parseMetricsField,
  parseTestimonialField,
} from '@/lib/data-helpers';

interface CaseStudyDetailClientProps {
  data: CaseStudy;
}

export default function CaseStudyDetailClient({ data }: CaseStudyDetailClientProps) {
  const {
    title,
    clientName,
    industry,
    coverImage,
    problemStatement,
    businessChallenges,
    objectives,
    research,
    strategy,
    solution,
    architecture,
    designProcess,
    developmentJourney,
    technologies,
    beforeVsAfter,
    kpis,
    roi,
    results,
    clientTestimonial,
    downloadPdfUrl,
    cta,
  } = data;

  const gradient = 'from-indigo-500 via-purple-500 to-pink-500';

  const parsedTech = parseArrayField(technologies);
  const parsedMetrics = parseMetricsField(kpis);
  const parsedTestimonial = parseTestimonialField(clientTestimonial);

  // Parse Before vs After
  let beforeData = '';
  let afterData = '';
  if (beforeVsAfter) {
    try {
      const parsed = JSON.parse(beforeVsAfter);
      beforeData = parsed.before || '';
      afterData = parsed.after || '';
    } catch {
      beforeData = beforeVsAfter;
    }
  }

  return (
    <div className="flex flex-col min-h-screen relative overflow-hidden bg-background py-12">
      {/* Dynamic ambient backdrop glows */}
      <div className="absolute top-[-10%] left-[-10%] w-[55%] h-[55%] rounded-full bg-indigo-500/10 blur-[140px] pointer-events-none" />
      <div className="absolute top-[35%] right-[-10%] w-[45%] h-[45%] rounded-full bg-purple-500/10 blur-[140px] pointer-events-none" />
      <div className="absolute bottom-[-10%] left-[20%] w-[50%] h-[50%] rounded-full bg-pink-500/10 blur-[150px] pointer-events-none" />

      {/* Floating Back Button */}
      <div className="fixed top-24 left-6 md:left-12 z-50">
        <Link href="/portfolio">
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
          {/* Left Text */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="flex flex-col gap-6"
          >
            {/* Meta Row */}
            <div className="flex flex-wrap items-center gap-2.5">
              <span className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-bold text-indigo-400 bg-indigo-500/10 border border-indigo-500/20">
                <Target className="h-3.5 w-3.5" />
                Case Study
              </span>
              {industry && (
                <span className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-semibold text-muted-foreground bg-secondary/60 border border-border/60">
                  <Building2 className="h-3.5 w-3.5 text-purple-400" />
                  {industry}
                </span>
              )}
            </div>

            <div>
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-foreground leading-[1.12]">
                <span className={`bg-gradient-to-r ${gradient} bg-clip-text text-transparent`}>
                  {title}
                </span>
              </h1>
              <p className="text-lg text-muted-foreground mt-4 font-medium flex items-center gap-2">
                <span className="w-8 h-[1px] bg-border/80 block"></span>
                Client: <span className="text-foreground font-semibold">{clientName || 'Confidential Enterprise'}</span>
              </p>
            </div>

            <p className="text-base sm:text-lg text-muted-foreground leading-relaxed">
              {problemStatement || 'Enterprise technical transformation study by InGrowwth Innovations.'}
            </p>

            {/* Action buttons */}
            <div className="pt-2 flex flex-wrap gap-4">
              {downloadPdfUrl && (
                <a
                  href={downloadPdfUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-secondary hover:bg-secondary/80 text-foreground font-semibold text-sm transition-all border border-border/60 shadow-sm"
                >
                  <Download className="w-4 h-4 text-indigo-400" /> Download Whitepaper PDF
                </a>
              )}
              <Link
                href="/contact"
                className="inline-flex items-center gap-2 px-7 py-3 rounded-full bg-primary text-primary-foreground font-semibold text-sm transition-all hover:scale-105 shadow-xl shadow-primary/20"
              >
                {cta || 'Request Architecture Review'}
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </motion.div>

          {/* Right Cover Image */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="relative"
          >
            <div className="relative rounded-[2.5rem] overflow-hidden border border-border/60 bg-card/40 backdrop-blur-sm shadow-2xl p-3 aspect-[4/3] flex items-center justify-center transform lg:rotate-1 hover:rotate-0 transition-transform duration-500">
              {coverImage ? (
                <div className="relative w-full h-full rounded-[2rem] overflow-hidden shadow-inner">
                  <Image
                    src={coverImage}
                    alt={title}
                    fill
                    className="object-cover object-top"
                    priority
                  />
                </div>
              ) : (
                <div className={`w-full h-full rounded-[2rem] bg-gradient-to-br ${gradient} opacity-20`} />
              )}
            </div>
          </motion.div>
        </div>
      </section>

      {/* KPI Highlights Ribbon */}
      {parsedMetrics.length > 0 && (
        <section className="relative z-10 max-w-7xl mx-auto px-6 py-6 w-full">
          <AnimatedContainer direction="up" delay={0.1}>
            <div className="rounded-3xl border border-indigo-500/20 bg-gradient-to-r from-indigo-950/40 via-card/70 to-purple-950/40 backdrop-blur-xl p-8 shadow-2xl">
              <div className="flex items-center gap-2.5 mb-6">
                <TrendingUp className="w-5 h-5 text-indigo-400" />
                <span className="text-xs font-bold uppercase tracking-wider text-indigo-400">
                  Targeted & Verified Impact Metrics
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

      {/* Main Study Body & Sidebar */}
      <section className="relative z-10 max-w-7xl mx-auto px-6 py-12 w-full grid grid-cols-1 lg:grid-cols-3 gap-12">
        {/* Main 2-column Content */}
        <div className="lg:col-span-2 space-y-16">
          {/* Phase 1: Problem Space & Business Challenges */}
          {(businessChallenges || objectives) && (
            <AnimatedContainer direction="up" delay={0.2}>
              <div className="space-y-6">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-2xl bg-red-500/10 flex items-center justify-center text-red-400">
                    <ShieldAlert className="w-5 h-5" />
                  </div>
                  <h2 className="text-3xl font-bold text-foreground">The Business Challenge</h2>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {businessChallenges && (
                    <div className="rounded-2xl border border-red-500/20 bg-red-950/10 p-6 backdrop-blur-sm">
                      <h3 className="text-base font-bold text-red-200 mb-2">Core Roadblocks</h3>
                      <p className="text-sm text-muted-foreground whitespace-pre-line leading-relaxed">
                        {businessChallenges}
                      </p>
                    </div>
                  )}
                  {objectives && (
                    <div className="rounded-2xl border border-indigo-500/20 bg-indigo-950/10 p-6 backdrop-blur-sm">
                      <h3 className="text-base font-bold text-indigo-200 mb-2">Key Objectives</h3>
                      <p className="text-sm text-muted-foreground whitespace-pre-line leading-relaxed">
                        {objectives}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </AnimatedContainer>
          )}

          {/* Phase 2: Strategy & The Engineered Solution */}
          {(strategy || solution) && (
            <AnimatedContainer direction="up" delay={0.25}>
              <div className="space-y-6">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-2xl bg-purple-500/10 flex items-center justify-center text-purple-400">
                    <Sparkles className="w-5 h-5" />
                  </div>
                  <h2 className="text-3xl font-bold text-foreground">Strategy & Execution</h2>
                </div>

                {strategy && (
                  <div className="p-7 rounded-2xl border border-border/60 bg-card/40 backdrop-blur-sm">
                    <h3 className="text-lg font-bold text-foreground mb-3">Architectural Strategy</h3>
                    <p className="text-muted-foreground whitespace-pre-line leading-relaxed text-base">
                      {strategy}
                    </p>
                  </div>
                )}

                {solution && (
                  <div className="p-7 rounded-2xl border border-emerald-500/20 bg-emerald-950/10 backdrop-blur-sm">
                    <h3 className="text-lg font-bold text-emerald-200 mb-3">The Delivered Solution</h3>
                    <p className="text-muted-foreground whitespace-pre-line leading-relaxed text-base">
                      {solution}
                    </p>
                  </div>
                )}
              </div>
            </AnimatedContainer>
          )}

          {/* Phase 3: System Architecture Blueprint */}
          {architecture && (
            <AnimatedContainer direction="up" delay={0.3}>
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-2xl bg-indigo-500/10 flex items-center justify-center text-indigo-400">
                    <Cpu className="w-5 h-5" />
                  </div>
                  <h2 className="text-3xl font-bold text-foreground">Technical Architecture</h2>
                </div>
                <div className="p-8 rounded-3xl border border-border/60 bg-card/60 backdrop-blur-xl">
                  <p className="text-foreground/90 whitespace-pre-line leading-relaxed text-base">
                    {architecture}
                  </p>
                </div>
              </div>
            </AnimatedContainer>
          )}

          {/* Phase 4: Before vs After Comparison */}
          {(beforeData || afterData) && (
            <AnimatedContainer direction="up" delay={0.35}>
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-2xl bg-amber-500/10 flex items-center justify-center text-amber-400">
                    <ArrowRightLeft className="w-5 h-5" />
                  </div>
                  <h2 className="text-3xl font-bold text-foreground">Transformation Impact: Before vs After</h2>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {beforeData && (
                    <div className="p-6 rounded-2xl border border-red-500/30 bg-red-950/15 backdrop-blur-sm">
                      <span className="text-xs font-bold uppercase tracking-wider text-red-400 block mb-2">
                        Before / Legacy Architecture
                      </span>
                      <p className="text-sm text-red-200/80 whitespace-pre-line leading-relaxed">
                        {beforeData}
                      </p>
                    </div>
                  )}
                  {afterData && (
                    <div className="p-6 rounded-2xl border border-emerald-500/30 bg-emerald-950/15 backdrop-blur-sm">
                      <span className="text-xs font-bold uppercase tracking-wider text-emerald-400 block mb-2">
                        After / Modernized InGrowwth Platform
                      </span>
                      <p className="text-sm text-emerald-200/90 whitespace-pre-line leading-relaxed">
                        {afterData}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </AnimatedContainer>
          )}

          {/* Phase 5: Business Results & Measurable ROI */}
          {(results || roi) && (
            <AnimatedContainer direction="up" delay={0.4}>
              <div className="space-y-6">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-2xl bg-emerald-500/10 flex items-center justify-center text-emerald-400">
                    <CheckCircle2 className="w-5 h-5" />
                  </div>
                  <h2 className="text-3xl font-bold text-foreground">Measurable Results & ROI</h2>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {results && (
                    <div className="p-7 rounded-2xl border border-border/60 bg-card/40 backdrop-blur-sm">
                      <h3 className="text-base font-bold text-foreground mb-2">Operational Outcomes</h3>
                      <p className="text-sm text-muted-foreground whitespace-pre-line leading-relaxed">
                        {results}
                      </p>
                    </div>
                  )}
                  {roi && (
                    <div className="p-7 rounded-2xl border border-emerald-500/30 bg-emerald-950/10 backdrop-blur-sm">
                      <h3 className="text-base font-bold text-emerald-300 mb-2">Financial & Resource ROI</h3>
                      <p className="text-sm text-emerald-200/90 whitespace-pre-line leading-relaxed">
                        {roi}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </AnimatedContainer>
          )}

          {/* Executive Client Testimonial */}
          {parsedTestimonial && (
            <AnimatedContainer direction="up" delay={0.45}>
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
                    {(parsedTestimonial.author || clientName || 'E')[0]}
                  </div>
                  <div>
                    <div className="font-bold text-foreground">
                      {parsedTestimonial.author || `${clientName} Executive`}
                    </div>
                    <div className="text-xs sm:text-sm text-muted-foreground">
                      {[parsedTestimonial.role, parsedTestimonial.company || clientName]
                        .filter(Boolean)
                        .join(' • ')}
                    </div>
                  </div>
                </div>
              </div>
            </AnimatedContainer>
          )}
        </div>

        {/* Sticky Sidebar */}
        <div className="space-y-8">
          <AnimatedContainer direction="left" delay={0.3}>
            <div className="sticky top-24 space-y-6">
              {/* Tech Stack & Meta Card */}
              <div className="rounded-3xl border border-border/60 bg-card/60 backdrop-blur-xl p-7 shadow-2xl">
                <h3 className="text-lg font-bold text-foreground mb-4 flex items-center gap-2">
                  <Cpu className="w-5 h-5 text-indigo-500" /> Technologies Used
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
                  <p className="text-muted-foreground text-xs mb-6">Technologies details on file.</p>
                )}

                <hr className="border-border/60 my-5" />

                <ul className="space-y-4 text-sm">
                  <li className="flex justify-between items-center">
                    <span className="text-muted-foreground">Client</span>
                    <span className="font-semibold text-foreground text-right">{clientName || 'Confidential'}</span>
                  </li>
                  {industry && (
                    <li className="flex justify-between items-center">
                      <span className="text-muted-foreground">Industry</span>
                      <span className="font-semibold text-foreground text-right">{industry}</span>
                    </li>
                  )}
                  <li className="flex justify-between items-center">
                    <span className="text-muted-foreground">Engagement</span>
                    <span className="font-semibold text-foreground text-right">Enterprise Engineering</span>
                  </li>
                </ul>
              </div>

              {/* Whitepaper Download Card */}
              {downloadPdfUrl && (
                <div className="rounded-3xl border border-border/60 bg-card/60 backdrop-blur-xl p-6 shadow-xl flex flex-col gap-3">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-2xl bg-indigo-500/10 flex items-center justify-center text-indigo-400">
                      <FileText className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-foreground">Executive Whitepaper</h4>
                      <p className="text-xs text-muted-foreground">Download PDF version for offline review</p>
                    </div>
                  </div>
                  <a
                    href={downloadPdfUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-full bg-secondary hover:bg-secondary/80 text-foreground font-semibold text-xs transition-colors border border-border/60 mt-1"
                  >
                    <Download className="w-3.5 h-3.5" /> Download PDF Document
                  </a>
                </div>
              )}

              {/* Consultation Card */}
              <div className="rounded-3xl border border-indigo-500/30 bg-gradient-to-br from-indigo-950/40 via-card/70 to-background p-7 backdrop-blur-xl shadow-xl">
                <h4 className="text-base font-bold text-foreground mb-2">Facing Similar Scalability Roadblocks?</h4>
                <p className="text-xs text-muted-foreground mb-5 leading-relaxed">
                  Our principal enterprise architects can evaluate your existing infrastructure and formulate a bespoke migration plan.
                </p>
                <Link
                  href="/contact"
                  className="w-full inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-full bg-primary text-primary-foreground font-semibold text-sm transition-all hover:opacity-90 shadow-lg shadow-primary/20"
                >
                  Schedule Technical Review
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
