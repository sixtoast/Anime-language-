# Arcane Phase 8Z — information-question architecture and dialogue pilot

**Status:** Bounded vernacular design proposal; not canon  
**Date:** 2026-10-15  
**Canon effect:** none  
**New vocabulary:** none  
**Historical clause evidence:** none recovered  
**Implementation changes:** none  
**Tests executed:** none

## 1. Purpose and decision boundary

Phases 8X–8Y established a proposed yes/no question particle (`pun`), response words (`wang`, `kor`, `gep`), and a set of question words. They also identified unresolved question-word placement and clause negation.

This phase narrows the information-question question to a workable learner pilot. It selects **in-situ placement as the primary test candidate** because it replaces the unknown constituent without requiring an extra fronting rule. This is a design recommendation, not a recovered historical fact or approved canon. The pilot retains the provisional SVO baseline from Phase 7E and the proposed clause-final position of `pun` for yes/no questions only.

## 2. Available source-recorded proposed vocabulary

The v5 draft lexicon lists these Phase 5 forms as **PROPOSED**:

| Form | Draft gloss |
|---|---|
| `shuk` | who |
| `zosh` | what |
| `ving` | where |
| `zul` | when |
| `gir` | why |
| `jup` | how |
| `pun` | yes/no question particle |
| `wang` | yes |
| `kor` | no |
| `gep` | maybe |
| `teshi` | person |
| `fezo` | friend |
| `gezi` | home |
| `losa` | water |
| `wish` | see |
| `zir` | say |
| `zem` | come |
| `ful` | go |

The source does not establish question-word placement, verb frames, or a canonical vernacular clause order. The forms and all examples below remain proposed.

## 3. Candidate rule set

### IQ-1 — in-situ information questions

Place the question word in the slot corresponding to the requested information. This is a candidate rule for testing, not canon.

- Subject/person unknown: `shuk wish fezo` → “Who sees the friend?”
- Object/entity unknown: `teshi wish zosh` → “What does the person see?”
- Goal/location unknown: `teshi zem ving` → “Where does the person come?”

The first two are structurally compatible with the provisional SVO hypothesis. The third assumes `zem` can take a goal/location complement, which is **not** established by its gloss “come”; it is included as a test target, not a validated sentence.

### IQ-2 — yes/no questions

Retain the Phase 8X candidate of placing `pun` at the end of a simple clause:

`teshi wish fezo pun` → “Does the person see the friend?”

This convention is still provisional. Co-occurrence of `pun` with information-question words is not specified; avoid combining them in learner examples until tested.

### IQ-3 — answers

Treat `wang`, `kor`, and `gep` as standalone response candidates:
- `wang` — yes;
- `kor` — no;
- `gep` — maybe.

Do not infer that `kor` is a clause-negation marker. Do not assume that a bare `wang` or `kor` unambiguously answers a negatively worded question; response polarity remains unresolved.

## 4. Pilot dialogue

The following is a **constructed exercise**, not a historical transcript or canon example. Where the lexical frame is unsupported, the note makes the uncertainty explicit.

| Turn | Proposed Arcane | Intended English | Evidence / caveat |
|---|---|---|---|
| 1 | `zis` | Hello. | Proposed interjection |
| 2 | `zis` | Hello. | Proposed interjection |
| 3 | `teshi wish fezo pun` | Does the person see the friend? | SVO and clause-final `pun` hypotheses |
| 4 | `wang` | Yes. | Standalone response candidate; proposition supplied by context |
| 5 | `teshi wish zosh` | What does the person see? | In-situ object-question candidate |
| 6 | `gep` | Maybe. | Standalone uncertainty response candidate |
| 7 | `shuk wish fezo` | Who sees the friend? | In-situ subject-question candidate |
| 8 | `kor` | No. | Only a negative response; does not express a full negative clause |
| 9 | English gloss only | The person does not see the friend. | Arcane clause remains unresolved pending negation rule |
| 10 | `lal` | Goodbye. | Proposed interjection |

This dialogue is intentionally short. Its function is to expose what can currently be trialled without hiding unresolved grammar behind invented forms.

## 5. Contrast set for information questions

| ID | Semantic target | Candidate strategy | Required validation |
|---|---|---|---|
| IQ-T01 | Who sees the friend? | Question word in subject slot | Does `shuk` behave as a nominal constituent? |
| IQ-T02 | Whom does the person see? | Question word in object slot | Does word order preserve agent/theme roles? |
| IQ-T03 | What does the person say? | Question word as message/content | Can `zir` take a content complement? |
| IQ-T04 | Where does the person go? | Question word as goal/location | Does `ful` encode goal, path, or only motion? |
| IQ-T05 | Where does the person come from? | Question word as source | Source relation is not established by `zem` |
| IQ-T06 | When does the person come? | `zul` in temporal slot | Temporal adjunct position and time reference unresolved |
| IQ-T07 | Why does the person go? | `gir` in reason slot | Reason adjunct syntax unresolved |
| IQ-T08 | How does the person go? | `jup` in manner/method slot | Manner vs means vs method distinction unresolved |
| IQ-T09 | Who does not see the friend? | Question word plus negation | Block until negation scope and question interaction are specified |
| IQ-T10 | Does the person see who? | Information question plus `pun` | Whether `pun` co-occurs with question words unresolved |

## 6. Why in-situ is the current test candidate

The in-situ proposal has three practical advantages for a first pilot:
1. It does not require a separate fronting transformation.
2. It gives the learner a consistent way to test subject and object questions against the SVO baseline.
3. It makes role confusion visible: if changing the question word's slot changes the intended participant, the frame or word order needs further marking.

Its weaknesses are also clear:
- question-word category and distribution are unverified;
- it may be ambiguous where role marking is absent;
- temporal, reason, manner and spatial adjunct slots are not specified;
- the available English glosses do not prove the proposed argument frame.

The proposal should be replaced if source evidence supports initial position, another construction, or distinct patterns by question type.

## 7. Do not collapse question types

A future grammar must separately specify:
- polar yes/no questions (`pun` candidate);
- constituent/information questions (`shuk`, `zosh`, `ving`, `zul`, `gir`, `jup`);
- rhetorical questions;
- echo questions and clarification requests;
- negative questions;
- embedded questions;
- questions inside formal control expressions.

Only the first two are in scope for this pilot, and even these remain provisional.

## 8. Learner-use boundary

A safe learner note at this stage is:

> The draft lexicon proposes question words and a yes/no particle. For practice, this pilot places information-question words in the position of the missing constituent and puts `pun` at the end of simple yes/no questions. These are experimental patterns, not yet canonical Arcane grammar. Use standalone `wang`, `kor`, or `gep` only as response candidates. Do not construct negative clauses until a vernacular negation rule is approved or recovered.

## 9. Next gate

Do not add more question examples until the following have been decided or source-recovered:
1. whether in-situ is the default for all information questions;
2. whether the proposed SVO baseline is approved;
3. which complements the verbs `wish`, `zir`, `ful`, and `zem` accept;
4. whether temporal/reason/manner adjuncts have fixed positions or explicit markers;
5. how information questions interact with negation and embedded clauses.

Then integrate the approved patterns into one learner-facing vernacular grammar and run the contrast fixtures against every example. The next goal is consolidation and testability, not another disconnected list.

- **Decision ID:** P8Z-INFORMATION-QUESTION-PILOT-01
- **Canon changes:** none.
- **New vocabulary:** none.
- **Implementation changes:** none.
- **Tests executed:** none.
