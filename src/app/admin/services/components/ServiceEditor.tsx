'use client';

import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { toast } from 'sonner';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import { ScrollArea } from '@/components/ui/scroll-area';

const serviceSchema = z.object({
  title: z.string().min(2, 'Title must be at least 2 characters'),
  description: z.string().min(10, 'Description must be at least 10 characters'),
  icon: z.string().min(2, 'Icon identifier is required'),
  content: z.string().min(20, 'Content must be at least 20 characters'),
  features: z.string().optional(),
  techStack: z.string().optional(),
  process: z.string().optional(),
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

  const form = useForm<ServiceFormValues>({
    resolver: zodResolver(serviceSchema),
    defaultValues: {
      title: '',
      description: '',
      icon: '',
      content: '',
      features: '',
      techStack: '',
      process: '',
    },
  });

  useEffect(() => {
    if (isOpen) {
      if (initialData) {
        form.reset({
          title: initialData.title || '',
          description: initialData.description || '',
          icon: initialData.icon || '',
          content: initialData.content || '',
          features: initialData.features ? JSON.stringify(initialData.features, null, 2) : '',
          techStack: initialData.techStack ? JSON.stringify(initialData.techStack, null, 2) : '',
          process: initialData.process ? JSON.stringify(initialData.process, null, 2) : '',
        });
      } else {
        form.reset({
          title: '',
          description: '',
          icon: '',
          content: '',
          features: '',
          techStack: '',
          process: '',
        });
      }
    }
  }, [initialData, isOpen, form]);

  const onSubmit = async (data: ServiceFormValues) => {
    setIsSubmitting(true);
    const toastId = toast.loading(initialData?.id ? 'Updating service...' : 'Creating service...');

    try {
      let parsedFeatures = [];
      let parsedTechStack = [];
      let parsedProcess = [];

      try {
        if (data.features) parsedFeatures = JSON.parse(data.features);
        if (data.techStack) parsedTechStack = JSON.parse(data.techStack);
        if (data.process) parsedProcess = JSON.parse(data.process);
      } catch {
        toast.error('Invalid JSON in Features, Tech Stack, or Process', { id: toastId });
        setIsSubmitting(false);
        return;
      }

      const payload = {
        title: data.title,
        description: data.description,
        icon: data.icon,
        content: data.content,
        features: parsedFeatures,
        techStack: parsedTechStack,
        process: parsedProcess,
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
      console.error('Error saving service:', error);
      toast.error('Failed to save service.', { id: toastId });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-[95vw] md:max-w-2xl p-0 bg-background/95 backdrop-blur-xl border border-white/10 shadow-2xl rounded-2xl overflow-hidden flex flex-col max-h-[90vh]">
        <DialogHeader className="px-6 py-4 border-b border-border/40 sticky top-0 bg-background/80 backdrop-blur-md z-10 flex flex-row items-center justify-between">
          <div className="flex items-center justify-between w-full pr-8">
            <div>
              <DialogTitle className="text-2xl font-bold tracking-tight">
                {initialData?.id ? 'Edit Service' : 'New Service'}
              </DialogTitle>
              <DialogDescription>Manage website services.</DialogDescription>
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
            className="space-y-6 pb-12"
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div className="space-y-2">
                <Label htmlFor="title">Title</Label>
                <Input
                  id="title"
                  placeholder="e.g., Web Development"
                  className="bg-background"
                  {...form.register('title')}
                />
                {form.formState.errors.title && (
                  <p className="text-sm text-destructive">{form.formState.errors.title.message}</p>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="icon">Icon Name (Lucide)</Label>
                <Input
                  id="icon"
                  placeholder="e.g., Code"
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
              <Label htmlFor="content">Full Content</Label>
              <Textarea
                id="content"
                placeholder="Write the full service content here..."
                className="min-h-[150px] bg-background"
                {...form.register('content')}
              />
              {form.formState.errors.content && (
                <p className="text-sm text-destructive">{form.formState.errors.content.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="features">Features (JSON Array of Strings)</Label>
              <Textarea
                id="features"
                placeholder='["Feature 1", "Feature 2"]'
                className="min-h-[100px] bg-background font-mono text-sm"
                {...form.register('features')}
              />
              {form.formState.errors.features && (
                <p className="text-sm text-destructive">{form.formState.errors.features.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="techStack">Tech Stack (JSON Array of Strings)</Label>
              <Textarea
                id="techStack"
                placeholder='["React", "Node.js"]'
                className="min-h-[100px] bg-background font-mono text-sm"
                {...form.register('techStack')}
              />
              {form.formState.errors.techStack && (
                <p className="text-sm text-destructive">
                  {form.formState.errors.techStack.message}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="process">Process (JSON Array of Objects)</Label>
              <Textarea
                id="process"
                placeholder='[{"step": "1", "details": "Desc"}]'
                className="min-h-[150px] bg-background font-mono text-sm"
                {...form.register('process')}
              />
              {form.formState.errors.process && (
                <p className="text-sm text-destructive">{form.formState.errors.process.message}</p>
              )}
            </div>
          </form>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}
