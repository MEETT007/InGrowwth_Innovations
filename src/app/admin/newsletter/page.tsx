'use client';

import React, { useState, useEffect } from 'react';
import { toast } from 'sonner';
import {
  Plus,
  Edit,
  Trash2,
  Search,
  Mail,
  Users,
  Send,
  Sparkles,
  Calendar,
  CheckCircle2,
  Clock,
  Radio,
  ExternalLink,
  RefreshCw,
} from 'lucide-react';
import { format } from 'date-fns';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { NewsletterCampaignModal } from './components/NewsletterCampaignModal';

interface Campaign {
  id: string;
  subject: string;
  preheader?: string | null;
  bannerImage?: string | null;
  content: string;
  ctaText?: string | null;
  ctaUrl?: string | null;
  targetAudience?: string;
  status: string;
  scheduledFor: string | null;
  sentAt: string | null;
  createdAt: string;
}

interface Subscriber {
  id: string;
  email: string;
  name: string | null;
  status: string;
  subscribedAt: string;
}

export default function NewsletterIndexPage() {
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [subscribers, setSubscribers] = useState<Subscriber[]>([]);
  const [isLoadingCampaigns, setIsLoadingCampaigns] = useState(true);
  const [isLoadingSubs, setIsLoadingSubs] = useState(true);
  const [search, setSearch] = useState('');

  // Modal State for Add/Edit Campaign
  const [isCampaignModalOpen, setIsCampaignModalOpen] = useState(false);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [selectedCampaign, setSelectedCampaign] = useState<any>(null);

  const fetchCampaigns = async () => {
    setIsLoadingCampaigns(true);
    try {
      const response = await fetch('/api/admin/newsletter/campaigns');
      const res = await response.json();
      if (res.success) {
        setCampaigns(res.data);
      }
    } catch {
      toast.error('Failed to load campaigns.');
    } finally {
      setIsLoadingCampaigns(false);
    }
  };

  const fetchSubscribers = async () => {
    setIsLoadingSubs(true);
    try {
      const response = await fetch('/api/admin/newsletter/subscribers');
      const res = await response.json();
      if (res.success) {
        setSubscribers(res.data);
      }
    } catch {
      toast.error('Failed to fetch subscribers.');
    } finally {
      setIsLoadingSubs(false);
    }
  };

  useEffect(() => {
    fetchCampaigns();
    fetchSubscribers();
  }, []);

  const handleDeleteCampaign = async (id: string) => {
    if (confirm('Are you sure you want to delete this campaign? This action cannot be undone.')) {
      const toastId = toast.loading('Deleting campaign...');
      try {
        const response = await fetch(`/api/admin/newsletter/campaigns/${id}`, {
          method: 'DELETE',
        });
        const res = await response.json();
        if (res.success) {
          toast.success(res.message, { id: toastId });
          fetchCampaigns();
        } else {
          toast.error(res.message, { id: toastId });
        }
      } catch {
        toast.error('An error occurred.', { id: toastId });
      }
    }
  };

  const handleSendCampaign = async (id: string) => {
    if (confirm('Are you sure you want to send this broadcast to all active subscribers now?')) {
      const toastId = toast.loading('Dispatching broadcast campaign...');
      try {
        const response = await fetch(`/api/admin/newsletter/campaigns/${id}/send`, {
          method: 'POST',
        });
        const res = await response.json();
        if (res.success) {
          toast.success(res.message, { id: toastId });
          fetchCampaigns();
        } else {
          toast.error(res.message, { id: toastId });
        }
      } catch {
        toast.error('Failed to dispatch campaign.', { id: toastId });
      }
    }
  };

  const handleDeleteSubscriber = async (id: string) => {
    if (confirm('Remove this subscriber from the mailing list?')) {
      const toastId = toast.loading('Removing subscriber...');
      try {
        const response = await fetch(`/api/admin/newsletter/subscribers/${id}`, {
          method: 'DELETE',
        });
        const res = await response.json();
        if (res.success) {
          toast.success(res.message || 'Subscriber removed.', { id: toastId });
          fetchSubscribers();
        } else {
          toast.error(res.message || 'Action failed.', { id: toastId });
        }
      } catch {
        toast.error('Failed to remove subscriber.', { id: toastId });
      }
    }
  };

  const filteredCampaigns = campaigns.filter(
    (c) =>
      c.subject.toLowerCase().includes(search.toLowerCase()) ||
      (c.preheader && c.preheader.toLowerCase().includes(search.toLowerCase()))
  );

  const filteredSubs = subscribers.filter(
    (s) =>
      s.email.toLowerCase().includes(search.toLowerCase()) ||
      (s.name && s.name.toLowerCase().includes(search.toLowerCase()))
  );

  const sentCount = campaigns.filter((c) => c.status === 'SENT').length;
  const draftCount = campaigns.filter((c) => c.status !== 'SENT').length;

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-border/80 pb-5">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-3xl font-extrabold tracking-tight text-foreground flex items-center gap-2">
              <Mail className="h-7 w-7 text-indigo-400" />
              <span>Newsletter & Campaigns</span>
            </h1>
            <Badge variant="outline" className="bg-indigo-500/10 text-indigo-400 border-indigo-500/20 text-xs">
              Broadcast Studio
            </Badge>
          </div>
          <p className="text-sm text-muted-foreground mt-1">
            Orchestrate email newsletters, design branded broadcasts, and monitor subscriber engagement.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Button
            onClick={() => {
              fetchCampaigns();
              fetchSubscribers();
            }}
            variant="outline"
            size="sm"
            className="rounded-xl border-white/10 bg-background/50 hover:bg-muted/50 cursor-pointer"
          >
            <RefreshCw className={`h-4 w-4 ${isLoadingCampaigns || isLoadingSubs ? 'animate-spin' : ''}`} />
          </Button>

          <Button
            onClick={() => {
              setSelectedCampaign(null);
              setIsCampaignModalOpen(true);
            }}
            className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white rounded-xl shadow-lg shadow-indigo-500/25 cursor-pointer font-semibold px-4"
          >
            <Plus className="mr-1.5 h-4 w-4" /> Add New Campaign
          </Button>
        </div>
      </div>

      {/* Audience & Delivery Metrics Ribbon */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card className="border border-white/10 bg-card/60 backdrop-blur-xl p-4 space-y-1">
          <div className="text-xs font-semibold text-muted-foreground uppercase tracking-wider flex items-center justify-between">
            <span>Total Subscribers</span>
            <Users className="h-4 w-4 text-indigo-400" />
          </div>
          <div className="text-2xl font-black text-foreground">{subscribers.length}</div>
          <div className="text-[11px] text-emerald-400 font-medium">Active audience pool</div>
        </Card>

        <Card className="border border-white/10 bg-card/60 backdrop-blur-xl p-4 space-y-1">
          <div className="text-xs font-semibold text-muted-foreground uppercase tracking-wider flex items-center justify-between">
            <span>Broadcasts Sent</span>
            <CheckCircle2 className="h-4 w-4 text-emerald-400" />
          </div>
          <div className="text-2xl font-black text-foreground">{sentCount}</div>
          <div className="text-[11px] text-muted-foreground">Dispatched campaigns</div>
        </Card>

        <Card className="border border-white/10 bg-card/60 backdrop-blur-xl p-4 space-y-1">
          <div className="text-xs font-semibold text-muted-foreground uppercase tracking-wider flex items-center justify-between">
            <span>Queue & Drafts</span>
            <Clock className="h-4 w-4 text-amber-400" />
          </div>
          <div className="text-2xl font-black text-foreground">{draftCount}</div>
          <div className="text-[11px] text-muted-foreground">Scheduled or in draft</div>
        </Card>

        <Card className="border border-white/10 bg-card/60 backdrop-blur-xl p-4 space-y-1">
          <div className="text-xs font-semibold text-muted-foreground uppercase tracking-wider flex items-center justify-between">
            <span>Delivery Reliability</span>
            <Radio className="h-4 w-4 text-purple-400" />
          </div>
          <div className="text-2xl font-black text-emerald-400">99.8%</div>
          <div className="text-[11px] text-muted-foreground">Inbox placement rate</div>
        </Card>
      </div>

      {/* Main Tabs: Campaigns vs Subscribers */}
      <Tabs defaultValue="campaigns" className="w-full">
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 mb-4">
          <TabsList className="w-full sm:w-auto grid grid-cols-2">
            <TabsTrigger value="campaigns" className="text-xs font-semibold">
              <Mail className="h-4 w-4 mr-2" /> Campaigns ({campaigns.length})
            </TabsTrigger>
            <TabsTrigger value="subscribers" className="text-xs font-semibold">
              <Users className="h-4 w-4 mr-2" /> Subscribers ({subscribers.length})
            </TabsTrigger>
          </TabsList>

          <div className="relative w-full sm:w-72">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search campaigns or emails..."
              className="pl-9 bg-background/50 border-white/10 text-xs rounded-xl"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        </div>

        {/* TAB 1: CAMPAIGNS */}
        <TabsContent value="campaigns">
          <Card className="shadow-sm border border-white/10 bg-card/60 backdrop-blur-xl relative overflow-hidden">
            <CardHeader className="py-4 px-6 border-b border-border/50">
              <CardTitle className="text-base font-semibold">All Email Campaigns</CardTitle>
              <CardDescription className="text-xs">
                History of created, scheduled, and dispatched broadcasts
              </CardDescription>
            </CardHeader>
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader className="bg-muted/30">
                    <TableRow>
                      <TableHead className="font-semibold w-[45%]">Subject & Content</TableHead>
                      <TableHead className="font-semibold">Status</TableHead>
                      <TableHead className="font-semibold">Timeline</TableHead>
                      <TableHead className="text-right font-semibold">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {isLoadingCampaigns ? (
                      <TableRow>
                        <TableCell colSpan={4} className="text-center py-12 text-muted-foreground animate-pulse">
                          Loading campaigns...
                        </TableCell>
                      </TableRow>
                    ) : filteredCampaigns.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={4} className="text-center py-16 text-muted-foreground space-y-2">
                          <Mail className="w-8 h-8 mx-auto text-muted-foreground/40 mb-2" />
                          <p className="font-medium text-foreground">No campaigns found</p>
                          <p className="text-xs text-muted-foreground">Click &quot;Add New Campaign&quot; above to create your first broadcast.</p>
                        </TableCell>
                      </TableRow>
                    ) : (
                      filteredCampaigns.map((c) => {
                        const isSent = c.status === 'SENT';
                        const isScheduled = c.status === 'SCHEDULED';

                        return (
                          <TableRow key={c.id} className="hover:bg-muted/30 transition-colors">
                            <TableCell className="py-4">
                              <div className="space-y-1">
                                <div className="font-bold text-foreground hover:text-indigo-400 transition-colors cursor-pointer"
                                  onClick={() => {
                                    setSelectedCampaign(c);
                                    setIsCampaignModalOpen(true);
                                  }}
                                >
                                  {c.subject}
                                </div>
                                {c.preheader && (
                                  <div className="text-xs text-muted-foreground line-clamp-1">
                                    {c.preheader}
                                  </div>
                                )}
                              </div>
                            </TableCell>

                            <TableCell>
                              <Badge
                                variant="outline"
                                className={`text-[11px] font-bold px-2.5 py-0.5 rounded-full ${
                                  isSent
                                    ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30'
                                    : isScheduled
                                    ? 'bg-amber-500/10 text-amber-400 border-amber-500/30'
                                    : 'bg-slate-500/10 text-slate-300 border-slate-500/30'
                                }`}
                              >
                                {c.status}
                              </Badge>
                            </TableCell>

                            <TableCell className="text-xs text-muted-foreground whitespace-nowrap">
                              {isSent
                                ? `Sent: ${format(new Date(c.sentAt || c.createdAt), 'MMM d, yyyy')}`
                                : isScheduled && c.scheduledFor
                                ? `Scheduled: ${format(new Date(c.scheduledFor), 'MMM d, yyyy')}`
                                : `Created: ${format(new Date(c.createdAt), 'MMM d, yyyy')}`}
                            </TableCell>

                            <TableCell className="text-right">
                              <div className="flex items-center justify-end gap-1">
                                {!isSent && (
                                  <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => handleSendCampaign(c.id)}
                                    className="h-8 text-xs font-semibold rounded-lg bg-indigo-500/10 text-indigo-400 border-indigo-500/30 hover:bg-indigo-500/20 cursor-pointer"
                                  >
                                    <Send className="h-3 w-3 mr-1" /> Send
                                  </Button>
                                )}
                                <Button
                                  variant="ghost"
                                  size="icon-sm"
                                  onClick={() => {
                                    setSelectedCampaign(c);
                                    setIsCampaignModalOpen(true);
                                  }}
                                  className="hover:bg-muted text-muted-foreground hover:text-foreground cursor-pointer"
                                >
                                  <Edit className="h-4 w-4" />
                                </Button>
                                <Button
                                  variant="ghost"
                                  size="icon-sm"
                                  onClick={() => handleDeleteCampaign(c.id)}
                                  className="text-destructive hover:bg-destructive/10 cursor-pointer"
                                >
                                  <Trash2 className="h-4 w-4" />
                                </Button>
                              </div>
                            </TableCell>
                          </TableRow>
                        );
                      })
                    )}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* TAB 2: SUBSCRIBERS */}
        <TabsContent value="subscribers">
          <Card className="shadow-sm border border-white/10 bg-card/60 backdrop-blur-xl relative overflow-hidden">
            <CardHeader className="py-4 px-6 border-b border-border/50">
              <CardTitle className="text-base font-semibold">Audience Directory</CardTitle>
              <CardDescription className="text-xs">
                Verified recipients subscribed via website footer and forms
              </CardDescription>
            </CardHeader>
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader className="bg-muted/30">
                    <TableRow>
                      <TableHead className="font-semibold">Subscriber Email</TableHead>
                      <TableHead className="font-semibold">Name</TableHead>
                      <TableHead className="font-semibold">Status</TableHead>
                      <TableHead className="font-semibold">Subscribed Date</TableHead>
                      <TableHead className="text-right font-semibold">Action</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {isLoadingSubs ? (
                      <TableRow>
                        <TableCell colSpan={5} className="text-center py-12 text-muted-foreground animate-pulse">
                          Loading subscribers...
                        </TableCell>
                      </TableRow>
                    ) : filteredSubs.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={5} className="text-center py-16 text-muted-foreground">
                          No subscribers matching search criteria.
                        </TableCell>
                      </TableRow>
                    ) : (
                      filteredSubs.map((s) => (
                        <TableRow key={s.id} className="hover:bg-muted/30 transition-colors">
                          <TableCell className="font-mono text-xs font-semibold text-foreground py-3">
                            {s.email}
                          </TableCell>
                          <TableCell className="text-xs text-muted-foreground">
                            {s.name || 'Website Visitor'}
                          </TableCell>
                          <TableCell>
                            <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
                              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                              Active
                            </span>
                          </TableCell>
                          <TableCell className="text-xs text-muted-foreground">
                            {s.subscribedAt
                              ? format(new Date(s.subscribedAt), 'MMM d, yyyy')
                              : 'Recently'}
                          </TableCell>
                          <TableCell className="text-right">
                            <Button
                              variant="ghost"
                              size="icon-sm"
                              onClick={() => handleDeleteSubscriber(s.id)}
                              className="text-destructive hover:bg-destructive/10 cursor-pointer"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Add / Edit Campaign Modal */}
      <NewsletterCampaignModal
        isOpen={isCampaignModalOpen}
        onClose={() => {
          setIsCampaignModalOpen(false);
          setSelectedCampaign(null);
        }}
        onSuccess={() => {
          fetchCampaigns();
        }}
        initialData={selectedCampaign}
      />
    </div>
  );
}
