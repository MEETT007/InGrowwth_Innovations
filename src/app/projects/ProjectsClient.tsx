'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ArrowRight,
  Sparkles,
  Search,
  Layers,
  Smartphone,
  Code,
  Cpu,
  Filter,
  ExternalLink,
} from 'lucide-react';
import { AnimatedContainer } from '@/components/shared/AnimatedContainer';
import { SectionHeader } from '@/components/shared/SectionHeader';
import { Button } from '@/components/ui/button';
import { projects } from '@/lib/mock-data';

const CATEGORIES = ['All', 'Web Development', 'Mobile App', 'IoT & AI'];

const categoryIcons: Record<string, React.ReactNode> = {
  All: <Layers className="h-4 w-4" />,
  'Web Development': <Code className="h-4 w-4" />,
  'Mobile App': <Smartphone className="h-4 w-4" />,
  'IoT & AI': <Cpu className="h-4 w-4" />,
};

const placeholderColors: Record<string, string> = {
  'from-violet-600 to-indigo-600': '#6d28d9',
  'from-emerald-500 to-teal-600': '#059669',
  'from-orange-500 to-amber-600': '#ea580c',
  'from-sky-500 to-blue-600': '#0284c7',
  'from-pink-500 to-rose-600': '#e11d48',
  'from-teal-500 to-cyan-600': '#0d9488',
  'from-amber-500 to-orange-600': '#d97706',
  'from-yellow-600 to-amber-700': '#ca8a04',
};

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

