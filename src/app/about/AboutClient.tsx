'use client';

import React from 'react';
import Link from 'next/link';
import { Shield, Cpu, Award, Sparkles, ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { AnimatedContainer } from '@/components/shared/AnimatedContainer';
import { SectionHeader } from '@/components/shared/SectionHeader';
import { Button } from '@/components/ui/button';
import { TeamMember } from '@/generated/prisma/client';

const Linkedin = (props: React.ComponentProps<'svg'>) => (
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

const values = [
  {
    icon: <Shield className="h-6 w-6" />,
    title: 'Integrity First',
    desc: 'We build honest, transparent partnerships. We prioritize clear communication, reliable delivery timelines, and building trust that lasts.',
    colorClass: 'text-indigo-500 dark:text-indigo-400 bg-indigo-500/10',
  },
  {
    icon: <Cpu className="h-6 w-6" />,
    title: 'Relentless Innovation',
    desc: 'Technology is always evolving, and so are we. We leverage cutting-edge frameworks, modern architectural patterns, and smart automation to build for the future.',
    colorClass: 'text-purple-500 dark:text-purple-400 bg-purple-500/10',
  },
  {
    icon: <Award className="h-6 w-6" />,
    title: 'Uncompromised Excellence',
    desc: 'From the first line of code to the final deployment, we maintain the highest engineering standards. Meticulous design, speed, and safety are non-negotiable.',
    colorClass: 'text-pink-500 dark:text-pink-400 bg-pink-500/10',
  },
];

interface AboutClientProps {
  initialTeam: TeamMember[];
}

export default function AboutClient({ initialTeam }: AboutClientProps) {
  return (
    <div className="flex flex-col min-h-screen relative overflow-hidden bg-background py-12">
      {/* Background glow effects */}
      <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] rounded-full bg-indigo-500/10 blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] rounded-full bg-pink-500/10 blur-[120px] pointer-events-none" />

      {/* Header Section */}
      <section className="relative z-10 max-w-7xl mx-auto px-6 pt-16 pb-8 w-full text-center">
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-600 dark:text-indigo-400 text-xs font-semibold uppercase tracking-wider mb-6"
        >
          <Sparkles className="h-3.5 w-3.5" />
          Our Mission & Vision
        </motion.div>
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="text-4xl sm:text-5xl font-extrabold tracking-tight text-foreground mb-6"
        >
          Engineering the{' '}
          <span className="bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 bg-clip-text text-transparent">
            Next Generation
          </span>{' '}
          of Software
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="text-base sm:text-lg text-muted-foreground max-w-3xl mx-auto leading-relaxed"
        >
          We partner with ambitious startups and established enterprises to construct premium,
          modern, and reliable IT solutions built to scale.
        </motion.p>
      </section>

      {/* Company Story Section */}
      <section className="relative z-10 max-w-7xl mx-auto px-6 py-16 w-full grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
        <AnimatedContainer direction="left" className="flex flex-col gap-6">
          <h2 className="text-2xl sm:text-3xl font-bold text-foreground">Our Story</h2>
          <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">
            InGrowwth Innovations was founded with a single mission: to bridge the gap between
            complex enterprise technology and the agile needs of modern companies. We realized that
            many businesses struggle with legacy debt, poor UI design, and unoptimized cloud systems
            that stall product delivery.
          </p>
          <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">
            We assembled a team dedicated to clean code, premium aesthetics, and robust engineering
            architecture. By using modern tools like Next.js, Framer Motion, and robust database
            layers, we help our partners achieve fast launch times without sacrificing quality,
            security, or design integrity.
          </p>
          <div className="pt-2">
            <Button
              render={<Link href="/contact" />}
              nativeButton={false}
              size="default"
              variant="gradient"
              className="cursor-pointer flex items-center gap-2 group"
            >
              Partner With Us
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Button>
          </div>
        </AnimatedContainer>

        <AnimatedContainer
          direction="right"
          className="relative flex justify-center lg:justify-end"
        >
          {/* Abstract Premium CSS Graphic representing Digital Growth */}
          <div className="w-full max-w-md h-80 rounded-2xl bg-gradient-to-br from-indigo-900/40 via-purple-950/40 to-pink-900/40 border border-indigo-500/20 p-6 flex flex-col justify-between shadow-2xl backdrop-blur-md relative overflow-hidden group/graphic">
            {/* Grid pattern background */}
            <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)]" />

            {/* Soft background glows */}
            <div className="absolute top-1/4 left-1/4 w-32 h-32 rounded-full bg-indigo-500/10 blur-2xl group-hover/graphic:bg-indigo-500/20 transition-colors duration-500" />
            <div className="absolute bottom-1/4 right-1/4 w-32 h-32 rounded-full bg-pink-500/10 blur-2xl group-hover/graphic:bg-pink-500/20 transition-colors duration-500" />

            <div className="flex justify-between items-start z-10">
              <span className="text-[10px] font-mono text-indigo-400 bg-indigo-950/50 border border-indigo-500/30 px-2 py-0.5 rounded">
                SYSTEM_STATUS: ACTIVE
              </span>
              <span className="text-[10px] font-mono text-pink-400">v1.0.4</span>
            </div>

            <div className="flex flex-col gap-2 z-10">
              <div className="h-1.5 w-1/3 rounded bg-indigo-500/40 group-hover/graphic:w-1/2 transition-all duration-700" />
              <div className="h-1.5 w-2/3 rounded bg-purple-500/40 group-hover/graphic:w-3/4 transition-all duration-700 delay-75" />
              <div className="h-1.5 w-1/2 rounded bg-pink-500/40 group-hover/graphic:w-full transition-all duration-700 delay-150" />
            </div>

            <div className="flex items-end justify-between z-10">
              <div>
                <p className="text-xl font-bold font-mono tracking-tight text-white">InGrowwth</p>
                <p className="text-xs text-indigo-300 font-mono">Digital Solutions Inc.</p>
              </div>
              <div className="h-12 w-12 rounded-xl bg-gradient-to-tr from-indigo-500 to-pink-500 flex items-center justify-center shadow-lg group-hover/graphic:rotate-6 transition-transform duration-500">
                <Cpu className="h-6 w-6 text-white" />
              </div>
            </div>
          </div>
        </AnimatedContainer>
      </section>

      {/* Core Values Section */}
      <section className="relative z-10 max-w-7xl mx-auto px-6 py-20 w-full border-t border-border/40">
        <AnimatedContainer direction="up" delay={0.1}>
          <SectionHeader
            title="Our Core Values"
            subtitle="What Drives Us"
            description="Our values shape our engineering culture, client relations, and delivery goals daily."
          />
        </AnimatedContainer>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {values.map((v, idx) => (
            <AnimatedContainer key={v.title} direction="up" delay={0.2 + idx * 0.1}>
              <Card className="h-full border-border/50 bg-card/60 backdrop-blur-sm relative overflow-hidden group/value p-2">
                <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/5 to-pink-500/5 opacity-0 group-hover/value:opacity-100 transition-opacity duration-500 pointer-events-none" />
                <CardHeader>
                  <div
                    className={`p-3 w-fit rounded-xl ${v.colorClass} mb-2 group-hover/value:scale-110 transition-transform duration-300`}
                  >
                    {v.icon}
                  </div>
                  <CardTitle className="text-xl font-bold tracking-tight">{v.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-sm text-muted-foreground leading-relaxed">
                    {v.desc}
                  </CardDescription>
                </CardContent>
              </Card>
            </AnimatedContainer>
          ))}
        </div>
      </section>

      {/* Leadership Section */}
      <section className="relative z-10 max-w-7xl mx-auto px-6 py-20 w-full border-t border-border/40">
        <AnimatedContainer direction="up" delay={0.1}>
          <SectionHeader
            title="Meet the Founders"
            subtitle="Our Leadership"
            description="The technical vision and strategic operations behind InGrowwth Innovations."
          />
        </AnimatedContainer>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {initialTeam.map((member, idx) => {
            const initials = member.name
              ? member.name
                  .split(' ')
                  .map((n) => n[0])
                  .join('')
                  .substring(0, 2)
                  .toUpperCase()
              : 'X';
            
            // Generate a deterministic gradient based on name length or index
            const gradients = [
              'from-indigo-600 to-purple-600',
              'from-purple-600 to-pink-600',
              'from-pink-600 to-rose-600',
              'from-emerald-500 to-teal-500',
              'from-blue-500 to-cyan-500',
            ];
            const gradient = gradients[idx % gradients.length];

            return (
              <AnimatedContainer key={member.id || member.name} direction="up" delay={0.2 + idx * 0.1}>
                <Card className="h-full border-border/50 bg-card/60 backdrop-blur-sm relative p-4 flex flex-col justify-between group/member">
                  <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/5 to-pink-500/5 opacity-0 group-hover/member:opacity-100 transition-opacity duration-500 pointer-events-none" />
                  <CardHeader className="pb-4 flex flex-col items-center text-center">
                    {member.photo ? (
                      <div className="w-20 h-20 rounded-full overflow-hidden shadow-lg mb-4 group-hover/member:scale-105 transition-transform duration-300">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img src={member.photo} alt={member.name} className="w-full h-full object-cover" />
                      </div>
                    ) : (
                      <div
                        className={`w-20 h-20 rounded-full bg-gradient-to-br ${gradient} flex items-center justify-center text-white font-extrabold text-2xl shadow-lg mb-4 group-hover/member:scale-105 transition-transform duration-300`}
                      >
                        {initials}
                      </div>
                    )}
                    <CardTitle className="text-xl font-bold tracking-tight mb-1">
                      {member.name}
                    </CardTitle>
                    <span className="text-xs font-semibold text-indigo-500 uppercase tracking-wider mb-3">
                      {member.role}
                    </span>
                    {member.bio && (
                      <CardDescription className="text-sm text-muted-foreground leading-relaxed">
                        {member.bio}
                      </CardDescription>
                    )}
                  </CardHeader>
                  <CardContent className="pt-4 border-t border-border/30 flex justify-center">
                    {member.linkedin ? (
                      <Link
                        href={member.linkedin}
                        target="_blank"
                        rel="noreferrer"
                        className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-indigo-500 transition-colors font-medium"
                      >
                        <Linkedin className="h-4 w-4 text-[#0A66C2]" />
                        Connect on LinkedIn
                      </Link>
                    ) : (
                      <div className="flex gap-3 text-muted-foreground">
                        {/* Placeholder if no linkedin provided but social links exist */}
                      </div>
                    )}
                  </CardContent>
                </Card>
              </AnimatedContainer>
            );
          })}
        </div>
      </section>
    </div>
  );
}
