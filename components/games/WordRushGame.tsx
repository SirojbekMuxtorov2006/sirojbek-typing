'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Play, Pause, RotateCcw, Heart, Flame, Trophy, Volume2, ArrowLeft } from 'lucide-react';
import { ENGLISH_WORDS, UZBEK_WORDS } from '@/lib/word-banks';
import sound from '@/lib/sound';
import Link from 'next/link';

interface FallingWord {
  id: string;
  word: string;
  x: number; // percentage 5% to 85%
  y: number; // percentage 0% to 100%
  speed: number;
}

export default function WordRushGame() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [isGameOver, setIsGameOver] = useState(false);

  const [score, setScore] = useState(0);
  const [lives, setLives] = useState(3);
  const [level, setLevel] = useState(1);
  const [combo, setCombo] = useState(0);
  const [maxCombo, setMaxCombo] = useState(0);
  const [wordsCleared, setWordsCleared] = useState(0);

  const [inputVal, setInputVal] = useState('');
  const [words, setWords] = useState<FallingWord[]>([]);

  const requestRef = useRef<number | null>(null);
  const lastSpawnRef = useRef<number>(0);
  const inputRef = useRef<HTMLInputElement>(null);

  const spawnWord = useCallback(() => {
    const wordList = [...ENGLISH_WORDS, ...UZBEK_WORDS].filter((w) => w.length >= 3 && w.length <= 8);
    const randomWord = wordList[Math.floor(Math.random() * wordList.length)];
    const newWord: FallingWord = {
      id: Math.random().toString(36).substring(2, 9),
      word: randomWord,
      x: Math.floor(Math.random() * 75) + 10,
      y: 0,
      speed: 0.18 + level * 0.05,
    };
    setWords((prev) => [...prev, newWord]);
  }, [level]);

  // Main game loop
  const updateGame = useCallback(
    (timestamp: number) => {
      if (!isPlaying || isPaused || isGameOver) return;

      // Spawn new word based on timer
      const spawnInterval = Math.max(1200, 2400 - level * 150);
      if (timestamp - lastSpawnRef.current > spawnInterval) {
        spawnWord();
        lastSpawnRef.current = timestamp;
      }

      // Update positions
      setWords((prev) => {
        const nextWords: FallingWord[] = [];
        let lostLife = false;

        for (const w of prev) {
          const nextY = w.y + w.speed;
          if (nextY >= 92) {
            // Hit bottom!
            lostLife = true;
            sound.playKeypress(true); // error sound
          } else {
            nextWords.push({ ...w, y: nextY });
          }
        }

        if (lostLife) {
          setLives((l) => {
            const nextL = l - 1;
            if (nextL <= 0) {
              setIsGameOver(true);
              setIsPlaying(false);
              // Save game score
              fetch('/api/games', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                  gameType: 'word_rush',
                  score,
                  levelReached: level,
                  wordsCompleted: wordsCleared,
                  maxCombo,
                }),
              }).catch(() => {});
            }
            return nextL;
          });
          setCombo(0);
        }

        return nextWords;
      });

      requestRef.current = requestAnimationFrame(updateGame);
    },
    [isPlaying, isPaused, isGameOver, level, spawnWord, score, wordsCleared, maxCombo]
  );

  useEffect(() => {
    if (isPlaying && !isPaused && !isGameOver) {
      requestRef.current = requestAnimationFrame(updateGame);
    }
    return () => {
      if (requestRef.current) cancelAnimationFrame(requestRef.current);
    };
  }, [isPlaying, isPaused, isGameOver, updateGame]);

  const startGame = () => {
    setScore(0);
    setLives(3);
    setLevel(1);
    setCombo(0);
    setMaxCombo(0);
    setWordsCleared(0);
    setWords([]);
    setInputVal('');
    setIsGameOver(false);
    setIsPaused(false);
    setIsPlaying(true);
    lastSpawnRef.current = performance.now();
    setTimeout(() => inputRef.current?.focus(), 50);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value.trim().toLowerCase();
    setInputVal(val);

    // Check if input matches any currently falling word
    const matchIdx = words.findIndex((w) => w.word.toLowerCase() === val);

    if (matchIdx !== -1) {
      // Clear matched word!
      sound.playLaserSound();
      const newCombo = combo + 1;
      const points = 100 * level + newCombo * 20;

      setScore((s) => s + points);
      setCombo(newCombo);
      setMaxCombo((m) => Math.max(m, newCombo));
      setWordsCleared((w) => {
        const nextW = w + 1;
        if (nextW % 10 === 0) {
          setLevel((lvl) => lvl + 1);
          sound.playSuccessChime();
        }
        return nextW;
      });

      setWords((prev) => prev.filter((_, idx) => idx !== matchIdx));
      setInputVal('');
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto flex flex-col items-center">
      {/* Top Header */}
      <div className="w-full flex items-center justify-between mb-4">
        <Link
          href="/games"
          className="flex items-center gap-1.5 text-xs text-text-secondary hover:text-text-primary transition-colors font-mono"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>All Games</span>
        </Link>
        <span className="text-xs font-mono text-accent font-bold uppercase tracking-wider">
          Game A: Word Rush
        </span>
      </div>

      {/* Main Game Arena */}
      <div className="w-full h-[520px] rounded-2xl bg-secondary-bg border border-border shadow-2xl relative overflow-hidden flex flex-col justify-between">
        {/* Top HUD */}
        <div className="p-4 bg-card-bg/80 border-b border-border/80 flex items-center justify-between text-xs font-mono z-20">
          <div className="flex items-center gap-6">
            <div>
              <span className="text-text-muted uppercase text-[10px] block">Score</span>
              <span className="text-xl font-bold text-accent">{score}</span>
            </div>
            <div>
              <span className="text-text-muted uppercase text-[10px] block">Level</span>
              <span className="text-xl font-bold text-text-primary">{level}</span>
            </div>
            <div>
              <span className="text-text-muted uppercase text-[10px] block">Combo</span>
              <span className="text-xl font-bold text-success flex items-center gap-1">
                <Flame className="w-4 h-4" />
                <span>{combo}x</span>
              </span>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="flex items-center gap-1 text-error">
              {Array.from({ length: 3 }).map((_, i) => (
                <Heart
                  key={i}
                  className={`w-5 h-5 ${i < lives ? 'fill-error' : 'opacity-20'}`}
                />
              ))}
            </div>

            {isPlaying && (
              <button
                onClick={() => setIsPaused(!isPaused)}
                className="p-1.5 rounded-lg bg-secondary-bg border border-border hover:bg-elevated-bg"
              >
                {isPaused ? <Play className="w-4 h-4" /> : <Pause className="w-4 h-4" />}
              </button>
            )}
          </div>
        </div>

        {/* Falling Words Surface */}
        <div className="relative flex-1 w-full overflow-hidden">
          {/* Danger Zone Line */}
          <div className="absolute bottom-4 inset-x-0 h-1 bg-gradient-to-r from-transparent via-error/40 to-transparent flex items-center justify-center">
            <span className="text-[10px] font-mono text-error/60 uppercase tracking-widest bg-secondary-bg px-2">
              Critical Line
            </span>
          </div>

          {words.map((w) => {
            const isTargeted = inputVal.length > 0 && w.word.toLowerCase().startsWith(inputVal);
            return (
              <div
                key={w.id}
                style={{
                  left: `${w.x}%`,
                  top: `${w.y}%`,
                  transform: 'translate(-50%, 0)',
                }}
                className={`absolute px-3 py-1 rounded-xl text-xs sm:text-sm font-mono font-bold transition-transform shadow-md border ${
                  isTargeted
                    ? 'bg-accent text-background border-accent scale-110 shadow-[0_0_12px_rgba(232,180,79,0.8)]'
                    : 'bg-card-bg text-text-primary border-border/80'
                }`}
              >
                {isTargeted ? (
                  <span>
                    <span className="underline">{w.word.substring(0, inputVal.length)}</span>
                    <span>{w.word.substring(inputVal.length)}</span>
                  </span>
                ) : (
                  w.word
                )}
              </div>
            );
          })}
        </div>

        {/* Bottom Typing Bar */}
        <div className="p-4 bg-card-bg/90 border-t border-border flex items-center justify-center z-20">
          {isPlaying && !isGameOver ? (
            <input
              ref={inputRef}
              type="text"
              value={inputVal}
              onChange={handleInputChange}
              placeholder="Type falling words here..."
              className="w-full max-w-md px-4 py-2.5 rounded-xl bg-secondary-bg border border-accent/60 text-text-primary text-sm font-mono focus:outline-none focus:ring-2 focus:ring-accent shadow-inner text-center"
              autoFocus
            />
          ) : (
            <div className="text-xs text-text-muted font-mono">
              Press Start Game to play Word Rush
            </div>
          )}
        </div>

        {/* Overlay Screen: Start or Game Over */}
        {(!isPlaying || isGameOver || isPaused) && (
          <div className="absolute inset-0 bg-background/85 backdrop-blur-sm flex flex-col items-center justify-center z-30 p-6 text-center animate-in fade-in duration-200">
            {isGameOver ? (
              <div className="space-y-4">
                <div className="inline-flex p-3 rounded-full bg-card-bg border border-error text-error mb-1">
                  <Trophy className="w-10 h-10" />
                </div>
                <h3 className="text-2xl font-bold text-text-primary">Game Over</h3>
                <div className="flex items-center justify-center gap-6 text-xs font-mono text-text-secondary">
                  <div>
                    <span className="block text-text-muted">Final Score</span>
                    <span className="text-xl font-bold text-accent">{score}</span>
                  </div>
                  <div>
                    <span className="block text-text-muted">Cleared</span>
                    <span className="text-xl font-bold text-text-primary">{wordsCleared}</span>
                  </div>
                  <div>
                    <span className="block text-text-muted">Max Combo</span>
                    <span className="text-xl font-bold text-success">{maxCombo}x</span>
                  </div>
                </div>

                <div className="pt-2">
                  <button
                    onClick={startGame}
                    className="flex items-center gap-2 px-6 py-3 rounded-xl bg-accent text-background font-bold text-sm hover:bg-accent-hover shadow-lg mx-auto"
                  >
                    <RotateCcw className="w-4 h-4" />
                    <span>Play Again</span>
                  </button>
                </div>
              </div>
            ) : isPaused ? (
              <div className="space-y-4">
                <h3 className="text-2xl font-bold text-text-primary">Game Paused</h3>
                <button
                  onClick={() => setIsPaused(false)}
                  className="px-6 py-2.5 rounded-xl bg-accent text-background font-bold text-xs"
                >
                  Resume
                </button>
              </div>
            ) : (
              <div className="space-y-4 max-w-sm">
                <div className="inline-flex p-3 rounded-full bg-secondary-bg border border-accent/40 text-accent mb-1">
                  <Flame className="w-10 h-10" />
                </div>
                <h3 className="text-2xl font-bold text-text-primary">Word Rush</h3>
                <p className="text-xs text-text-secondary leading-relaxed">
                  Words will descend down your screen. Type them rapidly before they hit the red critical boundary!
                </p>

                <div className="pt-2">
                  <button
                    onClick={startGame}
                    className="flex items-center gap-2 px-8 py-3 rounded-xl bg-accent text-background font-bold text-sm hover:bg-accent-hover shadow-lg mx-auto transition-transform active:scale-95"
                  >
                    <Play className="w-4 h-4 fill-background" />
                    <span>Start Word Rush</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
