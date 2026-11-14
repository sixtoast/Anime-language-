# Arcane Modern Vernacular v1.0 — Locked Core Grammar

**Status:** LOCKED DESIGN CANON for Modern Vernacular v1.0  
**Effective date:** 2026-10-15  
**Authority:** This file governs the bounded Modern Vernacular core below. It does not rewrite Formal Arcane or historical stages.  
**Historical claim:** These are deliberate modern design decisions, not recovered historical facts.

## 1. Purpose and change policy

The project has accumulated too many repeated provisional proposals. This file converts the smallest useful, internally consistent Vernacular subset into binding rules. “Locked” means binding within Modern Vernacular v1.0 and the limits below; it does not mean the grammar has already been validated by a large speaker community.

A locked rule changes only through a versioned amendment identifying new evidence or a demonstrated failure, affected examples, and regression tests. Research documents cannot silently reopen it.

## 2. Locked scope

In scope:
- simple affirmative clauses with two overt participants and the verb wish (“see”);
- reversal of those two participants;
- participant-slot information questions using shuk (“who”) and zosh (“what”);
- simple polar questions using pun;
- simple clause negation using the new particle nava;
- standalone responses wang (“yes”), kor (“no”), and gep (“maybe”).

Blocked until separately specified:
- other verbs’ argument frames, omitted arguments and pronouns;
- negation with modality, aspect, embedding, quantifiers, focus, commands or double negation;
- negative questions and their answer convention;
- information questions combined with pun;
- event/proposition complements of wish;
- temporal/spatial adjunct syntax and general adposition attachment;
- claims about historical Vernacular syntax.

## 3. Locked lexical entries

| Form | Meaning | Rule |
|---|---|---|
| teshi | person | Participant expression |
| fezo | friend | Participant expression |
| wish | see | Two-participant perception predicate, limited to this core |
| shuk | who | Replaces the questioned participant in slot A |
| zosh | what | Replaces the questioned participant in slot B |
| pun | yes/no question particle | Clause-final in simple polar questions |
| nava | not; clause negator | New designed Modern Vernacular form; preverbal |
| wang | yes | Standalone response only |
| kor | no | Standalone response only; never a clause negator in v1.0 |
| gep | maybe | Standalone response only |

These entries are binding only within this v1.0 core. This does not promote every entry in the v5 draft lexicon to unrestricted canon.

## 4. Locked clause rules

### V1-01 — affirmative simple clause

**Pattern:** PARTICIPANT-A + wish + PARTICIPANT-B

**Interpretation:** A is the perceiver; B is the perceived entity.

- teshi wish fezo — “The person sees the friend.”
- fezo wish teshi — “The friend sees the person.”

Reversing the participants reverses their roles. This rule applies only to the specified two-participant wish frame; it does not establish universal SVO order for every Arcane verb.

### V1-02 — information questions

Use in-situ slot replacement; do not move the question word to clause-initial position.

- shuk wish fezo — “Who sees the friend?”
- teshi wish zosh — “What does the person see?”

shuk asks for the first-slot perceiver. zosh asks for the entity in the second slot. These are questions, not assertions that the event is happening. The answer can be unknown even when the grammatical slot is clear.

### V1-03 — simple yes/no questions

Append pun to the affirmative clause:

- teshi wish fezo pun — “Does the person see the friend?”

pun is restricted to this simple polar-question construction. Do not combine it with shuk or zosh questions until a later amendment defines the construction.

### V1-04 — simple clause negation

**Pattern:** PARTICIPANT-A + nava + wish + PARTICIPANT-B

- teshi nava wish fezo — “The person does not see the friend.”
- fezo nava wish teshi — “The friend does not see the person.”

nava negates the simple seeing proposition expressed by the whole bounded A wish B clause. It does not mean “cannot”, “must not”, “may not”, “does not know”, “does not always”, or “says that not-P”. Those meanings are not licensed by this rule.

