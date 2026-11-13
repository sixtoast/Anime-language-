/**
 * Phase 4 §8 hand-flame example evidence ledger.
 * Source: Arcane_Phase_5_15_Construction_Contract_Matrix, worked-example row;
 * Phase 5.16 C-08/C-09. Evidence only: no complete grammar parse or feasibility.
 */
export type WorkedConstructionEvidenceStatus = "EXAMPLE-BACKED" | "PARTIAL-EXAMPLE" | "PROVISIONAL" | "UNRESOLVED";
export interface WorkedConstructionChunk {
  sourceText: string;
  evidenceStatus: WorkedConstructionEvidenceStatus;
  interpretation: string;
  unresolved: string;
}
export const handFlameConstructionExample = {
  sourceVersion: "Phase 4 §8",
  sourceSequence: "mel · po da za shi to za ma · kan ken · he ha · sa shi za se · kas",
  sourceStatus: "TOKENISED-EXAMPLE-SEMANTICALLY-INCOMPLETE",
  chunks: [
    { sourceText: "mel", evidenceStatus: "EXAMPLE-BACKED", interpretation: "The recovery matrix records mel as me + anchor coda l, used for an MI surface-scope reference anchored to the hand.", unresolved: "The anatomical landmark system and general fused-reference morphology are not recovered." },
    { sourceText: "po da za shi to za ma", evidenceStatus: "UNRESOLVED", interpretation: "Preserved as the second dot-delimited source chunk.", unresolved: "The supplied recovery matrix does not provide a reliable token-by-token gloss or complete parse for this chunk." },
    { sourceText: "kan ken", evidenceStatus: "PARTIAL-EXAMPLE", interpretation: "The source associates ken with a held energy state; KAN is included in the example but its exact rule is not recovered.", unresolved: "Do not infer a KAN/KEN pair rule, argument structure, or a general FREM expansion." },
    { sourceText: "he ha", evidenceStatus: "PROVISIONAL", interpretation: "The H-series records he = matter and ha = energy; their physical coupling mappings remain provisional.", unresolved: "Participant order, direction, coupling vector, validity conditions and physical effect are not established." },
    { sourceText: "sa shi za se", evidenceStatus: "UNRESOLVED", interpretation: "Preserved as the fifth dot-delimited source chunk.", unresolved: "The supplied recovery matrix does not provide a reliable token-by-token gloss or complete parse for this chunk." },
    { sourceText: "kas", evidenceStatus: "PARTIAL-EXAMPLE", interpretation: "The source associates kas with release in this example.", unresolved: "A general release construction, target binding, release mode and safety conditions are not established." }
  ] as const,
  limits: [
    "The dot-delimited grouping is preserved from the source; chunk-to-stage mapping is not asserted.",
    "The example is tokenised but not fully parsed.",
    "Energy magnitude, extent and matter-coupling parameters are unspecified in the source.",
    "The example does not establish feasibility, resource sufficiency, safety or physical execution.",
    "MEL's performed fused form is not equated with the formal me token or the full reference-landmark system."
  ] as const,
  canonEffect: "NONE"
} as const;
