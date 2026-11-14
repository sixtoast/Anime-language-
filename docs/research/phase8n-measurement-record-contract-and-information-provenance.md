# Arcane Phase 8N — measurement record contract and information provenance

**Status:** Canon-grounded semantic proposal  
**Date:** 2026-10-15  
**Canon effect:** none  
**New vocabulary:** none  
**Implementation changes:** none  
**Tests executed:** none

## 1. Purpose

This phase connects the established arithmetic quantity model to Arcane's measurement and information operators. Its central question is: what must be known about a value before it can safely be used in a later calculation?

The canonical language specification establishes that:
- `SIMA` means measure and produces an Observation;
- a valid measurement requires pathway, sensor, interaction, resolution and available information;
- `NES` retrieves available information;
- `DAVE` constructs an inference from information;
- `GAMA` assigns a representation and does not cause the represented physical state;
- a quantity/property is distinct from a particular value of that quantity;
- static observation `O(t₀)` can remain unchanged while live measurement `O(t)` updates over time, and stale information can cause errors.

The magic-system specification further distinguishes the world, signal, interaction, sensor, neural representation and interpretation, and requires sensing systems to have finite range, bandwidth, resolution, noise, coupling and blind spots.

These statements ground the separation rules in this document. The record structure below is a proposal, not canonical surface syntax.

## 2. Proposed observation record

**Proposal, not canon:** represent an observation used by research fixtures as:

```text
ObservationRecord:
  observed_property: declared quantity/property
  value: typed quantity value OR explicit unknown/failure
  unit: explicit unit when applicable
  target_reference: declared target/reference
  measurement_pathway: identified mechanism/pathway
  sensor: identified sensor or sensing process
  interaction: declared signal/target interaction
  resolution: declared measurement resolution
  observation_time: time or interval, if known
  availability_time: when the record became available, if known
  source_provenance: where/how the record was obtained
  uncertainty_or_noise: declared representation, or unresolved
  status: observed | unavailable | failed | stale | unresolved
  source_status: canon | proposal | unresolved
```

The fields are metadata for a research model. They are not Arcane words, a grammar production, or a claim that every implementation already stores these fields.

The five canon-required measurement concepts—pathway, sensor, interaction, resolution and available information—must not disappear merely because the short canonical example is `SIMA RI VANU`.

## 3. Quantity property versus measured value

A quantity/property identifies what is being discussed; a value records a particular result.

For example:
- `VANU` names velocity as a quantity/property.
- `SIMA RI VANU` is the canonical approximate example for measuring the target's velocity.
- A particular result such as 12 m/s would be a typed value attached to an observation record in research notation.

The example number and unit here illustrate the record model only; they are not encoded as a new canonical Arcane clause. The property name alone does not supply a value, sensor, pathway, resolution, timestamp or uncertainty.

A value without enough provenance may still be a stored number, but the system must not mislabel it as a fresh physical measurement.

## 4. Four operations that must remain distinct

| Operation | Canon-grounded meaning | Output concept | Must not be assumed |
|---|---|---|---|
| `NES` | Retrieve already available information | Existing information/record | That it is true, current, complete or newly measured |
| `SIMA` | Acquire information through a physical measurement pathway | Observation | That it is exact, complete, or an inference |
| `DAVE` | Construct an inference from information | Hypothesis/inferred result | That a strong inference has probability 1 or is itself a direct measurement |
| `GAMA` | Assign a representation/value | Symbolic assignment | That assignment changes the physical referent |

These distinctions are canonical. The exact argument signatures, record syntax, scope rules and failure representations remain unresolved.

## 5. Freshness and static versus live records

**Proposal:** treat freshness as a property of a record relative to a declared use, not as an intrinsic guarantee of `NES` or `SIMA`.

A research record may distinguish:
- observation time: when the sensing interaction occurred;
- availability time: when the information became accessible;
- retrieval time: when a later operation read the record;
- intended-use time: the time for which the consumer needs the information.

These times can differ. A record can be accurately retrieved by `NES` and still be stale for the current task. A live measurement may update over time, but `SIMA` does not guarantee perfect accuracy or universal availability.

No canonical timeout, maximum age, clock model, or freshness comparison syntax is defined here. If freshness cannot be assessed, label it unknown rather than silently treating it as current.

## 6. Uncertainty, resolution and exactness

The canonical measurement requirements include resolution, and the magic-system specification names resolution, noise and blind spots as properties of sensing mechanisms.

