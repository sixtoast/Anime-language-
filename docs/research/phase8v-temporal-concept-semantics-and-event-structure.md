# Arcane Phase 8V — temporal concept semantics and event-structure contrast bank

**Status:** Source-grounded semantic study; proposed temporal forms remain provisional  
**Date:** 2026-10-15  
**Canon effect:** none  
**New vocabulary:** none  
**Implementation changes:** none  
**Tests executed:** none

## 1. Purpose

The canonical v3.0-L specification explicitly names NOW, BEFORE, AFTER, DURATION, DELAY, RATE, UNTIL, DEADLINE and INTERVAL as temporal concepts, while stating that complete forms and operator signatures have not all been recovered. The v5 draft lexicon separately records proposed forms for several of these concepts.

This phase makes temporal meanings usable by distinguishing relations between events, properties of an event, scheduling constraints, and predictions about future states. It does not promote proposed forms to canon or invent surface syntax.

## 2. Evidence strata

### 2.1 Canon-grounded concept inventory

The v3.0-L specification names these temporal concepts:
- NOW
- BEFORE
- AFTER
- DURATION
- DELAY
- RATE
- UNTIL
- DEADLINE
- INTERVAL

The same specification identifies BEK as IF and ZET as WHILE in its formal control inventory. These are established inventory facts, not proof that a complete temporal grammar or all control semantics are specified.

### 2.2 Proposed lexicon forms

The v5 draft lexicon records the following as **PROPOSED**, sourced to Phase 4:
- `boni` — now (instant of evaluation)
- `vote` — before
- `fuwo` — after
- `kole` — until
- `shasu` — delay (offset before start)
- `wela` — duration
- `vitu` — repetition interval
- `showa` — deadline
- `leko` — predict (estimate future state)

Their presence in a draft lexicon does not establish canonical status, inflection, syntax, argument signatures or mutual compatibility. RATE is a named canonical concept but has no form in this list.

### 2.3 Existing control forms and performed clitics

The v5 lexicon also records BEK/IF and ZET/WHILE in the formal canon inventory. It lists performed clitics `s-` (IF), `sh-` (WHILE), and `f-` (UNTIL), with source/version qualifications. The exact relationship between proposed root `kole`, the performed `f-` form, and formal control syntax remains unresolved. These must not be merged into one universal form.

## 3. Four temporal dimensions

A useful temporal grammar must keep four dimensions separate:

1. **Ordering:** one event or state is before, after, or simultaneous with another.
2. **Extent:** how long an event/state lasts (duration).
3. **Scheduling:** when an event begins, repeats, or must occur (delay, interval, deadline).
4. **Epistemic projection:** a claim about a future state inferred from information (prediction).

These dimensions may interact, but they are not synonyms. In particular, delay is not duration; a deadline is not a duration; repetition interval is not necessarily the duration of each repetition; and prediction is not a temporal operator that makes the predicted event occur.

## 4. Concept-by-concept minimum semantics

| Concept | Source-grounded or draft gloss | Safe minimum | Must not infer |
|---|---|---|---|
| NOW | Canonical concept; proposed `boni` = evaluation instant | A reference instant | Universal present tense or event duration |
| BEFORE | Canonical concept; proposed `vote` | Temporal ordering before a reference | Causation or immediate succession |
| AFTER | Canonical concept; proposed `fuwo` | Temporal ordering after a reference | Causation or immediate succession |
| DURATION | Canonical concept; proposed `wela` | Extent over a temporal interval | Start time, repetition, or successful completion |
| DELAY | Canonical concept; proposed `shasu` = offset before start | A start offset relative to an anchor | Event duration or guarantee that start occurs |
| RATE | Canonical concept | Change/count per unit time, only as a broad concept pending formal definition | That rate manipulation equals time manipulation |
| UNTIL | Canonical concept; proposed `kole`, performed `f-` recorded separately | A temporal boundary/termination relation pending endpoint semantics | Whether endpoint is inclusive, or what exactly stops |
| DEADLINE | Canonical concept; proposed `showa` | A latest permitted or required time, pending modality | Event duration or proof that the event occurs |
| INTERVAL | Canonical concept; proposed `vitu` = repetition interval | Separation/period between occurrences, pending anchor policy | Duration of each occurrence |
| PREDICTION | Proposed `leko` = estimate future state | An information-based estimate of a future state | Measurement of the future or causal production of that state |

This table deliberately distinguishes canonical concept names from proposed lexical forms.

## 5. Contrastive temporal fixtures

These are English semantic test cases, not Arcane sentences.

