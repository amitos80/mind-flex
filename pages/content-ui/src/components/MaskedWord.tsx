import type { WordChallenge } from '@extension/word-processor';

interface MaskedWordProps {
  challenge: WordChallenge;
  /** Whether this word's popover is currently open. */
  isActive: boolean;
  onClick: () => void;
}

/**
 * Renders a masked word inline within the page text.
 * The visible portion is shown in a pastel blue highlight with a dotted
 * underline; clicking it opens the choice popover.
 */
export const MaskedWord = ({ challenge, isActive, onClick }: MaskedWordProps) => (
  <span
    role="button"
    tabIndex={0}
    onClick={onClick}
    onKeyDown={e => e.key === 'Enter' && onClick()}
    style={{
      backgroundColor: isActive ? '#bfdbfe' : '#dbeafe',
      borderBottom: '2px dotted #3b82f6',
      borderRadius: '2px',
      padding: '0 2px',
      cursor: 'pointer',
      fontFamily: 'inherit',
      fontSize: 'inherit',
      color: 'inherit',
      display: 'inline',
    }}>
    {challenge.visible}
    <span style={{ color: '#93c5fd', letterSpacing: '1px' }}>___</span>
  </span>
);
