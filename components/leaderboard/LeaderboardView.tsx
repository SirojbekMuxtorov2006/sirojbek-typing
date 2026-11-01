'use client';

import React, { useState, useEffect } from 'react';
import { Trophy, Medal, Search, Globe, ShieldCheck, Flame, Zap } from 'lucide-react';

interface LeaderboardEntry {
  id: string;
  username: string;
  wpm: number;
  rawWpm: number;
  accuracy: number;
  country: string | null;
  period: string;
  testMode: string;
  createdAt: string;
}

export default function LeaderboardView() {
  const [period, setPeriod] = useState<'daily' | 'weekly' | 'monthly' | 'all_time'>('all_time');
  const [entries, setEntries] = useState<LeaderboardEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    async function fetchLeaderboard() {
      setLoading(true);
      try {
        const res = await fetch(`/api/leaderboard?period=${period}`);
        const data = await res.json();
        setEntries(data.entries || []);
      } catch (err) {
        console.error('Error fetching leaderboard:', err);
      } finally {
        setLoading(false);
      }
    }
    fetchLeaderboard();
  }, [period]);

  const filteredEntries = entries.filter((e) =>
    e.username.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="w-full max-w-5xl mx-auto">
      {/* Header */}
      <div className="text-center max-w-2xl mx-auto mb-8">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-accent-muted text-accent text-xs font-mono font-medium mb-3">
          <Trophy className="w-3.5 h-3.5" />
          <span>Global Speed Ranking</span>
        </div>
        <h1 className="text-3xl font-bold tracking-tight text-text-primary mb-2">
          SirojbekTyping Leaderboard
        </h1>
        <p className="text-xs sm:text-sm text-text-secondary">
          Verified typing speeds across the globe. All scores are mathematically validated by our anti-cheat engine.
        </p>
      </div>

      {/* Filter & Search Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-3 rounded-2xl bg-secondary-bg border border-border mb-6">
        {/* Period Buttons */}
        <div className="flex items-center gap-1.5 p-1 rounded-xl bg-card-bg border border-border/80 text-xs font-mono">
          {(['daily', 'weekly', 'monthly', 'all_time'] as const).map((p) => (
            <button
              key={p}
              onClick={() => setPeriod(p)}
              className={`px-3 py-1.5 rounded-lg capitalize transition-colors ${
                period === p
                  ? 'bg-accent text-background font-bold shadow-sm'
                  : 'text-text-secondary hover:text-text-primary'
              }`}
            >
              {p.replace('_', ' ')}
            </button>
          ))}
        </div>

        {/* Search input */}
        <div className="relative w-full sm:w-64">
          <Search className="w-4 h-4 text-text-muted absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search typist..."
            className="w-full pl-9 pr-3 py-1.5 rounded-xl bg-card-bg border border-border text-xs text-text-primary placeholder:text-text-muted focus:outline-none focus:border-accent font-mono"
          />
        </div>
      </div>

      {/* Leaderboard Table */}
      <div className="w-full rounded-2xl bg-secondary-bg border border-border overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs font-mono">
            <thead className="bg-card-bg/80 text-text-muted border-b border-border uppercase tracking-wider text-[11px]">
              <tr>
                <th className="py-3.5 px-4 w-16 text-center">Rank</th>
                <th className="py-3.5 px-4">Typist</th>
                <th className="py-3.5 px-4 text-right">Net WPM</th>
                <th className="py-3.5 px-4 text-right">Raw</th>
                <th className="py-3.5 px-4 text-right">Accuracy</th>
                <th className="py-3.5 px-4 text-center">Country</th>
                <th className="py-3.5 px-4 text-center">Verified</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/60">
              {loading ? (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-text-muted">
                    Loading verified rankings...
                  </td>
                </tr>
              ) : filteredEntries.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-text-muted">
                    No verified scores found for this period. Be the first to rank!
                  </td>
                </tr>
              ) : (
                filteredEntries.map((entry, index) => {
                  const rank = index + 1;
                  let rankBadge = (
                    <span className="text-text-secondary font-bold">#{rank}</span>
                  );

                  if (rank === 1) {
                    rankBadge = (
                      <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-accent text-background font-bold shadow-[0_0_10px_rgba(232,180,79,0.6)]">
                        1
                      </span>
                    );
                  } else if (rank === 2) {
                    rankBadge = (
                      <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-slate-300 text-background font-bold">
                        2
                      </span>
                    );
                  } else if (rank === 3) {
                    rankBadge = (
                      <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-amber-700 text-background font-bold">
                        3
                      </span>
                    );
                  }

                  return (
                    <tr
                      key={entry.id}
                      className={`hover:bg-card-bg/60 transition-colors ${
                        rank <= 3 ? 'bg-secondary-bg/95 font-semibold' : ''
                      }`}
                    >
                      <td className="py-3 px-4 text-center">{rankBadge}</td>
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-2">
                          <div className="w-7 h-7 rounded-full bg-card-bg border border-border flex items-center justify-center font-bold text-accent text-xs">
                            {entry.username[0]?.toUpperCase()}
                          </div>
                          <span className="text-text-primary">{entry.username}</span>
                        </div>
                      </td>
                      <td className="py-3 px-4 text-right">
                        <span className="text-sm font-bold text-accent">{entry.wpm}</span>
                      </td>
                      <td className="py-3 px-4 text-right text-text-secondary">
                        {entry.rawWpm}
                      </td>
                      <td className="py-3 px-4 text-right text-success font-semibold">
                        {entry.accuracy}%
                      </td>
                      <td className="py-3 px-4 text-center">
                        <span className="px-1.5 py-0.5 rounded bg-card-bg border border-border text-[10px] text-text-secondary">
                          {entry.country || 'UZ'}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-center">
                        <div className="flex justify-center" title="Anti-cheat verified score">
                          <ShieldCheck className="w-4 h-4 text-success" />
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
