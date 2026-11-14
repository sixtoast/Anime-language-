# Phase 8CH — Construction lexical segmentation and Foot-candidate evidence audit

**Date:** 2026-11-14  
**Canon effect:** NONE · **Grammar changes:** none · **Tests authored:** LEX-CH-001–014  
**Tests executed:** not executed locally

## 1. Objective

Compare every whitespace-separated occurrence in the exact Phase 5.22 hand-flame surface with the recovered Construction inventories. The aim is to identify exact source matches, fixture-only readings and unresolved overlaps—not to derive morphology from spelling.

## 2. Inventory comparison

The six phrase surface contains 17 token occurrences and 14 distinct spellings.

| Surface | Occurrences | Recovered evidence | Segmentation conclusion |
|---|---:|---|---|
| `mel` | 1 | Fixture anchor | Whole fixture token; general reference morphology unresolved |
| `po` | 1 | Position role in phrase 2 | Fixture-local spatial role |
| `da` | 1 | +Y in phrase 2; also canonical CV frame form `da` | Surface overlap; token identity not established |
| `za` | 2 | Appears in fixture quantity phrases | Individual meaning not assigned |
| `shi` | 2 | Appears in fixture quantity phrases | Individual meaning not assigned |
| `to` | 1 | Appears in fixture quantity phrase | Individual meaning not assigned |
| `ma` | 1 | Appears in fixture quantity phrase | Individual meaning not assigned |
| `kan` | 1 | Phase 5.22 whole example token; alias TRAK ENRA | No internal segmentation |
| `ken` | 1 | Phase 5.22 whole example token; held-state/FREM association | No internal segmentation |
| `he` | 1 | H-series form; matter gloss provisional | Coupling signature unresolved |
| `ha` | 1 | H-series form; energy gloss provisional | Coupling signature unresolved |
| `sa` | 1 | Part of seconds-duration phrase | Individual meaning unresolved |
| `se` | 1 | Part of seconds-duration phrase | Individual meaning unresolved |
| `kas` | 1 | Phase 5.22 whole example token; SHREN/release association | No internal segmentation |

The operational macro inventory uses the forms TRAK, KREN, FREM, SHREN, BRAN and VARE. None of those exact spellings occurs as a token in this lower-case hand-flame surface. This is an inventory comparison only; it does not prove that macros cannot be expressed through aliases or other constructions.

## 3. Important collision: `da`

The fixture reads `da` as the +Y axis. Separately, the Foot evidence inventory lists `da` among six canonical CV frame forms (`pa, ba, ta, da, ka, ga`).

The spelling overlap is real; identity is not established. The records belong to different evidence contexts and may be version-/function-specific. The implementation therefore reports both matches without merging their meanings or asserting homonymy.

## 4. Foot-candidate conclusions

Three forms—`kan`, `ken`, and `kas`—have explicit whole-token evidence in the standalone Phase 5.22 parser source. Their orthographic CVC appearance is not a licence to segment them into frame, parameter vowel and coda. The parser records them as whole example-level tokens and their internal segmentation remains NOT-ESTABLISHED.

The six CV forms are documented frame forms, not complete Feet. No productive frame × parameter × coda paradigm is recovered. The Phase 5.15 CVC statement and Phase 5.16 optional-coda statement remain in conflict.

The H-series forms `he` and `ha` are coupling-family entries, not demonstrated Foot forms. No token in this fixture is promoted to a complete Foot by shape alone.

## 5. Implementation

Added `src/engine/constructionLexicalSegmentationAudit.ts`:
- records all 17 token occurrences with phrase and occurrence indices;
- compares exact spellings against frame, whole-token, H-series and macro inventories;
- highlights the `da` overlap without merging identity;
- retains phrase-local quantity/duration context without assigning token glosses;
- provides exact occurrence lookup and fails closed for unknown forms.

## 6. Tests

Fourteen tests are authored and registered as LEX-CH-001–014. They cover occurrence counts, unique spellings, whole-token evidence, coupling forms, the `da` overlap, macro inventory non-overlap, phrase-local context, morphology boundaries and non-executable status. Tests have not been executed locally.

## 7. Conclusion

This fixture does not expose a productive morpheme segmentation. It does expose a critical cross-inventory surface overlap (`da`) and confirms that the three apparent CVC forms must remain whole tokens under current source evidence. The next source-recovery task is to obtain the complete original Construction lexicon and the explicit token-to-Foot mapping rules, rather than manufacture a paradigm from the 17 occurrences.

**Decision ID:** P8CH-CONSTRUCTION-LEXICAL-SEGMENTATION-01 · **Canon effect:** NONE
