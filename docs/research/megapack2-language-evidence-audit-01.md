# Mega Pack2 Language Evidence Audit 01

**Status:** SOURCE AUDIT; findings are not themselves new canon  
**Source archive:** `docs/Arcana megapack2.zip`  
**Archive SHA-256:** `c3ecfb09909fca5daf7ace1c73df57cd623a2a7d`  
**Audit date:** 2026-10-16  
**Inspection method:** GitHub Actions workflow reads ZIP members in memory, hashes each member, extracts text from text files and DOCX XML, and writes a manifest and searchable index. Archive members are not extracted to arbitrary filesystem paths or executed.

## 1. Inventory

The exact archive was found in the project's main repository. The generated inspection report records:

- Archive size: 483,797 bytes.
- Non-directory entries: 280.
- Declared uncompressed total: 1,027,656 bytes.
- Exact byte-identical duplicate groups: 49.
- Unique readable text documents indexed: 253.
- Read/extraction errors or size-limit skips: 0.
- PDF text: not extracted in this pass.

The duplicate groups mean the archive contains many repeated copies of the same files under renamed paths. They must not be treated as independent evidence. The report retains the archive-member manifest and hashes so later audits can distinguish exact duplicates from distinct versions.

## 2. Important outputs

- Archive manifest and duplicate report: `../../sources/archive-reports/megapack2-report.md`
- Searchable extracted-text index: `../sources/archive-reports/megapack2-text-index.md`
- Source archive itself: `../Arcana megapack2.zip`

The index includes source snapshots such as `Arcane_Lexicon_v5_draft.csv`, `phase5_vernacular.py`, `PHASE_5_README.txt`, Phase 7A–7W reports, test outputs, and runtime/checker source files. The archive is therefore useful for both lexicon provenance and reconstructing the history of the provisional executable subset.

## 3. Phase 5 vernacular evidence

The indexed `Arcane_Lexicon_v5_draft.csv` contains 255 rows, including 115 Vernacular entries. The relevant entries below are explicitly labelled `PROPOSED`, sourced to Phase 5; their presence does not by itself make them historical or canonical forms.

| Form | Gloss | Source status |
|---|---|---|
| teshi | person | Vernacular / PROPOSED / Phase 5 |
| fezo | friend | Vernacular / PROPOSED / Phase 5 |
| wish | see | Vernacular / PROPOSED / Phase 5 |
| shuk | who | Vernacular / PROPOSED / Phase 5 |
| zosh | what | Vernacular / PROPOSED / Phase 5 |
| rawu | word | Vernacular / PROPOSED / Phase 5 |
| gisho | food | Vernacular / PROPOSED / Phase 5 |
| losa | water | Vernacular / PROPOSED / Phase 5 |
| fape | book | Vernacular / PROPOSED / Phase 5 |
| gezi | home | Vernacular / PROPOSED / Phase 5 |
| nak / zir / shus / mos | hear / say / know / learn | Vernacular / PROPOSED / Phase 5 |
| mol / tut | eat / drink | Vernacular / PROPOSED / Phase 5 |
| bul / lil | give / take | Vernacular / PROPOSED / Phase 5 |
| ful / zem | go / come | Vernacular / PROPOSED / Phase 5 |
| fam / kong / tek | can / want / need | Vernacular / PROPOSED / Phase 5 |
| don | already/done | Vernacular / PROPOSED / Phase 5 |
| kok | ongoing | Vernacular / PROPOSED / Phase 5 |

The Phase 5 README says the vernacular generator used seed 5105 and that its phonological distance metric is a heuristic, not a listener test. It reports 7/7 mechanical checks passed and explicitly says the language had not been tested with listeners. The generator's word-selection procedure confirms that the sound shapes were algorithmically selected, not recovered from historical evidence.

**Implication for the current Modern Vernacular line:** many roots already used in v1.0–v1.5 are not newly invented forms; they are Phase 5 proposed lexicon entries now being given a more tightly bounded modern grammar. Keep their original Phase 5 status/provenance intact while treating the new grammar as a later, separately locked modern design.

## 4. Temporal/aspect evidence

The v5 lexicon distinguishes several levels of provenance:

- `don` (“already/done”) and `kok` (“ongoing”) are Vernacular / PROPOSED / Phase 5.
- `boni` (“now, instant of evaluation”), `vote` (“before”), `fuwo` (“after”), `kole` (“until”), `shasu` (“delay”), `wela` (“duration”), `vitu` (“repetition interval”), `showa` (“deadline”) and `leko` (“predict”) are Formal / PROPOSED / Phase 4.
- `bek` (“if”) and `zet` (“while”) are Formal / CANON / v3.0-L.
- The performed `f-` entry for UNTIL is separately recorded as performed/v2.0 provenance.

