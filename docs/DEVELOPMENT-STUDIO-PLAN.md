# Anime Language Development Studio — Product Plan

**Status:** Working product plan; not language canon  
**Purpose:** Make the workbench a compact, high-leverage environment for developing Arcane accurately and efficiently.

## Product objective

Help the language designer and AI collaborator discover source evidence, identify unresolved decisions, compare candidate rules, test consequences, implement confirmed rules, and resume work without losing context. Optimise for correctness and reduced research/implementation time, not feature count.

## Product principles

1. **One shared knowledge model.** A rule, source passage, example, open question, decision, implementation, and test should link to one another rather than be duplicated across unrelated screens.
2. **Evidence before authority.** Distinguish canonical source text, interpretation, candidate proposal, approved decision, implemented behaviour, and executed test evidence.
3. **Unknown is a valid result.** Missing or conflicting evidence produces an explicit unresolved state; never fill gaps with invented grammar or semantics.
4. **Impact-aware changes.** Before a rule changes, show affected examples, dependent rules, contracts, code, tests, and documentation where those links are known.
5. **Small surface area.** Prefer improving the existing Overview, Documentation, Playground, Test suite, and Research & review sections over adding many top-level sections.
6. **AI-assisted, human-governed.** AI may summarise sources, propose alternatives, find conflicts, draft tests, and prepare changes. It must not silently promote a proposal to canon or claim unexecuted tests passed.
7. **Traceable claims.** Every status or readiness statement must say what evidence supports it and when it was last verified.
8. **Portable context.** Store project state in version-controlled files so a future session can resume without depending on hidden conversation memory.

## Core capabilities (prioritised)

### P0 — Trustworthy baseline and source inventory
- Keep CI green and show the latest verified commit/run separately from the latest successful published report.
- Inventory canonical specifications, historical/source uploads, audit drafts, code, tests, and generated reports.
- Mark source provenance explicitly: user-supplied original, imported transcription, derived summary, proposal, or implementation note.
- Record missing source versions as missing; do not reconstruct them from memory.
- Each source inventory entry records path, version/date if known, authority/status, provenance, and whether the original file is preserved.

### P1 — Development cockpit (Overview)
A compact summary, not another dashboard maze:
- current verified build/test status and commit;
- top blockers ranked by dependency and impact;
- recently changed rules/files;
- decisions awaiting approval;
- source gaps needing recovery;
- a single recommended next task with rationale, affected files/rules, and acceptance criteria.
The recommendation must be derived from actual project state and must not present stale CI data as current.

### P1 — Linked rule and evidence records
Each important rule should be traceable through: source passage → extracted claim → status/decision → examples/fixtures → implementation → tests.
Keep canonical statements separate from interpretations and proposals. Add stable IDs and precise source-section anchors incrementally.

### P1 — Research and decision workflow
For an open question:
1. state the question and why it matters;
2. attach exact sources and quote/section references;
3. list competing interpretations without prematurely selecting one;
4. record constraints, implications, counterexamples, and affected rules;
5. propose a decision only when evidence is sufficient;
6. require explicit approval before changing canon;
7. create/update tests and implementation tasks after approval.
Preserve rejected alternatives and rationale.

### P1 — Fixture-driven language laboratory
A shared fixture format for valid, invalid, ambiguous, and unresolved cases. Each fixture includes input, expected stage/result, diagnostic, source-rule IDs, confidence/status, and notes. The Playground and automated tests should use the same fixtures where practical.

### P1 — Integrated validation pipeline
Keep stages distinct and report each stage independently: input → parse → operator/grammar lookup → semantic validation → dimensional validation → (later) constraint/physical feasibility.
A blocked or unresolved stage must not be reported as valid. Initial integration must use only established rules; unknown operator signatures stay unresolved.

### P2 — Impact analysis
When a rule or definition changes, list known dependencies: examples, aliases, grammar productions, operator contracts, semantic types, fixtures, tests, documentation, and code. Start with explicit IDs/links; do not claim a complete dependency graph until coverage supports that claim.

### P2 — Language workbench tools
Add focused tools inside existing sections:
- lexicon/morpheme records with phonology, morphology, gloss, usage, provenance, aliases, status, and examples;
- grammar production editor only after source grammar has been recovered;
- expression explorer for syntax trees, bindings, and diagnostics as those semantics become specified;
- comparison view for competing candidate rules and their test outcomes.
Do not build a broad editor for a rule category before the source model is understood.

### P3 — Physical spell feasibility
Only after the canonical spell representation and physical model are specified: explicit mechanism completeness, resource ledger, conservation checks, coupling constraints, and feasibility diagnostics. Never infer feasibility from syntactic or semantic validity.

## Lean navigation model

Retain the five existing sections:
- **Overview:** project cockpit and next recommended task.
- **Documentation:** canonical sources, source inventory, and linked rule records.
- **Playground:** parser/validator and shared fixtures.
- **Test suite:** executed results plus fixture coverage and traceability.
- **Research & review:** questions, candidate interpretations, decisions, impact analysis, and canon implementation matrix.

Prefer tabs, filters, linked panels, and contextual actions within these sections over adding more top-level navigation.

## Shared record model (initial target)

- `SourceRecord`: stable ID, path/URL, title, version/date, provenance, authority, status, preserved-original flag.
- `RuleRecord`: stable ID, statement, source anchors, authority/status, interpretation notes, dependencies.
- `QuestionRecord`: stable ID, question, impact, status, linked sources/rules, candidate interpretations.
- `DecisionRecord`: stable ID, chosen outcome, rationale, approver, date, affected rules, rejected alternatives, supersedes.
- `ExampleFixture`: stable ID, input, case category, expected result/stage, diagnostic, rule IDs, status.
- `ImplementationEvidence`: rule ID, code references, limitations, test IDs, last verified commit/run.
- `WorkItem`: stable ID, priority, blockers, linked evidence, acceptance criteria, state.

Start with typed TypeScript modules and version-controlled JSON/Markdown where appropriate. Do not add a database or external service until collaboration, persistence, or search needs justify it.

## Recommended implementation sequence

1. Restore and verify a green CI baseline.
2. Inventory sources and provenance; confirm which original uploads are preserved.
3. Add a small, evidence-backed development queue to Overview using existing audit data.
4. Establish shared fixtures and link them to test registry entries.
5. Integrate parser/operator lookup/type/dimension checks behind a staged validation result.
6. Build the research question/decision record workflow.
7. Add dependency/impact links and improve source anchors.
8. Expand the actual Arcane grammar and lexicon tools only as source evidence is recovered.
9. Design physical feasibility only after the required canonical model is available.

## Definition of success

The app is succeeding when it reduces time to answer:
- What do the sources actually say?
- What remains uncertain or contradictory?
- Which question should we resolve next, and why?
- What else would a proposed change affect?
- Which examples and tests prove the rule?
- What does the engine genuinely support at this commit?
- How can the next work session resume without reconstructing context?

Feature count, visual complexity, and unverified completion percentages are not success metrics.