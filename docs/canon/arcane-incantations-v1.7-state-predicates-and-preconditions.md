# Arcane Incantations v1.7 — State Predicates and Preconditions

**Status:** LOCKED DESIGN CANON for the bounded modern incantation layer  
**Depends on:** Incantations v1.0–v1.6  
**Validation status:** 48 specification fixtures. These are expected semantic outcomes, not results from an executable evaluator or spell runtime.

## 1. Purpose and boundary

Version 1.7 defines how an incantation expresses a condition about a typed target or state, when that condition must hold, how it is evaluated, and what follows when the condition is false, unknown, stale or unmeasurable. It formalises predicates, preconditions, postconditions, invariants, temporal scope and evidence requirements.

This is modern design metalanguage, not a claim that these predicate forms or names existed in historical Arcane utterances. It introduces no new spoken tokens and does not define a physical mechanism. A declared condition is not automatically a fact about the world.

## 2. Predicate model

A predicate is a typed, versioned test over declared inputs:

**PREDICATE = (PREDICATE-ID, INPUT-SIGNATURE, TEST-DEFINITION, DOMAIN, TEMPORAL-SCOPE, EVIDENCE-REQUIREMENTS, RESULT-SEMANTICS)**

The test definition must identify what is evaluated, the domain in which it is meaningful, and what evidence can establish its result. Every input must have a type under v1.6. If the predicate's definition, signature or domain is missing, it is unavailable rather than guessed from its name.

A predicate evaluation returns one of:
- **TRUE:** adequate evidence establishes the defined condition.
- **FALSE:** adequate evidence establishes that the defined condition does not hold.
- **UNKNOWN:** evidence is insufficient, stale, conflicting or unavailable.
- **ERROR:** evaluation could not be completed under its declared contract.
- **INVALID:** the predicate or its inputs violate the declared type, domain or validity rules.

UNKNOWN is not FALSE. ERROR is not FALSE. INVALID is not an ordinary result. A system must not choose a convenient result merely to allow the incantation to continue.

## 3. Condition declarations

A condition declaration is:

**CONDITION = (PREDICATE-ID, ARGUMENT-BINDINGS, REQUIRED-RESULT, TEMPORAL-OPERATOR, EVIDENCE-POLICY)**

- **PREDICATE-ID:** the registered predicate being evaluated.
- **ARGUMENT-BINDINGS:** typed inputs resolved under v1.1 and v1.6.
- **REQUIRED-RESULT:** normally TRUE for a required condition; FALSE may be explicitly required for a negative test.
- **TEMPORAL-OPERATOR:** when and for how long the condition must hold.
- **EVIDENCE-POLICY:** freshness, uncertainty and provenance requirements.

A condition must not silently invert its required result. A negative condition such as “the region is not occupied” needs a predicate whose scope and evidence can actually establish absence; failure to detect an occupant is not automatically proof that no occupant exists.

## 4. Preconditions

A precondition is a condition that must be satisfied before an operation or plan step may start. All mandatory preconditions must evaluate to the explicitly required result within their declared validity window.

- TRUE with sufficient evidence: the precondition passes.
- FALSE: the precondition fails and the operation is blocked.
- UNKNOWN: the operation is blocked as unresolved.
- ERROR: the operation is blocked and the evaluation failure is recorded.
- INVALID: the invocation is rejected or blocked for a type/domain/validity fault.

A precondition passing at an earlier time does not automatically remain true. If its validity expires, its inputs change, or a relevant invalidation event occurs, it must be reevaluated unless the predicate contract proves the result remains valid.

A precondition is not an instruction to make the condition true. If an operation requires a condition that does not hold, the system must not silently add an unrequested preparatory operation. Any preparation must be a separate, typed and authorised step in the v1.4 plan.

## 5. Postconditions

A postcondition specifies what must be established after an operation reports completion. It must be checked against evidence appropriate to the declared predicate and temporal scope.

- If the operation was not attempted, its postconditions are **NOT-EVALUATED**, not passed.
- If execution was attempted and the postcondition evaluates TRUE, it is satisfied.
- If it evaluates FALSE, the outcome fails.
- If it evaluates UNKNOWN or ERROR, the outcome is unverified.
- If it evaluates INVALID, the result is rejected as unusable.

A postcondition is not guaranteed merely because it was requested, because the operation returned without an error, or because an executor reports completion. Dependent steps under v1.4 may consume a postcondition only after the required evidence has established it.

## 6. Invariants

