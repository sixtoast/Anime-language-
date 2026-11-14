# Arcane Modern Vernacular v2.6 — Typed Measurement Quantities

**Status:** LOCKED DESIGN CANON for the bounded Modern Vernacular measurement layer  
**Version:** 2.6  
**Depends on:** Modern Vernacular v1.0–v2.5  
**Source basis:** The inspected Mega Pack2 v5 draft lexicon records `ma` (metre), `se` (second), `ke` (kilogram), `ra` (radian), and `ku` (kelvin) as Shared / CANON / v3.0-L units. It records `shi` as a Shared / CANON / v3.0-L decimal separator. This version defines a typed quantity phrase for those units; it does not promote the Formal / PROPOSED math vocabulary or infer unrecorded conversion rules.  
**Validation status:** Source-form check and specification-level dimensional review completed. Parser execution, physical-unit conversion tests, and independent-speaker validation are not claimed.

## 1. Purpose

Version 2.6 generalises the numeric quantity format established in v2.4–v2.5 from event duration to a small, typed measurement phrase.

A measurement phrase has the form:

**[nela] + NUMERIC-VALUE + UNIT**

The value uses the v2.5 number syntax:
- one to four integer digits, with no leading zero unless the integer part is exactly `za`;
- optionally, `shi` followed by one to three fractional digits;
- value must be greater than zero;
- no sign, exponent, fraction bar, or repeating decimal;
- `nela`, if present, precedes the complete value and marks an approximate estimate.

The unit must be exactly one of the five listed below. This is a typed quantity phrase, not a complete sentence or a newly invented copula construction.

## 2. Canonical units and dimensions

| Unit | Source gloss | Dimension type | Example |
|---|---|---|---|
| `ma` | metre | LENGTH | `to ma` — two metres |
| `se` | second | TIME | `to se` — two seconds |
| `ke` | kilogram | MASS | `to ke` — two kilograms |
| `ra` | radian | PLANE ANGLE | `to ra` — two radians |
| `ku` | kelvin | THERMODYNAMIC TEMPERATURE | `to ku` — two kelvins |

The unit words and their source labels are unchanged. The new design decision is that, inside this quantity phrase, a numeral followed by one of these units forms a quantity with the corresponding dimension type.

These five types are not interchangeable. A quantity's dimension is determined by its unit, not by the number, verb, speaker's intention, or nearby words.

## 3. Quantity examples

The following are valid quantity phrases, not full independent clauses:

| Arcane quantity phrase | Typed interpretation |
|---|---|
| `ki ma` | 1 metre; LENGTH |
| `mu shi sa ma` | 3.5 metres; LENGTH |
| `nela to ma` | about 2 metres; LENGTH |
| `ki to se` | 12 seconds; TIME |
| `to shi sa ke` | 2.5 kilograms; MASS |
| `mu ra` | 3 radians; PLANE ANGLE |
| `ki shi za ku` | 1.0 kelvins; THERMODYNAMIC TEMPERATURE |
| `nela pe shi pe se` | about 9.9 seconds; TIME |

For temperature, this is a numeric quantity expressed in kelvins. This version does not define Celsius/Fahrenheit, temperature differences, a physical reference point, or conversion formulas.

## 4. Approximation

`nela` scopes over the entire numeric value and its unit. It means “approximately this quantity”, not:
- at most this value;
- at least this value;
- within a fixed percentage or absolute tolerance;
- a guarantee that the value was measured accurately.

A precise tolerance operator is not defined in this version. The Formal / PROPOSED forms `vobi` (“tolerance: within”), `nadi` (“equal”), `dofa` (“less than”), and `guwi` (“greater than”) remain Formal / PROPOSED / Phase 4. Their source presence does not license them in Modern Vernacular.

## 5. Dimensional safety rules

A quantity phrase carries exactly one dimension type. A consumer of that phrase must preserve its type.

- LENGTH may be compared or combined only with a well-defined LENGTH quantity.
- TIME may be compared or combined only with a well-defined TIME quantity.
- MASS may be compared or combined only with a well-defined MASS quantity.
- PLANE ANGLE may be compared or combined only with a well-defined PLANE ANGLE quantity.
- THERMODYNAMIC TEMPERATURE may be compared or combined only with a well-defined THERMODYNAMIC TEMPERATURE quantity.

This is a type-safety rule, not a complete arithmetic system. Version 2.6 does not define addition, subtraction, multiplication, division, ratios, rates, dimensional products, or derived units. Consequently, no expression such as “metres per second” is licensed merely by placing `ma` and `se` next to each other.

