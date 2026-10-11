import { useMemo, useState } from "react";
import {
  Activity, BookOpen, Braces, CheckCircle2, ChevronDown, CircleHelp,
  Command, FileText, FlaskConical, GitBranch, History, Layers3, Menu,
  Search, ShieldCheck, Sparkles, TestTube2, X
} from "lucide-react";

type Section = "Overview" | "Documentation" | "Playground" | "Test suite" | "Research & review";
type Status = "Canonical" | "Provisional" | "Open question" | "Deprecated";

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

const docs = [
  { title: "Canonical specification", category: "Specification", status: "Canonical" as Status, description: "The approved definition of the language. Import the verified v3.0 source before documenting individual rules." },
  { title: "Grammar & syntax", category: "Language reference", status: "Open question" as Status, description: "Formal grammar, expression structure, operator arity, and parsing constraints." },
  { title: "Operator reference", category: "Language reference", status: "Open question" as Status, description: "Operator definitions, operands, precedence, and associativity, backed by source evidence." },
  { title: "Phase 4 — ambiguity audit", category: "Audit", status: "Provisional" as Status, description: "Syntax and ambiguity testing. Provisional audit material; not a replacement for the canonical specification." },
  { title: "Phase 5 — semantic audit", category: "Audit", status: "Provisional" as Status, description: "Semantic consistency review with Phase 2 prioritised as the source, preserving aliases unless inconsistency is demonstrated." },
  { title: "FRAPA contract", category: "Research", status: "Open question" as Status, description: "Contract and terminology to be established only from available source evidence." }
];

function StatusPill({ status }: { status: Status }) {
  return <span className={"status status-" + status.toLowerCase().replaceAll(" ", "-")}>{status}</span>;
}

