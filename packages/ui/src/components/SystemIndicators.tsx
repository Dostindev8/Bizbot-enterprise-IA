import React from 'react';
import { cn } from '../tokens.js';
import { ShieldCheck, Cpu, Sparkles } from 'lucide-react';

export const UptimeBadge: React.FC<{ uptime?: number; className?: string }> = ({
  uptime = 99.98,
  className,
}) => {
  return (
    <div
      className={cn(
        'inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#131A2B]/90 border border-emerald-500/30 text-xs font-semibold text-[#E8EEF8] shadow-[0_0_20px_rgba(57,229,140,0.15)]',
        className
      )}
    >
      <span className="relative flex h-2 w-2">
        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#39E58C] opacity-75"></span>
        <span className="relative inline-flex rounded-full h-2 w-2 bg-[#39E58C]"></span>
      </span>
      <span className="text-[#39E58C]">{uptime}%</span>
      <span className="text-[#8B9BB8] text-[11px]">SLA Operacional</span>
      <ShieldCheck className="w-3.5 h-3.5 text-cyan-400" />
    </div>
  );
};

export const ThinkingIndicator: React.FC<{ model?: string; className?: string }> = ({
  model = 'Claude 3.5 Sonnet',
  className,
}) => {
  return (
    <div
      className={cn(
        'inline-flex items-center gap-2.5 px-3 py-1.5 rounded-xl bg-[#131A2B]/90 border border-[#00D4FF]/30 text-xs text-[#00D4FF] shadow-[0_0_25px_rgba(0,212,255,0.18)]',
        className
      )}
    >
      <Cpu className="w-4 h-4 animate-spin text-[#00D4FF]" />
      <span className="font-semibold tracking-wide">IA Procesando</span>
      <span className="text-[10px] px-1.5 py-0.5 rounded bg-cyan-950 text-cyan-300 font-mono">
        {model}
      </span>
      <Sparkles className="w-3.5 h-3.5 text-purple-400 animate-pulse" />
    </div>
  );
};
