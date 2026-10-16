# Arcane Modern Vernacular v1.2 — Transfer, Giving and Taking

**Status:** LOCKED DESIGN CANON for Modern Vernacular v1.2  
**Date:** 2026-10-16  
**Authority:** Extends v1.0 and v1.1. Does not rewrite Formal Arcane or historical stages.  
**Historical claim:** The rules and frames here are new modern design decisions, not claims of historical recovery.  
**Validation status:** Contrast fixtures are specified; parser and independent speaker testing have not been run.

## 1. Purpose

This amendment gives Arcane a bounded way to talk about giving, taking and receiving. These verbs need roles that the two-participant template cannot safely encode. The v1.2 design therefore introduces explicit relational particles instead of silently guessing which participant is the recipient or source.

## 2. Locked transfer roles

| Particle | Role | Meaning in transfer clauses |
|---|---|---|
| ka | RECIPIENT | The participant who receives the transferred item |
| du | SOURCE | The participant from whom the item is taken or transferred |
| li | TRANSFERRED ITEM | Marks the item being given/taken when role ambiguity would otherwise arise |

These are new modern design forms, not historically attested forms. Their use is restricted to the constructions in this specification. They do not establish general case marking for all Arcane clauses.

### Why particles rather than a new word order?

The existing Modern Vernacular core uses A–verb–B for a closed set of two-participant predicates. Transfer events have three semantic roles. Adding a third bare noun would make its role depend on a guessed order; using short role particles makes each relationship visible and keeps the established order stable.

## 3. Transfer predicate frames

### T-01 — give

**Pattern:** GIVER + bul + li ITEM + ka RECIPIENT

- teshi bul li fape ka fezo — The person gives the book to the friend.
- fezo bul li gisho ka teshi — The friend gives the food to the person.

The giver is the subject-like first participant. The item follows li; the recipient follows ka. The recipient particle belongs immediately before its noun phrase. Do not use an unmarked third noun as a recipient.

### T-02 — take

**Pattern:** TAKER + lil + li ITEM + du SOURCE

- teshi lil li fape du fezo — The person takes the book from the friend.
- fezo lil li gisho du teshi — The friend takes the food from the person.

The taker is the first participant. du marks the source. This frame does not by itself say whether the taking was permitted, resisted, temporary or completed.

### T-03 — receive

For a usable modern contrast with give/take, bul also permits a recipient-centred construction only when the source is explicitly marked:

**Pattern:** RECIPIENT + bul + li ITEM + du SOURCE

- fezo bul li fape du teshi — The friend receives the book from the person.

This is a deliberate polysemy/frame alternation for v1.2: bul means “give” in the giver-first frame and “receive” in the recipient-first frame. The role particles disambiguate the transfer direction. Do not infer this reading from word order alone without the required role particle.

## 4. Role order and interpretation

- The first participant is the event anchor: giver, taker or recipient, according to the licensed frame.
- li introduces the transferred item.
- ka marks the recipient in the give frame.
- du marks the source in take and receive frames.
- The particles are not optional in the three-role constructions in this specification.
- A role particle marks semantic role; it does not guarantee physical success, legal permission, ownership transfer or the recipient's awareness.

## 5. Negation and polar questions

The existing nava and pun rules extend to these three licensed transfer frames.

- teshi nava bul li fape ka fezo — The person does not give the book to the friend.
- teshi bul li fape ka fezo pun — Does the person give the book to the friend?
- teshi nava lil li fape du fezo — The person does not take the book from the friend.
- fezo bul li fape du teshi pun — Does the friend receive the book from the person?

nava negates the whole simple transfer proposition expressed by the licensed frame. It does not mean “cannot give”, “is forbidden to give”, “fails to deliver”, or “does not own”. Those meanings remain distinct and are not licensed by this amendment.

## 6. Information questions

For this amendment, the existing slot-question words shuk and zosh can replace only the first participant and the transferred-item slot.

- shuk bul li fape ka fezo — Who gives the book to the friend?
- teshi bul li zosh ka fezo — What does the person give to the friend?
- shuk lil li fape du fezo — Who takes the book from the friend?

Questions asking “to whom?”, “from whom?”, or questions combining multiple unknown roles are BLOCKED in v1.2. The particles ka and du are not question words and do not independently specify a question strategy.

## 7. Contrast and rejection fixtures

| ID | Form | Expected status/meaning |
|---|---|---|
| TR-01 | teshi bul li fape ka fezo | Person gives book to friend |
| TR-02 | fezo bul li fape du teshi | Friend receives book from person |
| TR-03 | teshi lil li fape du fezo | Person takes book from friend |
| TR-04 | teshi bul fape fezo | BLOCKED: item/recipient roles unmarked |
| TR-05 | teshi bul li fape ka fezo pun | Polar question over give proposition |
| TR-06 | teshi nava bul li fape ka fezo | Negated give proposition |
| TR-07 | teshi bul li zosh ka fezo | What does the person give to the friend? |
| TR-08 | teshi bul li fape ka shuk | BLOCKED: recipient-question strategy not defined |
| TR-09 | teshi bul li fape du fezo | BLOCKED in giver frame: source particle cannot silently replace recipient |
| TR-10 | teshi lil li fape ka fezo | BLOCKED: take frame requires source, not recipient |
| TR-11 | teshi nava bul li fape ka fezo pun | BLOCKED: negative polar question remains unsupported |
| TR-12 | teshi bul li fape ka fezo nava | BLOCKED: clause-final negation not licensed |

## 8. Compatibility and limits

This extension leaves v1.0/v1.1 constructions unchanged. ka, du and li are only licensed in the transfer patterns above; they are not yet general-purpose adpositions or universal case markers. Do not use them for motion goals, locations, instruments, beneficiaries or possession without a separate specification.

This extension describes intended transfer-event roles. It does not encode tense, aspect, successful delivery, ownership change, permission, consent, or moral judgement. Those are separate meanings.

## 9. Decision record

- **Lock ID:** MV1.2-TRANSFER-01
- **Version:** Modern Vernacular v1.2
- **New forms:** ka RECIPIENT, du SOURCE, li TRANSFERRED ITEM
- **Verb frames:** bul giver-first, bul recipient-first with explicit source, lil taker-first with explicit source
- **Blocked:** recipient/source questions, unrestricted particle use, negative polar questions, unstated transfer roles
- **Canon effect:** new modern design canon; historical stages unchanged
