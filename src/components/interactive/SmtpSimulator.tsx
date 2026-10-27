import React, { useState } from 'react';
import { ChevronRight, RotateCcw, AlertTriangle, BookOpen } from 'lucide-react';

interface SmtpMessage {
  speaker: 'client' | 'server';
  text: string;
  code?: string;
  meaning: string;
  explanation: string;
}

const SUCCESS_SESSION: SmtpMessage[] = [
  {
    speaker: 'server',
    text: '220 mail.example.com ESMTP ready',
    code: '220',
    meaning: 'Service ready',
    explanation: 'Server greets client and indicates readiness to establish an SMTP session over TCP port 25.',
  },
  {
    speaker: 'client',
    text: 'HELO example.com',
    meaning: 'Handshake initiation',
    explanation: 'Client identifies its fully qualified domain name to the receiving MTA.',
  },
  {
    speaker: 'server',
    text: '250 Hello example.com',
    code: '250',
    meaning: 'Requested action completed',
    explanation: 'Server acknowledges the client greeting and confirms its identity.',
  },
  {
    speaker: 'client',
    text: 'MAIL FROM:<sender@example.com>',
    meaning: 'Sender declaration',
    explanation: 'Client initiates a mail transaction and designates the reverse-path envelope sender address.',
  },
  {
    speaker: 'server',
    text: '250 OK',
    code: '250',
    meaning: 'Action completed',
    explanation: 'Server accepts the sender address.',
  },
  {
    speaker: 'client',
    text: 'RCPT TO:<receiver@example.com>',
    meaning: 'Recipient declaration',
    explanation: 'Client specifies the destination mailbox. Can be repeated for multiple recipients.',
  },
  {
    speaker: 'server',
    text: '250 OK',
    code: '250',
    meaning: 'Action completed',
    explanation: 'Server validates that the recipient mailbox exists or is acceptable for relaying.',
  },
  {
    speaker: 'client',
    text: 'DATA',
    meaning: 'Start message body input',
    explanation: 'Client requests permission to send email headers, blank line, and text body.',
  },
  {
    speaker: 'server',
    text: '354 Start mail input; end with <CRLF>.<CRLF>',
    code: '354',
    meaning: 'Start mail input',
    explanation: 'Server instructs client to stream message content terminated by a line with a single period.',
  },
  {
    speaker: 'client',
    text: 'From: sender@example.com\nTo: receiver@example.com\nSubject: Hello\n\nThis is a test message.\n.',
    meaning: 'Email headers and body payload',
    explanation: 'Client streams headers and body, terminating with a line containing only a dot ".".',
  },
  {
    speaker: 'server',
    text: '250 OK: message accepted for delivery',
    code: '250',
    meaning: 'Action completed',
    explanation: 'Server enqueues the message to disk for local delivery or subsequent relay.',
  },
  {
    speaker: 'client',
    text: 'QUIT',
    meaning: 'Close session',
    explanation: 'Client requests graceful termination of the SMTP channel.',
  },
  {
    speaker: 'server',
    text: '221 mail.example.com closing connection',
    code: '221',
    meaning: 'Service closing channel',
    explanation: 'Server acknowledges closure and closes the TCP connection.',
  },
];

const ERROR_SESSION: SmtpMessage[] = [
  {
    speaker: 'server',
    text: '220 mail.example.com ESMTP ready',
    code: '220',
    meaning: 'Service ready',
    explanation: 'Server greets client and indicates readiness.',
  },
  {
    speaker: 'client',
    text: 'HELO example.com',
    meaning: 'Handshake initiation',
    explanation: 'Client introduces itself.',
  },
  {
    speaker: 'server',
    text: '250 Hello example.com',
    code: '250',
    meaning: 'Action completed',
    explanation: 'Server welcomes client.',
  },
  {
    speaker: 'client',
    text: 'MAIL FROM:<sender@example.com>',
    meaning: 'Sender declaration',
    explanation: 'Client starts mail transaction.',
  },
  {
    speaker: 'server',
    text: '250 OK',
    code: '250',
    meaning: 'Action completed',
    explanation: 'Sender accepted.',
  },
  {
    speaker: 'client',
    text: 'RCPT TO:<nonexistent_user@example.com>',
    meaning: 'Invalid recipient',
    explanation: 'Client attempts to send mail to an invalid or unknown user mailbox.',
  },
  {
    speaker: 'server',
    text: '550 5.1.1 <nonexistent_user@example.com>: Recipient address rejected: User unknown in virtual mailbox table',
    code: '550',
    meaning: 'Mailbox unavailable (Permanent Failure)',
    explanation: 'Server rejects the invalid recipient with a 5xx permanent error code.',
  },
  {
    speaker: 'client',
    text: 'RSET',
    meaning: 'Reset transaction',
    explanation: 'Client aborts the current failed mail transaction so it can try another address or quit.',
  },
  {
    speaker: 'server',
    text: '250 2.0.0 Reset state OK',
    code: '250',
    meaning: 'Reset completed',
    explanation: 'Server clears transaction state buffer while keeping TCP connection open.',
  },
  {
    speaker: 'client',
    text: 'QUIT',
    meaning: 'Close session',
    explanation: 'Client quits.',
  },
  {
    speaker: 'server',
    text: '221 2.0.0 Bye',
    code: '221',
    meaning: 'Service closing',
    explanation: 'Server terminates TCP connection.',
  },
];

