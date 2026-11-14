# Arcane Modern Vernacular v2.5 — Compound Numerals and Fractional Seconds

**Status:** LOCKED DESIGN CANON for the bounded Modern Vernacular layer  
**Version:** 2.5  
**Depends on:** Modern Vernacular v1.0–v2.4  
**Source basis:** The inspected Mega Pack2 v5 draft lexicon records `za`–`pe` as digits and `shi` as a decimal separator, all Shared / CANON / v3.0-L. It does not provide a located explanation of place-value composition or examples of decimal quantities in the inspected lexicon. This version therefore makes an explicit modern design decision about their use in the Modern Vernacular duration slot.  
**Validation status:** Exact-form collision check and specification-level contrast review completed. Parser execution and independent-speaker validation are not claimed.

## 1. Purpose

Version 2.5 extends the v2.4 duration number slot in two ways:
1. a bounded base-ten place-value reading for sequences of digit tokens;
2. fractional seconds using the existing decimal separator `shi`.

No new numeral word is introduced. The source meanings and strata of the digit forms and `shi` remain unchanged. Their composition rules in this particular Modern Vernacular construction are new design canon, not a claim that the source already specified the same syntax.

## 2. Compound integer rule

In the numeric duration slot, a sequence of two to four digit tokens is read left to right as a base-ten positional numeral. Each token contributes its digit value at its position. The first digit cannot be zero.

Examples:
- `ki to se` = 12 seconds (digits 1 then 2);
- `to za se` = 20 seconds;
- `mu fi se` = 36 seconds;
- `pe pe pe pe se` = 9999 seconds.

This rule applies only to the bounded duration quantity construction in v2.5. It does not silently establish counting syntax for ordinary nouns, transfer quantities, measurements in other registers, or every use of digits throughout Arcane.

A single digit retains its v2.4 interpretation. Two-to-four digits represent an integer from 10 to 9999, provided the first digit is non-zero. Leading zeros are blocked; `za ki se` is not an alternative spelling for one second. Five or more digits are blocked in this version.

## 3. Fractional seconds

The existing `shi` decimal separator is licensed between an integer part and a fractional part in the numeric duration slot.

**DIGIT-SEQUENCE + shi + FRACTION-DIGIT-SEQUENCE + se**

Rules:
- The integer part must be one digit or a valid two-to-four-digit compound integer.
- The fractional part must contain one to three digit tokens.
- The decimal point is represented by the token `shi`; it is not a spoken decimal digit.
- The fractional part is read as decimal places: `to shi sa` = 2.5; `ki shi za` = 1.0; `za shi sa` = 0.5.
- Trailing fractional zeros are permitted up to three places, but leading zeros in the integer part are not.
- The numeric value must be greater than zero. `za shi za se` is rejected as zero duration.
- No sign, exponent, fraction bar, repeating decimal, or scientific notation is licensed.

Examples:
- `teshi don zir rawu ki to se` — the completed saying event lasted exactly 12 seconds.
- `teshi don zir rawu to shi sa se` — the completed saying event lasted exactly 2.5 seconds.
- `teshi don mol gisho ki shi za se` — the completed eating event lasted exactly 1.0 seconds (numerically equal to one second; this spelling is permitted but the simpler `ki se` is preferred).
- `teshi don seno za shi sa se` — the completed waiting episode lasted 0.5 seconds.

These are exact numeric assertions. They do not imply that a speaker measured the event precisely or that the event was physically possible.

## 4. Approximation marker

The v2.4 marker `nela` scopes over the complete number and unit:

**nela + INTEGER-OR-DECIMAL + se**

Examples:
- `teshi don zir rawu nela ki to se` — about 12 seconds;
- `teshi don zir rawu nela to shi sa se` — about 2.5 seconds;
- `teshi don seno nela za shi sa se` — about half a second of waiting.

Approximation does not define a universal tolerance and does not mean “at most” or “at least”. The upper/lower-bound constructions remain undefined.

## 5. Full clause pattern and inherited limits

The duration phrase remains clause-final:

**SUBJECT + don + LICENSED EVENTIVE VERB + licensed complements + [nela] + NUMERIC-DURATION + se**

The v2.4 licensing list and restrictions remain in force:
- affirmative completed-event clauses only;
- v2.0 licensed eventive verbs plus the v2.3 completed waiting verb `seno`;
- no `kok), no `nava), no modal predicates, no directives, no bare nouns or incomplete clauses;
- no stacking with qualitative markers `melo` or `runi`;
- no second duration phrase in the same clause;
- `nela` must precede the complete numeric quantity;
- a positive polar question may append `pun` to the complete clause;
- a numeric travel duration does not assert arrival, and a transfer duration does not prove successful delivery, consent or ownership change.

