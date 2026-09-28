# Master-Übersicht & Regulatorisches Framework: EU GMP Annex 22

> **Dokumentstatus:** Zentrale Wissens- und Referenzlandkarte für das gesamte Annex 22 Lernprojekt.  
> **Geltungsbereich:** Artificial Intelligence (AI) and Machine Learning (ML) in GxP/pharmazeutischen Umgebungen (Draft Juli 2025, European Commission / EMA / PIC/S).

---

## 🧭 Schnellzugriff & Modul-Navigation

| Grundlagen & Scope | Risikomanagement & Spezifikation | Daten, Modell & Validierung | Überwachung & Audits |
| :--- | :--- | :--- | :--- |
| • [Modul 01: Intro to AI in GxP](module_01_introduction_ai_gxp.md)<br/>• [Modul 02: Overview Annex 22](module_02_overview_annex_22.md)<br/>• [Modul 03: Scope & Applicability](module_03_scope_applicability.md) | • [Modul 04: Risk-Based Approach](module_04_risk_based_approach.md)<br/>• [Modul 05: Intended Use & Model Def](module_05_intended_use_model_definition.md) | • [Modul 06: Data Governance](module_06_data_governance_quality.md)<br/>• [Modul 07: Model Development](module_07_model_development_training.md)<br/>• [Modul 08: Validation & Testing](module_08_validation_performance_testing.md)<br/>• [Modul 09: Explainability](module_09_explainability_transparency.md) | • [Modul 10: Human Oversight (HITL)](module_10_human_oversight_hitl.md)<br/>• [Modul 11: Continuous Monitoring](module_11_lifecycle_continuous_monitoring.md)<br/>• [Modul 12: Audit Readiness](module_12_audit_inspection_readiness.md) |

---

## 1. Einordnung in das regulatorische Gefüge

Annex 22 existiert nicht isoliert, sondern schlägt die Brücke zwischen horizontalem EU-Recht und den spezifischen pharmazeutischen Qualitätsstandards. Details zu den Grundlagen findest du in **[Modul 01](module_01_introduction_ai_gxp.md)** und **[Modul 02](module_02_overview_annex_22.md)**.

```mermaid
graph TD
    A["🇪🇺 EU AI Act<br/>(Horizontale Produktsicherheits-Verordnung)"] --> D["🇪🇺 EU GMP Annex 22<br/>(Vertikaler Pharma-Standard für AI/ML)"]
    B["📋 EU GMP Annex 11<br/>(Computerised Systems & CSV-Basis)"] --> D
    C["🏛️ ICH Q9 (R1)<br/>(Quality Risk Management)"] --> D
    E["📖 EU GMP Kapitel 4<br/>(Dokumentation & ALCOA+)"] --> D
    F["⚙️ GAMP 5 2nd Edition<br/>(Good Automated Manufacturing Practice)"] -.-> D
    D ==> G["🏭 Pharmazeutische Produktion, QC-Labor & Chargenfreigabe (QP)"]
```

### Die Rollenteilung der Regularien
| Regelwerk | Regelungsbereich | Rolle im Verhältnis zu Annex 22 |
| :--- | :--- | :--- |
| **EU AI Act** | Gesamtwirtschaftlich (horizontal), risikobasiert (Minimal, Hochrisiko, Verboten). | Übergeordneter Rechtsrahmen für KI-Sicherheit, Grundrechte und Transparenz. |
| **EU GMP Annex 11** | Alle computergestützten Systeme (CSV). | **Fundament bleibt bestehen:** IQ/OQ, physische Zugriffskontrolle, Audit Trails, klassische Infrastruktur. |
| **EU GMP Annex 22** | Spezifisch für lernende Algorithmen (statistische Modelle, neuronale Netze, GenAI). | **Zusatzanforderungen:** Modell-Lebenszyklus, drift-monitoring, Intended Use Grenzen, Daten-Governance. |
| **ICH Q9 (R1)** | Qualitätsrisikomanagement. | Methodik für die risikoproportionale Validierung (FMEA mit KI-Fehlermodi). |

---

## 2. Der 5-Stufen-Entscheidungstrichter (*Decision Funnel*)
*Ausführliche Details, Fallstricke und Praxisfälle siehe ➔ **[Modul 03: Scope and Applicability of AI Systems](module_03_scope_applicability.md)**.*

Bevor ein System entwickelt oder validiert wird, muss es den standardisierten Scoping-Filter durchlaufen:

```mermaid
flowchart TD
    S1{"1. Handelt es sich um echte KI?<br/>(Statistisches Lernen, Mustererkennung, GenAI?)"}
    S1 -- Nein (Regelbasiert / Deterministisch) --> OUT1["Rein unter Annex 11<br/>(Klassische CSV)"]
    S1 -- Ja --> S2{"2. Hat das System GMP-Einfluss?<br/>(Direkt: Freigabe, CQA / Indirekt: QC-Peaks, Schichtplanung?)"}
    S2 -- Nein --> OUT2["Out of Scope<br/>(Standard-IT Best Practices)"]
    S2 -- Ja --> S3["3. Risikoklassifizierung<br/>(Unacceptable / High / Moderate / Low)"]
    S3 --> S4{"4. Architektur-Prüfung<br/>(Statisch vs. Dynamisch?)"}
    S4 -- Dynamisch / Kontinuierlich lernend --> BLOCKED["❌ Im kritischen GMP-Betrieb unzulässig!"]
    S4 -- Statisch (Frozen Weights) --> S5["5. Dokumentation im AI-Inventar<br/>(Intended Use + Scoping Rationale)"]
```

