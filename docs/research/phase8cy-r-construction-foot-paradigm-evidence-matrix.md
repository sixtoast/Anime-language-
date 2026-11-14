# Phase 8CY-R — Construction Foot paradigm evidence matrix

**Canon effect:** NONE. **Compiler effect:** NONE. **Execution:** NONE.

## Primary-source basis

The byte-verified Phase 4 document-body transcription states in §3.1 that the Construction Foot has the form frame + parameter vowel + relation coda. Table 2 describes the Construction inventory as six frame classes, six parameter vowels and five codas. Section 3.2 Table 3 records:
- TRAK: voiceless-stop frames p, t, k; discrete change.
- KREN: voiced-stop frames b, d, g; proposed reinforced counterpart, explicitly awaiting owner confirmation.
- FREM: relation codas m, n for open-loop maintenance; ng for maintenance with feedback.
- SHREN: relation codas s, sh for release.
- BRAN: h plus domain vowel; six H-series forms.
- VARE: soft-requirement modifier, not a Foot.

Phase 4 §3.2 labels parameter-vowel/property-family mappings provisional: a energy, u motion, o extent, e structure/form, i information, ə baseline. Phase 4 §4 Table 4 separately lists ten phonotactically legal codas. Only five have recovered Construction relation meanings.

## Matrix definition

The engine enumerates the 6 × 6 × 5 design space as 180 candidate records. Each combines a source-listed frame, a provisional parameter vowel and one of the five source-described relation codas.

This is a review space, not a lexical generator:
- every combination is marked `DESIGN-SPACE-ONLY`;
- lexical attestation is `NOT-RECOVERED`;
- individual frame-consonant meaning is `UNRESOLVED`;
- physical semantics are `NOT-DEFINED`;
- all records are non-executable.

The source gives the inventory dimensions and macro relationships, but does not provide a complete, independently attested 180-item lexicon in the recovered document body.

## Evidence retained

| Dimension | Recovered evidence | Remaining boundary |
|---|---|---|
| Frames | p, b, t, d, k, g | Individual consonant meanings unresolved |
| Parameter vowels | a, u, o, e, i, ə | Property families provisional |
| Relation codas | m, n, ng, s, sh | Mandatory/optional coda conflict remains |
| TRAK | p/t/k group | No individual frame semantics or macro signature |
| KREN | b/d/g proposed group | Owner confirmation outstanding |
| FREM | m/n open-loop; ng feedback | Mechanism, conditions and duration unresolved |
| SHREN | s/sh release | Target, mode and safety conditions unresolved |

BRAN's H-series coupling and VARE's modifier role remain separate from the Foot cross-product; they are not inserted as relation codas.

## Website and tests

The Construction Foot panel displays the matrix dimensions, total candidate-space size, group-level macro evidence, coda associations and the lookup result for the current input. It explicitly states that no candidate is lexically attested by this matrix.

Thirteen tests are authored and registered for candidate count/uniqueness, frame/vowel/coda coverage, macro group distinctions, coda meanings, unresolved semantics, provisional vowel families, exact lookup and non-execution. Tests are authored, not claimed as executed.

No GitHub Actions workflow is dispatched, no PR is merged and production is untouched.
