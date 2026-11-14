/**
 * Phase 8CH — lexical segmentation and Foot-candidate evidence audit.
 * Classifies exact hand-flame surface tokens against recovered inventories.
 * It never promotes orthographic shape or surface overlap into token identity.
 */
import { handFlameFixtureTraceability } from "./constructionFixtureTraceability";
import { handFlameSourceSequence, handFlameSegments } from "./constructionHandFlameEvidence";
import { constructionFrameInventory } from "./constructionFootEvidence";
import { constructionFootSourceRecovery } from "./constructionFootSourceRecovery";
import { constructionMacroEvidence } from "./constructionMacroEvidence";
import { constructionCouplingEvidence } from "./constructionCouplingEvidence";

type TokenEvidenceClass =
  | "FIXTURE-ANCHOR"
  | "FIXTURE-SPATIAL-ROLE"
  | "SURFACE-OVERLAP-IDENTITY-UNRESOLVED"
  | "FIXTURE-QUANTITY-PHRASE-UNIT"
  | "WHOLE-EXAMPLE-TOKEN"
  | "H-SERIES-COUPLING-FORM"
  | "FIXTURE-DURATION-PHRASE-UNIT"
  | "UNRESOLVED-FIXTURE-TOKEN";

const wholeTokens = constructionFootSourceRecovery.observedWholeTokens;
const frameForms = constructionFrameInventory.map(item => item.canonicalForm);
const couplingForms = constructionCouplingEvidence.map(item => item.form);
const macroForms = constructionMacroEvidence.map(item => item.form.toLowerCase());

function classifyToken(token: string, phraseIndex: number): {
  evidenceClass: TokenEvidenceClass;
  matchedInventories: string[];
  interpretation: string;
  identityStatus: "FIXTURE-LOCAL" | "SOURCE-RECORDED" | "NOT-ESTABLISHED";
  footStatus: "WHOLE-EXAMPLE-TOKEN" | "CV-FRAME-SURFACE-OVERLAP" | "NOT-ESTABLISHED";
} {
  const matchedInventories: string[] = [];
  if (frameForms.includes(token)) matchedInventories.push("canonical-CV-frame-form");
  if (couplingForms.includes(token)) matchedInventories.push("v2.0-H-series-coupling");
  if (macroForms.includes(token)) matchedInventories.push("operational-macro-spelling");
  if (wholeTokens.some(item => item.token === token)) matchedInventories.push("Phase-5.22-whole-example-token");

  if (token === "mel") return {
    evidenceClass: "FIXTURE-ANCHOR", matchedInventories,
    interpretation: "Anchor token in the hand-flame fixture; general reference morphology is not recovered.",
    identityStatus: "FIXTURE-LOCAL", footStatus: "NOT-ESTABLISHED"
  };
  if (token === "po") return {
    evidenceClass: "FIXTURE-SPATIAL-ROLE", matchedInventories,
    interpretation: "Read as position in this fixture only; no general lexical category or phrase rule is inferred.",
    identityStatus: "FIXTURE-LOCAL", footStatus: "NOT-ESTABLISHED"
  };
  if (token === "da") return {
    evidenceClass: "SURFACE-OVERLAP-IDENTITY-UNRESOLVED", matchedInventories,
    interpretation: "The fixture reads da as +Y; the same spelling is also a canonical CV frame form in the recovered Foot inventory. Shared spelling does not establish shared token identity or meaning.",
    identityStatus: "NOT-ESTABLISHED", footStatus: "CV-FRAME-SURFACE-OVERLAP"
  };
  const whole = wholeTokens.find(item => item.token === token);
  if (whole) return {
    evidenceClass: "WHOLE-EXAMPLE-TOKEN", matchedInventories,
    interpretation: "Retained whole in the Phase 5.22 example as " + whole.alias + "; internal segmentation is not established.",
    identityStatus: "SOURCE-RECORDED", footStatus: "WHOLE-EXAMPLE-TOKEN"
  };
  if (couplingForms.includes(token)) return {
    evidenceClass: "H-SERIES-COUPLING-FORM", matchedInventories,
    interpretation: "Recorded H-series form; gloss/domain reading is provisional and signature remains unresolved.",
    identityStatus: "SOURCE-RECORDED", footStatus: "NOT-ESTABLISHED"
  };
  if (phraseIndex === 2) return {
    evidenceClass: "FIXTURE-QUANTITY-PHRASE-UNIT", matchedInventories,
    interpretation: "Occurs inside the fixture's 0.2-metre quantity phrase; no individual digit, unit or morpheme value is assigned here.",
    identityStatus: "FIXTURE-LOCAL", footStatus: "NOT-ESTABLISHED"
  };
  if (phraseIndex === 5) return {
    evidenceClass: "FIXTURE-DURATION-PHRASE-UNIT", matchedInventories,
    interpretation: "Occurs inside the fixture's seconds-duration phrase; no individual token semantics are assigned.",
    identityStatus: "FIXTURE-LOCAL", footStatus: "NOT-ESTABLISHED"
  };
  return {
    evidenceClass: "UNRESOLVED-FIXTURE-TOKEN", matchedInventories,
    interpretation: "Surface occurrence is recorded, but no independent lexical meaning or productive morphological segmentation is established.",
    identityStatus: "NOT-ESTABLISHED", footStatus: "NOT-ESTABLISHED"
  };
}

