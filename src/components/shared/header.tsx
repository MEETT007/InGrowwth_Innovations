'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  Menu,
  X,
  ArrowRight,
  Sparkles,
  Briefcase,
  Code2,
  FolderKanban,
  BookOpen,
  Users,
  Mail,
  Shield,
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { ThemeToggle } from './theme-toggle';
import { Button } from '@/components/ui/button';

const navLinks = [
  { href: '/about', label: 'About', icon: Shield },
  { href: '/services', label: 'Services', icon: Briefcase },
  { href: '/projects', label: 'Projects', icon: FolderKanban },
  { href: '/technologies', label: 'Tech Stack', icon: Code2 },
  { href: '/blog', label: 'Blog', icon: BookOpen },
  { href: '/careers', label: 'Careers', icon: Users },
  { href: '/contact', label: 'Contact', icon: Mail },
];

export function Header() {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 15);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close mobile menu on route change
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setIsOpen(false);
  }, [pathname]);

  return (
    <header className="sticky top-0 z-50 w-full transition-all duration-300">
      {/* Top Banner Chip */}
      <div className="hidden lg:flex items-center justify-center bg-gradient-to-r from-indigo-900/30 via-purple-900/30 to-pink-900/30 backdrop-blur-md border-b border-white/5 py-1.5 px-4 text-xs font-medium text-muted-foreground">
        <div className="flex items-center gap-2">
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-600 dark:text-indigo-400 font-semibold text-[10px] tracking-wider uppercase">
            New
          </span>
          <span>Architecting Enterprise AI & Custom Cloud Systems</span>
          <Link
            href="/contact?type=quote"
            className="text-indigo-600 dark:text-indigo-400 font-semibold hover:underline flex items-center gap-1 ml-1"
          >
            Start your project <ArrowRight className="w-3 h-3" />
          </Link>
        </div>
      </div>

      {/* Main Header Navigation Bar */}
      <div
        className={`w-full transition-all duration-500 ${
          scrolled
            ? 'bg-background/80 dark:bg-background/70 backdrop-blur-xl border-b border-border/50 shadow-sm'
            : 'bg-transparent border-b border-transparent'
        }`}
      >
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2.5 group">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-indigo-500 via-purple-500 to-pink-500 p-0.5 shadow-md shadow-indigo-500/20 group-hover:scale-105 transition-transform">
              <div className="w-full h-full bg-background rounded-[10px] flex items-center justify-center">
                <Sparkles className="w-4 h-4 text-indigo-500 dark:text-indigo-400" />
              </div>
            </div>
            <div className="flex flex-col">
              <div className="flex items-center gap-1">
                <span className="text-xl font-black bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 bg-clip-text text-transparent tracking-tight">
                  InGrowwth
                </span>
                <span className="text-xl font-light text-foreground/90 tracking-tight">
                  Innovations
                </span>
              </div>
            </div>
          </Link>

          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center gap-1.5 bg-muted/30 p-1.5 rounded-full border border-border/40 backdrop-blur-md">
            {navLinks.map((link) => {
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`relative px-4 py-1.5 text-xs font-semibold rounded-full transition-all duration-200 ${
                    isActive
                      ? 'text-foreground font-bold'
                      : 'text-muted-foreground hover:text-foreground hover:bg-muted/50'
                  }`}
                >
                  {link.label}
                  {isActive && (
                    <motion.div
                      layoutId="activeHeaderNav"
                      className="absolute inset-0 bg-background shadow-xs border border-border/60 rounded-full -z-10"
                      transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                    />
                  )}
                </Link>
              );
            })}
          </nav>

          {/* Actions (Desktop) */}
          <div className="hidden lg:flex items-center gap-3">
            <ThemeToggle />

            {/* Commented out sign section and get a quote as requested
            {isSignedIn ? (
              <div className="flex items-center gap-3 bg-muted/40 p-1 pl-3 rounded-full border border-border/40">
                <Link
                  href="/admin"
                  className="text-xs font-bold text-foreground flex items-center gap-1.5 hover:text-indigo-500 transition-colors"
                >
                  <LayoutDashboard className="w-3.5 h-3.5 text-indigo-500" />
                  Admin
                </Link>
                <UserButton />
              </div>
            ) : (
              <Link
                href="/admin/sign-in"
                className="text-xs font-semibold px-3 py-2 text-muted-foreground hover:text-foreground transition-colors"
              >
                Sign In
              </Link>
            )}

            <Button
              render={<Link href="/contact?type=quote" />}
              nativeButton={false}
              size="sm"
              variant="gradient"
              className="cursor-pointer shadow-indigo-500/20 hover:scale-105 transition-transform"
            >
              <span>Get a Quote</span>
              <ArrowRight />
            </Button>
            */}
          </div>

          {/* Mobile Hamburger & Toggle */}
          <div className="flex lg:hidden items-center gap-3">
            <ThemeToggle />
            <Button
              variant="outline"
              size="icon"
              onClick={() => setIsOpen(!isOpen)}
              className="bg-muted/60 hover:bg-muted border-border/40 text-foreground cursor-pointer"
              aria-label="Toggle Menu"
            >
              {isOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </Button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation Dropdown */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.25, ease: 'easeInOut' }}
            className="lg:hidden w-full bg-background/95 backdrop-blur-2xl border-b border-border/50 shadow-2xl overflow-hidden"
          >
            <div className="max-w-7xl mx-auto px-6 py-6 flex flex-col gap-6">
              <div className="grid grid-cols-2 gap-2">
                {navLinks.map((link) => {
                  const isActive = pathname === link.href;
                  const Icon = link.icon;
                  return (
                    <Link
                      key={link.href}
                      href={link.href}
                      className={`flex items-center gap-2.5 p-3 rounded-2xl text-xs font-semibold transition-all ${
                        isActive
                          ? 'bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border border-indigo-500/20'
                          : 'text-muted-foreground hover:text-foreground hover:bg-muted/50'
                      }`}
                    >
                      <div className="p-2 rounded-xl bg-background border border-border/40">
                        <Icon className="w-4 h-4 text-indigo-500" />
                      </div>
                      <span>{link.label}</span>
                    </Link>
                  );
                })}
              </div>

              {/* Commented out sign section and get a quote from mobile menu as requested
              <div className="flex flex-col gap-3 pt-4 border-t border-border/40">
                {isSignedIn ? (
                  <Link
                    href="/admin"
                    className="flex items-center justify-center gap-2 py-2.5 rounded-xl bg-muted text-xs font-bold text-foreground"
                  >
                    <LayoutDashboard className="w-4 h-4 text-indigo-500" />
                    Go to Admin Dashboard
                  </Link>
                ) : (
                  <Link
                    href="/admin/sign-in"
                    className="text-center py-2 text-xs font-semibold text-muted-foreground hover:text-foreground"
                  >
                    Admin Sign In
                  </Link>
                )}

                <Button
                  render={<Link href="/contact?type=quote" />}
                  nativeButton={false}
                  variant="gradient"
                  size="default"
                  className="w-full shadow-indigo-500/20"
                >
                  <span>Get a Quote</span>
                  <ArrowRight />
                </Button>
              </div>
              */}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
