import { useEffect, useRef } from 'react';
import type { WordChallenge } from '@extension/word-processor';

interface ChoicePopoverProps {
  challenge: WordChallenge;
  /** Viewport-relative bounding rect of the triggering span. */
  anchorRect: DOMRect;
  onAnswer: (correct: boolean) => void;
  onClose: () => void;
}

/**
 * Shuffles an array in-place using Fisher-Yates.
 * WHY: We want the correct answer in a random position each time so users
 *      cannot rely on positional memory.
 */
const shuffle = <T,>(arr: T[]): T[] => {
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
};

/**
 * A floating bubble popover presenting three completion choices for a masked
 * word.  Positioned above the triggering span using the provided bounding rect.
 * Closes when the user clicks outside or presses Escape.
 */
export const ChoicePopover = ({ challenge, anchorRect, onAnswer, onClose }: ChoicePopoverProps) => {
  const ref = useRef<HTMLDivElement>(null);

  const options = useRef(shuffle([challenge.hidden, challenge.distractors[0], challenge.distractors[1]])).current;

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    const handleClickOutside = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) onClose();
    };

    document.addEventListener('keydown', handleKeyDown);
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [onClose]);

  // Position the popover above the anchor span, accounting for scroll.
  const top = anchorRect.top + window.scrollY - 8;
  const left = anchorRect.left + window.scrollX + anchorRect.width / 2;

  return (
    <div
      ref={ref}
      role="dialog"
      aria-label="Choose the missing word ending"
      style={{
        position: 'absolute',
        top,
        left,
        transform: 'translate(-50%, -100%)',
        zIndex: 2147483647,
        background: '#ffffff',
        border: '1px solid #e2e8f0',
        borderRadius: '12px',
        boxShadow: '0 8px 24px rgba(0,0,0,0.15)',
        padding: '12px',
        display: 'flex',
        gap: '8px',
        userSelect: 'none',
      }}>
      {/* Arrow pointing down */}
      <div
        style={{
          position: 'absolute',
          bottom: '-7px',
          left: '50%',
          transform: 'translateX(-50%)',
          width: 0,
          height: 0,
          borderLeft: '7px solid transparent',
          borderRight: '7px solid transparent',
          borderTop: '7px solid #e2e8f0',
        }}
      />
      {options.map(option => (
        <button
          key={option}
          onClick={() => onAnswer(option === challenge.hidden)}
          style={{
            minWidth: '72px',
            padding: '10px 14px',
            borderRadius: '8px',
            border: '2px solid #e2e8f0',
            background: '#f8fafc',
            fontSize: '15px',
            fontWeight: 600,
            cursor: 'pointer',
            color: '#1e293b',
            transition: 'background 0.15s, border-color 0.15s',
          }}
          onMouseEnter={e => {
            (e.currentTarget as HTMLButtonElement).style.background = '#eff6ff';
            (e.currentTarget as HTMLButtonElement).style.borderColor = '#3b82f6';
          }}
          onMouseLeave={e => {
            (e.currentTarget as HTMLButtonElement).style.background = '#f8fafc';
            (e.currentTarget as HTMLButtonElement).style.borderColor = '#e2e8f0';
          }}>
          -{option}
        </button>
      ))}
    </div>
  );
};
