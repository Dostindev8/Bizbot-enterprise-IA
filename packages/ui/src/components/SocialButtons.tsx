import React from 'react';
import { Button } from './Button.js';

export interface SocialButtonsProps {
  onGoogleLogin?: () => void;
  onMicrosoftLogin?: () => void;
  isLoading?: boolean;
}

export const SocialButtons: React.FC<SocialButtonsProps> = ({
  onGoogleLogin,
  onMicrosoftLogin,
  isLoading = false,
}) => {
  return (
    <div className="grid grid-cols-2 gap-3 w-full">
      <Button
        type="button"
        variant="glass"
        size="md"
        isLoading={isLoading}
        onClick={onGoogleLogin}
        className="w-full text-xs font-medium gap-2 text-[#E8EEF8]"
      >
        <svg className="w-4 h-4" viewBox="0 0 24 24">
          <path
            fill="#EA4335"
            d="M12 5c1.6 0 3 .6 4.1 1.7l3.1-3.1C17.3 1.8 14.8 1 12 1 7.5 1 3.7 3.6 1.9 7.4l3.7 2.9C6.5 7.4 9 5 12 5z"
          />
          <path
            fill="#4285F4"
            d="M23.5 12.3c0-.8-.1-1.7-.2-2.3H12v4.6h6.5c-.3 1.5-1.1 2.8-2.4 3.7l3.7 2.9c2.2-2 3.7-5 3.7-8.9z"
          />
          <path
            fill="#FBBC05"
            d="M5.6 14.7c-.2-.7-.4-1.5-.4-2.7 0-1.1.2-1.9.4-2.7L1.9 6.4C.7 8.8 0 10.8 0 12c0 1.2.7 3.2 1.9 5.6l3.7-2.9z"
          />
          <path
            fill="#34A853"
            d="M12 23c3.2 0 6-1.1 8-3l-3.7-2.9c-1.1.7-2.5 1.2-4.3 1.2-3 0-5.5-2.4-6.4-5.3L1.9 16C3.7 19.8 7.5 23 12 23z"
          />
        </svg>
        <span>Google</span>
      </Button>

      <Button
        type="button"
        variant="glass"
        size="md"
        isLoading={isLoading}
        onClick={onMicrosoftLogin}
        className="w-full text-xs font-medium gap-2 text-[#E8EEF8]"
      >
        <svg className="w-4 h-4" viewBox="0 0 23 23">
          <path fill="#f35325" d="M1 1h10v10H1z" />
          <path fill="#81bc06" d="M12 1h10v10H12z" />
          <path fill="#05a6f0" d="M1 12h10v10H1z" />
          <path fill="#ffba08" d="M12 12h10v10H12z" />
        </svg>
        <span>Microsoft</span>
      </Button>
    </div>
  );
};
