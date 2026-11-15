# Phase 8BX — Expression/Construction evidence crosswalk

**Date:** 2026-11-14  
**Status:** Source-backed evidence crosswalk; no pairwise mappings approved  
**Canon effect:** NONE · **New vocabulary:** none · **Compiler:** not implemented  
**Tests authored:** P4-XW-001–012 · **Executed:** not executed locally

## 1. Decisive source evidence

The checked-in `sources/originals/Arcane_Phase_5_15_Construction_Contract_Matrix.csv` contains two particularly important records:

- **Construction/Expression split:** Construction describes what mana configuration does; Expression computes values, targets, conditions and timing. It cites Phase 4 §3 and explicitly says the bridge mapping from Expression AST to complete Construction instructions is not demonstrated.
- **Expression-to-Construction bridge:** the Phase 4 §3.3 bridge is described conceptually, but the matrix marks it NOT IMPLEMENTED / NOT DEMONSTRATED. It explicitly records that no formal mapping table, compiler or end-to-end trace is present in the recovered files.

The same matrix differentiates the six Construction macros. TRAK has a described p/t/k discrete-change pattern; KREN is proposed and requires owner confirmation; FREM and SHREN have partial hand-flame examples; BRAN has a described h-domain family with provisional domain mapping; VARE has a soft-requirement role but unresolved operational semantics.

The Phase 5.16 recovery matrix independently preserves the subsystem split and labels parameter-vowel and h-coupling physical mappings provisional. It also records the optional relation-coda account, which conflicts with Phase 5.15's CVC description.

## 2. Expression operator inventory

The Phase 2 audit is explicitly provisional formalisation and says its angle-bracket notation is audit metalanguage, not established spoken Arcane. It describes arithmetic operators (FRAPA, FRATA, FRAKA, FRALA, FRASHA), spatial/magnitude operators (DRAN, DREM, DRIM, DRAL), logical/control operators (GRAN, GRAT, GRAK, BEK, ZET), and information/state operators (SIMA, NES, GAMA, DAVE, KWAM, KWAT, KWAK).

Those records are not all canonical executable signatures. The current `operatorContracts.ts` correctly preserves proposed arities and unresolved input/output/evaluation semantics.

## 3. What the evidence allows us to say

| Evidence | Status | Permitted conclusion |
|---|---|---|
| Expression and Construction are distinct subsystems | Source-backed | Preserve separate representations |
| Phase 4 conceptual compile bridge exists | Source-backed | A cross-subsystem relationship is intended |
| Formal AST-to-Construction mapping table | Not demonstrated | Do not invent pairwise mappings |
| TRAK p/t/k pattern | Pattern described | Record the macro-level frame-set association |
| KREN b/d/g counterpart | Proposed | Keep owner-confirmation status |
| FREM/SHREN and KEN/KAS | Partial examples | Do not generalise the fixture |
| BRAN and H-series | Family described; mapping provisional | Do not infer physical coupling or signature |
| VARE | Role described | Do not infer attachment or conflict semantics |

## 4. Crosswalk implementation

Added `src/engine/constructionExpressionCrosswalk.ts`. It:
- groups the formal operator inventory into four audit families;
- records all six Construction macros and their distinct evidence states;
- permits lookups of an operator/macro pair but always returns `NOT-ESTABLISHED`;
- reports whether each side is recognised without confusing recognition with translation;
- preserves KREN's proposal status and FREM/SHREN example-only status;
- keeps H-series coupling signatures unresolved;
- remains non-executable and canon-neutral.

This is intentionally a negative crosswalk: it prevents the workbench from suggesting that an operator maps to a macro merely because the two appear conceptually related.

## 5. Important consequence for compiler design

The next compiler milestone cannot be a translation table filled from glosses. It requires recovery and approval of:
1. the complete Phase 4 §3.3 mapping text and referenced tables;
2. the complete v2.0 Foot and coupling definitions;
3. source-approved Expression operator signatures and typed operand/result rules;
4. the exact construction target representation;
5. at least one source-backed end-to-end trace with explicit intermediate values and diagnostics.

The Phase 4 DOCX binary remains only partially recovered through its 1,800-character index excerpt; the archive byte-identity report proves duplicate binary copies, not transcription completeness. Phase 5.15 and 5.16 are matrix summaries, not substitutes for the full v2.0 specification.

## 6. Decision

Do not pair FRAPA with TRAK, DRIM with a spatial Construction token, FREM with a loop/timing operator, or any other operator and macro based on gloss similarity. Keep the subsystems separate until a source-backed mapping is recovered or a new versioned mapping specification is explicitly approved.

**Decision ID:** P8BX-XW-01 · **Canon effect:** NONE
