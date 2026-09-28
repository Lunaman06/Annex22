// src/data.js
// Loads all markdown files and structures them into modules with metadata

const rawDocs = import.meta.glob('/docs/**/*.md', { query: '?raw', import: 'default', eager: true });

export const MODULE_REGISTRY = [
  {
    id: '00_overview',
    number: '00',
    phase: 0,
    file: '00_overview.md',
    title: {
      de: 'Gesamtübersicht & Framework',
      en: 'Master Overview & Framework'
    },
    subtitle: {
      de: 'Der regulatorische Kompass für AI/ML in der pharmazeutischen Produktion',
      en: 'The regulatory compass for AI/ML in pharmaceutical manufacturing'
    },
    icon: 'compass',
    badge: { de: 'Framework', en: 'Framework' }
  },
  {
    id: 'module_01_introduction_ai_gxp',
    number: '01',
    phase: 1,
    file: 'module_01_introduction_ai_gxp.md',
    title: {
      de: 'Modul 01: KI im GxP-Umfeld',
      en: 'Module 01: Introduction to AI in GxP'
    },
    subtitle: {
      de: 'Von deterministischer CSV zur datengetriebenen KI-Validierung',
      en: 'From deterministic CSV to data-driven AI validation'
    },
    icon: 'brain-circuit',
    badge: { de: 'Phase 1: Scope', en: 'Phase 1: Scope' }
  },
  {
    id: 'module_02_overview_annex_22',
    number: '02',
    phase: 1,
    file: 'module_02_overview_annex_22.md',
    title: {
      de: 'Modul 02: Überblick Annex 22',
      en: 'Module 02: Overview of Annex 22'
    },
    subtitle: {
      de: 'Struktur, Kernparagrafen und Zusammenspiel mit Annex 11',
      en: 'Structure, core clauses, and interaction with Annex 11'
    },
    icon: 'book-open',
    badge: { de: 'Phase 1: Scope', en: 'Phase 1: Scope' }
  },
  {
    id: 'module_03_scope_applicability',
    number: '03',
    phase: 1,
    file: 'module_03_scope_applicability.md',
    title: {
      de: 'Modul 03: Scope & Applicability',
      en: 'Module 03: Scope & Applicability'
    },
    subtitle: {
      de: 'Geltungsbereich, COTS vs. Custom und dynamische Modelle',
      en: 'Application scope, COTS vs. Custom, and dynamic models'
    },
    icon: 'target',
    badge: { de: 'Phase 1: Scope', en: 'Phase 1: Scope' }
  },
  {
    id: 'module_04_risk_based_approach',
    number: '04',
    phase: 2,
    file: 'module_04_risk_based_approach.md',
    title: {
      de: 'Modul 04: Risk-Based Approach',
      en: 'Module 04: Risk-Based Approach'
    },
    subtitle: {
      de: 'Qualitäts-Risikomanagement nach ICH Q9 (R1) für KI-Systeme',
      en: 'Quality Risk Management under ICH Q9 (R1) for AI systems'
    },
    icon: 'shield-alert',
    badge: { de: 'Phase 2: Risk', en: 'Phase 2: Risk' }
  },
  {
    id: 'module_05_intended_use_model_definition',
    number: '05',
    phase: 2,
    file: 'module_05_intended_use_model_definition.md',
    title: {
      de: 'Modul 05: Intended Use & Definition',
      en: 'Module 05: Intended Use & Definition'
    },
    subtitle: {
      de: 'Spezifikation, Systemgrenzen und OOD-Gefahrenabwehr',
      en: 'Specification, system boundaries, and OOD hazard mitigation'
    },
    icon: 'file-text',
    badge: { de: 'Phase 2: Risk', en: 'Phase 2: Risk' }
  },
  {
    id: 'module_06_data_governance_quality',
    number: '06',
    phase: 2,
    file: 'module_06_data_governance_quality.md',
    title: {
      de: 'Modul 06: Data Governance & Quality',
      en: 'Module 06: Data Governance & Quality'
    },
    subtitle: {
      de: 'ALCOA+, Datenherkunft, Labeling-Audits und Bias-Mitigation',
      en: 'ALCOA+, data provenance, labeling audits, and bias mitigation'
    },
    icon: 'database',
    badge: { de: 'Phase 2: Data', en: 'Phase 2: Data' }
  },
  {
    id: 'module_07_model_development_training',
    number: '07',
    phase: 3,
    file: 'module_07_model_development_training.md',
    title: {
      de: 'Modul 07: Development & Training',
      en: 'Module 07: Development & Training'
    },
    subtitle: {
      de: 'MLOps, 3-Wege-Datensplit, Reproduzierbarkeit & Frozen Weights',
      en: 'MLOps, 3-way split, reproducibility & frozen weights'
    },
    icon: 'cpu',
    badge: { de: 'Phase 3: Engineering', en: 'Phase 3: Engineering' }
  },
  {
    id: 'module_08_validation_performance_testing',
    number: '08',
    phase: 3,
    file: 'module_08_validation_performance_testing.md',
    title: {
      de: 'Modul 08: Validation & Testing',
      en: 'Module 08: Validation & Testing'
    },
    subtitle: {
      de: 'Das Metric Quad, asymmetrische Kosten und personelle Unabhängigkeit',
      en: 'The Metric Quad, asymmetric costs, and staff independence'
    },
    icon: 'check-check',
    badge: { de: 'Phase 3: Validation', en: 'Phase 3: Validation' }
  },
  {
    id: 'module_09_explainability_transparency',
    number: '09',
    phase: 3,
    file: 'module_09_explainability_transparency.md',
    title: {
      de: 'Modul 09: Explainability & Transparency',
      en: 'Module 09: Explainability & Transparency'
    },
    subtitle: {
      de: 'White vs. Black Box, SHAP, LIME und zielgruppengerechte Kognition',
      en: 'White vs. Black Box, SHAP, LIME, and audience cognition'
    },
    icon: 'sparkles',
    badge: { de: 'Phase 3: Explainability', en: 'Phase 3: Explainability' }
  },
  {
    id: 'module_10_human_oversight_hitl',
    number: '10',
    phase: 4,
    file: 'module_10_human_oversight_hitl.md',
    title: {
      de: 'Modul 10: Human Oversight (HITL)',
      en: 'Module 10: Human Oversight (HITL)'
    },
    subtitle: {
      de: 'HITL-Pflicht, Automation Bias und das Independent-First-Pattern',
      en: 'HITL mandate, automation bias, and independent-first pattern'
    },
    icon: 'user-check',
    badge: { de: 'Phase 4: Operations', en: 'Phase 4: Operations' }
  },
  {
    id: 'module_11_lifecycle_continuous_monitoring',
    number: '11',
    phase: 4,
    file: 'module_11_lifecycle_continuous_monitoring.md',
    title: {
      de: 'Modul 11: Lifecycle & Monitoring',
      en: 'Module 11: Lifecycle & Monitoring'
    },
    subtitle: {
      de: 'Data/Concept Drift, Change Control und Living Validation',
      en: 'Data/concept drift, change control, and living validation'
    },
    icon: 'activity',
    badge: { de: 'Phase 4: Operations', en: 'Phase 4: Operations' }
  },
  {
    id: 'module_12_audit_inspection_readiness',
    number: '12',
    phase: 4,
    file: 'module_12_audit_inspection_readiness.md',
    title: {
      de: 'Modul 12: Audit & Inspection Readiness',
      en: 'Module 12: Audit & Inspection Readiness'
    },
    subtitle: {
      de: '5-Stufen-Inspektionspfad, Master AI Inventory und Schatten-KI',
      en: '5-step inspection path, master AI inventory, and shadow AI'
    },
    icon: 'file-search',
    badge: { de: 'Phase 4: Inspection', en: 'Phase 4: Inspection' }
  },
  {
    id: 'appendix_genai_rag_gxp',
    number: 'A1',
    phase: 5,
    file: 'appendix_genai_rag_gxp.md',
    title: {
      de: 'Anhang: GenAI, LLMs & RAG',
      en: 'Appendix: GenAI, LLMs & RAG'
    },
    subtitle: {
      de: 'RAG-First Architektur, RAG Triad, Guardrails und Prompt-Governance',
      en: 'RAG-first architecture, RAG triad, guardrails, and prompt governance'
    },
    icon: 'bot',
    badge: { de: 'Spezial-Guide', en: 'Special Guide' }
  },
  {
    id: 'appendix_ispe_gamp_ai_best_practices',
    number: 'A2',
    phase: 5,
    file: 'appendix_ispe_gamp_ai_best_practices.md',
    title: {
      de: 'Anhang: ISPE GAMP® AI Guide',
      en: 'Appendix: ISPE GAMP® AI Guide'
    },
    subtitle: {
      de: 'Duales Lebenszyklus-Modell, ICH Q9 R1 und Lieferanten-Governance',
      en: 'Dual lifecycle model, ICH Q9 R1, and vendor governance'
    },
    icon: 'award',
    badge: { de: 'Spezial-Guide', en: 'Special Guide' }
  }
];

