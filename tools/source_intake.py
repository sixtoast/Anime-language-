#!/usr/bin/env python3
"""Read-only source intake for the Anime language corpus.

Extracts supported local files without modifying originals or extracting ZIP members
to disk. PDF extraction uses pdftotext when installed; otherwise it records a warning.
"""
from __future__ import annotations

import argparse
import csv
import difflib
import hashlib
import io
import json
import shutil
import subprocess
import tempfile
import zipfile
from pathlib import Path, PurePosixPath
from typing import Any
from xml.etree import ElementTree as ET

TEXT_EXTENSIONS = {".txt", ".md", ".csv", ".json"}
DOCX_NS = {"w": "http://schemas.openxmlformats.org/wordprocessingml/2006/main"}
W = "{http://schemas.openxmlformats.org/wordprocessingml/2006/main}"
MAX_DEFAULT_BYTES = 20 * 1024 * 1024
MAX_ARCHIVE_MEMBERS = 5000
MAX_MEMBER_BYTES = 20 * 1024 * 1024
MAX_COMPRESSION_RATIO = 200


def sha256(data: bytes) -> str:
    return hashlib.sha256(data).hexdigest()


def text_record(name: str, data: bytes, source: str) -> dict[str, Any]:
    record: dict[str, Any] = {
        "source": source, "name": name, "bytes": len(data), "sha256": sha256(data),
        "format": Path(name).suffix.lower().lstrip(".") or "unknown",
        "status": "EXTRACTED", "text": None, "text_length": 0,
        "warnings": [], "metadata": {}
    }
    try:
        text = data.decode("utf-8-sig", errors="strict")
    except UnicodeDecodeError as exc:
        record["status"] = "UNSUPPORTED_ENCODING"
        record["warnings"].append(f"Strict UTF-8 decoding failed at byte {exc.start}; no replacement characters inserted.")
        return record
    ext = Path(name).suffix.lower()
    if ext == ".json":
        try:
            parsed = json.loads(text)
            record["metadata"]["json_top_level_type"] = type(parsed).__name__
        except json.JSONDecodeError as exc:
            record["status"] = "INVALID"
            record["warnings"].append(f"Invalid JSON at line {exc.lineno}, column {exc.colno}: {exc.msg}")
    elif ext == ".csv":
        try:
            rows = list(csv.reader(io.StringIO(text, newline="")))
            record["metadata"]["csv_rows"] = len(rows)
            record["metadata"]["csv_columns_first_row"] = len(rows[0]) if rows else 0
        except csv.Error as exc:
            record["status"] = "INVALID"
            record["warnings"].append(f"CSV parsing error: {exc}")
    record["text"] = text
    record["text_length"] = len(text)
    return record


def docx_record(name: str, data: bytes, source: str) -> dict[str, Any]:
    base = {"source": source, "name": name, "bytes": len(data), "sha256": sha256(data),
            "format": "docx", "status": "EXTRACTED", "text": None,
            "text_length": 0, "warnings": [], "metadata": {}}
    try:
        with zipfile.ZipFile(io.BytesIO(data)) as archive:
            info = archive.getinfo("word/document.xml")
            if info.file_size > MAX_MEMBER_BYTES:
                raise ValueError("word/document.xml exceeds extraction limit")
            xml = archive.read(info)
        root = ET.fromstring(xml)
        body = root.find("w:body", DOCX_NS)
        if body is None:
            raise ValueError("DOCX has no document body")
        lines: list[str] = []
        paragraphs = tables = 0
        for child in list(body):
            if child.tag == W + "p":
                value = paragraph_text(child)
                if value:
                    paragraphs += 1
                    lines.extend([value, ""])
            elif child.tag == W + "tbl":
                tables += 1
                lines.extend([f"## Table {tables}", ""])
                for row in child.findall("./w:tr", DOCX_NS):
                    cells = [cell_text(cell) for cell in row.findall("./w:tc", DOCX_NS)]
                    lines.append("| " + " | ".join(v.replace("|", "\\|").replace("\n", " ") for v in cells) + " |")
                lines.append("")
        lines.append(f"<!-- paragraphs: {paragraphs}; tables: {tables} -->")
        text = "\n".join(lines)
        base["text"] = text
        base["text_length"] = len(text)
        base["metadata"] = {"paragraphs": paragraphs, "tables": tables, "extraction": "word/document.xml body order"}
    except (KeyError, ValueError, zipfile.BadZipFile, ET.ParseError) as exc:
        base["status"] = "INVALID"
        base["warnings"].append(f"DOCX extraction failed: {exc}")
    return base


