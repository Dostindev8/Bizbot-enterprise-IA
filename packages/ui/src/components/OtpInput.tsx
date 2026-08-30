import React, { useRef, useState, useEffect } from 'react';
import { cn } from '../tokens.js';

export interface OtpInputProps {
  length?: number;
  value: string;
  onChange: (value: string) => void;
  disabled?: boolean;
  error?: boolean;
}

export const OtpInput: React.FC<OtpInputProps> = ({
  length = 6,
  value,
  onChange,
  disabled = false,
  error = false,
}) => {
  const inputsRef = useRef<(HTMLInputElement | null)[]>([]);
  const [digits, setDigits] = useState<string[]>(Array(length).fill(''));

  useEffect(() => {
    const arr = value.split('').slice(0, length);
    while (arr.length < length) arr.push('');
    setDigits(arr);
  }, [value, length]);

  const handleChange = (index: number, char: string) => {
    const onlyDigit = char.replace(/\D/g, '').slice(-1);
    const newDigits = [...digits];
    newDigits[index] = onlyDigit;
    const combined = newDigits.join('');
    onChange(combined);

    if (onlyDigit && index < length - 1) {
      inputsRef.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace' && !digits[index] && index > 0) {
      inputsRef.current[index - 1]?.focus();
    }
  };

  const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    const pasted = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, length);
    if (pasted) {
      onChange(pasted);
      const nextFocus = Math.min(pasted.length, length - 1);
      inputsRef.current[nextFocus]?.focus();
    }
  };

  return (
    <div className="flex items-center justify-center gap-2 sm:gap-3 my-4">
      {Array.from({ length }).map((_, i) => (
        <input
          key={i}
          ref={(el) => {
            inputsRef.current[i] = el;
          }}
          type="text"
          inputMode="numeric"
          maxLength={1}
          value={digits[i] || ''}
          disabled={disabled}
          onChange={(e) => handleChange(i, e.target.value)}
          onKeyDown={(e) => handleKeyDown(i, e)}
          onPaste={handlePaste}
          className={cn(
            'w-11 h-13 sm:w-12 sm:h-14 text-center text-xl font-bold rounded-xl',
            'bg-[#0B0F19] text-[#00D4FF] border transition-all duration-200 focus:outline-none',
            error
              ? 'border-red-500 focus:ring-2 focus:ring-red-500/30'
              : 'border-[#23304E] focus:border-[#00D4FF] focus:ring-2 focus:ring-[#00D4FF]/30 hover:border-[#374870]',
            disabled && 'opacity-50 cursor-not-allowed'
          )}
        />
      ))}
    </div>
  );
};
