'use client';

import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import {
  User,
  Mail,
  Phone,
  MapPin,
  Globe,
  Briefcase,
  Calendar,
  DollarSign,
  Building,
  UploadCloud,
  CheckCircle2,
  AlertCircle,
  X,
  Sparkles,
  Lock,
  ArrowRight,
  Clock,
  FileCheck,
  ChevronDown,
} from 'lucide-react';
import { FaLinkedin, FaGithub } from 'react-icons/fa6';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';

export interface ApplyModalProps {
  jobTitle: string;
  department?: string;
  location?: string;
  trigger?: React.ReactNode;
}

const MAX_FILE_SIZE_BYTES = 10 * 1024 * 1024; // 10MB

export function ApplyModal({ jobTitle, department, location, trigger }: ApplyModalProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Form State - 1. Personal Info
  const [candidateName, setCandidateName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [currentLocation, setCurrentLocation] = useState('');

  // Form State - 2. Professional Profiles
  const [linkedInUrl, setLinkedInUrl] = useState('');
  const [githubUrl, setGithubUrl] = useState('');
  const [portfolioUrl, setPortfolioUrl] = useState('');

  // Form State - 3. Experience & Availability
  const [experienceYears, setExperienceYears] = useState('1-3');
  const [noticePeriod, setNoticePeriod] = useState('30_days');
  const [currentCompany, setCurrentCompany] = useState('');
  const [expectedSalary, setExpectedSalary] = useState('');

  // Form State - 4. Cover Letter & Consent
  const [coverLetter, setCoverLetter] = useState('');
  const [showCoverLetter, setShowCoverLetter] = useState(false);
  const [agreedToTerms, setAgreedToTerms] = useState(true);

  // Form State - 5. File Upload State (PDF strictly required)
  const [resumeFile, setResumeFile] = useState<File | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [fileError, setFileError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // MNC Scroll & Section Quick-Jump Architecture
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [activeSection, setActiveSection] = useState<'personal' | 'profiles' | 'experience' | 'resume' | 'cover'>('personal');
  const [isScrolledTop, setIsScrolledTop] = useState(false);
  const [canScrollMore, setCanScrollMore] = useState(true);

  const handleScroll = () => {
    const container = scrollContainerRef.current;
    if (!container) return;

    setIsScrolledTop(container.scrollTop > 15);
    const atBottom = container.scrollTop + container.clientHeight >= container.scrollHeight - 35;
    setCanScrollMore(!atBottom);

    const sections = [
      { id: 'section-cover', name: 'cover' as const },
      { id: 'section-resume', name: 'resume' as const },
      { id: 'section-experience', name: 'experience' as const },
      { id: 'section-profiles', name: 'profiles' as const },
      { id: 'section-personal', name: 'personal' as const },
    ];

    const containerTop = container.getBoundingClientRect().top;
    for (const sec of sections) {
      const el = document.getElementById(sec.id);
      if (el) {
        const rect = el.getBoundingClientRect();
        if (rect.top - containerTop <= 130) {
          setActiveSection(sec.name);
          break;
        }
      }
    }
  };

  const scrollToSection = (sectionId: string) => {
    const target = document.getElementById(sectionId);
    const container = scrollContainerRef.current;
    if (target && container) {
      const containerRect = container.getBoundingClientRect();
      const targetRect = target.getBoundingClientRect();
      const scrollOffset = targetRect.top - containerRect.top + container.scrollTop - 10;
      container.scrollTo({ top: Math.max(0, scrollOffset), behavior: 'smooth' });
    }
  };

  const handleContainerWheel = (e: React.WheelEvent) => {
    if (scrollContainerRef.current && !scrollContainerRef.current.contains(e.target as Node)) {
      scrollContainerRef.current.scrollTop += e.deltaY;
    }
  };

  const resetForm = () => {
    setCandidateName('');
    setEmail('');
    setPhone('');
    setCurrentLocation('');
    setLinkedInUrl('');
    setGithubUrl('');
    setPortfolioUrl('');
    setExperienceYears('1-3');
    setNoticePeriod('30_days');
    setCurrentCompany('');
    setExpectedSalary('');
    setCoverLetter('');
    setShowCoverLetter(false);
    setAgreedToTerms(true);
    setResumeFile(null);
    setFileError(null);
    setErrorMessage(null);
    setIsSuccess(false);
    setActiveSection('personal');
    setIsScrolledTop(false);
    setCanScrollMore(true);
  };

  const handleOpenChange = (open: boolean) => {
    setIsOpen(open);
    if (!open) {
      setTimeout(() => {
        resetForm();
      }, 300);
    }
  };

  const validateAndSetFile = (file: File) => {
    setFileError(null);

    const isPdf =
      file.type === 'application/pdf' ||
      file.type === 'application/x-pdf' ||
      file.name.toLowerCase().endsWith('.pdf');

    if (!isPdf) {
      setFileError('Only PDF documents (.pdf) are accepted. Please select a valid PDF file.');
      return false;
    }

    if (file.size > MAX_FILE_SIZE_BYTES) {
      setFileError('File size exceeds 10MB. Please upload a compressed or smaller PDF.');
      return false;
    }

    setResumeFile(file);
    return true;
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      validateAndSetFile(e.target.files[0]);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      validateAndSetFile(e.dataTransfer.files[0]);
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024 * 1024) {
      return `${(bytes / 1024).toFixed(1)} KB`;
    }
    return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    // 1. Personal info validations
    if (!candidateName.trim() || candidateName.trim().length < 2) {
      setErrorMessage('Please enter your full legal name.');
      return;
    }
    if (!email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setErrorMessage('Please provide a valid email address.');
      return;
    }
    if (!phone.trim() || phone.trim().length < 6) {
      setErrorMessage('Please provide a valid contact phone number with country code.');
      return;
    }
    if (!currentLocation.trim()) {
      setErrorMessage('Please provide your current city / location.');
      return;
    }

    // 2. LinkedIn validation (MANDATORY per MNC guidelines)
    if (!linkedInUrl.trim()) {
      setErrorMessage('LinkedIn profile URL is required by our talent acquisition team.');
      return;
    }
    if (!linkedInUrl.toLowerCase().includes('linkedin.com')) {
      setErrorMessage('Please provide a valid LinkedIn profile URL (e.g. https://linkedin.com/in/yourname).');
      return;
    }

    // 3. Resume validation (MANDATORY PDF)
    if (!resumeFile) {
      setFileError('Please upload your resume in PDF format.');
      setErrorMessage('A PDF resume is required to complete your application.');
      return;
    }

    if (!agreedToTerms) {
      setErrorMessage('Please confirm your consent to recruitment data processing.');
      return;
    }

    setIsSubmitting(true);

    try {
      const formData = new FormData();
      formData.append('candidateName', candidateName.trim());
      formData.append('email', email.trim());
      formData.append('phone', phone.trim());
      formData.append('roleAppliedFor', jobTitle);
      formData.append('linkedInUrl', linkedInUrl.trim());
      if (githubUrl.trim()) formData.append('githubUrl', githubUrl.trim());
      if (portfolioUrl.trim()) formData.append('portfolioUrl', portfolioUrl.trim());
      formData.append('currentLocation', currentLocation.trim());
      formData.append('experienceYears', experienceYears);
      formData.append('noticePeriod', noticePeriod);
      if (currentCompany.trim()) formData.append('currentCompany', currentCompany.trim());
      if (expectedSalary.trim()) formData.append('expectedSalary', expectedSalary.trim());
      if (coverLetter.trim()) formData.append('coverLetter', coverLetter.trim());
      formData.append('resume', resumeFile);

      // UUID v4 format satisfies idempotency regex
      const idempotencyKey =
        typeof crypto !== 'undefined' && crypto.randomUUID
          ? crypto.randomUUID()
          : `app-${Date.now()}-${Math.random().toString(36).substring(2, 15)}`;

      const res = await fetch('/api/careers/apply', {
        method: 'POST',
        headers: {
          'Idempotency-Key': idempotencyKey,
        },
        body: formData,
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        throw new Error(data.message || 'Failed to submit application. Please check your inputs and try again.');
      }

      setIsSuccess(true);
      toast.success('Application submitted successfully!');
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'An unexpected error occurred.';
      setErrorMessage(msg);
      toast.error(msg);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleOpenChange}>
      <DialogTrigger
        render={
          trigger ? (
            React.isValidElement(trigger) ? trigger : <span>{trigger}</span>
          ) : (
            <Button
              className="w-full text-base font-semibold shadow-lg hover:shadow-indigo-500/25 transition-all duration-300 bg-gradient-to-r from-indigo-600 via-purple-600 to-indigo-700 hover:from-indigo-500 hover:to-indigo-600 text-white rounded-2xl py-6 cursor-pointer"
              size="lg"
            >
              Apply for this Position
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          )
        }
      />

      <DialogContent
        data-lenis-prevent="true"
        className="sm:max-w-3xl w-[95vw] md:w-[860px] max-h-[92vh] h-[92vh] p-0 flex flex-col overflow-hidden rounded-3xl border border-white/20 dark:border-white/10 bg-white/98 dark:bg-zinc-950/98 backdrop-blur-2xl shadow-2xl relative"
      >
        <AnimatePresence mode="wait">
          {!isSuccess ? (
            <div
              key="application-form-container"
              data-lenis-prevent="true"
              onWheel={handleContainerWheel}
              className="flex flex-col h-full min-h-0 flex-1 overflow-hidden relative"
            >
              {/* FIXED MODAL HEADER */}
              <div
                className={cn(
                  'shrink-0 p-5 sm:p-6 border-b transition-all duration-200 bg-background/95 dark:bg-zinc-950/95 backdrop-blur-md space-y-3',
                  isScrolledTop
                    ? 'border-indigo-500/20 shadow-md shadow-indigo-500/5'
                    : 'border-border/50'
                )}
              >
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-50 dark:bg-indigo-950/60 border border-indigo-200/50 dark:border-indigo-800/50 text-indigo-700 dark:text-indigo-300 text-xs font-semibold tracking-wide">
                    <Sparkles className="w-3.5 h-3.5 text-indigo-500" />
                    InGrowwth Innovations • Official Application
                  </div>

                  <div className="inline-flex items-center gap-1.5 text-xs text-muted-foreground font-medium">
                    <Clock className="w-3.5 h-3.5 text-emerald-500" />
                    Priority Review (48 Hours SLA)
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-1">
                  <DialogTitle className="text-xl sm:text-2xl font-extrabold tracking-tight bg-gradient-to-r from-foreground via-foreground to-foreground/70 bg-clip-text text-transparent">
                    {jobTitle}
                  </DialogTitle>
                  <DialogDescription className="text-xs text-muted-foreground flex items-center gap-3">
                    {department && (
                      <span className="inline-flex items-center gap-1 font-medium text-foreground">
                        <Briefcase className="w-3 h-3 text-indigo-500" />
                        {department}
                      </span>
                    )}
                    {location && (
                      <span className="inline-flex items-center gap-1 font-medium text-muted-foreground">
                        <MapPin className="w-3 h-3 text-pink-500" />
                        {location}
                      </span>
                    )}
                  </DialogDescription>
                </div>

                {/* MNC Section Navigation Quick Jump Pills */}
                <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar pt-1 border-t border-border/40">
                  <button
                    type="button"
                    onClick={() => scrollToSection('section-personal')}
                    className={cn(
                      'px-2.5 py-1 rounded-lg text-xs font-semibold whitespace-nowrap transition-all flex items-center gap-1 cursor-pointer select-none',
                      activeSection === 'personal'
                        ? 'bg-indigo-600 text-white shadow-sm shadow-indigo-500/30'
                        : 'bg-muted/60 text-muted-foreground hover:bg-muted hover:text-foreground'
                    )}
                  >
                    <span>1. Details</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => scrollToSection('section-profiles')}
                    className={cn(
                      'px-2.5 py-1 rounded-lg text-xs font-semibold whitespace-nowrap transition-all flex items-center gap-1 cursor-pointer select-none',
                      activeSection === 'profiles'
                        ? 'bg-indigo-600 text-white shadow-sm shadow-indigo-500/30'
                        : 'bg-muted/60 text-muted-foreground hover:bg-muted hover:text-foreground'
                    )}
                  >
                    <span>2. Profiles</span>
                    <span className="text-[11px] font-bold text-red-500 dark:text-red-400">*</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => scrollToSection('section-experience')}
                    className={cn(
                      'px-2.5 py-1 rounded-lg text-xs font-semibold whitespace-nowrap transition-all flex items-center gap-1 cursor-pointer select-none',
                      activeSection === 'experience'
                        ? 'bg-indigo-600 text-white shadow-sm shadow-indigo-500/30'
                        : 'bg-muted/60 text-muted-foreground hover:bg-muted hover:text-foreground'
                    )}
                  >
                    <span>3. Experience</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => scrollToSection('section-resume')}
                    className={cn(
                      'px-2.5 py-1 rounded-lg text-xs font-semibold whitespace-nowrap transition-all flex items-center gap-1 cursor-pointer select-none',
                      activeSection === 'resume'
                        ? 'bg-indigo-600 text-white shadow-sm shadow-indigo-500/30'
                        : 'bg-muted/60 text-muted-foreground hover:bg-muted hover:text-foreground'
                    )}
                  >
                    <span>4. Resume (PDF)</span>
                    <span className="text-[11px] font-bold text-red-500 dark:text-red-400">*</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => scrollToSection('section-cover')}
                    className={cn(
                      'px-2.5 py-1 rounded-lg text-xs font-semibold whitespace-nowrap transition-all flex items-center gap-1 cursor-pointer select-none',
                      activeSection === 'cover'
                        ? 'bg-indigo-600 text-white shadow-sm shadow-indigo-500/30'
                        : 'bg-muted/60 text-muted-foreground hover:bg-muted hover:text-foreground'
                    )}
                  >
                    <span>5. Note</span>
                  </button>
                </div>
              </div>

              {/* SMOOTH SCROLLABLE FORM BODY */}
              <div
                ref={scrollContainerRef}
                onScroll={handleScroll}
                data-lenis-prevent="true"
                className="modal-scroll-viewport flex-1 min-h-0 overscroll-contain p-6 sm:p-8 space-y-8 select-text"
              >
                <form id="career-apply-form" onSubmit={handleSubmit} className="space-y-8">
                  {errorMessage && (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.98 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="p-4 rounded-2xl bg-destructive/10 border border-destructive/20 text-destructive text-sm flex items-start gap-3 font-medium"
                    >
                      <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
                      <span>{errorMessage}</span>
                    </motion.div>
                  )}

                  {/* SECTION 1: PERSONAL & CONTACT INFORMATION */}
                  <div id="section-personal" className="space-y-4">
                    <div className="flex items-center gap-2 pb-2 border-b border-border/40">
                      <span className="w-6 h-6 rounded-full bg-indigo-100 dark:bg-indigo-900/60 text-indigo-600 dark:text-indigo-400 flex items-center justify-center font-bold text-xs">
                        1
                      </span>
                      <h4 className="text-sm font-bold uppercase tracking-wider text-foreground">
                        Personal & Contact Details
                      </h4>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="space-y-1.5">
                        <Label htmlFor="candidateName" className="text-xs font-semibold text-muted-foreground flex items-center gap-1.5">
                          <User className="w-3.5 h-3.5 text-indigo-500" />
                          Full Legal Name <span className="text-destructive">*</span>
                        </Label>
                        <Input
                          id="candidateName"
                          value={candidateName}
                          onChange={(e) => setCandidateName(e.target.value)}
                          placeholder="e.g. Alexander Vance"
                          required
                          className="bg-muted/30 dark:bg-zinc-900/50 border-border/60 rounded-xl h-11 focus-visible:ring-indigo-500 text-sm"
                        />
                      </div>

                      <div className="space-y-1.5">
                        <Label htmlFor="email" className="text-xs font-semibold text-muted-foreground flex items-center gap-1.5">
                          <Mail className="w-3.5 h-3.5 text-indigo-500" />
                          Primary Email Address <span className="text-destructive">*</span>
                        </Label>
                        <Input
                          id="email"
                          type="email"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          placeholder="e.g. alexander.vance@example.com"
                          required
                          className="bg-muted/30 dark:bg-zinc-900/50 border-border/60 rounded-xl h-11 focus-visible:ring-indigo-500 text-sm"
                        />
                      </div>

                      <div className="space-y-1.5">
                        <Label htmlFor="phone" className="text-xs font-semibold text-muted-foreground flex items-center gap-1.5">
                          <Phone className="w-3.5 h-3.5 text-pink-500" />
                          Phone Number (with Country Code) <span className="text-destructive">*</span>
                        </Label>
                        <Input
                          id="phone"
                          type="tel"
                          value={phone}
                          onChange={(e) => setPhone(e.target.value)}
                          placeholder="e.g. +91 98765 43210 or +1 (555) 019-2834"
                          required
                          className="bg-muted/30 dark:bg-zinc-900/50 border-border/60 rounded-xl h-11 focus-visible:ring-indigo-500 text-sm"
                        />
                      </div>

                      <div className="space-y-1.5">
                        <Label htmlFor="currentLocation" className="text-xs font-semibold text-muted-foreground flex items-center gap-1.5">
                          <MapPin className="w-3.5 h-3.5 text-amber-500" />
                          Current Location (City, Country) <span className="text-destructive">*</span>
                        </Label>
                        <Input
                          id="currentLocation"
                          value={currentLocation}
                          onChange={(e) => setCurrentLocation(e.target.value)}
                          placeholder="e.g. Bengaluru, India or London, UK"
                          required
                          className="bg-muted/30 dark:bg-zinc-900/50 border-border/60 rounded-xl h-11 focus-visible:ring-indigo-500 text-sm"
                        />
                      </div>
                    </div>
                  </div>

                  {/* SECTION 2: PROFESSIONAL PROFILES & PORTFOLIO */}
                  <div id="section-profiles" className="space-y-4">
                    <div className="flex items-center justify-between pb-2 border-b border-border/40">
                      <div className="flex items-center gap-2">
                        <span className="w-6 h-6 rounded-full bg-blue-100 dark:bg-blue-900/60 text-blue-600 dark:text-blue-400 flex items-center justify-center font-bold text-xs">
                          2
                        </span>
                        <h4 className="text-sm font-bold uppercase tracking-wider text-foreground">
                          Professional Profiles & Work Samples
                        </h4>
                      </div>
                      <Badge variant="outline" className="text-[11px] border-blue-500/30 text-blue-600 dark:text-blue-400">
                        LinkedIn Required
                      </Badge>
                    </div>

                    <div className="space-y-3.5">
                      <div className="space-y-1.5">
                        <div className="flex items-center justify-between">
                          <Label htmlFor="linkedInUrl" className="text-xs font-semibold text-foreground flex items-center gap-1.5">
                            <FaLinkedin className="w-4 h-4 text-[#0077b5]" />
                            LinkedIn Profile URL <span className="text-destructive">*</span>
                          </Label>
                          <span className="text-[11px] font-medium text-indigo-600 dark:text-indigo-400">
                            Required by Hiring Lead
                          </span>
                        </div>
                        <Input
                          id="linkedInUrl"
                          type="url"
                          value={linkedInUrl}
                          onChange={(e) => setLinkedInUrl(e.target.value)}
                          placeholder="https://www.linkedin.com/in/yourprofile"
                          required
                          className="bg-muted/30 dark:bg-zinc-900/50 border-border/60 rounded-xl h-11 focus-visible:ring-indigo-500 text-sm"
                        />
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="space-y-1.5">
                          <Label htmlFor="githubUrl" className="text-xs font-semibold text-muted-foreground flex items-center gap-1.5">
                            <FaGithub className="w-4 h-4 text-foreground" />
                            GitHub Profile (Optional)
                          </Label>
                          <Input
                            id="githubUrl"
                            type="url"
                            value={githubUrl}
                            onChange={(e) => setGithubUrl(e.target.value)}
                            placeholder="https://github.com/yourhandle"
                            className="bg-muted/30 dark:bg-zinc-900/50 border-border/60 rounded-xl h-11 focus-visible:ring-indigo-500 text-sm"
                          />
                        </div>

                        <div className="space-y-1.5">
                          <Label htmlFor="portfolioUrl" className="text-xs font-semibold text-muted-foreground flex items-center gap-1.5">
                            <Globe className="w-4 h-4 text-emerald-500" />
                            Portfolio / Personal Site (Optional)
                          </Label>
                          <Input
                            id="portfolioUrl"
                            type="url"
                            value={portfolioUrl}
                            onChange={(e) => setPortfolioUrl(e.target.value)}
                            placeholder="https://yourportfolio.dev"
                            className="bg-muted/30 dark:bg-zinc-900/50 border-border/60 rounded-xl h-11 focus-visible:ring-indigo-500 text-sm"
                          />
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* SECTION 3: PROFESSIONAL EXPERIENCE & AVAILABILITY */}
                  <div id="section-experience" className="space-y-4">
                    <div className="flex items-center gap-2 pb-2 border-b border-border/40">
                      <span className="w-6 h-6 rounded-full bg-emerald-100 dark:bg-emerald-900/60 text-emerald-600 dark:text-emerald-400 flex items-center justify-center font-bold text-xs">
                        3
                      </span>
                      <h4 className="text-sm font-bold uppercase tracking-wider text-foreground">
                        Experience & Availability
                      </h4>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="space-y-1.5">
                        <Label htmlFor="experienceYears" className="text-xs font-semibold text-muted-foreground flex items-center gap-1.5">
                          <Briefcase className="w-3.5 h-3.5 text-indigo-500" />
                          Total Relevant Experience <span className="text-destructive">*</span>
                        </Label>
                        <select
                          id="experienceYears"
                          value={experienceYears}
                          onChange={(e) => setExperienceYears(e.target.value)}
                          className="w-full bg-muted/30 dark:bg-zinc-900/50 border border-border/60 rounded-xl h-11 px-3.5 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
                        >
                          <option value="entry">Entry Level / Graduate (&lt; 1 Year)</option>
                          <option value="1-3">1 - 3 Years (Junior / Mid)</option>
                          <option value="3-5">3 - 5 Years (Mid-Senior)</option>
                          <option value="5-8">5 - 8 Years (Senior)</option>
                          <option value="8+">8+ Years (Lead / Staff / Principal)</option>
                        </select>
                      </div>

                      <div className="space-y-1.5">
                        <Label htmlFor="noticePeriod" className="text-xs font-semibold text-muted-foreground flex items-center gap-1.5">
                          <Calendar className="w-3.5 h-3.5 text-amber-500" />
                          Notice Period / Earliest Join Date <span className="text-destructive">*</span>
                        </Label>
                        <select
                          id="noticePeriod"
                          value={noticePeriod}
                          onChange={(e) => setNoticePeriod(e.target.value)}
                          className="w-full bg-muted/30 dark:bg-zinc-900/50 border border-border/60 rounded-xl h-11 px-3.5 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
                        >
                          <option value="immediate">Immediate / Currently Serving Notice</option>
                          <option value="15_days">15 Days or less</option>
                          <option value="30_days">30 Days (Standard)</option>
                          <option value="60_days">60 Days</option>
                          <option value="90_days">90 Days</option>
                        </select>
                      </div>

                      <div className="space-y-1.5">
                        <Label htmlFor="currentCompany" className="text-xs font-semibold text-muted-foreground flex items-center gap-1.5">
                          <Building className="w-3.5 h-3.5 text-blue-500" />
                          Current / Most Recent Organization (Optional)
                        </Label>
                        <Input
                          id="currentCompany"
                          value={currentCompany}
                          onChange={(e) => setCurrentCompany(e.target.value)}
                          placeholder="e.g. Current Employer, Freelance, or University"
                          className="bg-muted/30 dark:bg-zinc-900/50 border-border/60 rounded-xl h-11 focus-visible:ring-indigo-500 text-sm"
                        />
                      </div>

                      <div className="space-y-1.5">
                        <Label htmlFor="expectedSalary" className="text-xs font-semibold text-muted-foreground flex items-center gap-1.5">
                          <DollarSign className="w-3.5 h-3.5 text-emerald-500" />
                          Expected Annual CTC / Compensation (Optional)
                        </Label>
                        <Input
                          id="expectedSalary"
                          value={expectedSalary}
                          onChange={(e) => setExpectedSalary(e.target.value)}
                          placeholder="e.g. ₹18 LPA or $85,000 / year"
                          className="bg-muted/30 dark:bg-zinc-900/50 border-border/60 rounded-xl h-11 focus-visible:ring-indigo-500 text-sm"
                        />
                      </div>
                    </div>
                  </div>

                  {/* SECTION 4: RESUME / CV IN PDF FORMAT (STRICTLY REQUIRED) */}
                  <div id="section-resume" className="space-y-3">
                    <div className="flex items-center justify-between pb-2 border-b border-border/40">
                      <div className="flex items-center gap-2">
                        <span className="w-6 h-6 rounded-full bg-red-100 dark:bg-red-900/60 text-red-600 dark:text-red-400 flex items-center justify-center font-bold text-xs">
                          4
                        </span>
                        <h4 className="text-sm font-bold uppercase tracking-wider text-foreground">
                          Resume / Curriculum Vitae
                        </h4>
                      </div>
                      <Badge variant="outline" className="text-[11px] font-semibold border-red-500/30 text-red-600 dark:text-red-400">
                        PDF Strictly Required (Max 10MB)
                      </Badge>
                    </div>

                    <input
                      ref={fileInputRef}
                      type="file"
                      accept=".pdf,application/pdf"
                      onChange={handleFileChange}
                      className="hidden"
                      id="resume-upload"
                    />

                    {!resumeFile ? (
                      <div
                        onDragOver={handleDragOver}
                        onDragLeave={handleDragLeave}
                        onDrop={handleDrop}
                        onClick={() => fileInputRef.current?.click()}
                        className={cn(
                          'border-2 border-dashed rounded-2xl p-6 sm:p-8 text-center cursor-pointer transition-all duration-300 flex flex-col items-center justify-center gap-3',
                          isDragging
                            ? 'border-indigo-500 bg-indigo-50/50 dark:bg-indigo-950/30 scale-[1.01]'
                            : 'border-border/80 hover:border-indigo-400 hover:bg-muted/30 dark:hover:bg-zinc-900/40'
                        )}
                      >
                        <div className="w-12 h-12 rounded-2xl bg-indigo-100 dark:bg-indigo-900/40 flex items-center justify-center text-indigo-600 dark:text-indigo-400 shadow-sm transition-transform group-hover:scale-110">
                          <UploadCloud className="w-6 h-6" />
                        </div>
                        <div className="space-y-1">
                          <p className="text-sm font-semibold text-foreground">
                            Drag and drop your PDF resume here, or{' '}
                            <span className="text-indigo-600 dark:text-indigo-400 underline underline-offset-2">
                              browse files
                            </span>
                          </p>
                          <p className="text-xs text-muted-foreground">
                            Format: PDF documents only (.pdf) • Maximum file size: 10 MB
                          </p>
                        </div>
                      </div>
                    ) : (
                      <div className="p-4 rounded-2xl border border-indigo-200 dark:border-indigo-900/50 bg-indigo-50/50 dark:bg-indigo-950/20 flex items-center justify-between gap-4">
                        <div className="flex items-center gap-3.5 overflow-hidden">
                          <div className="w-11 h-11 rounded-xl bg-red-100 dark:bg-red-950/60 flex items-center justify-center text-red-600 dark:text-red-400 shrink-0 font-black text-xs shadow-sm">
                            PDF
                          </div>
                          <div className="truncate">
                            <p className="text-sm font-semibold text-foreground truncate">
                              {resumeFile.name}
                            </p>
                            <div className="flex items-center gap-2 mt-0.5">
                              <span className="text-xs text-muted-foreground font-mono">
                                {formatFileSize(resumeFile.size)}
                              </span>
                              <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-600 dark:text-emerald-400">
                                <FileCheck className="w-3.5 h-3.5" />
                                Verified PDF
                              </span>
                            </div>
                          </div>
                        </div>

                        <div className="flex items-center gap-1.5 shrink-0">
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            onClick={() => fileInputRef.current?.click()}
                            className="text-xs text-muted-foreground hover:text-foreground h-8 px-2.5 rounded-lg"
                          >
                            Replace
                          </Button>
                          <Button
                            type="button"
                            variant="ghost"
                            size="icon-xs"
                            onClick={() => setResumeFile(null)}
                            className="text-muted-foreground hover:text-destructive h-8 w-8 rounded-lg"
                          >
                            <X className="w-4 h-4" />
                            <span className="sr-only">Remove file</span>
                          </Button>
                        </div>
                      </div>
                    )}

                    {fileError && (
                      <p className="text-xs font-medium text-destructive flex items-center gap-1.5 mt-1">
                        <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                        {fileError}
                      </p>
                    )}
                  </div>

                  {/* SECTION 5: COVER LETTER / NOTE TO RECRUITER (OPTIONAL) */}
                  <div id="section-cover" className="space-y-3">
                    <div className="flex items-center justify-between pb-2 border-b border-border/40">
                      <div className="flex items-center gap-2">
                        <span className="w-6 h-6 rounded-full bg-purple-100 dark:bg-purple-900/60 text-purple-600 dark:text-purple-400 flex items-center justify-center font-bold text-xs">
                          5
                        </span>
                        <h4 className="text-sm font-bold uppercase tracking-wider text-foreground">
                          Statement & Cover Letter
                        </h4>
                      </div>
                      <button
                        type="button"
                        onClick={() => setShowCoverLetter(!showCoverLetter)}
                        className="text-xs font-semibold text-indigo-600 dark:text-indigo-400 hover:underline flex items-center gap-1 cursor-pointer"
                      >
                        <span>{showCoverLetter ? '− Hide Field' : '+ Add Cover Note (Optional)'}</span>
                      </button>
                    </div>

                    <AnimatePresence>
                      {showCoverLetter && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: 'auto' }}
                          exit={{ opacity: 0, height: 0 }}
                          transition={{ duration: 0.2 }}
                          className="space-y-2 overflow-hidden"
                        >
                          <div className="flex items-center justify-between text-xs text-muted-foreground">
                            <span>Share your motivation or notable project impact:</span>
                            <span className="font-mono">{coverLetter.length} / 2000 chars</span>
                          </div>
                          <Textarea
                            id="coverLetter"
                            value={coverLetter}
                            maxLength={2000}
                            onChange={(e) => setCoverLetter(e.target.value)}
                            placeholder="Introduce yourself, highlight recent technical milestones, or tell us why you want to build the future with InGrowwth Innovations..."
                            className="min-h-[120px] bg-muted/30 dark:bg-zinc-900/50 border-border/60 rounded-xl resize-none text-sm leading-relaxed"
                          />
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>

                  {/* SECTION 6: CONSENT & ACCURACY DECLARATION */}
                  <div className="p-4 rounded-2xl bg-muted/30 dark:bg-zinc-900/30 border border-border/50 space-y-3">
                    <label className="flex items-start gap-3 cursor-pointer text-xs text-muted-foreground select-none leading-relaxed">
                      <input
                        type="checkbox"
                        checked={agreedToTerms}
                        onChange={(e) => setAgreedToTerms(e.target.checked)}
                        className="mt-0.5 rounded border-border text-indigo-600 focus:ring-indigo-500 w-4 h-4 cursor-pointer shrink-0"
                      />
                      <span>
                        I certify that all information submitted is true, complete, and accurate. I authorize InGrowwth Innovations to process my candidate data in compliance with recruitment privacy guidelines.
                      </span>
                    </label>
                  </div>
                </form>
              </div>

              {/* FLOATING SCROLL DOWN HINT */}
              {canScrollMore && (
                <button
                  type="button"
                  onClick={() => scrollToSection('section-resume')}
                  className="absolute bottom-24 right-6 sm:right-8 z-20 px-3.5 py-1.5 rounded-full bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold shadow-xl shadow-indigo-500/30 backdrop-blur-md flex items-center gap-1.5 transition-all hover:scale-105 cursor-pointer animate-pulse"
                >
                  <span>More Fields Below</span>
                  <ChevronDown className="w-3.5 h-3.5 animate-bounce" />
                </button>
              )}

              {/* FIXED MODAL FOOTER (Always visible with submit action) */}
              <div className="shrink-0 p-4 sm:p-5 border-t border-border/50 bg-background/95 dark:bg-zinc-950/95 backdrop-blur-md flex flex-col sm:flex-row items-center justify-between gap-3">
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <Lock className="w-3.5 h-3.5 text-muted-foreground/70 shrink-0" />
                  <span>256-Bit Encrypted Applicant Portal</span>
                </div>

                <div className="flex items-center gap-3 w-full sm:w-auto justify-end">
                  <Button
                    type="button"
                    variant="outline"
                    disabled={isSubmitting}
                    onClick={() => handleOpenChange(false)}
                    className="rounded-xl px-5 h-11 text-sm font-medium"
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    form="career-apply-form"
                    disabled={isSubmitting}
                    className="rounded-xl px-7 h-11 font-semibold bg-gradient-to-r from-indigo-600 via-purple-600 to-indigo-700 hover:from-indigo-500 hover:to-indigo-600 text-white shadow-lg shadow-indigo-500/20 active:scale-[0.98] transition-all cursor-pointer text-sm"
                  >
                    {isSubmitting ? (
                      <span className="flex items-center gap-2">
                        <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        Submitting Application...
                      </span>
                    ) : (
                      <span className="flex items-center gap-2">
                        Submit Application
                        <ArrowRight className="w-4 h-4" />
                      </span>
                    )}
                  </Button>
                </div>
              </div>
            </div>
          ) : (
            /* POST-SUBMISSION SUCCESS SCREEN */
            <motion.div
              key="success-screen"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3 }}
              className="p-8 sm:p-12 text-center space-y-6 my-auto"
            >
              <div className="relative inline-flex items-center justify-center">
                <div className="absolute inset-0 rounded-full bg-emerald-500/20 blur-xl animate-pulse" />
                <div className="relative w-16 h-16 rounded-full bg-gradient-to-tr from-emerald-500 to-teal-400 flex items-center justify-center text-white shadow-xl shadow-emerald-500/30">
                  <CheckCircle2 className="w-9 h-9" />
                </div>
              </div>

              <div className="space-y-2 max-w-md mx-auto">
                <h3 className="text-2xl font-bold tracking-tight text-foreground">
                  Application Received! 🎉
                </h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  Thank you, <strong className="text-foreground">{candidateName}</strong>! Your application for{' '}
                  <strong className="text-foreground">{jobTitle}</strong> has been logged into our candidate database.
                </p>
                <p className="text-xs text-muted-foreground pt-1">
                  A confirmation email has been dispatched to{' '}
                  <span className="font-mono text-foreground font-medium">{email}</span>.
                </p>
              </div>

              {/* What Happens Next Roadmap Card */}
              <div className="p-5 rounded-2xl bg-muted/40 border border-border/60 text-left max-w-md mx-auto space-y-3">
                <p className="text-xs font-semibold uppercase tracking-wider text-foreground flex items-center gap-2">
                  <Sparkles className="w-3.5 h-3.5 text-indigo-500" />
                  What happens next
                </p>
                <div className="space-y-2.5 text-xs text-muted-foreground">
                  <div className="flex items-start gap-2.5">
                    <div className="w-5 h-5 rounded-full bg-indigo-100 dark:bg-indigo-900/50 text-indigo-600 dark:text-indigo-400 flex items-center justify-center font-bold text-[11px] shrink-0 mt-0.5">
                      1
                    </div>
                    <span>
                      <strong>Candidate & Profile Review:</strong> Our technical recruiting team reviews your resume and LinkedIn within 48 hours.
                    </span>
                  </div>
                  <div className="flex items-start gap-2.5">
                    <div className="w-5 h-5 rounded-full bg-indigo-100 dark:bg-indigo-900/50 text-indigo-600 dark:text-indigo-400 flex items-center justify-center font-bold text-[11px] shrink-0 mt-0.5">
                      2
                    </div>
                    <span>
                      <strong>Initial Screening:</strong> Qualified candidates receive an invitation for an introductory video call.
                    </span>
                  </div>
                  <div className="flex items-start gap-2.5">
                    <div className="w-5 h-5 rounded-full bg-indigo-100 dark:bg-indigo-900/50 text-indigo-600 dark:text-indigo-400 flex items-center justify-center font-bold text-[11px] shrink-0 mt-0.5">
                      3
                    </div>
                    <span>
                      <strong>Technical Discussion:</strong> Collaborative technical architecture and system design interview.
                    </span>
                  </div>
                </div>
              </div>

              <div className="pt-2">
                <Button
                  onClick={() => handleOpenChange(false)}
                  className="rounded-xl px-8 h-11 bg-foreground text-background hover:bg-foreground/90 font-medium"
                >
                  Done
                </Button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </DialogContent>
    </Dialog>
  );
}
