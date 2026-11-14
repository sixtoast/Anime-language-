# Arcane Phase 7L — vernacular argument architecture stress test

**Status:** Comparative design study; not canon  
**Date:** 2026-10-15  
**Decision ID:** P7L-ARGARCH-01  
**Canon effect:** none  
**Tests executed:** none; this is a paper test over semantic requirements, not a parser run.

## 1. Question

Which vernacular architecture is the safest next candidate for expressing participant roles: fixed constituent order, role particles/case markers, adpositions, or a hybrid? Phase 7H already established that the current source set does not justify selecting any architecture as canon. Phase 7K now supplies a 34-prompt semantic bank. This phase applies explicit pass/fail requirements to the alternatives and narrows the next decision without inventing surface forms.

## 2. Evaluation method

A candidate passes a requirement only if its architecture can encode the distinction **in principle** and its grammar specifies how. A candidate does not pass merely because a designer could later add a rule. Since the actual vernacular syntax is not recovered, “potential pass” is not evidence that Arcane already passes.

Ratings:
- **Good:** the architecture naturally supports the requirement, assuming its rules are specified.
- **Conditional:** possible, but requires additional rules or a sufficiently complete inventory.
- **Weak:** the architecture tends to rely on context or special-case rules for this requirement.
- **Unknown:** cannot be assessed from source evidence.

## 3. Comparative matrix

| Requirement | A: fixed order | B: role markers | C: adpositions | D: hybrid |
|---|---|---|---|---|
| EX-001/002 reverse perceiver and theme | Good if order is strict | Good if roles marked | Conditional; relation marking must be complete | Good if defaults and override rules are explicit |
| EX-003/004 giver, theme, recipient | Weak without a second rule | Good if all roles have markers | Good if recipient construction is specified | Good if complex frames trigger explicit marking |
| EX-005 recipient vs beneficiary | Weak | Conditional; distinct roles need encoding | Conditional; distinct adpositions/constructions needed | Conditional; must define mandatory distinction |
| EX-006 source vs theme | Conditional | Good if source role exists | Good if source adposition exists | Good if motion/source frames are covered |
| EX-008 teacher, learner, content | Weak without extra rules | Good if role inventory covers all three | Conditional; three relations and phrase attachment required | Good in principle, but obligation rules required |
| EX-009 speaker, recipient, message | Weak without extra rules | Good if roles and complement syntax exist | Conditional; recipient and complement must be distinct | Conditional; embedding policy required |
| EX-011–016 location/goal/source/path | Weak for all relations from order alone | Conditional; spatial roles must be defined | Good in principle with a complete spatial inventory | Good in principle with explicit source/goal/path marking |
| EX-019 embedded proposition | Conditional | Good if scope and attachment are defined | Conditional; phrase attachment must be unambiguous | Conditional; needs clause-boundary rules |
| EX-020–024 questions and negation | Conditional | Conditional; particles and role markers must coexist | Conditional; question scope and phrase scope required | Conditional; interaction rules required |
| EX-027–030 temporal clauses | Weak without special rules | Conditional; temporal roles are not the same as participant roles | Conditional; temporal markers and attachment required | Conditional; needs explicit temporal syntax |
| Concise everyday clauses | Good | Conditional | Conditional | Good if marking is genuinely restricted to needed contexts |
| Flexible word order | Weak | Good in principle | Conditional | Conditional |
| Historical source compatibility | Unknown | Unknown | Unknown | Unknown |
| Canon-ready with current evidence | No | No | No | No |

## 4. Result: the decision is narrower, but still not canon-ready

The comparison does not establish a winning grammar. It establishes that a pure fixed-order system is economical for simple two-participant clauses but becomes under-specified for three-participant verbs and role reversal unless more rules are supplied. Role markers and adpositions can make roles explicit, but both require actual inventories, attachment rules and scope rules. A hybrid system can balance brevity and clarity, but it risks becoming an unbounded escape hatch unless the grammar states exactly when explicit marking is obligatory.

