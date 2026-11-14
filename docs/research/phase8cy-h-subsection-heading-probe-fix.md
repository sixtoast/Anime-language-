# Phase 8CY-H — Nested heading recognition in Phase 4 probe

The first section-level probe confirmed:
- the extracted opening matches the archive-index DOCX excerpt exactly for all 1,800 characters;
- all twelve top-level sections are present;
- normalised body text is 22,620 characters versus 21,121 in the archive index, a 1,499-character difference that remains unexplained;
- the Phase 4 §10 test table explicitly lists P4-T05 and P4-T10, including their test statements and PASS status.

The probe initially failed to recognise subsection labels such as `3.1` because its heading regex required an additional period after the final subsection digit. Updated the regex to accept both `3. Heading` and `3.1 Heading` forms. The next preview will emit §§3.1–3.3 separately so their exact language can be reconciled.
