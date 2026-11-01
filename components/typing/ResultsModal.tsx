'use client';

import React, { useState } from 'react';
import {
  RotateCcw,
  ArrowRight,
  Share2,
  Copy,
  Check,
  Download,
  Flame,
  Award,
  Target,
  Zap,
  Activity,
  AlertCircle,
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

  // Trigger celebration confetti if speed is solid
  React.useEffect(() => {
    if (result.wpm >= 60) {
      confetti({
        particleCount: 80,
        spread: 60,
        origin: { y: 0.6 },
        colors: ['#E8B44F', '#42C98A', '#F5F5F5'],
      });
    }
  }, [result.wpm]);

  // Compute most frequently mistyped keys
  const sortedMistakes = Object.entries(result.mistakeDetails || {})
    .sort(([, a], [, b]) => b - a)
    .slice(0, 5);

  const handleCopy = () => {
    const summary = `⚡ SirojbekTyping Test Results\nSpeed: ${result.wpm} WPM (Raw: ${result.rawWpm})\nAccuracy: ${result.accuracy}%\nConsistency: ${result.consistency}%\nTest: ${result.mode} (${result.duration}s)\nhttps://sirojbektyping.com`;
    navigator.clipboard.writeText(summary);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  return (
    <div className="w-full max-w-4xl mx-auto my-4 p-6 sm:p-8 rounded-2xl bg-secondary-bg/95 border border-border shadow-2xl backdrop-blur-md animate-in fade-in zoom-in-95 duration-200">
      {/* Top Header Metrics Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
        {/* WPM Primary */}
        <div className="p-4 rounded-xl bg-card-bg border border-border relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-3 opacity-10 group-hover:opacity-20 transition-opacity">
            <Zap className="w-12 h-12 text-accent" />
          </div>
          <span className="text-xs font-mono uppercase tracking-wider text-text-muted">
            Net WPM
          </span>
          <div className="text-4xl sm:text-5xl font-mono font-bold text-accent mt-1">
            {result.wpm}
          </div>
          <span className="text-[11px] text-text-secondary mt-1 block">
            Raw: <span className="text-text-primary font-mono">{result.rawWpm}</span>
          </span>
        </div>

        {/* Accuracy */}
        <div className="p-4 rounded-xl bg-card-bg border border-border relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-3 opacity-10 group-hover:opacity-20 transition-opacity">
            <Target className="w-12 h-12 text-success" />
          </div>
          <span className="text-xs font-mono uppercase tracking-wider text-text-muted">
            Accuracy
          </span>
          <div className="text-4xl sm:text-5xl font-mono font-bold text-success mt-1">
            {result.accuracy}%
          </div>
          <span className="text-[11px] text-text-secondary mt-1 block">
            Errors: <span className="text-error font-mono">{result.errorCount}</span>
          </span>
        </div>

        {/* Consistency */}
        <div className="p-4 rounded-xl bg-card-bg border border-border relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-3 opacity-10 group-hover:opacity-20 transition-opacity">
            <Activity className="w-12 h-12 text-text-primary" />
          </div>
          <span className="text-xs font-mono uppercase tracking-wider text-text-muted">
            Consistency
          </span>
          <div className="text-4xl sm:text-5xl font-mono font-bold text-text-primary mt-1">
            {result.consistency}%
          </div>
          <span className="text-[11px] text-text-secondary mt-1 block">Smooth pacing</span>
        </div>

        {/* Test Details */}
        <div className="p-4 rounded-xl bg-card-bg border border-border relative overflow-hidden">
          <span className="text-xs font-mono uppercase tracking-wider text-text-muted">
            Characters
          </span>
          <div className="text-2xl sm:text-3xl font-mono font-bold text-text-primary mt-1">
            <span className="text-success">{result.correctChars}</span> /{' '}
            <span className="text-error">{result.incorrectChars}</span>
          </div>
          <div className="text-[11px] text-text-secondary mt-2 flex items-center justify-between">
            <span>Duration:</span>
            <span className="font-mono text-text-primary">{result.duration}s</span>
          </div>
        </div>
      </div>

      {/* Speed Over Time Chart */}
      {result.timelineData && result.timelineData.length > 1 && (
        <div className="p-4 rounded-xl bg-card-bg border border-border mb-6">
          <div className="flex items-center justify-between mb-3 text-xs">
            <span className="font-mono text-text-muted uppercase tracking-wider">
              Speed & Precision Timeline
            </span>
            <div className="flex items-center gap-4 text-[11px] font-mono">
              <span className="flex items-center gap-1.5 text-accent">
                <span className="w-2.5 h-2.5 rounded-full bg-accent inline-block" /> WPM
              </span>
              <span className="flex items-center gap-1.5 text-text-muted">
                <span className="w-2.5 h-2.5 rounded-full bg-text-muted inline-block" /> Raw WPM
              </span>
              <span className="flex items-center gap-1.5 text-error">
                <span className="w-2 h-2 rounded-full bg-error inline-block" /> Errors
              </span>
            </div>
          </div>

          <div className="h-48 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={result.timelineData} margin={{ top: 5, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#272B37" vertical={false} />
                <XAxis
                  dataKey="second"
                  stroke="#5F6575"
                  fontSize={11}
                  tickLine={false}
                  tickFormatter={(val) => `${val}s`}
                />
                <YAxis stroke="#5F6575" fontSize={11} tickLine={false} domain={[0, 'dataMax + 15']} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#181A20',
                    borderColor: '#272B37',
                    borderRadius: '8px',
                    fontSize: '12px',
                    color: '#F5F5F5',
                  }}
                  itemStyle={{ padding: '1px 0' }}
                />
                <Line
                  type="monotone"
                  dataKey="wpm"
                  stroke="#E8B44F"
                  strokeWidth={2.5}
                  dot={false}
                  activeDot={{ r: 5, fill: '#E8B44F' }}
                />
                <Line
                  type="monotone"
                  dataKey="rawWpm"
                  stroke="#5F6575"
                  strokeWidth={1.5}
                  strokeDasharray="4 4"
                  dot={false}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}

      {/* Weak Keys & Heatmap */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        <div className="lg:col-span-2">
          <KeyboardHeatmap mistakeMap={result.mistakeDetails || {}} />
        </div>

        <div className="p-4 rounded-xl bg-card-bg border border-border flex flex-col justify-between">
          <div>
            <span className="text-xs font-mono uppercase tracking-wider text-text-muted block mb-3">
              Most Mistyped Keys
            </span>

            {sortedMistakes.length > 0 ? (
              <div className="space-y-2">
                {sortedMistakes.map(([key, count]) => (
                  <div
                    key={key}
                    className="flex items-center justify-between p-2 rounded-lg bg-secondary-bg border border-border/80 text-xs font-mono"
                  >
                    <div className="flex items-center gap-2">
                      <span className="w-6 h-6 rounded bg-card-bg border border-border flex items-center justify-center font-bold text-accent">
                        {key.toUpperCase()}
                      </span>
                      <span className="text-text-secondary">Key</span>
                    </div>
                    <span className="text-error font-semibold">
                      {count} miss{count > 1 ? 'es' : ''}
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center h-28 text-center text-xs text-success">
                <Check className="w-8 h-8 mb-1" />
                <span>Zero key misses! Clean run.</span>
              </div>
            )}
          </div>

          <div className="mt-4 pt-3 border-t border-border/80 text-[11px] text-text-muted">
            Tip: Practice your weak keys in the{' '}
            <a href="/practice" className="text-accent underline">
              Practice Center
            </a>
            .
          </div>
        </div>
      </div>

      {/* Action Buttons Bar */}
      <div className="flex flex-wrap items-center justify-between gap-4 pt-4 border-t border-border">
        <div className="flex items-center gap-2">
          <button
            onClick={onRetry}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-accent text-background font-semibold text-sm hover:bg-accent-hover transition-colors shadow-sm"
          >
            <RotateCcw className="w-4 h-4" />
            <span>Retry Test (Tab + Enter)</span>
          </button>

          <button
            onClick={onNewTest}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-card-bg hover:bg-elevated-bg border border-border text-sm text-text-primary transition-colors"
          >
            <span>Next Words</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleCopy}
            className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-secondary-bg hover:bg-card-bg border border-border text-xs text-text-secondary hover:text-text-primary transition-colors"
          >
            {copied ? (
              <>
                <Check className="w-3.5 h-3.5 text-success" />
                <span className="text-success">Copied!</span>
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
    </div>
  );
}
