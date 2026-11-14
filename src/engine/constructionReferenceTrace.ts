/**
 * Phase 8CN — multi-event trace for recovered Construction reference persistence.
 *
 * This is a diagnostic companion, not a spoken-syntax parser. It processes
 * explicit reference/replacement events and deliberately stops inferring
 * continuity across phrase/clause boundaries.
 */
import {
  bindConstructionReference,
  type ConstructionReferenceContext,
  type ConstructionReferenceToken
} from "./constructionReferenceContext";

export type ConstructionReferenceTraceEvent =
  | { type: "REFERENCE"; token: ConstructionReferenceToken; referenceId: string }
  | { type: "NO-REPLACEMENT" }
  | { type: "PHRASE-BOUNDARY"; marker: "·" }
  | { type: "CLAUSE-BOUNDARY"; marker: string };

export type ConstructionReferenceTraceStatus =
  | "BOUND"
  | "UNBOUND"
  | "UNRESOLVED"
  | "BLOCKED-ON-BOUNDARY-GRAMMAR";

export interface ConstructionReferenceTraceStep {
  index: number;
  event: ConstructionReferenceTraceEvent["type"];
  status: ConstructionReferenceTraceStatus;
  binding: ConstructionReferenceContext["current"];
  transition:
    | "EXPLICIT-BINDING"
    | "PRESERVED-NO-REPLACEMENT"
    | "NO-BINDING-TO-PRESERVE"
    | "BOUNDARY-EFFECT-UNRESOLVED"
    | "EXPLICIT-REPLACEMENT-AFTER-BOUNDARY"
    | "BLOCKED-CONTINUITY-INFERENCE";
  explanation: string;
}

export interface ConstructionReferenceTrace {
  steps: ConstructionReferenceTraceStep[];
  finalStatus: ConstructionReferenceTraceStatus;
  finalBinding: ConstructionReferenceContext["current"];
  stoppedAtBoundary: boolean;
  grammarComplete: false;
  executable: false;
  canonEffect: "NONE";
  limitation: string;
}

const LIMITATION =
  "The trace models only explicit MI/NI/RI/me bindings and the recovered UNTIL-REPLACED rule. Phrase and clause boundary effects are not recovered. After a boundary, the previous binding is retained only as historical evidence; no continuation is inferred until an explicit replacement appears. This is not a clause parser, scope-reset rule, landmark resolver, or spell executor.";

export function traceConstructionReferenceEvents(
  events: readonly ConstructionReferenceTraceEvent[]
): ConstructionReferenceTrace {
  let binding: ConstructionReferenceContext["current"] = null;
  let status: ConstructionReferenceTraceStatus = "UNBOUND";
  let boundaryBlocked = false;
  let stoppedAtBoundary = false;
  const steps: ConstructionReferenceTraceStep[] = [];

  events.forEach((event, index) => {
    if (event.type === "REFERENCE") {
      const next = bindConstructionReference(event.token, event.referenceId);
      if (next.status === "BOUND") {
        binding = next.current;
        status = "BOUND";
        const afterBoundary = boundaryBlocked;
        boundaryBlocked = false;
        steps.push({
          index,
          event: event.type,
          status,
          binding,
          transition: afterBoundary ? "EXPLICIT-REPLACEMENT-AFTER-BOUNDARY" : "EXPLICIT-BINDING",
          explanation: afterBoundary
            ? "An explicit, validated replacement establishes a new binding. No assumption is made about the boundary's own scope effect."
            : "An explicit reference token establishes the recovered default scope and UNTIL-REPLACED persistence."
        });
      } else {
        binding = null;
        status = "UNRESOLVED";
        boundaryBlocked = false;
        steps.push({
          index,
          event: event.type,
          status,
          binding,
          transition: "BLOCKED-CONTINUITY-INFERENCE",
          explanation: "The supplied reference cannot be bound under the recovered token/scope contract."
        });
      }
      return;
    }

    if (event.type === "NO-REPLACEMENT") {
      if (boundaryBlocked) {
        status = "BLOCKED-ON-BOUNDARY-GRAMMAR";
        steps.push({
          index,
          event: event.type,
          status,
          binding,
          transition: "BLOCKED-CONTINUITY-INFERENCE",
          explanation: "No replacement follows a phrase/clause boundary. The earlier binding is retained in the trace as history, but its continuation across that boundary is not established."
        });
        return;
      }
      if (binding === null) {
        status = "UNBOUND";
        steps.push({
          index,
          event: event.type,
          status,
          binding: null,
          transition: "NO-BINDING-TO-PRESERVE",
          explanation: "No reference is currently bound; no implicit reference is created."
        });
      } else {
        status = "BOUND";
        steps.push({
          index,
          event: event.type,
          status,
          binding,
          transition: "PRESERVED-NO-REPLACEMENT",
          explanation: "Within the recovered reference context, absence of a replacement preserves the current binding."
        });
      }
      return;
    }

    boundaryBlocked = true;
    stoppedAtBoundary = true;
    status = "UNRESOLVED";
    steps.push({
      index,
      event: event.type,
      status,
      binding,
      transition: "BOUNDARY-EFFECT-UNRESOLVED",
      explanation: event.type === "PHRASE-BOUNDARY"
        ? "The middle-dot phrase boundary is recorded, but no reference reset or continuation rule is recovered."
        : "The supplied clause-boundary marker has no recovered reference-scope semantics."
    });
  });

  if (boundaryBlocked && status === "BOUND") status = "UNRESOLVED";
  return {
    steps,
    finalStatus: status,
    finalBinding: binding,
    stoppedAtBoundary,
    grammarComplete: false,
    executable: false,
    canonEffect: "NONE",
    limitation: LIMITATION
  };
}
