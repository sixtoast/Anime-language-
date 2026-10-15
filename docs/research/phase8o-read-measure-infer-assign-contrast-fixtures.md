# Arcane Phase 8O — read, measure, infer and assign contrast fixtures

**Status:** Source-stratified semantic fixtures with proposal-level expected outcomes  
**Date:** 2026-10-15  
**Canon effect:** none  
**New vocabulary:** none  
**Tests executed:** none

## 1. Purpose

Phase 8N proposed an observation record and provenance model. This phase supplies contrast cases for the four core information operations `NES`, `SIMA`, `DAVE` and `GAMA`.

The central invariant is canonical: retrieving information, physically measuring a property, inferring a hypothesis and assigning a symbolic value are different operations. These fixtures test that distinction. They are documentation fixtures, not executable Arcane clauses, and have not been run through the website.

## 2. Fixture record format

Each case records:
- **Intent:** what the user/system wants to do.
- **Evidence:** what information or physical access actually exists.
- **Operation concept:** the canon-glossed operator under consideration.
- **Expected research outcome:** accept, block or reject under the stated proposal.
- **Canon boundary:** what the source establishes and what remains open.

Outcome labels in this document are English research labels, not Arcane words or website statuses.

## 3. NES — retrieval fixtures

| ID | Intent and evidence | Expected research outcome | Canon-grounded reason |
|---|---|---|---|
| INF-NES-01 | Read an available record containing temperature value 21 KU | Retrieval may succeed; preserve record provenance | NES reads available information |
| INF-NES-02 | Read from a source that is unavailable | Return explicit unavailable/unknown; do not fabricate a value | No source means no retrieved record |
| INF-NES-03 | Retrieve a valid record recorded yesterday | Retrieval may succeed, but freshness must be assessed separately | Reading does not refresh the underlying observation |
| INF-NES-04 | Retrieve a record whose source claims a value is exact but supplies no resolution | Preserve the claim as source data; do not endorse its precision | Retrieved claim is not independently validated |
| INF-NES-05 | Retrieve a prediction and treat it as a direct physical measurement | Block the relabelling | Record provenance and operation type differ |
| INF-NES-06 | Retrieve a number without unit or quantity type, then use it in dimensional arithmetic | Block typed arithmetic until the missing metadata is resolved | Raw numeric value is not a complete typed quantity |

The specific temperature number in INF-NES-01 is illustrative. `KU` is the canonical kelvin unit token; this fixture does not define a full temperature-record syntax or conversion rule.

## 4. SIMA — physical measurement fixtures

| ID | Intent and evidence | Expected research outcome | Canon-grounded reason |
|---|---|---|---|
| INF-SIMA-01 | Target, property, pathway, sensor, interaction, resolution and available information declared | Eligible for proposed observation validation | These are the canonical measurement preconditions |
| INF-SIMA-02 | Target/property named but no pathway or sensor | Block as incomplete | `SIMA RI VANU` does not erase the stated measurement requirements |
| INF-SIMA-03 | Sensor exists but cannot interact with the target in the current conditions | Fail/unavailable according to evidence; no invented value | Measurement requires a real pathway and interaction |
| INF-SIMA-04 | Target is outside the sensor's range | Fail/unavailable; do not return a confident observation | Sensing has range and blind spots |
| INF-SIMA-05 | Measurement yields a value but resolution is unknown | Preserve observation with resolution unknown; reject claim of exactness | Resolution is a required measurement concept |
| INF-SIMA-06 | Measurement record is static at time t0 and requested again at t1 | Return the old record as old, or perform a new measurement if requested and possible | Static observation does not automatically update |
| INF-SIMA-07 | Sensor produces a noisy estimate | Record uncertainty/noise if representable; do not silently set it to zero | Sensing has noise and limitations |

These expected outcomes are research rules based on the canonical measurement model. Exact failure tokens, uncertainty representation and temporal surface syntax remain unspecified.

## 5. DAVE — inference fixtures

