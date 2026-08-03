import ChatWorkspace from '@/components/chat/ChatWorkspace';
import { auth, currentUser } from '@clerk/nextjs/server';
import { Check, Sparkles } from 'lucide-react';

export default async function ChatPage() {
  const { has } = await auth();
  const user = await currentUser();

  // 15 days in milliseconds
  const FIFTEEN_DAYS_MS = 15 * 24 * 60 * 60 * 1000;

  // Check if the user is within their 15-day free trial period
  // eslint-disable-next-line react-hooks/purity
  const isTrialActive = user?.createdAt ? Date.now() - user.createdAt < FIFTEEN_DAYS_MS : false;

  const hasProPlan = has({ plan: 'pro' });

  // Gate access: If they don't have the pro plan AND their trial has expired, show the paywall.
  if (!hasProPlan && !isTrialActive) {
    return (
      <div className="w-full min-h-screen bg-background flex flex-col items-center justify-center p-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 to-purple-500 mb-4">
            Your Free Trial Has Expired
          </h1>
          <p className="text-muted-foreground max-w-lg mx-auto text-lg">
            Upgrade to AI Consultant Pro to continue getting exclusive access, unlimited queries,
            and deep requirement analysis.
          </p>
        </div>

        {/* Mock Pricing Card */}
        <div className="bg-card border border-indigo-500/30 rounded-3xl p-8 max-w-sm w-full shadow-2xl shadow-indigo-500/10 relative overflow-hidden">
          <div className="absolute top-0 right-0 bg-indigo-500 text-white text-xs font-bold px-3 py-1 rounded-bl-xl">
            RECOMMENDED
          </div>

          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow-lg">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <h3 className="text-2xl font-bold">Pro Plan</h3>
          </div>

          <div className="mb-6">
            <span className="text-4xl font-bold">$29</span>
            <span className="text-muted-foreground">/month</span>
          </div>

          <ul className="space-y-3 mb-8">
            {[
              'Unlimited AI Consultations',
              'Deep Requirement Analysis',
              'Automated PDF Reports',
              'Priority Support',
            ].map((feature, i) => (
              <li key={i} className="flex items-center gap-3 text-sm text-foreground/80">
                <div className="w-5 h-5 rounded-full bg-indigo-500/20 flex items-center justify-center shrink-0">
                  <Check className="w-3 h-3 text-indigo-500" />
                </div>
                {feature}
              </li>
            ))}
          </ul>

          <button className="w-full bg-indigo-500 hover:bg-indigo-600 text-white font-semibold py-3 rounded-xl transition-all shadow-md hover:shadow-indigo-500/25">
            Subscribe Now
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full h-screen bg-background m-0 p-0 overflow-hidden">
      <ChatWorkspace />
    </div>
  );
}
