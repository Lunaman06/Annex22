# 📋 Product Requirements Document (PRD)
# 22Annex.ai — The AI Compliance & Validation Simulator for EU GMP Annex 22

| Metadaten | Detail |
| :--- | :--- |
| **Produktname** | **22Annex.ai** |
| **Claim / Tagline** | *The Interactive GxP Compliance & Validation Simulator for EU GMP Annex 22* |
| **Dokumenten-Version** | v0.1 (Draft & Strategy Alignment) |
| **Status** | In Review / Working Draft |
| **Datum** | 2026-09-28 |
| **Lead / Author** | Kai Kiefer & Antigravity (Pair-Design) |
| **Zielgruppe des PRD** | Product Management, Software Engineering, QA/CSV Specialists, Investors/Stakeholder |

---

## 1. 🎯 Executive Summary & Produktvision

### 1.1 Die Vision
Pharmazeutische Unternehmen, MedTech-Pioniere und CDMOs stehen vor einem regulatorischen Paradigmenwechsel: Der **EU GMP Annex 22** verlangt für den Einsatz von Künstlicher Intelligenz und Machine Learning in GxP-Umgebungen völlig neue Validierungs- und Kontrollmechanismen, die klassische CSV (Computerised Systems Validation) nach GAMP 5 übersteigen.

**22Annex.ai** ist der erste interaktive, KI-gestützte **Compliance- & Validierungs-Simulator**, der Entwickler (Data Scientists/MLOps) und Regulatoren (QA, CSV, QP) an einen Tisch bringt. Statt statischer, hunderte Seiten langer PDF-Leitfäden führt **22Annex.ai** den Nutzer über einen **dynamischen Entscheidungsbaum** und eine **LLM-gestützte Analyse** Schritt für Schritt von der ersten Projektidee bis zum audit-fertigen **Annex 22 Validation Dossier & Gap Report**.

### 1.2 Core Value Proposition (Der Kernnutzen)
* **Klarheit statt Paragraphendschungel:** Wandelt unübersichtliche regulatorische Anforderungen (Draft Annex 22, EU AI Act, Annex 11, GAMP 5) in einen interaktiven 5-Stufen-Workflow um.
* **Intelligente Vor-Klassifizierung:** Ein integriertes LLM (z. B. via Google Gemini API / Gemma) analysiert Freitext-Projektideen, erkennt Risikomuster (z. B. unzulässiges Online-Learning oder ungeschützte LLM-Freigaben) und generiert maßgeschneiderte Rückfragen.
* **Dynamische Entscheidungsbäume:** Keine starre Checkliste! Abhängig von Anwendungsfall (z. B. Computer Vision zur Sichtprüfung vs. LLM für Batch Record Reviews vs. Soft Sensor) passen sich Fragen und Prüfkriterien in Echtzeit an.
* **Audit-fähiger Output:** Auf Knopfdruck entsteht ein umfassender **Compliance Readiness Score** sowie ein strukturierter **Gap- & Validierungsplan**, der direkt in pharmazeutische Validierungsordner übernommen werden kann.

---

## 2. 🚨 Problem Statement & Marktlücke

### 2.1 Das „Annex 22 Übersetzungsproblem“
1. **Zwei Welten prallen aufeinander:**
   * **Data Science / AI Engineers** entwickeln in PyTorch, scikit-learn, HuggingFace und Docker. Sie optimieren auf *Loss Functions*, *F1-Score* und *Latency*, kennen aber oft keine ICH Q9, ALCOA+, oder IQ/OQ/PQ-Validierung.
   * **QA- & CSV-Teams** beherrschen das klassische deterministische V-Modell. Ihnen fehlen jedoch Werkzeuge, um nicht-deterministische Modelle, stochastische Drift, Explainability (SHAP/LIME) oder MLOps-Pipelines regulatorisch zu beurteilen.
