# Arcane Modern Vernacular v1.9 — Conditions, Hypotheses and Consequences

**Status:** LOCKED DESIGN CANON for the bounded Modern Vernacular layer  
**Version:** 1.9  
**Depends on:** Modern Vernacular v1.0–v1.8  
**Historical status:** The conditional markers and rules in this specification are modern design decisions unless primary-source evidence later establishes historical counterparts.  
**Validation status:** Exact-form collision check against the inspected v5 draft lexicon and specification-level review completed. Parser execution and independent-speaker validation are not claimed.

## 1. Purpose

Version 1.9 adds a small, explicitly grouped conditional construction. It distinguishes:

- a condition from an asserted fact;
- a hypothetical premise from a prediction;
- a conditional consequence from a reason or a direct inference;
- grammatical validity from truth, certainty or physical feasibility.

Three modern markers are introduced:

- **navi** — IF: introduces the condition clause;
- **saku** — THEN / under that condition: introduces the consequence clause;
- **ravi** — SUPPOSE / imagine that: introduces a hypothetical premise without asserting it as fact.

Exact-form searches of the inspected v5 draft lexicon found no entries for navi, saku or ravi. This is a bounded collision check, not proof that uninspected historical sources lack them.

## 2. Conditional form and grouping

The canonical conditional construction is:

**navi CONDITION CLAUSE saku CONSEQUENCE CLAUSE**

The navi clause is the condition; the saku clause is what follows if that condition holds. The pair forms one grouped construction. A reader must not reinterpret the first clause as an independent assertion simply because it is grammatically complete.

Example:

**navi teshi fam ful tava gezi saku teshi yemi ful tava gezi**

“If the person is able to go home, then the person is permitted to go home.”

This sentence does not assert that the person is able to go home. It also does not establish that ability is a sufficient or valid real-world basis for permission. It states a conditional relationship, whose truth and appropriateness must be assessed separately.

The markers are structural, not verb arguments. They do not alter the underlying verb frame or modal meanings.

## 3. Hypothetical premise

**ravi CLAUSE** introduces a supposition or imagined premise. In v1.9 it is licensed only as the first part of a paired construction with navi/saku omitted? No: to keep scope unambiguous, the complete pattern is:

**ravi SUPPOSED CLAUSE; navi CONDITION CLAUSE saku CONSEQUENCE CLAUSE**

The clause following ravi establishes the assumed scenario. The condition clause must explicitly state the relevant condition, even if it repeats some content from the supposed clause. The consequence is still expressed by saku.

Example:

**ravi teshi ful tava gezi; navi teshi ful tava gezi saku teshi yemi ful tava gezi**

“Suppose the person goes home; if the person goes home, then the person is permitted to go home.”

This example is logically repetitive and is included to demonstrate grouping, not to recommend redundant prose. A more useful example can place a distinct consequence in the saku clause once the premise and condition have been established. In v1.9, ravi cannot independently introduce a free-standing counterfactual, a wish, a prediction, or an unreal past. Those constructions require further grammar.

To avoid a new implicit rule, **ravi must be followed by a semicolon in written teaching notation before the complete navi…saku conditional**. The semicolon is editorial punctuation, not a spoken Arcane word. Spoken disambiguation is not yet specified.

## 4. Contrast with v1.8 causal linkers

The condition markers are not substitutes for lena, savi or doru.

| Construction | Function | What is asserted |
|---|---|---|
| CLAUSE 1 lena CLAUSE 2 | and | Both clauses are presented together; no causal relation is asserted. |
| CLAUSE 1 savi CLAUSE 2 | because | The second clause is presented as a reason for the first. |
| CLAUSE 1 doru CLAUSE 2 | therefore | The second clause is presented as a consequence of the first. |
| navi CONDITION saku CONSEQUENCE | if…then | The consequence is conditional on the premise; the condition is not asserted as actual. |
| ravi SUPPOSITION; navi CONDITION saku CONSEQUENCE | suppose…; if…then | The supposition is explicitly framed as imagined or assumed, not asserted as fact. |

A conditional is not a causal explanation. A causal explanation is not a conditional. A direct inference is not automatically a conditional. Keep those differences explicit.

## 5. Clause validity and scope

Both CONDITION and CONSEQUENCE must be independently licensed clauses under v1.0–v1.8. The markers do not rescue incomplete clauses, invent missing participants, change argument order, or override modal scope.

Within v1.9:

- positive declarative clauses are licensed in the condition and consequence slots;
- already licensed modal declaratives may be used, but their modal meanings remain unchanged;
- existing clause-local negation may occur within a clause, but no special conditional-negation interpretation is inferred;
- nested conditionals are blocked;
- conditionals containing directive clauses are blocked;
- conditionals containing pun, shuk or zosh are blocked pending explicit question scope rules;
- ravi without a following complete navi…saku pair is blocked;
- a condition cannot be placed after saku and still be interpreted as the same construction;
- multiple saku markers are blocked;
- omission of either marker is not licensed as an alternative conditional form.

