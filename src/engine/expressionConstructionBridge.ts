import type { SurfaceNode, SurfaceParseResult } from "./surfaceParser";

export const CONSTRUCTION_TARGET_SLOTS = [
  "HEAD", "CORE", "PARAMETERS", "CONSTRAINTS", "CONTROL"
] as const;

export type ConstructionTargetSlot = typeof CONSTRUCTION_TARGET_SLOTS[number];
export type ExpressionConstructionBridgeStatus =
  | "PARSE-UNAVAILABLE"
  | "MAPPING-NOT-SPECIFIED"
  | "MAPPING-RECORD-INCOMPLETE"
  | "TRACEABILITY-RECORDED";

export interface SurfaceSourceNode {
  path: string;
  kind: SurfaceNode["kind"];
  operator?: string;
}

export interface BridgeTraceabilityRecord {
  targetSlot: ConstructionTargetSlot;
  sourcePath: string;
  provenance: string;
  note?: string;
}

export interface BridgeDiagnostic {
  code: "INVALID_PARSE_RESULT" | "INVALID_TRACEABILITY_RECORD" | "UNKNOWN_TARGET_SLOT" | "UNKNOWN_SOURCE_PATH" | "DUPLICATE_TARGET_SLOT" | "MISSING_PROVENANCE";
  message: string;
  targetSlot?: ConstructionTargetSlot;
  sourcePath?: string;
}

export interface ExpressionConstructionBridgeReview {
  status: ExpressionConstructionBridgeStatus;
  sourceNotation: "phase-6g-provisional";
  targetModel: "incantation-contract-v1.0-v2.1";
  sourceNodes: SurfaceSourceNode[];
  targetSlots: ConstructionTargetSlot[];
  traceability: Array<BridgeTraceabilityRecord & { evidenceStatus: "USER-RECORDED-UNVERIFIED" }>;
  unmappedSlots: ConstructionTargetSlot[];
  diagnostics: BridgeDiagnostic[];
  executable: false;
  canonEffect: "none";
  limitations: string[];
}

const LIMITATIONS = [
  "The Phase 6G surface AST and the Incantation contract fields are distinct representations; this review does not assert a translation grammar between them.",
  "HEAD, CORE, PARAMETERS, CONSTRAINTS and CONTROL are target-side contract slots, not parser node categories.",
  "A recorded source path is traceability supplied for review, not an approved semantic mapping or proof of equivalence.",
  "No Construction Feet, coupling, macro, resource, authority, feasibility or execution instruction is generated."
] as const;

function isRecord(value: unknown): value is Record<string, unknown> {
  return value !== null && typeof value === "object" && !Array.isArray(value);
}

function isTargetSlot(value: unknown): value is ConstructionTargetSlot {
  return typeof value === "string" && CONSTRUCTION_TARGET_SLOTS.includes(value as ConstructionTargetSlot);
}

function isSurfaceNode(value: unknown): value is SurfaceNode {
  if (!isRecord(value) || typeof value.kind !== "string") return false;
  switch (value.kind) {
    case "atom":
      return typeof value.form === "string" && typeof value.lexicalClass === "string";
    case "quantity":
      return typeof value.value === "string" && typeof value.unit === "string" && typeof value.rawNumber === "string";
    case "identifier":
      return typeof value.digits === "string";
    case "call":
      return typeof value.operator === "string" && Array.isArray(value.args) &&
        value.args.every(isSurfaceNode) &&
        (value.surfaceForm === undefined || typeof value.surfaceForm === "string") &&
        (value.operatorId === undefined || typeof value.operatorId === "string") &&
        (value.operatorProfile === undefined || value.operatorProfile === "v3.0-L" || value.operatorProfile === "phase4-renamed");
    case "block":
      return Array.isArray(value.expressions) && value.expressions.every(isSurfaceNode);
    default:
      return false;
  }
}

function isSurfaceParseResult(value: unknown): value is SurfaceParseResult {
  return isRecord(value) && typeof value.ok === "boolean" &&
    value.notation === "phase-6g-provisional" && Array.isArray(value.diagnostics) &&
    (value.ok === false || isSurfaceNode(value.ast));
}

function collectNodes(node: SurfaceNode, path: string, output: SurfaceSourceNode[]): void {
  output.push({
    path,
    kind: node.kind,
    ...(node.kind === "call" ? { operator: node.operator } : {})
  });
  if (node.kind === "call") {
    node.args.forEach((child, index) => collectNodes(child, `${path}.args[${index}]`, output));
  } else if (node.kind === "block") {
    node.expressions.forEach((child, index) => collectNodes(child, `${path}.expressions[${index}]`, output));
  }
}

/**
 * Records the boundary between a successful provisional surface parse and the
 * Incantation contract model. It intentionally contains no translation rules.
 */
