# Arcane Phase 7Y — information and binding contract dossier

**Status:** Evidence-grounded contract questions; proposals are not canon  
**Date:** 2026-10-15  
**Decision ID:** P7Y-INFO-BINDING-01  
**Canon effect:** none · **New forms:** 0 · **Executable tests run:** 0

## 1. Scope and evidence

This dossier narrows incantation work to NES, SIMA, GAMA, KWAM and KWAT. It uses `docs/canon/arcane-language-v3.0-L.md`, `docs/audits/phase-2-formal-syntax.md` and Phase 7X's registry. The Phase 2 signatures and angle-bracket notation are proposals for testing, not a replacement for canonical surface syntax.

The canonical v3.0-L gives `SIMA RI VANU` approximately as `MEASURE(TARGET.VELOCITY)`; it also gives conceptual binding examples `KWAM 1 E`, `KWAT 1` and `KWAK 1`. It explicitly leaves identifier representation and evaluation semantics open. Do not treat these examples as proof of a complete executable contract.

## 2. Evidence labels

- **CANONICAL STATEMENT:** directly specified in v3.0-L.
- **CANONICAL EXAMPLE, SEMANTICS PARTIAL:** source example exists, but execution details remain open.
- **PROPOSED AUDIT CONTRACT:** useful for review, not promoted to canon.
- **UNRESOLVED:** evidence does not determine the answer.
- **NOT EXECUTABLE:** insufficient detail to claim a complete incantation.

## 3. NES — retrieve available information

**Established:** NES retrieves or reads available information. It is distinct from SIMA, which measures through a physical pathway, and DAVE, which infers from information.

| Contract field | Current record |
|---|---|
| Input concept | Available-information reference/source |
| Output concept | Retrieved information |
| Exact arity | Unresolved; Phase 2 proposes at least one conceptual input |
| Scope/access rules | Unresolved |
| Unavailable-source behaviour | Unresolved |
| Freshness/staleness behaviour | Unresolved |
| Truth/reliability guarantee | No guarantee established |
| Side effects | None established by the inspected description |
| Status | Not executable |

**Required distinctions:**
1. Retrieving a record is not measuring a current physical property.
2. Retrieved information is not automatically accurate, current, complete or authorised.
3. An unavailable source must not silently become a fabricated value.
4. NES must not substitute for DAVE when the intended operation is inference.

**Semantic prompts, not Arcane translations:** “retrieve the recorded temperature” versus “measure the current temperature”; “retrieve a claim that X” versus “establish that X is true”; “source unavailable” versus “source contains an empty value”.

## 4. SIMA — measure through a physical pathway

**Established:** SIMA measures through a physical pathway. The canonical specification says measurement requires a pathway, sensor, interaction, resolution and available information.

| Contract field | Current record |
|---|---|
| Input concepts | Target/property and measurement-pathway specification |
| Output concept | Observation |
| Exact surface arity | Unresolved; Phase 2 identifies at least two concepts |
| Sensor, interaction and pathway representation | Required conceptually; syntax unresolved |
| Resolution/uncertainty | Required conceptually; representation unresolved |
| Available information | Required precondition |
| Failure modes | Not fully specified |
| Status | Not executable |

**Required distinctions:** measurement differs from retrieval; an observation differs from an inference; a property name is not a sensor/pathway; a result without resolution must not be described as exact; inaccessible targets must not yield invented observations.

The canonical example `SIMA RI VANU` is retained with its source qualification. It does not prove that target/property notation alone encodes every required sensor, interaction, pathway and resolution parameter.

## 5. GAMA — assign a representation/value

**Established:** GAMA assigns a representation/value. Assignment is not physical causation.

| Contract field | Current record |
|---|---|
| Input concepts | Symbolic destination/reference and value |
| Exact arity | Two conceptually; normative signature unresolved |
| Output concept | Assignment or updated symbolic state |
| Type compatibility | Required; exact rules unresolved |
| Reassignment, scope and lifetime | Unresolved |
| Physical side effect | None follows merely from assignment |
| Status | Symbolic examples only after signature review |

Assigning a represented temperature does not make a target physically reach that temperature. Assigning a target reference is not coupling to the target. Type-invalid values must not be accepted because the syntax looks plausible.

## 6. KWAM — create a binding

**Established:** KWAM creates a binding. The source's conceptual example `KWAM 1 E` binds expression E to identifier 1, while identifier representation and evaluation semantics remain open.

| Contract field | Current record |
|---|---|
| Input concepts | Identifier and expression/value |
| Exact arity | Two conceptually; normative signature unresolved |
| Output concept | Binding declaration/record |
| Identifier syntax | Unresolved; `1` is a source example |
| Evaluation policy | Unresolved |
| Scope/lifetime | Unresolved |
| Duplicate identifier, rebinding and shadowing | Unresolved |
| Invalid-expression behaviour | Unresolved |
| Physical side effect | None follows from binding alone |
| Status | Skeleton only |

A binding might capture a value at declaration or refer to an expression evaluated later. These are different policies. The source mentions KWAK as live evaluation where appropriate, but does not establish that every KWAM binding is live or fully define the relationship.

## 7. KWAT — reference an established binding

