import { NextRequest, NextResponse } from 'next/server';
import { requireAuthAndRole } from '@/lib/auth';
import { sendAdminReplyEmail } from '@/lib/mail';
import { z } from 'zod';
import { db } from '@/lib/db';
import { logger } from '@/lib/logger';

const ReplySchema = z.object({
  leadId: z.string().uuid(),
  recipientEmail: z.string().email(),
  subject: z.string().min(1).max(255),
  message: z.string().min(1).max(5000),
});

export async function POST(request: NextRequest) {
  // 1. Enforce Authentication & Role (Access restricted to admin/editor)
  const authCheck = await requireAuthAndRole(['admin', 'editor']);
  if (!authCheck.authorized) {
    return NextResponse.json(
      { success: false, message: authCheck.error },
      { status: authCheck.status || 401 }
    );
  }

  try {
    const body = await request.json();
    
    // 2. Validation
    const validation = ReplySchema.safeParse(body);
    if (!validation.success) {
      return NextResponse.json(
        { success: false, message: 'Validation failed', errors: validation.error.flatten().fieldErrors },
        { status: 400 }
      );
    }

    const { leadId, recipientEmail, subject, message } = validation.data;

    // 3. Verify lead exists
    const lead = await db.lead.findUnique({
      where: { id: leadId },
    });

    if (!lead) {
      return NextResponse.json({ success: false, message: 'Lead not found' }, { status: 404 });
    }

    // 4. Send email via centralized mail utility
    await sendAdminReplyEmail(recipientEmail, subject, message);

    // 5. Update lead status if it's NEW
    if (lead.status === 'NEW') {
      await db.lead.update({
        where: { id: leadId },
        data: { status: 'CONTACTED' },
      });
    }

    return NextResponse.json({ success: true, message: 'Reply sent successfully' });
  } catch (error) {
    logger.error('[Admin Reply API] Error sending reply:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to send reply' },
      { status: 500 }
    );
  }
}
