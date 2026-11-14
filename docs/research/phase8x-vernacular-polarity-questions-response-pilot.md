# Arcane Phase 8X — vernacular polarity, questions and response particles pilot

**Status:** Constructed learner-facing design proposal; not canon  
**Date:** 2026-10-15  
**Canon effect:** none  
**New vocabulary:** none  
**Historical clause evidence:** none recovered  
**Implementation changes:** none  
**Tests executed:** none

## 1. Purpose

The previous phases produced a provisional SVO clause baseline and a conversation pilot, but everyday interaction still has a critical gap: asking a question, denying a proposition, and answering “no” are three different functions. A language cannot safely treat them as the same grammatical operation.

This phase develops a small testable pilot using only the proposed Phase 5 vernacular forms already in the draft lexicon. It does not coin a negation affix or promote a proposed particle to canon.

## 2. Evidence and scope

The v5 draft lexicon marks the following as proposed vernacular items:
- `pun` — yes/no question particle
- `wang` — yes
- `kor` — no
- `gep` — maybe
- `shuk` — who
- `zosh` — what
- `ving` — where
- `zul` — when
- `gir` — why
- `jup` — how
- `teshi` — person
- `fezo` — friend
- `gezi` — home
- `losa` — water
- `wish` — see
- `kong` — want
- `tek` — need
- `fam` — can
- `zir` — say

All are **PROPOSED** in the source lexicon. The pilot uses the Phase 7E SVO hypothesis only as a working baseline. No example below is historical or canonical.

## 3. The three-function distinction

### 3.1 Interrogative marking

A yes/no question asks whether a proposition is true. The proposed particle `pun` is glossed as a yes/no question particle. Its placement is not source-established; this pilot tests clause-final placement as a working convention.

### 3.2 Negative answer

A response such as `kor` (“no”) rejects or denies the proposition under discussion. It can be used as a standalone response in the pilot. This does **not** establish `kor` as a clause-negation operator.

### 3.3 Clause negation

Clause negation makes a proposition negative, roughly “The person does not see the friend.” The available lexicon does not establish a vernacular clause-negation form or its scope/placement. Formal `GRASH` (preferred over historical `GRAK` in the alias registry) is a formal operator and must not automatically be imported into vernacular syntax.

**Pilot rule:** use `kor` only as a standalone negative response. For negative clauses, record the intended English meaning and mark the Arcane surface form **UNRESOLVED**. Do not silently invent a construction.

## 4. Bounded learner pilot

The strings below test the available pieces without concealing the unresolved negative-clause rule.

| ID | Proposed pilot string | Intended meaning | Status / limitation |
|---|---|---|---|
| POL-001 | `zis` | Hello. | Proposed interjection |
| POL-002 | `wang` | Yes. | Standalone answer proposal |
| POL-003 | `kor` | No. | Standalone answer proposal; not clause negation |
| POL-004 | `gep` | Maybe. | Standalone answer proposal |
| POL-005 | `teshi wish fezo pun` | Does the person see the friend? | SVO + clause-final question-particle hypothesis |
| POL-006 | `teshi kong losa pun` | Does the person want water? | Same hypothesis; verb frame still provisional |
| POL-007 | `teshi tek losa pun` | Does the person need water? | Same hypothesis; verb frame still provisional |
| POL-008 | `shuk wish fezo` | Who sees the friend? | Question-word slot and order are experimental |
| POL-009 | `teshi wish zosh` | What does the person see? | Object question-word position is experimental |
| POL-010 | `ving teshi zem` | Where does the person come? | Location-question placement is experimental |
| POL-011 | UNRESOLVED | The person does not see the friend. | No vernacular clause-negation form established |
| POL-012 | UNRESOLVED | The person cannot help the friend. | Scope of negation over ability vs helping unresolved |
| POL-013 | UNRESOLVED | The person does not want water. | Negation scope over wanting unresolved |
| POL-014 | `wang` as answer to POL-005 | Yes, the person sees the friend. | Context supplies proposition; answer syntax is not fully specified |
| POL-015 | `kor` as answer to POL-005 | No, the person does not see the friend. | Negative answer does not specify an Arcane negative clause |
| POL-016 | `gep` as answer to POL-005 | Maybe. | Epistemic uncertainty, not negation |

