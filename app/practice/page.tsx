import React from 'react';
import PracticeCenter from '@/components/practice/PracticeCenter';

export const metadata = {
  title: 'Practice Center — SirojbekTyping',
  description: 'Targeted typing practice: weak keys, programming vocabulary, Uzbek and Russian texts.',
};

export default function PracticePage() {
  return (
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
      <PracticeCenter />
    </div>
  );
}
