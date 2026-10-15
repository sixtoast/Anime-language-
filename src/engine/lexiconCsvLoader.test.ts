import { describe, expect, it } from "vitest";
import { loadLexiconCsvText, parseCsvText } from "./lexiconCsvLoader";

const lexiconCsv = `form,gloss,cls,register,status,source,note
za,0,DIGIT,Shared,CANON,v3.0-L,
fraja,subtract,ARITH,Formal,RENAMED,v3.0-L,was frata
re,4,DIGIT,Shared,CANON,v3.0-L,
re,TARGET-surface,REF,Shared,CANON,v3.0-L,
ra,radian,UNIT,Shared,CANON,v3.0-L,
ra,TARGET-path,REF,Shared,CANON,v3.0-L,
"jo","toward, in relation to",SPREL,Formal,CANON,v3.0-L,
`;

const aliasesCsv = `legacy_form,preferred_form,gloss,source_decision,compatibility_status,lexicon_status
frata,fraja,subtract,D-032,preserve as alias,preferred row records old form
ren,ben,region,D-032,preserve as alias,preferred row records old form
`;

describe("lexicon CSV loader", () => {
  it("[CSV-001] parses quoted commas and CRLF records", () => {
    const parsed = parseCsvText('form,gloss\r\njo,"toward, in relation to"\r\n');
    expect(parsed.diagnostics).toEqual([]);
    expect(parsed.rows[0]).toMatchObject({ form: "jo", gloss: "toward, in relation to" });
  });

  it("[CSV-002] loads source rows and an explicit alias registry without auto-applying aliases", () => {
    const loaded = loadLexiconCsvText(lexiconCsv, {
      sourceLabel: "v5 source snapshot",
      sourceVersion: "v5-test",
      aliasCsvText: aliasesCsv
    });
    expect(loaded.sourceDiagnostics).toEqual([]);
    expect(loaded.rowCount).toBe(7);
    expect(loaded.aliasRowCount).toBe(2);
    expect(loaded.registry.entries.get("re")?.classes).toEqual(["DIGIT", "REF"]);
    expect(loaded.registry.entries.get("ra")?.classes).toEqual(["UNIT", "REF"]);
    expect(loaded.registry.aliases.get("frata")?.preferredForm).toBe("fraja");
  });

  it("[CSV-003] reports missing required headers rather than silently guessing column names", () => {
    const loaded = loadLexiconCsvText("word,meaning\nza,0\n", {
      sourceLabel: "broken fixture",
      sourceVersion: "fixture"
    });
    expect(loaded.rowCount).toBe(0);
    expect(loaded.sourceDiagnostics.join(" ")).toContain("missing required columns");
  });

  it("[CSV-004] rejects unterminated quoted CSV input", () => {
    const parsed = parseCsvText('form,gloss\njo,"unfinished');
    expect(parsed.rows).toEqual([]);
    expect(parsed.diagnostics[0]).toContain("inside a quoted field");
  });

  it("[CSV-006] loads all seven historical aliases from explicit CSV without enabling resolution", () => {
    const lexicon = `form,gloss,cls,register,status,source,note
fraja,subtract,ARITH,Formal,RENAMED,v3.0-L,was frata
frama,multiply,ARITH,Formal,RENAMED,v3.0-L,was fraka
drum,cross product,VEC,Formal,RENAMED,v3.0-L,was drim
dras,compare,COMP,Formal,RENAMED,v3.0-L,was dral
grash,Boolean NOT,LOGIC,Formal,RENAMED,v3.0-L,was grak
kwash,live evaluation,BIND,Formal,RENAMED,v3.0-L,was kwak
ben,region,GEOM,Formal,RENAMED,v3.0-L,was ren
`;
    const aliases = `legacy_form,preferred_form,gloss,source_decision,compatibility_status,lexicon_status
frata,fraja,subtract,D-032,preserve as alias,preferred row records old form
fraka,frama,multiply,D-032,preserve as alias,preferred row records old form
drim,drum,cross product,D-017,preserve as alias,preferred row records old form
dral,dras,compare,D-032,preserve as alias,preferred row records old form
grak,grash,Boolean NOT,D-032,preserve as alias,preferred row records old form
kwak,kwash,live evaluation,D-032,preserve as alias,preferred row records old form
ren,ben,region,D-032,preserve as alias,preferred row records old form
`;
    const loaded = loadLexiconCsvText(lexicon, {
      sourceLabel: "Phase 5.5 alias conformance fixture",
      sourceVersion: "historical-alias-test-v1",
      aliasCsvText: aliases
    });
    expect(loaded.sourceDiagnostics).toEqual([]);
    expect(loaded.aliasRowCount).toBe(7);
    expect(loaded.registry.aliases.size).toBe(7);
    expect(loaded.registry.aliases.get("frata")?.preferredForm).toBe("fraja");
    expect(loaded.registry.aliases.get("fraka")?.preferredForm).toBe("frama");
    expect(loaded.registry.aliases.get("drim")?.preferredForm).toBe("drum");
    expect(loaded.registry.aliases.get("dral")?.preferredForm).toBe("dras");
    expect(loaded.registry.aliases.get("grak")?.preferredForm).toBe("grash");
    expect(loaded.registry.aliases.get("kwak")?.preferredForm).toBe("kwash");
    expect(loaded.registry.aliases.get("ren")?.preferredForm).toBe("ben");
    expect(loaded.registry.aliases.has("frata")).toBe(true);
    expect(loaded.registry.entries.has("frata")).toBe(false);
  });

  it("[CSV-005] rejects rows whose cell count differs from the header", () => {
    const parsed = parseCsvText("form,gloss\nza,0,extra\n");
    expect(parsed.diagnostics[0]).toContain("expected 2");
  });
});
