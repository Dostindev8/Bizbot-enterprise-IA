import React from 'react';
import { cn } from '../tokens.js';

interface EmptyStateProps {
  title: string;
  description?: string;
  icon?: React.ReactNode;
  action?: React.ReactNode;
  variant?: 'empty' | 'error' | 'loading';
  className?: string;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  title,
  description,
  icon,
  action,
  variant = 'empty',
  className,
}) => {
  const tone =
    variant === 'error'
      ? 'border-red-500/40 text-red-200'
      : variant === 'loading'
        ? 'border-[#00D4FF]/30 text-[#8B9BB8]'
        : 'border-[#23304E] text-[#8B9BB8]';

  return (
    <div
      role={variant === 'error' ? 'alert' : 'status'}
      className={cn(
        'w-full rounded-2xl border bg-[#131A2B]/80 px-4 py-10 text-center',
        tone,
        className
      )}
    >
      {icon && <div className="mx-auto mb-3 flex h-10 w-10 items-center justify-center">{icon}</div>}
      <h3 className="text-sm font-bold text-[#E8EEF8]">{title}</h3>
      {description && <p className="mt-1 text-xs leading-relaxed">{description}</p>}
      {action && <div className="mt-4 flex justify-center">{action}</div>}
    </div>
  );
};
