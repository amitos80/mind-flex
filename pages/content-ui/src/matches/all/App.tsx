import { mindFlexScoreStorage } from '@extension/storage';
import { ChoicePopover } from '@src/components/ChoicePopover';
import { GameFeedback } from '@src/components/GameFeedback';
import { MINDFLEX_WORD_CLICK_EVENT } from '@src/events';
import { useCallback, useEffect, useState } from 'react';
import type { WordChallenge } from '@extension/word-processor';
import type { WordClickPayload } from '@src/events';

interface ActiveChallenge {
  challenge: WordChallenge;
  rect: DOMRect;
  spanID: string;
}

interface FeedbackState {
  correct: boolean;
  rect: DOMRect;
}

/**
 * Root UI component injected into every page via the content-ui shadow DOM.
 * Listens for word-click events dispatched by the content script and renders
 * the choice popover and result feedback overlay.
 */
export default function App() {
  const [active, setActive] = useState<ActiveChallenge | null>(null);
  const [feedback, setFeedback] = useState<FeedbackState | null>(null);

  useEffect(() => {
    const handler = (e: Event) => {
      const { challenge, rect, spanID } = (e as CustomEvent<WordClickPayload>).detail;
      setActive({ challenge, rect, spanID });
    };

    document.addEventListener(MINDFLEX_WORD_CLICK_EVENT, handler);
    return () => document.removeEventListener(MINDFLEX_WORD_CLICK_EVENT, handler);
  }, []);

  const handleAnswer = useCallback(
    async (correct: boolean) => {
      if (!active) return;

      setFeedback({ correct, rect: active.rect });
      setActive(null);

      if (correct) {
        await mindFlexScoreStorage.set(prev => ({
          sessionScore: prev.sessionScore + 1,
          totalScore: prev.totalScore + 1,
        }));
      }

      // Visually resolve the span: replace placeholder text with the answer.
      const span = document.getElementById(active.spanID);
      if (span) {
        span.textContent = active.challenge.original;
        span.style.borderBottom = correct ? '2px solid #22c55e' : '2px solid #ef4444';
        span.style.backgroundColor = correct ? '#dcfce7' : '#fee2e2';
        span.style.cursor = 'default';
        span.removeAttribute('role');
      }
    },
    [active],
  );

  const handleClose = useCallback(() => setActive(null), []);
  const handleFeedbackDone = useCallback(() => setFeedback(null), []);

  return (
    <>
      {active && (
        <ChoicePopover
          challenge={active.challenge}
          anchorRect={active.rect}
          onAnswer={handleAnswer}
          onClose={handleClose}
        />
      )}
      {feedback && <GameFeedback correct={feedback.correct} anchorRect={feedback.rect} onDone={handleFeedbackDone} />}
    </>
  );
}
