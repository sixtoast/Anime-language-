export type TestExecutionStatus = "authored-unverified" | "blocked-by-specification";

export interface WorkbenchTest {
  id: string;
  group: "Parser" | "Dimensions";
  title: string;
  description: string;
  status: TestExecutionStatus;
  file: string;
  sourceRule: string;
}

export const workbenchTests: WorkbenchTest[] = [
  { id: "PARSE-001", group: "Parser", title: "Parses binary operator", description: "FRAPA with two symbols produces a call node with two ordered arguments.", status: "authored-unverified", file: "src/engine/auditParser.test.ts", sourceRule: "LAN-005, LAN-006" },
  { id: "PARSE-002", group: "Parser", title: "Preserves nested structure", description: "Nested FRAPA calls remain nested in the returned syntax tree.", status: "authored-unverified", file: "src/engine/auditParser.test.ts", sourceRule: "LAN-002, LAN-005" },
  { id: "PARSE-003", group: "Parser", title: "Rejects missing arguments", description: "A binary operator call with one argument is rejected.", status: "authored-unverified", file: "src/engine/auditParser.test.ts", sourceRule: "LAN-005, LAN-006" },
  { id: "PARSE-004", group: "Parser", title: "Rejects extra arguments", description: "A binary operator call with three arguments is rejected.", status: "authored-unverified", file: "src/engine/auditParser.test.ts", sourceRule: "LAN-005, LAN-006" },
  { id: "PARSE-005", group: "Parser", title: "Preserves operand order", description: "Swapping FRATA arguments changes their positions in the syntax tree; no commutativity is assumed.", status: "authored-unverified", file: "src/engine/auditParser.test.ts", sourceRule: "LAN-005" },
  { id: "PARSE-006", group: "Parser", title: "Rejects malformed separators", description: "Adjacent arguments without a comma produce a diagnostic instead of a guessed parse.", status: "authored-unverified", file: "src/engine/auditParser.test.ts", sourceRule: "LAN-002, LAN-005" },
  { id: "PARSE-007", group: "Parser", title: "Rejects unknown operator arity", description: "An unregistered operator call is rejected instead of assigning an arity.", status: "authored-unverified", file: "src/engine/auditParser.test.ts", sourceRule: "LAN-005" },
  { id: "PARSE-008", group: "Parser", title: "Rejects trailing input", description: "A second symbol after a complete expression is rejected.", status: "authored-unverified", file: "src/engine/auditParser.test.ts", sourceRule: "LAN-002, LAN-005" },
  { id: "PARSE-009", group: "Parser", title: "Reports empty input", description: "Whitespace-only input returns an EMPTY_INPUT diagnostic.", status: "authored-unverified", file: "src/engine/auditParser.test.ts", sourceRule: "LAN-002" },
  { id: "DIM-001", group: "Dimensions", title: "Registers recovered unit symbols", description: "MA, SE, KE, KU and RA are present in the implementation registry.", status: "authored-unverified", file: "src/engine/dimensions.test.ts", sourceRule: "LAN-010" },
  { id: "DIM-002", group: "Dimensions", title: "Adds compatible quantities", description: "Adding two length quantities returns their sum and preserves the left unit.", status: "authored-unverified", file: "src/engine/dimensions.test.ts", sourceRule: "LAN-010, LAN-011" },
  { id: "DIM-003", group: "Dimensions", title: "Rejects incompatible addition", description: "Length plus time throws a dimension mismatch error.", status: "authored-unverified", file: "src/engine/dimensions.test.ts", sourceRule: "LAN-010, LAN-011" },
  { id: "DIM-004", group: "Dimensions", title: "Preserves subtraction order", description: "Subtracting five length units from two returns negative three, without operand reordering.", status: "authored-unverified", file: "src/engine/dimensions.test.ts", sourceRule: "LAN-011" },
  { id: "DIM-005", group: "Dimensions", title: "Multiplies dimension vectors", description: "Length multiplied by length yields a squared-length exponent vector.", status: "authored-unverified", file: "src/engine/dimensions.test.ts", sourceRule: "LAN-011" },
  { id: "DIM-006", group: "Dimensions", title: "Derives velocity dimensions", description: "Length divided by time yields length¹·time⁻¹.", status: "authored-unverified", file: "src/engine/dimensions.test.ts", sourceRule: "LAN-011" },
  { id: "DIM-007", group: "Dimensions", title: "Rejects division by zero", description: "A zero divisor produces a structured quantity error.", status: "authored-unverified", file: "src/engine/dimensions.test.ts", sourceRule: "LAN-011" },
  { id: "DIM-008", group: "Dimensions", title: "Rejects unknown units", description: "An unregistered unit name is not treated as a known quantity.", status: "authored-unverified", file: "src/engine/dimensions.test.ts", sourceRule: "LAN-010" },
  { id: "DIM-009", group: "Dimensions", title: "Keeps RA convention explicit", description: "The current implementation treats RA as dimensionless; this is an implementation convention, not a final canon decision.", status: "authored-unverified", file: "src/engine/dimensions.test.ts", sourceRule: "LAN-010" },
  { id: "DIM-010", group: "Dimensions", title: "Supports exponent arithmetic", description: "Dimension vectors can be added component-wise.", status: "authored-unverified", file: "src/engine/dimensions.test.ts", sourceRule: "LAN-011" },
  { id: "PARSE-010", group: "Parser", title: "Checks unary and ternary arity", description: "FRASHA and DRAL are checked against the provisional one- and three-argument signatures.", status: "authored-unverified", file: "src/engine/auditParser.test.ts", sourceRule: "LAN-005, Phase 2 operator-signature register" },
  { id: "PARSE-011", group: "Parser", title: "Normalizes case consistently", description: "Lowercase operator and symbol tokens are normalized to uppercase in the audit AST.", status: "authored-unverified", file: "src/engine/auditParser.test.ts", sourceRule: "Phase 2 audit-notation implementation convention" },
  { id: "PARSE-012", group: "Parser", title: "Rejects trailing comma", description: "An incomplete argument list fails instead of being accepted as a partial call.", status: "authored-unverified", file: "src/engine/auditParser.test.ts", sourceRule: "LAN-002, LAN-005" },
  { id: "PARSE-013", group: "Parser", title: "Rejects unclosed call", description: "A call without a closing delimiter fails with a diagnostic.", status: "authored-unverified", file: "src/engine/auditParser.test.ts", sourceRule: "LAN-002, LAN-005" },
  { id: "PARSE-014", group: "Parser", title: "Rejects unsupported punctuation", description: "Unsupported punctuation produces a diagnostic rather than being silently ignored.", status: "authored-unverified", file: "src/engine/auditParser.test.ts", sourceRule: "LAN-002" },
  { id: "PARSE-015", group: "Parser", title: "Rejects invalid nested expressions", description: "A nested call with the wrong provisional arity fails without returning a partial AST.", status: "authored-unverified", file: "src/engine/auditParser.test.ts", sourceRule: "LAN-005, LAN-006" },
  { id: "DIM-011", group: "Dimensions", title: "Rejects non-finite inputs", description: "NaN and infinity are rejected as invalid quantity inputs.", status: "authored-unverified", file: "src/engine/dimensions.test.ts", sourceRule: "LAN-011 implementation safety" },
  { id: "DIM-012", group: "Dimensions", title: "Rejects non-finite addition results", description: "Overflow during quantity addition raises a structured error.", status: "authored-unverified", file: "src/engine/dimensions.test.ts", sourceRule: "LAN-011 implementation safety" },
  { id: "DIM-013", group: "Dimensions", title: "Normalizes unit-symbol case", description: "Unit lookup is case-insensitive and returns the canonical registered symbol.", status: "authored-unverified", file: "src/engine/dimensions.test.ts", sourceRule: "LAN-010 implementation convention" },
  { id: "DIM-014", group: "Dimensions", title: "Subtracts dimension exponents", description: "Dimension-vector subtraction derives length¹·time⁻¹ from length minus time.", status: "authored-unverified", file: "src/engine/dimensions.test.ts", sourceRule: "LAN-011" },
  { id: "DIM-015", group: "Dimensions", title: "Rejects non-finite multiplication results", description: "Overflow during quantity multiplication raises a structured error.", status: "authored-unverified", file: "src/engine/dimensions.test.ts", sourceRule: "LAN-011 implementation safety" }
];
