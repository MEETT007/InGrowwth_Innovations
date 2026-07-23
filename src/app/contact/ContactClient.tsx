'use client';

import React, { useState, useEffect } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'sonner';
import {
  Mail,
  Phone,
  MapPin,
  Clock,
  Send,
  FileText,
  Sparkles,
  CheckCircle,
  ChevronRight,
  HelpCircle,
} from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent } from '@/components/ui/card';
import { AnimatedContainer } from '@/components/shared/AnimatedContainer';
import { ContactSchema, QuoteSchema, ContactInput, QuoteInput } from '@/schemas/lead';
import { submitContactAction, submitQuoteAction } from '@/actions/lead';

export default function ContactClient() {
  const searchParams = useSearchParams();
  const router = useRouter();

  // Set activeTab directly from URL query param to avoid set-state-in-effect and cascading renders
  const activeTab = searchParams.get('type') === 'quote' ? 'quote' : 'message';
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);

  // React Hook Form for General Message
  const contactForm = useForm<ContactInput>({
    resolver: zodResolver(ContactSchema),
    defaultValues: {
      name: '',
      email: '',
      subject: '',
      message: '',
    },
  });

  // React Hook Form for Quote Request
  const quoteForm = useForm<QuoteInput>({
    resolver: zodResolver(QuoteSchema),
    defaultValues: {
      name: '',
      email: '',
      phone: '',
      service: searchParams.get('service') || '',
      budget: '',
      timeline: '',
      projectDetails: '',
      fileUrl: '',
    },
  });

  // Set service if updated in query param
  useEffect(() => {
    const serviceParam = searchParams.get('service');
    if (serviceParam) {
      quoteForm.setValue('service', serviceParam);
    }
  }, [searchParams, quoteForm]);

  const onContactSubmit = async (data: ContactInput) => {
    setIsSubmitting(true);
    try {
      const res = await submitContactAction(data);
      if (res.success) {
        setSubmitSuccess(true);
        toast.success(res.message);
        contactForm.reset();
      } else {
        toast.error(res.message || 'Submission failed.');
      }
    } catch (error) {
      console.error('Contact submission error:', error);
      toast.error('An unexpected error occurred. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const onQuoteSubmit = async (data: QuoteInput) => {
    setIsSubmitting(true);
    try {
      const res = await submitQuoteAction(data);
      if (res.success) {
        setSubmitSuccess(true);
        toast.success(res.message);
        quoteForm.reset();
      } else {
        toast.error(res.message || 'Submission failed.');
      }
    } catch (error) {
      console.error('Quote submission error:', error);
      toast.error('An unexpected error occurred. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const switchTab = (tab: 'message' | 'quote') => {
    setSubmitSuccess(false);
    // Update URL query parameters cleanly without forcing full page reload
    const params = new URLSearchParams(window.location.search);
    params.set('type', tab);
    router.replace(`/contact?${params.toString()}`, { scroll: false });
  };

  return (
    <div className="flex flex-col min-h-screen relative overflow-hidden bg-background py-12">
      {/* Background glow effects */}
      <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] rounded-full bg-indigo-500/10 blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] rounded-full bg-pink-500/10 blur-[120px] pointer-events-none" />

      {/* Header */}
      <section className="relative z-10 max-w-7xl mx-auto px-6 pt-16 pb-8 w-full text-center">
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-600 dark:text-indigo-400 text-xs font-semibold uppercase tracking-wider mb-6"
        >
          <Sparkles className="h-3.5 w-3.5 animate-pulse" />
          Get In Touch
        </motion.div>
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="text-4xl sm:text-5xl font-extrabold tracking-tight text-foreground mb-6"
        >
          Let&apos;s Build Your{' '}
          <span className="bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 bg-clip-text text-transparent">
            Next Idea
          </span>
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="text-base sm:text-lg text-muted-foreground max-w-3xl mx-auto leading-relaxed"
        >
          Whether you want a custom quote for a complex project, or just want to say hello, we are
          here to help.
        </motion.p>
      </section>

      {/* Form & Info Section */}
      <section className="relative z-10 max-w-7xl mx-auto px-6 py-12 w-full grid grid-cols-1 lg:grid-cols-12 gap-12">
        {/* Contact Info Panel (Left) */}
        <div className="lg:col-span-4 space-y-8 flex flex-col justify-start">
          <AnimatedContainer direction="left" delay={0.1} className="space-y-6">
            <h3 className="text-xl sm:text-2xl font-bold text-foreground">Contact Details</h3>
            <p className="text-sm text-muted-foreground leading-relaxed">
              We operate globally as a remote-first product engineering group. Use the details below
              or drop us a line using the form.
            </p>
          </AnimatedContainer>

          <AnimatedContainer direction="left" delay={0.2} className="space-y-4">
            {/* Cards */}
            <div className="flex gap-4 p-4 rounded-xl bg-card/40 border border-border/40 backdrop-blur-xs">
              <div className="p-3 rounded-lg bg-indigo-500/10 text-indigo-500 dark:text-indigo-400 shrink-0">
                <Mail className="h-5 w-5" />
              </div>
              <div>
                <h4 className="font-semibold text-foreground text-sm">Email Address</h4>
                <a
                  href="mailto:hello@ingrowwth.com"
                  className="text-xs sm:text-sm text-muted-foreground hover:text-foreground hover:underline transition-colors mt-0.5 block"
                >
                  hello@ingrowwth.com
                </a>
              </div>
            </div>

            <div className="flex gap-4 p-4 rounded-xl bg-card/40 border border-border/40 backdrop-blur-xs">
              <div className="p-3 rounded-lg bg-purple-500/10 text-purple-500 dark:text-purple-400 shrink-0">
                <Phone className="h-5 w-5" />
              </div>
              <div>
                <h4 className="font-semibold text-foreground text-sm">Call / WhatsApp</h4>
                <p className="text-xs sm:text-sm text-muted-foreground mt-0.5">+91 98765 43210</p>
              </div>
            </div>

            <div className="flex gap-4 p-4 rounded-xl bg-card/40 border border-border/40 backdrop-blur-xs">
              <div className="p-3 rounded-lg bg-pink-500/10 text-pink-500 dark:text-pink-400 shrink-0">
                <MapPin className="h-5 w-5" />
              </div>
              <div>
                <h4 className="font-semibold text-foreground text-sm">Location</h4>
                <p className="text-xs sm:text-sm text-muted-foreground mt-0.5">
                  Remote-First Group (HQ: Ahmedabad, India)
                </p>
              </div>
            </div>

            <div className="flex gap-4 p-4 rounded-xl bg-card/40 border border-border/40 backdrop-blur-xs">
              <div className="p-3 rounded-lg bg-emerald-500/10 text-emerald-500 dark:text-emerald-400 shrink-0">
                <Clock className="h-5 w-5" />
              </div>
              <div>
                <h4 className="font-semibold text-foreground text-sm">Support Hours</h4>
                <p className="text-xs sm:text-sm text-muted-foreground mt-0.5">
                  Monday &ndash; Friday, 9:00 AM &ndash; 6:00 PM IST
                </p>
              </div>
            </div>
          </AnimatedContainer>
        </div>

        {/* Tab & Form Panel (Right) */}
        <div className="lg:col-span-8">
          <AnimatedContainer direction="up" delay={0.2}>
            {/* Tabs Trigger Navigation */}
            <div className="flex border-b border-border/60 mb-8 p-1 bg-muted/30 rounded-xl max-w-md">
              <Button
                variant={activeTab === 'message' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => switchTab('message')}
                className={`flex-1 cursor-pointer font-semibold rounded-lg border-none ${
                  activeTab === 'message'
                    ? 'bg-background text-foreground shadow-xs hover:bg-background'
                    : 'text-muted-foreground hover:text-foreground hover:bg-transparent'
                }`}
              >
                <Mail className="h-4 w-4" />
                <span>Send a Message</span>
              </Button>
              <Button
                variant={activeTab === 'quote' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => switchTab('quote')}
                className={`flex-1 cursor-pointer font-semibold rounded-lg border-none ${
                  activeTab === 'quote'
                    ? 'bg-background text-foreground shadow-xs hover:bg-background'
                    : 'text-muted-foreground hover:text-foreground hover:bg-transparent'
                }`}
              >
                <FileText className="h-4 w-4" />
                <span>Request a Quote</span>
              </Button>
            </div>

            {/* Forms Card */}
            <Card className="border-border/50 bg-card/60 backdrop-blur-md overflow-hidden relative">
              <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/5 to-pink-500/5 pointer-events-none" />
              <CardContent className="p-6 sm:p-10 relative z-10">
                <AnimatePresence mode="wait">
                  {submitSuccess ? (
                    <motion.div
                      key="success"
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0 }}
                      className="py-16 text-center flex flex-col items-center gap-4"
                    >
                      <CheckCircle className="h-16 w-16 text-emerald-500 animate-bounce" />
                      <h3 className="text-2xl font-extrabold text-foreground">Inquiry Received!</h3>
                      <p className="text-sm text-muted-foreground max-w-md mx-auto leading-relaxed">
                        Thank you for reaching out to InGrowwth Innovations. Our engineering
                        coordinators are reviewing your submission and will get back to you shortly.
                      </p>
                      <Button
                        onClick={() => setSubmitSuccess(false)}
                        variant="outline"
                        className="mt-4"
                      >
                        Send Another Inquiry
                      </Button>
                    </motion.div>
                  ) : activeTab === 'message' ? (
                    /* General Inquiry Form */
                    <motion.form
                      key="message-form"
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: 10 }}
                      onSubmit={contactForm.handleSubmit(onContactSubmit)}
                      className="space-y-6"
                    >
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                        <div className="space-y-2">
                          <Label htmlFor="name">Your Name</Label>
                          <Input
                            id="name"
                            placeholder="John Doe"
                            className="bg-background"
                            {...contactForm.register('name')}
                            aria-invalid={!!contactForm.formState.errors.name}
                          />
                          {contactForm.formState.errors.name && (
                            <span className="text-xs text-destructive">
                              {contactForm.formState.errors.name.message}
                            </span>
                          )}
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="email">Email Address</Label>
                          <Input
                            id="email"
                            type="email"
                            placeholder="john@example.com"
                            className="bg-background"
                            {...contactForm.register('email')}
                            aria-invalid={!!contactForm.formState.errors.email}
                          />
                          {contactForm.formState.errors.email && (
                            <span className="text-xs text-destructive">
                              {contactForm.formState.errors.email.message}
                            </span>
                          )}
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="subject">Subject</Label>
                        <Input
                          id="subject"
                          placeholder="How can we help you?"
                          className="bg-background"
                          {...contactForm.register('subject')}
                          aria-invalid={!!contactForm.formState.errors.subject}
                        />
                        {contactForm.formState.errors.subject && (
                          <span className="text-xs text-destructive">
                            {contactForm.formState.errors.subject.message}
                          </span>
                        )}
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="message">Message</Label>
                        <textarea
                          id="message"
                          rows={6}
                          placeholder="Tell us about your project, questions, or ideas..."
                          className="flex min-h-[120px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm shadow-xs placeholder:text-muted-foreground focus-visible:outline-hidden focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 text-foreground"
                          {...contactForm.register('message')}
                          aria-invalid={!!contactForm.formState.errors.message}
                        />
                        {contactForm.formState.errors.message && (
                          <span className="text-xs text-destructive">
                            {contactForm.formState.errors.message.message}
                          </span>
                        )}
                      </div>

                      <Button
                        type="submit"
                        loading={isSubmitting}
                        className="w-full sm:w-auto cursor-pointer"
                      >
                        <span>Send Message</span>
                        <Send className="h-4 w-4" />
                      </Button>
                    </motion.form>
                  ) : (
                    /* Quote Request Form */
                    <motion.form
                      key="quote-form"
                      initial={{ opacity: 0, x: 10 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -10 }}
                      onSubmit={quoteForm.handleSubmit(onQuoteSubmit)}
                      className="space-y-6"
                    >
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                        <div className="space-y-2">
                          <Label htmlFor="q-name">Your Name</Label>
                          <Input
                            id="q-name"
                            placeholder="John Doe"
                            className="bg-background"
                            {...quoteForm.register('name')}
                            aria-invalid={!!quoteForm.formState.errors.name}
                          />
                          {quoteForm.formState.errors.name && (
                            <span className="text-xs text-destructive">
                              {quoteForm.formState.errors.name.message}
                            </span>
                          )}
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="q-email">Email Address</Label>
                          <Input
                            id="q-email"
                            type="email"
                            placeholder="john@example.com"
                            className="bg-background"
                            {...quoteForm.register('email')}
                            aria-invalid={!!quoteForm.formState.errors.email}
                          />
                          {quoteForm.formState.errors.email && (
                            <span className="text-xs text-destructive">
                              {quoteForm.formState.errors.email.message}
                            </span>
                          )}
                        </div>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                        <div className="space-y-2">
                          <Label htmlFor="phone">Phone Number (Optional)</Label>
                          <Input
                            id="phone"
                            placeholder="+1 (555) 0199"
                            className="bg-background"
                            {...quoteForm.register('phone')}
                            aria-invalid={!!quoteForm.formState.errors.phone}
                          />
                          {quoteForm.formState.errors.phone && (
                            <span className="text-xs text-destructive">
                              {quoteForm.formState.errors.phone.message}
                            </span>
                          )}
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="service">Target Service</Label>
                          <select
                            id="service"
                            className="flex h-8 w-full rounded-lg border border-input bg-background px-3 py-1 text-sm text-foreground focus-visible:outline-hidden focus-visible:ring-1 focus-visible:ring-ring"
                            {...quoteForm.register('service')}
                            aria-invalid={!!quoteForm.formState.errors.service}
                          >
                            <option value="">Select a service category...</option>
                            <option value="web-development">Web Development</option>
                            <option value="mobile-apps">Mobile App Development</option>
                            <option value="cloud-devops">Cloud & DevOps Solutions</option>
                            <option value="ai-ml">AI & Machine Learning</option>
                            <option value="cybersecurity">Cybersecurity</option>
                            <option value="erp-enterprise">ERP & Enterprise Software</option>
                          </select>
                          {quoteForm.formState.errors.service && (
                            <span className="text-xs text-destructive">
                              {quoteForm.formState.errors.service.message}
                            </span>
                          )}
                        </div>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                        <div className="space-y-2">
                          <Label htmlFor="budget">Estimated Budget Range</Label>
                          <select
                            id="budget"
                            className="flex h-8 w-full rounded-lg border border-input bg-background px-3 py-1 text-sm text-foreground focus-visible:outline-hidden focus-visible:ring-1 focus-visible:ring-ring"
                            {...quoteForm.register('budget')}
                            aria-invalid={!!quoteForm.formState.errors.budget}
                          >
                            <option value="">Select a budget range...</option>
                            <option value="< $5k">Less than $5,000</option>
                            <option value="$5k - $10k">$5,000 &ndash; $10,000</option>
                            <option value="$10k - $25k">$10,000 &ndash; $25,000</option>
                            <option value="$25k - $50k">$25,000 &ndash; $50,000</option>
                            <option value="$50k+">$50,000 or more</option>
                          </select>
                          {quoteForm.formState.errors.budget && (
                            <span className="text-xs text-destructive">
                              {quoteForm.formState.errors.budget.message}
                            </span>
                          )}
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="timeline">Estimated Timeline</Label>
                          <select
                            id="timeline"
                            className="flex h-8 w-full rounded-lg border border-input bg-background px-3 py-1 text-sm text-foreground focus-visible:outline-hidden focus-visible:ring-1 focus-visible:ring-ring"
                            {...quoteForm.register('timeline')}
                            aria-invalid={!!quoteForm.formState.errors.timeline}
                          >
                            <option value="">Select a timeline...</option>
                            <option value="Immediate">Immediate / Urgent</option>
                            <option value="1-3 months">1 &ndash; 3 months</option>
                            <option value="3-6 months">3 &ndash; 6 months</option>
                            <option value="6+ months">6 months or more</option>
                          </select>
                          {quoteForm.formState.errors.timeline && (
                            <span className="text-xs text-destructive">
                              {quoteForm.formState.errors.timeline.message}
                            </span>
                          )}
                        </div>
                      </div>

                      <div className="space-y-2">
                        <div className="flex items-center gap-1.5">
                          <Label htmlFor="fileUrl">Requirements Document Link (Optional)</Label>
                          <div className="group relative">
                            <HelpCircle className="h-3.5 w-3.5 text-muted-foreground hover:text-foreground cursor-pointer" />
                            <span className="absolute bottom-full left-1/2 -translate-x-1/2 mb-1.5 w-48 p-2 rounded bg-popover text-[10px] text-popover-foreground border border-border/80 shadow-md opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity duration-200 leading-normal">
                              Provide a shared link to your project guidelines, wireframes, or RFP
                              on Google Drive, Dropbox, or Figma.
                            </span>
                          </div>
                        </div>
                        <Input
                          id="fileUrl"
                          type="url"
                          placeholder="https://drive.google.com/..."
                          className="bg-background"
                          {...quoteForm.register('fileUrl')}
                          aria-invalid={!!quoteForm.formState.errors.fileUrl}
                        />
                        {quoteForm.formState.errors.fileUrl && (
                          <span className="text-xs text-destructive">
                            {quoteForm.formState.errors.fileUrl.message}
                          </span>
                        )}
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="projectDetails">Project Details & Requirements</Label>
                        <textarea
                          id="projectDetails"
                          rows={4}
                          placeholder="Describe your project goals, features needed, user base, and target audience..."
                          className="flex min-h-[100px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm text-foreground shadow-xs placeholder:text-muted-foreground focus-visible:outline-hidden focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
                          {...quoteForm.register('projectDetails')}
                          aria-invalid={!!quoteForm.formState.errors.projectDetails}
                        />
                        {quoteForm.formState.errors.projectDetails && (
                          <span className="text-xs text-destructive">
                            {quoteForm.formState.errors.projectDetails.message}
                          </span>
                        )}
                      </div>

                      <Button
                        type="submit"
                        loading={isSubmitting}
                        className="w-full sm:w-auto cursor-pointer"
                      >
                        <span>Request Quote</span>
                        <ChevronRight className="h-4 w-4 animate-pulse" />
                      </Button>
                    </motion.form>
                  )}
                </AnimatePresence>
              </CardContent>
            </Card>
          </AnimatedContainer>
        </div>
      </section>
    </div>
  );
}
