/**
 * Conservative Phase 6H-A semantic analysis for the provisional Phase 6G AST.
 *
 * This layer annotates syntax without evaluating expressions or asserting
 * physical feasibility, authority, execution, or canonical language status.
 * It deliberately preserves exact operator identities and fails closed when
 * the current source-backed registries do not establish a semantic type.
 */
import { getUnit, type DimensionVector } from "./dimensions";
import type { SurfaceNode, SurfaceParseResult } from "./surfaceParser";
import type { SemanticValueType } from "./semanticTypes";
import { getOperatorContract } from "./operatorContracts";
import { getOperatorIdentity } from "./operatorIdentityRegistry";

export type SemanticDiagnosticSeverity = "error" | "unresolved";
export type SemanticDiagnosticCode =
  | "SEMANTIC_UNKNOWN_UNIT"
  | "SEMANTIC_NON_FINITE_QUANTITY"
  | "SEMANTIC_ATOM_TYPE_UNRESOLVED"
  | "SEMANTIC_IDENTIFIER_UNRESOLVED"
  | "SEMANTIC_OPERATOR_UNKNOWN"
  | "SEMANTIC_SIGNATURE_UNRESOLVED"
  | "SEMANTIC_BLOCK_RESULT_UNRESOLVED"
  | "SEMANTIC_PARSE_REQUIRED";

export interface SemanticDiagnostic {
  code: SemanticDiagnosticCode;
  severity: SemanticDiagnosticSeverity;
  path: string;
  nodeKind: SurfaceNode["kind"] | "parse";
  subject?: string;
  message: string;
  source?: string[];
}

export interface AnalysedSurfaceNode {
  /** Original parser node; never rewritten or canonicalised. */
  source: SurfaceNode;
  /** Conservative type result; unknown means no safe inference was possible. */
  type: SemanticValueType;
  children?: AnalysedSurfaceNode[];
}

export interface SemanticAnalysisResult {
  status: "valid" | "invalid" | "unresolved";
  notation: "phase-6g-provisional";
  typedAst?: AnalysedSurfaceNode;
  diagnostics: SemanticDiagnostic[];
  limitations: string[];
}

const LIMITATIONS = [
  "This is semantic annotation only; it does not evaluate operators or expressions.",
  "A valid semantic result does not establish physical feasibility, authorisation, execution, or a verified outcome.",
  "SHO is treated as a scalar by this implementation convention; this remains subject to canon review.",
  "Operator contracts currently do not provide complete executable input/output signatures.",
  "Identifiers have no implemented binding environment, scope, lifetime, or evaluation rules.",
  "Atoms are not assigned types from lexical classes, English glosses, or spelling."
] as const;

const unknown = (reason: string): SemanticValueType => ({ kind: "unknown", reason });

function diagnostic(
  code: SemanticDiagnosticCode,
  severity: SemanticDiagnosticSeverity,
  path: string,
  nodeKind: SurfaceNode["kind"] | "parse",
  message: string,
  subject?: string,
  source?: string[]
): SemanticDiagnostic {
  return {
    code, severity, path, nodeKind, message,
    ...(subject === undefined ? {} : { subject }),
    ...(source === undefined ? {} : { source })
  };
}

function quantityType(
  node: Extract<SurfaceNode, { kind: "quantity" }>,
  path: string,
  diagnostics: SemanticDiagnostic[]
): SemanticValueType {
  const numericValue = Number(node.value);
  if (!Number.isFinite(numericValue)) {
    diagnostics.push(diagnostic(
      "SEMANTIC_NON_FINITE_QUANTITY", "error", path, "quantity",
      `Quantity value "${node.value}" is not a finite number.`, node.value
    ));
    return unknown("non-finite quantity");
  }

  // Explicit implementation convention from the Phase 6H integration contract.
  if (node.unit.toUpperCase() === "SHO") return { kind: "scalar" };

  try {
    const unit = getUnit(node.unit);
    const dimension: DimensionVector = unit.dimension;
    return { kind: "quantity", dimension };
  } catch {
    diagnostics.push(diagnostic(
      "SEMANTIC_UNKNOWN_UNIT", "unresolved", path, "quantity",
      `Unit "${node.unit}" is not present in the registered dimensional unit table.`,
      node.unit
    ));
    return unknown(`unregistered unit: ${node.unit}`);
  }
}

