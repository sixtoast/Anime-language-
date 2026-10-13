# Mega-pack Searchable Text Index

- Generated (UTC): 2026-10-13T15:59:36.091111+00:00
- Source archive: `sources/originals/Arcana mega pack.zip`
- Unique readable text documents: 152
- Errors: 0

## Scope and safety

This index reads archive members without extracting them to disk or executing scripts. Exact byte-identical files are indexed once; the separate archive manifest retains duplicate names. DOCX text is extracted from the document XML. PDF text extraction is not included in this pass. This is a search aid, not a canon decision.

## Document index and excerpts

### Arcane_Phase_6S_Typed_Expression_Integration/Arcane_Alias_Registry_Phase_5_5.csv

- Type: CSV
- SHA-256: `fc6fc0f72abce9b9f24e83a5e27790bb5cff29cc7ffdb13702a6b6e3854bbab2`
- Extracted characters: 1157

```text
legacy_form,preferred_form,gloss,source_decision,compatibility_status,lexicon_status
frata,fraja,subtract,Phase 4 §5.1; D-032,preserve as alias; resolve to preferred form,not a separate row in v4/v5 CSV; preferred row only notes old form
fraka,frama,multiply,Phase 4 §5.1; D-032,preserve as alias; resolve to preferred form,not a separate row in v4/v5 CSV; preferred row only notes old form
drim,drum,cross product,Phase 4 §5.1; D-032; D-017,preserve as alias; resolve to preferred form,not a separate row in v4/v5 CSV; preferred row only notes old form
ren,ben,region,Phase 4 §5.1; D-032,preserve as alias; resolve to preferred form,not a separate row in v4/v5 CSV; preferred row only notes old form
grak,grash,NOT,Phase 4 §5.1; D-032,preserve as alias; resolve to preferred form,not a separate row in v4/v5 CSV; preferred row only notes old form
kwak,kwash,live evaluation,Phase 4 §5.1; D-032,preserve as alias; resolve to preferred form,not a separate row in v4/v5 CSV; preferred row only notes old form
dral,dras,compare,Phase 4 §5.1; D-032,preserve as alias; resolve to preferred form,not a separate row in v4/v5 CSV; preferred row only notes old form
```

### Arcane_Phase_6S_Typed_Expression_Integration/arcane_alias_validator.py

- Type: PY
- SHA-256: `ff585c2de57a4ba2c60374f59326fc83b8aff5ef401fd64f0972f2b8148fe5d0`
- Extracted characters: 4868

```text
#!/usr/bin/env python3
"""Self-contained Phase 5.6 Arcane alias and lexicon consistency validator.

Usage:
  python arcane_alias_validator.py Arcane_Lexicon_v4_draft.csv Arcane_Alias_Registry_Phase_5_5.csv
  python arcane_alias_validator.py Arcane_Lexicon_v5_draft.csv Arcane_Alias_Registry_Phase_5_5.csv

This validates registry-to-lexicon consistency. It does NOT implement an Arcane parser,
prove that a compiler accepts aliases, or establish listener intelligibility.
"""
import csv
import sys
from collections import defaultdict
from pathlib import Path

EXPECTED = {
    "frata": ("fraja", "subtract"),
    "fraka": ("frama", "multiply"),
    "drim": ("drum", "cross product"),
    "ren": ("ben", "region"),
    "grak": ("grash", "not"),
    "kwak": ("kwash", "live evaluation"),
    "dral": ("dras", "compare"),
}

class Check:
    def __init__(self): self.results=[]
    def add(self, name, ok, detail): self.results.append((name, bool(ok), detail))
    def report(self):
        for name, ok, detail in self.results:
            print(f"{'PASS' if ok else 'FAIL'} | {name} | {detail}")
        passed=sum(ok for _,ok,_ in self.results)
        print(f"SUMMARY | {passed}/{len(self.results)} checks passed")
        return 0 if passed==len(self.results) else 1

def load_csv(path):
    with open(path, newline='', encoding='utf-8-sig') as f:
        return list(csv.DictReader(f))

def main():
    if len(sys.argv) != 3:
        print(__doc__.strip(), file=sys.stderr); return 2
    lex_path, alias_path = map(Path, sys.argv[1:])
    lex = load_csv(lex_path)
    alias_rows = load_csv(alias_path)
    forms = defaultdict(list)
    for row in lex:
        form=(row.get('form') or '').strip().lower()
        if form: forms[form].append(row)
    registry={}
    for row in alias_rows:
```

_Excerpt truncated at 1,800 characters; full length 4868 characters._

### Arcane_Phase_6S_Typed_Expression_Integration/arcane_audit_parser.py

- Type: PY
- SHA-256: `c5f43a92053a018bb59930c744c85a09bc754711bec446a77750f4a739fb5165`
- Extracted characters: 5233

```text
#!/usr/bin/env python3
"""Arcane Phase 6 audit parser.

Parses the provisional Phase 2 audit notation OP⟨arg1, arg2, ...⟩.
This is NOT a parser for spoken Arcane or the full canonical formal language.
It validates grouping, argument boundaries, selected fixed arities, and malformed input.
"""
from dataclasses import dataclass
import re

TOKEN = re.compile(r"\s*(?:(?P<ident>[A-Za-z_][A-Za-z0-9_-]*)|(?P<langle>⟨)|(?P<rangle>⟩)|(?P<comma>,)|(?P<other>[^\s]))")

@dataclass(frozen=True)
class Atom:
    value: str

@dataclass(frozen=True)
class Call:
    operator: str
    args: tuple

class ParseError(ValueError):
    pass

class Parser:
    def __init__(self, source):
        self.tokens = []
        for m in TOKEN.finditer(source):
            kind = next(k for k, v in m.groupdict().items() if v is not None)
            self.tokens.append((kind, m.group(kind)))
        self.i = 0
        # Detect characters the tokenizer cannot consume rather than silently skipping them.
        consumed = ''.join(m.group(0) for m in TOKEN.finditer(source))
        if consumed.replace(' ', '') != source.replace(' ', ''):
            raise ParseError('Unrecognised character or token')

    def peek(self, kind=None):
        if self.i >= len(self.tokens): return False if kind else None
        return self.tokens[self.i][0] == kind if kind else self.tokens[self.i]

    def take(self, kind):
        if not self.peek(kind):
            got = self.peek()
            raise ParseError(f'Expected {kind}, got {got}')
        tok = self.tokens[self.i]
        self.i += 1
        return tok[1]

    def expression(self):
        if not self.peek('ident'):
            raise ParseError(f'Expected identifier, got {self.peek()}')
        name = self.take('ident')
        if not self.peek('langle'):
```

_Excerpt truncated at 1,800 characters; full length 5233 characters._

### Arcane_Phase_6S_Typed_Expression_Integration/Arcane_Continuity_Recovery_Audit 2.docx

- Type: DOCX TEXT
- SHA-256: `ed6674aa8f1922ecc6a0fab51af154e7fad801bc5db1218a411bd25d81c339f2`
- Extracted characters: 5162

```text
ARCANE — CONTINUITY & RECOVERY AUDIT
Working control document | 9 October 2026
RECOVERY DRAFT — compiled from canonical specifications and project context available in this conversation. This is not a complete archive of every historical chat.
Recovered language canon
Arcane is a human-designed control language for constructing mana states; words do not directly command reality.
Language ≠ spell ≠ mana. Translation chain: intent → physical specification → neural representation → Arcane encoding → mana configuration → mechanism → effect.
Design principle: low morphology + high compositional precision. Surface syntax: HEAD + ARGUMENTS + MODIFIERS.
Typed expressions and fixed-arity operators are intended to prevent incompatible composition and precedence ambiguity. Executable expressions require a unique parse; ambiguity must fail rather than guess.
References: MI self, NI field, RI target, SU current, WO world, FE frame.
Axes: PA −X, BA +X, TA −Y, DA +Y, KA −Z, GA +Z; +X right, +Y above, +Z forward. Relations: JO toward, JUR away, JA along, JE parallel, JI aligned/coincident.
Geometry: PI point, LEN line, PLA plane, SUR surface, VOM volume, PAR path, REN region, NET network.
Quantities: PALA position, VANU velocity, MORU mass, KERA acceleration, FETA force, ENRA energy, TEVA temperature, PURA pressure, POMA momentum.
Information: NES read, SIMA measure, GAMA assign, DAVE infer. Maths: FRAPA add, FRATA subtract, FRAKA multiply, FRALA divide, FRASHA negate, DRAN magnitude, DREM dot product, DRIM cross product, DRAL compare.
Logic: GRAN AND, GRAT OR, GRAK NOT, BEK IF, ZET WHILE. Bindings: KWAM create binding, KWAT reference binding, KWAK live evaluation.
Digits: ZA 0, KI 1, TO 2, MU 3, RE 4, SA 5, FI 6, DU 7, GO 8, PE 9; SHI decimal; FRASHA negative. Units: MA metre, SE seco
```

_Excerpt truncated at 1,800 characters; full length 5162 characters._

### Arcane_Phase_6S_Typed_Expression_Integration/Arcane_Continuity_Recovery_Audit 3.txt

- Type: TXT
- SHA-256: `e61740410775e95db0471b28b552cf83fabc8d161a90dd80622a78076d42f8a3`
- Extracted characters: 5163

```text
ARCANE — CONTINUITY & RECOVERY AUDIT
Working control document | 9 October 2026
RECOVERY DRAFT — compiled from canonical specifications and project context available in this conversation. This is not a complete archive of every historical chat.
Recovered language canon
Arcane is a human-designed control language for constructing mana states; words do not directly command reality.
Language ≠ spell ≠ mana. Translation chain: intent → physical specification → neural representation → Arcane encoding → mana configuration → mechanism → effect.
Design principle: low morphology + high compositional precision. Surface syntax: HEAD + ARGUMENTS + MODIFIERS.
Typed expressions and fixed-arity operators are intended to prevent incompatible composition and precedence ambiguity. Executable expressions require a unique parse; ambiguity must fail rather than guess.
References: MI self, NI field, RI target, SU current, WO world, FE frame.
Axes: PA −X, BA +X, TA −Y, DA +Y, KA −Z, GA +Z; +X right, +Y above, +Z forward. Relations: JO toward, JUR away, JA along, JE parallel, JI aligned/coincident.
Geometry: PI point, LEN line, PLA plane, SUR surface, VOM volume, PAR path, REN region, NET network.
Quantities: PALA position, VANU velocity, MORU mass, KERA acceleration, FETA force, ENRA energy, TEVA temperature, PURA pressure, POMA momentum.
Information: NES read, SIMA measure, GAMA assign, DAVE infer. Maths: FRAPA add, FRATA subtract, FRAKA multiply, FRALA divide, FRASHA negate, DRAN magnitude, DREM dot product, DRIM cross product, DRAL compare.
Logic: GRAN AND, GRAT OR, GRAK NOT, BEK IF, ZET WHILE. Bindings: KWAM create binding, KWAT reference binding, KWAK live evaluation.
Digits: ZA 0, KI 1, TO 2, MU 3, RE 4, SA 5, FI 6, DU 7, GO 8, PE 9; SHI decimal; FRASHA negative. Units: MA metre, SE seco
```

_Excerpt truncated at 1,800 characters; full length 5163 characters._

### Arcane_Phase_6S_Typed_Expression_Integration/Arcane_Decision_Ledger 2.txt

- Type: TXT
- SHA-256: `e1f4bb693f3a253e824204c6ce310bc3ff618bbb60db816d9dd30dcefab4a703`
- Extracted characters: 1498

```text
ARCANE — DECISION LEDGER
Continuity register | proposals are not canon unless accepted
RECOVERY DRAFT — compiled from canonical specifications and project context available in this conversation. This is not a complete archive of every historical chat.
Current decisions
D-001 CANON: Arcane is a human-designed control language.
D-002 CANON: language ≠ spell ≠ mana.
D-003 CANON: surface syntax HEAD + ARGUMENTS + MODIFIERS; scope details incomplete.
D-004 CANON: spell representation HEAD + CORE + PARAMETERS + CONSTRAINTS + CONTROL; mapping to surface syntax required.
D-005 CANON: executable expressions must have one recoverable parse.
D-006 UNRESOLVED: recover exact v2.0 frame–vowel–coda morphology before integrating or retiring it.
D-007 UNRECOVERED: exact definitions and examples for h coupling, MEL anchoring, KAN/KEN/KAS.
D-008 PROPOSAL: define operator-specific signatures and test against existing examples.
D-009 PROPOSAL: formalise grouping and modifier scope.
D-010 CROSS-SPEC GAP: reconcile KREN/TRAK/FREM/SHREN/BRAN/VARE with v3.0-L vocabulary.
D-011 CANON: CREATE is not a physical primitive; KWAM creates a binding only.
D-012 GAP: specify Logos substrate, memory, energy and interface costs.
D-013 UNVERIFIED: vocabulary completion percentages need measurable coverage criteria.
Change record template
Decision ID:
Existing rule and source:
Concrete defect or gap:
Options considered:
Tests and results:
Decision: ACCEPT / REJECT / PROVISIONAL / UNRESOLVED
Date and rationale:
```

### Arcane_Phase_6S_Typed_Expression_Integration/Arcane_Decision_Ledger.docx

- Type: DOCX TEXT
- SHA-256: `6405755b51cdcf44a4c99e8dbc9f433f5925bcb6a6d6a489422065cd20419def`
- Extracted characters: 1497

```text
ARCANE — DECISION LEDGER
Continuity register | proposals are not canon unless accepted
RECOVERY DRAFT — compiled from canonical specifications and project context available in this conversation. This is not a complete archive of every historical chat.
Current decisions
D-001 CANON: Arcane is a human-designed control language.
D-002 CANON: language ≠ spell ≠ mana.
D-003 CANON: surface syntax HEAD + ARGUMENTS + MODIFIERS; scope details incomplete.
D-004 CANON: spell representation HEAD + CORE + PARAMETERS + CONSTRAINTS + CONTROL; mapping to surface syntax required.
D-005 CANON: executable expressions must have one recoverable parse.
D-006 UNRESOLVED: recover exact v2.0 frame–vowel–coda morphology before integrating or retiring it.
D-007 UNRECOVERED: exact definitions and examples for h coupling, MEL anchoring, KAN/KEN/KAS.
D-008 PROPOSAL: define operator-specific signatures and test against existing examples.
D-009 PROPOSAL: formalise grouping and modifier scope.
D-010 CROSS-SPEC GAP: reconcile KREN/TRAK/FREM/SHREN/BRAN/VARE with v3.0-L vocabulary.
D-011 CANON: CREATE is not a physical primitive; KWAM creates a binding only.
D-012 GAP: specify Logos substrate, memory, energy and interface costs.
D-013 UNVERIFIED: vocabulary completion percentages need measurable coverage criteria.
Change record template
Decision ID:
Existing rule and source:
Concrete defect or gap:
Options considered:
Tests and results:
Decision: ACCEPT / REJECT / PROVISIONAL / UNRESOLVED
Date and rationale:
```

### Arcane_Phase_6S_Typed_Expression_Integration/arcane_dimensions.py

- Type: PY
- SHA-256: `38cf5cbeaa742dd722d44421edb4e762baa53a5ded5e478822b7a984259e2e28`
- Extracted characters: 3401

```text
"""Arcane Phase 6R provisional dimensional quantity layer.

This module is an experimental semantic extension, not canonical Arcane grammar.
Base dimensions are abstract symbols; no real-world unit conversion is implied.
"""
from __future__ import annotations
from dataclasses import dataclass
from decimal import Decimal
from typing import Mapping

class DimensionError(Exception):
    """Raised for invalid dimensional operations or quantity construction."""

@dataclass(frozen=True)
class Dimension:
    """Canonical sparse dimension vector: symbol -> integer exponent."""
    powers: tuple[tuple[str, int], ...] = ()

    @classmethod
    def of(cls, powers: Mapping[str, int] | None = None) -> 'Dimension':
        clean = {}
        for symbol, exponent in (powers or {}).items():
            if not isinstance(symbol, str) or not symbol.strip():
                raise DimensionError('dimension symbols must be non-empty strings')
            if not isinstance(exponent, int) or isinstance(exponent, bool):
                raise DimensionError('dimension exponents must be integers')
            if exponent:
                clean[symbol] = clean.get(symbol, 0) + exponent
        return cls(tuple(sorted((s, e) for s, e in clean.items() if e)))

    def combine(self, other: 'Dimension', sign: int = 1) -> 'Dimension':
        powers = dict(self.powers)
        for symbol, exponent in other.powers:
            powers[symbol] = powers.get(symbol, 0) + sign * exponent
        return Dimension.of(powers)

    def __str__(self) -> str:
        return 'dimensionless' if not self.powers else ' '.join(
            f'{symbol}^{exp}' for symbol, exp in self.powers)

DIMENSIONLESS = Dimension()

@dataclass(frozen=True)
class Quantity:
    value: Decimal
    dimension: Dimension = DIMENSIONLESS
```

_Excerpt truncated at 1,800 characters; full length 3401 characters._

### Arcane_Phase_6S_Typed_Expression_Integration/Arcane_Grammar_Consistency_Test_Register 2.txt

- Type: TXT
- SHA-256: `a97fa6260310e03a94f319a7f43fa56b18d8498556eef38a8f791bfd4c48fa6c`
- Extracted characters: 2237

```text
ARCANE — GRAMMAR & CONSISTENCY TEST REGISTER
Initial validation plan | defined tests are not claimed passes
RECOVERY DRAFT — compiled from canonical specifications and project context available in this conversation. This is not a complete archive of every historical chat.
Grammar and consistency tests
T-001 Operator arity: apply FRAPA to two quantities; reject missing or extra arguments unless defined by its signature.
T-002 Operand order: FRATA(A,B) and FRATA(B,A) must preserve different operand order.
T-003 Nested grouping: A − (B + C) and (A − B) + C must produce different parse trees.
T-004 Ambiguity: a sequence with two plausible attachments must be rejected or explicitly disambiguated.
T-005 Modifier scope: distinguish a duration constraint on a whole compound from one on a child expression.
T-006 Type mismatch: reject a time interval where mass or a sensor is expected unless a conversion is defined.
T-007 Measurement completeness: SIMA RI VANU must account for target, pathway/sensor, interaction, resolution and available information.
T-008 Binding semantics: KWAM, KWAT and KWAK must distinguish binding creation, reference and live evaluation.
T-009 Temporal completeness: define forms and signatures for AFTER, UNTIL, DELAY, DURATION, RATE, DEADLINE and INTERVAL.
T-010 Control flow: define repetition, event triggers, termination, invariants, constraints, evaluation timing and failure behaviour.
T-011 Near-collision robustness: test FRAPA/FRATA/FRAKA, GRAN/GRAT/GRAK and DREM/DRIM in rapid speech and noise.
T-012 Macro transparency: expand a macro and verify the expansion passes type and feasibility checks.
T-013 Physical mechanism: a desired effect without a mechanism is incomplete; adding a mechanism still requires feasibility checks.
T-014 Conservation: reject mat
```

_Excerpt truncated at 1,800 characters; full length 2237 characters._

### Arcane_Phase_6S_Typed_Expression_Integration/Arcane_Grammar_Consistency_Test_Register.docx

- Type: DOCX TEXT
- SHA-256: `09663eff3896c10f424abf27f8300df015f709b7ec4797b52d789d25fc524dae`
- Extracted characters: 2236

```text
ARCANE — GRAMMAR & CONSISTENCY TEST REGISTER
Initial validation plan | defined tests are not claimed passes
RECOVERY DRAFT — compiled from canonical specifications and project context available in this conversation. This is not a complete archive of every historical chat.
Grammar and consistency tests
T-001 Operator arity: apply FRAPA to two quantities; reject missing or extra arguments unless defined by its signature.
T-002 Operand order: FRATA(A,B) and FRATA(B,A) must preserve different operand order.
T-003 Nested grouping: A − (B + C) and (A − B) + C must produce different parse trees.
T-004 Ambiguity: a sequence with two plausible attachments must be rejected or explicitly disambiguated.
T-005 Modifier scope: distinguish a duration constraint on a whole compound from one on a child expression.
T-006 Type mismatch: reject a time interval where mass or a sensor is expected unless a conversion is defined.
T-007 Measurement completeness: SIMA RI VANU must account for target, pathway/sensor, interaction, resolution and available information.
T-008 Binding semantics: KWAM, KWAT and KWAK must distinguish binding creation, reference and live evaluation.
T-009 Temporal completeness: define forms and signatures for AFTER, UNTIL, DELAY, DURATION, RATE, DEADLINE and INTERVAL.
T-010 Control flow: define repetition, event triggers, termination, invariants, constraints, evaluation timing and failure behaviour.
T-011 Near-collision robustness: test FRAPA/FRATA/FRAKA, GRAN/GRAT/GRAK and DREM/DRIM in rapid speech and noise.
T-012 Macro transparency: expand a macro and verify the expansion passes type and feasibility checks.
T-013 Physical mechanism: a desired effect without a mechanism is incomplete; adding a mechanism still requires feasibility checks.
T-014 Conservation: reject mat
```

_Excerpt truncated at 1,800 characters; full length 2236 characters._

### Arcane_Phase_6S_Typed_Expression_Integration/Arcane_Language_Audit_Phase_1.docx

- Type: DOCX TEXT
- SHA-256: `ac4aa1f61e882264dd8dea1f3eb6390576d544839763ea3f2215b861181af7dc`
- Extracted characters: 5704

```text
ARCANE LANGUAGE AUDIT — PHASE 1
Architecture, grammar layers, and canon-preserving reconciliation
Status: AUDIT FINDINGS / PROPOSED ORGANISATION. This document does not silently amend canon. Any new formal rule remains a proposal until tested and accepted.
1. Executive finding
The two grammar formulas do not necessarily conflict. Arcane v3.0-L describes the surface linguistic structure as HEAD + ARGUMENTS + MODIFIERS. The Magic System v3.0 describes a spell's operational specification as HEAD + CORE + PARAMETERS + CONSTRAINTS + CONTROL. These can be reconciled as different representational layers: one is how an expression is structured in the language; the other is how the parsed meaning is organised as a spell specification.
2. Proposed layered architecture
Layer 1 — Phonology and orthography
How Arcane forms are pronounced, segmented, stressed and written. Existing phoneme inventory, syllable template and penultimate-stress rule belong here.
Layer 2 — Morphology
How word forms are built, if they are built from smaller meaningful parts. v3.0-L favours low morphology; the exact relationship to v2.0 frame–vowel–coda morphology remains unresolved.
Layer 3 — Surface syntax
The order in which words and phrases are spoken or written: HEAD + ARGUMENTS + MODIFIERS.
Layer 4 — Parse structure
The unambiguous tree recovered from the expression, including operator nesting, argument boundaries and modifier attachment. This is required by the Unique Parse Requirement but is not fully specified yet.
Layer 5 — Typed semantics
The meaning and type of each expression, including fixed arity, quantity types, references, control operators and information operators.
Layer 6 — Spell specification
The typed meaning is organised into the operational spell representation: HEAD + CORE + PARAMETE
```

_Excerpt truncated at 1,800 characters; full length 5704 characters._

### Arcane_Phase_6S_Typed_Expression_Integration/Arcane_Language_Audit_Phase_2 4.docx

- Type: DOCX TEXT
- SHA-256: `bc11ab45f50fbab14ea40435d92bfc052806c90fca99dc6ed956ede1d8cc4bc1`
- Extracted characters: 6296

```text
ARCANE LANGUAGE AUDIT — PHASE 2
Formal syntax, operator signatures, and unique-parse validation
Status: PROVISIONAL FORMALISATION. This document adds a proposed notation for testing; it does not overwrite canon or claim that the notation is already the spoken form of Arcane.
1. Scope
Phase 2 defines a temporary written metalanguage for expressing Arcane structure unambiguously. It uses the existing lexical roots and labels typed arguments explicitly where needed. The notation is a diagnostic scaffold, not new Arcane vocabulary.
2. Proposed expression representation
Provisional abstract form: OPERATOR⟨argument₁, argument₂, …⟩
Example using existing roots: FRAPA⟨KI, TO⟩
Reading for testing only: add the values represented by KI (1) and TO (2). The angle brackets and commas are audit notation, not established Arcane words.
Nested example: FRAPA⟨KI, FRAPA⟨TO, MU⟩⟩
This representation explicitly marks argument boundaries, preserves nesting, and does not rely on ordinary mathematical precedence.
3. Core signature register
Operator
Provisional input signature
Output
Arity
Confidence
FRAPA — add
Quantity × Quantity
Quantity
2
Provisional; quantity/unit compatibility needs rules
FRATA — subtract
Quantity × Quantity
Quantity
2
Provisional; operand order matters
FRAKA — multiply
Quantity × Quantity
Quantity
2
Provisional; dimensional algebra needed
FRALA — divide
Quantity × Quantity
Quantity or ratio
2
Provisional; zero denominator policy missing
FRASHA — negate
Numeric value
Numeric value
1
Provisional
DRAN — magnitude
Vector or magnitude-bearing value
Scalar magnitude
1
Provisional; supported input types need listing
DREM — dot product
Vector × Vector
Scalar
2
Provisional
DRIM — cross product
3D vector × 3D vector
3D vector
2
Provisional
DRAL — compare
Comparable value × Compara
```

_Excerpt truncated at 1,800 characters; full length 6296 characters._

### Arcane_Phase_6S_Typed_Expression_Integration/Arcane_Language_Audit_Phase_4 2.docx

- Type: DOCX TEXT
- SHA-256: `c8204667c204227ba474fd0b5245fd66f1ba081565671f5a28cf65efb513eaea`
- Extracted characters: 21121

```text
ARCANE LANGUAGE AUDIT — PHASE 4
Whole-language audit and consolidated fixes
Working control document | 10 October 2026
Status: DECIDED BY DELEGATION, UNTESTED BY LISTENERS. The project owner asked for the whole language to be inspected and for inconsistencies and holes to be fixed, and left design choices to the auditor. Every change below is a ledger entry (§11). Mechanical checks were run (§10). No spoken or listener test has been done, and the distance measure used for collisions is a heuristic over articulatory features, not an acoustic test.
1. Verdict
The architecture holds, but the specifications disagreed with each other in ways that would have broken the language in use. Three layers had drifted apart: v2.0 (productive morphology), v3.0-L (a typed prefix lexicon) and the Phase 1 to 3 audit findings. This phase reconciles them into one two-subsystem language and closes the open items from Phase 3.
Two subsystems, one language. A Construction system (v2.0 Feet, couplings, scoped references) says what the mana does. An Expression system (v3.0-L typed prefix operators) computes values, selects targets and controls timing. A compile bridge maps one to the other (§3).
Three phonology defects. /z/ is used (ZA, ZET) but absent from the inventory; PLA breaks the onset-cluster list; v2.0 axis letters (d, g) are bare consonants that cannot be syllables. Fixed without changing any of those words (§4).
Seven sibling collisions renamed. Opposites such as add/subtract/multiply, and/or/not and bind/reference/live differed by one place of articulation. Seven forms changed; the old forms are kept as aliases (§5).
35 missing roots added. Time, sets, iteration, requirements, exponent, relations, control states, blocks, and two units. All are legal and clear of the existing heads (
```

_Excerpt truncated at 1,800 characters; full length 21121 characters._

### Arcane_Phase_6S_Typed_Expression_Integration/Arcane_Language_Audit_Phase_4 4.txt

- Type: TXT
- SHA-256: `247ccc59f074309d6bed69213acff68ddd4fc09ced80565f7176a10d2515e450`
- Extracted characters: 22019

```text
ARCANE LANGUAGE AUDIT — PHASE 4
Whole-language audit and consolidated fixes
Working control document | 10 October 2026
Status: DECIDED BY DELEGATION, UNTESTED BY LISTENERS. The project owner asked for the whole language to be inspected and for inconsistencies and holes to be fixed, and left design choices to the auditor. Every change below is a ledger entry (§11). Mechanical checks were run (§10). No spoken or listener test has been done, and the distance measure used for collisions is a heuristic over articulatory features, not an acoustic test.
1. Verdict
The architecture holds, but the specifications disagreed with each other in ways that would have broken the language in use. Three layers had drifted apart: v2.0 (productive morphology), v3.0-L (a typed prefix lexicon) and the Phase 1 to 3 audit findings. This phase reconciles them into one two-subsystem language and closes the open items from Phase 3.
Two subsystems, one language. A Construction system (v2.0 Feet, couplings, scoped references) says what the mana does. An Expression system (v3.0-L typed prefix operators) computes values, selects targets and controls timing. A compile bridge maps one to the other (§3).
Three phonology defects. /z/ is used (ZA, ZET) but absent from the inventory; PLA breaks the onset-cluster list; v2.0 axis letters (d, g) are bare consonants that cannot be syllables. Fixed without changing any of those words (§4).
Seven sibling collisions renamed. Opposites such as add/subtract/multiply, and/or/not and bind/reference/live differed by one place of articulation. Seven forms changed; the old forms are kept as aliases (§5).
35 missing roots added. Time, sets, iteration, requirements, exponent, relations, control states, blocks, and two units. All are legal and clear of the existing heads (
```

_Excerpt truncated at 1,800 characters; full length 22019 characters._

### Arcane_Phase_6S_Typed_Expression_Integration/Arcane_Language_Audit_Phase_4.txt

- Type: TXT
- SHA-256: `e82d13dbbf1fa3e48b3f50282490bb4436877d1a3c039a451b413dd26c3ba652`
- Extracted characters: 21846

```text
ARCANE LANGUAGE AUDIT — PHASE 4
Whole-language audit and consolidated fixes
Working control document | 10 October 2026
Status: DECIDED BY DELEGATION, UNTESTED BY LISTENERS. The project owner asked for the whole language to be inspected and for inconsistencies and holes to be fixed, and left design choices to the auditor. Every change below is a ledger entry (§11). Mechanical checks were run (§10). No spoken or listener test has been done, and the distance measure used for collisions is a heuristic over articulatory features, not an acoustic test.
1. Verdict
The architecture holds, but the specifications disagreed with each other in ways that would have broken the language in use. Three layers had drifted apart: v2.0 (productive morphology), v3.0-L (a typed prefix lexicon) and the Phase 1 to 3 audit findings. This phase reconciles them into one two-subsystem language and closes the open items from Phase 3.
Two subsystems, one language. A Construction system (v2.0 Feet, couplings, scoped references) says what the mana does. An Expression system (v3.0-L typed prefix operators) computes values, selects targets and controls timing. A compile bridge maps one to the other (§3).
Three phonology defects. /z/ is used (ZA, ZET) but absent from the inventory; PLA breaks the onset-cluster list; v2.0 axis letters (d, g) are bare consonants that cannot be syllables. Fixed without changing any of those words (§4).
Seven sibling collisions renamed. Opposites such as add/subtract/multiply, and/or/not and bind/reference/live differed by one place of articulation. Seven forms changed; the old forms are kept as aliases (§5).
35 missing roots added. Time, sets, iteration, requirements, exponent, relations, control states, blocks, and two units. All are legal and clear of the existing heads (
```

_Excerpt truncated at 1,800 characters; full length 21846 characters._

### Arcane_Phase_6S_Typed_Expression_Integration/Arcane_Language_Audit_Phase_5 6.docx

- Type: DOCX TEXT
- SHA-256: `e6b265164ef8e39b6b43499ff12562dfb9896ca475cbbe34926860a7378b2233`
- Extracted characters: 11546

```text
ARCANE LANGUAGE AUDIT — PHASE 5
The vernacular register
Working control document | 10 October 2026
Status: DECIDED BY DELEGATION, UNTESTED BY LISTENERS. This phase fills the largest hole left by Phase 4: the premise promises an everyday register (jokes, arguments, flirting, gossip, apologies, idioms) and none existed. The vocabulary below is generated by a seeded search, so the sounds are arbitrary by design. Checks are mechanical (§8). The collision measure is a feature-based heuristic and not a listener test.
1. Design in one paragraph
Vernacular Arcane is the same language family as Formal and Performed Arcana, not a separate language. It shares the phonology, the numerals, the references, the spatial words, the logic words and the time words. It adds its own open-class vocabulary (115 roots), a looser predicate-first syntax, and sentence-final particles for mood and politeness. Everyday speakers also borrow technical words as idioms, because the world’s culture grew up around magic as a physical craft.
2. Register map
Register
Who and when
Lexicon and syntax
Sound
Vernacular
Everyone, daily life: jokes, arguments, flirting, gossip, apologies.
115 native roots plus shared closed classes. Predicate-first, particles, no tense inflection.
Casual reduction allowed (§4).
Technical
Researchers, engineers, teachers explaining.
Formal lexicon with an explicit subject after the head and vernacular connectives. Named bindings.
Careful, unreduced.
Formal
Institutions, professions, ceremony.
Strict typed prefix expressions (Phases 2 to 4). Respectful particle allowed.
Maximum segmentation.
Performed
Casting only.
Compiled Feet, couplings and fused references (Phase 4).
Compressed, rhythmic.
Same idea, two registers. Formal: SIMA RI VANU (measure target velocity). Technical: sima
```

_Excerpt truncated at 1,800 characters; full length 11546 characters._

### Arcane_Phase_6S_Typed_Expression_Integration/Arcane_Language_Audit_Phase_5.txt

- Type: TXT
- SHA-256: `7c5de7d39a6625ad81120ed19067c816293d884cb96ddc961ab87699f0d28097`
- Extracted characters: 12324

```text
ARCANE LANGUAGE AUDIT — PHASE 5
The vernacular register
Working control document | 10 October 2026
Status: DECIDED BY DELEGATION, UNTESTED BY LISTENERS. This phase fills the largest hole left by Phase 4: the premise promises an everyday register (jokes, arguments, flirting, gossip, apologies, idioms) and none existed. The vocabulary below is generated by a seeded search, so the sounds are arbitrary by design. Checks are mechanical (§8). The collision measure is a feature-based heuristic and not a listener test.
1. Design in one paragraph
Vernacular Arcane is the same language family as Formal and Performed Arcana, not a separate language. It shares the phonology, the numerals, the references, the spatial words, the logic words and the time words. It adds its own open-class vocabulary (115 roots), a looser predicate-first syntax, and sentence-final particles for mood and politeness. Everyday speakers also borrow technical words as idioms, because the world’s culture grew up around magic as a physical craft.
2. Register map

Same idea, two registers. Formal: SIMA RI VANU (measure target velocity). Technical: sima mi ri vanu (I measure the target’s velocity). Vernacular has no everyday verb that means “measure by instrument”, so speakers use sima itself as a borrowed word.
Rule G-V1: vernacular words never occur inside a construction clause (the Feet region of Performed Arcana). A character who speaks vernacular and then casts changes register at the clause boundary.
3. Vernacular grammar
G-V2 Order. [time or aspect] [predicate] [subject] [object] [adjuncts] [final particle]. Adjectives are predicates: tired I = “I am tired”. A bare noun phrase can be a predicate with no copula.
G-V3 Modifiers follow heads. Noun then adjective (fire small); possessor after possessed (frien
```

_Excerpt truncated at 1,800 characters; full length 12324 characters._

### Arcane_Phase_6S_Typed_Expression_Integration/arcane_lexicon_tools.py

- Type: PY
- SHA-256: `75f508ee8c34a324d69236e144ea4d30f412e78ab0044c34b418a5a2261909bf`
- Extracted characters: 3145

```text
"""Compatibility reconstruction of Arcane Phase 4 lexicon tools.

Reconstructed from the archived PDF printout and Phase 4 documentation. This is
not the missing original module; differences should be reviewed before canon use.
"""
STOPS, NASALS, FRICS, LIQS, GLIDES = set('pbtdkg'), set('mnŋ'), set('fvzshʃ'), set('lr'), set('wj')
CONSONANTS = STOPS | NASALS | FRICS | LIQS | GLIDES
VOWELS = set('aeiouə')
CODAS = set('mnŋptksʃlr')
NO_ONSET = {'ŋ'}
ONSET_CLUSTERS = set('pr br tr dr kr gr kw gw tw fr fl ʃr pl bl kl gl'.split())
FRAMES = set('ptkbdgfsʃhmnŋlrwj')
PLACE = {**{c:'lab' for c in 'pbmfvw'}, **{c:'alv' for c in 'tdnszlr'}, **{c:'pal' for c in 'ʃj'}, **{c:'vel' for c in 'kgŋ'}, 'h':'glo'}
MANNER = {**{c:'stop' for c in STOPS}, **{c:'nasal' for c in NASALS}, **{c:'fric' for c in FRICS}, **{c:'liq' for c in LIQS}, **{c:'glide' for c in GLIDES}}
VOICELESS = set('ptkfsʃh')
HEIGHT = {'i':2,'u':2,'e':1,'o':1,'ə':1,'a':0}
BACK = {'i':0,'e':0,'ə':1,'a':1,'o':2,'u':2}

def ph(word):
    return list(word.lower().replace('sh','ʃ').replace('ng','ŋ'))

def syllabify(word):
    p=ph(word); errs=[]; nuclei=[i for i,c in enumerate(p) if c in VOWELS]
    if not nuclei: return [], ['no vowel']
    for c in p:
        if c not in CONSONANTS and c not in VOWELS: errs.append(f'unknown phoneme {c!r}')
    sylls=[]; prev_end=0
    for k,n in enumerate(nuclei):
        seg=p[prev_end:n]
        if k==0: onset,coda_prev=seg,[]
        else:
            if n-nuclei[k-1]==1: errs.append('adjacent vowels not allowed in lexicon')
            onset=[]; coda_prev=[]
            for cut in range(len(seg)+1):
                cand=seg[cut:]
                if not cand or (len(cand)==1 and cand[0] not in NO_ONSET) or ''.join(cand) in ONSET_CLUSTERS:
                    onset,coda_prev=cand,seg[:cut];
```

_Excerpt truncated at 1,800 characters; full length 3145 characters._

### Arcane_Phase_6S_Typed_Expression_Integration/arcane_lexicon_tools_pdf_extracted.txt

- Type: TXT
- SHA-256: `c50feabe54656b44aae535bd7bdebabc4a85f877e36a0379f4567ed8f923d699`
- Extracted characters: 15661

