'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import ReactMarkdown from 'react-markdown';
import { motion, useScroll, useSpring } from 'framer-motion';
import { Calendar, Clock, ArrowLeft, ChevronRight, Check, Share2 } from 'lucide-react';

interface DBBlogPost {
  id: string;
  title: string;
  slug: string;
  shortDescription: string | null;
  category: string;
  status: string;
  tags: string;
  thumbnail: string | null;
  content: string;
  readTime: number | null;
  authorName: string | null;
  publishDate: string | null;
  createdAt: string;
}

export default function BlogDetailClient({ post }: { post: DBBlogPost }) {
  const [copied, setCopied] = useState(false);
  const [activeHeading, setActiveHeading] = useState('');
  const [headings, setHeadings] = useState<{ id: string; text: string; level: number }[]>([]);
  const contentRef = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001,
  });

  // Extract headings from markdown content
  useEffect(() => {
    const extractHeadings = () => {
      if (!post.content) return;
      const headingRegex = /^(#{2,3})\s+(.+)$/gm;
      const extracted: { id: string; text: string; level: number }[] = [];
      let match;

      while ((match = headingRegex.exec(post.content)) !== null) {
        const level = match[1].length;
        const text = match[2].trim();
        const id = text
          .toLowerCase()
          .replace(/[^\w\s-]/g, '')
          .replace(/\s+/g, '-');
        extracted.push({ id, text, level });
      }
      setHeadings(extracted);
    };

    extractHeadings();
  }, [post.content]);

  useEffect(() => {
    if (headings.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const visibleEntries = entries.filter((e) => e.isIntersecting);
        if (visibleEntries.length > 0) {
          setActiveHeading(visibleEntries[0].target.id);
        }
      },
      { rootMargin: '-10% 0px -70% 0px', threshold: 0.1 }
    );

    headings.forEach((heading) => {
      const el = document.getElementById(heading.id);
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, [headings]);

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {}
  };

  const publishDate = post.publishDate
    ? new Date(post.publishDate).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      })
    : new Date(post.createdAt).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      });

  return (
    <main className="min-h-screen bg-background relative selection:bg-indigo-500/30">
      <motion.div
        className="fixed top-0 left-0 right-0 h-1 bg-indigo-500 origin-left z-50"
        style={{ scaleX }}
      />

      {/* Background Ambience */}
      <div className="absolute top-0 left-0 w-full h-[80vh] overflow-hidden pointer-events-none -z-10">
        <div className="absolute -top-[20%] -left-[10%] w-[50%] h-[50%] rounded-full bg-indigo-500/10 blur-[150px]" />
        <div className="absolute top-[20%] -right-[10%] w-[50%] h-[50%] rounded-full bg-purple-500/10 blur-[150px]" />
        <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-background to-transparent" />
      </div>

      <div className="max-w-7xl mx-auto px-6 pt-32 pb-24">
        {/* Breadcrumb Navigation */}
        <nav className="flex items-center gap-2 text-sm text-muted-foreground mb-8">
          <Link href="/" className="hover:text-foreground transition-colors">
            Home
          </Link>
          <ChevronRight className="h-4 w-4" />
          <Link href="/blog" className="hover:text-foreground transition-colors">
            Blog
          </Link>
          <ChevronRight className="h-4 w-4" />
          <span className="text-foreground font-medium truncate max-w-[250px]">{post.title}</span>
        </nav>

        {/* Hero Section */}
        <header className="mb-16 max-w-4xl relative z-10">
          <div className="flex items-center gap-4 mb-6">
            <span className="px-4 py-1.5 rounded-full bg-indigo-500/10 text-indigo-400 font-semibold text-sm border border-indigo-500/20 backdrop-blur-md">
              {post.category}
            </span>
            <div className="flex items-center text-sm text-muted-foreground gap-2">
              <Clock className="w-4 h-4" />
              <span>{post.readTime || 5} min read</span>
            </div>
          </div>

          <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight text-foreground leading-[1.1] mb-6">
            {post.title}
          </h1>

          <p className="text-xl text-muted-foreground leading-relaxed mb-8 border-l-4 border-indigo-500 pl-4">
            {post.shortDescription}
          </p>

          <div className="flex items-center justify-between py-6 border-y border-white/5">
            <div className="flex items-center gap-4">
              <div className="h-12 w-12 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 p-[2px]">
                <div className="h-full w-full rounded-full bg-background flex items-center justify-center font-bold text-lg text-foreground">
                  {(post.authorName || 'I')[0]}
                </div>
              </div>
              <div>
                <p className="font-bold text-foreground text-lg">
                  {post.authorName || 'InGrowwth Team'}
                </p>
                <div className="flex items-center text-sm text-muted-foreground">
                  <Calendar className="w-3.5 h-3.5 mr-1.5 text-indigo-500" />
                  {publishDate}
                </div>
              </div>
            </div>

            <button
              onClick={handleCopyLink}
              className="group flex items-center justify-center w-12 h-12 rounded-full bg-card hover:bg-indigo-500/10 border border-border/50 hover:border-indigo-500/30 transition-all duration-300 relative overflow-hidden"
            >
              {copied ? (
                <Check className="h-5 w-5 text-emerald-500" />
              ) : (
                <Share2 className="h-5 w-5 text-muted-foreground group-hover:text-indigo-400 transition-colors" />
              )}
            </button>
          </div>
        </header>

        {/* Cover Image */}
        {post.thumbnail && (
          <div className="relative z-10 w-full aspect-[21/9] rounded-[2.5rem] overflow-hidden mb-20 shadow-2xl shadow-indigo-500/5 ring-1 ring-white/10">
            <Image src={post.thumbnail} alt={post.title} fill className="object-cover" priority />
          </div>
        )}

        {/* Content Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 relative z-10">
          {/* Main Content */}
          <div className="lg:col-span-8">
            <div
              className="prose prose-invert prose-lg max-w-none prose-headings:font-bold prose-h2:text-3xl prose-h3:text-2xl prose-a:text-indigo-400 prose-a:no-underline hover:prose-a:underline prose-p:leading-relaxed prose-p:text-muted-foreground prose-strong:text-foreground prose-strong:font-bold"
              ref={contentRef}
            >
              <ReactMarkdown
                components={{
                  // eslint-disable-next-line @typescript-eslint/no-unused-vars
                  h2: ({ node, ...props }) => {
                    const id = String(props.children)
                      .toLowerCase()
                      .replace(/[^\w\s-]/g, '')
                      .replace(/\s+/g, '-');
                    return (
                      <h2
                        id={id}
                        className="scroll-mt-32 mt-16 mb-6 pb-4 border-b border-white/5 text-transparent bg-clip-text bg-gradient-to-r from-foreground to-foreground/70"
                        {...props}
                      />
                    );
                  },
                  // eslint-disable-next-line @typescript-eslint/no-unused-vars
                  h3: ({ node, ...props }) => {
                    const id = String(props.children)
                      .toLowerCase()
                      .replace(/[^\w\s-]/g, '')
                      .replace(/\s+/g, '-');
                    return (
                      <h3
                        id={id}
                        className="scroll-mt-32 mt-12 mb-4 text-foreground/90"
                        {...props}
                      />
                    );
                  },
                  // eslint-disable-next-line @typescript-eslint/no-unused-vars
                  blockquote: ({ node, ...props }) => (
                    <blockquote
                      className="border-l-4 border-indigo-500 bg-indigo-500/5 py-2 px-6 rounded-r-2xl text-foreground/80 italic my-8"
                      {...props}
                    />
                  ),
                }}
              >
                {post.content}
              </ReactMarkdown>
            </div>

            {/* Tags */}
            <div className="mt-16 pt-8 border-t border-white/5">
              <h4 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-4">
                Tags
              </h4>
              <div className="flex flex-wrap gap-2">
                {post.tags.split(',').map((tag) => (
                  <span
                    key={tag}
                    className="px-3 py-1 rounded-full bg-secondary text-secondary-foreground text-sm font-medium"
                  >
                    {tag.trim()}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Table of Contents Sidebar */}
          <div className="lg:col-span-4 hidden lg:block">
            <div className="sticky top-32 rounded-3xl p-8 bg-card/40 backdrop-blur-xl border border-white/5 shadow-2xl">
              <h4 className="text-sm font-bold uppercase tracking-widest text-muted-foreground mb-6 flex items-center gap-2">
                <span className="w-4 h-0.5 bg-indigo-500 rounded-full"></span>
                In this article
              </h4>
              <nav className="flex flex-col gap-1 border-l border-white/10 ml-2">
                {headings.length > 0 ? (
                  headings.map((heading) => {
                    const isActive = activeHeading === heading.id;
                    return (
                      <a
                        key={heading.id}
                        href={`#${heading.id}`}
                        className={`relative py-2 pl-4 pr-2 text-sm transition-all duration-300 ${
                          isActive
                            ? 'text-indigo-400 font-bold translate-x-1'
                            : 'text-muted-foreground hover:text-foreground hover:translate-x-1'
                        } ${heading.level === 3 ? 'ml-4 text-[13px]' : ''}`}
                      >
                        {isActive && (
                          <motion.div
                            layoutId="activeToc"
                            className="absolute left-[-1px] top-0 bottom-0 w-[3px] bg-indigo-500 rounded-full"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ duration: 0.3 }}
                          />
                        )}
                        {heading.text}
                      </a>
                    );
                  })
                ) : (
                  <p className="text-sm text-muted-foreground pl-4">No sections available.</p>
                )}
              </nav>

              {/* Floating Back Button */}
              <div className="mt-12 pt-6 border-t border-white/5">
                <Link
                  href="/blog"
                  className="flex items-center gap-2 text-sm font-semibold text-muted-foreground hover:text-indigo-400 transition-colors group"
                >
                  <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                  Back to all articles
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
