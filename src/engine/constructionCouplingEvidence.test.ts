import { describe, expect, it } from "vitest";
import { constructionCouplingEvidence, reviewConstructionCoupling } from "./constructionCouplingEvidence";
describe("Construction H-series coupling evidence", () => {
  it("[CON-COUP-001] records six H-series forms", () => expect(constructionCouplingEvidence.map(x => x.form)).toEqual(["hə", "he", "ha", "hu", "hi", "ho"]));
  it("[CON-COUP-002] records the mana gloss for hə", () => expect(reviewConstructionCoupling("hə").entry?.gloss).toBe("mana"));
  it("[CON-COUP-003] records the remaining five glosses", () => expect(constructionCouplingEvidence.slice(1).map(x => x.gloss)).toEqual(["matter", "energy", "living", "information", "field"]));
  it("[CON-COUP-004] marks all physical mappings provisional", () => expect(constructionCouplingEvidence.every(x => x.physicalMappingStatus === "PROVISIONAL")).toBe(true));
  it("[CON-COUP-005] never treats lookup as executable", () => expect(reviewConstructionCoupling("he").executable).toBe(false));
  it("[CON-COUP-006] leaves unknown forms unresolved", () => expect(reviewConstructionCoupling("hx").status).toBe("UNRECOGNISED"));
  it("[CON-COUP-007] treats blank input as empty", () => expect(reviewConstructionCoupling(" ").status).toBe("EMPTY"));
});
