# Arcane Incantations v2.0 — Authority and Authorisation Decision Contracts

**Status:** LOCKED DESIGN CANON for the bounded modern incantation metalanguage  
**Layer:** Modern decision-record contract; not a reconstruction of historical spoken syntax  
**Depends on:** Incantations v1.0–v1.9, especially preconditions/failure semantics (v1.2), invocation profiles/execution contracts (v1.5), typed values (v1.6), predicates and temporal checks (v1.7), and resource-accounting contracts (v1.9)  
**Validation status:** 60 specification fixtures defined below. They test this document's expected decision semantics; they do not establish a runtime, real-world legal compliance, physical feasibility, or actual spell execution.  
**Source-vocabulary effect:** None. No spoken tokens, historical meanings, universal authority hierarchy, or signatures for KREN, TRAK, FREM, SHREN, BRAN, or VARE are introduced.

## 1. Purpose and boundary

A request may be syntactically well formed, semantically typed, feasible according to a declared model, within budget, and still not be authorised. Conversely, an authorisation decision does not make a malformed request valid, supply a missing mechanism, prove consent, establish ownership, or make an infeasible action possible.

Version 2.0 defines a typed, auditable contract for deciding whether a specific actor or execution principal is permitted to perform a specific action against a specific target within a bounded scope and validity interval. It formalises the decision record and its lifecycle without selecting a universal authority hierarchy or replacing the environment's actual governance.

This is a modern specification layer. It is not a claim about historical Arcane grammar and does not add spoken words. Uppercase field names and enumerations in this document are metalanguage labels, not incantation tokens.

## 2. Non-substitution principles

These checks are distinct and cannot substitute for one another:

1. **Well-formedness:** the request and decision records satisfy their schemas.
2. **Semantic validation:** types, references, preconditions, constraints, and operation contracts are valid.
3. **Mechanism and feasibility:** a supported mechanism and relevant feasibility evidence exist.
4. **Resource readiness:** declared budgets, reservations, accounts, and conservation contracts pass.
5. **Authorisation:** a recognised authority explicitly permits this action for this subject, target, scope, and time.
6. **Consent:** where applicable, the required consent has been separately established and remains valid.
7. **Execution:** an executor actually performed the authorised operation and reported what happened.

Passing one stage never implies that a later stage passes. In particular:
- a technically valid request is not permission;
- ownership or target resolution is not permission;
- a living-coupling category is not consent;
- a consent record is not a general-purpose authorisation token;
- a request's urgency is not an authority grant;
- a missing or unavailable decision is not approval;
- a valid authorisation is not proof of execution or success.

## 3. Authorisation request record

An authorisation request is a typed record with these required fields:

- **REQUEST-ID:** stable identifier for this decision attempt.
- **SUBJECT:** the actor or execution principal that would perform the action. This is not automatically the person who composed or submitted the request.
- **ACTION:** a specific operation or bounded action class. Broad verbs such as “do anything needed” are not an acceptable scope.
- **TARGET:** the resolved target reference or an explicitly bounded target set.
- **SCOPE:** the permitted extent, including relevant object, spatial, resource, temporal, and effect boundaries.
- **REQUESTED-INTERVAL:** the time interval during which permission is requested.
- **CONTEXT:** typed facts and references required by the applicable policy.
- **POLICY-REFERENCE:** an identifiable policy or authority contract used for the decision.
- **REQUEST-PROVENANCE:** origin and integrity metadata sufficient for the deployment's trust model.

Missing required fields yield **MALFORMED-REQUEST** or **INSUFFICIENT-CONTEXT**; the evaluator must not fill them from convenient guesses.

## 4. Decision record

A decision record contains:

