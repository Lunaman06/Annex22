<!-- metadata
source_file: docs/de/module_06_data_governance_quality.md
source_commit: 8fed97a
sync_date: 2026-09-28
language: en
-->

# Module 06: Data Governance and Data Quality

<div align="center">

🌐 **[Deutsche Version](../de/module_06_data_governance_quality.md)** &nbsp;|&nbsp; **[⬅ Module 05: Intended Use and Model Definition](module_05_intended_use_model_definition.md)** &nbsp;|&nbsp; **[🏠 Table of Contents](00_overview.md)** &nbsp;|&nbsp; **[Module 07: AI Model Development and Training ➔](module_07_model_development_training.md)**

</div>

---

## 🎯 Learning Objectives & Guiding Questions
1. **The Substrate Principle:** Why are data in Annex 22 not passive storage artifacts, but the actual "Active Pharmaceutical Ingredient (API)" of the model?
2. **ALCOA+ for AI:** What extended requirements (Completeness, Consistency, Enduring, Availability) does Annex 22 mandate for multi-terabyte training corpora?
3. **Data Lineage & Bias:** How is derivation lineage proven without gaps, and what 4 statistical biases threaten batch disposition?
4. **Test Data Independence:** Why do naive 80/20 random splits in pharma data almost inevitably lead to *Data Leakage* and false validation?
5. **Operational Data Governance:** Why are live inference logs formal GMP records, and how do we prevent degenerative feedback loops (*Model Collapse*)?

---

## 🧭 Core Concept: The 6 Quality Gates of the AI Data Pipeline

```mermaid
flowchart TD
    G1["Gate 1: Sourcing & Lineage<br/><i>(Origin, Material Lots, Unbroken Provenance)</i>"] --> G2["Gate 2: Curation & Preprocessing<br/><i>(ALCOA+ Audit, Outlier Rationale, Schema Units)</i>"]
    G2 --> G3["Gate 3: Labeling & Ground Truth<br/><i>(Inter-Rater Reliability, Cohen's Kappa, Disposition Review)</i>"]
    G3 --> G4["Gate 4: Leakage-Free Splitting<br/><i>(Stratified Partitioning by Lot/Site, NO Naive Random Splits)</i>"]
    G4 --> G5["Gate 5: Immutable Versioning<br/><i>(Cryptographic Hashes, DVC Snapshots, Change Control)</i>"]
    G5 --> G6["Gate 6: Audit & Formal Sign-off<br/><i>(QA & Data Owner Authorization Before Training)</i>"]

    style G1 fill:#f8fafc,stroke:#64748b,stroke-width:2px
    style G2 fill:#f0fdf4,stroke:#16a34a,stroke-width:2px
    style G3 fill:#fefce8,stroke:#ca8a04,stroke-width:2px
    style G4 fill:#eff6ff,stroke:#2563eb,stroke-width:2px
    style G5 fill:#faf5ff,stroke:#9333ea,stroke-width:2px
    style G6 fill:#ecfdf5,stroke:#059669,stroke-width:3px
```

---

## 📌 Technical Summary (Key Takeaways)

### 1. The Core Thesis: Data is the Substrate of AI
In classical software engineering (Annex 11), programmed code dictates execution. In machine learning systems, **model behavior emerges directly from training data**.
* **Analogy:** Data are not merely fuel; they represent the *Substrate* – the Active Pharmaceutical Ingredient (API) of the algorithm.
* **Regulatory Consequence:** If the substrate is contaminated by selective data omissions, undocumented transformations, or erroneous ground-truth labels, the AI output is inherently toxic (*Garbage In, Toxic Output Out*). Under Annex 22, data preparation is a **highly regulated core pharmaceutical activity**.

### 2. ALCOA+ for AI Systems (The Annex 22 Evolution)
The foundational data integrity principles (Attributable, Legible, Contemporaneous, Original, Accurate) remain mandatory, but are augmented by AI-specific dimensions:

| ALCOA+ Attribute | Traditional CSV Definition | Annex 22 Mandate for AI Datasets |
| :--- | :--- | :--- |
| **Complete** | Documents without missing pages | **No Selective Omission:** Discarding process outliers, failed batches, or marginal runs without formal statistical rationale is strictly prohibited. |
| **Consistent** | Uniform date and naming conventions | **Metadata Harmonization:** Standardized timestamp frequencies, sensor resolutions, and physical units across heterogeneous production lines and historical years. |
| **Enduring** | Tamper-evident archiving | **Full Lifecycle Retention:** Exact training and testing corpora must be archived for the entire operating life of the model plus the shelf-life of all commercially released batches. |
| **Available** | Rapid access during inspections | **Instant Retrieval at Scale:** Multi-terabyte training corpora must remain auditable and retrievable for inspectors within realistic audit timeframes. |

### 3. Data Lineage & The 4 Major Statistical Biases
When auditors request proof of data origin, no gap in derivation is acceptable.

