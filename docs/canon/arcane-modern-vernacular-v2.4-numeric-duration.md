# Arcane Modern Vernacular v2.4 — Numeric and Approximate Duration

**Status:** LOCKED DESIGN CANON for the bounded Modern Vernacular layer  
**Version:** 2.4  
**Depends on:** Modern Vernacular v1.0–v2.3  
**Source basis:** Mega Pack2's v5 draft lexicon records the digits `za`–`pe` and `se` (“second”) as Shared / CANON / v3.0-L. It records `wela` (“duration”) as Formal / PROPOSED / Phase 4. This specification licenses a narrow use of the existing canonical digit and second-unit forms in Modern Vernacular; it does not promote `wela` or infer a general numeral system from the digit list.  
**Validation status:** Exact-form check against the inspected v5 draft lexicon and specification-level contrast review completed. Parser execution and independent-speaker validation are not claimed.

## 1. Scope

Version 2.4 adds numeric duration for completed events, expressed only in whole seconds from one to nine, plus an approximate-duration marker:

- `nela` — ABOUT / APPROXIMATELY, when immediately before a licensed numeric duration.
- Existing digit forms are reused in the numeric slot: `ki` 1, `to` 2, `mu` 3, `re` 4, `sa` 5, `fi` 6, `du` 7, `go` 8, `pe` 9. `za` is 0.
- `se` — second, the existing Shared / CANON / v3.0-L time unit.

The inspected v5 draft lexicon contains no exact entry for `nela`. This is a bounded collision check against that file, not proof of absence from every historical Arcane source. The digit and unit forms retain their existing source labels; their licensing in the Modern Vernacular duration slot is the new design decision.

This version intentionally supports only **1–9 whole seconds**. It does not define compound numerals, decimals, fractions, minutes, hours, calendar units, rates, or conversions. Those require a verified number-composition rule and a wider unit inventory.

## 2. Construction

The duration phrase is clause-final:

**SUBJECT + don + LICENSED EVENTIVE VERB + licensed complements + [nela] + DIGIT + se**

- Without `nela`, the duration is presented as an exact whole-second value.
- With `nela`, the duration is approximate; `nela` scopes over the complete quantity-plus-unit phrase.
- The numeric duration follows all verb complements and the v2.2 qualitative duration marker is not used in the same clause.

Examples:

| Modern Vernacular | Meaning |
|---|---|
| `teshi don zir rawu ki se` | The person completed saying the word; the event lasted exactly one second. |
| `teshi don mol gisho to se` | The person completed eating the food; the event lasted exactly two seconds. |
| `teshi don mos rawu mu se` | The person completed learning the word/content in three seconds. |
| `teshi don zir rawu nela to se` | The saying event lasted about two seconds. |
| `teshi don ful tava gezi nela pe se` | The journey event lasted about nine seconds; this does not assert arrival at home. |

These examples describe event duration, not speed, difficulty, success, or the duration of a different nearby event. The event must independently satisfy its existing verb-frame and completion rules.

## 3. Licensing and scope

Numeric duration is licensed only with affirmative `don` clauses whose eventive verb is already licensed for completed aspect under v2.0, plus the v2.3 extension `seno` only when the waiting episode is complete:

- v2.0 verbs: `wish`, `nak`, `zir`, `mos`, `mol`, `tut`, `bul`, `lil`, `ful`, `zem`;
- v2.3 extension: `seno`.

For motion clauses, duration modifies the travel event. It does not assert reaching a goal. For transfer clauses, duration does not prove delivery, consent, ownership change, or any other result beyond the licensed event proposition.

The following remain blocked:
- duration with `kok`, because duration-so-far is not defined;
- duration with `nava`, because negative completion and duration scope are not defined;
- duration with modal predicates, directives, conditionals as a whole, bare nouns, or incomplete clauses;
- simultaneous use of numeric duration with `melo` or `runi`;
- more than one numeric duration phrase in a clause;
- placing `nela` after the digit or after `se`;
- use of `nela` outside a numeric duration phrase in v2.4.

A positive polar question may append `pun` after the complete duration phrase. It asks whether the whole completed-event proposition, including its duration, is true. Negative polar questions remain blocked by v2.0.

## 4. Number-slot rules

The digit tokens retain their source meanings and are interpreted as numbers only in the duration-number slot directly before `se`.

- `ki se` = one second; `to se` = two seconds; and so on through `pe se` = nine seconds.
- `za se` is rejected as an event duration: a zero-second completed event is not a useful licensed duration in this version. This does not redefine `za` outside the duration construction.
- Only one digit token is permitted. `ki to se` is not “twelve seconds” or “one plus two seconds”; no digit concatenation or arithmetic is defined here.
- The form `re` is also recorded in the source index as a Performed / CANON fusion in another stratum. In this construction, the numeric interpretation is licensed by the exact digit-plus-unit slot; it is not a global claim that the surface form `re` has only one meaning across Arcane.
- The existing shared digits are not globally reassigned as Vernacular words or general counting syntax by this specification.

