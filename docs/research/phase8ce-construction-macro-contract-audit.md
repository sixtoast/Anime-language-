# Phase 8CE — Construction macro contract audit

**Date:** 2026-11-14  
**Canon effect:** NONE · **Grammar changes:** none · **Tests authored:** MACRO-CON-001–012  
**Tests executed:** not executed locally

## 1. Purpose

The six recorded Construction macros have different kinds of evidence. A shared label of “macro” must not cause their signatures or behaviour to be treated as uniform or known. This audit separates recovered role evidence from operational contract fields.

## 2. Six macro evidence profiles

| Macro | Recovered evidence | Evidence status |
|---|---|---|
| TRAK | p/t/k voiceless-stop frame group associated with discrete change | Described pattern |
| KREN | b/d/g voiced-stop group proposed as reinforced counterpart | Proposed; owner confirmation outstanding |
| FREM | `ken` held-energy-state association in hand-flame fixture | Partial example |
| SHREN | `kas` release association in hand-flame fixture | Partial example |
| BRAN | h-domain syllable family associated with coupling | Pattern described |
| VARE | Soft-requirement modifier paired with hard REQUIRE | Role described |

These are not six equivalent signatures. In particular, FREM/SHREN do not have a general lifecycle contract; BRAN's family does not reveal participant slots; VARE's modifier role does not define conflict resolution.

## 3. Contract dimensions kept open

For all six macros, the following remain unrecovered:
- input and output signatures;
- number of Feet consumed or produced;
- whether scope is one Foot, multiple Feet or a sequence;
- preconditions;
- resource semantics and limits;
- side effects and physical outcomes;
- termination behaviour;
- macro-to-macro composition, ordering and compatibility.

The evidence does not justify treating macros as ordinary formal Expression operators. Nor does the existence of an operator-like gloss establish parser arity.

## 4. Implementation

Added `src/engine/constructionMacroContractAudit.ts` with:
- six source-indexed macro records;
- explicit status distinctions for described, proposed and partial fixture evidence;
- separate fields for unknown contract dimensions;
- lookup by macro name;
- pairwise composition review which remains NOT-ESTABLISHED even when both names are recognised.

The audit does not invent a common signature or generate macro expansions.

## 5. Tests

Twelve cases are authored and registered as MACRO-CON-001–012. They cover evidence distinctions, all missing contract dimensions, pairwise composition and fail-closed behaviour. Tests have not been executed locally.

## 6. Research conclusions and next source targets

No current evidence establishes whether TRAK/KREN act on one complete Foot or a sequence; whether FREM/SHREN are state modifiers, Foot constructors or macro labels; whether BRAN consumes two or more participants; or how VARE attaches and resolves preference conflicts.

The next useful source recovery is the complete Phase 4 §§3.2, 6 and 8 text and associated diagrams, followed by reconciliation against Phase 5.15/5.16. Until then the macro interface remains non-executable and canon-neutral.

**Decision ID:** P8CE-CONSTRUCTION-MACRO-CONTRACT-AUDIT-01 · **Canon effect:** NONE
