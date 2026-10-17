# Arcane Incantations v1.3 — Mechanism and Effect Semantics

**Status:** LOCKED DESIGN CANON for the bounded modern incantation layer  
**Depends on:** Incantations v1.0 (construction), v1.1 (references and binding), and v1.2 (constraints and failure semantics)  
**Source boundary:** Reuses source-recorded Formal operation forms and coupling categories without claiming that their original glosses determine the full semantics below.  
**Validation status:** 36 specification fixtures. No executable parser, physical simulator, or magical execution is claimed.

## 1. Purpose

This version defines the semantic distinction between an intended result and a mechanism that could produce it. An incantation must not be considered valid merely because it names an operation, a target and a desired outcome.

The central chain is:

**desired state → proposed transition → mechanism model → participants and coupling → preconditions and constraints → feasibility result → externally authorised execution → observed outcome**

Every link has its own evidence requirement. A desired state does not imply a mechanism. Naming a mechanism does not prove it works. Coupling does not prove that the intended effect follows. A plausible transition does not prove resource sufficiency. Validation does not authorise execution.

## 2. Source vocabulary and limits of inference

The source lexicon records the following Formal / CANON operation forms (Magic v3.0 §26):
- `kren` — establish;
- `trak` — alter;
- `frem` — maintain;
- `shren` — release;
- `bran` — couple;
- `vare` — prefer.

It also records coupling categories in Formal / CANON v2.0:
- `hə` — couple: mana;
- `he` — couple: matter;
- `ha` — couple: energy;
- `hu` — couple: living;
- `hi` — couple: information;
- `ho` — couple: field.

These source glosses are evidence for broad lexical roles only. They do not alone specify complete argument order, participant types, resource units, causal laws, permissible transformations, or an executable semantics. The modern design rules in this document must not be retroactively attributed to the historical sources.

## 3. Typed semantic records

The following records are conceptual representations used by an evaluator. They are not literal Arcane utterances and do not introduce spoken tokens.

### 3.1 Desired state

**GOAL = (SUBJECT, PROPERTY, VALUE, SCOPE, ACCEPTANCE-TEST)**

The subject must be a resolved v1.1 reference or another typed entity supplied by an applicable subsystem. Property and value must have compatible types. Scope states where and for how long the goal applies. The acceptance test defines what observable or formally evaluable evidence would count as meeting the goal.

A goal such as “make the target safe” is underspecified until “safe” is expressed as a defined set of properties and acceptance tests.

### 3.2 Transition

**TRANSITION = (INITIAL-STATE, FINAL-STATE, PRECONDITIONS, POSTCONDITIONS)**

The transition describes a proposed change, not its cause. The initial state must be known or explicitly treated as uncertain. The final state must be typed. The transition must not omit relevant constraints inherited from v1.2.

### 3.3 Mechanism

**MECHANISM = (MODEL-ID, PARTICIPANTS, INPUTS, TRANSFORMATION, OUTPUTS, DOMAIN-ASSUMPTIONS, EVIDENCE-LEVEL)**

- **MODEL-ID:** a defined mechanism model in a supported subsystem.
- **PARTICIPANTS:** resolved, typed participants.
- **INPUTS:** required states, resources, signals or conditions.
- **TRANSFORMATION:** a rule defined by that model.
- **OUTPUTS:** predicted state changes or produced values.
- **DOMAIN-ASSUMPTIONS:** assumptions that must be checked or explicitly accepted by the evaluator.
- **EVIDENCE-LEVEL:** the kind of support available for the mechanism claim.

A free-text mechanism description is explanatory only. It cannot pass feasibility checks unless mapped to a defined model.

### 3.4 Coupling relation

**COUPLING = (CATEGORY, PARTICIPANT-A, PARTICIPANT-B, RELATION-MODEL, VALIDITY-SCOPE)**

This is a modern semantic record. The category may use one of the source-recorded coupling forms, but the coupling itself must be defined by a model. Category alone does not specify direction, strength, distance, duration, transfer, causality or resource cost.

A coupling is a relation between participants. It is not the requested effect, and it does not entail that the participants can exchange arbitrary properties or resources.

## 4. Goal, transition and mechanism must remain separate

A valid semantic construction must not collapse these concepts:

- “The target reaches state X” is a goal.
- “The target changes from state A to state X” is a transition.
- “Model M transforms input A into output X under conditions C” is a mechanism claim.
- “Participants A and B satisfy coupling relation R” is a coupling claim.
- “The measured final state satisfies the acceptance test” is outcome evidence.

The evaluator must reject a mechanism claim that merely repeats the goal in different words. “Make the wall transparent by transparency” is not a mechanism. “Couple energy” is not a complete causal explanation. A named coupling category is not proof that any desired transformation is possible.

## 5. Operation roles in this layer

The operation selector continues to use the bounded v1.0 interpretations:

- `kren`: request establishment of a specified state;
- `trak`: request a specified state transition;
- `frem`: request maintenance of a specified state;
- `shren`: request release of a specified relation, state or maintained operation, only when the release target is typed;
- `bran`: request establishment of a typed coupling relation;
- `vare`: express a preference among already admissible alternatives, not permission to violate constraints.

These are the incantation layer's modern operational conventions, not a claim that source glosses alone historically encoded these exact argument rules.

### 5.1 Establish

`kren` requires a goal, a defined transition from the known or declared initial state, and a mechanism model when the requested state cannot be treated as a direct state assignment by the supported domain. It may not create missing evidence by assertion.

### 5.2 Alter

`trak` requires an identified initial state or a declared uncertainty model, a typed final state, and a supported transition. If the current state is unknown and the mechanism depends on it, the operation is unresolved or underspecified.

### 5.3 Maintain

`frem` requires a state predicate, a maintenance interval, a mechanism capable of monitoring or preserving that predicate, and resource/termination rules. Naming a state does not prove it can be held indefinitely. An indefinite maintenance request is invalid unless the relevant model defines a finite or renewable resource plan and a termination condition.

### 5.4 Release

`shren` requires a specific releasable relation or maintained operation and a defined release transition. It does not mean “undo everything previously done”. It cannot release an arbitrary coupling or reverse a transformation unless the relevant model defines that operation.

### 5.5 Couple

`bran` requires a coupling category, two typed participants, a relation model and a validity scope. It must not imply an effect beyond the coupling model's declared outputs. The same participant may not be silently substituted after resolution failure.

### 5.6 Prefer

`vare` ranks alternatives that have already passed mandatory checks. It cannot select an infeasible option over a feasible one merely because it is preferred, nor override an invariant, permission decision, resource bound or target binding.

## 6. Mechanism evidence levels

This layer recognises the following evidence labels for internal evaluation. They are not new spoken Arcane tokens:

- **UNDEFINED:** no applicable mechanism model exists.
- **ASSERTED:** a mechanism is named, but no model-backed support is supplied.
- **MODEL-CHECKED:** a defined model's stated preconditions and transition rules have been evaluated.
- **EMPIRICALLY-SUPPORTED:** a model has supporting measurements in a stated domain and range.
- **OUT-OF-DOMAIN:** the proposed use falls outside the model's validated assumptions or range.
- **CONTRADICTED:** available supported evidence conflicts with the mechanism claim.

Only MODEL-CHECKED may pass a purely formal model check, and it supports only the model's own scope. EMPIRICALLY-SUPPORTED is not universal proof. OUT-OF-DOMAIN and CONTRADICTED block validation. ASSERTED and UNDEFINED are insufficient to validate a causal claim.

An evaluator must preserve the provenance of evidence. It must not upgrade an assertion to an empirical result merely because the spell is well-formed.

## 7. Coupling, effect and causation

A coupling relation may provide a condition under which a mechanism operates, but the causal law belongs to the mechanism model. The following implications are invalid unless an applicable model explicitly establishes them:

- coupling exists ⇒ desired effect occurs;
- energy coupling exists ⇒ any amount of energy is available;
- information coupling exists ⇒ information is true or authorised;
- living coupling exists ⇒ consent or biological safety;
- field coupling exists ⇒ arbitrary control over the field;
- matter coupling exists ⇒ arbitrary matter rearrangement;
- a mechanism predicts an effect ⇒ execution is permitted;
- execution was attempted ⇒ postcondition succeeded.

Coupling direction and participant roles must be explicit when the model requires them. No universal symmetry, distance, persistence or transitivity rule is assumed.

## 8. Feasibility result

The mechanism stage returns one of these semantic outcomes:

- **SUPPORTED:** model and inputs are within declared scope and all relevant checks pass;
- **UNSUPPORTED:** no defined model supports the causal claim;
- **INSUFFICIENT-EVIDENCE:** a model exists but necessary inputs, measurements or assumptions are missing;
- **OUT-OF-DOMAIN:** inputs or conditions exceed the model's supported domain;
- **CONTRADICTED:** the claim conflicts with the supported model or evidence;
- **BLOCKED:** a preceding reference, type, precondition, constraint, resource or authorisation check failed.

These outcomes refine the internal explanation of v1.0's broader evaluator states. They do not replace the externally visible failure states. UNSUPPORTED or INSUFFICIENT-EVIDENCE normally map to UNDERSPECIFIED; OUT-OF-DOMAIN may map to UNDERSPECIFIED or INFEASIBLE depending on whether a missing model boundary or a proven impossibility is involved; CONTRADICTED maps to INFEASIBLE only when the contradiction is established by the applicable model.

Do not report INFEASIBLE merely because no model is known. Lack of support and proof of impossibility are different claims.

## 9. Abstract worked example

**Goal:** a named target should occupy a specified final position.

**Transition:** initial position P0 → final position P1.

