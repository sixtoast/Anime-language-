import { evaluateAuthorityGate } from "./authorityGate";
import { evaluateInvocationGates, type GateState } from "./invocationGates";
import { evaluatePolicyComposition } from "./policyComposition";
import { evaluateResourcePreflight, resourcePreflightGateState } from "./resourcePreflight";

export type RuntimePreviewScenario =
  | "READY-SAMPLE"
  | "RESOURCE-BLOCKED"
  | "AUTHORITY-UNAVAILABLE"
  | "POLICY-UNRESOLVED"
  | "CONSENT-UNRESOLVED"
  | "FEASIBILITY-BLOCKED"
  | "INVALID";

export const runtimePreviewScenarios: { id: RuntimePreviewScenario; label: string; description: string }[] = [
  { id: "READY-SAMPLE", label: "All sample gates pass", description: "Illustrates the coordinator's eligible-to-proceed result using explicitly assumed passing upstream evidence." },
  { id: "RESOURCE-BLOCKED", label: "Insufficient resources", description: "The required quantity exceeds the sample account's available balance." },
  { id: "AUTHORITY-UNAVAILABLE", label: "Authority unavailable", description: "No usable authority decision is supplied; the authority gate remains unavailable." },
  { id: "POLICY-UNRESOLVED", label: "Policy trust unresolved", description: "The policy plan's trust state is unknown, so composition cannot produce a permit." },
  { id: "CONSENT-UNRESOLVED", label: "Consent unresolved", description: "The independent consent gate has no established passing result." },
  { id: "FEASIBILITY-BLOCKED", label: "Feasibility blocked", description: "The separate feasibility assessment reports a blocker." }
];

export interface IncantationRuntimePreview {
  scenario: RuntimePreviewScenario;
  description: string;
  resource: ReturnType<typeof evaluateResourcePreflight>;
  policy: ReturnType<typeof evaluatePolicyComposition>;
  authority: ReturnType<typeof evaluateAuthorityGate>;
  invocation: ReturnType<typeof evaluateInvocationGates>;
  assumptions: string[];
}

export function evaluateIncantationRuntimePreview(
  scenario: RuntimePreviewScenario
): IncantationRuntimePreview {
  if (!runtimePreviewScenarios.some((item) => item.id === scenario)) {
    const resource = evaluateResourcePreflight({
      resourceKind: "",
      accountId: "",
      unit: "",
      requiredUnit: "",
      openingBalance: null,
      openingBalanceEvidence: "UNKNOWN",
      sourceEvidence: "UNKNOWN",
      evidenceFreshness: "UNKNOWN",
      requiredAmount: 0,
      heldReservations: 0,
      reservationEvidence: "UNKNOWN",
      budgetEvidence: "UNKNOWN"
    });
    const policy = evaluatePolicyComposition({
      strategy: "ALL-MUST-PERMIT",
      planTrust: "UNKNOWN",
      planValid: "UNKNOWN",
      profiles: []
    });
    const authority = evaluateAuthorityGate(null as never);
    const invocation = evaluateInvocationGates({
      semanticValidation: "BLOCK",
      feasibilityAssessment: "UNRESOLVED",
      resourceReadiness: "UNRESOLVED",
      policyComposition: policy,
      authority,
      consent: "UNRESOLVED",
      privacy: "UNRESOLVED",
      safety: "UNRESOLVED",
      requiredIndependentGateIds: [],
      independentGateResults: []
    });
    return {
      scenario: "INVALID",
      description: "Unknown runtime preview scenario identifier; no sample scenario was selected.",
      resource,
      policy,
      authority,
      invocation,
      assumptions: [
        "The supplied scenario identifier was not recognised and no READY-SAMPLE defaults were substituted.",
        "The preview returns a blocked diagnostic result only; no incantation is executed and no external evidence is verified."
      ]
    };
  }

  const resource = evaluateResourcePreflight({
    resourceKind: "mana",
    accountId: "sample-account",
    unit: "mana-tick",
    requiredUnit: "mana-tick",
    unitContractId: "sample-mana-tick-v1",
    openingBalance: 10,
    openingBalanceEvidence: "PASS",
    sourceEvidence: "PASS",
    evidenceFreshness: "PASS",
    requiredAmount: scenario === "RESOURCE-BLOCKED" ? 11 : 4,
    heldReservations: 0,
    reservationEvidence: "PASS",
    budgetEvidence: "PASS",
    sourceAvailableAmount: 10
  });

  const policy = evaluatePolicyComposition({
    strategy: "ALL-MUST-PERMIT",
    planTrust: scenario === "POLICY-UNRESOLVED" ? "UNKNOWN" : "TRUSTED",
    planValid: true,
    profiles: [{
      profileId: "sample-profile",
      version: "1.0.0",
      required: true,
      optionalOmissionExplicit: false,
      applicability: "TRUE",
      trust: "TRUSTED",
      freshness: "CURRENT",
      decision: "PERMIT"
    }]
  });

  const authority = evaluateAuthorityGate({
    requestWellFormed: true,
    decisionWellFormed: true,
    decisionPresent: scenario !== "AUTHORITY-UNAVAILABLE",
    decision: scenario === "AUTHORITY-UNAVAILABLE" ? "UNKNOWN" : "PERMIT",
    issuerTrust: "PASS",
    delegation: "PASS",
    integrity: "PASS",
    freshness: "PASS",
    expiry: "CURRENT",
    revocation: "PASS",
    subjectMatch: "MATCH",
    actionMatch: "MATCH",
    targetMatch: "MATCH",
    scopeContainment: "MATCH",
    conditions: "ALL-SATISFIED",
    requiredIndependentGates: "PASS"
  });

  const consent: GateState = scenario === "CONSENT-UNRESOLVED" ? "UNRESOLVED" : "PASS";
  const feasibility: GateState = scenario === "FEASIBILITY-BLOCKED" ? "BLOCK" : "PASS";
  const invocation = evaluateInvocationGates({
    semanticValidation: "PASS",
    feasibilityAssessment: feasibility,
    resourceReadiness: resourcePreflightGateState(resource),
    policyComposition: policy,
    authority,
    consent,
    privacy: "PASS",
    safety: "PASS",
    requiredIndependentGateIds: ["consent", "privacy", "safety"],
    independentGateResults: [
      { gateId: "consent", state: consent },
      { gateId: "privacy", state: "PASS" },
      { gateId: "safety", state: "PASS" }
    ]
  });

  const description = runtimePreviewScenarios.find((item) => item.id === scenario)?.description ?? "";
  return {
    scenario,
    description,
    resource,
    policy,
    authority,
    invocation,
    assumptions: [
      "All sample evidence values are caller-supplied demonstration inputs, not authenticated facts.",
      "The sample mana account, quantity and unit contract are invented test data, not canonical world measurements.",
      "The feasibility and semantic-validation PASS values are assumed upstream results; this panel does not evaluate a physical mechanism.",
      "The preview never executes an incantation, consumes a resource, grants real permission or verifies a physical outcome."
    ]
  };
}
