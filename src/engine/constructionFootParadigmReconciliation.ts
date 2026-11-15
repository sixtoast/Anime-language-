/**
 * Phase 8CY-T — primary Phase 4 Construction Foot source concordance.
 * Evidence is from the byte-verified DOCX body transcription; this module does not
 * assert that a candidate combination is a lexical item or executable construction.
 */
import {constructionFootParadigmSummary} from "./constructionFootParadigmEvidenceMatrix";
import {constructionFootParadigmClosureAudit} from "./constructionFootParadigmClosureAudit";
import {constructionFootMorphologyAudit} from "./constructionFootMorphologyAudit";
export const constructionFootParadigmReconciliation = {
 phase:"8CY-T",
 status:"PRIMARY-CODA-INVENTORY-CONFIRMED" as const,
 source:{
  document:"Arcane_Language_Audit_Phase_4.docx",
  sha256:"c8204667c204227ba474fd0b5245fd66f1ba081565671f5a28cf65efb513eaea",
  transcription:"sources/extracted/phase4-docx-body-transcription.md",
  scope:"document-body paragraphs and tables; not footnotes, comments, layout or tracked-change intent",
  citations:[
   {section:"§3.1",locator:"Table 2",claim:"Foot = frame + parameter vowel + relation coda; shape CVC; six frame classes, six parameter vowels, five codas"},
   {section:"§3.2",locator:"Table 3",claim:"TRAK p/t/k; KREN b/d/g proposed; FREM m/n open-loop and ng feedback; SHREN s/sh release"},
   {section:"§4",locator:"Table 4",claim:"Phonotactic codas m,n,ng,p,t,k,s,sh,l,r"},
   {section:"§8",locator:"Table 14",claim:"mel = me + anchor coda l; kan/ken/kas are example tokens"},
   {section:"§10",locator:"Table 15 P4-T05",claim:"z and v are not frame consonants"},
   {section:"§10",locator:"Table 15 P4-T10",claim:"kan, ken, kas, kal, mel are CVC Foot-shaped"}
  ]
 },
 phase8ci:{
  relationCodaInventoryCount:constructionFootParadigmClosureAudit.slots[2].recoveredItems.length,
  priorStatus:"UNRECOVERED",
  correction:"Superseded by direct inspection of the byte-verified Phase 4 transcription; earlier audit closure was based on incomplete primary-source inspection."
 },
 phase8cyr:{
  claimedRelationCodaCount:constructionFootParadigmSummary.relationCodaCount,
  candidateSpaceSize:constructionFootParadigmSummary.candidateSpaceSize
 },
 relationCodas:[
  {form:"m",macro:"FREM",meaning:"OPEN-LOOP-MAINTENANCE",evidence:"EXPLICIT-PHASE4-TABLE3"},
  {form:"n",macro:"FREM",meaning:"OPEN-LOOP-MAINTENANCE",evidence:"EXPLICIT-PHASE4-TABLE3"},
  {form:"ng",ipa:"ŋ",macro:"FREM",meaning:"MAINTENANCE-WITH-FEEDBACK",evidence:"EXPLICIT-PHASE4-TABLE3-AND-D036"},
  {form:"s",macro:"SHREN",meaning:"RELEASE",evidence:"EXPLICIT-PHASE4-TABLE3"},
  {form:"sh",macro:"SHREN",meaning:"RELEASE",evidence:"EXPLICIT-PHASE4-TABLE3"}
 ],
 phonotacticCodas:["m","n","ng","p","t","k","s","sh","l","r"],
 phonotacticOnlyCodas:["p","t","k","l","r"],
 frameParameterReviewPairs:constructionFootMorphologyAudit.coverage.pairCount,
 canonicalCvForms:constructionFootMorphologyAudit.frameVowelMatrix.filter(x=>x.status==="CANONICAL-CV-FRAME").map(x=>x.form),
 unresolvedPairs:constructionFootMorphologyAudit.coverage.unresolvedPairCount,
 codaInventoryStatus:"SOURCE-BACKED-FIVE-MEMBER-INVENTORY" as const,
 footShape:"CVC-SOURCE-BACKED" as const,
 codaRequirement:{
  phase4:"CVC-FORM-REQUIRED-IN-§3.1-TABLE2-AND-P4-T10",
  phase516:"OPTIONAL-CODA-READING-IN-C02",
  adjudication:"PRIMARY-PHASE4-SOURCE-FAVOURED; PHASE5.16-CONTEXT-UNRESOLVED",
  status:"SECONDARY-SUMMARY-CONFLICT-RETAINED" as const
 },
 examples:{
  p4t10:["kan","ken","kas","kal","mel"],
  p4t10Meaning:"SHAPE-TEST-ONLY-NOT-SEMANTIC-LICENSING",
  mel:{table14:"me + anchor coda l",classification:"FUSED-REFERENCE-EXAMPLE",footLexicalStatus:"NOT-ESTABLISHED"},
  kal:{shape:"CVC-FOOT-SHAPED",finalL:"PHONOTACTIC-ONLY-NOT-RELATION-CODA",footLexicalStatus:"NOT-ESTABLISHED"}
 },
 candidateSpace:{
  count:180,
  status:"DESIGN-SPACE-ONLY",
  lexicalAttestation:"NOT-RECOVERED",
  lookup:"RETURNS-CANDIDATE-EVIDENCE-NOT-LEXICAL-VALIDATION",
  executable:false
 },
 unresolvedQuestions:[
  "Whether Phase 5.16 C-02's optional-coda reading describes a narrower context not stated in the recovered Phase 4 body",
  "Which of the 180 frame–vowel–relation-coda combinations are attested or licensed in the original v2.0 source",
  "What semantic and physical values each individual frame–vowel combination expresses"
 ],
 nextEvidenceGate:"Recover the original v2.0 morphology source and Phase 5.16 C-02 context; do not infer lexical licensing from the Phase 4 inventory cross-product.",
 executable:false as const,
 canonEffect:"NONE" as const
} as const;
