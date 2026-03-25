import { generateDistractors } from '@extension/word-processor';
import { describe, it, expect } from 'vitest';

describe('generateDistractors', () => {
  describe('happy path', () => {
    it('returns exactly two distractors', () => {
      const result = generateDistractors('ive');
      expect(result).toHaveLength(2);
    });

    it('distractors do not include the correct answer', () => {
      const hidden = 'tion';
      const [a, b] = generateDistractors(hidden);
      expect(a).not.toBe(hidden);
      expect(b).not.toBe(hidden);
    });

    it('the two distractors are different from each other', () => {
      const [a, b] = generateDistractors('ness');
      expect(a).not.toBe(b);
    });
  });

  describe('edge cases', () => {
    it('works when hidden is a long suffix', () => {
      const [a, b] = generateDistractors('ational');
      expect(a).toBeDefined();
      expect(b).toBeDefined();
    });

    it('works when hidden is a single character', () => {
      const [a, b] = generateDistractors('s');
      expect(a).toBeDefined();
      expect(b).toBeDefined();
    });

    it('produces distractors for any common suffix variation', () => {
      const suffixes = ['ing', 'ous', 'ment', 'ly', 'er', 'ed'];
      for (const suffix of suffixes) {
        const [a, b] = generateDistractors(suffix);
        expect(a).not.toBe(suffix);
        expect(b).not.toBe(suffix);
      }
    });
  });

  describe('failure cases', () => {
    it('never returns undefined entries', () => {
      const [a, b] = generateDistractors('xyzabc');
      expect(a).toBeTruthy();
      expect(b).toBeTruthy();
    });
  });
});
