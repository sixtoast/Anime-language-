# Arcane Modern Vernacular v2.3 — Waiting and Until

**Status:** LOCKED DESIGN CANON for the bounded Modern Vernacular layer  
**Version:** 2.3  
**Depends on:** Modern Vernacular v1.0–v2.2  
**Source basis:** Mega Pack2 lists `kole` (“until”) and `shasu` (“delay; offset before start”) as Formal / PROPOSED / Phase 4. The Phase 5 generator's shared-word mapping does not resolve those register labels. This version introduces a Modern Vernacular waiting verb and a bounded endpoint connector rather than silently promoting the Formal proposals.  
**Validation status:** Exact-form check against the inspected v5 draft lexicon and specification-level contrast review completed. Parser execution and independent-speaker validation are not claimed.

## 1. Scope

Version 2.3 adds:
- **seno** — WAIT / remain in a waiting state;
- **kavi** — UNTIL / marks an endpoint event that bounds the waiting state.

These are modern design coinages. The inspected Mega Pack2 v5 draft lexicon contains no exact entries for `seno` or `kavi`; this is a bounded check against that file, not proof of absence from all historical Arcane sources.

This version does **not** yet express a measurable delay before an event begins. Delay needs a reference/baseline and an offset, and neither is defined by simply adding a word meaning “later”. The Formal proposal `shasu` remains Formal / PROPOSED.

## 2. Waiting verb: seno

`seno` is an eventive verb meaning “wait; remain in a waiting state”. It takes no direct object in v2.3. A person who is waiting for an event can specify that event using the endpoint construction in section 3; do not append an arbitrary noun phrase to `seno`.

The v2.0 aspect system is explicitly extended to `seno`:
- `SUBJECT kok seno` — the subject is waiting at the reference time;
- `SUBJECT don seno` — the waiting episode is complete by the reference time;
- `SUBJECT nava kok seno` — the subject is not waiting at the reference time;
- `SUBJECT nava don seno` — the waiting episode has not been completed by the reference time.

Examples:

| Modern Vernacular | Meaning |
|---|---|
| `teshi kok seno` | The person is waiting. |
| `teshi don seno` | The person's waiting episode is complete. |
| `teshi nava kok seno` | The person is not waiting at the reference time. |
| `nemi teshi kok seno` | The person is waiting right now. |
| `teshi don seno melo` | The completed waiting episode was brief. |
| `teshi don seno runi` | The completed waiting episode lasted a long time. |

Because v2.0's licensed verb set was deliberately bounded, this is an explicit v2.3 extension, not an assumption that every newly coined verb automatically accepts aspect. The v2.2 qualitative duration rules are extended to `seno` only for affirmative completed `don seno` clauses.

## 3. Until: a bounded waiting construction

### 3.1 Form

The only construction licensed in v2.3 is:

**WAITING CLAUSE + kavi + ENDPOINT CLAUSE**

More specifically:

**SUBJECT kok seno kavi ENDPOINT-SUBJECT don zem**

The left clause must be an ongoing waiting clause with `kok seno`. The right clause must be an independently licensed completed coming-event clause with `don zem`. Both clauses must use their ordinary v1.0–v2.2 participant and aspect rules.

Example:

`teshi kok seno kavi fezo don zem`

Meaning: “The person waits until the friend has completed coming (has arrived at the established deictic centre).”

For this construction only, the endpoint interpretation of `zem` is fixed to completion of the coming event at the established deictic centre. It is not a general change to every use of `zem`. If the context has no recoverable deictic centre, the endpoint clause is not licensed.

### 3.2 Assertion and temporal meaning

The endpoint clause is asserted, not merely hoped for or imagined. The speaker commits to the friend completing the coming event, and to the waiting state continuing up to that endpoint. Do not use this construction to imply that the endpoint happened if it is uncertain.

The construction does not state:
- how long the person waits;
- when the waiting began;
- that the waiting caused the friend to come;
- that the person remains waiting after the endpoint;
- that the person meets, sees, welcomes, or communicates with the friend;
- that the endpoint occurs at a specified clock time.

### 3.3 Restrictions

- Only `kok seno kavi … don zem` is licensed in v2.3.
- The waiting clause must precede `kavi`; reverse order is blocked.
- The endpoint must be a completed `zem` event; other endpoint verbs are not licensed yet.
- `kavi` cannot be used with a modal, directive, conditional, question word, or a bare noun phrase in place of either clause.
- Nested `kavi` constructions and multi-endpoint chains are blocked.
- Do not combine `kavi` with `pavo` or `sula` in the same construction.
- A positive polar question may append `pun` to the entire construction, but it asks whether the whole waiting-until-endpoint proposition is true. Negative polar questions remain blocked under the existing aspect rules.

