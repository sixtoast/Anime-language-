# v1.9 time-scoped account reconciliation — implementation boundary

**Status:** bounded engineering implementation; not a canon amendment  
**Source:** [Arcane Incantations v1.9 — Resource Accounting and Conservation Contracts](../canon/arcane-incantations-v1.9-resource-accounting-and-conservation-contracts.md), especially §§2.2, 4 and 7.

## Canon anchors

The v1.9 account and ledger models include valid-time fields. A conservation contract defines a system boundary and valid interval. Section 7 explicitly leaves time windows, expiry, ordering and reconciliation latency to the relevant contract rather than establishing universal assumptions.

## Implemented subset

The account-balance reconciler now requires:

- every account opening balance used by the projection to carry an `openingBalanceAsOf` timestamp equal to the conservation interval start;
- every ledger event to carry a valid `validTime`;
- event timestamps to be strictly after the opening snapshot, strictly before the measurement observation, and strictly increasing in the supplied event order;
- the measurement observation to fall strictly inside the contract interval.

The reconciler does not sort events or silently discard events outside the as-of window. Missing timestamps, mismatched opening snapshots, boundary-equal timestamps, future events and out-of-order or same-time events remain unresolved. The generic ledger projector remains usable without temporal metadata, but the bounded reconciliation input type requires it.

The event valid time is included in the idempotency fingerprint. Reusing a key with different event time is therefore a content collision, not an identical retry.

## Explicit limitations

- Strict interior timestamps are a conservative supported subset, not a claim that the canon defines open interval endpoints.
- The caller must supply a complete event batch since the opening snapshot. Completeness, timestamp provenance and snapshot authenticity are not verified.
- Same-time event ordering, boundary inclusion, distributed consistency and reconciliation latency still require explicit domain contracts.
- Only one selected account's gross balance is compared. Reservations remain held stock, not consumption.
- No ledger entry or balance is mutated; no event is sorted, filtered or repaired.
- This does not complete the v1.9 `RESOURCE-RECONCILED` stage and does not establish physical conservation, conversion, authority, execution or effect.

## Regression coverage

- `RES19-RECON-013` — opening snapshot scope.
- `RES19-RECON-014` — missing, boundary-equal and future event times.
- `RES19-RECON-015` — chronological ordering and same-time ambiguity.
- `RES19-RECON-016` — observation boundary ambiguity.
- `RES19-LEDGER-023` — event valid time participates in idempotency content.

The v1.9 canonical fixture table and its 60 expected outcomes are unchanged.
