export type AuditReadiness =
  | "implemented-limited"
  | "blocked-by-specification"
  | "not-implemented"
  | "design-level-only";

export interface CanonAuditItem {
  id: string;
  title: string;
  domain: "Ontology" | "Conservation" | "Causality" | "Bindings" | "Typing" | "Feasibility" | "Operator semantics";
  readiness: AuditReadiness;
  sourceRule: string;
  currentEvidence: string;
  nextRequirement: string;
}

export const canonAuditItems: CanonAuditItem[] = [
  {
    id: "CANON-001",
    title: "Separate information, mana, energy, force, coupling and effect",
    domain: "Ontology",
    readiness: "design-level-only",
    sourceRule: "MAG-001, MAG-002",
    currentEvidence: "The distinction is documented in canon and the rule catalogue. The parser and dimensional module do not model these as typed runtime concepts.",
    nextRequirement: "Define separate semantic types and prohibited implicit conversions before implementing a semantic checker."
  },
  {
    id: "CANON-002",
    title: "Conservation and resource accounting",
    domain: "Conservation",
    readiness: "not-implemented",
    sourceRule: "MAG-004",
    currentEvidence: "The conservation constraint is canonical, but no spell-feasibility evaluator currently accounts for matter, energy, momentum or information sources and conversions.",
    nextRequirement: "Specify a resource ledger and explicit source/conversion records, then add positive and negative feasibility fixtures. Do not treat dimensional arithmetic as conservation enforcement."
  },
  {
    id: "CANON-003",
    title: "Mechanism required for physical state changes",
    domain: "Causality",
    readiness: "design-level-only",
    sourceRule: "MAG-003",
    currentEvidence: "The rule is described in the magic specification and recovery register. There is no executable spell representation or mechanism-completeness validator.",
    nextRequirement: "Define the minimum structured mechanism fields and what counts as a missing or incomplete causal pathway."
  },
  {
    id: "CANON-004",
    title: "Binding creation, reference and live evaluation",
    domain: "Bindings",
    readiness: "blocked-by-specification",
    sourceRule: "LAN-007",
    currentEvidence: "KWAM, KWAT and KWAK are distinguished conceptually. Identifier syntax, binding scope, mutability, lifetime and evaluation timing remain incomplete.",
    nextRequirement: "Recover or approve scope, lifetime, update and evaluation-timing rules before runtime binding behaviour is implemented."
  },
  {
    id: "CANON-005",
    title: "Reject incompatible dimensional operands",
    domain: "Typing",
    readiness: "implemented-limited",
    sourceRule: "LAN-003, LAN-010, LAN-011",
    currentEvidence: "The standalone dimensional primitives reject incompatible addition/subtraction and derive dimension vectors for multiplication/division. They are not connected to parsed expressions; unit conversion and complete derived-unit semantics remain open.",
    nextRequirement: "Connect a typed AST to the dimensional layer only after operator input/output signatures and unit conversion rules are specified."
  },
  {
    id: "CANON-006",
    title: "Master spell-feasibility condition",
    domain: "Feasibility",
    readiness: "not-implemented",
    sourceRule: "MAG-005",
    currentEvidence: "Mana, coupling, energy, information, control, temporal/causal, stability and material terms are documented, but no evaluator computes or validates their conjunction.",
    nextRequirement: "Specify inputs, measurable criteria, uncertainty handling and failure diagnostics for each term; keep unspecified terms blocked rather than defaulting them to true."
  },
  {
    id: "CANON-007",
    title: "Provisional mathematical operator signatures",
    domain: "Operator semantics",
    readiness: "implemented-limited",
    sourceRule: "LAN-005, LAN-006",
    currentEvidence: "The Phase 2 audit parser checks provisional arity for registered operators. It does not calculate operator values, type-check operands or validate physical meaning.",
    nextRequirement: "Approve complete signatures and value/type rules from source evidence before adding semantic evaluation."
  },
  {
    id: "CANON-008",
    title: "Reconcile KREN, TRAK, FREM, SHREN, BRAN and VARE",
    domain: "Operator semantics",
    readiness: "blocked-by-specification",
    sourceRule: "LAN-009",
    currentEvidence: "These terms appear in the magic-system operator inventory but are absent from the supplied v3.0-L core inventory. This is a cross-specification gap, not proof that the terms are invalid.",
    nextRequirement: "Recover source passages and decide whether each term belongs to the language inventory, a spell-design layer, an alias set or a different version."
  },
  {
    id: "CANON-009",
    title: "Map surface grammar to spell representation",
    domain: "Typing",
    readiness: "blocked-by-specification",
    sourceRule: "LAN-001",
    currentEvidence: "HEAD + ARGUMENTS + MODIFIERS and HEAD + CORE + PARAMETERS + CONSTRAINTS + CONTROL are both recorded as distinct layers. Their mapping is not defined.",
    nextRequirement: "Specify a traceable mapping between surface syntax and spell-design structure without replacing either representation."
  },
  {
    id: "CANON-010",
    title: "Unique parse versus spoken Arcane",
    domain: "Operator semantics",
    readiness: "implemented-limited",
    sourceRule: "LAN-002, LAN-005",
    currentEvidence: "The parser rejects malformed or unknown audit notation and returns a structural tree for supported expressions. It does not parse spoken Arcane or prove spoken-boundary recoverability.",
    nextRequirement: "Recover formal surface grammar and test grouping, attachment, modifier scope, phonological boundaries and adversarial near-collisions."
  },
  {
    id: "CANON-011",
    title: "Logos resource and substrate accounting",
    domain: "Feasibility",
    readiness: "blocked-by-specification",
    sourceRule: "MAG-LOGOS, D-012",
    currentEvidence: "Logos is described as a persistent computational agent, but substrate, memory, energy, bandwidth and interface costs are underspecified.",
    nextRequirement: "Recover or explicitly decide the missing physical resource model before asserting feasible persistent computation."
  },
  {
    id: "CANON-012",
    title: "Numerical spell feasibility",
    domain: "Feasibility",
    readiness: "design-level-only",
    sourceRule: "MAG-T-003, T-016",
    currentEvidence: "The recovery register defines a design-level numeric feasibility test but supplies no executed worked case with assumptions and recorded outputs.",
    nextRequirement: "Choose a bounded example, state all assumptions and resource sources, evaluate each feasibility term separately, and record evidence before claiming validation."
  }
];

export const auditReadinessLabels: Record<AuditReadiness, string> = {
  "implemented-limited": "Implemented · limited scope",
  "blocked-by-specification": "Blocked by specification",
  "not-implemented": "Not implemented",
  "design-level-only": "Design-level only"
};
