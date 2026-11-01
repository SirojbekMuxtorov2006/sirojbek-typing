'use client';

import React from 'react';
import { Clock, Type, Quote, Hash, AtSign, Settings2, Sparkles, Feather } from 'lucide-react';
import { useAppStore } from '@/lib/store';

interface TestSettingsBarProps {
  onRestart: () => void;
  disabled?: boolean;
}

export default function TestSettingsBar({ onRestart, disabled = false }: TestSettingsBarProps) {
  const {
    settings,
    setMode,
    setDuration,
    setWordCount,
    togglePunctuation,
    toggleNumbers,
  } = useAppStore();

  const handleModeChange = (mode: typeof settings.mode) => {
    if (disabled) return;
    setMode(mode);
    onRestart();
  };

  const handleDurationChange = (dur: number) => {
    if (disabled) return;
    setDuration(dur);
    onRestart();
  };

  const handleWordCountChange = (count: number) => {
    if (disabled) return;
    setWordCount(count);
    onRestart();
  };

  return (
    <div className="flex flex-wrap items-center justify-center gap-1.5 p-1.5 rounded-xl bg-secondary-bg/80 border border-border text-xs text-text-secondary select-none shadow-sm backdrop-blur-sm">
      {/* Modes */}
      <div className="flex items-center space-x-1 pr-2 border-r border-border/80">
        <button
          onClick={togglePunctuation}
          className={`flex items-center gap-1 px-2.5 py-1 rounded-lg transition-colors ${
            settings.punctuation
              ? 'text-accent bg-accent-muted font-medium'
              : 'hover:text-text-primary hover:bg-card-bg'
          }`}
          title="Toggle punctuation"
        >
          <AtSign className="w-3.5 h-3.5" />
          <span>punctuation</span>
        </button>

        <button
          onClick={toggleNumbers}
          className={`flex items-center gap-1 px-2.5 py-1 rounded-lg transition-colors ${
            settings.numbers
              ? 'text-accent bg-accent-muted font-medium'
              : 'hover:text-text-primary hover:bg-card-bg'
          }`}
          title="Toggle numbers"
        >
          <Hash className="w-3.5 h-3.5" />
          <span>numbers</span>
        </button>
      </div>

      {/* Main Mode Selectors */}
      <div className="flex items-center space-x-1 px-2">
        <button
          onClick={() => handleModeChange('time')}
          className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg transition-colors ${
            settings.mode === 'time'
              ? 'text-accent bg-accent-muted font-medium'
              : 'hover:text-text-primary hover:bg-card-bg'
          }`}
        >
          <Clock className="w-3.5 h-3.5" />
          <span>time</span>
        </button>

        <button
          onClick={() => handleModeChange('words')}
          className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg transition-colors ${
            settings.mode === 'words'
              ? 'text-accent bg-accent-muted font-medium'
              : 'hover:text-text-primary hover:bg-card-bg'
          }`}
        >
          <Type className="w-3.5 h-3.5" />
          <span>words</span>
        </button>

        <button
          onClick={() => handleModeChange('quote')}
          className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg transition-colors ${
            settings.mode === 'quote'
              ? 'text-accent bg-accent-muted font-medium'
              : 'hover:text-text-primary hover:bg-card-bg'
          }`}
        >
          <Quote className="w-3.5 h-3.5" />
          <span>quote</span>
        </button>

        <button
          onClick={() => handleModeChange('zen')}
          className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg transition-colors ${
            settings.mode === 'zen'
              ? 'text-accent bg-accent-muted font-medium'
              : 'hover:text-text-primary hover:bg-card-bg'
          }`}
          title="Zen mode (freeflow without timer pressure)"
        >
          <Feather className="w-3.5 h-3.5" />
          <span>zen</span>
        </button>

        <button
          onClick={() => handleModeChange('custom')}
          className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg transition-colors ${
            settings.mode === 'custom'
              ? 'text-accent bg-accent-muted font-medium'
              : 'hover:text-text-primary hover:bg-card-bg'
          }`}
        >
          <Settings2 className="w-3.5 h-3.5" />
          <span>custom</span>
        </button>
      </div>

      {/* Sub-options based on mode */}
      {settings.mode === 'time' && (
        <div className="flex items-center space-x-1 pl-2 border-l border-border/80 font-mono">
          {[15, 30, 60, 120].map((dur) => (
            <button
              key={dur}
              onClick={() => handleDurationChange(dur)}
              className={`px-2 py-0.5 rounded-md transition-colors ${
                settings.duration === dur
                  ? 'text-accent bg-accent-muted font-bold'
                  : 'hover:text-text-primary hover:bg-card-bg'
              }`}
            >
              {dur}
            </button>
          ))}
        </div>
      )}

      {settings.mode === 'words' && (
        <div className="flex items-center space-x-1 pl-2 border-l border-border/80 font-mono">
          {[10, 25, 50, 100].map((count) => (
            <button
              key={count}
              onClick={() => handleWordCountChange(count)}
              className={`px-2 py-0.5 rounded-md transition-colors ${
                settings.wordCount === count
                  ? 'text-accent bg-accent-muted font-bold'
                  : 'hover:text-text-primary hover:bg-card-bg'
              }`}
            >
              {count}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
