import React from 'react';
import SpaceTypistGame from '@/components/games/SpaceTypistGame';

export const metadata = {
  title: 'Space Typist — SirojbekTyping Games',
  description: 'Galactic defense arcade typing game.',
};

export default function SpaceTypistPage() {
  return (
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <SpaceTypistGame />
    </div>
  );
}
