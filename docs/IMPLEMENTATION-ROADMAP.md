# Implementation roadmap

## Phase 0 — project foundation

- [x] Establish project direction and specification-first principles.
- [x] Create the initial React + TypeScript + Vite application shell.
- [ ] Install dependencies and run a production build in a local environment or CI.
- [ ] Add CI for type-checking, tests, and builds.

## Phase 1 — source-of-truth documentation

- [ ] Import verified canonical specification text, preserving its exact version and section structure.
- [ ] Attach source references to every documented rule.
- [ ] Record status, aliases, history, and approval metadata.
- [ ] Separate canonical content from provisional audit notes and open questions.

## Phase 2 — language engine

- [ ] Derive a formal grammar from verified specification evidence.
- [ ] Implement token and syntax data types.
- [ ] Implement a lexer with tests.
- [ ] Implement a parser with explicit error recovery and ambiguity handling.
- [ ] Implement semantic validation only where rules are sufficiently specified.
- [ ] Connect the playground to real analysis output.

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
