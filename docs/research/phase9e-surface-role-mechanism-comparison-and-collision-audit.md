# Arcane Phase 9E — surface role-mechanism comparison and collision audit

**Status:** Design comparison and bounded prototype recommendation; not canon  
**Date:** 2026-10-15  
**Canon changes:** none  
**New Arcane forms:** none  
**Tests executed:** none; this is a static design audit against existing source inventories and semantic fixtures

## 1. Purpose

Phase 9D established a semantic role inventory and mandatory-disambiguation gates. Phase 9E compares four mechanisms for expressing those roles in the proposed modern Vernacular layer:

- fixed constituent order;
- dedicated role particles/markers;
- existing adpositions;
- a controlled hybrid.

This is a design comparison, not a claim about the historical grammar. It also checks whether the existing proposed adpositions can safely be stretched to carry roles they were not glossed for. No candidate marker is coined or promoted here.

## 2. Design constraints

Any candidate must satisfy all of these constraints:

1. Recover the intended participant roles in reversible two-participant clauses.
2. Distinguish three or more core roles without relying on English plausibility.
3. Keep recipient distinct from beneficiary and source distinct from theme.
4. Distinguish location, goal, source, path and arrival.
5. Preserve addressee, topic and message distinctions.
6. Provide a route to clause embedding and scope without role leakage.
7. Avoid assuming that every semantic role requires its own morpheme.
8. Avoid overloading an existing word beyond its recorded gloss without an explicit extension decision.
9. Avoid collisions with existing Arcane tokens, digits, fused references, clitics and formal operators.
10. Be teachable in a narrow learner grammar and expandable without silent reinterpretation.
11. Preserve historical aliases and source strata.
12. Fail visibly where no licensed construction expresses the intended contrast.

## 3. Candidate comparison

Scores are qualitative design judgements (1 = poor, 5 = strong), not speaker-study data. The weights prioritise semantic recoverability and safe growth.

| Criterion | Weight | A: fixed order | B: dedicated role markers | C: adpositions only | D: controlled hybrid |
|---|---:|---:|---:|---:|---:|
| Reversible participant roles | 15% | 4 | 5 | 3 | 5 |
| Three-plus core roles | 15% | 2 | 5 | 4 | 4 |
| Recipient/beneficiary/source distinctions | 15% | 2 | 5 | 4 | 5 |
| Spatial-role precision | 10% | 2 | 4 | 4 | 4 |
| Concision for simple clauses | 10% | 5 | 2 | 3 | 4 |
| Current source support | 10% | 3 | 1 | 2 | 3 |
| Collision risk before forms are chosen | 10% | 4 | 1 | 2 | 3 |
| Incremental teaching and extension | 10% | 4 | 2 | 3 | 5 |
| Explicit ambiguity handling | 5% | 2 | 4 | 3 | 5 |
| **Weighted score / 5** | **100%** | **3.10** | **3.55** | **3.20** | **4.25** |

The score for fixed order assumes a carefully restricted simple-clause domain. The role-marker score assumes a complete, collision-free system; no such surface system currently exists. The adposition score is limited because the current proposed inventory has glosses, not fully specified semantic ranges and attachment rules. The hybrid wins as a *development architecture*, not as an established fact about Arcane.

## 4. Mechanism A — fixed order

### Suitable use
A stable order is an economical teaching default for a validated two-participant frame. The Phase 7M examples `teshi wish fezo` and `fezo wish teshi` illustrate the intended reversal logic of the SVO hypothesis.

### Blocking conditions
Fixed order alone does not solve:
- three core participants, as in giving/teaching;
- the distinction between recipient and beneficiary;
- source phrases in take/motion frames;
- matrix and embedded participants;
- phrase attachment and scope;
- any construction in which order is not fixed.

**Finding:** retain only as a restricted pilot rule. Do not declare universal SVO grammar.

## 5. Mechanism B — dedicated role markers

### Suitable use
A complete marker system could make roles explicit even when order changes and could encode several participants in a clause.

### Blocking conditions
No approved vernacular marker inventory, forms, placement, attachment, co-occurrence or omission policy currently exists. English labels such as `RECIPIENT:` in research tables are metalanguage and must never be mistaken for spoken Arcane.

Existing short forms are particularly risky: the project already records lexical/digit/reference collisions such as `re` and `ra`, and performed clitics with register-specific behaviour. A marker cannot be selected merely because a short sound is available.

**Finding:** promising in principle, unavailable as a speakable construction today.

## 6. Mechanism C — reuse the current adpositions

| Existing proposal | Recorded draft gloss | Safe present use | Not licensed by gloss alone |
|---|---|---|---|
| `desh` | in/at | Candidate static location phrase | to, from, along, through, enter |
| `ding` | with | Candidate relation whose exact attachment remains open | instrument, companion, co-agent as one undifferentiated meaning |
| `push` | for | Candidate for-phrase | recipient, beneficiary, purpose, duration and price as a single relation |
| `buk` | about | Candidate about-phrase | addressee, message complement or arbitrary clause attachment |
| `ges` | than | Candidate comparative standard | cause, source or unrestricted comparison syntax |

