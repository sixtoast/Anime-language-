# Arcane Continuity Recovery & Test Register

**Status:** RECOVERY DRAFT. Compiled from canonical specifications and project context supplied in this conversation; not a complete archive of historical chats.  
**Created in project:** 2026-10-09 (date reported by source pack).  
**Purpose:** Preserve continuity and prevent missing evidence from being replaced by guesses.

## 1. Recovered language canon

- Arcane is a human-designed control language for constructing mana states; words do not directly command reality.
- Language ≠ spell ≠ mana. Translation chain: intent → physical specification → neural representation → Arcane encoding → mana configuration → mechanism → effect.
- Design: low morphology + high compositional precision. Surface syntax: HEAD + ARGUMENTS + MODIFIERS.
- Typed expressions and fixed-arity operators are intended to prevent incompatible composition and precedence ambiguity. Executable expressions require a unique parse; ambiguity must fail rather than guess.
- References: MI self, NI field, RI target, SU current, WO world, FE frame.
- Axes: PA −X, BA +X, TA −Y, DA +Y, KA −Z, GA +Z; +X right, +Y above, +Z forward. Relations: JO toward, JUR away, JA along, JE parallel, JI aligned/coincident.
- Geometry: PI point, LEN line, PLA plane, SUR surface, VOM volume, PAR path, REN region, NET network.
- Quantities: PALA position, VANU velocity, MORU mass, KERA acceleration, FETA force, ENRA energy, TEVA temperature, PURA pressure, POMA momentum.
- Information: NES read, SIMA measure, GAMA assign, DAVE infer. Maths: FRAPA add, FRATA subtract, FRAKA multiply, FRALA divide, FRASHA negate, DRAN magnitude, DREM dot product, DRIM cross product, DRAL compare.
- Logic: GRAN AND, GRAT OR, GRAK NOT, BEK IF, ZET WHILE. Bindings: KWAM create binding, KWAT reference binding, KWAK live evaluation.
- Digits: ZA 0, KI 1, TO 2, MU 3, RE 4, SA 5, FI 6, DU 7, GO 8, PE 9; SHI decimal; FRASHA negative. Units: MA metre, SE second, KE kilogram, RA radian, KU kelvin.
- Phonology: vowels /a,e,i,o,u,ə/; consonants /p,b,t,d,k,g,m,n,ŋ,f,v,s,ʃ,h,l,r,w,j/; syllable template (C)(C)V(V)(C); default penultimate stress.
- Registers: vernacular, technical, formal, performed Arcana. Silent casting internalises the interface. Macros must expand into valid constructions (Macro Transparency Law). Historical development: Proto → Old → Classical → Modern.

## 2. Recovered magic-system canon

- Information, mana, energy, force, coupling, and effect are distinct. Mana is a physical field and does not understand meaning.
- Physical changes require valid mechanisms. Desired effect is not mechanism; ASSIGN ≠ CAUSE. No free energy, matter, momentum, or information.
- Affinity is a biological tendency toward efficient control of interaction classes. NULL is a classification mismatch, not zero mana or hidden omnipotence.
- Feasibility checks cover mana, coupling, energy, information, control, time/causality, stability, and material constraints.
- Logos is a persistent computational agent coupled to the protagonist's biological–mana interface; its substrate, memory, and energy costs remain underspecified.
- Combat loop: detect → predict → construct → execute → observe → adapt. Spell lifecycle: defined → armed → triggered → active → satisfied, with failed/expired/cancelled/collapsed outcomes.

## 3. Continuity gaps — do not silently resolve

1. Surface grammar HEAD + ARGUMENTS + MODIFIERS and spell representation HEAD + CORE + PARAMETERS + CONSTRAINTS + CONTROL may describe different layers. Define a mapping; do not replace either automatically.
2. Fixed arity is a principle, but a complete operator-signature inventory is not present in the recovered specification.
3. Unique parse is canon, but grouping, attachment, spoken boundaries, nesting, and modifier scope need operational rules.
4. Temporal concepts AFTER, UNTIL, DELAY, DURATION, RATE, DEADLINE, and INTERVAL are named, but complete Arcane forms and signatures are not recovered.
5. Control has AND, OR, NOT, IF, and WHILE; iteration, event triggers, termination, constraints, invariants, and evaluation timing need definitions.
6. Magic v3.0 lists KREN/TRAK/FREM/SHREN/BRAN/VARE; these are absent from the supplied v3.0-L operator inventory. Treat as a cross-specification gap, not a deletion.
7. v2.0 morphology (frame + vowel + coda), h coupling, MEL anchoring, and KAN/KEN/KAS are referenced but their full original rules are unavailable. Do not guess.
8. FRAPA/FRATA/FRAKA, GRAN/GRAT/GRAK, and DREM/DRIM have close sound contrasts. Test them before changing them.
9. CREATE is not a physical primitive. KWAM creates a binding, not matter or a physical effect.
10. Completion percentages such as 95% vocabulary coverage are unverified until inventory and coverage criteria are defined.
11. Adversarial consistency and numeric feasibility must not be marked PASS until concrete tests are run and recorded.

## 4. Decision ledger

