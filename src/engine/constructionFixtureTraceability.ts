export type FixturePhraseInterpretationStatus =
  | "SURFACE-RECORDED"
  | "PARTIAL-INTERPRETATION"
  | "INTERPRETATION-RECORDED"
  | "UNRESOLVED";

export interface ConstructionFixturePhraseEvidence {
  phraseIndex: number;
  surface: string;
  interpretationStatus: FixturePhraseInterpretationStatus;
  evidenceReferences: readonly string[];
  recordedClaims: readonly string[];
  unresolved: readonly string[];
}
export interface ConstructionFixtureTraceabilityProfile {
  id: string;
  version: string;
  source: string;
  exactSurface: string;
  phrases: readonly ConstructionFixturePhraseEvidence[];
  stageMapping: "NOT-ESTABLISHED";
  grammarValidity: "NOT-ASSESSED";
  executable: false;
  canonEffect: "NONE";
}

const handFlameSurface = "mel · po da za shi to za ma · kan ken · he ha · sa shi za se · kas";

/**
 * Exact phrase groups are local to this documented fixture. The phrase list is
 * not a general delimiter parser and does not map phrases to Construction stages.
 */
export const handFlameFixtureTraceability: ConstructionFixtureTraceabilityProfile = {
  id: "PHASE-5.22-HAND-FLAME",
  version: "PHASE-5.22-FIXTURE",
  source: "Phase 5.22 hand-flame parse tree and fixture-local role/axis/digit/unit/FEET tables",
  exactSurface: handFlameSurface,
  phrases: [
    {
      phraseIndex: 1, surface: "mel",
      interpretationStatus: "PARTIAL-INTERPRETATION",
      evidenceReferences: ["Phase 5.15 anchor analysis", "Phase 5.22 fixture parse tree"],
      recordedClaims: ["The fixture identifies mel as its anchor token."],
      unresolved: ["General reference-token status", "Full anchor morphology and binding contract"]
    },
    {
      phraseIndex: 2, surface: "po da za shi to za ma",
      interpretationStatus: "INTERPRETATION-RECORDED",
      evidenceReferences: ["Phase 5.22 fixture-local role/axis/digit/unit tables"],
      recordedClaims: ["po is read as position in this fixture.", "da is read as +Y in this fixture.", "za shi to za ma is read as 0.2 metre in this fixture."],
      unresolved: ["Coordinate frame", "Origin", "General spatial syntax", "Quantity attachment and unit conversion"]
    },
    {
      phraseIndex: 3, surface: "kan ken",
      interpretationStatus: "PARTIAL-INTERPRETATION",
      evidenceReferences: ["Phase 5.22 FEET table"],
      recordedClaims: ["KAN and KEN are retained as whole example tokens.", "KEN is associated with a held-energy state in the example."],
      unresolved: ["KAN rule", "Token segmentation", "General macro or Foot signatures"]
    },
    {
      phraseIndex: 4, surface: "he ha",
      interpretationStatus: "PARTIAL-INTERPRETATION",
      evidenceReferences: ["Phase 5.15/5.16 H-series evidence", "Phase 5.22 worked example"],
      recordedClaims: ["he and ha are recorded as H-series heavy coupling forms.", "Matter/energy readings remain provisional."],
      unresolved: ["Participant order", "Direction", "Argument signatures", "Physical coupling semantics"]
    },
    {
      phraseIndex: 5, surface: "sa shi za se",
      interpretationStatus: "UNRESOLVED",
      evidenceReferences: ["Phase 5.22 exact hand-flame fixture"],
      recordedClaims: [],
      unresolved: ["Phrase interpretation", "Whether it realises a Control stage", "Any stage assignment"]
    },
    {
      phraseIndex: 6, surface: "kas",
      interpretationStatus: "PARTIAL-INTERPRETATION",
      evidenceReferences: ["Phase 5.22 FEET table"],
      recordedClaims: ["KAS is associated with release in this example and remains a whole token."],
      unresolved: ["General release grammar", "Token segmentation", "Release contract and failure behaviour"]
    }
  ],
  stageMapping: "NOT-ESTABLISHED",
  grammarValidity: "NOT-ASSESSED",
  executable: false,
  canonEffect: "NONE"
};

export interface ConstructionCrossVersionSurfaceComparison {
  leftProfile: string;
  rightProfile: string;
  leftSurface: string;
  rightSurface: string;
  surfaceRelation: "EXACT-SURFACE-MATCH" | "DIFFERENT-SURFACE";
  tokenIdentity: "NOT-ESTABLISHED";
  semanticEquivalence: "NOT-ESTABLISHED";
  reason: string;
}

/** Reports literal surface overlap only; it never merges token identities. */
export function compareConstructionSurfacesAcrossVersions(
  leftProfile: string,
  leftSurface: string,
  rightProfile: string,
  rightSurface: string
): ConstructionCrossVersionSurfaceComparison {
  const same = leftSurface === rightSurface;
  return {
    leftProfile, rightProfile, leftSurface, rightSurface,
    surfaceRelation: same ? "EXACT-SURFACE-MATCH" : "DIFFERENT-SURFACE",
    tokenIdentity: "NOT-ESTABLISHED",
    semanticEquivalence: "NOT-ESTABLISHED",
    reason: same
      ? "Exact spelling overlap is recorded across separate version profiles; shared surface does not establish shared identity or meaning."
      : "Different surface strings are recorded; this comparison does not infer lexical, morphological or semantic relationships."
  };
}

export function reviewHandFlameFixtureTraceability() {
  const phraseCount = handFlameFixtureTraceability.phrases.length;
  const unresolvedPhraseCount = handFlameFixtureTraceability.phrases.filter(
    phrase => phrase.interpretationStatus === "UNRESOLVED"
  ).length;
  return {
    profile: handFlameFixtureTraceability,
    phraseCount,
    unresolvedPhraseCount,
    allPhraseSurfacesReconstructExactFixture:
      handFlameFixtureTraceability.phrases.map(phrase => phrase.surface).join(" · ") === handFlameFixtureTraceability.exactSurface,
    stageMapping: handFlameFixtureTraceability.stageMapping,
    grammarValidity: handFlameFixtureTraceability.grammarValidity,
    executable: false as const,
    canonEffect: "NONE" as const
  };
}
