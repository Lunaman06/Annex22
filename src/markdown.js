// src/markdown.js
import { marked } from 'marked';
import katex from 'katex';

/**
 * Safely processes markdown text while preserving fenced code blocks and inline code spans.
 */
function processMarkdownText(markdown, transform) {
  const parts = markdown.split(/(```[\s\S]*?```|`[^`\n]+`)/g);
  return parts.map(part => {
    if (part.startsWith('`')) {
      return part;
    }
    return transform(part);
  }).join('');
}

/**
 * Transforms LaTeX math ($$display$$ and $inline$) into KaTeX rendered HTML.
 */
function renderMath(text) {
  // Block / Display Math: $$...$$
  let res = text.replace(/\$\$([\s\S]*?)\$\$/g, (match, math) => {
    try {
      const rendered = katex.renderToString(math.trim(), {
        displayMode: true,
        throwOnError: false
      });
      return `\n\n<div class="gxp-formula-card">${rendered}</div>\n\n`;
    } catch (e) {
      console.warn('KaTeX display render error:', e);
      return match;
    }
  });

  // Inline Math: $...$
  res = res.replace(/(^|[^\\])\$([^$\n]+?)\$/g, (match, prefix, math) => {
    // Avoid pure currency (e.g. $10, $5.99)
    if (/^\d+([.,]\d+)?\s*$/.test(math)) return match;
    try {
      const rendered = katex.renderToString(math.trim(), {
        displayMode: false,
        throwOnError: false
      });
      return `${prefix}${rendered}`;
    } catch (e) {
      console.warn('KaTeX inline render error:', e);
      return match;
    }
  });

  return res;
}

/**
 * Transforms regulatory, evidence, and didactic attribution tags into styled UI badges.
 * Patterns: [Draft §X.Y], [Best Practice: Source], [Didaktik], [Auslegung], etc.
 */
function renderBadges(text) {
  // Normalize instances where a badge is embedded inside bold text before a colon,
  // e.g. **Unabhängige Testdaten ([Draft §6.1]):** -> **Unabhängige Testdaten:** [Draft §6.1]
  let cleaned = text.replace(/(\*\*[^*]+?)\s*(?:\()?\s*\[(Draft\s+§[^\]]+|Best Practice[^\]]*|Didaktik[^\]]*|Auslegung[^\]]*|GAMP\s*5[^\]]*|ICH\s*Q9[^\]]*|Annex\s*11[^\]]*)\]\s*(?:\))?:\*\*/g, '$1:** [$2]');

  // Matches tags, optionally enclosed in parentheses like ([Didaktik])
  return cleaned.replace(/(?:\()?\s*\[(Draft\s+§[^\]]+|Best Practice[^\]]*|Didaktik[^\]]*|Auslegung[^\]]*|GAMP\s*5[^\]]*|ICH\s*Q9[^\]]*|Annex\s*11[^\]]*)\](?!\()\s*(?:\))?/g, (match, content) => {
    let type = 'draft';
    let icon = '§';

    if (content.startsWith('Best Practice')) {
      type = 'bestpractice';
      icon = '★';
    } else if (content.startsWith('Didaktik')) {
      type = 'didaktik';
      icon = '💡';
    } else if (content.startsWith('Auslegung')) {
      type = 'auslegung';
      icon = '⚖️';
    } else if (content.startsWith('GAMP') || content.startsWith('ICH') || content.startsWith('Annex')) {
      type = 'ref';
      icon = '📖';
    }

    return `<span class="gxp-badge gxp-badge-${type}"><span class="badge-icon">${icon}</span><span class="badge-text">${content}</span></span>`;
  });
}

