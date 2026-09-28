# Modul 12: Audit and Inspection Readiness

<div align="center">

🌐 **[English Version](../en/module_12_audit_inspection_readiness.md)** &nbsp;|&nbsp; **[⬅ Modul 11: Lifecycle Management and Continuous Monitoring](module_11_lifecycle_continuous_monitoring.md) &nbsp;|&nbsp; [🏠 Inhaltsverzeichnis](00_overview.md)**

</div>

---

## 🎯 Lernziele & Leitfragen
1. **Das Disziplin-Postulat:** Warum kann man für eine KI-Behördeninspektion nicht „auf den letzten Drücker büffeln“ (*No Last-Minute Scramble*)?
2. **Der 5-Stufen-Inspektionspfad:** Nach welcher exakten, methodischen Reihenfolge durchleuchten Inspektoren von EMA und FDA pharmazeutische KI-Systeme?
3. **Das Master AI Inventory:** Warum ist das Inventar die allererste Verteidigungslinie und weshalb führt „Schatten-KI“ (*Shadow AI*) zur sofortigen Stilllegung?
4. **Verhalten im Audit-Raum:** Wie verteidigt man eine konkrete historische Modellvorhersage professionell und warum ist ehrliches Nicht-Wissen besser als Improvisieren?
5. **Cross-funktionale Einheit:** Wie verhindert man, dass sich Data Science, IT und QA vor dem Inspektor gegenseitig widersprechen?

---

## 🧭 Visualisierung: Der 5-Stufen-Inspektionspfad der Behörden

```mermaid
flowchart TD
    I1["Schritt 1: Master AI Inventory anfordern<br/><i>(Vollständigkeit prüfen, Risikoklassen abgleichen)</i>"] --> I2["Schritt 2: Stichprobe auswählen & Traceability prüfen<br/><i>(Tier 1 Policy ➔ Tier 2 System Specs ➔ Tier 3 Code & Data Hashes)</i>"]
    I2 --> I3["Schritt 3: Historische Entscheidung herausgreifen<br/><i>(Live-Challenge: Explainability, Konfidenz & Deviation-Verknüpfung)</i>"]
    I3 --> I4["Schritt 4: Shopfloor-Interviews durchführen<br/><i>(Technischer Fluency-Test des Linienpersonals zu Fehlermodi)</i>"]
    I4 --> I5["Schritt 5: Soll vs. Ist abgleichen<br/><i>(Prüfung: Entspricht die Praxis an der Linie exakt der schriftlichen SOP?)</i>"]

    style I1 fill:#f8fafc,stroke:#64748b,stroke-width:2px
    style I2 fill:#eff6ff,stroke:#2563eb,stroke-width:2px
    style I3 fill:#fefce8,stroke:#ca8a04,stroke-width:2px
    style I4 fill:#faf5ff,stroke:#9333ea,stroke-width:2px
    style I5 fill:#ecfdf5,stroke:#059669,stroke-width:3px
```

---

## 📌 Fachliche Zusammenfassung (Key Takeaways)

### 1. Das Grundgesetz: Inspection Readiness ist tägliche Routine
Für eine Annex-22-Inspektion kann man nicht zwei Wochen vor dem Termin hektisch Akten ordnen. 
* Wer versucht, Datenherkunft, Random Seeds, Bias-Analysen und Drift-Metriken erst kurz vor dem Audit zusammenzutragen, wird scheitern.
* Echte Inspektionssicherheit basiert auf **gelebter täglicher Ingenieurs- und QMS-Disziplin** über den gesamten Lebenszyklus des Systems hinweg.

