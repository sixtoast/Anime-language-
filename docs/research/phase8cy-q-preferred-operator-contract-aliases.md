# Phase 8CY-Q — Preferred operator spellings and semantic-contract lookup

**Canon effect:** NONE. **New spoken forms:** 0. **Grammar changes:** none. **Execution:** NONE.

## 1. The integration defect

Phase 4 §5.1 / D-032 and the Phase 5.5 alias registry establish six operator renames: FRAJA/FRATA, FRAMA/FRAKA, DRUM/DRIM, DRAS/DRAL, GRASH/GRAK and KWASH/KWAK. Phase 5.12 confirms the preferred forms and their aliases, while keeping signatures provisional or open.

The Phase 6G parser resolves an opted-in legacy spelling to the preferred spelling before producing its AST. The semantic analyser then performs exact contract lookup. Its contract table used only the older Phase 2 spellings, so a valid alias-normalised node such as FRAJA was incorrectly reported as an unknown operator.

This is a registry-integration gap, not evidence that the preferred operator is unknown or that its signature is settled.

## 2. Implementation

Added six explicit preferred-to-Phase-2 contract links in `operatorContracts.ts`. `getOperatorContract("FRAJA")` now returns a contract view whose operator identity remains FRAJA but whose arity status, null input/output types, dimensional rule, evaluation rule and open questions are inherited from the provisional FRATA record.

The lookup does not rewrite the AST or promote the Phase 2 proposal. REN→BEN is intentionally excluded because it is a lexical atom alias, not an operator alias.

## 3. Semantic effect

The analyser now distinguishes:
- **unknown operator:** no source-linked contract is known;
- **known operator, unresolved signature:** the preferred form is recognised through its documented alias link, but its signature and types remain incomplete.

For a parsed FRATA→FRAJA expression, the expected result is therefore `SEMANTIC_SIGNATURE_UNRESOLVED`, not `SEMANTIC_OPERATOR_UNKNOWN`. This is not semantic validation.

## 4. Tests and limits

Nine operator-contract tests and one semantic-analysis test are authored and registered. They check all six preferred mappings, retained legacy records, exclusion of REN from the operator map, alias provenance and preservation of unresolved signatures. The Phase 6G parser remains provisional; no executable type checking or physical feasibility is added.

Vercel's free daily deployment API quota has been exceeded (the API reported more than 100 deployments and a 24-hour retry window). GitHub Actions dispatch remains unavailable under the project's existing constraint. These tests have not been executed; preview verification must wait until deployment capacity returns.
