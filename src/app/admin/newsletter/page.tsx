'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { toast } from 'sonner';
import { Plus, Edit, Trash2, Search, Mail, Users, Send } from 'lucide-react';
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

interface Campaign {
  id: string;
  subject: string;
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

  const fetchCampaigns = async () => {
    setIsLoadingCampaigns(true);
    try {
      const response = await fetch('/api/admin/newsletter/campaigns');
      const res = await response.json();
      if (res.success) {
        setCampaigns(res.data);
      }
    } catch (error) {
      toast.error('Failed to connect to API.');
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
    } catch (error) {
      toast.error('Failed to fetch subscribers.');
    } finally {
      setIsLoadingSubs(false);
    }
  };

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchCampaigns();

    fetchSubscribers();
  }, []);

  const handleDeleteCampaign = async (id: string) => {
    if (confirm('Are you sure you want to delete this campaign?')) {
      const toastId = toast.loading('Deleting campaign...');
      try {
        const response = await fetch(`/api/admin/newsletter/campaigns/${id}`, { method: 'DELETE' });
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
    if (confirm('Are you sure you want to send this campaign to all active subscribers now?')) {
      const toastId = toast.loading('Sending campaign...');
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
        toast.error('An error occurred.', { id: toastId });
      }
    }
  };

  const filteredCampaigns = campaigns.filter((c) =>
    c.subject.toLowerCase().includes(search.toLowerCase())
  );
  const filteredSubs = subscribers.filter(
    (s) =>
      s.email.toLowerCase().includes(search.toLowerCase()) ||
      (s.name && s.name.toLowerCase().includes(search.toLowerCase()))
  );

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Newsletter & Campaigns</h2>
          <p className="text-muted-foreground mt-1">Manage email marketing and subscriber lists.</p>
        </div>
        <Button asChild size="lg" className="shadow-md shadow-indigo-500/20 cursor-pointer">
          <Link href="/admin/newsletter/create">
            <Plus className="mr-2 h-4 w-4" /> Create Campaign
          </Link>
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="shadow-sm bg-card border-border/50">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Total Subscribers</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{subscribers.length}</div>
          </CardContent>
        </Card>
        <Card className="shadow-sm bg-card border-border/50">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Active Campaigns</CardTitle>
            <Mail className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {campaigns.filter((c) => c.status !== 'SENT').length}
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="campaigns" className="w-full">
        <TabsList className="mb-4">
          <TabsTrigger value="campaigns">
            <Mail className="h-4 w-4 mr-2" /> Campaigns
          </TabsTrigger>
          <TabsTrigger value="subscribers">
            <Users className="h-4 w-4 mr-2" /> Subscribers
          </TabsTrigger>
        </TabsList>

        <TabsContent value="campaigns">
          <Card className="shadow-sm border-border/50 bg-card/60 backdrop-blur-xl relative overflow-hidden">
            <CardHeader className="pb-4">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                  <CardTitle>Email Campaigns</CardTitle>
                </div>
                <div className="relative w-full sm:w-72">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search campaigns..."
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
                    <TableRow>
                      <TableHead className="font-semibold w-[40%]">Subject</TableHead>
                      <TableHead className="font-semibold">Status</TableHead>
                      <TableHead className="font-semibold">Date</TableHead>
                      <TableHead className="text-right font-semibold">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {isLoadingCampaigns ? (
                      <TableRow>
                        <TableCell colSpan={4} className="text-center">
                          Loading...
                        </TableCell>
                      </TableRow>
                    ) : filteredCampaigns.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={4} className="text-center py-8">
                          No campaigns found.
                        </TableCell>
                      </TableRow>
                    ) : (
                      filteredCampaigns.map((c) => (
                        <TableRow key={c.id}>
                          <TableCell className="font-medium">
                            <Link
                              href={`/admin/newsletter/edit/${c.id}`}
                              className="hover:text-indigo-500"
                            >
                              {c.subject}
                            </Link>
                          </TableCell>
                          <TableCell>
                            <Badge variant={c.status === 'SENT' ? 'default' : 'secondary'}>
                              {c.status}
                            </Badge>
                          </TableCell>
                          <TableCell className="text-sm text-muted-foreground">
                            {c.status === 'SENT'
                              ? `Sent: ${format(new Date(c.sentAt!), 'MMM d')}`
                              : `Created: ${format(new Date(c.createdAt), 'MMM d')}`}
                          </TableCell>
                          <TableCell className="text-right">
                            <div className="flex items-center justify-end space-x-1">
                              {c.status !== 'SENT' && (
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() => handleSendCampaign(c.id)}
                                  className="mr-2"
                                >
                                  <Send className="h-3 w-3 mr-1" /> Send
                                </Button>
                              )}
                              <Button asChild variant="ghost" size="icon-sm">
                                <Link href={`/admin/newsletter/edit/${c.id}`}>
                                  <Edit className="h-4 w-4" />
                                </Link>
                              </Button>
                              <Button
                                variant="ghost"
                                size="icon-sm"
                                onClick={() => handleDeleteCampaign(c.id)}
                                className="text-destructive"
                              >
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
        </TabsContent>

        <TabsContent value="subscribers">
          <Card className="shadow-sm border-border/50 bg-card/60 backdrop-blur-xl relative overflow-hidden">
            <CardHeader className="pb-4">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                  <CardTitle>Subscribers List</CardTitle>
                </div>
                <div className="relative w-full sm:w-72">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search subscribers..."
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
                    <TableRow>
                      <TableHead className="font-semibold">Email</TableHead>
                      <TableHead className="font-semibold">Name</TableHead>
                      <TableHead className="font-semibold">Status</TableHead>
                      <TableHead className="font-semibold">Subscribed On</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {isLoadingSubs ? (
                      <TableRow>
                        <TableCell colSpan={4} className="text-center">
                          Loading...
                        </TableCell>
                      </TableRow>
                    ) : filteredSubs.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={4} className="text-center py-8">
                          No subscribers found.
                        </TableCell>
                      </TableRow>
                    ) : (
                      filteredSubs.map((s) => (
                        <TableRow key={s.id}>
                          <TableCell className="font-medium">{s.email}</TableCell>
                          <TableCell>{s.name || '-'}</TableCell>
                          <TableCell>
                            <Badge variant={s.status === 'ACTIVE' ? 'default' : 'secondary'}>
                              {s.status}
                            </Badge>
                          </TableCell>
                          <TableCell className="text-sm text-muted-foreground">
                            {format(new Date(s.subscribedAt), 'MMM d, yyyy')}
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
    </div>
  );
}
