import React from 'react';
import UserDashboard from '@/components/dashboard/UserDashboard';

export const metadata = {
  title: 'Progress & Dashboard — SirojbekTyping',
  description: 'Your personal typing speed metrics, progression charts, activity heatmap, and achievements.',
};

export default function DashboardPage() {
  return (
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
      <UserDashboard />
    </div>
  );
}
