# Arcane Phase 7M — controlled vernacular role-system prototypes

**Status:** Owner-reviewable design prototypes; none is canon  
**Date:** 2026-10-15  
**Decision ID:** P7M-ROLEPROTO-01  
**Canon effect:** none  
**Tests executed:** none; semantic design review only  
**Surface-form policy:** metavariables such as `AGENT:` and `RECIPIENT:` are explanatory labels, not Arcane words or proposed morphemes.

## 1. Purpose

Phases 7H and 7L compared architectures but deliberately did not choose one. This phase makes the trade-offs concrete using the ten participant-role prompts EX-001–EX-010. It does not invent Arcane markers. Each prototype is expressed in a neutral metalanguage so the owner can compare the grammar's behaviour before any new form or canon rule is introduced.

The proposed vernacular vocabulary remains proposed. In the examples below, `teshi`, `fezo`, `fape`, `rawu`, `wule`, `wish`, `bul`, `lil`, `las`, `pup`, `zir`, and `kong` are only lexical anchors from the draft lexicon; their use in a prototype does not upgrade their status or establish their frames.

## 2. Prototype A — strict default order

### Rule under test

Assume, for the experiment only:
- ordinary transitive clause = SUBJECT + VERB + OBJECT;
- the first noun phrase is the subject/agent or experiencer;
- the second noun phrase is the object/theme or affected participant;
- three-participant frames and obliques need additional separately defined constructions.

These are experimental assumptions, not source-derived Arcane rules.

### Test forms

| Prompt | Neutral schematic representation | What the prototype can say |
|---|---|---|
| EX-001: person sees friend | `teshi wish fezo` | Person is perceiver; friend is perceived |
| EX-002: friend sees person | `fezo wish teshi` | Roles reverse because positions reverse |
| EX-003: person gives book to friend | `teshi bul fape [RECIPIENT friend]` | Two slots alone do not encode recipient; extra construction needed |
| EX-005: gives book for friend's benefit | `teshi bul fape [BENEFICIARY friend]` | Requires a distinction not supplied by simple SVO |
| EX-006: takes book from friend | `teshi lil fape [SOURCE friend]` | Source role requires a separate rule |
| EX-007: helps friend | `teshi las fezo` | A two-participant pattern is possible, but exact verb frame remains unverified |
| EX-008: teaches friend a word | `teshi pup fezo rawu` | Three noun phrases make order alone insufficient unless a frame-specific order is defined |
| EX-009: tells friend a story | `teshi zir fezo wule` | Recipient/message roles need a documented frame |
| EX-010: wants a book | `teshi kong fape` | Experiencer/theme can be represented under the assumption |

**Assessment:** economical for the simplest clauses. It requires explicit frame rules for verbs such as GIVE, TAKE, TEACH and SAY. If those rules are numerous or inconsistent, the apparent simplicity is misleading.

## 3. Prototype B — overt role labels

### Rule under test

Every participant is assigned a semantic role independently of its position. The labels below are metalinguistic placeholders only:
- `AGENT:` — initiator or actor, if the verb frame uses one;
- `EXPERIENCER:` — entity that perceives, wants or experiences;
- `THEME:` — entity perceived, transferred, taken or desired;
- `RECIPIENT:` — entity that receives something;
- `BENEFICIARY:` — entity for whose benefit an event occurs;
- `SOURCE:` — origin of transfer or motion;
- `LEARNER:` and `CONTENT:` — participant roles in a teaching frame;
- `SPEAKER:`, `ADDRESSEE:`, `MESSAGE:` — roles in a saying/telling frame.

### Test forms

| Prompt | Neutral role-labelled representation |
|---|---|
| EX-001 | `EXPERIENCER:teshi + wish + THEME:fezo` |
| EX-002 | `EXPERIENCER:fezo + wish + THEME:teshi` |
| EX-003 | `AGENT:teshi + bul + THEME:fape + RECIPIENT:fezo` |
| EX-005 | `AGENT:teshi + bul + THEME:fape + BENEFICIARY:fezo` |
| EX-006 | `AGENT:teshi + lil + THEME:fape + SOURCE:fezo` |
| EX-007 | `AGENT:teshi + las + AFFECTED:fezo` |
| EX-008 | `AGENT:teshi + pup + LEARNER:fezo + CONTENT:rawu` |
| EX-009 | `SPEAKER:teshi + zir + ADDRESSEE:fezo + MESSAGE:wule` |
| EX-010 | `EXPERIENCER:teshi + kong + THEME:fape` |

**Assessment:** role identity is transparent and word order can in principle vary. But this representation is not a proposed Arcane surface syntax. A real system must decide whether roles are marked by prefixes, suffixes, independent particles, adpositions, agreement or another mechanism. It must also define attachment, scope, repetition, omission and interaction with questions and pragmatic particles. Without that decision, the system is a semantic notation, not a usable spoken grammar.

## 4. Prototype C — constrained hybrid

### Rule under test

For the experiment, use default order for a simple two-participant clause, and require explicit role disambiguation in a finite set of complex environments:
1. three or more core participants;
2. a source, goal, path or static-location contrast;
3. a recipient/beneficiary contrast;
4. an embedded clause whose participant roles could be confused with the matrix clause;
5. any construction where constituent movement or omission would make role recovery non-unique.

