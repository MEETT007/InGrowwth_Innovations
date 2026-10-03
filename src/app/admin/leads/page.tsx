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
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useUser } from '@clerk/nextjs';
import { DataTable } from '@/components/ui/data-table';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { LeadDetailsModal } from './components/LeadDetailsModal';

interface Lead {
  id: string;
  type: 'CONTACT' | 'QUOTE';
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
  const [, setError] = useState<string | null>(null);
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
            <div className="text-muted-foreground text-[11px] font-mono">{lead.email}</div>
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
            <div onClick={(e) => e.stopPropagation()} className="w-[145px]">
              <Select
                value={lead.status}
                disabled={updatingId === lead.id}
                onValueChange={(val) =>
                  handleStatusUpdate(lead.id, val as 'NEW' | 'CONTACTED' | 'CLOSED')
                }
              >
                <SelectTrigger
                  className={`h-7 px-2.5 py-1 text-xs font-bold rounded-full border transition-all cursor-pointer ${
                    lead.status === 'NEW'
                      ? 'bg-blue-500/10 text-blue-400 border-blue-500/30 hover:bg-blue-500/20 shadow-xs'
                      : lead.status === 'CONTACTED'
                      ? 'bg-amber-500/10 text-amber-400 border-amber-500/30 hover:bg-amber-500/20 shadow-xs'
                      : 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30 hover:bg-emerald-500/20 shadow-xs'
                  }`}
                >
                  <span className="flex items-center gap-1.5 truncate">
                    <span
                      className={`w-1.5 h-1.5 rounded-full shrink-0 ${
                        lead.status === 'NEW'
                          ? 'bg-blue-400 animate-pulse'
                          : lead.status === 'CONTACTED'
                          ? 'bg-amber-400'
                          : 'bg-emerald-400'
                      }`}
                    />
                    <SelectValue />
                  </span>
                </SelectTrigger>
                <SelectContent className="bg-slate-950/95 border-white/10 backdrop-blur-xl">
                  <SelectItem value="NEW" className="text-xs font-semibold text-blue-400 focus:bg-blue-500/15 cursor-pointer">
                    <span className="flex items-center gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-blue-400 animate-pulse" />
                      NEW (Unreviewed)
                    </span>
                  </SelectItem>
                  <SelectItem value="CONTACTED" className="text-xs font-semibold text-amber-400 focus:bg-amber-500/15 cursor-pointer">
                    <span className="flex items-center gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
                      CONTACTED
                    </span>
                  </SelectItem>
                  <SelectItem value="CLOSED" className="text-xs font-semibold text-emerald-400 focus:bg-emerald-500/15 cursor-pointer">
                    <span className="flex items-center gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                      CLOSED
                    </span>
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
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

  // Real-time KPI counts from current leads
  const stats = React.useMemo(() => {
    const total = leads.length;
    const newCount = leads.filter((l) => l.status === 'NEW').length;
    const contactedCount = leads.filter((l) => l.status === 'CONTACTED').length;
    const closedCount = leads.filter((l) => l.status === 'CLOSED').length;
    const quoteCount = leads.filter((l) => l.type === 'QUOTE').length;
    return { total, newCount, contactedCount, closedCount, quoteCount };
  }, [leads]);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border/80 pb-5">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight text-foreground flex items-center gap-2">
            <Users className="h-7 w-7 text-indigo-400" />
            <span>Lead Management CMS</span>
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            Enterprise inquiry triage. Filter, inspect submissions, and orchestrate customer outreach.
          </p>
        </div>

        <Button
          onClick={fetchLeads}
          variant="outline"
          size="sm"
          className="flex items-center gap-2 font-medium cursor-pointer rounded-xl bg-background/50 border-white/10 hover:bg-muted/50"
        >
          <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
          <span>Refresh</span>
        </Button>
      </div>

