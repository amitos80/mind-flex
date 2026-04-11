import { generateDistractors } from './distractor-gen.js';
import { maskWord } from './masking-engine.js';
import type { Difficulty, MindFlexConfig, WordChallenge } from './types.js';

/**
 * Builds a complete {@link WordChallenge} from a raw word and difficulty level.
 * Returns `null` when the optional `config.wordLengthThreshold` filters out the word.
 *
 * @param word - The original unmasked word.
 * @param difficulty - The difficulty level to apply.
 * @param config - Optional per-mode config; enables threshold-based filtering.
 * @returns A fully populated {@link WordChallenge} or `null` if the word is skipped.
 */
export const buildChallenge = (word: string, difficulty: Difficulty, config?: MindFlexConfig): WordChallenge | null => {
  const masked = maskWord(word, difficulty, config);
  if (masked === null) return null;

  const distractors = generateDistractors(masked.hidden);

  return { ...masked, distractors };
};
