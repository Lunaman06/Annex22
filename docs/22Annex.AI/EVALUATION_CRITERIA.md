# 🎯 Evaluation Criteria & Ground Truth Benchmark
# 22Annex.ai — EU GMP Annex 22 AI Compliance & Validation Simulator

| Metadaten | Detail |
| :--- | :--- |
| **Dokumenten-Version** | v1.0 (Ground Truth & Benchmark Spec) |
| **Status** | Freigegeben / Normativ für Test-Suite |
| **Bezug** | EU GMP Annex 22 (Draft Juli 2025), EU AI Act, Annex 11, GAMP 5 Second Edition |
| **Zweck** | Festlegung von Validierungs-Kriterien, Parametern und Soll-Verhalten für die automatisierte Evaluierung des AI Project Simulators |

---

## 1. 📌 Zielsetzung des Benchmark-Frameworks

Der **22Annex.ai Simulator** bewertet pharmazeutische KI-Projektideen nach den regulatorischen Vorgaben des **Draft EU GMP Annex 22**. Um sicherzustellen, dass die LLM-gestützte Extraktion (Gemma 4 31B) und die regelbasierte Scoring-Engine reproduzierbar, auditsicher und regressionsfrei arbeiten, definiert dieses Dokument:

1. Die **5 kanonischen Kern-Szenarien** als Ground Truth.
2. Das **Soll-Schema für extrahierte Projektparameter**.
3. Die **Scoring-, Penalty- und Red-Flag-Grenzwerte**.
4. Die **Pass/Fail-Kriterien für automatisierte Regressionstests**.

---

## 2. 📊 Extraktions- & Klassifizierungs-Schema

Jede Analyse einer Projektidee muss auf folgendes standardisiertes Parameter-Objekt abbilden:

```typescript
interface ExtractedParameters {
  projectName: string;               // Eindeutiger System-/Projekttitel
  intendedUse: string;               // GxP-Zweckbestimmung & Systemgrenzen
  processArea:                       // Pharmazeutischer Prozessbereich
    | 'batch_release'                // Kritisch: Chargenfreigabe & QP-Verantwortung
    | 'in_process'                   // Hoch: IPC, Inline-Inspektion, Monitoring
    | 'oos_investigation'            // Mittel: Abweichungen, Labortriage, SOPs
    | 'rd_discovery';                // GxP-fern: Forschung & Substanzsuche
  modelType:                         // Algorithmen- & Modellklasse
    | 'vision_defect'                // Computer Vision (CNNs, Bildsegmentierung)
    | 'predictive_ml'                // Klassisches tabellarisches ML (GBM, Random Forest)
    | 'genai_rag'                    // Generative KI / LLM mit Retrieval-Augmented Generation
    | 'reinforcement_learning';      // RL / autonome Agenten
  learningType:                      // Lernmodalität zur Laufzeit
    | 'static'                       // GMP-konform: Frozen Weights, offline Retraining
    | 'dynamic';                     // Showstopper: Kontinuierliches Online-Lernen
  autonomyLevel:                     // Grad der menschlichen Kontrolle
    | 'hitl'                         // Human-in-the-Loop (Mensch genehmigt jede Inferenz)
    | 'hotl'                         // Human-on-the-Loop (Leitwarte / Not-Aus / Boundary Guardrails)
    | 'hool';                        // Human-out-of-the-Loop (Vollautonomie)
  dataSource:                        // Datenherkunft & Integrität
    | 'internal_gxp'                 // Validierte interne GxP-Datenquellen (ALCOA+)
    | 'hybrid'                       // Interne Daten mit extern verifizierten Datensätzen
    | 'public_cloud';                // Unverifizierte Public Cloud / IP-Gefahr
  riskTier: 'Critical' | 'High' | 'Medium' | 'Low';
  verdict: 'REJECT' | 'CONDITIONAL' | 'VALIDATION_READY' | 'INCOMPLETE';
  targetScoreRange: [number, number]; // [Min-Score, Max-Score]
  mandatoryRedFlags: string[];       // Erwartete Warnungen
  mandatoryCitations: string[];      // Zwingend geforderte Annex-22-Paragraphen
}
```

---

## 3. 🧪 Die 5 Kern-Szenarien (Ground Truth Benchmark)

---

### 🚨 Szenario 1: K.O.-Kriterium Dynamisches Selbstlernen im Routinebetrieb
*Das absolute Showstopper-Szenario für unkontrollierten Model Drift.*

