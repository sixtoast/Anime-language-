# Arcane Incantations v1.9 — Resource Accounting and Conservation Contracts

**Status:** LOCKED DESIGN CANON for the bounded modern incantation metalanguage  
**Layer:** Modern specification metalanguage; not a reconstruction of historical spoken syntax  
**Depends on:** Incantations v1.0–v1.8; typed values and measurements in v1.6; predicates and preconditions in v1.7; spatial/resource-relevant scope declarations in v1.8  
**Validation status:** 60 specification fixtures defined in this document. They are expected semantic outcomes, not evidence of an executable resource evaluator, physical model, or real-world spell execution.  
**Source-vocabulary effect:** None. No new spoken tokens, historical word meanings, or complete signatures for KREN, TRAK, FREM, SHREN, BRAN, or VARE are introduced.

## 1. Purpose and boundary

A declared effect does not prove that the required resources exist, that a proposed conversion is valid, or that an operation conserves the quantities the relevant physical model requires. A dimensional calculation is not a conservation proof. A budget is not a resource source. A reservation is not consumption. An estimate is not an observation.

Version 1.9 defines a bounded accounting contract between an incantation request, its declared resource requirements, and an execution environment capable of reporting resource events. It makes resource claims explicit, typed, attributable, time-scoped, and auditable. It does not supply universal physical laws, a universal resource inventory, a mana-to-energy conversion, or a working spell runtime.

The following distinctions are mandatory:

- **Resource kind** identifies what is accounted for (for example, matter, energy, momentum, information capacity, mana, time, bandwidth, memory, or a domain-specific resource). Listing a kind does not establish its units or governing law.
- **Quantity** gives a magnitude and dimension under a declared unit and conversion contract.
- **Account** identifies the entity, region, substrate, or bounded system whose holdings or flows are tracked.
- **Source** is an explicitly identified origin that can supply a resource under a source contract.
- **Sink** is an explicitly identified destination or loss pathway, where the model permits such a category.
- **Transfer** moves an accounted quantity between accounts; it does not itself create or destroy the resource.
- **Transformation** converts or changes a resource under an explicit transformation contract, including applicable inputs, outputs, losses, uncertainty, and conservation obligations.
- **Reservation** marks capacity or holdings as committed to a pending operation without claiming physical consumption.
- **Consumption** records a resource use or irreversible debit under the relevant accounting model.
- **Release/refund** returns an unconsumed reservation or records a genuine returned quantity. A bookkeeping refund must not fabricate a physical reversal.
- **Estimate** is a prediction; **measurement** is an observation with method, time, uncertainty, and provenance.
- **Budget** is a declared limit or allocation policy. It is not proof of availability.
- **Conservation contract** names the resource(s), system boundary, time interval, permitted exchanges, and invariant(s) that must hold for the specific model.

## 2. Accounting record model

The names below are specification fields, not Arcane words or spoken syntax. An implementation may use a different representation only if it preserves equivalent information and distinctions.

### 2.1 Resource definition

RESOURCE-DEFINITION = (RESOURCE-KIND, DIMENSION, UNIT-CONTRACT, ACCOUNTING-MODE, PRECISION-POLICY, UNCERTAINTY-POLICY, SOURCE-REQUIREMENTS, CONSERVATION-CONTRACT-REF)

- RESOURCE-KIND is a stable identifier; similar labels do not imply interchangeability.
- DIMENSION and UNIT-CONTRACT follow v1.6. Conversion requires a defined, applicable rule and declared precision behaviour.
- ACCOUNTING-MODE identifies the permitted model, such as conserved quantity, bounded stock, consumable capacity, rate-limited flow, or explicitly non-conserved domain measure. The mode must be justified by a domain contract; it cannot be chosen merely to make a request pass.
- PRECISION-POLICY declares rounding, quantisation, overflow and numerical tolerance rules.
- UNCERTAINTY-POLICY states how estimates and measurements contribute to upper/lower bounds and when evidence is insufficient.
- SOURCE-REQUIREMENTS declares what provenance a source claim needs.
- CONSERVATION-CONTRACT-REF links a defined invariant where one is applicable. An absent contract is unresolved, not a licence to assume conservation or non-conservation.

