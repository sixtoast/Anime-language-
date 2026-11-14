# Arcane Phase 7J — historical morphology recovery boundary

**Status:** Source audit; no canon changes  
**Date:** 2026-10-15  
**Purpose:** Separate what the recovered v2.0/v3.0-L records attest from what remains unavailable, and define a safe next-step test plan.

## 1. Executive finding

The current repository snapshot does not contain enough readable evidence to reconstruct the complete v2.0 morphology. The original Phase 4 and Phase 5 audit files are present as DOCX paths, but the available GitHub file-fetch action attempts to decode their binary bytes as UTF-8 and fails. No equivalent Markdown, text or PDF files were found at the corresponding paths in this check. This is a limitation of the retrieval path, not proof that the documents contain no useful evidence.

The canonical v3.0-L specification explicitly says detailed v2.0 morphology, h coupling, MEL anchoring and KAN/KEN/KAS are referenced but not recovered. The continuity register independently marks those rules as a gap and says not to guess them. This phase therefore does not fabricate a paradigm or promote a hypothesis into canon.

## 2. What the source snapshot supports

### 2.1 Historical progression and registers

The canonical specification names the broad progression Proto → Old → Classical → Modern. It distinguishes Vernacular, Technical, Formal and Performed Arcana. Historical texts can contain obsolete grammar and vocabulary, so a form must be recorded with its source, version and register rather than globally normalised.

### 2.2 Source-attested morphology-adjacent entries

The v5 draft lexicon contains the following rows marked Formal / CANON / v2.0:

| Form | Recorded gloss | What this establishes |
|---|---|---|
| PO | position role | A role form is recorded; its syntax/signature is not recovered |
| FO | direction role | A role form is recorded; its syntax/signature is not recovered |
| LO | movement role | A role form is recorded; its syntax/signature is not recovered |
| HƏ | couple: mana | A coupling vocabulary entry exists; its complete semantics are not recovered |
| HE | couple: matter | A coupling vocabulary entry exists; its complete semantics are not recovered |
| HA | couple: energy | A coupling vocabulary entry exists; its complete semantics are not recovered |
| HU | couple: living | A coupling vocabulary entry exists; its complete semantics are not recovered |
| HI | couple: information | A coupling vocabulary entry exists; its complete semantics are not recovered |
| HO | couple: field | A coupling vocabulary entry exists; its complete semantics are not recovered |

The gloss “couple: X” is not a complete operator signature. It does not reveal whether the form takes two arguments, which argument is the coupling source or target, whether it denotes an action or a typed relation, or what validity conditions apply.

### 2.3 Performed fused references and clitics

The v5 lexicon also records performed forms as CANON (v2.0), with a note that they are performed-only or performed fusions:

- SELF scope: MI (point), ME (surface), MƏ (volume)
- FIELD scope: NI (point), NE (surface), NƏ (volume)
- TARGET scope: RI (point), RE (surface), RƏ (volume), RA (path), RO (network), RU (extended region)
- S-: IF, recorded as a clitic form of BEK
- SH-: WHILE, recorded as a clitic form of ZET
- F-: UNTIL, recorded as a clitic form of an UNTIL root
- WI: LIVE, recorded as a performed form of KWASH
- WE: LOCKED, recorded as a performed form of a KWAM+KWAT lock

These entries support a narrow statement: the lexicon records particular fused references and performed clitics. They do not provide a complete productive morphology rule. The set of scope vowels cannot safely be extrapolated to all references or all geometric scopes, and a clitic’s attachment domain and boundary rules are not supplied by the gloss.

## 3. Collision and version-safety audit

