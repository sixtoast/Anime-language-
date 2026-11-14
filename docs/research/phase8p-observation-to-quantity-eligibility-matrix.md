# Arcane Phase 8P — observation-to-quantity eligibility matrix

**Status:** Consolidated research validation matrix and decision boundary  
**Date:** 2026-10-15  
**Canon effect:** none  
**New vocabulary:** none  
**Implementation changes:** none  
**Tests executed:** none

## 1. Purpose

Phases 8N–8O establish the observation record proposal and contrast the meanings of NES, SIMA, DAVE and GAMA. This phase answers the next practical question: when can a value originating in information be consumed as a typed quantity by arithmetic or comparison?

The answer must not be a single yes/no property called "valid". A record can be retrievable but stale, physically measured but poorly resolved, dimensionally typed but semantically ambiguous, or suitable for historical analysis but not for current control.

The matrix is a research policy proposal. It does not add canon or assert that the website currently implements these checks.

## 2. Independent eligibility gates

Every candidate value should be assessed on distinct axes:

1. **Provenance:** Is the value retrieved, measured, inferred, or assigned? Is the source chain recorded?
2. **Availability:** Is the information actually available to the operation?
3. **Measurement sufficiency:** If claimed as a measurement, are pathway, sensor, interaction, resolution and available information accounted for?
4. **Property identity:** Is the measured/inferred quantity or property identified?
5. **Type and dimension:** Are the value kind, unit and dimension known where applicable?
6. **Freshness:** Is the record current enough for this intended use, or is a static/historical value acceptable?
7. **Uncertainty:** Are resolution and uncertainty known well enough for the precision of the intended decision?
8. **Operation contract:** Does the consuming arithmetic/comparison operator accept this value kind and its units?
9. **Physical relevance:** If the result is used to control or claim a physical effect, has the separate physical mechanism been validated?

These gates are independent. Passing one does not imply the others.

## 3. Eligibility matrix

| Value origin/state | Arithmetic use | Comparison use | Current-control use | Research decision |
|---|---|---|---|---|
| Retrieved record with known type/unit, current enough for use | Eligible if operator contract passes | Eligible if comparison contract passes | Still needs control/physical gates | Conditionally eligible |
| Retrieved record whose freshness is unknown | May be allowed for historical analysis if declared | Current-state comparison blocked unless stale-tolerant | Block current control by default | Freshness unresolved |
| Retrieved record known stale | Historical calculation may proceed with time context | Do not present as current comparison | Block current control by default | Stale, not necessarily unusable |
| Physical observation with valid pathway and typed value, uncertainty known | Eligible if quantity/operator contracts pass | Eligible within resolution and comparison contract | Physical feasibility and timing still required | Conditionally eligible |
| Observation with missing resolution | Low-precision use only if a conservative rule is explicitly specified | Threshold decisions may be indeterminate | Block decisions that require unsupported precision | Precision-limited |
| Value labelled measured but pathway/sensor/interaction absent | Block measurement-based claims | Block as a validated observation | Block | Measurement provenance incomplete |
| Inference with declared evidence/model and typed output | Arithmetic may proceed if output type is approved | Comparison may proceed with uncertainty preserved | Prediction/control policy required | Inferred, not measured |
| Inference with no evidence/model provenance | Block evidence-dependent uses | Block truth/threshold claim | Block | Unsupported inference |
| Symbolic assignment via GAMA | May be used as a symbolic value if its type is established | Symbolic comparison may be possible | Cannot by itself justify a physical effect | Assigned, not physically enacted |
| Untyped numeric value | Generic numeric arithmetic only if the active mathematical profile allows it; no physical interpretation | Numeric-only comparison may be possible | Block physical control | Physical type unresolved |
| Missing/unknown value | Never silently substitute zero | Result unknown/indeterminate unless a defined policy applies | Block | Missing is not zero |
| Correctly typed result but incompatible quantity kind | Block until semantic operator contract resolves it | Block unless comparison semantics are defined | Block | Semantic type mismatch |

The phrases "eligible", "blocked" and "conditionally eligible" are policy outcomes for the proposed research validator, not current implementation statuses.

## 4. Intended-use context matters

A stale or uncertain value is not automatically useless. Eligibility depends on the claim.

For example:
- A week-old velocity observation can be valid input for historical analysis of what happened last week.
- The same observation is not sufficient evidence of the target's current velocity without an explicit model or a new measurement.
- A low-resolution temperature measurement may be adequate to distinguish 5 °C from 80 °C, but inadequate for a decision whose threshold lies within the instrument's uncertainty.
- A predicted value can be useful for planning while remaining an inference rather than a direct observation.

**Proposal:** the consumer must declare the intended use or the policy profile must define it. Do not silently promote "valid for some analysis" into "valid for live control".

