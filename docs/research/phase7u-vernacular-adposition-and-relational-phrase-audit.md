# Arcane Phase 7U — vernacular adposition and relational-phrase audit

**Status:** Source-grounded semantic audit; not canon  
**Date:** 2026-10-15  
**Finding ID:** P7U-ADPOSITION-AUDIT-01  
**Canon effect:** none  
**Source inspected:** `sources/originals/Arcane_Lexicon_v5_draft.csv`  
**New forms:** 0  
**Tests executed:** 0

## 1. Scope

The v5 draft lexicon proposes five vernacular prepositions: `desh` “in/at”, `ding` “with”, `push` “for”, `buk` “about”, and `ges` “than”. The purpose of this audit is to establish what the glosses support, what they do not support, and which contrast tests a future grammar must answer.

All five are recorded as `PREP`, `Vernacular`, `PROPOSED`, source `Phase 5`. These facts support the presence of proposed entries in the draft, not canonical syntax or the exact semantic range of each item.

## 2. Evidence discipline

Use the following distinctions:

- **Gloss-supported:** the narrow English gloss in the source.
- **Possible extension:** a plausible meaning that still needs approval or source evidence.
- **Unsupported inference:** a meaning or grammatical function not established by the entry.
- **Open construction:** a phrase may be possible, but attachment, argument status or scope is unknown.

No example below is presented as a validated Arcane sentence. English phrases are semantic prompts only.

## 3. DESH — “in/at”

### Gloss-supported
A broad location relation compatible with English “in” or “at”.

### Not established
- motion goal (“to”);
- source (“from”);
- path (“through”, “along”);
- containment versus point location;
- whether the complement denotes a bounded region, surface, volume or event;
- whether `desh` is restricted to oblique phrases or can mark a core argument.

### Contrast requirements

| ID | Semantic prompt A | Semantic prompt B | Required decision |
|---|---|---|---|
| DESH-01 | A is at L | A goes to L | Static location vs goal |
| DESH-02 | A is in L | A is on the surface of L | Interior vs surface |
| DESH-03 | A is at L | A comes from L | Location vs source |
| DESH-04 | A moves along L | A moves through L | Path relation |
| DESH-05 | A is inside L | A is near L | Containment vs proximity |
| DESH-06 | Phrase attaches to the main event | Phrase attaches to an embedded event | Attachment scope |

**Current rule:** do not use `desh` for goal, source, path, surface or proximity unless an explicit grammar decision authorises that extension.

## 4. DING — “with”

### Gloss-supported
A relation glossed “with”.

### Not established
- accompaniment (“together with B”);
- instrument (“using a tool”);
- manner (“with care”);
- possession/accompaniment of a possessed object;
- comitative versus coordination;
- whether the complement is an argument or an optional adjunct.

### Contrast requirements

| ID | Semantic prompt A | Semantic prompt B | Required decision |
|---|---|---|---|
| DING-01 | A goes with B as companion | A goes using tool T | Accompaniment vs instrument |
| DING-02 | A cuts X with tool T | A cuts X with care | Instrument vs manner |
| DING-03 | A and B go | A goes with B | Coordination vs comitative phrase |
| DING-04 | A owns X | A goes with X | Possession vs co-presence |
| DING-05 | B is required by the verb | B is an optional companion | Core argument vs adjunct |

**Current rule:** the gloss “with” is insufficient to assign `ding` all common English with-relations.

## 5. PUSH — “for”

### Gloss-supported
A relation glossed “for”.

### Not established
- recipient (“give X to B”);
- beneficiary (“do X for B’s benefit”);
- purpose (“for the purpose of G”);
- intended user/owner;
- duration (“for two hours”);
- exchange/price (“for ten coins”).

### Contrast requirements

| ID | Semantic prompt A | Semantic prompt B | Required decision |
|---|---|---|---|
| PUSH-01 | A gives X to B | A does X for B's benefit | Recipient vs beneficiary |
| PUSH-02 | A builds X for purpose G | A gives X to recipient B | Purpose vs recipient |
| PUSH-03 | A works for duration D | A acts for beneficiary B | Duration vs beneficiary |
| PUSH-04 | A buys X for price P | A makes X for user U | Exchange value vs intended beneficiary |
| PUSH-05 | A gives X to B for C's benefit | A gives X to C | Distinct recipient and beneficiary |

