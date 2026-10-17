# Arcane Incantations v1.5 — Invocation Profiles and Execution Contracts

**Status:** LOCKED DESIGN CANON for the bounded modern incantation layer  
**Depends on:** Incantations v1.0–v1.4  
**Validation status:** 42 specification fixtures. These are expected semantic outcomes, not evidence of an executable interpreter or real-world spell execution.

## 1. Purpose

Version 1.5 defines how an incantation declares the kind of request it makes and what an external execution environment must guarantee before the request may be attempted. It introduces invocation profiles, execution contracts, authority separation, interruption requests, and audit records.

This is a modern semantic design. It does not assert that the source language historically contained these profile names, contract fields, or runtime behaviours. The records below are specification metalanguage, not spoken Arcane tokens.

The controlling distinction is:

**well-formed → semantically validated → externally authorised → execution contract accepted → attempted → observed → outcome verified**

These are separate states. Passing one stage does not imply passage through the next.

## 2. Invocation profile

An invocation profile declares the class of request and the additional checks it requires.

**PROFILE = (PROFILE-ID, REQUEST-CLASS, EFFECT-SCOPE, REQUIRED-EVIDENCE, RESOURCE-POLICY, INTERRUPTION-POLICY, COMPLETION-TEST)**

- **PROFILE-ID:** unique identifier for this profile instance.
- **REQUEST-CLASS:** one of the bounded classes below.
- **EFFECT-SCOPE:** the declared target, region, duration and affected state scope.
- **REQUIRED-EVIDENCE:** evidence needed to validate the mechanism and outcome.
- **RESOURCE-POLICY:** applicable typed budget and accounting contract.
- **INTERRUPTION-POLICY:** what interruption is requested to mean and what acknowledgement is required.
- **COMPLETION-TEST:** a defined test for the requested outcome.

A profile cannot relax requirements inherited from v1.0–v1.4. If a profile omits a requirement that the operation needs, the invocation is UNDERSPECIFIED.

### 2.1 Bounded request classes

The following are modern profile classes, not historical lexical categories:

- **OBSERVE:** request measurement or information acquisition without intentionally changing the observed subject. The profile must still account for probe effects, privacy/authority and measurement uncertainty.
- **ESTABLISH:** request a supported state to be established.
- **ALTER:** request a supported state transition.
- **MAINTAIN:** request a state predicate to remain true for a declared interval.
- **RELEASE:** request release of a specific relation or maintained operation.
- **COUPLE:** request a defined relation between typed participants.
- **SEQUENCE:** request a multi-step plan governed by v1.4.
- **TRANSACTION:** request all-or-nothing semantics; invalid unless the executor supplies a sufficient transaction contract.
- **DIAGNOSTIC:** request validation or reporting only, with no state-changing execution.

A request class does not prove that a corresponding mechanism exists. It only selects which checks apply. A spell may not claim OBSERVE if the operation intentionally changes the subject, except where the measurement subsystem explicitly models and accepts the probe effect.

## 3. Execution contract

Before a state-changing invocation may be attempted, the executor must present a contract:

**EXECUTION-CONTRACT = (ENGINE-ID, CONTRACT-VERSION, SUPPORTED-PROFILES, DOMAIN, INPUT-ASSUMPTIONS, GUARANTEES, NON-GUARANTEES, RESOURCE-ACCOUNTING, INTERRUPT-SEMANTICS, SIDE-EFFECTS, RESULT-CHANNEL, EVIDENCE-PROVENANCE)**

The contract must specify:
- which profile classes it accepts;
- its supported domain and exclusions;
- assumptions about inputs and external state;
- guarantees it actually provides;
- known non-guarantees and failure modes;
- how resources are measured and capped;
- interruption acknowledgement and latency bounds, if any;
- known side effects and their visibility;
- how results and errors are reported;
- the provenance and version of the evidence supporting its claims.

A blank or ambiguous contract field is not interpreted optimistically. If a guarantee is required by the invocation and absent from the contract, execution is blocked as UNDERSPECIFIED. An executor may offer a weaker contract, but the invocation must be revalidated against it and may not silently weaken its own constraints.

## 4. Contract acceptance

The invocation and executor contract must be checked together before execution. At minimum:

1. The requested profile is supported.
2. The invocation's target and scope fit the contract's declared domain.
3. Required mechanism and evidence levels meet the invocation profile.
4. Input assumptions are either verified or explicitly represented as unresolved.
5. Resource accounting supports the requested budget and scope.
6. Required invariants can be monitored or enforced under the contract.
7. Interruption requirements are compatible with the contract's actual guarantees.
8. Side effects are declared and acceptable under the external authority decision.
9. The result channel can distinguish not-started, attempted, completed-as-reported, and outcome-verified.
10. The completion test can be evaluated using supported evidence.

