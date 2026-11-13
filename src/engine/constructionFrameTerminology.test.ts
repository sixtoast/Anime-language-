import { describe, expect, it } from "vitest";
import { constructionFrameTerminology } from "./constructionFrameTerminology";
describe("Construction frame terminology boundaries", () => {
 it("keeps Foot consonant classes distinct from coordinate frames", () => {
  const foot=constructionFrameTerminology.find(x=>x.id==="FOOT-CONSONANT-CLASS")!;
  const vector=constructionFrameTerminology.find(x=>x.id==="VECTOR-COORDINATE-FRAME")!;
  expect(foot.semanticRelationToFoot).toBe("UNRESOLVED");
  expect(vector.semanticRelationToFoot).toBe("DISTINCT-SUBSYSTEM");
  expect(foot.description).toContain("p, b, t, d, k and g");
  expect(vector.description).toContain("world, caster and local");
 });
 it("does not import handedness as a Foot semantic contrast", () => {
  const transforms=constructionFrameTerminology.find(x=>x.id==="FRAME-TRANSFORM-AUDIT")!;
  expect(transforms.semanticRelationToFoot).toBe("DISTINCT-SUBSYSTEM");
  expect(transforms.description).toContain("does not define Foot consonant meanings");
 });
 it("retains all three separately identified frame concepts", () => {
  expect(constructionFrameTerminology.map(x=>x.id)).toEqual(["FOOT-CONSONANT-CLASS","VECTOR-COORDINATE-FRAME","FRAME-TRANSFORM-AUDIT"]);
 });
});
