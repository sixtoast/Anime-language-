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
  { id: "DIM-010", group: "Dimensions", title: "Supports exponent arithmetic", description: "Dimension vectors can be added component-wise.", status: "authored-unverified", file: "src/engine/dimensions.test.ts", sourceRule: "LAN-011" }
];
