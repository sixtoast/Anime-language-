import { parseSurfaceExpression, type SurfaceParseResult } from "./surfaceParser";

export interface Phase6GFixture {
  id: string;
  category: string;
  label: string;
  input: string;
  expected: string;
  expectedNode?: string;
  expectedErrorFamily?: string | null;
  canonStatus: string;
}

export type FixtureComparison =
  | "match"
  | "mismatch"
  | "conditional-unresolved"
  | "context-dependent"
  | "scope-guardrail-confirmed";

export interface Phase6GFixtureObservation {
  id: string;
  input: string;
  expected: string;
  observed: "accept" | "reject";
  comparison: FixtureComparison;
  diagnosticCodes: string[];
  observedOperator?: string;
  observedNode?: string;
  observedShape?: string;
  observedSlotNode?: string;
  slotProbeDiagnosticCodes?: string[];
  note: string;
}

export interface Phase6GFixtureAudit {
  suiteId: string;
  fixtureCount: number;
  directlyComparable: number;
  directMatches: number;
  directMismatches: number;
  nonDirectComparisons: number;
  observations: Phase6GFixtureObservation[];
  status: "observations-generated-not-acceptance";
  canonEffect: "none";
}

function rootNodeName(result: SurfaceParseResult): string | undefined {
  if (!result.ok || !result.ast) return undefined;
  switch (result.ast.kind) {
    case "quantity": return "QuantityLiteral";
    case "identifier": return "Identifier";
    case "call": return "Call";
    case "block": return "Block";
    case "atom": return "Atom";
    default: return undefined;
  }
}

function observedShape(result: SurfaceParseResult): string | undefined {
  if (!result.ok || !result.ast) return undefined;
  if (result.ast.kind === "call" && result.ast.args.some((argument) => argument.kind === "block")) {
    return "Call-with-Block";
  }
  return undefined;
}

function identifierSlotProbe(fixture: Phase6GFixture): {
  node?: string;
  diagnosticCodes: string[];
} | undefined {
  if (fixture.expected !== "accept-in-identifier-slot" &&
      fixture.expected !== "reject-in-identifier-slot") return undefined;

  // KWAT is used only as a source-derived probe wrapper: its first argument is
  // parsed as an identifier. The fixture input itself remains unchanged.
  const probe = parseSurfaceExpression(`kwat ${fixture.input}`);
  if (!probe.ok || probe.ast?.kind !== "call" || probe.ast.operator !== "KWAT") {
    return { diagnosticCodes: probe.diagnostics.map((diagnostic) => diagnostic.code) };
  }
  const firstArgument = probe.ast.args[0];
  return {
    ...(firstArgument ? { node: firstArgument.kind === "identifier" ? "Identifier" : firstArgument.kind } : {}),
    diagnosticCodes: probe.diagnostics.map((diagnostic) => diagnostic.code)
  };
}

function compareFixture(fixture: Phase6GFixture, result: SurfaceParseResult): FixtureComparison {
  if (fixture.expected === "accept" || fixture.expected === "reject") {
    const matchedAcceptance = (fixture.expected === "accept") === result.ok;
    if (!matchedAcceptance) return "mismatch";
    if (fixture.expected === "accept" && fixture.expectedNode) {
      return rootNodeName(result) === fixture.expectedNode ? "match" : "mismatch";
    }
    return "match";
  }
  if (fixture.expected === "normalise-head-to-FRAJA") {
    return result.ok && result.ast?.kind === "call" && result.ast.operator === "FRAJA"
      ? "match"
      : "mismatch";
  }
  if (fixture.expected === "parse-result-must-not-claim-feasibility") {
    // The parser's public result type is syntax-only; this case is a guardrail,
    // not a claim that the expression is semantically or physically valid.
    return result.ok && result.ast !== undefined && !("feasible" in result)
      ? "scope-guardrail-confirmed"
      : "mismatch";
  }
  if (fixture.expected.startsWith("reject-unless-context-resolves")) {
    return result.ok ? "mismatch" : "conditional-unresolved";
  }
  return "context-dependent";
}

/**
 * Executes recovered fixtures as observations against the current TS parser.
 * This is a comparison aid, not an approval gate: several fixtures explicitly
 * require contextual grammar or source-signature evidence not present here.
 */
export function auditPhase6GFixtures(
  suiteId: string,
  fixtures: readonly Phase6GFixture[]
): Phase6GFixtureAudit {
  const observations = fixtures.map((fixture) => {
    const result = parseSurfaceExpression(fixture.input, {
      allowLegacyAliases: fixture.expected === "normalise-head-to-FRAJA"
    });
    const comparison = compareFixture(fixture, result);
    const slotProbe = identifierSlotProbe(fixture);
    return {
      id: fixture.id,
      input: fixture.input,
      expected: fixture.expected,
      observed: result.ok ? "accept" as const : "reject" as const,
      comparison,
      diagnosticCodes: result.diagnostics.map((diagnostic) => diagnostic.code),
      ...(result.ast?.kind === "call" ? { observedOperator: result.ast.operator } : {}),
      ...(rootNodeName(result) ? { observedNode: rootNodeName(result) } : {}),
      ...(observedShape(result) ? { observedShape: observedShape(result) } : {}),
      ...(slotProbe?.node ? { observedSlotNode: slotProbe.node } : {}),
      ...(slotProbe ? { slotProbeDiagnosticCodes: slotProbe.diagnosticCodes } : {}),
      note: fixture.expected === "accept-in-identifier-slot" || fixture.expected === "reject-in-identifier-slot"
        ? "Identifier-slot probe wraps the unchanged fixture input in KWAT to inspect the identifier position. This tests current parser behaviour only; it does not establish canonical grammar."
        : fixture.expectedNode === "QuantityLiteral" || fixture.expectedNode === "Identifier"
          ? "Fixture expects a particular syntactic slot/node; this generic expression audit does not certify that slot-specific contract."
        : fixture.expected.startsWith("accept-only-if") || fixture.expected.startsWith("accept-in-")
          ? "Context-dependent fixture; inspect the AST and source-backed signature before treating this observation as a result."
          : fixture.expectedErrorFamily
            ? "Current diagnostic codes are retained separately; historical error-family names are not assumed equivalent."
            : "Observation only; no canon, semantic, or physical-validity claim."
    };
  });
  const direct = observations.filter((item) => item.comparison === "match" || item.comparison === "mismatch");
  return {
    suiteId,
    fixtureCount: observations.length,
    directlyComparable: direct.length,
    directMatches: direct.filter((item) => item.comparison === "match").length,
    directMismatches: direct.filter((item) => item.comparison === "mismatch").length,
    nonDirectComparisons: observations.filter((item) =>
      item.comparison === "conditional-unresolved" ||
      item.comparison === "context-dependent" ||
      item.comparison === "scope-guardrail-confirmed"
    ).length,
    observations,
    status: "observations-generated-not-acceptance",
    canonEffect: "none"
  };
}
