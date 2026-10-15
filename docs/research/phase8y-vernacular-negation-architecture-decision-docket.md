# Arcane Phase 8Y — vernacular negation architecture decision docket

**Status:** Bounded design alternatives for review; not canon  
**Date:** 2026-10-15  
**Canon effect:** none  
**New vocabulary:** none  
**Historical negation rule recovered:** no  
**Implementation changes:** none  
**Tests executed:** none

## 1. Decision to be made

Phase 8X established that the proposed response particle `kor` (“no”) cannot safely serve as a clause-negation rule without evidence. It also showed that formal `GRASH` (NOT) cannot be imported into vernacular syntax just because the meanings are related.

This docket compares three structural alternatives for a future vernacular negation marker. The alternatives use the abstract placeholder **NEG**; it is not an Arcane word or a proposed morpheme. No candidate is selected as canon.

## 2. Requirements

A usable negation rule must specify:

1. the form and register of the negation marker;
2. its position relative to the verb and clause;
3. its scope over the proposition, predicate, modal, quantifier, or embedded clause;
4. its interaction with questions and response particles;
5. its interaction with aspectual particles such as proposed `don` and `kok`;
6. whether more than one negative marker yields emphasis, cancellation, or an ungrammatical clause;
7. how negation works in commands and requests;
8. how negative meanings are distinguished from inability, prohibition, uncertainty and absence.

A gloss “not” is insufficient to decide these rules.

## 3. Candidate architectures

### NEG-A — preverbal marker

Abstract pattern: `SUBJECT + NEG + VERB + COMPLEMENTS`

**Strengths**
- Negation is close to the predicate and easy to locate in a simple clause.
- May keep a stable position as complements vary.

**Risks**
- Scope over auxiliaries/modals and embedded verbs must be defined.
- If aspect particles also occur near the verb, ordering and ambiguity rules are required.
- No source evidence presently supports this placement.

### NEG-B — postverbal marker

Abstract pattern: `SUBJECT + VERB + NEG + COMPLEMENTS` or a specified postverbal slot.

**Strengths**
- Could fit a design where the verb head is followed by operators or particles.
- May be easy to test against the provisional SVO baseline.

**Risks**
- If complements follow the verb, a postverbal marker can be confused with negating only the next constituent unless scope is specified.
- Multiple complement types can create ambiguity.
- No source evidence presently supports this placement.

### NEG-C — clause-final marker

Abstract pattern: `SUBJECT + VERB + COMPLEMENTS + NEG`

**Strengths**
- The marker has a stable clause-edge position in simple clauses.
- It could be easy to distinguish from standalone response `kor`.

**Risks**
- Embedded clauses require a clear rule for which clause the marker negates.
- Clause-final question particle `pun` is itself only a pilot convention, so the order of NEG and PUN would need a decision.
- No source evidence presently supports this placement.

### No selection yet

All three are plausible design options. None is inferred from the source lexicon, which supplies only proposed lexical items and glosses. Do not turn these placeholders into Arcane surface strings until a form is recovered or explicitly designed and approved.

## 4. Comparison matrix

| Criterion | NEG-A preverbal | NEG-B postverbal | NEG-C clause-final |
|---|---|---|---|
| Simple declarative readability | High potential | Medium; slot needs clarity | High potential |
| Scope over modal/ability | Requires rule | Requires rule | Requires rule |
| Scope in embedded clause | Requires boundaries | Requires boundaries | Highest edge-attachment risk |
| Interaction with SVO complements | Marker stays before verb | Position relative to complements must be fixed | Marker follows complements |
| Interaction with proposed aspect particles | Order unresolved | Order unresolved | Relative scope/order unresolved |
| Compatible with current pilot evidence | Not established | Not established | Not established |
| Canon status | None | None | None |

This comparison is qualitative and does not establish that one option is linguistically superior.

## 5. Semantic acceptance fixtures

These fixtures should be run against whichever architecture is approved. The expected outcome is a distinct interpretation or a clear rejection/ambiguity diagnostic, not necessarily a particular surface form.

