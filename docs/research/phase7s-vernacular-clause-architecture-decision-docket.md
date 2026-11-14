# Arcane Phase 7S — vernacular clause architecture decision docket

**Status:** Decision-ready proposal; not canon  
**Date:** 2026-10-15  
**Decision ID:** P7S-CLAUSE-ARCH-01  
**Canon effect:** none; owner approval required  
**Historical evidence recovered in this phase:** none  
**New surface forms coined:** none  
**Tests executed:** none

## 1. Decision to be made

The language research has established semantic requirements for participant roles, motion, embedding, modality, and ambiguity, but the inspected sources have not established a complete vernacular clause grammar. Phase 7M compared three architectures; Phase 7P–7Q made the most important distinctions testable; Phase 7R found that the workbench's current parser/test registry cannot honestly validate these constructions.

This docket converts the research into one bounded decision:

**If further source recovery cannot establish the historical vernacular grammar, should Arcane adopt a constrained hybrid for new vernacular design?**

This document recommends the hybrid as the most practical candidate for review, not as an already adopted rule. Historical source recovery takes priority over redesigning a system that may already have historical rules.

## 2. Candidate architecture

### CANDIDATE H — constrained hybrid

1. **Simple clauses:** use a consistent default order for ordinary two-participant clauses, if the owner approves one.
2. **Complex roles:** require explicit disambiguation where a clause has three or more core participants, or where a verb's frame makes role recovery non-unique.
3. **Spatial relations:** distinguish static location, source, goal and path; do not extend a location gloss to motion roles without an explicit rule.
4. **Embedding:** mark or otherwise delimit embedded propositions and quotations so matrix and embedded participants cannot be confused.
5. **Scope:** define the scope of negation, modality, conditionality and temporal modifiers before writing examples that depend on them.
6. **Omission:** permit argument omission only under a stated recoverability rule; if context supports multiple readings, report or preserve ambiguity.
7. **Register separation:** keep vernacular syntax separate from Formal operator notation unless an explicit mapping is documented.
8. **Lexical frames:** record frames per verb or by a justified class; do not assume every verb has the same transitivity pattern.

The candidate architecture does **not** specify the default order, the role-marking mechanism, any new morphemes, or the exact embedded-clause syntax. Those require separate evidence or approval.

## 3. Why the hybrid is the leading candidate

| Criterion | Fixed order only | Overt role marking | Constrained hybrid |
|---|---|---|---|
| Concise ordinary clauses | Strong | Potentially weaker | Strong |
| Reversible participant roles | Depends on rigid order | Strong if markers are unambiguous | Strong if complex-role marking is obligatory |
| Three-participant verbs | Requires many frame/order rules | Explicit in principle | Explicit in marked frames |
| Flexible word order | Low | Potentially high | Controlled, not unrestricted |
| New morphology needed immediately | Not necessarily | Likely, depending on implementation | Only after marking triggers are approved |
| Main failure risk | Hidden frame/order exceptions | Marker overload and attachment ambiguity | Inconsistent decisions about when marking is required |
| Historical support in current inspected evidence | Insufficient | Insufficient | Insufficient |
| Current status | Not approved | Not approved | Recommended candidate only |

The hybrid is preferred provisionally because it allows short routine clauses while concentrating explicit role distinctions where ambiguity is most damaging. Its weakness is that “mark when needed” is not a grammar rule until the trigger conditions are sufficiently explicit to be applied consistently.

## 4. Proposed decision sequence

Do not decide all morphology at once. Resolve these gates in order:

### Gate 1 — evidence

- Recover exact vernacular clauses from the original source files, if any.
- Record the exact token sequence and source location.
- Keep original spelling and segmentation intact.
- Separate source text from editorial gloss.
- If no source clauses can be recovered, record the search routes and limitation; do not fabricate examples.

**Exit condition:** either source evidence supports a grammar hypothesis, or the owner explicitly authorises new vernacular design where evidence is missing.

### Gate 2 — default clause pattern

Choose one of:
- a fixed default order for simple two-participant clauses;
- obligatory role marking even in simple clauses;
- no default until context/register specifies one.

**Provisional recommendation:** approve a single default for ordinary two-participant clauses only if source evidence does not contradict it. SVO may be evaluated as a candidate because it has appeared in the Phase 7E pilot, but that pilot is not evidence of canon and cannot independently justify SVO.

**Exit condition:** one documented default or an explicit statement that no default is established.

### Gate 3 — role inventory

At minimum, test whether the grammar needs separate labels/constructions for:
- actor/agent where relevant;
- experiencer;
- theme;
- recipient;
- beneficiary;
- source;
- goal;
- path;
- location;
- speaker;
- addressee;
- message/content;
- learner;
- task/complement.

