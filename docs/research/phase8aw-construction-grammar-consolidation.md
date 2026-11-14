# Phase 8AW — Construction grammar evidence consolidation

**Status:** implemented as a bounded evidence model; tests authored but not executed locally.  
**Scope:** historical Phase 4 / Phase 5.15–5.22 Construction evidence, with Arcane v3.0-L inventory kept separate.  
**Canon effect:** none. **Executable:** no.

## Purpose

Phases 8AN–8AV recovered separate pieces of Construction evidence: performed-stage order, stage-level partial contracts, Foot morphology, reference handling, source concordance, historical fixture token tables and a six-phrase Phase 5.22 parse-tree profile. Phase 8AW places those pieces in one version-bounded evidence model so the workbench can distinguish what is actually recognised from what remains incomplete, ambiguous or unsupported.

This is not a new language rule and does not implement a general Construction parser.

## Three layers that must remain distinct

1. **Formal Arcane expressions:** operators, values, references, conditions and relationships in the formal expression system.
2. **Performed Mana Construction order:** seven source-backed stages: reference → spatial role/vector → Construction Feet → couplings → quantity → control → release. The six adjacent relations are PRECEDES only. Stage interfaces, data flow, mandatory cardinality and internal syntax are not recovered.
3. **Phase 5.22 historical fixture tree:** one exact hand-flame surface with six phrase nodes and 17 whitespace-delimited tokens. It is an archived bounded fixture, not the general Construction language.

The Phase 5.21 lexical-slot validator and Phase 5.22 phrase-tree parser are separate validation layers. Their token groupings should not be collapsed into one grammar merely because they concern the same worked example.

## Consolidated evidence states

| Classification | Meaning in this audit |
|---|---|
| VALID | Exact Phase 5.22 fixture surface matches its recovered six-phrase profile. This says nothing about physical feasibility. |
| INCOMPLETE | A supplied stage sequence follows recovered precedence, but completeness and internal contracts are not established. |
| AMBIGUOUS | Competing source readings remain unresolved, notably CVC Foot shape versus optional relation coda. |
| UNSUPPORTED | No recovered general Construction surface grammar supports interpretation of the supplied surface. |
| INVALID | A supplied stage sequence contains an unknown stage or violates the recovered order. |

These classifications apply only to the supported evidence-audit inputs. They are not universal parse outcomes.

## Critical non-equivalences and boundaries

- Six phrase nodes are not seven performed stages. No one-to-one mapping is established.
- The six-phrase fixture tree has no explicit Control node. That does not establish that Control is absent from all constructions.
- Phase 5.15 describes CVC Foot structure; Phase 5.16 C-02 describes an optional relation coda. This remains an open source conflict. The six CV forms pa/ba/ta/ka/da/ga are frame forms, not proven complete Feet.
- The fixture's da axis token and the Construction frame form da occupy different profile-specific roles. Shared spelling does not prove shared lexical identity.
- Phase 5.22's digits, units, axes and role labels remain fixture-scoped pending source/version reconciliation.
- The H-series coupling labels remain provisional. No participant types, cardinality, direction, physical vector, magnitude or resource costs are inferred.
- KAN/KEN/KAS remain example-level aliases. No productive macro signatures or expansions are inferred.
- MEL remains an example-level anchor reading; no productive anchor-coda paradigm is inferred.
- The Arcane v3.0-L spatial inventory is not back-projected into historical Phase 4 Construction syntax.
- The Phase 5.22 archive parser is available only through indexed excerpts and metadata in the current recovery record; this phase does not claim complete source recovery.

## Implementation

Added `src/engine/constructionGrammarConsolidation.ts`:
- consolidates three distinct evidence layers and version boundaries;
- exposes a bounded classifier for exact fixture strings and performed-stage arrays;
- returns VALID only for the exact six-phrase fixture;
- returns INCOMPLETE for an order-consistent stage sequence;
- returns INVALID for unknown or out-of-order stage values;
- returns UNSUPPORTED for arbitrary Construction strings;
- records the unresolved Foot morphology as AMBIGUOUS in the evidence profile rather than silently choosing a reading;
- remains non-executable and canon-neutral.

Ten tests were authored in `src/engine/constructionGrammarConsolidation.test.ts` and registered as CON-GRAM-001–010. They have **not** been executed in a local checkout in this session. No local TypeScript, unit, browser or physical simulation result is claimed.

## Next source requirement

The next meaningful grammar advance requires the full, inspectable Phase 4 Construction source (especially §§3.1–3.3 and §10) and owner resolution of the CVC/optional-coda discrepancy, followed by recovery of the relation-coda inventory and actual stage-internal examples. More evidence aggregation alone cannot create a productive grammar.
