# Arcane Modern Vernacular v1.5 — Permission

**Status:** LOCKED DESIGN CANON for the bounded Modern Vernacular layer  
**Version:** 1.5  
**Depends on:** Modern Vernacular v1.0–v1.4  
**Historical status:** The permission form in this document is a modern design coinage, not a recovered historical form.  
**Validation status:** Lexicon collision check and specification-level review completed; parser execution and independent-speaker validation are not claimed.

## 1. Purpose

Version 1.4 separated ability (fam), desire (kong) and practical need (tek). This version adds permission as a separate meaning. It must not be expressed by reinterpreting fam.

The v5 draft lexicon search found no exact entry for **yemi**, and no permission/allow/permit entry matching this construction. Therefore **yemi** is introduced as a new Modern Vernacular design form. This is a bounded collision check against the inspected v5 draft lexicon, not a claim that no uninspected historical document contains the form.

## 2. Locked meaning

**yemi** = be permitted or allowed to perform an action under the relevant rules, authority or circumstances.

Yemi describes the permission status of the subject. It does not itself identify who granted permission, how permission was granted, whether the permission is wise or fair, or whether the subject actually performs the action.

Use the same modal-action pattern established in v1.4:

**SUBJECT + yemi + licensed ACTION VERB + that verb's licensed complements**

The subject of yemi is also the understood subject of the action. The action verb's frame and role markers remain binding.

### Examples

| Modern Vernacular | Meaning |
|---|---|
| teshi yemi ful tava gezi | The person is permitted to go home. |
| teshi yemi wish fezo | The person is allowed to see the friend. |
| teshi yemi mol gisho | The person is permitted to eat food. |
| teshi yemi bul li fape ka fezo | The person is allowed to give the book to the friend. |
| teshi yemi ful tava gezi pun | Is the person permitted to go home? |
| shuk yemi ful tava gezi | Who is permitted to go home? |

The final example asks which person has permission, because shuk occupies the subject slot. It does not ask which authority grants permission.

## 3. Meaning boundaries

Yemi must be distinguished from the v1.4 modals:

- **fam** — the subject has ability or capacity;
- **yemi** — the subject has permission;
- **kong** — the subject desires the action;
- **tek** — the action is practically or goal-dependently needed.

These meanings can diverge in real situations. A person may be able but not permitted, permitted but unable, want to act without needing to, or need to act without wanting to. No one of these forms entails another.

Yemi does not mean:
- that the authority explicitly granted permission in a particular event;
- that the permission is permanent or irrevocable;
- that the action is legally valid in every jurisdiction;
- that the action is morally good;
- that the action will occur or succeed;
- that another person consented to an act affecting them.

Permission and consent are separate. Being allowed to perform an action does not establish another participant's consent.

## 4. Questions and scope

The existing positive polar question particle **pun** may be appended to a complete positive yemi construction. Existing in-situ subject questions may replace the subject slot in a licensed construction.

The question applies to permission status or the identity of the permitted subject, depending on the slot replaced. Yemi does not create a new question particle or alter the meanings of shuk and zosh.

## 5. Negation and combinations: blocked

Version 1.5 does not license **nava** with yemi. Negation could mean at least one of the following: permission is absent, permission is denied by an authority, a prohibition exists, or the action itself does not happen. Those meanings must not be collapsed.

The following are blocked:
- *teshi nava yemi ful tava gezi*
- *teshi yemi nava ful tava gezi*
- negative polar questions with yemi;
- stacking yemi with fam, kong or tek in a single clause;
- a separate authority/grantor argument for yemi;
- a different, unexpressed subject for the action.

Do not infer a prohibition from the absence of a yemi statement. Absence of stated permission is not, in every context, equivalent to an explicit ban.

## 6. Acceptance and rejection fixtures

These are specification targets, not parser or speaker test results.

| ID | Input | Expected interpretation/status |
|---|---|---|
| PERM-01 | teshi yemi ful tava gezi | Licensed: subject is permitted to go home |
| PERM-02 | teshi yemi wish fezo | Licensed: subject is allowed to see the friend |
| PERM-03 | teshi yemi mol gisho | Licensed: permission over a licensed action |
| PERM-04 | teshi yemi bul li fape ka fezo | Licensed: transfer roles preserved |
| PERM-05 | teshi yemi ful tava gezi pun | Licensed positive polar question |
| PERM-06 | shuk yemi ful tava gezi | Licensed subject question |
| PERM-07 | teshi fam ful tava gezi | Ability, not permission |
| PERM-08 | teshi kong ful tava gezi | Desire, not permission |
| PERM-09 | teshi tek ful tava gezi | Practical need, not permission |
| PERM-10 | teshi nava yemi ful tava gezi | Blocked: permission negation not specified |
| PERM-11 | teshi yemi nava ful tava gezi | Blocked: embedded action negation not specified |
| PERM-12 | teshi yemi fam ful tava gezi | Blocked: modal stacking not licensed |
| PERM-13 | teshi yemi ful tava gezi | Does not entail actual travel or arrival |
| PERM-14 | teshi yemi ful tava gezi | Does not identify who granted permission |
| PERM-15 | teshi yemi ful tava gezi | Does not establish another person's consent |
| PERM-16 | teshi yemi fape | Blocked: yemi requires a licensed action frame, not a bare noun |

## 7. Change control

The following decisions are locked for Modern Vernacular v1.5:

1. yemi means permission status, not ability, desire or need;
2. yemi uses the subject-controlled modal-action pattern from v1.4;
3. the action verb's licensed frame and role markers remain binding;
4. pun may question a positive yemi construction;
5. yemi does not identify a grantor or encode the event of granting permission;
6. permission does not entail execution, success, morality or consent;
7. negation, prohibition, modal stacking and separate grantor arguments remain blocked;
8. no historical or Formal Arcane rule is altered.

Newly recovered older documents, including the reported Arcana Mega Pack2 collection, should be inspected as evidence when available. If they establish a materially different historical form or construction, record that historical finding separately and decide transparently whether a modern version amendment is warranted.
