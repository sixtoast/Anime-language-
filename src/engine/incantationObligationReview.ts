/**
 * Phase 8CQ — evidence-aware review of the seven semantic obligations in
 * Arcane Incantations v1.0.
 *
 * This is an abstract obligation ledger, not a spoken-syntax parser, semantic
 * validator, feasibility engine, authorisation gate, or spell executor.
 */
export const INCANTATION_OBLIGATION_PROFILE = "INCANTATION-OBLIGATIONS-1.0" as const;

export const INCANTATION_OBLIGATION_IDS = [
  "OPERATION",
  "TARGET-REFERENCE",
  "MECHANISM-COUPLING",
  "SPATIAL-ROLE",
  "CONSTRAINTS",
  "RESOURCE-FEASIBILITY",
  "OUTCOME"
] as const;

export type IncantationObligationId = typeof INCANTATION_OBLIGATION_IDS[number];
export type ObligationApplicability = "REQUIRED" | "NOT-APPLICABLE" | "UNRESOLVED";
export type ObligationResolution = "RESOLVED" | "UNRESOLVED";
export type ObligationEvidenceBasis = "EXPLICIT" | "VISIBLE-BINDING";

export interface IncantationObligationEntry {
  applicability: ObligationApplicability;
  resolution: ObligationResolution;
  evidenceRef?: string;
  basis?: ObligationEvidenceBasis;
  rationale?: string;
}

export type IncantationObligationSet = Record<IncantationObligationId, IncantationObligationEntry>;

export type IncantationObligationDisposition =
  | "OBLIGATIONS-ACCOUNTED-FOR"
  | "REQUIRED-OBLIGATION-UNRESOLVED"
  | "APPLICABILITY-UNRESOLVED"
  | "NOT-APPLICABLE-JUSTIFICATION-MISSING"
  | "INVALID-REVIEW-SHAPE";

export type IncantationObligationEntryStatus =
  | "SATISFIED-BY-EXPLICIT-EVIDENCE"
  | "SATISFIED-BY-VISIBLE-BINDING"
  | "JUSTIFIED-NOT-APPLICABLE"
  | "APPLICABILITY-UNRESOLVED"
  | "REQUIRED-EVIDENCE-UNRESOLVED"
  | "NOT-APPLICABLE-JUSTIFICATION-INCOMPLETE"
  | "INVALID-ENTRY";

export interface IncantationObligationResult {
  id: IncantationObligationId;
  status: IncantationObligationEntryStatus;
  applicability: ObligationApplicability | "MISSING";
  evidenceRef: string | null;
  explanation: string;
}

export interface IncantationObligationReview {
  profile: typeof INCANTATION_OBLIGATION_PROFILE;
  disposition: IncantationObligationDisposition;
  results: IncantationObligationResult[];
  issues: string[];
  obligationCount: number;
  accountedForCount: number;
  grammarValidation: "NOT-PERFORMED";
  semanticValidation: "NOT-PERFORMED";
  feasibility: "NOT-ASSESSED";
  authorisation: "NOT-ASSESSED";
  executable: false;
  canonEffect: "NONE";
  limitation: string;
}

const REQUIRED_ALWAYS: readonly IncantationObligationId[] = [
  "OPERATION", "TARGET-REFERENCE"
];

const LIMITATION =
  "This review checks whether each v1.0 semantic question has an explicit applicability decision and traceable evidence or rationale. It does not parse Arcane text, validate the truth or quality of evidence, infer a target, evaluate a mechanism, prove feasibility, satisfy later gates, or execute a spell. A complete obligation ledger is not a validated incantation.";

const isObject = (value: unknown): value is Record<string, unknown> =>
  value !== null && typeof value === "object" && !Array.isArray(value);

const nonEmpty = (value: unknown): value is string =>
  typeof value === "string" && value.trim().length > 0;

const isApplicability = (value: unknown): value is ObligationApplicability =>
  value === "REQUIRED" || value === "NOT-APPLICABLE" || value === "UNRESOLVED";

