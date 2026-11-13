import { describe, expect, it } from "vitest";
import { constructionStageContractProfiles, constructionStageContractProfileLimits, findConstructionStageContractProfile } from "./constructionStageContractProfiles";

describe("Construction stage contract profiles", () => {
  it("[CON-STAGE-001] profiles all seven performed stages", () => {
    expect(constructionStageContractProfiles.map(profile => profile.stage)).toEqual(["reference", "spatial-role-vector", "construction-feet", "couplings", "quantity", "control", "release"]);
  });
  it("[CON-STAGE-002] preserves reference scope distinctions", () => {
    const profile = findConstructionStageContractProfile("reference")!;
    expect(profile.recovered).toContain("MI / NI / RI use DEFAULT-VOLUME scope");
    expect(profile.recovered).toContain("me is described as SELF-SURFACE");
  });
  it("[CON-STAGE-003] records persistence without inventing reference syntax", () => {
    const profile = findConstructionStageContractProfile("reference")!;
    expect(profile.recovered.some(item => item.includes("UNTIL-REPLACED"))).toBe(true);
    expect(profile.unresolved).toContain("reference identity and identifier syntax");
  });
  it("[CON-STAGE-004] leaves historical spatial stage signatures open", () => {
    const profile = findConstructionStageContractProfile("spatial-role-vector")!;
    expect(profile.contractStatus).toBe("ORDER-BACKED-INTERNAL-CONTRACT-OPEN");
    expect(profile.bindingStatus).toContain("No source-backed rule");
  });
  it("[CON-STAGE-005] keeps v3.0-L spatial inventory version-separated", () => {
    const profile = findConstructionStageContractProfile("spatial-role-vector")!;
    expect(profile.versionBoundary).toContain("Arcane v3.0-L");
    expect(profile.versionBoundary).toContain("not proof");
  });
  it("[CON-STAGE-006] preserves the Foot coda discrepancy", () => {
    const profile = findConstructionStageContractProfile("construction-feet")!;
    expect(profile.recovered.some(item => item.startsWith("Phase 5.15 describes CVC"))).toBe(true);
    expect(profile.versionBoundary).toContain("optional relation coda");
  });
  it("[CON-STAGE-007] keeps coupling semantics provisional", () => {
    const profile = findConstructionStageContractProfile("couplings")!;
    expect(profile.contractStatus).toBe("GLOSS-AND-FAMILY-EVIDENCE-ONLY");
    expect(profile.unresolved).toContain("domain mapping is provisional");
  });
  it("[CON-STAGE-008] does not invent quantity semantics", () => {
    const profile = findConstructionStageContractProfile("quantity")!;
    expect(profile.contractStatus).toBe("ORDER-ONLY");
    expect(profile.inputOutputStatus).toContain("No Construction-specific syntax");
  });
  it("[CON-STAGE-009] does not assign VARE to control stage", () => {
    const profile = findConstructionStageContractProfile("control")!;
    expect(profile.bindingStatus).toContain("Do not attach VARE");
  });
  it("[CON-STAGE-010] keeps release evidence example-bounded", () => {
    const profile = findConstructionStageContractProfile("release")!;
    expect(profile.contractStatus).toBe("PARTIAL-EXAMPLE-ONLY");
    expect(profile.inputOutputStatus).toContain("not recovered");
  });
  it("[CON-STAGE-011] keeps profiles non-executable and rejects unknown lookups", () => {
    expect(constructionStageContractProfileLimits.executable).toBe(false);
    expect(constructionStageContractProfileLimits.canonEffect).toBe("NONE");
    expect(findConstructionStageContractProfile("unknown")).toBeNull();
    expect(findConstructionStageContractProfile(null)).toBeNull();
  });
});
