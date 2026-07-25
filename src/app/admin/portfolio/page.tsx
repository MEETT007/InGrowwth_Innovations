'use client';

import { useState, useEffect } from 'react';
import { toast } from 'sonner';
import { Plus, Edit, Trash2 } from 'lucide-react';
import { format } from 'date-fns';
import { ColumnDef } from '@tanstack/react-table';

import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { DataTable } from '@/components/ui/data-table';
import { PortfolioEditor } from './components/PortfolioEditor';

interface PortfolioProject {
  id: string;
  title: string;
  category: string;
  projectStatus: string;
  client: string;
  createdAt: string;
}

export default function PortfolioIndexPage() {
  const [projects, setProjects] = useState<PortfolioProject[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Modal state
  const [isEditorOpen, setIsEditorOpen] = useState(false);
  const [editingProject, setEditingProject] = useState<PortfolioProject | null>(null);

  const fetchProjects = async () => {
    setIsLoading(true);
    try {
      const response = await fetch('/api/admin/portfolio');
      const res = await response.json();
      if (res.success) {
        setProjects(res.data);
      } else {
        toast.error(res.message || 'Failed to fetch projects.');
      }
    } catch (error) {
      console.error('Error fetching projects:', error);
      toast.error('Failed to connect to portfolio API.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchProjects();
  }, []);

  const handleDelete = async (id: string) => {
    if (confirm('Are you sure you want to delete this project? This cannot be undone.')) {
      const toastId = toast.loading('Deleting project...');
      try {
        const response = await fetch(`/api/admin/portfolio/${id}`, {
          method: 'DELETE',
        });
        const res = await response.json();
        if (res.success) {
          toast.success(res.message, { id: toastId });
          fetchProjects();
        } else {
          toast.error(res.message || 'Failed to delete project.', { id: toastId });
        }
      } catch (error) {
        console.error('Error deleting project:', error);
        toast.error('An error occurred.', { id: toastId });
      }
    }
  };

  const handleEdit = async (project: PortfolioProject) => {
    // Fetch full project details including content
    const toastId = toast.loading('Loading project details...');
    try {
      const response = await fetch(`/api/admin/portfolio/${project.id}`);
      const res = await response.json();
      if (res.success) {
        toast.dismiss(toastId);
        setEditingProject(res.data);
        setIsEditorOpen(true);
      } else {
        toast.error(res.message || 'Failed to load project details.', { id: toastId });
      }
    } catch (error) {
      console.error('Error fetching project details:', error);
      toast.error('Error loading project details.', { id: toastId });
    }
  };

  const columns: ColumnDef<PortfolioProject>[] = [
    {
      accessorKey: 'title',
      header: 'Project Details',
      cell: ({ row }) => {
        const proj = row.original;
        return (
          <div className="flex flex-col gap-1">
            <span className="font-medium hover:text-indigo-500 transition-colors">
              {proj.title}
            </span>
            <span className="text-xs text-muted-foreground truncate max-w-xs">
              Client: {proj.client || 'N/A'}
            </span>
          </div>
        );
      },
    },
    {
      accessorKey: 'category',
      header: 'Category',
    },
    {
      accessorKey: 'projectStatus',
      header: 'Status',
      cell: ({ row }) => {
        const status = row.getValue('projectStatus') as string;
        return (
          <Badge
            variant={status === 'Completed' ? 'default' : 'secondary'}
            className={
              status === 'Completed'
                ? 'bg-green-500/10 text-green-500 hover:bg-green-500/20'
                : status === 'In Progress'
                  ? 'bg-amber-500/10 text-amber-500 hover:bg-amber-500/20'
                  : ''
            }
          >
            {status}
          </Badge>
        );
      },
    },
    {
      accessorKey: 'createdAt',
      header: 'Created Date',
      cell: ({ row }) => (
        <span className="text-sm text-muted-foreground">
          {format(new Date(row.getValue('createdAt')), 'MMM d, yyyy')}
        </span>
      ),
    },
    {
      id: 'actions',
      header: () => <div className="text-right">Actions</div>,
      cell: ({ row }) => {
        const proj = row.original;
        return (
          <div className="flex items-center justify-end space-x-1 opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-opacity">
            <Button
              variant="ghost"
              size="icon-sm"
              onClick={(e) => {
                e.stopPropagation();
                handleEdit(proj);
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
                handleDelete(proj.id);
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
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Portfolio</h2>
          <p className="text-muted-foreground mt-1">Manage your project showcase and works.</p>
        </div>
        <Button
          onClick={() => {
            setEditingProject(null);
            setIsEditorOpen(true);
          }}
          size="lg"
          className="shadow-md shadow-indigo-500/20 cursor-pointer"
        >
          <Plus className="mr-2 h-4 w-4" /> New Project
        </Button>
      </div>

      <Card className="shadow-sm border-border/50 bg-card/60 backdrop-blur-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-indigo-500/5 rounded-full blur-3xl -z-10" />
        <CardHeader className="pb-4">
          <CardTitle>All Projects</CardTitle>
          <CardDescription>A list of all portfolio projects.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="rounded-xl border border-border/50 overflow-hidden bg-background/50 p-1">
            {isLoading ? (
              <div className="p-8 text-center text-muted-foreground animate-pulse">
                Loading projects...
              </div>
            ) : (
              <DataTable
                columns={columns}
                data={projects}
                searchKey="title"
                searchPlaceholder="Search by title..."
                onRowClick={(row) => handleEdit(row)}
              />
            )}
          </div>
        </CardContent>
      </Card>

      <PortfolioEditor
        isOpen={isEditorOpen}
        onClose={() => setIsEditorOpen(false)}
        initialData={editingProject}
        onSuccess={fetchProjects}
      />
    </div>
  );
}
