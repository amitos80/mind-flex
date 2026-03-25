import type { Difficulty, MaskedWord } from './types.js';

/**
 * Computes the number of trailing characters to hide for a given difficulty.
 *
 * @param wordLength - Total character count of the word.
 * @param difficulty - Selected challenge level.
 * @returns Number of characters to hide (always ≥ 1 and < wordLength).
 */
const hiddenCharCount = (wordLength: number, difficulty: Difficulty): number => {
  switch (difficulty) {
    case 'easy':
      // WHY: Hide only the last 2 letters so the word remains highly recognisable.
      return Math.min(2, wordLength - 1);
    case 'medium':
      // WHY: Hide half the word, rounded up, giving a balanced challenge.
      return Math.max(1, Math.ceil(wordLength / 2));
    case 'hard':
      // WHY: Reveal only the first letter — maximum difficulty.
      return wordLength - 1;
  }
};

/**
 * Applies a masking strategy to a word based on the requested difficulty level.
 * The hidden portion is always taken from the word's trailing characters.
 *
 * @param word - The original, unmasked word.
 * @param difficulty - The difficulty level to apply.
 * @returns A {@link MaskedWord} where `visible + hidden === original`.
 */
export const maskWord = (word: string, difficulty: Difficulty): MaskedWord => {
  const count = hiddenCharCount(word.length, difficulty);
  const splitAt = word.length - count;

  return {
    original: word,
    visible: word.slice(0, splitAt),
    hidden: word.slice(splitAt),
  };
};
