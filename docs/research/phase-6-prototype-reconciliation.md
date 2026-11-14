# Phase 6 Prototype Reconciliation — Initial Evidence Review

**Status:** Initial review; derived from the archive manifest, searchable text index, extracted report excerpts, and current TypeScript workbench source.  
**Date:** 2026-10-13  
**Canon effect:** None. This report records implementation evidence and gaps; it does not promote prototype behaviour to canon.

## Purpose

Reconcile the archived Phase 5.17–5.24 and Phase 6G/6M/6O/6R/6S prototype work with the current TypeScript workbench. Keep source claims, implementation claims, and executed-test evidence separate.

## Evidence classes

- **Archive evidence:** a file or report exists in the mega-pack and has a recorded hash.
- **Historical test claim:** a report or output file records results from a past run; this does not prove the current repository or current implementation passes.
- **Current workbench evidence:** behaviour visible in current `src/` source.
- **Canon:** only a rule already established in the canonical specifications or approved decision ledger. Prototype documents do not create canon.

## Findings

### 1. Phase 6G surface parser is a separate prototype lineage

The archive includes `arcane_phase6g_surface_parser.py` and `ARCANE_PHASE_6G_SURFACE_PARSER.md`. This is materially different from the current TypeScript parser, which explicitly parses provisional Phase 2 audit notation of the form `OP⟨arg1, arg2, …⟩`.

**Implication:** do not label the current workbench parser “the Arcane parser” without a scope qualifier. The current capability is an audit-notation parser with registered arity checks, not demonstrated conformance to the canonical surface grammar. The archived Phase 6G parser must be reviewed for its accepted syntax, lexical assumptions, failure cases, and dependency on lexicon or contract registries before any reuse.

**Next evidence needed:** full Phase 6G report and source, representative fixtures, recorded tests, and a direct comparison against canonical surface syntax and the known homograph issue (`ra`, `re`).

### 2. Phase 6M execution audit distinguishes evidence checks from language tests

The archive contains `ARCANE_PHASE_6M_EXECUTION_REPORT.md`, `arcane_phase6m_execution_audit.py`, `PHASE_6M_EVIDENCE_CHECKS.txt`, and `PHASE_6M_EXECUTION_STATUS.csv`. Earlier recovery notes state that this audit runs eight source/registry evidence checks; those checks are not the sixteen design-level tests T-001–T-016.

**Implication:** preserve this distinction in the workbench. “Evidence check passed” means a repository/source condition was checked; it does not mean the Arcane grammar, semantics, or spell feasibility passed a conformance test.

**Next evidence needed:** inspect each evidence-check predicate, determine whether it reads current files or hard-coded expectations, and verify the status CSV against the report. Keep T-001–T-016 unpassed unless an actual test execution and output demonstrate them.

### 3. Phase 6O is a reproducibility check, not language validation

The archive includes `ARCANE_PHASE_6O_REPRODUCIBILITY_REPORT.md`, `run_phase6o_validation.py`, and machine-readable result files. The known report says the Phase 5 generator can reproduce the archived v5 lexicon byte-for-byte, using baseline SHA-256 `4b38aec651a32b332d4f28068d34618c4dfb2f043d44a2f03c146dba2e31ad8a`.

**Implication:** deterministic reproduction is useful provenance evidence, but it does not prove the generated roots are canonical, complete, pronounceable, or intelligible to listeners. The v5 lexicon and its generator remain source artifacts until their status and decision history are resolved.

**Next evidence needed:** verify the archived baseline hash against the actual CSV bytes, inspect the generator's inputs and output path, and ensure generated files cannot overwrite the preserved original.

### 4. Phase 6R dimensional algebra is provisional and abstract

The archived Phase 6R module represents dimensions as sparse integer exponent vectors and quantities as Decimal magnitudes plus a dimension. The archive README explicitly says this module is a prototype and is separate from the evaluator. Its test fixture uses abstract engineering symbols `L`, `M`, and `T`.

The current TypeScript workbench has a separate dimension module with canonical-unit labels and its own dimension shape. The current semantic type compatibility helper compares dimensional exponents, but the dimension module is not integrated into operator evaluation.

**Implication:** the two implementations are related ideas, not interchangeable implementations. Do not translate `L/M/T` directly into canonical unit spellings, or assume the Python prototype's tests establish the TypeScript implementation's correctness. Angle handling and the `RA` convention remain explicit decisions rather than implicit assumptions.

**Next evidence needed:** compare both models operation by operation: normalisation, add/subtract compatibility, multiply/divide exponents, division by zero, Decimal precision, conversion policy, angle dimensions, and unit registry. Add cross-language fixtures only after the canonical dimension basis is approved.

