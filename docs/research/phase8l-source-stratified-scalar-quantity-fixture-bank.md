# Arcane Phase 8L — source-stratified scalar quantity fixture bank

**Status:** Abstract worked fixtures and expected outcomes  
**Date:** 2026-10-15  
**Canon effect:** none  
**New vocabulary:** none  
**Tests executed:** none

## 1. Purpose and scope

Phase 8K proposed a minimum dimensional contract for scalar arithmetic. This bank makes those rules reviewable through concrete examples and separates:
- arithmetic that is mathematically defined;
- dimensional compatibility;
- semantic quantity-kind compatibility;
- whether a particular spelling belongs to the source version under review;
- whether the result could support a physical claim.

All quantities and calculations below are abstract research fixtures. No new Arcane surface syntax is proposed. The fixtures have not been run through the website parser or an evaluator.

## 2. Fixture notation

Each operand is recorded as:

`Q(value, unit, dimension, kind, source_status)`

Examples:
- `Q(2, MA, L, length-value, fixture)` represents two metres in research metadata.
- `Q(3, SE, T, time-value, fixture)` represents three seconds.
- `Q(2, MA, L, position, fixture)` and `Q(3, MA, L, displacement, fixture)` deliberately use distinct semantic kinds with the same dimension.

This is metadata notation, not an Arcane constructor. `L`, `T`, and `M` are dimensional-analysis symbols, not Arcane lexemes.

## 3. Addition and subtraction fixtures

| ID | Operation | Expected arithmetic | Dimensional outcome | Proposed status |
|---|---|---|---|---|
| ARQ-ADD-01 | 2 m + 3 m | 5 m | L | Eligible |
| ARQ-ADD-02 | 2 s + 3 s | 5 s | T | Eligible |
| ARQ-ADD-03 | 2 m + 3 s | None | L vs T | Reject |
| ARQ-ADD-04 | 2 m + 300 cm | 5 m only after conversion | L vs L, different unit scales | Block unless conversion is registered |
| ARQ-ADD-05 | position 2 m + displacement 3 m | No result under minimal contract | Both L, distinct semantic kinds | Block pending quantity-kind rule |
| ARQ-SUB-01 | 5 m − 2 m | 3 m | L | Eligible |
| ARQ-SUB-02 | 2 m − 5 m | −3 m | L | Eligible if signed quantities are supported |
| ARQ-SUB-03 | 3 s − 1 s | 2 s | T | Eligible |
| ARQ-SUB-04 | 2 kg − 1 m | None | M vs L | Reject |
| ARQ-SUB-05 | position − position | Depends on defined semantics | L output may be displacement, but that relation is not yet a complete Arcane contract | Block pending result-kind rule |

The arithmetic outcomes use ordinary mathematics. The accept/block statuses are proposal-level expectations, not canonical runtime behaviour.

## 4. Multiplication fixtures

For dimensional analysis, the candidate rule is to multiply dimensions by adding their exponents. Semantic quantity kinds still need explicit contracts.

| ID | Operation | Expected arithmetic | Candidate dimension | Proposed status |
|---|---|---|---|---|
| ARQ-MUL-01 | 2 m × 3 m | 6 m² | L² | Eligible under dimensional proposal |
| ARQ-MUL-02 | 2 m × 3 s | 6 m·s | LT | Dimensionally defined; semantic kind unresolved |
| ARQ-MUL-03 | 6 m × 2 s⁻¹ | 12 m/s | LT⁻¹ | Eligible only if inverse-second input is represented and approved |
| ARQ-MUL-04 | 2 kg × 3 m/s² | 6 kg·m/s² | MLT⁻² | Candidate force dimension; physical interpretation needs quantity-kind rule |
| ARQ-MUL-05 | Boolean × 3 m | None under the minimal contract | Undefined | Reject unless a specific nonnumeric operator is defined |

The canonical vocabulary names multiplication as `FRAKA` in v3.0-L and records `FRAMA` as a renamed form in the v5 draft lexicon. A fixture must state which source stratum it is testing; neither form is globally substituted for the other by this document.

## 5. Division fixtures

