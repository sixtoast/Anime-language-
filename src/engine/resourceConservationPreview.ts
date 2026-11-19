import {
  evaluateConservationContract,
  reconcileResourceBalance,
  reconcileResourceAccountSet,
  type ConservationContractInput,
  type ConservationQuantity,
  type ResourceBalanceObservation,
  type ResourceAccountBalanceObservation,
  type ResourceReconciliationAccount,
  type ResourceReconciliationBatchEvidence,
  type ResourceReconciliationEvent
} from "./resourceConservation";
import { assessResourceAccountingAuditStructure } from "./resourceAccountingAudit";

/**
 * Deterministic, read-only v1.9 demonstration inputs for the Playground.
 *
 * "preview-sample-stock" and "tick" are synthetic software-test identifiers,
 * not canonical resource kinds, physical units, or conversion rules.
 * Every evidence state/reference is assumed caller input, not authenticated.
 */
export type ResourceConservationPreviewScenario =
  | "BALANCED"
  | "CONSERVATION-MISMATCH"
  | "ACCOUNT-DISCREPANCY"
  | "ESTIMATE-AS-MEASUREMENT"
  | "MEASUREMENT-POLICY-UNRESOLVED"
  | "CONTRACT-EVIDENCE-UNRESOLVED"
  | "AUDIT-STRUCTURE-PRESENT-UNKNOWN-OUTCOME"
  | "EVENT-BATCH-COMPLETENESS-UNRESOLVED"
  | "TRANSFER-RECONCILED"
  | "TRANSFER-SOURCE-DEBIT-MISSING"
  | "CONTRACT-VERSION-MISMATCH";

export const resourceConservationPreviewScenarios: {
  id: ResourceConservationPreviewScenario;
  label: string;
  description: string;
}[] = [
  { id: "BALANCED", label: "Balanced sample", description: "Both independent sample checks reconcile within the explicitly declared zero-tick demonstration tolerance." },
  { id: "CONSERVATION-MISMATCH", label: "Conservation mismatch", description: "The conservation balance differs by one tick; the separate account observation still reconciles." },
  { id: "ACCOUNT-DISCREPANCY", label: "Account discrepancy", description: "The measured account balance is two ticks below the ledger projection; no correction is applied." },
  { id: "ESTIMATE-AS-MEASUREMENT", label: "Estimate presented as measurement", description: "The account observation is classified as an estimate, so measurement reconciliation remains unresolved." },
  { id: "MEASUREMENT-POLICY-UNRESOLVED", label: "Measurement policy unresolved", description: "The observation's per-measurement uncertainty-policy acceptance is unknown, so it cannot reconcile." },
  { id: "CONTRACT-EVIDENCE-UNRESOLVED", label: "Contract evidence unresolved", description: "The conservation contract evidence is unknown, so neither evaluation may claim a passing result." },
  { id: "AUDIT-STRUCTURE-PRESENT-UNKNOWN-OUTCOME", label: "Audit structure present, outcome unknown", description: "All 14 top-level audit sections are represented as explicit unknown placeholders; RESOURCE-OUTCOME-UNKNOWN is preserved without interpretation." },
  { id: "EVENT-BATCH-COMPLETENESS-UNRESOLVED", label: "Event-batch completeness unresolved", description: "The event-batch completeness assertion is unknown, so an otherwise matching account balance cannot be reconciled." },
  { id: "TRANSFER-RECONCILED", label: "Two-account transfer reconciled", description: "One transfer event debits the source and credits the destination; both measured gross balances match the same complete event batch." },
  { id: "TRANSFER-SOURCE-DEBIT-MISSING", label: "Transfer without source debit", description: "A transfer with no source account is rejected before destination credit; both account comparisons remain unresolved even though the separate aggregate sample balances." },
  { id: "CONTRACT-VERSION-MISMATCH", label: "Contract version mismatch", description: "The report batch uses a different opaque contract-version identity from preflight, so account reconciliation remains unresolved." }
];

