/**
 * Evidence-completeness audit for the unresolved lifecycle of Arcane bindings.
 * It does not impose a lifecycle state machine or infer transition semantics.
 */
export const BINDING_LIFECYCLE_EVIDENCE_PROFILE = "ARCANE-BINDING-LIFECYCLE-EVIDENCE-1.0" as const;
export type BindingEvidenceStatus = "ESTABLISHED" | "UNRESOLVED" | "CONFLICTING";
export type BindingLifecycleDimension =
  | "creation" | "identity" | "visibility" | "lifetime"
  | "mutation" | "freshness" | "invalidation" | "ownership";
export interface BindingLifecycleClaim {
  dimension: BindingLifecycleDimension;
  status: BindingEvidenceStatus;
  evidence: string[];
  declaration?: string;
}
export interface BindingLifecycleRecord {
  profile: typeof BINDING_LIFECYCLE_EVIDENCE_PROFILE;
  bindingLabel: string;
  claims: BindingLifecycleClaim[];
}
export interface BindingLifecycleFinding {
  code: string;
  dimension: BindingLifecycleDimension | "record";
  message: string;
}
export interface BindingLifecycleReview {
  profile: typeof BINDING_LIFECYCLE_EVIDENCE_PROFILE;
  disposition: "EVIDENCE-COMPLETE-FOR-OWNER-REVIEW" | "INCOMPLETE" | "CONFLICTING" | "INVALID";
  bindingLabel: string;
  dimensions: Record<BindingLifecycleDimension, BindingEvidenceStatus | "NOT-SUPPLIED">;
  findings: BindingLifecycleFinding[];
  grammarDefined: false;
  lifecycleTransitionsInferred: false;
  bindingCreated: false;
  evaluationPerformed: false;
  executable: false;
  canonEffect: "NONE";
}
export const BINDING_LIFECYCLE_DIMENSIONS: readonly BindingLifecycleDimension[] = [
  "creation", "identity", "visibility", "lifetime", "mutation", "freshness", "invalidation", "ownership"
] as const;
const isObject = (v: unknown): v is Record<string, unknown> => v !== null && typeof v === "object" && !Array.isArray(v);
export function reviewBindingLifecycleEvidence(input: unknown): BindingLifecycleReview {
  const dimensions = Object.fromEntries(BINDING_LIFECYCLE_DIMENSIONS.map(d => [d, "NOT-SUPPLIED"])) as BindingLifecycleReview["dimensions"];
  const findings: BindingLifecycleFinding[] = [];
  const invalid = (message: string): BindingLifecycleReview => ({
    profile: BINDING_LIFECYCLE_EVIDENCE_PROFILE, disposition: "INVALID", bindingLabel: "",
    dimensions, findings: [{ code: "INVALID-RECORD", dimension: "record", message }],
    grammarDefined: false, lifecycleTransitionsInferred: false, bindingCreated: false,
    evaluationPerformed: false, executable: false, canonEffect: "NONE"
  });
  if (!isObject(input) || input.profile !== BINDING_LIFECYCLE_EVIDENCE_PROFILE ||
      typeof input.bindingLabel !== "string" || !input.bindingLabel.trim() || !Array.isArray(input.claims)) {
    return invalid("Exact profile, non-empty binding label and claims array are required.");
  }
  const seen = new Set<string>();
  for (const [index, raw] of input.claims.entries()) {
    if (!isObject(raw) || !BINDING_LIFECYCLE_DIMENSIONS.includes(raw.dimension as BindingLifecycleDimension) ||
        !["ESTABLISHED", "UNRESOLVED", "CONFLICTING"].includes(String(raw.status)) ||
        !Array.isArray(raw.evidence) || raw.evidence.some(e => typeof e !== "string")) {
      findings.push({ code: "MALFORMED-CLAIM", dimension: "record", message: "Claim " + index + " must name a recognised dimension, status and evidence string array." });
      continue;
    }
    const dimension = raw.dimension as BindingLifecycleDimension;
    if (seen.has(dimension)) {
      findings.push({ code: "DUPLICATE-DIMENSION", dimension, message: "A lifecycle dimension must have one consolidated claim; conflicting duplicate claims are not silently merged." });
      continue;
    }
    seen.add(dimension);
    dimensions[dimension] = raw.status as BindingEvidenceStatus;
    if (raw.status === "ESTABLISHED" && (raw.evidence.length === 0 || raw.evidence.some(e => !e.trim()))) {
      findings.push({ code: "ESTABLISHMENT-WITHOUT-EVIDENCE", dimension, message: "An established claim requires at least one non-empty evidence reference." });
    }
    if (raw.status === "CONFLICTING") {
      findings.push({ code: "CONFLICT-DECLARED", dimension, message: "Conflicting evidence must be reconciled before this lifecycle dimension can be treated as established." });
    }
    if (raw.status === "UNRESOLVED") {
      findings.push({ code: "DIMENSION-UNRESOLVED", dimension, message: "This lifecycle dimension remains unresolved." });
    }
  }
  for (const dimension of BINDING_LIFECYCLE_DIMENSIONS) {
    if (!seen.has(dimension)) findings.push({ code: "DIMENSION-NOT-SUPPLIED", dimension, message: "No explicit lifecycle evidence claim was supplied for this dimension." });
  }
  const invalidRecord = findings.some(f => ["MALFORMED-CLAIM", "DUPLICATE-DIMENSION", "ESTABLISHMENT-WITHOUT-EVIDENCE"].includes(f.code));
  const conflicting = findings.some(f => f.code === "CONFLICT-DECLARED");
  const incomplete = findings.length > 0;
  return {
    profile: BINDING_LIFECYCLE_EVIDENCE_PROFILE,
    disposition: invalidRecord ? "INVALID" : conflicting ? "CONFLICTING" : incomplete ? "INCOMPLETE" : "EVIDENCE-COMPLETE-FOR-OWNER-REVIEW",
    bindingLabel: input.bindingLabel,
    dimensions, findings, grammarDefined: false, lifecycleTransitionsInferred: false,
    bindingCreated: false, evaluationPerformed: false, executable: false, canonEffect: "NONE"
  };
}
