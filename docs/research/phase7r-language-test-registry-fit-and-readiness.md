# Arcane Phase 7R — language-test registry fit and grammar readiness ledger

**Status:** Research and design-readiness record; not canon  
**Date:** 2026-10-15  
**Finding ID:** P7R-REGISTRY-FIT-01  
**Canon effect:** none  
**Website changes:** none  
**Executable tests run:** none in this phase

## 1. Purpose

Phases 7P and 7Q identified gaps in the semantic test suites. This phase checks whether the workbench's documented registry structures can represent those gaps honestly and records what the language project needs next. The workbench is being inspected as a tool; this phase does not modify the website.

Inspected repository files:
- `README.md`
- `src/engine/testRegistry.ts`
- `src/engine/canonAuditRegistry.ts`
- `src/engine/phase6gFixtureAudit.ts`
- `src/engine/auditParser.ts`
- `docs/research/phase7m-controlled-vernacular-role-system-prototypes.md`

This is a static reading of retrieved source files, not a build, runtime, browser, or test execution.

## 2. What the current registries actually represent

### 2.1 Workbench test registry

The current `WorkbenchTest` record in `src/engine/testRegistry.ts` has these fields:
- `id`
- `group`
- `title`
- `description`
- `status`
- `file`
- `sourceRule`

The listed status values are `authored-unverified` and `blocked-by-specification`. The listed groups include Parser, Dimensions, Semantic types and Operator contracts.

**Finding:** this is a compact index of implementation/design tests, not a full semantic corpus schema. It has no dedicated fields for register, historical version, input kind, source attestation, expected reading set, forbidden inference, ambiguity policy or observed run metadata. Some information could be embedded in descriptions, but that would be less structured and easier to lose.

### 2.2 Canon audit registry

The current `CanonAuditItem` in `src/engine/canonAuditRegistry.ts` records:
- a stable ID and title;
- a domain;
- readiness;
- a source rule;
- current evidence;
- next requirement.

This is useful for tracking open specification and implementation requirements. It is not a substitute for a test case: a readiness statement does not contain a controlled input and expected output.

### 2.3 Phase 6G fixture audit

The retrieved `src/engine/phase6gFixtureAudit.ts` uses explicit fixtures with an input, expected result, expected node/error family and canon status, then records observed acceptance/rejection and diagnostics. Its own comments describe the output as observations, not acceptance.

This is a useful precedent for evidence separation, but the current surface parser is not a vernacular parser. The existing fixture harness must not be used to claim that a proposed vernacular sentence has been parsed correctly unless that input format and rule set are actually supported.

### 2.4 Phase 2 audit parser

The retrieved `src/engine/auditParser.ts` expressly parses provisional Phase 2 audit notation only. It checks a small set of provisional operator arities and returns a structural tree. It is not an ordinary spoken/written Arcane grammar, and it does not validate the semantic frames in Phases 7G–7Q.

The README also says the current engine does not yet provide complete dimensional type checking, semantic validation, physical feasibility analysis or spell execution. This phase does not change that status.

## 3. Registry-fit result

| Research need | Existing structure | Fit |
|---|---|---|
| Track an open grammar decision | Canon audit registry | Good for decision-level status |
| Index an implementation test | Workbench test registry | Good for compact index |
| Record exact parser observation | Phase 6G fixture audit | Good only for its supported surface-parser format |
| Preserve a vernacular semantic prompt | No dedicated structured record identified | Documented prompt bank remains appropriate |
| Preserve source version/register and attestation | Not first-class in the inspected test registry | Must remain explicit in research records until a schema is deliberately designed |
| Record multiple allowed readings or unresolved ambiguity | Not first-class in the compact registry | Requires a future fixture design, not an assumed capability |
| Distinguish historical, reconstructed and proposed forms | Canon status exists in some fixtures, but no general provenance schema was identified | Keep source/version/status in the language corpus |

**Conclusion:** do not force the vernacular semantic corpus into the existing parser-test registry prematurely. The current research documents are the right place to record prompts and evidence until the grammar and an appropriate test representation exist.

## 4. Evidence classification to use from now on

Each future example or test should be assigned one of these statuses:

