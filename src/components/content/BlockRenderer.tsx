import React, { useState } from 'react';
import { Copy, Check, Lightbulb, AlertOctagon, Info, AlertTriangle, CheckCircle2 } from 'lucide-react';
import { Block } from '../../types/content';
import { KeyPointBox } from './KeyPointBox';
import { FormulaBox } from './FormulaBox';
import { StepList } from './StepList';
import { DataTable } from './DataTable';
import { ImageFigure } from './ImageFigure';

// Native diagram components
import { UdpHeader } from '../diagrams/UdpHeader';
import { DistanceVectorSvg } from '../diagrams/DistanceVectorSvg';
import { TcpStateSvg } from '../diagrams/TcpStateSvg';
import { TopologySvg } from '../diagrams/TopologySvg';

// Interactive tools
import { VlsmCalculator } from '../interactive/VlsmCalculator';
import { DistanceVectorStepper } from '../interactive/DistanceVectorStepper';
import { DijkstraStepper } from '../interactive/DijkstraStepper';
import { TcpStateExplorer } from '../interactive/TcpStateExplorer';
import { DnsAnimator } from '../interactive/DnsAnimator';
import { SmtpSimulator } from '../interactive/SmtpSimulator';
import { SctpHandshake } from '../interactive/SctpHandshake';

interface BlockRendererProps {
  block: Block;
}

export const BlockRenderer: React.FC<BlockRendererProps> = ({ block }) => {
  const [copiedCode, setCopiedCode] = useState(false);

  const copyCode = (code: string) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2000);
  };

  switch (block.type) {
    case 'paragraph':
      return (
        <p className="my-3 text-base leading-relaxed text-[var(--ink)]">
          {block.text}
        </p>
      );

    case 'bullets':
      return (
        <ul className="my-3 space-y-2 pl-5 list-disc text-base leading-relaxed text-[var(--ink)]">
          {block.items.map((item, i) => (
            <li key={i}>{item}</li>
          ))}
        </ul>
      );

    case 'steps':
      return <StepList items={block.items} />;

    case 'table':
      return (
        <DataTable
          caption={block.caption}
          headers={block.headers}
          rows={block.rows}
        />
      );

    case 'formula':
      return <FormulaBox label={block.label} lines={block.lines} />;

    case 'keypoints':
      return <KeyPointBox title={block.title} items={block.items} />;

    case 'mnemonic':
      return (
        <div className="my-3 p-3.5 rounded-lg bg-[var(--mark)]/15 border-l-4 border-[var(--mark)] flex items-start gap-3 text-sm font-sans font-bold text-[var(--ink)]">
          <Lightbulb size={18} className="text-[#D99B00] shrink-0 mt-0.5" />
          <span>{block.text}</span>
        </div>
      );

    case 'mistakes':
      return (
        <div className="my-4 p-4 rounded-lg bg-[var(--alert)]/10 border-l-4 border-[var(--alert)] text-[var(--ink)]">
          <div className="flex items-center gap-2 mb-2 font-sans font-bold text-sm text-[var(--alert)]">
            <AlertOctagon size={16} />
            <span>Common Exam Mistakes to Avoid (Zero Mark Traps)</span>
          </div>
          <ul className="space-y-1.5 pl-5 list-disc text-sm sm:text-base leading-relaxed">
            {block.items.map((item, i) => (
              <li key={i}>{item}</li>
            ))}
          </ul>
        </div>
      );

    case 'code':
      return (
        <div className="my-4 rounded-lg bg-[#0E1624] text-[#E8EEF8] border border-[var(--rule)] overflow-hidden shadow-sm">
          {block.title && (
            <div className="flex items-center justify-between px-4 py-2 border-b border-[#27364F] text-xs font-mono text-[var(--muted)]">
              <span>{block.title}</span>
              <button
                onClick={() => copyCode(block.code)}
                className="flex items-center gap-1 hover:text-white transition-colors"
                title="Copy code to clipboard"
              >
                {copiedCode ? <Check size={13} className="text-green-400" /> : <Copy size={13} />}
                <span>{copiedCode ? 'Copied' : 'Copy'}</span>
              </button>
            </div>
          )}
          <pre className="p-4 overflow-x-auto text-xs sm:text-sm font-mono leading-relaxed m-0 bg-transparent">
            <code>{block.code}</code>
          </pre>
        </div>
      );

    case 'image':
      return (
        <ImageFigure
          src={block.src}
          alt={block.alt}
          caption={block.caption}
          note={block.note}
          isCorrectionPanel={Boolean(block.note)}
        />
      );

    case 'native':
      switch (block.component) {
        case 'DistanceVectorSvg':
          return <DistanceVectorSvg />;
        case 'TcpStateSvg':
          return <TcpStateSvg />;
        case 'UdpHeader':
          return <UdpHeader />;
        case 'TopologySvg':
          return <TopologySvg />;
        default:
          return null;
      }

    case 'interactive':
      switch (block.component) {
        case 'VlsmCalculator':
          return <VlsmCalculator />;
        case 'DistanceVectorStepper':
          return <DistanceVectorStepper />;
        case 'DijkstraStepper':
          return <DijkstraStepper />;
        case 'TcpStateExplorer':
          return <TcpStateExplorer />;
        case 'DnsAnimator':
          return <DnsAnimator />;
        case 'SmtpSimulator':
          return <SmtpSimulator />;
        case 'SctpHandshake':
          return <SctpHandshake />;
        default:
          return null;
      }

    case 'callout': {
      const toneStyles = {
        info: 'bg-[var(--packet)]/10 border-[var(--packet)]/40 text-[var(--ink)]',
        warn: 'bg-[var(--alert)]/10 border-[var(--alert)]/40 text-[var(--ink)]',
        success: 'bg-[var(--signal)]/10 border-[var(--signal)]/40 text-[var(--ink)]',
      }[block.tone];

      const toneIcon = {
        info: <Info size={16} className="text-[var(--packet)] shrink-0 mt-0.5" />,
        warn: <AlertTriangle size={16} className="text-[var(--alert)] shrink-0 mt-0.5" />,
        success: <CheckCircle2 size={16} className="text-[var(--signal)] shrink-0 mt-0.5" />,
      }[block.tone];

      return (
        <div className={`my-4 p-3.5 rounded-lg border ${toneStyles} flex items-start gap-3 text-sm leading-relaxed`}>
          {toneIcon}
          <span>{block.text}</span>
        </div>
      );
    }

    default:
      return null;
  }
};