export const PHASES = [
  {
    id: 1,
    title: { de: 'Phase 1: Grundlagen & Scope', en: 'Phase 1: Foundations & Scope' },
    modules: ['module_01_introduction_ai_gxp', 'module_02_overview_annex_22', 'module_03_scope_applicability']
  },
  {
    id: 2,
    title: { de: 'Phase 2: Risiko & Daten-Governance', en: 'Phase 2: Risk & Data Governance' },
    modules: ['module_04_risk_based_approach', 'module_05_intended_use_model_definition', 'module_06_data_governance_quality']
  },
  {
    id: 3,
    title: { de: 'Phase 3: Modell-Engineering & Validierung', en: 'Phase 3: Model Engineering & Validation' },
    modules: ['module_07_model_development_training', 'module_08_validation_performance_testing', 'module_09_explainability_transparency']
  },
  {
    id: 4,
    title: { de: 'Phase 4: Betrieb, Aufsicht & Audits', en: 'Phase 4: Operations, Oversight & Audits' },
    modules: ['module_10_human_oversight_hitl', 'module_11_lifecycle_continuous_monitoring', 'module_12_audit_inspection_readiness']
  },
  {
    id: 5,
    title: { de: 'Praxis-Leitfäden & Industrie-Standards', en: 'Specialized Practice Guides' },
    modules: ['appendix_genai_rag_gxp', 'appendix_ispe_gamp_ai_best_practices']
  }
];

export function getDocContent(moduleId, lang = 'de') {
  const mod = MODULE_REGISTRY.find(m => m.id === moduleId);
  if (!mod) return null;
  const path = `/docs/${lang}/${mod.file}`;
  return rawDocs[path] || null;
}

export function getAllDocEntries() {
  return rawDocs;
}
