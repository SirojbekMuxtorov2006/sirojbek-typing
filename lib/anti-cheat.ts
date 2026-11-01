/**
 * Anti-cheat validation and verification for SirojbekTyping scores.
 */

export interface ScoreSubmissionData {
  wpm: number;
  rawWpm: number;
  accuracy: number;
  duration: number;
  correctChars: number;
  totalKeystrokes: number;
  startTime?: number;
  endTime?: number;
  clientKeystrokeCount?: number;
}

export interface AntiCheatResult {
  isValid: boolean;
  isFlagged: boolean;
  reason?: string;
}

export function validateTypingScore(data: ScoreSubmissionData): AntiCheatResult {
  const { wpm, rawWpm, accuracy, duration, correctChars, totalKeystrokes } = data;

  // 1. Duration validation
  if (duration <= 0) {
    return { isValid: false, isFlagged: true, reason: 'Invalid test duration' };
  }

  // 2. Realistic human limits
  // The absolute human world record peak on burst typing is ~250 WPM.
  if (wpm > 250 || rawWpm > 270) {
    return { isValid: false, isFlagged: true, reason: 'WPM exceeds plausible human biological limits' };
  }

  // 3. Accuracy bounds
  if (accuracy < 0 || accuracy > 100) {
    return { isValid: false, isFlagged: true, reason: 'Accuracy value out of bounds' };
  }

  // 4. Keystroke to WPM mathematical consistency
  // WPM = (correctChars / 5) / (duration / 60)
  const expectedWpm = (correctChars / 5) / (duration / 60);
  const wpmDifference = Math.abs(expectedWpm - wpm);
  if (wpmDifference > 3.0) {
    return {
      isValid: false,
      isFlagged: true,
      reason: `Mathematical mismatch: WPM ${wpm} does not match keystrokes (${correctChars} chars in ${duration}s)`,
    };
  }

  // 5. Total keystrokes vs correct characters
  if (totalKeystrokes < correctChars) {
    return {
      isValid: false,
      isFlagged: true,
      reason: 'Total keystrokes cannot be less than correct characters',
    };
  }

  // 6. Suspiciously high speed with high accuracy check for review
  const isFlagged = wpm > 180;

  return {
    isValid: true,
    isFlagged,
  };
}
