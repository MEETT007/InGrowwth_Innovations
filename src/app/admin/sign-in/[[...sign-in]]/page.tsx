import { SignIn } from '@clerk/nextjs';

export default function AdminSignInPage() {
  return (
    <div className="min-h-[80vh] flex flex-col items-center justify-center py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden bg-gradient-to-b from-background via-background to-muted/30">
      {/* Subtle background glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-primary/10 rounded-full blur-3xl pointer-events-none" />

      <div className="w-full max-w-md space-y-6 text-center z-10">
        <div>
          <h2 className="text-3xl font-extrabold tracking-tight text-foreground sm:text-4xl">
            InGrowwth Admin Portal
          </h2>
          <p className="mt-2 text-sm text-muted-foreground">
            Sign in to access your administrative dashboard and content management system.
          </p>
        </div>

        <div className="flex justify-center pt-4">
          <SignIn
            path="/admin/sign-in"
            routing="path"
            signUpUrl="/admin/sign-up"
            fallbackRedirectUrl="/admin"
            appearance={{
              elements: {
                card: 'bg-card text-card-foreground shadow-2xl border border-border rounded-xl',
                headerTitle: 'text-foreground font-bold',
                headerSubtitle: 'text-muted-foreground',
                formButtonPrimary:
                  'bg-primary text-primary-foreground hover:bg-primary/90 transition-all font-semibold',
                footerActionLink: 'text-primary hover:underline font-medium',
              },
            }}
          />
        </div>
      </div>
    </div>
  );
}