2. **Statische Checklisten versagen:**
   * Eine statische Checkliste fragt: *„Haben Sie Explainability dokumentiert?“*
   * Ein KI-Projekt braucht aber eine kontextabhängige Antwort: Handelt es sich um ein Random-Forest-Modell (Gini-Importance reicht) oder um ein Deep Convolutional Neural Network (Grad-CAM / Integrated Gradients nötig) oder ein RAG-LLM (Halluzinations-Benchmark & HITL nötig)?
3. **Behördendruck & Zeitfenster:**
   * Obwohl Annex 22 formell ein Draft ist, wenden Auditoren der EMA, FDA und nationalen Behörden die Grundsätze bereits heute als **„State of the Art“** an. Fehlerhafte AI-Einführungen führen zu kostspieligen Inspektions-Findings (483s / Deficiencies) oder Projektstopps.

---

## 3. 👥 User Personas & Zielgruppen

| Persona | Rolle & Kontext | Pain Points / Probleme | Was 22Annex.ai für sie löst |
| :--- | :--- | :--- | :--- |
| **Dr. Stefan M.** *(52)* | **Head of Quality Assurance & Qualified Person (QP)** | Haftet persönlich für Chargenfreigaben. Hat Respekt vor intransparenten „Black-Box“-Modellen und Automatisierungs-Bias. | Garantiert ihm, dass das Modell alle HITL-Schutzmechanismen (Draft §3, §9) einhält und die QP-Freigabehoheit unangetastet bleibt. |
| **Elena B.** *(38)* | **Senior CSV / Digital Compliance Managerin** | Muss bestehende Validierungsframeworks (SOPs) auf KI anpassen. Weiß nicht genau, welche Testdokumente Auditoren für ML-Modelle fordern. | Liefert ihr eine lückenlose **Annex-22-Traceability-Matrix** und einen konkreten Validierungsfahrplan. |
| **Dr. Lukas K.** *(31)* | **Lead AI/ML Engineer in Pharma R&D / Produktion** | Möchte innovative Modelle produktiv bringen, scheitert aber an bürokratischen Freigabeprozessen und unklaren Compliance-Hürden. | Schnelles Feedback: Was muss architektonisch angepasst werden (z. B. Frozen Weights, Datenisolation §6), *bevor* Code geschrieben wird. |
| **Markus T.** *(45)* | **GxP Lead Auditor & Consultant** | Führt Mock-Inspektionen und Readiness-Audits bei Pharma-Kunden durch. | Nutzt 22Annex.ai als standardisiertes Inspektions- und Scoring-Werkzeug für Kundenprojekte. |

---

## 4. ⚖️ Intended Use & Regulatorische Systemgrenzen

Gemäß den Prinzipien von Annex 22 muss auch **22Annex.ai** einen klar deklarierten *Intended Use* besitzen:

* **Zweckbestimmung (Intended Use):**  
  *22Annex.ai dient als interaktives Beratungs-, Simulations- und Planungs-Werkzeug für Fachkräfte in der pharmazeutischen Industrie, um die Anforderungen des EU GMP Annex 22 und verwandter Standards für KI-Projekte strukturiert zu bewerten, Lücken zu identifizieren und Validierungspläne vorzubereiten.*
* **Systemgrenzen & Nicht-Zweck:**  
  *22Annex.ai ist **kein** automatisiertes Freigabesystem und ersetzt **nicht** die formelle Genehmigung durch die zuständige Qualitätssicherung (QA) oder die Qualified Person (QP). Das Tool agiert streng im Modus des Human-in-the-Loop Decision Supports.*

---

## 5. 🧭 Core User Experience & Der 5-Stufen-Wizard-Funnel

Der Wizard führt den Nutzer durch einen 5-stufigen, modularen Evaluierungsprozess:

### 5.1 UX-Architektur: Der Dual-Mode Ansatz (A/B Vergleich)
Um die optimale Balance zwischen geführter Effizienz und explorativem Dialog zu finden, implementiert **22Annex.ai** einen direkten **Modus-Umschalter (Toggle)** für die ersten Stufen:

* **Modus A: „Guided Card Stepper“ (Visueller Entscheidungsbaum)**
  * Strukturierte Frage-Karten mit dynamischen Verzweigungen (Typ *Typeform / TurboTax*).
  * Klare Auswahlfelder, Tooltips mit Draft-Zitaten und Sofort-Indikatoren.
  * Ideal für CSV- und QA-Auditoren, die eine schnelle, deterministische Erfassung bevorzugen.
* **Modus B: „Conversational Co-Auditor“ (Interaktiver Chat-Simulator)**
  * Dialoggeführtes Sparring mit dem KI-Assistenten (Gemini/Gemma).
  * Der Assistent stellt gezielte Rückfragen (z. B.: *„Welche Metriken habt ihr für False Negatives bei der Sichtprüfung definiert?“*).
  * Ideal für Data Scientists und Product Owner, die ihr Projekt zunächst im Freitext beschreiben und im Dialog schärfen möchten.

### 5.2 Das Scoring- & Penalty-System (Kein Hard-Lock, sondern Signalisierung)
* **Punktabzug statt Totalabbruch:** K.O.-Kriterien (z. B. ungeschütztes Continual Learning im GMP-Betrieb) führen **nicht** zum harten Abbruch oder 0% Gesamtergebnis, damit der Nutzer die restlichen Dimensionen weiter analysieren kann.
* **Kritische Warnhinweise („Red Flags“):** 
  * Im betroffenen Bereich (z. B. *Model Architecture*) erfolgt ein substanzieller Punktabzug (z. B. -30 Punkte).
  * Im finalen Bericht wird das Kriterium an oberster Stelle mit einem **roten Callout-Banner („Critical Non-Compliance / Showstopper“)** hervorgehoben – inklusive Verweis auf den konkreten Draft-Paragraphen und praxiserprobter Remediation-Empfehlung (z. B. *„Frozen Weights Strategie mit kontrolliertem Re-Training SOP etablieren“*).

---

### 5.3 Die 5 Evaluierungsstufen im Detail

* **Eingabe:** Freitext-Beschreibung des Projekts (z. B. *„Wir möchten Tablettenblister mittels einer Kamera und einem CNN-Modell auf Risse und Fehlstellen prüfen, um die manuelle Endkontrolle zu beschleunigen.“*).
* **LLM-Assistenz (Gemini/Gemma):**
  * Extrahiert automatisch: *Intended Use*, *Input-Daten (Bilder/Sensoren/Text)*, *Zielmetrik*, *Kritikalität*.
  * Identifiziert potenzielle Risiken (z. B. unklare Grenzen des Einsatzbereichs / OOD-Gefahr).

### Stufe 2: Scope & Risk Classification (Der Regulatorische Trichter)
* **Entscheidungsbaum:**
  1. Ist das System GxP-relevant? (Patientensicherheit, Produktqualität, Datenintegrität).
  2. Handelt es sich um ein echtes KI/ML-System (EU AI Act Art. 3(1)) oder um klassische deterministische Heuristik/Statistik?
  3. Fällt das System unter Annex 11 (Grundlage) + Annex 22 (spezifisch)?
  4. Risikoklasse nach ICH Q9 (R1) & GAMP 5 Kategorie (Kat. 4 konfigurierbar vs. Kat. 5 Custom Model).
  5. Schnittstelle zum EU AI Act (High-Risk Classification Check).

### Stufe 3: Model Architecture & Safety Gates
* **Prüfung der Hard-Constraints des Annex 22:**
  * **Static vs. Dynamic Model:** Wird das Modell zur Laufzeit im GMP-Betrieb kontinuierlich nachtrainiert?
    * ⚠️ *Alert bei „Ja“:* Annex 22 Draft §1 schließt dynamisches Selbstlernen für kritische GMP-Prozesse de facto aus! Empfehlung: *Frozen Weights* & periodisches Retraining unter Change Control.
  * **Modelltyp:** Klassisches ML (z. B. XGBoost) vs. Deep Learning (CNN/Transformer) vs. Generative AI / LLMs.
  * **Spezial-Gate für LLMs:** Werden LLMs für kritische Entscheidungen (Chargenfreigabe, Deviations-Klassifizierung) eingesetzt? Wenn ja: Verpflichtende HITL-Zweitprüfung und Halluzinations-Schranke.

