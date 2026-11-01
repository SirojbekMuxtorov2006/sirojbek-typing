'use client';

import React from 'react';
import TypingTest from '@/components/typing/TypingTest';

export default function HomePage() {
  return (
    <div className="w-full flex-1 flex flex-col items-center justify-start px-4 sm:px-6 lg:px-8 py-4 sm:py-6 max-w-7xl mx-auto">
      {/* Interactive Main Typing Arena */}
      <div className="w-full">
        <TypingTest />
      </div>
    </div>
  );
}
