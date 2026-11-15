# Phase 8BA — branch-aware source links and Phase 4 generator boundary

**Date:** 2026-11-14  
**Canon effect:** none. **Grammar changes:** none. **Execution:** none.  
**Tests authored:** WEB-SRC-001 plus three helper edge-case tests. **Tests executed:** not executed in this environment.

## 1. Phase 4 generator evidence: what the index actually exposes

The archive text index contains the metadata record for `Arcane_Phase_6S_Typed_Expression_Integration/phase4_finalize.txt`:
- SHA-256: `086122ac5568183db4e5bc5ae38d5933057a096a015ae8b7d8e88f3f09cf7209`
- Extracted length: 7,852 characters
- Indexed body available here: first 1,800 characters only.

The visible excerpt identifies a Python script that reads `phase4_report.json`, obtains `canon` and `roots`, imports `arcane_lexicon_tools` and the Phase 3 checker, assembles draft lexicon rows, and selects additional quantity-slot literals using phonological-distance and syllabification checks. It also contains mappings for renamed forms and bare reference forms.

This supports a bounded description of the artefact as a draft-lexicon generator and mechanical candidate/checking script. The visible portion does not establish a complete Construction Foot generator, a productive frame × parameter × relation paradigm, or the intended semantics of relation codas. The remaining 6,052 characters are not present in the indexed preview and have not been inspected.

The Phase 4 audit transcription's opening describes two subsystems (v2.0 Construction and v3.0-L Expression) and a compile bridge. A separate Phase 5.20 recovery report points to Phase 4 §§3.3, 8 and 10 for fused-reference readings and construction order. Those are useful secondary leads, but the full Phase 4 DOCX body and the PDF body have not been independently extracted in this environment. No section-level claim is promoted solely from an index preview or a later report.

## 2. Website reliability issue found

The Documentation catalogue, Test Suite source links, and Research & Review cards previously hard-coded GitHub's `main` branch. On a Vercel preview built from the active feature branch, links to newly added research documents therefore pointed at a branch where those files might not yet exist. This made the preview's evidence navigation misleading even when the application itself built successfully.

## 3. Implemented correction

- Added `src/engine/githubSourceLinks.ts`, a URL builder that preserves branch names containing slashes, encodes path segments, retains section fragments, and rejects relative path traversal.
- Updated the Vite build definition to inject the Vercel Git commit ref (`VERCEL_GIT_COMMIT_REF`), with `GITHUB_REF_NAME` as a secondary source and `main` as the local-build fallback.
- Updated repository-document links in the Documentation catalogue, selected source references, Test Suite and Research & Review to use that injected ref.
- Added WEB-SRC-001 and three helper edge-case tests; registered the test in the workbench test catalogue.
- Added Phase 8BA as Research & Review item 16.

The GitHub repository homepage, commit links and Actions run links remain intentionally pointed at their respective repository/commit/run destinations; they are not branch-relative document links.

## 4. Validation boundary

The tests are authored and registered but were not executed. No local checkout is available in this environment, so TypeScript, Vitest, browser acceptance and a fresh build are not claimed. The Vercel deployment created from this commit will provide the next build signal; preview status must be checked separately. GitHub Actions were not dispatched. The main branch and production deployment were not modified.

## 5. Construction conclusions remain unchanged

- The finalisation script is tooling evidence, not a normative v2.0 morphology source.
- Phase 5.15 CVC and Phase 5.16 optional-coda descriptions remain in conflict.
- Relation-coda inventory and meanings remain unrecovered.
- Parameter-family labels remain provisional.
- KAN/KEN/KAS remain whole-token, hand-flame-example evidence.
- D-006 and D-007 remain open.

The next source-recovery gate remains a complete, independently checkable extraction of the original Phase 4 DOCX and the finalisation PDF, followed by paragraph/table comparison against the three archive-index transcriptions. Until then, no replacement morphology is invented.
