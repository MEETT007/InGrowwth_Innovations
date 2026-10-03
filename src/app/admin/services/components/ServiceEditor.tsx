'use client';

import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { toast } from 'sonner';
import {
  Plus,
  Trash2,
  X,
  CheckCircle2,
  Cpu,
  Layers,
  Sparkles,
  ChevronUp,
  ChevronDown,
  RotateCcw,
} from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
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
  parseProcessField,
  DEFAULT_PROCESS_STEPS,
  POPULAR_TECH_TAGS,
  POPULAR_FEATURE_SUGGESTIONS,
  type ProcessStep,
} from '@/lib/data-helpers';

const serviceSchema = z.object({
  title: z.string().min(2, 'Title must be at least 2 characters'),
  slug: z.string().optional(),
  description: z.string().min(10, 'Description must be at least 10 characters'),
  icon: z.string().min(2, 'Icon identifier is required'),
  content: z.string().min(20, 'Content must be at least 20 characters'),
});

type ServiceFormValues = z.infer<typeof serviceSchema>;

interface ServiceEditorProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  initialData?: any;
}

export function ServiceEditor({ isOpen, onClose, onSuccess, initialData }: ServiceEditorProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Dedicated state for intuitive array/object builders
  const [featuresList, setFeaturesList] = useState<string[]>([]);
  const [techStackList, setTechStackList] = useState<string[]>([]);
  const [processList, setProcessList] = useState<ProcessStep[]>([]);

  const [newFeatureInput, setNewFeatureInput] = useState('');
  const [newTechInput, setNewTechInput] = useState('');

  const form = useForm<ServiceFormValues>({
    resolver: zodResolver(serviceSchema),
    defaultValues: {
      title: '',
      slug: '',
      description: '',
      icon: '',
      content: '',
    },
  });

  useEffect(() => {
    if (isOpen) {
      if (initialData) {
        form.reset({
          title: initialData.title || '',
          slug: initialData.slug || '',
          description: initialData.description || '',
          icon: initialData.icon || '',
          content: initialData.content || '',
        });
        setFeaturesList(parseArrayField(initialData.features));
        setTechStackList(parseArrayField(initialData.techStack));
        setProcessList(parseProcessField(initialData.process));
      } else {
        form.reset({
          title: '',
          slug: '',
          description: '',
          icon: '',
          content: '',
        });
        setFeaturesList([]);
        setTechStackList([]);
        setProcessList(DEFAULT_PROCESS_STEPS);
      }
      setNewFeatureInput('');
      setNewTechInput('');
    }
  }, [initialData, isOpen, form]);

  // Features handlers
  const handleAddFeature = (textToAdd?: string) => {
    const raw = textToAdd !== undefined ? textToAdd : newFeatureInput;
    if (!raw.trim()) return;

    const newItems = parseArrayField(raw);
    if (newItems.length > 0) {
      setFeaturesList((prev) => {
        const combined = [...prev];
        for (const item of newItems) {
          if (!combined.includes(item)) combined.push(item);
        }
        return combined;
      });
      if (textToAdd === undefined) setNewFeatureInput('');
    }
  };

  const handleRemoveFeature = (index: number) => {
    setFeaturesList((prev) => prev.filter((_, i) => i !== index));
  };

  // Tech stack handlers
  const handleAddTech = (techName?: string) => {
    const raw = techName !== undefined ? techName : newTechInput;
    if (!raw.trim()) return;

    const newItems = parseArrayField(raw);
    if (newItems.length > 0) {
      setTechStackList((prev) => {
        const combined = [...prev];
        for (const item of newItems) {
          if (!combined.some((t) => t.toLowerCase() === item.toLowerCase())) {
            combined.push(item);
          }
        }
        return combined;
      });
      if (techName === undefined) setNewTechInput('');
    }
  };

  const handleToggleTech = (tech: string) => {
    if (techStackList.some((t) => t.toLowerCase() === tech.toLowerCase())) {
      setTechStackList((prev) => prev.filter((t) => t.toLowerCase() !== tech.toLowerCase()));
    } else {
      setTechStackList((prev) => [...prev, tech]);
    }
  };

  const handleRemoveTech = (index: number) => {
    setTechStackList((prev) => prev.filter((_, i) => i !== index));
  };

  // Process steps handlers
  const handleAddProcessStep = () => {
    setProcessList((prev) => [
      ...prev,
      {
        step: `Phase ${prev.length + 1}`,
        details: '',
      },
    ]);
  };

  const handleUpdateProcessStep = (index: number, field: 'step' | 'details', value: string) => {
    setProcessList((prev) =>
      prev.map((item, i) => (i === index ? { ...item, [field]: value } : item))
    );
  };

  const handleRemoveProcessStep = (index: number) => {
    setProcessList((prev) => prev.filter((_, i) => i !== index));
  };

  const handleMoveProcessStep = (index: number, direction: 'up' | 'down') => {
    if (direction === 'up' && index === 0) return;
    if (direction === 'down' && index === processList.length - 1) return;
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    setProcessList((prev) => {
      const next = [...prev];
      const temp = next[index];
      next[index] = next[targetIndex];
      next[targetIndex] = temp;
      return next;
    });
  };

  const handleLoadDefaultProcess = () => {
    setProcessList(DEFAULT_PROCESS_STEPS);
    toast.info('Standard 5-step delivery process loaded');
  };

  const onSubmit = async (data: ServiceFormValues) => {
    setIsSubmitting(true);
    const toastId = toast.loading(initialData?.id ? 'Updating service...' : 'Creating service...');

    try {
      const payload = {
        title: data.title,
        slug: data.slug || undefined,
        description: data.description,
        icon: data.icon,
        content: data.content,
        features: featuresList,
        techStack: techStackList,
        process: processList,
      };

      const url = initialData?.id ? `/api/admin/services/${initialData.id}` : '/api/admin/services';
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
      logger.error('Error saving service:', error);
      toast.error('Failed to save service.', { id: toastId });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-[95vw] md:max-w-3xl p-0 bg-background/95 backdrop-blur-xl border border-white/10 shadow-2xl rounded-2xl overflow-hidden flex flex-col max-h-[90vh]">
        <DialogHeader className="px-6 py-4 border-b border-border/40 sticky top-0 bg-background/80 backdrop-blur-md z-10 flex flex-row items-center justify-between">
          <div className="flex items-center justify-between w-full pr-8">
            <div>
              <DialogTitle className="text-2xl font-bold tracking-tight">
                {initialData?.id ? 'Edit Service' : 'New Service'}
              </DialogTitle>
              <DialogDescription>
                Configure service details, key features, technology stack, and delivery roadmap.
              </DialogDescription>
            </div>
            <div className="flex items-center gap-2">
              <Button
                onClick={form.handleSubmit(onSubmit)}
                disabled={isSubmitting}
                size="sm"
                className="bg-indigo-600 hover:bg-indigo-700 text-white shadow-md shadow-indigo-500/20"
              >
                {isSubmitting ? 'Saving...' : initialData?.id ? 'Update Service' : 'Create Service'}
              </Button>
            </div>
          </div>
        </DialogHeader>

        <ScrollArea className="flex-1 px-6 py-6 overflow-y-auto">
          <form
            id="service-form"
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-8 pb-12"
          >
            {/* General Info */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              <div className="space-y-2">
                <Label htmlFor="title">Title</Label>
                <Input
                  id="title"
                  placeholder="e.g., Web Development"
                  className="bg-background"
                  {...form.register('title')}
                  onChange={(e) => {
                    form.setValue('title', e.target.value);
                    if (!initialData?.id) {
                      form.setValue(
                        'slug',
                        e.target.value
                          .toLowerCase()
                          .replace(/[^a-z0-9]+/g, '-')
                          .replace(/(^-|-$)+/g, '')
                      );
                    }
                  }}
                />
                {form.formState.errors.title && (
                  <p className="text-sm text-destructive">{form.formState.errors.title.message}</p>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="slug">Slug (URL path)</Label>
                <Input
                  id="slug"
                  placeholder="e.g., web-development"
                  className="bg-background font-mono text-sm"
                  {...form.register('slug')}
                />
                <p className="text-[11px] text-muted-foreground">Auto-generated if left empty.</p>
              </div>
              <div className="space-y-2">
                <Label htmlFor="icon">Icon Name (Lucide)</Label>
                <Input
                  id="icon"
                  placeholder="e.g., Code, Smartphone, Cloud, Cpu"
                  className="bg-background"
                  {...form.register('icon')}
                />
                {form.formState.errors.icon && (
                  <p className="text-sm text-destructive">{form.formState.errors.icon.message}</p>
                )}
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Short Description</Label>
              <Input
                id="description"
                placeholder="Brief summary of the service"
                className="bg-background"
                {...form.register('description')}
              />
              {form.formState.errors.description && (
                <p className="text-sm text-destructive">
                  {form.formState.errors.description.message}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="content">Full Content / Overview</Label>
              <Textarea
                id="content"
                placeholder="Write the full service narrative and pitch here..."
                className="min-h-[120px] bg-background"
                {...form.register('content')}
              />
              {form.formState.errors.content && (
                <p className="text-sm text-destructive">{form.formState.errors.content.message}</p>
              )}
            </div>

            {/* KEY FEATURES BUILDER */}
            <div className="space-y-4 p-5 rounded-2xl border border-border/60 bg-muted/20">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="h-5 w-5 text-indigo-500" />
                  <Label className="text-base font-semibold">Key Features</Label>
                  <span className="text-xs text-muted-foreground px-2 py-0.5 rounded-full bg-background border border-border/60">
                    {featuresList.length} items
                  </span>
                </div>
                <p className="text-xs text-muted-foreground hidden sm:block">
                  Displayed as checkmarked benefit cards on the service page
                </p>
              </div>

              {/* Add feature input */}
              <div className="flex gap-2">
                <Input
                  placeholder="Type a feature and press Enter (e.g. Next.js 15+ App Router)"
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
                <Button
                  type="button"
                  onClick={() => handleAddFeature()}
                  variant="secondary"
                  className="shrink-0"
                >
                  <Plus className="h-4 w-4 mr-1" /> Add
                </Button>
              </div>

              {/* Feature Suggestions */}
              <div className="space-y-1.5">
                <span className="text-[11px] font-medium text-muted-foreground flex items-center gap-1">
                  <Sparkles className="h-3 w-3 text-indigo-400" /> Quick Add Suggestions:
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {POPULAR_FEATURE_SUGGESTIONS.map((sug) => {
                    const isAdded = featuresList.includes(sug);
                    return (
                      <button
                        type="button"
                        key={sug}
                        onClick={() => handleAddFeature(sug)}
                        disabled={isAdded}
                        className={`text-[11px] px-2.5 py-1 rounded-full border transition-all text-left ${
                          isAdded
                            ? 'opacity-40 border-border/40 bg-muted cursor-default'
                            : 'border-indigo-500/20 bg-indigo-500/5 hover:bg-indigo-500/15 text-foreground hover:border-indigo-500/40 cursor-pointer'
                        }`}
                      >
                        + {sug}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Features List */}
              {featuresList.length > 0 ? (
                <div className="space-y-2 pt-2">
                  {featuresList.map((feature, idx) => (
                    <div
                      key={idx}
                      className="flex items-center justify-between p-3 rounded-xl bg-background border border-border/60 group hover:border-indigo-500/30 transition-all"
                    >
                      <div className="flex items-center gap-3">
                        <CheckCircle2 className="h-4 w-4 text-indigo-500 shrink-0" />
                        <span className="text-sm font-medium text-foreground">{feature}</span>
                      </div>
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        onClick={() => handleRemoveFeature(idx)}
                        className="h-7 w-7 text-muted-foreground hover:text-destructive hover:bg-destructive/10"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </Button>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-6 px-4 border border-dashed border-border/60 rounded-xl text-xs text-muted-foreground">
                  No features added yet. Type a feature above or click a suggestion.
                </div>
              )}
            </div>

            {/* TECH STACK BUILDER */}
            <div className="space-y-4 p-5 rounded-2xl border border-border/60 bg-muted/20">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Cpu className="h-5 w-5 text-indigo-500" />
                  <Label className="text-base font-semibold">Technologies We Use</Label>
                  <span className="text-xs text-muted-foreground px-2 py-0.5 rounded-full bg-background border border-border/60">
                    {techStackList.length} technologies
                  </span>
                </div>
                <p className="text-xs text-muted-foreground hidden sm:block">
                  Renders with branded interactive tech icons
                </p>
              </div>

              {/* Add tech input */}
              <div className="flex gap-2">
                <Input
                  placeholder="Type a technology (e.g. React, Python, AWS) and press Enter"
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
                <Button
                  type="button"
                  onClick={() => handleAddTech()}
                  variant="secondary"
                  className="shrink-0"
                >
                  <Plus className="h-4 w-4 mr-1" /> Add
                </Button>
              </div>

              {/* Selected Tech Pills */}
              <div className="min-h-[46px] p-2.5 rounded-xl border border-border/60 bg-background flex flex-wrap gap-2 items-center">
                {techStackList.length > 0 ? (
                  techStackList.map((tech, idx) => (
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
                    No technologies selected yet. Click any quick-pick below or type one above.
                  </span>
                )}
              </div>

              {/* Quick Pick Popular Tech Tags */}
              <div className="space-y-1.5">
                <span className="text-[11px] font-medium text-muted-foreground flex items-center gap-1">
                  <Sparkles className="h-3 w-3 text-indigo-400" /> Click to Toggle Popular Technologies:
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {POPULAR_TECH_TAGS.map((tech) => {
                    const isSelected = techStackList.some(
                      (t) => t.toLowerCase() === tech.toLowerCase()
                    );
                    return (
                      <button
                        type="button"
                        key={tech}
                        onClick={() => handleToggleTech(tech)}
                        className={`text-xs px-2.5 py-1 rounded-full border transition-all cursor-pointer ${
                          isSelected
                            ? 'bg-indigo-600 text-white border-indigo-600 shadow-sm shadow-indigo-500/20'
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

            {/* PROCESS ROADMAP BUILDER */}
            <div className="space-y-4 p-5 rounded-2xl border border-border/60 bg-muted/20">
              <div className="flex items-center justify-between flex-wrap gap-2">
                <div className="flex items-center gap-2">
                  <Layers className="h-5 w-5 text-indigo-500" />
                  <Label className="text-base font-semibold">Delivery Process Roadmap</Label>
                  <span className="text-xs text-muted-foreground px-2 py-0.5 rounded-full bg-background border border-border/60">
                    {processList.length} steps
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={handleLoadDefaultProcess}
                    className="text-xs h-8 border-border/60"
                  >
                    <RotateCcw className="h-3 w-3 mr-1" /> Reset to 5-Step Best Practice
                  </Button>
                  <Button
                    type="button"
                    variant="secondary"
                    size="sm"
                    onClick={handleAddProcessStep}
                    className="text-xs h-8"
                  >
                    <Plus className="h-3 w-3 mr-1" /> Add Step
                  </Button>
                </div>
              </div>

              <p className="text-xs text-muted-foreground">
                Each step renders sequentially with step numbers and details on the public service page.
              </p>

              {/* Step Cards List */}
              {processList.length > 0 ? (
                <div className="space-y-3 pt-2">
                  {processList.map((step, idx) => (
                    <div
                      key={idx}
                      className="p-4 rounded-xl bg-background border border-border/60 shadow-sm space-y-3 relative group"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span className="w-6 h-6 rounded-full bg-indigo-500/10 border border-indigo-500/30 flex items-center justify-center text-xs font-bold text-indigo-500">
                            {idx + 1}
                          </span>
                          <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                            Step {idx + 1}
                          </span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            onClick={() => handleMoveProcessStep(idx, 'up')}
                            disabled={idx === 0}
                            className="h-7 w-7 text-muted-foreground hover:text-foreground disabled:opacity-30"
                          >
                            <ChevronUp className="h-3.5 w-3.5" />
                          </Button>
                          <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            onClick={() => handleMoveProcessStep(idx, 'down')}
                            disabled={idx === processList.length - 1}
                            className="h-7 w-7 text-muted-foreground hover:text-foreground disabled:opacity-30"
                          >
                            <ChevronDown className="h-3.5 w-3.5" />
                          </Button>
                          <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            onClick={() => handleRemoveProcessStep(idx)}
                            className="h-7 w-7 text-muted-foreground hover:text-destructive hover:bg-destructive/10"
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                          </Button>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 gap-3">
                        <div>
                          <Label className="text-xs text-muted-foreground mb-1 block">
                            Step Title / Phase Name
                          </Label>
                          <Input
                            placeholder="e.g., Discovery & Technical Scoping"
                            value={step.step}
                            onChange={(e) =>
                              handleUpdateProcessStep(idx, 'step', e.target.value)
                            }
                            className="bg-muted/30"
                          />
                        </div>
                        <div>
                          <Label className="text-xs text-muted-foreground mb-1 block">
                            Step Description & Deliverables
                          </Label>
                          <Textarea
                            placeholder="e.g., In-depth stakeholder workshops, technical requirements analysis, and system architecture roadmap."
                            value={step.details}
                            onChange={(e) =>
                              handleUpdateProcessStep(idx, 'details', e.target.value)
                            }
                            className="bg-muted/30 min-h-[70px] text-sm"
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-6 px-4 border border-dashed border-border/60 rounded-xl text-xs text-muted-foreground">
                  No process steps added yet. Click &quot;Add Step&quot; or &quot;Reset to 5-Step Best Practice&quot;.
                </div>
              )}
            </div>
          </form>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}
