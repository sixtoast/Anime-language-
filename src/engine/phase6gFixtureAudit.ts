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
  note: string;
}

export interface Phase6GFixtureAudit {
  suiteId: string;
  fixtureCount: number;
  directlyComparable: number;
  directMatches: number;
  directMismatches: number;
  unresolvedOrContextual: number;
  observations: Phase6GFixtureObservation[];
  status: "observations-generated-not-acceptance";
  canonEffect: "none";
}

function compareFixture(fixture: Phase6GFixture, result: SurfaceParseResult): FixtureComparison {
  if (fixture.expected === "accept" || fixture.expected === "reject") {
    const matched = (fixture.expected === "accept") === result.ok;
    return matched ? "match" : "mismatch";
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
    return {
      id: fixture.id,
      input: fixture.input,
      expected: fixture.expected,
      observed: result.ok ? "accept" as const : "reject" as const,
      comparison,
      diagnosticCodes: result.diagnostics.map((diagnostic) => diagnostic.code),
      ...(result.ast?.kind === "call" ? { observedOperator: result.ast.operator } : {}),
      note: fixture.expectedNode === "QuantityLiteral" || fixture.expectedNode === "Identifier"
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
    unresolvedOrContextual: observations.filter((item) =>
      item.comparison === "conditional-unresolved" ||
      item.comparison === "context-dependent" ||
      item.comparison === "scope-guardrail-confirmed"
    ).length,
    observations,
    status: "observations-generated-not-acceptance",
    canonEffect: "none"
  };
}
