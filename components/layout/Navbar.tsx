'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useSession, signOut } from 'next-auth/react';
import {
  Keyboard,
  Sprout,
  Languages,
  Flag,
  Gamepad2,
  BarChart2,
  LineChart,
  Volume2,
  VolumeX,
  Search,
  Settings,
  User,
  Shield,
  LogOut,
  ChevronDown,
} from 'lucide-react';
import { useAppStore } from '@/lib/store';

export default function Navbar() {
  const pathname = usePathname();
  const { data: session } = useSession();
  const [langMenuOpen, setLangMenuOpen] = useState(false);
  const [searchModalOpen, setSearchModalOpen] = useState(false);

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

  const navItems = [
    { href: '/', label: 'type', icon: Keyboard, isType: true },
    { href: '/lessons', label: 'lessons', icon: Sprout },
    { href: '/practice', label: 'practice', icon: Languages },
    { href: '/leaderboard', label: 'challenges', icon: Flag },
    { href: '/games', label: 'games', icon: Gamepad2 },
    { href: '/leaderboard', label: 'ranks', icon: BarChart2 },
    { href: '/dashboard', label: 'analytics', icon: LineChart },
  ];

  const userRole = (session?.user as unknown as { role?: string })?.role;

  return (
    <header className="w-full pt-4 pb-2 px-6 sm:px-10 flex items-center justify-between max-w-[1500px] mx-auto select-none">
      {/* Brand Logo - exactly like screenshot with coral badge and clean lowercase text */}
      <Link href="/" className="flex items-center gap-2 group focus:outline-none">
        <div className="w-9 h-9 rounded-2xl bg-[#FF5E3A] flex items-center justify-center text-white font-bold text-sm shadow-[0_4px_12px_rgba(255,94,58,0.3)] transition-transform group-hover:scale-105">
          <span className="tracking-tighter font-mono">ST</span>
        </div>
        <div className="flex items-baseline">
          <span className="font-bold text-xl tracking-tight text-[#FF5E3A] font-sans">
            sirojbek
          </span>
          <span className="font-bold text-xl tracking-tight text-[#FF5E3A] font-sans">
            typing
          </span>
        </div>
      </Link>

      {/* Center Floating Pill Dock */}
      <nav className="hidden md:flex items-center gap-1 bg-white px-2 py-1.5 rounded-full border border-border/80 shadow-sm">
        {/* Type button (Highlighted when active) */}
        <Link
          href="/"
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold transition-all ${
            pathname === '/'
              ? 'bg-[#FFF0EA] text-[#FF5E3A] shadow-sm'
              : 'text-[#8A94A6] hover:text-[#1E232E] hover:bg-slate-50'
          }`}
        >
          <Keyboard className="w-4 h-4" />
          <span>type</span>
        </Link>

        {/* Lessons */}
        <Link
          href="/lessons"
          title="Touch Typing Lessons"
          className={`p-2 rounded-full text-xs transition-colors ${
            pathname.startsWith('/lessons')
              ? 'bg-[#FFF0EA] text-[#FF5E3A]'
              : 'text-[#8A94A6] hover:text-[#1E232E] hover:bg-slate-50'
          }`}
        >
          <Sprout className="w-4 h-4" />
        </Link>

        {/* Languages / Practice */}
        <div className="relative">
          <button
            onClick={() => setLangMenuOpen(!langMenuOpen)}
            title="Language & Vocabulary"
            className={`p-2 rounded-full text-xs transition-colors ${
              pathname.startsWith('/practice')
                ? 'bg-[#FFF0EA] text-[#FF5E3A]'
                : 'text-[#8A94A6] hover:text-[#1E232E] hover:bg-slate-50'
            }`}
          >
            <span className="font-serif font-bold text-sm leading-none px-0.5">文</span>
          </button>

          {langMenuOpen && (
            <div
              className="absolute left-1/2 -translate-x-1/2 mt-2 w-36 bg-white rounded-2xl border border-border shadow-xl py-1.5 z-50 animate-in fade-in zoom-in-95"
              onMouseLeave={() => setLangMenuOpen(false)}
            >
              <button
                onClick={() => {
                  setLanguage('en');
                  setLangMenuOpen(false);
                }}
                className={`w-full px-3 py-1.5 text-left text-xs font-medium flex items-center justify-between ${
                  settings.language === 'en' ? 'text-[#FF5E3A] bg-[#FFF0EA] font-bold' : 'text-[#8A94A6] hover:bg-slate-50'
                }`}
              >
                <span>English</span>
                <span className="text-[10px]">EN</span>
              </button>
              <button
                onClick={() => {
                  setLanguage('uz');
                  setLangMenuOpen(false);
                }}
                className={`w-full px-3 py-1.5 text-left text-xs font-medium flex items-center justify-between ${
                  settings.language === 'uz' ? 'text-[#FF5E3A] bg-[#FFF0EA] font-bold' : 'text-[#8A94A6] hover:bg-slate-50'
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
                className={`w-full px-3 py-1.5 text-left text-xs font-medium flex items-center justify-between ${
                  settings.language === 'ru' ? 'text-[#FF5E3A] bg-[#FFF0EA] font-bold' : 'text-[#8A94A6] hover:bg-slate-50'
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
          title="Practice Center"
          className={`p-2 rounded-full text-xs transition-colors ${
            pathname.startsWith('/practice')
              ? 'bg-[#FFF0EA] text-[#FF5E3A]'
              : 'text-[#8A94A6] hover:text-[#1E232E] hover:bg-slate-50'
          }`}
        >
          <Flag className="w-4 h-4" />
        </Link>

        {/* Games */}
        <Link
          href="/games"
          title="Arcade Typing Games"
          className={`p-2 rounded-full text-xs transition-colors ${
            pathname.startsWith('/games')
              ? 'bg-[#FFF0EA] text-[#FF5E3A]'
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
              ? 'bg-[#FFF0EA] text-[#FF5E3A]'
              : 'text-[#8A94A6] hover:text-[#1E232E] hover:bg-slate-50'
          }`}
        >
          <BarChart2 className="w-4 h-4" />
        </Link>

        {/* Progress Analytics */}
        <Link
          href="/dashboard"
          title="Typing Analytics"
          className={`p-2 rounded-full text-xs transition-colors ${
            pathname.startsWith('/dashboard')
              ? 'bg-[#FFF0EA] text-[#FF5E3A]'
              : 'text-[#8A94A6] hover:text-[#1E232E] hover:bg-slate-50'
          }`}
        >
          <LineChart className="w-4 h-4" />
        </Link>
      </nav>

      {/* Right Controls */}
      <div className="flex items-center gap-2">
        {/* Sound Circular Button */}
        <button
          onClick={handleSoundCycle}
          title={`Audio Switch: ${soundTheme}`}
          className="w-9 h-9 rounded-full bg-white hover:bg-[#FFF0EA] border border-border/80 flex items-center justify-center text-[#8A94A6] hover:text-[#FF5E3A] transition-all shadow-sm"
        >
          {isMuted || soundTheme === 'off' ? (
            <VolumeX className="w-4 h-4 text-slate-400" />
          ) : (
            <Volume2 className="w-4 h-4 text-[#FF5E3A]" />
          )}
        </button>

        {/* Search Circular Button */}
        <Link
          href="/practice"
          title="Search word banks and lessons"
          className="w-9 h-9 rounded-full bg-white hover:bg-slate-50 border border-border/80 flex items-center justify-center text-[#8A94A6] hover:text-[#1E232E] transition-all shadow-sm"
        >
          <Search className="w-4 h-4" />
        </Link>

        {/* Settings / Profile link button */}
        <Link
          href="/profile"
          title="Preferences & Settings"
          className="w-9 h-9 rounded-full bg-white hover:bg-slate-50 border border-border/80 flex items-center justify-center text-[#8A94A6] hover:text-[#1E232E] transition-all shadow-sm"
        >
          <Settings className="w-4 h-4" />
        </Link>

        {/* User Status / Coral Sign In Pill */}
        {session?.user ? (
          <div className="flex items-center gap-2">
            {userRole === 'ADMIN' && (
              <Link
                href="/admin"
                className="px-3 py-1.5 rounded-full text-xs font-semibold bg-[#FF5E3A] text-white shadow-coral hover:bg-[#FF471D] transition-all flex items-center gap-1"
              >
                <Shield className="w-3.5 h-3.5" />
                <span>Admin</span>
              </Link>
            )}

            <Link
              href="/profile"
              className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-white border border-border shadow-sm text-xs font-medium text-[#1E232E] hover:border-[#FF5E3A] transition-colors"
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
            className="flex items-center gap-1.5 px-4 sm:px-5 py-2 rounded-full bg-[#FF5E3A] text-white text-xs font-semibold shadow-coral hover:bg-[#FF471D] hover:shadow-[0_6px_20px_rgba(255,94,58,0.45)] transition-all"
          >
            <User className="w-3.5 h-3.5" />
            <span>Sign in</span>
          </Link>
        )}
      </div>
    </header>
  );
}