const isResolution = (value: unknown): value is ObligationResolution =>
  value === "RESOLVED" || value === "UNRESOLVED";

const isBasis = (value: unknown): value is ObligationEvidenceBasis =>
  value === "EXPLICIT" || value === "VISIBLE-BINDING";

function invalidReview(issues: string[]): IncantationObligationReview {
  return {
    profile: INCANTATION_OBLIGATION_PROFILE,
    disposition: "INVALID-REVIEW-SHAPE",
    results: [],
    issues,
    obligationCount: INCANTATION_OBLIGATION_IDS.length,
    accountedForCount: 0,
    grammarValidation: "NOT-PERFORMED",
    semanticValidation: "NOT-PERFORMED",
    feasibility: "NOT-ASSESSED",
    authorisation: "NOT-ASSESSED",
    executable: false,
    canonEffect: "NONE",
    limitation: LIMITATION
  };
}

/**
 * Reviews a declared obligation ledger. Missing or unresolved applicability
 * is never converted into NOT-APPLICABLE. The operation and target/reference
 * obligations cannot be marked irrelevant under the v1.0 core frame.
 */
export function reviewIncantationObligations(input: unknown): IncantationObligationReview {
  if (!isObject(input)) return invalidReview(["Review input must be an object."]);
  if (input.profile !== INCANTATION_OBLIGATION_PROFILE) {
    return invalidReview(["The exact INCANTATION-OBLIGATIONS-1.0 profile must be declared."]);
  }
  if (!isObject(input.obligations)) {
    return invalidReview(["The obligations field must be an object containing all seven obligation entries."]);
  }

  const suppliedKeys = Object.keys(input.obligations);
  const unexpected = suppliedKeys.filter((key) => !INCANTATION_OBLIGATION_IDS.includes(key as IncantationObligationId));
  if (unexpected.length > 0) {
    return invalidReview(["Unexpected obligation keys: " + unexpected.join(", ") + "."]);
  }

  const issues: string[] = [];
  const results: IncantationObligationResult[] = [];

  for (const id of INCANTATION_OBLIGATION_IDS) {
    const raw = input.obligations[id];
    if (!isObject(raw)) {
      issues.push(id + " is missing or is not an object.");
      results.push({
        id,
        status: "INVALID-ENTRY",
        applicability: "MISSING",
        evidenceRef: null,
        explanation: "Every obligation requires an explicit applicability declaration."
      });
      continue;
    }

    const applicability = raw.applicability;
    const resolution = raw.resolution;
    const evidenceRef = nonEmpty(raw.evidenceRef) ? raw.evidenceRef.trim() : null;
    const rationale = nonEmpty(raw.rationale) ? raw.rationale.trim() : null;
    const basis = raw.basis;

    if (!isApplicability(applicability) || !isResolution(resolution)) {
      issues.push(id + " has an invalid applicability or resolution value.");
      results.push({
        id,
        status: "INVALID-ENTRY",
        applicability: "MISSING",
        evidenceRef,
        explanation: "Applicability must be REQUIRED, NOT-APPLICABLE or UNRESOLVED; resolution must be RESOLVED or UNRESOLVED."
      });
      continue;
    }

    if (REQUIRED_ALWAYS.includes(id) && applicability !== "REQUIRED") {
      issues.push(id + " is mandatory in the v1.0 core frame and cannot be marked " + applicability + ".");
      results.push({
        id,
        status: "INVALID-ENTRY",
        applicability,
        evidenceRef,
        explanation: "Operation and target/reference cannot be silently omitted or declared irrelevant."
      });
      continue;
    }

    if (applicability === "UNRESOLVED") {
      issues.push(id + " applicability remains unresolved.");
      results.push({
        id,
        status: "APPLICABILITY-UNRESOLVED",
        applicability,
        evidenceRef,
        explanation: "The review cannot decide whether this obligation applies; it is not treated as not applicable."
      });
      continue;
    }

    if (applicability === "NOT-APPLICABLE") {
      if (resolution === "RESOLVED" && evidenceRef !== null && rationale !== null) {
        results.push({
          id,
          status: "JUSTIFIED-NOT-APPLICABLE",
          applicability,
          evidenceRef,
          explanation: "Non-applicability is explicitly justified and traceable; no value or syntax is invented."
        });
      } else {
        issues.push(id + " is marked not applicable without a resolved rationale and evidence reference.");
        results.push({
          id,
          status: "NOT-APPLICABLE-JUSTIFICATION-INCOMPLETE",
          applicability,
          evidenceRef,
          explanation: "NOT-APPLICABLE requires resolution RESOLVED, a non-empty rationale and an evidence reference."
        });
      }
      continue;
    }

    if (resolution === "RESOLVED" && evidenceRef !== null && isBasis(basis)) {
      results.push({
        id,
        status: basis === "EXPLICIT" ? "SATISFIED-BY-EXPLICIT-EVIDENCE" : "SATISFIED-BY-VISIBLE-BINDING",
        applicability,
        evidenceRef,
        explanation: basis === "EXPLICIT"
          ? "The required obligation is recorded as explicitly supplied with a traceable evidence reference."
          : "The required obligation is recorded as supplied by a separately visible binding with a traceable evidence reference."
      });
    } else {
      issues.push(id + " is required but its resolution, evidence reference or evidence basis is incomplete.");
      results.push({
        id,
        status: "REQUIRED-EVIDENCE-UNRESOLVED",
        applicability,
        evidenceRef,
        explanation: "A required obligation needs RESOLVED status, a non-empty evidence reference and an EXPLICIT or VISIBLE-BINDING basis."
      });
    }
  }

  const invalid = results.some((result) => result.status === "INVALID-ENTRY");
  const applicabilityUnresolved = results.some((result) => result.status === "APPLICABILITY-UNRESOLVED");
  const justificationIncomplete = results.some((result) => result.status === "NOT-APPLICABLE-JUSTIFICATION-INCOMPLETE");
  const requiredUnresolved = results.some((result) => result.status === "REQUIRED-EVIDENCE-UNRESOLVED");
  const accountedForCount = results.filter((result) =>
    result.status === "SATISFIED-BY-EXPLICIT-EVIDENCE" ||
    result.status === "SATISFIED-BY-VISIBLE-BINDING" ||
    result.status === "JUSTIFIED-NOT-APPLICABLE"
  ).length;

  const disposition: IncantationObligationDisposition = invalid
    ? "INVALID-REVIEW-SHAPE"
    : applicabilityUnresolved
      ? "APPLICABILITY-UNRESOLVED"
      : justificationIncomplete
        ? "NOT-APPLICABLE-JUSTIFICATION-MISSING"
        : requiredUnresolved || accountedForCount !== INCANTATION_OBLIGATION_IDS.length
          ? "REQUIRED-OBLIGATION-UNRESOLVED"
          : "OBLIGATIONS-ACCOUNTED-FOR";

  return {
    profile: INCANTATION_OBLIGATION_PROFILE,
    disposition,
    results,
    issues,
    obligationCount: INCANTATION_OBLIGATION_IDS.length,
    accountedForCount,
    grammarValidation: "NOT-PERFORMED",
    semanticValidation: "NOT-PERFORMED",
    feasibility: "NOT-ASSESSED",
    authorisation: "NOT-ASSESSED",
    executable: false,
    canonEffect: "NONE",
    limitation: LIMITATION
  };
}

export const incantationObligationReviewPrinciples = [
  "Operation and target/reference are mandatory obligations in the v1.0 core frame.",
  "Mechanism/coupling and spatial roles are conditional; their non-applicability must be explicit rather than guessed.",
  "Every obligation must have an explicit applicability decision; unresolved is not equivalent to not applicable.",
  "Required information may be explicit or supplied by a separately established and visible binding.",
  "A complete obligation ledger does not establish grammar validity, semantic truth, feasibility, authorisation, execution or success.",
  "The Incantation mechanism/coupling obligation is not automatically mapped to a Construction stage or H-series token."
] as const;
