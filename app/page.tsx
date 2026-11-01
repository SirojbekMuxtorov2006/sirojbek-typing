'use client';

import React from 'react';
import TypingTest from '@/components/typing/TypingTest';
import { Zap, Award, Flame, BookOpen, Target, Gamepad2, Trophy } from 'lucide-react';
import Link from 'next/link';

export default function HomePage() {
  return (
    <div className="w-full flex-1 flex flex-col items-center justify-between px-4 sm:px-6 lg:px-8 py-8 sm:py-12 max-w-7xl mx-auto">
      {/* Hero Header */}
      <div className="text-center max-w-3xl mx-auto mb-8 sm:mb-10 animate-in fade-in slide-in-from-top-4 duration-300">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-secondary-bg border border-border text-xs font-mono font-medium mb-4 shadow-sm">
          <span className="w-2 h-2 rounded-full bg-accent animate-pulse" />
          <span className="text-text-secondary">Precision Typing Engine v1.0</span>
          <span className="text-border">•</span>
          <span className="text-accent">Zero Latency Web Audio</span>
        </div>

        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-text-primary mb-3">
          Master Your <span className="text-accent underline decoration-accent/40 decoration-wavy decoration-2">Typing Speed</span>.
        </h1>

        <p className="text-sm sm:text-base text-text-secondary max-w-xl mx-auto leading-relaxed">
          Improve your typing speed, accuracy, and productivity with <strong className="text-text-primary font-medium">SirojbekTyping</strong>. Practice touch typing, test your limits, and climb the leaderboard.
        </p>
      </div>

      {/* Main Interactive Typing Test */}
      <div className="w-full mb-16 animate-in fade-in zoom-in-95 duration-300">
        <TypingTest />
      </div>

      {/* Feature Highlights Grid */}
      <div className="w-full grid grid-cols-1 md:grid-cols-3 gap-6 pt-8 border-t border-border/80">
        <Link
          href="/lessons"
          className="p-6 rounded-2xl bg-secondary-bg/80 border border-border hover:border-accent/50 transition-all group flex flex-col justify-between"
        >
          <div>
            <div className="p-3 rounded-xl bg-card-bg w-fit text-accent mb-4 group-hover:scale-105 transition-transform">
              <BookOpen className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-text-primary mb-1">
              Touch Typing Curriculum
            </h3>
            <p className="text-xs text-text-secondary leading-relaxed">
              12 structured lessons from home row fundamentals to professional mastery with interactive finger guides.
            </p>
          </div>
          <span className="text-xs font-mono text-accent mt-4 inline-flex items-center gap-1 group-hover:translate-x-1 transition-transform">
            Explore Lessons →
          </span>
        </Link>

        <Link
          href="/practice"
          className="p-6 rounded-2xl bg-secondary-bg/80 border border-border hover:border-accent/50 transition-all group flex flex-col justify-between"
        >
          <div>
            <div className="p-3 rounded-xl bg-card-bg w-fit text-success mb-4 group-hover:scale-105 transition-transform">
              <Target className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-text-primary mb-1">
              Adaptive Practice Center
            </h3>
            <p className="text-xs text-text-secondary leading-relaxed">
              Train your weakest keys automatically, type programming syntax in JS/Python/Rust, or practice Uzbek and Russian texts.
            </p>
          </div>
          <span className="text-xs font-mono text-success mt-4 inline-flex items-center gap-1 group-hover:translate-x-1 transition-transform">
            Start Practice →
          </span>
        </Link>

        <Link
          href="/games"
          className="p-6 rounded-2xl bg-secondary-bg/80 border border-border hover:border-accent/50 transition-all group flex flex-col justify-between"
        >
          <div>
            <div className="p-3 rounded-xl bg-card-bg w-fit text-text-primary mb-4 group-hover:scale-105 transition-transform">
              <Gamepad2 className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-text-primary mb-1">
              Arcade Typing Games
            </h3>
            <p className="text-xs text-text-secondary leading-relaxed">
              Defend your starship in Space Typist or survive falling word cascades in Word Rush with sound effects and combos.
            </p>
          </div>
          <span className="text-xs font-mono text-text-primary mt-4 inline-flex items-center gap-1 group-hover:translate-x-1 transition-transform">
            Play Games →
          </span>
        </Link>
      </div>
    </div>
  );
}
