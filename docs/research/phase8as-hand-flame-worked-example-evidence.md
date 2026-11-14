# Phase 8AS — Hand-flame worked-example evidence map

**Date:** 2026-11-14  
**Canon effect:** none. **Grammar/parser changes:** none. **Execution:** none.  
**Tests:** 14 authored; not executed in this environment.

## Exact source sequence

`mel · po da za shi to za ma · kan ken · he ha · sa shi za se · kas`

The sequence is represented as six source groups and 18 tokens. These are the source's displayed groupings, not inferred grammar stages.

## Evidence map

| Source group | Evidence | What can be said | What remains unknown |
|---|---|---|---|
| `mel` | Example-backed | Phase 5.15 records `mel = me + anchor coda l`, with MI surface scope anchored to the hand | General landmark system, anchor-coda inventory and productive rule |
| `po da za shi to za ma` | Unresolved | Exact token run appears in the example | Token semantics, Foot segmentation and spatial binding |
| `kan ken` | Partial example | `ken` is associated with held-energy state | KAN rule, KEN general signature, target, magnitude and termination |
| `he ha` | Partial example | Both are H-series heavy coupling syllables | Physical mapping, coupling order, participants, vector, magnitude and cost |
| `sa shi za se` | Unresolved | Exact token run appears in the example | Token semantics, Foot segmentation and spatial binding |
| `kas` | Partial example | KAS is associated with release; SHREN is macro-glossed Release | Whether KAS expands SHREN, general release signature, target and safety conditions |

## Reference finding: MEL

The Phase 5.15 matrix specifically states that the example's `mel` is `me` plus anchor coda `l`, and that the MI surface scope is anchored to the hand. This is stronger than merely seeing the spelling in the sequence, but it is still one example. It does not establish:
- a general productive rule for attaching `l`;
- a complete anatomical landmark vocabulary;
- the geometry or boundary of a surface;
- whether other anchors use the same morphology;
- that the reference is sensed, reachable, feasible or manipulated.

The existing runtime reference context supports `me` as SELF-SURFACE and MI/NI/RI as DEFAULT-VOLUME, but it does not parse `mel` or implement an anchor-coda system. The two representations remain distinct until the source grammar is recovered.

## Structural interpretation boundary

The example's six groups are preserved as source grouping. This model does not map the two unparsed runs to Construction Feet, assign the sequence to the seven performed stages, or infer that each group is a syntactic constituent. It only records what the source matrices explicitly say.

The source matrix states that tokenisation was checked, but the whole-spell parse and feasibility were not. It also says energy magnitude, extent and matter-coupling parameters are unspecified. The example therefore cannot be presented as an executable hand-flame recipe.

## Implementation

Added:
- `src/engine/constructionHandFlameEvidence.ts`
- `src/engine/constructionHandFlameEvidence.test.ts`
- Research & Review entry 10
- Central test-registry cases CON-HF-001–014
- This research record

The audit function accepts the exact recorded sequence and returns the evidence groups, token/segment counts, evidence counts and explicit limitations. It is a display/audit helper only.

## Verification

Fourteen Vitest cases are authored but not executed. No local test, browser test or build is claimed by this document. No canon, parser, physical semantics or execution behaviour changed.
