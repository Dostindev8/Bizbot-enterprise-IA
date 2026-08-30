import React, { useMemo } from 'react';
import { cn } from '../tokens.js';
import { Check, X } from 'lucide-react';

export interface PasswordStrengthProps {
  password?: string;
  className?: string;
}

export const PasswordStrength: React.FC<PasswordStrengthProps> = ({
  password = '',
  className,
}) => {
  const analysis = useMemo(() => {
    const hasMinLength = password.length >= 8;
    const hasUppercase = /[A-Z]/.test(password);
    const hasNumber = /[0-9]/.test(password);
    const hasSpecial = /[^A-Za-z0-9]/.test(password);

    const score = [hasMinLength, hasUppercase, hasNumber, hasSpecial].filter(Boolean).length;

    let label = 'Muy Débil';
    let colorClass = 'bg-red-500';

    if (score === 2) {
      label = 'Media';
      colorClass = 'bg-yellow-500';
    } else if (score === 3) {
      label = 'Fuerte';
      colorClass = 'bg-[#00D4FF]';
    } else if (score === 4) {
      label = 'Excelente';
      colorClass = 'bg-[#39E58C]';
    }

    return {
      score,
      label,
      colorClass,
      checks: [
        { label: '8+ caracteres', valid: hasMinLength },
        { label: '1 mayúscula', valid: hasUppercase },
        { label: '1 número', valid: hasNumber },
        { label: '1 caracter especial', valid: hasSpecial },
      ],
    };
  }, [password]);

  if (!password) return null;

  return (
    <div className={cn('w-full flex flex-col gap-2 mt-1', className)}>
      <div className="flex items-center justify-between text-xs">
        <span className="text-[#8B9BB8]">Fuerza de la clave</span>
        <span className="font-semibold text-[#E8EEF8]">{analysis.label}</span>
      </div>
      <div className="grid grid-cols-4 gap-1.5 h-1.5 w-full">
        {[1, 2, 3, 4].map((step) => (
          <div
            key={step}
            className={cn(
              'h-full rounded-full transition-all duration-300',
              step <= analysis.score ? analysis.colorClass : 'bg-[#23304E]'
            )}
          />
        ))}
      </div>
      <div className="grid grid-cols-2 gap-1 mt-1 text-[11px]">
        {analysis.checks.map((c, i) => (
          <div
            key={i}
            className={cn(
              'flex items-center gap-1 transition-colors',
              c.valid ? 'text-[#39E58C]' : 'text-[#5F708F]'
            )}
          >
            {c.valid ? <Check className="w-3 h-3" /> : <X className="w-3 h-3" />}
            <span>{c.label}</span>
          </div>
        ))}
      </div>
    </div>
  );
};
