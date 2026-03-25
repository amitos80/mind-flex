import { detectWords } from '@extension/word-processor';
import type { WordCandidate } from '@extension/word-processor';

/** Tags whose text content must never be scanned or modified. */
const SKIP_TAGS = new Set([
  'SCRIPT',
  'STYLE',
  'NOSCRIPT',
  'TEXTAREA',
  'INPUT',
  'SELECT',
  'BUTTON',
  'IFRAME',
  'OBJECT',
  'CODE',
  'PRE',
]);

/**
 * Determines whether a DOM node should be skipped during traversal.
 *
 * @param node - Any DOM node encountered during the tree walk.
 * @returns `true` when the node (or its parent tag) should be excluded.
 */
const shouldSkip = (node: Node): boolean => {
  const parent = node.parentElement;
  if (!parent) return true;
  if (SKIP_TAGS.has(parent.tagName)) return true;
  // Skip nodes already processed by MindFlex.
  if (parent.hasAttribute('data-mindflex-processed')) return true;
  return false;
};

/** A scanned text node paired with its detected word candidates. */
export interface ScannedNode {
  node: Text;
  candidates: WordCandidate[];
}

/**
 * Walks all text nodes within a root element and returns those that contain
 * at least one word candidate meeting the minimum length requirement.
 *
 * @param root - The element to scan (typically `document.body`).
 * @param minWordLength - Minimum word length to qualify for masking.
 * @returns List of text nodes with their extracted word candidates.
 */
export const scanTextNodes = (root: Element, minWordLength: number): ScannedNode[] => {
  const results: ScannedNode[] = [];
  const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT, {
    acceptNode: node => (shouldSkip(node) ? NodeFilter.FILTER_REJECT : NodeFilter.FILTER_ACCEPT),
  });

  let current = walker.nextNode();
  while (current !== null) {
    const text = current as Text;
    const candidates = detectWords(text.nodeValue ?? '', minWordLength);
    if (candidates.length > 0) {
      results.push({ node: text, candidates });
    }
    current = walker.nextNode();
  }

  return results;
};
