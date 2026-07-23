'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { SectionHeader } from '@/components/shared/SectionHeader';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Card, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Search, Calendar } from 'lucide-react';

export const MOCK_POSTS = [
  {
    slug: 'future-of-saas-2027',
    title: 'The Future of SaaS: What to Expect by 2027',
    excerpt:
      'Explore the emerging trends in cloud software, from AI-driven personalization to micro-SaaS ecosystems that are reshaping the industry.',
    category: 'Technology',
    author: { name: 'Sarah Jenkins', avatar: '/avatars/01.png' },
    date: 'Oct 24, 2026',
    thumbnail:
      'https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=800&auto=format&fit=crop',
    featured: true,
  },
  {
    slug: 'mastering-react-server-components',
    title: 'Mastering React Server Components',
    excerpt:
      'A deep dive into how RSCs change the paradigm of fetching data and rendering UI in modern Next.js applications.',
    category: 'Engineering',
    author: { name: 'David Chen', avatar: '/avatars/02.png' },
    date: 'Oct 20, 2026',
    thumbnail:
      'https://images.unsplash.com/photo-1633356122544-f134324a6cee?q=80&w=800&auto=format&fit=crop',
    featured: false,
  },
  {
    slug: 'designing-for-accessibility',
    title: 'Designing for Accessibility in 2026',
    excerpt:
      'Why inclusive design is no longer optional, and how to implement WCAG 3.0 standards in your next product.',
    category: 'Design',
    author: { name: 'Emma Wilson', avatar: '/avatars/03.png' },
    date: 'Oct 15, 2026',
    thumbnail:
      'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?q=80&w=800&auto=format&fit=crop',
    featured: false,
  },
  {
    slug: 'scaling-startup-engineering',
    title: 'Scaling Engineering Teams at Startups',
    excerpt:
      'Lessons learned from growing a team from 5 to 50 engineers while maintaining culture and deployment speed.',
    category: 'Leadership',
    author: { name: 'Michael Ross', avatar: '/avatars/04.png' },
    date: 'Oct 10, 2026',
    thumbnail:
      'https://images.unsplash.com/photo-1522071820081-009f0129c71c?q=80&w=800&auto=format&fit=crop',
    featured: false,
  },
];

const CATEGORIES = ['All', 'Technology', 'Engineering', 'Design', 'Leadership'];

export default function BlogPage() {
  const [search, setSearch] = useState('');
  const [activeCategory, setActiveCategory] = useState('All');

  const filteredPosts = MOCK_POSTS.filter((post) => {
    const matchesSearch =
      post.title.toLowerCase().includes(search.toLowerCase()) ||
      post.excerpt.toLowerCase().includes(search.toLowerCase());
    const matchesCategory = activeCategory === 'All' || post.category === activeCategory;
    return matchesSearch && matchesCategory;
  });

  const featuredPost = filteredPosts.find((p) => p.featured) || filteredPosts[0];
  const gridPosts = filteredPosts.filter((p) => p.slug !== featuredPost?.slug);

  return (
    <main className="min-h-screen pt-24 pb-20 px-6 max-w-7xl mx-auto flex flex-col gap-12">
      <SectionHeader
        title="Insights & Perspectives"
        subtitle="Our Blog"
        description="Thoughts on product development, engineering, and design from the InGrowwth team."
      />

      {/* Filters */}
      <div className="flex flex-col md:flex-row justify-between items-center gap-6">
        <div className="flex flex-wrap gap-2 justify-center md:justify-start">
          {CATEGORIES.map((category) => (
            <Badge
              key={category}
              variant={activeCategory === category ? 'default' : 'secondary'}
              className="cursor-pointer text-sm py-1.5 px-4 transition-all hover:scale-105"
              onClick={() => setActiveCategory(category)}
            >
              {category}
            </Badge>
          ))}
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
        >
          <Link href={`/blog/${featuredPost.slug}`}>
            <div className="group relative overflow-hidden rounded-3xl glass-card border-none bg-muted/20 dark:bg-muted/10 grid md:grid-cols-2 gap-8 items-center cursor-pointer transition-transform hover:scale-[1.01]">
              <div className="h-64 md:h-[400px] w-full overflow-hidden">
                <img
                  src={featuredPost.thumbnail}
                  alt={featuredPost.title}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
              </div>
              <div className="p-8 md:p-12 flex flex-col gap-4">
                <Badge className="w-fit mb-2">{featuredPost.category}</Badge>
                <h2 className="text-3xl md:text-5xl font-bold tracking-tight text-foreground group-hover:text-indigo-500 transition-colors">
                  {featuredPost.title}
                </h2>
                <p className="text-lg text-muted-foreground">{featuredPost.excerpt}</p>
                <div className="flex items-center gap-4 mt-6">
                  <Avatar>
                    <AvatarFallback>{featuredPost.author.name[0]}</AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="text-sm font-medium">{featuredPost.author.name}</p>
                    <div className="flex items-center text-xs text-muted-foreground">
                      <Calendar className="w-3 h-3 mr-1" />
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
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
        {gridPosts.map((post, i) => (
          <motion.div
            key={post.slug}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: i * 0.1 }}
          >
            <Link href={`/blog/${post.slug}`}>
              <Card className="h-full group cursor-pointer glass-card border-border/50 hover:border-indigo-500/50 overflow-hidden flex flex-col">
                <div className="h-48 w-full overflow-hidden relative">
                  <img
                    src={post.thumbnail}
                    alt={post.title}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                  <div className="absolute top-4 left-4">
                    <Badge variant="secondary" className="backdrop-blur-md bg-background/70">
                      {post.category}
                    </Badge>
                  </div>
                </div>
                <CardHeader>
                  <CardTitle className="line-clamp-2 group-hover:text-indigo-500 transition-colors">
                    {post.title}
                  </CardTitle>
                  <CardDescription className="line-clamp-3 mt-2">{post.excerpt}</CardDescription>
                </CardHeader>
                <CardFooter className="mt-auto flex items-center justify-between pt-6 border-t border-border/20">
                  <div className="flex items-center gap-2">
                    <Avatar className="h-8 w-8">
                      <AvatarFallback>{post.author.name[0]}</AvatarFallback>
                    </Avatar>
                    <span className="text-sm text-muted-foreground">{post.author.name}</span>
                  </div>
                  <span className="text-xs text-muted-foreground flex items-center gap-1">
                    {post.date}
                  </span>
                </CardFooter>
              </Card>
            </Link>
          </motion.div>
        ))}
      </div>

      {filteredPosts.length === 0 && (
        <div className="text-center py-20">
          <p className="text-muted-foreground text-lg">No articles found matching your search.</p>
        </div>
      )}
    </main>
  );
}