The Phase 5 generator maps formal temporal forms such as “now”, “before” and “after” into its shared closed-class list, even though the v5 CSV labels those entries Formal / PROPOSED. This is a cross-register mismatch in the generator, not sufficient evidence that those forms have been canonically approved for Vernacular use. Treat explicit temporal adverbs and sequencing as unresolved until their register and syntax are deliberately reconciled.

**Practical decision:** the next bounded Modern Vernacular temporal layer should start with the two Vernacular entries `don` and `kok`, preserving their Phase 5 proposed status. It should not silently promote the Phase 4 Formal temporal inventory into ordinary Vernacular grammar.

## 5. Formal and runtime evidence: keep implementation separate from language canon

The archive contains Phase 7A–7W reports, scripts and test outputs. The later Phase 7W report records a shared AST parser, program-wide function registration, nested function calls and arity checks, duplicate declaration diagnostics, branch-local bindings, CLI pre-validation, and runtime limits. Its captured test output reports 17 passing tests, alongside an unrelated spreadsheet-runtime warmup traceback at Python startup.

However, the Phase 7W report explicitly describes the implementation as a **provisional reconstructed subset**, not the complete canonical Arcane language. It says prefix operator semantics and keyword grammar still require reconciliation with authoritative specifications, and that the earlier source tree was unavailable. The test output validates that bounded implementation snapshot, not the full language or the new Modern Vernacular grammar.

The archive's repeated copies of runtime files are not independent implementations merely because their filenames differ. Hashes should be used to distinguish duplicates before any future code archaeology.

## 6. Scope limitations and source gaps

- This pass extracted text and DOCX document XML; PDFs were inventoried but their text was not extracted.
- `PHASE_5_README.txt` references `Arcane_Language_Audit_Phase_5.docx`, but that named document was not among the unique readable documents indexed from this archive. The README is a description of a referenced deliverable, not a replacement for its full text.
- The archive's decision-ledger DOCX is explicitly labelled a recovery draft and contains unresolved gaps around v2.0 frame–vowel–coda morphology, H-coupling, MEL anchoring, KAN/KEN/KAS, operator signatures and modifier scope.
- No evidence in this archive justifies silently rewriting historical rules, declaring the reconstructed runtime canonical, or promoting every Phase 5/Phase 4 proposal to canon.

## 7. Cross-register collisions that affect current Modern Vernacular

The indexed v5 lexicon also confirms exact collisions relevant to the already locked v1.2 transfer particles:

- `ka` is a Shared / CANON / v3.0-L axis token glossed `-Z`.
- `du` is a Shared / CANON / v3.0-L digit glossed `7`.
- `li` has no exact entry in the inspected v5 lexicon and remains a modern design coinage in the transfer frame.

The v1.2 design already restricts `ka` and `du` to specific transfer-role slots. The source audit makes the remaining obligation explicit: any future parser must resolve `ka` as recipient and `du` as source only in those licensed slots, while preserving the axis and digit readings elsewhere. These are not globally unique strings. The v1.2 specification now records the collision and adds parser-target expectations; parser execution is still not claimed.

## 8. Audit conclusion

Mega Pack2 is now located and indexed. It supplies valuable provenance for the Phase 5 Vernacular lexicon and the history of the provisional Phase 7 runtime. It also strengthens the need to keep three layers separate:

1. **Source-record status** — e.g. Vernacular / PROPOSED / Phase 5.
2. **Modern design decisions** — later bounded grammar rules deliberately locked for present use.
3. **Executable implementation status** — what a specific parser/runtime actually accepts and has tested.

The most actionable new evidence for the ongoing language work is the existing Phase 5 pair `don` (“already/done”) and `kok` (“ongoing”). These can support a small aspect system without inventing new forms or pretending that the Phase 4 Formal temporal proposals are already Vernacular canon.


## 7. Follow-on design decision: Modern Vernacular v2.1

The Phase 5 generator defines `now`, `before` and `after` in its `SHARED` map by retrieving the Phase 4 forms from the formal lexicon. The merged v5 lexicon, however, labels `boni`, `vote` and `fuwo` as Formal / PROPOSED / Phase 4. The generator's mechanical checks establish that these strings existed in its input and were used in sample generation; they do not reconcile the register labels or independently validate their suitability for everyday Vernacular. The source discrepancy therefore remains documented rather than silently resolved.

