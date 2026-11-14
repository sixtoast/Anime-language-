# Arcane Modern Vernacular v2.2 — Qualitative Event Duration

**Status:** LOCKED DESIGN CANON for the bounded Modern Vernacular layer  
**Version:** 2.2  
**Depends on:** Modern Vernacular v1.0–v2.1  
**Source basis:** Mega Pack2 lists the Formal / PROPOSED / Phase 4 form `wela` for duration. The Phase 5 generator's shared mapping does not establish that this Formal proposal is approved in ordinary Vernacular. This version therefore introduces two new Modern Vernacular forms for qualitative, non-numeric duration.  
**Validation status:** Exact-form check against the inspected v5 draft lexicon and specification-level contrast review completed. Parser execution and independent-speaker validation are not claimed.

## 1. Purpose and boundary

Version 2.2 adds a limited way to characterise the duration of a completed event as short or long. It does **not** yet express exact or approximate quantities of time.

Two new modern design forms are introduced:

- **melo** — BRIEFLY / an event with short duration;
- **runi** — FOR A LONG TIME / an event with long duration.

The inspected Mega Pack2 v5 draft lexicon contains no exact entries for `melo` or `runi`. This is a bounded collision check against that file, not proof of absence from all historical Arcane sources. These forms are modern design coinages; they do not change the historical lexicon.

## 2. Construction

The licensed pattern is:

**SUBJECT + don + LICENSED EVENTIVE VERB + licensed complements + [melo | runi]**

The duration marker occurs at the end of the clause, after all licensed complements. It modifies the duration of the event described by the clause. It does not modify the subject, an object, or a separate adjacent clause.

Examples:

| Modern Vernacular | Meaning |
|---|---|
| `teshi don zir rawu melo` | The person completed saying the word; the saying event was brief. |
| `teshi don mos rawu runi` | The person completed learning the word/content; the learning event lasted a long time. |
| `teshi don mol gisho melo` | The person completed eating the food in a short-duration eating event. |
| `teshi don ful tava gezi runi` | The person completed the journey towards home; the journey lasted a long time. |

The final example describes a completed journey, not proof of arrival at home. The marker does not change the existing v1.3 motion interpretation or the v2.0 completion rule.

## 3. Scope and restrictions

- `melo` and `runi` are licensed only after an affirmative `don` clause whose verb is licensed for `don` by v2.0: `wish`, `nak`, `zir`, `mos`, `mol`, `tut`, `bul`, `lil`, `ful`, or `zem`, with its already licensed complements.
- This version does not license duration markers with `kok`. A qualitative judgement about an event's total duration is easiest to interpret once the event is complete; duration-so-far for an ongoing event is left for later work.
- Duration markers are not licensed with modal predicates, directives, condition markers as a whole, bare nouns, or incomplete clauses.
- The markers are mutually exclusive. Do not put both in one clause.
- Do not place a duration marker before the verb or between the verb and its licensed complements.
- Do not use either marker with `nava` in v2.2. “Not completed briefly” and “not completed for a long time” have multiple possible scopes and readings; those require a separate rule.
- A positive polar question may append `pun` after the duration marker, for example `teshi don zir rawu melo pun`. This asks whether the completed event was brief. Negative polar questions remain blocked under v2.0.
- The terms are qualitative, not calibrated measurements. Speakers may disagree about whether a duration counts as short or long; the grammar does not set a universal threshold.

## 4. What the markers do not mean

| Marker | Means | Does not mean |
|---|---|---|
| `melo` | The completed event had short duration | Immediately, once, quickly, easily, successfully |
| `runi` | The completed event had long duration | Always, repeatedly, slowly, with difficulty |
| `don` | The event is complete by the reference time | That it necessarily occurred in the past relative to every possible reference time |
| `melo/runi` after a motion clause | Duration of the journey event | Arrival, successful travel, or reaching the goal |

Speed and duration are distinct: an event may be short without being fast, or long without being slow. Frequency is also distinct: a long event is not necessarily repeated, and a brief event is not necessarily a one-off event. These markers do not express an exact quantity such as “for three seconds”.

## 5. Contrast with Formal proposals and temporal relations

Mega Pack2 records `wela` (“duration”) as Formal / PROPOSED / Phase 4. Version 2.2 does not promote it into the Modern Vernacular. Instead, `melo` and `runi` provide only qualitative short/long descriptions, which are deliberately narrower than a general duration expression.

The following distinctions remain binding:

- `pavo` and `sula` express event order, not event duration.
- `nemi` sets a current reference time; it does not specify how long an event lasted.
- `don` expresses completion, not duration.
- `kok` expresses an event in progress at a reference time; v2.2 does not describe duration-so-far.
- `melo` and `runi` do not specify delay before an event starts, a deadline, an endpoint, repetition interval, or cause.

## 6. Acceptance and rejection fixtures

These are specification-level targets. They have not been executed by a parser or independently tested with speakers.

| ID | Input or interpretation | Expected result |
|---|---|---|
| DUR22-01 | `teshi don zir rawu melo` | ACCEPT; completed saying event was brief |
| DUR22-02 | `teshi don mos rawu runi` | ACCEPT; completed learning event lasted a long time |
| DUR22-03 | `teshi don mol gisho melo` | ACCEPT; short-duration completed eating event |
| DUR22-04 | `teshi don ful tava gezi runi` | ACCEPT; long-duration journey event, no arrival guarantee |
| DUR22-05 | `teshi kok mol gisho melo` | REJECT; ongoing-event duration not defined |
| DUR22-06 | `teshi nava don mol gisho melo` | REJECT; duration with negative completion scope not defined |
| DUR22-07 | `teshi don melo mol gisho` | REJECT; marker is clause-final |
| DUR22-08 | `teshi don mol melo gisho` | REJECT; marker cannot split verb and complement |
| DUR22-09 | `teshi don mol gisho melo runi` | REJECT; markers are mutually exclusive |
| DUR22-10 | `teshi fam ful tava gezi runi` | REJECT; modal predicate clause is not licensed for duration |
| DUR22-11 | `teshi don shus rawu melo` | REJECT; stative `shus` is not in the v2.0 eventive aspect set |
| DUR22-12 | `teshi don zir rawu melo pun` | ACCEPT; positive polar question about brief duration |
| DUR22-13 | Interpret `melo` as “quickly” | REJECT; speed is not duration |
| DUR22-14 | Interpret `runi` as “repeatedly” | REJECT; frequency is not duration |
| DUR22-15 | Interpret `runi` as “for exactly five seconds” | REJECT; no numeric time quantity is expressed |
| DUR22-16 | Treat Formal `wela` as automatically Vernacular-canonical | REJECT; the source register/status mismatch remains unresolved |

## 7. Future temporal work

Version 2.2 closes only qualitative duration for affirmative completed events. It does not define:
- numeric or approximate durations;
- duration-so-far with `kok`;
- delay before an event starts;
- waiting;
- an event continuing until an endpoint;
- deadlines;
- repeated events or intervals between repetitions;
- temporal scope across multiple clauses.

These require separate, explicit rules. In particular, duration, waiting delay, deadline and “until” must not be treated as interchangeable.

**Change policy:** this specification governs Modern Vernacular v2.2 only. It does not rewrite Formal Arcane, historical layers, or source labels in the Phase 5 lexicon. Amend through a versioned decision with affected fixtures and explicit validation status.
