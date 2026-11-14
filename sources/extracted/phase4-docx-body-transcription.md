# Extracted DOCX transcription: Arcane_Language_Audit_Phase_4.docx

- SHA-256: c8204667c204227ba474fd0b5245fd66f1ba081565671f5a28cf65efb513eaea
- Method: standard-library DOCX XML extraction
- Scope: document-body paragraphs and tables in source order
- Limitations: layout, images, text boxes, comments and tracked-change intent are not reconstructed

ARCANE LANGUAGE AUDIT — PHASE 4

Whole-language audit and consolidated fixes

Working control document | 10 October 2026

Status: DECIDED BY DELEGATION, UNTESTED BY LISTENERS. The project owner asked for the whole language to be inspected and for inconsistencies and holes to be fixed, and left design choices to the auditor. Every change below is a ledger entry (§11). Mechanical checks were run (§10). No spoken or listener test has been done, and the distance measure used for collisions is a heuristic over articulatory features, not an acoustic test.

1. Verdict

The architecture holds, but the specifications disagreed with each other in ways that would have broken the language in use. Three layers had drifted apart: v2.0 (productive morphology), v3.0-L (a typed prefix lexicon) and the Phase 1 to 3 audit findings. This phase reconciles them into one two-subsystem language and closes the open items from Phase 3.

Two subsystems, one language. A Construction system (v2.0 Feet, couplings, scoped references) says what the mana does. An Expression system (v3.0-L typed prefix operators) computes values, selects targets and controls timing. A compile bridge maps one to the other (§3).

Three phonology defects. /z/ is used (ZA, ZET) but absent from the inventory; PLA breaks the onset-cluster list; v2.0 axis letters (d, g) are bare consonants that cannot be syllables. Fixed without changing any of those words (§4).

Seven sibling collisions renamed. Opposites such as add/subtract/multiply, and/or/not and bind/reference/live differed by one place of articulation. Seven forms changed; the old forms are kept as aliases (§5).

35 missing roots added. Time, sets, iteration, requirements, exponent, relations, control states, blocks, and two units. All are legal and clear of the existing heads (§5).

Grammar rules closed. Fixed arity, no optional arguments, clause-level modifiers, BEGIN/END blocks, numerals closed by a unit (§6).

Still open. The vernacular register has no lexicon or syntax at all, and nothing has been tested with listeners (§12).

2. Inconsistency and hole register

Each row is a defect found by reading the specifications against each other or by the mechanical checks. IDs L-01 to L-26 map to ledger entries in §11.

## Table 1

