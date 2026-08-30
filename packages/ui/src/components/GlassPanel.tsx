import React from 'react';
import { cn } from '../tokens.js';

export interface GlassPanelProps extends React.HTMLAttributes<HTMLDivElement> {
  glow?: boolean;
  intensity?: 'low' | 'medium' | 'high';
}

export const GlassPanel: React.FC<GlassPanelProps> = ({
  children,
  glow = false,
  intensity = 'medium',
  className,
  ...props
}) => {
  const intensityMap = {
    low: 'bg-[#131A2B]/60 backdrop-blur-md border-[#23304E]/50',
    medium: 'bg-[#131A2B]/80 backdrop-blur-xl border-[#23304E]',
    high: 'bg-[#131A2B]/95 backdrop-blur-2xl border-[#374870]',
  };

  return (
    <div
      className={cn(
        'rounded-2xl p-5 border text-[#E8EEF8] transition-all duration-200',
        intensityMap[intensity],
        glow && 'shadow-[0_0_40px_rgba(0,212,255,0.12)] hover:border-[#00D4FF]/40',
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
};
