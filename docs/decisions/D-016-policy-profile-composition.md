# D-016 — Policy-profile composition and conflict resolution

**Status:** Accepted; locked modern design canon  
**Date:** 2026-10-18  
**Decision:** Arcane Incantations v2.1 defines bounded policy-profile composition and conflict-resolution contracts.

## Question

How should multiple domain-scoped policy profiles be selected and combined before a v2.0 authority-decision record is allowed to satisfy the authorisation gate, without inventing a universal authority hierarchy?

## Decision

Use explicit, immutable, version-pinned policy bundles and composition plans. A plan must define profile applicability, trust and lifecycle handling, one supported composition strategy, any precedence relation and override permissions, missing-profile behaviour, conflict handling, and audit provenance. Supported strategies are SINGLE-APPLICABLE, ALL-MUST-PERMIT, DENY-OVERRIDES, EXPLICIT-PRIORITY-DAG, CONSTRAINT-INTERSECTION, and NAMED-TESTED-RULESET.

Unknown applicability, required-profile absence, untrusted or stale profiles, malformed plans, dependency cycles, incompatible constraints, or unresolved conflicts block. Unresolved conflict remains INDETERMINATE rather than being mislabeled as an explicit DENY. A configured trusted rule may produce DENY; a composition result may become v2.0 PERMIT only when every independent v2.0 authorisation check still passes.

## Options considered

1. **Implicit hierarchy based on issuer prestige, recency, naming, or list order — rejected.** It invents governance and makes results non-reproducible.
2. **Merge all rules automatically — rejected.** Different policies may have incompatible scopes, types, or semantics; an automatic union can broaden permission.
3. **Explicit version-pinned composition plan — accepted.** It makes the governing rule reproducible, auditable and testable while leaving real-world policy choice to the domain owner.
4. **Treat every conflict as explicit DENY — rejected as a semantic collapse.** A conflict blocks permission, but it does not prove that an authorised issuer explicitly denied the request.

## Evidence and consequences

- [Arcane Incantations v2.0 §16](../canon/arcane-incantations-v2.0-authority-and-authorization-decision-contracts.md) explicitly leaves policy language and universal conflict resolution unresolved.
- [Arcane Incantations v2.1](../canon/arcane-incantations-v2.1-policy-profile-composition-and-conflict-resolution.md) defines 60 POL21 design fixtures.
- v1.6 typing, v1.7 evidence/freshness, v1.9 resource contracts and v2.0 authorisation records remain independent dependencies.
- No spoken tokens, historical signatures, legal rules, identity system, universal authority hierarchy, or executable policy service are added.
- The next website feature exposes the specification fixtures as source records, not executed policy outcomes.
- Executable validation remains deferred until a named domain, trusted profiles, and an independently tested policy engine are available.
