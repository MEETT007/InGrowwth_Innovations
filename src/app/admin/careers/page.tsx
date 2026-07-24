'use client';

import { useState, useEffect } from 'react';
import { toast } from 'sonner';
import {
  FileText,
  Trash2,
  Mail,
  Phone,
  Briefcase,
  ExternalLink,
  GraduationCap,
} from 'lucide-react';

import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
  CardFooter,
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

interface JobApplication {
  id: string;
  candidateName: string;
  email: string;
  phone: string | null;
  roleAppliedFor: string;
  resumeUrl: string | null;
  coverLetter: string | null;
  status: string;
  createdAt: string;
}

export default function CareersPage() {
  const [applications, setApplications] = useState<JobApplication[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchApplications = async () => {
    setIsLoading(true);
    try {
      const response = await fetch('/api/admin/careers');
      const res = await response.json();
      if (res.success) {
        setApplications(res.data);
      } else {
        toast.error(res.message || 'Failed to fetch applications.');
      }
    } catch (error) {
      console.error('Error fetching applications:', error);
      toast.error('Failed to connect to careers API.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchApplications();
  }, []);

  const handleStatusChange = async (id: string, newStatus: string) => {
    const toastId = toast.loading('Updating status...');
    try {
      const response = await fetch(`/api/admin/careers/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus }),
      });
      const res = await response.json();
      if (res.success) {
        toast.success(res.message, { id: toastId });
        setApplications((prev) =>
          prev.map((app) => (app.id === id ? { ...app, status: newStatus } : app))
        );
      } else {
        toast.error(res.message || 'Action failed.', { id: toastId });
      }
    } catch (error) {
      console.error('Error updating application:', error);
      toast.error('Failed to update status.', { id: toastId });
    }
  };

  const handleDelete = async (id: string) => {
    if (confirm('Are you sure you want to remove this application?')) {
      const toastId = toast.loading('Removing application...');
      try {
        const response = await fetch(`/api/admin/careers/${id}`, {
          method: 'DELETE',
        });
        const res = await response.json();
        if (res.success) {
          toast.success(res.message, { id: toastId });
          fetchApplications();
        } else {
          toast.error(res.message || 'Failed to remove application.', { id: toastId });
        }
      } catch (error) {
        console.error('Error removing application:', error);
        toast.error('An error occurred.', { id: toastId });
      }
    }
  };

  const getStatusBadgeVariant = (status: string) => {
    switch (status) {
      case 'NEW':
        return 'bg-blue-500/20 text-blue-400 border-blue-500/30';
      case 'REVIEWED':
        return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30';
      case 'INTERVIEW':
        return 'bg-purple-500/20 text-purple-400 border-purple-500/30';
      case 'REJECTED':
        return 'bg-red-500/20 text-red-400 border-red-500/30';
      case 'HIRED':
        return 'bg-green-500/20 text-green-400 border-green-500/30';
      default:
        return 'bg-muted/50 text-muted-foreground border-border/50';
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 relative">
      {/* Ambient Glow */}
      <div className="absolute top-0 right-1/4 w-[30rem] h-[30rem] bg-indigo-500/10 rounded-full blur-[120px] -z-10 pointer-events-none" />

      {/* Header Section */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-indigo-500/5 via-purple-500/5 to-pink-500/5 border border-white/10 p-8 md:p-10 shadow-2xl backdrop-blur-xl">
        <div className="absolute top-0 right-0 p-8 opacity-10">
          <GraduationCap className="w-32 h-32 text-indigo-400 rotate-12" />
        </div>

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex flex-col gap-2">
            <div className="flex items-center gap-3">
              <h1 className="text-4xl md:text-5xl font-black tracking-tight text-transparent bg-clip-text bg-gradient-to-br from-white via-white to-white/60 drop-shadow-sm">
                Career Applications
              </h1>
            </div>
            <p className="text-muted-foreground max-w-2xl text-lg leading-relaxed">
              Review and manage incoming job applications and candidate resumes.
            </p>
          </div>
        </div>
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3].map((i) => (
            <Card
              key={i}
              className="animate-pulse border-border/40 bg-card/30 h-64 flex flex-col justify-center items-center p-6 space-y-4"
            >
              <div className="h-16 w-16 rounded-xl bg-muted" />
              <div className="h-4 w-32 bg-muted rounded" />
              <div className="h-3 w-48 bg-muted rounded" />
            </Card>
          ))}
        </div>
      ) : applications.length === 0 ? (
        <Card className="flex flex-col items-center justify-center py-20 text-center shadow-sm bg-background/40 backdrop-blur-xl border-white/5">
          <FileText className="h-16 w-16 text-muted-foreground opacity-20 mb-4" />
          <h3 className="text-xl font-medium text-foreground">No applications found</h3>
          <p className="text-muted-foreground mt-2 max-w-sm">
            You haven&apos;t received any job applications yet. They will appear here once
            candidates apply.
          </p>
        </Card>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
          {applications.map((app) => (
            <Card
              key={app.id}
              className="group relative overflow-hidden transition-all duration-300 border-white/10 bg-background/50 hover:bg-background/80 backdrop-blur-xl hover:shadow-xl hover:border-indigo-500/30 flex flex-col"
            >
              <CardHeader className="pb-4">
                <div className="flex justify-between items-start mb-2">
                  <Badge variant="outline" className={getStatusBadgeVariant(app.status)}>
                    {app.status}
                  </Badge>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 text-muted-foreground hover:text-destructive hover:bg-destructive/10 -mt-2 -mr-2"
                    onClick={() => handleDelete(app.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
                <CardTitle className="text-xl font-bold">{app.candidateName}</CardTitle>
                <CardDescription className="flex items-center gap-1.5 mt-1.5 text-indigo-400 font-medium">
                  <Briefcase className="h-4 w-4" />
                  {app.roleAppliedFor}
                </CardDescription>
              </CardHeader>

              <CardContent className="space-y-4 flex-1">
                <div className="space-y-2">
                  <a
                    href={`mailto:${app.email}`}
                    className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors group/link"
                  >
                    <Mail className="h-4 w-4 text-muted-foreground group-hover/link:text-primary transition-colors" />
                    <span className="truncate">{app.email}</span>
                  </a>
                  {app.phone && (
                    <a
                      href={`tel:${app.phone}`}
                      className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors group/link"
                    >
                      <Phone className="h-4 w-4 text-muted-foreground group-hover/link:text-primary transition-colors" />
                      <span>{app.phone}</span>
                    </a>
                  )}
                </div>

                {app.coverLetter && (
                  <div className="pt-2 border-t border-white/5">
                    <p className="text-xs text-muted-foreground line-clamp-3">{app.coverLetter}</p>
                  </div>
                )}
              </CardContent>

              <CardFooter className="pt-4 border-t border-white/5 flex gap-3">
                <Select
                  value={app.status ?? ''}
                  onValueChange={(val) => handleStatusChange(String(app.id), String(val))}
                >
                  <SelectTrigger className="flex-1 bg-background/50 border-white/10 h-10">
                    <SelectValue placeholder="Update Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="NEW">New</SelectItem>
                    <SelectItem value="REVIEWED">Reviewed</SelectItem>
                    <SelectItem value="INTERVIEW">Interview</SelectItem>
                    <SelectItem value="HIRED">Hired</SelectItem>
                    <SelectItem value="REJECTED">Rejected</SelectItem>
                  </SelectContent>
                </Select>

                {app.resumeUrl && (
                  <Button
                    render={<a href={app.resumeUrl} target="_blank" rel="noreferrer" />}
                    variant="outline"
                    className="flex-1 bg-indigo-500/10 hover:bg-indigo-500/20 text-indigo-400 border-indigo-500/30 h-10 group/btn"
                  >
                    <span className="flex items-center justify-center">
                      <FileText className="h-4 w-4 mr-2 group-hover/btn:scale-110 transition-transform" />
                      Resume
                      <ExternalLink className="h-3 w-3 ml-1 opacity-50" />
                    </span>
                  </Button>
                )}
              </CardFooter>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
