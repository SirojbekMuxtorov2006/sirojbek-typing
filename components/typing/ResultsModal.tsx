'use client';

import React, { useState } from 'react';
import {
  RotateCcw,
  ArrowRight,
  Copy,
  Check,
  Zap,
  Target,
  Activity,
} from 'lucide-react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from 'recharts';
import KeyboardHeatmap from './KeyboardHeatmap';
import { TypingResultPayload } from '@/lib/store';
import confetti from 'canvas-confetti';

interface ResultsModalProps {
  result: TypingResultPayload;
  onRetry: () => void;
  onNewTest: () => void;
}

export default function ResultsModal({ result, onRetry, onNewTest }: ResultsModalProps) {
  const [copied, setCopied] = useState(false);

  React.useEffect(() => {
    if (result.wpm >= 50) {
      confetti({
        particleCount: 75,
        spread: 60,
        origin: { y: 0.6 },
        colors: ['#FF5E3A', '#27AE60', '#FFF0EA'],
      });
    }
  }, [result.wpm]);

  const sortedMistakes = Object.entries(result.mistakeDetails || {})
    .sort(([, a], [, b]) => b - a)
    .slice(0, 5);

  const handleCopy = () => {
    const summary = `⚡ SirojbekTyping Results\nSpeed: ${result.wpm} WPM (Raw: ${result.rawWpm})\nAccuracy: ${result.accuracy}%\nConsistency: ${result.consistency}%\nMode: ${result.mode} (${result.duration}s)\nhttps://sirojbektyping.com`;
    navigator.clipboard.writeText(summary);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  return (
    <div className="w-full max-w-4xl mx-auto my-4 p-6 sm:p-8 rounded-3xl bg-white border border-border shadow-xl animate-in fade-in zoom-in-95 duration-200">
      {/* Top Header Metrics Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
        {/* WPM Primary */}
        <div className="p-4 rounded-2xl bg-[#FFF6F2] border border-[#FFD7CC] relative overflow-hidden group">
          <span className="text-xs font-mono uppercase tracking-wider text-[#8A94A6]">
            Net WPM
          </span>
          <div className="text-4xl sm:text-5xl font-bold text-[#FF5E3A] mt-1">
            {result.wpm}
          </div>
          <span className="text-[11px] text-[#8A94A6] mt-1 block">
            Raw: <span className="text-[#1E232E] font-bold">{result.rawWpm}</span>
          </span>
        </div>

        {/* Accuracy */}
        <div className="p-4 rounded-2xl bg-[#F0FAF4] border border-[#C6EFDC] relative overflow-hidden group">
          <span className="text-xs font-mono uppercase tracking-wider text-[#8A94A6]">
            Accuracy
          </span>
          <div className="text-4xl sm:text-5xl font-bold text-[#27AE60] mt-1">
            {result.accuracy}%
          </div>
          <span className="text-[11px] text-[#8A94A6] mt-1 block">
            Errors: <span className="text-[#EB5757] font-bold">{result.errorCount}</span>
          </span>
        </div>

        {/* Consistency */}
        <div className="p-4 rounded-2xl bg-[#F8F9FA] border border-border relative overflow-hidden group">
          <span className="text-xs font-mono uppercase tracking-wider text-[#8A94A6]">
            Consistency
          </span>
          <div className="text-4xl sm:text-5xl font-bold text-[#1E232E] mt-1">
            {result.consistency}%
          </div>
          <span className="text-[11px] text-[#8A94A6] mt-1 block">Rhythm variance</span>
        </div>

        {/* Characters */}
        <div className="p-4 rounded-2xl bg-[#F8F9FA] border border-border relative overflow-hidden">
          <span className="text-xs font-mono uppercase tracking-wider text-[#8A94A6]">
            Characters
          </span>
          <div className="text-2xl sm:text-3xl font-bold text-[#1E232E] mt-1">
            <span className="text-[#27AE60]">{result.correctChars}</span> /{' '}
            <span className="text-[#EB5757]">{result.incorrectChars}</span>
          </div>
          <div className="text-[11px] text-[#8A94A6] mt-2 flex items-center justify-between">
            <span>Duration:</span>
            <span className="font-bold text-[#1E232E]">{result.duration}s</span>
          </div>
        </div>
      </div>

      {/* Speed Over Time Chart */}
      {result.timelineData && result.timelineData.length > 1 && (
        <div className="p-5 rounded-2xl bg-[#F8F9FA] border border-border mb-6">
          <div className="flex items-center justify-between mb-3 text-xs">
            <span className="font-mono text-[#8A94A6] uppercase tracking-wider">
              Speed & Precision Timeline
            </span>
            <div className="flex items-center gap-4 text-[11px] font-mono">
              <span className="flex items-center gap-1.5 text-[#FF5E3A]">
                <span className="w-2.5 h-2.5 rounded-full bg-[#FF5E3A] inline-block" /> WPM
              </span>
              <span className="flex items-center gap-1.5 text-[#8A94A6]">
                <span className="w-2.5 h-2.5 rounded-full bg-[#A4ADC0] inline-block" /> Raw WPM
              </span>
            </div>
          </div>

          <div className="h-44 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={result.timelineData} margin={{ top: 5, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#E8ECF2" vertical={false} />
                <XAxis dataKey="second" stroke="#8A94A6" fontSize={11} tickLine={false} tickFormatter={(v) => `${v}s`} />
                <YAxis stroke="#8A94A6" fontSize={11} tickLine={false} domain={[0, 'dataMax + 10']} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#FFFFFF',
                    borderColor: '#E8ECF2',
                    borderRadius: '12px',
                    boxShadow: '0 4px 14px rgba(0,0,0,0.06)',
                    fontSize: '12px',
                    color: '#1E232E',
                  }}
                />
                <Line
                  type="monotone"
                  dataKey="wpm"
                  stroke="#FF5E3A"
                  strokeWidth={3}
                  dot={false}
                  activeDot={{ r: 5, fill: '#FF5E3A' }}
                />
                <Line
                  type="monotone"
                  dataKey="rawWpm"
                  stroke="#A4ADC0"
                  strokeWidth={1.5}
                  strokeDasharray="4 4"
                  dot={false}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}

      {/* Action Buttons Bar */}
      <div className="flex flex-wrap items-center justify-between gap-4 pt-4 border-t border-border">
        <div className="flex items-center gap-3">
          <button
            onClick={onRetry}
            className="flex items-center gap-2 px-6 py-3 rounded-full bg-[#FF5E3A] text-white font-bold text-xs shadow-coral hover:bg-[#FF471D] transition-transform active:scale-95"
          >
            <RotateCcw className="w-4 h-4" />
            <span>Retry Test (Tab + Enter)</span>
          </button>

          <button
            onClick={onNewTest}
            className="flex items-center gap-2 px-5 py-3 rounded-full bg-white hover:bg-slate-50 border border-border text-xs font-semibold text-[#1E232E] transition-colors shadow-sm"
          >
            <span>Next Test</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        <button
          onClick={handleCopy}
          className="flex items-center gap-1.5 px-4 py-2.5 rounded-full bg-white hover:bg-slate-50 border border-border text-xs font-medium text-[#8A94A6] hover:text-[#1E232E] transition-colors shadow-sm"
        >
          {copied ? (
            <>
              <Check className="w-3.5 h-3.5 text-[#27AE60]" />
              <span className="text-[#27AE60] font-semibold">Copied!</span>
            </>
          ) : (
            <>
              <Copy className="w-3.5 h-3.5" />
              <span>Copy Summary</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
}
