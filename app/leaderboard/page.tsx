import React from 'react';
import LeaderboardView from '@/components/leaderboard/LeaderboardView';

export const metadata = {
  title: 'Global Leaderboard — SirojbekTyping',
  description: 'Verified speed typing rankings across the globe with anti-cheat protections.',
};

export default function LeaderboardPage() {
  return (
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
      <LeaderboardView />
    </div>
  );
}
