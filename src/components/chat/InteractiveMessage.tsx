import React from 'react';
import { Clock, Code2, Users, AlertTriangle } from 'lucide-react';
import { motion } from 'framer-motion';

export function TimelineCard({ min, max }: { min: number; max: number }) {
  return (
    <div className="bg-gray-800/50 border border-gray-700 rounded-xl p-4 mt-2">
      <div className="flex items-center space-x-2 text-blue-400 mb-3">
        <Clock className="w-4 h-4" />
        <h4 className="text-sm font-semibold uppercase tracking-wider">Estimated Timeline</h4>
      </div>
      <div className="relative w-full h-3 bg-gray-700 rounded-full overflow-hidden">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${(max / 52) * 100}%` }}
          transition={{ duration: 1, ease: 'easeOut' }}
          className="absolute h-full bg-gradient-to-r from-blue-600 to-purple-600 rounded-full"
        />
      </div>
      <div className="mt-2 text-sm text-gray-300 font-medium">
        {min} - {max} Weeks to MVP
      </div>
    </div>
  );
}

export function TechStackCard({ stack }: { stack: string[] }) {
  return (
    <div className="bg-gray-800/50 border border-gray-700 rounded-xl p-4 mt-2">
      <div className="flex items-center space-x-2 text-green-400 mb-3">
        <Code2 className="w-4 h-4" />
        <h4 className="text-sm font-semibold uppercase tracking-wider">Suggested Tech Stack</h4>
      </div>
      <div className="flex flex-wrap gap-2">
        {stack.map((tech, i) => (
          <span
            key={i}
            className="px-3 py-1 bg-gray-900 border border-gray-700 rounded-lg text-xs font-medium text-gray-300 shadow-sm"
          >
            {tech}
          </span>
        ))}
      </div>
    </div>
  );
}

export function MissingReqsCard({ reqs }: { reqs: string[] }) {
  if (!reqs || reqs.length === 0) return null;
  return (
    <div className="bg-gray-800/50 border border-red-900/30 rounded-xl p-4 mt-2 relative overflow-hidden">
      <div className="absolute top-0 right-0 p-4 opacity-5 pointer-events-none">
        <AlertTriangle className="w-24 h-24 text-red-500" />
      </div>
      <div className="flex items-center space-x-2 text-red-400 mb-3">
        <AlertTriangle className="w-4 h-4" />
        <h4 className="text-sm font-semibold uppercase tracking-wider">
          Critical Missing Requirements
        </h4>
      </div>
      <ul className="space-y-2 relative z-10">
        {reqs.map((req, i) => (
          <li key={i} className="flex items-start text-sm text-gray-300">
            <span className="text-red-500 mr-2">•</span>
            {req}
          </li>
        ))}
      </ul>
    </div>
  );
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export default function InteractiveMessage({ data }: { data: any }) {
  if (data.type === 'REQUIREMENT_ANALYSIS') {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
        {data.missingRequirements && (
          <div className="md:col-span-2">
            <MissingReqsCard reqs={data.missingRequirements} />
          </div>
        )}
        {data.techStack && <TechStackCard stack={data.techStack} />}
        {data.timeline && <TimelineCard min={data.timeline.min} max={data.timeline.max} />}
      </div>
    );
  }

  return null;
}