No canonical purpose annotation or temporal syntax is defined here.

## 5. Arithmetic and comparison are separate consumers

A quantity may be acceptable for one operation but not another.

### Arithmetic

Arithmetic needs the relevant operator contract, quantity kind, dimension and units. For example, a measured length divided by a measured time can yield a candidate velocity dimension, but a named velocity value and its frame semantics still require approval.

### Comparison

Comparison needs compatible operands and a defined relation. If the comparison determines whether a physical control action is triggered, uncertainty and measurement resolution matter. If a value lies within the uncertainty band around the threshold, a binary result may not be justified without a decision policy.

The canonical comparison operator contract and uncertainty-aware comparison semantics remain unresolved. This phase does not invent them.

## 6. Compact worked cases

### Case A — old record, historical calculation

A typed velocity record from time (t_0) is retrieved at (t_1), and the task is to calculate the average velocity during the interval containing (t_0).

- Retrieval can succeed.
- The old record's timestamp is preserved.
- It may be usable for the historical calculation if the interval and units are compatible.
- It must not be silently labelled the target's velocity at (t_1).

**Proposed outcome:** eligible for appropriately scoped historical analysis; not automatically current.

### Case B — fresh measurement, unknown resolution

A sensor returns a temperature value and the pathway is available, but its resolution is unknown. A downstream decision asks whether the temperature exceeds a threshold very close to the reported value.

- The observation can be retained.
- Its resolution remains unknown.
- The threshold result cannot be claimed with precision that the sensor evidence does not support.

**Proposed outcome:** measurement record retained; threshold decision indeterminate or blocked pending a policy.

### Case C — inferred velocity assigned to a symbol

DAVE produces a predicted velocity from available observations and a declared model; GAMA assigns that result to a symbolic destination.

- The value's provenance remains inference.
- Assignment does not convert it into a direct measurement.
- Its type may support symbolic calculation if approved.
- Any physical control action requires its own prediction-risk and mechanism checks.

**Proposed outcome:** possibly usable as a typed prediction; not relabelled as measured and not treated as a physical effect.

### Case D — missing measurement replaced by zero

A sensor is unavailable and the system substitutes (0\,\mathrm{m/s}).

- Sensor unavailability does not establish that the target is stationary.
- Zero is a real numeric value; missing is an information state.
- Substitution would change the meaning of the record.

**Proposed outcome:** reject silent substitution. Preserve unavailable/unknown unless an explicit, justified domain-specific imputation policy is defined.

## 7. Proposed status vocabulary for research records

These are plain research labels, not Arcane vocabulary:

- `ELIGIBLE_FOR_DECLARED_USE`
- `ELIGIBLE_WITH_LIMITATIONS`
- `BLOCK_FRESHNESS`
- `BLOCK_MEASUREMENT_PROVENANCE`
- `BLOCK_TYPE_OR_UNIT`
- `BLOCK_OPERATOR_CONTRACT`
- `INDETERMINATE_UNCERTAINTY`
- `BLOCK_PHYSICAL_CONTROL_GATE`
- `UNKNOWN_NOT_ZERO`

They are intentionally more specific than a generic "invalid" label so a later implementation or language specification can explain why a value cannot be used.

## 8. Decision boundary: what can be settled now?

The following principles are sufficiently grounded to retain as project-wide safeguards:
- Keep NES, SIMA, DAVE and GAMA distinct.
- Preserve source provenance and observation time.
- Do not call a measurement exact without support for that precision.
- Do not treat a retrieved record as automatically current.
- Do not convert missing information to numeric zero.
- Do not infer a physical effect from symbolic assignment or arithmetic alone.
- Keep source versions and historical forms explicit.

The following still require a formal decision before becoming normative:
- Canonical representation of unavailable, stale and uncertain values.
- Freshness thresholds and clock/temporal semantics.
- Uncertainty representation and uncertainty-aware comparison.
- Exact signatures and failure behaviour of NES, SIMA, DAVE and GAMA.
- Rules for quantity-kind inference from arithmetic.
- Whether/how inferred values may feed autonomous physical control.
- Surface syntax for attaching provenance, units and measurement parameters.

## 9. Next phase

This matrix closes the immediate observation-to-quantity eligibility question at the research-policy level. The next useful move is to consolidate the remaining measurement/information decisions into a short approval docket, then resume productive language construction in a domain whose canonical semantic inventory is more complete. Candidate domains include the spatial relations `JO/JUR/JA/JE/JI` and roles `PO/FO/LO`, but their argument signatures and surface grammar must be checked before creating clauses.

- **Decision ID:** P8P-OBSERVATION-QUANTITY-ELIGIBILITY-01
- **Canon changes:** none.
- **New vocabulary:** none.
- **Implementation changes:** none.
- **Tests executed:** none.
