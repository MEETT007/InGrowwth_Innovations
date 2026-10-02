import { notFound } from 'next/navigation';
import { db } from '@/lib/db';
import { NewsletterEditor } from '../../components/NewsletterEditor';
import { requireAuthAndRole } from '@/lib/auth';

export const metadata = {
  title: 'Edit Newsletter Campaign | Admin',
};

interface EditNewsletterPageProps {
  params: Promise<{ id: string }>;
}

export default async function EditNewsletterPage({ params }: EditNewsletterPageProps) {
  const authCheck = await requireAuthAndRole(['admin', 'editor']);
  if (!authCheck.authorized) {
    return (
      <div className="p-8 text-center text-destructive">
        You do not have permission to view this page.
      </div>
    );
  }

  const { id } = await params;
  
  const campaign = await db.newsletterCampaign.findUnique({
    where: { id },
  });

  if (!campaign) {
    notFound();
  }

  const serializedCampaign = {
    ...campaign,
    createdAt: campaign.createdAt.toISOString(),
    updatedAt: campaign.updatedAt.toISOString(),
    scheduledFor: campaign.scheduledFor ? campaign.scheduledFor.toISOString() : null,
    sentAt: campaign.sentAt ? campaign.sentAt.toISOString() : null,
  };

  return <NewsletterEditor initialData={serializedCampaign} />;
}