### Stufe 4: Data Governance & Validation Strategy
* **Datenintegrität (ALCOA+):** Datenherkunft, Lineage, Annotation & Label-Verifikation durch Fachexperten (Draft §5.4).
* **Testdaten-Isolation (Draft §6.1–§6.5):**
  * Sind Entwickler strikt von den Testdaten ausgeschlossen?
  * Existiert ein Verbot der Mehrfachverwendung ohne Begründung?
* **Validierungs-Quadrat:** Festlegung von Mindestanforderungen an:
  * Accuracy / Precision / Recall (False Negatives vs. False Positives).
  * Robustheits- und Stresstests (Out-of-Distribution, Rauschen, Lichtschwankungen).
* **Explainability (XAI):** Notwendige Erklärungsmethoden (Feature Importance, SHAP, LIME, Attention Maps) bezogen auf die Zielgruppe (Bediener vs. QA).

### Stufe 5: Human Oversight (HITL) & Lifecycle Monitoring
* **Oversight-Modell:** Human-in-the-Loop (HITL), Human-on-the-Loop (HOTL) oder Human-in-Command.
* **Schutz vor Automation Bias:** Verpflichtendes Training für Mitarbeiter zum Überstimmen des Modells (*Override Training*, Draft §9.2) und unabhängige Erstbewertung (*Independent-First-Muster*).
* **MLOps & Continuous Monitoring:**
  * Erkennung von Data Drift & Concept Drift.
  * Definierte Schwellenwerte für Alarme und automatisches Fallback auf Fallback-Prozeduren.
  * Re-Validierungsstrategie im Change Control Prozess.

---

## 6. 📄 Deliverables & Generierter Output

Nach Durchlaufen des Simulators erhält der Nutzer ein sofort verwertbares, exportierbares Paket:

1. **Compliance Readiness Score (0 – 100%):**
   * Aufgeschlüsselt nach den Säulen: *Regulatory Scope*, *Data Governance*, *Model Rigor*, *Human Oversight*, *Lifecycle Monitoring*.
2. **Der „22Annex.ai Gap Report“ (PDF / Markdown / JSON):**
   * Ampelsystem: Grün (Konform), Gelb (Verbesserungsbedarf), Rot (Showstopper / Regulatorisches Risiko).
   * Konkrete Handlungsempfehlungen mit Verweis auf exakte Paragraphen (`[Draft §1]`, `[Draft §5.4]`, `[Draft §6.2]`, `[Draft §9.2]`).
3. **Annex 22 Validation Plan Template (Vorbefüllt):**
   * Ein strukturiertes Dokumentgerüst (User Requirements, Functional Spec, Test Matrix, Risk Assessment), das das Projektteam direkt in das eigene eQMS übernehmen kann.
4. **AI System Master Inventory Dossier:**
   * Audit-reife Erfassung für das zentrale KI-Verzeichnis des Unternehmens (gemäß Modul 12).

---

## 7. 🤖 KI- & LLM-Integrationskonzept

### 7.1 Rolle des LLM im Simulator
Das LLM dient als **intelligenter Sparringspartner und Co-Auditor**:
* Es übersetzt schwammige Nutzerformulierungen in präzise GxP-Begriffe.
* Es schlägt vor, welche Stufen des Entscheidungsbaums voreingestellt werden können.
* Es generiert die Begründungstexte für den finalen Gap-Report.

### 7.2 Modell-Strategie & Schnittstellen
* **Standard-Engine:** Google Gemini API (z. B. `Gemini 1.5 Flash` für blitzschnelle Interaktion oder `Gemma 27B / 31B` für On-Premise/Edge-Deployments).
* **Datenschutz & Vertraulichkeit (Zero-Data-Retention):**
  * Pharma-Projektdaten enthalten hochsensibles geistiges Eigentum (IP).
  * **Architektur-Vorgabe:** Standardmäßig laufen Entscheidungsbäume und Scoring clientseitig im Browser.
  * Bei LLM-Nutzung: Option zur Eingabe eines eigenen API-Keys (BYOK - *Bring Your Own Key*) oder Anbindung an unternehmenseigene Vertex-AI- / Azure-Private-Endpoints. Keine Speicherung oder Weitertraining mit Kundendaten!

