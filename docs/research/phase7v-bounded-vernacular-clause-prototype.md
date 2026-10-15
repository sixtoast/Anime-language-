# Arcane Phase 7V — bounded vernacular clause prototype and decision gate

**Status:** Working grammar proposal; not canon  
**Date:** 2026-10-15  
**Decision ID:** P7V-CLAUSE-PROTOTYPE-01  
**Canon effect:** none; owner approval required  
**Historical clause evidence:** none recovered in this phase  
**New Arcane morphemes:** 0  
**Executable tests run:** 0

## 1. Why this phase exists

Phases 7G–7U have established a substantial semantic acceptance set, but have not produced a usable, consistently specified vernacular clause grammar. Continuing to add audits without defining a bounded candidate would delay the transition from analysis to language design.

This phase therefore presents one testable prototype for owner review. It does not claim historical authenticity, does not promote Phase 7E's conversational pilot to canon, and does not coin grammatical forms. It proposes a clause architecture using role labels as metalanguage placeholders. Those labels are not Arcane words.

The decision can be accepted, amended or rejected without changing the canonical Formal register.

## 2. Candidate architecture

**Candidate name:** constrained hybrid, version 0.1.

1. **Default order for simple transitive clauses:** Subject/agent – verb – object/theme (SVO), as a new design proposal, not a recovered historical rule.
2. **Unambiguous simple intransitive clauses:** participant – verb, unless a later aspect, polarity or clause particle rule requires another position.
3. **Role marking is required in a clause** when default order alone cannot reliably preserve role identity: especially three-participant transfer clauses, non-default argument order, multiple animate participants, or constructions where an embedded clause introduces its own participants.
4. **Adjunct relations remain distinct from core arguments.** Proposed prepositions such as `desh`, `ding`, `push`, `buk` and `ges` must not be repurposed as grammatical case markers without explicit evidence or approval.
5. **Embedded propositions require explicit scope in the grammar specification.** The actor of an embedded event must not be silently equated with the experiencer/subject of the matrix verb.
6. **If a clause has more than one defensible reading, the grammar must mark it unresolved or require disambiguation.** Contextual plausibility is not enough to select an argument role.
7. **Existing Formal syntax remains separate.** Formal control notation and operators are not reinterpreted as vernacular word order or everyday verbs.

This candidate uses SVO as a deliberately simple baseline. It is not a claim about earlier Arcane, nor a statement that SVO is typologically or aesthetically superior. It gives the grammar a testable default while keeping additional marking limited to places where semantic roles would otherwise be at risk.

## 3. Placeholder notation

The following notation is for grammar analysis only:

- `A[AGENT]`: participant intentionally performing an action;
- `T[THEME]`: entity affected, transferred or perceived;
- `R[RECIPIENT]`: intended recipient;
- `B[BENEFICIARY]`: participant for whose benefit an event occurs;
- `E[EXPERIENCER]`: participant who wants, needs, knows or perceives;
- `S[SPEAKER]`, `D[ADDRESSEE]`, `M[MESSAGE]`;
- `X[EMBEDDED-ACTOR]`: participant performing the embedded event;
- `{ ... }`: an embedded event or proposition in this metalanguage only.

No placeholder is a proposed Arcane token. No surface sentence is generated until role marking and complement rules are approved.

## 4. Candidate clause templates

| Construction | Proposed semantic template | Status / open question |
|---|---|---|
| Intransitive event | `A[participant] – V` | Candidate baseline; verb-specific omission rules unresolved |
| Simple transitive event | `A[agent] – V – T[theme]` | Proposed SVO baseline |
| Transfer | `A[giver] – V – T[theme] – R[recipient]` | Role distinction required; actual marker/ordering policy unresolved |
| Transfer plus beneficiary | `A – V – T – R – B` | Five-role/attachment risk; must be marked or structurally separated |
| Perception | `E[perceiver] – V – T[entity/event]` | Seeing/hearing vs inference/comprehension remain distinct |
| Communication | `S[speaker] – V – M[message]` plus optional `D[addressee]` | Whether addressee is a core argument is verb-specific and unresolved |
| Desire with embedded event | `E[wanter] – V – {X[embedded actor] – event}` | Embedded actor must remain distinct from experiencer |
| Motion | `A[mover] – V – [source/goal/path/location]` | Spatial roles need separate licensed constructions |
| Comparison | `comparison target – property – comparative phrase` | Exact construction and `ges` distribution unresolved |

The templates define semantic obligations, not final surface syntax. In particular, the transfer template is not yet a usable Arcane sentence: it has no approved role markers, and the ordering of recipient and beneficiary has not been historically established.

## 5. Role-marking trigger proposal

The prototype should prefer the simplest construction that preserves the intended reading. The following are proposed triggers for explicit marking or structural separation:

| Trigger | Reason | Candidate handling |
|---|---|---|
| Three or more core participants | More than one non-subject participant can be mistaken for another role | Mark roles or use a separately specified construction |
| Two animate participants with reversible roles | Both participants could plausibly be agent or recipient | Mark roles or reject ambiguous surface form |
| Non-default argument order | Order no longer reliably indicates subject/object | Mark affected roles |
| Matrix plus embedded clause | Participant roles belong to different predicate scopes | Delimit the embedded clause and specify its argument structure |
| Recipient and beneficiary both present | Receiving and benefiting are different relations | Encode both independently |
| Motion has source and goal | A location phrase may be confused with origin or destination | Use separate licensed relations |
| Ellipsis/omitted argument changes interpretation | Missing participant cannot be recovered safely | Require context or mark as ambiguous |
| Negation/modal scope affects meaning | Scope changes the proposition | Specify scope position and test competing readings |

