> **Scope clarification (2026-10-13):** This file is a historical mixed roadmap. Its language-engine phases are retained as project history, not as active instructions for the current website workstream. The active, authoritative website task list is [`WEBSITE-MASTER-IMPLEMENTATION-PLAN.md`](WEBSITE-MASTER-IMPLEMENTATION-PLAN.md). Current website work must not modify Arcane canon, vocabulary, grammar, parser/engine behaviour, operator semantics, or spell mechanics unless the owner explicitly changes that scope.

# Implementation roadmap

## Phase 0 — project foundation

- [x] Establish project direction and specification-first principles.
- [x] Create the initial React + TypeScript + Vite application shell.
- [ ] Verify a successful dependency install, test run, and production build from CI logs or a reproducible local run.
- [x] Add CI workflow for type-checking, tests, and builds (execution status must be verified separately).

## Phase 1 — source-of-truth documentation

- [x] Import the supplied Magic System v3.0 specification into `docs/canon/magic-system-v3.0.md`.
- [x] Import the supplied Arcane v3.0-L specification into `docs/canon/arcane-language-v3.0-L.md`.
- [x] Record the Phase 2 audit separately as provisional material.
- [x] Add the continuity recovery, decision ledger, open gaps, and 16-test register.
- [x] Connect the documentation catalogue to the recovered source documents.
- [x] Create a structured, machine-readable rule catalogue; [ ] continue attaching precise source-section references to each individual rule.
- [ ] Recover the exact Phase 4 source text and any available v2.0 morphology source; do not reconstruct missing rules from memory.
- [x] Record recovered rule IDs and statuses in machine-readable form; [ ] complete alias, history, and approval metadata.

## Phase 2 — language engine

- [ ] Define the audit-notation grammar separately from spoken/written Arcane surface grammar.
- [ ] Define the canonical type inventory and dimensional algebra before enforcing quantity compatibility.
- [ ] Resolve grouping, nesting, modifier scope, and explicit relation encoding using source-backed decisions.
- [ ] Implement token and syntax-tree data types.
- [ ] Implement a lexer with tests.
- [x] Implement a small parser for the explicitly provisional Phase 2 audit notation.
- [ ] Implement safe rejection for missing/extra arguments and ambiguous input.
- [ ] Implement semantic validation only where rules are sufficiently specified.
- [x] Connect the playground to parse trees and diagnostics, with the audit-notation mode clearly labelled.
- [x] Add nine focused parser test cases; their execution still needs CI/local evidence.

## Phase 3 — quality and research

- [ ] Create fixture format for valid, invalid, ambiguous, and unresolved examples.
- [ ] Add regression tests and source-rule traceability.
- [ ] Build a test explorer showing actual test results.
- [ ] Build research records for claims, evidence, alternatives, decisions, and change history.

## Guardrails

- Never invent grammar or semantic behaviour to populate the interface.
- Never present planned tests as executed tests.
- Never promote provisional audit findings to canonical status without an explicit decision.
- Preserve old names as aliases unless an inconsistency is demonstrated.
- Keep UI code separate from the language engine.
