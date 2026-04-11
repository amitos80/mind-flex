import 'webextension-polyfill';
import { mindFlexScoreStorage, mindFlexSettingsStorage } from '@extension/storage';
import type { MindFlexSettings } from '@extension/storage';

console.log('[MindFlex] Background service worker started.');

/**
 * Resets the session score to zero when the user navigates to a new page.
 * WHY: A "session" is scoped to a single page — navigating away starts fresh.
 */
chrome.tabs.onUpdated.addListener((_tabID, changeInfo) => {
  if (changeInfo.status === 'loading') {
    void mindFlexScoreStorage.set(prev => ({ ...prev, sessionScore: 0 }));
  }
});

/**
 * Broadcasts updated settings to the active tab's content script whenever
 * storage changes.  This keeps content scripts in sync without requiring a
 * page reload after the user changes difficulty or toggles the extension.
 */
mindFlexSettingsStorage.subscribe(async () => {
  const settings: MindFlexSettings = await mindFlexSettingsStorage.get();

  const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
  if (!tab?.id) return;

  chrome.tabs
    .sendMessage(tab.id, {
      type: 'MINDFLEX_SETTINGS_CHANGED',
      settings,
    })
    .catch(() => {
      // Content script may not be present on all tabs (e.g. chrome:// pages).
    });
});
