# Phase 6G Surface Parser and Binding Semantics — Evidence Audit

**Review date:** 2026-10-13  
**Canon effect:** None. This is an evidence and engineering review, not an approval of prototype rules.  
**Evidence base:** archived Phase 6G parser report/source, Phase 6R dimensional source/report, Phase 6S typed-runtime source/report, Phase 6M execution report, Phase 6O reproducibility report, and Phase 5.24 D-051/test-result extract. Extracted copies and hashes are recorded in `sources/archive-reports/phase-audit-extracts/README.md`.

## Executive finding

The archive contains more useful implementation evidence than the current workbench presently integrates. In particular, Phase 6G is a real, narrow token-stream surface-parser prototype, while the current TypeScript parser remains an audit-notation parser. Phase 6R/6S supply a small dimensional arithmetic runtime bridge, and Phase 5.24 records a tested-but-provisional binding design. These should inform the next milestone, but should not be silently merged into canon or described as current workbench capabilities.

## Evidence distinctions

- **Archive source recovered:** the source/report is present in the original ZIP and a hash-identified review copy is available.
- **Historical test report:** the archive says a test set passed at the time. It is not proof that the code has been freshly rerun, is integrated, or passes current CI.
- **Current workbench capability:** behaviour implemented in the current TypeScript source and tested in the current CI run.
- **Canon:** a rule approved in the canonical specifications or decision ledger. Prototype documentation alone has no canon effect.

## Finding 1 — Phase 6G provides a candidate surface-parser lineage

The recovered Phase 6G report describes a whitespace-tokenised, fixed-arity, head-initial parser. It infers argument boundaries from declared arity rather than punctuation, requires numerals to close with a unit, uses `SHO` to close dimensionless numerals and binding identifiers, and uses `METO … DOGU` for explicit control blocks. The script defines distinct AST node classes for atoms, quantity literals, identifiers, calls, and blocks.

The report records **19/19 prototype parser tests** covering numeral closure, malformed numerals, binding identifiers, nested arithmetic, control blocks, unknown forms, unresolved signatures, homophone rejection, aliases, and invalid delimiters. This is historical evidence from the archived report; the extracted script has not been freshly executed in this audit, and these are not current TypeScript CI results.

Important caveats in the source itself:
- The signature table is deliberately incomplete; several operators are omitted due to unresolved signatures or operational rules.
- `DRAS` comparison criteria `LT/LE/EQ/NE/GE/GT` are test metalanguage, not approved Arcane vocabulary.
- `RE` and `RA` have documented homophone collisions across digit/unit/reference uses; the parser fails closed in identified numeral contexts rather than implementing complete context-sensitive disambiguation.
- `KOLE`, `METO`, and `DOGU` are described as proposed in the lexicon, so implementing parser roles does not canonise those forms.
- The parser produces its own AST and does not automatically adapt it to the Phase 6E/6F AST classes.
- Successful parsing does not prove type correctness, evaluation, physical feasibility, or a valid mana construction.

**Recommendation:** port the Phase 6G parser only as a separately labelled candidate surface-parser module, with the archive hash and source lineage attached. First add golden fixtures and negative fixtures, then compare its AST against the canonical grammar and current registry. Do not replace the audit-notation parser until parity and migration criteria are explicit.

## Finding 2 — Alias migration is a compatibility layer, not a canon decision

The Phase 6G script normalises historical spellings, including `FRATA → FRAJA`, `FRAKA → FRAMA`, `DRIM → DRUM`, `DRAL → DRAS`, `GRAK → GRASH`, and `KWAK → KWASH`. The report calls these documented legacy forms, while the current canonical inventory and workbench may still expose older names or unresolved statuses.

**Recommendation:** represent aliases in a versioned, source-cited migration table with fields for source spelling, target spelling, evidence, status, and whether the alias is accepted for parsing. Do not globally rewrite canonical text or treat an alias as proof that every semantic contract is settled.

## Finding 3 — Phase 6R dimensional arithmetic is deliberately abstract

The recovered Python module represents dimensions as sparse integer-exponent vectors keyed by abstract symbols. It supports addition/subtraction only for equal dimensions, multiplication/division by exponent combination, negation, and division-by-zero rejection. It explicitly does not imply real-world unit conversion.

