# Arcane Incantations v1.0 — Foundation and Spell Construction Grammar

**Status:** LOCKED DESIGN CANON for the new incantation layer; source-vocabulary status remains unchanged  
**Version:** Incantations 1.0  
**Scope:** Formal Arcane incantations, not Modern Vernacular conversation  
**Source basis:** The indexed Mega Pack2 v5 draft lexicon records the Formal / CANON forms `kren` (establish), `trak` (alter), `frem` (maintain), `shren` (release), `bran` (couple), and `vare` (prefer), cited to Magic v3.0 §26. It records role markers `po` (position role), `fo` (direction role), `lo` (movement role), and coupling categories `hə` (mana), `he` (matter), `ha` (energy), `hu` (living), `hi` (information), `ho` (field), cited to v2.0. The source archive identifies Phase 7 runtime material as a provisional reconstructed subset, not the complete canonical language.  
**Validation status:** Design-level specification and internal contrast fixtures. No parser execution, spell simulation, physical validation, or independent-speaker validation is claimed.

## 1. Purpose and separation from speech

An incantation is a structured Formal Arcane construction intended to describe an operation that may be evaluated against a spell model. It is not merely a sentence expressing a desire, command, metaphor, or emotional state.

Modern Vernacular forms such as `wish`, `fam`, and ordinary conversational clauses are not automatically incantation operators. A spoken sentence like “I want the door open” expresses an intention; it does not specify a valid operation that opens the door.

This specification establishes the first bounded incantation grammar. It does not claim that all historical or canonical spell syntax has been recovered. Existing source vocabulary keeps its recorded register and status; new construction rules in this file are modern design decisions for the incantation layer.

## 2. Spell construction has distinct semantic obligations

A well-formed spell construction must make the following questions answerable, either explicitly or through a separately established and visible binding:

1. **Operation:** What kind of change or state operation is requested?
2. **Target/reference:** What entity, region, state, or referent is acted upon?
3. **Mechanism/coupling:** Which interaction category is involved, where required?
4. **Spatial role:** If spatially relevant, what position, direction, or movement role is intended?
5. **Constraints:** Which conditions, limits, and invariants must hold?
6. **Resource and feasibility:** Are required resources and preconditions known and sufficient?
7. **Outcome:** What state change would count as success, and what failure states are possible?

Not every spell must contain all possible roles. Irrelevant roles should be omitted rather than guessed. Required roles must not be silently supplied by an interpreter unless an explicit binding rule permits it.

## 3. Operation vocabulary: source forms and bounded roles

The following forms are source-recorded Formal / CANON vocabulary. Their broad glosses do not, by themselves, settle every argument order or execution rule. This version licenses them as the **operation selector** in the new incantation frame, while defining only the bounded interpretation below.

| Form | Source gloss | Incantation-layer interpretation |
|---|---|---|
| `kren` | establish | Request establishment of a specified target state or structure |
| `trak` | alter | Request a change to a specified existing target state or structure |
| `frem` | maintain | Request maintenance of a specified existing state |
| `shren` | release | Request release of a specified attachment, constraint, or maintained state |
| `bran` | couple | Request establishment of a specified coupling between explicitly identified participants |
| `vare` | prefer | A preference/selection operator only; not a substitute for a hard requirement or a guarantee |

These are not interchangeable:
- `kren` does not mean “make anything happen”.
- `trak` presupposes an identifiable state or structure to alter.
- `frem` presupposes a state that can be maintained.
- `shren` presupposes something specifically releasable.
- `bran` presupposes at least two distinguishable participants and a specified coupling category.
- `vare` expresses preference, not physical force or guaranteed prioritisation.

The operation selector alone is incomplete: a spell must also specify the object of the operation and any required relation.

## 4. Coupling categories

The source lexicon records these Formal / CANON coupling-category forms:

| Form | Category |
|---|---|
| `hə` | mana |
| `he` | matter |
| `ha` | energy |
| `hu` | living |
| `hi` | information |
| `ho` | field |

For v1.0, a coupling declaration has the schematic form:

**`bran` + COUPLING-CATEGORY + PARTICIPANT-A + PARTICIPANT-B**

This order is a new incantation-layer design decision, not a recovered historical argument signature. Participant A and participant B must be independently resolvable and must not be inferred from proximity alone.

The category identifies the kind of coupling requested; it does not prove that the coupling is possible, safe, stable, or already established. For example, selecting the mana category does not imply that a source of mana exists or that enough resource is available.

A coupling declaration does not itself specify a later effect. If an operation depends on an established coupling, that dependency must be stated through an explicit binding or later versioned construction. The sequence “couple, then effect” is not assumed to be atomic or causally guaranteed.

