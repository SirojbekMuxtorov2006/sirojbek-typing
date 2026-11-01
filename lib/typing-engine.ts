/**
 * Core mathematical and algorithmic engine for SirojbekTyping.
 * Strictly implements standard typing measurement formulas.
 */

export interface KeystrokeRecord {
  char: string;
  expectedChar: string;
  timestamp: number;
  isCorrect: boolean;
  isBackspace?: boolean;
}

export interface SecondMetric {
  second: number;
  wpm: number;
  rawWpm: number;
  errors: number;
  accuracy: number;
}

export interface TypingMetrics {
  wpm: number;
  rawWpm: number;
  netWpm: number;
  accuracy: number;
  consistency: number;
  correctChars: number;
  incorrectChars: number;
  extraChars: number;
  missedChars: number;
  totalKeystrokes: number;
  elapsedSeconds: number;
}

/**
 * Calculates standard Net WPM: (Correct characters / 5) / (Time in minutes)
 */
export function calculateWpm(correctChars: number, elapsedSeconds: number): number {
  if (elapsedSeconds <= 0 || correctChars <= 0) return 0;
  const minutes = elapsedSeconds / 60;
  const wpm = (correctChars / 5) / minutes;
  return Math.max(0, Math.round(wpm * 10) / 10);
}

/**
 * Calculates Raw WPM: (Total typed characters / 5) / (Time in minutes)
 */
export function calculateRawWpm(totalTypedChars: number, elapsedSeconds: number): number {
  if (elapsedSeconds <= 0 || totalTypedChars <= 0) return 0;
  const minutes = elapsedSeconds / 60;
  const rawWpm = (totalTypedChars / 5) / minutes;
  return Math.max(0, Math.round(rawWpm * 10) / 10);
}

/**
 * Calculates Accuracy percentage: (Correct keystrokes / Total keystrokes) * 100
 */
export function calculateAccuracy(correctKeystrokes: number, totalKeystrokes: number): number {
  if (totalKeystrokes <= 0) return 100;
  const acc = (correctKeystrokes / totalKeystrokes) * 100;
  return Math.min(100, Math.max(0, Math.round(acc * 10) / 10));
}

/**
 * Calculates Consistency percentage based on the coefficient of variation
 * of second-by-second typing speed.
 * Formula: 100 - (StandardDeviation / Mean) * 100
 */
export function calculateConsistency(secondMetrics: SecondMetric[]): number {
  if (secondMetrics.length < 2) return 100;
  
  const speeds = secondMetrics.map((m) => m.rawWpm).filter((wpm) => wpm > 0);
  if (speeds.length < 2) return 100;

  const mean = speeds.reduce((sum, val) => sum + val, 0) / speeds.length;
  if (mean === 0) return 100;

  const variance =
    speeds.reduce((sum, val) => sum + Math.pow(val - mean, 2), 0) / speeds.length;
  const stdDev = Math.sqrt(variance);

  const cv = (stdDev / mean) * 100;
  const consistency = Math.max(0, Math.min(100, Math.round((100 - cv) * 10) / 10));
  return consistency;
}

/**
 * Evaluates typing state given original text and typed input
 */
export function evaluateTextProgress(
  targetText: string,
  typedText: string
): {
  correctChars: number;
  incorrectChars: number;
  extraChars: number;
  charStates: Array<'correct' | 'incorrect' | 'extra' | 'pending'>;
  mistakeMap: Record<string, number>;
} {
  const charStates: Array<'correct' | 'incorrect' | 'extra' | 'pending'> = [];
  const mistakeMap: Record<string, number> = {};
  let correctChars = 0;
  let incorrectChars = 0;

  const minLen = Math.min(targetText.length, typedText.length);

  for (let i = 0; i < minLen; i++) {
    const targetChar = targetText[i];
    const typedChar = typedText[i];

    if (typedChar === targetChar) {
      charStates.push('correct');
      correctChars++;
    } else {
      charStates.push('incorrect');
      incorrectChars++;
      const key = targetChar === ' ' ? 'Space' : targetChar.toLowerCase();
      mistakeMap[key] = (mistakeMap[key] || 0) + 1;
    }
  }

  // Handle remaining target characters as pending
  for (let i = minLen; i < targetText.length; i++) {
    charStates.push('pending');
  }

  // Extra characters typed past target
  const extraChars = Math.max(0, typedText.length - targetText.length);

  return {
    correctChars,
    incorrectChars,
    extraChars,
    charStates,
    mistakeMap,
  };
}