```text
#!/usr/bin/env python3
"""
ARCANE LANGUAGE AUDIT - PHASE 4 lexicon tools.


Mechanical checks only: phonotactic legality, a feature-based near-collision
heuristic, a minimal-rename search and a new-root generator. The distance
metric is a heuristic over articulatory features. It is NOT an acoustic or
listener test. Final acceptance still needs speaker/listener tests.
"""
import csv, json, random, sys


# ------------------------------------------------------------------ phonology
STOPS, NASALS, FRICS, LIQS, GLIDES = "pbtdkg", ["m", "n", "ŋ"], ["f", "v", "s", "z", "ʃ", "h"
CONSONANTS = set(STOPS) | set(NASALS) | set(FRICS) | set(LIQS) | set(GLIDES)      # 19 with /z/
VOWELS = set("aeiouə")
CODAS = set("mnŋptksʃlr")                         # z, h, w, j, b, d, g, f, v not in coda
NO_ONSET = {"ŋ"}                                      # ŋ is coda-only
ONSET_CLUSTERS = {"pr", "br", "tr", "dr", "kr", "gr", "kw", "gw", "tw", "fr", "fl", "ʃr", "pl
FRAMES = set("ptkbdgfsʃhmnŋlrwj")                # z and v are lexical-only, not frames


PLACE = {**{c: "lab" for c in "pbmfvw"}, **{c: "alv" for c in "tdnszlr"},
           **{c: "pal" for c in "ʃj"}, **{c: "vel" for c in "kgŋ"}, "h": "glo"}
MANNER = {**{c: "stop" for c in STOPS}, **{c: "nasal" for c in NASALS},
            **{c: "fric" for c in FRICS}, **{c: "liq" for c in LIQS}, **{c: "glide" for c in GL
VOICELESS = set("ptkfsʃh")
HEIGHT = {"i": 2, "u": 2, "e": 1, "o": 1, "ə": 1, "a": 0}
BACK = {"i": 0, "e": 0, "ə": 1, "a": 1, "o": 2, "u": 2}


def ph(word):
      w = word.lower().replace("sh", "ʃ").replace("ng", "ŋ")
      return list(w)


def syllabify(word):
      """Return (syllables, errors). Maximal-onset syllabification against the legal template."
      p, errs = ph(word), []
      nuclei = [i for i, c in enumerate(p) if c
```

_Excerpt truncated at 1,800 characters; full length 15661 characters._

### Arcane_Phase_6S_Typed_Expression_Integration/Arcane_Lexicon_v4_draft 9.csv

- Type: CSV
- SHA-256: `18fb2bf7d1faf853d3317c8860f4c1db05d677e0a8b1bc4b356bf6795f7d0921`
- Extracted characters: 6371

```text
form,gloss,cls,status,source,note
za,0,DIGIT,CANON,v3.0-L,
ki,1,DIGIT,CANON,v3.0-L,
to,2,DIGIT,CANON,v3.0-L,
mu,3,DIGIT,CANON,v3.0-L,
re,4,DIGIT,CANON,v3.0-L,
sa,5,DIGIT,CANON,v3.0-L,
fi,6,DIGIT,CANON,v3.0-L,
du,7,DIGIT,CANON,v3.0-L,
go,8,DIGIT,CANON,v3.0-L,
pe,9,DIGIT,CANON,v3.0-L,
shi,decimal separator,DECIMAL,CANON,v3.0-L,
ma,metre,UNIT,CANON,v3.0-L,
se,second,UNIT,CANON,v3.0-L,
ke,kilogram,UNIT,CANON,v3.0-L,
ra,radian,UNIT,CANON,v3.0-L,
ku,kelvin,UNIT,CANON,v3.0-L,
pa,-X,AXIS,CANON,v3.0-L,
ba,+X,AXIS,CANON,v3.0-L,
ta,-Y,AXIS,CANON,v3.0-L,
da,+Y,AXIS,CANON,v3.0-L,
ka,-Z,AXIS,CANON,v3.0-L,
ga,+Z,AXIS,CANON,v3.0-L,
MI (formal),SELF (unscoped; default scope = volume),REF,"CANON (v3.0-L), reinterpreted",v3.0-L,performs as mə
NI (formal),FIELD (unscoped; default scope = volume),REF,"CANON (v3.0-L), reinterpreted",v3.0-L,performs as nə
RI (formal),TARGET (unscoped; default scope = volume),REF,"CANON (v3.0-L), reinterpreted",v3.0-L,performs as rə
su,CURRENT,REF,CANON,v3.0-L,
wo,WORLD,REF,CANON,v3.0-L,
fe,FRAME,REF,CANON,v3.0-L,
jo,toward,SPREL,CANON,v3.0-L,
jur,away,SPREL,CANON,v3.0-L,
ja,along,SPREL,CANON,v3.0-L,
je,parallel,SPREL,CANON,v3.0-L,
ji,aligned/coincident,SPREL,CANON,v3.0-L,
pi,point,GEOM,CANON,v3.0-L,
len,line,GEOM,CANON,v3.0-L,
pla,plane,GEOM,CANON,v3.0-L,
sur,surface,GEOM,CANON,v3.0-L,
vom,volume,GEOM,CANON,v3.0-L,
par,path,GEOM,CANON,v3.0-L,
ben,region,GEOM,RENAMED,v3.0-L,was ren
net,network,GEOM,CANON,v3.0-L,
pala,position,PROP,CANON,v3.0-L,
vanu,velocity,PROP,CANON,v3.0-L,
moru,mass,PROP,CANON,v3.0-L,
kera,acceleration,PROP,CANON,v3.0-L,
feta,force,PROP,CANON,v3.0-L,
enra,energy,PROP,CANON,v3.0-L,
teva,temperature,PROP,CANON,v3.0-L,
pura,pressure,PROP,CANON,v3.0-L,
poma,momentum,PROP,CANON,v3.0-L,
nes,read,INFO,CANON,v3.0-L,
sima,measure,INFO,CANON,v3.0-L,
```

_Excerpt truncated at 1,800 characters; full length 6371 characters._

### Arcane_Phase_6S_Typed_Expression_Integration/Arcane_Lexicon_v5_draft 13.csv

- Type: CSV
- SHA-256: `4b38aec651a32b332d4f28068d34618c4dfb2f043d44a2f03c146dba2e31ad8a`
- Extracted characters: 12352

```text
form,gloss,cls,register,status,source,note
za,0,DIGIT,Shared,CANON,v3.0-L,
ki,1,DIGIT,Shared,CANON,v3.0-L,
to,2,DIGIT,Shared,CANON,v3.0-L,
mu,3,DIGIT,Shared,CANON,v3.0-L,
re,4,DIGIT,Shared,CANON,v3.0-L,
sa,5,DIGIT,Shared,CANON,v3.0-L,
fi,6,DIGIT,Shared,CANON,v3.0-L,
du,7,DIGIT,Shared,CANON,v3.0-L,
go,8,DIGIT,Shared,CANON,v3.0-L,
pe,9,DIGIT,Shared,CANON,v3.0-L,
shi,decimal separator,DECIMAL,Shared,CANON,v3.0-L,
ma,metre,UNIT,Shared,CANON,v3.0-L,
se,second,UNIT,Shared,CANON,v3.0-L,
ke,kilogram,UNIT,Shared,CANON,v3.0-L,
ra,radian,UNIT,Shared,CANON,v3.0-L,
ku,kelvin,UNIT,Shared,CANON,v3.0-L,
pa,-X,AXIS,Shared,CANON,v3.0-L,
ba,+X,AXIS,Shared,CANON,v3.0-L,
ta,-Y,AXIS,Shared,CANON,v3.0-L,
da,+Y,AXIS,Shared,CANON,v3.0-L,
ka,-Z,AXIS,Shared,CANON,v3.0-L,
ga,+Z,AXIS,Shared,CANON,v3.0-L,
MI (formal),SELF (unscoped; default scope = volume),REF,Shared,"CANON (v3.0-L), reinterpreted",v3.0-L,performs as mə
NI (formal),FIELD (unscoped; default scope = volume),REF,Shared,"CANON (v3.0-L), reinterpreted",v3.0-L,performs as nə
RI (formal),TARGET (unscoped; default scope = volume),REF,Shared,"CANON (v3.0-L), reinterpreted",v3.0-L,performs as rə
su,CURRENT,REF,Shared,CANON,v3.0-L,
wo,WORLD,REF,Shared,CANON,v3.0-L,
fe,FRAME,REF,Shared,CANON,v3.0-L,
jo,toward,SPREL,Formal,CANON,v3.0-L,
jur,away,SPREL,Formal,CANON,v3.0-L,
ja,along,SPREL,Formal,CANON,v3.0-L,
je,parallel,SPREL,Formal,CANON,v3.0-L,
ji,aligned/coincident,SPREL,Formal,CANON,v3.0-L,
pi,point,GEOM,Formal,CANON,v3.0-L,
len,line,GEOM,Formal,CANON,v3.0-L,
pla,plane,GEOM,Formal,CANON,v3.0-L,
sur,surface,GEOM,Formal,CANON,v3.0-L,
vom,volume,GEOM,Formal,CANON,v3.0-L,
par,path,GEOM,Formal,CANON,v3.0-L,
ben,region,GEOM,Formal,RENAMED,v3.0-L,was ren
net,network,GEOM,Formal,CANON,v3.0-L,
pala,position,PROP,Formal,CANON,v3.0-L,
vanu,velocity,PROP
```

_Excerpt truncated at 1,800 characters; full length 12352 characters._

### Arcane_Phase_6S_Typed_Expression_Integration/Arcane_Operator_Contract_Reconciliation 2.csv

- Type: CSV
- SHA-256: `b1a26ce8e8706a17869cb031e8b170272dedc240a5523a9d297cc3a8ea39e108`
- Extracted characters: 2273

```text
preferred_form,legacy_alias,gloss,phase2_signature_baseline,arity,phase2_status,phase4_decision_or_note,compatibility_rule,unresolved_items
frapa,,add,Quantity x Quantity -> Quantity,2,provisional; unit compatibility incomplete,unchanged in Phase 4 rename list,preferred form remains FRAPA; operands must be typed quantities with compatible dimensions/semantic kinds,full quantity-kind rules; unit conversion; point-vs-displacement arithmetic
fraja,frata,subtract,Quantity x Quantity -> Quantity,2,provisional; order matters,preferred Phase 4 form replaces FRATA,resolve FRATA to FRAJA before semantic checking,negative-value rules; absolute-vs-difference temperature; point subtraction semantics
frama,fraka,multiply,Quantity x Quantity -> Quantity,2,provisional; dimensional algebra required,preferred Phase 4 form replaces FRAKA,resolve FRAKA to FRAMA before semantic checking,compound-unit representation; semantic-kind multiplication constraints
drum,drim,cross product,Vector x Vector -> Vector,2,provisional; 3D/frame constraints,preferred Phase 4 form; D-017 physical right-hand rule with caster-frame component negation,resolve DRIM to DRUM; apply D-017 frame rule,formal frame type; transformation semantics; independently reproduce P4-T16
dras,dral,compare,Comparable x Comparable x Criterion -> Boolean,3,provisional; criterion encoding unresolved,preferred Phase 4 form replaces DRAL,resolve DRAL to DRAS before type/arity checking,criterion encoding; equality/order policy; compatibility with logic operators
grash,grak,NOT,Boolean -> Boolean,1,provisional proposed signature,preferred Phase 4 form replaces GRAK,resolve GRAK to GRASH before type checking,Boolean evaluation semantics; malformed expression behavior
kwash,kwak,live evaluation,Live expression/reference -> current evalua
```

_Excerpt truncated at 1,800 characters; full length 2273 characters._

### Arcane_Phase_6S_Typed_Expression_Integration/arcane_phase510_numerals_frames.py

- Type: PY
- SHA-256: `e624cff443e4c70a06e8ac218b71a05b849cc1f1ab9ff536a30b5fc10e363d49`
- Extracted characters: 5012

```text
from fractions import Fraction
DIGITS={'za':'0','ki':'1','to':'2','mu':'3','re':'4','sa':'5','fi':'6','du':'7','go':'8','pe':'9'}
UNITS={'ma':'length','se':'time','ke':'mass','ra':'angle','ku':'temperature','sho':'dimensionless'}
def parse_quantity(tokens):
    """Parse one audit-token numeral closed by a canonical unit; no new lexemes."""
    if not tokens: raise ValueError('empty quantity')
    unit=tokens[-1].lower()
    if unit not in UNITS: raise ValueError('quantity is not closed by a canonical unit')
    body=[x.lower() for x in tokens[:-1]]
    if not body: raise ValueError('quantity has no digits')
    if body.count('shi')>1: raise ValueError('multiple decimal markers')
    if any(x not in DIGITS and x!='shi' for x in body): raise ValueError('non-digit inside numeral')
    if body[0]=='shi' or body[-1]=='shi': raise ValueError('decimal marker requires digits on both sides')
    if 'shi' in body:
        i=body.index('shi'); left=''.join(DIGITS[x] for x in body[:i]); right=''.join(DIGITS[x] for x in body[i+1:])
        value=Fraction(int(left+right),10**len(right))
    else: value=Fraction(int(''.join(DIGITS[x] for x in body)),1)
    return value,UNITS[unit]

def parse_identifier_and_value(tokens):
    # Audit-token contract: identifier is a SHO-closed numeral, immediately followed by a value numeral closed by its own unit.
    for i,t in enumerate(tokens):
        if t.lower()=='sho':
            ident,kind=parse_quantity(tokens[:i+1])
            if kind!='dimensionless': raise ValueError('identifier terminator must be SHO')
            val,unit=parse_quantity(tokens[i+1:])
            return int(ident),val,unit
    raise ValueError('missing SHO-closed identifier')

def matvec(m,v): return tuple(sum(m[i][j]*v[j] for j in range(3)) for i in range(3))
def transp
```

_Excerpt truncated at 1,800 characters; full length 5012 characters._

### Arcane_Phase_6S_Typed_Expression_Integration/arcane_phase511_typed_parser 2.py

- Type: PY
- SHA-256: `675a633aebbce1e2f9a53d1d8494428f3dd7beb2d75c7c9618921e3dfce47e0a`
- Extracted characters: 5759

```text
"""Phase 5.11 audit parser: typed abstract expressions, not a surface Arcane compiler."""
from dataclasses import dataclass
from fractions import Fraction

@dataclass(frozen=True)
class Type:
    kind: str
    dims: tuple = ()  # length,time,mass,temperature,angle exponents
    frame: str|None = None

@dataclass(frozen=True)
class Value:
    value: Fraction
    type: Type

SCALAR=Type('scalar')
BOOL=Type('boolean')
DIMLESS=Type('quantity',(0,0,0,0,0))
LENGTH=Type('quantity',(1,0,0,0,0))
TIME=Type('quantity',(0,1,0,0,0))
MASS=Type('quantity',(0,0,1,0,0))
TEMP=Type('quantity',(0,0,0,1,0))
ANGLE=Type('quantity',(0,0,0,0,1))

def add(a,b):
    if a.type.kind!='quantity' or b.type.kind!='quantity': raise TypeError('FRAPA requires quantities')
    if a.type.dims!=b.type.dims: raise TypeError('FRAPA dimension mismatch')
    if a.type.frame!=b.type.frame: raise TypeError('FRAPA frame mismatch')
    return Value(a.value+b.value,a.type)
def sub(a,b):
    if a.type.kind!='quantity' or b.type.kind!='quantity': raise TypeError('FRAJA/FRATA requires quantities')
    if a.type.dims!=b.type.dims: raise TypeError('subtract dimension mismatch')
    if a.type.frame!=b.type.frame: raise TypeError('subtract frame mismatch')
    return Value(a.value-b.value,a.type)
def mul(a,b):
    if a.type.kind!='quantity' or b.type.kind!='quantity': raise TypeError('FRAMA/FRAKA requires quantities')
    if a.type.frame is not None or b.type.frame is not None: raise TypeError('frame-bearing quantities require explicit vector/scalar rules')
    dims=tuple(x+y for x,y in zip(a.type.dims,b.type.dims))
    return Value(a.value*b.value,Type('quantity',dims))
def div(a,b):
    if a.type.kind!='quantity' or b.type.kind!='quantity': raise TypeError('FRALA requires quantities')
    if b.value==0: raise ZeroDivisio
```

_Excerpt truncated at 1,800 characters; full length 5759 characters._

### Arcane_Phase_6S_Typed_Expression_Integration/arcane_phase513_ast_validator 2.py

- Type: PY
- SHA-256: `e3bc708e14a57e18f0b1ad24c7dcdcba6786129c84e9a43482de70601f5d9fb8`
- Extracted characters: 5721

```text
"""Arcane Phase 5.13 minimal audit parser/validator.
Audit-only notation; not canonical spoken syntax or a production compiler.
Supported literals: Q<number,dimension>, B<true|false>, V<dimension,frame>, ID<number>, and nested OP<arg,...>.
"""
from dataclasses import dataclass
from fractions import Fraction
import re, json, sys
from pathlib import Path

REGISTRY_PATH = Path(__file__).with_name('Arcane_Phase_5_12_Operator_Registry.json')
REGISTRY = json.loads(REGISTRY_PATH.read_text())
OPS = {x['form']: x for x in REGISTRY['operators']}
ALIASES = {alias: r['form'] for r in REGISTRY['operators'] for alias in r['aliases'].split(';') if alias}

@dataclass
class Node:
    kind: str
    value: object = None
    args: tuple = ()
    typ: str = ''
    dim: str = ''
    frame: str = ''

class ParseError(ValueError): pass
class TypeErrorArcane(ValueError): pass

# A tiny recursive parser for audit notation.
TOKEN = re.compile(r'\s*(Q|B|V|ID|[a-zə]+|[0-9]+(?:\.[0-9]+)?|[<>,])', re.I)
def tokenize(s):
    out=[]; pos=0
    while pos < len(s):
        m=TOKEN.match(s,pos)
        if not m:
            if s[pos:].strip()=='' : break
            raise ParseError(f'Unexpected text at offset {pos}: {s[pos:pos+16]!r}')
        out.append(m.group(1)); pos=m.end()
    return out

class Parser:
    def __init__(self,s): self.t=tokenize(s); self.i=0
    def peek(self): return self.t[self.i] if self.i<len(self.t) else None
    def pop(self):
        x=self.peek()
        if x is None: raise ParseError('Unexpected end of expression')
        self.i+=1; return x
    def expect(self,x):
        got=self.pop()
        if got.lower()!=x.lower(): raise ParseError(f'Expected {x}, got {got}')
    def parse(self):
        n=self.expr()
        if self.peek() is not None: raise ParseError(f'Trailing to
```

_Excerpt truncated at 1,800 characters; full length 5721 characters._

### Arcane_Phase_6S_Typed_Expression_Integration/arcane_phase514_gate.py

- Type: PY
- SHA-256: `c0c7ed25f4e4f269ed09de6a7c6349e4446eec1340c84cc73fcfd091b0dcf3e4`
- Extracted characters: 2172

```text
"""Phase 5.14 policy gate: audit statuses only; not a compiler."""
import csv, json
from pathlib import Path

BASE = Path(__file__).resolve().parent
REGISTRY = json.loads((BASE / 'Arcane_Phase_5_12_Operator_Registry.json').read_text())
OPS = {r['form']: r for r in REGISTRY['operators']}

# Evidence-gate tests: these assert that unresolved contracts remain explicitly gated.
def run():
    tests = []
    def check(name, fn):
        try:
            assert fn()
            tests.append((name, True, 'PASS'))
        except Exception as e:
            tests.append((name, False, f'FAIL: {e}'))
    check('DRAS exists and remains provisional', lambda: 'dras' in OPS and ('PROVISIONAL' in OPS['dras']['status'] or 'OPEN' in OPS['dras']['status']))
    check('SIMA exists and remains open', lambda: 'sima' in OPS and 'OPEN' in OPS['sima']['status'])
    check('KWASH exists and remains open', lambda: 'kwash' in OPS and 'OPEN' in OPS['kwash']['status'])
    check('BEK remains open', lambda: 'bek' in OPS and 'OPEN' in OPS['bek']['status'])
    check('ZET remains open', lambda: 'zet' in OPS and 'OPEN' in OPS['zet']['status'])
    check('KREN construction contract remains open', lambda: 'kren' in OPS and 'OPEN' in OPS['kren']['status'])
    check('LABU is not canon', lambda: 'labu' in OPS and 'NOT CANON' in OPS['labu']['status'])
    expected = {'fraja':'frata','frama':'fraka','drum':'drim','grash':'grak','kwash':'kwak','dras':'dral'}
    check('renamed canonical forms retained', lambda: all(OPS[k]['aliases'].split(';').count(v)==1 for k,v in expected.items()))
    check('canonical forms unique', lambda: len(OPS)==len(REGISTRY['operators']))
    check('all aliases avoid another canonical form', lambda: all(a not in OPS for r in REGISTRY['operators'] for a in r['aliases'].split(';') if a)
```

_Excerpt truncated at 1,800 characters; full length 2172 characters._

### Arcane_Phase_6S_Typed_Expression_Integration/arcane_phase515_construction_gate.py

- Type: PY
- SHA-256: `0d81162f356a3514e1c65de82841a56071f39d30c6a6791b716ba5cd3b192a85`
- Extracted characters: 2016

```text
"""Phase 5.15 evidence gate. This validates source/status boundaries, not Arcane semantics."""
from pathlib import Path
import csv
P=Path(__file__).resolve().parent/'Arcane_Phase_5_15_Construction_Contract_Matrix.csv'
rows=list(csv.DictReader(P.open()))
def run():
 t=[]
 def c(n,fn):
  try: assert fn(); t.append((n,True,'PASS'))
  except Exception as e: t.append((n,False,'FAIL: '+str(e)))
 by={r['item']:r for r in rows}
 c('matrix has unique item keys',lambda:len(by)==len(rows))
 c('construction-expression split recorded',lambda:'Construction' in by['Construction/Expression split']['contract'] and 'Expression' in by['Construction/Expression split']['contract'])
 c('construction order preserved',lambda:'reference → spatial role/vector → Feet → couplings → quantity → control → release' in by['Construction order']['contract'])
 c('Foot shape does not claim full semantics',lambda:'TOKEN CHECK ONLY' in by['Foot shape']['executable'])
 c('parameter vowel mapping remains provisional',lambda:by['Parameter vowels']['status']=='PROVISIONAL')
 c('coupling mapping remains provisional',lambda:'PROVISIONAL' in by['Coupling syllables']['status'])
 c('KREN not promoted',lambda:by['KREN macro']['status']=='PROPOSED' and by['KREN macro']['executable']=='NO')
 c('worked example not executable',lambda:by['Worked hand-flame sequence']['executable']=='NO' and 'unspecified' in by['Worked hand-flame sequence']['gap'])
 c('compiler bridge not demonstrated',lambda:by['Expression-to-construction bridge']['executable']=='NO')
 c('missing v2.0 source gap explicit',lambda:by['Original v2.0 full morphology']['status']=='SOURCE GAP')
 c('all rows have evidence and gap',lambda:all(r['evidence'].strip() and r['gap'].strip() for r in rows))
 c('no row silently marks execution YES',lambda:all(r['executabl
```

_Excerpt truncated at 1,800 characters; full length 2016 characters._

### Arcane_Phase_6S_Typed_Expression_Integration/arcane_phase57_tests.py

- Type: PY
- SHA-256: `b28f1c5c85aa7c3b92601eb8d37ae59deb0bc4b0f0bd4214b9cbd6e3d0ef23d7`
- Extracted characters: 2062

```text
#!/usr/bin/env python3
"""Regression tests for the Arcane Phase 5.7 reference validator."""
import importlib.util
from pathlib import Path

p=Path(__file__).with_name('arcane_reference_validator.py')
spec=importlib.util.spec_from_file_location('arcane_reference_validator', p)
mod=importlib.util.module_from_spec(spec); spec.loader.exec_module(mod)

TESTS=[
 ('legacy subtraction alias resolves', 'FRATA⟨Q:length, Q:length⟩', True, 'Quantity'),
 ('preferred subtraction form accepted', 'FRAJA⟨Q:length, Q:length⟩', True, 'Quantity'),
 ('legacy multiplication alias resolves', 'FRAKA⟨Q:length, Q:time⟩', True, 'Quantity'),
 ('legacy cross-product alias resolves', 'DRIM⟨V:3d, V:3d⟩', True, 'Vector3'),
 ('legacy NOT alias resolves', 'GRAK⟨Boolean⟩', True, 'Boolean'),
 ('legacy compare alias resolves', 'DRAL⟨Comparable, Comparable, Criterion⟩', True, 'Boolean'),
 ('missing FRAPA argument rejected', 'FRAPA⟨Q:length⟩', False, 'expects 2 argument'),
 ('extra FRAPA argument rejected', 'FRAPA⟨Q:length, Q:length, Q:length⟩', False, 'expects 2 argument'),
 ('wrong FRAPA type rejected', 'FRAPA⟨Boolean, Q:length⟩', False, 'expects Quantity'),
 ('wrong GRASH type rejected', 'GRASH⟨Q:length⟩', False, 'expects Boolean'),
 ('wrong DRUM vector dimension rejected', 'DRUM⟨V:2d, V:2d⟩', False, 'expects Vector3'),
 ('nested expression accepted', 'GRASH⟨DRAL⟨Comparable, Comparable, Criterion⟩⟩', True, 'Boolean'),
 ('malformed expression rejected', 'FRAPA⟨Q:length, Q:length', False, 'malformed operator expression'),
 ('unknown operator not guessed', 'BEN⟨Q:length⟩', False, 'no validated signature'),
 ('region token not falsely treated as operator', 'BEN', False, 'unknown typed atom'),
]
passed=0
for name, expr, expected_ok, expected_text in TESTS:
    ok, detail=mod.validate(expr)
    result=ok==expec
```

_Excerpt truncated at 1,800 characters; full length 2062 characters._

### Arcane_Phase_6S_Typed_Expression_Integration/arcane_phase58_tests.py

- Type: PY
- SHA-256: `afdee1d1f78e22e0c2c2778fe3e5505338c3f9c68cdceb2bb9a559f2ee9d60e4`
- Extracted characters: 2270

```text
#!/usr/bin/env python3
import importlib.util
from pathlib import Path
p=Path(__file__).with_name('arcane_phase58_types.py'); spec=importlib.util.spec_from_file_location('t',p); t=importlib.util.module_from_spec(spec); spec.loader.exec_module(t)
cases=[
('length addition','FRAPA⟨Q[length],Q[length]⟩',True,'Q[length]'),
('length plus time rejected','FRAPA⟨Q[length],Q[time]⟩',False,'matching dimensions'),
('legacy subtraction alias','FRATA⟨Q[time],Q[time]⟩',True,'Q[time]'),
('length times length gives area','FRAKA⟨Q[length],Q[length]⟩',True,'Q[area]'),
('length divided by time gives velocity','FRALA⟨Q[length],Q[time]⟩',True,'Q[velocity]'),
('magnitude preserves vector dimension','DRAN⟨V3[length;world]⟩',True,'Q[length]'),
('dot product adds dimensions','DREM⟨V3[length;world],V3[velocity;world]⟩',True,'Q[L^2 T^-1]'),
('dot product frame mismatch rejected','DREM⟨V3[length;world],V3[length;caster]⟩',False,'common frame'),
('cross product output dimension','DRIM⟨V3[length;world],V3[length;world]⟩',True,'V3[area;world]'),
('cross product frame mismatch rejected','DRUM⟨V3[length;world],V3[length;caster]⟩',False,'common frame'),
('wrong cross product type rejected','DRUM⟨Q[length],Q[length]⟩',False,'requires 3D vectors'),
('nested typed expression','FRAPA⟨DRAN⟨V3[length;world]⟩,Q[length]⟩',True,'Q[length]'),
('comparison returns Boolean','DRAL⟨Q[length],Q[length],Criterion⟩',True,'Bool'),
('comparison mismatched dimensions rejected','DRAS⟨Q[length],Q[time],Criterion⟩',False,'compatible types'),
('unknown operator fails closed','BEN⟨Q[length]⟩',False,'no Phase 5.8 signature'),
('unbalanced syntax rejected','FRAPA⟨Q[length],Q[length]',False,'malformed expression'),
]
passed=0
with open(Path(__file__).with_name('Arcane_Phase_5_8_Test_Results.txt'),'w') as f:
 for name,expr,ok,needle
```

_Excerpt truncated at 1,800 characters; full length 2270 characters._

### Arcane_Phase_6S_Typed_Expression_Integration/arcane_phase58_types.py

- Type: PY
- SHA-256: `ce664e1dd56aa3252a989cfd6ac332cd963149a6012e7070c98e5a406214ae77`
- Extracted characters: 4704

```text
#!/usr/bin/env python3
"""Arcane Phase 5.8 provisional dimensional/frame type checker.
Not a complete parser/compiler and does not execute magic.
Audit atoms: Q[length], Q[time], Q[mass], Q[velocity], Q[energy], Q[dimensionless]
Vectors: V3[length;caster], V3[velocity;world], etc. Expressions use OP⟨...,...⟩.
"""
import re, sys
from dataclasses import dataclass

ALIASES={'frata':'fraja','fraka':'frama','drim':'drum','dral':'dras','grak':'grash','kwak':'kwash','ren':'ben'}
# Dimension vectors: (length, time, mass, temperature). Energy = M L^2 T^-2.
DIMS={'dimensionless':(0,0,0,0),'length':(1,0,0,0),'area':(2,0,0,0),'volume':(3,0,0,0),'time':(0,1,0,0),'mass':(0,0,1,0),'velocity':(1,-1,0,0),'acceleration':(1,-2,0,0),'force':(1,-2,1,0),'energy':(2,-2,1,0),'temperature':(0,0,0,1),'pressure':(-1,-2,1,0),'momentum':(1,-1,1,0)}
@dataclass(frozen=True)
class Ty:
 kind:str; dim:tuple|None=None; frame:str|None=None
 def __str__(self):
  if self.kind=='Q': return 'Q['+next((k for k,v in DIMS.items() if v==self.dim),dim_label(self.dim))+']'
  if self.kind=='V3': return 'V3['+next((k for k,v in DIMS.items() if v==self.dim),dim_label(self.dim))+';'+str(self.frame)+']'
  return self.kind
def dim_label(d):
 parts=[]
 for name,power in zip(('L','T','M','Theta'),d):
  if power: parts.append(name if power==1 else f'{name}^{power}')
 return ' '.join(parts) if parts else 'dimensionless'
BOOL=Ty('Bool'); COMP=Ty('Comparable'); CRIT=Ty('Criterion')
def atom(s):
 s=s.strip()
 m=re.fullmatch(r'Q\[([a-z]+)\]',s,re.I)
 if m and m.group(1).lower() in DIMS: return Ty('Q',DIMS[m.group(1).lower()])
 m=re.fullmatch(r'V3\[([a-z]+);(world|caster|local)\]',s,re.I)
 if m and m.group(1).lower() in DIMS: return Ty('V3',DIMS[m.group(1).lower()],m.group(2).lower())
 if s.lower() in ('bool','boolean'): return B
```

_Excerpt truncated at 1,800 characters; full length 4704 characters._

### Arcane_Phase_6S_Typed_Expression_Integration/arcane_phase59_semantic_frames.py

- Type: PY
- SHA-256: `2ebca4e0cd1b31dd09c4d9ef83d691ed16371c60935150d26943c411955cc045`
- Extracted characters: 5824

```text
#!/usr/bin/env python3
"""Arcane Phase 5.9 audit harness: semantic kinds, units, and explicit frame transforms.
Audit tool only; not a complete Arcane parser/compiler and does not execute magic.
"""
from dataclasses import dataclass
from fractions import Fraction

# Dimensions: (length, time, mass, temperature)
D = {'1':(0,0,0,0),'length':(1,0,0,0),'area':(2,0,0,0),'volume':(3,0,0,0),'time':(0,1,0,0),'mass':(0,0,1,0),'velocity':(1,-1,0,0),'acceleration':(1,-2,0,0),'force':(1,-2,1,0),'energy':(2,-2,1,0),'temperature':(0,0,0,1),'pressure':(-1,-2,1,0),'momentum':(1,-1,1,0)}
@dataclass(frozen=True)
class Quantity:
    kind: str
    dim: tuple
    frame: str|None = None
    unit: str|None = None

# SI conversion factors to base units. Radian is dimensionless but semantically tagged.
UNITS = {'MA':('length',Fraction(1)),'SE':('time',Fraction(1)),'KE':('mass',Fraction(1)),
         'KU':('temperature',Fraction(1)),'RA':('dimensionless',Fraction(1)),
         'CM':('length',Fraction(1,100)),'MM':('length',Fraction(1,1000)),
         'KM':('length',Fraction(1000)),'MS':('time',Fraction(1,1000)),
         'MIN':('time',Fraction(60)),'H':('time',Fraction(3600)),'G':('mass',Fraction(1,1000))}
# A deliberately explicit orthogonal basis mapping for frames. Entries are world-axis vectors.
# The legacy D-017 caster frame is treated as left-handed for cross-product components.
FRAMES = {'world': {'handedness':1, 'basis': {'X':(1,0,0),'Y':(0,1,0),'Z':(0,0,1)}},
          'caster':{'handedness':-1,'basis': {'X':(1,0,0),'Y':(0,1,0),'Z':(0,0,-1)}},
          'local': {'handedness':1,'basis': {'X':(1,0,0),'Y':(0,1,0),'Z':(0,0,1)}}}

def add(a:Quantity,b:Quantity,op='add'):
    if a.dim != b.dim: raise ValueError('dimension mismatch')
    if a.kind == 'position' and b.kind == 'position':
```

_Excerpt truncated at 1,800 characters; full length 5824 characters._

### Arcane_Phase_6S_Typed_Expression_Integration/arcane_phase6b.py

- Type: PY
- SHA-256: `664aaef575595aaa2a0c3d4202bd4272004b9cb68b54198bcc9e8e2e25e33c58`
- Extracted characters: 6002

```text
#!/usr/bin/env python3
"""Arcane Phase 6B: provisional typed checker for Phase 2 audit notation."""
from dataclasses import dataclass
import re
TOKEN=re.compile(r"\s*(?:(?P<ident>[A-Za-z_][A-Za-z0-9_-]*)|(?P<langle>⟨)|(?P<rangle>⟩)|(?P<comma>,))")
class ParseError(ValueError): pass
class TypeCheckError(ValueError): pass
@dataclass(frozen=True)
class Atom: value:str
@dataclass(frozen=True)
class Call: operator:str; args:tuple
class Parser:
 def __init__(self,s):
  self.tokens=[]; p=0
  while p<len(s):
   if s[p:].isspace(): break
   m=TOKEN.match(s,p)
   if not m: raise ParseError(f'Unexpected character at {p}: {s[p]!r}')
   k=next(k for k,v in m.groupdict().items() if v is not None); self.tokens.append((k,m.group(k))); p=m.end()
  if p<len(s) and not s[p:].isspace(): raise ParseError(f'Unexpected text at {p}')
  self.i=0
 def peek(self,k=None): return (False if k else None) if self.i>=len(self.tokens) else (self.tokens[self.i][0]==k if k else self.tokens[self.i])
 def take(self,k):
  if not self.peek(k): raise ParseError(f'Expected {k}; found {self.peek()}')
  v=self.tokens[self.i][1]; self.i+=1; return v
 def expr(self):
  n=self.take('ident')
  if not self.peek('langle'): return Atom(n)
  self.take('langle'); a=[]
  if not self.peek('rangle'):
   a.append(self.expr())
   while self.peek('comma'): self.take('comma'); a.append(self.expr())
  self.take('rangle'); return Call(n,tuple(a))
 def parse(self):
  x=self.expr()
  if self.i!=len(self.tokens): raise ParseError(f'Trailing token {self.peek()}')
  return x
@dataclass(frozen=True)
class Type:
 kind:str; dims:tuple=()
 def __str__(self):
  if self.kind!='Quantity': return self.kind
  names=('L','T','M','Θ'); parts=[n if e==1 else f'{n}^{e}' for n,e in zip(names,self.dims) if e]
  return 'Quantity['+'·'.join(parts or ['
```

_Excerpt truncated at 1,800 characters; full length 6002 characters._

### Arcane_Phase_6S_Typed_Expression_Integration/arcane_phase6c_operator_registry 3.py

- Type: PY
- SHA-256: `ddc412c232a4442b421bbb4079fe0d19078ce18fddbc8e46c2ee679612e361e8`
- Extracted characters: 6778

```text
#!/usr/bin/env python3
"""Arcane Phase 6C: provisional operator registry and typed semantics tests.
Audit notation only; not canonical spoken Arcane or a production compiler."""
from dataclasses import dataclass
import re
TOKEN=re.compile(r"\s*(?:(?P<ident>[A-Za-z_][A-Za-z0-9_-]*)|(?P<langle>⟨)|(?P<rangle>⟩)|(?P<comma>,))")
class ParseError(ValueError): pass
class TypeCheckError(ValueError): pass
@dataclass(frozen=True)
class Atom: value:str
@dataclass(frozen=True)
class Call: operator:str; args:tuple
class Parser:
 def __init__(self,s):
  self.tokens=[]; p=0
  while p<len(s):
   if s[p:].isspace(): break
   m=TOKEN.match(s,p)
   if not m: raise ParseError(f'Unexpected character at {p}: {s[p]!r}')
   k=next(k for k,v in m.groupdict().items() if v is not None); self.tokens.append((k,m.group(k))); p=m.end()
  if p<len(s) and not s[p:].isspace(): raise ParseError(f'Unexpected text at {p}')
  self.i=0
 def peek(self,k=None): return (False if k else None) if self.i>=len(self.tokens) else (self.tokens[self.i][0]==k if k else self.tokens[self.i])
 def take(self,k):
  if not self.peek(k): raise ParseError(f'Expected {k}; found {self.peek()}')
  v=self.tokens[self.i][1]; self.i+=1; return v
 def expr(self):
  n=self.take('ident')
  if not self.peek('langle'): return Atom(n)
  self.take('langle'); a=[]
  if not self.peek('rangle'):
   a.append(self.expr())
   while self.peek('comma'): self.take('comma'); a.append(self.expr())
  self.take('rangle'); return Call(n,tuple(a))
 def parse(self):
  x=self.expr()
  if self.i!=len(self.tokens): raise ParseError(f'Trailing token {self.peek()}')
  return x
@dataclass(frozen=True)
class Type:
 kind:str; dims:tuple=()
 def __str__(self):
  if self.kind!='Quantity': return self.kind
  names=('L','T','M','Θ'); parts=[n if e==1 else f'{n}^{e}' f
```

