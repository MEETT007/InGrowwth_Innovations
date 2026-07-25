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
import { CaseStudyEditor } from './components/CaseStudyEditor';

interface CaseStudy {
  id: string;
  title: string;
  industry: string;
  status: string;
  clientName: string;
  createdAt: string;
  slug: string;
}

export default function CaseStudiesIndexPage() {
  const [caseStudies, setCaseStudies] = useState<CaseStudy[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  // Modal state
  const [isEditorOpen, setIsEditorOpen] = useState(false);
  const [editingCaseStudy, setEditingCaseStudy] = useState<CaseStudy | null>(null);

  const fetchCaseStudies = async () => {
    setIsLoading(true);
    try {
      const response = await fetch('/api/admin/case-studies');
      const res = await response.json();
      if (res.success) {
        setCaseStudies(res.data);
      } else {
        toast.error(res.message || 'Failed to fetch case studies.');
      }
    } catch (error) {
      console.error('Error fetching case studies:', error);
      toast.error('Failed to connect to case studies API.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchCaseStudies();
  }, []);

  const handleDelete = async (id: string) => {
    if (confirm('Are you sure you want to delete this case study? This cannot be undone.')) {
      const toastId = toast.loading('Deleting case study...');
      try {
        const response = await fetch(`/api/admin/case-studies/${id}`, {
          method: 'DELETE',
        });
        const res = await response.json();
        if (res.success) {
          toast.success(res.message, { id: toastId });
          fetchCaseStudies();
        } else {
          toast.error(res.message || 'Failed to delete case study.', { id: toastId });
        }
      } catch (error) {
        console.error('Error deleting case study:', error);
        toast.error('An error occurred.', { id: toastId });
      }
    }
  };

  const handleEdit = async (caseStudy: CaseStudy) => {
    // Fetch full case study details including content
    const toastId = toast.loading('Loading case study details...');
    try {
      const response = await fetch(`/api/admin/case-studies/${caseStudy.id}`);
      const res = await response.json();
      if (res.success) {
        toast.dismiss(toastId);
        setEditingCaseStudy(res.data);
        setIsEditorOpen(true);
      } else {
        toast.error(res.message || 'Failed to load case study details.', { id: toastId });
      }
    } catch (error) {
      console.error('Error fetching case study details:', error);
      toast.error('Error loading case study details.', { id: toastId });
    }
  };

  const columns: ColumnDef<CaseStudy>[] = [
    {
      accessorKey: 'title',
      header: 'Case Study Details',
      cell: ({ row }) => {
        const cs = row.original;
        return (
          <div className="flex flex-col gap-1">
            <span className="font-medium hover:text-indigo-500 transition-colors">
              {cs.title}
            </span>
            <span className="text-xs text-muted-foreground truncate max-w-xs">
              Client: {cs.clientName || 'N/A'}
            </span>
          </div>
        );
      },
    },
    {
      accessorKey: 'industry',
      header: 'Industry',
    },
    {
      accessorKey: 'status',
      header: 'Status',
      cell: ({ row }) => {
        const status = row.getValue('status') as string;
        return (
          <Badge
            variant={status === 'PUBLISHED' ? 'default' : 'secondary'}
            className={
              status === 'PUBLISHED'
                ? 'bg-green-500/10 text-green-500 hover:bg-green-500/20'
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
        const cs = row.original;
        return (
          <div className="flex items-center justify-end space-x-1 opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-opacity">
            <Button
              variant="ghost"
              size="icon-sm"
              onClick={(e) => {
                e.stopPropagation();
                handleEdit(cs);
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
                handleDelete(cs.id);
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
          <h2 className="text-3xl font-bold tracking-tight">Case Studies</h2>
          <p className="text-muted-foreground mt-1">
            Manage deep-dive marketing assets, success stories, and ROI proofs.
          </p>
        </div>
        <Button
          onClick={() => {
            setEditingCaseStudy(null);
            setIsEditorOpen(true);
          }}
          size="lg"
          className="shadow-md shadow-indigo-500/20 cursor-pointer"
        >
          <Plus className="mr-2 h-4 w-4" /> New Case Study
        </Button>
      </div>

      <Card className="shadow-sm border-border/50 bg-card/60 backdrop-blur-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-indigo-500/5 rounded-full blur-3xl -z-10" />
        <CardHeader className="pb-4">
          <CardTitle>All Case Studies</CardTitle>
          <CardDescription>
            A list of all case studies including drafts and published assets.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="rounded-xl border border-border/50 overflow-hidden bg-background/50 p-1">
            {isLoading ? (
              <div className="p-8 text-center text-muted-foreground animate-pulse">Loading case studies...</div>
            ) : (
              <DataTable
                columns={columns}
                data={caseStudies}
                searchKey="title"
                searchPlaceholder="Search by title..."
                onRowClick={(row) => handleEdit(row)}
              />
            )}
          </div>
        </CardContent>
      </Card>

      <CaseStudyEditor
        isOpen={isEditorOpen}
        onClose={() => setIsEditorOpen(false)}
        initialData={editingCaseStudy}
        onSuccess={fetchCaseStudies}
      />
    </div>
  );
}
