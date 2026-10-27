import React, { useState } from 'react';
import { ChevronRight, ChevronLeft, RotateCcw, ShieldCheck, Layers } from 'lucide-react';

interface HandshakeStep {
  step: number;
  message: string;
  sender: 'client' | 'server';
  clientState: string;
  serverState: string;
  caption: string;
  cookieNote?: string;
}

const HANDSHAKE_STEPS: HandshakeStep[] = [
  {
    step: 0,
    message: 'Association Idle',
    sender: 'client',
    clientState: 'CLOSED',
    serverState: 'CLOSED',
    caption: 'Initial state before association establishment begins.',
  },
  {
    step: 1,
    message: 'INIT (Initial TSN, Inbound/Outbound Streams, IP List, Verification Tag)',
    sender: 'client',
    clientState: 'COOKIE-WAIT',
    serverState: 'CLOSED',
    caption:
      'Client initiates active open. Sends INIT chunk advertising capabilities and IP addresses.',
  },
  {
    step: 2,
    message: 'INIT ACK (Server Initial TSN, Capabilities, Signed State Cookie)',
    sender: 'server',
    clientState: 'COOKIE-WAIT',
    serverState: 'CLOSED (No TCB allocated)',
    caption:
      'Server generates cryptographically sealed State Cookie with client params and returns it. Server allocates ZERO memory.',
    cookieNote: 'SYN-Flood Immune: No resources committed on server!',
  },
  {
    step: 3,
    message: 'COOKIE ECHO (Carries Unmodified State Cookie [+ Bundled User Data])',
    sender: 'client',
    clientState: 'COOKIE-ECHOED',
    serverState: 'CLOSED → Validating Cookie Signature',
    caption:
      'Client echoes the state cookie back, proving it can receive at claimed IP address.',
  },
  {
    step: 4,
    message: 'COOKIE ACK (Association Finalized [+ Bundled User Data])',
    sender: 'server',
    clientState: 'ESTABLISHED',
    serverState: 'ESTABLISHED',
    caption:
      'Server validates cookie HMAC, allocates memory resources, and returns COOKIE ACK. Association is now ESTABLISHED!',
  },
];

