'use client';

import React, { useState, useEffect } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { toast } from 'sonner';
import {
  Send,
  Clock,
  Sparkles,
  Image as ImageIcon,
  Trash2,
  Eye,
  CheckCircle2,
  Smartphone,
  Monitor,
  Users,
  Mail,
  ArrowRight,
  Layers,
  FileText,
  AlertCircle,
} from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import { logger } from '@/lib/logger';

const campaignSchema = z.object({
  subject: z.string().min(5, 'Subject line must be at least 5 characters'),
  preheader: z.string().optional(),
  bannerImage: z.string().optional(),
  content: z.string().min(20, 'Content must be at least 20 characters'),
  ctaText: z.string().optional(),
  ctaUrl: z.string().optional(),
  targetAudience: z.string().default('ALL_SUBSCRIBERS'),
  status: z.string().default('DRAFT'),
  scheduledFor: z.string().optional(),
});

type CampaignFormValues = z.infer<typeof campaignSchema>;

const QUICK_TEMPLATES = [
  {
    title: 'Product Innovation Update',
    subject: 'Introducing Next-Gen Enterprise AI & Cloud Capabilities 🚀',
    preheader: 'Explore what is new in InGrowwth Innovations technology stack this month.',
    content: `Hello {{name}},\n\nWe are excited to share key engineering breakthroughs and platform enhancements we have rolled out for our global enterprise partners.\n\nFrom automated AI workflow orchestration to 99.99% high-availability cloud deployments, our latest architectures are designed to deliver measurable ROI at scale.\n\nExplore our recent case studies and see how your engineering teams can leverage these innovations today.`,
    ctaText: 'Explore Recent Breakthroughs',
    ctaUrl: 'https://ingrowwthinnovations.com/portfolio',
  },
  {
    title: 'Case Study Spotlight',
    subject: 'How We Engineered 4x Scalability for an Enterprise Partner 📈',
    preheader: 'A deep-dive technical breakdown of cloud migration and database optimization.',
    content: `Hello {{name}},\n\nScaling mission-critical workloads requires thoughtful architecture and zero-compromise security.\n\nIn our newest published case study, our team details how we redesigned a distributed microservices ecosystem, resulting in a 4x throughput increase and 38% infrastructure cost reduction.\n\nRead the full technical analysis and architectural blueprint in our portfolio section.`,
    ctaText: 'Read Full Case Study',
    ctaUrl: 'https://ingrowwthinnovations.com/portfolio',
  },
  {
    title: 'Quarterly Executive Dispatch',
    subject: 'InGrowwth Innovations Quarterly Strategic Memo 💼',
    preheader: 'Insights on enterprise AI adoption, microservice patterns, and tech hiring.',
    content: `Hello {{name}},\n\nAs organizations navigate digital transformations, staying ahead of cloud ergonomics and intelligent automation is essential.\n\nIn this quarterly dispatch, our leadership highlights the top architectural patterns winning in 2026, alongside practical guidelines for tech leaders.\n\nHave a project or modernization initiative? Reply directly to this email to connect with our principal engineering team.`,
    ctaText: 'Schedule Technical Consultation',
    ctaUrl: 'https://ingrowwthinnovations.com/contact?type=quote',
  },
];

interface NewsletterCampaignModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  initialData?: any;
}