This table does not define what a role marker looks or sounds like. It only states when the grammar may need one.

## 6. Worked semantic analyses — not Arcane translations

### 6.1 Transfer with distinct recipient and beneficiary

Intended meaning: A gives a book to B for C's benefit.

Required role record:

- A = giver;
- book = theme;
- B = recipient;
- C = beneficiary.

**Acceptance condition:** a candidate clause must preserve B and C as distinct participants and must not imply that C receives the book merely because C benefits. If the construction cannot encode both roles, it is insufficient for this meaning.

### 6.2 Desire with a different embedded actor

Intended meaning: A wants B to leave.

Required role record:

- A = experiencer of wanting;
- B = actor of leaving;
- leaving = embedded event.

**Acceptance condition:** the grammar must not infer that A is the person who leaves. The embedded event's actor must be explicit or licensed by a clearly specified control/coreference rule.

### 6.3 Hearing versus understanding

Intended meaning A: A hears a sound from B.  
Intended meaning B: A understands B's message.

**Acceptance condition:** the grammar must not collapse sensory hearing and successful comprehension into one meaning unless the lexicon explicitly defines that polysemy and a disambiguation policy.

### 6.4 Motion toward versus arrival

Intended meaning A: A moves toward location L.  
Intended meaning B: A arrives at L.  
Intended meaning C: A enters the interior of L.

**Acceptance condition:** goal-directed motion, arrival and entry must remain distinct where the language intends those distinctions. The formal JO “toward” relation cannot be assumed to mean arrival or entry.

### 6.5 Capability versus permission

Intended meaning A: A is physically/skillfully able to act.  
Intended meaning B: A is permitted to act.  
Intended meaning C: the action is physically possible under current conditions.

**Acceptance condition:** `fam` cannot be assigned all three readings without a documented lexical or constructional rule.

## 7. Candidate acceptance suite

A candidate grammar is not ready for promotion unless each row has a defined expected interpretation set and a counterexample policy.

| ID | Positive case | Contrast/negative case | Required result |
|---|---|---|---|
| V-01 | Simple agent acts on theme | Swap agent and theme | Role difference recoverable |
| V-02 | Give X to B | Give X for C's benefit | Recipient differs from beneficiary |
| V-03 | Give X to B for C | C receives X | Do not infer recipient from beneficiary |
| V-04 | A wants B to leave | A leaves | Embedded actor remains distinct |
| V-05 | Hear sound | Understand message | Perception differs from comprehension |
| V-06 | See entity | Infer fact about entity | Perception differs from inference |
| V-07 | Go toward L | Arrive at L | Motion differs from arrival |
| V-08 | Enter L | Be located in L | Path/event differs from static location |
| V-09 | Able to act | Permitted to act | Ability differs from permission |
| V-10 | Need X for goal G | Want X | Need differs from desire |
| V-11 | Say M to B | Say M about B | Addressee differs from topic |
| V-12 | Teach B skill S | B successfully learns S | Teaching does not entail learning |
| V-13 | Try to transfer X | Successfully transfer X | Attempt differs from completion |
| V-14 | Negation scopes over main predicate | Negation scopes over embedded predicate | Distinct readings remain distinguishable |
| V-15 | Participant omitted but uniquely recoverable | Participant omitted with two plausible candidates | Ambiguity must be exposed |
| V-16 | Historical form | Registered alias | Provenance preserved |
| V-17 | Formal operator | Vernacular lexical verb | Register distinction preserved |
| V-18 | Stated desired effect | Physically established mechanism | Intention is not proof of causation or feasibility |

These are acceptance criteria, not executed tests. A future test record should capture the candidate grammar version, input surface form, expected reading set, observed reading set, ambiguity policy, source/proposal status and reviewer decision.

## 8. What remains undecided

The following choices cannot be inferred from this prototype:

1. Whether SVO should become the accepted default for the modern vernacular layer.
2. The actual form and distribution of core role markers, if required.
3. Whether role marking is obligatory on all non-subject arguments or only under the triggers above.
4. How embedded clauses are delimited and whether they use complementisers, particles or fixed constructions.
5. Whether recipient and beneficiary are expressed by role markers, prepositions or separate constructions.
6. How verb-specific argument omission works.
7. The actual semantic range of `fam`, `tek`, `kong`, and the proposed relational words.
8. Whether historical source material can establish any of these choices.

## 9. Owner decision gate

Before this candidate can become a stable modern vernacular specification, the language owner should choose one of these outcomes:

- **A — Accept as a modern design baseline:** approve proposed SVO for simple clauses and the listed role-marking triggers, with all unresolved morphology remaining open.
- **B — Amend the baseline:** retain the constrained hybrid approach but change the default order or marking triggers; record each change and rerun the acceptance suite.
- **C — Defer the surface grammar:** continue source recovery and keep the conversational pilot explicitly provisional.
- **D — Choose a different architecture:** specify the preferred alternative and evaluate it against the same acceptance suite.

No choice is silently made by this document. If A or B is selected, that is a new modern design layer unless historical sources independently support it. Canonical Formal Arcane and legacy source strata remain untouched.

## 10. Decision ledger

- **Decision ID:** P7V-CLAUSE-PROTOTYPE-01
- **Architecture candidate:** constrained hybrid
- **Proposed default:** SVO for simple transitive clauses, pending approval
- **Role marking:** required under listed ambiguity triggers, pending approval
- **New Arcane morphemes:** 0
- **Historical clauses recovered:** 0
- **Acceptance cases authored:** 18
- **Tests executed:** 0
- **Canon changes:** 0
- **Next step:** run an owner decision gate, then either lock a provisional modern grammar baseline or continue source recovery; do not coin markers before the role architecture is approved.
