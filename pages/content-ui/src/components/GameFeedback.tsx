import { useEffect, useState } from 'react';

interface GameFeedbackProps {
  /** `true` = correct answer, `false` = incorrect. */
  correct: boolean;
  /** Called once the animation finishes so the parent can clear the feedback. */
  onDone: () => void;
  /** Viewport-relative bounding rect of the span that was answered. */
  anchorRect: DOMRect;
}

const FEEDBACK_DURATION_MS = 900;

const CONFETTI_COLORS = ['#3b82f6', '#22c55e', '#f59e0b', '#8b5cf6', '#ec4899', '#06b6d4'];
const PARTICLE_COUNT = 18;

/**
 * Pre-computed particle trajectories so the animation values are stable across
 * re-renders without relying on random numbers inside JSX.
 */
const PARTICLES = Array.from({ length: PARTICLE_COUNT }, (_, i) => {
  const angle = (i / PARTICLE_COUNT) * Math.PI * 2;
  const dist = 44 + (i % 3) * 14;
  return {
    dx: Math.round(Math.cos(angle) * dist),
    dy: Math.round(Math.sin(angle) * dist),
    rot: (i % 2 === 0 ? 1 : -1) * (160 + i * 22),
    shape: i % 3,
    color: CONFETTI_COLORS[i % CONFETTI_COLORS.length],
  };
});

/**
 * WHY: Keyframes are injected as a <style> element inside the shadow DOM so
 * they are scoped to our root and cannot affect the host page's styles.
 */
const CONFETTI_KEYFRAMES = `
  @keyframes mf-burst {
    0%   { transform: translate(0, 0) scale(1) rotate(0deg); opacity: 1; }
    100% { transform: translate(var(--dx), var(--dy)) scale(0) rotate(var(--rot)); opacity: 0; }
  }
  @keyframes mf-flash {
    0%   { opacity: 0.85; }
    60%  { opacity: 0.85; }
    100% { opacity: 0; }
  }
`;

/**
 * Renders either a confetti burst (correct) or a red flash (incorrect) over
 * the answered word span.  Both animations auto-dismiss via `onDone`.
 */
export const GameFeedback = ({ correct, onDone, anchorRect }: GameFeedbackProps) => {
  const [mounted, setMounted] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setMounted(false);
      onDone();
    }, FEEDBACK_DURATION_MS);
    return () => clearTimeout(timer);
  }, [onDone]);

  if (!mounted) return null;

  const cx = anchorRect.left + window.scrollX + anchorRect.width / 2;
  const cy = anchorRect.top + window.scrollY + anchorRect.height / 2;

  return (
    <>
      <style>{CONFETTI_KEYFRAMES}</style>

      {/* Colour flash behind the word — green for correct, red for incorrect */}
      <div
        aria-live="polite"
        style={{
          position: 'absolute',
          top: anchorRect.top + window.scrollY,
          left: anchorRect.left + window.scrollX,
          width: Math.max(anchorRect.width, 24),
          height: Math.max(anchorRect.height, 18),
          borderRadius: '4px',
          background: correct ? '#86efac' : '#fca5a5',
          animation: `mf-flash ${FEEDBACK_DURATION_MS}ms ease forwards`,
          pointerEvents: 'none',
          zIndex: 2147483646,
        }}
      />

      {/* Confetti particles — only for correct answers */}
      {correct &&
        PARTICLES.map((p, i) => (
          <div
            key={i}
            style={
              {
                position: 'absolute',
                top: cy - 4,
                left: cx - 4,
                width: 8,
                height: 8,
                borderRadius: p.shape === 0 ? '50%' : p.shape === 1 ? '0' : '2px',
                background: p.color,
                pointerEvents: 'none',
                zIndex: 2147483647,
                '--dx': `${p.dx}px`,
                '--dy': `${p.dy}px`,
                '--rot': `${p.rot}deg`,
                animation: `mf-burst ${FEEDBACK_DURATION_MS}ms ease-out forwards`,
              } as React.CSSProperties
            }
          />
        ))}
    </>
  );
};
