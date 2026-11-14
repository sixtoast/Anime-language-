# Arcane Modern Vernacular v2.1 — Temporal Anchor and Event Order

**Status:** LOCKED DESIGN CANON for the bounded Modern Vernacular layer  
**Version:** 2.1  
**Depends on:** Modern Vernacular v1.0–v2.0  
**Source basis:** The Mega Pack2 Phase 5 lexicon lists `don` and `kok` as Vernacular / PROPOSED. It lists `boni` (now), `vote` (before) and `fuwo` (after) as Formal / PROPOSED / Phase 4. Phase 5's generator nevertheless places those Formal forms in a shared-word mapping. This specification deliberately does not promote them into ordinary Vernacular. It introduces three new modern forms after an exact-form check against the indexed v5 draft lexicon.  
**Validation status:** Exact-form check against the inspected v5 draft lexicon and specification-level contrast review completed. Parser execution and independent-speaker validation are not claimed.

## 1. Purpose and limits

Version 2.1 adds a small temporal layer while keeping four meanings separate:

1. **Temporal anchor:** the reference time at which an aspect-marked event is evaluated.
2. **Aspect:** whether the event is complete by that reference time (`don`) or in progress at it (`kok`).
3. **Event order:** whether one event precedes or follows another.
4. **Cause or condition:** why an event occurs, or under what condition it occurs; these remain the separate v1.8 and v1.9 systems.

This is not a general tense system. It does not define calendar dates, clock times, duration, deadlines, waiting offsets, habitual repetition, prediction, counterfactuals, or a complete account of simultaneous events.

The new forms are modern design coinages, not claims about historical Arcane:

- **nemi** — NOW / explicit current-time anchor;
- **pavo** — BEFORE / the first event precedes the second;
- **sula** — AFTER / the first event follows the second.

The inspected v5 lexicon contains no exact entries for `nemi`, `pavo` or `sula`. This is a bounded collision check, not proof that every uninspected historical source lacks them. They are deliberately distinct from the Phase 4 Formal proposals `boni`, `vote` and `fuwo`.

## 2. Explicit current-time anchor: nemi

### 2.1 Form

`nemi` appears at the beginning of a single clause:

**nemi + SUBJECT + [nava] + ASPECT + ACTION VERB + licensed complements**

In v2.1, `nemi` is licensed only with a v2.0 aspect-marked action clause. It sets the reference time to the current conversational moment. The aspect marker then tells the reader how the event relates to that reference time.

Examples:

| Modern Vernacular | Meaning |
|---|---|
| `nemi teshi don mol gisho` | As of now, the person has completed eating the food. |
| `nemi teshi kok mol gisho` | Right now, the person is eating the food; the eating event is in progress. |
| `nemi teshi nava don mol gisho` | As of now, the person has not completed eating the food. |
| `nemi teshi nava kok mol gisho` | Right now, the person is not eating the food. |

The two negative examples preserve the v2.0 distinction: “not completed by now” does not entail “not happening now”, and “not happening now” does not entail “never happened”.

### 2.2 Restrictions

- `nemi` does not replace `don` or `kok`; it supplies their explicit reference time.
- `nemi` does not mean “immediately”, “soon”, “always”, or “at a particular clock time”.
- `nemi` with an unmarked verb is blocked in v2.1, because that would require an additional rule for how an unmarked event is temporally interpreted.
- `nemi` cannot occur inside the same clause after `nava`, an aspect marker, the verb, or a complement.
- Do not repeat `nemi` in one clause.
- Questions may append `pun` to the complete clause: `nemi teshi kok mol gisho pun` — “Is the person eating the food right now?”
- Negative polar questions remain blocked under v2.0.

## 3. Ordering two completed events

### 3.1 Construction

The two temporal relation markers connect two independently licensed, aspect-marked completed-event clauses:

**CLAUSE A + pavo + CLAUSE B** — event A precedes event B.  
**CLAUSE A + sula + CLAUSE B** — event A follows event B.

For v2.1, each clause must contain `don` before a licensed eventive verb from v2.0. The relation is between the two event intervals: A must finish no later than B begins for `pavo`; for `sula`, A must begin no earlier than B finishes. If the events overlap, the construction is not licensed. This deliberately conservative restriction avoids silently inventing rules for overlapping or ongoing events.

Examples:

| Modern Vernacular | Meaning |
|---|---|
| `teshi don mol gisho pavo teshi don tut losa` | The person completed eating the food before completing drinking the water. |
| `teshi don tut losa sula teshi don mol gisho` | The person completed drinking the water after completing eating the food. |
| `teshi don zir rawu pavo fezo don nak rawu` | The person completed saying the word before the friend completed hearing the word. |

The last example is only a temporal ordering claim. It does not guarantee that the friend heard correctly, understood the word, or was caused to act by it. Completion of saying is not proof of successful communication.

### 3.2 Truth and event commitment

Unlike the v1.9 `navi … saku` conditional, the two clauses joined by `pavo` or `sula` are asserted as actual event claims. The speaker commits to both event clauses and to the stated ordering. If either event did not occur, or their order is unknown, the speaker must not use this construction as though the order were established.

### 3.3 Restrictions

