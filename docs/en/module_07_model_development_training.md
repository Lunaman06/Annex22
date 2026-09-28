<!-- metadata
source_file: docs/de/module_07_model_development_training.md
source_commit: 8fed97a
sync_date: 2026-09-28
language: en
-->

# Module 07: AI Model Development and Training

<div align="center">

🌐 **[Deutsche Version](../de/module_07_model_development_training.md)** &nbsp;|&nbsp; **[⬅ Module 06: Data Governance and Data Quality](module_06_data_governance_quality.md)** &nbsp;|&nbsp; **[🏠 Table of Contents](00_overview.md)** &nbsp;|&nbsp; **[Module 08: Validation and Performance Testing ➔](module_08_validation_performance_testing.md)**

</div>

---

## 🎯 Learning Objectives & Guiding Questions
1. **The Paradigm Shift:** How do we transition from experimental data science (velocity, benchmark chasing) to strictly controlled GMP engineering?
2. **The Reproducibility Mandate:** What does deterministic reproducibility mean for stochastic learning, and why must random seeds and environment snapshots be archived?
3. **MLOps as GxP Infrastructure:** Why do platforms like MLflow, SageMaker, Azure ML, and DVC require validation under **EU GMP Annex 11**?
4. **Hyperparameter Discipline:** Why is developer intuition unaccepted by auditors, and why must hyperparameters never be tuned on test data?
5. **Model Calibration & Model Cards:** Why does an uncalibrated model induce dangerous *Automation Bias*, and how do standardized *Model Cards* streamline inspections?

---

## 🧭 Core Concept: From Ad-hoc Experiment to GxP Engineering

```mermaid
flowchart TD
    subgraph DS["❌ Conventional Data Science (Ad-hoc)"]
        direction TB
        DS1["Focus: Raw Benchmark Accuracy"] --> DS2["Ad-hoc Scripting in Notebooks"]
        DS2 --> DS3["Hyperparameters Chosen by Intuition"]
        DS3 --> DS4["Ephemeral Environments & Variable Seeds"]
    end

    DS ==>|Mandatory GxP Paradigm Shift| A22

    subgraph A22["✅ Annex 22 GMP Engineering (Controlled)"]
        direction TB
        G1["Focus: Trustworthiness & Calibration"] --> G2["Validated MLOps & Cloud Pipeline (Annex 11)"]
        G2 --> G3["Systematic Hyperparameter Search with Rationale"]
        G3 --> G4["Reproducibility: Git + DVC + Fixed Seeds"]
        G4 --> G5["Frozen Weights & Standardized Model Card"]
    end

    style DS fill:#fef2f2,stroke:#ef4444,stroke-width:2px
    style A22 fill:#f0fdf4,stroke:#16a34a,stroke-width:2px
```

---

## 📌 Technical Summary (Key Takeaways)

### 1. The Paradigm Shift: Engineering Trust vs. Benchmark Speed
In commercial and academic data science, predictive accuracy on static benchmarks and experimental velocity take precedence.

Under **EU GMP Annex 22**, this mentality clashes directly with pharmaceutical quality standards:
* **Development Discipline Determines Behavior:** Downstream validation or monitoring mechanisms cannot remediate a model engineered without rigorous controls from Day 1.
* **Target Objective:** Optimization targets **long-term reliability (Trustworthiness), robust decision boundaries, and audit defensibility**, not a fleeting benchmark record.
* Retrofitting GxP compliance onto exploratory, unversioned prototype code is cost-prohibitive and routinely rejected during regulatory inspections.

### 2. The Reproducibility Mandate
The foundational pillar of Annex 22 compliance is **deterministic reproducibility**:
> **Definition:** Given the exact same training data, source code, and configuration, the exact same model parameters (weights) and predictions must result without exception.

If a customer complaint, OOS investigation, or regulatory audit challenges a historical lot disposition, the manufacturer must be able to reconstruct the historical model bit-by-bit:
* **Code:** Pinned via immutable Git commit hashes.
* **Data:** Versioned via cryptographic content hashes (e.g., DVC).
* **Runtime Environment:** Containerized and locked down to OS and dependency library versions (Docker, pinned `requirements.txt`).
* **Random Seeds:** Because neural network initialization and stochastic mini-batch shuffling involve pseudo-random processes, **all random seeds must be explicitly fixed and documented**.

> [!CAUTION]
> **Case Study:** A company investigating a quality complaint could not reconstruct an AI model's historical classification because dependency libraries had auto-updated and random seeds were not recorded. The inability to reconstruct the historical decision resulted in a Major Inspection Finding.

