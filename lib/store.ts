import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { LanguageCode } from './translations';
import sound from './sound';

export interface TestSettings {
  mode: 'time' | 'words' | 'quote' | 'custom' | 'zen';
  duration: number; // 15, 30, 60, 120
  wordCount: number; // 10, 25, 50, 100
  language: LanguageCode;
  punctuation: boolean;
  numbers: boolean;
  customText: string;
}

export interface TypingResultPayload {
  wpm: number;
  rawWpm: number;
  accuracy: number;
  consistency: number;
  duration: number;
  errorCount: number;
  correctChars: number;
  incorrectChars: number;
  extraChars: number;
  mistakeDetails: Record<string, number>;
  timelineData: Array<{ second: number; wpm: number; rawWpm: number; errors: number }>;
  mode: string;
  language: string;
}

interface AppStore {
  // Settings
  settings: TestSettings;
  setMode: (mode: TestSettings['mode']) => void;
  setDuration: (duration: number) => void;
  setWordCount: (wordCount: number) => void;
  setLanguage: (language: LanguageCode) => void;
  togglePunctuation: () => void;
  toggleNumbers: () => void;
  setCustomText: (text: string) => void;

  // Sound
  soundTheme: 'mechanical' | 'click' | 'beep' | 'off';
  isMuted: boolean;
  setSoundTheme: (theme: 'mechanical' | 'click' | 'beep' | 'off') => void;
  toggleMute: () => void;

  // History & Mistakes
  weakKeys: Record<string, number>;
  recordMistakes: (mistakes: Record<string, number>) => void;

  // Last Test Result
  lastResult: TypingResultPayload | null;
  setLastResult: (result: TypingResultPayload | null) => void;
}

export const useAppStore = create<AppStore>()(
  persist(
    (set, get) => ({
      settings: {
        mode: 'time',
        duration: 30,
        wordCount: 25,
        language: 'en',
        punctuation: false,
        numbers: false,
        customText: '',
      },
      setMode: (mode) =>
        set((state) => ({ settings: { ...state.settings, mode } })),
      setDuration: (duration) =>
        set((state) => ({ settings: { ...state.settings, duration } })),
      setWordCount: (wordCount) =>
        set((state) => ({ settings: { ...state.settings, wordCount } })),
      setLanguage: (language) =>
        set((state) => ({ settings: { ...state.settings, language } })),
      togglePunctuation: () =>
        set((state) => ({
          settings: { ...state.settings, punctuation: !state.settings.punctuation },
        })),
      toggleNumbers: () =>
        set((state) => ({
          settings: { ...state.settings, numbers: !state.settings.numbers },
        })),
      setCustomText: (customText) =>
        set((state) => ({ settings: { ...state.settings, customText } })),

      soundTheme: 'mechanical',
      isMuted: false,
      setSoundTheme: (theme) => {
        sound.setSoundTheme(theme);
        set({ soundTheme: theme });
      },
      toggleMute: () => {
        const muted = sound.toggleMute();
        set({ isMuted: muted });
      },

      weakKeys: {},
      recordMistakes: (mistakes) =>
        set((state) => {
          const updated = { ...state.weakKeys };
          Object.entries(mistakes).forEach(([k, count]) => {
            updated[k] = (updated[k] || 0) + count;
          });
          return { weakKeys: updated };
        }),

      lastResult: null,
      setLastResult: (lastResult) => set({ lastResult }),
    }),
    {
      name: 'sirojbek-typing-storage',
      partialize: (state) => ({
        settings: state.settings,
        soundTheme: state.soundTheme,
        isMuted: state.isMuted,
        weakKeys: state.weakKeys,
      }),
    }
  )
);