export const constructionLexicalSegmentationAudit = {
  source: "Phase 4 §3.2/§8; Phase 5.15/5.16 Construction matrices; standalone Phase 5.22 parser source",
  exactSurface: handFlameSourceSequence,
  occurrences: handFlameSegments.flatMap((segment, segmentIndex) =>
    segment.tokens.map((token, tokenIndex) => ({
      phraseIndex: segmentIndex + 1,
      tokenIndex: tokenIndex + 1,
      surface: token,
      ...classifyToken(token, segmentIndex + 1),
      sourceSegment: segment.id
    }))
  ),
  inventoryOverlap: {
    canonicalCvFrameForms: frameForms,
    wholeExampleTokens: wholeTokens.map(item => item.token),
    hSeriesForms: couplingForms,
    operationalMacroSpellings: macroForms,
    exactMacroSpellingsInFixture: handFlameSegments.flatMap(segment => segment.tokens)
      .filter(token => macroForms.includes(token)),
    daCollision: {
      surface: "da",
      fixtureReading: "spatial +Y axis",
      footInventoryReading: "canonical CV frame form da",
      tokenIdentity: "NOT-ESTABLISHED",
      semanticEquivalence: "NOT-ESTABLISHED"
    }
  },
  morphology: {
    tokenSegmentationRecovered: false,
    completeCodaInventoryRecovered: false,
    productiveFootParadigmRecovered: false,
    frameParameterCodaMappingRecovered: false,
    wholeExampleTokensMayBeDecomposed: false,
    shapeAloneEstablishesFoot: false
  },
  summary: {
    phraseCount: handFlameFixtureTraceability.phrases.length,
    occurrenceCount: handFlameSegments.reduce((sum, segment) => sum + segment.tokens.length, 0),
    uniqueSurfaceCount: new Set(handFlameSegments.flatMap(segment => segment.tokens)).size,
    sourceBackedWholeTokenCount: wholeTokens.length,
    canonicalCvOverlapCount: handFlameSegments.flatMap(segment => segment.tokens)
      .filter(token => frameForms.includes(token)).length,
    macroTokenOccurrenceCount: 0
  },
  executable: false,
  canonEffect: "NONE"
} as const;

export function reviewConstructionLexicalOccurrence(token: unknown, phraseIndex?: unknown) {
  if (typeof token !== "string" || !token.trim()) return null;
  const normalized = token.trim().toLowerCase();
  const occurrences = constructionLexicalSegmentationAudit.occurrences.filter(item =>
    item.surface === normalized && (phraseIndex === undefined || item.phraseIndex === phraseIndex)
  );
  if (!occurrences.length) return null;
  return { token: normalized, occurrences, identityStatus: occurrences.every(item => item.identityStatus === "SOURCE-RECORDED") ? "SOURCE-RECORDED" as const : "NOT-ESTABLISHED" as const, executable: false as const };
}
