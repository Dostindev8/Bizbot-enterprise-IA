import React from 'react';
import { cn } from '../tokens.js';

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: 'cyan' | 'purple' | 'success' | 'warning' | 'danger' | 'neutral';
  dot?: boolean;
}

export const Badge: React.FC<BadgeProps> = ({
  children,
  variant = 'cyan',
  dot = false,
  className,
  ...props
}) => {
  const variantStyles = {
    cyan: 'bg-[#00D4FF]/10 text-[#00D4FF] border-cyan-500/30',
    purple: 'bg-[#7C3AED]/15 text-[#C4B5FD] border-purple-500/30',
    success: 'bg-[#39E58C]/15 text-[#39E58C] border-emerald-500/30',
    warning: 'bg-amber-500/15 text-amber-300 border-amber-500/30',
    danger: 'bg-red-500/15 text-red-300 border-red-500/30',
    neutral: 'bg-slate-800 text-slate-300 border-slate-700',
  };

  const dotColors = {
    cyan: 'bg-[#00D4FF]',
    purple: 'bg-[#7C3AED]',
    success: 'bg-[#39E58C]',
    warning: 'bg-amber-400',
    danger: 'bg-red-400',
    neutral: 'bg-slate-400',
  };

  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold border',
        variantStyles[variant],
        className
      )}
      {...props}
    >
      {dot && <span className={cn('w-1.5 h-1.5 rounded-full animate-pulse', dotColors[variant])} />}
      {children}
    </span>
  );
};
