<!-- metadata
source_file: docs/de/module_03_scope_applicability.md
source_commit: 8fed97a
sync_date: 2026-09-28
language: en
-->

# Module 03: Scope and Applicability of AI Systems

<div align="center">

🌐 **[Deutsche Version](../de/module_03_scope_applicability.md)** &nbsp;|&nbsp; **[⬅ Module 02: Overview of Annex 22](module_02_overview_annex_22.md)** &nbsp;|&nbsp; **[🏠 Table of Contents](00_overview.md)** &nbsp;|&nbsp; **[Module 04: Risk Based Approach to AI ➔](module_04_risk_based_approach.md)**

</div>

---

## 🧭 Core Concept: The Scoping Decision Funnel

```mermaid
flowchart TD
    Start["Software System / Algorithm"] --> Q1{"1. Is it based on statistical<br/>learning / machine learning?"}
    
    Q1 -- No (Rule-Based) --> ANNEX11["✅ Governed Exclusively by Annex 11<br/>(Traditional CSV)"]
    Q1 -- Yes --> Q2{"2. Does it have direct or indirect<br/>impact on GxP processes?"}
    
    Q2 -- No --> OOS["❌ Out of Scope<br/>(Standard Corporate IT Controls)"]
    Q2 -- Yes --> Q3["3. Assign Risk Tier<br/>(Unacceptable / High / Moderate / Low)"]
    
    Q3 --> Q4{"4. Architectural Check:<br/>Static or Dynamic Weights?"}
    Q4 -- Dynamic --> REJECT["🚫 Prohibited for Critical GMP Operations!"]
    Q4 -- Static --> INV["📋 Register in Master AI Inventory<br/>(Approved Scoping Rationale)"]

    style Start fill:#f8fafc,stroke:#64748b,stroke-width:2px
    style ANNEX11 fill:#eff6ff,stroke:#2563eb,stroke-width:2px
    style OOS fill:#f1f5f9,stroke:#94a3b8,stroke-width:2px
    style Q3 fill:#fefce8,stroke:#ca8a04,stroke-width:2px
    style REJECT fill:#fef2f2,stroke:#ef4444,stroke-width:2px
    style INV fill:#f0fdf4,stroke:#16a34a,stroke-width:2px
```

---

## 🎯 Learning Objectives & Guiding Questions
1. **What are the risks of "Over-Claiming" vs. "Under-Claiming" during AI scoping?**
2. **How does the 5-stage Decision Funnel operate?**
3. **What is the 4-tier risk classification matrix under Annex 22?**
4. **What lessons emerge from critical boundary cases (automated visual inspection, LLM drafting, cloud SaaS)?**
5. **What mandatory metadata belongs in an audit-ready Master AI Inventory?**

---

## 📌 Technical Summary (Key Takeaways)

### 1. The Scoping Dilemma: Over-Claiming vs. Under-Claiming
- **Over-Claiming (Over-Regulation):** Categorizing every standard deterministic script as "AI under Annex 22" out of regulatory anxiety. **Consequence:** Validation resources are paralyzed by unnecessary bureaucracy.
- **Under-Claiming (Under-Regulation):** Overlooking an AI tool in a GMP workflow or dismissing it as "just a pilot". **Consequence:** Guaranteed Major or Critical Finding during the next inspection.
- **Goal:** A disciplined, defensible middle path backed by a formal *Documented Scoping Rationale*.

### 2. The 5-Stage Decision Funnel
Every software component and algorithm must pass through five rigorous qualification gates:
1. **Is it Truly AI/ML?** Only models employing statistical learning, pattern recognition, or generative synthesis fall under Annex 22. Deterministic, rule-based systems remain exclusively under **Annex 11**.
2. **Is There a GMP Impact?** Does it affect critical processes in medicinal product manufacturing with direct or indirect impact on patient safety, product quality, or data integrity ([Draft §1])?
3. **Assign Risk Tier ([Didaktik]):** Classification within the 4-tier risk framework (Not Covered by Draft, High, Moderate, Low).
4. **Evaluate Model Architecture:** Is the model static with deterministic output ([Draft §1, Glossary]) or dynamic/probabilistic?
5. **Document & Register:** Entry into the mandatory *AI Inventory* with written scoping rationale.

### 3. Didactic Risk Grid for AI Systems ([Didaktik])

> *Classification Note:* The draft fundamentally distinguishes between critical GMP processes (scope of application for static models) and excluded systems (§1). The following 4-tier classification is an established industry model ([Didaktik] adapted from EU AI Act / GAMP principles):

| Risk Tier | Definition & Operational Examples | Regulatory Consequences |
| :--- | :--- | :--- |
| **Not Covered by Draft** | Continuously self-training online models or probabilistic outputs in critical processes. | Should not be used in critical GMP applications (*"should not be used"*, [Draft §1]). |
| **High Risk** | Static AI in critical GMP processes (PAT control, CQA impact, automated release/sorting). | Comprehensive qualification, worst-case testing, continuous monitoring ([Draft §1, §4, §10]). |
| **Moderate Risk** | AI acting as assistive decision support (*Decision Support*), e.g. deviation triage. | Risk-proportionate qualification, defined operator responsibility in Intended Use ([Draft §3.3]). |
| **Low Risk** | Administrative applications with zero impact on product quality, patient safety, or data integrity. | Excluded from the scope of the draft ([Draft §1]); standard corporate IT controls are sufficient. |

