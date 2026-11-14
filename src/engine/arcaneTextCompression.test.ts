
import{describe,it,expect}from"vitest";
import{compressArcaneText,expandArcaneText}from"./arcaneTextCompression";
describe("reversible Arcane text compression",()=>{
it("[ARC-COMP-001] shortens repeated long tokens while preserving whitespace",()=>{const s="kan   ken\nkan";const r=compressArcaneText(s,[{fullForm:"kan",shortForm:"~K"}]);expect(r.disposition).toBe("COMPRESSED");expect(r.compressedText).toBe("~K   ken\n~K");expect(r.exactRoundTrip).toBe(true)});
it("[ARC-COMP-002] restores the exact source text",()=>{const s="mel · po da za shi to za ma · kas";const c=compressArcaneText(s,[{fullForm:"za",shortForm:"~Z"}]);const e=expandArcaneText(c.compressedText,c.aliases);expect(e.ok).toBe(true);expect(e.text).toBe(s)});
it("[ARC-COMP-003] does not alter punctuation or whitespace",()=>{const s="alpha,  beta.\nalpha,";const r=compressArcaneText(s,[{fullForm:"alpha,",shortForm:"~A"}]);expect(r.compressedText).toBe("~A  beta.\n~A");expect(expandArcaneText(r.compressedText,r.aliases).text).toBe(s)});
it("[ARC-COMP-004] refuses a short-form collision already in source",()=>expect(compressArcaneText("kan ~K",[{fullForm:"kan",shortForm:"~K"}]).disposition).toBe("INVALID-DICTIONARY"));
it("[ARC-COMP-005] rejects duplicate aliases",()=>expect(compressArcaneText("alpha beta",[{fullForm:"alpha",shortForm:"~A"},{fullForm:"alpha",shortForm:"~B"}]).issues.length).toBeGreaterThan(0));
it("[ARC-COMP-006] rejects ambiguous duplicate short forms",()=>expect(compressArcaneText("alpha beta",[{fullForm:"alpha",shortForm:"~X"},{fullForm:"beta",shortForm:"~X"}]).disposition).toBe("INVALID-DICTIONARY"));
it("[ARC-COMP-007] rejects alias chains",()=>expect(compressArcaneText("alpha beta",[{fullForm:"alpha",shortForm:"beta"}]).issues.some(x=>x.includes("chains"))).toBe(true));
it("[ARC-COMP-008] reports no saving when alias is not used",()=>expect(compressArcaneText("alpha",[{fullForm:"beta",shortForm:"~B"}]).disposition).toBe("NO-SAVING"));
it("[ARC-COMP-009] reports no saving when alias is longer",()=>expect(compressArcaneText("a a",[{fullForm:"a",shortForm:"~LONG"}]).disposition).toBe("NO-SAVING"));
it("[ARC-COMP-010] rejects unknown reserved tokens on expansion",()=>expect(expandArcaneText("~UNKNOWN",[{fullForm:"kan",shortForm:"~K"}]).ok).toBe(false));
it("[ARC-COMP-011] rejects malformed dictionaries",()=>expect(compressArcaneText("alpha",[{fullForm:"two words",shortForm:"~T"}]).disposition).toBe("INVALID-DICTIONARY"));
it("[ARC-COMP-012] marks expansion as mandatory before parsing",()=>expect(compressArcaneText("kan",[{fullForm:"kan",shortForm:"~K"}]).parserInput).toBe("EXPAND-BEFORE-PARSING"));
it("[ARC-COMP-013] keeps canon and execution disabled",()=>{const r=compressArcaneText("kan",[{fullForm:"kan",shortForm:"~K"}]);expect(r.executable).toBe(false);expect(r.canonEffect).toBe("NONE")});
});
