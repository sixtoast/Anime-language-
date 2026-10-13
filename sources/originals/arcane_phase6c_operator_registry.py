#!/usr/bin/env python3
"""Arcane Phase 6C: provisional operator registry and typed semantics tests.
Audit notation only; not canonical spoken Arcane or a production compiler."""
from dataclasses import dataclass
import re
TOKEN=re.compile(r"\s*(?:(?P<ident>[A-Za-z_][A-Za-z0-9_-]*)|(?P<langle>⟨)|(?P<rangle>⟩)|(?P<comma>,))")
class ParseError(ValueError): pass
class TypeCheckError(ValueError): pass
@dataclass(frozen=True)
class Atom: value:str
@dataclass(frozen=True)
class Call: operator:str; args:tuple
class Parser:
 def __init__(self,s):
  self.tokens=[]; p=0
  while p<len(s):
   if s[p:].isspace(): break
   m=TOKEN.match(s,p)
   if not m: raise ParseError(f'Unexpected character at {p}: {s[p]!r}')
   k=next(k for k,v in m.groupdict().items() if v is not None); self.tokens.append((k,m.group(k))); p=m.end()
  if p<len(s) and not s[p:].isspace(): raise ParseError(f'Unexpected text at {p}')
  self.i=0
 def peek(self,k=None): return (False if k else None) if self.i>=len(self.tokens) else (self.tokens[self.i][0]==k if k else self.tokens[self.i])
 def take(self,k):
  if not self.peek(k): raise ParseError(f'Expected {k}; found {self.peek()}')
  v=self.tokens[self.i][1]; self.i+=1; return v
 def expr(self):
  n=self.take('ident')
  if not self.peek('langle'): return Atom(n)
  self.take('langle'); a=[]
  if not self.peek('rangle'):
   a.append(self.expr())
   while self.peek('comma'): self.take('comma'); a.append(self.expr())
  self.take('rangle'); return Call(n,tuple(a))
 def parse(self):
  x=self.expr()
  if self.i!=len(self.tokens): raise ParseError(f'Trailing token {self.peek()}')
  return x
@dataclass(frozen=True)
class Type:
 kind:str; dims:tuple=()
 def __str__(self):
  if self.kind!='Quantity': return self.kind
  names=('L','T','M','Θ'); parts=[n if e==1 else f'{n}^{e}' for n,e in zip(names,self.dims) if e]
  return 'Quantity['+'·'.join(parts or ['1'])+']'
def Q(l=0,t=0,m=0,th=0): return Type('Quantity',(l,t,m,th))
BOOL=Type('Boolean'); REL=Type('RelationCriterion'); VLEN=Type('Vector',(1,0,0,0)); VVEL=Type('Vector',(1,-1,0,0))
ENV={'A':Q(),'B':Q(),'LEN_A':Q(1),'LEN_B':Q(1),'TIME_A':Q(0,1),'MASS_A':Q(0,0,1),'VEL_A':Q(1,-1),'FORCE_A':Q(1,-2,1),'ENERGY_A':Q(2,-2,1),'TEMP_A':Q(0,0,0,1),'VEC_LEN_A':VLEN,'VEC_VEL_A':VVEL,'OBS_A':Type('Observation'),'BOOL_A':BOOL,'LT':REL,'LE':REL,'EQ':REL,'NE':REL,'GE':REL,'GT':REL,'MA':Type('UnitSymbol'),'SE':Type('UnitSymbol')}
ARITY={'FRAPA':2,'FRATA':2,'FRAKA':2,'FRALA':2,'FRASHA':1,'DRAN':1,'DREM':2,'DRIM':2,'DRAL':3,'GRAN':2,'GRAT':2,'GRAK':1,'BEK':2,'ZET':2,'KWAT':1}
def req(t,k,op):
 if t.kind!=k: raise TypeCheckError(f'{op} expects {k}; got {t}')
