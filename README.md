# 🇪🇺 EU GMP Annex 22: AI Compliance in Pharma

Ein strukturiertes Wissens-, Qualifizierungs- und Web-Portal zum **Draft EU GMP Annex 22** („Artificial Intelligence and Machine Learning in GxP Environments“).

> [!NOTE]
> **Rechtlicher Status:** Der Annex 22 ist derzeit ein **Entwurf (Draft)** der Europäischen Kommission, EMA und PIC/S (Konsultationsphase beendet, finale Verabschiedung erwartet für Ende 2026/Anfang 2027). Behörden wenden die Grundsätze jedoch bereits heute als **„State of the Art“**-Erwartungshaltung bei Inspektionen unter Annex 11 an.

- **Themenschwerpunkte:** AI/ML-Validierung, Deterministische vs. dynamische Modelle, Explainability, Human-in-the-Loop, Datenintegrität (ALCOA+), MLOps und Audit-Readiness.
- **Zielgruppe:** QA, CSV-Validierungsexperten, IT/Data Science und Qualified Persons (QP).

---

## 🚀 Interaktives Web-Portal (Annex 22 Compliance Hub)

Aus der Wissensbasis wurde eine eigenständige, moderne Web-Applikation abgeleitet, die ein interaktives Arbeiten mit den regulatorischen Anforderungen ermöglicht:

* **🧭 Interaktiver AI-Lebenszyklus-Navigator:** Schneller visueller Durchstieg durch alle 6 Entwicklungs- und Validierungsphasen.
* **📋 Live-Audit-Checklisten:** Ausfüllbare Checklisten für alle Module mit Echtzeit-Compliance-Score, Session-Speicherung (`localStorage`) und Export als JSON/Markdown-Auditbericht.
* **🌐 Nahtlose Zweisprachigkeit:** Umschalten zwischen **Deutsch 🇩🇪** und **Englisch 🇬🇧** in Echtzeit ohne Seiten-Neuladen.
* **🔍 Instant-Volltextsuche:** `Cmd + K` oder `Strg + K` für blitzschnelles Durchsuchen aller Leitfäden, Glossarbegriffe und Kriterien.
* **🎨 Modernes Design-System:** Dark & Light Mode (`color-scheme`, Glassmorphism), dynamische Mermaid-Prozessdiagramme und responsive Drawer-Navigation.

### Web-App lokal starten:
```bash
# Abhängigkeiten installieren
npm install

# Lokalen Entwicklungsserver starten
npm run dev
# ➔ Läuft unter http://localhost:5173/

# Produktions-Bundle bauen
npm run build
```

---

## 📚 Curriculum & Modulübersicht

Die Dokumentation ist synchron in **Deutsch** (`docs/de/`) und **Englisch** (`docs/en/`) verfügbar:

| # | Modul / Thema | Deutsch 🇩🇪 | English 🇬🇧 | Kernfokus |
| :-: | :--- | :--- | :--- | :--- |
| **00** | Gesamtübersicht & Framework | [00_overview.md](docs/de/00_overview.md) | [00_overview.md](docs/en/00_overview.md) | Master-Framework, Prozesslandkarte & Status |
| **01** | Introduction to AI in GxP | [module_01...md](docs/de/module_01_introduction_ai_gxp.md) | [module_01...md](docs/en/module_01_introduction_ai_gxp.md) | 6 Säulen für Trustworthy AI & CSV-Shift |
| **02** | Overview of Annex 22 | [module_02...md](docs/de/module_02_overview_annex_22.md) | [module_02...md](docs/en/module_02_overview_annex_22.md) | Koexistenz mit Annex 11, Automation Bias |
| **03** | Scope and Applicability | [module_03...md](docs/de/module_03_scope_applicability.md) | [module_03...md](docs/en/module_03_scope_applicability.md) | 5-Stufen-Entscheidungstrichter & Risikomatrix |
| **04** | Risk Based Approach | [module_04...md](docs/de/module_04_risk_based_approach.md) | [module_04...md](docs/en/module_04_risk_based_approach.md) | ICH Q9 (R1), FMEA & Silent Degradation |
| **05** | Intended Use & Model Def | [module_05...md](docs/de/module_05_intended_use_model_definition.md) | [module_05...md](docs/en/module_05_intended_use_model_definition.md) | Zaun-Metapher, Scope Creep & OOD-Grenzen |
| **06** | Data Governance & Quality | [module_06...md](docs/de/module_06_data_governance_quality.md) | [module_06...md](docs/en/module_06_data_governance_quality.md) | ALCOA+, Data Lineage & Testdatenisolation |
| **07** | Model Development & Training | [module_07...md](docs/de/module_07_model_development_training.md) | [module_07...md](docs/en/module_07_model_development_training.md) | MLOps, Frozen Weights & 3-Wege-Splits |
| **08** | Validation & Testing | [module_08...md](docs/de/module_08_validation_performance_testing.md) | [module_08...md](docs/en/module_08_validation_performance_testing.md) | Metric Quad, Recall vs. Precision, Staff Independence |
| **09** | Explainability & Transparency | [module_09...md](docs/de/module_09_explainability_transparency.md) | [module_09...md](docs/en/module_09_explainability_transparency.md) | XAI, SHAP/LIME, Zielgruppen-Kognition |
| **10** | Human Oversight (HITL) | [module_10...md](docs/de/module_10_human_oversight_hitl.md) | [module_10...md](docs/en/module_10_human_oversight_hitl.md) | HITL vs. HOTL, Independent-First Pattern |
| **11** | Lifecycle & Monitoring | [module_11...md](docs/de/module_11_lifecycle_continuous_monitoring.md) | [module_11...md](docs/en/module_11_lifecycle_continuous_monitoring.md) | Data-/Concept-Drift, Change Control, Living Validation |
| **12** | Audit & Inspection Readiness | [module_12...md](docs/de/module_12_audit_inspection_readiness.md) | [module_12...md](docs/en/module_12_audit_inspection_readiness.md) | 5-Stufen-Pfad, Master AI Inventory, Schatten-KI |

