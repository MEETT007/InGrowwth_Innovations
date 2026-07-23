import React from 'react';
import Link from 'next/link';
import { db } from '@/lib/db';
import {
  Users,
  Mail,
  FileText,
  CheckCircle2,
  ArrowRight,
  ShieldAlert,
  Clock,
  Sparkles,
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { redirect } from 'next/navigation';
import { getAuthUserRole } from '@/lib/auth';

export const revalidate = 0; // Disable caching for real-time dashboard data
export const dynamic = 'force-dynamic';

export default async function AdminDashboardPage() {
  const { userId, role } = await getAuthUserRole();

  if (!userId || !role) {
    redirect('/admin/sign-in');
  }

  // Fetch summary metrics safely
  let totalLeads = 0;
  let contactCount = 0;
  let quoteCount = 0;
  let newsletterCount = 0;
  let newLeadsCount = 0;

  try {
    const [total, contacts, quotes, newsletters, newLeads] = await Promise.all([
      db.lead.count(),
      db.lead.count({ where: { type: 'CONTACT' } }),
      db.lead.count({ where: { type: 'QUOTE' } }),
      db.lead.count({ where: { type: 'NEWSLETTER' } }),
      db.lead.count({ where: { status: 'NEW' } }),
    ]);

    totalLeads = total;
    contactCount = contacts;
    quoteCount = quotes;
    newsletterCount = newsletters;
    newLeadsCount = newLeads;
  } catch (error) {
    console.error('Error loading dashboard stats:', error);
  }

  const statCards = [
    {
      title: 'Total Inquiries',
      value: totalLeads,
      description: 'All recorded leads across forms',
      icon: Users,
      color: 'text-blue-500 bg-blue-500/10',
    },
    {
      title: 'Contact Form Submissions',
      value: contactCount,
      description: 'General business & sales inquiries',
      icon: Mail,
      color: 'text-purple-500 bg-purple-500/10',
    },
    {
      title: 'Quote Requests',
      value: quoteCount,
      description: 'Detailed project estimate requests',
      icon: FileText,
      color: 'text-amber-500 bg-amber-500/10',
    },
    {
      title: 'Pending New Leads',
      value: newLeadsCount,
      description: 'Leads requiring review or action',
      icon: Clock,
      color: 'text-emerald-500 bg-emerald-500/10',
    },
  ];

  return (
    <div className="space-y-8">
      {/* Top Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-border/80 pb-6">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight text-foreground flex items-center gap-2">
            <span>Admin Overview</span>
            <Sparkles className="h-6 w-6 text-primary animate-pulse" />
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            Real-time management dashboard for InGrowwth Innovations leads & content.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="px-3 py-1.5 rounded-lg border border-border bg-card text-xs font-semibold text-foreground flex items-center gap-2">
            <ShieldAlert className="h-4 w-4 text-primary" />
            <span>
              Role: <strong className="text-primary capitalize">{role || 'Admin'}</strong>
            </span>
          </div>
          <Link href="/admin/leads">
            <Button className="font-semibold shadow-md flex items-center gap-2">
              <span>Manage All Leads</span>
              <ArrowRight className="h-4 w-4" />
            </Button>
          </Link>
        </div>
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((card) => {
          const Icon = card.icon;
          return (
            <Card key={card.title} className="hover:shadow-lg transition-shadow border-border/80">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  {card.title}
                </CardTitle>
                <div className={`p-2.5 rounded-xl ${card.color}`}>
                  <Icon className="h-5 w-5" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-foreground">{card.value}</div>
                <p className="text-xs text-muted-foreground mt-1">{card.description}</p>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Breakdown & Quick Links */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2 border-border/80">
          <CardHeader>
            <CardTitle>System & Submissions Summary</CardTitle>
            <CardDescription>Overview of lead categories in your system</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between p-3 rounded-lg bg-muted/40 border border-border/60">
              <div className="flex items-center gap-3">
                <Mail className="h-5 w-5 text-purple-500" />
                <div>
                  <p className="text-sm font-medium text-foreground">Contact Form Leads</p>
                  <p className="text-xs text-muted-foreground">
                    General inquiries from prospective clients
                  </p>
                </div>
              </div>
              <span className="font-bold text-foreground">{contactCount}</span>
            </div>

            <div className="flex items-center justify-between p-3 rounded-lg bg-muted/40 border border-border/60">
              <div className="flex items-center gap-3">
                <FileText className="h-5 w-5 text-amber-500" />
                <div>
                  <p className="text-sm font-medium text-foreground">Quote Form Submissions</p>
                  <p className="text-xs text-muted-foreground">
                    Project estimates with budget & timeline specs
                  </p>
                </div>
              </div>
              <span className="font-bold text-foreground">{quoteCount}</span>
            </div>

            <div className="flex items-center justify-between p-3 rounded-lg bg-muted/40 border border-border/60">
              <div className="flex items-center gap-3">
                <CheckCircle2 className="h-5 w-5 text-emerald-500" />
                <div>
                  <p className="text-sm font-medium text-foreground">Newsletter Subscribers</p>
                  <p className="text-xs text-muted-foreground">Active email subscribers</p>
                </div>
              </div>
              <span className="font-bold text-foreground">{newsletterCount}</span>
            </div>
          </CardContent>
        </Card>

        {/* Quick Admin Actions */}
        <Card className="border-border/80">
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
            <CardDescription>Administrative controls</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <Link href="/admin/leads" className="block">
              <Button variant="outline" className="w-full justify-start font-medium gap-2">
                <Users className="h-4 w-4 text-primary" />
                <span>View & Manage Leads</span>
              </Button>
            </Link>
            <Link href="/admin/profile" className="block">
              <Button variant="outline" className="w-full justify-start font-medium gap-2">
                <ShieldAlert className="h-4 w-4 text-primary" />
                <span>Manage Security & Account</span>
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
