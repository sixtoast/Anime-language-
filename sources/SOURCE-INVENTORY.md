# Source Inventory — Initial Repository Scan

**Inventory date:** 2026-10-13  
**Repository:** [sixtoast/Anime-language-](https://github.com/sixtoast/Anime-language-)  
**Scope:** `sources/originals/` on `main`  
**Status:** Initial structural inventory only; not a complete content audit.

## Handling policy

- Preserve all original files and archives. No files were deleted, renamed, moved, or overwritten during this inventory.
- Identical Git blob IDs establish byte-identical repository files, even if filenames differ. They do not establish that the content is unimportant.
- Different file hashes do not necessarily mean different knowledge; versions must be compared semantically.
- ZIP contents are not counted as individually inventoried documents until the archive can be extracted and its manifest inspected.
- File-name classifications below are preliminary. Do not treat them as canonical-status decisions.
- Reported test results are historical source evidence, not proof that current repository CI passed.

## Initial findings

- **63 files** are present directly in `sources/originals/`.
- **1 ZIP archive** is present: `Arcana mega pack.zip` (1.83 MiB).
- File extensions: `zip`: 1; `csv`: 11; `docx`: 7; `txt`: 14; `json`: 4; `md`: 4; `pdf`: 3; `py`: 19.
- **3 exact-duplicate filename groups** detected by identical Git blob SHA (details below).
- `PHASE_2_README.txt` is zero bytes.
- A Phase 5.17 test-results file reports 13 checks: 3 PASS, 1 FAIL, 6 BLOCKED BY MISSING SPECIFICATION, and 3 NOT YET TESTED. This is a recorded historical report, not a fresh test run.
- That report specifically flags the lexicon's forms `ra` (radian vs TARGET-path) and `re` (digit 4 vs TARGET-surface) as unresolved homographs without a proven executable disambiguation grammar.
- The Phase 5 readme describes the combined v5 lexicon as 255 rows and says its vernacular roots have not been tested with listeners. These are source claims to verify against the files and broader record.

## Exact duplicate groups

- `Arcane_Lexicon_v5_draft 2.csv` and `Arcane_Lexicon_v5_draft.csv` — identical blob SHA `2ec3b66ccdcecf517fa236ff06b88f1c5faaed96`.
- `Arcane_Phase_5_15_Construction_Contract_Matrix 2.csv` and `Arcane_Phase_5_15_Construction_Contract_Matrix.csv` — identical blob SHA `8c162f1817948cb2cb39f2dedc640c0742f5cf9b`.
- `arcane_audit_parser 2.py` and `arcane_audit_parser.py` — identical blob SHA `dd5b7c8e9d7926a69cd96cbb67ec265adc7c49bc`.

## File-by-file manifest

| File | Bytes | Git blob SHA | Preliminary classification |
|---|---:|---|---|
| `Arcana mega pack.zip` | 1921727 | `2e77e593f3b8327b5e0e142b501b7703487c6f67` | Archive — contents not yet inspected |
| `arcane lexicon tools.pdf` | 56021 | `faa02d4858773068285ffc9339ab54d9ae139f0b` | Phase/tool documentation |
| `Arcane_Alias_Registry_Phase_5_5.csv` | 1172 | `beb38dabb2c5087119d58add1bd10bfe196d5662` | Alias registry |
| `arcane_alias_validator.py` | 4868 | `ca0a12cdebc5043b4f58bc39be1e265756482a79` | Historical prototype / validator / test script |
| `arcane_audit_parser 2.py` | 5319 | `dd5b7c8e9d7926a69cd96cbb67ec265adc7c49bc` | Historical prototype / validator / test script |
| `arcane_audit_parser.py` | 5319 | `dd5b7c8e9d7926a69cd96cbb67ec265adc7c49bc` | Historical prototype / validator / test script |
| `Arcane_Continuity_Recovery_Audit.docx` | 39528 | `9f3b177c3d0c303fe526e2c82de3a41ff6a13051` | Audit / decision / test-register document |
| `Arcane_Decision_Ledger.docx` | 37583 | `a67175ccc9bd2218b7df33cab06f96694f14ac86` | Audit / decision / test-register document |
| `Arcane_Grammar_Consistency_Test_Register.docx` | 37906 | `416da97445a927b84281b3306eaf7c2db8581c4f` | Audit / decision / test-register document |
| `Arcane_Language_Audit_Phase_1.docx` | 39503 | `01c0c1b9ca2cc0503e660d498e9c45662600b182` | Audit / decision / test-register document |
| `Arcane_Language_Audit_Phase_2.docx` | 39899 | `81eaad10778fb00d3528f7d5d90275b7d1c33615` | Audit / decision / test-register document |
| `Arcane_Language_Audit_Phase_4.docx` | 27027 | `e3dca2ef236f89be442556c989e79d5b977a82b1` | Audit / decision / test-register document |
| `Arcane_Language_Audit_Phase_5.docx` | 21612 | `728600f7f99827bd7422e0995f4d8ea130733eba` | Audit / decision / test-register document |
| `Arcane_Lexicon_v4_draft.csv` | 6525 | `c56a6ea6dd248d303286386331f02857e6ed9474` | Lexicon draft |
| `Arcane_Lexicon_v5_draft 2.csv` | 12621 | `2ec3b66ccdcecf517fa236ff06b88f1c5faaed96` | Lexicon draft |
| `Arcane_Lexicon_v5_draft.csv` | 12621 | `2ec3b66ccdcecf517fa236ff06b88f1c5faaed96` | Lexicon draft |
| `Arcane_Operator_Contract_Reconciliation.csv` | 2273 | `9b32841a80b84b52ceafffd696df025732c6afad` | Operator/contract data |
| `Arcane_Phase_5_11_Test_Results.txt` | 484 | `af86a3ebca868fd07ac1fa8168bc650620536a2a` | Test results |
| `Arcane_Phase_5_12_Operator_Registry.csv` | 11863 | `445c853a180f5a8dc4a9b9f66ddc658459a15dbd` | Operator/contract data |
| `Arcane_Phase_5_12_Operator_Registry.json` | 22092 | `52b86cc99676122b733d5ed411c8a149c085fea8` | Structured registry |
| `Arcane_Phase_5_12_Test_Results.txt` | 758 | `e86d92e438ddf11ea9bc8588ce1010b0ed4454e7` | Test results |
| `Arcane_Phase_5_13_Test_Results.txt` | 541 | `7ef8ec1033f306c034e75efd8e7b188f537b4f53` | Test results |
| `Arcane_Phase_5_14_Test_Results.txt` | 401 | `7eaa0b4c42cb773b584fd8af765593f196f6144b` | Test results |
| `Arcane_Phase_5_15_Construction_Contract_Matrix 2.csv` | 4059 | `8c162f1817948cb2cb39f2dedc640c0742f5cf9b` | Operator/contract data |
| `Arcane_Phase_5_15_Construction_Contract_Matrix.csv` | 4059 | `8c162f1817948cb2cb39f2dedc640c0742f5cf9b` | Operator/contract data |
| `Arcane_Phase_5_15_Test_Results.txt` | 478 | `2dd20917101ce61fce33fd756c6e4d336df71585` | Test results |
| `Arcane_Phase_5_16_Construction_Recovery_Matrix.csv` | 1882 | `620aa7ec0e79f8df8f43d36a7b03417d569b894e` | Test, construction or recovery data |
| `Arcane_Phase_5_17_Test_Results.json` | 5800 | `5fd2c107445c64c557d59d25a28095c6725df6a9` | Test results |
| `Arcane_Phase_5_18_Results.json` | 3055 | `96a0e9756705e3b988a9cf185b277a2e690f8a33` | Test results |
| `Arcane_Phase_5_20_Results.json` | 1596 | `cfc3ef313cb8d443849f88a545e3375c44e8175b` | Test results |
| `arcane_phase_5_22_parser.py` | 8693 | `e6202bdf9a3c726e4103aece1ba711a287d5899d` | Historical prototype / validator / test script |
| `arcane_phase_5_23.py` | 10362 | `2d781c4cf6ac3d1f566efef187bcd8c85631c316` | Historical prototype / validator / test script |
| `arcane_phase_5_24.py` | 11463 | `15b49a87021585dc38c054b9ad44e4c9b93b5a34` | Historical prototype / validator / test script |
| `Arcane_Phase_5_5_Source_Reconciliation.md` | 5763 | `66255e2968663a6bdfc8e00c8a7ea70bffe41803` | Markdown source / report / readme |
| `Arcane_Phase_5_6_Alias_and_Operator_Audit.md` | 5436 | `1e90543d8e00b1f616a78d0887473982c6bcc138` | Markdown source / report / readme |
| `Arcane_Phase_5_7_Grammar_Resolver_Validation.md` | 4546 | `77253dde01bb4d87f8e6a67bdfa2a9231fc0f8a8` | Markdown source / report / readme |
| `Arcane_Phase_5_7_Test_Cases.csv` | 1129 | `5cedfb95d72f22b6c4085d3bb8d3e7c264a386f3` | Test, construction or recovery data |
| `Arcane_Phase_5_7_Test_Results.txt` | 2873 | `f81a3d68e531a36d826dd300d3bf5c06708830f4` | Test results |
| `Arcane_Phase_5_8_Test_Cases.csv` | 1412 | `c26bf7e57b08209c0bcfec9d29adcd942e949e80` | Test, construction or recovery data |
| `Arcane_Phase_5_8_Test_Results.txt` | 1874 | `aa77bc3f5367ce79f7f82caaae1b18b8303562ee` | Test results |
| `Arcane_Phase_5_9_Test_Results.txt` | 1202 | `fb8a606bef8e69615c2a963435cbe9a3c976b541` | Test results |
| `arcane_phase510_numerals_frames.py` | 5012 | `128541816ac86fc0fe863396e26fc39437322997` | Historical prototype / validator / test script |
| `arcane_phase511_typed_parser.py` | 5795 | `f096044ccfb41237b5d13e1c5a63e59aa503bf67` | Historical prototype / validator / test script |
| `arcane_phase513_ast_validator.py` | 5722 | `c0ffea9f131fe53d5f45966ce85365776c90614d` | Historical prototype / validator / test script |
| `arcane_phase515_construction_gate.py` | 2028 | `2892d11d7407657aa5c2d30e99195513050dc92d` | Historical prototype / validator / test script |
| `arcane_phase57_tests.py` | 2120 | `45b1c59093e732d1585daad5fff8c3a89d72fbaf` | Historical prototype / validator / test script |
| `arcane_phase58_tests.py` | 2336 | `c99901aa4a3658ef9160b2dd9b54b4b8962cff07` | Historical prototype / validator / test script |
| `arcane_phase58_types.py` | 4722 | `366e0b0ea27fcfa3c03730ec4b1f377f24db758a` | Historical prototype / validator / test script |
| `arcane_phase59_semantic_frames.py` | 5824 | `270c4f9042606baeee9664e90b41cf91befe3fb5` | Historical prototype / validator / test script |
| `arcane_phase6b_typed_checker.py` | 6084 | `568ae52fc20c2de3cc646b51bc588f2612208117` | Historical prototype / validator / test script |
| `arcane_phase6c_operator_registry.py` | 6884 | `7fe41e52c1edea0c78148f89395d6d532bde7b03` | Historical prototype / validator / test script |
| `arcane_phase6d_lexicon_bridge.py` | 6731 | `7e6e989bb3878ac89f3668a0e49d423b4b5e74aa` | Historical prototype / validator / test script |
| `arcane_reference_validator.py` | 5306 | `6c82d233a3c3a0c3daa0c5d9bba130418d3a6e4a` | Historical prototype / validator / test script |
| `PHASE 4 README.pdf` | 26790 | `b5ff004c33016949b20ec69c9be99f5cd32eed0b` | Phase/tool documentation |
| `PHASE_1_README.txt` | 439 | `70a94220075a54e42a0d4b2bfe2476c47859734e` | Readme / status / notes |
| `PHASE_2_README.txt` | 0 | `e69de29bb2d1d6434b8b29ae775ad8c2e48c5391` | Readme / status / notes |
| `Phase_5_6_v4_test_results.txt` | 3749 | `6e8e743f3bd1423a7508f840e60509dd76ce109c` | Test results |
| `Phase_5_6_v5_test_results.txt` | 3749 | `8ef855a4e52daa1b7319337b9fe006dae4b0e94d` | Test results |
| `PHASE_5_README.txt` | 1198 | `9ffa33669194fb66691415beb66045ce9992dfa8` | Readme / status / notes |
| `phase4 finalize.pdf` | 48240 | `7caad1753cafbb5c4da971ebb3722fd117099291` | Phase/tool documentation |
| `phase5_vernacular.py` | 11075 | `5a163c5cd8b1fe03eb9c5b7595edbbf4886695c8` | Historical prototype / validator / test script |
| `README.md` | 807 | `1630eecc68e490a2258faa32ff124e21a9dfa6bc` | Markdown source / report / readme |
| `README.txt` | 627 | `083ce7a5498e5981bd1db3f7ad2500da43640ac8` | Readme / status / notes |

## Next audit stages

1. Extract the ZIP and compare its internal file list against the loose files.
2. Compute content hashes for archive members and loose files; record exact duplicates and name collisions.
3. Extract text from DOCX/PDF/TXT/MD/CSV/JSON/Python files and catalogue each source's topic, date/version, provenance, and status.
4. Compare versioned lexicons, alias registries, operator registries, test reports, and phase scripts; preserve all differences.
5. Build a source-to-claim map for the canonical language specification, magic system, grammar, semantics, and implementation.
6. Record unresolved contradictions and missing historical sources as explicit questions rather than guessing.

## Audit status ledger

| Area | Status | Notes |
|---|---|---|
| Repository file listing | Complete for current `main` tree | Tree response was not truncated |
| Exact duplicates among loose repository files | Initial pass complete | Based on identical Git blob SHA |
| ZIP archive member listing | Pending | Archive binary could not yet be extracted through the available repository-reading path |
| Semantic near-duplicate review | Pending | Requires comparing document contents |
| Full source content extraction | Pending | DOCX/PDF and historical code need systematic review |
| Canonical reconciliation | Not started | Do after inventory and provenance review |
