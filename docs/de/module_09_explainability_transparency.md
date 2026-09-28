# Modul 09: Explainability and Transparency

<div align="center">

🌐 **[English Version](../en/module_09_explainability_transparency.md)** &nbsp;|&nbsp; **[⬅ Modul 08: Validation and Performance Testing](module_08_validation_performance_testing.md) &nbsp;|&nbsp; [🏠 Inhaltsverzeichnis](00_overview.md) &nbsp;|&nbsp; [Modul 10: Human Oversight / Human in the Loop ➔](module_10_human_oversight_hitl.md)**

</div>

---

## 🎯 Lernziele & Leitfragen
1. **Das Transparenz-Gebot:** Warum reicht „Der Algorithmus hat das so berechnet“ bei Chargenfreigaben und Qualitätsentscheidungen niemals als Begründung aus?
2. **Interpretability vs. Explainability:** Was unterscheidet das globale Verständnis eines Modells von der lokalen Begründung einer einzelnen Vorhersage?
3. **Das Erklärbarkeits-Spektrum:** Wann sind einfache White-Box-Modelle regulatorisch vorzuziehen und wie vervierfachen Black-Boxes den Validierungsaufwand?
4. **Post-hoc-Erklärungsmethoden (SHAP, LIME, Counterfactuals):** Welche mathematischen Werkzeuge eignen sich für GxP und welche Risiken (Instabilität, Widersprüche) drohen?
5. **Zielgruppengerechte Kognition:** Wie müssen Erklärungen für Operatoren, Validierer und Behördeninspektoren aufbereitet sein?

---

## 🧭 Visualisierung: Das Explainability-Spektrum im GxP-Umfeld

```mermaid
graph LR
    subgraph WhiteBox["⚪ White-Box-Modelle"]
        direction TB
        W1["Lineare Regression, Decision Trees"]
        W2["Inhärent transparent & auditierbar"]
        W3["Geringer Validierungsaufwand"]
    end

    subgraph GrayBox["🔘 Gray-Box-Modelle"]
        direction TB
        G1["Random Forests, Gradient Boosting"]
        G2["Post-hoc Methoden erforderlich"]
        G3["Moderater Validierungsaufwand"]
    end

    subgraph BlackBox["⚫ Black-Box-Modelle"]
        direction TB
        B1["Deep Neural Networks, LLMs"]
        B2["Opak: SHAP, LIME, Attention Maps"]
        B3["Vervielfachter Validierungsaufwand (4x)"]
    end

    WhiteBox -->|Steigende Modellkomplexität & Erklärbarkeitsanforderung| GrayBox
    GrayBox --> BlackBox

    style WhiteBox fill:#f0fdf4,stroke:#16a34a,stroke-width:2px
    style GrayBox fill:#fefce8,stroke:#ca8a04,stroke-width:2px
    style BlackBox fill:#fef2f2,stroke:#ef4444,stroke-width:2px
```

---

## 📌 Fachliche Zusammenfassung (Key Takeaways)

### 1. Das Proportionalitätsgebot: Explainability proportionate to Criticality
Unter Annex 22 gilt: **Je höher das Risiko für Produktqualität und Patientensicherheit, desto transparenter und nachvollziehbarer muss die Entscheidung sein.**
* Wenn eine KI eine Arzneimittelcharge ablehnt oder freigibt, haben Behörden und die Qualified Person (QP) das gesetzliche Recht, die Kausalität zu verstehen.
* Die Erklärung muss in der **Fachsprache der Domänenexperten** (Qualitätssicherung, Laborantin, QP) formuliert sein – statistische Rohvektoren oder Tensor-Matrizen genügen den gesetzlichen Vorgaben nicht.

