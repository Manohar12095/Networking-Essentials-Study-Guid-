import React, { useState, useRef } from 'react';
import { Send, Laptop, Server, Router as RouterIcon } from 'lucide-react';

export const PacketJourneyStrip: React.FC = () => {
  const [hopIndex, setHopIndex] = useState(0); // 0 = Client, 1 = Router 1, 2 = Router 2, 3 = Server
  const [isTraveling, setIsTraveling] = useState(false);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const hopRef = useRef(0);

  const hops = [
    { label: 'Client', icon: Laptop, sub: 'Source Host' },
    { label: 'Router 1', icon: RouterIcon, sub: 'Gateway' },
    { label: 'Router 2', icon: RouterIcon, sub: 'Intermediate' },
    { label: 'Server', icon: Server, sub: 'Destination' },
  ];

  const sendPacket = () => {
    if (isTraveling) return;
    setIsTraveling(true);
    hopRef.current = 0;
    setHopIndex(0);

    intervalRef.current = setInterval(() => {
      hopRef.current += 1;
      if (hopRef.current > 3) {
        if (intervalRef.current) clearInterval(intervalRef.current);
        setIsTraveling(false);
        setHopIndex(3);
        return;
      }
      setHopIndex(hopRef.current);
    }, 600);
  };

  return (
    <div className="w-full max-w-2xl mx-auto my-6 p-4 rounded-lg bg-[var(--surface)] border border-[var(--rule)] shadow-sm">
      <div className="flex items-center justify-between mb-4">
        <div className="text-xs font-mono uppercase tracking-wider text-[var(--muted)] font-medium">
          Packet Journey Pipeline (Layer 3 Routing)
        </div>
        <button
          onClick={sendPacket}
          disabled={isTraveling}
          className="flex items-center gap-1.5 px-3 py-1 rounded bg-[var(--packet)] text-white text-xs font-sans font-bold hover:opacity-90 disabled:opacity-50 transition-opacity"
        >
          <Send size={13} />
          <span>{isTraveling ? 'Hopping...' : 'Send Packet'}</span>
        </button>
      </div>

      {/* The 4 hops with animated packet marker */}
      <div className="relative flex items-center justify-between px-4 sm:px-8 py-3">
        {/* Track line */}
        <div className="absolute left-10 right-10 top-1/2 -translate-y-1/2 h-1 bg-[var(--rule)] -z-0">
          {/* Active progress track */}
          <div
            className="h-full bg-[var(--packet)] transition-all duration-500 ease-out"
            style={{ width: `${(hopIndex / 3) * 100}%` }}
          />
        </div>

        {hops.map((hop, idx) => {
          const Icon = hop.icon;
          const isReached = hopIndex >= idx;
          const isCurrent = hopIndex === idx;

          return (
            <div key={idx} className="relative z-10 flex flex-col items-center">
              <div
                className={`w-10 h-10 rounded-full flex items-center justify-center transition-all ${
                  isCurrent
                    ? 'bg-[var(--packet)] text-white ring-4 ring-[var(--packet)]/20 scale-110 shadow-md'
                    : isReached
                    ? 'bg-[var(--signal)] text-white'
                    : 'bg-[var(--paper)] text-[var(--muted)] border border-[var(--rule)]'
                }`}
              >
                <Icon size={18} />
              </div>
              <div className="mt-1.5 text-center">
                <div
                  className={`text-xs font-sans font-bold leading-tight ${
                    isCurrent ? 'text-[var(--packet)]' : 'text-[var(--ink)]'
                  }`}
                >
                  {hop.label}
                </div>
                <div className="text-[10px] text-[var(--muted)] font-mono hidden sm:block">
                  {hop.sub}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