function App() {
  const [section, setSection] = useState<Section>("Overview");
  const [query, setQuery] = useState("");
  const [editor, setEditor] = useState("");
  const [mobileNav, setMobileNav] = useState(false);
  const [selectedDoc, setSelectedDoc] = useState(docs[0].title);

  const filteredDocs = useMemo(() => docs.filter((doc) =>
    (doc.title + " " + doc.category + " " + doc.description + " " + doc.status).toLowerCase().includes(query.toLowerCase())
  ), [query]);

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
        <div className="side-nav">
          {["WORKSPACE", "LANGUAGE", "QUALITY"].map((group) => (
            <div className="nav-group" key={group}>
              <div className="nav-label">{group}</div>
              {navigation.filter((item) => item.group === group).map(({ label, icon: Icon }) => (
                <button key={label} className={"nav-item " + (section === label ? "active" : "")} onClick={() => changeSection(label)}>
                  <Icon size={17} strokeWidth={1.8}/><span>{label}</span>
                  {label === "Research & review" && <span className="nav-count">3</span>}
                </button>
              ))}
            </div>
          ))}
        </div>
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
          <div className="topbar-actions"><span className="version-chip"><span className="pulse-dot"/> SPEC v3.0 · SOURCE TO VERIFY</span><button className="icon-button" title="Search documentation" onClick={() => { changeSection("Documentation"); document.getElementById("global-search")?.focus(); }}><Search size={18}/></button></div>
        </header>

        {section === "Overview" && <section className="page-content">
          <div className="eyebrow"><span className="eyebrow-line"/> YOUR LANGUAGE, ONE SOURCE OF TRUTH</div>
          <div className="hero-row"><div><h1>Build the language.<br/><span>Prove the rules.</span></h1><p className="hero-copy">A dedicated workspace to document, test, and investigate the Anime language — with every rule traceable to its source.</p></div><div className="hero-emblem"><div className="emblem-ring ring-one"/><div className="emblem-ring ring-two"/><div className="emblem-core"><Sparkles size={31}/></div><span className="emblem-caption">SPECIFICATION<br/>FIRST</span></div></div>
          <div className="notice"><div className="notice-icon"><ShieldCheck size={18}/></div><div><strong>Specification-first mode</strong><p>Audit notes are not canonical rules. The language engine will only enforce behaviour supported by verified source material.</p></div><span className="notice-tag">GUARDRAIL 01</span></div>
          <div className="section-heading"><div><div className="eyebrow">WORKSPACE</div><h2>Everything in one place</h2></div><span className="section-caption">FOUNDATION · PHASE 01</span></div>
          <div className="feature-grid">
            <button className="feature-card" onClick={() => changeSection("Documentation")}><div className="feature-icon icon-violet"><BookOpen size={20}/></div><div className="feature-title">Language reference <span>↗</span></div><p>Specification, grammar, operators, semantics and terminology with explicit source status.</p><div className="feature-foot"><span>Explore documentation</span><span>01</span></div></button>
            <button className="feature-card" onClick={() => changeSection("Playground")}><div className="feature-icon icon-blue"><Braces size={20}/></div><div className="feature-title">Expression playground <span>↗</span></div><p>Prepare expressions and inspect diagnostics as the verified lexer and parser are implemented.</p><div className="feature-foot"><span>Open playground</span><span>02</span></div></button>
            <button className="feature-card" onClick={() => changeSection("Test suite")}><div className="feature-icon icon-green"><TestTube2 size={20}/></div><div className="feature-title">Test & validate <span>↗</span></div><p>Build a regression suite for accepted forms, rejected forms and ambiguous expressions.</p><div className="feature-foot"><span>Review test plan</span><span>03</span></div></button>
            <button className="feature-card" onClick={() => changeSection("Research & review")}><div className="feature-icon icon-amber"><FlaskConical size={20}/></div><div className="feature-title">Research & review <span>↗</span></div><p>Track evidence, open questions, competing interpretations and proposed changes.</p><div className="feature-foot"><span>Review open work</span><span>04</span></div></button>
          </div>
          <div className="section-heading lower-heading"><div><div className="eyebrow">GOVERNANCE</div><h2>Rules need evidence</h2></div><span className="section-caption">NO SILENT CHANGES</span></div>
          <div className="principle-list">{principles.map((item, i) => <div className="principle-row" key={item.status}><div className="principle-index">{String(i + 1).padStart(2, "0")}</div><div className="principle-copy"><strong>{item.title}</strong><p>{item.detail}</p></div><StatusPill status={item.status}/></div>)}</div>
          <footer className="page-footer"><span><span className="footer-dot"/> Workspace initialised · language engine not yet implemented</span><span>BUILT FOR CLARITY, NOT GUESSWORK</span></footer>
        </section>}

        {section === "Documentation" && <section className="page-content">
          <div className="eyebrow"><span className="eyebrow-line"/> THE LANGUAGE REFERENCE</div><h1 className="page-title">Documentation<span>.</span></h1><p className="page-intro">A source-aware index for specifications, syntax, semantics, audits and research. Entries below are an initial catalogue, not imported canonical rule text.</p>
          <div className="search-bar"><Search size={18}/><input id="global-search" value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search titles, topics, status…"/><kbd>FILTER</kbd></div>
          <div className="doc-layout"><div className="doc-list">{filteredDocs.map((doc) => <button key={doc.title} className={"doc-row " + (selectedDoc === doc.title ? "doc-selected" : "")} onClick={() => setSelectedDoc(doc.title)}><div className="doc-icon"><FileText size={18}/></div><div className="doc-row-main"><strong>{doc.title}</strong><span>{doc.category}</span></div><StatusPill status={doc.status}/></button>)}{filteredDocs.length === 0 && <div className="empty-state">No entries match that search. Try another term.</div>}</div><div className="doc-detail">{(() => { const doc = docs.find((item) => item.title === selectedDoc) ?? docs[0]; return <><div className="detail-top"><span className="detail-kicker">REFERENCE ENTRY</span><StatusPill status={doc.status}/></div><h2>{doc.title}</h2><p>{doc.description}</p><div className="detail-divider"/><div className="detail-meta"><span>Category</span><strong>{doc.category}</strong></div><div className="detail-meta"><span>Source citation</span><strong>Not yet attached</strong></div><div className="detail-meta"><span>Implementation</span><strong>Not yet verified</strong></div><div className="detail-callout"><CircleHelp size={17}/><p>Before this entry can define behaviour, attach the exact source passage and record its version, section, and approval status.</p></div><button className="secondary-button" onClick={() => changeSection("Research & review")}>Review source status <span>→</span></button></>; })()}</div></div>
        </section>}

        {section === "Playground" && <section className="page-content">
          <div className="eyebrow"><span className="eyebrow-line"/> EXPRESSION WORKSPACE</div><h1 className="page-title">Playground<span>.</span></h1><p className="page-intro">Draft an expression and prepare it for analysis. This initial interface does not yet parse, validate or execute Anime language syntax.</p>
          <div className="engine-banner"><Activity size={18}/><div><strong>Language engine not connected</strong><p>Input is not being evaluated. No syntax is assumed to be valid.</p></div><span className="engine-status">NOT RUNNABLE</span></div>
          <div className="editor-card"><div className="editor-toolbar"><div><span className="editor-dot"/><span className="editor-file">untitled.anime</span><span className="editor-language">ANIME LANGUAGE</span></div><button className="secondary-button" onClick={() => setEditor("")}>Clear editor</button></div><div className="editor-body"><div className="line-number">1<br/>2<br/>3<br/>4<br/>5<br/>6<br/>7<br/>8</div><textarea spellCheck={false} value={editor} onChange={(e) => setEditor(e.target.value)} placeholder={"Write a language expression here…\n\nNo example syntax is pre-filled until the canonical grammar is imported."} aria-label="Anime language expression editor"/></div><div className="editor-footer"><span>{editor.length} characters</span><span>Plain text · no evaluation</span></div></div>
          <div className="result-panel"><div className="result-heading"><Command size={17}/><strong>Analysis output</strong><span>WAITING</span></div><div className="result-empty"><Braces size={27}/><strong>No analysis has been run</strong><p>Once the verified grammar and parser are implemented, this panel will show tokens, parse structure and diagnostics.</p></div></div>
          <div className="next-step"><Sparkles size={17}/><p><strong>Next implementation step</strong><br/>Import the authoritative grammar and build tests before connecting this editor to a parser.</p></div>
        </section>}

        {section === "Test suite" && <section className="page-content">
          <div className="eyebrow"><span className="eyebrow-line"/> QUALITY & REGRESSION</div><h1 className="page-title">Test suite<span>.</span></h1><p className="page-intro">A test catalogue designed to stop accidental changes in language behaviour. These are test categories and planned checks, not executed test results.</p>
          <div className="test-summary"><div><span>DEFINED TESTS</span><strong>0</strong><small>No fixtures imported</small></div><div><span>LAST RUN</span><strong>—</strong><small>Test runner not executed</small></div><div><span>ENGINE</span><strong className="amber-text">Pending</strong><small>Grammar source required</small></div></div>
          <div className="test-table"><div className="test-table-head"><span>TEST GROUP</span><span>EXPECTED COVERAGE</span><span>STATUS</span></div>{[{name:"Lexical analysis",desc:"Token boundaries, symbols, invalid characters",icon:Braces},{name:"Syntax & arity",desc:"Structure, required arguments, incomplete input",icon:Layers3},{name:"Semantic consistency",desc:"Meaning, constraints and rule conflicts",icon:ShieldCheck},{name:"Ambiguity handling",desc:"Unique interpretation or safe rejection",icon:CircleHelp},{name:"Regression",desc:"Previously approved examples remain stable",icon:History}].map(({name,desc,icon:Icon}) => <div className="test-row" key={name}><div className="test-name"><Icon size={17}/><strong>{name}</strong></div><span>{desc}</span><span className="pending-label">Not configured</span></div>)}</div>
          <div className="notice"><div className="notice-icon"><CheckCircle2 size={18}/></div><div><strong>Expected behaviour must be explicit</strong><p>Each fixture will cite its source rule and specify whether it should be accepted, rejected, or flagged for review.</p></div></div>
        </section>}

        {section === "Research & review" && <section className="page-content">
          <div className="eyebrow"><span className="eyebrow-line"/> EVIDENCE, QUESTIONS, DECISIONS</div><h1 className="page-title">Research & review<span>.</span></h1><p className="page-intro">Keep unresolved questions visible. Findings should be traceable to source material and should not become canonical by implication.</p>
          <div className="review-banner"><FlaskConical size={20}/><div><strong>Active audit context</strong><p>Phase 2 is the priority source for the semantic audit. Preserve older forms as aliases unless an inconsistency is demonstrated.</p></div><span className="review-count">3 TOPICS</span></div>
          <div className="review-cards">{[{n:"01",title:"FRAPA contract",status:"Open question" as Status,tag:"SOURCE EVIDENCE",desc:"Establish the contract only from available source evidence. Do not invent definitions to fill gaps."},{n:"02",title:"Phase 4 — syntax & ambiguity",status:"Provisional" as Status,tag:"AUDIT MATERIAL",desc:"Test unique structural interpretation, operator arity and safe handling of incomplete expressions."},{n:"03",title:"Phase 5 — semantic audit",status:"Provisional" as Status,tag:"PHASE 2 PRIORITY",desc:"Compare semantic claims against Phase 2 first. Record conflicts and retain old forms unless inconsistency is demonstrated."}].map((item) => <article className="review-card" key={item.n}><div className="review-card-top"><span className="review-number">{item.n}</span><StatusPill status={item.status}/></div><span className="detail-kicker">{item.tag}</span><h2>{item.title}</h2><p>{item.desc}</p><div className="review-card-bottom"><span>Evidence link required</span><span>↗</span></div></article>)}</div>
          <div className="section-heading lower-heading"><div><div className="eyebrow">REVIEW PROTOCOL</div><h2>From question to decision</h2></div></div><div className="principle-list">{[{n:"01",title:"Capture the question",detail:"State exactly what is unclear and where the uncertainty originates."},{n:"02",title:"Attach the source",detail:"Link the precise version, section, and passage; separate source text from interpretation."},{n:"03",title:"Test alternatives",detail:"Record competing readings and the evidence for or against each."},{n:"04",title:"Approve explicitly",detail:"Only an explicit decision updates canonical documentation and implementation tests."}].map((item) => <div className="principle-row" key={item.n}><div className="principle-index">{item.n}</div><div className="principle-copy"><strong>{item.title}</strong><p>{item.detail}</p></div></div>)}</div>
        </section>}
      </main>
    </div>
  );
}

export default App;
