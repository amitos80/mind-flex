import { mindFlexSettingsStorage } from '@extension/storage';
import { scanTextNodes } from '@src/dom-scanner';
import { startMutationObserver } from '@src/mutation-observer';
import { injectMaskedWords } from '@src/word-injector';
import type { MindFlexSettings } from '@extension/storage';
import type { Difficulty } from '@extension/word-processor';

let currentSettings: MindFlexSettings = {
  enabled: true,
  difficulty: 'medium',
  minWordLength: 8,
};

/** Runs an initial full-page scan and injects masked words. */
const runInitialScan = (): void => {
  if (!currentSettings.enabled) return;
  const scanned = scanTextNodes(document.body, currentSettings.minWordLength);
  injectMaskedWords(scanned, currentSettings.difficulty);
};

/** Message sent from the background service worker or popup. */
interface MindFlexMessage {
  type: 'MINDFLEX_SETTINGS_CHANGED';
  settings: MindFlexSettings;
}

const init = async (): Promise<void> => {
  currentSettings = await mindFlexSettingsStorage.get();

  // Listen for settings changes pushed from popup/options.
  chrome.runtime.onMessage.addListener((message: MindFlexMessage) => {
    if (message.type === 'MINDFLEX_SETTINGS_CHANGED') {
      currentSettings = message.settings;
    }
  });

  startMutationObserver(() => ({
    enabled: currentSettings.enabled,
    difficulty: currentSettings.difficulty as Difficulty,
    minWordLength: currentSettings.minWordLength,
  }));

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', runInitialScan);
  } else {
    runInitialScan();
  }
};

void init();
