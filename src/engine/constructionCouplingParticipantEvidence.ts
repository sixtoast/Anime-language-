/**
 * Phase 8CB — Coupling participant evidence boundary.
 *
 * A recorded H-series domain and a valid Construction reference can be
 * inspected together. Their co-presence does not prove that the reference
 * is a participant in a coupling operation. No participant-role grammar,
 * ordering, direction, cardinality or execution semantics are introduced.
 */
import { reviewConstructionCoupling } from "./constructionCouplingEvidence";
import { advanceConstructionReferenceContext } from "./constructionReferenceContext";

export type CouplingParticipantCandidateStatus =
  | "DOMAIN-AND-REFERENCE-RECORDED"
  | "DOMAIN-RECORDED-REFERENCE-UNBOUND"
  | "DOMAIN-RECORDED-REFERENCE-INVALID"
  | "DOMAIN-UNRECOGNISED"
  | "DOMAIN-EMPTY";

export interface CouplingParticipantCandidateReview {
  domainForm: string;
  status: CouplingParticipantCandidateStatus;
  domainGloss: string | null;
  referenceStatus: "BOUND" | "UNBOUND" | "UNRESOLVED";
  referenceToken: string | null;
  referenceId: string | null;
  participantRole: "NOT-ESTABLISHED";
  couplingRelation: "NOT-ESTABLISHED";
  directionality: "NOT-ESTABLISHED";
  executable: false;
  message: string;
}

export function reviewCouplingParticipantCandidate(
  domainForm: string,
  referenceBinding: unknown
): CouplingParticipantCandidateReview {
  const domain = reviewConstructionCoupling(domainForm);
  if (domain.status === "EMPTY") return {
    domainForm, status: "DOMAIN-EMPTY", domainGloss: null,
    referenceStatus: "UNRESOLVED", referenceToken: null, referenceId: null,
    participantRole: "NOT-ESTABLISHED", couplingRelation: "NOT-ESTABLISHED",
    directionality: "NOT-ESTABLISHED", executable: false,
    message: "A domain form is required. No participant or coupling semantics are inferred."
  };
  if (domain.status !== "GLOSS-RECORDED" || !domain.entry) return {
    domainForm, status: "DOMAIN-UNRECOGNISED", domainGloss: null,
    referenceStatus: "UNRESOLVED", referenceToken: null, referenceId: null,
    participantRole: "NOT-ESTABLISHED", couplingRelation: "NOT-ESTABLISHED",
    directionality: "NOT-ESTABLISHED", executable: false,
    message: "The domain form is not in the recovered H-series inventory."
  };

  const reference = advanceConstructionReferenceContext(referenceBinding, null);
  const valid = reference.status === "BOUND" && reference.current !== null;
  return {
    domainForm,
    status: valid ? "DOMAIN-AND-REFERENCE-RECORDED" :
      reference.status === "UNBOUND" ? "DOMAIN-RECORDED-REFERENCE-UNBOUND" :
      "DOMAIN-RECORDED-REFERENCE-INVALID",
    domainGloss: domain.entry.gloss,
    referenceStatus: reference.status,
    referenceToken: reference.current?.token ?? null,
    referenceId: reference.current?.referenceId ?? null,
    participantRole: "NOT-ESTABLISHED",
    couplingRelation: "NOT-ESTABLISHED",
    directionality: "NOT-ESTABLISHED",
    executable: false,
    message: valid
      ? "A domain gloss and valid Construction reference binding are both recorded. The source does not establish that this reference is a coupling participant or define its role, relation, order or direction."
      : "The domain gloss is recorded, but the reference is unbound or invalid. No coupling participant is established."
  };
}