- **DECISION-ID** and **REQUEST-ID**;
- **AUTHORITY-ID** and the identity/provenance of the decision issuer;
- **SUBJECT**, **ACTION**, **TARGET**, and **SCOPE** copied from or explicitly constrained against the request;
- **DECISION**;
- **VALID-FROM** and **VALID-UNTIL** or a policy-defined validity rule;
- **CONDITIONS** and their evaluation times, if any;
- **EVIDENCE-REFERENCES** and provenance;
- **POLICY-REFERENCE** and policy version;
- **DELEGATION-CHAIN**, if delegated authority is used;
- **REVOCATION-REFERENCE/STATUS** and last-checked time where supported;
- **ISSUED-AT**, decision freshness, and integrity status;
- **REASON-CODES** sufficient to distinguish denial, uncertainty, expiry, scope mismatch, and infrastructure failure.

A decision record is not valid merely because it has all fields: identity, authority, policy, evidence, freshness, and integrity must also be evaluated under the configured trust contract.

## 5. Decision outcomes

Use the following bounded outcome set:

- **PERMIT:** an explicit, current decision permits the exact requested scope, subject, action, and target.
- **DENY:** an applicable authority explicitly refuses the request.
- **CONDITIONAL-PERMIT:** permission is valid only while every named condition is satisfied at its required check time.
- **INDETERMINATE:** available evidence cannot establish permit or deny.
- **UNAVAILABLE:** the required authority or decision service cannot be reached or has not supplied a decision.
- **EXPIRED:** the decision's validity interval has ended.
- **REVOKED:** the decision is known to have been withdrawn.
- **SCOPE-MISMATCH:** the proposed operation exceeds or differs from the authorised scope.
- **ISSUER-UNTRUSTED:** issuer identity or authority chain cannot be validated.
- **MALFORMED-DECISION:** the decision record violates its schema or internal consistency rules.

Only PERMIT, or CONDITIONAL-PERMIT with all required conditions currently satisfied, may satisfy the authorisation gate. All other outcomes block the guarded action. A deployment may report additional diagnostic detail, but must not collapse non-permit outcomes into approval.

## 6. Scope matching

Authorisation matching is explicit and conservative:

- Subject must match the named subject or a permitted, validated subject class.
- Action must match the authorised action or a narrower action explicitly permitted by policy. Similar wording is not sufficient.
- Target must match the target or target set. A nearby, related, substituted, or newly resolved target is not automatically included.
- Requested spatial, temporal, resource, and effect scope must be contained within the authorised scope under typed comparison rules.
- A narrower request may fit a broader grant only when the policy defines that relation and the grant itself remains current.
- Unknown scope relations are not treated as containment.
- A decision cannot widen its own scope by referencing an untrusted record or by recursively inheriting undefined defaults.

Scope comparison must use typed values and the declared comparison semantics. Textual similarity is not a scope proof.

## 7. Issuer trust and authority chains

The environment must define how an AUTHORITY-ID is recognised and what makes an issuer eligible to decide this request class. This specification does not prescribe a universal ranking among people, institutions, policies, guardians, owners, system operators, or automated services.

The trust contract must identify:
- trusted issuer roots or an equivalent configured trust source;
- allowed decision classes and scope for each issuer;
- issuer identity validation and evidence provenance;
- the policy version and decision rules applied;
- whether the issuer can delegate this decision class;
- how issuer compromise, trust-root change, and key/identity rotation are handled.

If trust cannot be established, the outcome is not PERMIT. A valid signature or authenticated channel can support record integrity or origin, but does not alone prove that the issuer has authority over the requested action.

## 8. Delegation

Delegation is a bounded grant of decision authority, not an unrestricted transfer of all powers.

Every delegation record must identify delegator, delegate, allowed decision class, action and target scope, validity interval, conditions, further-delegation policy, source decision, provenance, and revocation state. The delegate may not grant more scope, longer validity, weaker conditions, or broader action classes than the validated delegation permits.

If any link in the chain is missing, expired, revoked, out of scope, or untrusted, the delegated permit is invalid. Further delegation is denied unless explicitly allowed by the applicable policy and bounded by the original grant. Cycles in the delegation graph are invalid. The maximum accepted chain length and cycle-detection strategy belong to the deployment contract and must be finite and testable.

## 9. Expiry, revocation and freshness

A permit must be checked against its validity interval and any freshness requirements immediately before the guarded action starts. Long-running or high-impact actions may require revalidation during execution or at named checkpoints.

