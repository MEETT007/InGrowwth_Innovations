'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { toast } from 'sonner';
import { Plus, Edit, Trash2, Search, FileBarChart } from 'lucide-react';
import { format } from 'date-fns';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';

interface CaseStudy {
  id: string;
  title: string;
  clientName: string;
  industry: string;
  status: string;
  createdAt: string;
}

export default function CaseStudiesIndexPage() {
  const [studies, setStudies] = useState<CaseStudy[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [search, setSearch] = useState('');

  const fetchStudies = async () => {
    setIsLoading(true);
    try {
      const response = await fetch('/api/admin/case-studies');
      const res = await response.json();
      if (res.success) {
        setStudies(res.data);
      } else {
        toast.error(res.message || 'Failed to fetch case studies.');
      }
    } catch (error) {
      console.error('Error fetching case studies:', error);
      toast.error('Failed to connect to API.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchStudies();
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
          fetchStudies();
        } else {
          toast.error(res.message || 'Failed to delete case study.', { id: toastId });
        }
      } catch (error) {
        console.error('Error deleting case study:', error);
        toast.error('An error occurred.', { id: toastId });
      }
    }
  };

  const filteredStudies = studies.filter(
    (study) =>
      study.title.toLowerCase().includes(search.toLowerCase()) ||
      (study.clientName || '').toLowerCase().includes(search.toLowerCase()) ||
      (study.industry || '').toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Case Studies</h2>
          <p className="text-muted-foreground mt-1">
            Deep dives into client success stories and ROI.
          </p>
        </div>
        <Button asChild size="lg" className="shadow-md shadow-indigo-500/20 cursor-pointer">
          <Link href="/admin/case-studies/create">
            <Plus className="mr-2 h-4 w-4" /> Create Case Study
          </Link>
        </Button>
      </div>

      <Card className="shadow-sm border-border/50 bg-card/60 backdrop-blur-xl relative overflow-hidden">
        <div className="absolute top-0 left-0 w-96 h-96 bg-indigo-500/5 rounded-full blur-3xl -z-10" />
        <CardHeader className="pb-4">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <CardTitle>All Case Studies</CardTitle>
              <CardDescription>
                Manage your marketing collateral and in-depth project analysis.
              </CardDescription>
            </div>
            <div className="relative w-full sm:w-72">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search case studies..."
                className="pl-9 bg-background/50"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="rounded-xl border border-border/50 overflow-hidden bg-background/50">
            <Table>
              <TableHeader className="bg-muted/30">
                <TableRow className="hover:bg-transparent">
                  <TableHead className="font-semibold w-[40%]">Study Title</TableHead>
                  <TableHead className="font-semibold">Client</TableHead>
                  <TableHead className="font-semibold">Industry</TableHead>
                  <TableHead className="font-semibold">Status</TableHead>
                  <TableHead className="font-semibold">Created Date</TableHead>
                  <TableHead className="text-right font-semibold">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isLoading ? (
                  [1, 2, 3].map((i) => (
                    <TableRow key={i} className="animate-pulse hover:bg-transparent">
                      <TableCell>
                        <div className="space-y-2">
                          <div className="h-4 w-48 bg-muted rounded" />
                          <div className="h-3 w-32 bg-muted rounded" />
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="h-4 w-24 bg-muted rounded" />
                      </TableCell>
                      <TableCell>
                        <div className="h-4 w-24 bg-muted rounded" />
                      </TableCell>
                      <TableCell>
                        <div className="h-6 w-16 bg-muted rounded-full" />
                      </TableCell>
                      <TableCell>
                        <div className="h-4 w-24 bg-muted rounded" />
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="h-8 w-16 bg-muted rounded ml-auto" />
                      </TableCell>
                    </TableRow>
                  ))
                ) : filteredStudies.length === 0 ? (
                  <TableRow className="hover:bg-transparent">
                    <TableCell colSpan={6} className="text-center py-16 text-muted-foreground">
                      <div className="flex flex-col items-center justify-center space-y-3">
                        <FileBarChart className="h-10 w-10 text-muted-foreground/30" />
                        <p className="font-medium text-base">No case studies found</p>
                        <p className="text-sm">
                          We couldn&apos;t find any case studies matching your search.
                        </p>
                      </div>
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredStudies.map((study) => (
                    <TableRow key={study.id} className="group hover:bg-muted/30 transition-colors">
                      <TableCell className="font-medium">
                        <Link
                          href={`/admin/case-studies/edit/${study.id}`}
                          className="hover:text-indigo-500 transition-colors"
                        >
                          {study.title}
                        </Link>
                      </TableCell>
                      <TableCell>
                        <span className="text-sm">{study.clientName || '-'}</span>
                      </TableCell>
                      <TableCell>
                        <span className="text-sm">{study.industry || '-'}</span>
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant={study.status === 'PUBLISHED' ? 'default' : 'secondary'}
                          className={
                            study.status === 'PUBLISHED'
                              ? 'bg-green-500/10 text-green-500 hover:bg-green-500/20'
                              : ''
                          }
                        >
                          {study.status}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <span className="text-sm text-muted-foreground">
                          {format(new Date(study.createdAt), 'MMM d, yyyy')}
                        </span>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex items-center justify-end space-x-1 opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-opacity">
                          <Button
                            asChild
                            variant="ghost"
                            size="icon-sm"
                            className="cursor-pointer hover:bg-indigo-500/10 hover:text-indigo-500"
                          >
                            <Link href={`/admin/case-studies/edit/${study.id}`}>
                              <span className="sr-only">Edit</span>
                              <Edit className="h-4 w-4" />
                            </Link>
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon-sm"
                            onClick={() => handleDelete(study.id)}
                            className="cursor-pointer text-destructive hover:text-destructive hover:bg-destructive/10"
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
