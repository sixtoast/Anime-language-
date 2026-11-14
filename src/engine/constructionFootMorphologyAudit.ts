import { constructionFrameInventory, constructionParameterInventory } from "./constructionFootEvidence";
import { constructionFootSourceRecovery } from "./constructionFootSourceRecovery";
import { constructionFrameMacroAssociations } from "./constructionFrameContrastEvidence";

export type FootFrameVowelStatus = "CANONICAL-CV-FRAME" | "UNRESOLVED-COMBINATION";
export interface FootFrameVowelCell {
  frame: string;
  vowel: string;
  form: string;
  status: FootFrameVowelStatus;
  semanticInterpretation: "UNRESOLVED";
  completeFoot: "NOT-ESTABLISHED";
}

const canonical = new Set(constructionFrameInventory.map(item => item.canonicalForm));

export const constructionFootMorphologyAudit = {
  sourceBoundary: "Phase 4 L-03; Phase 4 §3.2; Phase 5.15 Construction Contract Matrix; Phase 5.16 C-02; standalone Phase 5.22 parser source",
  frameVowelMatrix: constructionFrameInventory.flatMap(frame =>
    constructionParameterInventory.map(parameter => {
      const form = frame.consonant + parameter.vowel;
      return {
        frame: frame.consonant,
        vowel: parameter.vowel,
        form,
        status: canonical.has(form) ? "CANONICAL-CV-FRAME" as const : "UNRESOLVED-COMBINATION" as const,
        semanticInterpretation: "UNRESOLVED" as const,
        completeFoot: "NOT-ESTABLISHED" as const
      };
    })
  ),
  coverage: {
    frameCount: constructionFrameInventory.length,
    parameterVowelCount: constructionParameterInventory.length,
    pairCount: constructionFrameInventory.length * constructionParameterInventory.length,
    canonicalCvCount: constructionFrameInventory.filter(frame => canonical.has(frame.canonicalForm)).length,
    unresolvedPairCount: constructionFrameInventory.length * constructionParameterInventory.length - canonical.size
  },
  wholeTokenEvidence: constructionFootSourceRecovery.observedWholeTokens.map(item => ({
    token: item.token,
    alias: item.alias,
    surfaceShape: item.surfaceShape,
    segmentationStatus: "NOT-ESTABLISHED" as const,
    semanticStatus: "WHOLE-TOKEN-EXAMPLE-ONLY" as const
  })),
  observedFinalLetters: {
    forms: constructionFootSourceRecovery.observedWholeTokens.map(item => item.token),
    letters: constructionFootSourceRecovery.observedFinalLetters,
    status: "OCCURRENCES-ONLY-NOT-CODA-INVENTORY" as const
  },
  macroFrameAssociations: constructionFrameMacroAssociations.map(item => ({
    macro: item.macro,
    frameSet: item.frameSet,
    evidenceStatus: item.evidenceStatus,
    individualFrameMeanings: "UNRESOLVED" as const,
    executable: false as const
  })),
  sourceConflict: {
    phase515: "CVC-FRAME-PARAMETER-RELATION-CODA",
    phase516C02: "RELATION-CODA-OPTIONAL",
    resolution: "UNRESOLVED",
    canonEffect: "NONE"
  },
  limits: {
    productiveParadigmRecovered: false,
    codaInventoryComplete: false,
    parameterSemanticsExecutable: false,
    completeFootGrammarRecovered: false,
    executable: false,
    canonEffect: "NONE"
  }
} as const;

export function reviewConstructionFootFrameVowel(frame: unknown, vowel: unknown) {
  if (typeof frame !== "string" || typeof vowel !== "string") return null;
  return constructionFootMorphologyAudit.frameVowelMatrix.find(cell => cell.frame === frame && cell.vowel === vowel) ?? null;
}
