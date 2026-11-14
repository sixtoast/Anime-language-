# Arcane Incantations v1.2 — Preconditions, Constraints and Failure Semantics

**Status:** LOCKED DESIGN CANON for the bounded modern incantation layer  
**Depends on:** Incantations v1.0 and v1.1  
**Purpose:** Define how an incantation states conditions for safe evaluation, how invariants and limits are checked, and how a failed check blocks dependent operations.  
**Validation:** 32 specification fixtures; no executable spell engine, physical model, or magical execution is claimed.

## 1. Design boundary

Incantations 1.0 established an operation frame and evaluator states. Incantations 1.1 established typed references and binding. This version defines a constraint layer that sits between reference resolution and any attempted operation.

The governing sequence is:

**parse → resolve references → type-check → check preconditions → check constraints and resources → validate feasibility → authorise execution externally → execute externally → verify postconditions**

This sequence is the new modern incantation design. It is not asserted to be a historical sequence in the source language.

A requested effect is not proof of a valid mechanism. A valid mechanism is not proof that resources are available. Passing validation is not permission to execute. An execution report is not proof that the intended outcome occurred.

## 2. Terms

- **Precondition:** a proposition that must be true immediately before an operation is eligible to proceed.
- **Constraint:** a limit or invariant that must remain true for the relevant interval or operation.
- **Invariant:** a proposition declared to remain true throughout a defined scope.
- **Resource budget:** a typed statement of what resource is available and the maximum amount the operation may consume. This layer defines the check, not a universal resource unit or consumption model.
- **Postcondition:** a proposition that must be checked after an execution attempt.
- **Guard:** the evaluation rule that prevents a dependent operation from proceeding unless required checks pass.
- **Failure:** a reported non-success state. Failure must not silently be reinterpreted as success, a different target, or a weaker constraint.

These are semantic categories. They do not assign new spoken Arcane tokens.

## 3. Constraint record

For specification purposes, represent each declared condition as:

**COND = (ID, KIND, PREDICATE, SUBJECTS, SCOPE, CHECK-TIME, FAILURE-POLICY)**

This is a semantic record, not a literal utterance.

- **ID:** unique condition label within the spell.
- **KIND:** PRECONDITION, LIMIT, INVARIANT, RESOURCE-BOUND, or POSTCONDITION.
- **PREDICATE:** a typed, evaluable proposition; no free-form English is executable.
- **SUBJECTS:** already-resolved references or typed values used by the predicate.
- **SCOPE:** the operation, current step, or spell lifetime over which the condition applies.
- **CHECK-TIME:** BEFORE, DURING, AFTER, or BEFORE-AND-DURING.
- **FAILURE-POLICY:** BLOCK, ABORT-DEPENDENTS, or REPORT-ONLY. REPORT-ONLY is permitted only for non-safety-critical diagnostics and cannot satisfy a required guard.

Condition IDs must be unique. A condition may refer only to bound labels and defined values. Circular conditions whose truth depends on the success of the same operation they guard are invalid unless a future rule defines a sound fixed-point semantics.

## 4. Preconditions

A precondition is checked before the guarded operation is eligible for execution. If false, the operation does not begin. If the evaluator cannot determine whether it is true, the result is UNRESOLVED or UNDERSPECIFIED, not “probably true”.

Preconditions must specify:
1. the proposition being checked;
2. its subjects and types;
3. the time at which it must hold;
4. which operation(s) it guards;
5. the failure result and dependent-operation behaviour.

A precondition is not automatically maintained after it passes. If a fact can change during execution and must remain true, declare an invariant or a DURING constraint as well.

## 5. Limits and invariants

A **limit** bounds an allowed value or behaviour, for example a maximum displacement, temperature, duration, force, or resource use. The quantity, unit, comparison semantics and measurement uncertainty must be defined by the relevant typed subsystem. An untyped number cannot be compared with a dimensional quantity.

An **invariant** must name its scope. v1.2 recognises these scopes:
- **STEP:** must hold throughout one operation step;
- **SPELL:** must hold throughout the current spell instance;
- **DEPENDENT-CHAIN:** must hold across the explicitly linked operations in a chain.

A declared invariant is not a guarantee that the system can preserve it. The evaluator must establish that it can monitor and enforce the invariant under the applicable model. If it cannot, the result is UNDERSPECIFIED or INFEASIBLE, depending on whether information is missing or the requested guarantee conflicts with the model.

