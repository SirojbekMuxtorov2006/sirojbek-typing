'use client';

import React from 'react';

interface KeyboardHeatmapProps {
  mistakeMap: Record<string, number>;
}

export default function KeyboardHeatmap({ mistakeMap }: KeyboardHeatmapProps) {
  const keyboardRows = [
    ['`', '1', '2', '3', '4', '5', '6', '7', '8', '9', '0', '-', '=', 'backspace'],
    ['tab', 'q', 'w', 'e', 'r', 't', 'y', 'u', 'i', 'o', 'p', '[', ']', '\\'],
    ['caps', 'a', 's', 'd', 'f', 'g', 'h', 'j', 'k', 'l', ';', "'", 'enter'],
    ['shift', 'z', 'x', 'c', 'v', 'b', 'n', 'm', ',', '.', '/', 'shift'],
    ['space'],
  ];

  // Find max errors to normalize heat color
  const maxErrors = Math.max(1, ...Object.values(mistakeMap));

  const getKeyHeatStyle = (key: string) => {
    const errorCount = mistakeMap[key.toLowerCase()] || 0;
    if (errorCount === 0) {
      return 'bg-card-bg text-text-secondary border-border/80';
    }

    const intensity = errorCount / maxErrors;
    if (intensity > 0.6) {
      return 'bg-error/30 text-error border-error shadow-[0_0_8px_rgba(239,100,100,0.4)] font-bold';
    }
    if (intensity > 0.3) {
      return 'bg-accent/30 text-accent border-accent/80 font-semibold';
    }
    return 'bg-accent/15 text-accent-hover border-accent/40';
  };

  const getKeyWidth = (key: string) => {
    switch (key) {
      case 'space':
        return 'w-64 h-8';
      case 'backspace':
        return 'w-16 h-8';
      case 'tab':
      case '\\':
        return 'w-14 h-8';
      case 'caps':
      case 'enter':
        return 'w-16 h-8';
      case 'shift':
        return 'w-20 h-8';
      default:
        return 'w-8 h-8';
    }
  };

  return (
    <div className="w-full flex flex-col items-center justify-center p-4 bg-secondary-bg/50 rounded-xl border border-border overflow-x-auto">
      <div className="flex items-center justify-between w-full max-w-2xl mb-3 text-xs text-text-secondary">
        <span className="font-mono font-medium">Keyboard Error Heatmap</span>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded bg-card-bg border border-border" />
            <span className="text-[11px]">Accurate</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded bg-accent/30 border border-accent" />
            <span className="text-[11px]">Low Errors</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded bg-error/30 border border-error" />
            <span className="text-[11px]">Frequent Errors</span>
          </div>
        </div>
      </div>

      <div className="space-y-1.5 select-none font-mono text-xs">
        {keyboardRows.map((row, rowIdx) => (
          <div key={rowIdx} className="flex justify-center gap-1.5">
            {row.map((key, keyIdx) => {
              const errors = mistakeMap[key.toLowerCase()] || 0;
              return (
                <div
                  key={`${rowIdx}-${keyIdx}-${key}`}
                  title={errors > 0 ? `${key.toUpperCase()}: ${errors} mistake${errors > 1 ? 's' : ''}` : key}
                  className={`${getKeyWidth(key)} ${getKeyHeatStyle(
                    key
                  )} rounded-lg border flex items-center justify-center transition-all duration-200 relative group cursor-default`}
                >
                  <span>{key}</span>
                  {errors > 0 && (
                    <span className="absolute -top-1 -right-1 w-3.5 h-3.5 bg-error text-background text-[9px] font-bold rounded-full flex items-center justify-center leading-none">
                      {errors > 9 ? '9+' : errors}
                    </span>
                  )}
                </div>
              );
            })}
          </div>
        ))}
      </div>
    </div>
  );
}