The strings are teaching experiments, not a final grammar. Their purpose is to expose decisions rather than to imply those decisions have already been made.

## 5. Question-word placement: alternatives to retain

For information questions, at least three common design patterns are possible:
1. **Initial:** question word appears at the start of the clause.
2. **In-situ:** question word occupies the position of the missing constituent.
3. **Marked/particle-based:** a question word stays in place and another marker indicates the question.

The source glosses alone do not select one. POL-008 to POL-010 intentionally test the initial/in-situ candidates, but neither candidate is approved. A future decision must test at least:
- who is the agent vs who is the theme;
- what is the object vs what is said;
- where is the goal vs where the event occurs;
- whether question words can occur inside embedded propositions;
- whether `pun` is restricted to yes/no questions or can co-occur with question words.

## 6. Negative scope acceptance set

Any future vernacular negation rule must distinguish the following English meanings:

| ID | Intended meaning | Scope question |
|---|---|---|
| NEG-01 | The person does not see the friend. | Negation of perception event |
| NEG-02 | The person cannot see the friend. | Ability/modal operator vs negation |
| NEG-03 | The person may not see the friend. | Permission/prohibition vs uncertainty |
| NEG-04 | The person does not want water. | Negation of desire |
| NEG-05 | The person wants no water. | Negation/quantification over object |
| NEG-06 | Not the person sees the friend, but another person does. | Focus/contrast vs clause negation |
| NEG-07 | The person says that the friend does not come. | Negation scoped inside reported content |
| NEG-08 | The person does not say that the friend comes. | Negation scoped over speech act |
| NEG-09 | No person sees the friend. | Quantifier scope vs sentential negation |
| NEG-10 | The person does not always see the friend. | Negation vs frequency/aspect |

These are semantic tests, not Arcane strings. They must be retained when a negation form is recovered or designed.

## 7. Response polarity and truth conditions

The pilot adopts the following analytical distinctions:

- **Positive response** (`wang`): indicates acceptance/affirmation of the current question proposition, subject to context.
- **Negative response** (`kor`): indicates rejection/denial of the current question proposition, subject to context.
- **Uncertain response** (`gep`): indicates the speaker does not commit to either polarity.
- **Clause negation:** changes the proposition expressed by a clause and requires its own grammatical contract.

This leaves an important dialogue question open: when answering a negatively phrased question, does `wang` affirm the negative proposition, or does it mean “yes, the positive counterpart is true”? Languages differ here. The lexicon glosses do not decide it, so this must be explicitly tested rather than imported from English.

## 8. Register boundary

This pilot is Vernacular only. It does not change:
- Formal `BEK` / IF;
- Formal `ZET` / WHILE;
- Formal `GRASH` / NOT and its historical alias `GRAK`;
- the Phase 2 abstract audit notation;
- any parser's provisional interpretation.

Formal NOT is not automatically a vernacular negative particle. A vernacular answer particle is not automatically a formal logical operator.

## 9. Review decisions

| ID | Decision | Candidate for review | Current status |
|---|---|---|---|
| PV-01 | Yes/no question marker | Clause-final `pun` in simple clauses | Proposal only |
| PV-02 | Negative response | Standalone `kor` | Proposal only |
| PV-03 | Uncertain response | Standalone `gep` | Proposal only |
| PV-04 | Question-word placement | Initial vs in-situ; test by question type | Unresolved |
| PV-05 | Clause negation | Recover source form or design separately | Unresolved |
| PV-06 | Negated-question answers | Define whether answer tracks polarity or truth of positive counterpart | Unresolved |
| PV-07 | Formal/vernacular negation | Keep separate unless an explicit register mapping is approved | Recommended boundary, not new canon |

## 10. Outcome and next step

This phase makes a useful slice of everyday interaction testable without fabricating a negative-clause marker. The next phase should not merely add more sample questions. It should either recover the missing vernacular negation and question rules from source material or present a compact owner-reviewable choice among alternatives, then apply the selected rule consistently across a short dialogue.

- **Decision ID:** P8X-VERNACULAR-POLARITY-PILOT-01
- **Canon changes:** none.
- **New vocabulary:** none.
- **Implementation changes:** none.
- **Tests executed:** none.
