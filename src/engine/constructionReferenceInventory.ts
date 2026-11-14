/** Evidence-only, case-sensitive Construction reference inventory. Not a parser or binder. */
export type ConstructionReferenceInventoryKind = "FORMAL-BINDER-EVIDENCE" | "PERFORMED-INVENTORY-ONLY" | "PERFORMED-PARTIALLY-RECOVERED" | "WORKED-EXAMPLE-ONLY";
export interface ConstructionReferenceInventoryEntry {
  form: string;
  kind: ConstructionReferenceInventoryKind;
  description: string;
  scope: string | null;
  persistence: string | null;
  collision: string | null;
  sourceBasis: string;
  limitation: string;
}
const LIMITATION = "This lookup does not parse a Construction clause, infer a boundary, resolve a referent, or create/update a reference binding. Unrecovered forms remain unresolved.";
export const constructionReferenceInventory: readonly ConstructionReferenceInventoryEntry[] = [
  ...(["MI", "NI", "RI"] as const).map(form => ({
    form, kind: "FORMAL-BINDER-EVIDENCE" as const,
    description: "Formal reference token with default-volume scope",
    scope: "DEFAULT-VOLUME", persistence: "UNTIL-REPLACED", collision: null,
    sourceBasis: "Phase 5.16 C-04/C-05, citing Phase 4 §3.3", limitation: LIMITATION
  })),
  {
    form: "me", kind: "FORMAL-BINDER-EVIDENCE",
    description: "Formal reference token described as SELF-surface",
    scope: "SELF-SURFACE", persistence: "UNTIL-REPLACED", collision: null,
    sourceBasis: "Phase 5.16 C-04/C-05, citing Phase 4 §3.3", limitation: LIMITATION
  },
  ...(["mi", "ni", "ri", "ne", "rə", "ro", "ru"] as const).map(form => ({
    form, kind: "PERFORMED-INVENTORY-ONLY" as const,
    description: "Listed in the Performed fused-reference inventory; individual reading not recovered here",
    scope: null, persistence: null, collision: null,
    sourceBasis: "Phase 4 fused-reference inventory, as recorded in the Phase 5.20 recovery trail",
    limitation: LIMITATION
  })),
  {
    form: "re", kind: "PERFORMED-PARTIALLY-RECOVERED",
    description: "Performed reference reading: TARGET-surface",
    scope: "TARGET-surface", persistence: "UNTIL-REPLACED",
    collision: "Shared Arcana numeral digit 4 (v3.0-L)",
    sourceBasis: "Phase 5.20 results JSON, citing Phase 4 §§3.3, 8, 10 and its lexicon generator",
    limitation: LIMITATION + " Slot grammar and whole-clause unique parsing remain unavailable."
  },
  {
    form: "ra", kind: "PERFORMED-PARTIALLY-RECOVERED",
    description: "Performed reference reading: TARGET-path",
    scope: "TARGET-path", persistence: null,
    collision: "Shared Arcana radian unit (v3.0-L)",
    sourceBasis: "Phase 5.20 results JSON, citing the Phase 4 fused-reference inventory and generator",
    limitation: LIMITATION + " Slot grammar and whole-clause unique parsing remain unavailable."
  },
  {
    form: "mel", kind: "WORKED-EXAMPLE-ONLY",
    description: "Worked-example form associated with me + anchor coda l and the hand referent",
    scope: "MI surface-scope association in the example", persistence: null, collision: null,
    sourceBasis: "Phase 4 §8 hand-flame example; Phase 5.15 MEL row; Phase 5.16 C-05/C-09",
    limitation: LIMITATION + " One MEL example does not establish a productive anchor-coda paradigm."
  }
] as const;
export type ConstructionReferenceInventoryReview = {
  input: string;
  status: "EMPTY" | ConstructionReferenceInventoryKind | "UNRECOGNISED";
  entry: ConstructionReferenceInventoryEntry | null;
  createsBinding: false;
  message: string;
};
export function reviewConstructionReferenceInventory(input: string): ConstructionReferenceInventoryReview {
  const form = input.trim();
  if (!form) return {
    input, status: "EMPTY", entry: null, createsBinding: false,
    message: "Enter an exact reference form. Capitalisation is preserved because formal and Performed inventories must not be conflated."
  };
  const entry = constructionReferenceInventory.find(item => item.form === form) ?? null;
  if (!entry) return {
    input, status: "UNRECOGNISED", entry: null, createsBinding: false,
    message: "This exact spelling is not recorded in the current evidence inventory. No scope, morphology, clause boundary or binding is inferred."
  };
  const message = entry.kind === "PERFORMED-INVENTORY-ONLY"
    ? "The form is present in the recovered inventory, but its individual reading and binding behaviour are not recovered."
    : entry.kind === "PERFORMED-PARTIALLY-RECOVERED"
      ? "A partial Performed reading is recorded, but slot resolution and whole-clause parsing remain unavailable."
      : entry.kind === "WORKED-EXAMPLE-ONLY"
        ? "This is a single worked-example record, not a productive reference formation rule."
        : "A formal token/scope association is documented. This lookup remains separate from the formal binder.";
  return { input, status: entry.kind, entry, createsBinding: false, message };
}