_Excerpt truncated at 1,800 characters; full length 6778 characters._

### Arcane_Phase_6S_Typed_Expression_Integration/arcane_phase6d_lexicon_bridge 2.py

- Type: PY
- SHA-256: `542a951978c3ebc787a937a34bb0f5abbc5a378bd56cb068edcd353ba158a6d1`
- Extracted characters: 6711

```text
#!/usr/bin/env python3
"""Arcane Phase 6D: reconcile Phase 6C operator names with Phase 4/5 lexicon.
Audit prototype only. No change to spoken canon is implied by these tests.
"""
import csv, sys
from pathlib import Path
from arcane_phase6c_operator_registry import Parser, check, TypeCheckError, ParseError, Q, Type, BOOL, Atom, Call

LEXICON = Path(__file__).with_name('Arcane_Lexicon_v5_draft.csv')

def load_lexicon(path=LEXICON):
    with open(path, encoding='utf-8-sig', newline='') as f:
        return list(csv.DictReader(f))

def alias_map(rows):
    """Recover explicit legacy aliases only from 'was FORM' lexicon notes."""
    aliases = {}
    for row in rows:
        note = (row.get('note') or '').strip()
        if note.lower().startswith('was '):
            old = note[4:].strip().lower()
            new = (row.get('form') or '').strip().lower()
            if old and new:
                if old in aliases and aliases[old] != new:
                    raise ValueError(f'Conflicting alias {old}: {aliases[old]} vs {new}')
                aliases[old] = new
    return aliases

# Source forms are the Phase 4/5 spellings. Legacy names remain accepted as aliases.
CANONICAL_OPERATOR = {
    'FRAPA':'frapa', 'FRATA':'fraja', 'FRAKA':'frama', 'FRALA':'frala',
    'FRASHA':'frasha', 'DRAN':'dran', 'DREM':'drem', 'DRIM':'drum',
    'DRAL':'dras', 'GRAN':'gran', 'GRAT':'grat', 'GRAK':'grash',
    'BEK':'bek', 'ZET':'zet', 'KWAM':'kwam', 'KWAT':'kwat', 'KWAK':'kwash',
    'NES':'nes', 'SIMA':'sima', 'GAMA':'gama', 'DAVE':'dave',
}

def resolve_operator(name, aliases=None):
    """Resolve a parser's abstract operator label to the lexicon's actual form.
    Return the lexical form; type rules are still expressed in stable semantic IDs.
    """
    aliases = aliases or {}
    n =
```

_Excerpt truncated at 1,800 characters; full length 6711 characters._

### Arcane_Phase_6S_Typed_Expression_Integration/arcane_phase6e_runtime_evaluator 2.py

- Type: PY
- SHA-256: `65e274ea1130dce2f85ed387ed1f66a58193e6f9effd3236f0dbf5630492c502`
- Extracted characters: 8882

```text
#!/usr/bin/env python3
"""Arcane Phase 6E: runtime numeric/vector evaluator.
Audit notation only; values are test fixtures, not new Arcane vocabulary or spell execution.
"""
from dataclasses import dataclass
from math import sqrt, isfinite
from typing import Union
from arcane_phase6c_operator_registry import Parser, Atom, Call, Type, Q, BOOL, TypeCheckError, check
from arcane_phase6d_lexicon_bridge import load_lexicon, alias_map, normalise_ast, semantic_id_for_form

class EvaluationError(ValueError): pass
@dataclass(frozen=True)
class Quantity:
    value: float
    dims: tuple
@dataclass(frozen=True)
class Vector:
    components: tuple
    dims: tuple
@dataclass(frozen=True)
class Relation:
    value: str
@dataclass(frozen=True)
class UnitSymbol:
    name: str
Runtime = Union[Quantity, Vector, bool, Relation, UnitSymbol]

# Runtime test environment uses explicit SI-like base units: m, s, kg, K.
ENV = {
 'A': Quantity(2.0,(0,0,0,0)), 'B': Quantity(3.0,(0,0,0,0)), 'A_ZERO': Quantity(0.0,(0,0,0,0)),
 'LEN_A': Quantity(5.0,(1,0,0,0)), 'LEN_B': Quantity(2.0,(1,0,0,0)),
 'TIME_A': Quantity(4.0,(0,1,0,0)), 'MASS_A': Quantity(3.0,(0,0,1,0)),
 'VEL_A': Quantity(6.0,(1,-1,0,0)), 'FORCE_A': Quantity(8.0,(1,-2,1,0)),
 'ENERGY_A': Quantity(12.0,(2,-2,1,0)), 'TEMP_A': Quantity(300.0,(0,0,0,1)),
 'VEC_LEN_A': Vector((3.0,4.0,0.0),(1,0,0,0)),
 'VEC_VEL_A': Vector((1.0,2.0,2.0),(1,-1,0,0)),
 'BOOL_A': True, 'BOOL_FALSE': False,
 'LT': Relation('LT'), 'LE': Relation('LE'), 'EQ': Relation('EQ'),
 'NE': Relation('NE'), 'GE': Relation('GE'), 'GT': Relation('GT'),
 'MA': UnitSymbol('MA'), 'SE': UnitSymbol('SE'),
}

def finite(x, where):
    if not isfinite(x): raise EvaluationError(f'{where}: result is not finite')
    return x

def eval_ast(node, env=None):
    env = ENV if env is None else
```

_Excerpt truncated at 1,800 characters; full length 8882 characters._

### Arcane_Phase_6S_Typed_Expression_Integration/arcane_phase6f_control_bindings.py

- Type: PY
- SHA-256: `62630d9e041162213a6ab95defac5fdd5f1a61aaee9eca05a5423aade73f4b35`
- Extracted characters: 10741

```text
#!/usr/bin/env python3
"""Arcane Phase 6F: bounded control flow and binding semantics prototype.
Audit notation only. Implements only the subset grounded in Phase 4 G-2/G-5/G-6
and Phase 4's KWAM/KWAT/KWASH descriptions. Not a surface-grammar parser or spell engine.
"""
from dataclasses import dataclass
from pathlib import Path
import sys
from arcane_phase6c_operator_registry import Parser, Atom, Call, Type, Q, BOOL, check, TypeCheckError, ParseError
from arcane_phase6d_lexicon_bridge import load_lexicon, alias_map, normalise_ast
from arcane_phase6e_runtime_evaluator import Quantity, Vector, Relation, UnitSymbol, Runtime, ENV, EvaluationError, eval_ast, show

class ControlError(ValueError): pass
@dataclass
class State:
    values: dict
    types: dict
    steps: int = 0
    max_steps: int = 100

def id_name(node):
    if not isinstance(node, Atom):
        raise ControlError('Binding identifier must be a single audit-symbol atom such as ID_1; numeric SHO-closed surface identifiers are not parsed here')
    if not (node.value.startswith('ID_') and node.value[3:].isdigit()):
        raise ControlError('Binding identifier must use audit notation ID_n; this is not a new Arcane word')
    return node.value

def type_of_value(v):
    if isinstance(v, Quantity): return Type('Quantity', v.dims)
    if isinstance(v, Vector): return Type('Vector', v.dims)
    if isinstance(v, bool): return BOOL
    if isinstance(v, Relation): return Type('RelationCriterion')
    if isinstance(v, UnitSymbol): return Type('UnitSymbol')
    raise ControlError(f'Unsupported binding value type: {type(v).__name__}')

def is_block(node):
    return isinstance(node, Call) and node.operator == 'METO'

def infer(node, st):
    if isinstance(node, Atom):
        if node.value in st.types: return st.types[no
```

_Excerpt truncated at 1,800 characters; full length 10741 characters._

### Arcane_Phase_6S_Typed_Expression_Integration/arcane_phase6g_surface_parser.py

- Type: PY
- SHA-256: `c703697e792129b831cea16802342eba0add75ab8fbf4abd8c68805fffcaa77e`
- Extracted characters: 12023

```text
#!/usr/bin/env python3
"""Arcane Phase 6G: a source-grounded, fail-closed surface token parser.

This is a narrow parser prototype for the Formal expression subset. It consumes
whitespace-tokenised lowercase/uppercase romanised words; it is not a speech
recogniser, phonetic parser, complete Arcane grammar, or spell compiler.
The AST deliberately keeps literals, identifiers, atoms, calls, and blocks distinct.
"""
from __future__ import annotations
from dataclasses import dataclass
from decimal import Decimal, InvalidOperation
from pathlib import Path
import csv, re, sys

ROOT = Path(__file__).resolve().parent
LEXICON_PATH = ROOT / 'Arcane_Lexicon_v5_draft.csv'

class ArcaneParseError(ValueError):
    pass

@dataclass(frozen=True)
class Node: pass
@dataclass(frozen=True)
class Atom(Node):
    form: str
    cls: str = 'UNKNOWN'
@dataclass(frozen=True)
class QuantityLiteral(Node):
    value: Decimal
    unit: str
    raw_number: str
@dataclass(frozen=True)
class Identifier(Node):
    digits: str
@dataclass(frozen=True)
class Call(Node):
    operator: str
    args: tuple[Node, ...]
@dataclass(frozen=True)
class Block(Node):
    expressions: tuple[Node, ...]

# Only operators whose fixed arity and operand parse shape are sufficiently clear
# for this parser milestone. Unknown operator-like lexemes fail closed.
ARITY = {
    'frapa': 2, 'fraja': 2, 'frama': 2, 'frala': 2, 'frasha': 1,
    'dran': 1, 'drem': 2, 'drum': 2, 'dras': 3,
    'gran': 2, 'grat': 2, 'grash': 1,
    'kwam': 2, 'kwat': 1, 'kwash': 1,
    'bek': 2, 'zet': 2, 'kole': 2,
}
CONTROL = {'bek', 'zet', 'kole'}
BLOCK_OPEN, BLOCK_CLOSE = 'meto', 'dogu'
DIGITS = {'za':'0','ki':'1','to':'2','mu':'3','re':'4','sa':'5','fi':'6','du':'7','go':'8','pe':'9'}
DECIMAL_MARK = 'shi'
UNITS = {'ma','se','ke','ra','ku','sho','v
```

_Excerpt truncated at 1,800 characters; full length 12023 characters._

### Arcane_Phase_6S_Typed_Expression_Integration/arcane_phase6h_pipeline.py

- Type: PY
- SHA-256: `195bbb9d2836b09b70272d258d17c088de5e90f547d2db7009b58291a748e2da`
- Extracted characters: 10096

```text
#!/usr/bin/env python3
"""Arcane Phase 6H: narrow end-to-end parse/check/evaluate prototype.
Not a complete language implementation or a magic/construction executor.
"""
from dataclasses import dataclass
from decimal import Decimal
from pathlib import Path
import csv, sys
ROOT=Path(__file__).resolve().parent
LEXICON=ROOT/'Arcane_Lexicon_v5_draft.csv'
class ArcaneError(ValueError): pass
class ParseError(ArcaneError): pass
class TypeCheckError(ArcaneError): pass
class RuntimeArcaneError(ArcaneError): pass
@dataclass(frozen=True)
class Num: value: Decimal; unit: str
@dataclass(frozen=True)
class Word: form: str
@dataclass(frozen=True)
class Call: op: str; args: tuple
@dataclass(frozen=True)
class Block: expressions: tuple
DIGITS={'za':'0','ki':'1','to':'2','mu':'3','re':'4','sa':'5','fi':'6','du':'7','go':'8','pe':'9'}
UNITS={'ma','se','ke','ra','ku','sho','vo'}
ARITY={'frapa':2,'fraja':2,'frama':2,'frala':2,'frasha':1,'gran':2,'grat':2,'grash':1,'bek':2,'zet':2,'kole':2,'kwam':2,'kwat':1,'kwash':1}
ALIASES={'frata':'fraja','fraka':'frama','drim':'drum','dral':'dras','grak':'grash','kwak':'kwash'}
CONTROL={'bek','zet','kole'}
def forms():
 if not LEXICON.exists(): raise FileNotFoundError(LEXICON)
 with LEXICON.open(encoding='utf-8',newline='') as f: return {r['form'].strip().lower() for r in csv.DictReader(f) if r.get('form','').strip()}
FORMS=forms()
def parse(src):
 ts=[ALIASES.get(x.lower(),x.lower()) for x in src.split()]
 if not ts: raise ParseError('Empty input')
 i=0
 def peek(): return ts[i] if i<len(ts) else None
 def take():
  nonlocal i
  if peek() is None: raise ParseError('Unexpected end of input')
  x=ts[i]; i+=1; return x
 def number():
  ds=[]
  while peek() in DIGITS: ds.append(DIGITS[take()])
  if not ds: raise ParseError('Expected numeral digit')
  frac=
```

_Excerpt truncated at 1,800 characters; full length 10096 characters._

### Arcane_Phase_6S_Typed_Expression_Integration/arcane_phase6i_contract_audit.py

- Type: PY
- SHA-256: `bf7faab6e71ce8c96cac0750ce2f0c27547ba938b5d7fbc63007e9cff4be3a20`
- Extracted characters: 3992

```text
#!/usr/bin/env python3
"""Arcane Phase 6I: executable contract and dimensional-safety audit.

This audit tests only behaviour explicitly implemented in the Phase 6H subset.
It deliberately does not infer canonical meanings for unresolved units/operators.
"""
from decimal import Decimal
import arcane_phase6h_pipeline as arc

CASES = []
def add(name, fn):
    try:
        passed, detail = fn()
        CASES.append((name, bool(passed), str(detail)))
    except Exception as exc:
        CASES.append((name, False, f'{type(exc).__name__}: {exc}'))

def expect_value(source, expected):
    node = arc.parse(source)
    typ = arc.check(node)
    value = arc.evaluate(node)
    return value == expected, f'type={typ}; value={value!r}; expected={expected!r}'

def expect_error(source, stage, fragment):
    try:
        node = arc.parse(source)
        if stage == 'type':
            arc.check(node)
        elif stage == 'runtime':
            arc.check(node); arc.evaluate(node)
        else:
            return False, 'invalid test stage'
    except Exception as exc:
        return fragment.lower() in str(exc).lower(), f'{type(exc).__name__}: {exc}'
    return False, 'expression unexpectedly succeeded'

# Arithmetic: values and preserved unit labels.
add('addition preserves SHO', lambda: expect_value('frapa ki sho to sho', (Decimal(3), 'sho')))
add('subtraction preserves SHO', lambda: expect_value('fraja mu sho ki sho', (Decimal(2), 'sho')))
add('dimensionless multiplication', lambda: expect_value('frama ki sho to sho', (Decimal(2), 'sho')))
add('dimensionless divisor', lambda: expect_value('frala mu sho to sho', (Decimal('1.5'), 'sho')))
add('absolute value preserves unit', lambda: expect_value('frasha za ma', (Decimal(0), 'ma')))
add('addition rejects different unit labels', lambda:
```

_Excerpt truncated at 1,800 characters; full length 3992 characters._

### Arcane_Phase_6S_Typed_Expression_Integration/arcane_phase6k_semantic_tests.py

- Type: PY
- SHA-256: `13bbcfa629e622a35213d383bea86cc2ddc06ab2440ddc258739304d09bd76e8`
- Extracted characters: 1565

```text
#!/usr/bin/env python3
"""Arcane Phase 6K: source-backed corrective semantic tests.

This module validates the recovered unary numeric meaning of FRASHA (negate).
It is intentionally not a patch to the unavailable Phase 6H runtime file.
"""
from decimal import Decimal
import unittest


def frasha_negate(value: Decimal) -> Decimal:
    """Reference contract: FRASHA negates a numeric value; it is not abs()."""
    if not isinstance(value, Decimal):
        raise TypeError("FRASHA reference contract requires Decimal numeric input")
    return -value


class FrashaContractTests(unittest.TestCase):
    def test_positive_to_negative(self):
        self.assertEqual(frasha_negate(Decimal("3")), Decimal("-3"))

    def test_negative_to_positive(self):
        self.assertEqual(frasha_negate(Decimal("-3")), Decimal("3"))

    def test_zero_remains_zero(self):
        self.assertEqual(frasha_negate(Decimal("0")), Decimal("0"))

    def test_fractional_value(self):
        self.assertEqual(frasha_negate(Decimal("1.25")), Decimal("-1.25"))

    def test_not_absolute_value(self):
        value = Decimal("3")
        self.assertNotEqual(frasha_negate(value), abs(value))

    def test_rejects_non_numeric_fixture(self):
        with self.assertRaises(TypeError):
            frasha_negate(True)  # bool is not an Arcane numeric value


if __name__ == "__main__":
    suite = unittest.defaultTestLoader.loadTestsFromTestCase(FrashaContractTests)
    result = unittest.TextTestRunner(verbosity=2).run(suite)
    raise SystemExit(0 if result.wasSuccessful() else 1)
```

### Arcane_Phase_6S_Typed_Expression_Integration/arcane_phase6m_execution_audit.py

- Type: PY
- SHA-256: `cc63c6d7147f21190523f6ddc11928ae07795365a7276c3abf9487b5df3c1268`
- Extracted characters: 4417

```text
#!/usr/bin/env python3
"""Phase 6M: execute source/registry evidence checks and classify grammar tests honestly.
This does not pretend unavailable parser/runtime/physical tests were executed.
"""
from pathlib import Path
import csv
ROOT=Path(__file__).resolve().parent
REG=ROOT/'Arcane_Phase_6L_Operator_Contract_Registry.csv'
P4=ROOT/'Arcane_Language_Audit_Phase_4.txt'
REC=ROOT/'Arcane_Continuity_Recovery_Audit.txt'
TESTS=ROOT/'Arcane_Grammar_Consistency_Test_Register.docx'
with REG.open(encoding='utf-8-sig',newline='') as f: rows=list(csv.DictReader(f))
by={r['form'].lower():r for r in rows}
p4=P4.read_text(encoding='utf-8')
rec=REC.read_text(encoding='utf-8')
results=[]
def check(name,condition,detail): results.append((name,'PASS' if condition else 'FAIL',detail))
check('Registry input available',bool(rows),'Loaded Phase 6L operator registry')
check('FRAPA binary contract documented',by.get('frapa',{}).get('arity_or_shape','').lower()=='binary','Registry documents FRAPA as binary; this checks metadata only, not parser enforcement')
check('FRATA historical alias documented','was frata' in by.get('fraja',{}).get('lexicon_note','').lower(),'Registry links current FRAJA to historical FRATA')
check('Unique-parse rule present','unique parse' in rec.lower(),'Recovery audit states executable expressions require a unique parse')
check('Fixed-arity rule present','g-1 fixed arity' in p4.lower(),'Phase 4 records fixed arity and typed signatures as a grammar rule')
check('Modifier scope rule present','nearest preceding clause at the same block level' in p4.lower(),'Phase 4 documents clause-level modifier attachment')
check('FRASHA source/runtime mismatch remains flagged','frasha' in by and ('abs()' in by['frasha'].get('open_issue','').lower() and 'negative numeral sign' in by['fras
```

_Excerpt truncated at 1,800 characters; full length 4417 characters._

### Arcane_Phase_6S_Typed_Expression_Integration/Arcane_Phase_5_10_Numerals_and_Frame_Contract 2.md

- Type: MD
- SHA-256: `2f40b528ab7fe345ac5eaa2e0fc3ee542f8e6654c1eb96e68e82911cdcd1295d`
- Extracted characters: 6201

```text
# Arcane Phase 5.10 — Numeral Closure and Coordinate-Frame Contract

**Status:** audit implementation passes its 19 defined tests; proposed frame contract remains provisional. This phase does not overwrite Phase 4 or claim that a complete spoken Arcane parser exists.

## 1. Scope and source priority

Phase 4 is the controlling source for this phase. It establishes that every numeral is closed by a unit, `SHO` is the dimensionless unit, and a binding identifier is a numeral closed by `SHO`. It also establishes the canonical unit spellings `MA`, `SE`, `KE`, `RA`, and `KU`, and the frame-transform root `LABU` as proposed in the Phase 4 ledger. The recovered sources do not fully specify a spoken tokenizer or actual transform operands, so this phase tests a token-level audit representation rather than silently inventing surface grammar.

## 2. Numeral closure rules implemented for audit

1. A quantity consists of digit tokens, optionally one `SHI` decimal marker, and exactly one terminal unit token.
2. Canonical digits are `ZA KI TO MU RE SA FI DU GO PE` = 0–9.
3. `SHI` must have at least one digit on both sides; repeated, leading, or trailing decimal markers are rejected.
4. The terminal unit is one of `MA`, `SE`, `KE`, `RA`, `KU`, or `SHO`.
5. `SHO` yields a dimensionless quantity and may close a binding identifier.
6. In the audit token stream, `KWAM KI SHO TO MU MA` is segmented as binding identifier 1 followed by value 23 MA; `KWAM KI TO SHO MU MA` is identifier 12 followed by value 3 MA. This follows the Phase 4 identifier rule. It is not yet proof that the continuous spoken stream has a verified acoustic boundary; Phase 4 already identifies unit-fall/lengthening as provisional prosody requiring listener testing.
7. Values are stored as exact rational numbers in the te
```

_Excerpt truncated at 1,800 characters; full length 6201 characters._

### Arcane_Phase_6S_Typed_Expression_Integration/Arcane_Phase_5_10_Test_Results.txt

- Type: TXT
- SHA-256: `009d13099e8e99d6e5d0c3f9cb598e58ab38d01b55694fba2ffabf2e23e83958`
- Extracted characters: 955

```text
PASS	P5.10-T01 integer quantity closes with MA
PASS	P5.10-T02 decimal quantity 0.20 m preserves value
PASS	P5.10-T03 SHO closes dimensionless numeral
PASS	P5.10-T04 seconds unit classified as time
PASS	P5.10-T05 missing unit rejected
PASS	P5.10-T06 unknown unit rejected
PASS	P5.10-T07 repeated decimal marker rejected
PASS	P5.10-T08 leading decimal marker rejected
PASS	P5.10-T09 trailing decimal marker rejected
PASS	P5.10-T10 identifier/value split by SHO
PASS	P5.10-T11 multi-digit identifier remains exact
PASS	P5.10-T12 missing SHO identifier rejected
PASS	P5.10-T13 identity matrix is valid rotation
PASS	P5.10-T14 90-degree rotation matrix is valid
PASS	P5.10-T15 orthogonal reflection matrix is valid frame map
PASS	P5.10-T16 malformed non-orthogonal matrix rejected
PASS	P5.10-T17 vector transformed by 90-degree rotation
PASS	P5.10-T18 inverse rotation restores vector
PASS	P5.10-T19 rotation preserves vector length squared
RESULT: 19/19 PASS
```

### Arcane_Phase_6S_Typed_Expression_Integration/Arcane_Phase_5_11_Test_Results.txt

- Type: TXT
- SHA-256: `1951ca3a4d23c31e8dbab562efe8cab74c7a0247881a6092bfb834c4beab7477`
- Extracted characters: 484

```text
PASS	same-dimension addition
PASS	length plus time rejected
PASS	length times length gives area
PASS	length divided by time gives velocity dimensions
PASS	division by zero rejected
PASS	matching-type comparison works
PASS	mismatched-type comparison rejected
PASS	nested audit parse
PASS	missing close bracket rejected
PASS	trailing tokens rejected
PASS	fixed arity accepted
PASS	missing argument rejected
PASS	extra argument rejected
PASS	unknown operator rejected
RESULT: 14/14 PASS
```

### Arcane_Phase_6S_Typed_Expression_Integration/Arcane_Phase_5_11_Typed_Expression_Audit.md

- Type: MD
- SHA-256: `b1e5fcf5f6f348c88a2cc2f9e36bc0549be8b7f907f3d6f57a82d4f712cdb010`
- Extracted characters: 3238

```text
# Arcane Phase 5.11 — Typed Expression Audit Harness

**Status:** 14/14 implemented checks pass. This is a typed audit harness, not a canonical Arcane compiler. It uses Phase 2's angle-bracket notation only as metanotation and does not introduce spoken forms.

## Scope

This phase begins the next recommended step from Phase 5.10: a small expression parser and typed arithmetic layer. It covers nested audit expressions, fixed arity, rejection of malformed grouping, dimensional arithmetic, comparison compatibility, and division by zero.

## Implemented checks

- Addition and subtraction require compatible dimensions and frame tags.
- Multiplication adds dimension exponents; division subtracts them.
- Length × length produces area dimensions; length ÷ time produces velocity dimensions.
- Division by zero is rejected.
- Comparisons require matching types and frame tags and a known relation operator (`NADI`, `DOFA`, `GUWI`).
- The audit parser preserves nested argument structure and rejects unclosed brackets, trailing tokens, unknown operators, missing arguments and extra arguments.
- Exact rational values are used in arithmetic fixtures.

## Deliberate limits

1. `FRAPA` and `FRALA` are the canonical Phase 3/4 roots. Where Phase 4 renamed sibling roots, the test harness does not silently rewrite the canonical lexicon; the implementation's comments acknowledge aliases where applicable.
2. The parser uses Phase 2 audit punctuation (`⟨`, `⟩`, commas), not the spoken or written surface grammar.
3. It does not yet parse numeral sequences directly inside expressions or connect them to the Phase 5.10 numeral parser.
4. It does not implement vector types, general affine frames, uncertainty, angle conversions, information/mana dimensions, temporal/control operators, or Construction F
```

_Excerpt truncated at 1,800 characters; full length 3238 characters._

### Arcane_Phase_6S_Typed_Expression_Integration/Arcane_Phase_5_12_Operator_Registry 2.json

- Type: JSON
- SHA-256: `a0364058a75f6e35e18c7b5e5b2c00a6642960dac3178e02ee4a3b2ce8430fc2`
- Extracted characters: 22092

```text
{
  "phase": "5.12",
  "status": "PROVISIONAL REGISTRY",
  "authority": "Phase 4 spellings take precedence where a rename is recorded; older forms are aliases, not competing canonical definitions.",
  "operators": [
    {
      "form": "frapa",
      "gloss": "add",
      "arity": 2,
      "inputs": "Quantity[d] \u00d7 Quantity[d]",
      "output": "Quantity[d]",
      "dimensional_rule": "same dimensions required; unit conversion allowed",
      "status": "CANON form; signature PROVISIONAL",
      "source": "v3.0-L; Phase 2",
      "aliases": "",
      "evaluation": "eager, pure",
      "failure": "reject dimension mismatch",
      "notes": "Addition is not defined for arbitrary semantic kinds."
    },
    {
      "form": "fraja",
      "gloss": "subtract",
      "arity": 2,
      "inputs": "Quantity[d] \u00d7 Quantity[d]",
      "output": "Quantity[d]",
      "dimensional_rule": "same dimensions required",
      "status": "RENAMED form; signature PROVISIONAL",
      "source": "Phase 4 \u00a75; v4/v5 lexicon",
      "aliases": "frata",
      "evaluation": "eager, pure",
      "failure": "reject dimension mismatch",
      "notes": "Old form retained as alias for source compatibility; canonical output spelling is fraja."
    },
    {
      "form": "frama",
      "gloss": "multiply",
      "arity": 2,
      "inputs": "Quantity[d1] \u00d7 Quantity[d2]",
      "output": "Quantity[d1\u00b7d2]",
      "dimensional_rule": "dimensions multiply",
      "status": "RENAMED form; signature PROVISIONAL",
      "source": "Phase 4 \u00a75; v4/v5 lexicon",
      "aliases": "fraka",
      "evaluation": "eager, pure",
      "failure": "reject unsupported semantic kinds",
      "notes": "Old form retained as alias; dimensional algebra required."
    },
    {
      "form": "frala",
      "
```

_Excerpt truncated at 1,800 characters; full length 22092 characters._

### Arcane_Phase_6S_Typed_Expression_Integration/Arcane_Phase_5_12_Operator_Registry 2.md

- Type: MD
- SHA-256: `da4f366ef406028e36d103d261ed7b057fb0e5cea4cc648a36b702fd61886f19`
- Extracted characters: 3737

```text
# Arcane Phase 5.12 — Canonical Operator Registry

**Status: PROVISIONAL REGISTRY; not a canon rewrite.**

## Purpose

Consolidate the Phase 2 signature proposals with Phase 4's renames and the v4/v5 lexicon drafts. This registry is a single audit source for spellings, aliases, arity, types, dimensional behaviour, evaluation, failure conditions, evidence and open questions. It does not pretend that every operator contract has been recovered.

## Source-priority rule

Where Phase 4 explicitly renamed a Phase 2/v3.0-L form, the Phase 4 spelling is the canonical candidate and the earlier form is retained as a source-compatibility alias: `FRATA → FRAJA`, `FRAKA → FRAMA`, `DRIM → DRUM`, `DRAL → DRAS`, `GRAK → GRASH`, and `KWAK → KWASH`. This follows the recovery pack's rule to preserve old forms as aliases unless an inconsistency is demonstrated. Do not emit aliases as canonical spellings in new formal material.

## Core safeguards

- `FRAPA`, `FRAJA`, `FRAMA`, `FRALA`, and `FRASHA` are registry forms for arithmetic, but signatures remain provisional pending complete semantic-kind and dimensional rules.
- `DRAS` requires a relation criterion; Phase 4 relation values (`NADI`, `DOFA`, `GUWI`) are still proposed, not canon.
- `SIMA` requires a physical measurement pathway. Its exact surface arity is unresolved.
- `GAMA` changes symbolic assignment only. Assignment is not physical causation.
- `KWAM` creates a binding, not a physical object. Its identifier is a numeral closed by `SHO` under Phase 4 G-2.
- `KWASH` is the Phase 4 canonical candidate for live evaluation; sampling and evaluation timing remain open.
- `BEK` and `ZET` must be reconciled with Phase 4's block grammar (`METO`/`DOGU`) and condition semantics. Do not use the earlier two-argument sketch to bypass block stru
```

_Excerpt truncated at 1,800 characters; full length 3737 characters._

### Arcane_Phase_6S_Typed_Expression_Integration/Arcane_Phase_5_12_Operator_Registry.csv

- Type: CSV
- SHA-256: `e7be223c8f0447ba69e2c08331bed08a743d98b993f7f1513e800b796189d903`
- Extracted characters: 11777

```text
form,gloss,arity,inputs,output,dimensional_rule,status,source,aliases,evaluation,failure,notes
frapa,add,2,Quantity[d] × Quantity[d],Quantity[d],same dimensions required; unit conversion allowed,CANON form; signature PROVISIONAL,v3.0-L; Phase 2,,"eager, pure",reject dimension mismatch,Addition is not defined for arbitrary semantic kinds.
fraja,subtract,2,Quantity[d] × Quantity[d],Quantity[d],same dimensions required,RENAMED form; signature PROVISIONAL,Phase 4 §5; v4/v5 lexicon,frata,"eager, pure",reject dimension mismatch,Old form retained as alias for source compatibility; canonical output spelling is fraja.
frama,multiply,2,Quantity[d1] × Quantity[d2],Quantity[d1·d2],dimensions multiply,RENAMED form; signature PROVISIONAL,Phase 4 §5; v4/v5 lexicon,fraka,"eager, pure",reject unsupported semantic kinds,Old form retained as alias; dimensional algebra required.
frala,divide,2,Quantity[d1] × Quantity[d2],Quantity[d1/d2],dimensions divide; zero denominator invalid,CANON form; signature PROVISIONAL,v3.0-L; Phase 2,,"eager, pure",division by zero rejects,Dimensionless ratio is possible when dimensions cancel.
frasha,negate,1,Numeric quantity or numeric scalar,Same type as input,preserve dimensions,CANON form; signature PROVISIONAL,v3.0-L; Phase 2,,"eager, pure",reject non-numeric input,Do not confuse with negative-number marker if grammar gives it a distinct role.
dran,magnitude,1,Vector with defined norm,Scalar magnitude,output carries input vector dimension,CANON form; signature PROVISIONAL,v3.0-L; Phase 2,,"eager, pure",reject unsupported vector/kind,Norm and metric/frame assumptions need formal definition.
drem,dot product,2,"Vector[d1, frame] × Vector[d2, same frame]",Scalar,dimensions multiply,CANON form; signature PROVISIONAL,v3.0-L; Phase 2,,"eager, pure",reject frame
```

_Excerpt truncated at 1,800 characters; full length 11777 characters._

### Arcane_Phase_6S_Typed_Expression_Integration/Arcane_Phase_5_12_Test_Results 2.txt

- Type: TXT
- SHA-256: `1e63f8b96672e5e7f8a5919453a2ea0e164b28506d4e871fd81642272f98e416`
- Extracted characters: 758

```text
PASS	unique registry forms	40 entries
PASS	renamed subtract canonical form
PASS	renamed multiply canonical form
PASS	renamed cross canonical form
PASS	renamed compare canonical form
PASS	renamed NOT canonical form
PASS	renamed live evaluation canonical form
PASS	Phase 2 arithmetic operators present
PASS	Phase 2 info operators present
PASS	binding operators present
PASS	logic operators present
PASS	construction verbs reconciled
PASS	all entries include source and status
PASS	proposed Phase 4 items not mislabeled canon
PASS	assignment explicitly non-causal
PASS	binding explicitly symbolic
PASS	SIMA physical pathway required
PASS	DRAL renamed contract points to relation criterion
PASS	macro verbs remain unexpanded until v2 recovery
RESULT: 19/19 PASS
```

### Arcane_Phase_6S_Typed_Expression_Integration/Arcane_Phase_5_13_Test_Results.txt

- Type: TXT
- SHA-256: `1bf86c3dc4b78bd688d6cb75aaa61572a87de78e10d8a7169cb6ef9deb7e3a83`
- Extracted characters: 541

```text
PASS	nested valid same-dimension addition
PASS	canonical alias fraja accepted as subtraction-form registry entry
PASS	legacy frata normalises to fraja
PASS	length times time yields product dimensions
PASS	division by zero rejected
PASS	addition dimension mismatch rejected
PASS	missing argument rejected
PASS	extra argument rejected
PASS	unknown operator rejected
PASS	boolean AND accepted
PASS	non-Boolean AND rejected
PASS	NOT requires Boolean
PASS	strict mode rejects provisional signature
PASS	trailing token rejected
RESULT: 14/14 PASS
```

### Arcane_Phase_6S_Typed_Expression_Integration/Arcane_Phase_5_13_Typed_AST_Validator.md

- Type: MD
- SHA-256: `fa6f46cd42dcf20a9fa282ef1767ec45a75704741840ea7896e07bc2749bea56`
- Extracted characters: 2810

```text
# Arcane Phase 5.13 — Minimal Typed AST and Validator

**Status:** audit prototype, not a production compiler and not a canon change.

## Goal

Exercise the Phase 5.12 registry through a minimal recursive parser. The prototype parses a diagnostic notation, builds a typed abstract syntax tree (AST), normalises recorded aliases, checks arity, and validates a deliberately small subset of type and dimension rules.

## Audit notation

This is testing metalanguage only; angle brackets and commas are not claimed to be spoken Arcane.

- `Q<1,L>` — quantity with value 1 and dimension label `L` (length)
- `Q<2,T>` — quantity with value 2 and dimension label `T` (time)
- `B<true>` — Boolean literal
- `V<L,world>` — vector with dimension `L` in frame `world`
- `ID<1>` — binding identifier
- `FRAPA<arg1,arg2>` — nested operator expression

The harness uses exact rational values where relevant.

## Implemented behaviours

- Recursive parsing of nested expressions.
- Rejection of malformed delimiters, missing/extra arguments, unknown operators and trailing tokens.
- Alias normalisation using Phase 5.12's registry (`FRATA` normalises to `FRAJA`, etc.).
- Basic dimensional checks for add/subtract/multiply/divide and Boolean checks for AND/OR/NOT.
- Explicit division-by-zero rejection.
- Strict mode fails closed when an operator's signature is provisional, open or proposed.

## Results

**14/14 tests passed.** See `Arcane_Phase_5_13_Test_Results.txt`.

## Limitations

1. This only implements type rules for a small arithmetic/Boolean subset.
2. Most registry entries intentionally fail closed because their contracts are not yet fully defined.
3. It does not compile Construction/Foot expressions or the Phase 4 `METO`/`DOGU` block grammar.
4. It does not validate physical feasibility, mana c
```

_Excerpt truncated at 1,800 characters; full length 2810 characters._

### Arcane_Phase_6S_Typed_Expression_Integration/Arcane_Phase_5_14_README.txt

- Type: TXT
- SHA-256: `541ee491b934ba94a6acd44bb172fb713c907b6678132b110ca8eb29aa1e94e1`
- Extracted characters: 666

```text
Arcane Phase 5.14 package

Contents:
- Arcane_Phase_5_14_Signature_Resolution.md: signature-resolution evidence matrix and completeness assessment.
- arcane_phase514_gate.py: executable policy-gate checks against the Phase 5.12 registry.
- Arcane_Phase_5_14_Test_Results.txt: test results.
- Phase 5.12 registry CSV/JSON and report.
- Phase 5.13 AST validator and report/test results.
- Phase 5.10 and 5.11 test results and implementation files where available.
- Recovered Phase 2, Phase 4 and Phase 5 audit sources and lexicon drafts.

Scope warning: this is an audit package, not a production compiler or spell runtime. No new language rule is promoted to canon.
```

### Arcane_Phase_6S_Typed_Expression_Integration/Arcane_Phase_5_14_Signature_Resolution.md

- Type: MD
- SHA-256: `aa8e096f3092cdb671b1028f27dae624dde641155454d6b246533bf427ac4441`
- Extracted characters: 6744

