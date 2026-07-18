'use client';

import React from 'react';
import Link from 'next/link';
import { Send, Linkedin, Twitter, Github, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';

const footerLinks = {
  services: [
    { href: '/services/web-dev', label: 'Web Development' },
    { href: '/services/mobile-apps', label: 'Mobile Applications' },
    { href: '/services/ui-ux', label: 'UI/UX Design' },
    { href: '/services/cloud', label: 'Cloud Solutions' },
    { href: '/services/erp', label: 'ERP Systems' },
  ],
  company: [
    { href: '/about', label: 'About Us' },
    { href: '/portfolio', label: 'Portfolio' },
    { href: '/careers', label: 'Careers' },
    { href: '/contact', label: 'Contact Us' },
  ],
  legal: [
    { href: '/privacy', label: 'Privacy Policy' },
    { href: '/terms', label: 'Terms of Service' },
  ],
};

export function Footer() {
  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    // Implementation will connect to Issue #13 newsletter subscription endpoint
  };

  return (
    <footer className="w-full bg-muted/30 border-t border-border/40 mt-auto">
      <div className="max-w-7xl mx-auto px-6 py-16">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-10 md:gap-6">
          {/* Logo & About */}
          <div className="col-span-1 md:col-span-4 flex flex-col gap-4">
            <Link href="/" className="flex items-center gap-2 group">
              <span className="text-xl font-bold bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 bg-clip-text text-transparent group-hover:opacity-80 transition-opacity">
                InGrowwth
              </span>
              <span className="text-xl font-light text-foreground/85">Innovations</span>
            </Link>
            <p className="text-sm text-muted-foreground leading-relaxed max-w-sm">
              We empower startups and enterprises by building premium, modern software systems that
              scale with business growth.
            </p>
            <div className="flex gap-3 mt-2">
              <Link
                href="#"
                className="w-8 h-8 rounded-full bg-muted flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-muted/80 transition-colors"
              >
                <Linkedin className="h-4 w-4" />
              </Link>
              <Link
                href="#"
                className="w-8 h-8 rounded-full bg-muted flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-muted/80 transition-colors"
              >
                <Twitter className="h-4 w-4" />
              </Link>
              <Link
                href="#"
                className="w-8 h-8 rounded-full bg-muted flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-muted/80 transition-colors"
              >
                <Github className="h-4 w-4" />
              </Link>
            </div>
          </div>

          {/* Quick Links - Services */}
          <div className="col-span-1 md:col-span-2">
            <h4 className="text-sm font-semibold text-foreground uppercase tracking-wider mb-4">
              Services
            </h4>
            <ul className="flex flex-col gap-2.5">
              {footerLinks.services.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-muted-foreground hover:text-foreground hover:translate-x-0.5 transition-all flex items-center gap-1 group"
                  >
                    <ChevronRight className="h-3 w-3 opacity-0 group-hover:opacity-100 transition-opacity text-indigo-500" />
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Quick Links - Company */}
          <div className="col-span-1 md:col-span-2">
            <h4 className="text-sm font-semibold text-foreground uppercase tracking-wider mb-4">
              Company
            </h4>
            <ul className="flex flex-col gap-2.5">
              {footerLinks.company.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-muted-foreground hover:text-foreground hover:translate-x-0.5 transition-all flex items-center gap-1 group"
                  >
                    <ChevronRight className="h-3 w-3 opacity-0 group-hover:opacity-100 transition-opacity text-indigo-500" />
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Newsletter subscription */}
          <div className="col-span-1 md:col-span-4 flex flex-col gap-4">
            <div>
              <h4 className="text-sm font-semibold text-foreground uppercase tracking-wider mb-2">
                Subscribe to Newsletter
              </h4>
              <p className="text-xs text-muted-foreground">
                Receive regular insights, case studies, and engineering updates.
              </p>
            </div>
            <form onSubmit={handleSubscribe} className="flex gap-2">
              <input
                type="email"
                required
                placeholder="Enter your email"
                className="flex-1 px-4 py-2 text-sm bg-background border border-border rounded-md focus:outline-none focus:ring-1 focus:ring-indigo-500 transition-all text-foreground"
              />
              <Button
                type="submit"
                size="sm"
                className="bg-primary text-primary-foreground cursor-pointer flex items-center gap-1 px-3"
              >
                <Send className="h-3.5 w-3.5" />
              </Button>
            </form>
          </div>
        </div>

        <div className="border-t border-border/40 mt-12 pt-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-muted-foreground">
            © {new Date().getFullYear()} InGrowwth Innovations. All rights reserved.
          </p>
          <div className="flex gap-6">
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
