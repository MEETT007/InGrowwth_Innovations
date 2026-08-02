'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import {
  ArrowLeft,
  ExternalLink,
  Tag,
  CheckCircle2,
  LayoutGrid,
  Cpu,
  Sparkles,
} from 'lucide-react';
import { AnimatedContainer } from '@/components/shared/AnimatedContainer';

interface ProjectDetailClientProps {
  data: {
    title: string;
    client: string;
    category: string;
    description: string;
    projectOverview: string | null;
    websiteUrl: string | null;
    features: string | null;
    technologiesUsed: string | null;
    gallery: string | null;
    [key: string]: unknown;
  };
}

export default function ProjectDetailClient({ data }: ProjectDetailClientProps) {
  const {
    title,
    client,
    category,
    description,
    projectOverview,
    websiteUrl,
    features,
    technologiesUsed,
  } = data;

  const galleryArray = data.gallery ? data.gallery.split(',') : [];
  const coverImage = galleryArray.length > 0 ? galleryArray[0] : null;
  const gradient = 'from-indigo-500 to-purple-500';

  let parsedFeatures: string[] = [];
  try {
    if (features) parsedFeatures = JSON.parse(features);
  } catch {}

  let parsedTech: string[] = [];
  try {
    if (technologiesUsed) parsedTech = JSON.parse(technologiesUsed);
  } catch {}

  return (
    <div className="flex flex-col min-h-screen relative overflow-hidden bg-background py-12">
      {/* Dynamic glow effects */}
      <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] rounded-full bg-indigo-500/10 blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] rounded-full bg-pink-500/10 blur-[120px] pointer-events-none" />

      {/* Floating Back Button - Magnetic effect */}
      <div className="fixed top-24 left-6 md:left-12 z-50">
        <Link href="/projects">
          <motion.div
            whileHover={{ scale: 1.05, x: -5 }}
            whileTap={{ scale: 0.95 }}
            className="flex items-center gap-2 bg-background/80 backdrop-blur-md border border-border/60 shadow-lg px-4 py-2.5 rounded-full text-sm font-semibold text-foreground transition-colors hover:bg-muted/80"
          >
            <ArrowLeft className="h-4 w-4 text-indigo-500" />
            Back to Portfolio
          </motion.div>
        </Link>
      </div>

      {/* Hero Section */}
      <section className="relative z-10 max-w-7xl mx-auto px-6 pt-24 pb-8 w-full">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Left: Text */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="flex flex-col gap-6"
          >
            {/* Category badge */}
            <div className="flex items-center gap-3">
              <span
                className={`inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full text-xs font-bold text-indigo-500 bg-indigo-500/10 border border-indigo-500/20`}
              >
                <Tag className="h-3.5 w-3.5" />
                {category || 'Web Development'}
              </span>
            </div>

            <div>
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-foreground leading-tight">
                <span className={`bg-gradient-to-r ${gradient} bg-clip-text text-transparent`}>
                  {title}
                </span>
              </h1>
              <p className="text-lg text-muted-foreground mt-4 font-medium flex items-center gap-2">
                <span className="w-8 h-[1px] bg-border/80 block"></span>
                Client: <span className="text-foreground">{client || 'Confidential'}</span>
              </p>
            </div>

            <p className="text-base sm:text-lg text-muted-foreground leading-relaxed">
              {description}
            </p>

            {websiteUrl && (
              <div className="pt-4 flex flex-wrap gap-4">
                <a
                  href={websiteUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 bg-foreground text-background px-8 py-3.5 rounded-full font-semibold transition-all hover:scale-105 active:scale-95 shadow-xl shadow-black/10"
                >
                  Visit Live Project <ExternalLink className="h-4 w-4" />
                </a>
              </div>
            )}
          </motion.div>

          {/* Right: Main Image */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="relative"
          >
            <div className="relative rounded-[2rem] overflow-hidden border border-border/50 bg-card/40 backdrop-blur-sm shadow-2xl p-2 aspect-[4/3] flex items-center justify-center transform lg:rotate-2 hover:rotate-0 transition-transform duration-500">
              {coverImage ? (
                <div className="relative w-full h-full rounded-[1.5rem] overflow-hidden shadow-inner">
                  <Image
                    src={coverImage}
                    alt={title}
                    fill
                    className="object-cover object-top"
                    priority
                  />
                </div>
              ) : (
                <div
                  className={`w-full h-full rounded-[1.5rem] bg-gradient-to-br ${gradient} opacity-20`}
                />
              )}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Main Content Sections */}
      <section className="relative z-10 max-w-7xl mx-auto px-6 py-16 w-full grid grid-cols-1 lg:grid-cols-3 gap-12">
        {/* Main Content Column */}
        <div className="lg:col-span-2 space-y-16">
          <AnimatedContainer direction="up" delay={0.2}>
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-full bg-indigo-500/10 flex items-center justify-center">
                <LayoutGrid className="w-5 h-5 text-indigo-500" />
              </div>
              <h2 className="text-3xl font-bold text-foreground">Project Overview</h2>
            </div>
            <div className="prose prose-invert max-w-none text-muted-foreground whitespace-pre-wrap text-lg leading-relaxed">
              {projectOverview || 'Detailed information is currently being updated.'}
            </div>
          </AnimatedContainer>

          {/* Features Section */}
          {parsedFeatures.length > 0 && (
            <AnimatedContainer direction="up" delay={0.3}>
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-full bg-purple-500/10 flex items-center justify-center">
                  <Sparkles className="w-5 h-5 text-purple-500" />
                </div>
                <h2 className="text-3xl font-bold text-foreground">Key Functionality</h2>
              </div>
              <ul className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {parsedFeatures.map((feature: string, idx: number) => (
                  <li
                    key={idx}
                    className="flex items-start gap-3 bg-card/40 border border-border/50 p-4 rounded-xl backdrop-blur-sm"
                  >
                    <CheckCircle2 className="w-5 h-5 text-indigo-500 shrink-0 mt-0.5" />
                    <span className="text-muted-foreground">{feature}</span>
                  </li>
                ))}
              </ul>
            </AnimatedContainer>
          )}

          {/* Screenshots Gallery */}
          {galleryArray.length > 1 && (
            <AnimatedContainer direction="up" delay={0.4}>
              <h2 className="text-3xl font-bold text-foreground mb-8">Project Gallery</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {galleryArray.map((img: string, i: number) => (
                  <motion.div
                    whileHover={{ scale: 1.02 }}
                    key={i}
                    className="relative aspect-video rounded-2xl overflow-hidden border border-border/50 shadow-lg group"
                  >
                    <Image
                      src={img}
                      alt={`${title} screenshot ${i + 1}`}
                      fill
                      className="object-cover object-top transition-transform duration-700 group-hover:scale-110"
                    />
                  </motion.div>
                ))}
              </div>
            </AnimatedContainer>
          )}
        </div>

        {/* Sidebar Info */}
        <div className="space-y-8">
          <AnimatedContainer direction="left" delay={0.3}>
            <div className="sticky top-24 rounded-3xl border border-border/60 bg-card/60 backdrop-blur-xl p-8 shadow-2xl">
              <h3 className="text-xl font-bold text-foreground mb-6 flex items-center gap-2">
                <Cpu className="w-5 h-5 text-indigo-500" /> Tech Stack
              </h3>

              {parsedTech.length > 0 ? (
                <div className="flex flex-wrap gap-2">
                  {parsedTech.map((tech: string, i: number) => (
                    <span
                      key={i}
                      className="px-3 py-1.5 bg-background border border-border/60 rounded-lg text-sm font-medium text-foreground shadow-sm"
                    >
                      {tech}
                    </span>
                  ))}
                </div>
              ) : (
                <p className="text-muted-foreground text-sm">Tech stack details unavailable.</p>
              )}

              <hr className="border-border/60 my-6" />

              <ul className="space-y-6">
                <li>
                  <div className="text-sm text-muted-foreground mb-1">Client</div>
                  <div className="font-semibold text-foreground text-lg">
                    {client || 'Confidential'}
                  </div>
                </li>
                <li>
                  <div className="text-sm text-muted-foreground mb-1">Category</div>
                  <div className="font-semibold text-foreground text-lg">
                    {category || 'Web Development'}
                  </div>
                </li>
              </ul>
            </div>
          </AnimatedContainer>
        </div>
      </section>
    </div>
  );
}
