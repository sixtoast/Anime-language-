# Phase 8AV — Historical Construction parse-tree contract

**Date:** 2026-11-14  
**Canon effect:** none. **General grammar effect:** none. **Execution:** none.  
**Tests authored:** CON-PTREE-001–010; not executed in this environment.

## Objective

Reconstruct the six structural phrase roles recorded by the historical Phase 5.22 bounded parser. Phase 8AU extracted its token tables and quantity rules; Phase 8AV records the parser's output shape as a version-bounded evidence tree.

## Source basis

The archive index stores excerpts for:
- `Arcane_Phase_6S_Typed_Expression_Integration/arcane_phase_5_22_parser.py`, SHA-256 `8041e7e40cd6e152aa9d38982e2a8986515a1aa7bc315dbfc1e7065e72ee2905`, 8,612 extracted characters.
- `Arcane_Phase_6S_Typed_Expression_Integration/Arcane_Phase_5_22_Report.md`, SHA-256 `e4e29b0e39e29d8d778613a798ba817dd5645da1caaea74d782b53160f598fe6`, 4,558 extracted characters.

Each archive-index preview is limited to 1,800 characters. The full source and full report are not recovered as standalone files here. The report excerpt explicitly states that the parser accepts one exact six-phrase Phase 4 hand-flame profile, requires middle-dot phrase boundaries, returns a structured parse tree, does not infer omitted grammar and does not assess physical feasibility.

## Reconstructed parse-tree slots

| # | Surface phrase | Historical node/reading | Status |
|---:|---|---|---|
| 1 | `mel` | Anchor token | Example-level; detailed landmark semantics unresolved |
| 2 | `po da za shi to za ma` | Position: po / +Y axis da / 0.2 metre | Fixture-read |
| 3 | `kan ken` | Construction Foot sequence | Example-level; no universal expansions |
| 4 | `he ha` | Coupling sequence | Domain labels provisional |
| 5 | `sa shi za se` | Duration: 5.0 seconds | Fixture-read |
| 6 | `kas` | Release token | Example-level |

The tree preserves 6 phrases and 17 whitespace-delimited tokens. The middle dot is a required phrase boundary in this exact profile; it is not promoted as a general spoken punctuation rule.

## Important semantic boundaries

### Anchor / MEL

Phase 5.15's Construction evidence associates `mel` with `me` plus anchor coda `l`, and MI surface scope anchored to the hand. The Phase 5.22 report calls `mel` the documented anchor token and leaves its full landmark semantics unresolved. Together these support the example-specific anchor reading, not a complete landmark or productive coda grammar. The tree does not implement an anchor-coda parser.

### Position and quantities

The Phase 5.22 report explicitly records the first spatial phrase as position role, +Y axis and metre-closed quantity; the digit table yields 0.2 metre. It records the second quantity as duration in seconds; the digit table yields 5.0 seconds. These are exact fixture-profile readings. They do not establish universal quantity attachment, coordinate frames, timing semantics, unit conversion or feasibility.

### Feet and couplings

`kan ken` remains a two-token example Foot sequence. The parser table gives example-level aliases, not universal expansions or complete Foot signatures. `he ha` remains a coupling sequence with provisional matter/energy domain readings. Neither node has a recovered participant contract, physical vector, magnitude, cost or executable output.

### Release

`kas` is retained as an example-level SHREN/release association. Target, safety conditions, post-release state and general release signature remain open.

## Relationship to the seven performed stages

The parse tree is not mapped one-to-one onto the seven performed stages. It is tempting to align anchor with reference, position with spatial role/vector, Foot sequence with Feet, coupling with couplings, duration with quantity and release with release. But the fixture tree does not independently expose a Control node, nor does it prove that its six phrases exhaust, instantiate or bind all seven stages. No stage-to-node mapping is asserted here.

## Phase 5.21 cross-check

The earlier Phase 5.21 fixture validator used a different token grouping for the same example: it stores compound quantities such as `za-shi-to-za` as one fixture token and checks lexical resolution only when an explicit slot is supplied. Its report records 11 PASS, 0 FAIL and 3 BLOCKED, and explicitly does not claim a complete parser or unique whole-construction parse. This is not a contradiction with Phase 5.22's six phrase tree: the two tools test different layers and use different internal token representations. Neither establishes the full spoken grammar.

## Implementation

Added:
- `src/engine/constructionParseTreeContract.ts`
- `src/engine/constructionParseTreeContract.test.ts`
- Test registry entries CON-PTREE-001–010
- Research & Review entry 12
- This research record

The audit helper recognises only the exact fixture string and returns the immutable six-node evidence tree. It does not parse arbitrary constructions, execute spells, validate physical feasibility or change the canon.

## Verification

Ten regression tests are authored but not executed. No local test, browser test or local build is claimed. Vercel build verification will be recorded separately after deployment. No GitHub Actions workflow is dispatched; main and production remain untouched.
