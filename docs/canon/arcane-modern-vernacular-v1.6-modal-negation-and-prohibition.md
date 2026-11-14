# Arcane Modern Vernacular v1.6 — Modal Negation and Prohibition

**Status:** LOCKED DESIGN CANON for the bounded Modern Vernacular layer  
**Version:** 1.6  
**Depends on:** Modern Vernacular v1.0–v1.5  
**Historical status:** The scope rules in this document are new modern design decisions. The prohibition form introduced here is a modern coinage, not a recovered historical form.  
**Validation status:** Lexicon collision check and specification-level review completed; parser execution and independent-speaker validation are not claimed.

## 1. Purpose

Versions 1.4 and 1.5 established four distinct modal meanings:

- fam — ability/capacity;
- kong — desire;
- tek — practical or goal-dependent need;
- yemi — permission status.

This version defines two different placements of the existing negator nava in modal constructions, and adds a separate form for explicit prohibition. The goal is to make scope recoverable from word order rather than inferred from English translations.

## 2. Modal scope: two positions, two meanings

The ordinary positive modal pattern remains:

**SUBJECT + MODAL + ACTION VERB + licensed complements**

In this construction, nava has two licensed positions:

1. **Before the modal:** SUBJECT + nava + MODAL + ACTION  
   The modal proposition is negated.
2. **After the modal, immediately before the action verb:** SUBJECT + MODAL + nava + ACTION  
   The action is negated within the modal's scope.

These positions are not interchangeable. Nava remains a clause negator, but in a modal construction its position identifies the scope targeted by the construction.

### Contrastive examples

| Modern Vernacular | Meaning |
|---|---|
| teshi nava fam ful tava gezi | The person is not able to go home. |
| teshi fam nava ful tava gezi | The person is able to not go home / is capable of staying away from going home. |
| teshi nava kong wish fezo | The person does not want to see the friend. |
| teshi kong nava wish fezo | The person wants not to see the friend. |
| teshi nava tek mol gisho | The person does not need to eat food. |
| teshi tek nava mol gisho | The person needs not to eat food; the need concerns refraining from eating. |
| teshi nava yemi ful tava gezi | The person is not permitted to go home. |
| teshi yemi nava ful tava gezi | The person is permitted not to go home; permission concerns refraining from the action. |

The English paraphrases are explanatory, not additional Arcane rules. In particular, “not able to go” is not the same as “able not to go”; “does not want to see” is not the same as “wants not to see”; and “not permitted to go” is not the same as “permitted not to go”.

## 3. Prohibition: zami

The v5 draft lexicon search found no exact **zami** entry. **zami** is therefore introduced as a modern design coinage for **explicit prohibition: be forbidden or prohibited from performing an action**. This is a bounded collision check against the inspected lexicon, not proof that no uninspected historical document contains the form.

Prohibition pattern:

**SUBJECT + zami + licensed ACTION VERB + licensed complements**

Examples:

- **teshi zami ful tava gezi** — The person is forbidden to go home.
- **teshi zami mol gisho** — The person is forbidden to eat food.
- **teshi zami wish fezo** — The person is forbidden to see the friend.
- **teshi zami ful tava gezi pun** — Is the person forbidden to go home?
- **shuk zami ful tava gezi** — Who is forbidden to go home?

Zami states that a prohibition applies to the subject's action. It does not identify who imposed it, whether the prohibition is legally enforceable, whether it is fair, or whether the subject obeys it. It does not by itself mean “cannot”; a person may be physically able to do something that is forbidden.

## 4. Do not collapse absence of permission and prohibition

The following are distinct:

- **teshi nava yemi ful tava gezi** — The person is not permitted to go home.
- **teshi zami ful tava gezi** — The person is explicitly forbidden to go home.
- **teshi nava fam ful tava gezi** — The person is unable to go home.
- **teshi fam nava ful tava gezi** — The person is able to refrain from going home.

A statement that permission is absent does not automatically encode an explicit ban. A prohibition does not entail physical inability. These distinctions are binding.

