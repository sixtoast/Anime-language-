# Arcane Modern Vernacular v2.0 — Completion and Ongoing Aspect

**Status:** LOCKED DESIGN CANON for the bounded Modern Vernacular layer  
**Version:** 2.0  
**Depends on:** Modern Vernacular v1.0–v1.9  
**Source basis:** The Phase 5 v5 draft lexicon lists `don` (“already/done”) and `kok` (“ongoing”) as Vernacular / PROPOSED / Phase 5. This version locks a narrow modern use for these existing proposed forms; it does not change their source-record status.  
**Validation status:** Mega Pack2 lexicon cross-check and specification-level contrast review completed. Parser execution and independent-speaker validation are not claimed.

## 1. Purpose

This version adds two aspect markers to already licensed action clauses:

- **don** — completed aspect: the event is complete by the relevant reference time;
- **kok** — ongoing aspect: the event is in progress at the relevant reference time.

Aspect describes the event's relation to a reference time. It does not by itself assign a calendar date or establish past, present or future tense. In ordinary conversation, the default reference time is the current conversational time; a different reference time must be established by context. This version does not yet define a general temporal-adverb or event-sequencing system.

The source forms are not new coinages: the inspected Phase 5 lexicon already records both. Their precise placement and the bounded scope rules below are new Modern Vernacular design decisions.

## 2. Core pattern and placement

For the licensed action verbs in this specification, the pattern is:

**SUBJECT + [nava] + [ASPECT] + ACTION VERB + licensed complements**

The aspect marker immediately precedes the action verb. When `nava` is used with aspect, it precedes the aspect marker and negates the aspect-marked proposition. This is an explicit extension to the ordinary preverbal negation pattern; it must not be generalised to modal or directive constructions.

### Core examples

| Modern Vernacular | Meaning |
|---|---|
| teshi don mol gisho | The person has completed eating the food. |
| teshi kok mol gisho | The person is eating the food; the eating event is in progress. |
| teshi don zir rawu | The person has said the word; the utterance is complete. |
| teshi kok zir rawu | The person is saying the word; the utterance is in progress. |
| teshi kok ful tava gezi | The person is travelling towards home; the journey is in progress. |
| teshi don mos rawu | The person has completed learning the word/content. |
| teshi don bul li fape ka fezo | The person has completed the giving action involving the book and friend as recipient. |

The transfer example preserves the v1.2 role frame. `don` marks completion of the giving event; it does not independently certify delivery, ownership change, consent or any other real-world consequence.

## 3. Licensed verb set

To keep aspect interpretation recoverable, v2.0 licenses `don` with these eventive lexical verbs from v1.0–v1.3:

- `wish` — see;
- `nak` — hear;
- `zir` — say/utter a word;
- `mos` — learn/acquire identifiable content;
- `mol` — eat;
- `tut` — drink;
- `bul` — give;
- `lil` — take;
- `ful` — go/travel;
- `zem` — come towards the established deictic centre.

`kok` is licensed with the following bounded set of ongoing action readings:

- `zir`, `mos`, `mol`, `tut`, `bul`, `lil`, `ful`, `zem`.

The progressive use of `wish` (“see”) and `nak` (“hear”) is not licensed here, because interpreting them as “look/watch” or “listen” would add lexical readings not yet defined in the source. `shus` (“know/be familiar with”) is stative in the v1.1 frame and is not aspect-marked by this version. Modal predicates (`fam`, `kong`, `tek`, `yemi`, `zami`) are not action verbs and cannot directly take `don` or `kok`.

An aspect marker cannot make an unlicensed verb frame valid. All existing argument and role restrictions continue to apply.

## 4. Negation and aspect scope

The position of `nava` is meaningful in aspect-marked clauses:

- **SUBJECT + nava + don + VERB** — the event has not been completed by the reference time. The event may not have started, may be in progress, or may have stopped short of completion.
- **SUBJECT + nava + kok + VERB** — the event is not in progress at the reference time. This does not imply that the event never happened or will never happen.

Examples:

| Modern Vernacular | Meaning |
|---|---|
| teshi nava don mol gisho | The person has not completed eating the food by the reference time. |
| teshi nava kok mol gisho | The person is not eating the food at the reference time. |

These are not interchangeable. “Not completed” does not mean “not currently happening”, and “not currently happening” does not mean “never happened”.

The following orders are blocked:

- `teshi don nava mol gisho`;
- `teshi kok nava mol gisho`;
- any order that puts `nava` after the action verb;
- aspect combined with a modal in the same clause;
- aspect combined with a v1.7 directive marker.

The negative aspect readings above are locked only for these two patterns. They do not establish a general scope calculus for all operators.

## 5. Questions and linked clauses

A positive polar question may be formed by placing the existing `pun` at the end of an otherwise licensed aspect clause:

- `teshi don mol gisho pun` — Has the person completed eating the food?
- `teshi kok ful tava gezi pun` — Is the person travelling towards home?

