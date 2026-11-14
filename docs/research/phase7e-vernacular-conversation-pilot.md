# Arcane Phase 7E — vernacular conversation pilot

**Status:** Proposed learner-facing extension; not canon  
**Date:** 2026-10-15  
**Sources:** `docs/canon/arcane-language-v3.0-L.md`; `sources/originals/Arcane_Lexicon_v5_draft.csv`  
**Canon effect:** none

## 1. Why this phase

The canonical specification explicitly says Arcane supports ordinary conversation and distinguishes Vernacular, Technical, Formal and Performed registers. It also states that the formal control notation is not the same as everyday speech. The v5 draft lexicon contains a sizeable Phase 5 vernacular vocabulary, but its entries are marked PROPOSED and the supplied core specification does not establish a complete vernacular syntax.

This phase tests whether the surviving proposed vocabulary can support a small useful conversation without pretending the proposed grammar is already canon. The examples below are a pilot, not canonical phrases.

## 2. Vocabulary used in the pilot

### Conversation particles and responses

| Form | Proposed gloss |
|---|---|
| pun | yes/no question particle |
| lap | polite particle |
| jus | respectful particle |
| fut | emphatic particle |
| wit | topic particle |
| don | already/done |
| kok | ongoing |
| wang | yes |
| kor | no |
| gep | maybe |
| zis | hello |
| lal | goodbye |
| sil | thanks |
| nong | sorry |
| val | please |

### Question words

| Form | Proposed gloss |
|---|---|
| shuk | who |
| zosh | what |
| ving | where |
| zul | when |
| gir | why |
| jup | how |

### Nouns and verbs

| Form | Proposed gloss |
|---|---|
| teshi | person |
| fezo | friend |
| gezi | home |
| fape | book |
| rawu | word |
| wule | story |
| losa | water |
| gisho | food |
| vusi | mage |
| mewa | spell/construction |
| ful | go |
| zem | come |
| wish | see |
| nak | hear |
| zir | say |
| shus | know |
| kong | want |
| tek | need |
| fam | can |
| las | help |
| mos | learn |
| pup | teach |
| bul | give |
| lil | take |
| mol | eat |
| tut | drink |
| shem | wait |

All of these entries are source-recorded proposed forms, not promoted canon.

## 3. Minimal pilot grammar

To produce examples that can be discussed and tested, this pilot uses three explicit assumptions. They are not source-established rules.

- **P1 — basic clause order:** Subject + Verb + Object (SVO) for ordinary declarative clauses.
- **P2 — question marking:** append `pun` to a yes/no question; use the proposed question word in the slot for the requested information.
- **P3 — particles:** `lap` and `jus` are optional pragmatic particles; their exact placement is provisional. For this pilot, place them at the end of the clause.

Why use these assumptions? They create a simple first learner test without changing formal head-initial Arcane. Formal operator syntax is head-initial; vernacular word order is a distinct unresolved layer and must be decided from historical examples or an explicit design choice. SVO is selected here only as a provisional experiment because the Phase 5 vocabulary resembles a natural spoken register; it is not inferred from the formal operator syntax.

No tense inflection is added. If temporal reference is needed, use an explicit English gloss until canonical temporal forms and syntax are recovered. Do not silently insert `boni`, `vote`, `fuwo`, `shasu` or other proposed temporal forms into learner examples as if they were approved.

## 4. Provisional conversation examples

The Arcane strings in this section are **constructed pilot examples under P1–P3**, not source-attested canonical sentences. Their intended meanings are shown so they can be reviewed and revised.

| ID | Pilot string | Intended meaning | Notes |
|---|---|---|---|
| VERN-001 | `zis` | Hello. | Interjection; no clause grammar needed. |
| VERN-002 | `sil` | Thanks. | Interjection. |
| VERN-003 | `nong` | Sorry. | Interjection. |
| VERN-004 | `lal` | Goodbye. | Interjection. |
| VERN-005 | `teshi wish fezo` | The person sees the friend. | SVO hypothesis. |
| VERN-006 | `teshi kong losa` | The person wants water. | SVO hypothesis; verb selection needs validation. |
| VERN-007 | `teshi tek losa` | The person needs water. | SVO hypothesis. |
| VERN-008 | `teshi mol gisho` | The person eats food. | SVO hypothesis. |
| VERN-009 | `teshi tut losa` | The person drinks water. | SVO hypothesis. |
| VERN-010 | `teshi mos rawu` | The person learns a word. | SVO hypothesis. |
| VERN-011 | `teshi pup fezo` | The person teaches the friend. | SVO hypothesis; object roles need review. |
| VERN-012 | `teshi las fezo` | The person helps the friend. | SVO hypothesis. |
| VERN-013 | `teshi zem gezi` | The person comes home. | SVO hypothesis; `gezi` as destination without a preposition is unconfirmed. |
| VERN-014 | `teshi ful gezi` | The person goes home. | SVO hypothesis; same destination issue. |
| VERN-015 | `teshi wish fezo pun` | Does the person see the friend? | Question particle position is provisional. |
| VERN-016 | `shuk wish fezo` | Who sees the friend? | WH slot and word order provisional. |
| VERN-017 | `teshi wish zosh` | What does the person see? | WH object position provisional. |
| VERN-018 | `teshi zem ving` | Where does the person come? | WH slot provisional. |
| VERN-019 | `wang` | Yes. | Proposed response particle. |
| VERN-020 | `kor` | No. | Proposed response particle. |
| VERN-021 | `teshi mos rawu lap` | The person learns a word, please/politely. | Particle scope is not settled; meaning is only a test gloss. |
| VERN-022 | `teshi kok mos rawu` | The person is learning a word / learning is ongoing. | `kok` placement and scope are unresolved. |
| VERN-023 | `teshi don zem` | The person has already come. | `don` scope and aspect semantics unresolved. |

