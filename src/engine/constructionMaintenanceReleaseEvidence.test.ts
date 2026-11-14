import { describe, expect, it } from "vitest";
import { maintenanceReleaseFixtureEvidence, reviewMaintenanceReleaseEvidence } from "./constructionMaintenanceReleaseEvidence";

describe("Phase 8CC maintenance and release evidence separation", () => {
  it("[CTRLREL-001] records KEN as a held-state fixture association", () => {
    const result = reviewMaintenanceReleaseEvidence("ken");
    expect(result.status).toBe("MAINTENANCE-ASSOCIATION-RECORDED");
    expect(result.evidence?.reading).toContain("held");
  });
  it("[CTRLREL-002] records KAS as a release fixture association", () => {
    const result = reviewMaintenanceReleaseEvidence("kas");
    expect(result.status).toBe("RELEASE-ASSOCIATION-RECORDED");
    expect(result.evidence?.reading).toBe("release");
  });
  it("[CTRLREL-003] keeps KEN distinct from a general control grammar", () => {
    expect(maintenanceReleaseFixtureEvidence.maintenance.durationRule).toBe("NOT-ESTABLISHED");
    expect(maintenanceReleaseFixtureEvidence.maintenance.maintenanceConditions).toBe("NOT-ESTABLISHED");
  });
  it("[CTRLREL-004] keeps KAS distinct from a general release grammar", () => {
    expect(maintenanceReleaseFixtureEvidence.release.releaseTarget).toBe("NOT-ESTABLISHED");
    expect(maintenanceReleaseFixtureEvidence.release.safetyConditions).toBe("NOT-ESTABLISHED");
  });
  it("[CTRLREL-005] preserves fixture surface order without causal inference", () => {
    expect(maintenanceReleaseFixtureEvidence.surfaceOrder).toEqual(["maintenance", "coupling", "duration", "release"]);
    expect(maintenanceReleaseFixtureEvidence.causalLifecycle).toBe("NOT-ESTABLISHED");
  });
  it("[CTRLREL-006] does not infer duration semantics from a separate quantity phrase", () => {
    expect(maintenanceReleaseFixtureEvidence.maintenance.durationRule).toBe("NOT-ESTABLISHED");
  });
  it("[CTRLREL-007] does not infer a safety or feasibility contract", () => {
    expect(maintenanceReleaseFixtureEvidence.release.safetyConditions).toBe("NOT-ESTABLISHED");
    expect(maintenanceReleaseFixtureEvidence.executable).toBe(false);
  });
  it("[CTRLREL-008] fails closed for unknown fixture tokens", () => {
    expect(reviewMaintenanceReleaseEvidence("kex").status).toBe("UNRECOGNISED");
    expect(reviewMaintenanceReleaseEvidence(" ").status).toBe("EMPTY");
  });
});
