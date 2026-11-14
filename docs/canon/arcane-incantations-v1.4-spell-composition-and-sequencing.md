# Arcane Incantations v1.4 — Spell Composition and Sequencing

**Status:** LOCKED DESIGN CANON for the bounded modern incantation layer  
**Depends on:** Incantations v1.0–v1.3  
**Validation status:** 40 specification fixtures. These are documented expected outcomes, not evidence that an executable parser, scheduler, transaction engine, or spell simulator has passed them.

## 1. Purpose and boundary

Version 1.4 defines how multiple operation steps are composed into one declared spell plan. It specifies step identity, explicit dependencies, ordering, shared and local bindings, intermediate results, failure propagation, and the distinction between a sequential plan and an atomic transaction.

This is a modern semantic layer. It does not claim to reconstruct historical sequencing syntax, and it does not introduce new spoken tokens. The record notation below is specification metalanguage, not a literal incantation.

A well-formed plan is not necessarily feasible; a feasible plan is not authorised; an authorised plan is not necessarily executed; and reported execution is not proof of the requested final state.

## 2. Plan and step records

Represent a plan conceptually as:

**PLAN = (PLAN-ID, STEPS, DEPENDENCIES, BINDING-SCOPE, FAILURE-POLICY, COMPLETION-TEST)**

Each step is:

**STEP = (STEP-ID, OPERATION, INPUTS, OUTPUTS, PRECONDITIONS, CONSTRAINTS, POSTCONDITIONS)**

Rules:
- PLAN-ID and STEP-ID values must be unique within their declared scope.
- Every step must use an operation permitted by v1.0 and satisfy the reference, constraint and mechanism requirements of v1.1–v1.3.
- Inputs and outputs must be typed according to their owning subsystem.
- A step may consume only values that are available at that point in the plan.
- The completion test defines what it means for the whole plan to meet its declared goal.
- A plan must declare whether it is SEQUENTIAL or TRANSACTIONAL. There is no implicit atomicity.

## 3. Dependency graph

A dependency is a directed relation **A → B**, meaning B requires a declared output or postcondition from A. It is not merely a preferred ordering.

The dependency graph must be acyclic in v1.4. Cycles are rejected as MALFORMED unless a future version defines explicit iteration semantics, convergence criteria, resource bounds and termination guarantees.

For every dependency:
1. A and B must identify existing steps.
2. The specific output, condition or binding consumed by B must be named.
3. The output type must match the input type.
4. B cannot start until the required result from A is available and its required postconditions have been verified.
5. A dependency cannot be satisfied by an operation that was merely requested or validated but never executed, where an actual result is required.

A sequence in source order does not automatically establish a dependency. Conversely, a declared dependency must be honoured even if a scheduler could otherwise run steps in parallel. v1.4 does not define parallel execution; the conservative default is serial execution in declared topological order.

## 4. Ordering

A plan has:
- **DECLARED-ORDER:** the authored order of steps;
- **DEPENDENCY-ORDER:** the partial order required by dependency edges;
- **EXECUTION-ORDER:** the order actually chosen by a conforming executor.

For v1.4, execution must preserve all dependency edges and uses a deterministic serial topological order. If multiple independent steps are ready, their declared order breaks ties. This rule is a modern implementation convention, not historical Arcane syntax.

An executor must not reorder steps across a boundary where a prior step may alter a later step's preconditions, constraints, resources, target bindings or mechanism assumptions. If such interaction has not been modelled, treat the steps as dependent or reject the plan as UNDERSPECIFIED.

## 5. Binding scope and intermediate values

Bindings created under v1.1 have explicit scope:
- **STEP:** available only inside the creating step;
- **PLAN:** available to steps in the plan that are ordered after creation, subject to type and dependency checks;
- **EXTERNAL:** supplied by a declared external context and subject to its validity contract.

A PLAN-scoped binding is not automatically a dependency. If a later step requires the value to be produced successfully by an earlier step, the plan must declare that dependency explicitly.

Intermediate outputs are immutable snapshots by default. A later state change does not rewrite a captured output. If a step requires the current live state, it must request a fresh resolution or use a subsystem-defined live reference with explicit update semantics. v1.4 does not assume that references track moving or changing objects automatically.

