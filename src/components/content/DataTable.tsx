import React from 'react';

interface DataTableProps {
  caption?: string;
  headers: string[];
  rows: string[][];
}

export const DataTable: React.FC<DataTableProps> = ({
  caption,
  headers,
  rows,
}) => {
  return (
    <div className="my-4">
      {caption && (
        <div className="text-xs font-mono uppercase tracking-wider text-[var(--muted)] mb-1.5 font-medium">
          {caption}
        </div>
      )}
      <div className="table-scroll-container">
        <table className="w-full text-left text-sm border-collapse bg-[var(--surface)]">
          <thead>
            <tr className="bg-[var(--paper)] border-b border-[var(--rule)]">
              {headers.map((header, i) => (
                <th
                  key={i}
                  className="px-3.5 py-2.5 font-sans font-semibold text-xs text-[var(--ink)] tracking-tight whitespace-nowrap"
                >
                  {header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-[var(--rule)]/60">
            {rows.map((row, rIndex) => (
              <tr
                key={rIndex}
                className="hover:bg-[var(--paper)]/50 transition-colors"
              >
                {row.map((cell, cIndex) => (
                  <td
                    key={cIndex}
                    className="px-3.5 py-2 text-xs sm:text-sm text-[var(--ink)]"
                  >
                    {cell}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