An invariant is a predicate that must remain true over a specified scope. Its declaration must define:
- the predicate and typed inputs;
- the interval or operation boundary covered;
- the observation or enforcement method;
- acceptable observation latency and uncertainty;
- behaviour when the invariant becomes unknown or false.

An invariant declared **BEFORE-AND-AFTER** is checked at the relevant boundary points only; this does not prove it held between them. An invariant declared **CONTINUOUS** requires a contract that can monitor or enforce it throughout the interval with declared latency and coverage. A system must not claim continuous preservation based only on start/end checks.

If a required invariant is observed false, the execution contract's response policy applies. If it becomes unknown and the contract cannot guarantee preservation, execution must stop or be blocked according to the declared interruption and failure policies. The language does not itself provide containment or a safe state.

## 7. Temporal operators

This version defines the following abstract temporal operators:

- **AT-START:** condition must hold at the declared start boundary.
- **AT-CHECK:** condition must hold at a specified evaluation event.
- **AT-COMPLETION:** condition must hold at the completion boundary.
- **THROUGHOUT:** condition must remain true across the full declared interval, requiring a suitable monitoring/enforcement contract.
- **WITHIN-INTERVAL:** condition must become true at least once during a declared interval; the event time and evidence must be recorded.
- **UNTIL:** condition must hold up to a declared stopping event or boundary; the termination event and sampling/monitoring guarantees must be defined.

These operators are semantic labels, not spoken Arcane tokens. AT-START and AT-COMPLETION alone do not imply THROUGHOUT. WITHIN-INTERVAL does not guarantee the condition remains true afterwards. UNTIL is underspecified if the stopping event, boundary or monitoring semantics are absent.

## 8. Freshness, uncertainty and evidence

Each predicate must declare the evidence needed to support its result. Depending on the domain, that may include source, method, timestamp, uncertainty, spatial coverage, identity confidence and validity window.

A predicate is UNKNOWN rather than TRUE when evidence fails a required freshness, coverage or uncertainty threshold. Conflicting evidence must be reported under a declared conflict policy; it cannot be resolved by silently choosing whichever result permits execution.

The evaluator must distinguish:
- **asserted:** supplied by the author or caller;
- **derived:** computed from declared inputs under a known rule;
- **observed:** obtained through a declared observation method;
- **verified:** evidence satisfies the predicate's acceptance contract.

These evidence labels do not define a universal trust hierarchy. Each predicate and execution contract must state which evidence classes it accepts. An assertion must not be relabelled as an observation or verification.

## 9. Combining conditions

A condition group may combine predicates using declared Boolean operators, but only after result-state semantics are preserved.

- **ALL:** TRUE only if every required member is TRUE; FALSE if a member is FALSE under the declared closed-world rule; otherwise UNKNOWN or ERROR is propagated according to a declared policy.
- **ANY:** TRUE if at least one member is TRUE; FALSE only if all members are FALSE under applicable evidence rules; otherwise unresolved/error states are preserved.
- **NOT:** may invert TRUE and FALSE only; UNKNOWN remains UNKNOWN, and ERROR/INVALID remain errors.
- **ORDERED:** evaluates members in a declared order and stops at a blocking result; it does not itself create a state-changing sequence.

Closed-world assumptions may be used only if the predicate explicitly declares that the available domain is complete for the question being asked. In an open or incompletely observed domain, absence of evidence is not evidence of absence.

This version does not define short-circuit side effects because predicates are expected to be observational/diagnostic; any state-changing predicate evaluation requires an explicit operation contract and must not be hidden inside Boolean combination.

## 10. Failure handling and relationship to prior versions

Predicate and condition outcomes feed into earlier layers without overriding them:
- v1.1 target resolution must establish the correct referents.
- v1.2 constraints and failure semantics remain mandatory.
- v1.3 mechanism and effect claims require their own evidence.
- v1.4 dependency and failure-propagation rules govern sequences.
- v1.5 authority and execution contracts remain independent.
- v1.6 typing, validity, provenance and uncertainty remain mandatory.

Passing all predicates does not establish physical feasibility, external authority, resource sufficiency, execution, or outcome success. A predicate cannot bypass a failed constraint by redefining its result. If a condition is unknown, the default for a required safety or validity precondition is to block, not to guess.

## 11. Acceptance and rejection fixtures

Specification-level expected outcomes; not executed by a predicate engine.

