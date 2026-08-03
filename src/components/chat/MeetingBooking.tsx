'use client';

import React, { useState } from 'react';
import { Calendar, Video, CheckCircle2 } from 'lucide-react';
import { motion } from 'framer-motion';

export default function MeetingBooking() {
  const [booked, setBooked] = useState(false);

  const handleBook = () => {
    // In production, this would open Calendly or create a CRM Lead
    setBooked(true);
  };

  if (booked) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-green-900/20 border border-green-500/30 rounded-xl p-6 mt-4 text-center"
      >
        <div className="w-12 h-12 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-3">
          <CheckCircle2 className="w-6 h-6 text-green-400" />
        </div>
        <h4 className="text-lg font-medium text-gray-100 mb-1">Meeting Confirmed!</h4>
        <p className="text-sm text-gray-400 mb-4">
          An invitation has been sent to your email with the Google Meet link.
        </p>
      </motion.div>
    );
  }

  return (
    <div className="bg-gray-800/80 border border-blue-500/30 rounded-xl p-5 mt-4 relative overflow-hidden group">
      <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-purple-500/5 pointer-events-none" />

      <div className="flex items-start justify-between relative z-10">
        <div>
          <div className="flex items-center space-x-2 text-blue-400 mb-1">
            <Video className="w-5 h-5" />
            <h4 className="font-medium">Discuss Your Architecture</h4>
          </div>
          <p className="text-sm text-gray-400 max-w-sm mb-4">
            Based on your requirements, I recommend a 30-minute discovery call with our Lead
            Architect to finalize the tech stack.
          </p>
        </div>
        <div className="p-3 bg-gray-900 rounded-xl border border-gray-700 shadow-inner">
          <Calendar className="w-8 h-8 text-gray-500" />
        </div>
      </div>

      <button
        onClick={handleBook}
        className="relative z-10 w-full py-3 bg-blue-600 hover:bg-blue-500 text-white rounded-lg font-medium shadow-lg shadow-blue-900/20 transition-colors flex items-center justify-center space-x-2"
      >
        <span>Schedule Discovery Call</span>
      </button>
    </div>
  );
}
