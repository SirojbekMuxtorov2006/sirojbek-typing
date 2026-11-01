'use client';

import React, { useState } from 'react';
import {
  Code,
  BookA,
  Globe,
  Sparkles,
  Zap,
  Target,
  FileText,
  RotateCcw,
} from 'lucide-react';
import TypingTest from '@/components/typing/TypingTest';
import { useAppStore } from '@/lib/store';
import {
  ENGLISH_WORDS,
  UZBEK_WORDS,
  RUSSIAN_WORDS,
  CODE_SNIPPETS,
  generateWeakKeyText,
} from '@/lib/word-banks';

type PracticeCategory =
  | 'english_words'
  | 'uzbek_words'
  | 'uzbek_sentences'
  | 'russian_words'
  | 'code_js'
  | 'code_py'
  | 'code_rust'
  | 'weak_keys'
  | 'custom';

export default function PracticeCenter() {
  const { weakKeys } = useAppStore();
  const [category, setCategory] = useState<PracticeCategory>('english_words');
  const [selectedWeakKeys, setSelectedWeakKeys] = useState<string[]>(
    Object.keys(weakKeys).slice(0, 5)
  );
  const [customText, setCustomText] = useState('');
  const [practiceText, setPracticeText] = useState<string>('');
  const [isPracticing, setIsPracticing] = useState(false);

  const alphabet = 'abcdefghijklmnopqrstuvwxyz'.split('');

  const topMistakeKeys = Object.entries(weakKeys)
    .sort(([, a], [, b]) => b - a)
    .map(([k]) => k.toLowerCase())
    .slice(0, 6);

  const handleStartPractice = () => {
    let generated = '';

    switch (category) {
      case 'english_words':
        generated = ENGLISH_WORDS.sort(() => 0.5 - Math.random())
          .slice(0, 35)
          .join(' ');
        break;
      case 'uzbek_words':
        generated = UZBEK_WORDS.sort(() => 0.5 - Math.random())
          .slice(0, 35)
          .join(' ');
        break;
      case 'uzbek_sentences':
        generated =
          "Bilagi zo'r birni yiqar, bilimi zo'r mingni yiqar. Ilm olish igna bilan quduq qazish kabidir. Mehnatdan kelsa boylik, turmush bo'lar chiroyli. O'zbekiston kelajagi buyuk davlat.";
        break;
      case 'russian_words':
        generated = RUSSIAN_WORDS.sort(() => 0.5 - Math.random())
          .slice(0, 30)
          .join(' ');
        break;
      case 'code_js':
        generated = CODE_SNIPPETS.javascript[Math.floor(Math.random() * CODE_SNIPPETS.javascript.length)];
        break;
      case 'code_py':
        generated = CODE_SNIPPETS.python[Math.floor(Math.random() * CODE_SNIPPETS.python.length)];
        break;
      case 'code_rust':
        generated = CODE_SNIPPETS.rust[Math.floor(Math.random() * CODE_SNIPPETS.rust.length)];
        break;
      case 'weak_keys':
        generated = generateWeakKeyText(
          selectedWeakKeys.length > 0 ? selectedWeakKeys : topMistakeKeys
        );
        break;
      case 'custom':
        generated = customText.trim() || 'Type anything you want to practice your typing speed.';
        break;
    }

    setPracticeText(generated);
    setIsPracticing(true);
  };

  const toggleKey = (key: string) => {
    if (selectedWeakKeys.includes(key)) {
      setSelectedWeakKeys(selectedWeakKeys.filter((k) => k !== key));
    } else {
      setSelectedWeakKeys([...selectedWeakKeys, key]);
    }
  };

  if (isPracticing) {
    return (
      <div className="w-full max-w-4xl mx-auto flex flex-col items-center">
        <div className="w-full flex items-center justify-between mb-4">
          <button
            onClick={() => setIsPracticing(false)}
            className="flex items-center gap-1.5 text-xs text-text-secondary hover:text-text-primary transition-colors font-mono"
          >
            ← Back to Practice Categories
          </button>
          <span className="text-xs font-mono text-accent capitalize">
            Mode: {category.replace('_', ' ')}
          </span>
        </div>

        <TypingTest customProvidedText={practiceText} initialMode="custom" />
      </div>
    );
  }

  return (
    <div className="w-full max-w-5xl mx-auto">
      {/* Header */}
      <div className="text-center max-w-2xl mx-auto mb-8">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-accent-muted text-accent text-xs font-mono font-medium mb-3">
          <Target className="w-3.5 h-3.5" />
          <span>Intelligent Practice Center</span>
        </div>
        <h1 className="text-3xl font-bold tracking-tight text-text-primary mb-2">
          Targeted Typing Workouts
        </h1>
        <p className="text-xs sm:text-sm text-text-secondary">
          Strengthen your weak keys, conquer multi-language word banks, or practice coding syntax across JavaScript, Python, and Rust.
        </p>
      </div>

      {/* Categories Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        {/* Languages & Words */}
        <div className="p-5 rounded-2xl bg-secondary-bg border border-border space-y-3">
          <div className="flex items-center gap-2 text-text-primary font-semibold text-sm">
            <Globe className="w-4 h-4 text-accent" />
            <span>Languages & Vocabulary</span>
          </div>

          <div className="space-y-1.5">
            <button
              onClick={() => setCategory('english_words')}
              className={`w-full text-left p-2.5 rounded-xl border text-xs font-medium transition-all ${
                category === 'english_words'
                  ? 'bg-accent text-background font-bold border-accent'
                  : 'bg-card-bg border-border text-text-secondary hover:text-text-primary'
              }`}
            >
              Top English Vocabulary
            </button>

            <button
              onClick={() => setCategory('uzbek_words')}
              className={`w-full text-left p-2.5 rounded-xl border text-xs font-medium transition-all ${
                category === 'uzbek_words'
                  ? 'bg-accent text-background font-bold border-accent'
                  : 'bg-card-bg border-border text-text-secondary hover:text-text-primary'
              }`}
            >
              O&apos;zbekcha So&apos;zlar (Uzbek Words)
            </button>

            <button
              onClick={() => setCategory('uzbek_sentences')}
              className={`w-full text-left p-2.5 rounded-xl border text-xs font-medium transition-all ${
                category === 'uzbek_sentences'
                  ? 'bg-accent text-background font-bold border-accent'
                  : 'bg-card-bg border-border text-text-secondary hover:text-text-primary'
              }`}
            >
              O&apos;zbekcha Maqollar (Sentences)
            </button>

            <button
              onClick={() => setCategory('russian_words')}
              className={`w-full text-left p-2.5 rounded-xl border text-xs font-medium transition-all ${
                category === 'russian_words'
                  ? 'bg-accent text-background font-bold border-accent'
                  : 'bg-card-bg border-border text-text-secondary hover:text-text-primary'
              }`}
            >
              Русские Слова (Russian Vocabulary)
            </button>
          </div>
        </div>

        {/* Code & Developer Syntax */}
        <div className="p-5 rounded-2xl bg-secondary-bg border border-border space-y-3">
          <div className="flex items-center gap-2 text-text-primary font-semibold text-sm">
            <Code className="w-4 h-4 text-accent" />
            <span>Developer Code Syntax</span>
          </div>

          <div className="space-y-1.5">
            <button
              onClick={() => setCategory('code_js')}
              className={`w-full text-left p-2.5 rounded-xl border text-xs font-medium transition-all ${
                category === 'code_js'
                  ? 'bg-accent text-background font-bold border-accent'
                  : 'bg-card-bg border-border text-text-secondary hover:text-text-primary'
              }`}
            >
              JavaScript / TypeScript Syntax
            </button>

            <button
              onClick={() => setCategory('code_py')}
              className={`w-full text-left p-2.5 rounded-xl border text-xs font-medium transition-all ${
                category === 'code_py'
                  ? 'bg-accent text-background font-bold border-accent'
                  : 'bg-card-bg border-border text-text-secondary hover:text-text-primary'
              }`}
            >
              Python Functions & Comprehensions
            </button>

            <button
              onClick={() => setCategory('code_rust')}
              className={`w-full text-left p-2.5 rounded-xl border text-xs font-medium transition-all ${
                category === 'code_rust'
                  ? 'bg-accent text-background font-bold border-accent'
                  : 'bg-card-bg border-border text-text-secondary hover:text-text-primary'
              }`}
            >
              Rust Structs & Iterators
            </button>
          </div>
        </div>

        {/* Weak Keys & Custom */}
        <div className="p-5 rounded-2xl bg-secondary-bg border border-border space-y-3">
          <div className="flex items-center gap-2 text-text-primary font-semibold text-sm">
            <Sparkles className="w-4 h-4 text-accent" />
            <span>Adaptive Weak-Key Training</span>
          </div>

          <div className="space-y-1.5">
            <button
              onClick={() => setCategory('weak_keys')}
              className={`w-full text-left p-2.5 rounded-xl border text-xs font-medium transition-all ${
                category === 'weak_keys'
                  ? 'bg-accent text-background font-bold border-accent'
                  : 'bg-card-bg border-border text-text-secondary hover:text-text-primary'
              }`}
            >
              Adaptive Mistake Drill
            </button>

            <button
              onClick={() => setCategory('custom')}
              className={`w-full text-left p-2.5 rounded-xl border text-xs font-medium transition-all ${
                category === 'custom'
                  ? 'bg-accent text-background font-bold border-accent'
                  : 'bg-card-bg border-border text-text-secondary hover:text-text-primary'
              }`}
            >
              Custom Text Input
            </button>
          </div>

          {topMistakeKeys.length > 0 && (
            <div className="pt-2 text-[11px] text-text-muted">
              Auto-detected weak keys from your test history:{' '}
              <span className="text-error font-mono font-bold">
                {topMistakeKeys.map((k) => k.toUpperCase()).join(', ')}
              </span>
            </div>
          )}
        </div>
      </div>

      {/* Weak-key selector if category is weak_keys */}
      {category === 'weak_keys' && (
        <div className="p-6 rounded-2xl bg-secondary-bg border border-border mb-8">
          <h3 className="text-sm font-semibold text-text-primary mb-2">
            Select Individual Keys to Target
          </h3>
          <p className="text-xs text-text-secondary mb-4">
            Click keys below to customize your workout pool. Words containing these keys will be prioritized.
          </p>

          <div className="flex flex-wrap gap-1.5 font-mono text-xs">
            {alphabet.map((letter) => {
              const isSelected = selectedWeakKeys.includes(letter);
              return (
                <button
                  key={letter}
                  onClick={() => toggleKey(letter)}
                  className={`w-8 h-8 rounded-lg border font-bold uppercase transition-all ${
                    isSelected
                      ? 'bg-accent text-background border-accent shadow-sm scale-105'
                      : 'bg-card-bg border-border text-text-secondary hover:text-text-primary hover:border-border-light'
                  }`}
                >
                  {letter}
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* Custom text input if category is custom */}
      {category === 'custom' && (
        <div className="p-6 rounded-2xl bg-secondary-bg border border-border mb-8">
          <h3 className="text-sm font-semibold text-text-primary mb-2">Enter Custom Text</h3>
          <textarea
            value={customText}
            onChange={(e) => setCustomText(e.target.value)}
            placeholder="Paste any article, book excerpt, or code you want to practice..."
            className="w-full h-32 p-3 rounded-xl bg-card-bg border border-border text-text-primary text-xs font-mono focus:outline-none focus:border-accent"
          />
        </div>
      )}

      {/* Launch Action */}
      <div className="flex justify-center">
        <button
          onClick={handleStartPractice}
          className="flex items-center gap-2 px-8 py-3 rounded-xl bg-accent text-background font-bold text-sm hover:bg-accent-hover shadow-lg transition-transform active:scale-95"
        >
          <Zap className="w-4 h-4" />
          <span>Start Targeted Practice</span>
        </button>
      </div>
    </div>
  );
}
