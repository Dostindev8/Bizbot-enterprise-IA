import React, { forwardRef } from 'react';
import { cn } from '../tokens.js';
import { Loader2 } from 'lucide-react';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'glass' | 'outline' | 'danger' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  isLoading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      children,
      variant = 'primary',
      size = 'md',
      isLoading = false,
      leftIcon,
      rightIcon,
      className,
      disabled,
      ...props
    },
    ref
  ) => {
    const variantStyles = {
      primary:
        'bg-[#00D4FF] text-[#0B0F19] font-bold hover:bg-[#33DCFF] shadow-[0_0_25px_rgba(0,212,255,0.35)] hover:shadow-[0_0_35px_rgba(0,212,255,0.5)] active:scale-[0.98]',
      secondary:
        'bg-[#7C3AED] text-white font-bold hover:bg-[#9055F6] shadow-[0_0_25px_rgba(124,58,237,0.35)] hover:shadow-[0_0_35px_rgba(124,58,237,0.5)] active:scale-[0.98]',
      glass:
        'bg-[#131A2B]/80 text-[#E8EEF8] border border-[#23304E] hover:border-[#00D4FF]/50 hover:bg-[#1B243B] active:scale-[0.98]',
      outline:
        'bg-transparent text-[#00D4FF] border border-[#00D4FF]/60 hover:bg-[#00D4FF]/10 active:scale-[0.98]',
      danger:
        'bg-red-600 text-white font-semibold hover:bg-red-500 shadow-[0_0_20px_rgba(239,68,68,0.3)] active:scale-[0.98]',
      ghost:
        'bg-transparent text-[#8B9BB8] hover:text-[#E8EEF8] hover:bg-white/5 active:scale-[0.98]',
    };

    const sizeStyles = {
      sm: 'h-9 px-3.5 text-xs rounded-lg gap-1.5',
      md: 'h-11 px-5 text-sm rounded-xl gap-2',
      lg: 'h-13 px-7 text-base rounded-2xl gap-2.5',
    };

    return (
      <button
        ref={ref}
        disabled={disabled || isLoading}
        className={cn(
          'relative inline-flex items-center justify-center select-none font-semibold transition-all duration-200 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed disabled:pointer-events-none focus:outline-none focus-visible:ring-2 focus-visible:ring-[#00D4FF]',
          variantStyles[variant],
          sizeStyles[size],
          className
        )}
        {...props}
      >
        {isLoading ? (
          <Loader2 className="w-4 h-4 animate-spin" />
        ) : (
          <>
            {leftIcon && <span className="shrink-0">{leftIcon}</span>}
            <span>{children}</span>
            {rightIcon && <span className="shrink-0">{rightIcon}</span>}
          </>
        )}
      </button>
    );
  }
);

Button.displayName = 'Button';
