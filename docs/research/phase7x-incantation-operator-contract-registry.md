# Arcane Phase 7X — version-scoped incantation operator contract registry

**Status:** Evidence-grounded registry and work queue; not a new canon specification  
**Date:** 2026-10-15  
**Finding ID:** P7X-INCANTATION-OPERATOR-REGISTRY-01  
**Canon effect:** none  
**Sources:** `docs/canon/arcane-language-v3.0-L.md`, `docs/canon/magic-system-v3.0.md`, `docs/audits/phase-2-formal-syntax.md`, `docs/research/phase7a-operator-inventory-reconciliation.md`, `sources/originals/Arcane_Lexicon_v5_draft.csv`  
**New Arcane forms:** 0  
**Executable tests run:** 0

## 1. Purpose

Phase 7W established that Arcane can proceed with incantation research but must not present incomplete constructions as validated. This registry records the evidence available for the first operator families, distinguishing canonical gloss, version/source, signature status and permitted next step.

It deliberately does not flatten all source spellings into a single replacement list. The v3.0-L core document and the v5 draft lexicon disagree on several preferred forms: the v3.0-L inventory lists FRATA, FRAKA, DRIM, DRAL, GRAK and KWAK, while the v5 draft records FRAJA, FRAMA, DRUM, DRAS, GRASH and KWASH as renamed forms. Preserve both source strata and the alias/renaming relationship. The chosen form for a particular incantation must be declared by its specification version.

## 2. Status vocabulary

- **CANON-GLOSS:** a gloss is recorded in a canonical source. This does not imply complete signature or execution semantics.
- **PROVISIONAL-SIGNATURE:** a proposed signature exists in the Phase 2 audit but is not a complete normative contract.
- **UNKNOWN-SIGNATURE:** no complete signature is established in the inspected sources.
- **CONCEPT-ONLY:** the source describes a conceptual role, but executable details are missing.
- **VERSION-CONFLICT:** source layers differ in preferred form/status; do not silently normalise.
- **BLOCKED:** do not label an incantation using this operator executable until the named contract is resolved.

## 3. Information and binding operators

| Form | Source gloss | Evidence status | Signature status | Incantation readiness |
|---|---|---|---|---|
| NES | Read/retrieve available information | CANON-GLOSS, v3.0-L | UNKNOWN-SIGNATURE; at least one information reference conceptually | BLOCKED pending source/reference contract |
| SIMA | Measure through a physical pathway | CANON-GLOSS, v3.0-L | PROVISIONAL-SIGNATURE; target/property and pathway conceptually required; exact arity unresolved | BLOCKED pending sensor/pathway/observation contract |
| GAMA | Assign a representation/value | CANON-GLOSS, v3.0-L | PROVISIONAL-SIGNATURE; destination/reference and value conceptually | BLOCKED for physical effects; assignment is not causation |
| DAVE | Infer from information | CANON-GLOSS, v3.0-L | PROVISIONAL-SIGNATURE; evidence and inference rule/model conceptually | BLOCKED pending inference and output-type contract |
| KWAM | Create a binding | CANON-GLOSS, v3.0-L | PROVISIONAL-SIGNATURE; identifier and expression conceptually | Skeleton-only pending identifier/evaluation rules |
| KWAT | Reference an established binding | CANON-GLOSS, v3.0-L | PROVISIONAL-SIGNATURE; identifier conceptually | Skeleton-only pending binding scope/resolution |
| KWAK | Live evaluation | v3.0-L source form; v5 draft lists KWASH as renamed | VERSION-CONFLICT; provisional unary concept, evaluation timing unresolved | BLOCKED pending version and live-sampling semantics |

**Invariant:** NES, SIMA and DAVE are not interchangeable. Reading available information, acquiring a measurement through a physical pathway and inferring a hypothesis are different operations. GAMA changes a symbolic representation/assignment, not the physical referent merely by assigning a value. KWAM creates a binding, not matter, energy or a physical object.

## 4. Arithmetic and vector operators

The Phase 2 audit offers provisional signatures for these operators. They are useful starting points, not a blanket execution guarantee.

