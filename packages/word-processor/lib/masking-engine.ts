import type { Difficulty, MaskedWord, MindFlexConfig } from './types.js';

/** Omits the threshold check — all words qualify. Used as the no-config default. */
const NO_THRESHOLD = 0;

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
 * Applies a masking strategy to a word based on difficulty and an optional config.
 * Returns `null` when `config.wordLengthThreshold` is set and the word is too short.
 * Without a config the original two-argument behaviour is preserved.
 *
 * @param word - The original, unmasked word.
 * @param difficulty - The difficulty level to apply.
 * @param config - Optional {@link MindFlexConfig}; enables per-mode threshold filtering.
 * @returns A {@link MaskedWord} or `null` if the word is below the configured threshold.
 */
export const maskWord = (word: string, difficulty: Difficulty, config?: MindFlexConfig): MaskedWord | null => {
  const threshold = config?.wordLengthThreshold ?? NO_THRESHOLD;
  if (word.length < threshold) return null;

  const count = hiddenCharCount(word.length, difficulty);
  const splitAt = word.length - count;

  return {
    original: word,
    visible: word.slice(0, splitAt),
    hidden: word.slice(splitAt),
  };
};
