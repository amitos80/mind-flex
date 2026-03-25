import type { WordChallenge } from '@extension/word-processor';

/**
 * Custom event dispatched by the content script when a masked word span is
 * clicked.  The content-ui layer listens for this to render the choice popover.
 * WHY: Using a DOM custom event bridges the gap between the vanilla content
 *      script (which manipulates the host page DOM) and the React tree that
 *      lives inside the shadow DOM.
 */
export const MINDFLEX_WORD_CLICK_EVENT = 'mindflex:word-click';

/** Payload attached to the {@link MINDFLEX_WORD_CLICK_EVENT} custom event. */
export interface WordClickPayload {
  challenge: WordChallenge;
  rect: DOMRect;
  spanID: string;
}
