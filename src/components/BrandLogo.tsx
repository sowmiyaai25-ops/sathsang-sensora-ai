import React from 'react';

interface BrandLogoProps {
  variant?: 'horizontal' | 'stacked' | 'icon';
  className?: string;
}

export const BrandEmblem: React.FC<{ className?: string }> = ({ className = 'w-9 h-9' }) => (
  <svg
    viewBox="0 0 64 64"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
    aria-hidden="true"
  >
    <rect x="2" y="2" width="60" height="60" rx="14" fill="#102B28" />
    <rect
      x="2.5"
      y="2.5"
      width="59"
      height="59"
      rx="13.5"
      stroke="#D5B77A"
      strokeOpacity="0.45"
    />
    <path
      d="M17 51V30C17 19.2 23.7 11.5 32 11.5C40.3 11.5 47 19.2 47 30V51"
      stroke="#D5B77A"
      strokeWidth="2.1"
      strokeLinecap="round"
    />
    <path
      d="M23.5 51V31C23.5 23.6 27.3 18.2 32 18.2C36.7 18.2 40.5 23.6 40.5 31V51"
      stroke="#F4EFE5"
      strokeOpacity="0.72"
      strokeWidth="1.3"
      strokeLinecap="round"
    />
    <path
      d="M13 39.5C19.5 35.8 25.5 42.8 32 39C38.5 35.2 44.5 42.2 51 38.5"
      stroke="#D5B77A"
      strokeWidth="1.8"
      strokeLinecap="round"
    />
    <circle cx="32" cy="26.5" r="2.4" fill="#D5B77A" />
  </svg>
);

export const BrandLogo: React.FC<BrandLogoProps> = ({
  variant = 'horizontal',
  className = '',
}) => {
  if (variant === 'icon') {
    return <BrandEmblem className={className || 'w-10 h-10'} />;
  }

  if (variant === 'stacked') {
    return (
      <div className={`inline-flex flex-col items-center text-center select-none ${className}`}>
        <BrandEmblem className="w-14 h-14 mb-4" />
        <span className="text-[11px] uppercase tracking-[0.42em] text-[#D5B77A] font-medium">
          SATHSANG
        </span>
        <span className="text-[10px] uppercase tracking-[0.28em] text-[#F4EFE5]/55 mt-1">
          presents
        </span>
        <span className="font-display text-3xl sm:text-4xl font-semibold tracking-[0.14em] text-[#F4EFE5] mt-1">
          SENSORA <span className="text-[#D5B77A] font-normal">AI</span>
        </span>
      </div>
    );
  }

  return (
    <div className={`inline-flex items-center gap-3 select-none whitespace-nowrap shrink-0 ${className}`}>
      <BrandEmblem className="w-9 h-9 shrink-0" />
      <div className="flex flex-col leading-none">
        <span className="text-[9px] uppercase tracking-[0.34em] text-[#D5B77A]/90 font-medium">
          SATHSANG presents
        </span>
        <span className="font-display text-lg font-semibold tracking-[0.12em] text-[#F4EFE5] mt-0.5">
          SENSORA <span className="text-[#D5B77A] font-normal">AI</span>
        </span>
      </div>
    </div>
  );
};
