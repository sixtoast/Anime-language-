# Shared Language Fixtures

Store reusable examples that can be consumed by the playground, parser, validators, and automated tests as the engine evolves.

Each fixture should have a stable ID, source/provenance, expected status, and a short explanation. Where appropriate, include the expected parse or diagnostic.

Label examples as canonical, historical, provisional, or synthetic. A fixture passing a parser test does not by itself prove that the expression is canonical Arcane or a valid spell.

Prefer shared fixtures over duplicating the same examples across unrelated test files.