A binding becomes invalid if its source step fails, its validity contract expires, its referent is destroyed or inaccessible under the relevant model, or a declared invalidation event occurs. Invalidation blocks dependent steps; it must not silently bind to a substitute.

## 6. Sequential plans

A SEQUENTIAL plan consists of steps that may have externally visible partial effects. Unless an execution contract states otherwise:
- each step is separately authorised and executed;
- a successful earlier step is not automatically undone if a later step fails;
- all downstream dependants of a failed step are blocked;
- independent later steps are also skipped by default after a blocking failure, unless an explicit recovery branch defines why they remain safe;
- the plan is not reported complete until its completion test passes.

The result must record the highest confirmed stage reached and any steps that did not run. “Plan failed” does not mean “nothing happened”.

## 7. Transactional plans and atomicity

A TRANSACTIONAL plan requests all-or-nothing externally visible semantics. It is valid only if the execution subsystem explicitly provides:
- a transaction boundary;
- a complete list of affected state and side effects;
- a prepare/commit protocol or an equivalent atomicity guarantee;
- defined behaviour for interruption and competing operations;
- a rollback or compensation contract for failures after partial application;
- a way to verify commit or compensation.

If the execution subsystem lacks any required contract, the plan must be rejected as UNDERSPECIFIED before execution. Merely labelling a plan TRANSACTIONAL does not make it atomic. Compensation is not the same as rollback: compensation performs a new action intended to counteract a prior action and may not restore the exact previous state.

The language layer does not promise universal reversibility. Some external effects may be irreversible, unobservable or only partially compensable. Such effects cannot be placed inside a transaction that promises exact rollback unless the execution contract proves the promise.

## 8. Failure policies

A plan must select one of these policies:

- **STOP-DEPENDENTS:** on a blocking failure, stop the failed step's dependants; skip unrelated later steps by default.
- **STOP-ALL:** on a blocking failure, halt the remaining plan.
- **RECOVERY-BRANCH:** follow a named, typed recovery branch whose own preconditions, authorisation, resource limits and dependency graph have been validated.

No policy may reinterpret failure as success. A recovery branch cannot rely on an output or guarantee from the failed step. Recovery must not silently weaken the original goal or safety constraints. If no safe recovery is defined, stop.

v1.4 does not support IGNORE-FAILURE as a way to satisfy a required dependency. A diagnostic-only independent step may be permitted after a failure only if its safety and independence are explicitly established.

## 9. Completion and result record

The plan's result record is:

**PLAN-RESULT = (PLAN-ID, STEP-RESULTS, EXECUTION-ORDER, BLOCKED-STEPS, SIDE-EFFECT-STATUS, COMPLETION-TEST-RESULT, EVIDENCE)**

The executor must distinguish:
- **NOT-STARTED:** no step was attempted;
- **PARTIALLY-EXECUTED:** at least one step may have taken effect, but the plan did not complete;
- **EXECUTION-REPORTED:** the executor reports the plan's steps completed according to its contract;
- **COMPLETION-VERIFIED:** the plan completion test passed;
- **COMPLETION-FAILED:** the completion test failed;
- **STATE-UNKNOWN:** effects may have occurred but the execution contract cannot establish the resulting state.

These are plan-level statuses, not replacements for v1.0 evaluator states. If a step's postcondition fails, downstream steps requiring it are blocked. If the plan completion test is absent, invalid or unmeasurable, the plan cannot be reported COMPLETION-VERIFIED.

## 10. Worked abstract example

A plan requests a target be moved and then secured at the new position.

- Step A: resolve the target and establish a typed movement goal.
- Step B: perform a supported movement transition.
- Step C: resolve the resulting position and establish a securing relation.
- Dependency: C requires B's verified resulting-position output.
- Completion test: the target occupies the required position and the securing relation satisfies its declared acceptance test.

If B is only validated but not executed, C cannot treat the movement as having occurred. If B executes but its postcondition fails, C is blocked. If C fails after B succeeded in a SEQUENTIAL plan, the movement may remain in effect; the plan must report partial execution rather than pretend that nothing happened. A TRANSACTIONAL version is allowed only if the execution subsystem proves atomicity and a suitable recovery contract.

This example defines no physical movement or securing mechanism by itself.

## 11. Acceptance and rejection fixtures

Specification-level fixtures only; they have not been run through an executable scheduler.

