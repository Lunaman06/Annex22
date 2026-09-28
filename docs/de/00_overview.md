# EU GMP Annex 22: Leitfaden & Gesamtübersicht

<div align="center">

🌐 **[Switch to English Version](../en/00_overview.md)**

</div>

> **Executive Summary:**  
> Dieses Dokument dient als zentrale Einführung und thematische Orientierungslandkarte. Es vermittelt das übergeordnete Verständnis für den **Draft EU GMP Annex 22** („Artificial Intelligence and Machine Learning in GxP Environments“) und führt zielgerichtet in die vertiefenden Fachmodule.

---

## 1. Was ist Annex 22 und warum ist er ein Wendepunkt?

Für Jahrzehnte stützte sich die pharmazeutische Industrie bei computergestützten Systemen auf **EU GMP Annex 11** (deterministische Software: *gleicher Input führt immer zum gleichen Output*). Moderne KI- und Machine-Learning-Systeme lernen jedoch emergent aus Daten und können im Betrieb schleichend degradieren (*Silent Drift*).

Mit dem im Juli 2025 von der Europäischen Kommission (EMA / PIC/S) vorgelegten **Draft Annex 22** entsteht der weltweit erste spezifische regulatorische Rahmen für den Einsatz von KI in der pharmazeutischen Produktion.

```mermaid
graph LR
    subgraph DigitalPackage["EudraLex Vol. 4 Digital Package (2025/2026)"]
        direction TB
        P1["Kapitel 4 Revision<br/><i>(Dokumentation & Datenintegrität)</i>"]
        P2["Annex 11 Revision<br/><i>(Computerised Systems: Cloud, Agile, QMS)</i>"]
        P3["Annex 22 Neufassung<br/><i>(Artificial Intelligence & ML)</i>"]
    end

    A["EU AI Act<br/>(Horizontale Produktsicherheit)"] --> DigitalPackage
    DigitalPackage ==> D["GMP-Produktion, QC-Labor & Chargenfreigabe"]

    style DigitalPackage fill:#f8fafc,stroke:#0284c7,stroke-width:2px
    style D fill:#f0fdf4,stroke:#16a34a,stroke-width:2px
```

### Rechtlicher Status & Verbindlichkeit:
* **Aktueller Status (Stand 2026):** Der Annex 22 ist derzeit ein **Draft (Konsultationsentwurf)** der Europäischen Kommission / EMA und PIC/S. Die öffentliche Konsultationsphase endete am **7. Oktober 2025**. Auf dem anschließenden *EMA Multi-Stakeholder Workshop* (30. Juni / 1. Juli 2026) wurden Rückmeldungen und Weiterentwicklungen erörtert; eine Neubewertung einzelner Restriktionen (z. B. GenAI-Ausschluss) ist Gegenstand laufender Prüfungen durch die Inspektorengruppen, ein förmlicher Änderungsbeschluss liegt jedoch noch nicht vor. Die finale Veröffentlichung wird für **Ende 2026 / Anfang 2027** erwartet.
* **Faktische Prüfungsrelevanz heute:** Obwohl formell noch im Entwurfsstadium, orientieren sich europäische Aufsichtsbehörden und Inspektoren bereits heute an den Grundprinzipien des Drafts als aktuellem **„State of the Art“** im Rahmen von Annex-11-Inspektionen.
* **Das EudraLex Digital Package:** Annex 22 steht nicht isoliert, sondern bildet zusammen mit der Revision von **Annex 11** (Computerised Systems) und **Kapitel 4** (Dokumentation) das modernisierte regulatorische Digitalpaket der europäischen Arzneimittelproduktion.