### 3. MLOps & Cloud Platforms as Regulated GxP Infrastructure (Vendor Oversight)
Modern data science relies on MLOps and cloud platforms like MLflow, Weights & Biases, DVC, AWS SageMaker, or Azure ML.
* **Regulatory Impact:** When utilized to build, log, or track models governing pharmaceutical decisions, these platforms are classified as **Computerised Systems**.
* They must be fully qualified and validated under **EU GMP Annex 11** (access controls, audit trails, data integrity, backup/restore).
* **Cloud & Third-Party Vendor Oversight:**
  - A SOC-2 or ISO-27001 certificate alone is **insufficient** for GxP compliance.
  - The regulated user remains accountable (*Regulated User Accountability*). Quality Agreements must contractually guarantee that cloud providers do not push unannounced backend updates that alter runtime behavior (*Uncontrolled Environment Drift*).

### 4. Hyperparameter Discipline & The Golden Validation Rule
Hyperparameters (learning rates, tree depths, regularization, batch sizes) govern algorithmic convergence:
* **Change Control Baseline:** Final hyperparameters form a binding part of the technical *Model Definition*. Modifications without formal Change Control constitute an unvalidated system change.
* **The Golden Rule:** Hyperparameters must be tuned **exclusively on the Validation Set – never on the Hold-Out Test Set**! Otherwise, the model is effectively taught the answers to the final exam (*Data Leakage*), resulting in artificial validation metrics.
* **Documented Search Rationale:** Whether using Grid Search, Random Search, or Bayesian Optimization, teams must document search boundaries and stopping criteria. "Engineer intuition" is not a defensible methodology.

### 5. Model Calibration & Model Cards
* **Calibration vs. Accuracy:** A model can achieve 85% accuracy yet output 99.9% confidence scores. This **Overconfidence** is lethal in GxP, as it induces human operators to passively rubber-stamp erroneous outputs (*Automation Bias*). Models must be statistically calibrated (e.g., via Platt Scaling or Isotonic Regression).
* **Model Cards as the Gold Standard:** To standardize audit dossiers, Annex 22 best practice mandates **Model Cards**. This standardized artifact documents:
  - Authorized *Intended Use* and operational envelope,
  - Training dataset composition, lineage, and version,
  - Performance and calibration metrics,
  - Known limitations, failure modes, and out-of-scope conditions.

---

## 💡 Key Terminology & Concepts (Glossar)

- **Reproducibility:** The capability to regenerate an identical model artifact given identical data, code, random seeds, and software dependencies.
- **Frozen Weights:** The locked, immutable parameter state of a validated model deployed into commercial GMP production.
- **Random Seed:** A deterministic numerical seed provided to pseudo-random algorithms to ensure exact mathematical repeatability.
- **Model Card:** A standardized technical datasheet summarizing intended use, performance, limitations, and operational risks for regulators.
- **Model Calibration:** The alignment between predicted confidence probability and actual empirical correctness frequency.
- **Hyperparameter Optimization (HPO):** The systematic, documented tuning process identifying optimal configuration settings without test data contamination.

---

## 📋 GxP-Compliance Checklist: Model Development & Training

### Absolute Must-Haves:
- [ ] Are code commits, data hashes (DVC), container images, and **Random Seeds** version-locked for every training run?
- [ ] Are MLOps and cloud platforms validated as computerized systems under **Annex 11**?
- [ ] Is hyperparameter tuning strictly confined to the validation partition without exposing the test set?
- [ ] Is there a documented rationale justifying the hyperparameter search methodology?
- [ ] Has **Model Calibration (Expected Calibration Error - ECE)** been evaluated to prevent overconfidence?
- [ ] Is an approved **Model Card** completed prior to entering the formal validation phase?

### Red Flags for Inspectors:
- ❌ Production model weights generated inside ad-hoc Jupyter notebooks without pipeline automation.
- ❌ No record of random seeds ("Retraining outputs slightly different weights every time").
- ❌ Hyperparameters tweaked based on hold-out test results to hit approval thresholds.
- ❌ Unpinned software dependencies (`pip install scikit-learn` instead of exact versions).

---

<div align="center">

🌐 **[Deutsche Version](../de/module_07_model_development_training.md)** &nbsp;|&nbsp; **[⬅ Module 06: Data Governance and Data Quality](module_06_data_governance_quality.md)** &nbsp;|&nbsp; **[🏠 Table of Contents](00_overview.md)** &nbsp;|&nbsp; **[Module 08: Validation and Performance Testing ➔](module_08_validation_performance_testing.md)**

</div>
