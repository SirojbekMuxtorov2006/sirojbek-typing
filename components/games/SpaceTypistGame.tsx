'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Play, RotateCcw, Shield, Zap, Rocket, Trophy, ArrowLeft } from 'lucide-react';
import { ENGLISH_WORDS } from '@/lib/word-banks';
import sound from '@/lib/sound';
import Link from 'next/link';

interface Asteroid {
  id: string;
  word: string;
  x: number;
  y: number;
  speed: number;
  size: number;
}

interface Laser {
  startX: number;
  startY: number;
  targetX: number;
  targetY: number;
  opacity: number;
}

export default function SpaceTypistGame() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isGameOver, setIsGameOver] = useState(false);

  const [score, setScore] = useState(0);
  const [shield, setShield] = useState(100);
  const [stage, setStage] = useState(1);
  const [asteroidsDestroyed, setAsteroidsDestroyed] = useState(0);

  const [inputVal, setInputVal] = useState('');
  const [asteroids, setAsteroids] = useState<Asteroid[]>([]);
  const [laser, setLaser] = useState<Laser | null>(null);

  const requestRef = useRef<number | null>(null);
  const lastSpawnRef = useRef<number>(0);
  const inputRef = useRef<HTMLInputElement>(null);

  const spawnAsteroid = useCallback(() => {
    const wordList = ENGLISH_WORDS.filter((w) => w.length >= 3 && w.length <= 7);
    const word = wordList[Math.floor(Math.random() * wordList.length)];
    const newAsteroid: Asteroid = {
      id: Math.random().toString(36).substring(2, 9),
      word,
      x: Math.floor(Math.random() * 70) + 15,
      y: 0,
      speed: 0.15 + stage * 0.04,
      size: 40 + word.length * 4,
    };
    setAsteroids((prev) => [...prev, newAsteroid]);
  }, [stage]);

  const updateGame = useCallback(
    (timestamp: number) => {
      if (!isPlaying || isGameOver) return;

      const spawnInterval = Math.max(1300, 2600 - stage * 200);
      if (timestamp - lastSpawnRef.current > spawnInterval) {
        spawnAsteroid();
        lastSpawnRef.current = timestamp;
      }

      setAsteroids((prev) => {
        const nextAsteroids: Asteroid[] = [];
        let hitShield = false;

        for (const ast of prev) {
          const nextY = ast.y + ast.speed;
          if (nextY >= 88) {
            hitShield = true;
            sound.playExplosionSound();
          } else {
            nextAsteroids.push({ ...ast, y: nextY });
          }
        }

        if (hitShield) {
          setShield((s) => {
            const nextS = s - 25;
            if (nextS <= 0) {
              setIsGameOver(true);
              setIsPlaying(false);
              fetch('/api/games', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                  gameType: 'space_typist',
                  score,
                  levelReached: stage,
                  wordsCompleted: asteroidsDestroyed,
                }),
              }).catch(() => {});
            }
            return Math.max(0, nextS);
          });
        }

        return nextAsteroids;
      });

      requestRef.current = requestAnimationFrame(updateGame);
    },
    [isPlaying, isGameOver, stage, spawnAsteroid, score, asteroidsDestroyed]
  );

  useEffect(() => {
    if (isPlaying && !isGameOver) {
      requestRef.current = requestAnimationFrame(updateGame);
    }
    return () => {
      if (requestRef.current) cancelAnimationFrame(requestRef.current);
    };
  }, [isPlaying, isGameOver, updateGame]);

  const startGame = () => {
    setScore(0);
    setShield(100);
    setStage(1);
    setAsteroidsDestroyed(0);
    setAsteroids([]);
    setInputVal('');
    setIsGameOver(false);
    setIsPlaying(true);
    lastSpawnRef.current = performance.now();
    setTimeout(() => inputRef.current?.focus(), 50);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value.trim().toLowerCase();
    setInputVal(val);

    const matchIdx = asteroids.findIndex((a) => a.word.toLowerCase() === val);

    if (matchIdx !== -1) {
      const target = asteroids[matchIdx];
      // Trigger laser beam from ship (center bottom: 50%, 90%) to asteroid target
      sound.playLaserSound();
      setLaser({
        startX: 50,
        startY: 90,
        targetX: target.x,
        targetY: target.y + 3,
        opacity: 1,
      });

      setTimeout(() => {
        sound.playExplosionSound();
        setLaser(null);
      }, 150);

      const points = 150 * stage;
      setScore((s) => s + points);
      setAsteroidsDestroyed((prev) => {
        const next = prev + 1;
        if (next % 8 === 0) {
          setStage((st) => st + 1);
          sound.playSuccessChime();
        }
        return next;
      });

      setAsteroids((prev) => prev.filter((_, idx) => idx !== matchIdx));
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
          Game B: Space Typist
        </span>
      </div>

      {/* Main Game Surface */}
      <div className="w-full h-[520px] rounded-2xl bg-[#0B0C0E] border border-border shadow-2xl relative overflow-hidden flex flex-col justify-between">
        {/* Starfield Background */}
        <div className="absolute inset-0 opacity-40 bg-[radial-gradient(#E8B44F_1px,transparent_1px)] [background-size:24px_24px] pointer-events-none" />

        {/* Top HUD */}
        <div className="p-4 bg-secondary-bg/80 border-b border-border/80 flex items-center justify-between text-xs font-mono z-20 backdrop-blur-sm">
          <div className="flex items-center gap-6">
            <div>
              <span className="text-text-muted uppercase text-[10px] block">Score</span>
              <span className="text-xl font-bold text-accent">{score}</span>
            </div>
            <div>
              <span className="text-text-muted uppercase text-[10px] block">Sector</span>
              <span className="text-xl font-bold text-text-primary">{stage}</span>
            </div>
            <div>
              <span className="text-text-muted uppercase text-[10px] block">Destroyed</span>
              <span className="text-xl font-bold text-success">{asteroidsDestroyed}</span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Shield className="w-4 h-4 text-accent" />
            <div className="w-28 h-3 rounded-full bg-card-bg border border-border overflow-hidden">
              <div
                className={`h-full transition-all duration-300 ${
                  shield > 50 ? 'bg-success' : shield > 25 ? 'bg-accent' : 'bg-error'
                }`}
                style={{ width: `${shield}%` }}
              />
            </div>
            <span className="text-xs text-text-primary">{shield}%</span>
          </div>
        </div>

        {/* Space Arena Area */}
        <div className="relative flex-1 w-full overflow-hidden">
          {/* Incoming Asteroids */}
          {asteroids.map((ast) => {
            const isTargeted = inputVal.length > 0 && ast.word.toLowerCase().startsWith(inputVal);
            return (
              <div
                key={ast.id}
                style={{
                  left: `${ast.x}%`,
                  top: `${ast.y}%`,
                  transform: 'translate(-50%, 0)',
                }}
                className={`absolute px-3 py-1.5 rounded-2xl text-xs sm:text-sm font-mono font-bold transition-transform border shadow-xl flex items-center gap-1.5 ${
                  isTargeted
                    ? 'bg-accent text-background border-accent scale-110 shadow-[0_0_20px_rgba(232,180,79,0.9)]'
                    : 'bg-card-bg/95 text-text-primary border-border/90'
                }`}
              >
                <span className="w-2 h-2 rounded-full bg-error animate-ping" />
                {isTargeted ? (
                  <span>
                    <span className="underline">{ast.word.substring(0, inputVal.length)}</span>
                    <span>{ast.word.substring(inputVal.length)}</span>
                  </span>
                ) : (
                  ast.word
                )}
              </div>
            );
          })}

          {/* SVG Laser Beam Effect */}
          {laser && (
            <svg className="absolute inset-0 w-full h-full pointer-events-none z-10">
              <line
                x1={`${laser.startX}%`}
                y1={`${laser.startY}%`}
                x2={`${laser.targetX}%`}
                y2={`${laser.targetY}%`}
                stroke="#E8B44F"
                strokeWidth="4"
                strokeLinecap="round"
                className="animate-pulse"
              />
            </svg>
          )}

          {/* Player Spacecraft */}
          <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex flex-col items-center">
            <div className="p-2.5 rounded-full bg-secondary-bg border border-accent/60 shadow-[0_0_15px_rgba(232,180,79,0.5)]">
              <Rocket className="w-6 h-6 text-accent -rotate-45" />
            </div>
            <span className="w-4 h-1.5 bg-accent/80 rounded-full blur-[2px] mt-0.5 animate-pulse" />
          </div>
        </div>

        {/* Bottom Typing Bar */}
        <div className="p-4 bg-secondary-bg/90 border-t border-border flex items-center justify-center z-20">
          {isPlaying && !isGameOver ? (
            <input
              ref={inputRef}
              type="text"
              value={inputVal}
              onChange={handleInputChange}
              placeholder="Type word to fire laser cannon..."
              className="w-full max-w-md px-4 py-2.5 rounded-xl bg-card-bg border border-accent/60 text-text-primary text-sm font-mono focus:outline-none focus:ring-2 focus:ring-accent shadow-inner text-center"
              autoFocus
            />
          ) : (
            <div className="text-xs text-text-muted font-mono">
              Press Start Game to defend your starbase
            </div>
          )}
        </div>

        {/* Overlay Screen: Start or Game Over */}
        {(!isPlaying || isGameOver) && (
          <div className="absolute inset-0 bg-background/85 backdrop-blur-sm flex flex-col items-center justify-center z-30 p-6 text-center animate-in fade-in duration-200">
            {isGameOver ? (
              <div className="space-y-4">
                <div className="inline-flex p-3 rounded-full bg-card-bg border border-error text-error mb-1">
                  <Trophy className="w-10 h-10" />
                </div>
                <h3 className="text-2xl font-bold text-text-primary">Ship Destroyed</h3>
                <div className="flex items-center justify-center gap-6 text-xs font-mono text-text-secondary">
                  <div>
                    <span className="block text-text-muted">Final Score</span>
                    <span className="text-xl font-bold text-accent">{score}</span>
                  </div>
                  <div>
                    <span className="block text-text-muted">Sector</span>
                    <span className="text-xl font-bold text-text-primary">{stage}</span>
                  </div>
                  <div>
                    <span className="block text-text-muted">Destroyed</span>
                    <span className="text-xl font-bold text-success">{asteroidsDestroyed}</span>
                  </div>
                </div>

                <div className="pt-2">
                  <button
                    onClick={startGame}
                    className="flex items-center gap-2 px-6 py-3 rounded-xl bg-accent text-background font-bold text-sm hover:bg-accent-hover shadow-lg mx-auto"
                  >
                    <RotateCcw className="w-4 h-4" />
                    <span>Relaunch Vessel</span>
                  </button>
                </div>
              </div>
            ) : (
              <div className="space-y-4 max-w-sm">
                <div className="inline-flex p-3 rounded-full bg-secondary-bg border border-accent/40 text-accent mb-1">
                  <Rocket className="w-10 h-10 -rotate-45" />
                </div>
                <h3 className="text-2xl font-bold text-text-primary">Space Typist</h3>
                <p className="text-xs text-text-secondary leading-relaxed">
                  Hostile space asteroids bearing code words are approaching your vessel. Lock in your targets and blast them with laser cannons!
                </p>

                <div className="pt-2">
                  <button
                    onClick={startGame}
                    className="flex items-center gap-2 px-8 py-3 rounded-xl bg-accent text-background font-bold text-sm hover:bg-accent-hover shadow-lg mx-auto transition-transform active:scale-95"
                  >
                    <Play className="w-4 h-4 fill-background" />
                    <span>Engage Cannons</span>
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
