/* AI Consultant Chat Page commented out
import ChatWorkspace from '@/components/chat/ChatWorkspace';
import { auth, currentUser } from '@clerk/nextjs/server';
import { Check, Sparkles } from 'lucide-react';
*/

export default async function ChatPage() {
  /*
  const { has } = await auth();
  const user = await currentUser();
  const FIFTEEN_DAYS_MS = 15 * 24 * 60 * 60 * 1000;
  const isTrialActive = user?.createdAt ? Date.now() - user.createdAt < FIFTEEN_DAYS_MS : false;
  const hasProPlan = has({ plan: 'pro' });

  if (!hasProPlan && !isTrialActive) {
    return ( ... );
  }

  return (
    <div className="w-full h-screen bg-background m-0 p-0 overflow-hidden">
      <ChatWorkspace />
    </div>
  );
  */

  return (
    <div className="w-full min-h-screen bg-background flex flex-col items-center justify-center p-8 text-center">
      <h1 className="text-3xl font-bold mb-4">AI Consultant Temporarily Disabled</h1>
      <p className="text-muted-foreground max-w-md">
        The AI Consultant assistant has been disabled. Please contact support or check back later.
      </p>
    </div>
  );
}
