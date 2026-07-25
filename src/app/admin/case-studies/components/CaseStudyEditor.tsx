'use client';

import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { toast } from 'sonner';
import { Image as ImageIcon, Globe, Settings, Target, Presentation, Activity } from 'lucide-react';

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

export function CaseStudyEditor({ isOpen, onClose, onSuccess, initialData }: CaseStudyEditorProps) {
  const [isUploadingCover, setIsUploadingCover] = useState(false);
  const [coverPreview, setCoverPreview] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

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
      } else {
        form.reset({
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
        });
        setCoverPreview(null);
      }
    }
  }, [initialData, isOpen, form]);

  // eslint-disable-next-line react-hooks/incompatible-library
  const title = form.watch('title');

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
      console.error('Error uploading file:', error);
      toast.error('An error occurred during upload.', { id: toastId });
    } finally {
      setIsUploadingCover(false);
    }
  };

  const onSubmit = async (data: CaseStudyFormValues) => {
    setIsSubmitting(true);
    const toastId = toast.loading(
      initialData?.id ? 'Updating Case Study...' : 'Saving Case Study...'
    );

    try {
      const url = initialData?.id
        ? `/api/admin/case-studies/${initialData.id}`
        : '/api/admin/case-studies';
      const method = initialData?.id ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
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
      console.error('Error saving case study:', error);
      toast.error('Failed to save case study.', { id: toastId });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-[95vw] md:max-w-5xl p-0 bg-background/95 backdrop-blur-xl border border-white/10 shadow-2xl rounded-2xl overflow-hidden flex flex-col max-h-[90vh]">
        <DialogHeader className="px-6 py-4 border-b border-border/40 sticky top-0 bg-background/80 backdrop-blur-md z-10 flex flex-row items-center justify-between">
          <div className="flex items-center justify-between w-full pr-8">
            <div>
              <DialogTitle className="text-2xl font-bold tracking-tight">
                {initialData?.id ? 'Edit Case Study' : 'New Case Study'}
              </DialogTitle>
              <DialogDescription>Deep dive marketing asset</DialogDescription>
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                onClick={() => form.setValue('status', 'DRAFT')}
                type="button"
                size="sm"
              >
                Save as Draft
              </Button>
              <Button
                onClick={form.handleSubmit((data) => {
                  form.setValue('status', 'PUBLISHED');
                  onSubmit({ ...data, status: 'PUBLISHED' });
                })}
                disabled={isSubmitting}
                size="sm"
                className="bg-indigo-600 hover:bg-indigo-700 text-white shadow-md shadow-indigo-500/20"
              >
                {isSubmitting ? 'Saving...' : initialData?.id ? 'Update & Publish' : 'Publish'}
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
            {/* Core Info */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-4">
                <Input
                  placeholder="Case Study Title..."
                  className="text-4xl font-extrabold border-none bg-transparent px-0 focus-visible:ring-0 shadow-none placeholder:text-muted-foreground/50 h-auto"
                  {...form.register('title')}
                />
                {form.formState.errors.title && (
                  <p className="text-sm text-destructive">{form.formState.errors.title.message}</p>
                )}

                <div className="flex items-center gap-4">
                  <div className="flex-1 space-y-1 text-sm">
                    <Label>Slug</Label>
                    <Input
                      placeholder="slug-name"
                      className="bg-muted/50 border-none"
                      {...form.register('slug')}
                    />
                  </div>
                  <div className="flex-1 space-y-1 text-sm">
                    <Label>Client Name</Label>
                    <Input
                      placeholder="Acme Corp"
                      className="bg-muted/50 border-none"
                      {...form.register('clientName')}
                    />
                  </div>
                  <div className="flex-1 space-y-1 text-sm">
                    <Label>Industry</Label>
                    <Input
                      placeholder="Fintech"
                      className="bg-muted/50 border-none"
                      {...form.register('industry')}
                    />
                  </div>
                </div>
              </div>

              <div className="relative group rounded-2xl border-2 border-dashed border-border/50 bg-muted/20 hover:bg-muted/40 transition-colors overflow-hidden flex flex-col items-center justify-center min-h-[200px]">
                {coverPreview ? (
                  <>
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={coverPreview}
                      alt="Cover"
                      className="absolute inset-0 w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-4">
                      <Button
                        type="button"
                        variant="secondary"
                        onClick={() => document.getElementById('cover-upload')?.click()}
                      >
                        <ImageIcon className="h-4 w-4 mr-2" /> Change Image
                      </Button>
                    </div>
                  </>
                ) : (
                  <div
                    className="flex flex-col items-center justify-center p-8 text-center space-y-4 cursor-pointer"
                    onClick={() => document.getElementById('cover-upload')?.click()}
                  >
                    <div className="h-14 w-14 rounded-full bg-indigo-500/10 flex items-center justify-center">
                      <ImageIcon className="h-6 w-6 text-indigo-500" />
                    </div>
                    <div>
                      <p className="font-semibold text-base">Upload Cover Image</p>
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

            {/* Content Tabs */}
            <Tabs defaultValue="discovery" className="w-full">
              <TabsList className="grid w-full grid-cols-2 lg:grid-cols-5 mb-8 h-auto p-1">
                <TabsTrigger value="discovery" className="py-2">
                  <Target className="h-4 w-4 mr-2 hidden md:block" /> Discovery
                </TabsTrigger>
                <TabsTrigger value="strategy" className="py-2">
                  <Presentation className="h-4 w-4 mr-2 hidden md:block" /> Strategy
                </TabsTrigger>
                <TabsTrigger value="execution" className="py-2">
                  <Settings className="h-4 w-4 mr-2 hidden md:block" /> Execution
                </TabsTrigger>
                <TabsTrigger value="results" className="py-2">
                  <Activity className="h-4 w-4 mr-2 hidden md:block" /> Results
                </TabsTrigger>
                <TabsTrigger value="seo" className="py-2">
                  <Globe className="h-4 w-4 mr-2 hidden md:block" /> SEO
                </TabsTrigger>
              </TabsList>

              <TabsContent
                value="discovery"
                className="space-y-6 bg-muted/10 p-6 rounded-2xl border border-border/50"
              >
                <h3 className="text-xl font-semibold mb-4">Discovery & Problem space</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label>Problem Statement</Label>
                    <Textarea
                      placeholder="What was the core problem?"
                      className="bg-background min-h-[150px]"
                      {...form.register('problemStatement')}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Business Challenges</Label>
                    <Textarea
                      placeholder="List specific business challenges..."
                      className="bg-background min-h-[150px]"
                      {...form.register('businessChallenges')}
                    />
                  </div>
                  <div className="space-y-2 md:col-span-2">
                    <Label>Project Objectives</Label>
                    <Textarea
                      placeholder="What were the goals?"
                      className="bg-background min-h-[100px]"
                      {...form.register('objectives')}
                    />
                  </div>
                </div>
              </TabsContent>

              <TabsContent
                value="strategy"
                className="space-y-6 bg-muted/10 p-6 rounded-2xl border border-border/50"
              >
                <h3 className="text-xl font-semibold mb-4">Research & Strategy</h3>
                <div className="grid grid-cols-1 gap-6">
                  <div className="space-y-2">
                    <Label>User Research / Market Analysis</Label>
                    <Textarea
                      placeholder="Describe the research phase..."
                      className="bg-background min-h-[150px]"
                      {...form.register('research')}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Our Strategy & Approach</Label>
                    <Textarea
                      placeholder="How did we plan to tackle this?"
                      className="bg-background min-h-[150px]"
                      {...form.register('strategy')}
                    />
                  </div>
                </div>
              </TabsContent>

              <TabsContent
                value="execution"
                className="space-y-6 bg-muted/10 p-6 rounded-2xl border border-border/50"
              >
                <h3 className="text-xl font-semibold mb-4">Design & Development</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label>The Solution</Label>
                    <Textarea
                      placeholder="Overview of the delivered solution..."
                      className="bg-background min-h-[150px]"
                      {...form.register('solution')}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>System Architecture</Label>
                    <Textarea
                      placeholder="Explain the technical architecture..."
                      className="bg-background min-h-[150px]"
                      {...form.register('architecture')}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Design Process</Label>
                    <Textarea
                      placeholder="UI/UX design journey..."
                      className="bg-background min-h-[150px]"
                      {...form.register('designProcess')}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Development Journey</Label>
                    <Textarea
                      placeholder="Engineering challenges and breakthroughs..."
                      className="bg-background min-h-[150px]"
                      {...form.register('developmentJourney')}
                    />
                  </div>
                  <div className="space-y-2 md:col-span-2">
                    <Label>Technologies Used</Label>
                    <Input
                      placeholder="React, Next.js, Postgres..."
                      className="bg-background"
                      {...form.register('technologies')}
                    />
                  </div>
                </div>
              </TabsContent>

              <TabsContent
                value="results"
                className="space-y-6 bg-muted/10 p-6 rounded-2xl border border-border/50"
              >
                <h3 className="text-xl font-semibold mb-4">Results, KPIs & ROI</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label>Key Results</Label>
                    <Textarea
                      placeholder="What was achieved?"
                      className="bg-background min-h-[150px]"
                      {...form.register('results')}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Return on Investment (ROI)</Label>
                    <Textarea
                      placeholder="Financial or time savings..."
                      className="bg-background min-h-[150px]"
                      {...form.register('roi')}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Specific KPIs (JSON format recommended)</Label>
                    <Textarea
                      placeholder={'[{"label": "Conversion", "value": "+50%"}]'}
                      className="bg-background min-h-[150px] font-mono text-sm"
                      {...form.register('kpis')}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Client Testimonial</Label>
                    <Textarea
                      placeholder="Quote from the client..."
                      className="bg-background min-h-[150px]"
                      {...form.register('clientTestimonial')}
                    />
                  </div>
                </div>
              </TabsContent>

              <TabsContent
                value="seo"
                className="space-y-6 bg-muted/10 p-6 rounded-2xl border border-border/50"
              >
                <div className="space-y-6">
                  <div className="space-y-2">
                    <Label>SEO Title</Label>
                    <Input
                      placeholder="Meta title..."
                      className="bg-background"
                      {...form.register('seoTitle')}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label>SEO Description</Label>
                    <Textarea
                      placeholder="Meta description..."
                      className="bg-background h-24 resize-none"
                      {...form.register('seoDescription')}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label>Download PDF URL (Optional)</Label>
                    <Input
                      placeholder="https://..."
                      className="bg-background"
                      {...form.register('downloadPdfUrl')}
                    />
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