| v3.0-L form | v5 draft relationship | Gloss | Proposed signature | Remaining contract |
|---|---|---|---|---|
| FRAPA | same form listed | Add | Quantity × Quantity → Quantity; arity 2 | Unit compatibility and numeric domains |
| FRATA | FRAJA recorded as renamed form | Subtract | Quantity × Quantity → Quantity; arity 2 | Version choice, operand order, unit rules |
| FRAKA | FRAMA recorded as renamed form | Multiply | Quantity × Quantity → Quantity; arity 2 | Version choice and dimensional algebra |
| FRALA | same form listed | Divide | Quantity × Quantity → Quantity or ratio; arity 2 | Zero-denominator and dimension rules |
| FRASHA | same form listed | Negate | Numeric value → numeric value; arity 1 | Accepted numeric types and units |
| DRAN | same form listed | Magnitude | Vector/value → scalar magnitude; arity 1 | Supported input types |
| DREM | same form listed | Dot product | Vector × Vector → Scalar; arity 2 | Dimension, vector space and unit rules |
| DRIM | DRUM recorded as renamed form | Cross product | 3D vector × 3D vector → 3D vector; arity 2 | Version choice, orientation and dimensional rules |
| DRAL | DRAS recorded as renamed form | Compare | Comparable × Comparable × criterion → Boolean/logic; arity 3 proposed | Criterion representation and relation semantics |

**Important:** these signatures are explicitly provisional where inherited from the Phase 2 audit. They are not sufficient for a Tier 2 incantation until the relevant type, unit, domain and failure rules are approved.

## 5. Logic and control operators

| v3.0-L form | v5 draft relationship | Gloss | Proposed signature | Remaining contract |
|---|---|---|---|---|
| GRAN | same form listed | AND | Boolean × Boolean → Boolean; binary proposed | Whether n-ary form is permitted |
| GRAT | same form listed | OR | Boolean × Boolean → Boolean; binary proposed | Whether n-ary form is permitted |
| GRAK | GRASH recorded as renamed form | NOT | Boolean → Boolean; unary proposed | Version choice and Boolean typing |
| BEK | same form listed | IF | Condition × expression/action; arity 2 proposed | Else branch, laziness and evaluation order |
| ZET | same form listed | WHILE | Condition × repeated action; arity 2 proposed | Re-evaluation timing, termination and failure behaviour |

The performed clitics `s-` (IF) and `sh-` (WHILE) are recorded separately as performed forms. Their existence does not establish that the same clitic syntax can be used in formal written incantations.

## 6. Operational forms from Magic System v3.0

These forms are recorded in the magic-system source and the v5 lexicon, but are not fully integrated into the v3.0-L core operator inventory. Their appearance in a canonical source supports preserving them in the registry, not guessing executable signatures.

| Form | Source gloss | Contract questions | Current readiness |
|---|---|---|---|
| KREN | Establish | What is established: a symbolic condition, prepared configuration, constraint, or another state? | UNKNOWN-SIGNATURE; blocked |
| TRAK | Alter | What is the input state, transformation specification and output relation? Is scope general or constrained? | UNKNOWN-SIGNATURE; blocked |
| FREM | Maintain | What is maintained, for how long, and how are disturbance/resource limits represented? | UNKNOWN-SIGNATURE; blocked |
| SHREN | Release | What is released: binding, hold, prepared configuration, coupling or active effect? | UNKNOWN-SIGNATURE; blocked |
| BRAN | Couple | Which participants interact, by which pathway, under what conditions, with what output semantics? | UNKNOWN-SIGNATURE; blocked |
| VARE | Prefer | What alternatives and criterion are compared; how are ties, unknowns and infeasible options handled? | UNKNOWN-SIGNATURE; blocked |

Do not assume KREN creates physical matter, TRAK changes anything whatsoever, SHREN cancels every possible effect, BRAN guarantees a result, or VARE selects a feasible result. These are unresolved semantics, not minor implementation details.

## 7. Coupling vocabulary from v2.0

The v5 lexicon records the following as CANON from v2.0:

| Form | Source gloss | Known limit |
|---|---|---|
| HƏ | Couple: mana | Full argument signature and operational relation unresolved |
| HE | Couple: matter | Full argument signature and operational relation unresolved |
| HA | Couple: energy | Full argument signature and operational relation unresolved |
| HU | Couple: living | Full argument signature and operational relation unresolved |
| HI | Couple: information | Full argument signature and operational relation unresolved |
| HO | Couple: field | Full argument signature and operational relation unresolved |

These entries must retain their source/version metadata. Their glosses do not prove a productive morphology, interchangeable argument order, or a deterministic relation to BRAN. Do not construct executable expressions by simply placing one after another.

## 8. Initial information/control design fixtures

These are semantic test prompts, not Arcane translations or executable incantations.

### Fixture IC-01 — available information

**Intent:** retrieve information already available through a specified source.

**Candidate concept:** NES.

**Required unresolved fields:** exact information reference form, source/access scope, output type and failure behaviour.

**Expected distinction:** retrieval does not itself imply a new physical measurement.

**Gate status:** L BLOCKED; C incomplete; P not assessed.

### Fixture IC-02 — physical measurement

**Intent:** obtain an observation of a target property through a specified measurement pathway.

**Candidate concept:** SIMA.

**Required fields:** target/property, sensor or sensing interaction, pathway, resolution, available information, observation type and measurement failure.

**Expected distinction:** the measurement pathway and sensor interaction cannot be omitted merely because a property name is present.

**Gate status:** L BLOCKED pending exact signature; C incomplete until pathway is specified; P not assessed.

### Fixture IC-03 — assign a representation

**Intent:** associate a symbolic value with a destination/reference.

**Candidate concept:** GAMA.

**Required fields:** destination/reference, value, binding/scope rules and output state.

**Expected distinction:** assigning a symbolic value must not be interpreted as physically forcing the referenced object to match that value.

**Gate status:** L provisional; C limited to symbolic assignment; physical-effect claim rejected.

### Fixture IC-04 — bind and refer

**Intent:** establish a named binding to an expression, then refer to that binding.

**Candidate concepts:** KWAM and KWAT.

**Required fields:** identifier representation, expression boundary, binding scope, lifetime, shadowing/rebinding policy and unresolved-reference behaviour.

**Expected distinction:** referencing a binding is not the same as re-evaluating a live expression; the relationship to KWAK/KWASH must be specified by version.

**Gate status:** skeleton-only; no executable form asserted.

## 9. Required contract schema

For each operator, future registry records must contain:

- `operator_id`, `surface_form`, `source_version`, `register`, `source_location`;
- `gloss_status`, `signature_status`, `alias_or_renaming_links`;
- `input_types`, `arity`, `output_type`, `units_and_domains`;
- `evaluation_semantics`, `scope_and_binding`, `side_effects`;
- `preconditions`, `failure_modes`, `resource_implications`;
- `positive_examples`, `negative_examples`, `expected_parse`;
- `canon_or_proposal_status`, `review_decision`, `supersedes`.

If a field is unknown, store UNKNOWN and the evidence needed to resolve it. Do not fill it with an inferred value merely to make a table appear complete.

## 10. Acceptance requirements

The registry is ready to support candidate incantations only when:

1. each used form is tied to a named source/version;
2. aliases are explicit and no global substitution erases historical forms;
3. every used operator has an approved signature and input/output types;
4. unit and domain rules are defined for numeric/vector expressions;
5. target/reference tokens resolve deterministically;
6. nested syntax has a unique parse;
7. control-flow evaluation and termination semantics are specified;
8. coupling and operational forms have documented contracts;
9. negative cases reject invalid constructions rather than guessing;
10. test evidence distinguishes inspection from actual parser execution and from physical-model assessment.

## 11. Decision ledger and next step

- **Finding:** P7X-INCANTATION-OPERATOR-REGISTRY-01
- **Operator families inventoried:** information/binding, arithmetic/vector, logic/control, operational, coupling
- **New forms:** 0
- **Canon changes:** 0
- **Executable tests run:** 0
- **Candidate fixtures authored:** 4 semantic prompts
- **Next step:** settle a narrow, version-scoped contract for one small operator subset, beginning with KWAM/KWAT and the distinction between NES and SIMA; then produce fixtures in the syntax actually supported by the project tools.
