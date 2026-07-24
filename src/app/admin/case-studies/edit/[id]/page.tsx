import { notFound } from 'next/navigation';
import { db } from '@/lib/db';
import { CaseStudyEditor } from '../../components/CaseStudyEditor';
import { requireAuthAndRole } from '@/lib/auth';

export const metadata = {
  title: 'Edit Case Study | Admin',
};

interface EditCaseStudyPageProps {
  params: Promise<{ id: string }>;
}

export default async function EditCaseStudyPage({ params }: EditCaseStudyPageProps) {
  const authCheck = await requireAuthAndRole(['admin', 'editor']);
  if (!authCheck.authorized) {
    return (
      <div className="p-8 text-center text-destructive">
        You do not have permission to view this page.
      </div>
    );
  }

  const { id } = await params;
  
  const study = await db.caseStudy.findUnique({
    where: { id },
  });

  if (!study) {
    notFound();
  }

  const serializedStudy = {
    ...study,
    createdAt: study.createdAt.toISOString(),
    updatedAt: study.updatedAt.toISOString(),
  };

  return <CaseStudyEditor initialData={serializedStudy} />;
}
