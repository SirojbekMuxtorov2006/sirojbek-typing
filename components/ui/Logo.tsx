import React from 'react';
import Link from 'next/link';

interface LogoProps {
  size?: 'sm' | 'md' | 'lg';
  showSubtitle?: boolean;
}

export default function Logo({ size = 'md', showSubtitle = false }: LogoProps) {
  const sizeClasses = {
    sm: 'text-lg',
    md: 'text-xl',
    lg: 'text-2xl md:text-3xl',
  };

  const iconSizes = {
    sm: 'w-6 h-6 text-xs',
    md: 'w-8 h-8 text-sm',
    lg: 'w-10 h-10 text-base',
  };

  return (
    <Link href="/" className="inline-flex items-center gap-2.5 group focus:outline-none">
      <div
        className={`${iconSizes[size]} rounded-lg bg-secondary-bg border border-border group-hover:border-accent transition-all duration-300 flex items-center justify-center font-mono font-bold text-accent shadow-sm group-hover:shadow-[0_0_12px_rgba(232,180,79,0.35)] relative overflow-hidden`}
      >
        <span className="relative z-10">S</span>
        <div className="absolute inset-x-0 bottom-0 h-1 bg-accent/80 rounded-full" />
      </div>

      <div className="flex flex-col">
        <div className={`font-mono font-bold tracking-tight ${sizeClasses[size]} flex items-center`}>
          <span className="text-accent group-hover:brightness-110 transition-colors">Sirojbek</span>
          <span className="text-text-primary ml-0.5">Typing</span>
          <span className="inline-block w-1.5 h-4 ml-1 bg-accent animate-blink" />
        </div>
        {showSubtitle && (
          <span className="text-[10px] text-text-muted uppercase tracking-wider font-mono">
            Professional Speed Platform
          </span>
        )}
      </div>
    </Link>
  );
}
