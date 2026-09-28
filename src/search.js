// src/search.js
import { MODULE_REGISTRY, getDocContent } from './data.js';

export class SearchEngine {
  constructor() {
    this.indexes = {
      de: [],
      en: []
    };
    this.buildIndex();
  }

  buildIndex() {
    ['de', 'en'].forEach(lang => {
      MODULE_REGISTRY.forEach(mod => {
        const raw = getDocContent(mod.id, lang);
        if (!raw) return;

        // Parse into searchable chunks (Sections by H2 / H3)
        const sections = raw.split(/\n(?=##\s+)/);
        sections.forEach((section, idx) => {
          const lines = section.trim().split('\n');
          const headingLine = lines[0] || '';
          const heading = headingLine.replace(/^##+\s*/, '').replace(/[🎯🧭📌💡📋🛡️⚠️❌]/g, '').trim();
          const body = lines.slice(1).join('\n').replace(/<!--[\s\S]*?-->/g, '').replace(/```[\s\S]*?```/g, '');

          this.indexes[lang].push({
            moduleId: mod.id,
            moduleNumber: mod.number,
            moduleTitle: mod.title[lang],
            heading: heading || mod.title[lang],
            bodyText: body,
            cleanText: `${heading} ${body}`.toLowerCase(),
            sectionIndex: idx
          });
        });
      });
    });
  }

  search(query, lang = 'de', limit = 10) {
    if (!query || query.trim().length < 2) return [];

    const q = query.toLowerCase().trim();
    const terms = q.split(/\s+/).filter(t => t.length > 0);
    const docs = this.indexes[lang] || [];

    const results = [];

    docs.forEach(doc => {
      let score = 0;
      let matchedTermCount = 0;

      // Check title match
      if (doc.moduleTitle.toLowerCase().includes(q)) score += 50;
      if (doc.heading.toLowerCase().includes(q)) score += 40;

      terms.forEach(term => {
        if (doc.heading.toLowerCase().includes(term)) {
          score += 20;
          matchedTermCount++;
        }
        const bodyMatches = (doc.cleanText.match(new RegExp(term, 'g')) || []).length;
        if (bodyMatches > 0) {
          score += Math.min(bodyMatches * 3, 30);
          matchedTermCount++;
        }
      });

      if (score > 0) {
        // Extract relevant snippet around matched terms
        let snippet = '';
        const lowerBody = doc.bodyText.toLowerCase();
        let firstPos = lowerBody.indexOf(terms[0]);
        if (firstPos === -1) firstPos = 0;

        const start = Math.max(0, firstPos - 60);
        const end = Math.min(doc.bodyText.length, firstPos + 140);
        snippet = doc.bodyText.substring(start, end).replace(/\n/g, ' ').trim();
        if (start > 0) snippet = '...' + snippet;
        if (end < doc.bodyText.length) snippet = snippet + '...';

        results.push({
          moduleId: doc.moduleId,
          moduleNumber: doc.moduleNumber,
          moduleTitle: doc.moduleTitle,
          heading: doc.heading,
          snippet,
          score
        });
      }
    });

    results.sort((a, b) => b.score - a.score);
    return results.slice(0, limit);
  }
}
