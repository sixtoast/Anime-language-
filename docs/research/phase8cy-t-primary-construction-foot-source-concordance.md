# Phase 8CY-T — Primary Construction Foot source concordance

**Canon effect:** NONE · **Grammar changes:** none · **Execution:** none.

## 1. Source identity and extraction boundary

Primary source: `sources/originals/Arcane_Language_Audit_Phase_4.docx`.

- SHA-256: `c8204667c204227ba474fd0b5245fd66f1ba081565671f5a28cf65efb513eaea`.
- Reviewed derivative: `sources/extracted/phase4-docx-body-transcription.md`.
- Extraction scope: document-body paragraphs and tables in source order.
- It does not reconstruct layout, footnotes/endnotes, comments, tracked-change intent or floating objects.

## 2. Direct primary-source concordance

| Claim | Exact locator | Recovered statement | Conclusion |
|---|---|---|---|
| Foot structure | §3.1, Table 2 | Frame + parameter vowel + relation coda; CVC | Primary source states CVC |
| Inventory dimensions | §3.1, Table 2 | Six frame classes, six parameter vowels, five codas | Five relation codas source-backed |
| TRAK | §3.2, Table 3 | p/t/k voiceless-stop frames, discrete change | Described group, not individual meanings |
| KREN | §3.2, Table 3 | b/d/g voiced-stop frames, reinforced counterpart | Explicitly proposed; owner confirmation required |
| FREM | §3.2, Table 3 | m/n open-loop maintenance; ng/ŋ maintenance with feedback | Explicit coda-to-relation assignments |
| SHREN | §3.2, Table 3 | s/sh release | Explicit coda-to-relation assignments |
| VARE | §3.2, Table 3 | Soft-requirement modifier, not a Foot | Excluded from Foot coda inventory |
| Parameter families | §3.2–§3.3 | a energy, u motion, o extent, e structure/form, i information, ə baseline | Explicitly PROVISIONAL |
| Phonotactic codas | §4, Table 4 | m,n,ng,p,t,k,s,sh,l,r | Ten legal codas; not all semantic relation codas |
| Fused reference | §8, Table 14 | mel = me + anchor coda l | Reference analysis, not a relation-coda assignment |
| P4-T05 | §10, Table 15 | z and v are not frame consonants; Feet cannot contain them | Frame exclusion test |
| P4-T10 | §10, Table 15 | kan, ken, kas, kal, mel are Foot-shaped (frame + parameter vowel + relation coda) | Shape-only test, not lexical semantic licensing |

## 3. Corrected coda inventory

Five relation codas are explicitly listed in Phase 4 Table 3:

- `m`, `n`: FREM, open-loop maintenance.
- `ng` (IPA `ŋ`): FREM, maintenance under feedback (D-036).
- `s`, `sh`: SHREN, release.

The ten phonotactically legal codas in Table 4 are a different inventory. `p`, `t`, `k`, `l`, `r` are legal syllable codas but have no relation-coda meaning assigned in Table 3.

## 4. What P4-T10 does and does not prove

P4-T10 is a mechanical shape check. It says that five forms have CVC shape. It does not demonstrate that each is a semantically licensed productive Foot.

- `kan`, `ken`, `kas`: whole worked-example tokens. The final letters are not independently segmented by P4-T10.
- `kal`: CVC shape; final `l` is phonotactically legal but is not among the five Table 3 relation codas. Lexical Foot validity is not established.
- `mel`: Table 14 explicitly analyses this as `me` + anchor coda `l`, a fused reference. Its P4-T10 shape result does not override that functional analysis.

P4-T05 concerns frame consonants `z` and `v`; it is not a relation-coda test.

## 5. CVC versus optional-coda conflict

Phase 4 §3.1 Table 2 states Feet are CVC. Phase 4 §10 P4-T10 repeats the CVC shape definition. Phase 5.15 also records CVC. Phase 5.16 C-02 records an optional relation coda.

For the current source profile, the direct Phase 4 primary statement is preferred: CVC is the documented shape. The Phase 5.16 optional-coda wording remains recorded as a secondary-summary discrepancy because its intended context is not recovered. This is not a canon amendment; it is an evidence precedence decision for the reviewer. No optional-coda grammar is implemented.

## 6. Correction to Phase 8CI and Phase 8CY-S

Phase 8CI's zero-entry relation-coda closure was based on incomplete primary-source inspection. The recovered Phase 4 body transcription directly contains the five-coda inventory and Table 3 mappings. Phase 8CY-S therefore incorrectly disabled the five-coda design-space lookup. This phase supersedes that conclusion.

The 180 candidates remain `DESIGN-SPACE-ONLY`, with lexical attestation `NOT-RECOVERED`, individual frame meanings `UNRESOLVED`, parameter semantics provisional, physical semantics undefined and execution disabled. Candidate lookup returns only membership in the evidence cross-product, not lexical validation.

## 7. Remaining work

1. Recover the original v2.0 source to verify the productive morphology and contextual coda rules.
2. Resolve whether Phase 5.16 C-02 represents a narrower context or a mistaken secondary summary.
3. Recover actual lexical attestations and tests from the original v2.0 materials; Phase 4 P4-T10 is only a shape test.
4. Do not assign individual meanings to p/b/t/d/k/g or make the six parameter-vowel families executable.

Tests are authored, not claimed as executed. No GitHub Actions workflow was dispatched, no PR merged and production remains untouched.
