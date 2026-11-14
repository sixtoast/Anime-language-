import {
  evaluateConservationContract,
  reconcileResourceBalance,
  type ConservationContractInput,
  type ConservationQuantity,
  type ResourceBalanceObservation
} from "./resourceConservation";
import type { LedgerAccount, LedgerEvent } from "./resourceLedger";
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
  | "AUDIT-STRUCTURE-PRESENT-UNKNOWN-OUTCOME";

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
  { id: "AUDIT-STRUCTURE-PRESENT-UNKNOWN-OUTCOME", label: "Audit structure present, outcome unknown", description: "All 14 top-level audit sections are represented as explicit unknown placeholders; RESOURCE-OUTCOME-UNKNOWN is preserved without interpretation." }
];

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

function sampleContract(scenario: ResourceConservationPreviewScenario): ConservationContractInput {
  const contractEvidence = scenario === "CONTRACT-EVIDENCE-UNRESOLVED" ||
    scenario === "AUDIT-STRUCTURE-PRESENT-UNKNOWN-OUTCOME" ? "UNKNOWN" : "PASS";
  const closingBalance = scenario === "CONSERVATION-MISMATCH" ? 109 : 110;
  return {
    contractId: "preview-sample-conservation-contract",
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
    openingState: [sampleQuantity(100, "preview:opening-state")],
    sources: [sampleQuantity(20, "preview:source-entry")],
    permittedInputs: [],
    closingState: [sampleQuantity(closingBalance, "preview:closing-state")],
    sinks: [],
    permittedOutputs: [sampleQuantity(10, "preview:permitted-output")],
    declaredLosses: []
  };
}

function sampleAccounts(): LedgerAccount[] {
  return [{
    accountId: "preview-account",
    resourceKind: SAMPLE_RESOURCE_KIND,
    unit: SAMPLE_UNIT,
    unitContractId: SAMPLE_UNIT_CONTRACT,
    openingBalanceTicks: 100
  }];
}

function sampleEvents(): LedgerEvent[] {
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
    idempotencyKey: "preview-consumption-event"
  }];
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
  const accounts = sampleAccounts();
  const events = sampleEvents();
  const observation = sampleObservation(scenario);
  const scenarioDescription = resourceConservationPreviewScenarios.find((item) => item.id === scenario);
  if (!scenarioDescription) throw new Error("Unsupported resource conservation preview scenario.");

  const conservation = evaluateConservationContract(contract);
  const reconciliation = reconcileResourceBalance({
    reconciliationId: "preview-account-reconciliation",
    contract,
    accountId: "preview-account",
    accounts,
    events,
    observation
  });
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
    ...(auditStructure ? { auditStructure } : {}),
    assumptions: [
      "All quantities, evidence states and references are synthetic caller-supplied demonstration inputs, not authenticated facts or live measurements.",
      "The preview-sample-stock resource kind and tick unit exist only to exercise exact-match software accounting; they are not canonical resource vocabulary or physical units.",
      "The scalar-additive invariant and zero-tick tolerance are explicit assumptions in this demonstration contract, not universal physical laws or canonical tolerances.",
      "The confirmed consumption event is sample ledger data; projection does not prove that an incantation or physical operation occurred.",
      "Account reconciliation compares one gross account balance only and does not satisfy the complete v1.9 RESOURCE-RECONCILED stage.",
      "The optional audit example checks only top-level section presence; null placeholders do not establish semantic audit completeness or evidence validity.",
      "Neither evaluation authorises, executes or verifies an incantation, mechanism, target-state change or physical effect."
    ]
  };
}
