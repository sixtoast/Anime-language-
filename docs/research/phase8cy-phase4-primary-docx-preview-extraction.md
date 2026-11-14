# Phase 8CY — Primary Phase 4 DOCX extraction through the preview build

**Date:** 2026-11-14  
**Canon effect:** NONE · **Grammar changes:** none · **Tests:** existing suite retained.

## Goal
The repository already contains a standard-library Python DOCX extractor and the original binary source. This phase wires the reproducible extraction into the feature-preview build so the original can be decoded in the Vercel build environment without copying or transforming the source file manually.

## Build gate
Before TypeScript, Vitest and Vite, the build now:
1. creates `public/research`;
2. runs `tools/extract_docx_structure.py` on the committed original DOCX;
3. requires the extracted source bytes to match SHA-256 `c8204667c204227ba474fd0b5245fd66f1ba081565671f5a28cf65efb513eaea`;
4. writes the source-order document-body paragraph/table transcription to `public/research/phase4-transcription.md`.

The source itself is not modified. The transcription is generated in the preview build workspace and is not committed by this change. Its appearance in the preview is a temporary inspection aid; no production deployment or merge is made.

## Extraction limitations
The existing extractor covers document-body paragraphs and tables in order. It does not reconstruct layout, images, text boxes, comments or tracked-change intent. A successful digest check verifies the source bytes, not semantic completeness of the transcription.

## Next concordance steps
After the preview is READY, inspect the generated transcription, count paragraphs/tables, compare its extracted body with the archive index entry, then review §§3.1–3.3, §6 G-4 and §§8–10, including table and footnote context. P4-T05/P4-T10 definitions still require separate recovery. CVC versus optional-coda remains unresolved until those passages are reviewed.

## Verification
This is a feature-branch extraction experiment. Python availability, source digest, generated transcription, Vitest and Vite results must be confirmed from the next preview logs. No source claim is promoted by this build-script change.
