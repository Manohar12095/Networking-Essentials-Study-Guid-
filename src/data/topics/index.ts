import { Topic } from '../../types/content';
import { vlsmTopic } from './vlsm';
import { distanceVectorTopic } from './distanceVector';
import { linkStateTopic } from './linkState';
import { udpTcpStatesTopic } from './udpTcpStates';
import { sctpTopic } from './sctp';
import { dnsTopic } from './dns';
import { smtpTopic } from './smtp';

export const TOPICS: Topic[] = [
  vlsmTopic,
  distanceVectorTopic,
  linkStateTopic,
  udpTcpStatesTopic,
  sctpTopic,
  dnsTopic,
  smtpTopic,
];

export const TOPIC_MAP = new Map<string, Topic>(
  TOPICS.map((topic) => [topic.slug, topic])
);

// Assert marks sum to 16 for every topic in development
TOPICS.forEach((topic) => {
  const sum = topic.sections.reduce((acc, s) => acc + s.marks, 0);
  if (sum !== 16) {
    console.error(
      `[Mark Allocation Error]: Topic "${topic.slug}" marks sum to ${sum}, expected 16.`
    );
  }
});
