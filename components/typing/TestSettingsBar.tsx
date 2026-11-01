'use client';

import React, { useState } from 'react';
import { ChevronDown, Globe } from 'lucide-react';
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
    setLanguage,
  } = useAppStore();

  const [moreMenuOpen, setMoreMenuOpen] = useState(false);
  const [langMenuOpen, setLangMenuOpen] = useState(false);

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
    <div className="w-full flex flex-wrap items-center justify-center gap-2 select-none font-sans text-xs">
      {/* Pill 1: @ punctuation and # numbers */}
      <div className="flex items-center bg-white px-3 py-1.5 rounded-full border border-border shadow-[0_2px_8px_rgba(0,0,0,0.03)] gap-3">
        <button
          onClick={togglePunctuation}
          className={`flex items-center gap-1.5 transition-colors ${
            settings.punctuation
              ? 'text-[#FF5E3A] font-bold'
              : 'text-[#8A94A6] hover:text-[#1E232E]'
          }`}
        >
          <span>@ punctuation</span>
          <span
            className={`w-1.5 h-1.5 rounded-full ${
              settings.punctuation ? 'bg-[#FF5E3A]' : 'bg-[#D0D7E2]'
            }`}
          />
        </button>

        <button
          onClick={toggleNumbers}
          className={`flex items-center gap-1.5 transition-colors ${
            settings.numbers
              ? 'text-[#FF5E3A] font-bold'
              : 'text-[#8A94A6] hover:text-[#1E232E]'
          }`}
        >
          <span># numbers</span>
          <span
            className={`w-1.5 h-1.5 rounded-full ${
              settings.numbers ? 'bg-[#FF5E3A]' : 'bg-[#D0D7E2]'
            }`}
          />
        </button>
      </div>

      {/* Pill 2: 15s 30s 60s T words ... more ⌄ */}
      <div className="flex items-center bg-white px-2 py-1.5 rounded-full border border-border shadow-[0_2px_8px_rgba(0,0,0,0.03)] gap-1">
        {[15, 30, 60].map((dur) => (
          <button
            key={dur}
            onClick={() => {
              if (settings.mode !== 'time') setMode('time');
              handleDurationChange(dur);
            }}
            className={`px-2.5 py-1 rounded-full font-semibold transition-colors ${
              settings.mode === 'time' && settings.duration === dur
                ? 'bg-[#FFE8DF] text-[#FF5E3A] font-bold shadow-sm'
                : 'text-[#8A94A6] hover:text-[#1E232E]'
            }`}
          >
            {dur}s
          </button>
        ))}

        {/* T words */}
        <button
          onClick={() => handleModeChange('words')}
          className={`flex items-center gap-1 px-3 py-1 rounded-full font-semibold transition-colors ${
            settings.mode === 'words'
              ? 'bg-[#FFE8DF] text-[#FF5E3A] font-bold shadow-sm'
              : 'text-[#8A94A6] hover:text-[#1E232E]'
          }`}
        >
          <span className="font-serif text-[11px] font-bold px-0.5">T</span>
          <span>words</span>
        </button>

        {/* More dropdown */}
        <div className="relative">
          <button
            onClick={() => setMoreMenuOpen(!moreMenuOpen)}
            className={`flex items-center gap-1 px-2.5 py-1 rounded-full transition-colors ${
              ['quote', 'zen', 'custom'].includes(settings.mode)
                ? 'bg-[#FFE8DF] text-[#FF5E3A] font-bold'
                : 'text-[#8A94A6] hover:text-[#1E232E]'
            }`}
          >
            <span>... more</span>
            <ChevronDown className="w-3 h-3" />
          </button>

          {moreMenuOpen && (
            <div
              className="absolute left-0 mt-2 w-32 bg-white rounded-2xl border border-border shadow-xl py-1 z-50 animate-in fade-in"
              onMouseLeave={() => setMoreMenuOpen(false)}
            >
              <button
                onClick={() => {
                  handleModeChange('quote');
                  setMoreMenuOpen(false);
                }}
                className={`w-full px-3 py-1.5 text-left text-xs font-semibold ${
                  settings.mode === 'quote' ? 'text-[#FF5E3A] bg-[#FFE8DF]' : 'text-[#8A94A6] hover:bg-slate-50'
                }`}
              >
                Quote
              </button>
              <button
                onClick={() => {
                  handleModeChange('zen');
                  setMoreMenuOpen(false);
                }}
                className={`w-full px-3 py-1.5 text-left text-xs font-semibold ${
                  settings.mode === 'zen' ? 'text-[#FF5E3A] bg-[#FFE8DF]' : 'text-[#8A94A6] hover:bg-slate-50'
                }`}
              >
                Zen Mode
              </button>
              <button
                onClick={() => {
                  handleModeChange('custom');
                  setMoreMenuOpen(false);
                }}
                className={`w-full px-3 py-1.5 text-left text-xs font-semibold ${
                  settings.mode === 'custom' ? 'text-[#FF5E3A] bg-[#FFE8DF]' : 'text-[#8A94A6] hover:bg-slate-50'
                }`}
              >
                Custom Text
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Pill 3: Word count 10 25 50 100 */}
      <div className="flex items-center bg-white px-2 py-1.5 rounded-full border border-border shadow-[0_2px_8px_rgba(0,0,0,0.03)] gap-1">
        {[10, 25, 50, 100].map((count) => (
          <button
            key={count}
            onClick={() => handleWordCountChange(count)}
            className={`px-2.5 py-1 rounded-full font-semibold transition-colors ${
              settings.wordCount === count
                ? 'bg-[#FFE8DF] text-[#FF5E3A] font-bold shadow-sm'
                : 'text-[#8A94A6] hover:text-[#1E232E]'
            }`}
          >
            {count}
          </button>
        ))}
      </div>

      {/* Pill 4: English 200 / Language */}
      <div className="relative">
        <button
          onClick={() => setLangMenuOpen(!langMenuOpen)}
          className="flex items-center gap-1.5 bg-white px-3.5 py-1.5 rounded-full border border-border shadow-[0_2px_8px_rgba(0,0,0,0.03)] text-[#8A94A6] hover:text-[#1E232E] font-medium transition-colors"
        >
          <Globe className="w-3.5 h-3.5" />
          <span>
            {settings.language === 'en'
              ? 'english 200'
              : settings.language === 'uz'
              ? 'oʻzbekcha'
              : 'русский'}
          </span>
        </button>

        {langMenuOpen && (
          <div
            className="absolute right-0 mt-2 w-36 bg-white rounded-2xl border border-border shadow-xl py-1.5 z-50 animate-in fade-in"
            onMouseLeave={() => setLangMenuOpen(false)}
          >
            <button
              onClick={() => {
                setLanguage('en');
                setLangMenuOpen(false);
                onRestart();
              }}
              className="w-full px-3 py-1.5 text-left text-xs font-semibold text-[#8A94A6] hover:bg-slate-50 hover:text-[#1E232E]"
            >
              English 200
            </button>
            <button
              onClick={() => {
                setLanguage('uz');
                setLangMenuOpen(false);
                onRestart();
              }}
              className="w-full px-3 py-1.5 text-left text-xs font-semibold text-[#8A94A6] hover:bg-slate-50 hover:text-[#1E232E]"
            >
              O&apos;zbekcha (Lotin)
            </button>
            <button
              onClick={() => {
                setLanguage('ru');
                setLangMenuOpen(false);
                onRestart();
              }}
              className="w-full px-3 py-1.5 text-left text-xs font-semibold text-[#8A94A6] hover:bg-slate-50 hover:text-[#1E232E]"
            >
              Русский
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
