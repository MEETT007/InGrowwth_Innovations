'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'sonner';
import {
  Mail,
  Phone,
  MapPin,
  Clock,
  Send,
  FileText,
  Sparkles,
  CheckCircle,
  ChevronRight,
  ChevronDown,
  Check,
  UploadCloud,
  FileCheck,
  ShieldCheck,
  Layers,
  Cpu,
  Cloud,
  Smartphone,
  Shield,
  Briefcase,
  ExternalLink,
  Trash2,
  HelpCircle,
  Lock,
} from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent } from '@/components/ui/card';
import { AnimatedContainer } from '@/components/shared/AnimatedContainer';
import { ContactSchema, QuoteSchema, ContactInput, QuoteInput } from '@/schemas/lead';
import { submitContactAction, submitQuoteAction } from '@/actions/lead';
import { logger } from '@/lib/logger';

// Enterprise Service Categories with icons & subtitles
const SERVICE_OPTIONS = [
  {
    id: 'ai-machine-learning',
    title: 'AI & Machine Learning',
    subtitle: 'Custom LLMs, RAG Pipelines, Autonomous Multi-Agents & Vision',
    icon: Cpu,
    color: 'text-indigo-400 bg-indigo-500/10 border-indigo-500/20',
    badge: 'Popular',
  },
  {
    id: 'cloud-devops-solutions',
    title: 'Cloud & DevOps Solutions',
    subtitle: 'Kubernetes EKS/GKE, Multi-Region IaC, Zero-Downtime GitOps',
    icon: Cloud,
    color: 'text-sky-400 bg-sky-500/10 border-sky-500/20',
  },
  {
    id: 'web-development',
    title: 'Full-Stack Web Development',
    subtitle: 'High-Performance Next.js 16, Enterprise SaaS, Headless Commerce',
    icon: Layers,
    color: 'text-purple-400 bg-purple-500/10 border-purple-500/20',
    badge: 'High Velocity',
  },
  {
    id: 'mobile-app-development',
    title: 'Mobile App Engineering',
    subtitle: 'Cross-Platform Flutter & Native Swift/Kotlin with Offline Sync',
    icon: Smartphone,
    color: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20',
  },
  {
    id: 'erp-enterprise-software',
    title: 'ERP & Enterprise Software',
    subtitle: 'Modular Business Systems, Inventory, Invoicing & Global Supply',
    icon: Layers,
    color: 'text-amber-400 bg-amber-500/10 border-amber-500/20',
  },
  {
    id: 'cybersecurity',
    title: 'Cybersecurity & Auditing',
    subtitle: 'Penetration Testing, Infrastructure Hardening & SOC-2 Compliance',
    icon: Shield,
    color: 'text-rose-400 bg-rose-500/10 border-rose-500/20',
  },
  {
    id: 'onestream-epm',
    title: 'OneStream EPM & Finance',
    subtitle: 'Corporate Financial Consolidation & Rolling Forecasting Models',
    icon: Briefcase,
    color: 'text-cyan-400 bg-cyan-500/10 border-cyan-500/20',
  },
  {
    id: 'custom-consulting',
    title: 'Custom Architecture Discovery',
    subtitle: 'Technical Due Diligence, System Architecture Audit & Advisory',
    icon: Sparkles,
    color: 'text-pink-400 bg-pink-500/10 border-pink-500/20',
  },
];

// Budget tiers with clear context
const BUDGET_OPTIONS = [
  {
    value: '< $5k',
    label: '< $5,000',
    tier: 'Proof of Concept / Sprint',
    description: 'Rapid technical prototyping or focused feature deployment',
  },
  {
    value: '$5k - $15k',
    label: '$5,000 – $15,000',
    tier: 'Startup / MVP Build',
    description: 'Full MVP development, sleek modern UI & core backend integration',
    popular: true,
  },
  {
    value: '$15k - $35k',
    label: '$15,000 – $35,000',
    tier: 'Scale & Growth Platform',
    description: 'Production-ready platform, mobile app, microservices, auth & billing',
  },
  {
    value: '$35k - $75k',
    label: '$35,000 – $75,000',
    tier: 'Enterprise System',
    description: 'Multi-region cloud infrastructure, high-throughput pipelines & security',
  },
  {
    value: '$75k+',
    label: '$75,000+',
    tier: 'Large-Scale Transformation',
    description: 'Bespoke corporate architecture, custom AI models & enterprise ERP',
  },
];

// Timeline options with clear agility metrics
const TIMELINE_OPTIONS = [
  {
    value: 'Immediate (< 1 month)',
    label: 'Immediate / Urgent (< 1 Mo)',
    badge: 'Fast-Track',
    description: 'Rapid squad deployment for mission-critical deadlines',
  },
  {
    value: '1-3 months',
    label: '1 – 3 Months',
    badge: 'Standard',
    description: 'Iterative agile sprints from architecture to staging launch',
    popular: true,
  },
  {
    value: '3-6 months',
    label: '3 – 6 Months',
    badge: 'Comprehensive',
    description: 'Deep engineering roadmap with automated QA & load benchmarking',
  },
  {
    value: '6+ months',
    label: '6+ Months',
    badge: 'Enterprise',
    description: 'Multi-phase enterprise rollout with continuous scaling & SLA support',
  },
  {
    value: 'Flexible / Discovery',
    label: 'Flexible / Advisory',
    badge: 'Exploratory',
    description: 'Technical feasibility discovery and scoping before build',
  },
];

