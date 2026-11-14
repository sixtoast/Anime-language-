import { resourceAccountingFixtures } from "./resourceAccountingFixtures";

export type ResourceAccountingCoverageStatus =
  | "BOUNDED"
  | "PARTIAL"
  | "SEPARATE-GATE"
  | "SPECIFICATION-ONLY";

export interface ResourceAccountingCoverage {
  fixtureId: string;
  status: ResourceAccountingCoverageStatus;
  testIds: string[];
  note: string;
}

/**
 * Engineering coverage audit for the 60 normative v1.9 design fixtures.
 * This table is not part of the canonical specification and does not change
 * any fixture's expected outcome. BOUNDED means only the linked, limited
 * behaviour is implemented and tested; it does not mean the whole fixture's
 * domain contract is complete.
 */
export const resourceAccountingCoverage: ResourceAccountingCoverage[] = [
  {
    "fixtureId": "RES19-01",
    "status": "PARTIAL",
    "testIds": [
      "RES19-EVAL-002"
    ],
    "note": "The preflight requires a unit-contract identifier, but neither the input nor evaluator models a dimension vector or proves dimensional compatibility."
  },
  {
    "fixtureId": "RES19-02",
    "status": "BOUNDED",
    "testIds": [
      "RES19-EVAL-001",
      "RES19-EVAL-002"
    ],
    "note": "The bounded preflight requires explicit resource/account/unit identity and exact unit matching; it does not infer conversions."
  },
  {
    "fixtureId": "RES19-03",
    "status": "SPECIFICATION-ONLY",
    "testIds": [],
    "note": "No dimension-vector arithmetic or general incompatible-dimension addition evaluator is implemented."
  },
  {
    "fixtureId": "RES19-04",
    "status": "BOUNDED",
    "testIds": [
      "RES19-EVAL-003",
      "RES19-LEDGER-010"
    ],
    "note": "Exact unit mismatches and unsupported transformation events fail closed; no conversion contract is evaluated."
  },
  {
    "fixtureId": "RES19-05",
    "status": "PARTIAL",
    "testIds": [
      "RES19-EVAL-005",
      "RES19-EVAL-008"
    ],
    "note": "Source evidence and budget evidence are separate inputs; a budget cannot create source evidence, but no full source-contract resolver exists."
  },
  {
    "fixtureId": "RES19-06",
    "status": "PARTIAL",
    "testIds": [
      "RES19-EVAL-005"
    ],
    "note": "A caller-supplied PASS source-evidence state is required; source authority, provenance and source-contract content are not authenticated."
  },
  {
    "fixtureId": "RES19-07",
    "status": "PARTIAL",
    "testIds": [
      "RES19-EVAL-005"
    ],
    "note": "Non-passing source evidence blocks readiness, but authority and provenance references are not represented as independently resolved records."
  },
  {
    "fixtureId": "RES19-08",
    "status": "BOUNDED",
    "testIds": [
      "RES19-EVAL-001"
    ],
    "note": "The preflight compares the required amount with caller-supplied verified unreserved availability under its bounded scalar model."
  },
  {
    "fixtureId": "RES19-09",
    "status": "BOUNDED",
    "testIds": [
      "RES19-EVAL-006"
    ],
    "note": "The preflight reports insufficient availability when the required amount exceeds the computed unreserved amount."
  },
  {
    "fixtureId": "RES19-10",
    "status": "BOUNDED",
    "testIds": [
      "RES19-EVAL-007"
    ],
    "note": "The conservative consumption upper bound is compared with the explicit strict budget limit."
  },
  {
    "fixtureId": "RES19-11",
    "status": "BOUNDED",
    "testIds": [
      "RES19-EVAL-007"
    ],
    "note": "A passing conservative upper bound may proceed to later preflight checks under the supplied budget evidence."
  },
  {
    "fixtureId": "RES19-12",
    "status": "PARTIAL",
    "testIds": [
      "RES19-EVAL-008"
    ],
    "note": "Missing or unresolved budget evidence remains unknown; probabilistic thresholds and confidence models are not implemented."
  },
  {
    "fixtureId": "RES19-13",
    "status": "BOUNDED",
    "testIds": [
      "RES19-EVAL-006",
      "RES19-LEDGER-007"
    ],
    "note": "Reservations reduce availability while remaining separate from gross balance and physical consumption."
  },
  {
    "fixtureId": "RES19-14",
    "status": "PARTIAL",
    "testIds": [
      "RES19-LEDGER-007"
    ],
    "note": "Sequential reservations are checked against the projected available balance; no concurrent atomic reservation or overcommit contract is implemented."
  },
  {
    "fixtureId": "RES19-15",
    "status": "PARTIAL",
    "testIds": [
      "RES19-EXPIRY-001",
      "RES19-EXPIRY-002",
      "RES19-EXPIRY-003",
      "RES19-EXPIRY-004",
      "RES19-EXPIRY-005",
      "RES19-EXPIRY-006"
    ],
    "note": "A pure temporal assessment reports NOT-REACHED before the declared expiry, RESERVATION-EXPIRED only after it with caller-supplied OBSERVED evidence or a CONTRACTUALLY-GUARANTEED contract reference, and RESOURCE-OUTCOME-UNKNOWN at the exact boundary, after expiry without evidence, or on malformed/contradictory input. It does not verify reservation existence/state, authenticate references, apply release policy, mutate the ledger or change availability."
  },
  {
    "fixtureId": "RES19-16",
    "status": "BOUNDED",
    "testIds": [
      "RES19-LEDGER-016"
    ],
    "note": "A confirmed, evidenced release returns an unconsumed reservation amount to availability without changing gross balance."
  },
  {
    "fixtureId": "RES19-17",
    "status": "BOUNDED",
    "testIds": [
      "RES19-LEDGER-017"
    ],
    "note": "Partial reserved consumption reduces the gross balance and only the remaining held reservation amount."
  },
  {
    "fixtureId": "RES19-18",
    "status": "BOUNDED",
    "testIds": [
      "RES19-LEDGER-005"
    ],
    "note": "A retry with the same idempotency key and identical event fingerprint is not applied twice."
  },
  {
    "fixtureId": "RES19-19",
    "status": "PARTIAL",
    "testIds": [
      "RES19-LEDGER-011",
      "RES19-LEDGER-022"
    ],
    "note": "Distinct event identities and idempotency keys remain distinct; similarity-based reconciliation is not implemented."
  },
  {
    "fixtureId": "RES19-20",
    "status": "BOUNDED",
    "testIds": [
      "RES19-LEDGER-002"
    ],
    "note": "A transfer applies source debit and destination credit together when both accounts match the event's exact resource and unit contract."
  },
  {
    "fixtureId": "RES19-21",
    "status": "PARTIAL",
    "testIds": [
      "RES19-LEDGER-019"
    ],
    "note": "A transfer missing its source account fails before destination credit; separate debit/credit event reconciliation is not implemented."
  },
  {
    "fixtureId": "RES19-22",
    "status": "SPECIFICATION-ONLY",
    "testIds": [],
    "note": "No evaluator for explicit transformation inputs, outputs, boundary, conversion rule, losses and uncertainty is implemented."
  },
  {
    "fixtureId": "RES19-23",
    "status": "PARTIAL",
    "testIds": [
      "RES19-LEDGER-010"
    ],
    "note": "Transformation event kinds fail closed; valid domain-specific transformation contracts are not evaluated."
  },
  {
    "fixtureId": "RES19-24",
    "status": "PARTIAL",
    "testIds": [
      "RES19-LEDGER-020"
    ],
    "note": "A source-entry event requires a source/conversion reference; no matter-specific creation or physical mechanism is inferred."
  },
  {
    "fixtureId": "RES19-25",
    "status": "PARTIAL",
    "testIds": [
      "RES19-LEDGER-020"
    ],
    "note": "A source-entry event requires a source/conversion reference; no energy-specific source or physical mechanism is inferred."
  },
  {
    "fixtureId": "RES19-26",
    "status": "BOUNDED",
    "testIds": [
      "RES19-EVAL-003",
      "RES19-LEDGER-021"
    ],
    "note": "Exact unit and resource-kind matching prevents numeric magnitudes from being treated as an implicit mana-to-energy conversion."
  },
  {
    "fixtureId": "RES19-27",
    "status": "BOUNDED",
    "testIds": [
      "RES19-CONS-004"
    ],
    "note": "The scalar conservation contract requires an explicit system boundary, valid interval, evaluation time and evidence references."
  },
  {
    "fixtureId": "RES19-28",
    "status": "SPECIFICATION-ONLY",
    "testIds": [],
    "note": "The evaluator cannot determine whether caller-supplied boundary evidence omits an unreported relevant exchange."
  },
  {
    "fixtureId": "RES19-29",
    "status": "PARTIAL",
    "testIds": [
      "RES19-CONS-003"
    ],
    "note": "An unsupported invariant remains unresolved; the implementation does not inspect resource structure to select a vector or relational invariant."
  },
  {
    "fixtureId": "RES19-30",
    "status": "BOUNDED",
    "testIds": [
      "RES19-CONS-001",
      "RES19-CONS-002"
    ],
    "note": "A scalar-additive balance may satisfy the named contract within its explicit integer-tick tolerance and passing supplied evidence."
  },
  {
    "fixtureId": "RES19-31",
    "status": "BOUNDED",
    "testIds": [
      "RES19-CONS-002"
    ],
    "note": "A scalar balance outside the contract's declared tolerance is reported as a conservation mismatch."
  },
  {
    "fixtureId": "RES19-32",
    "status": "PARTIAL",
    "testIds": [
      "RES19-CONS-003",
      "RES19-RECON-003"
    ],
    "note": "Non-passing or unresolved evidence remains unresolved; uncertainty bounds and policy semantics are not calculated or interpreted."
  },
  {
    "fixtureId": "RES19-33",
    "status": "BOUNDED",
    "testIds": [
      "RES19-CONS-006",
      "RES19-CONS-007",
      "RES19-CONS-008",
      "RES19-LEDGER-009"
    ],
    "note": "A declared loss requires an explicit permitted-pathway reference and passing supporting evidence before it contributes to the balance."
  },
  {
    "fixtureId": "RES19-34",
    "status": "BOUNDED",
    "testIds": [
      "RES19-EVAL-004"
    ],
    "note": "Preflight rejects a null opening balance as unknown instead of treating it as zero; the scalar evaluator accepts only explicit non-negative integer terms."
  },
  {
    "fixtureId": "RES19-35",
    "status": "PARTIAL",
    "testIds": [
      "RES19-EVAL-005",
      "RES19-EVAL-010",
      "RES19-EVAL-011",
      "RES19-EVAL-012",
      "RES19-RECON-006"
    ],
    "note": "Preflight checks caller-supplied availability timestamps against an explicit source window and leaves endpoint ambiguity unresolved. Source-contract validity and evidence authenticity remain caller-supplied, so end-to-end source verification is still partial."
  },
  {
    "fixtureId": "RES19-36",
    "status": "SEPARATE-GATE",
    "testIds": [
      "AUTH20-TEST-004",
      "POL21-TEST-006",
      "GATE-TEST-005"
    ],
    "note": "Resource readiness does not grant execution authority; the linked checks preserve authority, consent and resource gates as separate concerns, not one integrated runtime decision."
  },
  {
    "fixtureId": "RES19-37",
    "status": "SPECIFICATION-ONLY",
    "testIds": [],
    "note": "No physical mechanism or feasibility evaluator establishes whether the declared operation can produce the requested effect."
  },
  {
    "fixtureId": "RES19-38",
    "status": "BOUNDED",
    "testIds": [
      "RES19-EVAL-009"
    ],
    "note": "The preflight exposes RESOURCE-READY as readiness only and explicitly does not claim that an attempt or execution began."
  },
  {
    "fixtureId": "RES19-39",
    "status": "SPECIFICATION-ONLY",
    "testIds": [],
    "note": "There is no executor lifecycle or resource-report ingestion service for attempted operations."
  },
  {
    "fixtureId": "RES19-40",
    "status": "PARTIAL",
    "testIds": [
      "RES19-RECON-001",
      "RES19-RECON-002",
      "RES19-RECON-003",
      "RES19-RECON-008"
    ],
    "note": "The reconciler compares one account's gross projected balance with an accepted observation; it does not complete whole-resource reconciliation."
  },
  {
    "fixtureId": "RES19-41",
    "status": "SPECIFICATION-ONLY",
    "testIds": [],
    "note": "The project has no execution-failure lifecycle that links a confirmed debit to an executor-reported failed attempt."
  },
  {
    "fixtureId": "RES19-42",
    "status": "SPECIFICATION-ONLY",
    "testIds": [],
    "note": "Interrupted execution, residual activity and partial-stop accounting are not implemented."
  },
  {
    "fixtureId": "RES19-43",
    "status": "SPECIFICATION-ONLY",
    "testIds": [],
    "note": "Compensation operations, their additional resource use and compensation failure states are not implemented."
  },
  {
    "fixtureId": "RES19-44",
    "status": "SPECIFICATION-ONLY",
    "testIds": [],
    "note": "Refund semantics are not implemented; a measured-return event is not treated as a bookkeeping refund or proof of reversal."
  },
  {
    "fixtureId": "RES19-45",
    "status": "BOUNDED",
    "testIds": [
      "RES19-LEDGER-016"
    ],
    "note": "A confirmed reservation-release event releases the unconsumed hold; it does not claim a physical refund."
  },
  {
    "fixtureId": "RES19-46",
    "status": "SPECIFICATION-ONLY",
    "testIds": [],
    "note": "No executor-supplied all-or-nothing transaction guarantee is modelled or enforced before attempt."
  },
  {
    "fixtureId": "RES19-47",
    "status": "SPECIFICATION-ONLY",
    "testIds": [],
    "note": "Partial execution profiles, minimum completion and stage/resource reports are not implemented."
  },
  {
    "fixtureId": "RES19-48",
    "status": "SPECIFICATION-ONLY",
    "testIds": [],
    "note": "Best-effort execution semantics and their non-substitution constraints are not implemented as an execution profile."
  },
  {
    "fixtureId": "RES19-49",
    "status": "BOUNDED",
    "testIds": [
      "RES19-LEDGER-005",
      "RES19-LEDGER-014"
    ],
    "note": "Stable invocation identity and idempotency keys are retained in the ledger projection; identical retry fingerprints do not debit twice."
  },
  {
    "fixtureId": "RES19-50",
    "status": "SPECIFICATION-ONLY",
    "testIds": [],
    "note": "The ledger cannot recognise a possibly repeated debit represented by a new event identity and new idempotency key without a reconciliation contract."
  },
  {
    "fixtureId": "RES19-51",
    "status": "SPECIFICATION-ONLY",
    "testIds": [],
    "note": "The pure sequential projection does not provide concurrency control or detect stale check-then-reserve races."
  },
  {
    "fixtureId": "RES19-52",
    "status": "SPECIFICATION-ONLY",
    "testIds": [],
    "note": "No account contract or executor guarantee for atomic reservation coordination is represented."
  },
  {
    "fixtureId": "RES19-53",
    "status": "SPECIFICATION-ONLY",
    "testIds": [],
    "note": "Distributed account consistency, disagreement resolution and temporary unavailability are outside the current single-process projection."
  },
  {
    "fixtureId": "RES19-54",
    "status": "SPECIFICATION-ONLY",
    "testIds": [],
    "note": "Ledger events do not yet carry and reconcile preflight/report contract-version identities."
  },
  {
    "fixtureId": "RES19-55",
    "status": "PARTIAL",
    "testIds": [
      "RES19-EVAL-003",
      "RES19-LEDGER-010"
    ],
    "note": "Unit changes are refused without an exact matching contract; rounding and precision-policy evaluation are not implemented."
  },
  {
    "fixtureId": "RES19-56",
    "status": "BOUNDED",
    "testIds": [
      "RES19-RECON-010"
    ],
    "note": "An ESTIMATE observation cannot be substituted for a measured account balance."
  },
  {
    "fixtureId": "RES19-57",
    "status": "PARTIAL",
    "testIds": [
      "RES19-RECON-011",
      "RES19-RECON-012"
    ],
    "note": "Measurement method, time, uncertainty, provenance and explicit policy acceptance references are required; the policy and evidence are not authenticated or interpreted."
  },
  {
    "fixtureId": "RES19-58",
    "status": "PARTIAL",
    "testIds": [
      "RES19-LEDGER-018"
    ],
    "note": "Generic correction events are rejected and the original debit remains projected; signed, direction-specific correction contracts are not implemented."
  },
  {
    "fixtureId": "RES19-59",
    "status": "PARTIAL",
    "testIds": [
      "RES19-AUDIT-001",
      "RES19-AUDIT-002",
      "RES19-AUDIT-003",
      "RES19-AUDIT-004",
      "RES19-AUDIT-005",
      "RES19-AUDIT-006"
    ],
    "note": "A presence-only assessor checks that all 14 top-level v1.9 audit sections are represented and preserves a caller-reported unknown or failed outcome verbatim. It does not validate section content, contract-version values, evidence authenticity or semantic audit completeness."
  },
  {
    "fixtureId": "RES19-60",
    "status": "SPECIFICATION-ONLY",
    "testIds": [],
    "note": "Target postcondition verification is not implemented by the resource accounting evaluator; resource success cannot establish overall spell success."
  }
];

export const resourceAccountingCoverageSummary = resourceAccountingCoverage.reduce(
  (summary, item) => {
    if (item.status === "BOUNDED") summary.bounded += 1;
    else if (item.status === "PARTIAL") summary.partial += 1;
    else if (item.status === "SEPARATE-GATE") summary.separateGate += 1;
    else summary.specificationOnly += 1;
    return summary;
  },
  { total: resourceAccountingCoverage.length, bounded: 0, partial: 0, separateGate: 0, specificationOnly: 0 }
);

export function getResourceAccountingCoverage(fixtureId: string): ResourceAccountingCoverage | undefined {
  return resourceAccountingCoverage.find((item) => item.fixtureId === fixtureId);
}

export const resourceAccountingCoverageAudit = {
  fixtureCount: resourceAccountingFixtures.length,
  mappedCount: resourceAccountingCoverage.length,
  fixtureIdsMatch: resourceAccountingFixtures.every((fixture, index) =>
    resourceAccountingCoverage[index]?.fixtureId === fixture.id
  )
};