> [!CAUTION]
> **Case Study:** A pharmaceutical manufacturer deployed an AI batch quality classifier trained on two years of historical MES data. During an inspection, the team could not identify specific batch contributions or reconstruct transformation pipelines. The outcome: A Major Inspection Finding, suspension of the AI tool, and a six-month retrospective remediation program.

Unbroken **Data Lineage** (tracked via tools like Apache Atlas or DataHub) is the only reliable defense against the **four major statistical biases**:
1. **Sampling Bias:** The training dataset omits genuine operational variability (e.g., training exclusively on optimal "golden runs").
2. **Time Bias:** Data were collected during atypical periods (e.g., following raw material supplier transitions, seasonal plant humidity shifts, or maintenance shutdowns).
3. **Site Bias:** Heavy over-representation of modern flagship facilities. Models fail when deployed to smaller contract manufacturing sites with older equipment.
4. **Operator Bias:** Training data originate exclusively from elite senior operators. The algorithm fails when novice operators run the line.

### 4. Test Data Independence & Preventing Data Leakage
A primary validation failure in data science teams is the uncritical use of **naive random 80/20 train/test splits**.

* **The Trap:** Pharmaceutical time-series data and batch records contain hidden clusters (e.g., multiple sensor samples from the same lot or multiple NLP deviation records for a single incident).
* **Data Leakage:** If data points from the same lot exist in both training and test partitions, the model "knows" the batch characteristics in advance. Validation metrics are artificially inflated (*Spurious Validation*).
* **Annex 22 Requirement:** Strict **Grouped Hold-Out Isolation**. Splits must partition cleanly by batch or manufacturing site. Test sets must remain completely unseen by the model prior to formal Performance Qualification (PQ).
* **Label Integrity:** Historical batch records contain human error (e.g., 15% inconsistency among visual inspectors on borderline cosmetic flaws). The AI inherits this noise as ground truth. Label quality must be quantitatively verified (e.g., via *Cohen’s Kappa* / Inter-Rater Reliability).

### 5. Operational Data Governance & Feedback Loops
Data governance discipline intensifies post-deployment:
* **GMP Record Status:** Every live inference transaction (input features, raw prediction, calibrated confidence score, timestamp, operator signature) constitutes an **official GMP record** under Annex 11 / Annex 22.
* **The Hazard of Model Collapse (Feedback Loops):** If AI predictions inadvertently cycle back into historical databases without provenance tags and are ingested into future retraining runs, the model trains on its own synthetic outputs. Statistical variance collapses and biases self-amplify (*Model Autophagy*).

---

## 💡 Key Terminology & Concepts (Glossar)

- **Substrate of AI:** The foundational data corpus from which model capabilities emerge, analogous to an active pharmaceutical ingredient.
- **Data Lineage:** The unbroken, auditable chain of custody tracing data from raw acquisition through transformation to training ingestion.
- **Data Leakage:** Accidental exposure of validation or test information during training, resulting in overly optimistic performance metrics.
- **Inter-Rater Reliability (Cohen's Kappa):** Statistical metric quantifying the level of agreement among independent human annotators.
- **Hold-Out Test Set:** A strictly isolated data partition used solely for final performance verification, sequestered from all training and tuning.
- **Operational Feedback Loop:** Degenerative cycle occurring when AI-generated outputs contaminate future training corpora (*Model Collapse*).

---

## 📋 GxP-Compliance Checklist: Data Governance & Quality

### Absolute Must-Haves:
- [ ] Is there unbroken, documented **Data Lineage** linking raw plant sources to the final training snapshot?
- [ ] Has a formal, documented **Bias Evaluation** (Sampling, Time, Site, Operator Bias) been conducted?
- [ ] Are training, validation, and test datasets versioned via immutable cryptographic hashes (e.g., DVC)?
- [ ] Does the data splitting methodology enforce **batch/site grouping** to prevent *Data Leakage*?
- [ ] Has ground-truth annotation consistency been verified using Inter-Rater Reliability metrics?
- [ ] Are live production inputs, outputs, and confidence scores recorded in compliant GxP audit trails?

### Red Flags for Inspectors:
- ❌ Training datasets stored as unversioned spreadsheets on shared network drives.
- ❌ Random 80/20 train/test split on time-series batch data without proof of leakage prevention.
- ❌ Historical out-of-specification (OOS) batches silently deleted from training sets to inflate accuracy (*Selective Omission*).
- ❌ Operational inference inputs not archived ("Only final batch release decisions are stored").

---

<div align="center">

🌐 **[Deutsche Version](../de/module_06_data_governance_quality.md)** &nbsp;|&nbsp; **[⬅ Module 05: Intended Use and Model Definition](module_05_intended_use_model_definition.md)** &nbsp;|&nbsp; **[🏠 Table of Contents](00_overview.md)** &nbsp;|&nbsp; **[Module 07: AI Model Development and Training ➔](module_07_model_development_training.md)**

</div>
