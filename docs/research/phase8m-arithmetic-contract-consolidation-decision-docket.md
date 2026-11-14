# Arcane Phase 8M — arithmetic contract consolidation and decision docket

**Status:** Consolidated proposal and explicit approval questions  
**Date:** 2026-10-15  
**Canon effect:** none pending approval  
**New vocabulary:** none  
**Tests executed:** none

## 1. Why consolidate now

Phases 8K–8L cover addition, subtraction, multiplication, division and negation through individual contracts and example fixtures. This phase consolidates their shared type model so the project can decide the policy once, rather than letting each operator accumulate inconsistent exceptions.

This is a decision docket, not a declaration that proposed rules are already canon. It separates a safe minimum for a research evaluator from choices that need an explicit canonical decision.

## 2. Shared value model

**Proposal:** every typed scalar quantity used in a physical calculation has:

- a numeric magnitude;
- a unit identifier or an explicit dimensionless declaration;
- a physical dimension;
- a semantic quantity kind, where known;
- a numeric domain/representation;
- source/version provenance;
- a status indicating whether the record is canonical, proposed, or unresolved.

The physical dimension is not a substitute for semantic quantity kind. Units and dimensions must also remain distinct: different unit scales can represent the same dimension, but conversion must be explicit and traceable.

This is internal research metadata, not an Arcane surface grammar.

## 3. Shared dimensional algebra proposal

Use standard dimensional-analysis exponents as an abstract calculation method. If a quantity has dimension (L^a T^b M^c), record the exponents rather than relying on its unit spelling alone.

| Operator | Candidate dimensional rule | Minimum validation |
|---|---|---|
| FRAPA — addition | Result dimension equals both operand dimensions | Require equal dimensions and compatible units/conversion |
| FRATA / FRAJA — subtraction | Result dimension equals both operand dimensions | Same compatibility requirement; result semantic kind needs a rule |
| FRAKA / FRAMA — multiplication | Add operand dimension exponents | Check numeric domain and whether the semantic result kind is allowed |
| FRALA — division | Subtract denominator exponents from numerator exponents | Reject zero denominator; check numeric domain and semantic result kind |
| FRASHA — negation | Preserve the operand dimension and unit | Require an approved numeric operand; preserve semantic kind |

These are candidate rules for ordinary quantity arithmetic, not approved canonical operator signatures. The choice between source-stratified forms remains version-dependent: v3.0-L lists FRATA/FRAKA, while the v5 draft lexicon records FRAJA/FRAMA as renamed forms.

## 4. Result-kind inference is a separate decision

Dimensional algebra alone is insufficient to determine the semantic kind of a result.

Examples:
- Length divided by time has dimension velocity, but an approved velocity quantity may require a defined reference frame and interpretation.
- Length multiplied by length has dimension area, but the canonical vocabulary and result-kind rule for area must be checked before treating the result as a canonical area value.
- Position minus position may yield a displacement in a conventional physical model, but Arcane must explicitly approve that result relation.
- Force multiplied by displacement has dimensions of energy, but a physical interpretation may also depend on the force's relation to the displacement and the applicable physical model.

**Proposal:** a future semantic checker should distinguish `dimensionally-valid` from `quantity-kind-approved`. Never infer the latter solely from the former.

## 5. Unit-conversion policy docket

Three policies are possible:

1. **Strict registry only:** accept only matching unit identifiers unless a conversion rule is explicitly registered.
2. **Declared conversion graph:** allow conversion only through versioned, explicitly defined conversion edges, preserving source values and conversion provenance.
3. **Implicit general conversion:** automatically convert all recognized equivalent units.

**Recommendation:** choose option 2 for the eventual formal system, with option 1 as the fallback whenever no registered conversion exists. Do not use option 3 as a default, because it can hide missing units, version differences, and assumptions about affine or non-linear scales.

No new units, prefixes, conversion operator, or conversion surface syntax is introduced here.

## 6. Numeric domains and failure outcomes

A typed evaluator will need explicit policies for:
- division by zero;
- overflow and underflow if bounded numeric representations are used;
- invalid numeric tokens;
- non-finite values, if the implementation can represent them;
- unit conversion unavailable or ambiguous;
- dimension mismatch;
- semantically incompatible quantity kinds;
- undefined result kind;
- historical operator spelling not enabled in the selected source profile.

**Proposal:** failures should be explicit and should not silently coerce the input, substitute zero, drop units, or pick a different operator alias. The exact error names and runtime recovery semantics remain implementation and canon decisions.

## 7. Approval questions

The following decisions should be resolved before these proposals become normative:

| ID | Question | Recommended default | Why approval is needed |
|---|---|---|---|
| ARITH-01 | Do physical addition/subtraction require equal dimensions? | Yes | Defines type safety |
| ARITH-02 | Must unit conversions be explicitly registered? | Yes | Avoids hidden assumptions |
| ARITH-03 | Is division by zero always invalid in the formal evaluator? | Yes | Requires domain/error semantics |
| ARITH-04 | Does negation preserve unit, dimension and quantity kind? | Yes for supported numeric quantities | Defines the unary contract |
| ARITH-05 | Does dimensional validity automatically confer a named quantity kind? | No | Prevents semantic overreach |
| ARITH-06 | Is result-kind inference defined for every arithmetic operator? | Only where explicitly specified | Many products/quotients lack established meaning |
| ARITH-07 | How are source-version spellings selected? | Explicit source profile; no global rewrite | Preserves historical records |
| ARITH-08 | Are all arithmetic values exact, floating-point, or domain-dependent? | Unresolved; declare numeric representation per profile | Precision and error behaviour are unspecified |
| ARITH-09 | Are absolute temperatures treated differently from temperature differences? | Keep distinction unresolved until specified | Temperature scales can require special arithmetic rules |
| ARITH-10 | What is the canonical expression syntax for applying arithmetic operators to typed quantity values? | Do not invent a surface constructor | Existing glosses do not fully specify expression grammar |

This table is a recommendation docket; it does not imply that any decision has been approved by the language owner.

## 8. Normative boundary and use today

Until the approval questions are settled:
- use the contracts as research validation rules only;
- label results as proposal-level;
- preserve the original value and source unit during conversions;
- do not infer physical effects from arithmetic;
- do not add surface syntax or lexemes to canon;
- preserve v3.0-L and v5 spellings with source provenance;
- do not claim the website implements dimensional checking unless its code is separately inspected and that behaviour is actually verified.

## 9. Next step

This consolidation closes the current scalar arithmetic audit cycle. The next high-value task is to connect these type rules to Arcane's named physical quantities and measurement semantics: in particular, separate the quantity concept from the measured value, and specify what information a measurement record needs before arithmetic may consume it. This connects `SIMA`, `NES`, `DAVE`, quantity kinds, units, and freshness without confusing measurement with inference or symbolic assignment.