nava is a deliberate modern design coinage, not a historical or source-attested form. The inspected v5 lexicon contains no exact nava entry. The form is chosen as a distinct two-syllable particle to avoid reusing Formal GRASH/GRAK or response kor. This is a project design decision, not a claim that every phonotactic detail has been independently validated.

### V1-05 — negative polar questions

Negative polar questions are BLOCKED in v1.0. Do not append pun to a nava clause or infer a negative-question answer convention from wang or kor.

### V1-06 — standalone responses

- wang = “yes”
- kor = “no”
- gep = “maybe”

These are standalone responses. kor does not negate a predicate or clause. Since response words do not encode the proposition themselves, interpretation depends on the question and context; negative questions are blocked to avoid polarity ambiguity.

## 5. Formal Arcane boundary

Formal GRAK (historical/compatibility form) and preferred GRASH remain Formal NOT operator forms. They are not synonyms for Modern Vernacular nava in syntax and cannot be substituted into the surface patterns above. Formal operator behaviour remains governed by its own specification.

The distinction is locked:
- kor: standalone response “no”;
- nava: clause negator in the narrow Modern Vernacular construction;
- GRASH/GRAK: Formal operator family.

## 6. Locked contrast set

| ID | Form | Required reading | Status |
|---|---|---|---|
| LVC-01 | teshi wish fezo | Person sees friend | LOCKED |
| LVC-02 | fezo wish teshi | Friend sees person | LOCKED |
| LVC-03 | shuk wish fezo | Who sees friend? | LOCKED |
| LVC-04 | teshi wish zosh | What does person see? | LOCKED |
| LVC-05 | teshi wish fezo pun | Does person see friend? | LOCKED |
| LVC-06 | teshi nava wish fezo | Person does not see friend | LOCKED |
| LVC-07 | fezo nava wish teshi | Friend does not see person | LOCKED |
| LVC-08 | teshi nava wish fezo pun | Negative polar question | BLOCKED |
| LVC-09 | shuk wish fezo pun | Information question plus polar particle | BLOCKED |
| LVC-10 | teshi nava fam wish fezo | Negation plus ability/modal frame | BLOCKED |
| LVC-11 | teshi nava wish zosh | What does person not see? | BLOCKED pending question-negation scope |
| LVC-12 | kor wish fezo | Clause negation using response “no” | REJECTED |

## 7. Acceptance checks

A conforming v1.0 teaching unit or future parser must satisfy these conceptual checks. This file does not claim a parser has been implemented or speaker testing performed.

1. Reversing A and B reverses perceiver and perceived participant.
2. shuk occupies slot A; zosh occupies slot B.
3. pun marks only the supported simple polar question.
4. nava appears immediately before wish in the simple clause template.
5. nava means proposition negation only within this template.
6. kor cannot be parsed as the clause negator.
7. nava cannot be interpreted as inability, prohibition, uncertainty or quantifier negation.
8. Negative polar questions and question-plus-negation scope combinations are rejected as blocked, not guessed.
9. No rule is generalised to another verb without a verb-frame specification.
10. Formal GRASH/GRAK forms are not silently substituted for Vernacular nava.

## 8. Amendment policy

Any later change must include a unique decision ID and target version; a specific failure, new primary source or explicit owner decision; old and new rules side by side; a collision and register audit for new forms; positive, negative, contrast and rejection examples; and regression updates to the decision ledger and affected teaching documents.

Without that amendment record, this core remains locked. Older research files remain historical and are superseded wherever they conflict with this specification.

## 9. Decision record

- **Lock ID:** MV1-LOCKED-CORE-01
- **Version:** Modern Vernacular v1.0
- **Locked grammar:** bounded wish clause, in-situ participant questions, simple pun questions, simple preverbal nava negation
- **New designed lexeme:** nava = simple clause negator; modern only, not historical
- **Canon distinction:** Modern Vernacular design canon only; Formal and historical strata unchanged
- **Implementation/test status:** grammar decision is locked; parser and speaker validation remain future work
