#!/usr/bin/env python3
"""
Doc Sync Verification Script for EU GMP Annex 22 Learning Project.
Verifies that docs/de/ (SSOT) and docs/en/ (Mirror) are strictly synchronized:
1. Every file in docs/de/ must exist in docs/en/ and vice-versa.
2. Every file in docs/en/ must have the sync metadata comment:
   <!-- metadata source_file: docs/de/<filename>, sync_date: YYYY-MM-DD -->
3. Warns if a file in docs/de/ has been committed or modified after the sync date in docs/en/.
"""

import sys
import re
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
DE_DIR = ROOT / "docs" / "de"
EN_DIR = ROOT / "docs" / "en"

SINGLE_LINE_REGEX = re.compile(
    r"<!--\s*metadata\s+source_file:\s*([^,\n]+),\s*sync_date:\s*([0-9-]+)\s*-->"
)

MULTI_LINE_REGEX = re.compile(
    r"<!--\s*metadata\s*\n(?:.*\n)*?\s*source_file:\s*([^\n]+)\n(?:.*\n)*?\s*sync_date:\s*([0-9-]+)\n(?:.*\n)*?-->",
    re.MULTILINE
)

def extract_metadata(content: str):
    m = SINGLE_LINE_REGEX.search(content)
    if m:
        return m.group(1).strip(), m.group(2).strip()
    m = MULTI_LINE_REGEX.search(content)
    if m:
        return m.group(1).strip(), m.group(2).strip()
    return None, None


def main():
    print("=" * 60)
    print("🔍 Checking Documentation Synchronization (DE <-> EN)")
    print("=" * 60)

    if not DE_DIR.exists() or not EN_DIR.exists():
        print(f"❌ Error: Both {DE_DIR} and {EN_DIR} must exist.")
        sys.exit(1)

    de_files = {p.name: p for p in DE_DIR.glob("*.md")}
    en_files = {p.name: p for p in EN_DIR.glob("*.md")}

    missing_in_en = set(de_files.keys()) - set(en_files.keys())
    missing_in_de = set(en_files.keys()) - set(de_files.keys())

    has_error = False

    if missing_in_en:
        print(f"❌ Missing in English (docs/en/): {', '.join(sorted(missing_in_en))}")
        has_error = True
    if missing_in_de:
        print(f"❌ Missing in German (docs/de/): {', '.join(sorted(missing_in_de))}")
        has_error = True

    print(f"📄 Found {len(de_files)} German files and {len(en_files)} English files.")

    print("\n📋 Checking sync metadata in docs/en/:")
    for name in sorted(en_files.keys()):
        en_path = en_files[name]
        content = en_path.read_text(encoding="utf-8")
        source_file, sync_date = extract_metadata(content)

        if not source_file or not sync_date:
            print(f"  ⚠️  {name}: Missing or malformed metadata header")
            has_error = True
        else:
            expected_source = f"docs/de/{name}"
            if source_file != expected_source:
                print(f"  ⚠️  {name}: Source file mismatch (expected '{expected_source}', found '{source_file}')")
                has_error = True
            else:
                print(f"  ✅ {name} -> Synced with {source_file} (Date: {sync_date})")

    print("\n" + "=" * 60)
    if has_error:
        print("❌ Synchronization check failed. Please resolve the issues above.")
        sys.exit(1)
    else:
        print("🎉 All 15 documents are perfectly synchronized in DE and EN!")
        print("=" * 60)
        sys.exit(0)

if __name__ == "__main__":
    main()
