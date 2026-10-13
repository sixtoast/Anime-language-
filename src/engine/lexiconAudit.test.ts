import { describe, expect, it } from "vitest";
import { bundledLexiconLoad } from "./bundledLexicon";
import { auditLoadedLexicon } from "./lexiconAudit";
import { loadLexiconCsvText } from "./lexiconCsvLoader";

describe("source lexicon audit report", () => {
  it("reports counts and known collisions without claiming canon approval", () => {
    const report = auditLoadedLexicon(bundledLexiconLoad);
    expect(report.acceptedRows).toBeGreaterThan(0);
    expect(report.acceptedForms).toBeGreaterThan(0);
    expect(report.collisionForms).toContain("re");
    expect(report.collisionForms).toContain("ra");
    expect(report.canonEffect).toBe("none");
  });

  it("blocks parser-experiment readiness when the CSV structure is malformed", () => {
    const loaded = loadLexiconCsvText(
      "form,gloss,cls,register,status,source,note\nza,0,DIGIT,Shared,CANON,v3.0-L,\nza,broken,extra",
      { sourceLabel: "malformed fixture", sourceVersion: "fixture" }
    );
    const report = auditLoadedLexicon(loaded);
    expect(report.readyForParserExperiment).toBe(false);
    expect(report.findings.some((finding) => finding.code === "CSV_STRUCTURE" && finding.severity === "error")).toBe(true);
  });

  it("flags aliases whose preferred target is absent from the accepted lexicon", () => {
    const loaded = loadLexiconCsvText(
      "form,gloss,cls,register,status,source,note\nza,0,DIGIT,Shared,CANON,v3.0-L,",
      {
        sourceLabel: "alias target fixture",
        sourceVersion: "fixture",
        aliasCsvText: "legacy_form,preferred_form,gloss,source_decision,compatibility_status,lexicon_status\nold,missing,example,D-TEST,preserve,proposed"
      }
    );
    const report = auditLoadedLexicon(loaded);
    expect(report.findings.some((finding) => finding.code === "ALIAS_TARGET_MISSING" && finding.form === "old")).toBe(true);
    expect(report.readyForParserExperiment).toBe(false);
  });
});
