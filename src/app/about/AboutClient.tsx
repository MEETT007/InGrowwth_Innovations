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
          {/* Ultra-Premium Interactive 3D Card (Dark & Light Mode Supported) */}
          <div className="relative w-full max-w-md h-[26rem] perspective-[2000px] group/supercard flex justify-center lg:justify-end">
            {/* Ambient Mobile Floating Wrapper */}
            <motion.div
              animate={{ y: [0, -8, 0] }}
              transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
              className="w-full h-full"
            >
              <motion.div
                initial={{ opacity: 0, y: 30, rotateX: 15 }}
                whileInView={{ opacity: 1, y: 0, rotateX: 0 }}
                transition={{ duration: 1, type: 'spring', bounce: 0.5 }}
                viewport={{ once: true }}
                className="relative w-full h-full rounded-[2.5rem] transition-all duration-300 ease-out preserve-3d"
                whileHover={{
                  rotateX: 10,
                  rotateY: -15,
                  scale: 1.05,
                  boxShadow:
                    '0 30px 60px -12px rgba(99, 102, 241, 0.4), 0 18px 36px -18px rgba(236, 72, 153, 0.4)',
                }}
                style={{
                  boxShadow: '0 20px 40px -10px rgba(0,0,0,0.2)',
                }}
              >
                {/* Outer Glowing Border Effect (Always visible pulsing on mobile, hover on desktop) */}
                <div className="absolute inset-[-2px] rounded-[2.6rem] bg-gradient-to-r from-indigo-300 via-purple-300 to-pink-300 dark:from-indigo-500 dark:via-purple-500 dark:to-pink-500 opacity-60 md:opacity-0 group-hover/supercard:opacity-100 blur-xl transition-opacity duration-700 pointer-events-none -z-10 animate-pulse" />

                {/* Main Background with Dark/Light Bifurcation */}
                <div className="absolute inset-0 rounded-[2.5rem] bg-gradient-to-br from-indigo-50/90 via-purple-50/90 to-pink-50/90 dark:from-indigo-950/90 dark:via-purple-950/95 dark:to-slate-900/95 border border-indigo-900/10 dark:border-white/10" />

                {/* Inner content container */}
                <div className="absolute inset-0 rounded-[2.5rem] overflow-hidden">
                  {/* Complex Background Noise & Grid */}
                  <div className="absolute inset-0 opacity-[0.05] dark:opacity-[0.03] mix-blend-overlay bg-[url('https://grainy-gradients.vercel.app/noise.svg')]" />
                  <div className="absolute inset-0 bg-[linear-gradient(rgba(0,0,0,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(0,0,0,0.05)_1px,transparent_1px)] dark:bg-[linear-gradient(rgba(255,255,255,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.05)_1px,transparent_1px)] bg-[size:40px_40px] [mask-image:radial-gradient(ellipse_60%_60%_at_50%_50%,#000_40%,transparent_100%)] opacity-50 md:opacity-30 group-hover/supercard:opacity-60 transition-opacity duration-1000" />

                  {/* Moving Orbs */}
                  <motion.div
                    animate={{
                      x: [0, 50, -20, 0],
                      y: [0, -30, 40, 0],
                      scale: [1, 1.2, 0.8, 1],
                    }}
                    transition={{ duration: 8, repeat: Infinity, ease: 'linear' }}
                    className="absolute top-[-10%] left-[-10%] w-[60%] h-[60%] rounded-full bg-indigo-500/20 dark:bg-indigo-500/30 blur-[70px] pointer-events-none"
                  />
                  <motion.div
                    animate={{
                      x: [0, -40, 30, 0],
                      y: [0, 50, -20, 0],
                      scale: [1, 0.9, 1.3, 1],
                    }}
                    transition={{ duration: 10, repeat: Infinity, ease: 'linear' }}
                    className="absolute bottom-[-10%] right-[-10%] w-[60%] h-[60%] rounded-full bg-pink-500/10 dark:bg-pink-500/20 blur-[70px] pointer-events-none"
                  />

                  {/* Glare effect on hover (Static but visible on mobile) */}
                  <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/40 dark:via-white/5 to-transparent opacity-50 md:opacity-0 group-hover/supercard:opacity-100 group-hover/supercard:translate-x-full transition-all duration-1000 ease-in-out pointer-events-none transform translate-x-[-30%] md:-translate-x-full" />
                </div>

                {/* 3D Elevated Content */}
                <div className="relative h-full w-full p-8 flex flex-col justify-between z-10 translate-z-[60px] preserve-3d">
                  {/* Header */}
                  <div className="flex justify-between items-start translate-z-[40px]">
                    <div className="inline-flex items-center gap-2 bg-emerald-500/20 dark:bg-emerald-500/10 border border-emerald-600/30 dark:border-emerald-500/20 px-3 py-1.5 rounded-full backdrop-blur-md shadow-[0_0_15px_rgba(16,185,129,0.1)] dark:shadow-[0_0_15px_rgba(16,185,129,0.2)]">
                      <div className="h-2 w-2 rounded-full bg-emerald-600 dark:bg-emerald-400 shadow-[0_0_10px_rgba(5,150,105,1)] dark:shadow-[0_0_10px_rgba(52,211,153,1)] animate-ping" />
                      <span className="text-[10px] font-mono font-bold text-emerald-700 dark:text-emerald-400 uppercase tracking-widest">
                        System Live
                      </span>
                    </div>
                    <div className="flex items-center gap-1.5 opacity-100 md:opacity-60 dark:md:opacity-50 group-hover/supercard:opacity-100 transition-opacity">
                      <Sparkles className="h-4 w-4 text-pink-600 dark:text-pink-400" />
                      <span className="text-[10px] font-mono text-pink-700 dark:text-pink-400 font-bold dark:font-normal">
                        v2.0.MAX
                      </span>
                    </div>
                  </div>

                  {/* Central Hologram Data */}
                  <div className="flex-1 flex flex-col justify-center mt-4 translate-z-[80px]">
                    <div className="relative w-full h-32 flex items-end justify-between gap-2">
                      {/* Animated Data Bars */}
                      {[
                        {
                          h: 30,
                          color: 'from-indigo-600 to-indigo-400',
                          shadow: 'rgba(79,70,229,0.5)',
                        },
                        {
                          h: 60,
                          color: 'from-purple-600 to-purple-400',
                          shadow: 'rgba(147,51,234,0.5)',
                        },
                        {
                          h: 45,
                          color: 'from-pink-600 to-pink-400',
                          shadow: 'rgba(219,39,119,0.5)',
                        },
                        {
                          h: 90,
                          color: 'from-rose-600 to-rose-400',
                          shadow: 'rgba(225,29,72,0.5)',
                        },
                        {
                          h: 75,
                          color: 'from-fuchsia-600 to-fuchsia-400',
                          shadow: 'rgba(192,38,211,0.5)',
                        },
                        {
                          h: 100,
                          color: 'from-violet-600 to-violet-400',
                          shadow: 'rgba(124,58,237,0.5)',
                        },
                      ].map((bar, i) => (
                        <div
                          key={i}
                          className="relative w-full bg-black/5 dark:bg-white/5 rounded-t-md overflow-hidden h-full group/bar border border-black/5 dark:border-white/5"
                        >
                          <motion.div
                            initial={{ height: 0 }}
                            whileInView={{ height: `${bar.h}%` }}
                            transition={{
                              duration: 1.5,
                              delay: i * 0.15,
                              type: 'spring',
                              bounce: 0.6,
                            }}
                            className={`absolute bottom-0 w-full rounded-t-md bg-gradient-to-t ${bar.color} opacity-100 md:opacity-90 dark:md:opacity-80 group-hover/supercard:opacity-100 shadow-[0_0_20px_${bar.shadow}]`}
                          >
                            <div className="absolute top-0 w-full h-1 bg-white/70 dark:bg-white/50" />
                          </motion.div>
                        </div>
                      ))}
                    </div>

                    {/* Floating Data Points */}
                    <div className="flex justify-between mt-4 text-[10px] font-mono text-indigo-900/60 dark:text-indigo-300/70 font-extrabold dark:font-normal uppercase tracking-widest">
                      <span>Latency: 12ms</span>
                      <span>Load: 98%</span>
                      <span>Sync: OK</span>
                    </div>
                  </div>

                  {/* Footer Brand */}
                  <div className="flex items-end justify-between mt-8 translate-z-[60px]">
                    <div>
                      <motion.h3 className="text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-indigo-950 via-purple-900 to-indigo-900 dark:from-white dark:via-indigo-100 dark:to-white drop-shadow-[0_0_15px_rgba(255,255,255,0.8)] dark:drop-shadow-[0_0_15px_rgba(255,255,255,0.3)] tracking-tight">
                        InGrowwth
                      </motion.h3>
                      <p className="text-sm font-bold dark:font-semibold text-indigo-700 dark:text-indigo-300 mt-1 tracking-widest uppercase flex items-center gap-2">
                        Innovations{' '}
                        <span className="h-px w-6 bg-indigo-500/40 dark:bg-indigo-500/50 block" />
                      </p>
                    </div>
                    <motion.div
                      animate={{ scale: [1, 1.05, 1] }}
                      transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
                      whileHover={{ rotate: 360, scale: 1.15 }}
                      className="h-16 w-16 rounded-[1.25rem] bg-gradient-to-br from-indigo-400 via-purple-400 to-pink-400 dark:from-indigo-500 dark:via-purple-500 dark:to-pink-500 p-[1.5px] shadow-[0_0_20px_rgba(167,139,250,0.3)] dark:shadow-[0_0_30px_rgba(167,139,250,0.5)] cursor-pointer"
                    >
                      <div className="h-full w-full rounded-[1.2rem] bg-white/90 dark:bg-[#0f172a] flex items-center justify-center relative overflow-hidden group/icon backdrop-blur-md">
                        <div className="absolute inset-0 bg-black/5 dark:bg-white/5 group-hover/icon:bg-black/10 dark:group-hover/icon:bg-white/20 transition-colors" />
                        <Cpu className="h-7 w-7 text-indigo-900 dark:text-white drop-shadow-sm dark:drop-shadow-[0_0_8px_rgba(255,255,255,0.8)]" />
                      </div>
                    </motion.div>
                  </div>
                </div>
              </motion.div>
            </motion.div>
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
              <AnimatedContainer
                key={member.id || member.name}
                direction="up"
                delay={0.2 + idx * 0.1}
              >
                <Card className="h-full border-border/50 bg-card/60 backdrop-blur-sm relative p-4 flex flex-col justify-between group/member">
                  <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/5 to-pink-500/5 opacity-0 group-hover/member:opacity-100 transition-opacity duration-500 pointer-events-none" />
                  <CardHeader className="pb-4 flex flex-col items-center text-center">
                    {member.photo ? (
                      <div className="w-20 h-20 rounded-full overflow-hidden shadow-lg mb-4 group-hover/member:scale-105 transition-transform duration-300">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={member.photo}
                          alt={member.name}
                          className="w-full h-full object-cover"
                        />
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
