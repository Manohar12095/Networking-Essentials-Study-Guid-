import React, { useEffect, useState } from 'react';
import { storage } from '../../lib/storage';

export const FontSizeControl: React.FC = () => {
  const [fontStep, setFontStep] = useState<number>(storage.getFontStep());

  useEffect(() => {
    document.documentElement.setAttribute('data-font-step', fontStep.toString());
    storage.setFontStep(fontStep);
  }, [fontStep]);

  const decrease = () => {
    setFontStep((prev) => Math.max(0, prev - 1));
  };

  const increase = () => {
    setFontStep((prev) => Math.min(3, prev + 1));
  };

  const labels = ['A−', 'A', 'A+', 'A++'];

  return (
    <div
      className="flex items-center border border-[var(--rule)] bg-[var(--surface)] rounded overflow-hidden text-xs font-sans"
      title="Adjust reading font size"
    >
      <button
        onClick={decrease}
        disabled={fontStep === 0}
        className="px-2 py-1.5 hover:bg-[var(--paper)] text-[var(--ink)] disabled:opacity-30 disabled:cursor-not-allowed border-r border-[var(--rule)]"
        aria-label="Decrease font size"
      >
        A−
      </button>
      <span className="px-2 py-1 text-[var(--muted)] font-mono min-w-[28px] text-center">
        {labels[fontStep]}
      </span>
      <button
        onClick={increase}
        disabled={fontStep === 3}
        className="px-2 py-1.5 hover:bg-[var(--paper)] text-[var(--ink)] disabled:opacity-30 disabled:cursor-not-allowed border-l border-[var(--rule)]"
        aria-label="Increase font size"
      >
        A+
      </button>
    </div>
  );
};
