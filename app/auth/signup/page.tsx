'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { signIn } from 'next-auth/react';
import Link from 'next/link';
import { Lock, Mail, User, AlertCircle, Check } from 'lucide-react';
import Logo from '@/components/ui/Logo';

export default function SignUpPage() {
  const router = useRouter();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || 'Registration failed');
        setLoading(false);
        return;
      }

      // Auto sign in with credentials
      const signInRes = await signIn('credentials', {
        email,
        password,
        redirect: false,
      });

      if (signInRes?.error) {
        router.push('/auth/signin');
      } else {
        router.push('/');
        router.refresh();
      }
    } catch (err) {
      setError('An error occurred during registration.');
      setLoading(false);
    }
  };

  return (
    <div className="w-full flex-1 flex flex-col items-center justify-center px-4 py-12">
      <div className="w-full max-w-md space-y-6">
        <div className="text-center space-y-2">
          <div className="inline-block mb-2">
            <Logo size="lg" />
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-text-primary">
            Create your account
          </h1>
          <p className="text-xs text-text-secondary">
            Join SirojbekTyping to build muscle memory, earn badges, and compete globally.
          </p>
        </div>

        {error && (
          <div className="p-3 rounded-xl bg-error/15 border border-error/40 text-error text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="p-6 rounded-2xl bg-secondary-bg border border-border space-y-4 shadow-xl">
          <div>
            <label className="block text-xs font-mono uppercase text-text-muted mb-1.5">
              Full Name or Username
            </label>
            <div className="relative">
              <User className="w-4 h-4 text-text-muted absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Sirojbek"
                required
                className="w-full pl-10 pr-3.5 py-2.5 rounded-xl bg-card-bg border border-border text-xs text-text-primary placeholder:text-text-muted focus:outline-none focus:border-accent font-mono"
              />
            </div>
          </div>

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
              Password (min 6 characters)
            </label>
            <div className="relative">
              <Lock className="w-4 h-4 text-text-muted absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                minLength={6}
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
            {loading ? 'Creating Account...' : 'Sign Up Free'}
          </button>
        </form>

        <div className="text-center text-xs text-text-secondary">
          Already have an account?{' '}
          <Link href="/auth/signin" className="text-accent hover:underline font-semibold">
            Sign in
          </Link>
        </div>
      </div>
    </div>
  );
}
