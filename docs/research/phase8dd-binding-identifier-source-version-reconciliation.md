# Phase 8DD — Binding identifier source-version reconciliation

**Status:** Historical-source concordance; no canonical promotion.  
**Canon effect:** NONE · **Parser:** unchanged · **Execution:** disabled.  
**Tests:** 10 authored and registered; not executed locally.

## Primary historical source

The checked-in transcription of `Arcane_Language_Audit_Phase_4.docx` identifies its control status as **DECIDED BY DELEGATION, UNTESTED BY LISTENERS** (10 October 2026). Its §6 G-2 states: every numeral is closed by a unit; SHO closes dimensionless numerals; a binding identifier is a numeral closed by SHO. §7 Table 13 records D-019 with the same decision. This is a genuine historical delegated design decision, not merely an informal idea, but it was not listener-tested.

## Current v3.0-L comparison

Current `docs/canon/arcane-language-v3.0-L.md` §10 establishes KWAM (create), KWAT (reference an established binding) and KWAK (live evaluation). It gives `KWAM 1 E`, `KWAT 1` and `KWAK 1` as conceptual examples and explicitly leaves exact identifier representation for formalisation. Section 11 defines digits and units but does not repeat SHO closure.

Therefore Phase 4 D-019 is historical evidence compatible with a possible identifier convention, but it is not current v3.0-L confirmation. No examples are rewritten as `KWAM KI SHO E` or `KWAT KI SHO`.

## Other version boundaries

- Phase 4 §3.3 says a reference persists until replaced, citing v2.0 §29. Current v3.0-L does not establish binding lifetime or replacement semantics.
- Phase 4 §3.3 describes reference-plus-scope fusion in performed Construction. Current v3.0-L §20 says detailed v2.0 morphology and MEL anchoring are not recovered.
- These historical Construction statements must not be applied automatically to Formal KWAT identifier syntax.
- The Phase 4 control document was delegated and untested by listeners; its decisions must retain that provenance.

## Implementation

`bindingSourceReconciliation.ts` records five source claims and their version statuses. It has no parser hook, SHO validator, lifecycle transition, identifier encoder or code-generation function. Parser acceptance remains provisional.

## Owner decision still required

Confirm whether D-019 is intended to carry forward into v3.0-L and whether SHO-closed numerals are the exact binding identifier representation intended by §10. Until then, the current formalisation caveat remains in force.

Ten Vitest tests are authored and registered; they have not been executed locally.