export function parseModuleMarkdown(rawMarkdown, moduleId, lang = 'de') {
  if (!rawMarkdown) return { html: '', toc: [], checklists: [] };

  // Remove top metadata block if present
  let cleanMd = rawMarkdown.replace(/<!--\s*metadata[\s\S]*?-->/g, '');

  // Remove raw HTML navigation headers/footers to replace with native UI controls
  cleanMd = cleanMd.replace(/<div align="center">[\s\S]*?<\/div>/gi, '');

  // Process math and badges outside code blocks
  cleanMd = processMarkdownText(cleanMd, (chunk) => {
    const withMath = renderMath(chunk);
    return renderBadges(withMath);
  });

  const toc = [];
  const checklists = [];
  let checklistCounter = 0;

  // Custom marked renderer
  const renderer = new marked.Renderer();

  // Headings & Table of Contents extraction
  renderer.heading = ({ text, depth }) => {
    // Generate clean text without HTML tags for TOC and ID
    const plainText = text.replace(/<[^>]+>/g, '').trim();
    const id = plainText
      .toLowerCase()
      .replace(/[^\w\s-]/g, '')
      .replace(/\s+/g, '-');

    if (depth === 2 || depth === 3) {
      const tocLabel = plainText.replace(/💡|§|★|⚖️|📖/g, '').trim();
      toc.push({ id, text: tocLabel, depth });
    }

    const anchorTitle = lang === 'de' ? 'Direktlink zu diesem Abschnitt' : 'Direct link to this section';

    return `<h${depth} id="${id}" class="doc-heading doc-heading-${depth}">
      <a href="#${id}" class="heading-anchor" title="${anchorTitle}" aria-label="${anchorTitle}">#</a>
      <span class="heading-text">${text}</span>
    </h${depth}>`;
  };

  // Links rewriting for SPA navigation
  renderer.link = ({ href, title, text }) => {
    // Check if it's an internal link to another doc
    const docMatch = href.match(/([a-zA-Z0-9_-]+)\.md(#.*)?$/);
    if (docMatch && !href.startsWith('http')) {
      const targetModule = docMatch[1];
      const anchor = docMatch[2] ? docMatch[2] : '';
      return `<a href="#${targetModule}${anchor}" data-module="${targetModule}" class="spa-link" ${title ? `title="${title}"` : ''}>${text}</a>`;
    }

    // External link
    return `<a href="${href}" target="_blank" rel="noopener noreferrer" class="external-link" ${title ? `title="${title}"` : ''}>${text} ↗</a>`;
  };

  // Code blocks: intercept mermaid diagrams
  renderer.code = ({ text, lang: codeLang }) => {
    if (codeLang === 'mermaid') {
      const diagramId = `diag_${Math.random().toString(36).substring(2, 9)}`;

      // Extract a meaningful title from subgraph or first node if present
      const titleMatch = text.match(/subgraph\s+\w+\["([^"]+)"\]/) || text.match(/subgraph\s+([^\n\[]+)/);
      const diagramTitle = titleMatch
        ? titleMatch[1].replace(/<[^>]+>/g, '').trim()
        : (lang === 'de' ? 'Prozess- & Architektur-Diagramm' : 'Process & Architecture Diagram');

      return `<div class="mermaid-wrapper" data-diagram-id="${diagramId}" data-diagram-title="${diagramTitle}">
        <div class="mermaid-actions">
          <span class="mermaid-label">
            <i data-lucide="git-branch"></i>
            <span>${diagramTitle}</span>
          </span>
          <div class="mermaid-action-buttons">
            <button class="mermaid-action-btn" data-action="fullscreen" data-target="${diagramId}" title="${lang === 'de' ? 'Vollbild & Zoom öffnen' : 'Open Fullscreen & Zoom'}">
              <i data-lucide="maximize-2"></i>
              <span>${lang === 'de' ? '🔍 Großansicht & Zoom' : '🔍 Fullscreen & Zoom'}</span>
            </button>
          </div>
        </div>
        <div class="mermaid-viewport" id="${diagramId}" title="${lang === 'de' ? 'Klicken für Vollbild & Zoom' : 'Click for Fullscreen & Zoom'}">
          <pre class="mermaid">${text}</pre>
        </div>
      </div>`;
    }

    return `<div class="code-block-wrapper">
      <div class="code-block-header">
        <span class="code-lang">${codeLang || 'text'}</span>
        <button class="copy-code-btn" data-action="copy-code">Copy</button>
      </div>
      <pre><code class="language-${codeLang}">${text}</code></pre>
    </div>`;
  };

  // Blockquotes: intercept GitHub alerts [!NOTE], [!TIP], [!IMPORTANT], [!WARNING], [!CAUTION]
  renderer.blockquote = ({ text }) => {
    const alertMatch = text.match(/^\s*<p>\[!(NOTE|TIP|IMPORTANT|WARNING|CAUTION)\]\s*(<br>|\n)?([\s\S]*?)<\/p>/i);
    if (alertMatch) {
      const type = alertMatch[1].toUpperCase();
      const content = alertMatch[3];
      const iconMap = {
        NOTE: 'info',
        TIP: 'lightbulb',
        IMPORTANT: 'alert-circle',
        WARNING: 'alert-triangle',
        CAUTION: 'shield-alert'
      };
      const titleMap = {
        NOTE: { de: 'Hinweis', en: 'Note' },
        TIP: { de: 'Praxis-Tipp', en: 'Tip' },
        IMPORTANT: { de: 'Wichtig & Verbindlich', en: 'Important' },
        WARNING: { de: 'Warnung & Risiko', en: 'Warning' },
        CAUTION: { de: 'Praxisfall / Kritische Warnung', en: 'Industry Case / Caution' }
      };

      const title = titleMap[type] ? titleMap[type][lang] : type;
      const icon = iconMap[type] || 'info';

      return `<div class="gxp-callout gxp-callout-${type.toLowerCase()}">
        <div class="callout-header">
          <i data-lucide="${icon}"></i>
          <strong>${title}</strong>
        </div>
        <div class="callout-content">${content}</div>
      </div>`;
    }

    return `<blockquote>${text}</blockquote>`;
  };

  // Lists and Checklist items (marked v15: use this.parser.parse for recursive inline token resolution)
  renderer.listitem = function(item) {
    const content = this.parser.parse(item.tokens, !!item.loose);

    if (item.task) {
      checklistCounter++;
      const itemKey = `${moduleId}_item_${checklistCounter}`;
      const plainText = (item.text || '').replace(/<[^>]+>/g, '').trim();

      checklists.push({
        id: itemKey,
        moduleId,
        index: checklistCounter,
        text: plainText,
        isRedFlag: plainText.includes('❌') || plainText.includes('Rote Flaggen')
      });

      return `<li class="checklist-item ${item.checked ? 'completed' : ''}" data-item-id="${itemKey}">
        <label class="custom-checkbox-label">
          <input type="checkbox" class="gxp-checkbox" data-key="${itemKey}" ${item.checked ? 'checked' : ''} />
          <span class="checkbox-custom-ui"></span>
          <span class="checklist-text">${content}</span>
        </label>
      </li>\n`;
    }

    // Inspect if item is a Red Flag (starting with ❌)
    if (item.text && item.text.includes('❌')) {
      return `<li class="red-flag-item">
        <span class="red-flag-badge">RED FLAG</span>
        <span class="red-flag-text">${content}</span>
      </li>\n`;
    }

    return `<li>${content}</li>\n`;
  };

  marked.setOptions({
    renderer,
    gfm: true,
    breaks: false
  });

  const parsedHtml = marked.parse(cleanMd);

  return {
    html: parsedHtml,
    toc,
    checklists
  };
}