### 2. Die Schweregrade von Mängeln (Severity Grading)
* **Critical Finding (Kritischer Mangel):** Unmittelbares Risiko für Patientensicherheit oder Produktqualität (z.B. unkontrolliertes, dynamisch weiterlernendes Modell bei Chargenfreigabe). *Rechtsfolge:* Sofortiger Entzug bzw. Ruhen der Herstellungserlaubnis (*Suspension of Manufacturing Authorization*).
* **Major Finding (Schwerwiegender Mangel):** Erhebliche Abweichung von GMP-Grundsätzen (z.B. Schatten-KI im Einsatz, Retraining ohne Revalidierungsbericht, fehlende Data Lineage). *Rechtsfolge:* Warning Letter; Frist von 15 bis 30 Tagen zur Vorlage eines Sanierungsplans.
* **Minor Finding (Geringfügiger Mangel):** Einzelne formale Dokumentationsschwächen ohne direkten Einfluss auf Produktqualität; Abarbeitung über reguläres CAPA-System.

### 3. Die Dokumentationshierarchie (Die 3 Tiers)
Behörden arbeiten sich strukturiert von der Makro- zur Mikroebene vor:
* **Tier 1 (Organisatorische Vorgaben):** Übergreifende AI-Governance-Policy, Data-Ethics-Richtlinien, SOPs für Modellvalidierung und Change Control.
* **Tier 2 (Systemspezifische Dokumente):** *Master AI Inventory*, Intended Use Specification (Systemgrenzen), User Requirements (URS), Validierungsplan und -bericht (mit *Metric Quad*), Model Cards.
* **Tier 3 (Granulare technische Evidenz):** Trainingsdaten-Hashes, Code-Repositories (Git Commit), MLOps-Logs (MLflow), Random Seeds, Konfusionsmatrizen, Kalibrierungs-Plots und Inferenz-Audit-Trails.

### 4. Das Master AI Inventory als erste Verteidigungslinie
Die allererste Frage des Inspektors lautet ausnahmslos: **„Zeigen Sie mir Ihr vollständiges KI-Inventar.“**
Jeder Eintrag muss zwingend enthalten:
1. Eindeutige System-ID und Versionsnummer
2. Prägnante Zusammenfassung des *Intended Use*
3. Risikoklassifizierung (Kritikalität nach Annex 22 / Annex 11)
4. Verantwortlicher Business & Technical Owner (QA / IT)
5. Aktueller Validierungs- und Monitoring-Status

> [!CAUTION]
> **Praxisfall: Der Schatten-KI-Kollaps:** Ein Team startete ein Pilotprojekt zur automatischen Vor-Sortierung von Packungsbeilagen. Weil das Tool so hervorragend funktionierte, nutzte das Schichtpersonal es stillschweigend monatelang im Produktivbetrieb – ohne Wissen der QA. Während einer Routineinspektion erwähnte ein Operator das Tool beiläufig. Da das System nicht im *Master AI Inventory* gelistet war, konnten weder Validierungsdokumente noch Change-Control-Nachweise vorgelegt werden. Das Ergebnis: Ein *Major Finding* wegen Führungs- und Kontrollversagens (*Governance Failure*) und sofortiges Nutzungsverbot.

### 5. Verhalten im Audit-Raum (Surviving the Audit Room)
Wenn Auditoren eine konkrete historische Modellentscheidung herausgreifen:
* **Keine Spekulationen:** Niemals Antworten improvisieren, nur um kompetent zu wirken. Der Satz: *„Das ist ein spezifischer technischer Parameter, den ich anhand des Audit-Trails sofort verifiziere und Ihnen vorlege“* zeugt von professioneller Governance. Erfundenes Halbwissen, das widerlegt wird, zerstört die Glaubwürdigkeit des gesamten Standorts.
* **Umgang mit Fehlentscheidungen:** Auch ein validiertes KI-Modell macht Fehler. Hat das Modell in einem Fall falsch klassifiziert, ist das **kein Mangel**, sofern das Unternehmen nachweisen kann:
  1. Dass der Fehler durch das *Human-in-the-Loop*-System rechtzeitig abgefangen wurde.
  2. Dass der Vorfall als Abweichung (*Deviation*) erfasst wurde.
  3. Dass die CAPA-Maßnahme wirksam gegriffen hat.
