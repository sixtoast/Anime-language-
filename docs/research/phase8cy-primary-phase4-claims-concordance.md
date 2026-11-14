# Phase 8CY-M — Primary Phase 4 claims added to the source concordance

**Canon effect:** NONE. **Grammar/parser changes:** none. **Execution:** none.

The Phase 4 DOCX was extracted recursively in the Vercel preview build after checking its source-byte SHA-256 against the recorded original. The extraction identified 12 top-level sections, 69 paragraphs and 16 tables. Its first 1,800 characters match the archive-index excerpt. The complete transcription has not yet been committed as a text file; this increment records only bounded claims whose content was inspected in the extraction output and preserves section-level provenance labels.

## Primary-source claims now represented

| Claim | Source locator | What the source says | Boundary retained |
|---|---|---|---|
| Construction / Expression division | Opening overview | Construction is for mana configuration; Expression covers values, targets, conditions, timing and requirements | Architecture description, not complete grammar |
| Seven-stage ordering | Construction overview | Reference → spatial role/vector → Feet → couplings → quantity → control → release | No inferred cardinality, syntax, dependency or execution |
| Modifier attachment G-4 | §6, G-4 | Modifiers attach to the nearest preceding clause at the same block level | Do not extend beyond same-block-level wording |
| KAN / fire distinction | Hand-flame example | KAN does not mean fire; flame outcome depends on parameters | No KAN=fire lexical rule or complete causal model |
| Audit validation | Audit status and §10 | DECIDED BY DELEGATION; UNTESTED BY LISTENERS; P4-T05/P4-T10 marked PASS | Mechanical PASS is not listener validation |

These claims are added alongside—not in place of—the existing Phase 5.15/5.16 matrix records. In particular, the primary-source seven-stage ordering does not resolve the Foot CVC/optional-coda discrepancy. Nor does the G-4 attachment rule establish the syntax or semantics of Construction Feet.

## Extraction verification and remaining gap

- Original DOCX SHA-256: `c8204667c204227ba474fd0b5245fd66f1ba081565671f5a28cf65efb513eaea`
- Extracted document-body text: 23,111 characters.
- Normalised body: 22,620 characters.
- Archive index DOCX-derived count: 21,121 characters.
- Prefix agreement: first 1,800 characters exact.
- Difference in normalised character counts: 1,499; unexplained.
- Body traversal: 69 paragraphs and 16 tables.
- Python source-intake tests: 19 passed; Vitest: 1,293 passed across 105 files; TypeScript and Vite passed in the preview build.

The extraction is a body-text derivative, not a full Word package reconstruction. It does not claim visual layout, comments, footnotes/endnotes, tracked-change intent or out-of-body floating objects. The DOCX/TXT archive-index variants remain distinct artifacts. Full text concordance and exact paragraph/table numbering remain outstanding.

## Development consequence

The Construction language now has a stronger source-backed architectural boundary and one explicit modifier-attachment rule. The next morphology task should focus on retrieving the exact §3.1–§3.3 Foot definitions and reconciling them with Phase 5.15/5.16, rather than inventing coda meanings or expanding the provisional vowel families.
