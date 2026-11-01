import { describe, it, expect } from 'vitest';
import { validateTypingScore } from '../lib/anti-cheat';

describe('Anti-Cheat & Validation Engine', () => {
  it('approves legitimate human typing scores', () => {
    const valid = validateTypingScore({
      wpm: 80,
      rawWpm: 84,
      accuracy: 97.5,
      duration: 60,
      correctChars: 400,
      totalKeystrokes: 410,
    });
    expect(valid.isValid).toBe(true);
    expect(valid.isFlagged).toBe(false);
  });

  it('rejects biologically impossible WPM speeds (e.g. >250 WPM)', () => {
    const impossible = validateTypingScore({
      wpm: 280,
      rawWpm: 290,
      accuracy: 100,
      duration: 60,
      correctChars: 1400,
      totalKeystrokes: 1400,
    });
    expect(impossible.isValid).toBe(false);
    expect(impossible.reason).toContain('human biological limits');
  });

  it('rejects mathematical inconsistencies between correct characters and WPM', () => {
    // 100 chars in 60s should be 20 WPM, but submitting 90 WPM
    const forged = validateTypingScore({
      wpm: 90,
      rawWpm: 90,
      accuracy: 100,
      duration: 60,
      correctChars: 100,
      totalKeystrokes: 100,
    });
    expect(forged.isValid).toBe(false);
    expect(forged.reason).toContain('Mathematical mismatch');
  });

  it('flags high-speed outlier runs for moderator review', () => {
    const highSpeed = validateTypingScore({
      wpm: 190,
      rawWpm: 195,
      accuracy: 99,
      duration: 60,
      correctChars: 950,
      totalKeystrokes: 960,
    });
    expect(highSpeed.isValid).toBe(true);
    expect(highSpeed.isFlagged).toBe(true);
  });
});