## 5. Exact versus approximate

| Form | Interpretation | Limit |
|---|---|---|
| `to se` | Exactly two seconds | Whole-second value only |
| `nela to se` | Approximately two seconds | No numerical tolerance is specified |
| `melo` | Qualitatively brief duration | Not an exact quantity |
| `runi` | Qualitatively long duration | Not an exact quantity |
| `nela` without a following digit and `se` | Not licensed | Approximation scope would be unclear |

“About two seconds” does not mean “at most two seconds”, “at least two seconds”, or a mathematically bounded interval. It expresses a speaker's approximate estimate; v2.4 does not set a universal error margin.

Exact duration is a linguistic assertion, not a guarantee that the speaker measured accurately or that the physical event was possible. The language's truth conditions do not override physical/resource constraints.

## 6. Relation to waiting, event order, and endpoints

- `seno` describes waiting; numeric duration after `don seno) describes the completed waiting episode's length.
- `kavi` introduces the narrowly licensed endpoint in v2.3; it does not itself express how many seconds the wait lasted.
- `pavo` and `sula` order completed events; they do not quantify the gap between them.
- `nemi` anchors an aspect clause to the current conversational moment; it is not a duration unit or clock-time expression.
- `shasu` remains Formal / PROPOSED / Phase 4 for delay before start.
- `wela` remains Formal / PROPOSED / Phase 4 for duration; its source label is not promoted by the generator's shared mapping.

A numeric duration cannot be used to infer a start time, an endpoint time, a deadline, or the delay before an event began.

## 7. Acceptance and rejection fixtures

These fixtures are specification targets only. They have not been executed by a parser or independently tested with speakers.

| ID | Input or interpretation | Expected result |
|---|---|---|
| NUM24-01 | `teshi don zir rawu ki se` | ACCEPT; completed event asserted as exactly one second |
| NUM24-02 | `teshi don mol gisho to se` | ACCEPT; completed event asserted as exactly two seconds |
| NUM24-03 | `teshi don mos rawu mu se` | ACCEPT; completed event asserted as exactly three seconds |
| NUM24-04 | `teshi don zir rawu nela to se` | ACCEPT; approximate duration of two seconds |
| NUM24-05 | `teshi don ful tava gezi nela pe se` | ACCEPT; approximate travel-event duration, no arrival guarantee |
| NUM24-06 | `teshi don seno sa se` | ACCEPT; completed waiting episode lasted five seconds |
| NUM24-07 | `teshi kok mol gisho to se` | REJECT; duration-so-far is not defined |
| NUM24-08 | `teshi nava don mol gisho to se` | REJECT; negative completion plus duration is not defined |
| NUM24-09 | `teshi don zir rawu za se` | REJECT; zero duration blocked in this version |
| NUM24-10 | `teshi don zir rawu ki to se` | REJECT; multi-digit composition is undefined |
| NUM24-11 | `teshi don zir rawu to nela se` | REJECT; approximation marker in the wrong position |
| NUM24-12 | `teshi don zir rawu to se melo` | REJECT; numeric and qualitative duration markers cannot stack |
| NUM24-13 | `teshi don zir rawu nela` | REJECT; approximation phrase incomplete |
| NUM24-14 | `teshi fam zir rawu to se` | REJECT; modal clause not licensed for numeric duration |
| NUM24-15 | `teshi don zir rawu nela to se pun` | ACCEPT; positive polar question about the approximate-duration proposition |
| NUM24-16 | Interpret `nela to se` as “no more than two seconds” | REJECT; no upper-bound semantics |
| NUM24-17 | Interpret `to se` as proof the event was measured accurately | REJECT; linguistic exactness does not certify measurement |
| NUM24-18 | Treat `wela` as automatically Vernacular-canonical | REJECT; Formal / PROPOSED source status remains |
| NUM24-19 | Treat `re` as globally unambiguous across all Arcane strata | REJECT; meanings remain slot- and stratum-sensitive |
| NUM24-20 | Interpret travel duration as proof of arrival | REJECT; event duration does not alter motion semantics |

## 8. Future work

Version 2.4 closes only whole-second numeric and approximate duration from one to nine seconds for completed events. Still open:
- compound numbers, place value, and numeric composition;
- fractions and decimal quantities;
- minute/hour/day units and unit conversion;
- duration-so-far for ongoing events;
- approximate tolerance and explicit upper/lower bounds;
- delay offsets, deadlines, repetition intervals, and clock/calendar expressions;
- temporal relations between measured intervals.

**Change policy:** this specification governs Modern Vernacular v2.4 only. It does not rewrite Formal Arcane, historical layers, performed forms, or the source labels in the Phase 5 lexicon. Amend through a versioned decision with affected fixtures and explicit validation status.
