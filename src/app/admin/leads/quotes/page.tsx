'use client';

import { useState } from 'react';
import { ColumnDef } from '@tanstack/react-table';
import { toast } from 'sonner';
import {
  ArrowUpDown,
  Mail,
  Calendar,
  User,
  FileText,
  Download,
  DollarSign,
  Clock,
  File,
} from 'lucide-react';

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

type QuoteStatus = 'Pending' | 'Reviewed' | 'Proposal Sent' | 'Closed';

interface QuoteRequest {
  id: string;
  name: string;
  company: string;
  email: string;
  service: string;
  budget: string;
  timeline: string;
  details: string;
  date: string;
  attachments: string[]; // mock file names
  status: QuoteStatus;
}

const mockData: QuoteRequest[] = [
  {
    id: '1',
    name: 'David Chen',
    company: 'TechFlow',
    email: 'david@techflow.io',
    service: 'Custom App Development',
    budget: '$10k - $25k',
    timeline: '3-6 months',
    details:
      'Looking to build a cross-platform mobile app for our inventory management system. We have wireframes ready.',
    date: '2026-07-20',
    attachments: ['wireframes.pdf', 'specs.docx'],
    status: 'Pending',
  },
  {
    id: '2',
    name: 'Emily Watson',
    company: 'GreenEarth NGO',
    email: 'emily@greenearth.org',
    service: 'Website Redesign',
    budget: '$5k - $10k',
    timeline: '1-3 months',
    details: 'Our current website is very outdated. We need a modern, accessible design.',
    date: '2026-07-18',
    attachments: ['brand_guidelines.pdf'],
    status: 'Proposal Sent',
  },
  {
    id: '3',
    name: 'Marcus Johnson',
    company: 'StartUp Inc',
    email: 'marcus@startup.inc',
    service: 'SEO & Marketing',
    budget: '< $5k',
    timeline: 'Immediate',
    details: 'Need aggressive SEO for our new product launch next month.',
    date: '2026-07-16',
    attachments: [],
    status: 'Closed',
  },
];