### 2.2 Account and ledger

RESOURCE-ACCOUNT = (ACCOUNT-ID, RESOURCE-KIND, SCOPE, OPENING-BALANCE, VALID-TIME, PROVENANCE, ACCOUNT-CONTRACT)

LEDGER-EVENT = (EVENT-ID, INVOCATION-ID, RESOURCE-KIND, EVENT-KIND, FROM-ACCOUNT, TO-ACCOUNT, AMOUNT, UNIT, VALID-TIME, STATUS, SOURCE-OR-CONVERSION-REF, UNCERTAINTY, EVIDENCE, IDEMPOTENCY-KEY)

Event kinds are bounded to OPENING, SOURCE-ENTRY, TRANSFER, TRANSFORMATION-INPUT, TRANSFORMATION-OUTPUT, RESERVE, RESERVATION-RELEASE, CONSUME, MEASURED-RETURN, LOSS, EXTERNAL-EXCHANGE, CORRECTION, and RECONCILIATION. An event kind may be used only where the relevant resource and account contracts permit it.

Every event has a stable identity and is tied to an invocation and contract version. A repeated delivery with the same idempotency key must not debit twice. Corrections append a traceable correcting event; they do not silently erase the original record. The ledger preserves both reported facts and their provenance, including disagreements.

### 2.3 Source, transfer and transformation records

RESOURCE-SOURCE = (SOURCE-ID, RESOURCE-KIND, SOURCE-ACCOUNT, AVAILABLE-QUANTITY, AVAILABILITY-WINDOW, AUTHORITY-REF, EVIDENCE-REF, UNCERTAINTY, SOURCE-CONTRACT)

RESOURCE-TRANSFER = (TRANSFER-ID, RESOURCE-KIND, FROM-ACCOUNT, TO-ACCOUNT, AMOUNT, VALID-TIME, TRANSFER-CONTRACT, OBSERVATION-REQUIREMENTS)

RESOURCE-TRANSFORMATION = (TRANSFORMATION-ID, INPUTS, OUTPUTS, SYSTEM-BOUNDARY, VALID-TIME, CONVERSION-RULE, EFFICIENCY-OR-LOSS-MODEL, CONSERVATION-OBLIGATIONS, UNCERTAINTY, EVIDENCE-REF)

A source declaration is not accepted as measured availability unless its evidence meets the source contract. A transfer must debit and credit the appropriate accounts under a consistent event model. A transformation must declare its input and output kinds, boundary, conversion rule, and any relevant loss or uncertainty. A missing output cannot be treated as zero loss unless the model explicitly supports that conclusion and adequate evidence exists.

No generic transformation from mana to energy, information to matter, or one resource kind to another is presumed. Any such relationship requires its own approved domain-specific conversion contract and evidence. A label such as “mana”, “energy”, “force”, “information”, or “matter” cannot substitute for a dimension, account, mechanism, or source.

## 3. Budget and reservation semantics

RESOURCE-BUDGET = (BUDGET-ID, RESOURCE-KIND, SCOPE, LIMIT, UNIT, TIME-WINDOW, AGGREGATION-RULE, UNCERTAINTY-MARGIN, OVERAGE-POLICY, EVIDENCE-REQUIREMENTS)

A budget may be an upper limit, a minimum required reserve, a rate limit, a per-invocation cap, a cumulative cap, or a combination explicitly identified by the budget contract. These are not interchangeable. A resource requirement is compared only with a compatible budget and unit contract.

RESERVATION = (RESERVATION-ID, INVOCATION-ID, ACCOUNT, RESOURCE-KIND, AMOUNT, EXPIRY, PRIORITY-POLICY, RELEASE-POLICY, STATUS)

