# Arcane Incantations v2.1 — Policy-Profile Composition and Conflict Resolution

**Status:** LOCKED DESIGN CANON for the bounded modern incantation metalanguage  
**Layer:** Domain-scoped policy composition contract; not historical spoken syntax  
**Depends on:** Incantations v1.0–v2.0, especially typed values (v1.6), predicate evidence and temporal semantics (v1.7), resource gates (v1.9), and authority decision records (v2.0)  
**Validation status:** 60 specification fixtures defined below. They are normative design expectations, not executed policy-engine tests.  
**Source-vocabulary effect:** None. No spoken tokens, historical meanings, universal authority hierarchy, legal policy, or operation signatures are introduced.

## 1. Purpose and boundary

Version 2.0 defines the record and lifecycle for deciding whether a named subject may perform a scoped action. It deliberately leaves policy composition and conflict resolution to a declared domain contract. Version 2.1 defines that missing composition boundary: how an explicitly configured set of policy profiles is identified, selected, trusted, version-pinned, combined, and audited before its result is used by the v2.0 authorisation gate.

A **policy profile** is a versioned, domain-scoped set of rules and constraints. A **composition plan** states which profiles may apply and exactly how their outcomes or constraints combine. A profile is not an authority merely because it exists; a trusted issuer is not automatically authorised to publish every profile; and a composition result is not itself proof that the final action is permitted.

This is a modern abstract contract, not a reconstruction of historical Arcane grammar. Uppercase labels and outcomes are metalanguage identifiers, not spoken incantation tokens. This specification does not create an executable policy service, identity provider, cryptographic protocol, legal policy, or universal hierarchy among authorities.

## 2. Non-substitution and fail-closed principles

These stages remain distinct:

1. Validate the request and its typed references.
2. Identify the configured policy bundle and its immutable composition-plan version.
3. Establish profile provenance, trust, integrity, version and validity.
4. Evaluate profile applicability against the request and relevant context.
5. Compose applicable profiles only using the configured, version-pinned strategy.
6. Translate the composition result into a v2.0 authorisation outcome and preserve its provenance.
7. Recheck time-sensitive policy and decision conditions at the execution boundary required by the invocation contract.
8. Keep consent, resource readiness, mechanism feasibility, execution and outcome verification as independent gates.

Passing one stage never implies that a later stage passes. In particular:

- the presence of a profile is not proof that it applies;
- a profile's name, issuer rank, creation time, filename or list position is not precedence;
- the newest policy version is not silently substituted for the pinned version;
- missing or unavailable policy data is not an empty policy and is not approval;
- a conflict is not a DENY unless a trusted, applicable configured rule explicitly produces DENY;
- a DENY from one profile cannot be silently ignored by an unspecified merge;
- a successful merge is not permission to bypass v2.0 scope, issuer, expiry, revocation or consent checks;
- a policy result of PERMIT is not proof of resource sufficiency, physical feasibility, execution or success.

All failures block the guarded action unless a specific, trusted, applicable composition plan explicitly defines a narrower, valid result. “Fail closed” means no permission is granted by uncertainty; it does not mean every uncertainty is mislabeled as DENY.

## 3. Core records

A **POLICY-PROFILE** has the following abstract fields:

`(PROFILE-ID, PROFILE-VERSION, DOMAIN, ISSUER, TRUST-REFERENCE, VALIDITY, APPLICABILITY, RULE-SET-REFERENCE, INPUT-SCHEMA, OUTPUT-SCHEMA, DEPENDENCIES, CHANGE-STATUS, INTEGRITY-REFERENCE, PROVENANCE)`

- **PROFILE-ID** is a stable identity that is not reused for an unrelated policy.
- **PROFILE-VERSION** is immutable once referenced by a decision. A changed rule set requires a new version.
- **DOMAIN** declares the bounded request classes for which the profile is designed.
- **ISSUER / TRUST-REFERENCE** identify the source and the configured way its authority to publish this profile is established.
- **VALIDITY** defines the effective interval and any review or expiry requirements.
- **APPLICABILITY** is an explicit typed predicate over named request/context fields.
- **RULE-SET-REFERENCE** identifies the rules actually evaluated, not a mutable human-readable label alone.
- **INPUT-SCHEMA / OUTPUT-SCHEMA** constrain which records the profile accepts and emits.
- **DEPENDENCIES** identify required profiles, schemas or policy services by stable versioned reference.
- **CHANGE-STATUS** records active, withdrawn, superseded, quarantined or otherwise configured lifecycle status.
- **INTEGRITY-REFERENCE / PROVENANCE** identify the available integrity and origin evidence; they do not impose one universal cryptographic scheme.