**Current rule:** do not treat `push` as a universal dative, beneficiary, purpose, duration and price marker. Each extension needs its own distribution and contrast tests.

## 6. BUK — “about”

### Gloss-supported
A relation glossed “about”.

### Not established
- topic of speech/thought;
- content of a message;
- target of an action;
- modifier attachment site;
- distinction between “tell B a story about C” and “tell B about a story”;
- whether a proposition may be its complement.

### Contrast requirements

| ID | Semantic prompt A | Semantic prompt B | Required decision |
|---|---|---|---|
| BUK-01 | A tells B a story about C | A tells B about a story | Phrase attachment |
| BUK-02 | A thinks about B | A speaks about B | Predicate-specific frame |
| BUK-03 | A says proposition P about B | A says P to B | Topic vs addressee |
| BUK-04 | Phrase modifies a noun | Phrase modifies an event | Nominal vs event attachment |
| BUK-05 | Complement is an entity | Complement is a proposition | Complement type |

**Current rule:** the gloss “about” does not settle complement category or phrase attachment.

## 7. GES — “than”

### Gloss-supported
A comparative relation glossed “than”.

### Not established
- comparative standard versus source;
- whether the compared property is expressed;
- whether `ges` takes a noun phrase, degree phrase or proposition;
- whether comparisons are symmetric or directional;
- how negated and scalar comparisons behave.

### Contrast requirements

| ID | Semantic prompt A | Semantic prompt B | Required decision |
|---|---|---|---|
| GES-01 | A is taller than B | A is as tall as B | Comparative vs equative |
| GES-02 | A is taller than B | A is taller because of B | Standard vs cause |
| GES-03 | A has more X than B | A has more X than before | Entity standard vs temporal standard |
| GES-04 | A is not taller than B | A is shorter than B | Negated comparison vs opposite comparison |
| GES-05 | Comparison of entities | Comparison of propositions/events | Complement type |

**Current rule:** do not infer a full comparative construction from the preposition gloss alone.

## 8. Cross-item role and attachment tests

The following contrasts must be considered across the inventory, not solved by assigning each item an unlimited English gloss.

| ID | Contrast | Failure condition |
|---|---|---|
| REL-01 | `desh` location phrase vs motion goal | Same interpretation with no explicit extension rule |
| REL-02 | `push` recipient vs beneficiary | Beneficiary automatically treated as recipient |
| REL-03 | `ding` companion vs instrument | Context-free reading silently chosen where both fit |
| REL-04 | `buk` topic vs addressee | “About B” interpreted as “to B” without rule |
| REL-05 | `ges` comparative standard vs causal source | Comparative relation conflated with causation |
| REL-06 | Relational phrase attached to matrix vs embedded clause | Clause boundary ignored |
| REL-07 | Required argument vs optional adjunct | Argument omission policy silently guessed |
| REL-08 | Historical token, alias and proposed extension | Source gloss overwritten by later broader usage |

## 9. Relationship to formal spatial operators

Formal Arcane lists JO (toward), JUR (away), JA (along), JE (parallel), and JI (aligned/coincident). These are documented formal spatial relations. This does not show that vernacular `desh` covers their functions, nor that any one vernacular preposition maps one-to-one to a formal operator.

If a cross-register mapping is later proposed, document it as a mapping with scope and counterexamples, not as a global synonym substitution. The same principle applies to any future vernacular expressions of location, direction or movement.

## 10. Recommendation

Keep all five entries at their source status, PROPOSED. Build the first grammar with narrow, explicitly defined uses rather than allowing English glosses to expand silently. Where the grammar needs distinctions the five entries do not cover, decide whether to use a construction, a different existing item, or a newly approved form only after the clause architecture and semantic role inventory are settled.

The next step is to join these relational-phrase tests to the Phase 7O and Phase 7Q matrices and identify which distinctions can be handled by syntax and which would require new morphology. Do not coin forms yet.

## 11. Decision ledger

- **Finding:** P7U-ADPOSITION-AUDIT-01
- **Proposed prepositions reviewed:** 5
- **New contrast prompts:** 31
- **New Arcane forms:** 0
- **New canon rules:** 0
- **Historical clauses recovered:** 0
- **Tests executed:** 0
- **Next step:** integrate relational phrase contrasts into the clause-architecture acceptance set.