def paragraph_text(node: ET.Element) -> str:
    parts: list[str] = []
    for child in node.iter():
        if child.tag == W + "t":
            parts.append(child.text or "")
        elif child.tag == W + "tab":
            parts.append("\t")
        elif child.tag in (W + "br", W + "cr"):
            parts.append("\n")
    return "".join(parts).strip()


def cell_text(cell: ET.Element) -> str:
    return " / ".join(v for v in (paragraph_text(p) for p in cell.findall(".//w:p", DOCX_NS)) if v)


def pdf_record(name: str, data: bytes, source: str) -> dict[str, Any]:
    base = {"source": source, "name": name, "bytes": len(data), "sha256": sha256(data),
            "format": "pdf", "status": "UNAVAILABLE", "text": None,
            "text_length": 0, "warnings": [], "metadata": {}}
    executable = shutil.which("pdftotext")
    if not executable:
        base["warnings"].append("pdftotext is not installed; PDF bytes were fingerprinted but text was not extracted.")
        return base
    try:
        with tempfile.NamedTemporaryFile(suffix=".pdf") as handle:
            handle.write(data)
            handle.flush()
            result = subprocess.run([executable, "-layout", handle.name, "-"], capture_output=True,
                                    text=True, encoding="utf-8", errors="strict", timeout=90, check=False)
        if result.returncode != 0:
            base["status"] = "INVALID"
            base["warnings"].append("pdftotext failed: " + result.stderr[:1000])
        else:
            base["status"] = "EXTRACTED"
            base["text"] = result.stdout
            base["text_length"] = len(result.stdout)
            base["metadata"] = {"extractor": "pdftotext -layout", "return_code": result.returncode}
    except (OSError, subprocess.TimeoutExpired, UnicodeError) as exc:
        base["status"] = "INVALID"
        base["warnings"].append(f"PDF extraction failed: {exc}")
    return base


def inspect_zip(path: Path, data: bytes, max_members: int) -> tuple[list[dict[str, Any]], dict[str, Any]]:
    records: list[dict[str, Any]] = []
    summary: dict[str, Any] = {"members": [], "member_count": 0, "warnings": []}
    try:
        with zipfile.ZipFile(io.BytesIO(data)) as archive:
            infos = archive.infolist()
            summary["member_count"] = len(infos)
            if len(infos) > max_members:
                summary["warnings"].append(f"Archive has {len(infos)} members; only first {max_members} are inspected.")
                infos = infos[:max_members]
            for info in infos:
                name = info.filename
                posix = PurePosixPath(name)
                if posix.is_absolute() or ".." in posix.parts:
                    summary["warnings"].append(f"Unsafe member path skipped: {name}")
                    continue
                if info.is_dir():
                    continue
                member_meta = {"name": name, "bytes": info.file_size, "compressed_bytes": info.compress_size}
                summary["members"].append(member_meta)
                if info.file_size > MAX_MEMBER_BYTES:
                    summary["warnings"].append(f"Member exceeds {MAX_MEMBER_BYTES} byte limit: {name}")
                    continue
                if info.compress_size and info.file_size / info.compress_size > MAX_COMPRESSION_RATIO:
                    summary["warnings"].append(f"Suspicious compression ratio; member skipped: {name}")
                    continue
                ext = Path(name).suffix.lower()
                if ext not in TEXT_EXTENSIONS and ext != ".docx":
                    continue
                member = archive.read(info)
                member_source = f"{path.as_posix()}!/{name}"
                if ext == ".docx":
                    records.append(docx_record(name, member, member_source))
                else:
                    records.append(text_record(name, member, member_source))
    except (zipfile.BadZipFile, OSError) as exc:
        summary["warnings"].append(f"ZIP inspection failed: {exc}")
    return records, summary


