'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { RotateCcw, Volume2, VolumeX, AlertCircle } from 'lucide-react';
import TestSettingsBar from './TestSettingsBar';
import ResultsModal from './ResultsModal';
import { useAppStore, TypingResultPayload } from '@/lib/store';
import {
  generateTestText,
  generateWeakKeyText,
} from '@/lib/word-banks';
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
  const [userInput, setUserInput] = useState<string>('');
  const [isTestActive, setIsTestActive] = useState<boolean>(false);
  const [isFinished, setIsFinished] = useState<boolean>(false);
  const [timeLeft, setTimeLeft] = useState<number>(settings.duration);
  const [startTime, setStartTime] = useState<number | null>(null);

  // Live stats
  const [liveWpm, setLiveWpm] = useState<number>(0);
  const [liveRawWpm, setLiveRawWpm] = useState<number>(0);
  const [liveAccuracy, setLiveAccuracy] = useState<number>(100);
  const [correctKeystrokes, setCorrectKeystrokes] = useState<number>(0);
  const [totalKeystrokes, setTotalKeystrokes] = useState<number>(0);

  // Tracking details
  const mistakeMapRef = useRef<Record<string, number>>({});
  const secondMetricsRef = useRef<SecondMetric[]>([]);
  const timerIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Completed result state
  const [completedResult, setCompletedResult] = useState<TypingResultPayload | null>(null);

  // Initialize or reset text
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
    setUserInput('');
    setIsTestActive(false);
    setIsFinished(false);
    setTimeLeft(settings.duration);
    setStartTime(null);
    setLiveWpm(0);
    setLiveRawWpm(0);
    setLiveAccuracy(100);
    setCorrectKeystrokes(0);
    setTotalKeystrokes(0);
    mistakeMapRef.current = {};
    secondMetricsRef.current = [];
    setCompletedResult(null);

    if (timerIntervalRef.current) {
      clearInterval(timerIntervalRef.current);
      timerIntervalRef.current = null;
    }

    setTimeout(() => {
      inputRef.current?.focus();
    }, 50);
  }, [
    customProvidedText,
    initialMode,
    settings.duration,
    settings.language,
    settings.mode,
    settings.numbers,
    settings.punctuation,
    settings.wordCount,
    settings.customText,
  ]);

  useEffect(() => {
    initTestText();
  }, [initTestText]);

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

    // Count character stats
    let correct = 0;
    let incorrect = 0;
    const minLen = Math.min(text.length, userInput.length);
    for (let i = 0; i < minLen; i++) {
      if (userInput[i] === text[i]) correct++;
      else incorrect++;
    }

    const payload: TypingResultPayload = {
      wpm: finalWpm,
      rawWpm: finalRaw,
      accuracy: finalAcc,
      consistency: finalConsistency,
      duration: Math.round(elapsed),
      errorCount: incorrect,
      correctChars: correct,
      incorrectChars: incorrect,
      extraChars: Math.max(0, userInput.length - text.length),
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

    // Submit score to database API
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
    text,
    totalKeystrokes,
    userInput,
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

          // Record second-by-second metric for charts & consistency
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
          setLiveRawWpm(curRaw);
          setLiveAccuracy(curAcc);

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
    const isFirstKeystroke = !isTestActive && val.length === 1;

    // Start timer on first keystroke
    if (isFirstKeystroke) {
      setIsTestActive(true);
      setStartTime(Date.now());
    }

    const lastCharIdx = val.length - 1;
    const isAdding = val.length > userInput.length;

    if (isAdding && lastCharIdx < text.length) {
      const typedChar = val[lastCharIdx];
      const expectedChar = text[lastCharIdx];
      const isCorrect = typedChar === expectedChar;

      // Play synthesized audio click
      sound.playKeypress(!isCorrect);

      setTotalKeystrokes((prev) => prev + 1);
      if (isCorrect) {
        setCorrectKeystrokes((prev) => prev + 1);
      } else {
        const key = expectedChar === ' ' ? 'Space' : expectedChar.toLowerCase();
        mistakeMapRef.current[key] = (mistakeMapRef.current[key] || 0) + 1;
      }
    }

    setUserInput(val);

    // Check completion in word count or quote mode
    if (
      (settings.mode === 'words' || settings.mode === 'quote' || settings.mode === 'custom') &&
      val.length >= text.length
    ) {
      setTimeout(() => {
        handleFinishTest();
      }, 50);
    }
  };

  // Prevent paste during standard tests
  const handlePaste = (e: React.ClipboardEvent) => {
    if (settings.mode !== 'custom') {
      e.preventDefault();
    }
  };

  // Keyboard shortcut listener for quick restart (Tab + Enter or Esc)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.preventDefault();
        initTestText();
      } else if (e.key === 'Enter' && e.shiftKey) {
        e.preventDefault();
        initTestText();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [initTestText]);

  // Click on area to focus input
  const handleFocusClick = () => {
    inputRef.current?.focus();
  };

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
    <div className="w-full max-w-4xl mx-auto flex flex-col items-center">
      {/* Top Test Settings Bar */}
      <div className="mb-6 w-full flex justify-center">
        <TestSettingsBar onRestart={initTestText} disabled={isTestActive} />
      </div>

      {/* Live Stats Header */}
      <div className="w-full flex items-center justify-between mb-4 px-3 font-mono text-xs">
        <div className="flex items-center space-x-6">
          <div className="flex flex-col">
            <span className="text-[10px] uppercase tracking-wider text-text-muted">
              {settings.mode === 'time' ? 'Time Left' : 'Progress'}
            </span>
            <span className="text-xl font-bold text-accent">
              {settings.mode === 'time' ? `${timeLeft}s` : `${userInput.length}/${text.length}`}
            </span>
          </div>

          <div className="flex flex-col">
            <span className="text-[10px] uppercase tracking-wider text-text-muted">Live WPM</span>
            <span className="text-xl font-bold text-text-primary">{liveWpm}</span>
          </div>

          <div className="flex flex-col">
            <span className="text-[10px] uppercase tracking-wider text-text-muted">Accuracy</span>
            <span className="text-xl font-bold text-success">{liveAccuracy}%</span>
          </div>
        </div>

        <button
          onClick={initTestText}
          title="Restart Test (Esc)"
          className="p-2 rounded-lg bg-secondary-bg hover:bg-card-bg border border-border text-text-secondary hover:text-accent transition-colors flex items-center gap-1.5"
        >
          <RotateCcw className="w-4 h-4" />
          <span className="text-[11px] hidden sm:inline">Restart</span>
        </button>
      </div>

      {/* Main Interactive Typing Area */}
      <div
        ref={containerRef}
        onClick={handleFocusClick}
        className="w-full min-h-[160px] p-6 sm:p-8 rounded-2xl bg-secondary-bg/90 border border-border hover:border-border-light transition-all cursor-text relative select-none leading-relaxed tracking-wide font-mono text-xl sm:text-2xl shadow-lg backdrop-blur-sm"
      >
        {/* Hidden Input field capturing keystrokes */}
        <input
          ref={inputRef}
          type="text"
          value={userInput}
          onChange={handleInputChange}
          onPaste={handlePaste}
          className="absolute opacity-0 pointer-events-none inset-0 w-full h-full"
          autoFocus
          spellCheck={false}
          autoComplete="off"
          autoCapitalize="off"
        />

        {/* Character by character rendering */}
        <div className="flex flex-wrap gap-y-2 text-text-muted">
          {text.split('').map((char, index) => {
            const isTyped = index < userInput.length;
            const typedChar = userInput[index];
            const isCurrent = index === userInput.length;
            const isCorrect = isTyped && typedChar === char;
            const isIncorrect = isTyped && !isCorrect;

            let charColor = 'text-text-muted';
            if (isCorrect) charColor = 'text-text-primary';
            if (isIncorrect) charColor = 'text-error bg-error/15 rounded-sm';

            return (
              <span key={index} className="relative inline-block">
                {/* Smooth blinking vertical caret at current cursor position */}
                {isCurrent && (
                  <span className="absolute -left-[1px] top-1 bottom-1 w-[2.5px] bg-accent rounded-full animate-blink z-10" />
                )}
                <span className={charColor}>
                  {char === ' ' && isIncorrect ? '_' : char}
                </span>
              </span>
            );
          })}
        </div>

        {/* Start Hint */}
        {!isTestActive && userInput.length === 0 && (
          <div className="mt-6 flex items-center justify-center text-xs text-text-muted font-mono gap-2">
            <span className="w-2 h-2 rounded-full bg-accent animate-ping" />
            <span>Type any character to start the test • Tab + Enter to restart</span>
          </div>
        )}
      </div>

      {/* Bottom Shortcuts Hint Bar */}
      <div className="mt-4 flex items-center justify-between w-full text-xs text-text-muted font-mono px-2">
        <div className="flex items-center gap-3">
          <span>
            <kbd className="px-1.5 py-0.5 rounded bg-secondary-bg border border-border text-text-secondary text-[11px]">
              Esc
            </kbd>{' '}
            restart
          </span>
          <span>
            <kbd className="px-1.5 py-0.5 rounded bg-secondary-bg border border-border text-text-secondary text-[11px]">
              Shift+Enter
            </kbd>{' '}
            restart
          </span>
        </div>
        <div className="text-[11px] text-text-secondary">
          Sound: <span className="text-accent capitalize">{soundTheme}</span>
        </div>
      </div>
    </div>
  );
}
