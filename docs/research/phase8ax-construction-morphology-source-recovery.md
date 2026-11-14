# Phase 8AX — Construction morphology and direct source recovery

**Status:** source recovery advanced; productive morphology remains unresolved.  
**Canon effect:** none. **New vocabulary:** none. **Executable grammar:** none.  
**Tests authored:** CON-FOOT-SRC-001–010. **Tests executed locally:** none.

## 1. Source discovery and correction to the earlier recovery record

The repository contains the complete standalone source file:

- Path: `sources/originals/arcane_phase_5_22_parser.py`
- Git blob SHA: `e6202bdf9a3c726e4103aece1ba711a287d5899d`
- Retrieved source length: 8,612 characters.

This is a bounded Phase 5.22 parser for the single documented hand-flame Construction profile. It requires six middle-dot-delimited phrases, validates the exact fixture profile and explicitly states that it is not a general Arcane parser and performs no physical feasibility assessment.

This corrects the earlier shorthand that the Phase 5.22 parser was available only through archive-index excerpts. The full Phase 5.22 parser source is directly present in `sources/originals/` and has now been inspected. It does **not** replace the still-uninspected binary Phase 4 DOCX or recover the missing complete v2.0 morphology specification.

The Phase 4 DOCX remains present as a 27,027-byte binary source. The GitHub file reader can retrieve its base64 representation, but the current inspection environment did not provide a reliable DOCX decoding path. Therefore no claim is made that the full Phase 4 document body or its tables were read in this phase.

## 2. What the standalone Phase 5.22 parser actually says

Its source-level tables record:

| Whole token | Parser's example-level association | What is not established |
|---|---|---|
| `kan` | `TRAK ENRA` | Segment meanings, productive Foot semantics, complete macro signature |
| `ken` | `FREM / structure held` | Segment meanings, general maintain rule, termination semantics |
| `kas` | `SHREN / release` | Segment meanings, general release rule, target and safety semantics |

All three spellings have a CVC orthographic shape:
- `kan` → k-a-n
- `ken` → k-e-n
- `kas` → k-a-s

These are observations about the written forms only. The parser stores them as whole tokens and does not split them into frame consonant, parameter vowel and relation coda. The observed final letters `n` and `s` therefore do not establish the complete coda inventory, nor do they establish independent meanings for either letter.

The shared initial `k` does not establish a productive common frame meaning. The `a/e` vowel difference does not establish an executable parameter contrast. The three aliases must not be expanded into segmental definitions.

## 3. Reconciled morphology evidence

| Layer | Recovered evidence | Status |
|---|---|---|
| Frame consonants | p, b, t, d, k, g | Source-backed inventory |
| Canonical CV frame forms | pa, ba, ta, da, ka, ga | Source-backed frame forms; not complete Feet |
| Parameter vowel families | a energy; u motion; o extent; e structure/form; i information; ə baseline | Provisional |
| Relation position | final coda position in the CVC account | Structural statement |
| Relation-coda inventory | n and s occur at the ends of the three observed example tokens | Incomplete; no full inventory or mapping |
| CVC vs optional coda | Phase 5.15 says CVC; Phase 5.16 C-02 says optional relation coda | Unresolved conflict |
| KAN/KEN/KAS | whole-token example aliases | Partial example evidence |

No frame-consonant semantic contrasts are recovered. No productive frame × vowel × coda combinations are licensed by the available evidence. The six CV forms cannot be treated as complete Feet simply because they are valid frame forms.

## 4. Phase 5.21 / 5.22 boundary

Phase 5.22 source is a phrase-tree parser for one exact fixture. It requires:
1. anchor token `mel`;
2. a position role, axis and metre-closed quantity;
3. exactly `kan ken`;
4. exactly `he ha`;
5. a second-closed duration quantity;
6. final `kas`.

It also contains fixture-local digit, unit, axis, role and coupling tables. These are not general Construction morphology rules. Phase 5.21's lexical-slot validator remains a distinct earlier validation layer; its token grouping is not to be collapsed into the Phase 5.22 phrase tree.

## 5. Implementation

Added `src/engine/constructionFootSourceRecovery.ts`:
- records the direct source file identity and bounded parser scope;
- records the six CV frame forms and six provisional vowel families;
- captures KAN/KEN/KAS as whole-token evidence;
- distinguishes canonical CV frame forms, observed whole-example tokens, unresolved CVC-shaped forms and unsupported inputs;
- does not infer segment meanings or coda membership from shape;
- keeps the Phase 5.15 / 5.16 discrepancy open;
- remains non-executable and canon-neutral.

The Construction Studio now displays the three observed CVC-shaped whole tokens and a source-form lookup. This is an evidence inspector, not a Foot grammar parser.

Ten tests are authored and registered as CON-FOOT-SRC-001–010. They have not been run in this session. No local unit test, browser acceptance test or physical simulation is claimed.

## 6. Next source-recovery requirement

The next decisive source task is to inspect the full Phase 4 original DOCX and its relevant tables/sections, then compare them with the indexed DOCX-derived and TXT-derived archive transcriptions. The current binary-reader limitation prevents claiming that comparison is complete. The missing relation-coda inventory and frame semantic contrasts remain unresolved until authoritative source material is recovered or the owner explicitly approves a new versioned replacement design.

## 7. Safety and deployment

Feature branch only. No GitHub Actions were dispatched. Main and production remain untouched. Vercel preview build is the deployment verification path; tests remain authored-unverified unless separately executed.
