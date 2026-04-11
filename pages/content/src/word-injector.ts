import { buildChallenge } from '@extension/word-processor';
import type { ScannedNode } from './dom-scanner.js';
import type { Difficulty, WordChallenge } from '@extension/word-processor';

/** Custom event name dispatched when a masked word span is clicked. */
const MINDFLEX_WORD_CLICK_EVENT = 'mindflex:word-click';

/** Payload carried by the {@link MINDFLEX_WORD_CLICK_EVENT} custom event. */
interface WordClickPayload {
  challenge: WordChallenge;
  /** Bounding rect of the clicked span so the popover can be positioned. */
  rect: DOMRect;
  /** Unique ID matching the span element so it can be resolved on answer. */
  spanID: string;
}

let spanCounter = 0;

/**
 * Creates a `<span>` element representing a single masked word challenge.
 * Clicking the span fires a {@link MINDFLEX_WORD_CLICK_EVENT} on `document`.
 *
 * @param challenge - The fully built word challenge.
 * @returns A configured span element ready for DOM insertion.
 */
const createMaskedSpan = (challenge: WordChallenge): HTMLSpanElement => {
  const span = document.createElement('span');
  const id = `mindflex-word-${++spanCounter}`;

  span.id = id;
  span.setAttribute('data-mindflex-word', '');
  span.textContent = challenge.visible + '___';

  span.addEventListener('click', event => {
    event.stopPropagation();
    const payload: WordClickPayload = {
      challenge,
      rect: span.getBoundingClientRect(),
      spanID: id,
    };
    document.dispatchEvent(new CustomEvent(MINDFLEX_WORD_CLICK_EVENT, { detail: payload }));
  });

  return span;
};

/**
 * Replaces qualifying words inside scanned text nodes with interactive masked
 * spans. The parent element is marked so it is not re-processed on subsequent
 * scans.
 *
 * @param scannedNodes - Output from {@link scanTextNodes}.
 * @param difficulty - The masking difficulty to apply.
 */
const injectMaskedWords = (scannedNodes: ScannedNode[], difficulty: Difficulty): void => {
  for (const { node, candidates } of scannedNodes) {
    const text = node.nodeValue ?? '';
    const fragment = document.createDocumentFragment();
    let cursor = 0;

    for (const candidate of candidates) {
      if (candidate.start > cursor) {
        fragment.appendChild(document.createTextNode(text.slice(cursor, candidate.start)));
      }

      const challenge = buildChallenge(candidate.word, difficulty);
      if (challenge === null) {
        fragment.appendChild(document.createTextNode(candidate.word));
        cursor = candidate.end;
        continue;
      }
      fragment.appendChild(createMaskedSpan(challenge));
      cursor = candidate.end;
    }

    if (cursor < text.length) {
      fragment.appendChild(document.createTextNode(text.slice(cursor)));
    }

    const parent = node.parentElement;
    if (parent) {
      parent.replaceChild(fragment, node);
      parent.setAttribute('data-mindflex-processed', '');
    }
  }
};

export type { WordClickPayload };
export { MINDFLEX_WORD_CLICK_EVENT, injectMaskedWords };
