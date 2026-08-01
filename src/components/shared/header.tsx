'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Menu, X, ArrowRight, LayoutDashboard, Box } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { ThemeToggle } from './theme-toggle';
import { Button } from '@/components/ui/button';
import { UserButton, useAuth } from '@clerk/nextjs';

const navLinks = [
  { href: '/about', label: 'About' },
  { href: '/services', label: 'Services' },
  { href: '/projects', label: 'Projects' },
  { href: '/technologies', label: 'Tech Stack' },
  { href: '/blog', label: 'Blog' },
  { href: '/careers', label: 'Careers' },
  { href: '/contact', label: 'Contact' },
];

export function Header() {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();
  const { isSignedIn } = useAuth();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setIsOpen(false);
  }, [pathname]);

  if (pathname?.startsWith('/admin')) {
    return null;
  }

  return (
    <header className="fixed top-0 left-0 right-0 z-50 w-full pt-4 px-4 transition-all duration-500 flex justify-center pointer-events-none">
      {/* Floating Glassmorphic Nav with Gradient Halo */}
      <motion.div
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ type: 'spring', stiffness: 100, damping: 20 }}
        className="pointer-events-auto w-full max-w-7xl relative rounded-full p-[1px] bg-gradient-to-r from-indigo-500/30 via-purple-500/30 to-pink-500/30 shadow-[0_8px_30px_rgb(0,0,0,0.05)] hover:shadow-indigo-500/20 transition-all duration-500 group/nav"
      >
        <div
          className={`w-full h-full rounded-full flex items-center justify-between px-4 py-2.5 transition-all duration-500 ${
            scrolled ? 'bg-background/80 backdrop-blur-2xl' : 'bg-background/50 backdrop-blur-md'
          }`}
        >
          {/* Left: Custom Premium Logo Mark */}
          <Link href="/" className="flex items-center gap-3 group pl-1">
            <div className="relative w-9 h-9 rounded-[10px] bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 flex items-center justify-center shadow-lg shadow-indigo-500/30 transition-all duration-500 shrink-0 overflow-hidden">
              {/* Animated glass shine overlay */}
              <div className="absolute inset-0 bg-[linear-gradient(45deg,transparent_25%,rgba(255,255,255,0.4)_50%,transparent_75%,transparent_100%)] bg-[length:250%_250%,100%_100%] bg-[position:-100%_0,0_0] bg-no-repeat transition-[background-position] duration-700 ease-in-out group-hover:bg-[position:200%_0,0_0]" />
              <Box className="w-5 h-5 text-white relative z-10 transition-transform duration-500 group-hover:scale-110 group-hover:rotate-12" />
            </div>
            <div className="flex items-center gap-1">
              <span className="text-[1rem] sm:text-[1.15rem] font-bold tracking-tight text-foreground group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-indigo-500 group-hover:to-purple-500 transition-all duration-300 line-clamp-1 whitespace-nowrap">
                InGrowwth Innovations
              </span>
            </div>
          </Link>

          {/* Center: Desktop Nav */}
          <nav className="hidden lg:flex items-center gap-1 absolute left-1/2 -translate-x-1/2">
            {navLinks.map((link) => {
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`relative px-3.5 py-1.5 text-sm font-medium rounded-full transition-colors duration-300 ${
                    isActive
                      ? 'text-foreground font-semibold'
                      : 'text-muted-foreground hover:text-foreground hover:bg-foreground/5'
                  }`}
                >
                  {link.label}
                  {isActive && (
                    <motion.div
                      layoutId="header-nav-indicator"
                      className="absolute inset-0 bg-gradient-to-r from-indigo-500/10 to-purple-500/10 rounded-full -z-10"
                      transition={{ type: 'spring', stiffness: 300, damping: 25 }}
                    />
                  )}
                </Link>
              );
            })}
          </nav>

          {/* Right: Actions */}
          <div className="flex items-center gap-2">
            <div className="hidden md:flex items-center gap-2 mr-2">
              <ThemeToggle />
              {isSignedIn && (
                <Link
                  href="/admin"
                  className="hidden xl:flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-border hover:bg-muted text-sm font-medium transition-colors"
                >
                  <LayoutDashboard className="w-4 h-4" />
                  Admin
                </Link>
              )}
              {isSignedIn && <UserButton />}
            </div>

            <Button
              render={<Link href="/contact?type=quote" />}
              nativeButton={false}
              size="sm"
              variant="gradient"
              className="hidden sm:flex rounded-full px-5 cursor-pointer shadow-md shadow-indigo-500/20 group-hover/nav:shadow-indigo-500/40 transition-shadow"
            >
              Get a Quote <ArrowRight className="ml-1 w-4 h-4" />
            </Button>

            {/* Mobile Menu Toggle */}
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsOpen(!isOpen)}
              className="lg:hidden rounded-full text-foreground"
              aria-label="Toggle Menu"
            >
              {isOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </Button>
          </div>
        </div>
      </motion.div>

      {/* Mobile Nav Dropdown */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.95 }}
            transition={{ duration: 0.2, ease: 'easeOut' }}
            className="absolute top-[80px] left-4 right-4 bg-background/95 backdrop-blur-xl border border-indigo-500/20 shadow-2xl shadow-indigo-500/10 rounded-2xl overflow-hidden p-4 flex flex-col gap-2 lg:hidden pointer-events-auto"
          >
            <div className="flex items-center justify-between mb-2 pb-2 border-b border-border/40">
              <span className="font-bold text-foreground">Menu</span>
              <ThemeToggle />
            </div>
            {navLinks.map((link) => {
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`px-4 py-2.5 rounded-xl text-sm font-medium transition-colors ${
                    isActive
                      ? 'bg-gradient-to-r from-indigo-500/10 to-purple-500/10 text-indigo-600 dark:text-indigo-400 font-semibold'
                      : 'text-muted-foreground hover:bg-muted'
                  }`}
                >
                  {link.label}
                </Link>
              );
            })}

            <div className="pt-2 mt-2 border-t border-border/40 flex flex-col gap-2">
              {isSignedIn && (
                <Link
                  href="/admin"
                  className="flex items-center justify-center gap-2 py-2.5 rounded-xl bg-muted text-sm font-medium text-foreground"
                >
                  <LayoutDashboard className="w-4 h-4" />
                  Admin Dashboard
                </Link>
              )}
              <Button
                render={<Link href="/contact?type=quote" />}
                nativeButton={false}
                variant="gradient"
                className="w-full rounded-xl"
              >
                Get a Quote <ArrowRight className="ml-1 w-4 h-4" />
              </Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
