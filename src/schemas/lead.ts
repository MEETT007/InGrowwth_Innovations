import { z } from 'zod';

export const ContactSchema = z.object({
  name: z
    .string()
    .min(2, { message: 'Name must be at least 2 characters.' })
    .max(100, { message: 'Name must be less than 100 characters.' }),
  email: z.string().email({ message: 'Invalid email address.' }),
  subject: z
    .string()
    .min(3, { message: 'Subject must be at least 3 characters.' })
    .max(100, { message: 'Subject must be less than 100 characters.' }),
  message: z
    .string()
    .min(10, { message: 'Message must be at least 10 characters.' })
    .max(5000, { message: 'Message must be less than 5000 characters.' }),
});

export const QuoteSchema = z.object({
  name: z
    .string()
    .min(2, { message: 'Name must be at least 2 characters.' })
    .max(100, { message: 'Name must be less than 100 characters.' }),
  email: z.string().email({ message: 'Invalid email address.' }),
  phone: z.string().optional().or(z.literal('')),
  service: z.string().min(1, { message: 'Please select a service.' }),
  budget: z.string().min(1, { message: 'Please select a budget range.' }),
  timeline: z.string().min(1, { message: 'Please select a timeline.' }),
  projectDetails: z
    .string()
    .min(10, { message: 'Project details must be at least 10 characters.' })
    .max(5000, { message: 'Project details must be less than 5000 characters.' }),
  fileUrl: z.string().url({ message: 'Invalid file URL.' }).optional().or(z.literal('')),
});

export const NewsletterSchema = z.object({
  email: z.string().email({ message: 'Invalid email address.' }),
});

export type ContactInput = z.infer<typeof ContactSchema>;
export type QuoteInput = z.infer<typeof QuoteSchema>;
export type NewsletterInput = z.infer<typeof NewsletterSchema>;
