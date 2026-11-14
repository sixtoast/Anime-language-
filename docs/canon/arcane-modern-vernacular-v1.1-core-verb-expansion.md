# Arcane Modern Vernacular v1.1 — Core Verb Expansion

**Status:** LOCKED DESIGN CANON as an extension to Modern Vernacular v1.0  
**Date:** 2026-10-16  
**Authority:** Extends, but does not silently rewrite, [v1.0 Locked Core Grammar](arcane-modern-vernacular-v1.0-locked-core.md). Where this file is silent, v1.0 remains authoritative.  
**Historical claim:** All new frame decisions below are deliberate modern design choices, not recovered historical syntax.  
**Testing status:** Specification-level contrast suite authored; no parser or independent speaker test is claimed.

## 1. Goal

The v1.0 grammar could express only a narrow set of seeing clauses. This amendment expands the language to a small set of everyday predicates while preserving the already locked role order, question construction and simple negation. It does not try to solve every verb frame at once.

## 2. The v1.1 transitive frame rule

**PARTICIPANT-A + VERB + PARTICIPANT-B**

- A is the first/core participant specified for that verb.
- B is the second/core participant specified for that verb.
- The order is fixed in this v1.1 construction; do not reverse participants to express the same roles.
- A different role order requires an explicitly licensed construction, not guesswork.
- This is a Modern Vernacular design rule for the listed verbs, not a claim that all Arcane registers or all verbs share universal SVO.

## 3. Newly locked verb frames

The lexical forms appear in the v5 draft lexicon as proposed Vernacular verbs. Their original status is preserved as historical source metadata; their use below is now authorised by modern design canon.

| Verb | Narrow v1.1 meaning | Participant A | Participant B | Explicitly not established |
|---|---|---|---|---|
| nak | hear an audible entity/utterance | HEARER | AUDITORY THEME, such as a word or voice | Understanding, belief, reported content, hearing that a proposition is true |
| zir | say/utter a word or message-token | SPEAKER | UTTERANCE/MESSAGE | Addressee marking, quotation syntax, embedded propositions, truth or successful communication |
| shus | know/be familiar with an entity or item of information | KNOWER | KNOWN ITEM | Knowing a person vs knowing that a proposition is true remains unresolved; use entity/item readings only |
| mos | learn/acquire a word or identifiable item of content | LEARNER | ACQUIRED CONTENT | Skill complements, source/teacher marking, proof that the learner mastered or retained the content |
| mol | eat a food item | EATER | FOOD | Unexpressed object, result state, habitual/generic readings |
| tut | drink a liquid | DRINKER | LIQUID | Unexpressed object, result state, habitual/generic readings |

These are intentionally narrow semantic frames. For example, the v1.1 frame for zir licenses uttering a word/message item; it does not license a complete “say that P” embedded proposition. The frame for shus licenses knowing/familiarity with an item, not an unrestricted propositional knowledge construction.

## 4. Canonical example set

Examples below are binding Modern Vernacular v1.1 teaching forms under the narrow readings specified above.

| ID | Form | Meaning |
|---|---|---|
| V11-01 | teshi nak rawu | The person hears a word. |
| V11-02 | fezo nak rawu | The friend hears a word. |
| V11-03 | teshi zir rawu | The person says/utters a word. |
| V11-04 | fezo zir rawu | The friend says/utters a word. |
| V11-05 | teshi shus rawu | The person knows/is familiar with a word. |
| V11-06 | fezo mos rawu | The friend learns/acquires a word. |
| V11-07 | teshi mol gisho | The person eats food. |
| V11-08 | fezo tut losa | The friend drinks water. |

The English definite articles are natural-language renderings; this amendment does not establish an Arcane definite article. These clauses do not encode tense, aspect, habituality, evidential certainty, politeness or omitted participants.

## 5. Existing operators extended to this closed verb list

For the six verbs in Section 3 only, v1.0's bounded question and negation rules extend as follows.

### 5.1 Simple polar question

Append pun to a positive clause:

- teshi nak rawu pun — Does the person hear a word?
- teshi zir rawu pun — Does the person say a word?
- teshi mol gisho pun — Does the person eat food?

### 5.2 Simple clause negation

Place nava immediately before the verb:

- teshi nava nak rawu — The person does not hear a word.
- teshi nava zir rawu — The person does not say a word.
- teshi nava mol gisho — The person does not eat food.

