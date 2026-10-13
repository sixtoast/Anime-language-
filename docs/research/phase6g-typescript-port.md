# Phase 6G TypeScript Parser Port — Implementation Note

**Status:** implementation added; automated tests authored; current CI outcome not yet verified.  
**Canon effect:** none.  
**Source lineage:** archived Phase 6G parser prototype, SHA-256 `c703697e792129b831cea16802342eba0add75ab8fbf4abd8c68805fffcaa77e`.

## Files

- `src/engine/surfaceParser.ts`: isolated provisional surface parser.
- `src/engine/surfaceParser.test.ts`: Vitest tests for parser behaviour.
- `tests/fixtures/phase6g-surface-parser-cases.json`: source-traced fixture definitions and provenance.
- `tests/fixtures/PHASE6G-README.md`: fixture use and evidence discipline.

## API and behaviour

The exported function is:

```ts
parseSurfaceExpression(input, {
  knownAtoms?: readonly string[],
  allowLegacyAliases?: boolean
})
```

It returns a discriminated-by-`ok` result with the notation label `phase-6g-provisional`, an AST when parsing succeeds, and stable diagnostic codes when it fails.

The AST preserves distinct nodes for:
- atomic lexical forms supplied through `knownAtoms`;
- decimal quantity literals with explicit unit tokens;
- numerically encoded identifiers closed by `SHO`;
- fixed-arity operator calls;
- explicit control blocks.

The parser currently covers the small enabled signature table copied from the archived Phase 6G design. It implements numeral closure, decimal marker checks, binding identifier closure, nested calls, `METO … DOGU` control blocks, documented alias normalisation, `DRAS`'s audit-only comparison criteria, and fail-closed diagnostics for known homophones and unresolved operator forms.

## Deliberate limits

1. The parser does **not** load the canonical lexicon. Atomic leaves must be supplied through `knownAtoms`; this avoids silently treating every word as valid while the application has no connected, authoritative lexicon interface.
2. The legacy alias table is a prototype compatibility feature. It does not rewrite canonical source or approve the target spellings.
3. `DRAS` comparison criteria remain audit-only tokens; they are not asserted to be canonical Arcane forms.
4. No semantic type checking, dimensional checking, evaluation, physical feasibility, conservation accounting, mana simulation, or spell execution is performed.
5. The current parser is a narrow TypeScript port of the archived design, not a byte-for-byte translation and not yet proven equivalent to the Python prototype.
6. The archive's reported 19/19 tests are historical results. They must not be counted as current TypeScript test results.

## Test and CI status

The TypeScript test file covers the core implemented behaviours, including malformed numerals, binding identifiers, nested calls, control-block boundaries, alias handling, homophone rejection, unknown atoms, and unresolved operator rejection. Tests have been authored and committed, but **no passing result is claimed here** until a current CI run is inspected.

## Next acceptance gates

- Run Vitest and the production build on the current commit.
- Correct any compile or test failures, with follow-up commits.
- Compare the TypeScript parser against the archived Python parser using shared, validated golden cases.
- Connect the canonical lexicon through an explicit typed interface, preserving lexical-class and homophone metadata.
- Add AST adapter tests before connecting this parser to semantic evaluation.
- Keep canonical grammar decisions separate from implementation details and historical alias handling.
