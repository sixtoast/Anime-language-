import { describe, expect, it } from "vitest";
import policyProfileSpec from "../../docs/canon/arcane-incantations-v2.1-policy-profile-composition-and-conflict-resolution.md?raw";
import { parsePolicyProfileCompositionFixtures, policyProfileCompositionFixtures } from "./policyProfileCompositionFixtures";

describe("Arcane Incantations v2.1 policy-profile composition specification fixtures", () => {
  it("[POL21-TEST-001] reads all 60 fixture rows directly from the locked specification", () => {
    expect(policyProfileCompositionFixtures).toHaveLength(60);
    expect(policyProfileCompositionFixtures[0]?.id).toBe("POL21-01");
    expect(policyProfileCompositionFixtures.at(-1)?.id).toBe("POL21-60");
  });

  it("[POL21-TEST-002] preserves stable identities in exact sequence", () => {
    const ids = policyProfileCompositionFixtures.map((fixture) => fixture.id);
    expect(new Set(ids).size).toBe(60);
    expect(ids).toEqual(Array.from({ length: 60 }, (_, index) => "POL21-" + String(index + 1).padStart(2, "0")));
  });

  it("[POL21-TEST-003] distinguishes explicit denial from unresolved conflict", () => {
    expect(policyProfileCompositionFixtures.find((fixture) => fixture.id === "POL21-23")?.expectedOutcome).toContain("COMPOSED-DENY");
    expect(policyProfileCompositionFixtures.find((fixture) => fixture.id === "POL21-32")?.expectedOutcome).toContain("INDETERMINATE");
    expect(policyProfileCompositionFixtures.find((fixture) => fixture.id === "POL21-54")?.expectedOutcome).toContain("PROFILE-CONFLICT");
  });

  it("[POL21-TEST-004] preserves trust, version and availability blockers", () => {
    expect(policyProfileCompositionFixtures.find((fixture) => fixture.id === "POL21-12")?.expectedOutcome).toContain("COMPOSITION-ERROR");
    expect(policyProfileCompositionFixtures.find((fixture) => fixture.id === "POL21-17")?.expectedOutcome).toContain("PROFILE-UNTRUSTED");
    expect(policyProfileCompositionFixtures.find((fixture) => fixture.id === "POL21-19")?.expectedOutcome).toContain("PROFILE-UNAVAILABLE");
    expect(policyProfileCompositionFixtures.find((fixture) => fixture.id === "POL21-52")?.expectedOutcome).toContain("PROFILE-STALE");
  });

  it("[POL21-TEST-005] does not treat constraint intersection as authorisation", () => {
    expect(policyProfileCompositionFixtures.find((fixture) => fixture.id === "POL21-39")?.expectedOutcome).toContain("do not produce PERMIT");
    expect(policyProfileCompositionFixtures.find((fixture) => fixture.id === "POL21-45")?.expectedOutcome).toContain("Reject substitution");
  });

  it("[POL21-TEST-006] preserves independent consent, resource and execution gates", () => {
    expect(policyProfileCompositionFixtures.find((fixture) => fixture.id === "POL21-57")?.expectedOutcome).toContain("consent remains independent");
    expect(policyProfileCompositionFixtures.find((fixture) => fixture.id === "POL21-58")?.expectedOutcome).toContain("resource gate remains independent");
    expect(policyProfileCompositionFixtures.find((fixture) => fixture.id === "POL21-60")?.expectedOutcome).toContain("execution remains NOT-EXECUTED");
    expect(policyProfileSpec).toContain("No spoken Arcane syntax for policy profiles or policy composition is established");
  });

  it("[POL21-TEST-007] rejects missing or malformed fixture tables", () => {
    expect(() => parsePolicyProfileCompositionFixtures("# no table")).toThrow("table header not found");
    expect(() => parsePolicyProfileCompositionFixtures(policyProfileSpec.replace(
      "| POL21-01 | One trusted, current applicable profile under SINGLE-APPLICABLE returns PERMIT | COMPOSED-PERMIT |",
      "| POL21-01 | malformed |"
    ))).toThrow("Malformed policy-profile composition fixture row");
  });

  it("[POL21-TEST-008] rejects duplicate fixture identities", () => {
    const duplicate = policyProfileSpec.replace(
      "| POL21-02 | No profile applies and no fallback is configured | NO-APPLICABLE-PROFILE; block |",
      "| POL21-01 | No profile applies and no fallback is configured | NO-APPLICABLE-PROFILE; block |"
    );
    expect(() => parsePolicyProfileCompositionFixtures(duplicate)).toThrow("Duplicate policy-profile composition fixture ID");
  });

  it("[POL21-TEST-009] exposes source expectations without claiming a policy runtime", () => {
    expect(policyProfileSpec).toContain("not executed policy-engine tests");
    expect(policyProfileSpec).toContain("does not create an executable policy service");
    expect(policyProfileCompositionFixtures.every((fixture) => fixture.caseDescription.length > 0 && fixture.expectedOutcome.length > 0)).toBe(true);
  });
});