---

## 3. Die 4-stufige Risikomatrix nach Annex 22
*Ausführliche Details zur FMEA-Methodik und den 5 KI-Fehlermodi siehe ➔ **[Modul 04: Risk Based Approach to AI](module_04_risk_based_approach.md)**.*

Annex 22 erzwingt ein striktes **Proportionalitätsgebot** (*Proportionality Mandate*): Die Tiefe von Validierung, Überwachung und Kontrolle skaliert linear mit dem Risiko.

```mermaid
quadrantChart
    title Risikoeinstufung & Governance-Tiefe
    x-axis "Geringe Kritikalität / Reversibel" --> "Hohe Kritikalität / Irreversibel"
    y-axis "Advisory / Assistiv (Human-on-the-Loop)" --> "Autonom / Direkt (Human-in-the-Loop)"
    quadrant-1 "HIGH RISK (Vollvalidierung, 100% HITL, OOD-Schutz)"
    quadrant-2 "MODERATE RISK (Advisory, Sampling-Tests, HOTL)"
    quadrant-3 "LOW RISK (Backoffice, Standard-IT-Kontrollen)"
    quadrant-4 "UNACCEPTABLE (Ausgeschlossen: Autonomes Online-Lernen)"
    "Chargenfreigabe (Batch Release)": [0.95, 0.9]
    "PAT / Inline-Prozesskontrolle": [0.85, 0.75]
    "Autonome Vial-Sichtprüfung": [0.8, 0.85]
    "Abweichungs-Triage (Deviation AI)": [0.45, 0.5]
    "LLM-Entwürfe für SOPs / Berichte": [0.35, 0.35]
    "QC-Peak-Integration": [0.7, 0.6]
    "Admin / HR-Systeme": [0.1, 0.1]
```

### Die Risikostufen im Detail
1. **Unacceptable Risk (Nicht zulässig):**
   - Autonom online-lernende Modelle, die operative GMP-Entscheidungen ohne feste Validierungsbasis fällen.
2. **High Risk (Volle Validierung + 100% HITL):**
   - Direkte Steuerung von Critical Quality Attributes (CQA), Critical Process Parameters (CPP), In-Line-PAT oder autonome Gut/Schlecht-Aussortierung.
   - *Anforderung:* Tiefgehende Adversarial-Tests, Randfall-Prüfungen, Echtzeit-Drift-Monitoring, zwingende Out-of-Distribution (OOD) Erkennung.
3. **Moderate Risk (Entscheidungsunterstützung / Advisory):**
   - Systeme zur Vorab-Klassifikation oder Priorisierung (z.B. Abweichungstriage), deren Ergebnisse vor Wirksamkeit von geschultem Personal freigegeben werden.
   - *Anforderung:* Validierung mit repräsentativen Datensätzen, periodisches Monitoring, Maßnahmen gegen *Automation Bias*.
4. **Low Risk (Assistiv / Backoffice):**
   - Reine Textunterstützung, Zusammenfassungen, nicht-GMP-relevante administrative Planungen.

---

## 4. Der End-to-End AI Lifecycle unter Annex 22

Der Lebenszyklus eines KI-Systems umfasst 6 Phasen, die alle lückenlos dokumentiert und qualifiziert sein müssen:

```mermaid
sequenceDiagram
    autonumber
    actor QA as Quality Assurance (QA)
    participant VAL as Validation / CSV
    participant DS as Data Science / IT
    actor OP as Production / Operator
    actor QP as Qualified Person (QP)

    Note over QA,VAL: Phase 1: Intended Use Definition
    QA->>VAL: Genehmigt Intended Use (Scope, Grenzen, Out-of-Scope Bedingungen)
    
    Note over DS,VAL: Phase 2: Data Governance (ALCOA+)
    DS->>VAL: Bereitstellung Trainings- & strikt isolierter Testdaten (Data Lineage)
    
    Note over DS: Phase 3: Model Development
    DS->>DS: Modelltraining & Fixierung der Hyperparameter (Frozen Weights)
    
    Note over VAL,QA: Phase 4: Validation & Independent Testing
    VAL->>QA: Qualifizierungsbericht mit ungesehenen Testdaten (Adversarial Testing)
    
    Note over OP,DS: Phase 5: Operation & Continuous Monitoring
    OP->>DS: Produktiver Einsatz (Eingabedaten werden auf OOD geprüft)
    DS-->>QA: Automatisches Alerting bei Data Drift / Concept Drift
    
    Note over QP: Phase 6: Human Oversight (HITL)
    OP->>QP: Batch Record inkl. erklärbarer KI-Ergebnisse (Explainability)
    QP->>QP: Finale Chargenfreigabe durch qualifizierten Menschen
```

