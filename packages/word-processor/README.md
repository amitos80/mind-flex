# @extension/word-processor

Pure TypeScript library implementing MindFlex's cognitive challenge engine.
No browser APIs — fully unit-testable in Node.js.

## Modules

| Module | Export | Description |
|---|---|---|
| `word-detector.ts` | `detectWords(text, minLength)` | Finds qualifying words in a text string |
| `masking-engine.ts` | `maskWord(word, difficulty)` | Applies Easy / Medium / Hard masking |
| `distractor-gen.ts` | `generateDistractors(hidden)` | Produces two plausible wrong-answer options |
| `challenge-builder.ts` | `buildChallenge(word, difficulty)` | Convenience wrapper combining all three |

## Types

- `Difficulty` — `'easy' | 'medium' | 'hard'`
- `WordCandidate` — word + start/end offsets within source text
- `MaskedWord` — original, visible, hidden portions
- `WordChallenge` — extends `MaskedWord` with `distractors: [string, string]`

## Difficulty Rules

| Level | Hidden chars |
|---|---|
| Easy | Last 2 characters |
| Medium | Last 50% of the word (rounded up) |
| Hard | All except the first character |

## Tests

```bash
pnpm --filter @extension/word-processor-tests test
```
