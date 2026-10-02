'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { toast } from 'sonner';
import { ArrowLeft, Image as ImageIcon, Trash2, Send, Clock, Save, Edit3, Type, Columns, GripHorizontal } from 'lucide-react';
import Link from 'next/link';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';

const campaignSchema = z.object({
  subject: z.string().min(3, 'Subject is required'),
  bannerImage: z.any().optional(),
  content: z.string().min(10, 'Content is required'),
  status: z.enum(['DRAFT', 'SCHEDULED', 'SENT']).default('DRAFT'),
  scheduledFor: z.string().optional(),
});

type CampaignFormValues = z.infer<typeof campaignSchema>;

export function NewsletterEditor({ initialData }: { initialData?: any }) {
  const router = useRouter();
  const [isUploading, setIsUploading] = useState(false);
  const [bannerPreview, setBannerPreview] = useState<string | null>(initialData?.bannerImage || null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const form = useForm<CampaignFormValues>({
    resolver: zodResolver(campaignSchema),
    defaultValues: {
      subject: initialData?.subject || '',
      bannerImage: initialData?.bannerImage || '',
      content: initialData?.content || '',
      status: initialData?.status || 'DRAFT',
      scheduledFor: initialData?.scheduledFor ? new Date(initialData.scheduledFor).toISOString().slice(0, 16) : '',
    },
  });

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    const file = files[0];
    const formData = new FormData();
    formData.append('file', file);

    setIsUploading(true);
    const toastId = toast.loading('Uploading banner image...');

    try {
      const response = await fetch('/api/upload?folder=newsletter', {
        method: 'POST',
        body: formData,
      });

      const result = await response.json();
      if (result.success && result.url) {
        form.setValue('bannerImage', result.url);
        setBannerPreview(result.url);
        toast.success('Banner uploaded successfully!', { id: toastId });
      } else {
        toast.error('Upload failed.', { id: toastId });
      }
    } catch (error) {
      toast.error('An error occurred during upload.', { id: toastId });
    } finally {
      setIsUploading(false);
    }
  };

  const onSubmit = async (data: CampaignFormValues) => {
    setIsSubmitting(true);
    const toastId = toast.loading(initialData?.id ? 'Updating campaign...' : 'Saving campaign...');
    
    try {
      const url = initialData?.id ? `/api/admin/newsletter/campaigns/${initialData.id}` : '/api/admin/newsletter/campaigns';
      const method = initialData?.id ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      
      const res = await response.json();
      if (res.success) {
        toast.success(res.message, { id: toastId });
        router.push('/admin/newsletter');
        router.refresh();
      } else {
        toast.error(res.message || 'Action failed.', { id: toastId });
      }
    } catch (error) {
      toast.error('Failed to save campaign.', { id: toastId });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto pb-24">
      <div className="sticky top-0 z-50 bg-background/80 backdrop-blur-xl border-b border-border/50 p-4 mb-8 -mx-4 sm:-mx-8 px-4 sm:px-8 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" asChild className="rounded-full">
            <Link href="/admin/newsletter">
              <ArrowLeft className="h-5 w-5" />
            </Link>
          </Button>
          <div>
            <h1 className="font-semibold text-lg">Email Builder</h1>
            <p className="text-xs text-muted-foreground">{form.watch('status') === 'DRAFT' ? 'Draft' : 'Ready'}</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline" onClick={() => form.setValue('status', 'DRAFT')} type="button">
            <Save className="h-4 w-4 mr-2" /> Save Draft
          </Button>
          <Button 
            onClick={form.handleSubmit(onSubmit)} 
            disabled={isSubmitting}
            className="bg-indigo-600 hover:bg-indigo-700 text-white shadow-md shadow-indigo-500/20"
          >
            <Clock className="h-4 w-4 mr-2" /> Schedule / Save
          </Button>
        </div>
      </div>

      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8 max-w-3xl mx-auto">
        <div className="space-y-4">
          <div className="space-y-2">
            <Label>Email Subject Line</Label>
            <Input
              placeholder="e.g. Exciting Updates from InGrowwth Innovations! 🚀"
              className="text-2xl font-bold bg-transparent px-4 py-6 border-2 focus-visible:ring-0 shadow-none placeholder:text-muted-foreground/50 h-auto rounded-xl"
              {...form.register('subject')}
            />
            {form.formState.errors.subject && <p className="text-sm text-destructive">{form.formState.errors.subject.message}</p>}
          </div>
        </div>

        <div className="border border-border/50 rounded-2xl overflow-hidden bg-card/40 shadow-sm">
          {/* Email Canvas Header/Banner */}
          <div className="relative group bg-muted/20 hover:bg-muted/40 transition-colors overflow-hidden flex flex-col items-center justify-center min-h-[250px] border-b border-border/50">
            {bannerPreview ? (
              <>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={bannerPreview} alt="Banner" className="absolute inset-0 w-full h-full object-cover" />
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-4">
                  <Button type="button" variant="secondary" onClick={() => document.getElementById('banner-upload')?.click()}>
                    <ImageIcon className="h-4 w-4 mr-2" /> Change Banner
                  </Button>
                  <Button type="button" variant="destructive" onClick={() => { form.setValue('bannerImage', ''); setBannerPreview(null); }}>
                    <Trash2 className="h-4 w-4 mr-2" /> Remove
                  </Button>
                </div>
              </>
            ) : (
              <div className="flex flex-col items-center justify-center p-8 text-center space-y-4 cursor-pointer" onClick={() => document.getElementById('banner-upload')?.click()}>
                <div className="h-16 w-16 rounded-full bg-indigo-500/10 flex items-center justify-center">
                  <ImageIcon className="h-8 w-8 text-indigo-500" />
                </div>
                <div>
                  <p className="font-semibold text-lg">Upload Hero Banner</p>
                  <p className="text-sm text-muted-foreground mt-1">Recommended: 1200x600px</p>
                </div>
              </div>
            )}
            <input id="banner-upload" type="file" className="hidden" accept="image/*" disabled={isUploading} onChange={handleFileUpload} />
          </div>

          <div className="p-8">
            <Textarea
              placeholder="Start typing your newsletter content..."
              className="min-h-[400px] text-base leading-relaxed border-none bg-transparent px-0 focus-visible:ring-0 shadow-none resize-y placeholder:text-muted-foreground/40"
              {...form.register('content')}
            />
            {form.formState.errors.content && <p className="text-sm text-destructive">{form.formState.errors.content.message}</p>}
          </div>
        </div>

        <div className="bg-muted/10 p-6 rounded-2xl border border-border/50 max-w-sm">
          <Label>Schedule Delivery (Optional)</Label>
          <Input 
            type="datetime-local" 
            className="bg-background mt-2" 
            {...form.register('scheduledFor')}
          />
          <p className="text-xs text-muted-foreground mt-2">Leave empty to keep as draft or send immediately later.</p>
        </div>
      </form>
    </div>
  );
}
