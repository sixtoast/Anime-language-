/**
 * Evidence-only inventory for performed fused Construction references.
 * Source: Phase 4 §8 hand-flame worked example; Phase 5.15 MEL row;
 * Phase 5.16 C-05/C-09. This is deliberately not a token parser or binder.
 */
export interface FusedReferenceEvidence {
  form: "mel";
  components: readonly ["me", "l"];
  decomposition: "me + anchor coda l";
  exampleReferent: "hand";
  associatedFormalScope: "MI surface-scope";
  status: "EXAMPLE-BACKED";
  generalMorphology: "UNRESOLVED";
  limitation: string;
}
export const fusedReferenceEvidence: readonly FusedReferenceEvidence[] = [{
  form: "mel",
  components: ["me", "l"],
  decomposition: "me + anchor coda l",
  exampleReferent: "hand",
  associatedFormalScope: "MI surface-scope",
  status: "EXAMPLE-BACKED",
  generalMorphology: "UNRESOLVED",
  limitation: "This single worked-example record does not define a productive anchor-coda inventory, landmark paradigm, boundary geometry, identifier syntax, or a general fused-reference grammar. It does not create or update a formal reference binding."
}] as const;
export type FusedReferenceReviewStatus = "EMPTY" | "EXAMPLE-RECORDED" | "UNRECOGNISED";
export interface FusedReferenceReview {
  input: string;
  status: FusedReferenceReviewStatus;
  entry: FusedReferenceEvidence | null;
  message: string;
  createsBinding: false;
}
export function reviewFusedConstructionReference(input: string): FusedReferenceReview {
  const normalized = input.trim().toLowerCase();
  if (!normalized) return { input, status: "EMPTY", entry: null, message: "Enter a performed fused reference form to inspect the recovered example inventory.", createsBinding: false };
  const entry = fusedReferenceEvidence.find(item => item.form === normalized) ?? null;
  if (!entry) return { input, status: "UNRECOGNISED", entry: null, message: "This form is not present in the recovered fused-reference example inventory. No morphology, anchor or scope is inferred.", createsBinding: false };
  return { input, status: "EXAMPLE-RECORDED", entry, message: "This form is recorded in one worked example only. It is not a general fused-reference parser and does not create a formal reference binding.", createsBinding: false };
}
