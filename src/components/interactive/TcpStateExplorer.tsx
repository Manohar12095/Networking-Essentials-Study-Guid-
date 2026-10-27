import React, { useState } from 'react';
import { Play, RotateCcw, X } from 'lucide-react';

interface StateDetail {
  name: string;
  meaning: string;
  outgoing: { to: string; trigger: string }[];
}

const STATE_DETAILS: Record<string, StateDetail> = {
  CLOSED: {
    name: 'CLOSED',
    meaning: 'No connection exists; fictional start and end point of all TCP sessions.',
    outgoing: [
      { to: 'LISTEN', trigger: 'Passive open (Server binds & listens on port)' },
      { to: 'SYN-SENT', trigger: 'Active open / send SYN (Client initiates connection)' },
    ],
  },
  LISTEN: {
    name: 'LISTEN',
    meaning: 'Server process is waiting for incoming connection request (SYN) from client.',
    outgoing: [
      { to: 'SYN-RCVD', trigger: 'Receive SYN / send SYN+ACK (Server acknowledges SYN)' },
      { to: 'SYN-SENT', trigger: 'Send data / send SYN (Rare simultaneous open)' },
    ],
  },
  'SYN-SENT': {
    name: 'SYN-SENT',
    meaning: 'Client has transmitted a SYN segment and is waiting for matching SYN+ACK.',
    outgoing: [
      { to: 'ESTABLISHED', trigger: 'Receive SYN+ACK / send ACK (Connection established)' },
      { to: 'SYN-RCVD', trigger: 'Receive SYN / send SYN+ACK (Simultaneous open)' },
    ],
  },
  'SYN-RCVD': {
    name: 'SYN-RCVD',
    meaning: 'Server received SYN, sent SYN+ACK, waiting for client ACK to complete 3-way handshake.',
    outgoing: [
      { to: 'ESTABLISHED', trigger: 'Receive ACK (Handshake complete)' },
      { to: 'FIN-WAIT-1', trigger: 'Close / send FIN (Premature termination)' },
    ],
  },
  ESTABLISHED: {
    name: 'ESTABLISHED',
    meaning: 'Connection is open and operational. Full-duplex bidirectional data transfer takes place.',
    outgoing: [
      { to: 'FIN-WAIT-1', trigger: 'Close / send FIN (Active close initiated)' },
      { to: 'CLOSE-WAIT', trigger: 'Receive FIN / send ACK (Passive close received)' },
    ],
  },
  'FIN-WAIT-1': {
    name: 'FIN-WAIT-1',
    meaning: 'Active closer sent FIN and is waiting for peer ACK or peer FIN.',
    outgoing: [
      { to: 'FIN-WAIT-2', trigger: 'Receive ACK (Peer acknowledged our FIN)' },
      { to: 'CLOSING', trigger: 'Receive FIN / send ACK (Simultaneous close)' },
      { to: 'TIME-WAIT', trigger: 'Receive FIN+ACK / send ACK (Direct transition)' },
    ],
  },
  'FIN-WAIT-2': {
    name: 'FIN-WAIT-2',
    meaning: 'Our FIN was acknowledged; waiting for peer to close its direction and send FIN.',
    outgoing: [
      { to: 'TIME-WAIT', trigger: 'Receive FIN / send ACK (Peer finished closing)' },
    ],
  },
  'CLOSE-WAIT': {
    name: 'CLOSE-WAIT',
    meaning: 'Passive receiver received peer FIN and acknowledged; waiting for local application to close.',
    outgoing: [
      { to: 'LAST-ACK', trigger: 'Local application close / send FIN' },
    ],
  },
  CLOSING: {
    name: 'CLOSING',
    meaning: 'Simultaneous close: both sides sent FIN before receiving ACK; waiting for ACK.',
    outgoing: [
      { to: 'TIME-WAIT', trigger: 'Receive ACK of our FIN' },
    ],
  },
  'LAST-ACK': {
    name: 'LAST-ACK',
    meaning: 'Passive closer sent its FIN; waiting for final terminating ACK from peer.',
    outgoing: [
      { to: 'CLOSED', trigger: 'Receive ACK (Session closed)' },
    ],
  },
  'TIME-WAIT': {
    name: 'TIME-WAIT',
    meaning: 'Waits 2 × MSL (Maximum Segment Lifetime) to ensure final ACK delivery and segment flush.',
    outgoing: [
      { to: 'CLOSED', trigger: 'Timeout after 2 MSL (Session cleanly closed)' },
    ],
  },
};

