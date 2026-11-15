/** Phase 8AU: extracted contract metadata for the historical Phase 5.22 bounded fixture parser.
 * This is not a reimplementation of that parser and is not a general Construction grammar.
 */
export const historicalConstructionFixtureSource = {
  archiveMember:"Arcane_Phase_6S_Typed_Expression_Integration/arcane_phase_5_22_parser.py",
  sha256:"8041e7e40cd6e152aa9d38982e2a8986515a1aa7bc315dbfc1e7065e72ee2905",
  extractedCharacters:8612,
  indexedPreviewLimit:1800,
  status:"INDEXED-EXCERPT-ONLY",
  reportMember:"Arcane_Phase_6S_Typed_Expression_Integration/Arcane_Phase_5_22_Report.md",
  reportSha256:"e4e29b0e39e29d8d778613a798ba817dd5645da1caaea74d782b53160f598fe6",
  resultsMember:"Arcane_Phase_6S_Typed_Expression_Integration/Arcane_Phase_5_22_Results.json",
  resultsSha256:"71c2559dc4463e2c731008795838db5f845e0258c5206ecee5597be9b5a18007"
} as const;
export const historicalFixtureDigits = {za:0,ki:1,to:2,mu:3,re:4,sa:5,fi:6,du:7,go:8,pe:9} as const;
export const historicalFixtureUnits = {ma:"metre",se:"second",ke:"kilogram",ra:"radian",ku:"kelvin",sho:"dimensionless"} as const;
export const historicalFixtureAxes = {pa:"-X",ba:"+X",ta:"-Y",da:"+Y",ka:"-Z",ga:"+Z"} as const;
export const historicalFixtureRoles = {po:"position"} as const;
export const historicalFixtureCouplings = {
  he:{domain:"matter/mechanical-or-chemical",status:"PROVISIONAL"},
  ha:{domain:"energy/thermal",status:"PROVISIONAL"},
  ho:{domain:"electromagnetic",status:"PROVISIONAL"},
  hu:{domain:"biological",status:"PROVISIONAL"},
  hi:{domain:"informational",status:"PROVISIONAL"},
  "hə":{domain:"mana-only",status:"PROVISIONAL"}
} as const;
export const historicalFixtureFeet = {
  kan:{alias:"TRAK ENRA",status:"DOCUMENTED-EXAMPLE-LEVEL-ALIAS"},
  ken:{alias:"FREM / structure held",status:"DOCUMENTED-EXAMPLE-LEVEL-ALIAS"},
  kas:{alias:"SHREN / release",status:"DOCUMENTED-EXAMPLE-LEVEL-ALIAS"}
} as const;
export const historicalFixtureQuantityContract = {
  decimalSeparator:"shi",
  decimalRule:"Digits must occur on both sides of shi; multiple decimal separators are rejected.",
  termination:"A numeral ends in a unit token.",
  positionUnit:"metre",
  durationUnit:"second",
  fixtureValues:{position:"0.2 metre",duration:"5.0 seconds"},
  derivation:"za=0, to=2, sa=5; therefore za-shi-to-za is 0.2 and sa-shi-za is 5.0 under the archived digit table."
} as const;
export const historicalFixtureReportedTests = {
  passed:17,failed:0,total:17,
  status:"ARCHIVED-RESULT-REPORTED-NOT-RERUN",
  visibleCases:[
    {name:"valid canonical fixture",result:"PARSED_SUBSET"},
    {name:"missing phrase",code:"E-PHRASE-COUNT"},
    {name:"empty phrase",code:"E-EMPTY-PHRASE"},
    {name:"unknown anchor",code:"E-ANCHOR"},
    {name:"unknown role",code:"E-SPATIAL"},
    {name:"unknown axis",code:"E-SPATIAL"},
    {name:"quantity missing unit",code:"E-QTY-UNIT"},
    {name:"bad digit",code:"E-QTY-DIGIT"},
    {name:"bad decimal no whole digits",code:"E-QTY-DECIMAL"},
    {name:"bad decimal no fractional digits",code:"E-QTY-DECIMAL"},
    {name:"multiple decimals",code:"E-QTY-DECIMAL"},
    {name:"wrong position unit",code:"E-POSITION-UNIT"}
  ],
  note:"The index excerpt truncates the remainder of the 17-case JSON report. Only visible cases are transcribed here; the total is taken from the archive summary."
} as const;
export const historicalFixtureContractBoundary = {
  profile:"EXACT-SIX-PHRASE-HAND-FLAME-FIXTURE",
  middleDotBoundariesRequired:true,
  generalGrammar:false,
  physicalFeasibility:false,
  canonEffect:"NONE",
  runtimeImplementation:"NOT-IMPLEMENTED-HERE",
  sourceRecovery:"The parser's full 8,612-character source is not present as a standalone UTF-8 file in the current checkout; only an 1,800-character index excerpt and report/result excerpts are available.",
  limits:[
    "Do not promote the fixture digit, unit, axis or role tables to global language inventories without version and source reconciliation.",
    "Do not treat KAN/KEN/KAS aliases as general macro expansions or a productive Foot paradigm.",
    "Do not treat provisional H-domain labels as physical coupling contracts.",
    "Do not infer general quantity syntax from one exact fixture profile.",
    "Do not claim the historical 17/17 result was rerun in the current project."
  ]
} as const;
