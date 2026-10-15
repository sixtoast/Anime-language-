# Arcane Phase 7B — source-backed lexicon strata and grammar recovery

**Status:** Evidence audit; no canon changes  
**Date:** 2026-10-15  
**Source snapshot:** `sources/originals/Arcane_Lexicon_v5_draft.csv` and `sources/originals/Arcane_Alias_Registry_Phase_5_5.csv`  
**Related work:** `docs/research/phase7a-operator-inventory-reconciliation.md`, `docs/research/phase6g-v5-source-lexicon-audit-01.md`  
**Purpose:** Move from a list of open questions to a more precise account of what the existing lexicon already records, what it does not establish, and which language-development tasks can now be advanced safely.

## 1. Important finding: several apparent omissions are present in the lexicon source

The previous reconciliation correctly identified gaps between the main v3.0-L specification and the magic-system specification, but the v5 draft lexicon contains additional source records that materially narrow those gaps.

The v5 draft includes:
- all six operational forms KREN, TRAK, FREM, SHREN, BRAN, VARE, marked `CANON` with source `Magic v3.0 §26`;
- the v2.0 role forms PO (position role), FO (direction role), LO (movement role);
- the h-series coupling forms HƏ (mana), HE (matter), HA (energy), HU (living), HI (information), HO (field);
- performed fused references for self, field and target across several scopes;
- five performed clitic forms;
- proposed temporal, set, constraint, control-state and mathematical forms;
- a substantial Phase 5 vernacular vocabulary marked `PROPOSED`.

This changes the recovery task: we should no longer say these forms are wholly absent from the recovered source pack. The more precise status is that **lexical records survive, while their complete grammar, historical decision context, and validation are incomplete**.

The lexicon is still a draft inventory. Its status fields and glosses are evidence about how the source author classified entries, not proof that every item is approved current canon.

## 2. Lexicon strata: keep four distinct layers

### Layer A — core forms in v3.0-L

The core specification gives the main reference terms, spatial relations, geometry, quantities, information operations, arithmetic, vector operations, logic, control, binding, digits and units. These remain the learner-facing canonical baseline unless a versioned decision explicitly supersedes a form.

### Layer B — cross-document operational forms

The six forms KREN, TRAK, FREM, SHREN, BRAN and VARE are present in the v5 lexicon and are sourced to Magic v3.0 §26. They should be visible in a complete source-backed dictionary, with a note that the language specification's surface syntax and complete signatures do not yet fully define them.

### Layer C — historical/performed morphology and clitics

The v5 lexicon contains records such as:
- `mi` SELF-point, `me` SELF-surface, `mə` SELF-volume;
- `ni` FIELD-point, `ne` FIELD-surface, `nə` FIELD-volume;
- `ri` TARGET-point, `re` TARGET-surface, `rə` TARGET-volume, `ra` TARGET-path, `ro` TARGET-network, `ru` TARGET-extended region;
- `s-` as a performed IF clitic, `sh-` as a WHILE clitic, `f-` as an UNTIL clitic, `wi` as LIVE, and `we` as LOCKED.

The inventory gives concrete historical/performative forms and glosses. It does **not** by itself fully recover the productive morphology rules, allowed environments, attachment behaviour, or pronunciation in continuous speech. Preserve the forms; recover the generative rules separately.

### Layer D — proposals, especially temporal and vernacular vocabulary

The v5 lexicon marks many entries `PROPOSED`, including temporal forms (`boni`, `vote`, `fuwo`, `kole`, `shasu`, `wela`, `vitu`, `showa`, `leko`), set operations, constraints, relation values, control states, event triggers, block delimiters, and the Phase 5 conversational vocabulary.

These are useful candidate material, but a proposed word is not automatically part of canon. It can be used to design and test candidate grammar if examples are explicitly labelled provisional. Do not silently use proposed forms in a supposedly canonical sentence.

## 3. Specific lexical findings

### 3.1 Preferred forms and aliases

The preferred v5 rows explicitly list:
- FRAJA (subtract), formerly FRATA;
- FRAMA (multiply), formerly FRAKA;
- DRUM (cross product), formerly DRIM;
- BEN (region), formerly REN;
- GRASH (NOT), formerly GRAK;
- KWASH (live evaluation), formerly KWAK;
- DRAS (compare), formerly DRAL.

The separate alias registry preserves the seven old-to-preferred mappings and calls for alias compatibility. This supports a version-aware interpretation: the source author intended preferred forms plus compatibility aliases. What is not yet established by these two files alone is the exact migration/version policy across all historical documents and all registers. Therefore:
1. display preferred v5 form in the v5 lexicon view;
2. retain the old form and provenance as an alias;
3. do not rewrite historical source examples automatically;
4. do not infer that every legacy form is valid in every register/version;
5. maintain the v3.0-L spellings in the canon-source view, with a visible cross-version note.

This is more precise than treating the preferred/legacy discrepancy as wholly undecided, but it still avoids falsely declaring a universal version policy.

### 3.2 RE and RA are not simply accidental duplicates

The lexicon shows the collisions arise from two different layers:
- `re` is the digit 4 in the number inventory and TARGET-surface in the performed fused-reference inventory.
- `ra` is the radian unit in the unit inventory and TARGET-path in the performed fused-reference inventory.

