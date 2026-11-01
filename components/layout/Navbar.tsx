'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useSession, signOut } from 'next-auth/react';
import {
  Keyboard,
  BookOpen,
  Target,
  Gamepad2,
  Trophy,
  BarChart2,
  User,
  Shield,
  Volume2,
  VolumeX,
  Globe,
  LogOut,
  Menu,
  X,
} from 'lucide-react';
import Logo from '@/components/ui/Logo';
import { useAppStore } from '@/lib/store';
import { TRANSLATIONS, LanguageCode } from '@/lib/translations';

export default function Navbar() {
  const pathname = usePathname();
  const { data: session } = useSession();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [langMenuOpen, setLangMenuOpen] = useState(false);

  const { settings, setLanguage, isMuted, toggleMute, soundTheme, setSoundTheme } = useAppStore();
  const t = TRANSLATIONS[settings.language] || TRANSLATIONS.en;

  const navLinks = [
    { href: '/', label: t.navType, icon: Keyboard },
    { href: '/lessons', label: t.navLessons, icon: BookOpen },
    { href: '/practice', label: t.navPractice, icon: Target },
    { href: '/games', label: t.navGames, icon: Gamepad2 },
    { href: '/leaderboard', label: t.navLeaderboard, icon: Trophy },
    { href: '/dashboard', label: t.navProgress, icon: BarChart2 },
  ];

  const userRole = (session?.user as unknown as { role?: string })?.role;

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

  return (
    <nav className="sticky top-0 z-50 w-full bg-background/95 backdrop-blur-md border-b border-border/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
        {/* Brand Logo */}
        <Logo size="md" />

        {/* Desktop Nav Links */}
        <div className="hidden lg:flex items-center space-x-1">
          {navLinks.map((link) => {
            const Icon = link.icon;
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                  isActive
                    ? 'text-accent bg-accent-muted'
                    : 'text-text-secondary hover:text-text-primary hover:bg-secondary-bg'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{link.label}</span>
              </Link>
            );
          })}
        </div>

        {/* Right Action Bar */}
        <div className="hidden sm:flex items-center space-x-2">
          {/* Sound Control */}
          <button
            onClick={handleSoundCycle}
            title={`Sound: ${soundTheme} (click to cycle)`}
            className="p-2 rounded-lg text-text-secondary hover:text-text-primary hover:bg-secondary-bg border border-transparent hover:border-border transition-colors flex items-center gap-1 text-xs"
          >
            {isMuted || soundTheme === 'off' ? (
              <VolumeX className="w-4 h-4 text-text-muted" />
            ) : (
              <Volume2 className="w-4 h-4 text-accent" />
            )}
            <span className="capitalize text-[11px] text-text-muted">{soundTheme}</span>
          </button>

          {/* Language Switcher */}
          <div className="relative">
            <button
              onClick={() => setLangMenuOpen(!langMenuOpen)}
              className="p-2 rounded-lg text-text-secondary hover:text-text-primary hover:bg-secondary-bg border border-transparent hover:border-border transition-colors flex items-center gap-1.5 text-xs font-mono"
            >
              <Globe className="w-4 h-4" />
              <span className="uppercase font-semibold">{settings.language}</span>
            </button>

            {langMenuOpen && (
              <div
                className="absolute right-0 mt-2 w-32 rounded-lg bg-card-bg border border-border shadow-xl py-1 z-50 animate-in fade-in slide-in-from-top-2"
                onMouseLeave={() => setLangMenuOpen(false)}
              >
                <button
                  onClick={() => {
                    setLanguage('en');
                    setLangMenuOpen(false);
                  }}
                  className={`w-full px-3 py-1.5 text-left text-xs font-medium flex items-center justify-between ${
                    settings.language === 'en' ? 'text-accent bg-accent-muted' : 'text-text-secondary hover:bg-secondary-bg'
                  }`}
                >
                  <span>English</span>
                  <span className="text-[10px] text-text-muted">EN</span>
                </button>
                <button
                  onClick={() => {
                    setLanguage('uz');
                    setLangMenuOpen(false);
                  }}
                  className={`w-full px-3 py-1.5 text-left text-xs font-medium flex items-center justify-between ${
                    settings.language === 'uz' ? 'text-accent bg-accent-muted' : 'text-text-secondary hover:bg-secondary-bg'
                  }`}
                >
                  <span>O&apos;zbekcha</span>
                  <span className="text-[10px] text-text-muted">UZ</span>
                </button>
                <button
                  onClick={() => {
                    setLanguage('ru');
                    setLangMenuOpen(false);
                  }}
                  className={`w-full px-3 py-1.5 text-left text-xs font-medium flex items-center justify-between ${
                    settings.language === 'ru' ? 'text-accent bg-accent-muted' : 'text-text-secondary hover:bg-secondary-bg'
                  }`}
                >
                  <span>Русский</span>
                  <span className="text-[10px] text-text-muted">RU</span>
                </button>
              </div>
            )}
          </div>

          <div className="h-5 w-px bg-border my-auto mx-1" />

          {/* User Auth Info / Buttons */}
          {session?.user ? (
            <div className="flex items-center space-x-2">
              {userRole === 'ADMIN' && (
                <Link
                  href="/admin"
                  className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-semibold bg-accent text-background hover:bg-accent-hover transition-colors shadow-sm"
                >
                  <Shield className="w-3.5 h-3.5" />
                  <span>Admin</span>
                </Link>
              )}

              <Link
                href="/profile"
                className="flex items-center gap-2 px-2.5 py-1.5 rounded-lg bg-secondary-bg hover:bg-elevated-bg border border-border text-xs text-text-primary transition-all"
              >
                <div className="w-5 h-5 rounded-full bg-accent/20 text-accent flex items-center justify-center font-bold text-[10px]">
                  {session.user.name?.[0]?.toUpperCase() || 'U'}
                </div>
                <span className="font-medium max-w-[100px] truncate">{session.user.name || 'User'}</span>
              </Link>

              <button
                onClick={() => signOut({ callbackUrl: '/' })}
                title="Sign Out"
                className="p-2 rounded-lg text-text-secondary hover:text-error hover:bg-secondary-bg transition-colors"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <div className="flex items-center space-x-2">
              <Link
                href="/auth/signin"
                className="px-3 py-1.5 rounded-lg text-xs font-medium text-text-secondary hover:text-text-primary hover:bg-secondary-bg transition-colors"
              >
                {t.navSignIn}
              </Link>
              <Link
                href="/auth/signup"
                className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-accent text-background hover:bg-accent-hover transition-colors shadow-sm"
              >
                {t.navSignUp}
              </Link>
            </div>
          )}
        </div>

        {/* Mobile Menu Button */}
        <div className="flex sm:hidden items-center space-x-2">
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 rounded-lg text-text-secondary hover:text-text-primary hover:bg-secondary-bg transition-colors"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="sm:hidden border-b border-border bg-secondary-bg px-4 py-4 space-y-3">
          <div className="grid grid-cols-2 gap-2">
            {navLinks.map((link) => {
              const Icon = link.icon;
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`flex items-center gap-2 p-2.5 rounded-lg text-sm font-medium ${
                    isActive ? 'bg-accent text-background font-bold' : 'text-text-secondary hover:bg-card-bg'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{link.label}</span>
                </Link>
              );
            })}
          </div>

          <div className="pt-3 border-t border-border flex items-center justify-between">
            <div className="flex items-center gap-2">
              <button
                onClick={handleSoundCycle}
                className="px-2.5 py-1.5 rounded-lg bg-card-bg text-xs text-text-secondary flex items-center gap-1.5"
              >
                <Volume2 className="w-4 h-4 text-accent" />
                <span className="capitalize">{soundTheme}</span>
              </button>
              <button
                onClick={() => setLanguage(settings.language === 'en' ? 'uz' : settings.language === 'uz' ? 'ru' : 'en')}
                className="px-2.5 py-1.5 rounded-lg bg-card-bg text-xs text-text-secondary flex items-center gap-1.5 font-mono uppercase"
              >
                <Globe className="w-4 h-4" />
                <span>{settings.language}</span>
              </button>
            </div>

            {session?.user ? (
              <button
                onClick={() => signOut()}
                className="text-xs text-error hover:underline flex items-center gap-1"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span>{t.navSignIn ? 'Log out' : 'Chiqish'}</span>
              </button>
            ) : (
              <Link
                href="/auth/signin"
                onClick={() => setMobileMenuOpen(false)}
                className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-accent text-background"
              >
                {t.navSignIn}
              </Link>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}
