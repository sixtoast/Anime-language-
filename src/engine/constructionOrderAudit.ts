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
  | "INSUFFICIENT_SEQUENCE"
  | "ORDER_CONSISTENT"
  | "ORDER_INCONSISTENT";

export interface ConstructionOrderIssue {
  code: "STAGE_OUT_OF_ORDER";
  stage: ConstructionStage;
  index: number;
  expectedAfter: ConstructionStage;
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

export function auditConstructionOrder(
  stages: readonly ConstructionStage[]
): ConstructionOrderAudit {
  const issues: ConstructionOrderIssue[] = [];
  let highestSeen = -1;
  let previousStage: ConstructionStage | undefined;

  stages.forEach((stage, index) => {
    const rank = stageIndex.get(stage);
    if (rank === undefined) return;
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

  const status: ConstructionOrderStatus = stages.length === 0
    ? "INSUFFICIENT_SEQUENCE"
    : issues.length > 0 ? "ORDER_INCONSISTENT" : "ORDER_CONSISTENT";

  return {
    status,
    ordered: status === "INSUFFICIENT_SEQUENCE" ? null : issues.length === 0,
    stages: [...stages],
    issues,
    checkedRule: constructionStageOrder.join(" → "),
    unresolved: [
      "Whether any stage may be omitted.",
      "How many references, spatial roles, Feet, couplings or quantities a construction may contain.",
      "How a stage's internal syntax and semantics are represented.",
      "The exact v2.0 Foot, coupling, landmark and KAN/KEN/KAS rules."
    ],
    limitation: "An order-consistent sequence is not a complete construction, a valid Arcane parse, a feasibility result, or evidence of execution."
  };
}
