import '@src/index.css';
import { PopupHeader, EnableToggle, DifficultySelector, ScoreDisplay } from './PopupLayout.js';
import { useStorage, withErrorBoundary, withSuspense, useMindFlexConfig } from '@extension/shared';
import { mindFlexSettingsStorage, mindFlexScoreStorage } from '@extension/storage';
import { ErrorDisplay, LoadingSpinner } from '@extension/ui';
import { useState, useEffect } from 'react';
import type { MindFlexDifficulty } from '@extension/storage';
import type { MindFlexMode } from '@extension/word-processor';

const DIFFICULTY_OPTIONS: { label: string; value: MindFlexDifficulty }[] = [
  { label: 'Easy', value: 'easy' },
  { label: 'Medium', value: 'medium' },
  { label: 'Hard', value: 'hard' },
];

interface PopupProps {
  mode?: MindFlexMode;
}

const Popup = ({ mode: modeProp }: PopupProps) => {
  const config = useMindFlexConfig();
  const mode = modeProp ?? config.mode;

  const settings = useStorage(mindFlexSettingsStorage);
  const score = useStorage(mindFlexScoreStorage);

  const [celebrate, setCelebrate] = useState(false);
  const prevSessionScore = useState(score.sessionScore)[0];

  useEffect(() => {
    if (mode !== 'junior' || score.sessionScore <= prevSessionScore) return;
    setCelebrate(true);
    const timer = setTimeout(() => setCelebrate(false), 1000);
    return () => clearTimeout(timer);
  }, [score.sessionScore, mode, prevSessionScore]);

  const toggleEnabled = () => mindFlexSettingsStorage.set(prev => ({ ...prev, enabled: !prev.enabled }));

  const setDifficulty = (difficulty: MindFlexDifficulty) =>
    mindFlexSettingsStorage.set(prev => ({ ...prev, difficulty }));

  return (
    <div
      className={`flex flex-col bg-white p-5 ${mode === 'senior' ? 'min-h-[340px] w-96' : 'min-h-[300px] w-80'}`}
      data-theme={mode}>
      <PopupHeader mode={mode} />
      <EnableToggle mode={mode} enabled={settings.enabled} onToggle={toggleEnabled} />
      <DifficultySelector
        mode={mode}
        options={DIFFICULTY_OPTIONS}
        current={settings.difficulty}
        enabled={settings.enabled}
        onSelect={setDifficulty}
      />
      <ScoreDisplay mode={mode} sessionScore={score.sessionScore} totalScore={score.totalScore} celebrate={celebrate} />
    </div>
  );
};

export default withErrorBoundary(withSuspense(Popup, <LoadingSpinner />), ErrorDisplay);