      {/* Action feedback banner */}
      {feedback && (
        <div
          className={`p-3 rounded-xl border text-sm flex items-center justify-between ${
            feedback.isError
              ? 'bg-destructive/15 text-destructive border-destructive/30'
              : 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30'
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

      {/* Executive KPI Ribbon */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <Card className="border border-white/10 bg-card/60 backdrop-blur-xl p-4 space-y-1">
          <div className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
            Total Leads
          </div>
          <div className="text-2xl font-black text-foreground">{stats.total}</div>
          <div className="text-[11px] text-muted-foreground">{stats.quoteCount} Quote Requests</div>
        </Card>

        <Card className="border border-blue-500/20 bg-blue-500/5 backdrop-blur-xl p-4 space-y-1">
          <div className="text-xs font-semibold text-blue-400 uppercase tracking-wider flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-blue-400 animate-pulse" />
            New / Unreviewed
          </div>
          <div className="text-2xl font-black text-blue-400">{stats.newCount}</div>
          <div className="text-[11px] text-muted-foreground">Action required</div>
        </Card>

        <Card className="border border-amber-500/20 bg-amber-500/5 backdrop-blur-xl p-4 space-y-1">
          <div className="text-xs font-semibold text-amber-400 uppercase tracking-wider flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-amber-400" />
            In Discussion
          </div>
          <div className="text-2xl font-black text-amber-400">{stats.contactedCount}</div>
          <div className="text-[11px] text-muted-foreground">Contacted leads</div>
        </Card>

        <Card className="border border-emerald-500/20 bg-emerald-500/5 backdrop-blur-xl p-4 space-y-1">
          <div className="text-xs font-semibold text-emerald-400 uppercase tracking-wider flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-400" />
            Closed / Won
          </div>
          <div className="text-2xl font-black text-emerald-400">{stats.closedCount}</div>
          <div className="text-[11px] text-muted-foreground">Resolved inquiries</div>
        </Card>
      </div>

      {/* Filter & Single Search Bar */}
      <Card className="border border-white/10 bg-card/60 backdrop-blur-xl">
        <CardContent className="p-4 sm:p-5">
          <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
            {/* Unified Search Input */}
            <div className="relative w-full md:w-96">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <input
                type="text"
                placeholder="Search leads by name, email, subject..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-background/60 border border-white/10 rounded-xl text-xs sm:text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all placeholder:text-muted-foreground shadow-xs"
              />
              {search && (
                <button
                  onClick={() => setSearch('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-muted-foreground hover:text-foreground cursor-pointer"
                >
                  Clear
                </button>
              )}
            </div>

            {/* Professional Select Dropdown Filters */}
            <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
              <div className="flex items-center gap-2">
                <span className="text-xs font-semibold text-muted-foreground flex items-center gap-1">
                  <Filter className="h-3.5 w-3.5" /> Type:
                </span>
                <Select value={typeFilter} onValueChange={(val) => setTypeFilter(val || 'ALL')}>
                  <SelectTrigger className="w-[140px] bg-background/60 border-white/10 text-xs font-semibold h-9 rounded-xl">
                    <SelectValue placeholder="All Types" />
                  </SelectTrigger>
                  <SelectContent className="bg-slate-950/95 border-white/10 backdrop-blur-xl">
                    <SelectItem value="ALL" className="text-xs font-medium cursor-pointer">
                      All Types
                    </SelectItem>
                    <SelectItem value="CONTACT" className="text-xs font-medium cursor-pointer">
                      Contact Form
                    </SelectItem>
                    <SelectItem value="QUOTE" className="text-xs font-medium cursor-pointer">
                      Quote Request
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="flex items-center gap-2">
                <span className="text-xs font-semibold text-muted-foreground flex items-center gap-1">
                  <Clock className="h-3.5 w-3.5" /> Status:
                </span>
                <Select value={statusFilter} onValueChange={(val) => setStatusFilter(val || 'ALL')}>
                  <SelectTrigger className="w-[140px] bg-background/60 border-white/10 text-xs font-semibold h-9 rounded-xl">
                    <SelectValue placeholder="All Statuses" />
                  </SelectTrigger>
                  <SelectContent className="bg-slate-950/95 border-white/10 backdrop-blur-xl">
                    <SelectItem value="ALL" className="text-xs font-medium cursor-pointer">
                      All Statuses
                    </SelectItem>
                    <SelectItem value="NEW" className="text-xs font-medium text-blue-400 cursor-pointer">
                      New
                    </SelectItem>
                    <SelectItem value="CONTACTED" className="text-xs font-medium text-amber-400 cursor-pointer">
                      Contacted
                    </SelectItem>
                    <SelectItem value="CLOSED" className="text-xs font-medium text-emerald-400 cursor-pointer">
                      Closed
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Leads Table Container (Single clean search, no duplicate search bar!) */}
      <Card className="border border-white/10 bg-card/60 backdrop-blur-xl shadow-xl overflow-hidden">
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
            <div className="p-8 text-center text-muted-foreground animate-pulse">
              Loading leads...
            </div>
          ) : leads.length === 0 ? (
            <div className="py-12 text-center text-muted-foreground text-sm">
              No lead records match your search criteria.
            </div>
          ) : (
            <DataTable
              columns={columns}
              data={leads}
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
