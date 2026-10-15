# Arcane Phase 8U — spatial source recovery and bounded formal contract decision

**Status:** Source-recovery report and owner-reviewable next-step gate  
**Date:** 2026-10-15  
**Canon effect:** none  
**New vocabulary:** none  
**Implementation changes:** none  
**Tests executed:** none

## 1. Purpose

Phases 8Q–8T built spatial relation contrasts, compared role/relation composition models, and authored typed abstract fixtures. The project should not continue expanding similar inventories indefinitely. This phase records what the repository evidence actually supports, sets a stopping rule for source recovery, and defines the smallest useful contract package to review next.

## 2. Evidence inspected

The following repository files were retrieved and inspected in this phase:
- `docs/canon/arcane-language-v3.0-L.md`
- `docs/canon/magic-system-v3.0.md`
- `sources/originals/Arcane_Lexicon_v5_draft.csv`
- `docs/research/phase7i-motion-spatial-register-audit.md`
- `docs/research/phase8q-spatial-relation-semantics-and-contrastive-bank.md`
- `docs/research/phase8r-spatial-relation-contract-alternatives.md`
- `docs/research/phase8s-spatial-role-and-relation-composition-matrix.md`
- `docs/research/phase8t-typed-spatial-reference-fixtures.md`

### Directly grounded facts

1. The canonical v3.0-L document lists PA/BA, TA/DA and KA/GA as the six signed axis directions, with +X = right, +Y = above and +Z = forward.
2. The canonical v3.0-L document lists JO (toward), JUR (away), JA (along), JE (parallel) and JI (aligned/coincident).
3. The same document identifies FE as Frame and lists PI (point), LEN (line), PLA (plane), SUR (surface), VOM (volume) and PAR (path).
4. The v5 draft lexicon records PO (position role), FO (direction role) and LO (movement role) as Formal, CANON, v2.0.
5. The inspected records do not provide complete argument signatures or surface examples for PO/FO/LO, nor full signatures for the five v3.0-L relations.

### Source-recovery boundary

Earlier repository retrieval attempts for the original Phase 4/5 DOCX audit files encountered a binary-to-UTF-8 decoding limitation. The current inspection did not overcome that limitation, and GitHub content searches for the relevant role terms did not return useful excerpts.

This is a retrieval limitation, not proof that the original documents contain no relevant evidence. Do not claim the documents have been fully searched or that their contents are absent. The correct next attempt is to obtain text extraction through a DOCX-aware route (for example, download the binary file and extract its document XML/text with a suitable document parser), if the connected tools expose that capability. If no such route is available, record the original source as not yet readable and continue only with labelled proposals.

## 3. Do not repeat the same research phase

The following outputs already exist:
- semantic contrasts for the five spatial relations;
- candidate interpretations for each relation;
- a role/relation composition matrix;
- fourteen abstract spatial fixtures and composition probes.

A further phase should not merely rename or reformat those lists. It should produce one of:
1. newly recovered primary-source evidence;
2. a bounded, explicitly provisional contract with owner-visible assumptions;
3. an actual runnable fixture specification, once a suitable parser/evaluator is available and the contract is approved.

This is the stopping rule for repeated inventory-only work.

## 4. Minimum formal contract package to review

When ready for review, the proposed contract should include these items and no hidden assumptions:

### 4.1 Relation semantics

- JO: minimum interpretation “toward”; specify whether only orientation or also motion-event relations are admitted.
- JUR: minimum interpretation “away”; do not infer source/origin unless explicitly approved.
- JA: specify eligible path/reference kinds and whether partial traversal is permitted.
- JE: specify eligible geometric kinds and exact parallelism criterion.
- JI: explicitly decide whether alignment and coincidence are one sense, two senses, or distinct operators.

### 4.2 Role semantics

- PO: define whether it labels a value, introduces a position argument, or acts as an operator.
- FO: define whether it labels a direction value or introduces a directional relation.
- LO: define whether it labels a motion event, trajectory, or movement argument.
- For all three, specify input/output types, argument order, optionality, and scope only if primary evidence or explicit owner approval supports those choices.

### 4.3 Frame policy

- Specify how FE is supplied and resolved.
- Define whether relation arguments may use local frames.
- Define frame mismatch behavior.
- Do not compare coordinate values across frames without a declared transformation or an explicit compatibility rule.

### 4.4 Error policy

A formal checker must distinguish:
- known invalid input;
- unresolved signature/type;
- missing frame;
- ambiguous intended sense;
- a valid relation that does not establish physical feasibility.

Unknown is not equivalent to valid or invalid. It must be represented as a distinct outcome.

## 5. Contract review fixture set

The next contract must include at least these acceptance cases:

| ID | Case | Required result |
|---|---|---|
| U-01 | JO toward point P | Must not entail arrival |
| U-02 | JUR away from P | Must not entail origin at P |
| U-03 | JA along path P, partial traversal | Must not require endpoint arrival |
| U-04 | JE on distinct parallel lines | Must not imply coincidence |
| U-05 | JI with alignment/coincidence ambiguity | Must flag or resolve explicitly, never silently |
| U-06 | FO plus JO | Composition accepted only if the contract defines it |
| U-07 | LO plus JA | Event/path composition accepted only if types are defined |
| U-08 | Missing frame | Unresolved or rejected according to the approved policy |
| U-09 | Values in unrelated frames | Do not compare raw components |
| U-10 | Spatial relation without a physical mechanism | No claim of causal or executable effect |

These are acceptance requirements, not tests already executed.

## 6. Recommended path

**Priority 1 — primary-source recovery.** Attempt a DOCX-aware extraction route for the original role definitions and examples. Do not spend another phase merely searching the same CSV glosses.

**Priority 2 — bounded contract proposal.** If source recovery remains blocked, prepare one owner-reviewable proposal with alternatives for the unresolved semantics and a clear list of decisions that would become normative if approved. Do not silently promote it.

**Priority 3 — operational validation.** Only after contract review, implement fixtures in the appropriate formal test harness. The website's provisional surface parser must not be represented as validating these formal relation signatures unless its supported syntax and type checker are actually extended and tests are run.

**Priority 4 — return to broader language development.** Once the spatial contract reaches a stable review point, move to the next high-value language subsystem rather than repeatedly polishing spatial documentation.

## 7. Decision record

- **Decision ID:** P8U-SPATIAL-RESEARCH-STOPPING-RULE-01
- **Canon changed:** no.
- **New vocabulary:** none.
- **Implementation changes:** none.
- **Tests executed:** none.
- **Verified repository facts:** canonical axis/relation/geometry labels and lexicon status for PO/FO/LO.
- **Not recovered:** full PO/FO/LO signatures, relation signatures, historical surface examples.
- **Next deliverable:** DOCX-aware primary-source extraction if available; otherwise a single bounded contract proposal rather than another inventory-only phase.