| ID | Contrast | Required distinction |
|---|---|---|
| TEMP-01 | Event A occurs before B / A causes B | BEFORE does not entail causation |
| TEMP-02 | Event A occurs after B / A occurs immediately after B | AFTER does not entail adjacency |
| TEMP-03 | Event lasts five seconds / event starts in five seconds | Duration differs from delay |
| TEMP-04 | Event starts at t=5 and lasts 2 seconds / event must finish by t=5 | Start/duration differs from deadline |
| TEMP-05 | Repeat every 3 seconds / each occurrence lasts 3 seconds | Interval differs from duration |
| TEMP-06 | Continue until condition C / condition C becomes true at time t | A termination relation needs a defined event/condition target |
| TEMP-07 | Stop before condition C becomes true / stop at the instant C becomes true | Endpoint inclusivity must be specified |
| TEMP-08 | Predict state S at t=10 / measure state S at t=10 | Prediction differs from observation |
| TEMP-09 | Predict S / cause S | Prediction is not an effect-producing operator |
| TEMP-10 | A is true at evaluation instant / A remains true over interval I | NOW differs from duration |
| TEMP-11 | Rate is 5 units per second / time itself is altered | Rate differs from time manipulation |
| TEMP-12 | Repeat at fixed intervals / repeat when an external trigger occurs | Periodic scheduling differs from event-triggered scheduling |
| TEMP-13 | Deadline is missed / event has long duration | Deadline compliance differs from duration |
| TEMP-14 | Delay is relative to command issuance / delay is relative to condition C | Delay anchor must be explicit or recoverable |
| TEMP-15 | Event is scheduled / event actually executes | Scheduling does not guarantee execution |
| TEMP-16 | UNTIL relation ends an event / UNTIL relation bounds validity of a state | Target of termination must be typed or explicitly specified |

## 6. Event-structure vocabulary for analysis

For neutral research fixtures, describe an event with these separate fields:

```text
event_record:
  event_id: E
  start: t_start | unknown
  end: t_end | unknown
  duration: value-and-unit | unknown
  ordering_anchor: event-or-instant | none
  start_delay: value-and-unit | none
  deadline: instant-or-condition | none
  repetition_interval: value-and-unit | none
  termination_condition: condition | none
  frame_or_clock: clock-id | unresolved
  epistemic_status: observed | scheduled | predicted | hypothetical | unknown
```

This is a proposed analysis schema, not Arcane syntax. Its purpose is to prevent a single temporal word or gloss from collapsing multiple event properties into one.

## 7. UNTIL requires an explicit contract

UNTIL is especially consequential in control expressions. At minimum, a future specification must answer:

- What is being bounded: an event, a process, a state, a validity interval, or a control loop?
- Is the endpoint inclusive or exclusive?
- Is the condition sampled continuously, at discrete checks, or only when an event occurs?
- What happens if the condition is already true at entry?
- What happens if the condition never becomes true?
- Does termination mean stop issuing instructions, stop a process, invalidate a representation, or something else?
- How do the formal concept, proposed `kole`, and performed clitic `f-` relate across registers and versions?

No answer is canonically chosen here. These are minimum questions for any future contract.

## 8. Relationship to IF and WHILE

BEK is recorded as IF and ZET as WHILE. Their presence suggests control structures, but it does not settle evaluation timing, short-circuit behaviour, re-check frequency, loop termination, or how temporal relations scope over nested expressions.

The following distinctions must remain open until contracts are found:
- IF condition true at entry versus becoming true later;
- WHILE condition checked before each iteration versus after each iteration;
- UNTIL as the dual of WHILE versus an independent temporal boundary;
- nested IF/WHILE/UNTIL scope and evaluation order.

Do not infer programming-language semantics solely from English control glosses.

## 9. Temporal semantics are not physical feasibility

A schedule, duration, rate, deadline or termination condition does not establish that a physical effect is possible. The magic-system source explicitly distinguishes rate manipulation from time manipulation and describes temporal/causal feasibility as a separate failure concern.

A future temporal contract must not imply:
- a scheduled event necessarily executes;
- a predicted state is observed or caused;
- a deadline can be met without a feasible mechanism;
- duration is interchangeable with resource consumption;
- a temporal boundary supplies the force, energy or coupling needed for an effect.

Temporal grammar describes ordering and control constraints. Physical feasibility remains a separate requirement.

## 10. Next decision gate

The next phase should convert these distinctions into a small set of owner-reviewable temporal contracts. Priority order:

1. BEFORE/AFTER: define anchor types and whether ordering is strict, without implying causation.
2. DURATION/DELAY/DEADLINE/INTERVAL: define their separate anchors and units.
3. UNTIL: define target kind, endpoint policy, and its relationship to `kole` and `f-`.
4. PREDICTION: define input evidence and epistemic status, keeping it separate from measurement and causation.
5. RATE: recover or propose its dimensional contract without equating it with time manipulation.

Do not create more temporal inventories without converting decisions into contracts and fixtures.

## 11. Record

- **Decision ID:** P8V-TEMPORAL-SEMANTIC-DIMENSIONS-01
- **Canon changes:** none.
- **New vocabulary:** none.
- **Implementation changes:** none.
- **Tests executed:** none.
- **Grounded:** canonical temporal concept inventory; BEK/IF and ZET/WHILE labels; v5 draft status of listed proposed forms.
- **Unresolved:** temporal argument signatures, endpoint policy, anchor rules, clock/frame policy, evaluation order, and cross-register form mapping.
