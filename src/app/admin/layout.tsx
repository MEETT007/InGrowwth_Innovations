import type { Metadata } from 'next';
import { Sidebar } from '@/components/admin/Sidebar';
import { AdminHeader } from '@/components/admin/AdminHeader';
import { Toaster } from '@/components/ui/sonner';

export const metadata: Metadata = {
  title: 'Admin Dashboard | InGrowwth Innovations',
  description: 'Secure administrative interface for content and lead management.',
};

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex h-screen overflow-hidden bg-background">
      <Sidebar />
      <div className="flex flex-col flex-1 overflow-hidden">
        <AdminHeader />
        {/* Mock Security Wrapper: Later to be replaced by real Auth Provider in Issue #14 */}
        <main className="flex-1 overflow-y-auto p-4 md:p-6 bg-muted/20">{children}</main>
      </div>
      <Toaster />
    </div>
  );
}
