# Phase 6G source lexicon loading and parser integration

**Status:** implementation committed; fresh CI execution not verified  
**Canon effect:** none  
**Scope:** source CSV parsing, validation, source-aware registry construction, and opt-in lexical lookup in the provisional TypeScript surface parser.

## Source inputs

- `sources/originals/Arcane_Lexicon_v5_draft.csv`
  - Git blob SHA: `2ec3b66ccdcecf517fa236ff06b88f1c5faaed96`
  - Treated as a v5 draft snapshot, not a blanket declaration that every row is canonical.
- `sources/originals/Arcane_Alias_Registry_Phase_5_5.csv`
  - Git blob SHA: `beb38dabb2c5087119d58add1bd10bfe196d5662`
  - Explicit historical alias evidence is loaded separately from the lexicon rows.

## Implemented

- `parseCsvText` supports quoted commas, doubled quote escapes, UTF-8 BOM stripping, CRLF/LF, and embedded line breaks in quoted fields.
- Header names are normalised and duplicate/empty headers are rejected.
- Records with a cell count different from the header are diagnosed and excluded rather than partially mapped.
- `loadLexiconCsvText` checks required lexicon and alias headers, builds the registry, and returns diagnostics and counts.
- `src/engine/bundledLexicon.ts` imports the reviewed repository CSV snapshots as static raw assets; the browser does not fetch external files.
- `SurfaceParserOptions.lexiconRegistry` allows callers to opt into source-backed atom lookup.
- Alias resolution remains opt-in with `allowLegacyAliases: true`.
- Entries with multiple glosses or lexical classes remain collisions. The parser fails closed when it encounters a collision in atom position.

## Important limits

- The loader is not a repair tool. Malformed source records are excluded and reported; the underlying CSV must be reviewed separately.
- The source registry is not yet connected to the main workbench's interactive UI by default.
- The parser remains a provisional Phase 6G subset. It does not establish the canonical grammar, implement a complete lexical-class grammar, or type-check/evaluate spells.
- The existing numeral parser has its own RE/RA ambiguity checks. No new contextual disambiguation policy is claimed.
- This work does not alter the v3.0-L canon, resolve open language decisions, or turn archived prototype results into current test passes.

## Acceptance gates

1. Execute all Vitest tests and TypeScript/Vite build in CI.
2. Review every loader diagnostic from the bundled source snapshot.
3. Check that no source record is silently shifted into the wrong column.
4. Compare aliases from both evidence sources and resolve disagreements as explicit decisions.
5. Run the recovered Phase 6G fixtures and classify every case with a recorded outcome.
6. Only then decide whether to expose this parser mode in the workbench UI.
