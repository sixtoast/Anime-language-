# Arcane language development — operator inventory reconciliation (Phase 7A)

**Status:** EVIDENCE-BASED DESIGN PROPOSAL; not canon  
**Date:** 2026-10-15  
**Canon effect:** none. This document proposes a controlled way to make the existing language inventory more complete without silently changing established forms.

## 1. Why this phase exists

The recovered language specification and magic-system specification agree on the core architecture of Arcane, but their operational vocabulary is not fully integrated. The language specification v3.0-L gives the core operator inventory; Magic System v3.0 lists six additional operational forms. The lexicon audit also records explicit historical aliases and two unresolved lexical collisions.

The immediate language-development goal is to make these inventories usable together while preserving source authority, old forms, and uncertainty.

## 2. Evidence base

### 2.1 Established in the language specification

The v3.0-L language specification lists these forms and meanings:

| Form | Meaning | Current status |
|---|---|---|
| NES | read available information | Canon |
| SIMA | measure through a physical pathway | Canon |
| GAMA | assign a representation/value | Canon |
| DAVE | infer from information | Canon |
| KWAM | create a binding | Canon |
| KWAT | reference a binding | Canon |
| KWAK | live evaluation | Canon |
| FRAPA | add | Canon |
| FRATA | subtract | Canon |
| FRAKA | multiply | Canon |
| FRALA | divide | Canon |
| FRASHA | negate | Canon |
| DRAN | magnitude | Canon |
| DREM | dot product | Canon |
| DRIM | cross product | Canon |
| DRAL | compare | Canon |
| GRAN | AND | Canon |
| GRAT | OR | Canon |
| GRAK | NOT | Canon |
| BEK | IF | Canon |
| ZET | WHILE | Canon |

These definitions are supported by `docs/canon/arcane-language-v3.0-L.md` and repeated in `docs/audits/continuity-recovery-and-test-register.md`.

### 2.2 Additional forms in the magic-system specification

`docs/canon/magic-system-v3.0.md` lists:

| Form | Recovered gloss | Integration status |
|---|---|---|
| KREN | establish | Cross-specification gap |
| TRAK | alter | Cross-specification gap |
| FREM | maintain | Cross-specification gap |
| SHREN | release | Cross-specification gap |
| BRAN | couple | Cross-specification gap |
| VARE | prefer | Cross-specification gap |

These six forms must not be treated as deleted simply because they are absent from v3.0-L. Conversely, their appearance in the magic-system document alone does not provide complete surface syntax, argument signatures, type rules, or examples.

### 2.3 Existing alias evidence

The Phase 6G source-lexicon audit records these explicit compatibility mappings from Phase 4 §5.1 / decision D-032:

| Legacy form | Preferred form | Caution |
|---|---|---|
| FRATA | FRAJA | The v3.0-L core inventory still lists FRATA as “subtract”. |
| FRAKA | FRAMA | The v3.0-L core inventory still lists FRAKA as “multiply”. |
| DRIM | DRUM | The v3.0-L core inventory still lists DRIM as “cross product”. |
| REN | BEN | v3.0-L lists REN as “region”. |
| GRAK | GRASH | v3.0-L lists GRAK as “NOT”. |
| KWAK | KWASH | v3.0-L lists KWAK as “live evaluation”. |
| DRAL | DRAS | v3.0-L lists DRAL as “compare”. |

The source audit says these are explicit compatibility records and that alias normalisation is opt-in. This is a real cross-document/versioning issue, not grounds to erase either side. Until the authority and version scope of D-032 are recovered and confirmed, both spellings should be represented in the audit data with their provenance; a single global “preferred” spelling should not be inferred for every version.

## 3. Design recommendation

**Recommendation: establish a version-scoped operator registry, rather than flattening every source into one list.**

Each lexical/operator record should carry at least:

- `form`: exact written form in the source
- `gloss`: source-attested gloss, not an inferred paraphrase
- `lexical_class`: operator, reference, quantity, unit, digit, relation, or unresolved
- `source_document` and `source_section`
- `source_version`
- `status`: canon, proposal, unresolved, historical, or compatibility alias
- `preferred_in_version`: explicit version-specific preference, or null
- `alias_of`: explicit target, or null
- `signature_status`: recovered, provisional, or unknown
- `notes`: unresolved conflicts and scope limits

This makes the language more usable immediately: a learner or tool can look up a form and see what is known without mistaking an incomplete gloss for a complete grammar rule.

## 4. Proposed integration of the six operational forms

The following distinctions are **working hypotheses for testing**, not canon changes. They are intentionally kept narrow and grounded in the attested glosses.