Reservation states are REQUESTED, HELD, REJECTED, EXPIRED, RELEASED, PARTIALLY-CONSUMED, and SETTLED. A held reservation reduces the amount available to competing reservations under the account's declared concurrency policy, but does not by itself mean that the resource has been physically consumed. Reservation expiry is a state change that must be observed or contractually guaranteed; it must not be presumed from the passage of time if the execution environment cannot enforce it.

Budget preflight uses a conservative bound where uncertainty matters. If a required maximum consumption is 8 units and the credible upper bound is 9, a strict cap of 8 is not satisfied. An expected value below the cap is not sufficient when the contract requires worst-case compliance. The policy may explicitly permit probabilistic or risk-bounded accounting, but the threshold, confidence model, and evidence must be stated; none is implicit.

## 4. Conservation contracts and balance checks

CONSERVATION-CONTRACT = (CONTRACT-ID, RESOURCE-KINDS, SYSTEM-BOUNDARY, VALID-INTERVAL, OPENING-STATE, CLOSING-STATE, PERMITTED-EXCHANGES, TRANSFORMATION-RULES, INVARIANT, TOLERANCE, UNCERTAINTY-RULE, EVIDENCE-REQUIREMENTS)

A conservation contract evaluates an invariant over the defined boundary and interval. A general balance check may be expressed as:

OPENING + SOURCES + PERMITTED-INPUTS = CLOSING + SINKS + PERMITTED-OUTPUTS + DECLARED-LOSSES

This is a schematic bookkeeping relation, not a universal physical law or a claim that all terms are scalar-additive. It may be used only when the resource's accounting mode, dimensions, boundary, conversion rules, and signs make the relation meaningful. For vector-valued, relational, informational, or otherwise non-scalar resources, the contract must define the appropriate invariant rather than force them into scalar addition.

A balance within tolerance is only a successful accounting check under the named contract. It does not establish that the source is authorised, the mechanism is physically valid, the spell was executed, the target state changed, or the overall outcome succeeded. Conversely, a mismatch may be due to measurement uncertainty, an unmodelled exchange, stale evidence, a ledger defect, or an actual conservation violation; the evaluator must preserve the distinction and evidence.

## 5. Preflight and execution stages

Resource validation is staged and does not replace the earlier v1.0–v1.8 checks:

1. **SPECIFICATION-CHECKED:** resource kinds, units, accounts, budgets and required conservation contracts are declared sufficiently to evaluate the request.
2. **SOURCE-VERIFIED:** required source accounts and availability evidence meet the source contract.
3. **BUDGET-CHECKED:** applicable per-operation, cumulative, rate and time-window limits are satisfied under the required uncertainty policy.
4. **RESERVATIONS-HELD:** required reservations are held under the concurrency policy.
5. **RESOURCE-READY:** the declared resource preflight checks pass. This is not execution.
6. **ATTEMPTED:** an execution contract reports that an attempt began.
7. **RESOURCE-REPORTED:** the execution environment reports resource events and/or consumption estimates.
8. **RESOURCE-RECONCILED:** required event evidence and balances have been reconciled to the specified contract.
9. **RESOURCE-OUTCOME-UNKNOWN:** evidence is missing, stale, contradictory or insufficient to determine the required accounting outcome.

Failure labels include RESOURCE-SPEC-UNDERSPECIFIED, SOURCE-UNVERIFIED, RESOURCE-UNAVAILABLE, RESOURCE-INSUFFICIENT, BUDGET-EXCEEDED, RESERVATION-CONFLICT, RESERVATION-EXPIRED, UNIT-CONTRACT-MISSING, CONVERSION-UNDEFINED, CONSERVATION-UNRESOLVED, CONSERVATION-MISMATCH, RESOURCE-EVIDENCE-STALE, RESOURCE-REPORT-INCOMPLETE, RESOURCE-RECONCILIATION-FAILED, and RESOURCE-OUTCOME-UNKNOWN. These are evaluator/report labels, not spoken Arcane tokens. Mapping to v1.0/v1.5 statuses must preserve the specific cause.

