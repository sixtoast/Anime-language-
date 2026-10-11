# Anime Language Workbench

A version-controlled workspace for documenting, testing, reviewing, and researching the Anime language and its magic system.

## Project goals

- Keep canonical language rules distinct from provisional audit findings and open questions.
- Provide a searchable documentation space with traceable sources and version history.
- Build a playground backed by real lexical, syntactic, and semantic checks as the specification permits.
- Maintain a regression suite for valid expressions, invalid expressions, ambiguity cases, and expected diagnostics.
- Keep research notes and review decisions linked to the rules they affect.

## Development principles

1. The canonical specification is authoritative. The application must not invent grammar or semantics to make an example appear to work.
2. Provisional audit findings do not silently modify canonical rules.
3. Preserve historical names and forms as aliases unless evidence establishes an inconsistency.
4. Every implemented language rule should have tests and traceable documentation.
5. Keep the language engine independent from the user interface.
6. Prefer small, reviewable changes and automated checks.

## Planned stack

The initial proposal is React, TypeScript, and Vite, with Vitest for automated tests. This can be adjusted before implementation if repository needs change.

## Status

Project bootstrap. The application and language engine have not yet been implemented. No claim is made that the playground can execute or validate Anime language expressions at this stage.

## Specification source of truth

Canonical specification text and audit artefacts must be imported from verified project sources. Do not treat illustrative placeholder examples as valid language syntax.
