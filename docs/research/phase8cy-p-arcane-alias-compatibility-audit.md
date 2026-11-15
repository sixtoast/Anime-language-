# Phase 8CY-P — Arcane alias compatibility audit

**Canon effect:** NONE. **New spoken forms:** 0. **Grammar changes:** none. **Execution:** NONE.

## 1. Source record

Phase 4 §5.1 / D-032 records seven renames and requires the old spellings to remain aliases rather than separate preferred entries. Phase 5.5 provides the explicit registry. Phase 5.6 reports 42/42 registry/lexicon consistency checks against both v4 and v5 drafts, while explicitly disclaiming proof of a working parser/compiler.

| Legacy | Preferred | Gloss | Kind in the audit |
|---|---|---|---|
| FRATA | FRAJA | subtract | Operator |
| FRAKA | FRAMA | multiply | Operator |
| DRIM | DRUM | cross product | Operator |
| REN | BEN | region | Lexical atom |
| GRAK | GRASH | NOT | Operator |
| KWAK | KWASH | live evaluation | Operator |
| DRAL | DRAS | compare | Operator |

The distinction matters: six aliases name operators; REN→BEN resolves a geometry lexical atom. Treating all seven as operators would be a category error.

## 2. Parser compatibility result

The new audit uses the bundled v5 draft lexicon and explicit Phase 5.5 alias registry. It checks both default resolution and explicit alias opt-in through the provisional Phase 6G surface parser. For the six operator aliases, small parser fixtures exercise the currently implemented preferred-form arities; REN is checked as an atomic lexicon entry.

The audit preserves:
- the spelling supplied by the source fixture;
- the registered preferred form and its lexicon gloss;
- the fact that aliases are disabled by default;
- the parser result under both settings;
- the provisional notation label.

It does not change parser defaults, add alias spellings to the canonical operator inventory, or rewrite the underlying lexicon.

## 3. Homophone boundary

Phase 5.6 says RE and RA collisions are not alias collisions. The v5 lexicon retains:
- RE as digit 4 and a performed TARGET-surface reference;
- RA as radian and a performed TARGET-path reference.

The audit checks that both collision records remain present. It does not choose a meaning or invent slot-sensitive resolution. The parser continues to fail closed where the grammatical context is not sufficient under its current implementation.

## 4. Implementation

Added `src/engine/arcaneAliasCompatibilityAudit.ts` and ten tests. The audit verifies seven explicit mappings, six preferred operator parses, the single lexical-atom alias, opt-in behaviour, target presence, preferred glosses and RE/RA collision preservation. It reports `executable:false` and `canonEffect:NONE`.

## 5. Limits and next language work

A successful alias parse is not proof of semantic typing, physical feasibility, a valid spell, listener intelligibility or execution. Phase 6G remains provisional; its parser arities are not promoted to canonical signatures. Phase 5.6's 42/42 checks are source-reported reproducibility results, not re-executed by this phase.

Next, the operator inventory should be reconciled against Phase 2 signatures, v3.0-L conceptual examples, Phase 4 rename decisions and the parser's actual arity table. The RE/RA homophone issue remains a separate grammatical-slot design question.
