import React from 'react';
import AdminDashboard from '@/components/admin/AdminDashboard';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import { ShieldAlert } from 'lucide-react';

export const metadata = {
  title: 'Admin Dashboard — SirojbekTyping',
  description: 'Administrative overview, anti-cheat moderation, and role management.',
};

export default async function AdminPage() {
  const session = await getServerSession(authOptions);
  const role = (session?.user as unknown as { role?: string })?.role;

  if (!session || role !== 'ADMIN') {
    return (
      <div className="w-full flex-1 flex flex-col items-center justify-center p-6 text-center">
        <div className="p-4 rounded-full bg-error/15 border border-error/40 text-error mb-4">
          <ShieldAlert className="w-12 h-12" />
        </div>
        <h1 className="text-2xl font-bold text-text-primary mb-2">Access Restricted</h1>
        <p className="text-xs text-text-secondary max-w-sm mb-6">
          This section requires Administrator privileges. Please sign in as an administrator (e.g. using the Admin Demo account).
        </p>
        <Link
          href="/auth/signin"
          className="px-5 py-2.5 rounded-xl bg-accent text-background font-bold text-xs"
        >
          Sign In as Admin
        </Link>
      </div>
    );
  }

  return (
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
      <AdminDashboard />
    </div>
  );
}
