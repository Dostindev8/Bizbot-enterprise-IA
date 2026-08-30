import React from 'react';
import { cn } from '../tokens.js';

export interface SkeletonProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'text' | 'circle' | 'card' | 'button';
}

export const Skeleton: React.FC<SkeletonProps> = ({
  variant = 'text',
  className,
  ...props
}) => {
  const variantStyles = {
    text: 'h-4 w-full rounded-md',
    circle: 'w-10 h-10 rounded-full',
    card: 'h-32 w-full rounded-2xl',
    button: 'h-11 w-28 rounded-xl',
  };

  return (
    <div
      className={cn(
        'animate-pulse bg-[#1B243B]/80 border border-white/5',
        variantStyles[variant],
        className
      )}
      {...props}
    />
  );
};