```text
# Arcane Phase 5.14 — Signature Resolution Gate

**Status:** evidence matrix and executable-profile gate; no canon promoted.

## Purpose

Phase 5.14 does not guess missing operator semantics. It identifies the smallest decisions needed to make the next compiler layer safe. Phase 5.12's registry remains provisional and Phase 5.13 remains an audit-only parser.

## Priority contract matrix

| Form | Known from recovered sources | Still unresolved | Minimum evidence/test before lock | Current gate |
|---|---|---|---|---|
| DRAS (alias DRAL) | Comparison family; Phase 4 records DRAS as renamed form | Whether relation is an explicit third operand, an operator family, or a predicate encoding; equality/order domain and mixed-unit conversion | Source-backed examples for equality, less-than, greater-than; dimension mismatch; NaN/unknown values if representable | BLOCKED / signature provisional |
| SIMA | Measurement; distinct from NES/read and DAVE/infer | Surface arity and measurement-pathway representation; sensor/source, resolution, uncertainty, provenance, sampling time | One physical measurement example with target/property/pathway and explicit failure when no pathway exists | BLOCKED / signature open |
| KWASH (alias KWAK) | Live evaluation; alias rename recorded | Sampling cadence/event, snapshot vs repeated evaluation, stale data, errors, side effects | Tests showing when reevaluation occurs, stale/missing context rejection, and no accidental physical effect from observation alone | BLOCKED / signature open |
| BEK | IF; condition and block semantics; Phase 4 G-5/G-6 block delimiters METO/DOGU; condition fires when whole condition becomes true | Exact block AST, else branch (if any), return/control result, onset semantics interaction | Parse and execute-free trace for tru
```

_Excerpt truncated at 1,800 characters; full length 6744 characters._

### Arcane_Phase_6S_Typed_Expression_Integration/Arcane_Phase_5_14_Test_Results.txt

- Type: TXT
- SHA-256: `eff888743d48043d6347a42c7d4f34cae14e7e2ca7bca7acce2a6d00ac0fa3ac`
- Extracted characters: 401

```text
PASS	DRAS exists and remains provisional
PASS	SIMA exists and remains open
PASS	KWASH exists and remains open
PASS	BEK remains open
PASS	ZET remains open
PASS	KREN construction contract remains open
PASS	LABU is not canon
PASS	renamed canonical forms retained
PASS	canonical forms unique
PASS	all aliases avoid another canonical form
PASS	registry authority warns against promotion
RESULT: 11/11 PASS
```

### Arcane_Phase_6S_Typed_Expression_Integration/Arcane_Phase_5_15_Construction_Contract_Matrix.csv

- Type: CSV
- SHA-256: `df3fa1394b62ce087d320c8ac0fce0f30df08fed1288c59145c94dfe0449da84`
- Extracted characters: 4007

```text
item,contract,evidence,status,executable,gap
Construction/Expression split,"Construction says what mana configuration does; Expression computes values, targets, conditions, timing",Phase 4 §3 and subsystem comparison table,SOURCE-BACKED IN PHASE 4,NO,Bridge mapping from expression AST to complete construction instructions is not demonstrated
Construction order,reference → spatial role/vector → Feet → couplings → quantity → control → release,Phase 4 §3.3,SOURCE-BACKED ORDER; DETAILS OPEN,PARTIAL ORDER ONLY,"Slot cardinality, omission rules, scope and transitions are not fully formalised"
Foot shape,CVC: frame consonant + parameter vowel + relation coda,"Phase 4 §3.1, §10 and tests P4-T05/P4-T10",MECHANICAL SHAPE SOURCE-BACKED,TOKEN CHECK ONLY,Complete frame/coda inventory and full productive semantics need original v2.0 source
Frame inventory,"Six frame classes represented by canonical CV forms pa, ba, ta, da, ka, ga; v and z are not frame consonants",Phase 4 L-03; tests P4-T05/P4-T10,PHASE 4 DECISION,YES FOR TOKEN SHAPE,Frame semantic contrasts need original v2.0 definitions
Parameter vowels,a energy family; u motion; o extent; e structure/form; i information; ə baseline,Phase 4 §3.2,PROVISIONAL,NO SEMANTIC EXECUTION,Mappings are explicitly provisional; do not assign final meanings
Relation codas,Foot relation is encoded in coda position,Phase 4 §3.1 and hand-flame example,STRUCTURE SOURCE-BACKED; INVENTORY INCOMPLETE HERE,TOKEN SHAPE ONLY,Exact full coda-to-relation mapping not recoverable from supplied Phase 2/4 docs
Coupling syllables,"h + domain vowel: hə, he, ha, hu, hi, ho; coupling syllables are heavy",Phase 4 §3.2 and §3.3,MAPPING PROVISIONAL,NO PHYSICAL EXECUTION,Domain mappings and coupling vector remain provisional
TRAK macro,"Alter; voiceless-stop frame p, t
```

_Excerpt truncated at 1,800 characters; full length 4007 characters._

### Arcane_Phase_6S_Typed_Expression_Integration/Arcane_Phase_5_15_Construction_Contract_Recovery.md

- Type: MD
- SHA-256: `b84b260abd32d432d77c09b2db25c8872929c3f63749ebee924687d308c94a15`
- Extracted characters: 3490

```text
# Arcane Phase 5.15 — Construction Contract Recovery Matrix

**Status:** source-recovery audit; no canon promoted and no spell execution enabled.

## Purpose

Phases 5.10–5.14 built useful audit prototypes, but the full construction system is the principal blocker to an end-to-end compiler. This phase extracts only what the recovered Phase 2 and Phase 4 documents actually support, distinguishes structural rules from provisional semantics, and records the missing evidence.

## Key findings

1. Phase 4 defines a two-subsystem architecture: Construction (Feet, couplings, scoped references) and Expression (typed operators for values, targets, conditions and timing).
2. The construction ordering is stated as **reference → spatial role/vector → Feet → couplings → quantity → control → release**. This is an order statement, not a complete grammar.
3. A Foot is described as **frame + parameter vowel + relation coda**, with CVC shape. The Phase 4 lexical legality tests support shape checking, not full semantic execution.
4. Parameter-vowel mappings and h-domain coupling mappings are explicitly provisional. They must not be treated as locked physics.
5. KREN is explicitly proposed and needs owner confirmation. TRAK/BRAN are described more clearly, but their complete expansion contracts remain unavailable. FREM and SHREN appear in a worked example, which is not enough to establish all general cases. VARE is described as a soft-requirement modifier, but its conflict/failure semantics remain open.
6. The hand-flame sequence is tokenised but not fully specified: Phase 4 explicitly leaves energy magnitude, extent and matter coupling parameters unspecified and says no whole-spell grammar parse or feasibility test was run. It is therefore not a valid end-to-end demonstration.
7. The supp
```

_Excerpt truncated at 1,800 characters; full length 3490 characters._

### Arcane_Phase_6S_Typed_Expression_Integration/Arcane_Phase_5_15_Test_Results.txt

- Type: TXT
- SHA-256: `9c9782f315fe3fc49604500c361e57fbe28f09466c448fb016e876cd18f4ecc6`
- Extracted characters: 478

```text
PASS	matrix has unique item keys
PASS	construction-expression split recorded
PASS	construction order preserved
PASS	Foot shape does not claim full semantics
PASS	parameter vowel mapping remains provisional
PASS	coupling mapping remains provisional
PASS	KREN not promoted
PASS	worked example not executable
PASS	compiler bridge not demonstrated
PASS	missing v2.0 source gap explicit
PASS	all rows have evidence and gap
PASS	no row silently marks execution YES
RESULT: 12/12 PASS
```

### Arcane_Phase_6S_Typed_Expression_Integration/Arcane_Phase_5_16_Construction_Recovery.md

- Type: MD
- SHA-256: `4cb375f9e7eaf70cffa55e8443cd795f1dd3f60892fbb79b72d1725432b298fe`
- Extracted characters: 7843

```text
# ARCANE LANGUAGE AUDIT — PHASE 5.16
## Construction contract recovery and compiler-boundary specification

**Status:** Evidence-led recovery draft. No new lexical or morphological rule is promoted to canon in this phase.

## 1. Purpose

Phase 5.16 continues from the supplied `Arcana pack.zip`. Its task is to make the Construction subsystem implementable without pretending that the missing original v2.0 rules have been recovered.

The controlling architecture from Phase 4 is:

- **Expression system:** computes values, resolves references, selects targets and controls timing.
- **Construction system:** uses v2.0 Feet, couplings and scoped references to specify mana operations.
- **Compile bridge:** maps a semantically valid expression into a construction without changing its meaning.

This is a documented architecture. A complete parser and verified compiler bridge are not present in the recovered pack.

## 2. Evidence ledger

| ID | Evidence in recovered pack | Safe conclusion | Status |
|---|---|---|---|
| C-01 | Phase 4 §3.1 | Construction and Expression are separate subsystems. | CANON in Phase 4 |
| C-02 | Phase 4 §3.1 and lexicon tools | A Foot is one syllable with frame consonant + parameter vowel + optional relation coda. | Structural rule documented; semantics incomplete |
| C-03 | Phase 4 §3.3 | Intended performed order: reference, spatial role/vector, Feet, couplings, quantity, control, release. | Documented ordering; general parser unverified |
| C-04 | Phase 4 §3.3 | A reference persists until replaced. | Documented; exact scope transitions need tests |
| C-05 | Phase 4 §3.3 | `me` is described as SELF-surface; bare `MI`, `NI`, `RI` default to volume scope and perform as `mə`, `nə`, `rə`. | Documented; anatomical landmark inventory absent |
| C-06 | Phase 4
```

_Excerpt truncated at 1,800 characters; full length 7843 characters._

### Arcane_Phase_6S_Typed_Expression_Integration/Arcane_Phase_5_16_Construction_Recovery_Matrix.csv

- Type: CSV
- SHA-256: `74d11a2226b33a6f8905f8e3e04303090871bded9594b6d5d42f37d807b39fdb`
- Extracted characters: 1882

```text
id,topic,evidence,conclusion,status,implementation_action
C-01,Subsystem architecture,Phase 4 section 3.1,Expression and Construction are distinct subsystems,CANON,Represent as separate compiler stages
C-02,Foot shape,Phase 4 section 3.1 and lexicon tools,Frame plus parameter vowel plus optional relation coda,STRUCTURE DOCUMENTED,Parse shape only; do not infer semantics
C-03,Performed order,Phase 4 section 3.3,Reference then spatial role/vector then Feet then couplings then quantity then control then release,DOCUMENTED NOT GENERALLY TESTED,Add sequence validation and tests
C-04,Reference persistence,Phase 4 section 3.3,Reference persists until replaced,DOCUMENTED SCOPE NEEDS TESTS,Track context and test replacement
C-05,Reference scope,Phase 4 section 3.3,MI NI RI default volume scope; me described as SELF-surface,DOCUMENTED LANDMARKS MISSING,Do not invent landmark vocabulary
C-06,Parameter vowels,Phase 4 section 3.3,Property-family mapping is provisional,PROVISIONAL,Gate behind versioned profile
C-07,h coupling,Phase 4 section 3.3,Physical coupling mapping to h-domains is provisional,PROVISIONAL,Gate behind versioned profile
C-08,Hand-flame,Phase 4 sections 8-9,Tokenisation checked; full parse and feasibility not checked,INCOMPLETE,Report partial structure only
C-09,v2.0 rules,Recovery Audit and Decision Ledger D-006/D-007,Exact Foot coupling MEL KAN KEN KAS rules unavailable,UNRESOLVED,Recover source or propose replacement explicitly
C-10,Expression notation,Phase 2 sections 2 and 5,Angle-bracket notation is audit metalanguage,PROVISIONAL,Do not treat as spoken syntax
C-11,Validation coverage,Phase 4 section 9,Token checks do not prove whole-spell parsing or physical feasibility,GAP,Build parser and end-to-end tests
C-12,Vernacular,Phase 5 section 8,Vernacular tests d
```

_Excerpt truncated at 1,800 characters; full length 1882 characters._

### Arcane_Phase_6S_Typed_Expression_Integration/arcane_phase_5_17_harness.py

- Type: PY
- SHA-256: `f8ccf75d89f04f38d40374ce61e08c0d9e87ee918ffa13eb168bab98dfc3124e`
- Extracted characters: 8061

```text
#!/usr/bin/env python3
"""Arcane Phase 5.17 — evidence-bounded Construction test harness.

This deliberately does NOT pretend to parse or validate a complete spell. It tests
only rules that can be mechanically checked from the supplied Phase 4/5 lexicon
and the documented Construction contract. Unknown morphology is BLOCKED, not guessed.
Usage: python arcane_phase_5_17_harness.py [path/to/Arcane_Lexicon_v5_draft.csv]
"""
from __future__ import annotations
import csv, json, re, sys
from collections import Counter
from pathlib import Path

DEFAULT = Path(__file__).with_name('Arcane_Lexicon_v5_draft.csv')
STATUS = {'PASS':'PASS', 'FAIL':'FAIL', 'BLOCKED':'BLOCKED BY MISSING SPECIFICATION', 'NOT_TESTED':'NOT YET TESTED'}

class Test:
    def __init__(self, code, name, status, detail, evidence):
        self.code, self.name, self.status, self.detail, self.evidence = code, name, status, detail, evidence
    def as_dict(self):
        return {'id':self.code,'test':self.name,'status':STATUS[self.status],'detail':self.detail,'basis':self.evidence}

def load(path):
    with open(path, newline='', encoding='utf-8-sig') as f:
        rows = list(csv.DictReader(f))
    if not rows: raise ValueError('Lexicon CSV is empty')
    required = {'form','gloss','cls','status','source'}
    missing = required - set(rows[0])
    if missing: raise ValueError('Missing required CSV columns: '+', '.join(sorted(missing)))
    return rows

def run(path):
    rows = load(path)
    tests=[]
    forms=[r['form'].strip() for r in rows]
    nonempty=[x for x in forms if x]
    duplicates={f:n for f,n in Counter(nonempty).items() if n>1}
    duplicate_detail=[]
    for spelling, count in sorted(duplicates.items()):
        entries=[f"{r.get('gloss','')} [{r.get('cls','')}; {r.get('register','shared')}; {r
```

_Excerpt truncated at 1,800 characters; full length 8061 characters._

### Arcane_Phase_6S_Typed_Expression_Integration/Arcane_Phase_5_17_Report.md

- Type: MD
- SHA-256: `090dfe430034a5086682187ec95ac39812e5dfaced8cdfccd103c074f9b995cf`
- Extracted characters: 3762

```text
# Arcane Phase 5.17 — Construction Grammar Test Harness

**Status:** first executable baseline; not a complete parser and not a canon revision.  
**Input:** `Arcane_Lexicon_v5_draft.csv` from the supplied Arcana pack.  
**Purpose:** turn recovered, evidence-backed rules into reproducible checks while refusing to invent missing v2.0 morphology.

## Results

The test runner executes 13 checks. It distinguishes **PASS**, **FAIL**, **BLOCKED BY MISSING SPECIFICATION**, and **NOT YET TESTED**. Blocked and untested checks are never counted as passes.

The current run reports:

- **3 PASS** — form/gloss completeness, status provenance present, documented digit spellings present.
- **1 FAIL** — duplicate spellings exist in the combined lexicon.
- **6 BLOCKED** — reference persistence/replacement, Construction ordering, Foot morphology, canonical h-coupling mapping, expression-level numeral/unit validation.
- **3 NOT YET TESTED** — complete hand-flame typing/feasibility, physical mechanism/conservation checks, vernacular parser/listener validation.

See `Arcane_Phase_5_17_Test_Results.json` for the complete machine-readable run.

## Concrete finding: two homographs

The combined Phase 5 lexicon contains two duplicated forms:

| Form | Entry A | Entry B | Risk |
|---|---|---|---|
| `re` | `4` — DIGIT, Shared, CANON | `TARGET-surface` — FUSED-REF, Performed, CANON (v2.0) | In a performed sequence, an isolated `re` could be read as the digit or fused reference unless position/context is formally defined and enforced. |
| `ra` | `radian` — UNIT, Shared, CANON | `TARGET-path` — FUSED-REF, Performed, CANON (v2.0) | A quantity/unit position may help distinguish these, but this has not been demonstrated by a complete parser. |

These may be intended cross-system homographs, not necessar
```

_Excerpt truncated at 1,800 characters; full length 3762 characters._

### Arcane_Phase_6S_Typed_Expression_Integration/Arcane_Phase_5_17_Test_Results.json

- Type: JSON
- SHA-256: `6c2d266c4d24a7516ee40085f26d255b0c952807d1e43be013aea102e9ca453c`
- Extracted characters: 5772

```text
{
  "phase": "5.17",
  "title": "Construction Grammar Test Harness — evidence-bounded baseline",
  "input": "Arcane_Lexicon_v5_draft.csv",
  "tests_total": 13,
  "counts": {
    "PASS": 3,
    "FAIL": 1,
    "BLOCKED BY MISSING SPECIFICATION": 6,
    "NOT YET TESTED": 3
  },
  "scope_warning": "This is a baseline audit harness, not a complete Arcane parser. BLOCKED and NOT YET TESTED are not passes.",
  "results": [
    {
      "id": "P5.17-L01",
      "test": "Homographs are either disambiguated by a proven grammar or explicitly approved",
      "status": "FAIL",
      "detail": "255 non-empty entries; 2 duplicated spellings; ra: radian [UNIT; Shared; CANON] vs TARGET-path [FUSED-REF; Performed; CANON (v2.0)]; re: 4 [DIGIT; Shared; CANON] vs TARGET-surface [FUSED-REF; Performed; CANON (v2.0)]",
      "basis": "Direct exact-string check of the supplied Phase 5 lexicon CSV. Duplicate forms may be intentional, but no executable grammar test currently proves contextual disambiguation."
    },
    {
      "id": "P5.17-L02",
      "test": "Lexicon form and gloss are populated",
      "status": "PASS",
      "detail": "0 rows missing form or gloss",
      "basis": "Direct CSV completeness check; does not validate meaning."
    },
    {
      "id": "P5.17-L03",
      "test": "Lexicon status provenance remains visible",
      "status": "PASS",
      "detail": "Status counts: {\"CANON\": 76, \"CANON (v2.0)\": 12, \"CANON (v2.0), reinterpreted\": 5, \"CANON (v3.0-L), reinterpreted\": 3, \"PROPOSED\": 152, \"RENAMED\": 7}",
      "basis": "Checks only that each entry declares a status; does not promote proposals to canon."
    },
    {
      "id": "P5.17-N01",
      "test": "Canonical digit spellings are present",
      "status": "PASS",
      "detail": "All ten digit glosses map
```

_Excerpt truncated at 1,800 characters; full length 5772 characters._

### Arcane_Phase_6S_Typed_Expression_Integration/arcane_phase_5_18_audit.py

- Type: PY
- SHA-256: `e58c62b763494be989617a13d0b7da01cfefad5c1a4ea6c3b2b79c9f2e0560cb`
- Extracted characters: 6476

```text
#!/usr/bin/env python3
"""Phase 5.18: reproducible static audit of Phase 5 vernacular examples and merged lexicon.
This is a source-audit harness, not a full Arcane parser or a canon change.
"""
import ast, csv, json, sys
from collections import defaultdict
from pathlib import Path

BASE = Path(__file__).resolve().parent
LEX = Path(sys.argv[1]) if len(sys.argv) > 1 else BASE / 'Arcane_Lexicon_v5_draft.csv'
SRC = Path(sys.argv[2]) if len(sys.argv) > 2 else BASE / 'phase5_vernacular.py'

with LEX.open(encoding='utf-8-sig', newline='') as f:
    rows = list(csv.DictReader(f))
source = SRC.read_text(encoding='utf-8')
tree = ast.parse(source)

def assignment(name):
    for node in tree.body:
        if isinstance(node, (ast.Assign, ast.AnnAssign)):
            targets = node.targets if isinstance(node, ast.Assign) else [node.target]
            if any(isinstance(t, ast.Name) and t.id == name for t in targets):
                try: return ast.literal_eval(node.value)
                except Exception: return None
    return None

# Extract the concept keys from literal cl(..., [...]) declarations.
concept_keys = set()
for node in ast.walk(tree):
    if isinstance(node, ast.Call) and isinstance(node.func, ast.Name) and node.func.id == 'cl' and len(node.args) >= 3:
        try:
            items = ast.literal_eval(node.args[2])
            concept_keys.update(k for k, _ in items)
        except Exception:
            pass
shared = assignment('SHARED') or {}
alias = assignment('ALIAS') or {}
sentences = assignment('S') or []
idioms = assignment('IDIOMS') or []

results=[]
def add(test, status, detail, severity='blocking'):
    results.append({'test':test,'status':status,'detail':detail,'severity':severity})

# Required CSV columns and entry completeness.
required={'form','gloss',
```

_Excerpt truncated at 1,800 characters; full length 6476 characters._

### Arcane_Phase_6S_Typed_Expression_Integration/Arcane_Phase_5_18_Report.md

- Type: MD
- SHA-256: `b8d87fac4c3520005a65793e230d2b5c657dc49f7256e1b3ed54ae71c437508f`
- Extracted characters: 4988

```text
# Arcane Phase 5.18 — Vernacular Source Audit and Homograph Gate

**Status:** audit baseline complete; no canon changed. This is a static source/lexicon audit, not a complete parser, listener study, or physical spell validator.

## Inputs audited

- `Arcane_Lexicon_v5_draft.csv` (255 rows, from the supplied Arcana pack)
- `phase5_vernacular.py` (Phase 5 vernacular generator, sample sentences, and idioms)

## Recorded results

| Check | Result | Meaning |
|---|---|---|
| CSV schema | PASS | Required columns are present. |
| Lexical entry completeness | PASS | No blank form/gloss entries found. |
| Homograph inventory | PASS with review flag | Only `re` and `ra` are duplicated, matching the already documented cross-register pairs. This does **not** prove they are safe in execution. |
| `re` register separation | BLOCKED | A normative rule and enforcement test preventing unsafe mixed-register parsing are absent. |
| `ra` register separation | BLOCKED | A normative rule and enforcement test preventing unsafe mixed-register parsing are absent. |
| Sample sentence key coverage | PASS | All 25 source sentence fixtures refer to a declared key under the static inventory check. |
| Shared vocabulary targets | PASS | Shared mappings resolve to forms in the merged lexicon. |
| Fixture availability | PASS | The source includes 25 sentence fixtures and 5 idiom fixtures. |
| Naturalness/listener comprehension | NOT TESTED | Requires actual speakers/listeners and a recorded protocol. |
| Spoken unique parse | BLOCKED | The complete spoken grammar and register-boundary rules are not present. |

Counts: **6 PASS, 0 FAIL, 3 BLOCKED, 1 NOT TESTED.** PASS here only applies to the narrow static checks above; it does not imply the language is complete.

## Homograph findings

The source-backe
```

_Excerpt truncated at 1,800 characters; full length 4988 characters._

### Arcane_Phase_6S_Typed_Expression_Integration/Arcane_Phase_5_18_Results.json

- Type: JSON
- SHA-256: `e0aec5ca03e9b984735acacda0d914361238fbda28051010b17c198a44c07467`
- Extracted characters: 3055

```text
{
  "title": "Arcane Phase 5.18 static audit",
  "input_lexicon": "Arcane_Lexicon_v5_draft.csv",
  "input_source": "phase5_vernacular.py",
  "counts": {
    "PASS": 6,
    "FAIL": 0,
    "BLOCKED": 3,
    "NOT TESTED": 1
  },
  "results": [
    {
      "test": "P5.18-01 CSV schema",
      "status": "PASS",
      "detail": "255 rows; missing columns: []",
      "severity": "blocking"
    },
    {
      "test": "P5.18-02 Lexical entry completeness",
      "status": "PASS",
      "detail": "0 entries missing form/gloss; CSV line numbers: []",
      "severity": "blocking"
    },
    {
      "test": "P5.18-03 Homograph inventory",
      "status": "PASS",
      "detail": "2 duplicated spellings; 0 outside the documented review set. ra: radian (UNIT, Shared, CANON, source=v3.0-L) | TARGET-path (FUSED-REF, Performed, CANON (v2.0), source=v2.0); re: 4 (DIGIT, Shared, CANON, source=v3.0-L) | TARGET-surface (FUSED-REF, Performed, CANON (v2.0), source=v2.0)",
      "severity": "review"
    },
    {
      "test": "P5.18-04-ra Register separation",
      "status": "BLOCKED",
      "detail": "'ra' appears in registers ['Performed', 'Shared'] with statuses ['CANON', 'CANON (v2.0)']. Safety requires a normative rule preventing mixed-register executable parsing and a test showing it is enforced; CSV labels alone do not prove this.",
      "severity": "blocking"
    },
    {
      "test": "P5.18-04-re Register separation",
      "status": "BLOCKED",
      "detail": "'re' appears in registers ['Performed', 'Shared'] with statuses ['CANON', 'CANON (v2.0)']. Safety requires a normative rule preventing mixed-register executable parsing and a test showing it is enforced; CSV labels alone do not prove this.",
      "severity": "blocking"
    },
    {
      "test": "P5.18-05 Sentence fixture key
```

_Excerpt truncated at 1,800 characters; full length 3055 characters._

### Arcane_Phase_6S_Typed_Expression_Integration/Arcane_Phase_5_18_Run.txt

- Type: TXT
- SHA-256: `08d8e1f9aa87003e0178ece56767f8063e7fb26901fd35526a3b25efe45919f2`
- Extracted characters: 1868

```text
PASS       P5.18-01 CSV schema: 255 rows; missing columns: []
PASS       P5.18-02 Lexical entry completeness: 0 entries missing form/gloss; CSV line numbers: []
PASS       P5.18-03 Homograph inventory: 2 duplicated spellings; 0 outside the documented review set. ra: radian (UNIT, Shared, CANON, source=v3.0-L) | TARGET-path (FUSED-REF, Performed, CANON (v2.0), source=v2.0); re: 4 (DIGIT, Shared, CANON, source=v3.0-L) | TARGET-surface (FUSED-REF, Performed, CANON (v2.0), source=v2.0)
BLOCKED    P5.18-04-ra Register separation: 'ra' appears in registers ['Performed', 'Shared'] with statuses ['CANON', 'CANON (v2.0)']. Safety requires a normative rule preventing mixed-register executable parsing and a test showing it is enforced; CSV labels alone do not prove this.
BLOCKED    P5.18-04-re Register separation: 're' appears in registers ['Performed', 'Shared'] with statuses ['CANON', 'CANON (v2.0)']. Safety requires a normative rule preventing mixed-register executable parsing and a test showing it is enforced; CSV labels alone do not prove this.
PASS       P5.18-05 Sentence fixture key coverage: 25 sentence fixtures; 0 unresolved keys: []
PASS       P5.18-06 Shared vocabulary targets: 0 shared mappings do not point to a lexicon form: {}
PASS       P5.18-07 Source fixture availability: 29 AST-extracted concept keys (partial due dynamic declarations); 25 sentence fixtures; 5 idiom fixtures.
NOT TESTED P5.18-08 Naturalness / listener comprehension: Cannot be established by static source checks. Requires speakers/listeners and a recorded protocol.
BLOCKED    P5.18-09 Spoken unique-parse validation: No complete parser, authoritative register-switching rule, or spoken-boundary specification is present in this source package.
COUNTS {"PASS": 6, "FAIL": 0, "BLOCKED": 3, "NOT TESTED":
```

_Excerpt truncated at 1,800 characters; full length 1868 characters._

### Arcane_Phase_6S_Typed_Expression_Integration/Arcane_Phase_5_19_Report.md

- Type: MD
- SHA-256: `af3cf995f0cfb920c1b19a703c56714ed2466fd82a1d99c94193d90bc038f4fd`
- Extracted characters: 4924

```text
# Arcane Phase 5.19 — Register-Gating Audit

**Status:** source-backed lexical checks complete; register execution remains blocked. No spelling, grammar, or canonical rule has changed.

## Purpose

Phase 5.18 identified exactly two duplicated spellings in the merged Phase 5 lexicon: `re` and `ra`. Phase 5.19 tests what the current source can prove about those entries and explicitly separates lexical evidence from grammatical behaviour. This is not a parser and does not claim that either collision is safe in speech or execution.

## Inputs

- `Arcane_Lexicon_v5_draft.csv` (the merged Phase 5 lexicon from the supplied archive)
- Phase 5.18 report and results, retained as regression context
- `arcane_phase_5_19_register_gate.py` (new repeatable harness)

## Results

| Test | Status | Finding |
|---|---|---|
| RG-01 Shared digit `re` | PASS | Exactly one `re = 4` DIGIT entry in Shared, source `v3.0-L`. |
| RG-02 Performed target-surface `re` | BLOCKED | The v2.0 FUSED-REF entry exists, but slot grammar, fusion decomposition, and legal host construction are not recovered. |
| RG-03 Shared unit `ra` | PASS | Exactly one `ra = radian` UNIT entry in Shared, source `v3.0-L`. |
| RG-04 Performed target-path `ra` | BLOCKED | The v2.0 FUSED-REF entry exists, but slot grammar, fusion decomposition, and legal host construction are not recovered. |
| RG-05 Mixed-register rejection | BLOCKED | Candidate safety rule only; no recovered normative register-transition rule. Do not treat as canon. |
| RG-06 Reject multiple parses | BLOCKED | The Unique Parse Requirement is canonical, but there is no complete parser/surface grammar to execute this test. |
| RG-07 Homograph provenance | PASS | Both readings of both collisions have distinct gloss, register, and source metadata. |
| RG-08 Duplic
```

_Excerpt truncated at 1,800 characters; full length 4924 characters._

### Arcane_Phase_6S_Typed_Expression_Integration/Arcane_Phase_5_19_Results.json

- Type: JSON
- SHA-256: `b96f457f0f25da609cc5035418b9872542aabdfac5168568b0e593fc33e0373e`
- Extracted characters: 2773

```text
{
  "title": "Arcane Phase 5.19 Register-Gating Audit",
  "input_lexicon": "Arcane_Lexicon_v5_draft.csv",
  "counts": {
    "PASS": 4,
    "FAIL": 0,
    "BLOCKED": 4,
    "NOT TESTED": 0
  },
  "results": [
    {
      "test": "RG-01 Shared digit re",
      "status": "PASS",
      "kind": "evidence",
      "detail": "Expected exactly one source-backed Shared digit entry re=4; found 1"
    },
    {
      "test": "RG-02 Performed target-surface re",
      "status": "BLOCKED",
      "kind": "specification",
      "detail": "Lexical entry is present, but its slot grammar, fusion decomposition, and legal host construction are not recoverable from the current source package."
    },
    {
      "test": "RG-03 Shared unit ra",
      "status": "PASS",
      "kind": "evidence",
      "detail": "Expected exactly one source-backed Shared radian entry ra; found 1"
    },
    {
      "test": "RG-04 Performed target-path ra",
      "status": "BLOCKED",
      "kind": "specification",
      "detail": "Lexical entry is present, but its slot grammar, fusion decomposition, and legal host construction are not recoverable from the current source package."
    },
    {
      "test": "RG-05 Mixed-register rejection",
      "status": "BLOCKED",
      "kind": "owner-decision",
      "detail": "Proposed safety rule only. No recovered normative register-transition rule exists; do not enforce as canon until owner adjudication and source review."
    },
    {
      "test": "RG-06 Reject multiple executable parses",
      "status": "BLOCKED",
      "kind": "implementation",
      "detail": "Unique Parse Requirement is canonical, but no complete parser or surface grammar is included to construct and execute competing-parse fixtures."
    },
    {
      "test": "RG-07 Homograph provenance completenes
```

_Excerpt truncated at 1,800 characters; full length 2773 characters._

### Arcane_Phase_6S_Typed_Expression_Integration/Arcane_Phase_5_20_Report.md

- Type: MD
- SHA-256: `de007576739b53e23296f0175104ac175064b6dc083aa93eae18c7a72522849a`
- Extracted characters: 7298

```text
# Arcane Phase 5.20 — Source Recovery and Homograph Evidence Matrix

**Status:** historical evidence recovered in Phase 4 material; two lexical collision cases can now be narrowed, but full spoken-parser conformance is still blocked. No canon changed.

## Executive result

The archive does contain relevant v2.0-derived material: `Arcane_Language_Audit_Phase_4.docx` (especially §§3.3, 6, 8–10 and decision L-10/D-034), its extracted text, and `phase4 finalize.pdf` plus its source script. Phase 5.19's wording that the construction rules were not recoverable from the current source package was too broad. The better conclusion is **partially recovered**: fused forms and their intended role are documented, but the complete original v2.0 reference table and full executable grammar are not present as an authoritative original v2.0 source.

## Evidence matrix

| Question | Evidence found | Status | What it supports / does not support |
|---|---|---|---|
| What are `re` and `ra` in Performed Arcana? | Phase 4 §3.3 says reference+scope compresses to one syllable; §10 says declared slot-resolved homophones. The Phase 4 lexicon generator defines `re = TARGET-surface`, `ra = TARGET-path`. | RECOVERED IN PHASE 4 CONSOLIDATION | Intended Performed readings are supported by the consolidation. It is not the raw v2.0 source itself. |
| How are references ordered? | §3.3: Performed order starts with reference, then spatial role/vector, Feet, couplings, quantity, control, release; reference persists until replaced. §8 hand-flame example starts `mel`. | RECOVERED IN PHASE 4 CONSOLIDATION | Supports reference slot at clause/construction start and persistence. Exact scope and clause-boundary parser rules still need formalisation. |
| Are `re` and `ra` safe because of register labels alone? | P
```

_Excerpt truncated at 1,800 characters; full length 7298 characters._

### Arcane_Phase_6S_Typed_Expression_Integration/Arcane_Phase_5_20_Results.json

- Type: JSON
- SHA-256: `7ab87138591049f8025f11c6ee12e9c566fd78e452814dcf0cd6e452b7983197`
- Extracted characters: 1596

```text
{
  "title": "Arcane Phase 5.20 Source Recovery and Homograph Evidence Matrix",
  "counts": {
    "RECOVERED/PASS": 4,
    "PARTIALLY RECOVERED": 4,
    "BLOCKED/UNRESOLVED": 3,
    "CANON CHANGED": 0
  },
  "key_correction": "Phase 5.19 overstated source absence. Phase 4 consolidation documents fused readings and construction order, but the raw original v2.0 source and complete parser remain unavailable.",
  "findings": [
    {
      "item": "re Performed",
      "status": "PARTIALLY RECOVERED",
      "evidence": "Phase 4 \u00a73.3, \u00a78, \u00a710 and lexicon generator: TARGET-surface; reference starts construction and persists until replaced."
    },
    {
      "item": "ra Performed",
      "status": "PARTIALLY RECOVERED",
      "evidence": "Phase 4 fused-reference inventory and generator: TARGET-path; slot-resolved homophone."
    },
    {
      "item": "Shared re digit / ra radian",
      "status": "PASS",
      "evidence": "Phase 5 CSV, v3.0-L."
    },
    {
      "item": "Mixed-register prohibition",
      "status": "UNRESOLVED",
      "evidence": "Phase 5 G-V1 bars vernacular inside construction clauses, but Phase 4 example uses Shared numerals/units in Performed construction."
    },
    {
      "item": "Whole spoken unique parse",
      "status": "BLOCKED",
      "evidence": "Phase 4 \u00a78-9 explicitly says whole-spell grammar parse/full parser not done."
    },
    {
      "item": "Parameter-vowel and h-domain mappings",
      "status": "PROVISIONAL",
      "evidence": "Phase 4 \u00a73.3 labels mappings provisional."
    }
  ],
  "canon_changed": false
}
```

### Arcane_Phase_6S_Typed_Expression_Integration/arcane_phase_5_21_fixtures 2.py

- Type: PY
- SHA-256: `8d6286dd1acfa29533bda1797fa4c0ebbdc2bf60fc6fc08365e4d867fe78c64b`
- Extracted characters: 5173

```text
#!/usr/bin/env python3
"""Evidence-bounded Arcane Phase 5.21 fixture validator.

This is intentionally NOT a complete Arcane parser. It validates only documented
lexical readings, the exact Phase 4 hand-flame token sequence, and whether a
caller supplied a declared lexical slot. It never infers undocumented grammar.
"""
import csv, json
from pathlib import Path

ROOT = Path(__file__).resolve().parent
LEXICON = ROOT / 'Arcane_Lexicon_v5_draft.csv'
EXPECTED_HAND_FLAME = [
    'mel', 'po', 'da', 'za-shi-to-za', 'ma',
    'kan', 'ken', 'he', 'ha', 'sa-shi-za', 'se', 'kas'
]

with LEXICON.open(encoding='utf-8-sig', newline='') as f:
    rows = list(csv.DictReader(f))

def entries(form):
    return [r for r in rows if r.get('form', '').strip().lower() == form.lower()]

def resolve(form, slot):
    """Resolve only when the explicitly supplied slot matches one inventory row."""
    candidates = [r for r in entries(form) if r.get('cls', '').strip().upper() == slot.upper()]
    if len(candidates) == 1:
        return {'status': 'PASS', 'form': form, 'slot': slot,
                'gloss': candidates[0].get('gloss'), 'register': candidates[0].get('register')}
    if not candidates:
        return {'status': 'REJECT', 'form': form, 'slot': slot,
                'reason': 'No lexicon entry for this form in the explicitly supplied slot.'}
    return {'status': 'BLOCKED', 'form': form, 'slot': slot,
            'reason': 'More than one candidate remains in this slot.'}

results = []
# Lexical provenance checks
for form, cls, gloss in [('re', 'DIGIT', '4'), ('ra', 'UNIT', 'radian'),
                         ('re', 'FUSED-REF', 'TARGET-surface'),
                         ('ra', 'FUSED-REF', 'TARGET-path')]:
    found = [r for r in entries(form) if r.get('cls', '').strip().upper() == cls]
```

_Excerpt truncated at 1,800 characters; full length 5173 characters._

### Arcane_Phase_6S_Typed_Expression_Integration/Arcane_Phase_5_21_Report.md

- Type: MD
- SHA-256: `b98a239eb994a7b1ed971eb33322f276c09ab563ac6ff27435d0ac50d981ffc5`
- Extracted characters: 5849

