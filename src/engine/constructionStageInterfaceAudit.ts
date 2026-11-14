import { constructionStageRelationshipEvidence } from "./constructionStageRelationshipEvidence";

export type ConstructionInterfaceDimension =
  | "INPUT-TYPE"
  | "OUTPUT-TYPE"
  | "ATTACHMENT"
  | "CARDINALITY"
  | "OMISSION"
  | "FAILURE-BEHAVIOUR";

export interface ConstructionStageInterfaceBoundary {
  id: string;
  from: string;
  to: string;
  fromLabel: string;
  toLabel: string;
  orderEvidence: "SOURCE-BACKED-PRECEDENCE";
  interfaceStatus: "UNRECOVERED";
  dataDependency: "NOT-ESTABLISHED";
  unresolvedDimensions: readonly ConstructionInterfaceDimension[];
  evidence: string;
}

const unresolvedDimensions: readonly ConstructionInterfaceDimension[] = [
  "INPUT-TYPE",
  "OUTPUT-TYPE",
  "ATTACHMENT",
  "CARDINALITY",
  "OMISSION",
  "FAILURE-BEHAVIOUR"
] as const;

export const constructionStageInterfaceAudit: {
  source: string;
  boundaries: readonly ConstructionStageInterfaceBoundary[];
  limits: {
    executable: false;
    canonEffect: "NONE";
    noDataFlowInference: true;
  };
} = {
  source: constructionStageRelationshipEvidence.source,
  boundaries: constructionStageRelationshipEvidence.precedence.map(edge => ({
    id: edge.from + "->" + edge.to,
    from: edge.from,
    to: edge.to,
    fromLabel: edge.fromLabel,
    toLabel: edge.toLabel,
    orderEvidence: "SOURCE-BACKED-PRECEDENCE",
    interfaceStatus: "UNRECOVERED",
    dataDependency: "NOT-ESTABLISHED",
    unresolvedDimensions,
    evidence: "The recovered source establishes relative performed order only; it does not supply an interface signature."
  })),
  limits: {
    executable: false,
    canonEffect: "NONE",
    noDataFlowInference: true
  }
};

export type ConstructionStageInterfaceReview =
  | { status: "PRECEDENCE-ONLY"; boundary: ConstructionStageInterfaceBoundary; unresolvedCount: 6; executable: false }
  | { status: "UNKNOWN-BOUNDARY"; boundary: null; unresolvedCount: 0; executable: false };

export function reviewConstructionStageInterfaceAudit(id: unknown): ConstructionStageInterfaceReview {
  if (typeof id !== "string") return { status: "UNKNOWN-BOUNDARY", boundary: null, unresolvedCount: 0, executable: false };
  const boundary = constructionStageInterfaceAudit.boundaries.find(item => item.id === id) ?? null;
  if (!boundary) return { status: "UNKNOWN-BOUNDARY", boundary: null, unresolvedCount: 0, executable: false };
  return { status: "PRECEDENCE-ONLY", boundary, unresolvedCount: boundary.unresolvedDimensions.length, executable: false };
}
