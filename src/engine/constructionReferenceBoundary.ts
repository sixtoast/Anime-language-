import {
  advanceConstructionReferenceContext,
  type ConstructionReferenceContext,
  type ConstructionReferenceBinding
} from "./constructionReferenceContext";

export type ConstructionReferenceBoundaryEvent =
  | { type: "NO-REPLACEMENT" }
  | { type: "VALID-REPLACEMENT"; binding: ConstructionReferenceBinding }
  | { type: "PHRASE-BOUNDARY"; marker: "·" }
  | { type: "CLAUSE-BOUNDARY"; marker: string };

export interface ConstructionReferenceBoundaryResult {
  context: ConstructionReferenceContext;
  event: ConstructionReferenceBoundaryEvent["type"];
  boundaryEffect: "PRESERVE-UNTIL-REPLACED" | "REPLACEMENT-APPLIED" | "UNRESOLVED";
  mayInferScopeReset: false;
  mayInferNewReference: false;
  note: string;
}

const UNRESOLVED_BOUNDARY_NOTE =
  "A phrase/clause boundary is not documented as a reference replacement or scope reset. The current binding is carried through unchanged for inspection, but the grammar effect of this boundary remains unresolved; this is not a canon rule.";

export function reviewConstructionReferenceBoundary(
  current: unknown,
  event: ConstructionReferenceBoundaryEvent
): ConstructionReferenceBoundaryResult {
  if (event.type === "VALID-REPLACEMENT") {
    return {
      context: advanceConstructionReferenceContext(current, event.binding),
      event: event.type,
      boundaryEffect: "REPLACEMENT-APPLIED",
      mayInferScopeReset: false,
      mayInferNewReference: false,
      note: "A supplied replacement is validated and replaces the prior binding under the recovered UNTIL-REPLACED contract."
    };
  }
  if (event.type === "NO-REPLACEMENT") {
    return {
      context: advanceConstructionReferenceContext(current, null),
      event: event.type,
      boundaryEffect: "PRESERVE-UNTIL-REPLACED",
      mayInferScopeReset: false,
      mayInferNewReference: false,
      note: "The recovered reference contract preserves the current binding when no replacement is supplied."
    };
  }
  return {
    context: advanceConstructionReferenceContext(current, null),
    event: event.type,
    boundaryEffect: "UNRESOLVED",
    mayInferScopeReset: false,
    mayInferNewReference: false,
    note: UNRESOLVED_BOUNDARY_NOTE
  };
}
