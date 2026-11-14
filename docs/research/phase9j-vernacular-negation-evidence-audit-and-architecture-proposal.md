# Arcane Phase 9J — Vernacular negation evidence audit and architecture proposal

> **SUPERSESSION NOTICE — Modern Vernacular v1.0 (2026-10-15):** This document is retained as a research/history record. For the bounded Modern Vernacular core, the binding rules are now in [Arcane Modern Vernacular v1.0 — Locked Core Grammar](../canon/arcane-modern-vernacular-v1.0-locked-core.md). Where this document labels SVO, information-question placement, polar-question placement, or clause negation as provisional/open, the v1.0 specification supersedes that status for its defined scope. Historical claims, other verbs, other registers, and explicitly blocked constructions remain outside that lock. Do not copy older candidate rules over the locked specification.



**Status:** Provisional design proposal; not canon  
**Date:** 2026-10-15  
**Canon changes:** none  
**New Arcane forms:** none  
**Historical Vernacular negation rule recovered:** none in the records inspected  
**Tests executed:** none; this is a documentary design comparison

## 1. Purpose

Phase 9I defined the semantic distinctions a future negation system must preserve. This phase checks accessible project records for a Vernacular clause-negation rule and compares the three alternatives already recorded in Phase 8Y:

- **NEG-A:** marker before the predicate;
- **NEG-B:** marker after the predicate;
- **NEG-C:** marker at the end of the clause.

These labels are analysis placeholders, not Arcane words. This phase does not create a negative lexeme or establish a canonical sentence pattern.

## 2. Evidence audit

Records inspected:
- `docs/canon/arcane-language-v3.0-L.md`
- `docs/research/phase8y-vernacular-negation-architecture-decision-docket.md`
- `docs/research/phase9a-consolidated-vernacular-mini-grammar-candidate.md`
- `docs/research/phase9f-minimal-vernacular-surface-grammar-pilot.md`
- `docs/research/phase9i-vernacular-negation-semantics-and-scope-contract.md`
- `sources/originals/Arcane_Alias_Registry_Phase_5_5.csv`

| Evidence | Establishes | Does not establish |
|---|---|---|
| Canonical v3.0-L lists `GRAK` as Formal NOT | A Formal operator entry exists | Vernacular form, position, scope or inflection |
| Alias registry prefers `GRASH` over `GRAK` | Existing spelling/alias relationship | A Vernacular derivation or new colloquial use |
| Phase 8Y compares NEG-A/B/C | Three alternatives were left open | A selected or tested rule |
| Phases 9A and 9F mark `kor` as a standalone response candidate | `kor` is not licensed as clause negation in the pilot | A negative clause or negative-question answer rule |
| Phase 9I specifies semantic contrasts | Required distinctions are documented | A surface form that passes them |

**Finding:** no explicit Vernacular clause-negation form or position was recovered from the inspected records. This is a bounded finding about the records listed above, not proof that no original source anywhere contains such a rule.

## 3. Comparison method

Scores are qualitative design judgements from 1 (weak) to 5 (strong), not measured linguistic results. Criteria: scope readability, attachment ambiguity, compatibility with the provisional SVO pilot, clarity beside the proposed clause-final question particle `pun`, and extensibility to later scope rules.

| Criterion | NEG-A: preverbal | NEG-B: postverbal | NEG-C: clause-final |
|---|---:|---:|---:|
| Scope readability | 4 | 3 | 4 |
| Low attachment ambiguity | 3 | 2 | 3 |
| SVO pilot compatibility | 4 | 3 | 4 |
| Clarity beside `pun` | 4 | 4 | 2 |
| Extensibility | 4 | 3 | 3 |
| **Total / 25** | **19** | **15** | **16** |

The totals are a decision aid, not empirical proof. Preverbal placement does not automatically guarantee clause-wide scope; a separate scope rule is required.

## 4. Recommendation: prototype NEG-A first

**Recommend NEG-A, preverbal placement, for the next controlled experiment only.** Do not select or coin a surface form yet.

Reasons:
- It can be tested without changing the current provisional participant–verb–participant order.
- The learner encounters the polarity operation before the predicate.
- It avoids adding another clause-final element beside the provisional `pun` question particle.
- It provides one clear hypothesis for comparison with the semantic fixture bank.

