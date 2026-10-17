# Arcane Incantations v1.1 — Target Resolution and Binding

**Status:** LOCKED DESIGN CANON for the bounded Formal Arcane incantation layer  
**Version:** Incantations 1.1  
**Depends on:** Incantations v1.0  
**Source basis:** The indexed Mega Pack2 lexicon records `kwam` (“bind”) and `kwat` (“reference binding”) as Formal / CANON / v3.0-L. It records `pi` (point), `len` (line), `pla` (plane), `sur` (surface), `vom` (volume), `par` (path), `ben` (region; renamed from `ren`), and `net` (network) as Formal geometry forms. Separately, the lexicon records performed fused references `mi`, `me`, `mə`, `ni`, `ne`, `nə`, `ri`, `re`, `rə`, `ra`, `ro`, and `ru` as Performed / CANON (v2.0). The performed forms remain performed forms and are not promoted to Formal tokens here.  
**Validation status:** Specification-level design and 24 fixtures. No parser execution, target-tracking simulation, or independent-speaker validation is claimed.

## 1. Purpose

A spell must identify its intended referent unambiguously. This version defines a bounded reference and binding model for incantations. It does not define how arbitrary real-world entities are sensed, detected, authenticated or physically tracked. A reference can be grammatically well-formed yet remain unresolved if the environment supplies insufficient information.

This specification separates four things:
1. **reference class** — what kind of referent is meant (self, field, or target);
2. **scope** — what geometric extent is referred to;
3. **resolution result** — which concrete referent(s), if any, match;
4. **binding** — the stable association between a symbolic reference and its resolved referent for a specified scope and lifetime.

A label is not the referent itself. Binding a label does not create, own, move, constrain or authorise its referent.

## 2. Source vocabulary and register boundaries

The source lexicon records `kwat` as reference binding and `kwam` as bind. v1.1 uses `kwat` for the operation of resolving and associating a reference label with a typed referent, and `kwam` for committing that association into the current spell context. This division of labour is a new incantation-layer rule; the source glosses alone do not prove this exact contrast historically.

The source geometry vocabulary is used for scope labels:
- `pi` — point;
- `len` — line;
- `pla` — plane;
- `sur` — surface;
- `vom` — volume;
- `par` — path;
- `ben` — region (the source records this as renamed from `ren`);
- `net` — network.

These are typed geometry terms, not generic words meaning “target”. Their exact coordinate systems and construction rules remain dependent on a separately defined geometry layer.

The fused forms `mi`, `me`, `mə`, `ni`, `ne`, `nə`, `ri`, `re`, `rə`, `ra`, `ro`, and `ru` are explicitly recorded as **Performed** forms. Their listed readings are:
- `mi` SELF-point; `me` SELF-surface; `mə` SELF-volume;
- `ni` FIELD-point; `ne` FIELD-surface; `nə` FIELD-volume;
- `ri` TARGET-point; `re` TARGET-surface; `rə` TARGET-volume;
- `ra` TARGET-path; `ro` TARGET-network; `ru` TARGET-extended region.

These performed forms are preserved in their own stratum. A performed utterance protocol may use them according to its own rules; a Formal written incantation must not substitute them for a Formal reference construction merely because their glosses are convenient. In particular, `re` collides with a digit form in another stratum; no global rewrite or cross-register identity is permitted.

## 3. Typed reference record

For the purpose of this version, a resolved reference is represented in the semantic model as:

**REF = (LABEL, CLASS, SCOPE, REFERENT-ID, RESOLUTION-STATUS, LIFETIME)**

This is a semantic record, not a claim that the tuple is literally spoken as Arcane.

- **LABEL:** the local symbolic name used by the spell.
- **CLASS:** SELF, FIELD, or TARGET.
- **SCOPE:** one geometry type supported by the particular reference.
- **REFERENT-ID:** a stable identity assigned by the evaluator; absent if unresolved.
- **RESOLUTION-STATUS:** RESOLVED, AMBIGUOUS, MISSING, STALE, or INVALID.
- **LIFETIME:** the scope in which the binding remains valid; this version defines only the choices CURRENT-STEP and SPELL.

