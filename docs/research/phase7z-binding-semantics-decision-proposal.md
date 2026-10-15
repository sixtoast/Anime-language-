# Arcane Phase 7Z — binding semantics decision proposal

**Status:** Design proposal for review; not canon  
**Date:** 2026-10-15  
**Decision ID:** P7Z-BINDING-01  
**Canon effect:** none  
**New forms:** 0  
**Executable tests run:** 0

## 1. Why this phase exists

Phase 7Y established that the binding family cannot yet support reliable general incantations because identifier syntax, evaluation timing, scope, lifetime and unresolved-reference behaviour remain open. This phase does not repeat the inventory. It proposes a deliberately small, conservative contract for review and identifies the choices that require explicit approval before any candidate is promoted.

Sources:
- `docs/canon/arcane-language-v3.0-L.md`, §10 Bindings;
- `docs/audits/phase-2-formal-syntax.md`, provisional KWAM/KWAT/KWAK signatures;
- `docs/research/phase7y-information-and-binding-contract-dossier.md`;
- `docs/research/phase7x-incantation-operator-contract-registry.md`.

The canon provides the conceptual examples `KWAM 1 E`, `KWAT 1`, and `KWAK 1` but explicitly leaves identifier representation and evaluation semantics open. Therefore, none of the choices below is a canonical rule.

## 2. Design requirements

Any binding contract adopted later should satisfy these requirements:

1. **Explicit identity:** every reference resolves to one binding or returns a defined failure.
2. **No silent fabrication:** an unknown identifier cannot silently become zero, null, a default target or a guessed value.
3. **No hidden physical causation:** binding/reference operations alter symbolic state only unless a separate, specified mechanism says otherwise.
4. **Distinguishable evaluation:** retrieving a stored value and evaluating a live expression must not be conflated.
5. **Stable scope:** the resolution environment must be stated rather than guessed.
6. **Observable failure:** invalid references and type errors must block evaluation instead of producing an unlabelled plausible result.
7. **Version isolation:** legacy spellings and version-specific contracts remain traceable.
8. **Unambiguous grouping:** the expression bound by KWAM must have exactly one recoverable boundary.
9. **No unsupported surface syntax:** test notation may be abstract; it must not be presented as spoken or executable Arcane.
10. **Side-effect discipline:** declaring or referencing a binding is not a measurement, coupling, release or physical alteration.

## 3. Decision A — identifier model

### Option A: numeric identifiers only
Advantages: matches the source example `1`; simple initial registry.
Risks: no evidence says numeric identifiers are the only legal form; collisions across nested constructions remain unresolved.

### Option B: named identifiers only
Advantages: readable in documentation.
Risks: unsupported by the source example as a normative rule; introduces unrecorded surface morphology.

### Option C: abstract identifier token in audit notation (recommended for research fixtures)
Use opaque placeholders such as `ID_1` in the *test metadata* and keep the canonical illustrative form `1` as a separately sourced example. This avoids asserting a language-level identifier grammar. It is a fixture convention only, not a new Arcane token.

**Proposal:** adopt Option C for test documentation now. Leave the language-level identifier alphabet and grammar unresolved.

## 4. Decision B — binding evaluation

Three plausible models are materially different:

| Model | Meaning | Main risk |
|---|---|---|
| Capture value at declaration | Evaluate expression once; store result | Cannot represent live dependency without another mechanism |
| Store expression, evaluate on reference | Reference re-evaluates expression | Hidden repeated evaluation or side effects unless tightly constrained |
| Explicitly distinguish value and live expression | Evaluation policy is declared by a separate, specified construct | Needs a canonical mode marker or operator contract not currently established |

**Proposal:** do not select a language-level model yet. For design tests, label the policy as `UNSPECIFIED`, `CAPTURED-VALUE` or `LIVE-EXPRESSION` in metadata only. The latter two are experimental semantic scenarios, not claims that Arcane currently supports two modes.

A future decision should answer:
- When is the expression evaluated?
- Can evaluation read changing state?
- Can it produce side effects?
- Does KWAT return a captured result or an expression handle?
- Is KWAK/KWASH the sole live-evaluation mechanism, and under which version?
- What happens if the expression fails at declaration versus later evaluation?

## 5. Decision C — scope and lifetime

Candidate policies:

- **Local lexical scope:** binding visible only within a named enclosing construction.
- **Explicit environment:** binding visible in an environment passed or named by the construction.
- **Global/persistent registry:** binding survives beyond a single construction.

No inspected source establishes one of these policies. Global/persistent behaviour is the riskiest default because it can create stale state and identifier collisions across independent casts or sessions.

**Proposal:** for research fixtures, assume no scope or lifetime at all until supplied as metadata. Do not claim global, local, session, or persistent visibility. If a future test needs a bounded environment, identify it explicitly in fixture metadata without presenting that metadata as Arcane syntax.

