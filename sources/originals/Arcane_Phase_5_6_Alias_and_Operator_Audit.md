# Arcane Phase 5.6 — Alias Integration and Operator Contract Reconciliation

**Status:** reproducible lexicon/registry checks executed; canon unchanged.  
**Source archive:** `Arcana pack.zip`  
**Audit baseline:** Phase 2 formal signatures, Phase 4 decisions D-017 and D-032, v4/v5 lexicon drafts, Phase 5.5 alias registry.

## 1. Reproducible checks

A self-contained validator is included as `arcane_alias_validator.py`. It needs only Python's standard library and the supplied CSV files. It checks that the seven expected aliases exist in the registry, target the Phase 4 preferred forms, target lexicon entries with compatible meanings, do not exist as separate lexicon entries, and can resolve while retaining the original source token for diagnostics.

Run it from the extracted source directory:

```bash
python arcane_alias_validator.py Arcane_Lexicon_v4_draft.csv Arcane_Alias_Registry_Phase_5_5.csv
python arcane_alias_validator.py Arcane_Lexicon_v5_draft.csv Arcane_Alias_Registry_Phase_5_5.csv
```

The recorded runs completed with **42/42 checks passing against v4** and **42/42 checks passing against v5**. The complete console outputs are included as `Phase_5_6_v4_test_results.txt` and `Phase_5_6_v5_test_results.txt`. These are reproducible checks of registry and lexicon consistency only. They do not prove that an existing Arcane parser/compiler resolves aliases, because no complete parser/compiler is present in the archive.

## 2. Alias mapping

| Legacy form | Preferred form | Meaning |
|---|---|---|
| `FRATA` | `FRAJA` | subtract |
| `FRAKA` | `FRAMA` | multiply |
| `DRIM` | `DRUM` | cross product |
| `REN` | `BEN` | region |
| `GRAK` | `GRASH` | NOT |
| `KWAK` | `KWASH` | live evaluation |
| `DRAL` | `DRAS` | compare |

The compatibility layer should resolve legacy spellings before type/arity checking, but diagnostics and source-preserving tools should retain the spelling actually written. Alias resolution must not make a legacy token into a second, independently defined operator.

## 3. Lexicon collisions that are not alias collisions

Both lexicon drafts contain duplicated surface spellings `RE` and `RA` across distinct classes/sources:

- `RE`: digit `4` in the v3.0-L inventory and performed `TARGET-surface` form in the v2.0-derived inventory.
- `RA`: radian unit in the v3.0-L inventory and performed `TARGET-path` form in the v2.0-derived inventory.

These are not among the seven renamed aliases. They may be intentional register/context-sensitive homographs, but a global form-to-one-meaning dictionary would be ambiguous. The lexicon resolver should therefore use class/register/grammatical context, or an explicit scoped key. Do not delete either entry solely to force global uniqueness.

## 4. FRAPA contract

Phase 2 explicitly records `FRAPA` as binary `Quantity × Quantity → Quantity`, with provisional status because unit and dimensional compatibility still need rules. Phase 4's rename table does not rename FRAPA.

Provisional reconciliation:

1. Keep `FRAPA` as the preferred addition form.
2. Enforce arity 2.
3. Require compatible dimensions and compatible semantic kinds, with conversion where a defined conversion exists.
4. Reject unsupported additions, including incompatible dimensions, rather than guessing.
5. Do not infer physical causation from the arithmetic result.

The full quantity-kind system remains incomplete; this audit does not mark it canonically resolved.

## 5. DRIM/DRUM and D-017

Phase 4 D-017 records the physical right-hand rule and a negated component formula for the left-handed caster frame, with `BA × DA → KA` and P4-T16 recorded PASS. Phase 5.6 therefore treats handedness as a recorded Phase 4 decision, not an open question. However, the archive does not include the Phase 4 executable test script as a self-contained runnable artifact, so P4-T16 remains source-documented rather than independently reproduced here.

The implementation contract must distinguish the physical orientation rule from the frame-specific component formula. Alias normalization (`DRIM` → `DRUM`) must occur before evaluation and must not alter frame semantics.

## 6. Operator reconciliation

`Arcane_Operator_Contract_Reconciliation.csv` records the seven rename pairs and FRAPA. Phase 2 signatures are preserved as the formal baseline; later preferred spellings are aliases at the name-resolution layer, not silent signature rewrites. Where Phase 2 marks a signature provisional or an argument encoding unresolved, that status remains visible.

## 7. Evidence boundaries

- Independently reproduced here: standard-library validator runs against both included lexicon drafts and the Phase 5.5 alias registry.
- Documented in source, not independently reproduced: Phase 4's 17 checks and P4-T16; Phase 5's seven mechanical checks.
- Not demonstrated by these checks: a working parser/compiler, unique spoken parsing, listener intelligibility, or physical spell execution.
- Still unrecovered in complete original form: v2.0 frame-vowel-coda morphology and full `h` coupling, `MEL`, `KAN`, `KEN`, and `KAS` rules.

## 8. Next action

Integrate the registry into the actual lexicon resolver/parser once that implementation is available. Then test alias resolution through the real entry point, scope-sensitive homographs (`RE`, `RA`), arity enforcement, and type checks. Keep historical forms in old examples and preserve source spelling in diagnostics.
