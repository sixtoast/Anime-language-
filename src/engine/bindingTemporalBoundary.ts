import { reviewEvidenceRecord, reviewTemporalContract, type EvidenceDecision } from "./incantationEvidenceModel";
import { reviewInvocationLifecycle } from "./incantationLifecycleModel";
import { reviewBindingLifecycleEvidence } from "./bindingLifecycleEvidence";

export const BINDING_TEMPORAL_BOUNDARY_PROFILE = "ARCANE-BINDING-TEMPORAL-BOUNDARY-1.0" as const;
export type IndependentTemporalDomain = "EVIDENCE" | "BINDING" | "INVOCATION";
export interface BindingTemporalBoundaryInput {
  evidence?: { record: unknown; policy: unknown; asOf: string };
  binding?: unknown;
  invocation?: unknown;
  temporalContract?: unknown;
}
export interface BindingTemporalBoundaryReview {
  profile: typeof BINDING_TEMPORAL_BOUNDARY_PROFILE;
  domains: {
    evidence: { supplied: boolean; decision: EvidenceDecision | "NOT-SUPPLIED"; accepted: boolean | null };
    binding: { supplied: boolean; disposition: string; lifetime: string; freshness: string; invalidation: string };
    invocation: { supplied: boolean; disposition: string; currentState: string | null; attempted: boolean | null };
    temporalContract: { supplied: boolean; valid: boolean | null; issues: string[] };
  };
  boundaryFindings: { code: string; message: string }[];
  crossDomainInference: "NOT-PERFORMED";
  bindingValidityDerivedFromEvidence: false;
  bindingValidityDerivedFromInvocation: false;
  invocationStateDerivedFromBinding: false;
  executable: false;
  canonEffect: "NONE";
}
const object = (v: unknown): v is Record<string, unknown> => v !== null && typeof v === "object" && !Array.isArray(v);
export function reviewBindingTemporalBoundaries(input: unknown): BindingTemporalBoundaryReview {
  const invalid = !object(input);
  const data = invalid ? {} : input as BindingTemporalBoundaryInput;
  const evidence = data.evidence && object(data.evidence)
    ? reviewEvidenceRecord(data.evidence.record, data.evidence.policy, data.evidence.asOf)
    : null;
  const binding = data.binding !== undefined ? reviewBindingLifecycleEvidence(data.binding) : null;
  const invocation = data.invocation !== undefined ? reviewInvocationLifecycle(data.invocation) : null;
  const temporal = data.temporalContract !== undefined ? reviewTemporalContract(data.temporalContract) : null;
  const findings: BindingTemporalBoundaryReview["boundaryFindings"] = [];
  if (evidence && binding) {
    findings.push({ code: "EVIDENCE-DOES-NOT-SET-BINDING-LIFETIME", message: "Evidence acceptance or staleness is reported independently; it does not establish or expire a KWAM binding." });
  }
  if (invocation && binding) {
    findings.push({ code: "INVOCATION-DOES-NOT-SET-BINDING-LIFETIME", message: "Invocation lifecycle state and timestamps do not establish binding creation, visibility, expiry or invalidation." });
  }
  if (temporal && binding) {
    findings.push({ code: "TEMPORAL-CONTRACT-DOES-NOT-SET-BINDING-LIFETIME", message: "A temporal contract is reviewed on its own declaration; it is not silently applied as a binding lifetime rule." });
  }
  if (!evidence) findings.push({ code: "EVIDENCE-DOMAIN-NOT-SUPPLIED", message: "No evidence-domain review was supplied; no evidence validity conclusion is available." });
  if (!binding) findings.push({ code: "BINDING-DOMAIN-NOT-SUPPLIED", message: "No binding lifecycle record was supplied; binding validity remains unspecified." });
  if (!invocation) findings.push({ code: "INVOCATION-DOMAIN-NOT-SUPPLIED", message: "No invocation lifecycle record was supplied; invocation status is unavailable." });
  if (!temporal) findings.push({ code: "TEMPORAL-CONTRACT-NOT-SUPPLIED", message: "No temporal contract was supplied; no continuity claim is made." });
  return {
    profile: BINDING_TEMPORAL_BOUNDARY_PROFILE,
    domains: {
      evidence: { supplied: !!evidence, decision: evidence?.decision ?? "NOT-SUPPLIED", accepted: evidence?.accepted ?? null },
      binding: {
        supplied: !!binding,
        disposition: binding?.disposition ?? "NOT-SUPPLIED",
        lifetime: binding?.dimensions.lifetime ?? "NOT-SUPPLIED",
        freshness: binding?.dimensions.freshness ?? "NOT-SUPPLIED",
        invalidation: binding?.dimensions.invalidation ?? "NOT-SUPPLIED"
      },
      invocation: {
        supplied: !!invocation,
        disposition: invocation?.disposition ?? "NOT-SUPPLIED",
        currentState: invocation?.currentState ?? null,
        attempted: invocation?.attempted ?? null
      },
      temporalContract: { supplied: !!temporal, valid: temporal?.valid ?? null, issues: temporal?.issues ?? [] }
    },
    boundaryFindings: findings,
    crossDomainInference: "NOT-PERFORMED",
    bindingValidityDerivedFromEvidence: false,
    bindingValidityDerivedFromInvocation: false,
    invocationStateDerivedFromBinding: false,
    executable: false,
    canonEffect: "NONE"
  };
}