- **ATTESTED:** exact form found in a historical or canonical source; record source, version, register and location.
- **RECONSTRUCTED:** proposed form or rule derived from evidence; record the derivation and alternatives.
- **PROPOSED:** new design intended for review; never use it as evidence for the rule that generated it.
- **SEMANTIC PROMPT:** meaning stated in neutral metalanguage, not an Arcane sentence.
- **EXECUTED OBSERVATION:** exact input actually run through a named tool/version, with output recorded.
- **CANON-APPROVED:** accepted through an explicit decision; this status does not itself mean a parser implements it.

These labels are orthogonal where appropriate: a proposed surface string can later be executed in a prototype, but execution does not make it historical or canonical.

## 5. Grammar readiness ledger

| Requirement | Evidence now | Readiness | Next meaningful action |
|---|---|---|---|
| Vernacular default clause order | Pilot and prototypes only; Phase 7F warns against inferring SVO | Blocked | Recover a historical clause or submit a narrow explicit decision |
| Two-participant role recovery | Semantic contrasts established, encoding unknown | Blocked | Compare source examples, then test chosen order/marking |
| Three-participant frames | GIVE/TEACH/SAY prompts; source lexicon glosses only | Blocked | Recover verb-specific frames or design and approve them explicitly |
| Recipient vs beneficiary | Semantic distinction established; construction unknown | Blocked | Decide whether grammar marks them separately and how |
| Source, goal, path, static location | Formal relations partly documented; vernacular mapping unknown | Partially documented | Keep registers separate; define vernacular mapping only with evidence/approval |
| Embedded clauses and quotation | Prompts and tests exist; clause boundary syntax unknown | Blocked | Recover examples or design a complement/quotation contrast |
| Negation and modality scope | Semantic requirements listed; vernacular scope unknown | Blocked | Specify intended scope distinctions before surface forms |
| Omitted arguments and ambiguity | Gaps identified; recovery policy unknown | Blocked | Define when omission is allowed and when ambiguity is reported |
| Lexical frame metadata | Glosses and proposed status available for some entries | Partial | Record only source-supported roles; keep unknown fields unknown |
| Parser acceptance | Current parser targets other notations | Not applicable yet | Do not create false pass/fail results for unsupported input |

## 6. Immediate language-development recommendation

The most productive next move is to stop expanding lists of abstract unresolved questions and assemble a **small source-backed vernacular dossier**. It should contain:

1. Every recoverable historical vernacular clause, copied exactly with provenance.
2. A line-by-line distinction between attested tokens and editor-added segmentation or gloss.
3. The narrowest grammar generalisation supported by each example.
4. Counterexamples and competing analyses.
5. The existing EX/VF/TR/PK/CL/MO/MI/GAP test IDs that would challenge each generalisation.
6. A decision docket for any remaining choice that cannot be settled from evidence.

The currently retrieved DOCX source files have previously failed through one GitHub fetch path because binary content was decoded as UTF-8. That is a retrieval limitation, not proof that the source files contain no usable examples. Recovery should try a text-extraction-capable route or repository-side exported text if available; it must not invent historical clauses to fill the gap.

If no usable historical clauses can be recovered, the owner can decide whether to approve a constrained hybrid as a new design choice. That decision should specify defaults and required-marking environments before coining any role-marker forms. The Phase 7M hybrid is a candidate, not an adopted rule.

## 7. What must not happen

- Do not change website code just to make the language appear more complete.
- Do not label the current Phase 2 parser a vernacular parser.
- Do not treat a test index as evidence that a test ran.
- Do not upgrade a proposed word to canon because it appears in an example.
- Do not treat a gloss or English translation as proof of argument structure.
- Do not treat missing source evidence as evidence that no historical rule existed.
- Do not collapse register/version strata or globally replace aliases.
- Do not mark an unresolved result as a pass unless the test explicitly expects a safe unresolved/ambiguous diagnostic.

## 8. Decision ledger

- **Finding:** P7R-REGISTRY-FIT-01
- **Registry/source files statically inspected:** 6
- **Website code changed:** no
- **New Arcane forms:** 0
- **New canon rules:** 0
- **Historical clauses recovered in this phase:** 0
- **Executable tests run:** 0
- **Recommended next phase:** source-backed clause recovery and evidence ledger; if source recovery remains blocked, prepare a bounded owner decision for vernacular clause architecture.
