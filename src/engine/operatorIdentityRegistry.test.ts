import { describe, expect, it } from "vitest";
import {
  getOperatorIdentity,
  listOperatorIdentities,
  resolveOperatorIdentity
} from "./operatorIdentityRegistry";

describe("versioned Formal Arcane operator identities", () => {
  it("[OP-ID-001] resolves unchanged operators in both documentary profiles", () => {
    expect(resolveOperatorIdentity("frapa", "v3.0-L")).toMatchObject({
      status: "RESOLVED", operatorId: "add", resolvedForm: "FRAPA", relationship: "PRIMARY"
    });
    expect(resolveOperatorIdentity("frapa", "phase4-renamed")).toMatchObject({
      status: "RESOLVED", operatorId: "add", resolvedForm: "FRAPA", relationship: "PRIMARY"
    });
  });

  it("[OP-ID-002] preserves the v3.0-L subtraction spelling as primary", () => {
    expect(resolveOperatorIdentity("frata", "v3.0-L")).toMatchObject({
      status: "RESOLVED", operatorId: "subtract", resolvedForm: "FRATA", relationship: "PRIMARY"
    });
  });

  it("[OP-ID-003] does not silently accept the Phase 4 preferred spelling in v3.0-L", () => {
    expect(resolveOperatorIdentity("fraja", "v3.0-L")).toMatchObject({
      status: "VERSION-NOT-LICENSED", licensedForm: "FRATA", operatorId: "subtract"
    });
  });

  it("[OP-ID-004] keeps historical spellings disabled by default in the Phase 4 profile", () => {
    expect(resolveOperatorIdentity("frata", "phase4-renamed")).toMatchObject({
      status: "ALIAS-DISABLED", preferredForm: "FRAJA", operatorId: "subtract"
    });
  });

  it("[OP-ID-005] resolves a historical spelling only when compatibility is explicitly enabled", () => {
    expect(resolveOperatorIdentity("frata", "phase4-renamed", {
      allowCompatibilityAliases: true
    })).toMatchObject({
      status: "RESOLVED",
      inputForm: "FRATA",
      resolvedForm: "FRAJA",
      operatorId: "subtract",
      relationship: "COMPATIBILITY-ALIAS"
    });
  });

  it("[OP-ID-006] resolves the full six renamed operator relationships", () => {
    const pairs = [
      ["FRATA", "FRAJA", "subtract"],
      ["FRAKA", "FRAMA", "multiply"],
      ["DRIM", "DRUM", "cross-product"],
      ["DRAL", "DRAS", "compare"],
      ["GRAK", "GRASH", "not"],
      ["KWAK", "KWASH", "live-evaluation"]
    ] as const;

    for (const [legacy, preferred, id] of pairs) {
      expect(resolveOperatorIdentity(preferred, "phase4-renamed")).toMatchObject({
        status: "RESOLVED", operatorId: id, resolvedForm: preferred, relationship: "PRIMARY"
      });
      expect(resolveOperatorIdentity(legacy, "phase4-renamed", {
        allowCompatibilityAliases: true
      })).toMatchObject({
        status: "RESOLVED", operatorId: id, resolvedForm: preferred, relationship: "COMPATIBILITY-ALIAS"
      });
    }
  });

  it("[OP-ID-007] keeps Construction macros separate from ordinary formal operators", () => {
    expect(resolveOperatorIdentity("kren", "phase4-renamed")).toMatchObject({
      status: "RESOLVED", operatorId: "establish", kind: "construction-macro",
      signatureStatus: "OPEN", auditArity: null
    });
    expect(resolveOperatorIdentity("kren", "v3.0-L")).toMatchObject({
      status: "VERSION-NOT-LICENSED", licensedForm: null
    });
  });

  it("[OP-ID-008] does not invent signatures for SIMA or Construction macros", () => {
    expect(getOperatorIdentity("measure")).toMatchObject({
      auditArity: null, signatureStatus: "OPEN"
    });
    expect(getOperatorIdentity("couple")).toMatchObject({
      auditArity: null, signatureStatus: "OPEN", kind: "construction-macro"
    });
  });

  it("[OP-ID-009] exposes the expected profile inventories without alias duplication", () => {
    const v3 = listOperatorIdentities("v3.0-L");
    const phase4 = listOperatorIdentities("phase4-renamed");
    expect(v3.some((item) => item.form === "FRATA")).toBe(true);
    expect(v3.some((item) => item.form === "FRAJA")).toBe(false);
    expect(phase4.some((item) => item.form === "FRAJA")).toBe(true);
    expect(phase4.some((item) => item.form === "FRATA")).toBe(false);
    expect(phase4.filter((item) => item.kind === "construction-macro")).toHaveLength(6);
  });

  it("[OP-ID-010] leaves unknown and non-operator spellings unresolved", () => {
    expect(resolveOperatorIdentity("kole", "phase4-renamed").status).toBe("UNKNOWN");
    expect(resolveOperatorIdentity("ben", "phase4-renamed").status).toBe("UNKNOWN");
    expect(resolveOperatorIdentity("weki", "phase4-renamed").status).toBe("UNKNOWN");
  });
});
