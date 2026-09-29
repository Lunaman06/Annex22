# Modul 04: Risk Based Approach to AI

<div align="center">

🌐 **[English Version](../en/module_04_risk_based_approach.md)** &nbsp;|&nbsp; **[⬅ Modul 03: Scope and Applicability](module_03_scope_applicability.md)** &nbsp;|&nbsp; **[🏠 Inhaltsverzeichnis](00_overview.md)** &nbsp;|&nbsp; **[Modul 05: Intended Use and Model Definition ➔](module_05_intended_use_model_definition.md)**

</div>

---

## 🧭 Kernkonzept im Überblick: Die 5 KI-Fehlermodi & Silent Degradation

```mermaid
flowchart LR
    subgraph FailModes["⚠️ 5 KI-Fehlermodi"]
        direction TB
        M1["1. Systematic Data Bias"]
        M2["2. Distribution / Concept Drift"]
        M3["3. Adversarial / Edge Cases"]
        M4["4. Confidence Miscalibration"]
        M5["5. Spurious Correlations"]
        M1 --- M2 --- M3 --- M4 --- M5
    end

    Silent["🚨 SILENT DEGRADATION<br/><b>Kein Systemabsturz</b><br/><i>Schleichender Qualitätsverlust<br/>ohne Software-Fehlercode</i>"]

    subgraph Mitigation["🛡️ Annex 22 Kontrollen"]
        direction TB
        C1["Out-of-Distribution (OOD) Gates"]
        C2["Human Oversight & Active Challenge"]
        C3["Kontinuierliches statistisches Monitoring"]
        C1 --- C2 --- C3
    end

    FailModes ==>|"Führen unbemerkt zu"| Silent
    Silent ==>|"Wird beherrscht durch"| Mitigation

    style FailModes fill:#fef2f2,stroke:#ef4444,stroke-width:2px
    style Silent fill:#fff7ed,stroke:#ea580c,stroke-width:2px
    style Mitigation fill:#f0fdf4,stroke:#16a34a,stroke-width:2px
```

---

## 🎯 Lernziele & Leitfragen
1. **Warum ist eine „Gleichbehandlung aller KI-Systeme“ (*Flat Governance*) regulatorisch und operativ gefährlich?**
2. **Wie unterscheidet sich das Versagen von KI fundamental von traditioneller Software?**
3. **Welche 5 KI-spezifischen Fehlermodi müssen in der Risikoanalyse zwingend adressiert werden?**
4. **Wie wirkt sich die Reversibilität und die kumulative Wirkung auf die Risikoeinstufung aus?**
5. **Wie unterscheidet sich Human-in-the-Loop (HITL) von Human-on-the-Loop (HOTL)?**

---

## 📌 Fachliche Zusammenfassung (Key Takeaways)

### 1. Das Proportionalitätsgebot ([Draft §2.3])
- **Regulatorische Vorgabe ([Draft §2.3]):** Der Umfang an Kontrollmaßnahmen, Qualifizierung und Validierung muss stets angemessen und proportional zum Risiko sein, das vom KI-System für Produktqualität, Datenintegrität und Patientensicherheit ausgeht.
- **Ressourcenallokation:** QA- und Validierungsressourcen sind begrenzt. Wer versucht, unkritische Assistenzwerkzeuge mit der gleichen bürokratischen Tiefe wie primäre Freigabesysteme zu behandeln, betreibt ineffizientes *Compliance Theater*. Die Kontrollintensität muss risikobasiert skaliert werden.

### 2. Wie KI versagt: Stille Degradierung statt Systemabsturz
- **Traditionelle Software:** Binäres Fehlermuster – Software stürzt ab, wirft einen Error-Code oder bricht den Prozess ab.
- **KI-Systeme:** Erleiden eine **schleichende, stille Leistungsverschlechterung (*Silent Degradation*)**. Das Modell stürzt nicht ab, sondern liefert weiterhin Antworten – oft sogar mit trügerisch hoher mathematischer Konfidenz (*Confidence Miscalibration*).