Modern Vernacular v2.1 makes a separate, explicit design decision: `nemi` means NOW as a reference-time anchor; `pavo` orders two completed events with the first before the second; `sula` orders two completed events with the first after the second. An exact-form check against the indexed v5 CSV found no entries for these three forms. This is only a bounded collision check against that inspected file, not a claim of historical absence.

The v2.1 rules intentionally require `don` for both clauses in event ordering and require `don` or `kok` with `nemi`. That makes the new system narrower than the English words “before” and “after” in general use, but prevents an unmarked clause from acquiring an undocumented temporal interpretation. Event ordering does not entail causation; both events are asserted rather than conditionally supposed. The new specification includes 16 acceptance/rejection fixtures; they are design fixtures only and have not been executed by a parser or tested with independent speakers.

See [Modern Vernacular v2.1](../canon/arcane-modern-vernacular-v2.1-temporal-anchor-and-event-order.md) and the [decision ledger](../canon/modern-vernacular-v1.0-decision-ledger.md). No Formal Arcane or historical source entry was rewritten by this decision.


## 8. Follow-on design decision: Modern Vernacular v2.2

The v5 draft lexicon labels `wela` (“duration”) Formal / PROPOSED / Phase 4. As with the other Phase 4 temporal forms, its presence in Phase 5's shared mapping does not resolve the register/status mismatch. Modern Vernacular v2.2 therefore introduces two separate forms, `melo` (“briefly; short duration”) and `runi` (“for a long time; long duration”), after an exact-form check against the inspected v5 draft lexicon found no exact entries for either form. This check does not establish historical absence outside the inspected file.

The new grammar deliberately covers qualitative duration only for affirmative completed-event clauses. It does not assign numeric units, a universal threshold for “short” or “long”, or a duration-so-far reading for ongoing events. It blocks combinations with negation in this version to avoid unanalysed scope readings. The specification includes 16 design fixtures, not parser or independent-speaker results.

See [Modern Vernacular v2.2](../canon/arcane-modern-vernacular-v2.2-qualitative-duration.md) and the [decision ledger](../canon/modern-vernacular-v1.0-decision-ledger.md). No Formal Arcane or historical source entry was rewritten.


## 9. Follow-on design decision: Modern Vernacular v2.3

The inspected v5 draft lexicon labels `kole` (“until”) and `shasu` (“delay; offset before start”) Formal / PROPOSED / Phase 4. Their use in Phase 5's shared-word mapping does not reconcile those labels. Modern Vernacular v2.3 therefore introduces `seno` (“wait”) and `kavi` (“until”) as new modern forms after exact-form checks against the inspected v5 draft lexicon found no entries for either. This is a bounded collision check, not evidence of historical absence from all Arcane material.

The only licensed endpoint construction is an ongoing `seno` clause followed by `kavi` and a completed `zem` (“come”) clause. This deliberately narrow rule avoids implying that any arbitrary event can serve as an endpoint before its event structure and completion meaning have been specified. Aspect and qualitative-duration rules are explicitly extended to `seno` within their existing boundaries. The specification includes 18 design fixtures, not parser or independent-speaker results.

Delay is deliberately left unresolved: an offset-before-start needs a baseline/expected start and an offset representation. A word meaning merely “later” would not define these. See [Modern Vernacular v2.3](../canon/arcane-modern-vernacular-v2.3-waiting-and-until.md) and the [decision ledger](../canon/modern-vernacular-v1.0-decision-ledger.md).


## 10. Follow-on design decision: Modern Vernacular v2.4 numeric duration

The inspected v5 draft lexicon lists `za`–`pe` as digits and `se` (“second”) as a unit, each Shared / CANON / v3.0-L. It lists `wela` (“duration”) as Formal / PROPOSED / Phase 4. Modern Vernacular v2.4 licenses the existing digit and second-unit forms in one narrow numeric-duration slot; this does not infer a general numeral-composition rule or globally change the forms' register or stratum.

The new `nela` (“about/approximately”) form had no exact entry in the inspected v5 draft lexicon; this is a bounded collision check, not proof of historical absence from every source. The only supported quantity is one through nine whole seconds for affirmative completed-event clauses. Zero, multi-digit values, decimals, fractions, other units, ongoing-duration scope and numeric/qualitative stacking are explicitly blocked. Twenty design fixtures are documented but have not been parser-executed or independently speaker-tested. See [Modern Vernacular v2.4](../canon/arcane-modern-vernacular-v2.4-numeric-duration.md) and the [decision ledger](../canon/modern-vernacular-v1.0-decision-ledger.md).


