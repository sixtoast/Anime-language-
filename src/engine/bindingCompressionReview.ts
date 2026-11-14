/**
 * Conservative review gate for proposed reuse of repeated Arcane expressions.
 *
 * This is a decision aid over caller-supplied evidence, not a binding evaluator,
 * semantic-equivalence engine, grammar, or canon rule.
 */
export const BINDING_COMPRESSION_REVIEW_PROFILE = "ARCANE-BINDING-COMPRESSION-REVIEW-1.0" as const;

export type EvidenceState = "ESTABLISHED" | "UNRESOLVED";
export type EvaluationMode = "SNAPSHOT" | "LIVE" | "UNKNOWN";
export type EffectState = "PURE" | "SIDE-EFFECTFUL" | "UNKNOWN";

export interface BindingReuseCandidate {
  occurrenceId: string;
  /** Supplied exact canonical expression identity; this module never computes it. */
  expressionFingerprint: string | null;
  valueType: string | null;
  evaluationMode: EvaluationMode;
  bindingScope: string | null;
  bindingLifetime: string | null;
  referentIdentity: string | null;
  effectState: EffectState;
  expressionIdentityEvidence: EvidenceState;
  typeEvidence: EvidenceState;
  scopeEvidence: EvidenceState;
  lifetimeEvidence: EvidenceState;
  referentEvidence: EvidenceState;
  effectEvidence: EvidenceState;
}

export interface BindingCompressionReviewInput {
  first: BindingReuseCandidate;
  second: BindingReuseCandidate;
}

export type BindingCompressionDisposition =
  | "ELIGIBLE-FOR-OWNER-REVIEW"
  | "PRESERVE-LIVE-EVALUATION"
  | "BLOCKED";

export interface BindingCompressionFinding {
  code: string;
  field: string;
  message: string;
}

export interface BindingCompressionReview {
  profile: typeof BINDING_COMPRESSION_REVIEW_PROFILE;
  disposition: BindingCompressionDisposition;
  suggestedOperator: "KWAT" | "KWAK" | "NONE";
  findings: BindingCompressionFinding[];
  semanticEquivalence: "NOT-COMPUTED";
  bindingCreated: false;
  evaluationPerformed: false;
  grammarChanged: false;
  executable: false;
  canonEffect: "NONE";
}

const unresolved = (candidate: BindingReuseCandidate, field: keyof BindingReuseCandidate): boolean =>
  candidate[field] === null || candidate[field] === "";

function add(findings: BindingCompressionFinding[], code: string, field: string, message: string): void {
  findings.push({ code, field, message });
}

export function reviewBindingCompression(input: BindingCompressionReviewInput): BindingCompressionReview {
  const findings: BindingCompressionFinding[] = [];
  const { first, second } = input;

  if (!first || !second || !first.occurrenceId || !second.occurrenceId || first.occurrenceId === second.occurrenceId) {
    add(findings, "OCCURRENCE-IDENTITY-INVALID", "occurrenceId", "Two distinct, named expression occurrences are required.");
  }

  const candidates = [first, second];
  for (const [index, candidate] of candidates.entries()) {
    const prefix = index === 0 ? "first." : "second.";
    for (const [field, evidenceField] of [
      ["expressionFingerprint", "expressionIdentityEvidence"],
      ["valueType", "typeEvidence"],
      ["bindingScope", "scopeEvidence"],
      ["bindingLifetime", "lifetimeEvidence"],
      ["referentIdentity", "referentEvidence"]
    ] as const) {
      if (unresolved(candidate, field) || candidate[evidenceField] !== "ESTABLISHED") {
        add(findings, "EVIDENCE-UNRESOLVED", prefix + field, field + " must be present and explicitly established before reuse can be considered.");
      }
    }
    if (candidate.effectState !== "PURE" || candidate.effectEvidence !== "ESTABLISHED") {
      add(findings, "EFFECT-SEMANTICS-UNRESOLVED", prefix + "effectState", "Expression effects must be established as pure; side-effectful or unknown expressions cannot be shared by this reviewer.");
    }
    if (candidate.evaluationMode === "UNKNOWN") {
      add(findings, "EVALUATION-MODE-UNKNOWN", prefix + "evaluationMode", "Snapshot and live evaluation must not be conflated.");
    }
  }

  if (first.evaluationMode === "LIVE" || second.evaluationMode === "LIVE") {
    if (first.evaluationMode !== second.evaluationMode) {
      add(findings, "EVALUATION-MODE-MISMATCH", "evaluationMode", "A live occurrence cannot be replaced by a stored snapshot, or vice versa.");
    }
    return {
      profile: BINDING_COMPRESSION_REVIEW_PROFILE,
      disposition: "PRESERVE-LIVE-EVALUATION",
      suggestedOperator: "KWAK",
      findings,
      semanticEquivalence: "NOT-COMPUTED",
      bindingCreated: false,
      evaluationPerformed: false,
      grammarChanged: false,
      executable: false,
      canonEffect: "NONE"
    };
  }

  if (first.expressionFingerprint !== second.expressionFingerprint) {
    add(findings, "EXPRESSION-IDENTITY-MISMATCH", "expressionFingerprint", "Different supplied expression identities are not candidates for shared binding.");
  }
  if (first.valueType !== second.valueType) {
    add(findings, "VALUE-TYPE-MISMATCH", "valueType", "A shared binding cannot be considered across different or unknown value types.");
  }
  if (first.bindingScope !== second.bindingScope) {
    add(findings, "SCOPE-MISMATCH", "bindingScope", "The two occurrences do not declare the same established binding scope.");
  }
  if (first.bindingLifetime !== second.bindingLifetime) {
    add(findings, "LIFETIME-MISMATCH", "bindingLifetime", "The two occurrences do not declare the same established binding lifetime.");
  }
  if (first.referentIdentity !== second.referentIdentity) {
    add(findings, "REFERENT-MISMATCH", "referentIdentity", "A matching expression spelling is insufficient when referent identity differs.");
  }

  const blocked = findings.length > 0 || first.evaluationMode !== "SNAPSHOT" || second.evaluationMode !== "SNAPSHOT";
  if (!blocked) {
    add(findings, "OWNER-REVIEW-REQUIRED", "bindingScope", "The supplied evidence is internally consistent, but owner approval and canonical binding syntax are still required before a KWAM/KWAT rewrite.");
  }

  return {
    profile: BINDING_COMPRESSION_REVIEW_PROFILE,
    disposition: blocked ? "BLOCKED" : "ELIGIBLE-FOR-OWNER-REVIEW",
    suggestedOperator: blocked ? "NONE" : "KWAT",
    findings,
    semanticEquivalence: "NOT-COMPUTED",
    bindingCreated: false,
    evaluationPerformed: false,
    grammarChanged: false,
    executable: false,
    canonEffect: "NONE"
  };
}