### 3. Die 5 KI-spezifischen Fehlermodi für FMEA / Risikobewertungen
Herkömmliche IT-Risikovorlagen reichen für KI-Systeme nicht aus. Ein Inspektor erwartet die explizite Bewertung von:
1. **Systematic Bias:** Trainingsdaten spiegeln nicht alle realen Betriebszustände wider, was zu systematisch verzerrten Ausgaben führt.
2. **Distribution Shift:** Die reale Prozess- oder Datenverteilung weicht im Laufe der Zeit von den Trainingsdaten ab.
3. **Adversarial / Edge Inputs:** Ungewöhnliche, seltene Eingangskombinationen, für die das Modell keine Repräsentanz besitzt.
4. **Confidence Miscalibration:** Das Modell trifft eine völlig falsche Vorhersage, gibt aber eine Konfidenz von z.B. 99% an.
5. **Spurious Correlations:** Scheinzusammenhänge (z.B. Beleuchtung korreliert zufällig mit Fehlerrate), die das Modell als Kausalität gelernt hat, machen es im Realbetrieb extrem fragil.

### 4. Patientenauswirkung, Reversibilität & kumulativer Einfluss ([Didaktik])
*Dieses strukturierte Bewertungsraster dient als didaktische Orientierung für das Quality Risk Management nach ICH Q9 (R1) ([Didaktik]):*
- **Direkter Einfluss:** Freigabe von nicht-spezifikationskonformen Arzneimitteln (höchste Kritikalität).
- **Kumulativer Einfluss ([Didaktik]):** Ein winziges Restrisiko bei einer Einzelentscheidung summiert sich bei tausenden automatisierten Entscheidungen pro Tag zu einem untragbaren Gesamtrisiko für Patienten.
- **Reversibilität als Hebel ([Didaktik]):**
  - *In-Process:* Ein Fehler in frühen Prozessschritten, der durch nachgelagerte Inprozesskontrollen sicher erkannt und korrigiert werden kann, erlaubt schlankere Kontrollmechanismen.
  - *Batch Release:* Eine fehlerhafte Chargenfreigabe ist nach Auslieferung praktisch **irreversibel**.
- **Out-of-Distribution (OOD) Detection ([Best Practice: ML-Praxis]):** Ein integrierter Sicherheitsmechanismus, bei dem die KI selbst erkennt: *„Diesen Datenpunkt kenne ich nicht – ich verweigere die Entscheidung und eskaliere an einen Menschen.“*

### 5. Skalierung der menschlichen Aufsicht: HITL vs. HOTL ([Didaktik])

> *Hinweis zum Draft-Wortlaut:* Der Draft verlangt für getestete Modelle keine pauschale HITL (Auslegung von §1, §3.3, §10.5 [Auslegung]). Wird der Testaufwand des Modells jedoch reduziert, weil ein Mensch die finale Entscheidung trifft, muss die Operator-Verantwortung explizit im Intended Use verankert sein und Schulung sowie Operator-Leistung müssen wie bei manuellen Prozessen überwacht werden ([Draft §3.3]). Nach [Draft §10.5] sind Review-Aufzeichnungen zu führen; je nach Kritikalität und Testtiefe kann dies die Prüfung jeder einzelnen Ausgabe bedeuten. Die Einteilung in HITL/HOTL ist ein didaktisches Industriemodell ([Didaktik]):