def inspect_path(path: Path, max_file_bytes: int, max_members: int) -> tuple[list[dict[str, Any]], dict[str, Any] | None]:
    if not path.is_file():
        return [], {"source": str(path), "status": "SKIPPED", "warning": "Not a regular file."}
    try:
        size = path.stat().st_size
        if size > max_file_bytes:
            return [], {"source": str(path), "status": "TOO_LARGE", "bytes": size,
                        "warning": f"File exceeds {max_file_bytes} byte limit."}
        data = path.read_bytes()
    except OSError as exc:
        return [], {"source": str(path), "status": "ERROR", "warning": str(exc)}
    ext = path.suffix.lower()
    if ext == ".docx":
        return [docx_record(path.name, data, str(path))], None
    if ext == ".pdf":
        return [pdf_record(path.name, data, str(path))], None
    if ext == ".zip":
        records, summary = inspect_zip(path, data, max_members)
        records.insert(0, {"source": str(path), "name": path.name, "bytes": len(data),
                           "sha256": sha256(data), "format": "zip", "status": "INDEXED",
                           "text": None, "text_length": 0, "warnings": summary["warnings"],
                           "metadata": {"member_count": summary["member_count"], "members": summary["members"]}})
        return records, None
    if ext in TEXT_EXTENSIONS:
        return [text_record(path.name, data, str(path))], None
    return [{"source": str(path), "name": path.name, "bytes": len(data), "sha256": sha256(data),
             "format": ext.lstrip(".") or "unknown", "status": "UNSUPPORTED", "text": None,
             "text_length": 0, "warnings": ["Format is fingerprinted but not extracted."], "metadata": {}}], None



def duplicate_groups(records: list[dict[str, Any]]) -> list[dict[str, Any]]:
    """Group exact byte duplicates by SHA-256; never infer semantic equivalence."""
    grouped: dict[str, list[str]] = {}
    for record in records:
        digest = record.get("sha256")
        if digest:
            grouped.setdefault(digest, []).append(record.get("source", record.get("name", "unknown")))
    return [{"sha256": digest, "sources": sources} for digest, sources in sorted(grouped.items()) if len(sources) > 1]


def build_markdown(records: list[dict[str, Any]], skipped: list[dict[str, Any]]) -> str:
    lines = ["# Source intake report", "", "Read-only inventory and extraction report. Extracted content is evidence, not canon approval.", "",
             "| Source | Format | Status | Bytes | SHA-256 | Text characters |",
             "|---|---|---:|---:|---|---:|"]
    for item in records:
        lines.append(f"| {item['source']} | {item['format']} | {item['status']} | {item['bytes']} | {item['sha256']} | {item['text_length']} |")
        for warning in item["warnings"]:
            lines.append(f"  - Warning: {warning}")
    duplicates = duplicate_groups(records)
    lines.extend(["", "## Exact byte duplicates", ""])
    if duplicates:
        for group in duplicates:
            lines.append("- SHA-256 " + group["sha256"] + ": " + "; ".join(group["sources"]))
    else:
        lines.append("No exact byte duplicates found in this intake batch.")
    lines.append("Duplicate hashes establish byte identity only, not semantic equivalence or source authority.")
    for item in skipped:
        lines.append(f"| {item['source']} | — | {item['status']} | {item.get('bytes', '—')} | — | — |")
        lines.append(f"  - {item['warning']}")
    lines.extend(["", "## Review requirements", "", "- Verify the source file and extraction warnings before citing extracted text.",
                  "- A matching hash identifies identical bytes, not authorship or correctness.",
                  "- PDF extraction requires Poppler's pdftotext; absence is reported, never silently substituted.",
                  "- ZIP members are read in memory; no archive paths are written to disk.", ""])
    return "\n".join(lines)