```text
# Arcane Phase 5.21 — Evidence-Bounded Construction Conformance Fixtures

**Status:** fixture validation executed. **Canon changed:** no. **General parser:** not implemented.

## 1. Result

The validator completed **11 PASS, 0 FAIL, 3 BLOCKED** checks. These results apply only to the narrowly defined fixtures below. They do not establish that Performed Arcana as a whole has a unique parse.

| Result | Count | Interpretation |
|---|---:|---|
| PASS | 11 | The four lexical records match their expected source-backed readings; four explicit-slot lookups resolve; two no-slot checks preserve ambiguity; the documented hand-flame transcription matches its token sequence. |
| FAIL | 0 | No assertion inside this limited fixture suite failed. |
| BLOCKED | 3 | Tests requiring a complete construction grammar or universal register rule cannot responsibly be decided from current evidence. |

## 2. Tests run

| Test | Status | What was actually tested |
|---|---|---|
| P521-LEX-re-DIGIT | PASS | Lexicon contains `re` / DIGIT / `4`. |
| P521-LEX-ra-UNIT | PASS | Lexicon contains `ra` / UNIT / `radian`. |
| P521-LEX-re-FUSED-REF | PASS | Lexicon contains `re` / FUSED-REF / `TARGET-surface`. |
| P521-LEX-ra-FUSED-REF | PASS | Lexicon contains `ra` / FUSED-REF / `TARGET-path`. |
| P521-SLOT-01 | PASS | Given the DIGIT slot, `re` resolves to `4`. |
| P521-SLOT-02 | PASS | Given the FUSED-REF slot, `re` resolves to `TARGET-surface`. |
| P521-SLOT-03 | PASS | Given the UNIT slot, `ra` resolves to `radian`. |
| P521-SLOT-04 | PASS | Given the FUSED-REF slot, `ra` resolves to `TARGET-path`. |
| P521-AMB-01 | PASS | Without a slot, the lookup exposes multiple readings for `re`; it does not guess. |
| P521-AMB-02 | PASS | Without a slot, the lookup exposes multiple readings for `ra`; it does not
```

_Excerpt truncated at 1,800 characters; full length 5849 characters._

### Arcane_Phase_6S_Typed_Expression_Integration/Arcane_Phase_5_21_Results.json

- Type: JSON
- SHA-256: `ac1d7ba0338ce71b822f4127dd8287b99089c645c134174b27e6d1a6bec92355`
- Extracted characters: 3890

```text
{
  "phase": "5.21",
  "title": "Evidence-bounded construction conformance fixtures",
  "scope": "Lexical provenance, declared-slot lookup, ambiguity visibility, and transcription check only.",
  "is_general_parser": false,
  "canon_changed": false,
  "counts": {
    "PASS": 11,
    "FAIL": 0,
    "BLOCKED": 3,
    "REJECT": 0
  },
  "results": [
    {
      "id": "P521-LEX-re-DIGIT",
      "status": "PASS",
      "expected": {
        "form": "re",
        "class": "DIGIT",
        "gloss": "4"
      },
      "matches": 1
    },
    {
      "id": "P521-LEX-ra-UNIT",
      "status": "PASS",
      "expected": {
        "form": "ra",
        "class": "UNIT",
        "gloss": "radian"
      },
      "matches": 1
    },
    {
      "id": "P521-LEX-re-FUSED-REF",
      "status": "PASS",
      "expected": {
        "form": "re",
        "class": "FUSED-REF",
        "gloss": "TARGET-surface"
      },
      "matches": 1
    },
    {
      "id": "P521-LEX-ra-FUSED-REF",
      "status": "PASS",
      "expected": {
        "form": "ra",
        "class": "FUSED-REF",
        "gloss": "TARGET-path"
      },
      "matches": 1
    },
    {
      "id": "P521-SLOT-01",
      "status": "PASS",
      "detail": {
        "status": "PASS",
        "form": "re",
        "slot": "DIGIT",
        "gloss": "4",
        "register": "Shared"
      }
    },
    {
      "id": "P521-SLOT-02",
      "status": "PASS",
      "detail": {
        "status": "PASS",
        "form": "re",
        "slot": "FUSED-REF",
        "gloss": "TARGET-surface",
        "register": "Performed"
      }
    },
    {
      "id": "P521-SLOT-03",
      "status": "PASS",
      "detail": {
        "status": "PASS",
        "form": "ra",
        "slot": "UNIT",
        "gloss": "radian",
        "register": "Shared"
      }
```

_Excerpt truncated at 1,800 characters; full length 3890 characters._

### Arcane_Phase_6S_Typed_Expression_Integration/arcane_phase_5_22_parser.py

- Type: PY
- SHA-256: `8041e7e40cd6e152aa9d38982e2a8986515a1aa7bc315dbfc1e7065e72ee2905`
- Extracted characters: 8612

```text
#!/usr/bin/env python3
"""Arcane Phase 5.22: bounded construction parser.

Parses only the documented Phase 4 hand-flame construction profile. This is not
a general Arcane parser and does not infer omitted grammar. Middle dots are
required phrase boundaries in this fixture profile. No physical feasibility is assessed.
"""
from dataclasses import dataclass, asdict
from pathlib import Path
import json, sys

DIGITS = {'za':0,'ki':1,'to':2,'mu':3,'re':4,'sa':5,'fi':6,'du':7,'go':8,'pe':9}
UNITS = {'ma':'metre','se':'second','ke':'kilogram','ra':'radian','ku':'kelvin','sho':'dimensionless'}
AXES = {'pa':'-X','ba':'+X','ta':'-Y','da':'+Y','ka':'-Z','ga':'+Z'}
ROLES = {'po':'position'}
COUPLINGS = {'he':'matter/mechanical-or-chemical domain (provisional)','ha':'energy/thermal domain (provisional)','ho':'electromagnetic domain (provisional)','hu':'biological domain (provisional)','hi':'informational domain (provisional)','hə':'mana-only domain (provisional)'}
# Phase 4 calls these construction Feet; the semantic interpretation is deliberately conservative.
FEET = {'kan':{'alias':'TRAK ENRA','status':'documented example-level alias'},
         'ken':{'alias':'FREM / structure held','status':'documented example-level alias'},
         'kas':{'alias':'SHREN / release','status':'documented example-level alias'}}
EXPECTED = 'mel · po da za shi to za ma · kan ken · he ha · sa shi za se · kas'

class ParseError(ValueError):
    def __init__(self, code, message): self.code=code; self.message=message; super().__init__(f'{code}: {message}')

def parse_quantity(tokens):
    """Parse digits [shi fractional digits] unit. Returns exact decimal text + unit."""
    if not tokens: raise ParseError('E-QTY-EMPTY','Quantity is empty.')
    if tokens[-1] not in UNITS: raise ParseError('E-QTY-UNIT',
```

_Excerpt truncated at 1,800 characters; full length 8612 characters._

### Arcane_Phase_6S_Typed_Expression_Integration/Arcane_Phase_5_22_Report.md

- Type: MD
- SHA-256: `e4e29b0e39e29d8d778613a798ba817dd5645da1caaea74d782b53160f598fe6`
- Extracted characters: 4558

```text
# Arcane Phase 5.22 — Bounded Construction Parser

**Status:** first parser implemented for one documented construction profile. **Canon changed:** no. **General parser:** still not implemented.

## Outcome

The parser accepts the recovered Phase 4 hand-flame transcription only under a deliberately narrow profile. It returns a structured parse tree and rejects malformed variants with explicit error codes. It does not infer missing grammar or interpret a rejection as proof that the utterance is invalid in every possible Arcane construction.

Automated test run: **17 PASS, 0 FAIL, 17 total**.

## What it parses

`mel · po da za shi to za ma · kan ken · he ha · sa shi za se · kas`

The tree records:

- `mel` as the documented anchor token, with its full landmark semantics explicitly unresolved;
- `po da za shi to za ma` as a position role, +Y axis and a metre-closed quantity;
- `kan ken` as the documented example Foot sequence;
- `he ha` as the documented coupling sequence, retaining provisional domain interpretations;
- `sa shi za se` as a duration quantity in seconds;
- `kas` as the release token.

The quantity parser enforces Phase 4 G-2: a numeral ends in a unit; decimal separator `shi` requires digits on both sides; unknown digits and multiple decimal separators are rejected. The profile enforces metre for its position quantity and seconds for its duration quantity.

## Critical boundary

This is a **fixture-profile parser**, not the general Arcane grammar. It currently recognises one exact six-phrase construction profile. It does not prove all Performed Arcana can be parsed, does not implement all formal typed expressions, and does not evaluate physical feasibility. Unknown or unsupported construction patterns receive explicit errors instead of a guessed parse.

A pr
```

_Excerpt truncated at 1,800 characters; full length 4558 characters._

### Arcane_Phase_6S_Typed_Expression_Integration/Arcane_Phase_5_22_Results.json

- Type: JSON
- SHA-256: `71c2559dc4463e2c731008795838db5f845e0258c5206ecee5597be9b5a18007`
- Extracted characters: 2574

```text
{
  "phase": "5.22",
  "summary": {
    "passed": 17,
    "failed": 0,
    "total": 17
  },
  "tests": [
    {
      "test": "valid canonical fixture",
      "expected": "accept",
      "actual": "PARSED_SUBSET",
      "status": "PASS"
    },
    {
      "test": "missing phrase",
      "expected": "E-PHRASE-COUNT",
      "actual": "E-PHRASE-COUNT",
      "status": "PASS"
    },
    {
      "test": "empty phrase",
      "expected": "E-EMPTY-PHRASE",
      "actual": "E-EMPTY-PHRASE",
      "status": "PASS"
    },
    {
      "test": "unknown anchor",
      "expected": "E-ANCHOR",
      "actual": "E-ANCHOR",
      "status": "PASS"
    },
    {
      "test": "unknown role",
      "expected": "E-SPATIAL",
      "actual": "E-SPATIAL",
      "status": "PASS"
    },
    {
      "test": "unknown axis",
      "expected": "E-SPATIAL",
      "actual": "E-SPATIAL",
      "status": "PASS"
    },
    {
      "test": "quantity missing unit",
      "expected": "E-QTY-UNIT",
      "actual": "E-QTY-UNIT",
      "status": "PASS"
    },
    {
      "test": "bad digit",
      "expected": "E-QTY-DIGIT",
      "actual": "E-QTY-DIGIT",
      "status": "PASS"
    },
    {
      "test": "bad decimal no whole digits",
      "expected": "E-QTY-DECIMAL",
      "actual": "E-QTY-DECIMAL",
      "status": "PASS"
    },
    {
      "test": "bad decimal no fractional digits",
      "expected": "E-QTY-DECIMAL",
      "actual": "E-QTY-DECIMAL",
      "status": "PASS"
    },
    {
      "test": "multiple decimals",
      "expected": "E-QTY-DECIMAL",
      "actual": "E-QTY-DECIMAL",
      "status": "PASS"
    },
    {
      "test": "wrong position unit",
      "expected": "E-POSITION-UNIT",
      "actual": "E-POSITION-UNIT",
      "status": "PASS"
    },
    {
      "test": "wrong foot profile",
      "expec
```

_Excerpt truncated at 1,800 characters; full length 2574 characters._

### Arcane_Phase_6S_Typed_Expression_Integration/arcane_phase_5_24.py

- Type: PY
- SHA-256: `2d5fbd22725130ae538d26941fc1db58ed1f5e78277483a87933526cbfa59f0b`
- Extracted characters: 11344

```text
#!/usr/bin/env python3
"""Arcane Phase 5.24: diagnostic binding/symbol semantics prototype.

Audit notation only; this is not the canonical spoken surface grammar or a spell engine.
Supported forms:
  KI / TO / MU ...             canonical digit tokens (0..9)
  NAME                         named external input from `inputs`
  OP⟨arg, arg⟩                 nested expression
  KWAM⟨NAME, expression⟩       declare a binding; capture current value
  KWAT⟨NAME⟩                   read captured value
  KWAK⟨NAME⟩                   re-evaluate the binding's defining expression

A binding declaration stores both the captured value and its defining expression.
KWAT reads the captured value; KWAK evaluates the definition against current inputs.
This is an explicit PROVISIONAL convention for testing, not a recovered historical rule.
"""
from __future__ import annotations
from dataclasses import dataclass
import argparse, json, re
from typing import Any

DIGITS = {'ZA':0,'KI':1,'TO':2,'MU':3,'RE':4,'SA':5,'FI':6,'DU':7,'GO':8,'PE':9}
UNITS = {'MA': (('L',1),), 'SE': (('T',1),), 'KE': (('M',1),), 'RA': (), 'KU': (('TEMP',1),)}

class ArcaneError(Exception): pass
class ParseError(ArcaneError): pass
class NameResolutionError(ArcaneError): pass
class TypeCheckError(ArcaneError): pass
class EvaluationError(ArcaneError): pass

@dataclass(frozen=True)
class Quantity:
    value: float
    dim: tuple[tuple[str,int], ...] = ()
    def __str__(self): return f"{self.value:g} [{dimstr(self.dim)}]"

def dimstr(d):
    if not d: return '1'
    return '·'.join(k if p == 1 else f'{k}^{p}' for k,p in d)

def normdim(d): return tuple(sorted((k,p) for k,p in d.items() if p))
def combine(a,b,sign=1):
    x=dict(a); y=dict(b)
    for k,p in y.items(): x[k]=x.get(k,0)+sign*p
    return normdim(x)

@datacla
```

_Excerpt truncated at 1,800 characters; full length 11344 characters._

### Arcane_Phase_6S_Typed_Expression_Integration/Arcane_Phase_5_5_Source_Reconciliation.md

- Type: MD
- SHA-256: `989cecda962d1a295f2b7fd678c78239c51415273bfe408b6f52e19058397c34`
- Extracted characters: 5755

```text
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

Phase 2 test expect
```

_Excerpt truncated at 1,800 characters; full length 5755 characters._

### Arcane_Phase_6S_Typed_Expression_Integration/Arcane_Phase_5_6_Alias_and_Operator_Audit.md

- Type: MD
- SHA-256: `e883f4c8d71cab8fb79a328bf3eaa76ef731fea71994a63cc05b59751dc935f6`
- Extracted characters: 5426

```text
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

The compatibility layer should resolve legacy sp
```

_Excerpt truncated at 1,800 characters; full length 5426 characters._

### Arcane_Phase_6S_Typed_Expression_Integration/Arcane_Phase_5_7_Grammar_Resolver_Validation.md

- Type: MD
- SHA-256: `84ab32c98e192981c42f25994ebd843653309f8e4fb4a0ba588bf5112cfb153e`
- Extracted characters: 4514

```text
# Arcane Phase 5.7 — Grammar and Resolver Validation

**Status:** provisional reference-harness validation; canon unchanged  
**Run date:** 2026-10-12  
**Regression result:** 15/15 checks passed  
**Important boundary:** this is a small reference validator for the audit notation `OPERATOR⟨arguments⟩`, not a complete Arcane parser, compiler, or mana execution engine.

## 1. Purpose

Phase 5.7 moves from checking lexicon/alias tables to checking a narrow subset of operator-expression behavior. The harness checks alias normalization, fixed arity, coarse input types, nesting, malformed notation, and safe rejection of unknown signatures.

The audit notation with angle brackets and commas is temporary formal notation; it is not claimed to be ordinary spoken or written Arcane surface syntax.

## 2. Results

| Test category | Result |
|---|---:|
| Legacy aliases resolve to preferred operator heads | 6/6 relevant cases passed |
| Arity enforcement | 2/2 passed |
| Coarse type enforcement | 3/3 passed |
| Nested expression handling | 1/1 passed |
| Malformed syntax rejection | 1/1 passed |
| Unknown/incomplete signature rejection | 2/2 passed |
| **Total** | **15/15 passed** |

The exact run log is included as `Arcane_Phase_5_7_Test_Results.txt`.

## 3. Covered examples

- `FRATA⟨Q:length, Q:length⟩` resolves to the preferred head `FRAJA`.
- `FRAKA⟨Q:length, Q:time⟩` resolves to `FRAMA` and passes the broad Quantity type check. This does **not** assert that any particular units or semantic kinds are valid for multiplication.
- `DRIM⟨V:3d, V:3d⟩` resolves to `DRUM`; the Phase 4 D-017 rule is noted but its physical component formula is not executed by this harness.
- `GRAK⟨Boolean⟩` resolves to `GRASH`.
- `DRAL⟨Comparable, Comparable, Criterion⟩` resolves to `DRAS`; criterion sema
```

_Excerpt truncated at 1,800 characters; full length 4514 characters._

### Arcane_Phase_6S_Typed_Expression_Integration/Arcane_Phase_5_7_Test_Cases.csv

- Type: CSV
- SHA-256: `4f2cbeb16e2084712f877959d28d534e38418cf1e9ae6f9fdb0787e630382943`
- Extracted characters: 1071

```text
test_id,category,input,expected,status
P5.7-001,alias,FRATA⟨Q:length; Q:length⟩,resolve to FRAJA,pass
P5.7-002,preferred head,FRAJA⟨Q:length; Q:length⟩,accept as Quantity,pass
P5.7-003,alias,FRAKA⟨Q:length; Q:time⟩,resolve to FRAMA,pass
P5.7-004,alias,DRIM⟨V:3d; V:3d⟩,resolve to DRUM,pass
P5.7-005,alias,GRAK⟨Boolean⟩,resolve to GRASH,pass
P5.7-006,alias,DRAL⟨Comparable; Comparable; Criterion⟩,resolve to DRAS,pass
P5.7-007,arity,FRAPA⟨Q:length⟩,reject missing argument,pass
P5.7-008,arity,FRAPA⟨Q:length; Q:length; Q:length⟩,reject extra argument,pass
P5.7-009,type,FRAPA⟨Boolean; Q:length⟩,reject Boolean operand,pass
P5.7-010,type,GRASH⟨Q:length⟩,reject non-Boolean,pass
P5.7-011,type,DRUM⟨V:2d; V:2d⟩,reject non-3D vectors,pass
P5.7-012,nesting,GRASH⟨DRAL⟨Comparable; Comparable; Criterion⟩⟩,accept nested Boolean expression,pass
P5.7-013,syntax,FRAPA⟨Q:length; Q:length, reject unclosed expression,pass
P5.7-014,unknown signature,BEN⟨Q:length⟩,reject unregistered operator signature,pass
P5.7-015,unknown atom,BEN,reject as unknown typed atom in this harness,pass
```

### Arcane_Phase_6S_Typed_Expression_Integration/Arcane_Phase_5_7_Test_Results.txt

- Type: TXT
- SHA-256: `38a94bf2a67f58f33f38ee23739a771b4e9a1cdb6c046ca3a70c7d8db8a6ef99`
- Extracted characters: 2811

```text
PASS | legacy subtraction alias resolves | FRATA⟨Q:length, Q:length⟩ | ACCEPTED as Quantity; canonical operator FRAJA; Subtraction; operand order is significant.; quantity dimensions/kinds and coordinate-frame compatibility are not fully checked by this harness
PASS | preferred subtraction form accepted | FRAJA⟨Q:length, Q:length⟩ | ACCEPTED as Quantity; canonical operator FRAJA; Subtraction; operand order is significant.; quantity dimensions/kinds and coordinate-frame compatibility are not fully checked by this harness
PASS | legacy multiplication alias resolves | FRAKA⟨Q:length, Q:time⟩ | ACCEPTED as Quantity; canonical operator FRAMA; Multiplication; dimensional algebra required.; quantity dimensions/kinds and coordinate-frame compatibility are not fully checked by this harness
PASS | legacy cross-product alias resolves | DRIM⟨V:3d, V:3d⟩ | ACCEPTED as Vector3; canonical operator DRUM; Cross product; Phase 4 D-017 frame rule applies.; quantity dimensions/kinds and coordinate-frame compatibility are not fully checked by this harness
PASS | legacy NOT alias resolves | GRAK⟨Boolean⟩ | ACCEPTED as Boolean; canonical operator GRASH; Provisional NOT signature.; quantity dimensions/kinds and coordinate-frame compatibility are not fully checked by this harness
PASS | legacy compare alias resolves | DRAL⟨Comparable, Comparable, Criterion⟩ | ACCEPTED as Boolean; canonical operator DRAS; Criterion encoding remains unresolved.; quantity dimensions/kinds and coordinate-frame compatibility are not fully checked by this harness
PASS | missing FRAPA argument rejected | FRAPA⟨Q:length⟩ | REJECTED: FRAPA expects 2 argument(s), received 1
PASS | extra FRAPA argument rejected | FRAPA⟨Q:length, Q:length, Q:length⟩ | REJECTED: FRAPA expects 2 argument(s), received 3
PASS | wrong FRAPA typ
```

_Excerpt truncated at 1,800 characters; full length 2811 characters._

### Arcane_Phase_6S_Typed_Expression_Integration/Arcane_Phase_5_8_Test_Cases.csv

- Type: CSV
- SHA-256: `559a2431efc7bae28617ce707fbca9a95d006071cdd7dd4d082c7d745a354bb4`
- Extracted characters: 1329

```text
test_id,category,input,expected_result,execution_status
P5.8-001,arithmetic,"FRAPA⟨Q[length],Q[length]⟩",accept; output Q[length],PASS
P5.8-002,arithmetic,"FRAPA⟨Q[length],Q[time]⟩",reject dimension mismatch,PASS
P5.8-003,alias,"FRATA⟨Q[time],Q[time]⟩",resolve to FRAJA,PASS
P5.8-004,dimensional algebra,"FRAKA⟨Q[length],Q[length]⟩",output Q[area],PASS
P5.8-005,dimensional algebra,"FRALA⟨Q[length],Q[time]⟩",output Q[velocity],PASS
P5.8-006,vector,DRAN⟨V3[length;world]⟩,output Q[length],PASS
P5.8-007,dot product,"DREM⟨V3[length;world],V3[velocity;world]⟩",output Q[L^2 T^-1],PASS
P5.8-008,frame,"DREM⟨V3[length;world],V3[length;caster]⟩",reject frame mismatch,PASS
P5.8-009,cross product,"DRIM⟨V3[length;world],V3[length;world]⟩",output V3[area;world],PASS
P5.8-010,frame,"DRUM⟨V3[length;world],V3[length;caster]⟩",reject frame mismatch,PASS
P5.8-011,type,"DRUM⟨Q[length],Q[length]⟩",reject non-vector inputs,PASS
P5.8-012,nesting,"FRAPA⟨DRAN⟨V3[length;world]⟩,Q[length]⟩",accept nested expression,PASS
P5.8-013,comparison,"DRAL⟨Q[length],Q[length],Criterion⟩",output Bool,PASS
P5.8-014,comparison,"DRAS⟨Q[length],Q[time],Criterion⟩",reject incompatible operands,PASS
P5.8-015,unknown signature,BEN⟨Q[length]⟩,reject unknown operator signature,PASS
P5.8-016,syntax,"FRAPA⟨Q[length],Q[length]",reject malformed expression,PASS
```

### Arcane_Phase_6S_Typed_Expression_Integration/Arcane_Phase_5_8_Test_Results.txt

- Type: TXT
- SHA-256: `3d5c48996b77265f1cb6a247a7b4a1e476cd526b880ef4749787117803b377f8`
- Extracted characters: 1804

```text
PASS | length addition | FRAPA⟨Q[length],Q[length]⟩ | PASS | type = Q[length]
PASS | length plus time rejected | FRAPA⟨Q[length],Q[time]⟩ | REJECT | FRAPA requires matching dimensions; got Q[length] and Q[time]
PASS | legacy subtraction alias | FRATA⟨Q[time],Q[time]⟩ | PASS | type = Q[time]
PASS | length times length gives area | FRAKA⟨Q[length],Q[length]⟩ | PASS | type = Q[area]
PASS | length divided by time gives velocity | FRALA⟨Q[length],Q[time]⟩ | PASS | type = Q[velocity]
PASS | magnitude preserves vector dimension | DRAN⟨V3[length;world]⟩ | PASS | type = Q[length]
PASS | dot product adds dimensions | DREM⟨V3[length;world],V3[velocity;world]⟩ | PASS | type = Q[L^2 T^-1]
PASS | dot product frame mismatch rejected | DREM⟨V3[length;world],V3[length;caster]⟩ | REJECT | DREM requires a common frame; got world and caster
PASS | cross product output dimension | DRIM⟨V3[length;world],V3[length;world]⟩ | PASS | type = V3[area;world]
PASS | cross product frame mismatch rejected | DRUM⟨V3[length;world],V3[length;caster]⟩ | REJECT | DRUM requires a common frame; got world and caster
PASS | wrong cross product type rejected | DRUM⟨Q[length],Q[length]⟩ | REJECT | DRUM requires 3D vectors
PASS | nested typed expression | FRAPA⟨DRAN⟨V3[length;world]⟩,Q[length]⟩ | PASS | type = Q[length]
PASS | comparison returns Boolean | DRAL⟨Q[length],Q[length],Criterion⟩ | PASS | type = Bool
PASS | comparison mismatched dimensions rejected | DRAS⟨Q[length],Q[time],Criterion⟩ | REJECT | DRAS operands must have compatible types; got Q[length] and Q[time]
PASS | unknown operator fails closed | BEN⟨Q[length]⟩ | REJECT | no Phase 5.8 signature for BEN
PASS | unbalanced syntax rejected | FRAPA⟨Q[length],Q[length] | REJECT | malformed expression; expected OP⟨...⟩
SUMMARY | 16/16 regression checks pas
```

_Excerpt truncated at 1,800 characters; full length 1804 characters._

### Arcane_Phase_6S_Typed_Expression_Integration/Arcane_Phase_5_8_Typed_Quantity_Frame_Semantics.md

- Type: MD
- SHA-256: `8d358fabc71f318a5b009c539c5899a92e4142c89547397096938b26cd7111d8`
- Extracted characters: 6037

```text
# Arcane Phase 5.8 — Typed Quantity and Frame Semantics

**Status:** provisional reference implementation; canon unchanged  
**Validation:** 16/16 regression checks passed in the included harness  
**Scope:** dimensional algebra, basic vector typing, frame compatibility, alias normalization and fail-closed behavior.

## 1. Why this phase exists

Phase 2 explicitly requires dimensional compatibility and dimensional algebra before arithmetic signatures can be considered complete. Phase 4 D-017 establishes that the historical cross-product head `DRIM` follows the physical right-hand rule and that its component formula is negated in the left-handed caster frame: `BA × DA` gives `KA` (backward) in the stated convention. Phase 5.8 begins implementing dimensional checks and same-frame requirements, but does not claim to implement all of D-017's coordinate transformation behavior.

The implementation uses a compact audit-only notation such as `Q[length]` and `V3[velocity;world]`. These are diagnostic type labels, not new Arcane vocabulary or canonical spoken forms.

## 2. Dimension model

The reference harness represents dimensions as exponent tuples in the order `(length, time, mass, temperature)`. It includes length, area, volume, time, mass, velocity, acceleration, force, energy, temperature, pressure, momentum and dimensionless quantities. Multiplication adds exponents; division subtracts them.

Examples:

- length × length → area
- length ÷ time → velocity
- length-vector · velocity-vector → dimension `L² T⁻¹`
- length-vector × length-vector → area-dimension vector

The harness does not yet represent numeric values, unit conversion factors, uncertainty, affine quantities such as absolute temperature, or semantic subtypes such as position versus displacement. These remain o
```

_Excerpt truncated at 1,800 characters; full length 6037 characters._

### Arcane_Phase_6S_Typed_Expression_Integration/Arcane_Phase_5_9_Semantic_Kinds_and_Frames.md

- Type: MD
- SHA-256: `0b0debf4ec1312d9a80e3ea33b9676be2e88864965eb94617c57282473e7c037`
- Extracted characters: 4731

```text
# Arcane Phase 5.9 — Semantic Kinds, Units, and Frame Semantics

**Status:** provisional audit implementation; canonical language and Phase 4 decisions unchanged.  
**Execution:** 15/15 regression checks passed in the included reference harness.  
**Scope:** semantic distinctions between positions and displacements, explicit frame compatibility, a small SI conversion table, and a numerical handedness check for the recovered D-017 convention.

## 1. Why this phase exists

Phase 5.8's dimensional typing is necessary but insufficient. Two values can share dimensions while representing different kinds of thing. A position and a displacement both have length dimensions, but adding two positions is not the same operation as adding a displacement to a position. Likewise, vectors in different frames cannot safely be combined until a transformation is explicitly supplied.

This phase therefore adds semantic kinds alongside dimensions. It remains an audit harness, not a complete parser, compiler, or executable magic system.

## 2. Implemented semantic rules

- `position + displacement → position`, when both are in the same frame.
- `position + position` is rejected.
- `displacement + displacement → displacement`, when dimensions and frames agree.
- An operation involving incompatible semantic kinds is rejected rather than silently coerced.
- Frame mismatches are rejected; this phase does not guess a transform.
- Exact rational unit conversions are used to avoid floating-point rounding in the test harness.
- Angles remain semantically tagged even though radians are dimensionless in dimensional analysis.

## 3. Unit conversions

The harness recognises the recovered canonical units `MA` (metre), `SE` (second), `KE` (kilogram), `RA` (radian), and `KU` (kelvin). It additionally includ
```

_Excerpt truncated at 1,800 characters; full length 4731 characters._

### Arcane_Phase_6S_Typed_Expression_Integration/Arcane_Phase_5_9_Test_Results.txt

- Type: TXT
- SHA-256: `56bfaa182028e5e8d6943c5869a40ae440e66c534a7d6d0695c39ec7b41042e2`
- Extracted characters: 1202

```text
PASS | position plus displacement yields position | Quantity(kind='position', dim=(1, 0, 0, 0), frame='world', unit=None)
PASS | position plus position rejected | ValueError: position + position is undefined; use a displacement operation
PASS | frame mismatch rejected for position update | ValueError: frame mismatch; transform explicitly first
PASS | displacement plus displacement accepted | Quantity(kind='displacement', dim=(1, 0, 0, 0), frame='world', unit=None)
PASS | 1 km = 1000 m | Fraction(1000, 1)
PASS | 250 cm = 5/2 m | Fraction(5, 2)
PASS | 60 seconds = 1 minute | Fraction(1, 1)
PASS | length cannot convert to time | ValueError: incompatible unit dimensions
PASS | D-017 world basis cross X x Y gives +Z | (0, 0, 1)
PASS | D-017 caster handedness gives -Z for X x Y | (0, 0, -1)
PASS | cross product frame mismatch rejected | ValueError: cross product requires vectors in one declared frame
PASS | angle remains semantically tagged | 'angle'
PASS | position and scalar kind mismatch rejected | ValueError: incompatible semantic kinds: position and scalar
PASS | unit registry has canonical metre | 'length'
PASS | fractional conversion exact | Fraction(1, 1000)
SUMMARY | 15/15 passed
```

### Arcane_Phase_6S_Typed_Expression_Integration/ARCANE_PHASE_6_PARSER_AUDIT.md

- Type: MD
- SHA-256: `4cf1fe463bd7e9a1e609bfc13d312a22f84ed9078e9101c312c4dc49a0ee7db1`
- Extracted characters: 3274

```text
# ARCANE LANGUAGE AUDIT — PHASE 6
## Parser scaffold and structural regression tests

**Status:** Prototype validated against the provisional Phase 2 audit notation only. Not a parser for spoken Arcane; not a certification of the complete grammar.

## Continuity correction
The recovered `Arcana pack.zip` already contains Phase 4 and Phase 5. Phase 4 explicitly retains v2.0's productive Construction morphology (Feet: frame + parameter vowel + relation coda), alongside the v3.0-L Expression subsystem. Therefore the next step is not to reconstruct morphology from scratch. It is to validate the existing two-subsystem bridge and build the missing parser/corpus tests.

## Scope
The prototype parses expressions written in the Phase 2 diagnostic notation:

`OPERATOR⟨argument₁, argument₂, …⟩`

Angle brackets and commas are audit notation, not spoken Arcane vocabulary. The parser builds nested trees, preserves argument order, rejects malformed grouping, and checks arity for the subset of operators whose provisional signatures are recorded in the script.

## Results
10/10 prototype regression tests passed:

- binary expression parsing;
- nested tree preservation;
- operand-order preservation;
- rejection of a missing argument;
- rejection of an unclosed expression;
- rejection of trailing tokens;
- fixed-arity checking;
- recursive arity checking;
- separation of syntax parsing from operator-signature validation;
- rejection of empty argument lists for known fixed-arity operators.

These are implementation-level passes for the prototype only. They do **not** establish type correctness, physical feasibility, spoken-surface uniqueness, or full-language completeness.

## What remains unimplemented
1. A complete and canonical signature registry for all formal operators.
2. A dimension
```

_Excerpt truncated at 1,800 characters; full length 3274 characters._

### Arcane_Phase_6S_Typed_Expression_Integration/ARCANE_PHASE_6B_TYPED_SEMANTICS.md

- Type: MD
- SHA-256: `71904cbeec4b5c852954bd1f8cdf32f98c1e798b3280470e60c3b6b0f70753ec`
- Extracted characters: 4899

```text
# ARCANE LANGUAGE AUDIT — PHASE 6B
## Typed semantic checker and dimensional arithmetic

**Status:** Prototype; 13/13 listed regression tests pass. This is a diagnostic implementation, not a canonical language compiler and not a claim that the full Arcane grammar is complete.

## Scope and boundaries

This prototype implements a small typed layer over the provisional Phase 2 audit notation `OPERATOR⟨argument₁, argument₂, …⟩`. Angle brackets, commas, and test identifiers such as `LEN_A` are audit scaffolding, not new Arcane vocabulary or spoken forms.

It introduces a provisional type model for quantities with dimensions, vectors, Booleans, observations, unit symbols, and control expressions. The dimensional base tuple is `(L, T, M, Θ)` for length, time, mass, and temperature. Dimension exponents are combined by multiplication and division; addition and subtraction require matching dimensions.

## Implemented checks

- FRAPA / FRATA: two quantities of matching dimensions; result retains that dimension.
- FRAKA: quantity dimensions add componentwise.
- FRALA: quantity dimensions subtract componentwise.
- FRASHA: negation preserves quantity dimensions.
- DREM: vector inputs; output dimensions are the componentwise sum of the vector dimensions.
- GRAN / GRAT / GRAK: Boolean inputs and Boolean output.
- Selected fixed arities and unknown-symbol rejection.
- Unresolved signatures are blocked rather than guessed.

## Test results

| Test | Result | Purpose |
|---|---|---|
| 6B-01 | PASS | Add quantities with matching dimensions |
| 6B-02 | PASS | Reject length plus time |
| 6B-03 | PASS | Length multiplied by length yields area dimension |
| 6B-04 | PASS | Length divided by time yields velocity dimension |
| 6B-05 | PASS | Negation preserves energy dimension |
| 6B-06 | PASS |
```

_Excerpt truncated at 1,800 characters; full length 4899 characters._

### Arcane_Phase_6S_Typed_Expression_Integration/ARCANE_PHASE_6C_OPERATOR_REGISTRY.md

- Type: MD
- SHA-256: `aa6da75b3182d60709657df276b77c6c4cc781b7a47c2fa0e4ca2a71867696e6`
- Extracted characters: 7223

```text
# ARCANE LANGUAGE AUDIT — PHASE 6C
## Operator registry, comparison criteria, and vector dimensional rules

**Status:** Provisional executable audit model. The prototype passes 17/17 listed tests. This is not a production compiler, a validation of spoken Arcane, or automatic promotion of these rules to canon.

## 1. Scope and change control

Phase 6C extends the Phase 6B diagnostic checker. It resolves two concrete implementation defects in the audit scaffold:

1. A three-dimensional cross product (`DRIM`) must return a vector, not a scalar.
2. `DRAL` needs a typed relation criterion and compatible operands to produce a Boolean result.

The audit notation remains `OPERATOR⟨argument₁, argument₂, …⟩`. Names such as `LT`, `LE`, `EQ`, `NE`, `GE`, and `GT` are **meta-level test tokens**, not newly approved Arcane vocabulary. Their spoken or formal Arcane encodings remain undecided.

## 2. Provisional signature registry

| Operator | Proposed audit signature | Result | Status |
|---|---|---|---|
| `FRAPA` | Quantity[d] × Quantity[d] | Quantity[d] | Implemented; dimensional compatibility required |
| `FRATA` | Quantity[d] × Quantity[d] | Quantity[d] | Implemented; dimensional compatibility required |
| `FRAKA` | Quantity[d₁] × Quantity[d₂] | Quantity[d₁+d₂] | Implemented dimensional rule |
| `FRALA` | Quantity[d₁] × Quantity[d₂] | Quantity[d₁−d₂] | Implemented dimensional rule; runtime zero check absent |
| `FRASHA` | Quantity[d] | Quantity[d] | Implemented |
| `DRAN` | Vector[d] | Quantity[d] | Implemented provisionally; supported vector spaces/norm remain to be specified |
| `DREM` | Vector[d₁] × Vector[d₂] | Quantity[d₁+d₂] | Implemented provisionally |
| `DRIM` | 3D Vector[d₁] × 3D Vector[d₂] | 3D Vector[d₁+d₂] | Implemented dimensional result; explicit 3D shape is not yet
```

_Excerpt truncated at 1,800 characters; full length 7223 characters._

### Arcane_Phase_6S_Typed_Expression_Integration/ARCANE_PHASE_6D_LEXICON_BRIDGE.md

- Type: MD
- SHA-256: `7b4b6aa8424b25dcced6a0c4a7fe025ae35293ab80dba2cb92f4d24582b7736d`
- Extracted characters: 4400

```text
# ARCANE LANGUAGE AUDIT — PHASE 6D
## Lexicon-to-operator reconciliation

**Status:** Provisional integration audit. This phase reconciles the typed checker’s abstract operator IDs with the actual Phase 4/5 lexicon. It does not promote proposed lexicon entries or incomplete semantics to canon.

## 1. Why this phase was necessary

The Phase 6C checker uses the abstract names inherited from v3.0-L, including `FRATA`, `FRAKA`, `DRIM`, `DRAL`, `GRAK`, and `KWAK`. The recovered Phase 4/5 lexicon records renames:

| Semantic operator ID used by the checker | Current Phase 4/5 form | Earlier form retained as alias |
|---|---|---|
| `FRATA` — subtract | `fraja` | `frata` |
| `FRAKA` — multiply | `frama` | `fraka` |
| `DRIM` — cross product | `drum` | `drim` |
| `DRAL` — compare | `dras` | `dral` |
| `GRAK` — NOT | `grash` | `grak` |
| `KWAK` — live evaluation | `kwash` | `kwak` |

This distinction is crucial: **semantic operator IDs are stable implementation labels; lexicon forms are language forms**. The compiler bridge must not assume they are identical.

## 2. Source-grounded rules

- The Phase 4 report says renamed forms retain old forms as aliases.
- The Phase 5 CSV is the consolidated 255-row lexicon with register and status columns.
- The bridge derives aliases only from explicit `note` entries beginning `was ...`; it does not invent historical forms.
- Lexical presence is not the same as an executable signature. For example, `BEK`, `ZET`, `KWAM`, `KWAT`, and `KWAK` remain semantically blocked where their execution rules are unresolved.
- The `Phase 4/5` spellings are preserved as forms, but their statuses remain those recorded in the lexicon. Proposed entries are not silently promoted.

## 3. Test results

The accompanying script checks the 255-row inventory, verifies s
```

