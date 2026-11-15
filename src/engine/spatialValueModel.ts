/** Phase 8BS — typed spatial values for abstract research fixtures only.
 * No Arcane vector literal, operator signature or physical effect is defined here.
 */
export type SpatialValueKind = "SpatialPosition" | "DisplacementVector" | "VelocityVector" | "ForceVector" | "ManaStateVector" | "GenericVector";
export interface SpatialDimension { length:number; time:number; mass:number; temperature:number; angle:number; }
export interface SpatialComponent { value:number; unitLabel:string; dimension:SpatialDimension; }
export interface SpatialVectorFixture {
  kind:Exclude<SpatialValueKind,"SpatialPosition">;
  dimension:3;
  frameRole:"FE";
  frameIdentity:string;
  coordinateConvention:"V3.0-L";
  components:{X:SpatialComponent;Y:SpatialComponent;Z:SpatialComponent};
  representationVersion:"SPATIAL-VALUE-0.1";
  sourceStatus:"PROPOSAL-FIXTURE";
}
export interface SpatialPositionFixture {
  kind:"SpatialPosition";
  dimension:3;
  frameRole:"FE";
  frameIdentity:string;
  originReferenceId:string;
  coordinateConvention:"V3.0-L";
  components:{X:SpatialComponent;Y:SpatialComponent;Z:SpatialComponent};
  representationVersion:"SPATIAL-VALUE-0.1";
  sourceStatus:"PROPOSAL-FIXTURE";
}
export type SpatialAssessmentStatus="ACCEPTED_BY_PROPOSED_TYPE_RULE"|"REJECTED_BY_PROPOSED_TYPE_RULE"|"BLOCKED_BY_MISSING_CONTRACT";
export interface SpatialAssessment { status:SpatialAssessmentStatus; issues:string[]; }
const expectedDimensions:Partial<Record<SpatialValueKind,SpatialDimension>>={
  DisplacementVector:{length:1,time:0,mass:0,temperature:0,angle:0},
  VelocityVector:{length:1,time:-1,mass:0,temperature:0,angle:0},
  ForceVector:{length:1,time:-2,mass:1,temperature:0,angle:0}
};
const isRecord=(v:unknown):v is Record<string,unknown>=>typeof v==="object"&&v!==null&&!Array.isArray(v);
const isFiniteNumber=(v:unknown):v is number=>typeof v==="number"&&Number.isFinite(v);
function isDimension(v:unknown):v is SpatialDimension {
 return isRecord(v)&&["length","time","mass","temperature","angle"].every(k=>isFiniteNumber(v[k]));
}
function sameDimension(a:SpatialDimension,b:SpatialDimension):boolean {
 return a.length===b.length&&a.time===b.time&&a.mass===b.mass&&a.temperature===b.temperature&&a.angle===b.angle;
}
function baseShape(value:unknown,kind:SpatialValueKind):{issues:string[];components?:Record<"X"|"Y"|"Z",SpatialComponent>} {
 const issues:string[]=[];
 if(!isRecord(value))return {issues:["Record is not an object."]};
 if(value.kind!==kind)issues.push("Value kind does not match the requested record kind.");
 if(value.dimension!==3)issues.push("The current spatial fixture profile requires exactly three components.");
 if(value.frameRole!=="FE")issues.push("A declared FE frame role is required by this research profile.");
 if(typeof value.frameIdentity!=="string"||value.frameIdentity.trim().length===0)issues.push("A concrete frame identity is required; FE alone is not a frame identity.");
 if(value.coordinateConvention!=="V3.0-L")issues.push("The v3.0-L coordinate convention must be declared.");
 if(value.representationVersion!=="SPATIAL-VALUE-0.1")issues.push("Unknown or missing representation version.");
 if(value.sourceStatus!=="PROPOSAL-FIXTURE")issues.push("Source status must remain explicitly proposal-level.");
 if(kind==="SpatialPosition"&&(typeof value.originReferenceId!=="string"||value.originReferenceId.trim().length===0))issues.push("A spatial position requires an explicit origin/reference identity.");
 if(!isRecord(value.components))return {issues:[...issues,"Component record is missing or malformed."]};
 const parsed={} as Record<"X"|"Y"|"Z",SpatialComponent>;
 for(const axis of ["X","Y","Z"] as const){
  const c=value.components[axis];
  if(!isRecord(c)||!isFiniteNumber(c.value)||typeof c.unitLabel!=="string"||c.unitLabel.trim().length===0||!isDimension(c.dimension))issues.push(axis+" component is malformed or lacks a finite value, unit label or dimension.");
  else parsed[axis]={value:c.value,unitLabel:c.unitLabel,dimension:c.dimension};
 }
 if(issues.length)return {issues};
 return {issues,components:parsed};
}
export function assessSpatialPositionFixture(value:unknown):SpatialAssessment {
 const parsed=baseShape(value,"SpatialPosition");
 if(parsed.issues.length)return {status:"REJECTED_BY_PROPOSED_TYPE_RULE",issues:parsed.issues};
 const values=Object.values(parsed.components!);
 const dims=values.map(c=>c.dimension);
 if(!values.every(c=>c.unitLabel===values[0].unitLabel))return {status:"REJECTED_BY_PROPOSED_TYPE_RULE",issues:["Position coordinate unit labels must match; no conversion is implemented."]};
 const length={length:1,time:0,mass:0,temperature:0,angle:0};
 if(!dims.every(d=>sameDimension(d,length)))return {status:"REJECTED_BY_PROPOSED_TYPE_RULE",issues:["Position coordinates must all carry length dimensions under this proposal."]};
 return {status:"ACCEPTED_BY_PROPOSED_TYPE_RULE",issues:[]};
}
export function assessSpatialVectorFixture(value:unknown):SpatialAssessment {
 if(!isRecord(value))return {status:"REJECTED_BY_PROPOSED_TYPE_RULE",issues:["Record is not an object."]};
 const kind=value.kind;
 if(kind==="ManaStateVector"||kind==="GenericVector")return {status:"BLOCKED_BY_MISSING_CONTRACT",issues:["No approved mapping from this vector kind to the current spatial-vector profile."]};
 if(kind!=="DisplacementVector"&&kind!=="VelocityVector"&&kind!=="ForceVector")return {status:"REJECTED_BY_PROPOSED_TYPE_RULE",issues:["Unknown spatial vector kind."]};
 const parsed=baseShape(value,kind);
 if(parsed.issues.length)return {status:"REJECTED_BY_PROPOSED_TYPE_RULE",issues:parsed.issues};
 const expected=expectedDimensions[kind]!;
 const componentValues=Object.values(parsed.components!);
 const dimensions=componentValues.map(c=>c.dimension);
 if(!componentValues.every(c=>c.unitLabel===componentValues[0].unitLabel))return {status:"REJECTED_BY_PROPOSED_TYPE_RULE",issues:["Vector component unit labels must match; no conversion is implemented."]};
 if(!dimensions.every(d=>sameDimension(d,expected)))return {status:"REJECTED_BY_PROPOSED_TYPE_RULE",issues:["Component dimensions do not match the proposed dimensional signature for "+kind+"."]};
 return {status:"ACCEPTED_BY_PROPOSED_TYPE_RULE",issues:[]};
}
function assertDisplacement(value:unknown):asserts value is SpatialVectorFixture {
 const result=assessSpatialVectorFixture(value);
 if(result.status!=="ACCEPTED_BY_PROPOSED_TYPE_RULE"||!isRecord(value)||value.kind!=="DisplacementVector")throw new Error("Displacement operation blocked: "+result.status+"; "+result.issues.join("; "));
}
export function proposedDisplacementMagnitude(value:unknown):{value:number;dimension:SpatialDimension;unitLabel:string;status:"PROPOSAL-RESULT"} {
 assertDisplacement(value);
 const c=value.components;
 const result=Math.sqrt(c.X.value**2+c.Y.value**2+c.Z.value**2);
 if(!Number.isFinite(result))throw new Error("Magnitude produced a non-finite result.");
 return {value:result,dimension:c.X.dimension,unitLabel:c.X.unitLabel,status:"PROPOSAL-RESULT"};
}
export function proposedDisplacementDot(a:unknown,b:unknown):{value:number;dimension:SpatialDimension;unitLabel:string;status:"PROPOSAL-RESULT"} {
 assertDisplacement(a);assertDisplacement(b);
 if(a.frameIdentity!==b.frameIdentity)throw new Error("Dot product blocked: frame identities differ and no transform contract is supplied.");
 for(const axis of ["X","Y","Z"] as const){if(!sameDimension(a.components[axis].dimension,b.components[axis].dimension))throw new Error("Dot product blocked: component dimensions are incompatible.");if(a.components[axis].unitLabel!==b.components[axis].unitLabel)throw new Error("Dot product blocked: component unit labels differ and no conversion is implemented.");}
 const x=a.components.X,y=a.components.Y,z=a.components.Z;
 const value=x.value*b.components.X.value+y.value*b.components.Y.value+z.value*b.components.Z.value;
 if(!Number.isFinite(value))throw new Error("Dot product produced a non-finite result.");
 const d=x.dimension,e=b.components.X.dimension;
 return {value,dimension:{length:d.length+e.length,time:d.time+e.time,mass:d.mass+e.mass,temperature:d.temperature+e.temperature,angle:d.angle+e.angle},unitLabel:x.unitLabel+"·"+b.components.X.unitLabel,status:"PROPOSAL-RESULT"};
}
const length={length:1,time:0,mass:0,temperature:0,angle:0};
const velocity={length:1,time:-1,mass:0,temperature:0,angle:0};
const comp=(value:number,dimension:SpatialDimension,unitLabel:string):SpatialComponent=>({value,dimension,unitLabel});
export const workedDisplacementFixture:SpatialVectorFixture={
 kind:"DisplacementVector",dimension:3,frameRole:"FE",frameIdentity:"FRAME-TEST-01",coordinateConvention:"V3.0-L",
 components:{X:comp(1,length,"m"),Y:comp(2,length,"m"),Z:comp(3,length,"m")},
 representationVersion:"SPATIAL-VALUE-0.1",sourceStatus:"PROPOSAL-FIXTURE"
};
export const workedVelocityFixture:SpatialVectorFixture={
 kind:"VelocityVector",dimension:3,frameRole:"FE",frameIdentity:"FRAME-TEST-01",coordinateConvention:"V3.0-L",
 components:{X:comp(1,velocity,"m/s"),Y:comp(0,velocity,"m/s"),Z:comp(0,velocity,"m/s")},
 representationVersion:"SPATIAL-VALUE-0.1",sourceStatus:"PROPOSAL-FIXTURE"
};
export const spatialValueModelSummary={
 kinds:[
  {id:"SpatialPosition",label:"Position",rule:"Requires frame identity and origin/reference; not a displacement."},
  {id:"DisplacementVector",label:"Displacement",rule:"Three length components in one declared frame."},
  {id:"VelocityVector",label:"Velocity",rule:"Three length/time components in one declared frame."},
  {id:"ForceVector",label:"Force",rule:"Three force-dimension components; physical contract remains provisional."},
  {id:"ManaStateVector",label:"Mana-state vector",rule:"Blocked from spatial operations without a field-specific contract."},
  {id:"GenericVector",label:"Generic vector",rule:"Insufficiently typed for spatial operations."}
 ],
 unresolved:["canonical vector surface syntax","canonical operator signatures and norms","frame transforms","physical feasibility"],
 limits:{executable:false,canonEffect:"NONE",threeDimensionalRule:"PROPOSAL-ONLY"}
} as const;