| ID | Defect | Resolution | Status |
| L-01 | /z/ appears in ZA (digit 0) and ZET (WHILE), and in the v2.0 hand-flame, but the 18-consonant inventory has no /z/. | Add /z/ as a 19th consonant: voiced counterpart of /s/, onset only, lexical only (not a frame), like /v/. | DECIDED |
| L-02 | PLA needs the onset pl, but the cluster list was “common combinations”, never closed. | Close the list at 13 clusters: the 12 listed plus pl. No other cluster is added. | DECIDED |
| L-03 | v2.0 writes axes as bare consonants (d-, g-), which cannot be spoken under (C)(C)V(V)(C). v3.0-L has CV forms. | CV forms (pa ba ta da ka ga) are canonical. Bare letters are a written abbreviation only. | DECIDED |
| L-04 | Orthography is marked LOCKED but never defined. | Romanisation defined (§4). | DECIDED |
| L-05 | v2.0: stress marks structural priority. v3.0-L: default penultimate stress, “not a second grammatical system”. | Default penultimate. Contrastive stress marks priority in Performed Arcana only and never separates two lexemes. | DECIDED |
| L-06 | Sibling heads one feature apart: FRAPA/FRATA/FRAKA, GRAT/GRAK, KWAT/KWAK, DREM/DRIM, DRAN/DRAL, LEN/REN. | Seven renames (§5.1). | DECIDED |
| L-07 | Closed literal classes have near-collisions by design: digits vs units (15 pairs), axes (9), spatial relations (4), couplings (11). | Not renamed. Prosodic mitigation: unit syllables fall and lengthen; coupling syllables are heavy. | PROVISIONAL |
| L-08 | Many v3.0-L heads are CVC and so have the shape of a Foot (BEK, NES, LEN, SUR, PAR, NET). | Resolved by slot: Feet occur only inside construction clauses. ZET and ZA cannot be Feet because /z/ is not a frame. | PROVISIONAL |
| L-09 | Property words begin with a literal CV: PALA/pa, DAVE/da, GAMA/ga, FETA/fe, KERA/ke, POMA/po. | Accepted: type-resolved. New roots avoid it. | DECIDED |
| L-10 | References: v2.0 fuses scope into one syllable (mi me mə …); v3.0-L has bare MI, NI, RI plus geometry words whose vowels do not match. Bare MI sounds like fused mi (SELF-point). | Both kept. Bare MI, NI, RI are formal spellings that perform as mə, nə, rə (default scope = volume). The 12 fused forms are the Performed references. | DECIDED |
| L-11 | v2.0 forms ri (exponent), li (tolerance), ek, no clash with v3.0-L (RI is TARGET). | Retired for those roles. New roots: POWER, SCI, WITHIN (§5.2). | DECIDED |
| L-12 | v3.0 verbs KREN, TRAK, FREM, SHREN, BRAN, VARE are absent from v3.0-L, and v2.0 Feet already encode the same ideas. | Verbs become formal aliases of Foot patterns (§3.2). | DECIDED |
| L-13 | v2.0 gives ŋ both as a “maintain” coda and as the feedback marker. | Coda m, n = maintain open-loop; coda ŋ = maintain under feedback. | DECIDED |
| L-14 | IF = s, WHILE = ʃ, UNTIL = f in v2.0; BEK, ZET and nothing for UNTIL in v3.0-L. | BEK, ZET, new root KOLE (UNTIL) are formal words. s-, sh-, f- are their Performed clitics. | DECIDED |
| L-15 | v2.0 wi (live) and we (locked) vs v3.0-L KWAK only. Also wi, we are valid Feet. | wi = KWASH (live). we = KWAM then KWAT (lock). Performed clitics, resolved by slot. | PROVISIONAL |
| L-16 | Spatial roles po, fo, lo exist in v2.0 and are missing in v3.0-L. | Retained as a closed class (D-027). | DECIDED |
| L-17 | Numerals have no boundary; dimensionless numerals and numeric identifiers are unterminated (Phase 3). | Every numeral ends in a unit. SHO is the dimensionless unit. Identifiers are numerals closed by SHO. | DECIDED |
| L-18 | ZA SHI TO ZA MA is labelled 0.200 m but encodes 0.20 m. | Label corrected. Digits after the decimal point carry precision. | DECIDED |
| L-19 | Three grammar formulas (v2.0 slot order; v3.0 HEAD+CORE+PARAMETERS+CONSTRAINTS+CONTROL; v3.0-L HEAD+ARGUMENTS+MODIFIERS). | Formal is head-initial. Performed order is the compiled form (§3.3). | DECIDED |
| L-20 | Argument boundaries, modifier scope and optional arguments unresolved (Phase 1 G-01, G-03 to G-05). | Grammar rules G-1 to G-6 (§6). | DECIDED |
| L-21 | No words for time, sets, iteration, requirements, exponent, relations, control states or blocks, yet all are named in canon. | 35 new roots (§5.2). | PROPOSED |
| L-22 | Conditions mix events and states (“entered the field”). | IF fires when its whole condition becomes true. ONSET (RUKI) makes one inner term edge-based. | DECIDED |
| L-23 | Caster axes are left-handed, so DRIM has no handedness rule (Phase 3). | DRIM follows the physical right-hand rule; the component formula is negated in the caster frame. | DECIDED |
| L-24 | No frame-transform operation although FE exists. | New root TRANSFORM (LABU). | PROPOSED |
| L-25 | The premise promises four registers. Only Formal and Performed have any content. | Vernacular plan in §12 (Phase 5). | OPEN |
| L-26 | Status tables claim “LOCKED”, “~95%”, “~90%” coverage with no stated criterion. | Percentages retired. Measured counts reported instead (§10). | DECIDED |

3. Integrated architecture

3.1 Two subsystems