### 5. Phase 6S typed integration proves a bounded prototype path only

The archived Phase 6S report describes a bridge between the Phase 6P/6Q expression AST and the Phase 6R dimensional model through `arcane_typed_runtime.py`, `evaluate_typed()`, and a programmatic `QuantityLiteral`. The recorded combined suite reports 68/68 passing tests. The README explicitly says the quantity literal is a programmatic test AST node and does not assert canonical surface syntax for units or quantities.

**Implication:** this is useful evidence that a specific Python reference implementation was tested at that time. It is not evidence that the current TypeScript workbench has an equivalent typed evaluator, that the full canonical grammar is implemented, or that physical spell feasibility is enforced.

**Next evidence needed:** inspect the exact archived test output and source, then create a mapping from each Phase 6S capability to current TypeScript code, absent functionality, and required canonical decisions. Do not copy the 68/68 number into current CI status.

### 6. Phase 5.24 binding behaviour remains provisional

The archived `PHASE_5_24_DECISION_RECORD.md` marks the dual-binding prototype provisional. The recovered proposal distinguishes storing an expression and captured value, reading a captured value, and reevaluating an expression; it also records limitations such as scope, shadowing, cycles, and forward references.

**Implication:** this must not silently replace the currently recovered high-level distinction between `KWAM` (create a binding), `KWAT` (reference a binding), and `KWAK` (live evaluation). The exact runtime model needs a canonical decision before a production type checker or evaluator can enforce it.

## Current workbench boundary (verified in source)

- The audit parser handles the provisional angle-bracket audit notation and checks registered arities.
- Semantic types preserve distinctions between information, mana-state, energy, force, coupling, effect, observations, references, bindings, and control expressions.
- The compatibility helper is conservative and is not an operator-specific type checker.
- The operator contract registry intentionally leaves unresolved signatures, dimensional rules, and evaluation semantics unset.
- Test registry entries marked `authored-unverified` are not equivalent to executed passing tests.
- No complete canonical surface parser, general operator type checker, spell evaluator, mana simulation, or physical feasibility/resource accounting is established by these modules.

## Reconciliation matrix

| Area | Archived prototype evidence | Current workbench evidence | Status | Required next step |
|---|---|---|---|---|
| Surface parsing | Phase 6G parser/report exist in archive | Phase 2 audit-notation parser | Separate grammars; not yet reconciled | Review Phase 6G source, then build fixture-based grammar comparison |
| Execution audit | Phase 6M report, script, status artefacts | Canon audit registry and test registry | Evidence checks must not be counted as conformance tests | Inspect predicates and status provenance |
| Reproducibility | Phase 6O generator and hash comparison | Source inventory only | Historical reproduction claim | Re-run safely in isolated CI and verify original bytes remain unchanged |
| Dimensions | Phase 6R abstract sparse exponent model | TypeScript dimensions and compatibility helper | Parallel limited implementations | Define canonical dimensions/units; add cross-language fixture set |
| Typed evaluation | Phase 6S reports 68/68 historical prototype tests | No integrated TypeScript evaluator | Not implemented in current workbench | Port only after contracts are approved; tests must be newly executed |
| Bindings | Phase 5.24 provisional dual-binding design | Binding/reference/live-evaluation types only | Specification-blocked | Approve semantics for scope, capture, mutability, time, cycles, and errors |
| Lexicon/aliases | Phase 5.5–5.22 validators and fixtures | Workbench operator registry is deliberately conservative | Historical naming/alias conflicts unresolved | Reconcile alias registry, lexicon versions, and decision ledger before promotion |

## Recommended order of work

1. Extract and inspect the full Phase 6G, 6M, 6O, 6R, and 6S source reports and code, preserving the original ZIP.
2. Produce a line-cited evidence table with source path, hash, claim, exact output, limitations, and current-code counterpart.
3. Compare Phase 6G's actual grammar against the canonical v3.0-L surface syntax and the provisional Phase 2 audit notation.
4. Decide whether the Python Phase 6R/6S reference implementation is a specification experiment to preserve, a reference oracle to adapt, or a prototype to retire. Do not assume the answer.
5. Turn only approved, source-grounded rules into canonical decision records and executable fixtures.
6. Run current repository CI and report its actual run ID, commit, test count, and failures before making any present-tense test claim.

## Non-goals and guardrails

- No canon changes are made by this report.
- No original files are deleted, renamed, or overwritten.
- Historical PASS results remain historical until rerun.
- Unknown semantics remain unknown; no operator signatures or physical mechanisms are inferred.
- Parser acceptance is not proof of semantic validity, physical feasibility, or listener intelligibility.
