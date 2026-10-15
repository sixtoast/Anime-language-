# Arcane Phase 8W — bounded temporal contract proposal and acceptance criteria

**Status:** Owner-reviewable proposal; no temporal form or contract promoted to canon  
**Date:** 2026-10-15  
**Canon effect:** none  
**New vocabulary:** none  
**Implementation changes:** none  
**Tests executed:** none

## 1. Purpose and stopping rule

Phase 8V separated ordering, extent, scheduling, and prediction. This phase turns those distinctions into a bounded contract proposal and acceptance criteria. It does not add another general inventory. It identifies the minimum choices required before a temporal grammar can be implemented safely.

Canonical v3.0-L names NOW, BEFORE, AFTER, DURATION, DELAY, RATE, UNTIL, DEADLINE and INTERVAL, but says complete forms/signatures are not all recovered. The forms boni, vote, fuwo, kole, shasu, wela, vitu, showa and leko remain PROPOSED in the v5 draft lexicon. Therefore the labels below are semantic concept names in research metalanguage; they are not Arcane operator signatures.

## 2. Contract record template

Every approved temporal contract should specify:

```text
temporal_contract:
  concept: BEFORE | AFTER | NOW | DURATION | DELAY | RATE | UNTIL | DEADLINE | INTERVAL | PREDICTION
  semantic_kind: ordering | instant | extent | offset | rate | boundary | constraint | recurrence | epistemic
  anchor_kind: instant | event | condition | clock | interval | unresolved
  input_types: explicit list or unresolved
  output_or_assertion: explicit description
  units: required | not-applicable | unresolved
  endpoint_policy: inclusive | exclusive | not-applicable | unresolved
  missing_value_policy: reject | unresolved | explicit default
  surface_form: canonical form or unresolved
  register_and_version: source-specific
  evidence_status: canon-fact | approved-contract | proposal | unresolved
```

This is a proposal for specification structure only. The field names are not Arcane tokens.

## 3. Proposed minimum semantic contracts

### TCON-01 — BEFORE

**Minimum meaning:** event/state A is temporally earlier than event/state B, relative to a common or explicitly related time basis.

**Must not imply:** causation, immediate succession, or that either event actually occurred if the record is hypothetical.

**Required decisions:** what kinds of temporal entities may be compared; whether equality is excluded; how incompatible clocks or uncertain timestamps are handled.

**Research recommendation:** model BEFORE as strict ordering by default in fixtures, but keep that default non-normative until approved. Strict ordering means A precedes B and is not simultaneous with B.

### TCON-02 — AFTER

**Minimum meaning:** event/state A is temporally later than event/state B, relative to a common or explicitly related time basis.

**Must not imply:** causation, immediate succession, or any specific delay.

**Research recommendation:** make AFTER directionally consistent with BEFORE under the same time basis. Do not assume its surface form or argument order from English.

### TCON-03 — NOW

**Minimum meaning:** a reference instant used to evaluate or anchor a temporal claim.

**Must not imply:** that a state holds over an interval, or that a clause is grammatically present tense.

**Research recommendation:** require a declared evaluation clock/time basis in abstract fixtures. The proposed form `boni` is not canonical.

### TCON-04 — DURATION

**Minimum meaning:** an extent of time associated with an event or state.

**Must not imply:** a start instant, a deadline, a repetition schedule, or successful completion.

**Required decisions:** permitted units, exact versus bounded duration, unknown duration, and whether state validity and event duration share one contract.

**Research recommendation:** represent duration as an extent with an explicit unit. Do not silently interpret a bare scalar as seconds or another unit.

### TCON-05 — DELAY

**Minimum meaning:** an offset between an anchor and a scheduled start or other designated temporal point.

**Must not imply:** duration of the event or guaranteed execution.

**Required decisions:** anchor kind, offset units, sign policy (whether negative offsets are allowed), and what happens if the anchor is unknown.