_Excerpt truncated at 1,800 characters; full length 4400 characters._

### Arcane_Phase_6S_Typed_Expression_Integration/ARCANE_PHASE_6E_RUNTIME_EVALUATOR.md

- Type: MD
- SHA-256: `2921f3787f88674a730d9d6fa6b88535d0decc6ce90683bfd38f0eb8305aec7f`
- Extracted characters: 2638

```text
# Arcane Phase 6E — Runtime Numeric and Vector Evaluation

**Status:** executable audit prototype; not canonical surface grammar and not spell execution.

## Purpose
Phase 6B checked types, Phase 6C defined provisional operator behaviour, and Phase 6D reconciled current lexicon spellings. Phase 6E adds evaluation of concrete test values after parsing, lexicon normalisation, and static type checking.

## Implemented in this prototype
- Numeric evaluation: `FRAPA`, current `FRAJA` (legacy `FRATA` alias), current `FRAMA` (legacy `FRAKA` alias), `FRALA`, `FRASHA`.
- Vector operations: `DRAN` magnitude, `DREM` dot product, current `DRUM` cross product (legacy `DRIM` alias), with three-component vectors.
- Comparisons: current `DRAS` (legacy `DRAL`) using audit-only criteria `LT`, `LE`, `EQ`, `NE`, `GE`, `GT`.
- Boolean logic: `GRAN`, `GRAT`, current `GRASH` (legacy `GRAK`).
- Explicit runtime errors for unknown symbols, incompatible dimensions, invalid argument kinds, non-finite results, division by zero, and unresolved operators.

## Test fixtures and units
The runtime environment contains test-only symbols such as `LEN_A`, `TIME_A`, `VEC_LEN_A`, `BOOL_A`. Numeric values are synthetic fixtures expressed in consistent base units with dimension tuple `(length, time, mass, temperature)`. These identifiers are not additions to the Arcane lexicon. The checker currently uses static dimensions and does not implement unit conversion or a complete unit algebra.

## Validation
The included regression suite defines 18 tests covering arithmetic, dimensions, vectors, comparisons, Boolean operations, unresolved control flow and invalid symbols. Run:

```bash
python arcane_phase6e_runtime_evaluator.py
```

Passing tests demonstrate the prototype's implementation of these stated rules only
```

_Excerpt truncated at 1,800 characters; full length 2638 characters._

### Arcane_Phase_6S_Typed_Expression_Integration/ARCANE_PHASE_6F_CONTROL_BINDINGS.md

- Type: MD
- SHA-256: `c9f94640e46a9fae40e3aff86b7c1932cb0baa0f11fe795bd5dc245033b5948c`
- Extracted characters: 3523

```text
# Arcane Phase 6F — Control Flow and Bindings

Status: **prototype / provisional semantics**. This phase recovers and implements a narrow executable subset based on Phase 4's G-2, G-5 and G-6, plus its explicit KWAM/KWAT/KWASH descriptions. It does not replace the canonical grammar or claim full language completion.

## Source-grounded decisions used

- Phase 4 G-5: IF, WHILE, UNTIL and EACH take a condition then a block; blocks open with `METO` (BEGIN) and close with `DOGU` (END). A one-clause block may omit delimiters in Performed speech.
- Phase 4 G-6: IF fires when its whole condition becomes true; ONSET (`RUKI`) makes one inner term edge-based; WHILE runs while true; UNTIL stops when true.
- Phase 4 D-037 / L-15: `KWASH` is the current formal live-evaluation form (legacy `KWAK`); `KWAM` and `KWAT` combine for locked values.
- Phase 3/Phase 4 audit semantics: `KWAM` takes identifier + expression; `KWAT` reads an identifier; `KWASH` evaluates a live expression. Exact surface encoding and scope are not fully specified.

## Implemented subset

- `BEK⟨condition, METO⟨body...⟩⟩`: condition must be Boolean; body runs only when true.
- `ZET⟨condition, METO⟨body...⟩⟩`: reevaluates the condition before each iteration; runs while true.
- `KOLE⟨condition, METO⟨body...⟩⟩`: runs while false and stops once true. This is the direct operational reading of “UNTIL stops when true”.
- `KWAM⟨ID_n, expression⟩`: stores the evaluated value and type in the runtime binding table. `ID_n` is audit-only symbolic notation, not canonical Arcane vocabulary.
- `KWAT⟨ID_n⟩`: reads a stored binding; an unbound identifier fails explicitly.
- `KWASH⟨expression⟩`: reevaluates its expression each time; it does not cache the result.
- `METO⟨expr1, expr2, ...⟩`: audit notation for a block with ordered ex
```

_Excerpt truncated at 1,800 characters; full length 3523 characters._

### Arcane_Phase_6S_Typed_Expression_Integration/ARCANE_PHASE_6G_SURFACE_PARSER.md

- Type: MD
- SHA-256: `ceb521416330a43e54972a7b2ef7da8479b71d62ae976948bf6e60e588c1b702`
- Extracted characters: 5867

```text
# Arcane Phase 6G — Surface Parser Prototype

**Status:** prototype; deliberately incomplete; not canon-locked.

## Goal

Implement the first source-grounded parser for the Formal expression subset, moving beyond the audit-only `OP⟨arg1, ...⟩` notation. Phase 6G accepts whitespace-tokenised, romanised forms and builds an AST. It does not perform speech recognition, parse pitch/prosody, parse sigils, type-check the AST, evaluate it, compile Construction Feet, or execute magic.

## Source-grounded rules

This parser follows the recovered Phase 4 rules:

- **G-1:** fixed arity and head-initial expressions; argument boundaries are recovered from the operator's arity, not commas.
- **G-2:** every numeral ends in a unit; `SHO` closes dimensionless numerals; binding identifiers are numerals closed by `SHO`.
- **G-3:** no optional arguments. Missing required context must eventually be rejected by semantic/type checking; this parser does not yet model context bindings.
- **G-5:** control forms take a condition followed by a block opened by `METO` and closed by `DOGU`.
- **G-6:** the operational semantics for IF/WHILE/UNTIL remain the Phase 6F evaluator's concern; Phase 6G only parses their structure.
- **Rename history:** the parser normalises documented legacy forms such as `FRATA` → `FRAJA`, `FRAKA` → `FRAMA`, `DRIM` → `DRUM`, `DRAL` → `DRAS`, `GRAK` → `GRASH`, and `KWAK` → `KWASH`.

The lexicon CSV is read at runtime. Only operator signatures explicitly enabled in the parser are accepted as executable heads. Known operator-like forms with incomplete signatures (for example `NES`) are rejected instead of being guessed as one-argument or zero-argument words.

## Supported parse subset

- Arithmetic: `FRAPA`, `FRAJA`, `FRAMA`, `FRALA`, `FRASHA`.
- Vector: `DRAN`, `DREM`, `DRUM`,
```

_Excerpt truncated at 1,800 characters; full length 5867 characters._

### Arcane_Phase_6S_Typed_Expression_Integration/ARCANE_PHASE_6H_PIPELINE.md

- Type: MD
- SHA-256: `4295dca4ca8f43bf572fb0b5fff1f90d9674c3f95785657883bacd83dd119c51`
- Extracted characters: 3546

```text
# Arcane Phase 6H — End-to-End Pipeline Prototype

**Status:** narrow integration prototype; not canon-locked and not a complete Arcane implementation.

## Purpose

Phase 6H joins a surface parser, a small static type checker and a runtime evaluator into one executable path. It verifies that supported expressions can move between stages and that failures are reported at the appropriate stage.

## Pipeline

1. **Parse:** whitespace-tokenised romanised input becomes a small AST (`Num`, `Word`, `Call`, `Block`).
2. **Type-check:** verify supported operand types, binding references, and limited unit compatibility.
3. **Evaluate:** compute supported arithmetic and Boolean operations, with a runtime step budget.
4. **Report:** distinguish parse, type-check and runtime errors.

## Enabled subset

- Numerals formed from the consolidated digit words, optional `SHI` decimal fraction, and a unit closure.
- Arithmetic: `FRAPA`, `FRAJA`, `FRAMA`, `FRALA`, `FRASHA`.
- Boolean logic: `GRAN`, `GRAT`, `GRASH`.
- Bindings: `KWAM`, `KWAT`, `KWASH`, with numeric identifiers closed by `SHO`.
- Control structure parsing for `BEK`, `ZET`, and proposed `KOLE`, using `METO ... DOGU`.
- Legacy normalisation for aliases recorded in the script.

## Validation

Run `python arcane_phase6h_pipeline.py` in this directory. The current regression suite passes **15/15 tests**:

- end-to-end addition and nested arithmetic;
- legacy alias normalisation;
- unit mismatch caught by the checker;
- malformed numeral and control delimiter rejection;
- unbound binding rejection and stored binding roundtrip;
- Boolean NOT, AND and OR;
- division-by-zero runtime error;
- unknown word and trailing-token rejection.

`BOOL_TRUE`, `BOOL_FALSE`, and `BOOL_A` are test-harness fixtures only. They are not asserted to be ca
```

_Excerpt truncated at 1,800 characters; full length 3546 characters._

### Arcane_Phase_6S_Typed_Expression_Integration/ARCANE_PHASE_6I_CONTRACT_AUDIT.md

- Type: MD
- SHA-256: `805c60d84eca2bc49bd48c9752eeb34f368399faa8c3fc6822147d61043f3258`
- Extracted characters: 3535

```text
# Arcane Phase 6I — Contract and Dimensional-Safety Audit

**Status:** audit/test milestone; no new language rules are canon-locked.

## Purpose

Phase 6I adds a separate regression audit over the Phase 6H parser → type checker → evaluator. It checks the behaviours the current subset claims to support and verifies that invalid cases fail at the expected stage. It does not silently add operator meanings or define the physical dimensions of Arcane units.

## Result

**22/22 audit tests pass** using `arcane_phase6i_contract_audit.py` against `arcane_phase6h_pipeline.py` and the bundled `Arcane_Lexicon_v5_draft.csv`.

Coverage:

- arithmetic values and preservation of the current unit labels;
- addition/subtraction rejection when unit labels differ;
- current restricted multiplication and division rules;
- runtime division-by-zero rejection;
- Boolean type checks using test-only fixture words;
- IF condition type validation;
- numeral closure and malformed decimal rejection;
- unknown/trailing token rejection;
- explicit control block delimiter checks;
- unbound binding reference rejection.

## Unit safety contract currently enforced

| Operation | Current prototype rule | Limitation |
|---|---|---|
| `FRAPA` / `FRAJA` | Operand types must be numeric and unit labels identical | No conversion between units |
| `FRAMA` | Numeric operands; at least one operand must be `SHO` | No dimensional product algebra |
| `FRALA` | Numeric operands; divisor must be `SHO` | No reciprocal dimensions or conversion |
| `FRASHA` | Numeric operand; preserves unit label | Exact canonical meaning still depends on source audit |

These are implementation constraints for the current subset, not a complete dimensional theory. The symbols `MA`, `SE`, `KE`, `RA`, `KU`, `SHO`, and `VO` must not be trea
```

_Excerpt truncated at 1,800 characters; full length 3535 characters._

### Arcane_Phase_6S_Typed_Expression_Integration/Arcane_Phase_6J_Semantic_Registry.csv

- Type: CSV
- SHA-256: `685093a1b4369b41bc3d915baee54dfdbe2643d2cdfc836fa463a35b56dcdb99`
- Extracted characters: 54370

```text
form,gloss,class,register,lexicon_status,lexicon_source,arity_or_shape,provisional_signature,semantic_gloss,evidence,registry_status,open_issue
za,0,DIGIT,Shared,CANON,v3.0-L,digit token,Digit → numeral component,0,Lexicon v3.0-L; Phase 4 G-2,ESTABLISHED_LEXICAL_ROLE,Check numeral concatenation and unit closure against parser test corpus.
ki,1,DIGIT,Shared,CANON,v3.0-L,digit token,Digit → numeral component,1,Lexicon v3.0-L; Phase 4 G-2,ESTABLISHED_LEXICAL_ROLE,Check numeral concatenation and unit closure against parser test corpus.
to,2,DIGIT,Shared,CANON,v3.0-L,digit token,Digit → numeral component,2,Lexicon v3.0-L; Phase 4 G-2,ESTABLISHED_LEXICAL_ROLE,Check numeral concatenation and unit closure against parser test corpus.
mu,3,DIGIT,Shared,CANON,v3.0-L,digit token,Digit → numeral component,3,Lexicon v3.0-L; Phase 4 G-2,ESTABLISHED_LEXICAL_ROLE,Check numeral concatenation and unit closure against parser test corpus.
re,4,DIGIT,Shared,CANON,v3.0-L,digit token,Digit → numeral component,4,Lexicon v3.0-L; Phase 4 G-2,ESTABLISHED_LEXICAL_ROLE,Check numeral concatenation and unit closure against parser test corpus.
sa,5,DIGIT,Shared,CANON,v3.0-L,digit token,Digit → numeral component,5,Lexicon v3.0-L; Phase 4 G-2,ESTABLISHED_LEXICAL_ROLE,Check numeral concatenation and unit closure against parser test corpus.
fi,6,DIGIT,Shared,CANON,v3.0-L,digit token,Digit → numeral component,6,Lexicon v3.0-L; Phase 4 G-2,ESTABLISHED_LEXICAL_ROLE,Check numeral concatenation and unit closure against parser test corpus.
du,7,DIGIT,Shared,CANON,v3.0-L,digit token,Digit → numeral component,7,Lexicon v3.0-L; Phase 4 G-2,ESTABLISHED_LEXICAL_ROLE,Check numeral concatenation and unit closure against parser test corpus.
go,8,DIGIT,Shared,CANON,v3.0-L,digit token,Digit → numeral component,8,Lexicon v
```

_Excerpt truncated at 1,800 characters; full length 54370 characters._

### Arcane_Phase_6S_Typed_Expression_Integration/ARCANE_PHASE_6J_SEMANTIC_REGISTRY.md

- Type: MD
- SHA-256: `7aa27e5be304da5c086d75d15e36f06372b2538ab8e416f39965e27b2c8ad06c`
- Extracted characters: 3852

```text
# Arcane Phase 6J — Source-backed Semantic Registry

**Status:** registry assembled from the recovered project archive; no canon changes made.

## What this phase did

Phase 6J extracts lexical status and glosses from `Arcane_Lexicon_v5_draft.csv` and cross-references recovered Phase 4/5 audits, the continuity recovery audit, the decision ledger and the grammar test register. The resulting CSV contains every lexicon row, including duplicate surface forms, with separate fields for source status, proposed signature, evidence, confidence/status and unresolved issue. It intentionally does not infer signatures from glosses.

## Critical source-backed findings

1. **`FRASHA` semantic mismatch:** the recovered lexicon and continuity audit gloss it as *negate*, but Phase 6H's evaluator implements absolute value (`abs`). This is an implementation/specification mismatch and should be corrected only after checking the authoritative Phase 3 definitions. Until resolved, `FRASHA` must not be described as verified end-to-end semantics.
2. **`SHO`, `METO`, `DOGU` status conflict:** Phase 4 grammar depends on SHO as the dimensionless numeral closure and describes METO/DOGU as block delimiters, while the Phase 5 draft lexicon marks all three `PROPOSED`. Their canonical status needs an explicit ledger reconciliation.
3. **`KOLE` remains proposed:** Phase 4 names UNTIL/KOLE, but the current lexicon still marks it proposed. Phase 6H's implementation must remain provisional and gated.
4. **Operator signatures remain incomplete:** Phase 4 G-1 states that every head has a fixed arity and typed signature, but the recovered decision ledger D-008 explicitly proposes defining operator-specific signatures. These statements can coexist only if the rule is canonical while the full inventory remains i
```

_Excerpt truncated at 1,800 characters; full length 3852 characters._

### Arcane_Phase_6S_Typed_Expression_Integration/ARCANE_PHASE_6K_CORRECTIVE_SEMANTIC_VALIDATION.md

- Type: MD
- SHA-256: `d6f10ede41a3bc522d10fd676abf5664f093f47dd9e35d2b5688e2e1512774e1`
- Extracted characters: 3235

```text
# Arcane Phase 6K — Corrective Semantic Validation

**Status:** targeted source-backed contract validated; full runtime correction not yet integrated; no canon changes made.

## 1. Verified source contract

The recovered Continuity & Recovery Audit lists `FRASHA` as **negate** in the maths inventory and separately records FRASHA as the negative sign in numeral-related notes. The Phase 5 lexical inventory also uses `GRASH` as logical NOT. Therefore the Phase 6H implementation of `FRASHA` as absolute value (`abs`) conflicts with the recovered gloss and must not be retained as validated behaviour.

The minimal numeric contract tested here is unary arithmetic negation:

- `FRASHA(3) = -3`
- `FRASHA(-3) = 3`
- `FRASHA(0) = 0`
- `FRASHA(1.25) = -1.25`

The tests exercise a reference contract function, not the full Phase 6H parser/evaluator. The Phase 6H runtime source was not present in the recovered working directory when this phase was run, so no claim is made that the runtime has been patched.

## 2. Important unresolved collision

The recovery audit also calls FRASHA the negative sign for numerals. The recovered material does not fully specify whether the same surface form acts as (a) a prefix sign in numeric literals, (b) a unary operator in expression syntax, or both under different grammatical contexts. This must be specified before parser integration. Do not silently infer a context rule.

## 3. Status conflicts

- `SHO`: Phase 4 grammar relies on it as dimensionless numeral closure; Phase 5 lexicon status is `PROPOSED`.
- `METO` and `DOGU`: Phase 4 grammar relies on them as block delimiters; Phase 5 lexicon status is `PROPOSED`.
- `KOLE`: Phase 4 lists UNTIL/KOLE, but Phase 5 lexicon status remains `PROPOSED`.

These are governance/reconciliation issues, not permissi
```

_Excerpt truncated at 1,800 characters; full length 3235 characters._

### Arcane_Phase_6S_Typed_Expression_Integration/Arcane_Phase_6L_Operator_Contract_Registry.csv

- Type: CSV
- SHA-256: `b3624a19f710cae9c745fb8833cb2d9bfa1f69e8d8d51a6e9ca651f9cd18699a`
- Extracted characters: 3933

```text
form,lexicon_gloss,lexicon_class,lexicon_status,lexicon_note,arity_or_shape,provisional_operand_types,provisional_return_type,semantic_gloss,registry_status,evidence,open_issue
frapa,add,ARITH,CANON,,binary,"Quantity, Quantity",Quantity,add,CANON_FORM_SIGNATURE_OPEN,Phase 4 G-1; continuity recovery maths inventory,Unit compatibility/conversion policy not fully specified.
fraja,subtract,ARITH,RENAMED,was frata,binary,"Quantity, Quantity",Quantity,subtract,RENAMED_FORM_SIGNATURE_OPEN,Phase 4 §5.1; continuity recovery maths inventory,Historical FRATA; operand order and exact dimensional constraints need tests.
frama,multiply,ARITH,RENAMED,was fraka,binary,"Quantity, Quantity",Quantity,multiply,RENAMED_FORM_SIGNATURE_OPEN,Phase 4 §5.1; continuity recovery maths inventory,Historical FRAKA; compound-unit algebra is not fully specified.
frala,divide,ARITH,CANON,,binary,"Quantity, Quantity",Quantity,divide,CANON_FORM_SIGNATURE_OPEN,Continuity recovery maths inventory; v3.0-L lexicon,Zero-divisor and quotient-unit rules need explicit contract.
frasha,negate,ARITH,CANON,,unary,Numeric quantity,Numeric quantity,negate,CANON_GLOSS_RUNTIME_MISMATCH,Continuity Recovery Audit; v3.0-L lexicon,Phase 6H runtime previously implemented abs(); also appears as negative numeral sign. Syntax distinction unresolved.
dran,magnitude,VEC,CANON,,unresolved,UNRESOLVED,UNRESOLVED,magnitude,CANON_GLOSS_SIGNATURE_OPEN,Continuity Recovery Audit; v3.0-L lexicon,Scalar/vector input and output unit semantics need authoritative definition.
drem,dot,VEC,CANON,,binary,"Vector, Vector (provisional)",UNRESOLVED,dot product,CANON_GLOSS_SIGNATURE_OPEN,Continuity Recovery Audit; Phase 4 near-collision list,Vector space compatibility and output units unresolved.
drum,cross,VEC,RENAMED,was drim,binary,"Vector, Vecto
```

_Excerpt truncated at 1,800 characters; full length 3933 characters._

### Arcane_Phase_6S_Typed_Expression_Integration/ARCANE_PHASE_6M_EXECUTION_REPORT.md

- Type: MD
- SHA-256: `f25de76f588a7dc73e73e282451fa8f93c5d8fe4012372b56ad90dfafc588595`
- Extracted characters: 3417

```text
# Arcane Phase 6M — Grammar and consistency test execution report

**Status:** evidence audit executed; original semantic/operational test plan remains blocked pending missing components. No canon changes made.

## Important distinction

The recovered Grammar & Consistency Test Register explicitly says that its 16 tests were defined but had not been executed and evidenced. Phase 6M preserves that historical statement. The new script runs eight source/registry evidence checks, but those checks are **not** reported as passes for T-001–T-016.

## Executed evidence checks

The audit checks whether the current Phase 6L registry and recovered source files document: registry availability, FRAPA's declared binary arity, FRAJA's historical FRATA alias, the unique-parse rule, fixed-arity rule, modifier scope rule, the FRASHA mismatch warning and KOLE's provisional status.

The result file records each check and its outcome. These checks confirm documentation presence only; they do not prove that an executable parser enforces the documented rules.

## T-001–T-016 execution status

| ID | Status | Why it is not yet executable here |
|---|---|---|
| T-001 | BLOCKED | Current parser/runtime missing; metadata is not arity enforcement. |
| T-002 | BLOCKED | Need executable operand-order tests. |
| T-003 | BLOCKED | Need parser and evaluation to compare nested expressions. |
| T-004 | BLOCKED | Need ambiguity corpus and parser behaviour. |
| T-005 | BLOCKED | Need modifier parser and scope tests. |
| T-006 | BLOCKED | Need integrated type environment/checker. |
| T-007 | BLOCKED | Measurement signature/context model incomplete. |
| T-008 | BLOCKED | Binding runtime unavailable; forms alone do not prove semantics. |
| T-009 | BLOCKED | Temporal signatures incomplete. |
| T-010 | BLOCKED
```

_Excerpt truncated at 1,800 characters; full length 3417 characters._

### Arcane_Phase_6S_Typed_Expression_Integration/ARCANE_PHASE_6O_REPRODUCIBILITY_REPORT.md

- Type: MD
- SHA-256: `2045b5302c3d8b78556a106014f1a5f7ec28e7ddb6b09e72a446a9de79c1c017`
- Extracted characters: 3183

```text
# Arcane Phase 6O — Phase 5 recovery and reproducibility report

**Outcome:** Phase 5 generator reproduced successfully against the archived lexicon baseline.  
**Canon changes:** None.  
**Important limitation:** the original `arcane_lexicon_tools.py` was not present as a standalone source file. The helper in this package is a compatibility reconstruction based on the archived `arcane lexicon tools.pdf` printout and Phase 4 documentation, not a claim that the missing original source was recovered byte-for-byte.

## What was done

1. Extracted the Phase 4 lexicon-tool PDF and Phase 4/5 lexicon and source files from `Arcana pack.zip`.
2. Reconstructed the helper functions used by the Phase 5 generator (`syllabify` and feature-distance `dist`) in `arcane_lexicon_tools.py`.
3. Made a portable copy of `phase5_vernacular.py` that uses paths relative to its own project folder rather than `/home/claude` and `/mnt/user-data/outputs`.
4. Ran the generator using the recovered Phase 4 lexicon as input.
5. Compared the generated Phase 5 lexicon with the archived Phase 5 lexicon.

## Results

- The generator reports **P5-T01 through P5-T07: 7/7 PASS**.
- The generated lexicon contains **255 data rows**, including **115 proposed vernacular roots**.
- The generated CSV is **byte-for-byte identical** to the archived `Arcane_Lexicon_v5_draft.csv` (SHA-256 `4b38aec651a32b332d4f28068d34618c4dfb2f043d44a2f03c146dba2e31ad8a`).
- Additional validation checks confirm that all seven original test IDs are present, the row count is 255, and the output matches the baseline.

## Correction to the Phase 6N report

The Phase 6N report previously identified `SMALL` in the “Modal + noun phrase” sample as an undefined token. That finding was incorrect: `SMALL` is defined in the Phase 5 concept inventor
```

_Excerpt truncated at 1,800 characters; full length 3183 characters._

### Arcane_Phase_6S_Typed_Expression_Integration/ARCANE_PHASE_6R_DIMENSIONAL_MODEL.md

- Type: MD
- SHA-256: `15024e3970bdb8ac8882745c04576f40995b35fc3e44b7ac147b727acab76968`
- Extracted characters: 1629

```text
# Arcane Phase 6R — Provisional dimensional value model

## Purpose
Phase 6R introduces a small typed-value layer for physical quantities. It is deliberately separate from the Phase 6P/6Q expression evaluator, so the existing test-notation behaviour remains unchanged while dimensional semantics are reviewed.

## Model
A quantity is a Decimal magnitude plus a sparse dimension vector. Symbols such as `L`, `M`, and `T` are abstract placeholders for length, mass, and time; they do not establish canonical Arcane unit names, scale factors, or conversion rules. A vector such as `L^1 T^-1` can represent a length-per-time dimension without selecting a physical unit.

- Addition and subtraction require identical dimension vectors.
- Multiplication adds exponent vectors.
- Division subtracts exponent vectors and rejects a zero divisor.
- Negation changes only the magnitude.
- Dimensionless values use the empty vector.
- Decimal magnitudes are required to avoid silent binary-float coercion.

## Explicit non-goals
This does not establish canonical Arcane grammar, unit names, unit conversions, measurement-completeness rules, sensor/pathway semantics, uncertainty propagation, physical feasibility, or Logos cost. It does not yet connect quantities to the surface-language evaluator. All dimension symbols and signatures are provisional engineering scaffolding pending source-backed decisions.

## Reproduction
Run `python -m unittest -v test_arcane_reference_runtime test_phase6q_grammar test_phase6r_dimensions` from this directory. The suite combines the existing Phase 6P/6Q tests with the new Phase 6R dimensional tests.
```

### Arcane_Phase_6S_Typed_Expression_Integration/ARCANE_PHASE_6R_REPORT.md

- Type: MD
- SHA-256: `71823932837304645725364b0bbbc2dd76873b5899f4bcc1f8177169286efd8c`
- Extracted characters: 1386

```text
# Arcane Phase 6R — Typed quantities and dimensional analysis

**Status:** Reference dimensional layer implemented; regression suite executed.

Phase 6R adds `arcane_dimensions.py`, a separate provisional quantity model using Decimal magnitudes and sparse integer exponent vectors. Addition/subtraction require matching dimensions; multiplication/division combine dimensions algebraically; division by zero is rejected; negation preserves the dimension.

## Validation
The full included suite combines Phase 6P runtime tests, Phase 6Q grammar tests, and Phase 6R dimensional tests. See `PHASE_6R_TEST_OUTPUT.txt` for the exact interpreter output. The dimensional layer is tested independently and has not yet been wired into the expression evaluator.

## Canon and limitations
No canon change is made. `L`, `M`, and `T` are provisional engineering symbols, not claimed to be Arcane canonical tokens. There are no unit conversion rules, uncertainty propagation, sensor/pathway semantics, measurement-completeness enforcement, physical feasibility model, or Logos resource accounting. The current test notation remains provisional and unchanged.

## Next phase
Phase 6S should decide how quantity types are represented in the grammar and type system, with explicit tests for measurement completeness and source-backed unit rules before connecting the dimensional module to the evaluator.
```

### Arcane_Phase_6S_Typed_Expression_Integration/ARCANE_PHASE_6S_REPORT.md

- Type: MD
- SHA-256: `6a4b4f1c1a50ba23a3c4399c8cd2fa740856d93306a1fb80e2e48d333e1a8edb`
- Extracted characters: 2283

```text
# Arcane Phase 6S — Typed expression integration report

**Status:** Complete for the scoped prototype milestone  
**Verification:** 68/68 combined automated tests passed  
**Canon changes:** None

## What changed

Phase 6S connects the Phase 6P/6Q expression AST to the Phase 6R dimensional model. The new `arcane_typed_runtime.py` exposes `evaluate_typed()` and a programmatic `QuantityLiteral` test node. The existing evaluator remains unchanged, so existing test-notation behaviour is preserved.

### Typed behaviour
- A parsed numeric literal becomes a dimensionless `Quantity`.
- `FRAPA` and `FRAJA` use dimensional addition/subtraction and reject mismatched dimensions.
- `FRAMA` and `FRALA` combine dimension vectors according to the Phase 6R model.
- `FRASHA` negates a quantity's magnitude while preserving its dimension.
- `GRAN`, `GRAT` and `GRASH` continue to operate on Booleans and reject quantity operands.
- Typed dimension errors are reported as `TypedEvaluationError` with operator context.

## Test evidence
The combined test suite was executed with:

```bash
python -m unittest -v test_arcane_reference_runtime test_phase6q_grammar test_phase6r_dimensions test_phase6s_typed_runtime
```

Observed result: **68 tests passed**. The included `PHASE_6S_TEST_OUTPUT.txt` records the run.

## Important boundaries
- The historical Phase 6H runtime remains unavailable; this is a new reference prototype.
- `QuantityLiteral` is a programmatic test node, not a new canonical surface-language construct.
- Bare numeric literals are treated as dimensionless only in the typed evaluator. No unit names or conversion factors have been canonized.
- Passing dimensional checks does not establish physical feasibility, conservation, measurement completeness or Logos resource sufficiency.
- The
```

_Excerpt truncated at 1,800 characters; full length 2283 characters._

### Arcane_Phase_6S_Typed_Expression_Integration/ARCANE_PHASE_6S_TYPED_INTEGRATION.md

- Type: MD
- SHA-256: `cb10974158d21324ec087605cc48a2bfd0c05e3c1f52f792e899d7e306594cd1`
- Extracted characters: 1841

```text
# Arcane Phase 6S — Typed expression integration

## Summary
Phase 6S connects the existing Phase 6P/6Q expression AST to the Phase 6R dimensional quantity model. This is a provisional reference implementation and does not change canonical Arcane syntax or vocabulary.

## Implementation
- Added `arcane_typed_runtime.py` with `evaluate_typed()` and a `QuantityLiteral` test-AST node.
- Existing parsed numeric literals become dimensionless `Quantity` values in the typed evaluator.
- Arithmetic operators call the Phase 6R quantity operations, preserving dimensions and rejecting incompatible addition/subtraction.
- Boolean operators retain Boolean behaviour and reject quantity operands.
- Dimensional failures are wrapped as `TypedEvaluationError` with operator context.
- Existing untyped evaluator remains unchanged for backwards compatibility.

## Grammar/canon boundary
`QuantityLiteral` is a programmatic test harness node, not a newly asserted surface-language form. The source archive does not establish a canonical written syntax for attaching dimension metadata to literals, so Phase 6S does not invent one.

## Verification
The combined suite includes the existing Phase 6P runtime tests, Phase 6Q test-notation tests, Phase 6R dimension-model tests, and new Phase 6S integration tests. The package's test output records the actual run. These tests verify only the reference prototype and do not claim complete language conformance.

## Remaining work
- Decide source-backed syntax/semantics for quantities and measurement records.
- Define units, conversion and precision/uncertainty policy from source evidence.
- Implement measurement completeness only after recovering its exact required fields and applicability rules.
- Keep physical feasibility, conservation, and Logos resource
```

_Excerpt truncated at 1,800 characters; full length 1841 characters._

### Arcane_Phase_6S_Typed_Expression_Integration/arcane_reference_runtime.py

- Type: PY
- SHA-256: `a5756a52a394875d8e9271151ee868e560715dd58d9b6fd843c8eede202f223f`
- Extracted characters: 4207

```text
#!/usr/bin/env python3
"""Arcane Phase 6P reference runtime (NEW, provisional subset; not recovered historical code).

Syntax is an explicit test notation: (operator argument ...), decimal literals, true/false.
Only source-backed operator glosses are implemented. Signatures and dimensional rules remain
provisional where the contract registry says they are open. This is a harness, not canon.
"""
from __future__ import annotations
from dataclasses import dataclass
from decimal import Decimal, DivisionByZero, InvalidOperation
import re
from typing import Union

class ArcaneRuntimeError(Exception): pass
class ArcaneParseError(ArcaneRuntimeError): pass
class ArcaneArityError(ArcaneRuntimeError): pass
class ArcaneTypeError(ArcaneRuntimeError): pass
class ArcaneEvaluationError(ArcaneRuntimeError): pass

@dataclass(frozen=True)
class Number:
    value: Decimal
@dataclass(frozen=True)
class Boolean:
    value: bool
@dataclass(frozen=True)
class Call:
    operator: str
    args: tuple['Expr', ...]
Expr = Union[Number, Boolean, Call]

TOKEN_RE = re.compile(r"\s*(\(|\)|[^\s()]+)")
OPS = {"frapa", "fraja", "frama", "frala", "frasha", "gran", "grat", "grash"}
ARITY = {"frapa": 2, "fraja": 2, "frama": 2, "frala": 2, "frasha": 1,
         "gran": 2, "grat": 2, "grash": 1}

def tokenize(source: str) -> list[str]:
    toks=[]; pos=0
    while pos < len(source):
        m=TOKEN_RE.match(source,pos)
        if not m:
            if source[pos:].strip()=="": break
            raise ArcaneParseError(f"unexpected character at offset {pos}")
        toks.append(m.group(1)); pos=m.end()
    return toks

def parse(source: str) -> Expr:
    tokens=tokenize(source); i=0
    def atom() -> Expr:
        nonlocal i
        if i>=len(tokens): raise ArcaneParseError("unexpected end of input")
        t
```

_Excerpt truncated at 1,800 characters; full length 4207 characters._

### Arcane_Phase_6S_Typed_Expression_Integration/arcane_reference_validator.py

- Type: PY
- SHA-256: `3dd320f69c3a0dde07fa70c6af3b023b339622ff17e9f712cc1b77df86fa62c9`
- Extracted characters: 5280

```text
#!/usr/bin/env python3
"""Arcane Phase 5.7 reference validator (not a full Arcane parser/compiler).

Audit notation: OPERATOR⟨argument, argument, ...⟩
Typed atoms: Q:length, Q:time, Q:dimensionless, V:3d, Bool, Comparable,
             Criterion, LiveExpr, Reference, Expr
Nested expressions may be supplied as operator expressions.

Examples:
  python arcane_reference_validator.py 'FRAPA⟨Q:length, Q:length⟩'
  python arcane_reference_validator.py 'FRATA⟨Q:length, Q:length⟩'

This validates a small, explicitly provisional signature subset. It does not parse
ordinary spoken Arcane, establish all quantity semantics, or execute mana effects.
"""
import re
import sys
from dataclasses import dataclass

ALIASES = {
    'frata': 'fraja', 'fraka': 'frama', 'drim': 'drum',
    'ren': 'ben', 'grak': 'grash', 'kwak': 'kwash', 'dral': 'dras',
}

@dataclass(frozen=True)
class Sig:
    arity: int
    inputs: tuple
    output: str
    note: str = ''

SIGS = {
    'frapa': Sig(2, ('Quantity', 'Quantity'), 'Quantity', 'Addition; compatible dimensions and semantic kinds required.'),
    'fraja': Sig(2, ('Quantity', 'Quantity'), 'Quantity', 'Subtraction; operand order is significant.'),
    'frama': Sig(2, ('Quantity', 'Quantity'), 'Quantity', 'Multiplication; dimensional algebra required.'),
    'dran': Sig(1, ('Vector',), 'Quantity', 'Magnitude; output nonnegative.'),
    'drem': Sig(2, ('Vector', 'Vector'), 'Quantity', 'Dot product; compatible frames and dimensions required.'),
    'drum': Sig(2, ('Vector3', 'Vector3'), 'Vector3', 'Cross product; Phase 4 D-017 frame rule applies.'),
    'dras': Sig(3, ('Comparable', 'Comparable', 'Criterion'), 'Boolean', 'Criterion encoding remains unresolved.'),
    'grash': Sig(1, ('Boolean',), 'Boolean', 'Provisional NOT signature.'),
    'kwash': Sig
```

_Excerpt truncated at 1,800 characters; full length 5280 characters._

### Arcane_Phase_6S_Typed_Expression_Integration/arcane_typed_runtime.py

- Type: PY
- SHA-256: `3981eed988e90b23fc4380f6c314c87152396f443dca6f289721229eaaee2de2`
- Extracted characters: 2578

```text
"""Phase 6S typed evaluator integration prototype.

This is a provisional bridge between the Phase 6P/6Q expression AST and the
Phase 6R Quantity model. QuantityLiteral is a test-harness AST node, not a new
canonical surface-language construct.
"""
from __future__ import annotations
from dataclasses import dataclass
from decimal import Decimal
from typing import Union

from arcane_reference_runtime import Number, Boolean, Call, Expr, ArcaneRuntimeError
from arcane_dimensions import Quantity, Dimension, DimensionError, DIMENSIONLESS

class TypedEvaluationError(ArcaneRuntimeError):
    """A typed expression could not be evaluated under the provisional contract."""

@dataclass(frozen=True)
class QuantityLiteral:
    quantity: Quantity

TypedExpr = Union[Expr, QuantityLiteral]

def _eval(node: TypedExpr):
    if isinstance(node, QuantityLiteral):
        return node.quantity
    if isinstance(node, Number):
        return Quantity(node.value, DIMENSIONLESS)
    if isinstance(node, Boolean):
        return node.value
    if not isinstance(node, Call):
        raise TypedEvaluationError(f"unsupported typed AST node: {type(node).__name__}")

    values = [_eval(arg) for arg in node.args]
    op = node.operator
    if op in {"frapa", "fraja", "frama", "frala", "frasha"}:
        if not all(isinstance(v, Quantity) for v in values):
            raise TypedEvaluationError(f"{op} requires numeric quantities")
        try:
            if op == "frapa": return values[0].add(values[1])
            if op == "fraja": return values[0].subtract(values[1])
            if op == "frama": return values[0].multiply(values[1])
            if op == "frala": return values[0].divide(values[1])
            return values[0].negate()
        except DimensionError as exc:
            raise TypedEvalua
```

