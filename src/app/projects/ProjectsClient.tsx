'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { ArrowRight, Sparkles, Search, Briefcase, FileText } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

interface DBPortfolioProject {
  id: string;
  slug: string | null;
  title: string;
  client: string;
  category: string;
  websiteUrl: string | null;
  description: string;
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
  coverImage: string | null;
  heroBanner: string | null;
  createdAt: Date;
}

export default function ProjectsClient({
  initialProjects,
  initialCaseStudies,
}: {
  initialProjects: DBPortfolioProject[];
  initialCaseStudies: DBCaseStudy[];
}) {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState<'All' | 'Projects' | 'Case Studies'>('All');
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  // Map DB portfolio projects to frontend format
  const combinedItems = useMemo(() => {
    const mappedProjects = initialProjects.map((p) => {
      const galleryArray = p.gallery ? p.gallery.split(',').map((u) => u.trim()) : [];
      const coverImage = p.coverImage || (galleryArray.length > 0 ? galleryArray[0] : '/placeholder.png');
      return {
        id: p.id,
        isCaseStudy: false,
        title: p.title,
        description: p.description,
        category: p.category,
        coverImage,
        linkSlug: p.slug || p.id,
        date: p.createdAt,
      };
    });

    const mappedCaseStudies = initialCaseStudies.map((cs) => {
      return {
        id: cs.id,
        isCaseStudy: true,
        title: cs.title,
        description: cs.problemStatement || 'Read our in-depth case study.',
        category: cs.industry || 'Case Study',
        coverImage: cs.coverImage || cs.heroBanner || '/placeholder.png',
        linkSlug: cs.slug,
        date: cs.createdAt,
      };
    });

    const all = [...mappedProjects, ...mappedCaseStudies];
    // Sort by date descending
    all.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

    return all.filter((item) => {
      const q = searchQuery.toLowerCase();
      const matchesSearch =
        !q ||
        (item.title && item.title.toLowerCase().includes(q)) ||
        (item.description && item.description.toLowerCase().includes(q));

      const matchesTab = 
        activeTab === 'All' ||
        (activeTab === 'Projects' && !item.isCaseStudy) ||
        (activeTab === 'Case Studies' && item.isCaseStudy);

      return matchesSearch && matchesTab;
    });
  }, [initialProjects, initialCaseStudies, searchQuery, activeTab]);

  return (
    <div className="flex flex-col min-h-screen relative overflow-hidden bg-background py-12">
      {/* Background glow effects */}
      <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] rounded-full bg-indigo-500/10 blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] rounded-full bg-pink-500/10 blur-[120px] pointer-events-none" />

      {/* Hero Section */}
      <section className="relative z-10 max-w-7xl mx-auto px-6 pt-16 pb-8 w-full text-center">
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-600 dark:text-indigo-400 text-xs font-semibold uppercase tracking-wider mb-6"
        >
          <Sparkles className="h-3.5 w-3.5" />
          Our Work
        </motion.div>
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="text-4xl sm:text-5xl lg:text-7xl font-extrabold tracking-tight text-foreground mb-6"
        >
          Showcase of{' '}
          <span className="bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 bg-clip-text text-transparent">
            Innovation
          </span>
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="text-base sm:text-lg text-muted-foreground max-w-3xl mx-auto leading-relaxed mb-12"
        >
          Browse our curated gallery of successful projects and in-depth case studies, spanning web development, mobile apps,
          and scalable digital solutions.
        </motion.p>

        <div className="flex flex-col md:flex-row justify-center items-center gap-4 max-w-2xl mx-auto mb-8">
          <div className="flex bg-muted/50 p-1 rounded-full backdrop-blur-sm">
            {(['All', 'Projects', 'Case Studies'] as const).map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={cn(
                  'px-6 py-2 rounded-full text-sm font-medium transition-all duration-300',
                  activeTab === tab 
                    ? 'bg-background shadow-sm text-foreground' 
                    : 'text-muted-foreground hover:text-foreground hover:bg-background/50'
                )}
              >
                {tab}
              </button>
            ))}
          </div>
          
          <div className="relative w-full md:w-64">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-4 w-4 text-muted-foreground" />
            </div>
            <input
              type="text"
              placeholder="Search..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2 bg-background/50 border border-border/60 rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all text-foreground placeholder:text-muted-foreground shadow-sm backdrop-blur-sm"
            />
          </div>
        </div>
      </section>

      {/* Gallery */}
      <section className="relative z-10 w-full mt-4 pb-24">
        {combinedItems.length === 0 ? (
          <div className="text-center py-20 text-muted-foreground">
            No items found matching your search.
          </div>
        ) : (
          <div className="max-w-[1400px] mx-auto px-4 overflow-hidden relative">
            <div className="flex flex-wrap justify-center gap-8 md:gap-12 items-center">
              {combinedItems.map((item, index) => {
                const isHovered = hoveredIndex === index;
                const isOtherHovered = hoveredIndex !== null && hoveredIndex !== index;

                // Masonry/Staggered effect
                const yOffsetDesktop = isHovered
                  ? -20
                  : isOtherHovered
                    ? 10
                    : index % 2 === 0
                      ? 0
                      : 40;

                return (
                  <Link href={`/projects/${item.linkSlug}?type=${item.isCaseStudy ? 'case-study' : 'project'}`} key={item.id}>
                    <motion.div
                      className="group cursor-pointer"
                      initial={{ opacity: 0, y: 50 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.5, delay: index * 0.05 }}
                      onHoverStart={() => setHoveredIndex(index)}
                      onHoverEnd={() => setHoveredIndex(null)}
                    >
                      <motion.div
                        animate={{ y: yOffsetDesktop }}
                        transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                        className={cn(
                          'relative rounded-3xl overflow-hidden transition-all duration-300',
                          'bg-card border border-border/50',
                          'w-full sm:w-[340px] lg:w-[400px]',
                          isHovered
                            ? 'shadow-2xl shadow-indigo-500/20 ring-1 ring-indigo-500/50 z-20'
                            : 'shadow-lg z-10',
                          isOtherHovered ? 'opacity-60 scale-95' : 'opacity-100 scale-100'
                        )}
                      >
                        <div className="relative aspect-[4/3] w-full overflow-hidden">
                          <Image
                            src={item.coverImage || '/placeholder.png'}
                            alt={item.title}
                            fill
                            className="w-full h-full object-cover object-center transition-transform duration-700 group-hover:scale-110"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-80" />

                          <div className="absolute top-4 right-4 z-20">
                            {item.isCaseStudy ? (
                              <Badge className="bg-indigo-500/80 hover:bg-indigo-500 backdrop-blur-sm text-white border-transparent">
                                <FileText className="w-3 h-3 mr-1" /> Case Study
                              </Badge>
                            ) : (
                              <Badge className="bg-pink-500/80 hover:bg-pink-500 backdrop-blur-sm text-white border-transparent">
                                <Briefcase className="w-3 h-3 mr-1" /> Project
                              </Badge>
                            )}
                          </div>

                          <div className="absolute bottom-0 left-0 right-0 p-6 transform translate-y-2 group-hover:translate-y-0 transition-transform duration-300">
                            <span className="inline-block px-3 py-1 bg-white/20 backdrop-blur-md rounded-full text-white text-xs font-medium mb-3">
                              {item.category}
                            </span>
                            <h3 className="text-2xl font-bold text-white mb-2 leading-tight">
                              {item.title}
                            </h3>
                            <p className="text-gray-300 text-sm line-clamp-2 mb-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300 delay-100">
                              {item.description}
                            </p>

                            <div className="flex items-center text-indigo-400 text-sm font-semibold opacity-0 group-hover:opacity-100 transition-opacity duration-300 delay-200">
                              {item.isCaseStudy ? 'Read Case Study' : 'View Project'} <ArrowRight className="ml-2 w-4 h-4" />
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    </motion.div>
                  </Link>
                );
              })}
            </div>
          </div>
        )}
      </section>
    </div>
  );
}
