# Arcane Phase 8D — provenance audit of identifier and block markers

**Status:** Source-stratified evidence audit  
**Date:** 2026-10-15  
**Canon effect:** none  
**New forms:** 0  
**Tests executed:** none

## 1. Finding in brief

The repository evidence now supports a more precise status for three surface-parser conventions:

- **SHO** is listed in the v5 draft lexicon as a **PROPOSED** dimensionless unit, attributed to Phase 4, with the gloss “ends every numeral that has no physical unit”. The parser uses it both as a dimensionless numeral terminator and as the required closure token for binding identifiers. The latter use is not supported by that lexicon entry.
- **METO** and **DOGU** are listed in the v5 draft lexicon as **PROPOSED** Formal control forms, attributed to Phase 4, glossed “block open” and “block close”. The surface parser uses them to delimit control blocks. They are therefore documented proposals implemented by the prototype, not established canon.
- The canonical v3.0-L conceptual binding example `KWAM 1 E` and `KWAT 1` establishes a binding/reference concept, but not SHO-closed identifier syntax.

## 2. Evidence ledger

| Item | Source evidence | Implementation evidence | Status |
|---|---|---|---|
| Numeric digits ZA–PE | v5 draft lexicon labels digits CANON, v3.0-L | Surface parser maps the digit tokens to decimal digits | Canonical digit inventory; parser behaviour still needs execution evidence |
| SHO as dimensionless-unit terminator | v5 draft lexicon labels SHO PROPOSED, Phase 4 | Parser permits SHO in its unit set and uses it to close unitless numerals | Proposed unit convention |
| SHO as binding-identifier terminator | No inspected canonical source establishes this use | `parseIdentifier()` requires SHO after digit tokens | Prototype-only extension; canon unresolved |
| METO as block opener | v5 draft lexicon labels METO PROPOSED, Phase 4 | Control parsing expects METO | Proposed control delimiter |
| DOGU as block closer | v5 draft lexicon labels DOGU PROPOSED, Phase 4 | Control parsing consumes expressions until DOGU | Proposed control delimiter |
| KWAM creates a binding | v3.0-L §10 | Parser constructs a KWAM node with identifier and expression | Canonical concept; complete semantics unresolved |
| KWAT references a binding | v3.0-L §10 | Parser constructs a one-identifier KWAT node | Canonical concept; identifier encoding unresolved |

The v5 draft lexicon is not itself a blanket promotion of entries marked PROPOSED. Its own status labels must be preserved.

## 3. Design risk: one token, two grammars

The prototype uses SHO in two roles:
1. a unit-like terminator for a dimensionless numeric expression;
2. a closure marker for a binding identifier.

The first role has a Phase 4 proposal in the v5 draft. The second role is only evidenced in parser code and tests inspected here. Sharing a token across these roles may be a workable design, but the grammar must distinguish numeral context from identifier context explicitly. The prototype does so by entering `parseIdentifier()` after KWAM/KWAT; this implementation fact does not prove the same boundary convention is canonical.

A future canonical decision should either:
- explicitly approve this reuse and specify context-sensitive parsing; or
- select a distinct identifier boundary rule supported by the language's phonology and orthography.

No alternative token is proposed in this audit.

## 4. Design risk: proposed control delimiters

METO and DOGU are explicitly marked PROPOSED in the v5 draft lexicon, even though the surface parser has diagnostic handling for missing delimiters and rejects these forms outside supported control contexts.

This is a clear example of why “implemented” must not be treated as “approved”. The prototype provides a candidate mechanism for unambiguous block boundaries. It does not establish that METO/DOGU belong to the locked formal control grammar, that they are valid across historical strata, or that they are the only possible block convention.

The next decision should define:
- which control operators own a block body;
- whether the body may contain one or many expressions;
- whether an empty body is valid;
- whether nested blocks are permitted and how they close;
- whether METO/DOGU are surface delimiters, performed register markers, or both;
- how the surface block maps to the spell-representation CONTROL layer.

## 5. Collision policy must remain separate

The v5 lexicon and canonical sources record lexical collisions:
- RE is digit 4 and a TARGET-surface fused reference;
- RA is a radian unit and a TARGET-path fused reference.

The surface parser rejects RE/RA in ambiguous atom/numeral contexts because it lacks a slot-sensitive disambiguation policy. That is a conservative prototype choice, not a canon rule that Arcane itself must reject those forms. The canonical language's lexical-collision cleanup and scope-sensitive reference distinctions require a source-grounded contextual policy, not arbitrary global rewriting.

## 6. Recommended decisions (not yet canon)

1. Keep SHO identifier closure **prototype-only** until primary-source support or an explicit design decision is recorded.
2. Keep METO/DOGU as **proposed** control delimiters; do not silently promote them based on parser support.
3. Define identifier context separately from numeric quantity context.
4. Define control-body cardinality, nesting and termination before constructing nested control incantations.
5. Specify RE/RA disambiguation by syntactic slot, register and source version; until then, preserve diagnostics rather than guess.
6. Record the selected parser, source revision and options whenever a parser observation is cited.

## 7. Consequence for incantation development

At present, the safest candidate formal research notation is still the explicitly bracketed Phase 2 audit notation for nested fixed-arity expressions, with the notation clearly labelled as abstract. The surface parser can be used for its supported prototype cases, but successful parsing is not canon approval. Binding constructions that depend on SHO-closed identifiers and control constructions that depend on METO/DOGU remain provisional.

Do not claim that an incantation is ready for general use until linguistic validity, construction completeness and physical/casting feasibility have each been assessed.

## 8. Decision ledger

- **Decision ID:** P8D-MARKER-PROVENANCE-01
- **Canon changes:** none
- **New vocabulary:** none
- **Implementation changes:** none
- **Tests executed:** none
- **Primary result:** SHO has a proposed lexicon entry for dimensionless numeral closure, but its identifier-closure use is prototype-only; METO/DOGU are explicitly proposed entries, not canon.
- **Next phase:** create a version-aware decision docket for control blocks and expression boundaries, separating the minimum decisions needed for readable nested constructions from broader control-flow semantics.
