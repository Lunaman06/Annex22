#!/usr/bin/env python3
"""
Transcript extraction and module initialization script for EU GMP Annex 22 Learning Project.
Playlist: https://youtube.com/playlist?list=PLsyAi2EwvNNjE-uAH1N_3d6JBa8yF8v1L
"""

import os
import json
from pathlib import Path
from youtube_transcript_api import YouTubeTranscriptApi

MODULES = [
    {
        "id": "01",
        "slug": "01_introduction_ai_gxp",
        "video_id": "UnDBgKPAhow",
        "title": "Introduction to AI in GxP Environments",
        "duration": "09:50"
    },
    {
        "id": "02",
        "slug": "02_overview_annex_22",
        "video_id": "ZWZ0stmf374",
        "title": "Overview of Annex 22",
        "duration": "08:02"
    },
    {
        "id": "03",
        "slug": "03_scope_applicability",
        "video_id": "kNL-ZjNRDeQ",
        "title": "Scope and Applicability of AI Systems",
        "duration": "08:35"
    },
    {
        "id": "04",
        "slug": "04_risk_based_approach",
        "video_id": "6ZpznHuwpjg",
        "title": "Risk Based Approach to AI",
        "duration": "10:12"
    },
    {
        "id": "05",
        "slug": "05_intended_use_model_definition",
        "video_id": "C-mXphEyJjk",
        "title": "Intended Use and Model Definition",
        "duration": "08:25"
    },
    {
        "id": "06",
        "slug": "06_data_governance_quality",
        "video_id": "MwEocONFyuA",
        "title": "Data Governance and Data Quality",
        "duration": "09:18"
    },
    {
        "id": "07",
        "slug": "07_model_development_training",
        "video_id": "xKvfvcaYc1k",
        "title": "AI Model Development and Training",
        "duration": "09:21"
    },
    {
        "id": "08",
        "slug": "08_validation_performance_testing",
        "video_id": "9AGeFbRXa98",
        "title": "Validation and Performance Testing",
        "duration": "10:26"
    },
    {
        "id": "09",
        "slug": "09_explainability_transparency",
        "video_id": "GvCEQtf7TFU",
        "title": "Explainability and Transparency",
        "duration": "08:14"
    },
    {
        "id": "10",
        "slug": "10_human_oversight_hitl",
        "video_id": "1382ohCb0oQ",
        "title": "Human Oversight / Human in the Loop",
        "duration": "07:19"
    },
    {
        "id": "11",
        "slug": "11_lifecycle_continuous_monitoring",
        "video_id": "sFzPMfLAFok",
        "title": "Lifecycle Management and Continuous Monitoring",
        "duration": "09:38"
    },
    {
        "id": "12",
        "slug": "12_audit_inspection_readiness",
        "video_id": "4LsUtqTduOk",
        "title": "Audit and Inspection Readiness",
        "duration": "09:13"
    }
]

