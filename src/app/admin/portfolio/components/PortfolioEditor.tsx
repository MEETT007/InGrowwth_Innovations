'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { toast } from 'sonner';
import {
  ArrowLeft,
  Image as ImageIcon,
  Trash2,
  Globe,
  Settings,
  Briefcase,
  Code,
  BarChart,
  FileText,
} from 'lucide-react';
import Link from 'next/link';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

const portfolioSchema = z.object({
  title: z.string().min(3, 'Title is required'),
  client: z.string().min(2, 'Client is required'),
  category: z.string().min(2, 'Category is required'),
  websiteUrl: z.string().optional(),
  description: z.string().min(10, 'Description must be at least 10 characters'),
  gallery: z.string().optional(),
  coverImage: z.any().optional(),
  industry: z.string().optional(),
  servicesUsed: z.string().optional(),
  technologiesUsed: z.string().optional(),
  teamMembers: z.string().optional(),
  duration: z.string().optional(),
  projectStatus: z.enum(['Completed', 'In Progress', 'Archived']),
  projectOverview: z.string().optional(),
  challenges: z.string().optional(),
  solution: z.string().optional(),
  features: z.string().optional(),
  results: z.string().optional(),
  metrics: z.string().optional(),
  testimonial: z.string().optional(),
  cta: z.string().optional(),
  seoTitle: z.string().optional(),
  seoDescription: z.string().optional(),
});

type PortfolioFormValues = z.infer<typeof portfolioSchema>;

interface PortfolioEditorProps {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  initialData?: any;
}

