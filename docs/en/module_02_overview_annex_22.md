<!-- metadata
source_file: docs/de/module_02_overview_annex_22.md
source_commit: 8fed97a
sync_date: 2026-09-28
language: en
-->

# Module 02: Overview of Annex 22

<div align="center">

🌐 **[Deutsche Version](../de/module_02_overview_annex_22.md)** &nbsp;|&nbsp; **[⬅ Module 01: Intro to AI in GxP](module_01_introduction_ai_gxp.md)** &nbsp;|&nbsp; **[🏠 Table of Contents](00_overview.md)** &nbsp;|&nbsp; **[Module 03: Scope and Applicability ➔](module_03_scope_applicability.md)**

</div>

---

## 🧭 Core Concept: Coexistence & Guarding Against Automation Bias

```mermaid
graph TD
    subgraph Foundation["1. Regulatory Foundation: Annex 11"]
        F1["Computerised Systems Validation (CSV)"]
        F2["IQ / OQ / PQ & User Requirements"]
        F3["Audit Trails & Physical Access Controls"]
    end

    subgraph Annex22["2. Specialized AI Layer: Annex 22"]
        A1["Binding Intended Use Definition"]
        A2["Strict Test Data Isolation"]
        A3["Proportionate Explainability"]
        A4["Continuous Drift Monitoring"]
    end

    subgraph ChallengeLoop["3. Mitigating Automation Bias"]
        C1["Operator Observes Event"] --> C2["Human Makes Independent Review<br/>(Blind Evaluation)"]
        C2 --> C3["AI Recommendation is Displayed"]
        C3 --> C4["Active Adjudication & Sign-off<br/>(Active Challenge)"]
    end

    Foundation --> Annex22
    Annex22 -. "Architecting Human Oversight" .-> ChallengeLoop

    style Foundation fill:#f8fafc,stroke:#64748b,stroke-width:2px
    style Annex22 fill:#f0fdf4,stroke:#16a34a,stroke-width:2px
    style ChallengeLoop fill:#eff6ff,stroke:#2563eb,stroke-width:2px
```

---

## 🎯 Learning Objectives & Guiding Questions
1. **Why was Annex 22 established and how does it interface with Annex 11?**
2. **How does Annex 22 delineate GxP scope (direct vs. indirect impacts)?**
3. **What is the regulatory stance toward Static AI, Dynamic AI, and Generative AI?**
4. **What is Automation Bias and how must Human Oversight workflows be designed?**
5. **What does the 5-stage implementation roadmap look like for regulated manufacturers?**

---

## 📌 Technical Summary (Key Takeaways)

### 1. Origins, the EudraLex Digital Package & Legal Status
- **The EudraLex Vol. 4 Digital Package:** Annex 22 was not published in isolation; it forms a coordinated modernization package together with the **Revision of Annex 11** (cloud, agile methodologies, data governance) and the **Revision of Chapter 4** (documentation and electronic records).
- **Current Legal Status:** The text is currently a **Consultation Draft** issued by the European Commission, EMA, and PIC/S (the public consultation period closed on **October 7, 2025**; final adoption is expected in late 2026 / early 2027). At the EMA Multi-Stakeholder Workshop (June 30 / July 1, 2026), stakeholder feedback was reviewed; potential re-evaluations remain under active technical examination by inspectorate working groups (no formal policy decision taken yet). European GMDP inspectors already apply the draft's principles as the current **"State of the Art"** benchmark during computerized systems inspections under Annex 11.
- **Reference to the EU AI Act:** The draft glossary adopts the definition of "AI system" directly from the **EU AI Act** (Art. 3(1) Regulation (EU) 2024/1689).

### 2. Annex 11 vs. Annex 22 (Coexistence, Not Replacement)
- **Annex 22 does NOT replace Annex 11 ([Draft §1]):** The draft explicitly defines itself as *additional guidance* to Annex 11.
- **Annex 11 remains the foundation:** IQ/OQ structures, audit trails, user access controls, cloud infrastructure qualification, and baseline deterministic validation remain governed by Annex 11.
- **Annex 22 adds an advanced layer:** For learning algorithms, Annex 22 mandates:
  - Binding *Intended Use Specifications* developed with Process and Business SMEs ([Draft §3.1]),
  - Strictly isolated hold-out test sets with access controls and *Staff Independence* ([Draft §6.2, §6.5]),
  - Risk-proportionate *Explainability (XAI)* evaluated during testing ([Draft §8.1, §8.2]),
  - Continuous lifecycle monitoring of model performance and input distributions ([Draft §10.3, §10.4]),
  - **Full Regulated User Responsibility ([Draft §2.2]):** The regulated user retains ultimate accountability for product quality, patient safety, and data integrity, even when AI models or components are procured from third-party suppliers.

### 3. What is In-Scope vs. Out-of-Scope?
- **In-Scope (Regulated under [Draft §1]):**
  - Critical applications with direct or indirect impact on patient safety, product quality, or data integrity in medicinal product manufacturing.
  - Direct GMP decisions: Automated batch certification, in-line process analytical technology (PAT).
  - Indirect GMP impacts: AI-driven chromatographic peak integration in QC labs, deviation triage and root-cause classification, supply-chain forecasting affecting shelf-life or sterile material availability.