### Die 3 Kernbotschaften:
1. **Annex 22 ergänzt Annex 11 ([Draft §1]):** Der Draft versteht sich explizit als ergänzende Leitlinie (*additional guidance*) zu EU GMP Annex 11 (Computerised Systems). Annex 11 bleibt das Fundament (IQ/OQ, physische Kontrollen, Audit Trails, Cloud-Sicherheit). Annex 22 regelt die spezifischen Anforderungen lernender Algorithmen.
2. **Geltungsbereich: Statische Modelle und deterministischer Output ([Draft §1]):** Der Draft gilt ausschließlich für statische Modelle und Modelle mit deterministischem Output in kritischen GMP-Prozessen. Dynamische Modelle (kontinuierliches Online-Retraining) und Modelle mit probabilistischem Output werden vom Draft nicht abgedeckt und sollen in kritischen GMP-Anwendungen nicht verwendet werden (*„should not be used“*).
3. **Gesamtverantwortung & Human Oversight ([Draft §2.2, §3.3, §10.5]):** Der regulierte pharmazeutische Unternehmer behält stets die uneingeschränkte Verantwortung für Produktqualität, Patientensicherheit und Datenintegrität – auch beim Einsatz externer Softwarelieferanten ([Draft §2.2]). Menschliche Aufsicht ist verbindlich geregelt, insbesondere wenn Testaufwände durch Modellassistenz reduziert wurden.

### 🏷️ Kennzeichnungskonvention im Projekt (Attribution & Evidenzstufen)
Zur eindeutigen Trennung zwischen behördlichen Vorgaben und Industriepraxis gilt in allen Modulen:
* **`[Draft §X.Y]`**: Konkrete regulatorische Anforderung oder Aussage aus dem offiziellen Konsultationsentwurf EU GMP Annex 22 (Juli 2025) mit exakter Fundstelle.
* **`[Best Practice: Quelle]`**: Anerkannte Methoden und Industriestandards mit benannter Quelle (z. B. `[Best Practice: ISPE GAMP AI Guide]`, `[Best Practice: ICH Q9 (R1)]` oder `[Best Practice: ML-Praxis]`).
* **`[Didaktik]`**: Didaktische Modelle, Strukturierungshilfen, Analogien (z. B. „Zaun-Metapher“) und illustrative Fallbeispiele dieses Lernprojekts.

---

## 2. Gesamtprozess-Landkarte & Modul-Wegweiser

Die folgende Landkarte verbindet das regulatorische Fundament direkt mit den operativen Phasen des AI/ML Lifecycles und dient als zentraler Navigator durch alle 12 Fachmodule:

```mermaid
flowchart TD
    subgraph S0["🧭 Einstieg & Regulatorisches Fundament"]
        M01["Modul 01: Intro to AI in GxP<br/><i>(CSV-Grenzen, Fallstudien & 6 Trust-Säulen)</i>"]
        M02["Modul 02: Overview Annex 22<br/><i>(Harmonisierung mit Annex 11 & 5-Stufen-Roadmap)</i>"]
        M03["Modul 03: Scope & Applicability<br/><i>(5-Stufen-Entscheidungstrichter & Risikoklassen)</i>"]
        M01 --> M02 --> M03
    end

    subgraph S1["Phase I: Spezifikation & Risikomanagement"]
        M04["Modul 04: Risk-Based Approach<br/><i>(Proportionalität, 5 Fehlermodi & Kritikalität)</i>"]
        M05["Modul 05: Intended Use & Boundaries<br/><i>(Systemgrenzen, 'Zaun-Metapher' & Lineage)</i>"]
        M04 --> M05
    end

    subgraph S2["Phase II: Daten-Governance & Modellentwicklung"]
        M06["Modul 06: Data Governance & Quality<br/><i>(ALCOA+ für Daten, Split-Integrität & Bias)</i>"]
        M07["Modul 07: Model Development & Training<br/><i>(Algorithmenwahl, Frozen Weights & Versionierung)</i>"]
        M06 --> M07
    end

    subgraph S3["Phase III: Validierung & Erklärbarkeit"]
        M08["Modul 08: Validation & Performance Testing<br/><i>(Adversarial Testing, Metriken & Staff Independence)</i>"]
        M09["Modul 09: Explainability & Transparency<br/><i>(XAI, Vermeidung von Black-Boxes & Audit-Fähigkeit)</i>"]
        M08 --> M09
    end

    subgraph S4["Phase IV: GxP-Betrieb, Human Oversight & Überwachung"]
        M10["Modul 10: Human Oversight (HITL)<br/><i>(Active Challenge, Override & QP-Verantwortung)</i>"]
        M11["Modul 11: Continuous Monitoring<br/><i>(Früherkennung von Silent Drift & Retraining)</i>"]
        M12["Modul 12: Audit & Inspection Readiness<br/><i>(EMA/FDA-Inspektionssimulation & Rote Flaggen)</i>"]
        M10 --> M11 --> M12
    end

    subgraph SA["📖 Spezial-Leitfäden (Industrie-Best-Practices)"]
        APP_GEN["🤖 Spezial-Leitfaden: GenAI, LLMs & RAG<br/><i>(RAG Triad, Guardrails & Drafting Assistant)</i>"]
        APP_GAMP["📘 ISPE GAMP® AI Guide (Juli 2025)<br/><i>(Duales V-Modell, Software-Kategorien & Living Validation)</i>"]
    end

    S0 ==> S1
    S1 ==> S2
    S2 ==> S3
    S3 ==> S4

    M03 -. Sonderstatus .-> APP_GEN
    S3 -. Methodik & QRM .-> APP_GAMP

    style S0 fill:#f8fafc,stroke:#64748b,stroke-width:2px
    style S1 fill:#eff6ff,stroke:#3b82f6,stroke-width:2px
    style S2 fill:#f0fdf4,stroke:#22c55e,stroke-width:2px
    style S3 fill:#faf5ff,stroke:#a855f7,stroke-width:2px
    style S4 fill:#fff7ed,stroke:#f97316,stroke-width:2px
    style SA fill:#fdf4ff,stroke:#c026d3,stroke-width:2px
```

