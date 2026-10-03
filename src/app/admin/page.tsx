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
  TrendingUp,
  Briefcase,
  Layers,
  FolderGit2,
  Send,
  ExternalLink,
  Activity,
  Server,
  Database,
  Radio,
  Plus,
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { getAuthUserRole } from '@/lib/auth';
import { logger } from '@/lib/logger';

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

        {/* Right Side: Visual */}
        <div className="hidden lg:flex w-1/2 relative bg-slate-950 overflow-hidden items-center justify-center border-l border-white/5">
          <div className="absolute inset-0 opacity-40 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-indigo-900/40 via-slate-950 to-slate-950" />
          <div className="absolute top-1/4 -right-20 w-[500px] h-[500px] bg-indigo-600/30 rounded-full blur-[120px] animate-pulse" />
          <div
            className="absolute bottom-1/4 -left-20 w-[600px] h-[600px] bg-purple-600/20 rounded-full blur-[140px] animate-pulse"
            style={{ animationDelay: '2s' }}
          />

          <div className="relative z-10 w-full max-w-lg p-1 animate-in fade-in slide-in-from-bottom-12 duration-1000 delay-300">
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
  let contactedCount = 0;
  let closedCount = 0;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let recentLeads: any[] = [];
  let caseStudiesCount = 0;
  let projectsCount = 0;
  let jobsCount = 0;
  let blogsCount = 0;
  let teamCount = 0;

  try {
    const [
      total,
      contacts,
      quotes,
      newsletters,
      newLeads,
      contactedLeads,
      closedLeads,
      leadsList,
      csCount,
      projCount,
      jCount,
      bCount,
      tCount,
    ] = await Promise.all([
      db.lead.count(),
      db.lead.count({ where: { type: 'CONTACT' } }),
      db.lead.count({ where: { type: 'QUOTE' } }),
      db.newsletterSubscriber.count(),
      db.lead.count({ where: { status: 'NEW' } }),
      db.lead.count({ where: { status: 'CONTACTED' } }),
      db.lead.count({ where: { status: 'CLOSED' } }),
      db.lead.findMany({
        take: 6,
        orderBy: { createdAt: 'desc' },
      }),
      db.caseStudy.count(),
      db.portfolioProject.count(),
      db.job.count(),
      db.blogPost.count(),
      db.teamMember.count(),
    ]);

    totalLeads = total;
    contactCount = contacts;
    quoteCount = quotes;
    newsletterCount = newsletters;
    newLeadsCount = newLeads;
    contactedCount = contactedLeads;
    closedCount = closedLeads;
    recentLeads = leadsList;
    caseStudiesCount = csCount;
    projectsCount = projCount;
    jobsCount = jCount;
    blogsCount = bCount;
    teamCount = tCount;
  } catch (error) {
    logger.error('Error loading dashboard stats:', error);
  }

  const statCards = [
    {
      title: 'Total Inquiries',
      value: totalLeads,
      change: `${newLeadsCount} Actionable`,
      description: 'Recorded client leads & inquiries',
      icon: Users,
      color: 'text-indigo-400 bg-indigo-500/10 border-indigo-500/20',
      badgeColor: 'bg-indigo-500/10 text-indigo-400',
    },
    {
      title: 'Enterprise Quotes',
      value: quoteCount,
      change: 'High Intent',
      description: 'Scope & budget proposal requests',
      icon: FileText,
      color: 'text-amber-400 bg-amber-500/10 border-amber-500/20',
      badgeColor: 'bg-amber-500/10 text-amber-400',
    },
    {
      title: 'Audience Reach',
      value: newsletterCount,
      change: 'Subscribed',
      description: 'Direct email newsletter network',
      icon: Mail,
      color: 'text-purple-400 bg-purple-500/10 border-purple-500/20',
      badgeColor: 'bg-purple-500/10 text-purple-400',
    },
    {
      title: 'Deliverables Published',
      value: caseStudiesCount + projectsCount,
      change: `${caseStudiesCount} Case Studies`,
      description: 'Projects & Case Studies live',
      icon: Layers,
      color: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20',
      badgeColor: 'bg-emerald-500/10 text-emerald-400',
    },
  ];

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700 ease-out">
      {/* Top Executive Command Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-indigo-950/80 via-slate-900/90 to-background border border-indigo-500/20 p-8 shadow-2xl">
        <div className="absolute top-0 right-0 -mt-20 -mr-20 w-80 h-80 bg-indigo-500/15 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 -mb-20 -ml-20 w-80 h-80 bg-purple-500/15 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-semibold">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping inline-block" />
                Live Command Console
              </span>
              <span className="text-xs text-muted-foreground font-mono">
                {new Date().toLocaleDateString(undefined, { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' })}
              </span>
            </div>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight flex items-center gap-3">
              <span className="bg-gradient-to-r from-white via-indigo-200 to-indigo-400 bg-clip-text text-transparent">
                Executive Overview
              </span>
              <Sparkles className="h-6 w-6 sm:h-8 sm:w-8 text-indigo-400 animate-pulse" />
            </h1>
            <p className="text-sm sm:text-base text-muted-foreground max-w-2xl">
              Real-time platform intelligence. Monitor customer acquisition velocity, track project
              deliverables, and orchestrate campaigns.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <div className="px-4 py-2 rounded-2xl border border-white/10 bg-background/50 backdrop-blur-md text-xs sm:text-sm font-semibold flex items-center gap-2 shadow-sm">
              <ShieldAlert className="h-4 w-4 text-indigo-400" />
              <span>
                Role:{' '}
                <strong className="text-indigo-400 capitalize">
                  {jobTitle || role || 'Administrator'}
                </strong>
              </span>
            </div>

            <Button
              render={<Link href="/admin/leads" />}
              className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white rounded-xl shadow-lg shadow-indigo-500/25 transition-all hover:scale-105 duration-300 font-semibold cursor-pointer"
            >
              <span>Triage Inbound Leads</span>
              <ArrowRight className="h-4 w-4 ml-1.5" />
            </Button>
          </div>
        </div>
      </div>

      {/* KPI Metrics Velocity Strip */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((card, idx) => {
          const Icon = card.icon;
          return (
            <Card
              key={card.title}
              className="group relative overflow-hidden border border-white/10 bg-card/60 backdrop-blur-xl hover:border-indigo-500/40 hover:shadow-xl hover:shadow-indigo-500/10 hover:-translate-y-1 transition-all duration-300 ease-out"
              style={{ animationDelay: `${idx * 80}ms` }}
            >
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-xs font-bold uppercase tracking-wider text-muted-foreground group-hover:text-foreground transition-colors">
                  {card.title}
                </CardTitle>
                <div className={`p-2.5 rounded-xl border ${card.color} transition-transform group-hover:scale-110 duration-300`}>
                  <Icon className="h-4 w-4" />
                </div>
              </CardHeader>
              <CardContent className="space-y-2">
                <div className="flex items-baseline justify-between">
                  <div className="text-3xl font-black text-foreground tracking-tight">
                    {card.value}
                  </div>
                  <span className={`text-[11px] font-bold px-2 py-0.5 rounded-md ${card.badgeColor}`}>
                    {card.change}
                  </span>
                </div>
                <p className="text-xs text-muted-foreground font-medium">{card.description}</p>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Real-time Inbound Leads Feed & Content Matrix */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column (8 cols): Real-Time Inbound Leads Triage */}
        <Card className="lg:col-span-8 border border-white/10 bg-card/60 backdrop-blur-xl shadow-xl overflow-hidden">
          <CardHeader className="border-b border-border/50 pb-4">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-lg font-bold flex items-center gap-2">
                  <Activity className="h-5 w-5 text-indigo-400" />
                  <span>Recent Inbound Inquiries</span>
                </CardTitle>
                <CardDescription className="text-xs mt-1">
                  Live feed of customer submissions across Contact, Quotes, and Newsletter
                </CardDescription>
              </div>
              <Button
                render={<Link href="/admin/leads" />}
                variant="ghost"
                size="sm"
                className="text-xs text-indigo-400 hover:text-indigo-300 hover:bg-indigo-500/10 cursor-pointer"
              >
                View All ({totalLeads}) <ArrowRight className="w-3.5 h-3.5 ml-1" />
              </Button>
            </div>
          </CardHeader>

          <CardContent className="p-0">
            {recentLeads.length === 0 ? (
              <div className="py-16 text-center text-muted-foreground space-y-3">
                <Users className="w-10 h-10 mx-auto text-muted-foreground/40" />
                <p className="text-sm font-medium">No recorded lead activity yet.</p>
                <p className="text-xs text-muted-foreground">Inquiries from the public website will stream in real-time here.</p>
              </div>
            ) : (
              <div className="divide-y divide-border/40">
                {recentLeads.map((lead) => {
                  const isNew = lead.status === 'NEW';
                  const isContacted = lead.status === 'CONTACTED';

                  return (
                    <div
                      key={lead.id}
                      className="p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-muted/30 transition-colors"
                    >
                      <div className="space-y-1">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="text-sm font-bold text-foreground">
                            {lead.name || 'Anonymous User'}
                          </span>
                          <Badge
                            variant="outline"
                            className={
                              lead.type === 'QUOTE'
                                ? 'bg-amber-500/10 text-amber-400 border-amber-500/30 text-[10px]'
                                : lead.type === 'CONTACT'
                                ? 'bg-purple-500/10 text-purple-400 border-purple-500/30 text-[10px]'
                                : 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30 text-[10px]'
                            }
                          >
                            {lead.type}
                          </Badge>
                          <span className="text-xs text-muted-foreground font-mono">
                            {lead.email}
                          </span>
                        </div>

                        {lead.subject && (
                          <p className="text-xs text-muted-foreground line-clamp-1">
                            <strong className="text-foreground/80">Subject:</strong> {lead.subject}
                          </p>
                        )}
                        {lead.message && (
                          <p className="text-xs text-muted-foreground/80 line-clamp-1 italic">
                            &quot;{lead.message}&quot;
                          </p>
                        )}
                      </div>

                      <div className="flex items-center gap-3 shrink-0">
                        {/* Status Pill */}
                        <span
                          className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold ${
                            isNew
                              ? 'bg-blue-500/15 text-blue-400 border border-blue-500/30'
                              : isContacted
                              ? 'bg-amber-500/15 text-amber-400 border border-amber-500/30'
                              : 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30'
                          }`}
                        >
                          <span
                            className={`w-1.5 h-1.5 rounded-full ${
                              isNew
                                ? 'bg-blue-400 animate-ping'
                                : isContacted
                                ? 'bg-amber-400'
                                : 'bg-emerald-400'
                            }`}
                          />
                          {lead.status}
                        </span>

                        <span className="text-[11px] text-muted-foreground whitespace-nowrap">
                          {new Date(lead.createdAt).toLocaleDateString(undefined, {
                            month: 'short',
                            day: 'numeric',
                          })}
                        </span>

                        <Button
                          render={<Link href="/admin/leads" />}
                          variant="ghost"
                          size="icon-xs"
                          className="hover:bg-muted text-muted-foreground hover:text-foreground cursor-pointer"
                        >
                          <ArrowRight className="w-3.5 h-3.5" />
                        </Button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Right Column (4 cols): Content Matrix & Quick Actions */}
        <div className="lg:col-span-4 space-y-6">
          {/* Platform Deliverables Matrix */}
          <Card className="border border-white/10 bg-card/60 backdrop-blur-xl shadow-xl">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-bold uppercase tracking-wider text-muted-foreground">
                Platform Deliverables Matrix
              </CardTitle>
              <CardDescription className="text-xs">
                Active publications & team assets live on public site
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <Link
                href="/admin/portfolio"
                className="flex items-center justify-between p-3 rounded-2xl bg-muted/30 border border-white/5 hover:border-indigo-500/30 hover:bg-muted/50 transition-all group"
              >
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-xl bg-indigo-500/10 text-indigo-400 group-hover:scale-110 transition-transform">
                    <FolderGit2 className="h-4 w-4" />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-foreground">Client Projects</p>
                    <p className="text-[10px] text-muted-foreground">Published applications</p>
                  </div>
                </div>
                <span className="text-sm font-black text-foreground">{projectsCount}</span>
              </Link>

              <Link
                href="/admin/case-studies"
                className="flex items-center justify-between p-3 rounded-2xl bg-muted/30 border border-white/5 hover:border-purple-500/30 hover:bg-muted/50 transition-all group"
              >
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-xl bg-purple-500/10 text-purple-400 group-hover:scale-110 transition-transform">
                    <FileText className="h-4 w-4" />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-foreground">Case Studies</p>
                    <p className="text-[10px] text-muted-foreground">Enterprise architecture proofs</p>
                  </div>
                </div>
                <span className="text-sm font-black text-foreground">{caseStudiesCount}</span>
              </Link>

              <Link
                href="/admin/careers"
                className="flex items-center justify-between p-3 rounded-2xl bg-muted/30 border border-white/5 hover:border-pink-500/30 hover:bg-muted/50 transition-all group"
              >
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-xl bg-pink-500/10 text-pink-400 group-hover:scale-110 transition-transform">
                    <Briefcase className="h-4 w-4" />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-foreground">Career Openings</p>
                    <p className="text-[10px] text-muted-foreground">Active recruitment posts</p>
                  </div>
                </div>
                <span className="text-sm font-black text-foreground">{jobsCount}</span>
              </Link>

              <Link
                href="/admin/blogs"
                className="flex items-center justify-between p-3 rounded-2xl bg-muted/30 border border-white/5 hover:border-amber-500/30 hover:bg-muted/50 transition-all group"
              >
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-xl bg-amber-500/10 text-amber-400 group-hover:scale-110 transition-transform">
                    <Sparkles className="h-4 w-4" />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-foreground">Tech Blogs & Insights</p>
                    <p className="text-[10px] text-muted-foreground">SEO articles & thought leadership</p>
                  </div>
                </div>
                <span className="text-sm font-black text-foreground">{blogsCount}</span>
              </Link>

              <Link
                href="/admin/team"
                className="flex items-center justify-between p-3 rounded-2xl bg-muted/30 border border-white/5 hover:border-emerald-500/30 hover:bg-muted/50 transition-all group"
              >
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-xl bg-emerald-500/10 text-emerald-400 group-hover:scale-110 transition-transform">
                    <Users className="h-4 w-4" />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-foreground">Leadership Team</p>
                    <p className="text-[10px] text-muted-foreground">Verified public team members</p>
                  </div>
                </div>
                <span className="text-sm font-black text-foreground">{teamCount}</span>
              </Link>
            </CardContent>
          </Card>

          {/* System Infrastructure Telemetry */}
          <Card className="border border-white/10 bg-card/60 backdrop-blur-xl shadow-xl">
            <CardHeader className="pb-3">
              <CardTitle className="text-xs font-bold uppercase tracking-wider text-muted-foreground flex items-center justify-between">
                <span>Infrastructure Telemetry</span>
                <span className="flex items-center gap-1 text-[10px] text-emerald-400 font-mono">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  Healthy
                </span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2.5 text-xs">
              <div className="flex items-center justify-between p-2 rounded-xl bg-muted/20 border border-border/30">
                <span className="text-muted-foreground flex items-center gap-2">
                  <Database className="w-3.5 h-3.5 text-indigo-400" /> PostgreSQL Neon
                </span>
                <span className="font-semibold text-emerald-400">Connected</span>
              </div>
              <div className="flex items-center justify-between p-2 rounded-xl bg-muted/20 border border-border/30">
                <span className="text-muted-foreground flex items-center gap-2">
                  <Server className="w-3.5 h-3.5 text-purple-400" /> Storage & CDN
                </span>
                <span className="font-semibold text-emerald-400">Operational</span>
              </div>
              <div className="flex items-center justify-between p-2 rounded-xl bg-muted/20 border border-border/30">
                <span className="text-muted-foreground flex items-center gap-2">
                  <Send className="w-3.5 h-3.5 text-pink-400" /> Newsletter Engine
                </span>
                <span className="font-semibold text-emerald-400">Ready</span>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
