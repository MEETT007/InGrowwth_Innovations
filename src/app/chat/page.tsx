import ChatWorkspace from '@/components/chat/ChatWorkspace';
import PaywallView from '@/components/chat/PaywallView';
import { auth, currentUser } from '@clerk/nextjs/server';

export default async function ChatPage() {
  const { has } = await auth();
  const user = await currentUser();

  // 15 days in milliseconds
  const FIFTEEN_DAYS_MS = 15 * 24 * 60 * 60 * 1000;

  // Check if the user is within their 15-day free trial period
  // eslint-disable-next-line react-hooks/purity
  const isTrialActive = user?.createdAt ? Date.now() - user.createdAt < FIFTEEN_DAYS_MS : true;

  const hasProPlan = has({ plan: 'pro' });

  // Gate access: If they don't have the pro plan AND their trial has expired, show the luxury paywall.
  if (!hasProPlan && !isTrialActive) {
    return <PaywallView />;
  }

  return (
    <div className="w-full h-screen bg-[#07090e] m-0 p-0 overflow-hidden text-slate-100">
      <ChatWorkspace />
    </div>
  );
}
