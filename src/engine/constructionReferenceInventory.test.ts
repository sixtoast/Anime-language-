import { describe, expect, it } from "vitest";
import { constructionReferenceInventory, reviewConstructionReferenceInventory } from "./constructionReferenceInventory";

describe("Construction reference inventory and boundary evidence", () => {
  it("[CON-REF-INV-001] distinguishes formal MI from Performed mi", () => {
    expect(reviewConstructionReferenceInventory("MI").entry?.kind).toBe("FORMAL-BINDER-EVIDENCE");
    expect(reviewConstructionReferenceInventory("mi").entry?.kind).toBe("PERFORMED-INVENTORY-ONLY");
  });
  it("[CON-REF-INV-002] preserves formal scopes", () => {
    for (const form of ["MI", "NI", "RI"]) expect(reviewConstructionReferenceInventory(form).entry?.scope).toBe("DEFAULT-VOLUME");
    expect(reviewConstructionReferenceInventory("me").entry?.scope).toBe("SELF-SURFACE");
  });
  it("[CON-REF-INV-003] does not invent readings for inventory-only forms", () => {
    for (const form of ["mi", "ni", "ri", "ne", "rə", "ro", "ru"]) {
      const result = reviewConstructionReferenceInventory(form);
      expect(result.status).toBe("PERFORMED-INVENTORY-ONLY");
      expect(result.entry?.scope).toBeNull();
      expect(result.entry?.persistence).toBeNull();
    }
  });
  it("[CON-REF-INV-004] preserves partial re/ra readings and collisions", () => {
    expect(reviewConstructionReferenceInventory("re").entry?.scope).toBe("TARGET-surface");
    expect(reviewConstructionReferenceInventory("re").entry?.collision).toContain("digit 4");
    expect(reviewConstructionReferenceInventory("ra").entry?.scope).toBe("TARGET-path");
    expect(reviewConstructionReferenceInventory("ra").entry?.collision).toContain("radian");
  });
  it("[CON-REF-INV-005] keeps MEL at worked-example level", () => {
    expect(reviewConstructionReferenceInventory("mel").status).toBe("WORKED-EXAMPLE-ONLY");
    expect(reviewConstructionReferenceInventory("mel").entry?.description).toContain("anchor coda l");
  });
  it("[CON-REF-INV-006] preserves exact case and never creates bindings", () => {
    expect(reviewConstructionReferenceInventory("Mi").status).toBe("UNRECOGNISED");
    expect(constructionReferenceInventory.every(item => item.form.length > 0)).toBe(true);
    expect(reviewConstructionReferenceInventory("MI").createsBinding).toBe(false);
  });
  it("[CON-REF-INV-007] handles empty and unknown input", () => {
    expect(reviewConstructionReferenceInventory(" ").status).toBe("EMPTY");
    expect(reviewConstructionReferenceInventory("xyz").status).toBe("UNRECOGNISED");
  });
  it("[CON-REF-INV-008] does not claim clause parsing or productive anchor morphology", () => {
    expect(reviewConstructionReferenceInventory("re").entry?.limitation).toContain("whole-clause unique parsing");
    expect(reviewConstructionReferenceInventory("mel").entry?.limitation).toContain("productive anchor-coda paradigm");
  });
});