---

## 8. 🏗️ Technische Architektur & Deployment-Optionen

```text
22Annex.ai Client (Web App)
├── UI Layer: Modern Dashboard (Glassmorphism, Dark/Light Mode, Stepper)
├── Decision Engine: Dynamischer Client-side Rule- & Branching-Tree
├── LLM Adapter: Gemini API / Gemma (Streaming, Prompt Templates)
├── Storage: LocalStorage / Encrypted JSON Export (Zero Cloud Tracking)
└── Export Engine: Markdown / HTML-to-PDF Generator (Audit Dossier)
```

### Deployment-Stufen:
1. **Phase A (Aktuell / Prototyp):** 
   * Integriert in das bestehende Vite-Projekt, lauffähig auf GitHub Pages / Static Hosting.
   * Client-side only mit Mock-Modus und optionalem API-Key-Input für Gemini.
2. **Phase B (Cloud Hosting mit Google Account / Firebase):**
   * Firebase Hosting + Firebase Cloud Functions (als sicherer Proxy für LLM-Aufrufe ohne Exposed API Keys).
   * Schnelles, professionelles Hosting mit eigener Domain (`22annex.ai`).
3. **Phase C (Enterprise / On-Premise):**
   * Docker-Container für firmeninterne Bereitstellung in privaten Clouds (AWS/Azure/GCP).

---

## 9. 🗺️ Roadmap & Meilensteine

### Meilenstein 1: MVP Simulator (Bereits in Entwicklung)
- [x] Grundlegendes Web-Portal & zweisprachige Annex-22-Wissensbasis
- [x] Prototyp des Simulators mit ersten Evaluationsstufen
- [ ] Vollständiger dynamischer Entscheidungsbaum für alle 5 Stufen
- [ ] Export des Compliance-Reports als Markdown / JSON

### Meilenstein 2: LLM-Co-Auditor Integration
- [ ] Integration der Gemini API / Gemma Prompt-Chain für automatische Intake-Analyse
- [ ] Intelligente Generierung von Gap-Warnungen basierend auf den Antworten
- [ ] Score-Berechnung mit visueller Radar-Chart / Tachometer

### Meilenstein 3: Product Polish & Launch
- [ ] Eigenständige Landing Page & Branding unter `22Annex.ai`
- [ ] PDF-Export mit Firmenlogo und Audit-Deckblatt
- [ ] Community-Feedback aus QA- & CSV-Netzwerken einholen

---

## 10. 📝 Getroffene Produktentscheidungen (Decisions Log)

| Datum | Thema | Entscheidung | Rationale / Begründung |
| :--- | :--- | :--- | :--- |
| **2026-09-28** | **UX-Pattern (Cards vs. Chatbot)** | **Dual-Mode Prototyp (Vergleichsmodus)** | Für die ersten Stufen werden **beide UX-Muster parallel** bereitgestellt (Toggle zwischen: *A) Strukturierte Stepper-Karten mit dynamischen Entscheidungszweigen* und *B) Interaktiver Dialog-Sparring-Partner / Chatbot*). So kann die Praxistauglichkeit direkt getestet und verglichen werden. |
| **2026-09-28** | **Scoring & K.O.-Kriterien** | **Punktabzug + Prominente Warnung im Bericht** | K.O.-Kriterien (z. B. unzulässiges Online-Learning im GMP-Betrieb nach Draft §1) sperren den Score **nicht** pauschal auf 0%, um den Nutzer nicht vor den Kopf zu stoßen. Stattdessen: **Empfindlicher Punktabzug** im betroffenen Bereich und **prominente Signalisierung als „Kritisches Non-Compliance Finding / Showstopper“** im Management-Summary des Reports. |
| **2026-09-28** | **Branding & URL** | **22Annex.ai** | Klares, modernes RegTech-Branding mit maximaler Domänen-Identifikation. |

