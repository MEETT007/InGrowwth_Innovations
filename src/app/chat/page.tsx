import ChatWorkspace from '@/components/chat/ChatWorkspace';
import { auth } from '@clerk/nextjs/server';
import { PricingTable } from '@clerk/nextjs';

export default async function ChatPage() {
  const { has } = await auth();

  // Gate access by 'pro' plan. If they don't have it, show the pricing table.
  if (!has({ plan: 'pro' })) {
    return (
      <div className="w-full min-h-screen bg-background flex flex-col items-center justify-center p-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 to-purple-500 mb-3">
            Upgrade to AI Consultant Pro
          </h1>
          <p className="text-muted-foreground">
            Get exclusive access to our expert AI Consultant, unlimited queries, and deep
            requirement analysis.
          </p>
        </div>
        <PricingTable />
      </div>
    );
  }

  return (
    <div className="w-full h-screen bg-background m-0 p-0 overflow-hidden">
      <ChatWorkspace />
    </div>
  );
}
