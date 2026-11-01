'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { RotateCcw, Clock, Calendar, Target, X, Flame } from 'lucide-react';
import TestSettingsBar from './TestSettingsBar';
import ResultsModal from './ResultsModal';
import OnlyTypingKeyboard from './OnlyTypingKeyboard';
import { useAppStore, TypingResultPayload } from '@/lib/store';
import { generateTestText } from '@/lib/word-banks';
import {
  calculateWpm,
  calculateRawWpm,
  calculateAccuracy,
  calculateConsistency,
  SecondMetric,
} from '@/lib/typing-engine';
import sound from '@/lib/sound';

interface TypingTestProps {
  initialMode?: 'time' | 'words' | 'quote' | 'custom' | 'zen';
  customProvidedText?: string;
  onFinish?: (result: TypingResultPayload) => void;
}

export default function TypingTest({
  initialMode,
  customProvidedText,
  onFinish,
}: TypingTestProps) {
  const { settings, soundTheme, recordMistakes } = useAppStore();

  // Test state
  const [text, setText] = useState<string>('');
  const [wordsList, setWordsList] = useState<string[]>([]);
  const [currentWordIndex, setCurrentWordIndex] = useState<number>(0);
  const [currentInput, setCurrentInput] = useState<string>('');
  const [completedWords, setCompletedWords] = useState<string[]>([]);

  const [isTestActive, setIsTestActive] = useState<boolean>(false);
  const [isFinished, setIsFinished] = useState<boolean>(false);
  const [timeLeft, setTimeLeft] = useState<number>(settings.duration);
  const [startTime, setStartTime] = useState<number | null>(null);

  // Live metrics
  const [liveWpm, setLiveWpm] = useState<number>(0);
  const [correctKeystrokes, setCorrectKeystrokes] = useState<number>(0);
  const [totalKeystrokes, setTotalKeystrokes] = useState<number>(0);

  // Modals
  const [showChallengeModal, setShowChallengeModal] = useState<boolean>(false);
  const [showQuestsModal, setShowQuestsModal] = useState<boolean>(false);
  const [showStreakModal, setShowStreakModal] = useState<boolean>(false);

  // Tracking
  const mistakeMapRef = useRef<Record<string, number>>({});
  const secondMetricsRef = useRef<SecondMetric[]>([]);
  const timerIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const wordsContainerRef = useRef<HTMLDivElement>(null);
  const activeWordRef = useRef<HTMLSpanElement>(null);

  // Completed result
  const [completedResult, setCompletedResult] = useState<TypingResultPayload | null>(null);

  // Dynamic greeting based on time of day
  const [greeting, setGreeting] = useState('Good afternoon.');
  useEffect(() => {
    const hour = new Date().getHours();
    if (hour < 12) setGreeting('Good morning.');
    else if (hour < 18) setGreeting('Good afternoon.');
    else setGreeting('Good evening.');
  }, []);

  // Initialize or reset test
  const initTestText = useCallback(() => {
    let generated = '';
    if (customProvidedText && customProvidedText.length > 0) {
      generated = customProvidedText;
    } else {
      generated = generateTestText({
        mode: initialMode || settings.mode,
        wordCount: settings.wordCount,
        language: settings.language,
        punctuation: settings.punctuation,
        numbers: settings.numbers,
        customText: settings.customText,
      });
    }

    setText(generated);
    const splitWords = generated.split(' ');
    setWordsList(splitWords);
    setCurrentWordIndex(0);
    setCurrentInput('');
    setCompletedWords([]);

    setIsTestActive(false);
    setIsFinished(false);
    setTimeLeft(settings.duration);
    setStartTime(null);
    setLiveWpm(0);
    setCorrectKeystrokes(0);
    setTotalKeystrokes(0);
    mistakeMapRef.current = {};
    secondMetricsRef.current = [];
    setCompletedResult(null);

    if (timerIntervalRef.current) {
      clearInterval(timerIntervalRef.current);
      timerIntervalRef.current = null;
    }

    if (wordsContainerRef.current) {
      wordsContainerRef.current.scrollTop = 0;
    }

    setTimeout(() => {
      inputRef.current?.focus();
    }, 50);
  }, [
    customProvidedText,
    initialMode,
    settings.customText,
    settings.duration,
    settings.language,
    settings.mode,
    settings.numbers,
    settings.punctuation,
    settings.wordCount,
  ]);

  useEffect(() => {
    initTestText();
  }, [initTestText]);

  // Smooth 3-line scroll tracking
  useEffect(() => {
    if (activeWordRef.current && wordsContainerRef.current) {
      const activeEl = activeWordRef.current;
      const containerEl = wordsContainerRef.current;
      const wordTop = activeEl.offsetTop;
      const containerTop = containerEl.scrollTop;

      // Keep active line within top 2 visible lines
      if (wordTop - containerTop > 70) {
        containerEl.scrollTo({
          top: wordTop - 12,
          behavior: 'smooth',
        });
      }
    }
  }, [currentWordIndex]);

  // Finish test callback
  const handleFinishTest = useCallback(async () => {
    if (timerIntervalRef.current) {
      clearInterval(timerIntervalRef.current);
      timerIntervalRef.current = null;
    }

    setIsTestActive(false);
    setIsFinished(true);

    const elapsed = startTime ? Math.max(1, (Date.now() - startTime) / 1000) : 1;
    const finalWpm = calculateWpm(correctKeystrokes, elapsed);
    const finalRaw = calculateRawWpm(totalKeystrokes, elapsed);
    const finalAcc = calculateAccuracy(correctKeystrokes, totalKeystrokes);
    const finalConsistency = calculateConsistency(secondMetricsRef.current);

    const incorrect = Object.values(mistakeMapRef.current).reduce((a, b) => a + b, 0);

    const payload: TypingResultPayload = {
      wpm: finalWpm,
      rawWpm: finalRaw,
      accuracy: finalAcc,
      consistency: finalConsistency,
      duration: Math.round(elapsed),
      errorCount: incorrect,
      correctChars: correctKeystrokes,
      incorrectChars: incorrect,
      extraChars: 0,
      mistakeDetails: { ...mistakeMapRef.current },
      timelineData: [...secondMetricsRef.current],
      mode: initialMode || settings.mode,
      language: settings.language,
    };

    setCompletedResult(payload);
    recordMistakes(payload.mistakeDetails);

    if (onFinish) {
      onFinish(payload);
    }

    // Submit score to API
    try {
      await fetch('/api/typing-results', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...payload,
          totalKeystrokes,
        }),
      });
    } catch (err) {
      console.warn('Could not post score to server:', err);
    }
  }, [
    correctKeystrokes,
    initialMode,
    onFinish,
    recordMistakes,
    settings.language,
    settings.mode,
    startTime,
    totalKeystrokes,
  ]);

  // Timer tick for time mode
  useEffect(() => {
    if (isTestActive && settings.mode === 'time') {
      timerIntervalRef.current = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            handleFinishTest();
            return 0;
          }
          const nextTime = prev - 1;
          const elapsed = settings.duration - nextTime;

          const curWpm = calculateWpm(correctKeystrokes, elapsed);
          const curRaw = calculateRawWpm(totalKeystrokes, elapsed);
          const curAcc = calculateAccuracy(correctKeystrokes, totalKeystrokes);

          secondMetricsRef.current.push({
            second: elapsed,
            wpm: curWpm,
            rawWpm: curRaw,
            errors: Object.values(mistakeMapRef.current).reduce((a, b) => a + b, 0),
            accuracy: curAcc,
          });

          setLiveWpm(curWpm);
          return nextTime;
        });
      }, 1000);
    }

    return () => {
      if (timerIntervalRef.current) {
        clearInterval(timerIntervalRef.current);
      }
    };
  }, [
    isTestActive,
    settings.mode,
    settings.duration,
    correctKeystrokes,
    totalKeystrokes,
    handleFinishTest,
  ]);

  // Handle typing input
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (isFinished) return;

    const val = e.target.value;
    const isFirstKeystroke = !isTestActive && val.length > 0;

    if (isFirstKeystroke) {
      setIsTestActive(true);
      setStartTime(Date.now());
    }

    const targetWord = wordsList[currentWordIndex] || '';

    // Handle space key -> advance to next word
    if (val.endsWith(' ')) {
      const typedWord = val.trim();
      const isWordCorrect = typedWord === targetWord;

      sound.playKeypress(!isWordCorrect);

      setTotalKeystrokes((prev) => prev + 1);
      if (isWordCorrect) {
        setCorrectKeystrokes((prev) => prev + targetWord.length + 1);
      } else {
        mistakeMapRef.current['Space'] = (mistakeMapRef.current['Space'] || 0) + 1;
      }

      setCompletedWords((prev) => [...prev, typedWord]);
      setCurrentInput('');

      const nextIndex = currentWordIndex + 1;
      if (nextIndex >= wordsList.length) {
        handleFinishTest();
      } else {
        setCurrentWordIndex(nextIndex);
      }
      return;
    }

    // Key-by-key evaluation inside current word
    const isAdding = val.length > currentInput.length;
    if (isAdding) {
      const charIndex = val.length - 1;
      const expectedChar = targetWord[charIndex];
      const typedChar = val[charIndex];
      const isCharCorrect = typedChar === expectedChar;

      sound.playKeypress(!isCharCorrect);

      setTotalKeystrokes((prev) => prev + 1);
      if (isCharCorrect) {
        setCorrectKeystrokes((prev) => prev + 1);
      } else if (expectedChar) {
        const k = expectedChar.toLowerCase();
        mistakeMapRef.current[k] = (mistakeMapRef.current[k] || 0) + 1;
      }
    }

    setCurrentInput(val);
  };

  // Keyboard shortcut listener for restart
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' || (e.key === 'Enter' && e.shiftKey)) {
        e.preventDefault();
        initTestText();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [initTestText]);

  // Current active character target for virtual keyboard
  const activeWord = wordsList[currentWordIndex] || '';
  const activeChar =
    currentInput.length < activeWord.length
      ? activeWord[currentInput.length]
      : ' ';

  if (isFinished && completedResult) {
    return (
      <ResultsModal
        result={completedResult}
        onRetry={initTestText}
        onNewTest={initTestText}
      />
    );
  }

  return (
    <div className="w-full max-w-[760px] mx-auto flex flex-col items-center select-none font-sans px-2">
      {/* 1. Mode Selection Floating Pills Bar */}
      <div className="mb-6 w-full flex justify-center">
        <TestSettingsBar onRestart={initTestText} disabled={isTestActive} />
      </div>

      {/* 2. Greeting and Quests Row - aligned to exact max-w-[760px] width */}
      <div className="w-full flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6 px-1">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-[#1E232E]">
            {greeting}
          </h2>
          <p className="text-xs text-[#8A94A6] mt-0.5 font-medium">
            Best <strong className="text-[#1E232E] font-bold">32 wpm</strong> •{' '}
            <strong className="text-[#1E232E] font-bold">28</strong> to go until your goal of 60.
          </p>
        </div>

        <div className="flex items-center gap-2 flex-wrap text-xs font-semibold">
          {/* 1 day streak */}
          <button
            onClick={() => setShowStreakModal(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white border border-[#FFD7CC] text-[#FF5E3A] shadow-sm hover:bg-[#FFE8DF]/50 transition-colors"
          >
            <Clock className="w-3.5 h-3.5" />
            <span>1 day</span>
          </button>

          {/* Today's challenge */}
          <button
            onClick={() => setShowChallengeModal(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white border border-[#FFD7CC] text-[#FF5E3A] shadow-sm hover:bg-[#FFE8DF]/50 transition-colors"
          >
            <Calendar className="w-3.5 h-3.5" />
            <span>today&apos;s challenge</span>
          </button>

          {/* Quests */}
          <button
            onClick={() => setShowQuestsModal(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white border border-[#FFD7CC] text-[#FF5E3A] shadow-sm hover:bg-[#FFE8DF]/50 transition-colors"
          >
            <Target className="w-3.5 h-3.5" />
            <span>quests</span>
            <span className="text-[#FFB8A5] font-bold">•••</span>
          </button>

          {/* Circular level progress badge */}
          <div className="relative w-8 h-8 rounded-full bg-white border-2 border-[#E8ECF2] border-t-[#FF5E3A] flex items-center justify-center font-bold text-xs text-[#1E232E] shadow-sm">
            <span>1</span>
          </div>
        </div>
      </div>

      {/* 3. Main Typing Text Flow - Compact 3-Line Window (Text sal kamroq bo'lsin!) */}
      <div
        ref={wordsContainerRef}
        onClick={() => inputRef.current?.focus()}
        className="w-full h-[148px] overflow-hidden cursor-text relative select-none leading-[2.1] tracking-wide text-2xl sm:text-[26px] font-sans font-bold px-1 focus:outline-none"
      >
        <input
          ref={inputRef}
          type="text"
          value={currentInput}
          onChange={handleInputChange}
          className="absolute opacity-0 pointer-events-none inset-0 w-full h-full"
          autoFocus
          spellCheck={false}
          autoComplete="off"
          autoCapitalize="off"
        />

        {/* Word stream matching exact user screenshot */}
        <div className="flex flex-wrap gap-x-3.5 gap-y-2 items-baseline text-[#8C96A8]">
          {wordsList.map((word, wordIdx) => {
            const isCompleted = wordIdx < currentWordIndex;
            const isCurrent = wordIdx === currentWordIndex;

            if (isCompleted) {
              return (
                <span key={wordIdx} className="text-[#8C96A8]/65 transition-colors">
                  {word}
                </span>
              );
            }

            if (isCurrent) {
              const activeCharIndex = currentInput.length;
              return (
                <span
                  key={wordIdx}
                  ref={activeWordRef}
                  className="inline-flex items-center bg-[#FFE8DF] rounded-xl px-1.5 py-0.5 shadow-sm transition-all"
                >
                  {word.split('').map((char, charIdx) => {
                    const isTyped = charIdx < currentInput.length;
                    const isCharCurrent = charIdx === activeCharIndex;
                    const isCharCorrect = isTyped && currentInput[charIdx] === char;
                    const isCharIncorrect = isTyped && !isCharCorrect;

                    if (isCharCurrent) {
                      // Solid coral badge with white letter matching screenshot exactly
                      return (
                        <span
                          key={charIdx}
                          className="inline-flex items-center justify-center bg-[#FF5E3A] text-white rounded-lg px-2 py-0.5 font-bold shadow-[0_4px_12px_rgba(255,94,58,0.45)]"
                        >
                          {char}
                        </span>
                      );
                    }

                    if (isCharIncorrect) {
                      return (
                        <span
                          key={charIdx}
                          className="text-[#EB5757] bg-red-100 rounded px-1 underline"
                        >
                          {char}
                        </span>
                      );
                    }

                    if (isCharCorrect) {
                      return (
                        <span key={charIdx} className="text-[#1E232E] px-0.5">
                          {char}
                        </span>
                      );
                    }

                    return (
                      <span key={charIdx} className="text-[#374151] px-0.5">
                        {char}
                      </span>
                    );
                  })}
                </span>
              );
            }

            // Untyped future words
            return (
              <span key={wordIdx} className="text-[#8C96A8]">
                {word}
              </span>
            );
          })}
        </div>
      </div>

      {/* 4. Center Circular Reload Button */}
      <div className="flex justify-center my-5">
        <button
          onClick={initTestText}
          title="Restart Test (Esc)"
          className="w-11 h-11 rounded-full bg-white hover:bg-[#FFE8DF] border border-[#E8ECF2] shadow-sm flex items-center justify-center text-[#8C96A8] hover:text-[#FF5E3A] hover:border-[#FF5E3A] transition-all"
        >
          <RotateCcw className="w-4 h-4" />
        </button>
      </div>

      {/* 5. Bottom Virtual Keyboard - 100% matched width to text block (max-w-[760px]) */}
      <div className="w-full">
        <OnlyTypingKeyboard activeChar={activeChar} />
      </div>

      {/* Modals for Today's Challenge, Quests, and Streak */}
      {showChallengeModal && (
        <div className="fixed inset-0 bg-black/30 backdrop-blur-xs flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-3xl p-6 max-w-md w-full shadow-2xl border border-border space-y-4 animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between border-b border-border pb-3">
              <div className="flex items-center gap-2 text-[#FF5E3A] font-bold">
                <Calendar className="w-5 h-5" />
                <span>Today&apos;s Daily Challenge</span>
              </div>
              <button
                onClick={() => setShowChallengeModal(false)}
                className="p-1 rounded-full text-slate-400 hover:text-slate-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <p className="text-sm text-[#1E232E] font-medium leading-relaxed">
              Reach at least <strong>60 WPM</strong> with <strong>95% accuracy</strong> in a standard 60-second test today.
            </p>
            <div className="p-3 rounded-2xl bg-[#FFE8DF] text-xs font-semibold text-[#FF5E3A] flex items-center justify-between">
              <span>Reward</span>
              <span>+150 XP Points</span>
            </div>
            <button
              onClick={() => {
                setShowChallengeModal(false);
                initTestText();
              }}
              className="w-full py-3 rounded-2xl bg-[#FF5E3A] text-white font-bold text-xs shadow-coral hover:bg-[#FF471D]"
            >
              Start Challenge
            </button>
          </div>
        </div>
      )}

      {showQuestsModal && (
        <div className="fixed inset-0 bg-black/30 backdrop-blur-xs flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-3xl p-6 max-w-md w-full shadow-2xl border border-border space-y-4 animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between border-b border-border pb-3">
              <div className="flex items-center gap-2 text-[#FF5E3A] font-bold">
                <Target className="w-5 h-5" />
                <span>Daily Quests</span>
              </div>
              <button
                onClick={() => setShowQuestsModal(false)}
                className="p-1 rounded-full text-slate-400 hover:text-slate-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="space-y-3 text-xs">
              <div className="p-3 rounded-2xl bg-slate-50 border border-slate-200">
                <div className="flex justify-between font-bold text-[#1E232E] mb-1">
                  <span>Complete 3 typing tests</span>
                  <span className="text-[#FF5E3A]">1 / 3</span>
                </div>
                <div className="w-full h-2 bg-slate-200 rounded-full overflow-hidden">
                  <div className="w-1/3 h-full bg-[#FF5E3A] rounded-full" />
                </div>
              </div>
              <div className="p-3 rounded-2xl bg-slate-50 border border-slate-200">
                <div className="flex justify-between font-bold text-[#1E232E] mb-1">
                  <span>Maintain 96%+ accuracy</span>
                  <span className="text-[#27AE60]">✓ Done</span>
                </div>
                <div className="w-full h-2 bg-slate-200 rounded-full overflow-hidden">
                  <div className="w-full h-full bg-[#27AE60] rounded-full" />
                </div>
              </div>
              <div className="p-3 rounded-2xl bg-slate-50 border border-slate-200">
                <div className="flex justify-between font-bold text-[#1E232E] mb-1">
                  <span>Break 40 WPM milestone</span>
                  <span className="text-slate-400">32 / 40</span>
                </div>
                <div className="w-full h-2 bg-slate-200 rounded-full overflow-hidden">
                  <div className="w-4/5 h-full bg-[#FF5E3A] rounded-full" />
                </div>
              </div>
            </div>
            <button
              onClick={() => setShowQuestsModal(false)}
              className="w-full py-2.5 rounded-2xl bg-[#FF5E3A] text-white font-bold text-xs"
            >
              Got It
            </button>
          </div>
        </div>
      )}

      {showStreakModal && (
        <div className="fixed inset-0 bg-black/30 backdrop-blur-xs flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-3xl p-6 max-w-sm w-full shadow-2xl border border-border space-y-4 text-center animate-in fade-in zoom-in-95">
            <div className="w-14 h-14 rounded-full bg-[#FFE8DF] text-[#FF5E3A] flex items-center justify-center mx-auto">
              <Flame className="w-8 h-8 fill-[#FF5E3A]" />
            </div>
            <h3 className="text-xl font-bold text-[#1E232E]">1 Day Streak!</h3>
            <p className="text-xs text-[#8A94A6] leading-relaxed">
              Practice every day to build finger memory and keep your streak alive. Reach 7 days for the <em>Unbreakable Habit</em> achievement.
            </p>
            <button
              onClick={() => setShowStreakModal(false)}
              className="w-full py-2.5 rounded-2xl bg-[#FF5E3A] text-white font-bold text-xs"
            >
              Continue Practice
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