A preflight success is not a claim that any physical resource has moved or been consumed. A reported consumption is not verified until the required accounting evidence is reconciled. A failed or interrupted operation may still have consumed resources or caused side effects; interruption does not imply refund, rollback or reversal.

## 6. Transaction, partial execution and recovery

A profile may request ALL-OR-NOTHING, PARTIAL-ALLOWED, or BEST-EFFORT resource semantics. The request is accepted only if the execution contract explicitly supports the selected mode and its rollback/reconciliation guarantees.

- **ALL-OR-NOTHING** requires an executor-supplied transaction guarantee covering every relevant resource event and side effect within the declared boundary. If the executor cannot guarantee this, the invocation is blocked before attempt. A language-level label alone does not create atomicity.
- **PARTIAL-ALLOWED** requires explicit partial-result semantics, minimum acceptable completion, accounting for completed and uncompleted stages, and a declared recovery path.
- **BEST-EFFORT** allows incomplete achievement only where the profile explicitly permits it; it does not waive conservation, authority, safety, source, or reporting requirements.
- **COMPENSATION** is a new operation that attempts to counteract a prior effect. It is not a rollback unless the executor contract proves the required rollback semantics. Compensation can consume additional resources and can itself fail.
- **REFUND** may release an unconsumed reservation or record a measured return. It must not erase real consumption or claim that an external effect was reversed without evidence.
- **INTERRUPTION** preserves the original attempt status, interruption acknowledgement, resource events, residual activity and final reconciliation state as separate fields.

If a transaction fails after a resource debit, the evaluator must not assume the debit was undone. If the executor cannot determine whether a resource event occurred, the result is unknown and dependent operations must not treat the resource as available without a resolution policy. Recovery must use a stable invocation ID and idempotency keys to avoid duplicate debit during retries.

## 7. Concurrency and temporal validity

Concurrent invocations must share a declared account/ledger consistency model. Reservations for the same finite stock cannot both be accepted based on the same unreserved balance unless the account contract explicitly permits overcommitment and defines its consequences. A check-then-reserve sequence is not safe under concurrent modification unless the executor guarantees an atomic or otherwise sufficient coordination contract.

Every availability assertion has a valid-time window and provenance. A past measurement cannot prove present availability outside its validity contract. A source may become unavailable after preflight; the execution contract must specify whether to recheck, abort, partially execute, or return an unresolved result. Time windows, expiry, ordering, and reconciliation latency are part of the contract, not universal assumptions.

Distributed ledgers may disagree or be temporarily unavailable. If the contract does not guarantee the consistency needed by the requested profile, the request is blocked or reports RESOURCE-OUTCOME-UNKNOWN; the system must not silently choose whichever account reading makes the operation feasible.

## 8. Invocation audit extension

The v1.5 invocation record is extended with RESOURCE-ACCOUNTING-RECORD = (RESOURCE-DEFINITIONS, ACCOUNT-SNAPSHOTS, BUDGETS, SOURCE-CLAIMS, RESERVATIONS, LEDGER-EVENTS, TRANSFORMATIONS, CONSERVATION-CHECKS, ESTIMATES, OBSERVATIONS, RECONCILIATION, UNCERTAINTY, UNRESOLVED-DISCREPANCIES, CONTRACT-VERSIONS).

The record must retain:
- exact resource, unit, conversion, budget, conservation and execution-contract versions;
- the difference between predicted, reserved, reported, measured, reconciled, and unknown quantities;
- source and destination identities, system boundary and time interval;
- uncertainty, rounding and tolerance policies;
- rejected, expired, released, consumed, returned and corrected events;
- partial execution, interruption, compensation and unresolved residual effects;
- contradictions and missing evidence without overwriting the original observations.

An audit record can be internally complete while describing a failed or unknown outcome. Audit completeness must not be equated with successful conservation, feasibility, or execution.

