# Arcane Phase 5.5 — Source Reconciliation Report

**Status:** evidence-based audit; no canon silently amended  
**Source bundle:** `Arcana pack.zip`  
**Primary formal baseline:** Phase 2 operator-signature audit  
**Later whole-language decisions:** Phase 4, including D-017 and D-032  
**Lexicon artifacts checked:** v4 draft (140 rows), v5 draft (255 rows)

## 1. Key result: seven rename aliases

Phase 4 §5.1 and decision D-032 establish that seven old forms remain valid aliases after the sibling-collision renames. The exact mapping recovered from the Phase 4 rename table is:

| Historical form | Preferred Phase 4 form | Meaning |
|---|---|---|
| `FRATA` | `FRAJA` | subtract |
| `FRAKA` | `FRAMA` | multiply |
| `DRIM` | `DRUM` | cross product |
| `REN` | `BEN` | region |
| `GRAK` | `GRASH` | NOT |
| `KWAK` | `KWASH` | live evaluation |
| `DRAL` | `DRAS` | compare |

**Implementation gap:** neither the v4 nor v5 CSV contains a separate row for any of the seven historical forms. The preferred-form rows contain notes such as `was frata`, but a note is not a machine-readable alias mapping. Therefore the documents state that aliases remain valid, while the lexicon alone does not implement that promise for a lookup/parser.

Recommended treatment: keep the preferred form as the canonical lexeme; add an explicit alias registry (provided separately) and require parser/compiler/lookup entry points to resolve aliases to the preferred form while preserving the original spelling in source text and diagnostics.

## 2. FRAPA contract recovered from Phase 2

Phase 2's signature register states:

- Operator: `FRAPA` — add.
- Inputs: `Quantity × Quantity`.
- Output: `Quantity`.
- Arity: 2.
- Confidence: provisional; quantity/unit compatibility still requires rules.

Phase 2 test expectations specify that a missing argument and extra argument are rejected, nesting is explicit in the audit notation, subtraction order is preserved for the then-current `FRATA` form, and adding a length unit to a time unit must be rejected absent an explicitly defined compatible operation.

Phase 4 renames subtraction and multiplication to `FRAJA` and `FRAMA`, while preserving `FRAPA` unchanged. The safest reconciliation is therefore:

1. Preserve `FRAPA` as the addition head.
2. Use Phase 2's binary quantity-addition contract as the formal baseline.
3. Apply the later dimensional/unit safeguards developed after Phase 2, without claiming the original FRAPA contract was more fully specified than the source shows.
4. Keep `FRATA` as a historical alias of `FRAJA` if compatibility is implemented, not as a competing canonical head.

## 3. Coordinate handedness is decided in Phase 4

Phase 4 D-017 explicitly decides:

- `DRIM` (preferred form `DRUM` after the rename) follows the physical right-hand rule.
- The caster frame is left-handed, so the component formula is negated in that frame.
- `BA × DA` (right × up) gives `KA` (backward).
- Test P4-T16 is recorded as PASS with result `[0, -1, 0]`.

This is stronger evidence than the earlier v3.0-L axis inventory alone. The coordinate-frame audit should now treat the convention as **decided in Phase 4**, while distinguishing a documented test result from independent reproduction. It should not reopen handedness unless a contradictory authoritative source or reproducible counterexample appears.

## 4. What is and is not independently verified

- The ZIP contains Phase 2, Phase 4, and Phase 5 reports, lexicon CSVs, and `phase5_vernacular.py`.
- Phase 4 reports 17/17 checks passed; Phase 5 README reports 7/7 mechanical checks passed.
- The Phase 5 script references external paths (`/home/claude`, `/mnt/user-data/outputs`) and an external `arcane_lexicon_tools` module; the complete executable environment is not included in the ZIP. The Phase 4 executable scripts are also not present as standalone Python source files in the bundle.
- Thus the archive documents those results, but the checks cannot all be independently rerun from the supplied ZIP alone.
- Phase 2 signatures remain marked provisional; the report explicitly says no compiler was run.
- The recovery pack says the exact original v2.0 morphology, `h` coupling, `MEL` anchoring, and `KAN/KEN/KAS` rules were not fully recovered. Phase 4 proposes rules and examples for these, but that later reconstruction must not be misrepresented as the complete original v2.0 source.

## 5. Source hierarchy and continuity rules

1. Original canonical specification text, when recovered.
2. Phase 2 for formal operator-signature baseline, per owner instruction.
3. Phase 3 evidence/decisions where available.
4. Phase 4 consolidated decisions for later reconciliation, including D-017 and D-032.
5. Phase 5 vernacular work as a register proposal with mechanical/listener status kept separate.
6. Recovery documents as gap trackers, not complete historical archives.

## 6. Recommended next actions

1. Integrate the alias registry into the master lexicon or parser as a separate, machine-readable compatibility layer.
2. Add tests: every alias resolves to the preferred form; every preferred form exists; no alias collides with an unrelated current lexeme; alias resolution preserves the source token for diagnostics.
3. Reconcile operator signatures under both old and preferred names: `FRATA/FRAJA`, `FRAKA/FRAMA`, `DRIM/DRUM`, `DRAL/DRAS`, `GRAK/GRASH`, `KWAK/KWASH`.
4. Keep D-017 closed unless source evidence conflicts; test the component formula and frame transform together.
5. Recover original v2.0 morphology/coupling/anchoring source before declaring Phase 4's reconstructed bridge historically exact.
6. Package self-contained validation scripts and actual output logs before describing checks as independently reproduced.
