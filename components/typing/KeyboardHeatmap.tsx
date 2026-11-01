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

  const maxErrors = Math.max(1, ...Object.values(mistakeMap));

  const getKeyHeatStyle = (key: string) => {
    const errorCount = mistakeMap[key.toLowerCase()] || 0;
    if (errorCount === 0) {
      return 'bg-white text-[#7A645C] border-[#F6E4DC]';
    }

    const intensity = errorCount / maxErrors;
    if (intensity > 0.6) {
      return 'bg-[#EB5757] text-white border-[#EB5757] font-bold shadow-sm';
    }
    if (intensity > 0.3) {
      return 'bg-[#FF7B59] text-white border-[#FF7B59] font-semibold shadow-sm';
    }
    return 'bg-[#FFD7CC] text-[#7A645C] border-[#FFB8A5]';
  };

  const getKeyWidth = (key: string) => {
    switch (key) {
      case 'space':
        return 'w-60 h-9';
      case 'backspace':
        return 'w-14 h-8';
      case 'tab':
      case '\\':
        return 'w-13 h-8';
      case 'caps':
      case 'enter':
        return 'w-14 h-8';
      case 'shift':
        return 'w-16 h-8';
      default:
        return 'w-8 h-8';
    }
  };

  return (
    <div className="w-full flex flex-col items-center justify-center p-4 bg-[#FFF5F1]/80 rounded-2xl border border-[#FDE5DC] overflow-x-auto">
      <div className="space-y-1.5 select-none font-sans text-xs">
        {keyboardRows.map((row, rowIdx) => (
          <div key={rowIdx} className="flex justify-center gap-1.5">
            {row.map((key, keyIdx) => {
              const errors = mistakeMap[key.toLowerCase()] || 0;
              return (
                <div
                  key={`${rowIdx}-${keyIdx}-${key}`}
                  className={`${getKeyWidth(key)} ${getKeyHeatStyle(
                    key
                  )} rounded-xl border flex items-center justify-center transition-all duration-200 relative group cursor-default shadow-[0_2px_4px_rgba(158,119,103,0.06)]`}
                >
                  <span>{key}</span>
                  {errors > 0 && (
                    <span className="absolute -top-1 -right-1 w-3.5 h-3.5 bg-[#EB5757] text-white text-[9px] font-bold rounded-full flex items-center justify-center leading-none">
                      {errors}
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
