/**
 * Common English suffixes used to produce plausible wrong-answer distractors.
 * Ordered by frequency so earlier entries are tried first.
 */
const COMMON_SUFFIXES = [
  'ing',
  'tion',
  'sion',
  'ness',
  'ment',
  'ive',
  'ous',
  'ly',
  'ful',
  'less',
  'er',
  'ed',
  'al',
  'ary',
  'ity',
  'ise',
  'ize',
  'ance',
  'ence',
  'ent',
  'ant',
  'ist',
  'ism',
  'ate',
  'ify',
];

/**
 * Produces exactly two distractor completions that differ from the correct
 * hidden suffix and from each other.
 *
 * The strategy:
 * 1. Filter out any suffix identical to the correct answer (case-insensitive).
 * 2. Prefer suffixes whose length is close to the hidden portion's length so
 *    the choices look plausible side-by-side.
 * 3. Return the two closest-length alternatives.
 *
 * @param hidden - The correct suffix the user must guess.
 * @returns A tuple of two distractor strings.
 */
export const generateDistractors = (hidden: string): [string, string] => {
  const normalised = hidden.toLowerCase();

  const candidates = COMMON_SUFFIXES.filter(s => s !== normalised).sort(
    (a, b) => Math.abs(a.length - hidden.length) - Math.abs(b.length - hidden.length),
  );

  // Always guaranteed to have ≥ 2 entries given the size of COMMON_SUFFIXES.
  return [candidates[0], candidates[1]];
};