**Proposal:** a measurement record must distinguish:
- resolution: the granularity the measurement system can distinguish;
- uncertainty/noise: limitations or variation in the reported result;
- precision claim: what the record says about its numeric representation;
- accuracy claim: how well the observation represents the actual property.

These are distinct concepts. A number printed with many decimal places does not prove high resolution or low uncertainty. A missing uncertainty representation is not the same as zero uncertainty.

The exact uncertainty notation and calibration model remain unresolved. Do not invent a canonical error-bar grammar in this phase.

## 7. How measured values enter arithmetic

A quantity value may be eligible for arithmetic only after the relevant checks are passed:

1. The observation's property is identified.
2. Its value has an explicit type, dimension and unit where applicable.
3. The measurement record has sufficient pathway/sensor/interaction/resolution provenance for the claim being made.
4. Its freshness is adequate for the intended use, or the use explicitly permits a static/historical observation.
5. The arithmetic operator's type and dimensional contract is available.
6. The result kind is approved or explicitly left as a generic derived quantity.
7. If a physical effect is claimed, a separate physical-mechanism and feasibility assessment is performed.

This is a research validation pipeline, not a new mandatory runtime sequence already implemented by the website.

## 8. Failure and missing-data cases

The safe research model must not substitute fabricated values for absent observations.

| Case | Proposed record/result handling | Reason |
|---|---|---|
| Target known, sensor/pathway absent | Mark measurement construction incomplete | Property name is not a measurement mechanism |
| Sensor/pathway declared, interaction unavailable | Mark failed or unavailable, according to evidence | No observation should be invented |
| Source unavailable to `NES` | Return explicit unavailable/unknown state | Retrieval is not guaranteed |
| `NES` returns an old record | Preserve record and mark freshness assessable/possibly stale | Retrieval does not refresh the observation |
| Measurement has unknown resolution | Do not call it exact | Precision claim unsupported |
| Observation exists but inference is required | Use a separately specified inference step | Observation is not inference |
| Numeric value assigned with `GAMA` | Update symbolic representation only | Assignment is not physical causation |
| Observation lacks unit for a dimensional quantity | Block dimensional arithmetic until unit/type is resolved | Raw number is insufficient |
| Strong inference treated as certainty | Reject the certainty claim absent a justified rule | Inference probability is not automatically 1 |

The words `failed`, `unavailable` and `stale` are English research labels, not proposed Arcane lexemes.

## 9. Worked abstract example: target velocity

Intent: obtain a velocity observation for a target and later use it in a calculation.

The canonical example `SIMA RI VANU` is preserved as the short, approximate source example. It is not expanded into a supposedly canonical clause here.

A research fixture might record:

```text
observed_property: VANU
target_reference: RI
value: 12 m/s
measurement_pathway: PATH-VELOCITY-01
sensor: SENSOR-VELOCITY-01
interaction: INTERACTION-TEST-01
resolution: 0.5 m/s
observation_time: t0
availability_time: t0
uncertainty_or_noise: unresolved
status: observed
source_status: proposal
```

All identifiers and numeric values in this record are illustrative. This fixture is complete only relative to the metadata proposal; it is not a claim that the canonical Arcane language has a surface syntax for these fields.

Now compare four downstream uses:

- **Read the recorded result:** use the concept of `NES`; this does not repeat the physical measurement.
- **Measure current velocity:** use the concept of `SIMA` with an actual available pathway, sensor and interaction; a new record may differ from the old one.
- **Infer future velocity:** use the concept of `DAVE` with observations and an explicit inference model; the prediction is not a direct measurement.
- **Assign 12 m/s to a symbolic binding:** use the concept of `GAMA`; this does not make the target move at 12 m/s.

The same number may appear in all four scenarios, but the provenance and meaning differ.

## 10. Decision ledger and next phase

- **Decision ID:** P8N-MEASUREMENT-RECORD-PROVENANCE-01
- **Canon changes:** none.
- **New vocabulary:** none.
- **Implementation changes:** none.
- **Tests executed:** none.
- **Grounded contribution:** measurement preconditions and the NES/SIMA/DAVE/GAMA distinctions are traced to the supplied canonical specifications.
- **Proposal contribution:** observation record fields, freshness metadata, uncertainty distinctions, and arithmetic-readiness gates.
- **Next phase:** create a contrast fixture bank for NES, SIMA, DAVE and GAMA, including stale data, unavailable sensors, unknown resolution, inference versus observation, and symbolic assignment versus physical change. Keep examples abstract and source-stratified; do not invent executable surface syntax.