**Mechanism requirement:** a supported model must explain how the transition occurs, what participants and inputs it requires, and which constraints bound the movement.

**Coupling:** if the model requires coupling, a typed relation must be declared between named participants. Selecting a coupling category does not itself provide the transition rule.

**Constraints:** v1.2 preconditions, resource bounds, protected-region invariants and external authorisation still apply.

**Verification:** the final position must be measured or otherwise established under a supported acceptance test.

If no model supports the requested transition, the evaluator must not fabricate a causal mechanism. If a model exists but the initial state is unavailable, report insufficient evidence. If the model predicts success but the observed final position differs, report POSTCONDITION-FAILED.

This example intentionally does not assert that any real-world movement spell is physically possible.

## 10. Acceptance and rejection fixtures

These are specification-level fixtures, not executed parser results.

| ID | Condition | Expected result |
|---|---|---|
| MEC13-01 | Goal, transition and mechanism are represented separately | Accept structure |
| MEC13-02 | Goal is expressed only as an untyped adjective | UNDERSPECIFIED |
| MEC13-03 | Mechanism merely restates the requested goal | Reject as non-explanatory |
| MEC13-04 | No applicable mechanism model exists | UNSUPPORTED; not automatically proof of impossibility |
| MEC13-05 | Mechanism is asserted without model-backed support | ASSERTED; not validated |
| MEC13-06 | Defined model and all required inputs pass within scope | MODEL-CHECKED / SUPPORTED |
| MEC13-07 | Inputs fall outside model's stated domain | OUT-OF-DOMAIN; block validation |
| MEC13-08 | Evidence contradicts the proposed mechanism | CONTRADICTED; block validation |
| MEC13-09 | `bran` has a category but no participants | UNDERSPECIFIED |
| MEC13-10 | `bran` names participants but no relation model | UNSUPPORTED or UNDERSPECIFIED |
| MEC13-11 | Coupling is treated as proof of the intended effect | Reject |
| MEC13-12 | Energy coupling is treated as an unlimited energy supply | Reject |
| MEC13-13 | Information coupling is treated as proof that data are true | Reject |
| MEC13-14 | Living coupling is treated as consent | Reject |
| MEC13-15 | `kren` requests a new state but no valid transition/model exists | Block validation |
| MEC13-16 | `trak` depends on an unknown initial state | UNRESOLVED / INSUFFICIENT-EVIDENCE |
| MEC13-17 | `frem` requests indefinite maintenance with no resource/termination model | UNDERSPECIFIED |
| MEC13-18 | `shren` is interpreted as universal undo | Reject |
| MEC13-19 | `vare` chooses an option that violates a hard constraint | Reject |
| MEC13-20 | Preferred alternative fails mandatory preconditions | Exclude alternative |
| MEC13-21 | Model predicts output but resource check fails | RESOURCE-INSUFFICIENT or BLOCKED |
| MEC13-22 | Mechanism is supported but external authorisation is denied | Execution blocked |
| MEC13-23 | Model check passes and no engine exists | VALIDATED only; not EXECUTED |
| MEC13-24 | Execution is reported but output test fails | POSTCONDITION-FAILED |
| MEC13-25 | A mechanism model's evidence provenance is missing | Insufficient evidence |
| MEC13-26 | Empirical support from one domain is assumed universal | Reject generalisation |
| MEC13-27 | Coupling direction is omitted where model requires it | UNDERSPECIFIED |
| MEC13-28 | Participant is silently replaced after a resolution failure | Reject |
| MEC13-29 | A mechanism assumes a resource conversion rate not defined by its subsystem | UNDERSPECIFIED |
| MEC13-30 | A model proves the requested transition impossible under stated conditions | INFEASIBLE |
| MEC13-31 | A model is unknown, so impossibility is asserted without proof | Reject status claim |
| MEC13-32 | Transition succeeds but a declared invariant is violated | Failure; never report successful completion |
| MEC13-33 | The mechanism output type does not match the goal property type | Type error |
| MEC13-34 | A coupling relation is assumed symmetric without model support | Reject |
| MEC13-35 | A coupling relation is assumed persistent beyond its declared scope | Reject |
| MEC13-36 | All supported checks pass but the result has not been observed | VALIDATED at most; outcome unverified |

## 11. Explicitly unresolved

This version does not define:
- the universal predicate or property language used in goals;
- a complete mechanism-model registry or its trust policy;
- universal causal laws or physical simulation;
- resource units, transformations, conservation or replenishment;
- how a model is empirically validated, versioned or revoked;
- the spoken syntax for GOAL, TRANSITION, MECHANISM or COUPLING records;
- a complete performed-incantation pronunciation/ritual protocol;
- actual spell execution.

**Change policy:** Mechanism semantics are locked for this bounded design layer. Future work must define typed domains and model contracts, retain provenance, include negative fixtures, and preserve the distinctions between intention, causation, coupling, feasibility, authorisation, execution and verified outcome.
