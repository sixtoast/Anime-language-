# Arcane v3.0-L — Canonical Arcane Language Specification

**Status:** Structurally locked according to the supplied source; lexicon remains incomplete.  
**Source:** User-supplied v3.0-L specification in the Anime project conversation.  
**Implementation status:** Source imported; not proof of a complete parser or spoken corpus.

## 1. Definition and separations

Arcane is a **human-designed control language for constructing mana states**. It is not the language of gods or mana, inherently magical speech, a universal language, or a language the universe understands.

Keep distinct:

- **Language:** representation.
- **Spell:** underlying physical construction.
- **Mana:** physical medium carrying the construction.

A mage can speak Arcane without casting, and a spell can exist without speech.

Translation chain: Intent → Physical Specification → Neural Representation → Arcane Encoding → Mana Configuration → Mechanism → Effect.

## 2. Design philosophy and syntax

Design principle: low morphology + high compositional precision. Meaning is built through combinations of precise operators rather than thousands of grammatical endings.

Surface syntax is strongly head-initial:

`HEAD + ARGUMENTS + MODIFIERS`

Example: `SIMA RI VANU` means approximately `MEASURE(TARGET.VELOCITY)`.

Arcane is a typed formal system. Expressions produce particular kinds of values: SIMA → Observation, FRAPA → Quantity, DRAN → Scalar. Incompatible types must not be accepted without a defined operation or conversion.

Core operators have fixed argument counts. ADD(A,B) takes two arguments; NEGATE(A) takes one; COMPARE(A,B,R) takes three. Precedence must not be relied on to resolve grouping.

## 3. References

| Meaning | Arcane |
|---|---|
| Self | MI |
| Field | NI |
| Target | RI |
| Current | SU |
| World | WO |
| Frame | FE |

These refer to roles, not grammatical persons. RI means the currently resolved target entity, not necessarily a particular person.

## 4. Spatial axes and relations

| Direction | Arcane |
|---|---|
| −X | PA |
| +X | BA |
| −Y | TA |
| +Y | DA |
| −Z | KA |
| +Z | GA |

Convention: +X = right, +Y = above, +Z = forward. The voiced/voiceless distinction gives a subtle internal symmetry.

| Relation | Arcane |
|---|---|
| Toward | JO |
| Away | JUR |
| Along | JA |
| Parallel | JE |
| Aligned/coincident | JI |

These are relations, not independent magical forces.

## 5. Geometry

| Concept | Arcane |
|---|---|
| Point | PI |
| Line | LEN |
| Plane | PLA |
| Surface | SUR |
| Volume | VOM |
| Path | PAR |
| Region | REN |
| Network | NET |

## 6. Physical quantities

| Quantity | Arcane |
|---|---|
| Position | PALA |
| Velocity | VANU |
| Mass | MORU |
| Acceleration | KERA |
| Force | FETA |
| Energy | ENRA |
| Temperature | TEVA |
| Pressure | PURA |
| Momentum | POMA |

A quantity/property is distinct from a particular value of that quantity: VELOCITY ≠ VELOCITY VALUE.

## 7. Measurement and information

SIMA means measure; it does not magically produce knowledge. A valid measurement requires pathway + sensor + interaction + resolution + available information.

| Function | Arcane |
|---|---|
| Read | NES |
| Measure | SIMA |
| Assign | GAMA |
| Infer | DAVE |

Canonical distinction: `NES ≠ SIMA ≠ DAVE`.
- NES retrieves available information.
- SIMA acquires information through a physical measurement pathway.
- DAVE constructs an inference from information.

GAMA assigns a representation; it does not cause the represented physical state to occur.

## 8. Mathematical vocabulary

| Function | Arcane |
|---|---|
| Add | FRAPA |
| Subtract | FRATA |
| Multiply | FRAKA |
| Divide | FRALA |
| Negate | FRASHA |
| Magnitude | DRAN |
| Dot product | DREM |
| Cross product | DRIM |
| Compare | DRAL |

## 9. Logic and control operators

| Logic/control | Arcane |
|---|---|
| AND | GRAN |
| OR | GRAT |
| NOT | GRAK |
| IF | BEK |
| WHILE | ZET |

These are control operators, not magical effects by themselves.

## 10. Bindings

| Operator | Meaning |
|---|---|
| KWAM | Create a binding |
| KWAT | Reference an established binding |
| KWAK | Live evaluation |

Conceptual example: `KWAM 1 E` binds expression E; `KWAT 1` references it; `KWAK 1` can evaluate live where appropriate. Exact identifier representation and evaluation semantics remain areas for formalisation.

Static observation `O(t₀)` can remain unchanged; live measurement `O(t)` updates over time. Stale information can cause real mistakes.

## 11. Digits and units

| Number | Arcane |
|---:|---|
| 0 | ZA |
| 1 | KI |
| 2 | TO |
| 3 | MU |
| 4 | RE |
| 5 | SA |
| 6 | FI |
| 7 | DU |
| 8 | GO |
| 9 | PE |

- Decimal marker: SHI
- Negative: FRASHA

| Unit | Arcane |
|---|---|
| metre | MA |
| second | SE |
| kilogram | KE |
| radian | RA |
| kelvin | KU |

The source says lexical collision cleanup is canonical: MA means metre and cannot also mean SELF.

## 12. Temporal concepts

Arcane represents temporal relationships explicitly rather than relying on ordinary grammatical tense. Named concepts include NOW, BEFORE, AFTER, DURATION, DELAY, RATE, UNTIL, DEADLINE, and INTERVAL. Complete forms and operator signatures for all of these have not been recovered in the supplied material.

