# Phase 8BF — Transcription comparison and Construction reference boundary audit

**Date:** 2026-11-14  
**Canon effect:** none. **Grammar changes:** none.  
**Tests authored:** four additional Python tests. **Tests executed:** not executed.

## Source Recovery Studio: comparison engine

The offline CLI now accepts `--compare LEFT RIGHT` for two UTF-8 text transcriptions. It performs an exact line-sequence comparison and reports changed regions, line positions, and left/right text in JSON and Markdown. It does not normalise whitespace, punctuation, case or spelling. This is deliberate: normalisation could erase evidence of transcription differences.

Example:

```bash
python tools/source_intake.py --compare phase4-docx.txt phase4-transcription.txt
```

This comparison mode runs independently of the normal intake mode. It does not yet perform DOCX/PDF extraction as part of the comparison command; those formats must first be extracted by the intake pipeline and reviewed with their extraction warnings. A changed region is a review lead, not proof of a grammatical conflict.

## Incantations Arcana: Construction reference and clause boundary audit

The current evidence supports a narrow set of claims:

- Formal `MI`, `NI`, `RI` carry default-volume scope and UNTIL-REPLACED persistence in the Phase 5.16 recovery trail citing Phase 4 §3.3.
- Formal `me` is recorded as SELF-surface with the same persistence.
- A missing replacement preserves the current binding; a valid replacement replaces the previous binding in the recovered formal binder contract.
- Performed forms are a separate inventory. The available recovery only partially reads `re` as TARGET-surface and `ra` as TARGET-path; their Shared Arcana collisions require slot-sensitive treatment.
- `mel` remains a worked-example association, not proof of productive anchor morphology.

The evidence does **not** establish a spoken clause delimiter, reference-slot grammar, clause termination rule, scope reset at clause boundaries, or whether reference tokens must occur in every Construction expression. Seven Construction stages and their PRECEDES order do not supply these missing syntax rules.

Therefore, the next language development step is not to invent punctuation or a delimiter. It is to compare the original Phase 4 DOCX-derived and TXT transcriptions at paragraph level, then inspect the source passages behind Phase 5.16 C-04/C-05 and Phase 5.20. Until those sources are recovered, clause-boundary grammar remains unresolved.

## Validation

Four new comparison tests cover identical inputs, inserted-line location, exact whitespace sensitivity and the prohibition on semantic inference. The existing source-intake suite now contains eleven authored tests. None are claimed executed. No canon, parser or binder behaviour changes in this increment.
