# Arcane Phase 7P — test traceability and coverage-gap register

**Status:** Research traceability artifact; not canon  
**Date:** 2026-10-15  
**Finding ID:** P7P-TRACE-01  
**Canon effect:** none  
**Execution status:** Static crosswalk authored; no executable tests run.

## 1. Purpose

Phase 7O defines 48 semantic contrast rows. Phase 7G defines 28 verb-frame tests, and Phase 7K defines 34 semantic prompts. This document maps their coverage, identifies duplicated and uncovered requirements, and proposes a stable route from research notes to a future executable test suite.

The crosswalk is a documentation-level traceability exercise. Similar wording is not proof that two tests are identical, and a mapping does not mean a parser has passed either test.

## 2. Identifier conventions

- **P7O:** Phase 7O matrix IDs: TR, PK, CL, MO, MI and AM.
- **VF:** Phase 7G test IDs VF-001 through VF-028.
- **EX:** Phase 7K prompt IDs EX-001 through EX-034.
- **Direct:** close semantic match.
- **Partial:** related, but does not cover every distinction in the P7O row.
- **Gap:** no adequate existing test was found in the inspected Phase 7G/7K material.
- **Negative guard:** an explicit prohibition on an unsupported inference, rather than a positive construction test.

## 3. Traceability matrix

| P7O row | Requirement | Phase 7G mapping | Phase 7K mapping | Coverage status / note |
|---|---|---|---|---|
| TR-01 | Reverse giver and recipient | VF-001, VF-002 | EX-003, EX-004 | Direct |
| TR-02 | Recipient vs beneficiary | VF-003 | EX-003, EX-005 | Direct; beneficiary marker unresolved |
| TR-03 | Recipient and separate beneficiary co-occur | VF-003 | EX-005 | Partial; EX-005 has beneficiary contrast but no third participant |
| TR-04 | Completed transfer vs attempt | — | — | Gap; add event-completion/attempt test |
| TR-05 | Taker, theme and source; reverse roles | VF-004 | EX-006 | Partial; reversal should be explicit in a paired case |
| TR-06 | Taking does not entail ownership change | VF-004 | EX-006 | Negative guard present in VF-004 |
| TR-07 | Direct vs mediated transfer | — | — | Gap; only needed if this semantic contrast is in scope |
| TR-08 | Recipient omission policy | — | — | Gap; add omission pair |
| PK-01 | Reverse perceiver and theme | VF-010 | EX-001, EX-002 | Direct |
| PK-02 | Entity vs event perceived | VF-011 | — | Partial; VF-011 covers it, no EX prompt |
| PK-03 | Hear sound vs hear speaker | VF-012 | — | Partial; no Phase 7K prompt |
| PK-04 | Hear event vs hear proposition | VF-012 | — | Partial; requires explicit proposition contrast |
| PK-05 | Know entity vs know proposition | VF-013 | — | Partial |
| PK-06 | Know vs guess/infer | — | EX-032 | Partial; EX-032 contrasts NES/SIMA/DAVE, not vernacular knowing vs guessing |
| PK-07 | Perception vs inference | — | EX-032 | Partial; formal operators are not vernacular equivalents |
| PK-08 | Hearing does not entail understanding | — | — | Gap / negative guard |
| CL-01 | Message vs addressee | VF-014 | EX-009 | Direct, though addressee optionality remains open |
| CL-02 | Addressee vs topic | VF-014 | EX-009 | Partial; topic/about phrase is not in EX-009 |
| CL-03 | Direct quotation vs reported proposition | VF-015 | EX-019 | Partial; EX-019 is reported proposition only |
| CL-04 | Main vs embedded participant roles | VF-015 | EX-019 | Direct at a broad level; reversal should be paired explicitly |
| CL-05 | Teaching word vs skill | VF-016, VF-017 | EX-008 | Partial |
| CL-06 | Teaching does not entail learning | VF-016 | EX-008 | Partial; consequence contrast not explicit in EX-008 |
| CL-07 | Learning vs memorisation | VF-017 | — | Gap |
| CL-08 | Helping participant vs task complement | VF-027 | EX-007 | Partial |
| MO-01 | Static location vs goal | VF-005 | EX-011, EX-012 | Direct |
| MO-02 | Goal vs source | VF-005, VF-006 | EX-012, EX-013 | Direct |
| MO-03 | Path/direction vs arrival | VF-007 | EX-014, EX-015 | Direct; include non-arrival condition |
| MO-04 | Come/go deictic direction | VF-008 | EX-013, EX-016 | Partial; current centre not explicit in EX prompts |
| MO-05 | Path and goal co-occurrence | VF-007 | EX-014, EX-015 | Partial; co-occurrence needs its own case |
| MO-06 | Approach vs enter | — | — | Gap |
| MO-07 | Leave/exiting vs internal movement | — | EX-016 | Partial; away-direction is not the same as leaving a bounded region |
| MO-08 | Do not extend desh to to/from | VF-009 | EX-011–EX-013 | Negative guard |
| MI-01 | Ability vs permission | VF-018, VF-019 | — | Direct in VF suite; no EX prompt |
| MI-02 | Ability vs event possibility | VF-018, VF-020 | — | Direct in VF suite |
| MI-03 | Want vs goal-relative need | VF-021 | EX-010, EX-033 | Partial; EX-033 concerns desired physical effect, not need |
| MI-04 | Want self to act vs want another to act | — | — | Gap |
| MI-05 | Not want X vs want not-X | — | EX-024 | Gap/partial; EX-024 tests clause negation, not scope over desire |
| MI-06 | Need X vs need X only under G | VF-021 | — | Partial; goal relation exists, conditional necessity does not |
| MI-07 | Can vs cannot | — | EX-024 | Gap/partial; EX-024 is not negation of modality |
| MI-08 | Ability does not entail action | VF-018 | — | Negative guard should be made explicit |
| AM-01 | Reverse semantic roles with same lexical items | VF-002, VF-010 | EX-001, EX-002, EX-003, EX-004 | Direct across two verb types |
| AM-02 | Omitted agent/theme | VF-024, VF-026 | — | Partial; omission only tested for eat/drink |
| AM-03 | Contextually omitted reference | — | — | Gap |
| AM-04 | Attachment ambiguity | VF-015, VF-027 | EX-019 | Partial; generic attachment case absent |
| AM-05 | Main/embedded role overlap | VF-015 | EX-019 | Direct at broad level |
| AM-06 | Unknown verb frame must remain unresolved | VF acceptance gate | All prompts with unresolved status | Policy coverage, not a concrete case |
| AM-07 | Vernacular syntax not inferred from Formal resemblance | VF-022 | EX-029, EX-031–EX-034 | Negative guard |
| AM-08 | Preserve aliases and source strata | — | Evidence policy | Policy coverage; needs a separate registry fixture |

