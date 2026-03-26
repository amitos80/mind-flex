import '@src/index.css';
import { useStorage, withErrorBoundary, withSuspense } from '@extension/shared';
import { mindFlexSettingsStorage, mindFlexScoreStorage } from '@extension/storage';
import { ErrorDisplay, LoadingSpinner } from '@extension/ui';
import type { MindFlexDifficulty } from '@extension/storage';

const DIFFICULTY_OPTIONS: { label: string; value: MindFlexDifficulty }[] = [
  { label: 'Easy', value: 'easy' },
  { label: 'Medium', value: 'medium' },
  { label: 'Hard', value: 'hard' },
];

const Popup = () => {
  const settings = useStorage(mindFlexSettingsStorage);
  const score = useStorage(mindFlexScoreStorage);

  const toggleEnabled = () => mindFlexSettingsStorage.set(prev => ({ ...prev, enabled: !prev.enabled }));

  const setDifficulty = (difficulty: MindFlexDifficulty) =>
    mindFlexSettingsStorage.set(prev => ({ ...prev, difficulty }));

  return (
    <div className="flex min-h-[300px] w-80 flex-col bg-white p-5">
      {/* Header */}
      <div className="mb-5 flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-500 text-xl font-bold text-white">
          M
        </div>
        <div>
          <h1 className="text-lg font-bold text-gray-900">MindFlex</h1>
          <p className="text-xs text-gray-500">Cognitive training while you browse</p>
        </div>
      </div>

      {/* Enable / Disable toggle */}
      <div className="mb-5 flex items-center justify-between rounded-xl bg-gray-50 px-4 py-3">
        <div>
          <p className="text-sm font-semibold text-gray-800">Active</p>
          <p className="text-xs text-gray-400">{settings.enabled ? 'Scanning this page' : 'Paused'}</p>
        </div>
        <button
          onClick={toggleEnabled}
          className={`relative h-7 w-12 rounded-full transition-colors duration-200 focus:outline-none ${
            settings.enabled ? 'bg-blue-500' : 'bg-gray-300'
          }`}
          aria-pressed={settings.enabled}
          aria-label="Toggle MindFlex">
          <span
            className={`absolute top-0.5 h-6 w-6 rounded-full bg-white shadow transition-transform duration-200 ${
              settings.enabled ? 'translate-left-1' : 'translate-left-0'
            }`}
          />
        </button>
      </div>

      {/* Difficulty selector */}
      <div className="mb-5">
        <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-gray-500">Difficulty</p>
        <div className="flex gap-2">
          {DIFFICULTY_OPTIONS.map(({ label, value }) => (
            <button
              key={value}
              onClick={() => setDifficulty(value)}
              disabled={!settings.enabled}
              className={`flex-1 rounded-lg border-2 py-1.5 text-sm font-semibold transition-colors ${
                settings.difficulty === value
                  ? 'border-blue-500 bg-blue-50 text-blue-700'
                  : 'border-gray-200 bg-white text-gray-500 hover:border-gray-300'
              } disabled:cursor-not-allowed disabled:opacity-40`}>
              {label}
            </button>
          ))}
        </div>
      </div>

      {/* Score display */}
      <div className="mt-auto grid grid-cols-2 gap-3">
        <div className="rounded-xl bg-blue-50 p-3 text-center">
          <p className="text-2xl font-bold text-blue-600">{score.sessionScore}</p>
          <p className="mt-0.5 text-xs text-blue-400">This page</p>
        </div>
        <div className="rounded-xl bg-gray-50 p-3 text-center">
          <p className="text-2xl font-bold text-gray-700">{score.totalScore}</p>
          <p className="mt-0.5 text-xs text-gray-400">All time</p>
        </div>
      </div>
    </div>
  );
};

export default withErrorBoundary(withSuspense(Popup, <LoadingSpinner />), ErrorDisplay);
