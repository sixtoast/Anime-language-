# Phase 8CL — Construction macro contract readiness gate

**Date:** 2026-11-14 · **Canon effect:** NONE · **Grammar changes:** none  
**Tests authored:** MACRO-CL-001–015 · **Tests executed:** not executed locally

## 1. Source boundary

This phase rechecked the checked-in Phase 5.15 Construction Contract Matrix and Phase 5.16 Construction Recovery Matrix, together with the Phase 8AR, 8CE and 8CI records. The matrices cite Phase 4 §§3.1–3.3, §6 G-4 and §§8–10, but the complete original Phase 4 DOCX and referenced mechanical-test definitions are not yet available as a reviewed transcription. The archive index exposes only an 1,800-character excerpt from each indexed transcription. The matrices are secondary recovery evidence, not substitutes for the primary source.

The Phase 5.15/5.16 Foot-shape discrepancy remains open: one summary specifies CVC while C-02 in the other describes an optional relation coda. This phase does not resolve it.

## 2. Recovered macro roles

| Macro | Recovered evidence | Contract readiness |
|---|---|---|
| TRAK | Alter; p/t/k voiceless-stop group; discrete change | Role recovered; expansion and contract incomplete |
| KREN | Establish; proposed b/d/g reinforced counterpart | Owner confirmation required |
| FREM | Maintain; `ken` held-energy fixture association | Partial fixture only |
| SHREN | Release; `kas` release fixture association | Partial fixture only |
| BRAN | Couple; heavy H-series family | Role described; domain mapping provisional |
| VARE | Soft-requirement modifier paired with hard REQUIRE | Role described; attachment and policy incomplete |

The six forms are not six equivalent signatures. Their glosses are lexical/role evidence, not argument lists or executable operations.

## 3. Contract-readiness gate

Added `src/engine/constructionMacroContractReadiness.ts`. It derives a fail-closed readiness record for every existing macro audit entry.

Nine shared dimensions are required before compiler integration:
1. input signature;
2. output signature;
3. Foot cardinality;
4. sequence scope;
5. preconditions;
6. resource semantics;
7. side effects / physical outcomes;
8. termination;
9. composition and compatibility rules.

All nine remain unrecovered or not established for every macro.

Macro-specific blockers are retained:
- **TRAK:** exact expansion and physical/resource meaning of discrete change;
- **KREN:** owner confirmation and approved Foot mapping;
- **FREM:** general maintenance conditions, duration and termination beyond the `ken` example;
- **SHREN:** release target, mode and safety conditions beyond the `kas` example;
- **BRAN:** provisional H-series mapping plus missing participant, direction, vector and resource rules;
- **VARE:** attachment/scope, preference conflict resolution and failure policy.

A recognised macro returns its readiness record, not an executable operation.

## 4. Compiler integration policy

No macro may be admitted to execution merely because its spelling is in the lexicon, its gloss is recorded, it appears in a worked example, a related form appears in v3.0, or a macro-to-frame/domain association exists.

The compiler gate remains closed until missing contract fields are supported by inspected primary-source evidence or an explicitly owner-approved replacement specification. Historical recovery and new language design remain separate.

## 5. Verification

Fifteen tests are authored and registered as MACRO-CL-001–015. They cover all six macros, evidence-status differences, nine common missing dimensions, macro-specific blockers, fail-closed lookup and the disabled compiler gate. Tests have not been executed locally.

## 6. Next decisive recovery action

Obtain and inspect the complete Phase 4 DOCX-derived transcription and definitions of P4-T05/P4-T10, especially §§3.1–3.3, §6 G-4 and §§8–10 with associated tables/footnotes. The archive index confirms a DOCX-derived transcription with the original binary's SHA-256, but only a short excerpt is checked in. Its complete text must be recovered before settling Foot-shape conflicts or expanding macro contracts.

**Decision ID:** P8CL-CONSTRUCTION-MACRO-CONTRACT-READINESS-01 · **Canon effect:** NONE
