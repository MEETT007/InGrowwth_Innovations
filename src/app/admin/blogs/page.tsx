'use client';

import { useState, useEffect } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { toast } from 'sonner';
import { Plus, Edit, Trash2 } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';

const blogSchema = z.object({
  id: z.string().optional(),
  title: z.string().min(5, 'Title must be at least 5 characters'),
  category: z.string().min(1, 'Category is required'),
  status: z.enum(['Draft', 'Published']),
  tags: z.string().min(2, 'At least one tag is required'),
  thumbnail: z.any().optional(), // Mock file input
  content: z.string().min(50, 'Content must be at least 50 characters'),
});

type BlogFormValues = z.infer<typeof blogSchema>;

export default function BlogsPage() {
  const [blogs, setBlogs] = useState<BlogFormValues[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [thumbnailPreview, setThumbnailPreview] = useState<string | null>(null);

  const form = useForm<BlogFormValues>({
    resolver: zodResolver(blogSchema),
    defaultValues: {
      title: '',
      category: '',
      status: 'Draft',
      tags: '',
      content: '',
      thumbnail: '',
    },
  });

  const fetchBlogs = async () => {
    setIsLoading(true);
    try {
      const response = await fetch('/api/admin/blogs');
      const res = await response.json();
      if (res.success) {
        setBlogs(res.data);
      } else {
        toast.error(res.message || 'Failed to fetch blog posts.');
      }
    } catch (error) {
      console.error('Error fetching blogs:', error);
      toast.error('Failed to connect to blogs API.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchBlogs();
    }, 0);
    return () => clearTimeout(timer);
  }, []);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    const file = files[0];

    // Client side limit: 5MB
    if (file.size > 5 * 1024 * 1024) {
      toast.error('File size exceeds the 5MB limit.');
      return;
    }

    const formData = new FormData();
    formData.append('file', file);

    setIsUploading(true);
    const toastId = toast.loading('Uploading thumbnail image...');

    try {
      const response = await fetch('/api/upload?folder=blogs', {
        method: 'POST',
        body: formData,
      });

      const result = await response.json();
      if (result.success && result.url) {
        form.setValue('thumbnail', result.url);
        setThumbnailPreview(result.url);
        toast.success('Thumbnail uploaded successfully!', { id: toastId });
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
    const toastId = toast.loading(editingId ? 'Updating blog post...' : 'Creating blog post...');
    try {
      const url = editingId ? `/api/admin/blogs/${editingId}` : '/api/admin/blogs';
      const method = editingId ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...data,
          thumbnail: data.thumbnail || null,
        }),
      });
      const res = await response.json();
      if (res.success) {
        toast.success(res.message, { id: toastId });
        setIsDialogOpen(false);
        form.reset();
        setThumbnailPreview(null);
        setEditingId(null);
        fetchBlogs();
      } else {
        toast.error(res.message || 'Action failed.', { id: toastId });
      }
    } catch (error) {
      console.error('Error saving blog post:', error);
      toast.error('Failed to save blog post.', { id: toastId });
    }
  };

  const handleEdit = (blog: BlogFormValues) => {
    setEditingId(blog.id!);
    form.reset({
      title: blog.title,
      category: blog.category,
      status: blog.status,
      tags: blog.tags,
      content: blog.content,
      thumbnail: blog.thumbnail || '',
    });
    setThumbnailPreview(blog.thumbnail || null);
    setIsDialogOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (confirm('Are you sure you want to delete this blog post?')) {
      const toastId = toast.loading('Deleting blog post...');
      try {
        const response = await fetch(`/api/admin/blogs/${id}`, {
          method: 'DELETE',
        });
        const res = await response.json();
        if (res.success) {
          toast.success(res.message, { id: toastId });
          fetchBlogs();
        } else {
          toast.error(res.message || 'Failed to delete blog post.', { id: toastId });
        }
      } catch (error) {
        console.error('Error deleting blog post:', error);
        toast.error('An error occurred.', { id: toastId });
      }
    }
  };

  const handleOpenNew = () => {
    setEditingId(null);
    form.reset({ title: '', category: '', status: 'Draft', tags: '', content: '', thumbnail: '' });
    setThumbnailPreview(null);
  };

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Blog Posts</h2>
          <p className="text-muted-foreground mt-1">Manage articles and publications.</p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger render={<Button onClick={handleOpenNew} className="shadow-sm" />}>
            <Plus className="mr-2 h-4 w-4" /> Write Post
          </DialogTrigger>
          <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>{editingId ? 'Edit Blog Post' : 'Create New Post'}</DialogTitle>
              <DialogDescription>
                Fill in the details below to {editingId ? 'update the' : 'create a new'} blog post.
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5 py-4">
              <div className="space-y-2">
                <Label htmlFor="title">Post Title</Label>
                <Input
                  id="title"
                  placeholder="The Future of Web Development"
                  className="text-lg font-medium"
                  {...form.register('title')}
                />
                {form.formState.errors.title && (
                  <p className="text-sm text-destructive">{form.formState.errors.title.message}</p>
                )}
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
                          <SelectItem value="Technology">Technology</SelectItem>
                          <SelectItem value="Marketing">Marketing</SelectItem>
                          <SelectItem value="Business">Business</SelectItem>
                          <SelectItem value="Design">Design</SelectItem>
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
                  <Label htmlFor="status">Status</Label>
                  <Controller
                    control={form.control}
                    name="status"
                    render={({ field }) => (
                      <Select onValueChange={field.onChange} value={field.value}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select status" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Draft">Draft</SelectItem>
                          <SelectItem value="Published">Published</SelectItem>
                        </SelectContent>
                      </Select>
                    )}
                  />
                  {form.formState.errors.status && (
                    <p className="text-sm text-destructive">
                      {form.formState.errors.status.message}
                    </p>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div className="space-y-2">
                  <Label htmlFor="tags">Tags (comma separated)</Label>
                  <Input
                    id="tags"
                    placeholder="react, tailwind, frontend"
                    {...form.register('tags')}
                  />
                  {form.formState.errors.tags && (
                    <p className="text-sm text-destructive">{form.formState.errors.tags.message}</p>
                  )}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="thumbnail">Thumbnail Image</Label>
                  <div className="flex flex-col space-y-3">
                    {thumbnailPreview && (
                      <div className="relative w-40 h-24 rounded-lg overflow-hidden border">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={thumbnailPreview}
                          alt="Thumbnail preview"
                          className="w-full h-full object-cover"
                        />
                        <button
                          type="button"
                          className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 transition-colors"
                          onClick={() => {
                            form.setValue('thumbnail', '');
                            setThumbnailPreview(null);
                          }}
                        >
                          <Trash2 className="h-3 w-3" />
                        </button>
                      </div>
                    )}
                    <Input
                      id="thumbnail"
                      type="file"
                      className="cursor-pointer"
                      accept="image/*"
                      disabled={isUploading}
                      onChange={handleFileUpload}
                    />
                    {isUploading && (
                      <span className="text-xs text-muted-foreground animate-pulse">
                        Uploading file to cloud storage...
                      </span>
                    )}
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="content">Rich Content</Label>
                {/* Mocking a rich text editor with a textarea for now */}
                <Textarea
                  id="content"
                  placeholder="Write your article content here..."
                  className="min-h-[300px] font-mono text-sm leading-relaxed"
                  {...form.register('content')}
                />
                {form.formState.errors.content && (
                  <p className="text-sm text-destructive">
                    {form.formState.errors.content.message}
                  </p>
                )}
              </div>
              <DialogFooter className="pt-4 border-t">
                <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit">{editingId ? 'Update Post' : 'Publish Post'}</Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <Card className="shadow-sm">
        <CardHeader className="pb-4">
          <CardTitle>All Posts</CardTitle>
          <CardDescription>
            A list of all blog posts including drafts and published articles.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border">
            <Table>
              <TableHeader className="bg-muted/50">
                <TableRow>
                  <TableHead className="font-semibold">Title</TableHead>
                  <TableHead className="font-semibold">Category</TableHead>
                  <TableHead className="font-semibold">Status</TableHead>
                  <TableHead className="text-right font-semibold">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isLoading ? (
                  [1, 2, 3].map((i) => (
                    <TableRow key={i} className="animate-pulse">
                      <TableCell>
                        <div className="space-y-2">
                          <div className="h-4 w-48 bg-muted rounded" />
                          <div className="h-3 w-32 bg-muted rounded" />
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="h-4 w-20 bg-muted rounded" />
                      </TableCell>
                      <TableCell>
                        <div className="h-6 w-16 bg-muted rounded" />
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="h-8 w-16 bg-muted rounded ml-auto" />
                      </TableCell>
                    </TableRow>
                  ))
                ) : blogs.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={4} className="text-center py-10 text-muted-foreground">
                      No posts found. Click &quot;Write Post&quot; to create one.
                    </TableCell>
                  </TableRow>
                ) : (
                  blogs.map((blog) => (
                    <TableRow key={blog.id} className="group">
                      <TableCell className="font-medium">
                        <div className="flex flex-col">
                          <span>{blog.title}</span>
                          <span className="text-xs text-muted-foreground mt-1 truncate max-w-xs">
                            {blog.tags}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell>{blog.category}</TableCell>
                      <TableCell>
                        <Badge variant={blog.status === 'Published' ? 'default' : 'secondary'}>
                          {blog.status}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex items-center justify-end space-x-1 opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-opacity">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleEdit(blog)}
                            className="h-8 w-8 p-0"
                          >
                            <span className="sr-only">Edit</span>
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleDelete(blog.id!)}
                            className="h-8 w-8 p-0 text-destructive hover:text-destructive hover:bg-destructive/10"
                          >
                            <span className="sr-only">Delete</span>
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
