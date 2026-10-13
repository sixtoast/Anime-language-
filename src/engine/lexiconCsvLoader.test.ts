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
  it("parses quoted commas and CRLF records", () => {
    const parsed = parseCsvText('form,gloss\r\njo,"toward, in relation to"\r\n');
    expect(parsed.diagnostics).toEqual([]);
    expect(parsed.rows[0]).toMatchObject({ form: "jo", gloss: "toward, in relation to" });
  });

  it("loads source rows and an explicit alias registry without auto-applying aliases", () => {
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

  it("reports missing required headers rather than silently guessing column names", () => {
    const loaded = loadLexiconCsvText("word,meaning\nza,0\n", {
      sourceLabel: "broken fixture",
      sourceVersion: "fixture"
    });
    expect(loaded.rowCount).toBe(0);
    expect(loaded.sourceDiagnostics.join(" ")).toContain("missing required columns");
  });

  it("rejects unterminated quoted CSV input", () => {
    const parsed = parseCsvText('form,gloss\njo,"unfinished');
    expect(parsed.rows).toEqual([]);
    expect(parsed.diagnostics[0]).toContain("inside a quoted field");
  });

  it("rejects rows whose cell count differs from the header", () => {
    const parsed = parseCsvText("form,gloss\nza,0,extra\n");
    expect(parsed.diagnostics[0]).toContain("expected 2");
  });
});
