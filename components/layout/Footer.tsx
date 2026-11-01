import React from 'react';
import Link from 'next/link';
import { Keyboard } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="w-full border-t border-border bg-white mt-auto py-6">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-[#8A94A6]">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-lg bg-[#FF5E3A] flex items-center justify-center text-white font-bold text-[10px]">
            ST
          </div>
          <span className="font-semibold text-[#1E232E]">SirojbekTyping</span>
          <span>— Precision typing speed & education</span>
        </div>

        <div className="flex items-center gap-6 text-xs">
          <Link href="/lessons" className="hover:text-[#FF5E3A] transition-colors">
            Lessons
          </Link>
          <Link href="/practice" className="hover:text-[#FF5E3A] transition-colors">
            Practice
          </Link>
          <Link href="/games" className="hover:text-[#FF5E3A] transition-colors">
            Games
          </Link>
          <Link href="/leaderboard" className="hover:text-[#FF5E3A] transition-colors">
            Leaderboard
          </Link>
          <Link href="/dashboard" className="hover:text-[#FF5E3A] transition-colors">
            Analytics
          </Link>
        </div>

        <div>
          <span>Tab + Enter to restart</span>
        </div>
      </div>
    </footer>
  );
}