The scope of negation over the entire conditional, and the difference between “if not P then Q” and “it is not the case that if P then Q”, remain unresolved. Do not collapse them into one reading.

## 6. Truth, inference and physical feasibility

A grammatically well-formed conditional does not certify:

- that the condition is true;
- that the consequence will happen;
- that the inference is logically valid under every interpretation;
- that a person has permission, ability, resources or consent;
- that an Arcane or magical operation is physically possible;
- that describing a desired outcome supplies a mechanism capable of producing it.

For example, “if the person is able to go home, then the person is permitted to go home” is a conditional claim, not a rule that ability creates permission. The language represents the proposition; it does not make the proposition true.

## 7. Acceptance and rejection fixtures

These are specification-level targets, not parser or independent-speaker test results.

| ID | Input | Expected status or interpretation |
|---|---|---|
| COND-01 | navi teshi fam ful tava gezi saku teshi yemi ful tava gezi | Licensed conditional; condition not asserted |
| COND-02 | navi teshi wish fezo saku fezo nak rawu | Licensed conditional with two valid clauses |
| COND-03 | ravi teshi ful tava gezi; navi teshi ful tava gezi saku teshi yemi ful tava gezi | Licensed but pragmatically redundant illustration of hypothetical grouping |
| COND-04 | teshi fam ful tava gezi doru teshi yemi ful tava gezi | Causal/inferential claim, not equivalent to COND-01 |
| COND-05 | teshi wish fezo savi fezo nak rawu | Reason relation, not a conditional |
| COND-06 | navi teshi wish saku fezo nak rawu | Rejected: incomplete clause frames |
| COND-07 | navi teshi fam ful tava gezi | Rejected: missing saku consequence |
| COND-08 | saku teshi yemi ful tava gezi | Rejected: consequence marker has no preceding condition |
| COND-09 | ravi teshi ful tava gezi | Rejected: no paired navi…saku construction |
| COND-10 | navi teshi fam ful tava gezi saku teshi yemi ful tava gezi saku fezo nak rawu | Rejected: repeated saku / grouping unresolved |
| COND-11 | navi navi teshi fam ful tava gezi saku teshi yemi ful tava gezi saku teshi wish fezo | Rejected: nested conditionals blocked |
| COND-12 | navi dema ful tava gezi saku teshi yemi ful tava gezi | Rejected: directive conditionals blocked |
| COND-13 | navi teshi wish fezo pun saku fezo nak rawu | Rejected: question in conditional slot blocked |
| COND-14 | navi teshi nava fam ful tava gezi saku teshi yemi ful tava gezi | Clause-local negation permitted; conditional remains an unasserted relation, no broader negation scope |
| COND-15 | navi teshi fam ful tava gezi saku teshi nava yemi ful tava gezi | Clause-local negation permitted; no inference that condition negates consequence |
| COND-16 | navi teshi fam ful tava gezi saku teshi yemi ful tava gezi | Does not assert ability or permission as actual facts |
| COND-17 | navi teshi fam ful tava gezi saku teshi yemi ful tava gezi | Does not make ability a cause or sufficient basis for permission |
| COND-18 | ravi teshi ful tava gezi; navi teshi ful tava gezi saku teshi yemi ful tava gezi | Written semicolon required in teaching notation to mark the supposition boundary |
| COND-19 | navi teshi fam ful tava gezi saku | Rejected: missing consequence clause |
| COND-20 | navi teshi fam ful tava gezi lena saku teshi yemi ful tava gezi | Rejected: do not insert clause linker inside the conditional frame without a separate grouping rule |
| COND-21 | navi teshi fam ful tava gezi saku teshi yemi ful tava gezi lena fezo nak rawu | Rejected: external coordination with a complete conditional not specified |
| COND-22 | navi teshi fam ful tava gezi saku teshi yemi ful tava gezi pun | Rejected: polar-question scope over whole conditional unresolved |

## 8. Locked decisions and change control

1. navi introduces a condition.
2. saku introduces the consequence dependent on that condition.
3. ravi introduces an assumed scenario and must be paired with an explicitly marked navi…saku conditional.
4. The condition is not asserted as fact merely by being stated.
5. Conditional, causal and inferential relations remain distinct.
6. Condition and consequence clauses must each be independently licensed.
7. Nested conditionals, directive conditionals, conditional questions and ambiguous global negation remain blocked.
8. These are modern design decisions, not historical or Formal Arcane claims.
9. If older sources become accessible, compare actual evidence and retain source/version provenance rather than silently replacing these forms.