| Eigenschaft | Spezifikation |
| :--- | :--- |
| **Scenario ID** | `SCN-01-DYNAMIC-LEARNING` |
| **User Input Pitch** | *"Wir entwickeln ein ML-Modell für unseren Bioreaktor zur Titer-Optimierung. Das Modell soll sich im laufenden Batchbetrieb kontinuierlich an neuen Sensorsignalen selbst weitertrainieren (Online Continual Learning), um Prozessschwankungen sofort adaptiv auszugleichen."* |
| **Regulatorischer Bezug** | **EU GMP Annex 22 [Draft §1]**, Annex 11 §4 (Validierung), GAMP 5 Second Edition |
| **Regulatorische Begründung** | Kontinuierliches Selbstlernen im laufenden GxP-Routinebetrieb ist **de facto unzulässig** (*„should not be used for critical applications“*). Ein dynamisch veränderliches Modell verliert bei jedem Batch seinen qualifizierten/validierten Zustand. Es droht unbemerkter Concept Drift und unvorhersehbares Fehlverhalten ohne Change Control. |

#### Erwartete Parameter & Scoring:
- `projectName`: *Bioprozess-Regelung Bioreaktor* / *Adaptive Bioreactor Optimization*
- `processArea`: `in_process`
- `modelType`: `predictive_ml`
- `learningType`: `dynamic` 🚨
- `autonomyLevel`: `hotl` oder `hool`
- **Expected Verdict**: `REJECT` (oder `CONDITIONAL` mit strikter Sperre)
- **Score-Abzug**: **Mindestens -35 Punkte** für `learningType: 'dynamic'`
- **Target Score**: **30% – 55%** (Kritischer Showstopper)
- **Mandatory Red Flags**:
  - `Kritisches Finding: Dynamisches Selbstlernen [Draft §1]`
  - Verweis auf Verlust des validierten Zustands
- **Zwingende Remediation / Empfehlung**:
  - Umstellung auf **Frozen Weights** (statisches Modell).
  - Nachtraining nur offline in qualifizierter MLOps-Pipeline mit formeller Revalidierung unter Change Control.

---

### 🚨 Szenario 2: K.O.-Kriterium Vollautonomie / HOOL bei Freigaben
*Das Showstopper-Szenario für fehlende menschliche Verantwortung.*

| Eigenschaft | Spezifikation |
| :--- | :--- |
| **Scenario ID** | `SCN-02-HOOL-AUTONOMY` |
| **User Input Pitch** | *"Wir planen ein autonomes KI-System, das Abweichungsberichte (Deviations) und OOS-Laborergebnisse vollautomatisch bewertet, abschließt und die Freigabe ohne jegliche menschliche Gegenprüfung durchführt (Human-out-of-the-Loop), um Durchlaufzeiten zu halbieren."* |
| **Regulatorischer Bezug** | **EU GMP Annex 22 [Draft §3, §9.2]**, Art. 51 Richtlinie 2001/83/EG (Persönliche Haftung der Qualified Person), EU AI Act Art. 14 |
| **Regulatorische Begründung** | Qualitätskritische Entscheidungen, OOS-Untersuchungen und Chargenfreigaben dürfen **niemals** vollständig an Algorithmen delegiert werden. Die gesetzliche Letztverantwortung verbleibt bei der Qualified Person (QP) bzw. dem geschulten QA-Personal. Zudem droht schwerer *Automation Bias*. |

#### Erwartete Parameter & Scoring:
- `projectName`: *Autonome Deviation & Batch Disposition*
- `processArea`: `batch_release` oder `oos_investigation`
- `modelType`: `genai_rag` oder `predictive_ml`
- `learningType`: `static`
- `autonomyLevel`: `hool` 🚨
- **Expected Verdict**: `REJECT`
- **Score-Abzug**: **Mindestens -30 Punkte** für `autonomyLevel: 'hool'`
- **Target Score**: **35% – 60%** (Showstopper)
- **Mandatory Red Flags**:
  - `Kritisches Finding: Unzulässige Vollautonomie (HOOL) [Draft §3, §9.2]`
  - Zitat Art. 51 2001/83/EG (QP-Freigabehoheit)
- **Zwingende Remediation / Empfehlung**:
  - Zwingende Implementierung von **Human-in-the-Loop (HITL)**.
  - Dokumentierte **Override-Befugnis** für das Fachpersonal.
  - Verpflichtendes **Override-Training nach Draft §9.2** zur Bekämpfung von Automation Bias.

---

### ✅ Szenario 3: Optische Vial-Inspektion (Computer Vision / Parenteralia)
*Das pharmazeutische Standard-Vorzeigeszenario für High-Risk In-Process-Control.*

