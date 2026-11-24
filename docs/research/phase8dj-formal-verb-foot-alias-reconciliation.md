# Phase 8DJ — Formal verb-to-Foot alias reconciliation

**Canon effect:** NONE. **Grammar changes:** none. **Compiler/execution:** disabled. **Tests:** 14 authored and registered; not run locally.

## 1. Important correction and distinction

Phase 4 §3.2 explicitly says the five v3.0 verbs dropped from v3.0-L are retained as formal names for common Foot patterns. It says each expands to a valid Construction under the Macro Transparency Law. Table 3 gives six entries when VARE is included: TRAK, KREN, FREM, SHREN, BRAN and VARE.

This refines Phase 8DI's finding. It is accurate that no complete v3.0-L Expression-AST-to-Construction compiler mapping is recovered. It would be inaccurate, however, to say that there are no formal verb-to-Foot alias relationships. Those pattern-level alias relationships are explicitly recorded in Phase 4 §3.2.

These are separate relationships:
- **Expression system:** v3.0-L typed prefix operators with fixed arity, head + arguments + modifier clauses.
- **Formal verb aliases:** names for common Construction Foot patterns, described by Phase 4 §3.2.
- **Performed Construction:** the compiled form ordered reference, spatial role/vector, Feet, couplings, quantity, control, release.

The alias table does not establish a one-to-one mapping from each Expression AST node to a macro, nor does it provide exact expansions, argument signatures, resource contracts or physical feasibility.

## 2. Recovered alias evidence

| Formal alias | Recovered pattern | Status / boundary |
|---|---|---|
| TRAK (alter) | p/t/k voiceless-stop frame group; discrete change | Pattern described; individual Foot expansion and signatures not recovered |
| KREN (establish) | b/d/g voiced-stop reinforced counterpart | Explicitly proposed; owner confirmation required |
| FREM (maintain) | m/n open-loop; ng/ŋ maintenance with feedback | Relation-coda associations explicit; operational contract incomplete |
| SHREN (release) | s/sh relation-coda family | Relation-coda association explicit; release target/mode/safety incomplete |
| BRAN (couple) | h + domain vowel: hə/he/ha/hu/hi/ho | Six heavy coupling forms explicit; physical mapping provisional |
| VARE (prefer) | Soft-requirement modifier paired with hard REQUIRE | Explicitly not a Foot |

The source calls the first five “verbs”; VARE is included in Table 3 as a modifier, not a Foot. The six records must not be collapsed into six Foot categories.

## 3. Macro Transparency Law

Phase 4 says each formal alias expands to a valid Construction. This is a meaningful architectural constraint: a formal alias is not intended to be an opaque spell label. It should be transparent to Construction.

But the recovered source does not provide the exact expansion algorithm or the full pattern/signature for each alias. We therefore record the law as a source-backed principle and the expansions as NOT-RECOVERED. We do not manufacture a mapping from TRAK to a particular p... Foot, or from FREM to an arbitrary CVC string.

## 4. Foot morphology implications

The Phase 4 primary-source concordance remains:
- six frame consonants: p, b, t, d, k, g;
- six parameter vowels: a, u, o, e, i, ə, with property-family mappings provisional;
- five relation codas: m, n, ng/ŋ, s, sh;
- CVC Foot shape in Phase 4 §3.1 Table 2, with Phase 5.16 C-02 optional-coda context discrepancy retained.

The alias relationships operate at pattern-family level. They do not supply the missing individual frame meanings, parameter value typing, productive 180-item lexical paradigm, argument structure or physical semantics.

BRAN's coupling syllables are a separate class and must not be inserted into the Foot relation-coda slot. VARE is a modifier and must not be inserted into the Foot inventory.

## 5. Companion reader change

The Construction inspector now presents a dedicated alias-evidence table. It distinguishes the formal alias and gloss, source-backed pattern family, owner-confirmation or provisional status, unresolved fields, and the fact that exact expansion and signatures are not recovered.

The UI must not imply that selecting a formal alias compiles or executes a Construction.

## 6. Source-backed performed bridge

Phase 4 §3.3 describes Formal Arcana as head-initial and nested and Performed Arcana as its compiled form. It gives the performed sequence:
1. reference;
2. spatial role and vector;
3. Feet;
4. couplings;
5. quantity;
6. control;
7. release.

It also describes reference persistence until replaced, reference+scope compression, default volume-scope performed forms for bare MI/NI/RI, control clitics s-/sh-/f-, and live/locked forms wi/we. The wi/we interpretation remains provisional under L-15.

Parameter-vowel property families and h-domain physical mappings remain provisional. The historical performed compression rules are not silently converted into new current formal grammar or universal deletion rules.

## 7. Decisions not made

- No exact Foot expansion for any alias.
- No individual p/b/t/d/k/g semantic values.
- No promotion of KREN's reinforced reading.
- No physical mapping promotion for BRAN.
- No mapping from v3.0-L AST operators to individual formal aliases.
- No macro arity, argument slots, resource contract or execution.
- No canon amendment.

**Result:** the formal alias layer is now explicit in the engine and companion inspector. The full compiler remains open, but the source-backed relationship between the formal aliases and Construction patterns is no longer missing from the model.
