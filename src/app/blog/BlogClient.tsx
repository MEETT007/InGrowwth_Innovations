'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { SectionHeader } from '@/components/shared/SectionHeader';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Search, Calendar } from 'lucide-react';

interface DBBlogPost {
  id: string;
  title: string;
  slug: string;
  category: string;
  status: string;
  tags: string;
  thumbnail: string | null;
  content: string;
  authorName: string | null;
  createdAt: Date;
}

const GRADIENTS = [
  'from-blue-500 to-cyan-400',
  'from-purple-500 to-indigo-500',
  'from-pink-500 to-rose-400',
  'from-orange-500 to-amber-400',
  'from-green-500 to-emerald-400',
  'from-red-500 to-pink-500',
];

export default function BlogClient({ initialPosts }: { initialPosts: DBBlogPost[] }) {
  const [search, setSearch] = useState('');
  const [activeCategory, setActiveCategory] = useState('All');

  // Dynamically generate categories from the database data
  const dynamicCategories = useMemo(() => {
    const cats = Array.from(new Set(initialPosts.map((p) => p.category))).filter(Boolean);
    return ['All', ...cats.sort()];
  }, [initialPosts]);

  // Map to frontend properties
  const postsWithAesthetics = useMemo(() => {
    return initialPosts.map((p, idx) => {
      // Excerpt from content (strip markdown/HTML roughly)
      const excerpt = p.content.replace(/<[^>]*>?/gm, '').substring(0, 150) + '...';
      
      return {
        ...p,
        excerpt,
        author: { name: p.authorName || 'InGrowwth Team' },
        date: new Date(p.createdAt).toLocaleDateString('en-US', {
          year: 'numeric', month: 'short', day: 'numeric'
        }),
        featured: idx === 0, // make the first post featured
        thumbnail: p.thumbnail || 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=800&q=80',
        gradient: GRADIENTS[idx % GRADIENTS.length],
      };
    });
  }, [initialPosts]);

  const filteredPosts = postsWithAesthetics.filter((post) => {
    const q = search.toLowerCase();
    const matchesSearch =
      !q ||
      (post.title && post.title.toLowerCase().includes(q)) ||
      (post.excerpt && post.excerpt.toLowerCase().includes(q)) ||
      (post.tags && post.tags.toLowerCase().includes(q)) ||
      (post.category && post.category.toLowerCase().includes(q)) ||
      (post.author && post.author.name && post.author.name.toLowerCase().includes(q));
      
    const matchesCategory = activeCategory === 'All' || post.category === activeCategory;
    return matchesSearch && matchesCategory;
  });

  const featuredPost = filteredPosts.find((p) => p.featured) || filteredPosts[0];
  const gridPosts = filteredPosts.filter((p) => p.slug !== featuredPost?.slug);

  return (
    <main className="min-h-screen pt-24 pb-20 px-6 max-w-7xl mx-auto flex flex-col gap-12">
      {/* Background glow effects */}
      <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] rounded-full bg-indigo-500/10 blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] rounded-full bg-pink-500/10 blur-[120px] pointer-events-none" />

      <SectionHeader
        title="Insights & Perspectives"
        subtitle="Our Blog"
        description="Thoughts on product development, engineering, and design from the InGrowwth team."
      />

      {/* Filters */}
      <div className="flex flex-col md:flex-row justify-between items-center gap-6 relative z-10">
        <div className="flex flex-wrap gap-2 justify-center md:justify-start">
          {dynamicCategories.map((category) => {
            const isActive = activeCategory === category;
            return (
              <Button
                key={category}
                onClick={() => setActiveCategory(category)}
                variant={isActive ? 'default' : 'outline'}
                size="sm"
                className={`rounded-full cursor-pointer hover:scale-105 transition-all duration-300 shadow-sm ${
                  isActive ? 'bg-indigo-500 text-white shadow-md shadow-indigo-500/30 border-transparent' : 'border-border/50'
                }`}
              >
                {category}
              </Button>
            );
          })}
        </div>
        <div className="relative w-full md:w-72">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search articles..."
            className="pl-9 bg-background/50 backdrop-blur-sm"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>

      {/* Featured Post */}
      {featuredPost && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="relative z-10 group"
        >
          <div className="absolute -inset-0.5 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-[2rem] blur opacity-20 group-hover:opacity-40 transition duration-1000 group-hover:duration-200" />
          <Link href={`/blog/${featuredPost.slug}`}>
            <div className="relative overflow-hidden rounded-[2rem] bg-card/80 backdrop-blur-xl border border-white/10 grid md:grid-cols-2 gap-8 items-center cursor-pointer transition-transform duration-500">
              <div className="h-64 md:h-[400px] w-full overflow-hidden relative">
                <div className="absolute inset-0 bg-black/10 z-10 group-hover:bg-transparent transition-colors duration-500" />
                <Image
                  src={featuredPost.thumbnail}
                  alt={featuredPost.title}
                  fill
                  sizes="(max-width: 768px) 100vw, 50vw"
                  className="object-cover transition-transform duration-1000 group-hover:scale-110"
                />
              </div>
              <div className="p-8 md:p-12 flex flex-col gap-5">
                <Badge className="w-fit mb-2 bg-indigo-500/10 text-indigo-500 hover:bg-indigo-500/20 border border-indigo-500/20 px-3 py-1 shadow-sm">
                  {featuredPost.category}
                </Badge>
                <h2 className="text-3xl md:text-5xl font-extrabold tracking-tight text-foreground group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-indigo-400 group-hover:to-purple-400 transition-all duration-300">
                  {featuredPost.title}
                </h2>
                <p className="text-lg text-muted-foreground leading-relaxed">
                  {featuredPost.excerpt}
                </p>
                <div className="flex items-center gap-4 mt-6">
                  <Avatar className="h-12 w-12 border-2 border-indigo-500/20 shadow-sm">
                    <AvatarFallback className="bg-gradient-to-br from-indigo-500 to-purple-500 text-white font-bold">
                      {featuredPost.author.name[0]}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="text-sm font-bold text-foreground">{featuredPost.author.name}</p>
                    <div className="flex items-center text-xs text-muted-foreground font-medium mt-0.5">
                      <Calendar className="w-3.5 h-3.5 mr-1.5 text-indigo-500" />
                      {featuredPost.date}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </Link>
        </motion.div>
      )}

      {/* Grid Posts */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 relative z-10">
        {gridPosts.map((post, i) => (
          <motion.div
            key={post.slug}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: i * 0.1 }}
            className="group"
          >
            <Link href={`/blog/${post.slug}`} className="block h-full">
              <div className="relative h-full rounded-2xl overflow-hidden border border-white/5 bg-card/60 backdrop-blur-md flex flex-col hover:shadow-2xl hover:shadow-indigo-500/10 hover:-translate-y-1.5 hover:border-white/10 transition-all duration-300">
                {/* Top accent line */}
                <div className={`absolute top-0 left-0 right-0 h-[3px] bg-gradient-to-r ${post.gradient} opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-20`} />
                
                <div className="h-52 w-full overflow-hidden relative">
                  <div className="absolute inset-0 bg-black/20 z-10 group-hover:bg-transparent transition-colors duration-500" />
                  <Image
                    src={post.thumbnail}
                    alt={post.title}
                    fill
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    className="object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                  <div className="absolute top-4 left-4 z-20">
                    <Badge className="backdrop-blur-md bg-background/80 text-foreground font-semibold border-none shadow-sm px-3 py-1">
                      {post.category}
                    </Badge>
                  </div>
                </div>
                
                <div className="p-6 flex flex-col flex-grow gap-3">
                  <h3 className="text-xl font-bold line-clamp-2 text-foreground group-hover:text-indigo-400 transition-colors duration-300">
                    {post.title}
                  </h3>
                  <p className="text-sm text-muted-foreground line-clamp-3 leading-relaxed flex-grow">
                    {post.excerpt}
                  </p>
                  
                  <div className="mt-4 pt-5 border-t border-white/5 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <Avatar className="h-8 w-8 ring-1 ring-white/10">
                        <AvatarFallback className="bg-muted text-xs font-bold text-foreground">
                          {post.author.name[0]}
                        </AvatarFallback>
                      </Avatar>
                      <span className="text-xs font-semibold text-foreground group-hover:text-indigo-400 transition-colors">{post.author.name}</span>
                    </div>
                    <span className="text-xs text-muted-foreground font-medium flex items-center gap-1.5 bg-muted/50 px-2 py-1 rounded-md">
                      <Calendar className="w-3.5 h-3.5" />
                      {post.date}
                    </span>
                  </div>
                </div>
              </div>
            </Link>
          </motion.div>
        ))}
      </div>

      {filteredPosts.length === 0 && (
        <div className="text-center py-20 relative z-10">
          <p className="text-muted-foreground text-lg">No articles found matching your criteria.</p>
        </div>
      )}
    </main>
  );
}