**Established:** KWAT references an established binding. Phase 2 proposes one identifier input, but the signature remains provisional.

| Contract field | Current record |
|---|---|
| Input concept | Binding identifier |
| Arity | One in Phase 2 proposal; not locked canon |
| Output concept | Bound value/expression under the binding policy |
| Unknown identifier | Failure policy unresolved; must not silently fabricate a value |
| Scope resolution | Unresolved |
| Result type | Inherited from binding; typing rules unresolved |
| Evaluation timing | Depends on unresolved binding policy |
| Status | Skeleton only |

A reference is not a declaration or fresh measurement. KWAT and KWAK are not synonyms: reference and live evaluation have distinct documented glosses. Identifiers in different scopes must not be resolved by undocumented guesswork.

## 8. Cross-operator boundaries

| Relationship | Supported statement | Unsupported inference |
|---|---|---|
| NES → information | Retrieval can make a record available to later processing | Record is true, current or physically measured |
| SIMA → observation | Measurement yields an observation under pathway preconditions | Observation entails an inference or has zero uncertainty |
| KWAM → KWAT | A binding may be declared and later referenced conceptually | Exact lifetime, scope and evaluation policy |
| GAMA ↔ KWAM/KWAT | These involve symbolic state/references but have different glosses | They are interchangeable or share side effects |
| NES ↔ SIMA | Both may supply information to later processing | Same source semantics or physical requirements |
| NES/SIMA → DAVE | Information/observations may inform inference conceptually | Automatic inference or guaranteed correctness |

These are conceptual dependencies, not valid surface syntax or a completed incantation sequence.

## 9. Decisions needed, in order

1. **Identifier model:** which identifiers are legal; is `1` illustrative or canonical?
2. **Binding evaluation:** does KWAM bind a value, expression, or either under an explicit mode?
3. **Scope and lifetime:** where and for how long can KWAT resolve a binding?
4. **Missing identifier:** what exact failure result is defined?
5. **NES source model:** what counts as an available-information source; how are unavailable or stale sources represented?
6. **SIMA pathway:** are sensor, interaction, pathway and resolution one structured argument or separate arguments?
7. **Observation type:** what minimum metadata belongs to an observation?
8. **GAMA destination type:** what can receive a symbolic assignment, and how is compatibility checked?
9. **Expression boundaries:** how are arguments grouped in actual Arcane, apart from proposed Phase 2 angle-bracket notation?
10. **Version selection:** which inventory applies to each candidate, and how are legacy aliases preserved?

## 10. Acceptance tests (specified, not run)

| ID | Scenario | Required policy |
|---|---|---|
| IB-01 | NES reads an available record | Retrieval may succeed; no truth/freshness guarantee |
| IB-02 | NES source unavailable | Explicit failure/unknown; no fabricated record |
| IB-03 | SIMA has target but no pathway | Construction incomplete |
| IB-04 | SIMA has pathway but no interaction/information | Incomplete or fails under future mechanism rules |
| IB-05 | SIMA observation is asserted as fact | Require an explicit inference/acceptance rule |
| IB-06 | GAMA assigns symbolic value | No physical side effect inferred |
| IB-07 | KWAM declares identifier and expression | Binding record only; evaluation policy explicit |
| IB-08 | KWAT references existing binding | Resolve under specified scope/evaluation policy |
| IB-09 | KWAT references unknown identifier | Explicit error/unknown; no implicit zero/null |
| IB-10 | Identifier exists in two scopes | Apply specified rule or report ambiguity |
| IB-11 | Bound expression depends on changing state | Follow declared eager/live policy; no guess |
| IB-12 | Skeleton uses unknown signature | Blocked; no executable status |
| IB-13 | Historical/renamed form used | Preserve source/version and alias relationship |
| IB-14 | Assignment is claimed to alter target physics | Reject causal inference without a separate mechanism |
| IB-15 | Measurement is called exact with no resolution | Reject unsupported precision claim |

## 11. Fixture record format

Until the surface grammar and contracts are approved, use structured review records rather than fabricated Arcane strings:

```yaml
fixture_id: IB-01
status: semantic-prompt
language_version: Arcane-v3.0-L-reference
register: Formal-Arcana-research
operation: NES
intent: retrieve a record from an identified available-information source
surface_form: null
parse_tree: unresolved
signature_status: unknown
expected_distinctions:
  - retrieval-is-not-measurement
  - retrieval-does-not-guarantee-truth
gate_l: BLOCKED_BY_SPEC
gate_c: INCOMPLETE
gate_p: NOT_ASSESSED
notes: No executable Arcane expression is asserted.
```

This is a documentation example only; it does not claim the website accepts YAML or that the snippet is executable in Arcane.

## 12. Decision ledger

- **Decision ID:** P7Y-INFO-BINDING-01
- **Operators scoped:** NES, SIMA, GAMA, KWAM, KWAT; KWAK noted but not contracted
- **New forms/canon changes:** none
- **Executable tests run:** none
- **Surface incantations invented:** none
- **Next step:** resolve identifier model, binding evaluation, scope/lifetime and missing-identifier behaviour; then draft reviewed formal skeletons only if those choices and expression-boundary rules are explicit.
