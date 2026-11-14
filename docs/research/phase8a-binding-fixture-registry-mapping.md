# Arcane Phase 8A — binding fixture traceability to the existing test registry

**Status:** Research mapping only; no application files changed  
**Date:** 2026-10-15  
**Canon effect:** none  
**Tests executed:** none

## 1. Finding

Inspection of the current repository shows that `src/engine/testRegistry.ts` defines `WorkbenchTest` with the fields `id`, `group`, `title`, `description`, `status`, `file`, and `sourceRule`. The available groups are Parser, Dimensions, Semantic types and Operator contracts. Its status values are `authored-unverified` and `blocked-by-specification`.

The parser implementation in `src/engine/auditParser.ts` explicitly supports provisional Phase 2 mathematical audit notation, with registered arities for arithmetic/vector operators. It does not currently register KWAM, KWAT or KWAK in that parser's arity table. Its own header says it is not a parser for spoken or ordinary written Arcane. Therefore, binding examples must not be submitted to this parser as if supported, and absence from its arity table does not mean those canonical operators are invalid.

The repository also has `src/engine/canonAuditRegistry.ts`, which records binding creation/reference/live evaluation as blocked by specification and lists the missing scope, lifetime, mutability and timing rules. The fixture audit `src/engine/phase6gFixtureAudit.ts` records observations for its own supported surface parser; it is not evidence that a binding semantic evaluator exists.

## 2. Mapping Phase 7Z tests to current registry shape

This is a proposal for future registry entries, not a patch to the application. `file` below means a proposed future test module, not an existing file.

| Proposed ID | Group | Status | Reason |
|---|---|---|---|
| BIND-001 | Operator contracts | blocked-by-specification | Binding evaluation policy is not selected |
| BIND-002 | Operator contracts | blocked-by-specification | Scope/lifetime rules are absent |
| BIND-003 | Operator contracts | blocked-by-specification | Unknown-identifier failure contract is not canonical |
| BIND-004 | Operator contracts | blocked-by-specification | Duplicate declaration and shadowing policy unresolved |
| BIND-005 | Operator contracts | blocked-by-specification | KWAT/KWAK evaluation distinction needs complete semantics |
| BIND-006 | Semantic types | blocked-by-specification | Binding result typing and invalid-expression behaviour unresolved |
| BIND-007 | Parser | blocked-by-specification | KWAM/KWAT are not registered in the Phase 2 audit parser; grammar approval required before parser test |
| BIND-008 | Operator contracts | blocked-by-specification | Symbolic binding must not be interpreted as physical causation |

The current `WorkbenchTest` type does not have structured fields for fixture input, expected AST, observed AST, semantic result, source strata or confidence. Those details should remain in a dedicated fixture dossier until an approved test schema supports them. Do not overload `description` with machine-readable payloads.

## 3. Candidate registry descriptions

The following are candidate descriptions compatible with the current type, not committed source entries:

- **BIND-001:** “Reject semantic execution until the binding evaluation policy is specified; declaration alone must not imply eager or live evaluation.”
- **BIND-002:** “Reject resolution claims when the binding environment and lifetime are unspecified.”
- **BIND-003:** “A future unresolved-reference contract must return an explicit failure/unknown result rather than guessing a value.”
- **BIND-004:** “Duplicate identifiers require an explicit rejection, rebinding or shadowing rule; do not assume one.”
- **BIND-005:** “Keep KWAT reference and KWAK live evaluation distinct; exact timing remains blocked pending a version-scoped contract.”
- **BIND-006:** “Do not claim binding result type checking until expression and binding types are defined.”
- **BIND-007:** “Do not pass binding expressions to the Phase 2 parser and call them supported while their arities are absent from its registry.”
- **BIND-008:** “A binding operation changes symbolic state only; no physical effect follows without a separately specified mechanism.”

For each proposed entry, `sourceRule` should cite the relevant language rule and dossier ID rather than imply that the test has been executed.

## 4. Status semantics

- `blocked-by-specification` is the correct status when a normative decision is missing.
- `authored-unverified` is appropriate only after a test is actually authored against a defined contract but before its result is verified.
- A passing syntax parse cannot establish semantic validity, physical feasibility or casting success.
- A documentation-only semantic prompt is not an executable test.

## 5. Immediate language-development consequence

The repository infrastructure can track binding gaps, but it cannot settle the language design. The next productive language decision remains the binding contract itself. A reviewable first choice is:

1. keep identifier placeholders abstract in research fixtures;
2. leave evaluation mode and scope unselected until source evidence or an explicit design decision resolves them;
3. specify that a future unresolved-reference outcome must be explicit and non-guessing;
4. only then draft formal binding constructions in the notation actually accepted by the relevant tool.

This deliberately avoids changing the website or implying it already implements binding semantics.

## 6. Provenance and limitations

Files inspected:
- `src/engine/testRegistry.ts`
- `src/engine/canonAuditRegistry.ts`
- `src/engine/phase6gFixtureAudit.ts`
- `src/engine/auditParser.ts`
- `docs/research/phase7z-binding-semantics-decision-proposal.md`

No application source was modified. No test command was run. This document reports source inspection, not runtime behaviour beyond what the source itself declares.
