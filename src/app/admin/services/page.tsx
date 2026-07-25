'use client';

import { useState, useEffect } from 'react';
import { toast } from 'sonner';
import { Plus, Edit, Trash2 } from 'lucide-react';
import { ColumnDef } from '@tanstack/react-table';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { DataTable } from '@/components/ui/data-table';
import { ServiceEditor } from './components/ServiceEditor';

interface Service {
  id: string;
  title: string;
  description: string;
  icon: string;
  body: string;
}

export default function ServicesPage() {
  const [services, setServices] = useState<Service[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Modal state
  const [isEditorOpen, setIsEditorOpen] = useState(false);
  const [editingService, setEditingService] = useState<Service | null>(null);

  const fetchServices = async () => {
    setIsLoading(true);
    try {
      const response = await fetch('/api/admin/services');
      const res = await response.json();
      if (res.success) {
        setServices(res.data);
      } else {
        toast.error(res.message || 'Failed to fetch services.');
      }
    } catch (error) {
      console.error('Error fetching services:', error);
      toast.error('Failed to connect to services API.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchServices();
  }, []);

  const handleDelete = async (id: string) => {
    if (confirm('Are you sure you want to delete this service?')) {
      const toastId = toast.loading('Deleting service...');
      try {
        const response = await fetch(`/api/admin/services/${id}`, {
          method: 'DELETE',
        });
        const res = await response.json();
        if (res.success) {
          toast.success(res.message, { id: toastId });
          fetchServices();
        } else {
          toast.error(res.message || 'Failed to delete service.', { id: toastId });
        }
      } catch (error) {
        console.error('Error deleting service:', error);
        toast.error('An error occurred.', { id: toastId });
      }
    }
  };

  const handleEdit = (service: Service) => {
    setEditingService(service);
    setIsEditorOpen(true);
  };

  const columns: ColumnDef<Service>[] = [
    {
      accessorKey: 'title',
      header: 'Service Title',
      cell: ({ row }) => (
        <span className="font-medium hover:text-indigo-500 transition-colors">
          {row.original.title}
        </span>
      ),
    },
    {
      accessorKey: 'icon',
      header: 'Icon',
      cell: ({ row }) => (
        <div className="flex items-center space-x-2">
          <span className="bg-primary/10 text-primary px-2 py-1 rounded-md text-xs font-mono">
            {row.original.icon}
          </span>
        </div>
      ),
    },
    {
      accessorKey: 'description',
      header: 'Description',
      cell: ({ row }) => (
        <span className="text-muted-foreground truncate max-w-[200px] md:max-w-md block">
          {row.original.description}
        </span>
      ),
    },
    {
      id: 'actions',
      header: () => <div className="text-right">Actions</div>,
      cell: ({ row }) => {
        const service = row.original;
        return (
          <div className="flex items-center justify-end space-x-1 opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-opacity">
            <Button
              variant="ghost"
              size="icon-sm"
              onClick={(e) => {
                e.stopPropagation();
                handleEdit(service);
              }}
              className="cursor-pointer hover:bg-indigo-500/10 hover:text-indigo-500"
            >
              <span className="sr-only">Edit</span>
              <Edit className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="icon-sm"
              onClick={(e) => {
                e.stopPropagation();
                handleDelete(service.id);
              }}
              className="cursor-pointer text-destructive hover:text-destructive hover:bg-destructive/10"
            >
              <span className="sr-only">Delete</span>
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        );
      },
    },
  ];

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Services</h2>
          <p className="text-muted-foreground mt-1">Manage the services offered on the website.</p>
        </div>
        <Button
          onClick={() => {
            setEditingService(null);
            setIsEditorOpen(true);
          }}
          className="shadow-sm"
        >
          <Plus className="mr-2 h-4 w-4" /> Add Service
        </Button>
      </div>

      <Card className="shadow-sm">
        <CardHeader className="pb-4">
          <CardTitle>Active Services</CardTitle>
          <CardDescription>
            A list of all services currently displayed on the frontend.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border p-1">
            {isLoading ? (
              <div className="p-8 text-center text-muted-foreground animate-pulse">
                Loading services...
              </div>
            ) : (
              <DataTable
                columns={columns}
                data={services}
                searchKey="title"
                searchPlaceholder="Search services..."
                onRowClick={(row) => handleEdit(row)}
              />
            )}
          </div>
        </CardContent>
      </Card>

      <ServiceEditor
        isOpen={isEditorOpen}
        onClose={() => setIsEditorOpen(false)}
        initialData={editingService}
        onSuccess={fetchServices}
      />
    </div>
  );
}
