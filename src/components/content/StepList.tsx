import React from 'react';

interface StepListProps {
  items: string[];
}

export const StepList: React.FC<StepListProps> = ({ items }) => {
  return (
    <ol className="my-4 space-y-2.5">
      {items.map((item, index) => (
        <li
          key={index}
          className="flex items-start gap-3 p-3 rounded bg-[var(--surface)] border border-[var(--rule)]"
        >
          <span className="shrink-0 w-6 h-6 rounded-full bg-[var(--packet)]/10 text-[var(--packet)] font-mono font-bold text-xs flex items-center justify-center mt-0.5">
            {index + 1}
          </span>
          <div className="text-sm sm:text-base text-[var(--ink)] leading-relaxed">
            {item}
          </div>
        </li>
      ))}
    </ol>
  );
};