export default function ProjectsClient() {
  const [activeCategory, setActiveCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');

  const filtered = useMemo(() => {
    return projects.filter((p) => {
      const matchCat = activeCategory === 'All' || p.category === activeCategory;
      const q = searchQuery.toLowerCase();
      const matchSearch =
        !q ||
        p.title.toLowerCase().includes(q) ||
        p.description.toLowerCase().includes(q) ||
        p.tags.some((t) => t.toLowerCase().includes(q)) ||
        p.tech.some((t) => t.toLowerCase().includes(q));
      return matchCat && matchSearch;
    });
  }, [activeCategory, searchQuery]);

  const featuredProjects = projects.filter((p) => p.featured);

  return (
    <div className="flex flex-col min-h-screen relative overflow-hidden bg-background py-12">
      {/* Background glow effects */}
      <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] rounded-full bg-indigo-500/10 blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] rounded-full bg-pink-500/10 blur-[120px] pointer-events-none" />
      <div className="absolute top-[40%] right-[5%] w-[30%] h-[30%] rounded-full bg-purple-500/5 blur-[150px] pointer-events-none" />

      {/* Hero */}
      <section className="relative z-10 max-w-7xl mx-auto px-6 pt-16 pb-8 w-full text-center">
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-600 dark:text-indigo-400 text-xs font-semibold uppercase tracking-wider mb-6"
        >
          <Sparkles className="h-3.5 w-3.5" />
          Case Studies
        </motion.div>
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-foreground mb-6"
        >
          Work That Speaks{' '}
          <span className="bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 bg-clip-text text-transparent">
            For Itself
          </span>
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="text-base sm:text-lg text-muted-foreground max-w-3xl mx-auto leading-relaxed"
        >
          Proven solutions across web, mobile, IoT, and AI — each project a testament to our
          commitment to quality, innovation, and measurable impact.
        </motion.p>

        {/* Stats row */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="flex flex-wrap items-center justify-center gap-8 mt-10"
        >
          {[
            { label: 'Projects Delivered', value: '8+' },
            { label: 'Happy Clients', value: '20+' },
            { label: 'Technologies Used', value: '30+' },
            { label: 'Years Experience', value: '3+' },
          ].map((stat) => (
            <div key={stat.label} className="flex flex-col items-center">
              <span className="text-3xl font-extrabold bg-gradient-to-r from-indigo-500 to-purple-500 bg-clip-text text-transparent">
                {stat.value}
              </span>
              <span className="text-xs text-muted-foreground font-medium mt-0.5">{stat.label}</span>
            </div>
          ))}
        </motion.div>
      </section>

      {/* Featured Projects */}
      <section className="relative z-10 max-w-7xl mx-auto px-6 py-12 w-full">
        <AnimatedContainer direction="up" delay={0.1}>
          <SectionHeader
            title="Featured Case Studies"
            subtitle="Spotlight"
            description="Our most impactful work — deep dives into the problems we solved and how we solved them."
          />
        </AnimatedContainer>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-6">
          {featuredProjects.map((project, idx) => (
            <AnimatedContainer key={project.slug} direction="up" delay={0.1 + idx * 0.1}>
              <Link href={`/projects/${project.slug}`} className="block group h-full">
                <div className="relative rounded-2xl overflow-hidden border border-border/50 bg-card/60 backdrop-blur-sm h-full flex flex-col hover:shadow-2xl hover:shadow-indigo-500/10 hover:-translate-y-1 transition-all duration-300">
                  {/* Color header */}
                  <div
                    className={`bg-gradient-to-br ${project.gradient} h-48 flex items-center justify-center relative overflow-hidden`}
                  >
                    <div className="absolute inset-0 bg-black/10" />
                    <div className="relative text-center">
                      <span className="text-6xl">{gradientToEmoji[project.slug]}</span>
                      <div className="mt-2 flex flex-wrap gap-1.5 justify-center px-4">
                        {project.tags.slice(0, 2).map((tag) => (
                          <span
                            key={tag}
                            className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-white/20 text-white border border-white/30"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    </div>
                    {/* Featured badge */}
                    <div className="absolute top-3 right-3 bg-white/90 text-gray-800 text-[10px] font-bold px-2 py-0.5 rounded-full">
                      ⭐ Featured
                    </div>
                  </div>

                  <div className="p-6 flex flex-col flex-grow gap-3">
                    <div>
                      <h3 className="text-xl font-bold text-foreground group-hover:text-indigo-500 transition-colors duration-200">
                        {project.title}
                      </h3>
                      <p className="text-xs text-muted-foreground font-medium mt-0.5">
                        {project.tagline}
                      </p>
                    </div>
                    <p className="text-sm text-muted-foreground leading-relaxed flex-grow line-clamp-3">
                      {project.description}
                    </p>
                    <div className="flex flex-wrap gap-1.5 mt-1">
                      {project.tech.slice(0, 4).map((t) => (
                        <span
                          key={t}
                          className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-muted/60 border border-border/40 text-muted-foreground"
                        >
                          {t}
                        </span>
                      ))}
                    </div>
                    <div className="flex items-center gap-1.5 text-sm font-semibold text-indigo-500 opacity-0 group-hover:opacity-100 transition-all duration-300 -translate-y-1 group-hover:translate-y-0 mt-1">
                      View Case Study
                      <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                    </div>
                  </div>
                </div>
              </Link>
            </AnimatedContainer>
          ))}
        </div>
      </section>

      {/* All Projects with filters */}
      <section className="relative z-10 max-w-7xl mx-auto px-6 py-12 w-full border-t border-border/40">
        <AnimatedContainer direction="up" delay={0.1}>
          <SectionHeader
            title="All Projects"
            subtitle="Portfolio"
            description="Browse our complete portfolio across all domains and technology stacks."
          />
        </AnimatedContainer>

        {/* Search + Filters */}
        <AnimatedContainer direction="up" delay={0.15} className="mb-10">
          <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
            {/* Search */}
            <div className="relative w-full sm:max-w-xs">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <input
                id="project-search"
                type="text"
                placeholder="Search projects or tech..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-border/50 bg-muted/30 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-indigo-500/40 focus:border-indigo-500/50 transition-all"
              />
            </div>

            {/* Category tabs */}
            <div className="flex items-center gap-2 flex-wrap justify-center">
              <Filter className="h-4 w-4 text-muted-foreground shrink-0" />
              {CATEGORIES.map((cat) => (
                <button
                  key={cat}
                  id={`filter-${cat.toLowerCase().replace(/\s+/g, '-').replace(/&/g, 'and')}`}
                  onClick={() => setActiveCategory(cat)}
                  className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all duration-200 ${
                    activeCategory === cat
                      ? 'bg-indigo-500 text-white shadow-md shadow-indigo-500/30'
                      : 'bg-muted/50 text-muted-foreground hover:bg-muted hover:text-foreground border border-border/40'
                  }`}
                >
                  {categoryIcons[cat]}
                  {cat}
                </button>
              ))}
            </div>
          </div>
        </AnimatedContainer>

        {/* Projects Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          <AnimatePresence mode="popLayout">
            {filtered.length === 0 ? (
              <motion.div
                key="empty"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="col-span-full text-center py-20 text-muted-foreground"
              >
                <span className="text-5xl mb-4 block">🔍</span>
                <p className="text-lg font-medium">No projects found</p>
                <p className="text-sm mt-1">Try a different search or category filter</p>
              </motion.div>
            ) : (
              filtered.map((project, idx) => (
                <motion.div
                  key={project.slug}
                  layout
                  initial={{ opacity: 0, scale: 0.95, y: 20 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ duration: 0.35, delay: idx * 0.05 }}
                >
                  <Link href={`/projects/${project.slug}`} className="block group h-full">
                    <div className="relative rounded-2xl overflow-hidden border border-border/50 bg-card/60 backdrop-blur-sm h-full flex flex-col hover:shadow-xl hover:shadow-indigo-500/10 hover:-translate-y-1 transition-all duration-300 cursor-pointer">
                      {/* Top accent line */}
                      <div
                        className={`absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r ${project.gradient} opacity-0 group-hover:opacity-100 transition-opacity duration-300`}
                      />

                      {/* Thumbnail */}
                      <div
                        className={`bg-gradient-to-br ${project.gradient} h-36 flex items-center justify-center relative overflow-hidden`}
                      >
                        <div className="absolute inset-0 bg-black/10" />
                        <span className="relative text-5xl">{gradientToEmoji[project.slug]}</span>
                        {project.featured && (
                          <div className="absolute top-2 right-2 bg-white/90 text-gray-700 text-[9px] font-bold px-1.5 py-0.5 rounded-full">
                            ⭐
                          </div>
                        )}
                      </div>

                      {/* Content */}
                      <div className="p-5 flex flex-col flex-grow gap-2.5">
                        <div>
                          <p className="text-[10px] font-bold uppercase tracking-widest text-indigo-500 mb-0.5">
                            {project.category}
                          </p>
                          <h3 className="text-base font-bold text-foreground group-hover:text-indigo-500 transition-colors duration-200 leading-tight">
                            {project.title}
                          </h3>
                          <p className="text-[11px] text-muted-foreground mt-0.5">
                            {project.tagline}
                          </p>
                        </div>

                        <p className="text-xs text-muted-foreground leading-relaxed flex-grow line-clamp-2">
                          {project.description}
                        </p>

                        <div className="flex flex-wrap gap-1 mt-1">
                          {project.tags.slice(0, 3).map((tag) => (
                            <span
                              key={tag}
                              className="text-[9px] font-semibold px-2 py-0.5 rounded-full bg-muted/60 border border-border/40 text-muted-foreground"
                            >
                              {tag}
                            </span>
                          ))}
                        </div>

                        <div className="flex items-center gap-1 text-xs font-semibold text-indigo-500 opacity-0 group-hover:opacity-100 transition-all duration-300 mt-0.5">
                          View Project
                          <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1" />
                        </div>
                      </div>
                    </div>
                  </Link>
                </motion.div>
              ))
            )}
          </AnimatePresence>
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
                Ready to be our next{' '}
                <span className="bg-gradient-to-r from-indigo-400 to-pink-400 bg-clip-text text-transparent">
                  success story?
                </span>
              </h2>
              <p className="text-slate-300 mb-8 max-w-xl mx-auto leading-relaxed">
                Let&apos;s discuss your vision and build something remarkable together. Our team is
                ready to turn your idea into a reality.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button
                  render={<Link href="/contact?type=quote" />}
                  nativeButton={false}
                  size="lg"
                  variant="gradient"
                  className="cursor-pointer flex items-center gap-2 group mx-auto sm:mx-0"
                >
                  Start Your Project
                  <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                </Button>
                <Button
                  render={<Link href="/services" />}
                  nativeButton={false}
                  variant="outline"
                  size="lg"
                  className="cursor-pointer border-border hover:bg-muted/50 flex items-center gap-2 group mx-auto sm:mx-0"
                >
                  <ExternalLink className="h-4 w-4" />
                  Explore Services
                </Button>
              </div>
            </div>
          </div>
        </AnimatedContainer>
      </section>
    </div>
  );
}
