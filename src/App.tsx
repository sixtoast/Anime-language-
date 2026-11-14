import { useEffect, useMemo, useRef, useState } from "react";
import {
  Activity, BookOpen, Braces, CheckCircle2, ChevronDown, CircleHelp,
  Command, FileText, FlaskConical, GitBranch, Layers3, Menu,
  Search, ShieldCheck, Sparkles, TestTube2, X, Play, AlertTriangle
} from "lucide-react";
import { parseSurfaceExpression, type SurfaceParseResult } from "./engine/surfaceParser";
import { analyseSurfaceParse } from "./engine/semanticAnalysis";
import { reviewExpressionConstructionBridge } from "./engine/expressionConstructionBridge";
import { parseModernVernacular, parseModernVernacularV1, parseModernVernacularV11, parseModernVernacularV12, parseModernVernacularV13, parseModernVernacularV14, type ModernVernacularUnifiedParseResult, type ModernVernacularV13ParseResult, type ModernVernacularParseResult, type ModernVernacularV11ParseResult, type ModernVernacularV12ParseResult, type ModernVernacularV14ParseResult } from "./engine/modernVernacular";
import { bundledLexiconLoad, BUNDLED_LEXICON_SOURCE } from "./engine/bundledLexicon";
import { inspectLexiconForm } from "./engine/lexiconRegistry";
import { docs, filterDocuments, type Status } from "./documentationCatalogue";
import { workbenchTests } from "./engine/testRegistry";
import { canonAuditItems, auditReadinessLabels } from "./engine/canonAuditRegistry";
import phase6gFixtureData from "../tests/fixtures/phase6g-surface-parser-cases.json";
import { auditPhase6GFixtures, type Phase6GFixture } from "./engine/phase6gFixtureAudit";
import { resourceAccountingFixtures } from "./engine/resourceAccountingFixtures";
import { authorityDecisionFixtures } from "./engine/authorityDecisionFixtures";
import { policyProfileCompositionFixtures } from "./engine/policyProfileCompositionFixtures";
import { invocationLifecycleSequence, invocationOrderNote, validationGateSequence } from "./engine/incantationGateSequence";
import { evaluateIncantationRuntimePreview, runtimePreviewScenarios, type RuntimePreviewScenario } from "./engine/incantationRuntimePreview";
import { evaluateResourceConservationPreview, resourceConservationPreviewScenarios, type ResourceConservationPreviewScenario } from "./engine/resourceConservationPreview";
import { reviewConstructionRecord, type ConstructionRecord, type ConstructionEvidenceStatus } from "./engine/constructionRecordReview";
import type { ConstructionStage } from "./engine/constructionOrderAudit";
import { bindConstructionReference, type ConstructionReferenceToken } from "./engine/constructionReferenceContext";
import { reviewConstructionReferenceBoundary } from "./engine/constructionReferenceBoundary";
import { constructionStageInterfaceAudit, reviewConstructionStageInterfaceAudit } from "./engine/constructionStageInterfaceAudit";
import { constructionSpatialEvidenceAudit } from "./engine/constructionSpatialEvidenceAudit";
import { constructionSpatialGrammarEvidence, reviewConstructionSpatialCategory } from "./engine/constructionSpatialGrammarEvidence";
import { constructionSpatialCompositionEvidence, reviewConstructionSpatialCategoryPair } from "./engine/constructionSpatialCompositionEvidence";
import { constructionAxisSemantics, reviewConstructionAxis } from "./engine/constructionAxisSemantics";
import { spatialValueModelSummary, workedDisplacementFixture, assessSpatialVectorFixture, proposedDisplacementMagnitude, proposedDisplacementDot } from "./engine/spatialValueModel";
import { positionRelationSummary, positionRelationFixtures, proposedPositionDifference, proposedTranslatePosition, proposedAddPositions } from "./engine/spatialPositionRelations";
import { createEmptyConstructionExpressionComposition, reviewConstructionExpressionComposition } from "./engine/constructionExpressionComposition";
import { handFlameFixtureTraceability, reviewHandFlameFixtureTraceability } from "./engine/constructionFixtureTraceability";
import { reviewConstructionFootShape } from "./engine/constructionFootShape";
import { reviewConstructionFootComposition } from "./engine/constructionFootComposition";
import { constructionFrameInventory, constructionParameterInventory, constructionFootEvidenceBoundary } from "./engine/constructionFootEvidence";
import { constructionFootMorphologyAudit } from "./engine/constructionFootMorphologyAudit";
import { constructionFootSourceRecovery, reviewConstructionFootSourceForm } from "./engine/constructionFootSourceRecovery";
import { constructionFrameTerminology } from "./engine/constructionFrameTerminology";
import { constructionFrameMacroAssociations } from "./engine/constructionFrameContrastEvidence";
import { reviewConstructionCoupling } from "./engine/constructionCouplingEvidence";
import { reviewConstructionMacro } from "./engine/constructionMacroEvidence";
import { handFlameConstructionExample } from "./engine/constructionWorkedExampleEvidence";
import { constructionStageRelationshipEvidence } from "./engine/constructionStageRelationshipEvidence";
import { constructionStageContractProfiles } from "./engine/constructionStageContractProfiles";
import { reviewFusedConstructionReference } from "./engine/constructionFusedReferenceEvidence";
import { reviewPerformedReferenceEvidence } from "./engine/constructionPerformedReferenceEvidence";
import { reviewConstructionReferenceInventory } from "./engine/constructionReferenceInventory";
import { reviewKSeriesExample } from "./engine/constructionKSeriesExampleEvidence";
import { githubBlobUrl } from "./engine/githubSourceLinks";

const GITHUB_SOURCE_REF = __GITHUB_SOURCE_REF__;

type Section = "Overview" | "Documentation" | "Playground" | "Test suite" | "Research & review";

const phase6gFixtureAudit = auditPhase6GFixtures(
  phase6gFixtureData.suiteId,
  phase6gFixtureData.cases as Phase6GFixture[]
);
const phase6gFixtures = phase6gFixtureData.cases as Phase6GFixture[];
const navigation: { label: Section; icon: typeof Activity; group: string }[] = [
  { label: "Overview", icon: Layers3, group: "WORKSPACE" },
  { label: "Documentation", icon: BookOpen, group: "LANGUAGE" },
  { label: "Playground", icon: Braces, group: "LANGUAGE" },
  { label: "Test suite", icon: TestTube2, group: "QUALITY" },
  { label: "Research & review", icon: FlaskConical, group: "QUALITY" }
];

const principles: { status: Status; title: string; detail: string }[] = [
  { status: "Canonical", title: "Specification is authoritative", detail: "Implemented behaviour must trace back to an approved rule in the canonical specification." },
  { status: "Provisional", title: "Audit findings stay provisional", detail: "An audit can identify a conflict without silently changing the language definition." },
  { status: "Open question", title: "Unknowns remain visible", detail: "Unresolved grammar and semantic questions are recorded instead of guessed." },
  { status: "Deprecated", title: "History remains traceable", detail: "Superseded forms should retain their history and alias information where appropriate." }
];


function StatusPill({ status }: { status: Status }) {
  return <span className={"status status-" + status.toLowerCase().replaceAll(" ", "-")}>{status}</span>;
}

type WorkflowStep = { name: string; status: string; conclusion: string | null; number: number };
type WorkflowJob = { id: number; name: string; status: string; conclusion: string | null; html_url: string; steps?: WorkflowStep[] };
type WorkflowRun = { id: number; name: string; run_number: number; status: string; conclusion: string | null; html_url: string; created_at: string; updated_at: string; head_sha: string; head_commit?: { message?: string }; event: string };
type WorkflowData = { workflow_runs: WorkflowRun[] };
type RegistryTestResult = { id: string; title: string; status: string; durationMs: number | null; file: string };
type RegistryResults = {
  generatedAt: string;
  commit: string | null;
  runId: string | null;
  runAttempt: string | null;
  counts: { total: number; passed: number; failed: number; skipped: number; unmapped: number };
  tests: RegistryTestResult[];
};

function formatRunStatus(status: string, conclusion: string | null) {
  if (status !== "completed") return status.replaceAll("_", " ");
  return conclusion ?? "completed";
}
function prettyDate(value: string) {
  return new Date(value).toLocaleString(undefined, { dateStyle: "medium", timeStyle: "short" });
}

type LocalSourceRecord = {
  name: string;
  type: string;
  bytes: number;
  sha256: string | null;
  status: "EXTRACTED" | "INVALID" | "UNSUPPORTED" | "TOO-LARGE";
  textLength: number;
  lineCount: number;
  detail: string;
  preview: string;
};

