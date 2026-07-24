import { notFound } from 'next/navigation';
import { db } from '@/lib/db';
import { BlogEditor } from '../../components/BlogEditor';
import { requireAuthAndRole } from '@/lib/auth';

export const metadata = {
  title: 'Edit Blog Post | Admin',
};

interface EditBlogPageProps {
  params: Promise<{ id: string }>;
}

export default async function EditBlogPage({ params }: EditBlogPageProps) {
  const authCheck = await requireAuthAndRole(['admin', 'editor']);
  if (!authCheck.authorized) {
    return (
      <div className="p-8 text-center text-destructive">
        You do not have permission to view this page.
      </div>
    );
  }

  const { id } = await params;
  
  const post = await db.blogPost.findUnique({
    where: { id },
  });

  if (!post) {
    notFound();
  }

  // Next.js Server Components passing data to Client Components
  // Date objects must be converted to strings or numbers before passing to client components.
  const serializedPost = {
    ...post,
    publishDate: post.publishDate?.toISOString() || null,
    createdAt: post.createdAt.toISOString(),
    updatedAt: post.updatedAt.toISOString(),
  };

  return <BlogEditor initialData={serializedPost} />;
}
