#!/usr/bin/env python3
"""Print selected numbered Phase 4 sections from an extracted DOCX transcription."""
from __future__ import annotations
import argparse
import re
from pathlib import Path

def main() -> int:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("transcription", type=Path)
    parser.add_argument("--sections", default="3,6,8,9,10")
    args = parser.parse_args()
    text = args.transcription.read_text(encoding="utf-8")
    selected = {int(value) for value in args.sections.split(",") if value.strip()}
    lines = text.splitlines()
    matches = [(i, int(m.group(1))) for i, line in enumerate(lines) if (m := re.match(r"^(\d+)\.\s+", line))]
    print("TRANSCRIPTION_CHARACTERS", len(text))
    print("TOP_LEVEL_SECTIONS", ",".join(str(n) for _, n in matches))
    for j, (start, number) in enumerate(matches):
        if number not in selected:
            continue
        end = matches[j + 1][0] if j + 1 < len(matches) else len(lines)
        print(f"\n===== SECTION {number} =====")
        print("\n".join(lines[start:end]))
    return 0

if __name__ == "__main__":
    raise SystemExit(main())
