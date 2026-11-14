# Arcane Phase 8K — scalar quantity contracts and dimensional algebra

**Status:** Source-grounded inventory and proposal-level operator contracts  
**Date:** 2026-10-15  
**Canon effect:** none  
**New vocabulary:** none  
**Implementation changes:** none  
**Tests executed:** none

## 1. Objective

Phases 8I–8J demonstrated a conservative typed workflow for vector values. This phase applies the same discipline to scalar quantities, focusing on `FRAPA` (add), `FRALA` (divide), and `FRASHA` (negate). It also records the dimensional principles that later work on subtraction and multiplication will need.

The purpose is not to declare familiar arithmetic conventions canonical. It is to define a usable research contract, identify the remaining decisions, and avoid treating a syntactically parseable expression as a well-typed physical quantity.

## 2. Source-grounded facts

The inspected `docs/canon/arcane-language-v3.0-L.md` establishes:

- Arcane is a typed formal system; incompatible types must not be accepted without a defined operation or conversion (§2).
- Core operators have fixed argument counts, and grouping must not depend on precedence (§2).
- `FRAPA`, `FRATA`, `FRAKA`, `FRALA`, and `FRASHA` are listed as add, subtract, multiply, divide, and negate (§8).
- The specification distinguishes a quantity/property from a particular value of that quantity (§6).
- `FRASHA` is also listed as the negative operator in the digit/unit section (§11).
- The canonical unit inventory includes `MA` (metre), `SE` (second), `KE` (kilogram), `RA` (radian), and `KU` (kelvin) (§11).
- The canonical specification does not, in the inspected passages, give the complete dimensional signatures, unit-conversion rules, numeric domains, zero-division policy, or error semantics for these operators.

The operator-contract registry in Phase 7X likewise records unit compatibility, numeric domains, zero-denominator handling, and dimensional algebra as unresolved contract requirements. Its inherited signatures remain provisional.

## 3. Research quantity record

**Proposal, not canon:** represent each scalar quantity value in research with the following metadata:

```text
kind: QuantityValue
quantity_kind: explicitly declared semantic quantity
magnitude: numeric value
unit: explicit unit or dimensionless
dimension: derived/declared physical dimension
source_status: canon | proposal | unresolved
```

This is an abstract data record, not Arcane surface syntax. The quantity kind and physical dimension must not be collapsed into one field: two values can share the same physical dimension yet serve different semantic roles. Conversely, identical numeric magnitudes do not make different dimensions compatible.

Examples of quantity kinds named in canon include position, velocity, mass, acceleration, force, energy, temperature, pressure, and momentum. This list does not by itself provide every quantity's complete unit signature.

## 4. Dimensional compatibility for addition

**Minimal proposal:** `FRAPA(a,b)` is eligible for typed addition only when both operands have compatible dimensions and compatible units, or when an explicit, valid conversion rule is available.

Illustrative examples:

| Left operand | Right operand | Proposed result |
|---|---|---|
| 2 m | 3 m | 5 m; eligible |
| 2 s | 3 s | 5 s; eligible |
| 2 m | 3 s | Reject as dimensionally incompatible |
| 2 m | 300 cm | Block unless centimetres and the conversion are supported by the active unit registry |
| 2 m displacement | 3 m position | Block until semantic quantity-kind compatibility is specified, even though dimensions match |

The final row is deliberately conservative. Position and displacement can both have length dimension, but whether a particular Arcane operation permits them to be added is a semantic rule, not merely a unit calculation.

This proposal does not assert that `FRAPA` canonically accepts only physical quantities; it defines the safe contract for research fixtures intended to represent physical quantities.

## 5. Dimensional compatibility for division

**Minimal proposal:** `FRALA(a,b)` requires a non-zero denominator and a defined result dimension. For physical quantities, the result dimension follows the quotient of operand dimensions if the operation is otherwise approved.

Illustrative examples:

| Expression | Mathematical/dimensional observation | Proposed status |
|---|---|---|
| 6 m ÷ 2 s | 3 m/s | Eligible under the proposal |
| 6 m ÷ 2 m | 3, dimensionless ratio | Eligible under the proposal |
| 6 s ÷ 2 s | 3, dimensionless ratio | Eligible under the proposal |
| 6 m ÷ 0 s | Division by zero | Reject |
| 6 m ÷ 2 kg | 3 m/kg | Dimensionally expressible, but semantic quantity kind may remain unresolved |
| 6 m ÷ 2 m/s | 3 s | Dimensionally expressible, but intended meaning depends on semantic context |

Dimensional algebra can determine a candidate unit; it cannot alone decide whether that result is a meaningful quantity in a given Arcane construction. For example, a quotient may have dimensions of time without automatically being an approved duration, deadline, or temporal control value.

Zero-denominator rejection is a recommended minimum for a safe evaluator, not a claim that the canon already specifies runtime error behaviour.

## 6. Negation

**Minimal proposal:** `FRASHA(q)` reverses the sign of a supported numeric quantity while preserving its unit, physical dimension, and semantic quantity kind.

Examples:

