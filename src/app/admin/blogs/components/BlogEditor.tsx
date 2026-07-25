'use client';

import React, { useState, useEffect } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { toast } from 'sonner';
import {
  Image as ImageIcon,
  Trash2,
  Globe,
  Settings,
  Sparkles,
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

const blogSchema = z.object({
  title: z.string().min(5, 'Title must be at least 5 characters'),
  slug: z.string().optional(),
  shortDescription: z.string().optional(),
  category: z.string().min(1, 'Category is required'),
  status: z.enum(['Draft', 'Published']),
  tags: z.string().min(2, 'At least one tag is required'),
  thumbnail: z.any().optional(),
  content: z.string().min(50, 'Content must be at least 50 characters'),
  seoTitle: z.string().optional(),
  seoDescription: z.string().optional(),
  readTime: z.string().optional(),
  authorName: z.string().optional(),
  publishDate: z.string().optional(),
});

type BlogFormValues = z.infer<typeof blogSchema>;

interface BlogEditorProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  initialData?: any;
}

export function BlogEditor({ isOpen, onClose, onSuccess, initialData }: BlogEditorProps) {
  const [isUploading, setIsUploading] = useState(false);
  const [thumbnailPreview, setThumbnailPreview] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<BlogFormValues>({
    resolver: zodResolver(blogSchema),
    defaultValues: {
      title: '',
      slug: '',
      shortDescription: '',
      category: '',
      status: 'Draft',
      tags: '',
      content: '',
      thumbnail: '',
      seoTitle: '',
      seoDescription: '',
      readTime: '',
      authorName: '',
      publishDate: '',
    },
  });

  // Reset form when initialData changes or modal opens
  useEffect(() => {
    if (isOpen) {
      if (initialData) {
        form.reset({
          title: initialData.title || '',
          slug: initialData.slug || '',
          shortDescription: initialData.shortDescription || '',
          category: initialData.category || '',
          status: initialData.status || 'Draft',
          tags: initialData.tags || '',
          content: initialData.content || '',
          thumbnail: initialData.thumbnail || '',
          seoTitle: initialData.seoTitle || '',
          seoDescription: initialData.seoDescription || '',
          readTime: initialData.readTime?.toString() || '',
          authorName: initialData.authorName || '',
          publishDate: initialData.publishDate
            ? new Date(initialData.publishDate).toISOString().split('T')[0]
            : '',
        });
        setThumbnailPreview(initialData.thumbnail || null);
      } else {
        form.reset({
          title: '',
          slug: '',
          shortDescription: '',
          category: '',
          status: 'Draft',
          tags: '',
          content: '',
          thumbnail: '',
          seoTitle: '',
          seoDescription: '',
          readTime: '',
          authorName: '',
          publishDate: '',
        });
        setThumbnailPreview(null);
      }
    }
  }, [initialData, isOpen, form]);

  const title = form.watch('title');
  const content = form.watch('content');
  const seoTitle = form.watch('seoTitle');
  const seoDescription = form.watch('seoDescription');

  // Auto-generate slug and read time
  useEffect(() => {
    if (!initialData?.id && title) {
      const generatedSlug = title
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)+/g, '');
      form.setValue('slug', generatedSlug, { shouldValidate: true });
    }
  }, [title, initialData?.id, form]);

  useEffect(() => {
    if (content) {
      const words = content.trim().split(/\s+/).length;
      const readTime = Math.ceil(words / 200); // 200 WPM
      form.setValue('readTime', readTime.toString(), { shouldValidate: true });
    }
  }, [content, form]);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    const file = files[0];
    if (file.size > 5 * 1024 * 1024) {
      toast.error('File size exceeds the 5MB limit.');
      return;
    }

    const formData = new FormData();
    formData.append('file', file);

    setIsUploading(true);
    const toastId = toast.loading('Uploading cover image...');

    try {
      const response = await fetch('/api/upload?folder=blogs', {
        method: 'POST',
        body: formData,
      });

      const result = await response.json();
      if (result.success && result.url) {
        form.setValue('thumbnail', result.url);
        setThumbnailPreview(result.url);
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

  const onSubmit = async (data: BlogFormValues) => {
    setIsSubmitting(true);
    const toastId = toast.loading(
      initialData?.id ? 'Updating blog post...' : 'Publishing blog post...'
    );

    try {
      const url = initialData?.id ? `/api/admin/blogs/${initialData.id}` : '/api/admin/blogs';
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
      console.error('Error saving blog post:', error);
      toast.error('Failed to save blog post.', { id: toastId });
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
              <DialogTitle className="text-2xl font-bold tracking-tight">{initialData?.id ? 'Edit Post' : 'Write New Post'}</DialogTitle>
              <DialogDescription>
                {form.watch('status') === 'Draft' ? 'Draft saved locally' : 'Live on site'}
              </DialogDescription>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="outline" onClick={() => form.setValue('status', 'Draft')} type="button" size="sm">
                Save as Draft
              </Button>
              <Button
                onClick={form.handleSubmit(onSubmit)}
                disabled={isSubmitting}
                size="sm"
                className="bg-indigo-600 hover:bg-indigo-700 text-white shadow-md shadow-indigo-500/20"
              >
                {isSubmitting ? 'Saving...' : initialData?.id ? 'Update Post' : 'Publish'}
              </Button>
            </div>
          </div>
        </DialogHeader>

        <ScrollArea className="flex-1 px-6 py-6 overflow-y-auto">
          <form id="blog-form" onSubmit={form.handleSubmit(onSubmit)} className="grid grid-cols-1 lg:grid-cols-3 gap-8 pb-12">
            {/* Main Editor Section */}
            <div className="lg:col-span-2 space-y-8">
              <div className="space-y-4">
                <Input
                  placeholder="Post Title..."
                  className="text-4xl font-extrabold border-none bg-transparent px-0 focus-visible:ring-0 shadow-none placeholder:text-muted-foreground/50 h-auto"
                  {...form.register('title')}
                />
                {form.formState.errors.title && (
                  <p className="text-sm text-destructive">{form.formState.errors.title.message}</p>
                )}

                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Sparkles className="h-4 w-4 text-indigo-500" />
                  <span>/blog/</span>
                  <Input
                    placeholder="post-slug"
                    className="h-7 w-64 border-none bg-muted/50 focus-visible:ring-1 px-2 py-0 text-sm"
                    {...form.register('slug')}
                  />
                </div>
              </div>

              {/* Cover Image Upload */}
              <div className="relative group rounded-2xl border-2 border-dashed border-border/50 bg-muted/20 hover:bg-muted/40 transition-colors overflow-hidden flex flex-col items-center justify-center min-h-[250px]">
                {thumbnailPreview ? (
                  <>
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={thumbnailPreview}
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
                          form.setValue('thumbnail', '');
                          setThumbnailPreview(null);
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
                    <div className="h-14 w-14 rounded-full bg-indigo-500/10 flex items-center justify-center">
                      <ImageIcon className="h-6 w-6 text-indigo-500" />
                    </div>
                    <div>
                      <p className="font-semibold text-base">Add Cover Image</p>
                      <p className="text-xs text-muted-foreground mt-1">
                        Optimal size: 1200 x 630px. Max 5MB.
                      </p>
                    </div>
                    {isUploading && (
                      <p className="text-sm text-indigo-500 animate-pulse">Uploading...</p>
                    )}
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

              <div className="space-y-2">
                <Textarea
                  placeholder="Write your story..."
                  className="min-h-[400px] text-base leading-relaxed border-none bg-transparent px-0 focus-visible:ring-0 shadow-none resize-y placeholder:text-muted-foreground/40 font-serif"
                  {...form.register('content')}
                />
                {form.formState.errors.content && (
                  <p className="text-sm text-destructive">{form.formState.errors.content.message}</p>
                )}
              </div>
            </div>

            {/* Right Sidebar - Settings & Metadata */}
            <div className="space-y-6 border-l border-border/50 pl-6 h-full">
              <Tabs defaultValue="settings" className="w-full">
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="settings">
                    <Settings className="h-4 w-4 mr-2" /> Settings
                  </TabsTrigger>
                  <TabsTrigger value="seo">
                    <Globe className="h-4 w-4 mr-2" /> SEO
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="settings" className="space-y-6 mt-6">
                  <div className="space-y-2">
                    <Label>Status</Label>
                    <Controller
                      control={form.control}
                      name="status"
                      render={({ field }) => (
                        <Select onValueChange={field.onChange} value={field.value}>
                          <SelectTrigger className="w-full bg-muted/50 border-none">
                            <SelectValue placeholder="Select status" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="Draft">Draft</SelectItem>
                            <SelectItem value="Published">Published</SelectItem>
                          </SelectContent>
                        </Select>
                      )}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label>Category</Label>
                    <Controller
                      control={form.control}
                      name="category"
                      render={({ field }) => (
                        <Select onValueChange={field.onChange} value={field.value}>
                          <SelectTrigger className="w-full bg-muted/50 border-none">
                            <SelectValue placeholder="Select a category" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="Technology">Technology</SelectItem>
                            <SelectItem value="Marketing">Marketing</SelectItem>
                            <SelectItem value="Business">Business</SelectItem>
                            <SelectItem value="Design">Design</SelectItem>
                            <SelectItem value="AI">AI & Machine Learning</SelectItem>
                          </SelectContent>
                        </Select>
                      )}
                    />
                    {form.formState.errors.category && (
                      <p className="text-xs text-destructive">{form.formState.errors.category.message}</p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label>Tags (Comma separated)</Label>
                    <Input
                      placeholder="e.g. Nextjs, Tailwind, React"
                      className="bg-muted/50 border-none"
                      {...form.register('tags')}
                    />
                    {form.formState.errors.tags && (
                      <p className="text-xs text-destructive">{form.formState.errors.tags.message}</p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label>Author Name</Label>
                    <Input
                      placeholder="Jane Doe"
                      className="bg-muted/50 border-none"
                      {...form.register('authorName')}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label>Read Time (Mins)</Label>
                    <Input
                      type="number"
                      placeholder="Auto-calculated"
                      className="bg-muted/50 border-none"
                      {...form.register('readTime')}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label>Publish Date</Label>
                    <Input
                      type="date"
                      className="bg-muted/50 border-none"
                      {...form.register('publishDate')}
                    />
                  </div>
                </TabsContent>

                <TabsContent value="seo" className="space-y-6 mt-6">
                  <div className="rounded-xl border border-border/50 p-4 space-y-4 bg-muted/20">
                    <h3 className="font-medium text-sm flex items-center">
                      <Globe className="h-4 w-4 mr-2" /> Google Search Preview
                    </h3>
                    <div className="space-y-1">
                      <p className="text-xs text-muted-foreground truncate">
                        ingrowwth.com › blog › {form.watch('slug')}
                      </p>
                      <p className="text-sm font-semibold text-blue-600 dark:text-blue-400 leading-tight">
                        {seoTitle || title || 'Your SEO Title'}
                      </p>
                      <p className="text-xs text-muted-foreground line-clamp-2">
                        {seoDescription ||
                          'Provide a compelling SEO description to encourage users to click on your link in search results.'}
                      </p>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label>SEO Title</Label>
                    <Input
                      placeholder="Best Practices for Web Dev"
                      className="bg-muted/50 border-none"
                      {...form.register('seoTitle')}
                    />
                    <p className="text-[10px] text-muted-foreground text-right">
                      {seoTitle?.length || 0} / 60
                    </p>
                  </div>

                  <div className="space-y-2">
                    <Label>SEO Description</Label>
                    <Textarea
                      placeholder="Write a concise meta description..."
                      className="bg-muted/50 border-none resize-none h-24"
                      {...form.register('seoDescription')}
                    />
                    <p className="text-[10px] text-muted-foreground text-right">
                      {seoDescription?.length || 0} / 160
                    </p>
                  </div>

                  <div className="space-y-2">
                    <Label>Short Excerpt</Label>
                    <Textarea
                      placeholder="Brief summary for the blog list view..."
                      className="bg-muted/50 border-none resize-none h-24"
                      {...form.register('shortDescription')}
                    />
                  </div>
                </TabsContent>
              </Tabs>
            </div>
          </form>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}