function SourceRecoveryWorkbench() {
  const [records, setRecords] = useState<LocalSourceRecord[]>([]);
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState("Files are processed locally in this browser. Nothing is uploaded.");
  const maxBytes = 20 * 1024 * 1024;

  async function inspectFiles(fileList: FileList | null) {
    if (!fileList?.length) return;
    setBusy(true);
    setMessage("Reading selected files locally…");
    const next: LocalSourceRecord[] = [];
    for (const file of Array.from(fileList)) {
      const ext = file.name.split(".").pop()?.toLowerCase() ?? "";
      const supported = ["txt", "md", "json", "csv"].includes(ext);
      if (!supported) {
        next.push({ name: file.name, type: ext || "unknown", bytes: file.size, sha256: null, status: "UNSUPPORTED", textLength: 0, lineCount: 0, detail: "Browser intake currently supports TXT, Markdown, JSON and CSV. Use the repository's offline source_intake.py for DOCX, PDF and ZIP archives.", preview: "" });
        continue;
      }
      if (file.size > maxBytes) {
        next.push({ name: file.name, type: ext, bytes: file.size, sha256: null, status: "TOO-LARGE", textLength: 0, lineCount: 0, detail: "File exceeds the 20 MiB browser intake limit.", preview: "" });
        continue;
      }
      try {
        const bytes = await file.arrayBuffer();
        const digest = await crypto.subtle.digest("SHA-256", bytes);
        const sha256 = Array.from(new Uint8Array(digest), value => value.toString(16).padStart(2, "0")).join("");
        const content = new TextDecoder("utf-8", { fatal: true }).decode(bytes);
        let detail = "UTF-8 text extracted. Original file remains unchanged.";
        let status: LocalSourceRecord["status"] = "EXTRACTED";
        if (ext === "json") {
          try { JSON.parse(content); detail += " JSON syntax is valid."; }
          catch (error) { status = "INVALID"; detail = "JSON syntax check failed: " + (error instanceof Error ? error.message : "invalid JSON"); }
        }
        if (ext === "csv") detail += " Row count is a physical-line estimate; quoted multiline CSV records are not parsed.";
        next.push({ name: file.name, type: ext, bytes: file.size, sha256, status, textLength: content.length, lineCount: content.length ? content.split(/\r\n|\n|\r/).length : 0, detail, preview: content.slice(0, 700) });
      } catch (error) {
        next.push({ name: file.name, type: ext, bytes: file.size, sha256: null, status: "INVALID", textLength: 0, lineCount: 0, detail: error instanceof Error ? error.message : "Unable to decode file as UTF-8.", preview: "" });
      }
    }
    setRecords(current => [...next, ...current]);
    setMessage("Inspection complete. This is an intake record, not source approval or canon promotion.");
    setBusy(false);
  }

  function downloadManifest() {
    const payload = {
      schema: "anime-source-intake-manifest-v1",
      generatedAt: new Date().toISOString(),
      execution: "browser-local",
      upload: false,
      records
    };
    const blob = new Blob([JSON.stringify(payload, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = "anime-source-intake-manifest.json";
    anchor.click();
    URL.revokeObjectURL(url);
  }

  return <section className="audit-item source-recovery-workbench">
    <div className="audit-item-top"><code>LOCAL SOURCE INTAKE · MVP</code><span className="audit-readiness audit-limited">READ-ONLY</span></div>
    <h2>Source Recovery Studio</h2>
    <p>Select local TXT, Markdown, JSON or CSV files to create a provenance record with exact byte size, SHA-256, extraction status and a bounded text preview. Files are not sent to a server.</p>
    <label htmlFor="source-recovery-files"><strong>Select source files</strong></label>
    <input id="source-recovery-files" type="file" multiple accept=".txt,.md,.json,.csv,text/plain,text/markdown,application/json,text/csv" disabled={busy} onChange={event => { void inspectFiles(event.target.files); event.currentTarget.value = ""; }} />
    <p role="status" aria-live="polite">{message}</p>
    {records.length > 0 && <>
      <div className="test-case-meta"><span>{records.length} intake records</span><span>{records.filter(record => record.status === "EXTRACTED").length} extracted</span><span>{records.filter(record => record.status !== "EXTRACTED").length} require attention</span></div>
      <div className="source-intake-records">{records.map((record, index) => <details key={record.name + record.sha256 + index}>
        <summary><strong>{record.name}</strong> · {record.status} · {record.bytes.toLocaleString()} bytes</summary>
        <p>{record.detail}</p>
        <p><strong>Type:</strong> {record.type} · <strong>Characters:</strong> {record.textLength.toLocaleString()} · <strong>Lines:</strong> {record.lineCount.toLocaleString()}</p>
        <p><strong>SHA-256:</strong> <code>{record.sha256 ?? "not computed"}</code></p>
        {record.preview && <pre>{record.preview}</pre>}
      </details>)}</div>
      <button type="button" className="secondary-button" onClick={downloadManifest}>Download intake manifest (JSON)</button>
      <button type="button" className="secondary-button" onClick={() => { setRecords([]); setMessage("Intake list cleared. No source files were modified."); }}>Clear intake list</button>
    </>}
    <p className="fixture-browser-caveat">DOCX, PDF and ZIP are deliberately not decoded by this browser-only MVP. Use <code>python tools/source_intake.py</code> for the offline repository workflow. Hashes identify bytes; they do not prove authorship, completeness or canon status.</p>
  </section>;
}

function App() {
  const [section, setSection] = useState<Section>("Overview");
  const [query, setQuery] = useState("");
  const [docStatus, setDocStatus] = useState<Status | "All">("All");
  const [docSourceKind, setDocSourceKind] = useState("All");
  const [editor, setEditor] = useState("");
  const [analysis, setAnalysis] = useState<SurfaceParseResult | null>(null);
  const [vernacularEditor, setVernacularEditor] = useState("teshi wish fezo");
  const [vernacularResult, setVernacularResult] = useState<ModernVernacularParseResult | null>(null);
  const [vernacularV11Editor, setVernacularV11Editor] = useState("teshi nak rawu");
  const [vernacularV11Result, setVernacularV11Result] = useState<ModernVernacularV11ParseResult | null>(null);
  const [vernacularV12Editor, setVernacularV12Editor] = useState("teshi bul li fape ka fezo");
  const [vernacularV12Result, setVernacularV12Result] = useState<ModernVernacularV12ParseResult | null>(null);
  const [vernacularV13Editor, setVernacularV13Editor] = useState("teshi ful tava gezi");
  const [vernacularV13Result, setVernacularV13Result] = useState<ModernVernacularV13ParseResult | null>(null);
  const [vernacularV14Editor, setVernacularV14Editor] = useState("teshi fam ful tava gezi");
  const [vernacularV14Result, setVernacularV14Result] = useState<ModernVernacularV14ParseResult | null>(null);
  const [unifiedVernacularEditor, setUnifiedVernacularEditor] = useState("teshi fam wish fezo");
  const [unifiedVernacularResult, setUnifiedVernacularResult] = useState<ModernVernacularUnifiedParseResult | null>(null);
  const semanticAnalysis = useMemo(() => analysis ? analyseSurfaceParse(analysis) : null, [analysis]);
  const expressionConstructionBridge = useMemo(() => analysis ? reviewExpressionConstructionBridge(analysis) : null, [analysis]);
  const [lexiconQuery, setLexiconQuery] = useState("pa");
  const [selectedFixtureId, setSelectedFixtureId] = useState("P6G-FX-001");
  const [selectedResourceFixtureId, setSelectedResourceFixtureId] = useState("RES19-01");
  const [selectedAuthorityFixtureId, setSelectedAuthorityFixtureId] = useState("AUTH20-01");
  const [selectedPolicyFixtureId, setSelectedPolicyFixtureId] = useState("POL21-01");
  const [selectedValidationGateId, setSelectedValidationGateId] = useState("CON12-01");
  const [selectedInvocationStageId, setSelectedInvocationStageId] = useState("INV15-01");
  const [runtimePreviewScenario, setRuntimePreviewScenario] = useState<RuntimePreviewScenario>("READY-SAMPLE");
  const [resourceConservationScenario, setResourceConservationScenario] = useState<ResourceConservationPreviewScenario>("BALANCED");
  const constructionStageLabels: { stage: ConstructionStage; label: string }[] = [
    { stage: "reference", label: "Reference" },
    { stage: "spatial-role-vector", label: "Spatial role / vector" },
    { stage: "construction-feet", label: "Construction Feet" },
    { stage: "couplings", label: "Couplings" },
    { stage: "quantity", label: "Quantity" },
    { stage: "control", label: "Control" },
    { stage: "release", label: "Release" }
  ];
  const [constructionEvidence, setConstructionEvidence] = useState<Record<ConstructionStage, { status: ConstructionEvidenceStatus; content: string }>>({
    reference: { status: "NOT-SUPPLIED", content: "" },
    "spatial-role-vector": { status: "NOT-SUPPLIED", content: "" },
    "construction-feet": { status: "NOT-SUPPLIED", content: "" },
    couplings: { status: "NOT-SUPPLIED", content: "" },
    quantity: { status: "NOT-SUPPLIED", content: "" },
    control: { status: "NOT-SUPPLIED", content: "" },
    release: { status: "NOT-SUPPLIED", content: "" }
  });
  const [constructionReferenceToken, setConstructionReferenceToken] = useState<ConstructionReferenceToken>("MI");
  const [constructionReferenceId, setConstructionReferenceId] = useState("");
  const [constructionKSeriesInput, setConstructionKSeriesInput] = useState("ken");
  const constructionKSeriesReview = useMemo(() => reviewKSeriesExample(constructionKSeriesInput), [constructionKSeriesInput]);
  const [constructionFusedReferenceInput, setConstructionFusedReferenceInput] = useState("mel");
  const constructionFusedReferenceReview = useMemo(() => reviewFusedConstructionReference(constructionFusedReferenceInput), [constructionFusedReferenceInput]);
  const [constructionPerformedReferenceInput, setConstructionPerformedReferenceInput] = useState("re");
  const constructionPerformedReferenceReview = useMemo(() => reviewPerformedReferenceEvidence(constructionPerformedReferenceInput), [constructionPerformedReferenceInput]);
  const [constructionReferenceInventoryInput, setConstructionReferenceInventoryInput] = useState("MI");
  const constructionReferenceInventoryReview = useMemo(() => reviewConstructionReferenceInventory(constructionReferenceInventoryInput), [constructionReferenceInventoryInput]);
  const [constructionFootInput, setConstructionFootInput] = useState("pa");
  const constructionFootReview = useMemo(() => reviewConstructionFootShape(constructionFootInput.trim()), [constructionFootInput]);
  const constructionFootCompositionReview = useMemo(() => reviewConstructionFootComposition(constructionFootInput.trim()), [constructionFootInput]);
  const [constructionCouplingInput, setConstructionCouplingInput] = useState("ha");
  const constructionCouplingReview = useMemo(() => reviewConstructionCoupling(constructionCouplingInput), [constructionCouplingInput]);
  const [constructionMacroInput, setConstructionMacroInput] = useState("TRAK");
  const [constructionFootSourceReview, setConstructionFootSourceReview] = useState(() => reviewConstructionFootSourceForm("kan"));
  const constructionMacroReview = useMemo(() => reviewConstructionMacro(constructionMacroInput), [constructionMacroInput]);
  const constructionReference = useMemo(
    () => bindConstructionReference(constructionReferenceToken, constructionReferenceId),
    [constructionReferenceToken, constructionReferenceId]
  );
  const constructionBoundaryReview = useMemo(
    () => reviewConstructionReferenceBoundary(constructionReference.current, { type: "PHRASE-BOUNDARY", marker: "·" }),
    [constructionReference]
  );
  const constructionRecord: ConstructionRecord = {
    id: "playground-construction-record",
    elements: constructionStageLabels
      .map(({ stage }) => ({ stage, status: constructionEvidence[stage].status, content: constructionEvidence[stage].content }))
  };
  const constructionReview = useMemo(() => reviewConstructionRecord(constructionRecord), [constructionEvidence]);
  const [contractOperation, setContractOperation] = useState("kren");
  const [contractTarget, setContractTarget] = useState("");
  const [contractDesiredOutcome, setContractDesiredOutcome] = useState("");
  const [contractMechanism, setContractMechanism] = useState("");
  const [contractSpatialRole, setContractSpatialRole] = useState("unresolved");
  const [contractPreconditions, setContractPreconditions] = useState("");
  const [contractConstraints, setContractConstraints] = useState("");
  const [contractResourceNotes, setContractResourceNotes] = useState("");
  const [contractAuthorityReference, setContractAuthorityReference] = useState("");
  const [contractConsentRequirement, setContractConsentRequirement] = useState("unresolved");
  const [mobileNav, setMobileNav] = useState(false);
  const [selectedDoc, setSelectedDoc] = useState(docs[0].title);
  const [testQuery, setTestQuery] = useState("");
  const [testGroup, setTestGroup] = useState<"All" | "Parser" | "Dimensions" | "Semantic types" | "Operator contracts" | "Source lexicon" | "Fixture audit" | "Surface parser" | "Incantation contracts">("All");
  const [workflowRuns, setWorkflowRuns] = useState<WorkflowRun[]>([]);
  const [workflowJobs, setWorkflowJobs] = useState<WorkflowJob[]>([]);
  const [workflowLoading, setWorkflowLoading] = useState(true);
  const [workflowError, setWorkflowError] = useState<string | null>(null);
  const [workflowUpdatedAt, setWorkflowUpdatedAt] = useState<string | null>(null);
  const [registryResults, setRegistryResults] = useState<RegistryResults | null>(null);
  const [registryResultsError, setRegistryResultsError] = useState<string | null>(null);

  const workflowController = useRef<AbortController | null>(null);

  const refreshWorkflow = async () => {
    workflowController.current?.abort();
    const controller = new AbortController();
    workflowController.current = controller;
    let timedOut = false;
    const timeout = window.setTimeout(() => {
      timedOut = true;
      controller.abort();
    }, 12000);
    // A timed-out request is still the active refresh and must report a useful
    // error; a request superseded by a newer refresh must remain silent.
    const isCurrent = () => workflowController.current === controller && (timedOut || !controller.signal.aborted);
    const requestError = (error: unknown, fallback: string) => timedOut
      ? "Status refresh timed out after 12 seconds. Try refreshing again."
      : error instanceof Error ? error.message : fallback;

    setWorkflowLoading(true);
    setWorkflowError(null);

    // Load the CI run list and per-test report independently. A GitHub API
    // rate limit must not prevent the static report from being displayed.
    const runsTask = (async () => {
      const response = await fetch(
        "https://api.github.com/repos/sixtoast/Anime-language-/actions/runs?branch=main&per_page=10",
        { headers: { Accept: "application/vnd.github+json" }, cache: "no-store", signal: controller.signal }
      );
      if (!response.ok) throw new Error(`GitHub returned HTTP ${response.status} while loading workflow runs.`);
      const data = await response.json() as WorkflowData;
      return data.workflow_runs ?? [];
    })();

    const reportTask = (async () => {
      const response = await fetch(
        "https://raw.githubusercontent.com/sixtoast/Anime-language-/ci-results/latest.json",
        { cache: "no-store", signal: controller.signal }
      );
      if (!response.ok) {
        if (response.status === 404) throw new Error("No published per-test report yet. It appears after a successful main-branch CI report step.");
        throw new Error(`GitHub returned HTTP ${response.status} while loading the per-test report.`);
      }
      return await response.json() as RegistryResults;
    })();

    try {
      const [runsResult, reportResult] = await Promise.allSettled([runsTask, reportTask]);
      if (!isCurrent()) return;

      if (runsResult.status === "fulfilled") {
        const runs = runsResult.value;
        setWorkflowRuns(runs);
        setWorkflowError(null);
        const latest = runs.find((run) => run.name === "CI") ?? runs[0];
        if (latest) {
          try {
            const jobsResponse = await fetch(
              `https://api.github.com/repos/sixtoast/Anime-language-/actions/runs/${latest.id}/jobs?per_page=100`,
              { headers: { Accept: "application/vnd.github+json" }, cache: "no-store", signal: controller.signal }
            );
            if (!jobsResponse.ok) throw new Error(`GitHub returned HTTP ${jobsResponse.status} while loading job details.`);
            const jobData = await jobsResponse.json() as { jobs: WorkflowJob[] };
            if (isCurrent()) setWorkflowJobs(jobData.jobs ?? []);
          } catch (error) {
            if (!controller.signal.aborted && isCurrent()) {
              setWorkflowJobs([]);
              setWorkflowError(requestError(error, "Could not load GitHub Actions job details."));
            }
          }
        } else {
          setWorkflowJobs([]);
        }
      } else if (isCurrent()) {
        setWorkflowError(requestError(runsResult.reason, "Could not load GitHub Actions results."));
      }

      if (reportResult.status === "fulfilled") {
        if (isCurrent()) {
          setRegistryResults(reportResult.value);
          setRegistryResultsError(null);
        }
      } else if (isCurrent()) {
        setRegistryResultsError(requestError(reportResult.reason, "Could not load the published per-test report."));
      }

      if (isCurrent()) setWorkflowUpdatedAt(new Date().toISOString());
    } catch (error) {
      if (isCurrent()) setWorkflowError(requestError(error, "Could not load GitHub Actions results."));
    } finally {
      window.clearTimeout(timeout);
      if (workflowController.current === controller) {
        workflowController.current = null;
        setWorkflowLoading(false);
      }
    }
  };

  useEffect(() => {
    void refreshWorkflow();
    return () => {
      workflowController.current?.abort();
    };
  }, []);

  const latestCiRun = workflowRuns.find((run) => run.name === "CI") ?? workflowRuns[0];
  const latestBuildStep = workflowJobs
    .flatMap((job) => job.steps ?? [])
    .find((step) => /type-check and build/i.test(step.name));

  const sourceKinds = useMemo(() => Array.from(new Set(docs.map((doc) => doc.sourceKind))).sort(), []);
  const filteredDocs = useMemo(() => filterDocuments(query, docStatus, docSourceKind), [query, docStatus, docSourceKind]);
  const selectedDocument = filteredDocs.find((item) => item.title === selectedDoc) ?? filteredDocs[0] ?? docs[0];
  const lexiconInspection = useMemo(() => {
    const form = lexiconQuery.trim().toLowerCase();
    if (!form) return null;
    return {
      ...inspectLexiconForm(bundledLexiconLoad.registry, form),
      alias: bundledLexiconLoad.registry.aliases.get(form),
      nonAtomicEntry: bundledLexiconLoad.registry.nonAtomicEntries.get(form)
    };
  }, [lexiconQuery]);
  const selectedPhase6GFixture = useMemo(() => phase6gFixtures.find((fixture) => fixture.id === selectedFixtureId) ?? phase6gFixtures[0], [selectedFixtureId]);
  const selectedResourceFixture = useMemo(() => resourceAccountingFixtures.find((fixture) => fixture.id === selectedResourceFixtureId) ?? resourceAccountingFixtures[0], [selectedResourceFixtureId]);
  const selectedAuthorityFixture = useMemo(() => authorityDecisionFixtures.find((fixture) => fixture.id === selectedAuthorityFixtureId) ?? authorityDecisionFixtures[0], [selectedAuthorityFixtureId]);
  const selectedPolicyFixture = useMemo(() => policyProfileCompositionFixtures.find((fixture) => fixture.id === selectedPolicyFixtureId) ?? policyProfileCompositionFixtures[0], [selectedPolicyFixtureId]);
  const selectedValidationGate = useMemo(() => validationGateSequence.find((stage) => stage.id === selectedValidationGateId) ?? validationGateSequence[0], [selectedValidationGateId]);
  const selectedInvocationStage = useMemo(() => invocationLifecycleSequence.find((stage) => stage.id === selectedInvocationStageId) ?? invocationLifecycleSequence[0], [selectedInvocationStageId]);
  const runtimePreview = useMemo(() => evaluateIncantationRuntimePreview(runtimePreviewScenario), [runtimePreviewScenario]);
  const resourceConservationPreview = useMemo(() => evaluateResourceConservationPreview(resourceConservationScenario), [resourceConservationScenario]);
  const contractWorksheet = useMemo(() => ({
    recordType: "ARCANE-INCANTATION-CONTRACT-WORKSHEET",
    specificationLayer: "Modern incantation design v1.0–v2.0",
    state: "DRAFT — NOT VALIDATED",
    operation: { token: contractOperation, status: "Operation-class selection only; a complete spoken signature is not established here." },
    target: contractTarget.trim() ? { reference: contractTarget.trim(), status: "User-supplied reference; resolution not checked." } : { status: "UNSPECIFIED" },
    requestedOutcome: contractDesiredOutcome.trim() || null,
    mechanism: contractMechanism.trim() || null,
    spatialRole: contractSpatialRole === "unresolved" ? { status: "UNRESOLVED" } : { token: contractSpatialRole, status: "User-selected role; geometry and feasibility not checked." },
    preconditions: contractPreconditions.trim() || null,
    constraints: contractConstraints.trim() || null,
    resources: { notes: contractResourceNotes.trim() || null, status: "NOT-ASSESSED", rule: "No unit, budget, reservation, conservation or physical feasibility check is performed." },
    authority: { decisionReference: contractAuthorityReference.trim() || null, status: "NOT-ASSESSED", rule: "A reference is not proof of a trusted, current, in-scope permit." },
    consent: { requesterDeclaration: contractConsentRequirement, status: "NOT-ASSESSED", rule: "This selection is not evidence of consent or authorisation." },
    validation: "NOT-PERFORMED",
    feasibility: "NOT-ASSESSED",
    execution: "NOT-EXECUTED",
    limitations: [
      "This is a design worksheet, not spoken Arcane syntax.",
      "No parser, evaluator, authority service, consent service or executor is called.",
      "Empty fields remain unresolved; they are not inferred from context.",
      "Validation, mechanism feasibility, resources, authority, consent and execution are independent gates."
    ]
  }), [contractOperation, contractTarget, contractDesiredOutcome, contractMechanism, contractSpatialRole, contractPreconditions, contractConstraints, contractResourceNotes, contractAuthorityReference, contractConsentRequirement]);

  const changeSection = (next: Section) => {
    setSection(next);
    setMobileNav(false);
  };

  return (
    <div className="app-shell">
      <aside className={"sidebar " + (mobileNav ? "sidebar-open" : "")}>
        <div className="brand">
          <div className="brand-mark"><Sparkles size={19} /></div>
          <div><div className="brand-name">ANIME <span>LANGUAGE</span></div><div className="brand-subtitle">LANGUAGE WORKBENCH</div></div>
          <button className="icon-button mobile-close" onClick={() => setMobileNav(false)} aria-label="Close navigation"><X size={18}/></button>
        </div>
        <button className="workspace-switcher">
          <div className="workspace-avatar">A</div>
          <div className="workspace-meta"><strong>Anime Language</strong><span>Personal workspace</span></div>
          <ChevronDown size={15} className="muted-icon"/>
        </button>
        <nav className="side-nav" aria-label="Main sections">
          {["WORKSPACE", "LANGUAGE", "QUALITY"].map((group) => (
            <div className="nav-group" key={group}>
              <div className="nav-label">{group}</div>
              {navigation.filter((item) => item.group === group).map(({ label, icon: Icon }) => (
                <button key={label} className={"nav-item " + (section === label ? "active" : "")} aria-current={section === label ? "page" : undefined} onClick={() => changeSection(label)}>
                  <Icon size={17} strokeWidth={1.8}/><span>{label}</span>
                  {label === "Research & review" && <span className="nav-count">5</span>}
                </button>
              ))}
            </div>
          ))}
        </nav>
        <div className="sidebar-bottom">
          <div className="repo-card">
            <GitBranch size={15}/><div><strong>main</strong><span>GitHub repository</span></div>
            <a href="https://github.com/sixtoast/Anime-language-" target="_blank" rel="noreferrer" aria-label="Open GitHub repository">↗</a>
          </div>
          <div className="profile-row"><div className="profile-avatar">S</div><div><strong>Project owner</strong><span>Specification-led development</span></div><button className="icon-button" title="Project principles" onClick={() => changeSection("Documentation")}><CircleHelp size={17}/></button></div>
        </div>
      </aside>

      {mobileNav && <button className="mobile-backdrop" onClick={() => setMobileNav(false)} aria-label="Close navigation overlay"/>}

      <main className="main-area">
        <header className="topbar">
          <div className="breadcrumbs"><button className="icon-button mobile-menu" onClick={() => setMobileNav(true)} aria-label="Open navigation"><Menu size={19}/></button><span>Anime Language</span><span className="crumb-slash">/</span><strong>{section}</strong></div>
          <div className="topbar-actions"><span className="version-chip"><span className="pulse-dot"/> INCANTATIONS v2.1 · WORKBENCH</span><button className="icon-button" title="Search documentation" onClick={() => { changeSection("Documentation"); document.getElementById("global-search")?.focus(); }}><Search size={18}/></button></div>
        </header>

        {section === "Overview" && <section className="page-content">
          <div className="eyebrow"><span className="eyebrow-line"/> YOUR LANGUAGE, ONE SOURCE OF TRUTH</div>
          <div className="hero-row"><div><h1>Build the language.<br/><span>Prove the rules.</span></h1><p className="hero-copy">A dedicated workspace to document, test, and investigate the Anime language — with every rule traceable to its source.</p></div><div className="hero-emblem"><div className="emblem-ring ring-one"/><div className="emblem-ring ring-two"/><div className="emblem-core"><Sparkles size={31}/></div><span className="emblem-caption">SPECIFICATION<br/>FIRST</span></div></div>
          <div className="notice"><div className="notice-icon"><ShieldCheck size={18}/></div><div><strong>Specification-first mode</strong><p>Audit notes are not canonical rules. The language engine will only enforce behaviour supported by verified source material.</p></div><span className="notice-tag">GUARDRAIL 01</span></div>
          <div className="cockpit-panel">
            <div className="cockpit-heading">
              <div><div className="eyebrow"><Activity size={13}/> DEVELOPMENT COCKPIT · LIVE EVIDENCE</div><h2>Project health at a glance</h2></div>
              <button className="secondary-button" onClick={() => changeSection("Test suite")}>Open test laboratory <span aria-hidden="true">→</span></button>
            </div>
            <div className="cockpit-metrics">
              <div><span>LATEST WORKFLOW</span><strong className={workflowLoading ? "" : latestCiRun?.status !== "completed" ? "cockpit-warn" : latestCiRun.conclusion === "success" ? "cockpit-good" : "cockpit-bad"}>{workflowLoading ? "Loading…" : latestCiRun ? formatRunStatus(latestCiRun.status, latestCiRun.conclusion) : "Unavailable"}</strong><small>{latestCiRun ? <a href={latestCiRun.html_url} target="_blank" rel="noreferrer">Run #{latestCiRun.run_number} · {latestCiRun.head_sha.slice(0,7)} ↗</a> : "No workflow evidence loaded"}</small></div>
              <div><span>WEBSITE BUILD</span><strong className={workflowLoading ? "" : latestBuildStep?.status === "completed" && latestBuildStep.conclusion === "success" ? "cockpit-good" : latestBuildStep?.status === "completed" && latestBuildStep.conclusion === "failure" ? "cockpit-bad" : "cockpit-warn"}>{workflowLoading ? "Loading…" : workflowError ? "Unavailable" : latestBuildStep ? formatRunStatus(latestBuildStep.status, latestBuildStep.conclusion) : "Unavailable"}</strong><small>Type-check and build step</small></div>
              <div><span>PER-TEST REPORT</span><strong className={registryResults ? (latestCiRun && registryResults.commit !== latestCiRun.head_sha ? "cockpit-warn" : registryResults.counts.failed > 0 ? "cockpit-bad" : "cockpit-good") : "cockpit-warn"}>{registryResults ? (latestCiRun && registryResults.commit !== latestCiRun.head_sha ? "Stale / different commit" : registryResults.counts.failed > 0 ? "Failures reported" : "Report loaded") : "Unavailable"}</strong><small>{registryResults ? registryResults.counts.passed + " passed · " + registryResults.counts.failed + " failed · " + registryResults.counts.unmapped + " unmapped" : (registryResultsError ?? "Waiting for published results")}</small></div>
            </div>
            <p className="cockpit-note">{workflowError ? "Live workflow data could not be confirmed. Treat CI health as unavailable until refreshed." : latestCiRun?.conclusion === "failure" ? "The workflow is failing. Open the run for the exact failing step; a successful website build does not mean the entire test suite passed." : latestCiRun?.status !== "completed" ? "The latest workflow is still running or queued. Its final result is not known yet." : "Workflow state comes from GitHub Actions. Per-test results are shown separately and may refer to a different commit."}</p>
          </div>
          <section className="next-task-panel" aria-labelledby="next-task-title">
            <div className="next-task-heading">
              <div><div className="eyebrow"><Layers3 size={13}/> INCANTATION ARCHITECTURE · NEXT INCREMENT</div><h2 id="next-task-title">Close the expression-to-construction gap</h2></div>
              <span className="next-task-priority">HIGH PRIORITY</span>
            </div>
            <p className="next-task-summary">The read-only invocation diagnostics are now connected in the Playground. The next Incantations milestone is to make the boundary between a formal expression, a complete construction and a feasible casting explicit. A valid expression must never be mistaken for a complete or physically realisable spell.</p>
            <div className="next-task-grid gate-architecture-grid">
              <div><span>GATE L · LINGUISTIC VALIDITY</span><p>Check versioned token provenance, approved signatures and arity, typed arguments, grouping and unique reference resolution. Current readiness: partial; unresolved signatures remain blocked rather than guessed.</p></div>
              <div><span>GATE C · CONSTRUCTION COMPLETENESS</span><p>Check target and initial state, state transition, coupling participants and pathway, mechanism, spatial scope, constraints, resources, termination and failure behaviour. The Phase 4 Expression-to-Construction compile bridge is a separate, still-unrecovered contract; the panel below records only provisional AST-to-Incantation traceability.</p></div>
              <div><span>GATE P · CASTING FEASIBILITY</span><p>Assess resource demand, mana propagation, timing, coherence, target susceptibility, caster limits and stability against an explicit model. Current readiness: not assessed; wording alone cannot earn a feasibility pass.</p></div>
            </div>
            <div className="next-task-grid gate-architecture-support">
              <div><span>IMPLEMENTATION ORDER</span><p>First reconcile source-backed operator contracts and reference resolution; then define only the missing construction records and mappings; finally connect them to the existing validation, resource, authority, policy and lifecycle evaluators.</p></div>
              <div><span>NON-NEGOTIABLE BOUNDARY</span><p>A parser result is not a construction pass. A construction review is not a feasibility result. An eligible invocation is not an executed spell or a verified physical effect.</p></div>
            </div>
            <div className="next-task-actions">
              <button className="secondary-button" onClick={() => changeSection("Playground")}>Open invocation diagnostics <span aria-hidden="true">→</span></button>
              <button className="secondary-button" onClick={() => changeSection("Documentation")}>Open Incantations canon <span aria-hidden="true">→</span></button>
              <a className="secondary-button" href={githubBlobUrl("docs/research/phase7w-incantation-readiness-and-construction-gate.md", GITHUB_SOURCE_REF)} target="_blank" rel="noreferrer">Open readiness and construction gate <span aria-hidden="true">↗</span></a>
            </div>
            <p className="next-task-caveat">Evidence basis: Phase 7W readiness assessment and Incantations v1.0–v2.1. This is a development priority, not a new canon rule. Unknown signatures, construction mappings and physical parameters remain explicitly unresolved.</p>
          </section>
          <div className="section-heading"><div><div className="eyebrow">WORKSPACE</div><h2>Everything in one place</h2></div><span className="section-caption">SOURCE RECOVERY · PHASE 01</span></div>
          <div className="feature-grid">
            <button className="feature-card" onClick={() => changeSection("Documentation")}><div className="feature-icon icon-violet"><BookOpen size={20}/></div><div className="feature-title">Language reference <span>↗</span></div><p>Specification, grammar, operators, semantics and terminology with explicit source status.</p><div className="feature-foot"><span>Explore documentation</span><span>01</span></div></button>
            <button className="feature-card" onClick={() => changeSection("Playground")}><div className="feature-icon icon-blue"><Braces size={20}/></div><div className="feature-title">Expression playground <span>↗</span></div><p>Parse the implemented provisional Phase 6G surface-like notation and inspect syntax trees or diagnostics.</p><div className="feature-foot"><span>Open playground</span><span>02</span></div></button>
            <button className="feature-card" onClick={() => changeSection("Test suite")}><div className="feature-icon icon-green"><TestTube2 size={20}/></div><div className="feature-title">Test & validate <span>↗</span></div><p>Build a regression suite for accepted forms, rejected forms and ambiguous expressions.</p><div className="feature-foot"><span>Review test plan</span><span>03</span></div></button>
            <button className="feature-card" onClick={() => changeSection("Research & review")}><div className="feature-icon icon-amber"><FlaskConical size={20}/></div><div className="feature-title">Research & review <span>↗</span></div><p>Track evidence, open questions, competing interpretations and proposed changes.</p><div className="feature-foot"><span>Review open work</span><span>04</span></div></button>
          </div>
          <div className="source-recovery-panel">
            <div className="source-recovery-heading">
              <div><div className="eyebrow">SOURCE RECOVERY · INVENTORY SNAPSHOT</div><h2>Known sources, visible gaps</h2></div>
              <span className="source-audit-state">STRUCTURAL ONLY · 13 OCT 2026</span>
            </div>
            <p className="source-recovery-intro">The repository inventory is an initial structural scan, not a completed content audit. These counts describe what has been inventoried; they do not mean every source has been read, reconciled, or approved.</p>
            <div className="source-recovery-metrics">
              <div><strong>63</strong><span>Loose files in <code>sources/originals/</code></span></div>
              <div><strong>307</strong><span>Non-directory entries in the ZIP archive</span></div>
              <div><strong>52</strong><span>Exact-duplicate content groups inside the archive</span></div>
              <div><strong>150</strong><span>Archive entries matching loose files by SHA-256</span></div>
            </div>
            <div className="source-gap-list">
              <div><span className="source-gap-marker" /><p><strong>PDF extraction pending.</strong> PDF content has not yet been fully extracted into the searchable text inventory.</p></div>
              <div><span className="source-gap-marker" /><p><strong>Empty source file recorded.</strong> <code>PHASE_2_README.txt</code> is zero bytes in the current inventory.</p></div>
              <div><span className="source-gap-marker" /><p><strong>Duplicates require interpretation.</strong> Byte-identical files are recorded for traceability; duplicates are not automatically deleted or treated as semantically redundant.</p></div>
            </div>
            <div className="source-recovery-actions">
              <a className="secondary-button" href={githubBlobUrl("sources/SOURCE-INVENTORY.md", GITHUB_SOURCE_REF)} target="_blank" rel="noreferrer">Open full source inventory <span aria-hidden="true">↗</span></a>
              <button className="secondary-button" onClick={() => changeSection("Documentation")}>Browse source catalogue <span>→</span></button>
              <button className="secondary-button" onClick={() => changeSection("Research & review")}>Review open evidence gaps <span>→</span></button>
            </div>
          </div>
          <div className="section-heading lower-heading"><div><div className="eyebrow">GOVERNANCE</div><h2>Rules need evidence</h2></div><span className="section-caption">NO SILENT CHANGES</span></div>
          <div className="principle-list">{principles.map((item, i) => <div className="principle-row" key={item.status}><div className="principle-index">{String(i + 1).padStart(2, "0")}</div><div className="principle-copy"><strong>{item.title}</strong><p>{item.detail}</p></div><StatusPill status={item.status}/></div>)}</div>
          <footer className="page-footer"><span><span className="footer-dot"/> Canonical sources imported · provisional audit parser implemented</span><span>BUILT FOR CLARITY, NOT GUESSWORK</span></footer>
        </section>}

        {section === "Documentation" && <section className="page-content">
          <div className="eyebrow"><span className="eyebrow-line"/> THE LANGUAGE REFERENCE</div><h1 className="page-title">Documentation<span>.</span></h1><p className="page-intro">A source-aware index for the recovered canonical specifications, provisional syntax audit, and continuity register. Source status, deployed application status, and automated test status are tracked separately.</p>
          <div className="search-bar"><Search size={18}/><input id="global-search" aria-label="Search documentation catalogue" value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search titles, topics, source type, status…"/><kbd>SEARCH</kbd></div>
          <div className="doc-filter-bar"><label>Source status<select aria-label="Filter documentation by source status" value={docStatus} onChange={(e) => setDocStatus(e.target.value as Status | "All")}><option value="All">All statuses</option>{(["Canonical","Provisional","Open question","Deprecated"] as Status[]).map((status) => <option key={status} value={status}>{status}</option>)}</select></label><label>Provenance type<select aria-label="Filter documentation by provenance type" value={docSourceKind} onChange={(e) => setDocSourceKind(e.target.value)}><option value="All">All source types</option>{sourceKinds.map((kind) => <option key={kind} value={kind}>{kind}</option>)}</select></label><span className="doc-result-count" role="status">{filteredDocs.length} of {docs.length} sources</span><button className="secondary-button" onClick={() => { setQuery(""); setDocStatus("All"); setDocSourceKind("All"); }} disabled={!query && docStatus === "All" && docSourceKind === "All"}>Reset filters</button></div>
          <div className="doc-layout"><div className="doc-list" aria-label="Documentation catalogue entries">{filteredDocs.map((doc) => <button key={doc.title} aria-pressed={selectedDocument.title === doc.title} className={"doc-row " + (selectedDocument.title === doc.title ? "doc-selected" : "")} onClick={() => setSelectedDoc(doc.title)}><div className="doc-icon"><FileText size={18}/></div><div className="doc-row-main"><strong>{doc.title}</strong><span>{doc.category}</span></div><StatusPill status={doc.status}/></button>)}{filteredDocs.length === 0 && <div className="empty-state" role="status">No sources match these filters. Try another status, source type, or search term.</div>}</div><div className="doc-detail">{(() => { const doc = selectedDocument; return <><div className="detail-top"><span className="detail-kicker">REFERENCE ENTRY</span><StatusPill status={doc.status}/></div><h2>{doc.title}</h2><p>{doc.description}</p><div className="detail-divider"/><div className="detail-meta"><span>Category</span><strong>{doc.category}</strong></div><div className="detail-meta"><span>Source citation</span><strong>{doc.sourcePath ? "Repository document" : "Not yet attached"}</strong></div><div className="detail-meta"><span>Source type</span><strong>{doc.sourceKind ?? "Not classified"}</strong></div><div className="detail-meta"><span>Provenance note</span><strong>{doc.sourceNote ?? "Source type needs review."}</strong></div><div className="detail-meta"><span>Implementation</span><strong>Not yet verified</strong></div>{doc.sourcePath && <a className="secondary-button source-link" href={githubBlobUrl(doc.sourcePath, GITHUB_SOURCE_REF)} target="_blank" rel="noreferrer">Open source document: {doc.title} <span aria-hidden="true">↗</span></a>}<div className="detail-callout"><CircleHelp size={17}/><p>Source status and implementation status are separate. Provisional audit notation is not silently promoted to canonical spoken grammar, and no test is labelled passed without execution evidence.</p></div><button className="secondary-button" onClick={() => changeSection("Research & review")}>Review source status <span>→</span></button></>; })()}</div></div>
        </section>}

        {section === "Playground" && <section className="page-content">
          <div className="eyebrow"><span className="eyebrow-line"/> EXPRESSION WORKSPACE</div><h1 className="page-title">Playground<span>.</span></h1><p className="page-intro">Parse the implemented provisional Phase 6G surface-like notation. This is a narrow parser subset, not a complete Arcane grammar, spoken-language interpreter, semantic validator, or spell executor.</p>
          <div className="engine-banner"><Activity size={18}/><div><strong>Phase 6G provisional surface parser connected</strong><p>Checks token structure, registered operator arity, numeral closure, explicit control blocks, and selected ambiguity cases. Source atoms use the pinned {BUNDLED_LEXICON_SOURCE.version} draft lexicon ({bundledLexiconLoad.rowCount} rows; {bundledLexiconLoad.aliasRowCount} alias records). Legacy alias rewriting is off by default, lexical collisions fail closed, and loading this source does not promote entries to canon.</p></div><span className="engine-status">SYNTAX ONLY</span></div>
          <section className="fixture-browser construction-inspector" aria-labelledby="construction-inspector-title">
            <div className="fixture-browser-head"><div><span className="detail-kicker">MANA CONSTRUCTION · EVIDENCE-AWARE WORKSPACE</span><h2 id="construction-inspector-title">Construction record inspector</h2></div><span>7 recovered stages</span></div>
            <p className="fixture-browser-intro">Enter a record against the recovered performed order. Each field is an evidence note, not a token parser. Choose the evidence status honestly; the inspector will not infer missing grammar, physical meaning or spell validity.</p>
            <div className="construction-reference-binding">
              <div className="detail-kicker">RECOVERED REFERENCE CONTEXT</div>
              <p>Reference persistence is documented until replaced. The recovered default scope is limited to the tokens listed here; this does not supply anatomical landmark rules.</p>
              <div className="construction-reference-controls">
                <label>Reference token
                  <select value={constructionReferenceToken} onChange={event => setConstructionReferenceToken(event.target.value as ConstructionReferenceToken)}>
                    <option value="MI">MI — default volume</option><option value="NI">NI — default volume</option><option value="RI">RI — default volume</option><option value="me">me — SELF-surface</option>
                  </select>
                </label>
                <label>Reference identity
                  <input value={constructionReferenceId} onChange={event => setConstructionReferenceId(event.target.value)} placeholder="Enter a reference identifier…" />
                </label>
              </div>
              <p className="construction-reference-status"><strong>{constructionReference.status}</strong>{constructionReference.current ? " · " + constructionReference.current.scope + " · persists until replaced" : " · " + constructionReference.issue}</p>
              <p className="fixture-browser-caveat">{constructionReference.limitation}</p>
            </div>
            <div className="construction-kseries-review">
              <div className="detail-kicker">PHRASE BOUNDARY × REFERENCE CONTEXT · PHASE 8BI</div>
              <p>The recovered hand-flame fixture uses a middle dot between phrases, while the reference contract persists until replaced. No source establishes that the punctuation itself replaces a reference or resets its scope.</p>
              <div className="construction-coupling-result" role="status" aria-live="polite">
                <strong>{constructionBoundaryReview.boundaryEffect.replaceAll("-", " ")}</strong>
                <p>{constructionBoundaryReview.note}</p>
                <p><strong>Current binding inspection:</strong> {constructionBoundaryReview.context.status}{constructionBoundaryReview.context.current ? " · " + constructionBoundaryReview.context.current.token + " → " + constructionBoundaryReview.context.current.referenceId : ""}</p>
                <p className="fixture-browser-caveat">Scope reset inference: prohibited · new-reference inference: prohibited · canon effect: none.</p>
              </div>
            </div>
            <div className="construction-kseries-review">
              <div className="detail-kicker">KAN · KEN · KAS / WORKED-EXAMPLE EVIDENCE</div>
              <p>These three forms occur in the hand-flame evidence, but their rules are not equally recovered. Inspect each independently; their appearance together does not establish a pair rule.</p>
              <label htmlFor="construction-kseries-input">K-series form</label>
              <input id="construction-kseries-input" value={constructionKSeriesInput} onChange={event => setConstructionKSeriesInput(event.target.value)} placeholder="KAN, KEN or KAS" spellCheck={false} />
              <div className="construction-coupling-result" role="status" aria-live="polite">
                <strong>{constructionKSeriesReview.status.replaceAll("-", " ")}</strong>
                {constructionKSeriesReview.entry && <><p>{constructionKSeriesReview.entry.evidence}</p><p><strong>Macro association:</strong> {constructionKSeriesReview.entry.macroAssociation}</p><p className="fixture-browser-caveat">{constructionKSeriesReview.entry.unresolved}</p></>}
                <p>{constructionKSeriesReview.message}</p>
              </div>
            </div>
            <div className="construction-fused-reference-review">
              <div className="detail-kicker">PERFORMED FUSED REFERENCE · EXAMPLE EVIDENCE</div>
              <p>The hand-flame example records one fused form. Inspect it separately from the formal reference-context binder above; this lookup never creates or changes a binding.</p>
              <label htmlFor="construction-fused-reference-input">Performed form</label>
              <input id="construction-fused-reference-input" value={constructionFusedReferenceInput} onChange={event => setConstructionFusedReferenceInput(event.target.value)} placeholder="e.g. mel" spellCheck={false} />
              <div className="construction-coupling-result" role="status" aria-live="polite">
                <strong>{constructionFusedReferenceReview.status.replaceAll("-", " ")}</strong>
                {constructionFusedReferenceReview.entry && <div className="construction-coupling-gloss"><span>{constructionFusedReferenceReview.entry.form}</span><span>{constructionFusedReferenceReview.entry.decomposition}</span><span>{constructionFusedReferenceReview.entry.exampleReferent}</span></div>}
                <p>{constructionFusedReferenceReview.message}</p>
                {constructionFusedReferenceReview.entry && <><p><strong>Scope association:</strong> {constructionFusedReferenceReview.entry.associatedFormalScope}</p><p className="fixture-browser-caveat">{constructionFusedReferenceReview.entry.limitation}</p></>}
              </div>
            </div>
            <div className="construction-fused-reference-review">
              <div className="detail-kicker">PERFORMED REFERENCE FORMS · PHASE 4 CONSOLIDATION</div>
              <p>Inspect the recovered readings for <code>re</code> and <code>ra</code>. These are slot-sensitive Performed reference forms with competing Shared Arcana readings; this evidence lookup never creates or changes a reference binding.</p>
              <label htmlFor="construction-performed-reference-input">Performed reference form</label>
              <input id="construction-performed-reference-input" value={constructionPerformedReferenceInput} onChange={event => setConstructionPerformedReferenceInput(event.target.value)} placeholder="e.g. re or ra" spellCheck={false} />
              <div className="construction-coupling-result" role="status" aria-live="polite">
                <strong>{constructionPerformedReferenceReview.status.replaceAll("-", " ")}</strong>
                {constructionPerformedReferenceReview.entry && <div className="construction-coupling-gloss"><span>{constructionPerformedReferenceReview.entry.form}</span><span>{constructionPerformedReferenceReview.entry.performedReading}</span><span>{constructionPerformedReferenceReview.entry.sharedCollision}</span></div>}
                <p>{constructionPerformedReferenceReview.message}</p>
                {constructionPerformedReferenceReview.entry && <><p><strong>Evidence:</strong> {constructionPerformedReferenceReview.entry.sourceBasis}</p><p className="fixture-browser-caveat">{constructionPerformedReferenceReview.entry.limitation}</p></>}
              </div>
            </div>
            <div className="construction-fused-reference-review">
              <div className="detail-kicker">CASE-SENSITIVE REFERENCE INVENTORY · EVIDENCE ONLY</div>
              <p>Compare formal reference tokens with the separately recorded Performed fused-reference inventory. Exact capitalisation matters: formal <code>MI</code> and Performed <code>mi</code> are not interchangeable. This inspector never creates a binding or parses a clause.</p>
              <label htmlFor="construction-reference-inventory-input">Exact reference spelling</label>
              <input id="construction-reference-inventory-input" value={constructionReferenceInventoryInput} onChange={event => setConstructionReferenceInventoryInput(event.target.value)} placeholder="e.g. MI, mi, re or mel" spellCheck={false} />
              <div className="construction-coupling-result" role="status" aria-live="polite">
                <strong>{constructionReferenceInventoryReview.status.replaceAll("-", " ")}</strong>
                {constructionReferenceInventoryReview.entry && <div className="construction-coupling-gloss"><span>{constructionReferenceInventoryReview.entry.form}</span><span>{constructionReferenceInventoryReview.entry.kind}</span><span>{constructionReferenceInventoryReview.entry.scope ?? "scope unresolved"}</span></div>}
                <p>{constructionReferenceInventoryReview.message}</p>
                {constructionReferenceInventoryReview.entry && <><p>{constructionReferenceInventoryReview.entry.description}</p><p><strong>Persistence:</strong> {constructionReferenceInventoryReview.entry.persistence ?? "not recovered"}{constructionReferenceInventoryReview.entry.collision ? <> · <strong>Collision:</strong> {constructionReferenceInventoryReview.entry.collision}</> : null}</p><p><strong>Evidence:</strong> {constructionReferenceInventoryReview.entry.sourceBasis}</p><p className="fixture-browser-caveat">{constructionReferenceInventoryReview.entry.limitation}</p></>}
              </div>
            </div>
            <div className="construction-foot-review">
              <div className="detail-kicker">RECOVERED FOOT SHAPE · STRUCTURAL CHECK ONLY</div>
              <p>Check a form against the six explicitly recovered canonical CV forms and the documented CVC slot pattern. Punctuation and whitespace are rejected; an unfamiliar final letter is not assumed to be a consonant or a permitted relation coda. Other frame–vowel combinations and all coda-bearing forms remain unresolved until the productive paradigm and coda inventory are recovered.</p>
              <label htmlFor="construction-foot-input">Construction Foot</label>
              <input id="construction-foot-input" value={constructionFootInput} onChange={event => setConstructionFootInput(event.target.value)} placeholder="e.g. pa or paz" spellCheck={false} />
              <div className="construction-foot-result" role="status" aria-live="polite">
                <strong>{constructionFootReview.status.replaceAll("-", " ")}</strong>
                <div className="construction-foot-parts">
                  <span><small>Frame</small>{constructionFootReview.frame ?? "—"}</span>
                  <span><small>Parameter vowel</small>{constructionFootReview.parameterVowel ?? "—"}</span>
                  <span><small>Relation coda</small>{constructionFootReview.relationCoda ?? "—"}</span>
                </div>
                <ul>{constructionFootReview.notes.map((note, index) => <li key={index}>{note}</li>)}</ul>
              </div>
              <p className="fixture-browser-caveat">{constructionFootReview.limitation}</p>
              <div className="construction-foot-composition">
                <div className="detail-kicker">SOURCE-READING COMPARISON · NO CANON SELECTION</div>
                <p>The same input is assessed independently against both recovered descriptions. These are competing source readings, not selectable grammar modes.</p><p className="fixture-browser-caveat"><strong>Source authority:</strong> Phase 5.15 and Phase 5.16 are secondary recovery matrices. The original Phase 4 DOCX §§3.1 and 10 has not yet been fully inspected, so neither summary is treated as authoritative over the other.</p>
                <div className="construction-foot-parts">
                  {constructionFootCompositionReview.readings.map(reading => (
                    <span key={reading.sourceReading}>
                      <small>{reading.sourceReading === "P5.15-CVC-REQUIRED" ? "Phase 5.15 · CVC required" : "Phase 5.16 C-02 · coda optional"}</small>
                      <strong>{reading.slotAssessment.replaceAll("-", " ")}</strong>
                      <small>{reading.framePrefix.replaceAll("-", " ")} · {reading.codaEvidence.replaceAll("-", " ")}</small>
                      {reading.explanation}
                    </span>
                  ))}
                </div>
                <p className="fixture-browser-caveat">{constructionFootCompositionReview.limitation}</p>
              </div>
            </div>
              <div className="construction-frame-terminology">
                <div className="detail-kicker">TERMINOLOGY DISAMBIGUATION · INDEPENDENT FRAME SYSTEMS</div>
                <p>“Frame” is used for different concepts in the recovered material. These systems must not be merged:</p>
                <div className="construction-foot-parts">{constructionFrameTerminology.map(entry => <span key={entry.id}><small>{entry.source}</small><strong>{entry.label}</strong>{entry.description}</span>)}</div>
                <p className="fixture-browser-caveat">The Phase 5.8/5.9 coordinate-frame model does not supply meanings for the six Construction Foot frame consonants.</p>
              </div>
              <div className="construction-foot-inventory">
                <div className="detail-kicker">RECOVERED FOOT INVENTORY · EVIDENCE-INDEXED</div>
                <p><strong>Frame consonants</strong> — six structural classes are source-backed; their semantic contrasts remain unresolved.</p>
                <div className="construction-foot-parts">{constructionFrameInventory.map(entry => <span key={entry.consonant}><small>{entry.canonicalForm} · {entry.status}</small>{entry.consonant}</span>)}</div>
                <p><strong>Frame-to-macro associations</strong> — pattern-level evidence only, not individual consonant definitions.</p>
                <div className="construction-foot-parts">{constructionFrameMacroAssociations.map(entry => <span key={entry.macro}><small>{entry.frameSet.join(" · ")} · {entry.evidenceStatus}</small>{entry.macro}<small>{entry.pattern}</small></span>)}</div>
                <p className="fixture-browser-caveat">TRAK's p/t/k association is described as alter / discrete change. KREN's b/d/g association is explicitly proposed and requires owner confirmation. Neither assigns a distinct meaning to each consonant.</p>
                <p><strong>Parameter vowels</strong> — family labels are provisional, not executable meanings.</p>
                <div className="construction-foot-parts">{constructionParameterInventory.map(entry => <span key={entry.vowel}><small>{entry.family} · {entry.status}</small>{entry.vowel}</span>)}</div>
                <p className="fixture-browser-caveat">{constructionFootEvidenceBoundary.relationCoda}</p>
                <p className="fixture-browser-caveat"><strong>Structural source discrepancy:</strong> {constructionFootEvidenceBoundary.shapeEvidenceDiscrepancy.primary} {constructionFootEvidenceBoundary.shapeEvidenceDiscrepancy.conflictingSummary} {constructionFootEvidenceBoundary.shapeEvidenceDiscrepancy.treatment}</p>
                <p className="fixture-browser-caveat">Open gaps: {constructionFootEvidenceBoundary.unresolved.join("; ")}.</p>
                <div className="construction-foot-morphology-audit">
                  <div className="detail-kicker">PHASE 8BK · PRODUCTIVE MORPHOLOGY COVERAGE AUDIT</div>
                  <p>The 6 × 6 frame–vowel comparison is an inventory audit, not a proposed paradigm. Only six CV forms are explicitly documented; the other combinations remain unlicensed or unresolved, not automatically invalid.</p>
                  <div className="construction-foot-parts">
                    <span><small>Frame × vowel pairs reviewed</small><strong>{constructionFootMorphologyAudit.frameVowelMatrix.length}</strong></span>
                    <span><small>Documented canonical CV forms</small><strong>{constructionFootMorphologyAudit.coverage.canonicalCvCount}</strong></span>
                    <span><small>Other pairs unresolved</small><strong>{constructionFootMorphologyAudit.coverage.unresolvedPairCount}</strong></span>
                    <span><small>Whole example tokens</small><strong>{constructionFootMorphologyAudit.wholeTokenEvidence.length}</strong></span>
                  </div>
                  <div className="construction-foot-parts">{constructionFootMorphologyAudit.frameVowelMatrix.map(item => <span key={item.form}><small>{item.status.replaceAll("-", " ")}</small><strong>{item.form}</strong></span>)}</div>
                  <p className="fixture-browser-caveat">The observed forms kan, ken and kas remain whole-token examples. Their k/a/e/n/s segments are not assigned productive Foot meanings. Observed final letters n and s are not promoted to a coda inventory.</p>
                  <p className="fixture-browser-caveat">The matrix does not resolve whether every complete Foot requires a coda. Phase 5.15 and Phase 5.16 C-02 remain separate source readings.</p>
                </div>
                <p><strong>Observed historical CVC-shaped tokens</strong> — whole-token evidence from the complete Phase 5.22 parser source; not a recovered segment-by-segment paradigm.</p>
                <div className="construction-foot-parts">{constructionFootSourceRecovery.observedWholeTokens.map(entry => <span key={entry.token}><small>{entry.alias}</small>{entry.token}<small>{entry.surfaceShape}</small></span>)}</div>
                <p className="fixture-browser-caveat">Observed final letters are n and s in these three examples only. This does not establish a complete coda inventory or assign independent coda meanings. Use the source-form lookup below to distinguish documented whole tokens from unresolved shapes.</p>
                <label htmlFor="construction-foot-source-input">Construction Foot source form</label>
                <input id="construction-foot-source-input" defaultValue="kan" onChange={event => setConstructionFootSourceReview(reviewConstructionFootSourceForm(event.target.value))} placeholder="e.g. kan" spellCheck={false} />
                <div className="construction-coupling-result" role="status" aria-live="polite"><strong>{constructionFootSourceReview.status.replaceAll("-", " ")}</strong><p>{constructionFootSourceReview.message}</p></div>
              </div>
            <div className="construction-coupling-review">
              <div className="detail-kicker">V2.0 H-SERIES · EVIDENCE LOOKUP ONLY</div>
              <p>The recovered registry records six coupling glosses. This lookup identifies source vocabulary; it does not define argument order, coupling direction, physical mappings or an executable BRAN operation.</p>
              <label htmlFor="construction-coupling-input">H-series form</label>
              <input id="construction-coupling-input" value={constructionCouplingInput} onChange={event => setConstructionCouplingInput(event.target.value)} placeholder="e.g. ha" spellCheck={false} />
              <div className="construction-coupling-result" role="status" aria-live="polite">
                <strong>{constructionCouplingReview.status.replaceAll("-", " ")}</strong>
                {constructionCouplingReview.entry && <div className="construction-coupling-gloss"><span>{constructionCouplingReview.entry.form}</span><span>{constructionCouplingReview.entry.gloss}</span><span>{constructionCouplingReview.entry.sourceVersion}</span></div>}
                <p>{constructionCouplingReview.message}</p>
                {constructionCouplingReview.entry && <p>{constructionCouplingReview.entry.limitation}</p>}
              </div>
              <p className="fixture-browser-caveat">All six entries have unresolved signatures and provisional physical mappings. No combination of these labels is treated as a valid or feasible coupling.</p>
            </div>
            <div className="construction-macro-review">
              <div className="detail-kicker">OPERATIONAL MACROS · SOURCE EVIDENCE ONLY</div>
              <p>Inspect the six operational forms without turning incomplete glosses into parser signatures or physical operations.</p>
              <label htmlFor="construction-macro-input">Operational form</label>
              <input id="construction-macro-input" value={constructionMacroInput} onChange={event => setConstructionMacroInput(event.target.value)} placeholder="e.g. TRAK" spellCheck={false} />
              <div className="construction-macro-result" role="status" aria-live="polite">
                <strong>{constructionMacroReview.status.replaceAll("-", " ")}</strong>
                {constructionMacroReview.entry && <p><b>Lexical record:</b> {constructionMacroReview.entry.lexicalStatus.replaceAll("-", " ").toLowerCase()}; this does not mean its Construction macro contract is complete.</p>}
                {constructionMacroReview.entry && <div className="construction-macro-heading"><span>{constructionMacroReview.entry.form}</span><span>{constructionMacroReview.entry.gloss}</span></div>}
                <p>{constructionMacroReview.message}</p>
                {constructionMacroReview.entry && <><p><b>Recovered Construction evidence:</b> {constructionMacroReview.entry.recoveredEvidence}</p><p><b>Open contract:</b> {constructionMacroReview.entry.unresolvedContract}</p></>}
              </div>
              <p className="fixture-browser-caveat">Source status is not a completion status. All six forms remain non-executable in this inspector.</p>
            </div>
            <div className="construction-relationship-map">
              <div className="detail-kicker">PHASE 4 §3.3 · RECOVERED STAGE RELATIONSHIPS</div>
              <p>The source establishes the relative performed order below. These arrows mean <strong>precedes</strong> only; they do not assert that one stage supplies arguments, values or physical outputs to the next.</p>
              <ol>
                {constructionStageRelationshipEvidence.precedence.map(edge => <li key={edge.from + "-" + edge.to}>
                  <strong>{edge.fromLabel}</strong> <span aria-label="precedes">→</span> <strong>{edge.toLabel}</strong>
                  <small>{edge.evidenceStatus} · interface {edge.interfaceStatus.toLowerCase()}</small>
                </li>)}
              </ol>
              <p className="fixture-browser-caveat">No direct data-flow, mandatory-stage, cardinality, omission, dependency or execution rule is inferred. Each interface requires original v2.0 evidence or an explicitly approved replacement specification.</p>
            </div>
            <div className="construction-relationship-map">
              <div className="detail-kicker">PHASE 8BL · SPATIAL VOCABULARY / VERSION BOUNDARIES</div>
              <p>Two spatial vocabularies are visible in the evidence. They are displayed separately because their historical equivalence and shared-token identity are not established.</p>
              {constructionSpatialEvidenceAudit.profiles.map(profile => <div key={profile.id} className="construction-foot-parts">
                <span><small>{profile.version} · {profile.status}</small><strong>{profile.id === "HISTORICAL-PHASE-5.22-FIXTURE" ? "po · da · 0.2 metre" : "FE · PA/BA/TA/DA/KA/GA"}</strong>
                {profile.id === "HISTORICAL-PHASE-5.22-FIXTURE" ? "Fixture-local role, axis and quantity readings only." : "Separate inventory: relations JO/JUR/JA/JE/JI; geometry PI/LEN/PLA/SUR/VOM/PAR."}</span>
              </div>)}
              <p className="fixture-browser-caveat">The spelling da/DA is not enough to establish a shared token identity. Coordinate frame, origin, vector composition, quantity attachment and unit conversion remain unrecovered.</p>
            </div>
            <div className="construction-relationship-map">
              <div className="detail-kicker">PHASE 8BT · POSITION / DISPLACEMENT RELATIONSHIPS</div>
              <p>Neutral mathematical research contracts only; not recovered Arcane operators or surface syntax.</p>
              <div className="fixture-browser-meta">
                <div><span>Position difference</span><strong>{proposedPositionDifference(positionRelationFixtures.sourcePosition, positionRelationFixtures.destinationPosition).status}</strong></div>
                <div><span>Position translation</span><strong>{proposedTranslatePosition(positionRelationFixtures.sourcePosition, proposedPositionDifference(positionRelationFixtures.sourcePosition, positionRelationFixtures.destinationPosition).value).status}</strong></div>
                <div><span>Position + position</span><strong>{proposedAddPositions(positionRelationFixtures.sourcePosition, positionRelationFixtures.destinationPosition).status}</strong></div>
                <div><span>Candidate contracts</span><strong>{positionRelationSummary.candidates.length}</strong></div>
              </div>
              <div className="construction-foot-parts">
                {positionRelationSummary.candidates.map(candidate => <span key={candidate.id}><small>{candidate.id}</small><strong>{candidate.formula}</strong><small>Result: {candidate.result} · {candidate.status}</small></span>)}
              </div>
              <p><strong>Worked example:</strong> Pₐ=(1,2,3) m and Pᵦ=(4,6,3) m in the same frame and origin. Pᵦ−Pₐ gives displacement (3,4,0) m. Adding that displacement to Pₐ returns Pᵦ.</p>
              <p><strong>Safety gates:</strong> subtraction requires matching frame, coordinate convention and origin/reference. Translation requires a displacement—not velocity—and matching frame, convention, dimensions and units. Position + position remains blocked because no operation contract is defined.</p>
              <p className="fixture-browser-caveat">No mapping to PO/FO/LO or JO/JUR/JA/JE/JI is made. These calculations do not establish physical movement, arrival, mechanism or canon.</p>
            </div>
            <div className="construction-relationship-map">
              <div className="detail-kicker">PHASE 8BS · TYPED SPATIAL VALUE MODEL</div>
              <p>This abstract research model separates a position, a displacement, a velocity, a force-like vector and a mana-state vector. It is metadata for review, not Arcane surface syntax.</p>
              <div className="fixture-browser-meta">
                <div><span>Spatial value kinds</span><strong>{spatialValueModelSummary.kinds.length}</strong></div>
                <div><span>Required spatial components</span><strong>X · Y · Z</strong></div>
                <div><span>Worked displacement</span><strong>{assessSpatialVectorFixture(workedDisplacementFixture).status}</strong></div>
                <div><span>Canonical vector constructor</span><strong>NOT RECOVERED</strong></div>
              </div>
              <div className="construction-foot-parts">
                {spatialValueModelSummary.kinds.map(kind => <span key={kind.id}><small>{kind.id}</small><strong>{kind.label}</strong><small>{kind.rule}</small></span>)}
              </div>
              <p><strong>Worked fixture:</strong> frame FRAME-TEST-01; X=1 m, Y=2 m, Z=3 m. Under the proposed Euclidean displacement rule, magnitude = {proposedDisplacementMagnitude(workedDisplacementFixture).value.toFixed(3)} m and self-dot-product = {proposedDisplacementDot(workedDisplacementFixture, workedDisplacementFixture).value} m².</p>
              <p><strong>Typed separation:</strong> displacement components use length dimensions; velocity components use length/time dimensions. A mana-state vector is not accepted as an ordinary spatial vector. A position additionally needs an origin/reference, and is not interchangeable with displacement.</p>
              <p className="fixture-browser-caveat">These are proposal-level research checks only. DRAN's full canonical input/norm contract, DREM's accepted types and result semantics, surface vector syntax, frame transforms and physical feasibility remain separate unresolved gates.</p>
            </div>
            <div className="construction-relationship-map">
              <div className="detail-kicker">PHASE 8BR · CANONICAL SIGNED-AXIS SEMANTICS</div>
              <p>The v3.0-L source explicitly assigns all six axis forms. These are directional labels in the canonical coordinate convention, not a vector literal or a frame constructor.</p>
              <div className="fixture-browser-meta">
                <div><span>Canonical axis assignments</span><strong>{constructionAxisSemantics.axes.length} / 6</strong></div>
                <div><span>Coordinate dimensions</span><strong>3</strong></div>
                <div><span>Vector constructors recovered</span><strong>0</strong></div>
                <div><span>Frame transforms recovered</span><strong>0</strong></div>
              </div>
              <div className="construction-foot-parts">
                {constructionAxisSemantics.axes.map(axis => {
                  const review = reviewConstructionAxis(axis.form);
                  return <span key={axis.form}><small>{axis.form} · {review?.coordinateAxis} {review?.sign}</small><strong>{review?.direction}</strong><small>V3.0-L §4 · CANONICAL</small></span>;
                })}
              </div>
              <p><strong>Source-recorded symmetry:</strong> P/B, T/D and K/G are voiceless/voiced consonant pairs respectively, with opposite signs on the same coordinate dimension. The source describes this as a subtle internal symmetry; it does not establish a broader sound-to-meaning rule.</p>
              <p className="fixture-browser-caveat">A direction assignment does not identify an origin, supply a frame identity, provide a component magnitude, construct a vector, or define how multiple axis forms combine. Those contracts remain open.</p>
            </div>
            <div className="construction-relationship-map">
              <div className="detail-kicker">PHASE 8BP · SPATIAL GRAMMAR INVENTORY</div>
              <p>The v3.0-L inventory is now classified into four evidence categories. These are lexical categories only: no token signature, phrase order or executable spatial operation is inferred.</p>
              {constructionSpatialGrammarEvidence.categoryOrder.map(category => {
                const categoryEntries = reviewConstructionSpatialCategory(category) ?? [];
                return <div className="construction-foot-parts" key={category}>
                  <span><small>{category.replaceAll("-", " ")} · {categoryEntries.length} recorded forms</small><strong>{categoryEntries.map(entry => entry.form).join(" · ")}</strong><small>Signatures: NOT RECOVERED</small></span>
                </div>;
              })}
              <div className="fixture-browser-meta">
                <div><span>Inventory entries</span><strong>{constructionSpatialGrammarEvidence.entries.length}</strong></div>
                <div><span>Categories</span><strong>{constructionSpatialGrammarEvidence.categoryOrder.length}</strong></div>
                <div><span>Open interfaces</span><strong>{constructionSpatialGrammarEvidence.openInterfaces.length}</strong></div>
                <div><span>Executable rules</span><strong>0</strong></div>
              </div>
              <ol>{constructionSpatialGrammarEvidence.openInterfaces.map(item => <li key={item.id}><strong>{item.id.replaceAll("-", " ")}</strong><small>{item.question} · {item.status}</small></li>)}</ol>
              <p className="fixture-browser-caveat">The historical po/da/0.2 metre phrase remains fixture-local. A category label is not a grammar rule; do not assemble FE, axis, relation and geometry tokens into a purported valid expression until signatures and combination rules are recovered.</p>
            </div>
            <div className="construction-relationship-map">
              <div className="detail-kicker">PHASE 8BQ · SPATIAL COMPOSITION EVIDENCE</div>
              <p>This matrix separates category membership from evidence that two spatial categories can combine. No v3.0-L category pair has a recovered composition contract.</p>
              <div className="fixture-browser-meta">
                <div><span>Category pairs reviewed</span><strong>{constructionSpatialCompositionEvidence.categoryPairs.length}</strong></div>
                <div><span>Composition contracts recovered</span><strong>{constructionSpatialCompositionEvidence.categoryPairs.filter(pair => pair.status === "RECOVERED").length}</strong></div>
                <div><span>Historical fixture observations</span><strong>{constructionSpatialCompositionEvidence.fixtureObservations.length}</strong></div>
                <div><span>Executable combinations</span><strong>0</strong></div>
              </div>
              <ol>{constructionSpatialCompositionEvidence.categoryPairs.map(pair => {
                const review = reviewConstructionSpatialCategoryPair(pair.left, pair.right);
                return <li key={pair.id}><strong>{pair.left.replaceAll("-", " ")}</strong> <span aria-label="with">↔</span> <strong>{pair.right.replaceAll("-", " ")}</strong><small>{review?.status.replaceAll("-", " ")} · signatures, ordering and attachment not recovered</small></li>;
              })}</ol>
              <p><strong>Fixture-only observation:</strong> Phase 5.22 records <code>po da za shi to za ma</code> as position · +Y · 0.2 metre. The role token, axis token and quantity reading belong to that historical fixture profile; this is not evidence for a v3.0-L category pair or general syntax.</p>
              <p className="fixture-browser-caveat">A pair marked NOT ESTABLISHED is not proven invalid; it is unsupported by the recovered evidence. This matrix is not a grammar validator or a list of permitted combinations.</p>
            </div>
            <div className="construction-relationship-map">
              <div className="detail-kicker">PHASE 8BJ · STAGE INTERFACE AUDIT</div>
              <p>Six adjacent stage boundaries are recorded as precedence relationships. The audit below separates that recovered order from the interfaces that still need source evidence.</p>
              <div className="fixture-browser-meta">
                <div><span>Boundaries reviewed</span><strong>{constructionStageInterfaceAudit.boundaries.length}</strong></div>
                <div><span>Order evidence</span><strong>6 / 6</strong></div>
                <div><span>Input/output contracts</span><strong>0 recovered</strong></div>
                <div><span>Bindings</span><strong>0 recovered</strong></div>
              </div>
              <ol>
                {constructionStageInterfaceAudit.boundaries.map(boundary => {
                  const review = reviewConstructionStageInterfaceAudit(boundary.id);
                  return <li key={boundary.id}>
                    <strong>{boundary.fromLabel}</strong> <span aria-label="precedes">→</span> <strong>{boundary.toLabel}</strong>
                    <small>{review.status.replaceAll("-", " ")} · order source-backed · interface unresolved</small>
                  </li>;
                })}
              </ol>
              <p className="fixture-browser-caveat">The audit does not define a data-flow edge. Input/output types, attachment, cardinality, omission and failure behaviour remain unestablished for every boundary.</p>
            </div>
            <div className="construction-relationship-map">
              <div className="detail-kicker">PHASE 8BM · EVIDENCE-AWARE EXPRESSION COMPOSITION</div>
              <p>A single review record groups evidence under the seven Construction stage labels. Empty slots mean no evidence has been attached to this review record; they do not mean a stage is optional or absent from the language.</p>
              {(() => {
                const composition = createEmptyConstructionExpressionComposition("workbench-template");
                const review = reviewConstructionExpressionComposition(composition);
                return <>
                  <div className="fixture-browser-meta">
                    <div><span>Stage slots</span><strong>{review.stageSummaries.length}</strong></div>
                    <div><span>Evidence records in template</span><strong>{review.evidenceRecordCount}</strong></div>
                    <div><span>Grammar validity</span><strong>Not assessed</strong></div>
                    <div><span>Execution</span><strong>Disabled</strong></div>
                  </div>
                  <ol>{review.stageSummaries.map(item => <li key={item.stage}>
                    <strong>{item.stage.replaceAll("-", " ")}</strong>
                    <small>{item.status.replaceAll("-", " ")} · {item.recordCount} records in blank template</small>
                  </li>)}</ol>
                  <p className="fixture-browser-caveat">Records retain their own version, source, claims and unresolved questions. Multiple records can be preserved without assuming how many forms a stage permits. The six historical hand-flame phrases are not mapped one-to-one onto seven stages.</p>
                  <p className="fixture-browser-caveat">{review.limitation}</p>
                </>;
              })()}
            </div>
            <div className="construction-relationship-map">
              <div className="detail-kicker">PHASE 8BN · FIXTURE PHRASE TRACEABILITY</div>
              <p>Phrase-level evidence is attached to the exact Phase 5.22 hand-flame fixture. These six phrase groups are local to that example; they are not a general delimiter grammar or a one-to-one map onto the seven Construction stages.</p>
              {(() => {
                const review = reviewHandFlameFixtureTraceability();
                return <>
                  <div className="fixture-browser-meta">
                    <div><span>Fixture phrases</span><strong>{review.phraseCount}</strong></div>
                    <div><span>Unresolved phrases</span><strong>{review.unresolvedPhraseCount}</strong></div>
                    <div><span>Stage mapping</span><strong>Not established</strong></div>
                    <div><span>Grammar validity</span><strong>Not assessed</strong></div>
                  </div>
                  <div className="construction-example-chunks">
                    {handFlameFixtureTraceability.phrases.map(phrase => <section key={phrase.phraseIndex}>
                      <div><strong>{phrase.phraseIndex}. {phrase.surface}</strong><span>{phrase.interpretationStatus.replaceAll("-", " ")}</span></div>
                      {phrase.recordedClaims.length > 0 && <p><strong>Recorded:</strong> {phrase.recordedClaims.join(" · ")}</p>}
                      <p className="fixture-browser-caveat"><strong>Sources:</strong> {phrase.evidenceReferences.join(" · ")}</p>
                      <p className="fixture-browser-caveat"><strong>Unresolved:</strong> {phrase.unresolved.join(" · ")}</p>
                    </section>)}
                  </div>
                  <p className="fixture-browser-caveat">Cross-version spelling matches do not establish token identity or semantic equivalence. This traceability profile is non-executable and canon-neutral.</p>
                </>;
              })()}
            </div>
            <div className="construction-contract-profiles">
              <div className="detail-kicker">PHASE 8AO · STAGE CONTRACT EVIDENCE</div>
              <p>These profiles separate recovered stage behaviour from missing interfaces. The spatial vocabulary shown below is version-tagged and is not automatically treated as the input grammar of the historical Construction stage.</p>
              <div className="construction-example-chunks">
                {constructionStageContractProfiles.map(profile => <section key={profile.stage}>
                  <div><strong>{profile.label}</strong><span>{profile.contractStatus.replaceAll("-", " ")}</span></div>
                  <p><strong>Recovered:</strong> {profile.recovered.join(" · ")}</p>
                  <p><strong>Input / output:</strong> {profile.inputOutputStatus}</p>
                  <p><strong>Cross-stage binding:</strong> {profile.bindingStatus}</p>
                  {profile.versionBoundary && <p className="fixture-browser-caveat"><strong>Version boundary:</strong> {profile.versionBoundary}</p>}
                  <p className="fixture-browser-caveat"><strong>Still open:</strong> {profile.unresolved.join(" · ")}</p>
                </section>)}
              </div>
              <p className="fixture-browser-caveat">This is an evidence register, not a Construction validator or compiler. No stage output is inferred from the next stage's position in the sequence.</p>
            </div>
            <div className="construction-worked-example">
              <div className="detail-kicker">PHASE 4 §8 · HAND-FLAME WORKED EXAMPLE</div>
              <p className="construction-example-sequence">{handFlameConstructionExample.sourceSequence}</p>
              <p><strong>Evidence status:</strong> {handFlameConstructionExample.sourceStatus.replaceAll("-", " ").toLowerCase()}.</p>
              <div className="construction-example-chunks">
                {handFlameConstructionExample.chunks.map((chunk, index) => <section key={chunk.sourceText}>
                  <div><strong>{index + 1}. {chunk.sourceText}</strong><span>{chunk.evidenceStatus.replaceAll("-", " ")}</span></div>
                  <p>{chunk.interpretation}</p><p className="fixture-browser-caveat">{chunk.unresolved}</p>
                </section>)}
              </div>
              <ul>{handFlameConstructionExample.limits.map(limit => <li key={limit}>{limit}</li>)}</ul>
            </div>
            <div className="construction-stage-list">
              {constructionStageLabels.map(({ stage, label }, index) => <div className="construction-stage-row" key={stage}>
                <div className="construction-stage-number">{index + 1}</div>
                <div className="construction-stage-fields">
                  <label className="construction-stage-label" htmlFor={"construction-content-" + stage}>{label}</label>
                  <input id={"construction-content-" + stage} value={constructionEvidence[stage].content} onChange={event => setConstructionEvidence(current => ({ ...current, [stage]: { ...current[stage], content: event.target.value, status: current[stage].status === "NOT-SUPPLIED" && event.target.value.trim() ? "UNRESOLVED" : current[stage].status } }))} placeholder="Add supplied source text or an evidence note…" />
                  <select aria-label={label + " evidence status"} value={constructionEvidence[stage].status} onChange={event => setConstructionEvidence(current => ({ ...current, [stage]: { ...current[stage], status: event.target.value as ConstructionEvidenceStatus } }))}>
                    <option value="NOT-SUPPLIED">Not supplied</option><option value="UNRESOLVED">Unresolved</option><option value="PROVISIONAL">Provisional</option><option value="ATTESTED">Attested</option>
                  </select>
                </div>
              </div>)}
            </div>
            <div className="construction-review-panel">
              <div className="fixture-browser-meta">
                <div><span>Record review</span><strong>{constructionReview.status.replaceAll("-", " ")}</strong></div>
                <div><span>Order check</span><strong>{constructionReview.order.status.replaceAll("_", " ")}</strong></div>
                <div><span>Attested fields</span><strong>{constructionReview.evidenceCounts.ATTESTED}</strong></div>
                <div><span>Provisional fields</span><strong>{constructionReview.evidenceCounts.PROVISIONAL}</strong></div>
                <div><span>Unresolved fields</span><strong>{constructionReview.evidenceCounts.UNRESOLVED}</strong></div>
                <div><span>Not supplied</span><strong>{constructionReview.evidenceCounts["NOT-SUPPLIED"]}</strong></div>
              </div>
              {constructionReview.findings.length > 0 ? <ul className="construction-findings">{constructionReview.findings.map((finding, index) => <li key={index}>{finding}</li>)}</ul> : <p>All supplied fields are marked attested and in the recovered relative order.</p>}
              <p className="fixture-browser-caveat"><strong>Important limitation:</strong> {constructionReview.limitation}</p>
              <button className="secondary-button" onClick={() => setConstructionEvidence(Object.fromEntries(constructionStageLabels.map(({ stage }) => [stage, { status: "NOT-SUPPLIED", content: "" }])) as typeof constructionEvidence)}>Clear Construction record</button>
            </div>
          </section>
          <section className="fixture-browser" aria-labelledby="fixture-browser-title">
            <div className="fixture-browser-head"><div><span className="detail-kicker">FIXTURE-DRIVEN LAB</span><h2 id="fixture-browser-title">Source fixture browser</h2></div><span>{phase6gFixtures.length} source-derived cases</span></div>
            <p className="fixture-browser-intro">Load a preserved Phase 6G example into the editor. The source-recorded expectation is evidence to compare against, not a current pass/fail claim; selecting a fixture never runs it automatically.</p>
            <label className="fixture-select-label">Choose a fixture<select aria-label="Choose Phase 6G source fixture" value={selectedFixtureId} onChange={(event) => setSelectedFixtureId(event.target.value)}>{phase6gFixtures.map((fixture) => <option key={fixture.id} value={fixture.id}>{fixture.id} — {fixture.label}</option>)}</select></label>
            {selectedPhase6GFixture && <div className="fixture-browser-detail">
              <div className="fixture-browser-meta"><div><span>Fixture ID</span><code>{selectedPhase6GFixture.id}</code></div><div><span>Category</span><strong>{selectedPhase6GFixture.category}</strong></div><div><span>Source-recorded expectation</span><strong>{selectedPhase6GFixture.expected}</strong></div><div><span>Canon status</span><strong>{selectedPhase6GFixture.canonStatus}</strong></div></div>
              {selectedPhase6GFixture.evidence && <p><strong>Evidence:</strong> {selectedPhase6GFixture.evidence}</p>}
              {selectedPhase6GFixture.notes && <p><strong>Notes:</strong> {selectedPhase6GFixture.notes}</p>}
              <div className="fixture-browser-actions"><button className="secondary-button" onClick={() => { setEditor(selectedPhase6GFixture.input.toLowerCase()); setAnalysis(null); }}>Load fixture into editor</button><span>Loading does not execute the parser.</span></div>
            </div>}
            <p className="fixture-browser-caveat">Historical fixture expectations, archived implementation behaviour, current parser observations and canon status are separate evidence categories. Some fixtures are conditional, context-dependent, or known to diverge from the archived executable prototype.</p>
          </section>
          <section className="fixture-browser resource-fixture-browser" aria-labelledby="resource-fixture-browser-title">
            <div className="fixture-browser-head"><div><span className="detail-kicker">SPECIFICATION FIXTURES · NOT EXECUTABLE TESTS</span><h2 id="resource-fixture-browser-title">Incantation resource-accounting fixtures</h2></div><span>{resourceAccountingFixtures.length} design cases</span></div>
            <p className="fixture-browser-intro">Browse the 60 expected outcomes defined in Arcane Incantations v1.9. These rows are read directly from the canonical Markdown specification; they are not runs of a resource evaluator and do not demonstrate physical feasibility or spell execution.</p>
            <label className="fixture-select-label">Choose a specification fixture<select aria-label="Choose resource-accounting specification fixture" value={selectedResourceFixtureId} onChange={(event) => setSelectedResourceFixtureId(event.target.value)}>{resourceAccountingFixtures.map((fixture) => <option key={fixture.id} value={fixture.id}>{fixture.id} — {fixture.caseDescription}</option>)}</select></label>
            {selectedResourceFixture && <div className="fixture-browser-detail">
              <div className="fixture-browser-meta"><div><span>Specification fixture ID</span><code>{selectedResourceFixture.id}</code></div><div><span>Fixture category</span><strong>Resource accounting / conservation</strong></div><div className="fixture-browser-meta-wide"><span>Case</span><strong>{selectedResourceFixture.caseDescription}</strong></div><div className="fixture-browser-meta-wide"><span>Expected design outcome</span><strong>{selectedResourceFixture.expectedResult}</strong></div><div className="fixture-browser-meta-wide"><span>Evidence class</span><strong>Normative specification fixture — not executed runtime behaviour</strong></div></div>
            </div>}
            <div className="fixture-browser-actions"><a className="secondary-button" href={githubBlobUrl("docs/canon/arcane-incantations-v1.9-resource-accounting-and-conservation-contracts.md", GITHUB_SOURCE_REF)} target="_blank" rel="noreferrer">Open full v1.9 specification ↗</a><span>Selection only displays the source expectation; it does not run a spell.</span></div>
            <p className="fixture-browser-caveat">Resource budgets do not prove a source exists. Reservation does not mean consumption. Dimensional arithmetic does not prove conservation. No universal mana-to-energy conversion or physical resource evaluator is implemented by this browser.</p>
          </section>
          <section className="fixture-browser authority-fixture-browser" aria-labelledby="authority-fixture-browser-title">
            <div className="fixture-browser-head"><div><span className="detail-kicker">SPECIFICATION FIXTURES · NOT EXECUTABLE TESTS</span><h2 id="authority-fixture-browser-title">Incantation authority-decision fixtures</h2></div><span>{authorityDecisionFixtures.length} design cases</span></div>
            <p className="fixture-browser-intro">Browse the 60 expected outcomes defined in Arcane Incantations v2.0. These cases are parsed from the locked specification. They are not executed permission decisions and do not establish legal compliance, identity, real-world authority, consent, feasibility, or spell execution.</p>
            <label className="fixture-select-label">Choose an authority specification fixture<select aria-label="Choose authority-decision specification fixture" value={selectedAuthorityFixtureId} onChange={(event) => setSelectedAuthorityFixtureId(event.target.value)}>{authorityDecisionFixtures.map((fixture) => <option key={fixture.id} value={fixture.id}>{fixture.id} — {fixture.caseDescription}</option>)}</select></label>
            {selectedAuthorityFixture && <div className="fixture-browser-detail">
              <div className="fixture-browser-meta"><div><span>Specification fixture ID</span><code>{selectedAuthorityFixture.id}</code></div><div><span>Fixture category</span><strong>Authority / authorisation decision</strong></div><div className="fixture-browser-meta-wide"><span>Case</span><strong>{selectedAuthorityFixture.caseDescription}</strong></div><div className="fixture-browser-meta-wide"><span>Expected design outcome</span><strong>{selectedAuthorityFixture.expectedOutcome}</strong></div><div className="fixture-browser-meta-wide"><span>Evidence class</span><strong>Normative specification fixture — not an executed authority check</strong></div></div>
            </div>}
            <div className="fixture-browser-actions"><a className="secondary-button" href={githubBlobUrl("docs/canon/arcane-incantations-v2.0-authority-and-authorization-decision-contracts.md", GITHUB_SOURCE_REF)} target="_blank" rel="noreferrer">Open full v2.0 specification ↗</a><span>Selection only displays the source expectation; no authorisation service is called.</span></div>
            <p className="fixture-browser-caveat">Only an explicitly permitted, current, trusted, in-scope decision can pass the authorisation gate when every required check succeeds. All non-permit, uncertain, unavailable, expired, revoked, malformed, or scope-mismatched outcomes block. Authority does not replace consent, feasibility, resource readiness, validation, or execution; passing this gate does not mean a spell ran.</p>
          </section>

          <section className="fixture-browser policy-profile-fixture-browser" aria-labelledby="policy-profile-fixture-browser-title">
            <div className="fixture-browser-head"><div><span className="detail-kicker">SPECIFICATION FIXTURES · NOT EXECUTABLE TESTS</span><h2 id="policy-profile-fixture-browser-title">Policy-profile composition fixtures</h2></div><span>{policyProfileCompositionFixtures.length} design cases</span></div>
            <p className="fixture-browser-intro">Browse the 60 expected outcomes defined in Arcane Incantations v2.1. The records are parsed directly from the locked specification. They are not executed policy decisions and do not establish a working permission service, legal compliance, identity, consent, physical feasibility, or spell execution.</p>
            <label className="fixture-select-label">Choose a policy-composition specification fixture<select aria-label="Choose policy-profile composition specification fixture" value={selectedPolicyFixtureId} onChange={(event) => setSelectedPolicyFixtureId(event.target.value)}>{policyProfileCompositionFixtures.map((fixture) => <option key={fixture.id} value={fixture.id}>{fixture.id} — {fixture.caseDescription}</option>)}</select></label>
            {selectedPolicyFixture && <div className="fixture-browser-detail">
              <div className="fixture-browser-meta"><div><span>Specification fixture ID</span><code>{selectedPolicyFixture.id}</code></div><div><span>Fixture category</span><strong>Policy-profile composition</strong></div><div className="fixture-browser-meta-wide"><span>Case</span><strong>{selectedPolicyFixture.caseDescription}</strong></div><div className="fixture-browser-meta-wide"><span>Expected design outcome</span><strong>{selectedPolicyFixture.expectedOutcome}</strong></div><div className="fixture-browser-meta-wide"><span>Evidence class</span><strong>Normative specification fixture — not an executed policy decision</strong></div></div>
            </div>}
            <div className="fixture-browser-actions"><a className="secondary-button" href={githubBlobUrl("docs/canon/arcane-incantations-v2.1-policy-profile-composition-and-conflict-resolution.md", GITHUB_SOURCE_REF)} target="_blank" rel="noreferrer">Open full v2.1 specification ↗</a><span>Selection displays source expectations only; no policy service or parser is called.</span></div>
            <p className="fixture-browser-caveat">Policy names, issuer prestige, file order and recency are not implicit precedence. An unresolved conflict, unknown applicability, unavailable required profile or untrusted policy blocks without being mislabelled as an explicit denial. A composed permit still does not bypass v2.0 scope, consent, resource, feasibility or execution gates.</p>
          </section>

          <section className="fixture-browser gate-sequence-explorer" aria-labelledby="gate-sequence-explorer-title">
            <div className="fixture-browser-head"><div><span className="detail-kicker">SOURCE-LINKED EXPLAINER · NOT LIVE STATE</span><h2 id="gate-sequence-explorer-title">Incantation gate sequence explorer</h2></div><span>{validationGateSequence.length} validation gates · {invocationLifecycleSequence.length} lifecycle stages</span></div>
            <p className="fixture-browser-intro">Explore the two source-defined sequences separately. v1.2 lists ordered validation/execution checks; v1.5 summarises invocation milestones. This explorer explains the source text only: selecting a stage does not mean that stage has run, passed, or authorised an operation.</p>
            <div className="contract-worksheet-grid gate-sequence-grid">
              <div className="gate-sequence-lane">
                <h3>v1.2 — Validation and execution checks</h3>
                <p className="fixture-browser-intro">The nine-step order in §7 is preserved as written.</p>
                <label className="fixture-select-label">Choose a v1.2 validation gate<select aria-label="Choose a v1.2 validation gate" value={selectedValidationGateId} onChange={(event) => setSelectedValidationGateId(event.target.value)}>{validationGateSequence.map((stage) => <option key={stage.id} value={stage.id}>{stage.ordinal}. {stage.label}</option>)}</select></label>
                {selectedValidationGate && <div className="fixture-browser-detail">
                  <div className="fixture-browser-meta"><div><span>Source stage</span><strong>{selectedValidationGate.ordinal}. {selectedValidationGate.label}</strong></div><div className="gate-sequence-meta-wide"><span>Source description</span><strong>{selectedValidationGate.sourceDescription}</strong></div><div className="gate-sequence-meta-wide"><span>What this does not prove</span><strong>{selectedValidationGate.boundaryNote}</strong></div></div>
                </div>}
                <div className="fixture-browser-actions"><a className="secondary-button" href={githubBlobUrl("docs/canon/arcane-incantations-v1.2-preconditions-constraints-and-failure.md#7-check-order-and-dependency-guards", GITHUB_SOURCE_REF)} target="_blank" rel="noreferrer">Open v1.2 source ↗</a></div>
              </div>
              <div className="gate-sequence-lane">
                <h3>v1.5 — Invocation lifecycle summary</h3>
                <p className="fixture-browser-intro">The seven lifecycle labels are preserved in their summary order.</p>
                <label className="fixture-select-label">Choose a v1.5 lifecycle stage<select aria-label="Choose v1.5 invocation lifecycle stage" value={selectedInvocationStageId} onChange={(event) => setSelectedInvocationStageId(event.target.value)}>{invocationLifecycleSequence.map((stage) => <option key={stage.id} value={stage.id}>{stage.ordinal}. {stage.label}</option>)}</select></label>
                {selectedInvocationStage && <div className="fixture-browser-detail">
                  <div className="fixture-browser-meta"><div><span>Source stage</span><strong>{selectedInvocationStage.ordinal}. {selectedInvocationStage.label}</strong></div><div className="gate-sequence-meta-wide"><span>Source note</span><strong>{selectedInvocationStage.sourceDescription}</strong></div><div className="gate-sequence-meta-wide"><span>What this does not prove</span><strong>{selectedInvocationStage.boundaryNote}</strong></div></div>
                </div>}
                <div className="fixture-browser-actions"><a className="secondary-button" href={githubBlobUrl("docs/canon/arcane-incantations-v1.5-invocation-profiles-and-execution-contracts.md", GITHUB_SOURCE_REF)} target="_blank" rel="noreferrer">Open v1.5 source ↗</a></div>
              </div>
            </div>
            <div className="fixture-browser-detail gate-sequence-order-note">
              <strong>{invocationOrderNote.title}</strong>
              <p>{invocationOrderNote.summary}</p>
              <p>{invocationOrderNote.rule}</p>
              <p><strong>Review status:</strong> unresolved source-order question. Neither source passage is rewritten here.</p>
            </div>
            <p className="fixture-browser-caveat">This is an explainer, not an execution timeline, workflow engine, status monitor or proof that any gate has passed. VALIDATED is not authorised; authorised is not executed; executed is not outcome-verified.</p>
          </section>

          <section className="fixture-browser runtime-preview-browser" aria-labelledby="runtime-preview-title">
            <div className="fixture-browser-head"><div><span className="detail-kicker">CONNECTED EVALUATORS · READ-ONLY SAMPLE</span><h2 id="runtime-preview-title">Unified invocation diagnostics</h2></div><span>5 evaluator layers</span></div>
            <p className="fixture-browser-intro">This panel runs the repository's bounded resource-preflight, policy-composition, authority-gate and invocation-coordinator functions against explicit sample inputs. It is an integration preview, not a real spell runtime or evidence-verification service.</p>
            <label className="fixture-select-label">Choose a diagnostic scenario<select aria-label="Choose incantation runtime preview scenario" value={runtimePreviewScenario} onChange={(event) => setRuntimePreviewScenario(event.target.value as RuntimePreviewScenario)}>{runtimePreviewScenarios.map((scenario) => <option key={scenario.id} value={scenario.id}>{scenario.label}</option>)}</select></label>
            <p className="runtime-preview-description">{runtimePreview.description}</p>
            <div className="runtime-preview-outcome"><div><span>COORDINATED RESULT</span><strong className={runtimePreview.invocation.outcome === "ELIGIBLE-TO-PROCEED" ? "runtime-good" : runtimePreview.invocation.outcome === "BLOCKED" ? "runtime-blocked" : "runtime-unresolved"}>{runtimePreview.invocation.outcome}</strong></div><div><span>EXECUTION</span><strong>NOT STARTED</strong></div></div>
            <div className="runtime-preview-grid">
              <div><span>RESOURCE PREFLIGHT</span><strong>{runtimePreview.resource.outcome}</strong><small>{runtimePreview.resource.availableAmount === undefined ? "Available amount unresolved" : `Available: ${runtimePreview.resource.availableAmount} ${"mana-tick"}`}</small></div>
              <div><span>POLICY COMPOSITION</span><strong>{runtimePreview.policy.outcome}</strong><small>{runtimePreview.policy.selectedProfileIds.length} selected profile(s)</small></div>
              <div><span>AUTHORITY GATE</span><strong>{runtimePreview.authority.outcome}</strong><small>{runtimePreview.authority.gateSatisfied ? "Sample decision gate satisfied" : "Permission not established"}</small></div>
            </div>
            <div className="runtime-preview-trace"><h3>Independent invocation gates</h3>{runtimePreview.invocation.trace.map((entry, index) => <div className="runtime-preview-trace-row" key={entry.gate + index}><code>{entry.gate}</code><strong className={"runtime-state-" + entry.state.toLowerCase()}>{entry.state}</strong><span>{entry.reason}</span></div>)}</div>
            <details className="runtime-preview-details"><summary>Evidence assumptions and evaluator limitations</summary><ul>{runtimePreview.assumptions.map((item) => <li key={item}>{item}</li>)}{runtimePreview.resource.limitations.map((item) => <li key={item}>{item}</li>)}{runtimePreview.policy.limitations.map((item) => <li key={item}>{item}</li>)}{runtimePreview.authority.limitations.map((item) => <li key={item}>{item}</li>)}{runtimePreview.invocation.limitations.map((item) => <li key={item}>{item}</li>)}</ul></details>
            <p className="fixture-browser-caveat">A passing preview means only that these sample inputs satisfy the implemented functions. External trust, live scope resolution, predicate acquisition, physical feasibility, executor contracts and outcome verification remain outside this panel. The v1.5 source-order discrepancy is still preserved separately above.</p>
          </section>
          <section className="fixture-browser runtime-preview-browser resource-conservation-preview" aria-labelledby="resource-conservation-preview-title">
            <div className="fixture-browser-head">
              <div><span className="detail-kicker">V1.9 CONSERVATION · READ-ONLY SAMPLE</span><h2 id="resource-conservation-preview-title">Conservation and account reconciliation</h2></div>
              <span>2 independent evaluations</span>
            </div>
            <p className="fixture-browser-intro">This panel runs the bounded conservation evaluator and ledger-backed account reconciler against deterministic synthetic inputs. It does not use the 60 canonical specification fixtures as executed test cases.</p>
            <label className="fixture-select-label">Choose a resource-accounting scenario
              <select aria-label="Choose resource conservation preview scenario" value={resourceConservationScenario} onChange={(event) => setResourceConservationScenario(event.target.value as ResourceConservationPreviewScenario)}>
                {resourceConservationPreviewScenarios.map((scenario) => <option key={scenario.id} value={scenario.id}>{scenario.label}</option>)}
              </select>
            </label>
            <p className="runtime-preview-description">{resourceConservationPreview.description}</p>
            <div className="resource-conservation-grid">
              <article className="resource-conservation-card" aria-label="Conservation evaluation result">
                <span>CONSERVATION EVALUATION</span>
                <strong className={resourceConservationPreview.conservation.outcome === "CONSERVATION-SATISFIED" ? "runtime-good" : resourceConservationPreview.conservation.outcome === "CONSERVATION-MISMATCH" ? "runtime-blocked" : "runtime-unresolved"}>{resourceConservationPreview.conservation.outcome}</strong>
                <div className="resource-conservation-metrics">
                  <div><span>Left total:</span><strong>{resourceConservationPreview.conservation.leftTotalTicks === undefined ? "Not computed" : resourceConservationPreview.conservation.leftTotalTicks + " ticks"}</strong></div>
                  <div><span>Right total:</span><strong>{resourceConservationPreview.conservation.rightTotalTicks === undefined ? "Not computed" : resourceConservationPreview.conservation.rightTotalTicks + " ticks"}</strong></div>
                  <div><span>Balance difference:</span><strong>{resourceConservationPreview.conservation.differenceTicks === undefined ? "Not computed" : resourceConservationPreview.conservation.differenceTicks + " ticks"}</strong></div>
                  <div><span>Contract tolerance:</span><strong>{resourceConservationPreview.conservation.toleranceTicks === undefined ? "Not available" : resourceConservationPreview.conservation.toleranceTicks + " ticks"}</strong></div>
                </div>
                {resourceConservationPreview.conservation.diagnostics.length > 0
                  ? <ul className="resource-conservation-diagnostics">{resourceConservationPreview.conservation.diagnostics.map((item, index) => <li key={item.code + index}><code>{item.code}</code><span>{item.message}</span></li>)}</ul>
                  : <p className="resource-conservation-no-diagnostics">No diagnostics for this sample result.</p>}
              </article>
              <article className="resource-conservation-card" aria-label="Account reconciliation result">
                <span>ACCOUNT RECONCILIATION · {resourceConservationPreview.reconciliation.scope}</span>
                <strong className={resourceConservationPreview.reconciliation.outcome === "ACCOUNT-BALANCE-RECONCILED" ? "runtime-good" : resourceConservationPreview.reconciliation.outcome === "ACCOUNT-BALANCE-DISCREPANCY" ? "runtime-blocked" : "runtime-unresolved"}>{resourceConservationPreview.reconciliation.outcome}</strong>
                <div className="resource-conservation-metrics">
                  <div><span>Projected balance:</span><strong>{resourceConservationPreview.reconciliation.expectedBalanceTicks === undefined ? "Not computed" : resourceConservationPreview.reconciliation.expectedBalanceTicks + " ticks"}</strong></div>
                  <div><span>Observed balance:</span><strong>{resourceConservationPreview.reconciliation.observedBalanceTicks === undefined ? "Not accepted" : resourceConservationPreview.reconciliation.observedBalanceTicks + " ticks"}</strong></div>
                  <div><span>Discrepancy:</span><strong>{resourceConservationPreview.reconciliation.discrepancyTicks === undefined ? "Not computed" : resourceConservationPreview.reconciliation.discrepancyTicks + " ticks"}</strong></div>
                  <div><span>Contract tolerance:</span><strong>{resourceConservationPreview.reconciliation.toleranceTicks === undefined ? "Not available" : resourceConservationPreview.reconciliation.toleranceTicks + " ticks"}</strong></div>
                </div>
                {resourceConservationPreview.reconciliation.diagnostics.length > 0
                  ? <ul className="resource-conservation-diagnostics">{resourceConservationPreview.reconciliation.diagnostics.map((item, index) => <li key={item.code + index}><code>{item.code}</code><span>{item.message}</span></li>)}</ul>
                  : <p className="resource-conservation-no-diagnostics">No diagnostics for this sample result.</p>}
              </article>
            </div>
            <details className="runtime-preview-details">
              <summary>Evidence assumptions and evaluator limitations</summary>
              <ul>
                {resourceConservationPreview.assumptions.map((item) => <li key={item}>{item}</li>)}
                {resourceConservationPreview.conservation.limitations.map((item) => <li key={item}>{item}</li>)}
                {resourceConservationPreview.reconciliation.limitations.map((item) => <li key={item}>{item}</li>)}
              </ul>
            </details>
            <p className="fixture-browser-caveat">The sample resource kind and tick unit are synthetic demonstration data, not canonical vocabulary or physical units. The 60 v1.9 rows above remain source-only specification expectations. Neither result authenticates evidence, changes a ledger, authorises or executes an incantation, establishes physical feasibility, or verifies an effect.</p>
          </section>

          <section className="contract-worksheet" aria-labelledby="contract-worksheet-title">
            <div className="contract-worksheet-head">
              <div><span className="detail-kicker">INCANTATION DESIGN LAB · NON-EXECUTABLE</span><h2 id="contract-worksheet-title">Incantation contract worksheet</h2></div>
              <span className="contract-draft-status">DRAFT · NOT VALIDATED</span>
            </div>
            <p className="contract-worksheet-intro">Assemble a structured review record for an incantation idea. The output is a worksheet JSON record—not a spoken spell, parser input, permission decision or execution request. No operation is run.</p>
            <div className="contract-worksheet-grid">
              <label>Operation class<select aria-label="Operation class" value={contractOperation} onChange={(event) => setContractOperation(event.target.value)}>
                <option value="kren">kren — establish</option><option value="trak">trak — alter</option><option value="frem">frem — maintain</option><option value="shren">shren — release</option><option value="bran">bran — couple</option><option value="vare">vare — prefer</option>
              </select><span>Class label only; complete argument signatures remain unresolved.</span></label>
              <label>Target reference<input aria-label="Target reference" value={contractTarget} onChange={(event) => setContractTarget(event.target.value)} placeholder="e.g. target-01"/></label>
              <label className="contract-worksheet-wide">Requested outcome<textarea aria-label="Requested outcome" rows={2} value={contractDesiredOutcome} onChange={(event) => setContractDesiredOutcome(event.target.value)} placeholder="Describe the desired end state; this does not specify its mechanism."/></label>
              <label className="contract-worksheet-wide">Proposed mechanism<textarea aria-label="Proposed mechanism" rows={2} value={contractMechanism} onChange={(event) => setContractMechanism(event.target.value)} placeholder="Describe the proposed causal mechanism or leave unresolved."/></label>
              <label>Spatial role<select aria-label="Spatial role" value={contractSpatialRole} onChange={(event) => setContractSpatialRole(event.target.value)}><option value="unresolved">Unresolved</option><option value="po">po — position role</option><option value="fo">fo — direction role</option><option value="lo">lo — movement role</option></select></label>
              <label>Consent requirement declaration<select aria-label="Consent requirement declaration" value={contractConsentRequirement} onChange={(event) => setContractConsentRequirement(event.target.value)}><option value="unresolved">Unresolved</option><option value="required">Required</option><option value="not-required-requester-assertion">Not required (requester assertion only)</option></select><span>Declaration only; consent is not verified.</span></label>
              <label className="contract-worksheet-wide">Preconditions<textarea aria-label="Preconditions" rows={2} value={contractPreconditions} onChange={(event) => setContractPreconditions(event.target.value)} placeholder="Conditions that must hold before an attempt."/></label>
              <label className="contract-worksheet-wide">Constraints<textarea aria-label="Constraints" rows={2} value={contractConstraints} onChange={(event) => setContractConstraints(event.target.value)} placeholder="Limits, boundaries and required invariants."/></label>
              <label className="contract-worksheet-wide">Resource notes<textarea aria-label="Resource notes" rows={2} value={contractResourceNotes} onChange={(event) => setContractResourceNotes(event.target.value)} placeholder="Describe declared resources, units or budgets; none are checked here."/></label>
              <label className="contract-worksheet-wide">Authority decision reference<input aria-label="Authority decision reference" value={contractAuthorityReference} onChange={(event) => setContractAuthorityReference(event.target.value)} placeholder="Reference only; leave blank if no decision exists."/></label>
            </div>
            <div className="contract-worksheet-output-head"><div><span className="detail-kicker">GENERATED REVIEW RECORD</span><h3>Structured worksheet JSON</h3></div><span>Execution: NOT-EXECUTED</span></div>
            <textarea className="contract-worksheet-json" aria-label="Generated contract worksheet JSON" readOnly rows={20} value={JSON.stringify(contractWorksheet, null, 2)}/>
            <p className="contract-worksheet-caveat">This worksheet does not certify that the target exists, the mechanism works, the requested outcome is physically possible, resources are sufficient, authority is valid, consent exists or execution occurred. Those checks require separate evidence and implementations.</p>
          </section>
          <section className="lexicon-inspector" aria-labelledby="lexicon-inspector-title">
            <div className="lexicon-inspector-head">
              <div><span className="detail-kicker">SOURCE LOOKUP</span><h2 id="lexicon-inspector-title">Lexicon inspector</h2><p>Exact-form lookup against the pinned {BUNDLED_LEXICON_SOURCE.version} source snapshot. This view reports source records; it does not decide canon or change parser alias settings.</p></div>
              <a href={githubBlobUrl("sources/originals/Arcane_Lexicon_v5_draft.csv", GITHUB_SOURCE_REF)} target="_blank" rel="noreferrer">Open lexicon CSV ↗</a>
            </div>
            <label className="lexicon-query-label">Form or recorded multiword entry<input aria-label="Inspect source lexicon form" value={lexiconQuery} onChange={(event) => setLexiconQuery(event.target.value)} placeholder="e.g. pa, ra, frata"/></label>
            {!lexiconQuery.trim() ? <p className="lexicon-empty" role="status">Enter a form to inspect its source records.</p> : lexiconInspection?.entry ? <>
              <div className="lexicon-record-grid">
                <div><span>Normalised form</span><strong>{lexiconInspection.entry.form}</strong></div>
                <div><span>Source rows</span><strong>{lexiconInspection.entry.rowCount}</strong></div>
                <div><span>Glosses</span><strong>{lexiconInspection.entry.glosses.length ? lexiconInspection.entry.glosses.join(" · ") : "Not recorded in this snapshot"}</strong></div>
                <div><span>Lexical classes</span><strong>{lexiconInspection.entry.classes.length ? lexiconInspection.entry.classes.join(" · ") : "Not recorded in this snapshot"}</strong></div>
                <div><span>Registers</span><strong>{lexiconInspection.entry.registers.length ? lexiconInspection.entry.registers.join(" · ") : "Not recorded in this snapshot"}</strong></div>
                <div><span>Source status</span><strong>{lexiconInspection.entry.statuses.length ? lexiconInspection.entry.statuses.join(" · ") : "Not recorded in this snapshot"}</strong></div>
                <div className="lexicon-record-wide"><span>Source labels</span><strong>{lexiconInspection.entry.sources.length ? lexiconInspection.entry.sources.join(" · ") : "Not recorded in this snapshot"}</strong></div>
                {lexiconInspection.entry.notes.length > 0 && <div className="lexicon-record-wide"><span>Source notes</span><strong>{lexiconInspection.entry.notes.join(" · ")}</strong></div>}
              </div>
              {lexiconInspection.isCollision && <p className="lexicon-warning" role="status">Collision warning: this spelling has multiple source analyses. The parser refuses to choose a meaning without a documented contextual rule.</p>}
            </> : lexiconInspection?.nonAtomicEntry ? <div className="lexicon-record-grid">
              <div><span>Recorded form</span><strong>{lexiconInspection.nonAtomicEntry.form}</strong></div>
              <div><span>Source rows</span><strong>{lexiconInspection.nonAtomicEntry.rowCount}</strong></div>
              <div><span>Glosses</span><strong>{lexiconInspection.nonAtomicEntry.glosses.join(" · ") || "Not recorded in this snapshot"}</strong></div>
              <div><span>Source status</span><strong>{lexiconInspection.nonAtomicEntry.statuses.join(" · ") || "Not recorded in this snapshot"}</strong></div>
              <p className="lexicon-warning" role="status">This source record is preserved as a multiword/editorial form and is not an atomic token in the current parser.</p>
            </div> : <p className="lexicon-empty" role="status">No exact source entry found for “{lexiconQuery.trim()}”. This does not prove that the form is invalid in every Arcane register or historical source.</p>}
            {lexiconInspection?.alias && <p className="lexicon-alias" role="status"><strong>Recorded legacy alias:</strong> {lexiconInspection.alias.alias} → {lexiconInspection.alias.preferredForm}. Evidence: {lexiconInspection.alias.evidence}. This is an inspection result only; parsing does not rewrite aliases by default.</p>}
            <p className="lexicon-provenance">Source: {BUNDLED_LEXICON_SOURCE.label} ({BUNDLED_LEXICON_SOURCE.version}); {bundledLexiconLoad.rowCount} loaded rows. Lexicon and alias CSV snapshots are versioned evidence, not blanket canon promotion.</p>
          </section>
          <div className="editor-card"><div className="editor-toolbar"><div><span className="editor-dot"/><span className="editor-file">untitled.phase6g</span><span className="editor-language">PROVISIONAL SURFACE-LIKE NOTATION</span></div><button className="secondary-button" onClick={() => { setEditor(""); setAnalysis(null); }}>Clear editor</button></div><div className="editor-body"><div className="line-number">1<br/>2<br/>3<br/>4<br/>5<br/>6<br/>7<br/>8</div><textarea spellCheck={false} value={editor} onChange={(e) => { setEditor(e.target.value); setAnalysis(null); }} placeholder={"Try: frapa ki sho to sho\nLexicon atom: pa\nDecimal: frapa za shi to ma ki sho"} aria-label="Phase 6G surface-like expression editor"/></div><div className="editor-footer"><span>{editor.length} characters</span><span>Provisional syntax only · no semantic execution</span></div></div>
          <div className="playground-actions"><button className="secondary-button run-button" onClick={() => setAnalysis(parseSurfaceExpression(editor, { lexiconRegistry: bundledLexiconLoad.registry }))}><Play size={14}/> Parse surface-like notation</button><span>Registered operators: FRAPA, FRAJA, FRAMA, FRALA, FRASHA, DRAN, DREM, DRUM, DRAS, GRAN, GRAT, GRASH, KWAM, KWAT, KWASH, BEK, ZET, KOLE</span></div>
          <div className="result-panel"><div className="result-heading"><Command size={17}/><strong>Analysis output</strong><span>{analysis ? (analysis.ok ? "PARSE OK" : "DIAGNOSTICS") : "WAITING"}</span></div>{!analysis ? <div className="result-empty"><Braces size={27}/><strong>No analysis has been run</strong><p>Enter a Phase 6G surface-like expression and select Parse surface-like notation to inspect its syntax tree or diagnostics.</p></div> : <div className="analysis-output">{analysis.ok && analysis.ast ? <><div className="analysis-status success"><CheckCircle2 size={16}/> Unique structural parse produced</div><pre>{JSON.stringify(analysis.ast, null, 2)}</pre></> : <><div className="analysis-status failure"><AlertTriangle size={16}/> Expression rejected by the provisional parser</div><ul>{analysis.diagnostics.map((d, i) => <li key={d.code + d.tokenIndex + i}><code>{d.code}</code> — {d.message} <span>(token {d.tokenIndex}{d.token ? ` · ${d.token}` : ""})</span></li>)}</ul></>}<p className="analysis-caveat">A successful parse proves only that this expression fits the implemented provisional surface-like syntax. It does not prove semantic correctness, dimensional compatibility, mana feasibility, or that the form is canonical Arcane.</p></div>}</div>
          {semanticAnalysis && <div className="result-panel semantic-result-panel"><div className="result-heading"><ShieldCheck size={17}/><strong>Semantic analysis</strong><span>{semanticAnalysis.status.toUpperCase()}</span></div><div className="analysis-output"><div className={"analysis-status " + (semanticAnalysis.status === "valid" ? "success" : semanticAnalysis.status === "invalid" ? "failure" : "warning")}>{semanticAnalysis.status === "valid" ? "Registered value types annotated" : semanticAnalysis.status === "invalid" ? "Semantic errors detected" : "Some semantic meaning remains unresolved"}</div><p className="analysis-caveat">This is a separate stage after parsing. A valid result means only that the available source-backed semantic checks found no issue; it does not establish physical feasibility, authority, execution, or canonical status.</p>{semanticAnalysis.diagnostics.length > 0 && <ul>{semanticAnalysis.diagnostics.map((item, index) => <li key={item.code + item.path + index}><code>{item.code}</code> — {item.message} <span>({item.path})</span></li>)}</ul>}<details><summary>Inspect conservative typed syntax tree</summary><pre>{JSON.stringify(semanticAnalysis.typedAst, null, 2)}</pre></details><details><summary>Current analysis limitations</summary><ul>{semanticAnalysis.limitations.map((item) => <li key={item}>{item}</li>)}</ul></details></div></div>}
          {expressionConstructionBridge && <div className="result-panel semantic-result-panel"><div className="result-heading"><GitBranch size={17}/><strong>Expression → Incantation boundary</strong><span>{expressionConstructionBridge.status}</span></div><div className="analysis-output"><p className="analysis-caveat">This is a traceability boundary, not a translator. The provisional surface AST is preserved separately from the Incantation contract slots; no operator-to-macro, argument-to-Construction or semantic equivalence is assumed.</p><div className="bridge-slot-list">{expressionConstructionBridge.targetSlots.map((slot) => <div className="bridge-slot-row" key={slot}><code>{slot}</code><span>{expressionConstructionBridge.unmappedSlots.includes(slot) ? "No source-backed mapping recorded" : "Traceability record present — unverified"}</span></div>)}</div><p><strong>Source AST nodes:</strong> {expressionConstructionBridge.sourceNodes.length ? expressionConstructionBridge.sourceNodes.map((node) => node.path + " · " + node.kind + (node.operator ? " · " + node.operator : "")).join("; ") : "Unavailable because parsing did not succeed."}</p>{expressionConstructionBridge.diagnostics.length > 0 && <ul>{expressionConstructionBridge.diagnostics.map((item, index) => <li key={item.code + index}><code>{item.code}</code> — {item.message}</li>)}</ul>}<details><summary>Inspect boundary record</summary><pre>{JSON.stringify(expressionConstructionBridge, null, 2)}</pre></details></div></div>}
          <div className="next-step"><Sparkles size={17}/><p><strong>Scope guard</strong><br/>This parser is an explicitly bounded Phase 6G prototype. Source-aware lexical integration, semantic and dimensional validation, complete canonical grammar, physical feasibility and spell execution remain separate tasks.</p></div>
          <section className="fixture-browser vernacular-playground" aria-labelledby="unified-vernacular-title"><div className="fixture-browser-head"><div><span className="detail-kicker">UNIFIED ENTRY POINT · LOCKED MODERN VERNACULAR · v1.0–v2.7</span><h2 id="unified-vernacular-title">Unified language analyser</h2></div><span>Automatic grammar dispatch</span></div><p className="fixture-browser-intro">Enter a clause, a v1.9–v2.7 conditional, aspect, temporal, waiting, numeric or measurement expression (for example, `teshi don zir rawu melo`), a standalone typed measurement, or a v2.7 comparison from the implemented locked versions. The analyser dispatches from the expression's opening construction or predicate, then delegates to the corresponding strict parser. It does not translate, repair or guess malformed expressions. Try <code>teshi wish fezo</code>, <code>teshi yemi ful tava gezi</code>, <code>teshi nava fam ful tava gezi</code>, <code>teshi zami ful tava gezi</code>, <code>sori nak rawu</code> or <code>teshi wish fezo lena fezo nak rawu</code>, <code>dori to ma mu ma</code>, <code>teshi don mol gisho</code>, <code>teshi kok mol gisho</code>, <code>nemi teshi kok mol gisho</code>, <code>teshi don mol gisho pavo teshi don tut losa</code>, <code>teshi don zir rawu melo</code>, <code>teshi don mos rawu runi</code>, <code>teshi kok seno</code>, <code>teshi kok seno kavi fezo don zem</code>, <code>teshi don zir rawu ki se</code>, <code>teshi don zir rawu ki to se</code>, <code>teshi don zir rawu to shi sa se</code>, <code>teshi don zir rawu nela ki to se</code>, <code>nela to shi sa ke</code> and <code>mu shi sa ma</code>.</p><div className="editor-card"><div className="editor-toolbar"><div><span className="editor-dot"/><span className="editor-file">unified-modern-vernacular.ani</span><span className="editor-language">AUTO VERSION DETECTION</span></div><button className="secondary-button" onClick={() => { setUnifiedVernacularEditor(""); setUnifiedVernacularResult(null); }}>Clear</button></div><div className="editor-body"><div className="line-number">1</div><textarea spellCheck={false} value={unifiedVernacularEditor} onChange={(event) => { setUnifiedVernacularEditor(event.target.value); setUnifiedVernacularResult(null); }} placeholder="teshi fam wish fezo" aria-label="Unified Modern Vernacular expression editor"/></div><div className="editor-footer"><span>{unifiedVernacularEditor.length} characters</span><span>v1.0–v2.7 dispatch · fail-closed validation</span></div></div><div className="playground-actions"><button className="secondary-button run-button" onClick={() => setUnifiedVernacularResult(parseModernVernacular(unifiedVernacularEditor))}><Play size={14}/> Analyse expression</button><span>Grammar is selected from the expression itself</span></div><div className="result-panel"><div className="result-heading"><BookOpen size={17}/><strong>Unified Modern Vernacular result</strong><span>{unifiedVernacularResult ? (unifiedVernacularResult.ok ? "LOCKED GRAMMAR PARSE OK" : "REJECTED / BLOCKED") : "WAITING"}</span></div>{!unifiedVernacularResult ? <div className="result-empty"><Braces size={27}/><strong>No analysis has been run</strong><p>Enter a construction from any implemented Modern Vernacular version and select Analyse expression.</p></div> : <div className="analysis-output">{unifiedVernacularResult.ok && unifiedVernacularResult.ast ? <><div className="analysis-status success"><CheckCircle2 size={16}/> Recognised under {unifiedVernacularResult.grammar}</div><pre>{JSON.stringify(unifiedVernacularResult.ast, null, 2)}</pre></> : <><div className="analysis-status failure"><AlertTriangle size={16}/> Expression is not licensed by the selected grammar</div><ul>{unifiedVernacularResult.diagnostics.map((item, index) => <li key={item.code + index}><code>{item.code}</code> — {item.message}{item.token ? <span> (token {item.tokenIndex}: {item.token})</span> : null}</li>)}</ul></>}</div>}</div><p className="fixture-browser-caveat">Automatic dispatch is not a universal grammar: it selects among the currently implemented locked versions only; Conditional expressions use explicit navi…saku grouping; ravi requires the written semicolon boundary. Standalone v2.6 typed measurements and v2.7 comparison expressions are supported; neither is a full clause grammar. An unrecognised predicate is sent to the v1.0 parser to produce a conservative rejection. Formal Arcane syntax remains a separate system.</p></section>
          <section className="fixture-browser vernacular-playground" aria-labelledby="vernacular-playground-title"><div className="fixture-browser-head"><div><span className="detail-kicker">LOCKED GRAMMAR · MODERN VERNACULAR v1.0</span><h2 id="vernacular-playground-title">Everyday language playground</h2></div><span>Bounded core parser</span></div><p className="fixture-browser-intro">This parser implements only the locked Modern Vernacular v1.0 core. It is separate from the provisional Formal Arcane notation above. Try <code>teshi wish fezo</code>, <code>shuk wish fezo</code>, <code>teshi wish fezo pun</code>, <code>teshi nava wish fezo</code>, or a standalone response such as <code>wang</code>.</p><div className="editor-card"><div className="editor-toolbar"><div><span className="editor-dot"/><span className="editor-file">untitled.vernacular</span><span className="editor-language">MODERN VERNACULAR v1.0</span></div><button className="secondary-button" onClick={() => { setVernacularEditor(""); setVernacularResult(null); }}>Clear</button></div><div className="editor-body"><div className="line-number">1</div><textarea spellCheck={false} value={vernacularEditor} onChange={(event) => { setVernacularEditor(event.target.value); setVernacularResult(null); }} placeholder="teshi wish fezo" aria-label="Modern Vernacular v1.0 expression editor"/></div><div className="editor-footer"><span>{vernacularEditor.length} characters</span><span>Locked v1.0 core · no invented repairs</span></div></div><div className="playground-actions"><button className="secondary-button run-button" onClick={() => setVernacularResult(parseModernVernacularV1(vernacularEditor))}><Play size={14}/> Analyse Vernacular</button><span>Strict grammar · unsupported forms are rejected</span></div><div className="result-panel"><div className="result-heading"><BookOpen size={17}/><strong>Vernacular analysis</strong><span>{vernacularResult ? (vernacularResult.ok ? "LOCKED CORE PARSE OK" : "REJECTED / BLOCKED") : "WAITING"}</span></div>{!vernacularResult ? <div className="result-empty"><Braces size={27}/><strong>No Vernacular analysis has been run</strong><p>Enter a construction from the locked v1.0 core and select Analyse Vernacular.</p></div> : <div className="analysis-output">{vernacularResult.ok && vernacularResult.ast ? <><div className="analysis-status success"><CheckCircle2 size={16}/> Construction recognised under Modern Vernacular v1.0</div><pre>{JSON.stringify(vernacularResult.ast, null, 2)}</pre></> : <><div className="analysis-status failure"><AlertTriangle size={16}/> Construction is not licensed by the locked core</div><ul>{vernacularResult.diagnostics.map((item, index) => <li key={item.code + index}><code>{item.code}</code> — {item.message}{item.token ? <span> (token {item.tokenIndex}: {item.token})</span> : null}</li>)}</ul></>}</div>}</div><p className="fixture-browser-caveat">This parser recognises only the bounded v1.0 grammar. It does not infer tense, pronouns, omitted participants, other verb frames, modality, embedded clauses or general conversation grammar.</p>
          <section className="fixture-browser vernacular-playground" aria-labelledby="vernacular-v11-title"><div className="fixture-browser-head"><div><span className="detail-kicker">LOCKED GRAMMAR · MODERN VERNACULAR v1.1</span><h2 id="vernacular-v11-title">Everyday verbs expansion</h2></div><span>Six bounded verb frames</span></div><p className="fixture-browser-intro">The v1.1 parser adds nak (hear), zir (utter), shus (know an item), mos (learn), mol (eat) and tut (drink). Their complements are deliberately narrow. Try <code>teshi nak rawu</code>, <code>fezo mol gisho</code>, <code>teshi nava zir rawu</code>, <code>shuk tut losa</code> or <code>teshi mol zosh</code>.</p><div className="editor-card"><div className="editor-toolbar"><div><span className="editor-dot"/><span className="editor-file">everyday-v1-1.vernacular</span><span className="editor-language">MODERN VERNACULAR v1.1</span></div><button className="secondary-button" onClick={() => { setVernacularV11Editor(""); setVernacularV11Result(null); }}>Clear</button></div><div className="editor-body"><div className="line-number">1</div><textarea spellCheck={false} value={vernacularV11Editor} onChange={(event) => { setVernacularV11Editor(event.target.value); setVernacularV11Result(null); }} placeholder="teshi nak rawu" aria-label="Modern Vernacular v1.1 expression editor"/></div><div className="editor-footer"><span>{vernacularV11Editor.length} characters</span><span>Closed v1.1 verb inventory · no inferred complements</span></div></div><div className="playground-actions"><button className="secondary-button run-button" onClick={() => setVernacularV11Result(parseModernVernacularV11(vernacularV11Editor))}><Play size={14}/> Analyse v1.1</button><span>Strict frame validation · unsupported roles rejected</span></div><div className="result-panel"><div className="result-heading"><BookOpen size={17}/><strong>v1.1 verb-frame analysis</strong><span>{vernacularV11Result ? (vernacularV11Result.ok ? "LOCKED FRAME PARSE OK" : "REJECTED / BLOCKED") : "WAITING"}</span></div>{!vernacularV11Result ? <div className="result-empty"><Braces size={27}/><strong>No v1.1 analysis has been run</strong><p>Enter a construction from the six locked verb frames and select Analyse v1.1.</p></div> : <div className="analysis-output">{vernacularV11Result.ok && vernacularV11Result.ast ? <><div className="analysis-status success"><CheckCircle2 size={16}/> Construction recognised under Modern Vernacular v1.1</div><pre>{JSON.stringify(vernacularV11Result.ast, null, 2)}</pre></> : <><div className="analysis-status failure"><AlertTriangle size={16}/> Construction is not licensed by v1.1</div><ul>{vernacularV11Result.diagnostics.map((item, index) => <li key={item.code + index}><code>{item.code}</code> — {item.message}{item.token ? <span> (token {item.tokenIndex}: {item.token})</span> : null}</li>)}</ul></>}</div>}</div><p className="fixture-browser-caveat">v1.1 is an extension, not a rewrite of v1.0. This panel validates only the six listed transitive frames and the specifically inherited simple question/negation patterns. Transfer, motion, modality, permission, directives and clause linking are not parsed here yet.</p></section>
          <section className="fixture-browser vernacular-playground" aria-labelledby="vernacular-v12-title"><div className="fixture-browser-head"><div><span className="detail-kicker">LOCKED GRAMMAR · MODERN VERNACULAR v1.2</span><h2 id="vernacular-v12-title">Transfer and recipient playground</h2></div><span>Three explicit roles</span></div><p className="fixture-browser-intro">v1.2 adds transfer patterns with <code>li</code> for the item, <code>ka</code> for the recipient in the give frame, and <code>du</code> for the source in receive/take frames. Try <code>teshi bul li fape ka fezo</code>, <code>fezo bul li fape du teshi</code>, or <code>teshi lil li fape du fezo</code>.</p><div className="editor-card"><div className="editor-toolbar"><div><span className="editor-dot"/><span className="editor-file">transfer-v1-2.vernacular</span><span className="editor-language">MODERN VERNACULAR v1.2</span></div><button className="secondary-button" onClick={() => { setVernacularV12Editor(""); setVernacularV12Result(null); }}>Clear</button></div><div className="editor-body"><div className="line-number">1</div><textarea spellCheck={false} value={vernacularV12Editor} onChange={(event) => { setVernacularV12Editor(event.target.value); setVernacularV12Result(null); }} placeholder="teshi bul li fape ka fezo" aria-label="Modern Vernacular v1.2 transfer expression editor"/></div><div className="editor-footer"><span>{vernacularV12Editor.length} characters</span><span>Restricted role particles · no inferred roles</span></div></div><div className="playground-actions"><button className="secondary-button run-button" onClick={() => setVernacularV12Result(parseModernVernacularV12(vernacularV12Editor))}><Play size={14}/> Analyse v1.2</button><span>Strict transfer-frame validation</span></div><div className="result-panel"><div className="result-heading"><BookOpen size={17}/><strong>v1.2 transfer analysis</strong><span>{vernacularV12Result ? (vernacularV12Result.ok ? "TRANSFER FRAME PARSE OK" : "REJECTED / BLOCKED") : "WAITING"}</span></div>{!vernacularV12Result ? <div className="result-empty"><Braces size={27}/><strong>No v1.2 analysis has been run</strong><p>Enter a locked transfer construction and select Analyse v1.2.</p></div> : <div className="analysis-output">{vernacularV12Result.ok && vernacularV12Result.ast ? <><div className="analysis-status success"><CheckCircle2 size={16}/> Transfer roles recognised under Modern Vernacular v1.2</div><pre>{JSON.stringify(vernacularV12Result.ast, null, 2)}</pre></> : <><div className="analysis-status failure"><AlertTriangle size={16}/> Construction is not licensed by v1.2</div><ul>{vernacularV12Result.diagnostics.map((item, index) => <li key={item.code + index}><code>{item.code}</code> — {item.message}{item.token ? <span> (token {item.tokenIndex}: {item.token})</span> : null}</li>)}</ul></>}</div>}</div><p className="fixture-browser-caveat">This panel does not infer successful delivery, ownership transfer, consent, permission or tense. The particles are licensed only in the locked v1.2 transfer slots; ka and du retain their other register-specific meanings elsewhere.</p></section>
          <section className="fixture-browser vernacular-playground" aria-labelledby="vernacular-v13-title"><div className="fixture-browser-head"><div><span className="detail-kicker">LOCKED GRAMMAR · MODERN VERNACULAR v1.3</span><h2 id="vernacular-v13-title">Motion and routes playground</h2></div><span>Goal · source · route</span></div><p className="fixture-browser-intro">v1.3 adds <code>ful</code> (go/travel), <code>zem</code> (come), <code>tava</code> (goal), <code>dava</code> (source) and <code>yara</code> (route). Each spatial role must be marked. Try <code>teshi ful tava gezi</code>, <code>teshi ful dava gezi</code>, <code>teshi ful yara gezi</code>, <code>fezo ful</code> or <code>shuk zem</code>.</p><div className="editor-card"><div className="editor-toolbar"><div><span className="editor-dot"/><span className="editor-file">motion-v1-3.vernacular</span><span className="editor-language">MODERN VERNACULAR v1.3</span></div><button className="secondary-button" onClick={() => { setVernacularV13Editor(""); setVernacularV13Result(null); }}>Clear</button></div><div className="editor-body"><div className="line-number">1</div><textarea spellCheck={false} value={vernacularV13Editor} onChange={(event) => { setVernacularV13Editor(event.target.value); setVernacularV13Result(null); }} placeholder="teshi ful tava gezi" aria-label="Modern Vernacular v1.3 motion expression editor"/></div><div className="editor-footer"><span>{vernacularV13Editor.length} characters</span><span>Strict spatial role marking · bounded place vocabulary</span></div></div><div className="playground-actions"><button className="secondary-button run-button" onClick={() => setVernacularV13Result(parseModernVernacularV13(vernacularV13Editor))}><Play size={14}/> Analyse v1.3</button><span>No inferred destination or route</span></div><div className="result-panel"><div className="result-heading"><BookOpen size={17}/><strong>v1.3 motion analysis</strong><span>{vernacularV13Result ? (vernacularV13Result.ok ? "MOTION FRAME PARSE OK" : "REJECTED / BLOCKED") : "WAITING"}</span></div>{!vernacularV13Result ? <div className="result-empty"><Braces size={27}/><strong>No v1.3 analysis has been run</strong><p>Enter a locked motion construction and select Analyse v1.3.</p></div> : <div className="analysis-output">{vernacularV13Result.ok && vernacularV13Result.ast ? <><div className="analysis-status success"><CheckCircle2 size={16}/> Motion roles recognised under Modern Vernacular v1.3</div><pre>{JSON.stringify(vernacularV13Result.ast, null, 2)}</pre></> : <><div className="analysis-status failure"><AlertTriangle size={16}/> Construction is not licensed by v1.3</div><ul>{vernacularV13Result.diagnostics.map((item, index) => <li key={item.code + index}><code>{item.code}</code> — {item.message}{item.token ? <span> (token {item.tokenIndex}: {item.token})</span> : null}</li>)}</ul></>}</div>}</div><p className="fixture-browser-caveat">zem encodes movement toward a contextually established deictic centre; the parser cannot determine that centre. It therefore validates the syntax but does not claim that a particular destination is contextually compatible or that arrival occurred. Only gezi is currently accepted as a place expression in this bounded learner parser.</p></section>
          <section className="fixture-browser vernacular-playground" aria-labelledby="vernacular-v14-title"><div className="fixture-browser-head"><div><span className="detail-kicker">LOCKED GRAMMAR · MODERN VERNACULAR v1.4</span><h2 id="vernacular-v14-title">Modality and intention playground</h2></div><span>Ability · desire · practical need</span></div><p className="fixture-browser-intro">v1.4 adds <code>fam</code> (ability), <code>kong</code> (desire) and <code>tek</code> (practical need). Each modal preserves the licensed action frame. Try <code>teshi fam wish fezo</code>, <code>teshi kong fape</code>, <code>teshi tek mol gisho</code> or <code>teshi fam ful tava gezi pun</code>.</p><div className="editor-card"><div className="editor-toolbar"><div><span className="editor-dot"/><span className="editor-file">modality-v1-4.vernacular</span><span className="editor-language">MODERN VERNACULAR v1.4</span></div><button className="secondary-button" onClick={() => { setVernacularV14Editor(""); setVernacularV14Result(null); }}>Clear</button></div><div className="editor-body"><div className="line-number">1</div><textarea spellCheck={false} value={vernacularV14Editor} onChange={(event) => { setVernacularV14Editor(event.target.value); setVernacularV14Result(null); }} placeholder="teshi fam ful tava gezi" aria-label="Modern Vernacular v1.4 modal expression editor"/></div><div className="editor-footer"><span>{vernacularV14Editor.length} characters</span><span>Closed modal inventory · action-frame inheritance</span></div></div><div className="playground-actions"><button className="secondary-button run-button" onClick={() => setVernacularV14Result(parseModernVernacularV14(vernacularV14Editor))}><Play size={14}/> Analyse v1.4</button><span>Negation scope and permission deliberately blocked</span></div><div className="result-panel"><div className="result-heading"><BookOpen size={17}/><strong>v1.4 modal analysis</strong><span>{vernacularV14Result ? (vernacularV14Result.ok ? "MODAL FRAME PARSE OK" : "REJECTED / BLOCKED") : "WAITING"}</span></div>{!vernacularV14Result ? <div className="result-empty"><Braces size={27}/><strong>No v1.4 analysis has been run</strong><p>Enter a licensed modal construction and select Analyse v1.4.</p></div> : <div className="analysis-output">{vernacularV14Result.ok && vernacularV14Result.ast ? <><div className="analysis-status success"><CheckCircle2 size={16}/> Modal construction recognised under Modern Vernacular v1.4</div><pre>{JSON.stringify(vernacularV14Result.ast, null, 2)}</pre></> : <><div className="analysis-status failure"><AlertTriangle size={16}/> Construction is not licensed by v1.4</div><ul>{vernacularV14Result.diagnostics.map((item, index) => <li key={item.code + index}><code>{item.code}</code> — {item.message}{item.token ? <span> (token {item.tokenIndex}: {item.token})</span> : null}</li>)}</ul></>}</div>}</div><p className="fixture-browser-caveat">fam expresses ability, not permission; kong expresses desire, not guaranteed intention; tek expresses practical need, not automatic legal or moral obligation. Modal statements do not assert completion. nava with modals is blocked because its scope is unspecified. The parser does not evaluate whether the subject truly has the ability or need.</p></section></section>
        </section>}

        {section === "Test suite" && <section className="page-content">
          <div className="eyebrow"><span className="eyebrow-line"/> QUALITY & REGRESSION</div><h1 className="page-title">Test suite<span>.</span></h1>
          <p className="page-intro">A traceable explorer for the authored parser and dimensional test cases, paired with live GitHub Actions run and job-step results for the repository. CI status is fetched from GitHub; this page does not execute tests in the browser.</p>
          <div className="test-summary">
            <div><span>AUTHORED CASES</span><strong>{workbenchTests.length}</strong><small>{workbenchTests.filter((test) => test.group === "Parser").length} audit parser · {workbenchTests.filter((test) => test.group === "Surface parser").length} surface parser · {workbenchTests.filter((test) => test.group === "Dimensions").length} dimensional · {workbenchTests.filter((test) => test.group === "Semantic types").length} semantic · {workbenchTests.filter((test) => test.group === "Operator contracts").length} operator-contract · {workbenchTests.filter((test) => test.group === "Source lexicon").length} lexicon · {workbenchTests.filter((test) => test.group === "Fixture audit").length} fixture audit</small></div>
            <div><span>LATEST CI RESULT</span><strong className={latestCiRun?.conclusion === "success" ? "ci-success-text" : latestCiRun?.conclusion === "failure" ? "ci-failure-text" : "amber-text"}>{workflowLoading ? "Loading…" : latestCiRun ? formatRunStatus(latestCiRun.status, latestCiRun.conclusion) : "Unavailable"}</strong><small>{latestCiRun ? `Run #${latestCiRun.run_number}` : "No run loaded"}</small></div>
            <div><span>WEBSITE BUILD</span><strong className={latestBuildStep?.status === "completed" && latestBuildStep.conclusion === "success" ? "ci-success-text" : latestBuildStep?.status === "completed" && latestBuildStep.conclusion === "failure" ? "ci-failure-text" : "amber-text"}>{workflowLoading ? "Loading…" : workflowError ? "Unavailable" : latestBuildStep ? formatRunStatus(latestBuildStep.status, latestBuildStep.conclusion) : "Unavailable"}</strong><small>{latestCiRun ? `Run #${latestCiRun.run_number} · Type-check and build` : "Build step unavailable"}</small></div>
            <div><span>SPECIFICATION STATUS</span><strong className="amber-text">Prototype</strong><small>Provisional parser and dimensions</small></div>
          </div>
          <div className="ci-panel">
            <div className="ci-panel-header">
              <div><div className="ci-kicker"><Activity size={14}/> LIVE REPOSITORY CI</div><h2>GitHub Actions</h2><p>Read-only status from the public repository’s CI workflow.</p></div>
              <button className="secondary-button" onClick={() => void refreshWorkflow()} disabled={workflowLoading}>{workflowLoading ? "Refreshing…" : "Refresh status ↻"}</button>
            </div>
            {workflowError && <div className="ci-error"><AlertTriangle size={16}/><span>{workflowError} Check the workflow directly on GitHub if the API is rate-limited.</span></div>}
            {!workflowError && workflowLoading && workflowRuns.length === 0 && <div className="ci-empty">Loading recent workflow runs from GitHub…</div>}
            {!workflowLoading && !workflowError && workflowRuns.length === 0 && <div className="ci-empty">No workflow runs were returned for the main branch.</div>}
            {workflowRuns.slice(0, 5).map((run) => {
              const isLatest = run.id === latestCiRun?.id;
              return <article className="ci-run" key={run.id}>
                <div className="ci-run-top">
                  <div><a href={run.html_url} target="_blank" rel="noreferrer" className="ci-run-link">{run.name || "Workflow"} · Run #{run.run_number} ↗</a><p>{(run.head_commit?.message ?? "Commit message unavailable").split("\n")[0]}</p></div>
                  <span className={"ci-badge ci-" + (run.status !== "completed" ? "pending" : run.conclusion === "success" ? "success" : run.conclusion === "failure" ? "failure" : "neutral")}>{formatRunStatus(run.status, run.conclusion)}</span>
                </div>
                <div className="ci-run-meta"><span>Commit <a href={`https://github.com/sixtoast/Anime-language-/commit/${run.head_sha}`} target="_blank" rel="noreferrer"><code>{run.head_sha.slice(0, 7)}</code></a></span><span>Started {prettyDate(run.created_at)}</span><span>Event {run.event}</span></div>
                {isLatest && workflowJobs.length > 0 && <div className="ci-jobs">
                  {workflowJobs.map((job) => <div className="ci-job" key={job.id}>
                    <div className="ci-job-heading"><strong>{job.name}</strong><span className={"ci-step-state ci-" + (job.status !== "completed" ? "pending" : job.conclusion === "success" ? "success" : job.conclusion === "failure" ? "failure" : "neutral")}>{formatRunStatus(job.status, job.conclusion)}</span></div>
                    {job.steps?.filter((step) => /test|build|type-check|install dependencies/i.test(step.name)).map((step) => <div className="ci-step" key={step.number}><span>{step.name}</span><span className={"ci-step-state ci-" + (step.status !== "completed" ? "pending" : step.conclusion === "success" ? "success" : step.conclusion === "failure" ? "failure" : "neutral")}>{formatRunStatus(step.status, step.conclusion)}</span></div>)}
                  </div>)}
                </div>}
              </article>;
            })}
            {workflowUpdatedAt && <div className="ci-updated">Fetched {prettyDate(workflowUpdatedAt)} · API results may be delayed by GitHub.</div>}
          </div>
          <div className="test-explorer">
            <div className="test-explorer-toolbar">
              <div className="test-search"><Search size={16}/><input value={testQuery} onChange={(e) => setTestQuery(e.target.value)} placeholder="Filter by ID, title, rule or description…" aria-label="Filter test cases"/></div>
              <div className="test-filters" aria-label="Filter test group">
                {(["All", "Parser", "Surface parser", "Dimensions", "Semantic types", "Operator contracts", "Source lexicon", "Fixture audit", "Incantation contracts"] as const).map((group) => <button key={group} className={testGroup === group ? "test-filter active" : "test-filter"} onClick={() => setTestGroup(group)}>{group}</button>)}
              </div>
            </div>
            <div className="test-explorer-meta"><span>{workbenchTests.filter((test) => (testGroup === "All" || test.group === testGroup) && (test.id + " " + test.title + " " + test.description + " " + test.sourceRule).toLowerCase().includes(testQuery.toLowerCase())).length} cases shown</span><span><span className="status-dot status-dot-pending"/> {registryResults ? `Report for ${registryResults.commit?.slice(0, 7) ?? "unknown commit"} · ${registryResults.counts.passed} passed · ${registryResults.counts.failed} failed · ${registryResults.counts.skipped} skipped` : "Waiting for published per-test results"}</span></div>
            {registryResultsError && <div className="ci-empty">{registryResultsError}</div>}
            {registryResults && <div className="registry-results-meta">Test report commit <code>{registryResults.commit?.slice(0, 7) ?? "unknown"}</code> · generated {prettyDate(registryResults.generatedAt)} · <a href={`https://github.com/sixtoast/Anime-language-/actions/runs/${registryResults.runId}`} target="_blank" rel="noreferrer">Open matching CI run ↗</a></div>}
            <div className="test-case-list">
              {workbenchTests.filter((test) => (testGroup === "All" || test.group === testGroup) && (test.id + " " + test.title + " " + test.description + " " + test.sourceRule).toLowerCase().includes(testQuery.toLowerCase())).map((test) => <article className="test-case" key={test.id}>
                <div className="test-case-main"><div className="test-case-title"><code>{test.id}</code><strong>{test.title}</strong></div><p>{test.description}</p><div className="test-case-meta"><span>Rules: {test.sourceRule}</span><a href={githubBlobUrl(test.file, GITHUB_SOURCE_REF)} target="_blank" rel="noreferrer">Open test source ↗</a></div></div>
                <div className="test-case-status"><span className={"test-status-chip " + ((registryResults?.tests.find((result) => result.id === test.id)?.status === "passed") ? "test-status-passed" : (registryResults?.tests.find((result) => result.id === test.id)?.status === "failed") ? "test-status-failed" : (registryResults?.tests.find((result) => result.id === test.id)?.status === "pending" || registryResults?.tests.find((result) => result.id === test.id)?.status === "todo") ? "test-status-skipped" : "")}>{registryResults?.tests.find((result) => result.id === test.id) ? registryResults.tests.find((result) => result.id === test.id)?.status : "NOT VERIFIED"}</span><small>{test.group}</small>{registryResults?.tests.find((result) => result.id === test.id)?.durationMs != null && <small>{registryResults.tests.find((result) => result.id === test.id)?.durationMs} ms</small>}</div>
              </article>)}
              {workbenchTests.filter((test) => (testGroup === "All" || test.group === testGroup) && (test.id + " " + test.title + " " + test.description + " " + test.sourceRule).toLowerCase().includes(testQuery.toLowerCase())).length === 0 && <div className="empty-state">No test cases match those filters.</div>}
            </div>
          </div>
          <div className="notice"><div className="notice-icon"><ShieldCheck size={18}/></div><div><strong>What this status means</strong><p>A case shows Passed, Failed or Skipped only when its stable ID appears in the published CI report for the displayed commit. Missing IDs remain Not verified, not a pass or a failure. Dimensional tests validate the current implementation convention only; they do not finalise Arcane unit semantics or operator typing.</p></div></div>
          <div className="next-step"><Sparkles size={17}/><p><strong>Result granularity</strong><br/>The live panel reports actual workflow outcomes, and each registry row is matched by its stable test ID to the published structured report. The report commit is shown explicitly; a missing or stale result is never silently treated as a pass.</p></div>
        </section>}

        {section === "Research & review" && <section className="page-content">
          <div className="eyebrow"><span className="eyebrow-line"/> EVIDENCE, QUESTIONS, DECISIONS</div><h1 className="page-title">Research & review<span>.</span></h1><p className="page-intro">Keep unresolved questions visible. Findings should be traceable to source material and should not become canonical by implication.</p>
          <div className="review-banner"><FlaskConical size={20}/><div><strong>Active audit context</strong><p>Phase 2 is the priority source for the semantic audit. Preserve older forms as aliases unless an inconsistency is demonstrated.</p></div><span className="review-count">19 TOPICS</span></div>
          <SourceRecoveryWorkbench />
          <div className="review-cards">{[{n:"01",title:"FRAPA contract",status:"Open question" as Status,tag:"SOURCE EVIDENCE",desc:"Establish the contract only from available source evidence. Do not invent definitions to fill gaps.",sourcePath:"docs/audits/phase-2-formal-syntax.md"},{n:"02",title:"Phase 4 — syntax & ambiguity",status:"Provisional" as Status,tag:"AUDIT MATERIAL",desc:"Test unique structural interpretation, operator arity and safe handling of incomplete expressions.",sourcePath:"sources/originals/Arcane_Language_Audit_Phase_4.docx"},{n:"03",title:"Phase 5 — semantic audit",status:"Provisional" as Status,tag:"PHASE 2 PRIORITY",desc:"Compare semantic claims against Phase 2 first. Record conflicts and retain old forms unless inconsistency is demonstrated.",sourcePath:"sources/originals/Arcane_Language_Audit_Phase_5.docx"},{n:"04",title:"Phase 6G — source lexicon",status:"Provisional" as Status,tag:"DATA INTEGRITY",desc:"Audit the v5 draft vocabulary, preserve non-atomic forms, validate alias targets, and keep RE/RA collisions visible.",sourcePath:"docs/research/phase6g-v5-source-lexicon-audit-01.md"},{n:"05",title:"Phase 6G — parser fixtures",status:"Provisional" as Status,tag:"OBSERVATION ONLY",desc:"Compare recovered fixtures against the provisional parser without treating observations as canon approval or semantic validation.",sourcePath:"docs/research/phase6g-fixture-observation-harness-01.md"},{n:"06",title:"Phase 8AM — original Construction morphology",status:"Open question" as Status,tag:"SOURCE RECOVERY",desc:"The searchable archive preserves unresolved D-006/D-007 decisions and partial KAN/KEN/KAS evidence, but does not provide the missing complete v2.0 frame–vowel–coda specification. Do not infer a productive paradigm from partial sources.",sourcePath:"docs/research/phase8am-original-construction-morphology-recovery.md"}, {n:"07",title:"Phase 8AP — Phase 4 source transcription",status:"Open question" as Status,tag:"SOURCE RECOVERY",desc:"The Phase 4 DOCX is present and its text appears in the searchable archive index, but only excerpts are indexed. A structure-preserving extractor is provided to recover complete paragraphs and tables without changing the source.",sourcePath:"docs/research/phase8ap-phase4-docx-recovery-tooling.md"}, {n:"08",title:"Phase 8AQ — Phase 4 transcription concordance",status:"Open question" as Status,tag:"CONSTRUCTION EVIDENCE",desc:"The archive report verifies nine DOCX copies as byte-identical to the loose original. The checked-in text index remains excerpt-only; extracted-text completeness and TXT ancestry remain unresolved. The Construction evidence map preserves the CVC/optional-coda conflict.",sourcePath:"docs/research/phase8aq-phase4-transcription-concordance.md"}, {n:"09",title:"Phase 8AR — Construction macro evidence",status:"Open question" as Status,tag:"CONSTRUCTION EVIDENCE",desc:"Refines all six macro evidence statuses independently, records the heavy H-series syllable family and preserves the exact hand-flame token sequence with its parsing and feasibility limitations.",sourcePath:"docs/research/phase8ar-construction-macro-evidence-refinement.md"}, {n:"10",title:"Phase 8AS/8AT — Hand-flame evidence and archived parser recovery",status:"Open question" as Status,tag:"CONSTRUCTION EXAMPLE",desc:"Maps the exact 17-token hand-flame sequence into six source groups, integrating the archived Phase 5.22 bounded parse for position, axis, quantities and example-level KAN/KEN/KAS associations while preserving provisional coupling and general-grammar gaps.",sourcePath:"docs/research/phase8at-historical-construction-fixture-parser-recovery.md"},{n:"11",title:"Phase 8AU — archived fixture contract extraction",status:"Open question" as Status,tag:"CONSTRUCTION FIXTURE",desc:"Extracts the historical Phase 5.22 fixture token tables, quantity constraints and 17 reported regression outcomes into a version-bounded evidence contract; does not implement a general parser or physical feasibility.",sourcePath:"docs/research/phase8au-archived-fixture-contract-extraction.md"},{n:"12",title:"Phase 8AV — historical Construction parse-tree contract",status:"Open question" as Status,tag:"CONSTRUCTION GRAMMAR",desc:"Reconstructs the six phrase roles returned by the Phase 5.22 hand-flame fixture parser, including typed position and duration values, while retaining opaque Foot tokens and provisional coupling labels. Not a general grammar or executable spell model.",sourcePath:"docs/research/phase8av-construction-parse-tree-contract.md"},{n:"13",title:"Phase 8AW — Construction grammar evidence consolidation",status:"Open question" as Status,tag:"GRAMMAR BOUNDARIES",desc:"Unifies the recovered seven-stage order, six-phrase historical fixture tree, Foot morphology conflict, coupling uncertainty and version boundaries into one evidence profile. Classifications are scoped audits, not a general parser.",sourcePath:"docs/research/phase8aw-construction-grammar-consolidation.md"},{n:"14",title:"Phase 8AY — Phase 4 transcription inventory correction",status:"Open question" as Status,tag:"SOURCE CONCORDANCE",desc:"Corrects the transcription inventory: the archive report verifies the DOCX copies by source-byte hash, while the three indexed text records remain excerpt-only and their extracted-text equivalence is not assumed.",sourcePath:"docs/research/phase8ay-phase4-transcription-inventory-correction.md"},{n:"15",title:"Phase 8AZ — Phase 4 finalisation artefact boundary",status:"Open question" as Status,tag:"SOURCE RECOVERY",desc:"Adds the separately hashed Phase 4 finalisation PDF and its indexed generator script as related implementation artefacts. Neither is promoted to the original v2.0 Foot morphology specification.",sourcePath:"docs/research/phase8az-phase4-finalisation-artefact-boundary.md"},{n:"16",title:"Phase 8BA — branch-aware source links and Phase 4 generator boundary",status:"Provisional" as Status,tag:"WEBSITE RELIABILITY",desc:"Fixes repository-document links so Vercel previews open the source on the deployed branch, and records the limited Phase 4 generator excerpt without promoting it to morphology evidence.",sourcePath:"docs/research/phase8ba-branch-aware-source-links-and-generator-boundary.md"},{n:"17",title:"Phase 8BB — Performed reference homophone evidence",status:"Open question" as Status,tag:"CONSTRUCTION REFERENCES",desc:"Adds the Phase 5.20-recovered Performed readings for re and ra, records their competing Shared Arcana meanings and keeps them slot-sensitive, non-executable and separate from formal reference binding.",sourcePath:"docs/research/phase8bb-performed-reference-homophone-evidence.md"}, {n:"18",title:"Phase 8BC — Construction reference inventory and boundary recovery",status:"Open question" as Status,tag:"CONSTRUCTION REFERENCES",desc:"Separates formal MI/NI/RI/me evidence from the Performed fused-reference inventory, retains re/ra as partial homophones and MEL as a worked-example form, and records the unrecovered clause-boundary grammar.",sourcePath:"docs/research/phase8bc-construction-reference-inventory-and-boundary-recovery.md"}, {n:"19",title:"Phase 8BD — Source Recovery Studio and offline intake",status:"Provisional" as Status,tag:"SOURCE TOOLING",desc:"Introduces a browser-local intake MVP for text-based sources and a read-only offline CLI for DOCX, PDF, ZIP and text extraction, with hashes, provenance, safety limits and explicit review status.",sourcePath:"docs/research/phase8bd-source-recovery-studio-and-offline-intake.md"}, {n:"20",title:"Phase 8BT — Position and displacement relationships",status:"Provisional" as Status,tag:"SPATIAL VALUE MODEL",desc:"Adds proposal-only mathematical relationships for position difference and position translation, with frame, origin, unit and dimensional guards. It does not assign Arcane operators or define spoken syntax.",sourcePath:"docs/research/phase8bt-position-displacement-relations.md"}, {n:"21",title:"Phase 8BU — Phase 4 archive byte-identity correction",status:"Open question" as Status,tag:"SOURCE PROVENANCE",desc:"Corrects the Phase 4 source concordance using the archive report: nine archived DOCX names match the loose original by SHA-256 and size, while full transcription review remains incomplete.",sourcePath:"docs/research/phase8bu-phase4-archive-byte-identity-and-source-priority-correction.md"}, {n:"22",title:"Phase 8BV — Phase 4 compile-bridge boundary audit",status:"Open question" as Status,tag:"LANGUAGE ARCHITECTURE",desc:"Recovers the Phase 4 opening statement that v2.0 Construction and v3.0-L Expression are linked by a compile bridge, while separating that compiler from the current Phase 6G-to-Incantation traceability tool. Exact §3 rules remain unrecovered.",sourcePath:"docs/research/phase8bv-phase4-compile-bridge-boundary-audit.md"}, {n:"23",title:"Phase 8BW — Expression-to-Construction interface readiness",status:"Open question" as Status,tag:"COMPILER INTERFACE",desc:"Defines twelve evidence gates for the Phase 4 Expression-to-Construction compiler interface. Adds a fail-closed readiness evaluator; it never compiles or executes and remains blocked while §3 and mapping contracts are unrecovered.",sourcePath:"docs/research/phase8bw-expression-construction-interface-readiness.md"}, {n:"24",title:"Phase 8BX — Expression/Construction evidence crosswalk",status:"Open question" as Status,tag:"LANGUAGE MAPPING",desc:"Audits formal Expression operator families against the six Construction macros. The source matrices confirm that a formal mapping table and end-to-end trace are not demonstrated, so every pair remains explicitly unestablished.",sourcePath:"docs/research/phase8bx-expression-construction-evidence-crosswalk.md"}, {n:"25",title:"Phase 8BY — Construction Foot source-provenance adjudication",status:"Open question" as Status,tag:"MORPHOLOGY SOURCE CONFLICT",desc:"Identifies the CVC-required versus optional-coda disagreement as a conflict between two secondary recovery matrices. The primary Phase 4 DOCX remains uninspected, so neither summary is given precedence.",sourcePath:"docs/research/phase8by-construction-foot-source-provenance-adjudication.md"}, {n:"26",title:"Phase 8BZ — H-series coupling composition evidence",status:"Open question" as Status,tag:"COUPLING COMPOSITION",desc:"Separates the six H-series domain glosses from complete coupling instructions. Records the he ha hand-flame co-occurrence and BRAN family association without assigning participant order, direction, physical law or executable semantics.",sourcePath:"docs/research/phase8bz-h-series-coupling-composition-evidence.md"}, {n:"27",title:"Phase 8CA — H-series fixture evidence enrichment",status:"Open question" as Status,tag:"FIXTURE EVIDENCE / REGRESSION",desc:"Adds the archived Phase 5.22 HE/HA annotations as provisional fixture-only evidence and verifies whitespace normalisation without generalising the physical mapping.",sourcePath:"docs/research/phase8ca-h-series-fixture-evidence-enrichment.md"}, {n:"28",title:"Phase 8CB — Coupling participant evidence boundary",status:"Open question" as Status,tag:"PARTICIPANT / REFERENCE CONTRACT",desc:"Separates H-series domain labels, existing Construction reference bindings and the still-unrecovered coupling-participant relationship. A valid reference is not treated as proof of a coupling participant.",sourcePath:"docs/research/phase8cb-coupling-participant-evidence-boundary.md"}, {n:"29",title:"Phase 8CC — Maintenance and release evidence separation",status:"Open question" as Status,tag:"CONTROL / RELEASE INTERFACE",desc:"Separates the fixture-level KEN held-state association from KAS release association. Records surface sequence without inferring a universal lifecycle, duration rule, causal transition or safety contract.",sourcePath:"docs/research/phase8cc-maintenance-release-evidence-separation.md"}, {n:"30",title:"Phase 8CD — Construction Foot morphology evidence reviewer",status:"Open question" as Status,tag:"FOOT / MORPHOLOGY",desc:"Distinguishes source-backed CV frame forms from CVC-shaped candidates, preserves provisional parameter families and the unresolved mandatory-versus-optional coda discrepancy, and prevents shape recognition from implying a valid Foot.",sourcePath:"docs/research/phase8cd-construction-foot-morphology-evidence-reviewer.md"}, {n:"31",title:"Phase 8CE — Construction macro contract audit",status:"Open question" as Status,tag:"MACRO / FOOT INTERFACE",desc:"Separates each macro’s recovered role evidence from missing input/output signatures, Foot scope, cardinality, conditions, effects and inter-macro composition. No macro is executable.",sourcePath:"docs/research/phase8ce-construction-macro-contract-audit.md"}, {n:"32",title:"Phase 8CF — Construction macro / stage scope evidence audit",status:"Open question" as Status,tag:"MACRO / STAGE BOUNDARY",desc:"Compares the six macro records with the seven performed Construction stages and the bounded hand-flame fixture. Separates observed token position from stage assignment, macro scope and causal dependency.",sourcePath:"docs/research/phase8cf-construction-macro-stage-scope-audit.md"}].map((item) => <article className="review-card" key={item.n}><div className="review-card-top"><span className="review-number">{item.n}</span><StatusPill status={item.status}/></div><span className="detail-kicker">{item.tag}</span><h2>{item.title}</h2><p>{item.desc}</p><div className="review-card-bottom"><a href={githubBlobUrl(item.sourcePath, GITHUB_SOURCE_REF)} target="_blank" rel="noreferrer" aria-label={"Open source evidence for " + item.title}>Open source evidence <span aria-hidden="true">↗</span></a></div></article>)}</div>
          <div className="section-heading lower-heading"><div><div className="eyebrow">PHASE 6G · LIVE LOCAL OBSERVATIONS</div><h2>Recovered parser fixture review</h2></div><span className="section-caption">{phase6gFixtureAudit.fixtureCount} FIXTURES</span></div>
          <p className="page-intro">These observations are computed in this browser build against the provisional Phase 6G parser. They are not CI results, source approval, semantic validation, or canon acceptance. A context-dependent case is deliberately not counted as a direct pass.</p>
          <div className="audit-matrix">
            <article className="audit-item"><div className="audit-item-top"><code>DIRECT COMPARISON</code><span className="audit-readiness audit-limited">OBSERVATION ONLY</span></div><h3>{phase6gFixtureAudit.directMatches} matches · {phase6gFixtureAudit.directMismatches} mismatches</h3><p>{phase6gFixtureAudit.directlyComparable} fixtures have direct accept/reject expectations that can be compared safely.</p><div className="audit-next"><strong>Not directly comparable</strong><p>{phase6gFixtureAudit.nonDirectComparisons} fixtures require context, remain unresolved, or test a scope guardrail.</p></div></article>
            <article className="audit-item"><div className="audit-item-top"><code>DIAGNOSTIC FAMILY</code><span className="audit-readiness audit-limited">SEPARATE MEASURE</span></div><h3>{phase6gFixtureAudit.diagnosticFamilyMatches} matches · {phase6gFixtureAudit.diagnosticFamilyMismatches} mismatches</h3><p>Explicit historical error-family mappings only; these counts do not imply full fixture acceptance.</p><div className="audit-next"><strong>Not comparable</strong><p>{phase6gFixtureAudit.diagnosticFamiliesNotComparable} historical families have no explicit current-code mapping.</p></div></article>
            {phase6gFixtureAudit.observations.map((item) => <article className="audit-item" key={item.id}>
              <div className="audit-item-top"><code>{item.id}</code><span className={"audit-readiness " + (item.comparison === "match" ? "audit-implemented" : item.comparison === "mismatch" ? "audit-blocked" : "audit-limited")}>{item.comparison.toUpperCase()}</span></div>
              <h3>{item.input}</h3><p>Expected: <code>{item.expected}</code> · observed: <strong>{item.observed}</strong>{item.observedNode ? <> · AST root: <code>{item.observedNode}</code></> : null}{item.observedOperator ? <> · operator: <code>{item.observedOperator}</code></> : null}</p>
              {item.diagnosticCodes.length > 0 && <div className="test-case-meta"><span>Diagnostics: {item.diagnosticCodes.join(", ")}</span></div>}
              {item.observedShape || item.observedSlotNode || item.errorFamilyComparison || (item.slotProbeDiagnosticCodes && item.slotProbeDiagnosticCodes.length > 0) ? <div className="test-case-meta">{item.observedShape ? <span>AST shape: {item.observedShape}</span> : null}{item.observedSlotNode ? <span>Probed slot: {item.observedSlotNode}</span> : null}{item.slotProbeDiagnosticCodes && item.slotProbeDiagnosticCodes.length > 0 ? <span>Slot probe diagnostics: {item.slotProbeDiagnosticCodes.join(", ")}</span> : null}{item.errorFamilyComparison ? <span>Diagnostic-family comparison: {item.errorFamilyComparison}</span> : null}{item.historicalBehavior ? <span>Archived Python: {item.historicalBehavior}</span> : null}{item.historicalEvidence ? <span>Historical evidence: {item.historicalEvidence}</span> : null}</div> : null}
              <div className="audit-next"><strong>Interpretation guardrail</strong><p>{item.note}</p></div>
            </article>)}
          </div>
          <div className="section-heading lower-heading"><div><div className="eyebrow">CANON IMPLEMENTATION AUDIT</div><h2>What is enforced, blocked, or still missing</h2></div><span className="section-caption">{canonAuditItems.length} TRACKED ITEMS</span></div>
          <p className="page-intro">This is an evidence matrix, not a second automated test report. “Implemented · limited scope” describes only the behaviour explicitly listed below; it does not mean the wider canon rule is fully enforced.</p>
          <div className="audit-matrix">
            {canonAuditItems.map((item) => <article className="audit-item" key={item.id}>
              <div className="audit-item-top"><code>{item.id}</code><span className={"audit-readiness audit-" + item.readiness}>{auditReadinessLabels[item.readiness]}</span></div>
              <span className="detail-kicker">{item.domain.toUpperCase()}</span>
              <h3>{item.title}</h3>
              <p>{item.currentEvidence}</p>
              <div className="audit-next"><strong>Next evidence required</strong><p>{item.nextRequirement}</p></div>
              <div className="test-case-meta"><span>Source rules: {item.sourceRule}</span></div>
            </article>)}
          </div>
          <div className="section-heading lower-heading"><div><div className="eyebrow">REVIEW PROTOCOL</div><h2>From question to decision</h2></div></div><div className="principle-list">{[{n:"01",title:"Capture the question",detail:"State exactly what is unclear and where the uncertainty originates."},{n:"02",title:"Attach the source",detail:"Link the precise version, section, and passage; separate source text from interpretation."},{n:"03",title:"Test alternatives",detail:"Record competing readings and the evidence for or against each."},{n:"04",title:"Approve explicitly",detail:"Only an explicit decision updates canonical documentation and implementation tests."}].map((item) => <div className="principle-row" key={item.n}><div className="principle-index">{item.n}</div><div className="principle-copy"><strong>{item.title}</strong><p>{item.detail}</p></div></div>)}</div>
        </section>}
      </main>
    </div>
  );
}

export default App;