export function reviewExpressionConstructionBridge(
  parse: SurfaceParseResult,
  records: readonly BridgeTraceabilityRecord[] = []
): ExpressionConstructionBridgeReview {
  const emptyBase = {
    sourceNotation: "phase-6g-provisional" as const,
    targetModel: "incantation-contract-v1.0-v2.1" as const,
    targetSlots: [...CONSTRUCTION_TARGET_SLOTS],
    executable: false as const,
    canonEffect: "none" as const,
    limitations: [...LIMITATIONS]
  };

  const parseCandidate: unknown = parse;
  if (!isSurfaceParseResult(parseCandidate)) {
    return {
      ...emptyBase,
      status: "PARSE-UNAVAILABLE",
      sourceNodes: [],
      traceability: [],
      unmappedSlots: [...CONSTRUCTION_TARGET_SLOTS],
      diagnostics: [{
        code: "INVALID_PARSE_RESULT",
        message: "A valid Phase 6G parse result with a structurally valid AST is required before traceability review."
      }]
    };
  }
  if (!parseCandidate.ok || !parseCandidate.ast) {
    return {
      ...emptyBase,
      status: "PARSE-UNAVAILABLE",
      sourceNodes: [],
      traceability: [],
      unmappedSlots: [...CONSTRUCTION_TARGET_SLOTS],
      diagnostics: [],
    };
  }

  const sourceNodes: SurfaceSourceNode[] = [];
  collectNodes(parse.ast, "$", sourceNodes);
  const knownPaths = new Set(sourceNodes.map((node) => node.path));
  const diagnostics: BridgeDiagnostic[] = [];
  const accepted: Array<BridgeTraceabilityRecord & { evidenceStatus: "USER-RECORDED-UNVERIFIED" }> = [];
  const seenSlots = new Set<ConstructionTargetSlot>();
  const recordsCandidate: unknown = records;
  if (!Array.isArray(recordsCandidate)) {
    return {
      ...emptyBase,
      status: "MAPPING-RECORD-INCOMPLETE",
      sourceNodes,
      traceability: [],
      unmappedSlots: [...CONSTRUCTION_TARGET_SLOTS],
      diagnostics: [{
        code: "INVALID_TRACEABILITY_RECORD",
        message: "Traceability records must be supplied as an array."
      }]
    };
  }

  for (const candidate of recordsCandidate as unknown[]) {
    if (!isRecord(candidate) || !isTargetSlot(candidate.targetSlot) ||
        typeof candidate.sourcePath !== "string" || typeof candidate.provenance !== "string" ||
        (candidate.note !== undefined && typeof candidate.note !== "string")) {
      diagnostics.push({
        code: isRecord(candidate) && candidate.targetSlot !== undefined && !isTargetSlot(candidate.targetSlot)
          ? "UNKNOWN_TARGET_SLOT" : "INVALID_TRACEABILITY_RECORD",
        message: "Traceability record must contain a known target slot, source path, provenance string and optional note string.",
        ...(isRecord(candidate) && typeof candidate.sourcePath === "string" ? { sourcePath: candidate.sourcePath } : {})
      });
      continue;
    }
    const record = candidate as unknown as BridgeTraceabilityRecord;
    if (!knownPaths.has(record.sourcePath)) {
      diagnostics.push({
        code: "UNKNOWN_SOURCE_PATH",
        message: `Source path "${record.sourcePath}" does not exist in this parsed AST.`,
        targetSlot: record.targetSlot,
        sourcePath: record.sourcePath
      });
      continue;
    }
    if (seenSlots.has(record.targetSlot)) {
      diagnostics.push({
        code: "DUPLICATE_TARGET_SLOT",
        message: `Target slot "${record.targetSlot}" has more than one traceability record; precedence is not defined.`,
        targetSlot: record.targetSlot,
        sourcePath: record.sourcePath
      });
      continue;
    }
    if (!record.provenance.trim()) {
      diagnostics.push({
        code: "MISSING_PROVENANCE",
        message: `Target slot "${record.targetSlot}" has no provenance reference.`,
        targetSlot: record.targetSlot,
        sourcePath: record.sourcePath
      });
      continue;
    }
    seenSlots.add(record.targetSlot);
    accepted.push({ ...record, evidenceStatus: "USER-RECORDED-UNVERIFIED" });
  }

  const unmappedSlots = CONSTRUCTION_TARGET_SLOTS.filter((slot) => !seenSlots.has(slot));
  const status: ExpressionConstructionBridgeStatus = accepted.length === 0
    ? "MAPPING-NOT-SPECIFIED"
    : unmappedSlots.length > 0 || diagnostics.length > 0
      ? "MAPPING-RECORD-INCOMPLETE"
      : "TRACEABILITY-RECORDED";

  return {
    ...emptyBase,
    status,
    sourceNodes,
    traceability: accepted,
    unmappedSlots,
    diagnostics
  };
}