const CLIENT_SCENARIO = [
  { state: 'CLOSED', action: 'Initial state: Socket initialized.' },
  { state: 'SYN-SENT', action: 'Active open: Client sends SYN segment (seq=x) to server.' },
  { state: 'ESTABLISHED', action: 'Receive SYN+ACK (seq=y, ack=x+1) / Send ACK (ack=y+1). 3-way handshake done!' },
  { state: 'FIN-WAIT-1', action: 'Active close: Application closes, Client sends FIN segment.' },
  { state: 'FIN-WAIT-2', action: 'Receive ACK from server. Half-closed: can still receive data.' },
  { state: 'TIME-WAIT', action: 'Receive FIN from server / Send final ACK. Timer started for 2 × MSL.' },
  { state: 'CLOSED', action: 'Timer 2 MSL expires. Connection terminated cleanly.' },
];

const SERVER_SCENARIO = [
  { state: 'CLOSED', action: 'Initial state: Server process starts up.' },
  { state: 'LISTEN', action: 'Passive open: Server binds to well-known port and waits.' },
  { state: 'SYN-RCVD', action: 'Receive client SYN / Send SYN+ACK with server initial sequence number.' },
  { state: 'ESTABLISHED', action: 'Receive client ACK. Connection open for bidirectional transfer.' },
  { state: 'CLOSE-WAIT', action: 'Receive client FIN / Send ACK. Waiting for local app to finish sending data.' },
  { state: 'LAST-ACK', action: 'Local app closes / Server sends its own FIN segment.' },
  { state: 'CLOSED', action: 'Receive final ACK from client. Server connection terminates.' },
];

