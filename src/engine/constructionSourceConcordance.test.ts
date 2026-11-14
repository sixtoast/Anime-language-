import {describe,expect,it} from "vitest";
import {constructionSourceArtifacts,constructionSourceClaims,constructionSourceConcordanceLimits,findConstructionSourceArtifact,findConstructionSourceClaim} from "./constructionSourceConcordance";
describe("Construction source concordance",()=>{
 it("[CON-SRC-001] distinguishes the original DOCX from its indexed text entry",()=>{expect(findConstructionSourceArtifact("phase4-docx")?.status).toBe("ORIGINAL-BINARY-PRESENT");expect(findConstructionSourceArtifact("phase4-docx")?.gitBlobSha).toBeTruthy();expect(findConstructionSourceArtifact("phase4-docx-index")?.status).toBe("INDEXED-TRANSCRIPTION")});
 it("[CON-SRC-002] preserves separate hashes and lengths for the two indexed transcriptions",()=>{const docx=findConstructionSourceArtifact("phase4-docx-index");const txt=findConstructionSourceArtifact("phase4-text-index");expect(docx?.contentSha256).not.toBe(txt?.contentSha256);expect(docx?.extractedCharacters).toBe(21121);expect(txt?.extractedCharacters).toBe(22019)});
 it("[CON-SRC-003] does not claim either transcription matches the loose DOCX",()=>{expect(constructionSourceArtifacts.filter(x=>x.status==="INDEXED-TRANSCRIPTION").every(x=>x.equivalenceToOriginal==="UNVERIFIED")).toBe(true)});
 it("[CON-SRC-004] keeps the CVC versus optional-coda conflict open",()=>{expect(findConstructionSourceClaim("FOOT-SHAPE")?.status).toBe("CONFLICT-OPEN")});
 it("[CON-SRC-005] preserves the six frame classes without inventing meanings",()=>{const c=findConstructionSourceClaim("FRAME-INVENTORY");expect(c?.status).toBe("SOURCE-BACKED-STRUCTURE");expect(c?.boundary).toContain("semantic contrast")});
 it("[CON-SRC-006] keeps parameter families provisional",()=>{expect(findConstructionSourceClaim("PARAMETER-FAMILIES")?.status).toBe("PROVISIONAL")});
 it("[CON-SRC-007] leaves coda inventory unresolved",()=>{expect(findConstructionSourceClaim("RELATION-CODAS")?.status).toBe("UNRECOVERED")});
 it("[CON-SRC-008] prevents H-series glosses becoming physical signatures",()=>{expect(findConstructionSourceClaim("H-COUPLINGS")?.boundary).toContain("signatures")});
 it("[CON-SRC-009] keeps macro and hand-flame evidence partial",()=>{expect(findConstructionSourceClaim("MACROS")?.status).toBe("PARTIAL-EXAMPLE");expect(findConstructionSourceClaim("HAND-FLAME")?.status).toBe("PARTIAL-EXAMPLE")});
 it("[CON-SRC-010] rejects unknown and non-string lookup IDs",()=>{expect(findConstructionSourceClaim("UNKNOWN")).toBeNull();expect(findConstructionSourceClaim(null)).toBeNull();expect(findConstructionSourceArtifact(4)).toBeNull()});
 it("[CON-SRC-011] remains non-executable and has no canon effect",()=>{expect(constructionSourceConcordanceLimits).toMatchObject({executable:false,canonEffect:"NONE",transcriptionEquivalence:"UNVERIFIED"})});
 it("[CON-SRC-012] exposes only the five explicitly recorded artifacts",()=>{expect(constructionSourceArtifacts).toHaveLength(5);expect(constructionSourceClaims).toHaveLength(7)});
});
