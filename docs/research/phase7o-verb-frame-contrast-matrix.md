# Arcane Phase 7O — verb-frame contrast matrix and ambiguity outcomes

**Status:** Research test specification; not canon  
**Date:** 2026-10-15  
**Finding ID:** P7O-VERBFRAME-MATRIX-01  
**Canon effect:** none  
**Execution status:** Matrix authored; not run against an executable grammar or parser.

## 1. Purpose and evidence boundary

Phase 7N audited the v5 draft lexicon and established that vernacular verb entries are glosses, not complete argument frames. This phase converts the open questions into a repeatable contrast matrix. It does not invent surface sentences, role particles, or new lexical meanings.

Source anchor: `sources/originals/Arcane_Lexicon_v5_draft.csv`. The vernacular lemmas discussed here remain PROPOSED as recorded there. Role labels in this document are semantic metalanguage only.

### Outcome labels

- **DISTINGUISH:** a complete grammar must produce different interpretations.
- **COMPATIBLE:** the contrast may be expressed by one documented construction, if its semantics support it.
- **UNRESOLVED:** current evidence does not choose a frame or construction.
- **REJECT-INFERENCE:** a tempting interpretation must not be inferred from the gloss alone.
- **AMBIGUOUS:** more than one analysis remains possible; the grammar must not silently select one.

## 2. Matrix A — transfer and possession

| ID | Contrast | Required roles or distinction | Current outcome |
|---|---|---|---|
| TR-01 | A gives X to B / B gives X to A | Giver and recipient reverse | DISTINGUISH; surface rule unresolved |
| TR-02 | A gives X to B / A gives X for B's benefit | Recipient versus beneficiary | DISTINGUISH if both readings are expressible; marker unresolved |
| TR-03 | A gives X to B and for C's benefit | Recipient B and beneficiary C can co-occur | UNRESOLVED |
| TR-04 | A gives X / A attempts to give X | Completed transfer versus attempt | UNRESOLVED; do not infer aspectual entailment |
| TR-05 | A takes X from B / B takes X from A | Taker, theme and source | DISTINGUISH; source construction unresolved |
| TR-06 | A takes X / A owns X afterwards | Taking event versus ownership result | REJECT-INFERENCE: ownership change not entailed by gloss alone |
| TR-07 | A gives X to B / A gives X to B using an intermediary | Direct versus mediated transfer | UNRESOLVED; only distinguish if the language intends to encode it |
| TR-08 | Recipient omitted / recipient explicitly stated | Recoverability and omission policy | UNRESOLVED |

## 3. Matrix B — perception and knowledge

| ID | Contrast | Required distinction | Current outcome |
|---|---|---|---|
| PK-01 | A sees B / B sees A | Perceiver and theme reverse | DISTINGUISH |
| PK-02 | A sees B / A sees event E | Entity theme versus event theme | UNRESOLVED |
| PK-03 | A hears sound S / A hears B speaking | Sound versus speaker/event | DISTINGUISH if both readings are supported |
| PK-04 | A hears B speaking / A hears that B arrived | Perceived event versus proposition/content | UNRESOLVED |
| PK-05 | A knows person B / A knows fact P | Entity acquaintance versus propositional knowledge | UNRESOLVED |
| PK-06 | A knows P / A guesses P | Knowledge versus inference/uncertainty | DISTINGUISH semantically; lexical construction unresolved |
| PK-07 | A sees X / A infers X from evidence | Direct perception versus inference | DISTINGUISH; do not conflate with formal NES/DAVE without a documented mapping |
| PK-08 | A hears X / A understands X | Auditory perception versus comprehension | REJECT-INFERENCE: hearing does not entail understanding |

## 4. Matrix C — communication and learning

| ID | Contrast | Required distinction | Current outcome |
|---|---|---|---|
| CL-01 | A says message M / A says M to B | Optional addressee and its role | UNRESOLVED |
| CL-02 | A tells B story S / A tells story S about C | Addressee versus topic | DISTINGUISH; `buk` gloss alone does not establish attachment |
| CL-03 | A says “B helped C” / A says that B helped C | Quotation versus reported proposition | UNRESOLVED |
| CL-04 | A says that B helped C / B says that A helped C | Matrix speaker versus embedded participants | DISTINGUISH; clause boundaries required |
| CL-05 | A teaches B word W / A teaches B skill K | Learner versus content; content type | UNRESOLVED |
| CL-06 | A teaches B / B learns from A | Teaching event versus learning event | DISTINGUISH; teaching does not entail successful learning |
| CL-07 | A learns W / A memorises W | Learning versus memorisation | UNRESOLVED; do not assume synonyms |
| CL-08 | A helps B / A helps B perform X | Affected participant versus action complement | UNRESOLVED |

## 5. Matrix D — motion and deictic reference

