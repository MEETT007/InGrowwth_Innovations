import { notFound } from 'next/navigation';
import { db } from '@/lib/db';
import { PortfolioEditor } from '../../components/PortfolioEditor';
import { requireAuthAndRole } from '@/lib/auth';

export const metadata = {
  title: 'Edit Portfolio Project | Admin',
};

interface EditPortfolioPageProps {
  params: Promise<{ id: string }>;
}

export default async function EditPortfolioPage({ params }: EditPortfolioPageProps) {
  const authCheck = await requireAuthAndRole(['admin', 'editor']);
  if (!authCheck.authorized) {
    return (
      <div className="p-8 text-center text-destructive">
        You do not have permission to view this page.
      </div>
    );
  }

  const { id } = await params;
  
  const project = await db.portfolioProject.findUnique({
    where: { id },
  });

  if (!project) {
    notFound();
  }

  const serializedProject = {
    ...project,
    createdAt: project.createdAt.toISOString(),
    updatedAt: project.updatedAt.toISOString(),
  };

  return <PortfolioEditor initialData={serializedProject} />;
}