| ID | Condition | Expected result |
|---|---|---|
| PRED17-01 | Predicate has signature, domain, temporal scope and evidence contract | Accept definition |
| PRED17-02 | Predicate name exists but definition is absent | Predicate unavailable |
| PRED17-03 | Input type conflicts with predicate signature | INVALID / TYPE-ERROR |
| PRED17-04 | Adequate evidence establishes condition | TRUE |
| PRED17-05 | Adequate evidence establishes condition does not hold | FALSE |
| PRED17-06 | Evidence insufficient or missing | UNKNOWN |
| PRED17-07 | Evaluation method fails | ERROR |
| PRED17-08 | UNKNOWN coerced to FALSE to permit execution | Reject |
| PRED17-09 | ERROR coerced to FALSE | Reject |
| PRED17-10 | Negative condition passes only because nothing was detected | UNKNOWN unless completeness is established |
| PRED17-11 | Mandatory precondition is FALSE | Block operation |
| PRED17-12 | Mandatory precondition is UNKNOWN | Block as unresolved |
| PRED17-13 | Precondition passed but validity window expired | Reevaluate or block |
| PRED17-14 | Precondition is interpreted as an instruction to alter state | Reject |
| PRED17-15 | Preparatory operation is added without declared plan step | Reject |
| PRED17-16 | Operation not attempted but postcondition marked passed | Reject |
| PRED17-17 | Executor reports completion but postcondition is FALSE | OUTCOME-FAILED |
| PRED17-18 | Postcondition is UNKNOWN | Outcome unverified |
| PRED17-19 | Dependent step starts before prerequisite postcondition verified | Reject under v1.4 |
| PRED17-20 | BEFORE-AND-AFTER invariant claimed to hold continuously | Reject claim |
| PRED17-21 | CONTINUOUS invariant lacks monitoring/enforcement contract | UNDERSPECIFIED |
| PRED17-22 | Invariant becomes FALSE during execution | Apply failure/interruption contract |
| PRED17-23 | Invariant becomes UNKNOWN and preservation cannot be guaranteed | Block/stop per contract |
| PRED17-24 | AT-START treated as THROUGHOUT | Reject |
| PRED17-25 | WITHIN-INTERVAL result assumed to remain true afterwards | Reject |
| PRED17-26 | UNTIL has no defined stopping event | UNDERSPECIFIED |
| PRED17-27 | Evidence is outside required freshness window | UNKNOWN |
| PRED17-28 | Evidence uncertainty exceeds declared threshold | UNKNOWN or insufficient evidence |
| PRED17-29 | Evidence coverage misses part of required target region | UNKNOWN |
| PRED17-30 | Conflicting observations silently resolved in favour of execution | Reject |
| PRED17-31 | Caller assertion is relabelled as observed evidence | Reject |
| PRED17-32 | Derived value lacks a reproducible rule/provenance | Insufficient evidence |
| PRED17-33 | NOT inverts UNKNOWN to TRUE | Reject |
| PRED17-34 | ANY returns FALSE despite a TRUE member | Reject |
| PRED17-35 | ALL returns TRUE while a mandatory member is UNKNOWN | Reject |
| PRED17-36 | Open-world absence interpreted as proof of absence | Reject |
| PRED17-37 | Closed-world rule used without completeness contract | Reject |
| PRED17-38 | Predicate passes but resource budget fails | RESOURCE-INSUFFICIENT |
| PRED17-39 | Predicate passes but authority is absent | Execution blocked |
| PRED17-40 | Predicate passes but mechanism is unsupported | Not validated |
| PRED17-41 | Predicate is valid but reference has been invalidated | REFERENCE-INVALID |
| PRED17-42 | Predicate evaluation hides state-changing side effect | Reject unless separately contracted |
| PRED17-43 | Postcondition is TRUE with adequate evidence | Satisfied |
| PRED17-44 | Required invariant cannot be monitored at declared latency | UNDERSPECIFIED |
| PRED17-45 | All preconditions pass but operation has not been executed | VALIDATED/READY at most |
| PRED17-46 | Result is TRUE but provenance is absent where required | UNKNOWN / insufficient evidence |
| PRED17-47 | A plan completion test is confused with a single-step postcondition | Reject conflation |
| PRED17-48 | Predicate definitions and versions are retained in audit record | Accept record |

## 12. Explicitly unresolved

This version does not define a universal predicate registry, canonical spoken syntax for predicates, domain-specific observation instruments, universal uncertainty calculus, continuous-monitor implementation, distributed observation consistency, temporal logic beyond the bounded operators above, or a runtime evaluator.

**Change policy:** Predicate and precondition semantics are locked for this bounded layer. New temporal operators, combination rules or evidence classes must define unknown/error behaviour, temporal scope, freshness, completeness assumptions and negative fixtures. No predicate may silently turn an assertion into a verified fact or replace execution/authority checks.