def check(n,env=None):
 env=ENV if env is None else env
 if isinstance(n,Atom):
  if n.value not in env: raise TypeCheckError(f'Unknown symbol: {n.value}')
  return env[n.value]
 op=n.operator; a=n.args
 if op in ARITY and len(a)!=ARITY[op]: raise TypeCheckError(f'{op} expects {ARITY[op]} arguments; got {len(a)}')
 ts=[check(x,env) for x in a]
 if op in ('FRAPA','FRATA'):
  x,y=ts; req(x,'Quantity',op); req(y,'Quantity',op)
  if x.dims!=y.dims: raise TypeCheckError(f'{op} requires matching dimensions; got {x} and {y}')
  return x
 if op in ('FRAKA','FRALA'):
  x,y=ts; req(x,'Quantity',op); req(y,'Quantity',op)
  dims=tuple(i+j if op=='FRAKA' else i-j for i,j in zip(x.dims,y.dims)); return Type('Quantity',dims)
 if op=='FRASHA':
  req(ts[0],'Quantity',op); return ts[0]
 if op=='DRAN':
  req(ts[0],'Vector',op); return Q(*ts[0].dims)
 if op in ('DREM','DRIM'):
  x,y=ts; req(x,'Vector',op); req(y,'Vector',op)
  dims=tuple(i+j for i,j in zip(x.dims,y.dims))
  if op=='DRIM': return Type('Vector',dims)
  return Q(*dims)
 if op=='DRAL':
  x,y,r=ts; req(x,'Quantity',op); req(y,'Quantity',op); req(r,'RelationCriterion',op)
  if x.dims!=y.dims: raise TypeCheckError(f'DRAL requires matching dimensions; got {x} and {y}')
  return BOOL
 if op in ('GRAN','GRAT'):
  req(ts[0],'Boolean',op); req(ts[1],'Boolean',op); return BOOL
 if op=='GRAK': req(ts[0],'Boolean',op); return BOOL
 if op in ('BEK','ZET'):
  raise TypeCheckError(f'{op} control-flow signature/evaluation semantics remain unresolved; blocked rather than guessed')
 if op in ('SIMA','NES','GAMA','DAVE','KWAM','KWAT','KWAK'): raise TypeCheckError(f'{op} signature/evaluation semantics not yet canonical; blocked rather than guessed')
 raise TypeCheckError(f'No canonical signature registered for {op}')
def tests():
 out=[]
 def t(i,n,f):
  try: ok,d=f()
  except Exception as e: ok,d=False,f'{type(e).__name__}: {e}'
  out.append((i,n,'PASS' if ok else 'FAIL',d))
 def ty(s): return check(Parser(s).parse())
 def err(s,part):
  try: ty(s)
  except (ParseError,TypeCheckError) as e: return part in str(e),str(e)
  return False,'No error raised'
 t('6B-01','Add compatible dimensions',lambda:(ty('FRAPA⟨LEN_A, LEN_B⟩')==Q(1),str(ty('FRAPA⟨LEN_A, LEN_B⟩'))))
 t('6B-02','Reject length plus time',lambda:err('FRAPA⟨LEN_A, TIME_A⟩','matching dimensions'))
 t('6B-03','Multiply length dimensions',lambda:(ty('FRAKA⟨LEN_A, LEN_B⟩')==Q(2),str(ty('FRAKA⟨LEN_A, LEN_B⟩'))))
 t('6B-04','Length divided by time is velocity',lambda:(ty('FRALA⟨LEN_A, TIME_A⟩')==Q(1,-1),str(ty('FRALA⟨LEN_A, TIME_A⟩'))))
 t('6B-05','Negation preserves dimensions',lambda:(ty('FRASHA⟨ENERGY_A⟩')==Q(2,-2,1),str(ty('FRASHA⟨ENERGY_A⟩'))))
 t('6B-06','Unit symbols are not quantities',lambda:err('FRAPA⟨MA, SE⟩','expects Quantity'))
 t('6B-07','Reject wrong arity',lambda:err('FRAPA⟨LEN_A⟩','expects 2 arguments'))
 t('6B-08','Reject unknown symbol',lambda:err('FRAPA⟨LEN_A, MISSING⟩','Unknown symbol'))
 t('6B-09','Block unresolved DAVE signature',lambda:err('DAVE⟨OBS_A, A⟩','not yet canonical'))
 t('6B-10','Boolean AND returns Boolean',lambda:(ty('GRAN⟨BOOL_A, BOOL_A⟩')==BOOL,str(ty('GRAN⟨BOOL_A, BOOL_A⟩'))))
 t('6B-11','Reject Boolean/numeric mismatch',lambda:err('GRAN⟨BOOL_A, A⟩','expects Boolean'))
 t('6B-12','Dot product combines dimensions',lambda:(ty('DREM⟨VEC_LEN_A, VEC_VEL_A⟩')==Q(2,-1),str(ty('DREM⟨VEC_LEN_A, VEC_VEL_A⟩'))))
 t('6C-13','Cross product returns a vector',lambda:(ty('DRIM⟨VEC_LEN_A, VEC_VEL_A⟩')==Type('Vector',(2,-1,0,0)),str(ty('DRIM⟨VEC_LEN_A, VEC_VEL_A⟩'))))
 t('6C-14','Comparison returns Boolean',lambda:(ty('DRAL⟨LEN_A, LEN_B, LT⟩')==BOOL,str(ty('DRAL⟨LEN_A, LEN_B, LT⟩'))))
 t('6C-15','Comparison rejects incompatible dimensions',lambda:err('DRAL⟨LEN_A, TIME_A, LT⟩','matching dimensions'))
 t('6C-16','Comparison rejects invalid criterion type',lambda:err('DRAL⟨LEN_A, LEN_B, BOOL_A⟩','expects RelationCriterion'))
 t('6C-17','IF control semantics remain blocked',lambda:err('BEK⟨BOOL_A, A⟩','semantics remain unresolved'))
 return out
if __name__=='__main__':
 r=tests()
 for x in r: print(' | '.join(x))
 print(f'RESULT: {sum(x[2]=="PASS" for x in r)}/{len(r)} passed')