| ID | Intent and evidence | Expected research outcome | Canon-grounded reason |
|---|---|---|---|
| INF-DAVE-01 | Infer a hypothesis from identified observations and a declared inference model | Eligible for proposal-level inference validation | DAVE constructs inference from information |
| INF-DAVE-02 | No evidence is available but a definite answer is requested | Block or return unresolved; do not invent evidence | Inference must be constructed from information |
| INF-DAVE-03 | Evidence supports a likely but uncertain hypothesis | Record confidence/uncertainty if model supports it; do not assert probability 1 merely because it is strong | Magic-system specification states P(H|O) ≠ 1 merely because inference is strong |
| INF-DAVE-04 | A stored prediction is retrieved with NES and presented as a new inference | Keep retrieval provenance distinct from a newly performed inference | NES and DAVE have different meanings |
| INF-DAVE-05 | A direct observation is renamed “inference” without any inference step | Block the provenance relabelling | Observation and inference are distinct |
| INF-DAVE-06 | Inference model, assumptions or evidence links are missing | Mark contract incomplete | Exact DAVE argument/output contract remains unresolved |

This fixture bank does not prescribe a probability calculus, inference language, or canonical DAVE signature.

## 6. GAMA — symbolic assignment fixtures

| ID | Intent and evidence | Expected research outcome | Canon-grounded reason |
|---|---|---|---|
| INF-GAMA-01 | Assign a known numeric representation to an identified symbolic destination | Eligible only if destination/value types and assignment contract are specified | GAMA assigns a representation/value |
| INF-GAMA-02 | Assign 12 m/s to a variable representing a target's velocity | Symbolic binding may change; target motion does not follow | Assignment is not physical causation |
| INF-GAMA-03 | Assign a length value to a destination declared as temperature | Reject/block unless an explicit conversion/type rule exists | Incompatible types require a defined operation/conversion |
| INF-GAMA-04 | Destination scope or identifier is ambiguous | Block; do not guess the binding | Identifier and scope semantics remain unresolved |
| INF-GAMA-05 | Assign a prediction and later read it | Preserve its inferred/predicted provenance | Assignment does not turn a prediction into measurement |
| INF-GAMA-06 | Assignment is described as creating matter or energy | Reject the physical claim absent a separate mechanism and resource analysis | Symbolic assignment is not a physical state transition |

The source does not yet define all legal destinations, assignment arity, mutation rules, or identifier scopes. Those remain open.

## 7. Cross-operator confusion traps

| ID | Confusion | Required distinction |
|---|---|---|
| INF-X-01 | `NES` used where a new measurement is required | Retrieval does not perform sensing |
| INF-X-02 | `SIMA` used where a hypothesis must be constructed | Observation does not automatically infer |
| INF-X-03 | `DAVE` treated as guaranteed truth | Inference is evidence-dependent and may be uncertain |
| INF-X-04 | `GAMA` used to claim a physical state changed | Assignment changes symbolic representation, not automatically the referent |
| INF-X-05 | Old observation treated as current | Freshness must be assessed for the intended use |
| INF-X-06 | Missing value silently replaced by zero | Missing/unknown is not numeric zero |
| INF-X-07 | Value with no units used as a physical quantity | Type/unit metadata must be resolved |
| INF-X-08 | A parseable expression treated as a valid physical mechanism | Syntax, semantic typing and physical feasibility are separate gates |

## 8. What this fixture bank establishes

It turns the canon's information distinctions into reviewable cases. It does not claim:
- that any example is valid executable surface syntax;
- that the website implements the proposed record or status fields;
- that DAVE has a fully specified inference signature;
- that SIMA has a fully specified surface argument list;
- that GAMA has a complete assignment/mutation contract;
- that freshness thresholds or uncertainty formats are canonically defined.

## 9. Next decision boundary

The fixture bank shows that the next missing piece is not more generic operator description. It is a compact specification of **observation-to-quantity eligibility**: under what conditions may an observation be passed into arithmetic, compared with another observation, or used as evidence for an inference?

Next phase should build that eligibility matrix around type, dimension, unit, property identity, time/freshness and provenance. Then consolidate the outstanding measurement decisions into a small approval docket rather than expanding into another open-ended inventory.

## 10. Decision ledger

- **Decision ID:** P8O-INFORMATION-OPERATION-CONTRAST-FIXTURES-01
- **Canon changes:** none.
- **New vocabulary:** none.
- **Implementation changes:** none.
- **Tests executed:** none.
- **Main result:** contrast fixtures for retrieval, physical measurement, inference and symbolic assignment, including negative cases.