| ID | Contrast | Required distinction | Current outcome |
|---|---|---|---|
| MO-01 | A is at L / A goes to L | Static location versus goal | DISTINGUISH |
| MO-02 | A goes to L / A goes from L | Goal versus source | DISTINGUISH |
| MO-03 | A moves along P toward L / A reaches L | Path/direction versus arrival | DISTINGUISH |
| MO-04 | A comes toward the speaker / A goes away from the speaker | Deictic direction | UNRESOLVED: reference centre not defined |
| MO-05 | A goes along P to L | Path and goal can co-occur | UNRESOLVED |
| MO-06 | A approaches L / A enters L | Proximity versus boundary crossing | UNRESOLVED |
| MO-07 | A leaves L / A moves within L | Source/exiting versus internal motion | DISTINGUISH |
| MO-08 | `desh` = in/at / `desh` = to/from | Gloss extension | REJECT-INFERENCE: extension unsupported |

Formal Arcane has the listed spatial relations JO (toward), JUR (away), JA (along), JE (parallel), and JI (aligned/coincident). This matrix does not establish that these formal forms are ordinary vernacular adpositions or that they alone encode all motion frames.

## 6. Matrix E — modality and intentional states

| ID | Contrast | Required distinction | Current outcome |
|---|---|---|---|
| MI-01 | A can lift X / A may lift X with permission | Ability versus permission | DISTINGUISH if both meanings are in scope |
| MI-02 | A can lift X / lifting X is physically possible under C | Agent ability versus event possibility | DISTINGUISH |
| MI-03 | A wants X / A needs X to achieve G | Desire versus goal-relative necessity | DISTINGUISH |
| MI-04 | A wants to leave / A wants B to leave | Subject of desire versus desired event participant | UNRESOLVED |
| MI-05 | A does not want X / A wants not-X | Negation scope | DISTINGUISH |
| MI-06 | A needs X / A needs X only if G | Unconditional versus conditional requirement | UNRESOLVED |
| MI-07 | A can leave / A cannot leave | Polarity scope over modality | DISTINGUISH |
| MI-08 | A is able to act / A actually acts | Ability versus realised event | REJECT-INFERENCE: ability does not entail action |

## 7. Matrix F — argument omission and ambiguity policy

| ID | Contrast | Required behaviour | Current outcome |
|---|---|---|---|
| AM-01 | Same two nouns and verb, reversed semantic roles | Distinct reading or explicit ambiguity | DISTINGUISH |
| AM-02 | Omitted agent / omitted theme | Role recovery rule required | UNRESOLVED |
| AM-03 | Pronoun/reference omitted because context supplies it | Context recovery must be defined, not guessed | UNRESOLVED |
| AM-04 | Two possible attachment sites for a phrase | Grammar must resolve or report ambiguity | AMBIGUOUS until attachment rules exist |
| AM-05 | Main-clause and embedded-clause participant names overlap | Clause-local role assignment | DISTINGUISH; boundary rules required |
| AM-06 | Unknown verb frame | Report unresolved rather than borrow another verb's frame silently | AMBIGUOUS/UNRESOLVED |
| AM-07 | Vernacular example resembles Formal operator sequence | Register remains explicit | REJECT-INFERENCE: surface resemblance does not establish shared syntax |
| AM-08 | Alias and preferred form occur in historical records | Preserve source/version and alias status | No global replacement |

## 8. What this matrix does and does not prove

The matrix supplies a stable set of semantic distinctions against which future proposals can be reviewed. It does not prove that current Arcane surface syntax can express them, and it does not show that all distinctions must be grammatically marked in every context. The owner may choose to neutralise some contrasts, but that must be explicit where it affects intended meaning.

The matrix is not an executable parser suite. No parser, compiler or speaker test has been run. A later implementation should convert each row into a structured fixture with an input, expected interpretation set, ambiguity policy and source/version metadata.

## 9. Minimum grammar decisions exposed by the matrix

Before writing production-ready vernacular examples, a grammar proposal must define:

1. Default clause order, if any.
2. Core role inventory and how roles are realised.
3. Frames for two- and three-participant verbs.
4. Whether recipient and beneficiary are distinct.
5. Whether source, goal, path and static location have distinct constructions.
6. How complement clauses and quotations are delimited.
7. Modality and negation scope.
8. Argument omission and contextual recovery.
9. Whether and how ambiguous parses are represented.
10. Which rules are vernacular-only and which are shared across registers.

These are design decisions, not inferred facts. Historical evidence may resolve some of them; the remaining decisions require explicit approval.

## 10. Decision ledger

- **Finding:** P7O-VERBFRAME-MATRIX-01
- **Contrast rows:** 48
- **Verb groups covered:** transfer, perception/knowledge, communication/learning, motion, modality, ambiguity
- **New lexical forms:** 0
- **New canon rules:** 0
- **Historical clauses recovered:** 0
- **Executable tests run:** 0
- **Next step:** map every Phase 7O row to the Phase 7G tests and Phase 7K prompt bank, then produce a traceability table identifying duplicated coverage, gaps and exact source requirements.