export default function QuotesLeadsPage() {
  const [data, setData] = useState<QuoteRequest[]>(mockData);
  const [selectedQuote, setSelectedQuote] = useState<QuoteRequest | null>(null);

  const handleStatusChange = (id: string, newStatus: QuoteStatus) => {
    setData((prev) => prev.map((item) => (item.id === id ? { ...item, status: newStatus } : item)));
    if (selectedQuote && selectedQuote.id === id) {
      setSelectedQuote({ ...selectedQuote, status: newStatus });
    }
    toast.success(`Quote status updated to ${newStatus}`);
  };

  const handleDownload = (filename: string) => {
    toast.info(`Downloading ${filename}... (Mock)`);
  };

  const columns: ColumnDef<QuoteRequest>[] = [
    {
      accessorKey: 'company',
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
            className="-ml-4 hover:bg-transparent"
          >
            Company
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        );
      },
      cell: ({ row }) => (
        <div>
          <div className="font-medium">{row.getValue('company')}</div>
          <div className="text-xs text-muted-foreground">{row.original.name}</div>
        </div>
      ),
    },
    {
      accessorKey: 'service',
      header: 'Service Requested',
      cell: ({ row }) => (
        <div className="font-medium text-muted-foreground">{row.getValue('service')}</div>
      ),
    },
    {
      accessorKey: 'budget',
      header: 'Budget',
      cell: ({ row }) => <div className="whitespace-nowrap">{row.getValue('budget')}</div>,
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
        const status = row.getValue('status') as QuoteStatus;
        return (
          <Badge
            variant={
              status === 'Pending'
                ? 'destructive'
                : status === 'Proposal Sent'
                  ? 'default'
                  : status === 'Reviewed'
                    ? 'secondary'
                    : 'outline'
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
        <h2 className="text-3xl font-bold tracking-tight">Quote Requests</h2>
        <p className="text-muted-foreground mt-1">Manage project inquiries and budget estimates.</p>
      </div>

      <DataTable
        columns={columns}
        data={data}
        searchKey="company"
        searchPlaceholder="Filter by company..."
        onRowClick={(row) => setSelectedQuote(row)}
      />

      <Sheet open={!!selectedQuote} onOpenChange={(open) => !open && setSelectedQuote(null)}>
        <SheetContent className="sm:max-w-xl w-full overflow-y-auto">
          <SheetHeader className="pb-4 border-b mb-6">
            <SheetTitle className="flex items-center gap-2 text-xl">
              <FileText className="h-5 w-5 text-primary" />
              Quote Request Details
            </SheetTitle>
            <SheetDescription>Received on {selectedQuote?.date}</SheetDescription>
          </SheetHeader>

          {selectedQuote && (
            <div className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-3 bg-muted/30 p-4 rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="bg-primary/10 p-2 rounded-full text-primary">
                      <User className="h-4 w-4" />
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground leading-none mb-1">
                        Contact Name
                      </p>
                      <p className="font-medium text-sm">{selectedQuote.name}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="bg-primary/10 p-2 rounded-full text-primary">
                      <Mail className="h-4 w-4" />
                    </div>
                    <div className="overflow-hidden">
                      <p className="text-xs text-muted-foreground leading-none mb-1">Email</p>
                      <a
                        href={`mailto:${selectedQuote.email}`}
                        className="font-medium text-sm text-primary hover:underline truncate block"
                      >
                        {selectedQuote.email}
                      </a>
                    </div>
                  </div>
                </div>

                <div className="space-y-3 bg-muted/30 p-4 rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="bg-primary/10 p-2 rounded-full text-primary">
                      <DollarSign className="h-4 w-4" />
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground leading-none mb-1">
                        Estimated Budget
                      </p>
                      <p className="font-medium text-sm">{selectedQuote.budget}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="bg-primary/10 p-2 rounded-full text-primary">
                      <Clock className="h-4 w-4" />
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground leading-none mb-1">Timeline</p>
                      <p className="font-medium text-sm">{selectedQuote.timeline}</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <Label className="text-muted-foreground">Service Requested</Label>
                <div className="font-medium text-lg bg-background border rounded-md p-3">
                  {selectedQuote.service}
                </div>
              </div>

              <div className="space-y-2">
                <Label className="text-muted-foreground">Project Details</Label>
                <div className="text-sm bg-background border rounded-md p-4 min-h-[120px] whitespace-pre-wrap leading-relaxed">
                  {selectedQuote.details}
                </div>
              </div>

              <div className="space-y-3">
                <Label className="text-muted-foreground flex items-center gap-2">
                  <File className="h-4 w-4" />
                  Attachments ({selectedQuote.attachments.length})
                </Label>
                {selectedQuote.attachments.length > 0 ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {selectedQuote.attachments.map((file, idx) => (
                      <div
                        key={idx}
                        className="flex items-center justify-between bg-muted/50 p-2 rounded-md border"
                      >
                        <span className="text-sm font-medium truncate pr-2" title={file}>
                          {file}
                        </span>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 shrink-0"
                          onClick={() => handleDownload(file)}
                        >
                          <Download className="h-4 w-4 text-muted-foreground" />
                        </Button>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-sm text-muted-foreground italic bg-muted/20 p-3 rounded-md border">
                    No files attached to this request.
                  </div>
                )}
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
                    value={selectedQuote.status}
                    onValueChange={(value) =>
                      handleStatusChange(selectedQuote.id, value as QuoteStatus)
                    }
                  >
                    <SelectTrigger id="status-update" className="w-full">
                      <SelectValue placeholder="Status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Pending">Pending</SelectItem>
                      <SelectItem value="Reviewed">Reviewed</SelectItem>
                      <SelectItem value="Proposal Sent">Proposal Sent</SelectItem>
                      <SelectItem value="Closed">Closed</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="pt-2 flex gap-2">
                  <Button
                    className="w-full"
                    onClick={() => window.open(`mailto:${selectedQuote.email}`)}
                  >
                    Send Proposal via Email
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