The label must be unique within the spell's binding environment. Reusing a label for a different referent in the same environment is a binding conflict, not an implicit reassignment.

## 4. Reference classes

### 4.1 SELF

SELF refers to the caster/executing agent identified by the spell context. It does not automatically refer to the caster's possessions, body parts, allies, viewpoint, location, or resources. Those require explicit referents or a later typed relation.

If the execution context has no unique caster identity, SELF is unresolved.

### 4.2 FIELD

FIELD refers to an explicitly supplied field referent. It does not mean “everything nearby”, “the whole world”, “all available mana”, or an unbounded region. The field must be identified by a valid external context or a separately specified field descriptor.

If no field identifier or valid field descriptor is available, FIELD is unresolved. The system must not invent a field because a spell would be easier to execute with one.

### 4.3 TARGET

TARGET denotes a referent selected by an explicit selector or external binding. It is not a universal pronoun that automatically chooses the nearest, most salient, most hostile, or most convenient entity. v1.1 defines no automatic nearest-target or intent-based target selection.

A target selector that resolves to multiple candidates is AMBIGUOUS unless the selector explicitly supports a collection-valued target and the operation accepts that type.

## 5. Scope types

Scope specifies the geometric extent of a referent, not its semantic identity.

| Scope | Meaning in this layer | Does not imply |
|---|---|---|
| `pi` | point-like location/reference | an object exists at that point |
| `len` | line | direction, thickness, or path traversal |
| `pla` | plane | a bounded surface |
| `sur` | surface | the object's volume or interior |
| `vom` | volume | that every contained entity is a target |
| `par` | path | that movement along it is possible |
| `ben` | region | a universal boundary convention |
| `net` | network | that every node or edge is selected |

A scope descriptor must be supported by the geometry model. The v1.1 reference layer does not define coordinate frames, units, boundary inclusion, topology, shape construction or intersection rules. An untyped or invalid scope is rejected.

Point, line, plane, surface, volume, path, region and network are not interchangeable. A target-volume reference does not silently become a target-surface reference; a path is not automatically a line; and a network is not necessarily a contiguous spatial region.

## 6. Binding grammar and abstract construction

The following are abstract grammar schemata, not literal strings with English placeholders:

- **Reference declaration:** `kwat LABEL CLASS SCOPE SELECTOR LIFETIME`
- **Binding commit:** `kwam LABEL`
- **Operation use:** `OPERATION ... REF(LABEL) ...`

`LABEL`, `CLASS`, `SCOPE`, `SELECTOR` and `LIFETIME` stand for separately typed values. This version does not assign invented spoken words to these fields. A conforming parser must reject placeholders or values not licensed by the applicable subgrammar.

The intended semantics are:
1. `kwat` resolves the selector and proposes a binding record.
2. The resolver returns exactly one of RESOLVED, AMBIGUOUS, MISSING, STALE or INVALID.
3. `kwam` commits only a RESOLVED record with a unique label and a valid lifetime.
4. Operations may refer to a committed label only while its binding remains valid.
5. A failed reference declaration or binding commit blocks dependent operations; it does not fall back to another target.

This ordering is a new incantation-layer design. It does not claim that the source forms had this complete execution protocol historically.

## 7. Lifetime, movement and invalidation

v1.1 defines two lifetimes:

- **CURRENT-STEP:** binding is valid only for the current evaluation step. It must be resolved again before use in a later step.
- **SPELL:** binding remains valid throughout the current spell instance, subject to invalidation rules.

A SPELL-lifetime binding does not freeze the referent in physical space. If the referent moves, the binding continues to denote the same identity only if identity tracking remains reliable. Its geometry may become stale if the scope descriptor refers to a previous position or shape.

A binding becomes STALE when its defining assumptions no longer hold, such as when:
- a point/surface/volume descriptor was tied to an outdated coordinate or shape;
- identity tracking is lost;
- the referent ceases to exist or becomes unavailable;
- a required external field or coordinate frame becomes invalid.

The evaluator must not silently retarget a stale binding. It must re-resolve under an explicit rule or stop the dependent operation.

## 8. Resolution cardinality and collections

