# Arcane Phase 7D — temporal semantics and control construction proposal

**Status:** Design proposal; not canon  
**Date:** 2026-10-15  
**Sources inspected:** `docs/canon/arcane-language-v3.0-L.md`, `docs/audits/phase-2-formal-syntax.md`, `sources/originals/Arcane_Lexicon_v5_draft.csv`, `docs/canon/magic-system-v3.0.md`  
**Canon effect:** none

## 1. Purpose and source-grounded starting point

The v3.0-L specification says Arcane represents temporal relationships explicitly rather than relying on ordinary grammatical tense. It names NOW, BEFORE, AFTER, DURATION, DELAY, RATE, UNTIL, DEADLINE and INTERVAL, but states that complete forms and operator signatures have not all been recovered.

The v5 draft lexicon records these candidate entries, all marked `PROPOSED` and attributed to Phase 4:
- `boni` — now (instant of evaluation)
- `vote` — before
- `fuwo` — after
- `kole` — until
- `shasu` — delay (offset before start)
- `wela` — duration
- `vitu` — repetition interval
- `showa` — deadline
- `leko` — predict (estimate future state)

The established control operators in v3.0-L are `BEK` (IF) and `ZET` (WHILE). Phase 2 formal-syntax audit says their exact evaluation, else-branch, termination and timing semantics remain unresolved. The v5 draft also records performed clitics `s-` (IF), `sh-` (WHILE), and `f-` (UNTIL), marked as v2.0 performed forms.

This evidence is enough to design a semantic separation and tests. It is not enough to declare the candidate temporal forms canonical or invent their surface argument order.

## 2. Proposed temporal type inventory

The language should distinguish these semantic types before assigning final syntax.

| Type ID | Name | Meaning | Example value in explanatory metalanguage |
|---|---|---|---|
| T-INSTANT | Instant | One point in a timeline or execution trace | instant `t` |
| T-ORDER | Temporal ordering | Relation between two instants/events | `before(t1,t2)` |
| T-DURATION | Duration | Elapsed amount of time | `duration = 3 s` |
| T-OFFSET | Delay/offset | Wait amount before an action becomes eligible to start | `start = trigger + 2 s` |
| T-PERIOD | Repetition interval | Separation between successive eligible repetitions | `period = 5 s` |
| T-DEADLINE | Deadline | Latest permitted instant for a condition or action | `finish ≤ deadline` |
| T-BOUND | Until-bound | Condition/event delimiting an active interval | `active while not terminated-by(E)` |
| T-FORECAST | Forecast | Estimate of a future state, with uncertainty | `estimate(state at t+Δ)` |
| T-RATE | Rate | Quantity change per unit time | `Δx/Δt` |

These are proposed semantic distinctions for design and validation, not new Arcane lexical meanings. The source names support the distinctions in broad outline, but full signatures, units and composition rules still require recovery.

## 3. Do not collapse the temporal concepts

The following distinctions should be treated as design requirements.

### 3.1 BEFORE/AFTER are relations, not durations

`vote` and `fuwo` are glossed “before” and “after”. A relation can order two events without specifying how far apart they are.

- `before(A,B)` does not state that B starts immediately after A.
- `after(A,B)` does not state that A lasts for any particular duration.
- Neither relation alone implies causation.

### 3.2 DELAY is not DURATION

The lexicon glosses `shasu` as “delay (offset before start)” and `wela` as “duration”.

- A delay constrains when an action may start relative to a reference event or evaluation instant.
- A duration constrains how long an action/state remains active or how much elapsed time an interval contains.
- A delayed action may have zero, finite or unknown duration; a duration does not itself delay the start.

### 3.3 PERIOD is not RATE

`vitu` is glossed “repetition interval”. It should not be treated as a generic rate. A repetition interval specifies spacing between repetitions; a rate may describe a continuous or average change per time.

If a construction uses both a period and a duration, the grammar must define whether repetitions continue until duration expires, until a separate event occurs, or until another control condition becomes false.

### 3.4 DEADLINE is not UNTIL

`showa` is glossed “deadline”; `kole` is glossed “until”.

- A deadline is a latest permitted time for an event or completion condition.
- An until-bound marks the endpoint/termination condition of an active interval.
- A process may stop at an until-event before its deadline; meeting a deadline does not imply that a process must run continuously until that instant.

### 3.5 PREDICT is not future truth

`leko` is glossed “predict (estimate future state)”. Its result should be understood as an estimate, not as a guaranteed future state. A prediction must not silently become an assignment, binding, observation or causal trigger.

## 4. Proposed compositional model (explanatory metalanguage only)

Until Arcane argument syntax is recovered, use the following neutral semantic notation in research and tests. These are **not Arcane sentences** and must not be displayed as executable Arcane code.

- `At(instant, expression)`: evaluate an expression at an instant.
- `Before(event_A, event_B)`: constrain their order.
- `After(event_A, event_B)`: constrain their order.
- `Delay(reference_instant, offset, action)`: make action eligible no earlier than reference plus offset.
- `For(action, duration)`: constrain active duration.
- `Repeat(action, period, stop_condition)`: schedule repeated eligible actions at a specified period until the stop condition is met.
- `By(action, deadline)`: require the completion condition by the deadline.
- `Until(action, termination_event)`: keep the action active only until the termination event or condition is reached.
- `Predict(state_expression, horizon)`: produce an estimate of a future state at the specified horizon.

The final Arcane operator signatures may differ. These placeholders exist to force distinct meanings and to make examples testable before committing to actual word order.

## 5. Relationship to BEK and ZET

