import type { MindFlexDifficulty } from '@extension/storage';
import type { MindFlexMode } from '@extension/word-processor';

interface HeaderProps {
  mode: MindFlexMode;
}

interface ToggleProps {
  mode: MindFlexMode;
  enabled: boolean;
  onToggle: () => void;
}

interface DifficultyOption {
  label: string;
  value: MindFlexDifficulty;
}

interface DifficultyProps {
  mode: MindFlexMode;
  options: DifficultyOption[];
  current: MindFlexDifficulty;
  enabled: boolean;
  onSelect: (v: MindFlexDifficulty) => void;
}

interface ScoreProps {
  mode: MindFlexMode;
  sessionScore: number;
  totalScore: number;
  celebrate: boolean;
}

const PopupHeader = ({ mode }: HeaderProps) => (
  <div className="mb-5 flex items-center gap-3">
    <div
      className={`flex items-center justify-center rounded-xl text-xl font-bold text-white ${
        mode === 'junior' ? 'h-10 w-10 bg-green-500' : 'h-10 w-10 bg-blue-500'
      }`}>
      {mode === 'junior' ? '🧠' : 'M'}
    </div>
    <div>
      <h1 className={`font-bold text-gray-900 ${mode === 'senior' ? 'text-xl' : 'text-lg'}`}>
        {mode === 'junior' ? 'MindFlex Junior' : 'MindFlex'}
      </h1>
      <p className="text-xs text-gray-500">
        {mode === 'junior' ? 'Learn words while you browse!' : 'Cognitive training while you browse'}
      </p>
    </div>
  </div>
);

const EnableToggle = ({ mode, enabled, onToggle }: ToggleProps) => (
  <div className="mb-5 flex items-center justify-between rounded-xl bg-gray-50 px-4 py-3">
    <div>
      <p className={`font-semibold text-gray-800 ${mode === 'senior' ? 'text-base' : 'text-sm'}`}>Active</p>
      <p className="text-xs text-gray-400">{enabled ? 'Scanning this page' : 'Paused'}</p>
    </div>
    <button
      onClick={onToggle}
      className={`relative rounded-full transition-colors duration-200 focus:outline-none ${
        mode === 'senior' ? 'h-8 w-14' : 'h-7 w-12'
      } ${enabled ? 'bg-blue-500' : 'bg-gray-300'}`}
      aria-pressed={enabled}
      aria-label="Toggle MindFlex">
      <span
        className={`absolute top-0.5 rounded-full bg-white shadow transition-transform duration-200 ${
          mode === 'senior' ? 'h-7 w-7' : 'h-6 w-6'
        } ${enabled ? 'translate-x-6' : 'translate-x-0.5'}`}
      />
    </button>
  </div>
);

const DifficultySelector = ({ mode, options, current, enabled, onSelect }: DifficultyProps) => (
  <div className="mb-5">
    <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-gray-500">Difficulty</p>
    <div className="flex gap-2">
      {options.map(({ label, value }) => (
        <button
          key={value}
          onClick={() => onSelect(value)}
          disabled={!enabled}
          className={`flex-1 rounded-lg border-2 font-semibold transition-colors ${
            mode === 'senior' ? 'py-2.5 text-base' : 'py-1.5 text-sm'
          } ${
            current === value
              ? 'border-blue-500 bg-blue-50 text-blue-700'
              : 'border-gray-200 bg-white text-gray-500 hover:border-gray-300'
          } disabled:cursor-not-allowed disabled:opacity-40`}>
          {label}
        </button>
      ))}
    </div>
  </div>
);

const ScoreDisplay = ({ mode, sessionScore, totalScore, celebrate }: ScoreProps) => (
  <div className="mt-auto grid grid-cols-2 gap-3">
    <div
      className={`rounded-xl p-3 text-center transition-transform ${
        mode === 'junior' && celebrate ? 'animate-bounce bg-green-50' : 'bg-blue-50'
      }`}>
      <p className={`font-bold ${mode === 'senior' ? 'text-3xl text-blue-600' : 'text-2xl text-blue-600'}`}>
        {sessionScore}
      </p>
      <p className="mt-0.5 text-xs text-blue-400">This page</p>
    </div>
    <div className="rounded-xl bg-gray-50 p-3 text-center">
      <p className={`font-bold text-gray-700 ${mode === 'senior' ? 'text-3xl' : 'text-2xl'}`}>{totalScore}</p>
      <p className="mt-0.5 text-xs text-gray-400">All time</p>
    </div>
  </div>
);

export { PopupHeader, EnableToggle, DifficultySelector, ScoreDisplay };
