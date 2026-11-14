# Arcane Phase 9F — minimal Vernacular surface grammar pilot and practice corpus

> **SUPERSESSION NOTICE — Modern Vernacular v1.0 (2026-10-15):** This document is retained as a research/history record. For the bounded Modern Vernacular core, the binding rules are now in [Arcane Modern Vernacular v1.0 — Locked Core Grammar](../canon/arcane-modern-vernacular-v1.0-locked-core.md). Where this document labels SVO, information-question placement, polar-question placement, or clause negation as provisional/open, the v1.0 specification supersedes that status for its defined scope. Historical claims, other verbs, other registers, and explicitly blocked constructions remain outside that lock. Do not copy older candidate rules over the locked specification.



**Status:** Learner-pilot specification; proposed, not canon  
**Date:** 2026-10-15  
**Canon changes:** none  
**New Arcane forms:** none  
**Tests executed:** none; this document defines acceptance tests but does not claim a parser or speaker trial has run

## 1. Purpose

Phase 9E selected a controlled hybrid as the preferred *development architecture*. Phase 9F makes that choice practical by defining the smallest learner pilot that can be taught without pretending the unresolved grammar is complete.

The pilot deliberately uses only:
- proposed standalone social/response words;
- the candidate simple SVO pattern;
- the proposed yes/no question particle `pun`;
- a small set of reversible perception clauses using `wish` (“see”).

It does not attempt to solve all 28 semantic roles, invent case markers, or provide a surface form for clause negation, embedding, source/goal, recipient/beneficiary, or modality.

## 2. Status labels used throughout

- **PROPOSED LEXEME:** a form and gloss recorded in the working Vernacular proposal, not canon.
- **PILOT RULE:** an explicit rule used temporarily to make a small exercise set internally consistent.
- **UNRESOLVED:** no usable surface rule is established; do not improvise one.
- **BLOCKED:** a translation is withheld because the pilot lacks the grammar needed to express it safely.

Every complete sentence below is a proposed exercise form, not a canon example.

## 3. Pilot vocabulary

| Form | Working gloss | Status in this pilot | Boundary |
|---|---|---|---|
| `zis` | hello | PROPOSED LEXEME | Standalone greeting |
| `lal` | goodbye | PROPOSED LEXEME | Standalone farewell |
| `sil` | thanks | PROPOSED LEXEME | Standalone thanks |
| `wang` | yes | PROPOSED LEXEME | Standalone positive response; context supplies the proposition |
| `kor` | no | PROPOSED LEXEME | Standalone negative response only; not clause negation |
| `gep` | maybe | PROPOSED LEXEME | Standalone uncertainty response |
| `pun` | yes/no question particle | PROPOSED LEXEME + PILOT RULE | Clause-final position for this pilot only |
| `teshi` | person | PROPOSED LEXEME | Participant noun |
| `fezo` | friend | PROPOSED LEXEME | Participant noun |
| `wish` | see | PROPOSED LEXEME | Pilot perception predicate; exact lexical frame remains provisional |
| `losa` | water | PROPOSED LEXEME | Entity noun |
| `fape` | book | PROPOSED LEXEME | Entity noun |
| `shuk` | who | PROPOSED LEXEME | Question-word placement remains experimental |
| `zosh` | what | PROPOSED LEXEME | Question-word placement remains experimental |

The use of `teshi` and `fezo` as interchangeable participants in the role-reversal exercise is a pedagogical choice, not a claim that their meanings are identical or that animacy alone determines the verb frame.

## 4. Minimal pilot rules

### PILOT-1 — default order
For the narrowly defined simple perception exercise, use:

`PARTICIPANT-A + wish + PARTICIPANT-B`

Interpret A as the perceiver and B as the perceived participant **for this exercise only**. This is a provisional SVO hypothesis, not a universal Arcane word-order rule.

### PILOT-2 — role reversal
Switching the two participant expressions switches the intended perceiver/theme roles. If a learner or future implementation cannot recover that reversal, the item fails.

### PILOT-3 — yes/no question
Append `pun` to the candidate simple clause:

`PARTICIPANT-A + wish + PARTICIPANT-B + pun`

The placement is a pilot convention. No wider claim is made about the position of questions in embedded clauses, negated clauses, or other registers.

### PILOT-4 — responses
`wang`, `kor`, and `gep` are standalone response candidates. They do not by themselves provide an Arcane clause meaning “does not see”, “cannot see”, or “may not see”.

### PILOT-5 — no silent repairs
Do not invent an ending, role particle, word-order change, or adposition when a target meaning falls outside these rules. Label the target UNRESOLVED or BLOCKED.

## 5. Practice corpus

All rows are proposed pilot forms. The English prompt is the intended meaning, not evidence that the form is canonical.

| ID | Proposed pilot string | Intended English | Status and teaching note |
|---|---|---|---|
| VF-01 | `zis` | Hello. | PROPOSED LEXEME; standalone |
| VF-02 | `zis` | Hello. | PROPOSED LEXEME; suitable reply in the greeting exchange |
| VF-03 | `teshi wish fezo` | The person sees the friend. | PILOT RULE; simple SVO hypothesis |
| VF-04 | `fezo wish teshi` | The friend sees the person. | PILOT RULE; reversal contrast to VF-03 |
| VF-05 | `teshi wish fezo pun` | Does the person see the friend? | PILOT RULE; clause-final question hypothesis |
| VF-06 | `wang` | Yes. | PROPOSED LEXEME; interpretation depends on the prior question |
| VF-07 | `kor` | No. | PROPOSED LEXEME; response only, not a negative clause |
| VF-08 | `gep` | Maybe. | PROPOSED LEXEME; uncertainty response, not negation |
| VF-09 | `teshi wish zosh` | What does the person see? | EXPERIMENTAL; in-situ question-word slot not validated |
| VF-10 | `shuk wish fezo` | Who sees the friend? | EXPERIMENTAL; subject question-word slot not validated |
| VF-11 | `lal` | Goodbye. | PROPOSED LEXEME; standalone |
| VF-12 | `sil` | Thanks. | PROPOSED LEXEME; standalone |

