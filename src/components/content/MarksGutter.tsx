import React from 'react';

interface MarksGutterProps {
  marks: number;
}

export const MarksGutter: React.FC<MarksGutterProps> = ({ marks }) => {
  return (
    <div className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-sm bg-[var(--mark)] text-[#14213D] font-sans font-bold text-xs tracking-tight shadow-sm shrink-0">
      <span>{marks}</span>
      <span className="text-[10px] font-semibold uppercase">marks</span>
    </div>
  );
};
