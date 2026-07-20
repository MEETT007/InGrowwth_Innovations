'use client';

import { useState } from 'react';
import { ColumnDef } from '@tanstack/react-table';
import { toast } from 'sonner';
import { ArrowUpDown, Mail, Calendar, User, MessageSquare } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { DataTable } from '@/components/ui/data-table';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';

type ContactStatus = 'New' | 'Contacted' | 'Closed';

interface ContactSubmission {
  id: string;
  name: string;
  email: string;
  subject: string;
  message: string;
  date: string;
  status: ContactStatus;
}

const mockData: ContactSubmission[] = [
  {
    id: '1',
    name: 'John Doe',
    email: 'john@example.com',
    subject: 'Inquiry about Web Design',
    message:
      'Hi, I would like to know your pricing for a 5-page e-commerce website. Please get back to me.',
    date: '2026-07-20',
    status: 'New',
  },
  {
    id: '2',
    name: 'Alice Smith',
    email: 'alice@company.com',
    subject: 'Partnership Opportunity',
    message: 'We are looking for a tech partner for our upcoming marketing campaign.',
    date: '2026-07-19',
    status: 'Contacted',
  },
  {
    id: '3',
    name: 'Bob Johnson',
    email: 'bob@startup.io',
    subject: 'Bug on website',
    message: 'I noticed a broken link on your homepage footer.',
    date: '2026-07-18',
    status: 'Closed',
  },
  {
    id: '4',
    name: 'Sarah Connor',
    email: 'sarah@skynet.com',
    subject: 'Security Consultation',
    message: 'Need urgent security consultation for our local network.',
    date: '2026-07-15',
    status: 'New',
  },
  {
    id: '5',
    name: 'Mike Tyson',
    email: 'mike@boxing.com',
    subject: 'SEO Services',
    message: 'I want to rank number one for boxing gloves.',
    date: '2026-07-14',
    status: 'Contacted',
  },
];

export default function ContactLeadsPage() {
  const [data, setData] = useState<ContactSubmission[]>(mockData);
  const [selectedLead, setSelectedLead] = useState<ContactSubmission | null>(null);

  const handleStatusChange = (id: string, newStatus: ContactStatus) => {
    setData((prev) => prev.map((item) => (item.id === id ? { ...item, status: newStatus } : item)));
    if (selectedLead && selectedLead.id === id) {
      setSelectedLead({ ...selectedLead, status: newStatus });
    }
    toast.success(`Status updated to ${newStatus}`);
  };

  const columns: ColumnDef<ContactSubmission>[] = [
    {
      accessorKey: 'name',
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
            className="-ml-4 hover:bg-transparent"
          >
            Name
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        );
      },
      cell: ({ row }) => <div className="font-medium">{row.getValue('name')}</div>,
    },
    {
      accessorKey: 'email',
      header: 'Email',
      cell: ({ row }) => <div className="text-muted-foreground">{row.getValue('email')}</div>,
    },
    {
      accessorKey: 'subject',
      header: 'Subject',
      cell: ({ row }) => <div className="max-w-[250px] truncate">{row.getValue('subject')}</div>,
    },
    {
      accessorKey: 'date',
      header: 'Date',
      cell: ({ row }) => (
        <div className="text-muted-foreground whitespace-nowrap">{row.getValue('date')}</div>
      ),
    },
    {
      accessorKey: 'status',
      header: 'Status',
      cell: ({ row }) => {
        const status = row.getValue('status') as ContactStatus;
        return (
          <Badge
            variant={
              status === 'New' ? 'default' : status === 'Contacted' ? 'secondary' : 'outline'
            }
          >
            {status}
          </Badge>
        );
      },
    },
  ];

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Contact Submissions</h2>
        <p className="text-muted-foreground mt-1">Manage inquiries from your contact form.</p>
      </div>

      <DataTable
        columns={columns}
        data={data}
        searchKey="name"
        searchPlaceholder="Filter by name..."
        onRowClick={(row) => setSelectedLead(row)}
      />

      <Sheet open={!!selectedLead} onOpenChange={(open) => !open && setSelectedLead(null)}>
        <SheetContent className="sm:max-w-md w-full overflow-y-auto">
          <SheetHeader className="pb-4 border-b mb-6">
            <SheetTitle className="flex items-center gap-2">
              <MessageSquare className="h-5 w-5 text-primary" />
              Lead Details
            </SheetTitle>
            <SheetDescription>Received on {selectedLead?.date}</SheetDescription>
          </SheetHeader>

          {selectedLead && (
            <div className="space-y-6">
              <div className="space-y-3 bg-muted/30 p-4 rounded-lg">
                <div className="flex items-center gap-3">
                  <div className="bg-primary/10 p-2 rounded-full text-primary">
                    <User className="h-4 w-4" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground leading-none mb-1">Name</p>
                    <p className="font-medium">{selectedLead.name}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="bg-primary/10 p-2 rounded-full text-primary">
                    <Mail className="h-4 w-4" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground leading-none mb-1">Email</p>
                    <a
                      href={`mailto:${selectedLead.email}`}
                      className="font-medium text-primary hover:underline"
                    >
                      {selectedLead.email}
                    </a>
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <Label className="text-muted-foreground">Subject</Label>
                <div className="font-medium text-lg bg-background border rounded-md p-3">
                  {selectedLead.subject}
                </div>
              </div>

              <div className="space-y-2">
                <Label className="text-muted-foreground">Message</Label>
                <div className="text-sm bg-background border rounded-md p-4 min-h-[150px] whitespace-pre-wrap leading-relaxed">
                  {selectedLead.message}
                </div>
              </div>

              <Separator />

              <div className="space-y-3 bg-muted/10 p-4 rounded-lg border">
                <Label className="font-semibold text-base">Actions</Label>
                <div className="space-y-2">
                  <Label
                    htmlFor="status-update"
                    className="text-muted-foreground text-xs uppercase tracking-wider"
                  >
                    Update Status
                  </Label>
                  <Select
                    value={selectedLead.status}
                    onValueChange={(value) =>
                      handleStatusChange(selectedLead.id, value as ContactStatus)
                    }
                  >
                    <SelectTrigger id="status-update" className="w-full">
                      <SelectValue placeholder="Status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="New">New</SelectItem>
                      <SelectItem value="Contacted">Contacted</SelectItem>
                      <SelectItem value="Closed">Closed</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="pt-2 flex gap-2">
                  <Button
                    className="w-full"
                    onClick={() => window.open(`mailto:${selectedLead.email}`)}
                  >
                    Reply via Email
                  </Button>
                </div>
              </div>
            </div>
          )}
        </SheetContent>
      </Sheet>
    </div>
  );
}
