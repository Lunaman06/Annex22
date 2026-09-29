# Leitfaden: ISPE GAMP® AI Guide & Etablierte Industrie-Best-Practices

<div align="center">

🌐 **[English Version](../en/appendix_ispe_gamp_ai_best_practices.md)** &nbsp;|&nbsp; **[🏠 Zurück zur Gesamtübersicht](00_overview.md) &nbsp;|&nbsp; [⬅ GenAI & RAG Leitfaden](appendix_genai_rag_gxp.md) &nbsp;|&nbsp; [Modul 08: Validation & Testing](module_08_validation_performance_testing.md)**

</div>

---

> **Executive Summary:**  
> Während die Regulierungsbehörden (EMA, FDA, PIC/S) in Leitlinien wie dem **Draft EU GMP Annex 22** verbindliche gesetzliche Anforderungen und Verbote festlegen, liefert die Industrie mit dem im **Juli 2025 veröffentlichten ISPE GAMP® Guide: Artificial Intelligence** die konkrete technische Anleitung zur Umsetzung. Dieser Leitfaden fasst die Kernprinzipien des 290-seitigen GAMP-AI-Standards zusammen und zeigt, wie Pharma-Unternehmen agile MLOps mit den etablierten GAMP-5-Validierungsmodellen harmonisieren.

---

## 1. Einordnung: Annex 22 vs. GAMP® 5 vs. ISPE GAMP AI Guide

Um Missverständnisse in Projekten zu vermeiden, muss die Hierarchie zwischen Regulatorik und Industrie-Leitfäden glasklar sein:

```mermaid
flowchart TD
    A["⚖️ Gesetzlicher Rahmen & Behördenvorgaben<br/><b>EU GMP Annex 11 & Draft Annex 22 (EMA / PIC/S)</b><br/><i>(Definiert WAS rechtlich gefordert und verboten ist)</i>"]

    subgraph Frameworks["Industrie-Leitfäden & Methodik"]
        direction LR
        B["📘 Übergreifender Rahmen<br/><b>ISPE GAMP® 5 (2nd Ed., 2022)</b><br/><i>(Risikobasiertes V-Modell & CSV)</i>"]
        C["📗 Spezialisierter AI-Leitfaden<br/><b>ISPE GAMP® AI Guide (2025)</b><br/><i>(Data Science, MLOps & Living Validation)</i>"]
    end

    D["🏭 Inspektionsfeste Umsetzung im Pharma-Unternehmen<br/><b>SOPs, validierte Pipelines & gelebtes Qualitätsmanagement</b>"]

    A ==> Frameworks
    Frameworks ==> D

    style A fill:#fef2f2,stroke:#ef4444,stroke-width:2px
    style Frameworks fill:#f8fafc,stroke:#3b82f6,stroke-width:1.5px
    style B fill:#ffffff,stroke:#2563eb,stroke-width:1.5px
    style C fill:#ffffff,stroke:#16a34a,stroke-width:1.5px
    style D fill:#f0fdf4,stroke:#16a34a,stroke-width:2px
```

* **Annex 22** ist die *Regulierung* (Inspektionsmaßstab der Behörden).
* **GAMP 5** ist der *Rahmen* für risikobasierte Computersystem-Validierung (CSV/CSA).
* Der **ISPE GAMP AI Guide (2025)** ist das *Kochbuch*, das Data-Science-Teams und QA-Abteilungen die konkreten Workflows an die Hand gibt.

---

## 2. Das duale Lebenszyklus-Modell (Dual Lifecycle Model) ([Best Practice: ISPE GAMP])

Die größte methodische Neuerung im ISPE GAMP AI Guide ist das **duale Lebenszyklus-Modell**. Klassische Software hat einen einzigen Code-Lebenszyklus. Ein KI-System besteht jedoch aus zwei parallel laufenden, eng verzahnten Zyklen:

```mermaid
flowchart LR
    subgraph SoftwareCycle["💻 Software- & MLOps-Zyklus"]
        direction TB
        S1["Requirements & URS"]
        S2["MLOps Pipeline-Architektur"]
        S3["Infrastruktur-Qualifizierung (IQ/OQ)"]
        S4["System-Release & Change Control"]
        S1 --> S2 --> S3 --> S4
    end

    subgraph DataCycle["📊 Daten- & Modell-Zyklus"]
        direction TB
        D1["Data Sourcing & Lineage"]
        D2["Curation & ALCOA+ Audit"]
        D3["Training & Hyperparameter-Tuning"]
        D4["Unabhängige Testdaten-Evaluierung"]
        D1 --> D2 --> D3 --> D4
    end

    SoftwareCycle <===>|"Kontinuierliche Synchronisation"| DataCycle
    DataCycle ==> PROD["🏭 Gemeinsame Freigabe (PQ / Model Card)<br/>& kontinuierliches Drift-Monitoring"]

    style SoftwareCycle fill:#eff6ff,stroke:#3b82f6,stroke-width:2px
    style DataCycle fill:#f0fdf4,stroke:#16a34a,stroke-width:2px
    style PROD fill:#fefce8,stroke:#ca8a04,stroke-width:2px
    style S1 fill:#ffffff,stroke:#3b82f6,stroke-width:1px
    style S2 fill:#ffffff,stroke:#3b82f6,stroke-width:1px
    style S3 fill:#ffffff,stroke:#3b82f6,stroke-width:1px
    style S4 fill:#ffffff,stroke:#3b82f6,stroke-width:1px
    style D1 fill:#ffffff,stroke:#16a34a,stroke-width:1px
    style D2 fill:#ffffff,stroke:#16a34a,stroke-width:1px
    style D3 fill:#ffffff,stroke:#16a34a,stroke-width:1px
    style D4 fill:#ffffff,stroke:#16a34a,stroke-width:1px
```