A **POLICY-BUNDLE** is `(BUNDLE-ID, BUNDLE-VERSION, DOMAIN, PROFILE-REFERENCES, COMPOSITION-PLAN-REFERENCE, VALIDITY, TRUST-REFERENCE, PROVENANCE)`. It is an explicit selection boundary, not an implicit collection of every policy discoverable in the environment.

A **COMPOSITION-PLAN** is `(PLAN-ID, PLAN-VERSION, DOMAIN, PROFILE-SELECTION, COMPOSITION-STRATEGY, PRECEDENCE-RELATION, OVERRIDE-PERMITTED-OUTCOMES, CONSTRAINT-MERGE-RULES, MISSING-PROFILE-POLICY, CONFLICT-POLICY, VALIDITY, TEST-SET-REFERENCE, PROVENANCE)`.

The plan must identify the strategy and all strategy-specific settings. An absent strategy, ambiguous setting, unknown required profile, or mutable unpinned plan is not interpreted as “use the simplest merge”.

A **COMPOSITION-RECORD** must retain the request ID, bundle and plan IDs/versions, every candidate profile and its applicability result, profile trust and freshness results, selected applicable profiles, each profile decision, the strategy used, conflict/override reasoning, the composed outcome, reason codes, evaluation time source/uncertainty where relevant, and evidence references. Privacy rules may redact raw values, but must preserve a protected reference or an explicit record of the limitation.

## 4. Profile identity, version pinning and lifecycle

1. A profile reference used for a decision names a stable profile ID and exact version or immutable content reference.
2. A floating reference such as “latest”, “current”, or a mutable branch is not sufficient for a reproducible decision unless the bundle contract resolves it to an immutable version before evaluation and records that resolution.
3. A changed rule set, applicability predicate, input/output schema, dependency, or composition-relevant metadata creates a new profile version.
4. A changed composition strategy, precedence relation, merge rule, missing-profile rule, or conflict rule creates a new plan version.
5. A new version does not silently rewrite historical decisions. Historical records retain the versions actually evaluated.
6. A withdrawn, quarantined, expired, or revoked profile is handled under the explicit lifecycle policy. It must not be silently treated as absent if its presence is relevant to a conflict or mandatory profile set.
7. A cached composition result is reusable only when the plan defines cache validity, context keys, policy-change propagation, revocation handling and maximum staleness. Otherwise recompute or block as unresolved.
8. Rollback to an earlier version must be an explicit, trusted lifecycle action with an audit record; “older” does not mean “safe”.

## 5. Profile selection and applicability

Profile selection must be reproducible from the pinned bundle and plan. Discovery is not policy: finding a profile in a registry does not make it applicable.

Applicability predicates use the typed value and predicate semantics of v1.6 and v1.7. A predicate that is TRUE makes the profile applicable; FALSE makes it inapplicable only under the profile's declared closed-world and evidence rules; UNKNOWN, ERROR or INVALID cannot be coerced to FALSE merely to omit a blocking policy. If the plan cannot safely determine whether a mandatory profile applies, the composition result is INDETERMINATE and blocks.

A plan may declare a **mandatory profile set**, an **allowed optional profile set**, and explicit applicability rules. If a mandatory profile is missing, untrusted, expired, unavailable, malformed or applicability-unknown, the plan must apply its declared blocking outcome; the default is to block. A profile may be optional only if that optionality is explicit and itself trusted.

A default profile is allowed only when the plan names it, pins its version, defines the requests for which it is the default, and records why it was selected. There is no implicit global default. An empty applicable set yields NO-APPLICABLE-PROFILE and blocks unless the plan explicitly defines a valid, bounded fallback profile; fallback selection must be recorded and may not be used to evade a failed mandatory profile.

## 6. Trust, validity and dependency graph

Before composing decisions, validate each required profile's issuer eligibility, integrity, provenance, validity interval, lifecycle status and required dependencies under the named trust contract. Authenticated origin alone does not prove that an issuer is authorised to publish the profile. A profile cannot grant its own issuer additional trust by assertion.

