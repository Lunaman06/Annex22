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
    let storedTheme = localStorage.getItem('annex22_theme') || 'neutral';
    if (storedTheme === 'dark') {
      storedTheme = 'neutral';
      localStorage.setItem('annex22_theme', 'neutral');
    }
    this.theme = storedTheme;
    this.currentModuleId = this.getInitialRoute();
    this.checklistState = JSON.parse(localStorage.getItem('annex22_checklists') || '{}');
    this.searchEngine = new SearchEngine();

    // Diagram Modal Pan & Zoom State
    this.diagZoom = 1.0;
    this.diagPan = { x: 0, y: 0 };
    this.isPanningDiag = false;
    this.panStart = { x: 0, y: 0 };

    // Simulator State
    this.initSimulatorState();

    this.initTheme();
    this.initMermaid();
    this.renderShell();
    this.initDiagramModal();
    this.bindEvents();
    this.navigate(this.currentModuleId, false);
  }

  initSimulatorState() {
    this.simState = {
      step: 1, // 1: Idea & Intended Use, 2: Technical Guardrails, 3: Validation Blueprint
      mode: 'cards', // 'cards' | 'chat'
      projectName: '',
      intendedUse: '',
      processArea: 'batch_release',
      modelType: 'predictive_ml',
      learningType: 'static',
      autonomyLevel: 'hitl',
      dataSource: 'internal_gxp',
      apiKey: localStorage.getItem('gemini_api_key') || '',
      modelChoice: 'gemma-27b',
      isEvaluating: false,
      blueprint: null,
      chatMessages: [
        {
          sender: 'auditor',
          text: this.lang === 'de'
            ? 'Willkommen bei **22Annex.ai**! Ich bin dein regulatorischer Co-Auditor für den EU GMP Annex 22.\n\nErzähle mir kurz: Welches pharmazeutische KI-Projekt planst du und welchen Prozess soll das System unterstützen?'
            : 'Welcome to **22Annex.ai**! I am your regulatory co-auditor for EU GMP Annex 22.\n\nTell me briefly: What pharmaceutical AI project are you planning and which process should it support?',
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }
      ]
    };
  }

  getInitialRoute() {
    const hash = window.location.hash.replace('#', '');
    if (hash === 'checklist_master') return 'checklist_master';
    if (hash === 'simulator') return 'simulator';
    const found = MODULE_REGISTRY.find(m => m.id === hash);
    return found ? found.id : '00_overview';
  }

  initTheme() {
    document.documentElement.setAttribute('data-theme', this.theme);
  }

  setTheme(themeId) {
    this.theme = themeId;
    localStorage.setItem('annex22_theme', this.theme);
    this.initTheme();
    this.initMermaid();

    document.querySelectorAll('.theme-option-item').forEach(btn => {
      btn.classList.toggle('active', btn.dataset.setTheme === themeId);
    });

    const wrap = document.getElementById('themePickerWrap');
    wrap?.classList.remove('open');
    document.getElementById('themeTriggerBtn')?.setAttribute('aria-expanded', 'false');

    this.renderContent();
  }

  getMermaidThemeVariables(theme) {
    if (theme === 'light') {
      return {
        darkMode: false,
        background: '#ffffff',
        primaryColor: '#f1f5f9',
        primaryTextColor: '#0f172a',
        primaryBorderColor: '#4f46e5',
        lineColor: '#0284c7',
        secondaryColor: '#f8fafc',
        tertiaryColor: '#e2e8f0',
        fontFamily: 'Inter, Outfit, sans-serif',
        fontSize: '15px',
        mainBkg: '#ffffff',
        nodeBorder: '#6366f1',
        clusterBkg: '#f8fafc',
        clusterBorder: '#cbd5e1'
      };
    }

    if (theme === 'slate') {
      return {
        darkMode: true,
        background: '#181b22',
        primaryColor: '#222630',
        primaryTextColor: '#ffffff',
        primaryBorderColor: '#6366f1',
        lineColor: '#38bdf8',
        secondaryColor: '#1d212a',
        tertiaryColor: '#0f1217',
        fontFamily: 'Inter, Outfit, sans-serif',
        fontSize: '15px',
        mainBkg: '#222630',
        nodeBorder: '#818cf8',
        clusterBkg: '#12151b',
        clusterBorder: '#334155'
      };
    }

    if (theme === 'midnight') {
      return {
        darkMode: true,
        background: '#101624',
        primaryColor: '#1e293b',
        primaryTextColor: '#f8fafc',
        primaryBorderColor: '#6366f1',
        lineColor: '#38bdf8',
        secondaryColor: '#182235',
        tertiaryColor: '#0f172a',
        fontFamily: 'Inter, Outfit, sans-serif',
        fontSize: '15px',
        mainBkg: '#1e293b',
        nodeBorder: '#818cf8',
        clusterBkg: '#0b1120',
        clusterBorder: '#334155'
      };
    }

    if (theme === 'oled') {
      return {
        darkMode: true,
        background: '#0e0e11',
        primaryColor: '#18181c',
        primaryTextColor: '#ffffff',
        primaryBorderColor: '#818cf8',
        lineColor: '#38bdf8',
        secondaryColor: '#141418',
        tertiaryColor: '#000000',
        fontFamily: 'Inter, Outfit, sans-serif',
        fontSize: '15px',
        mainBkg: '#18181c',
        nodeBorder: '#818cf8',
        clusterBkg: '#050505',
        clusterBorder: '#27272a'
      };
    }

    // Default: 'neutral' (Clean Zinc / Charcoal Gray)
    return {
      darkMode: true,
      background: '#2d313b',
      primaryColor: '#373c47',
      primaryTextColor: '#ffffff',
      primaryBorderColor: '#6366f1',
      lineColor: '#38bdf8',
      secondaryColor: '#2b2e37',
      tertiaryColor: '#24272e',
      fontFamily: 'Inter, Outfit, sans-serif',
      fontSize: '15px',
      mainBkg: '#373c47',
      nodeBorder: '#818cf8',
      clusterBkg: '#24272e',
      clusterBorder: '#4a505e'
    };
  }

  initMermaid() {
    mermaid.initialize({
      startOnLoad: false,
      theme: 'base',
      themeVariables: this.getMermaidThemeVariables(this.theme),
      flowchart: {
        htmlLabels: true,
        curve: 'basis',
        rankSpacing: 60,
        nodeSpacing: 45,
        padding: 20
      },
      sequence: {
        diagramMarginX: 50,
        diagramMarginY: 30,
        actorMargin: 50,
        width: 150,
        height: 65,
        boxMargin: 10,
        boxTextMargin: 5,
        noteMargin: 10,
        messageMargin: 35
      }
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
          <button class="header-btn primary" id="simulatorNavBtn" data-route="simulator">
            <i data-lucide="flask-conical"></i>
            <span>${this.lang === 'de' ? 'AI Project Simulator' : 'AI Project Simulator'}</span>
          </button>

          <button class="header-btn" id="masterChecklistBtn" data-route="checklist_master">
            <i data-lucide="clipboard-check"></i>
            <span>${this.lang === 'de' ? 'Lern-Checklisten' : 'Study Checklists'}</span>
          </button>

          <div class="lang-switch">
            <button class="lang-btn ${this.lang === 'de' ? 'active' : ''}" data-lang="de">🇩🇪 DE</button>
            <button class="lang-btn ${this.lang === 'en' ? 'active' : ''}" data-lang="en">🇬🇧 EN</button>
          </div>

          <div class="theme-picker-wrap" id="themePickerWrap">
            <button class="theme-btn" id="themeTriggerBtn" aria-label="${this.lang === 'de' ? 'Farbschema wählen' : 'Select color theme'}" title="${this.lang === 'de' ? 'Farbschema wählen' : 'Select color theme'}" aria-haspopup="true" aria-expanded="false">
              <i data-lucide="palette"></i>
            </button>

            <div class="theme-dropdown-menu" id="themeDropdownMenu">
              <div class="theme-dropdown-header">
                <span>${this.lang === 'de' ? 'Farbschema' : 'Color Theme'}</span>
              </div>
              <div class="theme-options-list">
                <button class="theme-option-item ${this.theme === 'neutral' ? 'active' : ''}" data-set-theme="neutral">
                  <span class="theme-swatch neutral"></span>
                  <div class="theme-info">
                    <div class="theme-name">${this.lang === 'de' ? 'Neutral Grau (Zinc)' : 'Neutral Gray (Zinc)'}</div>
                    <div class="theme-desc">${this.lang === 'de' ? 'Elegante Graustufen & weißer Text' : 'Refined matte grays & white text'}</div>
                  </div>
                  <i data-lucide="check" class="theme-check-icon"></i>
                </button>

                <button class="theme-option-item ${this.theme === 'slate' ? 'active' : ''}" data-set-theme="slate">
                  <span class="theme-swatch slate"></span>
                  <div class="theme-info">
                    <div class="theme-name">${this.lang === 'de' ? 'Schiefergrau (Slate)' : 'Slate Gray'}</div>
                    <div class="theme-desc">${this.lang === 'de' ? 'Kühles Anthrazit mit Stahl-Nuancen' : 'Cool steel-tinted charcoal'}</div>
                  </div>
                  <i data-lucide="check" class="theme-check-icon"></i>
                </button>

                <button class="theme-option-item ${this.theme === 'midnight' ? 'active' : ''}" data-set-theme="midnight">
                  <span class="theme-swatch midnight"></span>
                  <div class="theme-info">
                    <div class="theme-name">${this.lang === 'de' ? 'Midnight Blau' : 'Midnight Blue'}</div>
                    <div class="theme-desc">${this.lang === 'de' ? 'Cyber-Pharma Dunkelblau' : 'Classic cyber navy'}</div>
                  </div>
                  <i data-lucide="check" class="theme-check-icon"></i>
                </button>

                <button class="theme-option-item ${this.theme === 'oled' ? 'active' : ''}" data-set-theme="oled">
                  <span class="theme-swatch oled"></span>
                  <div class="theme-info">
                    <div class="theme-name">${this.lang === 'de' ? 'OLED Tiefschwarz' : 'OLED Pitch Black'}</div>
                    <div class="theme-desc">${this.lang === 'de' ? 'Reines Schwarz & maximaler Kontrast' : 'True pitch black & high contrast'}</div>
                  </div>
                  <i data-lucide="check" class="theme-check-icon"></i>
                </button>

                <button class="theme-option-item ${this.theme === 'light' ? 'active' : ''}" data-set-theme="light">
                  <span class="theme-swatch light"></span>
                  <div class="theme-info">
                    <div class="theme-name">${this.lang === 'de' ? 'Klar & Hell' : 'Daylight Mode'}</div>
                    <div class="theme-desc">${this.lang === 'de' ? 'Tageslicht & reduzierter Kontrast' : 'Clean pharmaceutical daylight'}</div>
                  </div>
                  <i data-lucide="check" class="theme-check-icon"></i>
                </button>
              </div>
            </div>
          </div>
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

      <!-- Fullscreen Diagram Lightbox Modal -->
      <!-- Fullscreen Diagram Lightbox Modal -->
      <div class="diagram-modal-backdrop" id="diagramModal">
        <div class="diagram-modal-toolbar">
          <div class="diagram-modal-title">
            <i data-lucide="git-branch"></i>
            <span id="diagramModalTitle">${this.lang === 'de' ? 'Prozess- & Architektur-Diagramm' : 'Process & Architecture Diagram'}</span>
          </div>
          <div class="diagram-modal-controls">
            <button class="diagram-ctrl-btn" id="diagZoomOutBtn" title="${this.lang === 'de' ? 'Verkleinern (−)' : 'Zoom Out (−)'}">
              <i data-lucide="minus"></i>
              <span>−</span>
            </button>
            <span class="diagram-zoom-level" id="diagZoomLevel">100%</span>
            <button class="diagram-ctrl-btn" id="diagZoomInBtn" title="${this.lang === 'de' ? 'Vergrößern (+)' : 'Zoom In (+)'}">
              <i data-lucide="plus"></i>
              <span>+</span>
            </button>
            <button class="diagram-ctrl-btn" id="diagFitBtn" title="${this.lang === 'de' ? 'Einpassen' : 'Fit to Screen'}">
              <i data-lucide="maximize-2"></i>
              <span>${this.lang === 'de' ? 'Einpassen' : 'Fit'}</span>
            </button>
            <button class="diagram-ctrl-btn" id="diagResetBtn" title="${this.lang === 'de' ? '100% Originalgröße' : '100% Scale'}">
              <span>100%</span>
            </button>
            <button class="diagram-ctrl-btn close-btn" id="diagCloseBtn" title="${this.lang === 'de' ? 'Schließen (Esc)' : 'Close (Esc)'}">
              <i data-lucide="x"></i>
              <span>${this.lang === 'de' ? 'Schließen' : 'Close'}</span>
            </button>
          </div>
        </div>
        <div class="diagram-modal-canvas" id="diagramCanvas">
          <div class="diagram-modal-content" id="diagramContent"></div>
        </div>
      </div>
    `;

    createIcons({ icons });
    this.renderSidebar();
  }

  initDiagramModal() {
    const modal = document.getElementById('diagramModal');
    const content = document.getElementById('diagramContent');
    const canvas = document.getElementById('diagramCanvas');
    const zoomLevelEl = document.getElementById('diagZoomLevel');

    const updateTransform = () => {
      if (!content) return;
      content.style.transform = `translate(${this.diagPan.x}px, ${this.diagPan.y}px) scale(${this.diagZoom})`;
      if (zoomLevelEl) zoomLevelEl.textContent = `${Math.round(this.diagZoom * 100)}%`;
    };

    const fitToScreen = () => {
      this.diagZoom = this.initialFitZoom || 1.0;
      this.diagPan = { x: 0, y: 0 };
      updateTransform();
    };

    const resetToOriginal = () => {
      this.diagZoom = 1.0;
      this.diagPan = { x: 0, y: 0 };
      updateTransform();
    };

    document.getElementById('diagZoomInBtn')?.addEventListener('click', (e) => {
      e.stopPropagation();
      this.diagZoom = Math.min(4.0, +(this.diagZoom + 0.25).toFixed(2));
      updateTransform();
    });

    document.getElementById('diagZoomOutBtn')?.addEventListener('click', (e) => {
      e.stopPropagation();
      this.diagZoom = Math.max(0.35, +(this.diagZoom - 0.25).toFixed(2));
      updateTransform();
    });

    document.getElementById('diagFitBtn')?.addEventListener('click', (e) => {
      e.stopPropagation();
      fitToScreen();
    });

    document.getElementById('diagResetBtn')?.addEventListener('click', (e) => {
      e.stopPropagation();
      resetToOriginal();
    });

    const closeModal = () => {
      modal?.classList.remove('open');
      if (content) content.innerHTML = '';
      this.diagZoom = 1.0;
      this.diagPan = { x: 0, y: 0 };
      this.isPanningDiag = false;
      this.hasDraggedDiag = false;
    };

    document.getElementById('diagCloseBtn')?.addEventListener('click', (e) => {
      e.stopPropagation();
      closeModal();
    });

    // Close only when clicking directly on canvas AND user was not dragging/panning
    canvas?.addEventListener('click', (e) => {
      if (this.hasDraggedDiag) {
        this.hasDraggedDiag = false;
        return;
      }
      if (e.target === canvas) {
        closeModal();
      }
    });

    window.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && modal?.classList.contains('open')) {
        closeModal();
      }
    });

    // Wheel zoom
    canvas?.addEventListener('wheel', (e) => {
      e.preventDefault();
      const zoomFactor = e.deltaY < 0 ? 1.15 : 0.87;
      this.diagZoom = Math.min(4.0, Math.max(0.35, +(this.diagZoom * zoomFactor).toFixed(2)));
      updateTransform();
    }, { passive: false });

    // Drag / Pan logic
    canvas?.addEventListener('mousedown', (e) => {
      if (e.button !== 0) return;
      this.isPanningDiag = true;
      this.hasDraggedDiag = false;
      this.panStart = { x: e.clientX - this.diagPan.x, y: e.clientY - this.diagPan.y };
      canvas.classList.add('panning');
    });

    window.addEventListener('mousemove', (e) => {
      if (!this.isPanningDiag) return;
      const newX = e.clientX - this.panStart.x;
      const newY = e.clientY - this.panStart.y;
      if (Math.abs(newX - this.diagPan.x) > 3 || Math.abs(newY - this.diagPan.y) > 3) {
        this.hasDraggedDiag = true;
      }
      this.diagPan.x = newX;
      this.diagPan.y = newY;
      updateTransform();
    });

    window.addEventListener('mouseup', () => {
      if (this.isPanningDiag) {
        this.isPanningDiag = false;
        canvas?.classList.remove('panning');
      }
    });
  }

  openDiagramModal(svgElement, title) {
    const modal = document.getElementById('diagramModal');
    const content = document.getElementById('diagramContent');
    const titleEl = document.getElementById('diagramModalTitle');
    const canvas = document.getElementById('diagramCanvas');
    if (!modal || !content || !svgElement) return;

    if (title && titleEl) {
      titleEl.textContent = title;
    }

    content.innerHTML = '';
    const clonedSvg = svgElement.cloneNode(true);

    // Extract natural viewBox dimensions
    const viewBoxAttr = svgElement.getAttribute('viewBox');
    let vbWidth = 1000;
    let vbHeight = 600;
    if (viewBoxAttr) {
      const parts = viewBoxAttr.split(/[\s,]+/).map(Number);
      if (parts.length === 4 && parts[2] > 0 && parts[3] > 0) {
        vbWidth = parts[2];
        vbHeight = parts[3];
      }
    }

    // Set cloned SVG to display at clear resolution
    clonedSvg.removeAttribute('width');
    clonedSvg.removeAttribute('height');
    clonedSvg.removeAttribute('style');
    clonedSvg.setAttribute('viewBox', viewBoxAttr || `0 0 ${vbWidth} ${vbHeight}`);

    const baseRenderWidth = Math.min(Math.max(vbWidth * 1.1, 750), 1500);
    clonedSvg.style.width = `${baseRenderWidth}px`;
    clonedSvg.style.height = 'auto';
    clonedSvg.style.display = 'block';

    content.appendChild(clonedSvg);
    this.fixDiagramContrast(clonedSvg);

    // Calculate smart initial fit for user's screen
    const canvasRect = canvas ? canvas.getBoundingClientRect() : { width: window.innerWidth, height: window.innerHeight - 64 };
    const availWidth = (canvasRect.width || window.innerWidth) * 0.85;
    const availHeight = (canvasRect.height || (window.innerHeight - 64)) * 0.78;
    const baseRenderHeight = (baseRenderWidth * vbHeight) / vbWidth;

    const scaleX = availWidth / baseRenderWidth;
    const scaleY = availHeight / baseRenderHeight;
    const initialFit = Math.min(scaleX, scaleY, 1.05);

    this.diagZoom = Math.max(0.35, +initialFit.toFixed(2));
    this.initialFitZoom = this.diagZoom;
    this.diagPan = { x: 0, y: 0 };
    this.hasDraggedDiag = false;

    content.style.transform = `translate(0px, 0px) scale(${this.diagZoom})`;
    const zoomLevelEl = document.getElementById('diagZoomLevel');
    if (zoomLevelEl) zoomLevelEl.textContent = `${Math.round(this.diagZoom * 100)}%`;

    modal.classList.add('open');
  }

  renderSidebar() {
    const sidebarEl = document.getElementById('siteSidebar');
    if (!sidebarEl) return;

    const stats = this.getGlobalChecklistStats();

    let navHtml = `
      <!-- Simulator Link Card -->
      <div class="sidebar-progress-card" style="border-left:3px solid var(--brand-cyan);">
        <div class="progress-header">
          <span class="progress-title">${this.lang === 'de' ? 'AI Project Simulator' : 'AI Project Simulator'}</span>
          <span class="nav-item-badge" style="background:var(--brand-cyan-glow); color:var(--brand-cyan); font-weight:700;">NEU / BETA</span>
        </div>
        <p style="font-size:0.775rem; color:var(--text-muted); line-height:1.4;">
          ${this.lang === 'de' ? 'Spiele deine Projekt-Idee durch und generiere einen Validierungs-Blueprint.' : 'Simulate your AI project idea and generate a customized validation blueprint.'}
        </p>
        <button class="header-btn primary" style="width:100%; justify-content:center; padding:0.4rem;" data-route="simulator">
          <i data-lucide="flask-conical"></i>
          <span>${this.lang === 'de' ? 'Simulator starten ➔' : 'Start Simulator ➔'}</span>
        </button>
      </div>

      <!-- Global Compliance Progress Card -->
      <div class="sidebar-progress-card">
        <div class="progress-header">
          <span class="progress-title">${this.lang === 'de' ? 'Lernkontroll-Status' : 'Study Progress'}</span>
          <span class="progress-percentage">${stats.percentage}%</span>
        </div>
        <div class="progress-bar-bg">
          <div class="progress-bar-fill" style="width: ${stats.percentage}%;"></div>
        </div>
        <div class="progress-subtext">
          <span>${stats.completed}/${stats.total} ${this.lang === 'de' ? 'Fragen gelernt' : 'items studied'}</span>
          <a href="#checklist_master" data-route="checklist_master" class="spa-link" style="font-size:0.75rem;">${this.lang === 'de' ? 'Alle anzeigen ➔' : 'View all ➔'}</a>
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

    PHASES.forEach(phase => {
      navHtml += `<div class="nav-group">
        <div class="nav-group-title">${phase.title[this.lang]}</div>`;

      phase.modules.forEach(modId => {
        const mod = MODULE_REGISTRY.find(m => m.id === modId);
        if (!mod) return;
        const isActive = this.currentModuleId === mod.id;
        const rawTitle = mod.title[this.lang] || mod.title.de || '';
        const cleanTitle = rawTitle.replace(/^(Modul|Module|Anhang|Appendix)\s*(\d+|A\d+)?:?\s*/i, '');
        const rawBadge = mod.badge[this.lang] || mod.badge.de || '';
        const cleanBadge = rawBadge
          .replace(/^Phase \d+:\s*/i, '')
          .replace(/^(Spezial-Guide|Special Guide)$/i, 'Guide');

        navHtml += `
          <a href="#${mod.id}" class="nav-item ${isActive ? 'active' : ''}" data-route="${mod.id}" title="${rawTitle}">
            <span class="nav-item-num">${mod.number}</span>
            <span class="nav-item-title">${cleanTitle}</span>
            <span class="nav-item-badge">${cleanBadge}</span>
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

    document.getElementById('siteSidebar')?.classList.remove('mobile-open');

    document.querySelectorAll('.nav-item').forEach(el => {
      el.classList.toggle('active', el.dataset.route === moduleId);
    });

    this.renderContent();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  renderContent() {
    const wrapper = document.getElementById('contentWrapper');
    if (!wrapper) return;

    if (this.currentModuleId === 'simulator') {
      this.renderSimulatorView(wrapper);
      return;
    }

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

    const hasToc = parsed.toc && parsed.toc.length > 0;
    const tocHtml = hasToc ? `
      <aside class="doc-toc-column">
        <div class="doc-toc-card">
          <div class="toc-header">
            <i data-lucide="list"></i>
            <span>${this.lang === 'de' ? 'Auf dieser Seite' : 'On this page'}</span>
          </div>
          <nav class="toc-nav">
            ${parsed.toc.map(item => `
              <a href="#${item.id}" class="toc-link depth-${item.depth}" data-toc-id="${item.id}">
                ${item.text}
              </a>
            `).join('')}
          </nav>
        </div>
      </aside>
    ` : '';

    container.innerHTML = `
      <!-- Hero Banner -->
      <div class="hero-banner" style="margin-bottom:2rem;">
        <div class="hero-tag">
          <i data-lucide="shield-check"></i>
          <span>${this.lang === 'de' ? 'Offizieller Draft 2026/2027 • Annex 11 Durchsetzung' : 'Official Draft 2026/2027 • Annex 11 Enforcement'}</span>
        </div>
        <h1 class="hero-title">${this.lang === 'de' ? 'EU GMP Annex 22: Künstliche Intelligenz in der Pharma-Produktion' : 'EU GMP Annex 22: Artificial Intelligence in GxP Manufacturing'}</h1>
        <p class="hero-subtitle">${this.lang === 'de' ? 'Das interaktive Wissens- und Compliance-Portal für regulatorische Sicherheit, MLOps-Validierung und Inspektionsbereitschaft.' : 'The interactive compliance and learning portal for regulatory rigor, MLOps validation, and audit readiness.'}</p>

        <div style="display:flex; gap:1rem; flex-wrap:wrap;">
          <button class="header-btn primary" style="font-size:0.95rem; padding:0.65rem 1.25rem;" data-route="module_01_introduction_ai_gxp">
            <i data-lucide="book-open"></i>
            <span>${this.lang === 'de' ? 'Mit Modul 01 starten' : 'Start with Module 01'}</span>
          </button>
          <button class="header-btn" style="font-size:0.95rem; padding:0.65rem 1.25rem;" data-route="simulator">
            <i data-lucide="flask-conical"></i>
            <span>${this.lang === 'de' ? '🧪 KI-Projekt simulieren' : '🧪 Simulate AI Project'}</span>
          </button>
        </div>
      </div>

      <div class="module-layout-grid ${hasToc ? 'has-toc' : 'no-toc'}">
        <div class="module-content-pane">
          <!-- Interactive AI Lifecycle Navigator -->
          <div class="lifecycle-section" style="margin-bottom:2.25rem;">
            <div class="section-title-wrap">
              <div>
                <h2 class="section-title">${this.lang === 'de' ? '🧭 Der pharmazeutische KI-Lebenszyklus' : '🧭 The Pharmaceutical AI Lifecycle'}</h2>
                <p class="section-desc">${this.lang === 'de' ? 'Direkteinstieg in die 6 Lebenszyklus-Phasen und Fachmodule:' : 'Direct entry into the 6 lifecycle phases and core modules:'}</p>
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

          <!-- Main Overview Content -->
          <div class="markdown-body">
            ${parsed.html}
          </div>
        </div>

        ${tocHtml}
      </div>
    `;

    createIcons({ icons });
    this.initMermaidDiagrams();
    this.bindCheckboxes(container);
    if (hasToc) {
      this.initTocObserver(container);
    }
  }

  renderModuleView(container, moduleId) {
    const mod = MODULE_REGISTRY.find(m => m.id === moduleId);
    if (!mod) return;

    const raw = getDocContent(moduleId, this.lang);
    const parsed = parseModuleMarkdown(raw, moduleId, this.lang);

    const currentIndex = MODULE_REGISTRY.findIndex(m => m.id === moduleId);
    const prevMod = currentIndex > 0 ? MODULE_REGISTRY[currentIndex - 1] : null;
    const nextMod = currentIndex < MODULE_REGISTRY.length - 1 ? MODULE_REGISTRY[currentIndex + 1] : null;

    const hasToc = parsed.toc && parsed.toc.length > 0;
    const tocHtml = hasToc ? `
      <aside class="doc-toc-column">
        <div class="doc-toc-card">
          <div class="toc-header">
            <i data-lucide="list"></i>
            <span>${this.lang === 'de' ? 'Auf dieser Seite' : 'On this page'}</span>
          </div>
          <nav class="toc-nav">
            ${parsed.toc.map(item => `
              <a href="#${item.id}" class="toc-link depth-${item.depth}" data-toc-id="${item.id}">
                ${item.text}
              </a>
            `).join('')}
          </nav>
        </div>
      </aside>
    ` : '';

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

      <div class="module-layout-grid ${hasToc ? 'has-toc' : 'no-toc'}">
        <div class="module-content-pane">
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
        </div>

        ${tocHtml}
      </div>
    `;

    createIcons({ icons });
    this.initMermaidDiagrams();
    this.bindCheckboxes(container);
    if (hasToc) {
      this.initTocObserver(container);
    }

    document.getElementById('printModuleBtn')?.addEventListener('click', () => {
      window.print();
    });
  }

  initTocObserver(container) {
    const tocLinks = container.querySelectorAll('.toc-link');
    if (!tocLinks.length) return;

    tocLinks.forEach(link => {
      link.addEventListener('click', (e) => {
        e.preventDefault();
        const targetId = link.getAttribute('data-toc-id');
        const targetEl = document.getElementById(targetId);
        if (targetEl) {
          targetEl.scrollIntoView({ behavior: 'smooth', block: 'start' });
          tocLinks.forEach(l => l.classList.remove('active'));
          link.classList.add('active');
        }
      });
    });

    const headings = container.querySelectorAll('.doc-heading');
    if (!headings.length || !('IntersectionObserver' in window)) return;

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const id = entry.target.id;
          tocLinks.forEach(l => {
            const matches = l.getAttribute('data-toc-id') === id;
            l.classList.toggle('active', matches);
          });
        }
      });
    }, {
      rootMargin: '-80px 0px -70% 0px'
    });

    headings.forEach(h => observer.observe(h));
  }

  renderSimulatorView(container) {
    const s = this.simState;

    container.innerHTML = `
      <div class="simulator-view">
        <div class="module-header">
          <div class="module-meta-bar">
            <span class="module-phase-badge" style="background:var(--brand-cyan-glow); color:var(--brand-cyan); border-color:var(--brand-cyan);">
              ${this.lang === 'de' ? '🧪 22Annex.ai Simulator & Co-Auditor' : '🧪 22Annex.ai Simulator & Co-Auditor'}
            </span>
            <div class="checklist-action-btns">
              ${s.step === 3 ? `
                <button class="header-btn" id="simNewRunBtn">
                  <i data-lucide="rotate-ccw"></i>
                  <span>${this.lang === 'de' ? 'Neue Simulation' : 'New Simulation'}</span>
                </button>
                <button class="header-btn primary" id="simExportReportBtn">
                  <i data-lucide="download"></i>
                  <span>${this.lang === 'de' ? 'Blueprint herunterladen' : 'Download Blueprint'}</span>
                </button>
              ` : ''}
            </div>
          </div>
          <h1 class="module-main-title">${this.lang === 'de' ? 'AI Project & Qualification Simulator' : 'AI Project & Qualification Simulator'}</h1>
          <p class="module-subtitle">
            ${this.lang === 'de' 
              ? 'Spiele dein KI-Projekt durch: Definiere Intended Use & Technologie, identifiziere regulatorische Stolpersteine und erhalte einen maßgeschneiderten Annex 22 Validierungs-Blueprint.' 
              : 'Test your AI project idea: Define intended use & architecture, identify compliance pitfalls, and receive a tailored Annex 22 validation blueprint.'}
          </p>
        </div>

        <!-- Stepper Navigation -->
        <div class="simulator-stepper">
          <div class="sim-step-item ${s.step === 1 ? 'active' : ''} ${s.step > 1 ? 'completed' : ''}">
            <div class="sim-step-number">${s.step > 1 ? '✓' : '1'}</div>
            <div class="sim-step-title">${this.lang === 'de' ? 'Schritt 1: Projekt-Idee & Intended Use' : 'Step 1: Idea & Intended Use'}</div>
          </div>
          <div class="sim-step-line"></div>
          <div class="sim-step-item ${s.step === 2 ? 'active' : ''} ${s.step > 2 ? 'completed' : ''}">
            <div class="sim-step-number">${s.step > 2 ? '✓' : '2'}</div>
            <div class="sim-step-title">${this.lang === 'de' ? 'Schritt 2: Architektonische Leitplanken' : 'Step 2: Technical Guardrails'}</div>
          </div>
          <div class="sim-step-line"></div>
          <div class="sim-step-item ${s.step === 3 ? 'active' : ''}">
            <div class="sim-step-number">3</div>
            <div class="sim-step-title">${this.lang === 'de' ? 'Schritt 3: Validierungs-Blueprint' : 'Step 3: Validation Blueprint'}</div>
          </div>
        </div>

        <!-- Dual-Mode Toggle Bar (Active during Step 1 & 2) -->
        ${s.step < 3 ? `
          <div class="sim-mode-toggle-bar">
            <div class="sim-mode-toggle-group">
              <button class="sim-mode-btn ${s.mode === 'cards' ? 'active' : ''}" id="simModeCardsBtn" data-sim-mode="cards">
                <i data-lucide="layout-grid"></i>
                <span>${this.lang === 'de' ? '📋 Geführte Frage-Karten' : '📋 Guided Question Cards'}</span>
              </button>
              <button class="sim-mode-btn ${s.mode === 'chat' ? 'active' : ''}" id="simModeChatBtn" data-sim-mode="chat">
                <i data-lucide="message-square"></i>
                <span>${this.lang === 'de' ? '💬 Dialog Co-Auditor' : '💬 Dialogue Co-Auditor'}</span>
              </button>
            </div>
            <div class="sim-mode-hint">
              ${s.mode === 'cards' 
                ? (this.lang === 'de' ? 'Strukturierter Kriterienkatalog mit Auswahlfeldern' : 'Structured branching criteria catalog') 
                : (this.lang === 'de' ? 'Interaktives Sparring-Gespräch mit Live-Compliance-Inspektor' : 'Interactive audit interview with live compliance inspector')}
            </div>
          </div>
        ` : ''}

        <!-- Dynamic Step or Chat Content -->
        ${s.step === 3 
          ? this.renderSimStep3() 
          : (s.mode === 'chat' 
              ? this.renderSimChatView() 
              : (s.step === 1 ? this.renderSimStep1() : this.renderSimStep2())
            )
        }
      </div>
    `;

    createIcons({ icons });
    this.bindSimulatorEvents(container);
  }

  formatChatMarkdown(text) {
    if (!text) return '';
    return text
      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
      .replace(/\*(.*?)\*/g, '<em>$1</em>')
      .replace(/\n/g, '<br/>');
  }

  calculateLiveScore() {
    const s = this.simState;
    let score = 100;
    const penalties = [];
    const flags = [];

    if (s.learningType === 'dynamic') {
      score -= 35;
      penalties.push({
        label: this.lang === 'de' ? 'Dynamisches Selbstlernen im GMP-Betrieb' : 'Dynamic self-learning in GMP',
        deduction: -35,
        citation: '[Draft §1]'
      });
      flags.push({
        title: this.lang === 'de' ? 'Kritisches Finding: Dynamisches Selbstlernen' : 'Critical Finding: Dynamic Continuous Learning',
        ref: 'EU GMP Annex 22 [Draft §1]',
        desc: this.lang === 'de' 
          ? 'Kontinuierliches Nachtrainieren im GMP-Routinebetrieb ist nicht zulässig („should not be used“). Es drohen unkontrollierter Modell-Drift und Verlust des validierten Zustands. Lösung: Frozen Weights mit kontrolliertem Offline-Retraining unter Change Control.'
          : 'Continuous self-learning in GMP routine operation is not permitted. Risk of uncontrolled drift and invalid state. Remediation: Frozen weights with offline retraining under change control.'
      });
    }

    if (s.autonomyLevel === 'hool' && (s.processArea === 'batch_release' || s.processArea === 'in_process')) {
      score -= 30;
      penalties.push({
        label: this.lang === 'de' ? 'Vollautonomie bei qualitätskritischer Freigabe' : 'Full autonomy on critical release',
        deduction: -30,
        citation: '[Draft §3, §9.2]'
      });
      flags.push({
        title: this.lang === 'de' ? 'Kritisches Finding: Unzulässige Vollautonomie (HOOL)' : 'Critical Finding: Unsupervised Autonomy (HOOL)',
        ref: 'EU GMP Annex 22 [Draft §3, §9.2] & Art. 51 2001/83/EG',
        desc: this.lang === 'de'
          ? 'Qualitätskritische Entscheidungen und Chargenfreigaben dürfen nicht vollständig an KI delegiert werden. Ein Human-in-the-Loop mit dokumentierter Override-Befugnis ist zwingend erforderlich.'
          : 'Quality-critical decisions and batch release must not be fully delegated to AI without qualified human oversight.'
      });
    }

    if (s.dataSource === 'public_cloud') {
      score -= 15;
      penalties.push({
        label: this.lang === 'de' ? 'Unverifizierte Public Cloud Daten / IP-Risiko' : 'Public cloud / unverified data source',
        deduction: -15,
        citation: '[Draft §5, §6]'
      });
    }

    if (s.modelType === 'genai_rag') {
      score -= 10;
      penalties.push({
        label: this.lang === 'de' ? 'GenAI Stochastik & Halluzinationsrisiko' : 'GenAI stochasticity & hallucination risk',
        deduction: -10,
        citation: '[Draft §8, GAMP Guide 2025]'
      });
    }

    score = Math.max(10, Math.min(100, score));
    return { score, penalties, flags };
  }

  renderSimChatView() {
    const s = this.simState;
    const { score, penalties, flags } = this.calculateLiveScore();

    const scoreColor = score >= 80 ? 'var(--brand-emerald)' : (score >= 50 ? 'var(--brand-amber)' : 'var(--brand-rose)');
    const scoreRating = score >= 80 
      ? (this.lang === 'de' ? '🟢 Hohe Validierungsreife' : '🟢 High Validation Readiness')
      : (score >= 50 
          ? (this.lang === 'de' ? '🟡 Konditionell qualifizierbar' : '🟡 Conditional / Gaps Present')
          : (this.lang === 'de' ? '🔴 Kritische Risiken / Showstopper' : '🔴 Critical Risks / Showstoppers'));

    return `
      <div class="sim-chat-layout">
        <!-- Chat Column -->
        <div class="sim-chat-card">
          <div class="sim-chat-header">
            <div style="display:flex; align-items:center; gap:0.6rem;">
              <div class="sim-chat-avatar" style="background:var(--brand-primary-glow); color:var(--brand-cyan); border:1px solid var(--brand-cyan);">
                <i data-lucide="bot"></i>
              </div>
              <div>
                <div style="font-weight:700; font-size:0.95rem; color:var(--text-main);">22Annex.ai Co-Auditor</div>
                <div style="font-size:0.75rem; color:var(--text-muted); font-family:var(--font-mono);">EU GMP Annex 22 Sparring-Partner</div>
              </div>
            </div>
            <div class="sim-chat-status">
              <span class="sim-chat-status-dot"></span>
              <span>${this.lang === 'de' ? 'Online • Aktiv' : 'Online • Active'}</span>
            </div>
          </div>

          <div class="sim-chat-messages" id="simChatMsgContainer">
            ${s.chatMessages.map(msg => `
              <div class="sim-chat-msg ${msg.sender}">
                <div class="sim-chat-avatar">
                  ${msg.sender === 'auditor' ? '🤖' : '👤'}
                </div>
                <div class="sim-chat-bubble">
                  ${this.formatChatMarkdown(msg.text)}
                  <div style="font-size:0.65rem; opacity:0.6; margin-top:0.35rem; text-align:right;">${msg.time || ''}</div>
                </div>
              </div>
            `).join('')}
          </div>

          <!-- Quick Suggestion Chips -->
          <div class="sim-chat-quick-actions">
            <span style="font-size:0.75rem; color:var(--text-faint); width:100%; font-weight:600; margin-bottom:0.15rem;">
              ${this.lang === 'de' ? '💡 Schnellauswahl / Vorschläge:' : '💡 Quick Suggestions:'}
            </span>
            <button class="sim-chip-btn" data-chat-quick="vision">🔍 Optische Vial-Inspektion (Parenteralia)</button>
            <button class="sim-chip-btn" data-chat-quick="genai">🤖 GenAI SOP Drafting</button>
            <button class="sim-chip-btn" data-chat-quick="freeze">❄️ Frozen Weights einsetzen</button>
            <button class="sim-chip-btn" data-chat-quick="dynamic">🔄 Dynamisches Selbstlernen testen</button>
            <button class="sim-chip-btn" data-chat-quick="hitl">👤 Human-in-the-Loop aktivieren</button>
          </div>

          <!-- Input Bar -->
          <form class="sim-chat-input-bar" id="simChatForm">
            <input type="text" class="sim-chat-input" id="simChatInput" placeholder="${this.lang === 'de' ? 'Beschreibe dein Projekt oder beantworte die Frage...' : 'Describe your project or answer the question...'}" />
            <button type="submit" class="header-btn primary" style="padding:0.6rem 1.15rem; border-radius:var(--radius-pill);">
              <i data-lucide="send"></i>
              <span>${this.lang === 'de' ? 'Senden' : 'Send'}</span>
            </button>
          </form>
        </div>

        <!-- Live Inspector Sidebar -->
        <div class="sim-live-inspector">
          <div style="display:flex; justify-content:space-between; align-items:center;">
            <div style="font-weight:700; font-family:var(--font-heading); font-size:1.05rem; display:flex; align-items:center; gap:0.4rem;">
              <i data-lucide="shield-check" style="color:var(--brand-cyan);"></i>
              <span>Live Compliance Inspector</span>
            </div>
            <span class="opt-card-tag">22Annex.ai</span>
          </div>

          <!-- Live Score Card -->
          <div class="sim-score-card">
            <div class="sim-inspector-label">${this.lang === 'de' ? 'Echtzeit-Readiness Score' : 'Real-time Readiness Score'}</div>
            <div class="sim-score-number" style="color:${scoreColor};">${score}%</div>
            <div class="sim-score-bar-bg">
              <div class="sim-score-bar-fill" style="width:${score}%; background:${scoreColor};"></div>
            </div>
            <div style="font-size:0.8rem; font-weight:600; color:${scoreColor};">${scoreRating}</div>
          </div>

          ${flags.length > 0 ? `
            <div class="sim-redflag-banner">
              <i data-lucide="alert-triangle" style="flex-shrink:0; color:var(--brand-rose); width:18px; height:18px;"></i>
              <div>
                <strong>${flags[0].title}</strong>
                <div style="font-size:0.75rem; margin-top:0.2rem; opacity:0.9;">${flags[0].desc}</div>
              </div>
            </div>
          ` : ''}

          <!-- Detected Parameters -->
          <div style="display:flex; flex-direction:column; gap:0.6rem;">
            <div class="sim-inspector-row">
              <span class="sim-inspector-label">${this.lang === 'de' ? 'Projekt-Titel' : 'Project Title'}</span>
              <span class="sim-inspector-val">${s.projectName || (this.lang === 'de' ? 'Noch nicht erfasst' : 'Not specified')}</span>
            </div>
            <div class="sim-inspector-row">
              <span class="sim-inspector-label">${this.lang === 'de' ? 'Einsatzbereich' : 'Process Area'}</span>
              <span class="sim-inspector-val">${s.processArea}</span>
            </div>
            <div class="sim-inspector-row">
              <span class="sim-inspector-label">${this.lang === 'de' ? 'Modell & Architektur' : 'Model & Architecture'}</span>
              <span class="sim-inspector-val">${s.modelType} (${s.learningType === 'static' ? '❄️ Frozen Weights' : '⚠️ Dynamic Learning'})</span>
            </div>
            <div class="sim-inspector-row">
              <span class="sim-inspector-label">${this.lang === 'de' ? 'Menschliche Aufsicht' : 'Human Oversight'}</span>
              <span class="sim-inspector-val">${s.autonomyLevel === 'hitl' ? '👤 Human-in-the-Loop' : '⚡ Autonom (HOOL)'}</span>
            </div>
          </div>

          <!-- Direct Run Action -->
          <button class="header-btn primary" id="simChatRunEvalBtn" style="width:100%; justify-content:center; padding:0.75rem; margin-top:0.5rem;">
            <i data-lucide="sparkles"></i>
            <span>${this.lang === 'de' ? 'Validierungs-Blueprint berechnen ➔' : 'Generate Validation Blueprint ➔'}</span>
          </button>
          
          <div style="font-size:0.75rem; color:var(--text-faint); text-align:center;">
            ${this.lang === 'de' ? 'Tipp: Du kannst oben jederzeit zu den Frage-Karten umschalten.' : 'Tip: You can switch to Guided Cards at any time.'}
          </div>
        </div>
      </div>
    `;
  }

  renderSimStep1() {
    const s = this.simState;
    return `
      <div class="simulator-form-card">
        <div>
          <h2 style="font-family:var(--font-heading); font-size:1.4rem; margin-bottom:0.25rem;">
            ${this.lang === 'de' ? '1. Beschreibe deine KI-Projektidee' : '1. Define your AI Project Concept'}
          </h2>
          <p style="font-size:0.875rem; color:var(--text-muted);">
            ${this.lang === 'de' ? 'Oder wähle ein pharmazeutisches Praxisbeispiel zum sofortigen Testen:' : 'Or pick an industry preset to test immediately:'}
          </p>
          <div class="presets-container">
            <span style="font-size:0.75rem; color:var(--text-faint); font-weight:600;">PRESETS:</span>
            <button class="preset-chip-btn" data-preset="vision">🔍 Optische Vial-Inspektion (Parenteralia)</button>
            <button class="preset-chip-btn" data-preset="genai">🤖 GenAI RAG Drafting Assistant (SOPs)</button>
            <button class="preset-chip-btn" data-preset="dynamic_risk">⚠️ Selbstlernender Bioreaktor (Risk Test)</button>
          </div>
        </div>

        <div class="sim-form-group">
          <label class="sim-label">${this.lang === 'de' ? 'Name des KI-Systems / Projekttitel:' : 'System Name / Project Title:'}</label>
          <input type="text" class="sim-input" id="simProjectName" value="${s.projectName}" placeholder="${this.lang === 'de' ? 'z.B. AI-Vision Inspection Line 4' : 'e.g. AI-Vision Inspection Line 4'}" />
        </div>

        <div class="sim-form-group">
          <label class="sim-label">
            ${this.lang === 'de' ? 'Intended Use (Zweckbestimmung & pharmazeutischer Einsatzort):' : 'Intended Use & Operational Boundary:'}
          </label>
          <span class="sim-label-desc">
            ${this.lang === 'de' 
              ? 'Beschreibe kurz, welche Aufgabe das Modell übernimmt, welche Eingangsdaten genutzt werden und welche Entscheidung davon abhängt:' 
              : 'Describe what task the model performs, what data feeds it, and what decisions depend on it:'}
          </span>
          <textarea class="sim-textarea" id="simIntendedUse" placeholder="${this.lang === 'de' ? 'z.B. Das Modell klassifiziert während des Füllvorgangs Kamerabilder auf Partikelverunreinigung und schleust defekte Vials aus...' : 'e.g. The model classifies camera inspection feeds for particulate contamination and triggers rejection gates...'}">${s.intendedUse}</textarea>
        </div>

        <div class="sim-form-group">
          <label class="sim-label">${this.lang === 'de' ? 'Pharmazeutischer Prozessbereich:' : 'GxP Process Domain:'}</label>
          <div class="option-cards-grid">
            <div class="option-card-radio ${s.processArea === 'batch_release' ? 'selected' : ''}" data-field="processArea" data-val="batch_release">
              <div class="opt-card-header">
                <span class="opt-card-title">${this.lang === 'de' ? 'Chargenfreigabe & Disposition' : 'Batch Release & Disposition'}</span>
                <span class="opt-card-tag" style="color:var(--brand-rose);">KRITISCH</span>
              </div>
              <p class="opt-card-desc">${this.lang === 'de' ? 'Direkter Einfluss auf Freigabe von Fertigarzneimitteln (QP-Verantwortung).' : 'Direct impact on final product release (QP statutory responsibility).'}</p>
            </div>

            <div class="option-card-radio ${s.processArea === 'in_process' ? 'selected' : ''}" data-field="processArea" data-val="in_process">
              <div class="opt-card-header">
                <span class="opt-card-title">${this.lang === 'de' ? 'In-Process-Control (IPC)' : 'In-Process Control (IPC)'}</span>
                <span class="opt-card-tag" style="color:var(--brand-amber);">HOCH</span>
              </div>
              <p class="opt-card-desc">${this.lang === 'de' ? 'Online-Prüfung während Produktion (Tablettenpressung, Inspektion, Fermentation).' : 'Inline inspection during active production.'}</p>
            </div>

            <div class="option-card-radio ${s.processArea === 'oos_investigation' ? 'selected' : ''}" data-field="processArea" data-val="oos_investigation">
              <div class="opt-card-header">
                <span class="opt-card-title">${this.lang === 'de' ? 'Abweichungen & Labordaten' : 'Deviations & Lab Triage'}</span>
                <span class="opt-card-tag">MITTEL</span>
              </div>
              <p class="opt-card-desc">${this.lang === 'de' ? 'Klassifizierung von Abweichungsberichten, OOS-Triage oder SOP-Assistenz.' : 'Deviation triage, OOS investigation, or SOP assistance.'}</p>
            </div>
          </div>
        </div>

        <div class="sim-actions-footer">
          <div></div>
          <button class="header-btn primary" id="simStep1NextBtn">
            <span>${this.lang === 'de' ? 'Weiter zu Schritt 2 (Leitplanken) ➔' : 'Proceed to Step 2 (Guardrails) ➔'}</span>
          </button>
        </div>
      </div>
    `;
  }

  renderSimStep2() {
    const s = this.simState;
    return `
      <div class="simulator-form-card">
        <div>
          <h2 style="font-family:var(--font-heading); font-size:1.4rem; margin-bottom:0.25rem;">
            ${this.lang === 'de' ? '2. Architektonische Leitplanken & Risikoklassen' : '2. Architectural Guardrails & Risk Tiering'}
          </h2>
          <p style="font-size:0.875rem; color:var(--text-muted);">
            ${this.lang === 'de' ? 'Wähle die technische Architektur und den geplanten Betriebsmodus nach Annex 22:' : 'Select technical architecture and operational mode under Annex 22:'}
          </p>
        </div>

        <!-- Model Nature (Static vs Dynamic) -->
        <div class="sim-form-group">
          <label class="sim-label">
            ${this.lang === 'de' ? 'A. Lernmodus des Modells (Static vs. Dynamic Learning):' : 'A. Model Learning Modality:'}
          </label>
          <div class="option-cards-grid">
            <div class="option-card-radio ${s.learningType === 'static' ? 'selected' : ''}" data-field="learningType" data-val="static">
              <div class="opt-card-header">
                <span class="opt-card-title">${this.lang === 'de' ? 'Statisches Modell (Frozen Weights)' : 'Static Model (Frozen Weights)'}</span>
                <span class="opt-card-tag" style="color:var(--brand-emerald);">GMP-KONFORM</span>
              </div>
              <p class="opt-card-desc">${this.lang === 'de' ? 'Modellgewichte sind nach Validierung eingefroren. Retraining erfolgt offline unter Change Control.' : 'Weights frozen post-validation. Retraining conducted offline under formal Change Control.'}</p>
            </div>

            <div class="option-card-radio ${s.learningType === 'dynamic' ? 'selected-danger' : ''}" data-field="learningType" data-val="dynamic">
              <div class="opt-card-header">
                <span class="opt-card-title">${this.lang === 'de' ? 'Dynamisch / Kontinuierlich lernend' : 'Dynamic / Online Re-training'}</span>
                <span class="opt-card-tag" style="color:var(--brand-rose); font-weight:700;">🚨 RED FLAG</span>
              </div>
              <p class="opt-card-desc">${this.lang === 'de' ? 'Modell trainiert sich im laufenden GMP-Betrieb kontinuierlich an neuen Daten selbst weiter.' : 'Model automatically retrains in production without offline revalidation.'}</p>
            </div>
          </div>
        </div>

        <!-- Model Architecture -->
        <div class="sim-form-group">
          <label class="sim-label">
            ${this.lang === 'de' ? 'B. Modell-Architektur:' : 'B. Algorithmic Architecture:'}
          </label>
          <div class="option-cards-grid">
            <div class="option-card-radio ${s.modelType === 'predictive_ml' ? 'selected' : ''}" data-field="modelType" data-val="predictive_ml">
              <div class="opt-card-header">
                <span class="opt-card-title">${this.lang === 'de' ? 'Klassisches Predictive ML / Tabular' : 'Predictive ML / Tabular'}</span>
                <span class="opt-card-tag">METRIC QUAD</span>
              </div>
              <p class="opt-card-desc">${this.lang === 'de' ? 'Gradient Boosting, Random Forests, multivariate Prozessdaten.' : 'Tree ensembles, regression, multivariate sensor telemetry.'}</p>
            </div>

            <div class="option-card-radio ${s.modelType === 'vision_defect' ? 'selected' : ''}" data-field="modelType" data-val="vision_defect">
              <div class="opt-card-header">
                <span class="opt-card-title">${this.lang === 'de' ? 'Computer Vision / Defekterkennung' : 'Computer Vision Inspection'}</span>
                <span class="opt-card-tag">CNN / DEEP</span>
              </div>
              <p class="opt-card-desc">${this.lang === 'de' ? 'Optische Kamerabild-Analyse (Tabletten, Vials, Siegelnähte).' : 'Image processing for defects, fill-height, particle inspection.'}</p>
            </div>

            <div class="option-card-radio ${s.modelType === 'genai_rag' ? 'selected' : ''}" data-field="modelType" data-val="genai_rag">
              <div class="opt-card-header">
                <span class="opt-card-title">${this.lang === 'de' ? 'Generative KI / LLM mit RAG' : 'Generative AI / LLM with RAG'}</span>
                <span class="opt-card-tag">RAG TRIAD</span>
              </div>
              <p class="opt-card-desc">${this.lang === 'de' ? 'Textgenerierung, SOP-Abfragen, Entwurfserstellung für QA.' : 'Text synthesis, document search, drafting assistants.'}</p>
            </div>
          </div>
        </div>

        <!-- Human Oversight -->
        <div class="sim-form-group">
          <label class="sim-label">
            ${this.lang === 'de' ? 'C. Autonomiegrad & Menschliche Aufsicht:' : 'C. Autonomy Tier & Human Oversight:'}
          </label>
          <div class="option-cards-grid">
            <div class="option-card-radio ${s.autonomyLevel === 'hitl' ? 'selected' : ''}" data-field="autonomyLevel" data-val="hitl">
              <div class="opt-card-header">
                <span class="opt-card-title">Human-in-the-Loop (HITL)</span>
                <span class="opt-card-tag" style="color:var(--brand-emerald);">STANDARD</span>
              </div>
              <p class="opt-card-desc">${this.lang === 'de' ? 'Mensch prüft und genehmigt jede einzelne Vorhersage vor Ausführung.' : 'Human reviews and authorizes every single individual inference.'}</p>
            </div>

            <div class="option-card-radio ${s.autonomyLevel === 'hotl' ? 'selected' : ''}" data-field="autonomyLevel" data-val="hotl">
              <div class="opt-card-header">
                <span class="opt-card-title">Human-on-the-Loop (HOTL)</span>
                <span class="opt-card-tag">LEITWARTE</span>
              </div>
              <p class="opt-card-desc">${this.lang === 'de' ? 'Autonom innerhalb enger Guardrails; Mensch kann per Not-Aus eingreifen.' : 'Autonomous within tight guardrails; human has supervisory override.'}</p>
            </div>

            <div class="option-card-radio ${s.autonomyLevel === 'hool' ? 'selected-danger' : ''}" data-field="autonomyLevel" data-val="hool">
              <div class="opt-card-header">
                <span class="opt-card-title">Human-out-of-the-Loop (HOOL)</span>
                <span class="opt-card-tag" style="color:var(--brand-rose);">HOCHRISIKO</span>
              </div>
              <p class="opt-card-desc">${this.lang === 'de' ? 'Vollautomatisch ohne menschliche Kontrolle. Im GMP-Kern verboten!' : 'Fully automated with zero human review. Prohibited for critical GMP!'}</p>
            </div>
          </div>
        </div>

        <!-- Optional Gemini / Gemma API Integration -->
        <div class="sim-form-group" style="background:var(--bg-surface-elevated); padding:1.25rem; border-radius:var(--radius-md); border:1px solid var(--border-subtle);">
          <div style="display:flex; justify-content:space-between; align-items:center;">
            <label class="sim-label" style="font-size:0.95rem;">
              <i data-lucide="sparkles" style="color:var(--brand-cyan);"></i>
              <span>${this.lang === 'de' ? 'KI-Audit-Engine (Gemini API für Gemma 27B / Gemini 1.5):' : 'AI Audit Engine (Gemini API for Gemma 27B / Gemini 1.5):'}</span>
            </label>
            <span class="opt-card-tag">${s.apiKey ? 'API KEY GESPEICHERT' : 'OFFLINE-EXPERTEN-MODUS'}</span>
          </div>
          <p style="font-size:0.8rem; color:var(--text-muted); margin-bottom:0.75rem;">
            ${this.lang === 'de' 
              ? 'Optional: Trage deinen Gemini API-Key ein, um die Analyse über Gemma 27B / Gemini laufen zu lassen. Ohne Key nutzt der Simulator unsere integrierte deterministische Annex-22-Experten-Regelengine!' 
              : 'Optional: Enter your Gemini API key to evaluate with Gemma 27B / Gemini. Without a key, the simulator uses our built-in Annex 22 expert rule engine!'}
          </p>
          <div style="display:flex; gap:0.75rem; flex-wrap:wrap;">
            <input type="password" class="sim-input" id="simApiKeyInput" value="${s.apiKey}" placeholder="AIzaSy... (Gemini API Key)" style="flex:1; min-width:240px;" />
            <select class="sim-input" id="simModelChoice" style="width:180px;">
              <option value="gemma-27b" ${s.modelChoice === 'gemma-27b' ? 'selected' : ''}>Gemma 2 27B IT</option>
              <option value="gemini-1.5-flash" ${s.modelChoice === 'gemini-1.5-flash' ? 'selected' : ''}>Gemini 1.5 Flash</option>
              <option value="gemini-1.5-pro" ${s.modelChoice === 'gemini-1.5-pro' ? 'selected' : ''}>Gemini 1.5 Pro</option>
            </select>
          </div>
        </div>

        <div class="sim-actions-footer">
          <button class="header-btn" id="simStep2BackBtn">
            <span>⬅ ${this.lang === 'de' ? 'Zurück zu Schritt 1' : 'Back to Step 1'}</span>
          </button>
          <button class="header-btn primary" id="simRunEvaluationBtn">
            <i data-lucide="sparkles"></i>
            <span>${this.lang === 'de' ? '🚀 Annex 22 Blueprint generieren' : '🚀 Generate Annex 22 Blueprint'}</span>
          </button>
        </div>
      </div>
    `;
  }

  renderSimStep3() {
    const s = this.simState;
    if (s.isEvaluating) {
      return `
        <div class="simulator-form-card" style="text-align:center; padding:5rem 2rem;">
          <div style="font-size:3rem; margin-bottom:1rem; animation: pulse 1.5s infinite;">🧪</div>
          <h2 style="font-family:var(--font-heading); font-size:1.5rem; margin-bottom:0.5rem;">
            ${this.lang === 'de' ? 'Analysiere Projekt-Idee gegen EU GMP Annex 22...' : 'Analyzing Project Concept against EU GMP Annex 22...'}
          </h2>
          <p style="color:var(--text-muted); max-width:480px; margin:0 auto;">
            ${this.lang === 'de' 
              ? 'Prüfe Geltungsbereich, Lernmodus, Intended Use, Metric Quad und Audit-Readiness Kriterien...' 
              : 'Evaluating scope, learning modality, metric quad, and inspection readiness criteria...'}
          </p>
        </div>
      `;
    }

    const bp = s.blueprint;
    if (!bp) return `<div>Kein Blueprint vorhanden</div>`;

    const statusBadgeClass = bp.verdict === 'REJECT' ? 'status-badge-red' : (bp.verdict === 'CONDITIONAL' ? 'status-badge-yellow' : 'status-badge-green');
    const statusText = bp.verdict === 'REJECT' 
      ? '🚨 RED FLAG: NICHT GMP-KONFORM (BLOCKER VORHANDEN)' 
      : (bp.verdict === 'CONDITIONAL' ? '⚠️ KONDITIONELL QUALIFIZIERBAR (AUFLAGEN ZU ERFÜLLEN)' : '🟢 QUALIFIZIERUNGSFÄHIG (IN ÜBEREINSTIMMUNG MIT ANNEX 22 DRAFT)');

    return `
      <div class="blueprint-card">
        <div class="blueprint-header">
          <div>
            <div style="font-size:0.75rem; font-family:var(--font-mono); color:var(--text-faint); margin-bottom:0.25rem;">
              ANNEX 22 QUALIFICATION BLUEPRINT • ${new Date().toLocaleDateString()}
            </div>
            <h2 style="font-family:var(--font-heading); font-size:1.85rem; font-weight:800;">
              ${s.projectName || 'Unbenanntes KI-System'}
            </h2>
            <div style="font-size:0.9rem; color:var(--brand-cyan); margin-top:0.2rem;">
              Einsatzbereich: ${s.processArea} | Architektur: ${s.modelType} | Modus: ${s.learningType} | Aufsicht: ${s.autonomyLevel}
            </div>
          </div>
          <div class="blueprint-status-badge ${statusBadgeClass}">
            ${statusText}
          </div>
        </div>

        <!-- Compliance Readiness Score & Penalty Summary -->
        <div class="sim-score-card" style="text-align:left; padding:1.25rem 1.5rem; background:var(--bg-surface-elevated); border:1px solid var(--border-subtle); border-radius:var(--radius-md);">
          <div style="display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:1rem;">
            <div>
              <span class="sim-inspector-label">${this.lang === 'de' ? 'Gesamt-Compliance Readiness Score' : 'Overall Compliance Readiness Score'}</span>
              <div style="display:flex; align-items:baseline; gap:0.6rem; margin-top:0.25rem;">
                <span class="sim-score-number" style="color:${bp.score >= 80 ? 'var(--brand-emerald)' : (bp.score >= 50 ? 'var(--brand-amber)' : 'var(--brand-rose)')};">
                  ${bp.score || 75}%
                </span>
                <span style="font-weight:600; color:var(--text-muted); font-size:0.95rem;">
                  ${bp.score >= 80 ? (this.lang === 'de' ? '• Hohe Reife / Validierungsfähig' : '• High Readiness') : (bp.score >= 50 ? (this.lang === 'de' ? '• Konditionell / Auflagen zu erfüllen' : '• Conditional / Remediations Required') : (this.lang === 'de' ? '• Kritisches Risiko / Showstopper vorhanden' : '• Critical Risk / Showstoppers Present'))}
                </span>
              </div>
            </div>
            ${bp.penalties && bp.penalties.length > 0 ? `
              <div style="background:var(--bg-surface); padding:0.6rem 1rem; border-radius:var(--radius-sm); border:1px solid var(--brand-rose); font-size:0.8rem;">
                <span style="color:var(--brand-rose); font-weight:700;">Abzüge (${bp.penalties.reduce((a, p) => a + p.deduction, 0)} Pkt.):</span>
                <div style="color:var(--text-muted); margin-top:0.2rem;">
                  ${bp.penalties.map(p => `${p.label} (${p.deduction} Pkt. ${p.citation})`).join(' • ')}
                </div>
              </div>
            ` : ''}
          </div>
          <div class="sim-score-bar-bg" style="margin-top:0.85rem;">
            <div class="sim-score-bar-fill" style="width:${bp.score || 75}%; background:${bp.score >= 80 ? 'var(--brand-emerald)' : (bp.score >= 50 ? 'var(--brand-amber)' : 'var(--brand-rose)')};"></div>
          </div>
        </div>

        <!-- Executive Summary -->
        <div class="blueprint-section">
          <h3 class="blueprint-sec-title">
            <i data-lucide="file-text"></i>
            <span>${this.lang === 'de' ? 'Executive Assessment & Behörden-Perspektive' : 'Executive Assessment & Inspector Perspective'}</span>
          </h3>
          <p style="font-size:0.95rem; line-height:1.6; color:var(--text-main); background:var(--bg-surface-elevated); padding:1.25rem; border-radius:var(--radius-md); border-left:4px solid ${bp.verdict === 'REJECT' ? 'var(--brand-rose)' : 'var(--brand-primary)'};">
            ${bp.summary}
          </p>
        </div>

        <!-- Red Flags & Blockers (if any) -->
        ${bp.redFlags.length > 0 ? `
          <div class="blueprint-section">
            <h3 class="blueprint-sec-title" style="color:var(--brand-rose);">
              <i data-lucide="alert-octagon"></i>
              <span>${this.lang === 'de' ? 'Identifizierte Red Flags & regulatorische Showstopper' : 'Identified Red Flags & Regulatory Blockers'}</span>
            </h3>
            <div class="blueprint-list">
              ${bp.redFlags.map(rf => `
                <div class="blueprint-item" style="border-left:3px solid var(--brand-rose);">
                  <div class="bp-item-head">
                    <span class="bp-item-title" style="color:var(--brand-rose);">${rf.title}</span>
                    <span class="opt-card-tag">${rf.reference}</span>
                  </div>
                  <p class="bp-item-desc">${rf.description}</p>
                </div>
              `).join('')}
            </div>
          </div>
        ` : ''}

        <!-- Mandatory Validation Deliverables -->
        <div class="blueprint-section">
          <h3 class="blueprint-sec-title" style="color:var(--brand-cyan);">
            <i data-lucide="check-circle-2"></i>
            <span>${this.lang === 'de' ? 'Zwingende Validierungs-Dokumente & CSV-Artefakte' : 'Mandatory Validation Deliverables'}</span>
          </h3>
          <div class="blueprint-list">
            ${bp.deliverables.map(d => `
              <div class="blueprint-item">
                <div class="bp-item-head">
                  <span class="bp-item-title">${d.name}</span>
                  <span class="opt-card-tag">${d.tier}</span>
                </div>
                <p class="bp-item-desc">${d.requirements}</p>
              </div>
            `).join('')}
          </div>
        </div>

        <!-- Testing & Metric Requirements -->
        <div class="blueprint-section">
          <h3 class="blueprint-sec-title">
            <i data-lucide="activity"></i>
            <span>${this.lang === 'de' ? 'Prüf- und Metrik-Vorgaben nach Annex 22' : 'Testing & Metric Requirements'}</span>
          </h3>
          <div class="blueprint-list">
            ${bp.testingRequirements.map(t => `
              <div class="blueprint-item">
                <div class="bp-item-head">
                  <span class="bp-item-title" style="color:var(--brand-emerald);">${t.metric}</span>
                  <span class="opt-card-tag">${t.purpose}</span>
                </div>
                <p class="bp-item-desc">${t.details}</p>
              </div>
            `).join('')}
          </div>
        </div>

        <!-- Typical Inspector Questions -->
        <div class="blueprint-section">
          <h3 class="blueprint-sec-title">
            <i data-lucide="help-circle"></i>
            <span>${this.lang === 'de' ? 'Mögliche Fragen von Behörden-Prüfern (Mock Inspection Prep)' : 'Probable Inspector Questions'}</span>
          </h3>
          <div class="blueprint-list">
            ${bp.auditQuestions.map((q, idx) => `
              <div class="blueprint-item">
                <div class="bp-item-head">
                  <span class="bp-item-title" style="color:var(--text-main);">Frage ${idx + 1}: ${q.question}</span>
                </div>
                <p class="bp-item-desc" style="color:var(--brand-cyan);"><strong>Empfohlene Verteidigung:</strong> ${q.recommendedAnswer}</p>
              </div>
            `).join('')}
          </div>
        </div>
      </div>
    `;
  }

  bindSimulatorEvents(container) {
    // Dual-Mode Toggle
    document.getElementById('simModeCardsBtn')?.addEventListener('click', () => {
      this.simState.mode = 'cards';
      this.renderSimulatorView(container);
    });

    document.getElementById('simModeChatBtn')?.addEventListener('click', () => {
      this.simState.mode = 'chat';
      this.renderSimulatorView(container);
      setTimeout(() => {
        const msgBox = document.getElementById('simChatMsgContainer');
        if (msgBox) msgBox.scrollTop = msgBox.scrollHeight;
      }, 50);
    });

    // Chat Quick Actions
    container.querySelectorAll('[data-chat-quick]').forEach(btn => {
      btn.addEventListener('click', () => {
        const action = btn.dataset.chatQuick;
        if (action === 'vision') {
          this.handleChatInput(this.lang === 'de' ? 'Wir planen eine optische In-Line-Kamerainspektion (Vision AI) von Vials auf Partikel und Glasrisse bei der Abfüllung.' : 'We are planning in-line computer vision inspection of vials for particles and cracks.', container);
        } else if (action === 'genai') {
          this.handleChatInput(this.lang === 'de' ? 'Wir möchten einen GenAI / RAG-Assistenten für SOP-Recherchen und Formulierungshilfe bei Deviation Investigations nutzen.' : 'We want to use a GenAI RAG assistant for SOP drafting and deviation investigation.', container);
        } else if (action === 'freeze') {
          this.handleChatInput(this.lang === 'de' ? 'Wir setzen auf Frozen Weights. Das Modell wird im laufenden GMP-Betrieb nicht verändert.' : 'We use frozen weights. The model will not retrain during GMP operations.', container);
        } else if (action === 'dynamic') {
          this.handleChatInput(this.lang === 'de' ? 'Wir möchten testen, was passiert, wenn das Modell kontinuierlich online im Batchbetrieb weiterlernt.' : 'We want to test continuous online self-learning during batch production.', container);
        } else if (action === 'hitl') {
          this.handleChatInput(this.lang === 'de' ? 'Ein geschulter Mitarbeiter prüft jede Modell-Entscheidung und hat volle Override-Befugnis (Human-in-the-Loop).' : 'A trained operator verifies every decision with full override authority (Human-in-the-Loop).', container);
        }
      });
    });

    // Chat Form Submit
    const chatForm = document.getElementById('simChatForm');
    chatForm?.addEventListener('submit', (e) => {
      e.preventDefault();
      const input = document.getElementById('simChatInput');
      if (input && input.value.trim()) {
        const val = input.value.trim();
        input.value = '';
        this.handleChatInput(val, container);
      }
    });

    // Chat Run Evaluation Button
    document.getElementById('simChatRunEvalBtn')?.addEventListener('click', () => {
      this.runSimulatorEvaluation();
    });

    // Preset buttons
    container.querySelectorAll('.preset-chip-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const preset = e.target.dataset.preset;
        this.applySimPreset(preset);
        this.renderSimulatorView(container);
      });
    });

    // Step 1 Inputs
    const nameInput = document.getElementById('simProjectName');
    nameInput?.addEventListener('input', (e) => {
      this.simState.projectName = e.target.value;
    });

    const intendedInput = document.getElementById('simIntendedUse');
    intendedInput?.addEventListener('input', (e) => {
      this.simState.intendedUse = e.target.value;
    });

    // Option cards selection
    container.querySelectorAll('.option-card-radio').forEach(card => {
      card.addEventListener('click', () => {
        const field = card.dataset.field;
        const val = card.dataset.val;
        this.simState[field] = val;
        this.renderSimulatorView(container);
      });
    });

    // Step 1 Next
    document.getElementById('simStep1NextBtn')?.addEventListener('click', () => {
      if (!this.simState.intendedUse || this.simState.intendedUse.trim().length < 5) {
        alert(this.lang === 'de' ? 'Bitte gib eine kurze Beschreibung des Intended Use ein.' : 'Please enter a brief intended use description.');
        return;
      }
      this.simState.step = 2;
      this.renderSimulatorView(container);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });

    // Step 2 Back
    document.getElementById('simStep2BackBtn')?.addEventListener('click', () => {
      this.simState.step = 1;
      this.renderSimulatorView(container);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });

    // Step 2 API Key
    const apiKeyInput = document.getElementById('simApiKeyInput');
    apiKeyInput?.addEventListener('input', (e) => {
      this.simState.apiKey = e.target.value.trim();
      localStorage.setItem('gemini_api_key', this.simState.apiKey);
    });

    const modelChoiceInput = document.getElementById('simModelChoice');
    modelChoiceInput?.addEventListener('change', (e) => {
      this.simState.modelChoice = e.target.value;
    });

    // Run Evaluation
    document.getElementById('simRunEvaluationBtn')?.addEventListener('click', () => {
      this.runSimulatorEvaluation();
    });

    // Step 3 Actions
    document.getElementById('simNewRunBtn')?.addEventListener('click', () => {
      this.simState.step = 1;
      this.simState.blueprint = null;
      this.renderSimulatorView(container);
    });

    document.getElementById('simExportReportBtn')?.addEventListener('click', () => {
      this.exportBlueprintMarkdown();
    });
  }

  handleChatInput(userText, container) {
    if (!userText || !userText.trim()) return;
    const cleanText = userText.trim();
    const time = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    // 1. Add User message
    this.simState.chatMessages.push({
      sender: 'user',
      text: cleanText,
      time
    });

    // 2. Parse text and adapt state
    const lower = cleanText.toLowerCase();

    if (lower.includes('vial') || lower.includes('partikel') || lower.includes('optisch') || lower.includes('kamera') || lower.includes('vision') || lower.includes('parenteralia')) {
      this.simState.projectName = this.simState.projectName || 'AI-Vision Inspektion Parenteralia';
      this.simState.intendedUse = cleanText;
      this.simState.processArea = 'in_process';
      this.simState.modelType = 'vision_defect';
    } else if (lower.includes('genai') || lower.includes('sop') || lower.includes('rag') || lower.includes('llm') || lower.includes('abweichung') || lower.includes('deviation')) {
      this.simState.projectName = this.simState.projectName || 'GenAI SOP & Deviation Drafting Assistant';
      this.simState.intendedUse = cleanText;
      this.simState.processArea = 'oos_investigation';
      this.simState.modelType = 'genai_rag';
    } else if (lower.includes('bioreaktor') || lower.includes('ferment') || lower.includes('sensor') || lower.includes('ausbeute')) {
      this.simState.projectName = this.simState.projectName || 'Bioprozess-Monitoring & Soft-Sensor';
      this.simState.intendedUse = cleanText;
      this.simState.processArea = 'in_process';
      this.simState.modelType = 'predictive_ml';
    }

    if (lower.includes('freeze') || lower.includes('statisch') || lower.includes('fest') || lower.includes('eingefroren')) {
      this.simState.learningType = 'static';
    } else if (lower.includes('dynamisch') || lower.includes('kontinuierlich') || lower.includes('selbstlern') || lower.includes('online')) {
      this.simState.learningType = 'dynamic';
    }

    if (lower.includes('hitl') || lower.includes('mensch') || lower.includes('loop') || lower.includes('override') || lower.includes('freigabe')) {
      this.simState.autonomyLevel = 'hitl';
    } else if (lower.includes('autonom') || lower.includes('hool') || lower.includes('vollautomat')) {
      this.simState.autonomyLevel = 'hool';
    }

    // 3. Formulate Co-Auditor response
    let auditorReply = '';
    const s = this.simState;

    if (lower.includes('dynamisch') || lower.includes('kontinuierlich') || lower.includes('selbstlern')) {
      auditorReply = this.lang === 'de'
        ? `⚠️ **Wichtiger regulatorischer Hinweis nach Annex 22 [Draft §1]:**\nKontinuierliches Selbstlernen im GMP-Routinebetrieb führt zu unkontrollierbarem Concept-Drift und Verlust des validierten Zustands. Die EMA schließt das für kritische Prozesse faktisch aus („should not be used“). Ich habe dafür **-35 Punkte** im Readiness Score abgezogen.\n\n👉 *Praxis-Empfehlung:* Nutze im Betrieb **Frozen Weights** und führe Nachtrainings nur offline in einer qualifizierten MLOps-Pipeline mit formeller Revalidierung durch.\n\nWie sieht euer Plan für die **menschliche Aufsicht (Human Oversight nach Draft §3)** aus? Behält ein Mitarbeiter die Freigabehoheit?`
        : `⚠️ **Regulatory Warning [Draft §1]:**\nContinuous self-learning in GMP operations leads to uncontrolled drift and loss of the validated state. EMA explicitly excludes this for critical applications. A penalty of **-35 points** was applied.\n\n👉 *Remediation:* Deploy with **Frozen Weights** and retrain only offline under formal change control.\n\nWhat is your plan for **Human Oversight (Draft §3)**?`;
    } else if (lower.includes('freeze') || lower.includes('statisch') || lower.includes('fest')) {
      auditorReply = this.lang === 'de'
        ? `✅ **Hervorragend [Draft §1 & Modul 07]:**\nDie Verwendung von festen Gewichten (*Frozen Weights*) ist die Grundvoraussetzung für Deterministik und Reproduzierbarkeit nach GxP.\n\nNächste Frage: **Wer hat die Letztentscheidung (Human Oversight nach Draft §3 & §9.2)?** Ist ein Human-in-the-Loop (HITL) mit dokumentierter Override-Befugnis vorgesehen?`
        : `✅ **Great [Draft §1]:** Using frozen weights ensures determinism and repeatability in GxP.\n\nNext: What is your **Human Oversight strategy (Draft §3 & §9.2)**?`;
    } else if (lower.includes('hitl') || lower.includes('mensch') || lower.includes('loop')) {
      auditorReply = this.lang === 'de'
        ? `✅ **Sehr gut [Draft §3, §9.2 & Art. 51 2001/83/EG]:**\nHuman-in-the-Loop (HITL) stellt sicher, dass die pharmazeutische Verantwortung beim qualifizierten Fachpersonal bleibt. Wichtig: Eure SOPs müssen ein spezifisches *Override-Training* vorschreiben, um Automation Bias vorzubeugen!\n\nDie zentralen Leitplanken sind nun erfasst. Klicke rechts auf **'Validierungs-Blueprint berechnen'**, um das vollständige Dossier zu generieren.`
        : `✅ **Approved [Draft §3 & §9.2]:** Human-in-the-Loop ensures legal accountability remains with qualified personnel.\n\nYou can now generate your validation blueprint!`;
    } else if (lower.includes('autonom') || lower.includes('hool')) {
      auditorReply = this.lang === 'de'
        ? `⚠️ **Kritisches Finding [Draft §3 & Art. 51 2001/83/EG]:**\nVollautonome Entscheidungen ohne menschliche Prüf- und Überstimmungsinstanz sind für qualitätskritische Prozesse unzulässig! Dafür wurden **-30 Punkte** abgezogen.\n\nEmpfehlung: Auf HITL umstellen oder mindestens eine Vier-Augen-Freigabe implementieren.`
        : `⚠️ **Critical Finding [Draft §3]:** Unsupervised autonomy is prohibited for quality-critical processes. -30 points penalty applied.`;
    } else {
      auditorReply = this.lang === 'de'
        ? `Verstanden! Für **${s.projectName || 'dein Projekt'}** müssen wir die architektonischen Schutzmaßnahmen nach Annex 22 prüfen:\n\n**Wie soll das Modell im GMP-Betrieb arbeiten?**\nWird es mit festen Parametern betrieben (**Frozen Weights**) oder ist ein **kontinuierliches Weitertrainieren zur Laufzeit** geplant?`
        : `Understood! For **${s.projectName || 'your project'}**, we must verify Annex 22 guardrails:\n\nWill the model operate with **Frozen Weights** or is **continuous learning** planned?`;
    }

    this.simState.chatMessages.push({
      sender: 'auditor',
      text: auditorReply,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    });

    this.renderSimulatorView(container);
    setTimeout(() => {
      const msgBox = document.getElementById('simChatMsgContainer');
      if (msgBox) msgBox.scrollTop = msgBox.scrollHeight;
    }, 50);
  }

  applySimPreset(presetKey) {
    if (presetKey === 'vision') {
      this.simState.projectName = 'Automatisierte optische Vial-Inspektion (Parenteralia)';
      this.simState.intendedUse = 'KI-gestützte Erkennung von Partikeln und Glasdefekten bei der Sterilabfüllung in Echtzeit an der Hochgeschwindigkeitslinie.';
      this.simState.processArea = 'in_process';
      this.simState.modelType = 'vision_defect';
      this.simState.learningType = 'static';
      this.simState.autonomyLevel = 'hitl';
    } else if (presetKey === 'genai') {
      this.simState.projectName = 'SOP & Deviation Drafting Assistant mit RAG';
      this.simState.intendedUse = 'Erstellung von vorformulierten Abweichungsberichten basierend auf freigegebenen SOPs und historischen LIMS-Daten zur Beschleunigung der QA-Triage.';
      this.simState.processArea = 'oos_investigation';
      this.simState.modelType = 'genai_rag';
      this.simState.learningType = 'static';
      this.simState.autonomyLevel = 'hitl';
    } else if (presetKey === 'dynamic_risk') {
      this.simState.projectName = 'Kontinuierliche Bioprozess-Regelung (Selbstlernend)';
      this.simState.intendedUse = 'Das Modell passt Fütterungsraten im Bioreaktor dynamisch an und trainiert sich im laufenden Batchbetrieb kontinuierlich an neuen Fermentationsdaten selbst weiter.';
      this.simState.processArea = 'in_process';
      this.simState.modelType = 'predictive_ml';
      this.simState.learningType = 'dynamic';
      this.simState.autonomyLevel = 'hotl';
    }
  }

  async runSimulatorEvaluation() {
    this.simState.isEvaluating = true;
    this.renderSimulatorView(document.getElementById('contentWrapper'));

    if (this.simState.apiKey && this.simState.apiKey.trim().length > 5) {
      try {
        const result = await this.callGeminiAPI();
        this.simState.blueprint = result;
      } catch (err) {
        console.warn('Gemini API call failed, using expert engine:', err);
        this.simState.blueprint = this.generateExpertBlueprint();
      }
    } else {
      await new Promise(r => setTimeout(r, 650));
      this.simState.blueprint = this.generateExpertBlueprint();
    }

    this.simState.isEvaluating = false;
    this.simState.step = 3;
    this.renderSimulatorView(document.getElementById('contentWrapper'));

    if (this.simState.blueprint.verdict !== 'REJECT') {
      confetti({ particleCount: 70, spread: 60, origin: { y: 0.5 } });
    }
  }

  generateExpertBlueprint() {
    const s = this.simState;
    const { score, penalties, flags } = this.calculateLiveScore();
    const redFlags = [...flags];
    const deliverables = [];
    const testingRequirements = [];
    const auditQuestions = [];
    let verdict = score >= 80 ? 'VALIDATION_READY' : (score >= 50 ? 'CONDITIONAL' : 'REJECT');

    // 1. Check Dynamic Learning
    if (s.learningType === 'dynamic' && !redFlags.some(f => f.title.includes('Dynamisches'))) {
      redFlags.push({
        title: 'Verstoß gegen das Verbot dynamisch selbstlernender Modelle',
        reference: 'EU GMP Annex 22 [Draft §1] (Modul 03 / Modul 07)',
        description: 'Der Entwurf von Annex 22 schließt Modelle, die sich im GMP-Routinebetrieb selbstständig weitertrainieren, kategorisch aus. Das Modell muss mit fest gefrorenen Parametern (Frozen Weights) betrieben werden. Retrainings erfordern eine isolierte Offline-Umgebung und einen formalen Revalidierungsbericht.'
      });
    }

    // 2. Check HOOL on critical tasks
    if (s.autonomyLevel === 'hool' && (s.processArea === 'batch_release' || s.processArea === 'in_process') && !redFlags.some(f => f.title.includes('Vollautonomie'))) {
      redFlags.push({
        title: 'Unzulässige Vollautonomie (HOOL) bei qualitätskritischen Entscheidungen',
        reference: 'EU GMP Annex 22 [Draft §3, §9.2] & Art. 51 Richtlinie 2001/83/EG',
        description: 'KI-Systeme besitzen keine pharmazeutische Rechtsverantwortung. Vollautomatische Chargenfreigaben ohne qualifizierte menschliche Prüfung verstoßen gegen europäisches Arzneimittelrecht. Es muss zwingend ein Human-in-the-Loop (HITL) Workflow implementiert sein.'
      });
    }

    // 3. GenAI Checks
    if (s.modelType === 'genai_rag') {
      if (verdict !== 'REJECT') verdict = 'CONDITIONAL';
      deliverables.push({
        name: 'RAG-First Architektur-Spezifikation & Guardrail-Protokoll',
        tier: 'Tier 2 (System)',
        requirements: 'Nachweis, dass das LLM strikt auf freigegebene interne Dokumente beschränkt ist (kein freies Internet). Eingangs-Filter (Prompt Injection / PII) und Ausgangs-Guardrails (Schema Enforcement).'
      });
      deliverables.push({
        name: 'Prompt Governance & Golden Regression Testsuite',
        tier: 'Tier 3 (Technisch)',
        requirements: 'Prompts müssen als validierter Source Code in Git versioniert sein. Automatisierte Testsuite mit mind. 100 verifizierten Standardfragen zum Erkennen von Provider-Backend-Updates.'
      });
      testingRequirements.push({
        metric: 'RAG Triad: Groundedness / Faithfulness = 1.0',
        purpose: 'Halluzinations-Prävention',
        details: 'Jede generierte Behauptung muss zu 100% mathematisch aus den abgerufenen Kontext-SOPs belegbar sein. ALCOA+-Zitierpflicht (Dokument-ID, Version, Absatz).'
      });
      auditQuestions.push({
        question: 'Wie stellen Sie sicher, dass Ihr Cloud-Sprachmodell keine erfundenen pharmazeutischen Fakten (Halluzinationen) in den Bericht übernimmt?',
        recommendedAnswer: 'Durch unsere validierte RAG-Triad-Pipeline und den Groundedness-Filter. Sinkt die Faktentreue unter 1.0, verweigert das System die Ausgabe. Zudem fungiert das Tool rein als Drafting Assistant mit zwingender QP-Prüfung.'
      });
    } else {
      // Predictive ML / Vision Deliverables
      deliverables.push({
        name: 'Model Definition & Intended Use Specification',
        tier: 'Tier 2 (System)',
        requirements: 'Formale Festlegung der Systemgrenzen, Eingangs-Sensorparameter und Out-of-Distribution (OOD) Erkennungslogik.'
      });
      deliverables.push({
        name: 'Unabhängiger Validierungsplan & Metric Quad Bericht',
        tier: 'Tier 2 (Qualifizierung)',
        requirements: 'Durchführung der OQ/PQ durch personell unabhängige Tester (Staff Independence) auf einem unverbrauchten Hold-out Testdatensatz.'
      });
      testingRequirements.push({
        metric: 'Recall (Sensitivität) ≥ 99.5% (Pre-Sealed)',
        purpose: 'Schutz vor False Negatives',
        details: 'Asymmetrische Fehlerkosten: Eine defekte Einheit darf niemals unentdeckt bleiben. Akzeptanzkriterien müssen vor Testdurchführung versiegelt werden.'
      });
      testingRequirements.push({
        metric: 'Expected Calibration Error (ECE) ≤ 0.05',
        purpose: 'Schutz vor Automation Bias',
        details: 'Verhindert, dass das Modell bei Fehlentscheidungen fälschlich hohe Konfidenzen anzeigt und das Bedienpersonal täuscht.'
      });
      auditQuestions.push({
        question: 'Waren die Ingenieure, die den finalen Validierungstest durchgeführt haben, unabhängig vom Entwicklungsteam?',
        recommendedAnswer: 'Ja, gemäß PIC/S- und Annex-22-Vorgaben wurde die Qualifizierung auf dem versiegelten Hold-out-Set von unabhängigen Validierungsingenieuren der QA abgenommen (Staff Independence).'
      });
    }

    deliverables.push({
      name: 'Master AI Inventory Eintrag & SOP Change Control',
      tier: 'Tier 1 (Governance)',
      requirements: 'Eintragung im verbindlichen KI-Inventar zur Vermeidung von Schatten-KI. Festlegung statistischer Drift-Schwellenwerte (PSI > 0.2).'
    });

    const summary = verdict === 'REJECT'
      ? `Die aktuelle Konfiguration enthält fundamentale Verstöße gegen den Draft EU GMP Annex 22 (siehe Red Flags unten). Ein System mit dynamischem Weiterlernen oder ohne menschliche Freigabeinstanz ist im GxP-Betrieb nicht zulassungsfähig. Vor der Validierungsplanung müssen Architektur und Betriebsmodus zwingend angepasst werden.`
      : (verdict === 'CONDITIONAL'
        ? `Das Projekt ist grundsätzlich qualifizierungsfähig, unterliegt jedoch als Generative-KI-System strengen Auflagen. Es darf ausschließlich als "Drafting Assistant" unter RAG-Architektur agieren. Eine autonome Dokumentenübernahme ist ausgeschlossen.`
        : `Das geplante System erfüllt die architektonischen Kernvorgaben von Annex 22 (statisches Modell, Human-in-the-Loop, definierte Systemgrenzen). Das Qualifizierungsteam kann die Validierungsplanung auf Basis des Metric Quad und unabhängiger Hold-out-Sets initiieren.`);

    return {
      verdict,
      score,
      penalties,
      summary,
      redFlags,
      deliverables,
      testingRequirements,
      auditQuestions
    };
  }

  async callGeminiAPI() {
    const s = this.simState;
    const modelEndpoint = s.modelChoice === 'gemini-1.5-pro' ? 'gemini-1.5-pro' : 'gemini-1.5-flash';
    const url = `https://generativelanguage.googleapis.com/v1beta/models/${modelEndpoint}:generateContent?key=${s.apiKey}`;

    const prompt = `Du bist ein führender Inspektor der Europäischen Arzneimittel-Agentur (EMA) und PIC/S für den Draft EU GMP Annex 22.
Analysiere folgende pharmazeutische KI-Projektidee:
- Projektname: ${s.projectName}
- Intended Use: ${s.intendedUse}
- Prozessbereich: ${s.processArea}
- Modell-Architektur: ${s.modelType}
- Lernmodus: ${s.learningType}
- Autonomie-Level: ${s.autonomyLevel}

Erstelle ein strenges, inspektionsfestes Compliance-Dossier im JSON-Format mit folgenden Schlüsseln:
{
  "verdict": "REJECT" | "CONDITIONAL" | "VALIDATION_READY",
  "summary": "Prägnante 3-Satz-Zusammenfassung aus Behördensicht",
  "redFlags": [
    { "title": "Titel", "reference": "Annex 22 Modul X", "description": "Erklärung" }
  ],
  "deliverables": [
    { "name": "Dokumentenname", "tier": "Tier 1/2/3", "requirements": "Spezifische Anforderung" }
  ],
  "testingRequirements": [
    { "metric": "Metrik", "purpose": "Zweck", "details": "Akzeptanzgrenzen" }
  ],
  "auditQuestions": [
    { "question": "Typische Prüferfrage", "recommendedAnswer": "Audit-feste Verteidigung" }
  ]
}
Antworte NUR mit reinem JSON ohne Markdown-Ticks.`;

    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }],
        generationConfig: { temperature: 0.1 }
      })
    });

    if (!response.ok) {
      throw new Error(`Gemini API Error: ${response.statusText}`);
    }

    const data = await response.json();
    let text = data.candidates?.[0]?.content?.parts?.[0]?.text || '{}';
    text = text.replace(/```json/gi, '').replace(/```/g, '').trim();
    return JSON.parse(text);
  }

  exportBlueprintMarkdown() {
    const s = this.simState;
    const bp = s.blueprint;
    if (!bp) return;

    let md = `# Annex 22 AI Qualification Blueprint\n\n`;
    md += `**Project:** ${s.projectName || 'AI System'}\n`;
    md += `**Date:** ${new Date().toLocaleDateString()}\n`;
    md += `**Status:** ${bp.verdict}\n\n`;
    md += `## Intended Use\n${s.intendedUse}\n\n`;
    md += `## Executive Assessment\n${bp.summary}\n\n`;

    if (bp.redFlags.length > 0) {
      md += `## 🚨 Red Flags & Blockers\n`;
      bp.redFlags.forEach(rf => {
        md += `- **${rf.title}** (${rf.reference}): ${rf.description}\n`;
      });
      md += `\n`;
    }

    md += `## Mandatory Validation Deliverables\n`;
    bp.deliverables.forEach(d => {
      md += `### ${d.name} (${d.tier})\n${d.requirements}\n\n`;
    });

    md += `## Testing & Metric Requirements\n`;
    bp.testingRequirements.forEach(t => {
      md += `- **${t.metric}** [${t.purpose}]: ${t.details}\n`;
    });

    const blob = new Blob([md], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `Annex22_Blueprint_${(s.projectName || 'project').replace(/\s+/g, '_')}.md`;
    a.click();
    URL.revokeObjectURL(url);
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
            <span class="module-phase-badge">${this.lang === 'de' ? 'Curriculum Lernkontrolle' : 'Curriculum Study Tracker'}</span>
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
          <h1 class="module-main-title">${this.lang === 'de' ? 'Annex 22 Lern- und Kontrollfragen' : 'Annex 22 Study & Review Questions'}</h1>
          <p class="module-subtitle">
            ${this.lang === 'de' 
              ? 'Didaktische Lernkontrolle zum Durcharbeiten des 12-teiligen Kurses. Für konkrete System-Qualifizierungen nutze bitte den AI Project Simulator.' 
              : 'Didactic study tracker to review the 12 modules. For specific system qualification, please use the AI Project Simulator.'}
          </p>
        </div>

        <div class="checklist-controls-bar">
          <div class="filter-pills">
            <button class="filter-pill active" data-filter="all">${this.lang === 'de' ? 'Alle Kriterien' : 'All Items'} (${stats.total})</button>
            <button class="filter-pill" data-filter="pending">${this.lang === 'de' ? 'Offen' : 'Pending'} (${stats.total - stats.completed})</button>
            <button class="filter-pill" data-filter="completed">${this.lang === 'de' ? 'Gelernt' : 'Completed'} (${stats.completed})</button>
          </div>

          <div style="font-weight:600; font-size:0.9rem;">
            ${this.lang === 'de' ? 'Lernfortschritt:' : 'Study Progress:'} <span style="color:var(--brand-emerald);">${stats.percentage}%</span>
          </div>
        </div>

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

    document.getElementById('exportAuditJsonBtn')?.addEventListener('click', () => {
      this.exportAuditJSON();
    });

    document.getElementById('exportAuditMdBtn')?.addEventListener('click', () => {
      this.exportAuditMarkdown();
    });

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
        const preNodes = document.querySelectorAll('pre.mermaid');
        if (!preNodes.length) return;

        mermaid.run({
          nodes: preNodes
        }).then(() => {
          document.querySelectorAll('.mermaid-wrapper').forEach(wrapper => {
            const viewport = wrapper.querySelector('.mermaid-viewport');
            const getDiagramSvg = () => {
              return viewport?.querySelector('svg') ||
                     wrapper.querySelector('.mermaid-viewport svg') ||
                     wrapper.querySelector('svg:not(.lucide)');
            };

            const svg = getDiagramSvg();
            if (svg) {
              svg.style.maxWidth = '100%';
              svg.style.height = 'auto';
              this.fixDiagramContrast(svg);
            }

            const title = wrapper.getAttribute('data-diagram-title') || (this.lang === 'de' ? 'Prozess- & Architektur-Diagramm' : 'Process & Architecture Diagram');

            const handleOpen = (e) => {
              e?.preventDefault();
              e?.stopPropagation();
              const currentSvg = getDiagramSvg();
              if (currentSvg) {
                this.openDiagramModal(currentSvg, title);
              }
            };

            const btn = wrapper.querySelector('button[data-action="fullscreen"]');
            if (btn) {
              btn.onclick = handleOpen;
            }

            if (viewport) {
              viewport.onclick = handleOpen;
            }
          });
        }).catch(err => {
          console.warn('Mermaid rendering notice:', err);
        });
      } catch (err) {
        console.warn('Mermaid initialization notice:', err);
      }
    }, 60);
  }

  fixDiagramContrast(svg) {
    if (!svg) return;

    const isLightColor = (colorStr) => {
      if (!colorStr) return false;
      const str = colorStr.toLowerCase().trim();
      if (str.startsWith('#')) {
        const hex = str.slice(1);
        if (hex.length >= 3) {
          const r = parseInt(hex.length === 3 ? hex[0] + hex[0] : hex.slice(0, 2), 16);
          const g = parseInt(hex.length === 3 ? hex[1] + hex[1] : hex.slice(2, 4), 16);
          const b = parseInt(hex.length === 3 ? hex[2] + hex[2] : hex.slice(4, 6), 16);
          if (!isNaN(r) && !isNaN(g) && !isNaN(b)) {
            const lum = 0.299 * r + 0.587 * g + 0.114 * b;
            return lum > 160;
          }
        }
      }
      if (str.startsWith('rgb')) {
        const matches = str.match(/\d+/g);
        if (matches && matches.length >= 3) {
          const r = Number(matches[0]);
          const g = Number(matches[1]);
          const b = Number(matches[2]);
          const lum = 0.299 * r + 0.587 * g + 0.114 * b;
          return lum > 160;
        }
      }
      return str.includes('#e') || str.includes('#f') || str.includes('white') || str.includes('light');
    };

    // 1. Process all diagram nodes
    svg.querySelectorAll('.node').forEach(node => {
      const shape = node.querySelector('rect, polygon, circle, ellipse, path');
      let fillColor = '';
      if (shape) {
        const style = shape.getAttribute('style') || '';
        const fillAttr = shape.getAttribute('fill') || '';
        const fillMatch = style.match(/fill:\s*([^;!]+)/i);
        if (fillMatch) {
          fillColor = fillMatch[1].trim();
        } else if (fillAttr) {
          fillColor = fillAttr.trim();
        } else {
          try {
            fillColor = window.getComputedStyle(shape).fill;
          } catch (_) {}
        }
      }

      if (isLightColor(fillColor)) {
        node.classList.add('gxp-light-node');
        const labels = node.querySelectorAll('.label *, .nodeLabel, text, tspan, p, span, div');
        labels.forEach(el => {
          el.style.setProperty('color', '#090d16', 'important');
          el.style.setProperty('fill', '#090d16', 'important');
          el.style.setProperty('font-weight', '600', 'important');
        });
      }
    });

    // 2. Process all clusters / subgraphs
    svg.querySelectorAll('.cluster').forEach(cluster => {
      const shape = cluster.querySelector('rect, polygon, circle, ellipse, path');
      let fillColor = '';
      if (shape) {
        const style = shape.getAttribute('style') || '';
        const fillAttr = shape.getAttribute('fill') || '';
        const fillMatch = style.match(/fill:\s*([^;!]+)/i);
        if (fillMatch) {
          fillColor = fillMatch[1].trim();
        } else if (fillAttr) {
          fillColor = fillAttr.trim();
        } else {
          try {
            fillColor = window.getComputedStyle(shape).fill;
          } catch (_) {}
        }
      }

      if (isLightColor(fillColor)) {
        cluster.classList.add('gxp-light-cluster');
        const clusterLabels = cluster.querySelectorAll('.cluster-label *, text, tspan, p, span, div');
        clusterLabels.forEach(el => {
          el.style.setProperty('color', '#090d16', 'important');
          el.style.setProperty('fill', '#090d16', 'important');
          el.style.setProperty('font-weight', '700', 'important');
        });
      }
    });
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
    a.download = `Annex22_Study_Progress_${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
  }

  exportAuditMarkdown() {
    const stats = this.getGlobalChecklistStats();
    let md = `# EU GMP Annex 22 - Study & Review Report\n\n`;
    md += `**Date:** ${new Date().toLocaleDateString()}\n`;
    md += `**Study Progress:** ${stats.percentage}% (${stats.completed}/${stats.total} criteria verified)\n\n`;
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
    a.download = `Annex22_Study_Report_${new Date().toISOString().slice(0, 10)}.md`;
    a.click();
    URL.revokeObjectURL(url);
  }

  bindEvents() {
    document.getElementById('mobileMenuBtn')?.addEventListener('click', () => {
      document.getElementById('siteSidebar')?.classList.toggle('mobile-open');
    });

    const themeWrap = document.getElementById('themePickerWrap');
    const themeTrigger = document.getElementById('themeTriggerBtn');

    themeTrigger?.addEventListener('click', (e) => {
      e.stopPropagation();
      const isOpen = themeWrap?.classList.toggle('open');
      themeTrigger.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
    });

    document.querySelectorAll('.theme-option-item').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        const targetTheme = btn.dataset.setTheme;
        if (targetTheme) {
          this.setTheme(targetTheme);
        }
      });
    });

    document.addEventListener('click', (e) => {
      if (themeWrap && !themeWrap.contains(e.target)) {
        themeWrap.classList.remove('open');
        themeTrigger?.setAttribute('aria-expanded', 'false');
      }
    });

    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && themeWrap?.classList.contains('open')) {
        themeWrap.classList.remove('open');
        themeTrigger?.setAttribute('aria-expanded', 'false');
      }
    });

    document.querySelectorAll('.lang-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        this.setLanguage(e.target.dataset.lang);
      });
    });

    document.addEventListener('click', (e) => {
      const target = e.target.closest('[data-route]');
      if (target) {
        e.preventDefault();
        const route = target.dataset.route;
        this.navigate(route);
      }

      const spaLink = e.target.closest('a[data-module]');
      if (spaLink) {
        e.preventDefault();
        const modId = spaLink.dataset.module;
        this.navigate(modId);
      }
    });

    window.addEventListener('hashchange', () => {
      const route = this.getInitialRoute();
      if (route !== this.currentModuleId) {
        this.navigate(route, false);
      }
    });

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

document.addEventListener('DOMContentLoaded', () => {
  new Annex22App();
});