| ID | Operation | Expected arithmetic | Candidate dimension | Proposed status |
|---|---|---|---|---|
| ARQ-DIV-01 | 6 m ÷ 2 s | 3 m/s | LT⁻¹ | Eligible |
| ARQ-DIV-02 | 6 m ÷ 2 m | 3 | 1 | Eligible as dimensionless ratio |
| ARQ-DIV-03 | 6 s ÷ 2 s | 3 | 1 | Eligible as dimensionless ratio |
| ARQ-DIV-04 | 6 m ÷ 0 s | Undefined | None | Reject |
| ARQ-DIV-05 | 6 m ÷ 2 kg | 3 m/kg | LM⁻¹ | Dimensionally expressible; semantic kind unresolved |
| ARQ-DIV-06 | 6 m ÷ 2 m/s | 3 s | T | Dimensionally expressible; temporal meaning not automatic |

A quotient's dimension is not a licence to reinterpret it as any named Arcane quantity. For example, a result with time dimension is not automatically a duration, deadline, delay or control condition.

## 6. Negation fixtures

| ID | Input | Expected result | Proposed status |
|---|---|---|---|
| ARQ-NEG-01 | +3 m | −3 m | Eligible |
| ARQ-NEG-02 | −4 s | +4 s | Eligible |
| ARQ-NEG-03 | 0 kg | 0 kg | Eligible |
| ARQ-NEG-04 | +5 m/s | −5 m/s | Eligible as a signed scalar; directional interpretation needs context |
| ARQ-NEG-05 | Boolean true | None | Reject under numeric-only proposal |
| ARQ-NEG-06 | Untyped numeric token with no unit/type context | Numeric sign may be computable, but physical quantity status is unresolved | Block physical type validation |

The spelling `FRASHA` is listed for negation and for the negative marker. The exact canonical expression grammar for applying it to a quantity is not specified by these fixtures.

## 7. Unit conversion and canonical vocabulary boundary

The inspected canonical inventory includes `MA` (metre), `SE` (second), `KE` (kilogram), `RA` (radian), and `KU` (kelvin). It does not establish a complete registry of prefixes, derived units, or conversion operations.

Therefore:
- `2 m + 300 cm` cannot be accepted by a strict validator unless the centimetre unit and conversion are explicitly available in its active registry.
- The research harness may record converted values after a declared conversion, but must retain the original values and conversion provenance.
- It must not silently add new Arcane unit words.
- Radian and kelvin should not be assigned conversion or affine arithmetic rules without the corresponding quantity contract; temperature in particular may need distinctions between absolute values and differences.

## 8. Version and operator spelling fixture metadata

Every operator fixture should include fields such as:

```text
fixture_id: ARQ-ADD-01
source_stratum: v3.0-L
operator_spelling: FRAPA
expected_operator_gloss: add
operand_records: [...]
expected_dimension: L
expected_status: proposal-eligible
canon_status: unresolved-contract-details
```

For multiplication/subtraction comparisons, record the chosen source stratum explicitly:
- v3.0-L: `FRATA`, `FRAKA`;
- v5 draft lexicon: `FRAJA`, `FRAMA` as recorded renamed forms.

The fixture bank does not resolve which source should be preferred in a future canonical revision.

## 9. Result-state vocabulary for research records

Use these outcome labels consistently in future research artifacts:

- `ACCEPT_PROPOSAL`: passes the explicitly named proposal-level checks.
- `REJECT_DIMENSION`: operand dimensions are incompatible for the proposed operation.
- `BLOCK_UNIT_REGISTRY`: required unit or conversion is unavailable.
- `BLOCK_QUANTITY_KIND`: dimensions may match, but semantic kinds are not approved as compatible.
- `REJECT_DOMAIN`: input is outside the proposed numeric domain.
- `REJECT_ZERO_DENOMINATOR`: division denominator is zero.
- `BLOCK_CANON_CONTRACT`: arithmetic may be possible, but the Arcane operator contract remains unresolved.
- `PHYSICAL_GATE_REQUIRED`: a numeric result is being used to claim a physical effect.

These are labels for documentation and possible future test harnesses, not canonical Arcane words and not a claim that the website currently implements these states.

## 10. Conclusions and next phase

This bank supplies a concrete starting set for a future evaluator and makes the major failure classes explicit. It also exposes a broader decision that should be handled once for the whole arithmetic family: quantity kind, dimension, unit, numeric domain, and result kind are separate fields.

- **Decision ID:** P8L-SCALAR-QUANTITY-FIXTURE-BANK-01
- **Canon changes:** none.
- **New vocabulary:** none.
- **Implementation changes:** none.
- **Tests executed:** none.
- **Next phase:** consolidate addition, subtraction, multiplication, division and negation into one arithmetic contract proposal, including result-kind inference and unit-conversion policy. Then, if the source evidence still leaves the same decisions open, prepare a concise approval docket rather than producing more repetitive inventories.
