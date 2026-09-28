# Annex 22 Lernprojekt: AI Compliance in Pharma (EU GMP Annex 22)

## 📌 Projektziel & Kontext
Dieses Repository dient als strukturiertes Lern- und Wissensprojekt zum Thema **EU GMP Annex 22** (Artificial Intelligence and Machine Learning in GxP/pharmazeutischer Produktion). 

Die Wissensbasis basiert auf dem 12-teiligen Kurs:
- **YouTube-Playlist:** [EU GMP Annex 22 AI Compliance in Pharma](https://youtube.com/playlist?list=PLsyAi2EwvNNjE-uAH1N_3d6JBa8yF8v1L)
- **Regulatorischer Bezug:** Draft EU GMP Annex 22 (veröffentlicht Juli 2025 durch die Europäische Kommission / EMA), EU AI Act, EU GMP Annex 11 (Computerised Systems) und GAMP 5 Second Edition.

---

## 🛠️ Arbeitsweise & Rollenverteilung (Pair-Learning)

1. **Zweisprachige Dokumentation:**
   - Erklärungen, didaktische Zusammenfassungen, Checklisten und Diskussionsnotizen werden standardmäßig auf **Deutsch** verfasst.
   - Regulatorische Fachbegriffe, Zitate und GxP-Terminologie bleiben auf **Englisch** (z.B. *Human-in-the-Loop (HITL)*, *Intended Use*, *Static vs. Dynamic Models*, *Concept Drift*, *ALCOA+*, *Continuous Monitoring*).
2. **Zentraler Wissenshub unter `docs/`:**
   - Jedes Modul besitzt eine eigenständige Datei `docs/module_XX_<slug>.md` mit:
     - Zusammenfassung, Leitfragen, GxP-Checkliste, Glossar und persönlichen Notizen.
   - `docs/00_overview.md` dient als Master-Framework und verlinkt auf alle Einzelmodule.
   - Begleitmaterialien, Grafiken oder Templates können in einem separaten Ordner (z.B. `assets/`) abgelegt und von `docs/` aus referenziert werden.
3. **Quellentreue:**
   - Aussagen müssen auf den Transkripten (`data/transcripts/markdown/`) und der tatsächlichen EU GMP Annex 22 Draft Guideline basieren.
   - Wenn eine Anforderung im Draft strikt ist (z.B. Ausschluss dynamischer, sich selbst weitertrainierender Modelle im GMP-Betrieb; Einschränkung von LLMs für kritische Entscheidungen), muss dies präzise herausgearbeitet werden.
4. **Interaktives Lernen:**
   - Der Assistent unterstützt den Nutzer aktiv durch das Erstellen von Zusammenfassungen, das Erklären unklarer Passagen, das Abfragen von Wissen durch Testfragen und das Verknüpfen mit realen Pharma-Szenarien.

---

## 📂 Verzeichnisstruktur
```text
Annex22/
├── README.md                          # Gesamtüberblick & Lernfortschritt
├── AGENTS.md                          # Verhaltensrichtlinien & Repo-Konventionen
├── requirements.txt                   # Python-Abhängigkeiten (youtube-transcript-api, yt-dlp)
├── scripts/
│   └── extract_transcripts.py         # Skript zum Aktualisieren & Extrahieren der Transkripte
├── data/
│   └── transcripts/
│       ├── json/                      # Rohdaten mit Timecodes & Metadaten
│       └── markdown/                  # Lesbare Texttranskripte mit Zeitmarkern
└── docs/                              # Zentraler Wissenshub
    ├── 00_overview.md # Master-Framework & Prozesslandkarte
    ├── module_01_introduction_ai_gxp.md
    ├── module_02_overview_annex_22.md
    ├── module_03_scope_applicability.md
    ├── module_04_risk_based_approach.md
    ├── module_05_intended_use_model_definition.md
    └── module_06_... bis module_12_...
```
