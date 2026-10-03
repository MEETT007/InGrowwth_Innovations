'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ArrowRight,
  Sparkles,
  Search,
  Briefcase,
  FileText,
  TrendingUp,
  Layers,
  ChevronRight,
  ExternalLink,
  Code2,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { parseMetricsField, parseArrayField } from '@/lib/data-helpers';

interface DBPortfolioProject {
  id: string;
  slug: string | null;
  title: string;
  client: string;
  category: string;
  websiteUrl: string | null;
  description: string;
  technologiesUsed?: string | null;
  technologies?: string | null;
  metrics?: string | null;
  industry?: string | null;
  duration?: string | null;
  gallery: string | null;
  coverImage: string | null;
  createdAt: Date;
}

interface DBCaseStudy {
  id: string;
  slug: string;
  title: string;
  clientName: string | null;
  industry: string | null;
  problemStatement: string | null;
  executiveSummary?: string | null;
  metrics?: string | null;
  tags?: string | null;
  technologies?: string | null;
  coverImage: string | null;
  heroBanner: string | null;
  createdAt: Date;
}

export default function PortfolioClient({
  initialProjects,
  initialCaseStudies,
  defaultTab = 'All',
}: {
  initialProjects: DBPortfolioProject[];
  initialCaseStudies: DBCaseStudy[];
  defaultTab?: 'All' | 'Case Studies' | 'Projects';
}) {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState<'All' | 'Case Studies' | 'Projects'>(defaultTab);
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  // Collect unique categories across both projects & case studies
  const categories = useMemo(() => {
    const set = new Set<string>();
    initialProjects.forEach((p) => {
      if (p.category) set.add(p.category);
    });
    initialCaseStudies.forEach((cs) => {
      if (cs.industry) set.add(cs.industry);
    });
    return ['All', ...Array.from(set)];
  }, [initialProjects, initialCaseStudies]);

  // Combine and map items
  const combinedItems = useMemo(() => {
    const mappedProjects = initialProjects.map((p) => {
      const galleryArray = p.gallery ? p.gallery.split(',').map((u) => u.trim()) : [];
      const coverImage = p.coverImage || (galleryArray.length > 0 ? galleryArray[0] : '/placeholder.png');
      const techStack = parseArrayField(p.technologiesUsed || p.technologies);
      const metricsList = parseMetricsField(p.metrics);

      return {
        id: p.id,
        isCaseStudy: false,
        title: p.title,
        client: p.client,
        description: p.description,
        category: p.category || 'Engineering',
        coverImage,
        linkSlug: p.slug || p.id,
        href: `/projects/${p.slug || p.id}`,
        websiteUrl: p.websiteUrl,
        date: p.createdAt,
        techStack,
        metrics: metricsList,
      };
    });

    const mappedCaseStudies = initialCaseStudies.map((cs) => {
      const metricsList = parseMetricsField(cs.metrics);
      const tagsList = parseArrayField(cs.tags);

      return {
        id: cs.id,
        isCaseStudy: true,
        title: cs.title,
        client: cs.clientName || 'Enterprise Partner',
        description: cs.problemStatement || cs.executiveSummary || 'Deep-dive architectural transformation and business impact analysis.',
        category: cs.industry || 'Enterprise Transformation',
        coverImage: cs.coverImage || cs.heroBanner || '/placeholder.png',
        linkSlug: cs.slug,
        href: `/case-studies/${cs.slug}`,
        websiteUrl: null,
        date: cs.createdAt,
        techStack: tagsList,
        metrics: metricsList,
      };
    });

    const all = [...mappedProjects, ...mappedCaseStudies];
    all.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

    return all.filter((item) => {
      const q = searchQuery.toLowerCase().trim();
      const matchesSearch =
        !q ||
        item.title.toLowerCase().includes(q) ||
        (item.client && item.client.toLowerCase().includes(q)) ||
        (item.description && item.description.toLowerCase().includes(q)) ||
        (item.category && item.category.toLowerCase().includes(q));

      const matchesTab =
        activeTab === 'All' ||
        (activeTab === 'Case Studies' && item.isCaseStudy) ||
        (activeTab === 'Projects' && !item.isCaseStudy);

      const matchesCategory =
        selectedCategory === 'All' ||
        (item.category && item.category.toLowerCase() === selectedCategory.toLowerCase());

      return matchesSearch && matchesTab && matchesCategory;
    });
  }, [initialProjects, initialCaseStudies, searchQuery, activeTab, selectedCategory]);

  return (
    <div className="flex flex-col min-h-screen relative overflow-hidden bg-background py-16">
      {/* Dynamic ambient backdrop glows */}
      <div className="absolute top-[-10%] left-[-10%] w-[55%] h-[55%] rounded-full bg-indigo-500/10 blur-[140px] pointer-events-none" />
      <div className="absolute top-[40%] right-[-10%] w-[45%] h-[45%] rounded-full bg-purple-500/10 blur-[140px] pointer-events-none" />
      <div className="absolute bottom-[-10%] left-[20%] w-[50%] h-[50%] rounded-full bg-pink-500/10 blur-[150px] pointer-events-none" />

      {/* Hero Header */}
      <section className="relative z-10 max-w-7xl mx-auto px-6 pt-16 pb-8 w-full text-center">
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-500 dark:text-indigo-400 text-xs font-bold uppercase tracking-wider mb-6"
        >
          <Sparkles className="h-3.5 w-3.5" />
          Enterprise Portfolio & Case Studies
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="text-4xl sm:text-5xl lg:text-7xl font-extrabold tracking-tight text-foreground mb-6"
        >
          Engineered for{' '}
          <span className="bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 bg-clip-text text-transparent">
            Measurable Impact
          </span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="text-base sm:text-lg text-muted-foreground max-w-3xl mx-auto leading-relaxed mb-10"
        >
          Explore verified digital solutions, mission-critical cloud infrastructures, and published
          enterprise case studies delivered across global industries.
        </motion.p>

        {/* Executive Stats Ribbon */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.25 }}
          className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto mb-12 p-4 rounded-3xl bg-card/40 border border-border/50 backdrop-blur-xl shadow-xl"
        >
          <div className="text-center p-3">
            <div className="text-2xl sm:text-3xl font-black bg-gradient-to-r from-indigo-500 to-purple-500 bg-clip-text text-transparent">
              {initialProjects.length}+
            </div>
            <div className="text-xs text-muted-foreground font-semibold mt-1">Delivered Projects</div>
          </div>
          <div className="text-center p-3">
            <div className="text-2xl sm:text-3xl font-black bg-gradient-to-r from-purple-500 to-pink-500 bg-clip-text text-transparent">
              {initialCaseStudies.length}
            </div>
            <div className="text-xs text-muted-foreground font-semibold mt-1">Published Case Studies</div>
          </div>
          <div className="text-center p-3">
            <div className="text-2xl sm:text-3xl font-black text-emerald-500 dark:text-emerald-400">
              99.9%
            </div>
            <div className="text-xs text-muted-foreground font-semibold mt-1">Delivery On-Time</div>
          </div>
          <div className="text-center p-3">
            <div className="text-2xl sm:text-3xl font-black text-indigo-500 dark:text-indigo-400">
              Global
            </div>
            <div className="text-xs text-muted-foreground font-semibold mt-1">Cross-Border Scale</div>
          </div>
        </motion.div>

        {/* Master Control Bar: Segmented Switch + Search */}
        <div className="flex flex-col md:flex-row justify-between items-center gap-4 max-w-4xl mx-auto mb-6 p-2 bg-card/60 border border-border/60 rounded-2xl backdrop-blur-xl shadow-xl">
          {/* Segmented Control */}
          <div className="flex bg-muted/60 p-1 rounded-xl w-full md:w-auto">
            {(['All', 'Case Studies', 'Projects'] as const).map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={cn(
                  'flex-1 md:flex-initial px-5 py-2 rounded-lg text-xs sm:text-sm font-semibold transition-all duration-300 flex items-center justify-center gap-2 cursor-pointer',
                  activeTab === tab
                    ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-md shadow-indigo-500/25'
                    : 'text-muted-foreground hover:text-foreground hover:bg-background/40'
                )}
              >
                {tab === 'Case Studies' && <FileText className="w-3.5 h-3.5" />}
                {tab === 'Projects' && <Briefcase className="w-3.5 h-3.5" />}
                {tab === 'All' && <Layers className="w-3.5 h-3.5" />}
                <span>{tab}</span>
                <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-white/20 text-white font-mono">
                  {tab === 'All'
                    ? initialProjects.length + initialCaseStudies.length
                    : tab === 'Case Studies'
                    ? initialCaseStudies.length
                    : initialProjects.length}
                </span>
              </button>
            ))}
          </div>

          {/* Search Input */}
          <div className="relative w-full md:w-72">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search deliverables, tech, client..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2 bg-background/60 border border-border/60 rounded-xl text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all text-foreground placeholder:text-muted-foreground shadow-sm backdrop-blur-sm"
            />
          </div>
        </div>

        {/* Category / Industry Filter Bar */}
        {categories.length > 2 && (
          <div className="flex items-center justify-center gap-1.5 overflow-x-auto max-w-4xl mx-auto p-1 scrollbar-none mb-8">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={cn(
                  'px-3.5 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-all cursor-pointer',
                  selectedCategory === cat
                    ? 'bg-foreground text-background font-semibold shadow-sm'
                    : 'bg-muted/30 border border-border/40 text-muted-foreground hover:text-foreground hover:bg-muted/60'
                )}
              >
                {cat}
              </button>
            ))}
          </div>
        )}
      </section>

      {/* Grid Showcase */}
      <section className="relative z-10 max-w-7xl mx-auto px-6 pb-24 w-full">
        {combinedItems.length === 0 ? (
          <div className="text-center py-20 bg-card/20 rounded-3xl border border-dashed border-border/60 max-w-xl mx-auto p-8">
            <Layers className="w-12 h-12 text-muted-foreground/40 mx-auto mb-4" />
            <h3 className="text-lg font-bold text-foreground mb-1">No matching deliverables found</h3>
            <p className="text-sm text-muted-foreground mb-6">
              Try adjusting your search terms or selecting a different category filter.
            </p>
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                setSearchQuery('');
                setActiveTab('All');
                setSelectedCategory('All');
              }}
              className="rounded-full"
            >
              Reset All Filters
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {combinedItems.map((item, index) => {
              const isCaseStudy = item.isCaseStudy;

              return (
                <motion.div
                  key={`${item.isCaseStudy ? 'cs' : 'proj'}-${item.id}`}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: index * 0.05 }}
                  className="group flex flex-col h-full bg-card/60 backdrop-blur-xl border border-border/50 hover:border-indigo-500/40 rounded-3xl overflow-hidden shadow-lg hover:shadow-2xl hover:shadow-indigo-500/10 transition-all duration-300"
                >
                  {/* Card Visual / Thumbnail */}
                  <div className="relative aspect-[16/10] w-full overflow-hidden bg-muted/40">
                    <Image
                      src={item.coverImage || '/placeholder.png'}
                      alt={item.title}
                      fill
                      className="w-full h-full object-cover object-center transition-transform duration-700 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-background via-background/20 to-transparent opacity-80" />

                    {/* Top Badges */}
                    <div className="absolute top-4 left-4 right-4 flex items-center justify-between z-10">
                      <Badge
                        className={cn(
                          'backdrop-blur-md border-0 text-[11px] font-bold px-3 py-1 shadow-md',
                          isCaseStudy
                            ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-indigo-500/25'
                            : 'bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-purple-500/25'
                        )}
                      >
                        {isCaseStudy ? (
                          <>
                            <FileText className="w-3 h-3 mr-1 inline" /> Case Study
                          </>
                        ) : (
                          <>
                            <Briefcase className="w-3 h-3 mr-1 inline" /> Project
                          </>
                        )}
                      </Badge>

                      <span className="text-[11px] font-semibold px-2.5 py-0.5 rounded-full bg-background/80 text-foreground/80 backdrop-blur-md border border-white/10 shadow-sm">
                        {item.category}
                      </span>
                    </div>

                    {/* Client Name if Case Study */}
                    {item.client && (
                      <div className="absolute bottom-3 left-4 z-10">
                        <span className="text-xs font-semibold text-zinc-300 drop-shadow-md">
                          Client: <strong className="text-white">{item.client}</strong>
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Card Content */}
                  <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
                    <div className="space-y-3">
                      <h3 className="text-xl font-bold tracking-tight text-foreground group-hover:text-indigo-400 transition-colors line-clamp-2">
                        {item.title}
                      </h3>
                      <p className="text-xs sm:text-sm text-muted-foreground line-clamp-3 leading-relaxed">
                        {item.description}
                      </p>
                    </div>

                    {/* Highlight Metrics (If available) */}
                    {item.metrics && item.metrics.length > 0 && (
                      <div className="grid grid-cols-2 gap-2 pt-2 border-t border-border/40">
                        {item.metrics.slice(0, 2).map((m, mIdx) => (
                          <div key={mIdx} className="p-2 rounded-xl bg-muted/40 border border-border/30">
                            <div className="text-base font-extrabold text-indigo-400">
                              {m.value}
                            </div>
                            <div className="text-[10px] text-muted-foreground truncate uppercase font-semibold">
                              {m.label}
                            </div>
                          </div>
                        ))}
                      </div>
                    )}

                    {/* Tech Stack Tags (If available) */}
                    {item.techStack && item.techStack.length > 0 && (
                      <div className="flex flex-wrap gap-1.5 pt-2">
                        {item.techStack.slice(0, 4).map((tech, tIdx) => (
                          <span
                            key={tIdx}
                            className="text-[10px] font-mono px-2 py-0.5 rounded-md bg-muted/60 text-muted-foreground border border-border/40"
                          >
                            {tech}
                          </span>
                        ))}
                      </div>
                    )}

                    {/* Action Link Button */}
                    <div className="pt-2">
                      <Link
                        href={item.href}
                        className={cn(
                          'w-full inline-flex items-center justify-between px-4 py-2.5 rounded-xl text-xs font-bold transition-all duration-300',
                          isCaseStudy
                            ? 'bg-indigo-500/10 text-indigo-400 hover:bg-indigo-500 hover:text-white border border-indigo-500/20'
                            : 'bg-purple-500/10 text-purple-400 hover:bg-purple-500 hover:text-white border border-purple-500/20'
                        )}
                      >
                        <span>{isCaseStudy ? 'Read Enterprise Case Study' : 'Explore Project Details'}</span>
                        <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                      </Link>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}
      </section>
    </div>
  );
}
