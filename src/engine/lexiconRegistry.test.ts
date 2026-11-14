import { describe, expect, it } from "vitest";
import {
  buildLexiconRegistry,
  inspectLexiconForm,
  resolveLexiconForm,
  type LexiconRow
} from "./lexiconRegistry";

const rows: LexiconRow[] = [
  { form: "fraja", gloss: "subtract", cls: "ARITH", status: "RENAMED", note: "was frata" },
  { form: "frama", gloss: "multiply", cls: "ARITH", status: "RENAMED", note: "was fraka" },
  { form: "drum", gloss: "cross", cls: "VEC", status: "RENAMED", note: "was drim" },
  { form: "re", gloss: "4", cls: "DIGIT", status: "CANON" },
  { form: "re", gloss: "TARGET-surface", cls: "REF", status: "CANON" },
  { form: "ra", gloss: "radian", cls: "UNIT", status: "CANON" },
  { form: "ra", gloss: "TARGET-path", cls: "REF", status: "CANON" },
  { form: "mi (formal)", gloss: "SELF", cls: "REF", status: "CANON" },
  { form: "s-", gloss: "IF (clitic form of bek)", cls: "CLITIC", status: "CANON" },
  { form: "ben", gloss: "region", cls: "GEOM", status: "RENAMED", note: "was ren" }
];

function registry(extraRows: LexiconRow[] = []) {
  return buildLexiconRegistry([...rows, ...extraRows], {
    sourceLabel: "test fixture",
    sourceVersion: "fixture-v1"
  });
}

describe("source-aware provisional lexicon registry", () => {
  it("[LEX-015] preserves source identity and grouped records", () => {
    const lexicon = registry();
    expect(lexicon.sourceLabel).toBe("test fixture");
    expect(lexicon.sourceVersion).toBe("fixture-v1");
    expect(lexicon.entries.get("fraja")).toMatchObject({
      form: "fraja",
      glosses: ["subtract"],
      classes: ["ARITH"],
      statuses: ["RENAMED"],
      rowCount: 1
    });
  });

  it("[LEX-016] preserves multiword references and clitic forms outside the atom inventory", () => {
    const lexicon = registry();
    expect(lexicon.nonAtomicEntries.get("mi (formal)")?.classes).toEqual(["REF"]);
    expect(lexicon.nonAtomicEntries.get("mi (formal)")?.glosses).toContain("SELF");
    expect(lexicon.nonAtomicEntries.has("s-")).toBe(true);
    expect(lexicon.entries.has("mi (formal)")).toBe(false);
    expect(lexicon.diagnostics.some((diagnostic) => diagnostic.code === "NON_ATOMIC_FORM")).toBe(true);
  });

  it("[LEX-017] extracts only the documented 'was <form>' alias pattern", () => {
    const lexicon = registry();
    expect(lexicon.aliases.get("frata")?.preferredForm).toBe("fraja");
    expect(lexicon.aliases.get("ren")?.preferredForm).toBe("ben");
    expect(lexicon.aliases.get("fraka")?.preferredForm).toBe("frama");
  });

  it("[LEX-018] does not apply historical aliases unless explicitly requested", () => {
    const lexicon = registry();
    expect(resolveLexiconForm(lexicon, "frata").resolvedForm).toBe("frata");
    expect(resolveLexiconForm(lexicon, "frata", { allowLegacyAliases: true }).resolvedForm).toBe("fraja");
  });

  it("[LEX-019] retains colliding lexical records rather than choosing a meaning", () => {
    const lexicon = registry();
    expect(inspectLexiconForm(lexicon, "re")).toMatchObject({
      isCollision: true,
      needsContextualDisambiguation: true,
      entry: { glosses: ["4", "TARGET-surface"], classes: ["DIGIT", "REF"] }
    });
    expect(inspectLexiconForm(lexicon, "ra").isCollision).toBe(true);
  });

  it("[LEX-020] does not register an alias with conflicting preferred forms", () => {
    const lexicon = registry([
      { form: "frob", gloss: "one", cls: "ARITH", note: "was legacy" },
      { form: "frub", gloss: "two", cls: "ARITH", note: "was legacy" }
    ]);
    expect(lexicon.aliases.has("legacy")).toBe(false);
    expect(lexicon.diagnostics.some((diagnostic) => diagnostic.code === "CONFLICTING_ALIAS_TARGETS")).toBe(true);
  });

  it("[LEX-021] can merge explicit alias evidence with source-note evidence", () => {
    const lexicon = buildLexiconRegistry(rows, {
      sourceLabel: "test fixture",
      sourceVersion: "fixture-v1",
      explicitAliases: [{ legacyForm: "ren", preferredForm: "ben", evidence: "Phase 5.5 alias registry" }]
    });
    expect(lexicon.aliases.get("ren")?.preferredForm).toBe("ben");
    expect(lexicon.aliases.get("ren")?.evidence).toContain("Phase 5.5 alias registry");
  });
});