1. **Der Software-Zyklus:** Folgt dem klassischen GAMP-Lebenszyklus (Spezifikation, Build, IQ/OQ der Pipeline-Infrastruktur, Container-Sicherheit).
2. **Der Daten-Zyklus:** Durchläuft Datensammlung, Bereinigung, Labeling, Feature Engineering und Training.
3. **Der Schnittpunkt:** Erst wenn die Software-Infrastruktur qualifiziert ist **und** die Daten nachweislich ALCOA+-konform sind, darf das resultierende Modell (Frozen Weights) für die Performance Qualification (PQ) freigegeben werden.

---

## 3. Erweiterung der GAMP-Softwarekategorien für KI

GAMP 5 teilt Software traditionell in 4 Kategorien ein (Kategorie 1, 3, 4, 5). Der ISPE AI Guide ordnet KI-Systeme differenziert ein:

| GAMP-Kategorie | Klassische Definition | KI-Spezifische Ausprägung nach ISPE GAMP AI Guide | Validierungsaufwand |
| :---: | :--- | :--- | :---: |
| **Kategorie 1** | Infrastruktur-Software | Cloud-Plattformen, Container-Engines (Docker, Kubernetes), GPU-Treiber | Standard-Qualifizierung (IQ) |
| **Kategorie 3** | Nicht-konfigurierte Standard-Software | Kommerzielle COTS-Modelle mit festen Gewichten, die unverändert genutzt werden (z.B. Standard-OCR) | Lieferanten-Audit, Verifikation der Eignung für den *Context of Use* |
| **Kategorie 4** | Konfigurierte Software | Vortrainierte Basismodelle (Transfer Learning), konfigurierte Hyperparameter, RAG mit Firmen-Dokumenten | Umfangreich: Validierung von Konfiguration, Prompts, RAG-Pipeline und Testdaten |
| **Kategorie 5** | Kundenspezifische Software (Custom Build) | Von Grund auf selbst entwickelte neuronale Netze, proprietäre Algorithmen | **Maximaler Aufwand:** Lückenlose Data Lineage, mathematische Rationale, Adversarial Testing, vollständige MLOps-Validierung |

---

## 4. Quality Risk Management (QRM) nach ICH Q9 (R1) für KI

Der GAMP AI Guide fordert, Risiken nicht abstrakt, sondern streng entlang der Kriterien von **ICH Q9 (R1)** zu quantifizieren:
* **Severity (Schweregrad):** Was passiert mit dem Patienten, wenn die KI eine falsche Vorhersage trifft?
* **Probability of Occurrence (Wahrscheinlichkeit):** Wie anfällig ist das Modell für Fehlklassifikationen, Rauschen oder OOD-Daten?
* **Detectability (Entdeckungswahrscheinlichkeit):** Kann ein menschlicher Bediener an der Linie einen KI-Fehler erkennen (*Human Oversight*), oder handelt es sich um eine stumme Fehlentscheidung (*Silent Degradation*)?

> [!IMPORTANT]
> **Das GAMP-Prinzip der Proportionalität:**  
> Nicht jedes KI-System benötigt denselben gigantischen Dokumentationsberg. Systeme mit niedriger Kritikalität (z.B. KI-gestützte Schichtplanung im Reinraum) erfordern schlanke Kontrollen. Systeme mit hoher Kritikalität (z.B. Echtzeit-Freigabeprüfung bei der Sterilabfüllung) fordern das Maximum an formaler Evidenz und unabhängiger Testung.

---

## 5. Lieferanten- und Cloud-Governance (Supplier Management)

Da fast alle Pharmaunternehmen heute externe Cloud-Dienste (AWS, Microsoft Azure, Google Cloud) oder spezialisierte KI-Softwareanbieter (COTS) einsetzen, widmet der ISPE GAMP AI Guide der Lieferantenüberwachung ein eigenes Kapitel:

### Die 4 Pflichtbausteine des AI-Supplier-Managements:
1. **Supplier Assessment & Audit:**  
   Die Qualitätssicherung (QA) muss den Entwicklungsprozess des Anbieters auditieren. Besitzt der Anbieter dokumentierte Prozesse für Data Governance, Bias-Prüfung und Code-Reviews?