---

### Direkte Navigation durch die Lifecycle-Phasen

#### 🧭 Einstieg & Regulatorisches Fundament
*Welche Systeme fallen unter Annex 22 und wie grenzen wir uns sauber ab?*
- **[Modul 01: Introduction to AI in GxP Environments](module_01_introduction_ai_gxp.md)**  
  *Warum klassische CSV für KI versagt, reale Pharma-Fallstudien und die 6 Säulen für Trustworthy AI.*
- **[Modul 02: Overview of Annex 22](module_02_overview_annex_22.md)**  
  *Das Zusammenspiel mit Annex 11, Schutz vor Automation Bias und die 5-stufige Umsetzungs-Roadmap.*
- **[Modul 03: Scope and Applicability of AI Systems](module_03_scope_applicability.md)**  
  *Der 5-Stufen-Entscheidungstrichter (Decision Funnel), die 4 Risikostufen und das verbindliche AI-Inventar.*

#### ⚖️ Phase I: Spezifikation & Risikobewertung
*Wie tief müssen wir validieren und wo ziehen wir die unverrückbaren Systemgrenzen?*
- **[Modul 04: Risk Based Approach to AI](module_04_risk_based_approach.md)**  
  *Proportionalitätsgebot, Silent Degradation, die 5 KI-spezifischen Fehlermodi und HITL vs. HOTL.*
- **[Modul 05: Intended Use and Model Definition](module_05_intended_use_model_definition.md)**  
  *Das vertragliche Herzstück: Die Zaun-Metapher, Scope Creep und technische Model Lineage.*

#### 🔬 Phase II: Daten-Governance & Modellentwicklung
*Wie stellen wir sicher, dass Daten und Algorithmus von Grund auf GxP-konform sind?*
- **[Modul 06: Data Governance and Data Quality](module_06_data_governance_quality.md)**  
  *ALCOA+ für Trainingsdaten, Data Lineage und strikte Trennung von Testdatensätzen (Split-Integrität).*
- **[Modul 07: AI Model Development and Training](module_07_model_development_training.md)**  
  *Algorithmenauswahl, Feature Engineering, Cloud-Oversight und unveränderliche Modellversionierung (Frozen Weights).*

#### 🧪 Phase III: Validierung & Erklärbarkeit
*Wie beweisen wir Robustheit gegen unerwartete Eingaben und machen Entscheidungen transparent?*
- **[Modul 08: Validation and Performance Testing](module_08_validation_performance_testing.md)**  
  *Adversarial Testing, Performance-Metriken (Metric Quad), personelle Unabhängigkeit (Staff Independence) und GAMP-Mapping.*
- **[Modul 09: Explainability and Transparency](module_09_explainability_transparency.md)**  
  *Explainable AI (XAI), Vermeidung von Black-Boxes und inspektionsfeste Transparenz für Auditoren.*

