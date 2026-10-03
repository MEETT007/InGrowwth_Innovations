'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import {
  ArrowRight,
  TrendingUp,
  Building2,
  Sparkles,
  Layers,
  ChevronRight,
  FileText,
  Target,
  Search,
} from 'lucide-react';
import { CaseStudy } from '@/generated/prisma/client';
import { AnimatedContainer } from '@/components/shared/AnimatedContainer';
import { parseMetricsField, parseArrayField } from '@/lib/data-helpers';

interface CaseStudiesClientProps {
  initialCaseStudies: CaseStudy[];
}

export default function CaseStudiesClient({ initialCaseStudies }: CaseStudiesClientProps) {
  const [selectedIndustry, setSelectedIndustry] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState('');

  // Extract unique industries
  const industries = [
    'All',
    ...Array.from(
      new Set(
        initialCaseStudies
          .map((cs) => cs.industry)
          .filter((ind): ind is string => Boolean(ind))
      )
    ),
  ];

  const filteredStudies = initialCaseStudies.filter((cs) => {
    const matchesIndustry =
      selectedIndustry === 'All' ||
      (cs.industry && cs.industry.toLowerCase() === selectedIndustry.toLowerCase());
    const matchesSearch =
      !searchQuery.trim() ||
      cs.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (cs.clientName && cs.clientName.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (cs.problemStatement && cs.problemStatement.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesIndustry && matchesSearch;
  });

  const featuredStudy = filteredStudies.length > 0 ? filteredStudies[0] : null;
  const remainingStudies = filteredStudies.length > 1 ? filteredStudies.slice(1) : [];

  return (
    <div className="flex flex-col min-h-screen relative overflow-hidden bg-background py-16">
      {/* Dynamic ambient backdrop glows */}
      <div className="absolute top-[-10%] left-[-10%] w-[55%] h-[55%] rounded-full bg-indigo-500/10 blur-[140px] pointer-events-none" />
      <div className="absolute top-[40%] right-[-10%] w-[45%] h-[45%] rounded-full bg-purple-500/10 blur-[140px] pointer-events-none" />
      <div className="absolute bottom-[-10%] left-[20%] w-[50%] h-[50%] rounded-full bg-pink-500/10 blur-[150px] pointer-events-none" />

      {/* Hero Section */}
      <section className="relative z-10 max-w-7xl mx-auto px-6 pt-20 pb-12 w-full text-center">
        <AnimatedContainer direction="up" delay={0.1}>
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-xs font-bold uppercase tracking-wider mb-6">
            <Sparkles className="w-3.5 h-3.5" /> Proven Engineering Excellence
          </div>
          <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold tracking-tight text-foreground leading-[1.1] max-w-4xl mx-auto">
            Transformations Built for{' '}
            <span className="bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
              Global Scale
            </span>
          </h1>
          <p className="text-lg sm:text-xl text-muted-foreground mt-6 max-w-2xl mx-auto leading-relaxed">
            Examine in-depth technical architectures, operational KPIs, and enterprise outcomes engineered by InGrowwth Innovations.
          </p>
        </AnimatedContainer>

        {/* Filter and Search Bar */}
        <AnimatedContainer direction="up" delay={0.2}>
          <div className="mt-12 flex flex-col sm:flex-row items-center justify-between gap-4 max-w-4xl mx-auto p-2 bg-card/60 border border-border/60 rounded-2xl backdrop-blur-xl shadow-xl">
            {/* Industry Pills */}
            <div className="flex items-center gap-1.5 overflow-x-auto w-full sm:w-auto p-1 scrollbar-none">
              {industries.map((ind) => (
                <button
                  key={ind}
                  onClick={() => setSelectedIndustry(ind)}
                  className={`px-4 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
                    selectedIndustry === ind
                      ? 'bg-primary text-primary-foreground shadow-md'
                      : 'text-muted-foreground hover:text-foreground hover:bg-muted/50'
                  }`}
                >
                  {ind}
                </button>
              ))}
            </div>

            {/* Search Input */}
            <div className="relative w-full sm:w-64">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <input
                type="text"
                placeholder="Search case studies..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-4 py-2 rounded-xl bg-background/80 border border-border/60 text-xs text-foreground placeholder:text-muted-foreground/60 focus:outline-none focus:ring-1 focus:ring-indigo-500"
              />
            </div>
          </div>
        </AnimatedContainer>
      </section>

      {/* Flagship Featured Study Hero */}
      {featuredStudy && (
        <section className="relative z-10 max-w-7xl mx-auto px-6 py-6 w-full">
          <AnimatedContainer direction="up" delay={0.25}>
            <div className="relative rounded-[2.5rem] overflow-hidden border border-border/60 bg-gradient-to-br from-card/80 via-card/50 to-background backdrop-blur-2xl shadow-2xl p-8 lg:p-12 group">
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
                {/* Left Details (7 cols) */}
                <div className="lg:col-span-7 flex flex-col gap-5">
                  <div className="flex flex-wrap items-center gap-2.5">
                    <span className="px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-xs font-bold">
                      Flagship Case Study
                    </span>
                    {featuredStudy.industry && (
                      <span className="px-3 py-1 rounded-full bg-secondary/60 border border-border/60 text-muted-foreground text-xs font-semibold flex items-center gap-1.5">
                        <Building2 className="w-3.5 h-3.5 text-purple-400" />
                        {featuredStudy.industry}
                      </span>
                    )}
                    <span className="text-xs text-muted-foreground">
                      Client: <strong className="text-foreground">{featuredStudy.clientName || 'Confidential'}</strong>
                    </span>
                  </div>

                  <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-foreground tracking-tight leading-tight">
                    {featuredStudy.title}
                  </h2>

                  <p className="text-base text-muted-foreground line-clamp-3 leading-relaxed">
                    {featuredStudy.problemStatement ||
                      featuredStudy.solution ||
                      'Discover how our team engineered mission-critical architecture to resolve complex operational bottlenecks.'}
                  </p>

                  {/* Highlights Bar */}
                  {parseMetricsField(featuredStudy.kpis).length > 0 && (
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 pt-2">
                      {parseMetricsField(featuredStudy.kpis)
                        .slice(0, 3)
                        .map((metric, i) => (
                          <div
                            key={i}
                            className="p-3 rounded-xl bg-background/50 border border-border/50 backdrop-blur-sm"
                          >
                            <span className="text-xl sm:text-2xl font-black bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent">
                              {metric.value}
                            </span>
                            <span className="text-[11px] block font-medium text-muted-foreground truncate mt-0.5">
                              {metric.label}
                            </span>
                          </div>
                        ))}
                    </div>
                  )}

                  <div className="pt-3">
                    <Link
                      href={`/case-studies/${featuredStudy.slug}`}
                      className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-primary text-primary-foreground font-semibold text-sm transition-all hover:scale-105 shadow-xl shadow-primary/20 group/btn"
                    >
                      Read Deep Dive Study
                      <ArrowRight className="w-4 h-4 transition-transform group-hover/btn:translate-x-1" />
                    </Link>
                  </div>
                </div>

                {/* Right Image (5 cols) */}
                <div className="lg:col-span-5 relative aspect-[4/3] rounded-2xl overflow-hidden border border-border/60 bg-muted/30 shadow-inner">
                  {featuredStudy.coverImage ? (
                    <Image
                      src={featuredStudy.coverImage}
                      alt={featuredStudy.title}
                      fill
                      className="object-cover transition-transform duration-700 group-hover:scale-105"
                      priority
                    />
                  ) : (
                    <div className="w-full h-full bg-gradient-to-tr from-indigo-950/60 via-purple-950/40 to-card flex items-center justify-center p-8 text-center">
                      <Target className="w-16 h-16 text-indigo-400/40" />
                    </div>
                  )}
                </div>
              </div>
            </div>
          </AnimatedContainer>
        </section>
      )}

      {/* Case Studies Grid */}
      <section className="relative z-10 max-w-7xl mx-auto px-6 py-12 w-full">
        {filteredStudies.length === 0 ? (
          <div className="text-center py-20 bg-card/30 border border-border/50 rounded-3xl backdrop-blur-sm max-w-2xl mx-auto p-8">
            <FileText className="w-12 h-12 text-muted-foreground/40 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-foreground">No Case Studies Found</h3>
            <p className="text-sm text-muted-foreground mt-2">
              No published case studies match your current filter criteria. Check back soon as new enterprise studies are published regularly.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {remainingStudies.map((study, idx) => {
              const kpiItems = parseMetricsField(study.kpis);
              const techItems = parseArrayField(study.technologies);

              return (
                <AnimatedContainer key={study.id} direction="up" delay={0.1 + idx * 0.05}>
                  <Link
                    href={`/case-studies/${study.slug}`}
                    className="flex flex-col h-full rounded-3xl border border-border/60 bg-card/60 hover:bg-card/90 backdrop-blur-xl overflow-hidden transition-all duration-300 hover:border-indigo-500/40 hover:-translate-y-1 hover:shadow-2xl hover:shadow-indigo-500/10 group"
                  >
                    {/* Card Thumbnail */}
                    <div className="relative aspect-[16/9] w-full overflow-hidden bg-muted/40">
                      {study.coverImage ? (
                        <Image
                          src={study.coverImage}
                          alt={study.title}
                          fill
                          className="object-cover transition-transform duration-500 group-hover:scale-105"
                        />
                      ) : (
                        <div className="w-full h-full bg-gradient-to-br from-indigo-900/30 to-purple-900/20 flex items-center justify-center">
                          <Layers className="w-10 h-10 text-indigo-400/40" />
                        </div>
                      )}

                      {/* Industry pill overlay */}
                      {study.industry && (
                        <span className="absolute top-4 left-4 px-3 py-1 rounded-full bg-background/80 backdrop-blur-md border border-border/60 text-[11px] font-bold text-foreground">
                          {study.industry}
                        </span>
                      )}
                    </div>

                    {/* Card Body */}
                    <div className="p-6 flex flex-col flex-1 justify-between gap-4">
                      <div>
                        <div className="text-xs font-semibold text-muted-foreground mb-1.5 flex items-center justify-between">
                          <span>{study.clientName || 'Enterprise Partner'}</span>
                        </div>

                        <h3 className="text-xl font-bold text-foreground group-hover:text-indigo-400 transition-colors line-clamp-2">
                          {study.title}
                        </h3>

                        <p className="text-sm text-muted-foreground mt-2 line-clamp-2 leading-relaxed">
                          {study.problemStatement ||
                            study.solution ||
                            'Deep dive architecture study covering requirements, implementation, and ROI.'}
                        </p>
                      </div>

                      {/* KPI Highlight Strip */}
                      {kpiItems.length > 0 && (
                        <div className="pt-2 border-t border-border/40 flex items-center justify-between">
                          <div>
                            <span className="text-lg font-black text-indigo-400">
                              {kpiItems[0].value}
                            </span>
                            <span className="text-[11px] block text-muted-foreground">
                              {kpiItems[0].label}
                            </span>
                          </div>
                          {kpiItems.length > 1 && (
                            <div className="text-right">
                              <span className="text-lg font-black text-purple-400">
                                {kpiItems[1].value}
                              </span>
                              <span className="text-[11px] block text-muted-foreground">
                                {kpiItems[1].label}
                              </span>
                            </div>
                          )}
                        </div>
                      )}

                      {/* Tech stack badges */}
                      {techItems.length > 0 && (
                        <div className="flex flex-wrap gap-1.5 pt-1">
                          {techItems.slice(0, 3).map((tech, i) => (
                            <span
                              key={i}
                              className="px-2 py-0.5 rounded-md bg-secondary/80 text-[10px] font-medium text-muted-foreground"
                            >
                              {tech}
                            </span>
                          ))}
                          {techItems.length > 3 && (
                            <span className="px-1.5 py-0.5 text-[10px] text-muted-foreground">
                              +{techItems.length - 3}
                            </span>
                          )}
                        </div>
                      )}

                      {/* Card Footer */}
                      <div className="pt-2 flex items-center gap-1.5 text-xs font-bold text-indigo-400 group-hover:translate-x-1 transition-transform">
                        Explore Case Study <ChevronRight className="w-3.5 h-3.5" />
                      </div>
                    </div>
                  </Link>
                </AnimatedContainer>
              );
            })}
          </div>
        )}
      </section>

      {/* Enterprise Consultation CTA Banner */}
      <section className="relative z-10 max-w-7xl mx-auto px-6 py-12 w-full">
        <AnimatedContainer direction="up" delay={0.2}>
          <div className="rounded-[2.5rem] border border-indigo-500/30 bg-gradient-to-br from-indigo-950/60 via-card/80 to-purple-950/50 p-10 lg:p-14 backdrop-blur-2xl shadow-2xl flex flex-col md:flex-row items-center justify-between gap-8 text-center md:text-left">
            <div className="max-w-2xl space-y-3">
              <span className="text-xs font-bold uppercase tracking-wider text-indigo-400">
                Ready for Enterprise Scale?
              </span>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-foreground">
                Engineered for High-Stakes Complexity.
              </h2>
              <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">
                Connect with our principal architects to review your system topology, audit bottlenecks, and map out your modernization roadmap.
              </p>
            </div>
            <Link
              href="/contact"
              className="inline-flex items-center gap-2 px-8 py-3.5 rounded-full bg-primary text-primary-foreground font-semibold text-sm transition-all hover:scale-105 shadow-xl shadow-primary/25 shrink-0"
            >
              Request Architecture Consultation
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </AnimatedContainer>
      </section>
    </div>
  );
}
