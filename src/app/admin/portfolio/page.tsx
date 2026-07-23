'use client';

import { useState, useEffect } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { toast } from 'sonner';
import { Plus, Edit, Trash2, Link as LinkIcon, Image as ImageIcon } from 'lucide-react';

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
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
  CardFooter,
} from '@/components/ui/card';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';

const portfolioSchema = z.object({
  id: z.string().optional(),
  title: z.string().min(3, 'Title must be at least 3 characters'),
  client: z.string().min(2, 'Client name is required'),
  category: z.string().min(1, 'Category is required'),
  websiteUrl: z.string().url('Must be a valid URL').optional().or(z.literal('')),
  description: z.string().min(20, 'Description must be at least 20 characters'),
  gallery: z.any().optional(), // Mock file input for multiple images
});

type PortfolioFormValues = z.infer<typeof portfolioSchema>;

interface DBPortfolioItem {
  id: string;
  title: string;
  client: string;
  category: string;
  websiteUrl: string | null;
  description: string;
  gallery: string | null;
}

export default function PortfolioPage() {
  const [portfolioItems, setPortfolioItems] = useState<PortfolioFormValues[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [galleryPreviews, setGalleryPreviews] = useState<string[]>([]);

  const form = useForm<PortfolioFormValues>({
    resolver: zodResolver(portfolioSchema),
    defaultValues: {
      title: '',
      client: '',
      category: '',
      websiteUrl: '',
      description: '',
      gallery: [],
    },
  });

  const fetchPortfolio = async () => {
    setIsLoading(true);
    try {
      const response = await fetch('/api/admin/portfolio');
      const res = await response.json();
      if (res.success) {
        // Map database comma-separated gallery back to array for frontend
        const items = res.data.map((item: DBPortfolioItem) => ({
          ...item,
          gallery: item.gallery ? item.gallery.split(',') : [],
        }));
        setPortfolioItems(items);
      } else {
        toast.error(res.message || 'Failed to fetch portfolio.');
      }
    } catch (error) {
      console.error('Error fetching portfolio:', error);
      toast.error('Failed to connect to portfolio API.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchPortfolio();
    }, 0);
    return () => clearTimeout(timer);
  }, []);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setIsUploading(true);
    const toastId = toast.loading(`Uploading ${files.length} image(s)...`);

    try {
      const uploadPromises = Array.from(files).map(async (file) => {
        // Size limit: 5MB
        if (file.size > 5 * 1024 * 1024) {
          toast.error(`File "${file.name}" exceeds the 5MB limit and was skipped.`);
          return null;
        }

        const formData = new FormData();
        formData.append('file', file);

        try {
          const response = await fetch('/api/upload?folder=portfolio', {
            method: 'POST',
            body: formData,
          });

          const result = await response.json();
          if (result.success && result.url) {
            return result.url;
          } else {
            toast.error(`Failed to upload "${file.name}": ${result.message || 'unknown error'}`);
            return null;
          }
        } catch (err) {
          console.error(`Error uploading file ${file.name}:`, err);
          toast.error(`Error uploading "${file.name}".`);
          return null;
        }
      });

      const results = await Promise.all(uploadPromises);
      const uploadedUrls = results.filter((url): url is string => url !== null);

      if (uploadedUrls.length > 0) {
        const updatedGallery = [...galleryPreviews, ...uploadedUrls];
        setGalleryPreviews(updatedGallery);
        form.setValue('gallery', updatedGallery);
        toast.success(`Successfully uploaded ${uploadedUrls.length} image(s)!`, { id: toastId });
      } else {
        toast.error('No images were successfully uploaded.', { id: toastId });
      }
    } catch (error) {
      console.error('Error uploading gallery files:', error);
      toast.error('An error occurred during gallery upload.', { id: toastId });
    } finally {
      setIsUploading(false);
    }
  };

  const handleRemoveImage = (indexToRemove: number) => {
    const updatedGallery = galleryPreviews.filter((_, idx) => idx !== indexToRemove);
    setGalleryPreviews(updatedGallery);
    form.setValue('gallery', updatedGallery);
  };

  const onSubmit = async (data: PortfolioFormValues) => {
    const toastId = toast.loading(
      editingId ? 'Updating portfolio item...' : 'Creating portfolio item...'
    );
    try {
      const url = editingId ? `/api/admin/portfolio/${editingId}` : '/api/admin/portfolio';
      const method = editingId ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: data.title,
          client: data.client,
          category: data.category,
          websiteUrl: data.websiteUrl || null,
          description: data.description,
          gallery: galleryPreviews.join(','), // Save array as comma-separated string in DB
        }),
      });
      const res = await response.json();
      if (res.success) {
        toast.success(res.message, { id: toastId });
        setIsDialogOpen(false);
        form.reset();
        setGalleryPreviews([]);
        setEditingId(null);
        fetchPortfolio();
      } else {
        toast.error(res.message || 'Action failed.', { id: toastId });
      }
    } catch (error) {
      console.error('Error saving portfolio item:', error);
      toast.error('Failed to save portfolio item.', { id: toastId });
    }
  };

  const handleEdit = (item: PortfolioFormValues) => {
    setEditingId(item.id!);
    form.reset({
      title: item.title,
      client: item.client,
      category: item.category,
      websiteUrl: item.websiteUrl || '',
      description: item.description,
    });

    let existingGallery: string[] = [];
    if (Array.isArray(item.gallery)) {
      existingGallery = item.gallery;
    } else if (typeof item.gallery === 'string' && item.gallery) {
      existingGallery = (item.gallery as string).split(',');
    }
    setGalleryPreviews(existingGallery);
    setIsDialogOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (confirm('Are you sure you want to delete this portfolio item?')) {
      const toastId = toast.loading('Deleting portfolio item...');
      try {
        const response = await fetch(`/api/admin/portfolio/${id}`, {
          method: 'DELETE',
        });
        const res = await response.json();
        if (res.success) {
          toast.success(res.message, { id: toastId });
          fetchPortfolio();
        } else {
          toast.error(res.message || 'Failed to delete portfolio item.', { id: toastId });
        }
      } catch (error) {
        console.error('Error deleting portfolio item:', error);
        toast.error('An error occurred.', { id: toastId });
      }
    }
  };

  const handleOpenNew = () => {
    setEditingId(null);
    form.reset({
      title: '',
      client: '',
      category: '',
      websiteUrl: '',
      description: '',
      gallery: [],
    });
    setGalleryPreviews([]);
  };

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Portfolio & Case Studies</h2>
          <p className="text-muted-foreground mt-1">
            Showcase your best work and client success stories.
          </p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger render={<Button onClick={handleOpenNew} className="shadow-sm" />}>
            <Plus className="mr-2 h-4 w-4" /> Add Case Study
          </DialogTrigger>
          <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>{editingId ? 'Edit Case Study' : 'Add New Case Study'}</DialogTitle>
              <DialogDescription>
                Provide details about the project, client, and upload gallery images.
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5 py-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div className="space-y-2">
                  <Label htmlFor="title">Project Title</Label>
                  <Input
                    id="title"
                    placeholder="e.g., E-Commerce Redesign"
                    {...form.register('title')}
                  />
                  {form.formState.errors.title && (
                    <p className="text-sm text-destructive">
                      {form.formState.errors.title.message}
                    </p>
                  )}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="client">Client Name</Label>
                  <Input id="client" placeholder="e.g., Acme Corp" {...form.register('client')} />
                  {form.formState.errors.client && (
                    <p className="text-sm text-destructive">
                      {form.formState.errors.client.message}
                    </p>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div className="space-y-2">
                  <Label htmlFor="category">Category</Label>
                  <Controller
                    control={form.control}
                    name="category"
                    render={({ field }) => (
                      <Select onValueChange={field.onChange} value={field.value}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select a category" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Web Design">Web Design</SelectItem>
                          <SelectItem value="App Development">App Development</SelectItem>
                          <SelectItem value="Branding">Branding</SelectItem>
                          <SelectItem value="Marketing">Marketing</SelectItem>
                        </SelectContent>
                      </Select>
                    )}
                  />
                  {form.formState.errors.category && (
                    <p className="text-sm text-destructive">
                      {form.formState.errors.category.message}
                    </p>
                  )}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="websiteUrl">Live URL (Optional)</Label>
                  <Input
                    id="websiteUrl"
                    placeholder="https://..."
                    {...form.register('websiteUrl')}
                  />
                  {form.formState.errors.websiteUrl && (
                    <p className="text-sm text-destructive">
                      {form.formState.errors.websiteUrl.message}
                    </p>
                  )}
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="gallery">Image Gallery</Label>

                {/* Previews grid */}
                {galleryPreviews.length > 0 && (
                  <div className="grid grid-cols-3 gap-3 mb-3">
                    {galleryPreviews.map((url, idx) => (
                      <div
                        key={idx}
                        className="relative aspect-video rounded-lg overflow-hidden border"
                      >
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={url}
                          alt={`Gallery image ${idx + 1}`}
                          className="w-full h-full object-cover"
                        />
                        <button
                          type="button"
                          className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 transition-colors"
                          onClick={() => handleRemoveImage(idx)}
                        >
                          <Trash2 className="h-3 w-3" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}

                <div className="border-2 border-dashed rounded-lg p-6 flex flex-col items-center justify-center text-muted-foreground hover:bg-muted/50 transition-colors">
                  <ImageIcon className="h-8 w-8 mb-2 opacity-50" />
                  <p className="text-sm font-medium">Click to upload images</p>
                  <p className="text-xs opacity-70">PNG, JPG or WEBP (Max 5MB each)</p>
                  <Input
                    id="gallery"
                    type="file"
                    multiple
                    className="hidden"
                    accept="image/*"
                    disabled={isUploading}
                    onChange={handleFileUpload}
                  />
                  <Button
                    type="button"
                    variant="secondary"
                    size="sm"
                    className="mt-4"
                    disabled={isUploading}
                    onClick={() => document.getElementById('gallery')?.click()}
                  >
                    {isUploading ? 'Uploading...' : 'Select Files'}
                  </Button>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Case Study Description</Label>
                <Textarea
                  id="description"
                  placeholder="Describe the challenge, solution, and results..."
                  className="min-h-[150px]"
                  {...form.register('description')}
                />
                {form.formState.errors.description && (
                  <p className="text-sm text-destructive">
                    {form.formState.errors.description.message}
                  </p>
                )}
              </div>
              <DialogFooter className="pt-4 border-t">
                <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit">{editingId ? 'Update Case Study' : 'Save Case Study'}</Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3].map((i) => (
            <Card
              key={i}
              className="animate-pulse border-border/40 bg-card/30 flex flex-col p-6 space-y-4"
            >
              <div className="aspect-video bg-muted rounded-lg" />
              <div className="h-4 w-32 bg-muted rounded" />
              <div className="h-3.5 w-24 bg-muted rounded" />
              <div className="h-3.5 w-full bg-muted rounded" />
              <div className="h-3 w-16 bg-muted rounded" />
            </Card>
          ))}
        </div>
      ) : portfolioItems.length === 0 ? (
        <Card className="flex flex-col items-center justify-center py-12 text-center shadow-sm">
          <ImageIcon className="h-12 w-12 text-muted-foreground opacity-20 mb-4" />
          <h3 className="text-lg font-medium">No portfolio items</h3>
          <p className="text-muted-foreground mt-1 max-w-sm">
            You haven&apos;t added any case studies yet. Click the button above to get started.
          </p>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {portfolioItems.map((item) => (
            <Card
              key={item.id}
              className="overflow-hidden group flex flex-col shadow-sm hover:shadow-md transition-shadow"
            >
              {/* Mock Image Placeholder */}
              <div className="aspect-video bg-muted/50 flex items-center justify-center relative overflow-hidden">
                <ImageIcon className="h-10 w-10 text-muted-foreground/30" />
                <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                  <Button variant="secondary" size="sm" onClick={() => handleEdit(item)}>
                    <Edit className="h-4 w-4 mr-2" /> Edit
                  </Button>
                  <Button variant="destructive" size="sm" onClick={() => handleDelete(item.id!)}>
                    <Trash2 className="h-4 w-4 mr-2" /> Delete
                  </Button>
                </div>
              </div>
              <CardHeader className="pb-3 flex-grow">
                <div className="flex justify-between items-start mb-2">
                  <Badge variant="outline" className="bg-primary/5">
                    {item.category}
                  </Badge>
                </div>
                <CardTitle className="line-clamp-1">{item.title}</CardTitle>
                <CardDescription className="font-medium text-foreground/80">
                  Client: {item.client}
                </CardDescription>
              </CardHeader>
              <CardContent className="pb-4 flex-grow">
                <p className="text-sm text-muted-foreground line-clamp-3">{item.description}</p>
              </CardContent>
              {item.websiteUrl && (
                <CardFooter className="pt-0 pb-4">
                  <a
                    href={item.websiteUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm text-primary hover:underline flex items-center"
                  >
                    <LinkIcon className="h-3 w-3 mr-1" /> Visit Live Site
                  </a>
                </CardFooter>
              )}
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