Within this closed list, nava negates the simple proposition. It still does not express inability, prohibition, uncertainty, quantifier scope, focus, habitual negation or embedded negation.

### 5.3 Information questions

Use the existing in-situ slot replacement:

- shuk nak rawu — Who hears a word?
- teshi zir zosh — What does the person say?
- teshi mol zosh — What does the person eat?

These patterns are licensed only where the question word replaces the corresponding participant/item slot. This does not settle questions about manner, location, time, reason, addressee or embedded propositions.

### 5.4 Explicit limits

The following remain blocked:
- fam, kong, and tek constructions where modality, desire or necessity takes an event/proposition;
- three-participant bul (give), pup (teach) and recipient/beneficiary constructions;
- ful and zem motion clauses requiring source, goal, path or deictic-centre encoding;
- las with a task/event complement;
- shem with a person/event/duration/deadline complement;
- event/proposition complements of wish, nak, shus, zir or mos;
- aspect, tense, plural marking, articles, pronoun omission and unrestricted adpositions.

A blocked reading is not a claim that Arcane can never express it. It means no surface construction has yet been locked.

## 6. Contrast and rejection suite

| ID | Input | Expected interpretation/status |
|---|---|---|
| V11-T01 | teshi nak rawu | Person is hearer; word is auditory theme |
| V11-T02 | rawu nak teshi | Not an equivalent reversal; do not use to mean “the word hears the person” in ordinary intended semantics |
| V11-T03 | teshi zir rawu | Person is speaker; word/message is uttered |
| V11-T04 | teshi zir fezo | Narrow frame would mean person utters the friend; intended “says to the friend” is BLOCKED |
| V11-T05 | teshi shus rawu | Familiarity/knowledge of a word/item |
| V11-T06 | teshi shus | Missing B; BLOCKED in the core transitive frame |
| V11-T07 | teshi mol gisho | Person eats food |
| V11-T08 | teshi nava mol gisho | Person does not eat food |
| V11-T09 | teshi mol gisho pun | Simple polar question |
| V11-T10 | teshi nava mol gisho pun | Negative polar question; BLOCKED |
| V11-T11 | teshi mos rawu | Person learns/acquires a word |
| V11-T12 | teshi mos fezo | “Learns the friend” not licensed by the narrow content frame |
| V11-T13 | teshi bul gisho fezo | Three-place giving; BLOCKED, because recipient encoding is not yet defined |
| V11-T14 | teshi fam ful gezi | Ability/modal plus motion/goal; BLOCKED |
| V11-T15 | teshi zir zosh | Person says what?; information question in B slot |
| V11-T16 | shuk zir rawu | Who says/utters a word?; information question in A slot |

## 7. Why these choices fit together

1. **Role recovery:** a stable A–verb–B template gives the learner one predictable order for this closed set.
2. **Semantic restraint:** each verb has a narrow second-participant type; a gloss alone is not treated as permission for every English complement.
3. **Compositional consistency:** the existing nava, pun, shuk and zosh rules extend without inventing new syntax for every verb.
4. **No hidden morphology:** role is expressed by the locked slot order, not by an unrecorded case ending.
5. **No false historical claims:** the source lexicon remains marked as proposed; modern design canon is the authority for these frames.
6. **No automatic causation:** saying, hearing, knowing, learning, eating and drinking describe language/experience events, not guaranteed physical or epistemic consequences beyond the stated narrow meanings.

## 8. Amendment and regression policy

The six verb frames are locked for Modern Vernacular v1.1 within the limits above. A future amendment must:
- state which frame failed or which primary source contradicts it;
- distinguish a lexical change from a syntactic change;
- update all positive, reversed, question, negation and blocked examples for the affected verb;
- preserve the v1.0 core as a stable compatibility baseline;
- never promote a blocked frame simply because an English translation is easy to imagine.

## 9. Decision record

- **Lock ID:** MV1.1-CORE-VERB-EXPANSION-01
- **Version:** Modern Vernacular v1.1
- **Newly locked verbs:** nak, zir, shus, mos, mol, tut
- **Rule extended:** A + verb + B; pun, nava, shuk, zosh apply only to this closed list
- **Not included:** motion, modal/event complements, transfer/recipient, teaching roles, aspect and temporal syntax
- **Canon effect:** new modern design canon; historical source statuses unchanged
