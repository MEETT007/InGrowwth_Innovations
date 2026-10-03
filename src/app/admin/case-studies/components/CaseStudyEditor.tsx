'use client';

import React, { useState, useEffect } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { toast } from 'sonner';
import {
  Image as ImageIcon,
  Globe,
  Settings,
  Target,
  Activity,
  Plus,
  X,
  TrendingUp,
  Cpu,
  Layers,
  Quote,
  Star,
  Download,
  Building2,
  CheckCircle2,
  Trash2,
} from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import { ScrollArea } from '@/components/ui/scroll-area';
import { logger } from '@/lib/logger';
import {
  parseArrayField,
  parseMetricsField,
  parseTestimonialField,
  MetricItem,
  POPULAR_TECH_TAGS,
} from '@/lib/data-helpers';

const POPULAR_INDUSTRIES = [
  'FinTech & Banking',
  'HealthTech & Life Sciences',
  'E-Commerce & Retail',
  'Enterprise SaaS',
  'Artificial Intelligence',
  'Supply Chain & Logistics',
  'CleanTech & Energy',
];

const PRESET_KPIS: MetricItem[] = [
  { value: '+240%', label: 'Platform Performance' },
  { value: '99.99%', label: 'Infrastructure Uptime' },
  { value: '< 300ms', label: 'API Response Latency' },
  { value: '4.8x', label: 'Operational ROI' },
];

const caseStudySchema = z.object({
  title: z.string().min(3, 'Title is required'),
  slug: z.string().min(2, 'Slug is required'),
  clientName: z.string().optional(),
  industry: z.string().optional(),
  heroBanner: z.any().optional(),
  coverImage: z.any().optional(),
  problemStatement: z.string().optional(),
  businessChallenges: z.string().optional(),
  objectives: z.string().optional(),
  research: z.string().optional(),
  strategy: z.string().optional(),
  solution: z.string().optional(),
  architecture: z.string().optional(),
  designProcess: z.string().optional(),
  developmentJourney: z.string().optional(),
  technologies: z.string().optional(),
  beforeVsAfter: z.string().optional(),
  kpis: z.string().optional(),
  charts: z.string().optional(),
  roi: z.string().optional(),
  results: z.string().optional(),
  clientTestimonial: z.string().optional(),
  downloadPdfUrl: z.string().optional(),
  cta: z.string().optional(),
  seoTitle: z.string().optional(),
  seoDescription: z.string().optional(),
  status: z.enum(['DRAFT', 'PUBLISHED']),
});

type CaseStudyFormValues = z.infer<typeof caseStudySchema>;

interface CaseStudyEditorProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  initialData?: any;
}