The previous v2.4 upper bound of nine seconds is superseded by this version's integer range 1–9999 and fractional range 0.001–9999.999 seconds, subject to the rules above. v2.4's zero-duration rejection is retained.

## 6. Reading and normalisation

The duration number is evaluated as a decimal numeral, not as a sum of the digit values:
- `ki to` = twelve, not three;
- `to za` = twenty, not two plus zero;
- `mu fi` = thirty-six, not three plus six;
- `to shi sa` = two and five tenths, not two plus five.

Normalised numeric values may be used in technical interpretation, but this language specification does not mandate a particular internal data representation or claim that the website/runtime already implements it.

## 7. Acceptance and rejection fixtures

These fixtures are design targets only. They have not been parser-executed or independently speaker-tested.

| ID | Input or interpretation | Expected result |
|---|---|---|
| NUM25-01 | `teshi don zir rawu ki se` | ACCEPT; one second, inherited v2.4 single digit |
| NUM25-02 | `teshi don zir rawu ki to se` | ACCEPT; 12 seconds |
| NUM25-03 | `teshi don zir rawu to za se` | ACCEPT; 20 seconds |
| NUM25-04 | `teshi don zir rawu mu fi se` | ACCEPT; 36 seconds |
| NUM25-05 | `teshi don zir rawu pe pe pe pe se` | ACCEPT; 9999 seconds |
| NUM25-06 | `teshi don zir rawu to shi sa se` | ACCEPT; 2.5 seconds |
| NUM25-07 | `teshi don zir rawu ki shi za se` | ACCEPT; 1.0 seconds, though shorter form preferred |
| NUM25-08 | `teshi don seno za shi sa se` | ACCEPT; 0.5-second completed waiting episode |
| NUM25-09 | `teshi don zir rawu nela ki to se` | ACCEPT; approximately 12 seconds |
| NUM25-10 | `teshi don zir rawu nela to shi sa se` | ACCEPT; approximately 2.5 seconds |
| NUM25-11 | `teshi don zir rawu za ki se` | REJECT; leading zero |
| NUM25-12 | `teshi don zir rawu pe pe pe pe pe se` | REJECT; more than four integer digits |
| NUM25-13 | `teshi don zir rawu to shi se` | REJECT; decimal separator requires fractional digits |
| NUM25-14 | `teshi don zir rawu to shi sa fi re se` | REJECT; more than three fractional digits |
| NUM25-15 | `teshi don zir rawu za shi za se` | REJECT; zero duration |
| NUM25-16 | `teshi don zir rawu shi sa se` | REJECT; missing integer part |
| NUM25-17 | `teshi don zir rawu to shi sa shi fi se` | REJECT; repeated decimal separator |
| NUM25-18 | `teshi don zir rawu nela to se melo` | REJECT; numeric and qualitative duration stacking |
| NUM25-19 | `teshi kok zir rawu to se` | REJECT; duration-so-far remains undefined |
| NUM25-20 | Interpret `ki to` as 1 + 2 | REJECT; digit sequences are positional in this slot |
| NUM25-21 | Interpret `nela to shi sa se` as “at most 2.5 seconds” | REJECT; approximation has no bound semantics |
| NUM25-22 | Use `wuga` or `levu` for scientific notation in this construction | REJECT; those remain Formal / PROPOSED and exponent syntax is not defined here |
| NUM25-23 | Use `shi` as a decimal separator globally in every Arcane register | REJECT; this rule is limited to the specified numeric duration slot |
| NUM25-24 | Interpret numeric travel duration as guaranteed arrival | REJECT; duration does not change the v1.3 motion semantics |

## 8. Future work

Version 2.5 closes positional integer composition and bounded decimal seconds only inside the Modern Vernacular duration construction. Still open:
- general numeral use outside this construction;
- duration units other than seconds and unit conversion;
- exact negative values and arithmetic expressions;
- scientific notation and exponent composition;
- tolerance, upper/lower bounds and measurement uncertainty;
- duration-so-far for ongoing events;
- calendar/clock times, deadlines, and numeric delay offsets.

**Change policy:** this specification governs Modern Vernacular v2.5 only. It does not rewrite Formal Arcane, historical layers, performed forms, or source lexicon labels. Amend through a versioned decision with affected fixtures and explicit validation status.
