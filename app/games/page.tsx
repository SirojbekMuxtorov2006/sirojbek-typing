import React from 'react';
import Link from 'next/link';
import { Gamepad2, Flame, Rocket, Trophy, Play, Star } from 'lucide-react';

export const metadata = {
  title: 'Typing Games — SirojbekTyping',
  description: 'Play original arcade typing speed games: Word Rush and Space Typist.',
};

export default function GamesHubPage() {
  return (
    <div className="w-full max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
      {/* Header */}
      <div className="text-center max-w-2xl mx-auto mb-10">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-accent-muted text-accent text-xs font-mono font-medium mb-3">
          <Gamepad2 className="w-3.5 h-3.5" />
          <span>Arcade Zone</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-text-primary mb-2">
          Speed Typing Games
        </h1>
        <p className="text-xs sm:text-sm text-text-secondary">
          Gamify your typing training. Test your reflexes against falling word cascades and galactic space threats.
        </p>
      </div>

      {/* Two Original Games Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
        {/* Game A: Word Rush */}
        <div className="p-8 rounded-3xl bg-secondary-bg border border-border hover:border-accent/60 transition-all flex flex-col justify-between shadow-xl relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:opacity-10 transition-opacity">
            <Flame className="w-36 h-36 text-accent" />
          </div>

          <div>
            <div className="p-3.5 rounded-2xl bg-card-bg w-fit text-accent mb-6 border border-border shadow-sm">
              <Flame className="w-8 h-8" />
            </div>

            <span className="text-xs font-mono font-bold uppercase tracking-wider text-accent mb-1 block">
              Arcade Survival
            </span>
            <h2 className="text-2xl font-bold text-text-primary mb-2">Word Rush</h2>
            <p className="text-xs sm:text-sm text-text-secondary leading-relaxed mb-6">
              Words drop down your display with increasing velocity. Type them out quickly before they hit the red critical boundary! Features combo multipliers and 3-life survival.
            </p>

            <div className="flex items-center gap-4 text-xs font-mono text-text-muted mb-8">
              <span className="flex items-center gap-1">
                <Star className="w-3.5 h-3.5 text-accent" /> Levels 1-10+
              </span>
              <span>•</span>
              <span>Combo Streaks</span>
              <span>•</span>
              <span>Audio SFX</span>
            </div>
          </div>

          <Link
            href="/games/word-rush"
            className="flex items-center justify-center gap-2 w-full py-3.5 rounded-xl bg-accent text-background font-bold text-sm hover:bg-accent-hover transition-transform active:scale-98 shadow-md"
          >
            <Play className="w-4 h-4 fill-background" />
            <span>Launch Word Rush</span>
          </Link>
        </div>

        {/* Game B: Space Typist */}
        <div className="p-8 rounded-3xl bg-secondary-bg border border-border hover:border-accent/60 transition-all flex flex-col justify-between shadow-xl relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:opacity-10 transition-opacity">
            <Rocket className="w-36 h-36 text-accent -rotate-45" />
          </div>

          <div>
            <div className="p-3.5 rounded-2xl bg-card-bg w-fit text-accent mb-6 border border-border shadow-sm">
              <Rocket className="w-8 h-8 -rotate-45" />
            </div>

            <span className="text-xs font-mono font-bold uppercase tracking-wider text-accent mb-1 block">
              Galactic Defense
            </span>
            <h2 className="text-2xl font-bold text-text-primary mb-2">Space Typist</h2>
            <p className="text-xs sm:text-sm text-text-secondary leading-relaxed mb-6">
              Hostile asteroids and cosmic debris approach your starship. Lock onto targets by typing their matching words and blast them to dust with plasma laser beams.
            </p>

            <div className="flex items-center gap-4 text-xs font-mono text-text-muted mb-8">
              <span className="flex items-center gap-1">
                <Star className="w-3.5 h-3.5 text-accent" /> Sectors 1-8+
              </span>
              <span>•</span>
              <span>Shield Integrity</span>
              <span>•</span>
              <span>Laser FX</span>
            </div>
          </div>

          <Link
            href="/games/space-typist"
            className="flex items-center justify-center gap-2 w-full py-3.5 rounded-xl bg-accent text-background font-bold text-sm hover:bg-accent-hover transition-transform active:scale-98 shadow-md"
          >
            <Play className="w-4 h-4 fill-background" />
            <span>Launch Space Typist</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