The core specification lists `BEK` as IF and `ZET` as WHILE. The syntax audit records the arity of each as proposed and flags unresolved semantics.

### BEK — conditional control

The minimum semantic question is whether BEK evaluates its condition once when entering the construction or repeatedly during execution. Those alternatives are not interchangeable.

Required design decisions:
1. evaluation point: entry-time, each iteration, or explicitly supplied;
2. false-condition behaviour: skip, choose an else branch, or return a value;
3. whether the branches must have compatible result types;
4. whether the condition may depend on a changing observation;
5. whether temporal conditions are evaluated against one clock/reference.

No ELSE form is selected by this proposal.

### ZET — repeated conditional control

The source gloss “while” does not alone settle whether the condition is tested before the first iteration or after each iteration, nor whether execution can be interrupted asynchronously.

Required design decisions:
1. pre-test versus post-test semantics;
2. evaluation timing of the condition;
3. termination behaviour and maximum-iteration/timeout handling;
4. whether each repetition has an independent effect or contributes to a single result;
5. interaction with explicit duration, deadline, period and until-bound;
6. whether a failed or expired precondition aborts, skips or reports a diagnostic.

A parser accepting `ZET` syntax cannot claim that a loop is safe, terminating or physically feasible. Those are separate validation stages.

## 6. Performed clitics and formal forms

The v5 draft records `s-`, `sh-` and `f-` as performed forms associated with IF, WHILE and UNTIL. The source does not, in the material inspected, specify all attachment, boundary, stress and nesting rules.

Conservative rules for tooling:
- retain the forms and their performed-register status;
- do not assume they can attach to every expression type;
- do not infer attachment order when two clitics are adjacent;
- do not assume `f-` and `kole` are freely interchangeable in every register;
- only normalise a performed construction to formal notation when the parse is unambiguous and the conversion rule is documented;
- preserve the original surface string and a conversion trace.

The candidate relationship between formal `kole` and performed `f-` is a likely cross-register mapping, not a fully recovered grammar rule.

## 7. Temporal units and dimensional correctness

Any duration, delay, interval, deadline offset or rate must have a defined unit and reference. The type system should reject or flag at least:
- adding two instants as if they were durations;
- comparing a duration directly with an instant;
- using a length unit where a time unit is required;
- treating a repetition interval as a count;
- combining incompatible time bases without a conversion;
- using an unspecified unit where the operation requires a physical duration.

The current evidence does not establish the full canonical temporal-unit inventory or conversion table. This document therefore requires dimensional checking but does not invent a unit vocabulary.

## 8. Acceptance tests for temporal meaning

These are test specifications, not tests claimed to have run.

| ID | Case | Expected distinction |
|---|---|---|
| TEMP-001 | BEFORE(A,B) | Orders events; does not imply a duration |
| TEMP-002 | AFTER(A,B) | Orders events; does not imply causation |
| TEMP-003 | DELAY(action, offset) | Constrains earliest start, not action duration |
| TEMP-004 | DURATION(action, amount) | Constrains elapsed active time, not start time |
| TEMP-005 | PERIOD(action, amount) | Specifies repeat spacing, not continuous change rate |
| TEMP-006 | DEADLINE(action, instant) | Specifies latest completion, not mandatory continuous activity |
| TEMP-007 | UNTIL(action, event) | Specifies termination boundary; may end before deadline |
| TEMP-008 | PREDICT(state, horizon) | Returns estimate, not guaranteed state or assignment |
| TEMP-009 | BEK with changing condition | Requires a defined evaluation policy |
| TEMP-010 | ZET with false condition initially | Behaviour unresolved until pre/post-test semantics are decided |
| TEMP-011 | ZET with no termination path | Must not be claimed terminating |
| TEMP-012 | Delay with incompatible units | Type/dimension diagnostic |
| TEMP-013 | Duration compared directly with instant | Type diagnostic unless an explicit conversion/reference exists |
| TEMP-014 | Formal `kole` vs performed `f-` | Conversion only if source-backed rule uniquely maps them |
| TEMP-015 | Nested UNTIL and ZET | Nesting and precedence must be explicit; no guess |
| TEMP-016 | Deadline expires before action can start | Report temporal infeasibility; do not execute as though valid |
| TEMP-017 | Prediction used as a condition | Requires explicit semantics for uncertain/unknown result |
| TEMP-018 | Repetition interval without stop condition | Requires explicit finite/infinite execution policy |

## 9. Decisions intentionally not made

This proposal does not decide:
- canonical status of the Phase 4 temporal words;
- exact signatures or surface argument order;
- BEK's else branch or evaluation timing;
- ZET's pre-test/post-test semantics;
- whether UNTIL is represented by `kole`, `f-`, or both in specific contexts;
- temporal unit names or conversions;
- whether predictions can control execution;
- loop scheduling, concurrency or runtime semantics.

Those decisions require source examples or explicit approval.

## 10. Recommended next step

Recover the Phase 4 examples and signatures for the temporal forms and the original control examples for BEK/ZET. Then create a versioned grammar proposal with at least one positive example, one counterexample and one ambiguity case per construction. If the historical material is unavailable, present explicit design alternatives for approval rather than silently promoting this proposal to canon.

## 11. Status

- Source inventory inspected: **yes**.
- Temporal semantic distinctions organised: **yes, as a proposal**.
- Canon changed: **no**.
- Arcane surface syntax invented: **no**.
- Automated tests executed: **no**.
- Concrete progress: temporal concepts now have separate testable meanings and the control questions that block final grammar are enumerated.