export const SmtpSimulator: React.FC = () => {
  const [isErrorMode, setIsErrorMode] = useState(false);
  const [lineIndex, setLineIndex] = useState(1);
  const [showReplyRef, setShowReplyRef] = useState(false);

  const session = isErrorMode ? ERROR_SESSION : SUCCESS_SESSION;
  const visibleLines = session.slice(0, lineIndex);
  const activeLine = visibleLines[visibleLines.length - 1];

  const handleNext = () => {
    setLineIndex((prev) => Math.min(session.length, prev + 1));
  };

  const handleReset = () => {
    setLineIndex(1);
  };

  const toggleMode = () => {
    setIsErrorMode(!isErrorMode);
    setLineIndex(1);
  };

  return (
    <div className="my-6 p-4 sm:p-5 rounded-lg bg-[var(--surface)] border border-[var(--rule)] shadow-sm interactive-tool">
      <div className="flex flex-wrap items-center justify-between gap-3 mb-4 pb-3 border-b border-[var(--rule)]">
        <div>
          <div className="font-sans font-bold text-base text-[var(--ink)]">
            Interactive SMTP Dialogue Simulator
          </div>
          <div className="text-xs text-[var(--muted)] font-sans mt-0.5">
            {isErrorMode
              ? 'Simulating 550 Recipient Unknown Error & RSET command'
              : 'Simulating standard successful delivery (HELO → MAIL → RCPT → DATA → QUIT)'}
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={toggleMode}
            className={`px-2.5 py-1 rounded text-xs font-sans font-semibold transition-colors flex items-center gap-1.5 ${
              isErrorMode
                ? 'bg-[var(--alert)] text-white'
                : 'border border-[var(--rule)] text-[var(--muted)] hover:text-[var(--ink)]'
            }`}
          >
            <AlertTriangle size={13} />
            <span>{isErrorMode ? 'Back to Normal Session' : 'Run with 550 Error'}</span>
          </button>

          <button
            onClick={() => setShowReplyRef(!showReplyRef)}
            className="p-1.5 rounded border border-[var(--rule)] text-[var(--muted)] hover:text-[var(--ink)] text-xs font-sans"
            title="Toggle reply code reference table"
          >
            <BookOpen size={15} />
          </button>

          <button
            onClick={handleReset}
            disabled={lineIndex === 1}
            className="p-1.5 rounded border border-[var(--rule)] text-[var(--muted)] hover:text-[var(--ink)] disabled:opacity-30"
            title="Reset"
          >
            <RotateCcw size={15} />
          </button>

          <button
            onClick={handleNext}
            disabled={lineIndex === session.length}
            className="flex items-center gap-1 px-3 py-1.5 rounded bg-[var(--packet)] text-white text-xs font-sans font-semibold disabled:opacity-30"
          >
            Reveal Next Line <ChevronRight size={14} />
          </button>
        </div>
      </div>

      {/* Reply codes cheat sheet toggle */}
      {showReplyRef && (
        <div className="mb-4 p-3 rounded-lg bg-[var(--paper)] border border-[var(--rule)] text-xs font-sans space-y-1">
          <div className="font-bold text-[var(--ink)] mb-1">
            Standard SMTP Reply Code Summary:
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 font-mono text-[11px]">
            <div><span className="text-[var(--signal)] font-bold">220:</span> Service ready</div>
            <div><span className="text-[var(--signal)] font-bold">221:</span> Closing connection</div>
            <div><span className="text-[var(--signal)] font-bold">250:</span> Action completed OK</div>
            <div><span className="text-[var(--packet)] font-bold">354:</span> Start mail input</div>
            <div><span className="text-amber-500 font-bold">421:</span> Service unavailable</div>
            <div><span className="text-amber-500 font-bold">450:</span> Mailbox busy</div>
            <div><span className="text-[var(--alert)] font-bold">500:</span> Syntax error</div>
            <div><span className="text-[var(--alert)] font-bold">550:</span> Mailbox not found</div>
          </div>
        </div>
      )}

      {/* Main chat dialogue view */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Terminal dialogue box */}
        <div className="lg:col-span-2 p-3.5 rounded-lg bg-[#0F172A] text-gray-100 font-mono text-xs max-h-96 overflow-y-auto space-y-2.5 shadow-inner">
          {visibleLines.map((line, idx) => {
            const isClient = line.speaker === 'client';

            return (
              <div
                key={idx}
                className={`flex flex-col ${
                  isClient ? 'items-end' : 'items-start'
                }`}
              >
                <div className="text-[10px] text-gray-400 mb-0.5">
                  {isClient ? 'Client (UA / Sender MTA)' : 'Server (mail.example.com MTA)'}
                </div>
                <div
                  className={`px-3 py-1.5 rounded max-w-[90%] whitespace-pre-wrap ${
                    isClient
                      ? 'bg-[#1D4ED8] text-white'
                      : line.code?.startsWith('5')
                      ? 'bg-[#991B1B] text-white'
                      : 'bg-[#065F46] text-white'
                  }`}
                >
                  <span className="font-bold mr-1">
                    {isClient ? 'C:' : 'S:'}
                  </span>
                  {line.text}
                </div>
              </div>
            );
          })}
        </div>

        {/* Side explanation box */}
        <div className="p-3.5 rounded-lg bg-[var(--paper)] border border-[var(--rule)] flex flex-col justify-between">
          <div>
            <div className="text-[11px] font-mono uppercase tracking-wider text-[var(--muted)] mb-1">
              Active Command / Code Explanation
            </div>
            <div className="font-sans font-bold text-sm text-[var(--ink)] mb-2">
              {activeLine.meaning}
            </div>
            <div className="text-xs text-[var(--ink)] font-sans leading-relaxed mb-3">
              {activeLine.explanation}
            </div>
          </div>

          <div className="pt-2 border-t border-[var(--rule)] text-[11px] font-mono text-[var(--muted)] flex items-center justify-between">
            <span>Progress: {lineIndex} / {session.length} lines</span>
            {lineIndex === session.length && (
              <span className="text-[var(--signal)] font-bold">Session finished</span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
