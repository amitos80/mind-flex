/** Cognitive challenge difficulty level controlling how much of a word is hidden. */
export type Difficulty = 'easy' | 'medium' | 'hard';

/**
 * A word candidate found during DOM text scanning.
 * Positions are byte offsets within the scanned text node value.
 */
export interface WordCandidate {
  /** The raw word string as found in the text. */
  word: string;
  /** Start index within the source text string. */
  start: number;
  /** End index (exclusive) within the source text string. */
  end: number;
}

/**
 * A word after the masking algorithm has been applied.
 * `visible + hidden` always reconstructs `original`.
 */
export interface MaskedWord {
  /** The complete, unmasked original word. */
  original: string;
  /** The portion of the word shown to the user. */
  visible: string;
  /** The hidden suffix the user must guess. */
  hidden: string;
}

/**
 * A complete challenge ready for display: the masked word plus
 * two distractor completions to offer alongside the correct answer.
 */
export interface WordChallenge extends MaskedWord {
  /** Exactly two incorrect but plausible suffix completions. */
  distractors: [string, string];
}