## 4. Coverage summary

The three documents serve different purposes:

- **Phase 7G** supplies verb-specific contrast requirements, including several cases not represented in Phase 7O, such as EAT/DRINK argument omission, waiting for an event versus a duration, and the principle that desired effects do not establish mechanisms.
- **Phase 7K** supplies 34 broader semantic prompts spanning roles, space, questions, polarity, time and the distinction between information operations and physical effects.
- **Phase 7O** adds finer-grained contrasts such as transfer completion, mediated transfer, knowing versus guessing, quotation versus reported speech, approach versus entry, and modality scope.

Therefore, the suites overlap but are not interchangeable. Keep all three identifiers in the future test registry until an explicit deduplication decision records the retained test and the requirements it covers.

## 5. Highest-priority uncovered cases

The following gaps are most likely to expose grammar design failures:

1. **TR-04 / TR-08:** attempt versus completed transfer, and omission of a recipient.
2. **PK-08:** hearing versus understanding.
3. **CL-07:** learning versus memorisation.
4. **MO-06:** approach versus entry across a spatial boundary.
5. **MI-04 / MI-05 / MI-07:** embedded desire participant and negation scope over desire/modality.
6. **AM-03:** context-dependent omitted arguments.
7. **AM-08:** machine-readable alias/version preservation test.
8. **VF-023–VF-026:** preserve the existing eat/drink cases even though they are not in the 48-row P7O matrix.

These gaps should not all be filled by adding vocabulary. Many require syntax, semantic entailment policy or a test harness capable of representing ambiguity.

## 6. Proposed future fixture record

Each executable fixture should carry the following fields. This is a schema proposal, not an assertion about the website's current data model:

| Field | Purpose |
|---|---|
| `id` | Stable test identifier; never reuse an ID for changed semantics |
| `source_refs` | Source documents, version and relevant section |
| `register` | Vernacular, Technical, Formal or Performed |
| `status` | Canon, proposal, reconstruction or unresolved |
| `input_kind` | Semantic prompt, constructed string or source-attested string |
| `input` | Exact tested representation |
| `expected_readings` | Allowed interpretation set |
| `forbidden_readings` | Interpretations that must not be inferred |
| `ambiguity_policy` | Unique parse, allowed ambiguity or unresolved |
| `observed_result` | Actual test output; empty until executed |
| `execution_environment` | Parser/tool version and run metadata |
| `decision_ref` | Canon decision or research finding that authorises the expected result |

A semantic prompt should not be placed in a field that implies it is an Arcane sentence. A proposed surface sentence must retain its proposal status and the grammar assumptions that generated it.

## 7. Validation rules for the future registry

1. Every test ID is unique and stable.
2. Every canonical expected result has a source or explicit canon decision.
3. Every proposed result names the assumptions used to derive it.
4. Reversal tests change exactly the intended participant roles.
5. Negative guards test the absence of an unjustified inference, not only the presence of a desired reading.
6. An unresolved case may pass only if the tool correctly reports unresolved/ambiguous; it must not pass by guessing.
7. A documentation cross-reference is not a test execution result.
8. Historical aliases remain traceable to their original token and version.
9. Register boundaries are retained.
10. A fixture's observed output is recorded only after an actual run.

## 8. Result and next action

This crosswalk identifies both direct coverage and the gaps that the existing research sets do not adequately cover. It does not establish any new grammar rule, and it does not claim that a parser has been tested.

**Next phase:** add the missing high-priority semantic cases to a companion gap pack, then review how the current website's existing audit/test registries can represent the test metadata without changing the website's scope or claiming it implements Arcane semantics. The website remains a research tool; this project phase remains language specification work.

## 9. Decision ledger

- **Finding:** P7P-TRACE-01
- **P7O rows cross-referenced:** 48
- **Source suites compared:** Phase 7G (28 cases), Phase 7K (34 prompts)
- **New lexical forms:** 0
- **New canon rules:** 0
- **Historical clauses recovered:** 0
- **Executable tests run:** 0
- **Next action:** author the high-priority gap pack and preserve suite-level provenance.
