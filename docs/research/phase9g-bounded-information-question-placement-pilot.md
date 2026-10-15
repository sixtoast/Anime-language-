# Arcane Phase 9G — bounded information-question placement decision and contrast pilot

**Status:** Provisional Vernacular design proposal; not canon  
**Date:** 2026-10-15  
**Canon changes:** none  
**New Arcane forms:** none  
**Tests executed:** none; the fixtures below define a future manual/automated acceptance suite

## 1. Decision target

Phase 9F produced a minimal pilot using a candidate SVO pattern and the proposed yes/no particle `pun`. This phase selects one next capability: **information-question placement**, restricted to the proposed perception verb `wish` (“see”) and to questions about either of the two participant slots.

Clause negation is deliberately not added. The prior negation docket leaves the surface form, position, scope, interaction with questions and interaction with modality unresolved. Formal `GRAK` / preferred `GRASH` cannot be silently imported as a Vernacular negative marker.

## 2. Evidence boundary

The working proposal records these question words:

| Form | Proposed gloss | What is in scope here |
|---|---|---|
| `shuk` | who | Participant question in either slot, tested only with `wish` |
| `zosh` | what | Perceived-participant question, tested only with `wish` |
| `pun` | yes/no question particle | Mentioned only to define an unresolved interaction boundary |

These are proposed lexemes, not canon. The previous Phase 8Z and 9F documents already contain candidate examples `shuk wish fezo` and `teshi wish zosh`; their presence in prior pilot material is not independent validation.

## 3. Competing placement hypotheses

### Q-A — in-situ slot replacement

Replace the unknown participant with the question word in the position where that participant would occur in the candidate SVO pattern.

- Candidate: `shuk wish fezo` — “Who sees the friend?”
- Candidate: `teshi wish zosh` — “What does the person see?”

**Advantage:** question words occupy the semantic slot being asked about, and the simple clause order stays visible.

**Risk:** it assumes `shuk` and `zosh` can occupy noun-phrase slots and that `wish` supports the intended entity frame. Neither assumption is canonically established.

### Q-B — clause-initial question word

Place the question word at the start of the clause, regardless of its role.

This could distinguish information questions from statements by position, but it would require an additional mechanism to preserve the questioned role. No such movement, resumptive expression, or role marker is currently licensed. A surface example would therefore be invented rather than recovered.

### Q-C — dedicated question construction or role marking

Create a separately specified interrogative construction that encodes the questioned role independently of position.

This could be precise, but the necessary construction and marker inventory do not exist. No forms are proposed in this phase.

## 4. Comparison and provisional selection

| Criterion | Q-A: in-situ | Q-B: initial | Q-C: dedicated construction |
|---|---|---|---|
| Reuses existing pilot examples | Yes | No | No |
| Preserves candidate SVO slots | Yes | Not by itself | Potentially |
| Requires new morphology | No | Not necessarily, but requires movement rules | Likely or requires explicit structure |
| Role recovery with two slots | Direct if assumptions hold | Underspecified | Potentially strong |
| Evidence of established Arcane syntax | None | None | None |
| Suitable bounded experiment | **Yes** | No, until role recovery is specified | Later, if required |
| Canon-ready | No | No | No |

**Provisional choice:** Q-A, in-situ slot replacement, solely as the next bounded experiment for `wish`. This is the smallest testable extension of the existing pilot, not a general rule for every question word or verb.

## 5. Narrow pilot rule

For the experiment only:

1. Begin with a candidate simple perception clause `A wish B`.
2. To ask which participant fills the first slot, replace A with the appropriate proposed question word.
3. To ask which entity fills the second slot, replace B with the appropriate proposed question word.
4. Do not change the other participant or the verb frame at the same time.
5. Treat the result as experimental unless the slot interpretation is independently checked.
6. Do not append `pun` to an information question in this phase. Co-occurrence of information-question words and the yes/no particle is unresolved.

This pilot does not yet cover event/proposition complements of `wish`, animate versus inanimate restrictions, number, plurality, case marking, or non-default order.

## 6. Contrastive practice set

