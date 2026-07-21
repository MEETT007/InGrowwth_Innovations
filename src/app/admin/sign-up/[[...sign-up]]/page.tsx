import { SignUp } from '@clerk/nextjs';

export default function AdminSignUpPage() {
  return (
    <div className="min-h-[80vh] flex flex-col items-center justify-center py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden bg-gradient-to-b from-background via-background to-muted/30">
      {/* Background glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-primary/10 rounded-full blur-3xl pointer-events-none" />

      <div className="w-full max-w-md space-y-6 text-center z-10">
        <div>
          <h2 className="text-3xl font-extrabold tracking-tight text-foreground sm:text-4xl">
            Create Admin Account
          </h2>
          <p className="mt-2 text-sm text-muted-foreground">
            Register for access to the InGrowwth CMS & Admin console.
          </p>
        </div>

        <div className="flex justify-center pt-4">
          <SignUp
            path="/admin/sign-up"
            routing="path"
            signInUrl="/admin/sign-in"
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
