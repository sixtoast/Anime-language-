/**
 * Conservative v2.1 policy composition for the three bounded strategies
 * implemented here. This is a deterministic decision procedure over already
 * evaluated evidence; it does not discover profiles, validate cryptographic
 * trust, evaluate predicates, compare scopes, or execute policy rulesets.
 */
import type { AuthorityDecisionOutcome, CompositionOutcome } from "./incantationContractRecords";

export type CompositionStrategy =
  | "SINGLE-APPLICABLE"
  | "ALL-MUST-PERMIT"
  | "DENY-OVERRIDES";

export type ApplicabilityResult = "TRUE" | "FALSE" | "UNKNOWN" | "ERROR" | "INVALID";
export type ProfileTrustResult = "TRUSTED" | "UNTRUSTED" | "UNKNOWN";
export type ProfileFreshnessResult = "CURRENT" | "STALE" | "EXPIRED" | "UNAVAILABLE";

export interface PolicyProfileEvaluation {
  profileId: string;
  version: string;
  required: boolean;
  /** Optional profiles may be omitted on unknown applicability only when the plan explicitly allows it. */
  optionalOmissionExplicit: boolean;
  applicability: ApplicabilityResult;
  trust: ProfileTrustResult;
  freshness: ProfileFreshnessResult;
  decision: AuthorityDecisionOutcome;
  /** Required only when decision is CONDITIONAL-PERMIT. */
  conditionsSatisfied?: boolean;
}

export interface PolicyCompositionInput {
  strategy: CompositionStrategy;
  planTrust: ProfileTrustResult;
  planValid: boolean | "UNKNOWN";
  profiles: PolicyProfileEvaluation[];
}

export interface PolicyCompositionTraceEntry {
  profileId: string;
  version: string;
  stage: "APPLICABILITY" | "TRUST" | "FRESHNESS" | "DECISION";
  result: string;
  reason: string;
}

export interface PolicyCompositionResult {
  outcome: CompositionOutcome;
  blocking: boolean;
  strategy: CompositionStrategy;
  selectedProfileIds: string[];
  trace: PolicyCompositionTraceEntry[];
  limitations: string[];
}

const LIMITATIONS = [
  "Inputs are assumed to be the outputs of separately implemented evidence evaluators; this module does not validate their truth.",
  "A composed permit is only a candidate v2.0 authority outcome. This module does not execute an invocation or establish that an effect occurred. Scope, decision integrity, freshness, expiry, revocation, conditions and independent consent/resource/safety gates still require their own checks.",
  "No strategy other than SINGLE-APPLICABLE, ALL-MUST-PERMIT and DENY-OVERRIDES is executable in this implementation."
];

type ReportedStrategy = CompositionStrategy | "INVALID";

function result(
  strategy: ReportedStrategy,
  outcome: CompositionOutcome,
  selectedProfileIds: string[],
  trace: PolicyCompositionTraceEntry[]
): PolicyCompositionResult {
  return {
    outcome,
    blocking: outcome !== "COMPOSED-PERMIT",
    strategy: strategy === "INVALID" ? "ALL-MUST-PERMIT" : strategy,
    selectedProfileIds,
    trace,
    limitations: strategy === "INVALID"
      ? [...LIMITATIONS, "The reported strategy is a safe placeholder because the supplied strategy was invalid; no composition strategy was applied."]
      : [...LIMITATIONS]
  };
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return value !== null && typeof value === "object" && !Array.isArray(value);
}

function isCompositionStrategy(value: unknown): value is CompositionStrategy {
  return value === "SINGLE-APPLICABLE" || value === "ALL-MUST-PERMIT" || value === "DENY-OVERRIDES";
}

function isPolicyProfileEvaluation(value: unknown): value is PolicyProfileEvaluation {
  if (!isRecord(value)) return false;
  return typeof value.profileId === "string" && value.profileId.length > 0 && value.profileId.trim() === value.profileId &&
    typeof value.version === "string" && value.version.length > 0 && value.version.trim() === value.version &&
    typeof value.required === "boolean" &&
    typeof value.optionalOmissionExplicit === "boolean" &&
    (value.applicability === "TRUE" || value.applicability === "FALSE" || value.applicability === "UNKNOWN" ||
      value.applicability === "ERROR" || value.applicability === "INVALID") &&
    (value.trust === "TRUSTED" || value.trust === "UNTRUSTED" || value.trust === "UNKNOWN") &&
    (value.freshness === "CURRENT" || value.freshness === "STALE" || value.freshness === "EXPIRED" || value.freshness === "UNAVAILABLE") &&
    (value.decision === "PERMIT" || value.decision === "DENY" || value.decision === "CONDITIONAL-PERMIT" ||
      value.decision === "INDETERMINATE" || value.decision === "UNAVAILABLE" || value.decision === "EXPIRED" ||
      value.decision === "REVOKED" || value.decision === "SCOPE-MISMATCH" || value.decision === "ISSUER-UNTRUSTED" ||
      value.decision === "MALFORMED-DECISION") &&
    (value.conditionsSatisfied === undefined || typeof value.conditionsSatisfied === "boolean");
}

function invalidInputResult(input: unknown): PolicyCompositionResult {
  const suppliedStrategy = isRecord(input) ? input.strategy : undefined;
  return result(isCompositionStrategy(suppliedStrategy) ? suppliedStrategy : "INVALID", "COMPOSITION-ERROR", [], []);
}

function traceProfile(
  profile: PolicyProfileEvaluation,
  stage: PolicyCompositionTraceEntry["stage"],
  resultValue: string,
  reason: string
): PolicyCompositionTraceEntry {
  return { profileId: profile.profileId, version: profile.version, stage, result: resultValue, reason };
}

