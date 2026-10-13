#!/usr/bin/env python3
"""Arcane Phase 5.8 provisional dimensional/frame type checker.
Not a complete parser/compiler and does not execute magic.
Audit atoms: Q[length], Q[time], Q[mass], Q[velocity], Q[energy], Q[dimensionless]
Vectors: V3[length;caster], V3[velocity;world], etc. Expressions use OP⟨...,...⟩.
"""
import re, sys
from dataclasses import dataclass

ALIASES={'frata':'fraja','fraka':'frama','drim':'drum','dral':'dras','grak':'grash','kwak':'kwash','ren':'ben'}
# Dimension vectors: (length, time, mass, temperature). Energy = M L^2 T^-2.
DIMS={'dimensionless':(0,0,0,0),'length':(1,0,0,0),'area':(2,0,0,0),'volume':(3,0,0,0),'time':(0,1,0,0),'mass':(0,0,1,0),'velocity':(1,-1,0,0),'acceleration':(1,-2,0,0),'force':(1,-2,1,0),'energy':(2,-2,1,0),'temperature':(0,0,0,1),'pressure':(-1,-2,1,0),'momentum':(1,-1,1,0)}
@dataclass(frozen=True)
class Ty:
 kind:str; dim:tuple|None=None; frame:str|None=None
 def __str__(self):
  if self.kind=='Q': return 'Q['+next((k for k,v in DIMS.items() if v==self.dim),dim_label(self.dim))+']'
  if self.kind=='V3': return 'V3['+next((k for k,v in DIMS.items() if v==self.dim),dim_label(self.dim))+';'+str(self.frame)+']'
  return self.kind
def dim_label(d):
 parts=[]
 for name,power in zip(('L','T','M','Theta'),d):
  if power: parts.append(name if power==1 else f'{name}^{power}')
 return ' '.join(parts) if parts else 'dimensionless'
BOOL=Ty('Bool'); COMP=Ty('Comparable'); CRIT=Ty('Criterion')
def atom(s):
 s=s.strip()
 m=re.fullmatch(r'Q\[([a-z]+)\]',s,re.I)
 if m and m.group(1).lower() in DIMS: return Ty('Q',DIMS[m.group(1).lower()])
 m=re.fullmatch(r'V3\[([a-z]+);(world|caster|local)\]',s,re.I)
 if m and m.group(1).lower() in DIMS: return Ty('V3',DIMS[m.group(1).lower()],m.group(2).lower())
 if s.lower() in ('bool','boolean'): return BOOL
 if s.lower()=='comparable': return COMP
 if s.lower()=='criterion': return CRIT
 raise ValueError(f'unknown typed atom {s!r}')
def split(s):
 out=[]; start=0; depth=0
 for i,c in enumerate(s):
  if c=='⟨': depth+=1
  elif c=='⟩': depth-=1
  elif c==',' and depth==0: out.append(s[start:i].strip()); start=i+1
  if depth<0: raise ValueError('unbalanced closing bracket')
 if depth: raise ValueError('unbalanced brackets')
 tail=s[start:].strip()
 if tail or out: out.append(tail)
 return out
def parse(s):
 s=s.strip()
 if '⟨' not in s: return atom(s)
 m=re.fullmatch(r'([A-Za-z][A-Za-z0-9]*)⟨(.*)⟩',s)
 if not m: raise ValueError('malformed expression; expected OP⟨...⟩')
 op=m.group(1).lower(); op=ALIASES.get(op,op); args=[parse(x) for x in split(m.group(2))]
 def arity(n):
  if len(args)!=n: raise ValueError(f'{op.upper()} expects {n} arguments, got {len(args)}')
 if op in ('frapa','fraja'):
  arity(2); a,b=args
  if a.kind!='Q' or b.kind!='Q': raise ValueError(f'{op.upper()} requires quantities')
  if a.dim!=b.dim: raise ValueError(f'{op.upper()} requires matching dimensions; got {a} and {b}')
  return a
 if op=='frama':
  arity(2); a,b=args
  if a.kind!='Q' or b.kind!='Q': raise ValueError('FRAMA requires quantities')
  return Ty('Q',tuple(x+y for x,y in zip(a.dim,b.dim)))
 if op=='frala':
  arity(2); a,b=args
  if a.kind!='Q' or b.kind!='Q': raise ValueError('FRALA requires quantities')
  if b.dim==DIMS['dimensionless'] and b.kind=='Q': pass # dimensionless denominator allowed; zero is a runtime value check
  return Ty('Q',tuple(x-y for x,y in zip(a.dim,b.dim)))
 if op=='dran':
  arity(1); a=args[0]
  if a.kind!='V3': raise ValueError('DRAN requires a vector')
  return Ty('Q',a.dim)
 if op=='drem':
  arity(2); a,b=args
  if a.kind!='V3' or b.kind!='V3': raise ValueError('DREM requires vectors')
  if a.frame!=b.frame: raise ValueError(f'DREM requires a common frame; got {a.frame} and {b.frame}')
  return Ty('Q',tuple(x+y for x,y in zip(a.dim,b.dim)))
 if op=='drum':
  arity(2); a,b=args
  if a.kind!='V3' or b.kind!='V3': raise ValueError('DRUM requires 3D vectors')
  if a.frame!=b.frame: raise ValueError(f'DRUM requires a common frame; got {a.frame} and {b.frame}')
  return Ty('V3',tuple(x+y for x,y in zip(a.dim,b.dim)),a.frame)
 if op=='dras':
  arity(3); a,b,c=args
  if c.kind!='Criterion': raise ValueError('DRAS third argument must be Criterion')
  if a!=b: raise ValueError(f'DRAS operands must have compatible types; got {a} and {b}')
  return BOOL
 if op=='grash':
  arity(1)
  if args[0].kind!='Bool': raise ValueError('GRASH requires Boolean')
  return BOOL
 raise ValueError(f'no Phase 5.8 signature for {op.upper()}')
def main():
 if len(sys.argv)!=2: print(__doc__); return 2
 try: print('PASS | type = '+str(parse(sys.argv[1]))); return 0
 except ValueError as e: print('REJECT | '+str(e)); return 1
if __name__=='__main__': raise SystemExit(main())
