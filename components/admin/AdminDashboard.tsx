'use client';

import React, { useState, useEffect } from 'react';
import {
  Shield,
  Users,
  CheckCircle,
  AlertTriangle,
  Trash2,
  Zap,
  TrendingUp,
  Activity,
} from 'lucide-react';
import { useSession } from 'next-auth/react';

interface AdminStats {
  totalUsers: number;
  totalTests: number;
  totalLessons: number;
  avgPlatformWpm: number;
  avgPlatformAcc: number;
  highestWpm: number;
}

interface UserItem {
  id: string;
  name: string;
  email: string;
  role: string;
  xp: number;
  level: number;
  createdAt: string;
}

interface FlaggedResult {
  id: string;
  wpm: number;
  rawWpm: number;
  accuracy: number;
  duration: number;
  testMode: string;
  createdAt: string;
}

export default function AdminDashboard() {
  const { data: session } = useSession();
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [users, setUsers] = useState<UserItem[]>([]);
  const [flaggedResults, setFlaggedResults] = useState<FlaggedResult[]>([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('');

  const loadData = async () => {
    try {
      const res = await fetch('/api/admin');
      if (res.ok) {
        const data = await res.json();
        setStats(data.stats);
        setUsers(data.recentUsers || []);
        setFlaggedResults(data.flaggedResults || []);
      }
    } catch (err) {
      console.error('Failed to load admin data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleUpdateRole = async (userId: string, newRole: string) => {
    try {
      const res = await fetch('/api/admin', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'update_role', userId, newRole }),
      });
      if (res.ok) {
        setMessage(`User role updated to ${newRole}`);
        loadData();
        setTimeout(() => setMessage(''), 3000);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleUnflag = async (resultId: string) => {
    try {
      const res = await fetch('/api/admin', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'unflag_result', resultId }),
      });
      if (res.ok) {
        loadData();
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleDeleteResult = async (resultId: string) => {
    try {
      const res = await fetch('/api/admin', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'delete_result', resultId }),
      });
      if (res.ok) {
        loadData();
      }
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="w-full max-w-6xl mx-auto space-y-8">
      {/* Admin Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-6 rounded-2xl bg-secondary-bg border border-border">
        <div className="flex items-center gap-3">
          <div className="p-3 rounded-xl bg-accent text-background font-bold">
            <Shield className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-text-primary">Admin Control Center</h1>
            <p className="text-xs text-text-secondary">
              Platform administration, role assignments, anti-cheat moderation, and real-time metrics.
            </p>
          </div>
        </div>

        {message && (
          <div className="px-3 py-1.5 rounded-lg bg-success-muted text-success border border-success/40 text-xs font-mono">
            {message}
          </div>
        )}
      </div>

      {/* Platform Stats */}
      {stats && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="p-4 rounded-xl bg-secondary-bg border border-border">
            <div className="flex items-center justify-between text-text-muted text-xs font-mono">
              <span>Total Registered Users</span>
              <Users className="w-4 h-4 text-accent" />
            </div>
            <div className="text-3xl font-mono font-bold text-text-primary mt-2">
              {stats.totalUsers}
            </div>
          </div>

          <div className="p-4 rounded-xl bg-secondary-bg border border-border">
            <div className="flex items-center justify-between text-text-muted text-xs font-mono">
              <span>Tests Completed</span>
              <Zap className="w-4 h-4 text-success" />
            </div>
            <div className="text-3xl font-mono font-bold text-text-primary mt-2">
              {stats.totalTests}
            </div>
          </div>

          <div className="p-4 rounded-xl bg-secondary-bg border border-border">
            <div className="flex items-center justify-between text-text-muted text-xs font-mono">
              <span>Platform Avg WPM</span>
              <TrendingUp className="w-4 h-4 text-accent" />
            </div>
            <div className="text-3xl font-mono font-bold text-accent mt-2">
              {stats.avgPlatformWpm}
            </div>
          </div>

          <div className="p-4 rounded-xl bg-secondary-bg border border-border">
            <div className="flex items-center justify-between text-text-muted text-xs font-mono">
              <span>Peak Platform WPM</span>
              <Activity className="w-4 h-4 text-text-primary" />
            </div>
            <div className="text-3xl font-mono font-bold text-text-primary mt-2">
              {stats.highestWpm}
            </div>
          </div>
        </div>
      )}

      {/* Flagged Submissions / Anti-Cheat Moderation */}
      <div className="p-6 rounded-2xl bg-secondary-bg border border-border">
        <div className="flex items-center gap-2 text-error font-semibold text-sm mb-3">
          <AlertTriangle className="w-4 h-4" />
          <span>Anti-Cheat Flagged Submissions ({flaggedResults.length})</span>
        </div>

        {flaggedResults.length === 0 ? (
          <p className="text-xs text-text-muted py-4">No suspicious scores currently flagged.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs font-mono">
              <thead className="bg-card-bg text-text-muted border-b border-border uppercase text-[11px]">
                <tr>
                  <th className="py-2.5 px-3">WPM</th>
                  <th className="py-2.5 px-3">Raw</th>
                  <th className="py-2.5 px-3">Accuracy</th>
                  <th className="py-2.5 px-3">Duration</th>
                  <th className="py-2.5 px-3">Date</th>
                  <th className="py-2.5 px-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {flaggedResults.map((r) => (
                  <tr key={r.id} className="hover:bg-card-bg/60">
                    <td className="py-2.5 px-3 font-bold text-error">{r.wpm}</td>
                    <td className="py-2.5 px-3">{r.rawWpm}</td>
                    <td className="py-2.5 px-3">{r.accuracy}%</td>
                    <td className="py-2.5 px-3">{r.duration}s</td>
                    <td className="py-2.5 px-3 text-text-muted">
                      {new Date(r.createdAt).toLocaleDateString()}
                    </td>
                    <td className="py-2.5 px-3 text-right space-x-2">
                      <button
                        onClick={() => handleUnflag(r.id)}
                        className="px-2 py-1 rounded bg-card-bg text-success border border-border hover:bg-elevated-bg"
                      >
                        Approve
                      </button>
                      <button
                        onClick={() => handleDeleteResult(r.id)}
                        className="px-2 py-1 rounded bg-card-bg text-error border border-border hover:bg-elevated-bg"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* User Management Table */}
      <div className="p-6 rounded-2xl bg-secondary-bg border border-border">
        <div className="flex items-center gap-2 text-text-primary font-semibold text-sm mb-4">
          <Users className="w-4 h-4 text-accent" />
          <span>User Management</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs font-mono">
            <thead className="bg-card-bg text-text-muted border-b border-border uppercase text-[11px]">
              <tr>
                <th className="py-2.5 px-3">User</th>
                <th className="py-2.5 px-3">Email</th>
                <th className="py-2.5 px-3">Role</th>
                <th className="py-2.5 px-3">Level / XP</th>
                <th className="py-2.5 px-3 text-right">Role Management</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {users.map((u) => (
                <tr key={u.id} className="hover:bg-card-bg/60">
                  <td className="py-3 px-3 font-semibold text-text-primary">{u.name}</td>
                  <td className="py-3 px-3 text-text-secondary">{u.email}</td>
                  <td className="py-3 px-3">
                    <span
                      className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                        u.role === 'ADMIN'
                          ? 'bg-accent text-background'
                          : u.role === 'MODERATOR'
                          ? 'bg-blue-500/20 text-blue-400'
                          : 'bg-card-bg text-text-secondary border border-border'
                      }`}
                    >
                      {u.role}
                    </span>
                  </td>
                  <td className="py-3 px-3">
                    Lvl {u.level} ({u.xp} XP)
                  </td>
                  <td className="py-3 px-3 text-right space-x-1.5">
                    {u.role !== 'ADMIN' && (
                      <button
                        onClick={() => handleUpdateRole(u.id, 'ADMIN')}
                        className="px-2 py-1 rounded bg-card-bg border border-border text-accent hover:bg-elevated-bg"
                      >
                        Make Admin
                      </button>
                    )}
                    {u.role !== 'USER' && (
                      <button
                        onClick={() => handleUpdateRole(u.id, 'USER')}
                        className="px-2 py-1 rounded bg-card-bg border border-border text-text-muted hover:text-text-primary"
                      >
                        Set to User
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