The architecture alone does not define the markers. This prototype intentionally leaves their surface realization open.

### Test forms

| Prompt | Default or marked? | Required semantic representation |
|---|---|---|
| EX-001 | Default candidate | `SUBJECT:teshi / wish / OBJECT:fezo` |
| EX-002 | Default candidate | `SUBJECT:fezo / wish / OBJECT:teshi` |
| EX-003 | Marked | `AGENT:teshi / bul / THEME:fape / RECIPIENT:fezo` |
| EX-004 | Same meaning as EX-003 | Must not depend on English dative alternation; same roles must be recoverable |
| EX-005 | Marked | `AGENT:teshi / bul / THEME:fape / BENEFICIARY:fezo` |
| EX-006 | Marked | `AGENT:teshi / lil / THEME:fape / SOURCE:fezo` |
| EX-007 | Default only if frame validated | `AGENT:teshi / las / AFFECTED:fezo` |
| EX-008 | Marked | `AGENT:teshi / pup / LEARNER:fezo / CONTENT:rawu` |
| EX-009 | Marked or embedded-clause rule | `SPEAKER:teshi / zir / ADDRESSEE:fezo / MESSAGE:wule` |
| EX-010 | Default candidate | `EXPERIENCER:teshi / kong / THEME:fape` |

**Assessment:** potentially balances concise everyday clauses with explicit high-risk distinctions. The chief failure risk is discretionary marking: if speakers can choose whether to mark a role without a clear rule, the listener cannot know whether the unmarked clause is simple, incomplete or ambiguous. The obligatory-marking list must therefore be exhaustive enough to be testable.

## 5. Cross-prototype stress cases

### 5.1 Reversal must reverse meaning

The pair EX-001/002 must not collapse to the same interpretation. A strict-order prototype achieves this only if order is fixed and not overridden by topic/question movement. A role-marking system achieves it only if the roles are encoded and attached unambiguously. A hybrid needs both a defined default and a defined override mechanism.

### 5.2 Recipient is not beneficiary

EX-003 and EX-005 differ semantically. “Give X to B” makes B the recipient; “give X for B's benefit” does not entail that B receives X. A grammar that uses one undifferentiated “for/to” relation fails this contrast. The proposed lexicon's `push` (“for”) does not establish a complete beneficiary construction and must not be stretched to cover recipient.

### 5.3 Source is not object

In EX-006, the friend is the source of the book, not the theme of the taking event. A grammar that simply lists nouns after a verb without frame rules may confuse these roles.

### 5.4 Verb frames must be lexicalised or compositional

The draft glosses do not prove that `bul` takes three arguments, that `pup` takes a content argument, or that `zir` allows a direct message plus an addressee. Each frame must be sourced, approved or left unresolved. Do not force every verb into the same transitive pattern.

### 5.5 Surface order is not semantic causation

These are spoken-language grammar prototypes, not spell-execution statements. No clause order, role marker or verb frame proves that a desired physical event is feasible or caused by an utterance. Preserve the canonical distinction between linguistic representation, physical construction and effect.

## 6. Scoring and present result

| Criterion | Prototype A: order | Prototype B: role labels | Prototype C: hybrid |
|---|---|---|---|
| Two-participant simplicity | Strong | Moderate | Strong |
| Explicit three-participant roles | Weak without extra rules | Strong in representation | Strong if marking is obligatory |
| New morphology required immediately | No | Not specified; likely | Not specified; likely |
| Can be spoken as shown today | Only as a labelled pilot, not canon | No; labels are meta-language | No; marking mechanism is unspecified |
| Risk of silent ambiguity | Moderate/high outside simple clauses | Low if role system complete | Moderate until trigger rules are exact |
| Historical support in inspected evidence | Insufficient | Insufficient | Insufficient |
| Canon-ready | No | No | No |

This score is qualitative and not a claim of empirical testing. No actual Arcane parser or speaker test has been run.

## 7. What must be decided before surface sentences are authored

The smallest meaningful owner decision is not “which exact marker should we invent?” It is:

**Should the vernacular be designed around (A) fixed order, (B) overt role marking, or (C) a constrained hybrid, if source recovery cannot establish the historical system?**

The decision should be made only after the original sources have been searched as far as available access permits. If the owner chooses C, the next approval must specify the default order and the required-marking contexts before any marker forms are proposed. If the owner chooses A or B, their missing frame or morphology rules must likewise be stated explicitly.

Until then:
- no marker forms are coined;
- no prototype is promoted to canon;
- Phase 7E example strings remain provisional;
- the Phase 7K semantic prompts remain the acceptance tests;
- ambiguous inputs must be labelled ambiguous, not silently repaired.

## 8. Decision ledger

- **Finding:** P7M-ROLEPROTO-01
- **Prototype alternatives prepared:** 3
- **Participant-role prompts examined:** EX-001–EX-010
- **New Arcane lexical forms:** none
- **New canonical rules:** none
- **Historical clauses recovered in this phase:** none
- **Parser tests executed:** none
- **Recommended next phase:** continue source recovery, then prepare an owner decision sheet with the exact trade-offs and consequences for the 34-prompt bank.
