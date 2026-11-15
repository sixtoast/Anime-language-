/**
 * Evidence-only record of partially recovered Performed reference forms.
 * Sources: Phase 4 §§3.3, 8, 10 and the Phase 4 lexicon generator, as
 * summarised in the Phase 5.20 source-recovery/homograph matrix.
 * This is not a parser or a formal Construction reference binder.
 */
export interface PerformedReferenceEvidence {
  form: "re" | "ra";
  performedReading: "TARGET-surface" | "TARGET-path";
  sharedCollision: "Shared numeral: digit 4 (v3.0-L)" | "Shared unit: radian (v3.0-L)";
  status: "PARTIALLY-RECOVERED";
  sourceBasis: string;
  limitation: string;
}
const LIMITATION =
  "Phase 5.20 reports a slot-resolved homophone, but the complete Phase 4 original and a whole-spell unique parser have not been verified here. Do not infer a unique reading from register labels alone, decompose the form, or create a formal reference binding from this lookup.";
export const performedReferenceEvidence: readonly PerformedReferenceEvidence[] = [
  {
    form: "re",
    performedReading: "TARGET-surface",
    sharedCollision: "Shared numeral: digit 4 (v3.0-L)",
    status: "PARTIALLY-RECOVERED",
    sourceBasis: "Phase 4 §§3.3, 8 and 10 plus the Phase 4 lexicon generator, as summarised by Phase 5.20",
    limitation: LIMITATION
  },
  {
    form: "ra",
    performedReading: "TARGET-path",
    sharedCollision: "Shared unit: radian (v3.0-L)",
    status: "PARTIALLY-RECOVERED",
    sourceBasis: "Phase 4 fused-reference inventory and lexicon generator, as summarised by Phase 5.20",
    limitation: LIMITATION
  }
] as const;
export type PerformedReferenceReview = {
  input: string;
  status: "EMPTY" | "PARTIALLY-RECOVERED" | "UNRECOGNISED";
  entry: PerformedReferenceEvidence | null;
  message: string;
  createsBinding: false;
};
export function reviewPerformedReferenceEvidence(input: string): PerformedReferenceReview {
  const normalized = input.trim().toLowerCase();
  if (!normalized) return {
    input, status: "EMPTY", entry: null,
    message: "Enter re or ra to inspect the partially recovered Performed reference evidence.",
    createsBinding: false
  };
  const entry = performedReferenceEvidence.find(item => item.form === normalized) ?? null;
  if (!entry) return {
    input, status: "UNRECOGNISED", entry: null,
    message: "This form is not in the recovered two-form inventory. No reference role, decomposition or binding is inferred.",
    createsBinding: false
  };
  return {
    input, status: "PARTIALLY-RECOVERED", entry,
    message: "The Performed reading is reported by the Phase 5.20 consolidation, but the form has a competing Shared Arcana reading and requires slot-sensitive interpretation. This lookup does not parse a clause or create a reference binding.",
    createsBinding: false
  };
}