No implicit invariants are assumed. If a spell must avoid harming bystanders, preserve a structure, keep a subject conscious, maintain a barrier boundary, or avoid a named region, that requirement must be represented explicitly in a supported predicate and checked. This version does not supply a complete vocabulary for such predicates.

## 6. Resource checks

A resource-bound condition must identify:
- the resource type;
- the available amount or an authoritative source for it;
- the maximum permitted consumption;
- the operation or chain covered;
- the model used to estimate or measure consumption;
- the policy if availability or consumption is uncertain.

The evaluator must not assume that mana, energy, matter, information, or any other resource is interchangeable with another. A coupling category is not itself a resource quantity. The existence of a resource does not imply permission to consume it.

If the required amount is known to exceed the available budget, return RESOURCE-INSUFFICIENT. If the amount or the accounting model is unknown, return UNDERSPECIFIED. If the proposed resource transformation violates a defined conservation or feasibility rule, return INFEASIBLE.

This version does not define a universal mana unit, a resource conversion rate, a depletion law, replenishment, or a complete conservation model.

## 7. Check order and dependency guards

For each operation, the evaluator must apply checks in this order:

1. **Structure:** parse the operation and condition records.
2. **References:** resolve all referenced labels under v1.1.
3. **Types:** verify predicate subjects, quantities, scopes and operation arguments.
4. **Preconditions:** evaluate required BEFORE predicates.
5. **Limits and resources:** check applicable bounds and known budgets.
6. **Feasibility:** consult the supported mechanism and domain model.
7. **External authorisation:** confirm the execution environment independently permits the operation.
8. **Execution:** delegated to a trusted execution layer, if one exists.
9. **Postconditions:** verify the reported outcome against required results.

The first blocking failure stops progression for the affected operation. The evaluator may report additional independently discoverable diagnostics, but must not continue as though the failed check passed.

If operation B depends on operation A, B must not execute when A fails unless a separately specified recovery branch explicitly permits B. There is no implicit “best effort” mode.

## 8. Failure states and precedence

This version reuses the v1.0 states and defines how to select a primary result:

- **MALFORMED:** the structure cannot be parsed.
- **UNRESOLVED:** a required reference or external value cannot be resolved.
- **UNDERSPECIFIED:** a required type, predicate, unit, limit, budget or evaluation rule is missing.
- **PRECONDITION-FAILED:** a required precondition is known to be false.
- **RESOURCE-INSUFFICIENT:** a defined budget is known to be insufficient.
- **INFEASIBLE:** a supported model proves the requested operation or guarantee cannot be satisfied.
- **VALIDATED:** all checks implemented by the evaluator pass; this does not authorise or perform execution.
- **EXECUTED:** a trusted execution layer reports that execution was attempted/completed according to its contract.
- **POSTCONDITION-FAILED:** execution was reported but required outcome checks failed or were not satisfied.

When multiple failures are found, MALFORMED takes precedence because the structure cannot be interpreted reliably. Otherwise report all blocking failures and identify the earliest blocking stage as the primary result. Do not downgrade a known false precondition to UNDERSPECIFIED; do not label missing evidence as proof of infeasibility; do not label an untested condition as passed.

POSTCONDITION-FAILED must not erase the execution record. It means the requested success has not been established. It does not, by itself, prove that nothing changed.

## 9. Abort, containment and recovery

v1.2 defines conservative failure handling:
- A blocking failure prevents the guarded operation from starting.
- A DURING constraint that becomes false requires the evaluator to signal failure and request the defined abort/containment behaviour from the execution layer.
- Dependent operations are blocked after a failed prerequisite by default.
- A recovery branch is permitted only when explicitly declared, type-checked and shown not to depend on the failed guarantee.
- No rollback is assumed. Rollback may be claimed only if the execution model defines reversible state, rollback scope, side effects and verification.
- No operation may silently broaden its target, increase its resource budget, weaken a limit, or substitute a different mechanism to make a spell pass.

A language-level abort request is not proof that a physical process stopped instantly. The execution layer must report what it actually guarantees, including any latency or residual effects.

## 10. Worked abstract example

The following is a semantic template, not a fully spoken incantation:

