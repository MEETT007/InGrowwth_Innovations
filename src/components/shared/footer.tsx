'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  Send,
  Globe,
  MessageSquare,
  Code,
  ChevronRight,
  Sparkles,
  CheckCircle2,
  AlertCircle,
  Loader2,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { subscribeNewsletterAction } from '@/actions/lead';

const footerLinks = {
  services: [
    { href: '/services/web-development', label: 'Web Development' },
    { href: '/services/mobile-apps', label: 'Mobile Applications' },
    { href: '/services/ai-ml', label: 'AI & Machine Learning' },
    { href: '/services/cloud-solutions', label: 'Cloud Solutions' },
    { href: '/services/erp-enterprise', label: 'ERP & Enterprise' },
  ],
  company: [
    { href: '/about', label: 'About Us' },
    { href: '/projects', label: 'Portfolio' },
    { href: '/blog', label: 'Blog & Insights' },
    { href: '/careers', label: 'Careers' },
    { href: '/contact', label: 'Contact Us' },
  ],
  platform: [
    { href: '/technologies', label: 'Tech Stack' },
    { href: '/admin', label: 'Admin Portal' },
    { href: '/api/health', label: 'System Health' },
    { href: '/sitemap.xml', label: 'Sitemap' },
  ],
  legal: [
    { href: '/privacy', label: 'Privacy Policy' },
    { href: '/terms', label: 'Terms of Service' },
    { href: '/security', label: 'Security & Compliance' },
  ],
};

