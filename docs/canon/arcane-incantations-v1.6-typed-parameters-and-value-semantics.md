# Arcane Incantations v1.6 — Typed Parameters and Value Semantics

**Status:** LOCKED DESIGN CANON for the bounded modern incantation layer  
**Depends on:** Incantations v1.0–v1.5; related measurement rules are reused only where their contracts apply  
**Validation status:** 46 specification fixtures. These are expected outcomes, not results from an executable parser, type checker, or spell runtime.

## 1. Purpose and scope

Version 1.6 defines typed values for incantation arguments and operation results. It prevents a spell from treating a reference as a value, a missing measurement as zero, an unknown state as false, or a quantity with one dimension as interchangeable with a different dimension.

This is a modern design layer. Type names and record forms below are specification metalanguage, not new spoken Arcane tokens or claims about historical grammar.

The Modern Vernacular measurement specifications v2.6–v2.7 provide related context for typed quantities and comparisons, but remain a separate branch. This document does not promote Vernacular vocabulary into Formal incantation syntax.

## 2. Type discipline

Every parameter, output, stored binding and measured observation must declare a type or an explicit unresolved type state.

**TYPED-VALUE = (TYPE, PAYLOAD, PROVENANCE, VALIDITY, UNCERTAINTY)**

- **TYPE:** the declared value type.
- **PAYLOAD:** a value conforming to that type, if available.
- **PROVENANCE:** where the value came from and how it was obtained.
- **VALIDITY:** the interval, scope or conditions under which it may be used.
- **UNCERTAINTY:** known uncertainty, precision limits, or an explicit statement that uncertainty is uncharacterised.

The payload may not contradict its type. Provenance, validity and uncertainty are functional metadata: an operation may require any of them as preconditions.

Type correctness is necessary but not sufficient for semantic validity, physical feasibility, authority, execution or successful outcome.

## 3. Bounded core types

The v1.6 layer defines these conceptual types:

- **Bool:** a known truth value, TRUE or FALSE.
- **Integer:** a whole number with an explicitly declared range where range matters.
- **Real:** a numeric value under a declared representation and precision policy.
- **Text:** a sequence of symbols or characters under a declared encoding.
- **Identifier:** a stable name within a declared namespace; not itself the entity it identifies.
- **Enum<T>:** one member of a declared finite set.
- **Record<T>:** a value with named, typed fields under a declared schema.
- **List<T>:** an ordered finite collection whose members conform to T.
- **Set<T>:** a collection of unique members conforming to T; order is not implied.
- **Option<T>:** either SOME(T) or NONE, where absence is meaningful and distinct from a T value.
- **Result<T,E>:** either OK(T) or ERR(E); failure is not encoded as an ordinary T value.
- **Reference<T>:** a typed reference to an entity or resource under a resolution and validity contract.
- **Quantity<D,U>:** a numeric magnitude with physical or domain dimension D and unit U, under an explicit conversion contract.
- **Measurement<T>:** a typed observation of T with method, time, uncertainty and provenance.
- **Predicate<T>:** a defined test that evaluates a T value to a known Bool or an explicit unknown/error result.

Implementations may use more precise types, but may not silently collapse these distinctions. Null-like values must use Option or an equally explicit contract, not an untyped universal escape hatch.

## 4. Value, reference, measurement and identity

These concepts are distinct:

- **Identifier:** names something in a namespace.
- **Reference<T>:** designates a particular resolved entity or resource according to a reference contract.
- **Value<T>:** captures data of a type.
- **Measurement<T>:** reports an observation, including method and uncertainty.
- **Snapshot<T>:** a value captured at a specified logical time or observation event.
- **LiveReference<T>:** a reference whose resolution can change only under an explicit live-update contract.

A reference does not contain the referent's current state unless the contract says that state was measured or captured. A snapshot does not update when the underlying entity changes. A live reference must specify updates, identity changes, invalidation and observation time.

Two references that resolve to entities with equal properties are not automatically references to the same entity. Identical identifier text in different namespaces does not establish identity. Identity must be established by the relevant reference subsystem.

## 5. Missing, unknown, false and invalid

The following states remain distinct:

- **Known true:** a predicate was evaluated and returned TRUE.
- **Known false:** a predicate was evaluated and returned FALSE.
- **Unknown:** available evidence cannot determine the truth value.
- **Absent:** an optional value was not supplied or does not exist under its Option contract.
- **Invalid:** a value or reference violates its type, validity contract or domain rules.
- **Error:** acquisition or evaluation failed under a declared error contract.