| ID | Condition | Expected result |
|---|---|---|
| SEQ14-01 | Unique plan and step IDs | Accept identity structure |
| SEQ14-02 | Duplicate step ID | MALFORMED |
| SEQ14-03 | Dependency names a missing step | MALFORMED |
| SEQ14-04 | Dependency graph contains a cycle | MALFORMED |
| SEQ14-05 | Dependency consumes an output with mismatched type | Type error |
| SEQ14-06 | Dependent step starts before prerequisite postcondition is verified | Reject |
| SEQ14-07 | Step uses an output that has not been produced | UNRESOLVED |
| SEQ14-08 | PLAN binding is treated as implicit dependency | Reject assumption |
| SEQ14-09 | Snapshot output is silently treated as live state | Reject |
| SEQ14-10 | Binding invalidates and executor substitutes another target | Reject |
| SEQ14-11 | Independent steps use deterministic declared-order tie-break | Accept |
| SEQ14-12 | Executor reorders steps despite possible state interaction | Reject unless interaction model proves safe |
| SEQ14-13 | Sequential plan's later step fails after an earlier effect | Report partial execution |
| SEQ14-14 | Plan failure is reported as proof that nothing changed | Reject |
| SEQ14-15 | STOP-ALL policy halts remaining steps after blocking failure | Accept |
| SEQ14-16 | STOP-DEPENDENTS policy allows a required dependent to run | Reject |
| SEQ14-17 | Recovery branch depends on failed step's unavailable output | Reject |
| SEQ14-18 | Recovery branch silently weakens protected-region invariant | Reject |
| SEQ14-19 | Transactional plan has no atomicity contract | UNDERSPECIFIED; block execution |
| SEQ14-20 | Transactional label alone is treated as proof of atomicity | Reject |
| SEQ14-21 | Exact rollback claimed for an irreversible side effect | Reject |
| SEQ14-22 | Compensation is reported as exact rollback without proof | Reject |
| SEQ14-23 | Execution interruption has no defined transaction behaviour | UNDERSPECIFIED |
| SEQ14-24 | Concurrent external operation can alter transaction state without a rule | UNDERSPECIFIED |
| SEQ14-25 | Plan lacks a completion test | Cannot verify completion |
| SEQ14-26 | Completion test exists but cannot be measured | Completion unverified |
| SEQ14-27 | Step is validated but not executed; dependent needs actual output | Dependent blocked |
| SEQ14-28 | Step executes but postcondition fails | Dependent blocked |
| SEQ14-29 | Independent diagnostic step continues after failure without safety proof | Reject |
| SEQ14-30 | Resource use across steps exceeds shared declared budget | RESOURCE-INSUFFICIENT |
| SEQ14-31 | Shared budget is counted separately per step despite a plan-wide cap | Reject |
| SEQ14-32 | A plan-wide constraint is checked only at the end despite DURING scope | Reject |
| SEQ14-33 | One step's output expires before a dependent consumes it | UNRESOLVED; dependent blocked |
| SEQ14-34 | A target reference changes identity between steps without re-resolution | Reject |
| SEQ14-35 | A SEQUENTIAL plan claims all-or-nothing semantics without a transaction contract | Reject |
| SEQ14-36 | A recovery step has not received external authorisation | Execution blocked |
| SEQ14-37 | A valid serial topological order respects all dependency edges | Accept order |
| SEQ14-38 | Two independent steps are parallelised despite v1.4 serial rule | Reject in v1.4 |
| SEQ14-39 | Some effects may have occurred but state cannot be established | STATE-UNKNOWN |
| SEQ14-40 | All steps report completion but the plan completion test fails | COMPLETION-FAILED |
 
## 12. Explicitly unresolved

This version does not define spoken sequencing syntax, loops or recursion, parallel execution, asynchronous events, universal transaction protocols, cross-system atomicity, a general compensation library, distributed locking, scheduler implementation, a runtime interpreter, or physical spell execution. Those capabilities require explicit contracts in later subsystems.

**Change policy:** Sequencing semantics are locked for this bounded layer. Future work must specify any new control-flow construct, resource accounting across steps, state interaction, interruption behaviour and recovery semantics, with negative fixtures. No new rule may silently weaken v1.0–v1.3 guarantees.