## 13. Ordinary language and registers

Arcane supports ordinary conversation: jokes, lies, questions, insults, flirting, apologies, arguments, gossip, exaggeration, and metaphor. Formal Arcana is not the same as everyday Arcane speech.

Four registers:
1. **Vernacular** — everyday natural speech.
2. **Technical** — precise academic/engineering speech.
3. **Formal** — carefully structured professional Arcane.
4. **Performed Arcana** — highly compressed execution-oriented speech.

Progression: Vernacular → Technical → Formal → Performed.

Performed Arcana sounds alien through unusual phonotactics, dense semantic packing, predictable grammar, reduced vowels, precise rhythm, controlled pitch, compressed operators, specialised vocabulary, and minimal redundancy—not random consonant insertion.

## 14. Phonology and prosody

Vowels: `/a, e, i, o, u, ə/`

Consonants: `/p, b, t, d, k, g, m, n, ŋ, f, v, s, ʃ, h, l, r, w, j/`

Syllable structure: `(C)(C)V(V)(C)`

Default stress: penultimate syllable. Stress may interact with rhythm and information structure, but must not become an uncontrolled second grammar. Critical operators cannot rely only on stress to distinguish completely different executable meanings.

Pitch levels: Low, Mid, High; possible contours include LH and HL. Pitch is primarily structural/prosodic, not lexical tone on every word.

Rhythmic hierarchy: Syllable → Foot → Phrase → Spell. An Arcane foot tends to correspond to one complete semantic relationship. Phrase boundaries may use timing reset, pitch contour, stress, consonant release, and phrase-final lengthening.

Casting speed is not speaking speed: the caster must maintain information accuracy, motor accuracy, timing, and neural synchronisation.

## 15. Silent casting, sigils, instruments, and recordings

Silent casting is internalised control: the external linguistic scaffold becomes unnecessary after the mapping is learned. It is not a different magic system.

The same semantic construction may be encoded by speech, gesture, sigil, internal representation, or magical device. Interfaces differ; the underlying physical construction does not.

A sigil is not inherently magical. A drawing may specify a construction, guide neural construction, encode a prepared mana configuration, interact with magical materials, or participate in a persistent field structure.

A recording contains sound information, not the original caster’s specific neural state and mana interface. A recording can teach someone a spell but does not automatically execute it.

## 16. Unique parse, compression, and macros

Natural language can be ambiguous. Formal Performed Arcana cannot tolerate unresolved ambiguity. Every executable expression must have exactly one recoverable interpretation; otherwise execution fails rather than guesses.

Linguistic compression is not physical simplification. Compressing a ten-second incantation into one second does not make the physical spell cheaper; information may have been learned, stored in macros, predicted, or represented more efficiently.

Macros are conventional shorthand but cannot hide physically impossible operations. Every macro must expand into a valid construction. **Macro Transparency Law** is mandatory.

## 17. Historical development and sociolinguistics

Broad historical progression: Proto → Old → Classical → Modern. Older texts may contain obsolete grammar, vocabulary, phonology, measurements, or metaphysical terminology; underlying physics does not change.

An ancient mage may successfully reproduce a technique while giving a mistaken explanation. Modern research may later identify the physical mechanism.

Arcane competence does not equal social status. Class can affect education, resources, opportunity, and performance, but wealth does not guarantee talent and poverty does not preclude it.

NULL is socially dangerous because institutions built around specialist classifications may interpret it as failure. Its canonical interpretation is poor fit to the classification system, not secret overpowered status.

## 18. Language architecture

Language chain:

`PHONOLOGY → MORPHOLOGY → SYNTAX → SEMANTICS → PRAGMATICS → NEURAL ENCODING → MANA CONSTRUCTION`

Physical chain:

`MANA → COUPLING → MECHANISM → EFFECT`

These must remain separate.

## 19. Source status and remaining lexicography

The supplied v3.0-L labels phoneme inventory, phonotactics, syllable structure, stress, prosody, orthographic architecture, basic syntax, argument structure, reference, spatial grammar, mathematical grammar, temporal grammar, information grammar, control grammar, semantic typing, pragmatics, registers, historical development, sociolinguistics, casting relationship, compression, macro system, and core vocabulary as locked or structurally locked.

It reports core vocabulary ~95%, technical vocabulary ~90%, derivational lexicon ~85%, and idioms/slang ~80%, but the recovery audit explicitly says these percentages are unverified until inventory and coverage criteria are defined. Treat them as **source-reported estimates**, not measured website metrics. A full dictionary and large natural corpus remain incomplete.

## 20. Cross-document gaps that must remain visible

- Spell representation `HEAD + CORE + PARAMETERS + CONSTRAINTS + CONTROL` and surface syntax `HEAD + ARGUMENTS + MODIFIERS` describe different layers. Define a mapping; do not replace either automatically.
- v3.0 magic-system vocabulary includes KREN, TRAK, FREM, SHREN, BRAN, and VARE, absent from the main v3.0-L operator inventory. This is a cross-document gap, not evidence they were removed.
- Detailed v2.0 morphology, h coupling, MEL anchoring, and KAN/KEN/KAS are referenced but not recovered. Do not guess.
- Close sound contrasts FRAPA/FRATA/FRAKA, GRAN/GRAT/GRAK, and DREM/DRIM need testing before any rename.
- The full dictionary, spoken corpus, temporal forms, comparison relation values, and some signatures remain incomplete.