- Each side must be a complete clause licensed by v1.0–v2.0, and each must use `don` with a licensed eventive verb.
- A bare noun, a fragment, a modal-only clause, a directive, or a conditional construction cannot occupy either side.
- `kok` clauses are not licensed in this version's ordering construction.
- Nested temporal relations and three-or-more-clause event chains are blocked. Use a separate sentence for each pair until a later version defines grouping and scope.
- `pavo` and `sula` cannot be combined with one another in a single relation.
- `pavo` and `sula` do not mean “because”, “therefore”, “if”, “then”, “while”, or “until”.
- These markers do not state duration, a deadline, a waiting period, a repetition interval, or the amount of time between events.

## 4. Separation from existing constructions

| Form | Function | Not equivalent to |
|---|---|---|
| `don` | Event complete by reference time | Past tense, event order, guaranteed real-world success |
| `kok` | Event in progress at reference time | Present tense in every context, habitual action |
| `nemi` | Explicitly anchors a licensed aspect clause to now | Immediately, soon, clock time |
| `pavo` | First completed event precedes second completed event | Because, before a deadline, an earlier prediction |
| `sula` | First completed event follows second completed event | Therefore, a causal result |
| `navi … saku` | Conditional relation | Actual event sequence |
| `savi` / `doru` | Cause / consequence link | Mere temporal precedence |

The Phase 5 generator's use of Formal `boni`, `vote` and `fuwo` in its shared-word mapping is retained as a source-history fact. It is not taken as sufficient evidence to make those forms Vernacular canon. The Formal entries retain their source status: PROPOSED / Phase 4.

## 5. Blocked examples and why

| Form or interpretation | Status | Reason |
|---|---|---|
| `nemi teshi mol gisho` | BLOCKED | `nemi` requires an explicit v2.0 aspect marker in this version. |
| `teshi don mol gisho pavo teshi kok tut losa` | BLOCKED | The second clause is ongoing, not a completed event under the v2.1 ordering rule. |
| `teshi don mol gisho pavo` | BLOCKED | Missing second clause. |
| `teshi don mol gisho pavo teshi don tut losa pavo fezo don nak rawu` | BLOCKED | Three-clause chaining has no grouping rule yet. |
| `teshi don mol gisho sula teshi don tut losa` read as “eating caused drinking” | BLOCKED INTERPRETATION | `sula` marks temporal order only, not causation. |
| `nemi teshi don mol gisho` read as “the person ate yesterday” | BLOCKED INTERPRETATION | `nemi` fixes the reference time to now, not an unspecified past time. |

## 6. Acceptance fixtures

These fixtures define expected decisions for future teaching and parser work. They have not been executed by a parser and have not been independently tested with speakers.

| ID | Input or claim | Expected result |
|---|---|---|
| TV21-01 | `nemi teshi don mol gisho` | ACCEPT; completed by current reference time |
| TV21-02 | `nemi teshi kok mol gisho` | ACCEPT; in progress at current reference time |
| TV21-03 | `nemi teshi nava don mol gisho` | ACCEPT; not completed by now |
| TV21-04 | `nemi teshi nava kok mol gisho` | ACCEPT; not in progress now |
| TV21-05 | `nemi teshi mol gisho` | REJECT; aspect missing |
| TV21-06 | `teshi don mol gisho pavo teshi don tut losa` | ACCEPT; first completed event precedes second |
| TV21-07 | `teshi don tut losa sula teshi don mol gisho` | ACCEPT; first event follows second |
| TV21-08 | `teshi don mol gisho pavo teshi kok tut losa` | REJECT; ongoing event not licensed in ordered pair |
| TV21-09 | `teshi don mol gisho pavo` | REJECT; missing second clause |
| TV21-10 | `teshi don mol gisho pavo teshi don tut losa pavo fezo don nak rawu` | REJECT; unlicensed three-clause chain |
| TV21-11 | Interpret `pavo` as “because” | REJECT; temporal and causal relations remain distinct |
| TV21-12 | Interpret `sula` as “therefore” | REJECT; temporal and consequence relations remain distinct |
| TV21-13 | Use Formal `vote` as if automatically Vernacular-canonical | REJECT; source register/status mismatch remains unresolved |
| TV21-14 | Use `nemi` to mean “at a specific clock time” | REJECT; no clock-time syntax is defined |
| TV21-15 | Append `pun` to `nemi teshi kok mol gisho` | ACCEPT; positive polar question |
| TV21-16 | Add `kok` and `don` to the same event clause | REJECT under v2.0; aspect stacking blocked |

## 7. Scope and future work

Version 2.1 closes only an explicit current-time anchor and a binary ordering relation for completed events. It does not close the full temporal work package. Separate later decisions are required for:
- calendar and clock-time expressions;
- past/future reference times;
- duration, start delay, deadlines and “until”;
- repetition and habituality;
- prediction and counterfactual time;
- simultaneous or overlapping events;
- chains and nested temporal relations;
- temporal adjunct placement in unmarked clauses.

**Change policy:** this specification governs Modern Vernacular v2.1. It does not alter Formal Arcane, performed forms, historical layers, or the source labels in the Phase 5 lexicon. Amend only through a versioned decision with affected fixtures and explicit validation status.