function isTransferScenario(scenario: ResourceConservationPreviewScenario): boolean {
  return scenario === "TRANSFER-RECONCILED" || scenario === "TRANSFER-SOURCE-DEBIT-MISSING";
}

const SAMPLE_RESOURCE_KIND = "preview-sample-stock";
const SAMPLE_UNIT = "tick";
const SAMPLE_UNIT_CONTRACT = "preview-sample-stock-tick-v1";
const SAMPLE_TIME = "2026-06-01T00:00:00Z";
const SAMPLE_INTERVAL = { start: "2026-01-01T00:00:00Z", end: "2027-01-01T00:00:00Z" };

function sampleQuantity(amountTicks: number, evidenceRef: string): ConservationQuantity {
  return {
    resourceKind: SAMPLE_RESOURCE_KIND,
    amountTicks,
    unit: SAMPLE_UNIT,
    unitContractId: SAMPLE_UNIT_CONTRACT,
    evidence: "PASS",
    evidenceRef
  };
}

function sampleContract(scenario: ResourceConservationPreviewScenario): ConservationContractInput & { preflightContractVersionRef: string } {
  const contractEvidence = scenario === "CONTRACT-EVIDENCE-UNRESOLVED" ||
    scenario === "AUDIT-STRUCTURE-PRESENT-UNKNOWN-OUTCOME" ? "UNKNOWN" : "PASS";
  const transferScenario = isTransferScenario(scenario);
  const openingBalance = transferScenario ? 110 : 100;
  const sourceBalance = transferScenario ? 0 : 20;
  const closingBalance = transferScenario ? 110 : scenario === "CONSERVATION-MISMATCH" ? 109 : 110;
  const outputBalance = transferScenario ? 0 : 10;
  return {
    contractId: "preview-sample-conservation-contract",
    preflightContractVersionRef: "preview-resource-contract:v1",
    resourceKind: SAMPLE_RESOURCE_KIND,
    unit: SAMPLE_UNIT,
    unitContractId: SAMPLE_UNIT_CONTRACT,
    systemBoundary: "preview-sample-account-boundary",
    validInterval: { ...SAMPLE_INTERVAL },
    evaluationTime: SAMPLE_TIME,
    invariant: "SCALAR-ADDITIVE-BALANCE",
    toleranceTicks: 0,
    contractEvidence,
    contractEvidenceRef: "preview:contract-evidence",
    boundaryEvidence: "PASS",
    boundaryEvidenceRef: "preview:boundary-evidence",
    uncertaintyRuleRef: "preview:uncertainty-rule",
    uncertaintyPolicyEvidence: "PASS",
    uncertaintyPolicyEvidenceRef: "preview:uncertainty-policy-evidence",
    openingState: [sampleQuantity(openingBalance, "preview:opening-state")],
    sources: sourceBalance > 0 ? [sampleQuantity(sourceBalance, "preview:source-entry")] : [],
    permittedInputs: [],
    closingState: [sampleQuantity(closingBalance, "preview:closing-state")],
    sinks: [],
    permittedOutputs: outputBalance > 0 ? [sampleQuantity(outputBalance, "preview:permitted-output")] : [],
    declaredLosses: []
  };
}

function sampleAccounts(scenario: ResourceConservationPreviewScenario): ResourceReconciliationAccount[] {
  if (isTransferScenario(scenario)) {
    return [
      {
        accountId: "preview-account-source",
        resourceKind: SAMPLE_RESOURCE_KIND,
        unit: SAMPLE_UNIT,
        unitContractId: SAMPLE_UNIT_CONTRACT,
        openingBalanceTicks: 100,
        openingBalanceAsOf: SAMPLE_INTERVAL.start
      },
      {
        accountId: "preview-account-destination",
        resourceKind: SAMPLE_RESOURCE_KIND,
        unit: SAMPLE_UNIT,
        unitContractId: SAMPLE_UNIT_CONTRACT,
        openingBalanceTicks: 10,
        openingBalanceAsOf: SAMPLE_INTERVAL.start
      }
    ];
  }
  return [{
    accountId: "preview-account",
    resourceKind: SAMPLE_RESOURCE_KIND,
    unit: SAMPLE_UNIT,
    unitContractId: SAMPLE_UNIT_CONTRACT,
    openingBalanceTicks: 100,
    openingBalanceAsOf: SAMPLE_INTERVAL.start
  }];
}