The existing v1.0 limits on question words remain in force: `shuk` and `zosh` may only replace a licensed participant or item slot, and they do not acquire broad scope over a multi-clause construction. Negative polar questions with aspect remain blocked in v2.0.

An aspect-marked clause may serve as a complete clause inside the v1.8 coordination/causal patterns or the v1.9 conditional pattern, provided each clause independently obeys its verb-frame and scope rules. The linker or conditional marker does not change the aspect meaning. Nested linkers and nested conditionals remain blocked under their respective specifications.

## 6. What aspect does not mean

- `don` is not a general past-tense marker. It says the event is complete by a reference time.
- `kok` is not a general present-tense marker. It says the event is in progress at a reference time.
- Neither form specifies a date, clock time, duration, deadline, repetition interval or event order.
- `don ful tava gezi` does not by itself guarantee arrival at home; completion of a travel event is not a separate arrival assertion.
- Neither marker guarantees that a transfer succeeds or that an intended physical or magical outcome occurs.
- The source's Formal / PROPOSED Phase 4 forms `boni`, `vote`, `fuwo`, `kole`, `shasu`, `wela`, `vitu`, `showa` and `leko` are not promoted into the Vernacular by this specification.
- The Phase 5 generator's use of some Formal / PROPOSED temporal forms in a “shared” mapping is treated as an unresolved register mismatch, not approval to use those forms in ordinary Vernacular clauses.

## 7. Acceptance and rejection fixtures

These are specification-level targets, not parser or independent-speaker test results.

| ID | Input | Expected status or interpretation |
|---|---|---|
| ASP-01 | teshi don mol gisho | Licensed completed aspect |
| ASP-02 | teshi kok mol gisho | Licensed ongoing aspect |
| ASP-03 | teshi don zir rawu | Completed utterance event |
| ASP-04 | teshi kok zir rawu | Utterance event in progress |
| ASP-05 | teshi kok ful tava gezi | Journey in progress; no arrival guarantee |
| ASP-06 | teshi don mos rawu | Learning event complete by reference time |
| ASP-07 | teshi don bul li fape ka fezo | Completed giving action; transfer roles retained |
| ASP-08 | teshi nava don mol gisho | Not completed by reference time |
| ASP-09 | teshi nava kok mol gisho | Not in progress at reference time |
| ASP-10 | teshi nava don mol gisho vs teshi nava kok mol gisho | “Not completed” differs from “not ongoing” |
| ASP-11 | teshi don mol gisho pun | Licensed positive aspect question |
| ASP-12 | teshi kok ful tava gezi pun | Licensed positive ongoing question |
| ASP-13 | teshi don shus rawu | Rejected: stative `shus` excluded |
| ASP-14 | teshi kok wish fezo | Rejected: progressive “see/look” reading not specified |
| ASP-15 | teshi kok nak rawu | Rejected: progressive “hear/listen” reading not specified |
| ASP-16 | teshi kok fam ful tava gezi | Rejected: modal/aspect scope not specified |
| ASP-17 | teshi fam kok ful tava gezi | Rejected: modal/aspect scope not specified |
| ASP-18 | dema kok ful tava gezi | Rejected: directive/aspect interaction not specified |
| ASP-19 | teshi don kok mol gisho | Rejected: aspect stacking not specified |
| ASP-20 | teshi kok don mol gisho | Rejected: aspect stacking not specified |
| ASP-21 | teshi don nava mol gisho | Rejected: wrong negation/aspect order |
| ASP-22 | teshi kok nava mol gisho | Rejected: wrong negation/aspect order |
| ASP-23 | teshi nava don mol gisho pun | Rejected: negative polar aspect question remains blocked |
| ASP-24 | teshi don ful tava gezi | Does not by itself assert arrival at home |
| ASP-25 | teshi don bul li fape ka fezo | Does not guarantee successful delivery or ownership change |
| ASP-26 | navi teshi don mol gisho saku teshi yemi ful tava gezi | Aspect-marked condition clause allowed; consequence remains conditional |
| ASP-27 | teshi don mol gisho savi fezo tut losa | Aspect does not turn a reason relation into temporal sequence |
| ASP-28 | teshi don mol gisho lena fezo kok tut losa | Two clauses retain separate participants and aspect |

## 8. Locked decisions and change control

1. `don` marks completion by a reference time; `kok` marks an event in progress at a reference time.
2. The markers are drawn from Phase 5 Vernacular / PROPOSED entries; their source status is preserved.
3. Aspect follows the subject and any `nava`, immediately before the licensed action verb.
4. The licensed verb sets are closed for v2.0.
5. `nava don` means not completed by the reference time; `nava kok` means not in progress at the reference time.
6. Aspect stacking, modal/aspect combinations, directive/aspect combinations and negative polar aspect questions remain blocked.
7. No general tense, temporal adverb, duration, deadline, repetition or event-sequencing system is established.
8. No historical or Formal Arcane rule is changed.
9. If new primary-source evidence becomes available, reconcile it explicitly and preserve source/version provenance rather than silently replacing this modern design.