def compare_transcriptions(left_name: str, left_text: str, right_name: str, right_text: str) -> dict[str, Any]:
    """Compare exact paragraph sequences without normalising away source differences."""
    left = left_text.splitlines()
    right = right_text.splitlines()
    matcher = difflib.SequenceMatcher(a=left, b=right, autojunk=False)
    changes = []
    for tag, i1, i2, j1, j2 in matcher.get_opcodes():
        if tag != "equal":
            changes.append({
                "kind": tag,
                "left_start_line": i1 + 1,
                "left_end_line": i2,
                "right_start_line": j1 + 1,
                "right_end_line": j2,
                "left": left[i1:i2],
                "right": right[j1:j2],
            })
    return {
        "left_source": left_name, "right_source": right_name,
        "left_line_count": len(left), "right_line_count": len(right),
        "equal": not changes, "change_count": len(changes), "changes": changes,
        "comparison": "exact line comparison; no whitespace, punctuation or semantic normalisation",
        "warning": "A textual difference is a review lead, not proof of a substantive language-rule conflict."
    }


def comparison_markdown(result: dict[str, Any]) -> str:
    lines = ["# Transcription comparison", "",
             f"Left: {result['left_source']}", f"Right: {result['right_source']}", "",
             f"Changed regions: {result['change_count']}", "",
             result["comparison"], result["warning"], ""]
    for number, change in enumerate(result["changes"], 1):
        lines.extend([f"## Difference {number}: {change['kind']}",
                      f"Left lines {change['left_start_line']}–{change['left_end_line']}",
                      f"Right lines {change['right_start_line']}–{change['right_end_line']}", "",
                      "### Left"])
        lines.extend("    " + line for line in change["left"])
        lines.extend(["", "### Right"])
        lines.extend("    " + line for line in change["right"])
        lines.append("")
    return "\\n".join(lines)


def main() -> int:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("paths", nargs="*", type=Path, help="Files or directories to inspect")
    parser.add_argument("--json-out", type=Path, default=Path("source-intake-manifest.json"))
    parser.add_argument("--markdown-out", type=Path, default=Path("source-intake-report.md"))
    parser.add_argument("--max-file-bytes", type=int, default=MAX_DEFAULT_BYTES)
    parser.add_argument("--max-members", type=int, default=MAX_ARCHIVE_MEMBERS)\n    parser.add_argument("--compare", nargs=2, type=Path, metavar=("LEFT", "RIGHT"), help="Compare two UTF-8 text transcriptions line by line")\n    parser.add_argument("--comparison-json", type=Path, default=Path("transcription-comparison.json"))\n    parser.add_argument("--comparison-markdown", type=Path, default=Path("transcription-comparison.md"))
    args = parser.parse_args()
    if args.compare:
        left_path, right_path = args.compare
        left_bytes, right_bytes = left_path.read_bytes(), right_path.read_bytes()
        left_text = left_bytes.decode("utf-8-sig", errors="strict")
        right_text = right_bytes.decode("utf-8-sig", errors="strict")
        comparison = compare_transcriptions(str(left_path), left_text, str(right_path), right_text)
        args.comparison_json.write_text(json.dumps(comparison, ensure_ascii=False, indent=2), encoding="utf-8")
        args.comparison_markdown.write_text(comparison_markdown(comparison), encoding="utf-8")
        print(f"Compared {left_path} and {right_path}: {comparison['change_count']} changed regions.")
        return 0
    if not args.paths:\n        parser.error("provide one or more paths, or use --compare LEFT RIGHT")\n    paths: list[Path] = []
    for target in args.paths:
        if target.is_dir():
            paths.extend(sorted(p for p in target.rglob("*") if p.is_file() and not p.is_symlink()))
        else:
            paths.append(target)
    records: list[dict[str, Any]] = []
    skipped: list[dict[str, Any]] = []
    for path in paths:
        found, skip = inspect_path(path, args.max_file_bytes, args.max_members)
        records.extend(found)
        if skip:
            skipped.append(skip)
    manifest = {"schema": "anime-source-intake-manifest-v1", "read_only": True,
                "generated_by": "tools/source_intake.py", "records": records, "skipped": skipped, "duplicate_groups": duplicate_groups(records)}
    args.json_out.write_text(json.dumps(manifest, ensure_ascii=False, indent=2), encoding="utf-8")
    args.markdown_out.write_text(build_markdown(records, skipped), encoding="utf-8")
    print(f"Inspected {len(paths)} paths; {len(records)} records; {len(skipped)} skipped.")
    print(f"Wrote {args.json_out} and {args.markdown_out}")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