#### 🛡️ Phase IV: GxP-Betrieb, Human Oversight & Überwachung
*Wie bleibt das System über Jahre hinweg im validierten Zustand und inspections-ready?*
- **[Modul 10: Human Oversight / Human in the Loop](module_10_human_oversight_hitl.md)**  
  *Aktives Challenge-Design, Übersteuerungsbefugnis (Override) und Qualifikation von Personal & QP.*
- **[Modul 11: Lifecycle Management and Continuous Monitoring](module_11_lifecycle_continuous_monitoring.md)**  
  *Früherkennung von Data- & Concept-Drift, Alarmschwellen und kontrolliertes Retraining via Change Control.*
- **[Modul 12: Audit and Inspection Readiness](module_12_audit_inspection_readiness.md)**  
  *Inspektionssimulationen, Verteidigung vor Behörden (EMA/FDA) und typische Rote Flaggen.*

#### 📖 Spezial-Dossiers & Etablierte Industrie-Standards (Anhänge)
*Vertiefende Best Practices für moderne Automatisierungen und Lebenszyklus-Methodik:*
- 🤖 **[Leitfaden: Generative KI (GenAI), LLMs & RAG im GxP-Umfeld](appendix_genai_rag_gxp.md)**  
  *Sonderstatus unter Annex 22, RAG-Architektur, ALCOA+-Zitierpflicht, das Metrik-Trio der „RAG Triad“ (Groundedness, Context Relevance, Answer Relevance), Prompt Governance als Code und deterministische Guardrails.*
- 📘 **[Leitfaden: ISPE GAMP® AI Guide & Etablierte Industrie-Best-Practices](appendix_ispe_gamp_ai_best_practices.md)**  
  *Das duale Lebenszyklus-Modell (Software- vs. Daten-Zyklus), GAMP-Kategorisierung für KI (Cat 1 bis Cat 5), Quality Risk Management nach ICH Q9 (R1), Cloud/Supplier Oversight und Living Validation.*

---

## 3. Die goldenen Regeln für die Praxis (Executive Rules)

| # | Grundsatz | Konkrete Bedeutung für das Projekt |
| :-: | :--- | :--- |
| **1** | **Keine Black-Box ohne Zaun** | Jedes KI-System benötigt vor Beginn eine genehmigte *Intended Use Specification* mit festen Out-of-Scope-Bedingungen. |
| **2** | **Kein unkontrolliertes Weiterlernen ([Draft §1])** | Dynamische Modelle (Online-Lernen) und probabilistische Ausgaben sollen in kritischen GMP-Anwendungen nicht verwendet werden; für kritische Prozesse gelten nur statische Modelle mit Frozen Weights ([Draft §1]). |
| **3** | **Daten wie Rohstoffe behandeln** | Trainingsdaten unterliegen denselben ALCOA+-Standards wie pharmazeutische Wirkstoffe. |
| **4** | **Echtes Hinterfragen (Active Challenge)** | Menschliche Prüfer müssen unabhängig einstufen können, um unkritisches Abnicken (*Automation Bias*) auszuschließen. |
| **5** | **Instrumentierung gegen Silent Drift** | Ein KI-System muss ab Tag 1 über ein statistisches Monitoring verfügen, das Leistungsabfälle sofort meldet. |

---

## 4. Spezial-Leitfäden & Industrie-Best-Practices (Anhänge)

Zur Schließung spezifischer technischer Lücken und für moderne Automatisierungsarchitekturen stehen zwei vertiefende Spezial-Dossiers bereit:

* 🤖 **[Leitfaden: Generative KI (GenAI), LLMs & RAG im GxP-Umfeld](appendix_genai_rag_gxp.md)**  
  *Sonderstatus unter Annex 22, RAG-Architektur, ALCOA+-Zitierpflicht, das Metrik-Trio der „RAG Triad“ (Groundedness, Context Relevance, Answer Relevance), Prompt Governance als Code und deterministische Guardrails.*
* 📘 **[Leitfaden: ISPE GAMP® AI Guide & Etablierte Industrie-Best-Practices](appendix_ispe_gamp_ai_best_practices.md)**  
  *Das duale Lebenszyklus-Modell (Software- vs. Daten-Zyklus), GAMP-Kategorisierung für KI (Cat 1 bis Cat 5), Quality Risk Management nach ICH Q9 (R1), Lieferanten- & Cloud-Oversight sowie das Konzept der „Living Validation“.*
