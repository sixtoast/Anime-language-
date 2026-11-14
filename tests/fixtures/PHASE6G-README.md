# Phase 6G Surface-Parser Recovery Fixtures

File: `phase6g-surface-parser-cases.json`

## Status

These are source-derived review fixtures. They are **not yet executed by the current TypeScript workbench**, and their presence does not change canon. They are intended to preserve the recovered Phase 6G prototype's boundaries and guide an explicit adapter/test implementation.

## Why a separate fixture suite?

The current TypeScript `parseAuditExpression` handles provisional Phase 2 audit notation such as `FRAPA⟨KI, FRAPA⟨TO, MU⟩⟩`. The archived Phase 6G parser handles whitespace-tokenised, fixed-arity surface-like forms and uses unit-closed numerals and `METO … DOGU` blocks. Treating those as one grammar would hide an important incompatibility.

## Evidence and test discipline

Each fixture has a stable ID, category, expected outcome, evidence note and canon-status label. Several examples are deliberately marked conditional because their complete operator signatures or exact operand forms need verification against the recovered parser source before they become executable golden tests.

Before wiring this JSON into Vitest:

1. Implement or port the Phase 6G parser behind a separately named API.
2. Validate every example against the archived script and report; revise questionable input examples with a recorded rationale.
3. Separate parser expectations from type, evaluation and feasibility expectations.
4. Execute the suite in current CI and record actual per-case results.
5. Never count a fixture definition as a passing test, or historical prototype results as current CI evidence.

## Current evidence links

- [Recovered Phase 6G report](../../sources/archive-reports/phase-audit-extracts/ARCANE_PHASE_6G_SURFACE_PARSER.md.extracted.txt)
- [Recovered Phase 6G script](../../sources/archive-reports/phase-audit-extracts/arcane_phase6g_surface_parser.py.extracted.txt)
- [Full audit and integration recommendations](../../docs/research/phase-6g-and-binding-audit.md)
