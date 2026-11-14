"""Regression tests for the read-only source intake utility."""
import io
import json
import tempfile
import unittest
import zipfile
from pathlib import Path

from source_intake import inspect_path, text_record, docx_record

DOCX_NS = "http://schemas.openxmlformats.org/wordprocessingml/2006/main"

def minimal_docx() -> bytes:
    xml = f'''<w:document xmlns:w="{DOCX_NS}"><w:body>
      <w:p><w:r><w:t>Phase 4 §3.3</w:t></w:r></w:p>
      <w:tbl><w:tr><w:tc><w:p><w:r><w:t>UNTIL-REPLACED</w:t></w:r></w:p></w:tc></w:tr></w:tbl>
    </w:body></w:document>'''.encode()
    out = io.BytesIO()
    with zipfile.ZipFile(out, "w") as archive:
        archive.writestr("word/document.xml", xml)
    return out.getvalue()

class SourceIntakeTests(unittest.TestCase):
    def test_text_hash_and_unicode(self):
        raw = "Phase 4 §3.3\nArcana".encode()
        record = text_record("phase.txt", raw, "phase.txt")
        self.assertEqual(record["status"], "EXTRACTED")
        self.assertEqual(len(record["sha256"]), 64)
        self.assertIn("§3.3", record["text"])

    def test_invalid_json_is_retained_but_flagged(self):
        record = text_record("bad.json", b'{"x":', "bad.json")
        self.assertEqual(record["status"], "INVALID")
        self.assertIsNotNone(record["text"])
        self.assertTrue(record["warnings"])

    def test_docx_paragraph_and_table_extraction(self):
        record = docx_record("phase.docx", minimal_docx(), "phase.docx")
        self.assertEqual(record["status"], "EXTRACTED")
        self.assertIn("Phase 4 §3.3", record["text"])
        self.assertIn("UNTIL-REPLACED", record["text"])
        self.assertEqual(record["metadata"]["tables"], 1)

    def test_zip_members_are_indexed_without_disk_extraction(self):
        with tempfile.TemporaryDirectory() as directory:
            path = Path(directory) / "archive.zip"
            with zipfile.ZipFile(path, "w") as archive:
                archive.writestr("../escape.txt", "must skip")
                archive.writestr("nested/readme.txt", "safe text")
            records, skipped = inspect_path(path, 100000, 50)
        self.assertIsNone(skipped)
        self.assertTrue(any("safe text" in (r["text"] or "") for r in records))
        self.assertTrue(any("Unsafe member path" in warning for r in records for warning in r["warnings"]))

    def test_exact_duplicate_groups_use_hash_only(self):
        from source_intake import duplicate_groups
        records = [{"source": "a.txt", "sha256": "abc"}, {"source": "copy/a.txt", "sha256": "abc"}, {"source": "b.txt", "sha256": "def"}, {"source": "unknown.bin", "sha256": None}]
        self.assertEqual(duplicate_groups(records), [{"sha256": "abc", "sources": ["a.txt", "copy/a.txt"]}])

    def test_distinct_hashes_are_not_collapsed(self):
        from source_intake import duplicate_groups
        self.assertEqual(duplicate_groups([{"source": "a", "sha256": "1"}, {"source": "b", "sha256": "2"}]), [])

    def test_oversized_file_is_skipped(self):
        with tempfile.TemporaryDirectory() as directory:
            path = Path(directory) / "large.txt"
            path.write_bytes(b"12345")
            records, skipped = inspect_path(path, 4, 50)
        self.assertEqual(records, [])
        self.assertEqual(skipped["status"], "TOO_LARGE")

if __name__ == "__main__":
    unittest.main()
