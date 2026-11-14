"""Arcane Phase 5.13 minimal audit parser/validator.
Audit-only notation; not canonical spoken syntax or a production compiler.
Supported literals: Q<number,dimension>, B<true|false>, V<dimension,frame>, ID<number>, and nested OP<arg,...>.
"""
from dataclasses import dataclass
from fractions import Fraction
import re, json, sys
from pathlib import Path

REGISTRY_PATH = Path(__file__).with_name('Arcane_Phase_5_12_Operator_Registry.json')
REGISTRY = json.loads(REGISTRY_PATH.read_text())
OPS = {x['form']: x for x in REGISTRY['operators']}
ALIASES = {alias: r['form'] for r in REGISTRY['operators'] for alias in r['aliases'].split(';') if alias}

@dataclass
class Node:
    kind: str
    value: object = None
    args: tuple = ()
    typ: str = ''
    dim: str = ''
    frame: str = ''

class ParseError(ValueError): pass
class TypeErrorArcane(ValueError): pass

# A tiny recursive parser for audit notation.
TOKEN = re.compile(r'\s*(Q|B|V|ID|[a-zə]+|[0-9]+(?:\.[0-9]+)?|[<>,])', re.I)
def tokenize(s):
    out=[]; pos=0
    while pos < len(s):
        m=TOKEN.match(s,pos)
        if not m:
            if s[pos:].strip()=='' : break
            raise ParseError(f'Unexpected text at offset {pos}: {s[pos:pos+16]!r}')
        out.append(m.group(1)); pos=m.end()
    return out

class Parser:
    def __init__(self,s): self.t=tokenize(s); self.i=0
    def peek(self): return self.t[self.i] if self.i<len(self.t) else None
    def pop(self):
        x=self.peek()
        if x is None: raise ParseError('Unexpected end of expression')
        self.i+=1; return x
    def expect(self,x):
        got=self.pop()
        if got.lower()!=x.lower(): raise ParseError(f'Expected {x}, got {got}')
    def parse(self):
        n=self.expr()
        if self.peek() is not None: raise ParseError(f'Trailing token {self.peek()}')
        return n
    def expr(self):
        name=self.pop()
        low=name.lower()
        if low in ('q','b','v','id'):
            self.expect('<'); a=self.pop()
            if low=='q':
                self.expect(','); dim=self.pop(); self.expect('>')
                try: val=Fraction(a)
                except Exception: raise ParseError(f'Invalid quantity numeral {a}')
                return Node('literal',val,typ='Quantity',dim=dim)
            if low=='b':
                self.expect('>')
                if a.lower() not in ('true','false'): raise ParseError('Boolean must be true or false')
                return Node('literal',a.lower()=='true',typ='Boolean')
            if low=='v':
                self.expect(','); frame=self.pop(); self.expect('>')
                return Node('literal',None,typ='Vector',dim=a,frame=frame)
            self.expect('>')
            if not a.isdigit(): raise ParseError('Binding identifier must be a non-negative integer in audit notation')
            return Node('literal',int(a),typ='Identifier')
        canonical=ALIASES.get(low,low)
        if canonical not in OPS: raise ParseError(f'Unknown operator {name}')
        self.expect('<'); args=[]
        if self.peek()!='>':
            args.append(self.expr())
            while self.peek()==',': self.pop(); args.append(self.expr())
        self.expect('>')
        return Node('operator',canonical,tuple(args))

def infer(n, strict=True):
    if n.kind=='literal': return n
    op=OPS[n.value]
    if strict and ('OPEN' in op['status'] or 'PROVISIONAL' in op['status'] or 'PROPOSED' in op['status']):
        raise TypeErrorArcane(f'{n.value.upper()} has no fully locked signature in strict mode ({op["status"]})')
    # For the currently testable arithmetic subset, arity and dimensions are explicit.
    args=tuple(infer(a,strict) for a in n.args)
    arity=op['arity']
    if isinstance(arity,int) and len(args)!=arity: raise TypeErrorArcane(f'{n.value.upper()} expects {arity} arguments, got {len(args)}')
    if n.value in ('frapa','fraja'):
        if any(a.typ!='Quantity' for a in args): raise TypeErrorArcane(f'{n.value.upper()} requires quantities')
        if args[0].dim!=args[1].dim: raise TypeErrorArcane(f'{n.value.upper()} requires matching dimensions')
        return Node('operator',n.value,args,typ='Quantity',dim=args[0].dim)
    if n.value=='frama':
        if any(a.typ!='Quantity' for a in args): raise TypeErrorArcane('FRAMA requires quantities')
        return Node('operator',n.value,args,typ='Quantity',dim=f'{args[0].dim}*{args[1].dim}')
    if n.value=='frala':
        if any(a.typ!='Quantity' for a in args): raise TypeErrorArcane('FRALA requires quantities')
        if args[1].value==0: raise TypeErrorArcane('Division by zero')
        return Node('operator',n.value,args,typ='Quantity',dim=f'{args[0].dim}/{args[1].dim}')
    if n.value=='frasha':
        if len(args)!=1 or args[0].typ!='Quantity': raise TypeErrorArcane('FRASHA requires one quantity')
        return Node('operator',n.value,args,typ='Quantity',dim=args[0].dim)
    if n.value in ('gran','grat'):
        if any(a.typ!='Boolean' for a in args): raise TypeErrorArcane(f'{n.value.upper()} requires Booleans')
        return Node('operator',n.value,args,typ='Boolean')
    if n.value=='grash':
        if len(args)!=1 or args[0].typ!='Boolean': raise TypeErrorArcane('GRASH requires one Boolean')
        return Node('operator',n.value,args,typ='Boolean')
    # Not yet safely inferable: fail closed even in non-strict mode.
    raise TypeErrorArcane(f'{n.value.upper()} has no implemented type rule')

def check(source, strict=True):
    ast=Parser(source).parse()
    return infer(ast,strict)

if __name__=='__main__':
    for s in sys.argv[1:]:
        try:
            n=check(s,strict=False); print('PASS',s,'=>',n.typ,n.dim)
        except Exception as e: print('REJECT',s,'=>',e)
