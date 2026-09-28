// src/app.js
import mermaid from 'mermaid';
import confetti from 'canvas-confetti';
import { createIcons, icons } from 'lucide';

import { MODULE_REGISTRY, PHASES, getDocContent } from './data.js';
import { parseModuleMarkdown } from './markdown.js';
import { SearchEngine } from './search.js';

class Annex22App {
  constructor() {
    this.lang = localStorage.getItem('annex22_lang') || 'de';
    this.theme = localStorage.getItem('annex22_theme') || 'dark';
    this.currentModuleId = this.getInitialRoute();
    this.checklistState = JSON.parse(localStorage.getItem('annex22_checklists') || '{}');
    this.searchEngine = new SearchEngine();

    this.initTheme();
    this.initMermaid();
    this.renderShell();
    this.bindEvents();
    this.navigate(this.currentModuleId, false);
  }

  getInitialRoute() {
    const hash = window.location.hash.replace('#', '');
    if (hash === 'checklist_master') return 'checklist_master';
    const found = MODULE_REGISTRY.find(m => m.id === hash);
    return found ? found.id : '00_overview';
  }

  initTheme() {
    document.documentElement.setAttribute('data-theme', this.theme);
  }

  toggleTheme() {
    this.theme = this.theme === 'dark' ? 'light' : 'dark';
    localStorage.setItem('annex22_theme', this.theme);
    this.initTheme();
    this.initMermaid();
    this.renderContent();
  }

  initMermaid() {
    mermaid.initialize({
      startOnLoad: false,
      theme: this.theme === 'dark' ? 'dark' : 'default',
      securityLevel: 'loose',
      fontFamily: 'Inter, sans-serif'
    });
  }

  setLanguage(lang) {
    if (this.lang === lang) return;
    this.lang = lang;
    localStorage.setItem('annex22_lang', lang);
    this.renderSidebar();
    this.renderContent();
    this.updateLanguageUI();
  }

  updateLanguageUI() {
    document.querySelectorAll('.lang-btn').forEach(btn => {
      btn.classList.toggle('active', btn.dataset.lang === this.lang);
    });
  }

  renderShell() {
    const appEl = document.getElementById('app');
    appEl.innerHTML = `
      <!-- Header -->
      <header class="site-header">
        <div class="header-left">
          <button class="mobile-menu-btn" id="mobileMenuBtn" aria-label="Toggle menu">
            <i data-lucide="menu"></i>
          </button>
          <a href="#00_overview" class="brand-link" data-route="00_overview">
            <div class="brand-logo-icon">22</div>
            <div class="brand-text">
              <span class="brand-title">EU GMP Annex 22</span>
              <span class="brand-badge">${this.lang === 'de' ? 'AI Compliance Hub' : 'AI Compliance Hub'}</span>
            </div>
          </a>
        </div>

        <button class="search-trigger" id="searchTriggerBtn">
          <i data-lucide="search"></i>
          <span>${this.lang === 'de' ? 'Themen & Leitfäden durchsuchen...' : 'Search guidelines & topics...'}</span>
          <span class="search-shortcut">⌘K</span>
        </button>

        <div class="header-right">
          <button class="header-btn" id="masterChecklistBtn" data-route="checklist_master">
            <i data-lucide="clipboard-check"></i>
            <span>${this.lang === 'de' ? 'Audit-Checklisten' : 'Audit Checklists'}</span>
          </button>

          <div class="lang-switch">
            <button class="lang-btn ${this.lang === 'de' ? 'active' : ''}" data-lang="de">🇩🇪 DE</button>
            <button class="lang-btn ${this.lang === 'en' ? 'active' : ''}" data-lang="en">🇬🇧 EN</button>
          </div>

          <button class="theme-btn" id="themeToggleBtn" aria-label="Toggle color theme">
            <i data-lucide="${this.theme === 'dark' ? 'sun' : 'moon'}"></i>
          </button>
        </div>
      </header>

      <!-- App Body (Sidebar + Content) -->
      <div class="app-body">
        <aside class="site-sidebar" id="siteSidebar"></aside>
        <main class="main-content" id="mainContent">
          <div class="content-wrapper" id="contentWrapper"></div>
        </main>
      </div>

      <!-- Search Modal -->
      <div class="search-modal-backdrop" id="searchModal">
        <div class="search-modal">
          <div class="search-input-wrap">
            <i data-lucide="search"></i>
            <input type="text" class="search-input" id="searchInput" placeholder="${this.lang === 'de' ? 'Suchbegriff eingeben (z.B. OOD, SHAP, Metric Quad)...' : 'Type to search (e.g. OOD, SHAP, Metric Quad)...'}" />
            <span class="search-shortcut">ESC</span>
          </div>
          <div class="search-results-list" id="searchResultsList"></div>
        </div>
      </div>
    `;

    createIcons({ icons });
    this.renderSidebar();
  }

