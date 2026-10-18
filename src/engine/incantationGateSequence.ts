import validationSpec from "../../docs/canon/arcane-incantations-v1.2-preconditions-constraints-and-failure.md?raw";
import invocationSpec from "../../docs/canon/arcane-incantations-v1.5-invocation-profiles-and-execution-contracts.md?raw";

export interface GateSequenceStage {
  id: string;
  ordinal: number;
  label: string;
  sourceDescription: string;
  boundaryNote: string;
}

const validationBoundaries: Record<string, string> = {
  "Structure": "A parsed record is not proof that references, types, mechanism, authority or outcome are valid.",
  "References": "A resolved label does not establish ownership, permission, consent or mechanism feasibility.",
  "Types": "Type-correct values do not prove that the request is feasible, authorised or executed.",
  "Preconditions": "A satisfied precondition permits later checks; it does not guarantee execution or success.",
  "Limits and resources": "A budget check does not prove a physical source, conservation, authority or execution.",
  "Feasibility": "A supported feasibility result does not grant external authority or establish consent.",
  "External authorisation": "Authorisation does not replace consent, resource readiness, contract acceptance or feasibility.",
  "Execution": "An executor report does not establish that required postconditions passed.",
  "Postconditions": "A verified result applies to the declared checks and evidence; it does not retroactively make a blocked operation valid."
};

const invocationBoundaries: Record<string, string> = {
  "well-formed": "Well-formedness does not imply semantic validation.",
  "semantically validated": "Validation does not imply external authorisation, contract acceptance, or execution.",
  "externally authorised": "Authorisation is not consent and is not proof that execution started.",
  "execution contract accepted": "Contract acceptance means the contract meets declared requirements; it does not mean the request was authorised or executed.",
  "attempted": "An attempt is not proof of completion or success.",
  "observed": "An observation or executor report is not automatically a passing completion test.",
  "outcome verified": "Verification is bounded by the declared postconditions, completion tests and evidence; it is not a universal guarantee beyond that contract."
};

export function parseValidationGateSequence(markdown: string): GateSequenceStage[] {
  const lines = markdown.split(/\r?\n/);
  const start = lines.findIndex((line) => line.trim() === "## 7. Check order and dependency guards");
  if (start < 0) throw new Error("v1.2 gate-sequence section not found.");
  const stages: GateSequenceStage[] = [];
  for (const line of lines.slice(start + 1)) {
    if (/^##\s/.test(line.trim())) break;
    const match = line.trim().match(/^(\d+)\.\s+\*\*(.+?):\*\*\s*(.+)$/);
    if (!match) continue;
    const ordinal = Number(match[1]);
    const label = match[2].trim();
    stages.push({
      id: "CON12-" + String(ordinal).padStart(2, "0"),
      ordinal,
      label,
      sourceDescription: match[3].trim(),
      boundaryNote: validationBoundaries[label] ?? "This stage does not imply that later stages have passed."
    });
  }
  if (stages.length !== 9) throw new Error("Expected nine ordered v1.2 gate stages; found " + stages.length + ".");
  if (stages.some((stage, index) => stage.ordinal !== index + 1)) throw new Error("v1.2 gate stages are not a contiguous ordered sequence.");
  return stages;
}

export function parseInvocationLifecycle(markdown: string): GateSequenceStage[] {
  const match = markdown.match(/\*\*(well-formed → [^*]+? → outcome verified)\*\*/);
  if (!match) throw new Error("v1.5 invocation lifecycle summary not found.");
  const labels = match[1].split(" → ").map((label) => label.trim());
  if (labels.length !== 7 || labels.some((label) => !invocationBoundaries[label])) {
    throw new Error("Unexpected v1.5 invocation lifecycle stages.");
  }
  return labels.map((label, index) => ({
    id: "INV15-" + String(index + 1).padStart(2, "0"),
    ordinal: index + 1,
    label,
    sourceDescription: "Stage label transcribed from the v1.5 summary lifecycle.",
    boundaryNote: invocationBoundaries[label]
  }));
}

export const validationGateSequence = parseValidationGateSequence(validationSpec);
export const invocationLifecycleSequence = parseInvocationLifecycle(invocationSpec);

export const invocationOrderNote = {
  title: "Source-order note — preserve, do not reconcile by assumption",
  summary: "The v1.5 summary lifecycle lists external authorisation before execution-contract acceptance, while its worked example describes declaring and checking the contract before obtaining an external authority decision. The source does not explicitly reconcile these two descriptions.",
  rule: "This explorer displays the summary chain as written and records the worked-example ordering note separately. It does not invent a merged total order or silently edit v1.5."
};
