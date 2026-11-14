# Arcane Modern Vernacular v2.7 — Quantity Comparison

**Status:** LOCKED DESIGN CANON for the bounded Modern Vernacular measurement layer  
**Version:** 2.7  
**Depends on:** Modern Vernacular v1.0–v2.6  
**Source basis:** v2.6 defines typed quantity phrases using the Shared / CANON / v3.0-L units `ma`, `se`, `ke`, `ra`, and `ku`. The inspected Mega Pack2 lexicon records Formal / PROPOSED comparison values `nadi` (equal), `dofa` (less than), `guwi` (greater than), and `vobi` (within tolerance). These are not silently promoted to Vernacular canon. This version introduces separate modern forms for a narrow comparison construction.  
**Validation status:** Exact-form check against the indexed Mega Pack2 text found no entries for the modern forms below. This is a bounded source check, not proof of absence across every Arcane stratum. Twenty design fixtures are documented; parser execution and independent-speaker validation are not claimed.

## 1. New modern comparison forms

| Form | Meaning | Status |
|---|---|---|
| `nari` | is equal to | Modern Vernacular design coinage, v2.7 |
| `dori` | is less than | Modern Vernacular design coinage, v2.7 |
| `gari` | is greater than | Modern Vernacular design coinage, v2.7 |

These forms are licensed only in the comparison frame specified below. They do not acquire general copular, causal, control, assignment, or physical-effect meanings. They do not alter the Formal / PROPOSED entries `nadi`, `dofa`, `guwi`, or `vobi`.

## 2. Comparison frame

A comparison is a bounded relation expression, not a full sentence:

**RELATION + QUANTITY-A + QUANTITY-B**

Examples:
- `nari to ma mu ma` — two metres is equal to three metres: **FALSE** under the numeric relation; the form is a well-formed comparison, but its proposition is false.
- `dori to ma mu ma` — two metres is less than three metres: **TRUE**.
- `gari mu se to se` — three seconds is greater than two seconds: **TRUE**.
- `nari nela to ma to ma` — about two metres is equal to two metres: **REJECT**; an approximate quantity cannot be used in exact equality under this version.

The frame yields a truth-evaluable comparison. Well-formedness and truth are distinct: a comparison may be syntactically valid and semantically false.

## 3. Type and unit matching

Both operands must be complete v2.6 quantity phrases and must use the **same unit token**. Matching the dimension alone is not enough in v2.7 because conversion is not defined.

Accepted:
- `dori to ma mu ma` — both operands use `ma`, LENGTH.
- `gari mu se to se` — both operands use `se`, TIME.
- `nari to shi sa ke to shi sa ke` — same MASS unit and exact value.

Rejected:
- `dori to ma mu se` — LENGTH versus TIME.
- `nari to ma to ke` — LENGTH versus MASS.
- `nari to ma to shi ki ma` — both use `ma`; this comparison is ACCEPT and FALSE (2 metres is not equal to 2.1 metres).
- Comparing `ra` with a value expressed in degrees is not licensed; degrees are not defined as an Arcane unit here.
- Comparing kelvins with Celsius values is not licensed.

The comparison operators do not perform unit conversion, rounding, approximation, or measurement validation.

## 4. Numeric interpretation

The numeric operands use the v2.5–v2.6 numeric syntax:
- one to four integer digits, with no leading zero in a multi-digit integer;
- optional `shi` followed by one to three fractional digits;
- positive values only;
- no signs, exponents, repeating decimals, or scientific notation.

For the comparison relation only, the written decimal values are interpreted as ordinary finite base-ten values. Trailing zeros do not change numerical value: `to shi za ma` and `to ma` represent the same value in the same unit and compare equal. This is a v2.7 design rule, not a claim about an earlier historical numeric grammar.

The approximate marker `nela` is excluded from comparison operands. Approximation means an unspecified estimate, not a mathematical interval with defined bounds. Exact inequality against an approximate value could therefore misrepresent what is known.

