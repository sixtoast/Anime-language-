# Arcane Modern Vernacular v1.3 — Bounded Motion and Routes

**Status:** LOCKED DESIGN CANON for Modern Vernacular v1.3  
**Date:** 2026-10-16  
**Authority:** Extends v1.0–v1.2 without rewriting historical or Formal Arcane.  
**Historical claim:** New modern design decisions, not historical recovery.  
**Validation status:** Contrast suite specified; parser and independent speaker tests not run.

## 1. Purpose

This amendment makes simple movement clauses usable without confusing a destination, a source and a route. It defines only the motion verbs ful (“go”) and zem (“come”) and three new relational particles. It does not turn the particles into general-purpose adpositions.

## 2. New locked motion particles

| Form | Role | Meaning |
|---|---|---|
| tava | GOAL | the place toward which the mover travels |
| dava | SOURCE | the place from which the mover departs |
| yara | ROUTE | the place/way along which the mover travels |

These are newly designed Modern Vernacular forms. The inspected v5 lexicon had no exact entries for tava, dava or yara. The spellings were selected to be distinct from the inspected Formal spatial relations JO/JUR/JA and from the transfer-only particles ka/du/li. They are restricted to the motion frames in this amendment.

## 3. Locked motion frame

A simple motion clause begins with the mover and motion verb. Any expressed spatial role is a relational phrase consisting of its particle followed by a place expression.

**Pattern:** MOVER + MOTION VERB + [tava GOAL] + [dava SOURCE] + [yara ROUTE]

The bracketed phrases are optional individually, but a bare motion clause only says that movement occurs; it does not specify where from, where to or along which route. In this v1.3 frame, use at most one phrase of each role. Repeated goals, sources or routes are blocked pending coordination rules.

Examples:
- teshi ful tava gezi — The person goes to the home.
- teshi ful dava gezi — The person goes from the home.
- teshi ful yara gezi — The person travels along/by way of the home.
- teshi ful dava gezi tava fape — BLOCKED: a destination must be a place expression; fape is a book, not a place in the locked learner lexicon.
- fezo ful — The friend goes/travels; no source or destination is specified.

The source and goal may both be present:
- teshi ful dava gezi tava rawu — BLOCKED: rawu (“word”) is not a place expression in the locked core.
- teshi ful dava gezi tava gezi — Grammatically well-formed role marking but semantically contradictory/degenerate in the ordinary reading; avoid as a teaching example unless a special route or return reading is explicitly supplied.

A location word is not automatically a destination merely because it follows the verb. It must be introduced by the appropriate particle.

## 4. The deictic distinction between ful and zem

- ful means “go/travel”, without intrinsically asserting that the mover approaches the speaker.
- zem means “come”, with movement directed toward the current conversational/deictic centre.
- The deictic centre is the speaker's contextually relevant location unless the discourse explicitly establishes another centre.
- zem does not by itself mean “arrive successfully”; it describes motion directed toward the centre.
- tava can specify a destination for either verb, but when zem and tava occur together, the goal must be compatible with the established deictic centre. If the two conflict and no shifted centre has been introduced, the combination is semantically infelicitous.

Examples:
- teshi zem — The person comes (toward the current deictic centre).
- teshi zem tava gezi — The person comes to the home, with the home serving as the current or contextually shifted deictic goal.
- teshi ful tava gezi — The person goes to the home; no speaker-oriented direction is entailed.

## 5. Negation and polar questions

The existing simple nava and pun rules extend to these bounded motion clauses.

- teshi nava ful tava gezi — The person does not go to the home.
- teshi ful tava gezi pun — Does the person go to the home?
- teshi nava zem — The person does not come toward the deictic centre.
- teshi zem pun — Does the person come?

nava negates the simple motion proposition. It does not mean “cannot go”, “is forbidden to go”, “fails to arrive”, or “does not intend to go”. Those readings require separate constructions.

## 6. Information questions

The existing in-situ question strategy licenses questions about the mover only:
- shuk ful tava gezi — Who goes to the home?
- shuk zem — Who comes?

Questions asking “where to?”, “from where?”, “by which route?” and multiple spatial-role questions are blocked in v1.3. The new particles are role markers, not question words. The lexicon does not yet provide a locked Modern Vernacular location question word.

## 7. Contrast and rejection fixtures

| ID | Form | Expected reading/status |
|---|---|---|
| MO-01 | teshi ful tava gezi | Person goes to home |
| MO-02 | teshi ful dava gezi | Person goes from home |
| MO-03 | teshi ful yara gezi | Person travels along/by way of home |
| MO-04 | teshi ful | Motion, source and goal unspecified |
| MO-05 | teshi zem | Person comes toward deictic centre |
| MO-06 | teshi nava ful tava gezi | Negated go-to proposition |
| MO-07 | teshi ful tava gezi pun | Positive polar question |
| MO-08 | shuk ful tava gezi | Who goes to the home? |
| MO-09 | teshi ful gezi | BLOCKED as a goal reading: unmarked place phrase cannot be inferred as destination |
| MO-10 | teshi ful tava fape | BLOCKED: book is not a place expression in the locked learner lexicon |
| MO-11 | teshi nava ful tava gezi pun | BLOCKED: negative polar questions remain unsupported |
| MO-12 | teshi ful tava gezi tava fezo | BLOCKED: duplicate goal without coordination/goal-list syntax |
| MO-13 | teshi zem tava gezi | Accept only when the home is compatible with the current or shifted deictic centre |
| MO-14 | teshi zem tava fape | BLOCKED: destination role requires a place expression |

## 8. Compatibility and limits

The v1.3 motion particles do not replace or reinterpret Formal JO (“toward”), JUR (“away”) or JA (“along”). Those remain Formal spatial relations with their own unresolved composition rules. Likewise, tava/dava/yara are not substitutes for the transfer-only ka/du/li particles.

This specification does not encode speed, manner, vehicle, force, exact trajectory, arrival, completion, permission, intention, tense or aspect. It does not establish general syntax for location, residence or spatial relations outside the two motion verbs.

## 9. Decision record

- **Lock ID:** MV1.3-MOTION-01
- **Version:** Modern Vernacular v1.3
- **Verbs:** ful, zem
- **New forms:** tava GOAL, dava SOURCE, yara ROUTE
- **Bounded extension:** nava, pun, shuk for simple motion clauses
- **Blocked:** spatial-role questions, multiple same-role phrases, unmarked destination readings, aspect/tense/manner and general adposition use
- **Canon effect:** new modern design canon; historical and Formal strata unchanged