* **Gemeinsames Vokabular (United Front):** Data Science, CSV-Validierung, IT und QA müssen vorab in gemeinsamen **Mock Inspections (Inspektionssimulationen)** trainiert werden. Widersprechen sich Data Scientist und QA-Leiter vor dem Inspektor bei technischen Definitionen, eskaliert die Prüfung sofort.

---

## 💡 Zentrale Fachbegriffe & Konzepte (Glossar)

- **Inspection Readiness:** Der permanente Zustand operativer und dokumentarischer Vorbereitung, der es erlaubt, behördlichen Prüfern jederzeit lückenlose GxP-Nachweise vorzulegen.
- **Master AI Inventory:** Das zentrale, verbindliche Verzeichnis aller im Unternehmen eingesetzten oder erprobten KI-Systeme inklusive Kritikalität und Validierungsstatus.
- **Shadow AI (Schatten-KI):** Der informelle, unautorisierte Einsatz von KI-Tools oder Piloten im GMP-Betrieb ohne Einbindung der QA und ohne Eintrag im Master Inventory.
- **Mock Inspection:** Eine realistische behördliche Prüfungssimulation mit externen oder internen Auditoren unter Zeitdruck zur Feststellung von Dokumentations- und Kommunikationslücken.
- **Drill-Down Capability:** Die Fähigkeit der Teams und Softwaresysteme, ausgehend von übergeordneten Kennzahlen unmittelbar auf die darunterliegenden Rohdaten und Skripte zuzugreifen.
- **Portfolio-wide CAPA:** Der Ansatz, gefundene Schwachstellen an einem KI-Modell sofort proaktiv auf alle weiteren im Unternehmen betriebenen Modelle zu übertragen und dort abzustellen.

---

## 📋 GxP-Compliance Checklist: Inspection Readiness

### Absolute Must-Haves:
- [ ] Liegt ein vollständig gepflegtes, aktuelles **Master AI Inventory** aller aktiven und erprobten KI-Systeme vor?
- [ ] Existiert für jedes produktive Modell eine standardisierte, genehmigte **Model Card**?
- [ ] Können technische Nachweise (Git-Commit, DVC-Hash, Docker-Container, Random Seeds) innerhalb von Minuten vorgelegt werden (*Fast Retrieval*)?
- [ ] Werden regelmäßig **Mock Inspections** mit Beteiligung von Data Science, IT und QA unter Realbedingungen durchgeführt?
- [ ] Wurden die Mitarbeiter an der Produktionslinie zu den systemspezifischen Fehlergrenzen der genutzten KI geschult (*Shopfloor Fluency*)?
- [ ] Sind alle historischen Fehlentscheidungen der KI lückenlos mit entsprechenden Abweichungsberichten (*Deviations*) und CAPAs verknüpft?

### Rote Flaggen bei Inspektionen (Red Flags):
- ❌ Auffinden von „Schatten-KI“ (Piloten oder lokale Tools), die in der Produktion genutzt werden, aber im Inventar fehlen.
- ❌ Dokumente und SOPs spiegeln veraltete Systemzustände wider (*Documentation Drift*).
- ❌ IT/Data Science und QA widersprechen sich im Audit-Gespräch über Rollen, Grenzwerte oder Validierungsansätze.
- ❌ Das Team kann auf Nachfrage des Prüfers die Rohdaten oder Trainings-Hashes für ein aktives Modell nicht lokalisieren.

---

<div align="center">

🌐 **[English Version](../en/module_12_audit_inspection_readiness.md)** &nbsp;|&nbsp; **[⬅ Modul 11: Lifecycle Management and Continuous Monitoring](module_11_lifecycle_continuous_monitoring.md) &nbsp;|&nbsp; [🏠 Inhaltsverzeichnis](00_overview.md)**

</div>