Acceptance means only that the contract is adequate for the declared request. It does not mean the invocation has been authorised or executed.

## 5. Authority is separate

The execution authority is an external decision point. Arcane syntax, a valid target reference, a supported mechanism, or a passing contract does not by itself grant permission.

**AUTHORIZATION = (AUTHORITY-ID, DECISION, SCOPE, VALIDITY, CONDITIONS, EVIDENCE)**

The authority decision must be explicit and scoped to the invocation. It may be denied, conditional, expired, or unavailable. Missing authority is not approval. An expired or out-of-scope approval must not be reused.

The language specification does not define who the authority should be in every environment or what real-world legal, ethical or safety rules apply. Those belong to the environment and its governance. The executor must not infer consent from a living-coupling category, infer ownership from target resolution, or infer permission from the fact that a request is technically feasible.

## 6. Interruption and termination

An interruption request is a request to stop or limit an active operation. It is not proof that the operation has stopped.

The execution contract must distinguish:
- **NOT-ACTIVE:** no operation is active;
- **INTERRUPT-REQUESTED:** request accepted for processing, but cessation is unconfirmed;
- **INTERRUPT-ACKNOWLEDGED:** executor acknowledges the request;
- **STOP-CONFIRMED:** contract-supported evidence establishes that the operation has stopped within the declared scope;
- **STOP-PARTIAL:** some activity has stopped, but residual effects or subprocesses remain;
- **STOP-UNKNOWN:** the system cannot establish whether all relevant activity has ceased;
- **NOT-INTERRUPTIBLE:** the contract declares the operation cannot be interrupted through this channel.

An invocation requiring guaranteed stoppability must be blocked if the contract cannot provide that guarantee. If interruption is requested after execution begins, the result record must preserve the original operation status and the interruption status separately.

No universal instantaneous stop, reversal, containment, or safe-state guarantee is assumed. Termination of a control process may not undo effects already produced.

## 7. Evidence and audit record

Each invocation produces an audit record:

**INVOCATION-RECORD = (INVOCATION-ID, SPEC-VERSION, PROFILE, RESOLVED-REFERENCES, VALIDATION-RESULTS, CONTRACT-ID, AUTHORITY-DECISION, START-STATUS, INTERRUPT-STATUS, RESOURCE-REPORT, SIDE-EFFECT-REPORT, OBSERVATIONS, COMPLETION-RESULT, EVIDENCE-PROVENANCE)**

The record must:
- distinguish requested values from measured values;
- preserve the exact versions of the specification, profile and execution contract;
- identify which checks passed, failed or were not evaluable;
- record whether execution was never started, attempted, reported complete, or verified against postconditions;
- disclose missing evidence rather than manufacture certainty;
- avoid logging secrets or unnecessary sensitive data; and
- prevent a later status update from erasing a prior failure or side effect.

Audit records are evidence of what the system recorded, not automatic proof that every recorded statement is true. Evidence provenance and trust are part of the contract.

## 8. Result-state mapping

The invocation layer preserves the earlier evaluator states and adds a staged result summary:

- **REJECTED:** malformed, unresolved, underspecified, infeasible, or blocked by a failed mandatory check.
- **VALIDATED:** language, reference, constraint, mechanism and profile checks passed.
- **CONTRACT-ACCEPTED:** the execution contract satisfies the invocation's declared requirements.
- **AUTHORISED:** a current external authority decision permits the specified request.
- **READY:** validation, contract acceptance and authority all hold; execution has not necessarily started.
- **ATTEMPTED:** execution was initiated and the executor reports an attempt.
- **EXECUTION-REPORTED:** executor reports completion according to its contract.
- **OUTCOME-VERIFIED:** required postconditions and completion tests pass with adequate evidence.
- **OUTCOME-FAILED:** execution was attempted or reported, but required outcome checks failed.
- **OUTCOME-UNKNOWN:** available evidence cannot establish whether the requested outcome occurred.

These statuses are not interchangeable. In particular, READY is not ATTEMPTED, EXECUTION-REPORTED is not OUTCOME-VERIFIED, and OUTCOME-UNKNOWN is not success.

## 9. Worked abstract example

An invocation requests that a named target reach a specified state.

1. The language layer resolves the target and validates the operation, constraints, mechanism and plan.
2. The invocation profile states the required evidence, resource policy, interruption policy and completion test.
3. An execution contract declares its supported domain, guarantees, non-guarantees and result channel.
4. The contract is checked against the profile and request.
5. An external authority decision is obtained for the exact scope.
6. Only then may the executor attempt the operation.
7. The audit record captures the attempt, resource report, interruptions and observed result.
8. The outcome is verified against the completion test.