| Form | Working semantic distinction | Proposed minimum question to resolve |
|---|---|---|
| KREN — establish | Bring a specified symbolic/control condition into an established state; not create matter or energy | What object/state is established, and does the operation initialise, declare, or physically prepare it? |
| TRAK — alter | Request a state transition relative to an existing state | Does it denote a general transformation operator or only changing a parameter in a specified construction? |
| FREM — maintain | Preserve a condition over an interval, subject to resources and disturbances | Is duration mandatory, implicit, or supplied by a separate temporal modifier? |
| SHREN — release | End an established hold/control condition or release a prepared construction | What exactly is released: a binding, a constraint, stored configuration, coupling, or active effect? These must not be conflated. |
| BRAN — couple | Specify/establish an interaction relation between mana configuration and a target/system | Which participants are required, and does BRAN specify a coupling pathway or activate one already specified? |
| VARE — prefer | Express a preference/priority among alternatives | Is the preference advisory for selection, a ranking operator, or an optimisation objective? It must not guarantee a physically feasible result. |

These semantic boundaries preserve the magic-system invariants: language is not mana; assignment is not causation; the desired effect is not its mechanism; coupling is distinct from the resulting effect; and resource/feasibility checks cannot be skipped.

## 5. Signature policy: do not invent executable forms yet

The source material does not currently establish complete signatures for the six forms. The following is a checklist of required evidence, not a proposed spoken syntax:

- **KREN:** entity/reference or symbolic state; intended established state; scope/owner if relevant.
- **TRAK:** input state; transformation specification; output-state relationship.
- **FREM:** condition/state to preserve; duration or termination condition; permitted control response.
- **SHREN:** identified active/held/prepared object; release mode or target state.
- **BRAN:** at least the interacting participants; interaction pathway or coupling specification.
- **VARE:** candidate alternatives; preference criterion or ordering; tie/unknown behaviour.

Do not encode these as final arities until source examples or an explicit design decision support them. A gloss is not a signature.

## 6. Lexical collisions: RE and RA

The Phase 6G audit identifies two collisions:

- `re`: digit 4 and a target-surface/fused-reference form.
- `ra`: radian unit and a target-path/fused-reference form.

These should remain marked ambiguous at the lexicon level. The appropriate language question is whether the recovered grammar supplies a deterministic lexical slot, boundary, or syntactic position that distinguishes each use. If not, the language needs an explicit disambiguation decision. A parser must not silently select the more convenient gloss.

The same principle applies to close sound contrasts such as FRAPA/FRATA/FRAKA, GRAN/GRAT/GRAK, and DREM/DRIM: retain attested forms while collecting pronunciation and noisy-channel evidence; do not rename by aesthetic preference alone.

## 7. Test suite for this reconciliation

These are acceptance criteria to run after the source-backed registry is built; they are not claimed executed or passed.

1. **Source traceability:** every form resolves to at least one exact source/version.
2. **No silent deletion:** all six magic-system forms remain discoverable even if their signatures are unknown.
3. **Versioned aliases:** FRATA/FRAJA and the other six mappings are represented as scoped compatibility evidence, not unconditional global rewrites.
4. **Collision preservation:** RE and RA each retain both source-attested records and an unresolved ambiguity flag.
5. **Signature honesty:** unknown arity is represented as unknown, not defaulted to unary or binary.
6. **Semantic separation:** KREN cannot mean “create matter” by inference; BRAN cannot be equated with effect; SHREN cannot be assumed to cancel every kind of state.
7. **No physical guarantee:** VARE cannot imply that the preferred candidate is feasible or will succeed.
8. **Canon safety:** no proposal in this document changes v3.0-L or Magic System v3.0.
9. **Learner usability:** a lookup can show gloss, source/version, status, alias information, and unresolved notes without needing to read every audit.
10. **Regression preservation:** all established v3.0-L meanings continue to appear unchanged in the canon view unless an explicit versioned decision supersedes them.

## 8. Decision ledger entry

- **Decision ID:** P7A-01
- **Existing rules and sources:** v3.0-L core operator inventory; Magic System v3.0 operational vocabulary; Phase 6G lexicon/alias audit.
- **Concrete defect:** vocabulary sources disagree on the presence of six operational forms and on seven preferred/legacy form mappings; two source lexicon collisions remain unresolved.
- **Options considered:** (A) overwrite the core list with the magic-system list; (B) globally apply alias mappings; (C) keep separate source/version records and reconcile explicitly.
- **Recommendation:** C.
- **Tests:** ten acceptance criteria listed above; not yet executed.
- **Decision status:** PROPOSAL. Requires review before any canon change.
- **Canon effect:** none.

## 9. Next language-development step

Recover the original Phase 4 decision D-032 and its exact version scope, then recover source-derived example clauses for KREN, TRAK, FREM, SHREN, BRAN, and VARE. For each, capture at least one positive example, one arity/slot counterexample, and the intended semantic type. Only then should the operator signature register be updated. In parallel, recover the contextual grammar for RE and RA before changing either lexical record.
