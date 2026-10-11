# Implementation roadmap

## Phase 0 — project foundation

- [x] Establish project direction and specification-first principles.
- [x] Create the initial React + TypeScript + Vite application shell.
- [ ] Install dependencies and run a production build in a local environment or CI.
- [ ] Add CI for type-checking, tests, and builds.

## Phase 1 — source-of-truth documentation

- [x] Import the supplied Magic System v3.0 specification into `docs/canon/magic-system-v3.0.md`.
- [x] Import the supplied Arcane v3.0-L specification into `docs/canon/arcane-language-v3.0-L.md`.
- [x] Record the Phase 2 audit separately as provisional material.
- [x] Add the continuity recovery, decision ledger, open gaps, and 16-test register.
- [x] Connect the documentation catalogue to the recovered source documents.
- [ ] Attach precise source-section references to each individual rule and build a structured rule catalogue.
- [ ] Recover the exact Phase 4 source text and any available v2.0 morphology source; do not reconstruct missing rules from memory.
- [ ] Record status, aliases, history, and approval metadata in machine-readable form.

## Phase 2 — language engine

- [ ] Define the audit-notation grammar separately from spoken/written Arcane surface grammar.
- [ ] Define the canonical type inventory and dimensional algebra before enforcing quantity compatibility.
- [ ] Resolve grouping, nesting, modifier scope, and explicit relation encoding using source-backed decisions.
- [ ] Implement token and syntax-tree data types.
- [ ] Implement a lexer with tests.
- [ ] Implement a parser for the explicitly provisional Phase 2 audit notation.
- [ ] Implement safe rejection for missing/extra arguments and ambiguous input.
- [ ] Implement semantic validation only where rules are sufficiently specified.
- [ ] Connect the playground to real analysis output and show the notation mode being parsed.

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
