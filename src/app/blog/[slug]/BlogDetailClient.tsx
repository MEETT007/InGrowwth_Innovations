'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import {
  Calendar,
  Clock,
  ArrowLeft,
  Link2,
  Check,
  ChevronRight,
  Copy,
  ArrowRight,
  BookOpen,
  Sparkles,
  Info,
  AlertTriangle,
  Hash,
} from 'lucide-react';

const LinkedinIcon = (props: React.ComponentProps<'svg'>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    {...props}
  >
    <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
    <rect width="4" height="12" x="2" y="9" />
    <circle cx="4" cy="4" r="2" />
  </svg>
);

const TwitterIcon = (props: React.ComponentProps<'svg'>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    {...props}
  >
    <path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z" />
  </svg>
);

const FacebookIcon = (props: React.ComponentProps<'svg'>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    {...props}
  >
    <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
  </svg>
);
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle } from '@/components/ui/card';
import { MockBlogPost, MOCK_POSTS } from '@/lib/mock-data';

interface Props {
  post: MockBlogPost;
}

const slugify = (text: string) => {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .replace(/\s+/g, '-');
};

export default function BlogDetailClient({ post }: Props) {
  const [copied, setCopied] = useState(false);
  const [activeHeading, setActiveHeading] = useState('');
  const [copiedCodeIndex, setCopiedCodeIndex] = useState<number | null>(null);

  const headingsRef = useRef<{ id: string; element: HTMLElement }[]>([]);

  // Find index of current post to determine previous and next articles
  const currentIndex = MOCK_POSTS.findIndex((p) => p.slug === post.slug);
  const prevPost = currentIndex > 0 ? MOCK_POSTS[currentIndex - 1] : null;
  const nextPost = currentIndex < MOCK_POSTS.length - 1 ? MOCK_POSTS[currentIndex + 1] : null;

  // Reading Time calculation based on content
  const totalWords = post.contentBlocks.reduce((acc, block) => {
    if ('text' in block && block.text) return acc + block.text.split(/\s+/).length;
    if ('items' in block && block.items) return acc + block.items.join(' ').split(/\s+/).length;
    return acc;
  }, 0);
  const estimatedReadTime = `${Math.ceil(totalWords / 200) + 1} min read`;

  // Get social share URLs
  const [shareUrl, setShareUrl] = useState('');

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setShareUrl(new URL(window.location.href).toString());
  }, []);

  const shareText = encodeURIComponent(post.title);

  const shareLinks = {
    linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shareUrl)}`,
    twitter: `https://twitter.com/intent/tweet?url=${encodeURIComponent(shareUrl)}&text=${shareText}`,
    facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`,
  };

  const handleCopyLink = async () => {
    if (!shareUrl) return;
    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      setCopied(false);
    }
  };

  const handleCopyCode = async (code: string, index: number) => {
    try {
      await navigator.clipboard.writeText(code);
      setCopiedCodeIndex(index);
      setTimeout(() => setCopiedCodeIndex(null), 2000);
    } catch {
      setCopiedCodeIndex(null);
    }
  };

  // Table of Contents selection logic
  const tocItems = post.contentBlocks
    .filter((block) => block.type === 'heading-2' || block.type === 'heading-3')
    .map((block) => ({
      text: (block as { text: string }).text,
      type: block.type,
      id: slugify((block as { text: string }).text),
    }));

  useEffect(() => {
    headingsRef.current = [];
    tocItems.forEach((item) => {
      const el = document.getElementById(item.id);
      if (el) {
        headingsRef.current.push({ id: item.id, element: el });
      }
    });

    const observer = new IntersectionObserver(
      (entries) => {
        const visibleEntries = entries.filter((e) => e.isIntersecting);
        if (visibleEntries.length > 0) {
          // Highlight the first visible entry
          setActiveHeading(visibleEntries[0].target.id);
        }
      },
      {
        rootMargin: '-10% 0px -70% 0px',
        threshold: 0.1,
      }
    );

    headingsRef.current.forEach((heading) => observer.observe(heading.element));

    return () => {
      observer.disconnect();
    };
  }, [post, tocItems]);

  return (
    <main className="min-h-screen pt-28 pb-20 px-6 max-w-7xl mx-auto flex flex-col gap-12 relative overflow-hidden">
      {/* Background Ambience */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-indigo-500/5 rounded-full blur-3xl pointer-events-none -z-10" />
      <div className="absolute bottom-1/4 left-10 w-96 h-96 bg-purple-500/5 rounded-full blur-3xl pointer-events-none -z-10" />

      {/* Breadcrumb Navigation */}
      <nav
        aria-label="Breadcrumb"
        className="flex items-center gap-2 text-xs sm:text-sm text-muted-foreground"
      >
        <Link href="/" className="hover:text-foreground transition-colors">
          Home
        </Link>
        <ChevronRight className="h-3.5 w-3.5" />
        <Link href="/blog" className="hover:text-foreground transition-colors">
          Blog
        </Link>
        <ChevronRight className="h-3.5 w-3.5" />
        <span className="text-foreground font-medium truncate max-w-[200px] sm:max-w-xs">
          {post.title}
        </span>
      </nav>

      {/* Header / Meta Info */}
      <header className="flex flex-col gap-6 max-w-4xl">
        <div className="flex flex-wrap items-center gap-2">
          <Badge className="bg-indigo-500/10 text-indigo-500 dark:text-indigo-400 border border-indigo-500/20 px-3 py-1 font-semibold">
            {post.category}
          </Badge>
          <span className="text-xs text-muted-foreground flex items-center gap-1.5 ml-2">
            <Clock className="w-3.5 h-3.5 text-muted-foreground" />
            {estimatedReadTime}
          </span>
        </div>

        <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tight text-foreground leading-[1.15] bg-gradient-to-r from-foreground via-foreground to-muted-foreground bg-clip-text">
          {post.title}
        </h1>

        <p className="text-lg sm:text-xl text-muted-foreground font-light leading-relaxed max-w-3xl">
          {post.excerpt}
        </p>

        {/* Author details */}
        <div className="flex items-center gap-4 border-y border-border/40 py-5 mt-4">
          <Avatar className="h-12 w-12 border border-border/60">
            <AvatarFallback className="bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 font-semibold text-lg">
              {post.author.name[0]}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1">
            <p className="text-sm font-semibold text-foreground">{post.author.name}</p>
            <p className="text-xs text-muted-foreground mt-0.5">
              Author, Engineering & Product Team
            </p>
          </div>
          <div className="text-right text-xs sm:text-sm text-muted-foreground flex items-center gap-1.5">
            <Calendar className="w-4 h-4" />
            {post.date}
          </div>
        </div>
      </header>

      {/* Featured Banner Image */}
      <div className="w-full aspect-[21/9] rounded-3xl overflow-hidden glass-card border border-border/40 relative shadow-2xl">
        <Image
          src={post.thumbnail}
          alt={post.title}
          fill
          priority
          sizes="(max-width: 1280px) 100vw, 1280px"
          className="object-cover select-none"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-background/40 to-transparent" />
      </div>

      {/* Main Grid: Social + Content + TOC */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start mt-4">
        {/* Sticky Desktop Share Actions (Left Side) */}
        <aside className="hidden lg:flex lg:col-span-1 flex-col gap-4 items-center sticky top-28 bg-card/40 backdrop-blur-xs p-3 rounded-full border border-border/40 shadow-sm w-fit mx-auto">
          <p className="text-[10px] uppercase tracking-wider font-bold text-muted-foreground rotate-270 my-4 select-none">
            Share
          </p>
          <a
            href={shareLinks.linkedin}
            target="_blank"
            rel="noreferrer"
            className="w-9 h-9 rounded-full bg-background border border-border/50 flex items-center justify-center text-muted-foreground hover:text-indigo-400 hover:bg-muted hover:border-indigo-500/20 transition-all duration-200"
            title="Share on LinkedIn"
          >
            <LinkedinIcon className="h-4 w-4" />
          </a>
          <a
            href={shareLinks.twitter}
            target="_blank"
            rel="noreferrer"
            className="w-9 h-9 rounded-full bg-background border border-border/50 flex items-center justify-center text-muted-foreground hover:text-sky-400 hover:bg-muted hover:border-indigo-500/20 transition-all duration-200"
            title="Share on X"
          >
            <TwitterIcon className="h-4 w-4" />
          </a>
          <a
            href={shareLinks.facebook}
            target="_blank"
            rel="noreferrer"
            className="w-9 h-9 rounded-full bg-background border border-border/50 flex items-center justify-center text-muted-foreground hover:text-blue-500 hover:bg-muted hover:border-indigo-500/20 transition-all duration-200"
            title="Share on Facebook"
          >
            <FacebookIcon className="h-4 w-4" />
          </a>
          <button
            onClick={handleCopyLink}
            className="w-9 h-9 rounded-full bg-background border border-border/50 flex items-center justify-center text-muted-foreground hover:text-emerald-500 hover:bg-muted hover:border-indigo-500/20 transition-all duration-200 cursor-pointer"
            title="Copy Link"
          >
            {copied ? (
              <Check className="h-4 w-4 text-emerald-500" />
            ) : (
              <Link2 className="h-4 w-4" />
            )}
          </button>
        </aside>

        {/* Content Area */}
        <article className="lg:col-span-8 flex flex-col gap-6 prose prose-lg dark:prose-invert max-w-none">
          {post.contentBlocks.map((block, index) => {
            switch (block.type) {
              case 'paragraph':
                return (
                  <p
                    key={index}
                    className="text-base sm:text-lg text-muted-foreground leading-relaxed font-light mb-4"
                  >
                    {block.text}
                  </p>
                );

              case 'heading-2': {
                const headingId = slugify(block.text);
                return (
                  <h2
                    key={index}
                    id={headingId}
                    className="group text-2xl sm:text-3xl font-extrabold text-foreground tracking-tight mt-12 mb-4 scroll-mt-24 flex items-center gap-2"
                  >
                    <a
                      href={`#${headingId}`}
                      className="flex items-center gap-2 hover:text-indigo-500 transition-colors"
                    >
                      <Hash className="h-5 w-5 text-indigo-500/40 opacity-0 group-hover:opacity-100 transition-opacity" />
                      {block.text}
                    </a>
                  </h2>
                );
              }

              case 'heading-3': {
                const headingId = slugify(block.text);
                return (
                  <h3
                    key={index}
                    id={headingId}
                    className="group text-xl sm:text-2xl font-bold text-foreground mt-8 mb-3 scroll-mt-24 flex items-center gap-2"
                  >
                    <a
                      href={`#${headingId}`}
                      className="flex items-center gap-2 hover:text-indigo-500 transition-colors"
                    >
                      <Hash className="h-4 w-4 text-indigo-500/40 opacity-0 group-hover:opacity-100 transition-opacity" />
                      {block.text}
                    </a>
                  </h3>
                );
              }

              case 'list-bullet':
                return (
                  <ul
                    key={index}
                    className="list-none space-y-3 mb-6 pl-2 border-l-2 border-indigo-500/20 py-1"
                  >
                    {block.items.map((item, idx) => (
                      <li
                        key={idx}
                        className="flex gap-3 text-base text-muted-foreground font-light leading-relaxed"
                      >
                        <span className="text-indigo-500 font-bold mt-0.5 select-none">•</span>
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                );

              case 'blockquote':
                return (
                  <blockquote
                    key={index}
                    className="relative my-8 p-6 sm:p-8 rounded-3xl bg-muted/20 border-l-4 border-indigo-500 backdrop-blur-xs shadow-inner"
                  >
                    <span className="text-indigo-500/20 text-7xl font-serif absolute top-2 left-4 select-none">
                      “
                    </span>
                    <p className="relative font-serif italic text-foreground/90 text-lg leading-relaxed pl-4">
                      {block.text}
                    </p>
                    {block.author && (
                      <cite className="block text-right mt-3 text-xs sm:text-sm font-semibold not-italic text-indigo-400">
                        — {block.author}
                      </cite>
                    )}
                  </blockquote>
                );

              case 'code-block':
                return (
                  <div
                    key={index}
                    className="my-8 rounded-2xl overflow-hidden border border-border/60 bg-zinc-950/95 shadow-lg max-w-full"
                  >
                    {/* Header Bar */}
                    <div className="flex items-center justify-between px-5 py-2.5 bg-zinc-900 border-b border-zinc-800/80">
                      <span className="text-[11px] font-mono font-bold text-zinc-400 uppercase tracking-wider">
                        {block.language}
                      </span>
                      <button
                        onClick={() => handleCopyCode(block.code, index)}
                        className="flex items-center gap-1.5 text-xs text-zinc-400 hover:text-indigo-400 transition-colors py-1 px-2.5 rounded-lg hover:bg-zinc-800/50 cursor-pointer"
                      >
                        {copiedCodeIndex === index ? (
                          <>
                            <Check className="h-3.5 w-3.5 text-emerald-500" />
                            <span className="text-emerald-500">Copied!</span>
                          </>
                        ) : (
                          <>
                            <Copy className="h-3.5 w-3.5" />
                            <span>Copy</span>
                          </>
                        )}
                      </button>
                    </div>
                    {/* Content */}
                    <div className="p-5 overflow-x-auto max-w-full">
                      <pre className="font-mono text-xs sm:text-sm leading-relaxed text-zinc-200">
                        <code>{block.code}</code>
                      </pre>
                    </div>
                  </div>
                );

              case 'callout': {
                const calloutConfigs = {
                  info: {
                    borderClass:
                      'border-indigo-500/20 bg-indigo-500/5 text-indigo-900 dark:text-indigo-200',
                    icon: <Info className="h-5 w-5 text-indigo-500 shrink-0 mt-0.5" />,
                  },
                  warning: {
                    borderClass:
                      'border-amber-500/20 bg-amber-500/5 text-amber-900 dark:text-amber-200',
                    icon: <AlertTriangle className="h-5 w-5 text-amber-500 shrink-0 mt-0.5" />,
                  },
                  tip: {
                    borderClass:
                      'border-emerald-500/20 bg-emerald-500/5 text-emerald-900 dark:text-emerald-200',
                    icon: <Sparkles className="h-5 w-5 text-emerald-500 shrink-0 mt-0.5" />,
                  },
                };
                const config = calloutConfigs[block.calloutType] || calloutConfigs.info;
                return (
                  <div
                    key={index}
                    className={`my-6 flex gap-4 p-5 rounded-2xl border backdrop-blur-xs ${config.borderClass}`}
                  >
                    {config.icon}
                    <p className="text-sm sm:text-base leading-relaxed font-light">{block.text}</p>
                  </div>
                );
              }

              case 'image':
                return (
                  <figure
                    key={index}
                    className="my-8 rounded-3xl overflow-hidden border border-border/40 shadow-md"
                  >
                    <div className="relative w-full aspect-video max-h-[450px]">
                      <Image
                        src={block.imageUrl}
                        alt={block.imageAlt}
                        fill
                        className="object-cover"
                        sizes="(max-width: 1024px) 100vw, 800px"
                      />
                    </div>
                    <figcaption className="text-center text-xs text-muted-foreground/80 py-3 bg-muted/10 border-t border-border/20">
                      {block.imageAlt}
                    </figcaption>
                  </figure>
                );

              default:
                return null;
            }
          })}

          {/* Tags */}
          <div className="flex flex-wrap items-center gap-2 mt-8 pt-8 border-t border-border/40">
            <span className="text-xs font-semibold text-muted-foreground uppercase tracking-widest mr-2">
              Tags:
            </span>
            {post.tags.map((tag) => (
              <Badge
                key={tag}
                variant="secondary"
                className="bg-muted hover:bg-muted/80 text-muted-foreground rounded-full px-3 py-0.5 text-xs transition-colors"
              >
                #{tag}
              </Badge>
            ))}
          </div>

          {/* Mobile Share Buttons (Visible only on mobile/tablet) */}
          <div className="flex lg:hidden flex-col gap-3 py-6 mt-6 border-y border-border/40">
            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
              Share this article
            </p>
            <div className="flex items-center gap-2">
              <a
                href={shareLinks.linkedin}
                target="_blank"
                rel="noreferrer"
                className="w-10 h-10 rounded-xl bg-card border border-border/40 flex items-center justify-center text-muted-foreground hover:text-indigo-400"
              >
                <LinkedinIcon className="h-4.5 w-4.5" />
              </a>
              <a
                href={shareLinks.twitter}
                target="_blank"
                rel="noreferrer"
                className="w-10 h-10 rounded-xl bg-card border border-border/40 flex items-center justify-center text-muted-foreground hover:text-sky-400"
              >
                <TwitterIcon className="h-4.5 w-4.5" />
              </a>
              <a
                href={shareLinks.facebook}
                target="_blank"
                rel="noreferrer"
                className="w-10 h-10 rounded-xl bg-card border border-border/40 flex items-center justify-center text-muted-foreground hover:text-blue-500"
              >
                <FacebookIcon className="h-4.5 w-4.5" />
              </a>
              <button
                onClick={handleCopyLink}
                className="w-10 h-10 rounded-xl bg-card border border-border/40 flex items-center justify-center text-muted-foreground hover:text-emerald-500 cursor-pointer"
              >
                {copied ? (
                  <Check className="h-4.5 w-4.5 text-emerald-500" />
                ) : (
                  <Link2 className="h-4.5 w-4.5" />
                )}
              </button>
            </div>
          </div>
        </article>

        {/* Desktop Sticky Table of Contents (Right Side) */}
        {tocItems.length > 0 && (
          <aside className="hidden lg:block lg:col-span-3 sticky top-28 pl-4 border-l border-border/40 self-start">
            <h4 className="text-xs font-bold text-foreground uppercase tracking-widest mb-4 flex items-center gap-2">
              <BookOpen className="h-4 w-4 text-indigo-500" />
              Table of Contents
            </h4>
            <nav className="flex flex-col gap-2.5">
              {tocItems.map((item) => (
                <a
                  key={item.id}
                  href={`#${item.id}`}
                  className={`text-xs leading-relaxed transition-all duration-200 hover:text-indigo-500 hover:pl-1 border-l-2 pl-3 -ml-[17px] ${
                    activeHeading === item.id
                      ? 'text-indigo-500 font-medium border-indigo-500 border-l-2'
                      : 'text-muted-foreground border-transparent'
                  } ${item.type === 'heading-3' ? 'pl-6 -ml-[17px]' : ''}`}
                >
                  {item.text}
                </a>
              ))}
            </nav>
          </aside>
        )}
      </div>

      {/* Prev / Next Blog Navigation */}
      <section className="mt-16 border-t border-border/40 pt-12">
        <div className="grid md:grid-cols-2 gap-6">
          {prevPost ? (
            <Link href={`/blog/${prevPost.slug}`} className="group block h-full">
              <div className="h-full p-4 sm:p-6 rounded-2xl bg-card/30 border border-border/40 hover:border-indigo-500/40 hover:bg-card/50 transition-all flex items-center gap-4">
                <div className="w-20 h-20 sm:w-24 sm:h-24 shrink-0 rounded-xl overflow-hidden relative">
                  <Image
                    src={prevPost.thumbnail}
                    alt={prevPost.title}
                    fill
                    className="object-cover"
                    sizes="96px"
                  />
                </div>
                <div className="flex flex-col gap-1.5 flex-1 overflow-hidden">
                  <span className="text-xs font-bold text-muted-foreground/75 uppercase tracking-wider flex items-center gap-1 group-hover:-translate-x-1 transition-transform">
                    <ArrowLeft className="w-3.5 h-3.5" /> Previous Article
                  </span>
                  <p className="text-sm sm:text-base font-bold text-foreground group-hover:text-indigo-500 transition-colors line-clamp-2">
                    {prevPost.title}
                  </p>
                  <span className="text-[10px] sm:text-xs text-muted-foreground flex items-center gap-1">
                    <Calendar className="w-3 h-3" /> {prevPost.date}
                  </span>
                </div>
              </div>
            </Link>
          ) : (
            <div className="h-full p-4 sm:p-6 rounded-2xl bg-card/10 border border-border/20 opacity-40 select-none flex items-center justify-center">
              <span className="text-xs font-bold uppercase tracking-wider">No newer articles</span>
            </div>
          )}

          {nextPost ? (
            <Link href={`/blog/${nextPost.slug}`} className="group block h-full">
              <div className="h-full p-4 sm:p-6 rounded-2xl bg-card/30 border border-border/40 hover:border-indigo-500/40 hover:bg-card/50 transition-all flex items-center gap-4 flex-row-reverse text-right">
                <div className="w-20 h-20 sm:w-24 sm:h-24 shrink-0 rounded-xl overflow-hidden relative">
                  <Image
                    src={nextPost.thumbnail}
                    alt={nextPost.title}
                    fill
                    className="object-cover"
                    sizes="96px"
                  />
                </div>
                <div className="flex flex-col gap-1.5 flex-1 overflow-hidden items-end">
                  <span className="text-xs font-bold text-muted-foreground/75 uppercase tracking-wider flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                    Next Article <ArrowRight className="w-3.5 h-3.5" />
                  </span>
                  <p className="text-sm sm:text-base font-bold text-foreground group-hover:text-indigo-500 transition-colors line-clamp-2">
                    {nextPost.title}
                  </p>
                  <span className="text-[10px] sm:text-xs text-muted-foreground flex items-center gap-1">
                    <Calendar className="w-3 h-3" /> {nextPost.date}
                  </span>
                </div>
              </div>
            </Link>
          ) : (
            <div className="h-full p-4 sm:p-6 rounded-2xl bg-card/10 border border-border/20 opacity-40 select-none flex items-center justify-center text-right">
              <span className="text-xs font-bold uppercase tracking-wider">No older articles</span>
            </div>
          )}
        </div>
      </section>

      {/* Back to all blogs CTA */}
      <div className="flex justify-center mt-6">
        <Button
          render={<Link href="/blog" />}
          nativeButton={false}
          variant="outline"
          size="default"
          className="rounded-full shadow-xs cursor-pointer gap-2"
        >
          <ArrowLeft className="h-4 w-4" />
          <span>Back to insights</span>
        </Button>
      </div>

      {/* Related Blogs Section */}
      <section className="mt-16 pt-12 border-t border-border/40">
        <h3 className="text-2xl font-bold tracking-tight mb-8">Related Insights</h3>
        <div className="grid md:grid-cols-3 gap-6">
          {MOCK_POSTS.filter((p) => p.slug !== post.slug)
            .slice(0, 3)
            .map((related) => (
              <Link key={related.slug} href={`/blog/${related.slug}`}>
                <Card className="h-full group cursor-pointer glass-card border-border/50 hover:border-indigo-500/50 overflow-hidden flex flex-col transition-transform hover:-translate-y-1">
                  <div className="h-40 w-full overflow-hidden relative">
                    <Image
                      src={related.thumbnail}
                      alt={related.title}
                      fill
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 33vw, 33vw"
                      className="object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                    <div className="absolute top-3 left-3">
                      <Badge
                        variant="secondary"
                        className="backdrop-blur-md bg-background/70 px-2 py-0.5 text-[10px]"
                      >
                        {related.category}
                      </Badge>
                    </div>
                  </div>
                  <CardHeader className="p-5 flex flex-col gap-2.5 flex-1 justify-between">
                    <CardTitle className="text-base font-bold line-clamp-2 leading-snug group-hover:text-indigo-500 transition-colors">
                      {related.title}
                    </CardTitle>
                    <span className="text-xs text-muted-foreground flex items-center gap-1">
                      <Calendar className="w-3.5 h-3.5" />
                      {related.date}
                    </span>
                  </CardHeader>
                </Card>
              </Link>
            ))}
        </div>
      </section>

      {/* Call to Action */}
      <section className="mt-20 p-8 sm:p-12 rounded-3xl relative overflow-hidden bg-gradient-to-tr from-indigo-500/10 via-purple-500/5 to-transparent border border-indigo-500/15 backdrop-blur-xs flex flex-col md:flex-row items-center gap-8 justify-between text-center md:text-left">
        <div className="max-w-xl flex flex-col gap-3 relative z-10">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-xs font-semibold w-fit mx-auto md:mx-0">
            <Sparkles className="w-3.5 h-3.5 text-indigo-500" />
            Ready to Build?
          </div>
          <h3 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-foreground tracking-tight">
            Have a project in mind? Let&apos;s talk.
          </h3>
          <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">
            From modern web applications to complex cloud infrastructure, our team is ready to turn
            your vision into reality.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 relative z-10 shrink-0">
          <Button
            render={<Link href="/contact" />}
            nativeButton={false}
            variant="gradient"
            size="lg"
            className="rounded-xl shadow-lg cursor-pointer font-semibold"
          >
            Contact Us
          </Button>
          <Button
            render={<Link href="/services" />}
            nativeButton={false}
            variant="outline"
            size="lg"
            className="rounded-xl cursor-pointer font-semibold bg-background/50 hover:bg-background"
          >
            Explore Services
          </Button>
        </div>

        {/* Background blobs for CTA */}
        <div className="absolute top-0 right-0 -mr-20 -mt-20 w-64 h-64 bg-indigo-500/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-64 h-64 bg-purple-500/20 rounded-full blur-3xl pointer-events-none" />
      </section>
    </main>
  );
}
