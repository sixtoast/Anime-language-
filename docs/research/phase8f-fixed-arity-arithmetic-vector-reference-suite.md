# Arcane Phase 8F — fixed-arity arithmetic and vector reference suite

**Status:** Source-stratified reference suite; expected outcomes are authored from inspected implementation, not newly executed  
**Date:** 2026-10-15  
**Canon effect:** none  
**New forms:** 0  
**Tests executed in this phase:** none

## 1. Purpose and scope

This suite moves from broad boundary research to concrete operator-family coverage. It separates four questions that must not be conflated:

1. **Inventory:** does a source record the operator and gloss?
2. **Surface prototype:** does the Phase 6G parser have a supported spelling and arity?
3. **Semantic contract:** are operand types, output type, units, domains and failure rules established?
4. **Casting/physical feasibility:** could a complete construction be implemented under the magic system's constraints?

This is a fixture plan and reference catalogue, not a claim that tests were run or that every operator is ready for an incantation.

## 2. Source and notation policy

Sources inspected:
- `docs/canon/arcane-language-v3.0-L.md`
- `docs/research/phase7a-operator-inventory-reconciliation.md`
- `docs/research/phase7x-incantation-operator-contract-registry.md`
- `docs/research/phase8c-expression-fixture-evidence-matrix.md`
- `src/engine/surfaceParser.ts`
- `src/engine/surfaceParser.test.ts`
- `sources/originals/Arcane_Lexicon_v5_draft.csv`
- `sources/originals/Arcane_Alias_Registry_Phase_5_5.csv`

Use notation label **P6G-SURFACE-PROTOTYPE** for the whitespace-tokenised parser. It is not the Phase 2 angle-bracket audit notation and is not the canonical language as a whole.

All examples below are parser fixtures only. They do not assert that a scalar quantity is a valid vector, that parsing establishes operator meaning, or that a parsed expression can be cast.

## 3. Operator inventory and readiness

| Canonical v3.0-L form | Gloss | v5 draft relationship | Prototype support | Semantic status |
|---|---|---|---|---|
| FRAPA | Add | Same form, CANON | Binary | Signature provisional; unit/domain contract incomplete |
| FRATA | Subtract | FRAJA recorded as renamed form | Alias only when enabled; FRATA not an arity entry | Version-specific spelling; subtraction contract incomplete |
| FRAKA | Multiply | FRAMA recorded as renamed form | Alias only when enabled; FRAKA not an arity entry | Dimensional algebra unresolved |
| FRALA | Divide | Same form, CANON | Binary | Zero denominator and dimensional rules unresolved |
| FRASHA | Negate | Same form, CANON | Unary | Accepted numeric types and unit behaviour unresolved |
| DRAN | Magnitude | Same form, CANON | Unary | Vector/value input types unresolved |
| DREM | Dot product | Same form, CANON | Binary | Vector representation, space and unit rules unresolved |
| DRIM | Cross product | DRUM recorded as renamed form | Alias only when enabled; DRIM not an arity entry | Vector representation, orientation and dimensional rules unresolved |
| DRAL | Compare | DRAS recorded as renamed form | DRAS prototype branch uses three arguments and audit-only criterion | Canonical comparison syntax and criterion representation unresolved |
| GRAN | AND | Same form, CANON | Binary | Boolean type and n-ary policy unresolved |
| GRAT | OR | Same form, CANON | Binary | Boolean type and n-ary policy unresolved |
| GRAK | NOT | GRASH recorded as renamed form | Alias only when enabled; GRAK not an arity entry | Boolean type unresolved |

**Important:** “prototype support” means a code path exists for that prototype spelling and shape. It is not approval of the signature as canonical.

## 4. Positive parser fixtures

These cases are based on the inspected Phase 6G grammar. Expected shapes are described at a level useful for comparing the resulting AST; they have not been executed in this phase.

| ID | Input | Expected syntax shape | What it does not prove |
|---|---|---|---|
| AR-01 | `frapa ki sho to sho` | FRAPA(quantity 1 SHO, quantity 2 SHO) | Addition is dimensionally valid for every quantity |
| AR-02 | `frala ki sho to sho` | FRALA(quantity 1 SHO, quantity 2 SHO) | Denominator is nonzero or division's result type is settled |
| AR-03 | `frasha ki sho` | FRASHA(quantity 1 SHO) | Negation semantics for all supported units |
| AR-04 | `dran ki sho` | DRAN(quantity 1 SHO) | Scalar input is a valid magnitude operand |
| AR-05 | `drem ki sho to sho` | DREM(quantity 1 SHO, quantity 2 SHO) | Scalars are valid vector operands; this is deliberately syntax-only |
| AR-06 | `dras ki sho to sho gt` | DRAS(quantity 1 SHO, quantity 2 SHO, audit criterion GT) | GT is canonical Arcane vocabulary or comparison syntax |
| AR-07 | `frapa frama ki sho to sho fraja mu sho za sho` with legacy aliases enabled | FRAPA(FRAMA(1,2), FRAJA(3,0)) | The alias spellings are preferred in every version or the arithmetic is type-valid |