Every Arcane string below is a proposed experiment. English sentences describe the intended question, not canon translation equivalence.

| ID | Candidate string | Intended English | What it tests | Status |
|---|---|---|---|---|
| Q9G-01 | `teshi wish fezo` | The person sees the friend. | Baseline candidate clause | Proposed baseline |
| Q9G-02 | `shuk wish fezo` | Who sees the friend? | Question word in first participant slot | Experimental |
| Q9G-03 | `teshi wish zosh` | What does the person see? | Question word in second participant slot | Experimental |
| Q9G-04 | `fezo wish teshi` | The friend sees the person. | Reverse baseline | Proposed baseline |
| Q9G-05 | `shuk wish teshi` | Who sees the person? | First-slot question with different known second participant | Experimental |
| Q9G-06 | `fezo wish zosh` | What does the friend see? | Second-slot question with different first participant | Experimental |
| Q9G-07 | `teshi wish fezo pun` | Does the person see the friend? | Yes/no question comparator | Existing pilot hypothesis |
| Q9G-08 | `shuk wish fezo pun` | Not assigned | Whether `pun` co-occurs with information questions | Blocked / unresolved |

Do not infer that `shuk` means “whoever”, that `zosh` is valid for events or propositions, or that the question word itself supplies number or definiteness.

## 7. Acceptance criteria

The bounded experiment should be accepted only if a learner or future parser can meet all of the following:

| Test | Pass condition | Fail condition |
|---|---|---|
| A. Slot fidelity | `shuk wish fezo` asks for the first participant while keeping `fezo` as the second | The questioned role cannot be recovered |
| B. Object slot | `teshi wish zosh` asks for the second participant while keeping `teshi` as first | It is read as a first-slot or unrestricted question |
| C. Reversal | Baseline reversal changes the participant-role assignment | Reversed clauses collapse to one meaning |
| D. Minimal contrast | Only the intended slot changes between a baseline and its question counterpart | Other role or event meaning changes without a rule |
| E. Question type | Information question and yes/no question remain distinct | `pun` is assumed necessary or valid for every question |
| F. Scope honesty | Negated or embedded information questions remain blocked | A surface negative or embedded form is improvised |
| G. Lexical boundary | `shuk` and `zosh` retain only their proposed glosses within the pilot | Their meaning is extended without review |
| H. Provenance | Candidate examples remain tagged as pilot material | They are copied into canon as if source-attested |

No criterion is reported as passed in this document; they are the planned review suite.

## 8. Known failure boundaries

The pilot must stop and report unresolved grammar for:

- “Who does not see the friend?” — clause negation and question interaction unresolved.
- “Who can see the friend?” — modal frame and information-question interaction unresolved.
- “What does the person see in the house?” — phrase attachment and location construction unresolved.
- “What did the person see?” — tense/time reference not established by this pilot.
- “What does the person see and what does the friend see?” — coordination and repeated question structure unresolved.
- “What does the person see, the object or the event?” — the lexical frame of `wish` for entity versus event remains unresolved.
- “Does the person see who?” — co-occurrence with `pun` unresolved; do not reuse Q9G-08 as a translation.

## 9. Recommended next phase

Phase 9H should be a **question-pilot consistency review**, not immediate expansion into every question word. It should check whether the narrow in-situ hypothesis can be described without contradictions across the prior 8Z, 9A and 9F documents, then add a small set of learner prompts and a clear correction key.

After that, choose either:
- extend the question pilot to one additional verb frame, only after that frame is specified; or
- return to clause negation and decide its semantic scope and placement without borrowing formal operator syntax.

## 10. Decision record

- **Finding ID:** P9G-IN-SITU-QUESTION-PILOT-01
- **Capability selected:** information-question placement
- **Provisional mechanism:** replace the questioned participant in its candidate SVO slot
- **Test domain:** proposed `wish` entity-perception frame only
- **Question-word/yes-no-particle combination:** unresolved
- **Clause negation and modality:** excluded
- **New Arcane forms:** none
- **Canon changes:** none
- **Tests executed:** none
- **Source trail:** Phases 8X, 8Y, 8Z and 9A–9F
