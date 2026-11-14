# Arcane Modern Vernacular v1.8 — Clause Coordination and Causal Links

**Status:** LOCKED DESIGN CANON for the bounded Modern Vernacular layer  
**Version:** 1.8  
**Depends on:** Modern Vernacular v1.0–v1.7  
**Historical status:** The connective forms and clause-linking rules in this specification are modern design decisions unless primary-source evidence later establishes historical counterparts.  
**Validation status:** Exact-form collision check against the inspected v5 draft lexicon and specification-level review completed. Parser execution and independent-speaker validation are not claimed.

## 1. Purpose and scope

Modern Vernacular v1.8 permits speakers to join two complete, independently licensed clauses. It introduces three clause linkers:

- **lena** — and; coordinate two clauses without asserting a causal relation;
- **savi** — because; the clause after savi gives the reason for the preceding clause;
- **doru** — therefore/as a result; the clause before doru is presented as a reason or basis for the clause after it.

Exact-form searches of the inspected v5 draft lexicon found no entries for lena, savi or doru. This is a bounded collision check, not proof that uninspected sources contain no such forms.

This version does not introduce general subordination, conditionals, reported speech, relative clauses, or a universal theory of discourse coherence.

## 2. The clause boundary rule

Each side of a linker must be a complete clause licensed by an existing Modern Vernacular specification. The linker connects those clauses; it does not alter the argument structure of either clause.

**Coordination pattern:**

CLAUSE 1 + lena + CLAUSE 2

**Reason pattern:**

CLAUSE 1 + savi + REASON CLAUSE

**Consequence pattern:**

BASIS CLAUSE + doru + CONSEQUENCE CLAUSE

The relation of savi and doru is intentionally directional. With savi, the second clause explains why the first holds or occurs. With doru, the second clause is presented as following from the first. Do not infer that the relation is objectively true merely because the speaker marks it that way.

For written examples, a comma may be used for readability before or after a linker, but punctuation is not a required spoken token and is not a substitute for the linker.

## 3. Examples

The examples use already licensed Modern Vernacular clauses.

| Form | Intended reading |
|---|---|
| teshi wish fezo lena fezo nak rawu | The person sees the friend, and the friend hears the sound. |
| teshi wish fezo savi fezo nak rawu | The person sees the friend because the friend hears the sound. |
| fezo nak rawu doru teshi wish fezo | The friend hears the sound; therefore, the person sees the friend. |
| teshi mol gisho lena fezo tut losa | The person eats food, and the friend drinks liquid. |
| teshi nava wish fezo lena fezo nak rawu | The person does not see the friend, and the friend hears the sound. |
| teshi yemi ful tava gezi savi teshi fam ful tava gezi | The person is permitted to go home because the person is able to go home. |

The final example is grammatically linked but does not establish that ability is the actual legal or social basis for permission. A causal connective expresses the speaker's asserted relation, not a proof of its validity.

## 4. Participants and reference

Each clause keeps its own participant roles. Do not assume that the subject of clause 1 is also the subject of clause 2. In the examples above, teshi and fezo can refer to different participants.

This version does not add pronouns, agreement, shared-subject omission, or a rule that repeated words must refer to the same entity. If a clause needs a participant, that clause must satisfy its existing frame requirements independently.

The currently licensed clause inventory is deliberately bounded. The linkers may connect independently valid clauses from the v1.0–v1.7 constructions, but a linker cannot make an otherwise blocked construction valid. For example, directive utterances are not converted into ordinary declarative clauses by joining them with lena, savi or doru; coordination of directives remains blocked in v1.8.

## 5. Negation, questions, directives and scope

The linkers connect clauses; they do not change the scope of negation, modality, permission, prohibition or directive force within a clause.

The following remain blocked in v1.8:

- placing one linker inside a clause's verb frame or between a verb and its licensed arguments;
- using savi or doru to mean merely “and”;
- using lena to assert cause or consequence;
- assuming that a causal link is objectively proven;
- connecting a directive marker from v1.7 to another clause;
- using pun at the end of a two-clause construction to ask a question about only one clause;
- attaching one shuk or zosh question word so that its scope ambiguously spans both clauses;
- leaving a required participant unexpressed on the assumption that a neighbouring clause supplies it;
- nesting multiple linkers without explicit grouping;
- using these linkers to form if/then conditionals, temporal sequence, purpose clauses, or reported speech.

A positive polar question may be formed for an individual licensed clause using pun under the relevant earlier rules. Whether pun can scope over a complete coordinated or causal construction is not yet specified and must not be inferred.

## 6. Acceptance and rejection fixtures

These are specification-level targets, not parser or independent-speaker test results.

| ID | Input | Expected result |
|---|---|---|
| LINK-01 | teshi wish fezo lena fezo nak rawu | Two complete clauses joined by and |
| LINK-02 | teshi wish fezo savi fezo nak rawu | Second clause is the stated reason for the first |
| LINK-03 | fezo nak rawu doru teshi wish fezo | Second clause is presented as consequence of the first |
| LINK-04 | teshi mol gisho lena fezo tut losa | Clause-local participants retained |
| LINK-05 | teshi nava wish fezo lena fezo nak rawu | Negation remains within clause 1 |
| LINK-06 | teshi yemi ful tava gezi savi teshi fam ful tava gezi | Licensed clauses linked; causal truth not guaranteed |
| LINK-07 | teshi wish lena fezo | Rejected: incomplete clause frames |
| LINK-08 | teshi lena wish fezo | Rejected: linker cannot occur inside a clause frame |
| LINK-09 | teshi wish fezo savi fezo nak rawu | Not equivalent to an unmarked “and” |
| LINK-10 | teshi wish fezo lena fezo nak rawu | Does not assert that either clause caused the other |
| LINK-11 | dema ful tava gezi lena sori wish fezo | Rejected: directive coordination not licensed |
| LINK-12 | teshi wish fezo lena fezo nak rawu pun | Rejected as underspecified question scope |
| LINK-13 | shuk wish fezo lena fezo nak rawu | Rejected: question-word scope across linked clauses unresolved |
| LINK-14 | teshi wish fezo lena fezo nak rawu savi teshi mol gisho | Rejected: nested/multiple linker grouping not specified |
| LINK-15 | teshi wish fezo doru fezo nak rawu | Second clause is consequence, not reason |
| LINK-16 | teshi wish fezo savi fezo nak rawu | Second clause is reason, not consequence |
| LINK-17 | teshi wish fezo lena teshi nak rawu | Repeated teshi is not automatically forced to be the same real-world individual |
| LINK-18 | teshi yemi ful tava gezi savi teshi fam ful tava gezi | Does not prove permission follows from ability |
| LINK-19 | teshi wish fezo lena | Rejected: missing second clause |
| LINK-20 | savi teshi wish fezo | Rejected as a standalone clause: reason linker requires a preceding clause |
| LINK-21 | teshi wish fezo doru | Rejected: consequence linker requires a following clause |
| LINK-22 | teshi wish fezo lena fezo nak rawu | Does not encode temporal order by itself |

## 7. Locked decisions and change control

1. lena coordinates two complete clauses without asserting causation.
2. savi links a preceding claim/event to a following reason clause.
3. doru links a preceding basis/claim to a following consequence clause.
4. Both clauses retain their own participants and independently satisfy their own argument frames.
5. Linkers do not prove the truth of the causal relation they mark.
6. Directive coordination, nested linkers, broad question scope and conditional meaning remain blocked.
7. These are modern design decisions, not claims about historical or Formal Arcane.
8. When additional historical sources become accessible, compare their actual forms and examples and preserve source/version provenance rather than silently rewriting this design.
