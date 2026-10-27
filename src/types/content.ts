export type Block =
  | { type: 'paragraph'; text: string }
  | { type: 'bullets'; items: string[] }
  | { type: 'steps'; items: string[] }                       // real sequences only
  | { type: 'table'; caption?: string; headers: string[]; rows: string[][] }
  | { type: 'formula'; label?: string; lines: string[] }
  | { type: 'keypoints'; title?: string; items: string[] }
  | { type: 'mnemonic'; text: string }
  | { type: 'mistakes'; items: string[] }
  | { type: 'code'; title?: string; language?: string; code: string }
  | { type: 'image'; src: string; alt: string; caption: string; note?: string }
  | { type: 'native'; component: 'DistanceVectorSvg' | 'TcpStateSvg' | 'UdpHeader' | 'TopologySvg'; props?: Record<string, unknown> }
  | { type: 'interactive'; component: 'VlsmCalculator' | 'DistanceVectorStepper' | 'DijkstraStepper' | 'TcpStateExplorer' | 'DnsAnimator' | 'SmtpSimulator' | 'SctpHandshake' }
  | { type: 'callout'; tone: 'info' | 'warn' | 'success'; text: string };

export interface Section {
  id: string;
  title: string;
  marks: number;
  blocks: Block[];
}

export interface Topic {
  slug: string;
  unit: 3 | 4 | 5;
  order: number;
  title: string;
  shortTitle: string;
  oneLineDefinition: string;
  examKeywords: string[];
  writeInExam: string[];     // the 5-part skeleton, one line each
  revisionPoints: string[];  // 5 to 7 lines for Revise mode
  sections: Section[];       // marks sum to 16
}

export interface UnitInfo {
  unit: 3 | 4 | 5;
  title: string;
  description: string;
  topicSlugs: string[];
}

export interface QuizQuestion {
  id: string;
  topic: string;
  question: string;
  options: string[];
  answerIndex: number;
  explanation: string;
}