The premise says Arcane has low morphology and meaning comes from combining operators. That holds for the Expression system. The Construction system keeps v2.0’s one productive morphology, the Foot (frame + parameter vowel + relation coda), because it is the only part of the language that can say what the mana does without a dictionary of spells. v3.0’s Mechanism Completeness rule needs exactly that.

## Table 2

|  | Construction system (v2.0) | Expression system (v3.0-L) |
| Says | What the mana configuration does: states, couplings, anchors, release. | Values, targets, conditions, timing, requirements. |
| Shape | Feet (CVC), h-couplings, fused references. | Typed prefix operators with fixed arity. |
| Order | Reference, spatial, Feet, coupling, quantity, control, release. | Head, then arguments, then modifier clauses. |
| Lexicon | Closed: 6 frame classes, 6 parameter vowels, 5 codas, 6 couplings. | Open: roots are added through the ledger. |

3.2 Verbs as aliases of Foot patterns

v3.0 names five verbs that v3.0-L dropped. They are kept as formal names for common Foot patterns, so the Macro Transparency Law holds: each expands to a valid construction.

## Table 3

| Formal verb | Foot pattern | Note |
| TRAK (alter) | voiceless-stop frame p, t, k (discrete change) | Clear. |
| KREN (establish) | voiced-stop frame b, d, g (reinforced counterpart) | PROPOSED reading of v2.0 “reinforced”. Needs owner confirmation. |
| FREM (maintain) | relation coda m, n; coda ŋ = maintain with feedback | Fixes the v2.0 ŋ conflict (L-13). |
| SHREN (release) | relation coda s, sh | Clear. |
| BRAN (couple) | h + domain vowel (hə he ha hu hi ho) | Clear. Coupling syllables are heavy. |
| VARE (prefer) | soft-requirement modifier, not a Foot | Pairs with REQUIRE (hard). |

3.3 Compile bridge

Formal Arcana is head-initial and nested. Performed Arcana is the compiled form: reference, then spatial role and vector, then Feet, then couplings, then quantity, then control, then release. A reference persists until replaced (v2.0 §29).

Reference + scope compress to one syllable (me = SELF-surface). Bare MI, NI, RI default to volume scope and perform as mə, nə, rə.

Control words have clitic forms in Performed speech: s- (IF), sh- (WHILE), f- (UNTIL). Live and locked values are wi and we.

Parameter vowel to property family (PROVISIONAL): a = energy family (ENRA, TEVA, PURA); u = motion family (VANU, KERA, POMA, FETA); o = extent (PALA, geometry measures); e = structure and form; i = information; ə = baseline. Mass (MORU) enters through the matter coupling he, not through a parameter vowel.

Coupling vector in Magic v3.0 §14 to h-domains (PROVISIONAL): mechanical = he; thermal = he + ha; electromagnetic = ho (+ ha); chemical = he; biological = hu; informational = hi; mana only = hə.

4. Phonology and orthography

## Table 4

| Item | Decision |
| Consonants (19) | p b t d k g \| m n ng \| f v s z sh h \| l r \| w j. /z/ is new: onset only, lexical only. Frame consonants exclude v and z. /ng/ is coda only. |
| Vowels (6) | a e i o u ə. Length is duration, not a separate vowel. |
| Syllable | (C)(C)V(V)(C). Legal codas: m n ng p t k s sh l r. |
| Onset clusters (13) | pr br tr dr kr gr kw gw tw fr fl shr pl. The list is closed. |
| Romanisation | sh = ʃ, ng = ŋ, ə written ə (ASCII fallback ë). Hyphen separates Feet and numeral parts. Middle dot separates phrases. Capitals mark Formal words; lowercase transcribes Performed speech. |
| Stress | Penultimate; monosyllables are stressed. Contrastive stress marks structural priority in Performed Arcana only. |
| Prosodic rules (PROVISIONAL) | Unit syllables fall in pitch and lengthen, closing a quantity. Digits stay level. Coupling syllables are heavy. Rising marks outward or developing relations, falling marks resolving ones (v2.0). |

5. Lexicon changes

5.1 Sibling renames

Found by scoring every pair of heads with a feature-distance heuristic and renaming only same-class pairs below 2.0, changing only the position where the pair differed. Old forms stay valid as aliases, so earlier scripts and animation material are not broken.

