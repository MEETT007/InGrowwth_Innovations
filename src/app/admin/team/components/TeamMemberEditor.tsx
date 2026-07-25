'use client';

import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { toast } from 'sonner';
import { MessageCircle, Code, Mail, Link as LinkIcon, Image as ImageIcon } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';

const teamSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  role: z.string().min(2, 'Role is required'),
  email: z.string().email('Must be a valid email').optional().or(z.literal('')),
  bio: z.string().max(160, 'Bio must be under 160 characters').optional(),
  linkedin: z.string().url('Must be a valid URL').optional().or(z.literal('')),
  twitter: z.string().url('Must be a valid URL').optional().or(z.literal('')),
  github: z.string().url('Must be a valid URL').optional().or(z.literal('')),
  photo: z.any().optional(), // Mock photo upload
});

type TeamFormValues = z.infer<typeof teamSchema>;

interface TeamMemberEditorProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  initialData?: any;
}

export function TeamMemberEditor({
  isOpen,
  onClose,
  onSuccess,
  initialData,
}: TeamMemberEditorProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);

  const form = useForm<TeamFormValues>({
    resolver: zodResolver(teamSchema),
    defaultValues: {
      name: '',
      role: '',
      email: '',
      bio: '',
      linkedin: '',
      twitter: '',
      github: '',
      photo: '',
    },
  });

  useEffect(() => {
    if (isOpen) {
      if (initialData) {
        form.reset({
          name: initialData.name || '',
          role: initialData.role || '',
          email: initialData.email || '',
          bio: initialData.bio || '',
          linkedin: initialData.linkedin || '',
          twitter: initialData.twitter || '',
          github: initialData.github || '',
          photo: initialData.photo || '',
        });
        // eslint-disable-next-line react-hooks/set-state-in-effect
        setPhotoPreview(initialData.photo || null);
      } else {
        form.reset({
          name: '',
          role: '',
          email: '',
          bio: '',
          linkedin: '',
          twitter: '',
          github: '',
          photo: '',
        });
        setPhotoPreview(null);
      }
    }
  }, [initialData, isOpen, form]);

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
    const toastId = toast.loading('Uploading photo...');

    try {
      const response = await fetch('/api/upload?folder=team', {
        method: 'POST',
        body: formData,
      });

      const result = await response.json();
      if (result.success && result.url) {
        form.setValue('photo', result.url);
        setPhotoPreview(result.url);
        toast.success('Photo uploaded successfully!', { id: toastId });
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

  const onSubmit = async (data: TeamFormValues) => {
    setIsSubmitting(true);
    const toastId = toast.loading(initialData?.id ? 'Updating member...' : 'Adding member...');

    try {
      const url = initialData?.id ? `/api/admin/team/${initialData.id}` : '/api/admin/team';
      const method = initialData?.id ? 'PUT' : 'POST';

      const cleanedData = {
        name: data.name,
        role: data.role,
        email: data.email || null,
        bio: data.bio || null,
        linkedin: data.linkedin || null,
        twitter: data.twitter || null,
        github: data.github || null,
        photo: data.photo || null,
      };

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(cleanedData),
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
      console.error('Error saving member:', error);
      toast.error('Failed to save team member.', { id: toastId });
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
                {initialData?.id ? 'Edit Team Member' : 'New Team Member'}
              </DialogTitle>
              <DialogDescription>Manage team roster and profiles.</DialogDescription>
            </div>
            <div className="flex items-center gap-2">
              <Button
                onClick={form.handleSubmit(onSubmit)}
                disabled={isSubmitting}
                size="sm"
                className="bg-indigo-600 hover:bg-indigo-700 text-white shadow-md shadow-indigo-500/20"
              >
                {isSubmitting ? 'Saving...' : initialData?.id ? 'Update Member' : 'Add Member'}
              </Button>
            </div>
          </div>
        </DialogHeader>

        <ScrollArea className="flex-1 px-6 py-6 overflow-y-auto">
          <form id="team-form" onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 pb-12">
            <div className="flex items-center space-x-6 border-b pb-6 border-border/50">
              <Avatar className="h-24 w-24 border">
                {photoPreview ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={photoPreview}
                    alt="Profile preview"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <AvatarFallback className="text-xl bg-muted">
                    <ImageIcon className="h-8 w-8 text-muted-foreground opacity-50" />
                  </AvatarFallback>
                )}
              </Avatar>
              <div className="space-y-2 flex-1">
                <Label htmlFor="photo">Profile Photo</Label>
                <Input
                  id="photo"
                  type="file"
                  accept="image/*"
                  disabled={isUploading}
                  onChange={handleFileUpload}
                  className="max-w-xs bg-background"
                />
                <p className="text-xs text-muted-foreground">
                  {isUploading ? 'Uploading photo...' : 'Recommended size: 400x400px (Max 5MB)'}
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div className="space-y-2">
                <Label htmlFor="name">Full Name</Label>
                <Input
                  id="name"
                  placeholder="e.g., Jane Doe"
                  className="bg-background"
                  {...form.register('name')}
                />
                {form.formState.errors.name && (
                  <p className="text-sm text-destructive">{form.formState.errors.name.message}</p>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="role">Job Title / Role</Label>
                <Input
                  id="role"
                  placeholder="e.g., Senior Designer"
                  className="bg-background"
                  {...form.register('role')}
                />
                {form.formState.errors.role && (
                  <p className="text-sm text-destructive">{form.formState.errors.role.message}</p>
                )}
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="bio">Short Bio</Label>
              <Input
                id="bio"
                placeholder="Brief tagline or biography (max 160 chars)"
                className="bg-background"
                {...form.register('bio')}
              />
              {form.formState.errors.bio && (
                <p className="text-sm text-destructive">{form.formState.errors.bio.message}</p>
              )}
            </div>

            <div className="space-y-3 pt-2 border-t border-border/50">
              <h4 className="text-sm font-semibold pt-2">Contact & Social Links</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="email" className="flex items-center text-xs">
                    <Mail className="h-3 w-3 mr-1" /> Email Address
                  </Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="jane@example.com"
                    className="bg-background"
                    {...form.register('email')}
                  />
                  {form.formState.errors.email && (
                    <p className="text-sm text-destructive">
                      {form.formState.errors.email.message}
                    </p>
                  )}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="linkedin" className="flex items-center text-xs">
                    <LinkIcon className="h-3 w-3 mr-1" /> LinkedIn URL
                  </Label>
                  <Input
                    id="linkedin"
                    placeholder="https://linkedin.com/in/..."
                    className="bg-background"
                    {...form.register('linkedin')}
                  />
                  {form.formState.errors.linkedin && (
                    <p className="text-sm text-destructive">
                      {form.formState.errors.linkedin.message}
                    </p>
                  )}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="twitter" className="flex items-center text-xs">
                    <MessageCircle className="h-3 w-3 mr-1" /> Twitter URL
                  </Label>
                  <Input
                    id="twitter"
                    placeholder="https://twitter.com/..."
                    className="bg-background"
                    {...form.register('twitter')}
                  />
                  {form.formState.errors.twitter && (
                    <p className="text-sm text-destructive">
                      {form.formState.errors.twitter.message}
                    </p>
                  )}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="github" className="flex items-center text-xs">
                    <Code className="h-3 w-3 mr-1" /> GitHub URL
                  </Label>
                  <Input
                    id="github"
                    placeholder="https://github.com/..."
                    className="bg-background"
                    {...form.register('github')}
                  />
                  {form.formState.errors.github && (
                    <p className="text-sm text-destructive">
                      {form.formState.errors.github.message}
                    </p>
                  )}
                </div>
              </div>
            </div>
          </form>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}
