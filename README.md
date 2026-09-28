# 🇪🇺 EU GMP Annex 22: AI Compliance in Pharma

Ein strukturiertes Wissens- und Qualifizierungs-Repository zum **Draft EU GMP Annex 22** („Artificial Intelligence and Machine Learning in GxP Environments“).

- **Themenschwerpunkte:** AI/ML-Validierung, Deterministische vs. dynamische Modelle, Explainability, Human-in-the-Loop, Datenintegrität (ALCOA+) und Audit-Readiness.
- **Zielgruppe:** QA, CSV-Validierungsexperten, IT/Data Science und Qualified Persons (QP).

---

## 📚 Curriculum & Modulübersicht
*Das zentrale Wissens- und Prozess-Framework findest du in ➔ **[docs/00_overview.md](docs/00_overview.md)**.*

| # | Modul / Thema | Kernfokus | Status |
| :-: | :--- | :--- | :---: |
| **01** | [Introduction to AI in GxP Environments](docs/module_01_introduction_ai_gxp.md) | Die 6 Säulen für Trustworthy AI & CSV-Paradigmenwechsel | 🟢 Aufbereitet |
| **02** | [Overview of Annex 22](docs/module_02_overview_annex_22.md) | Koexistenz mit Annex 11, Automation Bias & Roadmap | 🟢 Aufbereitet |
| **03** | [Scope and Applicability of AI Systems](docs/module_03_scope_applicability.md) | 5-Stufen-Entscheidungstrichter & Risikomatrix | 🟢 Aufbereitet |
| **04** | [Risk Based Approach to AI](docs/module_04_risk_based_approach.md) | FMEA, Silent Degradation & 5 KI-Fehlermodi | 🟢 Aufbereitet |
| **05** | [Intended Use and Model Definition](docs/module_05_intended_use_model_definition.md) | Die Zaun-Metapher, Scope Creep & technische Model Definition | 🟢 Aufbereitet |
| **06** | [Data Governance and Data Quality](docs/module_06_data_governance_quality.md) | ALCOA+, Data Lineage & strikte Testdatenisolation | 🟡 Bereit |
| **07** | [AI Model Development and Training](docs/module_07_model_development_training.md) | Algorithmenauswahl, Hyperparameter & Frozen Weights | 🟡 Bereit |
| **08** | [Validation and Performance Testing](docs/module_08_validation_performance_testing.md) | Adversarial Testing, Performance-Metriken & IQ/OQ/PQ | 🟡 Bereit |
| **09** | [Explainability and Transparency](docs/module_09_explainability_transparency.md) | XAI, Black-Box-Vermeidung & proportionale Transparenz | 🟡 Bereit |
| **10** | [Human Oversight / Human in the Loop](docs/module_10_human_oversight_hitl.md) | HITL vs. HOTL, Override-Befugnis & Operator-Qualifikation | 🟡 Bereit |
| **11** | [Lifecycle Management and Continuous Monitoring](docs/module_11_lifecycle_continuous_monitoring.md) | Data- & Concept-Drift-Erkennung, Alarmschwellen & Retraining | 🟡 Bereit |
| **12** | [Audit and Inspection Readiness](docs/module_12_audit_inspection_readiness.md) | AI-Inventar, Inspektionssimulation & Behördenverteidigung | 🟡 Bereit |

---

## 📁 Repository-Struktur

```text
Annex22/
├── README.md                                  # Gesamtübersicht & Curriculum
├── AGENTS.md                                  # Arbeitsweise & Dokumentationsregeln
├── requirements.txt                           # Python-Abhängigkeiten
├── scripts/
│   └── extract_transcripts.py                 # Extraktionsskript für YouTube-Transkripte
├── data/transcripts/                          # Extrahierte Untertitel
│   ├── json/                                  # Rohdaten mit Timestamps
│   └── markdown/                              # Lesbare Transkripte mit Zeitmarkern
└── docs/                                      # Zentraler Wissenshub
    ├── 00_overview.md        # Master-Framework & Prozesslandkarte
    ├── module_01_introduction_ai_gxp.md       # Modul 01: Einführung & 6 Säulen
    ├── module_02_overview_annex_22.md          # Modul 02: Koexistenz mit Annex 11
    ├── module_03_scope_applicability.md       # Modul 03: Decision Funnel & Risikostufen
    ├── module_04_risk_based_approach.md       # Modul 04: FMEA & KI-Fehlermodi
    ├── module_05_intended_use_model_def.md    # Modul 05: Spezifikation & Grenzen
    └── module_06_... bis module_12_...        # Vorbereitete Module
```

---

### 1. Transkripte aktualisieren oder neu laden
Das Python-Skript holt die Originaluntertitel der YouTube-Videos und generiert lesbare Markdown-Texte mit Timecodes:
```bash
source .venv/bin/activate
python scripts/extract_transcripts.py
```

### 2. Zusammenfassungen & Notizen bearbeiten
Jedes Modul liegt als eigenständige Datei in `docs/module_XX_...md` mit:
- Kernanforderungen & Lernzielen
- Zweisprachigen Zusammenfassungen (Deutsche Erläuterungen mit englischen GxP-Originalbegriffen)
- Glossar & Konzeptübersicht
- GxP-Compliance Checklist & Kontrollfragen

### 3. Mit dem AI-Pair-Programmer lernen
Du kannst den KI-Assistenten jederzeit bitten:
- *„Fasse Modul 1 detailliert auf Deutsch zusammen und hebe die Annex-22-Knackpunkte hervor.“*
- *„Erstelle mir 5 Prüfungsfragen zu Modul 4 (Risk-based Approach).“*
- *„Wie grenzt Annex 22 statische gegen kontinuierlich lernende Modelle ab?“*

---

## 🏛️ Regulatorischer Hintergrund
Siehe auch [docs/00_overview.md](docs/00_overview.md) für die Einordnung von Annex 22 im Verhältnis zu **Annex 11**, dem **EU AI Act** und **GAMP 5**.
