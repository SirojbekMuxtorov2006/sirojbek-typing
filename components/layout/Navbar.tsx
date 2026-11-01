'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useSession, signOut } from 'next-auth/react';
import {
  Keyboard,
  Sprout,
  Flag,
  Gamepad2,
  BarChart2,
  LineChart,
  Volume2,
  VolumeX,
  Search,
  Link as LinkIcon,
  User,
  Shield,
  LogOut,
} from 'lucide-react';
import { useAppStore } from '@/lib/store';

export default function Navbar() {
  const pathname = usePathname();
  const { data: session } = useSession();
  const [langMenuOpen, setLangMenuOpen] = useState(false);

  const { settings, setLanguage, isMuted, toggleMute, soundTheme, setSoundTheme } = useAppStore();

  const handleSoundCycle = () => {
    if (isMuted) {
      toggleMute();
    } else {
      const themes: Array<'mechanical' | 'click' | 'beep' | 'off'> = ['mechanical', 'click', 'beep', 'off'];
      const currentIndex = themes.indexOf(soundTheme);
      const nextTheme = themes[(currentIndex + 1) % themes.length];
      setSoundTheme(nextTheme);
    }
  };

  const userRole = (session?.user as unknown as { role?: string })?.role;

  return (
    <header className="w-full pt-4 pb-3 px-6 sm:px-12 flex items-center justify-between max-w-[1540px] mx-auto select-none">
      {/* Brand Logo - SirojbekTyping */}
      <Link href="/" className="flex items-center gap-2.5 group focus:outline-none">
        {/* Coral badge with white inner rounded square icon */}
        <div className="w-10 h-10 rounded-2xl bg-[#FF5E3A] flex items-center justify-center text-white font-bold text-base shadow-[0_4px_14px_rgba(255,94,58,0.35)] transition-transform group-hover:scale-105">
          <div className="w-5 h-5 rounded-md border-2 border-white flex items-center justify-center text-[10px] font-sans font-extrabold leading-none uppercase">
            st
          </div>
        </div>
        <div className="flex items-center">
          <span className="font-extrabold text-[22px] tracking-tight text-[#FF5E3A] font-sans">
            sirojbektyping
          </span>
        </div>
      </Link>

      {/* Center Floating Capsule Pill Dock - 100% matched */}
      <nav className="hidden md:flex items-center gap-1.5 bg-white px-2 py-1.5 rounded-full border border-[#EBEFF5] shadow-[0_2px_12px_rgba(0,0,0,0.04)]">
        {/* Type button (Active highlighted pill) */}
        <Link
          href="/"
          className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-bold transition-all ${
            pathname === '/'
              ? 'bg-[#FFE8DF] text-[#FF5E3A] shadow-sm'
              : 'text-[#8A94A6] hover:text-[#1E232E] hover:bg-slate-50'
          }`}
        >
          <Keyboard className="w-4 h-4" />
          <span>type</span>
        </Link>

        {/* Sprout / Lessons */}
        <Link
          href="/lessons"
          title="Touch Typing Lessons"
          className={`p-2 rounded-full text-xs transition-colors ${
            pathname.startsWith('/lessons')
              ? 'bg-[#FFE8DF] text-[#FF5E3A]'
              : 'text-[#8A94A6] hover:text-[#1E232E] hover:bg-slate-50'
          }`}
        >
          <Sprout className="w-4 h-4" />
        </Link>

        {/* 文 (Languages / Vocabulary) */}
        <div className="relative">
          <button
            onClick={() => setLangMenuOpen(!langMenuOpen)}
            title="Language & Vocabulary"
            className={`p-2 rounded-full text-xs transition-colors ${
              pathname.startsWith('/practice')
                ? 'bg-[#FFE8DF] text-[#FF5E3A]'
                : 'text-[#8A94A6] hover:text-[#1E232E] hover:bg-slate-50'
            }`}
          >
            <span className="font-serif font-bold text-sm leading-none px-0.5">文</span>
          </button>

          {langMenuOpen && (
            <div
              className="absolute left-1/2 -translate-x-1/2 mt-2 w-36 bg-white rounded-2xl border border-[#E8ECF2] shadow-xl py-1.5 z-50 animate-in fade-in zoom-in-95"
              onMouseLeave={() => setLangMenuOpen(false)}
            >
              <button
                onClick={() => {
                  setLanguage('en');
                  setLangMenuOpen(false);
                }}
                className={`w-full px-3 py-1.5 text-left text-xs font-semibold flex items-center justify-between ${
                  settings.language === 'en' ? 'text-[#FF5E3A] bg-[#FFE8DF]' : 'text-[#8A94A6] hover:bg-slate-50'
                }`}
              >
                <span>English 200</span>
                <span className="text-[10px]">EN</span>
              </button>
              <button
                onClick={() => {
                  setLanguage('uz');
                  setLangMenuOpen(false);
                }}
                className={`w-full px-3 py-1.5 text-left text-xs font-semibold flex items-center justify-between ${
                  settings.language === 'uz' ? 'text-[#FF5E3A] bg-[#FFE8DF]' : 'text-[#8A94A6] hover:bg-slate-50'
                }`}
              >
                <span>O&apos;zbekcha</span>
                <span className="text-[10px]">UZ</span>
              </button>
              <button
                onClick={() => {
                  setLanguage('ru');
                  setLangMenuOpen(false);
                }}
                className={`w-full px-3 py-1.5 text-left text-xs font-semibold flex items-center justify-between ${
                  settings.language === 'ru' ? 'text-[#FF5E3A] bg-[#FFE8DF]' : 'text-[#8A94A6] hover:bg-slate-50'
                }`}
              >
                <span>Русский</span>
                <span className="text-[10px]">RU</span>
              </button>
            </div>
          )}
        </div>

        {/* Flag / Practice Target */}
        <Link
          href="/practice"
          title="Daily Challenge & Practice"
          className={`p-2 rounded-full text-xs transition-colors ${
            pathname.startsWith('/practice')
              ? 'bg-[#FFE8DF] text-[#FF5E3A]'
              : 'text-[#8A94A6] hover:text-[#1E232E] hover:bg-slate-50'
          }`}
        >
          <Flag className="w-4 h-4" />
        </Link>

        {/* Gamepad / Games */}
        <Link
          href="/games"
          title="Arcade Typing Games"
          className={`p-2 rounded-full text-xs transition-colors ${
            pathname.startsWith('/games')
              ? 'bg-[#FFE8DF] text-[#FF5E3A]'
              : 'text-[#8A94A6] hover:text-[#1E232E] hover:bg-slate-50'
          }`}
        >
          <Gamepad2 className="w-4 h-4" />
        </Link>

        {/* Leaderboard Podium */}
        <Link
          href="/leaderboard"
          title="Leaderboard Rankings"
          className={`p-2 rounded-full text-xs transition-colors ${
            pathname.startsWith('/leaderboard')
              ? 'bg-[#FFE8DF] text-[#FF5E3A]'
              : 'text-[#8A94A6] hover:text-[#1E232E] hover:bg-slate-50'
          }`}
        >
          <BarChart2 className="w-4 h-4" />
        </Link>

        {/* Analytics Line Chart */}
        <Link
          href="/dashboard"
          title="Typing Analytics"
          className={`p-2 rounded-full text-xs transition-colors ${
            pathname.startsWith('/dashboard')
              ? 'bg-[#FFE8DF] text-[#FF5E3A]'
              : 'text-[#8A94A6] hover:text-[#1E232E] hover:bg-slate-50'
          }`}
        >
          <LineChart className="w-4 h-4" />
        </Link>
      </nav>

      {/* Right Controls */}
      <div className="flex items-center gap-2.5">
        {/* Sound Button */}
        <button
          onClick={handleSoundCycle}
          title={`Audio: ${soundTheme}`}
          className="w-10 h-10 rounded-full bg-white hover:bg-[#FFE8DF] border border-[#EBEFF5] flex items-center justify-center text-[#FF5E3A] transition-all shadow-[0_2px_8px_rgba(0,0,0,0.03)]"
        >
          {isMuted || soundTheme === 'off' ? (
            <VolumeX className="w-4 h-4 text-slate-400" />
          ) : (
            <Volume2 className="w-4 h-4 text-[#FF5E3A]" />
          )}
        </button>

        {/* Search Button */}
        <Link
          href="/practice"
          title="Search"
          className="w-10 h-10 rounded-full bg-white hover:bg-slate-50 border border-[#EBEFF5] flex items-center justify-center text-[#8A94A6] hover:text-[#1E232E] transition-all shadow-[0_2px_8px_rgba(0,0,0,0.03)]"
        >
          <Search className="w-4 h-4" />
        </Link>

        {/* Link / Settings Button */}
        <Link
          href="/profile"
          title="Preferences"
          className="w-10 h-10 rounded-full bg-white hover:bg-slate-50 border border-[#EBEFF5] flex items-center justify-center text-[#8A94A6] hover:text-[#1E232E] transition-all shadow-[0_2px_8px_rgba(0,0,0,0.03)]"
        >
          <LinkIcon className="w-4 h-4" />
        </Link>

        {/* Sign in Button */}
        {session?.user ? (
          <div className="flex items-center gap-2">
            {userRole === 'ADMIN' && (
              <Link
                href="/admin"
                className="px-3.5 py-2 rounded-full text-xs font-bold bg-[#FF5E3A] text-white shadow-coral hover:bg-[#FF471D] transition-all flex items-center gap-1"
              >
                <Shield className="w-3.5 h-3.5" />
                <span>Admin</span>
              </Link>
            )}

            <Link
              href="/profile"
              className="flex items-center gap-2 px-3.5 py-2 rounded-full bg-white border border-[#EBEFF5] shadow-[0_2px_8px_rgba(0,0,0,0.03)] text-xs font-bold text-[#1E232E] hover:border-[#FF5E3A] transition-colors"
            >
              <div className="w-5 h-5 rounded-full bg-[#FF5E3A]/20 text-[#FF5E3A] flex items-center justify-center font-bold text-[10px]">
                {session.user.name?.[0]?.toUpperCase() || 'U'}
              </div>
              <span className="max-w-[80px] truncate">{session.user.name || 'User'}</span>
            </Link>

            <button
              onClick={() => signOut({ callbackUrl: '/' })}
              title="Sign Out"
              className="p-2 text-[#8A94A6] hover:text-[#EB5757] transition-colors"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        ) : (
          <Link
            href="/auth/signin"
            className="flex items-center gap-1.5 px-5 py-2.5 rounded-full bg-[#FF5E3A] text-white text-xs font-bold shadow-[0_4px_16px_rgba(255,94,58,0.38)] hover:bg-[#FF471D] hover:shadow-[0_6px_22px_rgba(255,94,58,0.5)] transition-all"
          >
            <User className="w-3.5 h-3.5" />
            <span>Sign in</span>
          </Link>
        )}
      </div>
    </header>
  );
}