## 5. Scope and limits

A relation expression contains exactly one relation marker and exactly two quantity operands. No nesting or chains are licensed.

- `dori A B` does not assert that A caused B.
- `gari A B` does not assert that B is achievable, safe, or physically feasible.
- `nari A B` compares values; it does not assign one value to another or change either value.
- Comparison truth does not certify the quality of the measurements.
- This version does not introduce a clause-level copula, question syntax, negated comparison, conditional comparison, range, tolerance interval, or comparison against an unknown variable.
- A bare comparison is not an instruction to control a system.

## 6. Formal vocabulary boundary

The Mega Pack2 v5 draft lexicon lists:
- `nadi` — relation: equal;
- `dofa` — relation: less than;
- `guwi` — relation: greater than;
- `vobi` — tolerance: within.

All four remain Formal / PROPOSED / Phase 4 in source provenance. The similarity of meaning does not establish that their argument order, execution semantics, or scope matches the new Vernacular forms. They must not be substituted mechanically into the v2.7 frame. A later cross-register bridge would require a separate decision and tests.

## 7. Acceptance and rejection fixtures

These are specification-level fixtures, not results from an executed parser or independent speakers. “Well-formed, false” means the comparison frame is licensed but the relation does not hold.

| ID | Input | Expected result |
|---|---|---|
| CMP27-01 | `dori to ma mu ma` | ACCEPT; well-formed and true (2 m < 3 m) |
| CMP27-02 | `gari mu se to se` | ACCEPT; well-formed and true (3 s > 2 s) |
| CMP27-03 | `nari to ma to ma` | ACCEPT; well-formed and true (2 m = 2 m) |
| CMP27-04 | `nari to ma mu ma` | ACCEPT; well-formed but false (2 m ≠ 3 m) |
| CMP27-05 | `dori mu ma to ma` | ACCEPT; well-formed but false (3 m < 2 m is false) |
| CMP27-06 | `gari to se mu se` | ACCEPT; well-formed but false (2 s > 3 s is false) |
| CMP27-07 | `nari to shi za ma to ma` | ACCEPT; equal after trailing-zero normalisation |
| CMP27-08 | `dori to shi sa ma mu ma` | ACCEPT; 2.5 m < 3 m |
| CMP27-09 | `nari nela to ma to ma` | REJECT; approximate operand forbidden |
| CMP27-10 | `dori to ma mu se` | REJECT; incompatible dimensions/units |
| CMP27-11 | `nari to ma to ke` | REJECT; incompatible units |
| CMP27-12 | `gari mu ra to ra` | ACCEPT; same angle unit, 3 rad > 2 rad |
| CMP27-13 | `nari to ma to shi ki ma` | ACCEPT; well-formed but false (2 m ≠ 2.1 m) |
| CMP27-14 | `nari to ma` | REJECT; missing second operand |
| CMP27-15 | `dori to ma mu ma ki ma` | REJECT; third operand/chained comparison |
| CMP27-16 | `nari nari to ma to ma` | REJECT; two relation markers |
| CMP27-17 | `vobi to ma to ma` | REJECT; Formal / PROPOSED form not licensed here |
| CMP27-18 | `dofa to ma mu ma` | REJECT in v2.7 Vernacular frame; Formal / PROPOSED form not promoted |
| CMP27-19 | `nari to ku to ku` | ACCEPT; same unit, same value |
| CMP27-20 | Interpret `gari mu ke to ke` as a command to increase mass | REJECT; comparison is not a control instruction |

## 8. Explicitly unresolved

This version does not define approximate comparison, tolerance bounds, equality under unit conversion, unit conversion itself, zero or negative operands, ranges, chained comparisons, comparisons with variables, comparison clauses as ordinary sentences, or any execution/control semantics.

**Change policy:** These comparison forms and rules apply only to the bounded Modern Vernacular layer. They do not rewrite Formal Arcane, historical strata, or the source lexicon. Any broader use requires a versioned decision and new fixtures.
