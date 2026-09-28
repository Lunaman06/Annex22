// src/markdown.js
import { marked } from 'marked';

export function parseModuleMarkdown(rawMarkdown, moduleId, lang = 'de') {
  if (!rawMarkdown) return { html: '', toc: [], checklists: [] };

  // Remove top metadata block if present
  let cleanMd = rawMarkdown.replace(/<!--\s*metadata[\s\S]*?-->/g, '');

  // Remove raw HTML navigation headers/footers to replace with native UI controls
  cleanMd = cleanMd.replace(/<div align="center">[\s\S]*?<\/div>/gi, '');

  const toc = [];
  const checklists = [];
  let checklistCounter = 0;

  // Custom marked renderer
  const renderer = new marked.Renderer();

  // Headings & Table of Contents extraction
  renderer.heading = ({ text, depth }) => {
    // Generate slug id
    const plainText = text.replace(/<[^>]+>/g, '').trim();
    const id = plainText
      .toLowerCase()
      .replace(/[^\w\s-]/g, '')
      .replace(/\s+/g, '-');

    if (depth === 2 || depth === 3) {
      toc.push({ id, text: plainText, depth });
    }

    return `<h${depth} id="${id}" class="doc-heading doc-heading-${depth}">
      <span class="heading-anchor">#</span>
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
      return `<div class="mermaid-wrapper">
        <div class="mermaid-actions">
          <span class="mermaid-label">Diagram</span>
          <button class="mermaid-zoom-btn" data-action="reset-zoom" title="Reset diagram">Reset View</button>
        </div>
        <pre class="mermaid">${text}</pre>
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

  // Lists and Checklist items
  renderer.listitem = ({ text, task, checked }) => {
    if (task) {
      checklistCounter++;
      const itemKey = `${moduleId}_item_${checklistCounter}`;
      const cleanLabel = text.replace(/<input[^>]*>/, '').trim();

      checklists.push({
        id: itemKey,
        moduleId,
        index: checklistCounter,
        text: cleanLabel,
        isRedFlag: cleanLabel.includes('❌') || cleanLabel.includes('Rote Flaggen')
      });

      return `<li class="checklist-item ${checked ? 'completed' : ''}" data-item-id="${itemKey}">
        <label class="custom-checkbox-label">
          <input type="checkbox" class="gxp-checkbox" data-key="${itemKey}" ${checked ? 'checked' : ''} />
          <span class="checkbox-custom-ui"></span>
          <span class="checklist-text">${cleanLabel}</span>
        </label>
      </li>`;
    }

    // Inspect if item is a Red Flag (starting with ❌)
    if (text.includes('❌')) {
      return `<li class="red-flag-item">
        <span class="red-flag-badge">RED FLAG</span>
        <span class="red-flag-text">${text}</span>
      </li>`;
    }

    return `<li>${text}</li>`;
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
