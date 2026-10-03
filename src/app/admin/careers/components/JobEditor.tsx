'use client';

import React, { useState, useEffect } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { toast } from 'sonner';
import {
  Briefcase,
  MapPin,
  Clock,
  Plus,
  X,
  CheckCircle2,
  Trash2,
  Sparkles,
  Building,
  DollarSign,
  Award,
  Eye,
  FileText,
} from 'lucide-react';

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
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import { ScrollArea } from '@/components/ui/scroll-area';
import { logger } from '@/lib/logger';
import { parseArrayField } from '@/lib/data-helpers';

const POPULAR_DEPARTMENTS = [
  'Engineering',
  'Cloud & DevOps',
  'AI & Machine Learning',
  'Product & Design',
  'Enterprise Solutions',
  'Security & Compliance',
];

const POPULAR_TYPES = ['Full-Time', 'Contract', 'Part-Time', 'Internship'];

const POPULAR_LOCATIONS = [
  'Remote (Global)',
  'Remote (US)',
  'Hybrid (New York, NY)',
  'Hybrid (London, UK)',
  'On-Site (San Francisco, CA)',
];

const SUGGESTED_REQUIREMENTS = [
  '5+ years of hands-on production experience in TypeScript, React, and Next.js',
  'Deep expertise in cloud architectures (AWS / GCP) and containerization (Docker / Kubernetes)',
  'Proven track record of designing and scaling distributed systems and PostgreSQL databases',
  'Strong communication skills and enthusiasm for collaborating with cross-functional teams',
  'Experience with SOC 2 compliance, OWASP security principles, and enterprise SLAs',
  'Bachelor’s or Master’s in Computer Science, Software Engineering, or equivalent experience',
];

const jobSchema = z.object({
  title: z.string().min(3, 'Title is required'),
  department: z.string().min(2, 'Department is required'),
  location: z.string().min(2, 'Location is required'),
  type: z.string().min(2, 'Type is required'),
  description: z.string().min(10, 'Description must be at least 10 characters'),
  requirements: z.string().optional(),
  status: z.enum(['OPEN', 'CLOSED']),
});

type JobFormValues = z.infer<typeof jobSchema>;

interface JobEditorProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  initialData?: any;
}

