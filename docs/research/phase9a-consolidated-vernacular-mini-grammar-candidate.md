# Arcane Phase 9A — consolidated vernacular mini-grammar candidate

**Status:** Working learner specification; all unapproved grammar remains proposed  
**Date:** 2026-10-15  
**Canon effect:** none  
**New vocabulary:** none  
**Historical vernacular syntax recovered:** no  
**Implementation changes:** none  
**Tests executed:** none

## 1. What this document is

This is the first consolidated learner-facing snapshot of the proposed Vernacular register, assembled from the Phase 5 draft lexicon and the Phase 7–8 pilots. It is deliberately small: a learner should be able to recognise the current proposed vocabulary, practise a handful of simple patterns, and see exactly where the grammar remains incomplete.

It is **not** a canonical grammar, historical reconstruction, or executable language specification. The v3.0-L source distinguishes Vernacular from Formal Arcane and does not establish a complete vernacular clause grammar. All grammar choices below remain proposals until approved or supported by primary-source evidence.

## 2. Status labels

- **SOURCE-RECORDED PROPOSAL:** a form/gloss appears in the v5 draft lexicon, marked PROPOSED.
- **PILOT RULE:** a grammar pattern used to test examples; not source-established.
- **UNRESOLVED:** the available evidence does not support a safe rule or surface form.
- **CANON BOUNDARY:** an established distinction that this learner proposal must not erase.

## 3. Scope and register boundary

Arcane has distinct registers, including Vernacular, Technical, Formal and Performed Arcana. This document covers only proposed everyday Vernacular.

Do not assume that:
- formal head-initial operator notation determines vernacular word order;
- Formal `GRASH` (NOT) defines a vernacular negation particle;
- Formal spatial relations directly serve as vernacular prepositions;
- a vernacular word with a similar English gloss is interchangeable with a Formal operator;
- a proposed form is canonical merely because it is used in an example.

## 4. Proposed starter vocabulary

### 4.1 Greetings and responses

| Form | Proposed meaning | Current use in this pilot |
|---|---|---|
| `zis` | hello | standalone greeting |
| `lal` | goodbye | standalone farewell |
| `sil` | thanks | standalone thanks |
| `nong` | sorry | standalone apology |
| `val` | please | pragmatic particle; placement unresolved |
| `lap` | polite | pragmatic particle; placement provisional |
| `jus` | respectful | pragmatic particle; placement provisional |
| `wang` | yes | standalone response candidate |
| `kor` | no | standalone response candidate, not clause negation |
| `gep` | maybe | standalone uncertainty response |

### 4.2 Questions

| Form | Proposed meaning | Current status |
|---|---|---|
| `pun` | yes/no question particle | clause-final placement is a pilot rule |
| `shuk` | who | in-situ placement is a pilot candidate |
| `zosh` | what | in-situ placement is a pilot candidate |
| `ving` | where | adjunct/argument status unresolved |
| `zul` | when | temporal syntax unresolved |
| `gir` | why | reason-adjunct syntax unresolved |
| `jup` | how | manner/means/method distinction unresolved |

### 4.3 People, places and things

| Form | Proposed meaning |
|---|---|
| `teshi` | person |
| `fezo` | friend |
| `gezi` | home |
| `fape` | book |
| `rawu` | word |
| `wule` | story |
| `losa` | water |
| `gisho` | food |
| `vusi` | mage |
| `mewa` | spell/construction |

### 4.4 Starter verbs

| Form | Proposed meaning | Important unresolved frame issue |
|---|---|---|
| `ful` | go | source, goal, path and arrival |
| `zem` | come | deictic centre, goal and arrival |
| `wish` | see | entity vs event vs proposition |
| `nak` | hear | sound vs speaker vs message |
| `zir` | say | speaker, message and addressee |
| `shus` | know | entity vs fact/proposition |
| `kong` | want | desired entity vs desired event |
| `tek` | need | needed entity vs required event |
| `fam` | can | ability vs permission vs possibility |
| `las` | help | beneficiary, task and degree of help |
| `mos` | learn | content, skill, source or teacher |
| `pup` | teach | learner, content and method |
| `bul` | give | giver, theme, recipient; successful transfer |
| `lil` | take | taker, theme and source |
| `mol` | eat | eater, food and optional object omission |
| `tut` | drink | drinker, liquid and optional object omission |
| `shem` | wait | person waiting, expected event and endpoint |

All vocabulary in these tables remains source-recorded proposal, not canon.

## 5. Minimal pilot clause pattern

**PILOT RULE:** For simple declarative clauses, use:

```text
SUBJECT + VERB + OBJECT/COMPLEMENT
```