Limitations:
- No marker form is sourced or approved.
- Placement alone cannot determine scope over modals, embedded clauses, focus or quantifiers.
- The `wish` verb frame and SVO order remain provisional.
- No learner, speaker or parser trial has been performed.
- Recovered historical evidence could later support another architecture.

The following is schematic metalanguage, **not an Arcane utterance**:

```text
PARTICIPANT-A + NEG + PREDICATE + PARTICIPANT-B
```

Do not replace NEG with `GRASH`, `GRAK`, `kor`, or an invented form. The marker and its scope remain unresolved.

## 5. Prototype acceptance gates

All gates below are unrun. Each must preserve the distinction or explicitly block the construction until a rule exists.

| ID | Contrast | Required outcome |
|---|---|---|
| NG-01 | P / NOT(P) | Clear positive/negative proposition contrast |
| NG-02 | NOT(P) / NOT(ABLE(P)) | Event negation differs from inability |
| NG-03 | NOT(ABLE(P)) / NOT(PERMITTED(P)) | Ability differs from permission |
| NG-04 | NOT(KNOW(P)) / KNOW(NOT(P)) | Ignorance differs from negative knowledge |
| NG-05 | NOT(SAY(P)) / SAY(NOT(P)) | Matrix and embedded scope are distinct or blocked |
| NG-06 | NOT(ALWAYS(P)) / ALWAYS(NOT(P)) | “Not always” does not default to “never” |
| NG-07 | NOT(EXISTS(x:P(x))) / EXISTS(x:NOT(P(x))) | Quantifier scope remains distinct |
| NG-08 | Positive / negative question | Formation and answer interpretation are specified or blocked |
| NG-09 | Clause NEG / standalone `kor` | Clause syntax and response polarity remain distinct |
| NG-10 | NEG / `pun` | Co-occurrence and order are tested, not guessed |
| NG-11 | Whole-clause / focus negation | Focus readings are licensed separately or blocked |
| NG-12 | Negative request / prohibition | Request force is not inferred from a declarative alone |

## 6. Compatibility controls

- Preserve the Formal `GRASH` / `GRAK` relationship; neither is repurposed as Vernacular without approval.
- Keep `kor` as a proposed standalone response, not a clause marker by analogy.
- Keep `pun` as a provisional yes/no question particle; its interaction with negation is untested.
- Do not assume `wang` and `kor` give unambiguous answers to negative questions.
- If a source later provides an older form or position, record it by source and period; do not globally rewrite other strata.
- Keep Formal operator syntax separate from the proposed ordinary-conversation grammar.

## 7. Minimal future experiment

1. Create matched contexts where P is true and false.
2. Ask independent reviewers to interpret positive and negative candidate patterns without first revealing the intended reading.
3. Include ability, permission, uncertainty, embedded scope and frequency as separate contrasts.
4. Keep negative questions blocked until their formation and answer convention are specified.
5. Record intended reading, interpretation, ambiguity, rejection and confidence separately.
6. Treat disagreement as evidence to diagnose, not as permission to silently change the rule.
7. Do not claim acceptance until the actual trial and results are recorded.

No trial has been run in this phase.

## 8. Unresolved and next steps

Still unresolved: the marker form; any historical relationship to `GRASH`/`GRAK`; default scope; clause boundaries; double negation; negative questions; interaction with modality, aspect, focus, quantification, embedding and commands; and whether speakers or the language owner prefer the proposed architecture.

Phase 9K should define a bounded polarity prototype with explicit bracketing, a minimal positive/negative pair and a strict no-fabrication rule for blocked meanings. If a designed modern Vernacular marker is wanted rather than historical recovery, its form should be proposed separately after phonological, lexical-collision and register checks.

## 9. Decision record

- **Finding ID:** P9J-NEGATION-EVIDENCE-ARCHITECTURE-01
- **Source audit:** no explicit Vernacular clause-negation rule found in inspected records
- **Recommended experimental architecture:** NEG-A, preverbal; test-only, not canon
- **Actual marker:** unresolved; none coined
- **New vocabulary:** none
- **Canon changes:** none
- **Tests executed:** none