## Table 5

| Concept | Old | New | Reason |
| cross product | drim | drum | distance to nearest head 2.25 |
| region | ren | ben | distance to nearest head 2.5 |
| subtract | frata | fraja | distance to nearest head 2.5 |
| multiply | fraka | frama | distance to nearest head 2.5 |
| not | grak | grash | distance to nearest head 2.5 |
| live evaluation | kwak | kwash | distance to nearest head 2.5 |
| compare | dral | dras | distance to nearest head 2 |

Cross-class pairs left as they are, monitored, and resolved by the type of the following argument: dran/gran, dran/bran, gran/bran, pla/pala, net/nes, net/zet.

5.2 New roots

Two-syllable roots, legal under §4, at least 2.0 from every existing head, with siblings differing in first onset and first vowel. Chosen by a seeded search, so they are arbitrary by design.

TIME

## Table 6

| Concept | Root | Meaning |
| NOW | BONI | instant of evaluation |
| BEFORE | VOTE | before |
| AFTER | FUWO | after |
| DELAY | SHASU | offset before a start |
| DURATION | WELA | how long a state is held |
| INTERVAL | VITU | repetition period |
| DEADLINE | SHOWA | deadline |
| PREDICT | LEKO | estimate a future state |

SETS

## Table 7

| Concept | Root | Meaning |
| UNION | TUDE | union |
| ISECT | KOFA | intersection |
| DIFF | LIPE | difference |
| COMPL | BELU | complement |
| FILTER | TILE | filter by predicate |
| ORDER | WUKE | order by key |
| PICK | FUPA | pick min, max or nth |
| SEARCH | BUVE | search a domain |
| ANY | BEMI | exists |
| ALL | TIPA | for all |

CONTROL

## Table 8

| Concept | Root | Meaning |
| UNTIL | KOLE | until |
| EACH | WEKI | for each |
| ONSET | RUKI | condition becomes true (edge) |
| BEGIN | METO | block open |
| END | DOGU | block close |

REQUIREMENT

## Table 9

| Concept | Root | Meaning |
| REQUIRE | MOSHA | hard requirement |
| PRESERVE | LISHO | invariant |
| WITHIN | VOBI | tolerance |

MATH AND RELATIONS

## Table 10

| Concept | Root | Meaning |
| POWER | WUGA | exponent |
| SCI | LEVU | scientific notation |
| EQ | NADI | equal |
| LT | DOFA | less than |
| GT | GUWI | greater than |

CONTROL STATE AND FRAME

## Table 11

| Concept | Root | Meaning |
| ATTACHED | LURI | attached |
| TRANSFERRED | DENA | transferred |
| INDEPENDENT | VOTU | independent |
| TRANSFORM | LABU | frame transform |

Derived, no root needed: RATE (divide by a time), NE, LE, GE (NOT of EQ, GT, LT), normalise, reverse, parallel and perpendicular components (Phase 3 §5).

Units: SHO is the dimensionless unit. VO is the bit. No dimension is assigned to information yet (Phase 3 D-015).

5.3 Residual risk in closed classes

## Table 12

| Class | Pairs under 2.0 | Mitigation |
| Digits and units | 15 | Unit syllable falls and lengthens; every numeral ends in a unit. |
| Axes | 9 | Axis words are always followed by a quantity; the role word precedes. |
| Spatial relations | 4 | Prosody (toward rises, away falls) plus argument type. |
| Couplings | 11 | Heavy syllables; domain checked against the Foot parameter that precedes. |
| References and roles | 2 and 1 | Slot at clause start. |

These need listener tests. If a pair proves confusable, rename it through the ledger.

6. Grammar rules

G-1 Fixed arity. Every head has one arity and a typed signature (Phases 2 and 3). Argument boundaries need no separator.

G-2 Numerals. Every numeral is closed by a unit. SHO closes dimensionless numerals. A binding identifier is a numeral closed by SHO. Tests P4-T11 to T14c.

G-3 No optional arguments. Defaults come only from context bindings that are in scope (reference, frame, PathwayContext). A missing required context is a static rejection.

