# Arcane Modern Vernacular v1.4 — Modality and Intention

**Status:** LOCKED DESIGN CANON for the bounded Modern Vernacular layer  
**Version:** 1.4  
**Depends on:** Modern Vernacular v1.0 locked core; v1.1 core verb expansion; v1.2 transfer and recipients; v1.3 motion and routes  
**Historical status:** This is a modern design decision, not a claim that the forms or rules were present in an older Arcane stage.  
**Validation status:** Specification-level review only. No parser execution or independent-speaker validation is claimed.

## 1. Purpose and scope

This version makes four frequently needed meanings expressible without conflating them:

- **fam** — ability or capacity: can, be able to;
- **kong** — desire: want;
- **tek** — practical or goal-dependent need: need to;
- **permission** — deliberately not expressed by fam, kong or tek in this version.

The v5 draft lexicon records fam, kong and tek as proposed Vernacular verbs glossed “can”, “want” and “need”. That source status is preserved. This specification locks their bounded modern use; it does not retroactively promote the older entries to historically attested canon.

## 2. Core modal construction

For an action or event reading, use:

**SUBJECT + MODAL + ACTION VERB + that verb's licensed complements**

The subject of the modal is also the understood subject of the action verb. This is a subject-controlled construction; it does not license a different, unexpressed actor inside the action.

| Form | Locked meaning | Semantic test |
|---|---|---|
| fam | have the ability/capacity to do the action | Is the subject capable or in a position to perform it? |
| kong | want/desire to do the action | Does the subject desire the action? |
| tek | need the action for a practical goal or requirement | Is the action needed, rather than merely desired? |

The modal comes immediately after the subject. The action verb keeps its own established frame and complements. No tense, aspect, completion, success or future guarantee is added by the modal itself.

### Positive examples

| Modern Vernacular | Meaning |
|---|---|
| teshi fam wish fezo | The person can see the friend. |
| teshi kong wish fezo | The person wants to see the friend. |
| teshi tek wish fezo | The person needs to see the friend. |
| teshi fam ful tava gezi | The person is able to go home. |
| teshi kong ful tava gezi | The person wants to go home. |
| teshi tek ful tava gezi | The person needs to go home. |
| teshi fam nak rawu | The person can hear the sound. |
| teshi kong mol gisho | The person wants to eat food. |
| fezo tek tut losa | The friend needs to drink water. |
| teshi fam bul li fape ka fezo | The person is able to give the book to the friend. |

These examples are constructed from the licensed verb frames in v1.0–v1.3. The last example retains the transfer roles; fam does not change who gives, what is transferred or who receives it.

## 3. Nominal complements for kong and tek

Kong and tek may also take a noun phrase as their direct complement:

- **teshi kong fape** — The person wants a book.
- **teshi tek losa** — The person needs water.
- **teshi kong fezo** — The person wants the friend.
- **teshi tek fape** — The person needs a book.

This is a bounded modern distinction based on the complement: a noun phrase is the desired/needed entity; a following licensed action verb begins an action reading. This does not make every noun a valid complement of every verb, nor does it establish a general clause-embedding system.

**fam does not take a bare noun phrase** in v1.4. The capacity reading requires an action frame, for example *teshi fam ful tava gezi*. Do not use *teshi fam fape* to mean “the person can [use/have/read] a book”; the action has not been specified.

## 4. Questions

The existing positive polar question particle **pun** may be appended to a complete positive modal construction:

- **teshi fam ful tava gezi pun** — Can the person go home?
- **teshi kong wish fezo pun** — Does the person want to see the friend?
- **teshi tek mol gisho pun** — Does the person need to eat food?
- **teshi kong fape pun** — Does the person want a book?

Existing in-situ information questions may replace the subject or an argument in an otherwise licensed frame:

- **shuk fam wish fezo** — Who can see the friend?
- **teshi kong wish zosh** — What does the person want to see?
- **shuk tek ful tava gezi** — Who needs to go home?

The scope of these questions is the modal construction as a whole. Do not use shuk or zosh to ask which modal meaning applies; the three modal forms are lexical choices, not interchangeable question slots.

## 5. Negation and scope: deliberately blocked

Version 1.4 does **not** license nava inside or around modal constructions. The placement and scope would otherwise be ambiguous between at least:

- the subject lacks ability;
- the subject does not want the action;
- the subject does not need the action;
- the action itself does not occur.

Therefore, these are blocked for now:

- *teshi nava fam ful tava gezi*
- *teshi fam nava ful tava gezi*
- *teshi kong nava wish fezo*
- *teshi tek nava mol gisho*
- modal construction + pun with nava

Do not improvise a negative modal by moving nava to another position. This restriction is intentional and local to v1.4; it does not alter the locked simple negation rules for non-modal clauses.

## 6. Meaning boundaries

### fam is ability, not permission