function sampleReportContractVersion(scenario: ResourceConservationPreviewScenario): string {
  return scenario === "CONTRACT-VERSION-MISMATCH" ? "preview-resource-contract:v2" : "preview-resource-contract:v1";
}

function sampleEvents(scenario: ResourceConservationPreviewScenario): ResourceReconciliationEvent[] {
  if (isTransferScenario(scenario)) {
    return [{
      eventId: "preview-transfer-event",
      invocationId: "preview-invocation",
      resourceKind: SAMPLE_RESOURCE_KIND,
      eventKind: "TRANSFER",
      ...(scenario === "TRANSFER-SOURCE-DEBIT-MISSING" ? {} : { fromAccount: "preview-account-source" }),
      toAccount: "preview-account-destination",
      amountTicks: 20,
      unit: SAMPLE_UNIT,
      unitContractId: SAMPLE_UNIT_CONTRACT,
      status: "CONFIRMED",
      evidence: "PASS",
      idempotencyKey: "preview-transfer-event",
      validTime: "2026-05-01T00:00:00Z",
      contractVersionRef: sampleReportContractVersion(scenario)
    }];
  }
  return [{
    eventId: "preview-consumption-event",
    invocationId: "preview-invocation",
    resourceKind: SAMPLE_RESOURCE_KIND,
    eventKind: "CONSUME",
    fromAccount: "preview-account",
    amountTicks: 10,
    unit: SAMPLE_UNIT,
    unitContractId: SAMPLE_UNIT_CONTRACT,
    status: "CONFIRMED",
    evidence: "PASS",
    idempotencyKey: "preview-consumption-event",
    validTime: "2026-05-01T00:00:00Z",
    contractVersionRef: sampleReportContractVersion(scenario)
  }];
}

function sampleAccountSetObservations(scenario: ResourceConservationPreviewScenario): ResourceAccountBalanceObservation[] {
  const sourceBalance = scenario === "TRANSFER-SOURCE-DEBIT-MISSING" ? 100 : 80;
  const destinationBalance = scenario === "TRANSFER-SOURCE-DEBIT-MISSING" ? 10 : 30;
  return [
    { accountId: "preview-account-source", ...sampleObservation("BALANCED"), balanceTicks: sourceBalance },
    { accountId: "preview-account-destination", ...sampleObservation("BALANCED"), balanceTicks: destinationBalance }
  ];
}

function sampleEventBatchEvidence(
  scenario: ResourceConservationPreviewScenario
): ResourceReconciliationBatchEvidence {
  return {
    contractId: "preview-sample-conservation-contract",
    systemBoundary: "preview-sample-account-boundary",
    accountIds: sampleAccounts(scenario).map((account) => account.accountId),
    openingSnapshotAsOf: SAMPLE_INTERVAL.start,
    observationTime: SAMPLE_TIME,
    contractVersionRef: sampleReportContractVersion(scenario),
    completenessEvidence: scenario === "EVENT-BATCH-COMPLETENESS-UNRESOLVED" ? "UNKNOWN" : "PASS",
    completenessEvidenceRef: "preview:event-batch-completeness"
  };
}

function sampleAuditRecord(): Record<string, unknown> {
  return {
    resourceDefinitions: null,
    accountSnapshots: null,
    budgets: null,
    sourceClaims: null,
    reservations: null,
    ledgerEvents: null,
    transformations: null,
    conservationChecks: null,
    estimates: null,
    observations: null,
    reconciliation: null,
    uncertainty: null,
    unresolvedDiscrepancies: null,
    contractVersions: null
  };
}