Dependencies are explicit, versioned and finite. Cycles in profile inheritance, dependency resolution or composition references are invalid unless a future version defines a bounded cycle semantics; v2.1 defines none. The dependency graph must be acyclic and have a configured finite traversal limit. Exceeding the limit is an evaluation error, not a partial successful merge.

If a required profile or dependency is unavailable, the result is PROFILE-UNAVAILABLE. If provenance or issuer eligibility cannot be trusted, the result is PROFILE-UNTRUSTED. If a required profile is stale or expired, the result is PROFILE-STALE or PROFILE-EXPIRED according to the configured evidence. These are diagnostic outcomes; the v2.0 authorisation gate remains blocked. A service timeout is not DENY, but neither is it permission.

## 7. Supported composition strategies

A composition plan selects exactly one strategy for each composition stage. A profile may not choose a strategy for itself unless the containing trusted plan explicitly delegates that choice and bounds the allowed values.

### 7.1 SINGLE-APPLICABLE

Exactly one profile must be applicable. Zero applicable profiles yields NO-APPLICABLE-PROFILE; more than one yields PROFILE-CONFLICT. This strategy does not select the first profile in a list.

### 7.2 ALL-MUST-PERMIT

Every applicable required profile must produce an admissible permit result for the same request scope. Any trusted, applicable explicit DENY produces a composed DENY. If there is no explicit DENY but any required result is conditional and its condition is not proven TRUE, or any required evidence is UNKNOWN, ERROR, stale or unavailable, the result is blocked and unresolved. Only when all required profiles produce current PERMIT results and all scopes/conditions are compatible may the composed result be PERMIT.

### 7.3 DENY-OVERRIDES

This strategy is permitted only when explicitly selected by a trusted, domain-scoped plan. Any trusted, applicable explicit DENY produces composed DENY and is recorded with its source profile. If there is no DENY, any non-permit, unavailable, untrusted, stale, conditional-unmet or unknown result blocks as unresolved; only all remaining applicable profiles permitting the same request can produce PERMIT. This rule does not allow an untrusted profile to manufacture a denial, nor does it allow an unknown profile to be skipped.

### 7.4 EXPLICIT-PRIORITY-DAG

The plan may define a finite, acyclic, explicit precedence relation among profile IDs and versions. It must also state exactly which lower-precedence outcomes a higher profile may supersede. The system must not infer precedence from issuer identity, policy age, profile name, file order, specificity-looking text, or external social rank.

If there is a unique maximal applicable profile and the plan explicitly permits it to supersede the relevant lower-profile outcomes, its decision may determine the composed result. If two or more incomparable maximal profiles disagree, the result is PROFILE-CONFLICT / INDETERMINATE. If a maximal profile is unable to decide, a lower profile may not silently fill the gap unless an explicit fallback relation says so. Every superseded result and the configured reason for supersession remain in the audit record.

The precedence graph must be acyclic. Cycles, missing nodes, duplicate edges with conflicting metadata, unversioned nodes, or an undefined override scope invalidate the plan. A total ordering is not required; a partial order is often safer because it preserves genuine incomparability.

### 7.5 CONSTRAINT-INTERSECTION

This strategy combines constraints, not authority grants. Each input must declare a compatible typed constraint schema and the plan must specify the intersection operation for every field. The result may narrow the allowed set or interval; it must not broaden a profile's limit. If types, units, coordinate frames, target domains, temporal intervals or field meanings are incompatible, return COMPOSITION-ERROR or INDETERMINATE rather than guessing a conversion.

An empty intersection is a conflict or unsatisfiable constraint set, not automatically an authority DENY. The authorisation decision remains blocked until a valid configured policy resolves the conflict. A successful intersection does not itself produce PERMIT; the resulting constraints must still be evaluated under the v2.0 decision contract.

### 7.6 NAMED-TESTED-RULESET

A plan may reference a domain-specific, versioned ruleset only if the ruleset has a declared input/output schema, deterministic or explicitly bounded behaviour, provenance, trust, resource limits, a versioned test suite including negative cases, and a documented failure mapping. Arbitrary code, unversioned scripts, hidden network calls, and undeclared side effects are outside this contract. A missing or failing ruleset blocks; its existence is not evidence that it is correct.

## 8. Conflict taxonomy and outcomes