Unknown is not false. Absent is not zero. Invalid is not absent. Error is not a valid payload.

A predicate over missing or stale data must return an explicit unknown/error outcome unless its own specification defines another safe result. An operation requiring a known-true precondition must not proceed when the result is unknown.

## 6. Quantity and unit semantics

A Quantity has a dimension, a unit, a numeric representation and a conversion contract. Comparison or arithmetic is valid only where applicable dimension and operation rules permit it.

- Values with incompatible dimensions cannot be compared as the same kind of quantity.
- Unit conversion requires a defined rule, including scale and, where relevant, offset and precision behaviour.
- A unit label alone does not establish a valid conversion.
- A dimensionless number is not interchangeable with a measured quantity merely because magnitudes match.
- Quantities with different uncertainty bounds must preserve those bounds through supported operations.
- If unit or dimension is unknown, dimension-sensitive operations are unresolved.
- Rounding and overflow behaviour must be declared by the numeric subsystem; this document sets no universal policy.

This is compatible in spirit with the separate Modern Vernacular v2.6–v2.7 measurement work, but does not import its lexical forms into incantation utterances.

## 7. Type compatibility and conversions

A value may enter an operation only if its declared input contract accepts the type.

1. Exact type matches are accepted only if validity and domain requirements also pass.
2. A subtype or refinement is accepted only under a declared, checked subtype relation.
3. Numeric widening is allowed only if explicitly defined and range/precision guarantees are preserved.
4. Unit conversion is allowed only through an applicable conversion contract.
5. Record conversion requires a declared mapping for every required field.
6. Collection conversion must preserve order and uniqueness guarantees or explicitly report their loss.
7. Reference conversion cannot silently change the referent or broaden authority scope.
8. Unknown, None, Error or Invalid cannot be implicitly converted into an ordinary payload.

Every non-trivial conversion records source type, target type, conversion rule and any loss of precision or information.

## 8. Operation signatures and outputs

Each operation must declare a signature:

**SIGNATURE = (OPERATION-ID, INPUT-TYPES, OUTPUT-TYPES, PRECONDITIONS, EFFECT-CLASS, FAILURE-TYPES)**

A signature is a type-checking contract; it does not alone prove a mechanism exists or that the operation is feasible.

The forms kren, trak, frem, shren, bran and vare retain the bounded modern roles defined in v1.0 and v1.3. This document does **not** invent complete historical signatures for them. A concrete invocation is type-checkable only when its applicable operation subsystem provides a versioned signature.

If a signature is absent, ambiguous or incompatible with supplied argument types, the invocation is UNDERSPECIFIED or has a type error. The evaluator must not infer argument types from English glosses.

Outputs are typed values, measurements, references or explicit results. An operation that can fail should use a declared Result or equivalent status contract, not fabricate an ordinary value to conceal failure.

## 9. Binding and temporal validity

A binding includes its type and validity contract. It may be step-scoped, plan-scoped, externally supplied, snapshot-based or live where an explicit subsystem supports live updates.

A value that has expired, a measurement outside its valid time window, or a reference invalidated by an earlier event cannot be used as if current. The consuming operation must request re-resolution, remeasurement or an explicit stale-data policy.

Binding scope does not itself establish a dependency; v1.4 dependency rules still apply. A successful type check does not waive target-resolution, authority, constraint or resource checks.

## 10. Errors and diagnostic results

The type layer distinguishes:

- **TYPE-ERROR:** payload conflicts with its declared type or an operation signature is incompatible.
- **CONVERSION-ERROR:** no permitted conversion exists or conversion failed.
- **VALUE-UNKNOWN:** the required value cannot be determined.
- **VALUE-ABSENT:** an Option is NONE where a value is required.
- **REFERENCE-INVALID:** reference resolution or validity contract failed.
- **VALUE-STALE:** a value or measurement is outside its declared validity.
- **DOMAIN-ERROR:** value is outside the input domain of a defined operation.
- **NUMERIC-ERROR:** overflow, precision failure or another declared numeric fault.
- **SIGNATURE-UNAVAILABLE:** no complete applicable operation signature is registered.

These are diagnostic outcomes, not spoken tokens. Mapping into broader evaluator and invocation states must preserve the cause; VALUE-UNKNOWN must not be reported as TYPE-ERROR unless a type rule was also violated.

## 11. Acceptance and rejection fixtures

Specification-level expected outcomes; not executed by a type checker.

