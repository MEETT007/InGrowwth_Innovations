import { UserProfile } from '@clerk/nextjs';

export default function AdminProfilePage() {
  return (
    <div className="space-y-6 max-w-5xl mx-auto py-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-foreground">
          User Profile & Account
        </h1>
        <p className="text-sm text-muted-foreground mt-1">
          Manage your personal administrative profile, password, security options, and credentials.
        </p>
      </div>

      <div className="flex justify-center pt-4">
        <UserProfile
          appearance={{
            elements: {
              card: 'bg-card text-card-foreground shadow-lg border border-border rounded-xl w-full',
              navbar: 'border-r border-border bg-muted/20',
              navbarButton: 'text-foreground hover:bg-muted font-medium',
              navbarButtonActive: 'bg-primary/10 text-primary font-bold',
              headerTitle: 'text-foreground font-bold',
              headerSubtitle: 'text-muted-foreground',
            },
          }}
        />
      </div>
    </div>
  );
}
