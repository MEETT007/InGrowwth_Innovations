'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { toast } from 'sonner';
import {
  Edit,
  Trash2,
  Link,
  MessageCircle,
  Code,
  Mail,
  UserPlus,
  Image as ImageIcon,
} from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
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
import { Avatar, AvatarFallback } from '@/components/ui/avatar';

const teamSchema = z.object({
  id: z.string().optional(),
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

const initialTeam: TeamFormValues[] = [
  {
    id: '1',
    name: 'Alice Johnson',
    role: 'CEO & Founder',
    email: 'alice@example.com',
    bio: 'Visionary leader with 10+ years in tech.',
    linkedin: 'https://linkedin.com',
    twitter: 'https://twitter.com',
  },
  {
    id: '2',
    name: 'Bob Smith',
    role: 'Lead Developer',
    email: 'bob@example.com',
    bio: 'Full-stack wizard and open-source contributor.',
    github: 'https://github.com',
    linkedin: 'https://linkedin.com',
  },
];

export default function TeamPage() {
  const [teamMembers, setTeamMembers] = useState<TeamFormValues[]>(initialTeam);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
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

  const onSubmit = (data: TeamFormValues) => {
    if (editingId) {
      setTeamMembers(teamMembers.map((m) => (m.id === editingId ? { ...data, id: editingId } : m)));
      toast.success('Team member updated successfully');
    } else {
      setTeamMembers([...teamMembers, { ...data, id: crypto.randomUUID() }]);
      toast.success('Team member added successfully');
    }
    setIsDialogOpen(false);
    form.reset();
    setPhotoPreview(null);
    setEditingId(null);
  };

  const handleEdit = (member: TeamFormValues) => {
    setEditingId(member.id!);
    form.reset(member);
    setPhotoPreview(member.photo || null);
    setIsDialogOpen(true);
  };

  const handleDelete = (id: string) => {
    if (confirm('Are you sure you want to remove this team member?')) {
      setTeamMembers(teamMembers.filter((m) => m.id !== id));
      toast.success('Team member removed successfully');
    }
  };

  const handleOpenNew = () => {
    setEditingId(null);
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
  };

  // Helper to get initials for Avatar fallback
  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .substring(0, 2)
      .toUpperCase();
  };

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Team Members</h2>
          <p className="text-muted-foreground mt-1">
            Manage employees, roles, and social profiles.
          </p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger render={<Button onClick={handleOpenNew} className="shadow-sm" />}>
            <UserPlus className="mr-2 h-4 w-4" /> Add Member
          </DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>{editingId ? 'Edit Team Member' : 'Add New Team Member'}</DialogTitle>
              <DialogDescription>
                Fill out the employee&apos;s details, role, and their social links.
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5 py-4">
              <div className="flex items-center space-x-6 border-b pb-6">
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
                    className="max-w-xs"
                  />
                  <p className="text-xs text-muted-foreground">
                    {isUploading ? 'Uploading photo...' : 'Recommended size: 400x400px (Max 5MB)'}
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div className="space-y-2">
                  <Label htmlFor="name">Full Name</Label>
                  <Input id="name" placeholder="e.g., Jane Doe" {...form.register('name')} />
                  {form.formState.errors.name && (
                    <p className="text-sm text-destructive">{form.formState.errors.name.message}</p>
                  )}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="role">Job Title / Role</Label>
                  <Input id="role" placeholder="e.g., Senior Designer" {...form.register('role')} />
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
                  {...form.register('bio')}
                />
                {form.formState.errors.bio && (
                  <p className="text-sm text-destructive">{form.formState.errors.bio.message}</p>
                )}
              </div>

              <div className="space-y-3 pt-2">
                <h4 className="text-sm font-semibold border-b pb-2">Contact & Social Links</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="email" className="flex items-center text-xs">
                      <Mail className="h-3 w-3 mr-1" /> Email Address
                    </Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="jane@example.com"
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
                      <Link className="h-3 w-3 mr-1" /> LinkedIn URL
                    </Label>
                    <Input
                      id="linkedin"
                      placeholder="https://linkedin.com/in/..."
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

              <DialogFooter className="pt-4 mt-2">
                <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit">{editingId ? 'Update Member' : 'Add Member'}</Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {teamMembers.length === 0 ? (
        <Card className="flex flex-col items-center justify-center py-12 text-center shadow-sm">
          <UserPlus className="h-12 w-12 text-muted-foreground opacity-20 mb-4" />
          <h3 className="text-lg font-medium">No team members</h3>
          <p className="text-muted-foreground mt-1 max-w-sm">
            Start building your team roster by adding members.
          </p>
        </Card>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {teamMembers.map((member) => (
            <Card
              key={member.id}
              className="overflow-hidden group text-center relative hover:shadow-md transition-all duration-300 border-border/60"
            >
              <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity z-10 flex gap-1">
                <Button
                  variant="secondary"
                  size="icon"
                  className="h-8 w-8 rounded-full bg-background/80 backdrop-blur"
                  onClick={() => handleEdit(member)}
                >
                  <Edit className="h-3.5 w-3.5" />
                </Button>
                <Button
                  variant="destructive"
                  size="icon"
                  className="h-8 w-8 rounded-full opacity-90"
                  onClick={() => handleDelete(member.id!)}
                >
                  <Trash2 className="h-3.5 w-3.5" />
                </Button>
              </div>

              <div className="h-16 bg-muted/30 w-full absolute top-0 left-0" />

              <CardHeader className="pt-8 pb-2 relative">
                <Avatar className="h-20 w-20 mx-auto border-4 border-background shadow-sm mb-2">
                  {member.photo ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={member.photo}
                      alt={member.name}
                      className="w-full h-full object-cover rounded-full"
                    />
                  ) : (
                    <AvatarFallback className="bg-primary/10 text-primary text-xl font-medium">
                      {getInitials(member.name)}
                    </AvatarFallback>
                  )}
                </Avatar>
                <CardTitle className="text-lg">{member.name}</CardTitle>
                <CardDescription className="font-medium text-primary">
                  {member.role}
                </CardDescription>
              </CardHeader>
              <CardContent className="pb-4 pt-1">
                {member.bio && (
                  <p className="text-sm text-muted-foreground line-clamp-2 px-2">{member.bio}</p>
                )}
              </CardContent>
              <CardFooter className="flex justify-center space-x-2 pt-0 pb-6">
                {member.email && (
                  <a
                    href={`mailto:${member.email}`}
                    className="text-muted-foreground hover:text-foreground transition-colors p-1.5 bg-muted/50 rounded-full hover:bg-muted"
                  >
                    <Mail className="h-4 w-4" />
                  </a>
                )}
                {member.linkedin && (
                  <a
                    href={member.linkedin}
                    target="_blank"
                    rel="noreferrer"
                    className="text-muted-foreground hover:text-blue-600 transition-colors p-1.5 bg-muted/50 rounded-full hover:bg-blue-50"
                  >
                    <Link className="h-4 w-4" />
                  </a>
                )}
                {member.twitter && (
                  <a
                    href={member.twitter}
                    target="_blank"
                    rel="noreferrer"
                    className="text-muted-foreground hover:text-sky-500 transition-colors p-1.5 bg-muted/50 rounded-full hover:bg-sky-50"
                  >
                    <MessageCircle className="h-4 w-4" />
                  </a>
                )}
                {member.github && (
                  <a
                    href={member.github}
                    target="_blank"
                    rel="noreferrer"
                    className="text-muted-foreground hover:text-foreground transition-colors p-1.5 bg-muted/50 rounded-full hover:bg-muted"
                  >
                    <Code className="h-4 w-4" />
                  </a>
                )}
              </CardFooter>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
