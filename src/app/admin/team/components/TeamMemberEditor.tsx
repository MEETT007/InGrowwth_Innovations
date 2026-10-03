'use client';

import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { toast } from 'sonner';
import {
  MessageCircle,
  Code,
  Mail,
  Link as LinkIcon,
  Image as ImageIcon,
  Trash2,
  Users,
} from 'lucide-react';

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
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { logger } from '@/lib/logger';

const POPULAR_ROLES = [
  'Chief Executive Officer',
  'Chief Technology Officer',
  'Head of AI & Machine Learning',
  'Principal Cloud Architect',
  'Lead Full-Stack Engineer',
  'VP of Product & Engineering',
  'Lead Product Designer',
];

const teamSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  role: z.string().min(2, 'Role is required'),
  email: z.string().email('Must be a valid email').optional().or(z.literal('')),
  bio: z.string().max(200, 'Bio must be under 200 characters').optional(),
  linkedin: z.string().url('Must be a valid URL').optional().or(z.literal('')),
  twitter: z.string().url('Must be a valid URL').optional().or(z.literal('')),
  github: z.string().url('Must be a valid URL').optional().or(z.literal('')),
  photo: z.any().optional(),
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

  const watchedName = form.watch('name');
  const watchedRole = form.watch('role');
  const watchedBio = form.watch('bio');
  const watchedEmail = form.watch('email');
  const watchedLinkedin = form.watch('linkedin');
  const watchedTwitter = form.watch('twitter');
  const watchedGithub = form.watch('github');

  const initials = watchedName
    ? watchedName
        .split(' ')
        .map((n) => n[0])
        .join('')
        .substring(0, 2)
        .toUpperCase()
    : 'TM';

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
      logger.error('Error uploading file:', error);
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
      logger.error('Error saving member:', error);
      toast.error('Failed to save team member.', { id: toastId });
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
                <Users className="w-5 h-5" />
              </div>
              <div>
                <DialogTitle className="text-xl font-bold tracking-tight">
                  {initialData?.id ? 'Edit Team Leader' : 'Add Team Leader'}
                </DialogTitle>
                <DialogDescription className="text-xs">
                  Manage leadership profiles displayed on the public About page
                </DialogDescription>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Button
                onClick={form.handleSubmit(onSubmit)}
                disabled={isSubmitting}
                size="sm"
                className="bg-indigo-600 hover:bg-indigo-700 text-white rounded-full text-xs font-semibold px-5 shadow-lg shadow-indigo-500/25"
              >
                {isSubmitting ? 'Saving...' : initialData?.id ? 'Update Profile' : 'Add to Team'}
              </Button>
            </div>
          </div>
        </DialogHeader>

        <ScrollArea className="flex-1 px-6 py-6 overflow-y-auto">
          <form id="team-form" onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 pb-12">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
              {/* Form Inputs (7 cols) */}
              <div className="lg:col-span-7 space-y-5">
                {/* Photo Upload Row */}
                <div className="flex items-center gap-5 p-4 rounded-2xl bg-muted/20 border border-border/50">
                  <Avatar className="h-20 w-20 border-2 border-indigo-500/20 shadow-md">
                    {photoPreview ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={photoPreview}
                        alt="Profile preview"
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <AvatarFallback className="text-xl bg-gradient-to-tr from-indigo-500 to-purple-600 text-white font-bold">
                        {initials}
                      </AvatarFallback>
                    )}
                  </Avatar>
                  <div className="space-y-2 flex-1">
                    <Label className="text-xs font-semibold">Avatar / Photo</Label>
                    <div className="flex items-center gap-2">
                      <Input
                        id="photo"
                        type="file"
                        accept="image/*"
                        disabled={isUploading}
                        onChange={handleFileUpload}
                        className="bg-background text-xs"
                      />
                      {photoPreview && (
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() => {
                            form.setValue('photo', '');
                            setPhotoPreview(null);
                          }}
                          className="text-xs text-red-400 hover:text-red-500"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </Button>
                      )}
                    </div>
                    <p className="text-[11px] text-muted-foreground">
                      Square image recommended (e.g. 500x500px). Max 5MB.
                    </p>
                  </div>
                </div>

                {/* Name & Role */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <Label htmlFor="name" className="text-xs font-semibold">
                      Full Name
                    </Label>
                    <Input
                      id="name"
                      placeholder="e.g. Sarah Connor"
                      className="bg-background text-xs"
                      {...form.register('name')}
                    />
                    {form.formState.errors.name && (
                      <p className="text-xs text-destructive">
                        {form.formState.errors.name.message}
                      </p>
                    )}
                  </div>
                  <div className="space-y-1.5">
                    <Label htmlFor="role" className="text-xs font-semibold">
                      Role / Position
                    </Label>
                    <Input
                      id="role"
                      placeholder="Chief Technology Officer"
                      list="team-roles"
                      className="bg-background text-xs"
                      {...form.register('role')}
                    />
                    <datalist id="team-roles">
                      {POPULAR_ROLES.map((r) => (
                        <option key={r} value={r} />
                      ))}
                    </datalist>
                    {form.formState.errors.role && (
                      <p className="text-xs text-destructive">
                        {form.formState.errors.role.message}
                      </p>
                    )}
                  </div>
                </div>

                {/* Role quick pills */}
                <div className="flex flex-wrap gap-1.5">
                  {POPULAR_ROLES.slice(0, 5).map((r) => (
                    <button
                      key={r}
                      type="button"
                      onClick={() => form.setValue('role', r, { shouldValidate: true })}
                      className="text-[10px] px-2 py-0.5 rounded-md bg-secondary/80 border border-border/50 text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors"
                    >
                      + {r}
                    </button>
                  ))}
                </div>

                {/* Bio */}
                <div className="space-y-1.5">
                  <Label htmlFor="bio" className="text-xs font-semibold">
                    Short Bio (Max 200 chars)
                  </Label>
                  <Input
                    id="bio"
                    placeholder="Leading enterprise cloud modernization and high-performance engineering systems."
                    className="bg-background text-xs"
                    {...form.register('bio')}
                  />
                  {form.formState.errors.bio && (
                    <p className="text-xs text-destructive">{form.formState.errors.bio.message}</p>
                  )}
                </div>

                {/* Socials & Contact */}
                <div className="space-y-3 pt-3 border-t border-border/50">
                  <Label className="text-xs font-bold uppercase tracking-wider text-muted-foreground block">
                    Contact & Social Profiles
                  </Label>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div className="space-y-1">
                      <Label htmlFor="email" className="text-[11px] flex items-center gap-1">
                        <Mail className="w-3 h-3 text-indigo-400" /> Work Email
                      </Label>
                      <Input
                        id="email"
                        type="email"
                        placeholder="sarah@ingrowwthinnovations.com"
                        className="bg-background text-xs"
                        {...form.register('email')}
                      />
                    </div>
                    <div className="space-y-1">
                      <Label htmlFor="linkedin" className="text-[11px] flex items-center gap-1">
                        <LinkIcon className="w-3 h-3 text-blue-400" /> LinkedIn URL
                      </Label>
                      <Input
                        id="linkedin"
                        placeholder="https://linkedin.com/in/sarah"
                        className="bg-background text-xs"
                        {...form.register('linkedin')}
                      />
                    </div>
                    <div className="space-y-1">
                      <Label htmlFor="twitter" className="text-[11px] flex items-center gap-1">
                        <MessageCircle className="w-3 h-3 text-sky-400" /> Twitter / X URL
                      </Label>
                      <Input
                        id="twitter"
                        placeholder="https://x.com/sarah"
                        className="bg-background text-xs"
                        {...form.register('twitter')}
                      />
                    </div>
                    <div className="space-y-1">
                      <Label htmlFor="github" className="text-[11px] flex items-center gap-1">
                        <Code className="w-3 h-3 text-purple-400" /> GitHub URL
                      </Label>
                      <Input
                        id="github"
                        placeholder="https://github.com/sarah"
                        className="bg-background text-xs"
                        {...form.register('github')}
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Right Column: Live Card Preview (5 cols) */}
              <div className="lg:col-span-5 space-y-3">
                <Label className="text-xs font-bold uppercase tracking-wider text-muted-foreground block">
                  Public Team Card Preview
                </Label>
                <div className="p-6 rounded-3xl border border-border/80 bg-card/60 backdrop-blur-xl shadow-2xl flex flex-col items-center text-center space-y-4">
                  {photoPreview ? (
                    <div className="w-24 h-24 rounded-full overflow-hidden shadow-lg border-2 border-indigo-500/20">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={photoPreview}
                        alt="Preview"
                        className="w-full h-full object-cover"
                      />
                    </div>
                  ) : (
                    <div className="w-24 h-24 rounded-full bg-gradient-to-tr from-indigo-600 via-purple-600 to-pink-600 flex items-center justify-center text-white font-black text-2xl shadow-lg">
                      {initials}
                    </div>
                  )}

                  <div>
                    <h4 className="text-lg font-bold text-foreground">
                      {watchedName || 'Full Name'}
                    </h4>
                    <span className="text-xs font-semibold text-indigo-400 uppercase tracking-wider block mt-1">
                      {watchedRole || 'Executive Leadership'}
                    </span>
                  </div>

                  <p className="text-xs text-muted-foreground leading-relaxed">
                    {watchedBio || 'Brief biographical summary about this leader’s impact and background will render here.'}
                  </p>

                  {/* Social icons row */}
                  <div className="flex items-center gap-3 pt-2">
                    {watchedEmail && (
                      <span className="p-2 rounded-full bg-secondary/80 text-muted-foreground">
                        <Mail className="w-3.5 h-3.5" />
                      </span>
                    )}
                    {watchedLinkedin && (
                      <span className="p-2 rounded-full bg-blue-500/10 text-blue-400">
                        <LinkIcon className="w-3.5 h-3.5" />
                      </span>
                    )}
                    {watchedTwitter && (
                      <span className="p-2 rounded-full bg-sky-500/10 text-sky-400">
                        <MessageCircle className="w-3.5 h-3.5" />
                      </span>
                    )}
                    {watchedGithub && (
                      <span className="p-2 rounded-full bg-purple-500/10 text-purple-400">
                        <Code className="w-3.5 h-3.5" />
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </form>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}