This is the provisional SVO baseline. It is not a recovered historical rule. It is suitable only for low-ambiguity examples where the intended roles are clear from the test context.

Pilot examples:
- `teshi wish fezo` — “The person sees the friend.”
- `teshi kong losa` — “The person wants water.”
- `teshi mol gisho` — “The person eats food.”

These examples test a grammar hypothesis; they do not prove that the corresponding verb frame is canonical. In particular, an English gloss does not settle argument count, omission, aspect or entailment.

## 6. Yes/no questions and answers

**PILOT RULE:** Put `pun` after a simple clause to test a yes/no question.

- `teshi wish fezo pun` — “Does the person see the friend?”

Response candidates:
- `wang` — “Yes.”
- `kor` — “No.”
- `gep` — “Maybe.”

The answer particles are proposed vocabulary. Their truth-conditional behaviour in negatively phrased questions is unresolved. Until it is decided, avoid using a bare answer to a negative question in materials where ambiguity matters.

## 7. Information questions

**PILOT CANDIDATE:** Put the question word in the slot of the missing constituent.

- `shuk wish fezo` — “Who sees the friend?”
- `teshi wish zosh` — “What does the person see?”

The pattern remains unverified. `ving`, `zul`, `gir` and `jup` ask about location, time, reason and manner/method, but their grammatical roles and placement are not yet established. Do not combine them with `pun` until co-occurrence is specified.

## 8. Particles and aspect

The lexicon proposes `don` (“already/done”) and `kok` (“ongoing”), as well as `lap` (polite), `jus` (respectful), `fut` (emphatic) and `wit` (topic). Their exact position, scope and interactions are unresolved. This mini-grammar does not prescribe example placements for them, because doing so would create an unverified rule.

## 9. Negation: deliberately not fabricated

The available proposed vocabulary does not establish a vernacular clause-negation marker. `kor` is glossed “no” as a response word. Formal `GRASH` is a NOT operator in a different register; importing it into Vernacular would be an unsupported change.

Therefore:
- standalone `kor` can be practised as a response candidate;
- “The person does not see the friend” has no approved Arcane surface form in this specification;
- “cannot”, “must not”, “may not” and “not” must remain distinct meanings;
- no NEG placeholder from the research documents should be spoken as if it were Arcane vocabulary.

## 10. Temporal expressions: do not guess

The canonical specification names temporal concepts, but complete forms and signatures are not all recovered. The v5 lexicon lists proposed forms including `boni` (now), `vote` (before), `fuwo` (after), `kole` (until), `shasu` (delay), `wela` (duration), `vitu` (repetition interval), `showa` (deadline), and `leko` (predict).

These remain proposals. This mini-grammar does not insert them into ordinary clauses until argument structure, units, temporal anchors, and register mapping are settled.

## 11. Short learner practice

All items are practice prompts based on the proposed pilot rules.

| Prompt | Candidate response | Intended interpretation | Status |
|---|---|---|---|
| Greet someone | `zis` | Hello. | Proposed interjection |
| Say thanks | `sil` | Thanks. | Proposed interjection |
| Ask whether the person sees the friend | `teshi wish fezo pun` | Does the person see the friend? | SVO + PUN pilot |
| Ask who sees the friend | `shuk wish fezo` | Who sees the friend? | In-situ question pilot |
| Ask what the person sees | `teshi wish zosh` | What does the person see? | In-situ question pilot |
| Answer yes | `wang` | Yes. | Proposed response |
| Answer no | `kor` | No. | Proposed response only |
| Express uncertainty | `gep` | Maybe. | Proposed response |
| Say goodbye | `lal` | Goodbye. | Proposed interjection |
| Say the person does not see the friend | **UNRESOLVED** | Negative clause | Do not invent a form |

## 12. Minimum competence boundary

A learner can currently practise the proposed greetings, responses and a few clause/question patterns as **experimental Vernacular**. They cannot yet be promised a complete or canonical conversational grammar. In particular, the following remain blockers to a fuller course:
- approved clause order and argument-role policy;
- verb-specific complement frames;
- information-question placement;
- clause negation and its scope;
- aspect particle placement;
- temporal clause syntax;
- source-attested dialogue and pronunciation/prosody evidence.

## 13. Next work

This mini-grammar is a consolidation point, not a reason to keep generating more isolated examples. The next work should either recover primary-source evidence or make a small number of explicit design decisions, then update this learner snapshot and test the resulting examples for consistency. Do not silently promote any proposal.

- **Decision ID:** P9A-CONSOLIDATED-VERNACULAR-MINI-GRAMMAR-01
- **Canon changes:** none.
- **New vocabulary:** none.
- **Implementation changes:** none.
- **Tests executed:** none.