## 11. Follow-on design decision: Modern Vernacular v2.5 compound numerals

The inspected v5 draft lexicon records `za`–`pe` as Shared / CANON / v3.0-L digits and `shi` as a Shared / CANON / v3.0-L decimal separator. It does not provide located examples or a located rule for place-value composition in the indexed lexicon material. Modern Vernacular v2.5 therefore defines base-ten positional digit sequences and decimal fractions only within the already bounded numeric-duration construction. This is an explicit modern grammar decision, not a historical reconstruction.

The rule permits one-to-four integer digits (first digit nonzero) and one-to-three fractional digits after `shi), with positive values only. `nela` approximates the complete quantity but does not define a tolerance or an upper/lower bound. The v2.4 single-digit-only and integer-only limits are superseded in this construction. Twenty-four fixtures are documented but have not been parser-executed or independently speaker-tested. See [Modern Vernacular v2.5](../canon/arcane-modern-vernacular-v2.5-compound-numerals.md) and the [decision ledger](../canon/modern-vernacular-v1.0-decision-ledger.md).


## 12. Follow-on design decision: Modern Vernacular v2.6 typed quantities

The inspected Mega Pack2 v5 draft lexicon records `ma` (metre), `se` (second), `ke` (kilogram), `ra` (radian), and `ku` (kelvin) as Shared / CANON / v3.0-L units. It also records `shi` as the decimal separator. Modern Vernacular v2.6 licenses a typed quantity phrase for those five units using the v2.5 numeric syntax. The dimensional typing and phrase grammar are modern design decisions; source entries do not by themselves prove that all measurement syntax or conversions were previously specified.

The new bounded system distinguishes LENGTH, TIME, MASS, PLANE ANGLE and THERMODYNAMIC TEMPERATURE. It explicitly blocks cross-dimensional substitution and undeclared compound units, and defines no conversions, arithmetic, rates, tolerance bounds or general measurement-clause syntax. Formal / PROPOSED math forms remain at their source status. Twenty-two design fixtures are documented but have not been parser-executed or independently speaker-tested. See [Modern Vernacular v2.6](../canon/arcane-modern-vernacular-v2.6-typed-measurement-quantities.md) and the [decision ledger](../canon/modern-vernacular-v1.0-decision-ledger.md).


## 13. Follow-on design decision: Modern Vernacular v2.7 quantity comparison

The indexed Mega Pack2 v5 lexicon contains `nadi` (equal), `dofa` (less than), `guwi` (greater than), and `vobi` (within tolerance), all labelled Formal / PROPOSED / Phase 4. These source labels and meanings are evidence for proposals in the Formal layer, not proof of a licensed Vernacular construction or known argument order.

Modern Vernacular v2.7 therefore introduces separate forms `nari`, `dori`, and `gari` for equality, less-than and greater-than in the bounded frame `RELATION + QUANTITY-A + QUANTITY-B`. The indexed Mega Pack2 text contained no exact entries for these forms; this is a bounded collision check only. Both operands must be exact positive v2.6 quantity phrases with the same unit token. Conversion, approximate comparison, tolerance bounds, chained comparisons and executable/control interpretations are excluded. Twenty fixtures distinguish ill-formed inputs from well-formed but false propositions. Parser execution and independent-speaker validation have not been claimed. See [v2.7 comparison specification](../canon/arcane-modern-vernacular-v2.7-quantity-comparison.md) and the [decision ledger](../canon/modern-vernacular-v1.0-decision-ledger.md).


## 14. New workstream: Arcane Incantations v1.0

The Mega Pack2 v5 draft lexicon records `kren` (establish), `trak` (alter), `frem` (maintain), `shren` (release), `bran` (couple), and `vare` (prefer) as Formal / CANON entries cited to Magic v3.0 §26. It records `po` (position role), `fo` (direction role), `lo` (movement role), and coupling-category forms `hə` (mana), `he` (matter), `ha` (energy), `hu` (living), `hi` (information), `ho` (field) as Formal / CANON v2.0. These are source vocabulary findings; a gloss alone does not establish complete argument order or execution semantics.

The new [Arcane Incantations v1.0 Foundation](../canon/arcane-incantations-v1.0-foundation.md) licenses bounded operation-selector schemata and explicitly labels the construction grammar as modern design. It distinguishes target, mechanism/coupling, spatial roles, constraints, resource sufficiency, feasibility and postcondition. It defines validation states but does not claim a working spell parser, simulator, physical model or execution system. The Phase 7 runtime evidence in the archive remains a provisional reconstructed programming subset, not validation of incantation semantics.
