import type { WordCandidate } from './types.js';

/**
 * Matches sequences of alphabetic characters (no digits or punctuation).
 * The global flag ensures all non-overlapping matches are found.
 */
const WORD_PATTERN = /[a-zA-Z]+/g;

/**
 * Scans a plain text string and returns all word candidates that meet the
 * minimum length threshold.
 *
 * @param text - Raw text content from a DOM text node.
 * @param minLength - Minimum character count for a word to qualify (inclusive).
 * @returns Ordered list of qualifying {@link WordCandidate} objects.
 */
export const detectWords = (text: string, minLength: number): WordCandidate[] => {
  const candidates: WordCandidate[] = [];
  WORD_PATTERN.lastIndex = 0;

  let match: RegExpExecArray | null;
  while ((match = WORD_PATTERN.exec(text)) !== null) {
    const word = match[0];
    if (word.length >= minLength) {
      candidates.push({
        word,
        start: match.index,
        end: match.index + word.length,
      });
    }
  }

  return candidates;
};
