import React, { forwardRef } from 'react';
import { cn } from '../tokens.js';
import { AlertCircle } from 'lucide-react';

export interface AuthInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string;
  icon?: React.ReactNode;
  rightElement?: React.ReactNode;
}

export const AuthInput = forwardRef<HTMLInputElement, AuthInputProps>(
  ({ label, error, icon, rightElement, className, id, type = 'text', ...props }, ref) => {
    const inputId = id || `auth-input-${label.toLowerCase().replace(/\s+/g, '-')}`;

    return (
      <div className="w-full flex flex-col gap-1.5 text-left">
        <label
          htmlFor={inputId}
          className="text-xs font-semibold uppercase tracking-wider text-[#8B9BB8]"
        >
          {label}
        </label>
        <div className="relative flex items-center">
          {icon && (
            <span className="absolute left-3.5 text-[#5F708F] pointer-events-none flex items-center">
              {icon}
            </span>
          )}
          <input
            ref={ref}
            id={inputId}
            type={type}
            className={cn(
              'w-full h-12 rounded-xl bg-[#0B0F19]/80 border text-[#E8EEF8] placeholder-[#5F708F]',
              'text-sm font-medium transition-all duration-200 focus:outline-none',
              icon ? 'pl-11' : 'pl-4',
              rightElement ? 'pr-11' : 'pr-4',
              error
                ? 'border-red-500/80 focus:border-red-500 focus:ring-2 focus:ring-red-500/20'
                : 'border-[#23304E] focus:border-[#00D4FF] focus:ring-2 focus:ring-[#00D4FF]/25 hover:border-[#374870]',
              className
            )}
            aria-invalid={!!error}
            aria-describedby={error ? `${inputId}-error` : undefined}
            {...props}
          />
          {rightElement && (
            <span className="absolute right-3.5 flex items-center">{rightElement}</span>
          )}
        </div>
        {error && (
          <p
            id={`${inputId}-error`}
            className="flex items-center gap-1.5 text-xs text-red-400 font-medium mt-0.5"
          >
            <AlertCircle className="w-3.5 h-3.5 shrink-0" />
            <span>{error}</span>
          </p>
        )}
      </div>
    );
  }
);

AuthInput.displayName = 'AuthInput';