G-4 Modifiers. A modifier is a clause-level head that attaches to the nearest preceding clause at the same block level. Modifier classes: time (DELAY, DURATION, INTERVAL, DEADLINE), requirement (REQUIRE, VARE, PRESERVE, WITHIN), control state (ATTACHED, TRANSFERRED, INDEPENDENT), coupling, and spatial roles.

G-5 Blocks. IF, WHILE, UNTIL and EACH take a condition then a block. Blocks open with BEGIN (METO) and close with END (DOGU). In Performed speech the delimiters become a pitch reset and lengthening, and a one-clause block may omit them.

G-6 Conditions. IF fires when its whole condition becomes true. ONSET makes one inner term edge-based. WHILE keeps running while true. UNTIL stops when true.

7. Phase 3 decisions closed

## Table 13

| ID | Decision |
| D-017 | DRIM follows the physical right-hand rule. In the left-handed caster frame the component formula is negated, so BA × DA (right × up) gives KA (backward). Test P4-T16 confirms right × up points backward in a right-handed world. |
| D-018 | Exponent is POWER (WUGA), scientific notation is SCI (LEVU), tolerance is WITHIN (VOBI). v2.0’s ri, ek, no, li are retired for these roles. |
| D-019 | Option B: every numeral ends in a unit; SHO is dimensionless; identifiers are SHO-closed numerals. This also settles identifiers, which the first test run had left unparsed. |
| D-023 | Relation values are EQ (NADI), LT (DOFA), GT (GUWI). NE, LE, GE are NOT of EQ, GT, LT. Equality needs a tolerance (WITHIN). |
| D-026 | Hand-flame label corrected to 0.20 m. Digits after the decimal point carry precision. |
| D-027 | Roles po, fo, lo retained as a closed class. |

8. Worked example: hand-flame in both layers

Performed (transcribed): mel · po da za shi to za ma · kan ken · he ha · sa shi za se · kas

## Table 14

| Part | Formal reading | Performed |
| Reference | MI, surface scope, anchored to the hand | mel (me + anchor coda l) |
| Position | PO, +Y (DA), 0.20 m | po da za-shi-to-za ma |
| Construction | TRAK ENRA then FREM: energy state held; structure held | kan, ken |
| Coupling | BRAN matter, BRAN energy | he, ha (heavy) |
| Duration | DURATION 5.0 s (WELA) | sa-shi-za se (falling) |
| Release | SHREN energy | kas |

KAN does not mean fire. Whether the result is a flame still depends on parameters this example leaves unspecified (energy magnitude, extent, what matter is coupled). Tokenisation and legality were checked (P4-T08); no grammar-level parse of the whole spell was run.

9. What was checked, and what was not

Checked: phonotactic legality of all 132 spoken forms; duplicates; sibling distance; Foot shape; the numeral rules on token lists; hand-flame tokenisation.

Not checked: any spoken form with listeners; the compile bridge beyond the one example; typed parsing of full spells; feasibility.

The distance measure counts differences in place, manner, voicing and vowel height or backness. It flags risky pairs. It cannot say a pair is safe.

10. Measured inventory and test results

The draft lexicon has 140 rows: 86 existing forms (after seven renames), 35 new roots, 2 new units, 12 fused references and 5 clitic forms (three of the existing forms are now written as formal reference spellings). This replaces the old “~95%” figures; coverage will be measured against a concept list once Phase 5 builds one.

## Table 15

