'use client';

import React, { useState, useEffect } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { toast } from 'sonner';
import Image from 'next/image';
import {
  Image as ImageIcon,
  Trash2,
  Globe,
  Settings,
  Code,
  FileText,
  Sparkles,
  Plus,
  X,
  CheckCircle2,
  TrendingUp,
  Quote,
  Users,
  Briefcase,
} from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
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
  POPULAR_TECH_TAGS,
  POPULAR_SERVICES_SUGGESTIONS,
  type MetricItem,
} from '@/lib/data-helpers';

const portfolioSchema = z.object({
  title: z.string().min(3, 'Title is required'),
  client: z.string().min(2, 'Client is required'),
  category: z.string().min(2, 'Category is required'),
  websiteUrl: z.string().optional(),
  description: z.string().min(10, 'Description must be at least 10 characters'),
  gallery: z.string().optional(),
  coverImage: z.any().optional(),
  industry: z.string().optional(),
  duration: z.string().optional(),
  projectStatus: z.enum(['Completed', 'In Progress', 'Archived']),
  projectOverview: z.string().optional(),
  challenges: z.string().optional(),
  solution: z.string().optional(),
  results: z.string().optional(),
  cta: z.string().optional(),
  seoTitle: z.string().optional(),
  seoDescription: z.string().optional(),
});

type PortfolioFormValues = z.infer<typeof portfolioSchema>;

interface PortfolioEditorProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  initialData?: any;
}

