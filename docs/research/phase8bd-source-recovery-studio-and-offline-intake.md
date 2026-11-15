# Phase 8BD — Source Recovery Studio and offline intake

**Date:** 2026-11-14  
**Canon effect:** none. **Language grammar changes:** none.  
**Tests authored:** five Python unittest cases. **Tests executed:** not executed in this environment.

## Objective

Build the first useful companion function for recovering the project's own source corpus. This is a controlled, read-only source intake workflow, not general web scraping. It must preserve the original files and distinguish byte-level identity from source authority or canon status.

## Browser intake MVP

Research & Review now contains Source Recovery Studio. It accepts local TXT, Markdown, JSON and CSV files in the browser, with a 20 MiB per-file limit. It computes SHA-256 over the original bytes, records size and text/line counts, checks JSON syntax, shows a bounded preview and downloads a JSON intake manifest. The selected file content is processed in the browser and is not uploaded.

CSV line counts are explicitly estimates because physical lines do not necessarily equal CSV records when quoted multiline fields are used. Invalid JSON is retained as an intake record with an INVALID status; it is not discarded. Unsupported types are reported instead of being silently decoded.

DOCX, PDF and ZIP are not claimed as browser-supported in this MVP. They are routed to the offline CLI below.

## Offline repository intake CLI

Added `tools/source_intake.py`. It supports:
- TXT, Markdown, JSON and CSV strict UTF-8 extraction and basic format checks;
- DOCX document-body paragraphs and tables in source order;
- PDF fingerprinting and optional text extraction through Poppler `pdftotext`;
- ZIP member inventory and in-memory extraction of supported text/DOCX members;
- SHA-256, byte lengths, status, metadata and warnings;
- JSON manifest and Markdown report output.

Example:

```bash
python tools/source_intake.py sources/originals/ --json-out source-intake-manifest.json --markdown-out source-intake-report.md
```

The CLI does not write extracted ZIP members to disk. It skips path traversal entries, limits archive member count, member size and compression ratio, and does not follow symlink files while walking directories. The original sources are read-only. The manifest/report paths are outputs, not source modifications.

PDF text extraction is optional and only occurs when `pdftotext` is installed. If it is unavailable, the file is still fingerprinted and the extraction is marked UNAVAILABLE with a warning. This environment has not run the CLI against the actual Phase 4 DOCX/PDF, so no new original-source content is claimed as recovered.

## Provenance and review boundaries

A SHA-256 proves byte identity for a particular file, not authorship, correctness, completeness, normative status or canon acceptance. Extracted content must be reviewed against its original, with warnings retained. The tool does not automatically update the lexicon, parser, formal reference binder or canon documentation.

The browser MVP and CLI intentionally have different format coverage. The browser tool offers private local intake for text formats; the offline CLI handles binary formats and archives. No private source is uploaded to a third-party service.

## Validation

Five Python tests were authored for Unicode text hashing, invalid JSON reporting, DOCX paragraph/table order, ZIP path traversal handling and oversized-file rejection. They have not been executed in this environment. No GitHub Actions were dispatched. Preview build is a website integration check, not a substitute for running the Python tests.


## Phase 8BE — exact duplicate reporting

The offline CLI now groups records only when original file SHA-256 values match. Duplicate groups appear in both the JSON manifest and Markdown report. Different hashes are never collapsed, even if extracted text appears similar; byte identity is not semantic equivalence or source authority.

Two additional Python tests cover exact duplicate grouping and distinct-hash separation. Seven tests are authored in total; none were executed in this environment. This increment does not change canon, source originals or production.
