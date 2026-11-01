'use client';

import React, { useState } from 'react';
import { useSession } from 'next-auth/react';
import { User, Target, Globe, Palette, Shield, Save, Check } from 'lucide-react';
import { useAppStore } from '@/lib/store';

export default function ProfilePage() {
  const { data: session } = useSession();
  const { settings, setLanguage } = useAppStore();

  const [name, setName] = useState(session?.user?.name || 'Speed Typist');
  const [bio, setBio] = useState('Passionate about keyboard speed and ergonomic efficiency.');
  const [goalWpm, setGoalWpm] = useState(100);
  const [saved, setSaved] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  return (
    <div className="w-full max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
      <div className="text-center max-w-lg mx-auto mb-8">
        <div className="w-20 h-20 rounded-2xl bg-accent/20 border border-accent/40 flex items-center justify-center font-bold text-accent text-3xl font-mono mx-auto mb-3 shadow-md">
          {name[0]?.toUpperCase() || 'U'}
        </div>
        <h1 className="text-2xl font-bold text-text-primary">{name}</h1>
        <p className="text-xs text-text-secondary mt-1">
          {session?.user?.email || 'Guest Account'}
        </p>
      </div>

      <form onSubmit={handleSave} className="space-y-6 bg-secondary-bg p-6 sm:p-8 rounded-2xl border border-border shadow-xl">
        <h2 className="text-base font-semibold text-text-primary flex items-center gap-2 border-b border-border pb-3">
          <User className="w-4 h-4 text-accent" />
          <span>Profile & Typing Preferences</span>
        </h2>

        <div className="space-y-4">
          <div>
            <label className="block text-xs font-mono text-text-muted mb-1.5 uppercase">
              Display Name
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl bg-card-bg border border-border text-xs text-text-primary focus:outline-none focus:border-accent font-mono"
            />
          </div>

          <div>
            <label className="block text-xs font-mono text-text-muted mb-1.5 uppercase">
              Bio / Motto
            </label>
            <input
              type="text"
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl bg-card-bg border border-border text-xs text-text-primary focus:outline-none focus:border-accent"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-mono text-text-muted mb-1.5 uppercase flex items-center gap-1.5">
                <Target className="w-3.5 h-3.5 text-accent" />
                <span>Target Speed Goal (WPM)</span>
              </label>
              <input
                type="number"
                value={goalWpm}
                onChange={(e) => setGoalWpm(Number(e.target.value))}
                min={20}
                max={250}
                className="w-full px-3.5 py-2.5 rounded-xl bg-card-bg border border-border text-xs text-text-primary focus:outline-none focus:border-accent font-mono"
              />
            </div>

            <div>
              <label className="block text-xs font-mono text-text-muted mb-1.5 uppercase flex items-center gap-1.5">
                <Globe className="w-3.5 h-3.5 text-accent" />
                <span>Primary Interface Language</span>
              </label>
              <select
                value={settings.language}
                onChange={(e) => setLanguage(e.target.value as 'en' | 'uz' | 'ru')}
                className="w-full px-3.5 py-2.5 rounded-xl bg-card-bg border border-border text-xs text-text-primary focus:outline-none focus:border-accent font-mono"
              >
                <option value="en">English (US)</option>
                <option value="uz">O&apos;zbekcha (Lotin)</option>
                <option value="ru">Русский</option>
              </select>
            </div>
          </div>
        </div>

        <div className="pt-4 border-t border-border flex items-center justify-between">
          <span className="text-xs text-text-muted">
            Preferences auto-persist across your sessions.
          </span>
          <button
            type="submit"
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-accent text-background font-bold text-xs hover:bg-accent-hover transition-colors shadow-sm"
          >
            {saved ? (
              <>
                <Check className="w-4 h-4 text-background" />
                <span>Saved Successfully!</span>
              </>
            ) : (
              <>
                <Save className="w-4 h-4" />
                <span>Save Profile</span>
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