- **Out-of-Scope (Unregulated by Annex 22):**
  - Early-stage drug discovery without GMP linkage,
  - General corporate HR/recruiting tools,
  - Purely rule-based, deterministic legacy software (remains under Annex 11).

### 4. The Model Triad: Static, Dynamic, and Generative AI
- **Static AI (Scope of the Draft, [Draft §1, Glossary]):**
  - Model weights are frozen post-qualification (*Frozen Weights*).
  - Deterministic and reproducible inference. All updates require formal Change Control ([Draft §10.1]).
- **Dynamic AI (Not Covered by the Draft, [Draft §1]):**
  - Models that continuously retrain online on operational production data.
  - *Regulatory Rule:* Dynamic models are outside the draft's scope and should not be used in critical GMP applications (*"should not be used"*, [Draft §1]), because a continuously sustained validated state cannot currently be guaranteed.
- **Generative AI & LLMs (Not Covered for Critical Processes, [Draft §1]):**
  - Probabilistic text and code synthesis vulnerable to stochastic variability and hallucinations.
  - *Regulatory Rule:* The draft does not cover generative AI / LLMs for critical processes. In non-critical applications, qualified human oversight is mandatory ([Draft §1]).
  - *Permitted Operational Corridor in Practice ([Didaktik]):* Assistive drafting tasks (e.g. preliminary drafts for reports), provided each output is verifiably and independently reviewed by qualified personnel. See details in ➔ **[Specialized Guide: Generative AI & RAG in GxP](appendix_genai_rag_gxp.md)**.

### 5. Automation Bias & Active Human Oversight
- **Illustrative Operational Scenario (didactic case study, unverified):** A QA department utilized NLP for deviation severity triage. Over time, reviewers routinely clicked "Approve" without critically reading records (*Perfunctory Review* / Rubber-Stamping).
- **Remediation ([Didaktik]):** Redesign the review pattern! Human reviewers must perform a **blind evaluation first** before AI recommendations are revealed (*Independent-First / Active Challenge*).

### 6. The 5-Stage Implementation Roadmap
1. **Stage 1 (Governance):** Establish an AI governance framework within the corporate QMS (incorporating cloud and supplier oversight).
2. **Stage 2 (Inventory):** Build a living Master AI Inventory with risk classifications.
3. **Stage 3 (Gap Triage):** Identify and remediate validation deficits across high-risk systems.
4. **Stage 4 (Cross-Functional Literacy):** Break down silos between IT, Data Science, and QA.
5. **Stage 5 (Lifecycle Discipline):** Implement continuous drift monitoring and gated change control (aligned with the ➔ **[ISPE GAMP AI Guide & Best Practices](appendix_ispe_gamp_ai_best_practices.md)**).

---

## 💡 Key Terminology & Concepts (Glossar)

- **Coexistence Model:** The regulatory architecture where Annex 11 serves as the computerized system foundation and Annex 22 acts as the specialized standard for AI/ML.
- **Automation Bias:** The human psychological tendency to unquestioningly accept algorithmic recommendations, resulting in complacency and overlooked errors.
- **Active Challenge Workflow:** A review process designed to compel critical human evaluation (e.g., blind assessment prior to viewing AI suggestions).
- **Supplier Governance:** The contractual and technical oversight ensuring cloud providers and software vendors comply with GxP change management standards.

---

## 📋 GxP-Compliance Checklist: Annex 22 Governance

### Absolute Must-Haves:
- [ ] Is every AI system documented in a centralized **Master AI Inventory**?
- [ ] Is there an approved **Intended Use Specification** establishing explicit operational boundaries?
- [ ] Are high-risk systems subject to **Human-in-the-Loop (HITL)** controls with mandatory electronic sign-off?
- [ ] Does the UI workflow protect operators from *Automation Bias* (blind review pattern)?
- [ ] Are cloud service agreements (*Quality Agreements*) in place to prevent unannounced model or infrastructure updates?

### Red Flags for Inspectors:
- ❌ Teams claim "Annex 22 does not apply because the system is hosted as third-party SaaS in the cloud".
- ❌ High-risk models retrain dynamically on live shopfloor data.
- ❌ Human reviewers exhibit a 100% agreement rate with the AI, indicating passive rubber-stamping.
- ❌ No documented rationale exists for excluding non-GMP pilot systems from validation.

---

<div align="center">

🌐 **[Deutsche Version](../de/module_02_overview_annex_22.md)** &nbsp;|&nbsp; **[⬅ Module 01: Intro to AI in GxP](module_01_introduction_ai_gxp.md)** &nbsp;|&nbsp; **[🏠 Table of Contents](00_overview.md)** &nbsp;|&nbsp; **[Module 03: Scope and Applicability ➔](module_03_scope_applicability.md)**

</div>
