import React from 'react';
import { cn } from '../tokens.js';

export interface AuthCardProps extends React.HTMLAttributes<HTMLDivElement> {
  glowColor?: 'cyan' | 'violet' | 'dual';
  children: React.ReactNode;
}

export const AuthCard: React.FC<AuthCardProps> = ({
  className,
  glowColor = 'dual',
  children,
  ...props
}) => {
  const glowStyles = {
    cyan: 'shadow-[0_0_60px_rgba(0,212,255,0.18)] border-cyan-500/20',
    violet: 'shadow-[0_0_60px_rgba(124,58,237,0.22)] border-purple-500/20',
    dual: 'shadow-[0_0_70px_rgba(0,212,255,0.14),0_0_70px_rgba(124,58,237,0.16)] border-white/10',
  };

  return (
    <div
      className={cn(
        'relative w-full max-w-md mx-auto rounded-[24px] p-6 sm:p-8',
        'bg-[#131A2B]/85 backdrop-blur-2xl border transition-all duration-300',
        glowStyles[glowColor],
        className
      )}
      {...props}
    >
      {/* Subtle top light bar */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 h-[2px] w-3/4 bg-gradient-to-r from-transparent via-[#00D4FF] to-transparent opacity-80" />
      {children}
    </div>
  );
};
