# Focused Findings: Surface Grammar and Dimensional Model

**Status:** Evidence-based source comparison; unresolved decisions remain unresolved.  
**Date:** 2026-10-13  
**Canon impact:** None.

## 1. Surface parser comparison: important operator-name divergence

### Archived Phase 6G evidence

The mega-pack text index records the archive member:

- Path: `Arcane_Phase_6S_Typed_Expression_Integration/ARCANE_PHASE_6G_SURFACE_PARSER.md`
- SHA-256: `ceb521416330a43e54972a7b2ef7da8479b71d62ae976948bf6e60e588c1b702`
- Extracted text length: 5,867 characters.

Its indexed contents describe the parser as a deliberately incomplete, non-canon-locked prototype. It claims to use recovered Phase 4 rules for fixed-arity, head-initial expressions, numeral closure with `SHO`, and control blocks using `METO` and `DOGU`. It also documents a legacy-name normalisation layer:

| Archived spelling | Phase 6G normalised spelling |
|---|---|
| `FRATA` | `FRAJA` |
| `FRAKA` | `FRAMA` |
| `DRIM` | `DRUM` |
| `DRAL` | `DRAS` |
| `GRAK` | `GRASH` |
| `KWAK` | `KWASH` |

The same excerpt says the lexicon CSV is loaded at runtime, and only explicitly enabled operator signatures are accepted. Incomplete forms such as `NES` are rejected rather than assigned guessed arities.

### Current TypeScript evidence

Current `src/engine/auditParser.ts` registers the Phase 2 audit-notation arities for `FRAPA`, `FRATA`, `FRAKA`, `FRALA`, `FRASHA`, `DRAN`, `DREM`, `DRIM`, and `DRAL`. It parses comma-separated nested calls using `⟨` and `⟩`. Its file-level comment explicitly limits it to provisional Phase 2 audit notation, not spoken or ordinary written Arcane.

Current `src/engine/operatorContracts.ts` likewise describes the operator entries as provisional audit signatures and leaves input/output types and evaluation rules unresolved.

### Finding and safe interpretation

There is a **real naming-lineage divergence** between the archived Phase 6G surface-parser prototype and the current Phase 2 audit notation. This is not enough evidence to decide that either naming set should replace the other. They may belong to different grammar snapshots, or the Phase 6G normalisation may be a provisional migration layer.

Do not automatically rename current operators, change lexicon entries, or rewrite tests based on this excerpt alone. The required reconciliation is to compare the exact Phase 4 rules, canonical v3.0-L lexicon and decision ledger against the full Phase 6G source, then record each spelling as one of: canonical form, documented legacy alias, prototype-only normalisation, or unresolved.

A second caution: Phase 6G's use of `METO`/`DOGU`, `SHO`, and runtime lexicon loading describes a richer parser architecture than the current audit parser. These features should not be inferred as implemented in the TypeScript workbench.

## 2. Dimensional-model comparison: angle handling needs an explicit policy

### Archived Phase 6R evidence

The mega-pack text index records:

- Model report path: `Arcane_Phase_6S_Typed_Expression_Integration/ARCANE_PHASE_6R_DIMENSIONAL_MODEL.md`
- SHA-256: `15024e3970bdb8ac8882745c04576f40995b35fc3e44b7ac147b727acab76968`
- Report path: `Arcane_Phase_6S_Typed_Expression_Integration/ARCANE_PHASE_6R_REPORT.md`
- SHA-256: `71823932837304645725364b0bbbc2dd76873b5899f4bcc1f8177169286efd8c`

Phase 6R represents a quantity as a Decimal magnitude plus a sparse exponent vector, using abstract `L`, `M`, and `T` placeholders. Addition/subtraction require matching dimensions; multiplication/division combine exponents; division by zero is rejected. The report explicitly says units, conversion, measurement completeness, feasibility and Logos accounting are not implemented, and the quantity layer is not connected to the expression evaluator.

The archive's Phase 6R status table explicitly marks canonical Arcane units unresolved and measurement completeness not implemented.

### Current TypeScript evidence

Current `src/engine/dimensions.ts` defines a `DimensionVector` with five independent exponents: length, time, mass, temperature and angle. It lists `MA`, `SE`, `KE`, `KU`, and `RA` as unit symbols. However, the current `RA` entry uses `DIMENSIONLESS` as its dimension, while the vector type separately includes an angle exponent.

Current `src/engine/semanticTypes.ts` compares all five exponents for quantity compatibility. This means the data model can represent an angle exponent, but the registered radian unit currently maps to the all-zero vector.

### Finding and safe interpretation

This is an **explicit modelling choice that needs confirmation**, not automatically a defect: radians are dimensionless in common SI dimensional analysis, while some application type systems deliberately preserve an angle dimension to prevent confusing angles with arbitrary dimensionless scalars. The current representation includes an angle axis but maps `RA` to dimensionless, so its intended role must be documented and tested consistently.

Before extending typed evaluation, choose and source the policy:
1. **SI-style dimensionless angle:** `RA` remains dimensionless; the angle exponent must be justified as a separate semantic distinction or removed from dimensional equality if unused.
2. **Angle as a distinct dimension:** `RA` receives angle exponent 1; conversion and trigonometric/operator rules must be defined accordingly.
3. **Two-layer model:** physical dimensions treat radians as dimensionless, while semantic quantity types separately track angle-valued quantities.

No option is canonically selected by this report. Do not change `RA` or derived-unit behaviour until the policy is approved.

## 3. Test claims: preserve their scope

The archived Phase 6R report says the combined Phase 6P/6Q/6R suite was executed and points to `PHASE_6R_TEST_OUTPUT.txt`. The Phase 6S report records 68 passing tests across the combined reference-prototype suite. These are historical results for the archived Python package.

The current TypeScript test registry marks its listed tests `authored-unverified`. That status is not a test pass. A fresh CI run is needed before claiming current tests passed.

## 4. Recommended next audit actions

1. Extract the complete Phase 6G report, parser source, lexicon CSV and relevant Phase 4/decision-ledger material as derived review copies, keeping the original ZIP unchanged.
2. Build a spelling-and-alias matrix with provenance for every operator in the Phase 6G rename list.
3. Confirm whether the canonical v3.0-L specification treats `RA` as a unit only, an angle-typed quantity, or both through separate type layers.
4. Add regression fixtures for the approved naming and angle policies only after those decisions are source-grounded.
5. Run current repository CI and record commit, run ID, and exact test counts; do not reuse the archive's 68/68 result as current evidence.

## Sources reviewed

- Current `src/engine/auditParser.ts` (GitHub blob SHA `de0798c9cdd76fef3ce6ede21cee1185dc4d37ff`).
- Current `src/engine/operatorContracts.ts` (GitHub blob SHA `5bf1ba0a9361c31b79463de1557aea3bea362c6f`).
- Current `src/engine/dimensions.ts` (GitHub blob SHA `55d495d65a63360d805e7c41e4d0b3438a3a9f98`).
- Current `src/engine/semanticTypes.ts` (GitHub blob SHA `6bbe0e0d388b03d140cc0dd607a620c57d3a6290`).
- Archived source/report hashes as listed above and in `sources/archive-reports/mega-pack-text-index.md`.

This report records a source comparison only. It does not state that the archived code was rerun, that current CI passed, or that any provisional rule is canon.