Required eventual rules: creation boundary, visibility boundary, lifetime end, duplicate identifier policy, shadowing/rebinding, and whether separate casting events share environments.

## 6. Decision D — unresolved reference and failure

**Proposal for safety of interpretation:** KWAT applied to an unresolved identifier must fail explicitly; it must not silently return zero, null, an empty expression, a nearby identifier or a guessed target. This is a recommended error policy for a future contract, not a recovered canonical runtime rule.

Failure should be distinguishable from a valid binding whose value is itself empty, false or zero. The exact error representation remains unresolved. No error word or new operator is proposed here.

## 7. Proposed abstract contracts (not canon)

The following are review-level semantic contracts only:

- `KWAM(identifier, expression)`: requests creation of a symbolic binding. Whether the expression is evaluated immediately is unspecified.
- `KWAT(identifier)`: requests resolution of an existing binding in an explicitly defined environment. Unknown or ambiguous resolution must not be guessed.
- `KWAK(reference-or-expression)`: canonical gloss is live evaluation in v3.0-L; exact input type, timing and failure semantics remain unresolved. The v5 draft's KWASH renamed-form relationship must remain versioned rather than silently substituted.

Parentheses and commas in this section are explanatory metanotation, not established Arcane surface syntax. The formal audit's angle-bracket notation is also provisional.

## 8. Review fixture matrix

These fixtures should initially be records in the research ledger, not input strings submitted to a parser unless its supported grammar is independently confirmed.

| ID | Scenario | Expected design outcome | Current gate |
|---|---|---|---|
| BND-01 | Declare a binding with an identified expression | Declaration intent recognised; evaluation policy still required | Blocked by spec |
| BND-02 | Reference a known binding in the same explicitly declared test environment | Resolve only if binding and environment are defined | Blocked by spec |
| BND-03 | Reference an unknown identifier | Explicit unresolved/error state; never guess | Contract proposal |
| BND-04 | Reference an identifier that is ambiguous in two candidate environments | Report ambiguity or apply a future explicit scope rule | Blocked by spec |
| BND-05 | Bind an expression whose result changes over time | Outcome depends on declared evaluation policy; absent policy, do not evaluate | Blocked by spec |
| BND-06 | Bind an expression that fails immediately | Failure occurs at declaration only if the selected policy evaluates then | Policy-dependent |
| BND-07 | Bind an expression that fails only later | Failure point depends on the selected evaluation policy | Policy-dependent |
| BND-08 | Reference a value of the wrong expected type | Type error unless a defined conversion exists | Type system incomplete |
| BND-09 | Declare the same identifier twice in one environment | Reject or apply an explicitly approved rebinding rule; do not guess | Unresolved |
| BND-10 | Use KWAT where live reevaluation is intended | Do not silently substitute KWAK/KWASH | Contract proposal |
| BND-11 | Treat a binding as a physical object or causal action | Reject that interpretation absent a separate mechanism | Canonical distinction |
| BND-12 | Mix v3.0-L and v5 renamed spellings without declared version | Flag version ambiguity; preserve both source records | Version gate |

## 9. Fixture metadata template

```yaml
fixture_id: BND-03
status: semantic-prompt
source_version: Arcane-v3.0-L-reference
register: Formal-Arcana-research
operation: KWAT
identifier_fixture: ID_1
environment: unspecified
binding_exists: false
evaluation_policy: unspecified
surface_form: null
parse_tree: unresolved
expected_outcome: explicit-unresolved-reference
gate_l: BLOCKED_BY_SPEC
gate_c: INCOMPLETE
gate_p: NOT_ASSESSED
note: Metadata convention only; not executable Arcane syntax.
```

The metadata fields are proposed for the research ledger. This does not claim the website accepts YAML, that a schema already exists, or that any parser test has run.

## 10. Promotion gate for a usable binding subsystem

Do not mark the subsystem ready for a general incantation until all of the following have evidence:

- identifier grammar and uniqueness policy specified;
- binding expression boundaries recoverable without guesswork;
- evaluation timing specified, including KWAK/KWASH version relationship;
- scope and lifetime specified;
- unknown and ambiguous references have explicit outcomes;
- duplicate declarations and rebinding have defined outcomes;
- value types and type errors are defined;
- side-effect rules prevent accidental repeated or physical action;
- positive and negative fixtures are implemented in a supported test format;
- tests are actually executed and results recorded.

## 11. Decision ledger

- **Decision ID:** P7Z-BINDING-01
- **Recommendation:** use abstract identifier placeholders in fixture metadata only; do not choose canonical evaluation or scope semantics yet; recommend explicit failure for unknown references as a future contract requirement.
- **Canon changes:** none
- **New forms:** none
- **Executable tests run:** none
- **Next step:** inspect whether the repository already has a machine-readable registry schema for semantic fixtures. If it does, map these test IDs into that schema; if it does not, document the minimum fields without claiming parser support. Then return to language design with a narrowly scoped proposal for the binding semantics that still need approval.
