import { useEffect, useMemo, useState } from "react";
import {
  Activity, BookOpen, Braces, CheckCircle2, ChevronDown, CircleHelp,
  Command, FileText, FlaskConical, GitBranch, Layers3, Menu,
  Search, ShieldCheck, Sparkles, TestTube2, X, Play, AlertTriangle
} from "lucide-react";
import { parseAuditExpression, type AuditParseResult } from "./engine/auditParser";
import { docs, filterDocuments, type Status } from "./documentationCatalogue";
import { workbenchTests } from "./engine/testRegistry";
import { canonAuditItems, auditReadinessLabels } from "./engine/canonAuditRegistry";
import phase6gFixtureData from "../tests/fixtures/phase6g-surface-parser-cases.json";
import { auditPhase6GFixtures, type Phase6GFixture } from "./engine/phase6gFixtureAudit";
import { evidenceChains } from "./evidenceLinks";
import { researchRecords } from "./researchRecords";

type Section = "Overview" | "Documentation" | "Playground" | "Test suite" | "Research & review";

const phase6gFixtureAudit = auditPhase6GFixtures(
  phase6gFixtureData.suiteId,
  phase6gFixtureData.cases as Phase6GFixture[]
);
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

function App() {
  const [section, setSection] = useState<Section>("Overview");
  const [query, setQuery] = useState("");
  const [docStatus, setDocStatus] = useState<Status | "All">("All");
  const [docSourceKind, setDocSourceKind] = useState("All");
  const [editor, setEditor] = useState("");
  const [analysis, setAnalysis] = useState<AuditParseResult | null>(null);
  const [mobileNav, setMobileNav] = useState(false);
  const [selectedDoc, setSelectedDoc] = useState(docs[0].title);
  const [testQuery, setTestQuery] = useState("");
  const [testGroup, setTestGroup] = useState<"All" | "Parser" | "Surface parser" | "Dimensions" | "Semantic types" | "Operator contracts" | "Lexicon" | "Fixture audit" | "Workbench integrity">("All");
  const [impactRule, setImpactRule] = useState("All");
  const [focusedEvidenceChainId, setFocusedEvidenceChainId] = useState<string | null>(null);
  const [workflowRuns, setWorkflowRuns] = useState<WorkflowRun[]>([]);
  const [workflowJobs, setWorkflowJobs] = useState<WorkflowJob[]>([]);
  const [workflowLoading, setWorkflowLoading] = useState(true);
  const [workflowError, setWorkflowError] = useState<string | null>(null);
  const [workflowUpdatedAt, setWorkflowUpdatedAt] = useState<string | null>(null);
  const [registryResults, setRegistryResults] = useState<RegistryResults | null>(null);
  const [registryResultsError, setRegistryResultsError] = useState<string | null>(null);

  const refreshWorkflow = async () => {
    setWorkflowLoading(true);
    setWorkflowError(null);
    try {
      const runsResponse = await fetch("https://api.github.com/repos/sixtoast/Anime-language-/actions/runs?branch=main&per_page=10", {
        headers: { Accept: "application/vnd.github+json" }
      });
      if (!runsResponse.ok) throw new Error(`GitHub returned HTTP ${runsResponse.status} while loading workflow runs.`);
      const runData = await runsResponse.json() as WorkflowData;
      setWorkflowRuns(runData.workflow_runs ?? []);
      try {
        const resultsResponse = await fetch("https://raw.githubusercontent.com/sixtoast/Anime-language-/ci-results/latest.json?cache=" + Date.now());
        if (resultsResponse.ok) {
          const resultsData = await resultsResponse.json() as RegistryResults;
          setRegistryResults(resultsData);
          setRegistryResultsError(null);
        } else {
          setRegistryResultsError(resultsResponse.status === 404 ? "No published per-test report yet. It will appear after the next successful report-generation step on a main-branch push." : `GitHub returned HTTP ${resultsResponse.status} while loading individual test results.`);
        }
      } catch {
        setRegistryResultsError("Could not load the published per-test report. Overall CI status is still available.");
      }
      const latest = (runData.workflow_runs ?? []).find((run) => run.name === "CI") ?? (runData.workflow_runs ?? [])[0];
      if (latest) {
        const jobsResponse = await fetch(`https://api.github.com/repos/sixtoast/Anime-language-/actions/runs/${latest.id}/jobs?per_page=100`, {
          headers: { Accept: "application/vnd.github+json" }
        });
        if (!jobsResponse.ok) throw new Error(`GitHub returned HTTP ${jobsResponse.status} while loading job details.`);
        const jobData = await jobsResponse.json() as { jobs: WorkflowJob[] };
        setWorkflowJobs(jobData.jobs ?? []);
      } else {
        setWorkflowJobs([]);
      }
      setWorkflowUpdatedAt(new Date().toISOString());
    } catch (error) {
      setWorkflowError(error instanceof Error ? error.message : "Could not load GitHub Actions results.");
    } finally {
      setWorkflowLoading(false);
    }
  };

  useEffect(() => {
    void refreshWorkflow();
  }, []);

  const latestCiRun = workflowRuns.find((run) => run.name === "CI") ?? workflowRuns[0];
  const registryReportMatchesLatestRun = Boolean(registryResults && latestCiRun && registryResults.commit === latestCiRun.head_sha && registryResults.runId === String(latestCiRun.id));
  const reportTestResults = registryReportMatchesLatestRun ? registryResults?.tests ?? [] : [];
  const latestBuildStep = workflowJobs
    .flatMap((job) => job.steps ?? [])
    .find((step) => /type-check and build/i.test(step.name));
  const latestBrowserStep = workflowJobs
    .flatMap((job) => job.steps ?? [])
    .find((step) => /run website browser acceptance/i.test(step.name));
  const browserAcceptanceState = workflowError || !latestCiRun
    ? "unavailable"
    : workflowLoading
      ? "loading"
      : !latestBrowserStep
        ? "missing"
        : latestBrowserStep.status !== "completed"
          ? "running"
          : latestBrowserStep.conclusion === "success"
            ? "passed"
            : latestBrowserStep.conclusion === "failure"
              ? "failed"
              : "inconclusive";
  const nextTask = browserAcceptanceState === "passed"
    ? {
        id: "WEB-SH-01 / WEB-SH-02",
        title: "Connect source, research and fixture evidence",
        priority: "NEXT BUILD PHASE",
        summary: "Browser acceptance passed for the latest CI run. Move forward to the shared-record foundation: connect known source, research, fixture and test references without inventing relationships.",
        reason: "This advances the next major product capability after the catalogue acceptance gate. Shared links will let a reviewer follow evidence across sections and expose unknown relationships honestly.",
        dependencies: "Stable IDs already present in the catalogue, fixture records and test registry; add only grounded relationships.",
        files: "src/documentationCatalogue.ts, src/engine/testRegistry.ts, tests/fixtures/, docs/research/, and a small shared relationship module.",
        acceptance: "At least one end-to-end source-to-research/fixture/test chain is navigable; links are evidence-backed; missing links are labelled unknown; tests cover the relationship data.",
        primaryAction: "Open research & review",
        primarySection: "Research & review" as Section
      }
    : browserAcceptanceState === "failed"
      ? {
          id: "WEB-DOC-03",
          title: "Resolve browser acceptance failures",
          priority: "BLOCKING",
          summary: "The latest CI run reports a failed browser-acceptance step. Inspect its exact failing assertion and trace before changing the implementation; keep the strict viewport and interaction checks intact.",
          reason: "The documentation catalogue must pass its real-browser acceptance checks before we treat the source-library experience as verified or move the release gate forward.",
          dependencies: "Latest CI run and its browser-acceptance logs; current catalogue implementation.",
          files: "src/App.tsx, src/documentationCatalogue.ts, src/styles.css, and tests/browser/.",
          acceptance: "The failing browser assertion is reproduced and fixed; filtering, empty-state recovery, source links and 360px layout all pass in the same recorded run.",
          primaryAction: "Inspect source library",
          primarySection: "Documentation" as Section
        }
      : {
          id: "WEB-DOC-03",
          title: browserAcceptanceState === "running" || browserAcceptanceState === "loading"
            ? "Confirm browser acceptance for the current run"
            : "Recover trustworthy browser acceptance evidence",
          priority: "VERIFICATION GATE",
          summary: browserAcceptanceState === "running"
            ? "The browser-acceptance step is still running. Its outcome is not known yet; wait for the completed step result before deciding whether to fix or close this task."
            : browserAcceptanceState === "loading"
              ? "Live workflow data is refreshing. No recommendation is treated as verified until the current run and browser step are available."
              : browserAcceptanceState === "missing"
                ? "The latest run did not expose a browser-acceptance step. Inspect the workflow configuration and run details before inferring that the browser checks passed or failed."
                : browserAcceptanceState === "inconclusive"
                  ? "The browser-acceptance step did not finish with a clear success or failure conclusion. Inspect the run details; skipped or cancelled is not a pass."
                  : "Live browser-acceptance evidence is unavailable. Refresh the workflow data or open GitHub Actions directly; do not infer a pass from deployment readiness.",
          reason: "The 360px mobile assertion previously exposed horizontal overflow. The fix must be confirmed by the actual browser run, not by a successful deployment or build alone.",
          dependencies: "A completed CI run for the current main-branch commit and the actual browser-acceptance step result.",
          files: "src/App.tsx, src/styles.css, tests/browser/, and .github/workflows/ci.yml if the step is absent.",
          acceptance: "The browser step has an explicit successful conclusion for a recorded commit, including filter/reset, empty-state recovery, all source links and the strict 360px viewport check.",
          primaryAction: "Inspect source library",
          primarySection: "Documentation" as Section
        };

  const sourceKinds = useMemo(() => Array.from(new Set(docs.map((doc) => doc.sourceKind))).sort(), []);
  const filteredDocs = useMemo(() => filterDocuments(query, docStatus, docSourceKind), [query, docStatus, docSourceKind]);
  const selectedDocument = filteredDocs.find((item) => item.title === selectedDoc) ?? filteredDocs[0] ?? docs[0];
  const relatedEvidenceChains = evidenceChains.filter((chain) => chain.nodes.some((node) => node.path === selectedDocument.sourcePath));
  const evidenceRuleIds = [...new Set(evidenceChains.flatMap((chain) => chain.ruleIds))].sort();
  const visibleEvidenceChains = focusedEvidenceChainId
    ? evidenceChains.filter((chain) => chain.id === focusedEvidenceChainId)
    : impactRule === "All" ? evidenceChains : evidenceChains.filter((chain) => chain.ruleIds.includes(impactRule));
  const visibleEvidenceNodes = visibleEvidenceChains.flatMap((chain) => chain.nodes);
  const evidenceNodeCounts = [...new Set(visibleEvidenceNodes.map((node) => node.kind))].map((kind) => ({ kind, count: visibleEvidenceNodes.filter((node) => node.kind === kind).length }));

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
          <div className="topbar-actions"><span className="version-chip"><span className="pulse-dot"/> SPEC v3.0 · SOURCE INVENTORY INITIAL</span><button className="icon-button" title="Search documentation" onClick={() => { changeSection("Documentation"); document.getElementById("global-search")?.focus(); }}><Search size={18}/></button></div>
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
              <div><span>PER-TEST REPORT</span><strong className={registryReportMatchesLatestRun ? (registryResults && registryResults.counts.failed > 0 ? "cockpit-bad" : "cockpit-good") : "cockpit-warn"}>{!registryResults ? "Unavailable" : registryReportMatchesLatestRun ? (registryResults.counts.failed > 0 ? "Failures reported" : "Run-matched report") : "Stale / different run"}</strong><small>{registryReportMatchesLatestRun && registryResults ? registryResults.counts.passed + " passed · " + registryResults.counts.failed + " failed · " + registryResults.counts.unmapped + " unmapped" : registryResults ? "Stored results withheld until the report matches the latest CI run and commit." : (registryResultsError ?? "Waiting for published results")}</small></div>
            </div>
            <p className="cockpit-note">{workflowError ? "Live workflow data could not be confirmed. Treat CI health as unavailable until refreshed." : latestCiRun?.conclusion === "failure" ? "The workflow is failing. Open the run for the exact failing step; a successful website build does not mean the entire test suite passed." : latestCiRun?.status !== "completed" ? "The latest workflow is still running or queued. Its final result is not known yet." : "Workflow state comes from GitHub Actions. Per-test results are shown separately and may refer to a different commit."}</p>
          </div>
          <section className="next-task-panel" aria-labelledby="next-task-title" data-browser-acceptance={browserAcceptanceState}>
            <div className="next-task-heading">
              <div><div className="eyebrow"><CheckCircle2 size={13}/> RECOMMENDED NEXT · {nextTask.id}</div><h2 id="next-task-title">{nextTask.title}</h2></div>
              <span className="next-task-priority">{nextTask.priority}</span>
            </div>
            <p className="next-task-summary">{nextTask.summary}</p>
            <div className="next-task-grid">
              <div><span>WHY THIS IS NEXT</span><p>{nextTask.reason}</p></div>
              <div><span>DEPENDENCIES</span><p>{nextTask.dependencies}</p></div>
              <div><span>FILES / SURFACES</span><p>{nextTask.files}</p></div>
              <div><span>ACCEPTANCE CRITERIA</span><p>{nextTask.acceptance}</p></div>
            </div>
            <div className="next-task-actions">
              <button className="secondary-button" onClick={() => changeSection(nextTask.primarySection)}>{nextTask.primaryAction} <span aria-hidden="true">→</span></button>
              <button className="secondary-button" onClick={() => changeSection("Test suite")}>Review CI evidence <span aria-hidden="true">→</span></button>
              {latestCiRun && <a className="secondary-button" href={latestCiRun.html_url} target="_blank" rel="noreferrer">Open latest CI run ↗</a>}
              <a className="secondary-button" href="https://github.com/sixtoast/Anime-language-/blob/main/docs/WEBSITE-FEATURE-REGISTER.md" target="_blank" rel="noreferrer">Open feature register <span aria-hidden="true">↗</span></a>
            </div>
            <p className="next-task-caveat">Browser acceptance status: {browserAcceptanceState}. {browserAcceptanceState === "passed" ? "The browser step succeeded for the latest run; the recommendation advances to shared evidence links." : browserAcceptanceState === "failed" ? "The browser step failed; inspect the run before changing code. No acceptance gate is marked complete." : "This card reflects the live step state and does not treat missing, stale, skipped or unfinished evidence as a pass."}</p>
          </section>
          <div className="section-heading"><div><div className="eyebrow">WORKSPACE</div><h2>Everything in one place</h2></div><span className="section-caption">SOURCE RECOVERY · PHASE 01</span></div>
          <div className="feature-grid">
            <button className="feature-card" onClick={() => changeSection("Documentation")}><div className="feature-icon icon-violet"><BookOpen size={20}/></div><div className="feature-title">Language reference <span>↗</span></div><p>Specification, grammar, operators, semantics and terminology with explicit source status.</p><div className="feature-foot"><span>Explore documentation</span><span>01</span></div></button>
            <button className="feature-card" onClick={() => changeSection("Playground")}><div className="feature-icon icon-blue"><Braces size={20}/></div><div className="feature-title">Expression playground <span>↗</span></div><p>Parse provisional Phase 2 audit expressions and inspect syntax trees or diagnostics.</p><div className="feature-foot"><span>Open playground</span><span>02</span></div></button>
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
              <a className="secondary-button" href="https://github.com/sixtoast/Anime-language-/blob/main/sources/SOURCE-INVENTORY.md" target="_blank" rel="noreferrer">Open full source inventory <span aria-hidden="true">↗</span></a>
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
          <div className="doc-layout"><div className="doc-list" aria-label="Documentation catalogue entries">{filteredDocs.map((doc) => <button key={doc.title} aria-pressed={selectedDocument.title === doc.title} className={"doc-row " + (selectedDocument.title === doc.title ? "doc-selected" : "")} onClick={() => setSelectedDoc(doc.title)}><div className="doc-icon"><FileText size={18}/></div><div className="doc-row-main"><strong>{doc.title}</strong><span>{doc.category}</span></div><StatusPill status={doc.status}/></button>)}{filteredDocs.length === 0 && <div className="empty-state" role="status">No sources match these filters. Try another status, source type, or search term.</div>}</div><div className="doc-detail">{(() => { const doc = selectedDocument; return <><div className="detail-top"><span className="detail-kicker">REFERENCE ENTRY</span><StatusPill status={doc.status}/></div><h2>{doc.title}</h2><p>{doc.description}</p><div className="detail-divider"/><div className="detail-meta"><span>Category</span><strong>{doc.category}</strong></div><div className="detail-meta"><span>Source citation</span><strong>{doc.sourcePath ? "Repository document" : "Not yet attached"}</strong></div><div className="detail-meta"><span>Source type</span><strong>{doc.sourceKind ?? "Not classified"}</strong></div><div className="detail-meta"><span>Provenance note</span><strong>{doc.sourceNote ?? "Source type needs review."}</strong></div><div className="detail-meta"><span>Implementation</span><strong>Not yet verified</strong></div>{doc.sourcePath && <a className="secondary-button source-link" href={"https://github.com/sixtoast/Anime-language-/blob/main/" + doc.sourcePath} target="_blank" rel="noreferrer">Open source document: {doc.title} <span aria-hidden="true">↗</span></a>}{relatedEvidenceChains.length > 0 && <div className="related-evidence-panel"><span className="detail-kicker">LINKED EVIDENCE</span><p>{relatedEvidenceChains.length} curated evidence {relatedEvidenceChains.length === 1 ? "chain" : "chains"} reference this exact source path.</p>{relatedEvidenceChains.map((chain) => <button className="secondary-button related-evidence-link" key={chain.id} onClick={() => { setImpactRule("All"); setFocusedEvidenceChainId(chain.id); changeSection("Research & review"); }}>View {chain.title} <span aria-hidden="true">→</span></button>)}</div>}<div className="detail-callout"><CircleHelp size={17}/><p>Source status and implementation status are separate. Provisional audit notation is not silently promoted to canonical spoken grammar, and no test is labelled passed without execution evidence.</p></div><button className="secondary-button" onClick={() => changeSection("Research & review")}>Review source status <span>→</span></button></>; })()}</div></div>
        </section>}

        {section === "Playground" && <section className="page-content">
          <div className="eyebrow"><span className="eyebrow-line"/> EXPRESSION WORKSPACE</div><h1 className="page-title">Playground<span>.</span></h1><p className="page-intro">Parse the provisional Phase 2 audit notation. This does not parse spoken Arcane, validate physical feasibility, or execute a spell.</p>
          <div className="engine-banner"><Activity size={18}/><div><strong>Phase 2 audit parser connected</strong><p>Only explicit audit notation is supported. Operator arities are provisional; dimensional primitives exist separately but are not wired into this parser.</p></div><span className="engine-status">SYNTAX ONLY</span></div>
          <div className="editor-card"><div className="editor-toolbar"><div><span className="editor-dot"/><span className="editor-file">untitled.phase2</span><span className="editor-language">PROVISIONAL AUDIT NOTATION</span></div><button className="secondary-button" onClick={() => { setEditor(""); setAnalysis(null); }}>Clear editor</button></div><div className="editor-body"><div className="line-number">1<br/>2<br/>3<br/>4<br/>5<br/>6<br/>7<br/>8</div><textarea spellCheck={false} value={editor} onChange={(e) => { setEditor(e.target.value); setAnalysis(null); }} placeholder={"Try: FRAPA⟨KI, TO⟩\nNested: FRAPA⟨KI, FRAPA⟨TO, MU⟩⟩"} aria-label="Phase 2 audit expression editor"/></div><div className="editor-footer"><span>{editor.length} characters</span><span>Audit syntax only · no semantic execution</span></div></div>
          <div className="playground-actions"><button className="secondary-button run-button" onClick={() => setAnalysis(parseAuditExpression(editor))}><Play size={14}/> Parse audit notation</button><span>Supported arities: FRAPA, FRATA, FRAKA, FRALA, FRASHA, DRAN, DREM, DRIM, DRAL</span></div>
          <div className="result-panel"><div className="result-heading"><Command size={17}/><strong>Analysis output</strong><span>{analysis ? (analysis.ok ? "PARSE OK" : "DIAGNOSTICS") : "WAITING"}</span></div>{!analysis ? <div className="result-empty"><Braces size={27}/><strong>No analysis has been run</strong><p>Enter a Phase 2 audit expression and select Parse audit notation to inspect its syntax tree or diagnostics.</p></div> : <div className="analysis-output">{analysis.ok && analysis.ast ? <><div className="analysis-status success"><CheckCircle2 size={16}/> Unique structural parse produced</div><pre>{JSON.stringify(analysis.ast, null, 2)}</pre></> : <><div className="analysis-status failure"><AlertTriangle size={16}/> Expression rejected by the provisional parser</div><ul>{analysis.diagnostics.map((d, i) => <li key={d.code + d.offset + i}><code>{d.code}</code> — {d.message} <span>(offset {d.offset})</span></li>)}</ul></>}<p className="analysis-caveat">A successful parse proves only that this expression fits the implemented audit notation and registered arity. It does not prove semantic correctness, dimensional compatibility, mana feasibility, or that the form is canonical Arcane.</p></div>}</div>
          <div className="next-step"><Sparkles size={17}/><p><strong>Scope guard</strong><br/>This parser implements a small provisional audit grammar only. The canonical surface grammar, dimensional type system and physical spell evaluator remain separate future tasks.</p></div>
        </section>}

        {section === "Test suite" && <section className="page-content">
          <div className="eyebrow"><span className="eyebrow-line"/> QUALITY & REGRESSION</div><h1 className="page-title">Test suite<span>.</span></h1>
          <p className="page-intro">A traceable explorer for the authored parser and dimensional test cases, paired with live GitHub Actions run and job-step results for the repository. CI status is fetched from GitHub; this page does not execute tests in the browser.</p>
          <div className="test-summary">
            <div><span>AUTHORED CASES</span><strong>{workbenchTests.length}</strong><small>15 audit-parser · 19 surface-parser · 15 dimensional · 8 semantic · 8 operator-contract</small></div>
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
                {(["All", "Parser", "Surface parser", "Dimensions", "Semantic types", "Operator contracts", "Lexicon", "Fixture audit", "Workbench integrity"] as const).map((group) => <button key={group} className={testGroup === group ? "test-filter active" : "test-filter"} onClick={() => setTestGroup(group)}>{group}</button>)}
              </div>
            </div>
            <div className="test-explorer-meta"><span>{workbenchTests.filter((test) => (testGroup === "All" || test.group === testGroup) && (test.id + " " + test.title + " " + test.description + " " + test.sourceRule).toLowerCase().includes(testQuery.toLowerCase())).length} cases shown</span><span><span className="status-dot status-dot-pending"/> {registryReportMatchesLatestRun && registryResults ? `Current run ${registryResults.runId} · ${registryResults.counts.passed} passed · ${registryResults.counts.failed} failed · ${registryResults.counts.skipped} skipped` : registryResults ? `Stored report ${registryResults.commit?.slice(0, 7) ?? "unknown"} is stale; results withheld` : "Waiting for published per-test results"}</span></div>
            {registryResultsError && <div className="ci-empty">{registryResultsError}</div>}
            {registryResults && <div className="registry-results-meta" data-report-freshness={registryReportMatchesLatestRun ? "current" : "stale"}>{registryReportMatchesLatestRun ? "Run-matched report" : "STALE REPORT — per-test statuses are withheld"} · report commit <code>{registryResults.commit?.slice(0, 7) ?? "unknown"}</code> · generated {prettyDate(registryResults.generatedAt)} · <a href={`https://github.com/sixtoast/Anime-language-/actions/runs/${registryResults.runId}`} target="_blank" rel="noreferrer">Open report CI run ↗</a>{latestCiRun && <> · latest CI run <a href={latestCiRun.html_url} target="_blank" rel="noreferrer">#{latestCiRun.run_number} / <code>{latestCiRun.head_sha.slice(0, 7)}</code></a></>}</div>}
            <div className="test-case-list">
              {workbenchTests.filter((test) => (testGroup === "All" || test.group === testGroup) && (test.id + " " + test.title + " " + test.description + " " + test.sourceRule).toLowerCase().includes(testQuery.toLowerCase())).map((test) => <article className="test-case" key={test.id}>
                <div className="test-case-main"><div className="test-case-title"><code>{test.id}</code><strong>{test.title}</strong></div><p>{test.description}</p><div className="test-case-meta"><span>Rules: {test.sourceRule}</span><a href={"https://github.com/sixtoast/Anime-language-/blob/main/" + test.file} target="_blank" rel="noreferrer">Open test source ↗</a></div></div>
                <div className="test-case-status"><span className={"test-status-chip " + ((reportTestResults.find((result) => result.id === test.id)?.status === "passed") ? "test-status-passed" : (reportTestResults.find((result) => result.id === test.id)?.status === "failed") ? "test-status-failed" : (reportTestResults.find((result) => result.id === test.id)?.status === "pending" || reportTestResults.find((result) => result.id === test.id)?.status === "todo") ? "test-status-skipped" : "")}>{reportTestResults.find((result) => result.id === test.id) ? reportTestResults.find((result) => result.id === test.id)?.status : registryResults && !registryReportMatchesLatestRun ? "STALE REPORT" : "NOT VERIFIED"}</span><small>{test.group}</small>{reportTestResults.find((result) => result.id === test.id)?.durationMs != null && <small>{reportTestResults.find((result) => result.id === test.id)?.durationMs} ms</small>}</div>
              </article>)}
              {workbenchTests.filter((test) => (testGroup === "All" || test.group === testGroup) && (test.id + " " + test.title + " " + test.description + " " + test.sourceRule).toLowerCase().includes(testQuery.toLowerCase())).length === 0 && <div className="empty-state">No test cases match those filters.</div>}
            </div>
            {registryReportMatchesLatestRun && reportTestResults.some((result) => result.id === "UNMAPPED") && <div className="unmapped-results" data-testid="unmapped-results">
              <div className="unmapped-results-heading"><div><span className="detail-kicker">TRACEABILITY GAP</span><h2>Unmapped test results</h2><p>These results ran in the current CI report but do not yet have stable registry IDs. They are shown here rather than discarded or mistaken for verified registry cases.</p></div><span className="unmapped-count">{reportTestResults.filter((result) => result.id === "UNMAPPED").length} unmapped</span></div>
              <div className="unmapped-result-list">
                {reportTestResults.filter((result) => result.id === "UNMAPPED" && result.title.toLowerCase().includes(testQuery.toLowerCase())).map((result, index) => <article className="test-case unmapped-test-case" key={result.file + result.title + index}>
                  <div className="test-case-main"><div className="test-case-title"><code>UNMAPPED</code><strong>{result.title}</strong></div><div className="test-case-meta"><span>Source file: {result.file}</span><a href={"https://github.com/sixtoast/Anime-language-/blob/main/" + result.file} target="_blank" rel="noreferrer">Open test source ↗</a></div></div>
                  <div className="test-case-status"><span className={"test-status-chip " + (result.status === "passed" ? "test-status-passed" : result.status === "failed" ? "test-status-failed" : result.status === "pending" || result.status === "todo" ? "test-status-skipped" : "")}>{result.status}</span>{result.durationMs != null && <small>{result.durationMs} ms</small>}</div>
                </article>)}
                {reportTestResults.filter((result) => result.id === "UNMAPPED" && result.title.toLowerCase().includes(testQuery.toLowerCase())).length === 0 && <div className="empty-state">No unmapped results match this search.</div>}
              </div>
            </div>}
          </div>
          <div className="notice"><div className="notice-icon"><ShieldCheck size={18}/></div><div><strong>What this status means</strong><p>A case shows Passed, Failed or Skipped only when its stable ID appears in the published CI report for the displayed commit. Missing IDs remain Not verified, not a pass or a failure. Dimensional tests validate the current implementation convention only; they do not finalise Arcane unit semantics or operator typing.</p></div></div>
          <div className="next-step"><Sparkles size={17}/><p><strong>Result granularity</strong><br/>The live panel reports actual workflow outcomes, and each registry row is matched by its stable test ID to the published structured report. The report commit is shown explicitly; a missing or stale result is never silently treated as a pass.</p></div>
        </section>}

        {section === "Research & review" && <section className="page-content">
          <div className="eyebrow"><span className="eyebrow-line"/> EVIDENCE, QUESTIONS, DECISIONS</div><h1 className="page-title">Research & review<span>.</span></h1><p className="page-intro">Keep unresolved questions visible. Findings should be traceable to source material and should not become canonical by implication.</p>
          <div className="review-banner"><FlaskConical size={20}/><div><strong>Active audit context</strong><p>Phase 2 is the priority source for the semantic audit. Preserve older forms as aliases unless an inconsistency is demonstrated.</p></div><span className="review-count">5 TOPICS</span></div>
          <div className="review-cards">{[{n:"01",title:"FRAPA contract",status:"Open question" as Status,tag:"SOURCE EVIDENCE",desc:"Establish the contract only from available source evidence. Do not invent definitions to fill gaps.",sourcePath:"docs/audits/phase-2-formal-syntax.md"},{n:"02",title:"Phase 4 — syntax & ambiguity",status:"Provisional" as Status,tag:"AUDIT MATERIAL",desc:"Test unique structural interpretation, operator arity and safe handling of incomplete expressions.",sourcePath:"sources/originals/Arcane_Language_Audit_Phase_4.docx"},{n:"03",title:"Phase 5 — semantic audit",status:"Provisional" as Status,tag:"PHASE 2 PRIORITY",desc:"Compare semantic claims against Phase 2 first. Record conflicts and retain old forms unless inconsistency is demonstrated.",sourcePath:"sources/originals/Arcane_Language_Audit_Phase_5.docx"},{n:"04",title:"Phase 6G — source lexicon",status:"Provisional" as Status,tag:"DATA INTEGRITY",desc:"Audit the v5 draft vocabulary, preserve non-atomic forms, validate alias targets, and keep RE/RA collisions visible.",sourcePath:"docs/research/phase6g-v5-source-lexicon-audit-01.md"},{n:"05",title:"Phase 6G — parser fixtures",status:"Provisional" as Status,tag:"OBSERVATION ONLY",desc:"Compare recovered fixtures against the provisional parser without treating observations as canon approval or semantic validation.",sourcePath:"docs/research/phase6g-fixture-observation-harness-01.md"}].map((item) => <article className="review-card" key={item.n}><div className="review-card-top"><span className="review-number">{item.n}</span><StatusPill status={item.status}/></div><span className="detail-kicker">{item.tag}</span><h2>{item.title}</h2><p>{item.desc}</p><div className="review-card-bottom"><a href={"https://github.com/sixtoast/Anime-language-/blob/main/" + item.sourcePath} target="_blank" rel="noreferrer" aria-label={"Open source evidence for " + item.title}>Open source evidence <span aria-hidden="true">↗</span></a></div></article>)}</div>
          <div className="section-heading lower-heading"><div><div className="eyebrow">RESEARCH REGISTER · OPEN RECORDS</div><h2>Research findings and unresolved decisions</h2></div><span className="section-caption">{researchRecords.length} RECORDS</span></div>
          <p className="page-intro">These records capture source-backed discrepancies and implementation gaps. An open record is not an approved decision. Each entry names its source, next evidence action, related fixture IDs where applicable, and a caveat that prevents a research observation from becoming a language rule by implication.</p>
          <div className="research-record-grid">{researchRecords.map((record) => <article className="research-record-card" key={record.id}>
            <div className="research-record-top"><code>{record.id}</code><span className="research-record-status">{record.status}</span></div>
            <h3>{record.title}</h3><p>{record.summary}</p>
            {record.relatedFixtureIds.length > 0 && <div className="evidence-record-ids"><span>Related fixture IDs</span>{record.relatedFixtureIds.map((fixtureId) => <code key={fixtureId}>{fixtureId}</code>)}</div>}
            {record.id === "RES-P6G-RE-RA-001" && <div className="research-fixture-comparisons"><strong>Current fixture observations</strong><p>Computed from the current TypeScript parser when this page loads; historical behaviour below is source-inspected, not freshly executed.</p>{record.relatedFixtureIds.map((fixtureId) => { const fixture = phase6gFixtureData.cases.find((item) => item.id === fixtureId); const observation = phase6gFixtureAudit.observations.find((item) => item.id === fixtureId); if (!fixture || !observation) return null; return <div className="research-fixture-row" key={fixtureId}><div className="research-fixture-heading"><code>{fixtureId}</code><span>{observation.comparison}</span></div><code className="research-fixture-input">{fixture.input}</code><div className="research-fixture-values"><span>Prose/fixture expectation<strong>{fixture.expected}</strong></span><span>Current TypeScript parser<strong>{observation.observed}</strong></span><span>Archived Python source<strong>{observation.historicalBehavior ?? "not recovered"}</strong></span></div><p>{observation.historicalEvidence ?? "No source-inspected historical behaviour recorded."}</p><small>{observation.note}</small></div>; })}</div>}
            <div className="research-record-source"><span className="detail-kicker">SOURCE RECORD</span><a href={"https://github.com/sixtoast/Anime-language-/blob/main/" + record.sourcePath} target="_blank" rel="noreferrer">{record.sourceLabel} <span aria-hidden="true">↗</span></a><code>{record.sourcePath}</code></div>
            <div className="audit-next"><strong>Next evidence action</strong><p>{record.nextAction}</p></div>
            <div className="research-record-caveat"><strong>Interpretation guardrail</strong><p>{record.caveat}</p></div>
            {record.relatedChainId && <button className="secondary-button related-evidence-link" onClick={() => { setImpactRule("All"); setFocusedEvidenceChainId(record.relatedChainId); changeSection("Research & review"); document.getElementById("shared-evidence-graph")?.scrollIntoView({ behavior: "smooth", block: "start" }); }}>Focus linked evidence chain <span aria-hidden="true">→</span></button>}
          </article>)}</div>
          <div className="section-heading lower-heading" id="shared-evidence-graph"><div><div className="eyebrow">SHARED EVIDENCE GRAPH · INITIAL COVERAGE</div><h2>Follow a claim across its records</h2></div><span className="section-caption">{evidenceChains.length} CHAINS</span></div>
          <p className="page-intro">These curated chains connect known source material, rule IDs, implementation notes, fixtures and tests. They are an initial, explicit map—not an inferred or complete dependency graph. A link records a documented relationship; it does not prove implementation completeness or test success.</p>
          <div className="evidence-impact-controls">{focusedEvidenceChainId && <div className="evidence-focused-banner"><strong>Source-linked view</strong><span>Opened from a linked source or research record.</span><button className="secondary-button" onClick={() => setFocusedEvidenceChainId(null)}>Show all evidence chains</button></div>}<label htmlFor="evidence-rule-filter">Inspect impact for a rule<select id="evidence-rule-filter" aria-label="Filter evidence by rule ID" value={impactRule} onChange={(event) => { setImpactRule(event.target.value); setFocusedEvidenceChainId(null); }}><option value="All">All tracked rule IDs</option>{evidenceRuleIds.map((ruleId) => <option value={ruleId} key={ruleId}>{ruleId}</option>)}</select></label><div className="evidence-impact-summary" role="status"><strong>{visibleEvidenceChains.length} related chains</strong><span>{visibleEvidenceNodes.length} linked record references</span><span>{evidenceNodeCounts.map((item) => `${item.count} ${item.kind.toLowerCase()}`).join(" · ") || "No mapped records"}</span></div>{impactRule !== "All" && <button className="secondary-button" onClick={() => setImpactRule("All")}>Clear rule filter</button>}</div>
          <div className="audit-matrix evidence-chain-grid">
            {visibleEvidenceChains.map((chain) => <article className="audit-item evidence-chain" key={chain.id}>
              <div className="audit-item-top"><code>{chain.id}</code><span className={"audit-readiness " + (chain.status === "limited implementation" ? "audit-limited" : "audit-blocked")}>{chain.status.toUpperCase()}</span></div>
              <h3>{chain.title}</h3>
              <p>{chain.summary}</p>
              {chain.ruleIds.length > 0 && <div className="test-case-meta"><span>Rule IDs: {chain.ruleIds.join(", ")}</span></div>}
              <ol className="evidence-node-list">
                {chain.nodes.map((node, index) => <li key={node.path}>
                  <div className="evidence-node-heading"><span className="evidence-node-index">{index + 1}</span><div><strong>{node.label}</strong><span className="detail-kicker">{node.kind}</span></div></div>
                  <p>{node.relationship}</p>
                  {node.recordIds && node.recordIds.length > 0 && <div className="evidence-record-ids" aria-label={"Stable record IDs for " + node.label}><span>Record IDs</span>{node.recordIds.map((recordId) => <code key={recordId}>{recordId}</code>)}</div>}
                  <a href={"https://github.com/sixtoast/Anime-language-/blob/main/" + node.path} target="_blank" rel="noreferrer" aria-label={"Open " + node.label + " at " + node.path}><code>{node.path}</code> <span aria-hidden="true">↗</span></a>
                </li>)}
              </ol>
              <div className="audit-next"><strong>Scope and evidence caveat</strong><p>{chain.caveat}</p></div>
            </article>)}
          </div>
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
