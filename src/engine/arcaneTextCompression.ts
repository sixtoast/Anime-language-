
export const ARCANE_TEXT_COMPRESSION_PROFILE="ARCANE-TEXT-COMPRESSION-1.0" as const;
export interface ArcaneTextAlias{fullForm:string;shortForm:string;}
export interface ArcaneTextCompressionResult{
 profile:typeof ARCANE_TEXT_COMPRESSION_PROFILE;
 disposition:"COMPRESSED"|"NO-SAVING"|"INVALID-DICTIONARY";
 originalText:string;
 compressedText:string;
 aliases:ArcaneTextAlias[];
 replacements:number;
 originalCharacters:number;
 compressedCharacters:number;
 charactersSaved:number;
 dictionaryCharacters:number;
 dictionaryIsShared:boolean;
 exactRoundTrip:boolean;
 parserInput:"EXPAND-BEFORE-PARSING";
 executable:false;
 canonEffect:"NONE";
 issues:string[];
 limitation:string;
}
const LIMIT="This is reversible transport/display compression only. It does not define shorter Arcane words, change grammar, remove semantic arguments, or make the compressed surface valid Arcane. Expand with the same versioned alias dictionary before tokenisation or parsing. Dictionary cost is excluded from per-text savings only when the dictionary is shared separately.";
const isToken=(s:string)=>s.length>0&&!/\s/.test(s);
function validate(source:string,aliases:ArcaneTextAlias[]):string[]{
 const issues:string[]=[];
 if(!Array.isArray(aliases))return["Alias dictionary must be an array."];
 const full=new Set<string>(),short=new Set<string>(),sourceTokens=new Set(source.split(/\s+/).filter(Boolean));
 aliases.forEach((a,i)=>{
  if(!a||typeof a.fullForm!=="string"||typeof a.shortForm!=="string"||!isToken(a.fullForm)||!isToken(a.shortForm)){issues.push("Alias "+i+" must contain non-empty, whitespace-free fullForm and shortForm tokens.");return;}
  if(a.fullForm===a.shortForm)issues.push("Alias "+i+" maps a token to itself.");
  if(full.has(a.fullForm))issues.push("Duplicate fullForm: "+a.fullForm);
  if(short.has(a.shortForm))issues.push("Duplicate shortForm: "+a.shortForm);
  if(full.has(a.shortForm)||short.has(a.fullForm))issues.push("Alias chains and cycles are not permitted: "+a.fullForm+" / "+a.shortForm);
  if(sourceTokens.has(a.shortForm))issues.push("Short form already occurs in the source text and would make expansion ambiguous: "+a.shortForm);
  full.add(a.fullForm);short.add(a.shortForm);
 });
 return issues;
}
function replaceTokens(text:string,map:Map<string,string>):{text:string;count:number}{
 let count=0;
 const parts=text.split(/(\s+)/);
 const result=parts.map(part=>{if(!part||/^\s+$/.test(part))return part;const replacement=map.get(part);if(replacement===undefined)return part;count++;return replacement;});
 return{text:result.join(""),count};
}
export function expandArcaneText(compressedText:string,aliases:ArcaneTextAlias[]):{ok:boolean;text:string;issues:string[]}{
 if(typeof compressedText!=="string")return{ok:false,text:"",issues:["Compressed text must be a string."]};
 const issues=validate(compressedText,aliases);
 if(issues.length)return{ok:false,text:compressedText,issues};
 const inverse=new Map(aliases.map(a=>[a.shortForm,a.fullForm]));
 const parts=compressedText.split(/(\s+)/);
 const unknown=parts.filter(p=>p&&!/^\s+$/.test(p)&&p.startsWith("~")&&!inverse.has(p));
 if(unknown.length)return{ok:false,text:compressedText,issues:["Unknown reserved compression token(s): "+[...new Set(unknown)].join(", ")]};
 return{ok:true,text:replaceTokens(compressedText,inverse).text,issues:[]};
}
export function compressArcaneText(source:string,aliases:ArcaneTextAlias[],dictionaryIsShared=true):ArcaneTextCompressionResult{
 const issues=typeof source!=="string"?["Source text must be a string."]:validate(source,aliases);
 const base={profile:ARCANE_TEXT_COMPRESSION_PROFILE,originalText:typeof source==="string"?source:"",compressedText:typeof source==="string"?source:"",aliases:Array.isArray(aliases)?aliases.map(a=>({...a})):[],replacements:0,originalCharacters:typeof source==="string"?source.length:0,compressedCharacters:typeof source==="string"?source.length:0,charactersSaved:0,dictionaryCharacters:Array.isArray(aliases)?JSON.stringify(aliases).length:0,dictionaryIsShared,exactRoundTrip:false,parserInput:"EXPAND-BEFORE-PARSING" as const,executable:false as const,canonEffect:"NONE" as const,issues,limitation:LIMIT};
 if(issues.length)return{...base,disposition:"INVALID-DICTIONARY"};
 const forward=new Map(aliases.map(a=>[a.fullForm,a.shortForm]));
 const compressed=replaceTokens(source,forward);
 const expanded=expandArcaneText(compressed.text,aliases);
 const saved=source.length-compressed.text.length;
 return{...base,disposition:saved>0?"COMPRESSED":"NO-SAVING",compressedText:compressed.text,replacements:compressed.count,compressedCharacters:compressed.text.length,charactersSaved:saved,exactRoundTrip:expanded.ok&&expanded.text===source,issues:[]};
}