## 5. Spatial roles

The source lexicon records `po` as a position role, `fo` as a direction role, and `lo` as a movement role. In this incantation layer these forms introduce typed spatial-role slots, not ordinary prepositions:

- `po` introduces a position value;
- `fo` introduces a direction value;
- `lo` introduces a movement value or movement specification.

These roles are distinct. A position is not a direction; a direction is not a trajectory; a movement specification is not proof that the target can move. v1.0 does not invent a universal coordinate system, axis convention, trajectory representation, or collision solver. Such data must come from a separately defined geometry/spatial specification.

The source archive contains direction/axis and geometry vocabulary, but their complete composition rules are outside this version. Bare role markers with no resolvable value are invalid.

## 6. Core incantation frame

The bounded v1.0 frame is:

**`ARCANE + OPERATION + TARGET + ROLE-CLAUSES + CONSTRAINT-CLAUSES`**

Here `ARCANE` is a metalinguistic label used in this specification, **not a newly coined spoken token**. In an actual spell text, the frame begins with the operation selector.

Schematic forms:

- **State establishment:** `kren TARGET STATE-SPECIFICATION`
- **State alteration:** `trak TARGET CURRENT-STATE NEW-STATE`
- **State maintenance:** `frem TARGET STATE-SPECIFICATION`
- **Release:** `shren TARGET RELEASE-SPECIFICATION`
- **Coupling:** `bran COUPLING-CATEGORY PARTICIPANT-A PARTICIPANT-B`

These are typed schemata, not a claim that every uppercase placeholder is a literal Arcane word. The detailed encoding of arbitrary targets, state values, material properties, energy quantities, living-system states, information structures and fields must be provided by their own typed specifications. If a target or state cannot be represented and resolved, the spell is incomplete.

This version does not define a spoken start word, mandatory closing word, chant rhythm, syllable count, rhyme, gesture, hand sign, or ceremonial requirement. Such features may be added only if a distinct performance protocol is specified; they are not silently part of the formal spell grammar.

## 7. Preconditions, constraints and outcomes

A spell construction must not confuse a requested state with a valid way of reaching it.

For a spell to be considered executable by a future conforming evaluator, its semantic record must distinguish:

- **requested effect** — the target condition;
- **preconditions** — what must already be true;
- **mechanism** — the operation and any required coupling;
- **resources** — what is consumed, supplied, or reserved;
- **constraints/invariants** — what must remain true;
- **failure conditions** — when execution must not proceed;
- **postcondition** — what is checked after an attempt.

This is a semantic checklist, not a claim that v1.0 already has dedicated spoken tokens for all these fields. Until those operators and their exact syntax are specified, a spell with safety-critical missing information is **underspecified**, not implicitly completed by the system.

A valid syntactic form is not sufficient for execution. Execution requires semantic validity, resolvable references, satisfied preconditions, sufficient resources, and a feasible mechanism. If these checks cannot be performed, the evaluator must report “unverified/underspecified” rather than inventing success.

## 8. Incantation validation states

Future tooling and documentation should distinguish at least these outcomes:

1. **MALFORMED** — the structure violates the grammar.
2. **UNRESOLVED** — a target, participant, role value, or binding cannot be resolved.
3. **UNDERSPECIFIED** — required semantic information is missing.
4. **PRECONDITION-FAILED** — a required condition is false.
5. **RESOURCE-INSUFFICIENT** — the declared resource budget is inadequate.
6. **INFEASIBLE** — the described mechanism conflicts with the applicable physical or formal model.
7. **VALIDATED** — the construction satisfies all checks supported by the evaluator.
8. **EXECUTED** — a trusted execution layer reports that the operation was carried out.
9. **POSTCONDITION-FAILED** — execution was attempted, but the expected final state was not verified.

“Validated” is not synonymous with “executed”; “executed” is not synonymous with “successful”; “requested” is not synonymous with “achieved”. No magic or physical execution is implemented by this document.

## 9. Worked schemata

The following examples deliberately use typed placeholders to avoid pretending that an unimplemented target language has already been settled.

### A. Establish a specified state

`kren TARGET STATE-SPECIFICATION`

Interpretation: request that a specified target enter a specified state. This is incomplete until both placeholders resolve and the state transition is supported.

### B. Alter a known state

`trak TARGET CURRENT-STATE NEW-STATE`

Interpretation: request a transition from an identified current state to a specified new state. If the current state is unknown, the construction is unresolved or underspecified.

### C. Maintain a state

`frem TARGET STATE-SPECIFICATION`

