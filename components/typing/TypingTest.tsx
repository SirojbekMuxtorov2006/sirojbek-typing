'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { RotateCcw, Clock, Calendar, Target } from 'lucide-react';
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

  // Tracking
  const mistakeMapRef = useRef<Record<string, number>>({});
  const secondMetricsRef = useRef<SecondMetric[]>([]);
  const timerIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

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

      setTotalKeystrokes((prev) => prev + 1); // count the space keystroke
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
    <div className="w-full max-w-4xl mx-auto flex flex-col items-center select-none font-sans">
      {/* 1. Mode Selection Floating Pills Bar */}
      <div className="mb-8 w-full flex justify-center">
        <TestSettingsBar onRestart={initTestText} disabled={isTestActive} />
      </div>

      {/* 2. Greeting and Quests Row - exactly matching the screenshot! */}
      <div className="w-full flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8 px-1">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-[#1E232E]">
            {greeting}
          </h2>
          <p className="text-xs text-[#8A94A6] mt-0.5">
            Best <strong className="text-[#1E232E] font-semibold">32 wpm</strong> •{' '}
            <strong className="text-[#1E232E] font-semibold">28</strong> to go until your goal of 60.
          </p>
        </div>

        <div className="flex items-center gap-2 flex-wrap text-xs font-medium">
          {/* 1 day streak */}
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white border border-[#FFD7CC] text-[#FF5E3A] shadow-sm">
            <Clock className="w-3.5 h-3.5" />
            <span>1 day</span>
          </div>

          {/* Today's challenge */}
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white border border-[#FFD7CC] text-[#FF5E3A] shadow-sm">
            <Calendar className="w-3.5 h-3.5" />
            <span>today&apos;s challenge</span>
          </div>

          {/* Quests */}
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white border border-[#FFD7CC] text-[#FF5E3A] shadow-sm">
            <Target className="w-3.5 h-3.5" />
            <span>quests</span>
            <span className="text-[#FFB8A5] font-bold">•••</span>
          </div>

          {/* Circular level progress badge */}
          <div className="relative w-8 h-8 rounded-full bg-white border-2 border-[#E8ECF2] border-t-[#FF5E3A] flex items-center justify-center font-bold text-xs text-[#1E232E] shadow-sm">
            <span>1</span>
          </div>
        </div>
      </div>

      {/* 3. Main Typing Text Flow */}
      <div
        onClick={() => inputRef.current?.focus()}
        className="w-full min-h-[180px] p-2 sm:p-4 cursor-text relative select-none leading-relaxed tracking-wide text-2xl sm:text-3xl font-sans font-bold mb-6 focus:outline-none"
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

        {/* Word by word rendering matching screenshot 1 and 2 */}
        <div className="flex flex-wrap gap-x-4 gap-y-3.5 items-baseline text-[#8C96A8]">
          {wordsList.map((word, wordIdx) => {
            const isCompleted = wordIdx < currentWordIndex;
            const isCurrent = wordIdx === currentWordIndex;

            if (isCompleted) {
              return (
                <span key={wordIdx} className="text-[#8C96A8]/75 transition-colors">
                  {word}
                </span>
              );
            }

            if (isCurrent) {
              const activeCharIndex = currentInput.length;
              return (
                <span
                  key={wordIdx}
                  className="inline-flex items-center bg-[#FFF0EA] rounded-xl px-1 py-0.5 shadow-sm transition-all"
                >
                  {word.split('').map((char, charIdx) => {
                    const isTyped = charIdx < currentInput.length;
                    const isCharCurrent = charIdx === activeCharIndex;
                    const isCharCorrect = isTyped && currentInput[charIdx] === char;
                    const isCharIncorrect = isTyped && !isCharCorrect;

                    if (isCharCurrent) {
                      // EXACT active character box: vivid coral box with crisp white letter!
                      return (
                        <span
                          key={charIdx}
                          className="inline-flex items-center justify-center bg-[#FF5E3A] text-white rounded-lg px-2 py-0.5 font-bold shadow-[0_4px_12px_rgba(255,94,58,0.45)] animate-in zoom-in-95 duration-150"
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
                        <span key={charIdx} className="text-[#2D3748] px-0.5">
                          {char}
                        </span>
                      );
                    }

                    return (
                      <span key={charIdx} className="text-[#4A5568] px-0.5">
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
      <div className="flex justify-center mb-8">
        <button
          onClick={initTestText}
          title="Restart Test (Esc)"
          className="w-11 h-11 rounded-full bg-white hover:bg-[#FFF0EA] border border-border shadow-sm flex items-center justify-center text-[#8A94A6] hover:text-[#FF5E3A] hover:border-[#FF5E3A] transition-all"
        >
          <RotateCcw className="w-4 h-4" />
        </button>
      </div>

      {/* 5. Bottom Virtual Keyboard (exact soft peach design from screenshot!) */}
      <div className="w-full">
        <OnlyTypingKeyboard activeChar={activeChar} />
      </div>
    </div>
  );
}
