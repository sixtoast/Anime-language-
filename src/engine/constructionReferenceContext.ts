/**
 * Conservative recovery of Construction reference persistence and default scope.
 *
 * Evidence: Arcane_Phase_5_16_Construction_Recovery_Matrix.csv, C-04/C-05,
 * citing Phase 4 §3.3. This module does not define the missing landmark system,
 * surface geometry, identifier syntax, or any spoken token grammar.
 */
export type ConstructionReferenceToken = "MI" | "NI" | "RI" | "me";
export type ConstructionReferenceScope = "DEFAULT-VOLUME" | "SELF-SURFACE";

export interface ConstructionReferenceBinding {
  token: ConstructionReferenceToken;
  referenceId: string;
  scope: ConstructionReferenceScope;
  persistence: "UNTIL-REPLACED";
}

export interface ConstructionReferenceContext {
  current: ConstructionReferenceBinding | null;
  status: "BOUND" | "UNBOUND" | "UNRESOLVED";
  issue: "NONE" | "REFERENCE_ID_EMPTY" | "TOKEN_SCOPE_UNRESOLVED";
  limitation: string;
}

const LIMITATION =
  "Recovered reference persistence and default scope only. This does not resolve anatomical landmarks, surface boundaries, reference identity semantics, token parsing, spatial transformations, or construction completeness.";

export function bindConstructionReference(
  token: string,
  referenceId: string
): ConstructionReferenceContext {
  if (!referenceId.trim()) {
    return {
      current: null,
      status: "UNRESOLVED",
      issue: "REFERENCE_ID_EMPTY",
      limitation: LIMITATION
    };
  }

  let scope: ConstructionReferenceScope;
  if (token === "MI" || token === "NI" || token === "RI") {
    scope = "DEFAULT-VOLUME";
  } else if (token === "me") {
    scope = "SELF-SURFACE";
  } else {
    return {
      current: null,
      status: "UNRESOLVED",
      issue: "TOKEN_SCOPE_UNRESOLVED",
      limitation: LIMITATION
    };
  }

  return {
    current: {
      token,
      referenceId: referenceId.trim(),
      scope,
      persistence: "UNTIL-REPLACED"
    },
    status: "BOUND",
    issue: "NONE",
    limitation: LIMITATION
  };
}

/**
 * A null update means no new reference was supplied, so the current binding
 * persists. A binding replaces the previous reference as a whole.
 */
export function advanceConstructionReferenceContext(
  current: ConstructionReferenceBinding | null,
  replacement: ConstructionReferenceBinding | null
): ConstructionReferenceContext {
  return {
    current: replacement ?? current,
    status: (replacement ?? current) ? "BOUND" : "UNBOUND",
    issue: "NONE",
    limitation: LIMITATION
  };
}
