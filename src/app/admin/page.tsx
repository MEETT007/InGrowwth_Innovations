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
import { getAuthUserRole } from '@/lib/auth';

export const revalidate = 0; // Disable caching for real-time dashboard data
export const dynamic = 'force-dynamic';

export default async function AdminDashboardPage() {
  const { userId, role, jobTitle } = await getAuthUserRole();

  if (!userId || (role !== 'admin' && role !== 'editor')) {
    return (
      <div className="min-h-screen w-full flex bg-background -mt-6 md:-mt-8">
        {/* Left Side: Branding & Auth */}
        <div className="w-full lg:w-1/2 flex flex-col justify-center px-8 md:px-16 lg:px-24 xl:px-32 relative z-10 animate-in fade-in slide-in-from-left-8 duration-1000 ease-out">
          <div className="mb-10 w-16 h-16 rounded-2xl bg-gradient-to-tr from-indigo-500 via-purple-500 to-pink-500 p-0.5 shadow-[0_0_40px_rgba(99,102,241,0.4)]">
            <div className="w-full h-full bg-background rounded-[14px] flex items-center justify-center">
              <Sparkles className="w-8 h-8 text-indigo-400 animate-pulse" />
            </div>
          </div>

          <h1 className="text-4xl md:text-5xl lg:text-6xl font-black tracking-tight mb-4 text-foreground leading-tight">
            Welcome to <br />
            <span className="bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
              InGrowwth
            </span>
          </h1>

          <p className="text-lg text-muted-foreground mb-12 font-medium max-w-md leading-relaxed">
            Secure employee & team portal. Please authenticate to access the management dashboard
            and administrative tools.
          </p>

          <Button
            render={<Link href="/admin/sign-in" />}
            className="w-full max-w-sm h-14 text-lg font-bold bg-foreground text-background hover:bg-foreground/90 rounded-2xl border-0 transition-all hover:scale-[1.02] duration-300 group shadow-2xl"
          >
            <span>Continue to Sign In</span>
            <ArrowRight className="ml-3 h-5 w-5 group-hover:translate-x-1 transition-transform" />
          </Button>

          <div className="mt-16 flex items-center gap-4 text-sm font-medium text-muted-foreground/60">
            <ShieldAlert className="w-5 h-5 text-emerald-500/80" />
            <span>Secured with Enterprise-Grade Encryption</span>
          </div>
        </div>

        {/* Right Side: Stunning Visual / Abstract */}
        <div className="hidden lg:flex w-1/2 relative bg-slate-950 overflow-hidden items-center justify-center border-l border-white/5">
          {/* Base Mesh */}
          <div className="absolute inset-0 opacity-40 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-indigo-900/40 via-slate-950 to-slate-950" />

          {/* Animated Glowing Orbs */}
          <div className="absolute top-1/4 -right-20 w-[500px] h-[500px] bg-indigo-600/30 rounded-full blur-[120px] animate-pulse" />
          <div
            className="absolute bottom-1/4 -left-20 w-[600px] h-[600px] bg-purple-600/20 rounded-full blur-[140px] animate-pulse"
            style={{ animationDelay: '2s' }}
          />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-pink-600/10 rounded-full blur-[150px]" />

          {/* Floating Glassmorphic UI Card */}
          <div className="relative z-10 w-full max-w-lg p-1 animate-in fade-in slide-in-from-bottom-12 duration-1000 delay-300">
            <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/30 via-purple-500/20 to-pink-500/10 rounded-3xl blur-md" />
            <div className="relative bg-slate-950/40 backdrop-blur-3xl border border-white/10 rounded-3xl p-10 shadow-2xl">
              <div className="flex items-center gap-4 mb-8">
                <div className="w-12 h-12 rounded-full bg-emerald-500/20 flex items-center justify-center border border-emerald-500/30">
                  <CheckCircle2 className="w-6 h-6 text-emerald-400" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-white">System Status: Optimal</h3>
                  <p className="text-sm text-slate-400">All services are running smoothly</p>
                </div>
              </div>

              <div className="space-y-4">
                <div className="w-full bg-white/5 rounded-2xl border border-white/5 flex items-center p-4 gap-4 hover:bg-white/10 transition-colors cursor-default">
                  <div className="w-10 h-10 rounded-full bg-indigo-500/20 flex items-center justify-center border border-indigo-500/30">
                    <Users className="w-5 h-5 text-indigo-400" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-bold text-white">Lead Management</p>
                    <p className="text-xs text-slate-400 mt-0.5">Live tracking of all inquiries</p>
                  </div>
                </div>

                <div className="w-full bg-white/5 rounded-2xl border border-white/5 flex items-center p-4 gap-4 hover:bg-white/10 transition-colors cursor-default">
                  <div className="w-10 h-10 rounded-full bg-purple-500/20 flex items-center justify-center border border-purple-500/30">
                    <Mail className="w-5 h-5 text-purple-400" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-bold text-white">Communication Sync</p>
                    <p className="text-xs text-slate-400 mt-0.5">Integrated email & forms</p>
                  </div>
                </div>

                <div className="w-full bg-white/5 rounded-2xl border border-white/5 flex items-center p-4 gap-4 hover:bg-white/10 transition-colors cursor-default">
                  <div className="w-10 h-10 rounded-full bg-pink-500/20 flex items-center justify-center border border-pink-500/30">
                    <FileText className="w-5 h-5 text-pink-400" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-bold text-white">Quote Automation</p>
                    <p className="text-xs text-slate-400 mt-0.5">Fast proposal generation</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
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
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700 ease-out">
      {/* Top Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-indigo-100/60 via-purple-100/60 to-background dark:from-indigo-900/40 dark:via-purple-900/20 dark:to-background border border-indigo-200/50 dark:border-white/10 p-8 shadow-2xl">
        <div className="absolute top-0 right-0 -mt-20 -mr-20 w-72 h-72 bg-indigo-500/20 rounded-full blur-3xl opacity-50" />
        <div className="absolute bottom-0 left-0 -mb-20 -ml-20 w-72 h-72 bg-pink-500/20 rounded-full blur-3xl opacity-50" />

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <h1 className="text-4xl font-extrabold tracking-tight flex items-center gap-3">
              <span className="bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
                Admin Overview
              </span>
              <Sparkles className="h-7 w-7 text-indigo-400 animate-pulse" />
            </h1>
            <p className="text-base text-muted-foreground mt-2 max-w-xl">
              Your real-time management dashboard. Monitor leads, analyze inquiries, and track
              engagement seamlessly.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-4">
            <div className="px-4 py-2 rounded-xl border border-white/10 bg-background/40 backdrop-blur-md text-sm font-semibold flex items-center gap-2 shadow-sm">
              <ShieldAlert className="h-4 w-4 text-indigo-400" />
              <span>
                Role:{' '}
                <strong className="text-indigo-400 capitalize">
                  {jobTitle || role || 'Employee'}
                </strong>
              </span>
            </div>
            <Button
              render={<Link href="/admin/leads" />}
              className="w-full sm:w-auto bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white border-0 shadow-lg shadow-indigo-500/25 transition-all hover:scale-105 duration-300"
            >
              <span>Manage All Leads</span>
              <ArrowRight className="h-4 w-4 ml-2" />
            </Button>
          </div>
        </div>
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((card, idx) => {
          const Icon = card.icon;
          return (
            <Card
              key={card.title}
              className="group relative overflow-hidden border-white/10 bg-background/40 backdrop-blur-xl hover:shadow-[0_8px_30px_rgb(0,0,0,0.12)] hover:-translate-y-1 transition-all duration-300 ease-out"
              style={{ animationDelay: `${idx * 100}ms` }}
            >
              <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              <CardHeader className="flex flex-row items-center justify-between pb-2 relative z-10">
                <CardTitle className="text-sm font-semibold text-muted-foreground group-hover:text-foreground transition-colors">
                  {card.title}
                </CardTitle>
                <div
                  className={`p-3 rounded-2xl ${card.color} shadow-inner transition-transform group-hover:scale-110 duration-300`}
                >
                  <Icon className="h-5 w-5" />
                </div>
              </CardHeader>
              <CardContent className="relative z-10">
                <div className="text-4xl font-black text-foreground tracking-tight">
                  {card.value}
                </div>
                <p className="text-xs text-muted-foreground mt-2 font-medium">{card.description}</p>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Breakdown & Quick Links */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2 border-white/10 bg-background/40 backdrop-blur-xl shadow-lg relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-purple-500/10 rounded-full blur-3xl -z-10" />
          <CardHeader>
            <CardTitle className="text-xl font-bold bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">
              System & Submissions Summary
            </CardTitle>
            <CardDescription className="text-sm font-medium">
              Overview of lead categories in your system
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="group flex items-center justify-between p-4 rounded-2xl bg-muted/30 border border-white/5 hover:border-white/20 hover:bg-muted/50 transition-all duration-300 cursor-default">
              <div className="flex items-center gap-4">
                <div className="p-2.5 rounded-xl bg-purple-500/10 text-purple-500 group-hover:scale-110 transition-transform">
                  <Mail className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-sm font-bold text-foreground">Contact Form Leads</p>
                  <p className="text-xs text-muted-foreground font-medium">
                    General inquiries from prospective clients
                  </p>
                </div>
              </div>
              <span className="text-xl font-black text-foreground">{contactCount}</span>
            </div>

            <div className="group flex items-center justify-between p-4 rounded-2xl bg-muted/30 border border-white/5 hover:border-white/20 hover:bg-muted/50 transition-all duration-300 cursor-default">
              <div className="flex items-center gap-4">
                <div className="p-2.5 rounded-xl bg-amber-500/10 text-amber-500 group-hover:scale-110 transition-transform">
                  <FileText className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-sm font-bold text-foreground">Quote Form Submissions</p>
                  <p className="text-xs text-muted-foreground font-medium">
                    Project estimates with budget & timeline specs
                  </p>
                </div>
              </div>
              <span className="text-xl font-black text-foreground">{quoteCount}</span>
            </div>

            <div className="group flex items-center justify-between p-4 rounded-2xl bg-muted/30 border border-white/5 hover:border-white/20 hover:bg-muted/50 transition-all duration-300 cursor-default">
              <div className="flex items-center gap-4">
                <div className="p-2.5 rounded-xl bg-emerald-500/10 text-emerald-500 group-hover:scale-110 transition-transform">
                  <CheckCircle2 className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-sm font-bold text-foreground">Newsletter Subscribers</p>
                  <p className="text-xs text-muted-foreground font-medium">
                    Active email subscribers
                  </p>
                </div>
              </div>
              <span className="text-xl font-black text-foreground">{newsletterCount}</span>
            </div>
          </CardContent>
        </Card>

        {/* Quick Admin Actions */}
        <Card className="border-white/10 bg-background/40 backdrop-blur-xl shadow-lg relative overflow-hidden">
          <div className="absolute bottom-0 left-0 w-40 h-40 bg-indigo-500/10 rounded-full blur-3xl -z-10" />
          <CardHeader>
            <CardTitle className="text-xl font-bold">Quick Actions</CardTitle>
            <CardDescription className="text-sm font-medium">
              Administrative controls
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <Button
              render={<Link href="/admin/leads" />}
              variant="outline"
              className="w-full justify-start h-12 rounded-xl border-white/10 bg-background/50 hover:bg-indigo-500/10 hover:text-indigo-400 hover:border-indigo-500/30 transition-all duration-300 cursor-pointer shadow-sm group"
            >
              <Users className="h-4 w-4 mr-3 text-indigo-400 group-hover:scale-110 transition-transform" />
              <span className="font-semibold">View & Manage Leads</span>
            </Button>
            <Button
              render={<Link href="/admin/settings" />}
              variant="outline"
              className="w-full justify-start h-12 rounded-xl border-white/10 bg-background/50 hover:bg-pink-500/10 hover:text-pink-400 hover:border-pink-500/30 transition-all duration-300 cursor-pointer shadow-sm group"
            >
              <ShieldAlert className="h-4 w-4 mr-3 text-pink-400 group-hover:scale-110 transition-transform" />
              <span className="font-semibold">Manage Security & Account</span>
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
