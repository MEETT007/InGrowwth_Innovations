'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Sparkles } from 'lucide-react';
import { AnimatedContainer } from '@/components/shared/AnimatedContainer';
import { SectionHeader } from '@/components/shared/SectionHeader';
import { technologies } from '@/lib/mock-data';
import { Button } from '@/components/ui/button';

export default function TechnologiesClient() {
  const [activeCategory, setActiveCategory] = useState<string | null>(null);

  const displayed =
    activeCategory === null
      ? technologies
      : technologies.filter((g) => g.category === activeCategory);

  return (
    <div className="flex flex-col min-h-screen relative overflow-hidden bg-background py-12">
      {/* Background glow effects */}
      <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] rounded-full bg-indigo-500/10 blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] rounded-full bg-pink-500/10 blur-[120px] pointer-events-none" />
      <div className="absolute top-[40%] right-[5%] w-[35%] h-[35%] rounded-full bg-purple-500/5 blur-[150px] pointer-events-none" />

      {/* Hero */}
      <section className="relative z-10 max-w-7xl mx-auto px-6 pt-16 pb-8 w-full text-center">
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-600 dark:text-indigo-400 text-xs font-semibold uppercase tracking-wider mb-6"
        >
          <Sparkles className="h-3.5 w-3.5" />
          Our Tech Arsenal
        </motion.div>
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="text-4xl sm:text-5xl font-extrabold tracking-tight text-foreground mb-6"
        >
          Built With the{' '}
          <span className="bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 bg-clip-text text-transparent">
            Best Tools
          </span>
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="text-base sm:text-lg text-muted-foreground max-w-3xl mx-auto leading-relaxed"
        >
          We handpick industry-leading, battle-tested technologies to build fast, reliable, and
          maintainable software — no compromise.
        </motion.p>
      </section>

      {/* Category Filter Tabs */}
      <section className="relative z-10 max-w-7xl mx-auto px-6 py-8 w-full">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="flex flex-wrap justify-center gap-3"
        >
          <Button
            id="tech-filter-all"
            onClick={() => setActiveCategory(null)}
            variant={activeCategory === null ? 'default' : 'outline'}
            size="sm"
            className="rounded-full shadow-xs cursor-pointer"
          >
            All Technologies
          </Button>
          {technologies.map((group) => {
            const isActive = activeCategory === group.category;
            return (
              <Button
                key={group.category}
                id={`tech-filter-${group.category.toLowerCase().replace(/\s+/g, '-')}`}
                onClick={() => setActiveCategory(isActive ? null : group.category)}
                variant="outline"
                size="sm"
                className={`rounded-full transition-all duration-200 cursor-pointer ${
                  isActive ? `${group.colorClass} border-current/30 shadow-md` : ''
                }`}
              >
                {group.category}
              </Button>
            );
          })}
        </motion.div>
      </section>

      {/* Tech Groups */}
      <section className="relative z-10 max-w-7xl mx-auto px-6 py-8 pb-24 w-full">
        <AnimatedContainer direction="up" delay={0.1}>
          <SectionHeader
            title="Technology Stack"
            subtitle="Categories"
            description="Organized by domain — every tool is chosen for production excellence, developer experience, and long-term maintainability."
          />
        </AnimatedContainer>

        <div className="flex flex-col gap-16">
          {displayed.map((group, groupIdx) => (
            <AnimatedContainer key={group.category} direction="up" delay={0.1 + groupIdx * 0.07}>
              <div>
                {/* Category header */}
                <div className="flex items-center gap-3 mb-6">
                  <div className={`h-6 w-1 rounded-full bg-gradient-to-b ${group.gradient}`} />
                  <h3
                    className={`text-lg font-bold tracking-tight bg-gradient-to-r ${group.gradient} bg-clip-text text-transparent`}
                  >
                    {group.category}
                  </h3>
                  <div className="h-px flex-grow bg-gradient-to-r from-border/60 to-transparent" />
                  <span className="text-xs text-muted-foreground font-semibold">
                    {group.items.length} tools
                  </span>
                </div>

                {/* Tech Badge Grid */}
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-8 gap-3">
                  {group.items.map((item, itemIdx) => (
                    <motion.div
                      key={item.name}
                      initial={{ opacity: 0, scale: 0.85, y: 10 }}
                      whileInView={{ opacity: 1, scale: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: 0.04 * itemIdx, duration: 0.35, ease: 'easeOut' }}
                      whileHover={{ scale: 1.06, y: -2 }}
                      className="flex flex-col items-center justify-center gap-2 p-4 rounded-xl bg-card/60 border border-border/50 backdrop-blur-sm cursor-default hover:border-indigo-500/30 hover:shadow-md hover:shadow-indigo-500/10 transition-all duration-200 group/tech"
                    >
                      <span
                        className="text-2xl group-hover/tech:scale-110 transition-transform duration-200"
                        role="img"
                        aria-label={item.name}
                      >
                        {item.emoji}
                      </span>
                      <span className="text-xs font-semibold text-center text-foreground/80 leading-tight">
                        {item.name}
                      </span>
                    </motion.div>
                  ))}
                </div>
              </div>
            </AnimatedContainer>
          ))}
        </div>
      </section>

      {/* Stats Banner */}
      <section className="relative z-10 max-w-7xl mx-auto px-6 pb-20 w-full">
        <AnimatedContainer direction="up" delay={0.1}>
          <div className="relative rounded-2xl bg-gradient-to-br from-indigo-900/40 via-purple-950/40 to-pink-900/40 border border-indigo-500/20 p-10 overflow-hidden">
            <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)]" />
            <div className="absolute top-1/4 left-1/4 w-40 h-40 rounded-full bg-indigo-500/10 blur-3xl" />
            <div className="absolute bottom-1/4 right-1/4 w-40 h-40 rounded-full bg-pink-500/10 blur-3xl" />
            <div className="relative z-10 grid grid-cols-2 sm:grid-cols-4 gap-8 text-center">
              {[
                { value: '40+', label: 'Technologies Mastered' },
                { value: '5', label: 'Tech Domains' },
                { value: '3+', label: 'Years Experience' },
                { value: '100%', label: 'Open to New Tools' },
              ].map((stat) => (
                <div key={stat.label} className="flex flex-col gap-1">
                  <span className="text-3xl font-extrabold bg-gradient-to-r from-indigo-400 to-pink-400 bg-clip-text text-transparent">
                    {stat.value}
                  </span>
                  <span className="text-xs font-semibold text-slate-300 uppercase tracking-wider">
                    {stat.label}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </AnimatedContainer>
      </section>
    </div>
  );
}
