'use client';

import React, { useState, useEffect } from 'react';

interface OnlyTypingKeyboardProps {
  activeChar?: string;
}

export default function OnlyTypingKeyboard({ activeChar = '' }: OnlyTypingKeyboardProps) {
  const [pressedKey, setPressedKey] = useState<string>('');

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      setPressedKey(e.key.toLowerCase());
    };
    const handleKeyUp = () => {
      setPressedKey('');
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, []);

  const keyboardRows = [
    ['`', '1', '2', '3', '4', '5', '6', '7', '8', '9', '0', '-', '=', '⌫'],
    ['tab', 'q', 'w', 'e', 'r', 't', 'y', 'u', 'i', 'o', 'p', '[', ']', '\\'],
    ['caps', 'a', 's', 'd', 'f', 'g', 'h', 'j', 'k', 'l', ';', "'", 'enter'],
    ['shift', 'z', 'x', 'c', 'v', 'b', 'n', 'm', ',', '.', '/', 'shift'],
    ['space'],
  ];

  const isCurrentActive = (key: string) => {
    if (key === 'space' && (activeChar === ' ' || pressedKey === ' ')) return true;
    if (pressedKey && pressedKey === key.toLowerCase()) return true;
    if (activeChar && activeChar.toLowerCase() === key.toLowerCase()) return true;
    return false;
  };

  const getKeyWidth = (key: string) => {
    switch (key) {
      case 'space':
        return 'w-64 h-10';
      case '⌫':
      case 'backspace':
        return 'w-14 h-9';
      case 'tab':
      case '\\':
        return 'w-13 h-9';
      case 'caps':
      case 'enter':
        return 'w-14 h-9';
      case 'shift':
        return 'w-16 h-9';
      default:
        return 'w-9 h-9';
    }
  };

  return (
    <div className="w-full flex flex-col items-center justify-center p-5 bg-[#FFF5F1]/85 rounded-[32px] border border-[#FDE5DC] select-none shadow-[0_2px_12px_rgba(255,184,165,0.08)] max-w-2xl mx-auto">
      <div className="space-y-1.5 w-full flex flex-col items-center">
        {keyboardRows.map((row, rowIdx) => (
          <div key={rowIdx} className="flex justify-center gap-1.5">
            {row.map((key, keyIdx) => {
              const isActive = isCurrentActive(key);
              const isShift = key === 'shift';
              const isSpace = key === 'space';

              let keyStyle =
                'bg-white text-[#7A645C] border-[#F6E4DC] hover:border-[#FF5E3A]/40 shadow-[0_2px_4px_rgba(158,119,103,0.06)]';

              if (isActive) {
                keyStyle =
                  'bg-[#FF5E3A] text-white font-bold border-[#FF5E3A] shadow-[0_4px_12px_rgba(255,94,58,0.45)] scale-105';
              } else if (isShift) {
                keyStyle =
                  'bg-[#FFB8A5] text-white font-semibold border-transparent shadow-[0_2px_4px_rgba(255,184,165,0.2)]';
              } else if (isSpace) {
                keyStyle =
                  'bg-white text-transparent border-[#F6E4DC] shadow-[0_2px_4px_rgba(158,119,103,0.06)] rounded-2xl';
              }

              return (
                <div
                  key={`${rowIdx}-${keyIdx}-${key}`}
                  className={`${getKeyWidth(
                    key
                  )} ${keyStyle} rounded-xl border text-[11px] font-sans flex items-center justify-center transition-all duration-100 relative`}
                >
                  <span className="leading-none">{key === 'space' ? '' : key}</span>

                  {/* Tactile indexing bumps on f and j */}
                  {(key === 'f' || key === 'j') && !isActive && (
                    <span className="absolute bottom-1.5 w-2.5 h-[1.5px] bg-[#9E7767] rounded-full" />
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
