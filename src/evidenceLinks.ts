export type EvidenceNodeKind =
  | "Canonical source"
  | "Provisional audit"
  | "Rule catalogue"
  | "Implementation"
  | "Automated test"
  | "Fixture set"
  | "Research record";

export interface EvidenceNode {
  label: string;
  kind: EvidenceNodeKind;
  path: string;
  relationship: string;
}

export interface EvidenceChain {
  id: string;
  title: string;
  status: "limited implementation" | "provisional observation";
  summary: string;
  ruleIds: string[];
  nodes: EvidenceNode[];
  caveat: string;
}

/**
 * Explicit, source-backed relationships for the Development Studio.
 * These are curated links, not an inferred or complete dependency graph.
 * A path link means the relationship is documented here; it does not prove
 * that the underlying rule is fully implemented or that its tests passed.
 */
export const evidenceChains: EvidenceChain[] = [
  {
    id: "EVID-LAN-005-006",
    title: "Provisional operator arity",
    status: "limited implementation",
    summary: "Trace the provisional FRAPA/operator-arity work from the source context through the Phase 2 audit, parser documentation, and registered regression tests.",
    ruleIds: ["LAN-005", "LAN-006"],
    nodes: [
      {
        label: "Canonical language specification",
        kind: "Canonical source",
        path: "docs/canon/arcane-language-v3.0-L.md",
        relationship: "Authority context for the language; it does not by itself settle every operator signature."
      },
      {
        label: "Phase 2 formal syntax audit",
        kind: "Provisional audit",
        path: "docs/audits/phase-2-formal-syntax.md",
        relationship: "Records provisional audit notation and operator-signature proposals; proposals are not promoted to spoken grammar."
      },
      {
        label: "Audit parser contract",
        kind: "Implementation",
        path: "src/engine/auditParser.md",
        relationship: "Documents the supported provisional parser subset and its limits."
      },
      {
        label: "Parser regression tests",
        kind: "Automated test",
        path: "src/engine/auditParser.test.ts",
        relationship: "Contains stable PARSE test IDs, including tests linked to LAN-005 and LAN-006."
      },
      {
        label: "Machine-readable rule catalogue",
        kind: "Rule catalogue",
        path: "docs/rules/rule-catalogue.json",
        relationship: "Stores recovered rule IDs and source anchors; it is derived metadata, not an independent authority."
      }
    ],
    caveat: "This chain documents limited audit-notation parsing and arity checks only. It does not establish full semantic typing, evaluation behaviour, or spoken-Arcane grammar."
  },
  {
    id: "EVID-LAN-010-011",
    title: "Dimensional algebra primitives",
    status: "limited implementation",
    summary: "Connect the language specification and rule catalogue to the standalone dimensional module and its automated tests.",
    ruleIds: ["LAN-010", "LAN-011"],
    nodes: [
      {
        label: "Canonical language specification",
        kind: "Canonical source",
        path: "docs/canon/arcane-language-v3.0-L.md",
        relationship: "Source context for recovered unit and quantity terminology."
      },
      {
        label: "Machine-readable rule catalogue",
        kind: "Rule catalogue",
        path: "docs/rules/rule-catalogue.json",
        relationship: "Records LAN rule IDs and their source anchors."
      },
      {
        label: "Dimension primitives documentation",
        kind: "Implementation",
        path: "src/engine/dimensions.md",
        relationship: "Documents the separate dimensional bookkeeping layer and its current limitations."
      },
      {
        label: "Dimension regression tests",
        kind: "Automated test",
        path: "src/engine/dimensions.test.ts",
        relationship: "Contains DIM test IDs for units, compatible operations, mismatches, and dimension-vector arithmetic."
      },
      {
        label: "Canon implementation evidence matrix",
        kind: "Research record",
        path: "docs/audits/canon-implementation-evidence-matrix.md",
        relationship: "Records which related claims have limited implementation evidence and which requirements remain open."
      }
    ],
    caveat: "The dimensional primitives are not integrated with parsed expressions or a complete semantic checker. Passing primitive tests would not prove complete language-rule enforcement."
  },
  {
    id: "EVID-P6G-FIXTURES",
    title: "Recovered Phase 6G fixture observations",
    status: "provisional observation",
    summary: "Follow the archived prototype evidence into preserved fixture records, the current observation harness, its regression tests, and the research comparison ledger.",
    ruleIds: [],
    nodes: [
      {
        label: "Archived prototype report",
        kind: "Canonical source",
        path: "sources/archive-reports/phase-audit-extracts/ARCANE_PHASE_6G_SURFACE_PARSER.md.extracted.txt",
        relationship: "Historical report used as source evidence; its reported results are not current CI results."
      },
      {
        label: "Preserved fixture suite",
        kind: "Fixture set",
        path: "tests/fixtures/phase6g-surface-parser-cases.json",
        relationship: "Keeps stable fixture IDs, source notes, expectations, and provisional status without changing canon."
      },
      {
        label: "Fixture observation implementation",
        kind: "Implementation",
        path: "src/engine/phase6gFixtureAudit.ts",
        relationship: "Compares selected fixture expectations with the current provisional parser and records non-direct comparisons."
      },
      {
        label: "Fixture audit regression tests",
        kind: "Automated test",
        path: "src/engine/phase6gFixtureAudit.test.ts",
        relationship: "Checks observation identity and comparison guardrails; it is not a canon approval test."
      },
      {
        label: "Diagnostic comparison ledger",
        kind: "Research record",
        path: "docs/research/phase6g-diagnostic-comparison-ledger-01.md",
        relationship: "Documents explicit diagnostic-family mappings and known historical implementation divergences."
      }
    ],
    caveat: "These are source-derived review fixtures and observations, not authoritative grammar, full parser acceptance, current CI status, semantic validation, or canon approval."
  }
];

export function validateEvidenceChains(chains: readonly EvidenceChain[] = evidenceChains): string[] {
  const issues: string[] = [];
  const ids = new Set<string>();
  for (const chain of chains) {
    if (ids.has(chain.id)) issues.push(`Duplicate evidence-chain ID: ${chain.id}`);
    ids.add(chain.id);
    if (chain.nodes.length < 2) issues.push(`Evidence chain ${chain.id} needs at least two linked records.`);
    const paths = new Set<string>();
    for (const node of chain.nodes) {
      if (!node.path.trim()) issues.push(`Evidence chain ${chain.id} has a node without a path.`);
      if (paths.has(node.path)) issues.push(`Evidence chain ${chain.id} repeats path ${node.path}.`);
      paths.add(node.path);
      if (!node.relationship.trim()) issues.push(`Evidence chain ${chain.id} has an unexplained relationship for ${node.path}.`);
    }
    if (!chain.caveat.trim()) issues.push(`Evidence chain ${chain.id} needs a scope caveat.`);
  }
  return issues;
}