| ID | Test | Status | Detail |
| P4-T01 | Every draft-lexicon form is phonotactically legal (19 consonants, 13 onset clusters) | PASS | 132 forms checked |
| P4-T02 | No two lexemes share a spoken form, except the declared slot-resolved homophones re and ra | PASS | re, ra declared |
| P4-T03 | Original inventory (18 consonants, 12 clusters) rejects za, zet, pla | PASS |  |
| P4-T04 | No same-class pair of heads is below distance 2.0 | PASS |  |
| P4-T05 | z and v are not frame consonants; Feet cannot contain them | PASS |  |
| P4-T06 | zet and za are lexical-only (not Foot-shaped) | PASS |  |
| P4-T07 | Axis consonants alone are not syllables; CV axis forms are | PASS |  |
| P4-T08 | Hand-flame (performed) tokenises into legal Feet, roles, axes, couplings and unit-closed numerals | PASS |  |
| P4-T09 | ZA SHI TO ZA MA encodes 0.20 m (two decimal places), so the 0.200 m label is corrected | PASS |  |
| P4-T10 | kan, ken, kas, kal, mel are Foot-shaped (frame + parameter vowel + relation coda) | PASS |  |
| P4-T11 | Option B: FRAPA KI DL TO MU DL has exactly one parse (1, 23) | PASS |  |
| P4-T12 | Option B: FRAPA KI TO DL MU DL has exactly one parse (12, 3) | PASS |  |
| P4-T13 | Option B: an unterminated numeral has no parse (FRAPA KI TO MU) | PASS |  |
| P4-T14a | Identifier as a plain numeral: KWAM KI DL TO MU MA is NOT parsed by the unmodified Option B rule (identifier needs its own rule) | PASS | first attempt failed; this is the defect |
| P4-T14b | Identifier = dimensionless-unit numeral: KWAM KI DL TO MU MA has exactly one parse (id 1; 23 m) | PASS |  |
| P4-T14c | Identifier rule: KWAM KI TO DL MU MA has exactly one parse (id 12; 3 m) | PASS |  |
| P4-T16 | Physical right x up points backward (= -forward) in a right-handed world | PASS | [ 0 -1  0] |

17 of 17 tests passed. P4-T14a expects a non-parse and records the defect found on the first run: the plain Option B rule left identifiers unparsed, which led to the identifier rule. Scripts: arcane_lexicon_tools.py and phase4_finalize.py.

11. Decision ledger entries

Continues from D-027. “Decided” means decided under the owner’s delegation, not tested with listeners.

## Table 16

| ID | Change | Register | Status |
| D-028 | Add /z/ as a 19th consonant (onset only, lexical only). | L-01 | DECIDED |
| D-029 | Close the onset-cluster list at 13, adding pl. | L-02 | DECIDED |
| D-030 | CV axis forms canonical; bare consonants are written abbreviations. | L-03 | DECIDED |
| D-031 | Romanisation and stress rule (§4). | L-04, L-05 | DECIDED |
| D-032 | Seven sibling renames, old forms kept as aliases. | L-06 | DECIDED |
| D-033 | Prosodic mitigation for closed classes; listener tests required. | L-07, L-08 | PROVISIONAL |
| D-034 | References: bare = volume scope; fused forms are Performed references. | L-10 | DECIDED |
| D-035 | v3.0 verbs are formal aliases of Foot patterns; KREN reading proposed. | L-12 | PROPOSED |
| D-036 | Coda ŋ = maintain under feedback. | L-13 | DECIDED |
| D-037 | UNTIL root KOLE; s-, sh-, f-, wi, we as Performed clitics. | L-14, L-15 | DECIDED |
| D-038 | Grammar rules G-1 to G-6. | L-19, L-20, L-22 | DECIDED |
| D-039 | 35 new roots and 2 units. | L-21, L-24 | PROPOSED |
| D-040 | Retire percentage status claims; use measured counts. | L-26 | DECIDED |
| D-041 | Vernacular register plan (Phase 5). | L-25 | OPEN |

12. What remains

Vernacular register (largest hole). The premise promises jokes, arguments, gossip and slang, but there is no everyday lexicon, pronoun system, question form or politeness system. Proposed plan: vernacular shares the phonology and the closed classes (references, numerals, spatial words, logic) and descends from the same Proto-Arcane, with its own open-class vocabulary and looser syntax. Phase 5 should seed about 100 words and a corpus.

Listener tests. Every PROVISIONAL and DECIDED item that depends on sound needs a speaker and listener pass, starting with the seven renames and the unit-falling-pitch rule.

Anatomical landmarks. MEL relies on the caster’s body map. A formal landmark system is still missing.

Information and mana dimensions. Carried over from Phase 3 (D-015, D-024).

A full parser. The checks here are token-level. A parser for the whole grammar would turn the example corpus into real tests.

Outside the language. The Logos substrate and energy cost (Phase 2 D-012) is a magic-system question.

<!-- paragraphs: 69; tables: 16 -->
