'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

export default function SettingsPage() {
  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Settings</h2>
        <p className="text-muted-foreground mt-1">
          Manage your admin preferences and account settings.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Profile Settings</CardTitle>
          <CardDescription>
            This page is currently a placeholder. You can implement full settings in a future issue.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Button disabled>Save Changes</Button>
        </CardContent>
      </Card>
    </div>
  );
}
