import React from 'react';
import { Clock, AlertCircle, CheckCircle2, Mail, FileText, Users } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import { ScrollArea } from '@/components/ui/scroll-area';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function LeadDetailsModal({ isOpen, onClose, lead }: { isOpen: boolean, onClose: () => void, lead: any }) {
  if (!lead) return null;

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'NEW':
        return (
          <span className="inline-flex items-center gap-1 text-xs font-semibold px-2.5 py-1 rounded-full bg-blue-500/15 text-blue-600 dark:text-blue-400">
            <Clock className="h-3 w-3" /> New
          </span>
        );
      case 'CONTACTED':
        return (
          <span className="inline-flex items-center gap-1 text-xs font-semibold px-2.5 py-1 rounded-full bg-amber-500/15 text-amber-600 dark:text-amber-400">
            <AlertCircle className="h-3 w-3" /> Contacted
          </span>
        );
      case 'CLOSED':
        return (
          <span className="inline-flex items-center gap-1 text-xs font-semibold px-2.5 py-1 rounded-full bg-emerald-500/15 text-emerald-600 dark:text-emerald-400">
            <CheckCircle2 className="h-3 w-3" /> Closed
          </span>
        );
      default:
        return <span className="text-xs">{status}</span>;
    }
  };

  const getTypeBadge = (type: string) => {
    switch (type) {
      case 'CONTACT':
        return (
          <span className="inline-flex items-center gap-1 text-xs font-medium px-2 py-0.5 rounded bg-purple-500/10 text-purple-600 dark:text-purple-400 border border-purple-500/20">
            <Mail className="h-3 w-3" /> Contact
          </span>
        );
      case 'QUOTE':
        return (
          <span className="inline-flex items-center gap-1 text-xs font-medium px-2 py-0.5 rounded bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20">
            <FileText className="h-3 w-3" /> Quote
          </span>
        );
      case 'NEWSLETTER':
        return (
          <span className="inline-flex items-center gap-1 text-xs font-medium px-2 py-0.5 rounded bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 border border-cyan-500/20">
            <Users className="h-3 w-3" /> Newsletter
          </span>
        );
      default:
        return <span className="text-xs">{type}</span>;
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-2xl sm:max-w-3xl max-h-[85vh] p-0 overflow-hidden bg-background border-border/50">
        <DialogHeader className="px-6 py-4 border-b border-border/50 bg-background/80 backdrop-blur z-10 sticky top-0">
          <DialogTitle>Lead Details</DialogTitle>
          <DialogDescription>
            ID: {lead.id}
          </DialogDescription>
        </DialogHeader>

        <ScrollArea className="px-6 py-6 h-full max-h-[calc(85vh-80px)]">
          <div className="space-y-6 text-sm">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-muted-foreground font-medium block">Lead Type</label>
                <div className="mt-1">{getTypeBadge(lead.type)}</div>
              </div>
              <div>
                <label className="text-muted-foreground font-medium block">Current Status</label>
                <div className="mt-1">{getStatusBadge(lead.status)}</div>
              </div>
            </div>

            <div>
              <label className="text-muted-foreground font-medium block">Contact Info</label>
              <p className="font-bold text-foreground mt-0.5">{lead.name || 'N/A'}</p>
              <p className="text-muted-foreground font-mono">{lead.email}</p>
              {lead.phone && (
                <p className="text-muted-foreground">{lead.phone}</p>
              )}
            </div>

            {lead.subject && (
              <div>
                <label className="text-muted-foreground font-medium block">Subject</label>
                <p className="font-medium text-foreground mt-0.5">{lead.subject}</p>
              </div>
            )}

            {lead.message && (
              <div>
                <label className="text-muted-foreground font-medium block">Message</label>
                <div className="mt-1 p-3 rounded-lg bg-muted/40 border border-border/60 whitespace-pre-wrap text-foreground text-sm">
                  {lead.message}
                </div>
              </div>
            )}

            {lead.service && (
              <div>
                <label className="text-muted-foreground font-medium block">
                  Requested Service
                </label>
                <p className="font-medium text-primary mt-0.5">{lead.service}</p>
              </div>
            )}

            {(lead.budget || lead.timeline) && (
              <div className="grid grid-cols-2 gap-4 pt-2 border-t border-border/40">
                <div>
                  <label className="text-muted-foreground font-medium block">Budget</label>
                  <p className="font-medium text-foreground">{lead.budget || 'N/A'}</p>
                </div>
                <div>
                  <label className="text-muted-foreground font-medium block">Timeline</label>
                  <p className="font-medium text-foreground">
                    {lead.timeline || 'N/A'}
                  </p>
                </div>
              </div>
            )}

            {lead.projectDetails && (
              <div>
                <label className="text-muted-foreground font-medium block">
                  Project Details
                </label>
                <div className="mt-1 p-3 rounded-lg bg-muted/40 border border-border/60 whitespace-pre-wrap text-foreground text-sm">
                  {lead.projectDetails}
                </div>
              </div>
            )}

            <div className="pt-3 border-t border-border/60 flex items-center justify-between text-[11px] text-muted-foreground">
              <span>Created: {new Date(lead.createdAt).toLocaleString()}</span>
            </div>
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}