_Excerpt truncated at 1,800 characters; full length 2578 characters._

### Arcane_Phase_6S_Typed_Expression_Integration/build_phase512.py

- Type: PY
- SHA-256: `b0ab34c77fa0e698fd848b47241cc7e6f1a704a1e82c1293aab127871563895d`
- Extracted characters: 16065

```text
import csv,json,zipfile,os
from pathlib import Path
base=Path('/mnt/data')
rows=[]
def add(form,gloss,arity,inputs,output,dim,status,source,aliases='',evals='',failure='',notes=''):
 rows.append(dict(form=form,gloss=gloss,arity=arity,inputs=inputs,output=output,dimensional_rule=dim,status=status,source=source,aliases=aliases,evaluation=evals,failure=failure,notes=notes))
# Expression operators: conservative contracts, explicitly provisional where evidence incomplete
add('frapa','add',2,'Quantity[d] × Quantity[d]','Quantity[d]','same dimensions required; unit conversion allowed','CANON form; signature PROVISIONAL','v3.0-L; Phase 2','', 'eager, pure','reject dimension mismatch','Addition is not defined for arbitrary semantic kinds.')
add('fraja','subtract',2,'Quantity[d] × Quantity[d]','Quantity[d]','same dimensions required','RENAMED form; signature PROVISIONAL','Phase 4 §5; v4/v5 lexicon','frata','eager, pure','reject dimension mismatch','Old form retained as alias for source compatibility; canonical output spelling is fraja.')
add('frama','multiply',2,'Quantity[d1] × Quantity[d2]','Quantity[d1·d2]','dimensions multiply','RENAMED form; signature PROVISIONAL','Phase 4 §5; v4/v5 lexicon','fraka','eager, pure','reject unsupported semantic kinds','Old form retained as alias; dimensional algebra required.')
add('frala','divide',2,'Quantity[d1] × Quantity[d2]','Quantity[d1/d2]','dimensions divide; zero denominator invalid','CANON form; signature PROVISIONAL','v3.0-L; Phase 2','', 'eager, pure','division by zero rejects','Dimensionless ratio is possible when dimensions cancel.')
add('frasha','negate',1,'Numeric quantity or numeric scalar','Same type as input','preserve dimensions','CANON form; signature PROVISIONAL','v3.0-L; Phase 2','', 'eager, pure','reject non-numeric input
```

_Excerpt truncated at 1,800 characters; full length 16065 characters._

### Arcane_Phase_6S_Typed_Expression_Integration/phase4_finalize.txt

- Type: TXT
- SHA-256: `086122ac5568183db4e5bc5ae38d5933057a096a015ae8b7d8e88f3f09cf7209`
- Extracted characters: 7852

```text
#!/usr/bin/env python3
"""Phase 4: assemble the draft lexicon, run example/numeral tests, write CSV + results JSON."
import json, csv, sys
sys.path.insert(0, "/home/claude")
import arcane_lexicon_tools as T
import arcane_phase3_checker as P3


R = json.load(open("/home/claude/phase4_report.json"))
canon, roots = R["canon"], R["roots"]
disp = lambda w: w.replace("ʃ", "sh").replace("ŋ", "ng")


# ---- extra quantity-slot literals (dimensionless unit, bit): best CV outside every other li
used = {e["form"] for e in canon} | {"wi", "we", "mə", "me", "ne", "nə", "re", "rə", "ra", "r
num = [e["form"] for e in canon if e["group"] == "NUM"]
cands = []
for o in T.CONSONANTS - {"ŋ", "h", "j", "w", "z"}:
    for v in "aeiou":
        w = o + v
        if w in used or T.syllabify(w)[1]: continue
        cands.append((round(min(T.dist(w, n) for n in num), 2), w))
cands.sort(reverse=True)
DIMLESS, BIT = "ʃo", "vo"
assert T.dist(DIMLESS, BIT) >= 2.0 and all(T.dist(BIT, n) >= 2.0 for n in num) and all(T.dist
print("literal candidates:", cands[:8], "->", DIMLESS, BIT)


rows = []
orig = {"drum": "drim", "ben": "ren", "fraja": "frata", "frama": "fraka", "graʃ": "grak", "kw
BARE = {"mi": "mə", "ni": "nə", "ri": "rə"}
for e in canon:
    if e["form"] in BARE:
        rows.append(dict(form=f"{e['form'].upper()} (formal)", gloss=e["gloss"] + " (unscoped
        continue
    note = f"was {disp(orig[e['form']])}" if e["form"] in orig else ""
    rows.append(dict(form=disp(e["form"]), gloss=e["gloss"], cls=e["cls"], status=e["status"]
for k, w in roots.items():
    g = next(c[1] for c in T.NEW_CONCEPTS if c[0] == k); cl = next(c[2] for c in T.NEW_CONCEP
    rows.append(dict(form=disp(w), gloss=g, cls=cl, status="PROPOSED", source="Phase 4", note
rows.append(dict(form=disp(DIMLESS), gloss="dimens
```

_Excerpt truncated at 1,800 characters; full length 7852 characters._

### Arcane_Phase_6S_Typed_Expression_Integration/phase5_doc.json

- Type: JSON
- SHA-256: `f0af6cdf2699baeb73fc33ffc801869be8c877c8de9aaf67808296cd781c2c8d`
- Extracted characters: 12122

```text
{
 "forms": {
  "Q": "pun",
  "POL": "lap",
  "RESP": "jus",
  "EMPH": "fut",
  "TOP": "wit",
  "PERF": "don",
  "PROG": "kok",
  "HELLO": "zis",
  "BYE": "lal",
  "THANKS": "sil",
  "SORRY": "nong",
  "PLEASE": "val",
  "YES": "wang",
  "NO": "kor",
  "MAYBE": "gep",
  "WHO": "shuk",
  "WHAT": "zosh",
  "WHERE": "ving",
  "WHEN": "zul",
  "WHY": "gir",
  "HOW": "jup",
  "IN": "desh",
  "WITH": "ding",
  "FOR": "push",
  "ABOUT": "buk",
  "THAN": "ges",
  "BUT": "was",
  "BECAUSE": "song",
  "SO": "vil",
  "GO": "ful",
  "COME": "zem",
  "SEE": "wish",
  "HEAR": "nak",
  "SAY": "zir",
  "KNOW": "shus",
  "WANT": "kong",
  "NEED": "tek",
  "CAN": "fam",
  "MAKE": "shan",
  "GIVE": "bul",
  "TAKE": "lil",
  "EAT": "mol",
  "DRINK": "tut",
  "SLEEP": "zop",
  "LIVE": "wem",
  "DIE": "lus",
  "FIGHT": "lup",
  "HELP": "las",
  "LOVE": "gus",
  "FEAR": "nash",
  "THINK": "sish",
  "REMEMBER": "bum",
  "FORGET": "shep",
  "LEARN": "mos",
  "TEACH": "pup",
  "LAUGH": "tir",
  "CRY": "shash",
  "RUN": "war",
  "WAIT": "shem",
  "FIND": "mop",
  "LOSE": "tul",
  "PERSON": "teshi",
  "FRIEND": "fezo",
  "FAMILY": "samo",
  "MOTHER": "juwe",
  "FATHER": "woju",
  "CHILD": "toga",
  "TEACHER": "reki",
  "STUDENT": "shefo",
  "NAME": "dase",
  "HOME": "gezi",
  "DOOR": "dosu",
  "ROAD": "wipo",
  "TOWN": "dine",
  "FOOD": "gisho",
  "WATER": "losa",
  "FIRE": "mije",
  "RAIN": "vuda",
  "WIND": "diba",
  "SUN": "tedi",
  "MOON": "zoge",
  "NIGHT": "zujo",
  "DAY": "domu",
  "MONEY": "mawo",
  "BOOK": "fape",
  "WORD": "rawu",
  "STORY": "wule",
  "JOKE": "viso",
  "SONG": "zeba",
  "FACE": "rora",
  "HAND": "tore",
  "EYE": "lefi",
  "HEART": "mubi",
  "MAGE": "vusi",
  "SPELL": "mewa",
  "MANA": "sopu",
  "NULL": "zufo",
  "GOOD": "wire",
  "BAD": "meka",
  "BIG": "wavo",
  "SMALL"
```

_Excerpt truncated at 1,800 characters; full length 12122 characters._

### Arcane_Phase_6S_Typed_Expression_Integration/phase5_report.json

- Type: JSON
- SHA-256: `b7cb5214dd6ad14067a6ab9f972980e1e49378520d838a52b5e589f6b38eeb4f`
- Extracted characters: 3587

```text
{
 "forms": {
  "Q": "pun",
  "POL": "lap",
  "RESP": "jus",
  "EMPH": "fut",
  "TOP": "wit",
  "PERF": "don",
  "PROG": "kok",
  "HELLO": "zis",
  "BYE": "lal",
  "THANKS": "sil",
  "SORRY": "noŋ",
  "PLEASE": "val",
  "YES": "waŋ",
  "NO": "kor",
  "MAYBE": "gep",
  "WHO": "ʃuk",
  "WHAT": "zoʃ",
  "WHERE": "viŋ",
  "WHEN": "zul",
  "WHY": "gir",
  "HOW": "jup",
  "IN": "deʃ",
  "WITH": "diŋ",
  "FOR": "puʃ",
  "ABOUT": "buk",
  "THAN": "ges",
  "BUT": "was",
  "BECAUSE": "soŋ",
  "SO": "vil",
  "GO": "ful",
  "COME": "zem",
  "SEE": "wiʃ",
  "HEAR": "nak",
  "SAY": "zir",
  "KNOW": "ʃus",
  "WANT": "koŋ",
  "NEED": "tek",
  "CAN": "fam",
  "MAKE": "ʃan",
  "GIVE": "bul",
  "TAKE": "lil",
  "EAT": "mol",
  "DRINK": "tut",
  "SLEEP": "zop",
  "LIVE": "wem",
  "DIE": "lus",
  "FIGHT": "lup",
  "HELP": "las",
  "LOVE": "gus",
  "FEAR": "naʃ",
  "THINK": "siʃ",
  "REMEMBER": "bum",
  "FORGET": "ʃep",
  "LEARN": "mos",
  "TEACH": "pup",
  "LAUGH": "tir",
  "CRY": "ʃaʃ",
  "RUN": "war",
  "WAIT": "ʃem",
  "FIND": "mop",
  "LOSE": "tul",
  "PERSON": "teʃi",
  "FRIEND": "fezo",
  "FAMILY": "samo",
  "MOTHER": "juwe",
  "FATHER": "woju",
  "CHILD": "toga",
  "TEACHER": "reki",
  "STUDENT": "ʃefo",
  "NAME": "dase",
  "HOME": "gezi",
  "DOOR": "dosu",
  "ROAD": "wipo",
  "TOWN": "dine",
  "FOOD": "giʃo",
  "WATER": "losa",
  "FIRE": "mije",
  "RAIN": "vuda",
  "WIND": "diba",
  "SUN": "tedi",
  "MOON": "zoge",
  "NIGHT": "zujo",
  "DAY": "domu",
  "MONEY": "mawo",
  "BOOK": "fape",
  "WORD": "rawu",
  "STORY": "wule",
  "JOKE": "viso",
  "SONG": "zeba",
  "FACE": "rora",
  "HAND": "tore",
  "EYE": "lefi",
  "HEART": "mubi",
  "MAGE": "vusi",
  "SPELL": "mewa",
  "MANA": "sopu",
  "NULL": "zufo",
  "GOOD": "wire",
  "BAD": "meka",
  "BIG": "wavo",
  "SMALL": "lovi",
  "NEW": "di
```

_Excerpt truncated at 1,800 characters; full length 3587 characters._

### Arcane_Phase_6S_Typed_Expression_Integration/phase5_vernacular_original.py

- Type: PY
- SHA-256: `eb1901b4c433af94dee61c5e1a6e0f6021edbbca2873eb3215744c2b85801505`
- Extracted characters: 11069

```text
#!/usr/bin/env python3
"""
ARCANE LANGUAGE AUDIT - PHASE 5 (vernacular register).
Builds a seeded vernacular lexicon that is legal under the Phase 4 phonology and at
least 2.0 (feature heuristic) from every formal form and every other vernacular form,
assembles interlinear sample sentences from concept keys, and checks them.
Heuristic distances are NOT listener tests.
"""
import csv, json, random, sys
sys.path.insert(0, "/home/claude")
import arcane_lexicon_tools as T

disp = lambda w: w.replace("ʃ", "sh").replace("ŋ", "ng")

# ---------------------------------------------------------------- formal forms already taken
rows4 = list(csv.DictReader(open("/mnt/user-data/outputs/Arcane_Lexicon_v4_draft.csv", encoding="utf-8")))
formal_forms = [r["form"] for r in rows4 if "(formal)" not in r["form"] and not r["form"].endswith("-") and r["cls"] != "CLITIC"]
by_gloss = {}
for r in rows4: by_gloss.setdefault(r["gloss"], r["form"])
SHARED = {   # closed-class words shared with the formal register
    "I": "mi", "you": "ri", "this/it": "su", "we": "ni", "everyone": "wo",
    "and": by_gloss["and"], "or": by_gloss["or"], "not": by_gloss["not"], "if": by_gloss["if"],
    "while": by_gloss["while"], "until": by_gloss["until (until)"] if "until (until)" in by_gloss else by_gloss["until"],
    "toward": "jo", "away from": "jur", "left": "pa", "right": "ba", "down": "ta", "up": "da", "back": "ka", "front": "ga",
    "now": by_gloss["now (instant of evaluation)"], "before": by_gloss["before"], "after": by_gloss["after"],
    "all": by_gloss["for all"], "some": by_gloss["exists (any)"],
}
for k in ["0","1","2","3","4","5","6","7","8","9"]:
    SHARED[k] = by_gloss[k]

# ---------------------------------------------------------------- concepts: (key, gloss, class, shape)
C = []
def cl(cls,
```

_Excerpt truncated at 1,800 characters; full length 11069 characters._

### Arcane_Phase_6S_Typed_Expression_Integration/phase5_vernacular_portable.py

- Type: PY
- SHA-256: `0b05d61cb4893e75aba0a6744b73945f1017c54a622f8225cd6a1b4e476846d6`
- Extracted characters: 11130

```text
#!/usr/bin/env python3
"""
ARCANE LANGUAGE AUDIT - PHASE 5 (vernacular register).
Builds a seeded vernacular lexicon that is legal under the Phase 4 phonology and at
least 2.0 (feature heuristic) from every formal form and every other vernacular form,
assembles interlinear sample sentences from concept keys, and checks them.
Heuristic distances are NOT listener tests.
"""
import csv, json, random, sys
from pathlib import Path
BASE = Path(__file__).resolve().parent
sys.path.insert(0, str(BASE))
import arcane_lexicon_tools as T

disp = lambda w: w.replace("ʃ", "sh").replace("ŋ", "ng")

# ---------------------------------------------------------------- formal forms already taken
rows4 = list(csv.DictReader(open(BASE / "Arcane_Lexicon_v4_draft.csv", encoding="utf-8")))
formal_forms = [r["form"] for r in rows4 if "(formal)" not in r["form"] and not r["form"].endswith("-") and r["cls"] != "CLITIC"]
by_gloss = {}
for r in rows4: by_gloss.setdefault(r["gloss"], r["form"])
SHARED = {   # closed-class words shared with the formal register
    "I": "mi", "you": "ri", "this/it": "su", "we": "ni", "everyone": "wo",
    "and": by_gloss["and"], "or": by_gloss["or"], "not": by_gloss["not"], "if": by_gloss["if"],
    "while": by_gloss["while"], "until": by_gloss["until (until)"] if "until (until)" in by_gloss else by_gloss["until"],
    "toward": "jo", "away from": "jur", "left": "pa", "right": "ba", "down": "ta", "up": "da", "back": "ka", "front": "ga",
    "now": by_gloss["now (instant of evaluation)"], "before": by_gloss["before"], "after": by_gloss["after"],
    "all": by_gloss["for all"], "some": by_gloss["exists (any)"],
}
for k in ["0","1","2","3","4","5","6","7","8","9"]:
    SHARED[k] = by_gloss[k]

# ---------------------------------------------------------------- concepts: (k
```

_Excerpt truncated at 1,800 characters; full length 11130 characters._

### Arcane_Phase_6S_Typed_Expression_Integration/phase6o_generator_stdout.txt

- Type: TXT
- SHA-256: `2b365fb9967778ca63a0cb4edfe37b4c988fe99b1d8a5dfabec8944122144fcf`
- Extracted characters: 5709

```text
P5-T01 PASS All 115 vernacular forms are phonotactically legal []
P5-T02 PASS No vernacular form equals a formal form 
P5-T03 PASS No two vernacular forms are identical 
P5-T04 PASS Every vernacular form is at least 2.0 from every formal form (heuristic) minimum 2.00
P5-T05 PASS Every vernacular pair is at least 2.0 apart (heuristic) minimum 2.00
P5-T06 PASS Every shared closed-class word is an actual form in the formal lexicon []
P5-T07 PASS All 25 sample sentences use only defined words []
rows: 255 | vernacular roots: 115 | passed 7 / 7
Greeting               zis                                      | hello | Hello.
Thanks                 sil ri                                   | thanks you | Thank you.
Predicate adjective    gaje mi                                  | tired I | I am tired.
Yes/no question        gaje ri pun                              | tired you question particle (yes/no) | Are you tired?
Negation               grash kong mi mol gisho                  | not want I eat food | I don't want to eat food.
Plain statement        zir reki                                 | say teacher | The teacher speaks.
WH predicate           ving dosu                                | where door | Where is the door?
Past with a time word  vote las shuk ri                         | before help who you | Who helped you?
Possession             mos fezo mi mewa                         | learn friend I spell (a construction) | My friend learns spells.
Direction              zem jo mi                                | come toward I | Come toward me.
Polite request         bul mi losa lap                          | give I water polite particle | Give me water, please (polite).
Respectful thanks      sil ri jus                               | thanks you respectful particle | Th
```

_Excerpt truncated at 1,800 characters; full length 5709 characters._

### Arcane_Phase_6S_Typed_Expression_Integration/PHASE_1_README.txt

- Type: TXT
- SHA-256: `c57059c69ada9fd7976cbb940b249fcb63dda83ee2ab1a2e197217aae1b3f250`
- Extracted characters: 437

```text
ARCANE LANGUAGE AUDIT — PHASE 1

This document reconciles the surface syntax formula in v3.0-L with the operational spell specification formula in Magic System v3.0 by treating them as different layers.
It records proposed organisation and unresolved decisions without silently changing canon.
Next: define a minimal formal expression notation, operator signatures, argument boundaries and modifier scope; then test existing vocabulary.
```

### Arcane_Phase_6S_Typed_Expression_Integration/PHASE_2_README 2.txt

- Type: TXT
- SHA-256: `3377d1edd6bf5e86b4d0e9669ff315701dd452c6087506917ff4f6dfcc512d06`
- Extracted characters: 437

```text
ARCANE LANGUAGE AUDIT — PHASE 2

Contains a provisional audit notation and a first-pass operator signature register.
Angle brackets and commas are meta-notation for auditing, not canonical Arcane words.
All signatures are provisional where marked. No compiler was run and no test is claimed as an executed software test.
Next: type inventory, dimensional arithmetic, comparison criteria, modifier scope, and recovery of v2.0 morphology.
```

### Arcane_Phase_6S_Typed_Expression_Integration/PHASE_5_24_DECISION_RECORD.md

- Type: MD
- SHA-256: `134664845fadda179a38f0dc44d597cfa5da92a969dd208412fae1ba37b318f8`
- Extracted characters: 1447

```text
# Decision Record — Phase 5.24

- **Decision ID:** D-051 (proposed; not canon until owner approval)
- **Existing rule/source:** Canonical Arcane v3.0-L names `KWAM` as create binding, `KWAT` as reference binding, and `KWAK` as live evaluation. Exact evaluation, capture, and lifetime semantics were unresolved in the recovery audit.
- **Concrete gap:** The three operators could be implemented inconsistently, making it unclear whether a later read returns an old value or recomputes from a changing input.
- **Options considered:**
  - A. Value-only binding: declaration evaluates and stores a value; no live expression exists.
  - B. Expression-only binding: declaration stores an expression; every reference evaluates it.
  - C. Dual binding (prototype): declaration stores both the defining expression and its captured value; `KWAT` reads the captured value and `KWAK` reevaluates the expression.
- **Prototype choice:** C, because it operationalises the canonical distinction between reference and live evaluation without collapsing them.
- **Tests:** P5.24-T01 through T10; all 10 pass in the Python prototype.
- **Limitations:** The prototype currently treats bindings as non-overwritable within one scope and external inputs as live sources. Nested scopes, shadowing, cycles, and forward references are not implemented.
- **Decision:** PROVISIONAL. Do not mark this rule canon until the owner explicitly accepts it.
- **Date:** 2026-10-12
```

### Arcane_Phase_6S_Typed_Expression_Integration/PHASE_5_24_README.md

- Type: MD
- SHA-256: `277d3ba317fb8ac35ac4e52535eaec2cb89770dac19e0eb098e508adcf21cd35`
- Extracted characters: 4249

