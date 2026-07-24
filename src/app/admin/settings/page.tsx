'use client';

import { UserProfile } from '@clerk/nextjs';
import { Settings as SettingsIcon, ShieldCheck } from 'lucide-react';

export default function SettingsPage() {
  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 relative">
      {/* Ambient Background Glow */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-indigo-500/20 rounded-full blur-[100px] -z-10 pointer-events-none" />
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-pink-500/20 rounded-full blur-[100px] -z-10 pointer-events-none" />

      {/* Header Section */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-indigo-500/10 via-purple-500/10 to-pink-500/10 border border-white/10 p-8 md:p-10 shadow-2xl backdrop-blur-xl">
        <div className="absolute top-0 right-0 p-8 opacity-20">
          <SettingsIcon className="w-32 h-32 text-indigo-400 rotate-12" />
        </div>

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex flex-col gap-2">
            <div className="flex items-center gap-3">
              <h1 className="text-4xl md:text-5xl font-black tracking-tight text-transparent bg-clip-text bg-gradient-to-br from-white via-white to-white/60 drop-shadow-sm">
                Account Settings
              </h1>
              <ShieldCheck className="w-8 h-8 text-pink-400 animate-pulse" />
            </div>
            <p className="text-muted-foreground max-w-2xl text-lg leading-relaxed">
              Manage your personal administrative profile, password, security options, and
              credentials.
            </p>
          </div>
        </div>
      </div>

      {/* Clerk UserProfile Container */}
      <div className="flex justify-center md:justify-start w-full relative">
        <div className="w-full max-w-5xl rounded-3xl bg-background/40 backdrop-blur-xl border border-white/10 shadow-lg p-2 md:p-6 overflow-hidden">
          <UserProfile
            routing="hash"
            appearance={{
              variables: {
                colorPrimary: '#6366f1', // Indigo 500
                colorBackground: 'transparent',
              },
              elements: {
                rootBox: 'w-full mx-auto',
                card: 'w-full shadow-none border-0 bg-transparent flex flex-col md:flex-row',
                navbar: 'border-r-0 md:border-r border-white/10 bg-transparent md:pr-4',
                navbarButton:
                  'text-muted-foreground hover:bg-white/5 hover:text-foreground font-medium rounded-xl transition-colors duration-200',
                navbarButtonActive: 'bg-indigo-500/20 text-indigo-400 font-bold rounded-xl',
                headerTitle: 'text-3xl font-black text-foreground',
                headerSubtitle: 'text-muted-foreground text-sm',
                profileSectionTitleText: 'text-lg font-bold text-foreground',
                profileSectionItem:
                  'border-white/5 hover:bg-white/5 rounded-xl p-3 transition-colors duration-200',
                formButtonPrimary:
                  'bg-indigo-600 hover:bg-indigo-700 text-white shadow-lg rounded-xl transition-all duration-200',
                avatarImageActionsUpload:
                  'text-indigo-400 border-indigo-500/30 hover:bg-indigo-500/10',
                badge: 'bg-indigo-500/20 text-indigo-400 border border-indigo-500/30',
                accordionTriggerButton:
                  'hover:bg-white/5 rounded-xl transition-colors duration-200',
              },
            }}
          />
        </div>
      </div>
    </div>
  );
}
