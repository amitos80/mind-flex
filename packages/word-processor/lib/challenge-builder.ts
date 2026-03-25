import { generateDistractors } from './distractor-gen.js';
import { maskWord } from './masking-engine.js';
import type { Difficulty, WordChallenge } from './types.js';

/**
 * Builds a complete {@link WordChallenge} from a raw word and difficulty level.
 * Combines masking and distractor generation into a single convenience call.
 *
 * @param word - The original unmasked word.
 * @param difficulty - The difficulty level to apply.
 * @returns A fully populated {@link WordChallenge} ready for display.
 */
export const buildChallenge = (word: string, difficulty: Difficulty): WordChallenge => {
  const masked = maskWord(word, difficulty);
  const distractors = generateDistractors(masked.hidden);

  return {
    ...masked,
    distractors,
  };
};