export function CaseStudyEditor({
  isOpen,
  onClose,
  onSuccess,
  initialData,
}: CaseStudyEditorProps) {
  const [isUploadingCover, setIsUploadingCover] = useState(false);
  const [coverPreview, setCoverPreview] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Interactive state items
  const [techList, setTechList] = useState<string[]>([]);
  const [techInput, setTechInput] = useState('');
  const [kpiList, setKpiList] = useState<MetricItem[]>([]);
  const [kpiValInput, setKpiValInput] = useState('');
  const [kpiLabelInput, setKpiLabelInput] = useState('');

  // Structured Testimonial State
  const [testQuote, setTestQuote] = useState('');
  const [testAuthor, setTestAuthor] = useState('');
  const [testRole, setTestRole] = useState('');
  const [testCompany, setTestCompany] = useState('');

  // Structured Before vs After State
  const [beforeText, setBeforeText] = useState('');
  const [afterText, setAfterText] = useState('');

  const form = useForm<CaseStudyFormValues>({
    resolver: zodResolver(caseStudySchema),
    defaultValues: {
      title: '',
      slug: '',
      clientName: '',
      industry: '',
      heroBanner: '',
      coverImage: '',
      problemStatement: '',
      businessChallenges: '',
      objectives: '',
      research: '',
      strategy: '',
      solution: '',
      architecture: '',
      designProcess: '',
      developmentJourney: '',
      technologies: '',
      beforeVsAfter: '',
      kpis: '',
      charts: '',
      roi: '',
      results: '',
      clientTestimonial: '',
      downloadPdfUrl: '',
      cta: '',
      seoTitle: '',
      seoDescription: '',
      status: 'DRAFT',
    },
  });

  useEffect(() => {
    if (isOpen) {
      if (initialData) {
        form.reset({
          title: initialData.title || '',
          slug: initialData.slug || '',
          clientName: initialData.clientName || '',
          industry: initialData.industry || '',
          heroBanner: initialData.heroBanner || '',
          coverImage: initialData.coverImage || '',
          problemStatement: initialData.problemStatement || '',
          businessChallenges: initialData.businessChallenges || '',
          objectives: initialData.objectives || '',
          research: initialData.research || '',
          strategy: initialData.strategy || '',
          solution: initialData.solution || '',
          architecture: initialData.architecture || '',
          designProcess: initialData.designProcess || '',
          developmentJourney: initialData.developmentJourney || '',
          technologies: initialData.technologies || '',
          beforeVsAfter: initialData.beforeVsAfter || '',
          kpis: initialData.kpis || '',
          charts: initialData.charts || '',
          roi: initialData.roi || '',
          results: initialData.results || '',
          clientTestimonial: initialData.clientTestimonial || '',
          downloadPdfUrl: initialData.downloadPdfUrl || '',
          cta: initialData.cta || '',
          seoTitle: initialData.seoTitle || '',
          seoDescription: initialData.seoDescription || '',
          status: initialData.status || 'DRAFT',
        });
        setCoverPreview(initialData.coverImage || null);
        setTechList(parseArrayField(initialData.technologies));
        setKpiList(parseMetricsField(initialData.kpis));

        const testData = parseTestimonialField(initialData.clientTestimonial);
        if (testData) {
          setTestQuote(testData.quote);
          setTestAuthor(testData.author || '');
          setTestRole(testData.role || '');
          setTestCompany(testData.company || '');
        } else {
          setTestQuote(typeof initialData.clientTestimonial === 'string' ? initialData.clientTestimonial : '');
          setTestAuthor('');
          setTestRole('');
          setTestCompany('');
        }

        if (initialData.beforeVsAfter) {
          try {
            const parsed = JSON.parse(initialData.beforeVsAfter);
            setBeforeText(parsed.before || '');
            setAfterText(parsed.after || '');
          } catch {
            setBeforeText(initialData.beforeVsAfter);
            setAfterText('');
          }
        } else {
          setBeforeText('');
          setAfterText('');
        }
      } else {
        form.reset({
          title: '',
          slug: '',
          clientName: '',
          industry: 'FinTech & Banking',
          heroBanner: '',
          coverImage: '',
          problemStatement: '',
          businessChallenges: '',
          objectives: '',
          research: '',
          strategy: '',
          solution: '',
          architecture: '',
          designProcess: '',
          developmentJourney: '',
          technologies: '',
          beforeVsAfter: '',
          kpis: '',
          charts: '',
          roi: '',
          results: '',
          clientTestimonial: '',
          downloadPdfUrl: '',
          cta: '',
          seoTitle: '',
          seoDescription: '',
          status: 'DRAFT',
        });
        setCoverPreview(null);
        setTechList(['Next.js', 'TypeScript', 'PostgreSQL', 'AWS']);
        setKpiList([
          { value: '+240%', label: 'Platform Throughput' },
          { value: '< 250ms', label: 'Average Latency' },
        ]);
        setTestQuote('');
        setTestAuthor('');
        setTestRole('');
        setTestCompany('');
        setBeforeText('');
        setAfterText('');
      }
    }
  }, [initialData, isOpen, form]);

  // eslint-disable-next-line react-hooks/incompatible-library
  const title = form.watch('title');
  const seoTitle = form.watch('seoTitle');
  const seoDescription = form.watch('seoDescription');
  const slug = form.watch('slug');

  // Auto-generate slug
  useEffect(() => {
    if (!initialData?.id && title) {
      const generatedSlug = title
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)+/g, '');
      form.setValue('slug', generatedSlug, { shouldValidate: true });
    }
  }, [title, initialData?.id, form]);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    const file = files[0];
    if (file.size > 5 * 1024 * 1024) {
      toast.error('File size exceeds 5MB limit.');
      return;
    }

    const formData = new FormData();
    formData.append('file', file);

    setIsUploadingCover(true);
    const toastId = toast.loading('Uploading cover image...');

    try {
      const response = await fetch('/api/upload?folder=casestudies', {
        method: 'POST',
        body: formData,
      });

      const result = await response.json();
      if (result.success && result.url) {
        form.setValue('coverImage', result.url);
        setCoverPreview(result.url);
        toast.success('Cover image uploaded successfully!', { id: toastId });
      } else {
        toast.error(result.message || 'Upload failed.', { id: toastId });
      }
    } catch (error) {
      logger.error('Error uploading file:', error);
      toast.error('An error occurred during upload.', { id: toastId });
    } finally {
      setIsUploadingCover(false);
    }
  };

  // Technologies handlers
  const addTechTag = (tag: string) => {
    const trimmed = tag.trim();
    if (trimmed && !techList.includes(trimmed)) {
      setTechList([...techList, trimmed]);
    }
  };

  const removeTechTag = (index: number) => {
    setTechList(techList.filter((_, i) => i !== index));
  };

  // KPI handlers
  const addKpiItem = (val: string, lbl: string) => {
    const v = val.trim();
    const l = lbl.trim();
    if (v && l) {
      setKpiList([...kpiList, { value: v, label: l }]);
      setKpiValInput('');
      setKpiLabelInput('');
    }
  };

  const removeKpiItem = (index: number) => {
    setKpiList(kpiList.filter((_, i) => i !== index));
  };

  const onSubmit = async (data: CaseStudyFormValues) => {
    setIsSubmitting(true);
    const toastId = toast.loading(
      initialData?.id ? 'Updating Case Study...' : 'Saving Case Study...'
    );

    // Normalize structured arrays and objects into database format
    const payload = {
      ...data,
      technologies: JSON.stringify(techList),
      kpis: JSON.stringify(kpiList),
      clientTestimonial: testQuote.trim()
        ? JSON.stringify({
            quote: testQuote.trim(),
            author: testAuthor.trim() || undefined,
            role: testRole.trim() || undefined,
            company: testCompany.trim() || undefined,
          })
        : null,
      beforeVsAfter:
        beforeText.trim() || afterText.trim()
          ? JSON.stringify({
              before: beforeText.trim(),
              after: afterText.trim(),
            })
          : null,
    };

    try {
      const url = initialData?.id
        ? `/api/admin/case-studies/${initialData.id}`
        : '/api/admin/case-studies';
      const method = initialData?.id ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const res = await response.json();
      if (res.success) {
        toast.success(res.message, { id: toastId });
        onSuccess();
        onClose();
      } else {
        toast.error(res.message || 'Action failed.', { id: toastId });
      }
    } catch (error) {
      logger.error('Error saving case study:', error);
      toast.error('Failed to save case study.', { id: toastId });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-[95vw] md:max-w-5xl p-0 bg-background/95 backdrop-blur-2xl border border-white/10 shadow-2xl rounded-3xl overflow-hidden flex flex-col max-h-[92vh]">
        {/* Header Bar */}
        <DialogHeader className="px-6 py-4 border-b border-border/40 sticky top-0 bg-background/90 backdrop-blur-md z-10 flex flex-row items-center justify-between">
          <div className="flex items-center justify-between w-full pr-8">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400">
                <Target className="w-5 h-5" />
              </div>
              <div>
                <DialogTitle className="text-xl font-bold tracking-tight">
                  {initialData?.id ? 'Edit Enterprise Case Study' : 'Create Enterprise Case Study'}
                </DialogTitle>
                <DialogDescription className="text-xs">
                  Enterprise deep-dive showcase with synced public rendering
                </DialogDescription>
              </div>
            </div>
            <div className="flex items-center gap-2.5">
              <Button
                variant="outline"
                onClick={() => {
                  form.setValue('status', 'DRAFT');
                  form.handleSubmit((d) => onSubmit({ ...d, status: 'DRAFT' }))();
                }}
                disabled={isSubmitting}
                type="button"
                size="sm"
                className="rounded-full text-xs font-semibold px-4"
              >
                Save as Draft
              </Button>
              <Button
                onClick={() => {
                  form.setValue('status', 'PUBLISHED');
                  form.handleSubmit((d) => onSubmit({ ...d, status: 'PUBLISHED' }))();
                }}
                disabled={isSubmitting}
                size="sm"
                className="bg-indigo-600 hover:bg-indigo-700 text-white rounded-full text-xs font-semibold px-5 shadow-lg shadow-indigo-500/25"
              >
                {isSubmitting ? 'Saving...' : initialData?.id ? 'Update & Publish' : 'Publish Study'}
              </Button>
            </div>
          </div>
        </DialogHeader>

        <ScrollArea className="flex-1 px-6 py-6 overflow-y-auto">
          <form
            id="casestudy-form"
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-8 pb-12"
          >
            {/* Core Info & Cover Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
              {/* Title & Metadata (7 cols) */}
              <div className="lg:col-span-7 space-y-4">
                <div>
                  <Label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                    Case Study Title
                  </Label>
                  <Input
                    placeholder="e.g. Scaling Real-Time Global Payments to 10M+ DAU"
                    className="text-2xl sm:text-3xl font-extrabold border-none bg-transparent px-0 focus-visible:ring-0 shadow-none placeholder:text-muted-foreground/40 h-auto mt-1"
                    {...form.register('title')}
                  />
                  {form.formState.errors.title && (
                    <p className="text-xs text-destructive mt-1">
                      {form.formState.errors.title.message}
                    </p>
                  )}
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
                  <div className="space-y-1">
                    <Label className="text-xs font-semibold">URL Slug</Label>
                    <Input
                      placeholder="payments-scaling"
                      className="bg-muted/40 border-border/50 text-xs font-mono"
                      {...form.register('slug')}
                    />
                  </div>
                  <div className="space-y-1">
                    <Label className="text-xs font-semibold">Client Name</Label>
                    <Input
                      placeholder="Global FinTech Corp"
                      className="bg-muted/40 border-border/50 text-xs"
                      {...form.register('clientName')}
                    />
                  </div>
                  <div className="space-y-1">
                    <Label className="text-xs font-semibold">Industry</Label>
                    <Input
                      placeholder="FinTech & Banking"
                      list="case-study-industries"
                      className="bg-muted/40 border-border/50 text-xs"
                      {...form.register('industry')}
                    />
                    <datalist id="case-study-industries">
                      {POPULAR_INDUSTRIES.map((ind) => (
                        <option key={ind} value={ind} />
                      ))}
                    </datalist>
                  </div>
                </div>
              </div>

              {/* Cover Image Upload (5 cols) */}
              <div className="lg:col-span-5">
                <Label className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-2 block">
                  Cover Image
                </Label>
                <div className="relative group rounded-2xl border-2 border-dashed border-border/60 bg-muted/20 hover:bg-muted/30 transition-colors overflow-hidden flex flex-col items-center justify-center min-h-[170px]">
                  {coverPreview ? (
                    <>
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={coverPreview}
                        alt="Cover Preview"
                        className="absolute inset-0 w-full h-full object-cover"
                      />
                      <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3">
                        <Button
                          type="button"
                          variant="secondary"
                          size="sm"
                          className="rounded-full text-xs"
                          onClick={() => document.getElementById('cover-upload')?.click()}
                        >
                          <ImageIcon className="h-3.5 w-3.5 mr-1.5" /> Change
                        </Button>
                      </div>
                    </>
                  ) : (
                    <div
                      className="flex flex-col items-center justify-center p-6 text-center space-y-2 cursor-pointer"
                      onClick={() => document.getElementById('cover-upload')?.click()}
                    >
                      <div className="h-10 w-10 rounded-full bg-indigo-500/10 flex items-center justify-center text-indigo-400">
                        <ImageIcon className="h-5 w-5" />
                      </div>
                      <div>
                        <p className="font-semibold text-xs text-foreground">Upload Case Study Cover</p>
                        <p className="text-[11px] text-muted-foreground">PNG, JPG or WebP up to 5MB</p>
                      </div>
                    </div>
                  )}
                  <input
                    id="cover-upload"
                    type="file"
                    className="hidden"
                    accept="image/*"
                    disabled={isUploadingCover}
                    onChange={handleFileUpload}
                  />
                </div>
              </div>
            </div>

            {/* Content Tabs */}
            <Tabs defaultValue="challenge" className="w-full">
              <TabsList className="grid w-full grid-cols-2 lg:grid-cols-5 mb-6 h-auto p-1.5 bg-slate-900/90 dark:bg-zinc-900/90 rounded-2xl border border-white/10 shadow-inner">
                <TabsTrigger value="challenge" className="py-2.5 rounded-xl text-xs font-semibold">
                  <Target className="h-3.5 w-3.5 mr-2" /> 1. The Challenge
                </TabsTrigger>
                <TabsTrigger value="strategy" className="py-2.5 rounded-xl text-xs font-semibold">
                  <Layers className="h-3.5 w-3.5 mr-2" /> 2. Strategy & Tech
                </TabsTrigger>
                <TabsTrigger value="solution" className="py-2.5 rounded-xl text-xs font-semibold">
                  <Cpu className="h-3.5 w-3.5 mr-2" /> 3. Architecture & UX
                </TabsTrigger>
                <TabsTrigger value="impact" className="py-2.5 rounded-xl text-xs font-semibold">
                  <TrendingUp className="h-3.5 w-3.5 mr-2" /> 4. KPIs & Impact
                </TabsTrigger>
                <TabsTrigger value="distribution" className="py-2.5 rounded-xl text-xs font-semibold">
                  <Globe className="h-3.5 w-3.5 mr-2" /> 5. PDF & SEO
                </TabsTrigger>
              </TabsList>

              {/* TAB 1: The Challenge */}
              <TabsContent
                value="challenge"
                className="space-y-6 bg-card/40 p-6 rounded-3xl border border-border/50 backdrop-blur-sm"
              >
                <div>
                  <h3 className="text-base font-bold text-foreground mb-1">
                    Problem Space & Business Objectives
                  </h3>
                  <p className="text-xs text-muted-foreground">
                    Set the context of why the enterprise client required our strategic engineering intervention.
                  </p>
                </div>

                <div className="space-y-4">
                  <div className="space-y-1.5">
                    <Label className="text-xs font-semibold">Problem Statement</Label>
                    <Textarea
                      placeholder="Outline the core existential challenge the business faced (e.g. monolithic bottlenecks, high churn, compliance risks)..."
                      className="bg-background/80 min-h-[120px] text-sm leading-relaxed"
                      {...form.register('problemStatement')}
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <Label className="text-xs font-semibold">Business Challenges</Label>
                      <Textarea
                        placeholder="Specific operational roadblocks faced (e.g. 12s latency during peak sales, manual reconciliations)..."
                        className="bg-background/80 min-h-[120px] text-sm leading-relaxed"
                        {...form.register('businessChallenges')}
                      />
                    </div>
                    <div className="space-y-1.5">
                      <Label className="text-xs font-semibold">Project Objectives & Targets</Label>
                      <Textarea
                        placeholder="Key milestones to hit (e.g. sub-second settlement, 99.999% SLA, SOC 2 certification)..."
                        className="bg-background/80 min-h-[120px] text-sm leading-relaxed"
                        {...form.register('objectives')}
                      />
                    </div>
                  </div>
                </div>
              </TabsContent>

              {/* TAB 2: Strategy & Tech */}
              <TabsContent
                value="strategy"
                className="space-y-6 bg-card/40 p-6 rounded-3xl border border-border/50 backdrop-blur-sm"
              >
                <div>
                  <h3 className="text-base font-bold text-foreground mb-1">
                    Strategic Blueprint & Technologies Used
                  </h3>
                  <p className="text-xs text-muted-foreground">
                    Detail the research methods and technology stack leveraged to build the solution.
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <Label className="text-xs font-semibold">Market Research & User Insights</Label>
                    <Textarea
                      placeholder="How we audited user sessions, gathered competitive telemetry, and scoped user journeys..."
                      className="bg-background/80 min-h-[130px] text-sm leading-relaxed"
                      {...form.register('research')}
                    />
                  </div>
                  <div className="space-y-1.5">
                    <Label className="text-xs font-semibold">Execution Strategy & Methodology</Label>
                    <Textarea
                      placeholder="Our high-level strategy (e.g. phased Strangler Fig migration, micro-frontends, event-driven streaming)..."
                      className="bg-background/80 min-h-[130px] text-sm leading-relaxed"
                      {...form.register('strategy')}
                    />
                  </div>
                </div>

                {/* Interactive Technologies Tag Selector */}
                <div className="p-5 rounded-2xl bg-background/50 border border-border/50 space-y-3">
                  <div className="flex items-center justify-between">
                    <Label className="text-xs font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
                      <Cpu className="w-3.5 h-3.5 text-indigo-400" /> Technologies & Frameworks
                    </Label>
                    <span className="text-[11px] text-muted-foreground">
                      {techList.length} technologies added
                    </span>
                  </div>

                  {/* Added Tech Pills */}
                  <div className="flex flex-wrap gap-2 min-h-[36px] p-2 rounded-xl bg-card border border-border/40">
                    {techList.length > 0 ? (
                      techList.map((tag, i) => (
                        <span
                          key={i}
                          className="inline-flex items-center gap-1.5 px-3 py-1 bg-indigo-500/10 border border-indigo-500/20 text-indigo-300 text-xs font-medium rounded-lg"
                        >
                          {tag}
                          <button
                            type="button"
                            onClick={() => removeTechTag(i)}
                            className="hover:text-red-400 transition-colors"
                          >
                            <X className="w-3 h-3" />
                          </button>
                        </span>
                      ))
                    ) : (
                      <span className="text-xs text-muted-foreground p-1">
                        No technologies selected yet. Add custom tags or select popular ones below.
                      </span>
                    )}
                  </div>

                  {/* Add Custom Tech Input */}
                  <div className="flex gap-2">
                    <Input
                      placeholder="Add technology (e.g. Redis, Kafka, Kubernetes)..."
                      value={techInput}
                      onChange={(e) => setTechInput(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          e.preventDefault();
                          addTechTag(techInput);
                          setTechInput('');
                        }
                      }}
                      className="bg-background text-xs"
                    />
                    <Button
                      type="button"
                      variant="secondary"
                      size="sm"
                      onClick={() => {
                        addTechTag(techInput);
                        setTechInput('');
                      }}
                      className="text-xs shrink-0"
                    >
                      <Plus className="w-3.5 h-3.5 mr-1" /> Add
                    </Button>
                  </div>

                  {/* Popular Tags Quick-add */}
                  <div className="pt-2">
                    <span className="text-[11px] font-semibold text-muted-foreground block mb-1.5">
                      Popular Tech Tags (Click to add):
                    </span>
                    <div className="flex flex-wrap gap-1.5">
                      {POPULAR_TECH_TAGS.slice(0, 16).map((item) => (
                        <button
                          key={item}
                          type="button"
                          onClick={() => addTechTag(item)}
                          className={`text-[11px] px-2.5 py-1 rounded-md border transition-all ${
                            techList.includes(item)
                              ? 'bg-indigo-600 text-white border-indigo-600'
                              : 'bg-muted/50 text-muted-foreground border-border/50 hover:bg-muted hover:text-foreground'
                          }`}
                        >
                          {techList.includes(item) ? '✓ ' : '+ '}
                          {item}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </TabsContent>

              {/* TAB 3: Architecture & UX */}
              <TabsContent
                value="solution"
                className="space-y-6 bg-card/40 p-6 rounded-3xl border border-border/50 backdrop-blur-sm"
              >
                <div>
                  <h3 className="text-base font-bold text-foreground mb-1">
                    System Architecture & Design Journey
                  </h3>
                  <p className="text-xs text-muted-foreground">
                    Deep dive into technical system architecture, data pipelines, and design methodology.
                  </p>
                </div>

                <div className="space-y-4">
                  <div className="space-y-1.5">
                    <Label className="text-xs font-semibold">The Engineered Solution</Label>
                    <Textarea
                      placeholder="Comprehensive breakdown of the enterprise solution delivered..."
                      className="bg-background/80 min-h-[120px] text-sm leading-relaxed"
                      {...form.register('solution')}
                    />
                  </div>

                  <div className="space-y-1.5">
                    <Label className="text-xs font-semibold">Technical Architecture & Topology</Label>
                    <Textarea
                      placeholder="Detail cloud infrastructure, microservices, databases, caching layers, and security perimeter..."
                      className="bg-background/80 min-h-[120px] text-sm leading-relaxed"
                      {...form.register('architecture')}
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <Label className="text-xs font-semibold">Design & UI/UX Process</Label>
                      <Textarea
                        placeholder="Wireframing, design system tokens, usability testing, accessibility compliance..."
                        className="bg-background/80 min-h-[110px] text-sm leading-relaxed"
                        {...form.register('designProcess')}
                      />
                    </div>
                    <div className="space-y-1.5">
                      <Label className="text-xs font-semibold">Engineering Journey & Breakthroughs</Label>
                      <Textarea
                        placeholder="Key technical hurdles overcome during sprint implementation..."
                        className="bg-background/80 min-h-[110px] text-sm leading-relaxed"
                        {...form.register('developmentJourney')}
                      />
                    </div>
                  </div>
                </div>
              </TabsContent>

              {/* TAB 4: KPIs & Impact */}
              <TabsContent
                value="impact"
                className="space-y-6 bg-card/40 p-6 rounded-3xl border border-border/50 backdrop-blur-sm"
              >
                <div>
                  <h3 className="text-base font-bold text-foreground mb-1">
                    Measurable Impact, KPIs & Client Validation
                  </h3>
                  <p className="text-xs text-muted-foreground">
                    No JSON coding required! Add high-impact metrics and client quotes that render automatically on public pages.
                  </p>
                </div>

                {/* Interactive KPI Builder */}
                <div className="p-5 rounded-2xl bg-background/50 border border-border/50 space-y-4">
                  <div className="flex items-center justify-between">
                    <Label className="text-xs font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
                      <TrendingUp className="w-3.5 h-3.5 text-emerald-400" /> Key Performance Indicators (KPIs)
                    </Label>
                    <span className="text-[11px] text-muted-foreground">{kpiList.length} metrics set</span>
                  </div>

                  {/* Preset KPI Buttons */}
                  <div className="flex flex-wrap gap-1.5 items-center">
                    <span className="text-[11px] font-semibold text-muted-foreground mr-1">Presets:</span>
                    {PRESET_KPIS.map((preset, idx) => (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => addKpiItem(preset.value, preset.label)}
                        className="text-[11px] px-2.5 py-1 rounded-md bg-emerald-500/10 border border-emerald-500/20 text-emerald-300 hover:bg-emerald-500/20 transition-colors"
                      >
                        + {preset.value} {preset.label}
                      </button>
                    ))}
                  </div>

                  {/* Add KPI inputs */}
                  <div className="grid grid-cols-1 sm:grid-cols-5 gap-2">
                    <Input
                      placeholder="Value (e.g. +340%)"
                      value={kpiValInput}
                      onChange={(e) => setKpiValInput(e.target.value)}
                      className="bg-background sm:col-span-2 text-xs"
                    />
                    <Input
                      placeholder="Metric Label (e.g. Throughput Speed)"
                      value={kpiLabelInput}
                      onChange={(e) => setKpiLabelInput(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          e.preventDefault();
                          addKpiItem(kpiValInput, kpiLabelInput);
                        }
                      }}
                      className="bg-background sm:col-span-2 text-xs"
                    />
                    <Button
                      type="button"
                      variant="secondary"
                      size="sm"
                      onClick={() => addKpiItem(kpiValInput, kpiLabelInput)}
                      className="text-xs sm:col-span-1"
                    >
                      <Plus className="w-3.5 h-3.5 mr-1" /> Add KPI
                    </Button>
                  </div>

                  {/* Rendered KPI Cards */}
                  {kpiList.length > 0 && (
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3 pt-2">
                      {kpiList.map((kpi, idx) => (
                        <div
                          key={idx}
                          className="relative p-3.5 rounded-xl bg-card border border-border/60 flex flex-col justify-between group"
                        >
                          <button
                            type="button"
                            onClick={() => removeKpiItem(idx)}
                            className="absolute top-2 right-2 text-muted-foreground hover:text-red-400 opacity-0 group-hover:opacity-100 transition-opacity"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                          <span className="text-2xl font-black bg-gradient-to-r from-emerald-400 to-teal-300 bg-clip-text text-transparent">
                            {kpi.value}
                          </span>
                          <span className="text-xs text-muted-foreground mt-1 font-medium">
                            {kpi.label}
                          </span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Results & ROI */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <Label className="text-xs font-semibold">Key Results & Outcomes</Label>
                    <Textarea
                      placeholder="Bullet points or narrative describing outcomes..."
                      className="bg-background/80 min-h-[120px] text-sm leading-relaxed"
                      {...form.register('results')}
                    />
                  </div>
                  <div className="space-y-1.5">
                    <Label className="text-xs font-semibold">Measurable ROI & Financial Savings</Label>
                    <Textarea
                      placeholder="e.g. $1.2M annual server cost savings, 80% reduction in manual operations..."
                      className="bg-background/80 min-h-[120px] text-sm leading-relaxed"
                      {...form.register('roi')}
                    />
                  </div>
                </div>

                {/* Before vs After Comparison */}
                <div className="p-5 rounded-2xl bg-background/50 border border-border/50 space-y-3">
                  <Label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                    Before vs After Transformation
                  </Label>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <span className="text-xs font-semibold text-red-400">Legacy / Before State:</span>
                      <Textarea
                        placeholder="Slow deployments (bi-weekly), monolithic downtimes, fragile manual steps..."
                        value={beforeText}
                        onChange={(e) => setBeforeText(e.target.value)}
                        className="bg-background/80 min-h-[90px] text-xs leading-relaxed"
                      />
                    </div>
                    <div className="space-y-1">
                      <span className="text-xs font-semibold text-emerald-400">Modern / After State:</span>
                      <Textarea
                        placeholder="Automated continuous deployments (15x/day), multi-region redundancy, 99.99% uptime..."
                        value={afterText}
                        onChange={(e) => setAfterText(e.target.value)}
                        className="bg-background/80 min-h-[90px] text-xs leading-relaxed"
                      />
                    </div>
                  </div>
                </div>

                {/* Structured Client Testimonial */}
                <div className="p-5 rounded-2xl bg-background/50 border border-border/50 space-y-3">
                  <div className="flex items-center justify-between">
                    <Label className="text-xs font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
                      <Quote className="w-3.5 h-3.5 text-indigo-400" /> Executive Client Testimonial
                    </Label>
                    <div className="flex text-amber-400">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className="w-3.5 h-3.5 fill-amber-400" />
                      ))}
                    </div>
                  </div>

                  <Textarea
                    placeholder="&ldquo;InGrowwth Innovations transformed our core infrastructure within weeks. Their engineering rigor is unmatched.&rdquo;"
                    value={testQuote}
                    onChange={(e) => setTestQuote(e.target.value)}
                    className="bg-background/80 min-h-[80px] text-sm italic"
                  />

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                    <Input
                      placeholder="Author (e.g. Alex Morgan)"
                      value={testAuthor}
                      onChange={(e) => setTestAuthor(e.target.value)}
                      className="bg-background text-xs"
                    />
                    <Input
                      placeholder="Role (e.g. Chief Technology Officer)"
                      value={testRole}
                      onChange={(e) => setTestRole(e.target.value)}
                      className="bg-background text-xs"
                    />
                    <Input
                      placeholder="Company (e.g. Stripe Partner)"
                      value={testCompany}
                      onChange={(e) => setTestCompany(e.target.value)}
                      className="bg-background text-xs"
                    />
                  </div>
                </div>
              </TabsContent>

              {/* TAB 5: PDF & SEO */}
              <TabsContent
                value="distribution"
                className="space-y-6 bg-card/40 p-6 rounded-3xl border border-border/50 backdrop-blur-sm"
              >
                <div>
                  <h3 className="text-base font-bold text-foreground mb-1">
                    Whitepaper Distribution & Search Engine Optimization
                  </h3>
                  <p className="text-xs text-muted-foreground">
                    Connect downloadable assets and configure meta tags for executive visibility on search engines.
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <Label className="text-xs font-semibold flex items-center gap-1.5">
                      <Download className="w-3.5 h-3.5 text-indigo-400" /> Download PDF / Whitepaper URL
                    </Label>
                    <Input
                      placeholder="https://storage.googleapis.com/.../case-study.pdf"
                      className="bg-background/80 text-xs"
                      {...form.register('downloadPdfUrl')}
                    />
                  </div>
                  <div className="space-y-1.5">
                    <Label className="text-xs font-semibold">Custom Call-to-Action Text</Label>
                    <Input
                      placeholder="Schedule Enterprise Technical Consultation"
                      className="bg-background/80 text-xs"
                      {...form.register('cta')}
                    />
                  </div>
                </div>

                <div className="space-y-4 pt-2">
                  <div className="space-y-1.5">
                    <Label className="text-xs font-semibold">SEO Meta Title</Label>
                    <Input
                      placeholder="Case Study: Scaling Payments to 10M+ DAU | InGrowwth Innovations"
                      className="bg-background/80 text-xs"
                      {...form.register('seoTitle')}
                    />
                  </div>
                  <div className="space-y-1.5">
                    <Label className="text-xs font-semibold">SEO Meta Description</Label>
                    <Textarea
                      placeholder="Discover how InGrowwth Innovations re-architected global payments infrastructure..."
                      className="bg-background/80 min-h-[80px] text-xs leading-relaxed"
                      {...form.register('seoDescription')}
                    />
                  </div>
                </div>

                {/* Live Google Search Preview */}
                <div className="p-5 rounded-2xl bg-background/50 border border-border/50 space-y-2">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
                    <Globe className="w-3.5 h-3.5 text-indigo-400" /> Google SERP Snippet Preview
                  </span>
                  <div className="p-4 rounded-xl bg-card border border-border/60 max-w-xl font-sans text-left">
                    <div className="text-xs text-muted-foreground truncate">
                      https://ingrowwthinnovations.com › case-studies › {slug || 'study-slug'}
                    </div>
                    <div className="text-blue-500 hover:underline text-base font-semibold cursor-pointer truncate mt-0.5">
                      {seoTitle || title || 'Enterprise Case Study | InGrowwth Innovations'}
                    </div>
                    <div className="text-xs text-muted-foreground mt-1 line-clamp-2 leading-relaxed">
                      {seoDescription ||
                        'Read the deep-dive technical transformation case study by InGrowwth Innovations.'}
                    </div>
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          </form>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}