The composition stage must preserve the difference between a valid explicit denial and an inability to decide.

- **COMPOSED-PERMIT:** the configured strategy produces PERMIT and all required profile, scope, condition, trust and freshness checks pass.
- **COMPOSED-DENY:** a trusted applicable explicit rule produces DENY under the configured strategy.
- **INDETERMINATE:** the result cannot be safely resolved, including incomparable conflicting policies, unknown applicability, or insufficient evidence.
- **PROFILE-CONFLICT:** incompatible decisions or constraints remain unresolved under the configured strategy.
- **NO-APPLICABLE-PROFILE:** no profile applies and no explicitly configured fallback applies.
- **PROFILE-UNAVAILABLE:** a required profile, dependency, or decision source cannot be obtained.
- **PROFILE-UNTRUSTED:** issuer, integrity, or provenance requirements fail.
- **PROFILE-STALE / PROFILE-EXPIRED:** a required profile or policy version is outside its permitted validity/freshness window.
- **COMPOSITION-ERROR:** the plan, schema, dependency graph, strategy configuration or evaluation process is malformed or fails its declared contract.

Only COMPOSED-PERMIT may be translated to a v2.0 PERMIT, and only after v2.0 scope, issuer, decision integrity, freshness, expiry, revocation, conditions and other required checks independently pass. COMPOSED-DENY maps to DENY. Unresolved composition outcomes map to a blocking v2.0 INDETERMINATE, ISSUER-UNTRUSTED or UNAVAILABLE outcome as supported by the actual failure. Do not map every failure to DENY or every diagnostic to the same opaque error.

## 9. Evaluation order and revalidation

For a given request, a conforming implementation of this design contract would:

1. Validate request and context schemas without inventing missing fields.
2. Resolve the exact bundle and composition-plan versions.
3. Validate plan trust, integrity, validity and configuration completeness.
4. Resolve every mandatory profile/dependency by stable ID and version.
5. Validate profile trust, integrity, lifecycle, validity and dependency graph.
6. Evaluate applicability using typed predicates and declared evidence policies.
7. Apply the one configured composition strategy and record every input/result.
8. Translate the composed result to the v2.0 authorisation outcome without replacing other gates.
9. At the execution boundary, revalidate decision/policy freshness, expiry, revocation and conditions as required by the v1.5 invocation contract and v2.0 decision contract.
10. Preserve the full decision trace under the domain's privacy and retention rules.

A definitive blocker may short-circuit permission, but the audit must record the stage reached and any diagnostics available without violating privacy. An implementation may not claim that it evaluated a stage it skipped. A policy change during evaluation invalidates the result if the plan's snapshot/consistency contract says the decision depended on the changed version; otherwise the exact snapshot and consistency guarantee must be recorded.

## 10. Audit, privacy and change control

At minimum, the composition audit contains:
- request, bundle, plan and profile stable IDs and immutable versions;
- the configured strategy and strategy-specific parameters;
- each profile's applicability outcome and evidence freshness/provenance;
- profile trust, lifecycle, expiry and dependency results;
- each profile decision and any condition results;
- precedence edges and override permissions actually used;
- constraint merge operations and resulting bounds where applicable;
- conflicts, unresolved inputs, short-circuit point and reason codes;
- mapping from composition result to the v2.0 authorisation outcome;
- time source/uncertainty and revalidation results when relevant;
- redaction/protected-reference metadata when privacy limits evidence retention.

A plan change requires a new plan version and regression fixtures. A profile change requires a new profile version. A trust-root, precedence, applicability, missing-profile or merge-rule change is composition-relevant and must not be treated as a cosmetic edit. Fixture success is not proof that a deployment's policy is lawful, fair, safe, physically feasible, or correctly configured.

## 11. Relationship to earlier layers

- v1.2 defines modern validation and external execution gate order.
- v1.5 defines invocation contracts and the distinction between authorisation, contract acceptance, attempted execution, observed outcome and verified postconditions.
- v1.6 supplies typed values and references; profile inputs and constraints must use compatible declared types.
- v1.7 supplies predicate truth, unknown/error propagation, temporal checks, freshness and provenance.
- v1.9 supplies resource accounting; budget success never overrides policy denial or unresolved authority.
- v2.0 supplies request/decision records, issuer trust, scope, delegation, expiry, revocation, consent separation and authorisation outcomes.
- v2.1 specifies only how explicitly configured policy profiles compose before the v2.0 gate. It does not define a universal hierarchy or replace any prior gate.

