'use client';

import { useState } from 'react';
import { ColumnDef } from '@tanstack/react-table';
import { toast } from 'sonner';
import { ArrowUpDown, Download, Mail } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { DataTable } from '@/components/ui/data-table';

type SubscriberStatus = 'Subscribed' | 'Unsubscribed';

interface NewsletterSubscriber {
  id: string;
  email: string;
  dateJoined: string;
  source: string;
  status: SubscriberStatus;
}

const mockData: NewsletterSubscriber[] = [
  {
    id: '1',
    email: 'marketing_guru@example.com',
    dateJoined: '2026-07-20',
    source: 'Footer Form',
    status: 'Subscribed',
  },
  {
    id: '2',
    email: 'tech_lead@startup.io',
    dateJoined: '2026-07-19',
    source: 'Blog Post',
    status: 'Subscribed',
  },
  {
    id: '3',
    email: 'designer_amy@studio.com',
    dateJoined: '2026-07-15',
    source: 'Popup',
    status: 'Unsubscribed',
  },
  {
    id: '4',
    email: 'john_doe99@gmail.com',
    dateJoined: '2026-07-10',
    source: 'Footer Form',
    status: 'Subscribed',
  },
  {
    id: '5',
    email: 'samantha.w@corporate.net',
    dateJoined: '2026-07-05',
    source: 'Webinar',
    status: 'Subscribed',
  },
  {
    id: '6',
    email: 'contact@smallbiz.org',
    dateJoined: '2026-07-01',
    source: 'Footer Form',
    status: 'Subscribed',
  },
  {
    id: '7',
    email: 'freelancer_tom@freelance.co',
    dateJoined: '2026-06-28',
    source: 'Blog Post',
    status: 'Subscribed',
  },
];

export default function NewsletterLeadsPage() {
  const [data] = useState<NewsletterSubscriber[]>(mockData);

  const handleExportCSV = () => {
    // In a real application, you would generate a CSV and trigger a download.
    // For now, we mock the delay and show a success toast.
    toast.promise(new Promise((resolve) => setTimeout(resolve, 1500)), {
      loading: 'Preparing CSV for download...',
      success: 'Newsletter subscribers exported successfully!',
      error: 'Failed to export subscribers.',
    });
  };

  const columns: ColumnDef<NewsletterSubscriber>[] = [
    {
      accessorKey: 'email',
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
            className="-ml-4 hover:bg-transparent"
          >
            Email Address
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        );
      },
      cell: ({ row }) => (
        <div className="flex items-center gap-2 font-medium">
          <Mail className="h-4 w-4 text-muted-foreground" />
          {row.getValue('email')}
        </div>
      ),
    },
    {
      accessorKey: 'dateJoined',
      header: 'Date Joined',
      cell: ({ row }) => (
        <div className="text-muted-foreground whitespace-nowrap">{row.getValue('dateJoined')}</div>
      ),
    },
    {
      accessorKey: 'source',
      header: 'Signup Source',
      cell: ({ row }) => <div className="text-muted-foreground">{row.getValue('source')}</div>,
    },
    {
      accessorKey: 'status',
      header: 'Status',
      cell: ({ row }) => {
        const status = row.getValue('status') as SubscriberStatus;
        return <Badge variant={status === 'Subscribed' ? 'default' : 'secondary'}>{status}</Badge>;
      },
    },
  ];

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Newsletter Subscribers</h2>
          <p className="text-muted-foreground mt-1">Manage and export your email mailing list.</p>
        </div>
        <Button onClick={handleExportCSV} className="flex items-center gap-2">
          <Download className="h-4 w-4" />
          Export to CSV
        </Button>
      </div>

      <DataTable
        columns={columns}
        data={data}
        searchKey="email"
        searchPlaceholder="Filter by email address..."
      />
    </div>
  );
}