- **Expiry** is derived from the decision's declared validity rule and trusted time source.
- **Revocation** invalidates the grant from the effective revocation point defined by the policy.
- **Staleness** means the system cannot show that the decision is current enough for this action.
- **Unknown revocation state** is not the same as “not revoked”.
- **Clock uncertainty** must be included when it could change the validity result. If the time interval straddles an expiry boundary and policy cannot resolve it safely, the decision is indeterminate.
- A cached permit may be reused only if the policy explicitly defines cache lifetime, revocation propagation limits, and the risk of stale state.

A request that was authorised when composed may be unauthorised when execution is attempted. Composition time is not execution time.

## 10. Conditional permission and ongoing checks

Each condition must be a typed predicate with evidence provenance and an explicit check time, reusing the v1.7 predicate model. A condition must not be silently interpreted as true when it is unknown, unavailable, stale, invalid, or erroneous.

Conditional-permit evaluation follows these rules:
1. All mandatory conditions are evaluated at their declared check times.
2. A false condition blocks the action.
3. An unknown, stale, unavailable, invalid, or error result blocks the action unless the applicable policy explicitly defines a safe alternative that does not weaken the authorisation.
4. Conditions marked THROUGHOUT or AT-CHECK must be monitored or re-evaluated by a supported execution contract; a declaration alone does not provide monitoring.
5. If a condition ceases to hold during execution, apply the declared v1.2 failure policy and v1.5 interruption contract. Do not assume instantaneous stop, rollback, or containment.
6. A condition cannot broaden the grant that contains it.

## 11. Consent, privacy, safety and other independent gates

Authorisation answers only the question represented by its authority contract. It does not by itself answer every moral, legal, privacy, safety, ownership, or consent question.

Where a living subject, private information, protected area, controlled resource, or other protected interest is involved, the invocation profile must name the additional required gates. Their schemas and policies may differ by environment. A missing gate is not a pass. Consent must be specific to its subject, action, target, scope, and time where those dimensions apply; consent to one action must not be stretched into consent to another.

The design intentionally does not establish a universal policy hierarchy or decide every possible conflict among authorities. A deployment must define conflict resolution for its domain before it can claim the relevant authorisation contract is complete. If applicable authorities conflict and no valid precedence rule resolves the conflict, return **INDETERMINATE** and block.

## 12. Evaluation order and failure behaviour

The following is a conservative decision procedure, not a claim that the website or language runtime currently executes it:

1. Validate request and decision schemas.
2. Resolve subject and target identities without substituting guessed entities.
3. Validate issuer trust and policy provenance.
4. Validate delegation chain, if any.
5. Validate decision integrity, freshness, expiry, and revocation state.
6. Compare subject, action, target, and full scope.
7. Evaluate all required conditions and independent gates.
8. Return the decision result with reason codes and evidence references.
9. At execution start, re-check time-sensitive and revocation-sensitive fields under the execution contract.
10. Record the result and any later revalidation or interruption separately.

A stage may short-circuit on a definitive blocker. The record must retain enough diagnostics to explain which gate blocked the request without disclosing information the deployment's privacy policy forbids. A service error is not a DENY from the authority; it is UNAVAILABLE, but it still blocks execution.

## 13. Audit, privacy and evidence

Audit records must distinguish the requester's claims, authority-issued decisions, verifier observations, policy configuration, and executor-reported outcomes. Each field must identify its source and relevant time. Derived conclusions must not be stored as if they were original evidence.

The environment must define audit integrity, retention, access control, minimisation, and redaction. More logging is not automatically safer: sensitive personal or target data should not be copied into broad logs when stable references and protected evidence pointers suffice. A privacy restriction must not be bypassed merely to make the decision record easier to inspect.

At minimum, a decision audit records the stable IDs, outcome, reason codes, policy version, issuer trust result, scope comparison result, condition outcomes, freshness/revocation checks, time source/uncertainty where relevant, and evidence references. The record must also state when required evidence could not be retained or verified.

## 14. Relationship to prior incantation layers

