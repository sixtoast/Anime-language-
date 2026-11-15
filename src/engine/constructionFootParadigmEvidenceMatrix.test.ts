import {describe,expect,it} from "vitest";
import {constructionFootParadigmCandidates as candidates,constructionFootParadigmSummary as summary,reviewConstructionFootParadigmCandidate as review} from "./constructionFootParadigmEvidenceMatrix";
describe("Phase 8CY-R/T Construction Foot design-space evidence",()=>{
 it("[FOOT-MATRIX-R-001] enumerates six frames × six vowels × five relation codas",()=>{expect(summary.frameCount).toBe(6);expect(summary.parameterVowelCount).toBe(6);expect(summary.relationCodaCount).toBe(5);expect(candidates).toHaveLength(180);expect(new Set(candidates.map(x=>x.form)).size).toBe(180)});
 it("[FOOT-MATRIX-R-002] preserves the exact frame inventory",()=>{expect([...new Set(candidates.map(x=>x.frame))]).toEqual(["p","b","t","d","k","g"])});
 it("[FOOT-MATRIX-R-003] preserves provisional parameter families",()=>{expect([...new Set(candidates.map(x=>x.parameterVowel))]).toEqual(["a","u","o","e","i","ə"]);expect(candidates.every(x=>x.parameterStatus==="PROVISIONAL")).toBe(true)});
 it("[FOOT-MATRIX-R-004] preserves the five source-backed relation codas",()=>{expect([...new Set(candidates.map(x=>x.relationCoda))]).toEqual(["m","n","ng","s","sh"])});
 it("maps m and n to FREM open-loop",()=>{expect(candidates.filter(x=>["m","n"].includes(x.relationCoda)).every(x=>x.relation==="FREM-OPEN-LOOP")).toBe(true)});
 it("maps ng to FREM feedback",()=>{expect(candidates.filter(x=>x.relationCoda==="ng").every(x=>x.relation==="FREM-FEEDBACK")).toBe(true)});
 it("maps s and sh to SHREN release",()=>{expect(candidates.filter(x=>["s","sh"].includes(x.relationCoda)).every(x=>x.relation==="SHREN-RELEASE")).toBe(true)});
 it("keeps TRAK p/t/k described and KREN b/d/g proposed",()=>{expect(summary.macroGroups.TRAK).toEqual(["p","t","k"]);expect(summary.macroGroups.KREN).toEqual(["b","d","g"]);expect(candidates.filter(x=>x.frameGroup==="KREN").every(x=>x.frameGroupEvidence==="PROPOSED-OWNER-CONFIRMATION")).toBe(true)});
 it("does not infer individual frame meanings",()=>{expect(candidates.every(x=>x.individualFrameMeaning==="UNRESOLVED")).toBe(true)});
 it("does not promote provisional parameter families to executable semantics",()=>{expect(summary.parameterFamiliesProvisional).toBe(true);expect(candidates.every(x=>x.physicalSemantics==="NOT-DEFINED")).toBe(true)});
 it("marks all candidates unattested and non-executable",()=>{expect(summary.allCandidatesUnattested).toBe(true);expect(summary.allCandidatesNonExecutable).toBe(true);expect(candidates.every(x=>x.evidenceStatus==="DESIGN-SPACE-ONLY")).toBe(true)});
 it("supports evidence-space lookup without lexical validation",()=>{expect(review("pang")?.form).toBe("pang");expect(review("pang")?.lexicalAttestation).toBe("NOT-RECOVERED");expect(review("pav")).toBeNull();expect(review(null)).toBeNull()});
 it("retains the CVC versus optional-coda discrepancy and canon neutrality",()=>{expect(summary.mandatoryCodaStatus).toBe("CVC-REQUIRED-PHASE4-PRIMARY-SOURCE");expect(summary.secondaryCodaConflict).toBe("P5.16-C02-CONTEXT-UNRESOLVED");expect(summary.canonEffect).toBe("NONE")});
});
