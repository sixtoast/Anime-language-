# Operator Spelling Lineage Audit 01

**Date:** 2026-10-15  
**Status:** Source-reconciliation record; historical mappings transcribed, canon unresolved  
**Canon impact:** None. No form is renamed, deprecated, or approved by this audit.

## Purpose

Capture the exact operator-alias claims recoverable from the searchable archive index, compare them with the imported Arcane v3.0-L baseline, and define what evidence is still missing before implementation changes are safe.

## Evidence actually recovered

The searchable index `sources/archive-reports/mega-pack-text-index.md` contains an excerpt of:

`Arcane_Phase_6S_Typed_Expression_Integration/Arcane_Alias_Registry_Phase_5_5.csv`

The indexed CSV declares these columns: `legacy_form`, `preferred_form`, `gloss`, `source_decision`, `compatibility_status`, and `lexicon_status`. Its rows cite **“Phase 4 §5.1; D-032”** (with D-017 additionally cited for DRIM) and describe the legacy forms as aliases to be resolved to preferred forms. The archive index is an excerpt/search aid, not the full original Phase 4 specification or decision ledger. Therefore, this confirms what the historical registry *claims*, not that the mappings were approved as the current canon.

## Historical alias claims versus v3.0-L

| Historical form | Historical preferred form | Historical gloss | v3.0-L baseline in this repository | Reconciliation status |
|---|---|---|---|---|
| FRATA | FRAJA | subtract | FRATA = subtract | Conflict: v3.0-L retains FRATA; preferred-form claim needs decision-source verification |
| FRAKA | FRAMA | multiply | FRAKA = multiply | Conflict: v3.0-L retains FRAKA; preferred-form claim needs decision-source verification |
| DRIM | DRUM | cross product | DRIM = cross product | Conflict: v3.0-L retains DRIM; historical registry also cites D-017 |
| REN | BEN | region | REN = region | Conflict: v3.0-L lists REN as geometry/region |
| GRAK | GRASH | NOT | GRAK = NOT | Conflict: v3.0-L retains GRAK |
| KWAK | KWASH | live evaluation | KWAK = live evaluation | Conflict: v3.0-L retains KWAK |
| DRAL | DRAS | compare | DRAL = compare | Conflict: v3.0-L retains DRAL |

The word “conflict” here means the imported canonical baseline and historical registry name different forms for the same gloss. It does **not** decide which source is later, more authoritative, or approved.

## What this audit does and does not establish

Established from indexed archive evidence:

- A Phase 5.5 alias-registry artifact exists in the archive index.
- The registry excerpt records seven legacy-to-preferred mappings and cites Phase 4 §5.1 / D-032, with D-017 also cited for DRIM.
- The historical registry describes alias resolution and says the legacy form is not a separate row in the v4/v5 lexicon CSV.
- The current imported v3.0-L document uses the legacy-side forms for these glosses.

Not established yet:

- The exact text and context of Phase 4 §5.1.
- The full D-032 and D-017 decision records, their dates, scope, approval status, and whether they supersede v3.0-L.
- Whether the preferred spellings belong to a later approved version, a compatibility layer, or a prototype-only registry.
- Whether any alias normalisation is implemented consistently across the Phase 6G parser, lexicon, fixtures, and current TypeScript workbench.
- Whether any mapping is suitable for ordinary speech, formal syntax, or only an implementation-facing compatibility layer.

## Required next evidence

1. Recover the full archived Phase 4 source and the complete D-032/D-017 decision records, preserving archive paths and hashes.
2. Establish source chronology and authority against the v3.0-L source history; do not infer recency from phase numbers alone.
3. Inspect the complete Phase 5.5 registry and Phase 6G normalisation code/tests, and record behaviour separately from approval.
4. For each row, record a decision status: **canonical**, **approved legacy alias**, **prototype-only**, or **unresolved**, with a direct source citation.
5. Only after explicit authority is established, update canonical records or parser normalisation and add regression fixtures. Until then, preserve all current forms.

## Separate issue: `re` and `ra` lexical collisions

The v5 lexicon audit separately reports collisions for `re` and `ra`. These are lexical-token ambiguity issues, not proof of an operator alias relationship. The v3.0-L baseline assigns RE to digit 4 and RA to radian; its text explicitly states that MA is metre and cannot also mean SELF. No disambiguation rule for RE/RA should be invented from the operator-alias registry. The next audit must inspect the exact colliding rows, their semantic categories, tokenisation assumptions, and authoritative decision history.

## Acceptance criteria

This lineage audit can be closed only when every mapping has either a source-backed disposition or a precisely described unresolved decision with the missing evidence named. Passing a registry validator or prototype parser test is not approval to change Arcane canon.
