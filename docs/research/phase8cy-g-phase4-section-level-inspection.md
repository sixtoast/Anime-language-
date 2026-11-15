# Phase 8CY-G — Section-level Phase 4 source inspection

The recursive extraction now reports 23,111 characters and all twelve top-level sections, compared with 21,121 characters in the archive index's DOCX text record. The opening matches visually, but the differing character counts require a controlled comparison rather than an assumption of completeness.

The probe now compares the extracted body prefix against the archive index's 1,800-character DOCX excerpt and prints the target passages separately: §§3.1–3.3, §6, and §§8–10. Separate invocations keep each passage within build-log limits. This makes it possible to inspect the actual primary document content and its tables while retaining the source-byte SHA-256 verification.

The extracted output remains a document-body transcription; it does not cover independent footnotes, endnotes, comments or document layout. No grammar decision is made solely by this inspection phase.
