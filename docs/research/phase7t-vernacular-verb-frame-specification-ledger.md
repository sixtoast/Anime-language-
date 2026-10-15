# Arcane Phase 7T — vernacular verb-frame specification ledger

**Status:** Source-grounded lexical audit and design worksheet; not canon  
**Date:** 2026-10-15  
**Finding ID:** P7T-VERB-FRAMES-01  
**Canon effect:** none  
**Source inspected:** `sources/originals/Arcane_Lexicon_v5_draft.csv`  
**Historical clause recovery:** not achieved  
**Executable tests run:** none

## 1. Purpose and source boundary

This phase returns to the source lexicon and converts its proposed vernacular verb entries into a per-lemma frame ledger. The CSV provides a form, gloss, lexical class, register, status, source and note. For the entries below, the source marks the forms as `V`, `Vernacular`, `PROPOSED`, `Phase 5`.

That evidence establishes only that these forms and glosses were proposed. It does not establish argument count, syntactic category beyond the CSV label, complement type, aspectual entailment, argument omission or a canonical clause order.

No Arcane example sentence is invented in this ledger. Semantic labels such as AGENT, THEME and RECIPIENT are analysis metalanguage, not Arcane morphemes.

## 2. Frame status vocabulary

- **GLOSS-ONLY:** a form and gloss are attested in the draft lexicon, but no complete frame is established.
- **FRAME-QUESTION:** a specific argument/complement distinction needs a decision or source evidence.
- **CONTRAST-REQUIRED:** the semantic distinction must be preserved if both meanings are in scope.
- **SOURCE-NEEDED:** a historical example or explicit grammar rule is needed to establish the frame.
- **NOT-CANON:** none of the proposed vernacular frames in this document should be treated as canonical.

## 3. Transfer and possession

| Lemma | Draft gloss | Candidate semantic roles to investigate | Minimum contrast | Current evidence |
|---|---|---|---|---|
| `bul` | give | GIVER, THEME, RECIPIENT; optionally BENEFICIARY | Recipient versus beneficiary; successful transfer versus attempt; omitted recipient | GLOSS-ONLY; SOURCE-NEEDED |
| `lil` | take | TAKER, THEME; optionally SOURCE | Source versus theme; taking versus subsequent ownership; omitted source | GLOSS-ONLY; SOURCE-NEEDED |

**Frame warning:** the English gloss “give” suggests a transfer scenario, but does not prove that `bul` syntactically requires three arguments or entails successful receipt. “Take” does not prove a source-marking construction or ownership change. Keep those as separate questions.

## 4. Motion

| Lemma | Draft gloss | Candidate semantic roles to investigate | Minimum contrast | Current evidence |
|---|---|---|---|---|
| `ful` | go | MOVER, SOURCE, GOAL, PATH, DEICTIC CENTRE | Static location vs motion; source vs goal; path vs arrival/entry | GLOSS-ONLY; SOURCE-NEEDED |
| `zem` | come | MOVER, GOAL, DEICTIC CENTRE | Come toward which centre? Arrival versus movement toward | GLOSS-ONLY; SOURCE-NEEDED |

**Register boundary:** formal spatial relations JO (toward), JUR (away), JA (along), JE (parallel), and JI (aligned/coincident) are not automatically vernacular frame markers for `ful` or `zem`. The mapping, if any, requires evidence or approval.

## 5. Perception and cognition

| Lemma | Draft gloss | Candidate semantic roles to investigate | Minimum contrast | Current evidence |
|---|---|---|---|---|
| `wish` | see | PERCEIVER, ENTITY/EVENT/PROPOSITION | Entity seen vs event witnessed; seeing vs inferring | GLOSS-ONLY; SOURCE-NEEDED |
| `nak` | hear | HEARER, SOUND/SPEAKER/EVENT/CONTENT | Hearing sound vs hearing someone speak; hearing vs understanding | GLOSS-ONLY; SOURCE-NEEDED |
| `shus` | know | KNOWER, ENTITY/PROPOSITION | Knowing a person vs knowing a fact; knowing vs guessing | GLOSS-ONLY; SOURCE-NEEDED |
| `mos` | learn | LEARNER, CONTENT/SKILL/SOURCE | Learning vs memorising; content vs source/teacher | GLOSS-ONLY; SOURCE-NEEDED |

Do not map these verbs directly onto Formal operators such as NES, SIMA or DAVE solely because the English glosses appear related. Those operators have separate canonical functions and register status.

## 6. Communication and instruction

| Lemma | Draft gloss | Candidate semantic roles to investigate | Minimum contrast | Current evidence |
|---|---|---|---|---|
| `zir` | say | SPEAKER, MESSAGE/PROPOSITION, ADDRESSEE | Message vs addressee; quotation vs reported proposition; embedded roles | GLOSS-ONLY; SOURCE-NEEDED |
| `pup` | teach | TEACHER, LEARNER, CONTENT/SKILL | Learner vs content; teaching vs successful learning; event complement | GLOSS-ONLY; SOURCE-NEEDED |
| `las` | help | HELPER, BENEFICIARY/AFFECTED PERSON, TASK/EVENT | Helping a person vs helping perform an action; direct vs mediated help | GLOSS-ONLY; SOURCE-NEEDED |

