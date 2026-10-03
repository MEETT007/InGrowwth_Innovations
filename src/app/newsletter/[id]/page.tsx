import { notFound } from 'next/navigation';
import { db } from '@/lib/db';
import { Metadata } from 'next';
import { Header } from '@/components/shared/header';
import { Footer } from '@/components/shared/footer';
import Image from 'next/image';

interface PageProps {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { id } = await params;
  const campaign = await db.newsletterCampaign.findUnique({
    where: { id },
  });

  if (!campaign) {
    return {
      title: 'Newsletter Not Found | InGrowwth Innovations',
    };
  }

  return {
    title: `${campaign.subject} | InGrowwth Innovations Newsletter`,
    description: `Read the latest newsletter: ${campaign.subject}`,
  };
}

export default async function NewsletterPage({ params }: PageProps) {
  const { id } = await params;
  const campaign = await db.newsletterCampaign.findUnique({
    where: { id },
  });

  if (!campaign) {
    notFound();
  }

  return (
    <>
      <Header />
      <main className="min-h-screen pt-24 pb-16 bg-gray-50 dark:bg-gray-900">
        <article className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl overflow-hidden">
            {campaign.bannerImage && (
              <div className="relative h-64 sm:h-96 w-full">
                <Image
                  src={campaign.bannerImage}
                  alt={campaign.subject}
                  fill
                  className="object-cover"
                />
              </div>
            )}
            <div className="p-8 sm:p-12">
              <div className="text-sm font-semibold text-primary mb-2">
                {campaign.sentAt ? new Date(campaign.sentAt).toLocaleDateString() : 'Draft'}
              </div>
              <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white mb-8 leading-tight">
                {campaign.subject}
              </h1>
              
              <div 
                className="prose prose-lg dark:prose-invert max-w-none prose-a:text-primary hover:prose-a:text-primary/80"
                dangerouslySetInnerHTML={{ __html: campaign.content }}
              />
            </div>
          </div>
        </article>
      </main>
      <Footer />
    </>
  );
}
