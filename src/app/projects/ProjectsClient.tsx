'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { ArrowRight, Sparkles, Search } from 'lucide-react';
import { cn } from '@/lib/utils';

interface DBPortfolioProject {
  id: string;
  slug: string | null;
  title: string;
  client: string;
  category: string;
  websiteUrl: string | null;
  description: string;
  gallery: string | null;
}

export default function ProjectsClient({
  initialProjects,
}: {
  initialProjects: DBPortfolioProject[];
}) {
  const [searchQuery, setSearchQuery] = useState('');
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  // Map DB portfolio projects to frontend format
  const projects = useMemo(() => {
    return initialProjects
      .map((p) => {
        const galleryArray = p.gallery ? p.gallery.split(',') : [];
        const coverImage =
          galleryArray.length > 0 ? galleryArray[0] : '/assets/images/placeholder.jpg';

        return {
          ...p,
          linkSlug: p.slug || p.id,
          coverImage,
        };
      })
      .filter((p) => {
        const q = searchQuery.toLowerCase();
        return (
          !q ||
          (p.title && p.title.toLowerCase().includes(q)) ||
          (p.description && p.description.toLowerCase().includes(q))
        );
      });
  }, [initialProjects, searchQuery]);

  return (
    <div className="flex flex-col min-h-screen relative overflow-hidden bg-background py-12">
      {/* Background glow effects - Stitch MCP inspired */}
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
          Browse our curated gallery of successful projects, spanning web development, mobile apps,
          and scalable digital solutions.
        </motion.p>

        <div className="relative max-w-md mx-auto">
          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
            <Search className="h-5 w-5 text-muted-foreground" />
          </div>
          <input
            type="text"
            placeholder="Search our portfolio..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-11 pr-4 py-3 bg-background/50 border border-border/60 rounded-2xl text-base focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all text-foreground placeholder:text-muted-foreground shadow-sm backdrop-blur-sm"
          />
        </div>
      </section>

      {/* 21st MCP Inspired 3D Portfolio Gallery */}
      <section className="relative z-10 w-full mt-12 pb-24">
        {projects.length === 0 ? (
          <div className="text-center py-20 text-muted-foreground">
            No projects found matching your search.
          </div>
        ) : (
          <div className="max-w-[1400px] mx-auto px-4 overflow-hidden relative">
            <div className="flex flex-wrap justify-center gap-8 md:gap-12 items-center">
              {projects.map((project, index) => {
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
                  <Link href={`/projects/${project.linkSlug}`} key={project.id}>
                    <motion.div
                      className="group cursor-pointer"
                      initial={{ opacity: 0, y: 50 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.5, delay: index * 0.1 }}
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
                            src={project.coverImage || '/placeholder.png'}
                            alt={project.title}
                            fill
                            className="w-full h-full object-cover object-center transition-transform duration-700 group-hover:scale-110"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-80" />

                          <div className="absolute bottom-0 left-0 right-0 p-6 transform translate-y-2 group-hover:translate-y-0 transition-transform duration-300">
                            <span className="inline-block px-3 py-1 bg-white/20 backdrop-blur-md rounded-full text-white text-xs font-medium mb-3">
                              {project.category}
                            </span>
                            <h3 className="text-2xl font-bold text-white mb-2 leading-tight">
                              {project.title}
                            </h3>
                            <p className="text-gray-300 text-sm line-clamp-2 mb-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300 delay-100">
                              {project.description}
                            </p>

                            <div className="flex items-center text-indigo-400 text-sm font-semibold opacity-0 group-hover:opacity-100 transition-opacity duration-300 delay-200">
                              View Case Study <ArrowRight className="ml-2 w-4 h-4" />
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
