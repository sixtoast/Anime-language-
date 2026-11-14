# Phase 2 Audit Parser Contract

**Status:** provisional implementation of provisional notation.

This parser handles only the abstract audit representation `OPERATOR⟨argument₁, argument₂, …⟩` from Phase 2. It is not a parser for ordinary written Arcane, performed Arcana, or speech.

## Supported behaviour

- Tokenises names and explicit `⟨`, `⟩`, and comma boundaries.
- Produces a nested syntax tree for symbols and operator calls.
- Enforces only the arities currently registered in the Phase 2 audit signature list: FRAPA, FRATA, FRAKA, FRALA, FRASHA, DRAN, DREM, DRIM, and DRAL.
- Rejects malformed separators, unknown operator arity, missing/extra arguments, and trailing input.
- Preserves operand order.

## Deliberate limitations

- No dimensional type checker: quantity dimensions and conversion rules are not complete.
- No runtime, mana configuration, physical mechanism, or spell feasibility evaluation.
- No surface-speech parser and no assumption that the audit punctuation is spoken.
- Bare names are accepted as symbolic leaves, not validated as known vocabulary or values.
- This is a syntax prototype; tests still require execution in CI or a local environment.

## Example

```text
FRAPA⟨KI, FRAPA⟨TO, MU⟩⟩
```

The AST nests the inner FRAPA as the second argument of the outer FRAPA. This parser does not infer what units KI, TO, or MU represent.

## Related module: dimension algebra

A separate implementation support layer is available at `src/engine/dimensions.ts`. It is intentionally not connected to this parser because the canonical dimensional and operator semantics are incomplete. See `src/engine/dimensions.md` for its explicit limits and test coverage.