This is a semantic inventory for evaluation, not a demand that each role receive a separate morpheme. A construction may realise multiple roles through position, case, adposition, agreement or context, but its interpretation must be testable.

**Exit condition:** each role is classified as distinct, shared by a documented rule, or intentionally neutralised.

### Gate 4 — mandatory disambiguation triggers

Candidate mandatory contexts:
- three or more core participants;
- recipient versus beneficiary;
- source versus theme;
- goal versus source versus path;
- matrix versus embedded participants;
- a movable constituent whose position would otherwise alter role interpretation;
- a context where omission leaves two plausible referents.

The owner may add/remove triggers, but every trigger must be described with positive and negative examples before approval.

**Exit condition:** no discretionary phrase such as “when necessary” remains without a testable criterion.

### Gate 5 — complements and scope

Specify:
- quotation versus reported proposition;
- event complement versus noun phrase;
- negation over a verb versus negation over a modal/desire predicate;
- ability versus permission versus event possibility;
- conditional and temporal modifier attachment.

**Exit condition:** contrast pairs have explicit expected readings, including cases that remain ambiguous.

### Gate 6 — surface morphology

Only after Gates 1–5:
- propose actual role markers or other morphology if needed;
- run phonological collision and homophone checks;
- preserve historical aliases and versioned forms;
- test against existing EX/VF/TR/PK/CL/MO/MI/GAP identifiers;
- seek explicit approval before canon promotion.

**Exit condition:** each new form has a meaning, grammatical distribution, examples, counterexamples, source/status label and collision review.

## 5. Required acceptance set

Any candidate architecture must at least preserve the following contrasts:

| Test family | Required distinction |
|---|---|
| Transfer | giver/theme/recipient; recipient vs beneficiary; source vs theme; attempt vs completion |
| Perception | perceiver/theme; sound vs speaker; hearing vs understanding |
| Communication | speaker/addressee/message; quotation vs reported proposition; embedded roles |
| Motion | location/source/goal/path; toward vs arrival/entry; deictic centre |
| Modality | ability/permission/physical possibility; want/need; negation scope |
| Omission | required/optional/contextually recovered arguments; ambiguity when context is insufficient |
| Provenance | historical token vs alias vs proposal; register and version preserved |
| Semantics of effects | intention/representation does not itself prove mechanism, causation or feasibility |

Passing this semantic acceptance set would show only that the proposal distinguishes the intended meanings on paper. It would not prove historical authenticity, naturalness, or physical spell feasibility.

## 6. Example of a decision without invented Arcane forms

Semantic prompt: “A gives a book to B for C's benefit.”

The approved grammar must decide how it represents:
- A as giver;
- the book as transferred theme;
- B as recipient;
- C as beneficiary.

A successful analysis must preserve B and C as different roles. It must not infer that C receives the book merely because C benefits. At this stage, the document deliberately uses semantic labels instead of invented Arcane markers.

The same method applies to “A wants B to leave”: A is the experiencer of desire, while B is the actor in the desired event. A two-slot verb frame cannot be assumed to represent this structure correctly without a documented complement rule.

## 7. Rejection criteria

Reject or return for revision any candidate that:
- treats the Phase 7E pilot as proof of canonical word order;
- imports Formal operator syntax into vernacular without a mapping;
- introduces role-marker forms before the role system and triggers are approved;
- conflates recipient and beneficiary or source and theme;
- assumes an omitted participant from plausibility alone;
- silently chooses between multiple valid interpretations;
- claims historical support without exact provenance;
- uses a test prompt as if it were a validated Arcane translation;
- treats language form as proof that a physical effect is possible.

## 8. Recommendation and next step

**Recommendation:** keep the constrained hybrid as the leading design candidate, but do not promote it to canon yet. Complete one final focused source-recovery attempt for historical clause examples and morphology. If that remains blocked, present the owner with the specific Gate 2 decision and its consequences, rather than continuing to create more abstract audits indefinitely.

The next practical deliverable should be a **source-backed clause dossier** if any source examples are recovered. If none can be recovered, the next deliverable should be a concise approval record for the default order and mandatory-marking triggers. Only after that should actual vernacular role markers be proposed.

## 9. Decision ledger

- **Decision ID:** P7S-CLAUSE-ARCH-01
- **Leading candidate:** constrained hybrid
- **Canon approval:** not granted
- **Default word order chosen:** no
- **New morphemes:** 0
- **Historical clauses recovered:** 0
- **Parser tests executed:** 0
- **Next step:** targeted historical clause recovery, followed by a bounded owner decision if evidence remains insufficient.
