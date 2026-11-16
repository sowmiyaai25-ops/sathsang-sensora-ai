import React, { useState } from 'react';
import { BrandEmblem } from './BrandLogo';

interface SafeImageProps {
  src: string;
  alt: string;
  className?: string;
  loading?: 'lazy' | 'eager';
}

export const SafeImage: React.FC<SafeImageProps> = ({
  src,
  alt,
  className = 'w-full h-full object-cover',
  loading = 'lazy',
}) => {
  const [failed, setFailed] = useState(false);

  if (failed || !src) {
    return (
      <div
        className={`flex flex-col items-center justify-center bg-gradient-to-br from-[#102B28] via-[#152220] to-[#111515] text-[#F4EFE5]/70 p-6 text-center ${className}`}
        role="img"
        aria-label={alt}
      >
        <BrandEmblem className="w-10 h-10 mb-3 opacity-80" />
        <span className="font-display text-sm tracking-wide text-[#D5B77A]">{alt}</span>
      </div>
    );
  }

  return (
    <img
      src={src}
      alt={alt}
      loading={loading}
      decoding="async"
      referrerPolicy="no-referrer"
      onError={() => setFailed(true)}
      className={`contrast-[1.04] saturate-[1.06] brightness-[1.02] ${className}`}
    />
  );
};
