# 🇪🇺 EU GMP Annex 22: AI Compliance in Pharma - Lernprojekt

Ein interaktives Wissens- und Lern-Repository zum **Draft EU GMP Annex 22** („Artificial Intelligence and Machine Learning in GxP Environments“), basierend auf der 12-teiligen Fachreihe.

- **YouTube Playlist:** [EU GMP Annex 22 AI Compliance in Pharma](https://youtube.com/playlist?list=PLsyAi2EwvNNjE-uAH1N_3d6JBa8yF8v1L)
- **Hauptthemen:** AI/ML-Validierung, Deterministische vs. dynamische Modelle, Explainability, Human-in-the-Loop, Datenintegrität (ALCOA+) und Audit-Readiness.

---

## 📚 Curriculum & Modulübersicht
*Das zentrale Wissens- und Prozess-Framework findest du in ➔ **[docs/annex22_regulatory_framework.md](docs/annex22_regulatory_framework.md)**.*

| # | Modul / Thema | Dauer | Transkript | Lernnotizen | Status |
| :-: | :--- | :---: | :---: | :---: | :---: |
| **01** | [Introduction to AI in GxP Environments](docs/module_01_introduction_ai_gxp.md) | 09:50 | [Markdown](data/transcripts/markdown/module_01_transcript.md) | [Study Notes](docs/module_01_introduction_ai_gxp.md) | 🟢 Aufbereitet |
| **02** | [Overview of Annex 22](docs/module_02_overview_annex_22.md) | 08:02 | [Markdown](data/transcripts/markdown/module_02_transcript.md) | [Study Notes](docs/module_02_overview_annex_22.md) | 🟢 Aufbereitet |
| **03** | [Scope and Applicability of AI Systems](docs/module_03_scope_applicability.md) | 08:35 | [Markdown](data/transcripts/markdown/module_03_transcript.md) | [Study Notes](docs/module_03_scope_applicability.md) | 🟢 Aufbereitet |
| **04** | [Risk Based Approach to AI](docs/module_04_risk_based_approach.md) | 10:12 | [Markdown](data/transcripts/markdown/module_04_transcript.md) | [Study Notes](docs/module_04_risk_based_approach.md) | 🟢 Aufbereitet |
| **05** | [Intended Use and Model Definition](docs/module_05_intended_use_model_definition.md) | 08:25 | [Markdown](data/transcripts/markdown/module_05_transcript.md) | [Study Notes](docs/module_05_intended_use_model_definition.md) | 🟢 Aufbereitet |
| **06** | [Data Governance and Data Quality](docs/module_06_data_governance_quality.md) | 09:18 | *(in Sync)* | [Study Notes](docs/module_06_data_governance_quality.md) | 🟡 Bereit |
| **07** | [AI Model Development and Training](docs/module_07_model_development_training.md) | 09:21 | *(in Sync)* | [Study Notes](docs/module_07_model_development_training.md) | 🟡 Bereit |
| **08** | [Validation and Performance Testing](docs/module_08_validation_performance_testing.md) | 10:26 | *(in Sync)* | [Study Notes](docs/module_08_validation_performance_testing.md) | 🟡 Bereit |
| **09** | [Explainability and Transparency](docs/module_09_explainability_transparency.md) | 08:14 | *(in Sync)* | [Study Notes](docs/module_09_explainability_transparency.md) | 🟡 Bereit |
| **10** | [Human Oversight / Human in the Loop](docs/module_10_human_oversight_hitl.md) | 07:19 | *(in Sync)* | [Study Notes](docs/module_10_human_oversight_hitl.md) | 🟡 Bereit |
| **11** | [Lifecycle Management and Continuous Monitoring](docs/module_11_lifecycle_continuous_monitoring.md) | 09:38 | *(in Sync)* | [Study Notes](docs/module_11_lifecycle_continuous_monitoring.md) | 🟡 Bereit |
| **12** | [Audit and Inspection Readiness](docs/module_12_audit_inspection_readiness.md) | 09:13 | *(in Sync)* | [Study Notes](docs/module_12_audit_inspection_readiness.md) | 🟡 Bereit |

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
    ├── annex22_regulatory_framework.md        # Master-Framework & Prozesslandkarte
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
Siehe auch [docs/annex22_regulatory_framework.md](docs/annex22_regulatory_framework.md) für die Einordnung von Annex 22 im Verhältnis zu **Annex 11**, dem **EU AI Act** und **GAMP 5**.
