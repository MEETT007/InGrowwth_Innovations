'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import Image from 'next/image';
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

interface DBPortfolioProject {
  id: string;
  title: string;
  client: string;
  category: string;
  websiteUrl: string | null;
  description: string;
  gallery: string | null;
}

const CATEGORIES = ['All', 'Web Design', 'App Development', 'Branding', 'Marketing'];

const categoryIcons: Record<string, React.ReactNode> = {
  All: <Layers className="h-4 w-4" />,
  'Web Design': <Code className="h-4 w-4" />,
  'App Development': <Smartphone className="h-4 w-4" />,
  Branding: <Sparkles className="h-4 w-4" />,
  Marketing: <Cpu className="h-4 w-4" />,
};

const GRADIENTS = [
  'from-blue-500 to-cyan-400',
  'from-purple-500 to-indigo-500',
  'from-pink-500 to-rose-400',
  'from-orange-500 to-amber-400',
  'from-green-500 to-emerald-400',
  'from-red-500 to-pink-500',
];

const DEFAULT_TECH_LISTS = [
  ['React', 'Next.js', 'Tailwind CSS'],
  ['Swift', 'Kotlin', 'React Native'],
  ['Figma', 'Illustrator', 'UI/UX'],
  ['SEO', 'Google Ads', 'Analytics'],
  ['Node.js', 'PostgreSQL', 'Prisma'],
];

const EMOJIS = ['🚀', '💻', '📱', '🎨', '📈', '⚡'];

