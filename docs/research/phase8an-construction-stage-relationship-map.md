# Phase 8AN — Construction stage relationship map

**Date:** 2026-11-13  
**Source:** Phase 4 §3.3, as cited by the Phase 5.15 Construction Contract Matrix and Phase 5.16 C-03.  
**Canon effect:** none. **Execution:** none. **Tests:** CON-REL-001–008 authored-unverified.

## 1. Recovered order

The source records the performed order:

1. Reference
2. Spatial role / vector
3. Construction Feet
4. Couplings
5. Quantity
6. Control
7. Release

The only relationship asserted in this phase is precedence: each listed stage precedes the next in the recovered performed sequence.

## 2. What the order does not establish

The sequence does not, by itself, prove that:
- the output of one stage is an argument to the next;
- every stage is mandatory or occurs exactly once;
- one or more stages can be repeated;
- a particular Foot must bind to a particular coupling;
- quantity is computed from a coupling or Foot;
- control consumes a quantity result;
- release consumes a specific control result;
- the order is sufficient for a complete, valid, feasible or executable Construction.

These are interface and contract questions, not consequences of list order.

## 3. Existing evidence by stage

- Reference: MI/NI/RI default-volume and me SELF-surface scope; persistence until replaced. Landmark geometry and full reference identity remain unresolved.
- Spatial role/vector: the stage is named in the recovered sequence, but complete internal grammar and binding rules are not recovered.
- Construction Feet: frame + parameter vowel + relation coda is the Phase 5.15 shape; the Phase 5.16 optional-coda conflict remains open, and the productive paradigm is missing.
- Couplings: six H-series glosses are recorded, but argument signature, participant order, direction and physical mapping remain unresolved.
- Quantity: a stage is named, but its Construction-stage grammar and relationship to other stages are not established by the recovered matrix.
- Control: a stage is named, but control vocabulary and attachment/transition contract are not established here.
- Release: a stage is named; KAS/SHREN evidence is partial-example only and does not define general release semantics.

## 4. Implementation

Added src/engine/constructionStageRelationshipEvidence.ts, an immutable evidence model containing seven ordered stages and six adjacent PRECEDES edges. Each edge explicitly carries interfaceStatus UNRECOVERED and dataDependency NOT-ESTABLISHED. Lookup returns only exact adjacent edges and does not create transitive or data-flow claims.

Added a read-only relationship panel to Construction Studio. It displays the order and warns that arrows represent precedence only.

Added src/engine/constructionStageRelationshipEvidence.test.ts and registry cases CON-REL-001–008. These are authored-unverified; no local unit/browser execution is claimed.

## 5. Next evidence required

Recover original v2.0 definitions or owner-approved replacements for each stage input/output signature, cardinality, omission/repetition rules and cross-stage binding. Until then, the model remains a sequence audit aid, not a Construction compiler.