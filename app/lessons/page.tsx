'use client';

import React, { useState, useEffect } from 'react';
import { BookOpen, CheckCircle, ArrowRight, Play, Lock, Award, Star } from 'lucide-react';
import LessonViewer, { LessonData } from '@/components/lessons/LessonViewer';

export default function LessonsPage() {
  const [lessons, setLessons] = useState<LessonData[]>([]);
  const [selectedLesson, setSelectedLesson] = useState<LessonData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadLessons() {
      try {
        const res = await fetch('/api/lessons');
        const data = await res.json();
        setLessons(data.lessons || []);
      } catch (err) {
        console.error('Failed to load lessons:', err);
      } finally {
        setLoading(false);
      }
    }
    loadLessons();
  }, []);

  const handleNextLesson = () => {
    if (!selectedLesson) return;
    const currentIndex = lessons.findIndex((l) => l.id === selectedLesson.id);
    if (currentIndex !== -1 && currentIndex + 1 < lessons.length) {
      setSelectedLesson(lessons[currentIndex + 1]);
    }
  };

  const handlePreviousLesson = () => {
    if (!selectedLesson) return;
    const currentIndex = lessons.findIndex((l) => l.id === selectedLesson.id);
    if (currentIndex > 0) {
      setSelectedLesson(lessons[currentIndex - 1]);
    }
  };

  if (selectedLesson) {
    return (
      <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <LessonViewer
          lesson={selectedLesson}
          onNextLesson={
            lessons.findIndex((l) => l.id === selectedLesson.id) + 1 < lessons.length
              ? handleNextLesson
              : undefined
          }
          onPreviousLesson={
            lessons.findIndex((l) => l.id === selectedLesson.id) > 0
              ? handlePreviousLesson
              : undefined
          }
          onBackToList={() => setSelectedLesson(null)}
        />
      </div>
    );
  }

  const tiers = [
    { key: 'beginner', title: 'Beginner: Fundamentals & Home Row', desc: 'Home row muscle memory, finger placement, and basic key strokes.' },
    { key: 'intermediate', title: 'Intermediate: Upper/Bottom Rows & Shift', desc: 'Expanding reach across rows, punctuation, and capitalization rhythm.' },
    { key: 'advanced', title: 'Advanced: Speed, Symbols & Professional Flow', desc: 'Numbers, complex symbols, and professional high-speed cadence.' },
  ];

  return (
    <div className="w-full max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
      {/* Header */}
      <div className="text-center max-w-2xl mx-auto mb-10">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-accent-muted text-accent text-xs font-mono font-medium mb-3">
          <BookOpen className="w-3.5 h-3.5" />
          <span>Curriculum</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-text-primary mb-2">
          Touch Typing Education
        </h1>
        <p className="text-xs sm:text-sm text-text-secondary">
          Step-by-step touch typing courses designed to transition you from looking at keys to subconscious muscle memory.
        </p>
      </div>

      {loading ? (
        <div className="text-center py-16 text-xs text-text-muted font-mono">
          Loading curriculum lessons...
        </div>
      ) : (
        <div className="space-y-10">
          {tiers.map((tier) => {
            const tierLessons = lessons.filter((l) => l.level === tier.key);
            return (
              <div key={tier.key} className="space-y-4">
                <div className="border-b border-border/80 pb-3">
                  <h2 className="text-lg font-bold text-text-primary">{tier.title}</h2>
                  <p className="text-xs text-text-secondary">{tier.desc}</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  {tierLessons.map((lesson) => (
                    <div
                      key={lesson.id}
                      onClick={() => setSelectedLesson(lesson)}
                      className="p-5 rounded-2xl bg-secondary-bg border border-border hover:border-accent/60 transition-all cursor-pointer group flex flex-col justify-between shadow-sm hover:shadow-md"
                    >
                      <div>
                        <div className="flex items-center justify-between mb-3">
                          <span className="px-2 py-0.5 rounded bg-card-bg border border-border text-[11px] font-mono text-accent font-bold">
                            Lesson {lesson.lessonNumber}
                          </span>
                          <span className="text-[10px] text-text-muted font-mono">
                            {lesson.minWpm} WPM req.
                          </span>
                        </div>

                        <h3 className="text-sm font-bold text-text-primary group-hover:text-accent transition-colors mb-1.5">
                          {lesson.title}
                        </h3>

                        <p className="text-xs text-text-secondary line-clamp-2 leading-relaxed mb-3">
                          {lesson.description}
                        </p>
                      </div>

                      <div className="pt-3 border-t border-border/80 flex items-center justify-between text-xs font-mono">
                        <span className="text-[11px] text-text-muted">
                          Keys: <span className="text-text-primary">{lesson.targetKeys}</span>
                        </span>
                        <span className="text-accent flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                          <span>Practice</span>
                          <ArrowRight className="w-3.5 h-3.5" />
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