- Operation: alter a resolved target.
- Preconditions: target reference is current; mechanism is defined; external execution authority permits the operation.
- Limits: displacement remains within a typed maximum; resource use does not exceed the declared budget.
- Invariant: a named protected region remains unaffected throughout the operation.
- Postcondition: the target reaches the specified state and the protected-region invariant is verified.
- Failure policy: block before execution if a precondition or resource check fails; abort dependents if the invariant fails during execution; report POSTCONDITION-FAILED if the expected final state is not verified.

If the system has no supported predicate for “protected region remains unaffected”, the spell is not validated. Merely writing the requirement does not implement monitoring or enforcement.

## 11. Acceptance and rejection fixtures

These are specification-level fixtures, not executed parser results.

| ID | Condition | Expected result |
|---|---|---|
| CON12-01 | All required preconditions are true and typed | May continue to later checks |
| CON12-02 | A required precondition is known false | PRECONDITION-FAILED; operation blocked |
| CON12-03 | Truth of a required precondition cannot be evaluated | UNRESOLVED or UNDERSPECIFIED |
| CON12-04 | A precondition passes, but required during-state is unguarded | Reject validation if continued truth is required |
| CON12-05 | Condition label is duplicated | MALFORMED |
| CON12-06 | Predicate references an unbound label | UNRESOLVED |
| CON12-07 | Predicate compares metres with seconds without a defined conversion | Type error / UNDERSPECIFIED |
| CON12-08 | Dimensional quantity is compared with an untyped number | Reject |
| CON12-09 | Known required resource exceeds known budget | RESOURCE-INSUFFICIENT |
| CON12-10 | Resource amount is unknown | UNDERSPECIFIED |
| CON12-11 | Mana is assumed interchangeable with energy without a model | Reject |
| CON12-12 | Coupling category is treated as proof of resource availability | Reject |
| CON12-13 | Declared invariant cannot be monitored by the available evaluator | UNDERSPECIFIED or INFEASIBLE |
| CON12-14 | Supported model proves requested invariant impossible | INFEASIBLE |
| CON12-15 | Constraint becomes false during execution | Signal failure; request defined containment; block dependents |
| CON12-16 | Upstream operation fails and downstream operation has no recovery branch | Downstream blocked |
| CON12-17 | Recovery branch is declared but depends on the failed precondition | Reject recovery branch |
| CON12-18 | Spell silently weakens a limit after a check fails | Reject |
| CON12-19 | Spell silently substitutes a new target after resolution failure | Reject |
| CON12-20 | Evaluator says VALIDATED and claims that execution occurred | Reject status conflation |
| CON12-21 | Execution layer reports execution but postcondition is false | POSTCONDITION-FAILED |
| CON12-22 | Postcondition is unmeasurable | Outcome not verified; cannot claim success |
| CON12-23 | Abort requested and engine claims instantaneous stop without such a contract | Reject unsupported guarantee |
| CON12-24 | Rollback claimed with no reversibility model | Reject rollback claim |
| CON12-25 | A limit has no defined scope or check time | UNDERSPECIFIED |
| CON12-26 | A safety-critical condition uses REPORT-ONLY | Reject |
| CON12-27 | A condition is circularly defined by the success of the operation it guards | Reject unless a later formal semantics resolves it |
| CON12-28 | Independent diagnostics can be reported after first blocking failure | Permit diagnostics, but no execution progression |
| CON12-29 | Target is valid but external authority denies execution | Execution blocked; language validation is not authorisation |
| CON12-30 | A requested effect has no supported mechanism model | UNDERSPECIFIED or INFEASIBLE, not automatically VALIDATED |
| CON12-31 | Resource budget passes but physical feasibility check fails | INFEASIBLE |
| CON12-32 | Every supported check passes but no execution engine exists | VALIDATED only; not EXECUTED |

## 12. Explicitly unresolved

This version does not define a universal predicate language, physical simulation, sensing, numeric units, uncertainty calculus, resource consumption/conservation, authorisation vocabulary, interrupt latency, safe-state guarantees, reversibility, transaction semantics, concurrency, or rollback. Those must be specified in typed subsystems before any spell may claim those capabilities.

**Change policy:** Conditions and failure semantics are locked for this bounded design layer. Future versions must add explicit types, check times, dependency behaviour, negative fixtures and truthful execution boundaries. This document does not change source lexicon status or claim actual magical execution.