| ID | Condition | Expected result |
|---|---|---|
| TYP16-01 | Value payload conforms to declared type | Accept type shape |
| TYP16-02 | Integer supplied where Text is required | TYPE-ERROR |
| TYP16-03 | Identifier treated as the referenced entity itself | Reject |
| TYP16-04 | Reference treated as a snapshot without observation | Reject |
| TYP16-05 | Snapshot silently updates after referent changes | Reject |
| TYP16-06 | Live reference changes without update contract | REFERENCE-INVALID or reject |
| TYP16-07 | Unknown predicate result treated as FALSE | Reject |
| TYP16-08 | Absent quantity treated as zero | Reject |
| TYP16-09 | Error result used as a successful payload | Reject |
| TYP16-10 | Option NONE consumed where a value is required | VALUE-ABSENT |
| TYP16-11 | Required input is unknown | VALUE-UNKNOWN; block dependent operation |
| TYP16-12 | Measurement lacks required provenance | Evidence insufficient |
| TYP16-13 | Stale measurement consumed without permitted policy | VALUE-STALE |
| TYP16-14 | Identical identifier text but different namespaces | Identity not established |
| TYP16-15 | Equal property values treated as entity identity | Reject |
| TYP16-16 | Quantity dimensions are incompatible | TYPE-ERROR or DOMAIN-ERROR |
| TYP16-17 | Compatible quantities use declared unit conversion | Accept if checks pass |
| TYP16-18 | Unit conversion has no defined contract | CONVERSION-ERROR |
| TYP16-19 | Dimensionless scalar silently treated as dimensional quantity | Reject |
| TYP16-20 | Uncertainty discarded where propagation is required | Reject |
| TYP16-21 | Numeric widening lacks explicit rule | CONVERSION-ERROR |
| TYP16-22 | Record conversion omits a required field | TYPE-ERROR |
| TYP16-23 | Set converted to List without defined ordering | Reject or require explicit ordering |
| TYP16-24 | List converted to Set and duplicates silently discarded | Reject silent information loss |
| TYP16-25 | Reference conversion broadens target or authority scope | Reject |
| TYP16-26 | Error/Unknown/None implicitly converted to ordinary payload | Reject |
| TYP16-27 | Operation input mismatches registered signature | TYPE-ERROR |
| TYP16-28 | Operation gloss used to invent undocumented signature | Reject |
| TYP16-29 | Signature unavailable for concrete invocation | SIGNATURE-UNAVAILABLE |
| TYP16-30 | Output failure concealed by fabricated default | Reject |
| TYP16-31 | Binding scope mistaken for dependency | Apply v1.4 dependency rules |
| TYP16-32 | Expired binding consumed as current | VALUE-STALE |
| TYP16-33 | Re-resolution required but substitute target chosen silently | Reject |
| TYP16-34 | Measurement uncertainty exceeds required tolerance | Block or insufficient evidence |
| TYP16-35 | Numeric overflow under declared range policy | NUMERIC-ERROR |
| TYP16-36 | Rounding behaviour required but unspecified | UNDERSPECIFIED |
| TYP16-37 | Type check passes but resource budget fails | RESOURCE-INSUFFICIENT |
| TYP16-38 | Type check passes but external authority is absent | Execution blocked |
| TYP16-39 | Type check passes but mechanism evidence is insufficient | Not validated |
| TYP16-40 | Typed output produced with provenance retained | Accept output contract |
| TYP16-41 | Value copied between steps without required dependency | Reject under v1.4 |
| TYP16-42 | Unknown input converted to false to satisfy branch | Reject |
| TYP16-43 | Quantity conversion changes dimension without defined rule | CONVERSION-ERROR |
| TYP16-44 | Typed reference remains well-formed but target no longer exists | REFERENCE-INVALID |
| TYP16-45 | Measurement treated as underlying value without explicit extraction | Reject |
| TYP16-46 | Type checks pass but outcome has not been executed or observed | Type-valid only; no outcome claim |

## 12. Explicitly unresolved

This version does not define a universal numeric representation, all physical dimensions and units, conversion tables, uncertainty calculus, subtype lattice, signature registry for every operation, canonical spoken syntax for type declarations, type inference, polymorphism, dependent types, concurrency-safe live references, or a runtime type checker.

**Change policy:** Typed parameter and value semantics are locked for this bounded layer. Future work must version operation signatures and conversion contracts, preserve provenance and uncertainty, include invalid and stale-value cases, and never use type correctness as a substitute for feasibility, authority, execution or outcome verification.