If the contract does not guarantee an interruption behaviour required by the profile, the invocation is blocked before execution. If execution is reported but the final state cannot be observed, the outcome is OUTCOME-UNKNOWN rather than successful.

This example defines no real-world mechanism or magical execution capability.

## 10. Acceptance and rejection fixtures

These are specification-level fixtures; they have not been run through an executable interpreter or executor.

| ID | Condition | Expected result |
|---|---|---|
| INV15-01 | Profile has a unique ID and all required fields | Accept profile structure |
| INV15-02 | Profile omits a required completion test | UNDERSPECIFIED |
| INV15-03 | Request class is unknown | Reject profile |
| INV15-04 | OBSERVE request intentionally alters subject without a probe-effect model | Reject profile classification |
| INV15-05 | DIAGNOSTIC profile requests state-changing execution | Reject mismatch |
| INV15-06 | Profile claims mechanism availability from request class alone | Reject |
| INV15-07 | Executor contract omits a guarantee required by invocation | UNDERSPECIFIED; block |
| INV15-08 | Executor claims support outside its declared domain | Reject |
| INV15-09 | Resource budget requested but contract has no accounting model | Block |
| INV15-10 | Contract cannot monitor a required invariant | Block |
| INV15-11 | Contract cannot report whether execution started | Block if status distinction is required |
| INV15-12 | Contract version changes after validation | Revalidate |
| INV15-13 | Required interruption guarantee is absent | Block before execution |
| INV15-14 | Interrupt requested and acknowledgement received, but stop unconfirmed | INTERRUPT-ACKNOWLEDGED, not STOP-CONFIRMED |
| INV15-15 | Executor confirms partial stop with residual effects | STOP-PARTIAL |
| INV15-16 | Executor cannot establish whether activity ceased | STOP-UNKNOWN |
| INV15-17 | Operation is declared non-interruptible but profile requires guaranteed stop | Reject |
| INV15-18 | Syntax validation is treated as authority | Reject |
| INV15-19 | Authority is missing or unavailable | Not authorised |
| INV15-20 | Authority scope excludes the target | Block |
| INV15-21 | Authority decision expired | Block and reacquire decision |
| INV15-22 | Consent is inferred from living-coupling category | Reject |
| INV15-23 | Contract accepted but no authority decision exists | CONTRACT-ACCEPTED at most |
| INV15-24 | Authority granted but contract requirements fail | Block |
| INV15-25 | Invocation is READY and is reported as already executed | Reject status claim |
| INV15-26 | Executor reports completion without required outcome evidence | OUTCOME-UNKNOWN |
| INV15-27 | Postcondition is measured and fails | OUTCOME-FAILED |
| INV15-28 | Audit record omits the specification or contract version | Reject record as incomplete |
| INV15-29 | Requested value is recorded as if measured | Reject record |
| INV15-30 | Failure record is overwritten by a later success message | Reject audit behaviour |
| INV15-31 | Audit includes unnecessary secrets | Reject or redact according to governance |
| INV15-32 | Resource report cannot be tied to a defined accounting contract | Resource outcome unresolved |
| INV15-33 | A weaker contract is substituted without revalidation | Reject |
| INV15-34 | Execution is attempted before contract acceptance | Reject execution order |
| INV15-35 | Execution is attempted before authority | Reject execution order |
| INV15-36 | OUTCOME-UNKNOWN is presented as success | Reject |
| INV15-37 | OUTCOME-VERIFIED lacks a passing completion test | Reject |
| INV15-38 | Audit provenance is missing for a critical measurement | Evidence insufficient |
| INV15-39 | An interrupt request is interpreted as proof of reversal | Reject |
| INV15-40 | Stop is confirmed but prior side effects are omitted from the report | Reject audit record |
| INV15-41 | A valid DIAGNOSTIC invocation performs no state-changing action | Accept if all diagnostic checks pass |
| INV15-42 | Every stage passes but no executor is connected | READY at most; not ATTEMPTED |

## 11. Explicitly unresolved

This version does not define a universal authority hierarchy, concrete spoken syntax for profiles or contracts, cryptographic audit integrity, trusted execution hardware, privacy policy for every environment, standard resource units, distributed interruption, universal safe-state behaviour, or a real spell runtime. These require separate contracts and implementation evidence.

**Change policy:** Invocation profiles and contract semantics are locked for this bounded layer. Future additions must specify their scope, guarantees, non-guarantees, evidence requirements, authority boundary, interruption behaviour, audit fields and negative fixtures. No profile may bypass v1.0–v1.4 checks.
