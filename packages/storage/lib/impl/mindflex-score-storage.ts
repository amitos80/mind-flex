import { createStorage, StorageEnum } from '../base/index.js';

/** Tracked scores for the MindFlex gamification engine. */
interface MindFlexScore {
  /** Correct answers in the current browsing session. */
  sessionScore: number;
  /** Cumulative correct answers across all sessions. */
  totalScore: number;
}

const DEFAULT_SCORE: MindFlexScore = {
  sessionScore: 0,
  totalScore: 0,
};

const mindFlexScoreStorage = createStorage<MindFlexScore>('mindflex-score-key', DEFAULT_SCORE, {
  storageEnum: StorageEnum.Local,
  liveUpdate: true,
});

export type { MindFlexScore };
export { mindFlexScoreStorage };