export const SctpHandshake: React.FC = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const [stream2Dropped, setStream2Dropped] = useState(false);
  const [isTcpMode, setIsTcpMode] = useState(false);

  const stepInfo = HANDSHAKE_STEPS[currentStep];

  return (
    <div className="my-6 p-4 sm:p-5 rounded-lg bg-[var(--surface)] border border-[var(--rule)] shadow-sm interactive-tool">
      <div className="flex flex-wrap items-center justify-between gap-3 mb-4 pb-3 border-b border-[var(--rule)]">
        <div>
          <div className="font-sans font-bold text-base text-[var(--ink)]">
            SCTP 4-Way Handshake & Multi-Streaming Simulator
          </div>
          <div className="text-xs text-[var(--muted)] font-sans mt-0.5">
            Step through cookie establishment and observe non-blocking multi-streaming
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setCurrentStep(0)}
            disabled={currentStep === 0}
            className="p-1.5 rounded border border-[var(--rule)] text-[var(--muted)] hover:text-[var(--ink)] disabled:opacity-30"
            title="Reset"
          >
            <RotateCcw size={15} />
          </button>
          <button
            onClick={() => setCurrentStep((prev) => Math.max(0, prev - 1))}
            disabled={currentStep === 0}
            className="flex items-center gap-1 px-2.5 py-1 rounded border border-[var(--rule)] text-xs font-sans disabled:opacity-30"
          >
            <ChevronLeft size={14} /> Prev
          </button>
          <div className="px-2.5 py-1 rounded bg-[var(--paper)] text-xs font-mono font-bold">
            Step {currentStep} of 4
          </div>
          <button
            onClick={() => setCurrentStep((prev) => Math.min(4, prev + 1))}
            disabled={currentStep === 4}
            className="flex items-center gap-1 px-2.5 py-1 rounded bg-[var(--packet)] text-white text-xs font-sans font-semibold disabled:opacity-30"
          >
            Next <ChevronRight size={14} />
          </button>
        </div>
      </div>

      {/* Part 1: Handshake diagram */}
      <div className="p-4 rounded-lg bg-[var(--paper)] border border-[var(--rule)] mb-5">
        <div className="grid grid-cols-2 gap-4 text-center font-mono text-xs mb-4">
          <div className="p-2.5 rounded bg-[var(--surface)] border border-[var(--rule)]">
            <div className="text-[var(--muted)] uppercase tracking-wider text-[10px]">
              Client Endpoint (Active Open)
            </div>
            <div className="font-bold text-sm text-[var(--packet)] mt-1">
              State: {stepInfo.clientState}
            </div>
          </div>

          <div className="p-2.5 rounded bg-[var(--surface)] border border-[var(--rule)]">
            <div className="text-[var(--muted)] uppercase tracking-wider text-[10px]">
              Server Endpoint (Passive Open)
            </div>
            <div className="font-bold text-sm text-[var(--signal)] mt-1">
              State: {stepInfo.serverState}
            </div>
          </div>
        </div>

        {/* Message arrow presentation */}
        <div className="space-y-2.5 py-2">
          {HANDSHAKE_STEPS.slice(1).map((s) => {
            const isVisible = currentStep >= s.step;
            const isCurrent = currentStep === s.step;
            const isClientSender = s.sender === 'client';

            return (
              <div
                key={s.step}
                className={`p-2.5 rounded transition-all text-xs font-mono flex items-center justify-between ${
                  isCurrent
                    ? 'bg-[var(--mark)]/25 border-2 border-[var(--ink)] shadow-sm'
                    : isVisible
                    ? 'bg-[var(--surface)] border border-[var(--rule)] opacity-80'
                    : 'bg-[var(--surface)]/30 border border-dashed border-[var(--rule)] opacity-30'
                }`}
              >
                <div className="flex items-center gap-2">
                  <span className="w-5 h-5 rounded-full bg-[var(--ink)] text-white text-[10px] flex items-center justify-center font-bold">
                    {s.step}
                  </span>
                  <span className="font-bold text-[var(--ink)]">
                    {isClientSender ? 'Client → Server:' : 'Server → Client:'}
                  </span>
                  <span className={isCurrent ? 'text-[var(--packet)] font-bold' : ''}>
                    {s.message}
                  </span>
                </div>
                {s.cookieNote && isVisible && (
                  <span className="hidden sm:flex items-center gap-1 text-[10px] text-[var(--signal)] font-sans font-bold">
                    <ShieldCheck size={13} /> {s.cookieNote}
                  </span>
                )}
              </div>
            );
          })}
        </div>

        <div className="mt-3 text-xs text-[var(--ink)] font-sans leading-relaxed border-t border-[var(--rule)] pt-2.5">
          <span className="font-bold text-[var(--packet)] font-mono mr-1">
            Step {stepInfo.step} Explanation:
          </span>
          {stepInfo.caption}
        </div>
      </div>

      {/* Part 2: Multi-streaming Demo */}
      <div className="p-4 rounded-lg bg-[var(--surface)] border border-[var(--rule)]">
        <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
          <div className="font-sans font-bold text-xs sm:text-sm text-[var(--ink)] flex items-center gap-1.5">
            <Layers size={16} className="text-[var(--packet)]" />
            <span>Interactive Multi-Streaming & Head-of-Line Blocking Demonstration</span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsTcpMode(!isTcpMode)}
              className={`px-2.5 py-1 rounded text-xs font-sans font-semibold transition-colors ${
                isTcpMode
                  ? 'bg-[#E4572E] text-white'
                  : 'border border-[var(--rule)] text-[var(--muted)] hover:text-[var(--ink)]'
              }`}
            >
              {isTcpMode ? 'Viewing as TCP (Single Stream)' : 'Toggle: Simulate Same Data over TCP'}
            </button>

            <button
              onClick={() => setStream2Dropped(!stream2Dropped)}
              className={`px-2.5 py-1 rounded text-xs font-sans font-semibold transition-colors ${
                stream2Dropped
                  ? 'bg-[var(--alert)] text-white'
                  : 'bg-[var(--paper)] border border-[var(--rule)] text-[var(--ink)] hover:border-[var(--alert)]'
              }`}
            >
              {stream2Dropped ? 'Recover Packet on Stream 2' : 'Drop a Message on Stream 2'}
            </button>
          </div>
        </div>

        <div className="space-y-2 mb-3">
          {/* Stream 1 */}
          <div className="p-2.5 rounded bg-[var(--paper)] border border-[var(--rule)] flex items-center justify-between text-xs">
            <div className="font-mono font-bold text-[var(--ink)] flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-[var(--signal)]"></span>
              <span>Stream 1 (Control Signalling):</span>
            </div>
            <div
              className={`font-mono text-xs px-2 py-0.5 rounded ${
                isTcpMode && stream2Dropped
                  ? 'bg-[var(--alert)]/20 text-[var(--alert)] font-bold'
                  : 'bg-[var(--signal)]/20 text-[var(--signal)]'
              }`}
            >
              {isTcpMode && stream2Dropped
                ? 'BLOCKED by Stream 2 packet loss (HOL Blocking)'
                : 'Delivering continuously (Flowing smoothly)'}
            </div>
          </div>

          {/* Stream 2 */}
          <div className="p-2.5 rounded bg-[var(--paper)] border border-[var(--rule)] flex items-center justify-between text-xs">
            <div className="font-mono font-bold text-[var(--ink)] flex items-center gap-2">
              <span
                className={`w-2 h-2 rounded-full ${
                  stream2Dropped ? 'bg-[var(--alert)]' : 'bg-[var(--signal)]'
                }`}
              ></span>
              <span>Stream 2 (File Transfer Chunk):</span>
            </div>
            <div
              className={`font-mono text-xs px-2 py-0.5 rounded ${
                stream2Dropped
                  ? 'bg-[var(--alert)]/20 text-[var(--alert)] font-bold'
                  : 'bg-[var(--signal)]/20 text-[var(--signal)]'
              }`}
            >
              {stream2Dropped
                ? 'PACKET DROPPED (Waiting for retransmission)'
                : 'Delivering packets'}
            </div>
          </div>

          {/* Stream 3 */}
          <div className="p-2.5 rounded bg-[var(--paper)] border border-[var(--rule)] flex items-center justify-between text-xs">
            <div className="font-mono font-bold text-[var(--ink)] flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-[var(--signal)]"></span>
              <span>Stream 3 (Real-time Audio/Video):</span>
            </div>
            <div
              className={`font-mono text-xs px-2 py-0.5 rounded ${
                isTcpMode && stream2Dropped
                  ? 'bg-[var(--alert)]/20 text-[var(--alert)] font-bold'
                  : 'bg-[var(--signal)]/20 text-[var(--signal)]'
              }`}
            >
              {isTcpMode && stream2Dropped
                ? 'BLOCKED by Stream 2 packet loss (HOL Blocking)'
                : 'Delivering continuously (Zero jitter)'}
            </div>
          </div>
        </div>

        <div className="text-xs font-sans text-[var(--muted)] leading-relaxed">
          {isTcpMode ? (
            <span className="text-[var(--alert)] font-medium">
              Notice in TCP: Because TCP mandates a single contiguous byte stream, a lost byte in
              one logical message halts delivery of all subsequent data across all applications sharing the connection.
            </span>
          ) : (
            <span className="text-[var(--signal)] font-medium">
              Notice in SCTP: Even though Stream 2 is stalled waiting for retransmission, Stream 1 and Stream 3
              continue processing data with zero delay. Head-of-line blocking is entirely eliminated between streams.
            </span>
          )}
        </div>
      </div>
    </div>
  );
};