## 5. Questions

Append **pun** to a complete modal or prohibition construction to ask a positive or negative polar question about the whole construction:

- teshi nava fam ful tava gezi pun — Is the person unable to go home?
- teshi fam nava ful tava gezi pun — Is the person able to refrain from going home?
- teshi nava yemi ful tava gezi pun — Is the person not permitted to go home?
- teshi zami ful tava gezi pun — Is the person forbidden to go home?

The question particle does not change the negation's scope. Subject questions using shuk are allowed in the subject slot. Questions about the authority imposing a prohibition, or the source of a permission decision, remain unavailable in this version.

## 6. Restrictions

The following are blocked in v1.6:

- stacking two modals in one clause, such as *teshi nava fam yemi ful tava gezi*;
- negating zami with nava, such as *teshi nava zami ful tava gezi*;
- combining zami and yemi in one clause;
- using zami with a bare noun phrase rather than a licensed action frame;
- using a different, unexpressed subject for the action;
- treating nava as a prohibition marker in non-modal clauses;
- inferring a grantor, authority, legal status, consent, morality, obedience or successful action from these forms;
- using this scope pattern to change the rules for Formal Arcane or historical language stages.

The two nava positions are licensed only in the Modern Vernacular modal construction. They do not create a universal rule for all Arcane clauses.

## 7. Acceptance and rejection fixtures

These are specification targets, not parser or independent-speaker test results.

| ID | Input | Expected status or meaning |
|---|---|---|
| SCOPE-01 | teshi nava fam ful tava gezi | Licensed: modal negation, not able |
| SCOPE-02 | teshi fam nava ful tava gezi | Licensed: action negation under ability |
| SCOPE-03 | teshi nava kong wish fezo | Licensed: does not want to see |
| SCOPE-04 | teshi kong nava wish fezo | Licensed: wants not to see |
| SCOPE-05 | teshi nava tek mol gisho | Licensed: does not need to eat |
| SCOPE-06 | teshi tek nava mol gisho | Licensed: need concerns refraining from eating |
| SCOPE-07 | teshi nava yemi ful tava gezi | Licensed: not permitted |
| SCOPE-08 | teshi yemi nava ful tava gezi | Licensed: permitted not to act |
| SCOPE-09 | teshi zami ful tava gezi | Licensed: explicit prohibition |
| SCOPE-10 | teshi nava yemi ful tava gezi vs teshi zami ful tava gezi | Different meanings; not synonyms |
| SCOPE-11 | teshi nava fam ful tava gezi pun | Licensed polar question; scope preserved |
| SCOPE-12 | teshi zami ful tava gezi pun | Licensed polar question over prohibition |
| SCOPE-13 | teshi nava zami ful tava gezi | Blocked: negated prohibition not specified |
| SCOPE-14 | teshi nava fam yemi ful tava gezi | Blocked: modal stacking |
| SCOPE-15 | teshi zami fape | Blocked: prohibition requires an action frame |
| SCOPE-16 | teshi zami ful tava gezi | Does not entail physical inability or actual obedience |
| SCOPE-17 | teshi nava yemi ful tava gezi | Does not identify a grantor or establish explicit prohibition |
| SCOPE-18 | teshi fam nava ful tava gezi | Does not mean the person is unable to go |

## 8. Change control

Locked decisions for Modern Vernacular v1.6:

1. nava before the modal negates the modal proposition;
2. nava immediately before the action verb negates the action within modal scope;
3. zami means explicit prohibition and is distinct from yemi negation and fam negation;
4. pun may question a complete modal/prohibition construction without changing scope;
5. modal stacking, negated zami and zami+yemi combinations remain blocked;
6. action-frame roles and existing particles remain binding;
7. these are modern design decisions and do not alter historical or Formal Arcane.

If Arcana Mega Pack2 or another old source later establishes relevant historical scope rules or an existing prohibition form, record that evidence separately and reconcile it transparently. Do not erase the historical record or silently substitute it for this modern version.
