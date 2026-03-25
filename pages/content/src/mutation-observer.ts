import { scanTextNodes } from './dom-scanner.js';
import { injectMaskedWords } from './word-injector.js';
import type { Difficulty } from '@extension/word-processor';

/** Milliseconds to wait after the last mutation before re-scanning. */
const DEBOUNCE_MS = 400;

let debounceTimer: ReturnType<typeof setTimeout> | null = null;

/**
 * Starts a `MutationObserver` that watches for new DOM nodes added to the
 * page and scans them for qualifying words.  A debounce prevents thrashing on
 * pages that add many nodes rapidly (e.g., infinite scroll feeds).
 *
 * @param getSettings - Callback returning the current enabled flag and difficulty.
 * @returns A cleanup function that disconnects the observer.
 */
export const startMutationObserver = (
  getSettings: () => { enabled: boolean; difficulty: Difficulty; minWordLength: number },
): (() => void) => {
  const observer = new MutationObserver(mutations => {
    if (debounceTimer !== null) clearTimeout(debounceTimer);

    debounceTimer = setTimeout(() => {
      const { enabled, difficulty, minWordLength } = getSettings();
      if (!enabled) return;

      const addedElements: Element[] = [];
      for (const mutation of mutations) {
        Array.from(mutation.addedNodes).forEach(node => {
          if (node.nodeType === Node.ELEMENT_NODE) {
            addedElements.push(node as Element);
          }
        });
      }

      for (const el of addedElements) {
        const scanned = scanTextNodes(el, minWordLength);
        injectMaskedWords(scanned, difficulty);
      }
    }, DEBOUNCE_MS);
  });

  observer.observe(document.body, { childList: true, subtree: true });

  return () => {
    observer.disconnect();
    if (debounceTimer !== null) clearTimeout(debounceTimer);
  };
};
