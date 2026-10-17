# Canon implementation evidence matrix

**Status:** Working audit; reviewed against the recovered canon and current repository implementation on 2026-10-13.  
**Purpose:** Separate source authority from the amount of behaviour currently implemented. This matrix is not an automated test report and does not claim that canonical magic constraints are mechanically enforced.

## Status meanings

- **Implemented · limited scope** — a narrow piece of behaviour exists in code; the surrounding canon rule is not thereby fully implemented.
- **Blocked by specification** — implementation would require decisions or source recovery that the current specification does not supply.
- **Not implemented** — the requirement is clear enough to identify, but the corresponding evaluator or enforcement layer does not yet exist.
- **Design-level only** — the rule or test concept is documented, but there is no executable validator or recorded worked execution.

## Evidence matrix

| ID | Requirement | Status | Current evidence | Next requirement |
|---|---|---|---|---|
| CANON-001 | Separate information, mana, energy, force, coupling and effect | Design-level only | The distinction is documented in canon and the rule catalogue. The parser and dimensional module do not model these as typed runtime concepts. | Define separate semantic types and prohibited implicit conversions before implementing a semantic checker. |
| CANON-002 | Conservation and resource accounting | Design-level only | Incantations v1.9 defines typed resource definitions, accounts, source/transfer/transformation records, budgets, reservations, conservation boundaries, transaction modes, concurrency and reconciliation; it includes 60 specification fixtures but no executable resource evaluator. | Implement a narrow ledger validator only after choosing a concrete resource domain and approved units/source contracts; run positive and negative fixtures. Dimensional arithmetic is not conservation enforcement. |
| CANON-003 | Mechanism required for physical state changes | Design-level only | The rule is described in the magic specification and recovery register. There is no executable spell representation or mechanism-completeness validator. | Define the minimum structured mechanism fields and what counts as a missing or incomplete causal pathway. |
| CANON-004 | Binding creation, reference and live evaluation | Blocked by specification | KWAM, KWAT and KWAK are distinguished conceptually. Identifier syntax, binding scope, mutability, lifetime and evaluation timing remain incomplete. | Recover or approve scope, lifetime, update and evaluation-timing rules before runtime binding behaviour is implemented. |
| CANON-005 | Reject incompatible dimensional operands | Implemented · limited scope | Standalone dimensional primitives reject incompatible addition/subtraction and derive dimension vectors for multiplication/division. They are not connected to parsed expressions; unit conversion and complete derived-unit semantics remain open. | Connect a typed AST to the dimensional layer only after operator input/output signatures and unit conversion rules are specified. |
| CANON-006 | Master spell-feasibility condition | Not implemented | Mana, coupling, energy, information, control, temporal/causal, stability and material terms are documented, but no evaluator computes or validates their conjunction. | Specify inputs, measurable criteria, uncertainty handling and failure diagnostics for each term; do not default unspecified terms to true. |
| CANON-007 | Provisional mathematical operator signatures | Implemented · limited scope | The Phase 2 audit parser checks provisional arity for registered operators. It does not calculate operator values, type-check operands or validate physical meaning. | Approve complete signatures and value/type rules from source evidence before adding semantic evaluation. |
| CANON-008 | Reconcile KREN, TRAK, FREM, SHREN, BRAN and VARE | Blocked by specification | These terms appear in the magic-system operator inventory but are absent from the supplied v3.0-L core inventory. This is a cross-specification gap, not proof that the terms are invalid. | Recover source passages and decide whether each belongs to the language inventory, a spell-design layer, an alias set or a different version. |
| CANON-009 | Map surface grammar to spell representation | Blocked by specification | HEAD + ARGUMENTS + MODIFIERS and HEAD + CORE + PARAMETERS + CONSTRAINTS + CONTROL are recorded as distinct layers. Their mapping is not defined. | Specify a traceable mapping without replacing either representation. |
| CANON-010 | Unique parse versus spoken Arcane | Implemented · limited scope | The parser rejects malformed or unknown audit notation and returns a structural tree for supported expressions. It does not parse spoken Arcane or prove spoken-boundary recoverability. | Recover formal surface grammar and test grouping, attachment, modifier scope, phonological boundaries and adversarial near-collisions. |
| CANON-011 | Logos resource and substrate accounting | Blocked by specification | Logos is described as a persistent computational agent, but substrate, memory, energy, bandwidth and interface costs are underspecified. | Recover or explicitly decide the missing physical resource model before asserting feasible persistent computation. |
| CANON-012 | Numerical spell feasibility | Design-level only | The recovery register defines a design-level numeric feasibility test but supplies no executed worked case with assumptions and recorded outputs. | Choose a bounded example, state assumptions and resource sources, evaluate each feasibility term separately, and record evidence before claiming validation. |

## Guardrails

1. A canonical rule can be authoritative while its implementation status remains **not implemented**.
2. A parser pass establishes syntax only; it does not establish type correctness, causality, conservation, feasibility or canonical spoken form.
3. A dimensional test does not prove that a spell conserves energy or matter.
4. A blocked item remains blocked until its missing rules are recovered or explicitly decided through change control.
5. Do not turn unspecified feasibility terms into automatic passes to make an example work.
6. This matrix is a tracked implementation audit, not part of the language's spoken vocabulary or magic ontology.

## Immediate implementation order

1. Recover missing specification decisions: binding timing/scope, operator inventory reconciliation, and the mapping between surface syntax and spell representation.
2. Define typed AST nodes and operator signatures before connecting dimensional algebra.
3. Design resource-ledger and mechanism-completeness records from the canonical conservation and causality requirements.
4. Add executable feasibility checks only when each check has explicit inputs, outcomes, negative cases and source traceability.
5. Publish execution evidence separately from this readiness matrix.


## Resource-accounting design update — 2026-10-17

The bounded modern incantation design is now documented in [Arcane Incantations v1.9](../canon/arcane-incantations-v1.9-resource-accounting-and-conservation-contracts.md). It closes a specification gap, not the implementation gap. The 60 RES19 fixtures are normative expected outcomes in the design document; they have not been run through a resource evaluator. No universal mana/energy conversion, resource inventory, Logos substrate model, or real spell runtime is claimed. The next implementation step must choose a bounded resource domain and approved source/unit contracts rather than build a generic engine on invented physics.


## Authority-decision design update — 2026-10-17

[Arcane Incantations v2.0](../canon/arcane-incantations-v2.0-authority-and-authorization-decision-contracts.md) closes a design gap by specifying 60 expected authority-decision outcomes. It remains design-level only: there is no authority service, universal issuer hierarchy, legal policy engine, identity infrastructure, or executable gate demonstrated by the document. The next implementation step is fixture browsing and source traceability, not automatic permission decisions. Any later executable validator must start with a named, bounded authority domain and trusted test fixtures.
