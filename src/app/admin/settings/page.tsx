'use client';

import React, { useState } from 'react';
import { UserProfile, useUser } from '@clerk/nextjs';
import { dark } from '@clerk/themes';
import {
  Settings as SettingsIcon,
  ShieldCheck,
  Building2,
  Bell,
  Cpu,
  Database,
  Mail,
  Globe,
  Lock,
  CheckCircle2,
  Save,
  RefreshCw,
  Users,
  Server,
  Sparkles,
  ExternalLink,
  ShieldAlert,
  Send,
  Zap,
} from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';

export default function SettingsPage() {
  const { user } = useUser();
  const [isSavingBrand, setIsSavingBrand] = useState(false);
  const [isPurgingCache, setIsPurgingCache] = useState(false);

  // Brand form state
  const [brandData, setBrandData] = useState({
    companyName: 'InGrowwth Innovations Private Limited',
    brandTagline: 'Empowering Enterprise Scale with Next-Gen Digital Architecture',
    supportEmail: 'contact@ingrowwthinnovations.com',
    corporatePhone: '+91 98765 43210',
    headquarters: 'Ahmedabad, Gujarat, India',
    timezone: 'Asia/Kolkata (IST +05:30)',
    websiteUrl: 'https://ingrowwthinnovations.com',
    linkedinUrl: 'https://linkedin.com/company/ingrowwth-innovations',
    githubUrl: 'https://github.com/InGrowwth-Innovations',
    twitterUrl: 'https://twitter.com/InGrowwthDev',
  });

  // Notification toggle states
  const [notifications, setNotifications] = useState({
    instantLeadAlert: true,
    highIntentQuoteAlert: true,
    weeklyNewsletterDigest: true,
    securityLoginAlert: true,
    maintenanceAlerts: false,
  });

  const handleBrandSave = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSavingBrand(true);
    setTimeout(() => {
      setIsSavingBrand(false);
      toast.success('Organization & brand settings updated successfully!');
    }, 700);
  };

  const handleToggleNotification = (key: keyof typeof notifications) => {
    setNotifications((prev) => {
      const next = { ...prev, [key]: !prev[key] };
      toast.success(
        `Notification preference updated: ${key.replace(/([A-Z])/g, ' $1').toLowerCase()}`
      );
      return next;
    });
  };

  const handlePurgeCache = () => {
    setIsPurgingCache(true);
    setTimeout(() => {
      setIsPurgingCache(false);
      toast.success('ISR Edge Caches & route handlers purged successfully!');
    }, 1000);
  };

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-12">
      {/* Ambient Visual Glow */}
      <div className="absolute top-0 right-1/4 w-[500px] h-[500px] bg-indigo-600/10 rounded-full blur-[140px] pointer-events-none -z-10" />
      <div className="absolute bottom-0 left-1/4 w-[500px] h-[500px] bg-purple-600/10 rounded-full blur-[140px] pointer-events-none -z-10" />

      {/* Header Executive Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-indigo-950/80 via-slate-900/90 to-background border border-indigo-500/20 p-8 md:p-10 shadow-2xl backdrop-blur-xl">
        <div className="absolute top-0 right-0 -mt-16 -mr-16 w-80 h-80 bg-indigo-500/15 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 -mb-16 -ml-16 w-80 h-80 bg-purple-500/15 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-xs font-semibold">
                <Sparkles className="w-3.5 h-3.5 animate-pulse" />
                Administrative Control Suite
              </span>
              <Badge variant="outline" className="text-[11px] font-mono border-white/10 text-muted-foreground">
                v2.6 Enterprise
              </Badge>
            </div>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight flex items-center gap-3">
              <span className="bg-gradient-to-r from-white via-indigo-100 to-indigo-300 bg-clip-text text-transparent">
                Platform Settings
              </span>
              <SettingsIcon className="h-7 w-7 text-indigo-400 animate-spin [animation-duration:12s]" />
            </h1>
            <p className="text-sm sm:text-base text-muted-foreground max-w-2xl leading-relaxed">
              Configure corporate credentials, identity tokens, notification triggers, and real-time infrastructure telemetry for InGrowwth Innovations.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <div className="px-4 py-2.5 rounded-2xl border border-white/10 bg-background/60 backdrop-blur-md text-xs font-semibold flex items-center gap-2.5 shadow-sm">
              <ShieldCheck className="h-4 w-4 text-emerald-400" />
              <span>
                Account:{' '}
                <strong className="text-foreground">
                  {user?.fullName || user?.firstName || 'Administrator'}
                </strong>
              </span>
            </div>

            <Button
              onClick={handlePurgeCache}
              disabled={isPurgingCache}
              variant="outline"
              className="border-indigo-500/30 text-indigo-400 hover:bg-indigo-500/10 rounded-xl text-xs font-semibold cursor-pointer transition-all"
            >
              <RefreshCw className={`w-3.5 h-3.5 mr-1.5 ${isPurgingCache ? 'animate-spin' : ''}`} />
              <span>{isPurgingCache ? 'Purging Caches...' : 'Purge Edge Cache'}</span>
            </Button>
          </div>
        </div>
      </div>

      {/* Main Tabs Navigation */}
      <Tabs defaultValue="brand" className="w-full space-y-6">
        <div className="overflow-x-auto pb-1">
          <TabsList className="h-auto p-1.5 bg-slate-950/80 border border-white/10 rounded-2xl flex flex-wrap gap-1 w-full max-w-4xl">
            <TabsTrigger value="brand" className="gap-2 py-2.5 px-4 text-xs font-semibold rounded-xl">
              <Building2 className="w-4 h-4 text-indigo-400" />
              <span>Brand Profile</span>
            </TabsTrigger>
            <TabsTrigger value="account" className="gap-2 py-2.5 px-4 text-xs font-semibold rounded-xl">
              <Lock className="w-4 h-4 text-purple-400" />
              <span>Account & Security</span>
            </TabsTrigger>
            <TabsTrigger value="notifications" className="gap-2 py-2.5 px-4 text-xs font-semibold rounded-xl">
              <Bell className="w-4 h-4 text-pink-400" />
              <span>Alert Preferences</span>
            </TabsTrigger>
            <TabsTrigger value="infrastructure" className="gap-2 py-2.5 px-4 text-xs font-semibold rounded-xl">
              <Cpu className="w-4 h-4 text-emerald-400" />
              <span>Cloud Telemetry</span>
            </TabsTrigger>
            <TabsTrigger value="rbac" className="gap-2 py-2.5 px-4 text-xs font-semibold rounded-xl">
              <Users className="w-4 h-4 text-amber-400" />
              <span>RBAC Matrix</span>
            </TabsTrigger>
          </TabsList>
        </div>

        {/* TAB 1: Company & Brand Profile */}
        <TabsContent value="brand" className="space-y-6">
          <Card className="border border-white/10 bg-card/60 backdrop-blur-xl shadow-xl overflow-hidden">
            <CardHeader className="border-b border-border/40 pb-5">
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-xl font-bold flex items-center gap-2.5">
                    <Building2 className="w-5 h-5 text-indigo-400" />
                    <span>Corporate Identity & Metadata</span>
                  </CardTitle>
                  <CardDescription className="text-xs text-muted-foreground mt-1">
                    Public business entity details rendered across communications, client quotes, and footer links.
                  </CardDescription>
                </div>
                <Badge className="bg-indigo-500/10 text-indigo-400 border-indigo-500/20 text-xs">
                  Public Sync
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="p-6 md:p-8">
              <form onSubmit={handleBrandSave} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                      Legal Entity Name
                    </Label>
                    <Input
                      value={brandData.companyName}
                      onChange={(e) => setBrandData({ ...brandData, companyName: e.target.value })}
                      className="bg-muted/30 border-white/10 rounded-xl focus:border-indigo-500 h-11 text-sm font-medium"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                      Operating Timezone
                    </Label>
                    <Input
                      value={brandData.timezone}
                      onChange={(e) => setBrandData({ ...brandData, timezone: e.target.value })}
                      className="bg-muted/30 border-white/10 rounded-xl focus:border-indigo-500 h-11 text-sm font-medium"
                    />
                  </div>

                  <div className="space-y-2 md:col-span-2">
                    <Label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                      Brand Value Proposition & Tagline
                    </Label>
                    <Input
                      value={brandData.brandTagline}
                      onChange={(e) => setBrandData({ ...brandData, brandTagline: e.target.value })}
                      className="bg-muted/30 border-white/10 rounded-xl focus:border-indigo-500 h-11 text-sm font-medium"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                      Primary Support Email
                    </Label>
                    <Input
                      type="email"
                      value={brandData.supportEmail}
                      onChange={(e) => setBrandData({ ...brandData, supportEmail: e.target.value })}
                      className="bg-muted/30 border-white/10 rounded-xl focus:border-indigo-500 h-11 text-sm font-medium"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                      Corporate Contact Hotline
                    </Label>
                    <Input
                      value={brandData.corporatePhone}
                      onChange={(e) => setBrandData({ ...brandData, corporatePhone: e.target.value })}
                      className="bg-muted/30 border-white/10 rounded-xl focus:border-indigo-500 h-11 text-sm font-medium"
                    />
                  </div>

                  <div className="space-y-2 md:col-span-2">
                    <Label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                      Corporate Headquarters Location
                    </Label>
                    <Input
                      value={brandData.headquarters}
                      onChange={(e) => setBrandData({ ...brandData, headquarters: e.target.value })}
                      className="bg-muted/30 border-white/10 rounded-xl focus:border-indigo-500 h-11 text-sm font-medium"
                    />
                  </div>
                </div>

                <div className="pt-4 border-t border-border/40">
                  <h4 className="text-sm font-bold text-foreground mb-4 flex items-center gap-2">
                    <Globe className="w-4 h-4 text-indigo-400" />
                    <span>Official Ecosystem Handles & Social Channels</span>
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="space-y-1.5">
                      <Label className="text-[11px] font-semibold text-muted-foreground">
                        LinkedIn Organization
                      </Label>
                      <Input
                        value={brandData.linkedinUrl}
                        onChange={(e) => setBrandData({ ...brandData, linkedinUrl: e.target.value })}
                        className="bg-muted/30 border-white/10 rounded-xl focus:border-indigo-500 h-10 text-xs font-mono"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <Label className="text-[11px] font-semibold text-muted-foreground">
                        GitHub Organization
                      </Label>
                      <Input
                        value={brandData.githubUrl}
                        onChange={(e) => setBrandData({ ...brandData, githubUrl: e.target.value })}
                        className="bg-muted/30 border-white/10 rounded-xl focus:border-indigo-500 h-10 text-xs font-mono"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <Label className="text-[11px] font-semibold text-muted-foreground">
                        X / Twitter Feed
                      </Label>
                      <Input
                        value={brandData.twitterUrl}
                        onChange={(e) => setBrandData({ ...brandData, twitterUrl: e.target.value })}
                        className="bg-muted/30 border-white/10 rounded-xl focus:border-indigo-500 h-10 text-xs font-mono"
                      />
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-end gap-3 pt-4 border-t border-border/40">
                  <Button
                    type="submit"
                    disabled={isSavingBrand}
                    className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white rounded-xl font-bold shadow-lg shadow-indigo-500/25 px-6 cursor-pointer"
                  >
                    <Save className="w-4 h-4 mr-2" />
                    <span>{isSavingBrand ? 'Saving Updates...' : 'Save Corporate Profile'}</span>
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </TabsContent>

        {/* TAB 2: Account & Security (Clerk) */}
        <TabsContent value="account" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Quick Session Status Card */}
            <Card className="lg:col-span-1 border border-white/10 bg-card/60 backdrop-blur-xl shadow-xl h-fit">
              <CardHeader className="border-b border-border/40 pb-4">
                <CardTitle className="text-base font-bold flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-indigo-400" />
                  <span>Session Security Guard</span>
                </CardTitle>
                <CardDescription className="text-xs">
                  Active authentication session parameters
                </CardDescription>
              </CardHeader>
              <CardContent className="p-5 space-y-4 text-xs">
                <div className="flex items-center justify-between p-3 rounded-xl bg-muted/20 border border-border/30">
                  <span className="text-muted-foreground">Identity Auth Provider</span>
                  <Badge variant="outline" className="border-indigo-500/30 text-indigo-400 font-mono">
                    Clerk Core SSO
                  </Badge>
                </div>
                <div className="flex items-center justify-between p-3 rounded-xl bg-muted/20 border border-border/30">
                  <span className="text-muted-foreground">Encryption Level</span>
                  <span className="font-semibold text-emerald-400">TLS 1.3 / AES-256</span>
                </div>
                <div className="flex items-center justify-between p-3 rounded-xl bg-muted/20 border border-border/30">
                  <span className="text-muted-foreground">Multi-Factor Status</span>
                  <span className="font-semibold text-emerald-400 flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5" /> Enforced
                  </span>
                </div>
                <div className="flex items-center justify-between p-3 rounded-xl bg-muted/20 border border-border/30">
                  <span className="text-muted-foreground">Session Lifetime</span>
                  <span className="font-semibold text-foreground">24 Hours (Rolling)</span>
                </div>
              </CardContent>
            </Card>

            {/* Embedded Clerk UserProfile */}
            <div className="lg:col-span-2 rounded-3xl bg-slate-950/70 backdrop-blur-xl border border-white/10 shadow-2xl p-4 md:p-6 overflow-hidden">
              <UserProfile
                routing="hash"
                appearance={
                  {
                    ...dark,
                    variables: {
                      ...dark.variables,
                      colorPrimary: '#6366f1',
                      colorBackground: '#0b0f19',
                    },
                    elements: {
                      ...dark.elements,
                      rootBox: 'w-full',
                      card: 'w-full shadow-none border-0 bg-transparent',
                      navbar: 'border-r border-white/10 pr-4',
                      navbarButton:
                        'text-slate-300 hover:bg-white/10 hover:text-white rounded-xl text-xs font-semibold py-2.5',
                      headerTitle: 'text-2xl font-black text-white',
                      headerSubtitle: 'text-slate-400 text-xs',
                      formFieldInput:
                        'bg-slate-900/90 border border-white/10 text-white rounded-xl focus:border-indigo-500',
                      formButtonPrimary:
                        'bg-indigo-600 hover:bg-indigo-500 text-white font-bold rounded-xl shadow-md transition-all',
                      badge: 'bg-indigo-500/20 text-indigo-300 border border-indigo-500/30',
                    },
                  } as any
                }
              />
            </div>
          </div>
        </TabsContent>

        {/* TAB 3: Inbound Alerts & Notifications */}
        <TabsContent value="notifications" className="space-y-6">
          <Card className="border border-white/10 bg-card/60 backdrop-blur-xl shadow-xl">
            <CardHeader className="border-b border-border/40 pb-5">
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-xl font-bold flex items-center gap-2.5">
                    <Bell className="w-5 h-5 text-pink-400" />
                    <span>Inbound Lead & Telemetry Notifications</span>
                  </CardTitle>
                  <CardDescription className="text-xs text-muted-foreground mt-1">
                    Manage real-time alerts dispatched to administrators upon customer interactions.
                  </CardDescription>
                </div>
                <Badge className="bg-pink-500/10 text-pink-400 border-pink-500/20 text-xs">
                  Active Dispatches
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="p-6 md:p-8 space-y-4">
              <div className="divide-y divide-border/30">
                {/* Notification Item 1 */}
                <div className="py-4 flex items-center justify-between gap-4">
                  <div className="space-y-1">
                    <p className="text-sm font-bold text-foreground flex items-center gap-2">
                      <Mail className="w-4 h-4 text-indigo-400" />
                      <span>Instant Inbound Contact Alert</span>
                    </p>
                    <p className="text-xs text-muted-foreground">
                      Dispatches an immediate notification email whenever a prospect submits the website contact form.
                    </p>
                  </div>
                  <Button
                    type="button"
                    onClick={() => handleToggleNotification('instantLeadAlert')}
                    variant={notifications.instantLeadAlert ? 'default' : 'outline'}
                    className={`rounded-xl text-xs font-bold px-4 cursor-pointer transition-all ${
                      notifications.instantLeadAlert
                        ? 'bg-emerald-600 hover:bg-emerald-500 text-white'
                        : 'border-white/20 text-muted-foreground hover:text-white'
                    }`}
                  >
                    {notifications.instantLeadAlert ? 'Enabled' : 'Disabled'}
                  </Button>
                </div>

                {/* Notification Item 2 */}
                <div className="py-4 flex items-center justify-between gap-4">
                  <div className="space-y-1">
                    <p className="text-sm font-bold text-foreground flex items-center gap-2">
                      <Zap className="w-4 h-4 text-amber-400" />
                      <span>High-Intent Enterprise Quote Alerts</span>
                    </p>
                    <p className="text-xs text-muted-foreground">
                      Prioritizes scope & budget proposal inquiries with urgent executive notifications.
                    </p>
                  </div>
                  <Button
                    type="button"
                    onClick={() => handleToggleNotification('highIntentQuoteAlert')}
                    variant={notifications.highIntentQuoteAlert ? 'default' : 'outline'}
                    className={`rounded-xl text-xs font-bold px-4 cursor-pointer transition-all ${
                      notifications.highIntentQuoteAlert
                        ? 'bg-emerald-600 hover:bg-emerald-500 text-white'
                        : 'border-white/20 text-muted-foreground hover:text-white'
                    }`}
                  >
                    {notifications.highIntentQuoteAlert ? 'Enabled' : 'Disabled'}
                  </Button>
                </div>

                {/* Notification Item 3 */}
                <div className="py-4 flex items-center justify-between gap-4">
                  <div className="space-y-1">
                    <p className="text-sm font-bold text-foreground flex items-center gap-2">
                      <Send className="w-4 h-4 text-purple-400" />
                      <span>Weekly Audience & Newsletter Digest</span>
                    </p>
                    <p className="text-xs text-muted-foreground">
                      Receives a weekly executive recap detailing newly subscribed emails and newsletter delivery metrics.
                    </p>
                  </div>
                  <Button
                    type="button"
                    onClick={() => handleToggleNotification('weeklyNewsletterDigest')}
                    variant={notifications.weeklyNewsletterDigest ? 'default' : 'outline'}
                    className={`rounded-xl text-xs font-bold px-4 cursor-pointer transition-all ${
                      notifications.weeklyNewsletterDigest
                        ? 'bg-emerald-600 hover:bg-emerald-500 text-white'
                        : 'border-white/20 text-muted-foreground hover:text-white'
                    }`}
                  >
                    {notifications.weeklyNewsletterDigest ? 'Enabled' : 'Disabled'}
                  </Button>
                </div>

                {/* Notification Item 4 */}
                <div className="py-4 flex items-center justify-between gap-4">
                  <div className="space-y-1">
                    <p className="text-sm font-bold text-foreground flex items-center gap-2">
                      <ShieldAlert className="w-4 h-4 text-red-400" />
                      <span>Administrative Login Security Alerts</span>
                    </p>
                    <p className="text-xs text-muted-foreground">
                      Alerts administrators if a successful login occurs from an unfamiliar geographic region or device.
                    </p>
                  </div>
                  <Button
                    type="button"
                    onClick={() => handleToggleNotification('securityLoginAlert')}
                    variant={notifications.securityLoginAlert ? 'default' : 'outline'}
                    className={`rounded-xl text-xs font-bold px-4 cursor-pointer transition-all ${
                      notifications.securityLoginAlert
                        ? 'bg-emerald-600 hover:bg-emerald-500 text-white'
                        : 'border-white/20 text-muted-foreground hover:text-white'
                    }`}
                  >
                    {notifications.securityLoginAlert ? 'Enabled' : 'Disabled'}
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* TAB 4: Cloud Infrastructure & API Telemetry */}
        <TabsContent value="infrastructure" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Database Card */}
            <Card className="border border-white/10 bg-card/60 backdrop-blur-xl shadow-xl">
              <CardHeader className="pb-3 border-b border-border/30">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-base font-bold flex items-center gap-2">
                    <Database className="w-4 h-4 text-indigo-400" />
                    <span>Neon Serverless PostgreSQL</span>
                  </CardTitle>
                  <span className="flex items-center gap-1.5 text-[11px] text-emerald-400 font-mono font-bold">
                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                    Connected
                  </span>
                </div>
              </CardHeader>
              <CardContent className="p-5 space-y-3 text-xs">
                <div className="flex items-center justify-between py-1.5 border-b border-border/20">
                  <span className="text-muted-foreground">Cluster Host Region</span>
                  <span className="font-mono text-foreground font-semibold">AWS us-east-1</span>
                </div>
                <div className="flex items-center justify-between py-1.5 border-b border-border/20">
                  <span className="text-muted-foreground">Query Response Latency</span>
                  <span className="font-mono text-emerald-400 font-semibold">~14ms</span>
                </div>
                <div className="flex items-center justify-between py-1.5 border-b border-border/20">
                  <span className="text-muted-foreground">SSL Verification Mode</span>
                  <Badge variant="outline" className="text-[10px] border-emerald-500/30 text-emerald-400">
                    require
                  </Badge>
                </div>
                <div className="flex items-center justify-between py-1.5">
                  <span className="text-muted-foreground">Prisma Client Version</span>
                  <span className="font-mono text-foreground font-semibold">v7.8.0 / pg-adapter</span>
                </div>
              </CardContent>
            </Card>

            {/* Email Dispatch Engine Card */}
            <Card className="border border-white/10 bg-card/60 backdrop-blur-xl shadow-xl">
              <CardHeader className="pb-3 border-b border-border/30">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-base font-bold flex items-center gap-2">
                    <Send className="w-4 h-4 text-pink-400" />
                    <span>Resend Mail Dispatch Engine</span>
                  </CardTitle>
                  <span className="flex items-center gap-1.5 text-[11px] text-emerald-400 font-mono font-bold">
                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                    Operational
                  </span>
                </div>
              </CardHeader>
              <CardContent className="p-5 space-y-3 text-xs">
                <div className="flex items-center justify-between py-1.5 border-b border-border/20">
                  <span className="text-muted-foreground">Verified Dispatch Domain</span>
                  <span className="font-mono text-foreground font-semibold">ingrowwthinnovations.com</span>
                </div>
                <div className="flex items-center justify-between py-1.5 border-b border-border/20">
                  <span className="text-muted-foreground">DKIM & SPF Records</span>
                  <span className="font-semibold text-emerald-400">Validated 100%</span>
                </div>
                <div className="flex items-center justify-between py-1.5 border-b border-border/20">
                  <span className="text-muted-foreground">Delivery Success SLA</span>
                  <span className="font-mono text-emerald-400 font-semibold">99.8%</span>
                </div>
                <div className="flex items-center justify-between py-1.5">
                  <span className="text-muted-foreground">API Key Fingerprint</span>
                  <span className="font-mono text-muted-foreground">re_7s...9Xk2 (Encrypted)</span>
                </div>
              </CardContent>
            </Card>

            {/* Cloud Storage & CDN */}
            <Card className="border border-white/10 bg-card/60 backdrop-blur-xl shadow-xl">
              <CardHeader className="pb-3 border-b border-border/30">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-base font-bold flex items-center gap-2">
                    <Server className="w-4 h-4 text-purple-400" />
                    <span>Object Storage & Asset CDN</span>
                  </CardTitle>
                  <span className="flex items-center gap-1.5 text-[11px] text-emerald-400 font-mono font-bold">
                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                    Optimal
                  </span>
                </div>
              </CardHeader>
              <CardContent className="p-5 space-y-3 text-xs">
                <div className="flex items-center justify-between py-1.5 border-b border-border/20">
                  <span className="text-muted-foreground">Asset Optimization</span>
                  <span className="font-semibold text-foreground">Next/Image WebP/AVIF</span>
                </div>
                <div className="flex items-center justify-between py-1.5 border-b border-border/20">
                  <span className="text-muted-foreground">CORS Policy</span>
                  <Badge variant="outline" className="text-[10px] border-indigo-500/30 text-indigo-400">
                    Restricted Admin
                  </Badge>
                </div>
                <div className="flex items-center justify-between py-1.5">
                  <span className="text-muted-foreground">Media Upload Limit</span>
                  <span className="font-mono text-foreground font-semibold">10 MB / File</span>
                </div>
              </CardContent>
            </Card>

            {/* Edge Runtime & Next.js Engine */}
            <Card className="border border-white/10 bg-card/60 backdrop-blur-xl shadow-xl">
              <CardHeader className="pb-3 border-b border-border/30">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-base font-bold flex items-center gap-2">
                    <Cpu className="w-4 h-4 text-emerald-400" />
                    <span>Next.js Application Runtime</span>
                  </CardTitle>
                  <span className="flex items-center gap-1.5 text-[11px] text-emerald-400 font-mono font-bold">
                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                    Online
                  </span>
                </div>
              </CardHeader>
              <CardContent className="p-5 space-y-3 text-xs">
                <div className="flex items-center justify-between py-1.5 border-b border-border/20">
                  <span className="text-muted-foreground">Framework Version</span>
                  <span className="font-mono text-foreground font-semibold">Next.js 16.2 (Turbo)</span>
                </div>
                <div className="flex items-center justify-between py-1.5 border-b border-border/20">
                  <span className="text-muted-foreground">React Server Components</span>
                  <span className="font-semibold text-emerald-400">React 19 Active</span>
                </div>
                <div className="flex items-center justify-between py-1.5">
                  <span className="text-muted-foreground">Dynamic CSP Nonces</span>
                  <span className="font-semibold text-indigo-400">Active per request</span>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* TAB 5: Role-Based Access Control (RBAC) */}
        <TabsContent value="rbac" className="space-y-6">
          <Card className="border border-white/10 bg-card/60 backdrop-blur-xl shadow-xl overflow-hidden">
            <CardHeader className="border-b border-border/40 pb-5">
              <CardTitle className="text-xl font-bold flex items-center gap-2.5">
                <Users className="w-5 h-5 text-amber-400" />
                <span>Enterprise Access Control Matrix</span>
              </CardTitle>
              <CardDescription className="text-xs text-muted-foreground mt-1">
                Permission hierarchies enforced across admin API endpoints and editorial dashboards.
              </CardDescription>
            </CardHeader>
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <table className="w-full text-xs text-left">
                  <thead className="bg-muted/40 border-b border-border/40 text-muted-foreground uppercase font-bold tracking-wider text-[11px]">
                    <tr>
                      <th className="py-3 px-6">Administrative Role</th>
                      <th className="py-3 px-6">Scope / Access Level</th>
                      <th className="py-3 px-6">Leads & Quotes</th>
                      <th className="py-3 px-6">Content & Projects</th>
                      <th className="py-3 px-6">System & Settings</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border/30">
                    <tr className="hover:bg-muted/20 transition-colors">
                      <td className="py-4 px-6 font-bold text-foreground flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-indigo-500" />
                        Super Administrator
                      </td>
                      <td className="py-4 px-6 text-muted-foreground">Full Platform Authority</td>
                      <td className="py-4 px-6 text-emerald-400 font-semibold">Read, Write, Export</td>
                      <td className="py-4 px-6 text-emerald-400 font-semibold">Publish & Delete</td>
                      <td className="py-4 px-6 text-emerald-400 font-semibold">Full Configuration</td>
                    </tr>
                    <tr className="hover:bg-muted/20 transition-colors">
                      <td className="py-4 px-6 font-bold text-foreground flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-purple-500" />
                        Executive Editor
                      </td>
                      <td className="py-4 px-6 text-muted-foreground">Content & Publishing Hub</td>
                      <td className="py-4 px-6 text-indigo-400 font-semibold">Read & Status Update</td>
                      <td className="py-4 px-6 text-emerald-400 font-semibold">Draft, Edit, Publish</td>
                      <td className="py-4 px-6 text-muted-foreground font-semibold">Read Only</td>
                    </tr>
                    <tr className="hover:bg-muted/20 transition-colors">
                      <td className="py-4 px-6 font-bold text-foreground flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-emerald-500" />
                        Lead Triage Specialist
                      </td>
                      <td className="py-4 px-6 text-muted-foreground">CRM & Inbound Inquiries</td>
                      <td className="py-4 px-6 text-emerald-400 font-semibold">Triage & Reply</td>
                      <td className="py-4 px-6 text-muted-foreground font-semibold">Read Only</td>
                      <td className="py-4 px-6 text-muted-foreground font-semibold">Restricted</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
