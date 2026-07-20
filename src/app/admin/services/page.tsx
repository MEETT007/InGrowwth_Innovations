'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { toast } from 'sonner';
import { Plus, Edit, Trash2 } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
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

const serviceSchema = z.object({
  id: z.string().optional(),
  title: z.string().min(2, 'Title must be at least 2 characters'),
  description: z.string().min(10, 'Description must be at least 10 characters'),
  icon: z.string().min(2, 'Icon identifier is required'),
  body: z.string().min(20, 'Body must be at least 20 characters'),
});

type ServiceFormValues = z.infer<typeof serviceSchema>;

const initialServices: ServiceFormValues[] = [
  {
    id: '1',
    title: 'Web Development',
    description: 'Custom web applications',
    icon: 'Code',
    body: 'Full stack web development services using modern technologies.',
  },
  {
    id: '2',
    title: 'SEO Optimization',
    description: 'Improve your search rankings',
    icon: 'Search',
    body: 'We optimize your site for better visibility and organic traffic.',
  },
];

export default function ServicesPage() {
  const [services, setServices] = useState<ServiceFormValues[]>(initialServices);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  const form = useForm<ServiceFormValues>({
    resolver: zodResolver(serviceSchema),
    defaultValues: {
      title: '',
      description: '',
      icon: '',
      body: '',
    },
  });

  const onSubmit = (data: ServiceFormValues) => {
    if (editingId) {
      setServices(services.map((s) => (s.id === editingId ? { ...data, id: editingId } : s)));
      toast.success('Service updated successfully');
    } else {
      setServices([...services, { ...data, id: crypto.randomUUID() }]);
      toast.success('Service created successfully');
    }
    setIsDialogOpen(false);
    form.reset();
    setEditingId(null);
  };

  const handleEdit = (service: ServiceFormValues) => {
    setEditingId(service.id!);
    form.reset(service);
    setIsDialogOpen(true);
  };

  const handleDelete = (id: string) => {
    if (confirm('Are you sure you want to delete this service?')) {
      setServices(services.filter((s) => s.id !== id));
      toast.success('Service deleted successfully');
    }
  };

  const handleOpenNew = () => {
    setEditingId(null);
    form.reset({ title: '', description: '', icon: '', body: '' });
  };

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Services</h2>
          <p className="text-muted-foreground mt-1">Manage the services offered on the website.</p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger render={<Button onClick={handleOpenNew} className="shadow-sm" />}>
            <Plus className="mr-2 h-4 w-4" /> Add Service
          </DialogTrigger>
          <DialogContent className="max-w-2xl sm:max-w-3xl">
            <DialogHeader>
              <DialogTitle>{editingId ? 'Edit Service' : 'Create New Service'}</DialogTitle>
              <DialogDescription>
                Fill in the details below to {editingId ? 'update the' : 'create a new'} service.
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5 py-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div className="space-y-2">
                  <Label htmlFor="title">Title</Label>
                  <Input
                    id="title"
                    placeholder="e.g., Web Development"
                    {...form.register('title')}
                  />
                  {form.formState.errors.title && (
                    <p className="text-sm text-destructive">
                      {form.formState.errors.title.message}
                    </p>
                  )}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="icon">Icon Name (Lucide)</Label>
                  <Input id="icon" placeholder="e.g., Code" {...form.register('icon')} />
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
                  {...form.register('description')}
                />
                {form.formState.errors.description && (
                  <p className="text-sm text-destructive">
                    {form.formState.errors.description.message}
                  </p>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="body">Full Body (Markdown/HTML)</Label>
                <Textarea
                  id="body"
                  placeholder="Detailed description of the service..."
                  className="min-h-[200px]"
                  {...form.register('body')}
                />
                {form.formState.errors.body && (
                  <p className="text-sm text-destructive">{form.formState.errors.body.message}</p>
                )}
              </div>
              <DialogFooter className="pt-2">
                <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit">{editingId ? 'Update Service' : 'Create Service'}</Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <Card className="shadow-sm">
        <CardHeader className="pb-4">
          <CardTitle>Active Services</CardTitle>
          <CardDescription>
            A list of all services currently displayed on the frontend.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border">
            <Table>
              <TableHeader className="bg-muted/50">
                <TableRow>
                  <TableHead className="font-semibold">Title</TableHead>
                  <TableHead className="font-semibold">Icon</TableHead>
                  <TableHead className="hidden md:table-cell font-semibold">Description</TableHead>
                  <TableHead className="text-right font-semibold">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {services.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={4} className="text-center py-10 text-muted-foreground">
                      No services found. Click &quot;Add Service&quot; to create one.
                    </TableCell>
                  </TableRow>
                ) : (
                  services.map((service) => (
                    <TableRow key={service.id} className="group">
                      <TableCell className="font-medium">{service.title}</TableCell>
                      <TableCell>
                        <div className="flex items-center space-x-2">
                          <span className="bg-primary/10 text-primary px-2 py-1 rounded-md text-xs font-mono">
                            {service.icon}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell className="hidden md:table-cell text-muted-foreground max-w-xs truncate">
                        {service.description}
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex items-center justify-end space-x-1 opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-opacity">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleEdit(service)}
                            className="h-8 w-8 p-0"
                          >
                            <span className="sr-only">Edit</span>
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleDelete(service.id!)}
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
