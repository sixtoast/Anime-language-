import { useEffect, useMemo, useRef, useState } from "react";
import {
  Activity, BookOpen, Braces, CheckCircle2, ChevronDown, CircleHelp,
  Command, FileText, FlaskConical, GitBranch, Layers3, Menu,
  Search, ShieldCheck, Sparkles, TestTube2, X, Play, AlertTriangle
} from "lucide-react";
import { parseSurfaceExpression, type SurfaceParseResult } from "./engine/surfaceParser";
import { bundledLexiconLoad, BUNDLED_LEXICON_SOURCE } from "./engine/bundledLexicon";
import { inspectLexiconForm } from "./engine/lexiconRegistry";
import { docs, filterDocuments, type Status } from "./documentationCatalogue";
import { workbenchTests } from "./engine/testRegistry";
import { canonAuditItems, auditReadinessLabels } from "./engine/canonAuditRegistry";
import phase6gFixtureData from "../tests/fixtures/phase6g-surface-parser-cases.json";
import { auditPhase6GFixtures, type Phase6GFixture } from "./engine/phase6gFixtureAudit";
import { resourceAccountingFixtures } from "./engine/resourceAccountingFixtures";
import { authorityDecisionFixtures } from "./engine/authorityDecisionFixtures";

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

function App() {
  const [section, setSection] = useState<Section>("Overview");
  const [query, setQuery] = useState("");
  const [docStatus, setDocStatus] = useState<Status | "All">("All");
  const [docSourceKind, setDocSourceKind] = useState("All");
  const [editor, setEditor] = useState("");
  const [analysis, setAnalysis] = useState<SurfaceParseResult | null>(null);
  const [lexiconQuery, setLexiconQuery] = useState("pa");
  const [selectedFixtureId, setSelectedFixtureId] = useState("P6G-FX-001");
  const [selectedResourceFixtureId, setSelectedResourceFixtureId] = useState("RES19-01");
  const [selectedAuthorityFixtureId, setSelectedAuthorityFixtureId] = useState("AUTH20-01");
  const [mobileNav, setMobileNav] = useState(false);
  const [selectedDoc, setSelectedDoc] = useState(docs[0].title);
  const [testQuery, setTestQuery] = useState("");
  const [testGroup, setTestGroup] = useState<"All" | "Parser" | "Dimensions" | "Semantic types" | "Operator contracts" | "Source lexicon" | "Fixture audit" | "Surface parser">("All");
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
          <div className="topbar-actions"><span className="version-chip"><span className="pulse-dot"/> INCANTATIONS v1.8 · WORKBENCH</span><button className="icon-button" title="Search documentation" onClick={() => { changeSection("Documentation"); document.getElementById("global-search")?.focus(); }}><Search size={18}/></button></div>
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
              <div><div className="eyebrow"><CheckCircle2 size={13}/> RECOMMENDED NEXT · WEB-INC-RES-01</div><h2 id="next-task-title">Expose incantation resource-accounting fixtures</h2></div>
              <span className="next-task-priority">HIGH PRIORITY</span>
            </div>
            <p className="next-task-summary">The source registry now maps all 105 current test results to stable IDs, with zero unmapped results in CI #528. Arcane Incantations v1.9 now defines 60 resource-accounting specification fixtures. The next step is to expose them as browsable design expectations without pretending that a resource evaluator or spell runtime exists.</p>
            <div className="next-task-grid">
              <div><span>WHY THIS IS NEXT</span><p>The v1.9 resource model distinguishes sources, transfers, transformations, reservations, consumption, budgets, conservation boundaries and reconciliation. The website must preserve the distinction between normative specification fixtures and executed parser tests, and must not imply that resource accounting proves physical feasibility.</p></div>
              <div><span>DEPENDENCIES</span><p>Locked v1.9 specification and source-backed fixture table. No new Arcane spoken tokens, parser signatures or physical laws are required.</p></div>
              <div><span>FILES / SURFACES</span><p><code>docs/canon/arcane-incantations-v1.9-resource-accounting-and-conservation-contracts.md</code>, <code>src/engine/resourceAccountingFixtures.ts</code>, Playground and acceptance tests.</p></div>
              <div><span>ACCEPTANCE CRITERIA</span><p>All 60 RES19 fixtures are browsable from the canonical source table; each shows its stable ID, case and expected design outcome; the interface labels them as specification fixtures, not executed tests; selecting one never claims to run a spell; the source link and unresolved/runtime caveat remain visible.</p></div>
            </div>
            <div className="next-task-actions">
              <button className="secondary-button" onClick={() => changeSection("Test suite")}>Open Playground fixtures <span aria-hidden="true">→</span></button>
              <button className="secondary-button" onClick={() => changeSection("Playground")}>Open resource fixtures <span aria-hidden="true">→</span></button>
              <a className="secondary-button" href="https://github.com/sixtoast/Anime-language-/blob/main/docs/WEBSITE-FEATURE-REGISTER.md" target="_blank" rel="noreferrer">Open feature register <span aria-hidden="true">↗</span></a>
            </div>
            <p className="next-task-caveat">Status: queued next task. CI #528 reports 105/105 stable test IDs; the new resource fixture browser must keep design expectations distinct from executed behaviour and physical feasibility.</p>
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
          <div className="doc-layout"><div className="doc-list" aria-label="Documentation catalogue entries">{filteredDocs.map((doc) => <button key={doc.title} aria-pressed={selectedDocument.title === doc.title} className={"doc-row " + (selectedDocument.title === doc.title ? "doc-selected" : "")} onClick={() => setSelectedDoc(doc.title)}><div className="doc-icon"><FileText size={18}/></div><div className="doc-row-main"><strong>{doc.title}</strong><span>{doc.category}</span></div><StatusPill status={doc.status}/></button>)}{filteredDocs.length === 0 && <div className="empty-state" role="status">No sources match these filters. Try another status, source type, or search term.</div>}</div><div className="doc-detail">{(() => { const doc = selectedDocument; return <><div className="detail-top"><span className="detail-kicker">REFERENCE ENTRY</span><StatusPill status={doc.status}/></div><h2>{doc.title}</h2><p>{doc.description}</p><div className="detail-divider"/><div className="detail-meta"><span>Category</span><strong>{doc.category}</strong></div><div className="detail-meta"><span>Source citation</span><strong>{doc.sourcePath ? "Repository document" : "Not yet attached"}</strong></div><div className="detail-meta"><span>Source type</span><strong>{doc.sourceKind ?? "Not classified"}</strong></div><div className="detail-meta"><span>Provenance note</span><strong>{doc.sourceNote ?? "Source type needs review."}</strong></div><div className="detail-meta"><span>Implementation</span><strong>Not yet verified</strong></div>{doc.sourcePath && <a className="secondary-button source-link" href={"https://github.com/sixtoast/Anime-language-/blob/main/" + doc.sourcePath} target="_blank" rel="noreferrer">Open source document: {doc.title} <span aria-hidden="true">↗</span></a>}<div className="detail-callout"><CircleHelp size={17}/><p>Source status and implementation status are separate. Provisional audit notation is not silently promoted to canonical spoken grammar, and no test is labelled passed without execution evidence.</p></div><button className="secondary-button" onClick={() => changeSection("Research & review")}>Review source status <span>→</span></button></>; })()}</div></div>
        </section>}

        {section === "Playground" && <section className="page-content">
          <div className="eyebrow"><span className="eyebrow-line"/> EXPRESSION WORKSPACE</div><h1 className="page-title">Playground<span>.</span></h1><p className="page-intro">Parse the implemented provisional Phase 6G surface-like notation. This is a narrow parser subset, not a complete Arcane grammar, spoken-language interpreter, semantic validator, or spell executor.</p>
          <div className="engine-banner"><Activity size={18}/><div><strong>Phase 6G provisional surface parser connected</strong><p>Checks token structure, registered operator arity, numeral closure, explicit control blocks, and selected ambiguity cases. Source atoms use the pinned {BUNDLED_LEXICON_SOURCE.version} draft lexicon ({bundledLexiconLoad.rowCount} rows; {bundledLexiconLoad.aliasRowCount} alias records). Legacy alias rewriting is off by default, lexical collisions fail closed, and loading this source does not promote entries to canon.</p></div><span className="engine-status">SYNTAX ONLY</span></div>
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
            <div className="fixture-browser-actions"><a className="secondary-button" href="https://github.com/sixtoast/Anime-language-/blob/main/docs/canon/arcane-incantations-v1.9-resource-accounting-and-conservation-contracts.md" target="_blank" rel="noreferrer">Open full v1.9 specification ↗</a><span>Selection only displays the source expectation; it does not run a spell.</span></div>
            <p className="fixture-browser-caveat">Resource budgets do not prove a source exists. Reservation does not mean consumption. Dimensional arithmetic does not prove conservation. No universal mana-to-energy conversion or physical resource evaluator is implemented by this browser.</p>
          </section>
          <section className="fixture-browser authority-fixture-browser" aria-labelledby="authority-fixture-browser-title">
            <div className="fixture-browser-head"><div><span className="detail-kicker">SPECIFICATION FIXTURES · NOT EXECUTABLE TESTS</span><h2 id="authority-fixture-browser-title">Incantation authority-decision fixtures</h2></div><span>{authorityDecisionFixtures.length} design cases</span></div>
            <p className="fixture-browser-intro">Browse the 60 expected outcomes defined in Arcane Incantations v2.0. These cases are parsed from the locked specification. They are not executed permission decisions and do not establish legal compliance, identity, real-world authority, consent, feasibility, or spell execution.</p>
            <label className="fixture-select-label">Choose an authority specification fixture<select aria-label="Choose authority-decision specification fixture" value={selectedAuthorityFixtureId} onChange={(event) => setSelectedAuthorityFixtureId(event.target.value)}>{authorityDecisionFixtures.map((fixture) => <option key={fixture.id} value={fixture.id}>{fixture.id} — {fixture.caseDescription}</option>)}</select></label>
            {selectedAuthorityFixture && <div className="fixture-browser-detail">
              <div className="fixture-browser-meta"><div><span>Specification fixture ID</span><code>{selectedAuthorityFixture.id}</code></div><div><span>Fixture category</span><strong>Authority / authorisation decision</strong></div><div className="fixture-browser-meta-wide"><span>Case</span><strong>{selectedAuthorityFixture.caseDescription}</strong></div><div className="fixture-browser-meta-wide"><span>Expected design outcome</span><strong>{selectedAuthorityFixture.expectedOutcome}</strong></div><div className="fixture-browser-meta-wide"><span>Evidence class</span><strong>Normative specification fixture — not an executed authority check</strong></div></div>
            </div>}
            <div className="fixture-browser-actions"><a className="secondary-button" href="https://github.com/sixtoast/Anime-language-/blob/main/docs/canon/arcane-incantations-v2.0-authority-and-authorization-decision-contracts.md" target="_blank" rel="noreferrer">Open full v2.0 specification ↗</a><span>Selection only displays the source expectation; no authorisation service is called.</span></div>
            <p className="fixture-browser-caveat">Only an explicitly permitted, current, trusted, in-scope decision can pass the authorisation gate when every required check succeeds. All non-permit, uncertain, unavailable, expired, revoked, malformed, or scope-mismatched outcomes block. Authority does not replace consent, feasibility, resource readiness, validation, or execution; passing this gate does not mean a spell ran.</p>
          </section>
          <section className="lexicon-inspector" aria-labelledby="lexicon-inspector-title">
            <div className="lexicon-inspector-head">
              <div><span className="detail-kicker">SOURCE LOOKUP</span><h2 id="lexicon-inspector-title">Lexicon inspector</h2><p>Exact-form lookup against the pinned {BUNDLED_LEXICON_SOURCE.version} source snapshot. This view reports source records; it does not decide canon or change parser alias settings.</p></div>
              <a href="https://github.com/sixtoast/Anime-language-/blob/main/sources/originals/Arcane_Lexicon_v5_draft.csv" target="_blank" rel="noreferrer">Open lexicon CSV ↗</a>
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
          <div className="next-step"><Sparkles size={17}/><p><strong>Scope guard</strong><br/>This parser is an explicitly bounded Phase 6G prototype. Source-aware lexical integration, semantic and dimensional validation, complete canonical grammar, physical feasibility and spell execution remain separate tasks.</p></div>
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
                {(["All", "Parser", "Surface parser", "Dimensions", "Semantic types", "Operator contracts", "Source lexicon", "Fixture audit"] as const).map((group) => <button key={group} className={testGroup === group ? "test-filter active" : "test-filter"} onClick={() => setTestGroup(group)}>{group}</button>)}
              </div>
            </div>
            <div className="test-explorer-meta"><span>{workbenchTests.filter((test) => (testGroup === "All" || test.group === testGroup) && (test.id + " " + test.title + " " + test.description + " " + test.sourceRule).toLowerCase().includes(testQuery.toLowerCase())).length} cases shown</span><span><span className="status-dot status-dot-pending"/> {registryResults ? `Report for ${registryResults.commit?.slice(0, 7) ?? "unknown commit"} · ${registryResults.counts.passed} passed · ${registryResults.counts.failed} failed · ${registryResults.counts.skipped} skipped` : "Waiting for published per-test results"}</span></div>
            {registryResultsError && <div className="ci-empty">{registryResultsError}</div>}
            {registryResults && <div className="registry-results-meta">Test report commit <code>{registryResults.commit?.slice(0, 7) ?? "unknown"}</code> · generated {prettyDate(registryResults.generatedAt)} · <a href={`https://github.com/sixtoast/Anime-language-/actions/runs/${registryResults.runId}`} target="_blank" rel="noreferrer">Open matching CI run ↗</a></div>}
            <div className="test-case-list">
              {workbenchTests.filter((test) => (testGroup === "All" || test.group === testGroup) && (test.id + " " + test.title + " " + test.description + " " + test.sourceRule).toLowerCase().includes(testQuery.toLowerCase())).map((test) => <article className="test-case" key={test.id}>
                <div className="test-case-main"><div className="test-case-title"><code>{test.id}</code><strong>{test.title}</strong></div><p>{test.description}</p><div className="test-case-meta"><span>Rules: {test.sourceRule}</span><a href={"https://github.com/sixtoast/Anime-language-/blob/main/" + test.file} target="_blank" rel="noreferrer">Open test source ↗</a></div></div>
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
          <div className="review-banner"><FlaskConical size={20}/><div><strong>Active audit context</strong><p>Phase 2 is the priority source for the semantic audit. Preserve older forms as aliases unless an inconsistency is demonstrated.</p></div><span className="review-count">5 TOPICS</span></div>
          <div className="review-cards">{[{n:"01",title:"FRAPA contract",status:"Open question" as Status,tag:"SOURCE EVIDENCE",desc:"Establish the contract only from available source evidence. Do not invent definitions to fill gaps.",sourcePath:"docs/audits/phase-2-formal-syntax.md"},{n:"02",title:"Phase 4 — syntax & ambiguity",status:"Provisional" as Status,tag:"AUDIT MATERIAL",desc:"Test unique structural interpretation, operator arity and safe handling of incomplete expressions.",sourcePath:"sources/originals/Arcane_Language_Audit_Phase_4.docx"},{n:"03",title:"Phase 5 — semantic audit",status:"Provisional" as Status,tag:"PHASE 2 PRIORITY",desc:"Compare semantic claims against Phase 2 first. Record conflicts and retain old forms unless inconsistency is demonstrated.",sourcePath:"sources/originals/Arcane_Language_Audit_Phase_5.docx"},{n:"04",title:"Phase 6G — source lexicon",status:"Provisional" as Status,tag:"DATA INTEGRITY",desc:"Audit the v5 draft vocabulary, preserve non-atomic forms, validate alias targets, and keep RE/RA collisions visible.",sourcePath:"docs/research/phase6g-v5-source-lexicon-audit-01.md"},{n:"05",title:"Phase 6G — parser fixtures",status:"Provisional" as Status,tag:"OBSERVATION ONLY",desc:"Compare recovered fixtures against the provisional parser without treating observations as canon approval or semantic validation.",sourcePath:"docs/research/phase6g-fixture-observation-harness-01.md"}].map((item) => <article className="review-card" key={item.n}><div className="review-card-top"><span className="review-number">{item.n}</span><StatusPill status={item.status}/></div><span className="detail-kicker">{item.tag}</span><h2>{item.title}</h2><p>{item.desc}</p><div className="review-card-bottom"><a href={"https://github.com/sixtoast/Anime-language-/blob/main/" + item.sourcePath} target="_blank" rel="noreferrer" aria-label={"Open source evidence for " + item.title}>Open source evidence <span aria-hidden="true">↗</span></a></div></article>)}</div>
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