export function PortfolioEditor({ isOpen, onClose, onSuccess, initialData }: PortfolioEditorProps) {
  const [isUploading, setIsUploading] = useState(false);
  const [coverPreview, setCoverPreview] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Enterprise Interactive Builders
  const [technologiesList, setTechnologiesList] = useState<string[]>([]);
  const [servicesList, setServicesList] = useState<string[]>([]);
  const [teamMembersList, setTeamMembersList] = useState<string[]>([]);
  const [featuresList, setFeaturesList] = useState<string[]>([]);
  const [metricsList, setMetricsList] = useState<MetricItem[]>([]);

  // Testimonial structured fields
  const [testimonialQuote, setTestimonialQuote] = useState('');
  const [testimonialAuthor, setTestimonialAuthor] = useState('');
  const [testimonialRole, setTestimonialRole] = useState('');

  // Inline builder inputs
  const [newTechInput, setNewTechInput] = useState('');
  const [newServiceInput, setNewServiceInput] = useState('');
  const [newTeamMemberInput, setNewTeamMemberInput] = useState('');
  const [newFeatureInput, setNewFeatureInput] = useState('');
  const [newMetricValue, setNewMetricValue] = useState('');
  const [newMetricLabel, setNewMetricLabel] = useState('');

  const form = useForm<PortfolioFormValues>({
    resolver: zodResolver(portfolioSchema),
    defaultValues: {
      title: '',
      client: '',
      category: '',
      websiteUrl: '',
      description: '',
      gallery: '',
      coverImage: '',
      industry: '',
      duration: '',
      projectStatus: 'Completed',
      projectOverview: '',
      challenges: '',
      solution: '',
      results: '',
      cta: '',
      seoTitle: '',
      seoDescription: '',
    },
  });

  useEffect(() => {
    if (isOpen) {
      if (initialData) {
        form.reset({
          title: initialData.title || '',
          client: initialData.client || '',
          category: initialData.category || '',
          websiteUrl: initialData.websiteUrl || '',
          description: initialData.description || '',
          gallery: initialData.gallery || '',
          coverImage: initialData.coverImage || '',
          industry: initialData.industry || '',
          duration: initialData.duration || '',
          projectStatus: initialData.projectStatus || 'Completed',
          projectOverview: initialData.projectOverview || '',
          challenges: initialData.challenges || '',
          solution: initialData.solution || '',
          results: initialData.results || '',
          cta: initialData.cta || '',
          seoTitle: initialData.seoTitle || '',
          seoDescription: initialData.seoDescription || '',
        });
        setCoverPreview(initialData.coverImage || null);
        setTechnologiesList(parseArrayField(initialData.technologiesUsed));
        setServicesList(parseArrayField(initialData.servicesUsed));
        setTeamMembersList(parseArrayField(initialData.teamMembers));
        setFeaturesList(parseArrayField(initialData.features));
        setMetricsList(parseMetricsField(initialData.metrics));

        const parsedTestimonial = parseTestimonialField(initialData.testimonial);
        if (parsedTestimonial) {
          setTestimonialQuote(parsedTestimonial.quote || '');
          setTestimonialAuthor(parsedTestimonial.author || '');
          setTestimonialRole(parsedTestimonial.role || (parsedTestimonial.company ? parsedTestimonial.company : ''));
        } else {
          setTestimonialQuote(initialData.testimonial || '');
          setTestimonialAuthor('');
          setTestimonialRole('');
        }
      } else {
        form.reset({
          title: '',
          client: '',
          category: '',
          websiteUrl: '',
          description: '',
          gallery: '',
          coverImage: '',
          industry: '',
          duration: '',
          projectStatus: 'Completed',
          projectOverview: '',
          challenges: '',
          solution: '',
          results: '',
          cta: '',
          seoTitle: '',
          seoDescription: '',
        });
        setCoverPreview(null);
        setTechnologiesList([]);
        setServicesList([]);
        setTeamMembersList([]);
        setFeaturesList([]);
        setMetricsList([]);
        setTestimonialQuote('');
        setTestimonialAuthor('');
        setTestimonialRole('');
      }
    }
  }, [initialData, isOpen, form]);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      toast.error('Please upload an image file.');
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      toast.error('Image size must be less than 5MB.');
      return;
    }

    const formData = new FormData();
    formData.append('file', file);

    setIsUploading(true);
    const toastId = toast.loading('Uploading cover image...');

    try {
      const response = await fetch('/api/upload?folder=portfolio', {
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
      setIsUploading(false);
    }
  };

  // Tech list handlers
  const handleAddTech = (tech?: string) => {
    const raw = tech !== undefined ? tech : newTechInput;
    if (!raw.trim()) return;
    const items = parseArrayField(raw);
    setTechnologiesList((prev) => {
      const next = [...prev];
      items.forEach((item) => {
        if (!next.some((t) => t.toLowerCase() === item.toLowerCase())) next.push(item);
      });
      return next;
    });
    if (tech === undefined) setNewTechInput('');
  };

  const handleRemoveTech = (idx: number) => {
    setTechnologiesList((prev) => prev.filter((_, i) => i !== idx));
  };

  // Services list handlers
  const handleAddService = (svc?: string) => {
    const raw = svc !== undefined ? svc : newServiceInput;
    if (!raw.trim()) return;
    const items = parseArrayField(raw);
    setServicesList((prev) => {
      const next = [...prev];
      items.forEach((item) => {
        if (!next.some((s) => s.toLowerCase() === item.toLowerCase())) next.push(item);
      });
      return next;
    });
    if (svc === undefined) setNewServiceInput('');
  };

  const handleRemoveService = (idx: number) => {
    setServicesList((prev) => prev.filter((_, i) => i !== idx));
  };

  // Team member handlers
  const handleAddTeamMember = () => {
    if (!newTeamMemberInput.trim()) return;
    const items = parseArrayField(newTeamMemberInput);
    setTeamMembersList((prev) => [...prev, ...items.filter((item) => !prev.includes(item))]);
    setNewTeamMemberInput('');
  };

  const handleRemoveTeamMember = (idx: number) => {
    setTeamMembersList((prev) => prev.filter((_, i) => i !== idx));
  };

  // Features list handlers
  const handleAddFeature = () => {
    if (!newFeatureInput.trim()) return;
    const items = parseArrayField(newFeatureInput);
    setFeaturesList((prev) => [...prev, ...items.filter((item) => !prev.includes(item))]);
    setNewFeatureInput('');
  };

  const handleRemoveFeature = (idx: number) => {
    setFeaturesList((prev) => prev.filter((_, i) => i !== idx));
  };

  // Metrics handlers
  const handleAddMetric = () => {
    if (!newMetricValue.trim() || !newMetricLabel.trim()) {
      toast.error('Please enter both metric value and label.');
      return;
    }
    setMetricsList((prev) => [
      ...prev,
      { value: newMetricValue.trim(), label: newMetricLabel.trim() },
    ]);
    setNewMetricValue('');
    setNewMetricLabel('');
  };

  const handleRemoveMetric = (idx: number) => {
    setMetricsList((prev) => prev.filter((_, i) => i !== idx));
  };

  const onSubmit = async (data: PortfolioFormValues) => {
    setIsSubmitting(true);
    const toastId = toast.loading(initialData?.id ? 'Updating project...' : 'Creating project...');

    try {
      // Serialize structured testimonial if provided
      let formattedTestimonial: string | undefined = undefined;
      if (testimonialQuote.trim()) {
        formattedTestimonial = JSON.stringify({
          quote: testimonialQuote.trim(),
          author: testimonialAuthor.trim() || undefined,
          role: testimonialRole.trim() || undefined,
        });
      }

      const payload = {
        ...data,
        technologiesUsed: technologiesList.join(', '),
        servicesUsed: servicesList.join(', '),
        teamMembers: teamMembersList.join(', '),
        features: JSON.stringify(featuresList),
        metrics: JSON.stringify(metricsList),
        testimonial: formattedTestimonial,
      };

      const url = initialData?.id
        ? `/api/admin/portfolio/${initialData.id}`
        : '/api/admin/portfolio';
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
      logger.error('Error saving project:', error);
      toast.error('Failed to save project.', { id: toastId });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-[95vw] md:max-w-4xl p-0 bg-background/95 backdrop-blur-xl border border-white/10 shadow-2xl rounded-2xl overflow-hidden flex flex-col max-h-[92vh]">
        <DialogHeader className="px-6 py-4 border-b border-border/40 sticky top-0 bg-background/80 backdrop-blur-md z-10 flex flex-row items-center justify-between">
          <div className="flex items-center justify-between w-full pr-8">
            <div>
              <DialogTitle className="text-2xl font-bold tracking-tight">
                {initialData?.id ? 'Edit Portfolio Project' : 'New Portfolio Project'}
              </DialogTitle>
              <DialogDescription>
                Configure enterprise project highlights, technologies, impact metrics, and client story.
              </DialogDescription>
            </div>
            <div className="flex items-center gap-2">
              <Button
                onClick={form.handleSubmit(onSubmit)}
                disabled={isSubmitting || isUploading}
                size="sm"
                className="bg-indigo-600 hover:bg-indigo-700 text-white shadow-md shadow-indigo-500/20"
              >
                {isSubmitting
                  ? 'Saving...'
                  : initialData?.id
                  ? 'Update Project'
                  : 'Publish Project'}
              </Button>
            </div>
          </div>
        </DialogHeader>

        <ScrollArea className="flex-1 px-6 py-6 overflow-y-auto">
          <form id="portfolio-form" onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 pb-12">
            <Tabs defaultValue="metadata" className="w-full">
              <TabsList className="grid w-full grid-cols-2 md:grid-cols-5 mb-8 h-auto p-1.5 bg-slate-900/90 dark:bg-zinc-900/90 rounded-2xl border border-white/10 shadow-inner">
                <TabsTrigger value="metadata" className="py-2.5 text-xs font-semibold">
                  <Settings className="h-4 w-4 mr-1.5 hidden md:block" /> Details
                </TabsTrigger>
                <TabsTrigger value="stack" className="py-2.5 text-xs font-semibold">
                  <Code className="h-4 w-4 mr-1.5 hidden md:block" /> Tech & Team
                </TabsTrigger>
                <TabsTrigger value="casestudy" className="py-2.5 text-xs font-semibold">
                  <FileText className="h-4 w-4 mr-1.5 hidden md:block" /> Story & Solution
                </TabsTrigger>
                <TabsTrigger value="impact" className="py-2.5 text-xs font-semibold">
                  <TrendingUp className="h-4 w-4 mr-1.5 hidden md:block" /> Impact & KPIs
                </TabsTrigger>
                <TabsTrigger value="seo" className="py-2.5 text-xs font-semibold">
                  <Globe className="h-4 w-4 mr-1.5 hidden md:block" /> SEO & SERP
                </TabsTrigger>
              </TabsList>

              {/* TAB 1: METADATA & ASSETS */}
              <TabsContent value="metadata" className="space-y-6">
                <div className="space-y-2">
                  <Label>Project Title</Label>
                  <Input
                    placeholder="e.g. NextGen Autonomous FinTech Platform"
                    className="bg-background text-lg font-semibold"
                    {...form.register('title')}
                  />
                  {form.formState.errors.title && (
                    <p className="text-sm text-destructive">{form.formState.errors.title.message}</p>
                  )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-5 bg-muted/10 p-5 rounded-2xl border border-border/50">
                  <div className="space-y-2">
                    <Label>Client Name</Label>
                    <Input
                      placeholder="e.g. Apex Global Bank"
                      className="bg-background"
                      {...form.register('client')}
                    />
                    {form.formState.errors.client && (
                      <p className="text-sm text-destructive">{form.formState.errors.client.message}</p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label>Category</Label>
                    <Input
                      placeholder="e.g. Web App Development, Cloud Architecture"
                      className="bg-background"
                      {...form.register('category')}
                    />
                    {form.formState.errors.category && (
                      <p className="text-sm text-destructive">{form.formState.errors.category.message}</p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label>Industry</Label>
                    <Input
                      placeholder="e.g. FinTech, Healthcare, Logistics"
                      className="bg-background"
                      {...form.register('industry')}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label>Project Status</Label>
                    <Controller
                      control={form.control}
                      name="projectStatus"
                      render={({ field }) => (
                        <Select onValueChange={field.onChange} value={field.value}>
                          <SelectTrigger className="w-full bg-background">
                            <SelectValue placeholder="Select status" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="Completed">Completed</SelectItem>
                            <SelectItem value="In Progress">In Progress</SelectItem>
                            <SelectItem value="Archived">Archived</SelectItem>
                          </SelectContent>
                        </Select>
                      )}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label>Live Website / Demo URL</Label>
                    <Input
                      placeholder="https://..."
                      className="bg-background font-mono text-sm"
                      {...form.register('websiteUrl')}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label>Project Duration</Label>
                    <Input
                      placeholder="e.g. 6 Months, Q1 - Q3 2026"
                      className="bg-background"
                      {...form.register('duration')}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Short Summary Description</Label>
                  <Textarea
                    placeholder="Concise 2-sentence synopsis for portfolio cards..."
                    className="bg-background min-h-[80px]"
                    {...form.register('description')}
                  />
                  {form.formState.errors.description && (
                    <p className="text-sm text-destructive">{form.formState.errors.description.message}</p>
                  )}
                </div>

                {/* Cover Image Upload */}
                <div className="space-y-3 bg-muted/10 p-5 rounded-2xl border border-border/50">
                  <Label className="text-sm font-semibold flex items-center gap-2">
                    <ImageIcon className="h-4 w-4 text-indigo-500" /> Cover Hero Image
                  </Label>
                  <div className="flex flex-col md:flex-row gap-5 items-start">
                    <div className="w-full md:w-60 h-36 relative rounded-xl border border-border/60 bg-muted/30 overflow-hidden flex items-center justify-center shrink-0">
                      {coverPreview ? (
                        <>
                          <Image src={coverPreview} alt="Cover preview" fill className="object-cover" />
                          <button
                            type="button"
                            onClick={() => {
                              setCoverPreview(null);
                              form.setValue('coverImage', '');
                            }}
                            className="absolute top-2 right-2 p-1.5 rounded-full bg-black/60 text-white hover:bg-red-600 transition-colors"
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                          </button>
                        </>
                      ) : (
                        <div className="flex flex-col items-center gap-1 text-muted-foreground text-xs text-center p-3">
                          <ImageIcon className="h-8 w-8 text-muted-foreground/60 mb-1" />
                          <span>No cover selected</span>
                        </div>
                      )}
                    </div>
                    <div className="flex-1 space-y-3 w-full">
                      <Input
                        type="file"
                        accept="image/*"
                        onChange={handleFileUpload}
                        disabled={isUploading}
                        className="bg-background cursor-pointer text-xs"
                      />
                      <div className="flex items-center gap-2">
                        <span className="text-xs text-muted-foreground">Or direct image URL:</span>
                        <Input
                          placeholder="https://images.unsplash.com/..."
                          value={form.watch('coverImage') || ''}
                          onChange={(e) => {
                            form.setValue('coverImage', e.target.value);
                            setCoverPreview(e.target.value || null);
                          }}
                          className="bg-background text-xs font-mono"
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Gallery URLs */}
                <div className="space-y-2">
                  <Label>Project Gallery Screenshots (Comma-separated URLs)</Label>
                  <Textarea
                    placeholder="https://images.unsplash.com/..., https://images.unsplash.com/..."
                    className="bg-background font-mono text-xs min-h-[70px]"
                    {...form.register('gallery')}
                  />
                  <p className="text-[11px] text-muted-foreground">
                    Multiple URLs will render as an interactive gallery carousel on the project page.
                  </p>
                </div>
              </TabsContent>

              {/* TAB 2: TECH STACK, SERVICES & TEAM */}
              <TabsContent value="stack" className="space-y-6">
                {/* Technologies Used Builder */}
                <div className="space-y-4 p-5 rounded-2xl border border-border/60 bg-muted/20">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Code className="h-5 w-5 text-indigo-500" />
                      <Label className="text-base font-semibold">Technologies Used</Label>
                      <span className="text-xs text-muted-foreground px-2 py-0.5 rounded-full bg-background border border-border/60">
                        {technologiesList.length} technologies
                      </span>
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <Input
                      placeholder="Type a technology (e.g. Next.js, PostgreSQL) and press Enter"
                      value={newTechInput}
                      onChange={(e) => setNewTechInput(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          e.preventDefault();
                          handleAddTech();
                        }
                      }}
                      className="bg-background"
                    />
                    <Button type="button" onClick={() => handleAddTech()} variant="secondary" className="shrink-0">
                      <Plus className="h-4 w-4 mr-1" /> Add
                    </Button>
                  </div>

                  {/* Selected Tech Badges */}
                  <div className="min-h-[44px] p-2.5 rounded-xl border border-border/60 bg-background flex flex-wrap gap-2 items-center">
                    {technologiesList.length > 0 ? (
                      technologiesList.map((tech, idx) => (
                        <Badge
                          key={idx}
                          variant="secondary"
                          className="px-3 py-1 text-xs font-semibold flex items-center gap-1.5 bg-indigo-500/10 text-indigo-400 border border-indigo-500/20"
                        >
                          {tech}
                          <button
                            type="button"
                            onClick={() => handleRemoveTech(idx)}
                            className="hover:text-destructive transition-colors ml-0.5"
                          >
                            <X className="h-3 w-3" />
                          </button>
                        </Badge>
                      ))
                    ) : (
                      <span className="text-xs text-muted-foreground italic px-1">
                        No technologies added yet. Click a suggestion below or type one above.
                      </span>
                    )}
                  </div>

                  {/* Quick-Pick Popular Tech */}
                  <div className="space-y-1.5">
                    <span className="text-[11px] font-medium text-muted-foreground flex items-center gap-1">
                      <Sparkles className="h-3 w-3 text-indigo-400" /> Quick Select Popular Tech:
                    </span>
                    <div className="flex flex-wrap gap-1.5">
                      {POPULAR_TECH_TAGS.map((tech) => {
                        const isSelected = technologiesList.some((t) => t.toLowerCase() === tech.toLowerCase());
                        return (
                          <button
                            type="button"
                            key={tech}
                            onClick={() => handleAddTech(tech)}
                            className={`text-xs px-2.5 py-1 rounded-full border transition-all cursor-pointer ${
                              isSelected
                                ? 'bg-indigo-600 text-white border-indigo-600 opacity-50 cursor-default'
                                : 'bg-background hover:bg-muted border-border/60 text-foreground'
                            }`}
                          >
                            {isSelected ? '✓ ' : '+ '}
                            {tech}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                </div>

                {/* Services Provided Builder */}
                <div className="space-y-4 p-5 rounded-2xl border border-border/60 bg-muted/20">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Briefcase className="h-5 w-5 text-indigo-500" />
                      <Label className="text-base font-semibold">Services Provided</Label>
                      <span className="text-xs text-muted-foreground px-2 py-0.5 rounded-full bg-background border border-border/60">
                        {servicesList.length} services
                      </span>
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <Input
                      placeholder="e.g. Cloud DevOps Architecture, UI/UX Prototyping"
                      value={newServiceInput}
                      onChange={(e) => setNewServiceInput(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          e.preventDefault();
                          handleAddService();
                        }
                      }}
                      className="bg-background"
                    />
                    <Button type="button" onClick={() => handleAddService()} variant="secondary" className="shrink-0">
                      <Plus className="h-4 w-4 mr-1" /> Add
                    </Button>
                  </div>

                  <div className="min-h-[44px] p-2.5 rounded-xl border border-border/60 bg-background flex flex-wrap gap-2 items-center">
                    {servicesList.length > 0 ? (
                      servicesList.map((svc, idx) => (
                        <Badge
                          key={idx}
                          variant="secondary"
                          className="px-3 py-1 text-xs font-semibold flex items-center gap-1.5 bg-purple-500/10 text-purple-400 border border-purple-500/20"
                        >
                          {svc}
                          <button
                            type="button"
                            onClick={() => handleRemoveService(idx)}
                            className="hover:text-destructive transition-colors ml-0.5"
                          >
                            <X className="h-3 w-3" />
                          </button>
                        </Badge>
                      ))
                    ) : (
                      <span className="text-xs text-muted-foreground italic px-1">
                        No services added yet. Click a suggestion below.
                      </span>
                    )}
                  </div>

                  <div className="flex flex-wrap gap-1.5">
                    {POPULAR_SERVICES_SUGGESTIONS.map((svc) => (
                      <button
                        type="button"
                        key={svc}
                        onClick={() => handleAddService(svc)}
                        className="text-[11px] px-2.5 py-1 rounded-full border border-border/60 bg-background hover:bg-muted text-foreground transition-colors cursor-pointer"
                      >
                        + {svc}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Team Members Builder */}
                <div className="space-y-4 p-5 rounded-2xl border border-border/60 bg-muted/20">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Users className="h-5 w-5 text-indigo-500" />
                      <Label className="text-base font-semibold">Core Team Members & Leads</Label>
                      <span className="text-xs text-muted-foreground px-2 py-0.5 rounded-full bg-background border border-border/60">
                        {teamMembersList.length} members
                      </span>
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <Input
                      placeholder="e.g. Lead Architect: Alex Turner, Senior Frontend: Sarah Chen"
                      value={newTeamMemberInput}
                      onChange={(e) => setNewTeamMemberInput(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          e.preventDefault();
                          handleAddTeamMember();
                        }
                      }}
                      className="bg-background"
                    />
                    <Button type="button" onClick={handleAddTeamMember} variant="secondary" className="shrink-0">
                      <Plus className="h-4 w-4 mr-1" /> Add
                    </Button>
                  </div>

                  <div className="min-h-[44px] p-2.5 rounded-xl border border-border/60 bg-background flex flex-wrap gap-2 items-center">
                    {teamMembersList.length > 0 ? (
                      teamMembersList.map((member, idx) => (
                        <Badge
                          key={idx}
                          variant="outline"
                          className="px-3 py-1 text-xs font-semibold flex items-center gap-1.5 border-border/80"
                        >
                          {member}
                          <button
                            type="button"
                            onClick={() => handleRemoveTeamMember(idx)}
                            className="hover:text-destructive transition-colors ml-0.5"
                          >
                            <X className="h-3 w-3" />
                          </button>
                        </Badge>
                      ))
                    ) : (
                      <span className="text-xs text-muted-foreground italic px-1">
                        No team members listed yet. Add engineers, leads, or architects.
                      </span>
                    )}
                  </div>
                </div>
              </TabsContent>

              {/* TAB 3: STORY, CHALLENGES & SOLUTION */}
              <TabsContent value="casestudy" className="space-y-6">
                <div className="space-y-6 bg-muted/10 p-6 rounded-2xl border border-border/50">
                  <div className="space-y-2">
                    <Label className="text-base font-semibold">Project Overview & Executive Summary</Label>
                    <Textarea
                      placeholder="High level overview of what was built, the client context, and the strategic vision..."
                      className="bg-background min-h-[110px]"
                      {...form.register('projectOverview')}
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label className="font-semibold text-rose-400 flex items-center gap-2">
                        The Business & Technical Challenge
                      </Label>
                      <Textarea
                        placeholder="What were the legacy bottlenecks, scaling hurdles, or security constraints faced by the client?"
                        className="bg-background min-h-[140px]"
                        {...form.register('challenges')}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label className="font-semibold text-emerald-400 flex items-center gap-2">
                        Our Solution & Architectural Approach
                      </Label>
                      <Textarea
                        placeholder="How did our engineering team solve it? Architectural patterns, frameworks, and innovations deployed."
                        className="bg-background min-h-[140px]"
                        {...form.register('solution')}
                      />
                    </div>
                  </div>

                  {/* Interactive Features / Capabilities Builder */}
                  <div className="space-y-4 pt-4 border-t border-border/50">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <CheckCircle2 className="h-5 w-5 text-indigo-500" />
                        <Label className="text-base font-semibold">Key Capabilities & Features</Label>
                        <span className="text-xs text-muted-foreground px-2 py-0.5 rounded-full bg-background border border-border/60">
                          {featuresList.length} items
                        </span>
                      </div>
                    </div>

                    <div className="flex gap-2">
                      <Input
                        placeholder="Type a key feature or capability and press Enter..."
                        value={newFeatureInput}
                        onChange={(e) => setNewFeatureInput(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') {
                            e.preventDefault();
                            handleAddFeature();
                          }
                        }}
                        className="bg-background"
                      />
                      <Button type="button" onClick={handleAddFeature} variant="secondary" className="shrink-0">
                        <Plus className="h-4 w-4 mr-1" /> Add Feature
                      </Button>
                    </div>

                    {featuresList.length > 0 ? (
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1">
                        {featuresList.map((feat, idx) => (
                          <div
                            key={idx}
                            className="flex items-center justify-between p-2.5 rounded-xl bg-background border border-border/60 group text-sm"
                          >
                            <span className="flex items-center gap-2">
                              <CheckCircle2 className="h-4 w-4 text-indigo-500 shrink-0" />
                              <span className="font-medium text-foreground">{feat}</span>
                            </span>
                            <button
                              type="button"
                              onClick={() => handleRemoveFeature(idx)}
                              className="text-muted-foreground hover:text-destructive p-1"
                            >
                              <X className="h-3.5 w-3.5" />
                            </button>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-xs text-muted-foreground italic">
                        No key features added yet. Add bulleted features above.
                      </p>
                    )}
                  </div>
                </div>
              </TabsContent>

              {/* TAB 4: IMPACT, METRICS & TESTIMONIAL */}
              <TabsContent value="impact" className="space-y-6">
                {/* KPIs & Metrics Builder */}
                <div className="space-y-4 p-5 rounded-2xl border border-border/60 bg-muted/20">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <TrendingUp className="h-5 w-5 text-indigo-500" />
                      <Label className="text-base font-semibold">Executive KPI Metrics & Stats</Label>
                      <span className="text-xs text-muted-foreground px-2 py-0.5 rounded-full bg-background border border-border/60">
                        {metricsList.length} metrics
                      </span>
                    </div>
                    <span className="text-xs text-muted-foreground hidden sm:block">
                      Renders as bold stat cards on the project page
                    </span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-12 gap-2 items-center">
                    <div className="sm:col-span-4">
                      <Input
                        placeholder="Value (e.g. +240%, 99.99%)"
                        value={newMetricValue}
                        onChange={(e) => setNewMetricValue(e.target.value)}
                        className="bg-background font-mono font-bold"
                      />
                    </div>
                    <div className="sm:col-span-6">
                      <Input
                        placeholder="Metric Label (e.g. Growth in Active Users)"
                        value={newMetricLabel}
                        onChange={(e) => setNewMetricLabel(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') {
                            e.preventDefault();
                            handleAddMetric();
                          }
                        }}
                        className="bg-background"
                      />
                    </div>
                    <div className="sm:col-span-2">
                      <Button type="button" onClick={handleAddMetric} variant="secondary" className="w-full">
                        <Plus className="h-4 w-4 mr-1" /> Add
                      </Button>
                    </div>
                  </div>

                  {metricsList.length > 0 ? (
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
                      {metricsList.map((metric, idx) => (
                        <div
                          key={idx}
                          className="p-3.5 rounded-xl bg-background border border-border/60 relative group shadow-sm flex flex-col justify-between"
                        >
                          <button
                            type="button"
                            onClick={() => handleRemoveMetric(idx)}
                            className="absolute top-2 right-2 text-muted-foreground hover:text-destructive opacity-0 group-hover:opacity-100 transition-opacity p-1"
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                          </button>
                          <div className="text-2xl font-black text-indigo-500 tracking-tight">{metric.value}</div>
                          <div className="text-xs text-muted-foreground font-medium mt-1">{metric.label}</div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-xs text-muted-foreground italic">
                      No metrics added yet. Example: &quot;+350%&quot; / &quot;Faster Checkout Flow&quot;.
                    </p>
                  )}
                </div>

                {/* Results Narrative */}
                <div className="space-y-2">
                  <Label>Measurable Business Results & ROI Narrative</Label>
                  <Textarea
                    placeholder="Describe business ROI, efficiency gains, and client operational milestones..."
                    className="bg-background min-h-[100px]"
                    {...form.register('results')}
                  />
                </div>

                {/* Structured Client Testimonial Builder */}
                <div className="space-y-4 p-5 rounded-2xl border border-border/60 bg-muted/20">
                  <div className="flex items-center gap-2">
                    <Quote className="h-5 w-5 text-indigo-500" />
                    <Label className="text-base font-semibold">Executive Client Testimonial</Label>
                  </div>

                  <div className="space-y-3">
                    <div>
                      <Label className="text-xs text-muted-foreground mb-1 block">Quote Statement</Label>
                      <Textarea
                        placeholder="&quot;InGrowwth Innovations re-architected our core platform ahead of schedule with zero downtime. An exceptional engineering partner.&quot;"
                        value={testimonialQuote}
                        onChange={(e) => setTestimonialQuote(e.target.value)}
                        className="bg-background min-h-[80px]"
                      />
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <Label className="text-xs text-muted-foreground mb-1 block">Spokesperson Name</Label>
                        <Input
                          placeholder="e.g. David Henderson"
                          value={testimonialAuthor}
                          onChange={(e) => setTestimonialAuthor(e.target.value)}
                          className="bg-background"
                        />
                      </div>
                      <div>
                        <Label className="text-xs text-muted-foreground mb-1 block">Title & Organization</Label>
                        <Input
                          placeholder="e.g. Chief Technology Officer, Apex Group"
                          value={testimonialRole}
                          onChange={(e) => setTestimonialRole(e.target.value)}
                          className="bg-background"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </TabsContent>

              {/* TAB 5: SEO & SERP PREVIEW */}
              <TabsContent value="seo" className="space-y-6">
                <div className="bg-muted/10 p-6 rounded-2xl border border-border/50 space-y-6">
                  <div className="space-y-2">
                    <Label>SEO Meta Title</Label>
                    <Input
                      placeholder="e.g. Apex Global Bank Case Study | InGrowwth Innovations"
                      className="bg-background"
                      {...form.register('seoTitle')}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label>SEO Meta Description</Label>
                    <Textarea
                      placeholder="Write a concise meta description for Google search engines..."
                      className="bg-background resize-none h-20"
                      {...form.register('seoDescription')}
                    />
                  </div>

                  {/* Google SERP Preview Card */}
                  <div className="p-4 rounded-xl bg-background border border-border/60 space-y-1">
                    <span className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">
                      Google Search Result Snippet Preview
                    </span>
                    <div className="text-sm font-medium text-blue-500 hover:underline cursor-pointer truncate">
                      {form.watch('seoTitle') || form.watch('title') || 'Project Title'} | InGrowwth Innovations
                    </div>
                    <div className="text-xs text-emerald-600 font-mono">
                      https://ingrowwthinnovations.com/projects/{initialData?.slug || 'project-slug'}
                    </div>
                    <div className="text-xs text-muted-foreground line-clamp-2">
                      {form.watch('seoDescription') || form.watch('description') || 'Learn how InGrowwth Innovations engineered enterprise-grade solutions for our client.'}
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
