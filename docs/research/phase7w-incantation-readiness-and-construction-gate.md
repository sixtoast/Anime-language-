# Arcane Phase 7W — incantation readiness and construction gate

**Status:** Readiness assessment; proposal, not canon  
**Date:** 2026-10-15  
**Finding:** P7W-INCANTATION-READINESS-01  
**Canon effect:** none; no new Arcane forms  
**Tests executed:** none

## 1. Finding

Arcane is ready for incantation design research, semantic prompts and explicitly non-executable formal skeletons. It is not yet ready for a general corpus of reliably parseable, validated incantations.

The limitation is not simply vocabulary size. The canonical sources distinguish intent, specification, neural representation, interface encoding, mana configuration, coupling, physical mechanism and effect. Some interfaces between those layers remain incompletely specified.

Three different questions must never be conflated:

1. **Linguistic validity:** does the sequence have one interpretation under a named Arcane version?
2. **Construction completeness:** does the interpretation specify target, state transition, coupling, mechanism, constraints and termination as needed?
3. **Casting/physical feasibility:** can the stated construction be realised under resource, timing, coupling, stability and caster constraints?

A sequence may pass one gate and fail another. A unique parse does not prove feasibility or successful casting.

## 2. Readiness matrix

| Area | Evidence | Current readiness | Missing requirement |
|---|---|---|---|
| Core operator vocabulary | Canonical v3.0-L plus additional forms in Magic System v3.0 | Partial | Reconcile inventories while preserving versions |
| Signatures and arity | Some signatures are recorded; several are unknown | Blocked for general execution | Approved argument counts and typed contracts |
| Parsing and nesting | Explicit-boundary notation proposed | Prototype only | Normative grammar and deterministic parse rules |
| Types and units | Type inventory and dimensional rules incomplete | Blocked for quantitative constructions | Type/domain rules and unit conversions |
| References and target scope | Fused references recovered; collisions remain | Partial | Slot/boundary rules, especially RE and RA |
| Coupling | H-series and BRAN are present, signatures unresolved | Blocked for reliable target interaction | Participants, pathway, conditions and semantics |
| Mechanism | Canonical magic specification requires a physical mechanism | Conceptually established | Construction-specific causal model and preconditions |
| Constraints and control | Conceptual layers exist; details incomplete | Partial | Scope, failure and termination semantics |
| Temporal behaviour | Temporal concepts exist, complete forms/signatures incomplete | Partial | Duration, rate, deadline and termination rules |
| Resource/caster limits | Reserves, throughput, power, coherence, bandwidth and tolerance are distinguished | Conceptually established | Construction-specific budgets |
| Vernacular grammar | SVO/constrained hybrid is a proposal | Separate track | Owner decision; not a prerequisite for formal syntax |
| Validation corpus | Test documents exist, but not a complete executable suite | Blocked | Versioned fixtures and expected parse/failure outcomes |

## 3. Three-gate review model

### Gate L — linguistic validity

Check token provenance, register and version; operator signatures; argument counts and types; unique grouping; reference resolution; modifier/control scope; and explicit handling of unknown tokens.

Outcomes: `PASS`, `FAIL`, `AMBIGUOUS`, `BLOCKED_BY_SPEC`.

### Gate C — construction completeness

Check initial and target state, operation/state transition, target reference, coupling participants and pathway, physical mechanism, constraints, termination/failure behaviour, timing, spatial scope, units and resources.

Outcomes: `COMPLETE_FOR_REVIEW`, `INCOMPLETE`, `INCONSISTENT`, `BLOCKED_BY_MISSING_MODEL`.

### Gate P — physical/casting feasibility

Check consistency with the magic-system model, resource demands, mana propagation, timing, coherence, target susceptibility, caster control bandwidth and tolerance, stability and failure modes.

Outcomes: `PLAUSIBLE_FOR_SIMULATION`, `NOT_FEASIBLE`, `INSUFFICIENT_PARAMETERS`, `NOT_ASSESSED`.

Gate P requires a specified model and relevant parameters. Wording alone cannot earn a feasibility pass.

## 4. Distinguish the terms

- **Spell:** a deliberately constructed, physically valid mana-field trajectory, according to Magic System v3.0.
- **Incantation:** a spoken or internally represented linguistic interface that encodes, guides or triggers a construction.
- **Incantation text:** a written representation of that interface.
- **Casting event:** one attempt by a particular caster under particular conditions.
- **Prepared construction:** a configuration prepared before a later trigger; preparation and activation are distinct.