| ID | Contrast | Required property |
|---|---|---|
| NY-01 | P is true / P is not true | Basic polarity contrast |
| NY-02 | The person cannot see / the person does not see | Ability vs negation |
| NY-03 | The person may not go (prohibited) / perhaps the person will not go | Deontic vs epistemic ambiguity must be controlled |
| NY-04 | The person does not want water / the person wants no water | Predicate negation vs object/quantifier interpretation |
| NY-05 | The person does not say [friend comes] / the person says [friend does not come] | Matrix vs embedded scope |
| NY-06 | Not the person sees the friend, but another person does | Focused constituent negation vs clause negation |
| NY-07 | The person does not always see the friend / the person always fails to see the friend | Frequency scope vs event negation |
| NY-08 | Does the person not see the friend? / Does the person see the friend? | Negated question vs positive question |
| NY-09 | `kor` as standalone answer / NEG inside a clause | Response polarity vs clause syntax |
| NY-10 | NEG plus proposed `don` (already/done) | Aspect/polarity scope |
| NY-11 | NEG plus proposed `kok` (ongoing) | Aspect/polarity scope |
| NY-12 | Two NEG markers | Double-negation policy |
| NY-13 | Negative command / prohibition / request not to act | Imperative and deontic scope |
| NY-14 | No person sees the friend | Quantifier scope |
| NY-15 | No evidence that P / evidence that not-P | Information absence vs negative proposition |
| NY-16 | A negated proposition is predicted / observed | Polarity does not change epistemic source |

## 6. Answering negative questions

This is a separate decision, not a minor detail. Consider the question “Does the person not see the friend?”

Possible answer systems include:
- answer particle affirms/rejects the proposition as worded;
- answer particle indicates whether the positive counterpart is true;
- answer particles are supplemented by a short clause to avoid ambiguity.

The proposed glosses `wang` (“yes”) and `kor` (“no”) do not identify which system Arcane uses. Until a rule is selected, learner materials should avoid treating a bare answer to a negative question as unambiguous. Use an explicit paraphrase in the teaching gloss where necessary.

## 7. Formal register boundary

Formal `GRASH` is the preferred spelling recorded in the alias registry, with `GRAK` preserved as a historical/compatibility form. Its formal operator status does not define a vernacular negative marker's position, morphology or scope.

Likewise:
- the formal `GRASH` contract must not be altered to fit a vernacular proposal;
- `kor` remains a proposed response word unless separate evidence establishes more;
- a future vernacular NEG form may be related to formal NOT, but derivation or historical relationship must be explicitly documented rather than assumed.

## 8. Recommended decision process

1. Search available source material for an actual vernacular negative clause or explicit negation rule.
2. If no reliable example is recovered, select one of NEG-A/B/C as an explicit new design decision, not a historical reconstruction.
3. Assign an approved form only after checking phonological/lexical collisions and source/version strata.
4. Define scope and interactions before publishing learner examples.
5. Run the sixteen fixtures above and add counterexamples for every ambiguity found.
6. Keep the response particle `kor` distinct from clause negation unless owner approval deliberately combines them and tests show the resulting ambiguity is acceptable.

## 9. Decision record

| Decision ID | Item | Current result |
|---|---|---|
| P8Y-NEG-01 | Negation position | Unresolved; compare NEG-A/B/C |
| P8Y-NEG-02 | Negation form | Unresolved; no new form coined |
| P8Y-NEG-03 | Scope model | Unresolved; acceptance fixtures defined |
| P8Y-NEG-04 | Negative-question answers | Unresolved |
| P8Y-NEG-05 | Formal/vernacular mapping | Keep separate pending evidence/approval |

**Outcome:** a bounded choice set and sixteen acceptance fixtures are ready for evidence recovery or owner review. No grammar has been silently selected.

- **Canon changes:** none.
- **New vocabulary:** none.
- **Implementation changes:** none.
- **Tests executed:** none.
