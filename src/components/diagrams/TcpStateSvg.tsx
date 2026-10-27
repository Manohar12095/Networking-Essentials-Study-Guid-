import React from 'react';

export const TcpStateSvg: React.FC = () => {
  return (
    <div
      role="img"
      aria-label="TCP State Transition Diagram with 11 states"
      className="my-5 p-4 rounded-lg bg-[var(--surface)] border border-[var(--rule)] shadow-sm max-w-4xl mx-auto overflow-x-auto"
    >
      <div className="text-center font-sans font-bold text-sm sm:text-base text-[var(--ink)] mb-2">
        TCP State Transition Diagram (Finite State Machine)
      </div>
      <div className="flex flex-wrap items-center justify-center gap-4 text-xs font-sans text-[var(--muted)] mb-4">
        <div className="flex items-center gap-1.5">
          <span className="w-3.5 h-1 bg-[var(--packet)] rounded"></span>
          <span>Client Path (Active Open/Close)</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-3.5 h-1 bg-[var(--signal)] rounded"></span>
          <span>Server Path (Passive Open/Close)</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-3.5 h-1 bg-[var(--ink)] rounded"></span>
          <span>Simultaneous / Timeout Transition</span>
        </div>
      </div>

      <div className="min-w-[650px]">
        <svg viewBox="0 0 760 700" className="w-full h-auto select-none" aria-hidden="true">
          <defs>
            <marker id="arrow-blue" viewBox="0 0 10 10" refX="6" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
              <path d="M 0 1.5 L 10 5 L 0 8.5 z" fill="var(--packet)" />
            </marker>
            <marker id="arrow-green" viewBox="0 0 10 10" refX="6" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
              <path d="M 0 1.5 L 10 5 L 0 8.5 z" fill="var(--signal)" />
            </marker>
            <marker id="arrow-dark" viewBox="0 0 10 10" refX="6" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
              <path d="M 0 1.5 L 10 5 L 0 8.5 z" fill="var(--ink)" />
            </marker>
          </defs>

          {/* 1. CLOSED -> LISTEN (Server passive open) */}
          <path d="M 330 45 L 200 45 L 200 95" fill="none" stroke="var(--signal)" strokeWidth="2.5" markerEnd="url(#arrow-green)" />
          <text x="210" y="70" fill="var(--signal)" fontSize="10" fontWeight="bold">passive open</text>

          {/* 2. CLOSED -> SYN-SENT (Client active open) */}
          <path d="M 430 45 L 560 45 L 560 95" fill="none" stroke="var(--packet)" strokeWidth="2.5" markerEnd="url(#arrow-packet)" />
          <text x="565" y="70" fill="var(--packet)" fontSize="10" fontWeight="bold">active open / send SYN</text>

          {/* 3. LISTEN -> SYN-RCVD */}
          <line x1="200" y1="135" x2="200" y2="175" stroke="var(--signal)" strokeWidth="2.5" markerEnd="url(#arrow-green)" />
          <text x="75" y="155" fill="var(--signal)" fontSize="10">rcv SYN / send SYN+ACK</text>

          {/* 4. SYN-SENT -> ESTABLISHED */}
          <path d="M 540 135 L 430 245" fill="none" stroke="var(--packet)" strokeWidth="2.5" markerEnd="url(#arrow-packet)" />
          <text x="500" y="195" fill="var(--packet)" fontSize="10">rcv SYN+ACK / send ACK</text>

          {/* 5. SYN-RCVD -> ESTABLISHED */}
          <path d="M 220 215 L 350 250" fill="none" stroke="var(--signal)" strokeWidth="2.5" markerEnd="url(#arrow-green)" />
          <text x="250" y="240" fill="var(--signal)" fontSize="10">rcv ACK</text>

          {/* 6. ESTABLISHED -> FIN-WAIT-1 (Active close) */}
          <path d="M 350 280 L 250 345" fill="none" stroke="var(--packet)" strokeWidth="2.5" markerEnd="url(#arrow-packet)" />
          <text x="190" y="310" fill="var(--packet)" fontSize="10">close / send FIN</text>

          {/* 7. ESTABLISHED -> CLOSE-WAIT (Passive close: CORRECTED) */}
          <path d="M 430 280 L 530 345" fill="none" stroke="var(--signal)" strokeWidth="2.5" markerEnd="url(#arrow-green)" />
          <text x="515" y="310" fill="var(--signal)" fontSize="10" fontWeight="bold">rcv FIN / send ACK</text>

          {/* 8. FIN-WAIT-1 -> FIN-WAIT-2 */}
          <line x1="210" y1="385" x2="160" y2="445" stroke="var(--packet)" strokeWidth="2.5" markerEnd="url(#arrow-packet)" />
          <text x="110" y="415" fill="var(--packet)" fontSize="10">rcv ACK</text>

          {/* 9. FIN-WAIT-1 -> CLOSING (Simultaneous close) */}
          <line x1="250" y1="385" x2="310" y2="445" stroke="var(--ink)" strokeWidth="2" strokeDasharray="4 2" markerEnd="url(#arrow-dark)" />
          <text x="285" y="415" fill="var(--ink)" fontSize="9">rcv FIN / send ACK</text>

          {/* 10. FIN-WAIT-1 -> TIME-WAIT (direct via FIN+ACK) */}
          <path d="M 230 385 Q 210 470 230 540" fill="none" stroke="var(--ink)" strokeWidth="1.5" strokeDasharray="3 3" markerEnd="url(#arrow-dark)" />
          <text x="180" y="475" fill="var(--ink)" fontSize="8">rcv FIN+ACK/ACK</text>

          {/* 11. FIN-WAIT-2 -> TIME-WAIT */}
          <path d="M 160 485 L 210 545" fill="none" stroke="var(--packet)" strokeWidth="2.5" markerEnd="url(#arrow-packet)" />
          <text x="115" y="525" fill="var(--packet)" fontSize="10">rcv FIN / send ACK</text>

          {/* 12. CLOSING -> TIME-WAIT */}
          <path d="M 310 485 L 260 545" fill="none" stroke="var(--ink)" strokeWidth="2" markerEnd="url(#arrow-dark)" />
          <text x="290" y="525" fill="var(--ink)" fontSize="9">rcv ACK</text>

          {/* 13. CLOSE-WAIT -> LAST-ACK */}
          <line x1="560" y1="385" x2="560" y2="445" stroke="var(--signal)" strokeWidth="2.5" markerEnd="url(#arrow-green)" />
          <text x="565" y="415" fill="var(--signal)" fontSize="10">close / send FIN</text>

          {/* 14. LAST-ACK -> CLOSED */}
          <path d="M 560 485 L 560 635 L 440 655" fill="none" stroke="var(--signal)" strokeWidth="2.5" markerEnd="url(#arrow-green)" />
          <text x="565" y="560" fill="var(--signal)" fontSize="10">rcv ACK</text>

          {/* 15. TIME-WAIT -> CLOSED */}
          <path d="M 230 585 L 230 635 L 340 655" fill="none" stroke="var(--ink)" strokeWidth="2.5" markerEnd="url(#arrow-dark)" />
          <text x="160" y="625" fill="var(--ink)" fontSize="10" fontWeight="bold">timeout 2 MSL</text>

          {/* STATE BOXES */}
          {/* CLOSED (Top) */}
          <rect x="330" y="25" width="100" height="40" rx="8" fill="#EDE9FE" stroke="#6D28D9" strokeWidth="2.5" />
          <text x="380" y="50" textAnchor="middle" fill="#4C1D95" fontSize="12" fontWeight="bold" fontFamily="sans-serif">CLOSED</text>

          {/* LISTEN (Server) */}
          <rect x="150" y="95" width="100" height="40" rx="8" fill="#D1FAE5" stroke="#059669" strokeWidth="2.5" />
          <text x="200" y="120" textAnchor="middle" fill="#065F46" fontSize="12" fontWeight="bold" fontFamily="sans-serif">LISTEN</text>

          {/* SYN-SENT (Client) */}
          <rect x="510" y="95" width="100" height="40" rx="8" fill="#DBEAFE" stroke="#2563EB" strokeWidth="2.5" />
          <text x="560" y="120" textAnchor="middle" fill="#1E40AF" fontSize="12" fontWeight="bold" fontFamily="sans-serif">SYN-SENT</text>

          {/* SYN-RCVD (Server) */}
          <rect x="150" y="175" width="100" height="40" rx="8" fill="#D1FAE5" stroke="#059669" strokeWidth="2.5" />
          <text x="200" y="200" textAnchor="middle" fill="#065F46" fontSize="12" fontWeight="bold" fontFamily="sans-serif">SYN-RCVD</text>

          {/* ESTABLISHED (Common Center) */}
          <rect x="330" y="245" width="120" height="45" rx="8" fill="#DBEAFE" stroke="#1D4ED8" strokeWidth="3" />
          <text x="390" y="272" textAnchor="middle" fill="#1E3A8A" fontSize="13" fontWeight="bold" fontFamily="sans-serif">ESTABLISHED</text>

          {/* FIN-WAIT-1 (Client) */}
          <rect x="180" y="345" width="100" height="40" rx="8" fill="#DBEAFE" stroke="#2563EB" strokeWidth="2.5" />
          <text x="230" y="370" textAnchor="middle" fill="#1E40AF" fontSize="11" fontWeight="bold" fontFamily="sans-serif">FIN-WAIT-1</text>

          {/* FIN-WAIT-2 (Client) */}
          <rect x="110" y="445" width="100" height="40" rx="8" fill="#DBEAFE" stroke="#2563EB" strokeWidth="2.5" />
          <text x="160" y="470" textAnchor="middle" fill="#1E40AF" fontSize="11" fontWeight="bold" fontFamily="sans-serif">FIN-WAIT-2</text>

          {/* CLOSING (Simultaneous) */}
          <rect x="270" y="445" width="90" height="40" rx="8" fill="#E2E8F0" stroke="#475569" strokeWidth="2" />
          <text x="315" y="470" textAnchor="middle" fill="#334155" fontSize="11" fontWeight="bold" fontFamily="sans-serif">CLOSING</text>

          {/* TIME-WAIT (Client Active Close) */}
          <rect x="190" y="545" width="100" height="40" rx="8" fill="#DBEAFE" stroke="#2563EB" strokeWidth="2.5" />
          <text x="240" y="570" textAnchor="middle" fill="#1E40AF" fontSize="11" fontWeight="bold" fontFamily="sans-serif">TIME-WAIT</text>

          {/* CLOSE-WAIT (Server Passive Close) */}
          <rect x="510" y="345" width="100" height="40" rx="8" fill="#D1FAE5" stroke="#059669" strokeWidth="2.5" />
          <text x="560" y="370" textAnchor="middle" fill="#065F46" fontSize="11" fontWeight="bold" fontFamily="sans-serif">CLOSE-WAIT</text>

          {/* LAST-ACK (Server) */}
          <rect x="510" y="445" width="100" height="40" rx="8" fill="#D1FAE5" stroke="#059669" strokeWidth="2.5" />
          <text x="560" y="470" textAnchor="middle" fill="#065F46" fontSize="11" fontWeight="bold" fontFamily="sans-serif">LAST-ACK</text>

          {/* CLOSED (Bottom) */}
          <rect x="340" y="635" width="100" height="40" rx="8" fill="#EDE9FE" stroke="#6D28D9" strokeWidth="2.5" />
          <text x="390" y="660" textAnchor="middle" fill="#4C1D95" fontSize="12" fontWeight="bold" fontFamily="sans-serif">CLOSED</text>
        </svg>
      </div>
    </div>
  );
};
