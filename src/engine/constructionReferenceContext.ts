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
  issue:
    | "NONE"
    | "REFERENCE_ID_EMPTY"
    | "TOKEN_SCOPE_UNRESOLVED"
    | "REFERENCE_BINDING_INVALID"
    | "REPLACEMENT_BINDING_INVALID";
  limitation: string;
}

const LIMITATION =
  "Recovered reference persistence and default scope only. This does not resolve anatomical landmarks, surface boundaries, reference identity semantics, token parsing, spatial transformations, or construction completeness.";

function unresolved(
  issue: Exclude<ConstructionReferenceContext["issue"], "NONE">
): ConstructionReferenceContext {
  return { current: null, status: "UNRESOLVED", issue, limitation: LIMITATION };
}

function scopeForToken(token: unknown): ConstructionReferenceScope | null {
  if (token === "MI" || token === "NI" || token === "RI") return "DEFAULT-VOLUME";
  if (token === "me") return "SELF-SURFACE";
  return null;
}

/** Validates a binding at an untrusted runtime boundary. */
function validateBinding(value: unknown): ConstructionReferenceBinding | null {
  if (typeof value !== "object" || value === null || Array.isArray(value)) return null;
  const candidate = value as Record<string, unknown>;
  const expectedScope = scopeForToken(candidate.token);
  if (
    expectedScope === null ||
    typeof candidate.referenceId !== "string" ||
    candidate.referenceId.trim().length === 0 ||
    candidate.scope !== expectedScope ||
    candidate.persistence !== "UNTIL-REPLACED"
  ) return null;

  return {
    token: candidate.token as ConstructionReferenceToken,
    referenceId: candidate.referenceId.trim(),
    scope: expectedScope,
    persistence: "UNTIL-REPLACED"
  };
}

export function bindConstructionReference(
  token: unknown,
  referenceId: unknown
): ConstructionReferenceContext {
  if (typeof referenceId !== "string" || !referenceId.trim()) {
    return unresolved("REFERENCE_ID_EMPTY");
  }

  const scope = scopeForToken(token);
  if (scope === null) return unresolved("TOKEN_SCOPE_UNRESOLVED");

  return {
    current: {
      token: token as ConstructionReferenceToken,
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
 * persists. A valid replacement replaces the previous reference as a whole.
 * Malformed updates fail closed rather than preserving an unverified binding.
 */
export function advanceConstructionReferenceContext(
  current: unknown,
  replacement: unknown
): ConstructionReferenceContext {
  if (replacement !== null) {
    const validatedReplacement = validateBinding(replacement);
    if (!validatedReplacement) return unresolved("REPLACEMENT_BINDING_INVALID");
    return {
      current: validatedReplacement,
      status: "BOUND",
      issue: "NONE",
      limitation: LIMITATION
    };
  }

  if (current === null) {
    return {
      current: null,
      status: "UNBOUND",
      issue: "NONE",
      limitation: LIMITATION
    };
  }

  const validatedCurrent = validateBinding(current);
  if (!validatedCurrent) return unresolved("REFERENCE_BINDING_INVALID");

  return {
    current: validatedCurrent,
    status: "BOUND",
    issue: "NONE",
    limitation: LIMITATION
  };
}
