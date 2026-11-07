import { describe, expect, it } from "vitest";
import { parseSurfaceExpression } from "./surfaceParser";
import { reviewExpressionConstructionBridge, CONSTRUCTION_TARGET_SLOTS } from "./expressionConstructionBridge";

describe("expression-to-Construction boundary review", () => {
  it("[CON-BRIDGE-001] reports unavailable parsing without inventing source nodes", () => {
    const result = reviewExpressionConstructionBridge(parseSurfaceExpression(""));
    expect(result.status).toBe("PARSE-UNAVAILABLE");
    expect(result.sourceNodes).toEqual([]);
    expect(result.unmappedSlots).toEqual([...CONSTRUCTION_TARGET_SLOTS]);
    expect(result.executable).toBe(false);
  });

  it("[CON-BRIDGE-002] records AST structure while leaving every target slot unmapped", () => {
    const result = reviewExpressionConstructionBridge(parseSurfaceExpression("frapa ki sho to sho"));
    expect(result.status).toBe("MAPPING-NOT-SPECIFIED");
    expect(result.sourceNodes.map((node) => [node.path, node.kind])).toEqual([
      ["$", "call"], ["$.args[0]", "quantity"], ["$.args[1]", "quantity"]
    ]);
    expect(result.unmappedSlots).toEqual([...CONSTRUCTION_TARGET_SLOTS]);
  });

  it("[CON-BRIDGE-003] preserves nested call paths without treating operators as Construction macros", () => {
    const result = reviewExpressionConstructionBridge(parseSurfaceExpression("frapa frama ki sho to sho sa sho"));
    expect(result.sourceNodes.find((node) => node.path === "$.args[0]")).toMatchObject({ kind: "call", operator: "FRAMA" });
    expect(result.traceability).toEqual([]);
    expect(result.status).toBe("MAPPING-NOT-SPECIFIED");
  });

  it("[CON-BRIDGE-004] records a partial traceability entry as unverified and incomplete", () => {
    const parsed = parseSurfaceExpression("frapa ki sho to sho");
    const result = reviewExpressionConstructionBridge(parsed, [
      { targetSlot: "HEAD", sourcePath: "$", provenance: "review-note-01" }
    ]);
    expect(result.status).toBe("MAPPING-RECORD-INCOMPLETE");
    expect(result.traceability[0]).toMatchObject({ targetSlot: "HEAD", evidenceStatus: "USER-RECORDED-UNVERIFIED" });
    expect(result.unmappedSlots).toContain("CORE");
  });

  it("[CON-BRIDGE-005] rejects source paths that do not exist in the parsed AST", () => {
    const result = reviewExpressionConstructionBridge(parseSurfaceExpression("ki sho"), [
      { targetSlot: "HEAD", sourcePath: "$.args[9]", provenance: "review-note-02" }
    ]);
    expect(result.status).toBe("MAPPING-NOT-SPECIFIED");
    expect(result.diagnostics[0]?.code).toBe("UNKNOWN_SOURCE_PATH");
  });

  it("[CON-BRIDGE-006] requires provenance before accepting a traceability entry", () => {
    const result = reviewExpressionConstructionBridge(parseSurfaceExpression("ki sho"), [
      { targetSlot: "HEAD", sourcePath: "$", provenance: " " }
    ]);
    expect(result.status).toBe("MAPPING-NOT-SPECIFIED");
    expect(result.diagnostics[0]?.code).toBe("MISSING_PROVENANCE");
  });

  it("[CON-BRIDGE-007] rejects duplicate target-slot precedence rather than choosing silently", () => {
    const result = reviewExpressionConstructionBridge(parseSurfaceExpression("ki sho"), [
      { targetSlot: "HEAD", sourcePath: "$", provenance: "source-A" },
      { targetSlot: "HEAD", sourcePath: "$", provenance: "source-B" }
    ]);
    expect(result.status).toBe("MAPPING-RECORD-INCOMPLETE");
    expect(result.diagnostics.some((item) => item.code === "DUPLICATE_TARGET_SLOT")).toBe(true);
  });

  it("[CON-BRIDGE-008] records complete traceability without claiming semantic approval or execution", () => {
    const parsed = parseSurfaceExpression("ki sho");
    const records = CONSTRUCTION_TARGET_SLOTS.map((targetSlot) => ({
      targetSlot, sourcePath: "$", provenance: `owner-review:${targetSlot}`
    }));
    const result = reviewExpressionConstructionBridge(parsed, records);
    expect(result.status).toBe("TRACEABILITY-RECORDED");
    expect(result.traceability).toHaveLength(CONSTRUCTION_TARGET_SLOTS.length);
    expect(result.traceability.every((item) => item.evidenceStatus === "USER-RECORDED-UNVERIFIED")).toBe(true);
    expect(result.executable).toBe(false);
    expect(result.canonEffect).toBe("none");
  });

  it("[CON-BRIDGE-009] retains control blocks as source syntax without inferring CONTROL mapping", () => {
    const result = reviewExpressionConstructionBridge(parseSurfaceExpression("bek ki sho meto to sho dogu"));
    expect(result.sourceNodes.some((node) => node.kind === "block")).toBe(true);
    expect(result.unmappedSlots).toContain("CONTROL");
    expect(result.status).toBe("MAPPING-NOT-SPECIFIED");
  });
  it("[CON-BRIDGE-010] rejects unknown target slots instead of accepting extra contract fields", () => {
    const result = reviewExpressionConstructionBridge(parseSurfaceExpression("ki sho"), [
      { targetSlot: "EXECUTION" as never, sourcePath: "$", provenance: "owner-review" }
    ]);
    expect(result.status).toBe("MAPPING-RECORD-INCOMPLETE");
    expect(result.diagnostics[0]?.code).toBe("UNKNOWN_TARGET_SLOT");
  });
  it("[CON-BRIDGE-011] rejects null traceability entries without throwing", () => {
    const result = reviewExpressionConstructionBridge(parseSurfaceExpression("ki sho"), [null as never]);
    expect(result.status).toBe("MAPPING-RECORD-INCOMPLETE");
    expect(result.diagnostics[0]?.code).toBe("INVALID_TRACEABILITY_RECORD");
  });
  it("[CON-BRIDGE-012] rejects malformed parser result objects", () => {
    const result = reviewExpressionConstructionBridge(null as never);
    expect(result.status).toBe("PARSE-UNAVAILABLE");
    expect(result.diagnostics[0]?.code).toBe("INVALID_PARSE_RESULT");
  });
  it("[CON-BRIDGE-013] rejects malformed nested AST nodes", () => {
    const malformed = { ok: true, notation: "phase-6g-provisional", diagnostics: [], ast: { kind: "call", operator: "FRAPA", args: [null] } };
    const result = reviewExpressionConstructionBridge(malformed as never);
    expect(result.status).toBe("PARSE-UNAVAILABLE");
    expect(result.diagnostics[0]?.code).toBe("INVALID_PARSE_RESULT");
  });
  it("[CON-BRIDGE-014] requires traceability collections to be arrays", () => {
    const result = reviewExpressionConstructionBridge(parseSurfaceExpression("ki sho"), {} as never);
    expect(result.status).toBe("MAPPING-RECORD-INCOMPLETE");
    expect(result.diagnostics[0]?.code).toBe("INVALID_TRACEABILITY_RECORD");
  });
});