function sampleObservation(scenario: ResourceConservationPreviewScenario): ResourceBalanceObservation {
  return {
    category: scenario === "ESTIMATE-AS-MEASUREMENT" ? "ESTIMATE" : "MEASUREMENT",
    balanceTicks: scenario === "ACCOUNT-DISCREPANCY" ? 88 : 90,
    observedAt: SAMPLE_TIME,
    methodRef: "preview:measurement-method",
    uncertaintyRef: "preview:measurement-uncertainty",
    provenanceRef: "preview:measurement-provenance",
    evidence: "PASS",
    evidenceRef: "preview:measurement-evidence",
    policyAcceptanceEvidence: scenario === "MEASUREMENT-POLICY-UNRESOLVED" ? "UNKNOWN" : "PASS",
    policyAcceptanceEvidenceRef: "preview:measurement-policy-acceptance"
  };
}

export function evaluateResourceConservationPreview(scenario: ResourceConservationPreviewScenario) {
  const contract = sampleContract(scenario);
  const accounts = sampleAccounts(scenario);
  const events = sampleEvents(scenario);
  const eventBatchEvidence = sampleEventBatchEvidence(scenario);
  const accountSetObservations = isTransferScenario(scenario) ? sampleAccountSetObservations(scenario) : undefined;
  const observation = accountSetObservations?.[0] ?? sampleObservation(scenario);
  const scenarioDescription = resourceConservationPreviewScenarios.find((item) => item.id === scenario);
  if (!scenarioDescription) throw new Error("Unsupported resource conservation preview scenario.");

  const conservation = evaluateConservationContract(contract);
  const reconciliation = reconcileResourceBalance({
    reconciliationId: "preview-account-reconciliation",
    contract,
    accountId: accounts[0]?.accountId ?? "",
    accounts,
    events,
    eventBatchEvidence,
    observation
  });
  const accountSetReconciliation = accountSetObservations
    ? reconcileResourceAccountSet({
        reconciliationId: "preview-account-set-reconciliation",
        contract,
        accounts,
        events,
        eventBatchEvidence,
        observations: accountSetObservations
      })
    : undefined;
  const auditStructure = scenario === "AUDIT-STRUCTURE-PRESENT-UNKNOWN-OUTCOME"
    ? assessResourceAccountingAuditStructure({
        record: sampleAuditRecord(),
        reportedResourceOutcome: "RESOURCE-OUTCOME-UNKNOWN"
      })
    : undefined;

  return {
    scenario,
    description: scenarioDescription.description,
    conservation,
    reconciliation,
    ...(accountSetReconciliation ? { accountSetReconciliation } : {}),
    ...(auditStructure ? { auditStructure } : {}),
    assumptions: [
      "All quantities, evidence states and references are synthetic caller-supplied demonstration inputs, not authenticated facts or live measurements.",
      "The preview-sample-stock resource kind and tick unit exist only to exercise exact-match software accounting; they are not canonical resource vocabulary or physical units.",
      "The scalar-additive invariant and zero-tick tolerance are explicit assumptions in this demonstration contract, not universal physical laws or canonical tolerances.",
      "The opening balance is timestamped at the sample interval start, and the supplied event is strictly ordered before the sample observation; boundary-equal times are deliberately unresolved.",
      "Event-batch completeness is a synthetic caller-supplied assertion scoped to the sample contract, boundary, account set and observation time; it is not authenticated or independently verified.",
      "Contract-version identifiers are synthetic opaque references; the preview requires exact equality and does not infer cross-version compatibility.",
      "The confirmed ledger event is sample data; projection does not prove that an incantation or physical operation occurred.",
      "The single-account comparison is gross-balance-only. The optional account-set result repeats that comparison for every declared account; neither evaluates a cross-account invariant or the complete v1.9 RESOURCE-RECONCILED stage.",
      "The transfer sample uses one synthetic TRANSFER event with both source and destination identities; the projector applies both sides only when the source debit succeeds.",
      "The optional account-set result requires one measured observation per account in the same event batch; it does not authenticate the observations or completeness assertion.",
      "The optional audit example checks only top-level section presence; null placeholders do not establish semantic audit completeness or evidence validity.",
      "Neither evaluation authorises, executes or verifies an incantation, mechanism, target-state change or physical effect."
    ]
  };
}