The most defensible **research candidate** is therefore a constrained hybrid, not because it has been proven correct, but because it offers a testable way to keep simple clauses short while requiring explicit distinctions for known high-risk cases. This is a recommendation for the next experiment only. It is not a selection, a canon change, or permission to coin markers.

## 5. Constraints a hybrid proposal would have to satisfy

Before it can be accepted, a hybrid proposal must define all of the following:

1. **Default clause pattern:** the default order for ordinary two-participant clauses, with historical evidence or explicit approval.
2. **Role recovery:** how reversed participants change or preserve meaning.
3. **Three-participant frames:** the exact constructions for GIVE, TEACH and SAY, including recipient vs beneficiary.
4. **Spatial roles:** distinct encodings or explicit documented neutralisation for location, source, goal and path.
5. **Question interaction:** whether question words occupy a fixed slot, can be fronted, or require a marker.
6. **Negation scope:** how clause negation differs from the standalone answer “no”.
7. **Embedding:** how a complement clause is delimited and how its roles are interpreted.
8. **Temporal attachment:** how UNTIL/WHILE relations attach to a clause or event.
9. **Obligatory marking:** a finite list of contexts in which default order is insufficient and overt marking is required.
10. **Ambiguity policy:** if a role cannot be recovered uniquely, the interpretation must be reported as ambiguous rather than guessed.
11. **Register policy:** no automatic transfer of vernacular rules to Technical, Formal or Performed Arcana.
12. **Historical policy:** preserve source forms and version labels; aliases must not erase attested historical tokens.

## 6. Minimal controlled experiment

Use only semantic placeholders at first; do not fabricate Arcane role particles.

### Pair A — reversible two-participant clause
- Meaning 1: person A sees person B.
- Meaning 2: person B sees person A.
- Pass condition: the two meanings remain distinguishable without relying on real-world plausibility.

### Pair B — three participant roles
- Meaning 1: A gives item X to B.
- Meaning 2: A gives item X for B's benefit.
- Pass condition: recipient and beneficiary are distinguishable if the language intends to express both.

### Pair C — motion roles
- Meaning 1: A is at location L.
- Meaning 2: A moves to L.
- Meaning 3: A moves from L.
- Meaning 4: A moves along path P.
- Pass condition: no location, goal, source or path relation is silently substituted for another.

### Pair D — clause scope
- Meaning 1: if A sees B, A tells C.
- Meaning 2: while A sees B, A tells C.
- Pass condition: condition and temporal overlap cannot be confused.

For each pair, record the proposed surface form only after the owner approves the grammar option and its vocabulary. Before approval, the test result is “architecture-level expectation”, not “Arcane sentence passes”.

## 7. Recommendation and next step

**Recommendation:** conduct one constrained hybrid experiment against the Phase 7K bank, while keeping the grammar explicitly provisional. Do not coin a new marker in this phase. First recover any original vernacular examples that could decide the default order or role marking. If the source evidence remains unavailable, present a small owner-reviewable proposal containing two or three alternative surface systems and their complete contrasts, rather than a vague declaration that Arcane uses a hybrid.

The experiment should be rejected or revised if it requires implicit English word order assumptions, conflates recipient and beneficiary, reuses `desh` as “to/from” without approval, imports formal operators into vernacular grammar without a mapping, or cannot flag ambiguous role assignments.

## 8. Decision ledger

- **Finding:** P7L-ARGARCH-01
- **Architecture selected as canon:** none
- **Research candidate:** constrained hybrid, provisional only
- **New lexical forms coined:** none
- **Canon changed:** no
- **Semantic prompts considered:** Phase 7K's 34
- **Implementation tests executed:** none
- **Next deliverable:** historical example recovery or owner-reviewable alternative surface paradigms for the ten participant-role prompts.
