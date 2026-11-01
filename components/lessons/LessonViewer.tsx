'use client';

import React, { useState, useEffect, useRef } from 'react';
import { CheckCircle2, RotateCcw, ArrowRight, ArrowLeft, Trophy, Target, Award } from 'lucide-react';
import VirtualHandsKeyboard from './VirtualHandsKeyboard';
import { calculateWpm, calculateAccuracy } from '@/lib/typing-engine';
import sound from '@/lib/sound';

export interface LessonData {
  id: string;
  lessonNumber: number;
  title: string;
  description: string;
  level: string;
  targetKeys: string;
  instructions: string;
  practiceText: string;
  minWpm: number;
  minAccuracy: number;
  order: number;
}

interface LessonViewerProps {
  lesson: LessonData;
  onNextLesson?: () => void;
  onPreviousLesson?: () => void;
  onBackToList?: () => void;
}

export default function LessonViewer({
  lesson,
  onNextLesson,
  onPreviousLesson,
  onBackToList,
}: LessonViewerProps) {
  const [userInput, setUserInput] = useState('');
  const [isStarted, setIsStarted] = useState(false);
  const [startTime, setStartTime] = useState<number | null>(null);
  const [isCompleted, setIsCompleted] = useState(false);
  const [passed, setPassed] = useState(false);

  // Metrics
  const [wpm, setWpm] = useState(0);
  const [accuracy, setAccuracy] = useState(100);
  const [correctChars, setCorrectChars] = useState(0);
  const [totalChars, setTotalChars] = useState(0);

  const inputRef = useRef<HTMLInputElement>(null);
  const text = lesson.practiceText;

  // Active key needed next
  const nextTargetChar = userInput.length < text.length ? text[userInput.length] : '';

  const resetLesson = () => {
    setUserInput('');
    setIsStarted(false);
    setStartTime(null);
    setIsCompleted(false);
    setPassed(false);
    setWpm(0);
    setAccuracy(100);
    setCorrectChars(0);
    setTotalChars(0);
    setTimeout(() => inputRef.current?.focus(), 50);
  };

  useEffect(() => {
    resetLesson();
  }, [lesson.id]);

  const handleInputChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (isCompleted) return;

    const val = e.target.value;
    if (!isStarted && val.length === 1) {
      setIsStarted(true);
      setStartTime(Date.now());
    }

    const lastIdx = val.length - 1;
    const isAdding = val.length > userInput.length;

    let newCorrect = correctChars;
    let newTotal = totalChars;

    if (isAdding && lastIdx < text.length) {
      newTotal += 1;
      const isCharCorrect = val[lastIdx] === text[lastIdx];
      sound.playKeypress(!isCharCorrect);

      if (isCharCorrect) {
        newCorrect += 1;
      }
    }

    setCorrectChars(newCorrect);
    setTotalChars(newTotal);
    setUserInput(val);

    const elapsed = startTime ? Math.max(1, (Date.now() - startTime) / 1000) : 1;
    const currentWpm = calculateWpm(newCorrect, elapsed);
    const currentAcc = calculateAccuracy(newCorrect, newTotal);
    setWpm(currentWpm);
    setAccuracy(currentAcc);

    // Finished lesson text
    if (val.length >= text.length) {
      setIsCompleted(true);
      const isPassed = currentWpm >= lesson.minWpm && currentAcc >= lesson.minAccuracy;
      setPassed(isPassed);

      if (isPassed) {
        sound.playSuccessChime();
        if (typeof window !== 'undefined') {
          import('canvas-confetti').then((mod) => {
            mod.default({
              particleCount: 70,
              spread: 60,
              origin: { y: 0.6 },
              colors: ['#E8B44F', '#42C98A'],
            });
          }).catch(() => {});
        }
      }

      // Record progress to API
      try {
        await fetch('/api/lessons', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            lessonId: lesson.id,
            wpm: currentWpm,
            accuracy: currentAcc,
          }),
        });
      } catch (err) {
        console.warn('Could not save lesson progress:', err);
      }
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto flex flex-col items-center">
      {/* Top Header & Breadcrumb */}
      <div className="w-full flex items-center justify-between mb-4">
        <button
          onClick={onBackToList}
          className="flex items-center gap-1.5 text-xs text-text-secondary hover:text-text-primary transition-colors font-mono"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Curriculum</span>
        </button>

        <div className="flex items-center gap-2">
          {onPreviousLesson && (
            <button
              onClick={onPreviousLesson}
              className="p-1.5 rounded-lg bg-secondary-bg hover:bg-card-bg border border-border text-xs text-text-secondary"
            >
              Previous
            </button>
          )}
          {onNextLesson && (
            <button
              onClick={onNextLesson}
              className="p-1.5 rounded-lg bg-secondary-bg hover:bg-card-bg border border-border text-xs text-text-secondary"
            >
              Next
            </button>
          )}
        </div>
      </div>

      {/* Lesson Details Banner */}
      <div className="w-full p-6 rounded-2xl bg-secondary-bg border border-border mb-6">
        <div className="flex flex-wrap items-center justify-between gap-3 mb-2">
          <div className="flex items-center gap-2.5">
            <span className="px-2.5 py-1 rounded-md bg-accent-muted text-accent font-mono text-xs font-bold">
              Lesson {lesson.lessonNumber}
            </span>
            <span className="px-2 py-0.5 rounded-md bg-card-bg border border-border text-[11px] text-text-secondary uppercase">
              {lesson.level}
            </span>
          </div>

          <div className="flex items-center gap-4 text-xs font-mono text-text-secondary">
            <span>Target: {lesson.minWpm} WPM</span>
            <span>Min Accuracy: {lesson.minAccuracy}%</span>
          </div>
        </div>

        <h2 className="text-xl font-bold text-text-primary mb-1">{lesson.title}</h2>
        <p className="text-xs text-text-secondary leading-relaxed mb-3">{lesson.description}</p>
        <div className="p-3 rounded-xl bg-card-bg/60 border border-border/80 text-xs text-accent">
          <span className="font-semibold">Technique: </span>
          {lesson.instructions}
        </div>
      </div>

      {/* Live Metrics Header */}
      <div className="w-full flex items-center justify-between mb-4 px-2 font-mono text-xs">
        <div className="flex items-center space-x-6">
          <div>
            <span className="text-[10px] text-text-muted uppercase">Progress</span>
            <div className="text-lg font-bold text-accent">
              {Math.min(100, Math.round((userInput.length / text.length) * 100))}%
            </div>
          </div>
          <div>
            <span className="text-[10px] text-text-muted uppercase">WPM</span>
            <div className="text-lg font-bold text-text-primary">{wpm}</div>
          </div>
          <div>
            <span className="text-[10px] text-text-muted uppercase">Accuracy</span>
            <div className="text-lg font-bold text-success">{accuracy}%</div>
          </div>
        </div>

        <button
          onClick={resetLesson}
          className="flex items-center gap-1.5 p-2 rounded-lg bg-secondary-bg hover:bg-card-bg border border-border text-xs text-text-secondary hover:text-accent"
        >
          <RotateCcw className="w-4 h-4" />
          <span>Reset</span>
        </button>
      </div>

      {/* Interactive Typing Practice Box */}
      <div
        onClick={() => inputRef.current?.focus()}
        className="w-full min-h-[140px] p-6 rounded-2xl bg-secondary-bg/95 border border-border hover:border-accent/40 transition-colors cursor-text relative select-none leading-relaxed tracking-wide font-mono text-xl sm:text-2xl shadow-lg mb-6"
      >
        <input
          ref={inputRef}
          type="text"
          value={userInput}
          onChange={handleInputChange}
          className="absolute opacity-0 pointer-events-none inset-0 w-full h-full"
          autoFocus
          spellCheck={false}
        />

        <div className="flex flex-wrap gap-y-2">
          {text.split('').map((char, index) => {
            const isTyped = index < userInput.length;
            const isCurrent = index === userInput.length;
            const isCorrect = isTyped && userInput[index] === char;
            const isIncorrect = isTyped && !isCorrect;

            let charColor = 'text-text-muted';
            if (isCorrect) charColor = 'text-text-primary';
            if (isIncorrect) charColor = 'text-error bg-error/20 rounded';

            return (
              <span key={index} className="relative inline-block">
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
      </div>

      {/* Lesson Completed Summary Banner */}
      {isCompleted && (
        <div
          className={`w-full p-6 rounded-2xl border mb-6 text-center animate-in fade-in zoom-in-95 ${
            passed
              ? 'bg-success-muted border-success/40 text-text-primary'
              : 'bg-card-bg border-error/40 text-text-primary'
          }`}
        >
          <div className="inline-flex p-3 rounded-full mb-3 bg-secondary-bg">
            {passed ? (
              <Trophy className="w-8 h-8 text-accent" />
            ) : (
              <RotateCcw className="w-8 h-8 text-error" />
            )}
          </div>
          <h3 className="text-xl font-bold mb-1">
            {passed ? 'Lesson Mastered!' : 'Needs More Practice'}
          </h3>
          <p className="text-xs text-text-secondary max-w-md mx-auto mb-4">
            {passed
              ? `Outstanding! You achieved ${wpm} WPM with ${accuracy}% accuracy (Requirement: ${lesson.minWpm} WPM / ${lesson.minAccuracy}% acc).`
              : `You achieved ${wpm} WPM with ${accuracy}% accuracy. Minimum required: ${lesson.minWpm} WPM with ${lesson.minAccuracy}% accuracy.`}
          </p>

          <div className="flex items-center justify-center gap-3">
            <button
              onClick={resetLesson}
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-card-bg hover:bg-elevated-bg border border-border text-xs text-text-primary"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Retry Lesson</span>
            </button>

            {passed && onNextLesson && (
              <button
                onClick={onNextLesson}
                className="flex items-center gap-1.5 px-5 py-2 rounded-xl bg-accent text-background font-semibold text-xs hover:bg-accent-hover shadow-sm"
              >
                <span>Next Lesson</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>
      )}

      {/* Hands Guide Keyboard Visualizer */}
      <VirtualHandsKeyboard
        activeKey={nextTargetChar}
        targetKeys={lesson.targetKeys.split(',')}
      />
    </div>
  );
}
