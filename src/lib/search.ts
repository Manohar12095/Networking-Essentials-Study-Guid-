import { Topic } from '../types/content';

export interface SearchResult {
  topicSlug: string;
  topicTitle: string;
  unit: number;
  sectionId?: string;
  sectionTitle?: string;
  matchedText: string;
  snippet: string;
  score: number; // Higher is better (title match > keyword match > section match > body match)
}

export function searchTopics(query: string, topics: Topic[]): SearchResult[] {
  const q = query.trim().toLowerCase();
  if (!q) return [];

  const results: SearchResult[] = [];

  for (const topic of topics) {
    const titleLower = topic.title.toLowerCase();
    const shortTitleLower = topic.shortTitle.toLowerCase();
    const defLower = topic.oneLineDefinition.toLowerCase();

    // 1. Topic Title match
    if (titleLower.includes(q) || shortTitleLower.includes(q)) {
      results.push({
        topicSlug: topic.slug,
        topicTitle: topic.title,
        unit: topic.unit,
        matchedText: topic.title,
        snippet: topic.oneLineDefinition,
        score: 100,
      });
      continue;
    }

    // 2. Keywords match
    const matchedKw = topic.examKeywords.find((kw) =>
      kw.toLowerCase().includes(q)
    );
    if (matchedKw) {
      results.push({
        topicSlug: topic.slug,
        topicTitle: topic.title,
        unit: topic.unit,
        matchedText: `Keyword: ${matchedKw}`,
        snippet: `Contains key exam term: "${matchedKw}". ${topic.oneLineDefinition}`,
        score: 80,
      });
      continue;
    }

    // 3. One line definition match
    if (defLower.includes(q)) {
      results.push({
        topicSlug: topic.slug,
        topicTitle: topic.title,
        unit: topic.unit,
        matchedText: 'Definition',
        snippet: topic.oneLineDefinition,
        score: 70,
      });
      continue;
    }

    // 4. Search Sections
    let sectionMatched = false;
    for (const section of topic.sections) {
      const secTitleLower = section.title.toLowerCase();
      if (secTitleLower.includes(q)) {
        results.push({
          topicSlug: topic.slug,
          topicTitle: topic.title,
          unit: topic.unit,
          sectionId: section.id,
          sectionTitle: section.title,
          matchedText: section.title,
          snippet: `Found in section: ${section.title}`,
          score: 60,
        });
        sectionMatched = true;
        break;
      }

      // Check text inside blocks
      for (const block of section.blocks) {
        let blockText = '';
        if (block.type === 'paragraph') blockText = block.text;
        else if (block.type === 'bullets' || block.type === 'steps')
          blockText = block.items.join(' ');
        else if (block.type === 'keypoints')
          blockText = block.items.join(' ');
        else if (block.type === 'callout') blockText = block.text;
        else if (block.type === 'mnemonic') blockText = block.text;
        else if (block.type === 'table')
          blockText = `${block.headers.join(' ')} ${block.rows.flat().join(' ')}`;

        const idx = blockText.toLowerCase().indexOf(q);
        if (idx !== -1) {
          const start = Math.max(0, idx - 40);
          const end = Math.min(blockText.length, idx + q.length + 60);
          const snippet =
            (start > 0 ? '...' : '') +
            blockText.slice(start, end) +
            (end < blockText.length ? '...' : '');

          results.push({
            topicSlug: topic.slug,
            topicTitle: topic.title,
            unit: topic.unit,
            sectionId: section.id,
            sectionTitle: section.title,
            matchedText: section.title,
            snippet,
            score: 50,
          });
          sectionMatched = true;
          break;
        }
      }

      if (sectionMatched) break;
    }
  }

  return results.sort((a, b) => b.score - a.score);
}
