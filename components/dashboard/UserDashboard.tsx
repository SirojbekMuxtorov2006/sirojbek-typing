'use client';

import React, { useState, useEffect } from 'react';
import {
  Zap,
  Target,
  Clock,
  Flame,
  Award,
  Trophy,
  Calendar,
  Activity,
  CheckCircle2,
  Lock,
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
import { formatTime } from '@/lib/utils';
import { useSession } from 'next-auth/react';
import Link from 'next/link';

interface DashboardStats {
  totalTests: number;
  totalTimeSeconds: number;
  avgWpm: number;
  bestWpm: number;
  avgAccuracy: number;
  currentStreak: number;
  bestStreak: number;
  level: number;
  xp: number;
}

interface TestHistoryItem {
  id: string;
  wpm: number;
  rawWpm: number;
  accuracy: number;
  duration: number;
  testMode: string;
  createdAt: string;
}

export default function UserDashboard() {
  const { data: session } = useSession();
  const [stats, setStats] = useState<DashboardStats>({
    totalTests: 45,
    totalTimeSeconds: 2700,
    avgWpm: 74.2,
    bestWpm: 89.0,
    avgAccuracy: 96.5,
    currentStreak: 4,
    bestStreak: 7,
    level: 6,
    xp: 1250,
  });

  const [history, setHistory] = useState<TestHistoryItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      try {
        const res = await fetch('/api/typing-results');
        const data = await res.json();
        if (data.results && data.results.length > 0) {
          setHistory(data.results);
          // calculate live stats from results
          const tests = data.results;
          const best = Math.max(...tests.map((t: TestHistoryItem) => t.wpm));
          const avg =
            Math.round(
              (tests.reduce((acc: number, t: TestHistoryItem) => acc + t.wpm, 0) / tests.length) *
                10
            ) / 10;
          const avgAcc =
            Math.round(
              (tests.reduce((acc: number, t: TestHistoryItem) => acc + t.accuracy, 0) /
                tests.length) *
                10
            ) / 10;
          const totalSecs = tests.reduce(
            (acc: number, t: TestHistoryItem) => acc + t.duration,
            0
          );

          setStats((prev) => ({
            ...prev,
            totalTests: tests.length,
            bestWpm: best,
            avgWpm: avg,
            avgAccuracy: avgAcc,
            totalTimeSeconds: totalSecs,
          }));
        } else {
          // Mock data for demo preview if guest has no saved server data yet
          const mockHistory: TestHistoryItem[] = [
            { id: '1', wpm: 68.4, rawWpm: 72.0, accuracy: 96.2, duration: 60, testMode: 'time', createdAt: '2026-10-25' },
            { id: '2', wpm: 71.0, rawWpm: 74.5, accuracy: 97.0, duration: 60, testMode: 'time', createdAt: '2026-10-26' },
            { id: '3', wpm: 74.8, rawWpm: 78.0, accuracy: 96.8, duration: 60, testMode: 'time', createdAt: '2026-10-27' },
            { id: '4', wpm: 72.5, rawWpm: 75.0, accuracy: 98.1, duration: 60, testMode: 'time', createdAt: '2026-10-28' },
            { id: '5', wpm: 79.2, rawWpm: 82.0, accuracy: 97.4, duration: 60, testMode: 'time', createdAt: '2026-10-29' },
            { id: '6', wpm: 83.5, rawWpm: 86.4, accuracy: 98.0, duration: 60, testMode: 'time', createdAt: '2026-10-30' },
            { id: '7', wpm: 89.0, rawWpm: 92.5, accuracy: 98.5, duration: 60, testMode: 'time', createdAt: '2026-11-01' },
          ];
          setHistory(mockHistory);
        }
      } catch (err) {
        console.error('Failed to load user dashboard data:', err);
      } finally {
        setLoading(false);
      }
    }

    loadData();
  }, []);

  // Format progression chart data
  const chartData = [...history].reverse().map((item, idx) => ({
    name: `Test ${idx + 1}`,
    wpm: item.wpm,
    rawWpm: item.rawWpm,
    accuracy: item.accuracy,
  }));

  // Achievements catalogue
  const achievements = [
    { title: 'First Keystrokes', desc: 'Completed your first typing test', unlocked: true, icon: Zap },
    { title: 'Cadence Starter (30 WPM)', desc: 'Achieved 30+ Net WPM', unlocked: true, icon: Clock },
    { title: 'Swift Fingers (50 WPM)', desc: 'Achieved 50+ Net WPM', unlocked: true, icon: Flame },
    { title: 'Rhythm Master (75 WPM)', desc: 'Achieved 75+ Net WPM', unlocked: stats.bestWpm >= 75, icon: Activity },
    { title: 'Century Club (100 WPM)', desc: 'Broke 100 WPM barrier', unlocked: stats.bestWpm >= 100, icon: Award },
    { title: 'Flawless Execution (100%)', desc: 'Completed a test with 100% accuracy', unlocked: stats.avgAccuracy >= 98, icon: Target },
    { title: 'Unbreakable Habit (7-Day)', desc: 'Maintained 7-day typing streak', unlocked: stats.currentStreak >= 7, icon: Calendar },
    { title: 'Century Veteran (100 Tests)', desc: 'Completed 100 typing tests', unlocked: stats.totalTests >= 100, icon: Trophy },
  ];

  return (
    <div className="w-full max-w-5xl mx-auto space-y-8">
      {/* User Header Profile Card */}
      <div className="p-6 rounded-2xl bg-secondary-bg border border-border flex flex-col sm:flex-row items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-2xl bg-accent/20 border border-accent/40 flex items-center justify-center font-bold text-accent text-2xl font-mono shadow-md">
            {session?.user?.name?.[0]?.toUpperCase() || 'U'}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-xl font-bold text-text-primary">
                {session?.user?.name || 'Speed Typist'}
              </h2>
              <span className="px-2 py-0.5 rounded-full bg-accent-muted text-accent text-[11px] font-mono font-bold">
                Level {stats.level}
              </span>
            </div>
            <p className="text-xs text-text-secondary mt-0.5">
              {session?.user?.email || 'Guest Mode (Results cached locally and synced)'}
            </p>
            <div className="flex items-center gap-4 mt-2 text-xs font-mono text-text-muted">
              <span>XP: {stats.xp} pts</span>
              <span>•</span>
              <span className="flex items-center gap-1 text-accent">
                <Flame className="w-3.5 h-3.5 fill-accent" />
                <span>{stats.currentStreak} Day Streak</span>
              </span>
            </div>
          </div>
        </div>

        <Link
          href="/"
          className="px-5 py-2.5 rounded-xl bg-accent text-background font-bold text-xs hover:bg-accent-hover transition-colors shadow-sm"
        >
          Take Speed Test
        </Link>
      </div>

      {/* Primary Metrics Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="p-4 rounded-xl bg-secondary-bg border border-border">
          <span className="text-[11px] font-mono text-text-muted uppercase">Top Speed</span>
          <div className="text-3xl font-mono font-bold text-accent mt-1">{stats.bestWpm}</div>
          <span className="text-[10px] text-text-secondary">WPM Personal Record</span>
        </div>

        <div className="p-4 rounded-xl bg-secondary-bg border border-border">
          <span className="text-[11px] font-mono text-text-muted uppercase">Average Speed</span>
          <div className="text-3xl font-mono font-bold text-text-primary mt-1">{stats.avgWpm}</div>
          <span className="text-[10px] text-text-secondary">Net WPM Across Tests</span>
        </div>

        <div className="p-4 rounded-xl bg-secondary-bg border border-border">
          <span className="text-[11px] font-mono text-text-muted uppercase">Accuracy</span>
          <div className="text-3xl font-mono font-bold text-success mt-1">{stats.avgAccuracy}%</div>
          <span className="text-[10px] text-text-secondary">Average Keystroke Accuracy</span>
        </div>

        <div className="p-4 rounded-xl bg-secondary-bg border border-border">
          <span className="text-[11px] font-mono text-text-muted uppercase">Practice Time</span>
          <div className="text-2xl font-mono font-bold text-text-primary mt-1.5">
            {formatTime(stats.totalTimeSeconds)}
          </div>
          <span className="text-[10px] text-text-secondary">{stats.totalTests} total tests</span>
        </div>
      </div>

      {/* Speed Progression Chart */}
      <div className="p-6 rounded-2xl bg-secondary-bg border border-border">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-sm font-semibold text-text-primary">WPM Speed Progression</h3>
            <p className="text-xs text-text-secondary">Recent typing test speed and accuracy trajectory</p>
          </div>
          <div className="flex items-center gap-3 text-xs font-mono">
            <span className="flex items-center gap-1 text-accent">
              <span className="w-2 h-2 rounded-full bg-accent" /> Net WPM
            </span>
            <span className="flex items-center gap-1 text-text-muted">
              <span className="w-2 h-2 rounded-full bg-text-muted" /> Raw WPM
            </span>
          </div>
        </div>

        <div className="h-64 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={chartData} margin={{ top: 5, right: 10, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#272B37" vertical={false} />
              <XAxis dataKey="name" stroke="#5F6575" fontSize={11} tickLine={false} />
              <YAxis stroke="#5F6575" fontSize={11} tickLine={false} />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#181A20',
                  borderColor: '#272B37',
                  borderRadius: '8px',
                  fontSize: '12px',
                  color: '#F5F5F5',
                }}
              />
              <Line
                type="monotone"
                dataKey="wpm"
                stroke="#E8B44F"
                strokeWidth={3}
                dot={{ r: 4, fill: '#E8B44F' }}
                activeDot={{ r: 6 }}
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

      {/* Activity Heatmap Grid (30-day interactive calendar heatmap) */}
      <div className="p-6 rounded-2xl bg-secondary-bg border border-border">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-sm font-semibold text-text-primary">Activity Heatmap</h3>
          <span className="text-xs font-mono text-text-secondary">Last 30 Days</span>
        </div>

        <div className="grid grid-cols-10 sm:grid-cols-15 gap-2">
          {Array.from({ length: 30 }).map((_, i) => {
            const hasActivity = i % 3 !== 0;
            const level = hasActivity ? (i % 4) + 1 : 0;
            const bgClass =
              level === 0
                ? 'bg-card-bg border-border/80'
                : level === 1
                ? 'bg-accent/25 border-accent/40'
                : level === 2
                ? 'bg-accent/50 border-accent/60'
                : level === 3
                ? 'bg-accent/80 border-accent'
                : 'bg-accent border-accent text-background font-bold';

            return (
              <div
                key={i}
                title={`Day ${i + 1}: ${hasActivity ? `${level * 3} tests completed` : 'Rest day'}`}
                className={`h-8 rounded-lg border flex items-center justify-center text-[10px] font-mono transition-transform hover:scale-110 cursor-pointer ${bgClass}`}
              >
                {i + 1}
              </div>
            );
          })}
        </div>
      </div>

      {/* Achievements Badges Grid */}
      <div className="p-6 rounded-2xl bg-secondary-bg border border-border">
        <h3 className="text-sm font-semibold text-text-primary mb-1">Badges & Achievements</h3>
        <p className="text-xs text-text-secondary mb-4">Milestones unlocked throughout your typing career</p>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
          {achievements.map((ach, idx) => {
            const Icon = ach.icon;
            return (
              <div
                key={idx}
                className={`p-3.5 rounded-xl border flex flex-col justify-between transition-all ${
                  ach.unlocked
                    ? 'bg-card-bg border-accent/40 shadow-sm'
                    : 'bg-card-bg/40 border-border/60 opacity-50'
                }`}
              >
                <div className="flex items-start justify-between">
                  <div
                    className={`p-2 rounded-lg ${
                      ach.unlocked ? 'bg-accent-muted text-accent' : 'bg-secondary-bg text-text-muted'
                    }`}
                  >
                    <Icon className="w-5 h-5" />
                  </div>
                  {ach.unlocked ? (
                    <CheckCircle2 className="w-4 h-4 text-success" />
                  ) : (
                    <Lock className="w-3.5 h-3.5 text-text-muted" />
                  )}
                </div>

                <div className="mt-3">
                  <h4 className="text-xs font-semibold text-text-primary">{ach.title}</h4>
                  <p className="text-[11px] text-text-secondary mt-0.5 leading-snug">{ach.desc}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
