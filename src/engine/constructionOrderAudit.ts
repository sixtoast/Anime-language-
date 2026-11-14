/**
 * Evidence-bounded audit of the recovered performed Construction order.
 *
 * Source: sources/originals/Arcane_Phase_5_15_Construction_Contract_Matrix.csv
 * (Phase 4 §3.3, as cited by the recovery matrix).
 *
 * This checks relative ordering only. It does not validate token morphology,
 * stage cardinality, omission rules, semantics, coupling, quantities, control,
 * release effects, physical feasibility, or execution.
 */
export const constructionStageOrder = [
  "reference",
  "spatial-role-vector",
  "construction-feet",
  "couplings",
  "quantity",
  "control",
  "release"
] as const;

export type ConstructionStage = typeof constructionStageOrder[number];
export type ConstructionOrderStatus =
  | "INVALID_SEQUENCE"
  | "INSUFFICIENT_SEQUENCE"
  | "ORDER_CONSISTENT"
  | "ORDER_INCONSISTENT";

export interface ConstructionOrderIssue {
  code: "SEQUENCE_NOT_ARRAY" | "UNKNOWN_STAGE" | "STAGE_OUT_OF_ORDER";
  index: number;
  stageValue?: unknown;
  stage?: ConstructionStage;
  expectedAfter?: ConstructionStage;
  message: string;
}

export interface ConstructionOrderAudit {
  status: ConstructionOrderStatus;
  ordered: boolean | null;
  stages: ConstructionStage[];
  issues: ConstructionOrderIssue[];
  checkedRule: string;
  unresolved: string[];
  limitation: string;
}

const stageIndex = new Map<ConstructionStage, number>(
  constructionStageOrder.map((stage, index) => [stage, index])
);

const unresolved = [
  "Whether any stage may be omitted.",
  "How many references, spatial roles, Feet, couplings or quantities a construction may contain.",
  "How a stage's internal syntax and semantics are represented.",
  "The exact v2.0 Foot, coupling, landmark and KAN/KEN/KAS rules."
] as const;

const limitation =
  "An order-consistent sequence is not a complete construction, a valid Arcane parse, a feasibility result, or evidence of execution.";

export function auditConstructionOrder(input: unknown): ConstructionOrderAudit {
  if (!Array.isArray(input)) {
    return {
      status: "INVALID_SEQUENCE",
      ordered: null,
      stages: [],
      issues: [{
        code: "SEQUENCE_NOT_ARRAY",
        index: -1,
        stageValue: input,
        message: "Construction order input must be an array of stage values."
      }],
      checkedRule: constructionStageOrder.join(" → "),
      unresolved: [...unresolved],
      limitation
    };
  }

  const issues: ConstructionOrderIssue[] = [];
  const stages: ConstructionStage[] = [];
  let highestSeen = -1;
  let previousStage: ConstructionStage | undefined;

  input.forEach((candidate: unknown, index: number) => {
    if (typeof candidate !== "string" || !stageIndex.has(candidate as ConstructionStage)) {
      issues.push({
        code: "UNKNOWN_STAGE",
        index,
        stageValue: candidate,
        message: "The supplied value is not a recognised Construction stage; its position cannot be audited."
      });
      return;
    }

    const stage = candidate as ConstructionStage;
    stages.push(stage);
    const rank = stageIndex.get(stage)!;
    if (rank < highestSeen) {
      issues.push({
        code: "STAGE_OUT_OF_ORDER",
        stage,
        index,
        expectedAfter: previousStage ?? constructionStageOrder[0],
        message: stage + " appears after " + (previousStage ?? "a later construction stage") +
          "; the recovered performed order places it earlier."
      });
    } else {
      highestSeen = rank;
      previousStage = stage;
    }
  });

  const hasInvalidInput = issues.some(issue =>
    issue.code === "UNKNOWN_STAGE"
  );
  const hasOrderError = issues.some(issue =>
    issue.code === "STAGE_OUT_OF_ORDER"
  );
  const status: ConstructionOrderStatus = input.length === 0
    ? "INSUFFICIENT_SEQUENCE"
    : hasInvalidInput
      ? "INVALID_SEQUENCE"
      : hasOrderError
        ? "ORDER_INCONSISTENT"
        : "ORDER_CONSISTENT";

  return {
    status,
    ordered: status === "INSUFFICIENT_SEQUENCE" || status === "INVALID_SEQUENCE"
      ? null
      : !hasOrderError,
    stages,
    issues,
    checkedRule: constructionStageOrder.join(" → "),
    unresolved: [...unresolved],
    limitation
  };
}