```text
# Arcane Language Audit — Phase 5.24
## Symbol tables, binding resolution, and captured/live evaluation

**Status:** PROTOTYPE IMPLEMENTED; 10/10 included regression tests pass.
**Canon status:** PROVISIONAL semantics for engineering tests only. This phase does not overwrite v3.0-L canon or claim to recover missing v2.0 morphology.

## Purpose
Phase 5.24 gives operational, testable behaviour to the existing vocabulary `KWAM` (bind), `KWAT` (reference), and `KWAK` (live evaluation). It distinguishes declaration, captured value, and re-evaluation, while rejecting undefined names, duplicate declarations, type-invalid arithmetic, division by zero, and malformed arity.

## Diagnostic notation supported
- `KWAM⟨X, FRAPA⟨KI, TO⟩⟩` declares `X` and captures the result of `1 + 2`.
- `KWAT⟨X⟩` returns the captured value.
- `KWAK⟨X⟩` re-evaluates X's defining expression against the current external inputs.
- External inputs are passed to the test harness as a JSON object, e.g. `{"POSITION": 4}`.
- Quantity examples may include units, e.g. `2:MA` for 2 metres and `1:SE` for 1 second.

Angle brackets and commas are audit notation only; they are not declared Arcane words or proof of a valid spoken surface grammar.

## Provisional semantics selected for this prototype
1. `KWAM⟨name, expression⟩` evaluates the right-hand expression first, then stores both the expression and its resulting value. If evaluation fails, no binding is created.
2. A declaration cannot overwrite a name already declared in the same scope.
3. `KWAT⟨name⟩` returns the value captured at declaration time.
4. `KWAK⟨name⟩` re-evaluates the stored expression against the current external input environment.
5. Unknown names are errors; the evaluator never guesses.
6. `FRAPA` and `FRATA` require matching dimensions. `FRA
```

_Excerpt truncated at 1,800 characters; full length 4249 characters._

### Arcane_Phase_6S_Typed_Expression_Integration/PHASE_5_24_TEST_RESULTS.json

- Type: JSON
- SHA-256: `ea6bad2ddba66146dab3646e892dd094e5dc050aac5d594126718dc540d0f70d`
- Extracted characters: 1920

```text
[
  {
    "id": "P5.24-T01",
    "status": "PASS",
    "description": "KWAM declares a binding and KWAT reads captured value",
    "detail": "declaration=3 [1]; KWAT=3 [1]"
  },
  {
    "id": "P5.24-T02",
    "status": "PASS",
    "description": "KWAK reevaluates a stored expression against changed inputs",
    "detail": "KWAT=4 [L]; KWAK after update=9 [L]"
  },
  {
    "id": "P5.24-T03",
    "status": "PASS",
    "description": "Undefined binding is rejected",
    "detail": "rejected: Undefined binding 'MISSING'"
  },
  {
    "id": "P5.24-T04",
    "status": "PASS",
    "description": "Duplicate declaration in same scope is rejected",
    "detail": "rejected: Duplicate declaration 'X' in the same scope"
  },
  {
    "id": "P5.24-T05",
    "status": "PASS",
    "description": "Dimension mismatch during live evaluation is rejected",
    "detail": "rejected: FRAPA requires matching dimensions; got L and T"
  },
  {
    "id": "P5.24-T06",
    "status": "PASS",
    "description": "Division by zero is rejected",
    "detail": "rejected: FRALA division by zero"
  },
  {
    "id": "P5.24-T07",
    "status": "PASS",
    "description": "Declaration is atomic if its RHS fails",
    "detail": "failed RHS left no X binding"
  },
  {
    "id": "P5.24-T08",
    "status": "PASS",
    "description": "Captured value stays stable after external input changes",
    "detail": "captured=2 [1]; live=7 [1]"
  },
  {
    "id": "P5.24-T09",
    "status": "PASS",
    "description": "Nested arithmetic inside a binding preserves parse structure",
    "detail": "{'expression': 'KWAM\u27e8X, FRAPA\u27e8KI, FRAPA\u27e8TO, MU\u27e9\u27e9\u27e9', 'result': '6 [1]', 'events': [{'event': 'declare', 'name': 'X', 'captured': '6 [1]'}]}"
  },
  {
    "id": "P5.24-T10",
    "status": "PASS",
    "descriptio
```

_Excerpt truncated at 1,800 characters; full length 1920 characters._

### Arcane_Phase_6S_Typed_Expression_Integration/Phase_5_6_v4_test_results.txt

- Type: TXT
- SHA-256: `df0a7bc74a0548cb6b4a6ef1d2000b393d521cf3e4f64cb670f381d7779a3b69`
- Extracted characters: 3749

```text
PASS | LEXICON_READABLE | 140 rows loaded from Arcane_Lexicon_v4_draft.csv
PASS | REGISTRY_READABLE | 7 alias rows loaded
PASS | EXPECTED_ALIAS_SET | expected ['dral', 'drim', 'fraka', 'frata', 'grak', 'kwak', 'ren']; found ['dral', 'drim', 'fraka', 'frata', 'grak', 'kwak', 'ren']
PASS | NO_ALIAS_SELF_MAP | each legacy spelling maps to a distinct preferred spelling
PASS | ALIAS_TARGET:frata | frata -> fraja; expected fraja
PASS | PREFERRED_EXISTS:fraja | preferred form exists in lexicon
PASS | PREFERRED_GLOSS:fraja | expected meaning compatible with 'subtract'
PASS | LEGACY_NOT_SEPARATE_LEXEME:frata | legacy form absent as independent lexicon entry; registry remains the compatibility layer
PASS | RESOLVE_PRESERVES_SOURCE:frata | source token FRATA can be retained; lookup key fraja
PASS | ALIAS_TARGET:fraka | fraka -> frama; expected frama
PASS | PREFERRED_EXISTS:frama | preferred form exists in lexicon
PASS | PREFERRED_GLOSS:frama | expected meaning compatible with 'multiply'
PASS | LEGACY_NOT_SEPARATE_LEXEME:fraka | legacy form absent as independent lexicon entry; registry remains the compatibility layer
PASS | RESOLVE_PRESERVES_SOURCE:fraka | source token FRAKA can be retained; lookup key frama
PASS | ALIAS_TARGET:drim | drim -> drum; expected drum
PASS | PREFERRED_EXISTS:drum | preferred form exists in lexicon
PASS | PREFERRED_GLOSS:drum | expected meaning compatible with 'cross product'
PASS | LEGACY_NOT_SEPARATE_LEXEME:drim | legacy form absent as independent lexicon entry; registry remains the compatibility layer
PASS | RESOLVE_PRESERVES_SOURCE:drim | source token DRIM can be retained; lookup key drum
PASS | ALIAS_TARGET:ren | ren -> ben; expected ben
PASS | PREFERRED_EXISTS:ben | preferred form exists in lexicon
PASS | PREFERRED_GLOSS:ben | expected meaning compa
```

_Excerpt truncated at 1,800 characters; full length 3749 characters._

### Arcane_Phase_6S_Typed_Expression_Integration/Phase_5_6_v5_test_results.txt

- Type: TXT
- SHA-256: `2e371530c6b04a91c02723c61771ac5e8dc1daedd329abfa64e54c59a888f323`
- Extracted characters: 3749

```text
PASS | LEXICON_READABLE | 255 rows loaded from Arcane_Lexicon_v5_draft.csv
PASS | REGISTRY_READABLE | 7 alias rows loaded
PASS | EXPECTED_ALIAS_SET | expected ['dral', 'drim', 'fraka', 'frata', 'grak', 'kwak', 'ren']; found ['dral', 'drim', 'fraka', 'frata', 'grak', 'kwak', 'ren']
PASS | NO_ALIAS_SELF_MAP | each legacy spelling maps to a distinct preferred spelling
PASS | ALIAS_TARGET:frata | frata -> fraja; expected fraja
PASS | PREFERRED_EXISTS:fraja | preferred form exists in lexicon
PASS | PREFERRED_GLOSS:fraja | expected meaning compatible with 'subtract'
PASS | LEGACY_NOT_SEPARATE_LEXEME:frata | legacy form absent as independent lexicon entry; registry remains the compatibility layer
PASS | RESOLVE_PRESERVES_SOURCE:frata | source token FRATA can be retained; lookup key fraja
PASS | ALIAS_TARGET:fraka | fraka -> frama; expected frama
PASS | PREFERRED_EXISTS:frama | preferred form exists in lexicon
PASS | PREFERRED_GLOSS:frama | expected meaning compatible with 'multiply'
PASS | LEGACY_NOT_SEPARATE_LEXEME:fraka | legacy form absent as independent lexicon entry; registry remains the compatibility layer
PASS | RESOLVE_PRESERVES_SOURCE:fraka | source token FRAKA can be retained; lookup key frama
PASS | ALIAS_TARGET:drim | drim -> drum; expected drum
PASS | PREFERRED_EXISTS:drum | preferred form exists in lexicon
PASS | PREFERRED_GLOSS:drum | expected meaning compatible with 'cross product'
PASS | LEGACY_NOT_SEPARATE_LEXEME:drim | legacy form absent as independent lexicon entry; registry remains the compatibility layer
PASS | RESOLVE_PRESERVES_SOURCE:drim | source token DRIM can be retained; lookup key drum
PASS | ALIAS_TARGET:ren | ren -> ben; expected ben
PASS | PREFERRED_EXISTS:ben | preferred form exists in lexicon
PASS | PREFERRED_GLOSS:ben | expected meaning compa
```

_Excerpt truncated at 1,800 characters; full length 3749 characters._

### Arcane_Phase_6S_Typed_Expression_Integration/PHASE_5_README 2.txt

- Type: TXT
- SHA-256: `9f57f105f11b3975c5046b2dfb838ed3d97cfb607822439a6c18491893b6c13d`
- Extracted characters: 1196

```text
ARCANE LANGUAGE AUDIT — PHASE 5: the vernacular register

Files
- Arcane_Language_Audit_Phase_5.docx: register map (vernacular, technical, formal, performed), vernacular grammar G-V1 to G-V10, casual-speech rules, shared closed classes, the 115-root vernacular lexicon, 25 interlinear sample sentences, 5 idioms, checks, ledger entries D-042 to D-050.
- Arcane_Lexicon_v5_draft.csv: the combined lexicon (255 rows) with a register column (Formal, Performed, Shared, Vernacular).
- phase5_vernacular.py: the generator and checks. It reads the Phase 4 lexicon CSV and the Phase 4 tools from the working folder, so treat it as a record of the checks, not a packaged tool.

Status
Decided under the owner's delegation. Vernacular roots are chosen by a seeded search (seed 5105), so the sounds are arbitrary. 7 of 7 mechanical checks passed (legality, uniqueness, heuristic distance from every formal form, sample sentences use only defined words). Nothing has been tested with listeners.

Owner decision flagged: zufo as slang for NULL.
Next: listener tests; grow the dictionary toward ~1,000 words; names and honorifics; historical layers; writing; a parser; optionally a viseme chart for lip-sync.
```

### Arcane_Phase_6S_Typed_Expression_Integration/PHASE_6H_TEST_RESULTS.txt

- Type: TXT
- SHA-256: `327e6aa1655f88b22c5405eff702d11d04ac16d6135ae10f471376e446296fb6`
- Extracted characters: 1385

```text
01. PASS — end-to-end addition: Type(kind='Number', unit='sho'); value=(Decimal('3'), 'sho')
02. PASS — nested arithmetic: Type(kind='Number', unit='sho'); value=(Decimal('5'), 'sho')
03. PASS — legacy alias: Type(kind='Number', unit='sho'); value=(Decimal('3'), 'sho')
04. PASS — unit mismatch caught by checker: TypeCheckError: FRAPA requires matching units, got ma and se
05. PASS — unterminated numeral rejected by parser: ParseError: Every numeral must terminate in a unit; use SHO for dimensionless values
06. PASS — missing METO rejected by parser: ParseError: BEK requires METO before its block
07. PASS — missing DOGU rejected by parser: ParseError: BEK block missing DOGU
08. PASS — unbound binding rejected by checker: TypeCheckError: Unbound identifier ID_1
09. PASS — stored binding roundtrip: Type(kind='Number', unit='sho'); value=(Decimal('3'), 'sho')
10. PASS — Boolean NOT: Type(kind='Boolean', unit=''); value=(True, 'bool')
11. PASS — Boolean AND: Type(kind='Boolean', unit=''); value=(True, 'bool')
12. PASS — Boolean OR: Type(kind='Boolean', unit=''); value=(True, 'bool')
13. PASS — division by zero caught at runtime: RuntimeArcaneError: Division by zero
14. PASS — unknown lexical form rejected: ParseError: Unknown lexical form 'notarealword'
15. PASS — trailing expression rejected: ParseError: Trailing tokens after complete expression
RESULT: 15/15 passed
```

### Arcane_Phase_6S_Typed_Expression_Integration/PHASE_6I_TEST_RESULTS.txt

- Type: TXT
- SHA-256: `ab59d5d5bb9b8d7f21597bdb97d5a9dff3b32b408b87f503f4d601ed80d064d2`
- Extracted characters: 2385

```text
01. PASS — addition preserves SHO: type=Type(kind='Number', unit='sho'); value=(Decimal('3'), 'sho'); expected=(Decimal('3'), 'sho')
02. PASS — subtraction preserves SHO: type=Type(kind='Number', unit='sho'); value=(Decimal('2'), 'sho'); expected=(Decimal('2'), 'sho')
03. PASS — dimensionless multiplication: type=Type(kind='Number', unit='sho'); value=(Decimal('2'), 'sho'); expected=(Decimal('2'), 'sho')
04. PASS — dimensionless divisor: type=Type(kind='Number', unit='sho'); value=(Decimal('1.5'), 'sho'); expected=(Decimal('1.5'), 'sho')
05. PASS — absolute value preserves unit: type=Type(kind='Number', unit='ma'); value=(Decimal('0'), 'ma'); expected=(Decimal('0'), 'ma')
06. PASS — addition rejects different unit labels: TypeCheckError: FRAPA requires matching units, got ma and se
07. PASS — subtraction rejects different unit labels: TypeCheckError: FRAJA requires matching units, got ma and se
08. PASS — multiplication rejects two labelled units: TypeCheckError: FRAMA dimensional multiplication is not enabled in this subset
09. PASS — division rejects labelled divisor: TypeCheckError: FRALA divisor must be dimensionless in this subset
10. PASS — division by zero is runtime error: RuntimeArcaneError: Division by zero
11. PASS — NOT true fixture: type=Type(kind='Boolean', unit=''); value=(False, 'bool'); expected=(False, 'bool')
12. PASS — NOT false fixture: type=Type(kind='Boolean', unit=''); value=(True, 'bool'); expected=(True, 'bool')
13. PASS — AND rejects number operands: TypeCheckError: GRAN requires Boolean operands
14. PASS — OR rejects number operands: TypeCheckError: GRAT requires Boolean operands
15. PASS — IF rejects non-Boolean condition: TypeCheckError: BEK condition must be Boolean
16. PASS — unclosed numeral rejected: ParseError: Every numeral must termi
```

_Excerpt truncated at 1,800 characters; full length 2385 characters._

### Arcane_Phase_6S_Typed_Expression_Integration/PHASE_6J_AUDIT_RESULTS.txt

- Type: TXT
- SHA-256: `dd752ddda73db7913c7b826bb17bc538c3dba4872ca8c756398520a648f07e2c`
- Extracted characters: 732

```text
Arcane Phase 6J source-backed registry audit

Registry rows: generated directly from Arcane_Lexicon_v5_draft.csv, preserving duplicate forms.
Semantic overrides: only for forms cross-referenced against the recovered Phase 4/5 audits, continuity recovery audit, decision ledger and grammar test register.
Canon changes: none.

Critical finding: FRASHA is glossed as NEGATE in recovered sources but the Phase 6H evaluator implements absolute value. Treat as an implementation/specification mismatch; do not mark the operator semantically validated.
Other status conflicts: SHO, METO and DOGU are relied on by Phase 4 grammar but marked PROPOSED in the Phase 5 draft lexicon; KOLE remains PROPOSED despite being used by the prototype.
```

### Arcane_Phase_6S_Typed_Expression_Integration/PHASE_6K_TEST_RESULTS.txt

- Type: TXT
- SHA-256: `dc121e9cb4da48eecfd4531d6043538aa28331fc49980c24d47626e0fc473823`
- Extracted characters: 634

```text
test_fractional_value (__main__.FrashaContractTests.test_fractional_value) ... ok
test_negative_to_positive (__main__.FrashaContractTests.test_negative_to_positive) ... ok
test_not_absolute_value (__main__.FrashaContractTests.test_not_absolute_value) ... ok
test_positive_to_negative (__main__.FrashaContractTests.test_positive_to_negative) ... ok
test_rejects_non_numeric_fixture (__main__.FrashaContractTests.test_rejects_non_numeric_fixture) ... ok
test_zero_remains_zero (__main__.FrashaContractTests.test_zero_remains_zero) ... ok

----------------------------------------------------------------------
Ran 6 tests in 0.000s

OK
```

### Arcane_Phase_6S_Typed_Expression_Integration/PHASE_6L_TEST_RESULTS.txt

- Type: TXT
- SHA-256: `8cc3272eb69f889802c3856e517747c5cc02ebfad7babcbd471e254fc39b81cc`
- Extracted characters: 647

```text
01. PASS — Arithmetic family covered: fraja, frala, frama, frapa, frasha
02. PASS — Logic family covered: gran, grash, grat
03. PASS — Vector operators covered where present in current lexicon: dran, drem, drum
04. PASS — Binding family covered: kwam, kwash, kwat
05. PASS — Control family covered: bek, kole, zet
06. PASS — Every registry row has evidence: 17/17
07. PASS — Every registry row has an open issue or explicit status: 17/17
08. PASS — Proposed KOLE is not marked canonical: KOLE remains proposed
09. PASS — FRASHA mismatch is explicitly flagged: reference mismatch retained as open issue
RESULT: 9/9 registry integrity checks passed
```

### Arcane_Phase_6S_Typed_Expression_Integration/PHASE_6M_EVIDENCE_CHECKS.txt

- Type: TXT
- SHA-256: `1b6256c7a3b8fc7e25c0f25322eb7b693fb57ae421f16c9304d20676e2635cbe`
- Extracted characters: 905

```text
01. PASS — Registry input available: Loaded Phase 6L operator registry
02. PASS — FRAPA binary contract documented: Registry documents FRAPA as binary; this checks metadata only, not parser enforcement
03. PASS — FRATA historical alias documented: Registry links current FRAJA to historical FRATA
04. PASS — Unique-parse rule present: Recovery audit states executable expressions require a unique parse
05. PASS — Fixed-arity rule present: Phase 4 records fixed arity and typed signatures as a grammar rule
06. PASS — Modifier scope rule present: Phase 4 documents clause-level modifier attachment
07. PASS — FRASHA source/runtime mismatch remains flagged: Registry still flags the earlier absolute-value implementation conflict
08. PASS — KOLE remains provisional: No silent canon promotion
RESULT: 8/8 evidence checks passed
NOTE: these are source/registry evidence checks, not passes for T-001..T-016.
```

### Arcane_Phase_6S_Typed_Expression_Integration/PHASE_6M_EXECUTION_STATUS.csv

- Type: CSV
- SHA-256: `58f84993145189f4a1df1240806302e3f91c4ed9e5ece6b6ef7fdafb1f36d433`
- Extracted characters: 1450

```text
test_id,status,reason
T-001,BLOCKED,Need current parser/runtime to verify missing/extra arguments; registry arity metadata is not execution.
T-002,BLOCKED,"Historical FRATA alias is documented, but runtime operand-order test is unavailable."
T-003,BLOCKED,Grouping semantics require executable parser and evaluated examples.
T-004,BLOCKED,Need ambiguity corpus and parser rejection/disambiguation tests.
T-005,BLOCKED,No clause/modifier parser available to exercise scope.
T-006,BLOCKED,Requires authoritative type environment and type-checker integration.
T-007,BLOCKED,SIMA/RI/VANU measurement completeness requires a formal signature and context model.
T-008,BLOCKED,"Registry documents binding forms, but the Phase 6H runtime source is unavailable for semantic execution."
T-009,BLOCKED,Temporal signatures are not complete in recovered materials.
T-010,BLOCKED,Control-flow runtime and termination contract are incomplete.
T-011,BLOCKED,Requires spoken/rapid-speech/noise listener testing; no audio/listener results supplied.
T-012,BLOCKED,Macro expansion and feasibility checker are not available in this package.
T-013,BLOCKED,Requires a construction mechanism model and feasibility checks.
T-014,BLOCKED,Requires a physical conservation/resource model.
T-015,BLOCKED,"Requires Logos substrate, memory, energy, bandwidth and interface cost model."
T-016,BLOCKED,Requires a defined numeric feasibility model and a concrete spell specification.
```

### Arcane_Phase_6S_Typed_Expression_Integration/PHASE_6O_VALIDATION_RESULTS.csv

- Type: CSV
- SHA-256: `08112b641ff705b9ecf9b4002b6e8186e4c1822f37bb32e2db1c004bb93dea28`
- Extracted characters: 1056

```text
id,status,title,detail
P5-T01,PASS,All 115 vernacular forms are phonotactically legal,[]
P5-T02,PASS,No vernacular form equals a formal form,
P5-T03,PASS,No two vernacular forms are identical,
P5-T04,PASS,Every vernacular form is at least 2.0 from every formal form (heuristic),minimum 2.00
P5-T05,PASS,Every vernacular pair is at least 2.0 apart (heuristic),minimum 2.00
P5-T06,PASS,Every shared closed-class word is an actual form in the formal lexicon,[]
P5-T07,PASS,All 25 sample sentences use only defined words,[]
P6O-V01,PASS,All seven original Phase 5 checks were emitted,P5-T01 through P5-T07 present in expected order
P6O-V02,PASS,Regenerated Phase 5 lexicon matches archived baseline byte-for-byte,archived_sha256=4b38aec651a32b332d4f28068d34618c4dfb2f043d44a2f03c146dba2e31ad8a; generated_sha256=4b38aec651a32b332d4f28068d34618c4dfb2f043d44a2f03c146dba2e31ad8a; archived_bytes=12621; generated_bytes=12621
P6O-V03,PASS,Both lexicons contain 255 data rows,archived=255; generated=255
P6O-V04,PASS,All seven original Phase 5 checks pass,7/7 PASS
```

### Arcane_Phase_6S_Typed_Expression_Integration/PHASE_6O_VALIDATION_RESULTS.json

- Type: JSON
- SHA-256: `7f079fdb1a61f2962329563ff8fd232ce7b0daccb2fde10625c72e3c187607a7`
- Extracted characters: 1817

```text
[
  {
    "id": "P5-T01",
    "status": "PASS",
    "title": "All 115 vernacular forms are phonotactically legal",
    "detail": "[]"
  },
  {
    "id": "P5-T02",
    "status": "PASS",
    "title": "No vernacular form equals a formal form",
    "detail": ""
  },
  {
    "id": "P5-T03",
    "status": "PASS",
    "title": "No two vernacular forms are identical",
    "detail": ""
  },
  {
    "id": "P5-T04",
    "status": "PASS",
    "title": "Every vernacular form is at least 2.0 from every formal form (heuristic)",
    "detail": "minimum 2.00"
  },
  {
    "id": "P5-T05",
    "status": "PASS",
    "title": "Every vernacular pair is at least 2.0 apart (heuristic)",
    "detail": "minimum 2.00"
  },
  {
    "id": "P5-T06",
    "status": "PASS",
    "title": "Every shared closed-class word is an actual form in the formal lexicon",
    "detail": "[]"
  },
  {
    "id": "P5-T07",
    "status": "PASS",
    "title": "All 25 sample sentences use only defined words",
    "detail": "[]"
  },
  {
    "id": "P6O-V01",
    "status": "PASS",
    "title": "All seven original Phase 5 checks were emitted",
    "detail": "P5-T01 through P5-T07 present in expected order"
  },
  {
    "id": "P6O-V02",
    "status": "PASS",
    "title": "Regenerated Phase 5 lexicon matches archived baseline byte-for-byte",
    "detail": "archived_sha256=4b38aec651a32b332d4f28068d34618c4dfb2f043d44a2f03c146dba2e31ad8a; generated_sha256=4b38aec651a32b332d4f28068d34618c4dfb2f043d44a2f03c146dba2e31ad8a; archived_bytes=12621; generated_bytes=12621"
  },
  {
    "id": "P6O-V03",
    "status": "PASS",
    "title": "Both lexicons contain 255 data rows",
    "detail": "archived=255; generated=255"
  },
  {
    "id": "P6O-V04",
    "status": "PASS",
    "title": "All seven original Phase 5 checks pass",
    "detail":
```

_Excerpt truncated at 1,800 characters; full length 1817 characters._

### Arcane_Phase_6S_Typed_Expression_Integration/PHASE_6R_STATUS.csv

- Type: CSV
- SHA-256: `e4b75e511f8d18a967675c32e5e8be75788ebad7a7d64af5b0ef8f4417183b0d`
- Extracted characters: 976

```text
Area,Status,Evidence,Limitations
Existing runtime regression,INCLUDED,Phase 6P and 6Q unit tests retained,Provisional parenthesised notation only
Dimension vector normalization,IMPLEMENTED,Phase 6R unit tests,Abstract symbols only
Addition/subtraction dimensions,IMPLEMENTED,Compatible dimensions accepted and incompatible rejected,No conversion between units
Multiplication/division dimensions,IMPLEMENTED,Exponents combined and cancelled,No physical-unit catalogue
Negation,IMPLEMENTED,Sign changes and dimension preserved,Does not modify historical runtime
Measurement completeness,NOT IMPLEMENTED,Explicitly listed as future work,Requires specification decisions
Canonical Arcane unit system,UNRESOLVED,No canon changes made,Needs source-backed review
Integration into parser/evaluator,NOT IMPLEMENTED,Kept as separate module,Prevents silent changes to prior semantics
Physical feasibility and Logos accounting,NOT IMPLEMENTED,Out of scope,Requires separate formal models
```

### Arcane_Phase_6S_Typed_Expression_Integration/PHASE_6R_TEST_OUTPUT.txt

- Type: TXT
- SHA-256: `4c5cbf1418bf4ec52d3e5e9cf8d77ddcc38c552ce899b111465d56fb9086e098`
- Extracted characters: 6418

```text
test_boolean_and (test_arcane_reference_runtime.ReferenceRuntimeTests.test_boolean_and) ... ok
test_boolean_not (test_arcane_reference_runtime.ReferenceRuntimeTests.test_boolean_not) ... ok
test_boolean_or (test_arcane_reference_runtime.ReferenceRuntimeTests.test_boolean_or) ... ok
test_fraja_operand_order (test_arcane_reference_runtime.ReferenceRuntimeTests.test_fraja_operand_order) ... ok
test_frasha_negates_negative (test_arcane_reference_runtime.ReferenceRuntimeTests.test_frasha_negates_negative) ... ok
test_frasha_negates_positive (test_arcane_reference_runtime.ReferenceRuntimeTests.test_frasha_negates_positive) ... ok
test_frasha_zero (test_arcane_reference_runtime.ReferenceRuntimeTests.test_frasha_zero) ... ok
test_frpa_binary_addition (test_arcane_reference_runtime.ReferenceRuntimeTests.test_frpa_binary_addition) ... ok
test_nested_grouping_changes_tree_and_result (test_arcane_reference_runtime.ReferenceRuntimeTests.test_nested_grouping_changes_tree_and_result) ... ok
test_rejects_boolean_arithmetic (test_arcane_reference_runtime.ReferenceRuntimeTests.test_rejects_boolean_arithmetic) ... ok
test_rejects_division_by_zero (test_arcane_reference_runtime.ReferenceRuntimeTests.test_rejects_division_by_zero) ... ok
test_rejects_extra_binary_arg (test_arcane_reference_runtime.ReferenceRuntimeTests.test_rejects_extra_binary_arg) ... ok
test_rejects_missing_binary_arg (test_arcane_reference_runtime.ReferenceRuntimeTests.test_rejects_missing_binary_arg) ... ok
test_rejects_numeric_boolean_mismatch (test_arcane_reference_runtime.ReferenceRuntimeTests.test_rejects_numeric_boolean_mismatch) ... ok
test_rejects_trailing_expression (test_arcane_reference_runtime.ReferenceRuntimeTests.test_rejects_trailing_expression) ... ok
test_rejects_unknown_operator (test_arcane_reference_
```

_Excerpt truncated at 1,800 characters; full length 6418 characters._

### Arcane_Phase_6S_Typed_Expression_Integration/PHASE_6S_STATUS.csv

- Type: CSV
- SHA-256: `937b90439533e4e1d448e20e3a73dfe97d2cee7942c1b723dd84ccd74c03a0b4`
- Extracted characters: 1175

```text
Area,Status,Evidence,Notes
Existing Phase 6P evaluator,Retained,Existing regression tests,Untyped evaluator unchanged
Phase 6Q test grammar,Retained,Existing grammar tests,Applies to parenthesised test notation only
Phase 6R dimensional model,Integrated,Phase 6S integration tests,Dimension symbols remain provisional
Bare numeric literals,Implemented,Phase 6S tests,Interpreted as dimensionless quantities
Quantity-aware arithmetic,Implemented,Phase 6S tests,Uses Phase 6R dimension operations
Boolean operators,Retained and type-checked,Phase 6S tests,Boolean values remain Boolean
Surface syntax for physical quantities,Unresolved,Source audit,No new canonical syntax invented
Units and conversion,Unresolved,Source audit,Requires explicit contract
Measurement completeness,Not implemented,Source audit,Need exact required fields and applicability
Uncertainty propagation,Not implemented,Source audit,Requires policy
Physical feasibility,Not implemented,Source audit,Separate from dimensional validity
Logos resource accounting,Not implemented,Source audit,Separate semantic contract
Historical Phase 6H runtime,Unavailable,Recovery audit,Current runtime is new prototype
```

### Arcane_Phase_6S_Typed_Expression_Integration/PHASE_6S_TEST_OUTPUT.txt

- Type: TXT
- SHA-256: `6feb7a2a5c399eafa676fa3596f86dcaf624dc34ed86db5915d399106d9e4a3c`
- Extracted characters: 8744

```text
test_boolean_and (test_arcane_reference_runtime.ReferenceRuntimeTests.test_boolean_and) ... ok
test_boolean_not (test_arcane_reference_runtime.ReferenceRuntimeTests.test_boolean_not) ... ok
test_boolean_or (test_arcane_reference_runtime.ReferenceRuntimeTests.test_boolean_or) ... ok
test_fraja_operand_order (test_arcane_reference_runtime.ReferenceRuntimeTests.test_fraja_operand_order) ... ok
test_frasha_negates_negative (test_arcane_reference_runtime.ReferenceRuntimeTests.test_frasha_negates_negative) ... ok
test_frasha_negates_positive (test_arcane_reference_runtime.ReferenceRuntimeTests.test_frasha_negates_positive) ... ok
test_frasha_zero (test_arcane_reference_runtime.ReferenceRuntimeTests.test_frasha_zero) ... ok
test_frpa_binary_addition (test_arcane_reference_runtime.ReferenceRuntimeTests.test_frpa_binary_addition) ... ok
test_nested_grouping_changes_tree_and_result (test_arcane_reference_runtime.ReferenceRuntimeTests.test_nested_grouping_changes_tree_and_result) ... ok
test_rejects_boolean_arithmetic (test_arcane_reference_runtime.ReferenceRuntimeTests.test_rejects_boolean_arithmetic) ... ok
test_rejects_division_by_zero (test_arcane_reference_runtime.ReferenceRuntimeTests.test_rejects_division_by_zero) ... ok
test_rejects_extra_binary_arg (test_arcane_reference_runtime.ReferenceRuntimeTests.test_rejects_extra_binary_arg) ... ok
test_rejects_missing_binary_arg (test_arcane_reference_runtime.ReferenceRuntimeTests.test_rejects_missing_binary_arg) ... ok
test_rejects_numeric_boolean_mismatch (test_arcane_reference_runtime.ReferenceRuntimeTests.test_rejects_numeric_boolean_mismatch) ... ok
test_rejects_trailing_expression (test_arcane_reference_runtime.ReferenceRuntimeTests.test_rejects_trailing_expression) ... ok
test_rejects_unknown_operator (test_arcane_reference_
```

_Excerpt truncated at 1,800 characters; full length 8744 characters._

### Arcane_Phase_6S_Typed_Expression_Integration/README 2.txt

- Type: TXT
- SHA-256: `b9b6da28c80a21d4f8e8b10a7a82e5dcf8e305047d3e80ba827711f8f2d96f16`
- Extracted characters: 627

```text
ARCANE RECOVERY PACK
Created: 2026-10-09

CONTENTS
1. Arcane_Continuity_Recovery_Audit.docx
2. Arcane_Decision_Ledger.docx
3. Arcane_Grammar_Consistency_Test_Register.docx

LIMITATIONS
This is a recovery draft based on the v3.0-L and v3.0 specifications and project context visible during compilation. It is not a complete archive of all previous chat messages.
Detailed v2.0 morphology, h coupling, MEL anchoring, and KAN/KEN/KAS rules were referenced but not fully available in the recovered baseline. They are marked unresolved rather than guessed.
No validation test is claimed to have passed without a recorded execution.
```

### Arcane_Phase_6S_Typed_Expression_Integration/README_Phase_5_17.txt

- Type: TXT
- SHA-256: `3fd1420431ce70beb776235877acc563e41ae2163df1b93b14a5a6e46988dd00`
- Extracted characters: 609

```text
ARCANE PHASE 5.17 PACKAGE

Contents:
- Arcane_Phase_5_17_Report.md: findings, limits and recommended next steps.
- arcane_phase_5_17_harness.py: runnable Python baseline checks.
- Arcane_Phase_5_17_Test_Results.json: exact result from the supplied Phase 5 lexicon.
- Arcane_Lexicon_v5_draft.csv: input lexicon copied from the supplied Arcana pack.

Run:
  python arcane_phase_5_17_harness.py Arcane_Lexicon_v5_draft.csv

Exit code 1 means a demonstrated FAIL exists. Missing specification is reported as BLOCKED, not PASS. The harness does not parse complete spells and does not certify physical feasibility.
```

### Arcane_Phase_6S_Typed_Expression_Integration/README_Phase_5_18.txt

- Type: TXT
- SHA-256: `46f6bbe05af884b1f4bc3ec94fc73e7edb806277e7b0f36cf399bd707ae2dbae`
- Extracted characters: 704

```text
ARCANE PHASE 5.18 — STATIC AUDIT PACKAGE

Files:
- Arcane_Phase_5_18_Report.md — findings and next phase plan.
- arcane_phase_5_18_audit.py — reproducible static audit harness.
- Arcane_Phase_5_18_Results.json — machine-readable results.
- Arcane_Phase_5_18_Run.txt — readable run output.
- Arcane_Lexicon_v5_draft.csv — source lexicon from the supplied archive.
- phase5_vernacular.py — source vernacular generator and example fixtures.

Run:
  python arcane_phase_5_18_audit.py
or:
  python arcane_phase_5_18_audit.py Arcane_Lexicon_v5_draft.csv phase5_vernacular.py

The tool is a static audit, not a complete Arcane parser. BLOCKED and NOT TESTED are not passes. No canon is changed by this package.
```

### Arcane_Phase_6S_Typed_Expression_Integration/README_Phase_5_20.txt

- Type: TXT
- SHA-256: `0d8a97334d414a680619241b5d1f697711c4930067dbbe8e0875e6fe07c0e433`
- Extracted characters: 561

```text
Arcane Phase 5.20 — Source Recovery and Homograph Evidence Matrix

Files:
- Arcane_Phase_5_20_Report.md: detailed evidence matrix, status corrections, decisions and next steps.
- Arcane_Phase_5_20_Results.json: machine-readable summary.
- Arcane_Language_Audit_Phase_4.txt: extracted Phase 4 document evidence.
- Arcane_Lexicon_v5_draft.csv: Phase 5 source lexicon.

No canonical language rule or spelling changed. The Phase 4 consolidation documents the fused readings, but is not the raw original v2.0 specification and does not constitute a complete parser.
```

### Arcane_Phase_6S_Typed_Expression_Integration/README_Phase_5_21.txt

- Type: TXT
- SHA-256: `d5d8d4504f11134741f0b46c8eb050e7389037b1efa6f772722ab9f58b6d46f0`
- Extracted characters: 466

```text
ARCANE PHASE 5.21 — EVIDENCE-BOUNDED CONSTRUCTION CONFORMANCE FIXTURES

Run: python arcane_phase_5_21_fixtures.py
Expected result: 11 PASS, 0 FAIL, 3 BLOCKED.

This is a fixture validator, not a general Arcane parser. It checks documented lexicon entries, explicit-slot lexical resolution, ambiguity visibility without a slot, and the exact Phase 4 hand-flame transcription. It deliberately blocks claims requiring the complete productive grammar. No canon changed.
```

### Arcane_Phase_6S_Typed_Expression_Integration/README_Phase_5_22.txt

- Type: TXT
- SHA-256: `5dd8f3b0a8107e27d0a3678b8bc3b7f9230038daf4f85977900cb8cc6160d788`
- Extracted characters: 595

```text
Arcane Phase 5.22 — Bounded Construction Parser

Contents:
- Arcane_Phase_5_22_Report.md: scope, results, decisions and next steps.
- arcane_phase_5_22_parser.py: standard-library Python parser and tests.
- Arcane_Phase_5_22_Results.json: machine-readable test results.
- Arcane_Lexicon_v5_draft.csv: source lexicon carried forward.
- Arcane_Language_Audit_Phase_4.docx: source evidence.

Run tests: python arcane_phase_5_22_parser.py --test
Parse the documented fixture: python arcane_phase_5_22_parser.py

This is a fixture-specific parser, not a complete Arcane parser. No canon was changed.
```

### Arcane_Phase_6S_Typed_Expression_Integration/README_PHASE_6R.txt

- Type: TXT
- SHA-256: `0fded157d751b676623f7934c4a2cde39a7c6bd459e394c5279b04b74d9393e5`
- Extracted characters: 300

```text
Arcane Phase 6R — Provisional dimensional quantity layer

Run from this directory:
  python -m unittest -v test_arcane_reference_runtime test_phase6q_grammar test_phase6r_dimensions

This package is a prototype and does not change Arcane canon. The dimensional module is separate from the evaluator.
```

### Arcane_Phase_6S_Typed_Expression_Integration/README_PHASE_6S.txt

- Type: TXT
- SHA-256: `530bce6736e8e9fe9fc7e7d9836af3796a6cb5a95b9a8be010e2651b1b0d5006`
- Extracted characters: 832

```text
Arcane Phase 6S — Typed expression integration

This is a provisional reference implementation, not canonical Arcane syntax and not the historical Phase 6H runtime.

Run all combined tests from this directory:
python -m unittest -v test_arcane_reference_runtime test_phase6q_grammar test_phase6r_dimensions test_phase6s_typed_runtime

Expected result in this package: 68 tests passed.

Main files:
- arcane_typed_runtime.py: typed evaluator bridge
- arcane_dimensions.py: Phase 6R dimension model
- arcane_reference_runtime.py: Phase 6P expression parser/evaluator
- test_phase6s_typed_runtime.py: new integration tests
- PHASE_6S_TEST_OUTPUT.txt: recorded test run
- ARCANE_PHASE_6S_REPORT.md: scope and limitations

QuantityLiteral is a programmatic test AST node. No canonical surface syntax for units or quantities is asserted.
```

### Arcane_Phase_6S_Typed_Expression_Integration/run_phase513_tests.py

- Type: PY
- SHA-256: `d99b11edf2691f1dc5f3e6f361950171f66107dca787fb620f9633db32fbd7ab`
- Extracted characters: 2278

```text
from arcane_phase513_ast_validator import check, ParseError, TypeErrorArcane
cases=[]
def run(name, fn):
 try: fn(); cases.append((name,True,''))
 except Exception as e: cases.append((name,False,str(e)))
def expect_reject(fn):
 try: fn()
 except (ParseError,TypeErrorArcane): return
 raise AssertionError('Expected rejection')
run('nested valid same-dimension addition',lambda: check('frapa<Q<1,L>,frapa<Q<2,L>,Q<3,L>>>',strict=False))
run('canonical alias fraja accepted as subtraction-form registry entry',lambda: check('fraja<Q<3,L>,Q<1,L>>',strict=False))
run('legacy frata normalises to fraja',lambda: (_ for _ in ()).throw(AssertionError()) if check('frata<Q<3,L>,Q<1,L>>',strict=False).value!='fraja' else None)
run('length times time yields product dimensions',lambda: (_ for _ in ()).throw(AssertionError()) if check('frama<Q<2,L>,Q<3,T>>',strict=False).dim!='L*T' else None)
run('division by zero rejected',lambda: expect_reject(lambda:check('frala<Q<1,L>,Q<0,L>>',strict=False)))
run('addition dimension mismatch rejected',lambda: expect_reject(lambda:check('frapa<Q<1,L>,Q<1,T>>',strict=False)))
run('missing argument rejected',lambda: expect_reject(lambda:check('frapa<Q<1,L>>',strict=False)))
run('extra argument rejected',lambda: expect_reject(lambda:check('frapa<Q<1,L>,Q<2,L>,Q<3,L>>',strict=False)))
run('unknown operator rejected',lambda: expect_reject(lambda:check('zorp<Q<1,L>>',strict=False)))
run('boolean AND accepted',lambda: check('gran<B<true>,B<false>>',strict=False))
run('non-Boolean AND rejected',lambda: expect_reject(lambda:check('gran<Q<1,L>,Q<2,L>>',strict=False)))
run('NOT requires Boolean',lambda: expect_reject(lambda:check('grash<B<true>>',strict=False) if False else check('grash<Q<1,L>>',strict=False)))
run('strict mode rejects provisional signature',lambda
```

_Excerpt truncated at 1,800 characters; full length 2278 characters._

### Arcane_Phase_6S_Typed_Expression_Integration/run_phase6o_validation.py

- Type: PY
- SHA-256: `3360ec5da0496d71d55d8ffdf39425f3c9b8c5ecb8e0177b97ead3fd63ac200f`
- Extracted characters: 2959

```text
#!/usr/bin/env python3
"""Re-run the portable Phase 5 generator and verify its archived output baseline."""
from pathlib import Path
import csv, json, subprocess, sys, hashlib
BASE = Path(__file__).resolve().parent
script = BASE / 'phase5_vernacular_portable.py'
proc = subprocess.run([sys.executable, str(script)], cwd=BASE, capture_output=True, text=True)
(BASE / 'phase6o_generator_stdout.txt').write_text(proc.stdout, encoding='utf-8')
(BASE / 'phase6o_generator_stderr.txt').write_text(proc.stderr, encoding='utf-8')
if proc.returncode:
    print('FAIL: generator exited', proc.returncode)
    print(proc.stderr)
    raise SystemExit(proc.returncode)
report = json.loads((BASE / 'phase5_report.json').read_text(encoding='utf-8'))
checks = report['results']
results=[]
for r in checks:
    results.append({'id':r['id'],'status':r['status'],'title':r['title'],'detail':r.get('detail','')})
expected = ['P5-T01','P5-T02','P5-T03','P5-T04','P5-T05','P5-T06','P5-T07']
if [r['id'] for r in results] != expected:
    results.append({'id':'P6O-V01','status':'FAIL','title':'Expected seven original Phase 5 checks','detail':str([r['id'] for r in results])})
else:
    results.append({'id':'P6O-V01','status':'PASS','title':'All seven original Phase 5 checks were emitted','detail':'P5-T01 through P5-T07 present in expected order'})
original = BASE / 'Arcane_Lexicon_v5_draft.csv'
generated = BASE / 'Arcane_Lexicon_v5_draft.generated.csv'
orig_bytes = original.read_bytes(); gen_bytes = generated.read_bytes()
results.append({'id':'P6O-V02','status':'PASS' if orig_bytes == gen_bytes else 'FAIL','title':'Regenerated Phase 5 lexicon matches archived baseline byte-for-byte','detail':f'archived_sha256={hashlib.sha256(orig_bytes).hexdigest()}; generated_sha256={hashlib.sha256(gen_bytes).hexdigest()}; a
```

_Excerpt truncated at 1,800 characters; full length 2959 characters._

### Arcane_Phase_6S_Typed_Expression_Integration/test_arcane_phase_5_24.py

- Type: PY
- SHA-256: `5702d4ae48c44aa3af7bd438f2d7a93f1b9cc4ce4f00e1e52b51879c8c8cb606`
- Extracted characters: 482

```text
#!/usr/bin/env python3
"""Small stdlib unittest wrapper for the Phase 5.24 embedded regression suite."""
import unittest
import arcane_phase_5_24 as arcane

class Phase524Tests(unittest.TestCase):
    def test_embedded_regression_suite(self):
        results = arcane.selftest()
        failed = [r for r in results if r['status'] != 'PASS']
        self.assertEqual([], failed, msg=failed)
        self.assertEqual(10, len(results))

if __name__ == '__main__':
    unittest.main()
```

### Arcane_Phase_6S_Typed_Expression_Integration/test_arcane_reference_runtime 2.py

- Type: PY
- SHA-256: `edd640d5741d785e30d1bc49eb3a1d76f13c3e6b6c6898c769738ce25d099c49`
- Extracted characters: 2205

```text
import unittest
from decimal import Decimal
from arcane_reference_runtime import (run, parse, show_ast, ArcaneArityError,
    ArcaneParseError, ArcaneTypeError, ArcaneEvaluationError)

class ReferenceRuntimeTests(unittest.TestCase):
    def test_frpa_binary_addition(self): self.assertEqual(run('(frapa 2 3)'), Decimal('5'))
    def test_fraja_operand_order(self):
        self.assertEqual(run('(fraja 9 4)'), Decimal('5'))
        self.assertEqual(run('(fraja 4 9)'), Decimal('-5'))
    def test_nested_grouping_changes_tree_and_result(self):
        a=parse('(fraja 2 (frapa 3 4))')
        b=parse('(frapa (fraja 2 3) 4)')
        self.assertNotEqual(show_ast(a), show_ast(b))
        self.assertEqual(run('(fraja 2 (frapa 3 4))'), Decimal('-5'))
        self.assertEqual(run('(frapa (fraja 2 3) 4)'), Decimal('3'))
    def test_rejects_missing_binary_arg(self):
        with self.assertRaises(ArcaneArityError): parse('(frapa 2)')
    def test_rejects_extra_binary_arg(self):
        with self.assertRaises(ArcaneArityError): parse('(frapa 1 2 3)')
    def test_frasha_negates_positive(self): self.assertEqual(run('(frasha 5)'), Decimal('-5'))
    def test_frasha_negates_negative(self): self.assertEqual(run('(frasha -5)'), Decimal('5'))
    def test_frasha_zero(self): self.assertEqual(run('(frasha 0)'), Decimal('0'))
    def test_boolean_and(self): self.assertIs(run('(gran true false)'), False)
    def test_boolean_or(self): self.assertIs(run('(grat true false)'), True)
    def test_boolean_not(self): self.assertIs(run('(grash false)'), True)
    def test_rejects_numeric_boolean_mismatch(self):
        with self.assertRaises(ArcaneTypeError): run('(gran true 1)')
    def test_rejects_boolean_arithmetic(self):
        with self.assertRaises(ArcaneTypeError): run('(frapa true 1)')
```

_Excerpt truncated at 1,800 characters; full length 2205 characters._

### Arcane_Phase_6S_Typed_Expression_Integration/test_phase6q_grammar 2.py

- Type: PY
- SHA-256: `775036e8cdec71680dc2b3e5bb5b657688e73c7dbfa6a228251cb93f20804944`
- Extracted characters: 3260

```text
"""Phase 6Q grammar-conformance tests for the provisional parenthesized harness.

These tests do not establish Arcane's canonical surface syntax. They validate only
its explicitly documented Phase 6P test notation.
"""
import unittest
from decimal import Decimal
from arcane_reference_runtime import (
    parse, run, show_ast, ArcaneParseError, ArcaneArityError,
    ArcaneTypeError, ArcaneEvaluationError, Number, Boolean, Call,
)

class TestPhase6QGrammar(unittest.TestCase):
    # T-001: arity in the reference notation
    def test_t001_binary_operator_accepts_two_arguments(self):
        self.assertEqual(run('(frapa 2 3)'), Decimal('5'))

    def test_t001_missing_argument_is_rejected(self):
        with self.assertRaises(ArcaneArityError): parse('(frapa 2)')

    def test_t001_extra_argument_is_rejected(self):
        with self.assertRaises(ArcaneArityError): parse('(frapa 1 2 3)')

    # T-002: order preserved in FRAJA; historical FRATA alias is not assumed.
    def test_t002_operand_order_is_preserved_for_fraja(self):
        self.assertEqual(run('(fraja 9 4)'), Decimal('5'))
        self.assertEqual(run('(fraja 4 9)'), Decimal('-5'))

    # T-003: explicit nesting builds different ASTs and results.
    def test_t003_nested_grouping_changes_ast(self):
        left = parse('(fraja 2 (frapa 3 4))')
        right = parse('(frapa (fraja 2 3) 4)')
        self.assertNotEqual(show_ast(left), show_ast(right))

    def test_t003_nested_grouping_changes_result(self):
        self.assertEqual(run('(fraja 2 (frapa 3 4))'), Decimal('-5'))
        self.assertEqual(run('(frapa (fraja 2 3) 4)'), Decimal('3'))

    # T-004: unsupported infix forms cannot silently acquire an interpretation.
    def test_t004_ambiguous_unparenthesized_infix_is_rejected(self):
        with self.assertR
```

_Excerpt truncated at 1,800 characters; full length 3260 characters._

### Arcane_Phase_6S_Typed_Expression_Integration/test_phase6r_dimensions 2.py

- Type: PY
- SHA-256: `f726b3d8856b5ea71cee34296d348925269d25f01eadf4ab66fde08d190878ac`
- Extracted characters: 2579

```text
import unittest
from decimal import Decimal
from arcane_dimensions import Dimension, DimensionError, Quantity, DIMENSIONLESS

MASS = Dimension.of({'M': 1})
LENGTH = Dimension.of({'L': 1})
TIME = Dimension.of({'T': 1})

class TestPhase6RDimensions(unittest.TestCase):
    def q(self, n, d=DIMENSIONLESS): return Quantity(Decimal(str(n)), d)
    def test_dimensionless_is_empty_vector(self): self.assertEqual(DIMENSIONLESS.powers, ())
    def test_dimension_canonical_order(self): self.assertEqual(Dimension.of({'T': 1, 'L': 1}), Dimension.of({'L': 1, 'T': 1}))
    def test_zero_exponents_are_removed(self): self.assertEqual(Dimension.of({'L': 0}), DIMENSIONLESS)
    def test_rejects_empty_dimension_symbol(self):
        with self.assertRaises(DimensionError): Dimension.of({' ': 1})
    def test_rejects_noninteger_exponent(self):
        with self.assertRaises(DimensionError): Dimension.of({'L': 0.5})
    def test_add_same_dimensions(self): self.assertEqual(self.q(2,LENGTH).add(self.q(3,LENGTH)), self.q(5,LENGTH))
    def test_subtract_same_dimensions(self): self.assertEqual(self.q(8,TIME).subtract(self.q(3,TIME)), self.q(5,TIME))
    def test_add_incompatible_dimensions_rejected(self):
        with self.assertRaises(DimensionError): self.q(2,MASS).add(self.q(1,TIME))
    def test_subtract_incompatible_dimensions_rejected(self):
        with self.assertRaises(DimensionError): self.q(2,LENGTH).subtract(self.q(1,TIME))
    def test_multiply_combines_dimensions(self):
        self.assertEqual(self.q(3,LENGTH).multiply(self.q(4,TIME)), self.q(12,Dimension.of({'L':1,'T':1})))
    def test_divide_subtracts_dimension_exponents(self):
        self.assertEqual(self.q(12,LENGTH).divide(self.q(3,TIME)), self.q(4,Dimension.of({'L':1,'T':-1})))
    def test_same_dimension_division_becomes_di
```

_Excerpt truncated at 1,800 characters; full length 2579 characters._

### Arcane_Phase_6S_Typed_Expression_Integration/test_phase6s_typed_runtime.py

- Type: PY
- SHA-256: `e07add5f51df07920d0167b90a66c0336e9f2a0936f6a6ea1f9fe2de5443b71c`
- Extracted characters: 3258

```text
import unittest
from decimal import Decimal
from arcane_reference_runtime import Number, Boolean, Call, parse
from arcane_dimensions import Dimension, Quantity, DIMENSIONLESS
from arcane_typed_runtime import QuantityLiteral, TypedEvaluationError, evaluate_typed

L = Dimension.of({'L': 1})
M = Dimension.of({'M': 1})
T = Dimension.of({'T': 1})
SPEED = Dimension.of({'L': 1, 'T': -1})

def q(value, dimension=DIMENSIONLESS):
    return Quantity(Decimal(str(value)), dimension)
def call(op, *args):
    return Call(op, tuple(args))
def lit(value, dimension=DIMENSIONLESS):
    return QuantityLiteral(q(value, dimension))

class TestPhase6STypedIntegration(unittest.TestCase):
    def test_bare_number_becomes_dimensionless_quantity(self):
        self.assertEqual(evaluate_typed(parse('7')), q(7))
    def test_parsed_addition_remains_dimensionless(self):
        self.assertEqual(evaluate_typed(parse('(frapa 2 3)')), q(5))
    def test_typed_addition_same_dimension(self):
        self.assertEqual(evaluate_typed(call('frapa', lit(2,L), lit(3,L))), q(5,L))
    def test_typed_subtraction_same_dimension(self):
        self.assertEqual(evaluate_typed(call('fraja', lit(8,T), lit(3,T))), q(5,T))
    def test_incompatible_addition_rejected(self):
        with self.assertRaises(TypedEvaluationError): evaluate_typed(call('frapa', lit(2,M), lit(1,T)))
    def test_incompatible_subtraction_rejected(self):
        with self.assertRaises(TypedEvaluationError): evaluate_typed(call('fraja', lit(2,L), lit(1,T)))
    def test_multiplication_propagates_dimensions(self):
        self.assertEqual(evaluate_typed(call('frama', lit(3,L), lit(4,T))), q(12, Dimension.of({'L':1,'T':1})))
    def test_division_propagates_dimensions(self):
        self.assertEqual(evaluate_typed(call('frala', lit(12,L), lit(3,T)
```

_Excerpt truncated at 1,800 characters; full length 3258 characters._

