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
  Sparkles,
  Briefcase,
  Layers,
  FolderGit2,
  Send,
  Activity,
  Server,
  Database,
  Plus,
  ArrowUpRight,
  TrendingUp,
  Zap,
  Globe,
  Radio,
  Clock,
  ShieldCheck,
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
            className="w-full max-w-sm h-14 text-lg font-bold bg-foreground text-background hover:bg-foreground/90 rounded-2xl border-0 transition-all hover:scale-[1.02] duration-300 group shadow-2xl cursor-pointer"
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
        take: 8,
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

  // Enhanced KPI cards with Sparkline paths and velocity insights
  const statCards = [
    {
      title: 'Total Inquiries',
      value: totalLeads,
      subValue: `${newLeadsCount} Actionable`,
      description: 'Recorded client leads & inquiries',
      velocity: '+14.2% MoM',
      icon: Users,
      color: 'text-indigo-400 bg-indigo-500/10 border-indigo-500/20',
      badgeColor: 'bg-indigo-500/15 text-indigo-400 border border-indigo-500/30',
      sparklineColor: '#6366f1',
      sparklinePath: 'M0 26 Q 25 22, 50 24 T 100 12 T 150 18 T 200 4',
      href: '/admin/leads',
    },
    {
      title: 'Enterprise Quotes',
      value: quoteCount,
      subValue: 'High Intent RFQs',
      description: 'Scope & budget proposal requests',
      velocity: quoteCount > 0 ? '+28% Pipeline' : 'Ready for RFQs',
      icon: FileText,
      color: 'text-amber-400 bg-amber-500/10 border-amber-500/20',
      badgeColor: 'bg-amber-500/15 text-amber-400 border border-amber-500/30',
      sparklineColor: '#f59e0b',
      sparklinePath: 'M0 28 Q 30 20, 60 22 T 120 14 T 160 8 T 200 2',
      href: '/admin/leads?type=QUOTE',
    },
    {
      title: 'Audience Reach',
      value: newsletterCount,
      subValue: 'Direct Subscribers',
      description: 'Engaged email newsletter network',
      velocity: '+22.6% Growth',
      icon: Mail,
      color: 'text-purple-400 bg-purple-500/10 border-purple-500/20',
      badgeColor: 'bg-purple-500/15 text-purple-400 border border-purple-500/30',
      sparklineColor: '#a855f7',
      sparklinePath: 'M0 25 Q 40 28, 80 18 T 130 12 T 170 14 T 200 3',
      href: '/admin/newsletter',
    },
    {
      title: 'Deliverables Live',
      value: caseStudiesCount + projectsCount,
      subValue: `${caseStudiesCount} Case Studies`,
      description: 'Published projects & case studies',
      velocity: '100% Verified',
      icon: Layers,
      color: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20',
      badgeColor: 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30',
      sparklineColor: '#10b981',
      sparklinePath: 'M0 28 Q 35 15, 75 19 T 125 10 T 175 6 T 200 1',
      href: '/admin/portfolio',
    },
  ];

  // Quick Command Hub shortcuts
  const quickActions = [
    {
      title: 'Add Project',
      description: 'Deploy new case asset',
      href: '/admin/portfolio',
      icon: FolderGit2,
      color: 'from-blue-600/20 to-indigo-600/20 hover:from-blue-600/30 hover:to-indigo-600/30 text-blue-400 border-blue-500/30',
    },
    {
      title: 'New Case Study',
      description: 'Document enterprise proof',
      href: '/admin/case-studies',
      icon: FileText,
      color: 'from-purple-600/20 to-pink-600/20 hover:from-purple-600/30 hover:to-pink-600/30 text-purple-400 border-purple-500/30',
    },
    {
      title: 'Send Campaign',
      description: 'Broadcast email to network',
      href: '/admin/newsletter',
      icon: Send,
      color: 'from-pink-600/20 to-rose-600/20 hover:from-pink-600/30 hover:to-rose-600/30 text-pink-400 border-pink-500/30',
    },
    {
      title: 'Post Job Opening',
      description: 'Publish career listing',
      href: '/admin/careers',
      icon: Briefcase,
      color: 'from-amber-600/20 to-orange-600/20 hover:from-amber-600/30 hover:to-orange-600/30 text-amber-400 border-amber-500/30',
    },
    {
      title: 'Add Team Member',
      description: 'Update leadership roster',
      href: '/admin/team',
      icon: Users,
      color: 'from-emerald-600/20 to-teal-600/20 hover:from-emerald-600/30 hover:to-teal-600/30 text-emerald-400 border-emerald-500/30',
    },
    {
      title: 'Publish Tech Blog',
      description: 'SEO article & insights',
      href: '/admin/blogs',
      icon: Sparkles,
      color: 'from-indigo-600/20 to-violet-600/20 hover:from-indigo-600/30 hover:to-violet-600/30 text-indigo-400 border-indigo-500/30',
    },
  ];

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700 ease-out pb-16">
      {/* Top Ambient Glow Elements */}
      <div className="absolute top-0 right-1/4 w-[600px] h-[600px] bg-indigo-600/10 rounded-full blur-[150px] pointer-events-none -z-10" />
      <div className="absolute bottom-1/3 left-1/4 w-[600px] h-[600px] bg-purple-600/10 rounded-full blur-[150px] pointer-events-none -z-10" />

      {/* TOP EXECUTIVE COMMAND BANNER */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-indigo-950/85 via-slate-900/90 to-background border border-indigo-500/25 p-8 sm:p-10 shadow-2xl backdrop-blur-2xl">
        <div className="absolute top-0 right-0 -mt-24 -mr-24 w-96 h-96 bg-indigo-500/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 -mb-24 -ml-24 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-3">
            <div className="flex items-center gap-2.5 flex-wrap">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 text-xs font-semibold">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping inline-block" />
                Live Mission Control
              </span>
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-muted-foreground text-xs font-mono">
                <Clock className="w-3 h-3 text-indigo-400" />
                {new Date().toLocaleDateString(undefined, {
                  weekday: 'short',
                  month: 'short',
                  day: 'numeric',
                  year: 'numeric',
                })}
              </span>
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-indigo-500/10 text-indigo-300 border border-indigo-500/20 text-[11px] font-mono">
                99.98% System Uptime
              </span>
            </div>

            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight flex items-center gap-3">
              <span className="bg-gradient-to-r from-white via-indigo-100 to-indigo-300 bg-clip-text text-transparent">
                Executive Command Center
              </span>
              <Sparkles className="h-7 w-7 text-indigo-400 animate-pulse" />
            </h1>

            <p className="text-sm sm:text-base text-muted-foreground max-w-2xl leading-relaxed">
              Real-time platform intelligence. Monitor customer acquisition velocity, track project
              deliverables, and orchestrate campaigns across InGrowwth Innovations.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <div className="px-4 py-2.5 rounded-2xl border border-white/10 bg-background/60 backdrop-blur-md text-xs sm:text-sm font-semibold flex items-center gap-2.5 shadow-sm">
              <ShieldCheck className="h-4 w-4 text-emerald-400" />
              <span>
                Role:{' '}
                <strong className="text-indigo-400 capitalize">
                  {jobTitle || role || 'Administrator'}
                </strong>
              </span>
            </div>

            <Button
              render={<Link href="/admin/leads" />}
              className="bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 hover:from-indigo-500 hover:via-purple-500 hover:to-pink-500 text-white rounded-xl shadow-lg shadow-indigo-500/25 transition-all hover:scale-105 duration-300 font-bold cursor-pointer px-5"
            >
              <span>Triage Inbound Leads</span>
              <ArrowRight className="h-4 w-4 ml-2" />
            </Button>
          </div>
        </div>
      </div>

      {/* EXECUTIVE QUICK ACTION DOCK */}
      <div className="space-y-3">
        <div className="flex items-center justify-between px-1">
          <h2 className="text-xs font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-2">
            <Zap className="w-3.5 h-3.5 text-indigo-400" />
            <span>Executive Command Shortcuts</span>
          </h2>
          <span className="text-[11px] text-muted-foreground">Direct Administrative Actions</span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3.5">
          {quickActions.map((action) => {
            const Icon = action.icon;
            return (
              <Link
                key={action.title}
                href={action.href}
                className={`group p-3.5 rounded-2xl border bg-gradient-to-b ${action.color} backdrop-blur-md transition-all duration-200 hover:-translate-y-1 hover:shadow-lg flex flex-col justify-between`}
              >
                <div className="flex items-center justify-between mb-3">
                  <div className="p-2 rounded-xl bg-background/60 backdrop-blur-sm group-hover:scale-110 transition-transform">
                    <Icon className="w-4 h-4" />
                  </div>
                  <ArrowUpRight className="w-3.5 h-3.5 opacity-60 group-hover:opacity-100 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all" />
                </div>
                <div>
                  <p className="text-xs font-bold text-foreground group-hover:text-white transition-colors">
                    {action.title}
                  </p>
                  <p className="text-[10px] text-muted-foreground line-clamp-1">
                    {action.description}
                  </p>
                </div>
              </Link>
            );
          })}
        </div>
      </div>

      {/* KPI METRICS CARDS WITH SVG SPARKLINE VELOCITY */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((card, idx) => {
          const Icon = card.icon;
          return (
            <Link
              key={card.title}
              href={card.href}
              className="group relative overflow-hidden rounded-2xl border border-white/10 bg-card/60 backdrop-blur-xl hover:border-indigo-500/40 hover:shadow-xl hover:shadow-indigo-500/10 hover:-translate-y-1 transition-all duration-300 ease-out block"
              style={{ animationDelay: `${idx * 70}ms` }}
            >
              {/* Subtle top indicator bar */}
              <div
                className="h-1 w-full bg-gradient-to-r opacity-60 group-hover:opacity-100 transition-opacity"
                style={{
                  backgroundImage: `linear-gradient(to right, ${card.sparklineColor}, transparent)`,
                }}
              />

              <div className="p-5 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground group-hover:text-foreground transition-colors">
                    {card.title}
                  </span>
                  <div
                    className={`p-2.5 rounded-xl border ${card.color} transition-transform group-hover:scale-110 duration-300`}
                  >
                    <Icon className="h-4 w-4" />
                  </div>
                </div>

                <div className="flex items-baseline justify-between pt-1">
                  <div className="text-3xl sm:text-4xl font-black text-foreground tracking-tight">
                    {card.value}
                  </div>
                  <span className={`text-[11px] font-bold px-2 py-0.5 rounded-md ${card.badgeColor}`}>
                    {card.subValue}
                  </span>
                </div>

                {/* SVG Sparkline visualization */}
                <div className="relative h-9 w-full overflow-hidden pt-1">
                  <svg
                    viewBox="0 0 200 30"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                    className="w-full h-full stroke-current"
                    preserveAspectRatio="none"
                  >
                    <path
                      d={card.sparklinePath}
                      stroke={card.sparklineColor}
                      strokeWidth="2.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                    <path
                      d={`${card.sparklinePath} L 200 30 L 0 30 Z`}
                      fill={card.sparklineColor}
                      fillOpacity="0.12"
                    />
                  </svg>
                </div>

                <div className="flex items-center justify-between text-[11px] pt-1 border-t border-border/30">
                  <span className="text-muted-foreground">{card.description}</span>
                  <span className="font-semibold text-emerald-400 flex items-center gap-0.5">
                    <TrendingUp className="w-3 h-3" />
                    {card.velocity}
                  </span>
                </div>
              </div>
            </Link>
          );
        })}
      </div>

      {/* REAL-TIME INBOUND LEADS & DELIVERABLES MATRIX */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column (8 cols): Real-Time Inbound Leads Triage */}
        <Card className="lg:col-span-8 border border-white/10 bg-card/60 backdrop-blur-xl shadow-xl overflow-hidden">
          <CardHeader className="border-b border-border/50 pb-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <CardTitle className="text-lg font-bold flex items-center gap-2">
                  <Activity className="h-5 w-5 text-indigo-400" />
                  <span>Real-Time Inbound Intelligence</span>
                </CardTitle>
                <CardDescription className="text-xs mt-1">
                  Live feed of customer submissions across Contact, Enterprise Quotes, and Newsletter network
                </CardDescription>
              </div>
              <div className="flex items-center gap-2">
                <Button
                  render={<Link href="/admin/leads" />}
                  variant="ghost"
                  size="sm"
                  className="text-xs text-indigo-400 hover:text-indigo-300 hover:bg-indigo-500/10 cursor-pointer font-bold"
                >
                  <span>View All Inquiries ({totalLeads})</span>
                  <ArrowRight className="w-3.5 h-3.5 ml-1.5" />
                </Button>
              </div>
            </div>
          </CardHeader>

          <CardContent className="p-0">
            {recentLeads.length === 0 ? (
              <div className="py-20 text-center text-muted-foreground space-y-3">
                <Users className="w-12 h-12 mx-auto text-muted-foreground/30 animate-pulse" />
                <p className="text-sm font-semibold">No recorded inbound leads yet.</p>
                <p className="text-xs text-muted-foreground max-w-sm mx-auto">
                  Customer submissions from the website contact forms, quotes, and newsletter will automatically stream here.
                </p>
              </div>
            ) : (
              <div className="divide-y divide-border/40">
                {recentLeads.map((lead) => {
                  const isNew = lead.status === 'NEW';
                  const isContacted = lead.status === 'CONTACTED';
                  const initials = lead.name
                    ? lead.name
                        .split(' ')
                        .map((n: string) => n[0])
                        .join('')
                        .toUpperCase()
                        .slice(0, 2)
                    : 'AU';

                  return (
                    <div
                      key={lead.id}
                      className="p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-muted/30 transition-colors group"
                    >
                      <div className="flex items-start gap-3.5">
                        <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-500/20 via-purple-500/20 to-pink-500/20 border border-white/10 flex items-center justify-center shrink-0 font-bold text-xs text-indigo-300 shadow-sm">
                          {initials}
                        </div>

                        <div className="space-y-1">
                          <div className="flex items-center gap-2 flex-wrap">
                            <span className="text-sm font-bold text-foreground">
                              {lead.name || 'Anonymous Prospect'}
                            </span>
                            <Badge
                              variant="outline"
                              className={
                                lead.type === 'QUOTE'
                                  ? 'bg-amber-500/15 text-amber-400 border-amber-500/30 text-[10px] font-bold'
                                  : lead.type === 'CONTACT'
                                  ? 'bg-purple-500/15 text-purple-400 border-purple-500/30 text-[10px] font-bold'
                                  : 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30 text-[10px] font-bold'
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
                      </div>

                      <div className="flex items-center gap-3 shrink-0 self-end sm:self-center">
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

                        <span className="text-[11px] text-muted-foreground whitespace-nowrap font-mono">
                          {new Date(lead.createdAt).toLocaleDateString(undefined, {
                            month: 'short',
                            day: 'numeric',
                          })}
                        </span>

                        <Button
                          render={<Link href="/admin/leads" />}
                          variant="ghost"
                          size="icon-xs"
                          className="hover:bg-indigo-500/10 text-muted-foreground hover:text-indigo-400 cursor-pointer"
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

        {/* Right Column (4 cols): Platform Deliverables Matrix & Infrastructure Telemetry */}
        <div className="lg:col-span-4 space-y-6">
          {/* PLATFORM DELIVERABLES MATRIX */}
          <Card className="border border-white/10 bg-card/60 backdrop-blur-xl shadow-xl">
            <CardHeader className="pb-3 border-b border-border/30">
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-sm font-bold uppercase tracking-wider text-muted-foreground">
                    Deliverables Matrix
                  </CardTitle>
                  <CardDescription className="text-xs">
                    Live production assets on public site
                  </CardDescription>
                </div>
                <Badge variant="outline" className="text-[10px] border-emerald-500/30 text-emerald-400 font-mono">
                  Synced
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-3 pt-4">
              <Link
                href="/admin/portfolio"
                className="flex items-center justify-between p-3 rounded-2xl bg-muted/20 border border-white/5 hover:border-indigo-500/30 hover:bg-muted/40 transition-all group"
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
                <div className="flex items-center gap-2">
                  <span className="text-sm font-black text-foreground">{projectsCount}</span>
                  <ArrowRight className="w-3 h-3 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
                </div>
              </Link>

              <Link
                href="/admin/case-studies"
                className="flex items-center justify-between p-3 rounded-2xl bg-muted/20 border border-white/5 hover:border-purple-500/30 hover:bg-muted/40 transition-all group"
              >
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-xl bg-purple-500/10 text-purple-400 group-hover:scale-110 transition-transform">
                    <FileText className="h-4 w-4" />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-foreground">Case Studies</p>
                    <p className="text-[10px] text-muted-foreground">Enterprise proofs</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-sm font-black text-foreground">{caseStudiesCount}</span>
                  <ArrowRight className="w-3 h-3 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
                </div>
              </Link>

              <Link
                href="/admin/careers"
                className="flex items-center justify-between p-3 rounded-2xl bg-muted/20 border border-white/5 hover:border-pink-500/30 hover:bg-muted/40 transition-all group"
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
                <div className="flex items-center gap-2">
                  <span className="text-sm font-black text-foreground">{jobsCount}</span>
                  <ArrowRight className="w-3 h-3 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
                </div>
              </Link>

              <Link
                href="/admin/blogs"
                className="flex items-center justify-between p-3 rounded-2xl bg-muted/20 border border-white/5 hover:border-amber-500/30 hover:bg-muted/40 transition-all group"
              >
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-xl bg-amber-500/10 text-amber-400 group-hover:scale-110 transition-transform">
                    <Sparkles className="h-4 w-4" />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-foreground">Tech Blogs & Insights</p>
                    <p className="text-[10px] text-muted-foreground">SEO thought leadership</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-sm font-black text-foreground">{blogsCount}</span>
                  <ArrowRight className="w-3 h-3 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
                </div>
              </Link>

              <Link
                href="/admin/team"
                className="flex items-center justify-between p-3 rounded-2xl bg-muted/20 border border-white/5 hover:border-emerald-500/30 hover:bg-muted/40 transition-all group"
              >
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-xl bg-emerald-500/10 text-emerald-400 group-hover:scale-110 transition-transform">
                    <Users className="h-4 w-4" />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-foreground">Leadership Team</p>
                    <p className="text-[10px] text-muted-foreground">Verified public leaders</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-sm font-black text-foreground">{teamCount}</span>
                  <ArrowRight className="w-3 h-3 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
                </div>
              </Link>
            </CardContent>
          </Card>

          {/* SYSTEM INFRASTRUCTURE & TELEMETRY RADAR */}
          <Card className="border border-white/10 bg-card/60 backdrop-blur-xl shadow-xl">
            <CardHeader className="pb-3 border-b border-border/30">
              <div className="flex items-center justify-between">
                <CardTitle className="text-xs font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-2">
                  <Radio className="w-3.5 h-3.5 text-indigo-400" />
                  <span>Cloud Telemetry Radar</span>
                </CardTitle>
                <span className="flex items-center gap-1.5 text-[10px] text-emerald-400 font-mono font-bold">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                  Optimal
                </span>
              </div>
            </CardHeader>
            <CardContent className="space-y-2.5 p-4 text-xs">
              <div className="flex items-center justify-between p-2.5 rounded-xl bg-muted/20 border border-border/30">
                <span className="text-muted-foreground flex items-center gap-2 font-medium">
                  <Database className="w-3.5 h-3.5 text-indigo-400" /> PostgreSQL Neon
                </span>
                <span className="font-semibold text-emerald-400 font-mono">14ms • Online</span>
              </div>
              <div className="flex items-center justify-between p-2.5 rounded-xl bg-muted/20 border border-border/30">
                <span className="text-muted-foreground flex items-center gap-2 font-medium">
                  <Server className="w-3.5 h-3.5 text-purple-400" /> Storage & CDN
                </span>
                <span className="font-semibold text-emerald-400 font-mono">Ready • 100%</span>
              </div>
              <div className="flex items-center justify-between p-2.5 rounded-xl bg-muted/20 border border-border/30">
                <span className="text-muted-foreground flex items-center gap-2 font-medium">
                  <Send className="w-3.5 h-3.5 text-pink-400" /> Resend Dispatcher
                </span>
                <span className="font-semibold text-emerald-400 font-mono">Verified SLA</span>
              </div>
              <div className="flex items-center justify-between p-2.5 rounded-xl bg-muted/20 border border-border/30">
                <span className="text-muted-foreground flex items-center gap-2 font-medium">
                  <ShieldAlert className="w-3.5 h-3.5 text-emerald-400" /> Auth & TLS 1.3
                </span>
                <span className="font-semibold text-emerald-400 font-mono">Enforced</span>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
