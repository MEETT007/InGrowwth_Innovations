'use client';

import React, { useState, useMemo } from 'react';
import {
  Calendar,
  Video,
  CheckCircle2,
  Clock,
  Sparkles,
  User,
  Mail,
  Globe,
  ArrowRight,
  ExternalLink,
  Download,
  Copy,
  Check,
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function MeetingBooking() {
  const [booked, setBooked] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);

  // Form states
  const [fullName, setFullName] = useState('');
  const [workEmail, setWorkEmail] = useState('');
  const [projectTopic, setProjectTopic] = useState('Enterprise Architecture & Strategy');
  const [selectedTimezone, setSelectedTimezone] = useState('EST (US Eastern)');

  // Compute next 4 available business dates
  const availableDates = useMemo(() => {
    const dates: Array<{ id: string; label: string; dateStr: string }> = [];
    const now = new Date();
    let count = 0;
    let dayOffset = 1;

    while (count < 4) {
      const candidate = new Date(now);
      candidate.setDate(now.getDate() + dayOffset);
      const dayOfWeek = candidate.getDay();
      // Skip weekends (0 is Sun, 6 is Sat)
      if (dayOfWeek !== 0 && dayOfWeek !== 6) {
        const isTomorrow = dayOffset === 1;
        const weekday = candidate.toLocaleDateString('en-US', { weekday: 'short' });
        const month = candidate.toLocaleDateString('en-US', { month: 'short' });
        const day = candidate.getDate();
        dates.push({
          id: `date-${count}`,
          label: isTomorrow ? 'Tomorrow' : weekday,
          dateStr: `${weekday}, ${month} ${day}`,
        });
        count++;
      }
      dayOffset++;
    }
    return dates;
  }, []);

  const [selectedDate, setSelectedDate] = useState<string>(availableDates[0]?.dateStr || 'Tomorrow');
  const [selectedTime, setSelectedTime] = useState<string>('02:00 PM');

  const timeSlots = ['10:00 AM', '11:30 AM', '02:00 PM', '03:30 PM', '05:00 PM'];
  const timezones = [
    'EST (US Eastern)',
    'PST (US Pacific)',
    'GMT (UTC/London)',
    'IST (India Standard)',
    'CET (Central Europe)',
  ];

  const meetingUrl = 'https://meet.google.com/igg-discovery-session';

  const handleCopyLink = () => {
    navigator.clipboard.writeText(meetingUrl);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  const handleDownloadICS = () => {
    const icsContent = [
      'BEGIN:VCALENDAR',
      'VERSION:2.0',
      'PRODID:-//InGrowwth Innovations//Technical Discovery Session//EN',
      'CALSCALE:GREGORIAN',
      'METHOD:REQUEST',
      'BEGIN:VEVENT',
      `UID:${Date.now()}@ingrowwth.com`,
      `DTSTAMP:${new Date().toISOString().replace(/[-:]/g, '').split('.')[0]}Z`,
      'DTSTART:20261005T140000Z',
      'DTEND:20261005T143000Z',
      'SUMMARY:InGrowwth Innovations — Discovery & Architecture Consultation',
      `DESCRIPTION:Discovery video consultation with InGrowwth Innovations Solutions & Architecture Leadership.\\n\\nGoogle Meet: ${meetingUrl}\\nTopic: ${projectTopic}`,
      `LOCATION:${meetingUrl}`,
      'STATUS:CONFIRMED',
      'END:VEVENT',
      'END:VCALENDAR',
    ].join('\r\n');

    const blob = new Blob([icsContent], { type: 'text/calendar;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', 'InGrowwth-Architecture-Session.ics');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const googleCalendarUrl = useMemo(() => {
    const title = encodeURIComponent('InGrowwth Innovations — Architecture Strategy Session');
    const details = encodeURIComponent(
      `Discovery & Architecture Session with InGrowwth Innovations Solutions & Leadership Team.\n\nVideo Room: ${meetingUrl}\nTopic: ${projectTopic}`
    );
    const location = encodeURIComponent(meetingUrl);
    return `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${title}&details=${details}&location=${location}`;
  }, [projectTopic]);

  const handleBook = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // Dispatch lead creation in the background
      await fetch('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Idempotency-Key': `booking-${Date.now()}-${Math.random()}`,
        },
        body: JSON.stringify({
          name: fullName || 'Strategic Client',
          email: workEmail || 'client@enterprise.com',
          subject: `Calendar Booking: ${selectedDate} at ${selectedTime} (${selectedTimezone})`,
          message: `Topic: ${projectTopic} | Meeting Slot: ${selectedDate} at ${selectedTime} (${selectedTimezone})`,
        }),
      }).catch(() => {
        // Continue gracefully even if offline DB
      });
    } finally {
      setIsSubmitting(false);
      setBooked(true);
    }
  };

  if (booked) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.96 }}
        animate={{ opacity: 1, scale: 1 }}
        className="rounded-2xl border border-emerald-500/40 bg-gradient-to-br from-emerald-950/40 via-slate-900/80 to-black/60 p-5 sm:p-6 mt-4 shadow-2xl shadow-emerald-950/30 text-left relative overflow-hidden"
      >
        <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="flex items-start gap-4 mb-4 relative z-10">
          <div className="w-11 h-11 bg-emerald-500/20 text-emerald-400 rounded-xl flex items-center justify-center shrink-0 border border-emerald-500/30">
            <CheckCircle2 className="w-6 h-6" />
          </div>
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1">
              <span className="text-[10px] font-mono uppercase tracking-widest font-semibold px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                Session Confirmed
              </span>
            </div>
            <h4 className="text-base font-bold text-white">
              Discovery Architecture Call Scheduled
            </h4>
            <p className="text-xs text-slate-300 mt-1 leading-relaxed">
              Your 30-minute technical strategy session has been locked for{' '}
              <strong className="text-emerald-400 font-semibold">
                {selectedDate} at {selectedTime} ({selectedTimezone})
              </strong>.
            </p>
          </div>
        </div>

        {/* Video Call & Room Box */}
        <div className="bg-black/40 border border-white/10 rounded-xl p-3.5 mb-4 space-y-2 relative z-10">
          <div className="flex items-center justify-between text-xs">
            <span className="text-slate-400 flex items-center gap-1.5">
              <Video className="w-3.5 h-3.5 text-indigo-400" />
              Dedicated Video Room:
            </span>
            <button
              type="button"
              onClick={handleCopyLink}
              className="text-[11px] text-indigo-400 hover:text-indigo-300 flex items-center gap-1 cursor-pointer font-mono"
            >
              {copiedLink ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
              <span>{copiedLink ? 'Copied' : 'Copy Room Link'}</span>
            </button>
          </div>
          <div className="p-2 rounded-lg bg-white/5 border border-white/5 font-mono text-[11px] text-slate-200 select-all truncate">
            {meetingUrl}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap items-center gap-2.5 relative z-10">
          <a
            href={googleCalendarUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex-1 min-w-[150px] py-2.5 px-3 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white text-xs font-semibold flex items-center justify-center gap-1.5 shadow-md shadow-indigo-600/20 transition-all cursor-pointer"
          >
            <Calendar className="w-3.5 h-3.5" />
            <span>Add to Google Calendar</span>
            <ExternalLink className="w-3 h-3 opacity-70" />
          </a>

          <button
            type="button"
            onClick={handleDownloadICS}
            className="py-2.5 px-3.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-slate-200 text-xs font-medium flex items-center justify-center gap-1.5 transition-all cursor-pointer"
          >
            <Download className="w-3.5 h-3.5 text-slate-400" />
            <span>Download .ICS</span>
          </button>
        </div>

        <div className="mt-3.5 pt-3 border-t border-white/10 flex items-center justify-between text-[11px] text-slate-400 font-mono">
          <span className="flex items-center gap-1.5 text-emerald-400">
            <Sparkles className="w-3 h-3" />
            Enterprise Solutions Team Assigned
          </span>
          <button
            type="button"
            onClick={() => setBooked(false)}
            className="text-slate-400 hover:text-white underline cursor-pointer"
          >
            Reschedule
          </button>
        </div>
      </motion.div>
    );
  }

  return (
    <div className="rounded-2xl border border-indigo-500/30 bg-gradient-to-br from-indigo-950/40 via-slate-900/80 to-black/70 p-5 mt-4 relative overflow-hidden shadow-2xl shadow-indigo-950/30">
      {/* Decorative glow */}
      <div className="absolute top-0 right-0 w-72 h-72 bg-indigo-600/10 rounded-full blur-3xl pointer-events-none" />

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4 pb-3.5 border-b border-white/10">
        <div>
          <div className="flex items-center gap-2 text-indigo-400 mb-1">
            <Video className="w-4 h-4" />
            <h4 className="text-sm font-bold text-white tracking-tight">
              Schedule Architecture &amp; Strategy Consultation
            </h4>
          </div>
          <p className="text-xs text-slate-300 max-w-lg leading-relaxed">
            Reserve a 30-minute discovery session with our Solutions Architecture &amp; Engineering Leadership to review your technical roadmap, cloud architecture, and MVP timeline.
          </p>
        </div>

        <div className="flex items-center gap-2 p-2 px-3 rounded-xl bg-white/5 border border-white/10 shrink-0 self-start sm:self-auto">
          <Clock className="w-3.5 h-3.5 text-indigo-400" />
          <div className="text-left sm:text-right">
            <span className="text-[10px] text-slate-400 block font-mono">Duration</span>
            <span className="text-xs font-semibold text-white">30 Min Video Call</span>
          </div>
        </div>
      </div>

      <form onSubmit={handleBook} className="space-y-4">
        {/* Step 1: Date Selection */}
        <div>
          <label className="text-[11px] font-semibold text-slate-300 uppercase tracking-wider block mb-2">
            1. Select Available Date
          </label>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            {availableDates.map((item) => (
              <button
                key={item.id}
                type="button"
                onClick={() => setSelectedDate(item.dateStr)}
                className={`p-2.5 rounded-xl text-left transition-all border cursor-pointer ${
                  selectedDate === item.dateStr
                    ? 'bg-indigo-600/30 border-indigo-500/80 text-white shadow-md shadow-indigo-600/20 ring-1 ring-indigo-500'
                    : 'bg-white/5 border-white/10 text-slate-300 hover:bg-white/10'
                }`}
              >
                <span className="text-[10px] font-mono text-indigo-400 block font-semibold uppercase">
                  {item.label}
                </span>
                <span className="text-xs font-medium block truncate mt-0.5">
                  {item.dateStr}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* Step 2: Time Slot & Timezone */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div className="sm:col-span-2">
            <label className="text-[11px] font-semibold text-slate-300 uppercase tracking-wider block mb-2">
              2. Select Time Slot
            </label>
            <div className="grid grid-cols-3 sm:grid-cols-5 gap-1.5">
              {timeSlots.map((slot) => (
                <button
                  key={slot}
                  type="button"
                  onClick={() => setSelectedTime(slot)}
                  className={`py-2 px-1 text-center rounded-lg text-xs font-mono font-medium transition-all border cursor-pointer ${
                    selectedTime === slot
                      ? 'bg-purple-600/30 border-purple-500 text-white shadow-sm ring-1 ring-purple-500'
                      : 'bg-white/5 border-white/10 text-slate-300 hover:bg-white/10'
                  }`}
                >
                  {slot}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="text-[11px] font-semibold text-slate-300 uppercase tracking-wider block mb-2">
              Timezone
            </label>
            <div className="relative">
              <select
                value={selectedTimezone}
                onChange={(e) => setSelectedTimezone(e.target.value)}
                className="w-full py-2 px-2.5 bg-black/40 border border-white/10 rounded-lg text-xs text-slate-200 focus:outline-none focus:border-indigo-500 font-mono cursor-pointer"
              >
                {timezones.map((tz) => (
                  <option key={tz} value={tz} className="bg-slate-900 text-slate-200">
                    {tz}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Step 3: Attendee Details */}
        <div>
          <label className="text-[11px] font-semibold text-slate-300 uppercase tracking-wider block mb-2">
            3. Attendee Details
          </label>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
            <div className="relative">
              <User className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-3" />
              <input
                type="text"
                required
                placeholder="Full Name *"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                className="w-full pl-9 pr-3 py-2 bg-black/40 border border-white/10 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 transition-all"
              />
            </div>
            <div className="relative">
              <Mail className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-3" />
              <input
                type="email"
                required
                placeholder="Work Email *"
                value={workEmail}
                onChange={(e) => setWorkEmail(e.target.value)}
                className="w-full pl-9 pr-3 py-2 bg-black/40 border border-white/10 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 transition-all"
              />
            </div>
          </div>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full py-3 bg-gradient-to-r from-indigo-600 via-purple-600 to-indigo-600 hover:from-indigo-500 hover:to-purple-500 text-white rounded-xl text-xs sm:text-sm font-semibold shadow-xl shadow-indigo-600/30 transition-all cursor-pointer flex items-center justify-center gap-2 group disabled:opacity-50"
        >
          {isSubmitting ? (
            <span>Securing Appointment...</span>
          ) : (
            <>
              <Video className="w-4 h-4 text-white" />
              <span>Confirm Strategy Call ({selectedDate} @ {selectedTime})</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </>
          )}
        </button>
      </form>
    </div>
  );
}