  renderSidebar() {
    const sidebarEl = document.getElementById('siteSidebar');
    if (!sidebarEl) return;

    // Calculate site-wide checklist completion
    const stats = this.getGlobalChecklistStats();

    let navHtml = `
      <!-- Global Compliance Progress Card -->
      <div class="sidebar-progress-card">
        <div class="progress-header">
          <span class="progress-title">${this.lang === 'de' ? 'Compliance Status' : 'Compliance Status'}</span>
          <span class="progress-percentage">${stats.percentage}%</span>
        </div>
        <div class="progress-bar-bg">
          <div class="progress-bar-fill" style="width: ${stats.percentage}%;"></div>
        </div>
        <div class="progress-subtext">
          <span>${stats.completed}/${stats.total} ${this.lang === 'de' ? 'Kriterien erfüllt' : 'items checked'}</span>
          <a href="#checklist_master" data-route="checklist_master" class="spa-link" style="font-size:0.75rem;">${this.lang === 'de' ? 'Audit-Report ➔' : 'Audit Report ➔'}</a>
        </div>
      </div>

      <!-- Overview Link -->
      <div class="nav-group">
        <a href="#00_overview" class="nav-item ${this.currentModuleId === '00_overview' ? 'active' : ''}" data-route="00_overview">
          <i data-lucide="compass"></i>
          <span class="nav-item-title">${this.lang === 'de' ? 'Gesamtübersicht & Framework' : 'Master Overview & Framework'}</span>
        </a>
      </div>
    `;

    // Render Phases & Modules
    PHASES.forEach(phase => {
      navHtml += `<div class="nav-group">
        <div class="nav-group-title">${phase.title[this.lang]}</div>`;

      phase.modules.forEach(modId => {
        const mod = MODULE_REGISTRY.find(m => m.id === modId);
        if (!mod) return;
        const isActive = this.currentModuleId === mod.id;
        navHtml += `
          <a href="#${mod.id}" class="nav-item ${isActive ? 'active' : ''}" data-route="${mod.id}">
            <span class="nav-item-num">${mod.number}</span>
            <span class="nav-item-title">${mod.title[this.lang].replace(/^Modul \d+:\s*/, '')}</span>
            <span class="nav-item-badge">${mod.badge[this.lang]}</span>
          </a>
        `;
      });

      navHtml += `</div>`;
    });

    sidebarEl.innerHTML = navHtml;
    createIcons({ icons });
  }

  getGlobalChecklistStats() {
    let total = 0;
    let completed = 0;

    MODULE_REGISTRY.forEach(mod => {
      const raw = getDocContent(mod.id, this.lang);
      if (raw) {
        const { checklists } = parseModuleMarkdown(raw, mod.id, this.lang);
        checklists.forEach(item => {
          total++;
          if (this.checklistState[item.id]) {
            completed++;
          }
        });
      }
    });

    const percentage = total > 0 ? Math.round((completed / total) * 100) : 0;
    return { total, completed, percentage };
  }

