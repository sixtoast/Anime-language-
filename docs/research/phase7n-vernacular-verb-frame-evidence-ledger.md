# Arcane Phase 7N — vernacular verb-frame evidence ledger

**Status:** Evidence ledger and test specification; not canon  
**Date:** 2026-10-15  
**Finding ID:** P7N-VERBFRAME-EVIDENCE-01  
**Canon effect:** none  
**Tests executed:** none; source inspection and specification work only.

## 1. Purpose

Phase 7M compared three controlled participant-role prototypes. This phase returns to the actual v5 draft lexicon and separates what it records from what a grammar would still have to define. The immediate objective is to prevent lexical glosses from silently becoming argument-structure rules.

The inspected file is `sources/originals/Arcane_Lexicon_v5_draft.csv`. The entries below record the fields present in that file. Their status remains PROPOSED where the source says PROPOSED. The lexicon is evidence that a form and gloss were drafted; it is not by itself evidence for a complete verb frame.

## 2. Direct source inventory

| Lemma | Draft gloss | Lexical class | Register | Status | What the entry alone does not establish |
|---|---|---|---|---|---|
| `wish` | see | V | Vernacular | PROPOSED | Whether it requires an experiencer and theme; whether an event can be seen; whether perception is direct or inferential |
| `nak` | hear | V | Vernacular | PROPOSED | Whether the complement is a sound, a speaker, an utterance or content; whether these use one frame |
| `shus` | know | V | Vernacular | PROPOSED | Whether the object is an entity, fact or proposition; complement syntax |
| `bul` | give | V | Vernacular | PROPOSED | Whether recipient is a core argument or oblique; recipient/beneficiary distinction; transfer entailments |
| `lil` | take | V | Vernacular | PROPOSED | Agent, theme and source encoding; whether possession or ownership changes |
| `las` | help | V | Vernacular | Helper/affected roles; whether a goal or activity complement is possible |
| `mos` | learn | V | Vernacular | Learner and content roles; whether word, fact, skill and proposition are treated alike |
| `pup` | teach | V | Vernacular | Teacher, learner and content roles; whether the learner can be omitted |
| `zir` | say | V | Vernacular | Speaker, message, addressee and embedded proposition; whether “say to” is one frame or multiple constructions |
| `ful` | go | V | Vernacular | Goal, source, path and manner; whether destination requires an adposition |
| `zem` | come | V | Vernacular | Deictic centre, goal/source/path and perspective |
| `kong` | want | V | Vernacular | Experiencer and desired theme; whether a proposition can be wanted |
| `tek` | need | V | Vernacular | Experiencer, needed entity/action and relation to a goal |
| `fam` | can | V | Vernacular | Ability, permission and physical possibility; scope over actions or propositions |

**Source conclusion:** these are lexical glosses, not source-attested argument frames. No frame in the table should be marked CANON on the strength of these entries.

## 3. Supporting noun and adposition anchors

| Form | Draft gloss | Status | Safe conclusion |
|---|---|---|---|
| `teshi` | person | PROPOSED | Candidate noun for human participant |
| `fezo` | friend | PROPOSED | Candidate noun for human participant |
| `fape` | book | PROPOSED | Candidate theme/content noun |
| `rawu` | word | PROPOSED | Candidate content noun |
| `wule` | story | PROPOSED | Candidate message/content noun |
| `gezi` | home | PROPOSED | Candidate location noun |
| `desh` | in/at | PROPOSED | Do not extend to goal, source or path |
| `ding` | with | PROPOSED | Does not alone distinguish accompaniment from instrument |
| `push` | for | PROPOSED | Does not alone establish beneficiary or recipient marking |
| `buk` | about | PROPOSED | Does not define complement attachment or scope |
| `ges` | than | PROPOSED | Comparative construction remains undefined |

This phase does not broaden any gloss. In particular, `desh` is not a recovered “to/from” marker, and `push` is not a proven beneficiary marker.

## 4. Verb-frame records

Each frame below is a semantic requirement, not a proposed Arcane surface sentence. Roles are described in English so the analysis does not depend on invented particles or an unapproved word order.

