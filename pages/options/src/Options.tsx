import '@src/Options.css';
import { useStorage, withErrorBoundary, withSuspense } from '@extension/shared';
import { mindFlexSettingsStorage, mindFlexScoreStorage } from '@extension/storage';
import { ErrorDisplay, LoadingSpinner } from '@extension/ui';
import { useState } from 'react';
import type { MindFlexDifficulty } from '@extension/storage';

const DIFFICULTY_OPTIONS: { label: string; value: MindFlexDifficulty; description: string }[] = [
  { label: 'Easy', value: 'easy', description: 'Hides last 2 letters' },
  { label: 'Medium', value: 'medium', description: 'Hides half the word' },
  { label: 'Hard', value: 'hard', description: 'Shows only first letter' },
];

const MIN_WORD_LENGTH_MIN = 5;
const MIN_WORD_LENGTH_MAX = 15;

const Options = () => {
  const settings = useStorage(mindFlexSettingsStorage);
  const score = useStorage(mindFlexScoreStorage);
  const [resetConfirm, setResetConfirm] = useState(false);

  const setDifficulty = (difficulty: MindFlexDifficulty) =>
    mindFlexSettingsStorage.set(prev => ({ ...prev, difficulty }));

  const setMinWordLength = (minWordLength: number) => mindFlexSettingsStorage.set(prev => ({ ...prev, minWordLength }));

  const resetScores = async () => {
    await mindFlexScoreStorage.set({ sessionScore: 0, totalScore: 0 });
    setResetConfirm(false);
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="mx-auto max-w-2xl">
        {/* Header */}
        <div className="mb-8 flex items-center gap-4">
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-500 text-3xl font-bold text-white">
            M
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">MindFlex Settings</h1>
            <p className="text-sm text-gray-500">Customise your cognitive training experience</p>
          </div>
        </div>

        {/* Difficulty */}
        <section className="mb-6 rounded-2xl bg-white p-6 shadow-sm">
          <h2 className="mb-1 text-base font-semibold text-gray-800">Difficulty</h2>
          <p className="mb-4 text-sm text-gray-500">Controls how much of each word is hidden.</p>
          <div className="grid grid-cols-3 gap-3">
            {DIFFICULTY_OPTIONS.map(({ label, value, description }) => (
              <button
                key={value}
                onClick={() => setDifficulty(value)}
                className={`rounded-xl border-2 p-4 text-left transition-colors ${
                  settings.difficulty === value
                    ? 'border-blue-500 bg-blue-50'
                    : 'border-gray-200 bg-white hover:border-gray-300'
                }`}>
                <p className={`font-semibold ${settings.difficulty === value ? 'text-blue-700' : 'text-gray-700'}`}>
                  {label}
                </p>
                <p className="mt-1 text-xs text-gray-400">{description}</p>
              </button>
            ))}
          </div>
        </section>

        {/* Minimum word length */}
        <section className="mb-6 rounded-2xl bg-white p-6 shadow-sm">
          <h2 className="mb-1 text-base font-semibold text-gray-800">Minimum Word Length</h2>
          <p className="mb-4 text-sm text-gray-500">Only words with at least this many characters will be masked.</p>
          <div className="flex items-center gap-4">
            <input
              type="range"
              min={MIN_WORD_LENGTH_MIN}
              max={MIN_WORD_LENGTH_MAX}
              value={settings.minWordLength}
              onChange={e => setMinWordLength(Number(e.target.value))}
              className="h-2 w-full cursor-pointer appearance-none rounded-full bg-blue-200 accent-blue-500"
            />
            <span className="w-8 text-center text-lg font-bold text-blue-600">{settings.minWordLength}</span>
          </div>
          <p className="mt-2 text-xs text-gray-400">
            Range: {MIN_WORD_LENGTH_MIN}–{MIN_WORD_LENGTH_MAX} characters
          </p>
        </section>

        {/* Score history */}
        <section className="rounded-2xl bg-white p-6 shadow-sm">
          <h2 className="mb-1 text-base font-semibold text-gray-800">Score History</h2>
          <p className="mb-4 text-sm text-gray-500">Your cumulative correct answers.</p>
          <div className="mb-4 flex gap-4">
            <div className="flex-1 rounded-xl bg-blue-50 p-4 text-center">
              <p className="text-3xl font-bold text-blue-600">{score.totalScore}</p>
              <p className="mt-1 text-xs text-blue-400">Total correct</p>
            </div>
          </div>
          {resetConfirm ? (
            <div className="flex items-center gap-3 rounded-xl bg-red-50 p-3">
              <p className="flex-1 text-sm text-red-600">Reset all scores to zero?</p>
              <button
                onClick={resetScores}
                className="rounded-lg bg-red-500 px-3 py-1.5 text-sm font-semibold text-white hover:bg-red-600">
                Confirm
              </button>
              <button
                onClick={() => setResetConfirm(false)}
                className="rounded-lg border border-gray-300 px-3 py-1.5 text-sm text-gray-600 hover:bg-gray-100">
                Cancel
              </button>
            </div>
          ) : (
            <button
              onClick={() => setResetConfirm(true)}
              className="rounded-lg border-2 border-red-200 px-4 py-2 text-sm font-semibold text-red-500 hover:border-red-300 hover:bg-red-50">
              Reset Score History
            </button>
          )}
        </section>
      </div>
    </div>
  );
};

export default withErrorBoundary(withSuspense(Options, <LoadingSpinner />), ErrorDisplay);