A written incantation is not automatically the spell itself. Repeating the same sound does not guarantee the same neural state, mana configuration, target, available resources or outcome.

## 5. First development tiers

- **Tier 0 — semantic prompts:** describe intent, target, starting conditions, mechanism and unknowns in ordinary language. No Arcane executable string is claimed.
- **Tier 1 — formal skeletons:** use only documented operator names and explicitly provisional notation. Unknown signatures stay unresolved; skeletons are not validated incantations.
- **Tier 2 — candidate incantations:** require approved signatures, types, unique parse, resolved references and defined construction semantics.
- **Tier 3 — reviewed constructions:** require documented linguistic and construction checks plus a model-based feasibility assessment. Record conditions, assumptions, expected observations and failure modes.

Arcane can responsibly work in Tiers 0 and 1 now. Tier 2 should begin operator by operator when the relevant contracts are resolved. Tier 3 is not currently justified as a general capability.

## 6. Minimum record for each candidate

Record: stable ID; status; language/lexicon version; register; provenance; intended effect; initial state; target reference; operator sequence; parse tree; typed arguments and units; mechanism; coupling; constraints; termination; failure modes; Gate L/C/P outcomes and evidence; expected observations; review history.

Unknown fields must remain explicitly unknown rather than being silently filled with convenient defaults.

## 7. First research set

Start with structured design prompts rather than fabricated executable strings:

1. **Read versus measure:** distinguish NES (read available information) from SIMA (measure through a physical pathway); specify observable, target and sensing pathway.
2. **Binding and reference:** test KWAM/KWAT as information/control operations, not matter creation or physical causation.
3. **State alteration:** inspect TRAK only after its exact signature and scope are established.
4. **Coupling:** inspect BRAN and H-series entries without guessing arity or claiming that coupling itself guarantees an effect.
5. **Release/termination:** inspect SHREN without assuming it cancels every binding, spell or physical state.

Even the first two remain non-executable until signatures, reference rules and relevant semantics are settled.

## 8. Explicit non-inferences

Do not infer that KREN creates matter solely from its gloss; TRAK changes anything whatsoever; BRAN guarantees a physical effect; SHREN cancels every active construction; a binding physically changes its referent; a desire/preference guarantees a feasible outcome; a valid parse proves a caster can execute it; or an invented example is historical because it uses existing tokens.

A recording carries sound information, not automatically the original caster's neural/mana state. An incantation's wording alone cannot prove successful execution.

## 9. Acceptance tests (specified, not run)

| ID | Condition | Required result |
|---|---|---|
| INC-01 | Known operator and valid typed arguments | Eligible for Gate L review |
| INC-02 | Unknown signature | Blocked; do not guess arity |
| INC-03 | Missing/extra argument | Reject according to approved signature |
| INC-04 | Multiple possible groupings | Ambiguous unless syntax resolves them |
| INC-05 | Colliding reference token | Require context/slot resolution or mark ambiguous |
| INC-06 | Binding applied to a value | No inferred physical state change |
| INC-07 | Coupling without mechanism | Gate C incomplete |
| INC-08 | Desired effect without mechanism | Gate C incomplete |
| INC-09 | Mechanism without resource model | Gate P insufficient parameters |
| INC-10 | Parse succeeds but caster parameters unknown | Gate L may pass; Gate P not assessed |
| INC-11 | Historical alias used | Preserve alias provenance/version |
| INC-12 | Formal operator used in vernacular without mapping | Blocked or rejected |
| INC-13 | Target cannot be resolved uniquely | Mark ambiguous/incomplete |
| INC-14 | Persistent effect has no termination semantics | Gate C incomplete |
| INC-15 | Success asserted from wording alone | Reject claim; require model/casting evidence |

## 10. Next sequence

1. Build a version-scoped operator contract registry: signature, input/output types, semantics, side effects, failure modes and evidence.
2. Start with NES/SIMA and KWAM/KWAT, where the information/control distinction is explicit.
3. Resolve the target-reference rules needed for these examples.
4. Create non-executable skeleton fixtures; only call something a parser test if the actual tooling supports and runs it.
5. Extend to TRAK, BRAN and SHREN after evidence or an explicit design decision establishes their contracts.
6. Keep the vernacular grammar decision separate.

## 11. Decision ledger

- **Ready for:** incantation research, semantic prompts and clearly labelled formal skeletons.
- **Not ready for:** general claims of executable, uniquely parseable or physically validated incantations.
- **New forms/canon rules:** none.
- **Tests executed:** none.
- **Next phase:** operator contract registry and initial information/control design fixtures.
