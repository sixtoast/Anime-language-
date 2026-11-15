# Phase 8AR — Construction macro evidence refinement

**Date:** 2026-11-14  
**Canon effect:** none. **Grammar/parser changes:** none. **Execution:** none.  
**Tests:** 13 cases authored; not executed in this environment.

## Source inspection

This phase reads the complete checked-in text of:
- `sources/originals/Arcane_Phase_5_15_Construction_Contract_Matrix.csv`
- `sources/originals/Arcane_Phase_5_16_Construction_Recovery_Matrix.csv`

The Phase 4 binary remains unread through the available UTF-8 reader. This phase relies on the two source matrices' recorded Phase 4 citations; it does not claim independent inspection of the binary DOCX.

## Six macro contracts — evidence differentiated

| Macro | Recorded description | Evidence status | Unresolved boundary |
|---|---|---|---|
| TRAK | Alter; p/t/k voiceless-stop frame; discrete change | Pattern described; full contract open | Expansion, arity, physical/resource semantics |
| KREN | Establish; b/d/g voiced-stop reinforced counterpart | Proposed; owner confirmation required | Not approved; full contract absent |
| FREM | Maintain; example uses `ken` as held-energy state | Partial example only | General pattern, expansion, termination |
| SHREN | Release; example uses `kas` for release | Partial example only | General pattern, target and safety conditions |
| BRAN | Couple; h-domain syllable family | Pattern described; domain mapping provisional | Composition, order, physical vector and resource costs |
| VARE | Soft-requirement modifier paired with hard REQUIRE | Role described; operational semantics open | Conflict resolution, failure policy, attachment |

This corrects the coarser Phase 8AQ grouping. It does not promote KREN or BRAN to settled semantics: the source matrix explicitly marks KREN proposed and BRAN's domain mapping provisional.

## Additional Construction precision

### Couplings
The matrix records the heavy coupling family `hə, he, ha, hu, hi, ho`. Its domain/property mapping and physical coupling vector remain provisional. Participant types, direction, coupling signatures and resource costs are not established. The six vowel glosses must not be treated as a physical model.

### Hand-flame sequence
The exact token sequence recorded in Phase 5.15 is:

`mel · po da za shi to za ma · kan ken · he ha · sa shi za se · kas`

The matrix says tokenisation was checked, but whole-spell parsing and feasibility were not. It specifically notes that energy magnitude, extent and matter-coupling parameters are unspecified. The sequence therefore remains an example, not a complete grammar or executable recipe.

### Foot morphology conflict
Phase 5.15 records CVC; Phase 5.16 C-02 records an optional relation coda. The discrepancy remains unresolved. The six frame classes and provisional parameter-family labels retain their earlier evidence status; relation-coda inventory and meanings remain incomplete.

## Implementation

Updated `src/engine/constructionSourceConcordance.ts` to split the former single macro claim into six independently status-tagged macro claims. The H-series entry now records the heavy-syllable property and explicit physical-vector boundary. The hand-flame entry now preserves the exact matrix sequence and its feasibility boundary.

Updated the regression suite and central test registry. Research & Review receives a Phase 8AR entry.

## Verification

Thirteen test cases are authored, not executed. No local Vitest or browser run is claimed. No TypeScript build is claimed in this research record. No parser, executable Construction engine, or canon rule was changed.
