'use client';

import { UserProfile } from '@clerk/nextjs';

export default function SettingsPage() {
  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Settings</h2>
        <p className="text-muted-foreground mt-1">
          Manage your admin preferences and account settings.
        </p>
      </div>

      <div className="flex justify-center md:justify-start">
        <UserProfile 
          routing="hash"
          appearance={{
            elements: {
              rootBox: "w-full",
              card: "shadow-none border border-border/20 bg-background/50 backdrop-blur-xl",
            }
          }}
        />
      </div>
    </div>
  );
}
