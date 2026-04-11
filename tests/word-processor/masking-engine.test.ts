import { maskWord } from '@extension/word-processor';
import { describe, it, expect } from 'vitest';

describe('maskWord', () => {
  describe('happy path', () => {
    it('hides the last 2 characters on easy difficulty', () => {
      // "aggressive" = 10 chars; easy hides last 2 => visible "aggressi", hidden "ve"
      const result = maskWord('aggressive', 'easy')!;
      expect(result.visible).toBe('aggressi');
      expect(result.hidden).toBe('ve');
    });

    it('hides last 2 characters correctly for longer words on easy', () => {
      const result = maskWord('unnecessary', 'easy')!;
      expect(result.visible + result.hidden).toBe('unnecessary');
      expect(result.hidden.length).toBe(2);
    });

    it('hides approximately half the word on medium difficulty', () => {
      const result = maskWord('behaviour', 'medium')!;
      expect(result.visible + result.hidden).toBe('behaviour');
      expect(result.hidden.length).toBe(Math.ceil('behaviour'.length / 2));
    });

    it('reveals only the first character on hard difficulty', () => {
      const result = maskWord('exceptional', 'hard')!;
      expect(result.visible).toBe('e');
      expect(result.hidden).toBe('xceptional');
    });

    it('always reconstructs the original from visible + hidden', () => {
      const word = 'magnificent';
      expect(maskWord(word, 'easy')!.visible + maskWord(word, 'easy')!.hidden).toBe(word);
      expect(maskWord(word, 'medium')!.visible + maskWord(word, 'medium')!.hidden).toBe(word);
      expect(maskWord(word, 'hard')!.visible + maskWord(word, 'hard')!.hidden).toBe(word);
    });
  });

  describe('edge cases', () => {
    it('never hides the entire word — visible is always non-empty', () => {
      const short = 'ab';
      expect(maskWord(short, 'hard')!.visible.length).toBeGreaterThan(0);
    });

    it('preserves the original field regardless of difficulty', () => {
      const word = 'understanding';
      expect(maskWord(word, 'easy')!.original).toBe(word);
      expect(maskWord(word, 'medium')!.original).toBe(word);
      expect(maskWord(word, 'hard')!.original).toBe(word);
    });

    it('returns null when word is below the configured threshold', () => {
      const config = { mode: 'senior' as const, theme: 'senior' as const, wordLengthThreshold: 6, hintEnabled: false };
      expect(maskWord('cat', 'easy', config)).toBeNull();
      expect(maskWord('cognition', 'easy', config)).not.toBeNull();
    });
  });

  describe('failure cases', () => {
    it('hidden portion is never empty for a qualifying word', () => {
      ['easy', 'medium', 'hard'].forEach(d => {
        const result = maskWord('processing', d as 'easy' | 'medium' | 'hard')!;
        expect(result.hidden.length).toBeGreaterThan(0);
      });
    });
  });
});