| Input | Candidate result | Notes |
|---|---|---|
| +3 m | −3 m | Length dimension preserved |
| −4 s | +4 s | Double negation returns original value under ordinary arithmetic |
| 0 kg | 0 kg | Sign inversion leaves zero unchanged |
| +5 m/s | −5 m/s | Numeric sign changes; physical interpretation depends on the defined reference orientation |
| Boolean, control expression, or untyped value | Block | Not a supported numeric quantity under this proposal |

A negative scalar is not automatically a vector pointing in a negative spatial direction. Directional interpretation requires a declared axis/frame and a value kind for which the sign has that meaning.

The digit section's use of `FRASHA` as the negative operator supports the association, but the full accepted operand domain and runtime semantics still require a formal contract.

## 7. Unit dimensions: do not overclaim the registry

The canonical inventory explicitly includes `MA`, `SE`, `KE`, `RA), and `KU`. It does not follow that every common unit, prefix, derived unit, or conversion is already a canonical Arcane token.

For research fixtures, use a structured dimensional representation, for example:

- length: (L)
- time: (T)
- mass: (M)
- velocity: (LT^{-1})
- acceleration: (LT^{-2})
- force: (MLT^{-2})

These are standard dimensional-analysis labels in the research notation, not Arcane words. The dimensions of force, energy and other named quantities must be linked to the physical specification's unit conventions before a canonical dimensional signature is claimed. The examples here use ordinary physical dimensional analysis to test proposals; they do not expand the Arcane unit lexicon.

Do not silently introduce centimetres, joules, newtons, prefixes, or a unit-conversion operator into canonical surface forms.

## 8. Cross-version and lexical safeguards

- Keep `FRATA` and the proposed/preferred alias `FRAJA` source-stratified.
- Keep `FRAKA` and `FRAMA` source-stratified.
- Preserve the canonical v3.0-L unit forms and their version provenance.
- Do not infer a unit conversion from a spelling resemblance.
- Do not assume that a parse tree establishes quantity dimensions.
- Do not assume that a quantity calculation itself causes a physical change.
- `GAMA` assignment of a symbolic value does not, by itself, change the physical referent.
- Syntax, type validation, dimensional validation, mathematical evaluation and physical feasibility remain separate gates.

## 9. Acceptance and rejection fixtures

These are proposed expected outcomes for a future validator. They have not been run against the website or any implementation.

| ID | Input condition | Proposed outcome | Why |
|---|---|---|---|
| SQ-01 | Add 2 m and 3 m | Accept under proposal; result 5 m | Compatible dimension/unit |
| SQ-02 | Add 2 m and 3 s | Reject | Dimension mismatch |
| SQ-03 | Add 2 m and 300 cm without a registered conversion | Block | Conversion unsupported |
| SQ-04 | Add position and displacement, both length dimension | Block pending semantic-kind contract | Same dimension does not settle meaning |
| SQ-05 | Divide 6 m by 2 s | Accept under proposal; result 3 m/s | Quotient dimension defined |
| SQ-06 | Divide a quantity by zero | Reject | Undefined numeric operation |
| SQ-07 | Divide 6 m by 2 m | Accept under proposal; dimensionless ratio 3 | Dimensions cancel |
| SQ-08 | Negate +3 m | Accept under proposal; result −3 m | Preserve dimension and unit |
| SQ-09 | Negate a boolean/control expression | Reject under proposal | Outside declared numeric domain |
| SQ-10 | Use a well-typed result as a claim of physical effect | Physical gate still required | Arithmetic is not causation |

## 10. Operator decision table

| Operator | Source-established gloss | Minimal research contract | Still unresolved canonically |
|---|---|---|---|
| FRAPA | Add | Require compatible dimensions, units and quantity-kind semantics | Exact accepted types, conversion rules, errors |
| FRALA | Divide | Require non-zero denominator and a defined quotient dimension | Exact domains, zero behaviour, result-kind rules |
| FRASHA | Negate / negative | Preserve type and units while changing numeric sign | Accepted operand types, signed-domain and runtime semantics |
| FRATA / FRAJA | Subtract / source-stratified renamed form | Use compatible dimensions and approved operand-kind relation | Preferred version form, complete contract |
| FRAKA / FRAMA | Multiply / source-stratified renamed form | Combine dimensions under a defined dimensional algebra | Preferred version form, complete result-kind rules |

The table deliberately does not silently upgrade the candidate contracts to canon.

## 11. Decision ledger and next phase

- **Decision ID:** P8K-SCALAR-DIMENSIONAL-ALGEBRA-01
- **Canon changes:** none.
- **New vocabulary:** none.
- **Implementation changes:** none.
- **Tests executed:** none.
- **Main result:** a reusable proposal-level quantity record and concrete compatibility/error cases for addition, division and negation.
- **Next phase:** build a source-stratified worked quantity fixture bank with calculations, expected type/unit results, and explicit blocked cases. Then move to multiplication/subtraction and compare all arithmetic contracts as one coherent dimensional-algebra proposal rather than auditing each operator in isolation.
