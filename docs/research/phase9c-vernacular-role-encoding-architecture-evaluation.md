# Arcane Phase 9C — Vernacular role-encoding architecture evaluation

**Status:** Comparative design recommendation; not canon  
**Date:** 2026-10-15  
**Canon changes:** none  
**New lexical items or morphemes:** none  
**Surface role markers invented:** none  
**Tests executed:** none; this is a design-level evaluation of the existing semantic test set

## 1. Decision question

The current Vernacular pilot uses a simple subject–verb–object (SVO) pattern for short clauses. The v5 lexicon, however, does not establish a complete argument grammar. Phases 7L, 7M, 7S, 7V, 9A and 9B identify the same practical problem: a learner needs short ordinary clauses, but the language must also express reversible roles, three-participant events, motion relations and embedded content without silently guessing.

This phase evaluates architectures, not individual words. It neither establishes historical facts nor promotes the SVO pilot to canon.

## 2. Candidate architectures

### A. Fixed default order

**Hypothesis:** participant roles are primarily determined by a strict order, provisionally S–V–O in simple clauses.

**Strengths**
- Concise and easy to teach.
- Does not require new role morphology to begin with.
- Fits the existing short-clause pilot.

**Risks**
- Three-participant predicates need carefully specified frame-specific orders or another construction.
- Recipient, beneficiary and source cannot be identified from the current two-slot SVO pattern alone.
- Reordering for topic, focus or questions may change role interpretation unless separately regulated.
- A learner may overgeneralise simple transitive order to verbs whose complements differ.

**Minimum safe domain:** only simple clauses whose two participant roles and verb frame are explicitly validated. This is not yet a general rule for all Vernacular clauses.

### B. Overt role marking

**Hypothesis:** each relevant participant or phrase carries an explicit role marker.

**Strengths**
- Can in principle identify roles independently of order.
- Supports role reversal and multiple non-subject participants.
- Can make source, goal, recipient and beneficiary distinctions explicit.

**Risks**
- Requires a role inventory, actual marker forms, placement, attachment and interaction rules.
- Markers may be ambiguous with existing words, digits, clitics or formal operators.
- Unrestricted marking could make ordinary conversation unnecessarily heavy.
- Does not by itself solve quotation, embedded-clause scope, aspect or semantic entailment.

**Minimum safe domain:** none as a speakable system until actual forms and attachment rules are approved and tested. English labels such as `AGENT:` in earlier prototypes are analysis notation, not Arcane.

### C. Controlled hybrid

**Hypothesis:** simple, validated clauses use a stable default order; explicit role marking or a separately defined construction is mandatory when the default cannot uniquely recover the intended roles.

**Strengths**
- Preserves a concise learner entry point.
- Provides a principled route to three-participant and embedded clauses.
- Makes ambiguity a design signal: mark, restructure, or declare the utterance unresolved.
- Allows the grammar to grow without pretending all verbs share one frame.

**Risks**
- “Mark when needed” is too vague unless the trigger conditions are finite and testable.
- Inconsistent exceptions could recreate the ambiguity the system is meant to prevent.
- Requires a clear rule for what happens when context seems to make an unmarked sentence plausible.

**Minimum safe domain:** simple SVO pilot clauses may remain experimental; complex clauses remain blocked until their triggers and constructions are specified.

## 3. Weighted evaluation

Scores are qualitative design judgements, not empirical speaker-test results. Scale: 1 = poor fit; 5 = strong fit. The weighting prioritises recoverable meaning and incremental learnability.

| Criterion | Weight | A: fixed order | B: overt marking | C: controlled hybrid |
|---|---:|---:|---:|---:|
| Recover roles in reversible two-participant clauses | 20% | 4 | 5 | 5 |
| Express three or more participant roles | 20% | 2 | 5 | 4 |
| Keep ordinary clauses concise | 15% | 5 | 2 | 4 |
| Scale to embedded clauses and scope | 15% | 2 | 3 | 4 |
| Avoid inventing unsupported surface morphology now | 10% | 5 | 1 | 4 |
| Support explicit ambiguity handling | 10% | 2 | 4 | 5 |
| Ease of incremental teaching | 10% | 5 | 2 | 4 |
| **Weighted total / 5** | **100%** | **3.45** | **3.45** | **4.30** |

