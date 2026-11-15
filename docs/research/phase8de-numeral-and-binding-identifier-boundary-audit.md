# Phase 8DE — Numeral and binding identifier boundary audit

**Status:** Cross-version evidence reconciliation. **Canon effect:** NONE. **Parser:** unchanged. **Execution:** disabled. **Tests:** 10 authored and registered; not executed locally.

## 1. Historical Phase 4 prose

Phase 4 audit §6 G-2 says every numeral is closed by a unit, SHO closes dimensionless numerals, and a binding identifier is a numeral closed by SHO. §7 Table 13 D-019 repeats this as a delegated decision. This is explicit historical prose.

## 2. Historical Phase 4 test notation

The same audit §10 Table 15 records P4-T11 and P4-T12 test strings using DL as the numeral-closing marker. P4-T14b and P4-T14c also show DL after the identifier digits. The table describes those as dimensionless-unit numerals and records the tests as passing in the source report.

The transcription does not define DL as a spoken lexical form, nor does it explicitly state that DL is an abbreviation for SHO. Therefore DL must remain a test-notation marker of unresolved status. It must not be silently rewritten as SHO.

The source report says 17 of 17 tests passed, but the checked-in transcription is an extraction of document body text and tables, not an independently rerun executable test suite. This audit records the reported result as documentary evidence only.

## 3. Current v3.0-L

Section 10 says KWAM creates a binding, KWAT references an established binding and KWAK performs live evaluation. Its examples KWAM 1 E, KWAT 1 and KWAK 1 are explicitly conceptual. The same section leaves exact identifier representation and evaluation semantics for formalisation.

Section 11 lists the current digit forms, SHI as decimal marker, FRASHA as negative marker, and MA/SE/KE/RA/KU as units. SHO is not included in that listed unit table. Thus the historical D-019 statement is not independently confirmed as current v3.0-L surface grammar.

## 4. Current parser behaviour

The Phase 6G provisional parser recognises SHO in its unit set and requires SHO to close a binding identifier. Its diagnostic text also says SHO closes dimensionless values. This is a concrete implementation convention. The parser identifies itself as provisional and does not establish canon, so this behaviour cannot resolve the documentary gap.

## 5. Safe conclusions

- Historical Phase 4 prose explicitly says SHO; historical P4-T11/T12 and P4-T14b/c test strings display DL.
- The source material inspected here does not prove DL = SHO.
- v3.0-L deliberately leaves exact binding identifier representation open.
- The current v3.0-L unit table does not list SHO.
- The Phase 6G parser SHO convention is provisional, not a canonical confirmation.
- KWAM/KWAT/KWAK meanings remain separate and established as stated in v3.0-L §10; their complete signatures and surface identifier form remain unresolved.

## 6. Required owner decision

Confirm whether DL in the Phase 4 test strings is a documentation placeholder, an earlier orthographic form, or an intended spoken token; confirm whether D-019 SHO closure is intended to carry into v3.0-L; and if so, add/confirm SHO in the current unit inventory and specify the exact identifier surface syntax. Until then, do not alter the parser or canon.

Ten tests check source-status distinctions and the non-promotion boundary. They are authored and registered, not executed locally.