## 12. Specification fixtures

These fixtures define normative expected outcomes for this design contract. They are not executed policy-engine tests. “Block” means no authorisation is granted by this composition result; it does not necessarily mean an explicit DENY was issued.

| ID | Case | Expected outcome |
|---|---|---|
| POL21-01 | One trusted, current applicable profile under SINGLE-APPLICABLE returns PERMIT | COMPOSED-PERMIT |
| POL21-02 | No profile applies and no fallback is configured | NO-APPLICABLE-PROFILE; block |
| POL21-03 | Two profiles apply under SINGLE-APPLICABLE | PROFILE-CONFLICT; block |
| POL21-04 | A mandatory profile is absent from the pinned bundle | PROFILE-UNAVAILABLE; block |
| POL21-05 | A profile is discovered in a registry but is not referenced by the bundle | Ignore as non-member; do not silently include |
| POL21-06 | Applicability is UNKNOWN because required evidence is stale | INDETERMINATE; block |
| POL21-07 | Applicability is ERROR and the profile is mandatory | COMPOSITION-ERROR or INDETERMINATE; block |
| POL21-08 | Applicability is FALSE under a declared closed-world rule and profile is optional | Profile is inapplicable; record evidence |
| POL21-09 | Applicability is FALSE but evidence completeness is not established | UNKNOWN/INDETERMINATE; block if profile could be mandatory |
| POL21-10 | A default profile is named, version-pinned and its bounded fallback predicate matches | Select configured fallback; record reason |
| POL21-11 | A profile is chosen as “default” only because it is first in a list | Reject implicit default; block |
| POL21-12 | Bundle uses mutable “latest” without immutable resolution | COMPOSITION-ERROR; block |
| POL21-13 | Resolved immutable profile version is recorded before evaluation | Continue with pinned version |
| POL21-14 | Profile rule set changes but retains the same supposedly immutable version | PROFILE-UNTRUSTED or COMPOSITION-ERROR; block |
| POL21-15 | A profile is expired under its own validity contract | PROFILE-EXPIRED; block |
| POL21-16 | A profile is withdrawn and lifecycle policy says it remains mandatory for this request class | Block; do not silently omit |
| POL21-17 | Required profile issuer is authenticated but not trusted to publish this profile class | PROFILE-UNTRUSTED; block |
| POL21-18 | Required profile integrity evidence fails | PROFILE-UNTRUSTED or COMPOSITION-ERROR; block |
| POL21-19 | Required dependency cannot be fetched | PROFILE-UNAVAILABLE; block |
| POL21-20 | Profile dependency graph contains a cycle | COMPOSITION-ERROR; block |
| POL21-21 | Dependency traversal exceeds configured finite limit | COMPOSITION-ERROR; block |
| POL21-22 | ALL-MUST-PERMIT receives PERMIT from every required applicable profile | COMPOSED-PERMIT if scopes and conditions agree |
| POL21-23 | ALL-MUST-PERMIT receives one trusted explicit DENY | COMPOSED-DENY; preserve denying profile |
| POL21-24 | ALL-MUST-PERMIT receives PERMIT plus an unresolved required profile | INDETERMINATE; block |
| POL21-25 | ALL-MUST-PERMIT receives CONDITIONAL-PERMIT whose condition is UNKNOWN | INDETERMINATE; block |
| POL21-26 | DENY-OVERRIDES is not explicitly selected by the trusted plan | Reject strategy configuration; block |
| POL21-27 | DENY-OVERRIDES has a trusted applicable DENY and other profiles PERMIT | COMPOSED-DENY; preserve all profile outcomes |
| POL21-28 | DENY-OVERRIDES has no DENY but one profile is unavailable | PROFILE-UNAVAILABLE; block |
| POL21-29 | An untrusted profile attempts to inject a DENY into the composition | PROFILE-UNTRUSTED; do not treat it as a valid denial |
| POL21-30 | An UNKNOWN profile is skipped so DENY-OVERRIDES can produce PERMIT | Reject; INDETERMINATE and block |
| POL21-31 | Priority DAG has a unique maximal profile and explicitly permits its relevant override | Apply configured precedence; audit superseded outcomes |
| POL21-32 | Priority DAG has two incomparable maximal profiles with different outcomes | PROFILE-CONFLICT / INDETERMINATE; block |
| POL21-33 | Priority is inferred from profile name or issuer prestige | Reject inferred precedence; block |
| POL21-34 | Priority graph contains a cycle | COMPOSITION-ERROR; block |
| POL21-35 | Higher-priority profile has no explicit permission to override a lower-profile DENY | PROFILE-CONFLICT / INDETERMINATE; block |
| POL21-36 | Higher-priority profile explicitly overrides a permitted lower-profile outcome class | Apply only that configured override; retain audit |
| POL21-37 | Priority edge references an unpinned profile version | COMPOSITION-ERROR; block |
| POL21-38 | A lower profile is used as fallback after a higher profile is UNKNOWN, with no explicit fallback rule | INDETERMINATE; block |
| POL21-39 | CONSTRAINT-INTERSECTION combines compatible same-dimension upper bounds | Return intersection; do not produce PERMIT by itself |
| POL21-40 | Constraint intersection would broaden a source profile's allowed range | Reject widening; COMPOSITION-ERROR |
| POL21-41 | Constraint units are incompatible and no conversion contract is pinned | COMPOSITION-ERROR / INDETERMINATE; block |
| POL21-42 | Constraint target domains do not overlap | Empty intersection; PROFILE-CONFLICT; block |
| POL21-43 | Constraint intervals are compatible and intersection narrows the allowed interval | Return narrowed interval with source provenance |
| POL21-44 | Constraint merge encounters UNKNOWN input | Preserve UNKNOWN; block if required |
| POL21-45 | Constraint merge is mistaken for an authorisation grant | Reject substitution; v2.0 gate still required |
| POL21-46 | NAMED-TESTED-RULESET has no pinned version | COMPOSITION-ERROR; block |
| POL21-47 | Named ruleset lacks required negative fixtures or declared failure mapping | Reject ruleset as incomplete; block |
| POL21-48 | Named ruleset invokes undeclared network side effects | Outside contract; block |
| POL21-49 | Named ruleset fails or exceeds its declared resource limit | COMPOSITION-ERROR or PROFILE-UNAVAILABLE; block |
| POL21-50 | Named ruleset passes fixtures but the active profile issuer is untrusted | PROFILE-UNTRUSTED; block |
| POL21-51 | Profile versions disagree because one was silently replaced during evaluation | Invalidate result; re-evaluate pinned snapshot or block |
| POL21-52 | A cached composition result exceeds configured freshness or revocation limits | PROFILE-STALE; block/re-evaluate |
| POL21-53 | Policy changes during evaluation and snapshot contract requires consistency | Invalidate result; re-evaluate exact pinned versions |
| POL21-54 | Two profiles return conflicting constraints and no merge rule covers that field | PROFILE-CONFLICT; block |
| POL21-55 | A profile says PERMIT for a different action than the request | Scope mismatch; no composed permit |
| POL21-56 | Composed PERMIT is current, but v2.0 revocation state is UNKNOWN | INDETERMINATE; block |
| POL21-57 | Composed PERMIT is valid but a separately required consent gate is absent | Block; consent remains independent |
| POL21-58 | Composed PERMIT is valid but the resource budget fails | Block; resource gate remains independent |
| POL21-59 | Composition is blocked and diagnostics are privacy-sensitive | Redact/protect raw evidence; preserve reason and limitation |
| POL21-60 | All composition checks pass but the executor has not run | COMPOSED-PERMIT; execution remains NOT-EXECUTED |

## 13. Explicitly unresolved

Version 2.1 does not define a universal authority hierarchy, legal or ethical policy, global identity system, universal trust-root format, cryptographic signature protocol, distributed policy registry, universal conflict policy, arbitrary policy programming language, or executable policy service. It does not prescribe which policy should prevail in a real institution or society. The domain owner must choose and justify the applicable strategy and governance rules.

No spoken Arcane syntax for policy profiles or policy composition is established. The schema is a modern abstract contract. It must not be represented as historical Arcane grammar or as a working permission engine.

**Change policy:** This bounded policy-composition design is locked. A later change must version the affected profile/plan semantics, preserve stable fixture identities, include negative cases, state its trust and freshness assumptions, and show that no composition outcome bypasses v2.0 scope, authority, consent, resource, feasibility, or execution gates.