export function NewsletterCampaignModal({
  isOpen,
  onClose,
  onSuccess,
  initialData,
}: NewsletterCampaignModalProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [previewDevice, setPreviewDevice] = useState<'desktop' | 'mobile'>('desktop');
  const [bannerPreview, setBannerPreview] = useState<string | null>(null);

  const form = useForm<CampaignFormValues>({
    resolver: zodResolver(campaignSchema) as any,
    defaultValues: {
      subject: '',
      preheader: '',
      bannerImage: '',
      content: '',
      ctaText: 'Discover More',
      ctaUrl: 'https://ingrowwthinnovations.com/portfolio',
      targetAudience: 'ALL_SUBSCRIBERS',
      status: 'DRAFT',
      scheduledFor: '',
    },
  });

  useEffect(() => {
    if (isOpen) {
      if (initialData) {
        form.reset({
          subject: initialData.subject || '',
          preheader: initialData.preheader || '',
          bannerImage: initialData.bannerImage || '',
          content: initialData.content || '',
          ctaText: initialData.ctaText || 'Discover More',
          ctaUrl: initialData.ctaUrl || 'https://ingrowwthinnovations.com/portfolio',
          targetAudience: initialData.targetAudience || 'ALL_SUBSCRIBERS',
          status: initialData.status || 'DRAFT',
          scheduledFor: initialData.scheduledFor
            ? new Date(initialData.scheduledFor).toISOString().slice(0, 16)
            : '',
        });
        setBannerPreview(initialData.bannerImage || null);
      } else {
        form.reset({
          subject: '',
          preheader: '',
          bannerImage: '',
          content: '',
          ctaText: 'Discover More',
          ctaUrl: 'https://ingrowwthinnovations.com/portfolio',
          targetAudience: 'ALL_SUBSCRIBERS',
          status: 'DRAFT',
          scheduledFor: '',
        });
        setBannerPreview(null);
      }
    }
  }, [initialData, isOpen, form]);

  const watchedSubject = form.watch('subject');
  const watchedPreheader = form.watch('preheader');
  const watchedContent = form.watch('content');
  const watchedCtaText = form.watch('ctaText');
  const watchedCtaUrl = form.watch('ctaUrl');

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    const file = files[0];
    if (file.size > 5 * 1024 * 1024) {
      toast.error('Banner size must be under 5MB.');
      return;
    }

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
        toast.success('Hero banner uploaded!', { id: toastId });
      } else {
        toast.error('Upload failed.', { id: toastId });
      }
    } catch (err) {
      logger.error('Upload error:', err);
      toast.error('An error occurred during upload.', { id: toastId });
    } finally {
      setIsUploading(false);
    }
  };

  const applyTemplate = (tmpl: typeof QUICK_TEMPLATES[0]) => {
    form.setValue('subject', tmpl.subject, { shouldValidate: true });
    form.setValue('preheader', tmpl.preheader);
    form.setValue('content', tmpl.content, { shouldValidate: true });
    form.setValue('ctaText', tmpl.ctaText);
    form.setValue('ctaUrl', tmpl.ctaUrl);
    toast.success(`Template "${tmpl.title}" applied!`);
  };

  const onSubmit = async (data: CampaignFormValues, actionType: 'SAVE' | 'SEND_NOW') => {
    setIsSubmitting(true);
    const toastId = toast.loading(
      actionType === 'SEND_NOW' ? 'Queuing broadcast campaign...' : 'Saving campaign...'
    );

    try {
      let formattedContent = data.content;
      if (data.ctaText && data.ctaUrl && !formattedContent.includes(data.ctaUrl)) {
        formattedContent += `\n\n[${data.ctaText}](${data.ctaUrl})`;
      }

      const payload = {
        subject: data.subject,
        bannerImage: data.bannerImage || null,
        content: formattedContent,
        status: actionType === 'SEND_NOW' ? 'SENT' : data.scheduledFor ? 'SCHEDULED' : 'DRAFT',
        scheduledFor: data.scheduledFor || null,
      };

      const url = initialData?.id
        ? `/api/admin/newsletter/campaigns/${initialData.id}`
        : '/api/admin/newsletter/campaigns';
      const method = initialData?.id ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const res = await response.json();
      if (res.success) {
        // If user chose SEND_NOW, trigger the send endpoint
        if (actionType === 'SEND_NOW') {
          const campaignId = initialData?.id || res.data?.id;
          if (campaignId) {
            await fetch(`/api/admin/newsletter/campaigns/${campaignId}/send`, { method: 'POST' });
          }
        }

        toast.success(res.message || 'Campaign processed successfully!', { id: toastId });
        onSuccess();
        onClose();
      } else {
        toast.error(res.message || 'Operation failed.', { id: toastId });
      }
    } catch (err) {
      logger.error('Error saving campaign:', err);
      toast.error('Failed to save newsletter campaign.', { id: toastId });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-[95vw] md:max-w-5xl p-0 bg-background/95 backdrop-blur-2xl border border-white/10 shadow-2xl rounded-3xl overflow-hidden flex flex-col max-h-[92vh]">
        {/* Header */}
        <DialogHeader className="px-6 py-4 border-b border-border/40 sticky top-0 bg-background/90 backdrop-blur-md z-10 flex flex-row items-center justify-between">
          <div className="flex items-center justify-between w-full pr-8">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400">
                <Mail className="w-5 h-5" />
              </div>
              <div>
                <DialogTitle className="text-xl font-bold tracking-tight">
                  {initialData?.id ? 'Edit Email Campaign' : 'Create Broadcast Campaign'}
                </DialogTitle>
                <DialogDescription className="text-xs">
                  Design, preview, and dispatch branded email marketing campaigns
                </DialogDescription>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={form.handleSubmit((d) => onSubmit(d, 'SAVE'))}
                disabled={isSubmitting}
                className="rounded-full text-xs font-semibold cursor-pointer border-white/10"
              >
                Save Draft
              </Button>
              <Button
                size="sm"
                onClick={form.handleSubmit((d) => onSubmit(d, 'SEND_NOW'))}
                disabled={isSubmitting}
                className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white rounded-full text-xs font-semibold px-4 shadow-lg shadow-indigo-500/25 cursor-pointer"
              >
                <Send className="w-3.5 h-3.5 mr-1.5" />
                {isSubmitting ? 'Dispatching...' : 'Launch Broadcast'}
              </Button>
            </div>
          </div>
        </DialogHeader>

        {/* Modal Body with Multi-tab Structure */}
        <ScrollArea className="flex-1 px-6 py-6 overflow-y-auto">
          <Tabs defaultValue="editor" className="w-full">
            <TabsList className="grid w-full grid-cols-2 mb-6 h-auto p-1.5 bg-slate-900/90 dark:bg-zinc-900/90 rounded-2xl border border-white/10 shadow-inner">
              <TabsTrigger value="editor" className="py-2.5 text-xs font-semibold">
                <FileText className="w-3.5 h-3.5 mr-2" /> 1. Compose Campaign
              </TabsTrigger>
              <TabsTrigger value="preview" className="py-2.5 text-xs font-semibold">
                <Eye className="w-3.5 h-3.5 mr-2" /> 2. Live Inbox Simulator
              </TabsTrigger>
            </TabsList>

            {/* TAB 1: Editor Form */}
            <TabsContent value="editor" className="space-y-6">
              {/* Quick Starter Templates */}
              <div className="space-y-2">
                <Label className="text-xs font-semibold text-muted-foreground flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
                  Quick Starter Templates (1-Click Fill)
                </Label>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  {QUICK_TEMPLATES.map((tmpl) => (
                    <button
                      key={tmpl.title}
                      type="button"
                      onClick={() => applyTemplate(tmpl)}
                      className="p-3 rounded-2xl bg-muted/30 border border-white/5 hover:border-indigo-500/30 hover:bg-muted/50 text-left transition-all group cursor-pointer"
                    >
                      <div className="text-xs font-bold text-foreground group-hover:text-indigo-400 transition-colors">
                        {tmpl.title}
                      </div>
                      <div className="text-[11px] text-muted-foreground line-clamp-1 mt-0.5">
                        {tmpl.subject}
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Subject Line & Preheader */}
              <div className="space-y-4 p-5 rounded-3xl bg-card/40 border border-border/50">
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="subject" className="text-xs font-semibold">
                      Subject Line *
                    </Label>
                    <span className="text-[11px] font-mono text-muted-foreground">
                      {watchedSubject.length} / 80 characters
                    </span>
                  </div>
                  <Input
                    id="subject"
                    placeholder="e.g. Exciting Engineering Updates from InGrowwth Innovations 🚀"
                    className="bg-background text-sm font-semibold h-11 rounded-xl"
                    {...form.register('subject')}
                  />
                  {form.formState.errors.subject && (
                    <p className="text-xs text-destructive">
                      {form.formState.errors.subject.message}
                    </p>
                  )}
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor="preheader" className="text-xs font-semibold">
                    Preview Snippet / Preheader (Optional)
                  </Label>
                  <Input
                    id="preheader"
                    placeholder="Shown beside or below the subject line in Gmail / Apple Mail / Outlook"
                    className="bg-background text-xs h-9 rounded-xl"
                    {...form.register('preheader')}
                  />
                </div>
              </div>

              {/* Hero Banner Upload */}
              <div className="space-y-2 p-5 rounded-3xl bg-card/40 border border-border/50">
                <Label className="text-xs font-semibold">Campaign Hero Banner Image</Label>
                <div className="flex items-center gap-4">
                  {bannerPreview ? (
                    <div className="relative w-40 h-24 rounded-2xl overflow-hidden border border-white/10 group">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={bannerPreview}
                        alt="Hero Preview"
                        className="w-full h-full object-cover"
                      />
                      <button
                        type="button"
                        onClick={() => {
                          form.setValue('bannerImage', '');
                          setBannerPreview(null);
                        }}
                        className="absolute inset-0 bg-black/60 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity text-destructive text-xs font-bold"
                      >
                        <Trash2 className="w-4 h-4 mr-1" /> Remove
                      </button>
                    </div>
                  ) : (
                    <div className="w-40 h-24 rounded-2xl border border-dashed border-border/60 flex flex-col items-center justify-center text-muted-foreground text-xs p-2 text-center">
                      <ImageIcon className="w-6 h-6 mb-1 text-muted-foreground/50" />
                      <span>No Banner</span>
                    </div>
                  )}

                  <div className="space-y-2 flex-1">
                    <Input
                      type="file"
                      accept="image/*"
                      disabled={isUploading}
                      onChange={handleFileUpload}
                      className="bg-background text-xs"
                    />
                    <p className="text-[11px] text-muted-foreground">
                      Recommended 1200x630px JPG or PNG. Max 5MB.
                    </p>
                  </div>
                </div>
              </div>

              {/* Email Content Body */}
              <div className="space-y-2 p-5 rounded-3xl bg-card/40 border border-border/50">
                <div className="flex items-center justify-between">
                  <Label htmlFor="content" className="text-xs font-semibold">
                    Email Body Content *
                  </Label>
                  <span className="text-[11px] text-muted-foreground">
                    Supports <code className="text-indigo-400">{'{{name}}'}</code> merge tag
                  </span>
                </div>
                <Textarea
                  id="content"
                  placeholder="Compose your newsletter announcement or technical breakdown..."
                  className="bg-background min-h-[220px] text-sm leading-relaxed rounded-xl font-normal"
                  {...form.register('content')}
                />
                {form.formState.errors.content && (
                  <p className="text-xs text-destructive">{form.formState.errors.content.message}</p>
                )}
              </div>

              {/* Call-to-Action Builder */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-5 rounded-3xl bg-card/40 border border-border/50">
                <div className="space-y-1.5">
                  <Label htmlFor="ctaText" className="text-xs font-semibold">
                    CTA Button Text
                  </Label>
                  <Input
                    id="ctaText"
                    placeholder="e.g. Explore Portfolio"
                    className="bg-background text-xs h-9 rounded-xl"
                    {...form.register('ctaText')}
                  />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="ctaUrl" className="text-xs font-semibold">
                    CTA Button Destination URL
                  </Label>
                  <Input
                    id="ctaUrl"
                    placeholder="https://ingrowwthinnovations.com/portfolio"
                    className="bg-background text-xs h-9 rounded-xl font-mono"
                    {...form.register('ctaUrl')}
                  />
                </div>
              </div>

              {/* Target Audience & Scheduled Delivery */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-5 rounded-3xl bg-card/40 border border-border/50">
                <div className="space-y-1.5">
                  <Label className="text-xs font-semibold">Target Audience</Label>
                  <Controller
                    control={form.control}
                    name="targetAudience"
                    render={({ field }) => (
                      <Select onValueChange={field.onChange} value={field.value}>
                        <SelectTrigger className="bg-background text-xs h-9 rounded-xl">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent className="bg-slate-950/95 border-white/10 backdrop-blur-xl">
                          <SelectItem value="ALL_SUBSCRIBERS" className="text-xs font-medium">
                            All Active Newsletter Subscribers
                          </SelectItem>
                          <SelectItem value="LEADS_ONLY" className="text-xs font-medium">
                            Prospective Leads & Inbound Quotes
                          </SelectItem>
                          <SelectItem value="ENTERPRISE" className="text-xs font-medium">
                            Enterprise Clients & Partners
                          </SelectItem>
                        </SelectContent>
                      </Select>
                    )}
                  />
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor="scheduledFor" className="text-xs font-semibold">
                    Schedule Delivery Date & Time (Optional)
                  </Label>
                  <Input
                    id="scheduledFor"
                    type="datetime-local"
                    className="bg-background text-xs h-9 rounded-xl"
                    {...form.register('scheduledFor')}
                  />
                  <p className="text-[10px] text-muted-foreground">
                    Leave empty to save as Draft or launch immediately.
                  </p>
                </div>
              </div>
            </TabsContent>

            {/* TAB 2: Live Simulator */}
            <TabsContent value="preview" className="space-y-4">
              <div className="flex items-center justify-between pb-2 border-b border-border/40">
                <div className="flex items-center gap-2">
                  <Badge variant="outline" className="text-xs font-mono bg-indigo-500/10 text-indigo-400 border-indigo-500/20">
                    Live Client Simulator
                  </Badge>
                  <span className="text-xs text-muted-foreground">
                    Subject: &quot;{watchedSubject || 'Your Subject Line'}&quot;
                  </span>
                </div>

                <div className="flex items-center bg-muted/40 p-1 rounded-xl border border-white/5">
                  <button
                    type="button"
                    onClick={() => setPreviewDevice('desktop')}
                    className={`px-3 py-1 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all ${
                      previewDevice === 'desktop'
                        ? 'bg-foreground text-background shadow-xs'
                        : 'text-muted-foreground hover:text-foreground'
                    }`}
                  >
                    <Monitor className="w-3.5 h-3.5" /> Desktop
                  </button>
                  <button
                    type="button"
                    onClick={() => setPreviewDevice('mobile')}
                    className={`px-3 py-1 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all ${
                      previewDevice === 'mobile'
                        ? 'bg-foreground text-background shadow-xs'
                        : 'text-muted-foreground hover:text-foreground'
                    }`}
                  >
                    <Smartphone className="w-3.5 h-3.5" /> Mobile
                  </button>
                </div>
              </div>

              {/* Email Envelope Container */}
              <div className="flex justify-center p-4">
                <div
                  className={`bg-zinc-950 border border-white/10 rounded-3xl overflow-hidden shadow-2xl transition-all duration-300 ${
                    previewDevice === 'desktop' ? 'w-full max-w-2xl' : 'w-[360px]'
                  }`}
                >
                  {/* Email Header Bar */}
                  <div className="bg-zinc-900/90 border-b border-white/10 p-4 space-y-1 text-xs">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-white">InGrowwth Innovations</span>
                      <span className="text-zinc-400 font-mono text-[10px]">Just now</span>
                    </div>
                    <div className="text-zinc-300 font-semibold truncate">
                      {watchedSubject || 'No Subject Provided'}
                    </div>
                    {watchedPreheader && (
                      <div className="text-zinc-500 text-[11px] truncate">
                        {watchedPreheader}
                      </div>
                    )}
                  </div>

                  {/* Email Content Canvas */}
                  <div className="p-6 space-y-6 bg-zinc-950 text-zinc-200">
                    {/* Brand Banner */}
                    <div className="flex items-center gap-2 pb-4 border-b border-white/10">
                      <div className="w-7 h-7 rounded-lg bg-gradient-to-tr from-indigo-500 to-purple-600 flex items-center justify-center font-bold text-white text-xs">
                        IG
                      </div>
                      <span className="font-bold text-sm text-white">InGrowwth Innovations</span>
                    </div>

                    {/* Banner Image */}
                    {bannerPreview && (
                      <div className="relative aspect-[16/9] w-full rounded-2xl overflow-hidden border border-white/10">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={bannerPreview}
                          alt="Banner Preview"
                          className="w-full h-full object-cover"
                        />
                      </div>
                    )}

                    {/* Body Text */}
                    <div className="text-sm leading-relaxed space-y-4 whitespace-pre-wrap text-zinc-300">
                      {watchedContent
                        ? watchedContent.replace('{{name}}', 'Alex')
                        : 'Your email content preview will appear here as you type in the editor.'}
                    </div>

                    {/* CTA Button */}
                    {watchedCtaText && (
                      <div className="pt-2 text-center">
                        <a
                          href={watchedCtaUrl || '#'}
                          target="_blank"
                          rel="noreferrer"
                          className="inline-flex items-center justify-center px-6 py-3 rounded-full bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-bold text-xs shadow-lg shadow-indigo-500/25 hover:opacity-90"
                        >
                          {watchedCtaText}
                          <ArrowRight className="w-3.5 h-3.5 ml-1.5" />
                        </a>
                      </div>
                    )}

                    {/* Footer */}
                    <div className="pt-6 border-t border-white/10 text-center text-[10px] text-zinc-500 space-y-1">
                      <p>© {new Date().getFullYear()} InGrowwth Innovations. All rights reserved.</p>
                      <p>You received this email because you subscribed to our engineering updates.</p>
                      <p className="text-zinc-400 underline cursor-pointer">Unsubscribe</p>
                    </div>
                  </div>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}