### VF-A — SEE (`wish`)

- **Core contrast:** perceiver versus perceived entity.
- **Baseline:** A sees B.
- **Reversal:** B sees A.
- **Open questions:** Can the perceived theme be an event or proposition? Does the verb entail successful perception, or can it describe an attempt/line of sight?
- **Minimum test:** reverse the two participants and ensure the interpretation reverses; separately test an entity theme and an event theme.
- **Evidence state:** lemma/gloss recorded; frame unresolved.

### VF-B — HEAR (`nak`)

- **Core contrast:** hear a sound versus hear a person speak versus hear a message.
- **Open questions:** Are sound, speaker and communicated content distinct argument types? Can an utterance be embedded?
- **Minimum test:** “A hears a bell”; “A hears B speaking”; “A hears that B has arrived”. The latter two must not collapse unless the language explicitly neutralises them.
- **Evidence state:** lemma/gloss recorded; frame unresolved.

### VF-C — GIVE (`bul`)

- **Core roles:** giver, transferred theme, recipient; optional beneficiary may be distinct.
- **Open questions:** Is recipient obligatory? Can the recipient be omitted if recoverable? Is beneficiary marked differently? Does “give” entail a completed transfer or merely an attempted transfer?
- **Minimum test:** A gives X to B; B gives X to A; A gives X for C's benefit; A gives X to B for C's benefit.
- **Failure condition:** recipient and beneficiary are indistinguishable, or participant reversal is not recoverable.
- **Evidence state:** lemma/gloss recorded; frame unresolved.

### VF-D — TAKE (`lil`)

- **Core roles:** taker, theme, possible source.
- **Open questions:** Is source expressed as a core argument, an oblique phrase or a separate construction? Does taking entail possession, removal or ownership transfer?
- **Minimum test:** A takes X from B; B takes X from A; A takes X without a stated source.
- **Failure condition:** source is confused with theme or an ownership claim is inferred without evidence.
- **Evidence state:** lemma/gloss recorded; frame unresolved.

### VF-E — HELP (`las`)

- **Core roles:** helper and affected participant; possible task/goal.
- **Open questions:** Can a task be the complement? Is “help B do X” distinct from “help B with X”?
- **Minimum test:** A helps B; A helps B read; A helps B with a task. Record whether one construction or several is supported.
- **Evidence state:** lemma/gloss recorded; frame unresolved.

### VF-F — LEARN (`mos`) and TEACH (`pup`)

- **Learn roles:** learner and acquired content/skill.
- **Teach roles:** teacher, learner and content/skill.
- **Open questions:** Are word, fact, language, skill and proposition interchangeable content types? Can the learner or content be omitted? Does teach imply successful learning?
- **Minimum test:** A learns a word; A learns a skill; A teaches B a word; A teaches B to swim; A teaches B that C arrived.
- **Failure condition:** content and learner roles cannot be distinguished, or teaching is incorrectly treated as proof that learning occurred.
- **Evidence state:** both lemma/glosses recorded; frames unresolved.

### VF-G — SAY (`zir`)

- **Core roles:** speaker, message/content, possible addressee.
- **Open questions:** Is addressee part of the same frame? How is an embedded proposition delimited? Can a quote and a reported proposition differ?
- **Minimum test:** A says “hello”; A tells B a story; A says that B helped C; A says a message to B for C's benefit.
- **Failure condition:** embedded roles leak into the main clause, or message and addressee are confused.
- **Evidence state:** lemma/gloss recorded; frame and complement syntax unresolved.

### VF-H — WANT (`kong`) and NEED (`tek`)

- **Want roles:** experiencer and desired entity/action/proposition.
- **Need roles:** experiencer and required entity/action, potentially relative to a goal or condition.
- **Open questions:** Does want permit an event complement? Does need encode a practical requirement or merely strong desire? What scope do negation and possibility have?
- **Minimum test:** A wants a book; A wants to leave; A needs water; A needs to leave to achieve goal G.
- **Failure condition:** want and need are treated as synonymous or a goal-relative requirement is omitted where it changes meaning.
- **Evidence state:** lemma/glosses recorded; frames unresolved.