---

## 5. Die 6 Grundprinzipien für „Trustworthy AI“

```mermaid
mindmap
  root((Trustworthy AI<br/>Annex 22))
    1. Intended Use
      Präziser Verwendungszweck vor Projektstart
      Strikte Out-of-Scope Kriterien
      Grenzen blockieren unzulässige Eingaben
    2. Data Governance
      ALCOA+ Prinzipien für alle Daten
      Strikte Trennung von Training & Test
      Lückenlose Data Lineage
    3. Independent Validation
      Testen mit ungesehenen Daten
      Adversarial & Edge-Case Testing
      Keine Data Leakage
    4. Proportionate Explainability
      Nachvollziehbarkeit proportional zum Risiko
      Schutz vor reiner Black-Box
      Dokumentierte Entscheidungspfade
    5. Meaningful Human Oversight
      Schutz vor Automation Bias
      Aktives Challenge-Verfahren
      Reale Übersteuerungsbefugnis (Override)
    6. Continuous Monitoring
      Erkennung von Data & Concept Drift
      Vordefinierte Alarmschwellen
      Geregeltes Change Control bei Retraining
```

---

## 6. Die 5 KI-spezifischen Fehlermodi (FMEA-Erweiterung)

Klassische IT-Fehlerkriterien greifen bei KI zu kurz, da Modelle **nicht mit Fehlermeldung abstürzen, sondern still degradieren (*Silent Degradation*)**:

1. **Systematic Bias:** Die Trainingsdaten spiegeln seltene Realzustände nicht wider; die KI entscheidet reproduzierbar fehlerhaft bei Randgruppen/Extremen.
2. **Distribution Shift:** Der reale Produktionsprozess verändert sich schleichend gegenüber dem historischen Trainingszeitraum (*Data Drift*).
3. **Adversarial / Edge Inputs:** Ungewöhnliche Kombinationen von Messwerten überfordern die Modelllogik.
4. **Confidence Miscalibration:** Die KI liefert eine falsche Prognose, weist dieser aber intern eine extrem hohe Wahrscheinlichkeit (z.B. 99,8%) zu.
5. **Spurious Correlations:** Scheinzusammenhänge in den Daten (z.B. Beleuchtungswechsel oder Bediener-Kürzel) werden fälschlich als kausale Steuergröße gelernt.

---

## 7. Rollenverteilung: Das „Three-Legged Stool“-Modell

```mermaid
classDiagram
    class QA_QualityAssurance {
        +Etabliert AI-Governance Framework
        +Genehmigt Intended Use & Akzeptanzkriterien
        +Führt behördliche Inspektionen
        +Überwacht CAPA & Automation Bias Risiken
    }
    class Validation_CSV {
        +Übersetzt Intended Use in messbare Tests
        +Erstellt unabhängige Testdatensätze
        +Führt Qualifizierung (IQ/OQ/PQ) durch
        +Definiert OOD- und Drift-Schwellen
    }
    class IT_DataScience {
        +Baut MLOps-Infrastruktur & Pipelines
        +Sichert Data Lineage & Model Registry
        +Garantiert unveränderliche Modellversionen
        +Implementiert Drift-Monitoring & Logging
    }
    QA_QualityAssurance <--> Validation_CSV : Genehmigung & Kriterien
    Validation_CSV <--> IT_DataScience : Technische Testbarkeit
    IT_DataScience <--> QA_QualityAssurance : Audit Trails & Monitoring
```

---

## 8. Inspektions-Readiness & Rote Flaggen für Auditoren

### 🚩 Typische „Red Flags“ bei Inspektionen
* **Vage Intended Use Aussagen:** Formulierungen wie *„unterstützt Qualitätsentscheidungen“* laden Auditoren zum tiefen Nachbohren ein.
* **Flache Governance (*Compliance Theater*):** Alle KI-Systeme mit denselben Standard-IT-Formularen ohne Beachtung von Drift oder Bias behandelt.
* **Informeller *Scope Creep*:** Anwender nutzen das System an der Linie für Produkte oder Packmittel, die nie validiert wurden.
* **Passives Abnicken (*Perfunctory Review*):** Reviewer bestätigen KI-Vorschläge in Sekunden ohne nachweisbare inhaltliche Auseinandersetzung.
* **SaaS-Blackbox ohne Kontrolle:** Einbindung von Cloud-KI, deren Vendor-Updates nicht per Change Control gesteuert werden.

### 🛡️ Robuste Audit-Verteidigung (*Audit Defensibility*)
* Lückenlos gepflegtes, lebendes **AI-Inventar** mit Scoping-Begründungen.
* Nachweis harter technischer Barrieren (**Out-of-Distribution Detection**), die unzulässige Eingaben an der Linie stoppen.
* Nachweis aktiver **manueller Notfallübungen (*Fallback Drills*)**, um Operator-Kompetenzen aufrechtzuerhalten.
