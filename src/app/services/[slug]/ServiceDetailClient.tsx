'use client';

import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import {
  ArrowLeft,
  ArrowRight,
  Code,
  Monitor,
  Smartphone,
  Cloud,
  Cpu,
  Shield,
  Layers,
  BrainCircuit,
  Link as LinkIcon,
  BarChart3,
  Briefcase,
  Palette,
  MonitorSmartphone,
  CheckCircle2,
  TerminalSquare,
  Database,
  BarChart3 as BarChartIcon,
} from 'lucide-react';
import {
  SiPython,
  SiTensorflow,
  SiPytorch,
  SiHuggingface,
  SiDocker,
  SiReact,
  SiFlutter,
  SiSwift,
  SiKotlin,
  SiFirebase,
  SiNodedotjs,
  SiSolidity,
  SiEthereum,
  SiRust,
  SiIpfs,
  SiKalilinux,
  SiWireshark,
  SiSplunk,
  SiOdoo,
  SiPostgresql,
  SiJavascript,
} from 'react-icons/si';
import { FaAws } from 'react-icons/fa';
import { AnimatedContainer } from '@/components/shared/AnimatedContainer';
import { Button } from '@/components/ui/button';

interface DBService {
  id: string;
  slug: string | null;
  title: string;
  description: string;
  icon: string;
  content: string;
  features: string[] | null;
  process: { step: string; details: string }[] | null;
  techStack: string[] | null;
}

interface ServiceDetailClientProps {
  service: DBService;
}

const ICONS_MAP: Record<string, React.ElementType> = {
  Monitor,
  Smartphone,
  Cloud,
  Cpu,
  Shield,
  Layers,
  Code,
  BrainCircuit,
  Link: LinkIcon,
  BarChart3,
  Briefcase,
  Palette,
  MonitorSmartphone,
};

const IconComponent = ({ name, className }: { name: string; className?: string }) => {
  const Icon = ICONS_MAP[name] || Code;
  return <Icon className={className || 'w-8 h-8'} />;
};

