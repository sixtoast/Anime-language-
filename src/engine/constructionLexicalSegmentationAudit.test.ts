import {describe,expect,it} from "vitest";
import {constructionLexicalSegmentationAudit,reviewConstructionLexicalOccurrence} from "./constructionLexicalSegmentationAudit";
describe("Phase 8CH Construction lexical segmentation audit",()=>{
 const audit=constructionLexicalSegmentationAudit;
 it("[LEX-CH-001] preserves the exact hand-flame surface",()=>{expect(audit.exactSurface).toBe("mel · po da za shi to za ma · kan ken · he ha · sa shi za se · kas")});
 it("[LEX-CH-002] records six phrases and seventeen token occurrences",()=>{expect(audit.summary.phraseCount).toBe(6);expect(audit.summary.occurrenceCount).toBe(17)});
 it("[LEX-CH-003] records fourteen distinct surface spellings",()=>{expect(audit.summary.uniqueSurfaceCount).toBe(14)});
 it("[LEX-CH-004] retains kan ken kas as whole example tokens",()=>{expect(["kan","ken","kas"].every(token=>audit.occurrences.find(item=>item.surface===token)?.footStatus==="WHOLE-EXAMPLE-TOKEN")).toBe(true)});
 it("[LEX-CH-005] does not segment whole example tokens",()=>{expect(audit.morphology.wholeExampleTokensMayBeDecomposed).toBe(false)});
 it("[LEX-CH-006] recognises he and ha as H-series surface forms",()=>{expect(["he","ha"].every(token=>audit.occurrences.find(item=>item.surface===token)?.evidenceClass==="H-SERIES-COUPLING-FORM")).toBe(true)});
 it("[LEX-CH-007] records da surface overlap without merging identities",()=>{expect(audit.inventoryOverlap.daCollision.tokenIdentity).toBe("NOT-ESTABLISHED");expect(audit.occurrences.find(item=>item.surface==="da")?.evidenceClass).toBe("SURFACE-OVERLAP-IDENTITY-UNRESOLVED")});
 it("[LEX-CH-008] finds no exact operational macro spelling in the fixture",()=>{expect(audit.inventoryOverlap.exactMacroSpellingsInFixture).toEqual([]);expect(audit.summary.macroTokenOccurrenceCount).toBe(0)});
 it("[LEX-CH-009] keeps quantity phrase tokens fixture-local",()=>{expect(audit.occurrences.filter(item=>item.phraseIndex===2&&item.surface!=="po"&&item.surface!=="da").every(item=>item.evidenceClass==="FIXTURE-QUANTITY-PHRASE-UNIT")).toBe(true)});
 it("[LEX-CH-010] keeps duration phrase token readings unresolved",()=>{expect(audit.occurrences.filter(item=>item.phraseIndex===5).every(item=>item.evidenceClass==="FIXTURE-DURATION-PHRASE-UNIT")).toBe(true)});
 it("[LEX-CH-011] does not infer productive Foot morphology",()=>{expect(Object.values(audit.morphology).every(value=>value===false)).toBe(true)});
 it("[LEX-CH-012] occurrence lookup is exact and fixture-bounded",()=>{expect(reviewConstructionLexicalOccurrence("kan")?.occurrences).toHaveLength(1);expect(reviewConstructionLexicalOccurrence("KAN")?.identityStatus).toBe("SOURCE-RECORDED");expect(reviewConstructionLexicalOccurrence("unknown")).toBeNull()});
 it("[LEX-CH-013] can distinguish repeated token occurrences by phrase",()=>{expect(reviewConstructionLexicalOccurrence("za")?.occurrences).toHaveLength(2);expect(reviewConstructionLexicalOccurrence("za",2)?.occurrences).toHaveLength(2)});
 it("[LEX-CH-014] keeps audit non-executable and canon-neutral",()=>{expect(audit.executable).toBe(false);expect(audit.canonEffect).toBe("NONE")});
});