export function Footer() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState<{ success: boolean; message: string } | null>(null);

  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    setLoading(true);
    setStatus(null);

    try {
      const res = await subscribeNewsletterAction({ email });
      if (res.success) {
        setStatus({ success: true, message: res.message });
        setEmail('');
      } else {
        setStatus({ success: false, message: res.message });
      }
    } catch (err) {
      console.error(err);
      setStatus({ success: false, message: 'Failed to subscribe. Please try again.' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <footer className="relative w-full bg-card/40 backdrop-blur-xl border-t border-border/50 mt-auto overflow-hidden">
      {/* Background Ambient Gradient */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-indigo-500/5 rounded-full blur-3xl pointer-events-none -z-10" />
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-purple-500/5 rounded-full blur-3xl pointer-events-none -z-10" />

      <div className="max-w-7xl mx-auto px-6 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-10 lg:gap-8">
          {/* Brand Info */}
          <div className="col-span-1 md:col-span-2 lg:col-span-4 flex flex-col gap-4">
            <Link href="/" className="flex items-center gap-2 group w-fit">
              <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-indigo-500 to-purple-600 flex items-center justify-center shadow-md shadow-indigo-500/20 group-hover:scale-105 transition-transform">
                <Sparkles className="w-4 h-4 text-white" />
              </div>
              <span className="text-xl font-extrabold bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 bg-clip-text text-transparent">
                InGrowwth
              </span>
              <span className="text-xl font-light text-foreground/80">Innovations</span>
            </Link>

            <p className="text-sm text-muted-foreground leading-relaxed max-w-sm">
              Architecting next-generation digital products, AI solutions, and cloud infrastructure
              that accelerate business growth and innovation.
            </p>

            {/* Live Operational Status */}
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400 text-xs font-medium w-fit mt-1">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
              </span>
              All Systems Operational
            </div>

            {/* Social Links */}
            <div className="flex items-center gap-2.5 mt-3">
              <a
                href="https://github.com"
                target="_blank"
                rel="noreferrer"
                aria-label="GitHub"
                className="w-9 h-9 rounded-xl bg-muted/60 border border-border/40 flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-muted hover:border-indigo-500/30 hover:scale-105 transition-all duration-200"
              >
                <svg className="h-4 w-4 fill-current" viewBox="0 0 24 24">
                  <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z" />
                </svg>
              </a>
              <a
                href="https://linkedin.com"
                target="_blank"
                rel="noreferrer"
                aria-label="LinkedIn"
                className="w-9 h-9 rounded-xl bg-muted/60 border border-border/40 flex items-center justify-center text-muted-foreground hover:text-indigo-400 hover:bg-muted hover:border-indigo-500/30 hover:scale-105 transition-all duration-200"
              >
                <svg className="h-4 w-4 fill-current" viewBox="0 0 24 24">
                  <path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.28 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.75M6.46 10.9v8.37H9.2V10.9H6.46M7.83 6.64a1.64 1.64 0 1 0 1.64 1.64c0-.9-.74-1.64-1.64-1.64z" />
                </svg>
              </a>
              <a
                href="https://twitter.com"
                target="_blank"
                rel="noreferrer"
                aria-label="Twitter"
                className="w-9 h-9 rounded-xl bg-muted/60 border border-border/40 flex items-center justify-center text-muted-foreground hover:text-sky-400 hover:bg-muted hover:border-indigo-500/30 hover:scale-105 transition-all duration-200"
              >
                <svg className="h-4 w-4 fill-current" viewBox="0 0 24 24">
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                </svg>
              </a>
              <a
                href="/contact"
                aria-label="Support"
                className="w-9 h-9 rounded-xl bg-muted/60 border border-border/40 flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-muted hover:border-indigo-500/30 hover:scale-105 transition-all duration-200"
              >
                <MessageSquare className="h-4 w-4" />
              </a>
            </div>
          </div>

          {/* Quick Links - Services */}
          <div className="col-span-1 lg:col-span-2">
            <h4 className="text-xs font-bold text-foreground uppercase tracking-widest mb-4">
              Services
            </h4>
            <ul className="flex flex-col gap-2.5">
              {footerLinks.services.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-xs sm:text-sm text-muted-foreground hover:text-foreground transition-colors flex items-center gap-1.5 group"
                  >
                    <ChevronRight className="h-3 w-3 opacity-0 -translate-x-1 group-hover:opacity-100 group-hover:translate-x-0 transition-all text-indigo-500" />
                    <span className="-ml-4 group-hover:ml-0 transition-all">{link.label}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Quick Links - Company */}
          <div className="col-span-1 lg:col-span-2">
            <h4 className="text-xs font-bold text-foreground uppercase tracking-widest mb-4">
              Company
            </h4>
            <ul className="flex flex-col gap-2.5">
              {footerLinks.company.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-xs sm:text-sm text-muted-foreground hover:text-foreground transition-colors flex items-center gap-1.5 group"
                  >
                    <ChevronRight className="h-3 w-3 opacity-0 -translate-x-1 group-hover:opacity-100 group-hover:translate-x-0 transition-all text-indigo-500" />
                    <span className="-ml-4 group-hover:ml-0 transition-all">{link.label}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Quick Links - Platform & Legal */}
          <div className="col-span-1 lg:col-span-2">
            <h4 className="text-xs font-bold text-foreground uppercase tracking-widest mb-4">
              Platform & Legal
            </h4>
            <ul className="flex flex-col gap-2.5">
              {footerLinks.platform.concat(footerLinks.legal).map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-xs sm:text-sm text-muted-foreground hover:text-foreground transition-colors flex items-center gap-1.5 group"
                  >
                    <ChevronRight className="h-3 w-3 opacity-0 -translate-x-1 group-hover:opacity-100 group-hover:translate-x-0 transition-all text-indigo-500" />
                    <span className="-ml-4 group-hover:ml-0 transition-all">{link.label}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Newsletter Box */}
          <div className="col-span-1 md:col-span-2 lg:col-span-2 flex flex-col gap-4">
            <div>
              <h4 className="text-xs font-bold text-foreground uppercase tracking-widest mb-2">
                Newsletter
              </h4>
              <p className="text-xs text-muted-foreground leading-relaxed">
                Join 5,000+ tech leaders getting our engineering insights.
              </p>
            </div>

            <form onSubmit={handleSubscribe} className="flex flex-col gap-2">
              <div className="relative">
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter work email"
                  className="w-full px-3.5 py-2.5 text-xs bg-background/80 border border-border/60 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all text-foreground placeholder:text-muted-foreground/60 shadow-inner"
                />
              </div>
              <Button
                type="submit"
                disabled={loading}
                size="sm"
                className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-medium text-xs rounded-xl shadow-md shadow-indigo-500/20 cursor-pointer flex items-center justify-center gap-2 h-9 transition-all"
              >
                {loading ? (
                  <Loader2 className="h-3.5 w-3.5 animate-spin" />
                ) : (
                  <>
                    <span>Subscribe Now</span>
                    <Send className="h-3.5 w-3.5" />
                  </>
                )}
              </Button>

              {status && (
                <div
                  className={`mt-1 text-xs p-2.5 rounded-lg flex items-start gap-1.5 ${
                    status.success
                      ? 'bg-emerald-500/10 border border-emerald-500/20 text-emerald-500'
                      : 'bg-rose-500/10 border border-rose-500/20 text-rose-500'
                  }`}
                >
                  {status.success ? (
                    <CheckCircle2 className="w-3.5 h-3.5 shrink-0 mt-0.5" />
                  ) : (
                    <AlertCircle className="w-3.5 h-3.5 shrink-0 mt-0.5" />
                  )}
                  <span>{status.message}</span>
                </div>
              )}
            </form>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-border/40 mt-14 pt-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-muted-foreground text-center sm:text-left">
            © {new Date().getFullYear()} InGrowwth Innovations. Engineered for excellence. All
            rights reserved.
          </p>
          <div className="flex items-center gap-6">
            {footerLinks.legal.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-xs text-muted-foreground hover:text-foreground transition-colors"
              >
                {link.label}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
