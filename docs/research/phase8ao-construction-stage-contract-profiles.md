# Phase 8AO — Construction stage contract profiles

**Date:** 2026-11-13  
**Canon effect:** none. **New grammar:** none. **Execution:** none.  
**Tests:** CON-STAGE-001–011 authored-unverified; no local test run claimed.

## Purpose

Move beyond a stage-order list by recording, for each of the seven performed stages, what is actually known about its contract, what remains unknown, and whether any input/output or cross-stage binding is evidenced. This is an evidence profile, not a proposed executable grammar.

## Source boundary

Historical Construction order and morphology are sourced to Phase 4 §3.3 and the Phase 5.15/5.16 matrices. The canonical Arcane v3.0-L spatial inventory is a separate versioned source. Its FE, axis, relation and geometry labels must not be silently treated as the historical Phase 4 Construction stage syntax or argument signature.

## Stage-by-stage profiles

### 1. Reference — partial contract recovered

- MI/NI/RI use DEFAULT-VOLUME scope; me is described as SELF-SURFACE.
- Persistence is UNTIL-REPLACED; a missing replacement preserves the active binding and a valid replacement replaces it.
- The runtime reference-context guard represents token, reference identity, scope and persistence, but its referenceId is an implementation metadata field, not recovered spoken identifier syntax.
- Not recovered: anatomical landmarks, surface boundaries, identifier syntax, reference identity semantics, sensing, reachability or transformations.
- No source-backed rule binds this context to a spatial value, Foot or coupling.

### 2. Spatial role / vector — order-backed, internal contract open

- Phase 4 §3.3 places this stage after reference and before Feet.
- The inspected historical Construction matrices do not establish its input/output signature, surface syntax, frame binding or reference consumption.
- Arcane v3.0-L separately records FE; signed axes PA/BA/TA/DA/KA/GA; relations JO/JUR/JA/JE/JI; and geometry PI/LEN/PLA/SUR/VOM/PAR.
- Those v3.0-L labels are useful related spatial inventory, but they are not proof of historical Phase 4 tokens, arguments, or stage interfaces.
- PO/FO/LO signatures and role/relation composition remain unresolved in the spatial audit records.

### 3. Construction Feet — partial shape only

- Phase 5.15 records CVC = frame + parameter vowel + relation coda; six frame consonants and canonical CV frame forms are known.
- Phase 5.16 C-02 describes an optional coda. The conflict remains unresolved.
- Productive semantics, individual frame meanings, parameter-vowel meanings, full coda inventory and output type remain open.
- No complete binding to reference, spatial role, coupling or quantity is recovered.

### 4. Couplings — gloss/family evidence only

- Six h + domain-vowel forms are recorded: hə/he/ha/hu/hi/ho, with glosses mana/matter/energy/living/information/field.
- Domain mappings and physical mappings are provisional; argument signature, participant order, direction, validity, resource cost and output type remain unresolved.
- No recovered rule specifies how a coupling attaches to one or more Feet.

### 5. Quantity — order only

- Quantity is named after couplings and before control.
- The inspected Construction records do not define its syntax, units, input/output type, scope, attachment, aggregation or conversion semantics.
- Do not assume it modifies a Foot, coupling or whole configuration.

### 6. Control — order only

- Control is named after quantity and before release.
- Its Construction-specific vocabulary, syntax, input/output type, transition conditions, failure and interruption behaviour are not recovered.
- VARE is separately described as a soft-requirement modifier paired with REQUIRE; it is not assigned to this stage without direct evidence.

### 7. Release — partial example only

- The hand-flame example contains kas; Phase 5.15 associates SHREN with release as partial example evidence.
- A general release signature, target, mode, consumed prior-stage result, safety condition or post-release state is not recovered.

## Implementation

Added src/engine/constructionStageContractProfiles.ts with seven immutable stage profiles, explicit contract statuses, unresolved items and a non-executable boundary. Added an exact stage lookup that rejects unknown/non-string values.

Construction Studio now displays the profiles and makes the v3.0-L spatial inventory version boundary explicit. Added CON-STAGE-001–011 to the central test registry.

## Decision

Do not implement a Construction compiler from these profiles. The next useful increment is to recover original Phase 4 DOCX text through a document-aware path or, if unavailable, prepare a single owner-reviewable replacement-specification decision package. Do not repeat the same spatial inventory work or infer interfaces from stage order.
## Build correction record

The first Vercel build for the Phase 8AO implementation (`580439c`) failed at `tsc --noEmit` because the inferred union type did not expose `versionBoundary` on profiles where that optional field was omitted. The profile data was normalised in follow-up commit `47c5b1877dcba2405044a6af67976d4fb42b88d8` by adding an explicit `versionBoundary: null` to records without a special boundary. This correction is committed; the replacement deployment was still building at the time of this record update, so its successful build is not yet claimed.
### Follow-up correction

The first field-normalisation patch (`47c5b18`) inserted the nullable field with malformed punctuation in the TypeScript object literals. The source was rewritten cleanly in `3afc5dca36a67d618e2a85c2ba30233f52882d62`, with `versionBoundary` explicitly present on every profile and valid object syntax. The initial Vercel TypeScript failure is recorded above; this rewrite is the actual source correction. A successful build for the corrected commit remains pending confirmation.