The source records explain the provenance of the collisions; they do not provide a formal contextual disambiguation rule. They may be distinguished by grammatical slot or by the distinction between numeral/unit notation and performed-reference syntax, but that remains a hypothesis until the relevant syntax is recovered and tested. No record should be deleted solely to make the collision count disappear.

### 3.3 Coupling vocabulary: the h-series

The lexicon contains `hə`, `he`, `ha`, `hu`, `hi`, and `ho` with coupling glosses for mana, matter, energy, living systems, information and field. This is meaningful recovered evidence. It narrows the old “h coupling not recovered” statement: the **forms and glosses are present**, but the full compositional rule for attaching them to an expression, their argument positions, and the relation to BRAN are not established by the lexicon alone.

Do not collapse the h-series into BRAN. The source glosses suggest the h-series distinguishes coupling domains while BRAN is an operational verb glossed “couple”. Their exact relationship needs examples and signature evidence.

### 3.4 The temporal inventory is more developed than the canon overview suggests

The lexicon includes proposed forms for now, before, after, until, delay, duration, repetition interval, deadline, and prediction. Their presence is evidence of an existing design proposal, not evidence that temporal grammar is canonical or complete. A next grammar pass should group them by semantic type:
- **time points/relations:** now, before, after;
- **duration/offset/period:** delay, duration, repetition interval;
- **termination/deadline:** until, deadline;
- **epistemic temporal operation:** predict.

This grouping is a classification aid for analysis, not a change to their meanings. In particular, UNTIL appears both as a proposed temporal/control form (`kole`) and as a performed clitic `f-`; these may be register-specific realisations, but that relationship needs explicit evidence.

## 4. A safe next grammar target: reference and scope

The performed fused-reference inventory offers a concrete starting point for recovering the morphology because it provides a visible paradigm rather than isolated words.

The source data supports the following observed pattern:

| Reference family | Point | Surface | Volume | Other listed scopes |
|---|---|---|---|---|
| SELF | mi | me | mə | — |
| FIELD | ni | ne | nə | — |
| TARGET | ri | re | rə | ra = path; ro = network; ru = extended region |

**Observed pattern:** the first consonant identifies the reference family (m/n/r); the vowel varies with the scope label. This pattern is visible in the listed forms, but it is not yet a complete productive rule: the exact phonological representation, the mapping of each vowel to scope, and the status of exceptional TARGET forms must be confirmed against the original v2.0 morphology source.

A conservative provisional analysis for testing is:
- onset /m/ → SELF;
- onset /n/ → FIELD;
- onset /r/ → TARGET;
- the listed vowel/consonant pattern selects a scope label.

This is **PROVISIONAL**, not canon. It is useful because it creates falsifiable tests and highlights the exceptions instead of pretending the paradigm is already fully regular.

Required tests:
1. each listed fused form resolves to the correct reference family and scope;
2. an unlisted combination is not automatically generated as valid;
3. `re` in a numeral/unit context is distinguished from TARGET-surface only if a documented grammatical slot rule supports it;
4. `ra` as radian is distinguished from TARGET-path only if a documented slot rule supports it;
5. the corresponding full reference forms (MI/NI/RI) and performed fused forms retain a traceable relation without assuming they are interchangeable in all registers;
6. clitics attach only where source grammar permits;
7. the same semantic construction is preserved when converted between full formal and performed encodings.

## 5. Corrections to the open-issue register

The following wording is recommended for future audit references:

- Instead of “v2.0 morphology is not recovered”, use: **“The v5 lexicon preserves part of the v2.0 morphology inventory (roles, h-series coupling forms, fused references and clitics), but the full generative rules and source context remain incomplete.”**
- Instead of “the six operational forms are absent from the lexicon”, use: **“The six operational forms are present in the v5 lexicon with Magic v3.0 §26 provenance; their complete integration into surface syntax and signatures remains unresolved.”**
- Instead of “the alias decision is unknown”, use: **“The alias registry records a preferred-form migration under Phase 4 §5.1 / D-032; the exact version/register policy and interaction with older canon text need reconciliation.”**
- For temporal vocabulary, use: **“The v5 draft proposes a substantial temporal inventory, but its proposed status and missing signatures mean it is not yet a canonical temporal grammar.”**

These corrections improve the precision of the project’s state without rewriting canonical documents or pretending the unresolved questions are solved.

## 6. Recommended next work package

1. Recover the actual Phase 4 §5.1 / D-032 decision record and the original v2.0 morphology explanation if available in the repository or uploaded source documents.
2. Build a small reference/scope paradigm table with each form's exact source, register, status, and confidence.
3. Write positive and negative examples for formal references and performed fused references, labelling any constructed examples as test notation rather than canon.
4. Recover the role of PO/FO/LO and the h-series in source examples before assigning them syntax.
5. Only then draft a formal, versioned morphology proposal and seek approval before changing canon.
6. Keep proposed temporal and vernacular vocabulary visible in the dictionary, but separate from canonical forms in examples and validation.

## 7. Acceptance status

- Source lexicon inspected: **yes**.
- Alias registry inspected: **yes**.
- Operational forms found in source lexicon: **yes**.
- Partial v2.0 reference/scope inventory recovered: **yes**.
- Full morphology grammar recovered: **no**.
- Canon changed: **no**.
- Automated language tests executed in this phase: **no**.
- Main contribution: the recovery map is now more precise and a concrete next grammar target has been identified.