export function PortfolioEditor({ initialData }: PortfolioEditorProps) {
  const router = useRouter();
  const [isUploading, setIsUploading] = useState(false);
  const [coverPreview, setCoverPreview] = useState<string | null>(initialData?.coverImage || null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<PortfolioFormValues>({
    resolver: zodResolver(portfolioSchema),
    defaultValues: {
      title: initialData?.title || '',
      client: initialData?.client || '',
      category: initialData?.category || '',
      websiteUrl: initialData?.websiteUrl || '',
      description: initialData?.description || '',
      gallery: initialData?.gallery || '',
      coverImage: initialData?.coverImage || '',
      industry: initialData?.industry || '',
      servicesUsed: initialData?.servicesUsed || '',
      technologiesUsed: initialData?.technologiesUsed || '',
      teamMembers: initialData?.teamMembers || '',
      duration: initialData?.duration || '',
      projectStatus: initialData?.projectStatus || 'Completed',
      projectOverview: initialData?.projectOverview || '',
      challenges: initialData?.challenges || '',
      solution: initialData?.solution || '',
      features: initialData?.features || '',
      results: initialData?.results || '',
      metrics: initialData?.metrics || '',
      testimonial: initialData?.testimonial || '',
      cta: initialData?.cta || '',
      seoTitle: initialData?.seoTitle || '',
      seoDescription: initialData?.seoDescription || '',
    },
  });

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
      console.error('Error uploading file:', error);
      toast.error('An error occurred during upload.', { id: toastId });
    } finally {
      setIsUploading(false);
    }
  };

  const onSubmit = async (data: PortfolioFormValues) => {
    setIsSubmitting(true);
    const toastId = toast.loading(initialData?.id ? 'Updating project...' : 'Creating project...');

    try {
      const url = initialData?.id
        ? `/api/admin/portfolio/${initialData.id}`
        : '/api/admin/portfolio';
      const method = initialData?.id ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      const res = await response.json();
      if (res.success) {
        toast.success(res.message, { id: toastId });
        router.push('/admin/portfolio');
        router.refresh();
      } else {
        toast.error(res.message || 'Action failed.', { id: toastId });
      }
    } catch (error) {
      console.error('Error saving project:', error);
      toast.error('Failed to save project.', { id: toastId });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto pb-24">
      {/* Sticky Header Action Bar */}
      <div className="sticky top-0 z-50 bg-background/80 backdrop-blur-xl border-b border-border/50 p-4 mb-8 -mx-4 sm:-mx-8 px-4 sm:px-8 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" asChild className="rounded-full">
            <Link href="/admin/portfolio">
              <ArrowLeft className="h-5 w-5" />
            </Link>
          </Button>
          <div>
            <h1 className="font-semibold text-lg">
              {initialData?.id ? 'Edit Project' : 'New Project'}
            </h1>
            <p className="text-xs text-muted-foreground">Portfolio Showcase</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <Button
            onClick={form.handleSubmit(onSubmit)}
            disabled={isSubmitting}
            className="bg-indigo-600 hover:bg-indigo-700 text-white shadow-md shadow-indigo-500/20"
          >
            {isSubmitting ? 'Saving...' : initialData?.id ? 'Update Project' : 'Publish Project'}
          </Button>
        </div>
      </div>

      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        {/* Basic Information - Full Width */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="space-y-4">
            <Input
              placeholder="Project Title..."
              className="text-4xl font-extrabold border-none bg-transparent px-0 focus-visible:ring-0 shadow-none placeholder:text-muted-foreground/50 h-auto"
              {...form.register('title')}
            />
            {form.formState.errors.title && (
              <p className="text-sm text-destructive">{form.formState.errors.title.message}</p>
            )}

            <div className="space-y-2">
              <Textarea
                placeholder="Short attractive description for the portfolio grid..."
                className="text-lg leading-relaxed border-none bg-transparent px-0 focus-visible:ring-0 shadow-none resize-y placeholder:text-muted-foreground/40 font-serif min-h-[100px]"
                {...form.register('description')}
              />
              {form.formState.errors.description && (
                <p className="text-sm text-destructive">
                  {form.formState.errors.description.message}
                </p>
              )}
            </div>
          </div>

          <div className="relative group rounded-2xl border-2 border-dashed border-border/50 bg-muted/20 hover:bg-muted/40 transition-colors overflow-hidden flex flex-col items-center justify-center min-h-[250px]">
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
                    <ImageIcon className="h-4 w-4 mr-2" /> Change Cover
                  </Button>
                  <Button
                    type="button"
                    variant="destructive"
                    onClick={() => {
                      form.setValue('coverImage', '');
                      setCoverPreview(null);
                    }}
                  >
                    <Trash2 className="h-4 w-4 mr-2" /> Remove
                  </Button>
                </div>
              </>
            ) : (
              <div
                className="flex flex-col items-center justify-center p-8 text-center space-y-4 cursor-pointer"
                onClick={() => document.getElementById('cover-upload')?.click()}
              >
                <div className="h-16 w-16 rounded-full bg-indigo-500/10 flex items-center justify-center">
                  <ImageIcon className="h-8 w-8 text-indigo-500" />
                </div>
                <div>
                  <p className="font-semibold text-lg">Upload Project Cover</p>
                  <p className="text-sm text-muted-foreground mt-1">
                    Stunning visual representation
                  </p>
                </div>
              </div>
            )}
            <input
              id="cover-upload"
              type="file"
              className="hidden"
              accept="image/*"
              disabled={isUploading}
              onChange={handleFileUpload}
            />
          </div>
        </div>

        {/* Deep Dive Tabs */}
        <Tabs defaultValue="metadata" className="w-full">
          <TabsList className="grid w-full grid-cols-2 md:grid-cols-4 mb-8 h-auto p-1">
            <TabsTrigger value="metadata" className="py-3">
              <Settings className="h-4 w-4 mr-2" /> Details
            </TabsTrigger>
            <TabsTrigger value="stack" className="py-3">
              <Code className="h-4 w-4 mr-2" /> Tech Stack
            </TabsTrigger>
            <TabsTrigger value="casestudy" className="py-3">
              <FileText className="h-4 w-4 mr-2" /> Case Study
            </TabsTrigger>
            <TabsTrigger value="seo" className="py-3">
              <Globe className="h-4 w-4 mr-2" /> SEO
            </TabsTrigger>
          </TabsList>

          <TabsContent value="metadata" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-muted/10 p-6 rounded-2xl border border-border/50">
              <div className="space-y-2">
                <Label>Client Name</Label>
                <Input
                  placeholder="Acme Corp"
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
                  placeholder="Web App Development"
                  className="bg-background"
                  {...form.register('category')}
                />
                {form.formState.errors.category && (
                  <p className="text-sm text-destructive">
                    {form.formState.errors.category.message}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label>Industry</Label>
                <Input
                  placeholder="Fintech, Healthcare, etc."
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
                <Label>Website URL / Live Link</Label>
                <Input
                  placeholder="https://..."
                  className="bg-background"
                  {...form.register('websiteUrl')}
                />
              </div>

              <div className="space-y-2">
                <Label>Duration</Label>
                <Input
                  placeholder="e.g. 6 Months"
                  className="bg-background"
                  {...form.register('duration')}
                />
              </div>
            </div>
          </TabsContent>

          <TabsContent value="stack" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-muted/10 p-6 rounded-2xl border border-border/50">
              <div className="space-y-2 md:col-span-2">
                <Label>Technologies Used (Comma separated)</Label>
                <Input
                  placeholder="React, Node.js, PostgreSQL, AWS"
                  className="bg-background"
                  {...form.register('technologiesUsed')}
                />
              </div>
              <div className="space-y-2 md:col-span-2">
                <Label>Services Provided (Comma separated)</Label>
                <Input
                  placeholder="UI/UX Design, Frontend Development, DevOps"
                  className="bg-background"
                  {...form.register('servicesUsed')}
                />
              </div>
              <div className="space-y-2 md:col-span-2">
                <Label>Core Team Members (Comma separated)</Label>
                <Input
                  placeholder="John Doe, Jane Smith"
                  className="bg-background"
                  {...form.register('teamMembers')}
                />
              </div>
            </div>
          </TabsContent>

          <TabsContent value="casestudy" className="space-y-6">
            <div className="space-y-6 bg-muted/10 p-6 rounded-2xl border border-border/50">
              <div className="space-y-2">
                <Label>Project Overview</Label>
                <Textarea
                  placeholder="High level overview of what was built..."
                  className="bg-background min-h-[100px]"
                  {...form.register('projectOverview')}
                />
              </div>

              <div className="space-y-2">
                <Label>Challenges Faced</Label>
                <Textarea
                  placeholder="What were the business or technical hurdles..."
                  className="bg-background min-h-[100px]"
                  {...form.register('challenges')}
                />
              </div>

              <div className="space-y-2">
                <Label>Our Solution</Label>
                <Textarea
                  placeholder="How did we solve it..."
                  className="bg-background min-h-[100px]"
                  {...form.register('solution')}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label>Key Results & Metrics</Label>
                  <Textarea
                    placeholder="Increased conversion by 50%..."
                    className="bg-background min-h-[100px]"
                    {...form.register('results')}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Client Testimonial</Label>
                  <Textarea
                    placeholder="This team is amazing..."
                    className="bg-background min-h-[100px]"
                    {...form.register('testimonial')}
                  />
                </div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="seo" className="space-y-6">
            <div className="bg-muted/10 p-6 rounded-2xl border border-border/50 space-y-6">
              <div className="space-y-2">
                <Label>SEO Title</Label>
                <Input
                  placeholder="Best Practices for Web Dev"
                  className="bg-background"
                  {...form.register('seoTitle')}
                />
              </div>

              <div className="space-y-2">
                <Label>SEO Description</Label>
                <Textarea
                  placeholder="Write a concise meta description..."
                  className="bg-background resize-none h-24"
                  {...form.register('seoDescription')}
                />
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </form>
    </div>
  );
}