export default function ContactClient() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const activeTab = searchParams.get('type') === 'quote' ? 'quote' : 'message';
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);

  // Dropdown open states
  const [isServiceOpen, setIsServiceOpen] = useState(false);
  const [isBudgetOpen, setIsBudgetOpen] = useState(false);
  const [isTimelineOpen, setIsTimelineOpen] = useState(false);

  // File Upload states
  const [isUploading, setIsUploading] = useState(false);
  const [uploadedFile, setUploadedFile] = useState<{
    name: string;
    size: number;
    url: string;
  } | null>(null);
  const [showLinkInput, setShowLinkInput] = useState(false);
  const [isDragOver, setIsDragOver] = useState(false);

  // Refs for outside click dismissal
  const serviceRef = useRef<HTMLDivElement>(null);
  const budgetRef = useRef<HTMLDivElement>(null);
  const timelineRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Forms
  const contactForm = useForm<ContactInput>({
    resolver: zodResolver(ContactSchema),
    defaultValues: {
      name: '',
      email: '',
      subject: '',
      message: '',
    },
  });

  const quoteForm = useForm<QuoteInput>({
    resolver: zodResolver(QuoteSchema),
    defaultValues: {
      name: '',
      email: '',
      phone: '',
      service: searchParams.get('service') || '',
      budget: '',
      timeline: '',
      projectDetails: '',
      fileUrl: '',
    },
  });

  // Normalize and pre-select service from URL query param
  useEffect(() => {
    const serviceParam = searchParams.get('service');
    if (serviceParam) {
      // Find matching service or fuzzy match
      const matched = SERVICE_OPTIONS.find(
        (s) =>
          s.id === serviceParam ||
          s.title.toLowerCase().includes(serviceParam.toLowerCase()) ||
          serviceParam.toLowerCase().includes(s.id)
      );
      if (matched) {
        quoteForm.setValue('service', matched.id);
      } else {
        quoteForm.setValue('service', serviceParam);
      }
    }
  }, [searchParams, quoteForm]);

  // Click outside listener for all custom dropdowns
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (serviceRef.current && !serviceRef.current.contains(event.target as Node)) {
        setIsServiceOpen(false);
      }
      if (budgetRef.current && !budgetRef.current.contains(event.target as Node)) {
        setIsBudgetOpen(false);
      }
      if (timelineRef.current && !timelineRef.current.contains(event.target as Node)) {
        setIsTimelineOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const onContactSubmit = async (data: ContactInput) => {
    setIsSubmitting(true);
    try {
      const res = await submitContactAction(data, crypto.randomUUID());
      if (res.success) {
        setSubmitSuccess(true);
        toast.success(res.message);
        contactForm.reset();
      } else {
        toast.error(res.message || 'Submission failed.');
      }
    } catch (error) {
      logger.error('Contact submission error:', error);
      toast.error('An unexpected error occurred. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const onQuoteSubmit = async (data: QuoteInput) => {
    setIsSubmitting(true);
    try {
      const res = await submitQuoteAction(data, crypto.randomUUID());
      if (res.success) {
        setSubmitSuccess(true);
        toast.success(res.message);
        quoteForm.reset();
        setUploadedFile(null);
      } else {
        toast.error(res.message || 'Submission failed.');
      }
    } catch (error) {
      logger.error('Quote submission error:', error);
      toast.error('An unexpected error occurred. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const switchTab = (tab: 'message' | 'quote') => {
    setSubmitSuccess(false);
    const params = new URLSearchParams(window.location.search);
    params.set('type', tab);
    router.replace(`/contact?${params.toString()}`, { scroll: false });
  };

  // Handle direct file upload to /api/quotes/upload
  const handleFileUpload = async (file: File) => {
    if (file.size > 10 * 1024 * 1024) {
      toast.error('File size exceeds the 10MB limit. Please upload a smaller document.');
      return;
    }

    setIsUploading(true);
    const formData = new FormData();
    formData.append('file', file);

    try {
      const res = await fetch('/api/quotes/upload', {
        method: 'POST',
        body: formData,
      });

      const data = await res.json();
      if (data.success && data.url) {
        setUploadedFile({
          name: file.name,
          size: file.size,
          url: data.url,
        });
        quoteForm.setValue('fileUrl', data.url, { shouldValidate: true });
        toast.success('Document uploaded successfully!');
      } else {
        toast.error(data.message || 'Upload failed. Please try again.');
      }
    } catch (err) {
      logger.error('Upload error:', err);
      toast.error('Network error during upload. Please check your connection.');
    } finally {
      setIsUploading(false);
    }
  };

  const removeUploadedFile = () => {
    setUploadedFile(null);
    quoteForm.setValue('fileUrl', '', { shouldValidate: true });
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const selectedServiceObj = SERVICE_OPTIONS.find(
    (s) => s.id === quoteForm.watch('service')
  );
  const selectedBudgetObj = BUDGET_OPTIONS.find(
    (b) => b.value === quoteForm.watch('budget')
  );
  const selectedTimelineObj = TIMELINE_OPTIONS.find(
    (t) => t.value === quoteForm.watch('timeline')
  );

  return (
    <div className="flex flex-col min-h-screen relative overflow-hidden bg-background py-12">
      {/* Background glow effects */}
      <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] rounded-full bg-indigo-500/10 blur-[130px] pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] rounded-full bg-pink-500/10 blur-[130px] pointer-events-none" />

      {/* Header */}
      <section className="relative z-10 max-w-7xl mx-auto px-6 pt-16 pb-8 w-full text-center">
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-600 dark:text-indigo-400 text-xs font-semibold uppercase tracking-wider mb-6"
        >
          <Sparkles className="h-3.5 w-3.5 animate-pulse text-indigo-400" />
          Enterprise Partnership & Quotes
        </motion.div>
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-foreground mb-6"
        >
          Let&apos;s Build Your{' '}
          <span className="bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 bg-clip-text text-transparent">
            Next Idea
          </span>
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="text-base sm:text-lg text-muted-foreground max-w-3xl mx-auto leading-relaxed"
        >
          Whether you need an architectural review, a custom enterprise quote, or want to explore an
          AI or cloud initiative, our senior engineering leaders are ready to collaborate.
        </motion.p>
      </section>

      {/* Form & Info Section */}
      <section className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 py-10 w-full grid grid-cols-1 lg:grid-cols-12 gap-10">
        {/* Contact Info Panel (Left) */}
        <div className="lg:col-span-4 space-y-6 flex flex-col justify-start">
          <AnimatedContainer direction="left" delay={0.1} className="space-y-4">
            <h3 className="text-2xl font-extrabold text-foreground tracking-tight">Direct Channels</h3>
            <p className="text-sm text-muted-foreground leading-relaxed">
              We operate globally as a remote-first engineering group with regional client leads. Reach us directly or submit your project proposal.
            </p>
          </AnimatedContainer>

          <AnimatedContainer direction="left" delay={0.2} className="space-y-3.5">
            <div className="group flex gap-4 p-4 rounded-2xl bg-card/40 border border-border/50 hover:border-indigo-500/40 hover:bg-card/70 transition-all duration-200">
              <div className="p-3 rounded-xl bg-indigo-500/10 text-indigo-500 dark:text-indigo-400 shrink-0 group-hover:scale-105 transition-transform">
                <Mail className="h-5 w-5" />
              </div>
              <div className="min-w-0 flex-1">
                <h4 className="font-semibold text-foreground text-sm">Direct Email</h4>
                <a
                  href="mailto:info@ingrowwthinnovations.in"
                  className="text-xs sm:text-sm text-muted-foreground hover:text-indigo-400 transition-colors mt-0.5 block truncate"
                  suppressHydrationWarning
                >
                  info@ingrowwthinnovations.in
                </a>
              </div>
            </div>

            <div className="group flex gap-4 p-4 rounded-2xl bg-card/40 border border-border/50 hover:border-purple-500/40 hover:bg-card/70 transition-all duration-200">
              <div className="p-3 rounded-xl bg-purple-500/10 text-purple-500 dark:text-purple-400 shrink-0 group-hover:scale-105 transition-transform">
                <Phone className="h-5 w-5" />
              </div>
              <div className="min-w-0 flex-1">
                <h4 className="font-semibold text-foreground text-sm">Call & WhatsApp Hotline</h4>
                <p className="text-xs sm:text-sm text-muted-foreground mt-0.5">+91 92271 01856</p>
              </div>
            </div>

            <div className="group flex gap-4 p-4 rounded-2xl bg-card/40 border border-border/50 hover:border-pink-500/40 hover:bg-card/70 transition-all duration-200">
              <div className="p-3 rounded-xl bg-pink-500/10 text-pink-500 dark:text-pink-400 shrink-0 group-hover:scale-105 transition-transform">
                <MapPin className="h-5 w-5" />
              </div>
              <div className="min-w-0 flex-1">
                <h4 className="font-semibold text-foreground text-sm">Global Headquarters</h4>
                <p className="text-xs sm:text-sm text-muted-foreground mt-0.5">
                  Remote-First Group (HQ: Ahmedabad, India)
                </p>
              </div>
            </div>

            <div className="group flex gap-4 p-4 rounded-2xl bg-card/40 border border-border/50 hover:border-emerald-500/40 hover:bg-card/70 transition-all duration-200">
              <div className="p-3 rounded-xl bg-emerald-500/10 text-emerald-500 dark:text-emerald-400 shrink-0 group-hover:scale-105 transition-transform">
                <Clock className="h-5 w-5" />
              </div>
              <div className="min-w-0 flex-1">
                <h4 className="font-semibold text-foreground text-sm">Response Window</h4>
                <p className="text-xs sm:text-sm text-muted-foreground mt-0.5">
                  Mon – Fri: Fast responses within 4 hours
                </p>
              </div>
            </div>
          </AnimatedContainer>

          {/* Trust assurances */}
          <div className="p-5 rounded-2xl bg-gradient-to-br from-indigo-500/5 via-purple-500/5 to-pink-500/5 border border-indigo-500/10 space-y-3">
            <div className="flex items-center gap-2 text-foreground font-semibold text-sm">
              <ShieldCheck className="h-4 w-4 text-emerald-400" />
              <span>Enterprise Commitments</span>
            </div>
            <ul className="text-xs text-muted-foreground space-y-2 leading-relaxed">
              <li className="flex items-start gap-2">
                <Check className="h-3.5 w-3.5 text-indigo-400 shrink-0 mt-0.5" />
                <span>Mutual Non-Disclosure Agreement (NDA) before deep discovery</span>
              </li>
              <li className="flex items-start gap-2">
                <Check className="h-3.5 w-3.5 text-indigo-400 shrink-0 mt-0.5" />
                <span>Direct consultation with a Principal Solutions Architect</span>
              </li>
              <li className="flex items-start gap-2">
                <Check className="h-3.5 w-3.5 text-indigo-400 shrink-0 mt-0.5" />
                <span>Transparent scoping with zero hidden infrastructure markups</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Tab & Form Panel (Right) */}
        <div className="lg:col-span-8">
          <AnimatedContainer direction="up" delay={0.2}>
            {/* Tabs Trigger Navigation */}
            <div className="flex p-1.5 bg-muted/40 backdrop-blur-md border border-border/50 rounded-2xl mb-6 max-w-md shadow-inner">
              <button
                type="button"
                onClick={() => switchTab('message')}
                className={`flex-1 flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl text-sm font-semibold transition-all duration-200 cursor-pointer ${
                  activeTab === 'message'
                    ? 'bg-background text-foreground shadow-md border border-border/40 font-bold'
                    : 'text-muted-foreground hover:text-foreground hover:bg-background/40'
                }`}
              >
                <Mail className="h-4 w-4 text-indigo-400" />
                <span>Send a Message</span>
              </button>
              <button
                type="button"
                onClick={() => switchTab('quote')}
                className={`flex-1 flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl text-sm font-semibold transition-all duration-200 cursor-pointer ${
                  activeTab === 'quote'
                    ? 'bg-background text-foreground shadow-md border border-border/40 font-bold'
                    : 'text-muted-foreground hover:text-foreground hover:bg-background/40'
                }`}
              >
                <FileText className="h-4 w-4 text-pink-400" />
                <span>Request a Quote</span>
                <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-pink-500/10 text-pink-400 border border-pink-500/20 font-mono">
                  RFP
                </span>
              </button>
            </div>

            {/* Forms Card */}
            <Card className="border-border/60 bg-card/75 backdrop-blur-xl shadow-2xl rounded-3xl overflow-hidden relative">
              <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/5 via-transparent to-pink-500/5 pointer-events-none" />
              <CardContent className="p-6 sm:p-10 relative z-10">
                <AnimatePresence mode="wait">
                  {submitSuccess ? (
                    <motion.div
                      key="success"
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0 }}
                      className="py-16 text-center flex flex-col items-center gap-4"
                    >
                      <div className="h-20 w-20 rounded-full bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center">
                        <CheckCircle className="h-10 w-10 text-emerald-400 animate-pulse" />
                      </div>
                      <h3 className="text-2xl sm:text-3xl font-extrabold text-foreground">Inquiry Received!</h3>
                      <p className="text-sm sm:text-base text-muted-foreground max-w-md mx-auto leading-relaxed">
                        Thank you for reaching out to InGrowwth Innovations. Our engineering coordinators are reviewing your specifications and will respond promptly with next steps.
                      </p>
                      <Button
                        onClick={() => {
                          setSubmitSuccess(false);
                          setUploadedFile(null);
                        }}
                        variant="outline"
                        className="mt-4 rounded-xl cursor-pointer"
                      >
                        Submit Another Inquiry
                      </Button>
                    </motion.div>
                  ) : activeTab === 'message' ? (
                    /* General Inquiry Form */
                    <motion.form
                      key="message-form"
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: 10 }}
                      onSubmit={contactForm.handleSubmit(onContactSubmit)}
                      className="space-y-6"
                    >
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                        <div className="space-y-2">
                          <Label htmlFor="name" className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                            Your Name <span className="text-destructive">*</span>
                          </Label>
                          <Input
                            id="name"
                            placeholder="e.g. Alexander Sterling"
                            className="h-12 rounded-xl bg-background/80 border-border/70 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 transition-all"
                            {...contactForm.register('name')}
                            aria-invalid={!!contactForm.formState.errors.name}
                          />
                          {contactForm.formState.errors.name && (
                            <span className="text-xs text-destructive">
                              {contactForm.formState.errors.name.message}
                            </span>
                          )}
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="email" className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                            Email Address <span className="text-destructive">*</span>
                          </Label>
                          <Input
                            id="email"
                            type="email"
                            placeholder="e.g. alex@vanguard.com"
                            className="h-12 rounded-xl bg-background/80 border-border/70 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 transition-all"
                            {...contactForm.register('email')}
                            aria-invalid={!!contactForm.formState.errors.email}
                          />
                          {contactForm.formState.errors.email && (
                            <span className="text-xs text-destructive">
                              {contactForm.formState.errors.email.message}
                            </span>
                          )}
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="subject" className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                          Subject <span className="text-destructive">*</span>
                        </Label>
                        <Input
                          id="subject"
                          placeholder="e.g. Partnership inquiry regarding Cloud Architecture review"
                          className="h-12 rounded-xl bg-background/80 border-border/70 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 transition-all"
                          {...contactForm.register('subject')}
                          aria-invalid={!!contactForm.formState.errors.subject}
                        />
                        {contactForm.formState.errors.subject && (
                          <span className="text-xs text-destructive">
                            {contactForm.formState.errors.subject.message}
                          </span>
                        )}
                      </div>

                      <div className="space-y-2">
                        <div className="flex justify-between items-center">
                          <Label htmlFor="message" className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                            Message <span className="text-destructive">*</span>
                          </Label>
                          <span className="text-[11px] text-muted-foreground">
                            {contactForm.watch('message')?.length || 0} / 5,000
                          </span>
                        </div>
                        <textarea
                          id="message"
                          rows={5}
                          placeholder="Tell us about your project, timeline, or engineering goals..."
                          className="w-full rounded-xl border border-border/70 bg-background/80 p-3.5 text-sm text-foreground placeholder:text-muted-foreground focus:outline-hidden focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 transition-all"
                          {...contactForm.register('message')}
                          aria-invalid={!!contactForm.formState.errors.message}
                        />
                        {contactForm.formState.errors.message && (
                          <span className="text-xs text-destructive">
                            {contactForm.formState.errors.message.message}
                          </span>
                        )}
                      </div>

                      <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-4">
                        <Button
                          type="submit"
                          loading={isSubmitting}
                          className="w-full sm:w-auto h-12 px-8 rounded-xl bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 hover:from-indigo-600 hover:via-purple-600 hover:to-pink-600 text-white font-bold cursor-pointer shadow-lg shadow-indigo-500/20"
                        >
                          <span>Send Message</span>
                          <Send className="h-4 w-4 ml-2" />
                        </Button>
                        <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                          <Lock className="h-3.5 w-3.5 text-emerald-400" />
                          <span>Protected by 256-bit encryption</span>
                        </div>
                      </div>
                    </motion.form>
                  ) : (
                    /* High-Standard Quote Request Form */
                    <motion.form
                      key="quote-form"
                      initial={{ opacity: 0, x: 10 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -10 }}
                      onSubmit={quoteForm.handleSubmit(onQuoteSubmit)}
                      className="space-y-6"
                    >
                      {/* Name & Email */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                        <div className="space-y-2">
                          <Label htmlFor="q-name" className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                            Your Name <span className="text-destructive">*</span>
                          </Label>
                          <Input
                            id="q-name"
                            placeholder="e.g. Victoria Sterling"
                            className="h-12 rounded-xl bg-background/80 border-border/70 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 transition-all"
                            {...quoteForm.register('name')}
                            aria-invalid={!!quoteForm.formState.errors.name}
                          />
                          {quoteForm.formState.errors.name && (
                            <span className="text-xs text-destructive">
                              {quoteForm.formState.errors.name.message}
                            </span>
                          )}
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="q-email" className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                            Work Email <span className="text-destructive">*</span>
                          </Label>
                          <Input
                            id="q-email"
                            type="email"
                            placeholder="e.g. v.sterling@vanguard.com"
                            className="h-12 rounded-xl bg-background/80 border-border/70 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 transition-all"
                            {...quoteForm.register('email')}
                            aria-invalid={!!quoteForm.formState.errors.email}
                          />
                          {quoteForm.formState.errors.email && (
                            <span className="text-xs text-destructive">
                              {quoteForm.formState.errors.email.message}
                            </span>
                          )}
                        </div>
                      </div>

                      {/* Phone & Service Dropdown */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                        <div className="space-y-2">
                          <Label htmlFor="phone" className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                            Phone / WhatsApp (Optional)
                          </Label>
                          <Input
                            id="phone"
                            placeholder="+1 (415) 890-3412"
                            className="h-12 rounded-xl bg-background/80 border-border/70 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 transition-all"
                            {...quoteForm.register('phone')}
                            aria-invalid={!!quoteForm.formState.errors.phone}
                          />
                          {quoteForm.formState.errors.phone && (
                            <span className="text-xs text-destructive">
                              {quoteForm.formState.errors.phone.message}
                            </span>
                          )}
                        </div>

                        {/* CUSTOM LUXURY SERVICE DROPDOWN */}
                        <div className="space-y-2" ref={serviceRef}>
                          <Label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground flex items-center justify-between">
                            <span>Target Service <span className="text-destructive">*</span></span>
                            {selectedServiceObj && (
                              <span className="text-[11px] text-indigo-400 lowercase font-mono">
                                selected
                              </span>
                            )}
                          </Label>

                          <div className="relative">
                            <button
                              type="button"
                              onClick={() => {
                                setIsServiceOpen(!isServiceOpen);
                                setIsBudgetOpen(false);
                                setIsTimelineOpen(false);
                              }}
                              className={`w-full h-12 px-4 rounded-xl flex items-center justify-between text-left transition-all duration-200 cursor-pointer border ${
                                isServiceOpen
                                  ? 'border-indigo-500 ring-2 ring-indigo-500/20 bg-background'
                                  : 'border-border/70 bg-background/80 hover:border-border hover:bg-background'
                              }`}
                            >
                              <div className="flex items-center gap-2.5 truncate">
                                {selectedServiceObj ? (
                                  <>
                                    <div className={`p-1.5 rounded-lg border shrink-0 ${selectedServiceObj.color}`}>
                                      <selectedServiceObj.icon className="h-4 w-4" />
                                    </div>
                                    <span className="font-semibold text-sm text-foreground truncate">
                                      {selectedServiceObj.title}
                                    </span>
                                  </>
                                ) : (
                                  <span className="text-sm text-muted-foreground">
                                    Select a service discipline...
                                  </span>
                                )}
                              </div>
                              <ChevronDown
                                className={`h-4 w-4 text-muted-foreground transition-transform duration-200 shrink-0 ml-2 ${
                                  isServiceOpen ? 'rotate-180 text-indigo-400' : ''
                                }`}
                              />
                            </button>

                            {/* Dropdown Menu */}
                            <AnimatePresence>
                              {isServiceOpen && (
                                <motion.div
                                  initial={{ opacity: 0, y: 8, scale: 0.98 }}
                                  animate={{ opacity: 1, y: 0, scale: 1 }}
                                  exit={{ opacity: 0, y: 8, scale: 0.98 }}
                                  transition={{ duration: 0.15 }}
                                  className="absolute top-full left-0 right-0 mt-2 z-50 p-2 rounded-2xl bg-popover/95 backdrop-blur-2xl border border-border/80 shadow-2xl max-h-80 overflow-y-auto space-y-1"
                                >
                                  {SERVICE_OPTIONS.map((svc) => {
                                    const isSelected = quoteForm.watch('service') === svc.id;
                                    const SvcIcon = svc.icon;
                                    return (
                                      <div
                                        key={svc.id}
                                        onClick={() => {
                                          quoteForm.setValue('service', svc.id, { shouldValidate: true });
                                          setIsServiceOpen(false);
                                        }}
                                        className={`flex items-center justify-between p-2.5 rounded-xl cursor-pointer transition-colors ${
                                          isSelected
                                            ? 'bg-indigo-500/10 border border-indigo-500/30'
                                            : 'hover:bg-accent/60 border border-transparent'
                                        }`}
                                      >
                                        <div className="flex items-center gap-3 min-w-0 pr-2">
                                          <div className={`p-2 rounded-lg border shrink-0 ${svc.color}`}>
                                            <SvcIcon className="h-4 w-4" />
                                          </div>
                                          <div className="min-w-0">
                                            <div className="flex items-center gap-2">
                                              <span className="text-sm font-semibold text-foreground truncate">
                                                {svc.title}
                                              </span>
                                              {svc.badge && (
                                                <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 font-mono">
                                                  {svc.badge}
                                                </span>
                                              )}
                                            </div>
                                            <p className="text-xs text-muted-foreground truncate">
                                              {svc.subtitle}
                                            </p>
                                          </div>
                                        </div>
                                        {isSelected && (
                                          <Check className="h-4 w-4 text-indigo-400 shrink-0" />
                                        )}
                                      </div>
                                    );
                                  })}
                                </motion.div>
                              )}
                            </AnimatePresence>
                          </div>
                          {quoteForm.formState.errors.service && (
                            <span className="text-xs text-destructive">
                              {quoteForm.formState.errors.service.message}
                            </span>
                          )}
                        </div>
                      </div>

                      {/* Budget & Timeline Dropdowns with segmented pills */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                        {/* BUDGET SELECTOR */}
                        <div className="space-y-2" ref={budgetRef}>
                          <Label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                            Estimated Budget Range <span className="text-destructive">*</span>
                          </Label>

                          <div className="relative">
                            <button
                              type="button"
                              onClick={() => {
                                setIsBudgetOpen(!isBudgetOpen);
                                setIsServiceOpen(false);
                                setIsTimelineOpen(false);
                              }}
                              className={`w-full h-12 px-4 rounded-xl flex items-center justify-between text-left transition-all duration-200 cursor-pointer border ${
                                isBudgetOpen
                                  ? 'border-indigo-500 ring-2 ring-indigo-500/20 bg-background'
                                  : 'border-border/70 bg-background/80 hover:border-border hover:bg-background'
                              }`}
                            >
                              <div className="flex items-center gap-2 truncate">
                                {selectedBudgetObj ? (
                                  <>
                                    <span className="font-bold text-sm text-foreground">
                                      {selectedBudgetObj.label}
                                    </span>
                                    <span className="text-xs text-muted-foreground truncate">
                                      — {selectedBudgetObj.tier}
                                    </span>
                                  </>
                                ) : (
                                  <span className="text-sm text-muted-foreground">
                                    Select an investment range...
                                  </span>
                                )}
                              </div>
                              <ChevronDown
                                className={`h-4 w-4 text-muted-foreground transition-transform duration-200 shrink-0 ml-2 ${
                                  isBudgetOpen ? 'rotate-180 text-indigo-400' : ''
                                }`}
                              />
                            </button>

                            {/* Dropdown Menu */}
                            <AnimatePresence>
                              {isBudgetOpen && (
                                <motion.div
                                  initial={{ opacity: 0, y: 8, scale: 0.98 }}
                                  animate={{ opacity: 1, y: 0, scale: 1 }}
                                  exit={{ opacity: 0, y: 8, scale: 0.98 }}
                                  transition={{ duration: 0.15 }}
                                  className="absolute top-full left-0 right-0 mt-2 z-50 p-2 rounded-2xl bg-popover/95 backdrop-blur-2xl border border-border/80 shadow-2xl space-y-1"
                                >
                                  {BUDGET_OPTIONS.map((b) => {
                                    const isSelected = quoteForm.watch('budget') === b.value;
                                    return (
                                      <div
                                        key={b.value}
                                        onClick={() => {
                                          quoteForm.setValue('budget', b.value, { shouldValidate: true });
                                          setIsBudgetOpen(false);
                                        }}
                                        className={`flex items-center justify-between p-2.5 rounded-xl cursor-pointer transition-colors ${
                                          isSelected
                                            ? 'bg-indigo-500/10 border border-indigo-500/30'
                                            : 'hover:bg-accent/60 border border-transparent'
                                        }`}
                                      >
                                        <div className="min-w-0 pr-2">
                                          <div className="flex items-center gap-2">
                                            <span className="text-sm font-bold text-foreground">
                                              {b.label}
                                            </span>
                                            {b.popular && (
                                              <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 font-mono">
                                                Most Common
                                              </span>
                                            )}
                                          </div>
                                          <p className="text-xs text-muted-foreground">
                                            {b.description}
                                          </p>
                                        </div>
                                        {isSelected && (
                                          <Check className="h-4 w-4 text-indigo-400 shrink-0" />
                                        )}
                                      </div>
                                    );
                                  })}
                                </motion.div>
                              )}
                            </AnimatePresence>
                          </div>

                          {/* Quick selection chips */}
                          <div className="flex flex-wrap gap-1.5 pt-1">
                            {BUDGET_OPTIONS.map((b) => {
                              const active = quoteForm.watch('budget') === b.value;
                              return (
                                <button
                                  key={b.value}
                                  type="button"
                                  onClick={() => quoteForm.setValue('budget', b.value, { shouldValidate: true })}
                                  className={`text-[11px] px-2.5 py-1 rounded-lg transition-all cursor-pointer border ${
                                    active
                                      ? 'bg-indigo-500/20 border-indigo-500/50 text-indigo-300 font-semibold shadow-xs'
                                      : 'bg-background/60 border-border/60 text-muted-foreground hover:text-foreground hover:bg-background'
                                  }`}
                                >
                                  {b.label}
                                </button>
                              );
                            })}
                          </div>

                          {quoteForm.formState.errors.budget && (
                            <span className="text-xs text-destructive">
                              {quoteForm.formState.errors.budget.message}
                            </span>
                          )}
                        </div>

                        {/* TIMELINE SELECTOR */}
                        <div className="space-y-2" ref={timelineRef}>
                          <Label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                            Estimated Timeline <span className="text-destructive">*</span>
                          </Label>

                          <div className="relative">
                            <button
                              type="button"
                              onClick={() => {
                                setIsTimelineOpen(!isTimelineOpen);
                                setIsServiceOpen(false);
                                setIsBudgetOpen(false);
                              }}
                              className={`w-full h-12 px-4 rounded-xl flex items-center justify-between text-left transition-all duration-200 cursor-pointer border ${
                                isTimelineOpen
                                  ? 'border-indigo-500 ring-2 ring-indigo-500/20 bg-background'
                                  : 'border-border/70 bg-background/80 hover:border-border hover:bg-background'
                              }`}
                            >
                              <div className="flex items-center gap-2 truncate">
                                {selectedTimelineObj ? (
                                  <>
                                    <Clock className="h-4 w-4 text-indigo-400 shrink-0" />
                                    <span className="font-bold text-sm text-foreground">
                                      {selectedTimelineObj.label}
                                    </span>
                                  </>
                                ) : (
                                  <span className="text-sm text-muted-foreground">
                                    Select desired delivery speed...
                                  </span>
                                )}
                              </div>
                              <ChevronDown
                                className={`h-4 w-4 text-muted-foreground transition-transform duration-200 shrink-0 ml-2 ${
                                  isTimelineOpen ? 'rotate-180 text-indigo-400' : ''
                                }`}
                              />
                            </button>

                            {/* Dropdown Menu */}
                            <AnimatePresence>
                              {isTimelineOpen && (
                                <motion.div
                                  initial={{ opacity: 0, y: 8, scale: 0.98 }}
                                  animate={{ opacity: 1, y: 0, scale: 1 }}
                                  exit={{ opacity: 0, y: 8, scale: 0.98 }}
                                  transition={{ duration: 0.15 }}
                                  className="absolute top-full left-0 right-0 mt-2 z-50 p-2 rounded-2xl bg-popover/95 backdrop-blur-2xl border border-border/80 shadow-2xl space-y-1"
                                >
                                  {TIMELINE_OPTIONS.map((t) => {
                                    const isSelected = quoteForm.watch('timeline') === t.value;
                                    return (
                                      <div
                                        key={t.value}
                                        onClick={() => {
                                          quoteForm.setValue('timeline', t.value, { shouldValidate: true });
                                          setIsTimelineOpen(false);
                                        }}
                                        className={`flex items-center justify-between p-2.5 rounded-xl cursor-pointer transition-colors ${
                                          isSelected
                                            ? 'bg-indigo-500/10 border border-indigo-500/30'
                                            : 'hover:bg-accent/60 border border-transparent'
                                        }`}
                                      >
                                        <div className="min-w-0 pr-2">
                                          <div className="flex items-center gap-2">
                                            <span className="text-sm font-bold text-foreground">
                                              {t.label}
                                            </span>
                                            {t.badge && (
                                              <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-purple-500/10 text-purple-400 border border-purple-500/20 font-mono">
                                                {t.badge}
                                              </span>
                                            )}
                                          </div>
                                          <p className="text-xs text-muted-foreground">
                                            {t.description}
                                          </p>
                                        </div>
                                        {isSelected && (
                                          <Check className="h-4 w-4 text-indigo-400 shrink-0" />
                                        )}
                                      </div>
                                    );
                                  })}
                                </motion.div>
                              )}
                            </AnimatePresence>
                          </div>

                          {/* Quick selection chips */}
                          <div className="flex flex-wrap gap-1.5 pt-1">
                            {TIMELINE_OPTIONS.slice(0, 4).map((t) => {
                              const active = quoteForm.watch('timeline') === t.value;
                              return (
                                <button
                                  key={t.value}
                                  type="button"
                                  onClick={() => quoteForm.setValue('timeline', t.value, { shouldValidate: true })}
                                  className={`text-[11px] px-2.5 py-1 rounded-lg transition-all cursor-pointer border ${
                                    active
                                      ? 'bg-indigo-500/20 border-indigo-500/50 text-indigo-300 font-semibold shadow-xs'
                                      : 'bg-background/60 border-border/60 text-muted-foreground hover:text-foreground hover:bg-background'
                                  }`}
                                >
                                  {t.label.split('(')[0].trim()}
                                </button>
                              );
                            })}
                          </div>

                          {quoteForm.formState.errors.timeline && (
                            <span className="text-xs text-destructive">
                              {quoteForm.formState.errors.timeline.message}
                            </span>
                          )}
                        </div>
                      </div>

                      {/* PREMIUM FILE UPLOAD & ATTACHMENT EXPERIENCE */}
                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <Label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
                            <span>Project Specifications / RFP (Optional)</span>
                            <div className="group relative inline-block">
                              <HelpCircle className="h-3.5 w-3.5 text-muted-foreground hover:text-foreground cursor-pointer" />
                              <span className="absolute bottom-full left-1/2 -translate-x-1/2 mb-1.5 w-56 p-2 rounded-lg bg-popover text-[11px] text-popover-foreground border border-border shadow-xl opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity duration-200 z-50">
                                Attach wireframes, PRDs, architectural diagrams, or proposal RFPs (PDF, DOCX, XLSX, TXT up to 10MB).
                              </span>
                            </div>
                          </Label>

                          <button
                            type="button"
                            onClick={() => setShowLinkInput(!showLinkInput)}
                            className="text-xs text-indigo-400 hover:text-indigo-300 transition-colors flex items-center gap-1 cursor-pointer"
                          >
                            <ExternalLink className="h-3 w-3" />
                            <span>{showLinkInput ? 'Hide link field' : 'Or paste a Google Drive/Figma link'}</span>
                          </button>
                        </div>

                        {/* Hidden Native File Input */}
                        <input
                          ref={fileInputRef}
                          type="file"
                          accept=".pdf,.doc,.docx,.xlsx,.xls,.txt,.png,.jpg,.jpeg,.webp"
                          className="hidden"
                          onChange={(e) => {
                            const file = e.target.files?.[0];
                            if (file) handleFileUpload(file);
                          }}
                        />

                        {uploadedFile ? (
                          /* Uploaded File Banner */
                          <div className="flex items-center justify-between p-3.5 rounded-2xl bg-indigo-500/10 border border-indigo-500/30">
                            <div className="flex items-center gap-3 min-w-0 pr-2">
                              <div className="p-2.5 rounded-xl bg-indigo-500/20 text-indigo-400 shrink-0">
                                <FileCheck className="h-5 w-5" />
                              </div>
                              <div className="min-w-0">
                                <p className="text-sm font-semibold text-foreground truncate">
                                  {uploadedFile.name}
                                </p>
                                <p className="text-xs text-muted-foreground">
                                  {(uploadedFile.size / (1024 * 1024)).toFixed(2)} MB &bull; Uploaded & attached
                                </p>
                              </div>
                            </div>
                            <Button
                              type="button"
                              variant="ghost"
                              size="sm"
                              onClick={removeUploadedFile}
                              className="h-8 w-8 p-0 text-muted-foreground hover:text-destructive hover:bg-destructive/10 rounded-lg cursor-pointer"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        ) : (
                          /* Interactive Drag & Drop Zone */
                          <div
                            onDragOver={(e) => {
                              e.preventDefault();
                              setIsDragOver(true);
                            }}
                            onDragLeave={() => setIsDragOver(false)}
                            onDrop={(e) => {
                              e.preventDefault();
                              setIsDragOver(false);
                              const file = e.dataTransfer.files?.[0];
                              if (file) handleFileUpload(file);
                            }}
                            onClick={() => fileInputRef.current?.click()}
                            className={`p-6 rounded-2xl border-2 border-dashed transition-all duration-200 cursor-pointer text-center flex flex-col items-center justify-center gap-2 ${
                              isDragOver
                                ? 'border-indigo-500 bg-indigo-500/10'
                                : 'border-border/70 hover:border-indigo-500/50 bg-background/50 hover:bg-background/80'
                            }`}
                          >
                            <div className="p-3 rounded-full bg-indigo-500/10 text-indigo-400 group-hover:scale-110 transition-transform">
                              {isUploading ? (
                                <div className="h-5 w-5 border-2 border-indigo-400 border-t-transparent rounded-full animate-spin" />
                              ) : (
                                <UploadCloud className="h-5 w-5 animate-pulse" />
                              )}
                            </div>
                            <div>
                              <p className="text-sm font-semibold text-foreground">
                                {isUploading
                                  ? 'Uploading document to secure cloud storage...'
                                  : 'Click to upload your RFP / specification, or drag and drop'}
                              </p>
                              <p className="text-xs text-muted-foreground mt-0.5">
                                PDF, DOCX, XLSX, TXT or design assets (Max 10MB)
                              </p>
                            </div>
                          </div>
                        )}

                        {/* Optional Link Input */}
                        {showLinkInput && (
                          <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            exit={{ opacity: 0, height: 0 }}
                            className="pt-2"
                          >
                            <Input
                              type="url"
                              placeholder="https://drive.google.com/file/... or https://figma.com/file/..."
                              className="h-11 rounded-xl bg-background/80 border-border/70 focus:border-indigo-500"
                              {...quoteForm.register('fileUrl')}
                            />
                            <p className="text-[11px] text-muted-foreground mt-1">
                              Ensure link permissions allow viewing by anyone with the link.
                            </p>
                          </motion.div>
                        )}
                        {quoteForm.formState.errors.fileUrl && (
                          <span className="text-xs text-destructive">
                            {quoteForm.formState.errors.fileUrl.message}
                          </span>
                        )}
                      </div>

                      {/* Project Details */}
                      <div className="space-y-2">
                        <div className="flex justify-between items-center">
                          <Label htmlFor="projectDetails" className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                            Project Vision & Technical Requirements <span className="text-destructive">*</span>
                          </Label>
                          <span className="text-[11px] text-muted-foreground">
                            {quoteForm.watch('projectDetails')?.length || 0} / 5,000
                          </span>
                        </div>
                        <textarea
                          id="projectDetails"
                          rows={4}
                          placeholder="Describe your core product objectives, target users, desired tech stack, and any mission-critical security or performance requirements..."
                          className="w-full rounded-xl border border-border/70 bg-background/80 p-3.5 text-sm text-foreground placeholder:text-muted-foreground focus:outline-hidden focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 transition-all leading-relaxed"
                          {...quoteForm.register('projectDetails')}
                          aria-invalid={!!quoteForm.formState.errors.projectDetails}
                        />
                        {quoteForm.formState.errors.projectDetails && (
                          <span className="text-xs text-destructive">
                            {quoteForm.formState.errors.projectDetails.message}
                          </span>
                        )}
                      </div>

                      {/* Submit Bar */}
                      <div className="pt-3 flex flex-col sm:flex-row items-center justify-between gap-4">
                        <Button
                          type="submit"
                          loading={isSubmitting}
                          className="w-full sm:w-auto h-12 px-9 rounded-xl bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 hover:from-indigo-600 hover:via-purple-600 hover:to-pink-600 text-white font-bold cursor-pointer shadow-xl shadow-indigo-500/25 transition-all hover:scale-[1.01]"
                        >
                          <span>Request Enterprise Quote</span>
                          <ChevronRight className="h-4 w-4 ml-1.5 animate-pulse" />
                        </Button>
                        <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                          <ShieldCheck className="h-4 w-4 text-emerald-400" />
                          <span>Strict NDA & Zero-Spam Policy Guaranteed</span>
                        </div>
                      </div>
                    </motion.form>
                  )}
                </AnimatePresence>
              </CardContent>
            </Card>
          </AnimatedContainer>
        </div>
      </section>
    </div>
  );
}
