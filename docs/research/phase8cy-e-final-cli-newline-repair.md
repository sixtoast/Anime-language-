# Phase 8CY-E — Final CLI newline repair

The next Python unit run isolated one further literal backslash-n sequence in `tools/source_intake.py`, between the no-input parser error and the `paths` declaration. Replaced it with an actual source newline. This was the final syntax issue exposed by Python's import parser; the next preview must still confirm the unit tests and extraction output. No source evidence is promoted.
