import { describe, expect, it } from "vitest";
import { EXPRESSION_MODIFIER_BLOCK_PROFILE, expressionModifierBlockEvidence, reviewExpressionModifierBlocks } from "./expressionModifierBlockEvidence";

describe("Phase 8DG modifier attachment and block-scope evidence", () => {
  it("[EXPR-MOD-001] exposes a versioned evidence profile", () => expect(reviewExpressionModifierBlocks().profile).toBe(EXPRESSION_MODIFIER_BLOCK_PROFILE));
  it("[EXPR-MOD-002] records current head-argument-modifier order", () => expect(expressionModifierBlockEvidence.find(x=>x.id==="V3-HEAD-ARG-MOD")?.status).toBe("CURRENT-CANON-PRINCIPLE"));
  it("[EXPR-MOD-003] records nearest preceding same-level attachment historically", () => expect(expressionModifierBlockEvidence.find(x=>x.id==="P4-G4-ATTACH")?.claim).toContain("same block level"));
  it("[EXPR-MOD-004] preserves the five historical modifier classes", () => expect(reviewExpressionModifierBlocks().recoveredHistoricalRules[1]).toContain("five modifier classes"));
  it("[EXPR-MOD-005] records historical METO/DOGU delimiters", () => expect(expressionModifierBlockEvidence.find(x=>x.id==="P4-G5-DELIMITERS")?.status).toBe("HISTORICAL-GRAMMAR-RULE"));
  it("[EXPR-MOD-006] keeps performed prosody as historical evidence", () => expect(expressionModifierBlockEvidence.find(x=>x.id==="P4-G5-PROSODY")?.boundary).toContain("not evidence"));
  it("[EXPR-MOD-007] keeps one-clause delimiter omission version-scoped", () => expect(expressionModifierBlockEvidence.find(x=>x.id==="P4-G5-OMISSION")?.boundary).toContain("current applicability"));
  it("[EXPR-MOD-008] distinguishes historical condition operators", () => expect(reviewExpressionModifierBlocks().recoveredHistoricalRules[5]).toContain("IF, ONSET, WHILE and UNTIL"));
  it("[EXPR-MOD-009] preserves the current v3.0-L control inventory", () => expect(expressionModifierBlockEvidence.find(x=>x.id==="V3-CONTROL-INVENTORY")?.claim).toContain("BEK and ZET"));
  it("[EXPR-MOD-010] reports missing modifier AST node", () => expect(reviewExpressionModifierBlocks().implementationGaps[0]).toContain("no dedicated modifier"));
  it("[EXPR-MOD-011] keeps nested modifier scope unresolved", () => expect(expressionModifierBlockEvidence.find(x=>x.id==="NESTING-SCOPE")?.status).toBe("UNRESOLVED"));
  it("[EXPR-MOD-012] changes neither canon nor parser", () => {const r=reviewExpressionModifierBlocks();expect(r.canonEffect).toBe("NONE");expect(r.parserChanged).toBe(false);expect(r.executable).toBe(false);});
});