The Phase 6S bridge maps bare numeric AST literals to dimensionless quantities and requires tests to construct physical quantities explicitly with a `QuantityLiteral`. Its evaluator implements the arithmetic operators and a small Boolean subset; other operators raise an unsupported-operator error.

**Recommendation:** use this as evidence for a narrow arithmetic contract and tests, not as a complete unit system. Before integrating, define the relationship between canonical units (`MA`, `SE`, `KE`, `RA`, `KU`) and abstract dimension axes, especially the unresolved angle policy. Preserve explicit units and conversions as unresolved until source evidence determines them. Keep the typed runtime separate from spell execution and feasibility.

## Finding 4 — D-051 binding semantics are a useful proposal, not approved canon

The Phase 5.24 decision record proposes a dual binding model:
- `KWAM` stores the defining expression and its captured value;
- `KWAT` reads the captured value;
- `KWAK` reevaluates the stored expression against live inputs.

The archived JSON records 10/10 prototype checks as PASS, including stable captured values, live reevaluation, undefined binding rejection, duplicate declaration rejection, atomic declaration failure, dimension mismatch, division by zero, nested arithmetic, and malformed arity. This is historical prototype evidence, not a fresh run of current code. The record itself labels D-051 provisional and notes missing nested scopes, shadowing, cycles, and forward references.

**Recommendation:** keep the proposal in the decision ledger as **PROPOSED / NOT CANON**. If approved later, write normative rules for evaluation timing, captured-value snapshot, external inputs, scope/lifetime, redefinition, cycles, forward references, errors, and resource accounting. Then implement against those rules and execute tests in the current repository.

## Finding 5 — Phase 6M is explicit that the 16 conformance tests were not run

The Phase 6M report says the script ran eight source/registry evidence checks. It explicitly states those checks do not prove executable enforcement and do not count as passes for the 16 design-level tests T-001–T-016. The report marks those tests blocked for missing parser/runtime integration, type environment, temporal/control contracts, feasibility, conservation, Logos accounting, or human-listener protocol as appropriate.

**Recommendation:** keep T-001–T-016 unpassed until a concrete test run with an identified implementation and recorded output exists. Use separate labels for source-evidence checks, historical prototype tests, current unit tests, and human validation.

## Proposed implementation sequence

1. **Create a source-backed surface grammar fixture pack.** Include accepted expressions, malformed numeral cases, unresolved signatures, control-block nesting, and homophone collisions. Each fixture should cite its source and expected status.
2. **Implement a compatibility boundary.** Keep audit notation and Phase 6G surface notation as distinct parser modes. Avoid ambiguous auto-detection.
3. **Define an AST adapter contract.** Map every Phase 6G node to the workbench's AST explicitly; reject unsupported nodes rather than dropping information.
4. **Build a versioned operator/alias registry.** Track arity, operand/result types, evidence, canon status, alias history, and implementation status separately.
5. **Resolve dimensional policy before expanding types.** Specify how units map to physical dimensions, how angle is represented, and where explicit conversion is permitted.
6. **Submit D-051 for an owner decision.** Do not encode its provisional dual-binding semantics as canon before approval.
7. **Integrate one slice end-to-end.** Start with numeral → quantity AST → dimensional arithmetic → typed result → current CI tests. Do not include physical spell execution or mana feasibility in this slice.
8. **Keep blocked tests visible.** T-001–T-016 should move only when their prerequisites exist and the tests actually execute.

## Exit criteria for the next milestone

- Every accepted operator has a source-backed signature or is explicitly marked provisional.
- Surface parsing and audit notation are separate and clearly labelled.
- Ambiguous lexical cases fail closed with stable error identifiers.
- Parser AST conversion is tested and preserves units, binding identifiers, and control blocks.
- Dimensional operations have tests for same/different dimensions, multiply/divide exponents, division by zero, and unit-policy boundaries.
- Historical test claims are visibly distinguished from current CI.
- D-051 remains provisional unless explicitly approved.
- No parser/type-check success is represented as spell feasibility or canon conformance.