AR-07 is a prototype alias-path fixture. The input intentionally uses old spellings `frama` and `fraja` as preferred forms in the current prototype; alias-specific tests must instead supply legacy spellings `fraka` and `frata` with `allowLegacyAliases: true`. The two cases must not be conflated.

## 5. Negative and boundary fixtures

| ID | Input or mutation | Expected prototype result | Reason |
|---|---|---|---|
| AR-N01 | `frapa ki sho` | Reject incomplete call | FRAPA requires two expression arguments in the prototype |
| AR-N02 | `frasha ki sho to sho` | Reject trailing expression | Unary FRASHA does not consume a second top-level argument |
| AR-N03 | `frapa ki to` | Reject unterminated numeral | A numeral requires a registered unit terminator |
| AR-N04 | `frapa re sho to sho` | Reject ambiguous homophone | RE collision cannot be resolved in this context |
| AR-N05 | `frapa ki sho ra` | Reject ambiguous homophone | RA unit/reference collision has no slot-sensitive policy |
| AR-N06 | `frata ki sho to sho`, aliases disabled | Reject unresolved operator | Old form must not be silently normalised |
| AR-N07 | `frata ki sho to sho`, aliases enabled | Parse as FRAJA(1,2) | Explicit compatibility mode only |
| AR-N08 | `nes ki sho` | Reject unresolved operator | NES has no supported arity in this parser |
| AR-N09 | `drem ki sho to sho` | Syntax may parse; semantic/type gate must block vector validation | Parser arity is not a type checker |
| AR-N10 | Any otherwise accepted fixture offered as a cast-ready spell | Reject readiness claim unless semantic and physical gates are independently satisfied | Parse success is not execution feasibility |

The expected results for this section are a proposed test plan informed by existing test source and parser branches, not a report of a fresh test run.

## 6. Alias contract

The alias registry records the following source relationships. They must be resolved under explicit version/compatibility options and the original input must remain recoverable.

| Historical/source form | Preferred/renamed form | Gloss |
|---|---|---|
| FRATA | FRAJA | Subtract |
| FRAKA | FRAMA | Multiply |
| DRIM | DRUM | Cross product |
| DRAL | DRAS | Compare |
| GRAK | GRASH | NOT |
| KWAK | KWASH | Live evaluation |
| REN | BEN | Region |

The surface parser's built-in alias map covers FRATA, FRAKA, DRIM, DRAL, GRAK and KWAK. The registry also records REN→BEN, but that does not imply that BEN is a parser operator. Do not infer support for every registry alias from the existence of the registry.

Every alias fixture should record:
- original spelling;
- source/version;
- compatibility option;
- resolved spelling;
- whether the resolution came from the registry or built-in prototype map;
- resulting parse or diagnostic.

## 7. Vector-operator limitation and the next actual language task

The canonical inventory includes DRAN, DREM and DRIM/DRUM, but the inspected parser's quantity and atom support does not establish a canonical vector-literal grammar. Using scalar quantities in a DREM or DRUM parser fixture can test recursive argument consumption only; it cannot validate vector semantics.

The next language-design task should therefore be to recover or specify the **vector value representation** before drafting naturalistic vector incantations. At minimum, the contract must define:
- what counts as a vector value and how its components are represented;
- coordinate frame and dimensionality;
- component units and compatibility;
- whether DREM requires vectors in the same space;
- DRIM/DRUM dimensionality, orientation and output units;
- whether DRAN accepts only vectors or other structured values;
- errors for missing, mismatched or nonnumeric components.

Until that contract exists, vector operators can have syntax fixtures but remain semantically blocked for real constructions.

## 8. Test metadata contract

Each future fixture should include:

`id, notation, source_version, source_ref, input, expected_ast, expected_diagnostic, aliases_enabled, syntax_status, semantic_status, feasibility_status`

Allowed status values should distinguish at least:
- `authored-unverified`
- `implementation-observed`
- `executed-pass`
- `executed-fail`
- `blocked-by-specification`
- `not-applicable`

Never label a fixture `executed-pass` based on reading a test file. Never label semantic or feasibility status as passed merely because syntax parsing succeeded.

## 9. Decision ledger

- **Decision ID:** P8F-FIXED-ARITY-REFERENCE-01
- **Canon changes:** none
- **New vocabulary:** none
- **Implementation changes:** none
- **Tests executed:** none
- **Primary result:** the prototype supports a useful narrow set of recursive fixed-arity arithmetic/vector-shaped syntax, but type and domain validation are separate and incomplete; historical spellings must be tested only under explicit compatibility settings.
- **Next phase:** specify the vector value contract from existing sources if available; if the primary sources do not define one, produce a minimal, clearly labelled design proposal with competing representations and tests, without promoting it to canon.