### 5.1 Tiny dialogue: within the current boundary

1. A: `zis` — “Hello.”
2. B: `zis` — “Hello.”
3. A: `teshi wish fezo pun` — “Does the person see the friend?”
4. B: `wang` — “Yes.” (the preceding question supplies the proposition)
5. A: `lal` — “Goodbye.”

**Status:** Proposed practice dialogue. It demonstrates greeting, a candidate yes/no question, a context-dependent answer and farewell. It does not validate the question particle empirically or establish the grammar as canon.

## 6. Contrast tests and acceptance conditions

These are specifications for later manual or automated tests, not results already observed.

| Test ID | Input or target contrast | Pass condition | Fail condition | Current status |
|---|---|---|---|---|
| P9F-01 | `teshi wish fezo` vs `fezo wish teshi` | Intended perceiver and perceived participant reverse | Both strings are treated as same role assignment | Candidate rule; not run |
| P9F-02 | `teshi wish fezo` vs `teshi wish fezo pun` | Plain clause and yes/no question are distinct | `pun` is ignored or given an unsupported unrelated meaning | Candidate rule; not run |
| P9F-03 | `wang` as answer | Reads as positive response to the active question | Treated as a fully specified affirmative clause independent of context | Proposed response convention; not run |
| P9F-04 | `kor` as answer vs clause negation | Keeps response polarity distinct from internal clause negation | Infers a surface negative clause from `kor` alone | Required boundary; not run |
| P9F-05 | `gep` vs `kor` | Uncertainty and negative response remain distinct | Maybe is treated as no or as clause negation | Required boundary; not run |
| P9F-06 | `teshi wish zosh` | Question-word role and slot are explicitly marked experimental until validated | Learner is told its placement is established canon | Documentation acceptance; not run |
| P9F-07 | “The person does not see the friend” | Remains BLOCKED until clause negation is specified | An invented negative string is presented as established | Required boundary; not run |
| P9F-08 | “The person can see the friend” vs “is permitted to see” | Remains unresolved until modality distinctions are specified | Ability and permission are collapsed | Required boundary; not run |
| P9F-09 | “A gives X to B for C” | Remains blocked until recipient/beneficiary construction is licensed | A single relation silently encodes both | Required boundary; not run |
| P9F-10 | Historical token vs registered alias | Original form, preferred form and provenance remain distinguishable | Old material is globally rewritten | Provenance requirement; not run |

## 7. Deliberately blocked translations

The following English targets must not be filled in with invented Arcane strings during this pilot:

- The person does not see the friend.
- The person cannot see the friend.
- The person is permitted to see the friend.
- The person sees the friend in the house.
- The person goes to the house / comes from the house / travels along a path.
- The person gives the book to the friend for another person's benefit.
- The person says a story to the friend about a third person.
- The person wants the friend to leave.
- The person says that the friend does not come.

The blocks are specific: the current pilot does not yet specify clause negation, modality, relational phrase attachment, source/goal/path distinctions, recipient/beneficiary marking, communication frames or embedded-clause boundaries. Existing glosses cannot fill those gaps by implication.

## 8. How this pilot advances the language

This is the first bounded learner unit after the role-mechanism comparison. It gives a teacher or learner a small sequence to practise, a minimal pair that checks the SVO hypothesis, and a clear distinction between a question particle and standalone answers. It also defines explicit failure conditions so the pilot cannot silently expand into an unsupported grammar.

It intentionally does **not** claim that twelve strings constitute a complete conversational language. The next step should be to test and refine this small unit, then add one grammatical capability at a time only when its contrast set is specified.

## 9. Next development gate

Proceed to **Phase 9G — pilot review and next-capability selection**:

1. Review every practice item for consistency with the vocabulary proposal and preceding grammar decisions.
2. Separate forms usable as teaching hypotheses from forms whose placement is still experimental.
3. Decide whether the next bounded capability should be information-question placement or clause negation. Do not attempt both at once.
4. Before adding clause negation, resolve its scope and its interaction with `pun`, `wang`, `kor`, modality and embedded propositions.
5. Before expanding question words, resolve subject vs object question slots and distinguish `ving` (where) and `zul` (when) from adjunct/argument placement.

## 10. Decision record

- **Finding ID:** P9F-MINIMAL-VERNACULAR-PILOT-01
- **Pilot architecture:** controlled hybrid, restricted to simple candidate SVO clauses
- **Core contrast exercised:** participant-role reversal with `wish`
- **Question strategy:** clause-final `pun`, pilot-only
- **Response strategy:** standalone `wang`, `kor`, `gep`, context-dependent
- **New Arcane forms:** none
- **New canon rules:** none
- **Blocked domains:** clause negation, modality, relational roles, embedding, complex communication and transfer
- **Tests executed:** none
- **Source trail:** Phases 9A–9E; Phase 8X polarity pilot; Phase 8Z question/dialogue pilot