**Research recommendation:** require both an anchor and a unit in the abstract contract. The proposed form `shasu` does not establish a surface signature.

### TCON-06 — DEADLINE

**Minimum meaning:** a temporal limit by which a designated event or condition is required or permitted to be satisfied, with modality made explicit.

**Must not imply:** that the event will occur, how long it lasts, or that it starts at the deadline.

**Required decisions:** whether a deadline is a latest completion time, latest start time, or either under an explicit subtype; whether the endpoint is inclusive; whether the requirement is obligation, target, or permission.

**Research recommendation:** distinguish deadline type and modality in the semantic contract. Do not collapse “must finish by” and “should start by”.

### TCON-07 — INTERVAL / recurrence

**Minimum meaning:** a temporal separation or period between occurrences, pending definition of whether it is fixed or variable.

**Must not imply:** the duration of each occurrence or a guaranteed number of repetitions.

**Required decisions:** anchor, fixed versus variable interval, drift/tolerance, recurrence count, stop condition, and clock basis.

**Research recommendation:** represent recurrence interval separately from occurrence duration. The proposed form `vitu` does not decide any of these details.

### TCON-08 — RATE

**Minimum meaning:** a quantity change or event count relative to a time unit, with the numerator and denominator dimensions explicitly defined.

**Must not imply:** manipulation of time itself, state restoration, or guaranteed control over a process.

**Required decisions:** quantity per time, events per time, or another rate kind; dimensional typing; measurement window; instantaneous versus average rate.

**Research recommendation:** require an explicit rate kind and time unit. Preserve the magic-system distinction between rate manipulation and time manipulation.

### TCON-09 — UNTIL

**Minimum meaning:** a relation that bounds the continuation or validity of a specified event/process/state by a temporal endpoint or condition.

**Must not imply:** one universal termination action; endpoint inclusivity; continuous condition monitoring; or guaranteed arrival at the endpoint.

**Required decisions:** target kind, endpoint policy, condition evaluation frequency, entry-if-already-true behavior, never-true behavior, and relation between formal UNTIL, proposed `kole`, and performed `f-`.

**Research recommendation:** treat UNTIL as incomplete until the bounded target and endpoint policy are explicit. Do not infer that it is simply the inverse of WHILE.

### TCON-10 — PREDICTION

**Minimum meaning:** an estimate of a future state derived from information and an inference model.

**Must not imply:** direct measurement of the future, certainty, causation, or production of the predicted state.

**Required decisions:** evidence source, prediction time, target time, uncertainty/confidence representation, model provenance, and what makes a prediction stale.

**Research recommendation:** keep prediction epistemically typed and separate from observation/measurement. Proposed `leko` is not canonical.

## 4. Cross-contract invariants

Any approved temporal grammar should preserve these invariants:

1. BEFORE/AFTER encode ordering, not causation.
2. NOW is an instant/anchor, not duration.
3. DURATION is extent, not delay.
4. DELAY requires a reference anchor; no implicit unit should be guessed.
5. DEADLINE does not guarantee completion.
6. INTERVAL is recurrence spacing, not occurrence length.
7. RATE is dimensionally explicit and not equivalent to time manipulation.
8. UNTIL identifies what is bounded and how the endpoint is treated.
9. PREDICTION remains an estimate, not an observation or cause.
10. Scheduling, prediction and temporal representation do not establish physical feasibility.
11. A missing or incompatible clock/frame must not be silently ignored.
12. Unknown contract details must produce an unresolved status, not an invented default.

## 5. Acceptance fixture set

The following fixtures are acceptance requirements for a future checker. They have not been executed.

