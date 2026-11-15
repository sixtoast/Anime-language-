# Phase 8CY-K — Verified primary-source extraction metrics

The preview extraction completed successfully with the original DOCX SHA-256 check passing. The recursive body traversal reports 23,111 characters in the Markdown transcription and 22,620 characters after removing blank lines/metadata. The first 1,800 characters match the archive text-index excerpt exactly. All twelve top-level sections are detected. The Python source-intake suite passed 19 tests; Vitest passed 1,293 tests in 105 files; TypeScript and Vite completed successfully.

The archive text index reports 21,121 characters, leaving a 1,499-character normalised-count difference. The archive index excerpt is truncated, so full concordance cannot yet be asserted. The extracted body includes 69 paragraphs and 16 tables. The Phase 4 document states that its audit was DECIDED BY DELEGATION and UNTESTED BY LISTENERS.

A temporary preview-only base64 transport is being used to preserve the extracted body transcription as a normal text file in the repository. It does not alter the original DOCX and is not a claim that non-body Word parts or layout have been reconstructed.
