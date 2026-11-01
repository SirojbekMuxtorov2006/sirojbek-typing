'use client';

import React, { useState } from 'react';
import { signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Lock, Mail, ArrowRight, Shield, User, AlertCircle } from 'lucide-react';
import Logo from '@/components/ui/Logo';

export default function SignInPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const res = await signIn('credentials', {
        email,
        password,
        redirect: false,
      });

      if (res?.error) {
        setError(res.error);
      } else {
        router.push('/');
        router.refresh();
      }
    } catch (err) {
      setError('An unexpected error occurred during sign in.');
    } finally {
      setLoading(false);
    }
  };

  const handleDemoLogin = (demoEmail: string, demoPass: string) => {
    setEmail(demoEmail);
    setPassword(demoPass);
    signIn('credentials', {
      email: demoEmail,
      password: demoPass,
      redirect: false,
    }).then((res) => {
      if (!res?.error) {
        router.push('/');
        router.refresh();
      }
    });
  };

  return (
    <div className="w-full flex-1 flex flex-col items-center justify-center px-4 py-12">
      <div className="w-full max-w-md space-y-6">
        <div className="text-center space-y-2">
          <div className="inline-block mb-2">
            <Logo size="lg" />
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-text-primary">
            Sign in to your account
          </h1>
          <p className="text-xs text-text-secondary">
            Sync your typing speed records, unlock achievements, and climb the leaderboard.
          </p>
        </div>

        {error && (
          <div className="p-3 rounded-xl bg-error/15 border border-error/40 text-error text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* Demo Fast Login Buttons */}
        <div className="p-4 rounded-2xl bg-secondary-bg/80 border border-border space-y-2">
          <span className="text-[11px] font-mono uppercase tracking-wider text-text-muted block text-center">
            Instant Demo Sign In
          </span>
          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={() => handleDemoLogin('admin@sirojbektyping.com', 'admin123')}
              className="flex items-center justify-center gap-1.5 p-2 rounded-xl bg-card-bg hover:bg-elevated-bg border border-border text-xs text-accent font-semibold transition-colors"
            >
              <Shield className="w-3.5 h-3.5" />
              <span>Admin Demo</span>
            </button>
            <button
              type="button"
              onClick={() => handleDemoLogin('user@sirojbektyping.com', 'user123')}
              className="flex items-center justify-center gap-1.5 p-2 rounded-xl bg-card-bg hover:bg-elevated-bg border border-border text-xs text-text-primary font-semibold transition-colors"
            >
              <User className="w-3.5 h-3.5" />
              <span>User Demo</span>
            </button>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="p-6 rounded-2xl bg-secondary-bg border border-border space-y-4 shadow-xl">
          <div>
            <label className="block text-xs font-mono uppercase text-text-muted mb-1.5">
              Email Address
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 text-text-muted absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@example.com"
                required
                className="w-full pl-10 pr-3.5 py-2.5 rounded-xl bg-card-bg border border-border text-xs text-text-primary placeholder:text-text-muted focus:outline-none focus:border-accent font-mono"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-mono uppercase text-text-muted mb-1.5">
              Password
            </label>
            <div className="relative">
              <Lock className="w-4 h-4 text-text-muted absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
                className="w-full pl-10 pr-3.5 py-2.5 rounded-xl bg-card-bg border border-border text-xs text-text-primary placeholder:text-text-muted focus:outline-none focus:border-accent font-mono"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-2.5 rounded-xl bg-accent text-background font-bold text-xs hover:bg-accent-hover transition-colors shadow-sm disabled:opacity-50 mt-2"
          >
            {loading ? 'Authenticating...' : 'Sign In'}
          </button>
        </form>

        <div className="text-center space-y-2 text-xs text-text-secondary">
          <p>
            Don&apos;t have an account?{' '}
            <Link href="/auth/signup" className="text-accent hover:underline font-semibold">
              Sign up
            </Link>
          </p>
          <p>
            <Link href="/" className="text-text-muted hover:text-text-primary">
              Continue as guest without saving to profile →
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
