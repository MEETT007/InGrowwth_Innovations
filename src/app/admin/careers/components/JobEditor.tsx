'use client';

import React, { useState, useEffect } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { toast } from 'sonner';

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
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import { ScrollArea } from '@/components/ui/scroll-area';

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

  const form = useForm<JobFormValues>({
    resolver: zodResolver(jobSchema),
    defaultValues: {
      title: '',
      department: '',
      location: '',
      type: '',
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
          department: initialData.department || '',
          location: initialData.location || '',
          type: initialData.type || '',
          description: initialData.description || '',
          requirements: initialData.requirements || '',
          status: initialData.status || 'OPEN',
        });
      } else {
        form.reset({
          title: '',
          department: '',
          location: '',
          type: '',
          description: '',
          requirements: '',
          status: 'OPEN',
        });
      }
    }
  }, [initialData, isOpen, form]);

  const onSubmit = async (data: JobFormValues) => {
    setIsSubmitting(true);
    const toastId = toast.loading(initialData?.id ? 'Updating job...' : 'Creating job...');

    try {
      const url = initialData?.id
        ? `/api/admin/jobs/${initialData.id}`
        : '/api/admin/jobs';
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
      console.error('Error saving job:', error);
      toast.error('Failed to save job.', { id: toastId });
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
                {initialData?.id ? 'Edit Job Posting' : 'New Job Posting'}
              </DialogTitle>
              <DialogDescription>Manage open positions.</DialogDescription>
            </div>
            <div className="flex items-center gap-2">
              <Button
                onClick={form.handleSubmit(onSubmit)}
                disabled={isSubmitting}
                size="sm"
                className="bg-indigo-600 hover:bg-indigo-700 text-white shadow-md shadow-indigo-500/20"
              >
                {isSubmitting ? 'Saving...' : initialData?.id ? 'Update Job' : 'Publish Job'}
              </Button>
            </div>
          </div>
        </DialogHeader>

        <ScrollArea className="flex-1 px-6 py-6 overflow-y-auto">
          <form id="job-form" onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 pb-12">
            <div className="space-y-4">
              <div className="space-y-2">
                <Label>Job Title</Label>
                <Input
                  placeholder="e.g. Senior Frontend Engineer"
                  className="bg-background"
                  {...form.register('title')}
                />
                {form.formState.errors.title && (
                  <p className="text-sm text-destructive">{form.formState.errors.title.message}</p>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Department</Label>
                  <Input
                    placeholder="e.g. Engineering"
                    className="bg-background"
                    {...form.register('department')}
                  />
                  {form.formState.errors.department && (
                    <p className="text-sm text-destructive">{form.formState.errors.department.message}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label>Location</Label>
                  <Input
                    placeholder="e.g. Remote, US"
                    className="bg-background"
                    {...form.register('location')}
                  />
                  {form.formState.errors.location && (
                    <p className="text-sm text-destructive">{form.formState.errors.location.message}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label>Employment Type</Label>
                  <Input
                    placeholder="e.g. Full-Time, Contract"
                    className="bg-background"
                    {...form.register('type')}
                  />
                  {form.formState.errors.type && (
                    <p className="text-sm text-destructive">{form.formState.errors.type.message}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label>Status</Label>
                  <Controller
                    control={form.control}
                    name="status"
                    render={({ field }) => (
                      <Select onValueChange={field.onChange} value={field.value}>
                        <SelectTrigger className="w-full bg-background">
                          <SelectValue placeholder="Select status" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="OPEN">Open</SelectItem>
                          <SelectItem value="CLOSED">Closed</SelectItem>
                        </SelectContent>
                      </Select>
                    )}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label>Job Description</Label>
                <Textarea
                  placeholder="Write a detailed job description..."
                  className="bg-background min-h-[150px]"
                  {...form.register('description')}
                />
                {form.formState.errors.description && (
                  <p className="text-sm text-destructive">
                    {form.formState.errors.description.message}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label>Requirements (Optional)</Label>
                <Textarea
                  placeholder="List the requirements (can be markdown or plain text)..."
                  className="bg-background min-h-[150px]"
                  {...form.register('requirements')}
                />
              </div>
            </div>
          </form>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}