export default function ServiceDetailClient({ service }: ServiceDetailClientProps) {
  const colorClass = 'bg-indigo-500/10 text-indigo-500';
  const gradient = 'from-indigo-500 via-purple-500 to-pink-500';

  return (
    <div className="flex flex-col min-h-screen relative overflow-hidden bg-background py-12">
      {/* Background glow effects */}
      <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] rounded-full bg-indigo-500/10 blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] rounded-full bg-pink-500/10 blur-[120px] pointer-events-none" />

      {/* Back Button */}
      <div className="relative z-10 max-w-7xl mx-auto px-6 pt-24 md:pt-32 w-full">
        <Link
          href="/services"
          className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors font-medium group"
        >
          <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-1" />
          Back to Services
        </Link>
      </div>

      {/* Hero Section */}
      <section className="relative z-10 max-w-7xl mx-auto px-6 pt-10 pb-20 w-full flex flex-col lg:flex-row items-center gap-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="flex flex-col gap-6 max-w-2xl flex-1"
        >
          {/* Icon badge */}
          <div
            className={`p-4 w-fit rounded-2xl ${colorClass} shadow-lg ring-1 ring-indigo-500/20`}
          >
            <IconComponent name={service.icon} />
          </div>

          {/* Title */}
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight text-foreground">
            <span className={`bg-gradient-to-r ${gradient} bg-clip-text text-transparent`}>
              {service.title}
            </span>
          </h1>

          {/* Description */}
          <p className="text-lg sm:text-xl text-muted-foreground leading-relaxed">
            {service.description}
          </p>

          {/* CTA */}
          <div className="flex flex-col sm:flex-row gap-4 mt-4">
            <Button
              render={<Link href={`/contact?type=quote&service=${service.slug || service.id}`} />}
              nativeButton={false}
              size="lg"
              variant="gradient"
              className="cursor-pointer flex items-center gap-2 group w-fit"
            >
              Request a Quote
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Button>
            <Button
              render={<Link href="/contact" />}
              nativeButton={false}
              variant="outline"
              size="lg"
              className="cursor-pointer border-border hover:bg-muted/50 w-fit"
            >
              Talk to an Expert
            </Button>
          </div>
        </motion.div>

        {/* Floating Feature Graphic */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.7, delay: 0.2 }}
          className="flex-1 w-full relative hidden lg:block"
        >
          {/* Glowing Orb */}
          <div className="absolute inset-0 bg-gradient-to-tr from-indigo-500/30 to-pink-500/30 blur-[80px] rounded-full animate-pulse" />

          <div className="relative h-[450px] w-full flex items-center justify-center">
            {/* Main Center Card */}
            <motion.div
              animate={{ y: [0, -10, 0] }}
              transition={{ repeat: Infinity, duration: 4, ease: 'easeInOut' }}
              className="absolute z-20 bg-card/40 backdrop-blur-xl border border-white/10 dark:border-white/5 rounded-3xl p-12 shadow-2xl overflow-hidden flex items-center justify-center"
            >
              <IconComponent
                name={service.icon}
                className="w-40 h-40 text-indigo-500 drop-shadow-2xl"
              />
            </motion.div>

            {/* Floating Element 1 */}
            <motion.div
              animate={{ y: [0, 15, 0], rotate: [0, 5, 0] }}
              transition={{ repeat: Infinity, duration: 5, ease: 'easeInOut' }}
              className="absolute z-30 top-[15%] right-[10%] bg-card/60 backdrop-blur-md border border-white/10 rounded-2xl p-4 shadow-xl flex items-center gap-3"
            >
              <div className="w-10 h-10 rounded-full bg-green-500/20 flex items-center justify-center">
                <CheckCircle2 className="w-5 h-5 text-green-500" />
              </div>
              <div className="flex flex-col">
                <div className="h-2 w-16 bg-muted rounded-full mb-2" />
                <div className="h-2 w-10 bg-muted/50 rounded-full" />
              </div>
            </motion.div>

            {/* Floating Element 2 */}
            <motion.div
              animate={{ y: [0, -15, 0], rotate: [0, -5, 0] }}
              transition={{ repeat: Infinity, duration: 6, ease: 'easeInOut', delay: 1 }}
              className="absolute z-10 bottom-[15%] left-[5%] bg-card/60 backdrop-blur-md border border-white/10 rounded-2xl p-4 shadow-xl flex items-center gap-3"
            >
              <div className="w-10 h-10 rounded-full bg-indigo-500/20 flex items-center justify-center">
                <BarChart3 className="w-5 h-5 text-indigo-500" />
              </div>
              <div className="flex gap-1 items-end h-8">
                <div className="w-2 h-4 bg-indigo-500/40 rounded-t-sm" />
                <div className="w-2 h-6 bg-indigo-500/70 rounded-t-sm" />
                <div className="w-2 h-8 bg-indigo-500 rounded-t-sm" />
              </div>
            </motion.div>

            {/* Decorative Grid */}
            <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px] [mask-image:radial-gradient(ellipse_50%_50%_at_50%_50%,#000_60%,transparent_100%)] pointer-events-none" />
          </div>
        </motion.div>
      </section>

      {/* Main Content */}
      <section className="relative z-10 max-w-7xl mx-auto px-6 py-20 w-full border-t border-border/10">
        <AnimatedContainer direction="up" delay={0.1} className="max-w-4xl mx-auto relative">
          <div className="absolute -top-10 -left-6 text-9xl text-indigo-500/10 font-serif leading-none select-none">
            &quot;
          </div>
          <h2 className="text-3xl font-bold mb-10 text-foreground text-center">
            About the Service
          </h2>
          <p className="text-xl sm:text-2xl text-foreground/80 leading-relaxed text-center font-medium relative z-10">
            {service.content}
          </p>
          <div className="absolute -bottom-16 -right-6 text-9xl text-indigo-500/10 font-serif leading-none select-none rotate-180">
            &quot;
          </div>
        </AnimatedContainer>
      </section>

      {/* Features Grid */}
      {service.features && service.features.length > 0 && (
        <section className="relative z-10 max-w-7xl mx-auto px-6 py-16 w-full">
          <AnimatedContainer direction="up" delay={0.2}>
            <h2 className="text-3xl font-bold mb-10 text-foreground text-center">Key Features</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {service.features.map((feature, idx) => (
                <motion.div
                  key={idx}
                  whileHover={{ y: -5 }}
                  className="bg-card/50 backdrop-blur-md border border-white/10 p-6 rounded-2xl shadow-lg hover:shadow-indigo-500/10 hover:border-indigo-500/30 transition-all flex items-start gap-4"
                >
                  <CheckCircle2 className="w-6 h-6 text-indigo-500 shrink-0 mt-1" />
                  <span className="text-foreground font-medium leading-relaxed">{feature}</span>
                </motion.div>
              ))}
            </div>
          </AnimatedContainer>
        </section>
      )}

      {/* Development Process */}
      {service.process && service.process.length > 0 && (
        <section className="relative z-10 bg-muted/30 py-20 border-y border-border/40 mt-10">
          <div className="max-w-7xl mx-auto px-6 w-full">
            <AnimatedContainer direction="up" delay={0.1}>
              <h2 className="text-3xl font-bold mb-12 text-foreground text-center">Our Process</h2>
              <div className="relative">
                {/* Horizontal line for desktop */}
                <div className="hidden md:block absolute top-1/2 left-0 w-full h-0.5 bg-border -translate-y-1/2 z-0" />

                <div className="grid grid-cols-1 md:grid-cols-5 gap-8">
                  {service.process.map((step, idx) => (
                    <motion.div
                      key={idx}
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: idx * 0.1 }}
                      className="relative z-10 flex flex-col items-center text-center group"
                    >
                      <div className="w-16 h-16 rounded-2xl bg-background border-2 border-indigo-500/30 shadow-lg flex items-center justify-center text-2xl font-bold text-indigo-500 mb-6 group-hover:scale-110 group-hover:border-indigo-500 transition-all">
                        {idx + 1}
                      </div>
                      <h3 className="text-xl font-bold text-foreground mb-3">{step.step}</h3>
                      <p className="text-sm text-muted-foreground leading-relaxed">
                        {step.details}
                      </p>
                    </motion.div>
                  ))}
                </div>
              </div>
            </AnimatedContainer>
          </div>
        </section>
      )}

      {/* Tech Stack */}
      {service.techStack && service.techStack.length > 0 && (
        <section className="relative z-10 max-w-7xl mx-auto px-6 py-20 w-full">
          <AnimatedContainer direction="up" delay={0.1}>
            <div className="bg-card/40 backdrop-blur-xl border border-indigo-500/10 rounded-3xl p-10 md:p-16 shadow-2xl relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-b from-indigo-500/5 to-transparent pointer-events-none" />
              <div className="relative z-10">
                <h2 className="text-3xl font-bold mb-12 text-foreground text-center flex items-center justify-center gap-3">
                  <TerminalSquare className="w-8 h-8 text-indigo-500" />
                  Technologies We Use
                </h2>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-6 justify-center items-center">
                  {service.techStack.map((tech, idx) => {
                    const name = tech.toLowerCase();
                    let TechIcon: React.ElementType = TerminalSquare;

                    // Direct React Icons mapping
                    if (name.includes('python')) TechIcon = SiPython;
                    else if (name.includes('tensorflow')) TechIcon = SiTensorflow;
                    else if (name.includes('pytorch')) TechIcon = SiPytorch;
                    else if (name.includes('huggingface')) TechIcon = SiHuggingface;
                    else if (name.includes('docker')) TechIcon = SiDocker;
                    else if (name.includes('react')) TechIcon = SiReact;
                    else if (name.includes('flutter')) TechIcon = SiFlutter;
                    else if (name.includes('swift')) TechIcon = SiSwift;
                    else if (name.includes('kotlin')) TechIcon = SiKotlin;
                    else if (name.includes('firebase')) TechIcon = SiFirebase;
                    else if (name.includes('node')) TechIcon = SiNodedotjs;
                    else if (name.includes('solidity')) TechIcon = SiSolidity;
                    else if (name.includes('ethereum')) TechIcon = SiEthereum;
                    else if (name.includes('rust')) TechIcon = SiRust;
                    else if (name.includes('ipfs')) TechIcon = SiIpfs;
                    else if (name.includes('kali')) TechIcon = SiKalilinux;
                    else if (name.includes('wireshark')) TechIcon = SiWireshark;
                    else if (name.includes('splunk')) TechIcon = SiSplunk;
                    else if (name.includes('odoo')) TechIcon = SiOdoo;
                    else if (name.includes('postgre')) TechIcon = SiPostgresql;
                    else if (name.includes('javascript') || name.includes('js'))
                      TechIcon = SiJavascript;
                    else if (name.includes('aws')) TechIcon = FaAws;

                    // Fallbacks for missing React Icons
                    else if (
                      name.includes('openai') ||
                      name.includes('ai') ||
                      name.includes('tensor')
                    )
                      TechIcon = BrainCircuit;
                    else if (
                      name.includes('web3') ||
                      name.includes('sql') ||
                      name.includes('oracle') ||
                      name.includes('mongo') ||
                      name.includes('database')
                    )
                      TechIcon = Database;
                    else if (name.includes('tableau') || name.includes('powerbi'))
                      TechIcon = BarChartIcon;
                    else if (name.includes('azure') || name.includes('cloud')) TechIcon = Cloud;
                    else if (name.includes('security') || name.includes('crowdstrike'))
                      TechIcon = Shield;
                    else if (
                      name.includes('onestream') ||
                      name.includes('hyperion') ||
                      name.includes('erp') ||
                      name.includes('epm')
                    )
                      TechIcon = Briefcase;

                    return (
                      <motion.div
                        key={idx}
                        whileHover={{ scale: 1.05, y: -5 }}
                        className="flex flex-col items-center justify-center gap-4 p-6 rounded-2xl bg-background/80 border border-white/5 shadow-sm hover:shadow-indigo-500/20 hover:border-indigo-500/40 transition-all cursor-default group"
                      >
                        <div className="w-14 h-14 relative flex items-center justify-center rounded-xl bg-gradient-to-br from-indigo-500/10 to-purple-500/10 border border-indigo-500/20 group-hover:border-indigo-500/50 group-hover:shadow-lg group-hover:shadow-indigo-500/20 transition-all duration-300">
                          <TechIcon className="w-7 h-7 text-indigo-500 group-hover:text-purple-500 transition-colors" />
                        </div>
                        <span className="text-foreground font-semibold text-sm text-center">
                          {tech}
                        </span>
                      </motion.div>
                    );
                  })}
                </div>
              </div>
            </div>
          </AnimatedContainer>
        </section>
      )}

      {/* Other Services */}
      <section className="relative z-10 max-w-7xl mx-auto px-6 py-16 w-full border-t border-border/40">
        <AnimatedContainer direction="up" delay={0.1}>
          <div className="flex items-center justify-between mb-2">
            <h2 className="text-2xl sm:text-3xl font-bold text-foreground">
              Explore Other Services
            </h2>
            <Link
              href="/services"
              className="text-sm text-indigo-500 hover:text-indigo-400 font-semibold flex items-center gap-1 group"
            >
              View All
              <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1" />
            </Link>
          </div>
        </AnimatedContainer>
      </section>

      {/* CTA Banner */}
      <section className="relative z-10 max-w-7xl mx-auto px-6 pb-20 w-full">
        <AnimatedContainer direction="up" delay={0.1}>
          <div className="relative rounded-2xl bg-gradient-to-br from-indigo-100/60 via-purple-100/60 to-pink-100/60 dark:from-indigo-900/40 dark:via-purple-950/40 dark:to-pink-900/40 border border-indigo-200/50 dark:border-indigo-500/20 p-10 text-center overflow-hidden">
            <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)]" />
            <div className="absolute top-1/4 left-1/4 w-32 h-32 rounded-full bg-indigo-500/10 blur-2xl" />
            <div className="absolute bottom-1/4 right-1/4 w-32 h-32 rounded-full bg-pink-500/10 blur-2xl" />
            <div className="relative z-10">
              <h2 className="text-2xl sm:text-3xl font-extrabold text-indigo-950 dark:text-white mb-4">
                Ready to get started with{' '}
                <span className={`bg-gradient-to-r ${gradient} bg-clip-text text-transparent`}>
                  {service.title}
                </span>
                ?
              </h2>
              <p className="text-muted-foreground mb-8 max-w-xl mx-auto leading-relaxed">
                Our team is ready to scope your project and deliver a tailored solution that exceeds
                expectations.
              </p>
              <Button
                render={<Link href={`/contact?type=quote&service=${service.slug || service.id}`} />}
                nativeButton={false}
                size="lg"
                variant="gradient"
                className="cursor-pointer flex items-center gap-2 group mx-auto"
              >
                Start Your Project
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Button>
            </div>
          </div>
        </AnimatedContainer>
      </section>
    </div>
  );
}