| Dimension | High-Risk System (Voll qualifiziert vs. Operator-Assistenz) | Moderate-Risk System |
| :--- | :--- | :--- |
| **Validierung** | Umfassende Adversarial-Tests, Randfallprüfungen, strikte Akzeptanzkriterien ([Draft §4, §8]) | Repräsentative Test-Sets, Fokus auf Hauptszenarien |
| **Monitoring** | Kontinuierliches Monitoring von Performance und Input-Verteilung ([Draft §10.3, §10.4]) | Risikobasierte Überprüfung in definierten Intervallen |
| **Menschliche Aufsicht ([Didaktik])** | **Human-in-the-Loop (HITL):** Bei reduzierter Modell-Testtiefe Prüfung jeder Ausgabe zwingend ([Draft §3.3, §10.5]). Bei voll qualifizierter Automatisierung (z. B. Vial-Sortierung) Überwachung und Stichproben. | **Human-on-the-Loop (HOTL):** Mensch überwacht aggregierte Trends und greift bei Alarmen oder Anomalien ein. |

### 6. Lehren aus illustrativen Praxisszenarien ([Didaktik])
*Die folgenden Szenarien veranschaulichen typische Risiken der betrieblichen Praxis (didaktische Fallbeispiele, nicht belegt):*
- **Bioreaktor-pH-Steuerung (Operational Atrophy):** Der manuelle Fallback existierte jahrelang nur auf dem Papier. Als QA dies prüfte, stellte sich heraus: Die Operatoren hatten verlernt, den Kessel manuell zu steuern! **Lösung:** Pflicht zu regelmäßigen manuellen Notfallübungen (*Fallback Drills*).
- **Abweichungs-Triage (Cascading Bias):** Eine fehlerhafte Ersteinstufung durch KI verfälscht die Ursachenanalyse und CAPA-Wirksamkeit der gesamten Qualitätsorganisation.
- **GenAI für Berichte (Cognitive Anchoring):** Vorformulierte KI-Texte verleiten Menschen dazu, dem Narrativ unkritisch zu folgen. **Lösung:** Audit-Tracking von Korrekturen durch den Reviewer.

---

## 💡 Zentrale Fachbegriffe & Konzepte (Glossar)

| Begriff | Definition & Annex-22-Bedeutung |
| :--- | :--- |
| **Confidence Miscalibration** | Diskrepanz zwischen vorhergesagter Wahrscheinlichkeit des Modells und der tatsächlichen Richtigkeit. |
| **Out-of-Distribution (OOD)** | Datenpunkte, die außerhalb der mathematischen Verteilung der Trainingsdaten liegen. |
| **Spurious Correlation** | Statistisch messbare, aber inhaltlich bedeutungslose Koinzidenzen in den Trainingsdaten. |
| **Cognitive Anchoring** | Psychologische Fixierung eines menschlichen Prüfers auf einen vorformulierten KI-Lösungsvorschlag. |
| **Operational Atrophy** | Der schleichende Verlust manueller Fachkompetenz bei Bedienpersonal durch übermäßiges Vertrauen in Automatisierung. |

---

## 📋 GxP-Compliance Checklist & Kontrollfragen

- [ ] Wurden die 5 KI-spezifischen Fehlermodi in der Risikoanalyse nach ICH Q9 dokumentiert?
- [ ] Wurde das kumulative Risiko bei hochfrequenten Entscheidungen quantifiziert?
- [ ] Wurde geklärt, ob Fehlentscheidungen im weiteren Prozessverlauf reversibel sind?
- [ ] Besitzt das System eine Erkennung für ungelernte Randfälle (*OOD Detection*)?
- [ ] Werden manuelle Fallback-Szenarien regelmäßig in der Praxis geübt?
- [ ] Werden Reviewer gegen *Cognitive Anchoring* und *Automation Bias* geschult?

---

<div align="center">

🌐 **[English Version](../en/module_04_risk_based_approach.md)** &nbsp;|&nbsp; **[⬅ Modul 03: Scope and Applicability](module_03_scope_applicability.md)** &nbsp;|&nbsp; **[🏠 Inhaltsverzeichnis](00_overview.md)** &nbsp;|&nbsp; **[Modul 05: Intended Use and Model Definition ➔](module_05_intended_use_model_definition.md)**

</div>
