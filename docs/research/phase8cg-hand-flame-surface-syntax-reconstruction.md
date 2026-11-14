# Phase 8CG — Hand-flame surface syntax reconstruction

**Date:** 2026-11-14  
**Canon effect:** NONE · **Grammar changes:** none · **Tests authored:** SURFACE-CG-001–014  
**Tests executed:** not executed locally

## 1. Objective

Reconstruct the exact surface structure recoverable from the archived hand-flame example without claiming to have recovered the general Construction grammar.

## 2. Recovered surface

`mel · po da za shi to za ma · kan ken · he ha · sa shi za se · kas`

The archived fixture preserves six dot-delimited phrases. Within those phrases, the recorded whitespace-separated units are:

| Phrase | Surface | Whitespace units | Evidence |
|---:|---|---|---|
| 1 | `mel` | mel | Partial interpretation |
| 2 | `po da za shi to za ma` | po, da, za, shi, to, za, ma | Fixture interpretation recorded |
| 3 | `kan ken` | kan, ken | Partial interpretation |
| 4 | `he ha` | he, ha | Partial interpretation; domain readings provisional |
| 5 | `sa shi za se` | sa, shi, za, se | Unresolved |
| 6 | `kas` | kas | Partial interpretation |

The total is 16 whitespace units across six phrases. These are surface tokens/units for this fixture only. This count does not prove that each unit is an independent lexical morpheme.

## 3. Boundary decisions

- The literal middle-dot plus surrounding spaces (` · `) is preserved as the phrase separator for this exact source example.
- A literal space is used to reproduce the archived phrase-local token grouping.
- No unit is split into consonant/vowel/coda parts by this recogniser.
- No token is assigned a new gloss or lexical class.
- No phrase is assigned to one of the seven performed Construction stages.
- No general-purpose delimiter or token grammar is inferred.

## 4. Evidence retention

The implementation uses `constructionFixtureTraceability.ts` as its phrase evidence source and `constructionHandFlameEvidence.ts` for the exact source sequence. The statuses are retained unchanged:
- phrase 1: PARTIAL-INTERPRETATION
- phrase 2: INTERPRETATION-RECORDED
- phrase 3: PARTIAL-INTERPRETATION
- phrase 4: PARTIAL-INTERPRETATION
- phrase 5: UNRESOLVED
- phrase 6: PARTIAL-INTERPRETATION

This preserves the difference between an archived fixture parse and a general grammatical rule.

## 5. Implementation

Added `src/engine/handFlameSurfaceSyntaxReconstruction.ts`:
- accepts only the exact recovered surface;
- returns six phrase records and their whitespace units;
- preserves source evidence references, claims and unresolved fields;
- returns mismatch for altered delimiter, token order or unrelated strings;
- does not perform morphology, semantic completion, stage mapping or execution.

## 6. Tests

Fourteen tests are authored and registered as SURFACE-CG-001–014. They cover exact reconstruction, delimiter and phrase preservation, phrase-local whitespace tokenisation, evidence-status retention, rejection of changed input and explicit non-generalisation. Tests have not been executed locally.

## 7. Conclusion and next source requirement

This phase recovers a bounded surface template, not a productive syntax. The next useful grammar work requires more than one independent Construction example or complete original Phase 4 §3/§8 material, including any explicit token boundary, phrase formation and attachment rules. Until then, the six-phrase hand-flame fixture is the only safe surface grammar profile.

**Decision ID:** P8CG-HAND-FLAME-SURFACE-01 · **Canon effect:** NONE