def format_timestamp(seconds: float) -> str:
    m = int(seconds // 60)
    s = int(seconds % 60)
    return f"{m:02d}:{s:02d}"

def process_snippets_to_readable_text(snippets):
    """Groups cues into readable paragraphs with timestamp markers."""
    paragraphs = []
    current_para = []
    current_time = 0
    last_marker_time = -60

    for s in snippets:
        text = s.text.replace("\n", " ").strip()
        start = s.start
        
        if not text:
            continue
            
        if start - last_marker_time >= 60:
            if current_para:
                paragraphs.append(f"**[{format_timestamp(current_time)}]** " + " ".join(current_para))
                current_para = []
            current_time = start
            last_marker_time = start
            
        current_para.append(text)

    if current_para:
        paragraphs.append(f"**[{format_timestamp(current_time)}]** " + " ".join(current_para))

    return "\n\n".join(paragraphs)

def main():
    base_dir = Path(__file__).resolve().parent.parent
    raw_json_dir = base_dir / "data" / "transcripts" / "json"
    raw_md_dir = base_dir / "data" / "transcripts" / "markdown"
    docs_dir = base_dir / "docs"

    raw_json_dir.mkdir(parents=True, exist_ok=True)
    raw_md_dir.mkdir(parents=True, exist_ok=True)
    docs_dir.mkdir(parents=True, exist_ok=True)

    api = YouTubeTranscriptApi()

    print(f"Starting extraction of {len(MODULES)} modules...")

    # 1. Initialize all module files and study templates upfront
    for mod in MODULES:
        mid = mod["id"]
        slug = mod["slug"]
        vid = mod["video_id"]
        title = mod["title"]
        duration = mod["duration"]
        url = f"https://www.youtube.com/watch?v={vid}&list=PLsyAi2EwvNNjE-uAH1N_3d6JBa8yF8v1L"

        doc_file = docs_dir / f"module_{slug}.md"

        if not doc_file.exists():
            template = f"""# Modul {mid}: {title}

| Eigenschaft | Details |
| :--- | :--- |
| **Status** | 🟡 In Vorbereitung / Noch nicht bearbeitet |
| **Video-Link** | [YouTube Video ansehen]({url}) |
| **Dauer** | {duration} |
| **Original-Transkript** | [Transkript öffnen](../data/transcripts/markdown/module_{mid}_transcript.md) |

---

## 🎯 Lernziele & Leitfragen
1. Was sind die Kernanforderungen von Annex 22 für dieses Themenfeld?
2. Welche Unterscheidung trifft die Guideline (z.B. deterministisch vs. stochastisch, statisch vs. kontinuierlich lernend)?
3. Welche praktischen Konsequenzen ergeben sich für pharmazeutische Qualitätsmanagementsysteme (QMS)?

---

## 📌 Deutsche Zusammenfassung (Key Takeaways)
*Trage hier deine Zusammenfassung oder generierte Kernaussagen ein.*

- **Hintergrund:** 
- **Wichtigste Regularien:** 
- **Praxisrelevanz für GxP:** 

---

## 💡 Zentrale Fachbegriffe & Konzepte (Glossar)
- **Term:** Erklärung

---

## 📋 GxP-Compliance Checklist & Kontrollfragen
- [ ] Frage 1?
- [ ] Frage 2?

---

## ✍️ Eigene Notizen & Vertiefung
*Hier ist Platz für persönliche Notizen, Vergleiche mit bestehenden SOPs und weiterführende Fragen.*
"""
            with open(mod_file, "w", encoding="utf-8") as f:
                f.write(template)

    import time

    cookies_file = base_dir / "cookies.txt"
    cookies_arg = str(cookies_file) if cookies_file.exists() else None
    if cookies_arg:
        print(f"Using cookies from {cookies_file.name}")
        api = YouTubeTranscriptApi(cookie_path=cookies_arg)
    else:
        api = YouTubeTranscriptApi()

    # 2. Fetch transcripts
    for mod in MODULES:
        mid = mod["id"]
        slug = mod["slug"]
        vid = mod["video_id"]
        title = mod["title"]
        duration = mod["duration"]
        url = f"https://www.youtube.com/watch?v={vid}&list=PLsyAi2EwvNNjE-uAH1N_3d6JBa8yF8v1L"

        json_path = raw_json_dir / f"module_{mid}.json"
        md_transcript_path = raw_md_dir / f"module_{mid}_transcript.md"

        if json_path.exists() and md_transcript_path.exists():
            print(f"[{mid}/12] Already downloaded: {title}")
            continue

        print(f"\n[{mid}/12] Fetching: {title} (ID: {vid})...")
        try:
            fetched = api.fetch(vid)
            snippets = fetched.snippets

            # Save raw JSON
            raw_data = [
                {"text": s.text, "start": s.start, "duration": s.duration}
                for s in snippets
            ]
            with open(json_path, "w", encoding="utf-8") as f:
                json.dump({"module": mod, "cues": raw_data}, f, indent=2, ensure_ascii=False)

            # Save formatted Markdown transcript
            readable_text = process_snippets_to_readable_text(snippets)
            with open(md_transcript_path, "w", encoding="utf-8") as f:
                f.write(f"# Transkript: Module {mid} - {title}\n\n")
                f.write(f"- **Video URL:** [{url}]({url})\n")
                f.write(f"- **Dauer:** {duration}\n")
                f.write(f"- **Video ID:** `{vid}`\n\n")
                f.write("## Original Transcript (English)\n\n")
                f.write(readable_text)
                f.write("\n")

            print(f"  ✓ Saved JSON & Markdown transcript for {title}")
            time.sleep(3)  # Polite delay to prevent rate limiting

        except Exception as e:
            print(f"  ✗ Error for {title}: {e}")

    print("\nExtraction & Project Setup complete!")

if __name__ == "__main__":
    main()