function mapDecisionBlocker(decision: AuthorityDecisionOutcome): CompositionOutcome {
  switch (decision) {
    case "UNAVAILABLE": return "PROFILE-UNAVAILABLE";
    case "ISSUER-UNTRUSTED": return "PROFILE-UNTRUSTED";
    case "EXPIRED": return "PROFILE-EXPIRED";
    case "PERMIT":
    case "DENY":
    case "CONDITIONAL-PERMIT":
    case "INDETERMINATE":
    case "REVOKED":
    case "SCOPE-MISMATCH":
    case "MALFORMED-DECISION":
      return "INDETERMINATE";
  }
}

export function evaluatePolicyComposition(input: PolicyCompositionInput): PolicyCompositionResult {
  if (!isRecord(input) || !isCompositionStrategy(input.strategy) ||
      (input.planTrust !== "TRUSTED" && input.planTrust !== "UNTRUSTED" && input.planTrust !== "UNKNOWN") ||
      (input.planValid !== true && input.planValid !== false && input.planValid !== "UNKNOWN") ||
      !Array.isArray(input.profiles) || !input.profiles.every(isPolicyProfileEvaluation)) {
    return invalidInputResult(input);
  }

  const trace: PolicyCompositionTraceEntry[] = [];
  const ids = input.profiles.map((profile) => profile.profileId);
  if (ids.some((id) => !id.trim()) || new Set(ids).size !== ids.length) {
    return result(input.strategy, "COMPOSITION-ERROR", [], trace);
  }

  if (input.planTrust === "UNTRUSTED") {
    return result(input.strategy, "PROFILE-UNTRUSTED", [], trace);
  }
  if (input.planTrust === "UNKNOWN" || input.planValid === "UNKNOWN") {
    return result(input.strategy, "INDETERMINATE", [], trace);
  }
  if (!input.planValid) return result(input.strategy, "COMPOSITION-ERROR", [], trace);

  const applicable: PolicyProfileEvaluation[] = [];
  let unresolvedApplicability = false;

  for (const profile of input.profiles) {
    trace.push(traceProfile(profile, "APPLICABILITY", profile.applicability,
      "Applicability is consumed as an evaluated predicate result; it is not recomputed here."));
    if (profile.applicability === "TRUE") {
      applicable.push(profile);
    } else if (profile.applicability === "UNKNOWN" || profile.applicability === "ERROR" ||
      profile.applicability === "INVALID") {
      if (profile.required || !profile.optionalOmissionExplicit) unresolvedApplicability = true;
    }
  }

  if (unresolvedApplicability) {
    return result(input.strategy, "INDETERMINATE", applicable.map((p) => p.profileId), trace);
  }

  if (input.strategy === "SINGLE-APPLICABLE") {
    if (applicable.length === 0) return result(input.strategy, "NO-APPLICABLE-PROFILE", [], trace);
    if (applicable.length > 1) {
      return result(input.strategy, "PROFILE-CONFLICT", applicable.map((p) => p.profileId), trace);
    }
  }

  if (applicable.length === 0) {
    return result(input.strategy, "NO-APPLICABLE-PROFILE", [], trace);
  }

  const usable: PolicyProfileEvaluation[] = [];
  let blocker: CompositionOutcome | undefined;

  for (const profile of applicable) {
    trace.push(traceProfile(profile, "TRUST", profile.trust,
      "A profile decision is considered only when the profile issuer and provenance are trusted."));
    if (profile.trust === "UNTRUSTED") {
      blocker = "PROFILE-UNTRUSTED";
      continue;
    }
    if (profile.trust === "UNKNOWN") {
      blocker ??= "INDETERMINATE";
      continue;
    }

    trace.push(traceProfile(profile, "FRESHNESS", profile.freshness,
      "A stale, expired or unavailable required profile cannot be silently omitted."));
    if (profile.freshness === "UNAVAILABLE") {
      blocker ??= "PROFILE-UNAVAILABLE";
      continue;
    }
    if (profile.freshness === "EXPIRED") {
      blocker ??= "PROFILE-EXPIRED";
      continue;
    }
    if (profile.freshness === "STALE") {
      blocker ??= "PROFILE-STALE";
      continue;
    }

    usable.push(profile);
  }

  // A trusted explicit denial is meaningful only for an applicable, current,
  // trusted profile. An untrusted profile cannot manufacture a denial.
  const explicitDenial = usable.find((profile) => profile.decision === "DENY");
  if (explicitDenial) {
    trace.push(traceProfile(explicitDenial, "DECISION", "DENY",
      "Trusted, applicable and current explicit denial blocks composition."));
    return result(input.strategy, "COMPOSED-DENY", applicable.map((p) => p.profileId), trace);
  }

  if (blocker) return result(input.strategy, blocker, applicable.map((p) => p.profileId), trace);

  for (const profile of usable) {
    trace.push(traceProfile(profile, "DECISION", profile.decision,
      "Profile decision is evaluated without collapsing uncertainty into denial or permission."));
    if (profile.decision === "CONDITIONAL-PERMIT" && profile.conditionsSatisfied !== true) {
      blocker ??= "INDETERMINATE";
      continue;
    }
    if (profile.decision !== "PERMIT" &&
        !(profile.decision === "CONDITIONAL-PERMIT" && profile.conditionsSatisfied === true)) {
      blocker ??= mapDecisionBlocker(profile.decision);
    }
  }

  if (blocker) return result(input.strategy, blocker, applicable.map((p) => p.profileId), trace);

  // SINGLE-APPLICABLE has already been constrained to exactly one profile.
  // Both multi-profile strategies require every applicable profile to permit.
  return result(input.strategy, "COMPOSED-PERMIT", applicable.map((p) => p.profileId), trace);
}
