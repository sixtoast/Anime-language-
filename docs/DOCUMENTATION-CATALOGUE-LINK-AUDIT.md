# Documentation Catalogue — First-Pass Link Audit

**Audit date:** 2026-10-13  
**Scope:** Explicit `sourcePath` entries in the Documentation catalogue in `src/App.tsx`  
**Result:** 14 unique explicit paths checked; 14 exist in the current repository tree; 19 catalogue entries were identified without an explicit `sourcePath`.

## What was checked

The catalogue's explicit source paths were extracted from the current `src/App.tsx` on `main` and compared with the repository's recursive file tree. No missing path was found among the 14 explicit paths.

This verifies repository path existence only. It does **not** verify that:
- the link was clicked in a browser;
- the document's claims or metadata are correct;
- the document is canonical;
- every relevant source has been included in the catalogue;
- entries without a source path are necessarily defective.

## Follow-up required

Review each of the 19 entries without an explicit `sourcePath`. Classify each as a conceptual topic/open question, a source gap, or a catalogue record that needs a real file link. Then add UI-level checks for search, selection, empty results, status display, and opening source links.

See [Website Feature Register](WEBSITE-FEATURE-REGISTER.md) for the capability mapping and remaining audits.
