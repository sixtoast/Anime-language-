/** Phase 8BG: boundary evidence from the exact Phase 5.22 hand-flame fixture.
 * This is deliberately not a general Construction clause parser.
 */
import { constructionFixtureParseTree, constructionFixtureProfile } from "./constructionParseTreeContract";

export interface ConstructionBoundaryEvidence {
  marker: string;
  observedRole: "FIXTURE-PHRASE-SEPARATOR";
  evidenceStatus: "EXACT-FIXTURE-ONLY";
  occurrences: number;
  separatesPhraseIndices: readonly number[];
  generalRuleEstablished: false;
  clauseSemanticsEstablished: false;
  source: string;
  limitation: string;
}

export const constructionBoundaryEvidence: ConstructionBoundaryEvidence = {
  marker: "·",
  observedRole: "FIXTURE-PHRASE-SEPARATOR",
  evidenceStatus: "EXACT-FIXTURE-ONLY",
  occurrences: 5,
  separatesPhraseIndices: [1, 2, 3, 4, 5],
  generalRuleEstablished: false,
  clauseSemanticsEstablished: false,
  source: "Phase 5.22 exact hand-flame parse-tree profile; surface recorded in Phase 4 §8 and Phase 5.15/5.16 recovery matrices",
  limitation: "The middle dot is required between the six phrases in this recovered fixture. Evidence does not establish that it is a universal spoken delimiter, a clause terminator, an optional punctuation mark, or a separator for arbitrary Construction expressions."
};

export interface ConstructionBoundaryAudit {
  accepted: boolean;
  phraseCount: number;
  markerCount: number;
  exactFixtureOnly: true;
  generalParser: false;
  reason: "EXACT-FIXTURE-BOUNDARIES" | "BOUNDARY-MISMATCH";
}

export function auditConstructionFixtureBoundaries(value: unknown): ConstructionBoundaryAudit {
  const accepted = typeof value === "string" && value.trim() === constructionFixtureProfile.exactSurface;
  return {
    accepted,
    phraseCount: accepted ? constructionFixtureParseTree.length : 0,
    markerCount: accepted ? constructionBoundaryEvidence.occurrences : 0,
    exactFixtureOnly: true,
    generalParser: false,
    reason: accepted ? "EXACT-FIXTURE-BOUNDARIES" : "BOUNDARY-MISMATCH"
  };
}
