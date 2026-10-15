import { evidenceChains } from "./evidenceLinks";

export type ResearchRecordStatus = "Open discrepancy" | "Open question" | "Integration gap";

export interface ResearchRecord {
  id: string;
  title: string;
  status: ResearchRecordStatus;
  summary: string;
  sourcePath: string;
  sourceLabel: string;
  relatedFixtureIds: string[];
  relatedChainId: string | null;
  nextAction: string;
  caveat: string;
}

/**
 * Curated research records extracted from existing source material.
 * These capture unresolved findings, not approved language decisions.
 */
export const researchRecords: ResearchRecord[] = [
  {
    id: "RES-P6G-RE-RA-001",
    title: "RE/RA historical behaviour discrepancy",
    status: "Open discrepancy",
    summary: "The comparison ledger records a difference between archived Python control flow and the report prose/fixture interpretation for RE MA and KI RA. The archived implementation appears to accept both forms, while the current TypeScript parser rejects them.",
    sourcePath: "docs/research/phase6g-diagnostic-comparison-ledger-01.md",
    sourceLabel: "Phase 6G diagnostic comparison ledger",
    relatedFixtureIds: ["P6G-FX-011", "P6G-FX-012"],
    relatedChainId: "EVID-P6G-FIXTURES",
    nextAction: "Run the archived Python prototype and current TypeScript parser against the same preserved inputs, capture versioned outputs, and then review the prose/fixture discrepancy without changing canon by implication.",
    caveat: "The archived Python behaviour is based on source inspection, not a fresh execution. This is a research discrepancy, not a decision to change aliases, lexicon, grammar, or parser behaviour."
  },
  {
    id: "RES-LAN-SEMANTICS-001",
    title: "Operator semantics remain under-specified",
    status: "Open question",
    summary: "The operator contract documentation distinguishes recovered operator names and provisional audit arity from unresolved input/output types, dimensions, and evaluation semantics.",
    sourcePath: "src/engine/operatorContracts.md",
    sourceLabel: "Operator contract registry documentation",
    relatedFixtureIds: [],
    relatedChainId: "EVID-LAN-005-006",
    nextAction: "Keep unresolved signature fields explicit and gather source-backed evidence for each contract dimension before implementing semantic evaluation.",
    caveat: "A known operator name or arity is not sufficient evidence for complete semantics, a spoken grammar rule, or a physical-feasibility claim."
  },
  {
    id: "RES-LAN-DIMENSIONS-001",
    title: "Dimensional primitives are not integrated with parsed expressions",
    status: "Integration gap",
    summary: "The dimensional module currently provides a separate bookkeeping layer. Its primitive tests do not establish dimensional checking over parsed expressions or a complete semantic checker.",
    sourcePath: "src/engine/dimensions.md",
    sourceLabel: "Dimension primitives documentation",
    relatedFixtureIds: [],
    relatedChainId: "EVID-LAN-010-011",
    nextAction: "Define a source-backed integration contract and add expression-level tests only after the relevant operator and unit semantics are established.",
    caveat: "Do not infer canonical unit semantics or modify Arcane rules from the existence of implementation primitives alone."
  }
];

export function validateResearchRecords(records: ResearchRecord[] = researchRecords): string[] {
  const errors: string[] = [];
  const seen = new Set<string>();
  for (const record of records) {
    if (seen.has(record.id)) errors.push(`Duplicate research record ID: ${record.id}`);
    seen.add(record.id);
    if (!record.id.trim() || !record.title.trim()) errors.push("Research record IDs and titles must be non-empty.");
    if (!record.sourcePath.trim()) errors.push(`Research record ${record.id} has no source path.`);
    if (!record.summary.trim() || !record.nextAction.trim() || !record.caveat.trim()) {
      errors.push(`Research record ${record.id} needs a summary, next action, and caveat.`);
    }
    if (record.relatedChainId && !evidenceChains.some((chain) => chain.id === record.relatedChainId)) {
      errors.push(`Research record ${record.id} references unknown evidence chain ${record.relatedChainId}.`);
    }
    if (new Set(record.relatedFixtureIds).size !== record.relatedFixtureIds.length) {
      errors.push(`Research record ${record.id} contains duplicate fixture IDs.`);
    }
  }
  return errors;
}
