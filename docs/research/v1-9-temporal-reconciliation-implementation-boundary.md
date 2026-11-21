# v1.9 precision-preserving temporal evaluation and reconciliation — implementation boundary

**Status:** bounded engineering implementation; not a canon amendment  
**Source:** [Arcane Incantations v1.9 — Resource Accounting and Conservation Contracts](../canon/arcane-incantations-v1.9-resource-accounting-and-conservation-contracts.md), especially §§2.2, 4 and 7.

## Canon anchors

The v1.9 account and ledger models include valid-time fields. A conservation contract defines a system boundary and valid interval. Section 7 explicitly leaves time windows, expiry, ordering and reconciliation latency to the relevant contract rather than establishing universal assumptions.

## Implemented subset

The resource preflight and account-balance reconciler use a shared ISO-instant parser/comparator. Its accepted implementation profile is `YYYY-MM-DDTHH:mm:ss[.fraction](Z|±HH:MM)`, with a valid four-digit Gregorian calendar date, 24-hour clock fields and one to nine fractional digits. This profile is an implementation boundary for the current evaluator, not a timestamp rule added to v1.9 canon. The preflight accepts only strict interior availability-window times, reports outside-window evidence as stale and leaves exact endpoints unresolved. The account-balance reconciler requires:

- every account opening balance used by the projection to carry an `openingBalanceAsOf` timestamp equal to the conservation interval start;
- every ledger event to carry a valid `validTime`;
- ISO instants are compared without discarding up to nine fractional-second digits; explicit timezone offsets are resolved to the same represented instant, so distinct sub-millisecond times remain ordered while equivalent representations remain equal across preflight, conservation and reconciliation;
- event timestamps to be strictly after the opening snapshot, strictly before the measurement observation, and strictly increasing in the supplied event order;
- the measurement observation to fall strictly inside the contract interval.

The reconciler does not sort events or silently discard events outside the as-of window. Missing timestamps, mismatched opening snapshots, boundary-equal timestamps, future events and out-of-order or same-time events remain unresolved. The generic ledger projector remains usable without temporal metadata, but the bounded reconciliation input type requires it.

The event valid time is included in the idempotency fingerprint. Reusing a key with different event time is therefore a content collision, not an identical retry.

## Event-batch completeness assertion

The reconciler requires `eventBatchEvidence` containing the conservation contract ID, system boundary, exact projected account-ID set, opening snapshot time, observation time, a completeness evidence state and an evidence reference. The account-ID set must match every projected account exactly once. The time and contract fields must match the reconciliation input exactly.

A PASS state permits the bounded account comparison to continue; FAIL, UNKNOWN or UNAVAILABLE remains unresolved. A missing reference or mismatched scope is an invalid reconciliation record. An empty event list is not silently treated as a complete batch: it needs the same explicit assertion.

This is an engineering input boundary, not a new canonical v1.9 record field or proof of completeness. The assertion and its reference are caller-supplied and unauthenticated. The implementation does not inspect an external event source, authenticate provenance, or independently establish that no event was omitted.

## Explicit limitations

- Strict interior timestamps are a conservative supported subset, not a claim that the canon defines open interval endpoints.
- Fractional timestamp precision is preserved up to the validator's existing nine-digit input limit; this does not authenticate timestamp provenance, clock accuracy or event-source completeness.
- A caller-supplied event-batch completeness assertion must match the contract, system boundary, exact projected account set, opening snapshot and observation time; the assertion, event source and timestamps remain unauthenticated.
- Same-time event ordering, boundary inclusion, distributed consistency and reconciliation latency still require explicit domain contracts.
- Only one selected account's gross balance is compared. Reservations remain held stock, not consumption.
- No ledger entry or balance is mutated; no event is sorted, filtered or repaired.
- This does not complete the v1.9 `RESOURCE-RECONCILED` stage and does not establish physical conservation, conversion, authority, execution or effect.

## Regression coverage

- `RES19-RECON-013` — opening snapshot scope.
- `RES19-RECON-014` — missing, boundary-equal and future event times.
- `RES19-RECON-015` — chronological ordering and same-time ambiguity.
- `RES19-RECON-016` — observation boundary ambiguity.
- `RES19-RECON-017` — explicit event-batch completeness assertion.
- `RES19-RECON-018` — incomplete and unresolved batch evidence.
- `RES19-RECON-019` — contract and time-scope binding.
- `RES19-RECON-020` — exact projected-account coverage.
- `RES19-RECON-021` — explicit evidence for an empty event batch.
- `RES19-LEDGER-023` — event valid time participates in idempotency content.
- `RES19-TIME-001` — nanosecond conservation-interval ordering, offset-equivalent boundary detection, sub-millisecond event ordering and same-instant ambiguity.
- `RES19-EVAL-014` — nanosecond availability-window ordering, offset-equivalent endpoints, immediately stale outside-window times and rejection beyond the existing nine-digit input limit.
- `RES19-TIME-002` — direct Gregorian date, leap-year and clock-field validation for the shared parser.
- `RES19-TIME-003` — direct rejection of missing/unsupported offset syntax and fractional precision beyond the existing nine-digit limit.
- `RES19-TIME-004` — direct offset-equivalence and nanosecond ordering across UTC date/year rollovers.

The v1.9 canonical fixture table and its 60 expected outcomes are unchanged.
