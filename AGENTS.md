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
5. **Verpflichtender Container-Betrieb (Sandbox-Pflicht & Host-Schutz):**
   - **Start ausschließlich via Container:** Die Web-App **muss ausnahmslos im Docker-/OrbStack-Container gestartet werden** (`docker compose up`).
   - **Kein Start auf dem Host:** Es dürfen **keine** Node- oder Python-Prozesse direkt auf dem macOS-Host gestartet werden (kein lokales `npm run dev` oder lokales Python). Auf dem Host werden keine Pakete installiert.
   - **Befehle & Tests isoliert ausführen:** Sämtliche Aufgaben werden über den Container abgewickelt:
     - Dev-Server: `docker compose up` (oder `docker compose up -d`)
     - Test-Suite: `docker compose run --rm app npm test`
     - Python-Sync: `docker compose run --rm app python3 scripts/check_doc_sync.py`
     - Production Build: `docker compose run --rm app npm run build`
   - **Host-Rolle:** Das macOS-System dient ausschließlich als Editor und Dateisystem. Docker spiegelt alle Änderungen live per Volume-Mount (`.:/app`).
6. **IDE-Layout & Arbeitsumgebung:**
   - Der Agent / Chat befindet sich bevorzugt auf der **linken Seite** (Secondary Side Bar links durch Positionierung der Primary Side Bar rechts oder Zuklappen mit `Cmd + B`), sodass der Dokumentations- und Code-Kontext rechts im breiten Hauptfenster liegt.

---

## 📂 Verzeichnisstruktur
```text
Annex22/
├── README.md                          # Gesamtüberblick & Portal-Dokumentation
├── AGENTS.md                          # Verhaltensrichtlinien, Sandbox-Regeln & Repo-Konventionen
├── Dockerfile                         # Multi-Runtime Container (Node.js 20 + Python 3)
├── docker-compose.yml                 # Sandbox-Definition für Dev-Server & isolierte Befehle
├── .devcontainer/                     # 1-Klick Dev-Container Konfiguration
├── package.json                       # Web-App Abhängigkeiten (Vite, Marked, Mermaid)
├── requirements.txt                   # Python-Abhängigkeiten (youtube-transcript-api, yt-dlp)
├── src/                               # Web-App Quellcode (Vanilla JS, CSS, Engine, Search)
├── scripts/
│   ├── check_doc_sync.py              # Verifikationsskript für DE/EN-Dokumentensynchronität
│   └── extract_transcripts.py         # Skript zum Extrahieren von YouTube-Transkripten
├── tests/                             # Automatisierte GxP-Benchmark- & Unit-Tests
├── data/
│   └── transcripts/                   # Extrahierte YouTube-Untertitel (JSON & Markdown)
└── docs/                              # Zentraler Wissenshub
    ├── de/                            # 15 Deutsche Master-Dokumente (SSOT)
    ├── en/                            # 15 Englische synchrone Spiegel-Dokumente
    └── dev/                           # Entwickler- & Produkt-Dokumentation
        ├── app_design.md              # Technische App-Architektur & Design (für Python-Devs)
        ├── prd.md                     # 22Annex.ai Product Requirements Document
        └── evaluation_criteria.md     # Evaluierungskriterien für den KI-Simulator
```
