import { describe, expect, it } from "vitest";
import { constructionSemanticRelationshipMap as map, reviewConstructionSemanticRelationship } from "./constructionSemanticRelationshipMap";

describe("Phase 8CK Construction semantic relationship map", () => {
  it("[SEM-CK-001] includes all six macros", () => expect(map.nodes.macros.map(x => x.id)).toEqual(["TRAK","KREN","FREM","SHREN","BRAN","VARE"]));
  it("[SEM-CK-002] distinguishes TRAK pattern from KREN proposal", () => {
    expect(map.relationships.find(x=>x.id==="TRAK-FRAMES")?.evidence).toBe("DESCRIBED-PATTERN");
    expect(map.relationships.find(x=>x.id==="KREN-FRAMES")?.evidence).toBe("PROPOSED-OWNER-CONFIRMATION");
  });
  it("[SEM-CK-003] preserves p/t/k and b/d/g frame sets", () => expect(map.nodes.frameGroups.map(x=>x.members)).toEqual([["p","t","k"],["b","d","g"]]));
  it("[SEM-CK-004] treats KEN as a whole-token fixture association", () => expect(map.relationships.find(x=>x.id==="FREM-KEN")?.kind).toBe("MACRO-TO-WHOLE-FIXTURE-TOKEN"));
  it("[SEM-CK-005] treats KAS as a partial fixture association", () => expect(map.relationships.find(x=>x.id==="SHREN-KAS")?.evidence).toBe("PARTIAL-FIXTURE-ASSOCIATION"));
  it("[SEM-CK-006] preserves TRAK ENRA alias boundary", () => expect(map.relationships.find(x=>x.id==="TRAK-KAN")?.boundary).toContain("does not define TRAK arity"));
  it("[SEM-CK-007] links BRAN to H-series only", () => expect(map.relationships.find(x=>x.id==="BRAN-H-SERIES")?.boundary).toContain("participants"));
  it("[SEM-CK-008] records six H-series glosses", () => expect(map.relationships.filter(x=>x.id.startsWith("H-"))).toHaveLength(6));
  it("[SEM-CK-009] retains provisional H-series physical mapping", () => expect(map.relationships.filter(x=>x.id.startsWith("H-")).every(x=>x.evidence==="GLOSS-RECORDED-PHYSICAL-MAPPING-PROVISIONAL")).toBe(true));
  it("[SEM-CK-010] records VARE's soft-requirement role", () => expect(map.relationships.find(x=>x.id==="VARE-REQUIRE")?.evidence).toBe("ROLE-DESCRIBED"));
  it("[SEM-CK-011] preserves MEL as worked-example reference", () => expect(map.relationships.find(x=>x.id==="MEL-REFERENCE")?.evidence).toBe("INVENTORY-ONLY"));
  it("[SEM-CK-012] does not infer macro-to-stage assignments", () => expect(map.contractClosure.stageAssignmentsRecovered).toBe(false));
  it("[SEM-CK-013] does not infer composition or Foot cardinality", () => {
    expect(map.contractClosure.macroCompositionRecovered).toBe(false);
    expect(map.nonRelationships.some(x=>x.to==="Foot cardinality")).toBe(true);
  });
  it("[SEM-CK-014] separates fixture order from causality", () => {
    expect(map.contractClosure.fixtureCausalLifecycle).toBe("NOT-ESTABLISHED");
    expect(map.contractClosure.fixtureOrder).toEqual(["maintenance","coupling","duration","release"]);
  });
  it("[SEM-CK-015] rejects unknown relationship queries", () => {
    expect(reviewConstructionSemanticRelationship("unknown")).toBeNull();
    expect(reviewConstructionSemanticRelationship("")).toBeNull();
  });
  it("[SEM-CK-016] remains non-executable and canon-neutral", () => {
    expect(map.executable).toBe(false);
    expect(map.canonEffect).toBe("NONE");
  });
});
