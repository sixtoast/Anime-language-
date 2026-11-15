# Phase 8DI — Expression-to-Construction bridge evidence

**Status:** Cross-version evidence reconciliation. **Canon effect:** NONE. **Compiler:** disabled. **Execution:** disabled. **Tests:** 22 authored and registered; not run locally.

## 1. Finding

The recovered sources describe a conceptual compile bridge between Formal Arcana and Performed Construction, but they do not demonstrate a complete, executable translation from a formal expression AST to a physically specified Construction.

Phase 4 §3.3 describes a performed order and several compression conventions. Phase 5.15's Construction Contract Matrix explicitly says the AST-to-Construction mapping table, compiler and end-to-end trace are not demonstrated. Phase 5.16 C-08/C-09/C-11 likewise says the hand-flame example is not fully parsed or checked for feasibility, exact v2.0 rules are unavailable, and token checks do not prove whole-spell parsing.

The two findings are compatible: a conceptual bridge and partial performed conventions can exist without a recovered complete compiler.

## 2. The two subsystems

Phase 4 §3.1/Table 2 distinguishes:
- **Expression v3.0-L:** values, targets, conditions and timing; typed prefix operators; head, arguments and modifier clauses.
- **Construction v2.0:** mana states, couplings, anchors and release; Feet, h-couplings and fused references; reference, spatial role, Feet, couplings, quantity, control and release.

Phase 5.16 C-01 independently records that the subsystems are distinct. They must remain separate in the software architecture.

## 3. Recovered performed Construction order

Phase 4 §3.3 gives this order:
1. Reference.
2. Spatial role and vector.
3. Feet.
4. Couplings.
5. Quantity.
6. Control.
7. Release.

Phase 5.15 and Phase 5.16 preserve this as an order, but explicitly leave slot cardinality, omission, scope and transitions incomplete. The order is not a complete grammar, nor does it prove every spell must instantiate every stage.

## 4. Macro-to-Foot evidence

| Alias | Phase 4 §3.2 evidence | Remaining gap |
|---|---|---|
| TRAK | Alter; p/t/k voiceless-stop frame family; discrete change | Exact expansion, arity and physical/resource semantics |
| KREN | Establish; b/d/g reinforced counterpart | Explicitly proposed; owner confirmation required |
| FREM | m/n relation codas = open-loop maintain; ŋ = feedback maintain | Full scope, duration, termination and resource contract |
| SHREN | s/sh relation codas = release | Release target, mode, preconditions and safety contract |
| BRAN | h + domain vowel; six heavy coupling syllables | Domain-to-physics mapping, participant order, direction and costs |
| VARE | Soft-requirement modifier paired with hard REQUIRE; not a Foot | Current attachment, conflict and failure semantics |

A critical reconciliation: Phase 4 §3.2 gives FREM and SHREN broader coda-family evidence than the isolated ken and kas worked-example associations. Phase 5.15 nevertheless says the complete macro contracts and expansions remain incomplete. The right conclusion is not to discard the table or to overstate it: record the coda families as Phase 4 pattern evidence, while keeping their complete operational contracts unresolved.

## 5. Other provisional mappings

Phase 4 §3.3 explicitly labels the parameter-vowel/property-family mapping provisional:
- a: energy family;
- u: motion family;
- o: extent;
- e: structure/form;
- i: information;
- ə: baseline.

It also labels the physical coupling-vector mapping provisional. The six heavy h-domain forms are recorded, but domain-to-physical-system mappings, participant order, direction, vectors and resource costs cannot be treated as approved physical laws.

The Foot shape is described as frame + parameter vowel + relation coda. Phase 5.15 still notes that the complete relation-coda inventory and full productive semantics need recovery. Morphological shape must not be mistaken for a complete semantics.

## 6. Compression evidence

Three kinds of compression have distinct evidence levels.

### 6.1 Semantic packing

Current v3.0-L §§13 and 16 describe Performed Arcana as semantically dense and state that linguistic compression is not physical simplification. A shorter utterance does not automatically mean a cheaper or weaker physical effect.

### 6.2 Reference and control compression

Phase 4 §3.3 describes reference-plus-scope fusion into one syllable, a SELF-surface me, default volume-scope readings for MI/NI/RI, control clitics s-/sh-/f-, and wi/we live/locked values. These are historical performed-profile rules; wi/we are explicitly provisional in L-15. They do not establish a universal shortening operation in current v3.0-L.

### 6.3 Binding reuse

Current v3.0-L §10 defines KWAM, KWAT and KWAK at a conceptual level. Phase 8DA requires matching expression identity, type, scope, lifetime, referent and purity evidence before reuse is even eligible for owner review. Identifier representation, lifecycle and exact shortening syntax remain unresolved. No automatic KWAM/KWAT rewrite is authorised.

There is no recovered general rule for deleting repeated syllables or arbitrary words. Such deletion must remain prohibited by the reader until an approved, reversible rule exists.

## 7. Implications for the companion reader

The companion should show two linked but separate views:
- a Formal Expression tree, including operator, typed arguments, modifiers and binding references;
- a Construction evidence view, showing the seven performed stages and each source-backed mapping, provisional mapping or unresolved field.

A link between the views must be labelled as a traceability/evidence link unless a complete mapping rule is approved. It must not display generated Construction instructions merely because an operator and macro share a gloss.

For each Construction field, the reader should report recovered evidence, evidence version/source, status, missing signature or physical parameter, and whether it is compiler-usable (currently no).

## 8. Decisions not made

- No expression operator is paired with a Construction macro.
- No macro expansion or Foot sequence is generated.
- No parameter vowel or h-coupling physical mapping is promoted from provisional.
- No historical performed compression is silently promoted into current formal grammar.
- No arbitrary shortening, syllable deletion or binding rewrite is performed.
- No feasibility, authority, resource conservation or execution is inferred.

**Result:** the conceptual bridge, macro-to-Foot evidence, performed compression conventions and compiler gaps are now represented separately and testably. The full formal-to-performed compiler remains an open research task.
