# Anime Language Workbench

A version-controlled workspace for documenting, testing, reviewing, and researching the Anime language and its magic system.

## Project goals

- Keep canonical language rules distinct from provisional audit findings and open questions.
- Provide a searchable documentation space with traceable sources and version history.
- Build a playground backed by real lexical, syntactic, and semantic checks as the specification permits.
- Maintain a regression suite for valid expressions, invalid expressions, ambiguity cases, and expected diagnostics.
- Keep research notes and review decisions linked to the rules they affect.

## Development principles

1. The canonical specification is authoritative. The application must not invent grammar or semantics to make an example appear to work.
2. Provisional audit findings do not silently modify canonical rules.
3. Preserve historical names and forms as aliases unless evidence establishes an inconsistency.
4. Every implemented language rule should have tests and traceable documentation.
5. Keep the language engine independent from the user interface.
6. Prefer small, reviewable changes and automated checks.

## Planned stack

The initial proposal is React, TypeScript, and Vite, with Vitest for automated tests. This can be adjusted before implementation if repository needs change.

## Status

The initial React + TypeScript + Vite interface is in place. The supplied Magic System v3.0, Arcane v3.0-L, Phase 2 audit, and continuity/test register have been committed under `docs/`. The documentation catalogue links to those source documents.

The language engine is **not yet implemented**. The 16 tests in the recovery register are defined test proposals, not executable fixtures; zero are recorded as executed. The playground does not yet parse, validate, or execute Arcane expressions. A successful local build and CI run have not yet been verified.

## Source of truth and audit boundaries

- `docs/canon/magic-system-v3.0.md` — supplied canonical magic-system specification.
- `docs/canon/arcane-language-v3.0-L.md` — supplied canonical language specification.
- `docs/audits/phase-2-formal-syntax.md` — provisional audit notation and proposed signatures/tests.
- `docs/audits/continuity-recovery-and-test-register.md` — continuity gaps, decision ledger, change-control principles, and test register.

Do not treat Phase 2 angle brackets/commas as established spoken Arcane. Do not infer missing v2.0 morphology, h coupling, MEL anchoring, or KAN/KEN/KAS rules. Canon status, implementation status, and test evidence must remain separate.
