import { detectWords } from '@extension/word-processor';
import { describe, it, expect } from 'vitest';

describe('detectWords', () => {
  describe('happy path', () => {
    it('detects words meeting the minimum length', () => {
      const results = detectWords('The aggressive behaviour was unnecessary', 8);
      expect(results.map(c => c.word)).toEqual(['aggressive', 'behaviour', 'unnecessary']);
    });

    it('returns correct start and end positions', () => {
      const text = 'absolutely';
      const [candidate] = detectWords(text, 8);
      expect(candidate.start).toBe(0);
      expect(candidate.end).toBe(10);
    });

    it('handles multiple qualifying words in a sentence', () => {
      const results = detectWords('Interesting phenomena occur frequently', 8);
      expect(results).toHaveLength(3);
    });
  });

  describe('edge cases', () => {
    it('returns an empty array when no words meet the threshold', () => {
      expect(detectWords('Go run now fast here', 8)).toEqual([]);
    });

    it('ignores punctuation attached to words', () => {
      const results = detectWords('surprising, wonderful!', 8);
      expect(results.map(c => c.word)).toEqual(['surprising', 'wonderful']);
    });

    it('handles text with numbers mixed in', () => {
      const results = detectWords('achieved 100 objectives', 8);
      expect(results.map(c => c.word)).toEqual(['achieved', 'objectives']);
    });

    it('matches words at the exact minimum length boundary', () => {
      const results = detectWords('abcdefgh', 8);
      expect(results).toHaveLength(1);
      expect(results[0].word).toBe('abcdefgh');
    });

    it('returns an empty array for empty input', () => {
      expect(detectWords('', 8)).toEqual([]);
    });
  });

  describe('failure cases', () => {
    it('does not match words shorter than minLength', () => {
      expect(detectWords('cat dog bird fish', 8)).toEqual([]);
    });

    it('does not include digits as word characters', () => {
      const results = detectWords('12345678', 8);
      expect(results).toEqual([]);
    });
  });
});
