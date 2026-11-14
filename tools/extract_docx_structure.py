#!/usr/bin/env python3
"""Extract paragraph and table text from a DOCX without third-party packages."""
from __future__ import annotations
import argparse
import base64
import binascii
import hashlib
import io
import zipfile
from pathlib import Path
from xml.etree import ElementTree as ET

NS = {"w": "http://schemas.openxmlformats.org/wordprocessingml/2006/main"}
W = "{http://schemas.openxmlformats.org/wordprocessingml/2006/main}"

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
    paragraphs = [paragraph_text(p) for p in cell.findall(".//w:p", NS)]
    return " / ".join(value for value in paragraphs if value)

def extract_docx_bytes(raw: bytes, filename: str = "source.docx") -> tuple[str, str]:
    """Extract document-body text from in-memory DOCX bytes."""
    digest = hashlib.sha256(raw).hexdigest()
    with zipfile.ZipFile(io.BytesIO(raw)) as archive:
        xml = archive.read("word/document.xml")
    root = ET.fromstring(xml)
    body = root.find("w:body", NS)
    if body is None:
        raise ValueError("DOCX has no document body")
    lines = [
        "# Extracted DOCX transcription: " + filename,
        "",
        "- SHA-256: " + digest,
        "- Method: standard-library DOCX XML extraction",
        "- Scope: document-body paragraphs and tables in source order",
        "- Limitations: layout, images, text boxes, comments and tracked-change intent are not reconstructed",
        "",
    ]
    paragraph_no = 0
    table_no = 0
    for child in list(body):
        if child.tag == W + "p":
            value = paragraph_text(child)
            if value:
                paragraph_no += 1
                lines.extend([value, ""])
        elif child.tag == W + "tbl":
            table_no += 1
            rows = child.findall("./w:tr", NS)
            lines.extend(["## Table " + str(table_no), ""])
            for row in rows:
                cells = [cell_text(cell) for cell in row.findall("./w:tc", NS)]
                lines.append("| " + " | ".join(value.replace("|", "\\|").replace("\n", " ") for value in cells) + " |")
            lines.append("")
    lines.extend(["<!-- paragraphs: " + str(paragraph_no) + "; tables: " + str(table_no) + " -->", ""])
    return "\n".join(lines), digest

def decode_base64_docx(encoded: str, expected_sha256: str | None = None) -> bytes:
    """Decode a base64-encoded GitHub API file payload and optionally verify source bytes."""
    compact = "".join(encoded.split())
    try:
        raw = base64.b64decode(compact, validate=True)
    except (binascii.Error, ValueError) as exc:
        raise ValueError("Invalid base64 DOCX input") from exc
    if expected_sha256:
        actual = hashlib.sha256(raw).hexdigest()
        if actual.lower() != expected_sha256.strip().lower():
            raise ValueError(f"SHA-256 mismatch: expected {expected_sha256}, got {actual}")
    return raw

def extract_docx(path: Path) -> tuple[str, str]:
    return extract_docx_bytes(path.read_bytes(), path.name)

def main() -> int:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("docx", type=Path, nargs="?", help="DOCX file, or a text file containing base64 when --base64-input is used")
    parser.add_argument("--base64-input", action="store_true", help="decode the input file as base64 without writing an intermediate DOCX")
    parser.add_argument("--expected-sha256", help="require the decoded/source DOCX bytes to match this SHA-256")
    parser.add_argument("--output", type=Path)
    args = parser.parse_args()
    if args.docx is None:
        parser.error("provide a DOCX path or a base64 text file")
    if args.base64_input:
        raw = decode_base64_docx(args.docx.read_text(encoding="ascii"), args.expected_sha256)
        text, digest = extract_docx_bytes(raw, args.docx.name)
    else:
        raw = args.docx.read_bytes()
        digest = hashlib.sha256(raw).hexdigest()
        if args.expected_sha256 and digest.lower() != args.expected_sha256.strip().lower():
            raise ValueError(f"SHA-256 mismatch: expected {args.expected_sha256}, got {digest}")
        text, digest = extract_docx_bytes(raw, args.docx.name)
    if args.output:
        args.output.write_text(text, encoding="utf-8")
        print("Wrote " + str(args.output) + " (SHA-256 " + digest + ")")
    else:
        print(text)
    return 0

if __name__ == "__main__":
    raise SystemExit(main())
