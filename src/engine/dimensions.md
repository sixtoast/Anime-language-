# Dimension Algebra Primitives

**Status:** implementation support layer; not yet canonical Arcane semantics.

This module implements explicit dimensional bookkeeping for the base-unit symbols listed in Arcane v3.0-L:

- `MA` — metre / length
- `SE` — second / time
- `KE` — kilogram / mass
- `KU` — kelvin / temperature
- `RA` — radian, represented as dimensionless for SI-style dimensional algebra

The module supports compatible addition/subtraction, dimensional multiplication/division, unknown-unit rejection, non-finite value checks, and division-by-zero rejection.

## Deliberate boundaries

1. The primitives are not wired into the Phase 2 parser or operator evaluator.
2. The source material does not yet define the complete canonical unit-conversion table or derived-unit spellings.
3. Multiplication and division therefore return a dimension vector rather than guessing a canonical derived unit.
4. This is dimensional bookkeeping, not a complete physical type system. It does not establish mana cost, conservation, coupling, or spell feasibility.
5. The choice to represent radians as dimensionless is an implementation convention for dimensional algebra, not a claim that Arcane's semantic type system has finalised angular typing.

Before these operations are connected to FRAPA/FRATA/FRAKA/FRALA, the language specification must settle quantity typing, conversion rules, and the intended treatment of dimensionless ratios.
