# Phase 8CY-B — Wrapped Word body extraction correction

The first SHA-verified preview extraction produced a much shorter body transcription than the archive text index reports (4,571 characters visible in the build-log output versus 21,121 indexed characters). The initial extractor traversed only direct children of `w:body`, so paragraphs and tables nested under Word wrapper elements such as `w:sdt` and `w:customXml` could be omitted.

Both `tools/extract_docx_structure.py` and `tools/source_intake.py` now recursively descend through non-paragraph/table wrapper elements, emitting paragraphs and tables in source order. Paragraph and table descendants are consumed once by their respective readers to avoid duplicate text. Regression tests cover nested content-control paragraphs and tables. The preview build now runs the Python unit suite and prints selected sections 3, 6, 8, 9 and 10 for source review.

This correction does not claim text boxes, comments, footnotes/endnotes, tracked-change intent or layout fidelity. The next verified output must be compared with the 21,121-character archive index before completeness is claimed. Canon effect NONE.
