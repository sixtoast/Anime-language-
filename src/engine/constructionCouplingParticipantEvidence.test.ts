import { describe, expect, it } from "vitest";
import { reviewCouplingParticipantCandidate } from "./constructionCouplingParticipantEvidence";

const validMatterReference = {
  token: "MI", referenceId: "matter-01",
  scope: "DEFAULT-VOLUME", persistence: "UNTIL-REPLACED"
};

describe("Phase 8CB coupling participant evidence boundary", () => {
  it("[COUP-PART-001] recognises a recorded H-series domain label", () => {
    const result = reviewCouplingParticipantCandidate("he", validMatterReference);
    expect(result.domainGloss).toBe("matter");
  });
  it("[COUP-PART-002] requires a valid Construction reference binding for a candidate record", () => {
    const result = reviewCouplingParticipantCandidate("he", validMatterReference);
    expect(result.referenceStatus).toBe("BOUND");
    expect(result.referenceId).toBe("matter-01");
  });
  it("[COUP-PART-003] keeps a bound domain candidate distinct from an established participant", () => {
    const result = reviewCouplingParticipantCandidate("he", validMatterReference);
    expect(result.status).toBe("DOMAIN-AND-REFERENCE-RECORDED");
    expect(result.participantRole).toBe("NOT-ESTABLISHED");
  });
  it("[COUP-PART-004] does not infer coupling direction or participant order", () => {
    const result = reviewCouplingParticipantCandidate("ha", validMatterReference);
    expect(result.couplingRelation).toBe("NOT-ESTABLISHED");
    expect(result.directionality).toBe("NOT-ESTABLISHED");
  });
  it("[COUP-PART-005] rejects an unknown H-series form", () => {
    expect(reviewCouplingParticipantCandidate("hx", validMatterReference).status).toBe("DOMAIN-UNRECOGNISED");
  });
  it("[COUP-PART-006] rejects malformed reference bindings", () => {
    expect(reviewCouplingParticipantCandidate("he", { ...validMatterReference, scope: "SELF-SURFACE" }).status).toBe("DOMAIN-RECORDED-REFERENCE-INVALID");
  });
  it("[COUP-PART-007] keeps unbound references explicitly unbound", () => {
    const result = reviewCouplingParticipantCandidate("he", null);
    expect(result.status).toBe("DOMAIN-RECORDED-REFERENCE-UNBOUND");
    expect(result.referenceStatus).toBe("UNBOUND");
  });
  it("[COUP-PART-008] never enables coupling execution", () => {
    expect(reviewCouplingParticipantCandidate("he", validMatterReference).executable).toBe(false);
  });
});
