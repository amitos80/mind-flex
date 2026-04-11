import { useMemo } from 'react';
import type { MindFlexConfig, MindFlexMode } from '@extension/word-processor';

const JUNIOR_MANIFEST_NAME_FRAGMENT = 'Junior';

/** Reads the extension manifest name to determine the active mode. */
const detectMode = (): MindFlexMode => {
  try {
    const name = chrome.runtime.getManifest().name ?? '';
    return name.includes(JUNIOR_MANIFEST_NAME_FRAGMENT) ? 'junior' : 'senior';
  } catch {
    return 'senior';
  }
};

const CONFIG_BY_MODE: Record<MindFlexMode, MindFlexConfig> = {
  senior: {
    mode: 'senior',
    theme: 'senior',
    wordLengthThreshold: 6,
    hintEnabled: false,
  },
  junior: {
    mode: 'junior',
    theme: 'junior',
    wordLengthThreshold: 3,
    hintEnabled: true,
  },
};

/**
 * Returns the {@link MindFlexConfig} for the currently running app.
 * Mode detection is memoised for the lifetime of the component tree.
 */
export const useMindFlexConfig = (): MindFlexConfig => useMemo(() => CONFIG_BY_MODE[detectMode()], []);
