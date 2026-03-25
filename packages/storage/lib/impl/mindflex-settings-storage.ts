import { createStorage, StorageEnum } from '../base/index.js';

/** Difficulty level controlling how much of each word is hidden. */
type MindFlexDifficulty = 'easy' | 'medium' | 'hard';

/** Persisted settings for the MindFlex extension. */
interface MindFlexSettings {
  /** Whether the extension is actively scanning and masking words. */
  enabled: boolean;
  /** Current challenge difficulty. */
  difficulty: MindFlexDifficulty;
  /** Minimum word length to qualify for masking (inclusive). */
  minWordLength: number;
}

const DEFAULT_SETTINGS: MindFlexSettings = {
  enabled: true,
  difficulty: 'medium',
  minWordLength: 8,
};

const mindFlexSettingsStorage = createStorage<MindFlexSettings>('mindflex-settings-key', DEFAULT_SETTINGS, {
  storageEnum: StorageEnum.Local,
  liveUpdate: true,
});

export type { MindFlexDifficulty, MindFlexSettings };
export { mindFlexSettingsStorage };
