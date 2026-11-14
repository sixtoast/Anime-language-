"""Regression tests for the standard-library DOCX transcription utility."""
import tempfile
import unittest
import zipfile
from pathlib import Path

from extract_docx_structure import extract_docx

NS = "http://schemas.openxmlformats.org/wordprocessingml/2006/main"

def docx_xml() -> bytes:
    return f"""<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
    <w:document xmlns:w="{NS}"><w:body>
      <w:p><w:r><w:t>Phase 4 §3.3</w:t></w:r></w:p>
      <w:tbl><w:tr><w:tc><w:p><w:r><w:t>Stage</w:t></w:r></w:p></w:tc><w:tc><w:p><w:r><w:t>Evidence</w:t></w:r></w:p></w:tc></w:tr>
      <w:tr><w:tc><w:p><w:r><w:t>Reference</w:t></w:r></w:p></w:tc><w:tc><w:p><w:r><w:t>UNTIL-REPLACED</w:t></w:r></w:p></w:tc></w:tr></w:tbl>
      <w:p><w:r><w:t>End of transcription</w:t></w:r></w:p>
      <w:sectPr/>
    </w:body></w:document>""".encode("utf-8")

class DocxExtractionTests(unittest.TestCase):
    def test_preserves_paragraph_table_order_and_text(self):
        with tempfile.TemporaryDirectory() as directory:
            source = Path(directory) / "sample.docx"
            with zipfile.ZipFile(source, "w") as archive:
                archive.writestr("word/document.xml", docx_xml())
            text, digest = extract_docx(source)
        self.assertIn("Phase 4 §3.3", text)
        self.assertIn("| Stage | Evidence |", text)
        self.assertIn("| Reference | UNTIL-REPLACED |", text)
        self.assertLess(text.index("Phase 4 §3.3"), text.index("## Table 1"))
        self.assertLess(text.index("## Table 1"), text.index("End of transcription"))
        self.assertEqual(len(digest), 64)

    def test_reports_missing_document_xml(self):
        with tempfile.TemporaryDirectory() as directory:
            source = Path(directory) / "invalid.docx"
            with zipfile.ZipFile(source, "w") as archive:
                archive.writestr("word/other.xml", "<root/>")
            with self.assertRaises(KeyError):
                extract_docx(source)

if __name__ == "__main__":
    unittest.main()