These examples deliberately include uncertainty notes. They should not be used to claim that all argument frames, destination marking, question syntax or aspect particles have been settled.

## 5. Grammar issues exposed by the pilot

The pilot makes a few decisions impossible to avoid. These should be handled one at a time, with corpus evidence where available.

### 5.1 Clause order

The formal specification's `HEAD + ARGUMENTS + MODIFIERS` is a compositional rule for formal expressions. It does not automatically establish SVO or any other order for vernacular clauses. Recover historical vernacular examples before locking the pilot's SVO assumption.

### 5.2 Arguments versus obliques

The examples `teshi ful gezi` and `teshi zem gezi` use a location noun as a destination without a preposition. The Phase 5 lexicon has proposed prepositions `desh` (in/at), `ding` (with), `push` (for), `buk` (about), and `ges` (than), but does not provide a source-established directional preposition. Therefore the destination examples are useful tests but not accepted grammar. Do not assume `desh` means “to”.

### 5.3 Tense and aspect

The canon explicitly prioritises explicit temporal relationships instead of ordinary tense, but everyday language still needs ways to talk about completed, ongoing and future events. The proposed `don` (“already/done”) and `kok` (“ongoing”) may help, but their exact scope and compatibility with verbs are not established. Do not build a full tense paradigm by analogy.

### 5.4 Questions

The inventory contains yes/no particle `pun` and question words. It does not establish whether question words remain in situ, move to the front, or require a particle. Pilot examples are designed to test these choices, not to settle them.

### 5.5 Politeness and respect

The existence of `lap` and `jus` supports a candidate pragmatic distinction between politeness and respect. It does not establish their placement or whether both may occur together. These meanings should be elicited through short contrasting dialogue rather than assigning them extra grammatical functions.

## 6. Test matrix

These tests are specified for future corpus/grammar validation; they have not been executed.

1. **Lexical status:** every word in a canonical example must be canon; a pilot example may use proposed entries only if labelled provisional.
2. **Declarative baseline:** each transitive test clause identifies subject, predicate and object under the selected pilot order.
3. **Verb frame:** verbs such as `ful`, `zem`, `wish`, `mos`, `pup` and `bul` receive independently documented argument frames.
4. **Question scope:** `pun` marks the whole yes/no clause rather than accidentally attaching to the object.
5. **WH uniqueness:** every question-word clause has one recoverable WH role.
6. **No invented preposition:** destination marking remains unresolved until a form is source-attested or explicitly approved.
7. **Particle scope:** `don` and `kok` do not receive fixed scope until their placement and interaction are defined.
8. **Register separation:** vernacular examples are not parsed as formal operator expressions merely because both use the same spelling inventory.
9. **Translation transparency:** each constructed sentence has a literal gloss and a natural-language gloss; the latter cannot conceal missing grammar.
10. **Unique performed parse:** a compressed/performed form must not be treated as executable if any role or boundary is ambiguous.

## 7. Decision ledger

- **Proposal ID:** P7E-01
- **Proposal:** use SVO as a temporary vernacular pilot order for test examples.
- **Alternatives:** (A) wait for recovered vernacular examples; (B) use SVO provisionally; (C) use the formal head-initial operator order for all registers.
- **Recommendation:** B for a clearly labelled pilot only; A for canonical promotion; reject C because the specification distinguishes formal Arcana from ordinary speech and its surface grammar.
- **Evidence:** v3.0-L §§2 and 13; Phase 5 proposed lexicon.
- **Risk:** pilot examples may be mistaken for established forms if not labelled clearly.
- **Safeguard:** every constructed sentence in this document is explicitly provisional; no canon files are modified.
- **Decision status:** PROPOSAL; not approved canon.

## 8. Next step

Use the pilot to recover or approve a small vernacular grammar in this order:
1. clause order and argument marking;
2. transitive/intransitive verb frames;
3. yes/no and WH question syntax;
4. destination/location marking;
5. negation, already/completed and ongoing aspect;
6. politeness/respect particle scope;
7. short source-traceable dialogues and counterexamples.

Do not add hundreds of words before the existing vocabulary can form reliable, unambiguous sentences.

## 9. Status

- Canonical specification reviewed: **yes**.
- Proposed vernacular lexicon used: **yes**.
- Small learner conversation pilot drafted: **yes, provisional**.
- Canon changed: **no**.
- Source-attested dialogue recovered: **no**.
- Automated grammar tests run: **no**.