| Eigenschaft | Spezifikation |
| :--- | :--- |
| **Scenario ID** | `SCN-03-VISION-VIAL-INSPECTION` |
| **User Input Pitch** | *"Wir implementieren ein Convolutional Neural Network (CNN) mit Frozen Weights an unserer sterilen Abfülllinie für Parenteralia. Es analysiert Hochgeschwindigkeits-Kamerabilder von Vials auf Glasrisse, Partikel und Bördelkappenfehler. Fehlerhafte Vials werden automatisch ausgeschleust; ein geschulter GMP-Bediener führt statistische Stichprobenkontrollen durch und kann das System jederzeit überstimmen."* |
| **Regulatorischer Bezug** | **EU GMP Annex 22 [Draft §5, §6, §7]**, Annex 1 (Sterile Arzneimittel), Ph. Eur. 2.9.20 |
| **Regulatorische Begründung** | Solides, regulatorisch konformes Setup (Frozen Weights + HITL/HOTL). Besondere Prüfpunkte sind die strikte Testdaten-Isolation (Draft §6), False-Negative-Raten bei Fremdpartikeln (Patientenrisiko) und visuelle Explainability (Grad-CAM). |

#### Erwartete Parameter & Scoring:
- `projectName`: *Automatisierte optische Vial-Inspektion (Parenteralia)*
- `processArea`: `in_process`
- `modelType`: `vision_defect`
- `learningType`: `static` ✅
- `autonomyLevel`: `hitl` (oder `hotl` mit dokumentierter Bediener-Aufsicht) ✅
- `dataSource`: `internal_gxp`
- **Expected Verdict**: `VALIDATION_READY` (oder `CONDITIONAL` mit klaren Auflagen)
- **Target Score**: **85% – 100%**
- **Mandatory Deliverables / Auflagen**:
  - **Testdaten-Isolation nach Draft §6:** Entwickler dürfen keinen Zugriff auf den finalen Testdatensatz haben; keine Mehrfachnutzung.
  - **Performance-Metriken:** Strikt asymmetrische Matrix: Minimale *False-Negative-Rate* (FNR < 0.01% bei kritischen Defekten).
  - **Explainability (Draft §7):** Visuelle Saliency Maps / Grad-CAM zur Nachvollziehbarkeit für Bediener und Inspektoren.
  - **Challenging & Defect Library:** Repräsentativer Katalog qualifizierter Defektmuster (Knudsen-/Nadelpartikel, Haarrisse).

---

### ⚠️ Szenario 4: RAG-basierter GenAI SOP & Deviation Drafting Assistant
*Das moderne Generative-AI-Szenario mit inhärenten Halluzinations- und Datenrisiken.*

| Eigenschaft | Spezifikation |
| :--- | :--- |
| **Scenario ID** | `SCN-04-GENAI-RAG-ASSISTANT` |
| **User Input Pitch** | *"Wir möchten einen internen RAG-Assistenten auf Basis eines Large Language Models einführen. Das System durchsucht freigegebene SOPs und LIMS-Historien, um QA-Mitarbeitern Formulierungshilfen und Erstentwürfe für CAPA- und Abweichungsberichte zu liefern. Jedes Dokument wird manuell von einem Senior QA Manager geprüft und per digitaler Signatur nach Annex 11 freigegeben."* |
| **Regulatorischer Bezug** | **EU GMP Annex 22 [Draft §5.4, §8]**, GAMP Special Interest Group AI Guide 2025, Annex 11 (Audit Trail) |
| **Regulatorische Begründung** | Hoher Nutzen, da HITL fest verankert ist (Mensch gibt frei). Allerdings stochastische Natur von LLMs: Halluzinationsgefahr, Verwechslung von SOP-Versionen, Notwendigkeit von Quellenverlinkung (*Citation Verification*) und strikter Prompt-Validierung. |

#### Erwartete Parameter & Scoring:
- `projectName`: *SOP & Deviation Drafting Assistant mit RAG*
- `processArea`: `oos_investigation`
- `modelType`: `genai_rag`
- `learningType`: `static` (Frozen Model / Fixed Prompt-Template)
- `autonomyLevel`: `hitl`
- `dataSource`: `internal_gxp`
- **Expected Verdict**: `CONDITIONAL` (Qualifizierbar bei Einhaltung von Guardrails)
- **Score-Abzug**: **-10 Punkte** für stochastisches Modellrisiko / Halluzination
- **Target Score**: **70% – 85%**
- **Mandatory Deliverables / Auflagen**:
  - **RAG Triade Evaluation:** Messung von *Context Relevance*, *Groundedness* und *Answer Faithfulness*.
  - **Audit Trail & Kennzeichnung:** Eindeutige Kennzeichnung von KI-generierten Textpassagen im eQMS.
  - **Versionsstriktheit:** RAG-Vektordatenbank muss bei SOP-Revisionen sofort synchronisiert/invalidiert werden.
  - **Datenschutz & IP-Schutz:** Kein Abfluss von Rezeptur- oder Betriebsdaten an offene Public-Cloud-APIs.

---

### 💬 Szenario 5: Vage / Unvollständige Projektanfrage (Intake Sparring)
*Der Test für den Co-Auditor: Keine voreiligen Schlüsse, sondern gezielte Leitfragen.*