The English glosses do not settle whether `zir` allows an explicit addressee, whether `pup` takes a content complement, or whether `las` allows an event complement. Do not assume these frames are identical.

## 7. Intention, need and modality

| Lemma | Draft gloss | Candidate semantic roles to investigate | Minimum contrast | Current evidence |
|---|---|---|---|---|
| `kong` | want | EXPERIENCER, DESIRED ENTITY/EVENT, DESIRED ACTOR | Wanting an object vs wanting an event; experiencer vs embedded actor; negation scope | GLOSS-ONLY; SOURCE-NEEDED |
| `tek` | need | EXPERIENCER, REQUIRED ENTITY/EVENT, GOAL/CONDITION | Need vs want; unconditional vs goal-relative requirement | GLOSS-ONLY; SOURCE-NEEDED |
| `fam` | can | ABILITY HOLDER, ACTION/EVENT, MODAL BASIS | Ability vs permission vs physical possibility; ability vs actual action | GLOSS-ONLY; SOURCE-NEEDED |

These three glosses are especially underdetermined. `fam` cannot safely be assigned a single modal meaning without a decision: ability, permission and event possibility are distinct. Likewise, `tek` may express need, necessity or requirement, but its scope and complement type remain unknown.

## 8. Consumption and waiting

| Lemma | Draft gloss | Candidate semantic roles to investigate | Minimum contrast | Current evidence |
|---|---|---|---|---|
| `mol` | eat | EATER, FOOD/THEME | Theme omission; event vs result; whether an object is obligatory | GLOSS-ONLY; SOURCE-NEEDED |
| `tut` | drink | DRINKER, LIQUID/THEME | Theme omission; event vs result; whether an object is obligatory | GLOSS-ONLY; SOURCE-NEEDED |
| `shem` | wait | WAITER, EXPECTED EVENT/PERSON, DURATION/DEADLINE | Wait for event vs wait for person vs wait for duration; until vs for | GLOSS-ONLY; SOURCE-NEEDED |

The English verb “wait” is compatible with several constructions in English, but that does not prove Arcane uses the same complement distinctions. Proposed temporal vocabulary in the wider draft remains proposed; do not use it to fill the frame without a documented rule.

## 9. Adpositions are not automatically argument markers

The same draft lexicon proposes:
- `desh` — in/at
- `ding` — with
- `push` — for
- `buk` — about
- `ges` — than

These are recorded as proposed vernacular prepositions. The entries do not prove:
- that these forms mark grammatical case or core arguments;
- that `push` marks both recipient and beneficiary;
- that `desh` marks goal/source as well as static location;
- that `buk` has a defined attachment site;
- that `ding` expresses instrument, accompaniment, manner or all three.

Keep their glosses narrow until the language owner approves an extension or source evidence supports one.

## 10. Compact frame record for future corpus work

For each lemma, use a record with these fields:

| Field | Rule |
|---|---|
| `lemma` | Exact token from the source, preserving case and diacritics |
| `source_gloss` | Exact source gloss; do not silently refine it |
| `lexical_status` | Copy the source status |
| `register` | Copy the source register |
| `frame` | Leave unknown unless attested or approved |
| `complement_types` | List only supported types; otherwise unresolved |
| `omission_policy` | Required, optional, context-recoverable, or unresolved |
| `semantic_entailments` | Explicitly distinguish entailed, compatible and not entailed |
| `source_example` | Exact quotation and location, or empty |
| `derived_example` | Separate field with PROPOSED/RECONSTRUCTED status |
| `contrast_ids` | Relevant VF, EX, P7O or GAP test IDs |
| `decision_ref` | Explicit approval reference if canonised |

## 11. Readiness and next step

The source lexicon confirms a useful proposed verb inventory, but not a complete vernacular grammar. The next productive step is to recover the text of the historical Phase 4 and Phase 5 audit documents through a route that can extract DOCX XML, then search for actual clause examples, role marking, complement syntax and explicit word-order statements.

The DOCX files are retrievable through GitHub's base64 response, confirming that the binary files are present. The current GitHub text-fetch route cannot decode their binary bytes as UTF-8. This phase does not claim to have extracted or read their internal document text. A suitable document-extraction route remains necessary.

If source extraction remains unavailable, the next decision should be explicit: whether to author a new vernacular grammar as a designed modern layer, keeping it distinct from the historical layers, or defer surface grammar decisions until evidence becomes available.

## 12. Decision ledger

- **Finding:** P7T-VERB-FRAMES-01
- **Proposed verbs inventoried:** 14
- **Proposed adpositions reviewed:** 5
- **New Arcane forms:** 0
- **New canon rules:** 0
- **Historical clauses recovered:** 0
- **Executable tests run:** 0
- **Next step:** historical DOCX text extraction and exact clause inventory.
