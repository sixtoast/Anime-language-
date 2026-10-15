# Arcane Phase 7G — verb-frame contrast and ambiguity test pack

**Status:** Test specification; not canon  
**Date:** 2026-10-15  
**Source basis:** `sources/originals/Arcane_Lexicon_v5_draft.csv`; `docs/canon/arcane-language-v3.0-L.md`; Phase 7E and 7F research notes  
**Canon changes:** none  
**Execution status:** test cases authored, not run against a parser

## 1. What this pack tests

The source lexicon marks the tested vernacular lemmas as **PROPOSED**. Their glosses are evidence for candidate meanings, not evidence for their argument counts, role marking, word order, or complement syntax. The canon's formal argument rules must not be silently imported into vernacular grammar.

Accordingly, these cases use a neutral semantic metalanguage, not Arcane surface sentences. They define distinctions that a future grammar should either encode uniquely or explicitly mark unresolved.

## 2. Test record conventions

- **MUST-DISTINGUISH:** the intended meanings cannot be treated as equivalent.
- **MUST-RESOLVE:** a complete grammar must recover the roles uniquely.
- **UNRESOLVED:** current source evidence does not determine a surface construction.
- **NEGATIVE:** a proposed reading must not be inferred from the available evidence alone.

## 3. Transfer and possession

### VF-001 — GIVE role separation
**Scenario:** A gives item X to B.  
**Must distinguish:** giver=A, theme=X, recipient=B.  
**Failure:** the grammar cannot tell whether B receives X or gives X.

### VF-002 — GIVE participant reversal
**Scenario:** B gives item X to A.  
**Must distinguish:** this is not equivalent to VF-001.  
**Failure:** role reversal leaves the interpretation unchanged or ambiguous.

### VF-003 — Recipient versus beneficiary
**Scenario:** A gives X to B for C's benefit.  
**Must distinguish:** B is recipient; C is beneficiary.  
**Status:** UNRESOLVED; no surface role markers established.

### VF-004 — TAKE source versus agent
**Scenario:** A takes X from B.  
**Must distinguish:** A initiates taking; B is source; X is theme.  
**Negative:** do not assume the gloss `lil` specifies whether ownership changes permanently.

## 4. Motion and location

### VF-005 — GO destination
**Scenario:** A goes to location L.  
**Must resolve:** L is goal, not source or path.

### VF-006 — GO source
**Scenario:** A goes from location L.  
**Must distinguish:** L is source, not goal.

### VF-007 — GO path
**Scenario:** A moves along route P toward L.  
**Must distinguish:** path P from goal L.

### VF-008 — COME reference point
**Scenario:** A comes toward the current deictic centre.  
**Must resolve:** which participant or location defines “here”.  
**Status:** UNRESOLVED.

### VF-009 — DESH overextension
**Evidence:** lexicon entry `desh` has proposed gloss “in/at”.  
**Negative:** do not use it as “to”, “from” or “along” without a source or explicit design decision.

## 5. Perception and knowledge

### VF-010 — SEE experiencer/theme
**Scenario:** A sees B.  
**Must resolve:** A is perceiver; B is perceived theme.

### VF-011 — SEE event
**Scenario:** A sees event E occur.  
**Question:** can the theme be an event rather than a concrete entity?  
**Status:** UNRESOLVED.

### VF-012 — HEAR sound versus speaker
**Scenario A:** A hears sound S.  
**Scenario B:** A hears B speaking.  
**Must distinguish:** sound, speaker and communicated content are not automatically the same semantic role.

### VF-013 — KNOW entity versus proposition
**Scenario A:** A knows person B.  
**Scenario B:** A knows proposition P.  
**Question:** one frame or separate frames?  
**Status:** UNRESOLVED.

## 6. Communication and learning

### VF-014 — SAY content versus recipient
**Scenario:** A says message M to B.  
**Must distinguish:** A=speaker, M=content, B=recipient/addressee.

### VF-015 — SAY nested proposition
**Scenario:** A says that B helped C.  
**Must resolve:** the embedded proposition's boundaries and internal roles.  
**Failure:** more than one parse is accepted without an ambiguity report.

### VF-016 — TEACH learner versus content
**Scenario:** A teaches B subject S.  
**Must distinguish:** A=teacher, B=learner, S=content/skill.

### VF-017 — LEARN content type
**Scenario:** A learns word W versus A learns skill K.  
**Question:** are both themes permitted, or do they require different constructions?  
**Status:** UNRESOLVED.

## 7. Modality, desire and necessity

### VF-018 — CAN: ability
**Scenario:** A is able to perform action X.  
**Must distinguish:** capacity from permission.

### VF-019 — CAN: permission
**Scenario:** A is permitted to perform action X.  
**Must distinguish:** permission from physical capability.

### VF-020 — CAN: physical possibility
**Scenario:** action X is physically possible under conditions C.  
**Must distinguish:** physical possibility from a speaker's desire or permission.

### VF-021 — WANT versus NEED
**Scenario A:** A wants X.  
**Scenario B:** A needs X to achieve goal G.  
**Must distinguish:** desire from goal-relative necessity.

### VF-022 — Stated effect versus mechanism
**Scenario:** A wants effect E to occur.  
**Negative:** do not infer that the relevant physical mechanism exists or is feasible.  
**Principle:** intention is not causation.

## 8. Consumption and omitted arguments

### VF-023 — EAT explicit theme
**Scenario:** A eats food X.  
**Must resolve:** A=eater; X=consumed theme.

### VF-024 — EAT omitted theme
**Scenario:** A eats, with no food noun expressed.  
**Question:** is the theme optional, contextually recoverable, or grammatically required?  
**Status:** UNRESOLVED.

### VF-025 — DRINK explicit substance
**Scenario:** A drinks liquid X.  
**Must resolve:** A=drinker; X=consumed substance.

### VF-026 — DRINK omitted substance
**Scenario:** A drinks, with no substance noun expressed.  
**Question:** is omission licensed and under what context conditions?  
**Status:** UNRESOLVED.

## 9. Helping and waiting

### VF-027 — HELP beneficiary versus task
**Scenario:** A helps B with task T.  
**Must distinguish:** B=beneficiary/participant; T=task or theme.  
**Status:** UNRESOLVED for surface syntax.

### VF-028 — WAIT event versus duration
**Scenario A:** A waits for event E.  
**Scenario B:** A waits for duration D.  
**Must distinguish:** expected event from elapsed time.

## 10. Registry acceptance gate

A verb-frame entry is ready for approval only when it records:
1. source and lexical status;
2. proposed or accepted semantic roles;
3. required, optional and contextually omitted arguments;
4. role realisation in surface grammar, with provenance;
5. at least one positive example;
6. at least one counterexample or near-minimal contrast;
7. ambiguity behaviour;
8. register and version scope;
9. interactions with nested content and temporal modifiers where applicable.

A gloss alone passes none of the syntactic acceptance criteria.

## 11. Result and next action

This pack turns the most important role distinctions into 28 reviewable cases. It does not claim to validate Arcane sentences because no canonical vernacular syntax has yet been established for these verbs.

**Next:** recover historical vernacular examples if available; otherwise choose explicitly among limited grammar alternatives (for example, fixed order, role particles, or adpositions) and test the choice against this pack before canon promotion.