  navigate(moduleId, pushHistory = true) {
    this.currentModuleId = moduleId;
    if (pushHistory) {
      window.location.hash = moduleId;
    }

    // Close mobile sidebar if open
    document.getElementById('siteSidebar')?.classList.remove('mobile-open');

    // Update active nav styling
    document.querySelectorAll('.nav-item').forEach(el => {
      el.classList.toggle('active', el.dataset.route === moduleId);
    });

    this.renderContent();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  renderContent() {
    const wrapper = document.getElementById('contentWrapper');
    if (!wrapper) return;

    if (this.currentModuleId === 'checklist_master') {
      this.renderMasterChecklistView(wrapper);
      return;
    }

    if (this.currentModuleId === '00_overview') {
      this.renderOverviewHomeView(wrapper);
      return;
    }

    this.renderModuleView(wrapper, this.currentModuleId);
  }

  renderOverviewHomeView(container) {
    const raw = getDocContent('00_overview', this.lang);
    const parsed = parseModuleMarkdown(raw, '00_overview', this.lang);

    const stats = this.getGlobalChecklistStats();

    container.innerHTML = `
      <!-- Hero Banner -->
      <div class="hero-banner">
        <div class="hero-tag">
          <i data-lucide="shield-check"></i>
          <span>${this.lang === 'de' ? 'Offizieller Draft 2026/2027 • Annex 11 Durchsetzung' : 'Official Draft 2026/2027 • Annex 11 Enforcement'}</span>
        </div>
        <h1 class="hero-title">${this.lang === 'de' ? 'EU GMP Annex 22: Künstliche Intelligenz in der Pharma-Produktion' : 'EU GMP Annex 22: Artificial Intelligence in GxP Manufacturing'}</h1>
        <p class="hero-subtitle">${this.lang === 'de' ? 'Das interaktive Wissens- und Compliance-Portal für regulatorische Sicherheit, MLOps-Validierung und Inspektionsbereitschaft.' : 'The interactive compliance and learning portal for regulatory rigor, MLOps validation, and audit readiness.'}</p>

        <div class="hero-stats-grid">
          <div class="hero-stat-card">
            <span class="hero-stat-value">12 + 2</span>
            <span class="hero-stat-label">${this.lang === 'de' ? 'Fachmodule & Praxis-Guides' : 'Core Modules & Best-Practice Guides'}</span>
          </div>
          <div class="hero-stat-card">
            <span class="hero-stat-value">${stats.completed} / ${stats.total}</span>
            <span class="hero-stat-label">${this.lang === 'de' ? 'Audit-Kriterien verifiziert' : 'GxP Audit Items Verified'}</span>
          </div>
          <div class="hero-stat-card">
            <span class="hero-stat-value">100%</span>
            <span class="hero-stat-label">${this.lang === 'de' ? 'Zweisprachig (DE / EN Synchron)' : 'Bilingual (DE / EN Synchronized)'}</span>
          </div>
          <div class="hero-stat-card">
            <span class="hero-stat-value">GAMP 5</span>
            <span class="hero-stat-label">${this.lang === 'de' ? 'ISPE AI Guide 2025 Harmonisiert' : 'ISPE AI Guide 2025 Harmonized'}</span>
          </div>
        </div>
      </div>

      <!-- Interactive AI Lifecycle Navigator -->
      <div class="lifecycle-section">
        <div class="section-title-wrap">
          <div>
            <h2 class="section-title">${this.lang === 'de' ? '🧭 Der pharmazeutische KI-Lebenszyklus' : '🧭 The Pharmaceutical AI Lifecycle'}</h2>
            <p class="section-desc">${this.lang === 'de' ? 'Wähle eine Lebenszyklus-Phase, um direkt in die regulatorischen Leitfäden einzutauchen:' : 'Select a lifecycle phase to dive into the regulatory compliance guide:'}</p>
          </div>
        </div>

        <div class="lifecycle-track">
          <a href="#module_01_introduction_ai_gxp" class="lifecycle-step-card" data-route="module_01_introduction_ai_gxp">
            <div class="step-number-badge">1</div>
            <div class="step-card-title">${this.lang === 'de' ? 'Scope & Strategy' : 'Scope & Strategy'}</div>
            <div class="step-card-modules">Modul 01 - 03</div>
            <div class="step-card-guardrail">${this.lang === 'de' ? 'Keine dynamischen Modelle im GMP-Betrieb' : 'No dynamic learning models in GMP operations'}</div>
          </a>

          <a href="#module_04_risk_based_approach" class="lifecycle-step-card" data-route="module_04_risk_based_approach">
            <div class="step-number-badge">2</div>
            <div class="step-card-title">${this.lang === 'de' ? 'Risk & Intended Use' : 'Risk & Intended Use'}</div>
            <div class="step-card-modules">Modul 04 - 05</div>
            <div class="step-card-guardrail">${this.lang === 'de' ? 'ICH Q9 R1 & Out-of-Distribution Grenzen' : 'ICH Q9 R1 & Out-of-Distribution boundaries'}</div>
          </a>

          <a href="#module_06_data_governance_quality" class="lifecycle-step-card" data-route="module_06_data_governance_quality">
            <div class="step-number-badge">3</div>
            <div class="step-card-title">${this.lang === 'de' ? 'Data Governance' : 'Data Governance'}</div>
            <div class="step-card-modules">Modul 06</div>
            <div class="step-card-guardrail">${this.lang === 'de' ? 'ALCOA+ Integrität & Labeling-Audits' : 'ALCOA+ integrity & labeling audit trails'}</div>
          </a>

          <a href="#module_07_model_development_training" class="lifecycle-step-card" data-route="module_07_model_development_training">
            <div class="step-number-badge">4</div>
            <div class="step-card-title">${this.lang === 'de' ? 'Training & MLOps' : 'Training & MLOps'}</div>
            <div class="step-card-modules">Modul 07</div>
            <div class="step-card-guardrail">${this.lang === 'de' ? 'Gefrorene Gewichte & 3-Wege-Splits' : 'Frozen weights & strictly isolated 3-way split'}</div>
          </a>

          <a href="#module_08_validation_performance_testing" class="lifecycle-step-card" data-route="module_08_validation_performance_testing">
            <div class="step-number-badge">5</div>
            <div class="step-card-title">${this.lang === 'de' ? 'Metric Quad & XAI' : 'Metric Quad & XAI'}</div>
            <div class="step-card-modules">Modul 08 - 09</div>
            <div class="step-card-guardrail">${this.lang === 'de' ? 'Personelle Unabhängigkeit & SHAP/LIME' : 'Staff independence & SHAP/LIME stability'}</div>
          </a>

          <a href="#module_10_human_oversight_hitl" class="lifecycle-step-card" data-route="module_10_human_oversight_hitl">
            <div class="step-number-badge">6</div>
            <div class="step-card-title">${this.lang === 'de' ? 'Human Oversight' : 'Human Oversight'}</div>
            <div class="step-card-modules">Modul 10 - 12</div>
            <div class="step-card-guardrail">${this.lang === 'de' ? 'HITL-Pflicht & Schutz vor Automation Bias' : 'Mandatory HITL & anti-complacency workflows'}</div>
          </a>
        </div>
      </div>

      <!-- Key Regulatory Guardrails Grid -->
      <div class="section-title-wrap">
        <div>
          <h2 class="section-title">${this.lang === 'de' ? '🛡️ Die 4 Eisernen Regeln von Annex 22' : '🛡️ The 4 Iron Laws of Annex 22'}</h2>
          <p class="section-desc">${this.lang === 'de' ? 'Nicht verhandelbare regulatorische Prinzipien für den GxP-Einsatz:' : 'Non-negotiable compliance principles for regulated operations:'}</p>
        </div>
      </div>

      <div class="guardrails-grid">
        <div class="guardrail-card">
          <div class="guardrail-icon-wrap" style="color:var(--brand-rose);">
            <i data-lucide="lock"></i>
          </div>
          <h3 class="guardrail-title">${this.lang === 'de' ? '1. Keine autonome Freigabe' : '1. Zero Autonomous Release'}</h3>
          <p class="guardrail-desc">${this.lang === 'de' ? 'KI-Systeme tragen keine pharmazeutische Rechtsverantwortung. Human-in-the-Loop (HITL) ist für Chargenfreigaben und OOS zwingend vorgeschrieben.' : 'AI models hold zero statutory accountability. Human-in-the-Loop (HITL) is mandatory for batch disposition and OOS triage.'}</p>
        </div>

        <div class="guardrail-card">
          <div class="guardrail-icon-wrap" style="color:var(--brand-cyan);">
            <i data-lucide="snowflake"></i>
          </div>
          <h3 class="guardrail-title">${this.lang === 'de' ? '2. Nur statische Modelle' : '2. Static Frozen Weights Only'}</h3>
          <p class="guardrail-desc">${this.lang === 'de' ? 'Dynamisch, sich selbst während der Produktion weitertrainierende Modelle sind im GMP-Betrieb strikt verboten. Jedes Update bedarf einer Revalidierung.' : 'Dynamically auto-retraining models are prohibited in GMP manufacturing. Any weight update requires formal revalidation.'}</p>
        </div>

        <div class="guardrail-card">
          <div class="guardrail-icon-wrap" style="color:var(--brand-emerald);">
            <i data-lucide="activity"></i>
          </div>
          <h3 class="guardrail-title">${this.lang === 'de' ? '3. Das Metric Quad' : '3. The Metric Quad'}</h3>
          <p class="guardrail-desc">${this.lang === 'de' ? 'Eine bloße globale "Accuracy" führt zur Beanstandung. Annex 22 verlangt F1-Score, maximalen Recall, Modellkalibrierung (ECE) und Robustheit.' : 'Relying solely on Accuracy fails inspection. Annex 22 mandates F1-score, Recall maximization, Calibration (ECE), and Robustness.'}</p>
        </div>

        <div class="guardrail-card">
          <div class="guardrail-icon-wrap" style="color:var(--brand-primary);">
            <i data-lucide="bot"></i>
          </div>
          <h3 class="guardrail-title">${this.lang === 'de' ? '4. RAG-First bei GenAI' : '4. RAG-First for GenAI'}</h3>
          <p class="guardrail-desc">${this.lang === 'de' ? 'LLMs dürfen nur als Drafting Assistants mit RAG-Architektur agieren. Jede Textpassage erfordert lückenlose ALCOA+-Zitate zur Quell-SOP.' : 'LLMs may operate solely as drafting assistants via sandboxed RAG. Every assertion requires clickable ALCOA+ source citations.'}</p>
        </div>
      </div>

      <!-- Main Overview Content -->
      <div class="markdown-body">
        ${parsed.html}
      </div>
    `;

    createIcons({ icons });
    this.initMermaidDiagrams();
    this.bindCheckboxes(container);
  }

  renderModuleView(container, moduleId) {
    const mod = MODULE_REGISTRY.find(m => m.id === moduleId);
    if (!mod) return;

    const raw = getDocContent(moduleId, this.lang);
    const parsed = parseModuleMarkdown(raw, moduleId, this.lang);

    // Prev / Next Navigation IDs
    const currentIndex = MODULE_REGISTRY.findIndex(m => m.id === moduleId);
    const prevMod = currentIndex > 0 ? MODULE_REGISTRY[currentIndex - 1] : null;
    const nextMod = currentIndex < MODULE_REGISTRY.length - 1 ? MODULE_REGISTRY[currentIndex + 1] : null;

    container.innerHTML = `
      <div class="module-header">
        <div class="module-meta-bar">
          <span class="module-phase-badge">${mod.badge[this.lang]}</span>
          <div class="module-actions">
            <button class="header-btn" id="printModuleBtn">
              <i data-lucide="printer"></i>
              <span>${this.lang === 'de' ? 'Drucken' : 'Print'}</span>
            </button>
          </div>
        </div>
        <h1 class="module-main-title">${mod.title[this.lang]}</h1>
        <p class="module-subtitle">${mod.subtitle[this.lang]}</p>
      </div>

      <div class="markdown-body">
        ${parsed.html}
      </div>

      <!-- Module Navigation Footer -->
      <div class="module-footer-nav">
        ${prevMod ? `
          <a href="#${prevMod.id}" class="footer-nav-card" data-route="${prevMod.id}">
            <span class="footer-nav-label">⬅ ${this.lang === 'de' ? 'Vorheriges Modul' : 'Previous Module'}</span>
            <span class="footer-nav-title">${prevMod.title[this.lang]}</span>
          </a>
        ` : '<div></div>'}

        ${nextMod ? `
          <a href="#${nextMod.id}" class="footer-nav-card" style="text-align:right;" data-route="${nextMod.id}">
            <span class="footer-nav-label">${this.lang === 'de' ? 'Nächstes Modul' : 'Next Module'} ➔</span>
            <span class="footer-nav-title">${nextMod.title[this.lang]}</span>
          </a>
        ` : '<div></div>'}
      </div>
    `;

    createIcons({ icons });
    this.initMermaidDiagrams();
    this.bindCheckboxes(container);

    // Bind Print Button
    document.getElementById('printModuleBtn')?.addEventListener('click', () => {
      window.print();
    });
  }

  renderMasterChecklistView(container) {
    const allChecklists = [];
    MODULE_REGISTRY.forEach(mod => {
      const raw = getDocContent(mod.id, this.lang);
      if (raw) {
        const { checklists } = parseModuleMarkdown(raw, mod.id, this.lang);
        if (checklists.length > 0) {
          allChecklists.push({
            module: mod,
            items: checklists
          });
        }
      }
    });

    const stats = this.getGlobalChecklistStats();

    container.innerHTML = `
      <div class="master-checklist-view">
        <div class="module-header">
          <div class="module-meta-bar">
            <span class="module-phase-badge">${this.lang === 'de' ? 'Master Audit Dashboard' : 'Master Audit Dashboard'}</span>
            <div class="checklist-action-btns">
              <button class="header-btn primary" id="exportAuditJsonBtn">
                <i data-lucide="download"></i>
                <span>JSON Export</span>
              </button>
              <button class="header-btn" id="exportAuditMdBtn">
                <i data-lucide="file-text"></i>
                <span>Markdown Report</span>
              </button>
              <button class="header-btn" id="resetChecklistBtn" style="color:var(--brand-rose);">
                <i data-lucide="rotate-ccw"></i>
                <span>${this.lang === 'de' ? 'Zurücksetzen' : 'Reset'}</span>
              </button>
            </div>
          </div>
          <h1 class="module-main-title">${this.lang === 'de' ? 'GxP-Compliance Gesamtprüfbericht' : 'Comprehensive GxP Compliance Audit'}</h1>
          <p class="module-subtitle">${this.lang === 'de' ? 'Verfolgen, verifizieren und exportieren Sie alle regulatorischen Anforderungen über alle 15 Module hinweg.' : 'Track, verify, and export regulatory compliance items across all 15 modules.'}</p>
        </div>

        <!-- Controls Bar -->
        <div class="checklist-controls-bar">
          <div class="filter-pills">
            <button class="filter-pill active" data-filter="all">${this.lang === 'de' ? 'Alle Kriterien' : 'All Items'} (${stats.total})</button>
            <button class="filter-pill" data-filter="pending">${this.lang === 'de' ? 'Offen' : 'Pending'} (${stats.total - stats.completed})</button>
            <button class="filter-pill" data-filter="completed">${this.lang === 'de' ? 'Erfüllt' : 'Completed'} (${stats.completed})</button>
          </div>

          <div style="font-weight:600; font-size:0.9rem;">
            ${this.lang === 'de' ? 'Gesamtfortschritt:' : 'Overall Progress:'} <span style="color:var(--brand-emerald);">${stats.percentage}%</span>
          </div>
        </div>

        <!-- Checklists grouped by Module -->
        <div class="all-checklists-container" id="allChecklistsContainer">
          ${allChecklists.map(group => `
            <div class="module-checklist-group" style="margin-bottom:2.5rem;" data-module-group="${group.module.id}">
              <h2 style="font-family:var(--font-heading); font-size:1.35rem; margin-bottom:1rem; display:flex; align-items:center; gap:0.5rem;">
                <span class="nav-item-num">${group.module.number}</span>
                <span>${group.module.title[this.lang]}</span>
              </h2>
              <ul style="padding-left:0;">
                ${group.items.map(item => {
                  const isChecked = !!this.checklistState[item.id];
                  return `
                    <li class="checklist-item ${isChecked ? 'completed' : ''}" data-item-id="${item.id}" data-status="${isChecked ? 'completed' : 'pending'}">
                      <label class="custom-checkbox-label">
                        <input type="checkbox" class="gxp-checkbox" data-key="${item.id}" ${isChecked ? 'checked' : ''} />
                        <span class="checkbox-custom-ui"></span>
                        <span class="checklist-text">${item.text}</span>
                      </label>
                    </li>
                  `;
                }).join('')}
              </ul>
            </div>
          `).join('')}
        </div>
      </div>
    `;

    createIcons({ icons });
    this.bindCheckboxes(container);

    // Bind Filter Pills
    container.querySelectorAll('.filter-pill').forEach(pill => {
      pill.addEventListener('click', (e) => {
        container.querySelectorAll('.filter-pill').forEach(p => p.classList.remove('active'));
        e.target.classList.add('active');
        const filter = e.target.dataset.filter;

        container.querySelectorAll('.checklist-item').forEach(item => {
          const status = item.dataset.status;
          if (filter === 'all' || status === filter) {
            item.style.display = 'block';
          } else {
            item.style.display = 'none';
          }
        });
      });
    });

    // Export JSON
    document.getElementById('exportAuditJsonBtn')?.addEventListener('click', () => {
      this.exportAuditJSON();
    });

    // Export Markdown
    document.getElementById('exportAuditMdBtn')?.addEventListener('click', () => {
      this.exportAuditMarkdown();
    });

    // Reset Checklist
    document.getElementById('resetChecklistBtn')?.addEventListener('click', () => {
      if (confirm(this.lang === 'de' ? 'Möchten Sie wirklich alle Häkchen zurücksetzen?' : 'Are you sure you want to reset all checklist items?')) {
        this.checklistState = {};
        localStorage.removeItem('annex22_checklists');
        this.renderSidebar();
        this.renderMasterChecklistView(container);
      }
    });
  }

  bindCheckboxes(container) {
    container.querySelectorAll('.gxp-checkbox').forEach(cb => {
      // Sync initial state
      const key = cb.dataset.key;
      if (this.checklistState[key]) {
        cb.checked = true;
        cb.closest('.checklist-item')?.classList.add('completed');
      }

      cb.addEventListener('change', (e) => {
        const itemKey = e.target.dataset.key;
        const checked = e.target.checked;
        const listItem = e.target.closest('.checklist-item');

        if (checked) {
          this.checklistState[itemKey] = true;
          listItem?.classList.add('completed');
          if (listItem) listItem.dataset.status = 'completed';
        } else {
          delete this.checklistState[itemKey];
          listItem?.classList.remove('completed');
          if (listItem) listItem.dataset.status = 'pending';
        }

        localStorage.setItem('annex22_checklists', JSON.stringify(this.checklistState));
        this.renderSidebar();

        // Check if all items in current view are completed
        const viewCheckboxes = container.querySelectorAll('.gxp-checkbox');
        const checkedCount = container.querySelectorAll('.gxp-checkbox:checked').length;
        if (checkedCount === viewCheckboxes.length && viewCheckboxes.length > 0 && checked) {
          confetti({
            particleCount: 100,
            spread: 70,
            origin: { y: 0.6 }
          });
        }
      });
    });
  }

  initMermaidDiagrams() {
    setTimeout(() => {
      try {
        mermaid.run({
          nodes: document.querySelectorAll('pre.mermaid')
        });
      } catch (err) {
        console.warn('Mermaid rendering notice:', err);
      }
    }, 50);
  }

  exportAuditJSON() {
    const report = {
      exportDate: new Date().toISOString(),
      standard: 'EU GMP Annex 22 (AI Compliance)',
      language: this.lang,
      stats: this.getGlobalChecklistStats(),
      items: this.checklistState
    };

    const blob = new Blob([JSON.stringify(report, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `Annex22_Audit_Report_${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
  }

  exportAuditMarkdown() {
    const stats = this.getGlobalChecklistStats();
    let md = `# EU GMP Annex 22 - Compliance Audit Report\n\n`;
    md += `**Date:** ${new Date().toLocaleDateString()}\n`;
    md += `**Compliance Score:** ${stats.percentage}% (${stats.completed}/${stats.total} criteria verified)\n\n`;
    md += `---\n\n`;

    MODULE_REGISTRY.forEach(mod => {
      const raw = getDocContent(mod.id, this.lang);
      if (raw) {
        const { checklists } = parseModuleMarkdown(raw, mod.id, this.lang);
        if (checklists.length > 0) {
          md += `### ${mod.title[this.lang]}\n\n`;
          checklists.forEach(item => {
            const isChecked = !!this.checklistState[item.id];
            md += `- [${isChecked ? 'x' : ' '}] ${item.text}\n`;
          });
          md += `\n`;
        }
      }
    });

    const blob = new Blob([md], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `Annex22_Audit_Report_${new Date().toISOString().slice(0, 10)}.md`;
    a.click();
    URL.revokeObjectURL(url);
  }

  bindEvents() {
    // Mobile Sidebar Toggle
    document.getElementById('mobileMenuBtn')?.addEventListener('click', () => {
      document.getElementById('siteSidebar')?.classList.toggle('mobile-open');
    });

    // Theme Toggle
    document.getElementById('themeToggleBtn')?.addEventListener('click', () => {
      this.toggleTheme();
    });

    // Language Toggle
    document.querySelectorAll('.lang-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        this.setLanguage(e.target.dataset.lang);
      });
    });

    // Route links delegation
    document.addEventListener('click', (e) => {
      const target = e.target.closest('[data-route]');
      if (target) {
        e.preventDefault();
        const route = target.dataset.route;
        this.navigate(route);
      }

      // Handle markdown internal SPA links
      const spaLink = e.target.closest('a[data-module]');
      if (spaLink) {
        e.preventDefault();
        const modId = spaLink.dataset.module;
        this.navigate(modId);
      }
    });

    // Hashchange listener for browser back/forward
    window.addEventListener('hashchange', () => {
      const route = this.getInitialRoute();
      if (route !== this.currentModuleId) {
        this.navigate(route, false);
      }
    });

    // Search modal open/close
    const searchModal = document.getElementById('searchModal');
    const searchInput = document.getElementById('searchInput');

    const openSearch = () => {
      searchModal?.classList.add('open');
      searchInput?.focus();
    };

    const closeSearch = () => {
      searchModal?.classList.remove('open');
      if (searchInput) searchInput.value = '';
      const list = document.getElementById('searchResultsList');
      if (list) list.innerHTML = '';
    };

    document.getElementById('searchTriggerBtn')?.addEventListener('click', openSearch);

    searchModal?.addEventListener('click', (e) => {
      if (e.target === searchModal) closeSearch();
    });

    window.addEventListener('keydown', (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        openSearch();
      }
      if (e.key === 'Escape' && searchModal?.classList.contains('open')) {
        closeSearch();
      }
    });

    // Search input live querying
    searchInput?.addEventListener('input', (e) => {
      const query = e.target.value;
      const results = this.searchEngine.search(query, this.lang);
      const list = document.getElementById('searchResultsList');
      if (!list) return;

      if (results.length === 0) {
        list.innerHTML = `<div style="padding:1.5rem; text-align:center; color:var(--text-faint);">
          ${this.lang === 'de' ? 'Keine Treffer gefunden' : 'No matching results found'}
        </div>`;
        return;
      }

      list.innerHTML = results.map(r => `
        <div class="search-result-item" data-route="${r.moduleId}">
          <div class="search-result-title">
            <span class="nav-item-num" style="margin-right:0.4rem;">${r.moduleNumber}</span>
            ${r.moduleTitle} ➔ ${r.heading}
          </div>
          <div class="search-result-snippet">${r.snippet}</div>
        </div>
      `).join('');

      list.querySelectorAll('.search-result-item').forEach(item => {
        item.addEventListener('click', () => {
          const mod = item.dataset.route;
          this.navigate(mod);
          closeSearch();
        });
      });
    });
  }
}

// Initialize on DOM ready
document.addEventListener('DOMContentLoaded', () => {
  new Annex22App();
});
