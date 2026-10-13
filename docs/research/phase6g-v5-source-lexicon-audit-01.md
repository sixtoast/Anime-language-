# Source lexicon audit — v5 draft and Phase 5.5 aliases

**Audit date:** 2026-10-13  
**Status:** source structure inspected; TypeScript audit/tests committed but fresh CI run not verified  
**Canon effect:** none

## Reviewed snapshots

| Source | Git blob SHA | Structurally valid records |
|---|---|---:|
| `Arcane_Lexicon_v5_draft.csv` | `2ec3b66ccdcecf517fa236ff06b88f1c5faaed96` | 255 |
| `Arcane_Alias_Registry_Phase_5_5.csv` | `beb38dabb2c5087119d58add1bd10bfe196d5662` | 7 |

The seven-column lexicon CSV and six-column alias CSV have consistent row widths under a quote-aware CSV scan. The previous suspicion that the source contains malformed-width rows came from a less reliable comma-splitting approach; it is not reproduced by the quote-aware scan. Do not expect a structural row-width diagnostic for this snapshot.

## Registry results

- 255 lexicon records are structurally valid.
- 249 records are accepted as single-token lexical forms by the current registry filter.
- 247 distinct single-token forms remain after grouping.
- Six records are filtered because the registry currently excludes multiword/editorial forms. These are not deleted from the CSV; the registry's diagnostics should make this filtering visible.
- Seven explicit historical alias records are loaded.
- All seven alias targets exist among the accepted lexical forms.
- Two lexical collisions are detected:
  - `re`: digit `4` / `DIGIT` and `TARGET-surface` / `FUSED-REF`.
  - `ra`: radian / `UNIT` and `TARGET-path` / `FUSED-REF`.

The collision classes and glosses are retained rather than collapsed into a single guessed meaning. This audit does not define the contextual grammar required to disambiguate them.

## Alias inventory

| Legacy form | Preferred form | Source decision |
|---|---|---|
| `frata` | `fraja` | Phase 4 §5.1; D-032 |
| `fraka` | `frama` | Phase 4 §5.1; D-032 |
| `drim` | `drum` | Phase 4 §5.1; D-032; D-017 |
| `ren` | `ben` | Phase 4 §5.1; D-032 |
| `grak` | `grash` | Phase 4 §5.1; D-032 |
| `kwak` | `kwash` | Phase 4 §5.1; D-032 |
| `dral` | `dras` | Phase 4 §5.1; D-032 |

These are explicit compatibility records. Their existence does not mean old spellings should be accepted in every language version or context. Parser alias normalisation remains opt-in.

## Known limitations / next acceptance gates

1. Registry filtering is currently simple: forms with spaces, forms ending in a hyphen, and forms starting with an opening parenthesis are excluded. Review all six excluded rows and decide whether to model them as metadata/editorial records rather than silently treating them as ordinary vocabulary.
2. Alias evidence in the preferred lexicon rows is not currently relied upon for this snapshot; the seven explicit alias-registry rows are the authoritative alias input to this loader.
3. The parser only uses the registry for atomic lexical lookup and explicit alias normalisation. It does not implement a full lexical-class grammar, semantic type checking, execution, or physical feasibility.
4. The audit report's “ready for parser experiment” flag is structural only, not a language approval or production-readiness claim.
5. Run CI, Vitest, TypeScript checking, and the Vite build, then attach actual run evidence before marking tests passed.