## 4. Delay is not waiting or until

The source-listed Formal proposal `shasu` means “delay (offset before start)”. That concept is not interchangeable with either `seno` or `kavi`:
- **waiting** describes a subject's state or activity;
- **until** identifies an endpoint bounding that waiting state;
- **delay** requires a baseline or expected start and a positive offset before the target event begins.

Version 2.3 does not coin a delay marker because the language has not yet specified how a baseline is established or how an offset is represented. A new word without those rules would be ambiguous: it could mean “late”, “wait”, “postpone”, “after”, or “start at a later time”. The Formal `shasu` remains Formal / PROPOSED / Phase 4, and no Modern Vernacular promotion is made.

## 5. Contrast with related rules

| Form | Meaning | Not equivalent to |
|---|---|---|
| `seno` | A subject waits | A delay necessarily occurs; an endpoint is guaranteed |
| `kavi` | In the licensed construction, waiting continues until a completed coming event | Because, after, deadline, a clock time |
| `pavo` | One completed event precedes another | Waiting until an event |
| `sula` | One completed event follows another | Until; causal consequence |
| `melo` / `runi` | Qualitative duration of a completed event | Numeric duration or delay offset |
| `shasu` | Formal proposed delay/offset-before-start concept | Modern Vernacular canon |
| `kole` | Formal proposed “until” | Modern Vernacular canon |

## 6. Acceptance and rejection fixtures

These fixtures are design targets only; they have not been executed by a parser or tested with independent speakers.

| ID | Input or interpretation | Expected result |
|---|---|---|
| WTU23-01 | `teshi kok seno` | ACCEPT; waiting is ongoing |
| WTU23-02 | `teshi don seno` | ACCEPT; waiting episode complete |
| WTU23-03 | `teshi nava kok seno` | ACCEPT; not waiting at reference time |
| WTU23-04 | `nemi teshi kok seno` | ACCEPT; waiting now |
| WTU23-05 | `teshi kok seno kavi fezo don zem` | ACCEPT; wait until friend completes coming |
| WTU23-06 | `teshi kok seno kavi fezo kok zem` | REJECT; endpoint must be completed |
| WTU23-07 | `teshi kok seno kavi fezo don mol gisho` | REJECT; endpoint verb not licensed |
| WTU23-08 | `fezo don zem kavi teshi kok seno` | REJECT; reversed order |
| WTU23-09 | `teshi seno` | REJECT in v2.3 clause grammar; explicit aspect required for this newly licensed verb |
| WTU23-10 | `teshi kok seno kavi` | REJECT; endpoint clause missing |
| WTU23-11 | `teshi kok seno kavi fezo` | REJECT; endpoint aspect and verb missing |
| WTU23-12 | Interpret `kavi` as “because” | REJECT; endpoint is temporal, not causal |
| WTU23-13 | Interpret `teshi kok seno kavi fezo don zem` as proof that the two meet | REJECT; no meeting or communication entailment |
| WTU23-14 | Interpret `seno` as proof that a delay occurred | REJECT; waiting and delayed start are distinct |
| WTU23-15 | Use Formal `shasu` as automatically Vernacular-canonical | REJECT; source register/status mismatch remains |
| WTU23-16 | Use `kavi` to express a numeric deadline | REJECT; no deadline or clock-time grammar is defined |
| WTU23-17 | `teshi kok seno kavi fezo don zem pun` | ACCEPT; positive polar question about the complete proposition |
| WTU23-18 | Three clauses chained with multiple `kavi` markers | REJECT; nested/multiple endpoints blocked |

## 7. Future work

Version 2.3 closes one waiting verb and one highly restricted endpoint construction. It does not establish a general endpoint system or a general delay operator. Later work may extend endpoints to other event types only after each verb's completion semantics and participant frame are stated.

Remaining temporal work includes:
- baseline and offset syntax for delay;
- numeric and approximate duration;
- deadlines and required completion times;
- repetition and intervals between repetitions;
- event chains and simultaneous/overlapping events;
- future reference times and prediction.

**Change policy:** this specification governs Modern Vernacular v2.3 only. It does not rewrite Formal Arcane, historical layers, or the source labels in the Phase 5 lexicon. Amend through a versioned decision with affected fixtures and explicit validation status.
