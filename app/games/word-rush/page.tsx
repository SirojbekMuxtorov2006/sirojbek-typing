import React from 'react';
import WordRushGame from '@/components/games/WordRushGame';

export const metadata = {
  title: 'Word Rush — SirojbekTyping Games',
  description: 'Fast-paced word arcade survival typing game.',
};

export default function WordRushPage() {
  return (
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <WordRushGame />
    </div>
  );
}