| Form | Recorded meaning A | Recorded meaning B | Safe handling |
|---|---|---|---|
| RE | digit 4 (v3.0-L) | TARGET-surface fused reference (v2.0, performed) | Preserve both records; resolve by explicit register/grammar context, or report ambiguity |
| RA | radian unit (v3.0-L) | TARGET-path fused reference (v2.0, performed) | Preserve both records; never globally replace one with the other |
| KWAK | live evaluation in the older v3.0-L inventory | legacy alias whose preferred form is KWASH in the alias registry | Preserve versioned alias metadata; do not assume every source token has the same status |
| DRIM | cross product in v3.0-L | legacy alias whose preferred form is DRUM in the alias registry | Keep source-version distinction explicit |
| FRATA / FRAKA | subtract / multiply in v3.0-L | legacy aliases with preferred forms FRAJA / FRAMA in the Phase 5.5 registry | Do not rewrite historical source text in place |

The last three rows illustrate why a current preferred form and a historical source form may both need to remain searchable. A migration can add an alias mapping, but should not erase the form actually present in an older text.

## 4. What cannot be inferred

The available records do not establish:

1. The complete frame + vowel + coda rule mentioned in the continuity register.
2. The full mapping from each frame or consonant pattern to a semantic class.
3. The vowel-to-scope mapping as a general productive rule.
4. Whether PO, FO and LO are case-like markers, adpositions, typed relation operators or another construction.
5. The complete argument signatures and validity constraints for HƏ/HE/HA/HU/HI/HO.
6. The syntax and domain of MEL anchoring.
7. The meanings, distribution or paradigms of KAN/KEN/KAS.
8. Whether a performed fused form is legal in technical or vernacular speech.
9. Whether a form is historically obsolete, dialectal or simply restricted to a register, unless the source states so.
10. Whether similarly shaped forms are related by derivation rather than coincidence.

These are unresolved because evidence is missing, not because the system must lack such rules.

## 5. Morphology recovery test plan

These are proposed audit cases. They are not claims that an implementation has run them.

| ID | Test | Required result |
|---|---|---|
| MOR-001 | Recover an original v2.0 morphology statement | Record exact source location before formalising a rule |
| MOR-002 | Recover a complete example containing PO | Identify token boundaries, role and argument relation |
| MOR-003 | Recover a complete example containing FO | Distinguish directional relation from destination role |
| MOR-004 | Recover a complete example containing LO | Distinguish movement relation from a verb’s lexical meaning |
| MOR-005 | Recover each h-series form in context | Record input slots, output/type and validity conditions only if source provides them |
| MOR-006 | Compare MEL anchoring mentions across sources | Preserve source/version and separate definition from commentary |
| MOR-007 | Locate KAN/KEN/KAS examples | Do not assign meanings from form alone |
| MOR-008 | Parse RE in numeric slot vs performed-reference slot | Unique interpretation only where register/slot rules actually specify it |
| MOR-009 | Parse RA in unit slot vs performed-reference slot | Same requirement; no global spelling rewrite |
| MOR-010 | Read an old form covered by the alias registry | Retain original token and record preferred-form resolution separately |
| MOR-011 | Check a proposed generalisation against all listed paradigm members | Any missing or contradictory cell blocks promotion to canon |
| MOR-012 | Check vernacular use of a performed-only form | Reject as unsupported unless a source or explicit rule authorises cross-register use |

## 6. Practical source-recovery path

To proceed without guessing, the original DOCX documents need to be made readable as source text. Suitable paths include adding extracted UTF-8 Markdown/text transcriptions with section/page references, or making the original files available to a document-reading path that extracts DOCX content rather than decoding binary bytes as UTF-8. Any transcription should preserve tables, examples, diacritics, source headings and version labels; uncertain OCR must be marked rather than silently repaired.

Until that happens, the lexicon rows and canonical specification support the limited evidence table above, but not a full reconstruction of the historical morphology.

## 7. Decision ledger

- **Finding ID:** P7J-MORPH-BOUNDARY-01
- **Status:** Unresolved historical source recovery
- **Canon changed:** no
- **New productive morphology rule:** none
- **Implementation tests executed:** none
- **Research tests specified:** 12
- **Next action:** recover readable historical source text, then produce a source-attested paradigm for PO/FO/LO and the h-series, or explicitly document that the required source evidence remains unavailable.