function analyseNode(
  node: SurfaceNode,
  path: string,
  diagnostics: SemanticDiagnostic[]
): AnalysedSurfaceNode {
  switch (node.kind) {
    case "quantity":
      return { source: node, type: quantityType(node, path, diagnostics) };

    case "atom":
      diagnostics.push(diagnostic(
        "SEMANTIC_ATOM_TYPE_UNRESOLVED", "unresolved", path, "atom",
        `Atom "${node.form}" has no source-backed semantic type contract; lexical class "${node.lexicalClass}" is not sufficient to infer one.`,
        node.form
      ));
      return { source: node, type: unknown(`atom type unresolved: ${node.form}`) };

    case "identifier":
      diagnostics.push(diagnostic(
        "SEMANTIC_IDENTIFIER_UNRESOLVED", "unresolved", path, "identifier",
        `Identifier "${node.digits}" cannot be resolved without binding and scope rules.`,
        node.digits
      ));
      return { source: node, type: unknown(`identifier unresolved: ${node.digits}`) };

    case "block": {
      const children = node.expressions.map((child, index) =>
        analyseNode(child, `${path}.expressions[${index}]`, diagnostics)
      );
      diagnostics.push(diagnostic(
        "SEMANTIC_BLOCK_RESULT_UNRESOLVED", "unresolved", path, "block",
        "Block result and control-flow semantics are not specified; its expressions are annotated individually."
      ));
      return { source: node, type: unknown("block result semantics unresolved"), children };
    }

    case "call": {
      const children = node.args.map((child, index) =>
        analyseNode(child, `${path}.args[${index}]`, diagnostics)
      );
      // Versioned parser nodes carry a source-backed stable identity. Resolve the
      // semantic contract through its documented v3.0-L spelling, while retaining
      // the user's exact surface spelling in the source AST. Legacy ASTs continue
      // to use exact lookup and are never silently rewritten.
      const identity = node.operatorId ? getOperatorIdentity(node.operatorId) : undefined;
      const contractForm = identity?.v3_0LForm ?? node.operator;
      const contract = getOperatorContract(contractForm);
      if (!contract) {
        const knownIdentity = node.operatorId ? identity : undefined;
        diagnostics.push(diagnostic(
          knownIdentity ? "SEMANTIC_SIGNATURE_UNRESOLVED" : "SEMANTIC_OPERATOR_UNKNOWN", "unresolved", path, "call",
          knownIdentity
            ? `Operator identity "${knownIdentity.id}" is recognised, but no source-backed semantic contract is available for this operator class.`
            : `No exact operator contract exists for "${node.operator}". Operator identity is not rewritten.`,
          node.surfaceForm ?? node.operator,
          knownIdentity?.sources ? [...knownIdentity.sources] : undefined
        ));
        return { source: node, type: unknown(`operator contract not found: ${node.operator}`), children };
      }

      if (
        contract.arityStatus === "unresolved" ||
        contract.arityStatus === "canon-described-incomplete" ||
        contract.inputTypes === null ||
        contract.outputType === null
      ) {
        diagnostics.push(diagnostic(
          "SEMANTIC_SIGNATURE_UNRESOLVED", "unresolved", path, "call",
          `Operator "${node.operator}" has registry metadata but no complete approved input/output semantic signature. Parser arity is not treated as a type contract.`,
          node.surfaceForm ?? node.operator,
          contract.source
        ));
        return { source: node, type: unknown(`operator signature unresolved: ${node.operator}`), children };
      }

      // No current registry entry has a complete machine-readable type contract.
      // Keep this defensive branch unresolved rather than guessing string mappings.
      diagnostics.push(diagnostic(
        "SEMANTIC_SIGNATURE_UNRESOLVED", "unresolved", path, "call",
        `Operator "${node.operator}" does not yet expose a machine-readable semantic type contract.`,
        node.operator,
        contract.source
      ));
      return { source: node, type: unknown(`operator type mapping unavailable: ${node.operator}`), children };
    }
  }
}

export function analyseSurfaceAst(ast: SurfaceNode): SemanticAnalysisResult {
  const diagnostics: SemanticDiagnostic[] = [];
  const typedAst = analyseNode(ast, "$", diagnostics);
  const status = diagnostics.some((item) => item.severity === "error")
    ? "invalid"
    : diagnostics.length > 0
      ? "unresolved"
      : "valid";

  return {
    status,
    notation: "phase-6g-provisional",
    typedAst,
    diagnostics,
    limitations: [...LIMITATIONS]
  };
}

/** Semantic analysis is only available after a successful Phase 6G parse. */
export function analyseSurfaceParse(parseResult: SurfaceParseResult): SemanticAnalysisResult {
  if (!parseResult.ok || !parseResult.ast) {
    return {
      status: "invalid",
      notation: "phase-6g-provisional",
      diagnostics: [diagnostic(
        "SEMANTIC_PARSE_REQUIRED", "error", "$", "parse",
        "Semantic analysis requires a successful Phase 6G parse result."
      )],
      limitations: [...LIMITATIONS]
    };
  }
  return analyseSurfaceAst(parseResult.ast);
}