export default function ProjectsClient({
  initialProjects,
}: {
  initialProjects: DBPortfolioProject[];
}) {
  const [activeCategory, setActiveCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');

  // Dynamically generate categories from the database data
  const dynamicCategories = useMemo(() => {
    const cats = Array.from(new Set(initialProjects.map((p) => p.category))).filter(Boolean);
    return ['All', ...cats.sort()];
  }, [initialProjects]);

  // Map DB projects to frontend format with algorithmic aesthetics
  const projectsWithAesthetics = useMemo(() => {
    return initialProjects.map((p, idx) => {
      const galleryArray = p.gallery ? p.gallery.split(',') : [];
      const coverImage = galleryArray.length > 0 ? galleryArray[0] : null;

      return {
        ...p,
        slug: p.id,
        tagline: `Client: ${p.client || 'Confidential'}`,
        coverImage,
        gradient: GRADIENTS[idx % GRADIENTS.length],
        tech: DEFAULT_TECH_LISTS[idx % DEFAULT_TECH_LISTS.length],
        tags: [p.category],
        emoji: EMOJIS[idx % EMOJIS.length],
        featured: idx < 3, // first 3 are featured
      };
    });
  }, [initialProjects]);

  const filtered = useMemo(() => {
    return projectsWithAesthetics.filter((p) => {
      const matchCat = activeCategory === 'All' || p.category === activeCategory;
      const q = searchQuery.toLowerCase();
      const matchSearch =
        !q ||
        (p.title && p.title.toLowerCase().includes(q)) ||
        (p.description && p.description.toLowerCase().includes(q)) ||
        (p.client && p.client.toLowerCase().includes(q)) ||
        (p.category && p.category.toLowerCase().includes(q));
      return matchCat && matchSearch;
    });
  }, [activeCategory, searchQuery, projectsWithAesthetics]);

  const featuredProjects = projectsWithAesthetics.filter((p) => p.featured);

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
            { label: 'Projects Delivered', value: `${projectsWithAesthetics.length}+` },
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
      {featuredProjects.length > 0 && (
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
                {/* Note: In a real app we'd route to /projects/[id] but we haven't built that page yet. 
                    We will just use the websiteUrl or '#' */}
                <Link
                  href={project.websiteUrl || '#'}
                  target={project.websiteUrl ? '_blank' : undefined}
                  className="block group h-full"
                >
                  <div className="relative rounded-2xl overflow-hidden border border-border/50 bg-card/60 backdrop-blur-sm h-full flex flex-col hover:shadow-2xl hover:shadow-indigo-500/10 hover:-translate-y-1 transition-all duration-300">
                    {/* Color header */}
                    <div
                      className={`bg-gradient-to-br ${project.gradient} h-48 flex items-center justify-center relative overflow-hidden group/image`}
                    >
                      <div className="absolute inset-0 bg-black/10" />
                      {project.coverImage ? (
                        <Image
                          src={project.coverImage}
                          alt={project.title}
                          fill
                          className="object-cover transition-transform duration-700 group-hover/image:scale-110"
                          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                        />
                      ) : (
                        <div className="relative text-center">
                          <span className="text-6xl">{project.emoji}</span>
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
                      )}
                      {/* Featured badge */}
                      <div className="absolute top-3 right-3 bg-background/90 text-foreground text-[10px] font-bold px-2 py-0.5 rounded-full border border-border/50 shadow-sm">
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
                        {project.websiteUrl ? 'Visit Live Site' : 'View Project'}
                        <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                      </div>
                    </div>
                  </div>
                </Link>
              </AnimatedContainer>
            ))}
          </div>
        </section>
      )}

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
                placeholder="Search projects or clients..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-border/50 bg-muted/30 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-indigo-500/40 focus:border-indigo-500/50 transition-all"
              />
            </div>

            {/* Category tabs */}
            <div className="flex items-center gap-2 flex-wrap justify-center">
              <Filter className="h-4 w-4 text-muted-foreground shrink-0" />
              {dynamicCategories.map((cat) => {
                const isActive = activeCategory === cat;
                return (
                  <Button
                    key={cat}
                    id={`filter-${cat.toLowerCase().replace(/\s+/g, '-').replace(/&/g, 'and')}`}
                    onClick={() => setActiveCategory(cat)}
                    variant={isActive ? 'default' : 'outline'}
                    size="xs"
                    className={`rounded-full cursor-pointer transition-all duration-200 ${
                      isActive ? 'bg-indigo-500 text-white shadow-md shadow-indigo-500/30' : ''
                    }`}
                  >
                    {categoryIcons[cat] || <Layers className="h-4 w-4" />}
                    <span>{cat}</span>
                  </Button>
                );
              })}
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
                  <Link
                    href={project.websiteUrl || '#'}
                    target={project.websiteUrl ? '_blank' : undefined}
                    className="block group h-full"
                  >
                    <div className="relative rounded-2xl overflow-hidden border border-border/50 bg-card/60 backdrop-blur-sm h-full flex flex-col hover:shadow-xl hover:shadow-indigo-500/10 hover:-translate-y-1 transition-all duration-300 cursor-pointer">
                      {/* Top accent line */}
                      <div
                        className={`absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r ${project.gradient} opacity-0 group-hover:opacity-100 transition-opacity duration-300`}
                      />

                      {/* Thumbnail */}
                      <div
                        className={`bg-gradient-to-br ${project.gradient} h-36 flex items-center justify-center relative overflow-hidden group/thumb`}
                      >
                        <div className="absolute inset-0 bg-black/10" />
                        {project.coverImage ? (
                          <Image
                            src={project.coverImage}
                            alt={project.title}
                            fill
                            className="object-cover transition-transform duration-700 group-hover:scale-110"
                            sizes="(max-width: 768px) 100vw, 33vw"
                          />
                        ) : (
                          <span className="relative text-5xl">{project.emoji}</span>
                        )}
                        {project.featured && (
                          <div className="absolute top-2 right-2 bg-background/90 text-foreground text-[9px] font-bold px-1.5 py-0.5 rounded-full border border-border/50 shadow-sm">
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
                          {project.websiteUrl ? 'Visit Live Site' : 'View Project'}
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
          <div className="relative rounded-2xl bg-gradient-to-br from-indigo-100/60 via-purple-100/60 to-pink-100/60 dark:from-indigo-900/40 dark:via-purple-950/40 dark:to-pink-900/40 border border-indigo-200/50 dark:border-indigo-500/20 p-10 text-center overflow-hidden">
            <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)]" />
            <div className="absolute top-1/4 left-1/4 w-32 h-32 rounded-full bg-indigo-500/10 blur-2xl" />
            <div className="absolute bottom-1/4 right-1/4 w-32 h-32 rounded-full bg-pink-500/10 blur-2xl" />

            <div className="relative z-10">
              <h2 className="text-2xl sm:text-3xl font-extrabold text-indigo-950 dark:text-white mb-4">
                Ready to be our next{' '}
                <span className="bg-gradient-to-r from-indigo-400 to-pink-400 bg-clip-text text-transparent">
                  success story?
                </span>
              </h2>
              <p className="text-muted-foreground mb-8 max-w-xl mx-auto leading-relaxed">
                Let&apos;s discuss your vision and build something remarkable together. Our team is
                ready to turn your idea into a reality.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button
                  render={<Link href="/contact?type=quote" />}
                  nativeButton={false}
                  size="lg"
                  variant="gradient"
                  className="cursor-pointer group mx-auto sm:mx-0"
                >
                  Start Your Project
                  <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                </Button>
                <Button
                  render={<Link href="/services" />}
                  nativeButton={false}
                  variant="outline"
                  size="lg"
                  className="cursor-pointer group mx-auto sm:mx-0"
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