| Eigenschaft | Spezifikation |
| :--- | :--- |
| **Scenario ID** | `SCN-05-VAGUE-INTAKE` |
| **User Input Pitch** | *"Wir überlegen, irgendwie KI bei uns an der Verpackungslinie einzusetzen, um Prozesse zu optimieren und Fehler zu reduzieren."* |
| **Regulatorischer Bezug** | **EU GMP Annex 22 [Draft §2 & §4]**, Intended Use & Risk Assessment |
| **Regulatorische Begründung** | Ohne präzisen *Intended Use* und technische Systemgrenzen ist keine GxP-Validierung nach Annex 22 möglich. Der Co-Auditor darf weder grünes noch rotes Licht geben, sondern muss den Nutzer im Dialog schärfen. |

#### Erwartete Parameter & Verhalten:
- `projectName`: Vorläufig erfasst (z. B. *KI-Initiative Verpackungslinie*)
- `intendedUse`: *Unvollständig / Klärungsbedarf*
- **Expected Verdict**: `INCOMPLETE` (oder Aufforderung zur Spezifikation)
- **Verhalten des Co-Auditors**:
  - Darf **keinen** finalen Blueprint mit "VALIDATION_READY" ausstellen.
  - Muss gezielte Fragen stellen zu:
    1. **Konkrete Aufgabe:** Geht es um OCR (Verfallsdatum/Lot-Code), Siegelnahtkontrolle oder Durchsatzprognose?
    2. **Eingangsdaten:** Kamera, Barcode-Scanner oder SPS-Sensoren?
    3. **Kritikalität:** Hängt ein Rückruf-Risiko (Falsch-Etikettierung) daran?
    4. **Menschliche Kontrolle:** Automatische Ausschleusung oder Bedienerhinweis?

---

## 4. 📈 Scoring-Matrix & Sanktionsregeln

| Regel-ID | Kriterium | Ausprägung | Punkte-Impact | Regulatorische Referenz |
| :--- | :--- | :--- | :--- | :--- |
| `PEN-01` | **Lernmodus** | `dynamic` (Online-Selbstlernen im GMP-Betrieb) | **-35 Pkt** | Annex 22 [Draft §1] |
| `PEN-02` | **Autonomiegrad** | `hool` bei `batch_release` oder `in_process` | **-30 Pkt** | Annex 22 [Draft §3, §9.2] & Art. 51 2001/83/EG |
| `PEN-03` | **Datenquelle** | `public_cloud` (Unverifizierte Cloud / IP-Risiko) | **-15 Pkt** | Annex 22 [Draft §5, §6] |
| `PEN-04` | **Modell-Typ** | `genai_rag` (Stochastik & Halluzinationsrisiko) | **-10 Pkt** | Annex 22 [Draft §8], GAMP 5 2025 |
| `BON-01` | **Frozen Weights** | `static` mit definierter Revalidierungs-SOP | **+0 (Basis)** | Annex 22 [Draft §1] |
| `BON-02` | **Oversight** | `hitl` mit Override-Training & Dokumentation | **+0 (Basis)** | Annex 22 [Draft §3, §9.2] |

### Gesamtbewertung (Readiness Score):
* **80% – 100% (Grün):** 🟢 **Hohe Validierungsreife** (*Validation Ready*) — Konzept entspricht dem Annex 22 State of the Art.
* **50% – 79% (Gelb):** 🟡 **Konditionell qualifizierbar** (*Conditional*) — Signifikante Auflagen (z. B. XAI, RAG-Triade, Testdaten-Isolation).
* **10% – 49% (Rot):** 🔴 **Kritische Risiken / Showstopper** (*Reject / Non-Compliant*) — Enthält mindestens ein K.O.-Kriterium (`dynamic` oder `hool`).

---

## 5. 🤖 Bewertungsmetriken für Gemma 4 31B (LLM Co-Auditor)

Beim automatisierten Testen des LLMs gegen diesen Benchmark gelten folgende Gütekriterien:

1. **Parameter Extraction Accuracy (≥ 95%):**
   - Das LLM muss aus dem Freitext die Kernattribute (`processArea`, `modelType`, `learningType`, `autonomyLevel`) deterministisch identifizieren.
2. **K.O.-Erkennung (100% Recall):**
   - Kein dynamisches Modell darf als "static" klassifiziert werden.
   - Kein vollautonomes System (`hool`) darf ohne Warnung als konform eingestuft werden.
3. **Annex 22 Zitations-Präzision:**
   - In Antworten zu K.O.-Kriterien muss mindestens eine der Kernreferenzen (`[Draft §1]`, `[Draft §3]`, `[Draft §9.2]`, `[Draft §6]`) genannt werden.
4. **Resilienz & JSON-Konformität:**
   - Antworten mit strukturiertem Payload müssen valides JSON liefern, das direkt vom Frontend geparst werden kann.
