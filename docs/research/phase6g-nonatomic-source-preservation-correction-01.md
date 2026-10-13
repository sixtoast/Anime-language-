# Correction: preserve non-atomic lexicon entries

**Date:** 2026-10-13  
**Canon effect:** none

A follow-up review found that the six non-atomic rows in the v5 lexicon are legitimate source entries, not malformed records. The registry has therefore been changed to retain them in a dedicated `nonAtomicEntries` inventory rather than dropping them.

| CSV line | Form | Class | Source interpretation |
|---:|---|---|---|
| 24 | `MI (formal)` | REF | SELF, unscoped; note says it performs as `mə` |
| 25 | `NI (formal)` | REF | FIELD, unscoped; note says it performs as `nə` |
| 26 | `RI (formal)` | REF | TARGET, unscoped; note says it performs as `rə` |
| 137 | `s-` | CLITIC | IF, clitic form of `bek`; performed only |
| 138 | `sh-` | CLITIC | WHILE, clitic form of `zet`; performed only |
| 139 | `f-` | CLITIC | UNTIL, clitic form; performed only |

## Current source counts

- 255 structurally valid lexicon rows.
- 249 rows in the single-token atom inventory.
- 6 rows preserved in the non-atomic inventory.
- 247 distinct single-token forms.
- 6 distinct non-atomic forms.
- 7 explicit alias records, all pointing to accepted single-token entries.
- 2 detected single-token collisions: `re` and `ra`.

The parser intentionally consults only the single-token inventory for ordinary atom lookup. The non-atomic records remain source evidence for future reference-form and clitic grammar work; they are not yet parsed as those grammatical constructions.

The previous audit note that described these six rows as “filtered” is superseded by this correction. They are now retained and reported separately. This change does not make the lexicon canonical, resolve their precise grammar, or establish test success.
