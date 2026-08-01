'use client';

import Link from 'next/link';
import { ArrowRight, Sparkles, Star, Code, Cloud, Layers, Quote } from 'lucide-react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { AnimatedContainer } from '@/components/shared/AnimatedContainer';
import { SectionHeader } from '@/components/shared/SectionHeader';

const services = [
  {
    icon: <Code className="h-6 w-6" />,
    title: 'Web & Mobile Development',
    desc: 'Custom web applications and native mobile apps built with React, Next.js, and Flutter for maximum speed, SEO optimization, and premium responsiveness.',
  },
  {
    icon: <Cloud className="h-6 w-6" />,
    title: 'Cloud & DevOps Solutions',
    desc: 'Seamless cloud migrations, automated CI/CD pipelines, containerized microservices, and secure enterprise-grade hosting architectures optimized for cost.',
  },
  {
    icon: <Layers className="h-6 w-6" />,
    title: 'ERP & Enterprise Software',
    desc: 'Tailored ERP systems, CRM integrations, business process automation, and custom API connections designed to streamline your daily operations.',
  },
];

const testimonials = [
  {
    quote:
      'InGrowwth Innovations transformed our legacy platform into a blazing-fast Next.js application. Our conversion rates increased by 40% in just two months! The performance optimizations are world-class.',
    name: 'Sarah Jenkins',
    role: 'CTO',
    company: 'FinFlow',
    rating: 5,
    initials: 'SJ',
    gradient: 'from-indigo-500 to-purple-500',
  },
  {
    quote:
      'Their team delivered our custom mobile app on time and within budget. The UI design is absolutely beautiful, feels extremely premium, and our user engagement metrics have skyrocketed.',
    name: 'Marcus Chen',
    role: 'Founder',
    company: 'VeloTech',
    rating: 5,
    initials: 'MC',
    gradient: 'from-purple-500 to-pink-500',
  },
  {
    quote:
      'The ERP integration they built saved us hundreds of hours of manual work. Their software engineering quality is top-tier, and their communication was transparent throughout the project.',
    name: 'Elena Rostova',
    role: 'COO',
    company: 'Apex Logistics',
    rating: 5,
    initials: 'ER',
    gradient: 'from-pink-500 to-rose-500',
  },
];

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen relative overflow-hidden bg-background">
      {/* Background glow effects */}
      <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] rounded-full bg-indigo-500/10 blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] rounded-full bg-pink-500/10 blur-[120px] pointer-events-none" />
      <div className="absolute top-[40%] right-[10%] w-[40%] h-[40%] rounded-full bg-purple-500/5 blur-[150px] pointer-events-none" />

      {/* Hero Section */}
      <section className="relative z-10 max-w-7xl mx-auto px-6 pt-28 pb-32 md:pt-40 md:pb-44 flex flex-col items-center text-center">
        {/* Sub-header badge */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-600 dark:text-indigo-400 text-xs font-semibold uppercase tracking-wider mb-8"
        >
          <Sparkles className="h-3.5 w-3.5" />
          Enterprise-Grade Engineering
        </motion.div>

        {/* Headline */}
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="text-4xl sm:text-6xl md:text-7xl font-extrabold tracking-tight text-foreground max-w-5xl leading-[1.15] mb-6"
        >
          Innovating the Future of{' '}
          <span className="bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 bg-clip-text text-transparent">
            IT Solutions
          </span>
        </motion.h1>

        {/* Sub-headline */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="text-lg sm:text-xl text-muted-foreground max-w-3xl leading-relaxed mb-10"
        >
          InGrowwth Innovations delivers modern full-stack web applications, dynamic user
          interfaces, and cloud architectures optimized for long-term scalability and business
          growth.
        </motion.p>

        {/* CTAs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="flex flex-col sm:flex-row gap-4 items-center justify-center w-full max-w-md"
        >
          <motion.div
            animate={{ y: [0, -6, 0] }}
            transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
          >
            <Button
              render={<Link href="/contact?type=quote" />}
              nativeButton={false}
              size="lg"
              variant="gradient"
              className="w-full sm:w-auto cursor-pointer group shadow-lg shadow-indigo-500/20"
            >
              Get a Quote
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Button>
          </motion.div>
          <Button
            render={<Link href="/services" />}
            nativeButton={false}
            variant="outline"
            size="lg"
            className="w-full sm:w-auto cursor-pointer"
          >
            View Services
          </Button>
        </motion.div>

        {/* Floating Mouse Scroll Animation */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8, duration: 0.6 }}
          className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 pointer-events-none"
        >
          <span className="text-[10px] font-semibold text-muted-foreground uppercase tracking-widest">
            Scroll to explore
          </span>
          <div className="w-5 h-9 rounded-full border-2 border-muted-foreground/30 flex justify-center p-1.5">
            <motion.div
              animate={{
                y: [0, 10, 0],
              }}
              transition={{
                duration: 1.8,
                repeat: Infinity,
                ease: 'easeInOut',
              }}
              className="w-1 h-1.5 rounded-full bg-indigo-500"
            />
          </div>
        </motion.div>
      </section>

      {/* Services/Features Section */}
      <section className="relative z-10 max-w-7xl mx-auto px-6 py-24 w-full border-t border-border/40">
        <AnimatedContainer direction="up" delay={0.1}>
          <SectionHeader
            title="Our Core Expertise"
            subtitle="Top Services"
            description="We build robust digital infrastructure designed to elevate operations, increase product velocities, and scale with ease."
          />
        </AnimatedContainer>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {services.map((service, idx) => (
            <AnimatedContainer key={service.title} direction="up" delay={0.2 + idx * 0.1}>
              <Card className="h-full border-border/50 bg-card/60 backdrop-blur-sm relative overflow-hidden group/service p-2">
                <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/5 to-pink-500/5 opacity-0 group-hover/service:opacity-100 transition-opacity duration-500 pointer-events-none" />
                <CardHeader>
                  <div className="p-3 w-fit rounded-xl bg-indigo-500/10 text-indigo-500 dark:text-indigo-400 mb-2 group-hover/service:scale-110 transition-transform duration-300">
                    {service.icon}
                  </div>
                  <CardTitle className="text-xl font-bold tracking-tight">
                    {service.title}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-sm text-muted-foreground leading-relaxed">
                    {service.desc}
                  </CardDescription>
                </CardContent>
              </Card>
            </AnimatedContainer>
          ))}
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="relative z-10 max-w-7xl mx-auto px-6 py-24 w-full border-t border-border/40">
        <AnimatedContainer direction="up" delay={0.1}>
          <SectionHeader
            title="What Our Clients Say"
            subtitle="Testimonials"
            description="Read how our premium engineering and modern designs have helped companies scale and reach new heights."
          />
        </AnimatedContainer>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((t, idx) => (
            <AnimatedContainer key={t.name} direction="up" delay={0.2 + idx * 0.1}>
              <Card className="h-full border-border/50 bg-card/60 backdrop-blur-sm relative p-4 flex flex-col justify-between group/testimonial">
                <CardHeader className="pb-4 relative">
                  <Quote className="absolute top-2 right-4 h-12 w-12 text-muted/30 pointer-events-none" />
                  {/* Rating Stars */}
                  <div className="flex gap-1 mb-4">
                    {Array.from({ length: t.rating }).map((_, i) => (
                      <Star key={i} className="h-4 w-4 fill-amber-400 text-amber-400" />
                    ))}
                  </div>
                  <p className="text-foreground/90 italic leading-relaxed text-sm">
                    &ldquo;{t.quote}&rdquo;
                  </p>
                </CardHeader>
                <CardContent className="pt-4 border-t border-border/30 flex items-center gap-3">
                  <div
                    className={`w-10 h-10 rounded-full bg-gradient-to-br ${t.gradient} flex items-center justify-center text-white font-bold text-sm shadow-inner`}
                  >
                    {t.initials}
                  </div>
                  <div>
                    <h4 className="font-semibold text-foreground text-sm leading-tight">
                      {t.name}
                    </h4>
                    <p className="text-xs text-muted-foreground">
                      {t.role}, <span className="font-medium text-foreground/70">{t.company}</span>
                    </p>
                  </div>
                </CardContent>
              </Card>
            </AnimatedContainer>
          ))}
        </div>
      </section>
    </div>
  );
}