Interpretation: request maintenance of a defined state. Duration, resource supply, termination conditions and failure recovery are not inferred by v1.0.

### D. Release a specified relation

`shren TARGET RELEASE-SPECIFICATION`

Interpretation: request release of a defined attachment, constraint or maintained state. The construction cannot be used to release an unspecified “anything”, and it does not guarantee that release is harmless.

### E. Request a coupling

`bran hə PARTICIPANT-A PARTICIPANT-B`

Interpretation: request a mana-category coupling between two resolved participants. This example does not assert that mana exists, that the participants support the coupling, or that a later operation will succeed.

## 10. Acceptance and rejection fixtures

These are design fixtures; they have not been run through a parser or spell evaluator.

| ID | Construction or claim | Expected status |
|---|---|---|
| INC10-01 | `kren TARGET STATE`, both slots resolved and typed | STRUCTURALLY ACCEPTABLE schema |
| INC10-02 | `trak TARGET CURRENT NEW`, all slots resolved | STRUCTURALLY ACCEPTABLE schema |
| INC10-03 | `frem TARGET STATE`, maintenance requirements supplied separately | STRUCTURALLY ACCEPTABLE schema |
| INC10-04 | `shren TARGET RELEASE-SPECIFICATION`, release target resolved | STRUCTURALLY ACCEPTABLE schema |
| INC10-05 | `bran hə A B`, A and B distinct and resolved | STRUCTURALLY ACCEPTABLE coupling request |
| INC10-06 | `bran he A B` | STRUCTURALLY ACCEPTABLE matter-coupling request; feasibility remains unverified |
| INC10-07 | `kren` with no target or state specification | UNDERSPECIFIED |
| INC10-08 | `trak TARGET NEW-STATE` with no current-state rule | UNDERSPECIFIED |
| INC10-09 | `frem TARGET STATE` where target cannot maintain that state | INFEASIBLE or unresolved under the applicable model |
| INC10-10 | `shren TARGET` with no release specification | UNDERSPECIFIED |
| INC10-11 | `bran hə A` with only one participant | MALFORMED/UNDERSPECIFIED |
| INC10-12 | `bran hə A A` where self-coupling is not explicitly licensed | REJECT; participants must be distinct in v1.0 |
| INC10-13 | `bran` with no coupling category | UNDERSPECIFIED |
| INC10-14 | Position role `po` with no position value | UNRESOLVED |
| INC10-15 | Direction role `fo` used as a position value | TYPE ERROR |
| INC10-16 | Movement role `lo` with no movement specification | UNRESOLVED |
| INC10-17 | A desired effect is stated but no mechanism is specified | UNDERSPECIFIED; effect is not mechanism |
| INC10-18 | Spell requires more energy than is available | RESOURCE-INSUFFICIENT |
| INC10-19 | Spell violates a declared invariant | PRECONDITION-FAILED or INFEASIBLE, as determined by the model |
| INC10-20 | Spell is syntactically valid but no evaluator checked it | NOT VALIDATED |
| INC10-21 | Evaluator validates a construction but no executor ran it | VALIDATED, not EXECUTED |
| INC10-22 | Executor runs but postcondition is not met | POSTCONDITION-FAILED |
| INC10-23 | Incantation is spoken with dramatic rhythm but invalid operands | Still invalid; rhythm does not repair semantics |
| INC10-24 | Modern Vernacular `kong` (“want”) used as if it were an operation operator | REJECT; speech vocabulary is not an operation selector |
| INC10-25 | Coupling category is specified and assumed to guarantee an effect | REJECT; coupling and effect are distinct |

## 11. Explicitly unresolved

Version 1.0 does not define:
- a universal target/operand encoding;
- the complete argument order of all source-recorded operation verbs outside the bounded schemata above;
- general state and property constructors;
- a universal coordinate, trajectory, force, energy, mana, field, living-system or information model;
- the syntax or semantics of numeric resource budgets;
- resource consumption, depletion, replenishment, conservation or transfer;
- spell chaining, sequencing, atomicity, rollback, concurrency or interruption;
- spoken incantation phonology, stress, tempo, duration, gesture or ritual requirements;
- a canonical activation marker or closing marker;
- the relationship between ordinary performed forms and formal spell syntax;
- actual physical or supernatural execution.

**Change policy:** This specification establishes a bounded modern incantation layer. It does not rewrite source lexicon entries, historical strata, performed forms, or the reconstructed Phase 7 runtime. Every extension must add typed argument rules, explicit preconditions and postconditions, negative fixtures, and a clear statement of what is merely described versus what is executable.
