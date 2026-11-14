
import {INCANTATION_INTEGRATED_PROFILE} from "./incantationIntegratedReview";
const obj=(v:unknown):v is Record<string,any>=>v!==null&&typeof v==="object"&&!Array.isArray(v);
const arr=(v:unknown):any[]=>Array.isArray(v)?v:[];
const shown=(v:unknown)=>v===undefined||v===null||v===""?"NOT-DECLARED":typeof v==="string"?v:JSON.stringify(v);
const operationNames:Record<string,string>={kren:"KREN — establish (proposed frame-group association)",trak:"TRAK — alter / discrete change",frem:"FREM — maintain",shren:"SHREN — release",bran:"BRAN — couple"};
export interface ReadableIncantationSection{title:string;lines:string[];}
export interface ReadableIncantationReport{profile:"INCANTATION-READING-REPORT-1.0";interpretation:"DECLARED-STRUCTURE-ONLY";disposition:"READABLE-DECLARATIONS"|"INCOMPLETE-DECLARATIONS"|"INVALID-RECORD";sections:ReadableIncantationSection[];warnings:string[];explicitNonDeterminations:string[];executable:false;spokenArcanaParsed:false;canonEffect:"NONE";limitation:string;}
const LIMIT="This report reads the submitted structured Incantation contract as declarations. It does not read or translate spoken Arcane, infer omitted grammar, validate semantic truth, type compatibility, physical feasibility, safety, consent or authority, execute a spell, or establish an outcome.";
export function readStructuredIncantation(input:unknown):ReadableIncantationReport{
 const warnings:string[]=[],sections:ReadableIncantationSection[]=[];
 const result=(disposition:ReadableIncantationReport["disposition"],sections:ReadableIncantationSection[],warnings:string[]):ReadableIncantationReport=>({profile:"INCANTATION-READING-REPORT-1.0",interpretation:"DECLARED-STRUCTURE-ONLY",disposition,sections,warnings,explicitNonDeterminations:["Spoken Arcane syntax and pronunciation were not parsed.","No omitted argument, reference, condition, resource or relationship was inferred.","Predicate truth, evidence authenticity and authority were not established.","Type compatibility, geometry, mechanism feasibility and safe state were not assessed.","No physical operation was executed and no outcome was verified."],executable:false,spokenArcanaParsed:false,canonEffect:"NONE",limitation:LIMIT});
 if(!obj(input)||input.profile!==INCANTATION_INTEGRATED_PROFILE)return result("INVALID-RECORD",[],["A valid INCANTATION-INTEGRATED-REVIEW-1.0 object is required."]);
 const operations=arr(input.operations),operationLines:string[]=[];
 operations.forEach((raw,i)=>{
  if(!obj(raw)){operationLines.push("Operation "+(i+1)+": INVALID DECLARATION");warnings.push("operations["+i+"] is not an object.");return;}
  const a=obj(raw.arguments)?raw.arguments:{};
  operationLines.push("Operation "+(i+1)+" ["+shown(raw.id)+"]: "+(operationNames[String(a.operation)]??("Unrecognised operation: "+shown(a.operation))));
  operationLines.push("  Target label: "+shown(a.targetLabel));
  operationLines.push("  References declared: "+arr(a.references).length);
  arr(a.references).forEach((r,j)=>operationLines.push("  Reference "+(j+1)+": "+shown(r?.label)+" · "+shown(r?.referenceClass)+" · scope "+shown(r?.scope)+" · resolution "+shown(r?.resolution)+" · binding "+shown(r?.bindingState)+" · referent "+shown(r?.referentId)));
  for(const [label,key] of [["Desired state","desiredState"],["Current state","currentState"],["Release specification","releaseSpecification"]] as const){if(a[key]!==undefined){const v=a[key];operationLines.push("  "+label+": "+(obj(v)?"type "+shown(v.type)+"; payload "+shown(v.payload)+"; provenance "+shown(v.provenance)+"; validity "+shown(v.validity)+"; uncertainty "+shown(v.uncertainty):shown(v)));}}
  arr(a.spatialRoles).forEach((r,j)=>operationLines.push("  Spatial role "+(j+1)+": "+shown(r?.marker)+"; value "+shown(r?.value?.payload)+"; type "+shown(r?.value?.type)));
  if(obj(a.coupling))operationLines.push("  Coupling: "+shown(a.coupling.category)+"; participants "+shown(a.coupling.participantA)+" / "+shown(a.coupling.participantB)+"; model "+shown(a.coupling.relationModel)+"; scope "+shown(a.coupling.validityScope));
  operationLines.push("  Constraints declared: "+arr(a.constraints).length);
 });
 sections.push({title:"Operations and arguments",lines:operationLines.length?operationLines:["No operations declared."]});
 const graph=obj(input.relationships)?input.relationships:{};
 sections.push({title:"Semantic relationships",lines:["Nodes declared: "+arr(graph.nodes).length,...arr(graph.nodes).map(n=>"Node "+shown(n?.id)+": "+shown(n?.type)+" · "+shown(n?.resolution)),"Relationships declared: "+arr(graph.edges).length,...arr(graph.edges).map(e=>shown(e?.from)+" —["+shown(e?.type)+"]→ "+shown(e?.to))]});
 const conditions=obj(input.conditions)?arr(input.conditions.conditions):[];
 sections.push({title:"Conditions",lines:conditions.length?conditions.map(c=>shown(c?.id)+": "+shown(c?.kind)+" · predicate "+shown(c?.predicateId)+"@"+shown(c?.predicateVersion)+" · required "+shown(c?.requiredResult)+" · check "+shown(c?.checkTime)+" · failure policy "+shown(c?.failurePolicy)):["No conditions declared. This is not evidence that no conditions are needed."]});
 const evidence=obj(input.evidence)?arr(input.evidence.records):[];
 sections.push({title:"Evidence declarations",lines:["Evidence records: "+evidence.length,...evidence.map(e=>shown(e?.id)+": subject "+shown(e?.subjectId)+" · predicate "+shown(e?.predicateId)+" · result "+shown(e?.result)+" · class "+shown(e?.class)+" · source "+shown(e?.source)+" · observed "+shown(e?.observedAt)+" · valid until "+shown(e?.validUntil)),"Policy: "+shown(obj(input.evidence)?input.evidence.policy:undefined),"As-of: "+shown(obj(input.evidence)?input.evidence.asOf:undefined)]});
 sections.push({title:"Temporal, postcondition and lifecycle declarations",lines:["Temporal contracts: "+arr(input.temporalContracts).length,...arr(input.temporalContracts).map(t=>"Temporal operator: "+shown(t?.operator)+" · stop event: "+shown(t?.stopEvent)),"Postconditions: "+arr(input.postconditions).length,...arr(input.postconditions).map(p=>"Execution attempted: "+shown(p?.executionAttempted)+" · predicate result: "+shown(p?.predicateResult)),"Lifecycle records: "+arr(input.lifecycleRecords).length,...arr(input.lifecycleRecords).flatMap(l=>arr(l?.events).map(e=>shown(e?.sequence)+". "+shown(e?.state)+" at "+shown(e?.at))),"Recovery branches: "+arr(input.recoveryBranches).length,...arr(input.recoveryBranches).map(r=>"Recovery "+shown(r?.id)+" from "+shown(r?.fromFailedOperation)+" · separately authorised: "+shown(r?.authorised))]});
 if(!operations.length)warnings.push("No operations were declared.");
 if(!arr(graph.nodes).length)warnings.push("No semantic graph nodes were declared.");
 if(!evidence.length)warnings.push("No evidence records were supplied; declarations are not observations.");
 warnings.push("Operation names are glossed at their documented evidence level; KREN remains proposed.");
 warnings.push("Empty sections mean only that nothing was declared in the submitted record; they do not prove that a spell does not need those elements.");
 return result(!operations.length?"INCOMPLETE-DECLARATIONS":"READABLE-DECLARATIONS",sections,warnings);
}