import React from 'react';
import { Star } from 'lucide-react';

interface KeyPointBoxProps {
  title?: string;
  items: string[];
}

export const KeyPointBox: React.FC<KeyPointBoxProps> = ({
  title = 'Key Points to State for Full Marks',
  items,
}) => {
  return (
    <div className="my-4 p-4 rounded-r-lg bg-[var(--mark)]/10 border-l-4 border-[var(--mark)] text-[var(--ink)]">
      <div className="flex items-center gap-2 mb-2 font-sans font-bold text-sm text-[var(--ink)]">
        <Star size={16} className="text-[#D99B00] fill-[#D99B00]" />
        <span>{title}</span>
      </div>
      <ul className="space-y-1.5 pl-5 list-disc text-sm sm:text-base leading-relaxed">
        {items.map((item, index) => (
          <li key={index}>{item}</li>
        ))}
      </ul>
    </div>
  );
};