| ID | Status | Decision / issue |
|---|---|---|
| D-001 | CANON | Arcane is a human-designed control language. |
| D-002 | CANON | Language ≠ spell ≠ mana. |
| D-003 | CANON | Surface syntax HEAD + ARGUMENTS + MODIFIERS; scope details incomplete. |
| D-004 | CANON | Spell representation HEAD + CORE + PARAMETERS + CONSTRAINTS + CONTROL; mapping to surface syntax required. |
| D-005 | CANON | Executable expressions must have one recoverable parse. |
| D-006 | UNRESOLVED | Recover exact v2.0 frame–vowel–coda morphology before integrating or retiring it. |
| D-007 | UNRECOVERED | Exact definitions and examples for h coupling, MEL anchoring, KAN/KEN/KAS. |
| D-008 | PROPOSAL | Define operator-specific signatures and test against existing examples. |
| D-009 | PROPOSAL | Formalise grouping and modifier scope. |
| D-010 | CROSS-SPEC GAP | Reconcile KREN/TRAK/FREM/SHREN/BRAN/VARE with v3.0-L vocabulary. |
| D-011 | CANON | CREATE is not a physical primitive; KWAM creates a binding only. |
| D-012 | GAP | Specify Logos substrate, memory, energy, bandwidth, and interface costs. |
| D-013 | UNVERIFIED | Vocabulary completion percentages need measurable coverage criteria. |
| D-014 | LOCKED DESIGN CANON | Incantations v1.9 defines bounded resource accounting, reservations, conservation contracts and reconciliation; this does not implement physical feasibility or infer spoken syntax. |

### Change-record template

- Decision ID:
- Existing rule and source:
- Concrete defect or gap:
- Options considered:
- Tests and results:
- Decision: ACCEPT / REJECT / PROVISIONAL / UNRESOLVED
- Date and rationale:

Every proposed change must state the existing rule, concrete defect, alternatives, test cases, and decision status. Mark a subsystem LOCKED only when its rules, examples, and validation coverage are available. Keep language representation separate from the physical model of magic.

## 5. Grammar and consistency test register

Defined tests are not claimed passes.

| ID | Test | Required validation |
|---|---|---|
| T-001 | Operator arity | FRAPA takes two quantities; reject missing/extra arguments unless a distinct variadic operator is defined. |
| T-002 | Operand order | FRATA(A,B) and FRATA(B,A) preserve different operand order. |
| T-003 | Nested grouping | A − (B + C) and (A − B) + C produce different parse trees. |
| T-004 | Ambiguity | Two-plausible-attachment input is rejected or explicitly disambiguated. |
| T-005 | Modifier scope | Distinguish duration constraint on whole compound from one on a child. |
| T-006 | Type mismatch | Reject a time interval where mass or sensor is expected unless conversion is defined. |
| T-007 | Measurement completeness | SIMA RI VANU accounts for target, pathway/sensor, interaction, resolution, and available information. |
| T-008 | Binding semantics | KWAM, KWAT, KWAK distinguish binding creation, reference, and live evaluation. |
| T-009 | Temporal completeness | Define forms/signatures for AFTER, UNTIL, DELAY, DURATION, RATE, DEADLINE, INTERVAL. |
| T-010 | Control flow | Define repetition, event triggers, termination, invariants, constraints, evaluation timing, and failure behaviour. |
| T-011 | Near-collision robustness | Test FRAPA/FRATA/FRAKA, GRAN/GRAT/GRAK, DREM/DRIM in rapid speech and noise. |
| T-012 | Macro transparency | Expand macro and verify expansion passes type and feasibility checks. |
| T-013 | Physical mechanism | Desired effect without mechanism is incomplete; a mechanism still requires feasibility checks. |
| T-014 | Conservation | Reject matter/energy without a source or valid conversion. |
| T-015 | Logos resource accounting | Identify substrate, memory, energy, bandwidth, and interface costs. |
| T-016 | Numeric feasibility | Choose a simple spell with explicit assumptions and evaluate each feasibility term separately. |
| T-017 | Resource ledger and conservation | For one approved resource domain, test source provenance, compatible units, reservation races, idempotent debits, balance mismatch, uncertainty, interruption and unknown outcomes against the v1.9 contract. |

**Execution status at recovery:** 16 tests defined; 0 tests executed and evidenced in the recovery pack. No test is claimed to have passed without recorded execution.

## 6. Change-control principles

- Search the canonical documents and this register before proposing a new rule.
- Do not redesign a settled section for stylistic reasons; record changes in the decision ledger.
- Preserve old forms as aliases unless an inconsistency is demonstrated.
- Keep source canon, provisional proposals, implementation status, and test evidence as separate fields.


## Resource-accounting continuity update — 2026-10-17

Arcane Incantations v1.9 is locked design canon for the bounded modern incantation metalanguage. It adds 60 specification fixtures for resource definitions, accounts, sources, transfers, transformations, budgets, reservations, conservation contracts, transactions, concurrency, interruption and reconciliation. These fixtures are expected outcomes, not executed tests. The older T-014 conservation and T-015 Logos accounting concerns remain implementation/source-recovery work; v1.9 does not resolve the Logos substrate model or establish a universal mana-to-energy conversion. The next executable step is a deliberately narrow resource domain with explicit units, source evidence and contract assumptions.