Fam reports ability/capacity or practical capability. It does not mean that an authority has granted permission. “The person can go home” under this rule means the person is able to go, not necessarily allowed to go.

### kong is desire, not intention guaranteed to happen

Kong states a desire. It does not promise a plan, commitment, attempt or eventual action. A person may want to go home and never go.

### tek is practical need, not automatically law or morality

Tek states that an action or entity is needed relative to a practical goal, condition or requirement. It does not by itself encode legal duty, moral obligation, coercion, urgency or objective necessity independent of context.

### Modal statements do not assert completion

“Can go”, “wants to go” and “needs to go” do not entail that the person goes, arrives, succeeds or completes the event. The motion verb zem also retains its v1.3 rule: coming towards the deictic centre does not guarantee arrival.

## 7. Licensed complement inventory

In v1.4, the modal action construction may precede these already specified action frames:

- perception: wish;
- hearing, utterance, familiarity, learning, eating and drinking: nak, zir, shus, mos, mol, tut;
- transfer: bul, lil with the v1.2 transfer roles;
- motion: ful, zem with the v1.3 motion roles.

The action verb's own frame remains binding. A modal cannot repair a missing role, license an otherwise blocked argument, or make an unclear sentence valid. If the underlying action frame is not licensed, its modal version is not licensed either.

For kong and tek, the nominal-complement option is additionally licensed as defined in section 3. Fam has no nominal-complement option.

## 8. Acceptance and rejection fixtures

The following are specification-level acceptance targets, not reported parser or speaker test results.

| ID | Input | Expected interpretation/status |
|---|---|---|
| MOD-01 | teshi fam wish fezo | Positive ability modal; licensed |
| MOD-02 | teshi kong wish fezo | Positive desire modal; licensed |
| MOD-03 | teshi tek wish fezo | Positive practical-need modal; licensed |
| MOD-04 | teshi fam ful tava gezi | Ability over a licensed motion frame |
| MOD-05 | teshi kong ful tava gezi | Desire over a licensed motion frame |
| MOD-06 | teshi tek ful tava gezi | Need over a licensed motion frame |
| MOD-07 | teshi kong fape | Desire for an entity; licensed |
| MOD-08 | teshi tek losa | Need for an entity; licensed |
| MOD-09 | teshi fam fape | Blocked: fam cannot take a bare noun phrase |
| MOD-10 | teshi fam ful tava gezi pun | Positive polar question over modal construction |
| MOD-11 | shuk fam wish fezo | Subject question over modal construction |
| MOD-12 | teshi kong wish zosh | Object question within licensed action frame |
| MOD-13 | teshi nava fam ful tava gezi | Blocked: modal negation scope not specified |
| MOD-14 | teshi fam nava ful tava gezi | Blocked: embedded action negation not specified |
| MOD-15 | teshi kong nava wish fezo | Blocked: desire vs action negation unresolved |
| MOD-16 | teshi fam wish fezo | Does not entail that seeing actually occurs |
| MOD-17 | teshi kong ful tava gezi | Does not entail an actual journey or arrival |
| MOD-18 | teshi fam ful tava gezi | Does not mean the journey is permitted |
| MOD-19 | teshi tek ful tava gezi | Does not automatically mean legal/moral obligation |
| MOD-20 | teshi fam bul li fape ka fezo | Ability over transfer frame; transfer roles preserved |

## 9. Decisions not made

This specification does not define:

- a permission auxiliary or permission particle;
- negative modality or the scope of nava with modals;
- obligation, prohibition, advice, likelihood, uncertainty, prediction or counterfactuals;
- modal constructions with a different embedded subject;
- unrestricted propositional complements such as “know that P”, “say that P” or “want that P”;
- infinitive morphology, tense, aspect or mood inflection;
- a universal word-order rule for every Arcane verb;
- any changes to Formal Arcane operators, historical stages or performed Arcana.

These meanings remain blocked rather than being translated with an approximate modal.

## 10. Lock and change control

The following are locked for Modern Vernacular v1.4:

1. fam = ability/capacity, not permission;
2. kong = desire, not guaranteed intention or action;
3. tek = practical/goal-dependent need, not automatic moral or legal obligation;
4. modal construction order is SUBJECT + MODAL + licensed action frame;
5. modal subject controls the action subject;
6. kong and tek may take bounded noun-phrase complements; fam may not;
7. pun can question a positive modal construction;
8. nava with modals is blocked until negation scope is specified;
9. the action verb's own valency and role particles remain in force;
10. historical and Formal Arcane records are unchanged.

Reopen only with relevant primary-source evidence, a reproducible grammar/teaching failure, a demonstrated internal contradiction, or an explicit owner-requested versioned redesign. Older documents discovered later should be recorded as evidence and reconciled transparently; they do not silently rewrite this modern design layer.
