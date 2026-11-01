import React from 'react';
import Link from 'next/link';
import { Github, Twitter, Heart, Keyboard, Shield } from 'lucide-react';
import Logo from '@/components/ui/Logo';

export default function Footer() {
  return (
    <footer className="w-full border-t border-border bg-secondary-bg/50 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          {/* Brand Col */}
          <div className="space-y-3">
            <Logo size="sm" showSubtitle={true} />
            <p className="text-xs text-text-secondary leading-relaxed">
              Precision typing speed tests, touch typing curriculum, and competitive training built for programmers and speed typists.
            </p>
          </div>

          {/* Shortcuts Col */}
          <div className="space-y-2">
            <h4 className="text-xs font-mono font-semibold uppercase tracking-wider text-text-muted">
              Key Shortcuts
            </h4>
            <div className="space-y-1.5 text-xs text-text-secondary font-mono">
              <div className="flex items-center justify-between">
                <span>Restart Test</span>
                <span className="px-1.5 py-0.5 rounded bg-card-bg border border-border text-[11px] text-accent">
                  Tab + Enter
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span>Quick Restart</span>
                <span className="px-1.5 py-0.5 rounded bg-card-bg border border-border text-[11px] text-text-primary">
                  Esc
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span>Toggle Sound</span>
                <span className="px-1.5 py-0.5 rounded bg-card-bg border border-border text-[11px] text-text-primary">
                  Ctrl + M
                </span>
              </div>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-2">
            <h4 className="text-xs font-mono font-semibold uppercase tracking-wider text-text-muted">
              Platform
            </h4>
            <ul className="space-y-1 text-xs text-text-secondary">
              <li>
                <Link href="/lessons" className="hover:text-accent transition-colors">
                  Touch Typing Lessons
                </Link>
              </li>
              <li>
                <Link href="/practice" className="hover:text-accent transition-colors">
                  Weak-Key Training
                </Link>
              </li>
              <li>
                <Link href="/games" className="hover:text-accent transition-colors">
                  Arcade Typing Games
                </Link>
              </li>
              <li>
                <Link href="/leaderboard" className="hover:text-accent transition-colors">
                  Global Leaderboard
                </Link>
              </li>
            </ul>
          </div>

          {/* Legal & Status */}
          <div className="space-y-2">
            <h4 className="text-xs font-mono font-semibold uppercase tracking-wider text-text-muted">
              Architecture
            </h4>
            <p className="text-xs text-text-secondary leading-relaxed">
              Built with Next.js App Router, Tailwind CSS, Prisma ORM, and Web Audio API engine. Anti-cheat verified.
            </p>
            <div className="flex items-center gap-2 pt-1 text-[11px] text-success">
              <span className="w-2 h-2 rounded-full bg-success animate-pulse" />
              <span>Engine Status: Operational (100% Client-side Accuracy)</span>
            </div>
          </div>
        </div>

        <div className="pt-6 border-t border-border flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-text-muted">
          <p>© {new Date().getFullYear()} SirojbekTyping. Designed for ultimate typing flow.</p>
          <div className="flex items-center gap-4">
            <span className="text-text-secondary">English • O&apos;zbek • Русский</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