2. **Quality Service Level Agreement (Quality Agreement):**  
   Vertragliche Zusicherung, dass der Anbieter:
   - Keine unangekündigten Modell- oder Algorithmen-Updates durchführt.
   - Eine Vorankündigungsfrist (z.B. 90 Tage) bei Änderungen an APIs oder Rechenkernen einhält.
   - Daten nicht für das Training eigener öffentlicher Modelle zweckentfremdet.
3. **Escrow & Model Lineage Zugriff:**  
   Sicherstellung, dass bei Insolvenz oder Kündigung des Dienstleisters alle Modellgewichte, Trainings-Metadaten und Inferenz-Logs an den Pharmahersteller übergeben werden.
4. **Verbleibende Verantwortung:**  
   GAMP betont unmissverständlich: **Die Verantwortung für die GxP-Konformität kann niemals auf den Anbieter abgewälzt werden** (*Regulated User Accountability*).

---

## 6. „Living Validation“: Der kontinuierliche Betriebszustand

Einer der wichtigsten Kernsätze von GAMP 5 Second Edition lautet: **Validierung ist kein Zustand, der mit dem Go-Live abgeschlossen wird, sondern eine kontinuierliche Aktivität.**

### Die 3 Säulen der Living Validation:
```mermaid
flowchart TD
    LV["🛡️ Living Validation (ISPE GAMP AI Guide)<br/><i>(Kontinuierliche Aufrechterhaltung des validierten Zustands)</i>"]

    subgraph Pillars["Die 3 operativen Säulen der Living Validation"]
        direction LR
        S1["1. Real-Time Dashboards<br/><i>(PSI- & Drift-Metriken,<br/>Bediener-Overrides)</i>"]
        S2["2. Gated Change Management<br/><i>(Strikte Revalidierung<br/>vor jedem Modell-Update)</i>"]
        S3["3. Periodic Review Audits<br/><i>(Risikobasierter Abgleich<br/>mit Validierungs-Baseline)</i>"]
    end

    LV ==> Pillars

    style LV fill:#f8fafc,stroke:#0284c7,stroke-width:2px
    style Pillars fill:#ffffff,stroke:#bae6fd,stroke-width:1.5px
    style S1 fill:#eff6ff,stroke:#2563eb,stroke-width:1.5px
    style S2 fill:#f0fdf4,stroke:#16a34a,stroke-width:1.5px
    style S3 fill:#faf5ff,stroke:#a855f7,stroke-width:1.5px
```

* **Automatisierte Drift-Alarmierung:** Überschreitet der *Population Stability Index (PSI)* den Wert von $0,2$, wird vollautomatisch ein Ticket im Abweichungswesen (QMS) ausgelöst.
* **Gated Release:** Ein neues Modell-Release kann erst dann in Produktion gehen, wenn ein automatisierter Revalidierungsbericht vom Qualitätsbeauftragten elektronisch signiert wurde.

---

## 📋 Zusammenfassung: Die 10 Gebote des ISPE GAMP AI Guides ([Best Practice: ISPE GAMP])

1. **Context of Use:** Bestimme vor jeder Zeile Code das Risiko für Patient, Produkt und Datenintegrität.
2. **Data is Code:** Behandle Trainingsdaten mit derselben Strenge wie regulierten Programmcode.
3. **Separate Cycles:** Führe den Datenlebenszyklus parallel zum Softwarelebenszyklus.
4. **No Free Learning:** Betreibe im GxP-Kern nur statische Modelle mit gefrorenen Parametern.
5. **Staff Independence & Test Data Control ([Draft §6.2, §6.5]):** Schütze Testdaten vor Entwicklerzugriff und trenne Tester vom Training (bei personellen Engpässen: Vier-Augen-Prinzip).
6. **Multi-Metric Evaluation:** Verlasse dich niemals auf eine einzelne Trefferquote (Metric Quad).
7. **Supplier Oversight:** Auditiere Cloud- und Softwareanbieter auf ihre KI-Governance.
8. **Explainability by Design:** Wähle das einfachste Modell, das die Aufgabe sicher löst.
9. **Active Oversight:** Verhindere *Automation Bias* durch gezieltes Workflow-Design.
10. **Continuous Vigilance:** Überwache Drift und Modellgüte permanent über die gesamte Lebensdauer.

---

<div align="center">

🌐 **[English Version](../en/appendix_ispe_gamp_ai_best_practices.md)** &nbsp;|&nbsp; **[🏠 Zurück zur Gesamtübersicht](00_overview.md) &nbsp;|&nbsp; [⬅ GenAI & RAG Leitfaden](appendix_genai_rag_gxp.md) &nbsp;|&nbsp; [Modul 08: Validation & Testing](module_08_validation_performance_testing.md)**

</div>