### VF-I — GO (`ful`) and COME (`zem`)

- **Core roles/relations:** mover, optional source, goal and path; come additionally raises a deictic-centre question.
- **Open questions:** Is destination a core argument or a spatial phrase? What determines “here”? Does “toward” entail arrival? Can path and goal occur together?
- **Minimum test:** A is at L; A goes to L; A goes from L; A travels along P toward L without arriving; A comes toward the current deictic centre.
- **Failure condition:** static location, goal, source and path are treated as interchangeable.
- **Evidence state:** lemma/glosses recorded; frames and vernacular spatial constructions unresolved.

### VF-J — CAN (`fam`)

- **Potential readings:** ability/capacity, permission and physical possibility.
- **Open questions:** Does one word cover all readings? What is its scope: action, proposition or participant? Is permission socially granted, while ability describes capacity?
- **Minimum test:** A can lift X (ability); A can leave (permission); X can occur under conditions C (physical possibility).
- **Failure condition:** permission is inferred from capacity, or physical feasibility is inferred from desire.
- **Evidence state:** lemma/gloss recorded; modality distinctions unresolved.

## 5. Cross-frame requirements

The grammar must not assume every verb takes the same number or kind of arguments. At minimum it must define:

1. **Role inventory:** which semantic roles are distinguished in the vernacular and which are intentionally neutralised.
2. **Argument count:** required, optional and disallowed arguments per verb or verb class.
3. **Realisation:** how roles appear in surface syntax; no role-marker forms are supplied here.
4. **Omission:** when an argument may be omitted and whether the omitted role is recoverable.
5. **Embedding:** how a proposition or quotation is delimited and scoped.
6. **Spatial attachment:** how location/source/goal/path phrases attach to the intended event.
7. **Question interaction:** how questioning a role preserves all other role assignments.
8. **Negation and modality:** how negation scopes over the verb and how ability, permission and possibility differ.
9. **Register:** no automatic inheritance of vernacular frames by Formal or Performed Arcana.
10. **Ambiguity policy:** return an unresolved/ambiguous analysis instead of choosing based on plausibility alone.

## 6. Evidence quality ladder

Use these labels in future records:

- **L0 — gloss only:** source gives a word and a translation gloss.
- **L1 — semantic frame proposal:** roles are proposed in a neutral metalanguage.
- **L2 — constructed surface example:** a surface string is generated under an explicit provisional grammar.
- **L3 — reviewed contrast set:** the same grammar is tested against positive, reversed and ambiguous cases.
- **L4 — source-attested example:** exact form and interpretation are recoverable from a named source, version and register.
- **L5 — canon-approved rule:** the owner accepts a rule after reviewing the evidence and consequences.

A higher level is not automatically reached by accumulating more examples of the same kind. In particular, ten constructed SVO sentences remain L2, not historical evidence.

## 7. Result and next action

This audit confirms the immediate blocker is not lack of vocabulary: the draft contains useful verb lemmas. The blocker is the missing link between each gloss and its syntactic/semantic frame. The next productive work is to test the frames in this ledger and search the historical documents for exact clauses, while preserving source status.

If historical sources remain inaccessible or contain no relevant clauses, the next owner-reviewable decision should concern the architecture and the finite role inventory—not the invention of dozens of markers. Once a system is chosen, write full surface paradigms for EX-001–EX-010, including reversals and ambiguous negatives, and then apply the wider 34-prompt bank.

## 8. Decision ledger

- **Finding:** P7N-VERBFRAME-EVIDENCE-01
- **Source file inspected:** `sources/originals/Arcane_Lexicon_v5_draft.csv`
- **Vernacular verb lemmas audited:** 14
- **Historical vernacular clauses recovered in this phase:** 0
- **New Arcane forms coined:** 0
- **Frames promoted to canon:** 0
- **Canon changed:** no
- **Parser/speaker tests executed:** none
- **Next phase:** turn this ledger into a pass/fail test matrix and continue source recovery, prioritising GIVE, SAY, motion, perception and modality.