### 4. Three Critical Boundary Cases from Practice

#### Case 1: Deep Learning Visual Inspection of Vials
- *Scenario:* AI autonomously sorts glass vials into "Pass" and "Defective". Only borderline cases are escalated to human operators.
- *Common Fallacy:* The company classified the system as "Moderate Risk" because humans review border cases.
- *Annex 22 Reality:* **Critical Process!** Autonomous defect sorting directly impacts product quality. Partial human checking of edge cases does not eliminate system criticality. Mandatory: Full model qualification, continuous drift monitoring, and validated fallback to manual inspection ([Draft §1, §4.3, §10.3]).

#### Case 2: Status of Generative AI (GenAI & LLMs)
- *Regulatory Baseline:* Under [Draft §1], the guideline is **not applicable to generative AI / Large Language Models (LLMs) in critical processes**. Generative AI in non-critical applications requires qualified human oversight (*Human Oversight*, [Draft §1]) due to stochastic variability and hallucination risks.
- *Workshop Status:* At the EMA Multi-Stakeholder Workshop (June 30 / July 1, 2026), industry feedback was discussed; potential re-evaluations remain under active technical examination with no formal decision adopted yet.
- *Permitted Operational Corridor in Practice ([Didaktik]):* LLMs are utilized in pharmaceutical practice as assistive tools (*"Drafting Assistants"*, e.g. drafting initial deviation narratives), provided every output is independently verified and signed off by qualified personnel.
- *Architectural Best Practice ([Best Practice: ML Practice]):* RAG Architecture (Retrieval-Augmented Generation) restricting outputs to approved SOPs with audit-trailed ALCOA+ citations. Details see ➔ **[Specialized Guide: Generative AI (GenAI), LLMs & RAG in GxP](appendix_genai_rag_gxp.md)**.

#### Case 3: Third-Party Cloud SaaS AI (API Black-Box)
- *Core Principle under [Draft §2.2]:* The regulated pharmaceutical user retains ultimate accountability for product quality, patient safety, and data integrity—even when AI systems or components are procured from external suppliers (*Suppliers*).
- *The Hazard:* If a cloud vendor updates underlying model weights or runtime libraries unannounced, the pharmaceutical manufacturer operates an unvalidated system (*Uncontrolled Environment Drift*).
- *Solution:* Cloud AI requires binding *Quality Agreements* and SLAs prohibiting unannounced model modifications ([Draft §2.2, §10.2]). Critical GxP calculations must have internal verification checkpoints. See also ➔ **[ISPE GAMP AI Guide & Industry Best Practices](appendix_ispe_gamp_ai_best_practices.md)**.

### 5. Mandatory Elements of the Master AI Inventory
The central inventory required by auditors must document for every system:
1. Unique System Identifier and Version,
2. Concise *Intended Use Specification*,
3. Assigned Risk Tier,
4. System Owner & Technical Owner (QA / IT),
5. Current Validation and Monitoring Status,
6. Direct reference to the approved *Documented Scoping Rationale*.

---

## 💡 Key Terminology & Concepts (Glossar)

- **Scoping Rationale:** Formal, documented justification explaining why a system is classified as GxP or non-GxP and why specific risk tiers were assigned.
- **Over-Claiming:** The excessive categorization of standard software as AI, causing resource waste.
- **Under-Claiming:** The failure to declare and validate an AI system used in GMP processes.
- **Master AI Inventory:** The single, authoritative corporate register listing all operational and pilot AI assets.
- **Critical Quality Attribute (CQA):** A physical, chemical, or microbiological property that must remain within limits to ensure product quality.

---

## 📋 GxP-Compliance Checklist: Scoping & Inventory

### Absolute Must-Haves:
- [ ] Has every digital asset passed through the **5-Stage Decision Funnel**?
- [ ] Is there an approved, written **Scoping Rationale** for every system in the inventory?
- [ ] Is the Master AI Inventory reviewed and updated at least bi-annually?
- [ ] Are autonomous visual inspection models classified as **High Risk** regardless of manual fallback?
- [ ] Are LLMs restricted to verified **Drafting Assistant** roles with mandatory RAG grounding?

### Red Flags for Inspectors:
- ❌ An AI pilot tool is used on the shopfloor but omitted from the Master AI Inventory (*Shadow AI*).
- ❌ Risk tiers were assigned based on vendor marketing materials rather than a documented ICH Q9 risk assessment.
- ❌ High-risk systems operate without a documented *Intended Use Specification*.
- ❌ Cloud APIs are used for GMP batch calculations without vendor Quality Agreements.

---

<div align="center">

🌐 **[Deutsche Version](../de/module_03_scope_applicability.md)** &nbsp;|&nbsp; **[⬅ Module 02: Overview of Annex 22](module_02_overview_annex_22.md)** &nbsp;|&nbsp; **[🏠 Table of Contents](00_overview.md)** &nbsp;|&nbsp; **[Module 04: Risk Based Approach to AI ➔](module_04_risk_based_approach.md)**

</div>