### 📖 Spezial-Dossiers & Etablierte Industrie-Standards (Anhänge)

| Thema | Deutsch 🇩🇪 | English 🇬🇧 | Kerninhalte |
| :--- | :--- | :--- | :--- |
| **GenAI & RAG** | [appendix_genai_rag_gxp.md](docs/de/appendix_genai_rag_gxp.md) | [appendix_genai_rag_gxp.md](docs/en/appendix_genai_rag_gxp.md) | RAG-First-Architektur, ALCOA+-Zitierpflicht, RAG Triad Metriken (Groundedness), Prompt Governance und Guardrails |
| **ISPE GAMP AI** | [appendix_ispe_gamp_ai_best_practices.md](docs/de/appendix_ispe_gamp_ai_best_practices.md) | [appendix_ispe_gamp_ai_best_practices.md](docs/en/appendix_ispe_gamp_ai_best_practices.md) | Duales Lebenszyklus-Modell, GAMP-Kategorien für KI, QRM (ICH Q9 R1), Cloud/Supplier Oversight & Living Validation |

---

## 📁 Repository-Struktur

```text
Annex22/
├── README.md                                  # Gesamtübersicht & Portal-Dokumentation
├── AGENTS.md                                  # Pair-Learning & Architekturregeln
├── package.json                               # Web-App Abhängigkeiten (Vite, Marked, Mermaid)
├── vite.config.js                             # Vite Konfiguration
├── index.html                                 # Web-Portal Einstiegsseite
├── src/                                       # Web-App Quellcode
│   ├── app.js                                 # Anwendungslogik & State-Management
│   ├── style.css                              # Design System (Vanilla CSS / Dark & Light Mode)
│   ├── data.js                                # Modul-Registry & Markdown-Loader
│   ├── markdown.js                            # GFM-Parser, Alerts, Checklisten & Mermaid-Integration
│   └── search.js                              # Instant Client-Side Suchmaschine
├── docs/                                      # Zentraler Wissenshub
│   ├── de/                                    # Deutsche Master-Dokumente (SSOT, 15 Dateien)
│   └── en/                                    # Englische synchrone Spiegel-Dokumente (15 Dateien)
├── scripts/
│   ├── check_doc_sync.py                      # Verifikationsskript für DE/EN-Dokumentensynchronität
│   └── extract_transcripts.py                 # Extraktionsskript für YouTube-Transkripte
└── data/transcripts/                          # Extrahierte Untertitel
    ├── json/                                  # Rohdaten mit Timestamps
    └── markdown/                              # Lesbare Transkripte mit Zeitmarkern
```

---

## 🛠️ Wartung & Synchronisationsprüfung

Um die Konsistenz zwischen den deutschen und englischen Dokumenten sicherzustellen, existiert ein automatisches Prüfskript:

```bash
python3 scripts/check_doc_sync.py
```
*Prüft das Vorhandensein aller 15 Dokumente in beiden Sprachen sowie die `<!-- metadata ... -->`-Tags.*

---

## ✍️ Content-Pflege & Synchronisations-Workflow (Fine-Tuning)

Die Web-Applikation bindet alle Markdown-Dokumente dynamisch über Vites `import.meta.glob('/docs/**/*.md')` ein. 

### 1. Inhaltliche Änderungen (Texte, Formeln, Diagramme, Checklisten)
* **Kein Code-Eingriff nötig:** Änderungen an Fließtext, KaTeX-Formeln (`$$...$$`), Mermaid-Diagrammen oder GxP-Checklisten (`- [ ]`) werden **vollautomatisch und live** von der Web-App übernommen (Vite Hot Module Replacement).
* **Zweisprachigkeit (DE/EN-Sync):** 
  * Änderungen werden idealerweise zuerst in **`docs/de/`** ausgearbeitet und lokal im Browser gegengelesen.
  * Anschließend wird die englische Spiegeldatei in **`docs/en/`** nachgezogen.
  * Mit `python3 scripts/check_doc_sync.py` wird die Parität beider Sprachbäume validiert.

### 2. Wann muss Code in `src/` angepasst werden?
* **Neues Modul hinzugefügt oder Datei umbenannt:** Einmaliger Eintrag in [`src/data.js`](src/data.js) (`MODULE_REGISTRY` & `PHASES`), damit das Modul in der linken Navigation, der Phasen-Roadmap und der Instant-Volltextsuche indiziert wird.
* **Titel & Untertitel in der linken Navigation:** Diese Metadaten werden zentral in [`src/data.js`](src/data.js) gepflegt.
* **Neue Badge-Typen:** Wenn ein völlig neues Kennzeichnungs-Muster (z. B. `[ISO 13485]`) als farbiges Pillen-Badge gerendert werden soll, wird der Renderer in [`src/markdown.js`](src/markdown.js) erweitert.
