# Phase 8DG — Modifier attachment and block-scope reconciliation

**Status:** Cross-version grammar evidence audit. **Canon effect:** NONE. **Parser:** unchanged. **Execution:** disabled. **Tests:** 12 authored and registered; not executed locally.

## 1. Why this phase follows nesting

Phase 8DF established that nested expressions are represented in Phase 2 by provisional abstract notation, while the current spoken nesting syntax remains unrecovered. Modifier scope is the next dependency: even with a known expression tree, a reader must know whether a modifier belongs to the outer clause, a nested argument, or a control block.

## 2. Current v3.0-L evidence

Arcane Language v3.0-L §2 specifies the broad surface order:

`HEAD + ARGUMENTS + MODIFIERS`

This establishes that modifiers follow the head and its arguments. It does not define:
- which preceding constituent a modifier attaches to;
- whether attachment is nearest-clause, nearest-expression or another relation;
- how attachment behaves across nested calls;
- how modifier scope interacts with control blocks;
- the full surface inventory and signatures of modifiers.

Section 9 lists the current named logic/control operators GRAN, GRAT, GRAK, BEK and ZET. Section 14 describes phrase-level prosodic boundary cues. Neither section explicitly adopts all Phase 4 G-4/G-5 rules.

## 3. Historical Phase 4 grammar evidence

Phase 4 §6 G-4 says a modifier is a clause-level head attaching to the nearest preceding clause at the same block level. It lists five modifier classes:
1. time: DELAY, DURATION, INTERVAL, DEADLINE;
2. requirement: REQUIRE, VARE, PRESERVE, WITHIN;
3. control state: ATTACHED, TRANSFERRED, INDEPENDENT;
4. coupling;
5. spatial roles.

Phase 4 §6 G-5 says IF, WHILE, UNTIL and EACH take a condition followed by a block. The historical block opens with METO and closes with DOGU. In Performed speech, delimiters become a pitch reset and lengthening, and a one-clause block may omit them.

Phase 4 §6 G-6 distinguishes condition behaviour: IF fires when its whole condition becomes true; ONSET makes one inner term edge-based; WHILE continues while true; UNTIL stops when true.

Phase 4 Table 16 D-038 records G-1 to G-6 as DECIDED in that audit's historical decision ledger. That is strong historical evidence. It is not, by itself, an instruction to silently rewrite the distinct v3.0-L specification.

## 4. Current parser comparison

The Phase 6G provisional parser has a recursive `SurfaceNode` representation with `call` and `block` variants. It recognises a provisional CONTROL set and parses METO/DOGU blocks for those forms.

It does not have a dedicated modifier node or clause-attachment representation. It therefore cannot implement the Phase 4 G-4 nearest-preceding-clause rule. Its control set is not the complete Phase 4 list: the implementation is a provisional subset and must not be presented as a version-complete grammar.

This is a source-code comparison, not a newly executed test result.

## 5. Evidence matrix

| Question | Recovered | Still unresolved |
|---|---|---|
| Broad current ordering | HEAD + ARGUMENTS + MODIFIERS | Exact attachment target and scope |
| Historical attachment | Nearest preceding clause at same block level | Current v3.0-L adoption |
| Historical modifier classes | Five classes listed in G-4 | Complete current modifier lexicon/signatures |
| Historical blocks | METO opens; DOGU closes | Current block grammar and exact spoken form |
| Performed boundaries | Pitch reset + lengthening; one-clause omission | Current register applicability and reliable disambiguation |
| Historical conditions | IF, ONSET, WHILE, UNTIL distinctions | Current operator mapping and evaluation rules |
| Parser support | Recursive calls and provisional blocks | Modifier AST, attachment algorithm and version profiles |

## 6. Implications for the incantation reader

A future reader needs separate, explicit stages for:
1. lexical recognition;
2. operator identity and approved arity;
3. recursive argument parsing;
4. clause and block boundary recognition;
5. modifier attachment at the correct scope;
6. semantic typing and context resolution.

These stages must not be collapsed into a single “parse succeeded” flag. In particular, an outer requirement must not accidentally attach to an inner arithmetic argument, and a duration modifier must not silently become a property of only the last nested operand.

These are reader requirements, not newly approved spoken rules.

## 7. Mana Construction boundary

The Phase 4 modifier classes include coupling and spatial roles, while the Construction system has its own phrases, Feet, couplings and release structure. No source recovered here establishes that expression-level modifiers attach directly to Construction phrases, or that the five historical modifier classes are a complete Construction grammar.

The expression layer, incantation contract layer and Mana Construction layer remain distinct.

## 8. Decisions deliberately not made

- No Phase 4 rule is promoted to current v3.0-L canon.
- No new spoken delimiter, pitch rule or modifier form is invented.
- No current control operator is added or removed.
- No parser, semantic analyser or execution path is changed.
- No equivalence is asserted between historical block prosody and current phrase prosody.
- No modifier-to-Construction mapping is inferred.

**Result:** historical modifier and block rules are now explicit and testable as evidence; current spoken attachment and cross-version control grammar remain open.
