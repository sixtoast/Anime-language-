#!/usr/bin/env python3
"""Print bounded Phase 4 headings and compare the extracted opening to its archive-index excerpt."""
from __future__ import annotations
import argparse
import re
from pathlib import Path

INDEX_MARKER = "### Arcane_Phase_6S_Typed_Expression_Integration/Arcane_Language_Audit_Phase_4 2.docx"

def main() -> int:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("transcription", type=Path)
    parser.add_argument("--headings", default="3.1,3.2,3.3,6,8,9,10")
    parser.add_argument("--compare-index", type=Path)
    args = parser.parse_args()
    text = args.transcription.read_text(encoding="utf-8")
    lines = text.splitlines()
    matches = []
    for i, line in enumerate(lines):
        match = re.match(r"^(?:(\d+(?:\.\d+)+)|(\d+)\.)\s+", line)
        if match:
            number = match.group(1) or match.group(2)
            matches.append((i, number, len(number.split("."))))
    print("TRANSCRIPTION_CHARACTERS", len(text))
    print("TOP_LEVEL_SECTIONS", ",".join(number for _, number, depth in matches if depth == 1))
    if args.compare_index:
        index = args.compare_index.read_text(encoding="utf-8")
        if INDEX_MARKER not in index:
            raise SystemExit("Phase 4 DOCX index entry not found")
        entry = index.split(INDEX_MARKER, 1)[1].split("\n### ", 1)[0]
        excerpt_match = re.search(r"```text\n(.*?)\n```", entry, re.S)
        if not excerpt_match:
            raise SystemExit("Phase 4 DOCX text excerpt not found")
        excerpt = excerpt_match.group(1)
        metadata_end = next((i for i, line in enumerate(lines) if line.startswith("- Limitations:")), -1)
        body = [line for line in lines[metadata_end + 1:] if line.strip() and not line.startswith("<!--")]
        normalized = "\n".join(body)
        print("INDEX_EXCERPT_CHARS", len(excerpt))
        print("INDEX_EXCERPT_PREFIX_MATCH", normalized.startswith(excerpt))
        print("NORMALIZED_BODY_CHARACTERS", len(normalized))
    requested = [value.strip() for value in args.headings.split(",") if value.strip()]
    for target in requested:
        target_depth = len(target.split("."))
        start = next((i for i, number, _ in matches if number == target), None)
        if start is None:
            print(f"\n===== HEADING {target} NOT FOUND =====")
            continue
        end = len(lines)
        for i, number, depth in matches:
            if i > start and depth <= target_depth:
                end = i
                break
        print(f"\n===== HEADING {target} =====")
        print("\n".join(lines[start:end]))
    return 0

if __name__ == "__main__":
    raise SystemExit(main())