- v1.0 supplies the operation/target/role/constraint design boundary.
- v1.1 supplies target resolution and binding concepts; resolution is not permission.
- v1.2 supplies preconditions, constraints and failure semantics.
- v1.3 separates desired effect, transition, mechanism and causation.
- v1.4 supplies plan composition, sequencing and transactional-plan vocabulary.
- v1.5 defines invocation profiles, execution contracts and the external authority boundary.
- v1.6 supplies typed values, references, options, results, quantities and measurements.
- v1.7 supplies typed predicates, evidence freshness and temporal checks.
- v1.8 supplies spatial frames and region semantics.
- v1.9 supplies resource accounting, budgets, reservations and conservation contracts.

v2.0 joins these layers at the authorisation decision boundary. It does not replace any earlier check and does not grant a runtime the capability to enforce a rule that it has not implemented.

## 15. Specification fixtures

These fixtures define expected outcomes for this contract. They are not evidence of an implemented authority service, legal validity, physical feasibility, or execution. “Block” means the authorisation gate must not permit the guarded action.

| ID | Case | Expected outcome |
|---|---|---|
| AUTH20-01 | Complete request, trusted issuer, exact current permit, scope matches | PERMIT |
| AUTH20-02 | Request omits SUBJECT | MALFORMED-REQUEST; block |
| AUTH20-03 | Request omits ACTION | MALFORMED-REQUEST; block |
| AUTH20-04 | Request omits TARGET | MALFORMED-REQUEST; block |
| AUTH20-05 | Request has no bounded SCOPE | INSUFFICIENT-CONTEXT; block |
| AUTH20-06 | No decision record is supplied | UNAVAILABLE; block |
| AUTH20-07 | Authority explicitly denies the exact request | DENY; block |
| AUTH20-08 | Decision outcome field is not in the defined set | MALFORMED-DECISION; block |
| AUTH20-09 | Issuer identity cannot be validated | ISSUER-UNTRUSTED; block |
| AUTH20-10 | Authenticated issuer has no configured authority for this action class | ISSUER-UNTRUSTED; block |
| AUTH20-11 | Permit subject differs from the execution subject | SCOPE-MISMATCH; block |
| AUTH20-12 | Permit action is similar in wording but not covered by policy | SCOPE-MISMATCH; block |
| AUTH20-13 | Permit target is adjacent to, but not identical with, requested target | SCOPE-MISMATCH; block |
| AUTH20-14 | Requested region is not proven contained by the permitted region | INDETERMINATE or SCOPE-MISMATCH; block |
| AUTH20-15 | Requested resource ceiling exceeds grant | SCOPE-MISMATCH; block |
| AUTH20-16 | Requested validity interval extends beyond the grant | SCOPE-MISMATCH; block |
| AUTH20-17 | Narrower request fits an explicitly defined grant containment rule | PERMIT if all other checks pass |
| AUTH20-18 | Scope containment relies only on textual similarity | INDETERMINATE; block |
| AUTH20-19 | Permit has expired | EXPIRED; block |
| AUTH20-20 | Trusted revocation evidence shows permit revoked | REVOKED; block |
| AUTH20-21 | Revocation service unavailable where policy requires a current check | UNAVAILABLE; block |
| AUTH20-22 | Revocation status is unknown but treated by caller as “not revoked” | Reject that inference; INDETERMINATE; block |
| AUTH20-23 | Decision is stale under the configured freshness limit | INDETERMINATE; block |
| AUTH20-24 | Trusted time uncertainty straddles the expiry boundary | INDETERMINATE; block |
| AUTH20-25 | Cache entry exceeds policy-defined maximum age | INDETERMINATE; block |
| AUTH20-26 | Cache is used with no defined revocation propagation limit | INDETERMINATE; block |
| AUTH20-27 | Conditional permit has every mandatory condition true at required check time | CONDITIONAL-PERMIT may pass the gate |
| AUTH20-28 | One mandatory condition is false | Block |
| AUTH20-29 | One mandatory condition is unknown | Block unless a separately specified safe alternative applies |
| AUTH20-30 | Condition result is stale | Block |
| AUTH20-31 | Condition evaluation returns ERROR | Block |
| AUTH20-32 | Condition says THROUGHOUT but no monitoring capability exists | Block or report contract incomplete; never claim enforcement |
| AUTH20-33 | Condition becomes false during execution | Trigger declared v1.2/v1.5 failure and interruption behaviour |
| AUTH20-34 | Condition attempts to widen action scope | Reject condition/grant combination; block |
| AUTH20-35 | Delegation record omits delegator | Invalid delegation; block |
| AUTH20-36 | Delegate is not the named delegate or a policy-approved class | Invalid delegation; block |
| AUTH20-37 | Delegated action scope exceeds the parent grant | Invalid delegation; block |
| AUTH20-38 | Delegated validity outlasts the parent grant | Invalid delegation; block |
| AUTH20-39 | Parent grant is revoked | Descendant delegated grant cannot authorise |
| AUTH20-40 | Delegation chain contains a cycle | Invalid delegation; block |
| AUTH20-41 | Further delegation is attempted but not explicitly permitted | Invalid delegation; block |
| AUTH20-42 | Further delegation is explicitly permitted and remains within every parent bound | May continue if all chain checks pass |
| AUTH20-43 | Delegation chain exceeds configured finite maximum length | Invalid delegation; block |
| AUTH20-44 | A chain link has an untrusted issuer | Invalid delegation; block |
| AUTH20-45 | Target resolution succeeds but no authorisation exists | UNAVAILABLE; block |
| AUTH20-46 | Resource budget passes but authority decision is denied | DENY; resource success does not override it |
| AUTH20-47 | Authorisation passes but mechanism feasibility fails | Feasibility failure still blocks execution |
| AUTH20-48 | Authorisation passes but required consent gate is absent | Block |
| AUTH20-49 | Consent exists for a different action | Consent does not satisfy this request's gate |
| AUTH20-50 | Living-coupling category is used as a substitute for consent | Reject substitution; block |
| AUTH20-51 | Two applicable authorities conflict and no precedence policy exists | INDETERMINATE; block |
| AUTH20-52 | Policy version referenced by decision cannot be retrieved or trusted | INDETERMINATE or ISSUER-UNTRUSTED; block |
| AUTH20-53 | Signature/integrity is valid but issuer has no relevant authority | ISSUER-UNTRUSTED; block |
| AUTH20-54 | Authority service times out | UNAVAILABLE; block; do not relabel as DENY or PERMIT |
| AUTH20-55 | Decision is valid at composition time but expired before execution start | EXPIRED at execution gate; block |
| AUTH20-56 | Permit is revalidated at execution start and remains current/in-scope | Authorisation gate passes; other gates remain separate |
| AUTH20-57 | Audit field is copied from requester input but presented as authority-issued evidence | Audit provenance defect; reject record |
| AUTH20-58 | Privacy policy forbids retaining a sensitive raw value | Store permitted protected reference/redaction and record limitation |
| AUTH20-59 | Audit record omits policy version or decision issuer | Incomplete audit record; no claim of full decision traceability |
| AUTH20-60 | Every authority check passes but executor has not run | Authorisation passed; execution remains NOT-EXECUTED |

## 16. Explicitly unresolved

This version does not define a universal authority hierarchy, legal or ethical policy, global consent schema, universal identity system, cryptographic signature protocol, trusted clock, revocation distribution system, policy language, privacy regime, or executable authorisation service. It does not resolve every possible conflict between authorities. Those decisions require domain-specific governance, source evidence, and independently tested implementations.

No spoken Arcane syntax for authority decisions is established. The schema here is an abstract modern contract; it must not be presented as a historically attested incantation or as a working runtime feature.

**Change policy:** The bounded authority-decision contract is locked. New authority classes, delegation modes, condition types, or decision outcomes must define their trust model, scope semantics, time/freshness behaviour, revocation rules, provenance and privacy requirements, interactions with existing gates, and negative fixtures. Never infer permission from absence of denial, target resolution, technical feasibility, resource sufficiency, or the mere presence of a syntactically valid request.