The current glosses do not establish that these words can serve as general case markers. Overloading them now would make the grammar appear more complete while hiding semantic ambiguity.

**Finding:** use only within each narrow draft gloss, and only after phrase attachment is specified. Extensions require separate decisions and contrast tests.

## 7. Mechanism D — controlled hybrid

The controlled hybrid combines a narrow default order with licensed role-bearing constructions where needed. Its strength is that it can state *when the simple strategy stops being sufficient*.

### Candidate mandatory triggers

| Trigger class | Minimum condition | Required result |
|---|---|---|
| Reversible roles | Two participants can plausibly exchange semantic roles | Unique role recovery or explicit ambiguity |
| Additional core role | More than two core roles are present | Each role independently recoverable |
| Relational contrast | Source/goal/path/location/recipient/beneficiary distinction affects meaning | Use a construction licensed for that relation |
| Embedding | A clause contains another event/proposition | Clause boundaries and role scope recoverable |
| Scope | Negation, modality or question scope changes interpretation | One licensed reading or explicit ambiguity |
| Omission | An omitted participant has multiple plausible antecedents | Require expression or report ambiguity |
| Cross-register form | A formal/historical token is proposed for vernacular use | Explicit compatibility decision before use |

These triggers are operational, but they do not dictate how a future surface marker must look.

## 8. Collision audit

### 8.1 Lexical and numeric collisions
The existing lexicon records `re` both as digit 4 and TARGET-surface reference; `ra` is recorded as a radian unit and TARGET-path reference. These collisions already demonstrate why short role markers need a slot/boundary/register policy.

### 8.2 Historical aliases
The registry records preferred forms and compatibility aliases, including FRAJA/FRATA, FRAMA/FRAKA, DRUM/DRIM, BEN/REN, GRASH/GRAK, KWASH/KWAK and DRAS/DRAL. A Vernacular marker must not be introduced by silently repurposing a historical token or rewriting old sources.

### 8.3 Register collisions
Formal spatial operators such as JO, JUR, JA, JE and JI have their own documented conceptual domain and unresolved signatures. They are not ready-made Vernacular prepositions or case markers. Reusing them would require an explicit cross-register mapping and new evidence.

### 8.4 Clitics and scope
Recorded performed clitics include `s-`, `sh-`, `f-`, `wi` and `we`. Their existing interpretations are not permission to use the same forms as general participant markers. Attachment, ordering and scope need to be tested separately.

### 8.5 Adposition attachment
A phrase such as “about B” can attach to a message, a speaking event or a nominal expression. The word `buk` does not by itself resolve those attachment sites. A marker inventory alone will not solve clause structure.

## 9. Fixture-level outcomes

| Fixture | Required semantic distinction | Best current mechanism status |
|---|---|---|
| ROLE-01: A sees B / B sees A | Reversible perceiver and theme | SVO is a candidate for a restricted pilot; verb frame remains proposed |
| ROLE-02: give X to B / for C's benefit | Recipient vs beneficiary | No current surface construction established |
| ROLE-03: give X to B for C | Three roles | Requires a new, specified construction |
| ROLE-04: take X from B / reversed | Taker, theme, source | No source construction established |
| ROLE-05: at L / go to L | Location vs goal | `desh` cannot be expanded to goal from its gloss alone |
| ROLE-06: toward L but stop short / arrive | Orientation vs arrival | Must keep distinct; surface form blocked |
| ROLE-07: say M to B / say M about B | Addressee vs topic | `buk` does not mark addressee |
| ROLE-08: quote exact words / report P | Quotation vs proposition | Embedding/content boundaries unresolved |
| ROLE-09: want B to leave / want to leave | Embedded actor | Embedded clause syntax unresolved |
| ROLE-10: able / permitted | Modal reading | `fam` gloss insufficient |
| ROLE-12: not want P / want not-P | Negation scope | Full negative-clause syntax unresolved |
| ROLE-15: historical token / alias | Source provenance | Preserve source/version records |

## 10. Recommendation

Advance **Mechanism D, controlled hybrid**, to a tiny teaching prototype only within the already hypothesised two-participant SVO domain. Keep all more complex cases as semantic prompts until a surface construction is defined. Do not invent role markers or broaden existing adposition glosses in this phase.

The prototype should be judged by whether it can communicate a small set of complete, reversible utterances consistently, not by the number of theoretical roles it lists. The immediate next step is a **minimal surface grammar pilot** with explicit accept/reject outcomes and a small practice corpus. Complex roles stay blocked, and the learner-facing grammar must label this boundary clearly.

## 11. Decision record

- **Finding ID:** P9E-SURFACE-ROLE-MECHANISM-COMPARISON-01
- **Preferred development architecture:** controlled hybrid
- **Approved spoken markers:** none
- **Allowed pilot domain:** candidate simple SVO clauses, subject to frame-specific validation
- **Complex role constructions:** blocked
- **Canon promotion:** none
- **New vocabulary:** none
- **Implementation changes:** none
- **Tests executed:** none
- **Sources:** Phase 9D role inventory; Phase 7H marking alternatives; Phase 7M role prototypes; Phase 7U adposition audit; Phase 7V bounded clause prototype; Phase 7B lexicon-strata audit.
