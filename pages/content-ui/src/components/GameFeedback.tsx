import { useEffect, useState } from 'react';

interface GameFeedbackProps {
  /** `true` = correct answer, `false` = incorrect. */
  correct: boolean;
  /** Called once the animation finishes so the parent can clear the feedback. */
  onDone: () => void;
  /** Viewport position of the span that was answered. */
  anchorRect: DOMRect;
}

/** Duration in ms of the feedback flash animation. */
const FEEDBACK_DURATION_MS = 700;

/**
 * Renders a brief colour-flash overlay anchored over the answered word span.
 * Green for correct, red for incorrect.  Automatically calls `onDone` after
 * the animation completes.
 */
export const GameFeedback = ({ correct, onDone, anchorRect }: GameFeedbackProps) => {
  const [opacity, setOpacity] = useState(0.85);

  useEffect(() => {
    // Fade out smoothly
    const fadeTimer = setTimeout(() => setOpacity(0), FEEDBACK_DURATION_MS * 0.5);
    const doneTimer = setTimeout(onDone, FEEDBACK_DURATION_MS);
    return () => {
      clearTimeout(fadeTimer);
      clearTimeout(doneTimer);
    };
  }, [onDone]);

  return (
    <div
      aria-live="polite"
      style={{
        position: 'absolute',
        top: anchorRect.top + window.scrollY,
        left: anchorRect.left + window.scrollX,
        width: anchorRect.width,
        height: anchorRect.height,
        borderRadius: '4px',
        background: correct ? '#86efac' : '#fca5a5',
        opacity,
        transition: `opacity ${FEEDBACK_DURATION_MS * 0.5}ms ease`,
        pointerEvents: 'none',
        zIndex: 2147483646,
      }}
    />
  );
};