export function JobEditor({ isOpen, onClose, onSuccess, initialData }: JobEditorProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [requirementsList, setRequirementsList] = useState<string[]>([]);
  const [requirementInput, setRequirementInput] = useState('');

  const form = useForm<JobFormValues>({
    resolver: zodResolver(jobSchema),
    defaultValues: {
      title: '',
      department: 'Engineering',
      location: 'Remote (Global)',
      type: 'Full-Time',
      description: '',
      requirements: '',
      status: 'OPEN',
    },
  });

  useEffect(() => {
    if (isOpen) {
      if (initialData) {
        form.reset({
          title: initialData.title || '',
          department: initialData.department || 'Engineering',
          location: initialData.location || 'Remote (Global)',
          type: initialData.type || 'Full-Time',
          description: initialData.description || '',
          requirements: initialData.requirements || '',
          status: initialData.status || 'OPEN',
        });

        // Parse requirements
        const parsed = parseArrayField(initialData.requirements);
        setRequirementsList(parsed);
      } else {
        form.reset({
          title: '',
          department: 'Engineering',
          location: 'Remote (Global)',
          type: 'Full-Time',
          description: '',
          requirements: '',
          status: 'OPEN',
        });
        setRequirementsList([
          '5+ years of hands-on production experience in TypeScript, React, and Next.js',
          'Deep expertise in cloud architectures (AWS / GCP) and containerization',
          'Demonstrated track record of shipping performant, accessible digital products',
        ]);
      }
    }
  }, [initialData, isOpen, form]);

  const addRequirement = (req: string) => {
    const trimmed = req.trim();
    if (trimmed && !requirementsList.includes(trimmed)) {
      setRequirementsList([...requirementsList, trimmed]);
      setRequirementInput('');
    }
  };

  const removeRequirement = (index: number) => {
    setRequirementsList(requirementsList.filter((_, i) => i !== index));
  };

  // Watch fields for live preview
  const watchedTitle = form.watch('title');
  const watchedDepartment = form.watch('department');
  const watchedLocation = form.watch('location');
  const watchedType = form.watch('type');
  const watchedDescription = form.watch('description');

  const onSubmit = async (data: JobFormValues) => {
    setIsSubmitting(true);
    const toastId = toast.loading(initialData?.id ? 'Updating job...' : 'Creating job...');

    // Save requirements as JSON string array
    const payload = {
      ...data,
      requirements: JSON.stringify(requirementsList),
    };

    try {
      const url = initialData?.id ? `/api/admin/jobs/${initialData.id}` : '/api/admin/jobs';
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
      logger.error('Error saving job:', error);
      toast.error('Failed to save job.', { id: toastId });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-[95vw] md:max-w-4xl p-0 bg-background/95 backdrop-blur-2xl border border-white/10 shadow-2xl rounded-3xl overflow-hidden flex flex-col max-h-[92vh]">
        {/* Header */}
        <DialogHeader className="px-6 py-4 border-b border-border/40 sticky top-0 bg-background/90 backdrop-blur-md z-10 flex flex-row items-center justify-between">
          <div className="flex items-center justify-between w-full pr-8">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400">
                <Briefcase className="w-5 h-5" />
              </div>
              <div>
                <DialogTitle className="text-xl font-bold tracking-tight">
                  {initialData?.id ? 'Edit Career Opportunity' : 'Create Career Opportunity'}
                </DialogTitle>
                <DialogDescription className="text-xs">
                  Publish enterprise roles with live rendering on public careers pages
                </DialogDescription>
              </div>
            </div>

            <div className="flex items-center gap-2.5">
              <Button
                variant="outline"
                size="sm"
                type="button"
                onClick={() => {
                  form.setValue('status', 'CLOSED');
                  form.handleSubmit(onSubmit)();
                }}
                disabled={isSubmitting}
                className="rounded-full text-xs font-semibold px-4"
              >
                Mark as Closed
              </Button>
              <Button
                onClick={() => {
                  form.setValue('status', 'OPEN');
                  form.handleSubmit(onSubmit)();
                }}
                disabled={isSubmitting}
                size="sm"
                className="bg-indigo-600 hover:bg-indigo-700 text-white rounded-full text-xs font-semibold px-5 shadow-lg shadow-indigo-500/25"
              >
                {isSubmitting ? 'Saving...' : initialData?.id ? 'Update Job' : 'Publish Opportunity'}
              </Button>
            </div>
          </div>
        </DialogHeader>

        <ScrollArea className="flex-1 px-6 py-6 overflow-y-auto">
          <form id="job-form" onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 pb-12">
            {/* Top Job Title & Department Bar */}
            <div className="space-y-4">
              <div>
                <Label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                  Job Position Title
                </Label>
                <Input
                  placeholder="e.g. Lead Enterprise Cloud Solutions Architect"
                  className="text-2xl sm:text-3xl font-extrabold border-none bg-transparent px-0 focus-visible:ring-0 shadow-none placeholder:text-muted-foreground/40 h-auto mt-1"
                  {...form.register('title')}
                />
                {form.formState.errors.title && (
                  <p className="text-xs text-destructive mt-1">
                    {form.formState.errors.title.message}
                  </p>
                )}
              </div>

              {/* Department, Location, Type Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
                <div className="space-y-1.5">
                  <Label className="text-xs font-semibold">Department</Label>
                  <Input
                    placeholder="Engineering"
                    list="job-departments"
                    className="bg-muted/40 border-border/50 text-xs"
                    {...form.register('department')}
                  />
                  <datalist id="job-departments">
                    {POPULAR_DEPARTMENTS.map((dept) => (
                      <option key={dept} value={dept} />
                    ))}
                  </datalist>
                </div>

                <div className="space-y-1.5">
                  <Label className="text-xs font-semibold">Location / Policy</Label>
                  <Input
                    placeholder="Remote (Global)"
                    list="job-locations"
                    className="bg-muted/40 border-border/50 text-xs"
                    {...form.register('location')}
                  />
                  <datalist id="job-locations">
                    {POPULAR_LOCATIONS.map((loc) => (
                      <option key={loc} value={loc} />
                    ))}
                  </datalist>
                </div>

                <div className="space-y-1.5">
                  <Label className="text-xs font-semibold">Employment Type</Label>
                  <Input
                    placeholder="Full-Time"
                    list="job-types"
                    className="bg-muted/40 border-border/50 text-xs"
                    {...form.register('type')}
                  />
                  <datalist id="job-types">
                    {POPULAR_TYPES.map((t) => (
                      <option key={t} value={t} />
                    ))}
                  </datalist>
                </div>
              </div>
            </div>

            {/* Structured Tabs */}
            <Tabs defaultValue="overview" className="w-full">
              <TabsList className="grid w-full grid-cols-3 mb-6 h-auto p-1.5 bg-slate-900/90 dark:bg-zinc-900/90 rounded-2xl border border-white/10 shadow-inner">
                <TabsTrigger value="overview" className="py-2.5 rounded-xl text-xs font-semibold">
                  <FileText className="h-3.5 w-3.5 mr-2" /> 1. Role Overview
                </TabsTrigger>
                <TabsTrigger value="requirements" className="py-2.5 rounded-xl text-xs font-semibold">
                  <CheckCircle2 className="h-3.5 w-3.5 mr-2" /> 2. Requirements Builder
                </TabsTrigger>
                <TabsTrigger value="preview" className="py-2.5 rounded-xl text-xs font-semibold">
                  <Eye className="h-3.5 w-3.5 mr-2" /> 3. Live Card Preview
                </TabsTrigger>
              </TabsList>

              {/* TAB 1: Role Overview */}
              <TabsContent
                value="overview"
                className="space-y-4 bg-card/40 p-6 rounded-3xl border border-border/50 backdrop-blur-sm"
              >
                <div className="space-y-1.5">
                  <Label className="text-xs font-semibold">About the Role & Mission</Label>
                  <Textarea
                    placeholder="Provide a compelling overview of what this role entails, the problems the team tackles, and why top-tier talent should join InGrowwth Innovations..."
                    className="bg-background/80 min-h-[180px] text-sm leading-relaxed"
                    {...form.register('description')}
                  />
                  {form.formState.errors.description && (
                    <p className="text-xs text-destructive">
                      {form.formState.errors.description.message}
                    </p>
                  )}
                </div>

                <div className="p-4 rounded-2xl bg-background/50 border border-border/40 text-xs text-muted-foreground flex items-center gap-3">
                  <Sparkles className="w-4 h-4 text-indigo-400 shrink-0" />
                  <span>
                    Tip: Clearly articulating high-impact projects, engineering autonomy, and team culture significantly increases candidate conversion.
                  </span>
                </div>
              </TabsContent>

              {/* TAB 2: Interactive Requirements Builder */}
              <TabsContent
                value="requirements"
                className="space-y-6 bg-card/40 p-6 rounded-3xl border border-border/50 backdrop-blur-sm"
              >
                <div>
                  <h3 className="text-base font-bold text-foreground mb-1">
                    Structured Candidate Requirements
                  </h3>
                  <p className="text-xs text-muted-foreground">
                    Add specific bullet criteria. These automatically render with verified checkmark icons on public job pages.
                  </p>
                </div>

                {/* Add requirement input */}
                <div className="flex gap-2">
                  <Input
                    placeholder="Add requirement criteria (e.g. 5+ years experience in Next.js & AWS)..."
                    value={requirementInput}
                    onChange={(e) => setRequirementInput(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        addRequirement(requirementInput);
                      }
                    }}
                    className="bg-background text-xs"
                  />
                  <Button
                    type="button"
                    variant="secondary"
                    size="sm"
                    onClick={() => addRequirement(requirementInput)}
                    className="text-xs shrink-0"
                  >
                    <Plus className="w-3.5 h-3.5 mr-1" /> Add
                  </Button>
                </div>

                {/* Requirements List items */}
                <div className="space-y-2">
                  {requirementsList.length > 0 ? (
                    requirementsList.map((req, idx) => (
                      <div
                        key={idx}
                        className="flex items-start justify-between gap-3 p-3.5 rounded-xl bg-card border border-border/60 group"
                      >
                        <div className="flex items-start gap-2.5">
                          <CheckCircle2 className="w-4 h-4 text-indigo-400 shrink-0 mt-0.5" />
                          <span className="text-xs text-foreground leading-relaxed">{req}</span>
                        </div>
                        <button
                          type="button"
                          onClick={() => removeRequirement(idx)}
                          className="text-muted-foreground hover:text-red-400 opacity-60 group-hover:opacity-100 transition-opacity"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    ))
                  ) : (
                    <div className="text-center py-6 text-xs text-muted-foreground border border-dashed border-border/60 rounded-xl">
                      No requirements added yet. Use the suggestions below for quick population.
                    </div>
                  )}
                </div>

                {/* Suggested Requirements */}
                <div className="pt-2">
                  <span className="text-[11px] font-semibold text-muted-foreground block mb-2">
                    One-Click Suggested Requirements:
                  </span>
                  <div className="flex flex-col gap-1.5">
                    {SUGGESTED_REQUIREMENTS.map((sug, i) => (
                      <button
                        key={i}
                        type="button"
                        onClick={() => addRequirement(sug)}
                        className={`text-left text-xs p-2.5 rounded-lg border transition-all ${
                          requirementsList.includes(sug)
                            ? 'bg-indigo-600/10 text-indigo-300 border-indigo-500/30'
                            : 'bg-muted/40 text-muted-foreground border-border/50 hover:bg-muted hover:text-foreground'
                        }`}
                      >
                        {requirementsList.includes(sug) ? '✓ ' : '+ '} {sug}
                      </button>
                    ))}
                  </div>
                </div>
              </TabsContent>

              {/* TAB 3: Live Card Preview */}
              <TabsContent
                value="preview"
                className="space-y-6 bg-card/40 p-6 rounded-3xl border border-border/50 backdrop-blur-sm"
              >
                <div>
                  <h3 className="text-base font-bold text-foreground mb-1">Public Job Card Preview</h3>
                  <p className="text-xs text-muted-foreground">
                    This is how the role appears on the public /careers portal and /careers/[id] deep-dive page.
                  </p>
                </div>

                {/* Card Container Preview */}
                <div className="max-w-xl mx-auto rounded-3xl border border-border/80 bg-card p-6 shadow-2xl space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="px-3 py-1 rounded-full text-xs font-semibold bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
                      {watchedDepartment || 'Engineering'}
                    </span>
                    <span className="text-xs font-semibold text-emerald-400 flex items-center gap-1.5">
                      <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                      Actively Hiring
                    </span>
                  </div>

                  <div>
                    <h4 className="text-2xl font-extrabold text-foreground">
                      {watchedTitle || 'Job Position Title'}
                    </h4>
                    <div className="flex flex-wrap items-center gap-3 mt-3 text-xs text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <MapPin className="w-3.5 h-3.5 text-indigo-400" />
                        {watchedLocation || 'Remote'}
                      </span>
                      <span className="flex items-center gap-1">
                        <Clock className="w-3.5 h-3.5 text-pink-400" />
                        {watchedType || 'Full-Time'}
                      </span>
                      <span className="flex items-center gap-1">
                        <Building className="w-3.5 h-3.5 text-amber-400" />
                        InGrowwth Innovations
                      </span>
                    </div>
                  </div>

                  <p className="text-xs text-muted-foreground line-clamp-3 leading-relaxed border-t border-border/40 pt-3">
                    {watchedDescription || 'Job description preview text will render here...'}
                  </p>

                  {requirementsList.length > 0 && (
                    <div className="pt-2 border-t border-border/40 space-y-1.5">
                      <span className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground">
                        Top Requirements ({requirementsList.length})
                      </span>
                      <div className="space-y-1">
                        {requirementsList.slice(0, 3).map((req, i) => (
                          <div key={i} className="flex items-start gap-2 text-xs text-foreground/80">
                            <CheckCircle2 className="w-3.5 h-3.5 text-indigo-400 shrink-0 mt-0.5" />
                            <span className="truncate">{req}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  <div className="pt-3 flex items-center justify-between">
                    <span className="text-xs font-semibold text-indigo-400">View Full Position →</span>
                    <Button size="sm" className="rounded-full text-xs px-4" disabled>
                      Apply Now
                    </Button>
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
