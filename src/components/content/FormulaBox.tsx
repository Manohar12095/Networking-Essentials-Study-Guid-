import React from 'react';
import { Sigma } from 'lucide-react';

interface FormulaBoxProps {
  label?: string;
  lines: string[];
}

export const FormulaBox: React.FC<FormulaBoxProps> = ({
  label = 'Formula Reference',
  lines,
}) => {
  return (
    <div className="my-4 p-4 rounded-lg bg-[var(--surface)] border border-[var(--rule)] shadow-sm">
      <div className="flex items-center gap-2 mb-2 text-xs font-mono uppercase tracking-wider text-[var(--packet)] font-semibold">
        <Sigma size={15} />
        <span>{label}</span>
      </div>
      <div className="space-y-1 font-mono text-sm sm:text-base text-[var(--ink)] bg-[var(--paper)] p-3 rounded border border-[var(--rule)]/60 overflow-x-auto">
        {lines.map((line, index) => (
          <div key={index} className="whitespace-pre">
            {line}
          </div>
        ))}
      </div>
    </div>
  );
};
