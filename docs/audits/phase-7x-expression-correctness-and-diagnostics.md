# Phase 7X — Expression Correctness and Diagnostics

**Status:** implementation contract and acceptance plan; not yet a claim that the runtime implementation or tests have passed.

**Scope boundary:** this document concerns the provisional executable subset developed during Arcane Phase 7W. It does not amend the canonical Arcane v3.0-L specification and must not be used to infer missing canonical grammar or semantics.

## Why this phase exists

The workbench README establishes that canonical language rules, provisional audit findings, implementation status, and test evidence must remain distinct. Phase 7X applies that rule to expression evaluation: define a testable contract for the current implementation, expose disagreements between parser/checker/runtime, and make failures actionable before expanding the language.

## Required work

1. **Inventory the implementation first.** Read the parser, semantic checker, runtime evaluator, CLI, existing examples, and all existing tests. Record supported operators and their current precedence/associativity from code and tests; do not assume that a conventional language's rules are automatically Arcane rules.
2. **Freeze current behaviour in tests.** Add one test per supported operator and pairwise precedence interactions. Cover parentheses, nested expressions, unary forms if implemented, comparisons if implemented, and nested function calls. For any unimplemented form, assert a deliberate diagnostic rather than accidental acceptance.
3. **Align checker and runtime.** Ensure the semantic checker and evaluator share the same parse representation and reject the same malformed forms. Function-call arity, unknown names, and invalid operand combinations must not be silently interpreted differently.
4. **Standardise diagnostics.** Use stable categories such as `E_SYNTAX`, `E_NAME`, `E_ARITY`, `E_TYPE`, `E_DIV_ZERO`, and `E_LIMIT`. Include source line/column when the parser has that information. Do not fabricate locations when the source spans are unavailable.
5. **Preserve safety limits.** Keep recursion and execution-step guards. Their failures should be distinguishable from syntax or semantic errors.
6. **Run the full regression gate.** Existing tests must remain intact. Record exact commands, exit codes, test counts, and example output. A planned test is not a passing test.

## Acceptance criteria

- Existing Phase 7W regression tests are preserved and run.
- Every supported operator has direct correctness coverage.
- Precedence and associativity are demonstrated with expressions whose results distinguish alternative parses.
- Parentheses override precedence where supported.
- Malformed expressions and unsupported operators fail deterministically.
- Checker/runtime outcomes agree for the tested expression corpus.
- Division by zero, invalid operands, bad function arity, unknown functions, recursion exhaustion, and step-limit exhaustion produce distinct, useful errors where those cases are applicable.
- The example program is checked and run successfully.
- Test evidence is saved in the phase report and CI is green before claiming completion.

## Suggested diagnostic shape

The implementation may use a structured error object internally. At the CLI boundary, aim for a stable human-readable shape such as:

```text
E_ARITY: function 'add' expects 2 arguments but received 1 (line 4, column 12)
```

This is an example of the target diagnostic shape, not a claim about current output.

## Deliverables

- Regression tests for the current executable subset.
- Minimal source fixtures for valid and invalid expressions.
- Checker/runtime consistency tests.
- A phase report with actual test output.
- Any implementation changes, kept separate from canonical specification documents unless a reviewed canonical decision explicitly authorises a change.

## Explicit non-goals

- Declaring the Phase 7W subset to be canonical Arcane.
- Inventing grammar for forms absent from the supplied language specification.
- Replacing the workbench's parser or dimensional algebra without evidence.
- Marking tests as passing without execution.