export const TcpStateExplorer: React.FC = () => {
  const [activeScenario, setActiveScenario] = useState<'client' | 'server' | null>(null);
  const [scenarioStep, setScenarioStep] = useState(0);
  const [selectedState, setSelectedState] = useState<StateDetail | null>(null);

  const startClientScenario = () => {
    setActiveScenario('client');
    setScenarioStep(0);
  };

  const startServerScenario = () => {
    setActiveScenario('server');
    setScenarioStep(0);
  };

  const nextStep = () => {
    const list = activeScenario === 'client' ? CLIENT_SCENARIO : SERVER_SCENARIO;
    setScenarioStep((prev) => Math.min(list.length - 1, prev + 1));
  };

  const reset = () => {
    setActiveScenario(null);
    setScenarioStep(0);
    setSelectedState(null);
  };

  const currentScenarioList = activeScenario === 'client' ? CLIENT_SCENARIO : SERVER_SCENARIO;
  const currentStepItem = activeScenario ? currentScenarioList[scenarioStep] : null;

  return (
    <div className="my-6 p-4 sm:p-5 rounded-lg bg-[var(--surface)] border border-[var(--rule)] shadow-sm interactive-tool">
      <div className="flex flex-wrap items-center justify-between gap-3 mb-4 pb-3 border-b border-[var(--rule)]">
        <div>
          <div className="font-sans font-bold text-base text-[var(--ink)]">
            TCP State Machine Scenario Player & Inspector
          </div>
          <div className="text-xs text-[var(--muted)] font-sans mt-0.5">
            Simulate standard client/server lifecycles or tap any state for transitions
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={startClientScenario}
            className={`px-3 py-1.5 rounded text-xs font-sans font-semibold transition-colors flex items-center gap-1.5 ${
              activeScenario === 'client'
                ? 'bg-[var(--packet)] text-white'
                : 'border border-[var(--packet)] text-[var(--packet)] hover:bg-[var(--packet)]/10'
            }`}
          >
            <Play size={13} />
            <span>Client Scenario</span>
          </button>

          <button
            onClick={startServerScenario}
            className={`px-3 py-1.5 rounded text-xs font-sans font-semibold transition-colors flex items-center gap-1.5 ${
              activeScenario === 'server'
                ? 'bg-[var(--signal)] text-white'
                : 'border border-[var(--signal)] text-[var(--signal)] hover:bg-[var(--signal)]/10'
            }`}
          >
            <Play size={13} />
            <span>Server Scenario</span>
          </button>

          <button
            onClick={reset}
            className="p-1.5 rounded border border-[var(--rule)] text-[var(--muted)] hover:text-[var(--ink)]"
            title="Reset simulation"
          >
            <RotateCcw size={15} />
          </button>
        </div>
      </div>

      {/* Scenario Progress Banner */}
      {activeScenario && currentStepItem && (
        <div className="p-3.5 mb-4 rounded-lg bg-[var(--paper)] border border-[var(--rule)] flex flex-wrap items-center justify-between gap-3 animate-fade-in">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="px-2 py-0.5 rounded font-mono text-[11px] font-bold bg-[var(--packet)] text-white">
                Step {scenarioStep + 1} of {currentScenarioList.length}
              </span>
              <span className="font-sans font-bold text-sm text-[var(--ink)]">
                Active State: <span className="font-mono text-[var(--packet)]">{currentStepItem.state}</span>
              </span>
            </div>
            <div className="text-xs sm:text-sm text-[var(--ink)] font-sans">
              {currentStepItem.action}
            </div>
          </div>

          <button
            onClick={nextStep}
            disabled={scenarioStep === currentScenarioList.length - 1}
            className="px-3.5 py-1.5 rounded bg-[var(--packet)] text-white text-xs font-sans font-bold hover:opacity-90 disabled:opacity-30 transition-opacity ml-auto"
          >
            {scenarioStep === currentScenarioList.length - 1 ? 'Finished' : 'Next Step →'}
          </button>
        </div>
      )}

      {/* State Buttons for Quick Inspection */}
      <div className="mb-2">
        <div className="text-xs font-mono uppercase tracking-wider text-[var(--muted)] mb-2">
          Tap Any State to Inspect RFC Meaning & Transitions:
        </div>
        <div className="flex flex-wrap gap-1.5">
          {Object.keys(STATE_DETAILS).map((state) => {
            const isHighlight = currentStepItem?.state === state;
            const isSelected = selectedState?.name === state;

            return (
              <button
                key={state}
                onClick={() => setSelectedState(STATE_DETAILS[state])}
                className={`px-2.5 py-1 rounded text-xs font-mono font-bold transition-all ${
                  isHighlight
                    ? 'bg-[var(--mark)] text-black ring-2 ring-[var(--ink)] scale-105'
                    : isSelected
                    ? 'bg-[var(--ink)] text-white'
                    : 'bg-[var(--paper)] text-[var(--ink)] hover:bg-[var(--rule)]/60'
                }`}
              >
                {state}
              </button>
            );
          })}
        </div>
      </div>

      {/* Selected State Detail Bottom Sheet / Panel */}
      {selectedState && (
        <div className="mt-4 p-4 rounded-lg bg-[var(--paper)] border border-[var(--rule)] relative animate-fade-in">
          <button
            onClick={() => setSelectedState(null)}
            className="absolute top-3 right-3 text-[var(--muted)] hover:text-[var(--ink)]"
            aria-label="Close"
          >
            <X size={16} />
          </button>
          <div className="flex items-center gap-2 mb-1.5">
            <span className="font-mono font-bold text-base text-[var(--packet)]">
              {selectedState.name}
            </span>
          </div>
          <div className="text-xs sm:text-sm text-[var(--ink)] font-sans mb-3">
            {selectedState.meaning}
          </div>

          <div className="text-xs font-mono text-[var(--muted)] mb-1 font-semibold">
            Outgoing Transitions:
          </div>
          <div className="space-y-1">
            {selectedState.outgoing.map((out, idx) => (
              <div
                key={idx}
                className="flex items-center gap-2 text-xs font-mono p-1.5 rounded bg-[var(--surface)] border border-[var(--rule)]/60"
              >
                <span className="text-[var(--signal)] font-bold">→ {out.to}</span>
                <span className="text-[var(--muted)]">({out.trigger})</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