| ID | Input distinction | Required result |
|---|---|---|
| TW-01 | A before B versus A causes B | Ordering must not entail causation |
| TW-02 | A after B versus A immediately after B | Ordering must not entail adjacency |
| TW-03 | Duration = 5 s versus delay = 5 s | Distinct contract kinds |
| TW-04 | Finish by t versus start by t | Distinct deadline subtypes |
| TW-05 | Repeat every 3 s; occurrence lasts 1 s | Interval and duration coexist without conflict |
| TW-06 | Repeat every 3 s; occurrence lasts 4 s | Overlap policy is explicit or unresolved, not silently prohibited |
| TW-07 | UNTIL condition true at entry | Behavior determined by explicit entry policy |
| TW-08 | UNTIL condition never becomes true | Behavior determined by explicit nontermination policy |
| TW-09 | UNTIL condition evaluated discretely | No claim of continuous monitoring |
| TW-10 | Prediction says state S at future time | Result remains prediction, not measurement |
| TW-11 | Predicted state differs from observed state | Preserve discrepancy; do not rewrite prediction as observation |
| TW-12 | Rate is quantity/time | Dimensions and measurement window must be explicit |
| TW-13 | Two timestamps from unrelated clocks | Comparison blocked or unresolved absent mapping |
| TW-14 | Scheduled event lacks feasible mechanism | Scheduling does not prove execution |
| TW-15 | Proposed `kole` and performed `f-` appear in different source strata | Preserve source/register distinction |
| TW-16 | Temporal expression has no recovered surface form | Do not fabricate executable Arcane syntax |

## 6. Interaction with IF and WHILE

BEK/IF and ZET/WHILE have canonical inventory status, but this phase does not assign programming-language evaluation semantics to them.

Before temporal nesting is specified, a future control contract must explicitly settle:
- condition evaluation timing;
- whether a condition is checked once or repeatedly;
- pre-test versus post-test loop behavior;
- nested scope and evaluation order;
- what an UNTIL boundary terminates;
- behavior if a loop's condition never changes.

No implicit equivalence among WHILE, UNTIL, and performed clitics should be assumed.

## 7. Reviewable decisions

| ID | Decision | Recommended default for review | Normative now? |
|---|---|---|---|
| TREV-01 | BEFORE/AFTER equality | Strict ordering for fixtures | No |
| TREV-02 | Time basis | Explicit clock/time basis in research records | No |
| TREV-03 | Bare duration scalar | Reject/flag missing unit | No |
| TREV-04 | Delay anchor | Require explicit anchor | No |
| TREV-05 | Deadline meaning | Distinguish start and completion deadline | No |
| TREV-06 | Recurrence overlap | Explicit policy; do not assume impossible | No |
| TREV-07 | UNTIL endpoint | Explicit inclusive/exclusive policy | No |
| TREV-08 | UNTIL condition sampling | Explicit evaluation policy | No |
| TREV-09 | Prediction confidence | Represent uncertainty/provenance separately | No |
| TREV-10 | Forms and register mapping | Preserve v2.0 performed forms and Phase 4 proposals separately | No |

## 8. Implementation gate

The website's current provisional parser must not be claimed to validate these temporal contracts unless support is explicitly added and tested. This phase is documentation and contract design only. A later implementation task should:
1. encode the approved contract as structured data;
2. add positive and negative fixtures to a suitable test harness;
3. report unresolved signatures separately from syntax errors;
4. verify that temporal constructs do not imply physical execution;
5. preserve source/version metadata for proposed forms.

## 9. Outcome and next phase

This phase provides a bounded temporal contract package and sixteen acceptance fixtures. It is the hand-off point from semantic analysis to a focused decision/recovery task, not a claim that temporal grammar is complete.

Next:
- recover source examples or signatures for temporal forms if a DOCX-aware route is available;
- otherwise seek owner review of the explicit alternatives above;
- once approved, implement and run tests rather than authoring further inventories;
- then move to the next language subsystem.

- **Decision ID:** P8W-TEMPORAL-CONTRACT-PROPOSAL-01
- **Canon changes:** none.
- **New vocabulary:** none.
- **Implementation changes:** none.
- **Tests executed:** none.