### 2. Begriffliche Abgrenzung: Interpretierbarkeit vs. Erklärbarkeit
* **Interpretability (Global):** Die inhärente Verständlichkeit der gesamten mathematischen Modellstruktur (z.B. ein Entscheidungsbaum mit 5 klaren Verzweigungsregeln).
* **Explainability (Lokal / Post-hoc):** Die Fähigkeit, für einen **konkreten Einzelfall** (z.B. Abweichungsmeldung DEV-2026-081) exakt darzulegen, welche Eingangsparameter den Ausschlag für genau diese Vorhersage gegeben haben.

### 3. Das Modell-Spektrum und der regulatorische Anreiz
Annex 22 verbietet komplexe Deep-Learning- oder Transformer-Modelle nicht, setzt jedoch massive ökonomische und regulatorische Hürden:
* **White-Box (Inhärent transparent):** Für hochkritische Anwendungen (z.B. In-Process-Kontrollen) ist ein White-Box-Modell (z.B. logistische Regression, flache Entscheidungsbäume) fast immer die überlegene Wahl, da die mathematische Herleitung direkt im Audit vorgelegt werden kann.
* **Black-Box-Penalty:** Der Einsatz von undurchsichtigen neuronalen Netzen kann die Validierungsdauer und -kosten **vervierfachen**, da nicht nur das Modell selbst, sondern auch die Erklärbarkeits-Pipeline vollumfänglich validiert werden muss.

### 4. Post-hoc-Erklärungsmethoden & Ihre Fallstricke
Wenn komplexe Modelle unumgänglich sind, greift Annex 22 auf Post-hoc-Methoden zurück:
* **SHAP (Shapley Additive exPlanations):** Basiert auf spieltheoretischen Konzepten. Berechnet den fairen additiven Beitrag jedes Features zum Gesamtergebnis. Gilt im Pharma-Umfeld wegen seiner mathematischen Konsistenz als Goldstandard.
* **LIME (Local Interpretable Model-agnostic Explanations):** Erzeugt eine lokale lineare Annäherung um den Datenpunkt herum. 
  - *GxP-Warnung:* LIME neigt zu stochastischer Instabilität. Wenn dieselbe Abweichungsmeldung bei zwei aufeinanderfolgenden Abfragen leicht unterschiedliche Erklärungen ausgibt, kollabiert das Vertrauen der Inspektoren und Anwender sofort.
* **Counterfactual Explanations (Gegenfaktische Erklärungen):** Für Produktions-Operatoren besonders wertvoll. Sie beschreiben die kleinste notwendige Änderung, um ein anderes Ergebnis zu erzielen:  
  *„Die Tablette wurde als fehlerhaft eingestuft, weil die Presskraft bei 18,2 kN lag. Bei einer Presskraft unter 17,5 kN wäre die Freigabe erfolgt.“*
* **Attention Heatmaps (für NLP/LLMs):** Zeigen, welche Textpassagen Aufmerksamkeit erregten. Wichtig: *Attention ist keine Kausalität* – sie zeigt Korrelation, nicht zwingend den logischen Grund.

> [!CAUTION]
> **Praxisfall:** Ein Pharmaunternehmen nutzte globale Feature Importances für ein Predictive-Maintenance-System. Bei jedem automatischen Re-Training veränderten sich die wichtigsten Einflussfaktoren drastisch (montags war es die Temperatur, dienstags der Druck bei identischem Maschinenzustand). Das Bedienpersonal verweigerte die Nutzung des Systems vollständig wegen wahrgenommener Beliebigkeit. Das System musste auf stabilere Permutation Importance umgestellt und neu validiert werden.

### 5. Zielgruppenorientierte Bereitstellung (Cognitive Load Management)
Erklärungen müssen für drei distincte Zielgruppen aufbereitet sein:
1. **Operator / Werker an der Linie:** Minimale kognitive Belastung, unmittelbar handlungsorientiert (*Actionable Insights* – was muss an der Maschine korrigiert werden?).
2. **Validierungsingenieur / QA:** Statistische Detailtiefe, Sensitivitätsanalysen, Nachweis der numerischen Stabilität der Erklärungsmethode.
3. **Behördeninspektor (EMA/FDA):** Methodische Rechtfertigung, Nachweis der Drift-Freiheit der Erklärungen und Speicherung der Erklärungen im Audit Trail.

