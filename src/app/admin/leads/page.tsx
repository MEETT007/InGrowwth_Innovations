'use client';

import React, { useState, useEffect, useCallback } from 'react';
import {
  Users,
  Search,
  Filter,
  Trash2,
  Eye,
  RefreshCw,
  AlertCircle,
  CheckCircle2,
  Clock,
  FileText,
  Mail,
  X,
} from 'lucide-react';
import { ColumnDef } from '@tanstack/react-table';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useUser } from '@clerk/nextjs';
import { DataTable } from '@/components/ui/data-table';
import { LeadDetailsModal } from './components/LeadDetailsModal';

interface Lead {
  id: string;
  type: 'CONTACT' | 'QUOTE' | 'NEWSLETTER';
  status: 'NEW' | 'CONTACTED' | 'CLOSED';
  email: string;
  name?: string | null;
  phone?: string | null;
  subject?: string | null;
  message?: string | null;
  budget?: string | null;
  timeline?: string | null;
  service?: string | null;
  projectDetails?: string | null;
  fileUrl?: string | null;
  createdAt: string;
}

export default function AdminLeadsPage() {
  const { user } = useUser();
  const role = (user?.publicMetadata?.role as string) || 'admin';
  const isAdmin = role === 'admin';

  const [leads, setLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState('');
  const [typeFilter, setTypeFilter] = useState<string>('ALL');
  const [statusFilter, setStatusFilter] = useState<string>('ALL');

  const [selectedLead, setSelectedLead] = useState<Lead | null>(null);
  const [updatingId, setUpdatingId] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [feedback, setFeedback] = useState<{ message: string; isError?: boolean } | null>(null);

  const fetchLeads = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const params = new URLSearchParams();
      if (typeFilter !== 'ALL') params.append('type', typeFilter);
      if (statusFilter !== 'ALL') params.append('status', statusFilter);
      if (search.trim()) params.append('q', search.trim());

      const res = await fetch(`/api/admin/leads?${params.toString()}`);
      const json = await res.json();

      if (!res.ok) {
        throw new Error(json.message || 'Failed to fetch leads records.');
      }

      setLeads(json.data || []);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Error loading leads';
      setError(msg);
    } finally {
      setLoading(false);
    }
  }, [typeFilter, statusFilter, search]);

  useEffect(() => {
    let ignore = false;
    const loadLeads = async () => {
      try {
        const params = new URLSearchParams();
        if (typeFilter !== 'ALL') params.append('type', typeFilter);
        if (statusFilter !== 'ALL') params.append('status', statusFilter);
        if (search.trim()) params.append('q', search.trim());

        const res = await fetch(`/api/admin/leads?${params.toString()}`);
        const json = await res.json();

        if (!ignore) {
          if (!res.ok) {
            throw new Error(json.message || 'Failed to fetch leads records.');
          }
          setLeads(json.data || []);
          setError(null);
        }
      } catch (err: unknown) {
        if (!ignore) {
          const msg = err instanceof Error ? err.message : 'Error loading leads';
          setError(msg);
        }
      } finally {
        if (!ignore) {
          setLoading(false);
        }
      }
    };

    loadLeads();
    return () => {
      ignore = true;
    };
  }, [typeFilter, statusFilter, search]);

  const handleStatusUpdate = async (leadId: string, newStatus: 'NEW' | 'CONTACTED' | 'CLOSED') => {
    setUpdatingId(leadId);
    setFeedback(null);
    try {
      const res = await fetch(`/api/admin/leads/${leadId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus }),
      });
      const json = await res.json();

      if (!res.ok) {
        throw new Error(json.message || 'Failed to update status.');
      }

      setLeads((prev) => prev.map((l) => (l.id === leadId ? { ...l, status: newStatus } : l)));
      if (selectedLead?.id === leadId) {
        setSelectedLead((prev) => (prev ? { ...prev, status: newStatus } : null));
      }
      setFeedback({ message: `Status updated to ${newStatus}` });
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Error updating status';
      setFeedback({ message: msg, isError: true });
    } finally {
      setUpdatingId(null);
    }
  };

  const handleDeleteLead = async (leadId: string) => {
    if (!confirm('Are you sure you want to delete this lead? This action cannot be undone.')) {
      return;
    }

    setDeletingId(leadId);
    setFeedback(null);
    try {
      const res = await fetch(`/api/admin/leads/${leadId}`, {
        method: 'DELETE',
      });
      const json = await res.json();

      if (!res.ok) {
        throw new Error(json.message || 'Failed to delete lead.');
      }

      setLeads((prev) => prev.filter((l) => l.id !== leadId));
      if (selectedLead?.id === leadId) {
        setSelectedLead(null);
      }
      setFeedback({ message: 'Lead deleted successfully.' });
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Error deleting lead';
      setFeedback({ message: msg, isError: true });
    } finally {
      setDeletingId(null);
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'NEW':
        return (
          <span className="inline-flex items-center gap-1 text-xs font-semibold px-2.5 py-1 rounded-full bg-blue-500/15 text-blue-600 dark:text-blue-400">
            <Clock className="h-3 w-3" /> New
          </span>
        );
      case 'CONTACTED':
        return (
          <span className="inline-flex items-center gap-1 text-xs font-semibold px-2.5 py-1 rounded-full bg-amber-500/15 text-amber-600 dark:text-amber-400">
            <AlertCircle className="h-3 w-3" /> Contacted
          </span>
        );
      case 'CLOSED':
        return (
          <span className="inline-flex items-center gap-1 text-xs font-semibold px-2.5 py-1 rounded-full bg-emerald-500/15 text-emerald-600 dark:text-emerald-400">
            <CheckCircle2 className="h-3 w-3" /> Closed
          </span>
        );
      default:
        return <span className="text-xs">{status}</span>;
    }
  };

  const getTypeBadge = (type: string) => {
    switch (type) {
      case 'CONTACT':
        return (
          <span className="inline-flex items-center gap-1 text-xs font-medium px-2 py-0.5 rounded bg-purple-500/10 text-purple-600 dark:text-purple-400 border border-purple-500/20">
            <Mail className="h-3 w-3" /> Contact
          </span>
        );
      case 'QUOTE':
        return (
          <span className="inline-flex items-center gap-1 text-xs font-medium px-2 py-0.5 rounded bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20">
            <FileText className="h-3 w-3" /> Quote
          </span>
        );
      case 'NEWSLETTER':
        return (
          <span className="inline-flex items-center gap-1 text-xs font-medium px-2 py-0.5 rounded bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 border border-cyan-500/20">
            <Users className="h-3 w-3" /> Newsletter
          </span>
        );
      default:
        return <span className="text-xs">{type}</span>;
    }
  };

  const columns: ColumnDef<Lead>[] = [
    {
      accessorKey: 'name',
      header: 'Lead Info',
      cell: ({ row }) => {
        const lead = row.original;
        return (
          <div className="py-2">
            <div className="font-semibold text-foreground">
              {lead.name || 'Anonymous / Subscriber'}
            </div>
            <div className="text-muted-foreground text-[11px] font-mono">
              {lead.email}
            </div>
            {lead.subject && (
              <div className="text-[11px] text-muted-foreground/80 truncate max-w-xs mt-0.5">
                Subj: {lead.subject}
              </div>
            )}
          </div>
        );
      },
    },
    {
      accessorKey: 'type',
      header: 'Type',
      cell: ({ row }) => getTypeBadge(row.original.type),
    },
    {
      accessorKey: 'status',
      header: 'Status',
      cell: ({ row }) => {
        const lead = row.original;
        if (isAdmin) {
          return (
            <select
              value={lead.status}
              disabled={updatingId === lead.id}
              onClick={(e) => e.stopPropagation()}
              onChange={(e) =>
                handleStatusUpdate(
                  lead.id,
                  e.target.value as 'NEW' | 'CONTACTED' | 'CLOSED'
                )
              }
              className="bg-background border border-border rounded px-2 py-1 text-xs font-semibold focus:outline-none"
            >
              <option value="NEW">NEW</option>
              <option value="CONTACTED">CONTACTED</option>
              <option value="CLOSED">CLOSED</option>
            </select>
          );
        }
        return getStatusBadge(lead.status);
      },
    },
    {
      accessorKey: 'createdAt',
      header: 'Date',
      cell: ({ row }) => (
        <span className="text-muted-foreground whitespace-nowrap">
          {new Date(row.original.createdAt).toLocaleDateString()}
        </span>
      ),
    },
    {
      id: 'actions',
      header: () => <div className="text-right">Actions</div>,
      cell: ({ row }) => {
        const lead = row.original;
        return (
          <div className="flex items-center justify-end space-x-1 opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-opacity">
            <Button
              size="icon-sm"
              variant="ghost"
              onClick={(e) => {
                e.stopPropagation();
                setSelectedLead(lead);
              }}
              className="cursor-pointer text-primary hover:bg-primary/10"
              title="View lead details"
            >
              <span className="sr-only">View</span>
              <Eye className="h-4 w-4" />
            </Button>
            {isAdmin && (
              <Button
                size="icon-sm"
                variant="ghost"
                disabled={deletingId === lead.id}
                onClick={(e) => {
                  e.stopPropagation();
                  handleDeleteLead(lead.id);
                }}
                className="cursor-pointer text-destructive hover:text-destructive hover:bg-destructive/10"
                title="Delete lead"
              >
                <span className="sr-only">Delete</span>
                <Trash2 className="h-4 w-4" />
              </Button>
            )}
          </div>
        );
      },
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border/80 pb-5">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight text-foreground flex items-center gap-2">
            <Users className="h-7 w-7 text-primary" />
            <span>Lead Management CMS</span>
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            View, filter, update status, and manage client inquiries and quote requests.
          </p>
        </div>

        <Button
          onClick={fetchLeads}
          variant="outline"
          size="sm"
          className="flex items-center gap-2 font-medium"
        >
          <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
          <span>Refresh</span>
        </Button>
      </div>

      {/* Action feedback banner */}
      {feedback && (
        <div
          className={`p-3 rounded-lg border text-sm flex items-center justify-between ${
            feedback.isError
              ? 'bg-destructive/15 text-destructive border-destructive/30'
              : 'bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border-emerald-500/30'
          }`}
        >
          <span>{feedback.message}</span>
          <Button
            variant="ghost"
            size="icon-xs"
            onClick={() => setFeedback(null)}
            className="cursor-pointer text-muted-foreground hover:text-foreground"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      )}

      {/* Filter & Search Bar */}
      <Card className="border-border/80">
        <CardContent className="p-4 sm:p-6 space-y-4">
          <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
            {/* Search Input */}
            <div className="relative w-full md:w-80">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <input
                type="text"
                placeholder="Search by name, email, subject..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-9 pr-4 py-2 bg-background border border-border rounded-lg text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
              />
            </div>

            {/* Dropdown Filters */}
            <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
              <div className="flex items-center gap-2 text-xs font-semibold text-muted-foreground">
                <Filter className="h-3.5 w-3.5" />
                <span>Type:</span>
              </div>
              <select
                value={typeFilter}
                onChange={(e) => setTypeFilter(e.target.value)}
                className="bg-background border border-border rounded-lg text-xs font-medium px-3 py-2 text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
              >
                <option value="ALL">All Types</option>
                <option value="CONTACT">Contact Form</option>
                <option value="QUOTE">Quote Request</option>
                <option value="NEWSLETTER">Newsletter</option>
              </select>

              <div className="flex items-center gap-2 text-xs font-semibold text-muted-foreground ml-2">
                <span>Status:</span>
              </div>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="bg-background border border-border rounded-lg text-xs font-medium px-3 py-2 text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
              >
                <option value="ALL">All Statuses</option>
                <option value="NEW">New</option>
                <option value="CONTACTED">Contacted</option>
                <option value="CLOSED">Closed</option>
              </select>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="border-border/80">
        <CardHeader className="py-4 px-6 border-b border-border/60">
          <CardTitle className="text-base font-semibold flex items-center justify-between">
            <span>Leads ({leads.length})</span>
            {!isAdmin && (
              <span className="text-xs font-normal text-muted-foreground bg-muted px-2 py-0.5 rounded">
                Read-only (Editor Role)
              </span>
            )}
          </CardTitle>
        </CardHeader>
        <CardContent className="p-1">
          {loading ? (
            <div className="p-8 text-center text-muted-foreground animate-pulse">Loading leads...</div>
          ) : leads.length === 0 ? (
            <div className="py-12 text-center text-muted-foreground text-sm">
              No lead records match your search criteria.
            </div>
          ) : (
            <DataTable
              columns={columns}
              data={leads}
              searchKey="name"
              searchPlaceholder="Search leads..."
              onRowClick={(row) => setSelectedLead(row)}
            />
          )}
        </CardContent>
      </Card>

      <LeadDetailsModal
        isOpen={!!selectedLead}
        onClose={() => setSelectedLead(null)}
        lead={selectedLead}
      />
    </div>
  );
}
