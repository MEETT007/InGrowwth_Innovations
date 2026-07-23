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
  XCircle,
  FileText,
  Mail,
  X,
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useUser } from '@clerk/nextjs';

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

      {/* Main Content Grid / Drawer */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Leads Table */}
        <div className={selectedLead ? 'lg:col-span-2' : 'lg:col-span-3'}>
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
            <CardContent className="p-0">
              {loading ? (
                <div className="p-4 space-y-4">
                  <div className="animate-pulse flex items-center justify-between pb-3 border-b border-border/30">
                    <div className="h-4 w-32 bg-muted rounded" />
                    <div className="h-4 w-24 bg-muted rounded" />
                    <div className="h-4 w-16 bg-muted rounded" />
                  </div>
                  {[1, 2, 3, 4, 5].map((i) => (
                    <div key={i} className="animate-pulse flex items-center justify-between py-2.5">
                      <div className="space-y-1.5 flex-1">
                        <div className="h-4 w-40 bg-muted rounded" />
                        <div className="h-3 w-48 bg-muted rounded" />
                      </div>
                      <div className="h-6 w-16 bg-muted rounded mx-8" />
                      <div className="h-6 w-20 bg-muted rounded" />
                    </div>
                  ))}
                </div>
              ) : error ? (
                <div className="py-12 text-center text-destructive text-sm flex flex-col items-center gap-2">
                  <XCircle className="h-6 w-6" />
                  <span>{error}</span>
                </div>
              ) : leads.length === 0 ? (
                <div className="py-12 text-center text-muted-foreground text-sm">
                  No lead records match your search criteria.
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs border-collapse">
                    <thead>
                      <tr className="border-b border-border bg-muted/40 font-semibold text-muted-foreground uppercase tracking-wider">
                        <th className="py-3 px-4">Lead Info</th>
                        <th className="py-3 px-4">Type</th>
                        <th className="py-3 px-4">Status</th>
                        <th className="py-3 px-4">Date</th>
                        <th className="py-3 px-4 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-border/60">
                      {leads.map((lead) => (
                        <tr
                          key={lead.id}
                          className={`hover:bg-muted/30 transition-colors ${
                            selectedLead?.id === lead.id ? 'bg-primary/5' : ''
                          }`}
                        >
                          <td className="py-3.5 px-4">
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
                          </td>
                          <td className="py-3.5 px-4">{getTypeBadge(lead.type)}</td>
                          <td className="py-3.5 px-4">
                            {isAdmin ? (
                              <select
                                value={lead.status}
                                disabled={updatingId === lead.id}
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
                            ) : (
                              getStatusBadge(lead.status)
                            )}
                          </td>
                          <td className="py-3.5 px-4 text-muted-foreground whitespace-nowrap">
                            {new Date(lead.createdAt).toLocaleDateString()}
                          </td>
                          <td className="py-3.5 px-4 text-right space-x-1">
                            <Button
                              size="sm"
                              variant="ghost"
                              className="h-8 w-8 p-0"
                              onClick={() => setSelectedLead(lead)}
                              title="View lead details"
                            >
                              <Eye className="h-4 w-4 text-primary" />
                            </Button>

                            {isAdmin && (
                              <Button
                                size="sm"
                                variant="ghost"
                                className="h-8 w-8 p-0 hover:text-destructive"
                                disabled={deletingId === lead.id}
                                onClick={() => handleDeleteLead(lead.id)}
                                title="Delete lead"
                              >
                                <Trash2 className="h-4 w-4 text-destructive" />
                              </Button>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Selected Lead Detail Drawer */}
        {selectedLead && (
          <div className="lg:col-span-1">
            <Card className="border-border/80 sticky top-24">
              <CardHeader className="py-4 px-5 border-b border-border/60 flex flex-row items-center justify-between">
                <div>
                  <CardTitle className="text-base font-semibold">Lead Inspector</CardTitle>
                  <CardDescription className="text-xs">
                    ID: {selectedLead.id.slice(0, 8)}...
                  </CardDescription>
                </div>
                <Button
                  variant="ghost"
                  size="icon-xs"
                  onClick={() => setSelectedLead(null)}
                  className="cursor-pointer text-muted-foreground hover:text-foreground"
                >
                  <X className="h-4 w-4" />
                </Button>
              </CardHeader>

              <CardContent className="p-5 space-y-4 text-xs">
                <div>
                  <label className="text-muted-foreground font-medium block">Lead Type</label>
                  <div className="mt-1">{getTypeBadge(selectedLead.type)}</div>
                </div>

                <div>
                  <label className="text-muted-foreground font-medium block">Current Status</label>
                  <div className="mt-1">{getStatusBadge(selectedLead.status)}</div>
                </div>

                <div>
                  <label className="text-muted-foreground font-medium block">Contact Info</label>
                  <p className="font-bold text-foreground mt-0.5">{selectedLead.name || 'N/A'}</p>
                  <p className="text-muted-foreground font-mono">{selectedLead.email}</p>
                  {selectedLead.phone && (
                    <p className="text-muted-foreground">{selectedLead.phone}</p>
                  )}
                </div>

                {selectedLead.subject && (
                  <div>
                    <label className="text-muted-foreground font-medium block">Subject</label>
                    <p className="font-medium text-foreground mt-0.5">{selectedLead.subject}</p>
                  </div>
                )}

                {selectedLead.message && (
                  <div>
                    <label className="text-muted-foreground font-medium block">Message</label>
                    <div className="mt-1 p-3 rounded-lg bg-muted/40 border border-border/60 whitespace-pre-wrap text-foreground">
                      {selectedLead.message}
                    </div>
                  </div>
                )}

                {selectedLead.service && (
                  <div>
                    <label className="text-muted-foreground font-medium block">
                      Requested Service
                    </label>
                    <p className="font-medium text-primary mt-0.5">{selectedLead.service}</p>
                  </div>
                )}

                {(selectedLead.budget || selectedLead.timeline) && (
                  <div className="grid grid-cols-2 gap-2 pt-2 border-t border-border/40">
                    <div>
                      <label className="text-muted-foreground font-medium block">Budget</label>
                      <p className="font-medium text-foreground">{selectedLead.budget || 'N/A'}</p>
                    </div>
                    <div>
                      <label className="text-muted-foreground font-medium block">Timeline</label>
                      <p className="font-medium text-foreground">
                        {selectedLead.timeline || 'N/A'}
                      </p>
                    </div>
                  </div>
                )}

                {selectedLead.projectDetails && (
                  <div>
                    <label className="text-muted-foreground font-medium block">
                      Project Details
                    </label>
                    <div className="mt-1 p-3 rounded-lg bg-muted/40 border border-border/60 whitespace-pre-wrap text-foreground">
                      {selectedLead.projectDetails}
                    </div>
                  </div>
                )}

                <div className="pt-3 border-t border-border/60 flex items-center justify-between text-[11px] text-muted-foreground">
                  <span>Created: {new Date(selectedLead.createdAt).toLocaleString()}</span>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
}