The default selector must resolve to exactly one referent. Zero matches yields MISSING; more than one yields AMBIGUOUS. A collection is allowed only when a selector is explicitly collection-valued and the receiving operation declares that it accepts a collection.

v1.1 defines no universal “all targets in a region” operator. A volume reference describes spatial scope; it does not by itself select every object inside that volume. A network reference describes a network referent; it does not automatically select all nodes.

## 9. Safety and authority boundaries

Target resolution is descriptive, not authorising:
- identifying a living entity does not grant consent;
- identifying a target does not prove that an operation is permitted;
- binding a referent does not establish a coupling;
- establishing a coupling does not establish a later effect;
- resolving a position does not prove reachability;
- selecting a volume does not authorise an indiscriminate effect on every entity inside it.

Permission, consent, harm constraints and operational safety need their own explicit rules. They must not be smuggled into target syntax.

## 10. Acceptance and rejection fixtures

These are specification-level fixtures, not executed parser results.

| ID | Input/condition | Expected result |
|---|---|---|
| REF11-01 | `kwat L TARGET pi SELECTOR SPELL` resolves exactly one referent | RESOLVED declaration candidate |
| REF11-02 | `kwam L` after a valid resolved declaration | COMMIT binding |
| REF11-03 | Use committed `L` within its SPELL lifetime | ACCEPT if geometry is still valid |
| REF11-04 | TARGET selector returns no candidates | MISSING; dependent operation blocked |
| REF11-05 | TARGET selector returns two candidates, scalar expected | AMBIGUOUS; dependent operation blocked |
| REF11-06 | Reuse label `L` for a different referent in the same environment | REJECT; binding conflict |
| REF11-07 | Commit a reference whose status is AMBIGUOUS | REJECT |
| REF11-08 | Commit a reference whose status is STALE | REJECT |
| REF11-09 | Use an unbound label in `kren` or `trak` | REJECT; unresolved reference |
| REF11-10 | Use `sur` as if it necessarily meant volume | REJECT; scope type mismatch |
| REF11-11 | Use `par` and assume it is a traversable route | REJECT; reachability not entailed |
| REF11-12 | Use `vom` and assume all contents are selected | REJECT; scope is not a collection selector |
| REF11-13 | Use `net` and assume all nodes are targets | REJECT unless selector and operation explicitly accept a collection |
| REF11-14 | Use `SELF` to refer automatically to caster's clothing | REJECT; distinct referent required |
| REF11-15 | Use FIELD with no field identifier or descriptor | UNRESOLVED |
| REF11-16 | Use TARGET with implicit “nearest” selection | REJECT; nearest-target rule undefined |
| REF11-17 | SPELL-lifetime identity persists while target moves and identity tracking is reliable | Binding may persist; spatial descriptor may become stale |
| REF11-18 | Current position is stale | STALE; no silent retargeting |
| REF11-19 | Treat performed `ri` as a newly licensed Formal token | REJECT; register boundary |
| REF11-20 | Treat performed `re` as globally identical to the numeral `re` | REJECT; stratum and slot must be preserved |
| REF11-21 | A target is resolved and therefore assumed to have granted consent | REJECT; reference is not permission |
| REF11-22 | A target is bound and therefore assumed coupled | REJECT; binding is not coupling |
| REF11-23 | A point reference is used where an operation requires a volume | TYPE ERROR |
| REF11-24 | A valid label is used after its CURRENT-STEP lifetime ends | STALE/EXPIRED; re-resolution required |

## 11. Explicitly unresolved

This version does not define:
- the spoken encodings of labels, selectors, class values or lifetime values;
- a sensor/perception model for finding entities;
- identity authentication or adversarial spoofing resistance;
- coordinate systems, transformations, units or boundary inclusion;
- general collection selectors, filtering or iteration;
- reference to object parts, ownership, allies, body regions or nested structures;
- how binding interacts with asynchronous or concurrent spells;
- permission, consent, ownership, ethics or harm-prevention operators;
- a complete formal-to-performed compilation protocol.

**Change policy:** This version adds a bounded reference-resolution model only. It does not promote Performed fused forms into Formal grammar and does not alter the source lexicon. Any extension must specify types, cardinality, lifetime, invalidation and negative cases.
