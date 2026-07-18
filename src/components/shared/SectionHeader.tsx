import React from 'react';

interface SectionHeaderProps {
  title: string;
  subtitle?: string;
  description?: string;
  className?: string;
}

export function SectionHeader({ title, subtitle, description, className }: SectionHeaderProps) {
  return (
    <div
      className={`flex flex-col items-center text-center max-w-3xl mx-auto mb-16 gap-3 ${className || ''}`}
    >
      {subtitle && (
        <span className="text-xs font-bold tracking-widest text-indigo-500 uppercase">
          {subtitle}
        </span>
      )}
      <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-foreground">
        {title}
      </h2>
      {description && (
        <p className="text-base sm:text-lg text-muted-foreground leading-relaxed">{description}</p>
      )}
    </div>
  );
}
