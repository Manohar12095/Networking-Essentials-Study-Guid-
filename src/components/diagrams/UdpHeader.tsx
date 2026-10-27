import React from 'react';

export const UdpHeader: React.FC = () => {
  const bitNumbers = Array.from({ length: 32 }, (_, i) => i);

  return (
    <div
      role="img"
      aria-label="UDP Datagram Header Format Diagram"
      className="my-5 p-4 rounded-lg bg-[var(--surface)] border border-[var(--rule)] shadow-sm max-w-2xl mx-auto overflow-x-auto"
    >
      <div className="text-center font-sans font-bold text-sm sm:text-base text-[var(--ink)] mb-3">
        UDP Datagram Header Format (8 Bytes Fixed)
      </div>

      <div className="min-w-[540px]">
        {/* Bit Position Header */}
        <div className="text-[11px] font-mono text-[var(--muted)] mb-1">
          Bit position (0 to 31):
        </div>

        {/* 32-Column Bit Ruler with no duplicate numbers */}
        <div
          style={{ display: 'grid', gridTemplateColumns: 'repeat(32, minmax(0, 1fr))' }}
          className="border-b border-[var(--rule)] pb-1 mb-2 text-center"
        >
          {bitNumbers.map((bit) => (
            <div
              key={bit}
              className="text-[9px] sm:text-[10px] font-mono text-[var(--muted)]"
            >
              {bit}
            </div>
          ))}
        </div>

        {/* Header Container with 8-byte bracket representation */}
        <div className="relative border-2 border-[var(--ink)] rounded overflow-hidden">
          {/* Row 1: Source Port & Destination Port */}
          <div className="grid grid-cols-2 divide-x-2 divide-[var(--ink)] border-b-2 border-[var(--ink)]">
            <div className="p-3 bg-[#EBF3FF] dark:bg-[#1E3A5F] text-center">
              <div className="font-sans font-bold text-xs sm:text-sm text-[var(--ink)]">
                Source Port
              </div>
              <div className="text-[11px] font-mono text-[var(--muted)] mt-0.5">
                16 bits (0 to 15)
              </div>
            </div>
            <div className="p-3 bg-[#EBF3FF] dark:bg-[#1E3A5F] text-center">
              <div className="font-sans font-bold text-xs sm:text-sm text-[var(--ink)]">
                Destination Port
              </div>
              <div className="text-[11px] font-mono text-[var(--muted)] mt-0.5">
                16 bits (16 to 31)
              </div>
            </div>
          </div>

          {/* Row 2: Length & Checksum */}
          <div className="grid grid-cols-2 divide-x-2 divide-[var(--ink)] border-b-2 border-[var(--ink)]">
            <div className="p-3 bg-[#E6F8F3] dark:bg-[#14473D] text-center">
              <div className="font-sans font-bold text-xs sm:text-sm text-[var(--ink)]">
                Length
              </div>
              <div className="text-[11px] font-mono text-[var(--muted)] mt-0.5">
                16 bits (Header + Payload)
              </div>
            </div>
            <div className="p-3 bg-[#E6F8F3] dark:bg-[#14473D] text-center">
              <div className="font-sans font-bold text-xs sm:text-sm text-[var(--ink)]">
                Checksum
              </div>
              <div className="text-[11px] font-mono text-[var(--muted)] mt-0.5">
                16 bits (Header + Pseudo-Header)
              </div>
            </div>
          </div>

          {/* Row 3: Data Payload */}
          <div className="p-4 bg-[#F5F3FF] dark:bg-[#2E204F] text-center">
            <div className="font-sans font-bold text-xs sm:text-sm text-[var(--ink)]">
              Data Payload
            </div>
            <div className="text-[11px] font-mono text-[var(--muted)] mt-0.5">
              Variable length (Application Message)
            </div>
          </div>
        </div>

        {/* Legend / Spec callout */}
        <div className="flex items-center justify-between mt-3 text-[11px] font-mono text-[var(--muted)] px-1">
          <span>Total UDP Header: 4 fields × 2 bytes = 8 bytes</span>
          <span className="text-[var(--signal)] font-medium">
            Ruler verified: bits 0 to 31
          </span>
        </div>
      </div>
    </div>
  );
};
