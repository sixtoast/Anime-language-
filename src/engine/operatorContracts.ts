/**
 * Source-traceable operator metadata for Arcane's provisional audit notation.
 *
 * This registry is deliberately not an executable semantic type checker.
 * Only the Phase 2 proposed arities are represented as parser metadata;
 * input/output types and evaluation rules remain unresolved unless separately
 * established by approved source evidence.
 */
export type ContractEvidenceStatus =
  | "provisional-audit-signature"
  | "canon-described-incomplete"
  | "unresolved";

export interface OperatorContract {
  operator: string;
  label: string;
  arity: number | null;
  arityStatus: ContractEvidenceStatus;
  inputTypes: readonly string[] | null;
  outputType: string | null;
  dimensionalRule: string;
  evaluationRule: string;
  source: string[];
  openQuestions: string[];
}

const provisional = (operator: string, label: string, arity: number, source: string[] = ["docs/audits/phase-2-formal-syntax.md §2"]) : OperatorContract => ({
  operator, label, arity, arityStatus: "provisional-audit-signature",
  inputTypes: null, outputType: null,
  dimensionalRule: "Not enforced: dimensional and operator-specific acceptance rules are not yet connected.",
  evaluationRule: "Not specified as executable behaviour; this entry records proposed audit arity only.",
  source,
  openQuestions: ["Approve the signature against canonical source.", "Define accepted semantic types and output type.", "Define dimensional constraints and failure behaviour.", "Define evaluation semantics before execution."]
});

export const operatorContracts: readonly OperatorContract[] = [
  ...[
    ["FRAPA", "add", 2], ["FRATA", "subtract", 2], ["FRAKA", "multiply", 2],
    ["FRALA", "divide", 2], ["FRASHA", "negate", 1], ["DRAN", "magnitude", 1],
    ["DREM", "dot product", 2], ["DRIM", "cross product", 2], ["DRAL", "compare", 3]
  ].map(([operator, label, arity]) => {
    const contract = provisional(String(operator), String(label), Number(arity));
    if (String(operator) !== "FRASHA") return contract;
    return {
      ...contract,
      source: [...contract.source, "docs/research/semantic-recovery-audit-01-frasha.md", "Archived Phase 6J/6K/6L reports (historical evidence only)"],
      evaluationRule: "Not executable: archived Phase 6J/6K/6L reports flag a historical negate-versus-absolute-value mismatch; current runtime behaviour has not been established by this metadata.",
      openQuestions: [...contract.openQuestions, "Resolve whether FRASHA as a negative numeral sign is distinct from unary operator syntax.", "Verify current TypeScript implementation paths before proposing a runtime change.", "Keep arithmetic negation separate from Boolean NOT (GRASH)."]
    };
  }),
  {
    operator: "SIMA", label: "measure", arity: null,
    arityStatus: "canon-described-incomplete",
    inputTypes: ["target/property and measurement pathway (conceptual only)"],
    outputType: "observation (canon-described)",
    dimensionalRule: "Measurement dimensions, sensor resolution, uncertainty and unit conversion are not modelled.",
    evaluationRule: "Must not produce knowledge without a physical measurement pathway and available information; no executable evaluator exists.",
    source: ["src/engine/semanticTypes.ts TYPE-003", "docs/audits/phase-2-formal-syntax.md §2"],
    openQuestions: ["What is the canonical surface signature?", "How are sensors, pathways, resolution and uncertainty represented?", "How is observation freshness/time encoded?"]
  },
  ...[
    ["NES", "read"], ["GAMA", "assign"], ["DAVE", "infer"],
    ["KWAM", "bind"], ["KWAT", "reference binding"], ["KWAK", "live evaluation"],
    ["GRAN", "AND"], ["GRAT", "OR"], ["GRAK", "NOT"], ["BEK", "IF"], ["ZET", "WHILE"]
  ].map(([operator, label]) => ({
    operator, label, arity: null, arityStatus: "unresolved" as const,
    inputTypes: null, outputType: null,
    dimensionalRule: "Not specified; no dimensional contract is enforced.",
    evaluationRule: "Not specified as an executable contract. Conceptual notes in Phase 2 are not promoted to locked signatures.",
    source: ["docs/audits/phase-2-formal-syntax.md §2"],
    openQuestions: ["Recover/approve the exact canonical signature and arity.", "Define input/output semantic types.", "Specify evaluation, failure and side-effect rules."]
  }))
];

export function getOperatorContract(operator: string): OperatorContract | undefined {
  const normalized = operator.trim().toUpperCase();
  return operatorContracts.find((contract) => contract.operator === normalized);
}

export const operatorContractPrinciples = [
  { id: "OPCON-001", statement: "A proposed arity is parser audit metadata, not proof of a canonical or executable operator signature." },
  { id: "OPCON-002", statement: "Unknown input/output types, dimensional rules and evaluation semantics remain null or explicitly unresolved; they are never inferred." },
  { id: "OPCON-003", statement: "SIMA is described as producing an observation, but its complete executable signature and physical measurement pathway remain unfinished." },
  { id: "OPCON-004", statement: "Assignment, binding, reference and live evaluation must not be conflated with physical causation or object creation." }
] as const;