---

## 💡 Zentrale Fachbegriffe & Konzepte (Glossar)

- **Explainability (Erklärbarkeit):** Die methodische Fähigkeit, einer fachkundigen Person die ausschlaggebenden Faktoren für eine spezifische KI-Vorhersage verständlich darzulegen.
- **Interpretability (Interpretierbarkeit):** Das Maß, in dem ein Mensch die interne Funktionsweise und Entscheidungslogik des Gesamtmodells a priori nachvollziehen kann.
- **SHAP (Shapley Additive exPlanations):** Ein spieltheoretischer Ansatz zur konsistenten Quantifizierung des Beitrags einzelner Eingabemerkmale zu einer Modellvorhersage.
- **LIME:** Eine perturbationsbasierte Methode zur lokalen Approximation von Modellentscheidungen, die wegen Instabilitätsrisiken im GMP-Umfeld streng kontrolliert werden muss.
- **Counterfactual Explanation:** Eine Erklärung, die angibt, wie Eingabedaten minimal hätten verändert werden müssen, um eine alternative Modellentscheidung herbeizuführen.
- **Black-Box Penalty:** Der massive Mehraufwand an Dokumentation, Verifikation und kontinuierlicher Überwachung, der entsteht, wenn opake Algorithmen in GxP-kritischen Prozessen eingesetzt werden.

---

## 📋 GxP-Compliance Checklist: Explainability

### Absolute Must-Haves:
- [ ] Ist die gewählte Modellkomplexität (White vs. Gray vs. Black Box) proportional zur Kritikalität des Prozesses schriftlich begründet?
- [ ] Werden zu jeder GxP-relevanten Inferenz-Entscheidung verständliche, lokale Erklärungsdaten im Audit Trail protokolliert?
- [ ] Wurde die verwendete Erklärungsmethode (z.B. SHAP-Pipeline) auf numerische Stabilität und Reproduzierbarkeit hin validiert?
- [ ] Sind die Erklärungen auf den Bildschirmen der Operatoren klar handlungsorientiert und frei von unverständlichem Data-Science-Jargon?
- [ ] Wurden Gegenproben (*Negative Testing*) durchgeführt, um sicherzustellen, dass die Erklärungswerkzeuge nicht über tatsächliche Modellschwächen hinwegtäuschen?
- [ ] Gibt es für das Bedienpersonal ein Schulungskonzept zur korrekten Interpretation von KI-Erklärungen und Konfidenzwerten?

### Rote Flaggen bei Inspektionen (Red Flags):
- ❌ Einsatz eines tiefen neuronalen Netzes für Freigabeentscheidungen ohne implementierte lokale Erklärbarkeitskomponente.
- ❌ Erklärungsmethoden liefern für identische Testfälle bei wiederholter Abfrage unterschiedliche Feature-Rankings (*Instabilität*).
- ❌ Die Dokumentation für Inspektoren enthält lediglich rohe Code-Ausschnitte ohne fachliche Kausalitätserklärung.
- ❌ Operatoren können nicht erklären, warum das System eine Warnung ausgegeben hat („Die KI schlägt das eben vor“).

---

<div align="center">

🌐 **[English Version](../en/module_09_explainability_transparency.md)** &nbsp;|&nbsp; **[⬅ Modul 08: Validation and Performance Testing](module_08_validation_performance_testing.md) &nbsp;|&nbsp; [🏠 Inhaltsverzeichnis](00_overview.md) &nbsp;|&nbsp; [Modul 10: Human Oversight / Human in the Loop ➔](module_10_human_oversight_hitl.md)**

</div>