**Interpretation:** the controlled hybrid is the strongest design candidate for further prototyping. The result does not establish that it is historically authentic, uniquely correct, or approved canon. The score expresses how well it fits the project's stated usability and precision goals under current evidence.

## 4. Proposed controlled-hybrid policy

The following is a recommendation for a designed modern Vernacular layer, not a canon rule.

1. **Default-order domain:** use the pilot SVO pattern only for a small, named set of validated verb frames.
2. **No silent role guessing:** if two readings remain possible, the grammar must not choose one solely because it sounds more plausible in English.
3. **Complex participant gate:** three or more core participants require an approved construction that independently recovers each role.
4. **Reversible-role gate:** if two participants can plausibly exchange roles, the clause must be uniquely interpretable under the approved rules.
5. **Spatial gate:** source, goal, path, static location and arrival must use distinct licensed constructions wherever the contrast matters.
6. **Embedding gate:** quoted words and reported propositions require an explicit boundary/attachment policy before being used in teaching material.
7. **Omission gate:** an argument may be omitted only when the verb's omission policy permits it and the intended referent is recoverable under a defined rule.
8. **Register gate:** Formal Arcane relations/operators are not borrowed as Vernacular markers without an explicit cross-register decision.
9. **Provenance gate:** existing forms and historical aliases retain source/version labels; this proposal does not globally replace older forms.
10. **Failure behaviour:** where no licensed construction yields a unique interpretation, label the intended sentence unresolved and do not fabricate a surface string.

## 5. Smallest useful prototype boundary

Do not try to define every clause type at once. The next prototype should cover these six domains:

| Domain | Positive case | Contrast that must remain distinct | Status now |
|---|---|---|---|
| Simple perception | A sees B | B sees A | SVO pilot only; frame still proposed |
| Communication | A says message M to B | A says M about B | Blocked pending addressee/topic and message rules |
| Transfer | A gives X to B | A gives X for C's benefit | Blocked pending role construction |
| Motion | A goes to L | A is at L / goes from L | Blocked pending spatial construction |
| Modality | A is able to act | A is permitted to act | Blocked pending modal meaning |
| Embedded desire | A wants B to leave | A leaves / A wants to leave | Blocked pending clause-boundary and embedded-role rules |

The prototype must contain both positive and negative cases. A form that works for one intended reading but also licenses a competing reading without a way to detect it has not passed.

## 6. Explicit decisions still required

Before producing a stable learner grammar, decide:

- whether the modern Vernacular layer may be deliberately designed where historical evidence is absent;
- whether default order is strictly SVO or merely a teaching default;
- which semantic roles are core and which are oblique/adjunct;
- whether role marking is expressed through particles, adpositions, morphology, word order, or a combination;
- where markers attach and how they avoid collision with existing tokens;
- how quoted and reported content is delimited;
- how negation, modality, questions and temporal phrases scope over clauses;
- how ambiguity and argument omission are represented in learner materials.

These decisions should be made as a connected system, not as isolated fixes to individual sentences.

## 7. Recommendation

**Advance Candidate C — controlled hybrid — to a bounded, explicitly provisional design prototype.** Retain the existing SVO pilot as a narrow teaching hypothesis, not a universal rule. Do not invent role-marker forms in this phase. First specify the semantic role inventory and the mandatory-marking triggers; then test alternative surface mechanisms against the same contrast set and check for collisions with the existing lexicon.

This is a recommendation for the next development experiment, not an owner approval or canon promotion.

## 8. Decision record

- **Finding ID:** P9C-VERNACULAR-ROLE-ARCHITECTURE-01
- **Leading candidate:** controlled hybrid
- **Confidence:** moderate as a design recommendation; low as a claim about historical grammar
- **Canon promotion:** none
- **New forms:** none
- **Source claims:** limited to the existing Phase 5 proposed lexicon and prior research documents listed below
- **Sources:** `phase7l-vernacular-argument-architecture-stress-test.md`; `phase7m-controlled-vernacular-role-system-prototypes.md`; `phase7s-vernacular-clause-architecture-decision-docket.md`; `phase7v-bounded-vernacular-clause-prototype.md`; `phase9a-consolidated-vernacular-mini-grammar-candidate.md`; `phase9b-core-verb-frame-teaching-paradigms.md`
- **Next phase:** design the semantic role inventory and trigger rules as a finite table; test each rule against role reversal, recipient/beneficiary, source/goal/path, embedded content and omission cases before choosing surface forms.