## 9. Specification fixtures

These 60 fixtures are normative expected outcomes for the bounded design. They have not been represented as results from a running spell runtime.

| ID | Case | Expected result |
|---|---|---|
| RES19-01 | Resource kind is declared but dimension/unit contract is absent where required | RESOURCE-SPEC-UNDERSPECIFIED |
| RES19-02 | Compatible quantity and unit contracts are declared | Continue to other checks |
| RES19-03 | Incompatible dimensions are added as one stock | Reject; TYPE-ERROR or DOMAIN-ERROR |
| RES19-04 | Unit conversion is attempted without a defined conversion contract | UNIT-CONTRACT-MISSING / CONVERSION-UNDEFINED |
| RES19-05 | Budget is treated as evidence that a source exists | Reject inference |
| RES19-06 | Source account is identified and evidence satisfies its source contract | SOURCE-VERIFIED for that contract only |
| RES19-07 | Source is named but authority/provenance evidence is missing where required | SOURCE-UNVERIFIED |
| RES19-08 | Required stock is less than conservative verified available amount | Source/budget checks may pass |
| RES19-09 | Required stock exceeds verified available amount | RESOURCE-UNAVAILABLE or RESOURCE-INSUFFICIENT |
| RES19-10 | Expected consumption is under cap but required upper bound exceeds cap | BUDGET-EXCEEDED |
| RES19-11 | Strict cap is satisfied by conservative bound | BUDGET-CHECKED |
| RES19-12 | Probabilistic budget policy is invoked without threshold/confidence model | RESOURCE-SPEC-UNDERSPECIFIED |
| RES19-13 | Reservation is held for a pending operation | Mark reserved; do not record physical consumption |
| RES19-14 | Two concurrent reservations exceed shared finite stock | Reject/conflict unless explicit overcommit contract applies |
| RES19-15 | Reservation expires but no expiry enforcement/evidence exists | RESERVATION-EXPIRED or unknown; do not assume availability |
| RES19-16 | Reservation is released before any consumption | Release reservation; no fabricated physical return |
| RES19-17 | Reservation is partly consumed | Preserve consumed amount and release only unconsumed remainder |
| RES19-18 | Same debit event is retried with same idempotency key | Do not debit twice |
| RES19-19 | Same-looking events have different IDs and no deduplication contract | Reconciliation required; do not silently deduplicate |
| RES19-20 | Transfer has matching source debit and destination credit under same contract | Transfer may reconcile |
| RES19-21 | Transfer credits destination but source debit is absent | CONSERVATION-MISMATCH or reconciliation failure |
| RES19-22 | Transformation defines inputs, outputs, boundary and conversion rule | Evaluate its explicit contract |
| RES19-23 | Transformation claims an output with no defined conversion rule | CONVERSION-UNDEFINED |
| RES19-24 | Matter is declared created with no source or permitted transformation | Reject; missing source/mechanism |
| RES19-25 | Energy is declared without a source, transfer or permitted transformation | Reject; missing source/mechanism |
| RES19-26 | Mana is silently converted into energy by matching numeric magnitudes | Reject; no implicit conversion |
| RES19-27 | Conservation contract specifies system boundary and interval | Evaluate only within that boundary/interval |
| RES19-28 | Boundary omits a potentially relevant exchange | CONSERVATION-UNRESOLVED |
| RES19-29 | Scalar balance equation is applied to a resource with incompatible structure | Reject model; require appropriate invariant |
| RES19-30 | Balance matches within declared tolerance with adequate evidence | Conservation check satisfied for named contract only |
| RES19-31 | Balance mismatch is within no permitted tolerance | CONSERVATION-MISMATCH |
| RES19-32 | Balance mismatch may be explained by measurement uncertainty but policy is undefined | CONSERVATION-UNRESOLVED |
| RES19-33 | Declared loss has no permitted pathway or evidence | Reject silent loss |
| RES19-34 | Opening balance is unknown but treated as zero | Reject; VALUE-UNKNOWN |
| RES19-35 | Stale availability measurement is used outside validity window | RESOURCE-EVIDENCE-STALE |
| RES19-36 | Source is verified but execution authority is absent | Execution blocked independently of resource result |
| RES19-37 | Budget check passes but mechanism is incomplete | Not validated |
| RES19-38 | Resource preflight passes but operation has not started | RESOURCE-READY at most |
| RES19-39 | Attempt begins but resource report is absent | RESOURCE-REPORT-INCOMPLETE / RESOURCE-OUTCOME-UNKNOWN |
| RES19-40 | Reported consumption is not reconciled against required evidence | Do not label RESOURCE-RECONCILED |
| RES19-41 | Execution fails after a confirmed resource debit | Preserve debit; do not assume rollback |
| RES19-42 | Interrupted operation has residual resource effects | Preserve partial stop and residual accounting |
| RES19-43 | Compensation is attempted and fails | Preserve original effects and compensation failure |
| RES19-44 | Refund is issued for physically consumed quantity without return evidence | Reject false refund claim |
| RES19-45 | Unconsumed reservation is released with valid evidence | Release allowed; no physical refund claim |
| RES19-46 | ALL-OR-NOTHING requested but executor lacks transaction guarantee | Block before attempt |
| RES19-47 | PARTIAL-ALLOWED requested with explicit stage/resource report | Accept only within declared partial contract |
| RES19-48 | BEST-EFFORT is used to bypass conservation or authority | Reject |
| RES19-49 | Retry uses stable invocation identity and event idempotency | Avoid duplicate debit |
| RES19-50 | Retry creates new event identity for a possibly repeated debit without reconciliation | RESOURCE-OUTCOME-UNKNOWN pending reconciliation |
| RES19-51 | Two invocations pass a stale check-then-reserve sequence concurrently | Reject unsupported concurrency assumption |
| RES19-52 | Account contract supplies sufficient atomic reservation semantics | Reservations may proceed under that contract |
| RES19-53 | Distributed accounts disagree and no resolution/consistency contract exists | RESOURCE-OUTCOME-UNKNOWN |
| RES19-54 | Resource report uses a different contract version from preflight | Reconcile versions; do not assume equivalence |
| RES19-55 | Conversion changes units but rounding/precision policy is absent | RESOURCE-SPEC-UNDERSPECIFIED |
| RES19-56 | Estimate is presented as measurement | Reject evidence-category substitution |
| RES19-57 | Measurement has method, time, uncertainty and provenance | May satisfy evidence requirement if policy accepts it |
| RES19-58 | Ledger correction erases the original debit record | Reject; correction must be append-only/traceable |
| RES19-59 | Audit record is complete but outcome is unknown | Accept audit completeness; preserve unknown outcome |
| RES19-60 | Resource accounting passes but target postcondition is false or unknown | Do not claim overall spell success |

## 10. Explicitly unresolved

This version does not define a universal inventory of resource kinds, a canonical spoken syntax for accounting records, a universal mana/energy conversion, all physical laws or conservation equations, domain-wide unit definitions, a universal uncertainty calculus, a universal ledger consistency model, trusted source instrumentation, a mechanism-completeness evaluator, or a real spell runtime. It does not decide the physical substrate or full cost model for Logos. These questions require their own evidence-backed domain contracts.

The resource categories listed in examples are not a claim that all are conserved in the same way. A conservation invariant applies only where the relevant domain model establishes it. Resource accounting does not itself authorise an operation, supply a mechanism, establish physical feasibility, prove a state change, or certify a spell as executed.

**Change policy:** The bounded resource-accounting design is locked. A new resource kind or transformation must define its type/dimension, unit contract, source and account model, uncertainty and provenance requirements, applicable budget semantics, conservation boundary/invariant if relevant, execution/reporting requirements, and negative fixtures. Do not add spoken tokens or infer missing historical signatures as part of this layer.
