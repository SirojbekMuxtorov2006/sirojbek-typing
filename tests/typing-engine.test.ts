import { describe, it, expect } from 'vitest';
import {
  calculateWpm,
  calculateRawWpm,
  calculateAccuracy,
  calculateConsistency,
  evaluateTextProgress,
} from '../lib/typing-engine';

describe('Typing Engine Calculations', () => {
  it('accurately calculates Net WPM based on standard formula (correctChars / 5) / (seconds / 60)', () => {
    // 300 correct characters in 60 seconds = 60 words = 60 WPM
    expect(calculateWpm(300, 60)).toBe(60);

    // 150 correct characters in 30 seconds = 30 words in 0.5 minutes = 60 WPM
    expect(calculateWpm(150, 30)).toBe(60);

    // 0 correct characters should yield 0 WPM
    expect(calculateWpm(0, 60)).toBe(0);

    // Zero seconds should not throw division by zero and return 0
    expect(calculateWpm(100, 0)).toBe(0);
  });

  it('accurately calculates Raw WPM including uncorrected keystrokes', () => {
    // 350 typed characters in 60 seconds = 70 Raw WPM
    expect(calculateRawWpm(350, 60)).toBe(70);

    // 400 characters in 120 seconds = 80 words in 2 min = 40 Raw WPM
    expect(calculateRawWpm(400, 120)).toBe(40);
  });

  it('accurately calculates accuracy percentage (correct / total * 100)', () => {
    // 100 out of 100 = 100%
    expect(calculateAccuracy(100, 100)).toBe(100);

    // 95 out of 100 = 95%
    expect(calculateAccuracy(95, 100)).toBe(95);

    // 47 out of 50 = 94%
    expect(calculateAccuracy(47, 50)).toBe(94);

    // Edge case: 0 keystrokes defaults safely to 100%
    expect(calculateAccuracy(0, 0)).toBe(100);
  });

  it('calculates consistency percentage using speed variance', () => {
    const steadyMetrics = [
      { second: 1, wpm: 60, rawWpm: 60, errors: 0, accuracy: 100 },
      { second: 2, wpm: 60, rawWpm: 60, errors: 0, accuracy: 100 },
      { second: 3, wpm: 60, rawWpm: 60, errors: 0, accuracy: 100 },
    ];
    // Perfectly consistent pace should be 100%
    expect(calculateConsistency(steadyMetrics)).toBe(100);

    const erraticMetrics = [
      { second: 1, wpm: 10, rawWpm: 10, errors: 0, accuracy: 100 },
      { second: 2, wpm: 100, rawWpm: 100, errors: 0, accuracy: 100 },
      { second: 3, wpm: 20, rawWpm: 20, errors: 0, accuracy: 100 },
    ];
    // Erratic pacing should have lower consistency
    expect(calculateConsistency(erraticMetrics)).toBeLessThan(60);
  });

  it('evaluates character states and tracks mistyped keys accurately', () => {
    const target = 'hello world';
    const typed = 'helxo world';

    const result = evaluateTextProgress(target, typed);
    expect(result.correctChars).toBe(10);
    expect(result.incorrectChars).toBe(1);
    expect(result.mistakeMap['l']).toBe(1); // expected 'l', typed 'x'
    expect(result.charStates[3]).toBe('incorrect');
    expect(result.charStates[0]).toBe('correct');
  });
});