A length cannot be converted to a time; kilograms cannot be substituted for metres; radians cannot be treated as degrees; kelvins cannot be silently read as Celsius. Any future conversion rule must state the transformation, its preconditions, and the preserved or changed dimension type.

## 6. Relation to duration clauses

The v2.4–v2.5 completed-event duration construction remains a specialised clause-level use of a TIME quantity:

**SUBJECT + don + LICENSED EVENTIVE VERB + licensed complements + [nela] + NUMERIC-VALUE + se**

For example:
- `teshi don zir rawu ki to se` — the completed saying event lasted exactly twelve seconds;
- `teshi don zir rawu nela to shi sa se` — the completed saying event lasted about 2.5 seconds.

The clause-level restrictions from v2.0–v2.5 remain in force. v2.6 does not broaden duration to ongoing events, negative clauses, modal clauses, directives, or incomplete clauses. The general measurement phrase is not automatically a valid duration modifier for every predicate.

## 7. Composition and spacing

A quantity phrase has one numeric value followed by one unit token. It does not license a chain of unit tokens.

- `to ma` is a length quantity.
- `to se` is a time quantity.
- `to ma se` is rejected as one quantity phrase: two units cannot be appended to one number.
- `to ma + to se` is not an Arcane arithmetic expression; the plus sign here is explanatory notation only.
- Compound or derived units require their own versioned rules.

The decimal separator `shi` belongs inside the number and must occur before the unit. It is not itself a unit or an operator between two quantities.

## 8. Acceptance and rejection fixtures

These are specification-level design fixtures, not results from an executed parser or independent speakers.

| ID | Input or interpretation | Expected result |
|---|---|---|
| QTY26-01 | `ki ma` | ACCEPT; positive one-metre LENGTH quantity |
| QTY26-02 | `mu shi sa ma` | ACCEPT; 3.5-metre LENGTH quantity |
| QTY26-03 | `nela to ma` | ACCEPT; approximate two-metre quantity |
| QTY26-04 | `ki to se` | ACCEPT; twelve-second TIME quantity |
| QTY26-05 | `to shi sa ke` | ACCEPT; 2.5-kilogram MASS quantity |
| QTY26-06 | `mu ra` | ACCEPT; three-radian PLANE ANGLE quantity |
| QTY26-07 | `ki shi za ku` | ACCEPT; 1.0-kelvin quantity |
| QTY26-08 | `nela pe shi pe se` | ACCEPT; approximate 9.9-second quantity |
| QTY26-09 | `za ma` | REJECT; zero-valued quantity blocked in this version |
| QTY26-10 | `za ki ma` | REJECT; leading zero in multi-digit integer |
| QTY26-11 | `ki ma se` | REJECT as one quantity phrase; two unit tokens |
| QTY26-12 | `to shi ma` | REJECT; decimal separator has no fractional digit |
| QTY26-13 | `nela` | REJECT; approximation marker requires a complete quantity |
| QTY26-14 | `to ma` interpreted as two seconds | REJECT; unit determines dimension |
| QTY26-15 | `to ke` substituted for `to ma` in a length-only slot | REJECT; MASS is not LENGTH |
| QTY26-16 | Convert `mu ra` directly into degrees without a conversion rule | REJECT; conversion not defined |
| QTY26-17 | Read `ki shi za ku` as one degree Celsius | REJECT; Celsius conversion and interpretation not defined |
| QTY26-18 | Use `vobi` as a Modern Vernacular tolerance operator | REJECT; Formal / PROPOSED status remains |
| QTY26-19 | Use `to ma se` as metres per second | REJECT; compound units and rates are not defined |
| QTY26-20 | `teshi don zir rawu ki to se` | ACCEPT; inherited completed-event duration clause |
| QTY26-21 | `teshi kok zir rawu to se` | REJECT; duration-so-far remains undefined |
| QTY26-22 | Treat a grammatically valid measurement as proof that the measurement is accurate | REJECT; grammar does not certify observation |

## 9. Explicitly unresolved

This version does not define:
- zero or negative quantities;
- unit conversion, including metric prefixes and alternate temperature scales;
- compound/derived units, rates, or dimensional arithmetic;
- measurement uncertainty and formal tolerance intervals;
- comparison, equality, inequality, or ranges;
- quantity-bearing full clauses outside the existing completed-event duration construction;
- how measurements are attached to arguments in the general language;
- whether unit pluralisation or classifier-like agreement exists in other registers.

**Change policy:** this specification governs the bounded Modern Vernacular measurement layer only. It does not rewrite Formal Arcane, historical layers, performed forms, or source lexicon labels. Extend through a versioned decision with explicit dimensional checks and affected fixtures.
