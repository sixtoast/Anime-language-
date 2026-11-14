# Phase 8BM — Construction expression evidence composition

**Status:** implementation authored; tests not executed in this environment  
**Canon effect:** NONE · **Execution:** disabled

## Purpose

Phase 8BM introduces a common evidence container for a Construction expression review. It brings the seven recovered stage labels into one record while retaining the distinction between documentary evidence and a recovered grammar. The model is an evidence index, not a parser, compiler, spell validator, feasibility checker or execution engine.

## Composition structure

A composition record contains a stable review identifier, an optional exact surface fixture with its own version and source, and seven stage-keyed evidence arrays: reference, spatial-role/vector, Construction Feet, couplings, quantity, control and release.

Each evidence record retains its own status, source, version, claims, unresolved questions and optional note. Arrays deliberately preserve multiple source records without deciding whether the language permits one, many or no instances of a stage. An empty array means only that the current review record has no attached evidence for that stage.

## Evidence states

- `RECORDED`: supplied as recorded evidence; this module does not independently authenticate it.
- `PARTIAL`: explicitly marked partial.
- `UNRECOVERED`: preserves an unresolved source area.
- `NO-RECORD`: no record is attached to that stage in this composition.

The review reports counts and gaps. It does not return "valid", "complete" or "executable".

## Historical fixture boundary

The Phase 5.22 hand-flame surface may be stored as an exact, version-tagged fixture. The six phrase groups are not mapped one-to-one onto the seven performed Construction stages. The missing explicit Control phrase remains a known mismatch, not a reason to invent a seventh phrase or a stage mapping.

The fixture string is retained as data only. No delimiter, token or phrase semantics are newly inferred here.

## Preserved boundaries

- Six recovered adjacent stage relationships remain PRECEDES-only.
- Interface input/output, attachment, cardinality, omission and failure behaviour remain unresolved.
- Stage cardinality and data dependencies remain NOT-ESTABLISHED.
- The Phase 5.22 spatial fixture and v3.0-L spatial inventory remain version-separated.
- Foot morphology, H-series coupling contracts and KAN/KEN/KAS segmentation remain unresolved as previously documented.
- No Incantation contract fields are conflated with Construction stages.

## Website

The Construction Studio gains a Phase 8BM composition panel showing the seven stage slots and a blank review template. Empty slots are described as unpopulated review records, not as absent or optional grammar stages.

## Verification

Six stable test IDs are authored: CON-COMP-001 through CON-COMP-006. They cover stage slots, provenance, multiple records, dependency boundaries, versioned fixture retention and non-execution.

The same commit repairs two TypeScript issues discovered in the Phase 8BL Vercel build:
1. Spatial-evidence tests now narrow the discriminated union by profile ID before reading profile-specific fields.
2. The six-dimension interface tuple retains its literal length type, matching the review result contract.

Tests are not claimed as passing until a fresh preview build confirms them.

## Explicit non-goals

This phase does not define Construction grammar, stage syntax, required/optional status, cardinality, repetition, cross-stage bindings, semantic interfaces, physical outcomes, parser behaviour or execution.
