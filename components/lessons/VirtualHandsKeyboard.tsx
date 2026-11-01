'use client';

import React from 'react';

interface VirtualHandsKeyboardProps {
  activeKey?: string;
  targetKeys?: string[];
}

export default function VirtualHandsKeyboard({
  activeKey = '',
  targetKeys = [],
}: VirtualHandsKeyboardProps) {
  const keyboardRows = [
    ['`', '1', '2', '3', '4', '5', '6', '7', '8', '9', '0', '-', '=', 'backspace'],
    ['tab', 'q', 'w', 'e', 'r', 't', 'y', 'u', 'i', 'o', 'p', '[', ']', '\\'],
    ['caps', 'a', 's', 'd', 'f', 'g', 'h', 'j', 'k', 'l', ';', "'", 'enter'],
    ['shift', 'z', 'x', 'c', 'v', 'b', 'n', 'm', ',', '.', '/', 'shift'],
    ['space'],
  ];

  // Map keys to specific finger assignments
  const getFingerClass = (key: string) => {
    const k = key.toLowerCase();
    // Pinky Left
    if (['1', 'q', 'a', 'z', '`', 'tab', 'caps'].includes(k)) return 'border-pink-500/30 text-pink-300';
    // Ring Left
    if (['2', 'w', 's', 'x'].includes(k)) return 'border-orange-500/30 text-orange-300';
    // Middle Left
    if (['3', 'e', 'd', 'c'].includes(k)) return 'border-yellow-500/30 text-yellow-300';
    // Index Left
    if (['4', '5', 'r', 't', 'f', 'g', 'v', 'b'].includes(k)) return 'border-green-500/30 text-green-300';
    // Thumbs
    if (k === 'space') return 'border-emerald-500/40 text-emerald-300';
    // Index Right
    if (['6', '7', 'y', 'u', 'h', 'j', 'n', 'm'].includes(k)) return 'border-blue-500/30 text-blue-300';
    // Middle Right
    if (['8', 'i', 'k', ','].includes(k)) return 'border-indigo-500/30 text-indigo-300';
    // Ring Right
    if (['9', 'o', 'l', '.'].includes(k)) return 'border-purple-500/30 text-purple-300';
    // Pinky Right
    return 'border-fuchsia-500/30 text-fuchsia-300';
  };

  const isKeyTarget = (key: string) => {
    const k = key.toLowerCase();
    return targetKeys.some((t) => t.toLowerCase().includes(k) || k === t.toLowerCase());
  };

  const isCurrentActive = (key: string) => {
    if (!activeKey) return false;
    if (key === 'space' && activeKey === ' ') return true;
    return key.toLowerCase() === activeKey.toLowerCase();
  };

  const getKeyWidth = (key: string) => {
    switch (key) {
      case 'space':
        return 'w-64 h-9';
      case 'backspace':
        return 'w-16 h-9';
      case 'tab':
      case '\\':
        return 'w-14 h-9';
      case 'caps':
      case 'enter':
        return 'w-16 h-9';
      case 'shift':
        return 'w-20 h-9';
      default:
        return 'w-9 h-9';
    }
  };

  return (
    <div className="w-full flex flex-col items-center justify-center p-4 bg-secondary-bg/90 rounded-2xl border border-border shadow-md select-none font-mono">
      {/* Keyboard visual guide */}
      <div className="space-y-1.5 w-full flex flex-col items-center">
        {keyboardRows.map((row, rowIdx) => (
          <div key={rowIdx} className="flex justify-center gap-1.5">
            {row.map((key, keyIdx) => {
              const isTarget = isKeyTarget(key);
              const isActive = isCurrentActive(key);

              let activeStyles = 'bg-card-bg/90 text-text-secondary';
              if (isActive) {
                activeStyles = 'bg-accent text-background font-bold shadow-[0_0_15px_rgba(232,180,79,0.8)] scale-105';
              } else if (isTarget) {
                activeStyles = 'bg-accent-muted text-accent font-semibold border-accent animate-pulse';
              }

              return (
                <div
                  key={`${rowIdx}-${keyIdx}-${key}`}
                  className={`${getKeyWidth(key)} ${activeStyles} ${getFingerClass(
                    key
                  )} rounded-lg border text-xs flex items-center justify-center transition-all duration-150 relative`}
                >
                  <span className="uppercase">{key}</span>
                  {/* Tactile bumps on F and J */}
                  {(key === 'f' || key === 'j') && (
                    <span className="absolute bottom-1 w-2.5 h-0.5 bg-text-muted rounded-full" />
                  )}
                </div>
              );
            })}
          </div>
        ))}
      </div>

      {/* Finger Legend */}
      <div className="mt-4 flex flex-wrap items-center justify-center gap-3 text-[11px] text-text-muted">
        <span className="flex items-center gap-1">
          <span className="w-2.5 h-2.5 rounded-full bg-pink-500/80" /> Left Pinky
        </span>
        <span className="flex items-center gap-1">
          <span className="w-2.5 h-2.5 rounded-full bg-orange-500/80" /> Left Ring
        </span>
        <span className="flex items-center gap-1">
          <span className="w-2.5 h-2.5 rounded-full bg-yellow-500/80" /> Left Middle
        </span>
        <span className="flex items-center gap-1">
          <span className="w-2.5 h-2.5 rounded-full bg-green-500/80" /> Left Index
        </span>
        <span className="flex items-center gap-1">
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-500/80" /> Thumbs
        </span>
        <span className="flex items-center gap-1">
          <span className="w-2.5 h-2.5 rounded-full bg-blue-500/80" /> Right Index
        </span>
        <span className="flex items-center gap-1">
          <span className="w-2.5 h-2.5 rounded-full bg-indigo-500/80" /> Right Middle
        </span>
        <span className="flex items-center gap-1">
          <span className="w-2.5 h-2.5 rounded-full bg-purple-500/80" /> Right Ring
        </span>
        <span className="flex items-center gap-1">
          <span className="w-2.5 h-2.5 rounded-full bg-fuchsia-500/80" /> Right Pinky
        </span>
      </div>
    </div>
  );
}
